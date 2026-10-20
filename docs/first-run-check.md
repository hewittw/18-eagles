# First-run check

The agent used the deployed tool, https://18-eagles.vercel.app/clubhouse, as a brand-new golfer: a first visit on a phone,
a return visit later, then a laptop pass and a keyboard-only pass. It wrote down what a newcomer would think at each
step, fixed the small, clear problems, and listed the bigger ones as recommendations.

## Method
- **Browser:** Playwright's bundled headless Chromium, driven by the agent's own scripts (the same launch as
  `scripts/shot.mjs`). It never used the user's Chrome or a logged-in profile.
- **Storage:** every session starts in a fresh browser context with empty localStorage. "Coming back later" means
  saving that context's storage and opening it again in a new context and page, the way a person reopens the tab the next day.
- **Viewports:** phone 390×844, laptop 1440×900.
- **Evidence:** the agent took a screenshot at every step and looked at each one. Names are listed below, and the files are in
  `screenshots/first-run/` (the folder is gitignored, so they're local only).
- **Persona:** a 14-handicap who plays a Chicago muni (Jackson Park), has never seen the app, and wants to score a round on the phone.
- **Fixes** were verified on the local dev server (`localhost:3300`) with the same saved storage moved over, plus
  `npx tsc --noEmit` and `npx eslint` (both clean).

## Session 1: phone, first visit (390×844)
| Step | Screenshot | What the newcomer thought |
|---|---|---|
| Open the Clubhouse | `s1n-01-name-dialog` | A full-screen green "What should we call you?" with one field. It's calm and quick. But I don't yet know what this app *is*: the "golf journal that keeps every card" pitch and "Just looking?" only show up after I give a name. |
| Submit an empty name | `s1n-02-name-empty-submit` | The error sits right under the field and says what to type. Spaces alone get the same message. Good. |
| Name "Hank" | `s1n-03-after-name` | "Welcome to 18 Eagles, Hank." Nice touch. "Three quick questions (your index, your course, your bag), then play your first hole" tells me exactly what's coming. |
| Index "abc" | `s1-03-index-abc`, `s1n-04-index-abc` | "Use numbers only, like 12.4 (a plus handicap is written +1.2)." It's next to the field, keeps what I typed, and focus stays in the field. |
| Index "60" | `s1-04-index-60`, `s1n-05-index-60` | "A Handicap Index runs from +10.0 to 54.0. Check the number on your GHIN card." Clear, and it tells me where to look. |
| Index 14.2 → step 2 | `s1-05-step2` | The hero becomes a progress list (✓ index · 2 Home course · 3 bag · first hole). Reassuring. **But the question itself is below the fold:** I see the progress list, then a sticky "Make it my home course" bar, before I see any courses. |
| Back once | `s1-07-back-to-index` | "Back to your index" brings back 14.2, still filled in. Then forward again. Works as I'd hope. |
| Tap "Make it my home course" with nothing picked | `s1-08-home-none-picked` | It scrolls to the question and says "Choose the course you play most, or add yours." That's fine, but the button shouldn't have looked ready. |
| Search "jackson", pick it | `s1-10-search-jackson`, `s1-11-jackson-picked` | Search is instant. The button turns into "Make Jackson Park my home course", which tells me exactly what will happen. Delightful. |
| The bag | `s1-13-bag-question`, `s1-14-bag-15th` | A standard 14 is filled in and I tap to take clubs out or put them in. Adding a 15th shows "15 of 14 allowed" in a warning color, plus a note that it's fine for practice. Friendly, not a blocker. 19 club chips is a lot on a phone, but it's a one-time step. |
| "That's my bag" → Tee off card | `s1-16-teeoff-card`, `s1-17-teeoff-card-2` | Focus lands on "Tee off at Jackson Park". **But on a first visit, a whole "Three trophies to play for this week / 0 of 30 trophies won" case sits above Tee off**, so the one thing I came to do is a scroll away. The tees show yards, rating and slope. "Your rating and slope come from the tees you play" teaches me something. |
| Tee off → hole 1 | `s1-18-hole1`, `s1-18b-hole1-full` | A clean header (par, yards, stroke index) and big score tiles. The club buttons are below putts, penalties and tee shot, so tapping clubs means scrolling past three sections first. |
| Hole 1 by club taps: Dr → 7i → Pt → Pt | `s1-21-h1-four-shots`, `s1-22-h1-top-after-clubs` | **Delight:** the score sets itself to 4 (Par), putts fill in as 2, and the header reads "Through 1 · E · 4 strokes". This is the app's best moment. |
| Hole 2 by score tile (Bogey), 7 putts on purpose | `s1-24-h2-putts-6` | "Putts can't be more than your score of 5. Lower putts or raise the score." sits under the putts stepper. Clear. It's a warning, not a block (Next is still live). That's the right call mid-round. |
| Hole 3: Par, putts, a note | `s1-27-h3-putts-note` | The first "+" on putts jumps from "–" to 2, so three taps gave 4 putts, not 3. A small surprise. The note field says it "shows up the next time you play this hole". |
| Leave mid-round ("Clubhouse") | `s1-28-left-midround` | **Confusing:** the Clubhouse still says "Your locker is ready." with the index and the trophy case. Nothing above the fold says I have a round going. |

## Session 2: phone, coming back later (same storage, new context)
| Step | Screenshot | What the newcomer thought |
|---|---|---|
| Reopen /clubhouse | `s2-01-return`, `s2-02-return-after-name-deploy` | The hero still reads "Your locker is ready." **The Resume card ("Round in progress · Through 3 of 18 · +1 · Resume at hole 4") sits about 1,350px down, under the trophy case**, which is roughly 1.6 screens of scrolling on a phone. Below it, "Your first round · You're set / Tee off at Jackson Park" competes with it. That's the most common return trip, and it's the hardest thing to find. |
| Resume | `s2-04-resume-card`, `s2-05-resumed-hole4` | Once found, it does exactly the right thing: hole 4, "Through 3 · +1 · 13 strokes". |
| Score holes 4–18 by tiles | `s2-06-hole9`, `s2-07-hole18-scored` | Fast, about 0.8 s a hole including navigation. On hole 18 the primary button becomes "Finish round". Obvious. |
| The card | `s2-08-card-top`, `s2-09-card-story`, `s2-10-card-table` | "Card saved: 81 at Jackson Park" toast, a big 81, Out 40 / In 41, the differential, "Toward your index: 2 more cards", three trophies. Lovely. **Two things looked wrong:** the yards row said "White yds" but showed the *Blue* yardages (395 on hole 1, total 5,508; the hole screen had said 385), and "Putts 9" read like a full round when only 3 holes had putts. |
| The challenge | `s2-11-clubhouse-after-card`, `s2-12-challenge` | "Welcome back." · "Last time at Jackson Park: 81. Beat it." · "Challenge missed: putts on 3 of 18 holes" · next: "Make par on two par 5s … the mark for breaking 90 is about 1.5." Motivating, and it explains why. (I never chose "Break 90". It inferred that from my 14.2. That's fine, but it's not said.) |
| Trophy Room | `s2-13-trophy-room` | Gold "Low Round of the Week · #1 of 1" for my only card. Generous, and it made me smile. Every unwon piece says how to win it. |
| Stats | `s2-14-stats`, `s2-14b-stats-full` | Honest "1 round" views, a scoring mix, par 3/4/5 averages, clubs used. **Confusing:** Putts per round, Putts per hole and Greens in regulation said "No data yet. Track putts on the hole screen to see this." But I *did* track putts, on three holes. The card showed "Greens 3 of 3". It turns out stats only count rounds with putts on every hole, and the message didn't say so. |
| Cards | `s2-15-cards` | One row, clear. |

## Session 3: laptop (1440×900, fresh storage)
| Step | Screenshot | What the newcomer thought |
|---|---|---|
| Name → "Not yet: I'll earn one" → step 2 | `s3-01-laptop-name`, `s3-02-laptop-index`, `s3-03-laptop-step2` | Same flow, roomier. Enter submits the name. |
| "My course isn't here" → Add a course | `s3-04-add-course`, `s3-04b-add-course-full` | One column, real labels, a hint under each label. Par is pre-filled with a par-72 layout, so "missing par" can't happen (good design). I tested a missing name, rating 95 and slope 300 instead. |
| Submit with errors | `s3-05-add-course-errors`, `s3-06-slope-error` | Each error sits under its own field: "Enter the course name, like 'Balboa Park Golf Course'." · "For a par 72 course the rating is between 62 and 80. Check the number on the scorecard." · "Slope is a whole number from 55 to 155. 113 is average." Focus goes to the first error, and a summary by the button says "3 things to fix above. What you typed is kept." **Values were kept, even after a page reload.** Model form. |
| Fix (name, 9 holes, 33.4 / 112) → saved | `s3-07-after-fix` | It lands on the new course's page with "Tee off at hole 1". |
| Back to the Clubhouse | `s3-08-clubhouse-after-add`, `s3-09-search-own-course` | **Dead end:** onboarding is still on step 2 ("Where do you usually play?"), and the course I just added isn't among the suggested tiles. I had to search for it to make it my home course and carry on to the bag. |
| "Log a past round" for last week (Oct 12) | `s3-11-log-round`, `s3-12-log-errors` | A future date gets "Pick today or an earlier date. Rounds can't be logged ahead of time." An empty score gets "Enter your total score, or switch to hole by hole." Both errors sit by their fields. The live preview card on the right is a nice touch. |
| Saved (44 on the nine) | `s3-13-logged-card`, `s3-14-clubhouse-after-log` | **Three wrong-looking things:** the card's eyebrow said "18 holes" for a 9-hole course. The challenge said "Shoot 87 or better · Your last card was 88" (my 44, doubled to 18 holes without saying so). The course tile read "Chicago, IL," with a trailing comma. And "Earning your handicap index · 1 2 3" showed no box filled after posting a card. (A nine is half a card, which isn't explained.) |

