import { useId } from "react";
import type { Tier, TrophyArtKind } from "@/lib/trophies";
import { cx } from "../ui/cx";

export type TrophyArtProps = {
  art: TrophyArtKind;
  tier: Tier;
  /** Not won yet: an outline silhouette in the current text color. */
  locked?: boolean;
  /** Draw the walnut plinth under standing pieces. */
  plinth?: boolean;
  className?: string;
};

// Metal and glass, each with a dark keyline so a piece reads on Masters green and on white alike.
const TINTS: Record<Tier, { dark: string; mid: string; light: string; line: string }> = {
  gold: { dark: "#A67C12", mid: "#E2BC3C", light: "#FFF3B5", line: "#5C450B" },
  silver: { dark: "#8D979E", mid: "#CDD3D7", light: "#FFFFFF", line: "#454D53" },
  bronze: { dark: "#8E5026", mid: "#C98450", light: "#F7D2AE", line: "#4F2C12" },
  crystal: { dark: "#8FC2D3", mid: "#D8EEF5", light: "#FFFFFF", line: "#2F6577" },
};

/** Hand-drawn trophies: cups, crystal, the Jacket, medals. Decorative only; the name is always in text beside it. */
export function TrophyArt({ art, tier, locked = false, plinth = true, className }: TrophyArtProps) {
  const uid = useId().replace(/:/g, "");
  const t = TINTS[tier];
  const g = `tg${uid}`;
  const sheen = `ts${uid}`;
  const glass = tier === "crystal";
  // Filled pieces share these props; a locked piece is the same shape in outline.
  const body = locked
    ? { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const }
    : { fill: `url(#${g})`, fillOpacity: glass ? 0.92 : 1, stroke: t.line, strokeWidth: 1.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const line = locked
    ? { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, opacity: 0.7 }
    : { fill: "none", stroke: glass ? t.line : t.dark, strokeWidth: 1.1, strokeLinecap: "round" as const, opacity: glass ? 0.55 : 0.9 };
  const hi = locked ? null : { fill: "none", stroke: "#fff", strokeWidth: 2, strokeLinecap: "round" as const, opacity: glass ? 0.95 : 0.7 };
  const standing = plinth && art !== "jacket" && art !== "medal" && art !== "tumbler" && art !== "bridge";

  return (
    <svg viewBox="0 0 64 64" className={cx("block overflow-visible", locked && "opacity-80", className)} aria-hidden="true" focusable="false">
      {!locked && (
        <defs>
          <linearGradient id={g} x1="0" x2="1" y1="0" y2="0.25">
            <stop offset="0" stopColor={t.dark} />
            <stop offset="0.32" stopColor={t.light} />
            <stop offset="0.6" stopColor={t.mid} />
            <stop offset="1" stopColor={t.dark} />
          </linearGradient>
          <linearGradient id={sheen} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#5A3E26" />
            <stop offset="1" stopColor="#2E1F12" />
          </linearGradient>
        </defs>
      )}

      {art === "cup" && (
        <>
          <path {...line} strokeWidth={locked ? 1.6 : 3.2} stroke={locked ? "currentColor" : t.line} opacity={1} d="M19 14 C9 14 9 29 21 30 M45 14 C55 14 55 29 43 30" />
          {!locked && <path fill="none" stroke={`url(#${g})`} strokeWidth={1.8} strokeLinecap="round" d="M19 14 C9 14 9 29 21 30 M45 14 C55 14 55 29 43 30" />}
          <path {...body} d="M17 9 H47 V20 C47 31 40 37 32 37 C24 37 17 31 17 20 Z" />
          <path {...body} d="M29 37 H35 V44 H29 Z" />
          <path {...body} d="M23 44 H41 L43 51 H21 Z" />
          <path {...line} d="M17 13 H47" />
          {hi && <path {...hi} d="M22 14 V21 C22 26 24 29 27 31" />}
        </>
      )}

      {art === "vase" && (
        <>
          <path {...body} d="M24 6 H40 L37.5 11 C44 17 46.5 27 43 37 C41 43 36.5 45 36.5 48 H27.5 C27.5 45 23 43 21 37 C17.5 27 20 17 26.5 11 Z" />
          <path {...body} d="M26 48 H38 L40.5 53 H23.5 Z" />
          <path {...line} d="M26.5 11 H37.5 M23 22 L41 22 M21.5 30 L42.5 30" />
          <path {...line} d="M27 22 L32 30 L37 22 M32 30 V43" />
          {hi && <path {...hi} d="M25.5 16 C22.5 22 22.5 30 25 37" />}
        </>
      )}

      {art === "goblet" && (
        <>
          <path {...body} d="M18 6 H46 C46 23 41 31 32 31 C23 31 18 23 18 6 Z" />
          <path {...body} d="M30.5 31 H33.5 V46 H30.5 Z" />
          <path {...body} d="M20 52 C20 48 26 46 32 46 C38 46 44 48 44 52 Z" />
          <path {...line} d="M19 12 H45 M22 12 L28 24 M42 12 L36 24 M32 12 V29" />
          {hi && <path {...hi} d="M22.5 9 C22.5 18 24.5 24 28 27" />}
        </>
      )}

      {art === "orb" && (
        <>
          <circle {...body} cx="32" cy="22" r="15" />
          {[[26, 16], [32, 14], [38, 16], [24, 22], [30, 20.5], [36, 21], [41, 23], [27, 27.5], [33, 27], [39, 28.5], [31, 32.5]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill={locked ? "currentColor" : t.line} opacity={locked ? 0.55 : 0.28} />
          ))}
          <path {...body} d="M22 41 C25 37 39 37 42 41 L40 52 H24 Z" />
          {hi && <path {...hi} d="M22.5 17 C24 12 28 9.5 32 9" />}
        </>
      )}

      {art === "bowl" && (
        <>
          <path {...body} d="M8 20 H56 C56 33 46 40 32 40 C18 40 8 33 8 20 Z" />
          <ellipse {...body} cx="32" cy="20" rx="24" ry="4.5" />
          <path {...body} d="M26 40 H38 L40.5 52 H23.5 Z" />
          <path {...line} d="M14 27 L20 35 M22 26 L26 38 M32 26 V39 M42 26 L38 38 M50 27 L44 35" />
          {hi && <path {...hi} d="M13 25 C15 30 19 33 24 35" />}
        </>
      )}

      {art === "tumbler" && (
        <>
          <path {...body} d="M9 16 H29 L27 54 H11 Z" />
          <path {...body} d="M35 12 H55 L53 50 H37 Z" />
          <path {...line} d="M10 38 H28 M14.5 38 L13 54 M19 38 V54 M23.5 38 L25 54 M36 34 H54 M40.5 34 L39 50 M45 34 V50 M49.5 34 L51 50" />
          {hi && <path {...hi} d="M13 20 L14.5 34 M39 16 L40.5 30" />}
        </>
      )}

      {art === "decanter" && (
        <>
          <circle {...body} cx="32" cy="6.5" r="4" />
          <path {...body} d="M28 10.5 H36 V16 C46 21 49.5 33 46 43 C44 49.5 39 52 32 52 C25 52 20 49.5 18 43 C14.5 33 18 21 28 16 Z" />
          <path {...line} d="M28 16 H36 M19 33 H45 M22 33 L32 46 L42 33 M32 18 V33" />
          {hi && <path {...hi} d="M23 25 C20 30 20 37 22 42" />}
        </>
      )}

      {art === "jacket" && (
        <>
          {/* The Jacket: deep green cloth, the tier's brass buttons and crest; a pale keyline so it reads on green */}
          <path
            d="M20 9 L27.5 7 L32 15 L36.5 7 L44 9 L55 17 L51.5 31 L46 29 V57 H18 V29 L12.5 31 L9 17 Z"
            fill={locked ? "none" : "#0B5A3E"}
            stroke={locked ? "currentColor" : "#D9EBE2"}
            strokeWidth={locked ? 1.6 : 1.6}
            strokeLinejoin="round"
          />
          {!locked && <path d="M28.6 8.2 L32 21 L35.4 8.2 L32 13 Z" fill="#FFFFFF" />}
          <path d="M27.5 7 L32 33 L36.5 7" fill="none" stroke={locked ? "currentColor" : "#D9EBE2"} strokeWidth={1.3} strokeLinejoin="round" opacity={locked ? 0.7 : 0.85} />
          <path d="M27.5 7 L24.5 18 L29.5 21 M36.5 7 L39.5 18 L34.5 21" fill="none" stroke={locked ? "currentColor" : "#D9EBE2"} strokeWidth={1.1} strokeLinejoin="round" opacity={0.7} />
          <path d="M18 57 L32 57 M32 33 V57" fill="none" stroke={locked ? "currentColor" : "#D9EBE2"} strokeWidth={1} opacity={0.55} />
          {locked ? (
            <path d="M38 23 H44 V27 H38 Z" fill="none" stroke="currentColor" strokeWidth={1.2} />
          ) : (
            <path d="M38 23 H44 V26 C44 28 41 29 41 29 C41 29 38 28 38 26 Z" fill={`url(#${g})`} stroke={t.line} strokeWidth={0.8} />
          )}
          {[38, 46].map((y) => (
            <circle key={y} cx="34.5" cy={y} r="1.9" fill={locked ? "none" : `url(#${g})`} stroke={locked ? "currentColor" : t.line} strokeWidth={0.8} />
          ))}
        </>
      )}

      {art === "salver" && (
        <>
          <circle {...body} cx="32" cy="27" r="22" />
          <circle {...line} cx="32" cy="27" r="16.5" />
          <circle {...line} cx="32" cy="27" r="19.5" strokeDasharray="1.2 2.4" />
          <path {...line} d="M24 24 H40 M26 28.5 H38 M28.5 33 H35.5" />
          <path {...body} d="M27 48 H37 L39 53 H25 Z" />
          {hi && <path {...hi} d="M16 20 C18 14 23 9.5 29 8.3" />}
        </>
      )}

      {art === "medal" && (
        <>
          <path d="M21 3 H31 L36 24 H28 Z" fill={locked ? "none" : "#006747"} stroke={locked ? "currentColor" : "#D9EBE2"} strokeWidth={1.2} strokeLinejoin="round" />
          <path d="M43 3 H33 L28 24 H36 Z" fill={locked ? "none" : "#FFFFFF"} stroke={locked ? "currentColor" : "#2F4F43"} strokeWidth={1.2} strokeLinejoin="round" />
          <circle {...body} cx="32" cy="40" r="15" />
          <circle {...line} cx="32" cy="40" r="11" />
          <path {...(locked ? line : { fill: t.dark, opacity: 0.85 })} d="M32 32.5 L34.2 37.4 L39.5 37.8 L35.4 41.2 L36.7 46.4 L32 43.5 L27.3 46.4 L28.6 41.2 L24.5 37.8 L29.8 37.4 Z" />
          {hi && <path {...hi} d="M21 36 C22 31 25.5 28 29 27" />}
        </>
      )}

      {art === "plaque" && (
        <>
          <path {...body} d="M32 5 L50 10 V28 C50 40 41 48 32 52 C23 48 14 40 14 28 V10 Z" />
          <path {...line} d="M32 10 L45 13.5 V28 C45 37 38.5 43.5 32 46.5 C25.5 43.5 19 37 19 28 V13.5 Z" />
          <path {...line} d="M25 23 H39 M26 29 H38 M28 35 H36" />
          {hi && <path {...hi} d="M18 14 V27 C18 32 20 36 22.5 39" />}
        </>
      )}

      {art === "pin" && (
        <>
          <path d="M25 5 V50" stroke={locked ? "currentColor" : t.line} strokeWidth={2.4} strokeLinecap="round" />
          {!locked && <path d="M25 5 V50" stroke={`url(#${g})`} strokeWidth={1.2} strokeLinecap="round" />}
          <path {...body} d="M25.5 6 L47 12.5 L25.5 19 Z" />
          <circle {...body} cx="38" cy="46" r="4.5" />
          <path {...body} d="M16 51 C16 49 22 48 29 48 C36 48 47 49 47 51 L45 53 H18 Z" />
          {hi && <path {...hi} d="M29 9.5 L38 12.5" />}
        </>
      )}

      {art === "bridge" && (
        <>
          {/* A little stone footbridge over the creek */}
          <path {...body} d="M5 45 V33 Q32 19 59 33 V45 H50 Q48 32 32 32 Q16 32 14 45 Z" />
          <path {...line} d="M5 33 Q32 19 59 33 M10 30.5 V26 M18 27 V22.5 M26 25.3 V20.6 M32 25 V20.2 M38 25.3 V20.6 M46 27 V22.5 M54 30.5 V26 M8 27 Q32 15 56 27" />
          <path d="M3 50 Q11 47 19 50 T35 50 T51 50 T63 50 M9 55 Q17 52 25 55 T41 55 T57 55" fill="none" stroke={locked ? "currentColor" : glass ? t.line : "#5DA3BE"} strokeWidth={1.4} strokeLinecap="round" opacity={0.8} />
          {hi && <path {...hi} d="M12 36 Q20 32 26 31" />}
        </>
      )}

      {art === "putter" && (
        <>
          <path d="M43 5 L28 45" stroke={locked ? "currentColor" : t.line} strokeWidth={2.6} strokeLinecap="round" />
          {!locked && <path d="M43 5 L28 45" stroke={`url(#${g})`} strokeWidth={1.3} strokeLinecap="round" />}
          <path d="M41 4 L46 6 L44.5 11 L39.5 9.5 Z" fill={locked ? "none" : "#25282A"} stroke={locked ? "currentColor" : "#25282A"} strokeWidth={1} strokeLinejoin="round" />
          <path {...body} d="M13 44 H32 C33.5 44 34 45 34 46 V50 H13 C12 50 11.5 49 11.5 48 V46 C11.5 45 12 44 13 44 Z" />
          <circle {...(locked ? line : { fill: "#FFFFFF", stroke: "#53565A", strokeWidth: 1 })} cx="45" cy="47" r="4.2" />
        </>
      )}

      {standing && (
        locked ? (
          <path d="M16 54 H48 V60 H16 Z" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" opacity={0.6} />
        ) : (
          <>
            <path d="M15 54 H49 L48 60.5 H16 Z" fill={`url(#${sheen})`} />
            <rect x="26" y="56" width="12" height="2.6" rx="0.6" fill={`url(#${g})`} opacity={0.95} />
          </>
        )
      )}
    </svg>
  );
}
