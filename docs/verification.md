# Verification: automated accessibility + screen sizes

Run on 2026-10-19 against the dev server (`localhost:3300`), checked against `docs/accessibility.md`. The last run was on
the iOS-style restyle (commits 9c62631, d4d8094, 41c8c41). The keyboard and screen-reader pass is in
`docs/verification-keyboard.md`.

## Method
- **Playwright only** (headless Chromium from the npx cache, the same setup as `scripts/matrix.mjs`).
- **States** are seeded by a scratch page (not committed) that writes localStorage, then the page loads:
  `empty` (first visit), `one` (one card), `season` (13 sample cards), `live` (a round in progress, through hole 6).
- **axe-core 4.14** is injected into each page and run with the tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`,
  at 390×844 (touch) and 1440×900.
- **Target size** is measured on every `a, button, input, select, textarea, summary, [role=button], [tabindex]`. Styled radios
  are measured by their `<label>`. Each target under 24px also gets the WCAG 2.5.8 spacing test (a 24px circle on its center
  must not touch another target). Inline links inside a sentence are exempt under 2.5.8.
- **Overflow** is `scrollWidth > clientWidth` at **12 sizes**: the 11 from `scripts/matrix.mjs` plus 640×400 (1280×800 at
  200% browser zoom). Offenders are only counted when they aren't inside a scroll container. **Clipping** is any text element
  with `overflow: hidden/clip` whose content is bigger than its box (ellipsis truncation is excluded).
- **Text-only zoom 200%**: Chrome's default font size is set to 32px through CDP `Page.setFontSizes`. This is the real
  "text size" setting, so `rem` media queries respond the way they do for a user. Tested at 1280 and 390.
- **Reduced motion**: `reducedMotion: "reduce"`. The check fails if any element still has an animation or transition
  longer than 10ms.
- **Console**: every error, warning, and page error during load, at every size.
- **Contrast tokens**: `node --no-warnings src/app/design-system/measure-contrast.mjs` (and the mood-board copy).

## Results matrix (final run)
Columns: axe violations at 390 / 1440 · horizontal overflow across all 12 sizes · console messages across all 12 sizes · targets under 24px with no spacing exception.

| Route | States | axe 390 / 1440 | Overflow | Console | <24px unspaced |
|---|---|---|---|---|---|
| `/` | empty | 0 / 0 | 0 | 0 | 0 |
| `/research` | empty | 0 / 0 | 0 | 0 | 1 / 14 (see exceptions) |
| `/flows` | empty | 0 / 0 | 0 | 0 | 0 |
| `/mood-board` | empty | 0 / 0 | 0 | 0 | 0 |
| `/design-system` | empty | 3 / 3 (forbidden-pair swatches, exception) | 0 | 0 | 0 |
| `/clubhouse` | empty, one, season, live | 0 / 0 for empty; 1–5 for the others (lead-owned, see below) | 0 | 0 | 0 |
| `/clubhouse/courses` | empty, season | 0 / 0 | 0 | 0 | 0 |
| `/clubhouse/courses/augusta-national` | empty, season | 0 / 0 | 0 | 0 | 0 |
| `/clubhouse/courses/new` | empty | 0 / 0 | 0 | 0 | 0 |
| `/clubhouse/rounds` | empty, one, season, live | 0 for empty; 1–13 for the others (card rows, exception) | 0 | 0 | 0 |
| `/clubhouse/rounds/[id]` | one, season, live | 0 / 0 | 0 | 0 | 0 |
| `/clubhouse/rounds/[id]/[hole]` | live (holes 1, 7), season (hole 3, editing) | 0 / 0 | 0 | 0 | 0 |
| `/clubhouse/rounds/new` | empty, season | 0 / 0 | 0 | 0 | 0 |
| `/clubhouse/stats` | empty, one, season, live | 0 / 0 | 0 | 0 | 0 |
| `/clubhouse/locker` | empty, season | 0 / 0 | 0 | 0 | 0 |

Sizes: 320, 375, 390, 430, 640×400, 844×390, 768, 1024, 1280, 1440, 1920, 2560. That's 240 page loads with **zero
horizontal overflow and zero console errors or warnings**. The only clipping hits are intended: the `line-clamp-2` course
names on the Courses list (the full name is the card link's name and the course page's `<h1>`), and a type specimen whose
glyph box is taller than `leading-none` (checked in a screenshot: nothing visibly cut off).

- **Reduced motion**: 44 page loads (22 route/state pairs × 390 and 1440), **0** elements still animating. `scroll-behavior` is `auto`.
- **Text zoom 200% at 1280**: 0 overflow on every route.
- **Contrast script**: 35 of 35 token pairs pass. globals.css matches tokens.ts (20 color tokens). The mood-board script passes 20 of 20.

## axe: before → after (64 page runs at 390 + 1440)
| | Clean pages | label-content-name-mismatch | color-contrast | scrollable-region-focusable |
|---|---|---|---|---|
| Before | 3 | 266 nodes | 24 | 7 |
| After | 50 | 76 (exceptions + lead-owned) | 6 (exception) | 0 |

## Issues found → fix → re-verified
| # | Issue (WCAG) | Fix | Re-verified |
|---|---|---|---|
| 1 | The 18 Eagles header link's visible text included the roundel's SVG "E", so its name didn't match (2.5.3), on every tool page | `src/components/golf/Wordmark.tsx`: the E is defined in `<defs>` and drawn with `<use>`, so it looks the same but isn't counted as label text | axe 0 on the header, screenshot identical |
| 2 | Club tiles' names ("Driver, carries 245 yards") left out the visible "Dr 245" (2.5.3), on the hole screen and the design system | `src/components/golf/ClubPicker.tsx:109`: the name starts with the visible text ("Dr 245: Driver, carries 245 yards"), plus a space node between the two spans | axe 0 |
| 3 | Same issue on the mood-board club buttons, and the putter shows "green" | `src/app/mood-board/ClubButtons.tsx:72,81` | axe 0 |
| 4 | Round card was 1067px wide at 390 (1.4.10): the scorecard section's implicit grid column took the table's width | `src/app/clubhouse/rounds/[id]/RoundCard.tsx:121` `min-w-0` (later also covered by the lead's Page `grid-cols-[minmax(0,1fr)]`) | overflow 0 at every size |
| 5 | Scroll regions couldn't be reached by keyboard (2.1.1): research tables and screenshot strips, the flows route table, the Mermaid `<pre>` | `src/app/research/page.tsx:48,80`, `src/app/flows/page.tsx:37,44`: `tabIndex={0}`, `role="region"` + a label, and a focus ring | axe 0 |
| 6 | White text on the Rope Gray swatch, 3.56:1 (1.4.3) | `src/app/design-system/foundations.tsx:59`: that swatch is shown as a thick Rope Gray border around ink text on white, which is how the token is actually used | axe 0 for that node |
| 7 | Heat-map hole numbers at `opacity-80` measured 3.73:1 | `src/components/golf/charts/bars.tsx:114`: removed the opacity | axe 0 |
| 8 | Restyle: gold labels on `bg-white/10` over green measured 4.26:1 (hole screen "Through 6", the round card totals, the log-a-round preview) | `bg-black/15` in `HoleScreen.tsx:103`, `RoundCard.tsx:72`, `LogRound.tsx:233` | axe 0 |
| 9 | Targets under 24px with no spacing (2.5.8): course source links (19px), Locker honor links (15px), Index ledger links | `CourseView.tsx:174,186` and `Locker.tsx:261`: `inline-flex min-h-6 items-center`. The ledger was later restyled with `min-h-6 py-1` | 0 unspaced in the tool |
| 10 | Scorecard hole buttons were 36–40px wide on the hole screen (our standard there is 44) | `src/components/golf/ScorecardTable.tsx:80`: `min-w-9` → `min-w-tap` | 44×44 |
| 11 | Process-page "18 Eagles · Process hub" links were 16–22px tall | `src/app/process-header.tsx:11-12`, `src/app/mood-board/page.tsx:144,644`: `min-h-tap`, and the header padding was trimmed so its height barely changes; flows `<summary>` got `py-1` | ≥ 24 |
| 12 | Dev console LCP warnings ("add loading=eager") on /flows, /research, /clubhouse/courses | flows diagrams `loading="eager"`; research first strip eager; `CourseList.tsx:103` `eager={i < 8}` | 0 console messages at 12 sizes |
| 13 | Text zoom 200% on a phone: the hole header and the shot list overflowed by 125px | `HoleScreen.tsx`: `grid-cols-[minmax(0,1fr)]` on the header, the left column, and the putts card; `flex-wrap` on the "Through" chip; `ClubPicker.tsx:132,152` `grid-cols-[minmax(0,1fr)]` and `flex-wrap` | header and shot list now reflow (the stepper still can't, see below) |
| 14 | Button labels didn't wrap, so a 120px overflow at 320 (/rounds, /stats, design system) | Reported to the lead, fixed in 41c8c41 (Button `text-balance`, Page `grid-cols-[minmax(0,1fr)]`, nav wraps) | overflow 0 |

## Remaining exceptions (justified)
- **`/design-system` "Forbidden pairs" swatches** (3 color-contrast nodes): the "Aa" samples show the failing pairs (yellow on
  white, red on green, gray on green) on purpose, so the reader can see why they're banned. They're `aria-hidden`, and the
  ratio is written in text beside each one. This is incidental text under 1.4.3.
- **`/clubhouse/rounds` card rows** (1 per card): each row link has a spoken name ("Wednesday, October 14, Rancho Santa Fe,
  Blue tees, 18 holes: 87, 15 over par") in place of the abbreviated visible text ("Wed 14 … 87 +15"). The course name, the
  row's main label, appears word for word in the name, so "click Rancho Santa Fe" works in voice control. If a strict
  pass is wanted: in `Cards.tsx` `CardRow`, drop `aria-label` and the three `aria-hidden` wrappers, so the visible text
  becomes the name.
- **`/research` source lists**: at 1440, 14 bare-domain source links (18px tall) are stacked closer than 24px. They're
  citations on a process page, not the tool. 2.5.8 is AA, and the hub pages aren't the graded tool.
- **Text zoom 200% on a 390 phone** (stricter than WCAG: it's like a 195px-wide screen, under the 320px reflow floor):
  `Stepper` (− value +) needs about 384px and the bottom tab bar's "Locker" label sits past the edge. At 1280 with 200% text,
  and at 320 with normal text, everything reflows.
- **Below 44px outside the hole screen**: chart points (28×28), the Clubhouse `<summary>` (25px), and bare links at 24–32px.
  All are at least 24px, which meets `docs/accessibility.md` ("≥ 24×24px everywhere else"). On the hole screen everything is
  at least 44×44 (the sr-only skip link is measured while hidden; it's 44px tall when it's focused).

## Lead must fix (files I don't own)
1. **`src/app/clubhouse/_components/Clubhouse.tsx:340`** "Last 5 cards" tiles fail 2.5.3 (1–5 nodes per page). The name has
   to start with the visible text, and the spans need a space between them:
   `aria-label={`${d.gross} ${toParText(d.toPar)} ${fmtDate(d.round.date, { month: "short" })}: ${d.course.shortName}, ${fmtDate(d.round.date)}`}`,
   plus `{" "}` between the three `<span>`s.
2. **`Clubhouse.tsx:102`** `<summary>` "Start a different round instead" is 25px tall. Add `py-2.5` (or `flex min-h-tap items-center`) to reach 44.
3. **`src/components/golf/AppNav.tsx`** bottom tabs: with phone text at 200%, the "Locker" label runs past 390px. Let the
   labels wrap (drop `truncate`, add `text-center leading-tight`) or hide the labels behind `aria-label` past a rem breakpoint.
4. Already done by the lead in 41c8c41: Button wrapping, the Page grid column, and wrapping the desktop nav under zoom.
