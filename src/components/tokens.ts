// 18 Eagles · Augusta (matched to masters.com): the design system's color tokens as data, plus WCAG 2.x contrast math.
// `src/app/globals.css` @theme holds the same hexes for Tailwind (`bg-paper`, `text-ink`…).
// `node --no-warnings src/app/design-system/measure-contrast.mjs` prints every pair below and fails if
// globals.css drifts from this file. /design-system renders the swatches and ratios from here, so nothing is typed in.

export type Token = { name: string; hex: string; role: string; surface?: "light" | "dark" };

export const tokens = {
  paper: { name: "Augusta White", hex: "#FFFFFF", role: "The page. Clean white, as masters.com is.", surface: "light" },
  "paper-2": { name: "Board White", hex: "#FFFFFF", role: "Raised: cards, inputs, score and club tiles, set off by a hairline.", surface: "light" },
  "paper-3": { name: "Gallery Gray", hex: "#F2F2F2", role: "Sunken: table stripes, the par row, hover wash, bar tracks.", surface: "light" },
  ink: { name: "Board Black", hex: "#25282A", role: "Body text, numerals, the focus ring on white.", surface: "dark" },
  "ink-2": { name: "Program Gray", hex: "#53565A", role: "Muted text: captions, hints, metadata.", surface: "dark" },
  "rule-strong": { name: "Rope Gray", hex: "#85888B", role: "Control borders and chart axes (3:1 or more on white and gray).", surface: "dark" },
  green: { name: "Masters Green", hex: "#006747", role: "The one primary action, chart marks, selected borders.", surface: "dark" },
  "green-2": { name: "Pine", hex: "#00563B", role: "Hover and pressed for Masters Green.", surface: "dark" },
  "green-3": { name: "Masters Green", hex: "#006747", role: "Green surfaces: the bar, hero bands, Out/In cells, selected tiles.", surface: "dark" },
  "on-green": { name: "White", hex: "#FFFFFF", role: "Text and icons on green.", surface: "light" },
  gold: { name: "Masters Yellow", hex: "#FCE300", role: "Honors and the focus ring on green. Green surfaces only.", surface: "light" },
  "gold-ink": { name: "Masters Green", hex: "#006747", role: "Eyebrows and labels on white.", surface: "dark" },
  under: { name: "Leaderboard Red", hex: "#BA0C2F", role: "Scores under par, with the minus sign. Never decoration.", surface: "dark" },
  over: { name: "Masters Green", hex: "#006747", role: "Over-par numbers, as the leaderboard paints them.", surface: "dark" },
  link: { name: "Masters Green", hex: "#006747", role: "Links, underlined, and the golfer’s notes.", surface: "dark" },
  focus: { name: "Board Black", hex: "#25282A", role: "Focus ring on white (2px, offset 2px). Yellow on green.", surface: "dark" },
  error: { name: "Rust", hex: "#8A3B12", role: "Field errors, always with an icon and words; never the leaderboard red.", surface: "dark" },
  success: { name: "Masters Green", hex: "#006747", role: "Saved, done, confirmed. With a tick and words.", surface: "dark" },
} as const satisfies Record<string, Token>;

export type TokenKey = keyof typeof tokens;

/** `rule` is a translucent hairline (ink at 22%), for dividers only; it is never text or a control boundary. */
export const RULE = "#D9D9D9";

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
  { fg: "gold", bg: "paper", why: "Masters Yellow on white. Yellow only ever sits on green; labels on white are green." },
  { fg: "under", bg: "green-3", why: "Red on green. Under-par numbers on green surfaces are set in white with the minus sign." },
  { fg: "ink-2", bg: "green-3", why: "Gray on green. Muted text on green is white at full strength." },
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
