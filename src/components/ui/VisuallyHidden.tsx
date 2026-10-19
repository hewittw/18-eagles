import type { ReactNode } from "react";

/** Read by screen readers, not shown. For "Birdie, 3", "(current hole)", and the like. */
export function VisuallyHidden({ children, as: As = "span", id }: { children: ReactNode; as?: "span" | "div" | "p" | "h2" | "h3"; id?: string }) {
  return <As id={id} className="sr-only">{children}</As>;
}
