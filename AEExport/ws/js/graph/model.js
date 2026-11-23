/* model.js – the graph data model. Pure JS: no DOM, no three.js.
   Used by the browser (view/editor) and by _src/node/build-graph.mjs, so both agree on the format.

   Two JSON shapes exist (see README.md and schema/):
     built    – what the page loads: complete nodes (label, href, src ...), edges, groups.
     overlay  – what the editor exports and you commit: groups, edges, positions, hand-added stubs, exclusions. */
import { NODE_TYPES, EDGE_KINDS } from './config.js';

export const slugify = (s) => String(s)
  .replace(/ß/g, 'ss').replace(/[æÆ]/g, 'ae').replace(/[øØ]/g, 'o').replace(/&/g, ' and ')
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const r1 = (n) => Math.round(n * 10) / 10;
const roundPos = (p) => p.map(r1);
const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
export const edgeKey = (e) => [e.source, e.target].sort().join('|') + '|' + (e.kind || 'default');
const edgeSort = (a, b) => {
  const x = `${a.source}\u0000${a.target}\u0000${a.kind || ''}`, y = `${b.source}\u0000${b.target}\u0000${b.kind || ''}`;
  return x < y ? -1 : x > y ? 1 : 0;
};
const edgeOut = (e) => {
  const o = { source: e.source, target: e.target };
  if (e.kind && e.kind !== 'default') o.kind = e.kind;
  if (e.label) o.label = e.label;
  return o;
};
const NODE_KEYS = ['id', 'label', 'sub', 'type', 'group', 'href', 'pos', 'src'];
const nodeOut = (n) => {
  const o = {};
  for (const k of NODE_KEYS) if (n[k] !== undefined && n[k] !== '') o[k] = k === 'pos' ? roundPos(n.pos) : n[k];
  for (const k of Object.keys(n)) if (!NODE_KEYS.includes(k) && !k.startsWith('_') && n[k] !== undefined) o[k] = n[k]; // custom fields pass through
  return o;
};

/* ---- JSON formatting: one node / edge / group per line, so git diffs show only real changes ---- */
function compact(v) {
  if (Array.isArray(v)) return '[' + v.map(compact).join(', ') + ']';
  if (v && typeof v === 'object') {
    const e = Object.entries(v).filter(([, x]) => x !== undefined);
    return e.length ? '{ ' + e.map(([k, x]) => JSON.stringify(k) + ': ' + compact(x)).join(', ') + ' }' : '{}';
  }
  return JSON.stringify(v);
}
export function formatJson(obj) {
  const keys = Object.keys(obj).filter((k) => obj[k] !== undefined);
  const out = ['{'];
  keys.forEach((k, i) => {
    const v = obj[k], comma = i < keys.length - 1 ? ',' : '', key = JSON.stringify(k);
    if (Array.isArray(v) && v.some((x) => x && typeof x === 'object')) {
      out.push(`  ${key}: [`);
      v.forEach((x, j) => out.push('    ' + compact(x) + (j < v.length - 1 ? ',' : '')));
      out.push('  ]' + comma);
    } else if (v && typeof v === 'object' && !Array.isArray(v) && Object.values(v).some((x) => x && typeof x === 'object')) {
      const es = Object.entries(v);
      out.push(`  ${key}: {`);
      es.forEach(([a, b], j) => out.push('    ' + JSON.stringify(a) + ': ' + compact(b) + (j < es.length - 1 ? ',' : '')));
      out.push('  }' + comma);
    } else out.push(`  ${key}: ${compact(v)}${comma}`);
  });
  out.push('}');
  return out.join('\n') + '\n';
}

export class Graph {
  constructor() {
    this.groups = {};            // id -> { label, color }
    this.nodes = new Map();      // id -> { id, label, sub?, type, group?, href?, pos?, src, ... }
    this.edges = [];             // { source, target, kind?, label? }
    this.sourceIds = new Set();  // ids that come from Foundry / npcs.json (not from the overlay)
    this._l = [];
  }

  /* ---- events: one channel, kind = 'move' | 'structure' | 'groups' | 'node' ---- */
  on(fn) { this._l.push(fn); return () => { this._l = this._l.filter((f) => f !== fn); }; }
  emit(kind, detail = {}) { for (const f of this._l) f({ kind, ...detail }); }

  static fromBuilt(json) {
    const g = new Graph();
    g.groups = structuredClone(json.groups || {});
    for (const n of json.nodes || []) {
      const node = { type: 'npc', ...n };
      node.src = node.src || 'overlay';
      if (node.src !== 'overlay') g.sourceIds.add(node.id);
      g.nodes.set(node.id, node);
    }
    g.edges = (json.edges || []).map((e) => ({ ...e }));
    return g;
  }

  /** Apply an overlay (editor export) on top of the nodes already loaded from sources. */
  applyOverlay(ov) {
    const ex = new Set(ov.exclude || []);
    for (const id of ex) this.nodes.delete(id);
    for (const o of ov.nodes || []) {
      if (ex.has(o.id)) continue;
      const { id, ...rest } = o;
      const n = this.nodes.get(id);
      if (n) Object.assign(n, rest);
      else this.nodes.set(id, { id, type: 'npc', ...rest, src: 'overlay' });
    }
    if (ov.groups) this.groups = structuredClone(ov.groups);
    if (ov.edges) this.edges = ov.edges.map((e) => ({ ...e }));
    return this;
  }

