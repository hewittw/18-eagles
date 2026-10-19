import Link from "next/link";
import { checklist, parts, TOOL_HREF, type Status } from "@/lib/progress";

// The hub: a progress home base for the process. The submitted link is the tool itself (TOOL_HREF).
const ring = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1c1b19]";

const statusStyle: Record<Status, string> = {
  done: "bg-[#0f3d2e] text-white",
  "in progress": "bg-[#f1e7c8] text-[#4a3b0b]",
  next: "bg-transparent text-[#5c5a55] ring-1 ring-[#c9c5bb]",
};

function StatusTag({ s }: { s: Status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] ${statusStyle[s]}`}>
      {s}
    </span>
  );
}

export default function Hub() {
  return (
    <main id="main" className="mx-auto w-full max-w-[1120px] px-6 pb-32 pt-16 md:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#5c5a55]">
        Design, Build, Ship · Assignment 3 · Patterns &amp; Flows
      </p>
      <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.035em] md:text-7xl">18 Eagles</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#4a4843]">
        A personal golf round journal. Play a round hole by hole, keep every card, and watch your handicap move.
        This page tracks how it was made.
      </p>
      <Link
        href={TOOL_HREF}
        className={`mt-8 inline-flex items-center gap-2 rounded-full bg-[#0f3d2e] px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#165440] active:scale-[0.97] ${ring}`}
      >
        Open 18 Eagles <span aria-hidden>→</span>
      </Link>

      <section aria-labelledby="parts" className="mt-20">
        <h2 id="parts" className="border-t border-[#d8d4ca] pt-6 text-xl font-medium tracking-tight">
          The work
        </h2>
        <ol className="mt-6 divide-y divide-[#e4e0d6]">
          {parts.map((p) => (
            <li key={p.n}>
              <Link href={p.href} className={`group grid gap-2 py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline ${ring}`}>
                <span className="font-mono text-sm text-[#6b6862]">{p.n}</span>
                <span>
                  <span className="text-lg font-medium tracking-tight group-hover:underline">{p.title}</span>
                  <span className="mt-1 block max-w-2xl text-[15px] leading-relaxed text-[#4a4843]">{p.note}</span>
                </span>
                <StatusTag s={p.status} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="checklist" className="mt-16">
        <h2 id="checklist" className="border-t border-[#d8d4ca] pt-6 text-xl font-medium tracking-tight">
          Assignment checklist
        </h2>
        <ul className="mt-6 grid gap-3">
          {checklist.map((c) => (
            <li key={c.item} className="flex items-start justify-between gap-6 text-[15px]">
              <span>{c.item}</span>
              <StatusTag s={c.status} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
