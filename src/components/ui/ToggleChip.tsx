"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type ToggleChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  pressed: boolean;
  onPressedChange: (p: boolean) => void;
  children: ReactNode;
  size?: "sm" | "md";
  "data-force"?: string;
};

/** An on/off filter or option: a real button with aria-pressed. Pressed fills Locker Green and shows a tick. */
export function ToggleChip({ pressed, onPressedChange, children, size = "sm", className, disabled, ...rest }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => onPressedChange(!pressed)}
      className={cx(
        "inline-flex select-none items-center gap-2 rounded-xs border font-medium leading-none transition-[background-color,border-color,color,transform] duration-150",
        size === "sm" ? "min-h-tap px-3.5 text-[0.95rem]" : "min-h-12 px-4 text-[1rem]",
        "border-rule-strong bg-paper-2 text-ink is-hover:border-ink is-hover:bg-paper-3 is-pressed:translate-y-px",
        "aria-pressed:border-green-3 aria-pressed:bg-green-3 aria-pressed:text-on-green",
        "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:text-ink-2 disabled:translate-y-0",
        className,
      )}
      {...rest}
    >
      <svg viewBox="0 0 14 14" className={cx("size-3.5 shrink-0", pressed ? "text-gold" : "text-rule-strong")} aria-hidden="true">
        {pressed ? (
          <path d="M2 7.5 L5.5 11 L12 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        ) : (
          <path d="M7 2 V12 M2 7 H12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        )}
      </svg>
      <span>{children}</span>
    </button>
  );
}
