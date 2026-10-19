// The Members' Ledger: the design system's color tokens as data, plus WCAG 2.x contrast math.
// `src/app/globals.css` @theme holds the same hexes for Tailwind (`bg-paper`, `text-ink`…).
// `node --no-warnings src/app/design-system/measure-contrast.mjs` prints every pair below and fails if
// globals.css drifts from this file. /design-system renders the swatches and ratios from here, so nothing is typed in.

export type Token = { name: string; hex: string; role: string; surface?: "light" | "dark" };

export const tokens = {
  paper: { name: "Scorecard Paper", hex: "#F5F0E4", role: "The page. Warm card stock everything sits on.", surface: "light" },
  "paper-2": { name: "Tile White", hex: "#FBFAF6", role: "Raised: cards, inputs, score and club tiles.", surface: "light" },
  "paper-3": { name: "Linen", hex: "#E8E0CC", role: "Sunken: table stripes, the par row, hover wash, bar tracks.", surface: "light" },
  ink: { name: "Ink", hex: "#1C1B17", role: "Body text, numerals, rules, the focus ring on paper.", surface: "dark" },
  "ink-2": { name: "Pencil", hex: "#5A544A", role: "Muted text: captions, hints, metadata.", surface: "dark" },
  "rule-strong": { name: "Graphite", hex: "#7D7566", role: "Control borders and chart axes (≥ 3:1 on every paper).", surface: "dark" },
  green: { name: "Fairway", hex: "#2B5E46", role: "The one primary action, chart marks, selected borders.", surface: "dark" },
  "green-2": { name: "Clubhouse Green", hex: "#1F4A37", role: "Hover and pressed for Fairway.", surface: "dark" },
  "green-3": { name: "Locker Green", hex: "#143A2C", role: "Deep surfaces: the bar, hero bands, Out/In cells, selected tiles.", surface: "dark" },
  "on-green": { name: "Scorecard Paper", hex: "#F5F0E4", role: "Text and icons on green and green-3.", surface: "light" },
  gold: { name: "Brass", hex: "#BE9A55", role: "Honors and ornament on Locker Green only; the focus ring on green.", surface: "light" },
  "gold-ink": { name: "Old Brass", hex: "#7A5B20", role: "Brass-toned text and eyebrows on paper.", surface: "dark" },
  under: { name: "Under-Par Red", hex: "#A3272A", role: "Scores under par, with the minus sign. Never decoration.", surface: "dark" },
  over: { name: "Fairway", hex: "#2B5E46", role: "Over-par numbers, as the hand-operated board paints them.", surface: "dark" },
  link: { name: "Covenant Slate", hex: "#22485A", role: "Links and the golfer's notes in italic.", surface: "dark" },
  focus: { name: "Ink", hex: "#1C1B17", role: "Focus ring on paper (2px, offset 2px). Brass on green.", surface: "dark" },
  error: { name: "Rust", hex: "#8A3B12", role: "Field errors, always with an icon and words.", surface: "dark" },
  success: { name: "Fairway", hex: "#2B5E46", role: "Saved, done, confirmed. With a tick and words.", surface: "dark" },
} as const satisfies Record<string, Token>;

export type TokenKey = keyof typeof tokens;

/** `rule` is a translucent hairline (ink at 22%), for dividers only; it is never text or a control boundary. */
export const RULE = "color-mix(in srgb, #1C1B17 22%, transparent)";

export type Kind = "body" | "large" | "ui";
export const threshold: Record<Kind, number> = { body: 4.5, large: 3, ui: 3 };

