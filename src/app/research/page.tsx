import Image from "next/image";
import type { Metadata } from "next";
import { Markdown, readDoc, researchImages, sections } from "@/lib/md";
import { ProcessHeader } from "../process-header";

export const metadata: Metadata = { title: "Research: how golf apps welcome someone new" };

const APPS = [
  { slug: "ghin", name: "GHIN", by: "USGA" },
  { slug: "18birdies", name: "18Birdies", by: "18Birdies" },
  { slug: "arccos", name: "Arccos", by: "Arccos Golf" },
];

// What we decided to use in our own first visit (Assignment 3, step 3), drawn from the three studies.
const DECISIONS: { take: string; from: string; became: string }[] = [
  { take: "The handicap is the hero of home", from: "GHIN", became: "A poster-size index on Locker Green, with its change line and the next score to drop off." },
  { take: "But never gate it behind 54 holes", from: "GHIN (what to avoid)", became: "The hero asks one question: type your index, or earn one with a 0 of 3 tracker. Something useful on the first screen." },
  { take: "Preselect the likeliest course", from: "18Birdies", became: "The Tee off card opens on your home course with your last tees. One tap to hole 1." },
  { take: "One goal question, not a profile", from: "18Birdies", became: "Break 100 · 90 · 80 · Scratch, inline in the hero. Empty stats become targets." },
  { take: "Par-relative score tiles in thumb reach", from: "GHIN", became: "ScoreTiles: big tiles named Birdie / Par / Bogey, one tap per hole." },
  { take: "Check entries against each other", from: "18Birdies (reviews)", became: "Putts can't exceed the score; fairway only on par 4s and 5s; a shot count that doesn't match the score asks before changing it." },
  { take: "No bag setup before value", from: "Arccos (what to avoid)", became: "A standard 14-club bag comes pre-filled, editable later in the Locker." },
  { take: "One tap per club, from your own bag", from: "Arccos", became: "ClubPicker: tap a club to log each shot; the score can count itself." },
  { take: "Honest numbers from round one", from: "Arccos", became: "Stats say “1 round” and still show the scoring mix, putts, and par types; nothing waits for 5 rounds." },
];

export default function Research() {
  const docs = APPS.map((a) => {
    const d = sections(readDoc(`docs/research/${a.slug}.md`));
    const get = (prefix: string) => d.sections.find((s) => s.title.toLowerCase().startsWith(prefix.toLowerCase()));
    return { ...a, d, get, images: researchImages(get("Images")?.body ?? "") };
  });

  return (
    <>
      <ProcessHeader here="Research" />
      <main id="main" className="mx-auto w-full max-w-[1120px] px-6 pb-32 pt-14 md:px-10">
        <p className="font-numeral text-xs uppercase tracking-[0.16em] text-ink-2">Assignment 3 · Step 3</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.02] text-ink md:text-6xl">How golf apps welcome someone new</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
          Three research agents each studied one app: its first screen, what it asks for, and how soon a new golfer gets
          something useful. Public sources only (store listings, help centers, reviews), with what was verified and what
          was inferred marked in each study.
        </p>

        <section aria-labelledby="decided" className="mt-16">
          <h2 id="decided" className="border-t border-rule-strong pt-6 font-display text-3xl text-ink">What we took for our first visit</h2>
          <div className="mt-6 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus" role="region" aria-label="Patterns we took (scrolls sideways)" tabIndex={0}>
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <caption className="sr-only">Patterns from the three apps and what each became in 18 Eagles</caption>
              <thead>
                <tr className="border-b border-rule-strong font-numeral text-xs uppercase tracking-[0.14em] text-ink-2">
                  <th scope="col" className="py-3 pr-6 font-medium">Pattern</th>
                  <th scope="col" className="py-3 pr-6 font-medium">From</th>
                  <th scope="col" className="py-3 font-medium">In 18 Eagles</th>
                </tr>
              </thead>
              <tbody>
                {DECISIONS.map((d) => (
                  <tr key={d.take} className="border-b border-rule align-top">
                    <th scope="row" className="py-3 pr-6 font-medium text-ink">{d.take}</th>
                    <td className="py-3 pr-6 text-ink-2">{d.from}</td>
                    <td className="py-3 text-ink-2">{d.became}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {docs.map((a, ai) => (
          <section key={a.slug} aria-labelledby={`app-${a.slug}`} className="mt-20">
            <div className="border-t border-rule-strong pt-6">
              <p className="font-numeral text-xs uppercase tracking-[0.16em] text-ink-2">Study · {a.by}</p>
              <h2 id={`app-${a.slug}`} className="mt-1 font-display text-4xl text-ink">{a.name}</h2>
              {a.d.intro && <Markdown md={a.d.intro} className="max-w-3xl" />}
            </div>

            {a.images.length > 0 && (
              <ul className="mt-6 flex snap-x gap-4 overflow-x-auto pb-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus" aria-label={`${a.name} screenshots (scrolls sideways)`} tabIndex={0}>
                {a.images.map((im, ii) => (
                  <li key={im.src} className="w-[200px] shrink-0 snap-start">
                    <figure>
                      <Image loading={ai === 0 && ii < 6 ? "eager" : undefined} src={im.src} alt={`${a.name} screenshot: ${im.caption}`} width={400} height={866} className="h-auto w-full rounded-md ring-1 ring-rule" sizes="200px" />
                      <figcaption className="mt-2 text-xs leading-snug text-ink-2">{im.caption}. <span className="whitespace-nowrap">Screenshot, for study.</span></figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl text-ink">Take</h3>
                <Markdown md={a.get("9.")?.body ?? a.get("Take")?.body ?? ""} />
              </div>
              <div>
                <h3 className="font-display text-2xl text-ink">Avoid</h3>
                <Markdown md={a.get("Avoid")?.body ?? ""} />
              </div>
            </div>

            <details className="group mt-8 rounded-md border border-rule bg-paper-2 px-5 py-4">
              <summary className="cursor-pointer rounded-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
                The full study: first screen, what it asks, time to value, score entry, handicap, and sources
              </summary>
              <div className="mt-4 grid gap-6">
                {a.d.sections.filter((s) => !/^(9\.|Avoid|Images|Take)/.test(s.title)).map((s) => (
                  <div key={s.title}>
                    <h3 className="font-display text-xl text-ink">{s.title.replace(/^\d+\.\s*/, "")}</h3>
                    <Markdown md={s.body} />
                  </div>
                ))}
              </div>
            </details>
          </section>
        ))}
      </main>
    </>
  );
}
