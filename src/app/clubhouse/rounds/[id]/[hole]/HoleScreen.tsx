"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClubPicker, FairwayPicker, HoleIllustration, ScorecardTable, ScoreTiles, toParText } from "@/components/golf";
import { Button, ButtonLink, Callout, ErrorIcon, Field, Stepper, TextArea, useToast } from "@/components/ui";
import { holesFor } from "@/lib/courses";
import { useClub } from "@/lib/hooks";
import { finishRound } from "@/lib/round-actions";
import { emptyEntry, setEntry, update } from "@/lib/store";
import type { HoleEntry } from "@/lib/types";
import { puttsError } from "@/lib/validate";
import { Page, Placeholder } from "../../../_components/Placeholder";

const count = (xs: string[], id: string) => xs.filter((x) => x === id).length;

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
  const yards = c.tees[0].name === tee.name ? hole.yards : Math.round((hole.yards * tee.yards) / c.tees[0].yards);
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

  return (
    <>
      <DocTitle title={`Hole ${n}${hole.name ? ` · ${hole.name}` : ""} · ${c.shortName} · 18 Eagles`} />
      <Page className="!pt-5 md:!pt-8">
        {/* Where you are: the course, the hole, and the running score */}
        <header className="grid gap-4 border-b border-ink pb-5 md:grid-cols-[1fr_auto] md:items-end">
          <div className="min-w-0">
            <Link href={round.status === "complete" ? `/clubhouse/rounds/${round.id}` : "/clubhouse"} className="caps -ml-2 inline-flex min-h-tap items-center gap-2 rounded-xs px-2 text-[0.8rem] text-ink-2 is-hover:bg-paper-3 is-hover:text-ink">
              <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M16 5 H2 M6 1 L2 5 L6 9" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
              {round.status === "complete" ? "Back to the card" : "Clubhouse"}
            </Link>
            <p className="caps mt-1 text-label text-gold-ink">{c.shortName} · {round.teeName} tees{round.status === "complete" ? " · editing a finished card" : ""}</p>
            <h1 className="mt-1 font-display text-display-2 text-ink">
              Hole {n}
              {hole.name && <span className="font-serif text-[0.55em] italic text-ink-2"> · {hole.name}</span>}
            </h1>
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-numeral text-xl tabular-nums text-ink">
              <span>Par {hole.par}</span>
              <span>{yards} yds</span>
              <span className="text-ink-2">Stroke index {hole.hcp}</span>
            </p>
          </div>
          <p className="font-numeral text-lg tabular-nums text-ink-2" aria-live="polite">
            {played.length ? <>Through {played.length} · <span className={toPar < 0 ? "text-under" : "text-ink"}>{toParText(toPar)}</span> · {gross} strokes</> : `Hole ${idx + 1} of ${holes.length}`}
          </p>
        </header>

        <details className="group mt-4" open>
          <summary className="caps inline-flex min-h-tap cursor-pointer items-center gap-2 rounded-xs text-[0.8rem] text-ink-2">
            <span className="transition-transform group-open:rotate-90" aria-hidden="true">›</span> The card so far
          </summary>
          <div className="mt-2">
            <ScorecardTable holes={holes} entries={round.entries} currentHole={n} compact caption={`Scorecard, ${c.shortName}`} teeName={round.teeName} onSelectHole={(h) => router.push(`/clubhouse/rounds/${round.id}/${h}`)} />
          </div>
        </details>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
          <div className="grid min-w-0 content-start gap-9">
            <section aria-labelledby="score-h">
              <h2 id="score-h" className="caps text-label text-ink-2">Your score</h2>
              <div className="mt-3">
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

            <section aria-labelledby="detail-h" className="grid gap-8 sm:grid-cols-2">
              <h2 id="detail-h" className="sr-only">Putts, tee shot, and penalties</h2>
              <div>
                <Stepper label="Putts" value={e.putts} min={0} max={10} start={2} size="lg" unit={{ one: "putt", many: "putts" }} hint={puttsErr ? undefined : "Optional. Counts toward putting and greens stats."} onChange={(v) => patch({ putts: v })} />
                {puttsErr && (
                  <p className="mt-2 flex items-start gap-2 text-[0.95rem] font-medium text-error" aria-live="polite"><ErrorIcon /><span>{puttsErr}</span></p>
                )}
              </div>
              <Stepper label="Penalty strokes" value={e.penalties} min={0} max={6} size="lg" unit={{ one: "penalty stroke", many: "penalty strokes" }} hint="Already part of your score." onChange={(v) => patch({ penalties: v ?? 0 })} />
              {hole.par >= 4 && (
                <div className="sm:col-span-2">
                  <FairwayPicker legend="Tee shot" value={e.fairway} onChange={(v) => patch({ fairway: v })} />
                </div>
              )}
            </section>

            <section aria-labelledby="clubs-h">
              <h2 id="clubs-h" className="caps text-label text-ink-2">Clubs, shot by shot <span className="font-sans normal-case tracking-normal">(optional)</span></h2>
              <p className="mt-1 text-[0.95rem] text-ink-2">Tap the club for each shot. On an unscored hole, your score counts itself.</p>
              <div className="mt-3">
                <ClubPicker bag={store.bag} shots={e.shots} holeLabel={`Hole ${n}`} onChange={onShots} />
              </div>
            </section>

            <Field label="Note for this hole" optional hint="It shows up the next time you play this hole.">
              {(a) => <TextArea {...a} voice rows={2} value={e.note} onChange={(ev) => patch({ note: ev.target.value })} placeholder="Laid up short of the bunker" />}
            </Field>
          </div>

          <aside aria-label={`Hole ${n} plan`} className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="tex-linen rounded-xs border border-rule p-3">
              <HoleIllustration hole={{ ...hole, yards }} seed={c.slug} orientation="portrait" detail="full" note={lastNote} className="mx-auto max-h-[70vh] w-full max-w-sm" />
            </div>
            {lastNote && <p className="mt-2 text-sm text-ink-2">The pencilled note is from your last round here.</p>}
          </aside>
        </div>
      </Page>

      {/* Moving on: sticky above the phone tab bar, at the bottom on desktop */}
      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 border-t border-ink bg-paper-2/95 backdrop-blur md:bottom-0">
        <div className="mx-auto flex max-w-ledger items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {prev ? <ButtonLink href={`/clubhouse/rounds/${round.id}/${prev.n}`} variant="quiet" size="md">← Hole {prev.n}</ButtonLink> : <span />}
          {next ? (
            <ButtonLink href={`/clubhouse/rounds/${round.id}/${next.n}`} variant="primary" size="lg">Hole {next.n} →</ButtonLink>
          ) : round.status === "complete" ? (
            <ButtonLink href={`/clubhouse/rounds/${round.id}`} variant="primary" size="lg">Back to the card</ButtonLink>
          ) : (
            <Button variant="primary" size="lg" onClick={() => (missing.length ? setFinishing(true) : finish())}>Finish round</Button>
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
