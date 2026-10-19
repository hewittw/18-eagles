/** The first Tab stop on every page: jumps past the bar to <main id="main">. */
export function SkipLink({ href = "#main", children = "Skip to main content" }: { href?: string; children?: string }) {
  return (
    <a
      href={href}
      className="on-green caps fixed left-3 top-3 z-[100] -translate-y-[200%] bg-green-3 px-4 py-3 text-[0.85rem] text-on-green shadow-lift transition-transform duration-150 focus:translate-y-0"
    >
      {children}
    </a>
  );
}
