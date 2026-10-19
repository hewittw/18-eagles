// The golfer's record at a course, from saved (finished) cards. Shared by the course list and the course page.
import type { Course } from "@/lib/course-types";
import { summarize } from "@/lib/stats";
import type { Round } from "@/lib/types";

export type CourseRecord = {
  rounds: number; // finished cards here (18 or 9 holes)
  best: number | null; // best 18-hole gross
  average: number | null; // average 18-hole gross, 1 decimal
  bestNine: number | null; // best 9-hole gross, when there are only nines
  last: Round | null; // most recent finished round here
};

export function recordAt(slug: string, rounds: Round[], custom: Course[]): CourseRecord {
  const done = rounds
    .filter((r) => r.courseSlug === slug && r.status === "complete")
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  const eighteen: number[] = [];
  const nines: number[] = [];
  for (const r of done) {
    const s = summarize(r, custom);
    if (!s || !s.complete) continue;
    (s.holes.length === 18 ? eighteen : nines).push(s.gross);
  }
  return {
    rounds: done.length,
    best: eighteen.length ? Math.min(...eighteen) : null,
    average: eighteen.length ? Math.round((eighteen.reduce((a, b) => a + b, 0) / eighteen.length) * 10) / 10 : null,
    bestNine: nines.length ? Math.min(...nines) : null,
    last: done[0] ?? null,
  };
}

/** "Played 3 · best 86", or "Not played yet". */
export function recordLine(r: CourseRecord) {
  if (r.rounds === 0) return "Not played yet";
  const best = r.best != null ? ` · best ${r.best}` : r.bestNine != null ? ` · best ${r.bestNine} for 9` : "";
  return `Played ${r.rounds}${best}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-10-12" → "12 Oct 2026", without time zones getting involved. */
export function formatDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
