import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "li";
  /** paper: Tile White on a hairline. green: Locker Green with grain (focus rings turn brass inside). */
  tone?: "paper" | "green";
  /** linen: the woven sunken panel, for asides and the locker. */
  texture?: "none" | "linen";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
};

const pads = { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-9" };

/** A surface. Square corners and a hairline, never the grey-card-soft-shadow look. */
export function Card({ as: As = "div", tone = "paper", texture = "none", padding = "md", className, children, ...rest }: CardProps) {
  return (
    <As
      className={cx(
        "relative min-w-0 rounded-xs",
        tone === "green" ? "tex-locker on-green border border-green-3" : texture === "linen" ? "tex-linen border border-rule text-ink" : "border border-rule bg-paper-2 text-ink",
        pads[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
