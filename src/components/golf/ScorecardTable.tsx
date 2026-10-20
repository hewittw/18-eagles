import type { Hole } from "@/lib/course-types";
import type { HoleEntry } from "@/lib/types";
import { cx } from "../ui/cx";
import { ScoreMark } from "./ScoreMark";
import { toParSpoken, toParText } from "./score";

export type ScorecardTableProps = {
  holes: Hole[];
  entries: Record<number, HoleEntry>;
  currentHole?: number;
  /** Makes each hole number a button ("Go to hole 7"). */
  onSelectHole?: (n: number) => void;
  /** Tighter cells, no yards, names, or putts: for history rows and small spaces. */
  compact?: boolean;
  /** Read by screen readers as the table's caption, and the scroll region's name. */
  caption?: string;
  /** Show the tee's name on the yards row ("Blue"). */
  teeName?: string;
};

type Seg = { key: "out" | "in" | "total"; label: string; holes: Hole[] };

/**
 * The classic card: Hole / Name / Yards / Par / Score / Putts, with Out, In, and Total on Locker Green.
 * A real <table> with row and column headers. On phones it scrolls sideways with the row headers pinned.
 */
export function ScorecardTable({ holes, entries, currentHole, onSelectHole, compact = false, caption = "Scorecard", teeName }: ScorecardTableProps) {
  const front = holes.filter((h) => h.n <= 9);
  const back = holes.filter((h) => h.n >= 10);
  const both = front.length > 0 && back.length > 0;
  const showNames = !compact && holes.some((h) => h.name);
  const showPutts = !compact && holes.some((h) => entries[h.n]?.putts != null);

  // Column order: front, Out, back, In, Total (single nines get only Total).
  const cols: (Hole | Seg)[] = both
    ? [...front, { key: "out", label: "Out", holes: front }, ...back, { key: "in", label: "In", holes: back }, { key: "total", label: "Total", holes }]
    : [...holes, { key: "total", label: "Total", holes }];
  const isSeg = (c: Hole | Seg): c is Seg => "key" in c;

  const sum = (hs: Hole[], f: (h: Hole) => number | null | undefined) => {
    let t = 0, any = false;
    for (const h of hs) { const v = f(h); if (v != null) { t += v; any = true; } }
    return any ? t : null;
  };
  const strokesOf = (h: Hole) => entries[h.n]?.strokes ?? null;
  const toParOf = (hs: Hole[]) => {
    const played = hs.filter((h) => strokesOf(h) != null);
    return played.length ? played.reduce((a, h) => a + (strokesOf(h)! - h.par), 0) : null;
  };

  const cell = compact ? "px-1 py-1.5" : "px-1.5 py-2";
  const rowHead = cx("caps sticky left-0 z-10 bg-paper-2 text-left text-[0.72rem] text-ink-2 whitespace-nowrap shadow-[1px_0_0_var(--color-rule)]", compact ? "px-2 py-1.5" : "px-3 py-2");
  const segCell = "bg-green-3 text-on-green font-numeral font-semibold tabular-nums";
  const cur = (c: Hole | Seg) => !isSeg(c) && c.n === currentHole;
  const played = holes.filter((h) => strokesOf(h) != null).length;
  const total = sum(holes, strokesOf);
  const totalToPar = toParOf(holes);

  return (
    <div role="region" aria-label={`${caption}${played ? `, ${played} of ${holes.length} holes played` : ""}. Scrolls sideways on small screens.`} tabIndex={0} className="scroll-x relative rounded-xl border border-rule/70 bg-paper-2 shadow-card">
      <table className={cx("w-full min-w-max border-collapse text-center", compact ? "text-[0.95rem]" : "text-[1.02rem]")}>
        <caption className="sr-only">
          {caption}.{total != null ? ` ${total} strokes through ${played} ${played === 1 ? "hole" : "holes"}, ${toParSpoken(totalToPar!)}.` : " No holes played yet."}
        </caption>
        <thead>
          <tr className="border-b border-rule">
            <th scope="row" className={rowHead}>Hole</th>
            {cols.map((c) =>
              isSeg(c) ? (
                <th key={c.key} scope="col" className={cx("caps text-[0.75rem]", segCell, cell, compact ? "min-w-11" : "min-w-14")}>{c.label}</th>
              ) : (
                <th key={c.n} scope="col" className={cx("relative font-numeral text-[1.1rem] font-semibold tabular-nums", compact ? "min-w-9" : "min-w-11", cur(c) && "bg-tint/60", onSelectHole ? "p-0.5" : cell)}>
                  {cur(c) && !onSelectHole && <span aria-hidden="true" className="absolute inset-x-1 top-0 h-[3px] rounded-full bg-green" />}
                  {onSelectHole ? (
                    <button
                      type="button"
                      onClick={() => onSelectHole(c.n)}
                      aria-current={cur(c) ? "step" : undefined}
                      aria-label={`Hole ${c.n}${c.name ? `, ${c.name}` : ""}${cur(c) ? ", current hole" : ""}`}
                      className={cx("grid min-h-tap w-full min-w-tap place-items-center rounded-xs transition-[background-color,transform] duration-150 is-pressed:scale-[0.94]", cur(c) ? "bg-green text-on-green is-hover:bg-green-2" : "text-green is-hover:bg-tint is-pressed:bg-tint-2")}
                    >
                      {c.n}
                    </button>
                  ) : (
                    <>
                      {c.n}
                      {cur(c) && <span className="sr-only"> (current hole)</span>}
                    </>
                  )}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="font-numeral tabular-nums">
          {showNames && (
            <tr className="border-b border-rule">
              <th scope="row" className={rowHead}>Name</th>
              {cols.map((c) =>
                isSeg(c) ? <td key={c.key} className={segCell} /> : (
                  <td key={c.n} className={cx("max-w-[5.5rem] px-1 py-1.5 align-top font-serif text-[0.78rem] leading-tight text-ink-2 italic", cur(c) && "bg-tint/60")}>{c.name ?? ""}</td>
                ),
              )}
            </tr>
          )}
          {!compact && (
            <tr className="border-b border-rule">
              <th scope="row" className={rowHead}>{teeName ? `${teeName} yds` : "Yards"}</th>
              {cols.map((c) =>
                isSeg(c) ? (
                  <td key={c.key} className={cx(segCell, cell)}>{sum(c.holes, (h) => h.yards)?.toLocaleString("en-US")}</td>
                ) : (
                  <td key={c.n} className={cx(cell, cur(c) && "bg-tint/60")}>{c.yards}</td>
                ),
              )}
            </tr>
          )}
          <tr className="border-b border-rule bg-paper-3">
            <th scope="row" className={cx(rowHead, "bg-paper-3!")}>Par</th>
            {cols.map((c) =>
              isSeg(c) ? (
                <td key={c.key} className={cx(segCell, cell)}>{sum(c.holes, (h) => h.par)}</td>
              ) : (
                <td key={c.n} className={cx(cell, "font-semibold", cur(c) && "bg-tint")}>{c.par}</td>
              ),
            )}
          </tr>
          <tr className={cx(showPutts && "border-b border-rule")}>
            <th scope="row" className={rowHead}>Score</th>
            {cols.map((c) => {
              if (isSeg(c)) {
                const t = sum(c.holes, strokesOf);
                const tp = toParOf(c.holes);
                return (
                  <td key={c.key} className={cx(segCell, compact ? "px-1 py-1" : "px-2 py-2")}>
                    {t == null ? <span aria-label="No score">–</span> : (
                      <span className="flex flex-col items-center leading-none">
                        <span className={compact ? "text-[1.1rem]" : "text-[1.35rem]"}>{t}</span>
                        {c.key === "total" && tp != null && <span className="mt-1 text-[0.8rem] text-gold">{toParText(tp)}</span>}
                      </span>
                    )}
                  </td>
                );
              }
              return (
                <td key={c.n} className={cx(compact ? "px-0.5 py-1" : "px-1 py-2", cur(c) && "bg-tint/60")}>
                  <ScoreMark strokes={strokesOf(c)} par={c.par} size={compact ? "sm" : "md"} />
                </td>
              );
            })}
          </tr>
          {showPutts && (
            <tr>
              <th scope="row" className={rowHead}>Putts</th>
              {cols.map((c) =>
                isSeg(c) ? (
                  <td key={c.key} className={cx(segCell, cell)}>{sum(c.holes, (h) => entries[h.n]?.putts)}</td>
                ) : (
                  <td key={c.n} className={cx(cell, "text-ink-2", cur(c) && "bg-tint/60")}>{entries[c.n]?.putts ?? ""}</td>
                ),
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
