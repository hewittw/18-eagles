"use client";
import type { Fairway } from "@/lib/types";
import { ChoiceGroup } from "../ui/ChoiceGroup";

export type FairwayPickerProps = {
  value: Fairway | null;
  onChange: (v: Fairway) => void;
  legend?: string;
  hideLegend?: boolean;
  disabled?: boolean;
};

/** A strip of fairway with the ball's flight drawn on it: missed left, hit, missed right. */
function Flight({ dir }: { dir: Fairway }) {
  const end = dir === "left" ? [12, 10] : dir === "right" ? [52, 10] : [32, 10];
  const path = dir === "hit" ? "M32 44 L32 10" : dir === "left" ? "M32 44 C 32 28, 22 16, 12 10" : "M32 44 C 32 28, 42 16, 52 10";
  const ang = dir === "left" ? -58 : dir === "right" ? 58 : 0;
  return (
    <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden="true">
      {/* the fairway: two edges, like the yardage book */}
      <path d="M22 47 C 20 30, 21 14, 24 2 M42 47 C 44 30, 43 14, 40 2" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.2" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={dir === "hit" ? undefined : "0"} />
      <g transform={`translate(${end[0]} ${end[1]}) rotate(${ang})`}>
        <path d="M0 -2 L-5 7 M0 -2 L5 7" stroke="currentColor" strokeWidth="2" fill="none" />
      </g>
      <circle cx="32" cy="44" r="2.6" fill="currentColor" />
    </svg>
  );
}

/** Left / Hit / Right for the tee shot on par 4s and 5s. ChoiceGroup semantics: native radios, arrow keys. */
export function FairwayPicker({ value, onChange, legend = "Fairway off the tee", hideLegend, disabled }: FairwayPickerProps) {
  return (
    <ChoiceGroup<Fairway>
      legend={legend}
      hideLegend={hideLegend}
      value={value}
      onChange={onChange}
      layout="row"
      options={[
        { value: "left", label: "Missed left", art: <Flight dir="left" />, disabled },
        { value: "hit", label: "Hit", art: <Flight dir="hit" />, disabled },
        { value: "right", label: "Missed right", art: <Flight dir="right" />, disabled },
      ]}
    />
  );
}
