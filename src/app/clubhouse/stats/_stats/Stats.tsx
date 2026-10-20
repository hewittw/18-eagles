"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BigNumber, ClubUsage, DistributionBar, fmtDate, fmtToPar, HoleHeat, PageHeader, ParTypeBars, TrendChart, type TrendPoint } from "@/components/golf";
import { Button, Callout, ChoiceGroup, Field, SectionHeading, Select, cx } from "@/components/ui";
import { formatIndex } from "@/lib/handicap";
import { useClub } from "@/lib/hooks";
import { breakdown, DEFAULT_FILTERS, goalTarget, type Filters, type HoleFilter, type Range } from "@/lib/stats";
import { Page, Placeholder } from "../../_components/Placeholder";
import { EarlyStats } from "./EarlyStats";
import { Figure, FrontBack } from "./Figures";
import { IndexLedger } from "./IndexLedger";

const FILTER_KEY = "18eagles:stats-filters";
const METRIC_KEY = "18eagles:stats-metric";
type Metric = "gross" | "toPar" | "index";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return typeof fallback === "object" ? { ...fallback, ...JSON.parse(raw) } : (JSON.parse(raw) as T);
  } catch {}
  return fallback;
}
function save(key: string, v: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

export function Stats() {
  const { ready } = useClub();
  if (!ready) return <Placeholder label="Reading your cards" />;
  return <StatsBody />;
}

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: "5", label: "Last 5" }, { value: "10", label: "Last 10" }, { value: "20", label: "Last 20" }, { value: "year", label: "This year" }, { value: "all", label: "All" },
];
const HOLE_OPTIONS: { value: HoleFilter; label: string }[] = [{ value: "all", label: "All" }, { value: "18", label: "18" }, { value: "9", label: "9" }];

