import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Course } from "@/lib/course-types";
import { Tag } from "../ui/Tag";
import { cx } from "../ui/cx";
import { HoleIllustration } from "./HoleIllustration";

export type CourseCardProps = {
  course: Course;
  href: string;
  meta?: ReactNode;
  /** The card's heading level; h3 under a page's h2 sections by default. */
  headingLevel?: 2 | 3;
  /** Load the photo eagerly (the first row of a list). */
  eager?: boolean;
  className?: string;
};

export const TAG_LABEL: Record<string, string> = {
  "major-host": "Major host", links: "Links", parkland: "Parkland", coastal: "Coastal", desert: "Desert", home: "Home course", "bucket-list": "Bucket list",
};

const ORD = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth"];

/** Where it is, the way a card would say it: "Pinehurst, North Carolina" or "St Andrews, Fife, Scotland". */
export const placeOf = (c: Course) => [c.city, c.region, c.country === "Scotland" ? "Scotland" : null].filter(Boolean).join(", ");

/**
 * A course in the picker: the photograph (or, without one, a drawing of its signature hole), the name in
 * Caslon, the place, par · yards from the back tee, and tags. The whole card is one link.
 */
export function CourseCard({ course, href, meta, headingLevel = 3, eager, className }: CourseCardProps) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const back = course.tees[0];
  const sig = course.holes.find((h) => h.n === course.signatureHole) ?? course.holes[0];
  return (
    <Link
      href={href}
      className={cx(
        "group/card relative flex min-w-0 flex-col rounded-xs border border-rule bg-paper-2 text-ink transition-[border-color,transform] duration-150",
        "is-hover:border-ink is-pressed:translate-y-px",
        className,
      )}
    >
      <div className="relative aspect-[3/2] overflow-hidden border-b border-rule bg-paper-3">
        {course.hero ? (
          <Image
            src={course.hero.src}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1600px) 33vw, 520px"
            loading={eager ? "eager" : "lazy"}
            className="object-cover transition-transform duration-500 ease-hang group-hover/card:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
          />
        ) : (
          <HoleIllustration hole={sig} seed={course.slug} orientation="landscape" detail="plain" decorative className="h-full" />
        )}
        <p className="caps absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-paper/92 px-3 py-1.5 text-[0.7rem] text-ink-2">
          <span className="truncate">{course.hero ? `${course.shortName} · photograph` : `Hole ${sig.n}${sig.name ? ` · ${sig.name}` : ""} · drawn`}</span>
          <span className="shrink-0 text-ink">Par {sig.par} · {sig.yards}</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <H className="font-display text-[1.75rem] leading-[1.08] font-normal text-balance">
          <span className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors group-hover/card:decoration-ink">{course.name}</span>
        </H>
        <p className="text-[0.98rem] text-ink-2">{placeOf(course)}</p>
        <p className="font-numeral text-[1.1rem] font-medium tabular-nums text-ink">
          Par {back.par} <span aria-hidden="true" className="text-ink-2">·</span> {back.yards.toLocaleString("en-US")} yds
          <span className="text-ink-2"> from the {back.name}</span>
        </p>
        {(course.tags.length > 0 || meta) && (
          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
            {course.tags.slice(0, 3).map((t) => <Tag key={t} tone={t === "home" ? "green" : t === "bucket-list" ? "gold" : "neutral"}>{TAG_LABEL[t] ?? t}</Tag>)}
            {meta}
          </div>
        )}
      </div>
      {!course.hero && <span className="sr-only">Illustrated: the {ORD[sig.n] ?? sig.n} hole, par {sig.par}.</span>}
    </Link>
  );
}
