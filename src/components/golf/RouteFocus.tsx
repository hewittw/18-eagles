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
      // The new page's own <h1>: not the old page's (still mounted for a moment, or kept hidden by the router),
      // not the placeholder. Hidden pages can't take focus, so only a rendered <h1> counts.
      const h = Array.from(document.querySelectorAll<HTMLElement>("main h1")).find((x) => x !== last.current && x.getClientRects().length > 0);
      if (!h || h.closest("[aria-busy='true']")) {
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

/**
 * Focus not obscured (WCAG 2.4.11). The browser only scrolls a focused control into view when it's off screen, so a
 * control that sits under the sticky header, the phone tab bar, or a sticky action bar stays hidden. On every focus
 * change, scroll just enough to clear the bars marked `data-obscures`. (Styled radios are measured by their label.)
 */
export function FocusClear() {
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || el === document.body || !(el instanceof HTMLElement) || el.closest("dialog")) return;
      // After the browser's own scroll-into-view for this focus change.
      requestAnimationFrame(() => clear(el));
    };
    const clear = (el: HTMLElement) => {
      if (document.activeElement !== el) return;
      const box = (el.matches("input.sr-only") && el.closest("label")) || el;
      const r = box.getBoundingClientRect();
      if (!r.height) return;
      let top = 0;
      let bottom = window.innerHeight;
      for (const bar of document.querySelectorAll<HTMLElement>("[data-obscures]")) {
        if (bar.contains(el)) continue;
        const b = bar.getBoundingClientRect();
        if (!b.height || b.bottom <= 0 || b.top >= window.innerHeight) continue;
        // Only a bar that's actually stuck to an edge right now (not a static one, or a sticky one still in the flow).
        const cs = getComputedStyle(bar);
        if (cs.position !== "sticky" && cs.position !== "fixed") continue;
        if (b.top <= 1) top = Math.max(top, b.bottom);
        else if (cs.position === "fixed" ? b.bottom >= window.innerHeight - 1 : cs.bottom !== "auto" && Math.abs(window.innerHeight - parseFloat(cs.bottom) - b.bottom) < 2) bottom = Math.min(bottom, b.top);
      }
      const gap = 12;
      if (r.bottom > bottom - 2 && r.height < bottom - top) window.scrollBy({ top: r.bottom - bottom + gap, behavior: "instant" });
      else if (r.top < top + 2) window.scrollBy({ top: r.top - top - gap, behavior: "instant" });
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, []);
  return null;
}
