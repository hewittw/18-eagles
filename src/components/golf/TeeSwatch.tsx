import { cx } from "../ui/cx";

export type TeeSwatchProps = { color: string; name: string; /** e.g. "6,620 yds". */ meta?: string; size?: "sm" | "md"; className?: string };

/** A tee marker: a small ball in the tee's color with an ink rim (so white tees show on paper), and the name in words. */
export function TeeSwatch({ color, name, meta, size = "sm", className }: TeeSwatchProps) {
  const d = size === "md" ? 18 : 14;
  return (
    <span className={cx("inline-flex min-w-0 items-center gap-2 align-middle", className)}>
      <svg width={d} height={d} viewBox="0 0 18 18" className="shrink-0" aria-hidden="true">
        <circle cx="9" cy="9" r="7.75" fill={color} stroke="var(--color-ink)" strokeWidth="1.5" />
        <path d="M4.5 6.5 A5.5 5.5 0 0 1 9 3.6" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span className="min-w-0 truncate">{name}</span>
      {meta && <span className="shrink-0 font-numeral text-ink-2 tabular-nums">{meta}</span>}
    </span>
  );
}
