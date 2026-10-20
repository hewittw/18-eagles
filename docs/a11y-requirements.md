# Accessibility Requirements from the Week 3 Materials

Every accessibility requirement, recommendation, tip, and checklist item in this week's course materials, with its
source, a short quote, and a concrete test for **18 Eagles**. This file only collects and cross-checks them. The
working checklist the agent builds against is still `docs/accessibility.md`. Items it does not cover yet are marked
**GAP** here and listed again at the end.

## Sources read (all of them)

| Code | File | How it was read |
|---|---|---|
| **PDF** | `../Design, Build, Ship - Assignment 3 - Patterns & Flows.pdf` (4 pages) | Every page |
| **S#** | `../Design, Build, Ship - Week 3 - Slides/slides/*.png` (92 PNGs) plus the `alt` text in `index.html` | Viewed every PNG. Every `.mp4` (04, 05, 07, 08, 10, 16, 19, 20, 23, 24, 35, 45, 46, 47, 49, 64, 69, 79, 92) has a same-numbered PNG. Mid-clip frames of 20, 24, 46, and 79 were also checked, and none adds content. Files 15, 85, and 90 don't exist. |
| **SV** | `../Design, Build, Ship - Week 3 - Slides/index.html` and `README.txt` (the slide viewer) | Slide data (titles plus alt text; there are no speaker notes) and the viewer's own markup |
| **ASYNC** | `../Design, Build, Ship - Week 3 - Async/index.html` | Base64 removed, then read. It has one chapter ("Assignment 3 Walkthrough", 62 min): a summary, caption tracks, and no activities or quizzes (`acts: []`). The rest is the player code. |
| **VTT** | `../Design, Build, Ship - Week 3 - Async/videos/01-starting-assignment-3.vtt` (English) | All 922 cues. Timestamps are `[hh:mm:ss]`. |

**Slide numbering.** The deck counts slides differently from the file names, because files 15, 85, and 90 are
missing. Citations below give both, as **S76 (77.png)**. Deck numbers 1–14 match their file names. From deck 15 to
83, the file is the deck number plus 1. Deck 84–87 are files 86–89, and deck 88–92 are files 91–95.

**Strength of each source.** Each item gives where it comes from:
- **Graded**: stated in the assignment PDF's steps, Design Requirements, or Assessment.
- **Lecture**: taught on a slide.
- **Walkthrough**: said or done in the async recording.
- **Modeled**: not stated, but built into the course's own pages (the slide viewer and the async player).

**How to read "Verify".** The tests use Playwright only (per `AGENTS.md`), at 1280px and 390px, against the dev
server or the deploy. "Fresh" means `localStorage.removeItem('18eagles:v1')` and then a reload. VoiceOver tests are
for the user to run by hand on a Mac.

---

## 1. Keyboard

### K1. Everything works with a keyboard (Graded)
- **Source:** PDF p.3, §7 "Make It Accessible": *"Everything should work with a keyboard."* Also PDF p.3, Design
  Requirements: *"Accessibility: everything works with a keyboard"*; PDF p.4, Assessment: *"Keyboard access"*;
  S85 (87.png): *"Accessible: Keyboard, labels, contrast, and a screen reader."*; S73 (74.png), WCAG Operable:
  *"Keyboard, Tap Targets, Enough Time."*
- **Verify:** Start fresh with the mouse unplugged in spirit: use `page.keyboard` only, never `click`. Do all three
  flows: (1) first visit on `/clubhouse` (Handicap Index → tees → Tee off); (2) score a whole hole on
  `/clubhouse/rounds/[id]/[hole]` (strokes stepper, club picker, putts, notes, next hole) through to the card;
  (3) come back (reload) → Resume. Also add a course (`/clubhouse/courses/new`), log a past round
  (`/clubhouse/rounds/new`), change Stats filters, and edit the Locker. Pass: every step finishes, and nothing needs a
  pointer.
- **accessibility.md:** Covered (Keyboard, item 1).

### K2. Controls are real `<button>` elements that respond to Tab, then Enter (or a tap) (Lecture)
- **Source:** S74 (75.png), "Designing Easy Interactions": *"A control works visually, in code, and through
  interaction."* It shows `<button>Send</button>` with *"Tab, then Enter. Or tap."* S80 (81.png), "Fix by Name":
  *"make Save a real button."* S82 (83.png): *"Label every field and use real buttons, for screen readers and
  agents."*
- **Verify:** In the browser, run
  `document.querySelectorAll('[onclick]:not(button):not(a), div[role=button], span[role=button]').length` on every
  route. It should be 0. Then, for each button, Tab to it and press Enter, then Space, and confirm that both work.
- **accessibility.md:** Covered (Keyboard, item 4; `AGENTS.md` adds "real `<button>`/`<a>` elements only").

### K3. Tab through everything with Tab, Enter, Space, and Esc (Lecture)
- **Source:** S79 (80.png), "Testing for Accessibility", Keyboard card. It shows the keys Tab, Enter, Space, and Esc,
  with *"Tab through everything. Can you see where you are, and use it all?"*
- **Verify:** On each route, press Tab until focus wraps. Log `document.activeElement` (role and name) after every
  press, and check that every interactive element shows up. Open any dialog or sheet (for example, deleting a card),
  then press Esc. It should close, and focus should return to the button that opened it.
- **accessibility.md:** Covered (Keyboard, items 1 and 3).

### K4. Tab order matches the order you see (Lecture)
- **Source:** S76 (77.png), "An Accessible Form", callout 5: *"Tap Targets big enough, reached with Tab in the order
  you see."*
- **Verify:** On `/clubhouse/courses/new` and on the hole screen, record each focused element's bounding box
  (top, then left) in Tab order. The sequence should run top to bottom and left to right, with no backward jumps,
  at both 1280px and 390px (the layout changes order at 390).
- **accessibility.md:** Covered (Keyboard, item 3).

### K5. An agent walks the main task by keyboard and reports where it got stuck (Lecture)
- **Source:** S80 (81.png), "Making It Accessible with an Agent", step 4, Try the Keyboard: *"Go through the main
  task using only the keyboard, and tell me where you got stuck."*
- **Verify:** Give a fresh agent only the deploy URL and the goal "Play a 9-hole round using only the keyboard."
  Save its stuck points in `docs/verification-keyboard.md` (or the README first-run section). Pass: it reports no
  stuck points, or each one it reports has a fix commit.
