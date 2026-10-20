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

## Pass 3 (forms, new screens) — 2026-10-19

Scope: everything new since pass 2 (the name dialog, setup steps with Back/Change, the home-course tiles and search, the
bag step, the new-golfer showcase, the trophy case and `/clubhouse/trophies`, the challenge card, the Locker name form,
the iOS restyle), every form field, and the course checklist in `docs/a11y-requirements.md`. Playwright only (bundled
Chromium, headless), dev server on :3300. New seeded states (scratch page, not committed): `named` (name only),
`step1` (index done), `step2` (home course done), `setdone` (bag done, no cards), plus `empty/one/season/live`.

### Per-form checklist
Columns: label tied (L) · hint tied (H) · error tied + `aria-invalid` (E) · focus to first error (F) · typed values kept,
on error and on leaving/returning (K) · input type / inputmode / autocomplete / enterKeyHint (T) · group semantics +
arrows (G) · Enter submits (N). ✓ = checked in the browser this pass; "p2" = proven in pass 1/2 and unchanged.

| Form | L | H | E | F | K | T | G | N | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Name dialog | ✓ (`<label>` inside the `h1`) | ✓ fixed | ✓ | ✓ (re-announced on Enter, fixed) | ✓ | ✓ given-name, words, go | n/a | ✓ | Escape can't drop it any more (fixed) |
| Index question | ✓ | ✓ | ✓ | ✓ fixed (Enter) | ✓ (Back keeps 12.4) | ✓ fixed: text keypad so "+" can be typed | n/a | ✓ | narrower field (L4) |
| Home course | ✓ search label now visible | ✓ | ✓ fixed (on tiles too) | ✓ first tile, or search if none | ✓ fixed: pick kept across Back/Change | ✓ search, enterKeyHint | ✓ native radios, arrows | ✓ Enter picks a single match | |
| Bag | ✓ chips (`aria-pressed`) in labelled groups | ✓ | ✓ tied to the button | button keeps focus, alert once | ✓ (saved per tap) | n/a | ✓ | n/a | bypass link added |
| Goal (Clubhouse) | ✓ legend | — | ✓ fixed (was a silent disabled button) | ✓ | ✓ | n/a | ✓ arrows don't commit | n/a | |
| Tee off | ✓ legends | ✓ hint, plain words | n/a | n/a | ✓ tee remembered | n/a | ✓ | n/a | |
| Hole screen | p2 | p2 | p2 (putts) | p2 | p2 | p2 | p2 | n/a | score tile names fixed (2.5.3), bypass link |
| Add a course | p2 | p2 | ✓ axe 0 with errors | p2 | p2 (draft) | p2 | p2 | ✓ | |
| Log a round | p2 | p2 | ✓ axe 0 with errors | p2 | p2 (draft) | p2 | p2 | ✓ | |
| Locker index / name | ✓ | ✓ | ✓ | ✓ fixed (Enter) | ✓ | ✓ name: given-name, words | n/a | ✓ | Save name kept focus (fixed) |
| Locker goal / home / bag / import | ✓ (home select's label is sr-only, same words as the visible caption) | ✓ | import ✓ | ✓ | ✓ | file accept .json | ✓ | n/a | goal saves on choose (says so), no focus move |
| Locker dialogs | ✓ | body = description | n/a | focus on "Keep my data" | n/a | n/a | n/a | n/a | axe 0 open, Esc closes |
| Stats / Courses filters | p2 | p2 | n/a | n/a | n/a | p2 | p2 | n/a | |

### Issues → fixes → re-verified
| # | Issue (WCAG / checklist id) | Fix (file) | Re-verified |
|---|---|---|---|
| 1 | Pressing Escape twice closed the name dialog in Chrome (its anti-abuse rule ignores a prevented `cancel`), leaving a blank Clubhouse (2.1.1, U5) | `Onboarding.tsx` NameGate: on `close`, if no name was saved, `showModal()` again and refocus the field | 3× Esc: still open, focus in the field |
| 2 | Pressing Enter in a field with an error left focus where it was, so the new error wasn't announced (3.3.1, 4.1.3) | New `focusInvalid()` in `ui/Field.tsx` (blur, then focus); used by the name, index, home course, Locker index/name/import, goal | focus + description reads the error after Enter and after a click |
| 3 | Name and home-course errors were `role=alert` *and* focus moved to the field: read twice | `Onboarding.tsx`: dropped `role=alert` there (focus + `aria-describedby` reads it once); the bag error keeps its alert (focus stays on the button) and is tied to the button | describedby text checked |
| 4 | Name hint not tied (L5) | `Onboarding.tsx`: `golfer-name-hint` in `aria-describedby` | description includes the hint |
| 5 | Home-course search used a placeholder as its only visible label (3.3.2, L2) | `Onboarding.tsx`: the "Search courses" label is visible | snapshot `searchbox "Search courses"`, visible |
| 6 | Home-course error only on the fieldset; tiles didn't carry it | `Onboarding.tsx`: fieldset `role=radiogroup` + `aria-invalid`; each tile's radio gets `aria-describedby` | first tile's description = the error |
| 7 | "Back to your index" (and "Change") forgot the course tile you'd picked (3.3.7 redundant entry, L9, E3) | `Onboarding.tsx`: the pick is kept in `lastHome` on every pick and on Back | Back → re-save index → tile still checked |
| 8 | "In the bag0 of 14 allowed" (live region, no space) | `Onboarding.tsx`: `{" "}` between the spans | read text "In the bag 0 of 14 allowed" |
| 9 | Index field on the first visit used the decimal keypad, which has no "+" on iOS, but the hint says "+1.2" | `Clubhouse.tsx` IndexQuestion: `inputMode="text"` like the Locker; field sized `max-w-[10rem]` (L4) | attribute checked; "+1.2" accepted |
| 10 | Goal "Save my goal" was disabled with no reason (E5) | `Clubhouse.tsx` GoalQuestion: always enabled; empty save shows "Choose a goal first. It's optional…" tied to the group, focus to the first choice | axe 0 in the error state |
| 11 | Locker "Save name" remounted the form, so focus fell to `<body>` | `Locker.tsx`: focus returns to `#l-name-save` | focus "Save name" after saving |
| 12 | **Focus obscured (2.4.11)**: at 390, Tab left chips, clubs, putts, Locker rows and Stats rows fully under the tab bar or the sticky action bars (up to 39 stops per page) | `RouteFocus.tsx` new `FocusClear` (mounted in `clubhouse/layout.tsx`): after each focus change, scroll just enough to clear bars marked `data-obscures` (header, tab bar, setup bars, hole bar); `scroll-padding` on `html` (globals.css) for anchor jumps | 0 hidden stops on 9 route/states at 390 and 3 at 1280 (the only hits left are the fixed skip link over the header, which is above it, a false positive) |
| 13 | Main actions far down the Tab order: "Hole N →" ~50 Tabs (after clubs and the 18-hole card), "That's my bag" 19 Tabs (2.4.1, 2.4.3) | `ui/SkipLink.tsx` new `SkipTo` (hidden until focused, shown in place). Hole screen: "Skip to Hole N / Finish round" right after the score tiles. Bag: "Skip the clubs to That's my bag" | hole: tab 6 → next button; bag: tab 6 → button; screenshot `holeskip.jpeg` |
| 14 | Score tiles were named "1, hole in one" with "1 ACE" on screen (2.5.3, T3) | `ScoreTiles.tsx`: "1 Ace: hole in one", "5 Double: double bogey", "4 Par" | axe/T3 sweep clean |
| 15 | Putter tile name read "Pt green: Putter" (first-run check) | `ClubPicker.tsx`: "Pt green: Putter, on the green" (visible text first, as 2.5.3 needs) | axe 0 on the hole screen |
| 16 | Challenge "See the card" was 20px tall and had a vague name (2.5.8, 2.4.4) | `Challenge.tsx`: `min-h-6`, sr-only "from {course}, {date}" | 24px, unique name |
| 17 | Hero photo credit, white/80 at 11px over the photo: 2.35:1 (1.4.3, C4) | `Clubhouse.tsx`: credit on `bg-black/55`, full white | ≥ 5.9:1 at 390 and 1280 |
| 18 | Setup-step text over the right end of the hero wash at 1280: 4.04–4.14:1 | `Clubhouse.tsx`: wash end stop 0.55 → 0.72 | ≥ 5.4:1 |
| 19 | "Won · Gold" (gold on a won trophy niche, `bg-white/9%`): 4.33:1 | `TrophyCase.tsx`: niche `bg-white/5%` | 4.73:1 measured |
| 20 | Failed saves were silent (E6) | `store.ts`: `persist()` tracks failure, `useSaveFailed()`, `retrySave()`; new `golf/SaveProblem.tsx` (`role=alert`, "Couldn't save on this device… Try again"), mounted in the layout | `setItem` stubbed to throw: alert shown and announced, Try again keeps it with more advice, restoring storage + Try again writes the card and clears it; axe 0 |
| 21 | "Saved on this device" only in the md+ footer (U6) | `AppShell.tsx`: the footer shows on phones too (padding clears the tab bar), and says clearing browser data erases the cards; Locker "Your data" lede says the same | screenshot; overflow 0 at 320 |
| 22 | That footer caused a 0.245 layout shift on slow loads (Z2) | `Placeholder.tsx` and the name-dialog wrapper are a screen tall | CLS 0 on empty/season/live at Fast 3G + 4× CPU |
| 23 | Rating and slope, Handicap Index unexplained where first asked (U1) | `TeeOff.tsx` and `Clubhouse.tsx` hints in plain words | text checked |
| 24 | 200% text on a 390 phone: showcase mock rows overflowed 43px | `Showcase.tsx`: `flex-wrap` on two mock rows | 0 overflow |

### Checks run (all after the fixes)
- **axe** (wcag2a/aa, 21, 22aa, best-practice) at 390 and 1440 on every tool route × `empty, named, step1, step2, setdone, one,
  season, live`: 0 violations. **Error and dialog states** at 390 and 1280: name error, index error, home-course error, bag
  error, goal error, Locker index + name errors, erase dialog, sample dialog, toast, add-a-course errors, log-a-round
  errors, the save-failed notice: 0, except `target-size` on chips/the back link that sit *under* the sticky bar or the
  toast at that scroll position (overlap, not size; every control is ≥ 44px).
- **Label in name** (CDP accessibility tree vs `innerText`, 18 route/states): only the wordmark (its "E" is drawn, pass-1
  #1), native selects (option text), and the card rows (pass-2 exception) remain.
- **Headings, landmarks, title, lang**: one `h1` and no skipped level on all 18; `lang="en"`; unique titles; the name
  dialog's `h1` is the page's only `h1` while it's open.
- **Focus ring** sweep at 1280 (outline ≥ 2px and ≥ 3:1 against what's behind): all pass on paper, green, and inside the
  dialog; the brass plates use a dark ring.
- **Contrast over photos and plates** (text hidden, screenshot, 10th-percentile background under each text box vs its
  color): hero, name dialog, trophy case, challenge, showcase, Trophy Room, Locker: all text ≥ 4.5:1 (≥ 3 large) after
  fixes 17–19. What still flags is decorative (`aria-hidden` step numerals and the "E" roundel, the showcase mock inside a
  labelled `role=img`) or the sampler hitting a badge's own rounded corners. Token script: all pairs pass; globals.css
  matches tokens.ts.
- **Reduced motion**: 0 running animations on 9 route/states (trophy rise and sheen run only with `no-preference`).
- **Reflow**: 0 overflow at 320; 200% text at 1280: 0; 200% text at 390: only the hole bar's "HOLE 8 →" button (beyond
  WCAG: that's a 195px viewport).
- **Slow device** (Fast 3G + 4× CPU, dev build): placeholder with `aria-busy` while loading, CLS 0.
- **F2**: arrow keys on home-course tiles, goal, tees and the Locker goal never scroll or move focus.
- **K5 keyboard-only walk** (390 and 1280, fresh): name → index → search "rancho" + Enter → Continue → bag skip →
  That's my bag → Front 9 → Tee off → 9 holes (score tile, Space, skip link, Enter) → card page: **87 keys, 0 stuck
  points**, focus ends on the card's `h1`.

### Checklist map (`docs/a11y-requirements.md`)
| Id | Result | Evidence |
|---|---|---|
| K1–K4 | pass | p2 walks + K5 walk above |
| K5 | pass | 87 keys, 0 stuck (above) |
| K6 | pass / fixed | name, index, Locker forms submit on Enter; search Enter picks a single match |
| F1 | pass | ring sweep |
| F2 | pass | scroll/focus unchanged on every choice |
| L1–L3 | pass / fixed | #5; T3 sweep |
| L4 | fixed | #9; number fields narrow, notes are textareas |
| L5 | fixed | #4; Field ties hints everywhere |
| L6 | pass | numeric/decimal; index is text by design (+) |
| L7 | pass | one column (p2) |
| L8 | pass | optional fields say "(optional)"; the onboarding steps are each one required question |
| L9 | fixed | #7; name, index, tees, home course prefilled when asked again |
| L10 | pass | Field/ChoiceGroup everywhere; NameGate's own input matches the pattern (label, hint, error with icon) |
| E1–E4 | pass | error states above; icon + text |
| E5 | fixed | #10; remaining disabled controls say why next to them (no shots → "No shots yet…"; full → "That's N shots…"; steppers show the limit value) |
| E6 | fixed | #20 |
| E7 | pass | card delete Undo (p2), Erase/Sample dialogs, import Undo |
| E8 | pass | toasts in one polite region |
| C1–C3 | pass | token script, sweep |
| C4 | fixed | #17–19 |
| C5 | pass | one primary per screen section (lead-owned design) |
| H1–H2 | pass | |
| H3 | pass | each setup question is the `h2` of its section; the name question is the `h1` |
| H4 | pass | |
| H5 | pass | back links share one look; "Tee off", "Continue" used consistently |
| H6 | pass | round card, hole, course pages and Trophy Room have a named back link |
| H7–H8 | pass | axe; native dialog |
| I1–I3 | pass | decorative photos `alt=""`, trophy art `aria-hidden` with text beside, charts p2 |
| M1 | pass | reduced motion |
| M2 | n/a | nothing auto-plays over 5s |
| M3 | pass | no timeouts; action toasts stay until dismissed |
| T1 | pass | ≥ 44 in the tool |
| T2 | pass | 2.5.8 spacing test 0 unspaced; Remove last/Clear sit apart from the club grid |
| T3 | fixed | #14–15 |
| Z1 | pass | 320, 200% text |
| Z2 | fixed | #22 |
| R1 | **manual** | VoiceOver script below |
| R2, R4 | pass | snapshots, live regions |
| R3 | pass | first-run check used the accessibility snapshot (docs/first-run-check.md) |
| U1 | fixed | #23; differential is explained on Stats |
| U2–U4 | pass (design) | one question per step; empty states have one action |
| U5 | justified | the full-screen name dialog was asked for by the user as *the first screen*: it is the whole page (nothing behind it yet), not a pop-up over content; it has one field and one way forward, keeps focus inside, can't be lost with Escape (#1), and a screen-reader user hears "dialog, What should we call you?" with the field focused |
| U6 | fixed | #21 |
| U7 | pass | no sound or vibration in `src` |
| U8 | pass | trophies and challenges never shame or expire your data; nothing buzzes |
| U9 | pass | "18 Eagles" in title and h1 |
| P1 | pass | AGENTS.md |
| P2 | pass | axe on every state incl. errors and dialogs |
| P3 | pass | this table: each fix named, each re-run |
| P4–P5 | manual | real people; the lead's first-run check |

### R1: VoiceOver script (the one manual step)
On a Mac in Safari: Cmd-F5 to start VoiceOver. Open `/clubhouse` in a private window.
1. You should hear "What should we call you?, dialog" then the text field and its hint. Press Return with it empty:
   "Type your name…". Type a name, Return.
2. VO-U, Headings: "Welcome to 18 Eagles, …" (h1) then "Do you have a Handicap Index?". Type 12.4, Return.
3. Tab to "Search courses", type "rancho", Return; Tab, Space on "Continue". The bag: Tab once, hear "Skip the clubs…",
   Return, Return. Tee off.
4. On the hole: Tab to the score tiles; arrows read "4 Par", "5 Bogey"; Space chooses and you hear "Hole 1: 4 strokes,
   par." Tab to "Skip to Hole 2", Return, Return.
5. Note anything not read, read twice, or read in the wrong order in DESIGN_LOG.md.

### Left
- The name dialog asks for nothing else and has no "skip": by the user's design (U5 above).
- 200% text on a 390 phone: the hole bar's Hole N buttons overflow by ~45px (stricter than WCAG).
- Card rows on `/clubhouse/rounds` keep their spoken name (pass-2 exception).
- Stroke index on the hole screen isn't explained in words (a golf term for new golfers).
- R1 (VoiceOver) and P4 (real people) are manual.
