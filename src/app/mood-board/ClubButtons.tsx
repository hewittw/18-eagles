"use client";
// ✦ Sketch: club-per-shot buttons for the hole screen. Real buttons, 56px tall, announced politely.
import { useState } from "react";

const BAG = [
  { id: "Dr", name: "Driver", carry: 245 },
  { id: "3W", name: "3-wood", carry: 225 },
  { id: "4H", name: "4-hybrid", carry: 200 },
  { id: "5i", name: "5-iron", carry: 185 },
  { id: "6i", name: "6-iron", carry: 172 },
  { id: "7i", name: "7-iron", carry: 160 },
  { id: "8i", name: "8-iron", carry: 148 },
  { id: "9i", name: "9-iron", carry: 136 },
  { id: "PW", name: "Pitching wedge", carry: 124 },
  { id: "52", name: "52° wedge", carry: 105 },
  { id: "56", name: "56° wedge", carry: 85 },
  { id: "Pt", name: "Putter", carry: 0 },
] as const;

type Club = (typeof BAG)[number];
const PAR = 4;
const MAX = 10;

function verdict(n: number) {
  const d = n - PAR;
  return d <= -2 ? "eagle" : d === -1 ? "birdie" : d === 0 ? "par" : d === 1 ? "bogey" : `${d} over par`;
}

export default function ClubButtons() {
  const [shots, setShots] = useState<Club[]>([BAG[0], BAG[5]]);
  const [said, setSaid] = useState("");

  const add = (c: Club) => {
    if (shots.length >= MAX) return;
    const next = [...shots, c];
    setShots(next);
    setSaid(`Shot ${next.length}: ${c.name}. ${next.length} strokes on hole 5.`);
  };
  const undo = () => {
    if (!shots.length) return;
    const gone = shots[shots.length - 1];
    setShots(shots.slice(0, -1));
    setSaid(`Removed shot ${shots.length}, ${gone.name}. ${shots.length - 1} strokes on hole 5.`);
  };
  const n = shots.length;
  const last = shots[n - 1]?.id;

  return (
    <div className="tex-paper border border-(--mb-ink)">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-(--mb-ink) px-4 py-4 sm:px-6">
        <div>
          <p className="caps text-[0.75rem] text-(--mb-pencil)">Rancho Santa Fe · Hole 5 · Par 4 · 428 · Hcp 1</p>
          <p className="f-display mt-1 text-[1.9rem] leading-none">Which club, shot {Math.min(n + 1, MAX)}?</p>
        </div>
        <p className="flex items-baseline gap-2">
          <span className="f-cond text-[3rem] font-semibold leading-none" aria-hidden="true">{n}</span>
          <span className="caps text-[0.75rem] text-(--mb-pencil)">
            {n === 1 ? "stroke" : "strokes"}{n ? (shots[n - 1].id === "Pt" ? ` · holed, ${verdict(n)}` : " so far") : ""}
          </span>
        </p>
      </div>

      <div role="group" aria-label={`Club for shot ${Math.min(n + 1, MAX)}`} className="grid grid-cols-3 gap-1.5 p-3 sm:grid-cols-4 sm:p-4 lg:grid-cols-6">
        {BAG.map((c) => {
          const isLast = last === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => add(c)}
              disabled={n >= MAX}
              aria-label={`${c.id} ${c.carry || "green"}: ${c.name}${c.carry ? `, ${c.carry} yards` : ""}`}
              className={[
                "group relative flex min-h-14 flex-col items-start justify-between border px-2.5 py-2 text-left transition-[background-color,transform] duration-150",
                "border-(--mb-ink)/70 bg-(--mb-tile) text-(--mb-ink)",
                "hover:bg-(--mb-linen) active:translate-y-px active:bg-(--mb-fairway) active:text-(--mb-paper)",
                "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-(--mb-tile)",
                isLast ? "bg-(--mb-locker)! text-(--mb-paper)! border-(--mb-locker)" : "",
              ].join(" ")}
            >
              <span className="f-cond text-[1.6rem] font-semibold leading-none">{c.id}</span>{" "}
              <span className={`f-cond text-[0.85rem] font-medium leading-none ${isLast ? "text-(--mb-brass)" : "text-(--mb-pencil)"}`} aria-hidden="true">
                {c.carry ? `${c.carry}` : "green"}
              </span>
              {isLast && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-(--mb-brass)" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-(--mb-hair) px-3 py-3 sm:px-4">
        <ol className="flex flex-1 flex-wrap gap-1.5" aria-label="Shots on this hole">
          {shots.map((s, i) => (
            <li key={i} className="flex items-center gap-1.5 border border-(--mb-hair) bg-(--mb-linen) px-2 py-1 text-[0.9rem]">
              <span className="f-cond font-semibold text-(--mb-pencil)">{i + 1}</span>
              <span className="f-sans">{s.name}</span>
            </li>
          ))}
          {!n && <li className="f-text italic text-(--mb-pencil)">No shots yet. Tap the club you hit.</li>}
        </ol>
        <button
          type="button"
          onClick={undo}
          disabled={!n}
          className="min-h-11 border border-(--mb-ink) bg-transparent px-4 caps text-[0.8rem] text-(--mb-ink) hover:bg-(--mb-linen) active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
        >
          Undo last shot
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{said}</p>
    </div>
  );
}
