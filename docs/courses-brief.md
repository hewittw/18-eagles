# Course library brief (data agents)

We're building "18 Eagles", a personal golf round journal (Next.js, localStorage, no runtime APIs). It ships with a
built-in library of real courses. The course picker shows each course's photo; the hole screen shows par, yards, stroke
index, and hole names; the handicap uses each tee's course rating and slope. **Accuracy matters**: a golfer will check
these numbers against the real scorecard.

For each course assigned to you, write `src/data/courses/<slug>.json` matching `src/lib/course-types.ts` exactly
(read it first), and download images into `public/courses/<slug>/`.

## Data
- Hole-by-hole par, yards (from the longest tee you list first), and stroke index (handicap) from the course's
  official scorecard where possible (the club website, a scorecard PDF or image, BlueGolf, GolfPass, Wikipedia, or a
  tournament media guide). Hole names where the course has them (Augusta, St Andrews, Carnoustie, Pinehurst don't…).
- 2–4 tees, longest first, each with total yards, par, men's course rating, and slope. Use the USGA Course Rating
  database, a published scorecard, or Scottish Golf/WHS figures (the UK uses slope too). Mark `"source": "published"`
  only when you found it in a source; otherwise make a careful estimate, mark it `"estimated"`, and say how in
  `dataNotes` (e.g. Augusta National has no published rating).
- `blurb`: ≤ 40 words, factual (what it's known for: majors hosted, architect, setting). No hype words.
- Put every URL you used in `sources`. If two sources disagree, prefer the official club or tournament source and note it.

## Images
- Only freely licensed photos: Wikimedia Commons (CC BY, CC BY-SA, CC0, public domain), Flickr CC with a commercial-OK
  license, or government/public-domain archives. **Never** the club's own website photos, news photos, or Google Images.
- Download the full image, then resize to ~1600px on the long side and compress to a JPEG under 450KB
  (`sips -Z 1600 --setProperty formatOptions 70 in.jpg --out out.jpg` works on this Mac). Name them `hero.jpg`, `g1.jpg`…
- Prefer real course scenery: a famous hole, green, or clubhouse. Open each downloaded image (Read it) and confirm it
  really shows that course and isn't blank or a map. Write specific alt text ("The 18th green at Pebble Beach with the
  Pacific behind it"), not "golf course".
- If no freely licensed photo exists, set `"hero": null` and say so in `dataNotes`. The UI draws an illustration instead.

## Check and report
- Run `node scripts/check-courses.mjs <slug> …` from the project root until every one of your files passes.
- Touch only your own `src/data/courses/<slug>.json` files and `public/courses/<slug>/` folders. Don't touch git,
  don't start servers, don't install packages, and don't edit the schema or the check script (tell me if the schema
  doesn't fit a course).
- Report back briefly: a table of slug | par | yards | tees | images | what's estimated, plus anything you're unsure of.
