// Düğüm diyagramlarından tekrar eden arka plan deseni üretir: public/img/knots-{light,dark}.svg
// Her düğüm 3B parametrik eğri; xy izdüşümündeki kesişimlerde üst/alt geçiş z'ye göre belirlenir.
import { writeFileSync } from 'node:fs';

const N = 900;
const KNOTS = {
  // 3_1 — trefoil
  trefoil: (t) => [Math.sin(t) + 2 * Math.sin(2 * t), Math.cos(t) - 2 * Math.cos(2 * t), -Math.sin(3 * t)],
  // 4_1 — figure-eight
  figureEight: (t) => [(2 + Math.cos(2 * t)) * Math.cos(3 * t), (2 + Math.cos(2 * t)) * Math.sin(3 * t), Math.sin(4 * t)],
  // 5_1 — cinquefoil (torus knot T(2,5))
  cinquefoil: (t) => [(2 + Math.cos(5 * t)) * Math.cos(2 * t), (2 + Math.cos(5 * t)) * Math.sin(2 * t), -Math.sin(5 * t)],
  // 7_1 — septafoil (torus knot T(2,7))
  septafoil: (t) => [(2 + Math.cos(7 * t)) * Math.cos(2 * t), (2 + Math.cos(7 * t)) * Math.sin(2 * t), -Math.sin(7 * t)],
};

function segInter(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]];
  const den = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(den) < 1e-12) return null;
  const qp = [c[0] - a[0], c[1] - a[1]];
  const u = (qp[0] * r[1] - qp[1] * r[0]) / den;
  const tt = (qp[0] * s[1] - qp[1] * s[0]) / den;
  return tt > 0 && tt < 1 && u > 0 && u < 1 ? [tt, u] : null;
}

/** Eğriyi örnekler, kesişimleri bulur, alt geçişlerde boşluk bırakarak parçaları (xy noktaları) döndürür. */
function diagram(fn, gapFrac = 0.035) {
  const pts = [];
  for (let i = 0; i < N; i++) pts.push(fn((i / N) * 2 * Math.PI));
  // normalize: merkezle ve yarıçapı 1'e getir
  let maxR = 0;
  for (const p of pts) maxR = Math.max(maxR, Math.hypot(p[0], p[1]));
  for (const p of pts) { p[0] /= maxR; p[1] /= maxR; }
  const passes = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 2; j < N; j++) {
      if (i === 0 && j === N - 1) continue;
      const a = pts[i], b = pts[(i + 1) % N], c = pts[j], d = pts[(j + 1) % N];
      const r = segInter(a, b, c, d);
      if (!r) continue;
      const [tt, u] = r;
      const zi = a[2] + (b[2] - a[2]) * tt, zj = c[2] + (d[2] - c[2]) * u;
      passes.push({ pos: i + tt, over: zi > zj });
      passes.push({ pos: j + u, over: zj > zi });
    }
  }
  passes.sort((p, q) => p.pos - q.pos);
  const GAP = Math.round(N * gapFrac);
  const pieces = [];
  for (let k = 0; k < passes.length; k++) {
    const a = passes[k], b = passes[(k + 1) % passes.length];
    let s = a.pos, e = b.pos <= a.pos ? b.pos + N : b.pos;
    if (!a.over) s += GAP;
    if (!b.over) e -= GAP;
    const out = [];
    for (let m = Math.ceil(s); m <= Math.floor(e); m++) out.push(pts[((m % N) + N) % N]);
    if (out.length > 1) pieces.push(out);
  }
  return { pieces, crossings: passes.length / 2 };
}

function toPath(poly, cx, cy, scale, rot) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return 'M' + poly.map(([x, y]) => {
    const X = x * c - y * s, Y = x * s + y * c;
    return (cx + X * scale).toFixed(1) + ' ' + (cy + Y * scale).toFixed(1);
  }).join(' L');
}

const TILE = 520;
// Karo yerleşimi: düğüm, merkez, yarıçap (px), dönüş
const LAYOUT = [
  { knot: 'trefoil',     cx: 95,  cy: 90,  r: 62, rot: 0.2 },
  { knot: 'figureEight', cx: 330, cy: 120, r: 70, rot: 1.1 },
  { knot: 'cinquefoil',  cx: 150, cy: 330, r: 72, rot: 0.5 },
  { knot: 'trefoil',     cx: 420, cy: 400, r: 44, rot: 2.3 },
  { knot: 'septafoil',   cx: 290, cy: 480, r: 56, rot: 0.9 },
  { knot: 'figureEight', cx: 470, cy: 250, r: 44, rot: 2.8 },
];
const GAPS = { trefoil: 0.03, figureEight: 0.022, cinquefoil: 0.016, septafoil: 0.011 };
const diagrams = Object.fromEntries(Object.entries(KNOTS).map(([k, fn]) => [k, diagram(fn, GAPS[k])]));
for (const [k, d] of Object.entries(diagrams)) console.log(k, 'crossings:', d.crossings, 'pieces:', d.pieces.length);

function svg(stroke, opacity) {
  const paths = LAYOUT.flatMap((l) => diagrams[l.knot].pieces.map((p) => `<path d="${toPath(p, l.cx, l.cy, l.r, l.rot)}"/>`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}"><g fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
}
const LIGHT = svg('#111111', 0.055), DARK = svg('#ffffff', 0.06);
writeFileSync('public/img/knots-light.svg', LIGHT);
writeFileSync('public/img/knots-dark.svg', DARK);
if (process.argv.includes('--test')) writeFileSync('dist/knot-test.svg', svg('#111111', 1));
