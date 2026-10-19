// Words for scores, shared by ScoreMark, ScoreTiles, and ScorecardTable.

/** "Birdie", "Par", "Double bogey", "4 over par". */
export function scoreName(strokes: number, par: number): string {
  const d = strokes - par;
  if (strokes === 1) return "Hole in one";
  if (d <= -3) return "Albatross";
  if (d === -2) return "Eagle";
  if (d === -1) return "Birdie";
  if (d === 0) return "Par";
  if (d === 1) return "Bogey";
  if (d === 2) return "Double bogey";
  if (d === 3) return "Triple bogey";
  return `${d} over par`;
}

/** The short caption on a tile: "Eagle", "Birdie", "Par", "Bogey", "Double", "Triple", "+4". */
export function scoreShort(strokes: number, par: number): string {
  const d = strokes - par;
  if (strokes === 1) return "Ace";
  if (d <= -3) return "Albatross";
  if (d === -2) return "Eagle";
  if (d === -1) return "Birdie";
  if (d === 0) return "Par";
  if (d === 1) return "Bogey";
  if (d === 2) return "Double";
  if (d === 3) return "Triple";
  return `+${d}`;
}

/** Score to par as the board shows it: "−2" (true minus), "E", "+3". */
export function toParText(d: number): string {
  return d === 0 ? "E" : d < 0 ? `−${-d}` : `+${d}`;
}
/** Spoken: "2 under", "even", "3 over". */
export function toParSpoken(d: number): string {
  return d === 0 ? "even par" : d < 0 ? `${-d} under par` : `${d} over par`;
}
