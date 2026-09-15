import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'research') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replaceAll('573044301112', '573163030589').replaceAll('+573044301112', '+573163030589').replaceAll('+57 304 430 1112', '+57 316 303 0589');
  if (html.includes('/assets/multilingual.css') && !html.includes('/assets/content.css')) {
    html = html.replace('<link rel="stylesheet" href="/assets/multilingual.css">', '<link rel="stylesheet" href="/assets/multilingual.css"><link rel="stylesheet" href="/assets/content.css">');
  }
  fs.writeFileSync(file, html);
}

console.log(`Normalized contact and assets in ${htmlFiles.length} HTML files.`);
