#!/usr/bin/env node
/* build-graph.mjs – merges the three graph sources into the file the page loads.

     tmp/party-live.json          Foundry export (PCs, and any NPCs you export)      → nodes
     _src/data/npcs.json          hand-written NPCs (and PCs, if you like)           → nodes
     _src/data/foundry-map.json   optional: fixes for Foundry actors (id, href, …)
     _src/data/graph.json         overlay = what the editor exports                  → groups, edges, positions, stubs
                         ──────▶  AEExport/ws/data/graphs/crew-and-npcs.json         (committed, loaded by the page)

   Usage:  node _src/node/build-graph.mjs        (npm run graph)
   Exit code 1 on errors, so it can guard a deploy. To add another graph, add an entry to GRAPHS. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Graph, slugify, formatJson } from '../../AEExport/ws/js/graph/model.js';
import { seedMissing, runLayout } from '../../AEExport/ws/js/graph/layout.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SITE = path.join(ROOT, 'AEExport/ws');
const GRAPHS = [{
  name: 'crew-and-npcs',
  foundry: 'tmp/party-live.json',
  npcs: '_src/data/npcs.json',
  map: '_src/data/foundry-map.json',
  overlay: '_src/data/graph.json',
  out: 'AEExport/ws/data/graphs/crew-and-npcs.json'
}];

const read = (rel) => { const f = path.join(ROOT, rel); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const stripComments = (o) => Object.fromEntries(Object.entries(o || {}).filter(([k]) => !k.startsWith('_')));

/** Foundry adapter – the only place that knows the shape of the Foundry export. Adjust here if your export differs. */
export function readFoundry(raw, map = {}) {
  if (!raw) return [];
  const actors = Array.isArray(raw) ? raw : raw.actors || raw.characters || raw.party || raw.members || [];
  const out = [];
  for (const a of actors) {
    const name = a.name, fid = a._id || a.id;
    if (!name) continue;
    const m = map[fid] || map[name] || {};
    if (m.skip) continue;
    const type = m.type || ((a.type || 'character') === 'character' ? 'pc' : 'npc');
    const id = m.id || slugify(name);
    out.push({ id, label: m.label || name, sub: m.sub, type, href: m.href ?? (type === 'pc' ? `characters/${id}.html` : undefined), foundry: fid, src: 'foundry' });
  }
  return out;
}

/** Hand-written NPCs: id defaults to slugify(name). */
export function readNpcs(raw) {
  return (raw || []).map((r) => {
    const { name, id, was, ...rest } = r;
    if (!name) throw new Error('npcs.json: entry without "name": ' + JSON.stringify(r));
    return { id: id || slugify(name), label: name, type: 'npc', ...rest, was, src: 'npcs' };
  });
}

/** Merge source records: same id inside one source = error, across sources = merged (later source wins per field). */
export function mergeSources(...lists) {
  const byId = new Map(), notes = [], errors = [];
  for (const list of lists) {
    const seen = new Set();
    for (const r of list) {
      if (seen.has(r.id)) errors.push(`duplicate id "${r.id}" inside ${r.src}`);
      seen.add(r.id);
      const prev = byId.get(r.id);
      if (prev) { notes.push(`merged "${r.id}" (${prev.src} + ${r.src})`); byId.set(r.id, { ...prev, ...Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)), src: prev.src }); }
      else byId.set(r.id, r);
    }
  }
  return { records: [...byId.values()], notes, errors };
}

/** Rewrite old ids ("was": [...]) to the current id in the overlay. */
function applyAliases(records, overlay) {
  const alias = new Map();
  for (const r of records) for (const w of r.was || []) alias.set(w, r.id);
  const fix = (id) => alias.get(id) || id;
  return {
    ...overlay,
    nodes: (overlay.nodes || []).map((n) => ({ ...n, id: fix(n.id) })),
    edges: (overlay.edges || []).map((e) => ({ ...e, source: fix(e.source), target: fix(e.target) })),
    exclude: (overlay.exclude || []).map(fix)
  };
}

export async function buildGraph(cfg, { log = console.log } = {}) {
  const map = stripComments(read(cfg.map));
  const foundryRaw = read(cfg.foundry);
  const foundry = readFoundry(foundryRaw, map);
  if (foundryRaw && !foundry.length) log(`  ! ${cfg.foundry}: no actors recognised – adjust readFoundry() in build-graph.mjs`);
  if (!foundryRaw) log(`  · ${cfg.foundry} not found, using hand-written nodes only`);
  const npcs = readNpcs(read(cfg.npcs));
  const { records, notes, errors } = mergeSources(foundry, npcs);
  notes.forEach((n) => log('  · ' + n));

  const g = new Graph();
  for (const r of records) { const { was, ...n } = r; g.nodes.set(n.id, n); g.sourceIds.add(n.id); }
  const overlay = applyAliases(records, read(cfg.overlay) || {});
  g.applyOverlay(overlay);
  for (const n of g.nodes.values()) if (n.src === 'overlay') log(`  · "${n.id}" exists only in the overlay (stub) – move it to npcs.json when convenient`);

  const { errors: ve, warnings } = g.validate();
  for (const n of g.nodes.values()) {           // do the pages exist?
    if (n.href && !/^(https?:)?\/\//.test(n.href) && !fs.existsSync(path.join(SITE, n.href.split('#')[0]))) warnings.push(`node "${n.id}": page "${n.href}" not found under AEExport/ws`);
  }
  errors.push(...ve);

  const hadPos = new Set([...g.nodes.values()].filter((n) => n.pos).map((n) => n.id));
  const fresh = seedMissing(g);
  if (fresh.length) { log(`  · laying out ${fresh.length} node(s) without position`); await runLayout(g, { pinned: hadPos, iterations: hadPos.size ? 200 : 400, chunkMs: Infinity }); }
  return { graph: g, errors, warnings };
}

async function main() {
  let failed = false;
  for (const cfg of GRAPHS) {
    console.log(`graph "${cfg.name}"`);
    const { graph, errors, warnings } = await buildGraph(cfg);
    warnings.forEach((w) => console.log('  ⚠ ' + w));
    errors.forEach((e) => console.log('  ✖ ' + e));
    if (errors.length) { failed = true; continue; }
    const out = path.join(ROOT, cfg.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, formatJson(graph.toBuilt()));
    console.log(`  ✔ ${graph.nodes.size} nodes, ${graph.edges.length} edges → ${cfg.out}`);
  }
  process.exit(failed ? 1 : 0);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
