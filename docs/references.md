# References: The Members' Ledger (clubhouse direction)

What we studied for the mood board, and for each one what to **take** and what to **leave**.
The rule across all of them: evoke the tradition, never borrow a mark. No Masters logo, no Augusta map
logo, no Rancho Santa Fe crest, no green jacket as branding.

## Captured sites (screenshots, for study)

Captured on 2026-10-19 at 1440×900 (desktop, plus two scrolled views) and 390×844 (mobile). RSF used
`scripts/capture-references.mjs`, headless. masters.com rejects headless Chromium with
`ERR_HTTP2_PROTOCOL_ERROR`, so those pages were captured with a headed, logged-out copy of the same
script. Raw captures stayed in the session scratchpad. The crops on the board are in
`public/mood-board/shot-*.jpg`, and every crop leaves out the site's logo or crest.

### 1. Rancho Santa Fe Golf Club: home, club history, membership, dress code
https://www.rsfgolfclub.com/ · `/guest-information/club-history` · `/guest-information/rsfgc-membership` ·
`/guest-information/rsfgc-dress-code` (`/golf` and `/dining` are behind the member login).

Measured: body `freight-neo-pro` 17px; headings `starling` (a Caslon-like book serif) in tracked caps, 32–48px;
deep teal-navy `#144051` / `#123846` for footer and active nav; links `#3C6F99`; panels `#EBEBEB`.

- **Take:** the restraint. One big photograph, then a quiet serif heading in widely tracked capitals, a
  hairline rule, and a short, unhurried paragraph. The sepia 1930s gallery photo used as the *hero* (history
  carries the luxury, not gloss). Southern California light: warm, hazy, low-contrast greens with
  eucalyptus and sycamore. The sense that the page doesn't need to sell you anything. The teal-navy as a
  second, cooler "dusk" accent beside green, which becomes our Covenant Slate.
- **Leave:** the palm-tree crest and wordmark (theirs, and a mark). The dated CMS chrome: grey sidebar tabs,
  centered 15px body copy, the translucent white header bar over the photo. The small text and low-contrast
  link blue. The login wall feel; our app is personal, never gated.

### 2. masters.com: home, the course, hole 12 (Golden Bell), leaderboard
https://www.masters.com/en_US/index.html · `/en_US/course/index.html` · `/en_US/course/hole12.html` ·
`/en_US/scores/index.html`

Measured: headings `Tiempos Headline`, UI `Benton Sans` 12–18px; green `#006747`; scoreboard red
`#BA0C2F`; leaderboard ground `#F7F4F0`; board numerals set in `Oswald` 28px.

- **Take:** the hand-operated leaderboard translated to the screen: white tiles, a black condensed
  gothic for names, **red numerals for under par** and dark for over, a rule every nine holes. The course
  index as a grid of hole cards, each with photo, *Hole No. 4*, a name, and par/yards set in plain numerals
  (our course picker). On the hole page: a large serif pull-quote over the strategy notes, which reads like a
  caddie's voice (our hole notes). Holes with names: a tradition we can give the golfer for their own course.
- **Leave:** the Masters wordmark and the Augusta map-and-flag logo (never reproduced, not even cropped in).
  The exact green `#006747` and red `#BA0C2F`; ours are shifted (Locker Green `#143A2C`, Under-Par Red
  `#A3272A`). The sponsor bars, cookie banner, ticker of player headshots, and pill filters. Oswald (it's
  their board face; we use Barlow Condensed).

## Found references (web search; collected images credited in `docs/credits.md`)

### 3. The hand-operated scoreboard at Augusta (photo, Ryan Schreiber, CC BY 2.0)
- **Take:** a physical object made of tiles, slots, and painted numerals that people *read from 100 yards
  away*. Big, flat, legible numbers. The white board on a green base. The "THRU 16" side panel as a model
  for round status.
- **Leave:** the board's exact silhouette and "LEADERS" header. It is theirs; ours is a generic tile system.

### 4. Benvenue Country Club scorecard, Rocky Mount, N.C. (public domain, via DPLA)
- **Take:** the grid itself: Hole / yardage by tee / Handicap / Par rows, Out and In subtotals, pencil
  marks in the boxes, the "Attest" line, the local rules on the cover. A photo of the 13th hole on the cover
  is the original "course picker image." The cream stock and slightly-off registration of letterpress.
- **Leave:** the club's script logotype, the foxing and stains (texture should be subtle, not "aged filter").

