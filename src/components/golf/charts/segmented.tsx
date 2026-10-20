"use client";
import { useId } from "react";
import { cx } from "../../ui/cx";

/** `short`: a shorter label for the narrowest phones (under 23rem), so the segments stay on one line. */
export type SegmentedOption<T extends string> = { value: T; label: string; short?: string; disabled?: boolean };

/**
 * An iOS segmented control for chart filters: one rounded track, the chosen segment set on Fairway green.
 * Native radios in a <fieldset>, so Tab enters once and the arrow keys move (the same semantics as ChoiceGroup).
 */
export function Segmented<T extends string>({ legend, options, value, onChange, hideLegend, className }: { legend: string; options: SegmentedOption<T>[]; value: T; onChange: (v: T) => void; hideLegend?: boolean; className?: string }) {
  const name = `seg${useId()}`;
  return (
    <fieldset className={cx("min-w-0", className)}>
      <legend className={cx("caps mb-2 text-[0.74rem] text-ink-2", hideLegend && "sr-only")}>{legend}</legend>
      <div className="flex flex-wrap rounded-lg bg-paper-3 p-1">
        {options.map((o) => (
          <label
            key={o.value}
            className={cx(
              "relative flex min-h-tap min-w-fit flex-auto cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md px-1.5 py-1 text-center text-[0.86rem] max-[23rem]:px-1 max-[23rem]:text-[0.8rem] sm:px-2.5 sm:text-[0.95rem] font-semibold leading-tight text-ink transition-[background-color,color,transform] duration-150",
              "is-hover:bg-paper-2 is-pressed:scale-[0.97]",
              "has-checked:bg-green has-checked:text-on-green has-checked:is-hover:bg-green-2 has-checked:shadow-[0_2px_8px_-3px_rgb(0_103_71/0.7)]",
              "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus",
              "has-disabled:cursor-not-allowed has-disabled:text-ink-2",
            )}
          >
            <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} className="sr-only" />
            {o.short ? <><span className="max-[23rem]:hidden">{o.label}</span><span className="hidden max-[23rem]:inline">{o.short}</span></> : <span>{o.label}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
