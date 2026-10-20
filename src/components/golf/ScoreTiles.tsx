"use client";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { cx } from "../ui/cx";
import { scoreName, scoreShort } from "./score";
import { ScoreMark } from "./ScoreMark";

export type ScoreTilesProps = {
  par: number;
  value: number | null;
  onChange: (n: number) => void;
  /** Highest score offered behind "More". Default 12. */
  max?: number;
  /** The group's name, e.g. "Score for hole 7". */
  label?: string;
  /** Prefix for the live announcement: "Hole 7" → "Hole 7: 4 strokes, par." */
  holeLabel?: string;
  disabled?: boolean;
};

/**
 * The hole screen's main control: hand-hung tiles from par − 2 to par + 3, plus "More" for higher.
 * One radiogroup (Tab lands on the chosen tile; arrows, Home, End move and choose), tiles ≥ 56px,
 * each labelled with its number and name ("4, par"), and a polite announcement on every change.
 */
export function ScoreTiles({ par, value, onChange, max = 12, label = "Score", holeLabel, disabled }: ScoreTilesProps) {
  const id = useId();
  const low = Math.max(1, par - 2);
  const high = Math.min(max, par + 3);
  const [moreOpen, setMoreOpen] = useState(false);
  const showMore = moreOpen || (value != null && value > high);
  const nums: number[] = [];
  for (let n = low; n <= (showMore ? max : high); n++) nums.push(n);
  const refs = useRef(new Map<number, HTMLButtonElement>());
  const [said, setSaid] = useState("");

  const choose = (n: number, focus = false) => {
    onChange(n);
    setSaid(`${holeLabel ? holeLabel + ": " : ""}${n} ${n === 1 ? "stroke" : "strokes"}, ${scoreName(n, par).toLowerCase()}.`);
    if (focus) refs.current.get(n)?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, n: number) => {
    const i = nums.indexOf(n);
    let next: number | undefined;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = nums[(i + 1) % nums.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = nums[(i - 1 + nums.length) % nums.length];
    else if (e.key === "Home") next = nums[0];
    else if (e.key === "End") next = nums[nums.length - 1];
    if (next != null) {
      e.preventDefault();
      choose(next, true);
    }
  };

  const tabStop = value != null && nums.includes(value) ? value : par;

  return (
    <div className="@container min-w-0">
      <div
        role="radiogroup"
        aria-label={label}
        aria-disabled={disabled || undefined}
        className="grid grid-cols-3 gap-2 @[19rem]:grid-cols-6 @[19rem]:gap-1.5 @[30rem]:gap-2.5"
      >
        {nums.map((n, i) => {
          const checked = value === n;
          const d = n - par;
          return (
            <button
              key={n}
              ref={(el) => { if (el) refs.current.set(n, el); else refs.current.delete(n); }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${n}, ${scoreName(n, par).toLowerCase()}`}
              tabIndex={n === tabStop ? 0 : -1}
              disabled={disabled}
              onClick={() => choose(n)}
              onKeyDown={(e) => onKey(e, n)}
              style={{ "--i": i } as CSSProperties}
              className={cx(
                "hang group/t relative flex min-h-[4.75rem] min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg border bg-paper-2 px-1 py-2 text-ink shadow-card @[30rem]:min-h-[5.5rem]",
                "transition-[background-color,border-color,transform,box-shadow] duration-150 is-hover:border-green/45 is-hover:bg-tint is-pressed:scale-[0.96]",
                "aria-checked:border-green aria-checked:bg-green aria-checked:text-on-green aria-checked:shadow-[0_6px_16px_-8px_rgb(0_103_71/0.8)]",
                "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:text-ink-2 disabled:shadow-none",
                d === 0 && !checked ? "border-green/60" : !checked && "border-rule",
              )}
            >
              <span aria-hidden="true" className={cx("font-numeral text-[2.6rem] font-semibold leading-none tabular-nums @[30rem]:text-[2.9rem]", !checked && d < 0 && "text-under")}>
                {n}
              </span>
              <span aria-hidden="true" className={cx("caps text-[0.66rem] leading-none tracking-[0.06em]", checked ? "text-gold" : d === 0 ? "text-green" : "text-ink-2")}>
                {scoreShort(n, par)}
              </span>
              {checked && <span aria-hidden="true" className="absolute right-2 top-2 size-1.5 rounded-full bg-gold" />}
            </button>
          );
        })}
      </div>
      {high < max && (
        <button
          type="button"
          aria-expanded={showMore}
          disabled={disabled || (value != null && value > high)}
          onClick={() => setMoreOpen((o) => !o)}
          className="mt-3 inline-flex min-h-tap items-center gap-2 rounded-full bg-tint px-4 text-[0.95rem] font-semibold text-green transition-[background-color,transform] duration-150 is-hover:bg-tint-2 is-pressed:scale-[0.98] disabled:cursor-not-allowed disabled:bg-paper-3 disabled:text-ink-2"
        >
          <svg viewBox="0 0 16 10" className={cx("h-2.5 w-4 transition-transform", showMore && "rotate-180")} aria-hidden="true"><path d="M2 2 L8 8 L14 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {showMore ? `Fewer scores` : `More: ${high + 1} or higher`}
        </button>
      )}
      <p className="sr-only" aria-live="polite" id={`${id}-live`}>{said}</p>
      {value != null && (
        <p className="mt-3 flex items-center gap-3 text-ink-2" aria-hidden="true">
          <ScoreMark strokes={value} par={par} size="sm" />
          <span className="font-serif italic">{scoreName(value, par)} on a par {par}</span>
        </p>
      )}
    </div>
  );
}
