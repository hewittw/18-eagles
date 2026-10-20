"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button, ButtonLink, Icon, TextInput, ToggleChip } from "@/components/ui";
import type { Course } from "@/lib/course-types";
import { useClub } from "@/lib/hooks";
import { patchProfile, update } from "@/lib/store";
import type { Club } from "@/lib/types";

// The first visit's setup: three short questions answered on the Clubhouse itself (no wizard, no tour).
// Each answer is saved the moment it's given, and the next question takes its place. Then the golfer plays.

export const SETUP = ["Your index", "Home course", "Your bag"] as const;

/** Where the golfer is in setup: 0 = index, 1 = home course, 2 = bag, 3 = done. */
export function setupStep(store: ReturnType<typeof useClub>["store"]) {
  if (store.rounds.length > 0) return 3;
  if (store.profile.welcomedAt == null) return 0;
  if (!store.profile.homeCourse) return 1;
  if (store.profile.bagSetAt == null) return 2;
  return 3;
}

/** Move focus to the next question's heading once it replaces the one just answered. */
export function focusHeading(id: string) {
  requestAnimationFrame(() => {
    const h = document.getElementById(id);
    if (!h) return;
    h.tabIndex = -1;
    h.style.outline = "none";
    h.focus();
  });
}

/** Three steps as a row of numbered pills: done ones ticked, the current one filled. For the green hero. */
export function SetupSteps({ step }: { step: number }) {
  return (
    <div className="min-w-0 justify-self-start md:justify-self-end">
      <p className="caps text-label text-gold">Set up your locker</p>
      <ol className="mt-3 grid gap-2">
        {SETUP.map((label, i) => {
          const done = i < step;
          const now = i === step;
          return (
            <li key={label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${now ? "bg-white/12 ring-1 ring-gold/70" : ""}`} aria-current={now ? "step" : undefined}>
              <span className={`grid size-8 shrink-0 place-items-center rounded-full font-numeral text-base font-semibold ${done ? "bg-gold text-green-3" : now ? "bg-on-green text-green-3" : "border border-white/50 text-on-green"}`} aria-hidden="true">
                {done ? "✓" : i + 1}
              </span>
              <span className="text-[1rem] font-semibold text-on-green">{label}</span>
              <span className="sr-only">{done ? ", done" : now ? ", current step" : ", to do"}</span>
            </li>
          );
        })}
        <li className="flex items-center gap-3 px-3 py-2.5 text-on-green">
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-white/50" aria-hidden="true">
            <Icon name="flag" className="size-4" />
          </span>
          <span className="text-[1rem]">Then play your first hole</span>
        </li>
      </ol>
    </div>
  );
}

// ───────────────────────── step 2: the home course ─────────────────────────
export function HomeCourseStep() {
  const { courses } = useClub();
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [all, setAll] = useState(false);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const ordered = [...courses].sort((a, b) => Number(b.tags.includes("home")) - Number(a.tags.includes("home")) || a.name.localeCompare(b.name));
    return s ? ordered.filter((c) => `${c.name} ${c.shortName} ${c.city} ${c.region} ${c.country}`.toLowerCase().includes(s)) : ordered;
  }, [courses, q]);

  const save = () => {
    if (!pick) {
      setError("Choose the course you play most, or add yours.");
      document.querySelector<HTMLInputElement>("input[name=home-course]")?.focus();
      return;
    }
    patchProfile({ homeCourse: pick });
    focusHeading("setup-bag");
  };

  return (
    <section aria-labelledby="setup-home" className="grid gap-6">
      <div>
        <p className="caps text-label text-gold-ink">Step 2 of 3</p>
        <h2 id="setup-home" className="mt-1 font-display text-display-2 text-ink">Where do you usually play?</h2>
        <p className="mt-3 max-w-measure font-serif text-lede text-ink-2">Your home course opens ready to play each time, with its tees, pars and yardages. You can play any course whenever you like.</p>
      </div>

      <div className="max-w-md">
        <label htmlFor="home-q" className="sr-only">Search courses</label>
        <div className="relative">
          <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-2" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M13 13 L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <TextInput id="home-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or place" className="rounded-full! bg-paper-3! pl-11!" autoComplete="off" />
        </div>
      </div>

      <fieldset aria-describedby={error ? "home-err" : undefined}>
        <legend className="sr-only">Your home course</legend>
        <p className="caps mb-3 text-label text-ink-2" role="status" aria-live="polite">{q.trim() ? `${list.length} ${list.length === 1 ? "course matches" : "courses match"}` : all ? `All ${list.length} courses` : "Suggested courses"}</p>
        {error && (
          <p id="home-err" className="mb-3 flex items-center gap-2 font-medium text-error" role="alert">
            <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M10 5.5 V11 M10 13.5 V14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            {error}
          </p>
        )}
        {list.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(all || q.trim() ? list : list.slice(0, 8)).map((c) => (
              <li key={c.slug} className="min-w-0">
                <CourseRadio course={c} checked={pick === c.slug} onPick={() => { setPick(c.slug); setError(undefined); }} />
              </li>
            ))}
          </ul>
        ) : null}
        {!all && !q.trim() && list.length > 8 && (
          <Button className="mt-4" onClick={() => setAll(true)}>Show all {list.length} courses</Button>
        )}
        {!list.length && (
          <p className="rounded-xl bg-paper-3 p-5 text-ink-2">No course matches “{q}”. Add it below and it becomes your home course.</p>
        )}
      </fieldset>


      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-rule bg-paper/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <Button variant="primary" size="lg" onClick={save} className="max-sm:flex-1">
          {pick ? `Make ${courses.find((c) => c.slug === pick)?.shortName} my home course` : "Make it my home course"}
        </Button>
        <ButtonLink href="/clubhouse/courses/new" icon={<Icon name="plus" className="size-5" />}>My course isn&apos;t here</ButtonLink>
      </div>
    </section>
  );
}

function CourseRadio({ course, checked, onPick }: { course: Course; checked: boolean; onPick: () => void }) {
  return (
    <label className="group/cr relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-rule/70 bg-paper-2 shadow-card transition-[transform,box-shadow] duration-150 is-pressed:scale-[0.98] has-checked:border-green has-checked:ring-2 has-checked:ring-green has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus">
      <input type="radio" name="home-course" value={course.slug} checked={checked} onChange={onPick} className="sr-only" />
      <span className="relative block aspect-[16/10] bg-tint">
        {course.hero ? (
          <Image src={course.hero.src} alt="" fill sizes="(max-width: 640px) 50vw, 260px" className="object-cover" />
        ) : (
          <span className="grid h-full place-items-center text-green"><Icon name="flag" className="size-8" /></span>
        )}
        <span className={`absolute right-2 top-2 grid size-7 place-items-center rounded-full border-2 ${checked ? "border-on-green bg-green text-on-green" : "border-white bg-black/25"}`} aria-hidden="true">
          {checked && <svg viewBox="0 0 16 16" className="size-4"><path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </span>
      </span>
      <span className="flex flex-1 flex-col p-3">
        <span className="line-clamp-2 font-serif text-[1.05rem] leading-snug text-ink">{course.name}</span>
        <span className="mt-0.5 truncate text-sm text-ink-2">{course.city}, {course.region}</span>
      </span>
    </label>
  );
}

// ───────────────────────── step 3: the bag ─────────────────────────
const KINDS: { kind: Club["kind"]; label: string }[] = [
  { kind: "wood", label: "Woods" },
  { kind: "hybrid", label: "Hybrids" },
  { kind: "iron", label: "Irons" },
  { kind: "wedge", label: "Wedges" },
  { kind: "putter", label: "Putter" },
];

export function BagStep() {
  const { store } = useClub();
  const bag = store.bag;
  const inBag = bag.filter((c) => c.inBag).length;
  const [error, setError] = useState<string | undefined>();
  const save = () => {
    if (!inBag) {
      setError("Put at least a putter in the bag.");
      return;
    }
    patchProfile({ bagSetAt: Date.now() });
    focusHeading("tee-off");
  };
  return (
    <section aria-labelledby="setup-bag" className="grid gap-6">
      <div>
        <p className="caps text-label text-gold-ink">Step 3 of 3</p>
        <h2 id="setup-bag" className="mt-1 font-display text-display-2 text-ink">What&apos;s in your bag?</h2>
        <p className="mt-3 max-w-measure font-serif text-lede text-ink-2">These become the club buttons on every hole: tap the club you hit, and the shots count your score. A standard set is filled in; tap a club to take it out or put it in.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-rule/70 bg-paper-2 shadow-card">
        <p className="flex items-center justify-between gap-3 border-b border-rule/80 bg-paper-3 px-4 py-2.5 sm:px-5" role="status" aria-live="polite">
          <span className="caps text-label text-ink-2">In the bag</span>
          <span className={`font-numeral text-lg font-semibold tabular-nums ${inBag > 14 ? "text-error" : "text-ink"}`}>{inBag} of 14 allowed</span>
        </p>
        <div className="divide-y divide-rule/80">
          {KINDS.map(({ kind, label }) => {
            const clubs = bag.filter((c) => c.kind === kind);
            if (!clubs.length) return null;
            return (
              <div key={kind} className="px-4 py-3.5 sm:px-5" role="group" aria-labelledby={`sb-${kind}`}>
                <h3 id={`sb-${kind}`} className="font-semibold text-ink">{label}</h3>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {clubs.map((c) => (
                    <li key={c.id}>
                      <ToggleChip pressed={c.inBag} onPressedChange={(p) => { setError(undefined); update((s) => ({ ...s, bag: s.bag.map((x) => (x.id === c.id ? { ...x, inBag: p } : x)) })); }}>
                        {c.name}
                      </ToggleChip>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      {inBag > 14 && <p className="text-ink-2">The Rules allow 14 clubs. That&apos;s fine for practice; take some out before a competition.</p>}
      {error && <p className="font-medium text-error" role="alert">{error}</p>}
      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-rule bg-paper/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <Button variant="primary" size="lg" onClick={save} className="max-sm:flex-1">That&apos;s my bag</Button>
        <Button variant="quiet" onClick={() => { patchProfile({ homeCourse: null }); focusHeading("setup-home"); }}>Change home course</Button>
      </div>
    </section>
  );
}
