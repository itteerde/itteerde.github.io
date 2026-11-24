#!/usr/bin/env node
/* test-graph.mjs – quick self-test of the data layer (no browser, no three.js).  npm run graph:test */
import assert from 'node:assert/strict';
import { Graph, slugify, formatJson } from '../../AEExport/ws/js/graph/model.js';
import { seedMissing, runLayout } from '../../AEExport/ws/js/graph/layout.js';
import { readNpcs, readFoundry, mergeSources, scanPages } from './build-graph.mjs';

let n = 0;
const t = (name, fn) => Promise.resolve(fn()).then(() => console.log('  ✔', name), (e) => { console.log('  ✖', name, '\n   ', e.message); process.exitCode = 1; }).finally(() => n++);

await t('slugify', () => {
  assert.equal(slugify('Mère Odile'), 'mere-odile');
  assert.equal(slugify('Captain Zed Ünder'), 'captain-zed-under');
  assert.equal(slugify("  Black   Tom's & Co. "), 'black-tom-s-and-co');
});

await t('hand-written ids default to the slug; explicit id wins', () => {
  const r = readNpcs([{ name: 'Black Tom' }, { name: 'Mirielle', id: 'amber' }]);
  assert.deepEqual(r.map((x) => x.id), ['black-tom', 'amber']);
});

await t('Foundry export is read in several shapes, map renames', () => {
  const raw = { actors: [{ _id: 'a1', name: 'Amber', type: 'character' }, { _id: 'a2', name: 'Kelly', type: 'character' }] };
  const r = readFoundry(raw, { Amber: { id: 'amber', label: 'Mirielle' } });
  assert.deepEqual(r.map((x) => [x.id, x.label, x.href]), [['amber', 'Mirielle', 'characters/amber.html'], ['kelly', 'Kelly', 'characters/kelly.html']]);
});

await t('actors are linked to their page through <main data-uuid>', () => {
  const raw = { actors: [{ _id: 'u1', name: 'Amber Sunshadow', type: 'character' }, { _id: 'u2', name: 'Old Man Kelly', type: 'character' }, { _id: 'u3', name: 'No Page', type: 'character' }] };
  const r = readFoundry(raw, {}, { u1: 'characters/amber.html', u2: 'characters/kelly.html' });
  assert.deepEqual(r.map((x) => [x.id, x.href]), [['amber', 'characters/amber.html'], ['kelly', 'characters/kelly.html'], ['no-page', 'characters/no-page.html']]);
  assert.equal(typeof scanPages('/does/not/exist'), 'object');
});

await t('same id in two sources merges, inside one source is an error', () => {
  const f = [{ id: 'kelly', label: 'Kelly', type: 'pc', src: 'foundry' }];
  const h = [{ id: 'kelly', label: 'Old Man Kelly', sub: 'Captain', src: 'npcs' }];
  const ok = mergeSources(f, h);
  assert.equal(ok.records.length, 1); assert.equal(ok.records[0].label, 'Old Man Kelly'); assert.equal(ok.records[0].type, 'pc'); assert.equal(ok.errors.length, 0);
  assert.equal(mergeSources([...h, ...h]).errors.length, 1);
});

await t('overlay round trip is stable (export → apply → same graph)', () => {
  const g = new Graph(); g.groups = { a: { label: 'A', color: '#fff' } };
  for (const id of ['x', 'y', 'z']) { g.nodes.set(id, { id, label: id.toUpperCase(), type: 'npc', group: 'a', src: 'npcs', pos: [1.234, 2, 3] }); g.sourceIds.add(id); }
  g.nodes.set('stub', { id: 'stub', label: 'Stub', type: 'npc', src: 'overlay', pos: [0, 0, 0] });
  g.edges.push({ source: 'x', target: 'y', kind: 'rival' }, { source: 'y', target: 'stub' });
  g.nodes.delete('z');                                   // deleted in the editor → must be excluded
  const ov = JSON.parse(formatJson(g.toOverlay()));
  assert.deepEqual(ov.exclude, ['z']);
  assert.ok(ov.nodes.find((x) => x.id === 'stub').label === 'Stub');
  assert.equal(ov.nodes.find((x) => x.id === 'x').label, undefined);
  const g2 = new Graph();
  for (const id of ['x', 'y', 'z']) { g2.nodes.set(id, { id, label: id.toUpperCase(), type: 'npc', src: 'npcs' }); g2.sourceIds.add(id); }
  g2.applyOverlay(ov);
  assert.deepEqual(g2.toBuilt(), g.toBuilt());
});

await t('validate reports dangling edges with a hint, duplicates and unknown groups', () => {
  const g = Graph.fromBuilt({ groups: {}, nodes: [{ id: 'black-tom', label: 'Black Tom', group: 'nope' }], edges: [{ source: 'black-tom', target: 'black-tomm' }, { source: 'black-tom', target: 'black-tom' }] });
  const { errors } = g.validate();
  assert.ok(errors.some((e) => e.includes('did you mean "black-tom"')));
  assert.ok(errors.some((e) => e.includes('group "nope"')));
  assert.ok(errors.some((e) => e.includes('itself')));
});

await t('subgraph: focus + depth, groups, union', () => {
  const g = Graph.fromBuilt({ groups: { a: {}, b: {} }, nodes: ['1', '2', '3', '4'].map((id, i) => ({ id, label: id, group: i < 2 ? 'a' : 'b' })), edges: [{ source: '1', target: '2' }, { source: '2', target: '3' }, { source: '3', target: '4' }] });
  assert.deepEqual([...g.subgraph({ focus: ['1'], depth: 1 }).nodes.keys()].sort(), ['1', '2']);
  assert.deepEqual([...g.subgraph({ focus: ['1'], depth: 2 }).nodes.keys()].sort(), ['1', '2', '3']);
  assert.deepEqual([...g.subgraph({ groups: ['b'], focus: ['1'] }).nodes.keys()].sort(), ['1', '2', '3', '4']);
});

await t('layout: deterministic, pinned nodes stay, groups form clusters', async () => {
  const mk = () => { const g = new Graph(); for (const k of 'ab') g.groups[k] = {}; for (const k of 'ab') for (let i = 0; i < 20; i++) g.nodes.set(k + i, { id: k + i, label: k, group: k, src: 'overlay' });
    for (const k of 'ab') for (let i = 0; i < 20; i++) g.edges.push({ source: k + i, target: k + ((i + 1) % 20) }, { source: k + i, target: k + ((i + 7) % 20) });
    g.edges.push({ source: 'a0', target: 'b0' }); return g; };
  const g1 = mk(), g2 = mk();
  for (const g of [g1, g2]) { seedMissing(g); await runLayout(g, { iterations: 200, chunkMs: Infinity }); }
  assert.deepEqual(g1.nodes.get('a5').pos, g2.nodes.get('a5').pos);
  const d = (a, b) => Math.hypot(...a.pos.map((v, i) => v - b.pos[i]));
  const N = [...g1.nodes.values()]; let intra = 0, inter = 0, ci = 0, ce = 0;
  for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) (N[i].group === N[j].group ? (intra += d(N[i], N[j]), ci++) : (inter += d(N[i], N[j]), ce++));
  assert.ok(intra / ci < 0.7 * (inter / ce), `intra ${intra / ci} vs inter ${inter / ce}`);
  const g3 = mk(); seedMissing(g3); g3.nodes.get('a0').pos = [500, 0, 0];
  await runLayout(g3, { iterations: 50, chunkMs: Infinity, pinned: new Set(['a0']) });
  assert.deepEqual(g3.nodes.get('a0').pos, [500, 0, 0]);
});

console.log(`${n} checks`);
