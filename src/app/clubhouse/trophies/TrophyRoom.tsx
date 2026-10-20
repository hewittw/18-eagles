"use client";
// The full Trophy Room: this week's case, the weeks before, the crystal, and the career shelf.
// Won pieces show the date and link to the card; the rest are silhouettes with how to win them.
import Link from "next/link";
import { PageHeader } from "@/components/golf";
import { fmtDate } from "@/components/golf/charts";
import { TrophyArt } from "@/components/golf/TrophyArt";
import { ButtonLink, Chevron, cx, SectionHeading } from "@/components/ui";
import { useClub } from "@/lib/hooks";
import { CATALOG, isFresh, TIER_WORD, trophyDef, weekStart, type EarnedTrophy, type Tier, type TrophyDef } from "@/lib/trophies";
import { Page, Placeholder } from "../_components/Placeholder";
import { daysLeftText, SheenStyle, useTrophies, useVisitStart, WeekSlots } from "../_components/TrophyCase";

const CAREER_GROUPS: { title: string; ids: string[] }[] = [
  { title: "Scoring", ids: ["broke-100", "broke-90", "broke-80", "under-72", "salver", "course-record", "low-index"] },
  { title: "Shot-making", ids: ["first-birdie", "par-run", "amen", "par3", "clean-nine", "strong-finish", "fairways"] },
  { title: "The habit", ids: ["first-card", "full-card", "lag-master", "links", "cards-5", "cards-10", "cards-25", "regular"] },
];

const times = (n: number) => (n === 1 ? "once" : n === 2 ? "twice" : `${n} times`);
const range = (start: string) => {
  const d = new Date(start + "T12:00:00");
  const e = new Date(d);
  e.setDate(e.getDate() + 6);
  const a = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const b = e.toLocaleDateString("en-US", d.getMonth() === e.getMonth() ? { day: "numeric" } : { month: "short", day: "numeric" });
  return `${a}–${b}`;
};

