# GHIN (USGA, "GHIN Mobile")

Studied Oct 2026, after the v7 redesign. Public sources only, no login. **Verified** = shown in a screenshot or official text; **inferred** = my reading.

## 1. The first screen
- Before sign-in (from help pages, not seen): a login screen with GHIN Number/email, password, "Remember Me", **Create Profile**, and a free-trial entry.
- After you sign in (verified, screenshot 01): a full-bleed course photo with **"Handicap Index® 9.4"** in huge white numerals, "Low H.I. 8.2 (2/3/26)" under it, a navy ID card. Below that: three round buttons (**Post Score**, **Play Round**, **Handicap Calculator**), a Sentry ad banner, and a tab bar (Home, Golfers, center flag, Stats, Account).

## 2. What it asks for, in order
1. **Account.** Members verify 2 of 3 fields (Last Name, GHIN Number, Email), then finish from an emailed link and set a password: about 4 fields plus an inbox trip. A club must already have issued the GHIN number. Non-members take the **free trial** (fields undocumented).
2. **Location** for Nearby courses and GPS (inferred: asked in context).
3. **Profile, handicap, home course** come from the association record. **Bag:** none.
4. **Payment:** Enhanced GPS is a $49.99 in-app purchase. Full features need paid association membership. Trial users get no GPS.

## 3. Time to something useful
- **Member:** zero taps after login; the Index is right there. The cost is paid outside the app (joining a club).
- **Trial user:** it takes **54 holes** (three 18-hole rounds) before you get even an "Estimated Handicap Range" like 5–10. Days or weeks.
- Posting a total takes about 6 steps: Post Score, course, method, holes/tees/type/date, score, Post.

## 4. Empty states
- **Home:** a golfer under 54 holes sees **"NH"** (No Handicap) where the number goes (per NCGA help; screen not seen).
- **Stats:** no public screenshot of it empty. Inferred: zeros or blanks, no sample data.

## 5. How it teaches
It doesn't, inside the app. Teaching lives in association blog posts and YouTube how-tos. These warn about traps, like having to *toggle* from "Total Score" to "Hole-by-Hole", or leaving "The" off course searches. No tour or coach marks; you learn by doing a real post.

## 6. Score entry on a hole
**Three methods:** Hole-by-Hole (recommended), Hole-by-Hole with Stats, or Total Score.
- **Total score:** type 9-hole or 18-hole totals; **you** must cap each hole at net double bogey first. No partial rounds (10–17 holes).
- **Hole-by-hole:** the app caps scores automatically and lets you leave unplayed holes blank (a "dash" key to the left of "1"). Every association recommends it.

**New v7 scorecard (verified, screenshot 03):**
- A scorecard strip at the top (Hole / Yds / Par / S.I. / Score, four holes at a time, current hole highlighted). Bogeys boxed, birdies circled, dots for handicap strokes.
- A **GPS | Scorecard** toggle, a big "18" with ← → arrows, and "PAR 5 · 518 yds · S.I. 6".
- A row of **large par-relative tiles**: 2 ALBATROSS, 3 EAGLE, **4 BIRDIE** (selected, solid blue), 5 PAR, scrolling sideways. They look about 80–90 pt tall and sit in thumb reach (inferred). The listing promises "one-handed scoring."

**Stats per hole:** putts, GIR, fairway, and miss side (left/right/short/long). No clubs, no notes. A post-redesign review: "you now can't see what you've entered for previous holes without scrolling back to the left," and it "doesn't remember the tees I used."

## 7. Handicap
- **Introduction:** handicap is the product: the hero of Home, plus its own Stats subtab (progress, Differentials, milestones).
- **What it needs:** 54 holes from rated courses. It updates **overnight**. Trial users get only a range.
- **Display (verified):** a giant number over a photo, Low H.I. and date as quiet secondary text. Stats shows "9.2 Today", a "↓1.0 over last 5 revisions" chip, and a trend line. New **Revision Highlights** show your latest Differential, *the next score that will drop off*, and your best of the last 20.