### 5. Charles Lees, *The Golfers*, 1847 (public domain, National Galleries of Scotland)
- **Take:** ceremony and gallery: golf as an occasion people gather for. Red coats against grey-green links
  is a palette precedent for a single red accent on muted green.
- **Leave:** the painterly brown varnish, and Victorian costume as decoration.

### 6. Pinehurst No. 2, fourth hole, early postcard (State Archives of North Carolina, no known restrictions)
- **Take:** the hand-tinted color: flattened greens, a pale chalky sky, sand-colored rough. The
  caption set in small capitals along the bottom edge ("THE FOURTH HOLE, NO. 2 COURSE"), which is how our
  hole cards should be labelled.
- **Leave:** the postcard border and the saturated tint. Nostalgia should stay a seasoning.

### 7. Shinnecock Hills Golf Club clubhouse, 1901 (public domain)
- **Take:** the clubhouse on the ridge as a destination: the building is small and the land is huge. Black
  and white, wide aspect, lots of sky. This suits empty states and the "round complete" moment.
- **Leave:** the windmill and specific building. It's a landmark, not our scenery.

### 8. The R&A clubhouse and the Swilcan Bridge, St Andrews (Optograph, CC BY-SA 3.0)
- **Take:** stone, symmetry, and permanence: the 18th as a stage. The bridge as a quiet motif of
  "crossing" from the round into the clubhouse (finish round → summary).
- **Leave:** the R&A's crest and anything that reads as "Open Championship" branding.

### 9. Tad Dorgan, *Indoor Sports: Complimenting the Handicap Committee… in the Locker Room* (c. 1920s, public domain)
- **Take:** the locker room as a place where the handicap is *talked about*, a social number with
  opinions attached. Hand lettering in speech balloons gives us permission for one human, handwritten touch
  (the hole notes in an italic serif). And the wit: one good joke in the right place, not puns everywhere.
- **Leave:** the caricature style.

### 10. Lilian J. Rice house, Rancho Santa Fe, built 1925 (Jerrye & Roy Klotz MD, CC BY-SA 4.0)
- **Take:** Rice designed the village of Rancho Santa Fe. White lime-wash walls, terracotta roof, deep green
  shutters, clipped box hedges, brick paths. This is where the warm paper ground and the green come from,
  with no crest involved. Shade and softness over gloss.
- **Leave:** the Spanish-revival ornament as literal UI decoration (no tile borders, no arches on buttons).

### 11. Augusta National Golf Club membership certificate, 1945, signed by Bobby Jones (CC0)
- **Take:** engraved security printing. Guilloche borders, a numbered certificate ("No 178"), small caps,
  fine rules, and a signature as the seal. Inspiration for a numbered "round certificate" on the summary
  and for fine-line ornament.
- **Leave:** the club name and the allegorical vignette. We study the engraving language, never the
  document's identity.

### 12. Heritage golf goods: Seamus Golf (https://www.seamusgolf.com/) and Holderness & Bourne (https://holdernessandbourne.com/)
- **Take:** wool, tartan, herringbone, and leather labels from Seamus (Portland, OR, est. 2010, hand-sewn
  headcovers). From H&B, a deliberate reaction against loud performance-golf styling: solid colors, a
  stripe, restraint. Product photography on plain cloth. This is the tone of the "locker" (bag) page.
- **Leave:** their logos and product imagery (not collected). Tartan as wallpaper.

### 13. The Champions Locker Room at Augusta (reporting: Golf Channel / PGA Tour, March 2026)
https://www.pgatour.com/article/news/latest/2026/03/30/masters-offers-a-locker-room-unlike-any-other-new-player-services-building
- **Take:** 27 shared lockers, each carrying a small engraved nameplate per champion, in a small upstairs
  room. The nameplate is the honor. Our version is a brass nameplate for the golfer's locker and bag, and
  a plate for each personal best.
- **Leave:** any photo of the room (not collected; no free license), and the Masters emblem on the handles.

### 14. Yardage books (Strokesaver, est. Paisley; hand-drawn yardage-book makers)
https://www.strokesaver.co.uk/products/strokesavers · https://thebrassie.com/golf-yardage-book-template/
- **Take:** a hole drawn in plan view with flat fills (fairway, rough, sand, water), dotted distance arcs
  from the green, numbers written right on the drawing, and the caddie's pencil notes in the margin. This is
  the hole screen's map and the "yardage book" texture of the whole app.
- **Leave:** satellite imagery and 3D flyovers (noisy, and needs an API). Their specific drawings.
