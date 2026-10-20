// The Trophy Room: awards derived from saved rounds every time (never stored), like the index in handicap.ts.
//
// WEEKLY (a week is Monday–Sunday, local time; every Monday the case is empty again)
// - Low Round of the Week: the week's best complete card, ranked against every card posted up to the end of that
//   week by score differential: (113 / slope) × (gross − rating), with half the rating for a nine (then doubled),
//   so a hard course and an easy one compare fairly. #1 of all your cards = gold, top 3 = silver,
//   top 25% (at least the best one) = bronze. Outside that, the week's best card still shows its rank, unawarded.
// - The Jacket: a complete card this week that met the golfer's goal (Break 100 / 90 / 80: 99 / 89 / 79 or
//   better for 18, half that rounded down for a nine; scratch: par or better). Judged against today's goal, since
//   goal changes aren't kept. No goal set, no Jacket.
// - Challenge Medal: a card this week that met the challenge it was played under (src/lib/challenge.ts).
// CRYSTAL (hole by hole cards only; each one is won again every time it happens)
// - Crystal Goblet: an eagle or better. Ace Crystal: a hole in one. Albatross Bowl: three under on a hole.
// - Twin Tumblers: birdie or better on two holes in a row. Crystal Decanter: three in a row.
// CAREER (once each; a few are "held", re-won whenever you beat your own mark)
// - First Card, First Birdie, Three in a Row (pars or better), Broke 100 / 90 / 80, Under 72, New Low Index and
//   Course Record are the Locker's honors (stats.ts honors()), mapped one to one so the two never disagree.
// - Amen Corner: par or better on holes 11, 12 and 13 in one round. Par-3 Specialist: every par 3 at par or better
//   in an 18-hole round (three or more par 3s). Clean Nine: a nine with no hole over par. Strong Finish: the back nine
//   played better (to par) than the front. Full Card: putts on all 18. Lag Master: all 18 with putts and no
//   three-putt. The Salver: the low 18-hole card of this calendar year (held by the best card). Links Pilgrim: a card
//   on a links course. Fairway Finder: ten or more fairways in an 18. Five / Ten / Twenty-Five Cards.
//   The Regular: a card in three weeks running.
import type { Course } from "./course-types";
import { computeChallenges } from "./challenge";
import { teeOf } from "./courses";
import { goalTarget, honors, summarize, type RoundSummary } from "./stats";
import type { Goal, Round } from "./types";

export type Tier = "gold" | "silver" | "bronze" | "crystal";
export type TrophyCategory = "weekly" | "crystal" | "career";
export type TrophyArtKind = "vase" | "jacket" | "medal" | "goblet" | "orb" | "bowl" | "tumbler" | "decanter" | "cup" | "salver" | "plaque" | "pin" | "bridge" | "putter";

export type TrophyDef = {
  id: string;
  name: string;
  tier: Tier; // for the weekly low round: the best it can be
  how: string; // one line: how to win it
  category: TrophyCategory;
  art: TrophyArtKind;
  repeat?: boolean; // won again each time (crystal, weekly)
};

export const TIER_WORD: Record<Tier, string> = { gold: "Gold", silver: "Silver", bronze: "Bronze", crystal: "Crystal" };

