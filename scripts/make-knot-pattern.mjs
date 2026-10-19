// Trefoil düğümünden tekrar eden arka plan deseni üretir: public/img/knots-{light,dark}.svg
import { writeFileSync } from 'node:fs';

const N = 720;
const pts = [];
for (let i = 0; i < N; i++) {
  const t = (i / N) * 2 * Math.PI;
  pts.push([Math.sin(t) + 2 * Math.sin(2 * t), Math.cos(t) - 2 * Math.cos(2 * t)]);
}
// Kesişimleri bul (segment çiftleri)
function segInter(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]];
  const den = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(den) < 1e-12) return null;
  const qp = [c[0] - a[0], c[1] - a[1]];
  const u = (qp[0] * r[1] - qp[1] * r[0]) / den;
  const tt = (qp[0] * s[1] - qp[1] * s[0]) / den;
  return tt > 0 && tt < 1 && u > 0 && u < 1 ? tt : null;
}
const passes = []; // {i: segment index (kesirli), id: kesişim no}
let id = 0;
for (let i = 0; i < N; i++) {
  for (let j = i + 2; j < N; j++) {
    if (i === 0 && j === N - 1) continue;
    const a = pts[i], b = pts[(i + 1) % N], c = pts[j], d = pts[(j + 1) % N];
    const tt = segInter(a, b, c, d);
    if (tt !== null) {
      const u = segInter(c, d, a, b);
      passes.push({ pos: i + tt, id }); passes.push({ pos: j + u, id }); id++;
    }
  }
}
passes.sort((p, q) => p.pos - q.pos); // 6 geçiş, 3 kesişim
// Alternatif düğüm: geçişler sırayla üst/alt
passes.forEach((p, k) => (p.over = k % 2 === 0));
const GAP = 11; // örnek sayısı cinsinden boşluk (her iki yana)
// Parçalar: ardışık geçişler arası
function pathFrom(startPos, endPos) {
  const out = [];
  for (let k = Math.ceil(startPos); k <= Math.floor(endPos); k++) out.push(pts[((k % N) + N) % N]);
  return out;
}
const pieces = [];
for (let k = 0; k < passes.length; k++) {
  const a = passes[k], b = passes[(k + 1) % passes.length];
  let s = a.pos, e = b.pos < a.pos ? b.pos + N : b.pos;
  if (!a.over) s += GAP;
  if (!b.over) e -= GAP;
  pieces.push(pathFrom(s, e));
}
function toPath(poly, cx, cy, scale, rot) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return 'M' + poly.map(([x, y]) => {
    const X = x * c - y * s, Y = x * s + y * c;
    return (cx + X * scale).toFixed(1) + ' ' + (cy + Y * scale).toFixed(1);
  }).join(' L');
}
const TILE = 360;
const knots = [
  { cx: 95, cy: 95, scale: 24, rot: 0.2 },
  { cx: 275, cy: 265, scale: 24, rot: 1.3 },
  { cx: 290, cy: 75, scale: 15, rot: 2.4 },
  { cx: 80, cy: 285, scale: 15, rot: 0.9 },
];
function svg(stroke, opacity) {
  const paths = knots.flatMap((k) => pieces.map((p) => `<path d="${toPath(p, k.cx, k.cy, k.scale, k.rot)}"/>`)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}"><g fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="2.2" stroke-linecap="round">${paths}</g></svg>`;
}
writeFileSync('public/img/knots-light.svg', svg('#111111', 0.055));
writeFileSync('public/img/knots-dark.svg', svg('#ffffff', 0.06));
console.log('passes', passes.length, 'pieces', pieces.map((p) => p.length).join(','));
