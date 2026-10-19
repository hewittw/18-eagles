import Image from "next/image";
import type { Metadata } from "next";
import { inline, Markdown, readDoc } from "@/lib/md";
import { ProcessHeader } from "../process-header";

export const metadata: Metadata = { title: "Flows: first visit, playing a round, coming back" };

// flows.md is the source of truth (also shown in the README). Diagrams are pre-rendered SVGs
// (scripts/render-mermaid.mjs), and the Mermaid source sits underneath each one as the text alternative.
export default function Flows() {
  const md = readDoc("flows.md");
  const sentence = md.match(/^> (.+)$/m)?.[1] ?? "";
  const list = md.match(/## The three flows\n\n([\s\S]*?)\n\n###/)?.[1] ?? "";
  const diagrams = [...md.matchAll(/### (.+)\n```mermaid\n([\s\S]*?)```/g)].map((m, i) => ({ title: m[1], code: m[2], src: `/flows/flow-${i + 1}.svg` }));
  const routes = md.match(/## Routes[^\n]*\n([\s\S]*?)\n## /)?.[1] ?? "";
  const rows = routes.split("\n").filter((l) => l.startsWith("| `")).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
  const states = md.split("## States and errors we design for")[1] ?? "";
  const sizes: Record<number, [number, number]> = { 0: [421, 774], 1: [1119, 1412], 2: [1250, 703] };

  return (
    <>
      <ProcessHeader here="Flows" />
      <main id="main" className="mx-auto w-full max-w-[1120px] px-6 pb-32 pt-14 md:px-10">
        <p className="font-numeral text-xs uppercase tracking-[0.16em] text-ink-2">Assignment 3 · Step 2</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.02] text-ink md:text-6xl">The flows</h1>
        <p className="mt-6 max-w-3xl border-l-2 border-green pl-5 font-serif text-xl italic leading-relaxed text-ink">{inline(sentence)}</p>
        <Markdown md={list} className="mt-6 max-w-3xl text-base" />

        {diagrams.map((d, i) => (
          <section key={d.title} aria-labelledby={`flow-${i}`} className="mt-16">
            <h2 id={`flow-${i}`} className="border-t border-rule-strong pt-6 font-display text-3xl text-ink">{d.title.replace(/^\d+ · /, "")}</h2>
            <div className="mt-6 overflow-x-auto rounded-md border border-rule bg-[#ffffff] p-4 md:p-8">
              <Image src={d.src} alt={`Flow diagram: ${d.title}. The same steps are listed in the Mermaid source below.`} width={sizes[i][0]} height={sizes[i][1]} className="mx-auto h-auto w-full" style={{ maxWidth: sizes[i][0] * 1.1 }} unoptimized />
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer rounded-sm text-sm text-ink-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">Mermaid source (text version)</summary>
              <pre className="mt-3 overflow-x-auto rounded-md bg-paper-3 p-4 text-xs leading-relaxed text-ink">{d.code}</pre>
            </details>
          </section>
        ))}

        <section aria-labelledby="routes" className="mt-16">
          <h2 id="routes" className="border-t border-rule-strong pt-6 font-display text-3xl text-ink">A page for each step</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-rule-strong font-numeral text-xs uppercase tracking-[0.14em] text-ink-2">
                  <th scope="col" className="py-3 pr-6 font-medium">Route</th>
                  <th scope="col" className="py-3 pr-6 font-medium">Step</th>
                  <th scope="col" className="py-3 font-medium">In the nav</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r[0]} className="border-b border-rule align-top">
                    <th scope="row" className="py-3 pr-6 font-normal text-ink">{inline(r[0])}</th>
                    <td className="py-3 pr-6 text-ink-2">{r[1]}</td>
                    <td className="py-3 text-ink-2">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="states" className="mt-16">
          <h2 id="states" className="border-t border-rule-strong pt-6 font-display text-3xl text-ink">States and errors we design for</h2>
          <Markdown md={states} className="max-w-3xl" />
        </section>
      </main>
    </>
  );
}
