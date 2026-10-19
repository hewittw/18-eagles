import type { ReactNode } from "react";
import { cx } from "./cx";

export type TagProps = { tone?: "neutral" | "green" | "gold"; children: ReactNode; className?: string };

/** A small condensed-caps label: "Links", "Major host", "Personal best". Text, so never color alone. */
export function Tag({ tone = "neutral", children, className }: TagProps) {
  return (
    <span
      className={cx(
        "caps inline-flex min-h-6 items-center gap-1.5 rounded-xs border px-2 py-0.5 text-[0.74rem] leading-none whitespace-nowrap",
        tone === "neutral" && "border-rule-strong bg-paper-2 text-ink-2",
        tone === "green" && "border-green-3 bg-green-3 text-on-green",
        tone === "gold" && "border-gold-ink bg-paper-2 text-gold-ink",
        className,
      )}
    >
      {tone === "gold" && <svg viewBox="0 0 8 8" className="size-2" aria-hidden="true"><path d="M4 0 L5 3 L8 4 L5 5 L4 8 L3 5 L0 4 L3 3 Z" fill="currentColor" /></svg>}
      {children}
    </span>
  );
}
