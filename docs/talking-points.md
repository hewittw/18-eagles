# Ready to explain in class

The five things the checklist says to be ready to explain, in a few sentences each.

## 1. Design process: the tool, the user, what brings them back
- **Tool:** 18 Eagles, a golf journal. You play a round hole by hole on your phone, every card is kept, and your
  Handicap Index is worked out from your own cards (a simplified World Handicap System).
- **User:** a weekend golfer who plays a home course most weeks, with a few trips to famous courses. They want scoring
  to be faster than a pencil, and want to see whether they're getting better.
- **What brings them back:** the weekly round. Every return visit answers "did I get better?":
  - the index and how it moved;
  - "Last time here: 87. Beat it.";
  - the next-round challenge (met or missed);
  - this week's trophies, which reset every Monday.
- **Process:**
  - We planned the flows first (`flows.md`, shown in the README).
  - Subagents researched how three apps onboard people.
  - An Opus subagent built the mood board, then the design system.
  - Then the build, with shared components (`docs/components.md`).
  - The look changed twice from feedback: first to masters.com's colors and type, then to an iOS-app feel modeled on 18Birdies.

## 2. Onboarding
- **Research:** GHIN, 18Birdies and Arccos (`docs/research/`). GHIN asks for an account before anything useful.
  18Birdies gets you to a scorecard quickly. Arccos needs hardware. What we took: ask only what changes the first
  round, and get to hole 1 fast.
- **The first visit, in order:**
  1. A full-screen name question. It says what the app is, and "Just looking?" loads a sample season.
  2. Three short setup steps on the Clubhouse itself: your Handicap Index (or "earn one"), your home course from
     photo tiles, and your bag.
  3. Tee off at your own course.
- Each step saves the moment it's answered and has Back. There's no tour and no empty screen. Below the questions, a
  showcase shows the trophies you can win, a still of the hole screen, the handicap and the challenge.

## 3. Retention
- **Worked out from your cards, never stored:** the index, the challenge and the trophies. They can't drift out of sync with the cards.
- **Weekly:**
  - Low Round of the Week, ranked against all your cards: #1 gold, top 3 silver, top quarter bronze.
  - The Jacket, for beating your goal.
  - The Challenge Medal.
- **Longer term:** 5 crystal and 22 career trophies, plus "new since your last visit" markers.
- **Resume:** a round in progress is saved on every tap. When you come back, the Clubhouse leads with "Hole 7 at … is waiting".
- **Storage:** everything lives in one localStorage key, with export and import in the Locker. There are no accounts and no backend.

## 4. The agent's feedback and the changes made
- **First-run check** (`docs/first-run-check.md`, summary in the README): an agent used the live site as a new golfer.
  It played on a phone, came back later, used a laptop, then did it all by keyboard only. It found:
  - **Resume was buried:** we moved it to the top.
  - **Focus was lost after Tee off:** fixed in RouteFocus.
  - **The card showed the wrong tee's yards:** fixed.
  - **Nine-hole cards were labelled "18 holes":** fixed.
  - **Adding a course from onboarding was a dead end:** it now comes back to setup with that course set as home.
  - **A name screen with no context:** we added a one-line pitch and "Just looking?".
- **Accessibility:** three passes, checked against all 66 items from the week's materials (`docs/a11y-requirements.md`,
  results in `docs/verification.md`). axe finds 0 problems on every page and state. A keyboard-only walk from first visit
  to a finished card takes 87 key presses and never gets stuck. The contrast of every color pair is measured from the
  design tokens.
- **Visual QA:** an agent viewed about 1,000 screenshots at 19 sizes and found 29 issues, all fixed. Examples: buttons
  wrapping, a gap above the tab bar, the hole screen being mostly chrome on an iPhone SE, and two chart colors that
  were the same.

## 5. The agentic workflow: what was easy and what was hard
- **Easy:**
  - Running work in parallel: research, mood board, design system, builders and verifiers each owned their own files.
  - Verification an agent can actually prove: axe, contrast math, measured overflow and button widths, persistence and network checks on the live site.
- **Hard:**
  - **Taste:** the first two looks read as "AI". It took concrete references (masters.com, 18Birdies) and screenshots from the user to fix.
  - **Coordinating agents in one tree:** we staged explicit paths only, assigned file ownership, and messaged agents mid-task.
  - **Things that only show on a real device:** the strip of background above the tab bar, and buttons changing size with course names.
  - **Next 16 details:** prerendering, Activity keeping hidden pages mounted (it confused focus), and a stale dev-server CSS cache (twice).
- **Lesson:** describe the goal and the evidence you want, then have an agent check its own work by looking at
  screenshots, not by trusting the code.
