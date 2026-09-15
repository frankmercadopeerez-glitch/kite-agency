import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const domain = "https://kitecartagena.com";
const metadata = {
  "index.html": {
    title: "Kitesurf Cartagena | Lessons at La Boquilla",
    description: "Book private kitesurf lessons, courses, gear rental and water sports in Cartagena. Bilingual instruction at La Boquilla for every level.",
  },
  "about.html": {
    title: "About Kite Cartagena | Local Kitesurf Instructors",
    description: "Meet the Kite Cartagena team and learn how our local instructors approach kitesurf lessons, safety and personalized coaching at La Boquilla.",
  },
  "experiences.html": {
    title: "Kitesurf Lessons & Prices in Cartagena | Kite Cartagena",
    description: "Compare kitesurf lessons, complete courses, foil sessions, SUP, gear rental and guided experiences in Cartagena. Ask about dates on WhatsApp.",
  },
  "terms.html": {
    title: "Booking Terms & Privacy | Kite Cartagena",
    description: "Read Kite Cartagena booking, cancellation, weather, safety, liability and privacy terms before reserving a kitesurf or water sports experience.",
  },
  "blog/index.html": {
    title: "Kitesurf Cartagena Guides | Wind, Safety & Travel",
    description: "Plan a kitesurf trip to Cartagena with practical guides to wind seasons, La Boquilla, beginner lessons, safety, equipment and water sports.",
  },
  "blog/best-time-kitesurf-cartagena/index.html": {
    title: "Best Time to Kitesurf in Cartagena | Wind Guide 2026",
    description: "Learn when to kitesurf in Cartagena, including trade-wind seasons, typical conditions, kite-size considerations and La Boquilla planning tips.",
  },
  "blog/first-kitesurf-jump-guide/index.html": {
    title: "First Kitesurf Jump: Step-by-Step Technique Guide",
    description: "Prepare for your first controlled kitesurf jump with a practical guide to prerequisites, kite timing, edge, pop, landing and common mistakes.",
  },
  "blog/how-long-to-learn-kitesurfing/index.html": {
    title: "How Long Does It Take to Learn Kitesurfing?",
    description: "See the typical stages of learning kitesurfing, what affects progress, how lessons are structured and when riders are ready to practice independently.",
  },
  "blog/kite-wing-foil-differences/index.html": {
    title: "Kitesurf vs Wing Foil vs E-Foil: Key Differences",
    description: "Compare kitesurf, wing foil and e-foil by learning curve, wind needs, equipment, physical demands and the experience each sport offers.",
  },
  "blog/kitesurf-la-boquilla-spot-guide/index.html": {
    title: "La Boquilla Kitesurf Spot Guide | Cartagena",
    description: "Plan a kitesurf session at La Boquilla with this guide to location, wind seasons, water conditions, access, hazards and local preparation tips.",
  },
  "blog/kitesurf-packing-list/index.html": {
    title: "Kitesurf Packing List for Cartagena | What to Bring",
    description: "Pack for a Cartagena kitesurf trip with a practical checklist for gear, sun protection, repairs, documents and items you can rent locally.",
  },
  "blog/kitesurfing-for-beginners-cartagena/index.html": {
    title: "Kitesurfing for Beginners in Cartagena | Starter Guide",
    description: "Learn what to expect from beginner kitesurf lessons in Cartagena, from safety and kite control to body dragging, water starts and progression.",
  },
  "blog/safety-tips-cartagena/index.html": {
    title: "Is Kitesurfing Safe in Cartagena? Practical Guide",
    description: "Understand kitesurf risks, weather checks, equipment systems, right-of-way and instructor practices for safer lessons and sessions in Cartagena.",
  },
  "blog/top-water-sports-cartagena/index.html": {
    title: "Best Water Sports in Cartagena | Kite, Foil & SUP",
    description: "Compare kitesurfing, wing foil, kite foil, SUP and guided water experiences in Cartagena to choose the right activity for your level and trip.",
  },
};

