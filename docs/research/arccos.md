# Arccos Golf

Studied Oct 2026, during the rollout of the rebuilt iOS app (tabs: Start, Player, Clubs, Courses, Activity). Public sources only, never logged in. The support center returns 403, so some details come from search excerpts. Step names come from the older *Arccos 360 New User Guide*. **Verified** means a screenshot or official text shows it. **Inferred** means I'm reading between the lines.

## 1. The first screen
- **Inferred:** a **Create Account** screen with permission prompts at launch (per the old guide). I found no current screenshot.
- After setup (verified, screenshot 05), the **Start** tab is home: nearest course pre-selected, a shot-detection mode, round setup, a warm-up builder, and a big green **Start Round**.

## 2. What it asks for, in order
1. **Permissions at launch:** notifications, then location (it asks for "Always"). Microphone/camera come later, during pairing.
2. **Account:** your details, then **Continue** (fields undocumented, about 4 inferred).
3. **"Your golf game" profile:** the guide says "fill in all the fields, even if they are estimations" (handicap and similar, exact fields not seen), plus an optional photo, then **Submit**.
4. **Bag:** "essential that you select every club," pick a sensor type per club, then pair **one at a time** (pull the club, point the camera at its sensor, put it back). The putter is mandatory. The minimum is 8 clubs plus the putter, and it takes 5 to 15 minutes. Sensorless users still add every club.
5. **Payment:** hardware comes with a free first year, then about $199/yr. The FAQ mentions a 14-day trial.

That's about **5 stages and 20+ actions** before you can play, and the bag alone takes 14 pairing loops.

## 3. Time to something useful
- **On the course:** GPS yardages appear at Start Round, roughly 10 to 15 minutes after install. That's the first real value.
- **Analysis:** Strokes Gained needs a round of **6 or more holes**. AI Caddie strategy unlocked only after **five 18-hole rounds** (older blog). There's no insight on day one.

## 4. Empty states
I found no public screenshot of an empty tab. **Inferred:** with no rounds, the Player tab (scoring average, a "10 round trend," 4 facet bars) and the Clubs tab (Smart Distance bars) are blank, though the bag list exists. **Verified:** marketing only shows full data (166 rounds, 8,384 shots). No sample data.

## 5. How it teaches
Learning by doing, with teaching moved outside the app: a PDF guide, support articles, YouTube tutorials, and tips ("pair in a quiet, well-lit space"). I found no tour or coach marks. **Post-round review** teaches the rest. Reviewers budget 5 minutes to fix missed gimmes and wrong clubs.

## 6. Score entry on a hole
- **Automatic first:** sensors (or Air or the phone) log each shot's spot and club. The hole map (screenshot 01) shows shot dots with yardages and a **– 2 +** putt stepper.
- **Manual fixes:** **Edit**, tap a shot, then drag it, tap the **green circle** for the club menu, add a **penalty**, or **delete**. **Add Shot**: tap the map, pick a club, **Done**. Order comes from position.
- **Shot List** (swipe up): add penalties, or mark a putter from the fringe as a **Chip**.
- **Putts:** the stepper, plus a draggable pin on a zoomed green. Strokes Gained needs only the 1st-putt distance and the putt count.
- **Club per shot** is the core data. Sensorless AI tagging is 60 to 90% right, so you fix it later.
- **Notes:** none. Fairway/Rough/Sand is automatic and editable.
- **Touch targets:** a small stepper and dots (inferred). Hands-free use (phone in pocket) replaces one-handed use.

## 7. Handicap
Arccos shows its own handicap plus facet handicaps (driving, approach, chipping, sand, putting), updated after each round over last-round and last-20 windows. The new Player tab leads with a huge **scoring average (82.3)**, "Improving by 1.1 strokes," against a **target handicap** ("GOAL: 10 HCP") set from a "compared to…" dropdown, not onboarding. USGA posting is separate. I found no documented minimum-rounds rule.

## 8. Reasons to come back
AI round summaries ("Round Story," Club MVP, Practice Focus), a locked-in focus area with drills, 15/30/60-minute warm-ups, a "Golf Passport" course map, emails ("too many gimmes"), and reminders about weak areas. Social features were reportedly cut.

