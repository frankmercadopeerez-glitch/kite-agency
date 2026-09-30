import fs from 'node:fs';
import crypto from 'node:crypto';
import {guideCopy,articleDetails} from './editorial/index.mjs';
const base='https://kitecartagena.com',errors=[],report={base,pages:0,articles:0,redirects:0,assets:0,platformNormalizations:[],errors};
const urls=[...fs.readFileSync('sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const local=p=>fs.readFileSync('.'+p+'index.html','utf8').replace(/\r\n/g,'\n');
async function pool(items,fn){let cursor=0;await Promise.all(Array.from({length:8},async()=>{while(cursor<items.length){const item=items[cursor++];await fn(item)}}));}
await pool(urls,async route=>{
 try{
  const r=await fetch(base+route);const html=(await r.text()).replace(/\r\n/g,'\n');report.pages++;
  if(!r.ok)errors.push(`${route}: ${r.status}`);
  if(html!==local(route))errors.push(`${route}: deployed HTML differs from local build`);
  if(!html.includes('href="/icons/favicon-48.png?v=20260915"'))errors.push(`${route}: favicon missing`);
  if(route.includes('/blog/')&&route.split('/').filter(Boolean).at(-1)!=='blog')report.articles++;
 }catch(e){errors.push(route+': '+e.message)}
});
const redirects=JSON.parse(fs.readFileSync('vercel.json','utf8')).redirects.filter(r=>!r.has);
await pool(redirects,async rule=>{
 try{const r=await fetch(base+rule.source,{redirect:'manual'});report.redirects++;
  const destination=new URL(r.headers.get('location')||'/',base).pathname;
  if(r.status===308&&['/about.html','/experiences.html','/terms.html'].includes(rule.source)&&destination===rule.source.replace('.html','/')){
   const next=await fetch(base+destination,{redirect:'manual'});
   if(next.status!==308||new URL(next.headers.get('location')||'/',base).pathname!==rule.destination)errors.push(`${rule.source}: broken normalized destination`);
   else report.platformNormalizations.push({source:rule.source,via:destination,destination:rule.destination});
  }else if(r.status!==308||destination!==rule.destination)errors.push(`${rule.source}: ${r.status} ${destination}`);
 }catch(e){errors.push(rule.source+': '+e.message)}
});
for(const file of ['icons/favicon-48.png','favicon.ico','icons/apple-touch-icon.png','assets/budget.js','assets/editorial.css','sitemap.xml','robots.txt']){
 const r=await fetch(base+'/'+file),remote=Buffer.from(await r.arrayBuffer()),source=fs.readFileSync(file);report.assets++;
 const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
 const comparable=/\.(?:css|js|xml|txt)$/i.test(file)?x=>Buffer.from(x.toString('utf8').replace(/\r\n/g,'\n')):x=>x;
 if(!r.ok||hash(comparable(remote))!==hash(comparable(source)))errors.push(file+': production asset mismatch');
}
report.spanishArticles=Object.keys(guideCopy.es).length;
report.englishArticles=Object.keys(guideCopy.en).length;
report.specializedArticles=Object.keys(articleDetails).length;
fs.mkdirSync('.qa',{recursive:true});fs.writeFileSync('.qa/production-release.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));process.exitCode=errors.length?1:0;
