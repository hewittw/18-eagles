"use client";
import { useId, useState, type ReactNode } from "react";

export type TableData = { columns: string[]; rows: (string | number)[][] };

/** Every chart, in its own rounded card: a heading, a one-line text summary, the SVG, and a "Show as table" toggle with the same data. */
export function ChartFrame({ title, summary, table, children, level = 3 }: { title: string; summary: string; table: TableData; children: ReactNode; level?: 2 | 3 }) {
  const [asTable, setAsTable] = useState(false);
  const id = useId();
  const H = level === 2 ? "h2" : "h3";
  return (
    <figure aria-labelledby={`${id}-t`} className="@container min-w-0 rounded-xl border border-rule/70 bg-paper-2 p-4 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <H id={`${id}-t`} className="font-serif text-[1.3rem] font-semibold leading-tight text-ink">{title}</H>
        <button
          type="button"
          aria-expanded={asTable}
          aria-controls={`${id}-d`}
          onClick={() => setAsTable((v) => !v)}
          className="-mt-1.5 inline-flex min-h-tap shrink-0 items-center rounded-full bg-tint px-3.5 text-[0.88rem] font-semibold text-green transition-[background-color,transform] duration-150 is-hover:bg-tint-2 is-pressed:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {asTable ? "Show chart" : "Show as table"}
        </button>
      </div>
      <figcaption className="mt-1 text-[15px] leading-snug text-ink-2">{summary}</figcaption>
      <div id={`${id}-d`} className="mt-4">
        {asTable ? (
          <div className="scroll-x">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr>{table.columns.map((c) => <th key={c} scope="col" className="border-b border-rule-strong py-2 pr-4 font-medium text-ink">{c}</th>)}</tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i} className="border-b border-rule">
                    {r.map((v, j) => (j === 0 ? <th key={j} scope="row" className="py-2 pr-4 font-normal text-ink">{v}</th> : <td key={j} className="py-2 pr-4 font-numeral tabular-nums text-ink">{v}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </figure>
  );
}

export const fmtToPar = (n: number) => (Math.abs(n) < 0.05 ? "E" : n > 0 ? `+${Number.isInteger(n) ? n : n.toFixed(1)}` : `−${Number.isInteger(n) ? -n : (-n).toFixed(1)}`);
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts);
