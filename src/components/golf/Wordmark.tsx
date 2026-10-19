import { cx } from "../ui/cx";

export type WordmarkProps = {
  size?: "sm" | "lg";
  /** The surface it sits on; the roundel carries its own green either way. */
  tone?: "paper" | "green";
  /** Show the roundel only (favicon-sized uses). */
  markOnly?: boolean;
  className?: string;
};

/**
 * The 18 Eagles mark: an original roundel (a Caslon E under a small "18", in a brass rope ring, with one
 * red pennant on the E's spine) beside the name set in Caslon Display. Nothing borrowed from a club.
 */
export function Wordmark({ size = "sm", tone = "paper", markOnly, className }: WordmarkProps) {
  const lg = size === "lg";
  return (
    <span className={cx("inline-flex items-center", lg ? "gap-4" : "gap-2.5", className)}>
      <Roundel size={lg ? 96 : 36} ring={lg} />
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span className={cx("font-display tracking-[0.01em]", lg ? "text-[2.6rem] sm:text-[3.2rem]" : "text-[1.45rem]", tone === "green" ? "text-on-green" : "text-ink")}>
            18 Eagles
          </span>
          {lg && <span className={cx("caps mt-2 text-[0.72rem] tracking-[0.3em]", tone === "green" ? "text-gold" : "text-gold-ink")}>A golf journal</span>}
        </span>
      )}
      {markOnly && <span className="sr-only">18 Eagles</span>}
    </span>
  );
}

/** The roundel alone. Decorative: the name always sits beside it in text (or in sr-only text). */
export function Roundel({ size = 36, ring = false }: { size?: number; ring?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0" aria-hidden="true">
      <defs>
        <path id="wm-ring" d="M50 50 m -36.5 0 a 36.5 36.5 0 1 1 73 0 a 36.5 36.5 0 1 1 -73 0" />
      </defs>
      <circle cx="50" cy="50" r="49" fill="var(--color-green-3)" />
      <circle cx="50" cy="50" r="45.5" fill="none" stroke="var(--color-gold)" strokeWidth="1.6" />
      <circle cx="50" cy="50" r={ring ? 31 : 40} fill="none" stroke="var(--color-gold)" strokeWidth={ring ? 3 : 3.6} strokeDasharray={ring ? "0.9 2.6" : "1.1 3"} strokeLinecap="round" />
      {ring && (
        <text className="font-numeral" fontSize="11" fontWeight="600" letterSpacing="1.2" fill="var(--color-gold)">
          <textPath href="#wm-ring" startOffset="0" textLength="226" lengthAdjust="spacing">EIGHTEEN EAGLES · THE MEMBERS&apos; LEDGER · </textPath>
        </text>
      )}
      {ring ? (
        <text x="50" y="41" textAnchor="middle" className="font-numeral" fontSize="11" fontWeight="600" letterSpacing="1.5" fill="var(--color-gold)">18</text>
      ) : (
        // at small sizes the "18" is drawn as two strokes rather than text (it would set under 10px)
        <path d="M41 26 L43.5 24 V36 M50 24.5 a3 3 0 1 0 0.01 0 M50 30.5 a3.4 3.2 0 1 0 0.01 0" fill="none" stroke="var(--color-gold)" strokeWidth="1.6" />
      )}
      <text x="50" y={ring ? 71 : 76} textAnchor="middle" className="font-display" fontSize={ring ? 36 : 44} fill="var(--color-on-green)">E</text>
      {/* pennant on the E's spine */}
      <line x1={ring ? 64 : 67} y1={ring ? 46 : 44} x2={ring ? 64 : 67} y2={ring ? 31 : 26} stroke="var(--color-gold)" strokeWidth="1.3" />
      <path d={ring ? "M64 31 l8 3 l-8 3 z" : "M67 26 l10 3.6 l-10 3.6 z"} fill="var(--color-under)" />
    </svg>
  );
}
