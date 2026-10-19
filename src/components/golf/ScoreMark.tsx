import { cx } from "../ui/cx";
import { scoreName } from "./score";

export type ScoreMarkProps = { strokes: number | null; par: number; size?: "sm" | "md" | "lg"; className?: string };

const px = { sm: 28, md: 36, lg: 52 };
const text = { sm: "text-[0.95rem]", md: "text-[1.15rem]", lg: "text-[1.7rem]" };

/**
 * The traditional card marks, drawn: circle = birdie, double circle = eagle or better, square = bogey,
 * double square = double bogey or worse, plain = par. Shape carries the meaning; red only repeats it.
 * Screen readers hear "Birdie, 3".
 */
export function ScoreMark({ strokes, par, size = "md", className }: ScoreMarkProps) {
  const s = px[size];
  if (strokes == null) {
    return (
      <span className={cx("inline-grid place-items-center font-numeral text-ink-2", text[size], className)} style={{ width: s, height: s }}>
        <span aria-hidden="true">–</span>
        <span className="sr-only">Not played</span>
      </span>
    );
  }
  const d = strokes - par;
  const sw = size === "lg" ? 1.6 : 1.3;
  const c = s / 2;
  const r1 = c - sw; // outer
  const r2 = r1 - (size === "lg" ? 4.5 : 3.5); // inner
  return (
    <span className={cx("relative inline-grid shrink-0 place-items-center", className)} style={{ width: s, height: s }}>
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className="absolute inset-0 overflow-visible" aria-hidden="true">
        {d < 0 && <circle cx={c} cy={c} r={r1} fill="none" stroke="currentColor" strokeWidth={sw} className="text-under" />}
        {d <= -2 && <circle cx={c} cy={c} r={r2} fill="none" stroke="currentColor" strokeWidth={sw} className="text-under" />}
        {d > 0 && <rect x={sw / 2} y={sw / 2} width={s - sw} height={s - sw} fill="none" stroke="currentColor" strokeWidth={sw} className="text-ink" />}
        {d >= 2 && <rect x={c - r2} y={c - r2} width={r2 * 2} height={r2 * 2} fill="none" stroke="currentColor" strokeWidth={sw} className="text-ink" />}
      </svg>
      <span aria-hidden="true" className={cx("relative font-serif italic leading-none", text[size], d < 0 ? "text-under" : "text-ink")}>
        {strokes}
      </span>
      <span className="sr-only">{scoreName(strokes, par)}, {strokes}</span>
    </span>
  );
}

/** The key to the marks, for under a card or chart. */
export function ScoreMarkKey({ className }: { className?: string }) {
  const rows: [string, number, number][] = [["Eagle", 3, 5], ["Birdie", 3, 4], ["Par", 4, 4], ["Bogey", 5, 4], ["Double +", 6, 4]];
  return (
    <ul className={cx("flex flex-wrap gap-x-5 gap-y-2", className)} aria-label="Score marks">
      {rows.map(([label, s, p]) => (
        <li key={label} className="flex items-center gap-2">
          <span aria-hidden="true"><ScoreMark strokes={s} par={p} size="sm" /></span>
          <span className="caps text-[0.75rem] text-ink-2">{label}</span>
        </li>
      ))}
    </ul>
  );
}
