# Component Contract (design system ↔ pages)

The design system **is** the app's component library. Everything here lives in `src/components/ui/` (generic) and
`src/components/golf/` (golf-specific), exported from `src/components/ui/index.ts` and `src/components/golf/index.ts`.
`/design-system` renders every component in every state from these same files. Pages import only these. They never
restyle a one-off button. Names and props below are fixed so pages and components can be built in parallel. Add
optional props freely, but don't rename or remove anything.

## Tokens (in `src/app/globals.css` `@theme`, values from `docs/styles/clubhouse.md`)
Colors (Tailwind: `bg-paper`, `text-ink`, `border-rule`…):
`paper` (page), `paper-2` (raised surface / card), `paper-3` (sunken / table stripe), `ink` (body text), `ink-2` (muted
text, still ≥ 4.5:1 on paper and paper-2), `rule` (hairlines), `rule-strong` (control borders, ≥ 3:1), `green` (primary
brand / primary action), `green-2` (hover/pressed), `green-3` (deep surface, e.g. the hero band), `on-green` (text on
green and green-3), `gold` (honors, small ceremonial accents; not for body text unless it passes), `under` (red for
under-par numbers, the leaderboard tradition), `over` (over-par numbers), `focus` (focus ring), `error` (field errors,
≥ 4.5:1), `success`.
Fonts: `font-display` (the ceremonial serif), `font-sans` (UI text), `font-numeral` (scoreboard numerals; tabular).
Also: radii, shadows, and motion durations as tokens. Respect `prefers-reduced-motion`.

## `src/components/ui`
| Component | Props (TypeScript) | Notes |
|---|---|---|
| `Button` | `variant?: "primary" \| "secondary" \| "quiet" \| "danger"`, `size?: "sm" \| "md" \| "lg"`, `icon?: ReactNode`, `loading?: boolean`, …`<button>` props | Real `<button>`. Primary is the one green action on a screen. |
| `ButtonLink` | same visual props + `href` (Next `Link`) | For navigation that looks like a button. |
| `Field` | `label: string`, `hint?: string`, `error?: string`, `optional?: boolean`, `id?: string`, `children: (a11y: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode` | Renders `<label htmlFor>`, the hint, and the error next to the field (icon + text, `role` not alert; linked with `aria-describedby`). "(optional)" in the label. |
| `TextInput`, `NumberInput`, `DateInput`, `TextArea`, `Select` | the native element's props | Styled natives, used inside `Field`. `NumberInput` sets `inputMode="decimal"` or `"numeric"`. |
| `ChoiceGroup<T extends string>` | `legend: string`, `options: { value: T; label: string; hint?: string; disabled?: boolean }[]`, `value: T \| null`, `onChange(v: T)`, `layout?: "row" \| "wrap" \| "grid"`, `size?: "sm" \| "md" \| "lg"`, `hideLegend?: boolean` | Single choice as styled native radios in a `<fieldset>` (arrow keys work). Used for tees, the goal, holes, filters, fairway. |
| `ToggleChip` | `pressed: boolean`, `onPressedChange(p: boolean)`, `children` | `aria-pressed`. |
| `Stepper` | `label: string`, `value: number \| null`, `onChange(n: number \| null)`, `min?: number`, `max?: number`, `size?: "md" \| "lg"` | − value + with real buttons, each ≥ 44px, disabled at the limits, plus an `aria-live` value. |
| `Card` | `as?: "div" \| "section" \| "article" \| "li"`, `tone?: "paper" \| "green"`, `className?` | Surfaces. |
| `SectionHeading` | `eyebrow?: string`, `title: string`, `level?: 2 \| 3`, `action?: ReactNode`, `id?: string` | |
| `Tag` | `tone?: "neutral" \| "green" \| "gold"`, `children` | |
| `Toast` + `useToast()` | `toast({ message: string; action?: { label: string; onClick(): void }; duration?: number })` | Polite live region. Undo stays ≥ 6s, longer while hovered or focused. Provide `<ToastProvider>`. |
| `ConfirmDialog` | `open`, `title`, `body`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`, `danger?: boolean` | Native `<dialog>`. It traps focus, Esc cancels, and focus returns to the opener. Only for "erase everything". |
| `SkipLink` | none | "Skip to main content" → `#main`. |
| `VisuallyHidden` | `children` | |
| `Callout` | `tone?: "info" \| "gold"`, `title?: string`, `children` | Gentle guidance (e.g. "1 of 3 rounds to your index"). Not an empty state. |

