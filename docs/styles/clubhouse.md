> **Re-skinned 2026-10-19 at the user's direction: "use the Masters website fonts and colors, no off-white background."**
> The structure, components, and rules below still hold; the palette and type now follow masters.com (measured):
> white `#FFFFFF` pages and `#F2F2F2` panels, Masters green `#006747` (hover `#00563B`), Masters yellow `#FCE300`
> (on green only), leaderboard red `#BA0C2F` for under par, text `#25282A` / `#53565A`. Type: Newsreader (for Tiempos
> Headline), Libre Franklin (for Benton Sans), and Oswald (the same leaderboard numerals masters.com uses). No paper
> grain or linen textures. Token names are unchanged; `src/components/tokens.ts` has the current values.

# Clubhouse style guide: The Members' Ledger

Final. Drawn from the mood board (`/mood-board`) and built as the component library shown at
`/design-system`. Tokens live in `src/app/globals.css` `@theme`; the same hexes and every measured pair are
in `src/components/tokens.ts`. References and what we took from each are in `docs/references.md`.

> A golf journal that feels like walking from the 18th green into a good clubhouse: card stock and pencil,
> a white board of hand-hung numbers, brass on a green locker door, and low California sun on the fairway.
> Modern in how it works, old in what it honours. Nothing borrowed from a club.

## Mood words
1. **Ceremonial.** The score is posted, not pushed. Hand-hung tiles, attested cards, numbers given room.
   A finished round is an occasion.
2. **Tailored.** Locker-room craft: brass, linen, a good stitch. Fewer things, each made well. Quiet
   confidence over decoration.
3. **Sunlit.** Southern California light on paper and grass: warm off-whites, soft greens, long shadows.
   Never dark-mode neon, never gloss.

## Palette → tokens

Use the Tailwind classes (`bg-paper`, `text-ink-2`, `border-rule-strong`, `text-gold-ink`…). Never a raw hex in
a page. `src/components/tokens.ts` is the source; `node --no-warnings src/app/design-system/measure-contrast.mjs`
prints every pair and fails if a pair drops under its bar or globals.css drifts from tokens.ts.

