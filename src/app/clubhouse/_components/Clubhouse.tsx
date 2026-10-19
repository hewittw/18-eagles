"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { BigNumber, HoleIllustration, toParText } from "@/components/golf";
import { fmtDate } from "@/components/golf/charts";
import { Button, ButtonLink, Callout, Card, ChoiceGroup, Field, NumberInput, SectionHeading } from "@/components/ui";
import { defaultHome, holesFor } from "@/lib/courses";
import { formatIndex } from "@/lib/handicap";
import { useClub } from "@/lib/hooks";
import { nextUnplayed } from "@/lib/round-actions";
import { goalTarget, honors as honorsOf, summarize, type RoundSummary } from "@/lib/stats";
import { patchProfile, update } from "@/lib/store";
import type { Goal, Store } from "@/lib/types";
import { parseIndex } from "@/lib/validate";
import { Page, Placeholder } from "./Placeholder";
import { TeeOff } from "./TeeOff";

const GOALS: { value: Goal; label: string }[] = [
  { value: "100", label: "Break 100" },
  { value: "90", label: "Break 90" },
  { value: "80", label: "Break 80" },
  { value: "scratch", label: "Play to scratch" },
];

export function Clubhouse() {
  const { ready, store, handicap, active, course } = useClub();
  const done = useMemo(
    () => store.rounds.filter((r) => r.status === "complete").map((r) => summarize(r, store.customCourses)).filter((s): s is RoundSummary => !!s && s.complete)
      .sort((a, b) => b.round.date.localeCompare(a.round.date) || b.round.createdAt - a.round.createdAt),
    [store.rounds, store.customCourses],
  );

  // Honors not yet celebrated, frozen at first render so they stay on screen while we mark them seen.
  const fresh = useRef<ReturnType<typeof honorsOf> | null>(null);
  const allHonors = useMemo(() => honorsOf(store.rounds, store.customCourses, handicap.history), [store.rounds, store.customCourses, handicap.history]);
  if (ready && fresh.current == null) fresh.current = allHonors.filter((h) => !store.honorsSeen.includes(h.id));
  useEffect(() => {
    if (!ready) return;
    const ids = allHonors.map((h) => h.id).filter((id) => !store.honorsSeen.includes(id));
    if (ids.length) update((s) => ({ ...s, honorsSeen: [...s.honorsSeen, ...ids] }));
    update((s) => ({ ...s, lastVisit: Date.now() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (!ready) return <Placeholder />;

  const welcomed = store.profile.welcomedAt != null || store.rounds.length > 0;
  const last = done[0];
  const teeCourse = last ? last.course : defaultHome(store.profile.homeCourse, store.customCourses);
  const activeCourse = active ? course(active.courseSlug) : undefined;
  const lastHere = last && done.find((d) => d.course.slug === teeCourse.slug && d.holes.length === 18);

  return (
    <>
      <Hero store={store} welcomed={welcomed} handicap={handicap} done={done} />

      <Page className="grid gap-14 md:gap-20">
        {active && activeCourse && (
          <section aria-labelledby="in-progress">
            <Card tone="green" padding="lg" className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="caps text-label text-gold">Round in progress</p>
                <h2 id="in-progress" className="mt-1 font-display text-title text-on-green">{activeCourse.name}</h2>
                <p className="mt-2 font-numeral text-lg text-paper-3">
                  {progressLine(active.entries, holesFor(activeCourse, active.holes))}
                </p>
              </div>
              <ButtonLink href={`/clubhouse/rounds/${active.id}/${nextUnplayed(active, activeCourse)}`} tone="green" variant="primary" size="lg">
                Resume at hole {nextUnplayed(active, activeCourse)}
              </ButtonLink>
            </Card>
          </section>
        )}

        {welcomed && !store.profile.goal && <GoalQuestion />}

        <section aria-labelledby="tee-off" className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0">
            <SectionHeading
              id="tee-off"
              eyebrow={last ? "Coming back" : "Your first round"}
              title={lastHere ? `Last time at ${teeCourse.shortName}: ${lastHere.gross}. Beat it.` : `Tee off at ${teeCourse.shortName}`}
              lede={
                lastHere ? (
                  <>Your best here is {Math.min(...done.filter((d) => d.course.slug === teeCourse.slug && d.holes.length === 18).map((d) => d.gross))}. Your tees are remembered.</>
                ) : (
                  <>Your home course is ready with the tees you&apos;d play. Tap your score on each hole; clubs and notes are optional.</>
                )
              }
            />
            {last?.round.note && (
              <figure className="mt-6 border-l-2 border-link pl-4">
                <blockquote className="font-serif text-lg italic text-link">“{last.round.note}”</blockquote>
                <figcaption className="mt-1 text-sm text-ink-2">Your note from {fmtDate(last.round.date)} at {last.course.shortName}</figcaption>
              </figure>
            )}
            <div className="mt-8">
              {active ? (
                <details className="rounded-xs border border-rule bg-paper-2 p-5">
                  <summary className="cursor-pointer font-medium text-ink">Start a different round instead</summary>
                  <div className="mt-5"><TeeOff course={teeCourse} rememberedTee={store.profile.lastTee[teeCourse.slug]} label="Start a new round" /></div>
                </details>
              ) : (
                <TeeOff course={teeCourse} rememberedTee={store.profile.lastTee[teeCourse.slug]} />
              )}
            </div>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[1rem]">
              <Link href="/clubhouse/courses" className="link">Choose another course</Link>
              <Link href="/clubhouse/rounds/new" className="link">Log a round you&apos;ve already played</Link>
            </p>
          </div>
          <CoursePlate course={teeCourse} />
        </section>

        {fresh.current && fresh.current.length > 0 && (
          <section aria-labelledby="honors">
            <SectionHeading id="honors" eyebrow="New since your last visit" title="Honors" />
            <ul className="mt-6 flex flex-wrap gap-3">
              {fresh.current.map((h) => (
                <li key={h.id} className="brass-plate hang rounded-xs px-5 py-3">
                  <p className="font-display text-xl leading-tight">{h.title}</p>
                  <p className="caps mt-1 text-[0.72rem]">{h.detail} · {fmtDate(h.date)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {done.length > 0 && (
          <section aria-labelledby="recent">
            <SectionHeading id="recent" eyebrow="The card file" title="Recent cards" action={<Link href="/clubhouse/rounds" className="link">All {done.length} cards</Link>} />
            <ol className="mt-6 divide-y divide-rule border-y border-rule">
              {done.slice(0, 3).map((d) => (
                <li key={d.round.id}>
                  <Link href={`/clubhouse/rounds/${d.round.id}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-1 py-4 transition-colors is-hover:bg-paper-3 sm:gap-6 sm:px-3">
                    <span className="caps w-16 text-[0.78rem] text-ink-2">{fmtDate(d.round.date)}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-lg text-ink">{d.course.shortName}</span>
                      <span className="block text-sm text-ink-2">{d.round.teeName} tees · {d.holes.length === 18 ? "18 holes" : d.round.holes === "front" ? "Front 9" : "Back 9"}</span>
                    </span>
                    <span className="flex items-baseline gap-3 font-numeral tabular-nums">
                      <span className="text-3xl font-semibold text-ink">{d.gross}</span>
                      <span className={`w-10 text-right text-lg ${d.toPar < 0 ? "text-under" : "text-ink-2"}`}>{toParText(d.toPar)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-4"><Link href="/clubhouse/stats" className="link">See how you play: every breakdown in Stats</Link></p>
          </section>
        )}
      </Page>
    </>
  );
}

// ───────────────────────── the hero: the handicap, or the one question ─────────────────────────
function Hero({ store, welcomed, handicap, done }: { store: Store; welcomed: boolean; handicap: ReturnType<typeof useClub>["handicap"]; done: RoundSummary[] }) {
  const goal = store.profile.goal;
  const avg18 = done.filter((d) => d.holes.length === 18).slice(0, 5);
  const recentAvg = avg18.length ? avg18.reduce((a, d) => a + d.gross, 0) / avg18.length : null;
  const cardsSoFar = 3 - handicap.roundsToFirst;

  return (
    <section aria-labelledby="hero-title" className="tex-locker on-green border-b border-gold/40">
      <div className="mx-auto grid max-w-ledger gap-10 px-4 pb-12 pt-10 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:pb-16 md:pt-14 lg:px-8">
        <div className="min-w-0">
          <p className="caps text-label text-gold">The Clubhouse</p>
          <h1 id="hero-title" className="mt-2 font-display text-display-2 text-on-green">
            {welcomed ? (done.length ? "Welcome back." : "Your locker is ready.") : "Welcome to 18 Eagles."}
          </h1>
          {welcomed ? (
            <div className="mt-8">
              {handicap.display != null ? (
                <BigNumber
                  tone="green"
                  label={handicap.source === "computed" ? "Handicap Index" : "Handicap Index · as you entered it"}
                  value={formatIndex(handicap.display)}
                  spoken={`Handicap Index ${formatIndex(handicap.display)}`}
                  sub={<IndexLine handicap={handicap} cardsSoFar={cardsSoFar} />}
                />
              ) : (
                <div>
                  <p className="caps text-label text-gold">Earning your Handicap Index</p>
                  <Tracker n={cardsSoFar} />
                  <p className="mt-4 max-w-md font-serif text-lede text-paper-3">
                    {cardsSoFar === 0 ? "Post three cards and your index appears here." : `${3 - cardsSoFar} more ${3 - cardsSoFar === 1 ? "card" : "cards"} and your index appears here.`}
                  </p>
                </div>
              )}
              {goal && (
                <p className="mt-6 font-numeral text-lg text-paper-3">
                  <span className="caps mr-2 text-[0.75rem] text-gold">Playing for</span>
                  {GOALS.find((g) => g.value === goal)?.label}
                  {recentAvg != null && (
                    <> · your last {avg18.length} average {recentAvg.toFixed(1)}{toGo(recentAvg, goal) <= 0 ? ", already there" : `, ${toGo(recentAvg, goal).toFixed(1)} strokes to go`}</>
                  )}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 max-w-xl font-serif text-lede text-paper-3">
              A golf journal that keeps every card. Start with your Handicap Index, then play your first hole. It takes a minute.
            </p>
          )}
        </div>
        {!welcomed ? <IndexQuestion /> : <MiniBoard done={done} />}
      </div>
    </section>
  );
}

function IndexLine({ handicap, cardsSoFar }: { handicap: ReturnType<typeof useClub>["handicap"]; cardsSoFar: number }) {
  if (handicap.source === "entered") {
    return <p>Calculated from your own cards after three rounds · {cardsSoFar} of 3 posted</p>;
  }
  const ch = handicap.change;
  const last = handicap.history[handicap.history.length - 1];
  return (
    <div className="grid gap-1">
      <p>
        {ch == null ? "Your first calculated index" : ch === 0 ? "No change" : ch < 0 ? `Down ${Math.abs(ch).toFixed(1)}` : `Up ${ch.toFixed(1)}`}
        {last && <> since {fmtDate(last.date)}</>}
        {handicap.low && <> · Low {formatIndex(handicap.low.value)} ({fmtDate(handicap.low.date)})</>}
      </p>
      {handicap.nextToDrop && (
        <p className="text-paper-3/90">
          Your next card replaces the {handicap.nextToDrop.gross} at {handicap.nextToDrop.courseName} from {fmtDate(handicap.nextToDrop.date)}
          {handicap.nextToDropCounts ? ", one that counts" : ""}.
        </p>
      )}
    </div>
  );
}

function Tracker({ n }: { n: number }) {
  return (
    <ol className="mt-3 flex gap-2" aria-label={`${n} of 3 cards posted`}>
      {[0, 1, 2].map((i) => (
        <li key={i} className={`grid size-16 place-items-center rounded-xs border font-numeral text-3xl font-semibold ${i < n ? "border-gold bg-gold text-green-3" : "border-gold/60 text-gold"}`} aria-hidden="true">
          {i + 1}
        </li>
      ))}
    </ol>
  );
}

/** The first visit's one question, asked in the hero itself (no wizard, no tour). */
function IndexQuestion() {
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | undefined>();
  const input = useRef<HTMLInputElement>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = parseIndex(raw);
    if (r.error) {
      setError(r.error);
      input.current?.focus();
      return;
    }
    patchProfile({ enteredIndex: r.value, welcomedAt: Date.now() });
  };
  return (
    <Card padding="lg" className="w-full max-w-md justify-self-start md:justify-self-end">
      <form onSubmit={submit} noValidate className="grid gap-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-ink">Do you have a Handicap Index?</h2>
          <p className="mt-1 text-ink-2">We&apos;ll use it until your own cards take over.</p>
        </div>
        <Field label="Your Handicap Index" hint="Like 12.4. A plus handicap is written +1.2." error={error}>
          {(a) => <NumberInput ref={input} decimal {...a} value={raw} onChange={(e) => { setRaw(e.target.value); if (error) setError(undefined); }} autoComplete="off" />}
        </Field>
        <Button type="submit" variant="primary" size="lg" block>Use this index</Button>
        <div className="border-t border-rule pt-4">
          <Button type="button" variant="secondary" block onClick={() => patchProfile({ enteredIndex: null, welcomedAt: Date.now() })}>
            Not yet: I&apos;ll earn one
          </Button>
          <p className="mt-2 text-center text-sm text-ink-2">It takes three cards. Your first can be today.</p>
        </div>
      </form>
    </Card>
  );
}

function GoalQuestion() {
  return (
    <section aria-labelledby="goal-q">
      <SectionHeading id="goal-q" eyebrow="One more question" title="What are you playing for?" lede="Your stats will measure against it. Change it anytime in the Locker." />
      <div className="mt-6 max-w-2xl">
        <ChoiceGroup legend="Your goal" hideLegend layout="grid" size="lg" value={null} onChange={(g) => patchProfile({ goal: g })} options={GOALS} />
      </div>
    </section>
  );
}

/** The last few cards as hung leaderboard tiles, or the first card's place on the board. */
function MiniBoard({ done }: { done: RoundSummary[] }) {
  const recent = done.slice(0, 5).reverse();
  if (!recent.length) {
    return (
      <div className="justify-self-start rounded-xs border border-gold/40 p-5 md:justify-self-end">
        <p className="caps text-label text-gold">The board</p>
        <p className="mt-2 max-w-xs font-serif text-paper-3">Your first card hangs here, hole by hole, the way the old scoreboards did it.</p>
      </div>
    );
  }
  return (
    <div className="min-w-0 justify-self-start md:justify-self-end">
      <p className="caps text-label text-gold">Last {recent.length} {recent.length === 1 ? "card" : "cards"}</p>
      <ol className="mt-3 flex gap-1.5">
        {recent.map((d, i) => (
          <li key={d.round.id} className="hang" style={{ ["--i" as string]: i }}>
            <Link href={`/clubhouse/rounds/${d.round.id}`} className="tile grid w-14 place-items-center gap-0.5 rounded-xs px-1 pb-1.5 pt-2 text-ink is-hover:border-ink sm:w-16" aria-label={`${d.course.shortName}, ${fmtDate(d.round.date)}: ${d.gross}, ${toParText(d.toPar)}`}>
              <span className="font-numeral text-2xl font-semibold tabular-nums sm:text-3xl">{d.gross}</span>
              <span className={`font-numeral text-sm tabular-nums ${d.toPar < 0 ? "text-under" : "text-green"}`}>{toParText(d.toPar)}</span>
              <span className="caps text-[0.6rem] text-ink-2">{fmtDate(d.round.date, { month: "short" })}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CoursePlate({ course }: { course: NonNullable<ReturnType<ReturnType<typeof useClub>["course"]>> }) {
  const sig = course.holes.find((h) => h.n === course.signatureHole) ?? course.holes[0];
  return (
    <Link href={`/clubhouse/courses/${course.slug}`} className="group/plate block min-w-0 self-start rounded-xs border border-rule bg-paper-2 is-hover:border-ink">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-rule bg-paper-3">
        {course.hero ? (
          <Image src={course.hero.src} alt={course.hero.alt} fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" priority />
        ) : (
          <HoleIllustration hole={sig} seed={course.slug} orientation="landscape" detail="plain" className="h-full w-full" decorative />
        )}
      </div>
      <div className="flex items-baseline justify-between gap-4 p-4">
        <span className="min-w-0">
          <span className="block truncate font-serif text-lg text-ink group-hover/plate:underline">{course.name}</span>
          <span className="block text-sm text-ink-2">{course.city}, {course.region}</span>
        </span>
        <span className="shrink-0 font-numeral text-ink-2 tabular-nums">Par {course.tees[0].par}</span>
      </div>
      {course.hero && <p className="px-4 pb-3 text-xs text-ink-2">Photo: {course.hero.credit}, {course.hero.license}</p>}
    </Link>
  );
}

/** Strokes from a recent average to the goal: "Break 90" means 89 or better; scratch means par 72. */
const toGo = (avg: number, g: Goal) => avg - (g === "scratch" ? goalTarget[g] : goalTarget[g] - 1);

function progressLine(entries: Store["rounds"][number]["entries"], holes: { n: number; par: number }[]) {
  const played = holes.filter((h) => entries[h.n]?.strokes != null);
  if (!played.length) return `Hole 1 of ${holes.length} · not started`;
  const toPar = played.reduce((a, h) => a + (entries[h.n]!.strokes! - h.par), 0);
  return `Through ${played.length} of ${holes.length} · ${toParText(toPar)}`;
}

