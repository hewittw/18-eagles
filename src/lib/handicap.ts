// A simplified World Handicap System index, derived from saved rounds (never stored).
// - Adjusted gross score: each hole capped at net double bogey (par + 2 + strokes received). With no index yet, par + 5.
// - Score differential = (113 / slope) × (adjusted gross − course rating). 9-hole rounds use half the rating, and two
//   9-hole differentials in a row combine into one 18-hole differential (the pre-2024 WHS method, simpler to explain).
// - Index = the average of the best N of the most recent 20 differentials, using the WHS table for fewer than 20.
// Skipped on purpose: playing conditions (PCC), the soft/hard caps, and exceptional-score reductions.
import type { Course } from "./course-types";
import { findCourse, roundHoles, teeOf } from "./courses";
import type { Round } from "./types";

export type Differential = {
  roundIds: string[];
  date: string;
  value: number; // 1 decimal
  gross: number;
  adjusted: number;
  courseName: string;
};

export type HandicapState = {
  index: number | null; // computed, when there are 3+ differentials
  entered: number | null; // what the golfer typed, used until computed exists
  display: number | null; // what to show: computed ?? entered
  source: "computed" | "entered" | "none";
  differentials: Differential[]; // the most recent 20, newest first
  counting: Set<string>; // differential keys (date+round ids) that count toward the index
  roundsToFirst: number; // differentials still needed before the first computed index (0 when there is one)
  low: { value: number; date: string } | null; // the lowest computed index ever (the "Low H.I.")
  history: { date: string; index: number }[]; // the index after each differential, oldest first
  change: number | null; // the change from the previous differential's index
  nextToDrop: Differential | null; // the oldest of 20, which leaves the window on the next round
  nextToDropCounts: boolean;
  pendingNine: string | null; // a 9-hole card waiting for the next 9-hole card to pair with
};

export const WHS_TABLE: Record<number, [count: number, adj: number]> = {
  3: [1, -2], 4: [1, -1], 5: [1, 0], 6: [2, -1], 7: [2, 0], 8: [2, 0], 9: [3, 0], 10: [3, 0], 11: [3, 0],
  12: [4, 0], 13: [4, 0], 14: [4, 0], 15: [5, 0], 16: [5, 0], 17: [6, 0], 18: [6, 0], 19: [7, 0], 20: [8, 0],
};

const r1 = (n: number) => Math.round(n * 10) / 10;
export const keyOf = (d: Differential) => d.date + ":" + d.roundIds.join("+");

/** Course handicap for a full 18 from this tee. */
export function courseHandicap(index: number, course: Course, teeName: string) {
  const t = teeOf(course, teeName);
  return Math.round(index * (t.slope / 113) + (t.rating - t.par));
}

/** Strokes received on a hole, given a course handicap. Plus handicaps give strokes back on the easiest holes. */
export function strokesOn(hcp: number, holeIndex: number, holeCount: number) {
  if (hcp >= 0) return Math.floor(hcp / holeCount) + (holeIndex <= hcp % holeCount ? 1 : 0);
  const plus = -hcp;
  return -(Math.floor(plus / holeCount) + (holeIndex > holeCount - (plus % holeCount) ? 1 : 0));
}

function scoreRound(r: Round, course: Course, indexBefore: number | null) {
  const tee = teeOf(course, r.teeName);
  const holes = roundHoles(r, course);
  const nine = holes.length === 9;
  const rating = nine && course.holes.length === 18 ? tee.rating / 2 : tee.rating;
  if (r.totalOnly != null) return { gross: r.totalOnly, adjusted: r.totalOnly, rating, slope: tee.slope, nine };
  const ch = indexBefore == null ? null : courseHandicap(indexBefore, course, r.teeName) / (nine && course.holes.length === 18 ? 2 : 1);
  let gross = 0;
  let adjusted = 0;
  for (const h of holes) {
    const s = r.entries[h.n]?.strokes;
    if (s == null) return null; // incomplete card: doesn't count
    gross += s;
    const cap = ch == null ? h.par + 5 : h.par + 2 + strokesOn(Math.round(ch), nine ? Math.ceil(h.hcp / 2) : h.hcp, nine ? 9 : 18);
    adjusted += Math.min(s, cap);
  }
  return { gross, adjusted, rating, slope: tee.slope, nine };
}

function indexFrom(diffs: Differential[]): { index: number; counting: Differential[] } | null {
  const recent = diffs.slice(-20);
  const rule = WHS_TABLE[Math.min(recent.length, 20)];
  if (!rule) return null;
  const best = [...recent].sort((a, b) => a.value - b.value).slice(0, rule[0]);
  const avg = best.reduce((s, d) => s + d.value, 0) / best.length;
  return { index: Math.min(54, r1(avg + rule[1])), counting: best };
}

export function computeHandicap(rounds: Round[], custom: Course[], entered: number | null): HandicapState {
  const done = rounds
    .filter((r) => r.status === "complete")
    .sort((a, b) => a.date.localeCompare(b.date) || (a.finishedAt ?? a.createdAt) - (b.finishedAt ?? b.createdAt));

  const diffs: Differential[] = [];
  const history: { date: string; index: number }[] = [];
  let pendingNine: { r: Round; d: number; gross: number; adjusted: number; name: string } | null = null;
  let current: number | null = entered;
  let low: { value: number; date: string } | null = null;

  for (const r of done) {
    const course = findCourse(r.courseSlug, custom);
    if (!course) continue;
    const sc = scoreRound(r, course, current);
    if (!sc) continue;
    const d = (113 / sc.slope) * (sc.adjusted - sc.rating);
    if (sc.nine) {
      if (!pendingNine) {
        pendingNine = { r, d, gross: sc.gross, adjusted: sc.adjusted, name: course.shortName };
        continue;
      }
      diffs.push({ roundIds: [pendingNine.r.id, r.id], date: r.date, value: r1(pendingNine.d + d), gross: pendingNine.gross + sc.gross, adjusted: pendingNine.adjusted + sc.adjusted, courseName: `${pendingNine.name} + ${course.shortName}` });
      pendingNine = null;
    } else {
      diffs.push({ roundIds: [r.id], date: r.date, value: r1(d), gross: sc.gross, adjusted: sc.adjusted, courseName: course.shortName });
    }
    const idx = indexFrom(diffs);
    if (idx) {
      current = idx.index;
      history.push({ date: r.date, index: idx.index });
      if (!low || idx.index < low.value) low = { value: idx.index, date: r.date };
    }
  }

  const res = indexFrom(diffs);
  const recent = diffs.slice(-20);
  const counting = new Set((res?.counting ?? []).map(keyOf));
  const nextToDrop = recent.length === 20 ? recent[0] : null;
  return {
    index: res?.index ?? null,
    entered,
    display: res?.index ?? entered,
    source: res ? "computed" : entered != null ? "entered" : "none",
    differentials: [...recent].reverse(),
    counting,
    roundsToFirst: Math.max(0, 3 - diffs.length),
    low,
    history,
    change: history.length >= 2 ? r1(history[history.length - 1].index - history[history.length - 2].index) : null,
    nextToDrop,
    nextToDropCounts: nextToDrop ? counting.has(keyOf(nextToDrop)) : false,
    pendingNine: pendingNine?.r.id ?? null,
  };
}

/** Format an index the way golfers write it: plus handicaps are shown as "+1.2". */
export function formatIndex(n: number | null) {
  if (n == null) return "—";
  return n < 0 ? `+${Math.abs(n).toFixed(1)}` : n.toFixed(1);
}
