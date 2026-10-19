"use client";
import { useEffect, useRef, useState } from "react";
import { ChartFrame, fmtDate, fmtToPar } from "./chart-frame";

export type TrendPoint = { id: string; date: string; value: number; label: string; href?: string };

/**
 * Scores over time. Lower is better, so the y-axis runs best-at-top, the way golfers read a leaderboard.
 * Every point is a focusable link (or button) with a label, so keyboard and screen-reader users get the same detail as hover.
 */
export function TrendChart({
  title, points, unit, goal, rolling = 5, onSelect,
}: {
  title: string;
  points: TrendPoint[];
  unit: "gross" | "toPar" | "index";
  goal?: { value: number; label: string };
  rolling?: number;
  onSelect?: (id: string) => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  // The SVG is drawn at the container's real width, so axis text stays 13px on a phone and on a wide screen.
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = Math.round(Math.min(320, Math.max(220, W * 0.42))), L = 40, R = 12, T = 18, B = 30;
  const fmt = (v: number) => (unit === "toPar" ? fmtToPar(v) : unit === "index" ? v.toFixed(1) : String(Math.round(v)));
  const vals = points.map((p) => p.value).concat(goal ? [goal.value] : []);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (!points.length) { lo = 0; hi = 1; }
  const pad = Math.max(1, (hi - lo) * 0.15);
  lo -= pad; hi += pad;
  const x = (i: number) => (points.length <= 1 ? L + (W - L - R) / 2 : L + (i * (W - L - R)) / (points.length - 1));
  const y = (v: number) => T + ((v - lo) / (hi - lo)) * (H - T - B); // lower score = higher on the chart
  const roll = points.map((_, i) => {
    const w = points.slice(Math.max(0, i - rolling + 1), i + 1);
    return w.reduce((a, p) => a + p.value, 0) / w.length;
  });
  const ticks = points.length ? niceTicks(lo, hi, 4) : [];
  const first = points[0], last = points[points.length - 1];
  const summary = !points.length
    ? "No rounds match these filters yet."
    : points.length === 1
      ? `One round: ${fmt(first.value)} on ${fmtDate(first.date)}. The trend line starts with your second round.`
      : `${points.length} rounds from ${fmtDate(first.date)} to ${fmtDate(last.date)}. Latest ${fmt(last.value)}; ${rolling}-round average ${fmt(roll[roll.length - 1])}; best ${fmt(Math.min(...points.map((p) => p.value)))}.`;

  return (
    <ChartFrame
      title={title}
      summary={summary}
      table={{ columns: ["Date", "Course", unit === "toPar" ? "To par" : unit === "index" ? "Index" : "Score", `${rolling}-round avg`], rows: points.map((p, i) => [fmtDate(p.date, { month: "short", day: "numeric", year: "numeric" }), p.label, fmt(p.value), fmt(roll[i])]) }}
    >
      <div ref={box} className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="group" aria-label={`${title} chart`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--color-rule)" strokeWidth={1} />
              <text x={L - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink-2 font-numeral text-[13px] tabular-nums">{fmt(t)}</text>
            </g>
          ))}
          {goal && (
            <g>
              <line x1={L} x2={W - R} y1={y(goal.value)} y2={y(goal.value)} stroke="var(--color-gold-ink)" strokeWidth={1.5} strokeDasharray="6 5" />
              <text x={W - R} y={y(goal.value) - 6} textAnchor="end" className="fill-ink-2 text-[13px]">{goal.label}</text>
            </g>
          )}
          {points.length > 1 && (
            <>
              <polyline fill="none" stroke="var(--color-rule-strong)" strokeWidth={1.5} points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ")} />
              <polyline fill="none" stroke="var(--color-green)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" points={roll.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
            </>
          )}
          {points.map((p, i) => (
            <g
              key={p.id}
              tabIndex={0}
              role={onSelect ? "button" : "img"}
              aria-label={`${fmtDate(p.date)}, ${p.label}: ${fmt(p.value)}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => onSelect?.(p.id)}
              onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && onSelect) { e.preventDefault(); onSelect(p.id); } }}
              className="cursor-pointer outline-none [&:focus-visible>circle.ring]:opacity-100"
            >
              <circle cx={x(i)} cy={y(p.value)} r={14} fill="transparent" />
              <circle className="ring opacity-0" cx={x(i)} cy={y(p.value)} r={10} fill="none" stroke="var(--color-focus)" strokeWidth={2.5} />
              <circle cx={x(i)} cy={y(p.value)} r={active === i ? 6 : 4.5} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={2} />
            </g>
          ))}
          {points.length > 0 && (
            <>
              <text x={x(0)} y={H - 10} textAnchor={points.length > 1 ? "start" : "middle"} className="fill-ink-2 text-[13px]">{fmtDate(first.date)}</text>
              {points.length > 1 && <text x={x(points.length - 1)} y={H - 10} textAnchor="end" className="fill-ink-2 text-[13px]">{fmtDate(last.date)}</text>}
            </>
          )}
        </svg>
        {active != null && points[active] && (
          <div
            aria-hidden
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-3 py-2 text-sm text-paper shadow-lg"
            style={{ left: `${(x(active) / W) * 100}%`, top: `${(y(points[active].value) / H) * 100}%`, marginTop: -12 }}
          >
            <span className="font-numeral text-base tabular-nums">{fmt(points[active].value)}</span>{" "}
            <span className="opacity-80">· {points[active].label} · {fmtDate(points[active].date)}</span>
          </div>
        )}
      </div>
      {points.length > 1 && (
        <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-hidden>
          <span className="inline-flex items-center gap-2"><span className="h-[3px] w-5 rounded bg-green" /> {rolling}-round average</span>
          <span className="inline-flex items-center gap-2"><span className="h-px w-5 bg-rule-strong" /> each round</span>
          {goal && <span className="inline-flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-gold-ink" /> {goal.label}</span>}
        </p>
      )}
    </ChartFrame>
  );
}

function niceTicks(lo: number, hi: number, n: number) {
  const span = hi - lo;
  const step = [1, 2, 5, 10, 20].find((s) => span / s <= n) ?? 20;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(v);
  return out;
}
