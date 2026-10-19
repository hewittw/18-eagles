"use client";
import type { Hole } from "@/lib/course-types";
import { SCORE_TYPES, scoreLabel, type ScoreType } from "@/lib/stats";
import { ChartFrame, fmtToPar } from "./chart-frame";

// Score types read like the traditional card: red for under par, ink for par, greens for over.
const typeFill: Record<ScoreType, string> = {
  albatross: "var(--color-under)", eagle: "var(--color-under)", birdie: "var(--color-under)",
  par: "var(--color-ink)", bogey: "var(--color-green)", double: "var(--color-green-3)", "triple+": "var(--color-ink-2)",
};
const typeOpacity: Record<ScoreType, number> = { albatross: 1, eagle: 1, birdie: 0.75, par: 1, bogey: 1, double: 1, "triple+": 0.7 };

/** One stacked bar of every hole played, by score type, with a labelled legend (never color alone). */
export function DistributionBar({ types, holes }: { types: Record<ScoreType, number>; holes: number }) {
  const shown = SCORE_TYPES.filter((t) => types[t] > 0);
  const pct = (t: ScoreType) => (holes ? (types[t] / holes) * 100 : 0);
  const parOrBetter = holes ? ((types.albatross + types.eagle + types.birdie + types.par) / holes) * 100 : 0;
  return (
    <ChartFrame
      title="Scoring mix"
      summary={holes ? `${holes} holes: ${Math.round(parOrBetter)}% par or better. ${shown.map((t) => `${scoreLabel[t]} ${types[t]}`).join(", ")}.` : "No holes match these filters yet."}
      table={{ columns: ["Score", "Holes", "Share"], rows: SCORE_TYPES.map((t) => [scoreLabel[t], types[t], `${Math.round(pct(t))}%`]) }}
    >
      <div className="flex h-10 w-full overflow-hidden rounded-sm ring-1 ring-rule" aria-hidden>
        {shown.map((t) => (
          <div key={t} style={{ width: `${pct(t)}%`, background: typeFill[t], opacity: typeOpacity[t] }} className="h-full border-r border-paper last:border-r-0" />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4" aria-hidden>
        {SCORE_TYPES.filter((t) => t !== "albatross" || types[t] > 0).map((t) => (
          <li key={t} className="flex items-center gap-2 text-ink">
            <span className="h-3 w-3 shrink-0 rounded-[2px]" style={{ background: typeFill[t], opacity: typeOpacity[t] }} />
            <span>{scoreLabel[t]}</span>
            <span className="ml-auto font-numeral tabular-nums text-ink-2">{types[t]}</span>
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}

/** Average strokes over par on par 3s, 4s, and 5s. */
export function ParTypeBars({ byPar }: { byPar: Record<3 | 4 | 5, number | null> }) {
  const vals = ([3, 4, 5] as const).map((p) => byPar[p]);
  const max = Math.max(1, ...vals.map((v) => Math.abs(v ?? 0)));
  const known = ([3, 4, 5] as const).filter((p) => byPar[p] != null);
  const worst = known.length ? known.reduce((a, b) => ((byPar[b] ?? 0) > (byPar[a] ?? 0) ? b : a)) : null;
  const best = known.length ? known.reduce((a, b) => ((byPar[b] ?? 0) < (byPar[a] ?? 0) ? b : a)) : null;
  return (
    <ChartFrame
      title="Par 3s, 4s, and 5s"
      summary={known.length ? `Average per hole: ${known.map((p) => `par ${p}s ${fmtToPar(byPar[p]!)}`).join(", ")}. ${best !== worst ? `Strongest on par ${best}s, most to gain on par ${worst}s.` : ""}` : "No holes match these filters yet."}
      table={{ columns: ["Hole type", "Average to par"], rows: ([3, 4, 5] as const).map((p) => [`Par ${p}`, byPar[p] == null ? "—" : fmtToPar(byPar[p]!)]) }}
    >
      <ul className="grid gap-4" aria-hidden>
        {([3, 4, 5] as const).map((p) => (
          <li key={p} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3">
            <span className="text-sm text-ink">Par {p}s</span>
            <span className="relative h-7 rounded-sm bg-paper-3">
              <span className="absolute inset-y-0 left-0 rounded-sm bg-green" style={{ width: `${((byPar[p] == null ? 0 : Math.max(0, byPar[p]!)) / max) * 100}%` }} />
            </span>
            <span className="text-right font-numeral text-lg tabular-nums text-ink">{byPar[p] == null ? "—" : fmtToPar(byPar[p]!)}</span>
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}

/** How often each club is used, and how often the tee club finds the fairway. */
export function ClubUsage({ clubs }: { clubs: { club: { id: string; name: string; short: string }; shots: number; teeShots: number; fairwayHit: number; fairwayTries: number }[] }) {
  const sorted = [...clubs].sort((a, b) => b.shots - a.shots);
  const max = Math.max(1, ...sorted.map((c) => c.shots));
  const total = sorted.reduce((a, c) => a + c.shots, 0);
  return (
    <ChartFrame
      title="Clubs"
      summary={sorted.length ? `${total} shots logged with clubs. Most used: ${sorted.slice(0, 3).map((c) => `${c.club.name} (${c.shots})`).join(", ")}.` : "Tap clubs on the hole screen and they'll show up here, with how often each tee club finds the fairway."}
      table={{ columns: ["Club", "Shots", "Tee shots", "Fairways from the tee"], rows: sorted.map((c) => [c.club.name, c.shots, c.teeShots, c.fairwayTries ? `${c.fairwayHit} of ${c.fairwayTries}` : "—"]) }}
    >
      <ul className="grid gap-2" aria-hidden>
        {sorted.map((c) => (
          <li key={c.club.id} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 text-sm">
            <span className="font-numeral text-ink">{c.club.short}</span>
            <span className="relative h-5 rounded-sm bg-paper-3">
              <span className="absolute inset-y-0 left-0 rounded-sm bg-green-3" style={{ width: `${(c.shots / max) * 100}%` }} />
            </span>
            <span className="w-28 text-right font-numeral tabular-nums text-ink-2">
              {c.shots}{c.fairwayTries ? ` · ${Math.round((c.fairwayHit / c.fairwayTries) * 100)}% fwy` : ""}
            </span>
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}

/** One course, hole by hole: average to par as a tinted cell, worst holes stand out. Also a real table. */
export function HoleHeat({ rows, courseName }: { rows: { hole: Hole; avgToPar: number; n: number; best: number }[]; courseName: string }) {
  const played = rows.filter((r) => r.n > 0);
  const hardest = [...played].sort((a, b) => b.avgToPar - a.avgToPar).slice(0, 3);
  const tint = (v: number) => (v <= -0.5 ? "var(--color-under)" : v < 0.25 ? "var(--color-paper-3)" : v < 0.75 ? "color-mix(in oklab, var(--color-green) 30%, var(--color-paper))" : v < 1.5 ? "color-mix(in oklab, var(--color-green) 60%, var(--color-paper))" : "var(--color-green-3)");
  // Paper text only on the two dark tints (red, Locker Green); ink on the mid tints, where paper would fall under 4.5:1.
  const textOn = (v: number) => (v <= -0.5 || v >= 1.5 ? "var(--color-on-green)" : "var(--color-ink)");
  return (
    <ChartFrame
      title={`Hole by hole at ${courseName}`}
      summary={played.length ? `Your toughest holes here: ${hardest.map((r) => `${r.hole.n}${r.hole.name ? ` (${r.hole.name})` : ""} ${fmtToPar(r.avgToPar)}`).join(", ")}.` : "Play this course to see each hole."}
      table={{ columns: ["Hole", "Par", "Times played", "Average to par", "Best"], rows: rows.map((r) => [r.hole.name ? `${r.hole.n} · ${r.hole.name}` : r.hole.n, r.hole.par, r.n, r.n ? fmtToPar(r.avgToPar) : "—", r.n ? r.best : "—"]) }}
    >
      <ol className="grid grid-cols-6 gap-1.5 sm:grid-cols-9" aria-hidden>
        {rows.map((r) => (
          <li key={r.hole.n} className="flex aspect-square flex-col items-center justify-center rounded-sm text-center" style={{ background: r.n ? tint(r.avgToPar) : "transparent", color: r.n ? textOn(r.avgToPar) : "var(--color-ink-2)", outline: r.n ? undefined : "1px dashed var(--color-rule-strong)" }}>
            <span className="text-[11px] leading-none opacity-80">{r.hole.n}</span>
            <span className="mt-1 font-numeral text-base leading-none tabular-nums">{r.n ? fmtToPar(r.avgToPar) : "·"}</span>
          </li>
        ))}
      </ol>
    </ChartFrame>
  );
}
