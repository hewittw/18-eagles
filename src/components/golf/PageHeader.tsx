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

/** The page's one <h1>: an optional "‹ Courses" back pill, a brass eyebrow, the serif title, and an optional lede. */
export function PageHeader({ title, eyebrow, back, actions, lede, tone = "paper", className }: PageHeaderProps) {
  const green = tone === "green";
  return (
    <header className={cx("min-w-0", green && "tex-locker on-green", className)}>
      {back && (
        <Link
          href={back.href}
          className={cx(
            "-ml-1 mb-4 inline-flex min-h-tap items-center gap-1.5 rounded-full py-1 pl-2.5 pr-4 text-[0.95rem] font-semibold transition-[background-color,transform] duration-150 is-pressed:scale-[0.98]",
            green ? "bg-white/10 text-on-green is-hover:bg-white/18" : "bg-tint text-green is-hover:bg-tint-2",
          )}
        >
          <svg viewBox="0 0 10 16" className="h-4 w-2.5 shrink-0" aria-hidden="true"><path d="M8 2 L2 8 L8 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {back.label}
        </Link>
      )}
      {/* Phones: the actions sit beside the title (or wrap under it). From lg, with a lede, they sit at the right
          and line up with the lede's last line instead of floating at the h1's mid-height. */}
      <div className={cx("flex flex-wrap items-end justify-between gap-x-8 gap-y-4", !!lede && !!actions && "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-y-0")}>
        <div className="min-w-0">
          {eyebrow && <p className={cx("caps text-label text-balance", green ? "text-gold" : "text-gold-ink")}>{eyebrow}</p>}
          <h1 className={cx("mt-1.5 font-display text-display-1 font-normal text-balance", green ? "text-on-green" : "text-ink")}>{title}</h1>
        </div>
        {actions && <div className={cx("flex min-w-0 max-w-full flex-wrap gap-2", !!lede && "lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-end")}>{actions}</div>}
        {lede && <p className={cx("-mt-1 w-full max-w-measure font-serif text-lede text-pretty lg:col-start-1 lg:mt-3", green ? "text-paper-3" : "text-ink-2")}>{lede}</p>}
      </div>
    </header>
  );
}