## `src/components/golf`
| Component | Props | Notes |
|---|---|---|
| `AppShell` | `children` | The tool's shared frame: `SkipLink`, header with the 18 Eagles wordmark + `AppNav`, `<main id="main">`, footer. Mobile: a bottom tab bar (thumb reach). Desktop: a top bar. |
| `AppNav` | `current: "clubhouse" \| "courses" \| "cards" \| "stats" \| "locker"` | Links: Clubhouse `/clubhouse`, Courses `/clubhouse/courses`, Cards `/clubhouse/rounds`, Stats `/clubhouse/stats`, Locker `/clubhouse/locker`. Marked with `aria-current="page"`. |
| `PageHeader` | `title: string`, `eyebrow?: string`, `back?: { href: string; label: string }`, `actions?: ReactNode` | The page's `<h1>`, plus an optional back link ("← Courses"). |
| `Wordmark` | `size?: "sm" \| "lg"` | Original "18 Eagles" lettering. No borrowed marks. |
| `BigNumber` | `value: string`, `label: string`, `sub?: ReactNode`, `tone?: "paper" \| "green"` | The hero numeral (handicap). Scoreboard-numeral feel. |
| `ScoreMark` | `strokes: number \| null`, `par: number`, `size?: "sm" \| "md" \| "lg"` | The traditional marks: circle = birdie, double circle = eagle, square = bogey, double square = double+. Plus visually hidden text ("Birdie, 3"). |
| `ScoreTiles` | `par: number`, `value: number \| null`, `onChange(n: number)`, `max?: number` | The hole screen's main control. Big tiles labeled with the number and name ("4 · Par"), from par−2 to par+3, plus a "More" option for higher. A radiogroup with arrow keys, ≥ 56px tiles, one-thumb reach. |
| `ClubPicker` | `bag: Club[]`, `shots: string[]`, `onChange(shots: string[])` | Tap a club to add the next shot. It shows the sequence ("Dr → 7i → Pt → Pt"), with remove-last and clear. Grouped by woods/hybrids/irons/wedges/putter. Announces "Shot 3: 7-iron". |
| `FairwayPicker` | `value: Fairway \| null`, `onChange(v)` | Left / Hit / Right with drawn arrows. `ChoiceGroup` semantics. |
| `ScorecardTable` | `holes: Hole[]`, `entries: Record<number, HoleEntry>`, `currentHole?: number`, `onSelectHole?(n: number)`, `compact?: boolean` | The classic card: Hole / Yards / Par / Score with Out / In / Total, `ScoreMark`s, a real `<table>` with headers, scrolls horizontally on phones with a sticky first column. |
| `CourseCard` | `course: Course`, `href: string`, `meta?: ReactNode` | The photo (or `HoleIllustration` fallback), name, place, par · yards, tags. The whole card is one link. |
| `HoleIllustration` | `hole: Hole`, `seed?: string`, `className?` | A yardage-book style SVG drawing (tee, fairway, bunkers, green, flag, yardage marks), generated from par/yards/hole number. Illustrative, labeled as such for screen readers. |
| `TeeSwatch` | `color: string`, `name: string` | |

Charts (hand-built SVG, in `src/components/golf/charts/`): `TrendChart`, `DistributionBar`, `ParTypeBars`,
`ClubUsage`, `HoleHeat`. Each takes plain data, has a `title` + `desc`, and comes with a "Show as table" toggle. These
are built by the page work, not the design system (the design system just shows one example each, if they exist).
