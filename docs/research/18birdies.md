# 18Birdies (free golf GPS, scorecard, and stats)

Studied Oct 2026 (iOS v16.41, 4.9 stars, about 306K ratings). Public sources only, no login. **Verified** = screenshot or official text; **inferred** = my reading. I found no public screenshot of sign-up, the course picker, or the score-entry sheet, so those notes come from the help center.

## 1. The first screen
- Before sign-in (verified, help center): a sign-in page with **Continue with Phone # or Email**. An account is required.
- After sign-in (inferred): a tab bar with **Play, Courses, Me**, and a "Start Free Trial / Go Premium" button top-right.

## 2. What it asks for, in order
1. **Account:** email or phone, first and last name, and a password of at least 6 characters, then "follow the prompts." That's about 4 or 5 fields, plus possibly a verification code.
2. **Gender:** asked during setup "for handicap-related calculations."
3. **Scoring Goal:** Break 100, 90, 80, or 70, or "I Don't Have One Yet." The help center says you "may be prompted… when first using the app." This is the only onboarding question about your golf.
4. **Location:** required for GPS and nearest-course detection (inferred: asked at first Play).
5. **Handicap, home course, bag:** none up front. The handicap is earned; home courses (up to 5) are set later.
6. **Payment:** none to sign up. Premium costs $99.99/yr, $19.99/mo, or $7.99/wk, with a trial. The free tier shows ads (a third-party claim).

About 4 steps and 6–7 fields before anything useful.

## 3. Time to something useful
Its strength. **Play → Start Round** opens setup with **your nearest course preselected** (verified). On a course that's **about 3 taps** (Play, Start Round, Play) to live yardages and an **Enter Score** button; about 1–2 minutes including sign-up (inferred).
- **Course selection screen:** it shows the auto-detected nearest course with a **Switch/Change Course** control. That opens nearby suggestions and a search box. The help center warns that search is literal and suggests short names or a city. Setup rows: Round Type (18 or a 9), Starting Hole, **Tees**, Scoring Mode, Visibility, plus Other Settings (Exclude Round, Tournament Mode). Skipping tees silently makes the round handicap-ineligible (verified).
- **The Courses tab** is for browsing, not the round picker: search, tag chips, a map, filters, and pinned Home, Saved, Bucket List, and Played lists. A Course Profile has a header photo with weather, **Start a Round**, and **Course Preview** (verified text).

## 4. Empty states
No public screenshot. The handicap appears "after you save an eligible… round," so before that Me/stats presumably show no number (inferred).

## 5. How it teaches
By doing. No tour, but two safe sandboxes: **Course Preview** (hole maps "from your couch") and a private **test round**. The Scoring Goal adds in-round "targets, milestones, and progress updates."

## 6. Score entry on a hole
- **From the GPS map:** a blue **"Hole 17 / Enter Score"** pill, bottom-center and thumb-reachable, about 130×60 pt (screenshot 01).
- **Classic Score Entry** (default): score, putts, fairway, GIR, penalties, chips, sand. Reviewers report "big text boxes instead of simple icons" for fairway, fairway asked on par 3s, and a 3 saved with 4 putts (**no validation**).
- **Smart Tracking** auto-detects shots, then asks you to **Confirm Shot Locations**: a Score/Shot/Putt header strip and pins tagged "F, 3W" (lie, club) (screenshot 02). A Play Store reviewer says it adds phantom shots on cart-path days.

## 7. Handicap
- Free, unofficial (not USGA/WHS), automatic **after the first eligible round** (best 1 of 1–5 rounds, up to 8 of 20).
- **Display:** **19.8** in a big blue circle, a trend chart, and the caption **"Lowest 8 out of 20 rounds are counted"** (screenshot 04). Post-round: **20.1 → -0.3 → 19.8** (screenshot 03).

## 8. Reasons to come back
- Round Performance summary (target rings, fairway miss fan) and course percentiles ("Top 8% at this course").
- Social: course leaderboards, forums, side games (Skins, Nassau), friends' live rounds.
- End of Year Summary and Scoring Goal progress.

## 9. Take for our app
- **Preselect the likeliest course** (last played, or the first saved) on the picker, with a small "Change course" link. One tap from home to hole 1.
- **Make tees a required, visible choice** on setup, and say why ("needed for your handicap"). Don't let it silently void a round.
- **Explain the handicap in one plain line** under the big number ("Best 1 of your 3 rounds counts") and show the change after each round (20.1 → 19.8).
- **Put a "Score this hole" target at the bottom center** (at least 56px tall) so it works one-handed.
- **Ask one golf question up front:** a Scoring Goal ("Break 90") that frames empty stats as targets instead of blanks.

