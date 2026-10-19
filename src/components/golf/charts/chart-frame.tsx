"use client";
import { useId, useState, type ReactNode } from "react";

export type TableData = { columns: string[]; rows: (string | number)[][] };

/** Every chart: a heading, a one-line text summary, the SVG, and a "Show as table" toggle with the same data. */
export function ChartFrame({ title, summary, table, children, level = 3 }: { title: string; summary: string; table: TableData; children: ReactNode; level?: 2 | 3 }) {
  const [asTable, setAsTable] = useState(false);
  const id = useId();
  const H = level === 2 ? "h2" : "h3";
  return (
    <figure aria-labelledby={`${id}-t`} className="min-w-0">
      <div className="flex items-baseline justify-between gap-4">
        <H id={`${id}-t`} className="font-serif text-[1.25rem] font-bold leading-tight text-ink">{title}</H>
        <button
          type="button"
          aria-expanded={asTable}
          aria-controls={`${id}-d`}
          onClick={() => setAsTable((v) => !v)}
          className="shrink-0 rounded-sm text-sm text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {asTable ? "Show chart" : "Show as table"}
        </button>
      </div>
      <figcaption className="mt-1 text-[15px] leading-snug text-ink-2">{summary}</figcaption>
      <div id={`${id}-d`} className="mt-4">
        {asTable ? (
          <div className="overflow-x-auto">
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
