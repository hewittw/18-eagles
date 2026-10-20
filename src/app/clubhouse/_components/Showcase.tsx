"use client";
// The first visit only (setup step 0, nothing saved): under the hero's one question, a skimmable look at what the
// journal gives back. Not a tour: the index question stays the main action, and every piece here is a real feature.
import Image from "next/image";
import Link from "next/link";
import { TrophyArt } from "@/components/golf/TrophyArt";
import { Button, Chevron, cx } from "@/components/ui";
import { BUILT_IN, findCourse } from "@/lib/courses";
import { withSampleSeason } from "@/lib/sample";
import { update } from "@/lib/store";
import { CATALOG, TIER_WORD, trophyDef } from "@/lib/trophies";
import { VerdictMark } from "./Challenge";
import { focusHeading } from "./Onboarding";

const SHELF = ["week-low", "week-jacket", "goblet", "amen", "broke-90", "ace"];
const CATEGORY_WORD = { weekly: "Weekly", crystal: "Crystal", career: "Career" } as const;
const COURSES = ["augusta-national", "pebble-beach", "st-andrews-old", "pinehurst-no-2", "torrey-pines-south", "tpc-sawgrass"];

/** Focus the hero's Handicap Index field (the first visit's one question). */
function focusIndex() {
  const input = document.querySelector<HTMLInputElement>('section[aria-labelledby="hero-title"] input');
  if (!input) return;
  input.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  input.focus({ preventScroll: true });
}

export function NewGolferShowcase() {
  return (
    <section aria-labelledby="showcase" className="grid gap-6 md:gap-8">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="caps text-label text-gold-ink">What every card earns you</p>
          <h2 id="showcase" className="mt-1 max-w-3xl text-balance font-display text-display-2 text-ink">Play the round. The clubhouse keeps the score, the index and the silverware.</h2>
        </div>
        <Button variant="secondary" onClick={focusIndex}>Start with your index</Button>
      </div>

      <TrophyShelf />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-4">
        <HoleMock />
        <IndexMock />
        <ChallengeMock />
      </div>

      <CourseStrip />

      <div className="grid gap-4 rounded-xl bg-tint p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
        <div className="min-w-0">
          <h3 id="just-looking" className="font-serif text-xl font-bold text-ink">Just looking?</h3>
          <p className="mt-1 max-w-measure text-ink-2">
            Explore a sample season: 13 rounds at Rancho Santa Fe, Torrey Pines, Pebble Beach and St Andrews, with a handicap, stats and a trophy case already filling up. Erase it from the Locker when you&apos;re ready to start your own.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { update((s) => withSampleSeason(s)); focusHeading("hero-title"); }}>Explore a sample season</Button>
          <Button variant="quiet" onClick={focusIndex}>Start with your index</Button>
        </div>
      </div>
    </section>
  );
}

