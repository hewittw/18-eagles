// ✦ Artifacts drawn in code for the mood board. All original: no marks, logos, or crests borrowed.
import { palette, pairs, contrast, threshold } from "./palette";

/* ───────────────────────── Scorecard specimen ───────────────────────── */

// The Old Course, St Andrews, front nine from the Black tee (from src/data/courses/st-andrews-old.json).
const OLD_FRONT = [
  { n: 1, name: "Burn", par: 4, yds: 376, hcp: 10, score: 4, putts: 2 },
  { n: 2, name: "Dyke", par: 4, yds: 411, hcp: 6, score: 3, putts: 1 },
  { n: 3, name: "Cartgate", par: 4, yds: 370, hcp: 16, score: 4, putts: 2 },
  { n: 4, name: "Ginger Beer", par: 4, yds: 419, hcp: 8, score: 5, putts: 2 },
  { n: 5, name: "Hole O'Cross", par: 5, yds: 514, hcp: 2, score: 3, putts: 1 },
  { n: 6, name: "Heathery", par: 4, yds: 374, hcp: 12, score: 4, putts: 2 },
  { n: 7, name: "High", par: 4, yds: 359, hcp: 4, score: 6, putts: 3 },
  { n: 8, name: "Short", par: 3, yds: 166, hcp: 14, score: 2, putts: 1 },
  { n: 9, name: "End", par: 4, yds: 347, hcp: 18, score: 4, putts: 2 },
];

function scoreName(score: number, par: number) {
  const d = score - par;
  if (d <= -2) return "eagle";
  if (d === -1) return "birdie";
  if (d === 0) return "par";
  if (d === 1) return "bogey";
  return "double bogey";
}

/** The traditional marks: circle under par, square over; doubled for two or more. Shape, not color, carries it. */
export function ScoreMark({ score, par, size = "md" }: { score: number; par: number; size?: "md" | "lg" }) {
  const d = score - par;
  const box = size === "lg" ? "h-11 w-11 text-[1.35rem]" : "h-8 w-8 text-[1.1rem]";
  const shape = d < 0 ? "rounded-full" : "rounded-none";
  const ring = d === 0 ? "" : "border-[1.5px] border-(--mb-ink)";
  const dbl = Math.abs(d) >= 2 ? "outline-[1.5px] outline-solid outline-(--mb-ink) outline-offset-2" : "";
  const color = d < 0 ? "text-(--mb-red)" : "text-(--mb-ink)";
  return (
    <span className={`inline-flex items-center justify-center f-text italic leading-none ${box} ${shape} ${ring} ${dbl} ${color}`}>
      <span aria-hidden="true">{score}</span>
      <span className="sr-only">
        {score}, {scoreName(score, par)}
      </span>
    </span>
  );
}

