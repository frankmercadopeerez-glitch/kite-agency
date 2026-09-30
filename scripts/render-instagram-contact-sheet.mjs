import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = process.cwd();
const campaign = path.join(root, 'social', 'instagram', 'campana-30-dias-2026-09-24');
const posts = (await fs.readdir(path.join(campaign, 'posts'))).filter(name => name.endsWith('.png')).sort();
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html><style>html,body{margin:0;background:#e9e5de;font-family:Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:12px}.item{position:relative;aspect-ratio:4/5;overflow:hidden;background:#ccc}.item img{width:100%;height:100%;object-fit:cover}.item span{position:absolute;left:8px;top:8px;background:#fff;color:#111;font-weight:700;font-size:16px;padding:5px 8px}</style><div class="grid">${posts.map((name, i) => `<div class="item"><img src="http://127.0.0.1:4174/social/instagram/campana-30-dias-2026-09-24/posts/${name}"><span>${i + 1}</span></div>`).join('')}</div>`);
await page.locator('img').first().waitFor({ state: 'visible' });
await Promise.all(await page.locator('img').evaluateAll(images => images.map(img => img.decode())));
await page.screenshot({ path: path.join(campaign, 'contact-sheet.png'), fullPage: true });
await browser.close();
console.log(`Rendered contact sheet with ${posts.length} posts.`);
