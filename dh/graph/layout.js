/* layout.js – 3D force layout (Fruchterman–Reingold style), no dependencies, no DOM.
   - repulsion only within a cutoff, found through a spatial grid, so 10 000 nodes stay feasible
   - edges act as springs
   - nodes of one group are pulled toward their group's centre and group centres push each other apart,
     so hand-assigned cliques come out as visible clusters
   - deterministic: same input, same seed -> same picture
   Positions live in graph.nodes[id].pos = [x, y, z]. */
import { DEFAULTS } from './config.js';

export function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const sphere = (rng, r) => {            // uniform point in a ball
  let x, y, z;
  do { x = rng() * 2 - 1; y = rng() * 2 - 1; z = rng() * 2 - 1; } while (x * x + y * y + z * z > 1);
  return [x * r, y * r, z * r];
};

/** Give every node without pos a starting position: near its group, else near a neighbour, else random. */
export function seedMissing(graph, { linkDistance = DEFAULTS.linkDistance, seed = 1 } = {}) {
  const rng = mulberry32(seed), L = linkDistance;
  const ids = [...graph.nodes.keys()].sort();
  const spread = L * Math.cbrt(Math.max(ids.length, 1)) * 1.2;
  const anchors = {};
  for (const g of Object.keys(graph.groups).sort()) anchors[g] = sphere(rng, spread);
  const adj = new Map();
  for (const e of graph.edges) { (adj.get(e.source) || adj.set(e.source, []).get(e.source)).push(e.target); (adj.get(e.target) || adj.set(e.target, []).get(e.target)).push(e.source); }
  const missing = [];
  for (const id of ids) {
    const n = graph.nodes.get(id);
    if (n.pos) continue;
    const placed = (adj.get(id) || []).map((o) => graph.nodes.get(o)).find((o) => o && o.pos);
    const base = placed ? placed.pos : anchors[n.group] || [0, 0, 0];
    const j = sphere(rng, placed || anchors[n.group] ? L : spread);
    n.pos = [base[0] + j[0], base[1] + j[1], base[2] + j[2]];
    missing.push(id);
  }
  return missing;
}

/**
 * Run the force layout. Resolves when finished (or shouldStop() is true).
 * @param {Graph} graph
 * @param {{pinned?:Set<string>, iterations?:number, linkDistance?:number, groupPull?:number, groupSpread?:number,
 *          gravity?:number, seed?:number, chunkMs?:number, onProgress?:(f:number)=>void, shouldStop?:()=>boolean}} o
 *   pinned nodes take part in the forces but never move.
 */
