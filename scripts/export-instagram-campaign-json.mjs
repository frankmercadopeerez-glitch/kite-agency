import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'social', 'instagram', 'campana-30-dias-2026-09-24');
const markdown = await fs.readFile(path.join(dir, 'CAPTIONS.md'), 'utf8');
const entries = [...markdown.matchAll(/^## (\d+)\. (.+)\n\nFecha: ([^\n]+)\n\nArchivo: ([^\n]+)\n\n([\s\S]*?)(?=\n## \d+\.|$)/gm)].map(match => ({
  number: Number(match[1]),
  title: match[2].trim(),
  schedule: match[3].trim(),
  file: match[4].trim(),
  caption: match[5].trim(),
}));
if (entries.length !== 30) throw new Error(`Expected 30 entries, found ${entries.length}`);
await fs.writeFile(path.join(dir, 'campaign.json'), JSON.stringify(entries, null, 2), 'utf8');
console.log(`Exported ${entries.length} campaign entries.`);