export const CATALOG: TrophyDef[] = [
  // weekly
  { id: "week-low", name: "Low Round of the Week", tier: "gold", art: "vase", category: "weekly", repeat: true, how: "Post your best card of the week. Your best ever is gold, top 3 silver, top quarter bronze." },
  { id: "week-jacket", name: "The Jacket", tier: "gold", art: "jacket", category: "weekly", repeat: true, how: "Beat your goal in a round this week." },
  { id: "week-challenge", name: "Challenge Medal", tier: "silver", art: "medal", category: "weekly", repeat: true, how: "Meet your next-round challenge this week." },
  // crystal
  { id: "goblet", name: "Crystal Goblet", tier: "crystal", art: "goblet", category: "crystal", repeat: true, how: "Make an eagle: two under par on a hole." },
  { id: "ace", name: "Ace Crystal", tier: "crystal", art: "orb", category: "crystal", repeat: true, how: "Make a hole in one." },
  { id: "albatross", name: "Albatross Bowl", tier: "crystal", art: "bowl", category: "crystal", repeat: true, how: "Make three under par on a hole." },
  { id: "twin", name: "Twin Tumblers", tier: "crystal", art: "tumbler", category: "crystal", repeat: true, how: "Birdie two holes in a row." },
  { id: "decanter", name: "Crystal Decanter", tier: "crystal", art: "decanter", category: "crystal", repeat: true, how: "Birdie three holes in a row." },
  // career
  { id: "first-card", name: "First Card", tier: "bronze", art: "plaque", category: "career", how: "Post your first complete card." },
  { id: "first-birdie", name: "First Birdie", tier: "bronze", art: "pin", category: "career", how: "Make your first birdie on a hole-by-hole card." },
  { id: "par-run", name: "Three in a Row", tier: "bronze", art: "medal", category: "career", how: "Par or better on three holes in a row." },
  { id: "broke-100", name: "Broke 100", tier: "bronze", art: "cup", category: "career", how: "Shoot 99 or better for 18 holes." },
  { id: "broke-90", name: "Broke 90", tier: "silver", art: "cup", category: "career", how: "Shoot 89 or better for 18 holes." },
  { id: "broke-80", name: "Broke 80", tier: "gold", art: "cup", category: "career", how: "Shoot 79 or better for 18 holes." },
  { id: "under-72", name: "Under 72", tier: "gold", art: "cup", category: "career", how: "Shoot 71 or better for 18 holes." },
  { id: "low-index", name: "New Low Index", tier: "silver", art: "salver", category: "career", repeat: true, how: "Lower your Handicap Index below its best so far." },
  { id: "course-record", name: "Course Record", tier: "silver", art: "plaque", category: "career", repeat: true, how: "Beat your own best 18 at a course you've played before." },
  { id: "amen", name: "Amen Corner", tier: "gold", art: "bridge", category: "career", how: "Par or better on holes 11, 12 and 13 in one round." },
  { id: "par3", name: "Par-3 Specialist", tier: "silver", art: "pin", category: "career", how: "Par or better on every par 3 in an 18-hole round." },
  { id: "clean-nine", name: "Clean Nine", tier: "gold", art: "medal", category: "career", how: "Play a nine with no hole over par." },
  { id: "strong-finish", name: "Strong Finish", tier: "bronze", art: "medal", category: "career", how: "Play the back nine better than the front." },
  { id: "full-card", name: "Full Card", tier: "bronze", art: "putter", category: "career", how: "Track putts on all 18 holes of a round." },
  { id: "lag-master", name: "Lag Master", tier: "silver", art: "putter", category: "career", how: "Eighteen holes with putts tracked and no three-putts." },
  { id: "fairways", name: "Fairway Finder", tier: "silver", art: "medal", category: "career", how: "Hit ten or more fairways in an 18-hole round." },
  { id: "salver", name: "The Salver", tier: "silver", art: "salver", category: "career", how: "Hold the low 18-hole card of the year." },
  { id: "links", name: "Links Pilgrim", tier: "bronze", art: "pin", category: "career", how: "Post a card on a links course, like St Andrews." },
  { id: "cards-5", name: "Five Cards", tier: "bronze", art: "medal", category: "career", how: "Post five complete cards." },
  { id: "cards-10", name: "Ten Cards", tier: "silver", art: "medal", category: "career", how: "Post ten complete cards." },
  { id: "cards-25", name: "Twenty-Five Cards", tier: "gold", art: "medal", category: "career", how: "Post twenty-five complete cards." },
  { id: "regular", name: "The Regular", tier: "bronze", art: "plaque", category: "career", how: "Post a card in three weeks running." },
];

export const trophyDef = (id: string) => CATALOG.find((t) => t.id === id)!;

