"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClubPicker, FairwayPicker, HoleIllustration, ScorecardTable, ScoreTiles, toParText } from "@/components/golf";
import { ArrowIcon, Button, ButtonLink, Callout, ErrorIcon, Field, Stepper, TextArea, cx, useToast } from "@/components/ui";
import { holesFor, yardsAt } from "@/lib/courses";
import { useClub } from "@/lib/hooks";
import { finishRound } from "@/lib/round-actions";
import { emptyEntry, setEntry, update } from "@/lib/store";
import type { HoleEntry } from "@/lib/types";
import { puttsError } from "@/lib/validate";
import { Page, Placeholder } from "../../../_components/Placeholder";

const count = (xs: string[], id: string) => xs.filter((x) => x === id).length;
// iOS inset grouping: a small caps caption above a rounded white card.
const caption = "caps mb-2 px-1 text-[0.74rem] text-ink-2";
const group = "rounded-xl border border-rule/70 bg-paper-2 p-4 shadow-card sm:p-5";

export function HoleScreen({ id, holeParam }: { id: string; holeParam: string }) {
  const { ready, store, course } = useClub();
  const router = useRouter();
  const toast = useToast();
  const [keep, setKeep] = useState(false); // "Keep 4" on the shots-vs-score question
  const [finishing, setFinishing] = useState(false);

  if (!ready) return <Placeholder label="Walking to the tee" />;
  const round = store.rounds.find((r) => r.id === id);
  const c = round && course(round.courseSlug);
  if (!round || !c) return <Missing />;

  const holes = holesFor(c, round.holes);
  const n = Number(holeParam);
  const idx = holes.findIndex((h) => h.n === n);
  if (idx < 0) return <Missing what="hole" roundId={round.id} />;
  const hole = holes[idx];
  const prev = holes[idx - 1];
  const next = holes[idx + 1];
  const e: HoleEntry = { ...emptyEntry(), ...round.entries[n] };
  const tee = c.tees.find((t) => t.name === round.teeName) ?? c.tees[0];
  const yards = yardsAt(c, tee, hole);
  const patch = (p: Partial<HoleEntry>) => setEntry(round.id, n, p);

  const played = holes.filter((h) => round.entries[h.n]?.strokes != null);
  const toPar = played.reduce((a, h) => a + (round.entries[h.n]!.strokes! - h.par), 0);
  const gross = played.reduce((a, h) => a + round.entries[h.n]!.strokes!, 0);
  const shotsTotal = e.shots.length + e.penalties;
  const mismatch = e.shots.length > 0 && e.strokes != null && shotsTotal !== e.strokes && !keep;
  const puttsErr = puttsError(e.putts, e.strokes);
  const lastNote = [...store.rounds]
    .filter((r) => r.id !== round.id && r.courseSlug === c.slug && r.entries[n]?.note)
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.entries[n]?.note;

  // Clubs can count the score: the first time shots are logged on an unscored hole, the score follows them,
  // and putts follow the putter taps until the golfer sets putts by hand.
  const onShots = (shots: string[]) => {
    const p: Partial<HoleEntry> = { shots };
    const followed = e.strokes == null || e.strokes === e.shots.length + e.penalties;
    if (followed && shots.length) p.strokes = shots.length + e.penalties;
    if (e.putts == null || e.putts === count(e.shots, "pt")) p.putts = count(shots, "pt") || (e.putts == null ? null : 0);
    setKeep(false);
    patch(p);
  };

  const missing = holes.filter((h) => round.entries[h.n]?.strokes == null && h.n !== n).concat(e.strokes == null ? [hole] : []);
  const frontDone = round.holes === "18" && c.holes.length === 18 && holes.slice(0, 9).every((h) => round.entries[h.n]?.strokes != null) && holes.slice(9).every((h) => round.entries[h.n]?.strokes == null);

  const finish = (asFront = false) => {
    if (asFront) update((s) => ({ ...s, rounds: s.rounds.map((r) => (r.id === round.id ? { ...r, holes: "front" } : r)) }));
    finishRound(round.id);
    toast({ message: `Card saved: ${gross} at ${c.shortName}` });
    router.push(`/clubhouse/rounds/${round.id}`);
  };

  const back = round.status === "complete" ? { href: `/clubhouse/rounds/${round.id}`, label: "Back to the card" } : { href: "/clubhouse", label: "Clubhouse" };

  return (
    <>
      <DocTitle title={`Hole ${n}${hole.name ? ` · ${hole.name}` : ""} · ${c.shortName} · 18 Eagles`} />
      <Page className="!pt-4 md:!pt-8">
        <Link href={back.href} className="-ml-1 mb-4 inline-flex min-h-tap items-center gap-1.5 rounded-full bg-tint py-1 pl-2.5 pr-4 text-[0.95rem] font-semibold text-green transition-[background-color,transform] duration-150 is-hover:bg-tint-2 is-pressed:scale-[0.98]">
          <svg viewBox="0 0 10 16" className="h-4 w-2.5 shrink-0" aria-hidden="true"><path d="M8 2 L2 8 L8 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {back.label}
        </Link>

        {/* Where you are: the course, the hole, and the running score, on a Masters-green card */}
        <header className="tex-locker on-green grid grid-cols-[minmax(0,1fr)] gap-5 rounded-2xl px-5 py-5 shadow-card sm:px-7 sm:py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
          <div className="min-w-0">
            <p className="caps text-label text-gold">{c.shortName} · {round.teeName} tees{round.status === "complete" ? " · editing a finished card" : ""}</p>
            <h1 className="mt-1 font-display text-display-2 text-on-green">
              Hole {n}
              {hole.name && <span className="font-serif text-[0.55em] italic text-paper-3"> · {hole.name}</span>}
            </h1>
            <dl className="mt-4 grid max-w-md grid-cols-3 divide-x divide-white/25">
              {[["Par", String(hole.par)], ["Yards", String(yards)], ["Stroke index", String(hole.hcp)]].map(([k, v]) => (
                <div key={k} className="min-w-0 px-2.5 first:pl-0 sm:px-4">
                  <dt className="caps whitespace-nowrap text-[0.62rem] tracking-[0.04em] text-gold sm:text-[0.68rem] sm:tracking-[0.08em]">{k}</dt>
                  <dd className="mt-0.5 font-numeral text-[1.9rem] font-semibold leading-none tabular-nums text-on-green">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="flex flex-wrap items-baseline gap-x-3 rounded-xl bg-black/15 px-4 py-3 font-numeral text-lg tabular-nums text-paper-3 md:flex-col md:items-end md:gap-0.5 md:text-right" aria-live="polite">
            {played.length ? (
              <>
                <span className="caps text-[0.7rem] text-gold">Through {played.length}<span className="sr-only">, </span></span>
                <span className="text-[2rem] font-semibold leading-none text-on-green">{toParText(toPar)}<span className="sr-only">, </span></span>
                <span>{gross} strokes</span>
              </>
            ) : (
              <span className="text-on-green">Hole {idx + 1} of {holes.length}</span>
            )}
          </p>
        </header>


        <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-7">
            <section aria-labelledby="score-h">
              <h2 id="score-h" className={caption}>Your score</h2>
              <div className={group}>
                <ScoreTiles par={hole.par} value={e.strokes} label={`Score for hole ${n}`} holeLabel={`Hole ${n}`} onChange={(v) => { setKeep(false); patch({ strokes: v }); }} />
              </div>
            </section>

            {/* Always mounted, so the question is announced when it appears */}
            <div aria-live="polite" className="contents">
            {mismatch && (
              <Callout title={`You logged ${e.shots.length} ${e.shots.length === 1 ? "shot" : "shots"}${e.penalties ? ` and ${e.penalties} penalty` : ""} but scored ${e.strokes}.`}
                action={<div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => patch({ strokes: shotsTotal })}>Use {shotsTotal} as my score</Button>
                  <Button size="sm" variant="quiet" onClick={() => setKeep(true)}>Keep {e.strokes}</Button>
                </div>}>
                Which is right?
              </Callout>
            )}
            </div>

            <section aria-labelledby="detail-h">
              <h2 id="detail-h" className={caption}>Putts, tee shot, and penalties</h2>
              <div className={cx(group, "grid grid-cols-[minmax(0,1fr)] gap-6 p-0! sm:grid-cols-2 sm:gap-0")}>
                <div className="px-4 pt-4 sm:px-5 sm:py-5">
                  <Stepper label="Putts" value={e.putts} min={0} max={10} start={2} size="lg" unit={{ one: "putt", many: "putts" }} hint={puttsErr ? undefined : "Optional. Counts toward putting and greens stats."} onChange={(v) => patch({ putts: v })} />
                  {puttsErr && (
                    <p className="mt-2 flex items-start gap-2 text-[0.95rem] font-medium text-error" aria-live="polite"><ErrorIcon /><span>{puttsErr}</span></p>
                  )}
                </div>
                <div className="border-t border-rule/80 px-4 pb-4 pt-4 sm:border-l sm:border-t-0 sm:px-5 sm:py-5">
                  <Stepper label="Penalty strokes" value={e.penalties} min={0} max={6} size="lg" unit={{ one: "penalty stroke", many: "penalty strokes" }} hint="Already part of your score." onChange={(v) => patch({ penalties: v ?? 0 })} />
                </div>
                {hole.par >= 4 && (
                  <div className="border-t border-rule/80 px-4 pb-4 pt-4 sm:col-span-2 sm:px-5 sm:pb-5">
                    <FairwayPicker legend="Tee shot" value={e.fairway} onChange={(v) => patch({ fairway: v })} />
                  </div>
                )}
              </div>
            </section>

            <section aria-labelledby="clubs-h">
              <h2 id="clubs-h" className={caption}>Clubs, shot by shot <span className="font-sans normal-case tracking-normal">(optional)</span></h2>
              <div className={group}>
                <p className="mb-4 text-[0.95rem] text-ink-2">Tap the club for each shot. On an unscored hole, your score counts itself.</p>
                <ClubPicker bag={store.bag} shots={e.shots} holeLabel={`Hole ${n}`} onChange={onShots} />
              </div>
            </section>

            <div className={group}>
              <Field label="Note for this hole" optional hint="It shows up the next time you play this hole.">
                {(a) => <TextArea {...a} voice rows={2} value={e.note} onChange={(ev) => patch({ note: ev.target.value })} placeholder="Laid up short of the bunker" />}
              </Field>
            </div>
          </div>

          <aside aria-label={`Hole ${n} plan`} className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className={caption} aria-hidden="true">The hole</p>
            <div className="overflow-hidden rounded-xl border border-rule/70 bg-paper-3 p-3 shadow-card">
              <HoleIllustration hole={{ ...hole, yards }} seed={c.slug} orientation="portrait" detail="full" note={lastNote} className="mx-auto max-h-[70vh] w-full max-w-sm rounded-lg" />
            </div>
            {lastNote && <p className="mt-2 px-1 text-sm text-ink-2">The pencilled note is from your last round here.</p>}
          </aside>
        </div>

        {/* After the entry controls, so Tab reaches the score tiles first */}
        <details className="group mt-8" open>
          <summary className="inline-flex min-h-tap cursor-pointer list-none items-center gap-2 rounded-full bg-tint px-4 text-[0.95rem] font-semibold text-green transition-colors is-hover:bg-tint-2 [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 10 16" className="h-3.5 w-2 shrink-0 transition-transform group-open:rotate-90" aria-hidden="true"><path d="M2 2 L8 8 L2 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            The card so far
          </summary>
          <div className="mt-3">
            <ScorecardTable holes={holes} entries={round.entries} currentHole={n} compact caption={`Scorecard, ${c.shortName}`} teeName={round.teeName} onSelectHole={(h) => router.push(`/clubhouse/rounds/${round.id}/${h}`)} />
          </div>
        </details>
      </Page>

      {/* Moving on: an app's bottom action bar, sticky above the phone tab bar, at the bottom on desktop */}
      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 border-t border-rule bg-paper/92 shadow-[0_-8px_24px_-16px_rgb(0_0_0/0.35)] backdrop-blur-xl backdrop-saturate-150 md:bottom-0">
        <div className="mx-auto grid max-w-ledger grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 px-4 py-2.5 sm:px-6 md:flex md:justify-between md:py-3 lg:px-8">
          {prev ? (
            <ButtonLink href={`/clubhouse/rounds/${round.id}/${prev.n}`} variant="secondary" size="lg" icon={<ArrowIcon dir="left" />}>Hole {prev.n}</ButtonLink>
          ) : <span />}
          {next ? (
            <ButtonLink href={`/clubhouse/rounds/${round.id}/${next.n}`} variant="primary" size="lg" className="flex-row-reverse md:min-w-60" icon={<ArrowIcon />}>Hole {next.n}</ButtonLink>
          ) : round.status === "complete" ? (
            <ButtonLink href={`/clubhouse/rounds/${round.id}`} variant="primary" size="lg" className="md:min-w-60">Back to the card</ButtonLink>
          ) : (
            <Button variant="primary" size="lg" className="md:min-w-60" onClick={() => (missing.length ? setFinishing(true) : finish())}>Finish round</Button>
          )}
        </div>
        <div aria-live="polite">
        {finishing && missing.length > 0 && (
          <div className="mx-auto max-w-ledger px-4 pb-4 sm:px-6 lg:px-8" role="region" aria-label="Unscored holes">
            <Callout title={`${missing.length === 1 ? "Hole" : "Holes"} ${missing.map((h) => h.n).join(", ")} ${missing.length === 1 ? "has" : "have"} no score yet.`}
              action={<div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink href={`/clubhouse/rounds/${round.id}/${missing[0].n}`} size="sm" variant="secondary" onClick={() => setFinishing(false)}>Score hole {missing[0].n}</ButtonLink>
                {frontDone && <Button size="sm" variant="secondary" onClick={() => finish(true)}>Finish as the front nine</Button>}
                <ButtonLink href="/clubhouse" size="sm" variant="quiet">Save and finish later</ButtonLink>
              </div>}>
              Score every hole to post the card, so it can count toward your handicap.
            </Callout>
          </div>
        )}
        </div>
      </div>
    </>
  );
}

function Missing({ what = "round", roundId }: { what?: "round" | "hole"; roundId?: string }) {
  return (
    <Page>
      <h1 className="font-display text-display-2 text-ink">{what === "round" ? "This round isn't on this device" : "That hole isn't part of this round"}</h1>
      <p className="mt-4 max-w-measure font-serif text-lede text-ink-2">
        {what === "round" ? "Rounds are saved in the browser where you played them. It may have been deleted, or played on another device." : "Pick a hole from the card."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {roundId && <ButtonLink href={`/clubhouse/rounds/${roundId}`} variant="primary">Open the card</ButtonLink>}
        <ButtonLink href="/clubhouse" variant={roundId ? "secondary" : "primary"}>Back to the clubhouse</ButtonLink>
        <ButtonLink href="/clubhouse/rounds" variant="quiet">All cards</ButtonLink>
      </div>
    </Page>
  );
}

/** A descriptive tab title per hole ("Hole 7 · Torrey South · 18 Eagles"); route metadata can't know the hole. */
export function DocTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
    // After a client-side navigation Next writes the route's metadata title a moment later; put this one back.
    const keep = new MutationObserver(() => { if (document.title !== title) document.title = title; });
    keep.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => keep.disconnect();
  }, [title]);
  return null;
}
