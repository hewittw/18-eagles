// Principles, color, type, and space for /design-system. Every ratio here is computed from
// src/components/tokens.ts at render, the same data measure-contrast.mjs prints. Nothing is typed in.
import { contrast, forbidden, pairs, ratioOf, threshold, tokens, type TokenKey } from "@/components/tokens";
import { cx } from "@/components/ui/cx";

const ORDER: TokenKey[] = ["paper", "paper-2", "paper-3", "ink", "ink-2", "rule-strong", "green", "green-2", "green-3", "gold", "gold-ink", "under", "link", "error"];
const ALIASES: { key: TokenKey; is: TokenKey; note: string }[] = [
  { key: "on-green", is: "paper", note: "text on green" },
  { key: "over", is: "green", note: "over-par numbers" },
  { key: "success", is: "green", note: "saved, done" },
  { key: "focus", is: "ink", note: "ring on paper; brass on green" },
];

function Ratio({ fg, bg, kind = "body" }: { fg: TokenKey; bg: TokenKey; kind?: "body" | "ui" }) {
  const r = ratioOf(fg, bg);
  const ok = r >= threshold[kind];
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="font-numeral font-semibold tabular-nums">{r.toFixed(2)}</span>
      <span>{ok ? (kind === "ui" ? "≥ 3" : "AA") : "fails"}</span>
    </span>
  );
}

export function Principles() {
  const items: { n: string; title: string; body: string; where: string }[] = [
    { n: "I", title: "Forms are one column, and every field says its name", body: "A real label above every field, “(optional)” in the label, hints under it. Errors sit beside the field and say what to do next: “Enter the course name”, never “Invalid input”. On submit, focus goes to the first problem and nothing typed is lost.", where: "Field, TextInput, NumberInput, ChoiceGroup error" },
    { n: "II", title: "Undo beats “Are you sure?”", body: "Deleting a round, clearing shots, or removing a club happens at once, then a toast offers Undo for at least eight seconds, longer while you hover or focus it. A confirm dialog is kept for the one thing that can't come back: erasing everything.", where: "Toast + useToast, ClubPicker's Undo clear, ConfirmDialog" },
    { n: "III", title: "Core needs first, in the same place every time", body: "Five places, in the order a golfer needs them: Clubhouse, Courses, Cards, Stats, Locker. On a phone they sit at the bottom in thumb reach; on a laptop, in the top bar. The current one is marked with aria-current and a brass rule.", where: "AppShell, AppNav" },
    { n: "IV", title: "Accessible by construction", body: "A skip link is the first Tab stop. One h1, then h2 and h3 in order. Real buttons and links only, a 2px ring offset onto the surface, touch targets of 44px (56px for score and club tiles), and every pair of colors measured.", where: "SkipLink, the focus ring in globals.css, tokens.ts" },
    { n: "V", title: "Shape says the score; color only repeats it", body: "Circle for birdie, two for eagle, square for bogey, two for double. Under par is red and always carries the minus sign. The same marks run through the card, history, and charts.", where: "ScoreMark, ScoreTiles, ScorecardTable" },
    { n: "VI", title: "One green action, and one big number", body: "Each screen leads with one exact figure or one photograph, and has a single Fairway-green primary button. Everything else is ink on paper.", where: "BigNumber, Button primary" },
  ];
  return (
    <ol className="grid gap-px border border-ink bg-ink sm:grid-cols-2 xl:grid-cols-3">
      {items.map((p) => (
        <li key={p.n} className="tex-paper flex min-w-0 flex-col p-5 sm:p-7">
          <p className="font-display text-[1.6rem] leading-none text-gold-ink" aria-hidden="true">{p.n}</p>
          <h3 className="mt-3 font-display text-[1.75rem] leading-[1.1] text-ink text-balance">{p.title}</h3>
          <p className="mt-3 flex-1 text-[1rem] leading-relaxed text-ink-2">{p.body}</p>
          <p className="caps mt-5 border-t border-rule pt-3 text-[0.72rem] text-ink-2"><span className="text-gold-ink">In the system:</span> {p.where}</p>
        </li>
      ))}
    </ol>
  );
}

