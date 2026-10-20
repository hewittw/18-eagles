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
  /** The golfer's own home course (profile.homeCourse): the only card that wears the "Home" badge. */
  home?: boolean;
  /** Load the photo eagerly (the first row of a list). */
  eager?: boolean;
  className?: string;
};

export const TAG_LABEL: Record<string, string> = {
  "major-host": "Major host", links: "Links", parkland: "Parkland", coastal: "Coastal", desert: "Desert", home: "Local", "bucket-list": "Bucket list",
};

const ORD = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth"];

/** Where it is, the way a card would say it: "Pinehurst, North Carolina" or "St Andrews, Fife, Scotland". */
export const placeOf = (c: Course) => [c.city, c.region, c.country === "Scotland" ? "Scotland" : null].filter(Boolean).join(", ");

/**
 * A course in the picker, app style: a rounded tile with the photograph (or, without one, a drawing of its
 * signature hole), the name in the serif, the place, and par · yards from the back tee. Compact enough for two
 * across on a phone. The whole tile is one link.
 */
export function CourseCard({ course, href, meta, headingLevel = 3, home, eager, className }: CourseCardProps) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const back = course.tees[0];
  const sig = course.holes.find((h) => h.n === course.signatureHole) ?? course.holes[0];
  // The data's "home" tag means a local course (San Diego, Chicago), so it is not the golfer's Home: only their pick is.
  const badge = home ? "home" : course.tags.includes("yours") ? "yours" : null;
  // The short name fits the tile; the full name is kept for screen readers (and on the course page). When the
  // short name isn't inside the full one ("Bethpage Black"), both are read so the visible words stay in the name.
  const short = course.shortName || course.name;
  const contained = short !== course.name && course.name.includes(short);
  return (
    <Link
      href={href}
      className={cx(
        "group/card relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-rule/70 bg-paper-2 text-ink shadow-card",
        "transition-[background-color,transform] duration-150 ease-press is-hover:bg-paper-3 is-pressed:scale-[0.98]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-3">
        {course.hero ? (
          <Image
            src={course.hero.src}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1600px) 25vw, 360px"
            loading={eager ? "eager" : "lazy"}
            className="object-cover transition-transform duration-500 ease-hang group-hover/card:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
          />
        ) : (
          <HoleIllustration hole={sig} seed={course.slug} orientation="landscape" detail="plain" decorative className="h-full w-full" />
        )}
        {badge && (
          <Tag tone="green" className="absolute left-2 top-2 rounded-full! px-2.5! shadow-sm">{badge === "home" ? "Home" : "Yours"}</Tag>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
        <H className="line-clamp-2 font-display text-[1.08rem] leading-[1.18] font-normal text-balance text-ink sm:text-[1.3rem]">
          {contained ? (
            <><span aria-hidden="true">{short}</span><span className="sr-only">{course.name}</span></>
          ) : (
            <>{short}{short !== course.name && <span className="sr-only">, {course.name}</span>}</>
          )}
        </H>
        <p className="mt-0.5 line-clamp-2 text-pretty text-[0.85rem] leading-snug text-ink-2 sm:text-[0.92rem]">{placeOf(course)}</p>
        <p className="mt-2 font-numeral text-[0.95rem] font-medium tabular-nums text-ink sm:text-[1.02rem]">
          Par {back.par} <span aria-hidden="true" className="text-ink-2">·</span> {back.yards.toLocaleString("en-US")}
          <span className="text-ink-2"> yds</span>
        </p>
        {meta && <div className="mt-auto flex min-w-0 items-center pt-2">{meta}</div>}
      </div>
      {!course.hero && <span className="sr-only">Illustrated: the {ORD[sig.n] ?? sig.n} hole, par {sig.par}.</span>}
    </Link>
  );
}
