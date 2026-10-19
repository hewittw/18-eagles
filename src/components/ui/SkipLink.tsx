/** The first Tab stop on every page: jumps past the bar to <main id="main">. Hidden until focused. */
export function SkipLink({ href = "#main", children = "Skip to main content" }: { href?: string; children?: string }) {
  return (
    <a
      href={href}
      className="on-green caps sr-only bg-green-3 px-4 py-3 text-[0.85rem] text-on-green shadow-lift focus:not-sr-only focus:px-4! focus:py-3! focus:fixed focus:left-3 focus:top-3 focus:z-[100]"
    >
      {children}
    </a>
  );
}
