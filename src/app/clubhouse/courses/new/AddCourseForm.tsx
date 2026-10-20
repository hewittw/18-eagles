"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/golf";
import { Button, ButtonLink, Callout, ChoiceGroup, ErrorIcon, Field, NumberInput, TextInput, useToast } from "@/components/ui";
import { useClub, useDraft } from "@/lib/hooks";
import { update } from "@/lib/store";
import { validateCourse, type CourseDraft, type CourseField, type Errors } from "@/lib/validate";
import { Page, Placeholder } from "../../_components/Placeholder";
import { buildCourse, FRONT_NINE, PAR_72 } from "./build-course";

const EMPTY: CourseDraft = { name: "", city: "", holes: "18", pars: PAR_72, teeName: "", rating: "", slope: "", yards: "" };

// The order fields appear on screen, so focus goes to the first one that needs fixing.
const ORDER: CourseField[] = ["name", "city", "pars", "teeName", "rating", "slope", "yards"];
const ID: Record<CourseField, string> = { name: "c-name", city: "c-city", pars: "c-pars", teeName: "c-tee", rating: "c-rating", slope: "c-slope", yards: "c-yards" };

export function AddCourseForm() {
  const { ready, courses } = useClub();
  const router = useRouter();
  const toast = useToast();
  const params = useSearchParams();
  const prefill = params.get("name")?.trim() ?? "";
  const [d, setD, clearDraft, restored] = useDraft<CourseDraft>("course", EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // "Add “Balboa Park” as a course" from the search: the name they searched for wins over an old draft.
  // Then drop it from the address, so a reload keeps what they typed over it (the draft) instead of re-filling it.
  useEffect(() => {
    if (!prefill) return;
    setD((p) => ({ ...p, name: prefill }));
    const u = new URL(window.location.href);
    u.searchParams.delete("name");
    window.history.replaceState(window.history.state, "", u.pathname + u.search + u.hash);
  }, [prefill, setD]);
  // Back from the new course's page shows this form again (the router keeps it mounted): ready to use, not stuck saving.
  // After a save, keep the form as typed until the page is hidden (no flash of a blank form or errors), then clear it.
  const saved = useRef(false);
  useEffect(() => () => {
    setSaving(false);
    if (!saved.current) return;
    saved.current = false;
    clearDraft();
    setSubmitted(false);
  }, [clearDraft]);

  const taken = useMemo(() => courses.map((c) => c.name), [courses]);
  const errors: Errors<CourseField> = submitted ? validateCourse(d, taken) : {};
  const par = d.pars.reduce((a, b) => a + b, 0);
  const set = <K extends keyof CourseDraft>(k: K, v: CourseDraft[K]) => setD((p) => ({ ...p, [k]: v }));

  if (!ready) return <Placeholder label="Opening the form" />;

  const setHoles = (h: "18" | "9") =>
    setD((p) => ({
      ...p,
      holes: h,
      pars: h === "9" ? p.pars.slice(0, 9) : [...p.pars.slice(0, 9), ...(p.pars.length >= 18 ? p.pars.slice(9, 18) : FRONT_NINE)],
    }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateCourse(d, taken);
    const first = ORDER.find((k) => errs[k]);
    if (first) {
      // Wait a frame so the error text is rendered (and announced via aria-describedby) before focus lands.
      requestAnimationFrame(() => {
        const el = (first === "pars" ? document.querySelector('input[name="c-par-1"]:checked') : document.getElementById(ID[first])) as HTMLElement | null;
        el?.focus();
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }
    setSaving(true);
    const course = buildCourse(d, courses.map((c) => c.slug));
    // From the first-visit "My course isn't here": the new course becomes home and setup carries on at the Clubhouse.
    const asHome = params.get("then") === "home";
    update((s) => ({ ...s, customCourses: [...s.customCourses, course], profile: asHome ? { ...s.profile, homeCourse: course.slug } : s.profile }));
    saved.current = true;
    clearDraft({ keepShown: true });
    toast({ message: asHome ? `Added ${course.name} as your home course` : `Added ${course.name}` });
    router.push(asHome ? "/clubhouse" : `/clubhouse/courses/${course.slug}`);
  }

  const errorCount = ORDER.filter((k) => errors[k]).length;

  return (
    <Page>
      <PageHeader
        back={{ href: "/clubhouse/courses", label: "Courses" }}
        eyebrow="Not in the course book?"
        title="Add a course"
        lede="Copy it from the scorecard. It takes about a minute, and then it's ready to play and counts toward your index."
      />

      <form ref={formRef} noValidate onSubmit={onSubmit} className="mt-8 grid max-w-xl gap-7" aria-describedby={errorCount ? "c-summary" : undefined}>
        {restored && !prefill && (
          <Callout
            title="We kept what you typed"
            action={
              <Button variant="secondary" size="sm" onClick={() => { clearDraft(); setSubmitted(false); }}>
                Start over with a blank form
              </Button>
            }
          >
            Your unsaved course is just as you left it.
          </Callout>
        )}

        <Field id={ID.name} label="Course name" hint="As it appears on the card, like “Balboa Park Golf Course”." error={errors.name}>
          {(a) => <TextInput {...a} value={d.name} onChange={(e) => set("name", e.target.value)} autoComplete="off" autoCapitalize="words" />}
        </Field>

        <Field id={ID.city} label="City" hint="Town and state or country, like “San Diego, CA”." error={errors.city}>
          {(a) => <TextInput {...a} value={d.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" autoCapitalize="words" />}
        </Field>

        <ChoiceGroup
          legend="Holes"
          layout="row"
          value={d.holes}
          onChange={setHoles}
          options={[{ value: "18", label: "18 holes" }, { value: "9", label: "9 holes" }]}
        />

        <fieldset className="min-w-0" aria-describedby={["c-pars-hint", errors.pars ? "c-pars-err" : ""].filter(Boolean).join(" ")}>
          <legend className="text-[1rem] font-medium text-ink">Par for each hole</legend>
          <p id="c-pars-hint" className="mt-1 text-[0.92rem] leading-snug text-ink-2">
            Filled in with a typical par-{d.holes === "9" ? 36 : 72} layout. Change any hole that differs from your card; arrow keys move between 3, 4, and 5.
          </p>
          {errors.pars && (
            <p id="c-pars-err" className="mt-2 flex items-start gap-2 text-[0.95rem] font-medium text-error"><ErrorIcon /><span>{errors.pars}</span></p>
          )}
          <ol className="mt-3 divide-y divide-rule/80 overflow-hidden rounded-xl border border-rule/70 bg-paper-2 shadow-card" role="list">
            {d.pars.map((p, i) => (
              <li key={i} className={`grid grid-cols-[3.25rem_1fr] items-center gap-3 px-4 py-2 ${i === 9 ? "border-t-4! border-t-paper-3!" : ""}`}>
                <span aria-hidden="true" className="font-numeral text-[1.15rem] font-semibold tabular-nums text-ink">
                  <span className="caps mr-1 text-[0.72rem] text-ink-2">No.</span>{i + 1}
                </span>
                <ParChoice hole={i + 1} value={p} onChange={(v) => setD((prev) => ({ ...prev, pars: prev.pars.map((x, j) => (j === i ? v : x)) }))} />
              </li>
            ))}
          </ol>
          <p className="caps mt-3 px-1 text-label text-ink" aria-live="polite">Par {par} for {d.pars.length} holes</p>
        </fieldset>

        <Field id={ID.teeName} label="Tees" hint="The tees you play, as the card names them, like “White” or “Blue”." error={errors.teeName}>
          {(a) => <TextInput {...a} value={d.teeName} onChange={(e) => set("teeName", e.target.value)} autoComplete="off" autoCapitalize="words" />}
        </Field>

        <Field id={ID.rating} label="Course rating" hint={`For those tees, from the scorecard. Usually near par, like ${par === 36 ? "35.4" : "71.3"}.`} error={errors.rating}>
          {(a) => <NumberInput {...a} decimal value={d.rating} onChange={(e) => set("rating", e.target.value.replace(",", "."))} className="max-w-[10rem]" />}
        </Field>

        <Field id={ID.slope} label="Slope" hint="A whole number from 55 to 155, like 128. 113 is average." error={errors.slope}>
          {(a) => <NumberInput {...a} value={d.slope} onChange={(e) => set("slope", e.target.value)} className="max-w-[10rem]" />}
        </Field>

        <Field id={ID.yards} label="Total yards" optional hint="From the same tees. Leave it blank and we'll use typical lengths for each hole." error={errors.yards}>
          {(a) => <NumberInput {...a} value={d.yards} onChange={(e) => set("yards", e.target.value)} className="max-w-[10rem]" />}
        </Field>

        <div className="grid gap-3 border-t border-rule pt-6">
          {errorCount > 0 && (
            <p id="c-summary" className="flex items-start gap-2 text-[0.95rem] font-medium text-error" role="status">
              <ErrorIcon />
              <span>{errorCount === 1 ? "One thing to fix above" : `${errorCount} things to fix above`}. What you typed is kept.</span>
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" variant="primary" size="lg" loading={saving} loadingLabel="Saving the course">Add the course</Button>
            <ButtonLink href="/clubhouse/courses" variant="quiet" size="lg">Cancel</ButtonLink>
          </div>
          <p className="text-[0.92rem] text-ink-2">Saved on this device. Your typing is kept as you go, so you can leave and come back.</p>
        </div>
      </form>
    </Page>
  );
}

/** One hole's par: 3 / 4 / 5 as native radios (Tab enters once, arrows change it). */
function ParChoice({ hole, value, onChange }: { hole: number; value: number; onChange: (v: number) => void }) {
  const opts = ["3", "4", "5"] as const;
  // A par 6 (rare) would come from an old draft; show it as an extra choice rather than lose it.
  const all = value === 6 ? [...opts, "6" as const] : opts;
  return (
    <div className="min-w-0 max-w-xs" data-hole={hole}>
      <ChoiceGroup
        legend={`Hole ${hole} par`}
        hideLegend
        layout="row"
        size="sm"
        name={`c-par-${hole}`}
        value={String(value) as (typeof all)[number]}
        onChange={(v) => onChange(Number(v))}
        options={all.map((v) => ({ value: v, label: v }))}
      />
    </div>
  );
}
