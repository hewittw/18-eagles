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
_Last updated: 2026-10-19, ~6:15pm Chicago. Background agents stopped at the usage limit (resets 6:20pm); the main session continued._

**iOS-app restyle (user: "these need to be buttons not links… like 18 Birdies, in this theme")**: foundations + Clubhouse DONE (commit e4d27a2: iOS radii, `bg-tint` secondary buttons, `src/components/ui/ActionList.tsx` rows/tiles, frosted white phone tab bar). In flight: restyle agent A (courses/**, CourseCard, locker), agent B (rounds/**, stats/**, hole screen, golf score components). Also running: a11y agent 1 (axe + 11 viewports → docs/verification.md) and a11y agent 2 (keyboard/semantics → docs/verification-keyboard.md). After all land: re-run axe/matrix, push, deploy, notify user.

**Masters re-skin: DONE and deployed** (commit "restyle: re-skin to masters.com…"). White pages, Masters green
#006747, yellow #FCE300, red #BA0C2F; Newsreader / Libre Franklin / Oswald; photo hero on the Clubhouse. Waiting on the
user's reaction. If they want more, the levers are `src/app/globals.css` @theme, `src/components/tokens.ts` (then
`measure-contrast.mjs`), and the hero in `src/app/clubhouse/_components/Clubhouse.tsx`.

Done (all committed and pushed; deployed at https://18-eagles.vercel.app):
- Hub `/`, `/research`, `/flows`, `/mood-board`, `/design-system`; data layer in `src/lib/`; 28 valid courses.
- All tool pages under `src/app/clubhouse/` (Clubhouse, Courses, course page, add-a-course form, hole screen, finished card,
  Cards, log-a-round form, Stats, Locker), checked in Playwright.

Interrupted by the limit (resume or redo):
- **Verifier (a11y + 11 sizes):** made one commit (`a11y: ink focus rings…`). It left `src/app/zz-verify/` (scratch, never
  commit) and hadn't written `docs/verification.md` yet. Redo it per `docs/accessibility.md` after the re-skin.
- **First-run check:** didn't finish (`docs/first-run-check.md` may be missing). Redo it on the live URL after the re-skin:
  a brand-new golfer, phone + laptop, goals: the first visit, play 3 holes with clubs/putts/a note, leave, come back, finish, add a
  course with a deliberate form error, log last week's round, plus a keyboard-only pass. Write feedback and fixes into `README.md` (the
  "First-run check" section).
- **West data agent:** Bandon Dunes, Medinah No. 3, and the Rancho Santa Fe / Fairbanks Ranch web photos (the user approved
  credited web photos for those two) are unfinished. Check with `node scripts/check-courses.mjs`.
- Scratch folders `src/app/zz-seed/` and `src/app/zz-verify/` must be deleted or left uncommitted.

Next after the re-skin: verifier → deploy → first-run check → fixes → README first-run section → hub statuses →
`docs/talking-points.md` (the 5 "be ready to explain" answers) → push-notify the user.
