"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./Button";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

/**
 * Native <dialog> opened with showModal(): the page behind goes inert, Esc cancels, focus starts on Cancel
 * (the safe choice) and returns to the opener on close. Only for what can't be undone ("Erase everything").
 */
export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, onConfirm, onCancel, danger }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
      cancelRef.current?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => opener.current?.focus?.();
    const onEsc = (e: Event) => { e.preventDefault(); onCancel(); };
    d.addEventListener("close", onClose);
    d.addEventListener("cancel", onEsc);
    return () => { d.removeEventListener("close", onClose); d.removeEventListener("cancel", onEsc); };
  }, [onCancel]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-b`}
      onClick={(e) => { if (e.target === ref.current) onCancel(); }}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] max-w-none border border-ink bg-paper p-0 text-ink shadow-lift backdrop:bg-ink/55 backdrop:backdrop-blur-[1px] open:animate-fade"
    >
      <div className="tex-paper p-6 sm:p-8">
        <p className="caps text-label text-gold-ink">{danger ? "Can't be undone" : "Please confirm"}</p>
        <h2 id={`${id}-t`} className="mt-1 font-display text-title text-ink">{title}</h2>
        <div className="rule-double mt-3 text-ink" aria-hidden="true" />
        <div id={`${id}-b`} className="mt-4 text-[1rem] leading-relaxed text-ink-2">{body}</div>
        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </dialog>
  );
}
