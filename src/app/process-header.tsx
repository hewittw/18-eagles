import Link from "next/link";

// The thin header shared by the hub's process pages (research, flows). Not part of the tool.
export function ProcessHeader({ here }: { here: string }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-paper focus:px-4 focus:py-2 focus:text-ink focus:outline-2 focus:outline-focus">
        Skip to main content
      </a>
      <header className="border-b border-rule">
        <nav aria-label="Process" className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4 font-numeral text-xs uppercase tracking-[0.16em] md:px-10">
          <Link href="/" className="rounded-sm text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
            18 Eagles · Process hub
          </Link>
          <span className="text-ink-2" aria-current="page">{here}</span>
        </nav>
      </header>
    </>
  );
}
