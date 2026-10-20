import type { ReactNode } from "react";
import { cx } from "./cx";

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  level?: 2 | 3;
  action?: ReactNode;
  id?: string;
  /** A Roman numeral or number set before the title in Old Brass ("II"). */
  numeral?: string;
  /** One sentence under the title. */
  lede?: ReactNode;
  tone?: "paper" | "green";
  className?: string;
};

/** A section title, app style: green caps eyebrow, serif title, an optional pill action on the right. */
export function SectionHeading({ eyebrow, title, level = 2, action, id, numeral, lede, tone = "paper", className }: SectionHeadingProps) {
  const H = level === 2 ? "h2" : "h3";
  const green = tone === "green";
  return (
    <div className={cx("min-w-0", className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          {eyebrow && <p className={cx("caps text-label", green ? "text-gold" : "text-gold-ink")}>{eyebrow}</p>}
          <H id={id} className={cx("mt-1 flex items-baseline gap-3 font-display font-normal", level === 2 ? "text-display-2" : "text-title", green ? "text-on-green" : "text-ink")}>
            {numeral && <span className={cx("font-display text-[0.6em]", green ? "text-gold" : "text-gold-ink")} aria-hidden="true">{numeral}</span>}
            <span className="min-w-0 text-balance">{title}</span>
          </H>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {lede && <p className={cx("mt-3 max-w-measure font-serif text-lede", green ? "text-paper-3" : "text-ink-2")}>{lede}</p>}
    </div>
  );
}
