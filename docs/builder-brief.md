# Page builder brief (18 Eagles tool pages)

You're building pages of "18 Eagles", a personal golf round journal, in `/Users/school/Documents/UChicago/designbuildship/week3/hw3`.
It's graded for a design course (Assignment 3: Patterns & Flows). Read first, in order: `AGENTS.md`, `docs/assignment.md`,
`flows.md` (the flows and routes; your pages are steps in them), `docs/components.md`, `docs/accessibility.md`,
`docs/styles/clubhouse.md`, `docs/avoid.md`. Then read the code you build on:
- `src/lib/`: `types.ts`, `course-types.ts`, `store.ts` (`useStore`, `update`, `patchProfile`, `resetAll`, `exportJSON`, `importJSON`),
  `hooks.ts` (`useClub()` → `{ ready, store, handicap, active, courses, course(slug) }`; `useDraft(key, initial)` for forms),
  `courses.ts`, `handicap.ts` (`formatIndex`), `stats.ts` (`breakdown`, `applyFilters`, `honors`, `summarize`), `round-actions.ts`,
  `validate.ts` (messages that say what to do next), `sample.ts` (`sampleSeason()` for the demo button).
- Components: `src/components/ui` and `src/components/golf` (import only from their `index.ts`). Read the source of any component
  you use. **Use them everywhere; never restyle a one-off button or input.** If a component is missing something, compose it,
  or note it in your report. Don't edit `src/components/**` (another agent owns it).
- Frame: `src/app/clubhouse/layout.tsx` already wraps every page in `AppShell` + `ToastProvider`. In
  `src/app/clubhouse/_components/`: `Placeholder.tsx` (`Placeholder` for `!ready`, and `Page` as the container) and
  `TeeOff.tsx` (the start-a-round panel).
- See `/mood-board` and `/design-system` on the dev server for the look.

## Rules that matter
- Pages are client components reading localStorage through `useClub()`. Until `ready` is true, render `<Placeholder />`
  (never flash empty states). Each `page.tsx` should be a tiny server file exporting `metadata` (a unique, descriptive title)
  and rendering your client component. Cache Components is on: no `new Date()` / `Math.random()` during server render, and
  dynamic `params` must be awaited inside a `<Suspense>` (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`,
  "With Cache Components"). Built-in course slugs can use `generateStaticParams`.
- **Each page:** one `<h1>` (use `PageHeader`), then `h2`s in order; plain language; an obvious primary action
  (one `primary` button per screen); a clear way back (`PageHeader` `back`).
- **Forms:** one column, a real label on every field (`Field`), errors next to the field that say what to do next (use
  `validate.ts`), keep what was typed (`useDraft`), and on submit with errors move focus to the first invalid field.
- **No dead-end empty states:** every empty view offers the next useful action (tee off, log a round, add a course).
- **Undo over confirm:** deleting uses a toast with Undo. Only "erase everything" and "replace with sample data" use `ConfirmDialog`.
- Accessibility per `docs/accessibility.md` (keyboard, labels, contrast, live regions, never color alone).
- Phones (320px) to 2560px. On phones the tab bar is fixed at the bottom; keep sticky bars above it.
- A dev server is already running at http://localhost:3300. Don't start another, and don't run `next build`.
- **Verify before you report:** `node scripts/shot.mjs <url> screenshots/<name>.jpeg <width>` at 390 and 1440 for each page, in
  the states that matter (first visit/empty, one round, full season). For a full season, open `/clubhouse/locker` if it exists,
  or run in the Playwright page: `localStorage.setItem("18eagles:v1", JSON.stringify(<sampleSeason output>))`. A simple trick is a
  scratch page under `src/app/zz-*` that you delete afterwards. View the screenshots, Tab through each page, and check the console.
  Then run `npx tsc --noEmit -p .` and `npx eslint <your paths>`.
- **Commit as you go**, staging only your own paths (`git add <paths>`, never `-A` or `.`; retry on `index.lock`). Messages name
  the change and the reason. End each with:
  `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01UpFHpFN3Kb53Wvtjk7T5RC`
- Don't write to `DESIGN_LOG.md`, `docs/HANDOFF.md`, or the hub. Report back in 15 lines or fewer: routes built, notable decisions,
  screenshot paths you checked, and anything unresolved or any component gaps.