export function TrophyRoom() {
  const { ready, store } = useClub();
  const state = useTrophies();
  const since = useVisitStart();
  if (!ready) return <Placeholder label="Opening the Trophy Room" />;

  const week = state.thisWeek;
  const tally = (["gold", "silver", "bronze", "crystal"] as Tier[]).map((t) => ({ t, n: state.earned.filter((e) => e.tier === t).length }));
  const weekly = CATALOG.filter((d) => d.category === "weekly");
  const crystal = CATALOG.filter((d) => d.category === "crystal");
  const wins = (id: string) => state.byId.get(id) ?? [];

  // Weeks before this one that won something, newest first.
  const past = new Map<string, EarnedTrophy[]>();
  for (const e of state.earned) {
    if (trophyDef(e.id).category !== "weekly") continue;
    const w = weekStart(e.date);
    if (w === week.start) continue;
    past.set(w, [...(past.get(w) ?? []), e]);
  }
  const pastWeeks = [...past.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 8);

  return (
    <Page className="grid gap-14 md:gap-20">
      <SheenStyle />
      <PageHeader
        back={{ href: "/clubhouse", label: "Clubhouse" }}
        eyebrow="Won on the course, kept here"
        title="Trophy Room"
        lede="Every trophy is worked out from your own cards. The weekly case empties each Monday; crystal is won every time it happens; career pieces are won once."
      />

      {/* This week, in the green cabinet */}
      <section aria-labelledby="tr-week" className="-mt-4 md:-mt-8">
        <div className="tex-locker on-green overflow-hidden rounded-2xl border border-green-3 shadow-card">
          <div className="grid gap-5 px-4 pb-6 pt-6 sm:px-7 sm:pt-7">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="min-w-0">
                <p className="caps text-label text-gold">Week of {range(week.start)} · {daysLeftText(week.daysLeft)}</p>
                <h2 id="tr-week" className="mt-1 font-display text-title text-on-green">This week&apos;s case</h2>
                <p className="mt-1 max-w-xl font-serif text-paper-3">
                  {week.rank
                    ? `Your best card this week, ${week.rank.gross} at ${week.rank.course}, ranks #${week.rank.rank} of all ${week.rank.of} cards you've posted.`
                    : "No card yet this week. Your next one is ranked against every card you've posted."}
                </p>
              </div>
              <dl className="flex gap-5 sm:gap-7">
                <div>
                  <dt className="caps text-[0.7rem] text-gold">Trophies won</dt>
                  <dd className="font-numeral text-[2.4rem] font-semibold leading-none tabular-nums">{state.wonCount}<span className="text-lg font-medium text-paper-3"> of {state.total}</span></dd>
                </div>
                {tally.map(({ t, n }) => (
                  <div key={t} className="max-sm:hidden">
                    <dt className="caps text-[0.7rem] text-gold">{TIER_WORD[t]} wins</dt>
                    <dd className="font-numeral text-[2.4rem] font-semibold leading-none tabular-nums">{n}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <WeekSlots week={week} honorsSeen={store.honorsSeen} since={since} />
            <ul className="grid grid-cols-3 gap-2 text-center md:gap-3" aria-label="Weeks won, all time">
              {weekly.map((d) => {
                const w = wins(d.id);
                return (
                  <li key={d.id} className="rounded-lg bg-black/[0.12] px-2 py-2.5">
                    <span className="block font-numeral text-xl font-semibold tabular-nums">{w.length} <span className="text-sm font-medium text-paper-3">{w.length === 1 ? "week" : "weeks"}</span></span>
                    <span className="block text-[0.78rem] leading-tight text-paper-3 sm:text-[0.85rem]">{d.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {pastWeeks.length > 0 && (
          <div className="mt-8">
            <h3 className="caps mb-2 px-4 text-label text-ink-2 sm:px-5">Weeks before</h3>
            <ul className="divide-y divide-rule/80 overflow-hidden rounded-xl border border-rule/70 bg-paper-2 shadow-card">
              {pastWeeks.map(([w, list]) => (
                <li key={w} className="grid min-h-16 gap-2 px-4 py-3 sm:flex sm:items-center sm:gap-4 sm:px-5">
                  <span className="shrink-0 sm:w-28 font-numeral text-lg font-semibold tabular-nums text-ink">{range(w)}</span>
                  <ul className="flex min-w-0 flex-1 flex-wrap gap-x-5 gap-y-1.5">
                    {list.map((e) => (
                      <li key={e.key} className="flex items-center gap-2">
                        <TrophyArt art={trophyDef(e.id).art} tier={e.tier} className="size-8 shrink-0" />
                        <span className="text-[0.95rem] text-ink">
                          <Link href={`/clubhouse/rounds/${e.roundId}`} className="link font-medium">{trophyDef(e.id).name}</Link>
                          <span className="text-ink-2"> · {TIER_WORD[e.tier]}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Crystal */}
      <section aria-labelledby="tr-crystal">
        <SectionHeading id="tr-crystal" eyebrow="Won every time" title="Crystal" lede="For the shots you remember: eagles, aces and birdie runs, hole by hole cards only." />
        {/* Five pieces, balanced at every width: 2 + 2 + one wide on a phone, 3 + 2 on a 6-track grid, then 5 across. */}
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-6 lg:grid-cols-5">
          {crystal.map((d, i) => (
            <CrystalTile
              key={d.id}
              def={d}
              wins={wins(d.id)}
              fresh={wins(d.id).some((e) => isFresh(e, store.honorsSeen, since))}
              wide={crystal.length % 2 === 1 && i === crystal.length - 1}
              className={cx(i < 3 ? "sm:col-span-2" : "sm:col-span-3", "lg:col-span-1")}
            />
          ))}
        </ul>
      </section>

      {/* Career */}
      <section aria-labelledby="tr-career">
        <SectionHeading id="tr-career" eyebrow="Won once, kept for good" title="Career" lede="Milestones on the way to your goal. A few are held: beat your own mark and they move to the new card." />
        <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {CAREER_GROUPS.map((g) => {
            const won = g.ids.filter((id) => wins(id).length).length;
            return (
              <div key={g.title} className="min-w-0">
                <h3 className="caps mb-2 flex justify-between px-4 text-label text-ink-2 sm:px-5">
                  <span>{g.title}<span className="sr-only">, </span></span>
                  <span className="tabular-nums">{won} of {g.ids.length} won</span>
                </h3>
                <ul className="divide-y divide-rule/80 overflow-hidden rounded-xl border border-rule/70 bg-paper-2 shadow-card">
                  {g.ids.map((id) => <CareerRow key={id} def={trophyDef(id)} wins={wins(id)} fresh={wins(id).some((e) => isFresh(e, store.honorsSeen, since))} />)}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {!store.rounds.length && (
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/clubhouse" variant="primary">Tee off</ButtonLink>
          <ButtonLink href="/clubhouse/rounds/new">Log a round you&apos;ve played</ButtonLink>
        </div>
      )}
    </Page>
  );
}

function CrystalTile({ def, wins, fresh, wide, className }: { def: TrophyDef; wins: EarnedTrophy[]; fresh: boolean; wide?: boolean; className?: string }) {
  const latest = wins[0];
  return (
    <li
      className={cx(
        "relative flex min-w-0 flex-col items-center rounded-xl border p-4 text-center shadow-card",
        latest ? "border-rule/70 bg-paper-2" : "border-dashed border-rule-strong bg-paper-3/60 shadow-none",
        // The odd one out on a phone spans both columns and lies on its side: art left, words right.
        wide && "max-sm:col-span-2 max-sm:grid max-sm:grid-cols-[auto_minmax(0,1fr)] max-sm:items-center max-sm:gap-x-4 max-sm:text-left max-sm:[&>:is(p,h3,a)]:col-start-2 max-sm:justify-items-start",
        className,
      )}
    >
      {latest && <span aria-hidden="true" className="trophy-sheen" />}
      {fresh && <span className="caps absolute right-2 top-2 rounded-xs bg-green px-1.5 py-0.5 text-[0.62rem] text-on-green">New</span>}
      <div className={cx("size-20 sm:size-24", !latest && "text-rule-strong", wide && "max-sm:row-span-4 max-sm:row-start-1 max-sm:self-center")}>
        <TrophyArt art={def.art} tier="crystal" locked={!latest} className="size-full" />
      </div>
      <p className="caps mt-2 whitespace-nowrap text-[0.66rem] text-gold-ink">{latest ? `Won ${times(wins.length)}` : "Not won yet"}</p>
      <h3 className="mt-1 font-serif text-lg leading-tight text-ink">{def.name}</h3>
      {latest ? (
        <>
          <p className="mt-1 text-pretty text-[0.88rem] leading-snug text-ink-2">{latest.detail}</p>
          <Link href={`/clubhouse/rounds/${latest.roundId}`} className="link mt-1.5 inline-flex min-h-6 items-center text-[0.88rem] font-medium after:absolute after:inset-0 after:rounded-xl">
            {fmtDate(latest.date)}<span className="sr-only">: see the card for {def.name}</span>
          </Link>
        </>
      ) : (
        <p className="mt-1 text-pretty text-[0.88rem] leading-snug text-ink-2"><span className="sr-only">To win: </span>{def.how}</p>
      )}
    </li>
  );
}

function CareerRow({ def, wins, fresh }: { def: TrophyDef; wins: EarnedTrophy[]; fresh: boolean }) {
  const latest = wins[0];
  const inner = (
    <>
      <span className={cx("grid size-12 shrink-0 place-items-center rounded-sm", latest ? "bg-tint" : "bg-paper-3 text-rule-strong")}>
        <TrophyArt art={def.art} tier={latest?.tier ?? def.tier} locked={!latest} className="size-10" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[1.02rem] font-semibold text-ink">{def.name}</span>
          {fresh && <span className="caps rounded-xs bg-green px-1.5 py-0.5 text-[0.6rem] text-on-green">New</span>}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-ink-2">
          {latest ? <>{TIER_WORD[latest.tier]} · {latest.detail}{wins.length > 1 ? ` · won ${times(wins.length)}` : ""}</> : <><span className="caps text-[0.68rem]">{TIER_WORD[def.tier]} · to win</span> {def.how}</>}
        </span>
      </span>
      <span className={cx("shrink-0 text-right text-sm tabular-nums", latest ? "font-numeral text-base text-ink" : "text-ink-2")}>
        {latest ? fmtDate(latest.date) : <span className="caps text-[0.66rem]">Locked</span>}
      </span>
    </>
  );
  return (
    <li>
      {latest?.roundId ? (
        <Link href={`/clubhouse/rounds/${latest.roundId}`} className="group/row flex min-h-16 items-center gap-3.5 px-4 py-3 transition-colors duration-150 -outline-offset-2 is-hover:bg-paper-3 is-pressed:bg-tint sm:px-5">
          {inner}
          <Chevron className="text-rule-strong" />
        </Link>
      ) : (
        <div className={cx("flex min-h-16 items-center gap-3.5 px-4 py-3 sm:px-5", latest && "pr-[2.4rem] sm:pr-[2.65rem]")}>{inner}</div>
      )}
    </li>
  );
}