## 9. Take for our app
- **The club is a one-tap chip on each shot**, chosen from *your* bag in bag order (like Arccos's green circle).
- **Pre-fill a standard 14-club bag** (Driver through Putter), each removable with one tap. Arccos makes the bag its heaviest step.
- **Show the 4-facet breakdown from round one**, labeled "1 round" honestly.
- **A Round Story after hole 18:** score, best club, one focus. That gives a reason to come back next time.
- **Put the putts stepper next to the score** (– 2 +). It's the fastest stat to log.

## Avoid
- **Pairing 14 clubs before the first useful screen.** Nothing should come before the first hole.
- **Marketing that only shows full data.** Design the 0-round and 1-round states on purpose.
- **Gating insight behind 5 rounds** (Caddie). Give a small, honest insight after round 1.
- **Moving teaching into PDFs and videos.** Hints belong on the screen where they're needed.
- **Tiny map dots and steppers** for key edits. Make targets at least 44px.

## 10. Sources
- https://apps.apple.com/us/app/arccos-golf/id841396631
- https://play.google.com/store/apps/details?id=com.arccosgolf.androidFlagship&hl=en_US (couldn't be read)
- https://images-eu.ssl-images-amazon.com/images/I/911SMktL72S.pdf (Arccos 360 New User Guide)
- https://support.arccosgolf.com/hc/en-us/articles/34915409453972-Arccos-Sensors-Initial-Pairing-Guide-Step-by-Step-Instructions (search excerpt)
- https://support.arccosgolf.com/hc/en-us/articles/360039057412-How-do-I-add-a-shot (search excerpt)
- https://support.arccosgolf.com/hc/en-us/articles/46185683620116-Arccos-Air-Setup-Guide-Getting-Started-and-Initiating-Your-First-Round (search excerpt)
- https://support.arccosgolf.com/hc/en-us/articles/50226886161428-How-Do-I-View-My-Round-Stats (search excerpt)
- https://www.arccosgolf.com/pages/how-to-review-and-edit-your-round
- https://www.arccosgolf.com/pages/how-to-get-your-smart-club-distances
- https://www.arccosgolf.com/pages/arccos-members-frequently-asked-questions
- https://www.arccosgolf.com/blogs/community/how-various-handicaps-use-arccos
- https://uk.arccosgolf.com/blogs/community/first-step-to-a-smarter-golf-season-setting-your-target-handicap
- https://golf.com/gear/arccos-new-app-update-2026/
- https://breakingeighty.com/arccos-caddie-review
- https://breakingeighty.com/arccos-360-review
- https://www.caddiehq.com/resources/how-to-use-arccos-golf

## Images
All are App Store screenshots of the new Arccos app by Arccos Golf LLC, used as screenshot, for study.
- `public/research/arccos/01.jpg`: Hole map, with shot dots and yardages, Green Map/Strategy buttons, and the – 2 + putt stepper. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/16/d4/57/16d457ee-840d-3bfc-14e1-f3dc9afe5f85/AppleStore-2.png/600x0w.jpg
- `public/research/arccos/02.jpg`: Clubs tab, with Smart Distance bars per club (Dr 324, 3w 296…) and a Compare clubs dispersion view. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/95/9a/8d/959a8d97-9c73-abd4-14fe-4f6b22cb2147/AppleStore-4.png/600x0w.jpg
- `public/research/arccos/03.jpg`: Player tab, with the big 82.3 scoring average, goal of 10 HCP, and a 4-facet Strokes Gained 10-round trend. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/6c/a3/84/6ca384bf-aa1a-dc84-97a5-ec4195f9feca/AppleStore-3.png/600x0w.jpg
- `public/research/arccos/04.jpg`: Round details, with the scorecard, a "Round Story" AI summary, a practice focus, and round potential. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/cb/b2/3b/cbb23b1d-df88-17ba-f040-5ae5264def42/AppleStore-6.png/600x0w.jpg
- `public/research/arccos/05.jpg`: Start tab, with course, shot-detection mode, round setup, a warm-up builder, and Start Round. Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/26/c4/19/26c41983-3200-43e8-0844-a3985ac638b5/AppleStore-7.png/600x0w.jpg
- `public/research/arccos/06.jpg`: Courses tab, a "Golf Passport" map (26 courses, 166 rounds). Source: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/b8/00/90/b80090a3-3fe0-34ba-fe61-ae39aefca13d/AppleStore-5.png/600x0w.jpg