export type EarnedTrophy = {
  id: string; // catalog id
  key: string; // unique per win
  tier: Tier; // the tier won (the weekly low round varies)
  date: string; // yyyy-mm-dd
  roundId: string; // "" when not tied to one card (a new low index)
  detail: string; // "86 at Rancho Santa Fe · ranks #3 of 14"
  honorId?: string; // the Locker honor this win corresponds to (for store.honorsSeen)
  finishedAt: number | null; // when the card was finished, for "new since your last visit"
};

export type WeekRank = { rank: number; of: number; roundId: string; gross: number; toPar: number; holes: number; course: string; date: string; tier: Tier | null };

export type WeekSlot = {
  def: TrophyDef;
  won: EarnedTrophy | null;
  note: string; // what to do, or what was won
  short: string; // the same in a few words, for a phone-sized tile
};

export type ThisWeek = {
  start: string; // Monday, yyyy-mm-dd
  end: string; // Sunday
  daysLeft: number; // including today: 7 on Monday, 1 on Sunday
  cards: number; // complete cards this week
  rank: WeekRank | null; // the week's best card and its place among all your cards
  slots: WeekSlot[];
};

export type TrophyState = {
  earned: EarnedTrophy[]; // every win, newest first
  byId: Map<string, EarnedTrophy[]>; // wins per catalog id, newest first
  wonCount: number; // catalog trophies won at least once
  total: number; // catalog size
  thisWeek: ThisWeek;
};

// ───────── dates ─────────
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); };
/** The Monday of the week holding this date (local). */
export function weekStart(date: string | Date): string {
  const d = typeof date === "string" ? parse(date) : new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return iso(d);
}
const addDays = (s: string, n: number) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };

// ───────── scoring helpers ─────────
const ORD = (n: number) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const toParText = (n: number) => (n === 0 ? "E" : n > 0 ? `+${n}` : `−${-n}`);

/** A per-card differential so cards on different courses and lengths rank fairly (lower is better). */
function cardDiff(s: RoundSummary): number {
  const tee = teeOf(s.course, s.round.teeName);
  const nine = s.holes.length < 18 && s.course.holes.length === 18;
  const rating = nine ? tee.rating / 2 : tee.rating;
  const d = (113 / tee.slope) * (s.gross - rating);
  return nine ? d * 2 : d;
}

/** Did this card beat the goal? */
export function metGoal(s: RoundSummary, goal: Goal | null): boolean {
  if (!goal) return false;
  if (goal === "scratch") return s.toPar <= 0;
  const best = goalTarget[goal] - 1;
  return s.holes.length >= 18 ? s.gross <= best : s.gross <= Math.floor(best / 2);
}

const tierFor = (rank: number, of: number): Tier | null => (rank === 1 ? "gold" : rank <= 3 ? "silver" : rank <= Math.max(1, Math.ceil(of / 4)) ? "bronze" : null);

/** Holes in order with strokes, for streak checks. */
const strokesSeq = (s: RoundSummary) => s.holes.map((h) => ({ h, st: s.round.entries[h.n]?.strokes ?? null }));