## Session 4: keyboard only (laptop)
| Step | Screenshot | Result |
|---|---|---|
| Name dialog | — | Focus starts in the name field. Enter submits. Escape doesn't close it (correct, since a name is required). Tab cycles within the dialog. |
| Index → home course → bag | `s4-01-kbd-index` … `s4-04-kbd-home-btn` | After each step, focus moves to the new step's heading. Course tiles are one radio group (arrow keys move, Space picks). It took 2 Tabs to reach "Make Jackson Park my home course". The bag needs **19 Tabs** to reach "That's my bag" (one stop per club). |
| Tee off | `s4-05-kbd-teeoff`, `s4-06-kbd-teeoff-btn` | Focus lands on "Tee off at Jackson Park". 3 Tabs to the button. |
| Hole 1 | `s4-07-kbd-hole-score`, `s4-10-kbd-hole-tabbing` | **Bug: after "Tee off", focus was left on the page body**, not the "Hole 1" heading, so a screen reader announced nothing. Tab then started over at the skip link and the nav. The score tiles are one radio stop (arrow keys work). After the shot, putts and the note, the sticky "Hole 2 →" button comes *after* all 18 hole-strip buttons, about 50 Tabs in. |

## Issues found
| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | A round in progress is buried: the hero says "Your locker is ready", and Resume sits under the whole trophy case (about 1.6 phone screens down), next to a competing "Tee off" | High | Recommendation (Clubhouse layout, owned by the lead) |
| 2 | Keyboard/screen reader: leaving the Clubhouse (e.g. Tee off, Resume) left focus on the page body, because the router keeps the old page mounted but hidden and its `<h1>` was picked first | High (a11y) | **Fixed** |
| 3 | The finished card's "White yds" row showed the first (Blue) tee's yards, not the tees played | Medium (wrong data) | **Fixed** |
| 4 | Adding a course from onboarding step 2 doesn't come back to onboarding, and the new course isn't in the suggested tiles | Medium | Recommendation |
| 5 | On a first visit, the empty trophy case sits above Tee off, pushing the main action off screen | Medium | Recommendation (lead) |
| 6 | 9-hole courses: card eyebrow and Cards row said "18 holes" | Medium (wrong data) | **Fixed** |
| 7 | Score challenge after a nine: "Shoot 87 · Your last card was 88" for a 44 | Medium | **Fixed** (copy) |
| 8 | Stats said "Track putts on the hole screen" to someone who had, on some holes | Low–Med | **Fixed** (copy) |
| 9 | The card's "Putts 9" for a round with putts on only 3 holes | Low | **Fixed** |
| 10 | "Chicago, IL," trailing comma for added courses (Clubhouse tee-off tile, onboarding tiles) | Low | Recommendation (lead files: use `placeOf`) |
| 11 | Name screen comes before any explanation of the app or "Just looking?" | Low–Med | Recommendation (lead) |
| 12 | Step 2: the sticky "Make it my home course" shows before any course is picked, and the question is below the fold on a phone | Low | Recommendation (lead) |
| 13 | Putts stepper: the first "+" jumps from "–" to 2 | Low | Recommendation |
| 14 | Hole screen: "Next hole" is about 50 Tabs in, and club buttons are below three sections on a phone | Low | Recommendation |
| 15 | "Earning your index 1 2 3" shows no progress after a 9-hole card (halves aren't explained) | Low | Recommendation (lead) |
| 16 | Putter's accessible name reads "Pt green: Putter" | Low | Recommendation |
| 17 | Scaled yards sum to 5,378 on the card vs 5,375 on the tee chip (rounding) | Cosmetic | Left as is |

What delighted: club taps that count the score and the putts by themselves; "Make Jackson Park my home course"; the
"Through 1 · E" running total; the Add-a-course form (errors, focus, kept values even across a reload); "Last time at
Jackson Park: 81. Beat it."; gold for the first Low Round of the Week; the challenge saying why it was set.

## What we changed
| Fix | File |
|---|---|
| Route focus picks the new page's *visible* `<h1>`, so focus lands on "Hole 1" after Tee off and Resume (it used to stay on body) | `src/components/golf/RouteFocus.tsx` |
| A shared `yardsAt(course, tee, hole)`. The hole screen uses it (no change in output), and the finished card's yards row now shows the tees played | `src/lib/courses.ts`, `src/app/clubhouse/rounds/[id]/[hole]/HoleScreen.tsx`, `src/app/clubhouse/rounds/[id]/RoundCard.tsx` |
| Card eyebrow says "9 holes" for a 9-hole course. The Putts tile says "Putts · 3 holes" when putts weren't on every hole | `src/app/clubhouse/rounds/[id]/RoundCard.tsx` |
| Cards list says "9 holes" for 9-hole courses | `src/app/clubhouse/rounds/_list/Cards.tsx` |
| Score challenge after a nine: "Shoot 87 or better (44 for nine)" · "Your last card works out to 88 over 18 holes" | `src/lib/challenge.ts` |
| Stats: "Track putts on every hole of a round to see this." | `src/app/clubhouse/stats/_stats/Stats.tsx` |

Verified on localhost with the saved sessions moved over: `v-01-card-white-yards` (385 / 5,378 on White), `v-02-card-putts`,
`v-03-cards-nine`, `v-04-card-nine-label`, `v-05-challenge-nine`. Focus after Clubhouse → hole now reads "H1 Hole 7".
Hole → hole, hole → Cards and Cards → Clubhouse still work.

## What's left (recommendations)
1. **Make resuming the first thing on the Clubhouse.** When a round is in progress, put "Resume at hole 4 · Jackson Park ·
   through 3, +1" in the hero (or directly under it, above the trophy case), and hide or shrink the "Tee off" card to a quiet
   "Start a different round" link.
2. **First visit, put Tee off before the trophy case** (or hide the case until the first card). The showcase already sells the trophies.
3. **Add a course from onboarding:** return to the Clubhouse with the new course picked as home (or show "Yours" courses first
   in the suggested tiles), so the bag step follows.
4. **One line about the app on the name screen** ("A golf journal that keeps your cards and works out your handicap"), and a
   quiet "Just looking? Explore a sample season" link there.
5. Step 2: don't show the sticky commit bar until a course is picked, and on phones scroll the question into view.
6. Hole screen: start putts at 1 on the first "+" (or label it "2 putts?"); let keyboard users reach Next sooner (put the
   hole strip after the action bar in DOM order, or add a shortcut); consider moving clubs above putts for club-tappers.
7. Explain nines in the index tracker ("A nine counts as half a card").
8. Use `placeOf()` for course places in `Clubhouse.tsx` and `Onboarding.tsx` (no trailing comma).
9. Putter accessible name: "Pt: Putter" (the visible "green" is a hint, not part of the name).