/** A green cabinet of trophies still to be won: brass outlines, each with its name and how to win it. */
function TrophyShelf() {
  const weekly = CATALOG.filter((t) => t.category === "weekly").length;
  const crystal = CATALOG.filter((t) => t.category === "crystal").length;
  return (
    <div className="tex-locker on-green overflow-hidden rounded-2xl border border-green-3 shadow-card">
      <div className="px-4 pt-6 sm:px-7 sm:pt-7">
        <p className="caps text-label text-gold">The Trophy Room</p>
        <h3 className="mt-1 font-display text-title text-on-green">{CATALOG.length} trophies to win. None on the shelf yet.</h3>
        <p className="mt-2 max-w-2xl font-serif text-lede text-paper-3">
          {weekly} are played for every week and the case empties each Monday. {crystal} are crystal, won every time it happens. The rest are career milestones on the way to your goal.
        </p>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-px border-t border-white/15 bg-white/15 sm:grid-cols-3 lg:grid-cols-6">
        {SHELF.map((id, i) => {
          const t = trophyDef(id);
          return (
            <li key={id} className="trophy-rise flex min-w-0 flex-col items-center bg-green-3 px-3 pb-5 pt-5 text-center" style={{ ["--i" as string]: i }}>
              <div className="relative w-full">
                <div className="mx-auto size-[4.5rem] text-gold sm:size-20">
                  <TrophyArt art={t.art} tier={t.tier} locked className="size-full" />
                </div>
                <span aria-hidden="true" className="mx-auto mt-1 block h-1 w-24 rounded-full bg-black/25" />
              </div>
              <p className="caps mt-3 text-[0.64rem] text-gold">{t.category === "crystal" ? "Crystal" : `${CATEGORY_WORD[t.category]} · ${id === "week-low" ? "Gold to bronze" : TIER_WORD[t.tier]}`}</p>
              <h4 className="mt-1 font-serif text-[1.1rem] leading-tight text-on-green">{t.name}</h4>
              <p className="mt-1 text-pretty text-[0.86rem] leading-snug text-paper-3">{id === "week-low" ? "Your best card of the week, ranked against all your cards." : t.how}</p>
            </li>
          );
        })}
      </ul>
      <style>{`@media (prefers-reduced-motion: no-preference) { .trophy-rise { animation: trophy-rise 520ms var(--ease-hang) both; animation-delay: calc(var(--i, 0) * 70ms); } @keyframes trophy-rise { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } } }`}</style>
    </div>
  );
}

function MockCard({ title, children, caption, className }: { title: string; children: React.ReactNode; caption: string; className?: string }) {
  return (
    <div className={cx("flex min-w-0 flex-col rounded-xl border border-rule/70 bg-paper-2 p-5 shadow-card sm:p-6", className)}>
      <h3 className="font-serif text-xl font-bold text-ink">{title}</h3>
      <p className="mt-1 text-[0.95rem] text-ink-2">{caption}</p>
      <div className="mt-5 flex flex-1 flex-col justify-end">{children}</div>
    </div>
  );
}

