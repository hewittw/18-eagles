// Validate the built-in course library against src/lib/course-types.ts.
// Usage: node scripts/check-courses.mjs [slug ...]   (no slugs = check every file)
import fs from "fs";
import path from "path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dir = path.join(root, "src/data/courses");
const only = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && (!only.length || only.includes(f.replace(".json", ""))));
let bad = 0;

for (const f of files) {
  const errs = [];
  let c;
  try { c = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); } catch (e) { console.log(`✗ ${f}: invalid JSON (${e.message})`); bad++; continue; }
  const need = ["slug", "name", "shortName", "city", "region", "country", "access", "tags", "blurb", "holes", "tees", "gallery", "dataNotes", "sources"];
  for (const k of need) if (c[k] === undefined) errs.push(`missing ${k}`);
  if (c.slug !== f.replace(".json", "")) errs.push("slug doesn't match the file name");
  if (c.shortName?.length > 18) errs.push("shortName is over 18 characters");
  if (c.blurb?.split(/\s+/).length > 40) errs.push("blurb is over 40 words");
  if (!["USA", "Scotland"].includes(c.country)) errs.push("country must be USA or Scotland");
  if (!["public", "resort", "private"].includes(c.access)) errs.push("bad access");
  const h = c.holes || [];
  if (![9, 18].includes(h.length)) errs.push(`holes: ${h.length} (need 9 or 18)`);
  h.forEach((x, i) => {
    if (x.n !== i + 1) errs.push(`hole ${i + 1}: n is ${x.n}`);
    if (![3, 4, 5, 6].includes(x.par)) errs.push(`hole ${i + 1}: par ${x.par}`);
    if (!(x.yards > 60 && x.yards < 750)) errs.push(`hole ${i + 1}: yards ${x.yards}`);
  });
  const hcps = h.map((x) => x.hcp).sort((a, b) => a - b);
  if (hcps.some((v, i) => v !== i + 1)) errs.push(`stroke indexes aren't 1…${h.length} each once: ${hcps.join(",")}`);
  const par = h.reduce((s, x) => s + x.par, 0);
  const yards = h.reduce((s, x) => s + x.yards, 0);
  const t = c.tees || [];
  if (t.length < 1 || t.length > 4) errs.push(`tees: ${t.length} (need 1–4)`);
  t.forEach((x) => {
    if (x.par !== par) errs.push(`tee ${x.name}: par ${x.par} ≠ hole pars sum ${par}`);
    if (!(x.slope >= 55 && x.slope <= 155)) errs.push(`tee ${x.name}: slope ${x.slope}`);
    if (!(x.rating > par - 12 && x.rating < par + 10)) errs.push(`tee ${x.name}: rating ${x.rating} looks wrong for par ${par}`);
    if (!["published", "estimated"].includes(x.source)) errs.push(`tee ${x.name}: source`);
    if (!/^#[0-9a-f]{6}$/i.test(x.color || "")) errs.push(`tee ${x.name}: color must be #rrggbb`);
  });
  if (t[0] && Math.abs(t[0].yards - yards) > 25) errs.push(`first tee yards ${t[0].yards} ≠ hole yards sum ${yards}`);
  for (const img of [c.hero, ...(c.gallery || [])].filter(Boolean)) {
    for (const k of ["src", "alt", "credit", "license", "sourceUrl"]) if (!img[k]) errs.push(`image missing ${k}`);
    if (img.src && !fs.existsSync(path.join(root, "public", img.src))) errs.push(`image file not found: ${img.src}`);
    else if (img.src && fs.statSync(path.join(root, "public", img.src)).size > 450_000) errs.push(`image over 450KB: ${img.src}`);
  }
  if (!c.sources?.length) errs.push("no sources");
  if (errs.length) { bad++; console.log(`✗ ${f}\n  - ${errs.join("\n  - ")}`); }
  else console.log(`✓ ${f}  par ${par} · ${yards} yds · ${t.length} tees · ${c.hero ? 1 + c.gallery.length : 0} images`);
}
console.log(`\n${files.length - bad}/${files.length} valid`);
process.exit(bad ? 1 : 0);