/** Every foreground/background pair the components actually use. The page and the script both read this list. */
export const pairs: { fg: TokenKey; bg: TokenKey; use: string; kind: Kind }[] = [
  { fg: "ink", bg: "paper", use: "Body text on the page", kind: "body" },
  { fg: "ink", bg: "paper-2", use: "Text on cards, inputs, and tiles", kind: "body" },
  { fg: "ink", bg: "paper-3", use: "Text on linen: the par row, stripes", kind: "body" },
  { fg: "ink-2", bg: "paper", use: "Captions and hints on the page", kind: "body" },
  { fg: "ink-2", bg: "paper-2", use: "Captions on cards and tiles", kind: "body" },
  { fg: "ink-2", bg: "paper-3", use: "Captions on linen", kind: "body" },
  { fg: "gold-ink", bg: "paper", use: "Eyebrows and numerals in Old Brass", kind: "body" },
  { fg: "gold-ink", bg: "paper-2", use: "Old Brass on cards", kind: "body" },
  { fg: "link", bg: "paper", use: "Links and italic notes", kind: "body" },
  { fg: "link", bg: "paper-2", use: "Notes on tiles and cards", kind: "body" },
  { fg: "under", bg: "paper", use: "Under-par score on paper", kind: "body" },
  { fg: "under", bg: "paper-2", use: "Under-par score on a tile", kind: "body" },
  { fg: "under", bg: "paper-3", use: "Under-par score on the linen row", kind: "body" },
  { fg: "over", bg: "paper-2", use: "Over-par numbers on tiles", kind: "body" },
  { fg: "error", bg: "paper", use: "Field error text", kind: "body" },
  { fg: "error", bg: "paper-2", use: "Error text inside a card", kind: "body" },
  { fg: "green", bg: "paper", use: "Success text, green labels", kind: "body" },
  { fg: "on-green", bg: "green", use: "Primary button label", kind: "body" },
  { fg: "on-green", bg: "green-2", use: "Primary button, hovered or pressed", kind: "body" },
  { fg: "on-green", bg: "green-3", use: "Text on Locker Green", kind: "body" },
  { fg: "paper-3", bg: "green-3", use: "Secondary text on Locker Green", kind: "body" },
  { fg: "gold", bg: "green-3", use: "Brass caps and honors on Locker Green", kind: "body" },
  { fg: "on-green", bg: "under", use: "Label on a red seal", kind: "body" },
  { fg: "paper", bg: "error", use: "Danger button, hovered", kind: "body" },
  { fg: "rule-strong", bg: "paper", use: "Input and tile borders on paper", kind: "ui" },
  { fg: "rule-strong", bg: "paper-2", use: "Borders on cards and tiles", kind: "ui" },
  { fg: "rule-strong", bg: "paper-3", use: "Borders on linen", kind: "ui" },
  { fg: "green", bg: "paper-3", use: "Chart bars on a linen track", kind: "ui" },
  { fg: "green-3", bg: "paper", use: "Selected tile edge, chart bars", kind: "ui" },
  { fg: "focus", bg: "paper", use: "Focus ring on paper", kind: "ui" },
  { fg: "focus", bg: "paper-3", use: "Focus ring on linen", kind: "ui" },
  { fg: "gold", bg: "green-3", use: "Focus ring on Locker Green", kind: "ui" },
  { fg: "gold-ink", bg: "paper", use: "Goal line on a chart", kind: "ui" },
];

/** Measured failures we design around (shown on /design-system so nobody "fixes" them back). */
export const forbidden: { fg: TokenKey; bg: TokenKey; why: string }[] = [
  { fg: "gold", bg: "paper", why: "Brass on paper. Use Old Brass (gold-ink) for brass-toned text on paper." },
  { fg: "gold", bg: "green", why: "A brass ring on a Fairway button. Rings sit offset on the surface around the button instead." },
  { fg: "under", bg: "green-3", why: "Red on Locker Green. Under-par numbers on green surfaces are set in paper with the minus sign." },
  { fg: "ink-2", bg: "green-3", why: "Pencil on Locker Green. Muted text on green is set in Linen (paper-3)." },
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
export const ratioOf = (fg: TokenKey, bg: TokenKey) => contrast(tokens[fg].hex, tokens[bg].hex);