- **accessibility.md:** **Partial / GAP.** "How we check" has Playwright tabbing each page, but there's no end-to-end
  main-task walk with a written list of stuck points.

### K6. A single-field entry submits with Enter (Walkthrough)
- **Source:** VTT [00:23:16]: *"On today, one field where you type gym one hour and press enter."*
- **Verify:** Each field that adds something (the Handicap Index on the first visit, notes, and course name or search
  fields) sits in a `<form>`. Type a value and press Enter. It should submit (or move to the next step) without a
  Tab to the button.
- **accessibility.md:** **GAP.** It doesn't say that forms submit with Enter.

## 2. Focus

### F1. You can always see where focus is (Lecture)
- **Source:** S79 (80.png): *"Can you see where you are, and use it all?"* Focus rings are drawn on the Send button
  in S74 (75.png), on Save Habit in S76 (77.png), and on the skip link in S77 (78.png).
  **Modeled:** ASYNC uses `:focus-visible{outline:3px solid var(--focus);outline-offset:2px}`.
- **Verify:** Tab to every control on every route and take a screenshot. For each focused element, check
  `getComputedStyle(el).outlineStyle !== 'none'` (or a box shadow is present), the width is at least 2px, and the
  ring is at least 3:1 against what's behind it. Test on each surface: paper, the green bar, the dark tab bar, and
  photos.
- **accessibility.md:** Covered (Keyboard, item 2).

### F2. Don't move the page or focus on its own after a choice (Walkthrough)
- **Source:** VTT [00:57:21]: *"I don't like the auto scroll after selecting my default outfit."* Claude then
  removes it at [00:57:38].
- **Verify:** On the first visit (`/clubhouse`, fresh), answer each onboarding question with the keyboard. Record
  `window.scrollY` and `document.activeElement` before and after each selection. Pass: choosing an option never
  scrolls the page or moves focus by itself, unless the person pressed a Continue or Next control. (WCAG 3.2.2,
  On Input.)
- **accessibility.md:** **GAP.** Nothing covers unexpected scrolling or focus changes caused by input.

## 3. Labels & forms

### L1. Every field has a real label (Graded)
- **Source:** PDF p.3, §7: *"fields should have real labels"*. Design Requirements: *"Forms: one column, a label on
  every field"*. Assessment: *"real labels"*. S82 (83.png): *"Label every field."*
- **Verify:** On every route, for each `input, select, textarea`: `el.labels.length > 0`, or it has `aria-labelledby`
  pointing to visible text. Then use `page.getByLabel('<visible label text>')` to find each field by its label.
- **accessibility.md:** Covered (Forms, item 1).

### L2. Labels are clear, short, and always visible, not just a placeholder (Lecture)
- **Source:** S76 (77.png), callout 1: *"Clear, Short Labels, always visible, not only a placeholder."*
  S80 (81.png), AGENTS.md rule: *"Every field has a visible label."*
- **Verify:** Type into each field. The label must still be on screen afterward (screenshot before and after). No
  field's only name is its `placeholder`: check `!el.labels.length && el.placeholder` and expect 0. Labels should be
  a few words ("Course name", not a sentence).
- **accessibility.md:** Covered (Forms, item 1).

### L3. The accessible name matches the visible label, so screen readers and agents can read the form (Lecture)
- **Source:** S75 (76.png), "Content Hierarchy": *"Screen readers read it, and so do browser agents."* With labels,
  the tree reads `textbox "Habit name"`, `combobox "How often"`, `button "Save habit"`. Without them, it reads
  `textbox (no name)` and `combobox (no name)`. *"Just because it looks like you designed something that's easy to
  use, the UI may not be accessible."*
- **Verify:** Run `page.locator('main').ariaSnapshot()` on every route and grep for `""`, `(no name)`, or a
  `textbox`, `combobox`, `button`, or `link` with no name. Expect none. The form `/clubhouse/courses/new` should read
  as a heading followed by named fields.
- **accessibility.md:** Covered ("How we check": read the accessibility tree, role plus name for every control).

### L4. Each field is sized for what it holds (Lecture)
- **Source:** S76 (77.png), callout 2: *"Field Size suitable for the content it receives."* (In the slide, the
  2-digit "Times a Day" box is narrow and the name is wide.)
- **Verify:** Screenshot the hole screen and `/clubhouse/courses/new` at 1280px. Number fields (strokes, putts, par,
  yardage, Handicap Index) should be visibly narrower than text fields (course name, notes). Notes should be a
  multi-line `<textarea>`. No full-width box for a 1–2 digit value.
- **accessibility.md:** **GAP.**

### L5. Hints sit next to the field (Lecture)
- **Source:** S76 (77.png), callout 3: *"Contextual Info next to the field"* (*"Something you can do every day."*
  under the field).
- **Verify:** Any hint text, such as the Handicap Index format or the yardage unit, sits directly under its field and
  is tied to it: the input's `aria-describedby` should include the hint's id. Check that `accessibleDescription` in
  the snapshot contains the hint.
- **accessibility.md:** **GAP.** `aria-describedby` is only required for errors, not hints.

### L6. The keyboard fits the field: numbers for a number (Lecture)
- **Source:** S76 (77.png), callout 4: *"Contextual Keyboard: numbers for a number."*
- **Verify:** Every numeric field has `inputMode="numeric"` (or `"decimal"` for the Handicap Index, such as 12.4).
  Check with `el.inputMode` across routes. Emulate a phone at 390px and confirm the number pad (or the attribute).
- **accessibility.md:** Covered (Forms, item 4). Check that the Handicap Index uses `decimal`.

### L7. Forms are one column (Graded)
- **Source:** PDF p.3, Design Requirements: *"Forms: one column."*
- **Verify:** At 1280px on `/clubhouse/courses/new`, `/clubhouse/rounds/new`, and the Locker edit forms, every
  field's left edge lines up (same `x` from `boundingBox()`), with no two fields side by side.
- **accessibility.md:** **GAP** in this file. It is in `AGENTS.md` (Forms rule).

### L8. Optional fields say "(optional)" (Graded)
- **Source:** PDF p.1 figure, and S84 (86.png): *"Aisle (optional)."*
- **Verify:** Every field without `required` either has "(optional)" in its visible label, or the form says plainly
  that everything is required. Grep the labels in the snapshot.
- **accessibility.md:** Covered (Forms, item 1).

