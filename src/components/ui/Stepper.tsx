"use client";
import { useId, useState } from "react";
import { cx } from "./cx";

export type StepperProps = {
  label: string;
  value: number | null;
  onChange: (n: number | null) => void;
  min?: number;
  max?: number;
  size?: "md" | "lg";
  /** Under the label, e.g. "Including chips from the fringe". */
  hint?: string;
  /** Unit read out with the value: "putts" → "Putts: 2 putts". */
  unit?: { one: string; many: string };
  /** Where the first + lands when the value is empty. Defaults to min. */
  start?: number;
  disabled?: boolean;
};

/** − value + with real buttons (≥ 44px; 56px at lg), disabled at the limits, and a polite live value. */
export function Stepper({ label, value, onChange, min = 0, max = 99, size = "md", hint, unit, start, disabled }: StepperProps) {
  const id = useId();
  const [said, setSaid] = useState("");
  const btn = size === "lg" ? "size-tile text-[1.6rem]" : "size-tap text-[1.3rem]";
  const words = (n: number | null) => (n == null ? "not set" : unit ? `${n} ${n === 1 ? unit.one : unit.many}` : String(n));
  const set = (n: number | null) => {
    onChange(n);
    setSaid(`${label}: ${words(n)}`);
  };
  const dec = () => value != null && value > min && set(value - 1);
  const inc = () => set(value == null ? (start ?? min) : Math.min(max, value + 1));
  const atMin = value == null || value <= min;
  const atMax = value != null && value >= max;
  const b =
    "grid shrink-0 place-items-center rounded-xs border border-ink bg-paper-2 font-numeral font-semibold leading-none text-ink transition-[background-color,transform] duration-150 " +
    "is-hover:bg-paper-3 is-pressed:translate-y-px is-pressed:border-green is-pressed:bg-green is-pressed:text-on-green " +
    "disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-dashed disabled:border-rule-strong disabled:bg-transparent disabled:text-ink-2";
  return (
    <div className="min-w-0">
      <p id={`${id}-l`} className="text-[1rem] font-medium text-ink">{label}</p>
      {hint && <p id={`${id}-h`} className="text-[0.92rem] text-ink-2">{hint}</p>}
      <div role="group" aria-labelledby={`${id}-l`} aria-describedby={hint ? `${id}-h` : undefined} className="mt-2 inline-flex items-stretch gap-1.5">
        <button type="button" className={cx(b, btn)} onClick={dec} disabled={disabled || atMin} aria-label={`Fewer ${label.toLowerCase()}`}>
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true"><path d="M2 8 H14" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
        <span
          className={cx(
            "tile grid min-w-[4.25rem] place-items-center px-3 font-numeral font-semibold leading-none tabular-nums",
            size === "lg" ? "text-[2.2rem]" : "text-[1.7rem]",
            value == null && "text-ink-2",
          )}
        >
          <span className="sr-only">{label}: </span>
          <span aria-hidden={value == null || undefined}>{value ?? "–"}</span>
          {value == null && <span className="sr-only">not set</span>}
        </span>
        <button type="button" className={cx(b, btn)} onClick={inc} disabled={disabled || atMax} aria-label={`More ${label.toLowerCase()}`}>
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true"><path d="M2 8 H14 M8 2 V14" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{said}</p>
    </div>
  );
}
