"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ChoiceGroup } from "@/components/ui";
import type { Course } from "@/lib/course-types";
import { holesFor } from "@/lib/courses";
import { startRound } from "@/lib/round-actions";
import type { Nine } from "@/lib/types";

/**
 * Start a round: tees (required, remembered per course) and which holes, then one tap to the first hole.
 * Used on the Clubhouse (the home course, preselected) and on every course page.
 */
export function TeeOff({ course, rememberedTee, tone = "paper", label }: { course: Course; rememberedTee?: string; tone?: "paper" | "green"; label?: string }) {
  const router = useRouter();
  const [tee, setTee] = useState<string>(rememberedTee && course.tees.some((t) => t.name === rememberedTee) ? rememberedTee : course.tees[Math.min(1, course.tees.length - 1)].name);
  const [nine, setNine] = useState<Nine>("18");
  const [busy, setBusy] = useState(false);
  const nineHoles = course.holes.length === 9;
  const first = holesFor(course, nineHoles ? "18" : nine)[0].n;

  return (
    <div className="grid gap-6">
      <ChoiceGroup
        legend="Tees"
        hint="Your rating and slope come from the tees you play."
        layout="grid"
        value={tee}
        onChange={setTee}
        options={course.tees.map((t) => ({
          value: t.name,
          label: t.name,
          hint: `${t.yards.toLocaleString()} yds · ${t.rating.toFixed(1)} / ${t.slope}${t.source === "estimated" ? " (est.)" : ""}`,
          art: <svg width="22" height="22" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7.75" fill={t.color} stroke="var(--color-ink)" strokeWidth="1.5" /></svg>,
        }))}
      />
      {!nineHoles && (
        <ChoiceGroup
          legend="Holes"
          layout="row"
          size="sm"
          value={nine}
          onChange={setNine}
          options={[
            { value: "18", label: "All 18" },
            { value: "front", label: "Front 9" },
            { value: "back", label: "Back 9" },
          ]}
        />
      )}
      <div>
        <Button
          variant="primary"
          size="lg"
          tone={tone}
          block
          loading={busy}
          onClick={() => {
            setBusy(true);
            const id = startRound(course, tee, nineHoles ? "18" : nine);
            router.push(`/clubhouse/rounds/${id}/${first}`);
          }}
        >
          {label ?? `Tee off at hole ${first}`}
        </Button>
      </div>
    </div>
  );
}
