import fs from 'node:fs';
import path from 'node:path';
import {guideCopy,clusters,articleRedirects,guideRelations} from './editorial/index.mjs';
const root=path.resolve(import.meta.dirname,'..');
const errors=[],report={guides:0,locales:Object.keys(guideCopy),identicalParagraphs:0,maxPairSimilarity:0,comparisons:0,redirects:0,indexedPages:0};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const routes=JSON.parse(read('vercel.json')).redirects.filter(r=>!r.has);
const redirects=new Map(routes.map(r=>[r.source,r.destination]));
const url=(lang,slug)=>`${lang==='es'?'':'/'+lang}/blog/${slug}/`;
const tokens=text=>new Set((text.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]).filter(t=>t.length>3));
const paragraphs=new Map();
for(const [lang,entries] of Object.entries(guideCopy)){
 const titles=new Set(),descs=new Set(),sets=[];
 for(const [slug,c] of Object.entries(entries)){
  const route=url(lang,slug),html=read(route.slice(1)+'index.html');report.guides++;
  for(const [field,set] of [['title',titles],['desc',descs]]){if(set.has(c[field]))errors.push(`${route}: duplicate ${field}`);set.add(c[field]);}
  if(!html.includes('data-guide="'+slug+'"'))errors.push(`${route}: missing authored article`);
  if(/class="[^"]*(?:guide-depth|interactive-checklist)|"@type":"FAQPage"/.test(html))errors.push(`${route}: generic filler/schema returned`);
  if(!html.includes('href="https://kitecartagena.com'+route+'"'))errors.push(`${route}: canonical missing`);
  const alts=[...html.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)];
  const available=Object.keys(guideCopy).filter(lang=>guideCopy[lang][slug]);
  if(alts.length!==available.length+1)errors.push(`${route}: incorrect available alternates`);
  for(const targetLang of available)if(!alts.some(m=>m[2]==='https://kitecartagena.com'+url(targetLang,slug)))errors.push(`${route}: missing ${targetLang} alternate`);
  if((html.match(/<h1\b/g)||[]).length!==1)errors.push(`${route}: heading count`);
  if((html.match(/class="editorial-section"/g)||[]).length!==c.sections.length)errors.push(`${route}: missing sections`);
  for(const related of guideRelations[slug])if(!html.includes('href="'+url(lang,related)+'"'))errors.push(`${route}: missing related ${related}`);
  for(const [heading,p] of c.sections){
   const normalized=p.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
   const key=lang+':'+normalized;
   if(paragraphs.has(key)){report.identicalParagraphs++;errors.push(`${route}: paragraph duplicated from ${paragraphs.get(key)}`)}
   paragraphs.set(key,route);
   if(!heading||p.length<45)errors.push(`${route}: incomplete editorial section`);
  }
  sets.push([slug,tokens(c.sections.map(x=>x[1]).join(' '))]);
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])['@graph']||[]);
  const article=schemas.find(x=>x['@type']==='BlogPosting');
  if(article?.headline!==c.title||article?.url!=='https://kitecartagena.com'+route)errors.push(`${route}: schema mismatch`);
  if(!schemas.some(x=>x['@type']==='BreadcrumbList'))errors.push(`${route}: no breadcrumb schema`);
 }
 for(let i=0;i<sets.length;i++)for(let j=i+1;j<sets.length;j++){
  const [a,x]=sets[i],[b,y]=sets[j],intersection=[...x].filter(t=>y.has(t)).length,score=intersection/(x.size+y.size-intersection||1);
  report.comparisons++;report.maxPairSimilarity=Math.max(report.maxPairSimilarity,score);
  if(score>.5)errors.push(`${lang}: excessive lexical overlap ${a}/${b}: ${score.toFixed(3)}`);
 }
 for(const [old,target] of Object.entries(articleRedirects)){
  const source=url(lang,old),destination=url(lang,target);
  if(redirects.get(source)!==destination)errors.push(`${source}: redirect missing`);
 }
}
const sitemap=read('sitemap.xml'),locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
for(const route of locs){
 report.indexedPages++;
 if(redirects.has(route))errors.push(`${route}: retired route in sitemap`);
 const html=read(route.slice(1)+'index.html');
 if(!html.includes('sizes="48x48" href="/icons/favicon-48.png?v=20260915"'))errors.push(`${route}: inconsistent favicon`);
 if(/name="robots" content="noindex/.test(html))errors.push(`${route}: indexed noindex page`);
 for(const [,href] of html.matchAll(/href="([^"?#]+)(?:[?#][^"]*)?"/g)){
  if(redirects.has(href))errors.push(`${route}: internal redirect hop ${href}`);
 }
}
for(const [source,destination] of redirects){
 report.redirects++;
 if(redirects.has(destination))errors.push(`${source}: redirect chain`);
 if(!locs.includes(destination))errors.push(`${source}: destination not indexed ${destination}`);
 if(!source.endsWith('/'))continue;
 const html=read(source.slice(1)+'index.html');
 if(!html.includes('noindex,follow')||!html.includes('content="0;url='+destination+'"'))errors.push(`${source}: stale redirect fallback`);
}
report.maxPairSimilarity=+report.maxPairSimilarity.toFixed(3);
report.errors=errors;
fs.mkdirSync(path.join(root,'.qa'),{recursive:true});
fs.writeFileSync(path.join(root,'.qa/editorial-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
process.exitCode=errors.length?1:0;
