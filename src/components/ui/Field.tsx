"use client";
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cx } from "./cx";

export type FieldA11y = { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean };

export type FieldProps = {
  label: string;
  hint?: string;
  /** Say what to do next: "Enter the course name", not "Invalid input". */
  error?: string;
  optional?: boolean;
  id?: string;
  children: (a11y: FieldA11y) => ReactNode;
  /** Hide the label visually (it stays the accessible name). Use only when a heading right above says the same. */
  hideLabel?: boolean;
  className?: string;
};

/** The warning mark beside an error: a drawn notch, so the error never relies on color. */
export function ErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[0.2em] size-4 shrink-0" aria-hidden="true">
      <path d="M8 1.5 L15 14.5 H1 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6 V10" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="12.2" r=".95" fill="currentColor" />
    </svg>
  );
}

/**
 * Move focus to a field that just got an error, so a screen reader reads its label and the linked error. If focus is
 * already there (Enter pressed inside it), blur first: focusing an already-focused field announces nothing.
 */
export function focusInvalid(el: HTMLElement | null | undefined) {
  if (!el) return;
  if (document.activeElement === el) el.blur();
  el.focus();
}

/**
 * One labelled field: <label htmlFor>, an optional hint, the control (render prop), and the error next to it.
 * The hint and error are linked with aria-describedby; aria-invalid is set when there's an error.
 */
export function Field({ label, hint, error, optional, id, children, hideLabel, className }: FieldProps) {
  const auto = useId();
  const fid = id ?? `f${auto}`;
  const hintId = hint ? `${fid}-hint` : undefined;
  const errId = error ? `${fid}-err` : undefined;
  const describedBy = [errId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cx("grid min-w-0 gap-1.5", className)}>
      <label htmlFor={fid} className={cx("text-[1rem] font-medium leading-snug text-ink", hideLabel && "sr-only")}>
        {label}
        {optional && <span className="font-normal text-ink-2"> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="-mt-0.5 text-[0.92rem] leading-snug text-ink-2">
          {hint}
        </p>
      )}
      {children({ id: fid, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error && (
        <p id={errId} className="flex items-start gap-2 text-[0.95rem] font-medium leading-snug text-error">
          <ErrorIcon />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

// Styled natives. 16px text so phones don't zoom; 48px tall; Graphite border (4.01:1) that turns ink on hover.
const control =
  "block w-full min-w-0 rounded-xs border border-rule-strong bg-paper-2 px-3.5 text-[1rem] text-ink shadow-[inset_0_1px_0_rgb(28_27_23/0.05)] " +
  "transition-[border-color,box-shadow] duration-150 placeholder:text-ink-2/80 " +
  "is-hover:border-ink aria-invalid:border-error aria-invalid:shadow-[inset_0_0_0_1px_var(--color-error)] " +
  "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-paper-3 disabled:text-ink-2 read-only:bg-paper";

type ForceProp = { "data-force"?: string };

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & ForceProp>(function TextInput({ className, type = "text", ...p }, ref) {
  return <input ref={ref} type={type} className={cx(control, "min-h-12", className)} {...p} />;
});

export type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & ForceProp & {
  /** Allow a decimal point (handicap index, rating). Whole numbers otherwise. */
  decimal?: boolean;
};
/** type="text" + inputMode, so phones show the number pad and the value is never silently rounded or blanked. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput({ className, decimal, inputMode, ...p }, ref) {
  return (
    <input
      ref={ref}
      type="text"
      inputMode={inputMode ?? (decimal ? "decimal" : "numeric")}
      pattern={decimal ? "[0-9]*[.,]?[0-9]*" : "[0-9]*"}
      autoComplete="off"
      className={cx(control, "min-h-12 font-numeral text-[1.15rem] font-medium tabular-nums", className)}
      {...p}
    />
  );
});

export const DateInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & ForceProp>(function DateInput({ className, ...p }, ref) {
  return <input ref={ref} type="date" className={cx(control, "min-h-12 font-numeral text-[1.1rem] tabular-nums focus:outline-2 focus:outline-offset-2 focus:outline-focus", className)} {...p} />;
});

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & ForceProp & {
  /** The golfer's own words (hole and round notes): Caslon italic, the app's human voice. */
  voice?: boolean;
};
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ className, voice, rows = 3, ...p }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx(control, "min-h-24 resize-y py-3 leading-relaxed", voice && "font-serif text-[1.05rem] italic text-link placeholder:not-italic", className)}
      {...p}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & ForceProp>(function Select({ className, children, ...p }, ref) {
  return (
    <span className="relative block min-w-0">
      <select ref={ref} className={cx(control, "min-h-12 cursor-pointer appearance-none pr-11", className)} {...p}>
        {children}
      </select>
      <svg viewBox="0 0 12 8" className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-ink" aria-hidden="true">
        <path d="M1 1 L6 6 L11 1" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  );
});
