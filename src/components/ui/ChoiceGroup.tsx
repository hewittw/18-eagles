"use client";
import { useId, type ReactNode } from "react";
import { cx } from "./cx";

export type Choice<T extends string> = { value: T; label: string; hint?: string; disabled?: boolean; /** Drawn art above the label (FairwayPicker's arrows). */ art?: ReactNode };

export type ChoiceGroupProps<T extends string> = {
  legend: string;
  options: Choice<T>[];
  value: T | null;
  onChange: (v: T) => void;
  layout?: "row" | "wrap" | "grid";
  size?: "sm" | "md" | "lg";
  hideLegend?: boolean;
  /** Shown under the legend. */
  hint?: string;
  /** Say what to do next ("Choose a tee"). Linked to the group with aria-describedby. */
  error?: string;
  name?: string;
  className?: string;
};

const sizes = {
  sm: "min-h-tap px-3.5 py-2 text-[0.95rem]",
  md: "min-h-12 px-4 py-2.5 text-[1rem]",
  lg: "min-h-tile px-4 py-3 text-[1.05rem]",
};
const layouts = {
  row: "flex flex-row [&>*]:flex-1 [&>*]:min-w-0",
  wrap: "flex flex-wrap",
  grid: "grid grid-cols-[repeat(auto-fill,minmax(min(100%,10.5rem),1fr))]",
};

/**
 * One choice from a few: native radios in a <fieldset>, so Tab enters once and the arrow keys move.
 * The face is a tile: a hollow pip at rest, filled and set on Locker Green when chosen (shape and fill, not hue alone).
 */
export function ChoiceGroup<T extends string>({ legend, options, value, onChange, layout = "wrap", size = "md", hideLegend, hint, error, name, className }: ChoiceGroupProps<T>) {
  const auto = useId();
  const n = name ?? `cg${auto}`;
  const hintId = hint ? `${n}-hint` : undefined;
  const errId = error ? `${n}-err` : undefined;
  return (
    <fieldset className={cx("min-w-0", className)} aria-describedby={[errId, hintId].filter(Boolean).join(" ") || undefined} aria-invalid={error ? true : undefined}>
      <legend className={cx("mb-2 text-[1rem] font-medium text-ink", hideLegend && "sr-only")}>{legend}</legend>
      {hint && <p id={hintId} className="-mt-1 mb-2 text-[0.92rem] text-ink-2">{hint}</p>}
      <div className={cx("gap-1.5", layouts[layout])}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={cx(
                "choice group/choice relative flex cursor-pointer select-none items-center gap-2.5 rounded-xs border bg-paper-2 text-ink shadow-tile transition-[background-color,border-color,transform] duration-150",
                "border-rule-strong is-hover:border-ink is-hover:bg-paper-3 is-pressed:translate-y-px is-pressed:border-ink is-pressed:bg-paper-3 is-pressed:shadow-none",
                "has-checked:border-green-3 has-checked:bg-green-3 has-checked:text-on-green has-checked:shadow-none",
                "has-disabled:cursor-not-allowed has-disabled:border-dashed has-disabled:bg-transparent has-disabled:text-ink-2 has-disabled:shadow-none has-disabled:translate-y-0",
                error && !value && "border-error",
                o.art ? "flex-col justify-center px-3 py-3 text-center" : sizes[size],
              )}
            >
              <input
                type="radio"
                name={n}
                value={o.value}
                checked={checked}
                disabled={o.disabled}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              {o.art ? (
                <span aria-hidden="true" className="flex h-12 items-center justify-center">{o.art}</span>
              ) : (
                <span aria-hidden="true" className="relative grid size-4 shrink-0 place-items-center rounded-full border-[1.5px] border-current">
                  <span className="size-2 scale-0 rounded-full bg-gold transition-transform duration-150 group-has-checked/choice:scale-100" />
                </span>
              )}
              <span className="min-w-0 leading-tight">
                <span className="block font-medium">{o.label}</span>
                {o.hint && <span className="mt-0.5 block font-numeral text-[0.9rem] tracking-wide text-ink-2 group-has-checked/choice:text-paper-3 group-has-disabled/choice:text-ink-2">{o.hint}</span>}
              </span>
              {o.art && <span aria-hidden="true" className="absolute right-2 top-2 size-1.5 scale-0 rounded-full bg-gold group-has-checked/choice:scale-100" />}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errId} className="mt-2 flex items-start gap-2 text-[0.95rem] font-medium text-error">
          <svg viewBox="0 0 16 16" className="mt-[0.2em] size-4 shrink-0" aria-hidden="true"><path d="M8 1.5 L15 14.5 H1 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 6 V10" stroke="currentColor" strokeWidth="1.6" /><circle cx="8" cy="12.2" r=".95" fill="currentColor" /></svg>
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}
