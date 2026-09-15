import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith(".html")) htmlFiles.push(target);
  }
}

walk(root);
const errors = [];
const warnings = [];
const canonicalUrls = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].replace(/\s+/g, " ").trim() ?? "";
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i)?.[1].replace(/\s+/g, " ").trim() ?? "";
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1] ?? "";
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  if (!title || title.length > 65) errors.push(`${rel}: title missing or longer than 65 characters (${title.length})`);
  if (!description || description.length > 165) errors.push(`${rel}: description missing or longer than 165 characters (${description.length})`);
  if (h1Count !== 1) errors.push(`${rel}: expected one H1, found ${h1Count}`);
  if (!canonical.startsWith("https://kitecartagena.com")) errors.push(`${rel}: invalid canonical ${canonical || "missing"}`);
  if (canonicalUrls.has(canonical)) errors.push(`${rel}: duplicate canonical ${canonical}`);
  canonicalUrls.add(canonical);
  if (!/property=["']og:image["']/i.test(html)) errors.push(`${rel}: missing og:image`);
  if (!/name=["']twitter:card["']/i.test(html)) errors.push(`${rel}: missing twitter card`);
  if (!/rel=["']manifest["']/i.test(html)) errors.push(`${rel}: missing web manifest`);
  if (!/id=["']main-content["']/i.test(html)) errors.push(`${rel}: skip link has no main-content target`);
  if (/onclick=["']toggleMobileMenu\(this\)["']/i.test(html) && /function\s+toggleMobileMenu\(\)/i.test(html)) errors.push(`${rel}: mobile menu button and handler arguments do not match`);
  if (/cdn\.tailwindcss\.com/i.test(html)) errors.push(`${rel}: Tailwind CDN must not be used in production`);
  if (/href=["']#["']/i.test(html)) warnings.push(`${rel}: contains placeholder link`);

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref)) continue;
    const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!clean) continue;
    const target = clean.startsWith("/") ? path.join(root, clean.slice(1)) : path.resolve(path.dirname(file), clean);
    const candidates = [target, path.join(target, "index.html")];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) errors.push(`${rel}: missing local target ${ref}`);
  }

  for (const json of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(json[1]);
    } catch (error) {
      errors.push(`${rel}: invalid JSON-LD (${error.message})`);
    }
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const canonical of canonicalUrls) {
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`sitemap.xml: missing ${canonical}`);
}

console.log(`Audited ${htmlFiles.length} HTML pages.`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
console.log(`${errors.length} errors, ${warnings.length} warnings.`);
process.exitCode = errors.length ? 1 : 0;
