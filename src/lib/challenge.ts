// "Your challenge for the next round": one coach-like target, derived from saved rounds (never stored), like the index.
// - For every completed card N, the challenge it was played under comes from the up-to-5 completed cards before it.
// - The level is the golfer's goal (Break 100 / 90 / 80 / scratch); with no goal, it follows the index, then the average.
// - Each tracked area is averaged per 18 over that window and compared to a benchmark for the level: three-putts,
//   penalty strokes, double bogeys or worse, fairways hit, greens in regulation, pars on par 3s and on par 5s, and the
//   back-nine fade (back to par − front to par). Putt areas need putts on every hole; fairways need fairways marked.
// - The weakest area (the biggest gap past its benchmark, in "steps") becomes the target: one step better than the
//   golfer's own average, never stricter than the benchmark. The same area isn't set three cards running if another
//   area is also behind. Ahead of every benchmark? The target is the score: one better than the recent average.
// - No cards yet: a starter challenge (track putts on every hole). A total-only card can only be judged on score.
// - 9-hole cards: count targets are halved (rounded toward the harder side), the back-nine fade is skipped.
// - A card is met / missed against its challenge; "skipped" when it didn't track what was asked (no streak change).
import type { Course } from "./course-types";
import { summarize, type RoundSummary } from "./stats";
import type { Goal, Round } from "./types";

export type Level = Goal;
export type Metric = "threePutts" | "penalties" | "doubles" | "fairways" | "greens" | "par3" | "par5" | "fade" | "score" | "trackPutts";

export type Challenge = {
  metric: Metric;
  dir: "max" | "min"; // max: at most `target`; min: at least `target`
  target: number; // per 18 holes
  title: string; // "Two three-putts or fewer"
  why: string; // "Your last 5 average 3.6 three-putts; the mark for breaking 90 is about 3."
  avg: number | null;
  bench: number | null;
  window: number; // cards it was derived from
  level: Level;
};

export type Verdict = {
  roundId: string;
  date: string;
  course: string;
  challenge: Challenge;
  status: "met" | "missed" | "skipped";
  actual: number | null;
  allowed: number; // the target for this card's length
  text: string; // "1 three-putt (target ≤2)"
};

export type ChallengeState = {
  next: Challenge;
  history: Verdict[]; // oldest first
  streak: number; // challenges met in a row, most recent first (skipped cards don't break it)
  last: Verdict | null;
};

const WINDOW = 5;

type Def = {
  dir: "max" | "min";
  step: number; // what counts as one step of improvement, to compare gaps across areas
  bench: Record<Level, number>; // per 18
  value: (s: RoundSummary) => number | null; // raw value for this card, or null when not tracked
  noun: (n: number) => string; // "three-putts"
  title: (n: number) => string;
};

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const word = (n: number) => WORDS[n] ?? String(n);
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const detailed = (s: RoundSummary) => s.round.totalOnly == null;
const puttsTracked = (s: RoundSummary) => detailed(s) && s.putts != null && s.puttHoles === s.played;
const parCount = (s: RoundSummary, par: number) => s.holes.filter((h) => h.par === par && (s.round.entries[h.n]?.strokes ?? 99) <= h.par).length;

