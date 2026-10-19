import type { ReactNode } from "react";
import { cx } from "../ui/cx";

export type BigNumberProps = {
  value: string;
  label: string;
  sub?: ReactNode;
  tone?: "paper" | "green";
  /** hero: the handicap at poster size. lg: a section's lead figure. md: a row of figures. */
  size?: "md" | "lg" | "hero";
  /** display: engraved Caslon (the handicap). numeral: the board's condensed figures (scores, totals). */
  face?: "display" | "numeral";
  /** What a screen reader hears instead of the raw value, e.g. "Handicap index 12.3". Defaults to "label: value". */
  spoken?: string;
  className?: string;
};

const sizes = {
  display: { hero: "text-hero", lg: "text-[clamp(3.6rem,8vw,6rem)] leading-[0.9]", md: "text-[2.6rem] leading-none" },
  numeral: { hero: "text-[clamp(5rem,13vw,9.5rem)] leading-[0.85]", lg: "text-[clamp(3.4rem,7vw,5rem)] leading-[0.9]", md: "text-[2.5rem] leading-none" },
};

/**
 * The one big, exact number a screen leads with. The figure cross-fades when it changes (keyed by value),
 * and never counts up like a slot machine. Label above in brass caps; context below.
 */
export function BigNumber({ value, label, sub, tone = "paper", size = "hero", face = "display", spoken, className }: BigNumberProps) {
  const green = tone === "green";
  return (
    <div className={cx("min-w-0", className)}>
      <p className={cx("caps text-label", green ? "text-gold" : "text-gold-ink")} aria-hidden={spoken ? true : undefined}>{label}</p>
      <p
        key={value}
        className={cx(
          "animate-fade mt-1",
          face === "display" ? "font-display font-normal tracking-[-0.02em]" : "font-numeral font-semibold tabular-nums tracking-[-0.01em]",
          sizes[face][size],
          green ? "text-on-green" : "text-ink",
        )}
      >
        {spoken ? (<><span aria-hidden="true">{value}</span><span className="sr-only">{spoken}</span></>) : value}
      </p>
      {sub && <div className={cx("mt-3 font-numeral text-[1.15rem] font-medium", green ? "text-paper-3" : "text-ink-2")}>{sub}</div>}
    </div>
  );
}
