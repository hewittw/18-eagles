# Handoff: pick up where the last session left off

Read this first if you're a new Claude session (e.g. on another account). It's kept current after every
milestone. Then read `AGENTS.md` (always loaded), `docs/assignment.md`, `docs/brief.md`, `flows.md`, and
`docs/components.md`. The full history of decisions is in `DESIGN_LOG.md` (newest at the bottom).

**Due: Tue Oct 20, 2026, 5:30 PM.** Submit the tool URL `https://18-eagles.vercel.app/clubhouse` and the repo
`https://github.com/hewittw/18-eagles` in Google Classroom.

## How to work here
- Project root: `week3/hw3` (git repo, `origin` = `hewittw/18-eagles`, branch `main`). Commit after each meaningful step,
  messages name the change and why, ending with the `Co-Authored-By` line (see recent `git log`).
- Dev server: `npx next dev -p 3300`. Browser checks only with Playwright: `node scripts/shot.mjs <url> <out> <width>`
  and `node scripts/matrix.mjs <url> screenshots/<name>`. Never chrome-devtools or the user's Chrome.
- **Deploy** (GitHub→Vercel auto-deploy isn't linked): deploy a clean worktree of HEAD so half-built files never ship:
  ```
  W=$TMPDIR/deploy-wt; git worktree remove --force $W 2>/dev/null; git worktree add --detach $W HEAD
  mkdir -p $W/.vercel && cp .vercel/project.json $W/.vercel/ && cd $W && node scripts/gen-course-index.mjs && vercel deploy --prod --yes
  ```
- After adding course JSON: `node scripts/check-courses.mjs`, `node scripts/gen-course-index.mjs`, `node scripts/gen-credits.mjs`.
- The user steers. Ask real forks with AskUserQuestion (recommended option first). They want a push notification
  (PushNotification) whenever something is ready to review.

## Status (update this block at every milestone)
_Last updated: 2026-10-19, evening._

Done:
- Setup, hub `/`, `/research` (3 onboarding studies), `/flows` (3 Mermaid diagrams, also in README), `/mood-board`
  ("The Members' Ledger"), live on Vercel.
- Data layer in `src/lib/`: `store.ts` (localStorage, `useStore`), `handicap.ts` (simplified WHS), `stats.ts`,
  `round-actions.ts`, `validate.ts`, `sample.ts` (demo season), `hooks.ts` (`useClub`, `useDraft`), `courses.ts`.
- Course library: about 30 real courses in `src/data/courses/*.json` (validated), photos in `public/courses/`.
- Design system tokens, fonts, and components in `src/components/ui` and `src/components/golf` (contract in
  `docs/components.md`). Charts in `src/components/golf/charts`.
- Tool frame: `src/app/clubhouse/layout.tsx` (AppShell + ToastProvider), `_components/Placeholder.tsx` (`Placeholder`, `Page`).

In progress / next (in order):
1. `/design-system` showcase page (design-system agent).
2. Tool pages under `src/app/clubhouse/` (see the routes table in `flows.md`):
   - Core flow (main session): `page.tsx` (Clubhouse: first visit + coming back), `_components/TeeOff.tsx`,
     `rounds/[id]/[hole]` (the hole screen), `rounds/[id]` (the finished card + story of the round).
   - Builder 1: `courses`, `courses/[slug]`, `courses/new` (form), `locker`.
   - Builder 2: `stats`, `rounds` (Cards), `rounds/new` (log-a-round form).
3. Verify everything at 11 sizes plus a keyboard pass plus an a11y audit (`docs/accessibility.md`) using a separate verifier agent.
4. Deploy, then the **first-run check**: an agent uses the live URL as a brand-new golfer ("play 3 holes at your
   home course, then come back later"), and its usability feedback plus our fixes go in `README.md`.
5. Update the hub statuses (`src/lib/progress.ts`), `docs/credits.md`, `DESIGN_LOG.md`, and `docs/talking-points.md`
   (the 5 "be ready to explain" questions in `docs/assignment.md`).

Open notes:
- Cache Components is on: no `new Date()`/`Math.random()` in server renders; dynamic params go inside `<Suspense>`.
- Home course photos (Rancho Santa Fe, Fairbanks Ranch) are web photos the user asked for: credited, "All rights reserved".
- Carnoustie, Pinehurst, and Oakmont keep only member-par tees (the schema has one par per hole).
