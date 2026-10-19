// Prints every token pair the components use with its WCAG 2.x contrast ratio, the forbidden pairs, and
// checks that globals.css @theme still matches src/components/tokens.ts.
// Run: node --no-warnings src/app/design-system/measure-contrast.mjs   (Node 23+ strips the types from tokens.ts)
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { tokens, pairs, forbidden, contrast, threshold } from "../../components/tokens.ts";

let fail = 0;
console.log("| Foreground | Background | Use | Ratio | Needs | Pass |\n|---|---|---|---|---|---|");
for (const p of pairs) {
  const f = tokens[p.fg], b = tokens[p.bg];
  const r = contrast(f.hex, b.hex), need = threshold[p.kind], ok = r >= need;
  if (!ok) fail++;
  console.log(`| \`${p.fg}\` ${f.hex} | \`${p.bg}\` ${b.hex} | ${p.use} | ${r.toFixed(2)}:1 | ${need}:1 | ${ok ? "yes" : "NO"} |`);
}
console.log("\nForbidden (measured, designed around):");
for (const p of forbidden) console.log(`- \`${p.fg}\` on \`${p.bg}\`: ${contrast(tokens[p.fg].hex, tokens[p.bg].hex).toFixed(2)}:1. ${p.why}`);

const css = fs.readFileSync(fileURLToPath(new URL("../globals.css", import.meta.url)), "utf8");
let drift = 0;
for (const [k, t] of Object.entries(tokens)) {
  const m = css.match(new RegExp(`--color-${k}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m || m[1].toUpperCase() !== t.hex.toUpperCase()) { drift++; console.log(`DRIFT: --color-${k} is ${m ? m[1] : "missing"} in globals.css, ${t.hex} in tokens.ts`); }
}
console.log(drift ? `\n${drift} token(s) drifted.` : `\nglobals.css matches tokens.ts (${Object.keys(tokens).length} color tokens).`);
process.exitCode = fail || drift ? 1 : 0;
