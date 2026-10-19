// Breakdowns of play, computed from saved rounds for whatever filter is active. Pure functions, no storage.
import type { Course, Hole } from "./course-types";
import { findCourse, roundHoles } from "./courses";
import type { Club, Round } from "./types";

export type Range = "5" | "10" | "20" | "year" | "all";
export type HoleFilter = "all" | "18" | "9";
export type Filters = { range: Range; course: string | "all"; holes: HoleFilter };
export const DEFAULT_FILTERS: Filters = { range: "all", course: "all", holes: "all" };

export type ScoreType = "albatross" | "eagle" | "birdie" | "par" | "bogey" | "double" | "triple+";
export const SCORE_TYPES: ScoreType[] = ["albatross", "eagle", "birdie", "par", "bogey", "double", "triple+"];

export function scoreType(strokes: number, par: number): ScoreType {
  const d = strokes - par;
  if (d <= -3) return "albatross";
  if (d === -2) return "eagle";
  if (d === -1) return "birdie";
  if (d === 0) return "par";
  if (d === 1) return "bogey";
  if (d === 2) return "double";
  return "triple+";
}

export const scoreLabel: Record<ScoreType, string> = {
  albatross: "Albatross", eagle: "Eagle", birdie: "Birdie", par: "Par", bogey: "Bogey", double: "Double", "triple+": "Triple+",
};

export type RoundSummary = {
  round: Round;
  course: Course;
  holes: Hole[];
  played: number; // holes with a score
  complete: boolean;
  gross: number;
  par: number; // par of the holes played
  toPar: number;
  front: number | null;
  back: number | null;
  putts: number | null; // null if putts weren't tracked
  puttHoles: number;
  gir: number;
  girHoles: number;
  fairways: number;
  fairwayHoles: number;
  penalties: number;
  types: Record<ScoreType, number>;
  byPar: Record<3 | 4 | 5, { holes: number; strokes: number; par: number }>;
};

const zeroTypes = () => Object.fromEntries(SCORE_TYPES.map((t) => [t, 0])) as Record<ScoreType, number>;

export function summarize(r: Round, custom: Course[]): RoundSummary | null {
  const course = findCourse(r.courseSlug, custom);
  if (!course) return null;
  const holes = roundHoles(r, course);
  const s: RoundSummary = {
    round: r, course, holes, played: 0, complete: false, gross: 0, par: 0, toPar: 0, front: null, back: null,
    putts: null, puttHoles: 0, gir: 0, girHoles: 0, fairways: 0, fairwayHoles: 0, penalties: 0, types: zeroTypes(),
    byPar: { 3: { holes: 0, strokes: 0, par: 0 }, 4: { holes: 0, strokes: 0, par: 0 }, 5: { holes: 0, strokes: 0, par: 0 } },
  };
  if (r.totalOnly != null) {
    const par = holes.reduce((a, h) => a + h.par, 0);
    return { ...s, played: holes.length, complete: true, gross: r.totalOnly, par, toPar: r.totalOnly - par };
  }
  let front = 0, back = 0, frontN = 0, backN = 0;
  for (const h of holes) {
    const e = r.entries[h.n];
    if (!e || e.strokes == null) continue;
    s.played++;
    s.gross += e.strokes;
    s.par += h.par;
    s.penalties += e.penalties;
    s.types[scoreType(e.strokes, h.par)]++;
    const bp = s.byPar[(Math.min(5, Math.max(3, h.par)) as 3 | 4 | 5)];
    bp.holes++; bp.strokes += e.strokes; bp.par += h.par;
    if (h.n <= 9) { front += e.strokes; frontN++; } else { back += e.strokes; backN++; }
    if (e.putts != null) {
      s.putts = (s.putts ?? 0) + e.putts;
      s.puttHoles++;
      s.girHoles++;
      if (e.strokes - e.putts <= h.par - 2) s.gir++;
    }
    if (h.par >= 4 && e.fairway) {
      s.fairwayHoles++;
      if (e.fairway === "hit") s.fairways++;
    }
  }
  s.toPar = s.gross - s.par;
  s.complete = s.played === holes.length;
  s.front = frontN === 9 ? front : null;
  s.back = backN === 9 ? back : null;
  return s;
}