## 8. Reasons to come back
- Posting is required for handicap integrity. Revision Highlights show "what drops next".
- Stats deltas ("↑0.3 vs. prior 5 rounds").
- **Challenges** (local net leaderboards; 750+, 30,000 golfers), match play, Golfer lookup, Apple Watch.
- Push notifications: undocumented.

## 9. Take for our app
- **Handicap as hero:** one giant numeral over a course photo, a quiet second line, and a trend chip ("↓1.0 over last 5").
- **Par-relative score tiles named Birdie / Par / Bogey,** about 80pt, near the thumb, one tap per hole. Add a mini-scorecard strip with circles and boxes.
- **Hole-by-hole by default, with automatic net-double-bogey capping.** Offer "Quick total" second, saying what it gives up.
- **"What drops next"** makes an abstract number feel alive. We can show "your next round replaces X."
- **Explain partial progress:** where GHIN shows "NH", we show "2 of 3 rounds to your first handicap" plus an estimate right away.

## Avoid
- **Gating value behind identity or 54 holes.** Our first visit should end with a number or estimate.
- **A hidden mode toggle** (Total vs Hole-by-hole) that help pages must warn about.
- **Losing context.** Keep previous holes visible; remember last tees and course.
- **Teaching through outside blog posts.** Explain caps and differentials inline, at the moment they happen.
- **Ad banners on the home page**; they cheapen the clubhouse feel.

## 10. Sources
- https://apps.apple.com/us/app/ghin/id491796218
- https://itunes.apple.com/lookup?id=491796218&country=us (listing text and screenshot URLs)
- https://play.google.com/store/apps/details?id=com.advancedmobile.android.ghin&hl=en_US (search snippet only)
- https://mediacenter.usga.org/GHIN-30-Day-Trials
- https://mediacenter.usga.org/press-releases-usga-unveils-upgraded-ghin-mobile-app-new-stats-apple-watch-ghin-challenges
- https://www.idahoga.org/news/2026/10/7/the-new-ghin-app-is-here
- https://sports.yahoo.com/articles/ghin-app-finally-makes-stats-135126283.html
- https://blog.ncga.org/how-to-post-a-score-using-the-usga-ghin-mobile-app
- https://blog.ncga.org/what-does-nh-mean-on-your-ghin-profile
- https://support.oga.org/knowledge/how-do-i-post-my-scores-on-the-ghin-mobile-app
- https://help.scga.org/knowledge/ghin.com-hole-by-hole-score-posting-instructions
- https://msga.org/handicap/post-a-score/ (search snippet only)
- https://www.usga.org/handicapping/ghin-faqs.html (quoted through search snippets; direct fetch blocked)
- https://www.youtube.com/watch?v=23qYQJvfaCQ (title only)

## Images
All are App Store screenshots of GHIN v7 by the USGA, used as screenshot, for study.
- `public/research/ghin/01.jpg`: Home, with the giant Handicap Index 9.4 over a course photo and Post Score / Play Round / Calculator. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/54/14/3f/54143fb4-8c7c-a4c6-04b3-4c4ee00f0e19/1-Handicap_Index.jpg/600x1300bb.jpg
- `public/research/ghin/02.jpg`: GPS hole map with distance callouts and front/center/back yardages. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/49/e5/23/49e52303-a40e-91b3-8c51-6b85e2170590/2-GPS.jpg/600x1300bb.jpg
- `public/research/ghin/03.jpg`: Hole scoring, with a scorecard strip above large Eagle/Birdie/Par tiles. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/94/da/94/94da94b8-070e-d760-631e-5907f9120a5e/3-Posting.jpg/600x1300bb.jpg
- `public/research/ghin/04.jpg`: Stats Overview, with rounds and courses counts, a Handicap Index trend line, and stat deltas. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/06/c9/69/06c969b8-ab15-ff57-a37c-244d3e09372a/4-Stats.jpg/600x1300bb.jpg
