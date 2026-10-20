import type { ReactNode } from "react";
import { cx } from "./cx";

export type CalloutProps = { tone?: "info" | "gold"; title?: string; children: ReactNode; className?: string; action?: ReactNode };

/** Gentle guidance ("1 of 3 rounds to your index"). A note in the margin, not an empty state and not an alarm. */
export function Callout({ tone = "info", title, children, className, action }: CalloutProps) {
  return (
    // role="note", not <aside>: a margin note inside the page, not a complementary landmark.
    <div
      role="note"
      className={cx(
        "relative flex min-w-0 gap-4 rounded-xs border p-4 sm:p-5",
        tone === "info" ? "border-rule bg-paper-2 shadow-[inset_3px_0_0_var(--color-link)]" : "tex-linen border-gold-ink/50 shadow-[inset_3px_0_0_var(--color-gold-ink)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className={cx("mt-0.5 size-6 shrink-0", tone === "info" ? "text-link" : "text-gold-ink")} aria-hidden="true">
        {tone === "info" ? (
          <>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 10.5 V17" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="7.4" r="1.15" fill="currentColor" />
          </>
        ) : (
          <>
            <path d="M12 2 L14.3 9.2 L22 9.6 L16 14.3 L18 21.6 L12 17.5 L6 21.6 L8 14.3 L2 9.6 L9.7 9.2 Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </>
        )}
      </svg>
      <div className="min-w-0 flex-1">
        {title && <p className="font-serif text-[1.1rem] font-bold leading-snug text-ink">{title}</p>}
        <div className={cx("text-[0.98rem] leading-relaxed text-ink-2", title && "mt-1")}>{children}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
