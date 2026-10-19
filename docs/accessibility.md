# Accessibility Checklist (the agent owns this)

The user put the agent in charge of accessibility. Apply it while building, not at the end.
Every page and component must pass this before it's called done. Record checks in `DESIGN_LOG.md`.

## Structure & wayfinding
- [ ] A "Skip to main content" link is the first Tab stop on every tool page, and it works.
- [ ] One `<h1>` per page, then `<h2>`/`<h3>` in order. Landmarks: `<header>`, `<nav aria-label>`, `<main id="main">`, `<footer>`.
- [ ] Navigation sits in the same place on every screen; the current page has `aria-current="page"` plus a visible marker.
- [ ] `<html lang="en">`, and a unique, descriptive `<title>` per route ("Hole 7 · Torrey Pines South · …").

## Keyboard
- [ ] Every action works with the keyboard alone: Tab/Shift+Tab, Enter/Space on buttons, Esc closes dialogs and sheets.
- [ ] A focus ring is always visible (≥ 2px, ≥ 3:1 against its background). Never `outline: none` without a replacement.
- [ ] Focus order follows reading order. No keyboard traps; dialogs trap focus inside, then return it to the opener.
- [ ] Custom groups (club picker, score stepper, filters) use real buttons; toggles use `aria-pressed`; single-choice
      groups use radio semantics (`role="radiogroup"`, or native radios styled).
- [ ] Shortcuts on the hole screen are a bonus only, never the only way to do something.

## Forms
- [ ] Every input has a real `<label for>` (no placeholder-only labels). Optional fields say "(optional)".
- [ ] Errors sit next to the field, say what to do next, are linked with `aria-describedby`, and set `aria-invalid`.
- [ ] On submit with errors: focus moves to the first invalid field (or an error summary), and nothing typed is lost.
- [ ] Number inputs use `inputMode="numeric"`; helpful `autocomplete` where it applies.

## Color & contrast
- [ ] Body text ≥ 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1; control borders, icons, and chart marks ≥ 3:1.
- [ ] Check every token pair actually used (text on paper, text on green, gold on green, and so on) with a script; record ratios.
- [ ] Color is never the only signal: score types (birdie, par, bogey) also use shape or text, like the
      traditional scorecard's circles and squares.

## Dynamic content & motion
- [ ] Score and stat changes are announced with a polite `aria-live` region ("Hole 7: 4 strokes, par").
- [ ] Toasts and undo messages are announced and stay on screen long enough (≥ 6s, or until dismissed).
- [ ] `prefers-reduced-motion` turns off non-essential animation.

## Media & charts
- [ ] Meaningful images have specific alt text; decorative ones use `alt=""`.
- [ ] Every chart has a text summary and an accessible data table (visible or toggleable), and an `aria-label`/`<title>`.
- [ ] Interactive chart points are reachable by keyboard, or the same data is in the table.

## Touch & size
- [ ] Touch targets ≥ 44×44px on the hole screen (it's used outdoors, one-handed); ≥ 24×24px everywhere else.
- [ ] Text zooms to 200% without loss; no horizontal scroll at 320px.

## How we check
- Playwright: Tab through each page and screenshot the focus states; read the accessibility tree (role + name for every control).
- A contrast script over the token pairs; matrix screenshots at 11 sizes.
- A separate verifier agent audits against this file before deploy.
