// Render the Mermaid block in flows.md to a static SVG (dev-time only; no runtime package).
// Usage: node scripts/render-mermaid.mjs [flows.md] [public/flows]   → flow-1.svg, flow-2.svg, …
import { createRequire } from "module";
import fs from "fs";
import os from "os";
import path from "path";

const npx = path.join(os.homedir(), ".npm/_npx");
const pwDir = fs.readdirSync(npx).map((d) => path.join(npx, d, "node_modules")).find((d) => fs.existsSync(path.join(d, "playwright")));
const { chromium } = createRequire(path.join(pwDir, "/"))("playwright");
const cache = path.join(os.homedir(), "Library/Caches/ms-playwright");
const chromeDir = fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().pop();
const exe = path.join(cache, chromeDir, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");

const [src = "flows.md", outDir = "public/flows"] = process.argv.slice(2);
const blocks = [...fs.readFileSync(src, "utf8").matchAll(/```mermaid\n([\s\S]*?)```/g)].map((m) => m[1]);
const b = await chromium.launch({ headless: true, executablePath: exe });
fs.mkdirSync(outDir, { recursive: true });
for (const [i, code] of blocks.entries()) {
  const p = await b.newPage();
  await p.setContent(`<html><body><script type="module">
    import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
    // htmlLabels off: plain SVG text, so the file is valid standalone XML for <img> and GitHub
    mermaid.initialize({ startOnLoad: false, htmlLabels: false, flowchart: { htmlLabels: false, curve: "basis" }, theme: "base",
      themeVariables: { fontFamily: "Georgia, serif", fontSize: "15px", primaryColor: "#f6f1e4", primaryBorderColor: "#0f3d2e",
        primaryTextColor: "#1c1b19", lineColor: "#0f3d2e", edgeLabelBackground: "#fbfaf7" } });
    try { const { svg } = await mermaid.render("flow${i + 1}", ${JSON.stringify(code)}); window.__svg = svg; }
    catch (e) { window.__err = String(e.message || e); }
  </script></body></html>`);
  await p.waitForFunction(() => window.__svg || window.__err, null, { timeout: 30000 });
  const err = await p.evaluate(() => window.__err);
  if (err) { console.error(`Mermaid error in block ${i + 1}:`, err); process.exit(1); }
  const out = path.join(outDir, `flow-${i + 1}.svg`);
  fs.writeFileSync(out, await p.evaluate(() => window.__svg));
  console.log("wrote", out);
}
await b.close();
