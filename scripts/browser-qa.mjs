import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const baseUrl = process.env.SITE_URL || "http://127.0.0.1:4173";
const output = path.resolve(import.meta.dirname, "../.qa");
fs.mkdirSync(output, { recursive: true });

const cases = [
  { name: "home-wide", route: "/", viewport: { width: 1920, height: 900 }, aboveFoldCta: true },
  { name: "home-desktop", route: "/", viewport: { width: 1366, height: 768 } },
  { name: "home-mobile", route: "/", viewport: { width: 390, height: 844 }, aboveFoldCta: true },
  { name: "english-desktop", route: "/en/", viewport: { width: 1366, height: 768 } },
  { name: "french-mobile", route: "/fr/cours-kitesurf/", viewport: { width: 390, height: 844 } },
  { name: "german-mobile", route: "/de/wind-cartagena/", viewport: { width: 390, height: 844 } },
  { name: "repair-mobile", route: "/reparacion-cometas-kitesurf/", viewport: { width: 390, height: 844 }, aboveFoldCta: true },
  { name: "repair-article-desktop", route: "/en/blog/kite-repair/", viewport: { width: 1366, height: 768 }, article: true },
  { name: "portuguese-contact-mobile", route: "/pt/contato/", viewport: { width: 390, height: 844 }, form: true },
  { name: "course-medium-desktop", route: "/curso/curso-medio/", viewport: { width: 1366, height: 768 }, course: true },
  { name: "spots-desktop", route: "/spots-kitesurf-cartagena/", viewport: { width: 1366, height: 768 }, spots: true },
  { name: "spots-mobile", route: "/spots-kitesurf-cartagena/", viewport: { width: 390, height: 844 }, spots: true },
];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const failures = [];

for (const test of cases) {
  const page = await browser.newPage({ viewport: test.viewport });
  page.setDefaultTimeout(5000);
  const consoleErrors = [];
  const failedResources = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("response", (item) => {
    if (item.status() >= 400) failedResources.push(`${item.status()} ${item.url()}`);
  });
  const response = await page.goto(`${baseUrl}${test.route}`, { waitUntil: "domcontentloaded", timeout: 10000 });
  if (!response?.ok()) failures.push(`${test.name}: HTTP ${response?.status() ?? "no response"}`);
  if (!(await page.locator("h1").isVisible())) failures.push(`${test.name}: H1 is not visible`);
  const headerPosition = await page.locator(".site-header").evaluate((el) => getComputedStyle(el).position);
  if (!["fixed", "sticky"].includes(headerPosition)) {
    failures.push(`${test.name}: header is neither fixed nor sticky`);
  } else {
    await page.evaluate(() => window.scrollTo(0, Math.min(520, document.documentElement.scrollHeight - innerHeight)));
    await page.waitForTimeout(100);
    const headerBoxAfterScroll = await page.locator(".site-header").boundingBox();
    if (!headerBoxAfterScroll || Math.abs(headerBoxAfterScroll.y) > 1) {
      failures.push(`${test.name}: header does not remain pinned after scrolling`);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  if (!(await page.locator(".language summary").isVisible())) failures.push(`${test.name}: language dropdown is not visible`);
  if (test.aboveFoldCta) {
    const box = await page.locator(".hero .btn.primary").first().boundingBox();
    if (!box || box.y + box.height > test.viewport.height) failures.push(`${test.name}: primary CTA is below the initial viewport`);
  }
  if (test.article) {
    if ((await page.locator(".sources a").count()) < 2) failures.push(`${test.name}: article has fewer than two cited sources`);
    if (!(await page.locator("a[href*='frequently-asked-questions']").first().isVisible())) failures.push(`${test.name}: article lacks a visible FAQ link`);
    if (!(await page.locator("form.wa-form").isVisible())) failures.push(`${test.name}: article lacks a WhatsApp form`);
  }
  if (test.form && !(await page.locator("form.wa-form").isVisible())) failures.push(`${test.name}: WhatsApp form is not visible`);
  if (test.course) {
    if ((await page.locator(".visual-feature").count()) !== 4) failures.push(`${test.name}: course does not have four visual learning sections`);
    if ((await page.locator(".related-guides .blog-card").count()) < 3) failures.push(`${test.name}: course has fewer than three related guides`);
    if ((await page.locator(".faq-list details").count()) < 5) failures.push(`${test.name}: course has fewer than five FAQs`);
    if ((await page.locator(".visual-balance").count()) > 0) failures.push(`${test.name}: obsolete percentage graphic is still present`);
  }
  if (test.spots) {
    if ((await page.locator(".spot-selector").count()) < 4) failures.push(`${test.name}: spot explorer has fewer than four locations`);
    if ((await page.locator("#spot-map").count()) !== 1) failures.push(`${test.name}: satellite map is missing`);
    await page.locator("#spot-map .leaflet-marker-icon").first().waitFor({ state: "visible", timeout: 10000 });
    if ((await page.locator("#spot-map .leaflet-marker-icon").count()) !== 4) failures.push(`${test.name}: satellite map does not show all four locations`);
    const directionsLink = page.locator("#spot-map-directions");
    const initialMapUrl = await directionsLink.getAttribute("href");
    await page.getByRole("button", { name: /Manzanillo/i }).click();
    await page.waitForTimeout(300);
    const selectedMapUrl = await directionsLink.getAttribute("href");
    if (!selectedMapUrl || selectedMapUrl === initialMapUrl || !selectedMapUrl.includes("10.51473")) {
      failures.push(`${test.name}: location selector did not update the map`);
    }
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) failures.push(`${test.name}: horizontal overflow detected`);
  if (consoleErrors.length) failures.push(`${test.name}: console errors: ${consoleErrors.join(" | ")}; resources: ${failedResources.join(" | ")}`);
  await page.screenshot({ path: path.join(output, `${test.name}.png`), fullPage: false });
  await page.close();
}

await browser.close();
console.log(`Checked ${cases.length} browser scenarios.`);
for (const failure of failures) console.error(`ERROR ${failure}`);
console.log(`${failures.length} browser failures.`);
process.exitCode = failures.length ? 1 : 0;