export function ScorecardSpecimen() {
  const out = OLD_FRONT.reduce((a, h) => ({ yds: a.yds + h.yds, par: a.par + h.par, score: a.score + h.score, putts: a.putts + h.putts }), { yds: 0, par: 0, score: 0, putts: 0 });
  const th = "px-2 py-2 text-left caps text-[0.75rem] text-(--mb-pencil) font-semibold whitespace-nowrap";
  const td = "px-1 py-2 text-center num";
  return (
    <div className="tex-paper border border-(--mb-ink) p-3 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-(--mb-ink) pb-3">
        <p className="f-display text-2xl sm:text-3xl">The Old Course</p>
        <p className="caps text-[0.75rem] text-(--mb-pencil)">Black tees · 6,721 yds · Rating 73.1 · Slope 132</p>
      </div>
      <div className="relative overflow-x-auto" role="region" aria-label="Scorecard specimen, scrolls sideways on small screens" tabIndex={0}>
        <table className="mt-1 w-full min-w-[640px] border-collapse">
          <caption className="sr-only">
            Scorecard specimen: the front nine at the Old Course, St Andrews, with traditional score marks. Out in 35, one under par.
          </caption>
          <thead>
            <tr className="border-b border-(--mb-ink)">
              <th scope="row" className={th}>Hole</th>
              {OLD_FRONT.map((h) => (
                <th key={h.n} scope="col" className="px-1 py-2 text-center f-cond text-lg font-semibold">
                  {h.n}
                </th>
              ))}
              <th scope="col" className="px-2 py-2 text-center caps text-[0.8rem] bg-(--mb-locker) text-(--mb-paper)">Out</th>
            </tr>
          </thead>
          <tbody className="f-cond text-[1.05rem]">
            <tr className="border-b border-(--mb-hair)">
              <th scope="row" className={th}>Name</th>
              {OLD_FRONT.map((h) => (
                <td key={h.n} className="px-1 py-2 text-center f-text italic text-[0.8rem] leading-tight text-(--mb-pencil)">{h.name}</td>
              ))}
              <td className={td} />
            </tr>
            <tr className="border-b border-(--mb-hair)">
              <th scope="row" className={th}>Black</th>
              {OLD_FRONT.map((h) => <td key={h.n} className={td}>{h.yds}</td>)}
              <td className={`${td} font-semibold`}>{out.yds.toLocaleString("en-US")}</td>
            </tr>
            <tr className="border-b border-(--mb-hair) text-(--mb-pencil)">
              <th scope="row" className={th}>Handicap</th>
              {OLD_FRONT.map((h) => <td key={h.n} className={td}>{h.hcp}</td>)}
              <td className={td} />
            </tr>
            <tr className="border-b border-(--mb-ink) tex-linen">
              <th scope="row" className={th}>Par</th>
              {OLD_FRONT.map((h) => <td key={h.n} className={`${td} font-semibold`}>{h.par}</td>)}
              <td className={`${td} font-semibold`}>{out.par}</td>
            </tr>
            <tr className="border-b border-(--mb-hair)">
              <th scope="row" className={th}>Score</th>
              {OLD_FRONT.map((h) => (
                <td key={h.n} className="px-1 py-3 text-center">
                  <ScoreMark score={h.score} par={h.par} />
                </td>
              ))}
              <td className="px-1 py-3 text-center f-text italic text-xl text-(--mb-red)">
                {out.score}
              </td>
            </tr>
            <tr>
              <th scope="row" className={th}>Putts</th>
              {OLD_FRONT.map((h) => <td key={h.n} className={`${td} text-(--mb-pencil)`}>{h.putts}</td>)}
              <td className={`${td} text-(--mb-pencil)`}>{out.putts}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-t border-(--mb-hair) pt-4 text-sm">
        {[
          ["Eagle", 3, 5],
          ["Birdie", 3, 4],
          ["Par", 4, 4],
          ["Bogey", 5, 4],
          ["Double", 6, 4],
        ].map(([label, s, p]) => (
          <div key={label as string} className="flex items-center gap-2">
            <dt className="order-2 caps text-[0.75rem] text-(--mb-pencil)">{label}</dt>
            <dd className="order-1" aria-hidden="true">
              <ScoreMark score={s as number} par={p as number} />
            </dd>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <dt className="caps text-[0.75rem] text-(--mb-pencil)">Attest</dt>
          <dd className="f-text italic text-(--mb-pencil) border-b border-(--mb-pencil) min-w-28 pb-0.5">the marker</dd>
        </div>
      </dl>
    </div>
  );
}

/* ───────────────────────── Leaderboard tiles ───────────────────────── */

type BoardRow = { name: string; to: number[] };
// Running score to par after each hole, front nine. Old Course from the specimen above; the others are sample rounds.
const BOARD: BoardRow[] = [
  { name: "Old Course", to: [0, -1, -1, 0, -2, -2, 0, -1, -1] },
  { name: "Pinehurst 2", to: [0, 1, 1, 2, 1, 1, 1, 2, 2] },
  { name: "Rancho S.F.", to: [1, 1, 1, 2, 3, 3, 3, 3, 4] },
];
const BOARD_PAR = [4, 4, 4, 4, 5, 4, 4, 3, 4];

function toParText(v: number) {
  return v === 0 ? "E" : v < 0 ? `−${-v}` : `${v}`;
}
function toParSpoken(v: number) {
  return v === 0 ? "even" : v < 0 ? `${-v} under` : `${v} over`;
}

export function LeaderboardTiles() {
  return (
    <div className="tex-locker on-dark p-3 sm:p-6">
      <div className="mx-auto max-w-5xl border-[6px] border-(--mb-tile) bg-(--mb-tile) p-1.5 sm:p-3">
        <p className="text-center text-(--mb-ink) f-cond text-[clamp(1.6rem,4vw,3rem)] font-bold uppercase tracking-[0.28em] leading-none pb-2 sm:pb-3 border-b-2 border-(--mb-ink)">
          Your Last Rounds
        </p>
        <div className="relative overflow-x-auto" role="region" aria-label="Leaderboard tiles, scrolls sideways on small screens" tabIndex={0}>
          <table className="mt-2 w-full min-w-[560px] border-separate border-spacing-[3px]">
            <caption className="sr-only">
              Leaderboard specimen: running score to par after each hole for the golfer&apos;s last three rounds.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="tile text-left px-2 py-1.5 text-[clamp(0.9rem,1.6vw,1.35rem)] uppercase tracking-[0.12em]">Hole</th>
                {BOARD_PAR.map((_, i) => (
                  <th key={i} scope="col" className="tile w-[8%] py-1.5 text-[clamp(1rem,1.9vw,1.6rem)]">{i + 1}</th>
                ))}
              </tr>
              <tr>
                <th scope="row" className="tile text-left px-2 py-1.5 text-[clamp(0.9rem,1.6vw,1.35rem)] uppercase tracking-[0.12em]">Par</th>
                {BOARD_PAR.map((p, i) => (
                  <td key={i} className="tile py-1.5 text-center text-[clamp(1rem,1.9vw,1.6rem)]">{p}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOARD.map((r, ri) => (
                <tr key={r.name}>
                  <th scope="row" className="tile text-left px-2 py-2 text-[clamp(0.95rem,1.8vw,1.5rem)] uppercase tracking-[0.06em] whitespace-nowrap">
                    {r.name}
                  </th>
                  {r.to.map((v, i) => (
                    <td
                      key={i}
                      className={`tile hang py-2 text-center text-[clamp(1.1rem,2.2vw,1.9rem)] ${v < 0 ? "text-(--mb-red)" : "text-(--mb-ink)"}`}
                      style={{ animationDelay: `${(ri * 9 + i) * 28}ms` }}
                    >
                      <span aria-hidden="true">{toParText(v)}</span>
                      <span className="sr-only">{toParSpoken(v)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-5xl caps text-[0.75rem] text-(--mb-linen)">
        Thru 9 · red is under par, and it always carries the minus sign
      </p>
    </div>
  );
}

/* ───────────────────────── Type specimens ───────────────────────── */

export function TypeDisplay() {
  return (
    <div className="tex-paper border border-(--mb-hair) p-6 sm:p-8">
      <p className="caps text-[0.75rem] text-(--mb-old-brass)">Display · Libre Caslon Display 400</p>
      <p className="f-display mt-4 text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95]">The Old Course</p>
      <p className="f-display mt-3 text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-(--mb-fairway)">Hole No. 17, the Road</p>
      <p className="f-display mt-6 text-[clamp(2.2rem,4vw,3.4rem)] leading-none tracking-normal" aria-label="Sample glyphs: A a, G g, R r, ampersand, 1929">
        Aa Gg Rr &amp; 1929
      </p>
      <p className="mt-6 border-t border-(--mb-hair) pt-3 text-sm text-(--mb-pencil)">
        Headings and the handicap only, 28px and up. Never bold, never tracked tight. Caslon is the type of
        old club minutes and engraved trophies, which is about as far from Masters and RSF branding as a serif gets.
      </p>
    </div>
  );
}

export function TypeText() {
  return (
    <div className="tex-linen border border-(--mb-hair) p-6 sm:p-8">
      <p className="caps text-[0.75rem] text-(--mb-old-brass)">Text · Libre Caslon Text 400 / italic / 700</p>
      <p className="f-text mt-4 text-[1.1rem] leading-relaxed">
        Out in 35 with an eagle at Hole O&apos;Cross. Gave two back at the High hole, where the wind came off the
        estuary and the Strath bunker took the second.
      </p>
      <p className="f-text italic mt-4 text-[1.2rem] leading-relaxed text-(--mb-slate)">
        “Club up into the wind. Never long on seven.”
      </p>
      <p className="mt-1 caps text-[0.75rem] text-(--mb-pencil)">Hole note, as the golfer wrote it</p>
      <p className="mt-6 border-t border-(--mb-hair) pt-3 text-sm text-(--mb-pencil)">
        Italic is the golfer&apos;s own voice: hole notes, round notes, the pencil on the card. Roman serif goes on
        course blurbs and summaries, 17px and up.
      </p>
    </div>
  );
}

export function TypeNumerals() {
  return (
    <div className="tex-paper border border-(--mb-hair) p-6 sm:p-8">
      <p className="caps text-[0.75rem] text-(--mb-old-brass)">Numerals &amp; UI · Barlow Condensed / Barlow</p>
      <p className="f-cond mt-3 text-[clamp(3.4rem,6vw,5rem)] font-semibold leading-none tracking-tight" aria-label="Numerals 0 through 9">
        0123456789
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
        {["4", "3", "5", "E", "−1", "12"].map((t, i) => (
          <span key={i} className={`tile inline-flex h-12 min-w-11 items-center justify-center px-2 text-2xl ${t.startsWith("−") ? "text-(--mb-red)" : ""}`}>
            {t}
          </span>
        ))}
      </div>
      <p className="caps mt-5 text-[0.8rem] text-(--mb-pencil)">Hole · Par · Yds · Hcp · Putts · Fwy · GIR</p>
      <p className="f-sans mt-3 text-[1rem]">
        Barlow 400 carries the interface: labels, buttons, filters, table text. <span className="font-semibold">Start a round</span>,{" "}
        <span className="font-medium">Undo last shot</span>, <span className="font-medium">Show 2026 only</span>.
      </p>
      <p className="mt-6 border-t border-(--mb-hair) pt-3 text-sm text-(--mb-pencil)">
        Condensed, tabular, and lining: built for tiles, tables, and thumbs. It reads like painted board numerals
        without being the board&apos;s face.
      </p>
    </div>
  );
}

/* ───────────────────────── Palette ───────────────────────── */

export function PaletteBoard() {
  const order = ["paper", "linen", "tile", "ink", "pencil", "locker", "fairway", "brass", "oldBrass", "red", "slate"] as const;
  return (
    <div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-px border border-(--mb-ink) bg-(--mb-ink)">
        {order.map((k) => {
          const s = palette[k];
          const onDark = ["ink", "locker", "fairway", "red", "slate", "oldBrass", "pencil"].includes(k);
          const fg = onDark ? palette.paper.hex : palette.ink.hex;
          return (
            <li key={k} className="flex min-h-44 flex-col justify-between p-4" style={{ background: s.hex, color: fg }}>
              <span className="f-display text-[1.35rem] leading-tight">{s.name}</span>
              <span>
                <span className="block f-cond text-lg font-semibold tracking-wide">{s.hex}</span>
                <span className="block text-[0.8rem] leading-snug opacity-95">{s.role}</span>
                <span className="mt-1 block caps text-[0.7rem]">
                  {contrast(fg, s.hex).toFixed(2)}:1 label
                </span>
              </span>
            </li>
          );
        })}
        <li className="flex min-h-44 flex-col justify-between p-4 tex-paper">
          <span className="caps text-[0.75rem] text-(--mb-red)">Never</span>
          <span>
            <span className="block f-display text-[1.35rem] leading-tight text-(--mb-ink)">
              <span className="mr-2 inline-block h-4 w-8 align-middle" style={{ background: palette.brass.hex }} aria-hidden="true" />
              Brass text on paper
            </span>
            <span className="block text-[0.8rem] leading-snug text-(--mb-pencil)">
              {contrast(palette.brass.hex, palette.paper.hex).toFixed(2)}:1 fails, so brass-colored text on paper is set in Old Brass.
            </span>
          </span>
        </li>
      </ul>
      <div className="relative mt-6 overflow-x-auto" role="region" aria-label="Measured contrast pairs" tabIndex={0}>
        <table className="w-full min-w-[620px] border-collapse text-left text-[0.9rem]">
          <caption className="text-left caps text-[0.75rem] text-(--mb-pencil) pb-2">
            Every pair the app intends to use, measured by palette.ts (WCAG 2.x)
          </caption>
          <thead>
            <tr className="border-b border-(--mb-ink)">
              <th scope="col" className="py-2 pr-3 caps text-[0.75rem]">Sample</th>
              <th scope="col" className="py-2 pr-3 caps text-[0.75rem]">Pair</th>
              <th scope="col" className="py-2 pr-3 caps text-[0.75rem]">Use</th>
              <th scope="col" className="py-2 pr-3 caps text-[0.75rem] text-right">Ratio</th>
              <th scope="col" className="py-2 caps text-[0.75rem] text-right">Needs</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((p, i) => {
              const f = palette[p.fg], b = palette[p.bg];
              const r = contrast(f.hex, b.hex);
              return (
                <tr key={i} className="border-b border-(--mb-hair)">
                  <td className="py-1.5 pr-3">
                    <span className="inline-block px-2 py-0.5 f-cond font-semibold" style={{ background: b.hex, color: f.hex, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / .15)" }}>
                      Aa 12.4
                    </span>
                  </td>
                  <td className="py-1.5 pr-3 whitespace-nowrap">{f.name} on {b.name}</td>
                  <td className="py-1.5 pr-3 text-(--mb-pencil)">{p.use}</td>
                  <td className="py-1.5 pr-3 text-right f-cond text-[1.05rem] font-semibold">{r.toFixed(2)}:1</td>
                  <td className="py-1.5 text-right f-cond text-[1.05rem] text-(--mb-pencil)">
                    {threshold[p.kind]}:1 {r >= threshold[p.kind] ? "pass" : "fail"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────── Yardage-book hole drawing ───────────────────────── */

export function YardageDrawing() {
  // Scale: 1.2px per yard. Green centre at (180, 96); tee at the bottom, 428 yards away.
  const gx = 180, gy = 96, k = 1.2;
  const arc = (yd: number) => {
    const r = yd * k;
    return `M ${gx - r * 0.55} ${gy + r * Math.sqrt(1 - 0.55 ** 2)} A ${r} ${r} 0 0 0 ${gx + r * 0.55} ${gy + r * Math.sqrt(1 - 0.55 ** 2)}`;
  };
  const trees: [number, number, number][] = [
    [38, 160, 15], [60, 190, 12], [30, 238, 17], [52, 300, 13], [26, 360, 15], [48, 420, 12], [330, 230, 13], [312, 330, 13], [334, 372, 16], [306, 452, 12], [328, 506, 15], [40, 520, 14], [70, 70, 13], [292, 60, 14],
  ];
  return (
    <figure className="m-0">
      <svg viewBox="0 0 360 680" className="w-full h-auto" role="img" aria-labelledby="yd-t yd-d">
        <title id="yd-t">Yardage-book drawing of a par 4, 428 yards</title>
        <desc id="yd-d">
          Plan view drawn like a caddie&apos;s yardage book. The tee is at the bottom, and the fairway doglegs slightly
          left past two bunkers and a creek at 250 yards to a green guarded front-left by sand. Dotted arcs mark 100, 150
          and 200 yards to the centre of the green, and a pencil note reads: miss right, never long.
        </desc>
        <defs>
          <pattern id="yd-sand" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#EADFC2" />
            <circle cx="1.5" cy="1.5" r=".7" fill="#9B8B66" />
            <circle cx="4.5" cy="4.2" r=".6" fill="#9B8B66" />
          </pattern>
          <pattern id="yd-rough" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#DCDDC6" />
            <path d="M1 7 l1 -2 M5 3 l1 -2" stroke="#8E9A7C" strokeWidth=".6" />
          </pattern>
          <pattern id="yd-water" width="10" height="5" patternUnits="userSpaceOnUse">
            <rect width="10" height="5" fill="#B9C7CB" />
            <path d="M0 3 q2.5 -2 5 0 t5 0" stroke={palette.slate.hex} strokeWidth=".6" fill="none" />
          </pattern>
        </defs>
        <rect width="360" height="680" fill="url(#yd-rough)" />
        {/* creek crossing at ~250 to the green */}
        <path d="M0 330 C 80 316, 120 350, 190 338 S 300 318, 360 336 L 360 352 C 300 334, 250 360, 190 354 S 80 332, 0 346 Z" fill="url(#yd-water)" stroke={palette.slate.hex} strokeWidth="1" />
        {/* fairway */}
        <path
          d="M146 610 C 118 540, 104 470, 112 410 C 120 350, 128 300, 134 250 C 140 200, 148 168, 160 148 L 208 148 C 224 180, 228 222, 224 262 C 216 322, 214 380, 222 430 C 232 492, 238 552, 222 610 Z"
          fill="#A9BD9C" stroke={palette.fairway.hex} strokeWidth="1.2"
        />
        {/* mowing stripes */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path key={i} d={`M120 ${590 - i * 55} L 225 ${570 - i * 55}`} stroke="#fff" strokeOpacity=".22" strokeWidth="14" clipPath="url(#yd-fw)" />
        ))}
        <clipPath id="yd-fw">
          <path d="M146 610 C 118 540, 104 470, 112 410 C 120 350, 128 300, 134 250 C 140 200, 148 168, 160 148 L 208 148 C 224 180, 228 222, 224 262 C 216 322, 214 380, 222 430 C 232 492, 238 552, 222 610 Z" />
        </clipPath>
        {/* fairway bunkers */}
        <path d="M100 410 c 6 -18 26 -22 32 -6 c 4 12 -6 26 -18 24 c -10 -2 -16 -8 -14 -18 z" fill="url(#yd-sand)" stroke="#7E6E4A" strokeWidth="1" />
        <path d="M214 452 c 10 -10 30 -6 30 8 c 0 14 -18 20 -28 14 c -6 -4 -6 -16 -2 -22 z" fill="url(#yd-sand)" stroke="#7E6E4A" strokeWidth="1" />
        {/* trees */}
        {trees.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#6F8A6A" stroke={palette.locker.hex} strokeWidth=".8" />
            <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff" opacity=".14" />
          </g>
        ))}
        {/* green: fringe, surface, pin */}
        <ellipse cx={gx} cy={gy} rx="44" ry="34" fill="#93AE8B" stroke={palette.fairway.hex} strokeWidth="1" />
        <ellipse cx={gx + 2} cy={gy - 1} rx="36" ry="27" fill="#7FA07A" stroke={palette.locker.hex} strokeWidth="1.2" />
        <path d="M150 128 c -16 -2 -26 -18 -16 -30 c 8 -8 20 -2 22 8 c 2 10 2 18 -6 22 z" fill="url(#yd-sand)" stroke="#7E6E4A" strokeWidth="1" />
        <path d="M212 70 c 12 -8 26 -2 24 10 c -2 8 -14 10 -22 6 z" fill="url(#yd-sand)" stroke="#7E6E4A" strokeWidth="1" />
        <line x1={gx + 8} y1={gy + 4} x2={gx + 8} y2={gy - 22} stroke={palette.ink.hex} strokeWidth="1.2" />
        <path d={`M${gx + 8} ${gy - 22} l 12 4 l -12 4 z`} fill={palette.red.hex} />
        <circle cx={gx + 8} cy={gy + 4} r="1.6" fill={palette.ink.hex} />
        {/* tee boxes */}
        {[[168, 640], [174, 612]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="26" height="12" fill="#A9BD9C" stroke={palette.locker.hex} strokeWidth="1" />
        ))}
        {/* distance arcs */}
        {[100, 150, 200].map((yd) => (
          <g key={yd}>
            <path d={arc(yd)} fill="none" stroke={palette.ink.hex} strokeWidth="1" strokeDasharray="2 4" />
            <text x={gx - yd * k * 0.55 - 30} y={gy + yd * k * Math.sqrt(1 - 0.3025) + 5} className="f-cond" fontSize="15" fontWeight="600" fill={palette.ink.hex}>
              {yd}
            </text>
          </g>
        ))}
        {/* carry callouts */}
        <g className="f-cond" fontSize="14" fontWeight="600" fill={palette.ink.hex}>
          <text x="62" y="426">274</text>
          <text x="250" y="482">236</text>
          <text x="236" y="374" fill={palette.slate.hex}>
            to carry 251
          </text>
        </g>
        {/* the pencil note */}
        <g className="f-text" fontStyle="italic" fill={palette.slate.hex}>
          <text x="240" y="150" fontSize="17">miss right,</text>
          <text x="240" y="170" fontSize="17">never long</text>
          <path d="M238 140 c -8 -10 -10 -18 -14 -30" fill="none" stroke={palette.slate.hex} strokeWidth="1" />
        </g>
        {/* title block */}
        <rect x="12" y="12" width="112" height="62" fill={palette.paper.hex} stroke={palette.ink.hex} />
        <text x="22" y="40" className="f-display" fontSize="24" fill={palette.ink.hex}>No. 5</text>
        <text x="22" y="60" className="f-cond" fontSize="15" fontWeight="600" letterSpacing="1.4" fill={palette.pencil.hex}>PAR 4 · 428</text>
        {/* north arrow */}
        <g transform="translate(330 640)">
          <path d="M0 -16 L 6 6 L 0 2 L -6 6 Z" fill={palette.ink.hex} />
          <text x="-5" y="24" className="f-cond" fontSize="15" fontWeight="600" fill={palette.ink.hex}>N</text>
        </g>
      </svg>
    </figure>
  );
}

/* ───────────────────────── Brass nameplates ───────────────────────── */

function Screw({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`absolute h-2.5 w-2.5 rounded-full ${className}`} style={{ background: "radial-gradient(circle at 35% 35%, #f1dfb2, #8a6a2c 70%)", boxShadow: "inset 0 0 0 .5px rgb(0 0 0 / .4)" }}>
      <span className="absolute left-1/2 top-[15%] h-[70%] w-px -translate-x-1/2 rotate-45 bg-[#5a4317]" />
    </span>
  );
}

export function Nameplates() {
  return (
    <div className="tex-locker on-dark flex flex-col items-center justify-center gap-6 px-5 py-10 sm:px-8">
      {/* locker door slats */}
      <div className="w-full max-w-md border border-(--mb-brass)/40 p-4">
        <div className="grid grid-cols-6 gap-1.5" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => <span key={i} className="h-1.5 rounded-full bg-black/35 shadow-[0_1px_0_rgb(255_255_255/.08)]" />)}
        </div>
        <div className="brass-plate relative mx-auto mt-6 max-w-xs px-8 py-4 text-center">
          <Screw className="left-2 top-1/2 -translate-y-1/2" />
          <Screw className="right-2 top-1/2 -translate-y-1/2" />
          <p className="caps text-[0.75rem] tracking-[0.3em]" style={{ textShadow: "0 1px 0 rgb(255 255 255 / .35)" }}>Locker No. 18</p>
          <p className="f-display mt-1 text-[1.9rem] leading-none tracking-[0.06em] uppercase" style={{ textShadow: "0 1px 0 rgb(255 255 255 / .35)" }}>
            The Member
          </p>
        </div>
      </div>
      <div className="brass-plate relative w-full max-w-sm px-8 py-3 text-center">
        <Screw className="left-2 top-2" />
        <Screw className="right-2 top-2" />
        <Screw className="left-2 bottom-2" />
        <Screw className="right-2 bottom-2" />
        <p className="caps text-[0.7rem] tracking-[0.3em]">Low Round</p>
        <p className="f-cond text-[2.4rem] font-semibold leading-none">79</p>
        <p className="f-text italic text-[0.95rem]">The Old Course · 12 Oct 2026</p>
      </div>
    </div>
  );
}

/* ───────────────────────── Monogram ───────────────────────── */

export function Monogram({ size = 260, decorative = false }: { size?: number; decorative?: boolean }) {
  const ring = "EIGHTEEN EAGLES · THE MEMBERS' LEDGER · ";
  return (
    <svg
      viewBox="0 0 260 260"
      width={size}
      height={size}
      className="h-auto max-w-full"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Original monogram: an 18 above a Caslon E inside a rope ring, with a small pennant" })}
    >
      <defs>
        <path id="mono-ring" d="M130 130 m -98 0 a 98 98 0 1 1 196 0 a 98 98 0 1 1 -196 0" />
      </defs>
      <circle cx="130" cy="130" r="124" fill={palette.locker.hex} />
      <circle cx="130" cy="130" r="118" fill="none" stroke={palette.brass.hex} strokeWidth="1.5" />
      <circle cx="130" cy="130" r="80" fill="none" stroke={palette.brass.hex} strokeWidth="1" />
      {/* rope */}
      <circle cx="130" cy="130" r="84" fill="none" stroke={palette.brass.hex} strokeWidth="3" strokeDasharray="1.2 3.2" strokeLinecap="round" />
      <text className="f-cond" fontSize="15" fontWeight="600" fill={palette.brass.hex}>
        <textPath href="#mono-ring" startOffset="0" textLength="606" lengthAdjust="spacing">{ring}</textPath>
      </text>
      <text x="130" y="102" textAnchor="middle" className="f-cond" fontSize="22" fontWeight="600" letterSpacing="4" fill={palette.brass.hex}>18</text>
      <text x="130" y="180" textAnchor="middle" className="f-display" fontSize="96" fill={palette.paper.hex}>E</text>
      {/* pennant on the E's spine */}
      <line x1="171" y1="110" x2="171" y2="76" stroke={palette.brass.hex} strokeWidth="1.5" />
      <path d="M171 76 l 14 5 l -14 5 z" fill={palette.red.hex} />
      <line x1="104" y1="194" x2="156" y2="194" stroke={palette.brass.hex} strokeWidth="1" />
    </svg>
  );
}

/* ───────────────────────── Textures ───────────────────────── */

export function PaperSwatch() {
  return (
    <div className="relative aspect-[4/3] md:aspect-[4/5] border border-(--mb-hair) tex-paper">
      <div className="absolute inset-4 border border-dashed border-(--mb-pencil)/60" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-16 w-16 bg-(--mb-linen)" style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} aria-hidden="true" />
      <p className="absolute left-6 top-6 caps text-[0.75rem] text-(--mb-old-brass)">Scorecard Paper</p>
      <p className="absolute left-6 top-11 f-cond text-lg font-semibold">#F5F0E4 + fibre</p>
    </div>
  );
}

export function LinenSwatch() {
  return (
    <div className="relative aspect-[4/3] md:aspect-[4/5] tex-linen border border-(--mb-hair)">
      <div className="absolute inset-x-6 bottom-6 bg-(--mb-locker) px-3 py-2 text-center on-dark outline outline-1 outline-dashed outline-(--mb-brass) -outline-offset-4">
        <p className="caps text-[0.7rem] text-(--mb-brass)">Woven label</p>
        <p className="f-text italic text-[0.95rem] text-(--mb-paper)">kept since the first round</p>
      </div>
      <p className="absolute left-6 top-6 caps text-[0.75rem] text-(--mb-old-brass)">Linen</p>
      <p className="absolute left-6 top-11 f-cond text-lg font-semibold">#E8E0CC + weave</p>
    </div>
  );
}

/* ───────────────────────── Engraved round certificate ───────────────────────── */

function guilloche(w: number, h: number, inset: number, waves: number, amp: number, phase: number) {
  // A sine wave run around a rounded rectangle: the security-printing border, generated.
  const pts: string[] = [];
  const P = 2 * (w - 2 * inset) + 2 * (h - 2 * inset);
  const N = 900;
  for (let i = 0; i <= N; i++) {
    const s = (i / N) * P;
    let x: number, y: number, nx: number, ny: number;
    const W = w - 2 * inset, H = h - 2 * inset;
    if (s < W) { x = inset + s; y = inset; nx = 0; ny = -1; }
    else if (s < W + H) { x = w - inset; y = inset + (s - W); nx = 1; ny = 0; }
    else if (s < 2 * W + H) { x = w - inset - (s - W - H); y = h - inset; nx = 0; ny = 1; }
    else { x = inset; y = h - inset - (s - 2 * W - H); nx = -1; ny = 0; }
    const o = amp * Math.sin((s / P) * Math.PI * 2 * waves + phase);
    pts.push(`${(x + nx * o).toFixed(1)},${(y + ny * o).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}
const G = Array.from({ length: 7 }, (_, i) => guilloche(420, 540, 20, 84, 7, (i * Math.PI) / 7));

export function RoundCertificate() {
  return (
    <div className="tex-paper border border-(--mb-hair) p-2">
      <svg viewBox="0 0 420 540" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-labelledby="cert-t">
        <title id="cert-t">
          Engraved round certificate: Round No. 042, the Old Course, St Andrews, Black tees, 79, 12 October 2026, attested by the golfer.
        </title>
        <rect x="5" y="5" width="410" height="530" fill="none" stroke={palette.locker.hex} strokeWidth="1.2" />
        {G.map((d, i) => <path key={i} d={d} fill="none" stroke={palette.fairway.hex} strokeWidth=".45" opacity=".85" />)}
        <rect x="38" y="38" width="344" height="464" fill={palette.paper.hex} stroke={palette.locker.hex} strokeWidth=".8" />
        <rect x="44" y="44" width="332" height="452" fill="none" stroke={palette.locker.hex} strokeWidth=".4" />
        <g fill={palette.ink.hex} textAnchor="middle">
          <text x="210" y="92" className="f-cond" fontSize="18" fontWeight="600" letterSpacing="3.5" fill={palette.oldBrass.hex}>NO. 042</text>
          <text x="210" y="114" className="f-cond" fontSize="17" fontWeight="600" letterSpacing="2.6" fill={palette.pencil.hex}>ENTERED IN THE LEDGER</text>
          <text x="210" y="168" className="f-display" fontSize="40">The Old Course</text>
          <text x="210" y="198" className="f-text" fontStyle="italic" fontSize="18" fill={palette.pencil.hex}>St Andrews · Black tees</text>
          <text x="210" y="222" className="f-text" fontStyle="italic" fontSize="18" fill={palette.pencil.hex}>12 October 2026</text>
          <text x="210" y="318" className="f-cond" fontSize="96" fontWeight="600">79</text>
          <text x="210" y="350" className="f-cond" fontSize="18" fontWeight="600" letterSpacing="2.4" fill={palette.pencil.hex}>OUT 35 · IN 44</text>
          <text x="210" y="376" className="f-cond" fontSize="18" fontWeight="600" letterSpacing="2.4" fill={palette.pencil.hex}>DIFFERENTIAL 5.1</text>
        </g>
        <line x1="200" y1="452" x2="350" y2="452" stroke={palette.ink.hex} strokeWidth=".8" />
        <text x="275" y="444" textAnchor="middle" className="f-text" fontStyle="italic" fontSize="21" fill={palette.slate.hex}>the Member</text>
        <text x="275" y="478" textAnchor="middle" className="f-cond" fontSize="17" fontWeight="600" letterSpacing="2.4" fill={palette.pencil.hex}>ATTEST</text>
        <g transform="translate(110 446)">
          <circle r="30" fill="none" stroke={palette.red.hex} strokeWidth="1.2" />
          <circle r="25" fill="none" stroke={palette.red.hex} strokeWidth=".6" strokeDasharray="1 2" />
          <text y="8" textAnchor="middle" className="f-display" fontSize="24" fill={palette.red.hex}>−1</text>
        </g>
      </svg>
    </div>
  );
}

/* ───────────────────────── Handicap hero sketch ───────────────────────── */

// Last 20 score differentials, oldest first. The best 8 count (simplified WHS).
const DIFFS = [16.1, 14.8, 15.9, 13.2, 17.4, 14.1, 12.6, 15.2, 13.9, 12.1, 16.8, 13.4, 11.9, 14.6, 12.8, 13.1, 15.5, 12.3, 11.4, 12.0];

export function HandicapHero() {
  const best = [...DIFFS].map((d, i) => ({ d, i })).sort((a, b) => a.d - b.d).slice(0, 8);
  const counted = new Set(best.map((b) => b.i));
  const index = Math.round((best.reduce((a, b) => a + b.d, 0) / 8) * 10) / 10;
  const W = 320, H = 80, min = 10, max = 18;
  const x = (i: number) => 6 + (i / (DIFFS.length - 1)) * (W - 12);
  const y = (d: number) => 6 + ((d - min) / (max - min)) * (H - 12);
  return (
    <div className="tex-locker on-dark p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4 border-b border-(--mb-brass)/50 pb-3">
        <span className="caps text-[0.75rem] text-(--mb-brass)">18 Eagles</span>
        <span className="caps text-[0.75rem] text-(--mb-linen)">Rounds · Stats · Locker</span>
      </div>
      <p className="caps mt-8 text-[0.8rem] text-(--mb-brass)">Handicap Index</p>
      <p className="f-display text-[clamp(6rem,15vw,11rem)] leading-[0.85] tracking-[-0.02em] text-(--mb-paper)" aria-label={`Handicap index ${index}`}>
        {index.toFixed(1)}
      </p>
      <p className="mt-3 flex items-center gap-2 f-cond text-[1.25rem] font-semibold text-(--mb-linen)">
        <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true"><path d="M0 0 H14 L7 12 Z" fill={palette.brass.hex} /></svg>
        Down 0.6 since 1 September
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-auto w-full max-w-md" role="img" aria-label="Last 20 score differentials, trending down from about 16 to 12. The best 8, marked in brass, count toward the index.">
        <line x1="0" y1={y(index)} x2={W} y2={y(index)} stroke={palette.brass.hex} strokeWidth=".8" strokeDasharray="2 3" />
        <polyline points={DIFFS.map((d, i) => `${x(i)},${y(d)}`).join(" ")} fill="none" stroke={palette.linen.hex} strokeOpacity=".55" strokeWidth="1.2" />
        {DIFFS.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r={counted.has(i) ? 3.6 : 2.2} fill={counted.has(i) ? palette.brass.hex : palette.locker.hex} stroke={counted.has(i) ? palette.brass.hex : palette.linen.hex} strokeWidth="1" />
        ))}
      </svg>
      <p className="mt-2 caps text-[0.75rem] text-(--mb-linen)">Best 8 of last 20 count · Low index 11.8</p>
      <div className="mt-8 border-t border-(--mb-brass)/50 pt-5">
        <p className="f-text italic text-[1.15rem] text-(--mb-paper)">Welcome back. Nine days since the Old Course: 79 from the Black tees.</p>
        <span className="mt-4 inline-flex items-center gap-3 bg-(--mb-paper) px-5 py-3 f-cond text-[1.1rem] font-semibold uppercase tracking-[0.12em] text-(--mb-locker)">
          Beat 79 at the Old Course
          <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="M0 5 H14 M10 1 L14 5 L10 9" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
        </span>
        <span className="sr-only">(drawn button: a sketch, not a control)</span>
      </div>
    </div>
  );
}