export function computeTrophies(
  rounds: Round[],
  custom: Course[],
  goal: Goal | null,
  handicapHistory: { date: string; index: number }[],
  now: Date = new Date(),
  index: number | null = null,
): TrophyState {
  const done = rounds
    .filter((r) => r.status === "complete")
    .sort((a, b) => a.date.localeCompare(b.date) || (a.finishedAt ?? a.createdAt) - (b.finishedAt ?? b.createdAt))
    .map((r) => summarize(r, custom))
    .filter((s): s is RoundSummary => !!s && s.complete);

  const earned: EarnedTrophy[] = [];
  const add = (e: Omit<EarnedTrophy, "key" | "finishedAt"> & { key?: string }, s?: RoundSummary) =>
    earned.push({ ...e, key: e.key ?? `${e.id}:${e.roundId}`, finishedAt: s ? (s.round.finishedAt ?? s.round.createdAt) : null });
  const once = new Set<string>();
  const addOnce = (e: Omit<EarnedTrophy, "key" | "finishedAt">, s?: RoundSummary) => { if (once.has(e.id)) return; once.add(e.id); add({ ...e, key: e.id }, s); };
  const sumById = new Map(done.map((s) => [s.round.id, s]));

  // Honors, mapped one to one (the Locker shows these same milestones).
  const honorMap: Record<string, string> = { "first-card": "first-card", "first-birdie": "first-birdie", "first-eagle": "", "par-run-3": "par-run", "broke-100": "broke-100", "broke-90": "broke-90", "broke-80": "broke-80", "broke-72": "under-72" };
  for (const h of honors(rounds, custom, handicapHistory)) {
    const s = h.roundId ? sumById.get(h.roundId) : undefined;
    if (h.id.startsWith("low-")) { add({ id: "low-index", key: h.id, tier: "silver", date: h.date, roundId: "", detail: `Down to ${h.detail}`, honorId: h.id }); continue; }
    if (h.id.startsWith("best-")) { add({ id: "course-record", key: h.id, tier: "silver", date: h.date, roundId: h.roundId, detail: `${h.title.replace("New best at ", "")}: ${h.detail}`, honorId: h.id }, s); continue; }
    const id = honorMap[h.id];
    if (id) addOnce({ id, tier: trophyDef(id).tier, date: h.date, roundId: h.roundId, detail: h.detail, honorId: h.id }, s);
  }

  // Per-card trophies: crystal and the rest of the career shelf.
  let yearLow: RoundSummary | null = null;
  const year = String(now.getFullYear());
  done.forEach((s, i) => {
    const r = s.round;
    const where = s.course.shortName;
    const detailed = r.totalOnly == null;
    const count = i + 1;
    for (const [n, id] of [[5, "cards-5"], [10, "cards-10"], [25, "cards-25"]] as const) {
      if (count === n) addOnce({ id, tier: trophyDef(id).tier, date: r.date, roundId: r.id, detail: `Card ${n}: ${s.gross} at ${where}` }, s);
    }
    if (s.course.tags.includes("links")) addOnce({ id: "links", tier: "bronze", date: r.date, roundId: r.id, detail: `${s.gross} at ${where}` }, s);
    if (s.holes.length === 18 && r.date.startsWith(year) && (!yearLow || s.gross < yearLow.gross)) yearLow = s;
    if (!detailed) return;

    const seq = strokesSeq(s);
    let run = 0;
    seq.forEach(({ h, st }) => {
      if (st == null) { run = 0; return; }
      const d = st - h.par;
      const hole = `the ${ORD(h.n)}${h.name ? ` (${h.name})` : ""}`;
      if (d <= -2) add({ id: "goblet", key: `goblet:${r.id}:${h.n}`, tier: "crystal", date: r.date, roundId: r.id, detail: `${st} on ${hole}, par ${h.par}, ${where}` }, s);
      if (st === 1) add({ id: "ace", key: `ace:${r.id}:${h.n}`, tier: "crystal", date: r.date, roundId: r.id, detail: `${hole}, ${h.yards} yards, ${where}` }, s);
      if (d <= -3) add({ id: "albatross", key: `alb:${r.id}:${h.n}`, tier: "crystal", date: r.date, roundId: r.id, detail: `${st} on ${hole}, par ${h.par}, ${where}` }, s);
      run = d < 0 ? run + 1 : 0;
      if (run === 2) add({ id: "twin", key: `twin:${r.id}:${h.n}`, tier: "crystal", date: r.date, roundId: r.id, detail: `Holes ${h.n - 1} and ${h.n}, ${where}` }, s);
      if (run === 3) add({ id: "decanter", key: `dec:${r.id}:${h.n}`, tier: "crystal", date: r.date, roundId: r.id, detail: `Holes ${h.n - 2} to ${h.n}, ${where}` }, s);
    });

    const at = (n: number) => { const x = seq.find((q) => q.h.n === n); return x && x.st != null ? x.st - x.h.par : null; };
    const amen = [11, 12, 13].map(at);
    if (amen.every((d) => d != null && d <= 0)) addOnce({ id: "amen", tier: "gold", date: r.date, roundId: r.id, detail: `${amen.map((d) => toParText(d!)).join(", ")} through 11–13, ${where}` }, s);

    const par3s = seq.filter((q) => q.h.par === 3);
    if (s.holes.length === 18 && par3s.length >= 3 && par3s.every((q) => q.st != null && q.st <= 3)) addOnce({ id: "par3", tier: "silver", date: r.date, roundId: r.id, detail: `All ${par3s.length} par 3s at par or better, ${where}` }, s);

    const nines = s.holes.length === 18 ? [seq.slice(0, 9), seq.slice(9)] : [seq];
    nines.forEach((nine, k) => {
      if (nine.length === 9 && nine.every((q) => q.st != null && q.st <= q.h.par)) {
        const label = s.holes.length === 18 ? (k === 0 ? "Front nine" : "Back nine") : "Nine";
        addOnce({ id: "clean-nine", tier: "gold", date: r.date, roundId: r.id, detail: `${label} with nothing over par, ${where}` }, s);
      }
    });

    if (s.holes.length === 18 && s.front != null && s.back != null) {
      const fp = s.holes.filter((h) => h.n <= 9).reduce((a, h) => a + h.par, 0);
      const bp = s.holes.filter((h) => h.n > 9).reduce((a, h) => a + h.par, 0);
      if (s.back - bp < s.front - fp) addOnce({ id: "strong-finish", tier: "bronze", date: r.date, roundId: r.id, detail: `Out ${s.front}, home in ${s.back}, ${where}` }, s);
    }
    if (s.holes.length === 18 && s.fairways >= 10) addOnce({ id: "fairways", tier: "silver", date: r.date, roundId: r.id, detail: `${s.fairways} of ${s.fairwayHoles} fairways, ${where}` }, s);
    const allPutts = s.holes.length === 18 && s.puttHoles === 18;
    if (allPutts) addOnce({ id: "full-card", tier: "bronze", date: r.date, roundId: r.id, detail: `${s.putts} putts at ${where}` }, s);
    if (allPutts && s.holes.every((h) => (r.entries[h.n]?.putts ?? 0) < 3)) addOnce({ id: "lag-master", tier: "silver", date: r.date, roundId: r.id, detail: `${s.putts} putts, no three-putts, ${where}` }, s);
  });
  const yl = yearLow as RoundSummary | null;
  if (yl) add({ id: "salver", key: "salver", tier: "silver", date: yl.round.date, roundId: yl.round.id, detail: `${yl.gross} at ${yl.course.shortName}, low of ${year}` }, yl);

  // Weeks: every week that has cards, judged on its own (rank among cards up to that week's end).
  const weeks = new Map<string, RoundSummary[]>();
  for (const s of done) { const w = weekStart(s.round.date); weeks.set(w, [...(weeks.get(w) ?? []), s]); }
  const diffs = new Map(done.map((s) => [s.round.id, cardDiff(s)]));
  const challenges = computeChallenges(rounds, custom, goal, index);
  const metChallenge = new Map(challenges.history.filter((v) => v.status === "met").map((v) => [v.roundId, v]));
  const weekRanks = new Map<string, WeekRank>();

  const sortedWeeks = [...weeks.keys()].sort();
  let streak = 0, prevWeek: string | null = null;
  for (const w of sortedWeeks) {
    const cards = weeks.get(w)!;
    const end = addDays(w, 6);
    const pool = done.filter((s) => s.round.date <= end).map((s) => diffs.get(s.round.id)!).sort((a, b) => a - b);
    const best = cards.reduce((a, b) => (diffs.get(b.round.id)! < diffs.get(a.round.id)! ? b : a));
    const bd = diffs.get(best.round.id)!;
    const rank = pool.filter((d) => d < bd - 1e-9).length + 1;
    const tier = tierFor(rank, pool.length);
    weekRanks.set(w, { rank, of: pool.length, roundId: best.round.id, gross: best.gross, toPar: best.toPar, holes: best.holes.length, course: best.course.shortName, date: best.round.date, tier });
    if (tier) add({ id: "week-low", key: `week-low:${w}`, tier, date: best.round.date, roundId: best.round.id, detail: `${best.gross} at ${best.course.shortName} · ranks #${rank} of ${pool.length}` }, best);
    const jacket = cards.find((s) => metGoal(s, goal));
    if (jacket) add({ id: "week-jacket", key: `week-jacket:${w}`, tier: "gold", date: jacket.round.date, roundId: jacket.round.id, detail: `${jacket.gross} at ${jacket.course.shortName}, goal beaten` }, jacket);
    const ch = cards.map((s) => metChallenge.get(s.round.id)).find(Boolean);
    if (ch) add({ id: "week-challenge", key: `week-challenge:${w}`, tier: "silver", date: ch.date, roundId: ch.roundId, detail: `${ch.challenge.title}: ${ch.text}` }, sumById.get(ch.roundId));

    streak = prevWeek && addDays(prevWeek, 7) === w ? streak + 1 : 1;
    prevWeek = w;
    if (streak === 3) addOnce({ id: "regular", tier: "bronze", date: cards[cards.length - 1].round.date, roundId: cards[cards.length - 1].round.id, detail: `Cards three weeks running, to the week of ${new Date(w + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` }, cards[cards.length - 1]);
  }

  earned.sort((a, b) => b.date.localeCompare(a.date) || (b.finishedAt ?? 0) - (a.finishedAt ?? 0));
  const byId = new Map<string, EarnedTrophy[]>();
  for (const e of earned) byId.set(e.id, [...(byId.get(e.id) ?? []), e]);

  // This week
  const start = weekStart(now);
  const daysLeft = 7 - ((now.getDay() + 6) % 7);
  const cardsNow = weeks.get(start) ?? [];
  const win = (id: string) => earned.find((e) => e.id === id && weekStart(e.date) === start) ?? null;
  const rank = weekRanks.get(start) ?? null;
  const left = daysLeft === 1 ? "Today is the last day" : `${daysLeft} days left`;
  const lowWon = win("week-low");
  const jacketWon = win("week-jacket");
  const chWon = win("week-challenge");
  const goalWord = goal === "scratch" ? "Play to par" : goal ? `Break ${goal}` : null;
  const slots: WeekSlot[] = [
    {
      def: trophyDef("week-low"), won: lowWon,
      note: lowWon ? `${rank!.gross} at ${rank!.course}: your ${rank!.rank === 1 ? "best card yet" : `${ORD(rank!.rank)} best of ${rank!.of} cards`}.`
        : rank ? `Your best this week ranks #${rank.rank} of ${rank.of}. A top-quarter card wins bronze. ${left}.`
        : `Play this week to compete for it. ${left}.`,
      short: lowWon ? `${rank!.gross} at ${rank!.course}` : rank ? "Top quarter wins" : "Play to compete",
    },
    {
      def: trophyDef("week-jacket"), won: jacketWon,
      note: jacketWon ? jacketWon.detail
        : !goalWord ? "Set a goal in the Locker to play for the Jacket."
        : `${goalWord} this week to wear it. ${left}.`,
      short: jacketWon ? "Goal beaten" : goalWord ? `${goalWord} to win` : "Set a goal",
    },
    {
      def: trophyDef("week-challenge"), won: chWon,
      note: chWon ? chWon.detail : `Meet “${challenges.next.title.toLowerCase()}” this week. ${left}.`,
      short: chWon ? "Challenge met" : "Meet your challenge",
    },
  ];

  return {
    earned,
    byId,
    wonCount: CATALOG.filter((t) => byId.has(t.id)).length,
    total: CATALOG.length,
    thisWeek: { start, end: addDays(start, 6), daysLeft, cards: cardsNow.length, rank, slots },
  };
}

/** Is this win new since the golfer's last visit? Honors use store.honorsSeen; the rest compare the card's finish time. */
export function isFresh(e: EarnedTrophy, honorsSeen: string[], since: number | null): boolean {
  if (e.honorId) return !honorsSeen.includes(e.honorId);
  if (since == null || e.finishedAt == null) return false;
  return e.finishedAt > since;
}
