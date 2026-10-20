"use client";
// "Your challenge for the next round": the coach's one target, derived from the cards (src/lib/challenge.ts).
import Link from "next/link";
import { useMemo, useState } from "react";
import { fmtDate } from "@/components/golf/charts";
import { Card, cx } from "@/components/ui";
import { computeChallenges, type Verdict } from "@/lib/challenge";
import { useClub } from "@/lib/hooks";

/** The challenge state for the saved cards, the golfer's goal and index. */
export function useChallenges() {
  const { store, handicap } = useClub();
  return useMemo(
    () => computeChallenges(store.rounds, store.customCourses, store.profile.goal, handicap.display),
    [store.rounds, store.customCourses, store.profile.goal, handicap.display],
  );
}

const STATUS_WORD = { met: "met", missed: "missed", skipped: "skipped" } as const;

/** A drawn mark: a check for met, a cross for missed, a dash for skipped. Shape carries the meaning, not color. */
export function VerdictMark({ status, size = "md", tone = "green" }: { status: Verdict["status"]; size?: "sm" | "md"; tone?: "green" | "paper" }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const box = size === "sm" ? "size-7" : "size-8 sm:size-9";
  const face =
    tone === "green"
      ? status === "met" ? "bg-gold text-green-3 border-gold" : status === "missed" ? "border-on-green text-on-green" : "border-dashed border-on-green/80 text-on-green"
      : status === "met" ? "bg-green text-on-green border-green" : status === "missed" ? "border-ink text-ink" : "border-dashed border-ink-2 text-ink-2";
  return (
    <span aria-hidden="true" className={cx("grid shrink-0 place-items-center rounded-full border-2", box, face)}>
      <svg viewBox="0 0 20 20" className="size-[62%]">
        {status === "met" && <path {...p} d="M4.5 10.5 L8.5 14.5 L15.5 5.5" />}
        {status === "missed" && <path {...p} d="M5.5 5.5 L14.5 14.5 M14.5 5.5 L5.5 14.5" />}
        {status === "skipped" && <path {...p} d="M5.5 10 H14.5" />}
      </svg>
    </span>
  );
}

export function NextChallenge({ className }: { className?: string }) {
  const { ready, store } = useClub();
  const { next, history, streak, last } = useChallenges();
  // The clubhouse stamps lastVisit as soon as it opens, so hold on to the value this visit started with.
  const [since, setSince] = useState<number | null | undefined>(undefined);
  if (ready && since === undefined) setSince(store.lastVisit ?? null);
  if (!ready) return null;

  const lastRound = last ? store.rounds.find((r) => r.id === last.roundId) : undefined;
  const fresh = !!last && !!lastRound && (since == null || (lastRound.finishedAt ?? lastRound.createdAt) > since);
  const recent = history.slice(-8);
  const judged = recent.filter((v) => v.status !== "skipped");
  const metCount = judged.filter((v) => v.status === "met").length;

  return (
    <section aria-labelledby="challenge" className={className}>
      <Card tone="green" padding="lg" className="grid gap-7 shadow-card md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
        <div className="min-w-0">
          {fresh && last && (
            <p className="mb-6 flex items-start gap-3 rounded-lg bg-black/15 px-4 py-3 text-on-green">
              <VerdictMark status={last.status} size="sm" />
              <span className="min-w-0">
                <span className="caps block text-[0.72rem] text-gold">Last round · {last.course}, {fmtDate(last.date)}</span>
                <span className="mt-0.5 block font-serif text-lg leading-snug">
                  {last.status === "met" ? "Challenge met" : last.status === "missed" ? "Challenge missed" : "Challenge skipped"}: {last.text}.
                </span>
                <Link href={`/clubhouse/rounds/${last.roundId}`} className="link mt-1 inline-block text-sm">See the card</Link>
              </span>
            </p>
          )}
          <h2 id="challenge">
            <span className="caps block text-label text-gold">Your challenge for the next round</span>
            <span className="mt-2 block text-balance font-display text-display-2 text-on-green">{next.title}</span>
          </h2>
          <p className="mt-3 max-w-xl text-pretty font-serif text-lede text-paper-3">{next.why}</p>
        </div>

        {recent.length > 0 && (
          <div className="min-w-0 md:justify-self-end md:text-right">
            {streak > 0 ? (
              <p className="flex items-baseline gap-2 md:justify-end">
                <span className="font-numeral text-5xl font-semibold leading-none tabular-nums text-on-green">{streak}</span>
                <span className="font-serif text-lg text-paper-3">met in a row</span>
              </p>
            ) : (
              <p className="font-serif text-lg text-paper-3">Meet this one to start a streak.</p>
            )}
            <p className="caps mt-4 text-[0.72rem] text-gold">
              Last {recent.length} {recent.length === 1 ? "challenge" : "challenges"} · {metCount} of {judged.length} met
            </p>
            <ol className="mt-2 flex flex-wrap gap-1.5 md:justify-end" aria-label={`Your last ${recent.length} challenges, oldest first`}>
              {recent.map((v) => (
                <li key={v.roundId}>
                  <VerdictMark status={v.status} />
                  <span className="sr-only">
                    {fmtDate(v.date)}, {v.course}: {v.challenge.title}, {STATUS_WORD[v.status]}, {v.text}.
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Card>
    </section>
  );
}

/** The verdict for one card, for the round card page. Null for a card still being played. */
export function useVerdict(roundId: string) {
  const { history } = useChallenges();
  return history.find((v) => v.roundId === roundId) ?? null;
}
