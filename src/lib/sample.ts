// A believable sample season for demos and the first-run check (Locker → Demo tools). Deterministic, so a
// screenshot today matches one tomorrow. It replaces saved data only after the golfer confirms.
import type { Course } from "./course-types";
import { findCourse, holesFor, teeOf } from "./courses";
import { DEFAULT_BAG, emptyStore, todayISO } from "./store";
import type { HoleEntry, Round, Store } from "./types";

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const NOTES = ["Lag putting was the difference.", "Pulled two drives left; check alignment.", "Wedges felt great inside 100.", "Three-putted 3 times. Practice 6-footers.", "Wind off the ocean all day.", "Best ball-striking of the year."];

export function sampleSeason(custom: Course[] = []): Store {
  const r = rng(18);
  const plan: [slug: string, daysAgo: number][] = [
    ["torrey-pines-south", 120], ["rancho-santa-fe", 108], ["torrey-pines-north", 96], ["rancho-santa-fe", 84], ["fairbanks-ranch", 77],
    ["torrey-pines-south", 63], ["rancho-santa-fe", 56], ["pebble-beach", 45], ["jackson-park", 33], ["rancho-santa-fe", 26],
    ["torrey-pines-south", 19], ["st-andrews-old", 12], ["rancho-santa-fe", 5],
  ];
  const rounds: Round[] = [];
  plan.forEach(([slug, ago], k) => {
    const course = findCourse(slug, custom);
    if (!course) return;
    const tee = course.tees[Math.min(1, course.tees.length - 1)];
    const skill = 0.95 - k * 0.02; // improves over the season
    const entries: Record<number, HoleEntry> = {};
    for (const h of holesFor(course, "18")) {
      const x = r();
      const over = x < 0.04 ? -1 : x < 0.27 / skill - 0.04 ? 0 : x < 0.7 ? 1 : x < 0.92 ? 2 : 3;
      const strokes = Math.max(2, h.par + over);
      const putts = Math.min(strokes - 1, r() < 0.12 ? 1 : r() < 0.8 ? 2 : 3);
      const toGreen = strokes - putts;
      const tee1 = h.par === 3 ? (h.yards > 190 ? "4h" : h.yards > 165 ? "6i" : "8i") : r() < 0.75 ? "dr" : "3w";
      const approach = ["7i", "8i", "9i", "pw", "6i", "56°"].map((s) => (s === "56°" ? "sw" : s));
      const shots = [tee1, ...Array.from({ length: Math.max(0, toGreen - 1) }, (_, i) => (i === toGreen - 2 ? approach[Math.floor(r() * 4)] : r() < 0.5 ? "5i" : "4h")), ...Array(putts).fill("pt")];
      const fw = h.par >= 4 ? (r() < 0.52 ? "hit" : r() < 0.6 ? "left" : "right") : null;
      entries[h.n] = { strokes, putts, fairway: fw as HoleEntry["fairway"], penalties: over >= 3 && r() < 0.5 ? 1 : 0, shots: k % 3 === 2 ? [] : shots, note: "" };
    }
    const d = new Date();
    d.setDate(d.getDate() - ago);
    const date = todayISO(d);
    rounds.push({
      id: `sample${k}`, courseSlug: slug, teeName: tee.name, date, holes: "18", mode: "live", status: "complete", entries, totalOnly: null,
      lastHole: 18, note: NOTES[k % NOTES.length], createdAt: d.getTime(), finishedAt: d.getTime() + 4.5 * 3600e3,
    });
  });
  const s = emptyStore();
  const lastTee: Record<string, string> = {};
  for (const x of rounds) lastTee[x.courseSlug] = x.teeName;
  const home = findCourse("rancho-santa-fe", custom);
  return {
    ...s,
    bag: DEFAULT_BAG.map((c) => ({ ...c })),
    rounds,
    profile: { enteredIndex: 16.8, goal: "90", homeCourse: home ? home.slug : null, lastTee, welcomedAt: Date.now() - 130 * 864e5 },
    lastVisit: Date.now() - 5 * 864e5,
  };
}

export const teeLabel = (course: Course, name: string) => {
  const t = teeOf(course, name);
  return `${t.name} · ${t.yards.toLocaleString()} yds · ${t.rating.toFixed(1)}/${t.slope}`;
};