### L9. Fill in what's already known, and never ask twice (Lecture)
- **Source:** S34 (35.png), "The Same Order, Five Steps": *"Cut the steps people don't need, and fill in what you
  already know."* and *"Fill in what the browser already knows."* *"Type It Again for Billing"* is struck out.
- **Verify:** (a) Fields that match a known type have `autocomplete` (for example, the golfer's name uses
  `autocomplete="given-name"` or `"name"`). (b) Anything the golfer already entered (name, Handicap Index, home
  course, tees) is pre-filled the next time it's asked for, such as on `/clubhouse/rounds/new` and in the Locker. Go
  through the first visit, then open each form and confirm none asks for a known value again. (WCAG 3.3.7,
  Redundant Entry.)
- **accessibility.md:** **Partial / GAP.** It has "helpful `autocomplete` where it applies", but nothing about
  redundant entry.

### L10. Fields with labels and errors are one shared component, used the same way everywhere (Graded)
- **Source:** PDF p.2, §5: *"Use shared components: buttons, inputs, and fields with labels and errors, used
  consistently everywhere."* S50 (51.png): *"Use each pattern the same way on every page, so people learn it once."*
- **Verify:** `grep -rn "<input\|<select\|<textarea" src/app` should only find the shared field component in
  `src/components/`. Every error on the site has the same structure (icon, text, position, `aria-describedby`).
- **accessibility.md:** **GAP** in this file. Shared components are in `AGENTS.md`.

## 4. Errors & recovery

### E1. Errors sit next to the field (Graded)
- **Source:** PDF p.2, §5: *"Its errors sit next to the field."* Design Requirements and Assessment repeat it.
  S37 (38.png): *"Error Next to Title."* S84 (86.png) shows the error right under "Item".
- **Verify:** On `/clubhouse/courses/new`, submit empty. Each error's box should sit directly below its own field
  (no field in between), and the field should have `aria-invalid="true"` and an `aria-describedby` that points to
  the error's id.
- **accessibility.md:** Covered (Forms, item 2).

### E2. Errors say what to do next (Graded)
- **Source:** PDF p.2, §5: *"say what to do next: 'Enter an item name,' not 'Invalid input.'"* S73 (74.png), WCAG
  Understandable: *"Clear Labels, Descriptive Errors."* S85 (87.png): *"A form whose errors say what to do next."*
- **Verify:** Trigger every validation (empty name, bad par, Handicap Index out of range, a hole with no score).
  Each message starts with a verb that tells the golfer what to do ("Enter…", "Choose…", "Score…"). Grep `src` for
  "Invalid", "Error:", and "required" used as the whole message, and expect 0.
- **accessibility.md:** Covered (Forms, item 2).

### E3. Keep what the person typed (Graded)
- **Source:** PDF p.2, §5: *"When there's an error, keep what the person already typed."* Design Requirements:
  *"save what the person typed."*
- **Verify:** Fill every field except one, then submit. Every other value is still there, and focus goes to the
  first invalid field. Also reload the page partway through a form or a hole, and confirm the draft is still there
  (from `localStorage`).
- **accessibility.md:** Covered (Forms, item 3).

### E4. Errors are marked by more than color: an icon plus text, not just a red border (Lecture)
- **Source:** PDF p.1 figure and S84 (86.png): a "!" icon plus *"Enter an item name."* S19 (20.png), UI States,
  Error: *"! Couldn't save"* with *"Try Again."*
- **Verify:** Screenshot each error state in grayscale (`page.emulateMedia` plus a CSS `filter: grayscale(1)`). You
  should still be able to tell which field is wrong, because of the icon and the text.
- **accessibility.md:** Covered by the general rule ("Color is never the only signal").

### E5. A disabled button says why it's disabled (Lecture)
- **Source:** S19 (20.png), UI States, Disabled: *"a Save button that stays gray until the habit has a name,"* with
  *"Needs a name"* shown by the field.
- **Verify:** Find every disabled control (`button:disabled`), such as Finish round before every hole is scored, or
  a stepper at its limit. Each has visible text nearby that says what's needed, tied to it with `aria-describedby`.
  Disabled buttons can't take focus, so the reason must also be reachable as text. Otherwise, keep the button
  enabled and show an E1/E2-style error.
- **accessibility.md:** **GAP.** Nothing covers disabled states.

### E6. A failed save says so and offers Try Again (Lecture)
- **Source:** S19 (20.png), UI States, Error: *"an error, Couldn't save, with Try Again."*
- **Verify:** In Playwright, make `localStorage.setItem` throw (for example, stub it to raise a
  `QuotaExceededError`), then save a hole. A visible, announced message appears (`role="alert"` or a live region)
  with a Try Again button. No silent data loss.
- **accessibility.md:** **GAP.**

### E7. Recover from destructive actions: Undo, or Confirm for delete-everything (Lecture)
- **Source:** S45 (46.png), "Undo or Confirm": *"Always allow users to recover from destructive actions, like
  deleting something."* It shows "Removed Piranesi · Undo" for one item, and *"Delete your shelf? All 40 books. This
  can't be undone."* with "Delete Shelf / Keep Books" for everything. S56 (57.png): *"Freedom to fail."*
  VTT [00:43:42]: *"So reset. Click again to erase everything."*
- **Verify:** Delete one round card, and an Undo button appears that restores it (check `localStorage` before and
  after). Reach Undo by keyboard: focus moves to it, or it stays at least 6 seconds. For erase-all or resetting the
  season, a dialog names what will be lost, the safe button ("Keep my rounds") gets focus first, and Esc cancels.
  (WCAG 3.3.4.)
- **accessibility.md:** **Partial.** Undo toasts must be announced and last at least 6 seconds, but the undo or
  confirm requirement itself is only in `docs/assignment.md`.

### E8. Confirm an action worked, with a visible and announced status (Lecture, Walkthrough)
- **Source:** S84 (86.png) and PDF p.1: the toast *"Added oat milk"* after saving. S19 (20.png): Success *"Logged"*,
  Loading *"Saving"*. VTT [00:58:34]: *"I added three tasks, but nothing displays in the UI."*
- **Verify:** Save a hole, add a course, and log a round. Each time, a message appears on screen and in a
  `role="status"` or `aria-live="polite"` region (read its `textContent` right after the action).
- **accessibility.md:** Covered (Dynamic content, items 1 and 2).

## 5. Contrast & color

