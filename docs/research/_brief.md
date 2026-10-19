# Research brief: how golf apps welcome someone new (Assignment 3, step 3)

We're building a personal golf round journal (Next.js, localStorage only, no accounts): a handicap in big numbers
on the home page, a course picker with photos, a hole-by-hole screen (score, club per shot, notes), and breakdowns of
play over time. Our first visit has to deliver something useful right away, through learning by doing (no tour, no empty screen).

Study ONE app (named in your prompt) using web search and fetches: App Store / Google Play listings and their screenshots,
the app's help center, onboarding teardowns, reviews, YouTube walkthrough descriptions, and the web app if there is one
(public pages only; never log in, never create an account).
Write `docs/research/<slug>.md` with exactly these sections:

1. **The first screen**: what you see on open, before doing anything.
2. **What it asks for, in order**: account, permissions (location, notifications), profile, handicap, home course, bag,
   payment/upsells. Count the steps and fields.
3. **Time to something useful**: how many taps or minutes until the first real value, and what that value is.
4. **Empty states**: what the home and stats screens show before any rounds are recorded.
5. **How it teaches**: a tour, coach marks, sample data, or learning by doing.
6. **Score entry on a hole**: the controls (stepper, number pad, tap grid), club/shot tracking, putts, fairways, notes.
   Note the touch-target sizes and one-handed use if visible.
7. **Handicap**: how it's introduced, what it needs before it shows a number, and how it's displayed.
8. **Reasons to come back**: recaps, streaks, notifications, goals, social.
9. **Take for our app** (3–5 bullets) and **Avoid** (3–5 bullets), specific and actionable.
10. **Sources**: every URL you used.

Also save 3–6 representative screenshots (App Store images are fine) to `public/research/<slug>/NN.jpg`
(≤1200px wide), each listed in a final **Images** section with its source URL and a one-line caption. Credit them as
"screenshot, for study". Be honest about what you could only infer versus what you verified. Under 900 words in the text.

Rules: touch only `docs/research/<slug>.md` and `public/research/<slug>/`. Don't touch git (I commit), don't start servers,
don't install packages. Report back in 10 lines or fewer: the 3 most useful findings for our first visit, plus the file paths.
