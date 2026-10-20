"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "./cx";

export type ToastOptions = {
  message: string;
  /** Usually "Undo". Undo over confirm: do the thing, then offer to take it back. */
  action?: { label: string; onClick(): void };
  /** ms. At least 6000; paused while hovered or focused. A toast with an action stays until dismissed. */
  duration?: number;
};
type Item = ToastOptions & { id: number };

type ToastFn = ((t: ToastOptions) => number) & { toast: (t: ToastOptions) => number; dismiss: (id?: number) => void };

const Ctx = createContext<ToastFn | null>(null);
let seq = 0;

/**
 * `const toast = useToast(); toast({ message, action })`. Also works as `const { toast, dismiss } = useToast()`.
 * Needs a <ToastProvider> above it.
 */
export function useToast(): ToastFn {
  const t = useContext(Ctx);
  if (!t) throw new Error("useToast() needs a <ToastProvider> above it.");
  return t;
}

/** Hosts the toasts in one polite live region. On phones it sits above the bottom tab bar. */
export function ToastProvider({ children, bottomOffset }: { children: ReactNode; /** CSS length above the viewport bottom on phones; default clears the tab bar. */ bottomOffset?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const dismiss = useCallback((id?: number) => setItems((xs) => (id == null ? [] : xs.filter((x) => x.id !== id))), []);
  const api = useMemo(() => {
    const show = (t: ToastOptions) => {
      const id = ++seq;
      // One at a time: a newer message replaces the last, so undo always refers to the latest action.
      setItems([{ ...t, id }]);
      return id;
    };
    return Object.assign(show, { toast: show, dismiss }) as ToastFn;
  }, [dismiss]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div
        data-toast
        role="status"
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-(--toast-b) z-[90] flex flex-col items-center gap-2 px-3 md:bottom-6"
        style={{ "--toast-b": bottomOffset ?? "calc(5.25rem + env(safe-area-inset-bottom))" } as CSSProperties}
      >
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onDone={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

/** After Undo or Dismiss removes the toast, put keyboard focus back where it was, not on the page body. */
let lastFocus: HTMLElement | null = null;
if (typeof document !== "undefined") {
  document.addEventListener("focusin", (e) => {
    const t = e.target as HTMLElement;
    if (!t.closest?.("[data-toast]")) lastFocus = t;
  });
}
function restoreFocus() {
  requestAnimationFrame(() => {
    const a = document.activeElement;
    if (a && a !== document.body && a.isConnected && !(a as HTMLElement).closest("[data-toast]")) return;
    const back = lastFocus?.isConnected && lastFocus.getClientRects().length ? lastFocus : document.querySelector<HTMLElement>("main h1");
    back?.focus({ preventScroll: true });
  });
}

function ToastCard({ item, onDone }: { item: Item; onDone: () => void }) {
  const min = item.action ? 8000 : 6000;
  const total = Math.max(min, item.duration ?? 0);
  const [paused, setPaused] = useState(false);
  const left = useRef(total);
  const started = useRef(0);
  const done = useRef(onDone);
  useEffect(() => { done.current = onDone; });

  useEffect(() => {
    // A toast with an action (Undo) waits to be dismissed, so a keyboard user always has time to reach it (WCAG 2.2.1).
    if (paused || item.action) return;
    started.current = performance.now();
    const t = window.setTimeout(() => done.current(), left.current);
    return () => {
      window.clearTimeout(t);
      left.current = Math.max(1500, left.current - (performance.now() - started.current));
    };
  }, [paused, item.action]);

  return (
    <Toast
      message={item.message}
      action={item.action ? { label: item.action.label, onClick: () => { item.action!.onClick(); onDone(); restoreFocus(); } } : undefined}
      onDismiss={() => { onDone(); restoreFocus(); }}
      onPause={setPaused}
      className="pointer-events-auto animate-toast"
    />
  );
}

/** The slip itself: Locker Green, paper text, a brass action. Exported so /design-system can show it at rest. */
export function Toast({ message, action, onDismiss, onPause, className }: { message: string; action?: { label: string; onClick(): void }; onDismiss?: () => void; onPause?: (p: boolean) => void; className?: string }) {
  return (
    <div
      onMouseEnter={() => onPause?.(true)}
      onMouseLeave={() => onPause?.(false)}
      onFocus={() => onPause?.(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) onPause?.(false); }}
      className={cx("tex-locker on-green flex w-full max-w-[34rem] items-center gap-2 border border-gold/40 py-1.5 pl-4 pr-1.5 shadow-lift", className)}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gold" />
      <p className="min-w-0 flex-1 py-2 text-[0.98rem] leading-snug text-on-green">{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="caps min-h-tap shrink-0 rounded-xs border border-gold px-4 text-[0.88rem] text-gold transition-colors duration-150 is-hover:bg-gold is-hover:text-green-3 is-pressed:translate-y-px"
        >
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="grid size-tap shrink-0 place-items-center rounded-xs text-paper-3 is-hover:bg-white/10 is-hover:text-on-green">
          <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true"><path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
      )}
    </div>
  );
}
