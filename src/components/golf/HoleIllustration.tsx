import { useId } from "react";
import type { Hole } from "@/lib/course-types";
import { cx } from "../ui/cx";

export type HoleIllustrationProps = {
  hole: Hole;
  /** Same seed + same hole = the same drawing, every render. Use the course slug. */
  seed?: string;
  className?: string;
  /** portrait: tee at the bottom (the hole screen). landscape: tee at the left (cards, banners). */
  orientation?: "portrait" | "landscape";
  /** full: title block, yardage numbers, carries, north arrow. plain: the drawing only (no text), for small sizes. */
  detail?: "full" | "plain";
  /** The golfer's note, pencilled in the margin in slate italic (full detail only). */
  note?: string;
  /** Hide from screen readers when the surrounding card already names the hole. */
  decorative?: boolean;
};

// Yardage-book inks: flat fills used only inside this drawing (not UI tokens; nothing here is text on them
// except ink and slate, which hold ≥ 7:1 on every fill).
const INK = {
  rough: "#DCDDC6", roughMark: "#8E9A7C", cut: "#C3CDAE", fairway: "#A9BD9C", fairwayEdge: "#2B5E46",
  fringe: "#93AE8B", green: "#7FA07A", greenEdge: "#143A2C", sand: "#EADFC2", sandDot: "#9B8B66", sandEdge: "#7E6E4A",
  water: "#B9C7CB", waterLine: "#22485A", tree: "#6F8A6A", treeEdge: "#143A2C", ink: "#1C1B17", pencil: "#5A544A",
  paper: "#F5F0E4", red: "#A3272A", slate: "#22485A", tee: "#A9BD9C",
};

type P = [number, number];

