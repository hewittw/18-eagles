import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ClubButtons from "./ClubButtons";
import {
  HandicapHero,
  LeaderboardTiles,
  LinenSwatch,
  Monogram,
  Nameplates,
  PaletteBoard,
  PaperSwatch,
  RoundCertificate,
  ScorecardSpecimen,
  TypeDisplay,
  TypeNumerals,
  TypeText,
  YardageDrawing,
} from "./artifacts";

import augustaBoard from "../../../public/mood-board/augusta-leaderboard.jpg";
import benvenue from "../../../public/mood-board/benvenue-scorecard.jpg";
import benvenueCover from "../../../public/mood-board/benvenue-scorecard-p1.jpg";
import lees from "../../../public/mood-board/lees-the-golfers.jpg";
import pinehurst from "../../../public/mood-board/pinehurst-4th.jpg";
import shinnecock from "../../../public/mood-board/shinnecock-1901.jpg";
import raClubhouse from "../../../public/mood-board/ra-clubhouse.jpg";
import dorgan from "../../../public/mood-board/dorgan-locker-room.jpg";
import riceHouse from "../../../public/mood-board/rice-house-rsf.jpg";
import certificate from "../../../public/mood-board/jones-1945.jpg";
import shotRsfHome from "../../../public/mood-board/shot-rsf-home.jpg";
import shotRsfMember from "../../../public/mood-board/shot-rsf-membership.jpg";
import shotMastersBoard from "../../../public/mood-board/shot-masters-leaderboard.jpg";
import shotMastersCourse from "../../../public/mood-board/shot-masters-course.jpg";
import shotMastersHole from "../../../public/mood-board/shot-masters-hole12.jpg";

/* ───────── Board furniture ───────── */

type Kind = "made" | "collected" | "study";
type Span = 3 | 4 | 5 | 6 | 7 | 8 | 12;
const SPAN: Record<Span, string> = {
  3: "md:col-span-3 xl:col-span-3",
  4: "md:col-span-3 xl:col-span-4",
  5: "md:col-span-3 xl:col-span-5",
  6: "md:col-span-3 xl:col-span-6",
  7: "md:col-span-6 xl:col-span-7",
  8: "md:col-span-6 xl:col-span-8",
  12: "md:col-span-6 xl:col-span-12",
};
const KIND_LABEL: Record<Kind, string> = {
  made: "✦ Made in code",
  collected: "Collected",
  study: "Screenshot, for study",
};

