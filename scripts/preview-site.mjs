// Local preview only. Reproduces configured permanent redirects for verification.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const redirects=new Map(JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).redirects.map(r=>[r.source,r.destination]));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.xml':'application/xml','.webmanifest':'application/manifest+json'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost'),route=decodeURIComponent(url.pathname);
 if(route.split('/').some(segment=>segment.startsWith('.')||segment==='node_modules')){res.writeHead(403);return res.end()}
 if(redirects.has(route)){res.writeHead(308,{Location:redirects.get(route)+url.search});return res.end()}
 let file=path.resolve(root,'.'+route);
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end()}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.writeHead(404);return res.end('Not found')}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
 fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:'+(process.env.PORT||4173)));