/* ── deterministic randomness ── */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── geometry ── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const f1 = (n: number) => Math.round(n * 10) / 10;
/** A smooth closed path through points (Catmull-Rom as cubic Béziers). */
function smoothClosed(pts: P[]) {
  const n = pts.length;
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + "Z";
}
/** An organic blob around a centre: bunkers, greens, ponds. */
function blob(rnd: () => number, c: P, rx: number, ry: number, rot = 0, wobble = 0.16, k = 9): P[] {
  const ph1 = rnd() * 6.28, ph2 = rnd() * 6.28;
  const pts: P[] = [];
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2;
    const r = 1 + wobble * Math.sin(2 * a + ph1) + wobble * 0.6 * Math.sin(3 * a + ph2) + (rnd() - 0.5) * wobble * 0.5;
    const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r;
    pts.push([c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return pts;
}

type Plan = ReturnType<typeof plan>;

/** Lay out the hole: a centreline from tee to green, then fairway, hazards, trees, and yardages along it. */
function plan(hole: Hole, seed: string) {
  const rnd = mulberry32(hash(`${seed}|${hole.n}|${hole.par}|${hole.yards}`));
  const r = (a: number, b: number) => lerp(a, b, rnd());
  const pick = <T,>(xs: T[]) => xs[Math.floor(rnd() * xs.length)];
  const W = 360, H = 600, cx0 = W / 2;
  const par = hole.par >= 5 ? 5 : hole.par <= 3 ? 3 : 4;
  const teeY = H - 46;
  const greenY = par === 3 ? r(128, 150) : r(98, 112);
  const L = teeY - greenY;
  const k = L / Math.max(90, hole.yards); // px per yard along the hole

  // Shape: straight legs with a rounded corner where the drive lands (par 4), two corners on a par 5.
  const dir = par === 3 ? pick([-1, 1]) : pick([-1, 1, 1, -1, 0]);
  const bend = par === 3 ? r(10, 34) : dir === 0 ? r(10, 26) : par === 5 ? r(60, 100) : r(78, 128);
  const mid = cx0 + r(-14, 14);
  const yAt = (yd: number) => teeY - (clamp(yd, 0, hole.yards) / hole.yards) * L;
  const d1 = dir || (rnd() < 0.5 ? -1 : 1);
  let ctrl: P[];
  if (par === 3) ctrl = [[mid - d1 * bend * 0.5, teeY], [mid + d1 * bend * 0.5, greenY]];
  else if (par === 4) {
    const corner = yAt(r(245, 275));
    ctrl = [[mid - d1 * bend * 0.45, teeY], [mid - d1 * bend * 0.45, corner], [mid + d1 * bend * 0.55, greenY]];
  } else {
    const twoWay = rnd() < 0.5;
    const c1 = yAt(r(250, 280)), c2 = yAt(hole.yards - r(105, 135));
    ctrl = twoWay
      ? [[mid - d1 * bend * 0.3, teeY], [mid - d1 * bend * 0.3, c1], [mid + d1 * bend * 0.6, c2], [mid + d1 * bend * 0.35, greenY]]
      : [[mid - d1 * bend * 0.5, teeY], [mid - d1 * bend * 0.5, c1], [mid + d1 * bend * 0.1, c2], [mid + d1 * bend * 0.5, greenY]];
  }
  // Chaikin rounds the corners; then resample evenly by length.
  let poly: P[] = ctrl;
  for (let it = 0; it < 4; it++) {
    const out: P[] = [poly[0]];
    for (let i = 0; i < poly.length - 1; i++) {
      const [a1, b1] = [poly[i], poly[i + 1]];
      out.push([lerp(a1[0], b1[0], 0.25), lerp(a1[1], b1[1], 0.25)], [lerp(a1[0], b1[0], 0.75), lerp(a1[1], b1[1], 0.75)]);
    }
    out.push(poly[poly.length - 1]);
    poly = out;
  }
  const pc: number[] = [0];
  for (let i = 1; i < poly.length; i++) pc.push(pc[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
  const N = 80;
  const line: P[] = Array.from({ length: N + 1 }, (_, i) => {
    const sLen = (i / N) * pc[pc.length - 1];
    const j = pc.findIndex((c) => c >= sLen);
    if (j <= 0) return poly[0];
    const f = (sLen - pc[j - 1]) / (pc[j] - pc[j - 1] || 1);
    return [lerp(poly[j - 1][0], poly[j][0], f), lerp(poly[j - 1][1], poly[j][1], f)];
  });
  const at = (t: number): P => {
    const x = clamp(t, 0, 1) * N, i = Math.min(N - 1, Math.floor(x)), f = x - i;
    return [lerp(line[i][0], line[i + 1][0], f), lerp(line[i][1], line[i + 1][1], f)];
  };
  const tangent = (t: number): P => {
    const a = at(t - 0.012), b = at(t + 0.012);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  };
  const normal = (t: number): P => { const [tx, ty] = tangent(t); return [-ty, tx]; };
  // arc-length → t, so "250 yards from the tee" lands in the right place
  const cum: number[] = [0];
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
  const total = cum[N];
  const tAtYards = (yd: number) => {
    const s = clamp(yd / hole.yards, 0, 1) * total;
    const i = cum.findIndex((c) => c >= s);
    if (i <= 0) return 0;
    const f = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    return (i - 1 + f) / N;
  };

  // Fairway
  const hasFairway = par !== 3;
  const ts = par === 5 ? tAtYards(r(150, 190)) : tAtYards(r(150, 185));
  const te = 0.94;
  const half = par === 5 ? r(38, 46) : r(40, 52);
  const gap = par === 5 && rnd() < 0.45 ? [tAtYards(hole.yards * r(0.56, 0.6)), tAtYards(hole.yards * r(0.63, 0.67))] : null;
  const widthAt = (t: number, a: number, b: number, hw = half) => {
    const u = (t - a) / (b - a);
    const taper = Math.sqrt(Math.max(0, Math.sin(Math.PI * clamp(u, 0, 1))));
    return hw * (0.25 + 0.75 * taper) * (0.92 + 0.16 * Math.sin(u * 7 + hole.n));
  };
  const strip = (a: number, b: number, hw = half): P[] => {
    const steps = 22, L1: P[] = [], R1: P[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = lerp(a, b, i / steps), p = at(t), nn = normal(t), w = widthAt(t, a, b, hw);
      L1.push([p[0] + nn[0] * w, p[1] + nn[1] * w]);
      R1.push([p[0] - nn[0] * w, p[1] - nn[1] * w]);
    }
    return [...L1, ...R1.reverse()];
  };
  const fairways: P[][] = !hasFairway ? [] : gap ? [strip(ts, gap[0]), strip(gap[1], te)] : [strip(ts, te)];
  // a short collar in front of par-3 greens
  if (par === 3 && rnd() < 0.7) fairways.push(strip(0.74, 0.97, r(26, 34)));

  // Green
  const gc = at(1);
  const [gtx, gty] = tangent(0.99);
  const grot = Math.atan2(gty, gtx);
  const grx = par === 3 ? r(40, 52) : r(26, 34);
  const gry = par === 3 ? r(30, 38) : r(20, 26);
  const green = blob(rnd, gc, gry, grx, grot, 0.1, 10); // long axis along the line of play
  const fringe = green.map(([x, y]) => [gc[0] + (x - gc[0]) * 1.22, gc[1] + (y - gc[1]) * 1.22] as P);
  const pin: P = [gc[0] + r(-0.45, 0.45) * grx * 0.8, gc[1] + r(-0.4, 0.3) * gry];

  // Hazards
  const bunkers: { pts: P[]; c: P; carry?: number; on?: P }[] = [];
  const greenside = par === 3 ? Math.floor(r(2, 4.99)) : Math.floor(r(1, 3.99));
  const used: number[] = [];
  for (let i = 0; i < greenside; i++) {
    let a = 0;
    for (let tries = 0; tries < 8; tries++) {
      a = grot + Math.PI + r(-2.2, 2.2); // around the front and sides, toward the tee
      if (used.every((u) => Math.abs(Math.atan2(Math.sin(a - u), Math.cos(a - u))) > 0.9)) break;
    }
    used.push(a);
    const br = par === 3 ? r(12, 18) : r(9, 15);
    const dist = Math.max(grx, gry) * 1.2 + br * 0.8;
    const c: P = [gc[0] + Math.cos(a) * dist, gc[1] + Math.sin(a) * dist];
    bunkers.push({ pts: blob(rnd, c, br * r(1.1, 1.6), br, a + Math.PI / 2, 0.22, 8), c });
  }
  if (hasFairway) {
    const landing = [r(235, 265)];
    if (par === 5) landing.push(hole.yards - r(110, 140));
    for (const yd of landing) {
      const count = rnd() < 0.5 ? 1 : 2;
      const s0 = rnd() < 0.5 ? -1 : 1;
      for (let j = 0; j < count; j++) {
        const t = tAtYards(yd + j * r(18, 30));
        const p = at(t), nn = normal(t);
        const side = dir !== 0 ? (j === 0 ? -dir : dir) : j === 0 ? s0 : -s0;
        const off = widthAt(t, ts, te) * r(0.85, 1.15) + 6;
        const c: P = [p[0] + nn[0] * off * side, p[1] + nn[1] * off * side];
        const br = r(8, 12);
        const [tx, ty] = tangent(t);
        bunkers.push({ pts: blob(rnd, c, br, br * r(1.4, 2), Math.atan2(ty, tx), 0.2, 8), c, carry: Math.round(yd + j * 20), on: p });
      }
    }
  }
  const waterRoll = rnd();
  let water: { d: string; kind: "pond" | "creek"; carry?: number; side?: number; y?: number; c?: P; rad?: number } | null = null;
  if ((par === 3 && waterRoll < 0.5) || (par === 4 && waterRoll < 0.28) || (par === 5 && waterRoll < 0.32)) {
    const kind = par === 3 ? (rnd() < 0.6 ? "front" : "side") : rnd() < 0.5 ? "cross" : "side";
    if (kind === "front") {
      const c = at(0.7), wx = r(70, 100), wy = r(26, 40);
      water = { d: smoothClosed(blob(rnd, c, wx, wy, 0, 0.14, 10)), kind: "pond", carry: Math.round(hole.yards * 0.82), c, rad: wx };
    } else if (kind === "cross") {
      const yd = par === 5 ? hole.yards * r(0.5, 0.62) : r(190, 225);
      const t = tAtYards(yd), p = at(t);
      const y = p[1], amp = r(6, 12), ph = rnd() * 6;
      const top: P[] = [], bot: P[] = [];
      for (let x = -10; x <= W + 10; x += 30) {
        const yy = y + amp * Math.sin(x / 55 + ph);
        top.push([x, yy - 7]);
        bot.push([x, yy + 8 + 3 * Math.sin(x / 31 + ph)]);
      }
      water = { d: `M${top.map((q) => `${f1(q[0])} ${f1(q[1])}`).join(" L")} L${bot.reverse().map((q) => `${f1(q[0])} ${f1(q[1])}`).join(" L")}Z`, kind: "creek", carry: Math.round(yd + 8), y };
    } else {
      const side = rnd() < 0.5 ? -1 : 1;
      const t = par === 3 ? 0.92 : r(0.62, 0.86);
      const p = at(t), nn = normal(t);
      const wx = r(24, 34), wy = r(58, 86);
      const off = (par === 3 ? grx + r(46, 58) : half + wx + r(26, 38));
      const c: P = [p[0] + nn[0] * off * side, p[1] + nn[1] * off * side];
      water = { d: smoothClosed(blob(rnd, c, wx, wy, Math.atan2(tangent(t)[1], tangent(t)[0]) + Math.PI / 2, 0.15, 10)), kind: "pond", side, c, rad: wy };
    }
  }

  // Trees: clumps outside the corridor, never on sand, water, or the green.
  const trees: [number, number, number][] = [];
  const corridor = (t: number) => (hasFairway && t > ts - 0.05 ? widthAt(clamp(t, ts, te), ts, te) : par === 3 ? 30 + 30 * t : 26) + 14;
  const clear = (x: number, y: number, rr: number) =>
    x > rr && x < W - rr && y > rr + 4 && y < H - rr &&
    Math.hypot(x - gc[0], y - gc[1]) > Math.max(grx, gry) * 1.9 + rr &&
    bunkers.every((b) => Math.hypot(x - b.c[0], y - b.c[1]) > 26 + rr) &&
    trees.every(([tx, ty, tr]) => Math.hypot(x - tx, y - ty) > (tr + rr) * 0.55) &&
    !(water && water.kind === "creek" && Math.abs(y - (water.y ?? -999)) < 26) &&
    !(water?.c && Math.hypot(x - water.c[0], y - water.c[1]) < (water.rad ?? 0) * 1.08 + rr);
  for (let t = 0.02; t < 1.05; t += r(0.07, 0.13)) {
    for (const side of [-1, 1]) {
      if (rnd() < 0.18) continue;
      const tt = Math.min(t, 1), p = at(tt), nn = normal(tt);
      const off = corridor(tt) + r(18, 58);
      const cx1 = p[0] + nn[0] * off * side, cy1 = p[1] + nn[1] * off * side - (t > 1 ? 40 : 0);
      const n = 1 + Math.floor(rnd() * 3.6); // a clump of 1–4 crowns
      for (let j = 0; j < n; j++) {
        const rr = j === 0 ? r(11, 17) : r(7, 13);
        const a = rnd() * Math.PI * 2, dd = j === 0 ? 0 : r(10, 20);
        const x = cx1 + Math.cos(a) * dd, y = cy1 + Math.sin(a) * dd;
        if (clear(x, y, rr)) trees.push([x, y, rr]);
      }
    }
  }
  // a few behind the green
  for (let i = 0; i < 4; i++) {
    const x = gc[0] + r(-90, 90), y = gc[1] - Math.max(grx, gry) * 1.8 - r(4, 40), rr = r(10, 16);
    if (clear(x, y, rr)) trees.push([x, y, rr]);
  }
  // If water is a pond, keep trees off it (approximate by a radius check at its centre)
  // (ponds are drawn after trees' shadows, before trees, so overlaps read as banks)

  // Tees: two or three boxes stepping toward the hole
  const teeSizes: [number, number][] = [[24, 12], [20, 10], [16, 9]];
  const teeBoxes = teeSizes.slice(0, hole.yards > 380 ? 3 : 2).map(([w, h], i) => {
    const t = i * 0.05;
    const p = at(t), [tx, ty] = tangent(t), nn = normal(t);
    const lat = i === 0 ? 0 : r(-10, 10);
    return { p: [p[0] + nn[0] * lat, p[1] + nn[1] * lat] as P, w, h, rot: (Math.atan2(ty, tx) * 180) / Math.PI + 90 };
  });

  // Yardage arcs to the centre of the green
  const arcs = [100, 150, 200, 250].filter((yd) => yd < hole.yards - 35).map((yd) => {
    const rad = yd * k;
    const t = tAtYards(hole.yards - yd);
    const p = at(t);
    const base = Math.atan2(p[1] - gc[1], p[0] - gc[0]);
    const span = clamp(60 / rad, 0.2, 0.5);
    const a1 = base - span, a2 = base + span;
    const s: P = [gc[0] + Math.cos(a1) * rad, gc[1] + Math.sin(a1) * rad];
    const e: P = [gc[0] + Math.cos(a2) * rad, gc[1] + Math.sin(a2) * rad];
    const label: P = [gc[0] + Math.cos(base) * rad, gc[1] + Math.sin(base) * rad];
    return { yd, d: `M${f1(s[0])} ${f1(s[1])} A${f1(rad)} ${f1(rad)} 0 0 1 ${f1(e[0])} ${f1(e[1])}`, label, base };
  });

  const shape = par === 3 ? "plays straight at the green" : dir === 0 ? "runs straight away from the tee" : `doglegs ${dir < 0 ? "left" : "right"}`;
  const fwBunkers = bunkers.filter((b) => b.carry).length;
  const words = (n: number) => ["no", "one", "two", "three", "four", "five", "six"][n] ?? String(n);
  const desc = [
    `The hole ${shape}${gap ? ", with a band of rough across the fairway short of the green" : ""}.`,
    fwBunkers ? `${words(fwBunkers)[0].toUpperCase() + words(fwBunkers).slice(1)} fairway ${fwBunkers === 1 ? "bunker" : "bunkers"} near the landing area.` : "",
    `${words(greenside)[0].toUpperCase() + words(greenside).slice(1)} greenside ${greenside === 1 ? "bunker" : "bunkers"}.`,
    water ? (water.kind === "creek" ? `A creek crosses about ${water.carry} yards from the tee.` : water.carry ? "Water in front of the green." : `A pond to the ${(water.side ?? 1) * (dir || 1) < 0 ? "left" : "right"}.`) : "",
    arcs.length ? `Dotted arcs mark ${arcs.map((a) => a.yd).join(", ")} yards to the centre of the green.` : "",
  ].filter(Boolean).join(" ");

  // Round everything that reaches the markup, so the server and the browser print identical numbers
  // (trig can differ in the last bit between engines, which would break hydration).
  const q = (n: number) => Math.round(n * 10) / 10;
  const qp = (pt: P): P => [q(pt[0]), q(pt[1])];
  return {
    W, H, par, line, k, desc, dir, at,
    fairways: fairways.map((f) => f.map(qp)),
    green: green.map(qp), fringe: fringe.map(qp), gc: qp(gc), pin: qp(pin),
    bunkers: bunkers.map((b) => ({ ...b, pts: b.pts.map(qp), c: qp(b.c), on: b.on ? qp(b.on) : undefined })),
    water: water ? { ...water, y: water.y != null ? q(water.y) : undefined, c: water.c ? qp(water.c) : undefined } : null,
    trees: trees.map(([x, y, rr]) => [q(x), q(y), q(rr)] as [number, number, number]),
    teeBoxes: teeBoxes.map((t) => ({ ...t, p: qp(t.p), rot: q(t.rot) })),
    arcs: arcs.map((a) => ({ ...a, label: qp(a.label) })),
  };
}

/**
 * A yardage-book drawing of one hole, generated from par, yards, and number. The same seed always draws
 * the same hole. Illustrative, and labelled as such for screen readers.
 */
export function HoleIllustration({ hole, seed = "18-eagles", className, orientation = "portrait", detail = "full", note, decorative }: HoleIllustrationProps) {
  const raw = useId();
  const uid = "h" + raw.replace(/[^a-zA-Z0-9]/g, "");
  const p: Plan = plan(hole, seed);
  const land = orientation === "landscape";
  const vbW = land ? p.H : p.W, vbH = land ? p.W : p.H;
  const full = detail === "full";
  const title = `Illustrated plan of hole ${hole.n}${hole.name ? `, ${hole.name}` : ""}: par ${hole.par}, ${hole.yards} yards. Illustrative, not a survey.`;

  const drawing = (
    <g transform={land ? `translate(${p.H} 0) rotate(90)` : undefined}>
      <rect x={-20} y={-20} width={p.W + 40} height={p.H + 40} fill={`url(#${uid}-rough)`} />
      {/* first cut, then fairway with mowing stripes */}
      {p.fairways.map((f, i) => <path key={`c${i}`} d={smoothClosed(f)} fill={INK.cut} stroke={INK.cut} strokeWidth={14} strokeLinejoin="round" />)}
      {p.water && <path d={p.water.d} fill={`url(#${uid}-water)`} stroke={INK.waterLine} strokeWidth={1} />}
      {p.fairways.map((f, i) => <path key={`f${i}`} d={smoothClosed(f)} fill={INK.fairway} stroke={INK.fairwayEdge} strokeWidth={1.1} />)}
      <clipPath id={`${uid}-fw`}>{p.fairways.map((f, i) => <path key={i} d={smoothClosed(f)} />)}</clipPath>
      <g clipPath={`url(#${uid}-fw)`}>
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M-20 ${p.H - i * 38} L ${p.W + 20} ${p.H - i * 38 - 22}`} stroke="#fff" strokeOpacity={0.2} strokeWidth={15} />
        ))}
      </g>
      {/* trees */}
      {p.trees.map(([x, y, rr], i) => (
        <g key={i}>
          <circle cx={x + 2.5} cy={y + 3} r={rr} fill={INK.treeEdge} opacity={0.12} />
          <circle cx={x} cy={y} r={rr} fill={INK.tree} stroke={INK.treeEdge} strokeWidth={0.8} />
          <circle cx={x - rr * 0.3} cy={y - rr * 0.3} r={rr * 0.36} fill="#fff" opacity={0.14} />
        </g>
      ))}
      {/* green */}
      <path d={smoothClosed(p.fringe)} fill={INK.fringe} stroke={INK.fairwayEdge} strokeWidth={0.9} />
      <path d={smoothClosed(p.green)} fill={INK.green} stroke={INK.greenEdge} strokeWidth={1.2} />
      {/* bunkers */}
      {p.bunkers.map((b, i) => <path key={i} d={smoothClosed(b.pts)} fill={`url(#${uid}-sand)`} stroke={INK.sandEdge} strokeWidth={1} />)}
      {/* tees */}
      {p.teeBoxes.map((t, i) => (
        <rect key={i} x={-t.w / 2} y={-t.h / 2} width={t.w} height={t.h} rx={1.5} fill={INK.tee} stroke={INK.treeEdge} strokeWidth={1} transform={`translate(${f1(t.p[0])} ${f1(t.p[1])}) rotate(${f1(t.rot)})`} />
      ))}
      {/* yardage arcs */}
      {p.arcs.map((a) => <path key={a.yd} d={a.d} fill="none" stroke={INK.ink} strokeWidth={1} strokeDasharray="2 4" strokeLinecap="round" />)}
      {/* par 3s: the line of play, tee to pin */}
      {p.par === 3 && <path d={`M${f1(p.teeBoxes[0].p[0])} ${f1(p.teeBoxes[0].p[1] - 8)} L${f1(p.pin[0])} ${f1(p.pin[1] + 4)}`} stroke={INK.ink} strokeOpacity={0.55} strokeWidth={1} strokeDasharray="1 5" strokeLinecap="round" fill="none" />}
      {/* pin */}
      <line x1={p.pin[0]} y1={p.pin[1]} x2={p.pin[0]} y2={p.pin[1] - 24} stroke={INK.ink} strokeWidth={1.3} />
      <path d={`M${f1(p.pin[0])} ${f1(p.pin[1] - 24)} l13 4.5 l-13 4.5z`} fill={INK.red} />
      <circle cx={p.pin[0]} cy={p.pin[1]} r={1.7} fill={INK.ink} />
    </g>
  );

  // Text sits outside the rotated group so it always reads upright. Sizes ≥ 13 units stay ≥ 10px at 280px wide.
  const toScreen = ([x, y]: P): P => (land ? [p.H - y, x] : [x, y]);

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className={cx("block h-auto w-full select-none", className)}
      preserveAspectRatio="xMidYMid slice"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-labelledby": `${uid}-t ${uid}-d` })}
    >
      {!decorative && <title id={`${uid}-t`}>{title}</title>}
      {!decorative && <desc id={`${uid}-d`}>{p.desc}{note ? ` Note: ${note}` : ""}</desc>}
      <defs>
        <pattern id={`${uid}-sand`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill={INK.sand} />
          <circle cx="1.5" cy="1.5" r=".7" fill={INK.sandDot} />
          <circle cx="4.5" cy="4.2" r=".6" fill={INK.sandDot} />
        </pattern>
        <pattern id={`${uid}-rough`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={INK.rough} />
          <path d="M1 7 l1 -2 M5 3 l1 -2" stroke={INK.roughMark} strokeWidth=".6" />
        </pattern>
        <pattern id={`${uid}-water`} width="10" height="5" patternUnits="userSpaceOnUse">
          <rect width="10" height="5" fill={INK.water} />
          <path d="M0 3 q2.5 -2 5 0 t5 0" stroke={INK.waterLine} strokeWidth=".6" fill="none" />
        </pattern>
      </defs>
      {drawing}
      {full && (
        <g className="font-numeral" fontWeight={600} fill={INK.ink}>
          {p.arcs.map((a) => {
            const [x, y] = toScreen(a.label);
            return (
              <g key={a.yd}>
                <rect x={x - 16} y={y - 10} width={32} height={19} fill={INK.paper} stroke={INK.ink} strokeWidth={0.6} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={15}>{a.yd}</text>
              </g>
            );
          })}
          {p.bunkers.filter((b) => b.carry && b.on).map((b, i) => {
            const [x, y] = toScreen(b.c);
            const [ox, oy] = toScreen(b.on!);
            if (land) return <text key={i} x={x} y={y < oy ? y - 16 : y + 26} textAnchor="middle" fontSize={15}>{b.carry}</text>;
            const right = x > ox;
            return <text key={i} x={x + (right ? 18 : -18)} y={y + 5} textAnchor={right ? "start" : "end"} fontSize={15}>{b.carry}</text>;
          })}
          {p.water?.kind === "creek" && p.water.y != null && (
            land
              ? <text x={p.H - p.water.y + 16} y={30} fill={INK.slate} fontSize={15}>carry {p.water.carry}</text>
              : <text x={14} y={p.water.y + 34} fill={INK.slate} fontSize={15}>carry {p.water.carry}</text>
          )}
        </g>
      )}
      {full && (
        <g>
          <rect x={12} y={12} width={hole.name ? 156 : 112} height={hole.name ? 80 : 62} fill={INK.paper} stroke={INK.ink} />
          <text x={22} y={42} className="font-display" fontSize={26} fill={INK.ink}>No. {hole.n}</text>
          <text x={22} y={62} className="font-numeral" fontSize={15} fontWeight={600} letterSpacing={1.4} fill={INK.pencil}>PAR {hole.par} · {hole.yards}</text>
          {hole.name && <text x={22} y={81} className="font-serif" fontStyle="italic" fontSize={15} fill={INK.slate}>{hole.name.length > 18 ? hole.name.slice(0, 17) + "…" : hole.name}</text>}
          <g transform={`translate(${vbW - 26} ${vbH - 40})`}>
            <path d="M0 -16 L6 6 L0 2 L-6 6Z" fill={INK.ink} />
            <text x={0} y={24} textAnchor="middle" className="font-numeral" fontSize={15} fontWeight={600} fill={INK.ink}>N</text>
          </g>
          {note && (
            <text x={vbW - 18} y={hole.name ? 36 : 34} textAnchor="end" className="font-serif" fontStyle="italic" fontSize={16} fill={INK.slate}>
              {note.length > 26 ? note.slice(0, 25) + "…" : note}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
