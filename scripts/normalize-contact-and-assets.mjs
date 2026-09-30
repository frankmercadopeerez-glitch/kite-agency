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
  html = html.replaceAll('https://kite-agency.vercel.app', 'https://kitecartagena.com');
  // Includes older .html aliases and the internal social preview, not just generated routes.
  html = html.replace(/<link\b[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/gi, '');
  html = html.replace('</head>', '<link rel="icon" type="image/png" sizes="48x48" href="/icons/favicon-48.png?v=20260915"><link rel="icon" type="image/x-icon" href="/favicon.ico?v=20260915"><link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png?v=20260915"></head>');
  html = html.replaceAll('573044301112', '573163030589').replaceAll('+573044301112', '+573163030589').replaceAll('+57 304 430 1112', '+57 316 303 0589');
  if (html.includes('/assets/multilingual.css') && !html.includes('/assets/content.css')) {
    html = html.replace('<link rel="stylesheet" href="/assets/multilingual.css">', '<link rel="stylesheet" href="/assets/multilingual.css"><link rel="stylesheet" href="/assets/content.css">');
  }
  fs.writeFileSync(file, html.replace(/[ \t]+$/gm, ''));
}

console.log(`Normalized contact and assets in ${htmlFiles.length} HTML files.`);
