"use client";
/**
 * Focus a target that isn't normally focusable (main, a heading) just for this jump. <main> must not keep a
 * tabindex: Safari focuses the nearest focusable ancestor when you click plain content (a radio's label, text), and
 * focusing <main> scrolls the page to its top.
 */
export function focusTarget(t: HTMLElement) {
  if (t.tabIndex < 0 && !t.hasAttribute("tabindex")) {
    t.setAttribute("tabindex", "-1");
    t.addEventListener("blur", () => t.removeAttribute("tabindex"), { once: true });
  }
  t.focus();
}

/** The first Tab stop on every page: jumps past the bar to <main id="main">. Hidden until focused. */
export function SkipLink({ href = "#main", children = "Skip to main content" }: { href?: string; children?: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        const t = document.querySelector<HTMLElement>(href);
        if (!t) return;
        e.preventDefault();
        focusTarget(t);
        t.scrollIntoView({ block: "start" });
      }}
      className="on-green caps sr-only bg-green-3 px-4 py-3 text-[0.85rem] text-on-green shadow-lift focus:not-sr-only focus:px-4! focus:py-3! focus:fixed focus:left-3 focus:top-3 focus:z-[100]"
    >
      {children}
    </a>
  );
}

/**
 * A bypass inside a long run of controls (the 18 hole buttons, the 18 bag chips): hidden until focused, then shown in
 * place, so Tab users reach the main action without walking every chip. The target needs an id.
 */
export function SkipTo({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        const t = document.querySelector<HTMLElement>(href);
        if (!t) return;
        e.preventDefault();
        focusTarget(t);
      }}
      className="sr-only rounded-full bg-tint px-4 text-[0.95rem] font-semibold text-green focus:not-sr-only focus:inline-flex focus:min-h-tap focus:items-center"
    >
      {children}
    </a>
  );
}
