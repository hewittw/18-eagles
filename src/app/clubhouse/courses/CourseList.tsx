"use client";
import { useMemo, useState } from "react";
import { CourseCard, PageHeader } from "@/components/golf";
import { ButtonLink, Button, Card, Field, Icon, TextInput } from "@/components/ui";
import type { Course } from "@/lib/course-types";
import { useClub } from "@/lib/hooks";
import { Page, Placeholder } from "../_components/Placeholder";
import { recordAt, recordLine } from "./_lib/record";

type Filter = "all" | "local" | "majors" | "usa" | "scotland" | "yours";

const matches: Record<Filter, (c: Course) => boolean> = {
  all: () => true,
  local: (c) => c.tags.includes("home"), // the data's "home" tag: courses local to San Diego and Chicago
  majors: (c) => c.tags.includes("major-host"),
  usa: (c) => c.country === "USA" && !c.tags.includes("yours"),
  scotland: (c) => c.country === "Scotland" && !c.tags.includes("yours"),
  yours: (c) => c.tags.includes("yours"),
};

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** The golfer's home course first, then local courses, then the ones they added, then the library in name order. */
function rank(c: Course, homeSlug: string | null) {
  return c.slug === homeSlug ? 0 : c.tags.includes("home") ? 1 : c.tags.includes("yours") ? 2 : 3;
}

export function CourseList() {
  const { ready, store, courses } = useClub();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const homeSlug = store.profile.homeCourse;
  const sorted = useMemo(() => [...courses].sort((a, b) => rank(a, homeSlug) - rank(b, homeSlug) || a.name.localeCompare(b.name)), [courses, homeSlug]);
  const hasYours = courses.some((c) => c.tags.includes("yours"));
  const active: Filter = filter === "yours" && !hasYours ? "all" : filter;

  const q = norm(query.trim());
  const shown = sorted.filter(
    (c) => matches[active](c) && (!q || norm([c.name, c.shortName, c.city, c.region, c.country].join(" ")).includes(q)),
  );

  if (!ready) return <Placeholder label="Opening the course book" />;

  const options: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "local", label: "Local" },
    { value: "majors", label: "Majors" },
    { value: "usa", label: "USA" },
    { value: "scotland", label: "Scotland" },
    ...(hasYours ? [{ value: "yours" as const, label: "Yours" }] : []),
  ];
  const filterName = options.find((o) => o.value === active)?.label ?? "All";
  const addHref = q ? `/clubhouse/courses/new?name=${encodeURIComponent(query.trim())}` : "/clubhouse/courses/new";

  return (
    <Page>
      <PageHeader
        eyebrow="Choose a course"
        title="Courses"
        lede="Pick where you're playing today. Each course has its card, its tees, and your record there."
        actions={<ButtonLink href="/clubhouse/courses/new" variant="secondary" size="sm" icon={<Icon name="plus" className="size-5" />}>Add a course</ButtonLink>}
      />

      <search className="mt-6 grid gap-3 md:mt-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-center md:gap-5" aria-label="Find a course">
        <Field label="Search courses" hideLabel>
          {(a) => (
            <div className="relative">
              <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 size-[1.1rem] -translate-y-1/2 text-ink-2" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M13 13 L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <TextInput
                {...a}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                // Esc clears the search, as Chrome does natively (Safari doesn't).
                onKeyDown={(e) => { if (e.key === "Escape" && query) { e.preventDefault(); setQuery(""); } }}
                placeholder="Search by name or place"
                autoComplete="off"
                enterKeyHint="search"
                className="rounded-full! border-transparent! bg-paper-3! pl-11! shadow-none! is-hover:border-rule-strong!"
              />
            </div>
          )}
        </Field>
        <FilterChips value={active} onChange={setFilter} options={options} />
      </search>

      <p className="caps mt-6 text-label text-ink-2" role="status" aria-live="polite">
        {shown.length === 1 ? "1 course" : `${shown.length} courses`}
        {active !== "all" ? ` · ${filterName}` : ""}
        {q ? ` · matching “${query.trim()}”` : ""}
      </p>

      {shown.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 min-[1800px]:grid-cols-5" role="list">
          {shown.map((c, i) => {
            const rec = recordAt(c.slug, store.rounds, store.customCourses);
            return (
              <li key={c.slug} className="flex min-w-0">
                <CourseCard
                  course={c}
                  href={`/clubhouse/courses/${c.slug}`}
                  eager={i < 8}
                  headingLevel={2}
                  home={c.slug === homeSlug}
                  className="w-full"
                  meta={
                    <span className={`flex min-w-0 items-start gap-1.5 text-[0.8rem] leading-snug font-medium sm:text-[0.85rem] ${rec.rounds ? "text-green" : "text-ink-2"}`}>
                      {rec.rounds > 0 && <span aria-hidden="true" className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-green" />}
                      <span className="min-w-0 text-pretty">{recordLine(rec)}</span>
                    </span>
                  }
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <Card className="mt-3 max-w-2xl" padding="lg">
          <span className="grid size-12 place-items-center rounded-sm bg-tint text-green" aria-hidden="true">
            <Icon name="map" />
          </span>
          <h2 className="mt-4 font-display text-title text-ink">
            {q ? `No course called “${query.trim()}” yet` : `No ${filterName.toLowerCase()} courses yet`}
          </h2>
          <p className="mt-2 text-ink-2">
            {q
              ? "It isn't in the course book. Add it with its par, tees, rating, and slope, and it's ready to play in a minute."
              : "Add one from its scorecard, or look through every course."}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ButtonLink href={addHref} variant="primary" className="whitespace-normal! py-3 text-center">
              {q ? `Add “${query.trim()}” as a course` : "Add a course"}
            </ButtonLink>
            <Button variant="secondary" onClick={() => { setQuery(""); setFilter("all"); }}>
              Show every course
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
}

/**
 * The filter, as a row of pill chips: native radios in a fieldset (Tab enters once, arrows move), so it reads
 * as one choice. On a phone the row scrolls sideways instead of wrapping onto a second line.
 */
function FilterChips({ value, onChange, options }: { value: Filter; onChange: (f: Filter) => void; options: { value: Filter; label: string }[] }) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Show</legend>
      <div className="scroll-x -mx-4 px-4 py-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 pr-1 sm:w-auto sm:flex-wrap">
          {options.map((o) => (
            <label
              key={o.value}
              className={
                "choice relative inline-flex min-h-tap cursor-pointer select-none items-center rounded-full border px-4 text-[0.95rem] font-medium whitespace-nowrap " +
                "transition-[background-color,border-color,color,transform] duration-150 ease-press is-pressed:scale-[0.97] " +
                "border-rule-strong/50 bg-paper-2 text-ink is-hover:border-green/45 is-hover:bg-tint " +
                "has-checked:border-green has-checked:bg-green has-checked:text-on-green"
              }
            >
              <input type="radio" name="course-filter" value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