const DEFS: Record<Exclude<Metric, "score" | "trackPutts">, Def> = {
  threePutts: {
    dir: "max", step: 1, bench: { "100": 4, "90": 3, "80": 2, scratch: 1 },
    value: (s) => (puttsTracked(s) ? s.holes.filter((h) => (s.round.entries[h.n]?.putts ?? 0) >= 3).length : null),
    noun: (n) => plural(n, "three-putt", "three-putts"),
    title: (n) => (n === 0 ? "No three-putts" : n === 1 ? "One three-putt at most" : `${word(n)} three-putts or fewer`),
  },
  penalties: {
    dir: "max", step: 1, bench: { "100": 3, "90": 2, "80": 1, scratch: 0.5 },
    value: (s) => (detailed(s) ? s.penalties : null),
    noun: (n) => plural(n, "penalty stroke", "penalty strokes"),
    title: (n) => (n === 0 ? "No penalty strokes" : n === 1 ? "One penalty stroke at most" : `${word(n)} penalty strokes or fewer`),
  },
  doubles: {
    dir: "max", step: 1.5, bench: { "100": 6, "90": 4, "80": 2, scratch: 1 },
    value: (s) => (detailed(s) ? s.types.double + s.types["triple+"] : null),
    noun: (n) => plural(n, "double or worse", "doubles or worse"),
    title: (n) => (n === 0 ? "No double bogeys" : n === 1 ? "One double bogey at most" : `No more than ${n} doubles`),
  },
  fairways: {
    dir: "min", step: 1.5, bench: { "100": 5, "90": 6, "80": 8, scratch: 9 }, // of ~14
    value: (s) => (detailed(s) && s.fairwayHoles >= Math.ceil(s.holes.filter((h) => h.par >= 4).length / 2) ? s.fairways : null),
    noun: (n) => plural(n, "fairway", "fairways"),
    title: (n) => `Hit ${n} ${plural(n, "fairway", "fairways")} or more`,
  },
  greens: {
    dir: "min", step: 1.5, bench: { "100": 2, "90": 4, "80": 7, scratch: 11 },
    value: (s) => (puttsTracked(s) ? s.gir : null),
    noun: (n) => plural(n, "green in regulation", "greens in regulation"),
    title: (n) => `Hit ${n} ${plural(n, "green", "greens")} in regulation`,
  },
  par3: {
    dir: "min", step: 1, bench: { "100": 1, "90": 1.5, "80": 2.5, scratch: 3 }, // of ~4
    value: (s) => (detailed(s) && s.byPar[3].holes ? parCount(s, 3) : null),
    noun: (n) => plural(n, "par 3 at par or better", "par 3s at par or better"),
    title: (n) => (n === 1 ? "Make par on a par 3" : `Make par on ${word(n).toLowerCase()} par 3s`),
  },
  par5: {
    dir: "min", step: 1, bench: { "100": 1, "90": 1.5, "80": 2.5, scratch: 3 },
    value: (s) => (detailed(s) && s.byPar[5].holes ? parCount(s, 5) : null),
    noun: (n) => plural(n, "par 5 at par or better", "par 5s at par or better"),
    title: (n) => (n === 1 ? "Make par on a par 5" : `Make par on ${word(n).toLowerCase()} par 5s`),
  },
  fade: {
    dir: "max", step: 1.5, bench: { "100": 3, "90": 2, "80": 1.5, scratch: 1 },
    value: (s) => {
      if (!detailed(s) || s.holes.length !== 18 || s.front == null || s.back == null) return null;
      const fp = s.holes.filter((h) => h.n <= 9).reduce((a, h) => a + h.par, 0);
      const bp = s.holes.filter((h) => h.n > 9).reduce((a, h) => a + h.par, 0);
      return s.back - bp - (s.front - fp);
    },
    noun: (n) => `${plural(Math.abs(n), "stroke", "strokes")} ${n < 0 ? "better" : "worse"} coming home`,
    title: (n) => (n <= 0 ? "Play the back nine as well as the front" : `Come home within ${n} of your front nine`),
  },
};

const LEVEL_PHRASE: Record<Level, string> = { "100": "breaking 100", "90": "breaking 90", "80": "breaking 80", scratch: "scratch golf" };

/** The golfer's level: their goal, else what their index or recent scoring suggests. */
export function levelFor(goal: Goal | null, index: number | null, avgGross: number | null): Level {
  if (goal) return goal;
  if (index != null) return index <= 4 ? "scratch" : index <= 11 ? "80" : index <= 20 ? "90" : "100";
  if (avgGross != null) return avgGross < 80 ? "scratch" : avgGross < 90 ? "80" : avgGross < 100 ? "90" : "100";
  return "90";
}

const fmt1 = (n: number) => (Math.round(n * 10) / 10).toString();
const per18 = (s: RoundSummary, v: number) => (v * 18) / s.holes.length;

const STARTER = (level: Level): Challenge => ({
  metric: "trackPutts", dir: "min", target: 1, avg: null, bench: null, window: 0, level,
  title: "Track your putts on every hole",
  why: "Your first card sets the baseline. With putts on the card, the next challenge can find where the strokes go.",
});

/** The challenge for the card after `window` (oldest first, at most 5). `recent` = metrics set on the last cards. */
function derive(window: RoundSummary[], level: Level, recent: Metric[]): Challenge {
  if (!window.length) return STARTER(level);
  type Cand = { metric: Exclude<Metric, "score" | "trackPutts">; avg: number; gap: number; n: number };
  const cands: Cand[] = [];
  for (const [metric, d] of Object.entries(DEFS) as [Cand["metric"], Def][]) {
    const xs = window.map((s) => { const v = d.value(s); return v == null ? null : metric === "fade" ? v : per18(s, v); }).filter((v): v is number => v != null);
    if (!xs.length) continue;
    const avg = xs.reduce((a, b) => a + b, 0) / xs.length;
    const bench = d.bench[level];
    cands.push({ metric, avg, n: xs.length, gap: (d.dir === "max" ? avg - bench : bench - avg) / d.step });
  }
  const behind = cands.filter((c) => c.gap > 0).sort((a, b) => b.gap - a.gap);
  // Don't set the same area three cards running when another area is also behind.
  const stale = recent.length >= 2 && recent[0] === recent[1] ? recent[0] : null;
  const pick = behind.find((c) => c.metric !== stale) ?? behind[0];
  const n = window.length;
  const lastN = n === 1 ? "Your last card" : `Your last ${n} average`;

  if (!pick) {
    const avg = window.reduce((a, s) => a + per18(s, s.gross), 0) / n;
    const target = Math.round(avg) - 1;
    return {
      metric: "score", dir: "max", target, avg, bench: null, window: n, level,
      title: `Shoot ${target} or better`,
      why: cands.length
        ? `You're at or past the mark for ${LEVEL_PHRASE[level]} in every area you track. ${n === 1 ? "Your last card was" : `Your last ${n} average`} ${fmt1(avg)}; take one more off.`
        : `${n === 1 ? "Your last card was" : `Your last ${n} average`} ${fmt1(avg)}. Keep hole-by-hole detail and the challenge gets specific.`,
    };
  }
  const d = DEFS[pick.metric];
  const bench = d.bench[level];
  const target = d.dir === "max"
    ? Math.max(Math.floor(bench), Math.round(pick.avg) - 1)
    : Math.min(Math.ceil(bench), Math.round(pick.avg) + 1);
  const avgText = pick.metric === "fade" ? `${pick.avg > 0 ? `${fmt1(pick.avg)} strokes higher` : `${fmt1(-pick.avg)} lower`} on the back nine` : `${fmt1(pick.avg)} ${d.noun(pick.avg === 1 ? 1 : 2)}`;
  return {
    metric: pick.metric, dir: d.dir, target, avg: pick.avg, bench, window: n, level,
    title: d.title(target),
    why: `${n === 1 ? "Your last card had" : lastN} ${avgText}${pick.n < n ? ` (on ${pick.n} tracked)` : ""}; the mark for ${LEVEL_PHRASE[level]} is about ${fmt1(bench)}.`,
  };
}

