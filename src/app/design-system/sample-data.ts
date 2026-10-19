// Fixed sample data for /design-system. Real courses from src/data/courses; scores are a believable season.
// No clock reads: the page prerenders the same way every time.
import { BUILT_IN } from "@/data/courses";
import type { Course } from "@/lib/course-types";
import { DEFAULT_BAG } from "@/lib/store";
import type { HoleEntry } from "@/lib/types";
import type { ScoreType } from "@/lib/stats";

const bySlug = (s: string) => BUILT_IN.find((c) => c.slug === s) as Course;
export const OLD = bySlug("st-andrews-old");
export const RSF = bySlug("rancho-santa-fe");
export const PINEHURST = bySlug("pinehurst-no-2");
export const SAWGRASS = bySlug("tpc-sawgrass");
export const AUGUSTA = bySlug("augusta-national");
export const FAIRBANKS = bySlug("fairbanks-ranch");
export const COURSES = BUILT_IN;
export const BAG = DEFAULT_BAG;

const e = (strokes: number | null, putts: number | null, shots: string[] = [], note = ""): HoleEntry => ({ strokes, putts, fairway: null, penalties: 0, shots, note });

// An 80 at the Old Course: out 38, in 42.
const OLD_SCORES: [number, number][] = [[4, 2], [3, 1], [4, 2], [5, 2], [4, 1], [4, 2], [6, 3], [3, 2], [5, 2], [4, 2], [4, 2], [5, 2], [5, 2], [6, 2], [4, 2], [5, 2], [6, 2], [3, 1]];
export const OLD_ENTRIES: Record<number, HoleEntry> = Object.fromEntries(OLD.holes.map((h, i) => [h.n, e(OLD_SCORES[i][0], OLD_SCORES[i][1])]));
// A round in progress: through 12.
export const OLD_PARTIAL: Record<number, HoleEntry> = Object.fromEntries(OLD.holes.slice(0, 12).map((h) => [h.n, OLD_ENTRIES[h.n]]));

export const TREND = [
  ["2026-06-14", 91, "Torrey Pines South"], ["2026-06-27", 88, "Rancho Santa Fe"], ["2026-07-09", 90, "Torrey Pines North"],
  ["2026-07-21", 86, "Rancho Santa Fe"], ["2026-07-28", 89, "Fairbanks Ranch"], ["2026-08-11", 85, "Torrey Pines South"],
  ["2026-08-18", 84, "Rancho Santa Fe"], ["2026-08-29", 87, "Pebble Beach"], ["2026-09-10", 83, "Jackson Park"],
  ["2026-09-17", 82, "Rancho Santa Fe"], ["2026-09-24", 84, "Torrey Pines South"], ["2026-10-05", 80, "The Old Course"], ["2026-10-12", 81, "Rancho Santa Fe"],
].map(([date, value, label], i) => ({ id: `r${i}`, date: date as string, value: value as number, label: label as string }));

export const TYPES: Record<ScoreType, number> = { albatross: 0, eagle: 1, birdie: 14, par: 82, bogey: 88, double: 37, "triple+": 12 };
export const TYPES_HOLES = Object.values(TYPES).reduce((a, b) => a + b, 0);
export const BY_PAR: Record<3 | 4 | 5, number | null> = { 3: 0.71, 4: 0.94, 5: 0.48 };

const club = (id: string) => { const c = DEFAULT_BAG.find((x) => x.id === id)!; return { id: c.id, name: c.name, short: c.short }; };
export const CLUBS = [
  { club: club("pt"), shots: 412, teeShots: 0, fairwayHit: 0, fairwayTries: 0 },
  { club: club("dr"), shots: 141, teeShots: 141, fairwayHit: 71, fairwayTries: 141 },
  { club: club("7i"), shots: 64, teeShots: 9, fairwayHit: 0, fairwayTries: 0 },
  { club: club("pw"), shots: 58, teeShots: 3, fairwayHit: 0, fairwayTries: 0 },
  { club: club("sw"), shots: 47, teeShots: 0, fairwayHit: 0, fairwayTries: 0 },
  { club: club("3w"), shots: 39, teeShots: 26, fairwayHit: 17, fairwayTries: 26 },
  { club: club("4h"), shots: 33, teeShots: 12, fairwayHit: 0, fairwayTries: 0 },
  { club: club("9i"), shots: 30, teeShots: 4, fairwayHit: 0, fairwayTries: 0 },
];

const HEAT = [0.4, -0.2, 0.3, 1.2, 0.6, 0.2, 1.8, 0, 0.5, 0.3, 0.8, 0.9, 0.6, 1.6, 0.4, 0.7, 2.1, -0.6];
export const HOLE_HEAT = OLD.holes.map((hole, i) => ({ hole, avgToPar: HEAT[i], n: 4, best: hole.par + Math.floor(HEAT[i] - 0.4) }));

export const CARRIES: Record<string, number> = { dr: 245, "3w": 225, "5w": 210, "4h": 198, "5i": 185, "6i": 172, "7i": 160, "8i": 148, "9i": 136, pw: 124, gw: 110, sw: 92, lw: 74 };
