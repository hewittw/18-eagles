// The Members' Ledger palette. Pure data + WCAG 2.x contrast math, shared by the
// mood board page and `measure-contrast.mjs` (run: node --no-warnings src/app/mood-board/measure-contrast.mjs).

export type Swatch = { name: string; hex: string; role: string };

export const palette = {
  paper: { name: "Scorecard Paper", hex: "#F5F0E4", role: "Page background; the card stock everything sits on" },
  linen: { name: "Linen", hex: "#E8E0CC", role: "Raised panels, table stripes, selected-row wash" },
  tile: { name: "Tile White", hex: "#FBFAF6", role: "Leaderboard tiles and score cells" },
  ink: { name: "Ink", hex: "#1C1B17", role: "Body text, numerals, rules" },
  pencil: { name: "Pencil", hex: "#5A544A", role: "Secondary text, captions, metadata" },
  locker: { name: "Locker Green", hex: "#143A2C", role: "Dark surfaces: nav, hero, the locker-room panels" },
  fairway: { name: "Fairway", hex: "#2B5E46", role: "Primary buttons, chart marks, selected states" },
  brass: { name: "Brass", hex: "#BE9A55", role: "Ornament and text on Locker Green only: nameplates, rules, focus ring on dark" },
  oldBrass: { name: "Old Brass", hex: "#7A5B20", role: "Brass-toned text and icons on paper" },
  red: { name: "Under-Par Red", hex: "#A3272A", role: "Scores under par, as on the hand-operated board; never decoration" },
  slate: { name: "Covenant Slate", hex: "#22485A", role: "Links and the quiet second accent (a nod to Southern California dusk)" },
} as const satisfies Record<string, Swatch>;

export type Key = keyof typeof palette;

/** Text/background pairs the app intends to use. kind decides the threshold. */
export const pairs: { fg: Key; bg: Key; use: string; kind: "body" | "large" | "ui" }[] = [
  { fg: "ink", bg: "paper", use: "Body text on paper", kind: "body" },
  { fg: "ink", bg: "linen", use: "Body text on linen panels", kind: "body" },
  { fg: "ink", bg: "tile", use: "Score numerals on tiles", kind: "body" },
  { fg: "pencil", bg: "paper", use: "Captions on paper", kind: "body" },
  { fg: "pencil", bg: "linen", use: "Captions on linen", kind: "body" },
  { fg: "fairway", bg: "paper", use: "Green labels and links on paper", kind: "body" },
  { fg: "slate", bg: "paper", use: "Links on paper", kind: "body" },
  { fg: "oldBrass", bg: "paper", use: "Brass small caps on paper", kind: "body" },
  { fg: "red", bg: "paper", use: "Under-par score on paper", kind: "body" },
  { fg: "red", bg: "tile", use: "Under-par score on tiles", kind: "body" },
  { fg: "paper", bg: "locker", use: "Body text on Locker Green", kind: "body" },
  { fg: "brass", bg: "locker", use: "Brass text on Locker Green", kind: "body" },
  { fg: "paper", bg: "fairway", use: "Button label on Fairway", kind: "body" },
  { fg: "linen", bg: "locker", use: "Secondary text on Locker Green", kind: "body" },
  { fg: "tile", bg: "red", use: "Label on a red badge", kind: "body" },
  { fg: "fairway", bg: "linen", use: "Chart marks / selected border on linen", kind: "ui" },
  { fg: "pencil", bg: "tile", use: "Tile borders and hairline rules", kind: "ui" },
  { fg: "ink", bg: "paper", use: "Focus ring (2px Ink, 2px offset) on paper", kind: "ui" },
  { fg: "brass", bg: "locker", use: "Focus ring (2px Brass, 2px offset) on Locker Green", kind: "ui" },
  { fg: "brass", bg: "locker", use: "Brass rules and nameplate edges on Locker Green", kind: "ui" },
];

function channel(c: number) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
export function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}
export const threshold = { body: 4.5, large: 3, ui: 3 } as const;