/** A still of the hole screen: the score tiles and the club chips. */
function HoleMock() {
  const par = 3;
  const tiles = [1, 2, 3, 4, 5, 6];
  const words: Record<number, string> = { 1: "Ace", 2: "Birdie", 3: "Par", 4: "Bogey", 5: "Double", 6: "Triple" };
  const clubs = ["Dr", "7i", "8i", "9i", "PW", "56°", "Pt"];
  return (
    <MockCard title="Every hole, one tap" caption="Tap the clubs you hit and they count your score, or just tap the score. Putts and notes are optional." className="md:col-span-2 lg:col-span-1">
      <div role="img" aria-label="Example hole screen: hole 12, par 3, 155 yards. A score of 3, par, is chosen, from an 8-iron and two putts." className="rounded-lg bg-paper-3 p-3 sm:p-4">
        <div aria-hidden="true">
          <p className="flex items-baseline justify-between">
            <span className="font-display text-2xl text-ink">Hole 12</span>
            <span className="font-numeral text-ink-2">Par 3 · 155 yds</span>
          </p>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {tiles.map((n) => {
              const on = n === 3;
              return (
                <span key={n} className={cx("flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border shadow-card", on ? "border-green bg-green text-on-green" : "border-rule bg-paper-2 text-ink")}>
                  <span className={cx("font-numeral text-[1.9rem] font-semibold leading-none", !on && n < par && "text-under")}>{n}</span>
                  <span className={cx("caps text-[0.55rem] leading-none tracking-[0.04em]", on ? "text-gold" : "text-ink-2")}>{words[n]}</span>
                </span>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {clubs.map((c) => (
              <span key={c} className={cx("grid min-h-10 place-items-center rounded-lg border font-numeral text-[1.05rem] font-semibold sm:text-lg", c === "8i" || c === "Pt" ? "border-green bg-tint text-green" : "border-rule bg-paper-2 text-ink")}>{c}</span>
            ))}
          </div>
          <p className="mt-3 flex flex-wrap items-center gap-2 font-numeral text-lg font-semibold text-ink">
            <span className="caps text-[0.66rem] font-semibold text-ink-2">Shots</span> 8i <span className="text-ink-2">→</span> Pt <span className="text-ink-2">→</span> <span className="rounded-xs bg-green px-1.5 text-on-green">Pt</span>
          </p>
        </div>
      </div>
    </MockCard>
  );
}

/** A worked-out index with its trend line. */
function IndexMock() {
  const pts = [18.4, 18.1, 17.2, 17.6, 16.4, 16.0, 15.1, 15.4, 14.2];
  const w = 240, h = 64, max = 19, min = 13.5;
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <MockCard title="Your handicap, worked out for you" caption="From your own cards with the World Handicap System math. Three cards to your first index.">
      <div role="img" aria-label="Example: a Handicap Index of 14.2, down from 18.4 over nine cards.">
        <div aria-hidden="true">
          <p className="caps text-label text-gold-ink">Handicap Index</p>
          <p className="flex items-baseline gap-3">
            <span className="font-display text-[3.6rem] leading-none text-ink">14.2</span>
            <span className="font-numeral text-lg text-green">Down 4.2</span>
          </p>
          <svg viewBox={`-4 -6 ${w + 8} ${h + 12}`} className="mt-3 h-16 w-full" preserveAspectRatio="none">
            <path d={`${d} L${w} ${h + 6} L0 ${h + 6} Z`} fill="var(--color-tint)" />
            <path d={d} fill="none" stroke="var(--color-green)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <circle cx={xy[xy.length - 1][0]} cy={xy[xy.length - 1][1]} r="4" fill="var(--color-green)" />
          </svg>
        </div>
      </div>
    </MockCard>
  );
}

/** The coach's one target for the next round. */
function ChallengeMock() {
  const marks = ["met", "missed", "met", "met", "met"] as const;
  return (
    <MockCard title="A challenge every round" caption="One target from where your strokes go, set by your goal. Meet it and the trophy case fills.">
      <div role="img" aria-label="Example challenge: two three-putts or fewer. Four of the last five challenges met.">
        <div aria-hidden="true" className="rounded-lg bg-green-3 p-4 text-on-green">
          <p className="caps text-[0.66rem] text-gold">Your challenge for the next round</p>
          <p className="mt-1 font-display text-[1.6rem] leading-tight">Two three-putts or fewer</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {marks.map((m, i) => <VerdictMark key={i} status={m} size="sm" />)}
          </div>
        </div>
      </div>
    </MockCard>
  );
}

/** A strip of the built-in courses, each a link to its page. */
function CourseStrip() {
  const list = COURSES.map((s) => findCourse(s)).filter((c) => !!c && c.hero);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="font-serif text-xl font-bold text-ink">{BUILT_IN.length} courses ready, from Augusta to St Andrews</h3>
        <Link href="/clubhouse/courses" className="group inline-flex min-h-tap items-center gap-2 font-semibold text-green is-hover:underline">
          See all {BUILT_IN.length} courses <Chevron className="text-green" />
        </Link>
      </div>
      <p className="mt-1 text-ink-2">Every tee, par, yardage and rating loaded. Add your own course in a minute.</p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {list.map((c) => (
          <li key={c!.slug} className="min-w-0 max-sm:[&:nth-child(n+5)]:hidden">
            <Link href={`/clubhouse/courses/${c!.slug}`} className="group/c block overflow-hidden rounded-xl border border-rule/70 bg-paper-2 shadow-card transition-transform duration-150 is-pressed:scale-[0.98]">
              <span className="relative block aspect-[4/3] bg-tint">
                <Image src={c!.hero!.src} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px" className="object-cover transition-transform duration-300 group-hover/c:scale-[1.03]" />
              </span>
              <span className="block p-3">
                <span className="block truncate font-serif text-[1.02rem] text-ink">{c!.shortName}</span>
                <span className="block truncate text-sm text-ink-2">{c!.city}, {c!.region}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
