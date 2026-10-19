import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode, Ref } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
/** The surface the button sits on. Paper by default; "green" for Locker Green bands and green cards. */
export type ButtonTone = "paper" | "green";

type VisualProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  tone?: ButtonTone;
  /** Stretch to the container's width (phones, sheets). */
  block?: boolean;
};

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 rounded-xs border font-numeral font-semibold uppercase tracking-[0.12em] leading-none whitespace-nowrap " +
  "transition-[background-color,color,border-color,transform] duration-150 ease-press is-pressed:translate-y-px " +
  "disabled:cursor-not-allowed disabled:translate-y-0 aria-disabled:cursor-not-allowed";

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-tap text-[0.88rem]",
  md: "min-h-12 text-[0.98rem]",
  lg: "min-h-tile text-[1.1rem]",
};
const pads: Record<ButtonSize, string> = { sm: "px-4", md: "px-5", lg: "px-7" };

const variants: Record<ButtonTone, Record<ButtonVariant, string>> = {
  paper: {
    primary:
      "border-green bg-green text-on-green is-hover:border-green-2 is-hover:bg-green-2 is-pressed:border-green-3 is-pressed:bg-green-3 " +
      "disabled:border-rule-strong disabled:bg-paper-3 disabled:text-ink-2",
    secondary:
      "border-ink bg-paper-2 text-ink is-hover:bg-paper-3 is-pressed:border-green is-pressed:bg-green is-pressed:text-on-green " +
      "disabled:border-rule-strong disabled:border-dashed disabled:bg-transparent disabled:text-ink-2",
    quiet:
      "border-transparent bg-transparent text-ink underline decoration-rule-strong decoration-1 underline-offset-[5px] is-hover:bg-paper-3 is-hover:decoration-ink is-pressed:bg-green is-pressed:text-on-green is-pressed:no-underline " +
      "disabled:text-ink-2 disabled:no-underline",
    danger:
      "border-error bg-paper-2 text-error is-hover:bg-error is-hover:text-paper is-pressed:border-ink is-pressed:bg-ink is-pressed:text-paper " +
      "disabled:border-rule-strong disabled:border-dashed disabled:bg-transparent disabled:text-ink-2",
  },
  green: {
    primary:
      "border-on-green bg-on-green text-green-3 is-hover:border-paper-2 is-hover:bg-paper-2 is-pressed:border-gold is-pressed:bg-gold is-pressed:text-green-3 " +
      "disabled:border-paper-3/40 disabled:bg-transparent disabled:text-paper-3",
    secondary:
      "border-paper-3 bg-transparent text-on-green is-hover:bg-white/8 is-pressed:border-on-green is-pressed:bg-on-green is-pressed:text-green-3 " +
      "disabled:border-dashed disabled:border-paper-3/50 disabled:text-paper-3",
    quiet:
      "border-transparent bg-transparent text-on-green underline decoration-paper-3/60 underline-offset-[5px] is-hover:bg-white/8 is-hover:decoration-on-green is-pressed:bg-on-green is-pressed:text-green-3 " +
      "disabled:text-paper-3 disabled:no-underline",
    danger:
      "border-paper-3 bg-transparent text-on-green is-hover:bg-under is-hover:border-under is-pressed:bg-ink is-pressed:border-ink " +
      "disabled:border-dashed disabled:text-paper-3",
  },
};

/** Shared by Button and ButtonLink so a link that looks like a button is the same button. */
export function buttonClasses({ variant = "secondary", size = "md", tone = "paper", block = false }: VisualProps = {}, extra?: string) {
  return cx(base, sizes[size], variant === "quiet" ? "px-3" : pads[size], variants[tone][variant], block && "w-full", extra);
}

/** A small drawn spinner: the rope ring of the monogram, turning. Stops under reduced motion. */
function Spinner() {
  return (
    <svg viewBox="0 0 20 20" className="size-[1.1em] animate-spin motion-reduce:animate-none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="2" />
      <path d="M10 2.5 A7.5 7.5 0 0 1 17.5 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export type ButtonProps = VisualProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: Ref<HTMLButtonElement>;
    loading?: boolean;
    /** Read out while loading, e.g. "Saving the round". Defaults to "Working". */
    loadingLabel?: string;
    /** Design-system only: show a state without a pointer ("hover" | "pressed" | "focus"). */
    "data-force"?: string;
  };

/**
 * A real <button>. Primary is the one green action on a screen. Labels are condensed caps.
 * Loading keeps the label (so the width holds), shows the turning ring, and sets aria-busy + disabled.
 */
export function Button({ variant, size, icon, tone, block, loading = false, loadingLabel = "Working", className, children, disabled, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, tone, block }, cx(loading && "cursor-progress!", className))}
      {...rest}
    >
      {loading ? <Spinner /> : icon ? <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
      {loading && <span className="sr-only">. {loadingLabel}…</span>}
    </button>
  );
}

export type ButtonLinkProps = VisualProps & Omit<ComponentProps<typeof Link>, "className"> & { className?: string; "data-force"?: string };

/** Navigation that looks like a button: a Next <Link> with Button's classes. */
export function ButtonLink({ variant, size, icon, tone, block, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, tone, block }, className)} {...rest}>
      {icon ? <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </Link>
  );
}

/** A drawn arrow for "next" actions (no emoji, no icon font). */
export function ArrowIcon({ dir = "right" }: { dir?: "right" | "left" }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" className={dir === "left" ? "rotate-180" : undefined}>
      <path d="M0 6 H16 M11 1 L16 6 L11 11" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}
