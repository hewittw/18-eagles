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
_Last updated: 2026-10-19, late evening._

Done (committed):
- Hub `/`, `/research`, `/flows`, `/mood-board`; data layer in `src/lib/`; about 30 courses; design tokens and components.
- Tool core flow (main session): `src/app/clubhouse/page.tsx` + `_components/Clubhouse.tsx` (first visit: the index question
  in the hero, then Tee off; coming back: index + change line, resume, "Beat it", note, honors, recent cards),
  `_components/TeeOff.tsx`, `rounds/[id]/[hole]/HoleScreen.tsx` (the hole screen; checked end to end in Playwright),
  and `rounds/[id]/RoundCard.tsx` (the finished card + story of the round).
- Test helpers (not committed, in the session scratchpad): Playwright flow scripts. To seed the sample season for screenshots,
  create a scratch client page that writes `sampleSeason()` to localStorage key `18eagles:v1`. Never commit `src/app/zz-*`.

Running when last updated (background agents, each owning its folders):
- Design-system agent: the `/design-system` showcase page.
- Builder 1: `clubhouse/courses`, `courses/[slug]`, `courses/new` (form), `locker`.
- Builder 2: `clubhouse/stats`, `rounds` (Cards list), `rounds/new` (log-a-round form).
- West-coast course data agent (Pebble, Riviera, Torrey, RSF, Fairbanks, Jackson Park…).
If a new session finds these pages missing or half-built, check `git log` and `git status`, then finish them per
`docs/builder-brief.md`.

Next (in order):
1. When the builders land: `node scripts/gen-course-index.mjs`, `node scripts/gen-credits.mjs`, then commit the West data.
2. A verifier agent: 11 sizes (`scripts/matrix.mjs`), a keyboard pass, and an a11y audit against `docs/accessibility.md` on every
   tool route; fix what it finds.
3. Deploy (see above), then the **first-run check** on the live URL. Put the feedback and our fixes in `README.md`.
4. Hub statuses (`src/lib/progress.ts`), `DESIGN_LOG.md` entries, and `docs/talking-points.md` (the 5 "be ready to explain" answers).
5. Push-notify the user for review.
