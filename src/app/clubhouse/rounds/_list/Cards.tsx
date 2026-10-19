"use client";
import Link from "next/link";
import { useMemo } from "react";
import { PageHeader, TeeSwatch, toParSpoken, toParText } from "@/components/golf";
import { ButtonLink, Tag, cx } from "@/components/ui";
import { teeOf } from "@/lib/courses";
import { keyOf } from "@/lib/handicap";
import { useClub } from "@/lib/hooks";
import { nextUnplayed } from "@/lib/round-actions";
import { summarize, type RoundSummary } from "@/lib/stats";
import { Page, Placeholder } from "../../_components/Placeholder";

const NINE_LABEL = { "18": "18", front: "F9", back: "B9" } as const;
const NINE_SPOKEN = { "18": "18 holes", front: "front nine", back: "back nine" } as const;

export function Cards() {
  const { ready } = useClub();
  if (!ready) return <Placeholder label="Fetching your cards" />;
  return <CardsBody />;
}

function CardsBody() {
  const { store, handicap, active, course } = useClub();

  const counting = useMemo(() => {
    const ids = new Set<string>();
    for (const d of handicap.differentials) if (handicap.counting.has(keyOf(d))) d.roundIds.forEach((id) => ids.add(id));
    return ids;
  }, [handicap]);

  // Finished cards, newest first, grouped by month.
  const months = useMemo(() => {
    const done = store.rounds
      .filter((r) => r.status === "complete")
      .sort((a, b) => b.date.localeCompare(a.date) || (b.finishedAt ?? b.createdAt) - (a.finishedAt ?? a.createdAt))
      .map((r) => summarize(r, store.customCourses))
      .filter((s): s is RoundSummary => !!s);
    const groups: { key: string; label: string; rows: RoundSummary[] }[] = [];
    for (const s of done) {
      const key = s.round.date.slice(0, 7);
      let g = groups[groups.length - 1];
      if (!g || g.key !== key) {
        g = { key, label: new Date(s.round.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" }), rows: [] };
        groups.push(g);
      }
      g.rows.push(s);
    }
    return groups;
  }, [store.rounds, store.customCourses]);

  const total = months.reduce((a, g) => a + g.rows.length, 0);
  const activeCourse = active ? course(active.courseSlug) : undefined;

  return (
    <Page className="grid gap-10 md:gap-14">
      <PageHeader
        eyebrow="Every round"
        title="Cards"
        lede={total ? `${total} ${total === 1 ? "card" : "cards"} in the book, newest first. A star marks the ones counting toward your index.` : undefined}
        actions={<ButtonLink href="/clubhouse/rounds/new" variant={active || !total ? "secondary" : "primary"}>Log a round you&apos;ve played</ButtonLink>}
      />

      {active && activeCourse && <InProgress roundId={active.id} courseName={activeCourse.name} next={nextUnplayed(active, activeCourse)} nine={active.holes} holeCount={activeCourse.holes.length} played={Object.values(active.entries).filter((e) => e.strokes != null).length} />}

      {total === 0 ? (
        <section aria-labelledby="empty-h" className="tex-linen grid gap-5 border border-rule px-5 py-10 text-center sm:px-10">
          <h2 id="empty-h" className="font-display text-display-2 text-ink">Your first card goes here</h2>
          <p className="mx-auto max-w-measure font-serif text-lede text-ink-2">
            Play a round on the hole screen, or add one you&apos;ve already played. Every card you finish is kept here, with its score, tees, and your note.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {!active && <ButtonLink href="/clubhouse" variant="primary" size="lg">Tee off</ButtonLink>}
            <ButtonLink href="/clubhouse/rounds/new" variant="secondary" size="lg">Log a round</ButtonLink>
          </div>
        </section>
      ) : (
        <div className="grid gap-10">
          {months.map((g) => (
            <section key={g.key} aria-labelledby={`m-${g.key}`}>
              <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-2">
                <h2 id={`m-${g.key}`} className="font-display text-title text-ink">{g.label}</h2>
                <p className="caps text-[0.74rem] text-ink-2">{g.rows.length} {g.rows.length === 1 ? "card" : "cards"}</p>
              </div>
              <ol className="divide-y divide-rule border-b border-rule">
                {g.rows.map((s) => <CardRow key={s.round.id} s={s} counts={counting.has(s.round.id)} />)}
              </ol>
            </section>
          ))}
        </div>
      )}
    </Page>
  );
}

function InProgress({ roundId, courseName, next, nine, holeCount, played }: { roundId: string; courseName: string; next: number; nine: "18" | "front" | "back"; holeCount: number; played: number }) {
  const of = holeCount === 9 || nine === "18" ? holeCount : 9;
  const position = nine === "back" && holeCount === 18 ? next - 9 : next;
  return (
    <section aria-labelledby="playing-h" className="tex-locker on-green flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border border-green-3 px-5 py-5 sm:px-7">
      <div className="min-w-0">
        <p className="caps text-label text-gold">In progress</p>
        <h2 id="playing-h" className="mt-1 font-display text-title text-on-green">{courseName}</h2>
        <p className="mt-1 font-numeral text-[1.05rem] text-paper-3 tabular-nums">
          {played} of {of} holes scored{nine !== "18" && holeCount === 18 ? ` · ${NINE_SPOKEN[nine]}` : ""}
        </p>
      </div>
      <ButtonLink href={`/clubhouse/rounds/${roundId}/${next}`} variant="primary" tone="green" size="lg">
        Hole {position} of {of} · Resume
      </ButtonLink>
    </section>
  );
}

function CardRow({ s, counts }: { s: RoundSummary; counts: boolean }) {
  const r = s.round;
  const d = new Date(r.date + "T12:00:00");
  const tee = teeOf(s.course, r.teeName);
  const under = s.toPar < 0;
  const spoken = `${d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}, ${s.course.shortName}, ${tee.name} tees, ${NINE_SPOKEN[r.holes]}: ${s.gross}, ${toParSpoken(s.toPar)}${counts ? ". Counts toward your index" : ""}.`;
  return (
    <li>
      <Link
        href={`/clubhouse/rounds/${r.id}`}
        aria-label={spoken + (r.note ? ` Note: ${r.note}` : "")}
        className="group grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-1 py-4 transition-colors is-hover:bg-paper-3 sm:grid-cols-[4rem_minmax(0,1fr)_auto_auto] sm:gap-x-6 sm:px-3"
      >
        <span className="text-center" aria-hidden="true">
          <span className="block font-numeral text-[1.9rem] font-semibold leading-none tabular-nums text-ink">{d.getDate()}</span>
          <span className="caps mt-1 block text-[0.7rem] text-ink-2">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
        </span>
        <span className="min-w-0" aria-hidden="true">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-serif text-[1.15rem] font-bold leading-snug text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{s.course.shortName}</span>
            <span className="text-[0.92rem] text-ink-2"><TeeSwatch color={tee.color} name={tee.name} /></span>
          </span>
          {r.note && <span className="mt-1 block truncate font-serif text-[0.98rem] italic text-link">{r.note}</span>}
          <span className="mt-1.5 flex flex-wrap gap-1.5 sm:hidden">
            <Tag>{NINE_LABEL[r.holes]}</Tag>
            {r.mode === "logged" && <Tag>Logged</Tag>}
            {counts && <Tag tone="gold">Counts</Tag>}
          </span>
        </span>
        <span className="hidden flex-wrap justify-end gap-1.5 sm:flex" aria-hidden="true">
          <Tag>{NINE_LABEL[r.holes]}</Tag>
          {r.mode === "logged" && <Tag>Logged</Tag>}
          {counts && <Tag tone="gold">Counts</Tag>}
        </span>
        <span className="flex items-baseline justify-end gap-2 text-right" aria-hidden="true">
          <span className="font-numeral text-[2rem] font-semibold leading-none tabular-nums text-ink">{s.gross}</span>
          <span className={cx("w-9 font-numeral text-[1.15rem] font-semibold tabular-nums", under ? "text-under" : "text-ink-2")}>{toParText(s.toPar)}</span>
        </span>
      </Link>
    </li>
  );
}
