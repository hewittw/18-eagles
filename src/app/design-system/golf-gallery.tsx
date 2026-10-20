"use client";
import { useState } from "react";
import {
  AppNav, AppShell, BigNumber, ClubPicker, ClubUsage, CourseCard, DistributionBar, FairwayPicker, HoleHeat, HoleIllustration, PageHeader,
  ParTypeBars, ScoreMark, ScoreMarkKey, ScoreTiles, ScorecardTable, TeeSwatch, TrendChart, Wordmark, placeOf,
} from "@/components/golf";
import { Button, ButtonLink, ChoiceGroup, Field, Select, Stepper, Tag, ToggleChip } from "@/components/ui";
import type { Fairway } from "@/lib/types";
import { Demo, Spec, State, States } from "./ds";
import { AUGUSTA, BAG, BY_PAR, CARRIES, CLUBS, COURSES, FAIRBANKS, HOLE_HEAT, OLD, OLD_ENTRIES, OLD_PARTIAL, PINEHURST, RSF, SAWGRASS, TREND, TYPES, TYPES_HOLES } from "./sample-data";

const noop = () => {};

/* ─────────────── Scoring ─────────────── */
export function ScoreMarkSpec() {
  return (
    <Spec
      id="scoremark"
      name="ScoreMark"
      from="golf"
      summary="The traditional card marks, drawn in SVG around a pencilled Caslon numeral: circle for birdie, double circle for eagle or better, square for bogey, double square for double bogey or worse. Screen readers hear “Birdie, 3”."
      use={["Everywhere a hole score appears: the card, history rows, round summaries.", "Under par is red as well, but the shape alone carries it.", <><code>strokes=&#123;null&#125;</code> draws a dash and reads &ldquo;Not played&rdquo;.</>]}
    >
      <States label="Every mark on a par 4" cols="auto">
        {[2, 3, 4, 5, 6, 8].map((s) => (
          <State key={s} label={["Eagle", "Birdie", "Par", "Bogey", "Double", "Triple +"][[2, 3, 4, 5, 6, 8].indexOf(s)]}>
            <ScoreMark strokes={s} par={4} size="lg" /><ScoreMark strokes={s} par={4} /><ScoreMark strokes={s} par={4} size="sm" />
          </State>
        ))}
        <State label="Empty"><ScoreMark strokes={null} par={4} size="lg" /><ScoreMark strokes={null} par={4} /></State>
        <State label="Ace on a par 3"><ScoreMark strokes={1} par={3} size="lg" /></State>
      </States>
      <ScoreMarkKey />
    </Spec>
  );
}

export function ScoreTilesSpec() {
  const [par, setPar] = useState<"3" | "4" | "5">("4");
  const [v, setV] = useState<number | null>(null);
  const p = Number(par);
  return (
    <Spec
      id="scoretiles" wide
      name="ScoreTiles"
      from="golf"
      summary="The hole screen's main control: hand-hung tiles from par − 2 to par + 3, each with its number and name, and More for higher. One radiogroup: Tab lands on the chosen tile, arrows and Home/End move and choose, and the change is announced (“Hole 7: 5 strokes, bogey.”)."
      use={["Big enough for a thumb in a glove: 72px tall, 56px minimum.", <>Pass <code>holeLabel</code> so the announcement names the hole.</>, "Under-par numbers are red on the tile; the chosen tile turns Locker Green with a brass bar (never red on green)."]}
    >
      <States label="States" cols="2">
        <State label="Empty (nothing chosen)"><div className="w-full"><ScoreTiles par={4} value={null} onChange={noop} /></div></State>
        <State label="Par chosen"><div className="w-full"><ScoreTiles par={4} value={4} onChange={noop} /></div></State>
        <State label="Birdie chosen, focus-visible" force="focus"><div className="w-full"><ScoreTiles par={5} value={4} onChange={noop} /></div></State>
        <State label="Hover" force="hover"><div className="w-full"><ScoreTiles par={3} value={null} onChange={noop} /></div></State>
        <State label="More opened (a 9)"><div className="w-full"><ScoreTiles par={4} value={9} onChange={noop} /></div></State>
        <State label="Disabled (round finished)"><div className="w-full"><ScoreTiles par={4} value={5} onChange={noop} disabled /></div></State>
      </States>
      <Demo title={`Try it: hole 7, par ${p}`}>
        <div className="grid gap-5">
          <ChoiceGroup legend="Par of the hole" value={par} onChange={(x) => { setPar(x); setV(null); }} layout="row" size="sm" options={[{ value: "3", label: "Par 3" }, { value: "4", label: "Par 4" }, { value: "5", label: "Par 5" }]} />
          <ScoreTiles key={par} par={p} value={v} onChange={setV} holeLabel="Hole 7" label="Score for hole 7" />
        </div>
      </Demo>
    </Spec>
  );
}

export function ClubPickerSpec() {
  const [shots, setShots] = useState<string[]>(["dr", "7i"]);
  return (
    <Spec
      id="clubpicker" wide
      name="ClubPicker"
      from="golf"
      summary="The bag as a button board, grouped Woods / Hybrids / Irons / Wedges / Putter. Tap the club you hit and it becomes the next shot; the sequence reads Dr → 7i → Pt. The last club used is set on Locker Green. Every change is announced: “Shot 3: 9-iron. 3 strokes on hole 5.”"
      use={["Feed it the golfer's bag (only clubs marked inBag show).", "Remove last for a mis-tap; Clear empties the hole and offers Undo clear right there.", <>Optional <code>carries</code> prints each club&apos;s yardage on its tile.</>]}
    >
      <States label="States" cols="2">
        <State label="Empty"><div className="w-full"><ClubPicker bag={BAG.slice(0, 6)} shots={[]} onChange={noop} /></div></State>
        <State label="Shots logged · last used"><div className="w-full"><ClubPicker bag={BAG.slice(0, 6)} shots={["dr", "5i"]} onChange={noop} /></div></State>
        <State label="Hover and pressed" force="hover"><div className="w-full"><ClubPicker bag={BAG.filter((c) => c.kind === "wedge")} shots={["pw"]} onChange={noop} /></div></State>
        <State label="Full (most shots reached)"><div className="w-full"><ClubPicker bag={BAG.filter((c) => c.kind === "putter")} shots={["pt", "pt", "pt"]} max={3} onChange={noop} /></div></State>
      </States>
      <Demo title="Try it: hole 5 at Rancho Santa Fe">
        <ClubPicker bag={BAG} shots={shots} onChange={setShots} holeLabel="Hole 5" carries={CARRIES} />
      </Demo>
    </Spec>
  );
}

export function FairwaySpec() {
  const [f, setF] = useState<Fairway | null>(null);
  return (
    <Spec
      id="fairwaypicker"
      name="FairwayPicker"
      from="golf"
      summary="Missed left, Hit, Missed right, each with the ball's flight drawn on a strip of fairway. ChoiceGroup underneath: native radios, arrow keys."
      use={["Par 4s and 5s only; hide it on par 3s.", "It can stay empty: not every golfer tracks fairways."]}
    >
      <States label="States" cols="2">
        <State label="Empty"><div className="w-full"><FairwayPicker hideLegend value={null} onChange={noop} /></div></State>
        <State label="Hit"><div className="w-full"><FairwayPicker hideLegend value="hit" onChange={noop} /></div></State>
        <State label="Missed left, focus" force="focus"><div className="w-full"><FairwayPicker hideLegend value="left" onChange={noop} /></div></State>
        <State label="Disabled"><div className="w-full"><FairwayPicker hideLegend value="right" disabled onChange={noop} /></div></State>
      </States>
      <Demo><FairwayPicker value={f} onChange={setF} /></Demo>
    </Spec>
  );
}

export function ScorecardSpec() {
  const [cur, setCur] = useState(13);
  return (
    <Spec
      id="scorecardtable" wide
      name="ScorecardTable"
      from="golf"
      summary="The classic card as a real table: Hole, Name, Yards, Par (on linen), Score with marks, Putts; Out, In, and Total on Locker Green with the total to par in brass. On phones it scrolls sideways with the row headers pinned."
      use={[<><code>onSelectHole</code> turns each hole number into a button (the round screen&apos;s jump-to-hole).</>, <><code>compact</code> drops yards, names, and putts for history rows.</>, "Unplayed holes show a dash; totals count what's been played."]}
    >
      <ScorecardTable holes={OLD.holes} entries={OLD_ENTRIES} teeName={OLD.tees[0].name} caption={`Scorecard: ${OLD.name}, ${OLD.tees[0].name} tees`} />
      <States label="Compact, front nine · empty" cols="2">
        <State label="Compact"><div className="w-full min-w-0"><ScorecardTable compact holes={RSF.holes.slice(0, 9)} entries={{ 1: OLD_ENTRIES[1], 2: OLD_ENTRIES[2], 3: OLD_ENTRIES[3], 4: OLD_ENTRIES[4], 5: OLD_ENTRIES[5], 6: OLD_ENTRIES[6], 7: OLD_ENTRIES[7], 8: OLD_ENTRIES[8], 9: OLD_ENTRIES[9] }} /></div></State>
        <State label="Empty (no holes played)"><div className="w-full min-w-0"><ScorecardTable compact holes={RSF.holes.slice(9)} entries={{}} /></div></State>
      </States>
      <Demo title="Try it: a round in progress, jump to a hole">
        <ScorecardTable holes={OLD.holes} entries={OLD_PARTIAL} currentHole={cur} onSelectHole={setCur} teeName={OLD.tees[0].name} caption="Round in progress at the Old Course" />
        <p className="mt-3 text-[0.95rem] text-ink-2" aria-live="polite">Current hole: {cur}{OLD.holes[cur - 1]?.name ? `, ${OLD.holes[cur - 1].name}` : ""}.</p>
      </Demo>
    </Spec>
  );
}

/* ─────────────── The clubhouse ─────────────── */
export function ShellSpec() {
  return (
    <>
      <Spec
        id="appshell" wide
        name="AppShell"
        from="golf"
        summary="The tool's frame: SkipLink, the Locker Green bar with the wordmark, <main id=“main”>, and a footer. On phones the five places sit in a bottom tab bar in thumb reach; from 768px they move into the top bar."
        use={[<>Wrap every tool page: <code>{"<AppShell>{children}</AppShell>"}</code> in the tool&apos;s layout.</>, <>The current tab comes from the URL; pass <code>current</code> to set it yourself.</>, "Pages leave 4.5rem at the bottom on phones; the shell pads main for you."]}
      >
        <div className="grid gap-8">
          <figure className="min-w-0">
            <figcaption className="caps mb-2 text-[0.72rem] text-ink-2">Phone, 375 wide</figcaption>
            <div inert className="mx-auto h-[34rem] w-full max-w-[22rem] overflow-hidden border-[6px] border-ink bg-paper shadow-lift">
              <AppShell preview current="clubhouse">
                <div className="p-4">
                  <BigNumber value="13.6" label="Handicap index" size="lg" sub="Down 0.6 since 1 September" />
                  <div className="rule-double mt-5 text-ink" />
                  <p className="mt-4 font-serif italic text-link">Welcome back. Seven days since Rancho Santa Fe.</p>
                  <Button variant="primary" block className="mt-5">Play Rancho again</Button>
                </div>
              </AppShell>
            </div>
          </figure>
          <figure className="min-w-0">
            <figcaption className="caps mb-2 text-[0.72rem] text-ink-2">Desktop, top bar (drawn at 2/3 scale)</figcaption>
            <div role="region" aria-label="Desktop shell preview, scrolls sideways on small screens" tabIndex={0} className="scroll-x w-fit max-w-full border-[6px] border-ink shadow-lift">
              <div inert className="h-[26rem] w-[60rem]" style={{ zoom: 0.62 }}>
                <AppShell preview previewLayout="desktop" current="courses">
                  <div className="grid grid-cols-3 gap-4 p-8">
                    <div className="col-span-3"><PageHeader eyebrow="Pick a course" title="Courses" /></div>
                    {[OLD, RSF, PINEHURST].map((c) => <CourseCard key={c.slug} course={c} href="/clubhouse/courses" headingLevel={3} />)}
                  </div>
                </AppShell>
              </div>
            </div>
          </figure>
        </div>
      </Spec>
      <Spec
        id="appnav"
        name="AppNav"
        from="golf"
        summary="The five places in a fixed order: Clubhouse, Courses, Cards, Stats, Locker. Drawn icons over condensed caps. The current one gets aria-current=“page” and a brass rule; on green, focus rings are brass."
        use={[<><code>variant=&quot;bar&quot;</code> for the top bar, <code>&quot;tabs&quot;</code> for the phone tab bar. AppShell picks for you.</>, "Never reorder or hide a tab on one screen."]}
      >
        <States label="Bar" tone="green" cols="2">
          <State tone="green" label="Current: Stats"><div className="scroll-x w-full"><AppNav current="stats" label="Specimen" className="w-max" /></div></State>
          <State tone="green" label="Hover and focus" force="focus"><div className="scroll-x w-full p-1"><AppNav label="Specimen" className="w-max" /></div></State>
        </States>
        <States label="Tabs" cols="2">
          <State label="Current: Cards"><div className="w-full"><AppNav variant="tabs" current="cards" label="Specimen" /></div></State>
          <State label="Hover" force="hover"><div className="w-full"><AppNav variant="tabs" label="Specimen" /></div></State>
        </States>
      </Spec>
      <Spec
        id="pageheader"
        name="PageHeader"
        from="golf"
        summary="The page's one h1: an optional back link (← Courses), a brass eyebrow, the Caslon title at Display 1, a lede, actions at the right, and the double rule."
        use={["Every tool page starts with it. Exactly one per page.", "Back links name the place they go back to."]}
      >
        <div inert className="border border-rule bg-paper p-5 sm:p-8">
          <PageHeader
            back={{ href: "/clubhouse/courses", label: "Courses" }}
            eyebrow={`${placeOf(PINEHURST)} · ${PINEHURST.architect ?? ""}`}
            title={PINEHURST.name}
            lede={PINEHURST.blurb}
            actions={<><ButtonLink href="/clubhouse/courses" variant="primary">Play here</ButtonLink></>}
          />
        </div>
      </Spec>
      <Spec
        id="wordmark"
        name="Wordmark"
        from="golf"
        summary="An original mark: a Caslon E under a small 18, in a brass rope ring with one red pennant on the E's spine, beside “18 Eagles” in Caslon Display. Nothing borrowed from a club."
        use={["Small in the bar, large on the welcome and the round certificate.", "The roundel is decorative; the name is always there as text."]}
      >
        <States label="Sizes and surfaces" cols="2">
          <State label="sm on paper"><Wordmark /></State>
          <State label="sm on green" tone="green"><Wordmark tone="green" /></State>
          <State label="lg on paper" className="sm:col-span-2"><Wordmark size="lg" /></State>
          <State label="lg on green" tone="green" className="sm:col-span-2"><Wordmark size="lg" tone="green" /></State>
        </States>
      </Spec>
      <Spec
        id="bignumber"
        name="BigNumber"
        from="golf"
        summary="The one big, exact number a screen leads with. Engraved Caslon for the handicap; the board's condensed figures for scores. It cross-fades when it changes, never counts up."
        use={[<><code>spoken</code> gives screen readers a sentence (&ldquo;Handicap index 13.6&rdquo;).</>, "Put the trend in words in sub: \"Down 0.6 since 1 September\"."]}
      >
        <div className="tex-locker on-green p-6 sm:p-10">
          <BigNumber tone="green" value="13.6" label="Handicap index" spoken="Handicap index 13.6" sub={<span className="flex items-center gap-2"><svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true"><path d="M0 0 H14 L7 12 Z" fill="var(--color-gold)" /></svg>Down 0.6 since 1 September · low 12.9</span>} />
        </div>
        <States label="Sizes, faces, empty" cols="wide">
          <State label="lg · numeral"><BigNumber value="80" label="Gross · Old Course" size="lg" face="numeral" sub="Out 38 · In 42" /></State>
          <State label="md · display"><BigNumber value="+8" label="To par" size="md" sub="Black tees" /></State>
          <State label="Empty"><BigNumber value="—" label="Handicap index" size="lg" spoken="No handicap index yet" sub="Post 3 cards to get one" /></State>
        </States>
      </Spec>
    </>
  );
}

export function CourseSpecs() {
  const [slug, setSlug] = useState(SAWGRASS.slug);
  const course = COURSES.find((c) => c.slug === slug) ?? SAWGRASS;
  const [n, setN] = useState<number | null>(course.signatureHole ?? 1);
  const hole = course.holes.find((h) => h.n === n) ?? course.holes[0];
  const par3 = PINEHURST.holes.find((h) => h.par === 3)!;
  const par4 = OLD.holes.find((h) => h.n === 17)!;
  const par5 = AUGUSTA.holes.find((h) => h.par === 5)!;
  return (
    <>
      <Spec
        id="coursecard" wide
        name="CourseCard"
        from="golf"
        summary="A course in the picker: the photograph, or with no free photo, a drawing of its signature hole; the name in Caslon; the place; par · yards from the back tee; tags. The whole card is one link."
        use={["Grid them 1 / 2 / 3 across. The first row can load eagerly.", <><code>meta</code> adds a line of your own (&ldquo;Played 4 times · best 81&rdquo;).</>]}
      >
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          <CourseCard course={OLD} href="/clubhouse/courses" eager meta={<Tag tone="green">Played 2 times</Tag>} />
          <CourseCard course={RSF} href="/clubhouse/courses" />
          <CourseCard course={FAIRBANKS} href="/clubhouse/courses" className="hidden 2xl:flex" />
        </div>
        <States label="States" cols="wide">
          <State label="Hover" force="hover"><CourseCard course={PINEHURST} href="/clubhouse/courses" /></State>
          <State label="Focus-visible" force="focus"><CourseCard course={AUGUSTA} href="/clubhouse/courses" /></State>
          <State label="No photo: the drawing"><CourseCard course={FAIRBANKS} href="/clubhouse/courses" /></State>
        </States>
      </Spec>
      <Spec
        id="holeillustration" wide
        name="HoleIllustration"
        from="golf"
        summary="A yardage-book plan of a hole, generated from its par, yards, and number: tee boxes, a fairway that doglegs or splits, bunkers, water, trees, dotted 100/150/200 arcs to the green, carries, and a pencilled note. The same seed always draws the same hole."
        use={[<>Portrait on the hole screen; <code>orientation=&quot;landscape&quot; detail=&quot;plain&quot;</code> for cards and banners (no text at small sizes).</>, "It's labelled for screen readers as an illustration, with a description of what it shows.", <>Seed it with the course slug.</>]}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[{ c: PINEHURST, h: par3, note: "Long is dead." }, { c: OLD, h: par4, note: "Club up into the wind." }, { c: AUGUSTA, h: par5, note: "" }].map(({ c, h, note }) => (
            <figure key={c.slug} className="min-w-0 border border-ink bg-paper-2 p-1.5">
              <HoleIllustration hole={h} seed={c.slug} note={note || undefined} />
              <figcaption className="caps flex justify-between gap-2 px-1.5 pt-2 text-[0.7rem] text-ink-2"><span className="truncate">{c.shortName}</span><span className="shrink-0">Par {h.par}</span></figcaption>
            </figure>
          ))}
        </div>
        <Demo title="Try it: draw any hole in the library">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <div className="grid content-start gap-5">
              <Field label="Course">
                {(a) => (
                  <Select {...a} value={slug} onChange={(e) => { const c = COURSES.find((x) => x.slug === e.target.value)!; setSlug(c.slug); setN(c.signatureHole ?? 1); }}>
                    {COURSES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </Select>
                )}
              </Field>
              <Stepper label="Hole" value={n} onChange={(x) => setN(x)} min={1} max={course.holes.length} start={1} />
              <p className="font-serif text-ink-2">
                No. {hole.n}{hole.name ? `, ${hole.name}` : ""}: par {hole.par}, {hole.yards} yards.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {course.tees.map((t) => <TeeSwatch key={t.name} color={t.color} name={t.name} meta={`${t.yards.toLocaleString("en-US")}`} />)}
              </div>
            </div>
            <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-start">
              <div className="mx-auto w-full max-w-[22rem] border border-ink"><HoleIllustration hole={hole} seed={course.slug} /></div>
              <div className="border border-ink"><HoleIllustration hole={hole} seed={course.slug} orientation="landscape" detail="plain" /></div>
            </div>
          </div>
        </Demo>
      </Spec>
      <Spec
        id="teeswatch"
        name="TeeSwatch"
        from="golf"
        summary="A tee marker: a small ball in the tee's color with an ink rim (so white tees show on paper), and the name in words beside it. Color is never the only label."
        use={["In tee choices, scorecard headers, and round rows."]}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[SAWGRASS, OLD].map((c) => (
            <div key={c.slug} className="border border-rule bg-paper-2 p-4">
              <p className="caps text-[0.72rem] text-gold-ink">{c.shortName}</p>
              <ul className="mt-2 grid gap-1.5">
                {c.tees.map((t) => <li key={t.name}><TeeSwatch size="md" color={t.color} name={t.name} meta={`${t.yards.toLocaleString("en-US")} yds · ${t.rating}/${t.slope}`} /></li>)}
              </ul>
            </div>
          ))}
        </div>
      </Spec>
    </>
  );
}

/* ─────────────── Charts ─────────────── */
export function ChartSpecs() {
  const [goal, setGoal] = useState(true);
  return (
    <Spec
      id="charts" wide
      name="Charts"
      from="charts"
      summary="Hand-built SVG, no chart library: TrendChart, DistributionBar, ParTypeBars, ClubUsage, HoleHeat. Each has a heading, a one-line summary in words, and a Show as table toggle with the same data. Trend points are focusable."
      use={["Lower is better, so the trend runs best-at-top, like a leaderboard.", "The goal line is Old Brass on paper (brass fails there); marks hold ≥ 3:1.", "Empty data gets a sentence, not a blank frame."]}
    >
      <Demo title="Sample season · 13 rounds">
        <div className="mb-4"><ToggleChip pressed={goal} onPressedChange={setGoal}>Goal line: break 80</ToggleChip></div>
        <TrendChart title="Scores this season" points={TREND} unit="gross" goal={goal ? { value: 80, label: "Break 80" } : undefined} />
      </Demo>
      <div className="grid gap-10 border border-rule bg-paper-2 p-4 sm:p-6 lg:grid-cols-2">
        <DistributionBar types={TYPES} holes={TYPES_HOLES} />
        <ParTypeBars byPar={BY_PAR} />
        <ClubUsage clubs={CLUBS} />
        <div className="lg:col-span-2"><HoleHeat rows={HOLE_HEAT} courseName={OLD.shortName} /></div>
      </div>
      <States label="Empty" cols="2">
        <State label="No rounds yet"><div className="w-full"><TrendChart title="Scores this season" points={[]} unit="gross" /></div></State>
        <State label="No club data"><div className="w-full"><ClubUsage clubs={[]} /></div></State>
      </States>
    </Spec>
  );
}
