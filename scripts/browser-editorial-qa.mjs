import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
import {guideCopy,articleRedirects} from './editorial/index.mjs';
const root=path.resolve(import.meta.dirname,'..'),base=process.env.SITE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
const failures=[],stats={mobileArticles:0,desktopArticles:0,wideArticles:0,redirects:0,interactions:0};
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
page.on('pageerror',e=>failures.push('JS: '+e.message));
for(const [lang,entries] of Object.entries(guideCopy))for(const slug of Object.keys(entries)){
 const route=`${lang==='es'?'':'/'+lang}/blog/${slug}/`,response=await page.goto(base+route,{waitUntil:'load'});
 stats.mobileArticles++;
 const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,sections:document.querySelectorAll('.editorial-section').length,hidden:[...document.querySelectorAll('.editorial-section')].some(e=>getComputedStyle(e).display==='none'),brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),favicon:document.querySelector('link[rel="icon"]')?.href}));
 if(!response.ok()||state.overflow||state.hidden||state.sections<4||state.brokenImages.length||!state.favicon?.includes('favicon-48.png'))failures.push({route,...state});
 if(lang==='es'){
  await page.setViewportSize({width:1366,height:768});stats.desktopArticles++;
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push(route+' desktop overflow');
  if(['best-time','first-lesson','kite-repair'].includes(slug)){
   await page.setViewportSize({width:1920,height:900});stats.wideArticles++;
   await page.screenshot({path:path.join(root,`.qa/editorial-${slug}-wide.png`)});
  }
  await page.setViewportSize({width:390,height:844});
  if(['best-time','first-lesson','kite-repair'].includes(slug)){
   await page.locator('.article-contents a').nth(1).click();stats.interactions++;
   const top=await page.locator('#section-2').evaluate(e=>e.getBoundingClientRect().top);
   if(top<60||top>220)failures.push(route+' anchor obscured or misplaced: '+top);
   await page.screenshot({path:path.join(root,`.qa/editorial-${slug}-mobile.png`)});
  }
 }
}
// Real permanent HTTP responses, not only meta refresh fallbacks.
for(const [old,target] of Object.entries(articleRedirects)){
 const r=await fetch(base+'/blog/'+old+'/',{redirect:'manual'});stats.redirects++;
 if(r.status!==308||r.headers.get('location')!=='/blog/'+target+'/')failures.push('HTTP redirect '+old);
}
await page.goto(base+'/blog/');
await page.locator('#blog-search').fill('desgarros');stats.interactions++;
// Search uses title + description, so the pressure-loss guide must be found.
if(await page.locator('#article-library .blog-card:visible').count()!==1)failures.push('Search did not return the single pressure-loss guide');
await page.locator('#blog-search').fill('zzzz-no-match');stats.interactions++;
if(!await page.locator('#blog-empty').isVisible())failures.push('Empty search message missing');
await page.locator('#blog-search').fill('');
await page.locator('.category-filter button[data-category="gear"]').click();stats.interactions++;
const categories=await page.locator('#article-library .blog-card:visible').evaluateAll(els=>els.map(e=>e.dataset.category));
if(!categories.length||categories.some(c=>c!=='gear'))failures.push('Category filter mismatch');
await page.locator('.category-filter button[data-category="all"]').click();
await page.locator('#blog-pages button').nth(1).click();stats.interactions++;
if((await page.locator('#blog-pages button[aria-current="page"]').textContent())!=='2')failures.push('Pagination did not advance');
await page.locator('#article-library .blog-card:visible').first().scrollIntoViewIfNeeded();
await page.screenshot({path:path.join(root,'.qa/editorial-blog-mobile.png')});
await page.goto(base+'/blog/first-lesson/');
await page.locator('.language summary').click();
await page.locator('.language-menu a[href="/en/blog/first-lesson/"]').click();stats.interactions++;
if(new URL(page.url()).pathname!=='/en/blog/first-lesson/')failures.push('Language switch changed topic');
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:1366,height:768}});
await nojs.goto(base+'/blog/');
const readable=await nojs.locator('.blog-card').evaluateAll(els=>new Set(els.map(e=>e.getAttribute('href'))).size);
if(readable!==Object.keys(guideCopy.es).length)failures.push('No-JS blog links: '+readable);
await nojs.goto(base+'/blog/first-lesson/');
if(!await nojs.locator('.editorial-body').isVisible())failures.push('Article requires JavaScript to read');
await browser.close();
const report={...stats,failures};fs.writeFileSync(path.join(root,'.qa/browser-editorial.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));process.exitCode=failures.length?1:0;