/** Judge one card against the challenge it was played under. */
export function judge(s: RoundSummary, c: Challenge): Omit<Verdict, "roundId" | "date" | "course" | "challenge"> {
  const nine = s.holes.length < 18;
  const scale = s.holes.length / 18;
  if (!detailed(s) && c.metric !== "score") return { status: "skipped", actual: null, allowed: c.target, text: "logged as a total only, so there was nothing to judge" };
  if (c.metric === "trackPutts") {
    const ok = puttsTracked(s);
    return { status: ok ? "met" : "missed", actual: ok ? 1 : 0, allowed: 1, text: ok ? "putts on every hole" : `putts on ${s.puttHoles} of ${s.holes.length} holes` };
  }
  if (c.metric === "score") {
    const allowed = nine ? Math.round(c.target / 2) : c.target;
    return { status: s.gross <= allowed ? "met" : "missed", actual: s.gross, allowed, text: `shot ${s.gross} (target ${allowed}${nine ? " for nine" : ""})` };
  }
  const d = DEFS[c.metric];
  const v = d.value(s);
  const allowed = !nine ? c.target : c.dir === "max" ? Math.floor(c.target * scale) : Math.ceil(c.target * scale);
  const sign = c.dir === "max" ? "≤" : "≥";
  const goal = `target ${sign}${allowed}${nine ? " for nine" : ""}`;
  if (v == null) return { status: "skipped", actual: null, allowed, text: nine && c.metric === "fade" ? "a nine-hole card (no back-nine fade)" : `not tracked on this card (${goal})` };
  const met = c.dir === "max" ? v <= allowed : v >= allowed;
  const parN = c.metric === "par3" ? 3 : c.metric === "par5" ? 5 : 0;
  const shown = c.metric === "fade" ? (v === 0 ? "even halves" : `${Math.abs(v)} ${d.noun(v)}`)
    : parN ? `${v} of ${s.byPar[parN as 3 | 5].holes} par ${parN}s at par or better`
    : `${v} ${d.noun(v)}`;
  return { status: met ? "met" : "missed", actual: v, allowed, text: `${shown} (${goal})` };
}

/** Every challenge so far, their verdicts, and the one for the next card. */
export function computeChallenges(rounds: Round[], custom: Course[], goal: Goal | null, index: number | null): ChallengeState {
  const done = rounds
    .filter((r) => r.status === "complete")
    .sort((a, b) => a.date.localeCompare(b.date) || (a.finishedAt ?? a.createdAt) - (b.finishedAt ?? b.createdAt))
    .map((r) => summarize(r, custom))
    .filter((s): s is RoundSummary => !!s && s.complete);
  const avgAll = done.length ? done.slice(-WINDOW).reduce((a, s) => a + per18(s, s.gross), 0) / Math.min(WINDOW, done.length) : null;
  const level = levelFor(goal, index, avgAll);
  const history: Verdict[] = [];
  const recent: Metric[] = [];
  done.forEach((s, i) => {
    const c = derive(done.slice(Math.max(0, i - WINDOW), i), level, recent);
    history.push({ roundId: s.round.id, date: s.round.date, course: s.course.shortName, challenge: c, ...judge(s, c) });
    recent.unshift(c.metric);
  });
  const next = derive(done.slice(-WINDOW), level, recent);
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].status === "skipped") continue;
    if (history[i].status !== "met") break;
    streak++;
  }
  return { next, history, streak, last: history[history.length - 1] ?? null };
}
