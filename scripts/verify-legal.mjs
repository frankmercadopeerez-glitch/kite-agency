import fs from 'node:fs';
import {chromium} from 'playwright';
import {sections} from './legal/terms-es.mjs';
const base=process.env.SITE_URL||'http://127.0.0.1:4173',route='/terminos-y-condiciones/',failures=[];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({reducedMotion:'reduce'});page.on('pageerror',e=>failures.push(e.message));
for(const [width,height] of [[390,844],[1366,768],[1920,900]]){
 await page.setViewportSize({width,height});const response=await page.goto(base+route);
 if(!response.ok()||await page.locator('h1').count()!==1)failures.push(width+': page or heading');
 if(await page.locator('.legal-section').count()!==28)failures.push(width+': sections');
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push(width+': overflow');
 const text=await page.locator('.legal-document').textContent();
 if(!text.includes('Nohemi Carrillo Sánchez')||!text.includes('700555590-5')||text.includes('Dunas y Olas SAS'))failures.push(width+': identity');
 for(const [,heading,paragraphs] of sections)if(!text.includes(heading)||paragraphs.some(p=>!text.includes(p)))failures.push(width+': incomplete text '+heading);
 await page.locator('.legal-contents a[href="#retracto"]').click();
 const top=await page.locator('#retracto').evaluate(e=>e.getBoundingClientRect().top);if(top<60||top>200)failures.push(width+': anchor under header '+top);
 await page.screenshot({path:'.qa/legal-'+width+'.png'});
}
await page.emulateMedia({media:'print'});
if(await page.locator('.site-header').isVisible()||await page.locator('.legal-actions').isVisible())failures.push('Print contains navigation');
await page.pdf({path:'.qa/terminos-kite-cartagena.pdf',format:'A4',printBackground:false});
await page.emulateMedia({media:'screen'});
for(const p of ['/','/en/','/blog/lesson-budget/','/en/blog/lesson-budget/','/ja/blog/']){
 await page.goto(base+p);
 const link=page.locator('.site-footer a[href="'+route+'"]');if(await link.count()!==1)failures.push(p+': missing footer terms');
 await link.click();if(new URL(page.url()).pathname!==route)failures.push(p+': footer destination');
}
const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(base+route);
if(await nojs.locator('.legal-section').count()!==28)failures.push('No-JS legal content missing');
await browser.close();const report={base,sections:28,viewports:3,footerFlows:5,failures};fs.writeFileSync('.qa/legal-verification.json',JSON.stringify(report,null,2));console.log(report);process.exitCode=failures.length?1:0;
