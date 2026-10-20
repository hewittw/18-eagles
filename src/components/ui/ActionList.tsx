import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";

/** Drawn line icons for rows and tiles. No icon font, no emoji. */
export type IconName = "flag" | "pencil" | "chart" | "cards" | "plus" | "trophy" | "bag" | "map" | "play" | "settings";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={cx("size-6", className)} aria-hidden="true">
      {name === "flag" && (<><path {...p} d="M7 21 V3" /><path d="M7 3.3 L17 6.5 L7 9.7 Z" fill="currentColor" /><ellipse {...p} cx="10" cy="20.5" rx="6.5" ry="1.5" /></>)}
      {name === "pencil" && (<><path {...p} d="M4 20 L5 15.5 L15.5 5 a2.1 2.1 0 0 1 3 3 L8 18.5 Z" /><path {...p} d="M13.5 7 L16.5 10" /></>)}
      {name === "chart" && (<><path {...p} d="M3.5 20.5 H20.5" /><path {...p} d="M6 20.5 V13 M11 20.5 V8 M16 20.5 V11" /><path {...p} d="M5 9 L10 5 L15 7.5 L20 3.5" /></>)}
      {name === "cards" && (<><rect {...p} x="3" y="5" width="18" height="14" rx="2" /><path {...p} d="M3 10 H21 M9 5 V19 M15 5 V19" /></>)}
      {name === "plus" && (<><circle {...p} cx="12" cy="12" r="8.5" /><path {...p} d="M12 8 V16 M8 12 H16" /></>)}
      {name === "trophy" && (<><path {...p} d="M7.5 4 H16.5 V9 a4.5 4.5 0 0 1 -9 0 Z" /><path {...p} d="M7.5 6 H4.5 a3 3 0 0 0 3 4 M16.5 6 H19.5 a3 3 0 0 1 -3 4 M12 13.5 V17 M8.5 20 H15.5 L14.5 17 H9.5 Z" /></>)}
      {name === "bag" && (<><rect {...p} x="7" y="8" width="10" height="13" rx="2.5" /><path {...p} d="M9 8 L8 3 M12 8 V2.5 M15 8 L16.5 3.5 M10 13 H14" /></>)}
      {name === "map" && (<><path {...p} d="M3.5 6 L9 3.5 L15 6 L20.5 3.5 V18 L15 20.5 L9 18 L3.5 20.5 Z" /><path {...p} d="M9 3.5 V18 M15 6 V20.5" /></>)}
      {name === "play" && (<><circle {...p} cx="12" cy="12" r="8.5" /><path d="M10 8.3 L16 12 L10 15.7 Z" fill="currentColor" /></>)}
      {name === "settings" && (<><circle {...p} cx="12" cy="12" r="3" /><path {...p} d="M12 2.8 V5.3 M12 18.7 V21.2 M2.8 12 H5.3 M18.7 12 H21.2 M5.5 5.5 L7.3 7.3 M16.7 16.7 L18.5 18.5 M5.5 18.5 L7.3 16.7 M16.7 7.3 L18.5 5.5" /></>)}
    </svg>
  );
}

export function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 16" className={cx("h-4 w-2.5 shrink-0", className)} aria-hidden="true">
      <path d="M2 2 L8 8 L2 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** An inset grouped list, iOS style: one rounded card, rows split by hairlines. Pass ActionRow children. */
export function ActionList({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <ul aria-label={label} className={cx("divide-y divide-rule/80 overflow-hidden rounded-xl border border-rule/70 bg-paper-2 shadow-card", className)}>
      {children}
    </ul>
  );
}

export type ActionRowProps = {
  href: string;
  title: ReactNode;
  /** One line under the title. */
  detail?: ReactNode;
  icon?: IconName;
  /** Something on the right before the chevron: a score, a count. */
  trailing?: ReactNode;
  /** Leading content instead of an icon (a date, a score mark). */
  leading?: ReactNode;
  "aria-label"?: string;
};

/** One tappable row: icon well, title and detail, trailing value, chevron. The whole row is the link. */
export function ActionRow({ href, title, detail, icon, trailing, leading, "aria-label": ariaLabel }: ActionRowProps) {
  return (
    <li>
      <Link
        href={href}
        aria-label={ariaLabel}
        className="group/row flex min-h-16 items-center gap-4 px-4 py-3 transition-colors duration-150 -outline-offset-2 is-hover:bg-paper-3 is-pressed:bg-tint sm:px-5"
      >
        {icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-tint text-green">
            <Icon name={icon} className="size-[1.35rem]" />
          </span>
        )}
        {leading}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[1.02rem] font-semibold text-ink">{title}</span>
          {detail && <span className="mt-0.5 block truncate text-sm text-ink-2">{detail}</span>}
        </span>
        {trailing}
        <Chevron className="text-rule-strong transition-transform group-hover/row:translate-x-0.5" />
      </Link>
    </li>
  );
}

/** A square-ish quick action for a grid of two or three (the app's home screen shortcuts). */
export function ActionTile({ href, title, detail, icon }: { href: string; title: string; detail?: string; icon: IconName }) {
  return (
    <Link
      href={href}
      className="group/tile flex min-h-28 flex-col justify-between gap-4 rounded-xl border border-rule/70 bg-paper-2 p-4 shadow-card transition-[background-color,transform] duration-150 is-hover:bg-paper-3 is-pressed:scale-[0.98] sm:p-5"
    >
      <span className="flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-sm bg-green text-on-green">
          <Icon name={icon} className="size-6" />
        </span>
        <Chevron className="mt-1 text-rule-strong" />
      </span>
      <span>
        <span className="block text-[1.02rem] font-semibold leading-snug text-ink">{title}</span>
        {detail && <span className="mt-0.5 block text-sm text-ink-2">{detail}</span>}
      </span>
    </Link>
  );
}
