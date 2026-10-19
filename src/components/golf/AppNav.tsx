import Link from "next/link";
import { cx } from "../ui/cx";

export type NavKey = "clubhouse" | "courses" | "cards" | "stats" | "locker";

export const NAV: { key: NavKey; label: string; href: string; hint: string }[] = [
  { key: "clubhouse", label: "Clubhouse", href: "/clubhouse", hint: "Home: your index and the next round" },
  { key: "courses", label: "Courses", href: "/clubhouse/courses", hint: "Pick a course and play" },
  { key: "cards", label: "Cards", href: "/clubhouse/rounds", hint: "Every round, kept" },
  { key: "stats", label: "Stats", href: "/clubhouse/stats", hint: "How you play" },
  { key: "locker", label: "Locker", href: "/clubhouse/locker", hint: "Your bag and settings" },
];

/** Drawn line icons, one per tab. No icon font, no emoji. */
export function NavIcon({ k, className }: { k: NavKey; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={cx("size-6", className)} aria-hidden="true">
      {k === "clubhouse" && (<><path {...p} d="M3 11 L12 4 L21 11" /><path {...p} d="M5.5 9.5 V20 H18.5 V9.5" /><path {...p} d="M10 20 V14.5 H14 V20" /><path {...p} d="M12 4 V1.8" /></>)}
      {k === "courses" && (<><path {...p} d="M8 21 V3" /><path d="M8 3.2 L17 6 L8 8.8 Z" fill="currentColor" /><ellipse {...p} cx="10.5" cy="20.6" rx="7.5" ry="1.6" /></>)}
      {k === "cards" && (<><rect {...p} x="3" y="5" width="18" height="14" rx="0.5" /><path {...p} d="M3 9.5 H21 M3 14 H21 M9 5 V19 M15 5 V19" /><circle {...p} cx="12" cy="16.5" r="1.4" /></>)}
      {k === "stats" && (<><path {...p} d="M3 20.5 H21" /><path {...p} d="M5.5 20.5 V12 H9 V20.5 M10.5 20.5 V7 H14 V20.5 M15.5 20.5 V14.5 H19 V20.5" /></>)}
      {k === "locker" && (<><rect {...p} x="5" y="2.5" width="14" height="19" rx="0.5" /><path {...p} d="M8 5.5 H16 M8 7.5 H16 M8 9.5 H16" /><path {...p} d="M15.5 13.5 V16" /></>)}
    </svg>
  );
}

export type AppNavProps = {
  current?: NavKey;
  /** bar: the desktop top bar (inline links). tabs: the phone tab bar (icons over labels). */
  variant?: "bar" | "tabs";
  /** The nav landmark's name. */
  label?: string;
  className?: string;
};

/** The tool's five places, in the same order everywhere. The current one gets aria-current="page" and a brass mark. */
export function AppNav({ current, variant = "bar", label = "18 Eagles", className }: AppNavProps) {
  if (variant === "tabs") {
    return (
      <nav aria-label={label} className={cx("on-green", className)}>
        <ul className="grid grid-cols-5">
          {NAV.map((n) => {
            const on = current === n.key;
            return (
              <li key={n.key} className="min-w-0">
                <Link
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  className={cx(
                    "relative flex min-h-tile flex-col items-center justify-center gap-1 px-0.5 pb-1.5 pt-2 transition-colors duration-150 -outline-offset-4",
                    on ? "text-gold" : "text-paper-3 is-hover:text-on-green is-pressed:text-gold",
                  )}
                >
                  <span aria-hidden="true" className={cx("absolute inset-x-3 top-0 h-[3px] transition-opacity", on ? "bg-gold opacity-100" : "opacity-0")} />
                  <NavIcon k={n.key} className="size-[1.4rem]" />
                  <span className="caps truncate text-[0.68rem] tracking-[0.1em]">{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
  return (
    <nav aria-label={label} className={cx("on-green", className)}>
      <ul className="flex items-stretch gap-1">
        {NAV.map((n) => {
          const on = current === n.key;
          return (
            <li key={n.key}>
              <Link
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={cx(
                  "caps relative flex min-h-tile items-center gap-2 px-2.5 text-[0.85rem] tracking-[0.14em] transition-colors duration-150 lg:px-4 lg:tracking-[0.16em]",
                  on ? "text-gold" : "text-paper-3 is-hover:text-on-green",
                )}
              >
                <NavIcon k={n.key} className="hidden size-5 lg:block" />
                <span>{n.label}</span>
                <span aria-hidden="true" className={cx("absolute inset-x-2.5 bottom-2 h-px transition-all lg:inset-x-4", on ? "bg-gold" : "bg-transparent")} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
