# Design Log — Assignment 3

Running log of real decisions: what we chose, why, what we rejected, and where the user pushed back.
Append as decisions happen, newest at the bottom.

---

## 2026-10-19 · Choosing the tool
- Read all Week 3 materials first: the assignment PDF, the text of all 95 slides, and the 62-minute
  walkthrough transcript.
- **The agent first suggested** a lacrosse practice planner (the user is MLAX president), then compared
  the user's two ideas: a golf round tracker and a pickleball Elo ladder. Against the rubric, pickleball
  fit slightly better on paper (a faster first visit, a natural one-column form). The agent said the
  deciding question was which one the user actually plays.
- **The user picked golf.** The user also asked the agent to set aside their detailed spec and follow the assignment.

## 2026-10-19 · Hub or standalone
- The agent recommended a standalone tool, with the process work living in the README.
- **The user overrode this:** they want a hub like Week 2, to see progress at a glance, and will submit the
  tool's own route as the Vercel link. So `/` is the hub, and the tool lives under its own prefix with its own nav.

## 2026-10-19 · Direction
- **The user's brief:** sleek, unique, exclusively golfy. Modern, but like a clubhouse and locker room. A remix
  of the Rancho Santa Fe Golf Club site's feel and old-school Masters tradition. "High-end, perfect golf."
- **The user's feature asks:** a home page with the handicap in big numbers, interactive breakdowns with filters
  over time, a course picker with course images, a hole-by-hole screen with score, club per shot, and notes,
  with great accessible buttons. It has to work on mobile and desktop, tested at every size, with accessibility
  owned by the agent.
- **Process:** one mood board and one full design system, built by Opus subagents, while the agent and
  the user work out the flows together.
- **Scaffold:** Next.js 16.4.2 + Tailwind v4 (create-next-app, src/ dir, TS), generated in a temp dir and moved
  into `week3/hw3`. Carried over from Week 2: a slim AGENTS.md with on-demand docs, the `verify-ui` skill, the
  matrix and shot scripts, and the chrome-devtools deny rule.

## 2026-10-19 · Decisions from the user (first round of flow questions)
- **Name: "18 Eagles".** The user's pick: "inspired by 18Birdies, but distinctly different and our own." The repo is
  `hewittw/18-eagles`, the Vercel site is https://18-eagles.vercel.app, and the tool lives at `/clubhouse`.
- **Courses:** all the options offered, plus the big US PGA venues, famous Scottish links, and the user's home clubs
  Rancho Santa Fe GC and Fairbanks Ranch CC. That's about 30 real courses. Three data agents are filling them in
  against a strict schema (`src/lib/course-types.ts`) with a checker (`scripts/check-courses.mjs`). Only freely
  licensed photos are allowed, and ratings with no published source are marked `estimated`.
- **Logging:** both, with live play first. The hole screen is built for the course, plus a quick "log a round
  you've played."
- **First visit:** "Ask, then play." The handicap hero itself asks one question (enter your index, or earn one with
  a 0/3 tracker), with "Play a round" right below it.

## 2026-10-19 · Onboarding research (3 parallel agents → `docs/research/`)
| App | First visit | What we take | What we avoid |
|---|---|---|---|
| GHIN | Handicap is the whole home screen (giant number over a course photo); "NH" until 54 holes | Big number + quiet low-index line + trend chip; "next score to drop off"; par-relative score tiles (3 EAGLE / 4 BIRDIE / 5 PAR) in thumb reach | Gating the number behind membership; no teaching at all; forgetting your last tees |
| 18Birdies | Account + password + gender first, then Play → nearest course preselected → ~3 taps to hole 1 | Preselect the likeliest course; one goal question ("Break 90") turns empty stats into targets; the handicap explainer + change line (20.1 → −0.3 → 19.8) | Account walls; fairway asked on par 3s; putts allowed to exceed strokes; upsells on the score path |
| Arccos | Bag setup (select + pair 14 clubs, 5–15 min) before any value | A pre-filled standard bag, editable later; one-tap club chips per shot; putts stepper; honest stats from round one | Setup before value; stats that are blank until 5 rounds |
- **Our first visit, from this:** no account, no setup. The hero asks one question and shows the 0/3 handicap
  tracker. A home course is preselected, and "Tee off at hole 1" is one tap. The bag comes pre-filled. The
  numbers are honest after a single round.

## 2026-10-19 · Hole screen and returning (second round of questions)
- **Hole entry:** score tiles plus optional clubs (the user picked the recommendation). One tap records the score.
  If clubs are logged shot by shot, the score counts itself, and a mismatch is reconciled with a question.
- **Hole extras:** all four: putts (can't exceed the score), fairway (par 4s and 5s only, from the 18Birdies
  complaint), penalties + notes, and a yardage-book hole illustration.
- **Goal question:** yes, inline in the hero (Break 100 / 90 / 80 / scratch).
- **Coming back:** all four: handicap movement with the next score to drop off, beat your last card at this
  course, resume + last round's note, and quiet "season honors" (no streak pressure, per the lecture on
  healthy habits).
- **Flows:** written in `flows.md` and shown in the README. The first combined Mermaid render was a tangle,
  so it's split into three diagrams, rendered to static SVG at dev time (`scripts/render-mermaid.mjs`).
- **Design system = the real component library.** `docs/components.md` fixes the component names and props, so
  the design system and the pages can be built in parallel and `/design-system` shows the exact components the app uses.

## 2026-10-19 · Home-course photos
- No freely licensed photos exist of Rancho Santa Fe GC or Fairbanks Ranch CC. The agent offered a drawn
  illustration, the user's own photos, or captioned scenery of the area.
- **The user chose web photos** ("just get images off Google"). The agent flagged that they're copyrighted and the
  site is public. These are used for a class project with a visible credit to the owner and marked "All rights
  reserved" in the data and credits, so they're easy to swap. Every other course stays freely licensed.

## 2026-10-19 · Mood board: "The Members' Ledger"
- **Ceremonial · Tailored · Sunlit.** 29 artifacts (15 collected, public-domain or CC, plus 5 credited study crops of
  rsfgolfclub.com and masters.com; 14 made in code). Palette: Scorecard Paper, Linen, Tile White, Ink, Pencil, Locker
  Green, Fairway, Brass, Old Brass, Under-Par Red, Covenant Slate. Type: Libre Caslon Display/Text, Barlow,
  Barlow Condensed (tabular numerals).
- **Rules learned:** brass on paper is only 2.32:1, so brass text on paper uses Old Brass and brass stays on green.
  A brass focus ring on a Fairway button is 2.84:1, so focus rings sit offset on the surface around the button.
- **Rejected:** copying any club mark (no Masters, Augusta, or RSF crests). The board evokes the tradition
  instead: hand-hung leaderboard tiles, circle/square card marks, an engraved certificate, brass locker plates.
- Launched the design-system agent right away (the user is reviewing the board in parallel and can redirect).
