# Keyboard, screen-reader, and semantics verification

Checked against `docs/accessibility.md` on 2026-10-19, with the keyboard only (Tab, Shift+Tab, Enter, Space, the arrow
keys, Home/End, Escape) in headless Playwright Chromium at 1280px and 390px, on the dev server. Each flow was run from a
seeded state (`empty`, `one`, `season`, `live`). Evidence comes from the focused element (role, name, and its computed
outline) after every key press, `ariaSnapshot()` of `main`, the text of every `aria-live`/`role=status` region, and
focus-ring screenshots. The automated axe and viewport audit is in `docs/verification.md`, written by a separate agent.

The iOS restyle was going on during this pass. Rings were confirmed on the restyled pages: ink `#25282A` on white,
yellow `#FCE300` or white on the green bar, and the new tab bar.

## Fixed in this pass

| # | Issue | Fix | Re-verified |
|---|---|---|---|
| 1 | After a client-side route change, focus stayed on the old link or dropped to `<body>`. The Next route announcer sometimes read a stale title (it read "Your locker is ready." when you teed off). | New `src/components/golf/RouteFocus.tsx`, mounted in `src/app/clubhouse/layout.tsx`. On a real pathname change (not the first load, not React's dev double-run), it waits for the new page's own `main h1` (skipping the `aria-busy` placeholder), sets `tabindex=-1`, focuses it with no ring (inline `outline: none`; it's a heading, not a control), and uses `preventScroll`. | Nav to Courses, Locker, and Stats; Tee off; Resume; Hole N → N+1; save a course; log a round; delete a card; open a trend point. Every time, focus lands on the new `h1`, and the next Tab reaches the page's first control. On first load, the skip link is still the first Tab stop. |
| 2 | Hole-by-hole titles were overwritten by the route's metadata title ("Playing a hole · 18 Eagles") after a client-side navigation. | `DocTitle` (HoleScreen.tsx, also used by RoundCard) re-applies its title when Next rewrites `<head>` (a MutationObserver, disconnected on unmount). | Hole 8 and 9 after a client-side navigation read "Hole 8 · Rancho Santa Fe · 18 Eagles" at 300ms, 1s, and 3s. |
| 3 | ClubPicker: **Clear** swaps to **Undo clear**, and **Remove last** disables itself at zero shots, so focus dropped to `<body>`. | `ClubPicker.tsx`: focus goes to Undo clear after Clear, to Remove last after Undo, and to the first club when the last shot is removed. | Clear → "Undo clear", Undo → "Remove last", remove ×2 → "Dr: Driver". |
| 4 | Stepper: a − or + button that disables at its limit dropped focus. | `Stepper.tsx`: focus moves to the opposite button when a limit is reached. | Putts up to 10 → focus on "Fewer putts"; down to 0 → focus on "More putts". |
| 5 | The shots-vs-score question and the "Holes … have no score yet" panel appeared silently. | `HoleScreen.tsx`: each now sits inside an always-mounted `aria-live="polite"` wrapper (`display: contents` for the first one). | The live text includes "Holes 8, 9, … have no score yet. Score every hole…". |
| 6 | The running "Through 7 / +8 / 35 strokes" live region read as "Through 7+835 strokes" (flex spans, no spaces). | `HoleScreen.tsx`: visually hidden ", " separators. | The read text is now "Through 7, +8, 35 strokes". |
| 7 | `Callout` was an `<aside>`, so every callout became a complementary landmark inside `main`. | `Callout.tsx`: changed to `<div role="note">`. | The snapshot shows `note`, and callouts no longer appear among the landmarks. |
| 8 | Stats: **Reset filters** and **Show every round** disappear after use, and so do the "Pick a course" buttons. Focus dropped each time. | `Stats.tsx`: reset puts focus on the checked Range radio, and picking a course puts focus on the "Hole by hole" heading. | After reset, focus is on radio "All". |
| 9 | Locker: four or more honors links had the same name ("21 Jun 2026: see the card"). **Remove my index** dropped focus. | `Locker.tsx`: the names now include the honor ("…: see the card for Broke 90"), and focus returns to the index field. (The lead's restyle commit `9c62631` picked these up.) | Names are distinct in the walk. |

## Flows walked

**1. First visit (`empty`), 1280px.** The first Tab is "Skip to main content" (yellow ring). Enter goes to `#main`,
which is focused. Tab order: Handicap Index field → Use this index → Not yet → Tees radiogroup (one stop) → Holes
radiogroup → Tee off → Choose another course → Log a round → course plate link → the header and nav.
- Empty submit: focus stays in the field with `aria-invalid=true`, `aria-describedby="…-err …-hint"`, and the error
  "Enter your Handicap Index, like 12.4. Or choose "Not yet"."
- "abc" → "Use numbers only, like 12.4…", and the value is kept. "60" → "…runs from +10.0 to 54.0…", value kept.
- "12.4" is accepted and the hero shows Handicap Index 12.4. **Focus drops to `<body>`** (Lead must fix, A).
- Goal: Tab lands on "Break 100". **ArrowDown picks "Break 90" right away, the section unmounts, and focus drops to
  `<body>`.** A keyboard user can't reach "Break 80" or "scratch" without committing a different goal first
  (Lead must fix, B).

**2. Tee off → hole screen (`one`, `live`).** Tee off moves focus to `h1` "Hole 1", the title reads "Hole 1 · Rancho
Santa Fe · 18 Eagles", and the announcer reads the same.
- Tab order: Clubhouse back link → "The card so far" summary → scorecard scroll region → 18 hole buttons → score
  radiogroup (one stop, on par) → More: 7 or higher → putts −/+ → penalties −/+ → fairway radiogroup (par 4 and 5 only)
  → 14 club buttons → Remove last / Clear → note → ← Hole 6 / Hole 8 → or Finish round.
- Score tiles: Right/Left/Home/End move and choose, and the region announces "Hole 7: 4 strokes, bogey." More/Fewer
  toggle with `aria-expanded`.
- Clubs: "Shot 3: Putter. 3 strokes on hole 7." The mismatch callout appears with "Use N as my score / Keep N".
- Putts are announced as "Putts: 2 putts". Fairway arrows go Missed left → Hit (checked). The note is kept across holes.
- Finish round with holes missing: the panel is announced and the next Tab goes to "Score hole 7". After every hole is
  scored, Finish moves focus to the card page `h1`, the title reads "Rancho Santa Fe, Oct 14: 81 · 18 Eagles", and the
  toast region says "Card saved: 81 at Rancho Santa Fe".
- Card page: one `h1`, then h2s in order. The scorecard is a real `<table>` with a caption and row/column headers, and
  the cells are spoken ("Triple bogey, 7"). Tab order: Play here again → table region → hole buttons → note → Delete
  this card → toast Dismiss.

**3. Add a course.** Tab order: Course name → City → Holes radios → 18 par radiogroups (one stop each, named by
legend "Hole N par") → Tees → Course rating → Slope → Total yards → Add the course → Cancel. The test entered City "San
Diego, CA", rating "abc", and slope "400", then submitted.
- Focus goes to Course name, the first field with an error. Every invalid field has `aria-invalid=true` and its error
  first in `aria-describedby`. Typed values are kept ("abc" and "400" are still there).
- The summary (`role=status`) reads "4 things to fix above. What you typed is kept."
- Arrow keys on a par change it, and the region announces "Par 73 for 18 holes".
- After fixing and saving, focus goes to the new course's `h1`, the title is the course name, and the toast says
  "Added …".

**4. Log a round.** Tab order: Course select → Tees → Date (with the picker button) → Holes → Entry mode → Total →
Note → Save the card.
- Future date: focus goes to Date, with "Pick today or an earlier date…". Empty total: "Enter your total score, or
  switch to hole by hole." "abc": "Enter your total as a whole number, like 88." (value kept).
- In hole-by-hole mode, focus goes to "Hole 1 · par 4" with its error. After saving, focus is on the card `h1`.

**5. Stats, Cards, Locker.**
- Stats: one stop for each of Range, Course, and Holes. The `role=status` count updates ("Showing 5 of 13 rounds").
  "Show as table" is a button with `aria-expanded` and `aria-controls`, and the table has a caption and header scopes.
- Trend points are focusable `role=button` with names like "Jun 21, Torrey Pines South: 87". A drawn ring is visible
  (screenshot), and Enter opens the card. Each chart is a `figure` with a heading and a text-summary figcaption; the
  bar charts are `aria-hidden` and have a table alternative.
- Cards: each row is one link with a full spoken name ("Wednesday, October 14, Rancho Santa Fe, Blue tees, 18 holes:
  87, 15 over par. Note: …"). Deleting a card moves focus to the Cards `h1` with a toast that has an Undo.
- Locker: the bag chips are `aria-pressed` buttons, and the region announces "13 of 18 clubs in the bag".
  - Index: "abc" gets an error linked to the field. Import of a bad file gets a linked error, and focus stays on the
    file input.
  - **Erase everything** opens a native `<dialog>` named "Erase everything?" with its body as the description. Focus
    starts on "Keep my data", Tab cycles inside the dialog (plus the browser chrome, which is native behavior), and
    Escape closes it with focus back on the opener. Confirm erases and goes to the first-visit Clubhouse.

**6. Everywhere.**
- `<html lang="en">`. Each route has its own title: Clubhouse, Courses, Add a course, the course name, Hole N ·
  course, the card, Cards, Log a round, Stats, Locker.
- One `h1` on every tool page, with no skipped levels (checked on 13 routes).
- Landmarks: header, one visible `nav[aria-label="18 Eagles"]` (the bar and the tab bar are never shown together),
  `main#main`, and a footer from md up. `aria-current="page"` is on the current tab.
- Icon-only controls are named (Dismiss, the "18 Eagles, the clubhouse" wordmark link, the stepper −/+). Every visible
  link and button has a name. Decorative images use `alt=""` (the hero and course photos, which sit next to text), and
  the hole drawings are `role=img` with a `<title>`.
- Number fields use `type=text` with `inputMode` numeric or decimal. City uses `autocomplete="address-level2"`.
- Links navigate and buttons act. Nothing traps focus. Toasts are in one polite `role=status` region.

## Lead must fix (owned files)

**A. `src/app/clubhouse/_components/Clubhouse.tsx`, `IndexQuestion`.** After "Use this index" or "Not yet", the form
unmounts and focus drops to `<body>`. After each `patchProfile(...)` call (the submit handler and the Not-yet
`onClick`), add:
```ts
requestAnimationFrame(() => { const h = document.getElementById("hero-title"); if (h) { h.tabIndex = -1; h.style.outline = "none"; h.focus(); } });
```

**B. `Clubhouse.tsx`, `GoalQuestion`.** The radios save on change, so the first arrow key commits a goal and unmounts
the question. Keep the choice in local state and save it with a button:
```tsx
const [g, setG] = useState<Goal | null>(null);
<ChoiceGroup … value={g} onChange={setG} />
<Button variant="primary" disabled={!g} onClick={() => { patchProfile({ goal: g! }); requestAnimationFrame(() => document.getElementById("tee-off")?.focus()); }}>Save my goal</Button>
```
`tee-off` needs `tabIndex={-1}` on the SectionHeading's heading, or set it inline the same way as in A.

Nothing else was found in AppShell, AppNav, Button, Card, SectionHeading, or TeeOff. Skip link, landmarks, nav labels,
`aria-current`, and rings all pass.

## Remaining (not fixed, low risk)

- The Toast's **Undo** comes after `main` in the DOM. A keyboard user may have to Tab through a long page to reach it
  within 8s (the timer pauses only once the toast has focus). Possible fixes: keep action toasts open until dismissed,
  or add a documented shortcut.
- On the hole screen, "The card so far" is open by default and puts 18 hole buttons before the score tiles in the Tab
  order. Consider closing it by default on phones, or moving the score section first in the DOM.
- `/design-system` has three `h1`s (PageHeader specimens) and some h1 → h3 jumps inside specimens. That page isn't the
  tool; the specimens could render with `role="presentation"`, or with an `as` override on the heading.
- The `/` hub has no skip link. It has no nav before `main`, so a skip link isn't needed.