### C1. Text contrast is checked with the agent, and meets WCAG AA (Graded)
- **Source:** PDF p.3, §7: *"text contrast should be checked with your agent."* Assessment: *"text contrast checked
  with your agent."* S80 (81.png), AGENTS.md rule: *"text contrast meets WCAG AA."* S73 (74.png), Levels:
  *"AA Ideal Support, Aim Here."*
- **Verify:** A script reads every rendered text node on every route (`getComputedStyle` color against the actual
  background) and reports pairs under 4.5:1 (3:1 for 24px and up, or 18.66px bold). Save the table of ratios in
  `DESIGN_LOG.md` or `docs/verification.md`. Also run axe `color-contrast` on each route.
- **accessibility.md:** Covered (Color & contrast, items 1 and 2).

### C2. Quieter text still passes contrast (Lecture)
- **Source:** S20 (21.png): *"Make the streak card quieter: a smaller number, in the muted gray."* S18 (19.png),
  "Emphasize by De-Emphasizing": the "Quieter" phone fades the streak and stats to pale gray.
- **Verify:** List every muted or secondary token (captions, meta lines like "Last time at…", placeholders, empty-row
  dashes on the scorecard, inactive tab labels) and measure each one on each surface it's used on. Pass: at least
  4.5:1, or 3:1 if large. "Quieter" should come from size and weight, not from going below the ratio.
- **accessibility.md:** Covered by "Check every token pair actually used". Name muted tokens explicitly in the
  script.

### C3. Color is never the only signal (Lecture)
- **Source:** S47 (48.png) and S50 (51.png): the current tab is shown by color *and* an underline. S84 (86.png): the
  error has an icon. S63 (64.png): streak dots and a progress ring with "3/4" text.
- **Verify:** In grayscale screenshots: the current nav item, birdie, par, and bogey on the scorecard (circles and
  squares), chart series, selected chips or radios, and trophies can all still be told apart.
- **accessibility.md:** Covered (Color & contrast, item 3).

### C4. If colors change with the content, recheck contrast for every variant (Walkthrough)
- **Source:** VTT [00:41:09]: *"Can you change some of the colors in the today section based on the weather?"*
- **Verify:** Wherever 18 Eagles changes color by state (the course photo behind text, the green bar, the trophy
  tiers, the score-to-par color, a dark tab bar), run C1's script in each state (use seeded states: empty, one round,
  a full season, a live round).
- **accessibility.md:** **Partial.** "Every token pair" doesn't spell out per-state or per-theme variants, or text
  over photos.

### C5. One strong emphasis color, used sparingly (Lecture, Walkthrough; a design point that helps clarity)
- **Source:** S20 (21.png): *"Make Log the primary button, the only pink thing on the screen."* VTT [00:59:08]–
  [00:59:38]: *"I'm not a fan of the red color used in the top border for get started … it's too intense."*
- **Verify:** On each screen, only one primary action uses the accent fill. Count elements with the primary-button
  class per route in the snapshot and expect at most one.
- **accessibility.md:** **GAP** (this belongs with cognitive load and obvious actions; see section 11).

## 6. Semantics, headings & landmarks

### H1. A skip link is the first Tab stop and jumps past the header (Lecture)
- **Source:** S77 (78.png), "Helpful Wayfinding", item 1: *"A Skip Link, the first stop for Tab, jumps past the
  header,"* with `<a href="#main">Skip to main content</a>`.
- **Verify:** Load any `/clubhouse` route fresh, press Tab once, and the focused element is "Skip to main content"
  and visible. Press Enter, and `document.activeElement` is `#main` (or inside it). The next Tab reaches the page's
  first control, not the nav.
- **accessibility.md:** Covered (Structure, item 1).

### H2. Headings in order: one h1, then h2s (Lecture)
- **Source:** S77 (78.png), item 2: *"Headings in Order, one h1 and then h2s, so a screen reader can list them and
  jump between them."*
- **Verify:** On each route, `[...document.querySelectorAll('h1,h2,h3,h4')].map(h=>h.tagName)`: exactly one H1, and
  no level is skipped (no H2 to H4). On the first visit, the hole screen, and Stats, every section has a heading.
- **accessibility.md:** Covered (Structure, item 2).

### H3. Each onboarding question is its section's heading (Walkthrough)
- **Source:** VTT [00:47:28]–[00:47:31]: *"Here's a version where the page itself is the onboarding. Each question
  becomes the heading of the section."* (It fixed his "hierarchy problem" at [00:47:38].)
- **Verify:** On the fresh `/clubhouse`, each first-visit question ("What's your Handicap Index?" and the like) is an
  `h2` (not a `<p>` or `<label>` styled big), so VoiceOver's headings list (VO-U) reads the questions in order. Each
  group of choices has the question as its `<legend>` or `aria-labelledby`.
- **accessibility.md:** **GAP.**

### H4. Navigation is in the same place on every screen (Lecture)
- **Source:** S77 (78.png), item 3: *"Consistent Places, with navigation in the same spot on every screen."*
  S50 (51.png): *"Make one Add button, and use it above the tab bar on every page."*
- **Verify:** Screenshot every `/clubhouse` route at 390px and 1280px and compare the nav's `boundingBox()` (same
  `y` and `height`). The nav sits at the same spot in the DOM, which you can check by comparing Tab order.
- **accessibility.md:** Covered (Structure, item 3).

### H5. Repeated controls look and are named the same everywhere (Lecture)
- **Source:** S50 (51.png), "Consistent Elements": *"Use each pattern the same way on every page, so people learn it
  once."* In "Built Page by Page", the Add control is a pill, a floating "+", and a "Create" link. In "One Shared
  Component", it's the same Add button everywhere.
- **Verify:** Across routes, controls that do the same thing have the same accessible name and look (for example,
  every way to start a round says "Tee off", and every back link uses the same words and icon). List
  `role=button/link` names per route and look for synonyms. (WCAG 3.2.4, Consistent Identification.)
- **accessibility.md:** **Partial / GAP.** It covers nav placement, but not consistent naming of repeated controls.

### H6. Navigation shows where you are and how to get back (Graded)
- **Source:** PDF p.3, Design Requirements: *"Navigation: it's clear to users where they are and how to get back to
  where they were."* S47 (48.png): product name, main sections, utility, page title. S44 (45.png): the "‹ Shelf"
  back link on the detail page at 390.
- **Verify:** On every route, the current nav item has `aria-current="page"` plus a visible marker, the
  `<title>` is unique, and the `h1` names the page. On every detail page (round card, hole, course), a visible,
  named back link returns to the parent list. Check it at 390px, where there's no side-by-side list.
