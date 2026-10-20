"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * After a client-side route change, focus moves to the new page's <h1>, so a keyboard user starts at the top of
 * the new page (not on a link that no longer exists) and a screen reader reads the new page's name.
 * Pages render after localStorage is read, so it waits briefly for the real <h1> (not the placeholder).
 */
export function RouteFocus() {
  const path = usePathname();
  const prevPath = useRef<string | null>(null);
  const last = useRef<Element | null>(null);
  useEffect(() => {
    // Only on a real change of page: not the first load (the skip link stays the first Tab stop), and not
    // React's development double-run of this effect.
    const was = prevPath.current;
    prevPath.current = path;
    if (was === null || was === path) {
      if (was === null) last.current = document.querySelector("main h1");
      return;
    }
    let tries = 0;
    let t = 0;
    const go = () => {
      const h = document.querySelector<HTMLElement>("main h1");
      // Wait for the new page's own <h1>: not the old page's (still mounted for a moment), not the placeholder.
      if (!h || h === last.current || h.closest("[aria-busy='true']")) {
        if (tries++ < 120) t = window.setTimeout(go, 50);
        return;
      }
      last.current = h;
      if (!h.hasAttribute("tabindex")) {
        h.setAttribute("tabindex", "-1");
        // A heading isn't a control: no ring on it. The next Tab lands on the page's first control, which has one.
        h.style.outline = "none";
      }
      h.focus({ preventScroll: true });
    };
    t = window.setTimeout(go, 0);
    return () => window.clearTimeout(t);
  }, [path]);
  return null;
}