/** Only mounted once localStorage is readable, so the saved filters load on the first client render. */
function StatsBody() {
  const router = useRouter();
  const { store, handicap, course } = useClub();
  const [rawFilters, setRawFilters] = useState<Filters>(() => load(FILTER_KEY, DEFAULT_FILTERS));
  const [metric, setMetricState] = useState<Metric>(() => load<Metric>(METRIC_KEY, "gross"));
  const setFilters = (f: Filters) => { setRawFilters(f); save(FILTER_KEY, f); };
  const setMetric = (m: Metric) => { setMetricState(m); save(METRIC_KEY, m); };
  // The reset buttons disappear once used: put keyboard focus on the first filter, not the page body.
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>('section[aria-labelledby="filters-h"] input:checked')?.focus());
  };

  const finished = useMemo(() => store.rounds.filter((r) => r.status === "complete" && course(r.courseSlug)), [store.rounds, course]);

  // Courses played, most played first (the course filter and the "pick a course" shortcuts).
  const played = useMemo(() => {
    const n = new Map<string, number>();
    for (const r of finished) n.set(r.courseSlug, (n.get(r.courseSlug) ?? 0) + 1);
    return [...n.entries()].map(([slug, count]) => ({ slug, count, course: course(slug)! })).sort((a, b) => b.count - a.count || a.course.shortName.localeCompare(b.course.shortName));
  }, [finished, course]);

  // A saved course filter for a course with no cards any more falls back to all courses.
  const filters: Filters = useMemo(() => (rawFilters.course !== "all" && !played.some((p) => p.slug === rawFilters.course) ? { ...rawFilters, course: "all" } : rawFilters), [rawFilters, played]);
  const b = useMemo(() => breakdown(store.rounds, store.customCourses, store.bag, filters), [store.rounds, store.customCourses, store.bag, filters]);
  const isDefault = filters.range === "all" && filters.course === "all" && filters.holes === "all";

  if (!finished.length) return <EarlyStats />;

  const goal = store.profile.goal ? goalTarget[store.profile.goal] : null;
  const goalLabel = store.profile.goal === "scratch" ? "Scratch" : goal ? `Break ${goal}` : "";
  const open = (pid: string) => router.push(`/clubhouse/rounds/${pid.split("~")[0]}`);

  // The trend, for the chosen metric.
  let points: TrendPoint[] = [];
  let trendNote = "";
  if (metric === "gross") {
    points = b.trend.filter((t) => t.holes === 18).map((t, i) => ({ id: `${t.id}~${i}`, date: t.date, value: t.gross, label: t.course }));
    const nines = b.trend.length - points.length;
    if (nines) trendNote = `${nines} nine-hole ${nines === 1 ? "card is" : "cards are"} left out of the score line. Switch to To par to see ${nines === 1 ? "it" : "them"}.`;
  } else if (metric === "toPar") {
    points = b.trend.map((t, i) => ({ id: `${t.id}~${i}`, date: t.date, value: Math.round(((t.toPar * 18) / t.holes) * 10) / 10, label: t.holes === 18 ? t.course : `${t.course}, 9 holes (doubled to 18)` }));
    if (b.trend.some((t) => t.holes !== 18)) trendNote = "Nine-hole cards are doubled so every point reads per 18.";
  } else {
    const from = b.trend[0]?.date ?? "";
    const done = [...finished].sort((x, y) => x.date.localeCompare(y.date) || (x.finishedAt ?? x.createdAt) - (y.finishedAt ?? y.createdAt));
    points = handicap.history
      .filter((h) => isDefault || h.date >= from)
      .map((h, i) => {
        const r = [...done].reverse().find((x) => x.date === h.date);
        return { id: `${r?.id ?? ""}~${i}`, date: h.date, value: h.index, label: r ? course(r.courseSlug)?.shortName ?? "Card" : "Card" };
      });
    trendNote = handicap.history.length
      ? "Your index is built from every card, so the course and holes filters don't change it; the range sets the dates shown."
      : `Your index line starts with your third differential. ${handicap.roundsToFirst} more ${handicap.roundsToFirst === 1 ? "card" : "cards"} to go.`;
  }
  const goalLine = goal && metric === "gross" ? { value: goal, label: goalLabel } : goal && metric === "toPar" ? { value: goal - 72, label: `${goalLabel} (about ${fmtToPar(goal - 72)} on a par 72)` } : undefined;

  const filteredCourse = filters.course !== "all" ? course(filters.course) : undefined;
  const best = b.best18;
  const eighteenCount = b.summaries.filter((s) => s.holes.length === 18).length;
  const scope = b.count === 1 ? "1 round" : `${b.count} rounds`;
  const pct = (v: number | null) => (v == null ? "—" : `${Math.round(v * 100)}%`);
  const holeByHole = b.summaries.some((s) => s.round.totalOnly == null);

  return (
    <Page className="grid gap-12 md:gap-16">
      <PageHeader
        eyebrow="Breakdowns"
        title="Stats"
        lede="Your playing over time. Narrow it to a stretch of rounds, one course, or nines, and every figure below follows."
      />

      {/* The filter bar */}
      <section aria-labelledby="filters-h" className="tex-linen -mt-4 border border-rule p-4 sm:p-5 md:-mt-8">
        <h2 id="filters-h" className="sr-only">Filters</h2>
        <div className="grid gap-5 lg:grid-cols-[auto_minmax(14rem,1fr)_auto] lg:items-start lg:gap-8">
          <ChoiceGroup legend="Range" size="sm" layout="wrap" value={filters.range} onChange={(range) => setFilters({ ...filters, range })} options={RANGE_OPTIONS} />
          <Field label="Course">
            {(a) => (
              <Select {...a} value={filters.course} onChange={(e) => setFilters({ ...filters, course: e.target.value })}>
                <option value="all">All courses</option>
                {played.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.course.shortName} ({p.count})</option>
                ))}
              </Select>
            )}
          </Field>
          <ChoiceGroup legend="Holes" size="sm" layout="wrap" value={filters.holes} onChange={(holes) => setFilters({ ...filters, holes })} options={HOLE_OPTIONS} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-3">
          <p role="status" className="font-numeral text-[1.05rem] font-medium tabular-nums text-ink">
            {isDefault ? (finished.length === 1 ? "Showing 1 round" : `Showing all ${finished.length} rounds`) : `Showing ${b.count} of ${finished.length} ${finished.length === 1 ? "round" : "rounds"}`}
          </p>
          {!isDefault && (
            <Button variant="quiet" size="sm" onClick={resetFilters}>Reset filters</Button>
          )}
        </div>
      </section>

      {b.count === 0 ? (
        <Callout title="No cards match these filters" action={<Button variant="secondary" size="sm" onClick={resetFilters}>Show every round</Button>}>
          {filters.holes === "9" ? "You haven't logged a nine-hole round in this range." : "Try a longer range, another course, or all holes."}
        </Callout>
      ) : (
        <>
          {/* The board: four figures on Locker Green, brass rules between them */}
          <section aria-labelledby="board-h" className="tex-locker on-green border border-green-3 px-5 py-7 sm:px-8">
            <h2 id="board-h" className="caps text-label text-gold">The board · {scope}{filteredCourse ? ` at ${filteredCourse.shortName}` : ""}</h2>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:divide-x lg:divide-gold/40 lg:gap-x-0 [&>*]:min-w-0 lg:[&>*]:px-7 lg:[&>*:first-child]:pl-0">
              <BigNumber
                tone="green"
                size="lg"
                face="numeral"
                label="Handicap Index"
                value={formatIndex(handicap.display)}
                spoken={`Handicap Index ${handicap.display == null ? "not set yet" : formatIndex(handicap.display)}`}
                className="col-span-2 lg:col-span-1"
                sub={
                  <span className="text-[1rem]">
                    {handicap.source === "computed"
                      ? `Calculated from ${handicap.differentials.length} ${handicap.differentials.length === 1 ? "differential" : "differentials"}`
                      : handicap.source === "entered"
                        ? `As entered · ${handicap.roundsToFirst} more ${handicap.roundsToFirst === 1 ? "card" : "cards"} to calculate`
                        : `${handicap.roundsToFirst} more ${handicap.roundsToFirst === 1 ? "card" : "cards"} to your first index`}
                    {!isDefault && <span className="block text-paper-3">Uses every card</span>}
                  </span>
                }
              />
              <BigNumber
                tone="green"
                size="md"
                face="numeral"
                label="Scoring avg · 18"
                value={b.scoring18 == null ? "—" : b.scoring18.toFixed(1)}
                spoken={b.scoring18 == null ? "Scoring average: no 18-hole rounds in this view" : `Scoring average over 18 holes: ${b.scoring18.toFixed(1)}`}
                sub={<span className="text-[1rem]">{eighteenCount ? `${eighteenCount} eighteen-hole ${eighteenCount === 1 ? "round" : "rounds"}` : "No 18-hole rounds here"}</span>}
              />
              <BigNumber
                tone="green"
                size="md"
                face="numeral"
                label="Average to par"
                value={b.toParPerRound == null ? "—" : fmtToPar(Math.round(b.toParPerRound * 10) / 10)}
                sub={<span className="text-[1rem]">Per 18 holes</span>}
              />
              <BigNumber
                tone="green"
                size="md"
                face="numeral"
                label="Best 18"
                value={best ? String(best.gross) : "—"}
                sub={
                  best ? (
                    <Link href={`/clubhouse/rounds/${best.round.id}`} className="link text-[1rem]">
                      {best.course.shortName}, {fmtDate(best.round.date)}<span className="sr-only">: open this card</span>
                    </Link>
                  ) : (
                    <span className="text-[1rem]">No 18-hole rounds here</span>
                  )
                }
              />
            </div>
          </section>

          {/* I · The trend */}
          <section aria-labelledby="trend-h" className="grid gap-6">
            <SectionHeading id="trend-h" numeral="I" eyebrow="Over time" title="The trend" lede="Lower is better, so the best rounds sit at the top. Select a point to open that card." />
            <ChoiceGroup<Metric>
              legend="Show"
              size="sm"
              layout="wrap"
              value={metric}
              onChange={setMetric}
              options={[{ value: "gross", label: "Score" }, { value: "toPar", label: "To par" }, { value: "index", label: "Index" }]}
            />
            <TrendChart
              title={metric === "gross" ? "Score, round by round" : metric === "toPar" ? "To par, round by round" : "Handicap Index after each card"}
              points={points}
              unit={metric}
              goal={goalLine}
              rolling={metric === "index" ? 0 : 5}
              onSelect={open}
            />
            {trendNote && <p className="-mt-2 text-[0.95rem] text-ink-2">{trendNote}</p>}
            {!store.profile.goal && metric !== "index" && (
              <p className="-mt-2 text-[0.95rem] text-ink-2">
                Set a goal in the <Link href="/clubhouse/locker" className="link">Locker</Link> to draw it on the chart.
              </p>
            )}
          </section>

          {/* II · How you score */}
          <section aria-labelledby="score-h" className="grid gap-8">
            <SectionHeading id="score-h" numeral="II" eyebrow="Hole by hole" title="How you score" />
            {holeByHole ? (
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                <DistributionBar types={b.types} holes={b.holesPlayed} />
                <ParTypeBars byPar={b.byPar} />
              </div>
            ) : (
              <NoHoleDetail />
            )}
          </section>

          {/* III · On and around the greens */}
          <section aria-labelledby="greens-h" className="grid gap-8">
            <SectionHeading id="greens-h" numeral="III" eyebrow="The short game" title="Putting and greens" />
            <dl className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-5">
              <Figure label="Putts per round" value={b.puttsPerRound == null ? null : b.puttsPerRound.toFixed(1)} explain="Every putt, scaled to 18 holes." missing="Track putts on the hole screen to see this." />
              <Figure label="Putts per hole" value={b.puttsPerHole == null ? null : b.puttsPerHole.toFixed(2)} explain="Under 2.00 means more one-putts than three-putts." missing="Track putts on the hole screen to see this." />
              <Figure label="Greens in regulation" value={b.girPct == null ? null : pct(b.girPct)} explain="On the green with two putts left for par." missing="Track putts on the hole screen to see this." />
              <Figure label="Fairways hit" value={b.fairwayPct == null ? null : pct(b.fairwayPct)} explain="Tee shots on par 4s and 5s that stay in the short grass." missing="Mark the fairway on the hole screen to see this." />
              <Figure label="Penalties per round" value={b.penaltiesPerRound == null ? null : b.penaltiesPerRound.toFixed(1)} explain="Penalty strokes, scaled to 18 holes." missing="Score hole by hole to see this." />
            </dl>
            <FrontBack front={b.frontBack.front} back={b.frontBack.back} />
          </section>

          {/* IV · The bag */}
          <section aria-labelledby="bag-h" className="grid gap-8">
            <SectionHeading id="bag-h" numeral="IV" eyebrow="The bag" title="Clubs you reach for" />
            <ClubUsage clubs={b.clubs} />
          </section>

          {/* V · One course, hole by hole */}
          <section aria-labelledby="heat-h" className="grid gap-8">
            <SectionHeading id="heat-h" numeral="V" eyebrow={filteredCourse ? filteredCourse.shortName : "One course"} title="Hole by hole" />
            {filteredCourse && b.holeAverages ? (
              holeByHole ? (
                <HoleHeat rows={b.holeAverages} courseName={filteredCourse.shortName} />
              ) : (
                <NoHoleDetail />
              )
            ) : (
              <Callout title="Pick a course to see each hole" action={
                <div className="flex flex-wrap gap-2">
                  {played.slice(0, 3).map((p) => (
                    <Button key={p.slug} variant="secondary" size="sm" onClick={() => {
                      setFilters({ ...filters, course: p.slug });
                      // This button goes away; land on the section's heading, just above that course's holes.
                      requestAnimationFrame(() => { const h = document.getElementById("heat-h"); if (h) { h.tabIndex = -1; h.style.outline = "none"; h.focus(); } });
                    }}>
                      {p.course.shortName}
                    </Button>
                  ))}
                </div>
              }>
                Choose a course in the filters above and every hole you&apos;ve played there gets its average to par, so the holes that cost you stand out.
              </Callout>
            )}
          </section>

          {/* VI · How your index is made */}
          <IndexLedger handicap={handicap} />
        </>
      )}
    </Page>
  );
}

function NoHoleDetail() {
  return (
    <p className={cx("max-w-measure text-ink-2")}>
      These cards were logged as totals. Score a round hole by hole (on the hole screen, or with Hole by hole in{" "}
      <Link href="/clubhouse/rounds/new" className="link">Log a round</Link>) to fill this in.
    </p>
  );
}
