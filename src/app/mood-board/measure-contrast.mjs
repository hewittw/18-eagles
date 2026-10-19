// Prints every intended text/background pair with its WCAG contrast ratio.
// Run: node --no-warnings src/app/mood-board/measure-contrast.mjs (Node 23+ strips the types from palette.ts)
import { palette, pairs, contrast, threshold } from "./palette.ts";

let fail = 0;
console.log("| Foreground | Background | Use | Ratio | Needs | Pass |\n|---|---|---|---|---|---|");
for (const p of pairs) {
  const f = palette[p.fg], b = palette[p.bg];
  const r = contrast(f.hex, b.hex), need = threshold[p.kind], ok = r >= need;
  if (!ok) fail++;
  console.log(`| ${f.name} \`${f.hex}\` | ${b.name} \`${b.hex}\` | ${p.use} | ${r.toFixed(2)}:1 | ${need}:1 | ${ok ? "yes" : "NO"} |`);
}
process.exitCode = fail ? 1 : 0;