export function applyFilters(rounds: Round[], f: Filters): Round[] {
  let out = rounds.filter((r) => r.status === "complete").sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
  if (f.course !== "all") out = out.filter((r) => r.courseSlug === f.course);
  if (f.holes === "18") out = out.filter((r) => r.holes === "18");
  if (f.holes === "9") out = out.filter((r) => r.holes !== "18");
  if (f.range === "year") {
    const y = String(new Date().getFullYear());
    out = out.filter((r) => r.date.startsWith(y));
  } else if (f.range !== "all") out = out.slice(-Number(f.range));
  return out;
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export type Breakdown = {
  count: number;
  summaries: RoundSummary[];
  scoring18: number | null; // average gross, 18-hole rounds
  toParPerRound: number | null; // average to par, normalized to 18 holes
  best18: RoundSummary | null;
  types: Record<ScoreType, number>;
  holesPlayed: number;
  byPar: Record<3 | 4 | 5, number | null>; // average strokes over par per hole
  puttsPerRound: number | null; // per 18
  puttsPerHole: number | null;
  girPct: number | null;
  fairwayPct: number | null;
  penaltiesPerRound: number | null;
  frontBack: { front: number | null; back: number | null }; // average to par per nine
  trend: { date: string; toPar: number; gross: number; holes: number; id: string; course: string }[];
  clubs: { club: Club; shots: number; teeShots: number; fairwayHit: number; fairwayTries: number }[];
  holeAverages: { hole: Hole; avgToPar: number; n: number; best: number }[] | null; // only when one course is chosen
};

export function breakdown(rounds: Round[], custom: Course[], bag: Club[], f: Filters): Breakdown {
  const summaries = applyFilters(rounds, f).map((r) => summarize(r, custom)).filter((s): s is RoundSummary => !!s && s.complete);
  const types = zeroTypes();
  let holesPlayed = 0;
  const byParAcc: Record<3 | 4 | 5, number[]> = { 3: [], 4: [], 5: [] };
  const fronts: number[] = [], backs: number[] = [];
  for (const s of summaries) {
    if (s.round.totalOnly != null) continue;
    holesPlayed += s.played;
    for (const t of SCORE_TYPES) types[t] += s.types[t];
    for (const p of [3, 4, 5] as const) if (s.byPar[p].holes) byParAcc[p].push((s.byPar[p].strokes - s.byPar[p].par) / s.byPar[p].holes);
    const fp = s.holes.filter((h) => h.n <= 9).reduce((a, h) => a + h.par, 0);
    const bp = s.holes.filter((h) => h.n > 9).reduce((a, h) => a + h.par, 0);
    if (s.front != null) fronts.push(s.front - fp);
    if (s.back != null) backs.push(s.back - bp);
  }
  const eighteen = summaries.filter((s) => s.holes.length === 18);
  const tracked = summaries.filter((s) => s.putts != null && s.puttHoles === s.played);

  const clubMap = new Map<string, { shots: number; teeShots: number; fairwayHit: number; fairwayTries: number }>();
  for (const s of summaries) {
    for (const h of s.holes) {
      const e = s.round.entries[h.n];
      if (!e) continue;
      e.shots.forEach((id, i) => {
        const c = clubMap.get(id) ?? { shots: 0, teeShots: 0, fairwayHit: 0, fairwayTries: 0 };
        c.shots++;
        if (i === 0) {
          c.teeShots++;
          if (h.par >= 4 && e.fairway) { c.fairwayTries++; if (e.fairway === "hit") c.fairwayHit++; }
        }
        clubMap.set(id, c);
      });
    }
  }
  const clubs = bag.filter((c) => clubMap.has(c.id)).map((club) => ({ club, ...clubMap.get(club.id)! }));

  let holeAverages: Breakdown["holeAverages"] = null;
  if (f.course !== "all" && summaries.length) {
    const course = summaries[0].course;
    holeAverages = course.holes.map((hole) => {
      const xs = summaries.map((s) => s.round.entries[hole.n]?.strokes).filter((x): x is number => x != null);
      return { hole, n: xs.length, avgToPar: xs.length ? (avg(xs)! - hole.par) : 0, best: xs.length ? Math.min(...xs) : 0 };
    });
  }

  return {
    count: summaries.length,
    summaries,
    scoring18: avg(eighteen.map((s) => s.gross)),
    toParPerRound: avg(summaries.map((s) => (s.toPar * 18) / s.holes.length)),
    best18: eighteen.length ? eighteen.reduce((a, b) => (b.gross < a.gross ? b : a)) : null,
    types,
    holesPlayed,
    byPar: { 3: avg(byParAcc[3]), 4: avg(byParAcc[4]), 5: avg(byParAcc[5]) },
    puttsPerRound: avg(tracked.map((s) => (s.putts! * 18) / s.played)),
    puttsPerHole: avg(tracked.map((s) => s.putts! / s.played)),
    girPct: tracked.length ? tracked.reduce((a, s) => a + s.gir, 0) / tracked.reduce((a, s) => a + s.girHoles, 0) : null,
    fairwayPct: (() => { const t = summaries.reduce((a, s) => a + s.fairwayHoles, 0); return t ? summaries.reduce((a, s) => a + s.fairways, 0) / t : null; })(),
    penaltiesPerRound: avg(summaries.filter((s) => s.round.totalOnly == null).map((s) => (s.penalties * 18) / s.holes.length)),
    frontBack: { front: avg(fronts), back: avg(backs) },
    trend: summaries.map((s) => ({ date: s.round.date, toPar: s.toPar, gross: s.gross, holes: s.holes.length, id: s.round.id, course: s.course.shortName })),
    clubs,
    holeAverages,
  };
}

// ---------- honors: quiet milestones, celebrated once ----------
export type Honor = { id: string; title: string; detail: string; date: string; roundId: string };

export function honors(rounds: Round[], custom: Course[], indexHistory: { date: string; index: number }[]): Honor[] {
  const out: Honor[] = [];
  const add = (h: Honor) => { if (!out.some((x) => x.id === h.id)) out.push(h); };
  const done = rounds.filter((r) => r.status === "complete").sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
  const bestAt = new Map<string, number>();
  for (const r of done) {
    const s = summarize(r, custom);
    if (!s || !s.complete) continue;
    add({ id: "first-card", title: "First card posted", detail: `${s.gross} at ${s.course.shortName}`, date: r.date, roundId: r.id });
    if (r.totalOnly == null) {
      if (s.types.birdie > 0) add({ id: "first-birdie", title: "First birdie", detail: s.course.shortName, date: r.date, roundId: r.id });
      if (s.types.eagle + s.types.albatross > 0) add({ id: "first-eagle", title: "First eagle", detail: s.course.shortName, date: r.date, roundId: r.id });
      let run = 0, bestRun = 0;
      for (const h of s.holes) { const e = r.entries[h.n]; run = e?.strokes != null && e.strokes <= h.par ? run + 1 : 0; bestRun = Math.max(bestRun, run); }
      if (bestRun >= 3) add({ id: "par-run-3", title: "Three pars or better in a row", detail: s.course.shortName, date: r.date, roundId: r.id });
    }
    if (s.holes.length === 18) {
      for (const t of [100, 90, 80, 72]) if (s.gross < t) add({ id: `broke-${t}`, title: t === 72 ? "Under 72" : `Broke ${t}`, detail: `${s.gross} at ${s.course.shortName}`, date: r.date, roundId: r.id });
      const prev = bestAt.get(r.courseSlug);
      if (prev != null && s.gross < prev) add({ id: `best-${r.courseSlug}-${s.gross}`, title: `New best at ${s.course.shortName}`, detail: `${s.gross}, down from ${prev}`, date: r.date, roundId: r.id });
      if (prev == null || s.gross < prev) bestAt.set(r.courseSlug, s.gross);
    }
  }
  let low = Infinity;
  indexHistory.forEach((h, i) => {
    if (i > 0 && h.index < low) add({ id: `low-${h.index}`, title: "New low index", detail: h.index.toFixed(1), date: h.date, roundId: "" });
    low = Math.min(low, h.index);
  });
  return out;
}

export const goalTarget = { "100": 100, "90": 90, "80": 80, scratch: 72 } as const;