for (const [rel, meta] of Object.entries(metadata)) {
  const file = path.join(root, rel);
  let html = fs.readFileSync(file, "utf8");
  const depth = rel.split("/").length - 1;
  const prefix = depth ? "../".repeat(depth) : "";

  html = html
    .replaceAll("https://kitesurfencartagena.com", domain)
    .replaceAll("CARTAGENA KITESURF CENTER", "KITE CARTAGENA")
    .replaceAll("Cartagena Kitesurf Center", "Kite Cartagena")
    .replaceAll("MARINE TECH", "KITE CARTAGENA")
    .replaceAll("Marine Tech Cartagena", "Kite Cartagena")
    .replaceAll("Marine Tech", "Kite Cartagena")
    .replaceAll("Cartagena%20Kitesurf%20Center", "Kite%20Cartagena")
    .replaceAll("#1 Kitesurf School", "Kitesurf School")
    .replaceAll("Cartagena's #1 kitesurfing beach", "Cartagena's best-known kitesurfing areas")
    .replaceAll("the safest kitesurf spot in Colombia", "a suitable Cartagena learning area when conditions allow")
    .replaceAll("The leading kitesurf school", "A local kitesurf school")
    .replaceAll("The leading authority in water sports tourism", "Local kitesurf lessons and water sports experiences")
    .replaceAll("© 2024 Kite Cartagena", "© 2026 Kite Cartagena")
    .replaceAll("&copy; 2024 Kite Cartagena", "&copy; 2026 Kite Cartagena")
    .replaceAll("Updated 2025", "Updated 2026")
    .replace(/<meta\s+name=["']keywords["'][\s\S]*?\/>\s*/gi, "")
    .replace(/<script\s+src=["']https:\/\/cdn\.tailwindcss\.com["']><\/script>\s*/gi, "")
    .replace(/<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\};\s*<\/script>\s*/gi, "")
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`)
    .replace(/(<meta\s+name=["']description["']\s+content=["'])[^"']*(["']\s*\/?>)/i, `$1${meta.description}$2`)
    .replace(/\b2025 Wind Season Guide\b/g, "2026 Wind Season Guide")
    .replace(/\bGuide 2025\b/g, "Guide 2026")
    .replace(/\bCartagena 2025\b/g, "Cartagena 2026")
    .replace(/"dateModified"\s*:\s*"[^"]+"/g, '"dateModified": "2026-09-14"')
    .replace(/href=["']#["']/g, 'role="link" aria-disabled="true" tabindex="-1"');

  const canonical = rel === "index.html"
    ? `${domain}/`
    : rel.endsWith("/index.html")
      ? `${domain}/${rel.slice(0, -"index.html".length)}`
      : `${domain}/${rel}`;
  html = html
    .replace(/(<link\s+rel=["']canonical["']\s+href=["'])[^"']+(["'])/i, `$1${canonical}$2`)
    .replace(/(<meta\s+property=["']og:url["']\s+content=["'])[^"']+(["'])/i, `$1${canonical}$2`);

  const headExtras = [
    `    <meta name="theme-color" content="#051b2c" />`,
    `    <link rel="manifest" href="${prefix}site.webmanifest" />`,
    `    <link rel="apple-touch-icon" sizes="180x180" href="${prefix}icons/apple-touch-icon.png" />`,
    `    <link rel="stylesheet" href="${prefix}assets/styles.css" />`,
  ].join("\n");
  if (!html.includes('rel="manifest"')) html = html.replace(/(<meta\s+name=["']viewport["'][^>]*>)/i, `$1\n${headExtras}`);

  if (!/property=["']og:image["']/i.test(html)) {
    const social = [
      `    <meta property="og:title" content="${meta.title}" />`,
      `    <meta property="og:description" content="${meta.description}" />`,
      `    <meta property="og:image" content="${domain}/images/salto.webp" />`,
      `    <meta property="og:type" content="website" />`,
      `    <meta property="og:url" content="${canonical}" />`,
      `    <meta property="og:site_name" content="Kite Cartagena" />`,
      `    <meta name="twitter:card" content="summary_large_image" />`,
      `    <meta name="twitter:title" content="${meta.title}" />`,
      `    <meta name="twitter:description" content="${meta.description}" />`,
      `    <meta name="twitter:image" content="${domain}/images/salto.webp" />`,
    ].join("\n");
    html = html.replace(/(<link\s+rel=["']canonical["'][^>]*>)/i, `$1\n${social}`);
  }

  if (!html.includes('class="skip-link"')) {
    html = html.replace(/(<body\b[^>]*>)/i, `$1\n    <a class="skip-link" href="#main-content">Skip to main content</a>`);
    html = html.replace(/<main(?![^>]*\bid=)/i, '<main id="main-content"');
  }
  if (!html.includes('id="main-content"')) {
    html = html.replace(/<(header|article|section)(?![^>]*\bid=)/i, '<$1 id="main-content"');
  }

  html = html.replace(/<nav(?![^>]*aria-label)/i, '<nav aria-label="Main navigation"');
  html = html.replace(/<button\s+class="md:hidden text-xl text-brand-gold"\s+onclick="toggleMobileMenu\(\)"\s*>/g,
    '<button type="button" class="md:hidden text-xl text-brand-gold" onclick="toggleMobileMenu(this)" aria-label="Open navigation menu" aria-controls="mobile-menu" aria-expanded="false">');
  html = html.replace(/function toggleMobileMenu\(\)\s*\{[\s\S]*?menu\.classList\.toggle\(["']hidden["']\);\s*\}/g,
    'function toggleMobileMenu(button) {\n        document.getElementById("mobile-menu").classList.toggle("hidden");\n        const isOpen = button.getAttribute("aria-expanded") === "true";\n        button.setAttribute("aria-expanded", String(!isOpen));\n        button.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");\n      }');

  fs.writeFileSync(file, html);
}

const sitemapEntries = Object.keys(metadata).map((rel) => {
  const loc = rel === "index.html"
    ? `${domain}/`
    : rel.endsWith("/index.html")
      ? `${domain}/${rel.slice(0, -"index.html".length)}`
      : `${domain}/${rel}`;
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-09-14</lastmod>\n  </url>`;
});
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</urlset>\n`);

fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`);