- **accessibility.md:** **Partial.** It has `aria-current` and titles, but nothing about a back path on detail
  pages.

### H7. Real HTML that tools can read (Lecture)
- **Source:** S73 (74.png), WCAG Robust: *"Tools can read it. Real HTML for Screen Readers and Agents."* S72 (73.png):
  *"People reach your page through different tools. Each one reads the structure you build."*
- **Verify:** Run axe on every route (rules such as `aria-*`, `button-name`, `link-name`, `list`, `landmark-*`).
  Expect 0 violations. Landmarks appear in the snapshot as `banner`, `navigation` (named), `main`, and
  `contentinfo`.
- **accessibility.md:** Covered (Structure, item 2; Keyboard, item 4).

### H8. Pattern-library patterns (tabs, dialog, toast, bottom nav) keep their built-in accessibility (Lecture)
- **Source:** S43 (44.png), "Pattern Libraries": *"They do a lot of the UI/UX heavy lifting for you, but they don't
  solve everything."* Its benefits are *"Fewer Errors · Consistency · Accessibility."*
- **Verify:** For each pattern used, check the expected roles: the bottom tab bar is `nav` with links and
  `aria-current`; segmented filters are `radiogroup`/`radio` or `aria-pressed`; dialogs are `<dialog>` or
  `role=dialog` with `aria-modal` and a name; toasts are `role=status`.
- **accessibility.md:** Covered (Keyboard, item 4; Dynamic content).

## 7. Images, media & alt text

### I1. Alt text describes what matters in the image (Lecture)
- **Source:** S78 (79.png), "Accessible Media": *"Information in media should be available to everyone."* It moves
  from `alt="Cat"` to `alt="Cat on grass"` to `alt="Sunny day with orange tabby cat looking forward on grassy yard
  with a mildly condescending gaze."` **Modeled:** SV gives every slide an `alt` with its full text.
