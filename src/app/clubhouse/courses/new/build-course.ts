// Turn the add-a-course form into a Course. Yards and stroke indexes are estimated (and say so).
import type { Course, Hole } from "@/lib/course-types";
import { slugify, type CourseDraft } from "@/lib/validate";

export const FRONT_NINE = [4, 4, 3, 5, 4, 4, 3, 4, 5]; // par 36
export const PAR_72 = [...FRONT_NINE, ...FRONT_NINE];

const TYPICAL: Record<number, number> = { 3: 165, 4: 390, 5: 520, 6: 620 };

const TEE_COLORS: [RegExp, string][] = [
  [/black/i, "#1a1a1a"], [/blue/i, "#1f4fa3"], [/white/i, "#f2f2f2"], [/red/i, "#b3262b"], [/gold|yellow/i, "#d4a017"],
  [/green/i, "#2b5e46"], [/silver|grey|gray/i, "#a8a8a8"], [/orange/i, "#e07a1f"], [/purple/i, "#5b3a8a"],
];

/** Split total yards across holes in proportion to typical lengths for each par. Sums exactly. */
function yardsFor(pars: number[], total: number | null): number[] {
  const typical = pars.map((p) => TYPICAL[p] ?? 390);
  if (total == null) return typical;
  const sum = typical.reduce((a, b) => a + b, 0);
  const out = typical.map((t) => Math.round((t * total) / sum));
  const diff = total - out.reduce((a, b) => a + b, 0);
  const longest = out.indexOf(Math.max(...out));
  out[longest] += diff;
  return out;
}

/**
 * Stroke indexes the way committees usually do it: hardest first (long par 4s, then par 5s, then par 3s),
 * odd numbers on the front nine and even on the back, so strokes spread across the round.
 */
function strokeIndexes(pars: number[], yards: number[]): number[] {
  const weight = (i: number) => (pars[i] === 4 ? 2000 : pars[i] >= 5 ? 1000 : 0) + yards[i];
  const order = (idx: number[]) => [...idx].sort((a, b) => weight(b) - weight(a));
  const out = new Array<number>(pars.length);
  if (pars.length === 18) {
    order([0, 1, 2, 3, 4, 5, 6, 7, 8]).forEach((h, k) => (out[h] = 2 * k + 1));
    order([9, 10, 11, 12, 13, 14, 15, 16, 17]).forEach((h, k) => (out[h] = 2 * k + 2));
  } else {
    order(pars.map((_, i) => i)).forEach((h, k) => (out[h] = k + 1));
  }
  return out;
}

const shorten = (name: string) => {
  const s = name.replace(/\s+(golf course|golf club|golf links|country club|golf & country club|municipal golf course)$/i, "").trim();
  return s.length <= 18 ? s : s.slice(0, 17).trimEnd() + "…";
};

export function buildCourse(d: CourseDraft, takenSlugs: string[]): Course {
  const name = d.name.trim();
  const base = `custom-${slugify(name) || "course"}`;
  let slug = base;
  for (let k = 2; takenSlugs.includes(slug); k++) slug = `${base}-${k}`;
  const pars = d.pars.slice(0, d.holes === "9" ? 9 : 18);
  const par = pars.reduce((a, b) => a + b, 0);
  const total = d.yards.trim() ? Number(d.yards) : null;
  const yards = yardsFor(pars, total);
  const hcp = strokeIndexes(pars, yards);
  const holes: Hole[] = pars.map((p, i) => ({ n: i + 1, par: p as Hole["par"], yards: yards[i], hcp: hcp[i] }));
  const teeName = d.teeName.trim();
  const sumYards = yards.reduce((a, b) => a + b, 0);
  return {
    slug,
    name,
    shortName: shorten(name),
    city: d.city.trim(),
    region: "",
    country: "USA", // the type allows USA or Scotland; "yours" keeps custom courses out of those filters
    access: "public",
    tags: ["yours"],
    blurb: `Added by you. ${pars.length} holes, par ${par}, from the ${teeName} tees.`,
    holes,
    tees: [{ name: teeName, color: TEE_COLORS.find(([re]) => re.test(teeName))?.[1] ?? "#7d7566", par, yards: sumYards, rating: Number(d.rating), slope: Number(d.slope), source: "published" }],
    hero: null,
    gallery: [],
    dataNotes:
      `You added this course. The par for each hole, the ${teeName} tees, the course rating, and the slope are as you entered them. ` +
      (total != null
        ? `Hole yards are estimated: your total of ${total.toLocaleString("en-US")} yards is split across the holes by par. `
        : "Hole yards are estimated from typical lengths (165 for a par 3, 390 for a par 4, 520 for a par 5). ") +
      "Stroke indexes are estimated too (the longer par 4s rank hardest; odd numbers on the front nine, even on the back). Check them against the club's card.",
    sources: [],
  };
}
