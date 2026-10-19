// Rebuild the "Courses" and "Research" sections of docs/credits.md from the course JSON and research docs.
// Everything above "## Courses" (e.g. the mood board section) is kept as written.
// Usage: node scripts/gen-credits.mjs
import fs from "fs";
import path from "path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const file = path.join(root, "docs/credits.md");
const keep = fs.readFileSync(file, "utf8").split("\n## Courses")[0].trimEnd();
const dir = path.join(root, "src/data/courses");
const courses = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort().map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
let out = `${keep}\n\n## Courses\n\nCourse photos in \`public/courses/<slug>/\`, generated from each course's JSON by \`scripts/gen-credits.mjs\`.\nAll are freely licensed except where the license says "All rights reserved" (the user's home clubs; see DESIGN_LOG.md).\nCourses with no photo show a drawn yardage-book illustration instead.\n\n| Course | File | Author / owner | License | Source |\n|---|---|---|---|---|\n`;
for (const c of courses) {
  const imgs = [c.hero, ...(c.gallery || [])].filter(Boolean);
  if (!imgs.length) out += `| ${cell(c.name)} | (illustration) | n/a | n/a | n/a |\n`;
  for (const im of imgs) out += `| ${cell(c.name)} | \`${im.src.split("/").pop()}\` | ${cell(im.credit)} | ${cell(im.license)} | ${im.sourceUrl} |\n`;
}
out += `\n## Research\n\nApp screenshots in \`public/research/<app>/\` are store listing images, used as screenshot, for study. Sources are listed in each study in \`docs/research/\`.\n`;
fs.writeFileSync(file, out);
console.log(`credits: ${courses.length} courses`);