export async function runLayout(graph, o = {}) {
  const opt = { iterations: 300, linkDistance: DEFAULTS.linkDistance, groupPull: 0.12, groupSpread: 0.9, gravity: 0.015, seed: 7, pinned: new Set(), chunkMs: 10, ...o };
  const ids = [...graph.nodes.keys()].sort(), n = ids.length;
  if (n < 2) return;
  const index = new Map(ids.map((id, i) => [id, i]));
  const rng = mulberry32(opt.seed), L = opt.linkDistance;
  const P = new Float64Array(n * 3), D = new Float64Array(n * 3), fixed = new Uint8Array(n);
  ids.forEach((id, i) => {
    const nd = graph.nodes.get(id), p = nd.pos || sphere(rng, L * Math.cbrt(n));
    P[i * 3] = p[0]; P[i * 3 + 1] = p[1]; P[i * 3 + 2] = p[2];
    fixed[i] = opt.pinned.has(id) ? 1 : 0;
  });
  const E = [];
  for (const e of graph.edges) { const a = index.get(e.source), b = index.get(e.target); if (a !== undefined && b !== undefined && a !== b) E.push(a, b); }
  const gnames = [...new Set(ids.map((id) => graph.nodes.get(id).group).filter(Boolean))].sort();
  const gOf = new Int32Array(n).fill(-1);
  ids.forEach((id, i) => { const g = graph.nodes.get(id).group; if (g) gOf[i] = gnames.indexOf(g); });
  const G = gnames.length, C = new Float64Array(G * 3), cnt = new Float64Array(G);
  const cut = L * 2.2, cut2 = cut * cut, t0 = L * 0.9;
  const key = (x, y, z) => ((Math.floor(x / cut) + 512) << 20) | ((Math.floor(y / cut) + 512) << 10) | (Math.floor(z / cut) + 512);

  const tick = (it) => {
    const temp = t0 * (1 - it / opt.iterations) + L * 0.004;
    D.fill(0);
    // repulsion (grid, cutoff)
    const grid = new Map();
    for (let i = 0; i < n; i++) { const k = key(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); const c = grid.get(k); c ? c.push(i) : grid.set(k, [i]); }
    for (let i = 0; i < n; i++) {
      const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
      const cx = Math.floor(x / cut), cy = Math.floor(y / cut), cz = Math.floor(z / cut);
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
        const cell = grid.get(((cx + a + 512) << 20) | ((cy + b + 512) << 10) | (cz + c + 512));
        if (!cell) continue;
        for (const j of cell) {
          if (j <= i) continue;
          let dx = x - P[j * 3], dy = y - P[j * 3 + 1], dz = z - P[j * 3 + 2], d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > cut2) continue;
          if (d2 < 1e-6) { dx = rng() - 0.5; dy = rng() - 0.5; dz = rng() - 0.5; d2 = dx * dx + dy * dy + dz * dz + 1e-6; }
          const d = Math.sqrt(d2), f = (L * L) / d / d;      // force / distance
          D[i * 3] += dx * f; D[i * 3 + 1] += dy * f; D[i * 3 + 2] += dz * f;
          D[j * 3] -= dx * f; D[j * 3 + 1] -= dy * f; D[j * 3 + 2] -= dz * f;
        }
      }
    }
    // springs
    for (let k = 0; k < E.length; k += 2) {
      const i = E[k], j = E[k + 1];
      const dx = P[i * 3] - P[j * 3], dy = P[i * 3 + 1] - P[j * 3 + 1], dz = P[i * 3 + 2] - P[j * 3 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-6, f = d / L;          // force / distance = d / L
      D[i * 3] -= dx * f; D[i * 3 + 1] -= dy * f; D[i * 3 + 2] -= dz * f;
      D[j * 3] += dx * f; D[j * 3 + 1] += dy * f; D[j * 3 + 2] += dz * f;
    }
    // groups: pull to own centre, centres repel each other
    if (G && (opt.groupPull || opt.groupSpread)) {
      C.fill(0); cnt.fill(0);
      for (let i = 0; i < n; i++) if (gOf[i] >= 0) { const g = gOf[i]; C[g * 3] += P[i * 3]; C[g * 3 + 1] += P[i * 3 + 1]; C[g * 3 + 2] += P[i * 3 + 2]; cnt[g]++; }
      for (let g = 0; g < G; g++) if (cnt[g]) { C[g * 3] /= cnt[g]; C[g * 3 + 1] /= cnt[g]; C[g * 3 + 2] /= cnt[g]; }
      for (let i = 0; i < n; i++) {
        const g = gOf[i]; if (g < 0) continue;
        D[i * 3] += (C[g * 3] - P[i * 3]) * opt.groupPull * L / 4;
        D[i * 3 + 1] += (C[g * 3 + 1] - P[i * 3 + 1]) * opt.groupPull * L / 4;
        D[i * 3 + 2] += (C[g * 3 + 2] - P[i * 3 + 2]) * opt.groupPull * L / 4;
        for (let h = 0; h < G && G <= 64; h++) {
          if (h === g || !cnt[h]) continue;
          const dx = C[g * 3] - C[h * 3], dy = C[g * 3 + 1] - C[h * 3 + 1], dz = C[g * 3 + 2] - C[h * 3 + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-6, f = opt.groupSpread * L * L * Math.sqrt(cnt[g] * cnt[h]) / (d * d + L * L) / 4;
          D[i * 3] += dx / d * f; D[i * 3 + 1] += dy / d * f; D[i * 3 + 2] += dz / d * f;
        }
      }
    }
    // gravity + move (displacement capped by the temperature)
    for (let i = 0; i < n; i++) {
      if (fixed[i]) continue;
      for (let c = 0; c < 3; c++) D[i * 3 + c] -= P[i * 3 + c] * opt.gravity * L / 4;
      const len = Math.hypot(D[i * 3], D[i * 3 + 1], D[i * 3 + 2]);
      if (!len) continue;
      const s = Math.min(len, temp) / len;
      P[i * 3] += D[i * 3] * s; P[i * 3 + 1] += D[i * 3 + 1] * s; P[i * 3 + 2] += D[i * 3 + 2] * s;
    }
  };
  const write = () => { ids.forEach((id, i) => { if (!fixed[i]) graph.nodes.get(id).pos = [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]]; }); };
  const nextFrame = () => new Promise((r) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(r) : setTimeout(r, 0)));

  let it = 0;
  while (it < opt.iterations) {
    const start = performance.now();
    while (it < opt.iterations && performance.now() - start < opt.chunkMs) tick(it++);
    write();
    graph.emit('move');
    opt.onProgress?.(it / opt.iterations);
    if (opt.shouldStop?.()) break;
    if (it < opt.iterations) await nextFrame();
  }
  write();
}
