import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "../ui/cx";

export type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
  /** One or two sentences under the title, in Caslon. */
  lede?: ReactNode;
  tone?: "paper" | "green";
  className?: string;
};

/** The page's one <h1>: an optional "← Courses" back link, a brass eyebrow, the Caslon title, and the double rule. */
export function PageHeader({ title, eyebrow, back, actions, lede, tone = "paper", className }: PageHeaderProps) {
  const green = tone === "green";
  return (
    <header className={cx("min-w-0", green && "tex-locker on-green", className)}>
      {back && (
        <Link
          href={back.href}
          className={cx(
            "caps -ml-2 mb-3 inline-flex min-h-tap items-center gap-2 rounded-xs px-2 text-[0.8rem] transition-colors",
            green ? "text-paper-3 is-hover:text-on-green" : "text-ink-2 is-hover:bg-paper-3 is-hover:text-ink",
          )}
        >
          <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M16 5 H2 M6 1 L2 5 L6 9" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          {eyebrow && <p className={cx("caps text-label", green ? "text-gold" : "text-gold-ink")}>{eyebrow}</p>}
          <h1 className={cx("mt-1.5 font-display text-display-1 font-normal text-balance", green ? "text-on-green" : "text-ink")}>{title}</h1>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
      <div className={cx("rule-double mt-4", green ? "text-gold/70" : "text-ink")} aria-hidden="true" />
      {lede && <p className={cx("mt-4 max-w-measure font-serif text-lede", green ? "text-paper-3" : "text-ink-2")}>{lede}</p>}
    </header>
  );
}
