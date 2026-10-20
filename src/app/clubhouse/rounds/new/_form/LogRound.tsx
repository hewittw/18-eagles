"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { PageHeader, toParText } from "@/components/golf";
import { Button, ChoiceGroup, DateInput, Field, NumberInput, Select, TextArea, useToast, cx } from "@/components/ui";
import type { Course } from "@/lib/course-types";
import { defaultHome, holesFor } from "@/lib/courses";
import { useClub, useDraft } from "@/lib/hooks";
import { logPastRound } from "@/lib/round-actions";
import { todayISO } from "@/lib/store";
import type { Nine } from "@/lib/types";
import { validateDate, validateStrokes, validateTotal } from "@/lib/validate";
import { Page, Placeholder } from "../../../_components/Placeholder";

type Mode = "total" | "holes";
// iOS inset grouping: a small caps caption above a rounded white card.
const caption = "caps mb-2 px-1 text-[0.74rem] text-ink-2";
const group = "rounded-xl border border-rule/70 bg-paper-2 p-4 shadow-card sm:p-6";
type Draft = { course: string; tee: string; date: string; nine: Nine; mode: Mode; total: string; strokes: Record<string, string>; note: string };

export function LogRound() {
  const { ready } = useClub();
  if (!ready) return <Placeholder label="Opening a blank card" />;
  return <LogRoundForm />;
}

