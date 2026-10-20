import Link from "next/link";
import { WHS_TABLE } from "@/lib/handicap";
import { fmtDate } from "@/components/golf";
import { Callout, SectionHeading } from "@/components/ui";
import { formatIndex, keyOf, type HandicapState } from "@/lib/handicap";

// How many differentials count, by record length (World Handicap System table). Mirrors lib/handicap.ts.
// How many differentials count, from the same WHS table the index uses.
const COUNTS: Record<number, number> = Object.fromEntries(Object.entries(WHS_TABLE).map(([n, [count]]) => [n, count]));
const ADJUSTED = new Set([3, 4, 6]);

function Star() {
  return <svg viewBox="0 0 8 8" className="size-2.5 shrink-0" aria-hidden="true"><path d="M4 0 L5 3 L8 4 L5 5 L4 8 L3 5 L0 4 L3 3 Z" fill="currentColor" /></svg>;
}

/**
 * The Tad Dorgan idea: the handicap is a number golfers argue about, so show how it's made.
 * The last 20 differentials, the ones that count set in brass on Locker Green with the word "Counts".
 */
export function IndexLedger({ handicap: h }: { handicap: HandicapState }) {
  const n = h.differentials.length;
  const k = COUNTS[Math.min(n, 20)] ?? 0;
  const rule =
    n >= 20
      ? "Your index is the average of the best 8 of your last 20 score differentials."
      : n >= 3
        ? `With ${n} differentials, your index is the average of the best ${k === 1 ? "one" : k}${ADJUSTED.has(n) ? ", with the small adjustment the World Handicap System makes for short records" : ""}. At 20, it becomes the best 8 of your last 20.`
        : "Once you have 3 differentials, your index is the average of the best of them; at 20, it's the best 8 of your last 20.";
  const drop = h.nextToDrop;

  return (
    <section aria-labelledby="index-h" className="grid gap-6">
      <SectionHeading
        id="index-h"
        eyebrow="The handicap committee"
        title="How your index is made"
        lede={rule}
      />

      {h.roundsToFirst > 0 && (
        <Callout tone="gold" title={`${h.roundsToFirst} more ${h.roundsToFirst === 1 ? "card" : "cards"} to your first calculated index`}>
          {h.entered != null
            ? `Until then you play off the ${formatIndex(h.entered)} you entered.`
            : "Two nine-hole cards in a row pair up into one differential."}
        </Callout>
      )}

      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          {n ? (
            <div className="scroll-x rounded-xl border border-rule/70 bg-paper-2 shadow-card">
              <table className="w-full  border-collapse text-left">
                <caption className="sr-only">Your most recent {n} score differentials, newest first. {k ? `The ${k} lowest count toward your index.` : ""}</caption>
                <thead>
                  <tr className="border-b border-rule">
                    {["Date", "Course", "Adj. gross", "Differential", "Index"].map((c, i) => (
                      <th key={c} scope="col" className={`caps py-2.5 pr-3 text-[0.74rem] text-ink-2 first:pl-3 sm:pr-4 ${i >= 2 ? "text-right" : ""} ${i === 0 || i === 4 ? "hidden sm:table-cell" : ""} ${i === 1 ? "pl-3 sm:pl-0" : ""}`}>{c === "Index" ? <span>Counts<span className="sr-only"> toward your index</span></span>
                        : c === "Adj. gross" ? <span className="whitespace-nowrap"><span aria-hidden="true" className="max-sm:hidden">Adj. gross</span><span aria-hidden="true" className="sm:hidden">Gross</span><span className="sr-only">Adjusted gross</span></span>
                        : c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {h.differentials.map((d) => {
                    const counts = h.counting.has(keyOf(d));
                    const isDrop = drop && keyOf(drop) === keyOf(d);
                    return (
                      <tr key={keyOf(d)} className={counts ? "on-green border-b border-white/15 bg-green-3 text-on-green last:border-b-0" : "border-b border-rule/80 last:border-b-0"}>
                        <td className="hidden whitespace-nowrap py-2.5 pl-3 pr-4 font-numeral sm:table-cell text-[1rem] tabular-nums">{fmtDate(d.date, { month: "short", day: "numeric", year: "2-digit" })}</td>
                        <th scope="row" className="py-2.5 pl-3 pr-3 text-[0.98rem] font-normal sm:pl-0 sm:pr-4">
                          <span className={`block font-numeral text-[0.9rem] tabular-nums sm:hidden ${counts ? "text-paper-3" : "text-ink-2"}`}>{fmtDate(d.date, { month: "short", day: "numeric", year: "2-digit" })}</span>
                          <Link href={`/clubhouse/rounds/${d.roundIds[0]}`} className={`inline-block min-h-6 rounded-xs py-1 font-semibold transition-colors ${counts ? "text-on-green is-hover:text-gold" : "text-green is-hover:text-green-2"}`}>
                            {/* The chevron stays on the line with the name's last word */}
                            {d.courseName.split(" ").slice(0, -1).join(" ")}{d.courseName.includes(" ") ? " " : ""}
                            <span className="whitespace-nowrap">
                              {d.courseName.split(" ").pop()}
                              <svg viewBox="0 0 10 16" className="ml-1.5 inline-block h-3 w-2 align-[-0.05em] opacity-70" aria-hidden="true"><path d="M2 2 L8 8 L2 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </span>
                          </Link>
                          {isDrop && <span className={`caps ml-2 text-[0.7rem] ${counts ? "text-gold" : "text-gold-ink"}`}>Drops next</span>}
                        </th>
                        <td className="py-2.5 pr-4 text-right font-numeral text-[1.05rem] tabular-nums">
                          {d.adjusted}
                          {d.adjusted !== d.gross && <span className={`ml-1 text-[0.85rem] ${counts ? "text-paper-3" : "text-ink-2"}`}>({d.gross})</span>}
                        </td>
                        <td className={`py-2.5 pr-3 text-right font-numeral text-[1.2rem] font-semibold tabular-nums sm:pr-4 ${counts ? "text-gold" : ""}`}>
                          {d.value.toFixed(1)}
                          {counts && <span className="caps mt-0.5 flex items-center justify-end gap-1 text-[0.68rem] sm:hidden"><Star />Counts</span>}
                        </td>
                        <td className="hidden py-2.5 pr-3 text-right sm:table-cell">
                          {counts ? (
                            <span className="caps inline-flex items-center gap-1.5 text-[0.74rem] text-gold"><Star />Counts</span>
                          ) : (
                            <span className="text-ink-2"><span aria-hidden="true">·</span><span className="sr-only">Doesn&apos;t count</span></span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-ink-2">Your differentials appear here, one per 18-hole card (or pair of nines).</p>
          )}
          {n > 0 && (
            <p className="mt-2 px-1 text-[0.92rem] text-ink-2">Adjusted gross caps each hole at net double bogey; your actual score is in brackets when it differs.</p>
          )}
        </div>

        <aside className="grid content-start divide-y divide-rule/80 self-start rounded-xl border border-rule/70 bg-paper-2 text-[0.98rem] leading-relaxed text-ink-2 shadow-card [&>div]:p-4 sm:[&>div]:p-5" aria-label="About differentials">
          <div>
            <p className="caps text-label text-gold-ink">A differential</p>
            <p className="mt-1">
              <span className="font-numeral text-[1.1rem] text-ink">(113 ÷ slope) × (adjusted gross − course rating)</span>: how a card compares with the course, whatever the tees.
            </p>
          </div>
          <div>
            <p className="caps text-label text-gold-ink">Next to drop off</p>
            {drop ? (
              <p className="mt-1">
                <span className="text-ink">{drop.value.toFixed(1)} at {drop.courseName}</span>, {fmtDate(drop.date, { month: "long", day: "numeric", year: "numeric" })}.{" "}
                {h.nextToDropCounts ? "It's one of your counting 8, so beat it next time out or your index may rise." : "It doesn't count now, so losing it won't move your index."}
              </p>
            ) : (
              <p className="mt-1">Nothing yet. Cards start dropping off once you have 20; you have {n}.</p>
            )}
          </div>
          {h.low && (
            <div>
              <p className="caps text-label text-gold-ink">Low index</p>
              <p className="mt-1"><span className="font-numeral text-[1.1rem] text-ink">{formatIndex(h.low.value)}</span>, {fmtDate(h.low.date, { month: "long", day: "numeric", year: "numeric" })}.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