export function ColorTokens() {
  return (
    <div className="grid gap-12">
      <div>
        <ul className="grid grid-cols-2 gap-px border border-ink bg-ink sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7" aria-label="Color tokens">
          {ORDER.map((k) => {
            const t = tokens[k];
            const dark = t.surface === "dark";
            const fgKey: TokenKey = dark ? "paper" : "ink";
            const border = k === "rule-strong";
            return (
              <li key={k} className="flex min-h-52 min-w-0 flex-col justify-between gap-4 p-4" style={border ? { background: tokens.paper.hex, color: tokens.ink.hex, boxShadow: `inset 0 0 0 10px ${t.hex}` } : { background: t.hex, color: tokens[fgKey].hex }}>
                <span>
                  <span className="block font-display text-[1.4rem] leading-tight">{t.name}</span>
                  <code className="mt-1 block font-numeral text-[0.95rem] font-semibold">{k}</code>
                </span>
                <span className="grid gap-1 text-[0.82rem] leading-snug">
                  <span className="font-numeral text-[1rem] font-semibold tracking-wide">{t.hex}</span>
                  <span>{t.role}</span>
                  <span className="caps mt-1 text-[0.68rem]">
                    {border ? <>As a border on paper <Ratio fg={k} bg="paper" kind="ui" /></> : <>{dark ? "Paper" : "Ink"} on it <Ratio fg={fgKey} bg={k} /></>}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[0.95rem] text-ink-2">
          Also: <code className="font-numeral">rule</code> (ink at 22%, hairlines only, never text or a control edge) and the aliases{" "}
          {ALIASES.map((a, i) => (
            <span key={a.key}>
              <code className="font-numeral text-ink">{a.key}</code> = {a.is} ({a.note}){i < ALIASES.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>

      <div className="grid gap-12">
        <div className="min-w-0">
          <h3 className="font-display text-title">Every pair in use, measured</h3>
          <p className="mt-2 text-[0.98rem] text-ink-2">
            WCAG 2.x ratios computed from <code className="font-numeral">tokens.ts</code> as this page renders. Run{" "}
            <code className="font-numeral text-ink">node --no-warnings src/app/design-system/measure-contrast.mjs</code> for the same table; it fails if any pair drops under its bar or globals.css drifts.
          </p>
          <div role="region" aria-label="Measured contrast pairs, scrolls sideways on small screens" tabIndex={0} className="scroll-x mt-4">
            <table className="w-full min-w-[36rem] border-collapse text-left text-[0.95rem]">
              <caption className="sr-only">Contrast of every token pair the components use</caption>
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="caps py-2 pr-3 text-[0.72rem] font-semibold text-ink-2">Sample</th>
                  <th scope="col" className="caps py-2 pr-3 text-[0.72rem] font-semibold text-ink-2">Pair</th>
                  <th scope="col" className="caps py-2 pr-3 text-[0.72rem] font-semibold text-ink-2">Use</th>
                  <th scope="col" className="caps py-2 pr-3 text-right text-[0.72rem] font-semibold text-ink-2">Ratio</th>
                  <th scope="col" className="caps py-2 text-right text-[0.72rem] font-semibold text-ink-2">Needs</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((p, i) => {
                  const r = contrast(tokens[p.fg].hex, tokens[p.bg].hex);
                  return (
                    <tr key={i} className="border-b border-rule">
                      <td className="py-1.5 pr-3">
                        <span className="inline-flex h-7 items-center px-2 font-numeral font-semibold shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)]" style={{ background: tokens[p.bg].hex, color: tokens[p.fg].hex }}>
                          {p.kind === "ui" ? <span className="inline-block h-3.5 w-8 border-2" style={{ borderColor: tokens[p.fg].hex }} /> : "Aa 4"}
                        </span>
                      </td>
                      <th scope="row" className="py-1.5 pr-3 font-normal whitespace-nowrap"><code className="font-numeral">{p.fg}</code> on <code className="font-numeral">{p.bg}</code></th>
                      <td className="py-1.5 pr-3 text-ink-2">{p.use}</td>
                      <td className="py-1.5 pr-3 text-right font-numeral text-[1.05rem] font-semibold tabular-nums">{r.toFixed(2)}:1</td>
                      <td className="py-1.5 text-right font-numeral tabular-nums text-ink-2">{threshold[p.kind]}:1 {r >= threshold[p.kind] ? "pass" : "FAIL"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-title">Measured, then designed around</h3>
          <p className="mt-2 text-[0.98rem] text-ink-2">These fail, so the components never use them. They&apos;re here so nobody &ldquo;fixes&rdquo; a rule back.</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {forbidden.map((f) => (
              <li key={f.fg + f.bg} className="flex gap-4 border border-rule bg-paper-2 p-4">
                <span className="grid h-12 w-16 shrink-0 place-items-center font-numeral text-[1.1rem] font-semibold" style={{ background: tokens[f.bg].hex, color: tokens[f.fg].hex }} aria-hidden="true">Aa</span>
                <span className="min-w-0 text-[0.95rem] leading-snug">
                  <span className="font-numeral text-[1.05rem] font-semibold">{contrast(tokens[f.fg].hex, tokens[f.bg].hex).toFixed(2)}:1 </span>
                  <code className="font-numeral">{f.fg}</code> on <code className="font-numeral">{f.bg}</code>
                  <span className="mt-1 block text-ink-2">{f.why}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function TypeScale() {
  const rows: { step: string; cls: string; spec: string; sample: string; family: string }[] = [
    { step: "Hero figure", cls: "font-display text-hero", spec: "text-hero · clamp(5.5rem, 15vw, 11rem) · lh 0.85", sample: "12.3", family: "Libre Caslon Display" },
    { step: "Display 1", cls: "font-display text-display-1", spec: "text-display-1 · the page's h1", sample: "The Old Course", family: "Libre Caslon Display" },
    { step: "Display 2", cls: "font-display text-display-2", spec: "text-display-2 · section h2", sample: "Hole No. 17, the Road", family: "Libre Caslon Display" },
    { step: "Title", cls: "font-display text-title", spec: "text-title · 28–32px · card titles, h3", sample: "Which club, shot 3?", family: "Libre Caslon Display" },
    { step: "Tile numeral", cls: "font-numeral text-[2.4rem] font-semibold leading-none", spec: "font-numeral 600 · 38px · tabular, lining", sample: "4 3 5 E −1 79", family: "Barlow Condensed" },
    { step: "Lede", cls: "font-serif text-lede", spec: "font-serif text-lede · intros", sample: "Out in 35 with an eagle at Hole O'Cross.", family: "Libre Caslon Text" },
    { step: "Voice", cls: "font-serif text-lede italic text-link", spec: "font-serif italic text-link · the golfer's notes", sample: "Club up into the wind. Never long on seven.", family: "Libre Caslon Text italic" },
    { step: "Body", cls: "font-sans text-[1rem]", spec: "font-sans · 16px · lh 1.55", sample: "Tap the club you hit, and it becomes the next shot.", family: "Barlow 400" },
    { step: "Small", cls: "font-sans text-[0.92rem] text-ink-2", spec: "0.92rem · hints and captions (floor 12px)", sample: "As it appears on the scorecard.", family: "Barlow 400" },
    { step: "Label", cls: "caps text-label", spec: "caps text-label · 0.78rem, tracked 0.16em", sample: "Hole · Par · Yds · Hcp · Putts", family: "Barlow Condensed 600" },
  ];
  return (
    <div className="grid gap-px border border-ink bg-ink">
      {rows.map((r) => (
        <div key={r.step} className="tex-paper grid min-w-0 gap-x-8 gap-y-2 p-4 sm:p-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-baseline">
          <div className="min-w-0">
            <p className="caps text-[0.75rem] text-gold-ink">{r.step}</p>
            <p className="mt-1 text-[0.85rem] leading-snug text-ink-2">{r.family}</p>
            <code className="mt-0.5 block font-numeral text-[0.85rem] leading-snug text-ink-2">{r.spec}</code>
          </div>
          <p className={cx("min-w-0 overflow-hidden text-ink [overflow-wrap:anywhere]", r.cls)}>{r.sample}</p>
        </div>
      ))}
    </div>
  );
}

export function SpaceShape() {
  const space = [1, 2, 3, 4, 6, 8, 12, 16];
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="min-w-0">
        <h3 className="font-display text-title">Spacing and targets</h3>
        <p className="mt-2 text-[0.98rem] text-ink-2">Tailwind&apos;s 4px scale. Group tight (1.5–3) inside a control set, open wide (12–16) between sections, so related things read as one.</p>
        <ul className="mt-5 grid gap-2">
          {space.map((s) => (
            <li key={s} className="grid grid-cols-[3.5rem_1fr] items-center gap-3">
              <code className="font-numeral text-ink-2">{s} · {s * 4}px</code>
              <span className="block h-3 bg-green-3" style={{ width: s * 4 * 2 }} />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-end gap-6">
          <div><span className="grid size-tap place-items-center border border-dashed border-ink font-numeral text-ink-2">44</span><p className="caps mt-2 text-[0.7rem] text-ink-2"><code>tap</code> every control</p></div>
          <div><span className="grid size-tile place-items-center border border-dashed border-ink font-numeral text-ink-2">56</span><p className="caps mt-2 text-[0.7rem] text-ink-2"><code>tile</code> score + club tiles</p></div>
          <div><span className="grid h-[4.5rem] w-16 place-items-center border border-dashed border-ink font-numeral text-ink-2">72</span><p className="caps mt-2 text-[0.7rem] text-ink-2">a score tile, as built</p></div>
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-title">Corners, shadows, rules</h3>
        <p className="mt-2 text-[0.98rem] text-ink-2">Square corners (<code className="font-numeral">rounded-xs</code> is 1px). Round is reserved for circles: score marks, pins, the roundel. No soft SaaS shadows: a tile has a lip, only floating things lift.</p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="grid gap-2"><span className="tile h-16" /><code className="font-numeral text-[0.85rem] text-ink-2">shadow-tile</code></div>
          <div className="grid gap-2"><span className="h-16 border border-rule bg-paper-2 shadow-lift" /><code className="font-numeral text-[0.85rem] text-ink-2">shadow-lift</code></div>
          <div className="grid gap-2"><span className="brass-plate h-16" /><code className="font-numeral text-[0.85rem] text-ink-2">brass-plate</code></div>
          <div className="grid gap-2"><span className="tex-linen h-16 border border-rule" /><code className="font-numeral text-[0.85rem] text-ink-2">tex-linen</code></div>
        </div>
        <div className="mt-6 grid gap-3">
          <div className="rule-double text-ink" aria-hidden="true" />
          <p className="text-[0.92rem] text-ink-2"><code className="font-numeral">rule-double</code>: the scorecard&apos;s &ldquo;Out&rdquo; line, under every page and section title.</p>
        </div>
      </div>
    </div>
  );
}