| Token | Name | Hex | Use it for |
|---|---|---|---|
| `paper` | Scorecard Paper | `#F5F0E4` | The page (root default, with the fibre grain) |
| `paper-2` | Tile White | `#FBFAF6` | Raised: cards, inputs, score and club tiles |
| `paper-3` | Linen | `#E8E0CC` | Sunken: table stripes, the par row, hover wash, bar tracks |
| `ink` | Ink | `#1C1B17` | Body text, numerals; also `focus` on paper |
| `ink-2` | Pencil | `#5A544A` | Muted text, ≥ 4.5:1 on all three papers. Never on green |
| `rule` | Hairline | ink at 22% | Dividers only. Never text, never a control edge |
| `rule-strong` | Graphite | `#7D7566` | Control borders, chart axes (≥ 3:1 on all three papers). Never a fill under text |
| `green` | Fairway | `#2B5E46` | The one primary action, chart marks; also `over` and `success` |
| `green-2` | Clubhouse Green | `#1F4A37` | Hover / pressed for Fairway |
| `green-3` | Locker Green | `#143A2C` | Deep surfaces: the bar, hero bands, Out/In cells, selected tiles |
| `on-green` | Scorecard Paper | `#F5F0E4` | Text on `green`, `green-2`, `green-3`, `under` |
| `gold` | Brass | `#BE9A55` | **On Locker Green only**: caps, honors, rules, the focus ring on green |
| `gold-ink` | Old Brass | `#7A5B20` | Brass-toned text on paper: eyebrows, numerals, chart goal lines |
| `under` | Under-Par Red | `#A3272A` | Under-par scores, always with the minus sign. Never decoration, never on green |
| `over` | Fairway | `#2B5E46` | Over-par numbers (the board's tradition) |
| `link` | Covenant Slate | `#22485A` | Links and the golfer's notes in Caslon italic |
| `focus` | Ink | `#1C1B17` | The ring. `.on-green` swaps it to `gold` automatically |
| `error` | Rust | `#8A3B12` | Field errors, always with the icon and words. Kept apart from under-par red |
| `success` | Fairway | `#2B5E46` | Saved / done, with a tick and words |

Surfaces in `@layer components`: `.tex-paper`, `.tex-linen`, `.tex-locker` (Locker Green + grain, paper text),
`.on-green` (sets brass focus rings and paper text for anything inside), `.brass-plate`, `.tile`, `.caps`,
`.rule-double`, `.link`, `.hang`, `.scroll-x`. Route CSS stays in `@layer components`: unlayered CSS beats utilities.

Other tokens: `font-display` / `font-serif` / `font-sans` / `font-numeral` (tabular, lining); `text-hero`,
`text-display-1`, `text-display-2`, `text-title`, `text-lede`, `text-label`; `spacing-tap` (44px, `min-h-tap`) and
`spacing-tile` (56px, `min-h-tile`); `max-w-ledger` (80rem), `max-w-measure` (40rem); radii `rounded-xs`/`sm` 1px,
`md`/`lg` 2px; `shadow-tile`, `shadow-lift`, `shadow-plate`; `ease-hang`, `ease-press`, `animate-hang`,
`animate-fade`, `animate-toast`.

### Measured contrast (mood board record)
The mood board's measurements, kept for the record. The live, complete list of pairs the components use is
rendered on `/design-system` and printed by `src/app/design-system/measure-contrast.mjs` (WCAG 2.x).
Body text must be ≥ 4.5:1. Large text, UI boundaries, and focus rings must be ≥ 3:1.

| Foreground | Background | Use | Ratio | Needs |
|---|---|---|---|---|
| Ink `#1C1B17` | Scorecard Paper `#F5F0E4` | Body text on paper | 15.16:1 | 4.5:1 |
| Ink `#1C1B17` | Linen `#E8E0CC` | Body text on linen panels | 13.10:1 | 4.5:1 |
| Ink `#1C1B17` | Tile White `#FBFAF6` | Score numerals on tiles | 16.50:1 | 4.5:1 |
| Pencil `#5A544A` | Scorecard Paper `#F5F0E4` | Captions on paper | 6.59:1 | 4.5:1 |
| Pencil `#5A544A` | Linen `#E8E0CC` | Captions on linen | 5.70:1 | 4.5:1 |
| Pencil `#5A544A` | Tile White `#FBFAF6` | Carry yardage on club tiles; tile borders | 7.18:1 | 4.5:1 |
| Fairway `#2B5E46` | Scorecard Paper `#F5F0E4` | Green labels on paper | 6.61:1 | 4.5:1 |
| Covenant Slate `#22485A` | Scorecard Paper `#F5F0E4` | Links and notes on paper | 8.62:1 | 4.5:1 |
| Old Brass `#7A5B20` | Scorecard Paper `#F5F0E4` | Brass small caps on paper | 5.52:1 | 4.5:1 |
| Under-Par Red `#A3272A` | Scorecard Paper `#F5F0E4` | Under-par score on paper | 6.41:1 | 4.5:1 |
| Under-Par Red `#A3272A` | Tile White `#FBFAF6` | Under-par score on tiles | 6.98:1 | 4.5:1 |
| Scorecard Paper `#F5F0E4` | Locker Green `#143A2C` | Body text on Locker Green | 11.05:1 | 4.5:1 |
| Linen `#E8E0CC` | Locker Green `#143A2C` | Secondary text on Locker Green | 9.55:1 | 4.5:1 |
| Brass `#BE9A55` | Locker Green `#143A2C` | Brass text on Locker Green | 4.75:1 | 4.5:1 |
| Scorecard Paper `#F5F0E4` | Fairway `#2B5E46` | Button label on Fairway | 6.61:1 | 4.5:1 |
| Tile White `#FBFAF6` | Under-Par Red `#A3272A` | Label on a red badge | 6.98:1 | 4.5:1 |
| Fairway `#2B5E46` | Linen `#E8E0CC` | Chart marks, selected border on linen | 5.72:1 | 3:1 |
| Ink `#1C1B17` | Scorecard Paper `#F5F0E4` | Focus ring (2px Ink, 2px offset) on light | 15.16:1 | 3:1 |
| Brass `#BE9A55` | Locker Green `#143A2C` | Focus ring (2px Brass, 2px offset) on dark; brass rules | 4.75:1 | 3:1 |
| `#2A1F0A` | Brass plate gradient `#A9843F`–`#D9BD80` | Engraved nameplate text | 4.67–8.89:1 | 4.5:1 |

**Forbidden pairs (measured):** Brass on paper is 2.32:1 (use `gold-ink`). Pencil on Locker Green is 1.68:1 (use
`paper-3`). Red on Locker Green is 1.72:1 (selected score tiles set the number in paper). A brass ring on a Fairway button is
2.84:1, so focus rings sit *offset on the surrounding surface*, never on the button fill. Never set red text
on Locker Green.

## Type
All four families come from `next/font/google` (self-hosted at build, SIL OFL), loaded once in
`src/app/layout.tsx` and exposed as `font-display`, `font-serif`, `font-sans`, and `font-numeral`.

| Role | Family | Weights | Use |
|---|---|---|---|
| Display (`font-display`) | **Libre Caslon Display** | 400 | Page titles, course names, the handicap figure, big moments. 28px and up only. Never bold, never tight-tracked |
| Text (`font-serif`) | **Libre Caslon Text** | 400, 400 italic, 700 | Course blurbs and round summaries (roman). **Italic is the golfer's voice**: hole notes, round notes, pencil scores on the card |
| UI (`font-sans`) | **Barlow** | 400, 500, 600 | Interface text: labels, buttons, filters, table text, help |
| Numerals & labels (`font-numeral`, `.caps`) | **Barlow Condensed** | 500, 600, 700 | Every number in a tile, table, chart axis, or score. Small-caps labels: uppercase, tracked 0.16em, 600. Always `tabular-nums lining-nums` |

### Scale (rem at 16px; fluid sizes use `clamp`)
| Step | Size | Family | Example |
|---|---|---|---|
| Hero figure | `clamp(6rem, 15vw, 11rem)`, lh 0.85 | Caslon Display | Handicap `12.3` |
| Display 1 | `clamp(3.2rem, 9vw, 8.5rem)`, lh 0.9 | Caslon Display | Page title |
| Display 2 | `clamp(2.2rem, 4.4vw, 3.6rem)`, lh 1.02 | Caslon Display | Section / course name |
| Title | 1.45–1.9rem, lh 1.15 | Caslon Display | Card title, "Which club, shot 3?" |
| Tile numeral | 1.6–3rem | Barlow Condensed 600–700 | Score tiles, club tiles, stroke count |
| Lede | 1.08–1.3rem, lh 1.6 | Caslon Text | Intros, notes |
| Body | 1rem (16px), lh 1.55 | Barlow 400 | Interface copy |
| Small | 0.875–0.95rem | Barlow 400 | Captions, help text |
| Label | 0.72–0.8rem, tracked 0.16em, uppercase | Barlow Condensed 600 | HOLE · PAR · YDS · HCP |

The floor is 12px for any text and 16px for body. SVG text must render at 10px or more at a 320px viewport
(the board checks this).

## Motifs
- **Hand-hung tiles.** White tiles with 1px ink-30% borders and condensed numerals, on a Locker Green field
  with a tile-white frame. Running score to par per hole. Under par is red **with a minus sign** ("−2"), and
  even is "E". Rule after the ninth.
- **Scorecard marks.** Circle = birdie, double circle = eagle, square = bogey, double square = double bogey
  or worse, plain = par. Use them on cards, history, and chart points. Shape carries the meaning, color only
  repeats it.
- **The card grid.** Rows: Hole / Name / Yards / Handicap / Par (on linen) / Score / Putts. Out and In
  subtotals on Locker Green. An "Attest" line.
- **Yardage-book drawing.** Plan view, flat fills (rough, fairway with mowing stripes, sand stipple,
  water ripple), dotted 100/150/200 arcs to the green centre, carry numbers on the drawing, the golfer's
  note in slate italic. SVG, no satellite imagery.
- **Brass nameplate.** Brushed gradient, two or four screws, caps in Caslon or condensed. Only on Locker
  Green. One for the locker (bag page), one per personal best.
- **Engraved certificate.** Guilloche border (phase-shifted sine waves), "No. 042", attest line, a small
  red seal showing the score to par. For the finished-round summary.
- **Monogram.** Caslon "E" with "18" above it, in a rope ring with the name set around it, and one small
  red pennant. For the app mark and favicon, used small and rarely.
- **Hairlines and double rules.** A 1px ink line with a second line 3px below (the "Out" rule) closes
  section headers. Numerals ("I", "II") in Old Brass Caslon.
- **Small-caps caption bars** under photographs, like an old postcard: "THE FOURTH HOLE · PAR 4 · 474".

## Texture
- **Paper**: `#F5F0E4` plus an SVG `feTurbulence` fibre noise at about 16% alpha, tiled at 220px. Whisper
  strength. Contrast is measured on the flat color and holds.
- **Linen**: Linen color plus 1px cross-hatch gradients (every 3–4px) and an occasional wider slub every
  ~80px. For raised panels and the locker page only, never behind long body text.
- **Locker Green**: a faint vertical grain (2px lines at 1.8% white), like painted wood.
- **Brass**: a vertical gradient `#D9BD80 → #C3A161 → #A9843F → #C7A766` with 1px brushed lines.
- No photographic textures, no dimpled-ball patterns, no "aged" filters or fake stains.

## Motion
- **Hang** (the signature): tiles drop 6px and fade in over 420ms `cubic-bezier(.2,.7,.2,1)`, staggered
  ~28ms, as if hung by hand. Use it on the first render of a board or when a score changes, never on scroll.
- Press: buttons move 1px down (`translate-y-px`) and fill with Fairway, over 150ms.
- Number changes (handicap, totals) cross-fade, with no counting-up slot-machine effects.
- Finishing a round is a calm 300ms crossfade to the certificate: the "bridge".
- `prefers-reduced-motion: reduce` turns off hang and every transition (globals.css).

## Focus, targets, states (the component rules)
- Focus ring: 2px solid `focus`, offset 2px, so it sits on the surface around a control, never on its fill. On
  green surfaces (`.on-green`) it is brass. Never remove an outline without this replacement.
- Targets: every control ≥ 44px (`min-h-tap`); score tiles and club buttons ≥ 56px (`min-h-tile`).
- Every control has rest, hover, focus-visible, pressed (1px down, fill), selected (Locker Green + a brass mark,
  so not by hue alone), and disabled (dashed border, no fill). `/design-system` forces each with
  `data-force="hover|pressed|focus"` and the `is-hover:` / `is-pressed:` variants.
- Single choice = native radios (`ChoiceGroup`) or a radiogroup with arrow keys (`ScoreTiles`); toggles =
  `aria-pressed` (`ToggleChip`); score and shot changes are announced in a polite live region.
- Undo over confirm: `useToast()` with an Undo action (≥ 8s, paused on hover/focus). `ConfirmDialog` only for
  erasing everything.

## Dos and don'ts
**Do**
- Build pages only from `@/components/ui` and `@/components/golf`. If a page needs a new look, add it to the
  library (and to `/design-system`), not to the page.
- Lead every screen with one big, exact number or one great photograph, then let it breathe.
- Put the golfer's own words (notes) in Caslon italic. It's the human voice of the app.
- Keep red for under par only. Keep brass on green only.
- Use real course data and real names (the course library in `src/data/courses/`).
- Use real `<button>`s for tiles, with visible rest, hover, focus-visible, pressed, last-used, and disabled
  states. Single-choice groups get radio semantics, and toggles use `aria-pressed`.
- Put a polite live region on scoring ("Shot 3: 9-iron. 3 strokes on hole 5.").
- Make scroll regions `position: relative` (sr-only children otherwise escape and widen phones) and give
  grid items `min-width: 0`.

**Don't**
- Use the Masters logo, the Augusta map-and-flag, the RSF palm crest, a green jacket as branding, the
  Masters board silhouette, or their exact colors (`#006747`, `#BA0C2F`, `#144051`).
- Use the white page + grey cards + soft shadow + 12–16px radius look. Our surfaces are paper, hairlines,
  and square corners. Radius is reserved for circles (score marks, pins).
- Use golf clip-art, crossed clubs, ball dimples, the flag emoji, or emoji icons of any kind.
- Use a generic green gradient, lime accents, or a sports-betting dark mode.
- Put puns in headings. One good line of wit per screen at most.
- Build the four-KPI-cards-plus-line-chart dashboard. Breakdowns read like a board or a card.
- Use satellite maps or any runtime API.

## Top 6 ideas for the app's UI
1. **The handicap, engraved.** Home leads with the index in Caslon Display at poster size on Locker Green,
   the trend in plain words ("Down 0.6 since 1 September"), and the last 20 differentials with the 8 that
   count picked out in brass, so the golfer can see and argue with how it's made.
2. **Scores as hung tiles.** Round history and breakdowns read like the hand-operated board: running score to
   par per hole in tiles, red with a minus sign for under par, a rule after nine, and the hang motion when
   a score lands.
3. **The card keeps its marks.** Circles and squares on every scorecard, history row, and chart point, so
   birdie vs. bogey reads by shape without color. The round summary is a real card grid with Out/In.
4. **A yardage book for every hole.** The hole screen opens on a drawn plan of the hole (arcs, carries) with
   last time's italic note on it ("Club up into the wind. Never long on seven.").
5. **The bag as a button board.** Thumb-sized club tiles (56px or more) with carry yardages log each shot
   in one tap, show the last club used, keep a visible shot list, and use **Undo** instead of confirm
   dialogs.
6. **Every round, attested.** Finishing crosses the "bridge" to a numbered, engraved round certificate
   (score, Out/In, differential, attest line), and any personal best earns a brass plate in the Locker.