/** Mounted only in the browser (after the store is read), so today's date is safe to compute here. */
function LogRoundForm() {
  const router = useRouter();
  const toast = useToast();
  const query = useSearchParams().get("course");
  const { store, courses, course: find } = useClub();
  const today = todayISO();
  const [d, set, clear] = useDraft<Draft>("log", { course: "", tee: "", date: today, nine: "18", mode: "total", total: "", strokes: {}, note: "" });
  // ?course=slug wins over a saved draft's course until the golfer picks another.
  const [override, setOverride] = useState<string | null>(query && find(query) ? query : null);
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);

  const course: Course = (override && find(override)) || (d.course && find(d.course)) || defaultHome(store.profile.homeCourse, store.customCourses);
  const remembered = store.profile.lastTee[course.slug];
  const teeName =
    (d.tee && course.tees.some((t) => t.name === d.tee) && d.tee) ||
    (remembered && course.tees.some((t) => t.name === remembered) && remembered) ||
    course.tees[Math.min(1, course.tees.length - 1)].name;
  const nineHoles = course.holes.length === 9;
  const nine: Nine = nineHoles ? "18" : d.nine;
  const holes = holesFor(course, nine);
  const par = holes.reduce((a, h) => a + h.par, 0);

  const groups = useMemo(() => {
    const custom = new Set(store.customCourses.map((c) => c.slug));
    const builtIn = courses.filter((c) => !custom.has(c.slug));
    const byName = (a: Course, b: Course) => a.name.localeCompare(b.name);
    return [
      { label: "Home", list: builtIn.filter((c) => c.tags.includes("home")).sort(byName) },
      { label: "USA", list: builtIn.filter((c) => c.country === "USA" && !c.tags.includes("home")).sort(byName) },
      { label: "Scotland", list: builtIn.filter((c) => c.country === "Scotland" && !c.tags.includes("home")).sort(byName) },
      { label: "Yours", list: store.customCourses.slice().sort(byName) },
    ].filter((g) => g.list.length);
  }, [courses, store.customCourses]);

  // Errors, in the order the fields appear (for focusing the first one).
  const errors = useMemo(() => {
    const e: [id: string, msg: string][] = [];
    const de = validateDate(d.date);
    if (de) e.push(["log-date", de]);
    if (d.mode === "total") {
      const te = validateTotal(d.total, holes.length);
      if (te) e.push(["log-total", te]);
    } else {
      for (const h of holes) {
        const se = validateStrokes(d.strokes[h.n] ?? "", h.par);
        if (se) e.push([`log-h${h.n}`, se]);
      }
    }
    return e;
  }, [d.date, d.mode, d.total, d.strokes, holes]);
  const err = (id: string) => (tried ? errors.find(([k]) => k === id)?.[1] : undefined);

  // The running total under the hole-by-hole list.
  const entered = holes.filter((h) => !validateStrokes(d.strokes[h.n] ?? "", h.par));
  const runGross = entered.reduce((a, h) => a + Number(d.strokes[h.n]), 0);
  const runPar = entered.reduce((a, h) => a + h.par, 0);

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    setTried(true);
    if (errors.length) {
      document.getElementById(errors[0][0])?.focus();
      return;
    }
    setSaving(true);
    const strokes = d.mode === "holes" ? Object.fromEntries(holes.map((h) => [h.n, Number(d.strokes[h.n])])) : null;
    const id = logPastRound({ course, teeName, date: d.date, nine, total: d.mode === "total" ? Number(d.total) : null, strokes, note: d.note.trim() });
    clear();
    toast({ message: "Card saved" });
    router.push(`/clubhouse/rounds/${id}`);
  };

  return (
    <Page>
      <PageHeader
        back={{ href: "/clubhouse/rounds", label: "Cards" }}
        eyebrow="A round you've played"
        title="Log a round"
        lede="Add a card from a round you didn't score here. A total is enough for your index; hole by hole fills in your stats too."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] lg:gap-12">
      <form onSubmit={submit} noValidate className="grid min-w-0 gap-7">
        <div>
        <p className={caption}>The round</p>
        <div className={cx(group, "grid gap-7")}>
        <Field label="Course" hint="Not listed? Add it from Courses first.">
          {(a) => (
            <Select {...a} value={course.slug} onChange={(e) => { setOverride(null); set((p) => ({ ...p, course: e.target.value, tee: "" })); }}>
              {groups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.list.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </optgroup>
              ))}
            </Select>
          )}
        </Field>

        <ChoiceGroup
          legend="Tees"
          hint={remembered ? "We kept the tees you played here last time." : "Your rating and slope come from the tees you played."}
          layout="grid"
          value={teeName}
          onChange={(tee) => set((p) => ({ ...p, tee }))}
          options={course.tees.map((t) => ({
            value: t.name,
            label: t.name,
            hint: `${t.yards.toLocaleString()} yds · ${t.rating.toFixed(1)} / ${t.slope}${t.source === "estimated" ? " (est.)" : ""}`,
          }))}
        />

        <Field id="log-date" label="Date played" error={err("log-date")}>
          {(a) => <DateInput {...a} value={d.date} max={today} onChange={(e) => set((p) => ({ ...p, date: e.target.value }))} className="max-w-[14rem]" />}
        </Field>

        {!nineHoles && (
          <ChoiceGroup<Nine>
            legend="Holes"
            layout="row"
            size="sm"
            value={nine}
            onChange={(v) => set((p) => ({ ...p, nine: v }))}
            options={[{ value: "18", label: "All 18" }, { value: "front", label: "Front 9" }, { value: "back", label: "Back 9" }]}
          />
        )}

        </div>
        </div>

        <div>
        <p className={caption}>The score</p>
        <div className={cx(group, "grid gap-7")}>
        <ChoiceGroup<Mode>
          legend="How do you want to enter it?"
          layout="row"
          size="sm"
          value={d.mode}
          onChange={(mode) => set((p) => ({ ...p, mode }))}
          options={[{ value: "total", label: "Total score" }, { value: "holes", label: "Hole by hole" }]}
        />

        {d.mode === "total" ? (
          <Field id="log-total" label={`Total score for ${holes.length} holes`} hint={`Par is ${par}. Enter your gross score, before any handicap strokes.`} error={err("log-total")}>
            {(a) => <NumberInput {...a} value={d.total} onChange={(e) => set((p) => ({ ...p, total: e.target.value }))} className="max-w-[9rem]" />}
          </Field>
        ) : (
          <fieldset className="grid">
            <legend className="mb-1 font-serif text-[1.25rem] font-semibold text-ink">Strokes on each hole</legend>
            {holes.map((h) => (
              <div key={h.n} className="border-b border-rule/80 py-3.5 last-of-type:border-b-0">
              <Field id={`log-h${h.n}`} label={`Hole ${h.n} · par ${h.par}`} hint={h.name} error={err(`log-h${h.n}`)}>
                {(a) => (
                  <NumberInput
                    {...a}
                    value={d.strokes[h.n] ?? ""}
                    onChange={(e) => set((p) => ({ ...p, strokes: { ...p.strokes, [h.n]: e.target.value } }))}
                    className="max-w-[7rem]"
                  />
                )}
              </Field>
              </div>
            ))}
            <p role="status" className="mt-2 rounded-lg bg-paper-3 px-4 py-3 font-numeral text-[1.2rem] font-medium tabular-nums text-ink">
              {entered.length ? (
                <>
                  Total {runGross} through {entered.length} of {holes.length}
                  <span className={cx("ml-3", runGross - runPar < 0 ? "text-under" : "text-ink-2")}>{toParText(runGross - runPar)}</span>
                </>
              ) : (
                <span className="text-ink-2">Your total adds up here as you go.</span>
              )}
            </p>
          </fieldset>
        )}

        </div>
        </div>

        <div className={group}>
        <Field label="Note" optional hint="What you'd tell yourself before the next round.">
          {(a) => <TextArea {...a} voice value={d.note} maxLength={500} onChange={(e) => set((p) => ({ ...p, note: e.target.value }))} placeholder="Lag putting was the difference." />}
        </Field>

        </div>

        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
          <Button type="submit" variant="primary" size="lg" loading={saving} loadingLabel="Saving the card" className="max-sm:w-full">Save the card</Button>
          {tried && errors.length > 0 && (
            <p className="text-[0.95rem] text-error">{errors.length === 1 ? "One field needs a fix" : `${errors.length} fields need a fix`}. Each one says what to change.</p>
          )}
        </div>
      </form>

      <aside aria-label="The card so far" className="hidden min-w-0 lg:sticky lg:top-24 lg:block lg:self-start">
        <div className="tex-locker on-green rounded-2xl p-5 shadow-card sm:p-6">
          <p className="caps text-label text-gold">The card</p>
          <p className="mt-1 font-display text-title text-on-green">{course.name}</p>
          <dl className="mt-5 grid grid-cols-2 gap-2">
            {[
              ["Tees", teeName],
              ["Holes", nine === "18" ? `${holes.length}` : nine === "front" ? "Front 9" : "Back 9"],
              ["Par", String(par)],
              ["Score", d.mode === "total" ? (validateTotal(d.total, holes.length) ? "—" : d.total) : entered.length ? `${runGross}` : "—"],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0 rounded-lg bg-white/10 px-3.5 py-3">
                <dt className="caps text-[0.68rem] text-gold">{k}</dt>
                <dd className="mt-1 truncate font-numeral text-[1.5rem] font-semibold leading-none tabular-nums text-on-green">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
      </div>
    </Page>
  );
}
