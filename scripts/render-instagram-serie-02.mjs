import path from 'node:path';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const root=process.cwd();
const output=path.join(root,'social','instagram','serie-02-2026-09-22');
const previewPort=process.env.SITE_PORT||'4173';
const items=[
 ['07-acompanamiento-en-el-agua.png','/images/grupal.webp','50% 54%'],
 ['08-progresion-tecnica.png','/images/woman.webp','47% 48%'],
 ['09-nivel-avanzado.png','/images/jump.webp','48% 50%'],
];
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
for(const [file,src,position] of items){
 const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><style>*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:#102a38}img{display:block;width:100%;height:100%;object-fit:cover;object-position:${position};filter:saturate(.94) contrast(1.02)}</style><img src="http://127.0.0.1:${previewPort}${src}">`);
 await page.locator('img').waitFor({state:'visible'});
 await page.locator('img').evaluate(img=>img.decode());
 await page.screenshot({path:path.join(output,file)});
 await page.close();
}
await browser.close();
console.log(`Rendered ${items.length} Instagram posts at 1080x1350.`);
