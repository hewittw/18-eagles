// Screenshot + style-extract reference sites in isolated, logged-out headless browser contexts.
// Usage: node capture-references.mjs sites.json <public-image-dir> <data-dir>
//   sites.json = [["slug", "https://url"], ...]
// Needs the `playwright` package: set PW_MODULES to a node_modules dir that has it
// (e.g. one of ~/.npm/_npx/*/node_modules from the Playwright MCP), or install it in a scratch dir.
// Optional CHROME_PATH = a Chromium binary, if Playwright's bundled one isn't downloaded.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
const require = createRequire(path.join(process.env.PW_MODULES || process.cwd() + "/node_modules", "/"));
const { chromium } = require("playwright");

const [sitesFile, OUT_IMG, OUT_DATA] = process.argv.slice(2);
if (!sitesFile || !OUT_IMG || !OUT_DATA) { console.error("usage: node capture-references.mjs sites.json imgDir dataDir"); process.exit(1); }
fs.mkdirSync(OUT_DATA, { recursive: true });
const sites = JSON.parse(fs.readFileSync(sitesFile, "utf8"));

function extract() {
  const count = (m, k) => (m[k] = (m[k] || 0) + 1);
  const bg = {}, fg = {}, fam = {}, sizes = {}, weights = {};
  const els = [...document.querySelectorAll("body *")].slice(0, 4000);
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || +s.opacity === 0) continue;
    if (s.backgroundColor && !s.backgroundColor.endsWith(", 0)") && s.backgroundColor !== "transparent") count(bg, s.backgroundColor);
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (hasText) {
      count(fg, s.color);
      count(fam, s.fontFamily.split(",")[0].replace(/["']/g, "").trim());
      count(sizes, s.fontSize);
      count(weights, s.fontWeight);
    }
  }
  const top = (m, n) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
  const b = getComputedStyle(document.body);
  return {
    title: document.title,
    bodyBg: b.backgroundColor, bodyColor: b.color, bodyFont: b.fontFamily,
    backgrounds: top(bg, 8), textColors: top(fg, 8), fontFamilies: top(fam, 6),
    fontSizes: top(sizes, 10), fontWeights: top(weights, 6),
    loadedFonts: [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`))].slice(0, 15),
    canvasCount: document.querySelectorAll("canvas").length,
    videoCount: document.querySelectorAll("video").length,
    svgCount: document.querySelectorAll("svg").length,
    headings: [...document.querySelectorAll("h1,h2,h3")].slice(0, 12).map((h) => h.innerText.trim().slice(0, 100)).filter(Boolean),
  };
}

async function shoot(browser, slug, url) {
  const dir = path.join(OUT_IMG, slug);
  fs.mkdirSync(dir, { recursive: true });
  const result = { slug, url, ok: true, errors: [] };
  const go = async (page) => {
    try { await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }); }
    catch { await page.goto(url, { waitUntil: "load", timeout: 30000 }).catch((e) => result.errors.push(String(e).slice(0, 200))); }
    await page.waitForTimeout(3500);
  };
  try {
    const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const p = await desk.newPage();
    await go(p);
    await p.screenshot({ path: path.join(dir, "desktop-hero.jpg"), type: "jpeg", quality: 72 });
    result.style = await p.evaluate(extract);
    await p.mouse.wheel(0, 1400); await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(dir, "desktop-scroll-1.jpg"), type: "jpeg", quality: 72 });
    await p.mouse.wheel(0, 1800); await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(dir, "desktop-scroll-2.jpg"), type: "jpeg", quality: 72 });
    await desk.close();
    const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const m = await mob.newPage();
    await go(m);
    await m.screenshot({ path: path.join(dir, "mobile-hero.jpg"), type: "jpeg", quality: 70 });
    await mob.close();
  } catch (e) { result.ok = false; result.errors.push(String(e).slice(0, 300)); }
  fs.writeFileSync(path.join(OUT_DATA, `${slug}.json`), JSON.stringify(result, null, 2));
  console.log(slug, result.ok ? "ok" : "FAIL", result.errors.join(" | ").slice(0, 150));
}

const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const queue = [...sites];
await Promise.all(Array.from({ length: 5 }, async () => {
  while (queue.length) { const [s, u] = queue.shift(); await shoot(browser, s, u); }
}));
await browser.close();
