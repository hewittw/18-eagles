"use client";
import { PageHeader } from "@/components/golf";
import { ArrowIcon, ButtonLink, Icon } from "@/components/ui";
import { formatIndex } from "@/lib/handicap";
import { useClub } from "@/lib/hooks";
import { goalTarget } from "@/lib/stats";
import { Page } from "../../_components/Placeholder";

const SECTIONS: [numeral: string, title: string, what: string][] = [
  ["I", "The trend", "Every card on one line, with a five-round average and your goal drawn across it. Switch between score, to par, and your index."],
  ["II", "How you score", "Your mix of birdies, pars, and bogeys, and whether par 3s, 4s, or 5s cost you most."],
  ["III", "Putting and greens", "Putts per round and per hole, greens in regulation, fairways, penalties, and your front nine against your back."],
  ["IV", "Clubs you reach for", "The clubs you tap on the hole screen, and how often each tee club finds the fairway."],
  ["V", "One course, hole by hole", "Pick a course and see which holes take strokes from you."],
  ["VI", "How your index is made", "Your last 20 differentials, with the ones that count marked, and the next to drop off."],
];

/** No finished cards yet: say what's coming, keep the goal in view, and offer the two ways to fill it. */
export function EarlyStats() {
  const { store, handicap } = useClub();
  const goal = store.profile.goal;
  const goalText = goal === "scratch" ? "Play to scratch" : goal ? `Break ${goalTarget[goal]}` : null;
  return (
    <Page className="grid gap-12">
      <PageHeader eyebrow="Breakdowns" title="Stats" lede="Your playing over time. It fills in from your first card." />

      <section aria-labelledby="goal-h" className="tex-locker on-green grid gap-6 rounded-2xl px-5 py-7 shadow-card sm:px-8 sm:py-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 id="goal-h" className="caps text-label text-gold">Your goal</h2>
          <p className="mt-2 font-display text-display-2 text-on-green">{goalText ?? "Not chosen yet"}</p>
          <p className="mt-3 max-w-measure text-paper-3">
            {goalText ? "After your first card, the trend draws this line so you can see how far off it you are." : "Choose one and it's drawn across your trend."}
            {handicap.entered != null && ` You play off ${formatIndex(handicap.entered)} until 3 cards earn a calculated index.`}
          </p>
          {!goalText && <ButtonLink href="/clubhouse/locker" variant="quiet" tone="green" size="sm" className="-ml-3 mt-2 flex-row-reverse" icon={<ArrowIcon />}>Choose a goal in the Locker</ButtonLink>}
        </div>
        {/* One primary, one secondary: the same size, side by side from sm, the same width stacked on phones */}
        <div className="grid gap-2.5 sm:grid-cols-2 md:min-w-[26rem]">
          <ButtonLink href="/clubhouse" variant="primary" tone="green" size="lg" icon={<Icon name="play" />}>Tee off</ButtonLink>
          <ButtonLink href="/clubhouse/rounds/new" variant="secondary" tone="green" size="lg" icon={<Icon name="pencil" />}>Log a round</ButtonLink>
        </div>
      </section>

      <section aria-labelledby="coming-h">
        <h2 id="coming-h" className="font-display text-title text-ink">What you&apos;ll see after your first card</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {SECTIONS.map(([num, title, what]) => (
            <li key={num} className="grid grid-cols-[2.75rem_1fr] gap-x-3.5 rounded-xl border border-rule/70 bg-paper-2 p-4 shadow-card sm:p-5">
              <span className="grid size-11 place-items-center rounded-sm bg-tint font-display text-[1.1rem] leading-none text-green" aria-hidden="true">{num}</span>
              <div>
                <h3 className="font-serif text-[1.15rem] font-semibold leading-snug text-ink">{title}</h3>
                <p className="mt-1 text-[0.98rem] leading-relaxed text-ink-2">{what}</p>
                {num === "VI" && <p className="mt-2 caps text-[0.74rem] text-gold-ink">{handicap.roundsToFirst} cards to your first calculated index</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Page>
  );
}