## Avoid
- A required account and a 6-character password before any value. We have no accounts, so the first open should land on a course list.
- Asking fairway on par 3s, or allowing putts ≥ score. Hide and validate fields by context.
- Upsell screens in the path to the score ("two swipes over, one through a premium only screen").
- Literal-match course search. Match partial words, ignore "The," and show photos.
- Auto-detection that guesses wrong (phantom shots). Club per shot should be the user's tap, not inference.

## 10. Sources
- https://apps.apple.com/us/app/18birdies-golf-gps-tracker/id892700751
- https://play.google.com/store/apps/details?id=com.squarevalley.i8birdies&hl=en_US
- https://help.18birdies.com/article/15-creating-a-new-account
- https://help.18birdies.com/article/13-start-a-round-of-golf
- https://help.18birdies.com/article/374-round-setup-and-settings
- https://help.18birdies.com/article/218-finding-and-saving-courses
- https://help.18birdies.com/article/199-course-profile
- https://help.18birdies.com/article/779-home-courses
- https://help.18birdies.com/article/231-preview-a-round-from-your-couch
- https://help.18birdies.com/article/241-i-cant-find-my-course
- https://help.18birdies.com/article/712-keeping-score
- https://help.18birdies.com/article/733-18birdies-scoring-modes
- https://help.18birdies.com/article/663-scoring-goal
- https://help.18birdies.com/article/86-18birdies-handicap-overview
- https://help.18birdies.com/article/603-how-is-18birdies-handicap-calculated
- https://help.18birdies.com/article/51-entering-a-past-round
- https://help.18birdies.com/article/31-finishing-and-confirming-a-round
- https://help.18birdies.com/article/689-end-of-year-summary
- https://help.18birdies.com/article/590-wear-os (search snippet only)
- https://help.18birdies.com/article/520-is-the-app-free (search snippet only)
- https://18birdies.com/clubhouse/play/need-a-golf-scorecard-app-the-18birdies-app-has-you-covered
- https://18birdies.com/features/
- https://www.scoringzone.net/blog/18birdies-review (competitor-published)
- https://golfhubz.com/how-to-use-the-18birdies-golf-app/ (generic, low confidence)
- https://www.golfmonthly.com/reviews/gps/18birdies-app-review-is-this-the-best-free-golf-gps-app (search snippet only)
- https://mygolfspy.com/news-opinion/i-put-golf-pad-head-to-head-against-18birdies/ (search snippet only; fetch blocked)

## Images
All are 18Birdies store screenshots (marketing composites), used as screenshot, for study.
- `public/research/18birdies/01.jpg`: GPS hole view with "Plays Like 220y 4Hy" and the bottom-center **Hole 17 / Enter Score** pill. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/22/de/fe/22defe05-7bb1-9bf6-84a4-84e88fc07270/18Birdies_Vertical_App_Store_1290x2796_3_091024.png/600x1300bb-80.jpg
- `public/research/18birdies/02.jpg`: Shot tracking, with the Score/Shot/Putt header, club-tagged shot pins, and Confirm Shot Locations. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/2f/12/35/2f123584-1fbc-61db-b224-51395df99d40/18Birdies_Vertical_App_Store_1290x2796_6_091024_Track_Shot.png/600x1300bb-80.jpg
- `public/research/18birdies/03.jpg`: Post-round scorecard and Round Performance (targets, fairways, handicap 20.1 → 19.8). Source: https://play-lh.googleusercontent.com/9bpG5H4n9yPRUzgCpVZSJ_tpKFwTBBLvMnxUnTsaNDcj5nsV6Yk2pdg54Ruyle-6HC7ydzO-FClTHvosTvfqN6A=w600-h1300
- `public/research/18birdies/04.jpg`: Handicap sheet, with 19.8 in a circle, a trend chart, and "Lowest 8 out of 20 rounds are counted." Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a1/d8/77/a1d8777a-74df-13dc-a019-99e2aa985118/18Birdies_Vertical_App_Store_1290x2796_7_091024_Handicap.png/600x1300bb-80.jpg
- `public/research/18birdies/05.jpg`: Your Stats, with a gross-score donut, par-3/4/5 averages, and FIR/GIR gauges with course percentiles. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/8a/35/59/8a35599d-1bb4-dd3c-9136-8be826576b4a/18Birdies_Vertical_App_Store_1290x2796_5_091024.png/600x1300bb-80.jpg