function Artifact({
  no, title, kind, span, why, take, credit, children,
}: {
  no: number; title: string; kind: Kind; span: Span; why: ReactNode; take: ReactNode;
  credit?: { by: string; license: string; href: string }; children: ReactNode;
}) {
  const n = String(no).padStart(2, "0");
  return (
    <figure className={`m-0 min-w-0 self-start ${SPAN[span]}`}>
      <div>{children}</div>
      <figcaption className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 border-t border-(--mb-ink) pt-3">
        <span className="f-cond text-[1.6rem] font-semibold leading-none text-(--mb-pencil) num" aria-hidden="true">{n}</span>
        <div>
          <p className={`caps text-[0.72rem] ${kind === "made" ? "text-(--mb-old-brass)" : "text-(--mb-pencil)"}`}>
            <span className="sr-only">Artifact {n}, </span>
            {KIND_LABEL[kind]}
          </p>
          <h3 className="f-display mt-1 text-[1.45rem] leading-tight">{title}</h3>
          <p className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed">
            <span className="caps mr-2 text-[0.72rem] text-(--mb-pencil)">Why</span>
            {why}
          </p>
          <p className="mt-1.5 max-w-[62ch] text-[0.95rem] leading-relaxed">
            <span className="caps mr-2 text-[0.72rem] text-(--mb-fairway)">Take</span>
            {take}
          </p>
          {credit && (
            <p className="mt-2 text-[0.8rem] text-(--mb-pencil)">
              {credit.by} · {credit.license} ·{" "}
              <a className="link" href={credit.href}>
                Wikimedia Commons<span className="sr-only">: source for {title}</span>
              </a>
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function Mounted({ src, alt, sizes, className = "" }: { src: StaticImageData; alt: string; sizes: string; className?: string }) {
  // A photograph mounted like a print: paper mat, ink hairline.
  return (
    <div className={`border border-(--mb-ink) bg-(--mb-tile) p-2 sm:p-3 ${className}`}>
      <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="block h-auto w-full" />
    </div>
  );
}

function Screenshot({ src, alt, site }: { src: StaticImageData; alt: string; site: string }) {
  return (
    <div className="border border-(--mb-ink) bg-(--mb-tile)">
      <div className="flex items-center gap-2 border-b border-(--mb-ink) bg-(--mb-linen) px-3 py-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full border border-(--mb-pencil)" />
        <span className="h-2 w-2 rounded-full border border-(--mb-pencil)" />
        <span className="ml-2 f-cond text-[0.85rem] text-(--mb-pencil)">{site}</span>
      </div>
      <Image src={src} alt={alt} sizes="(min-width: 1280px) 60vw, 100vw" placeholder="blur" className="block h-auto w-full" />
    </div>
  );
}

function Section({ id, numeral, title, lede, children }: { id: string; numeral: string; title: string; lede: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mx-auto max-w-[1760px] px-5 pt-20 sm:px-8 lg:px-14 lg:pt-28">
      <div className="grid gap-4 border-b border-(--mb-ink) pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-end">
        <div className="flex items-baseline gap-5">
          <span className="f-display text-[clamp(3rem,6vw,5rem)] leading-none text-(--mb-old-brass)" aria-hidden="true">{numeral}</span>
          <h2 id={id} className="f-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.02]">{title}</h2>
        </div>
        <p className="f-text max-w-[58ch] text-[1.08rem] leading-relaxed text-(--mb-pencil) lg:justify-self-end">{lede}</p>
      </div>
      <div className="rule-double mt-1" aria-hidden="true" />
      <div className="mt-10 grid grid-flow-dense grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-6 xl:grid-cols-12 xl:gap-x-10">{children}</div>
    </section>
  );
}

const WC = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

/* ───────── The page ───────── */

export default function MoodBoardPage() {
  return (
    <>
      <header className="tex-locker on-dark relative overflow-hidden">
        <div className="mx-auto max-w-[1760px] px-5 pb-16 pt-6 sm:px-8 lg:px-14 lg:pb-24">
          <nav aria-label="Process" className="flex flex-wrap items-center justify-between gap-4 border-b border-(--mb-brass)/50 pb-4">
            <Link href="/" className="caps inline-flex min-h-tap items-center text-[0.8rem] text-(--mb-linen) underline-offset-4 hover:underline">
              18 Eagles · Process hub
            </Link>
            <p className="caps text-[0.8rem] text-(--mb-brass)">Mood board · Clubhouse direction</p>
          </nav>

          <div className="mt-12 grid items-center gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="caps text-[0.85rem] text-(--mb-brass)">A remix of the Rancho Santa Fe Golf Club feel and the old Masters ceremony</p>
              <h1 className="f-display mt-4 text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.9] tracking-[-0.015em] text-(--mb-paper)">
                The Members&apos; Ledger
              </h1>
              <p className="f-text mt-6 max-w-[56ch] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-relaxed text-(--mb-linen)">
                A golf journal that feels like walking from the 18th green into a good clubhouse: card stock and pencil,
                a white board of hand-hung numbers, brass on a green locker door, and the low California sun on the
                fairway. It&apos;s modern in how it works and old in what it honours. Nothing on it is borrowed from a club.
              </p>
            </div>
            <div className="justify-self-start lg:justify-self-end">
              <Monogram size={240} decorative />
            </div>
          </div>

          <h2 className="sr-only">Mood words</h2>
          <ul className="mt-14 grid gap-px border-y border-(--mb-brass)/50 md:grid-cols-3">
            {[
              ["Ceremonial", "The score is posted, not pushed. Hand-hung tiles, attested cards, numbers given room. Every finished round is an occasion."],
              ["Tailored", "Locker-room craft: brass, linen, a good stitch. Fewer things, each made well. Quiet confidence over decoration."],
              ["Sunlit", "Southern California light on paper and grass. Warm off-whites, soft greens, long shadows. Never dark-mode neon, never gloss."],
            ].map(([w, d], i) => (
              <li key={w} className={`py-6 md:px-6 ${i ? "border-t border-(--mb-brass)/50 md:border-l md:border-t-0" : "md:pl-0"}`}>
                <p className="f-cond text-[0.85rem] font-semibold tracking-[0.2em] text-(--mb-brass)" aria-hidden="true">
                  {["I", "II", "III"][i]}
                </p>
                <p className="f-display mt-1 text-[clamp(2.2rem,3.6vw,3.2rem)] leading-none text-(--mb-paper)">{w}</p>
                <p className="mt-3 max-w-[40ch] text-[1rem] leading-relaxed text-(--mb-linen)">{d}</p>
              </li>
            ))}
          </ul>

          <p className="mt-6 caps text-[0.78rem] text-(--mb-linen)">
            29 artifacts · 15 collected · 14 made in code, marked ✦ · credits in docs/credits.md
          </p>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="pb-28 outline-none">
        <Section
          id="s-board"
          numeral="I"
          title="The Board"
          lede="The score is the ceremony. A hand-operated board and a pencilled card are the two oldest interfaces in golf, and both are made of big, plain numbers in a grid."
        >
          <Artifact
            no={1}
            span={7}
            kind="collected"
            title="The hand-operated leaderboard"
            why="People read this board from a hundred yards away: white tiles, painted numerals, and red only when it matters."
            take="Scores as tiles. A strict grid with a rule after the ninth. Red is reserved for under par and used nowhere else."
            credit={{ by: "Ryan Schreiber, 2015", license: "CC BY 2.0", href: WC("Augusta_National_Leaderboard_(17071936729).jpg") }}
          >
            <Mounted
              src={augustaBoard}
              sizes="(min-width: 1280px) 55vw, 100vw"
              alt="The tall white hand-operated leaderboard at Augusta National against a deep blue sky, rows of hole numbers and pars above empty white name slots, on a green base."
            />
          </Artifact>
          <Artifact
            no={2}
            span={5}
            kind="study"
            title="masters.com, the digital board"
            why="The site redraws the physical board in HTML with condensed numerals and running totals to par."
            take="Running score to par per hole is the most readable round summary there is. Leave their board shape and face; keep the logic."
          >
            <Screenshot
              src={shotMastersBoard}
              site="masters.com · leaderboard"
              alt="Screenshot of the masters.com leaderboard drawn as the white hole-by-hole board: player names in black condensed capitals and red under-par numbers in white tiles."
            />
          </Artifact>

          <Artifact
            no={3}
            span={12}
            kind="made"
            title="Hand-hung tiles: your last rounds"
            why="An original tile system in the spirit of the board: tabular condensed numerals in tile white on a Locker Green field, hung one by one."
            take="The round-history and breakdown views can read like a board. Unlike the real one, we keep the minus sign, so color is never the only signal."
          >
            <LeaderboardTiles />
          </Artifact>

          <Artifact
            no={4}
            span={6}
            kind="collected"
            title="Benvenue Country Club card, inside"
            why="The card is the original data model: tees, handicap, par, Out and In, four players' pencilled scores."
            take="Rows for yardage, hole handicap, and par, then score. Subtotals on a darker rule. Leave the club's script logotype."
            credit={{ by: "Braswell Memorial Library via DPLA", license: "Public domain", href: WC("Benvenue_Country_Club,_Rocky_Mount,_N.C._Golf_Score_Card_-_DPLA_-_2ee7d8c8e1eb03c2ce2308b51db72e3f_(page_2).jpg") }}
          >
            <Mounted
              src={benvenue}
              sizes="(min-width: 1280px) 45vw, (min-width: 768px) 50vw, 100vw"
              alt="A worn cream scorecard grid for Benvenue Country Club: yardages for red, white and blue courses, handicap and par rows, and four rows of faded pencil scores."
            />
          </Artifact>
          <Artifact
            no={5}
            span={6}
            kind="collected"
            title="The same card, cover and local rules"
            why="A photograph of the 13th hole on the cover is the course picker before there was a screen."
            take="Each course gets one photograph and its local rules or notes on its card. Keep it as plain as this."
            credit={{ by: "Braswell Memorial Library via DPLA", license: "Public domain", href: WC("Benvenue_Country_Club,_Rocky_Mount,_N.C._Golf_Score_Card_-_DPLA_-_2ee7d8c8e1eb03c2ce2308b51db72e3f_(page_1).jpg") }}
          >
            <Mounted
              src={benvenueCover}
              sizes="(min-width: 1280px) 45vw, (min-width: 768px) 50vw, 100vw"
              alt="The outside of the folded Benvenue scorecard: typed local rules on the left and a small black-and-white photograph of the clubhouse behind the 13th hole on the right."
            />
          </Artifact>

          <Artifact
            no={6}
            span={12}
            kind="made"
            title="Scorecard specimen with traditional marks"
            why="The Old Course front nine from the app's own course data, marked the way a card is marked: a circle for birdie, two circles for eagle, a square for bogey, two squares for double."
            take="Shape carries the meaning and color only repeats it. Pencil scores in Caslon italic, the grid in Barlow Condensed, Out on Locker Green."
          >
            <ScorecardSpecimen />
          </Artifact>
        </Section>

        <Section
          id="s-book"
          numeral="II"
          title="The Book"
          lede="A yardage book and a caddie's voice. Each hole is a drawing, a few numbers, and a sentence the golfer wrote for next time."
        >
          <Artifact
            no={7}
            span={5}
            kind="made"
            title="Yardage-book drawing, a par 4"
            why="Plan view with flat fills, dotted arcs to the green, carry numbers on the drawing, and a pencil note in the margin. Drawn in SVG, so it costs nothing to ship."
            take="The hole screen's map: stylised, not satellite. The golfer's note sits on the drawing in italic slate."
          >
            <div className="border border-(--mb-ink) bg-(--mb-tile) p-2 sm:p-3">
              <YardageDrawing />
            </div>
          </Artifact>
          <Artifact
            no={8}
            span={7}
            kind="study"
            title="masters.com, the course as hole cards"
            why="Every hole is a card: one photograph, Hole No., a name, then par and yards in plain numerals."
            take="The course picker and course detail: photo first, numbers small and exact. We drop the white SaaS cards and set ours on paper with a hairline."
          >
            <Screenshot
              src={shotMastersCourse}
              site="masters.com · the course"
              alt="Screenshot of masters.com course page: six hole cards in a grid, each with a fairway photograph, hole number, a flower name such as Tea Olive or Pink Dogwood, and par and yards."
            />
          </Artifact>
          <Artifact
            no={9}
            span={7}
            kind="study"
            title="masters.com, hole 12: the quote over the notes"
            why="A big serif pull-quote, then strategy in plain prose. It reads like a caddie talking."
            take="On round summaries, lead with the golfer's own best note in large italic, then the numbers."
          >
            <Screenshot
              src={shotMastersHole}
              site="masters.com · hole No. 12"
              alt="Screenshot of masters.com hole 12 page: a large green serif quote reading 'The 12th hole eventually makes you look like a fool', with strategy text below and a sidebar about the flower the hole is named for."
            />
          </Artifact>
          <Artifact
            no={10}
            span={5}
            kind="collected"
            title="Pinehurst No. 2, the fourth hole, a hand-tinted postcard"
            why="Flattened color, a chalky sky, and the caption set along the bottom in small capitals."
            take="Label hole and course images with a small-caps caption bar. Use the tinted, slightly faded greens for illustration fills."
            credit={{ by: "State Archives of North Carolina", license: "No known restrictions", href: WC("4th,_Pinehurst_No_2_001_(22130096452).jpg") }}
          >
            <Mounted
              src={pinehurst}
              sizes="(min-width: 1280px) 38vw, (min-width: 768px) 50vw, 100vw"
              alt="Hand-tinted early postcard of the fourth hole on Pinehurst No. 2: a broad green fairway between longleaf pines under a pale sky, with a few golfers, captioned in small capitals."
            />
          </Artifact>
        </Section>

        <Section
          id="s-clubhouse"
          numeral="III"
          title="The Clubhouse"
          lede="Place and light. Rancho Santa Fe's warm Spanish-colonial calm, the permanence of St Andrews, and the gallery around a green. Lots of land, small buildings, nothing shouting."
        >
          <Artifact
            no={11}
            span={8}
            kind="study"
            title="Rancho Santa Fe Golf Club, home"
            why="A sepia 1930s gallery photograph as the hero, then a quiet tracked-caps serif heading and a hairline. Heritage carries the luxury."
            take="Open on one great image and very little text. Heading in tracked capitals, a hairline rule, then a short line. Leave the crest, the CMS chrome, and the small text."
          >
            <Screenshot
              src={shotRsfHome}
              site="rsfgolfclub.com"
              alt="Screenshot of the Rancho Santa Fe Golf Club home page: a wide sepia photograph of a 1930s crowd ringing a green with a vintage car, above the heading 'A remarkable place to call home' in blue tracked capitals."
            />
          </Artifact>
          <Artifact
            no={12}
            span={4}
            kind="collected"
            title="Lilian Rice's own house, Rancho Santa Fe, 1925"
            why="Rice designed the village. Lime-washed white, a terracotta roof, green shutters, clipped box, and brick."
            take="This is where our paper, Locker Green, and the warmth come from, with no crest needed. Shade and softness over gloss."
            credit={{ by: "Jerrye & Roy Klotz, M.D.", license: "CC BY-SA 4.0", href: WC("LILLAN_JENETTE_RICE_HOUSE,_RANCHO_SANTA_FE_SAN_DIEGO_COUNTY_CA.jpg") }}
          >
            <Mounted
              src={riceHouse}
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
              alt="A low white Spanish-colonial house with a red tile roof and green shutters behind a formal garden of clipped box hedges, a brick path and a small fountain, in bright California sun."
            />
          </Artifact>

          <Artifact
            no={13}
            span={6}
            kind="study"
            title="Rancho Santa Fe, membership"
            why="Hazy eucalyptus light over a stone bridge and creek. The palette is soft greens and sand, not saturated turf."
            take="Course photography should feel like late afternoon. Use the teal-navy as a cool second accent beside green (our Covenant Slate)."
          >
            <Screenshot
              src={shotRsfMember}
              site="rsfgolfclub.com · membership"
              alt="Screenshot of the Rancho Santa Fe membership page: a panoramic photo of a stone bridge over a creek on a soft green course, above a side menu with a teal-navy selected tab and the heading Membership."
            />
          </Artifact>
          <Artifact
            no={14}
            span={6}
            kind="collected"
            title="Shinnecock Hills clubhouse, 1901"
            why="The clubhouse on the ridge: a small building in a huge landscape, mostly sky."
            take="Empty and finished states get a wide, quiet photograph with one line of text, never a bare empty screen."
            credit={{ by: "Unknown author", license: "Public domain", href: WC("Shinnecock_Hills_Golf_Club_-_Clubhouse_(1901).jpg") }}
          >
            <Mounted
              src={shinnecock}
              sizes="(min-width: 1280px) 45vw, (min-width: 768px) 50vw, 100vw"
              alt="Black-and-white 1901 photograph of the shingled Shinnecock Hills clubhouse on a distant ridge above open, rolling links land, with a windmill and a few small figures."
            />
          </Artifact>

          <Artifact
            no={15}
            span={5}
            kind="collected"
            title="The R&A clubhouse and the Swilcan Bridge"
            why="Stone, symmetry, permanence. The bridge is the crossing from the round back to the clubhouse."
            take="Finishing a round is a crossing: a deliberate, calm transition from the hole screen to the summary card."
            credit={{ by: "Optograph", license: "CC BY-SA 3.0", href: WC("R%26A_Clubhouse,_Old_Course,_Swilcan_Burn_bridge_(cropped).jpg") }}
          >
            <Mounted
              src={raClubhouse}
              sizes="(min-width: 1280px) 38vw, (min-width: 768px) 50vw, 100vw"
              alt="The grey stone Royal and Ancient clubhouse at St Andrews behind the first and eighteenth fairways, with the small stone Swilcan Bridge in the foreground."
            />
          </Artifact>
          <Artifact
            no={16}
            span={7}
            kind="collected"
            title="Charles Lees, The Golfers, 1847"
            why="Golf as an occasion people gather for. Red coats on grey-green links: a single red accent on muted green."
            take="One red, used sparingly and with meaning. The finished round deserves a little ceremony."
            credit={{ by: "Charles Lees, National Galleries of Scotland", license: "Public domain", href: WC("%27The_Golfers%27_by_Charles_Lees,_1847,_oil_on_canvas,_National_Galleries_of_Scotland,_Edinburgh.jpg") }}
          >
            <Mounted
              src={lees}
              sizes="(min-width: 1280px) 55vw, 100vw"
              alt="Oil painting of a crowded golf match at St Andrews in 1847: gentlemen in red coats and top hats gather around players putting on the links under a wide sky."
            />
          </Artifact>
        </Section>

        <Section
          id="s-locker"
          numeral="IV"
          title="The Locker Room"
          lede="The things you keep. Brass, linen, engraved paper, and the handicap talked over on the bench. This is where the app gets its craft and its one good joke."
        >
          <Artifact
            no={17}
            span={7}
            kind="collected"
            title="Tad Dorgan, “Complimenting the Handicap Committee… in the Locker Room”"
            why="The handicap has always been a social number with opinions attached, argued about in the locker room."
            take="Show how the index is made (which rounds count) so the golfer can argue with it. Allow one hand-written touch and one good line of wit, not puns everywhere."
            credit={{ by: "Thomas “Tad” Dorgan, before 1930", license: "Public domain", href: WC("Indoor_Sports_-_Complimenting_the_Handicap_Committee_As_You_Give_the_List_the_O.O._in_the_Locker_Room.jpg") }}
          >
            <Mounted
              src={dorgan}
              sizes="(min-width: 1280px) 55vw, 100vw"
              alt="Pen-and-ink newspaper cartoon of golfers in plus-fours in a locker room, grumbling in hand-lettered speech balloons about the handicap list pinned to the wall."
            />
          </Artifact>
          <Artifact
            no={18}
            span={5}
            kind="made"
            title="Brass nameplates on a locker door"
            why="In a champions' locker room the honour is a small engraved plate. Brushed brass, two screws, caps in Caslon."
            take="The Locker (bag) page wears a nameplate, and every personal best earns a plate. Brass only ever sits on Locker Green."
          >
            <Nameplates />
          </Artifact>

          <Artifact
            no={19}
            span={4}
            kind="made"
            title="An original monogram"
            why="A Caslon E with an 18 above, in a rope ring with the name set around it, and a single small red pennant. No crossed clubs, no ball, and no borrowed crest."
            take="App mark, favicon, and the seal on a finished round. Use it small and use it rarely."
          >
            <div className="flex aspect-square items-center justify-center tex-linen border border-(--mb-hair) p-6">
              <Monogram size={280} />
            </div>
          </Artifact>
          <Artifact
            no={20}
            span={8}
            kind="collected"
            title="A 1945 club membership certificate, engraved"
            why="Security engraving: guilloche borders, a numbered certificate, small caps, fine rules, and a signature as the seal."
            take="The engraving language (fine line, numbering, attestation) for finished rounds. Never the document's club name or its vignette."
            credit={{ by: "Julie Ceccaldi (scan), Sammlung Commodore", license: "CC0", href: WC("Augusta_National_Golf_Club_signed_by_Bobby_Jones_1945.jpg") }}
          >
            <Mounted
              src={certificate}
              sizes="(min-width: 1280px) 60vw, 100vw"
              alt="A grey engraved 1945 membership certificate with a guilloche border, a classical portrait vignette at top left, certificate number 178, typeset terms and two ink signatures."
            />
          </Artifact>

          <Artifact
            no={21}
            span={6}
            kind="made"
            title="The round certificate, engraved in code"
            why="A guilloche border generated from seven phase-shifted sine waves, a round number, and an attest line."
            take="The round summary as a keepsake: numbered, attested, and shareable as an image later."
          >
            <RoundCertificate />
          </Artifact>
          <Artifact
            no={22}
            span={3}
            kind="made"
            title="Scorecard paper"
            why="Warm card stock with fibre, made from two layers of SVG turbulence. It isn't a photograph, so it's tiny and sharp at any size."
            take="The ground of every page. Whisper strength: text contrast is measured on the flat color and holds."
          >
            <PaperSwatch />
          </Artifact>
          <Artifact
            no={23}
            span={3}
            kind="made"
            title="Linen weave"
            why="A cross-weave with slub, drawn with CSS gradients, plus a woven label on Locker Green."
            take="Raised panels and the Locker page. Never behind long body text."
          >
            <LinenSwatch />
          </Artifact>
        </Section>

        <Section
          id="s-system"
          numeral="V"
          title="The Grammar"
          lede="Eleven colors, three families, and one rule: every text pair is measured. These are drafts the design system will build from."
        >
          <Artifact
            no={24}
            span={12}
            kind="made"
            title="Palette with measured contrast"
            why="Every swatch is a token, and every text and background pair the app intends to use is measured in code by palette.ts."
            take="Body text stays at 4.5:1 or better, and nothing ships below. Brass never sits on paper as text (Old Brass does), and focus rings sit offset on the surface."
          >
            <PaletteBoard />
          </Artifact>
          <Artifact
            no={25}
            span={4}
            kind="made"
            title="Display: Libre Caslon Display"
            why="Club minutes and engraved trophies. Elegant at large sizes only."
            take="Headings, course names, the handicap. 28px and up, one weight."
          >
            <TypeDisplay />
          </Artifact>
          <Artifact
            no={26}
            span={4}
            kind="made"
            title="Text: Libre Caslon Text"
            why="A book serif with a real italic that can play the pencil."
            take="Italic is the golfer's voice in notes. Roman is for blurbs and summaries."
          >
            <TypeText />
          </Artifact>
          <Artifact
            no={27}
            span={4}
            kind="made"
            title="Numerals and UI: Barlow Condensed and Barlow"
            why="Tabular lining figures that fit nine holes across a phone, and a plain grotesque for controls."
            take="Every number in a tile or table uses Condensed. Labels use small caps, tracked 0.16em."
          >
            <TypeNumerals />
          </Artifact>
        </Section>

        <Section
          id="s-sketches"
          numeral="VI"
          title="Sketches for 18 Eagles"
          lede="The two screens the user asked for first: the handicap in big numbers, and a club for every shot."
        >
          <Artifact
            no={28}
            span={6}
            kind="made"
            title="Home: the handicap in big numbers"
            why="The index set like an engraved figure on Locker Green, its trend in words, and the 20 differentials with the 8 that count picked out in brass."
            take="Lead with one number and its reason. Then the way back in: last time at this course, and one button to beat it."
          >
            <HandicapHero />
          </Artifact>
          <Artifact
            no={29}
            span={6}
            kind="made"
            title="Hole screen: a club for every shot (try it)"
            why="A bag of tiles sized for a thumb outdoors (56px), with carry yardage on each. Tap a club to log the shot, and Undo removes it. Changes are announced politely."
            take="Real buttons with visible rest, hover, pressed, last-used, focus, and disabled states. The stroke count and its score name update together."
          >
            <ClubButtons />
          </Artifact>
        </Section>

        <section aria-labelledby="s-ideas" className="mx-auto max-w-[1760px] px-5 pt-24 sm:px-8 lg:px-14">
          <div className="tex-locker on-dark p-6 sm:p-10 lg:p-14">
            <h2 id="s-ideas" className="f-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-none text-(--mb-paper)">
              Six ideas to carry into the app
            </h2>
            <ol className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["The handicap, engraved", "Home leads with the index in Caslon Display at poster size, its trend in plain words, and the counting rounds shown in brass."],
                ["Scores as hung tiles", "History and breakdowns read like the board: running score to par in tiles, red with a minus sign for under par, and a rule after nine."],
                ["The card keeps its marks", "Circles and squares on every scorecard and chart point, so shape tells birdie from bogey without color."],
                ["A yardage book for every hole", "The hole screen opens on a drawn plan with arcs and the golfer's own italic note from last time."],
                ["The bag as a button board", "Club tiles with carry yardages log each shot with one tap, in thumb-sized targets, with undo instead of confirm."],
                ["Every round, attested", "Finishing crosses the bridge to a numbered, engraved round certificate and a brass plate for any personal best."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[auto_1fr] gap-4 border-t border-(--mb-brass)/50 pt-4">
                  <span className="f-cond text-[2.2rem] font-semibold leading-none text-(--mb-brass)" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="f-display text-[1.5rem] leading-tight text-(--mb-paper)">{t}</h3>
                    <p className="mt-2 text-[1rem] leading-relaxed text-(--mb-linen)">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1760px] px-5 pb-12 sm:px-8 lg:px-14">
        <div className="rule-double" aria-hidden="true" />
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4 text-[0.9rem] text-(--mb-pencil)">
          <p>
            Sources, authors and licenses for every collected image are in <span className="f-cond font-semibold text-(--mb-ink)">docs/credits.md</span>.
            Reference notes are in <span className="f-cond font-semibold text-(--mb-ink)">docs/references.md</span>.
          </p>
          <Link href="/" className="link inline-flex min-h-tap items-center">Back to the process hub</Link>
        </div>
      </footer>
    </>
  );
}