  /* ---- mutations (the editor goes through commands, see editor.js) ---- */
  addNode(n) {
    if (this.nodes.has(n.id)) throw new Error('duplicate id ' + n.id);
    const node = { type: 'npc', src: 'overlay', ...n };
    this.nodes.set(node.id, node);
    this.emit('structure');
    return node;
  }
  removeNode(id) {
    const node = this.nodes.get(id);
    if (!node) return null;
    const gone = this.edges.filter((e) => e.source === id || e.target === id);
    this.edges = this.edges.filter((e) => !gone.includes(e));
    this.nodes.delete(id);
    this.emit('structure');
    return { node, edges: gone };
  }
  restoreNode({ node, edges }) { this.nodes.set(node.id, node); this.edges.push(...edges); this.emit('structure'); }
  setPositions(entries) { for (const [id, pos] of entries) { const n = this.nodes.get(id); if (n) n.pos = [...pos]; } this.emit('move'); }
  updateNode(id, patch) {
    const n = this.nodes.get(id);
    for (const [k, v] of Object.entries(patch)) { if (v === undefined || v === '') delete n[k]; else n[k] = v; }
    this.emit('node', { id });
  }
  hasEdge(a, b, kind) { const k = edgeKey({ source: a, target: b, kind }); return this.edges.some((e) => edgeKey(e) === k); }
  addEdge(e) { this.edges.push(e); this.emit('structure'); }
  insertEdge(e, i) { this.edges.splice(i, 0, e); this.emit('structure'); }
  removeEdge(e) { const i = this.edges.indexOf(e); if (i >= 0) { this.edges.splice(i, 1); this.emit('structure'); } return i; }
  updateEdge(e, patch) {
    for (const [k, v] of Object.entries(patch)) { if (v === undefined || v === '') delete e[k]; else e[k] = v; }
    this.emit('structure');
  }
  setGroupDef(id, def) { if (def) this.groups[id] = def; else delete this.groups[id]; this.emit('groups'); }
  edgesOf(id) { return this.edges.filter((e) => e.source === id || e.target === id); }

  /** A read-only view on part of the graph. focus: ids (+ depth hops), groups: group ids; both given = union. */
  subgraph({ focus = [], depth = 1, groups = [] } = {}) {
    const keep = new Set();
    if (groups.length) for (const n of this.nodes.values()) if (groups.includes(n.group)) keep.add(n.id);
    if (focus.length) {
      let ring = focus.filter((id) => this.nodes.has(id));
      ring.forEach((id) => keep.add(id));
      for (let d = 0; d < depth; d++) {
        const next = [];
        for (const e of this.edges) for (const [a, b] of [[e.source, e.target], [e.target, e.source]])
          if (ring.includes(a) && !keep.has(b)) { keep.add(b); next.push(b); }
        ring = next;
      }
    }
    const g = new Graph();
    g.groups = structuredClone(this.groups);
    for (const id of keep) g.nodes.set(id, structuredClone(this.nodes.get(id)));
    g.edges = this.edges.filter((e) => keep.has(e.source) && keep.has(e.target)).map((e) => ({ ...e }));
    return g;
  }

  /* ---- serialisation ---- */
  toBuilt() {
    return {
      version: 1,
      groups: this.groups,
      nodes: [...this.nodes.values()].sort(byId).map(nodeOut),
      edges: [...this.edges].sort(edgeSort).map(edgeOut)
    };
  }
  toOverlay() {
    const nodes = [];
    for (const n of [...this.nodes.values()].sort(byId)) {
      const o = { id: n.id };
      if (n.src === 'overlay') { for (const k of ['label', 'sub', 'type', 'href']) if (n[k]) o[k] = n[k]; }
      if (n.group) o.group = n.group;
      if (n.pos) o.pos = roundPos(n.pos);
      nodes.push(o);
    }
    const exclude = [...this.sourceIds].filter((id) => !this.nodes.has(id)).sort();
    return { version: 1, groups: this.groups, nodes, edges: [...this.edges].sort(edgeSort).map(edgeOut), exclude: exclude.length ? exclude : undefined };
  }

  validate() {
    const errors = [], warnings = [], seen = new Set(), ungrouped = [];
    for (const n of this.nodes.values()) {
      if (!n.label) errors.push(`node "${n.id}": no label`);
      if (n.group && !this.groups[n.group]) errors.push(`node "${n.id}": group "${n.group}" is not defined in "groups"`);
      if (!n.group) ungrouped.push(n.id);
      if (n.type && !NODE_TYPES[n.type]) warnings.push(`node "${n.id}": unknown type "${n.type}" (see config.js)`);
      if (n.pos && !(Array.isArray(n.pos) && n.pos.length === 3 && n.pos.every(Number.isFinite))) errors.push(`node "${n.id}": pos must be [x, y, z]`);
    }
    for (const e of this.edges) {
      const tag = `edge ${e.source} → ${e.target}`;
      if (!this.nodes.has(e.source)) errors.push(`${tag}: unknown source "${e.source}"${this._hint(e.source)}`);
      if (!this.nodes.has(e.target)) errors.push(`${tag}: unknown target "${e.target}"${this._hint(e.target)}`);
      if (e.source === e.target) errors.push(`${tag}: edge to itself`);
      if (e.kind && !EDGE_KINDS[e.kind]) warnings.push(`${tag}: unknown kind "${e.kind}" (see config.js)`);
      const k = edgeKey(e);
      if (seen.has(k)) errors.push(`${tag}: duplicate edge`);
      seen.add(k);
    }
    if (ungrouped.length) warnings.push(`${ungrouped.length} node(s) without group: ${ungrouped.slice(0, 8).join(', ')}${ungrouped.length > 8 ? ', …' : ''}`);
    return { errors, warnings };
  }
  _hint(id) {
    const c = [...this.nodes.keys()].filter((k) => k.includes(id) || id.includes(k) || lev(k, id) <= 2);
    return c.length ? ` – did you mean ${c.slice(0, 3).map((x) => '"' + x + '"').join(', ')}?` : '';
  }
}

function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
