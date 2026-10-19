"use client";
import { useMemo, useState } from "react";
import { CourseCard, PageHeader } from "@/components/golf";
import { ButtonLink, Button, ChoiceGroup, Field, TextInput } from "@/components/ui";
import type { Course } from "@/lib/course-types";
import { useClub } from "@/lib/hooks";
import { Page, Placeholder } from "../_components/Placeholder";
import { recordAt, recordLine } from "./_lib/record";

type Filter = "all" | "home" | "majors" | "usa" | "scotland" | "yours";

const matches: Record<Filter, (c: Course) => boolean> = {
  all: () => true,
  home: (c) => c.tags.includes("home"),
  majors: (c) => c.tags.includes("major-host"),
  usa: (c) => c.country === "USA" && !c.tags.includes("yours"),
  scotland: (c) => c.country === "Scotland" && !c.tags.includes("yours"),
  yours: (c) => c.tags.includes("yours"),
};

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Home courses first, then the golfer's own, then the library in name order. */
function rank(c: Course) {
  return c.tags.includes("home") ? 0 : c.tags.includes("yours") ? 1 : 2;
}

export function CourseList() {
  const { ready, store, courses } = useClub();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = useMemo(() => [...courses].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name)), [courses]);
  const hasYours = courses.some((c) => c.tags.includes("yours"));
  const active: Filter = filter === "yours" && !hasYours ? "all" : filter;

  const q = norm(query.trim());
  const shown = sorted.filter(
    (c) => matches[active](c) && (!q || norm([c.name, c.shortName, c.city, c.region, c.country].join(" ")).includes(q)),
  );

  if (!ready) return <Placeholder label="Opening the course book" />;

  const options: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "home", label: "Home" },
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
        actions={<ButtonLink href="/clubhouse/courses/new" variant="secondary">Add a course</ButtonLink>}
      />

      <search className="mt-8 grid max-w-3xl gap-5" aria-label="Find a course">
        <Field label="Search courses" hint="By name or place, like “Pinehurst” or “Fife”.">
          {(a) => (
            <TextInput
              {...a}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
          )}
        </Field>
        <ChoiceGroup legend="Show" layout="wrap" size="sm" value={active} onChange={setFilter} options={options} />
      </search>

      <p className="caps mt-8 text-label text-ink-2" role="status" aria-live="polite">
        {shown.length === 1 ? "1 course" : `${shown.length} courses`}
        {active !== "all" ? ` · ${filterName}` : ""}
        {q ? ` · matching “${query.trim()}”` : ""}
      </p>

      {shown.length > 0 ? (
        <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 min-[1800px]:grid-cols-4" role="list">
          {shown.map((c, i) => (
            <li key={c.slug} className="flex min-w-0">
              <CourseCard
                course={c}
                href={`/clubhouse/courses/${c.slug}`}
                eager={i < 3}
                headingLevel={2}
                className="w-full"
                meta={<span className="ml-auto font-numeral text-[1rem] font-medium text-ink-2 tabular-nums">{recordLine(recordAt(c.slug, store.rounds, store.customCourses))}</span>}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 max-w-measure border-t border-rule pt-6">
          <h2 className="font-display text-title text-ink">
            {q ? `No course called “${query.trim()}” yet` : `No ${filterName.toLowerCase()} courses yet`}
          </h2>
          <p className="mt-3 text-ink-2">
            {q
              ? "It isn't in the course book. Add it with its par, tees, rating, and slope, and it's ready to play in a minute."
              : "Add one from its scorecard, or look through every course."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href={addHref} variant="primary" className="whitespace-normal! py-3 text-center">
              {q ? `Add “${query.trim()}” as a course` : "Add a course"}
            </ButtonLink>
            <Button variant="quiet" onClick={() => { setQuery(""); setFilter("all"); }}>
              Show every course
            </Button>
          </div>
        </div>
      )}
    </Page>
  );
}
