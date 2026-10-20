"use client";
import { useEffect, useRef, useState } from "react";
import type { Club, ClubKind } from "@/lib/types";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";

export type ClubPickerProps = {
  bag: Club[];
  /** Club ids in the order hit. */
  shots: string[];
  onChange: (shots: string[]) => void;
  /** Prefix for announcements: "Hole 5" → "Shot 3: 7-iron. 3 strokes on hole 5." */
  holeLabel?: string;
  /** Carry yards by club id, shown small on each tile. */
  carries?: Record<string, number>;
  /** Most shots a hole can take here. Default 15. */
  max?: number;
  disabled?: boolean;
};

const GROUPS: { kind: ClubKind; label: string }[] = [
  { kind: "wood", label: "Woods" },
  { kind: "hybrid", label: "Hybrids" },
  { kind: "iron", label: "Irons" },
  { kind: "wedge", label: "Wedges" },
  { kind: "putter", label: "Putter" },
];

/**
 * The bag as a button board. Tap the club you hit and it becomes the next shot. The sequence reads
 * "Dr → 7i → Pt", with Remove last and Clear (Clear can be undone). Every change is announced politely.
 */
export function ClubPicker({ bag, shots, onChange, holeLabel, carries, max = 15, disabled }: ClubPickerProps) {
  const clubs = bag.filter((c) => c.inBag);
  const firstId = GROUPS.flatMap((g) => clubs.filter((c) => c.kind === g.kind))[0]?.id;
  const byId = new Map(bag.map((c) => [c.id, c]));
  const [said, setSaid] = useState("");
  const [cleared, setCleared] = useState<string[] | null>(null);
  // Clear and Undo swap places and Remove last disables itself at zero: keep keyboard focus on a live control.
  const undoRef = useRef<HTMLButtonElement>(null);
  const removeRef = useRef<HTMLButtonElement>(null);
  const firstClubRef = useRef<HTMLButtonElement>(null);
  // Where focus goes after the next render (a ref, so asking for it doesn't cost another render).
  const refocus = useRef<"undo" | "remove" | "club" | null>(null);
  const setRefocus = (to: "undo" | "remove" | "club") => { refocus.current = to; };
  useEffect(() => {
    const to = refocus.current;
    if (!to) return;
    refocus.current = null;
    (to === "undo" ? undoRef : to === "remove" ? removeRef : firstClubRef).current?.focus();
  });
  const nameOf = (id: string) => byId.get(id)?.name ?? id;
  const shortOf = (id: string) => byId.get(id)?.short ?? id;
  const tail = (n: number) => (holeLabel ? ` ${n} ${n === 1 ? "stroke" : "strokes"} on ${holeLabel.toLowerCase()}.` : "");
  const last = shots[shots.length - 1];
  const full = shots.length >= max;

  const add = (c: Club) => {
    if (full) return;
    const next = [...shots, c.id];
    onChange(next);
    setCleared(null);
    setSaid(`Shot ${next.length}: ${c.name}.${tail(next.length)}`);
  };
  const removeLast = () => {
    if (!shots.length) return;
    const next = shots.slice(0, -1);
    onChange(next);
    setCleared(null);
    if (!next.length) setRefocus("club");
    setSaid(`Removed shot ${shots.length}, ${nameOf(shots[shots.length - 1])}.${tail(next.length)}`);
  };
  const clear = () => {
    if (!shots.length) return;
    setCleared(shots);
    onChange([]);
    setRefocus("undo");
    setSaid(`Cleared ${shots.length} ${shots.length === 1 ? "shot" : "shots"}. Undo is next to the list.`);
  };
  const undoClear = () => {
    if (!cleared) return;
    onChange(cleared);
    setRefocus("remove");
    setSaid(`Restored ${cleared.length} ${cleared.length === 1 ? "shot" : "shots"}.`);
    setCleared(null);
  };

  return (
    <div className="@container min-w-0">
      <div className="grid gap-3">
        {GROUPS.map((g) => {
          const inGroup = clubs.filter((c) => c.kind === g.kind);
          if (!inGroup.length) return null;
          return (
            <div key={g.kind} role="group" aria-label={g.label} className="grid min-w-0 grid-cols-1 items-start gap-1.5 @sm:grid-cols-[4.5rem_1fr] @sm:gap-2">
              <p aria-hidden="true" className="caps text-[0.72rem] text-ink-2 @sm:pt-4">{g.label}</p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))] gap-1.5">
                {inGroup.map((c) => {
                  const isLast = last === c.id;
                  const carry = carries?.[c.id];
                  return (
                    <button
                      key={c.id}
                      ref={c.id === firstId ? firstClubRef : undefined}
                      type="button"
                      onClick={() => add(c)}
                      disabled={disabled || full}
                      // the name starts with the tile's visible text ("7i 160"), so voice control can say what it sees (WCAG 2.5.3)
                      aria-label={`${c.short}${carry ? ` ${carry}` : c.kind === "putter" ? " green" : ""}: ${c.name}${carry ? `, carries ${carry} yards` : ""}${isLast ? ", last club used" : ""}`}
                      className={cx(
                        "group/c relative flex min-h-tile min-w-0 flex-col items-start justify-between rounded-md border border-rule bg-paper-2 px-2.5 py-2 text-left text-ink shadow-card",
                        "transition-[background-color,border-color,transform,color] duration-150",
                        "is-hover:border-green/45 is-hover:bg-tint is-pressed:scale-[0.96] is-pressed:border-green is-pressed:bg-green is-pressed:text-on-green",
                        "disabled:cursor-not-allowed disabled:scale-100 disabled:border-dashed disabled:bg-transparent disabled:text-ink-2 disabled:shadow-none",
                        isLast && "border-green! bg-green! text-on-green!",
                      )}
                    >
                      <span aria-hidden="true" className="font-numeral text-[1.55rem] font-semibold leading-none">{c.short}</span>{" "}
                      <span aria-hidden="true" className={cx("min-h-[0.82rem] font-numeral text-[0.82rem] font-medium leading-none", isLast ? "text-gold" : "text-ink-2")}>
                        {carry ? carry : c.kind === "putter" ? "green" : ""}
                      </span>
                      {isLast && <span aria-hidden="true" className="absolute right-2 top-2 size-1.5 rounded-full bg-gold" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-lg bg-paper-3 px-3.5 py-3 @md:grid-cols-[auto_minmax(0,1fr)_auto]">
        <p className="caps shrink-0 text-[0.72rem] text-ink-2">
          {shots.length} {shots.length === 1 ? "shot" : "shots"}
        </p>
        {shots.length ? (
          <ol aria-label="Shots on this hole, in order" className="flex min-w-0 flex-wrap items-center gap-y-1 font-numeral text-[1.2rem] font-semibold">
            {shots.map((s, i) => (
              <li key={i} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="px-1.5 text-ink-2">→</span>}
                <span className={cx("px-0.5", i === shots.length - 1 && "rounded-xs bg-green px-1.5! text-on-green")}>
                  <span aria-hidden="true">{shortOf(s)}</span>
                  <span className="sr-only">{nameOf(s)}</span>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="min-w-0 font-serif italic text-ink-2">
            {cleared ? "Shots cleared." : "No shots yet. Tap the club you hit."}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {cleared ? (
            <Button ref={undoRef} size="sm" variant="secondary" onClick={undoClear}>Undo clear</Button>
          ) : (
            <>
              <Button ref={removeRef} size="sm" variant="secondary" onClick={removeLast} disabled={disabled || !shots.length}>Remove last</Button>
              <Button size="sm" variant="quiet" onClick={clear} disabled={disabled || !shots.length}>Clear</Button>
            </>
          )}
        </div>
      </div>
      {full && <p className="mt-2 text-[0.92rem] text-ink-2">That&apos;s {max} shots, the most this hole takes. Remove one to change a club.</p>}
      <p className="sr-only" aria-live="polite">{said}</p>
    </div>
  );
}