- **Verify:** `[...document.images].map(i=>[i.src,i.alt])` on every route. Course photos say what and where ("The
  18th green at Torrey Pines South, with the Pacific behind it"), not "image" or a file name. Decorative textures
  have `alt=""`. Trophy art has alt text that names the trophy.
- **accessibility.md:** Covered (Media & charts, item 1).

### I2. Video and audio have captions and a transcript, with the sounds too (Lecture)
- **Source:** S78 (79.png): *"Captions and a transcript, with the sounds too."* (The example caption reads
  "[SOBBING MATHEMATICALLY]".) S71 (72.png), Steven: *"Without captions, it's meaningless to me."*
  **Modeled:** ASYNC ships `<track kind="captions">` in English, Chinese (zh-Hans), and Spanish, with a CC menu.
- **Verify:** `document.querySelectorAll('video,audio,iframe').length` on every route. If any exist, each has
  captions and a transcript link. Today, 18 Eagles should have none, so this item is N/A. Check again if a video
  hero or intro is ever added.
- **accessibility.md:** **GAP** (N/A for now).

### I3. Charts, rings, streaks, and badges have a text equivalent (Lecture)
- **Source:** S63 (64.png), "Retention Patterns": Weekly Summary bars, History grid, Progress Ring "3/4", Streak
  "42 days", Badges. (These are visual, and they need the text equivalent from I1.)
- **Verify:** Each Stats chart and the handicap trend has an `aria-label` or `<title>` plus a data table or text
  summary. The trophy case reads as a list of named trophies with dates. Check `ariaSnapshot()` for numbers that
  match what's drawn.
- **accessibility.md:** Covered (Media & charts, items 2 and 3).

## 8. Motion & time

### M1. Celebrations and animation respect reduced motion (Lecture)
- **Source:** S63 (64.png): *"Goal met! 7 days in a row"* with confetti, and Celebration as a retention pattern.
  **Modeled:** ASYNC has `@media (prefers-reduced-motion: reduce){… animation:none}` and checks
  `matchMedia('(prefers-reduced-motion: reduce)')`.
- **Verify:** `page.emulateMedia({ reducedMotion: 'reduce' })`, then trigger a trophy or new low round, the Showcase,
  and page transitions. Use `document.getAnimations()` to check that nothing that isn't essential is running.
- **accessibility.md:** Covered (Dynamic content, item 3).

### M2. Motion that plays on its own can be paused (Modeled)
- **Source:** SV `README.txt`: *"Animated slides play on their own. Hover over one to pause, slow down, or restart
  it."* (It's hover-only there; a keyboard user needs a button.)
- **Verify:** Anything that moves, scrolls, or auto-advances for more than 5 seconds (a hero photo carousel, a
  ticker, a looping Showcase) has a visible Pause button that works by keyboard. If nothing like that exists, this
  is N/A. (WCAG 2.2.2.)
- **accessibility.md:** **GAP** (N/A unless something auto-plays).

### M3. Enough time: no time limits, and messages stay long enough to read (Lecture)
- **Source:** S73 (74.png), WCAG Operable: *"Enough Time."*
- **Verify:** Nothing in the hole flow, onboarding, or forms times out or resets. The Undo toast stays at least 6
  seconds, pauses while focused or hovered, or stays until dismissed (measure it with Playwright timestamps).
- **accessibility.md:** **Partial.** It sets the toast length, but there's no general "no time limits" rule.

## 9. Touch targets & pointer

### T1. Tap targets are big enough (Lecture)
- **Source:** S76 (77.png), callout 5: *"Tap Targets big enough."* S73 (74.png): *"Tap Targets."*
- **Verify:** On every route at 390px, take `boundingBox()` of every `button, a, input, [role=radio]`. On the hole
  screen (clubs, stepper −/+, Next hole), each is at least 44×44. Everywhere else, at least 24×24.
- **accessibility.md:** Covered (Touch & size, item 1).

### T2. Enough space between targets that you don't hit the wrong one (Lecture)
- **Source:** S71 (72.png), Emily (*"Has cerebral palsy and limited use of her hands"*): *"I can't tell you how often
  I've gone zooming off to the wrong link or couldn't hit the right button."*
- **Verify:** On the hole screen and in the club picker, for each pair of neighboring targets, the gap is at least
  8px, or each target's 24px circle doesn't overlap a neighbor's (WCAG 2.5.8 spacing). Destructive controls
  (Remove last, Clear, Delete card) are not right next to the most-used control.
- **accessibility.md:** **Partial / GAP.** It sets sizes, but not spacing or keeping destructive controls apart.

### T3. The visible label is in the accessible name, so voice control works (Lecture)
- **Source:** S72 (73.png), "Assistive Technology", Voice Control: *"Say what to press: 'Tap Save.'"*
- **Verify:** For every control with visible text, its accessible name *contains* that text (for example, the button
  shows "Tee off", so its name is not "Start round"). Compare `innerText` against the snapshot name for every button
  and link, and flag any name that doesn't include the visible words. (WCAG 2.5.3, Label in Name.) Club buttons
  showing "Dr" must have a name that starts with "Dr" ("Dr: Driver" passes).
- **accessibility.md:** **GAP.**

## 10. Zoom, reflow & device conditions

### Z1. Review the UI at every width (Lecture)
- **Source:** S23 (24.png), "Review UI at Every Width": *"The agent is usually more optimistic than what has
  actually occurred. Give it a way to check."* At 390, it shows *"Nav Over the Title · Title Runs Off the Edge ·
  Cards Squeezed · Button Label Wraps."* S87 (89.png): *"Let It See Its Work. A browser check at mobile and desktop
  widths."* S44 (45.png): *"Side by Side at 1440 … One at a Time at 390."*
- **Verify:** `node scripts/matrix.mjs` on every `/clubhouse` route. At 320px and 390px, check for no horizontal
  scroll (`scrollWidth <= innerWidth`), no overlapping nav and title, no clipped titles, no squeezed cards, and no
  button labels wrapping to two lines. Then zoom text to 200% at 1280px and check for no loss.
- **accessibility.md:** Covered (Touch & size, item 2; "How we check": matrix screenshots).

### Z2. It works on an old laptop and a slow connection (Lecture)
- **Source:** S70 (71.png), "A Spectrum of Ability": *"Where you are on it changes: a stressful day, a sleepy
  evening, a noisy room, an old laptop, a slow connection."* S19 (20.png), UI States, Loading: *"Saving."*
- **Verify:** Run Playwright with CPU throttling at 4× (CDP `Emulation.setCPUThrottlingRate`) and "Slow 3G" network
  on the deploy. The first visit is usable (text and controls show up before the hero photo), there's a loading
  state wherever data or photos take time, and no layout shift moves a button as you tap it. Check Lighthouse
  performance and CLS on `/clubhouse`.
- **accessibility.md:** **GAP.**

## 11. Screen readers & assistive technology

### R1. Works with a screen reader: test it with VoiceOver, and fill in a form without looking (Lecture, Graded)
- **Source:** S79 (80.png), Screen Reader card: *"VoiceOver: Command-F5. Narrator: Ctrl-Windows-Enter. Fill in a form
  without looking."* S85 (87.png), "What You'll Build": *"Accessible: Keyboard, labels, contrast, and a screen
  reader."*
- **Verify:** By hand on the Mac, turn on VoiceOver (Cmd-F5), close your eyes or dim the screen (VO-Shift-F11
  turns on the screen curtain), and: (1) answer the first-visit questions; (2) add a course on
  `/clubhouse/courses/new`, including making and fixing an error; (3) score one hole. Pass: every field announces
  its label, hint, and error, and every save is announced. Write the result in `docs/verification-keyboard.md`.
- **accessibility.md:** **GAP.** "How we check" relies on the Playwright accessibility tree, with no real screen
  reader pass.

### R2. Screen readers read headings, links, labels, and buttons, so all four must be right (Lecture)
- **Source:** S72 (73.png), Screen Reader: *"Reads the page aloud: headings, links, labels, buttons."* Braille
  Display: *"Shows a line of the page in raised dots."*
- **Verify:** In VoiceOver's rotor (VO-U), check the Headings, Links, and Form Controls lists on `/clubhouse` and the
  hole screen. Each entry makes sense on its own: no "Click here", no repeated "See the card", and names are short
  enough for one Braille line. Icon-only controls (the utility or settings icon, "+") have names.
- **accessibility.md:** Covered (role plus name check; the verification log fixed the duplicate "see the card" names).

### R3. Browser agents read the same structure, so the first-run check doubles as an accessibility check (Lecture, Graded)
- **Source:** S75 (76.png): *"Screen readers read it, and so do browser agents."* S38 (39.png), "The Future of User
  Flows": an agent opens, finds, and fills a form. PDF p.3, §8, first-run check: *"have your agent try it as a
  brand-new user."*
- **Verify:** In the first-run check, the agent uses the accessibility snapshot (Playwright MCP `browser_snapshot`),
  not screenshots, to do "Play a round and come back tomorrow." Any control it can't find or name is a bug. Note the
  result in the README's first-run section.
- **accessibility.md:** **Partial.** The first-run check isn't tied to accessibility there.

### R4. Status changes are announced (Lecture)
- **Source:** S84 (86.png): the toast *"Added oat milk."* and the footer *"Saved on this device."*
- **Verify:** After each save, read the `aria-live`/`role=status` text (see E8). In VoiceOver, saving a hole
  announces it without moving focus.
- **accessibility.md:** Covered (Dynamic content, item 1).

## 12. Language, content & cognitive load

### U1. Plain language (Lecture)
- **Source:** S51 (52.png), "A Navigation Check": *"Core user needs prioritized · Clear hierarchy · Plain language ·
  Obvious actions."* Before, the tabs are unlabeled dots. After, they say "Shelf" and "Stats". S52 (53.png):
  *"Prioritize: core needs first, a clear hierarchy, plain language, obvious actions."*
- **Verify:** Nav and button labels are words, not icons alone. Golf terms a new golfer may not know (Handicap
  Index, tees, GIR, up-and-down) have a short plain explanation on first use (a hint, per L5). Read each route's
  visible text and flag internal or code words ("v1", "slug", "seed").
- **accessibility.md:** **GAP.**

### U2. Simpler screens with clear goals, and one obvious thing to do first (Lecture, Walkthrough)
- **Source:** S71 (72.png): *"Simpler screens with clear goals are better for everyone."* Maria: *"When a site is
  confusing I just leave."* S74 (75.png), Carol: *"If it's not obvious, I don't know what to do."* S65 (66.png):
  *"People learn by doing, on the real screen, with one thing to do first."* VTT [00:44:17]: *"It doesn't feel like
  I know the obvious next thing to do."* VTT [00:44:45]: *"one guided card, one red button, one step at a time."*
  S82 (83.png): *"Good design wins."*
- **Verify:** On the fresh `/clubhouse` and on the returning `/clubhouse`, the first thing in reading order after
  the `h1` is the one next action (a single primary button, see C5). Five-second test: show a new person (or a fresh
  agent) a screenshot for 5 seconds and ask "what would you do first?"
- **accessibility.md:** **GAP.**

### U3. Remove steps, fields, and interactions people don't need (Graded)
- **Source:** PDF p.3, Design Requirements: *"Simplicity: try to remove unnecessary steps, fields, and
  interactions."* S33 (34.png): *"Don't make people think, and don't make them take steps they don't need."*
  S40 (41.png): *"Every step is more work for the person, so simplify."* VTT [00:36:01]: *"Seems like an unnecessary
  extra step."* VTT [00:38:49]: *"turn each question into a one-tap control."*
- **Verify:** Count the keypresses to finish the first visit and to score one hole, using only the keyboard, and
  record the counts in `DESIGN_LOG.md`. Look at each field and step and ask whether it can be pre-filled (L9), given
  a default, or removed. The numbers should go down or stay the same over the commits.
- **accessibility.md:** **GAP** (it's in `docs/assignment.md` as a design principle, not as accessibility).

### U4. Don't open on an empty screen: learn by doing, and add complexity over time (Graded)
- **Source:** PDF p.2, §4: *"Let them learn by doing, not by reading a tour, and don't drop them into an empty
  screen."* S60 (61.png): *"Don't drop users into an empty screen. Know which core features you want. Ramp up
  complexity over time."*
- **Verify:** Fresh `/clubhouse`, `/clubhouse/rounds`, `/clubhouse/stats`, and `/clubhouse/trophies`: each empty
  state has a heading, one sentence, and one real action (no blank chart and no lone "+"). Stats with fewer than 3
  rounds explains what will appear and when.
- **accessibility.md:** **GAP** (it's in `docs/assignment.md`).

### U5. Avoid interrupting pop-ups, and if one is needed, it behaves (Lecture)
- **Source:** S58 (59.png), "Onboarding Patterns", Embedded (Pop-Ups, Modals, Alerts): *"Con: User Aversion."*
  Annotated tooltips and coach marks: *"Con: Widely Abused."*
- **Verify:** On the fresh first visit, no modal opens by itself. Any tip or coach mark can be dismissed by keyboard
  (Esc and a Close button), doesn't trap focus or cover the control it points to, and is announced as text.
- **accessibility.md:** **Partial.** It covers dialog focus trapping, but not keeping onboarding free of
  interruptions or tips that can be dismissed.

### U6. Tell people where their data lives, and that clearing it erases it (Graded figure, Walkthrough)
- **Source:** PDF p.1 figure and S84 (86.png): *"Saved on this device."* VTT [00:01:16]–[00:01:20]: *"your progress
  is saved only in this browser, clearing this data erases it."*
- **Verify:** Somewhere visible on the tool (the footer, or the Locker), plain text says rounds are saved only in
  this browser on this device. Any reset or erase button says that it can't be undone (E7).
- **accessibility.md:** **GAP.**

### U7. Don't rely on sound or perfect conditions (Lecture)
- **Source:** S70 (71.png), the spectrum of ability includes *"See · Hear · … Tune Out Distraction · Learn · Manage
  Physical and Mental Health,"* plus *"a noisy room."*
- **Verify:** `grep -rn "new Audio\|<audio\|vibrate" src` should find nothing, or anything it finds also has a
  visible equivalent. Every feedback (a save, a new trophy) is visual text first.
- **accessibility.md:** **GAP** (trivially passes today).

### U8. Build habits that are good for people (Lecture)
- **Source:** S64 (65.png), "The Race to the Bottom of the Brain Stem": *"What responsibility do product makers have
  when creating user habits? Products that affect mental or physical health. Vulnerable audiences: children and
  teens."* S65 (66.png): *"build habits that are good for them."*
- **Verify:** Review the retention features (trophies, challenges, the "welcome back" message). No guilt or shame
  copy ("You broke your streak!"), no fake urgency, nothing that buzzes for attention, and nothing is lost for
  stepping away. Note it in `DESIGN_LOG.md`.
- **accessibility.md:** **GAP.**

### U9. A name people can spell and search (Walkthrough, minor)
- **Source:** VTT [00:22:20]–[00:22:46]: *"you never want to pick a homophone for your name …"* *"it was not easy to
  search for."*
- **Verify:** "18 Eagles" is fine. Check that the `<title>` and the `h1` use the same spelling ("18", not
  "Eighteen"), so speech and search find it.
- **accessibility.md:** N/A.

## 13. Process: how the materials say to test and work with the agent

### P1. Make it a rule in `AGENTS.md` (Lecture)
- **Source:** S80 (81.png), step 1, Make It a Rule: *"Add to AGENTS.md: 'Every field has a visible label, every
  action is a real button, and text contrast meets WCAG AA.'"*
- **Verify:** `grep -n "label\|button\|4.5" AGENTS.md`. Already present under Hard Rules.
- **accessibility.md:** Covered (with `AGENTS.md`).

### P2. Automated check (WAVE, axe, or Lighthouse) on every page and every state, including errors (Lecture)
- **Source:** S79 (80.png), Automated Check: *"WAVE, axe, or Lighthouse, on every state of the page, errors too."*
  S80 (81.png), step 2: *"Run an accessibility check on every page, including the error state, and list what
  fails." Good to run before you launch.* S24 (25.png): *"A Contact Sheet of Every State"* (Empty, Adding, Missing
  Title, Open, Checked Off, Done Tab).
- **Verify:** Run axe-core in Playwright for every route × every seeded state (empty, one round, season, live
  round) × every error state (empty submit on each form) × open dialogs and toasts. Save the violations list in
  `docs/verification.md`. Pass: 0 serious or critical violations before each deploy.
- **accessibility.md:** **Partial.** "A separate verifier agent audits … before deploy" doesn't require axe on
  *every state, including errors and open dialogs*.

### P3. Fix by name, then read what the agent changed (Lecture)
- **Source:** S80 (81.png), subtitle: *"Describe the level of accessibility you want, have it check its work, then
  read what it changed."* Step 3, Fix by Name: *"Give the habit name field a visible label, and make Save a real
  button."* S23 (24.png): *"The agent is usually more optimistic than what has actually occurred."*
- **Verify:** Each accessibility fix commit names the element and the rule (for example, `a11y: give Handicap Index
  a visible label`). The user reads `git show` for it. Re-running the failing check after the fix is the evidence,
  not the agent's word.
- **accessibility.md:** **Partial** (`AGENTS.md`: "A claim isn't evidence; a screenshot is").

### P4. Feedback from real people, including people who use assistive technology (Lecture)
- **Source:** S79 (80.png), People: *"Feedback from real people, including people who use assistive technology every
  day."* S59 (60.png): *"Test It with People. Watch where they get stuck, and ask for feedback."*
- **Verify:** At least one person who isn't the builder tries the first visit and a hole, ideally with VoiceOver or
  keyboard only. Write their stuck points and the fixes in `DESIGN_LOG.md`.
- **accessibility.md:** **GAP.**

### P5. An accessibility pass with Claude, then the first-run check (Walkthrough)
- **Source:** VTT [01:01:33]: *"And then do an accessibility pass with Claude."* VTT [01:01:37]: *"And do the first
  run check."*
- **Verify:** `docs/verification.md` and `docs/verification-keyboard.md` exist and are dated after the last UI
  change. The README's first-run section is filled in (it says "Coming once the tool is deployed" today).
- **accessibility.md:** Covered ("A separate verifier agent audits against this file before deploy").

## 14. Patterns the course's own pages model (no requirement, but good to match)

| Pattern | Where | 18 Eagles check |
|---|---|---|
| `<html lang="en">` | SV and ASYNC | `document.documentElement.lang === 'en'` (accessibility.md: covered) |
| `:focus-visible` 3px outline with an offset | ASYNC CSS | See F1 |
| `prefers-reduced-motion` turns off animation | ASYNC CSS and JS | See M1 |
| `aria-live` regions for updates | ASYNC player | See E8 and R4 |
| Focus moves to the new heading (`h2#nowTitle tabindex="-1"`) when the chapter changes | ASYNC | Already done (`RouteFocus.tsx` focuses the new `h1`; see `docs/verification-keyboard.md` #1) |
| CC button with `aria-haspopup="menu"`, `aria-expanded`, and `role="menuitemradio"` items | ASYNC | Any disclosure or menu button uses `aria-expanded` |
| Captions in three languages | ASYNC `<track kind="captions">` | See I2 (N/A) |
| `<noscript>`: "The recordings and activities need JavaScript." | ASYNC | Optional: a `<noscript>` line on `/clubhouse`, since the tool needs JS for `localStorage` |
| Decorative icons marked `aria-hidden="true"` | SV section icons | Decorative SVG icons have `aria-hidden="true"` (and the button still has a text name) |
| Documented keyboard shortcuts (arrows, Space, F, Esc) | SV `README.txt` | If the hole screen has shortcuts, list them on screen. They're a bonus only (accessibility.md: covered) |

---

## Summary: what `docs/accessibility.md` does not cover yet

**Gaps (not covered at all):**
1. **K6**: Single-field forms submit with Enter. (VTT 00:23:16)
2. **F2**: No automatic scrolling or focus moves after a choice (WCAG 3.2.2). (VTT 00:57:21)
3. **L4**: Field size matches the expected content. (S76 / 77.png)
4. **L5**: Hint text sits next to the field and is tied to it with `aria-describedby`. (S76 / 77.png)
5. **L7**: Forms are one column. (PDF p.3; only in `AGENTS.md`)
6. **L10**: Fields with labels and errors are one shared component, used the same way everywhere. (PDF p.2; only in
   `AGENTS.md`)
7. **E5**: Disabled buttons say why they're disabled. (S19 / 20.png)
8. **E6**: A failed save shows "Couldn't save" with Try Again. (S19 / 20.png)
9. **C5**: One emphasis color, one primary action per screen. (S20 / 21.png; VTT 00:59)
10. **H3**: Onboarding questions are the section headings. (VTT 00:47:31)
11. **I2**: Captions and a transcript for any video or audio. (S78 / 79.png; N/A today)
12. **M2**: A Pause button for anything that moves on its own for more than 5 seconds. (SV README; N/A today)
13. **T3**: The visible label is inside the accessible name, so voice control works (WCAG 2.5.3). (S72 / 73.png)
14. **Z2**: Works on an old laptop and a slow connection, with loading states and no layout shift. (S70 / 71.png)
15. **R1**: A real VoiceOver pass, filling in a form without looking. (S79 / 80.png; S85 / 87.png)
16. **U1**: Plain language, with golf terms explained. (S51 / 52.png)
17. **U2**: Simple screens with one obvious first action. (S71 / 72.png, S74 / 75.png; VTT 00:44)
18. **U3**: Remove unneeded steps and fields, and count the keypresses. (PDF p.3; S33, S40)
19. **U4**: No empty screens, and complexity added over time. (PDF p.2; S60 / 61.png; only in `assignment.md`)
20. **U6**: Say "Saved on this device," and that clearing it erases it. (PDF p.1; VTT 00:01:20)
21. **U7**: Never rely on sound. (S70 / 71.png)
22. **U8**: Habits that are good for people, with no guilt or fake urgency. (S64 / 65.png)
23. **P4**: Feedback from real people, including people who use assistive technology. (S79 / 80.png; S59 / 60.png)

**Partly covered (the topic is there, but this detail is missing):**
- **K5**: A keyboard-only walk of the main task by an agent, with a written list of stuck points.
- **L9**: `autocomplete` is there, but not "never ask for a known value twice" (WCAG 3.3.7).
- **E7**: Toast timing is there, but not the undo or confirm requirement itself.
- **C4**: Recheck contrast for every state, theme, and text over photos.
- **H5**: Repeated controls have the same names everywhere (WCAG 3.2.4), not just the same nav placement.
- **H6**: A visible, named back link on every detail page.
- **M3**: A general "no time limits" rule, not just toast timing.
- **T2**: Spacing between targets, with destructive controls kept away from common ones.
- **R3**: Tie the first-run check to the accessibility tree.
- **U5**: No interrupting modals on the first visit, and tips can be dismissed.
- **P2**: axe on every state, including errors, open dialogs, and each seeded state.
- **P3**: Read the agent's diff, and re-run the failing check as evidence.

Everything else in this file (K1–K4, F1, L1–L3, L6, L8, E1–E4, E8, C1–C3, H1, H2, H4, H7, H8, I1, I3, M1, T1, Z1,
R2, R4, P1, P5) is already in `docs/accessibility.md` (or `AGENTS.md`).
