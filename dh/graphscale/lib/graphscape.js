import * as k from "three";
import { OrbitControls as Qe } from "three/addons/controls/OrbitControls.js";
import { TrackballControls as Je } from "three/addons/controls/TrackballControls.js";
import { LineMaterial as et } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 as tt } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry as Ee } from "three/addons/lines/LineSegmentsGeometry.js";
const ge = ["circle", "square", "rectangle", "diamond", "hexagon", "triangle", "card"], st = 1;
class Oe {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map = /* @__PURE__ */ new Map();
  on(e, t) {
    let s = this.map.get(e);
    return s || (s = /* @__PURE__ */ new Set(), this.map.set(e, s)), s.add(t), () => this.off(e, t);
  }
  off(e, t) {
    this.map.get(e)?.delete(t);
  }
  emit(e, t) {
    const s = this.map.get(e);
    if (s) for (const i of [...s]) i(t);
  }
  clear() {
    this.map.clear();
  }
}
const Y = (o) => JSON.parse(JSON.stringify(o));
class le {
  directed = !1;
  meta = {};
  events = new Oe();
  nodeMap = /* @__PURE__ */ new Map();
  edgeMap = /* @__PURE__ */ new Map();
  seq = 0;
  nodeList = null;
  edgeList = null;
  constructor(e) {
    e && this.load(e, !1);
  }
  get nodes() {
    return this.nodeList ??= [...this.nodeMap.values()];
  }
  get edges() {
    return this.edgeList ??= [...this.edgeMap.values()];
  }
  hasNode(e) {
    return this.nodeMap.has(e);
  }
  getNode(e) {
    return this.nodeMap.get(e);
  }
  getEdge(e) {
    return this.edgeMap.get(e);
  }
  /** Replace the whole content. Throws if an edge references an unknown node. */
  load(e, t = !0) {
    this.nodeMap.clear(), this.edgeMap.clear(), this.invalidate(), this.directed = !!e.directed, this.meta = Y(e.meta ?? {});
    for (const s of e.nodes ?? []) {
      const i = Y(s);
      i.id = String(i.id), this.nodeMap.set(i.id, i);
    }
    for (const s of e.edges ?? []) {
      const i = Y(s);
      if (i.source = String(i.source), i.target = String(i.target), i.id = i.id ? String(i.id) : this.freeId("e", this.edgeMap), !this.nodeMap.has(i.source) || !this.nodeMap.has(i.target))
        throw new Error(`Edge "${i.id}" references an unknown node`);
      this.edgeMap.set(i.id, i);
    }
    t && this.emit("structure");
  }
  clear() {
    this.load({ directed: this.directed, nodes: [], edges: [] });
  }
  addNode(e = {}) {
    const t = e.id !== void 0 ? String(e.id) : this.freeId("n", this.nodeMap);
    if (this.nodeMap.has(t)) throw new Error(`Node "${t}" already exists`);
    const s = { ...Y(e), id: t };
    return this.nodeMap.set(t, s), this.emit("structure"), s;
  }
  /** Patch a node. A value of `undefined` removes the field. */
  updateNode(e, t) {
    const s = this.nodeMap.get(e);
    if (!s) throw new Error(`Unknown node "${e}"`);
    return ke(s, t), this.emit("structure"), s;
  }
  /** Removes a node and all incident edges. Returns the ids of the removed edges. */
  removeNode(e) {
    if (!this.nodeMap.delete(e)) return [];
    const t = [];
    for (const s of this.edgeMap.values())
      (s.source === e || s.target === e) && t.push(s.id);
    for (const s of t) this.edgeMap.delete(s);
    return this.emit("structure"), t;
  }
  addEdge(e) {
    const t = String(e.source), s = String(e.target);
    if (!this.nodeMap.has(t) || !this.nodeMap.has(s)) throw new Error("Edge endpoints must be existing nodes");
    const i = e.id !== void 0 ? String(e.id) : this.freeId("e", this.edgeMap);
    if (this.edgeMap.has(i)) throw new Error(`Edge "${i}" already exists`);
    const n = { ...Y(e), id: i, source: t, target: s };
    return this.edgeMap.set(i, n), this.emit("structure"), n;
  }
  updateEdge(e, t) {
    const s = this.edgeMap.get(e);
    if (!s) throw new Error(`Unknown edge "${e}"`);
    if (t.source !== void 0 && !this.nodeMap.has(t.source)) throw new Error("Unknown source node");
    if (t.target !== void 0 && !this.nodeMap.has(t.target)) throw new Error("Unknown target node");
    return ke(s, t), this.emit("structure"), s;
  }
  removeEdge(e) {
    const t = this.edgeMap.delete(e);
    return t && this.emit("structure"), t;
  }
  setDirected(e) {
    this.directed = e, this.emit("structure");
  }
  edgesOf(e) {
    return this.edges.filter((t) => t.source === e || t.target === e);
  }
  degree(e) {
    let t = 0;
    for (const s of this.edges)
      s.source === e && t++, s.target === e && t++;
    return t;
  }
  weightOf(e) {
    return typeof e.weight == "number" && Number.isFinite(e.weight) ? e.weight : st;
  }
  isDirected(e) {
    return e.directed ?? this.directed;
  }
  /** Sets positions of many nodes and emits a single `position` event. */
  setPositions(e) {
    for (const [t, s] of e) {
      const i = this.nodeMap.get(t);
      i && (i.x = s[0], i.y = s[1], i.z = s[2]);
    }
    this.events.emit("change", { kind: "position" });
  }
  toData() {
    return Y({ directed: this.directed, meta: this.meta, nodes: this.nodes, edges: this.edges });
  }
  emit(e) {
    this.invalidate(), this.events.emit("change", { kind: e });
  }
  invalidate() {
    this.nodeList = null, this.edgeList = null;
  }
  freeId(e, t) {
    let s;
    do
      s = e + ++this.seq;
    while (t.has(s));
    return s;
  }
}
function ke(o, e) {
  const t = o;
  for (const [s, i] of Object.entries(e))
    i === void 0 ? delete t[s] : t[s] = i;
}
const it = /^[a-z][a-z0-9+.-]*:/i;
function ot(o, e) {
  if (!o) return null;
  const t = o.replace(/[\u0000-\u001f\u007f\s]+/g, (s) => s.includes(" ") ? " " : "").trim();
  return t === "" ? null : t.startsWith("//") ? e.allowAbsolute && /^\/\/[^/]/.test(t) ? t : null : it.test(t) ? e.allowAbsolute && /^(https?|mailto):/i.test(t) ? t : null : t.startsWith("/") || t.startsWith("#") || t.startsWith("?") || !e.baseUrl ? t : e.baseUrl.replace(/\/+$/, "") + "/" + t.replace(/^\.\//, "");
}
function ie(o) {
  let e = o >>> 0;
  return () => {
    e = e + 1831565813 >>> 0;
    let t = e;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function as(o) {
  const e = Math.max(1, Math.floor(o.nodes)), t = Math.max(1, Math.min(o.clusters ?? Math.ceil(Math.sqrt(e) / 2), e)), s = ie(o.seed ?? 1), i = [], n = Array.from({ length: t }, () => []);
  for (let d = 0; d < e; d++) {
    const l = d % t;
    n[l].push(d), i.push({ id: `n${d + 1}`, label: `N${d + 1}`, group: `Group ${l + 1}` });
  }
  const r = Math.floor(e * (o.avgDegree ?? 4) / 2), a = o.crossRatio ?? 0.08, h = /* @__PURE__ */ new Set(), c = [];
  for (let d = 0; c.length < r && d < r * 20; d++) {
    const l = Math.floor(s() * e);
    let u;
    if (s() < a) u = Math.floor(s() * e);
    else {
      const y = n[l % t];
      u = y[Math.floor(s() * y.length)];
    }
    if (l === u) continue;
    const f = l < u ? `${l}-${u}` : `${u}-${l}`;
    if (h.has(f)) continue;
    h.add(f);
    const p = { id: `e${c.length + 1}`, source: i[l].id, target: i[u].id };
    o.weighted && (p.weight = 1 + Math.floor(s() * 5)), c.push(p);
  }
  return { directed: !!o.directed, nodes: i, edges: c };
}
function ds(o) {
  const e = Math.max(20, Math.floor(o.nodes)), t = ie(o.seed ?? 1), s = [], i = [], n = /* @__PURE__ */ new Set(), r = (g) => g[Math.floor(t() * g.length)], a = (g, m) => {
    const M = `n${s.length + 1}`;
    return s.push({ id: M, label: `${g[0]}${s.length + 1}`, group: g, props: m }), M;
  }, h = (g, m, M = {}, b = !1) => {
    const v = g < m ? `${g}|${m}` : `${m}|${g}`;
    if (!b && (g === m || n.has(v))) return;
    n.add(v);
    const S = { id: `e${i.length + 1}`, source: g, target: m, ...M };
    !("weight" in M) && t() < 0.25 && (S.weight = 1 + Math.floor(t() * 4)), i.push(S);
  }, c = (g) => Math.floor(e * g), d = c(0.04), l = c(0.3), u = c(0.32), f = c(0.14), p = [];
  for (; s.length < l; ) {
    const g = Math.min(3 + Math.floor(t() * 7), l - s.length);
    if (g < 2) break;
    const m = Array.from({ length: g }, () => a("Cliques", { clique: p.length + 1 }));
    for (let M = 0; M < g; M++) for (let b = M + 1; b < g; b++) h(m[M], m[b]);
    p.push(m);
  }
  const y = [], w = Math.min(5, u - s.length), E = Array.from({ length: Math.max(w, 2) }, () => a("Hubs"));
  for (let g = 0; g < E.length; g++) for (let m = g + 1; m < E.length; m++)
    h(E[g], E[m]), y.push(E[g], E[m]);
  for (p.length && h(E[0], r(r(p))); s.length < l + u; ) {
    const g = a("Hubs"), m = 1 + Math.floor(t() * 3);
    for (let M = 0; M < m; M++) {
      const b = r(y);
      h(g, b), y.push(g, b);
    }
  }
  for (; s.length < l + u + f; ) {
    const g = Math.min(3 + Math.floor(t() * 10), l + u + f - s.length), m = Array.from({ length: g }, () => a("Chains"));
    h(m[0], r(s.slice(0, s.length - g)).id);
    for (let M = 1; M < g; M++) h(m[M - 1], m[M]);
    g > 4 && t() < 0.3 && h(m[g - 1], m[0]);
  }
  for (; s.length < e - d; ) {
    const g = a("Leaves");
    h(g, t() < 0.5 ? r(y) : r(s.slice(0, s.length - 1)).id);
  }
  for (; s.length < e; ) a("Isolated");
  for (let g = 0; g < Math.ceil(e / 80); g++) h(r(s.filter((m) => m.group !== "Isolated")).id, r(s.filter((m) => m.group !== "Isolated")).id);
  for (let g = 0; g < 4 && i.length; g++) {
    const m = r(i);
    h(m.source, m.target, { weight: 2 + g, label: `parallel ${g + 1}` }, !0);
  }
  for (let g = 0; g < 3; g++) {
    const m = r(s.filter((M) => M.group !== "Isolated")).id;
    h(m, m, { label: "self" }, !0);
  }
  return { directed: !!o.directed, meta: { title: `Mixed network, ${e} nodes` }, nodes: s, edges: i };
}
const ne = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', Se = {
  theme: "light",
  dimension: "2d",
  background: { color: "#f7f8fa", gradientTo: null, transparent: !1 },
  node: { color: "#4e79a7", shape: "circle", size: 14, aspect: 1.6, opacity: 1, borderColor: "#2b3a4a", borderWidth: 1, labelColor: "#1f2933" },
  edge: {
    color: "#8b95a1",
    width: 1.5,
    dashed: !1,
    opacity: 0.9,
    arrows: !0,
    arrowSize: 7,
    curveSpacing: 16,
    loopSize: 0.9,
    dashSize: 5,
    gapSize: 3,
    widthByWeight: { enabled: !1, min: 1, max: 6 }
  },
  label: { show: !0, font: ne, size: 6, color: "#1f2933", subSize: 4.6, subColor: "#5f6b76", background: null, padding: 1, maxCount: 1500, maxChars: 40, mode: "world", resolution: 4, gap: 1.5 },
  weight: { show: "auto", font: ne, size: 5, color: "#3b4652", background: "rgba(255,255,255,0.85)", padding: 1, maxCount: 3e3, decimals: 2 },
  card: { background: "#ffffff", border: "#2b3a4a", headerBackground: null, headerColor: "#ffffff", textColor: "#1f2933", font: ne, size: 4.5, padding: 2 },
  selection: { color: "#e8590c", hoverColor: "#f59f00", width: 2.5 },
  groups: { palette: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ac"], colors: {} },
  rules: [],
  camera: { fov: 50, zoomMin: 0.02, zoomMax: 60, fitPadding: 1.25, autoFit: !0, damping: !1, rotation: "orbit" },
  layout: { name: "force", idealLength: 60, spacing: 40, gap: 14, weightMode: "ignore", gravity: 0.05, direction: "TB", seed: 1, autoRun: !0 },
  interaction: { dragNodes: !0, select: !0, multiSelect: !0, hover: !0, tooltip: !0, axisLock: !0, openLinks: "dblclick", pickLimit: 2e4 },
  links: { baseUrl: "", target: "self", allowAbsolute: !1, panelSandbox: "allow-same-origin allow-scripts allow-popups allow-forms" },
  ui: {
    controls: !0,
    fullscreen: !1,
    injectStyles: !0,
    cssVars: {
      font: ne,
      "panel-bg": "rgba(255,255,255,0.96)",
      "panel-fg": "#1f2933",
      "panel-border": "#cfd6de",
      accent: "#e8590c",
      radius: "4px"
    }
  },
  render: { antialias: !0, pixelRatio: null }
}, Te = {
  light: {},
  dark: {
    background: { color: "#14181d", gradientTo: null },
    node: { color: "#6aa6d9", borderColor: "#0b0e11", labelColor: "#e6ebf0" },
    edge: { color: "#7d8996" },
    label: { color: "#e6ebf0", subColor: "#a9b4bf" },
    weight: { color: "#d3dae1", background: "rgba(20,24,29,0.85)" },
    card: { background: "#1d242c", border: "#6b7886", textColor: "#e6ebf0" },
    selection: { color: "#ffa94d", hoverColor: "#ffd43b" },
    groups: { palette: ["#6aa6d9", "#ffa94d", "#ff7b7b", "#63d2c6", "#8fd36b", "#f2d45c", "#c9a0dc", "#ffb3c1", "#c4a07a", "#aab4bd"] },
    ui: { cssVars: { "panel-bg": "rgba(29,36,44,0.96)", "panel-fg": "#e6ebf0", "panel-border": "#3a4652", accent: "#ffa94d" } }
  },
  blueprint: {
    background: { color: "#0d3b66", gradientTo: "#0a2c4d" },
    node: { color: "#faf0ca", borderColor: "#f4d35e", labelColor: "#faf0ca" },
    edge: { color: "#a9c7e8" },
    label: { color: "#faf0ca", subColor: "#a9c7e8" },
    weight: { color: "#0d3b66", background: "rgba(250,240,202,0.92)" },
    card: { background: "#0a2c4d", border: "#f4d35e", headerBackground: "#f4d35e", headerColor: "#0d3b66", textColor: "#faf0ca" },
    selection: { color: "#ee964b", hoverColor: "#f95738" },
    groups: { palette: ["#faf0ca", "#f4d35e", "#ee964b", "#f95738", "#a9c7e8", "#7fb7be", "#d3f3ee", "#e3b5a4"] },
    ui: { cssVars: { "panel-bg": "rgba(10,44,77,0.96)", "panel-fg": "#faf0ca", "panel-border": "#2f5d8a", accent: "#f4d35e" } }
  }
};
function ls(o, e) {
  Te[o] = e;
}
function re(o) {
  return typeof o == "object" && o !== null && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;
}
function se(o, e) {
  if (!re(o) || !re(e)) return e === void 0 ? o : e;
  const t = { ...o };
  for (const [s, i] of Object.entries(e))
    i !== void 0 && (t[s] = re(i) && re(t[s]) ? se(t[s], i) : Array.isArray(i) ? [...i] : i);
  return t;
}
function ce(o = {}) {
  const e = o.theme ?? Se.theme, t = Te[e] ?? {};
  return se(se(Se, t), o);
}
function cs(o) {
  return o;
}
function Re(o, e) {
  const t = o.match;
  return typeof t == "function" ? t(e) : !(t.id !== void 0 && e.id !== t.id || t.group !== void 0 && e.group !== t.group || t.tag !== void 0 && !e.tags?.includes(t.tag) || t.prop && e.props?.[t.prop[0]] !== t.prop[1]);
}
function De(o) {
  const e = /* @__PURE__ */ new Map();
  for (const t of o.nodes) t.group !== void 0 && !e.has(t.group) && e.set(t.group, e.size);
  return e;
}
function Fe(o, e, t) {
  const { aspect: s, opacity: i, ...n } = e.node, r = { ...n };
  if (o.group !== void 0) {
    const a = e.groups.palette, h = e.groups.colors[o.group] ?? (a.length ? a[(t.get(o.group) ?? 0) % a.length] : void 0);
    h && (r.color = h);
  }
  for (const a of e.rules) a.target === "node" && Re(a, o) && Object.assign(r, a.style);
  return o.color && (r.color = o.color), o.shape && (r.shape = o.shape), o.size && o.size > 0 && (r.size = o.size), r;
}
function nt(o, e, t, s) {
  const { color: i, width: n, dashed: r } = t.edge, a = { color: i, width: n, dashed: r }, h = t.edge.widthByWeight;
  if (h.enabled) {
    const c = s.max > s.min ? (e - s.min) / (s.max - s.min) : 0;
    a.width = h.min + (h.max - h.min) * Math.max(0, Math.min(1, c));
  }
  for (const c of t.rules) c.target === "edge" && Re(c, o) && Object.assign(a, c.style);
  return o.color && (a.color = o.color), o.width && o.width > 0 && (a.width = o.width), o.dashed !== void 0 && (a.dashed = o.dashed), a.width = Math.round(a.width * 2) / 2, a;
}
function he(o) {
  const e = {};
  for (const [t, s] of Object.entries(o)) s !== void 0 && (e[t] = s);
  return e;
}
class oe {
  directed = !1;
  meta = {};
  warnings = [];
  nodes = /* @__PURE__ */ new Map();
  edges = [];
  edgeIds = /* @__PURE__ */ new Set();
  hasNode(e) {
    return this.nodes.has(e);
  }
  node(e) {
    return this.nodes.get(e);
  }
  addNode(e, t = {}) {
    const s = this.nodes.get(e);
    if (s)
      return Object.assign(s, he(t), { id: e }), s;
    const i = { ...he(t), id: e };
    return this.nodes.set(e, i), i;
  }
  ensureNode(e) {
    return this.nodes.get(e) ?? this.addNode(e);
  }
  addEdge(e, t, s = {}) {
    this.ensureNode(e), this.ensureNode(t);
    let i = s.id;
    if (!i || this.edgeIds.has(i)) {
      let r = this.edges.length + 1;
      for (; this.edgeIds.has(`e${r}`); ) r++;
      i = `e${r}`;
    }
    this.edgeIds.add(i);
    const n = { ...he(s), id: i, source: e, target: t };
    return this.edges.push(n), n;
  }
  build() {
    return { directed: this.directed, meta: this.meta, nodes: [...this.nodes.values()], edges: this.edges };
  }
}
function T(o) {
  if (typeof o == "number") return Number.isFinite(o) ? o : void 0;
  if (typeof o == "string" && o.trim() !== "") {
    const e = Number(o);
    return Number.isFinite(e) ? e : void 0;
  }
}
function K(o) {
  if (typeof o == "boolean") return o;
  if (typeof o == "number") return o !== 0;
  if (typeof o == "string") {
    const e = o.trim().toLowerCase();
    if (["true", "1", "yes"].includes(e)) return !0;
    if (["false", "0", "no"].includes(e)) return !1;
  }
}
function te(o) {
  if (!o) return;
  const e = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(o.trim());
  if (!e) return;
  let t = e[1];
  return t.length === 3 && (t = [...t].map((s) => s + s).join("")), "#" + t.slice(0, 6).toUpperCase();
}
function rt(o, e) {
  const t = [];
  let s = [], i = "", n = !1;
  for (let r = 0; r < o.length; r++) {
    const a = o[r];
    n ? a === '"' ? o[r + 1] === '"' ? (i += '"', r++) : n = !1 : i += a : a === '"' && i === "" ? n = !0 : a === e ? (s.push(i), i = "") : a === `
` || a === "\r" ? (a === "\r" && o[r + 1] === `
` && r++, s.push(i), i = "", s.some((h) => h.trim() !== "") && t.push(s), s = []) : i += a;
  }
  return s.push(i), s.some((r) => r.trim() !== "") && t.push(s), t;
}
const at = {
  source: "source",
  from: "source",
  src: "source",
  target: "target",
  to: "target",
  dst: "target",
  dest: "target",
  weight: "weight",
  value: "weight",
  w: "weight",
  label: "label",
  url: "url",
  directed: "directed",
  group: "group"
};
function dt(o, e = !1) {
  const t = o.split(/\r?\n/, 1)[0] ?? "", s = [",", ";", "	"].map((d) => ({ d, n: t.split(d).length })).sort((d, l) => l.n - d.n)[0].d, i = rt(o, s), n = new oe();
  if (n.directed = e, i.length === 0) return { graph: n.build(), warnings: ["Empty file"], format: "csv" };
  const r = i[0].map((d) => at[d.trim().toLowerCase()]), a = r.includes("source") && r.includes("target"), h = a ? r : ["source", "target", "weight", "label"];
  for (const d of a ? i.slice(1) : i) {
    const l = {};
    if (h.forEach((p, y) => {
      p && d[y] !== void 0 && (l[p] = d[y].trim());
    }), !l.source) continue;
    if (!l.target) {
      n.addNode(l.source, { label: l.label || void 0, url: l.url || void 0, group: l.group || void 0 });
      continue;
    }
    let u = T(l.weight), f = l.label || void 0;
    !a && u === void 0 && l.weight && (f = l.weight, u = void 0), n.addEdge(l.source, l.target, { weight: u, label: f, url: l.url || void 0, directed: K(l.directed) });
  }
  const c = n.build();
  for (const d of c.edges) d.directed === c.directed && delete d.directed;
  return { graph: c, warnings: n.warnings, format: "csv" };
}
const Ce = (o) => {
  const e = o === void 0 ? "" : String(o);
  return /[",\n\r;]/.test(e) ? `"${e.replace(/"/g, '""')}"` : e;
};
function lt(o) {
  const e = ["source,target,weight,label,url,directed"], t = /* @__PURE__ */ new Set();
  for (const s of o.edges)
    t.add(s.source), t.add(s.target), e.push([s.source, s.target, s.weight ?? 1, s.label, s.url, s.directed ?? o.directed].map(Ce).join(","));
  for (const s of o.nodes) t.has(s.id) || e.push([s.id, "", "", s.label, s.url, ""].map(Ce).join(","));
  return e.join(`
`) + `
`;
}
function ct(o) {
  const e = [], t = /-?(?:\d+\.?\d*|\.\d+)/y, s = /[A-Za-z_\u0080-\uffff][A-Za-z_0-9\u0080-\uffff]*/y, i = o.length;
  let n = 0;
  for (; n < i; ) {
    const r = o[n];
    if (/\s/.test(r)) n++;
    else if (r === "/" && o[n + 1] === "/") {
      const a = o.indexOf(`
`, n);
      n = a < 0 ? i : a + 1;
    } else if (r === "/" && o[n + 1] === "*") {
      const a = o.indexOf("*/", n + 2);
      n = a < 0 ? i : a + 2;
    } else if (r === "#" && (n === 0 || o[n - 1] === `
`)) {
      const a = o.indexOf(`
`, n);
      n = a < 0 ? i : a + 1;
    } else if (r === '"') {
      let a = n + 1, h = "";
      for (; a < i && o[a] !== '"'; )
        o[a] === "\\" && o[a + 1] === '"' ? (h += '"', a += 2) : o[a] === "\\" && o[a + 1] === `
` ? a += 2 : h += o[a++];
      e.push({ t: "str", v: h }), n = a + 1;
    } else if (r === "<") {
      let a = 0, h = n;
      for (; h < i; h++)
        if (o[h] === "<") a++;
        else if (o[h] === ">" && --a === 0) break;
      const c = o.slice(n + 1, h).replace(/<br\s*\/?>/gi, `
`).replace(/<[^>]*>/g, "");
      e.push({ t: "str", v: c.trim() }), n = h + 1;
    } else if (r === "-" && (o[n + 1] === ">" || o[n + 1] === "-"))
      e.push({ t: "sym", v: o.slice(n, n + 2) }), n += 2;
    else {
      t.lastIndex = n, s.lastIndex = n;
      const a = t.exec(o), h = s.exec(o);
      a ? (e.push({ t: "id", v: a[0] }), n += a[0].length) : h ? (e.push({ t: "id", v: h[0] }), n += h[0].length) : (e.push({ t: "sym", v: r }), n++);
    }
  }
  return e;
}
const ht = {
  box: "rectangle",
  rect: "rectangle",
  rectangle: "rectangle",
  plaintext: "rectangle",
  plain: "rectangle",
  none: "rectangle",
  square: "square",
  ellipse: "circle",
  oval: "circle",
  circle: "circle",
  doublecircle: "circle",
  point: "circle",
  diamond: "diamond",
  hexagon: "hexagon",
  octagon: "hexagon",
  triangle: "triangle",
  record: "card",
  mrecord: "card"
}, W = (o) => o.replace(/\\n|\\l|\\r/g, `
`);
function Le(o) {
  const e = o.replace(/^\/[a-z0-9]+\//i, "");
  return e.startsWith("#") ? e.slice(0, 7) : e.split(":")[0];
}
class ut {
  constructor(e) {
    this.toks = e;
  }
  p = 0;
  b = new oe();
  warnedBoth = !1;
  peek(e = 0) {
    return this.toks[this.p + e];
  }
  next() {
    const e = this.toks[this.p++];
    if (!e) throw new Error("Unexpected end of DOT input");
    return e;
  }
  isSym(e, t = 0) {
    const s = this.peek(t);
    return !!s && s.t === "sym" && s.v === e;
  }
  parse() {
    this.peek()?.t === "id" && this.peek().v.toLowerCase() === "strict" && this.next();
    const e = this.next().v.toLowerCase();
    if (e !== "graph" && e !== "digraph") throw new Error('Expected "graph" or "digraph"');
    if (this.b.directed = e === "digraph", !this.isSym("{")) {
      const s = this.next().v;
      s && (this.b.meta.title = s);
    }
    if (!this.isSym("{")) throw new Error('Expected "{"');
    this.next();
    const t = { nodeDef: {}, edgeDef: {} };
    this.stmtList(t), t.label && !this.b.meta.title && (this.b.meta.title = W(t.label));
  }
  attrList() {
    const e = {};
    for (; this.isSym("["); ) {
      for (this.next(); !this.isSym("]"); ) {
        const t = this.next();
        if (t.t === "sym") continue;
        let s = "true";
        this.isSym("=") && (this.next(), s = this.next().v), e[t.v] = s;
      }
      this.next();
    }
    return e;
  }
  stmtList(e) {
    const t = /* @__PURE__ */ new Set();
    for (; this.peek(); ) {
      const s = this.peek();
      if (s.t === "sym" && (s.v === ";" || s.v === ",")) {
        this.next();
        continue;
      }
      if (s.t === "sym" && s.v === "}")
        return this.next(), t;
      const i = s.v.toLowerCase();
      if (s.t === "id" && (i === "node" || i === "edge" || i === "graph") && this.isSym("[", 1)) {
        this.next();
        const h = this.attrList();
        i === "node" ? Object.assign(e.nodeDef, h) : i === "edge" ? Object.assign(e.edgeDef, h) : h.label && (e.label = h.label);
        continue;
      }
      if ((s.t === "id" || s.t === "str") && this.isSym("=", 1)) {
        this.next(), this.next();
        const h = this.next().v;
        s.v === "label" && (e.label = h);
        continue;
      }
      const n = [this.operand(e, t)];
      let r = !1;
      for (; this.isSym("->") || this.isSym("--"); )
        this.next(), r = !0, n.push(this.operand(e, t));
      const a = this.attrList();
      if (r)
        for (let h = 0; h + 1 < n.length; h++)
          for (const c of n[h]) for (const d of n[h + 1]) this.addEdge(c, d, { ...e.edgeDef, ...a });
      else
        for (const h of n[0]) this.applyNode(h, a);
    }
    throw new Error('Unterminated DOT block (missing "}")');
  }
  operand(e, t) {
    const s = this.peek();
    if (!s) throw new Error("Unexpected end of DOT input");
    if (s.t === "id" && s.v.toLowerCase() === "subgraph" || s.t === "sym" && s.v === "{") {
      let n = "";
      if (s.t === "id" && (this.next(), this.isSym("{") || (n = this.next().v)), !this.isSym("{")) return [];
      this.next();
      const r = { nodeDef: { ...e.nodeDef }, edgeDef: { ...e.edgeDef } }, a = this.stmtList(r);
      if (/^cluster/i.test(n)) {
        const h = r.label ? W(r.label) : n.replace(/^cluster_?/i, "") || n;
        for (const c of a) {
          const d = this.b.node(c);
          d && d.group === void 0 && (d.group = h);
        }
      }
      return a.forEach((h) => t.add(h)), [...a];
    }
    const i = this.next().v;
    for (; this.isSym(":"); )
      this.next(), this.peek() && this.peek().t !== "sym" && this.next();
    return this.b.hasNode(i) || (this.b.addNode(i), this.applyNode(i, e.nodeDef)), t.add(i), [i];
  }
  applyNode(e, t) {
    const s = this.b.ensureNode(e), i = {};
    t.label !== void 0 && t.label !== "\\N" && (i.label = W(t.label));
    const n = t.fillcolor ?? (t.style?.includes("filled") ? t.color : void 0) ?? t.color;
    n && (i.color = Le(n));
    const r = t.shape ? ht[t.shape.toLowerCase()] : void 0;
    r && (i.shape = r);
    const a = t.URL ?? t.href ?? t.url;
    a && (i.url = a), t.group && (i.group = t.group);
    const h = t.sublabel ?? t.xlabel;
    if (h && (i.sublabel = W(h)), Object.assign(s, i), s.shape === "card" && t.label !== void 0) {
      const c = t.label.replace(/[{}]/g, "").split("|");
      s.label = W(c[0]).trim() || e;
      const d = [];
      c.slice(1).forEach((l, u) => {
        u > 0 && d.push("---"), d.push(...W(l).split(`
`).map((f) => f.trim()).filter(Boolean));
      }), s.body = d;
    }
  }
  addEdge(e, t, s) {
    this.b.hasNode(e) || this.b.addNode(e), this.b.hasNode(t) || this.b.addNode(t);
    const i = s.dir?.toLowerCase();
    let n = this.b.directed, r = e, a = t;
    i === "none" ? n = !1 : i === "forward" ? n = !0 : i === "back" ? (n = !0, r = t, a = e) : i === "both" && (n = !1, this.warnedBoth || (this.b.warnings.push("Edges with dir=both were imported as undirected"), this.warnedBoth = !0));
    const h = {
      weight: T(s.weight),
      label: s.label ? W(s.label) : void 0,
      url: s.URL ?? s.href ?? s.url,
      color: s.color ? Le(s.color) : void 0,
      dashed: s.style && /dashed|dotted/.test(s.style) ? !0 : void 0,
      width: T(s.penwidth)
    }, c = this.b.addEdge(r, a, h);
    n !== this.b.directed && (c.directed = n);
  }
}
function ft(o) {
  const e = new ut(ct(o));
  return e.parse(), { graph: e.b.build(), warnings: e.b.warnings, format: "dot" };
}
const pt = {
  circle: "ellipse",
  square: "square",
  rectangle: "box",
  diamond: "diamond",
  hexagon: "hexagon",
  triangle: "triangle",
  card: "record"
}, U = (o) => `"${o.replace(/"/g, '\\"').replace(/\r?\n/g, "\\n")}"`;
function gt(o) {
  const e = [`${o.directed ? "digraph" : "graph"} ${U(o.meta?.title ?? "G")} {`];
  for (const s of o.nodes) {
    const i = [];
    if (s.shape === "card") {
      const n = s.body?.indexOf("---") ?? -1, r = n < 0 ? s.body ?? [] : (s.body ?? []).slice(0, n), a = n < 0 ? [] : (s.body ?? []).slice(n + 1), h = (c) => c.join("\\l") + (c.length ? "\\l" : "");
      i.push(`label=${U(`{${s.label ?? s.id}|${h(r)}|${h(a)}}`).replace(/\\\\l/g, "\\l")}`, "shape=record");
    } else
      s.label !== void 0 && i.push(`label=${U(s.label)}`), s.shape && i.push(`shape=${pt[s.shape]}`);
    s.sublabel && i.push(`sublabel=${U(s.sublabel)}`), s.color && i.push(`fillcolor=${U(s.color)}`, "style=filled"), s.url && i.push(`URL=${U(s.url)}`), s.group && i.push(`group=${U(s.group)}`), e.push(`  ${U(s.id)}${i.length ? ` [${i.join(", ")}]` : ""};`);
  }
  const t = o.directed ? "->" : "--";
  for (const s of o.edges) {
    const i = [];
    s.weight !== void 0 && i.push(`weight=${s.weight}`), s.label && i.push(`label=${U(s.label)}`), s.url && i.push(`URL=${U(s.url)}`), s.color && i.push(`color=${U(s.color)}`), s.dashed && i.push("style=dashed"), s.width && i.push(`penwidth=${s.width}`), s.directed !== void 0 && s.directed !== o.directed && i.push(`dir=${s.directed ? "forward" : "none"}`), e.push(`  ${U(s.source)} ${t} ${U(s.target)}${i.length ? ` [${i.join(", ")}]` : ""};`);
  }
  return e.push("}"), e.join(`
`) + `
`;
}
const mt = (o) => o.replace(/&quot;/g, '"').replace(/&amp;/g, "&"), yt = (o) => o.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
function bt(o) {
  const e = o.replace(/^\s*#.*$/gm, ""), t = /\s*(\[|\]|"[^"]*"|[^\s[\]"]+)/y, s = [];
  let i;
  for (t.lastIndex = 0; (i = t.exec(e)) !== null; ) s.push(i[1]);
  return s;
}
function Ue(o, e, t) {
  const s = [];
  for (; e.i < o.length; ) {
    const i = o[e.i++];
    if (i === "]") {
      if (t) throw new Error('Unexpected "]" in GML');
      return s;
    }
    const n = o[e.i++];
    if (n === void 0) throw new Error("Unexpected end of GML");
    n === "[" ? s.push([i, Ue(o, e, !1)]) : n.startsWith('"') ? s.push([i, mt(n.slice(1, -1))]) : s.push([i, T(n) ?? n]);
  }
  if (!t) throw new Error("Unterminated list in GML");
  return s;
}
const me = (o, e) => o.find(([t]) => t === e)?.[1], R = (o, e) => {
  const t = me(o, e);
  return typeof t == "string" || typeof t == "number" ? String(t) : void 0;
}, B = (o, e) => {
  const t = me(o, e);
  return typeof t == "number" ? t : typeof t == "string" ? T(t) : void 0;
}, $e = (o, e) => {
  const t = me(o, e);
  return Array.isArray(t) ? t : void 0;
};
function wt(o) {
  const e = Ue(bt(o), { i: 0 }, !0), t = $e(e, "graph");
  if (!t) throw new Error("GML document contains no graph [ ... ]");
  const s = new oe();
  s.directed = B(t, "directed") === 1;
  const i = R(t, "label");
  i && (s.meta.title = i);
  for (const [a, h] of t) {
    if (a !== "node" || !Array.isArray(h)) continue;
    const c = R(h, "gsId"), d = c ?? R(h, "id");
    if (d === void 0) {
      s.warnings.push("Skipped a node without id");
      continue;
    }
    const l = $e(h, "graphics"), u = R(h, "shape"), f = R(h, "body");
    s.addNode(d, {
      label: R(h, "label"),
      sublabel: R(h, "sublabel"),
      x: l ? B(l, "x") : void 0,
      y: l ? B(l, "y") : void 0,
      z: l ? B(l, "z") : void 0,
      group: R(h, "group"),
      url: R(h, "url"),
      color: R(h, "color") ?? (l ? R(l, "fill") : void 0),
      size: B(h, "size"),
      shape: u && ge.includes(u) ? u : void 0,
      body: f ? f.split(`
`) : void 0
    }), c !== void 0 && (s.node(d)._gml = R(h, "id"));
  }
  const n = /* @__PURE__ */ new Map();
  for (const a of s.build().nodes) {
    const h = a._gml;
    h !== void 0 && n.set(h, a.id), delete a._gml;
  }
  const r = (a) => a === void 0 ? void 0 : n.get(a) ?? a;
  for (const [a, h] of t) {
    if (a !== "edge" || !Array.isArray(h)) continue;
    const c = r(R(h, "source")), d = r(R(h, "target"));
    if (c === void 0 || d === void 0) {
      s.warnings.push("Skipped an edge without source/target");
      continue;
    }
    const l = {
      weight: B(h, "weight") ?? B(h, "value"),
      label: R(h, "label"),
      url: R(h, "url"),
      color: R(h, "color")
    }, u = B(h, "directed");
    u !== void 0 && u === 1 !== s.directed && (l.directed = u === 1), s.addEdge(c, d, l);
  }
  return { graph: s.build(), warnings: s.warnings, format: "gml" };
}
function xt(o) {
  const e = (i) => `"${yt(i)}"`, t = /* @__PURE__ */ new Map();
  o.nodes.forEach((i, n) => t.set(i.id, n));
  const s = ["graph [", `  directed ${o.directed ? 1 : 0}`];
  o.meta?.title && s.push(`  label ${e(o.meta.title)}`);
  for (const i of o.nodes)
    s.push("  node [", `    id ${t.get(i.id)}`, `    gsId ${e(i.id)}`), i.label !== void 0 && s.push(`    label ${e(i.label)}`), i.sublabel && s.push(`    sublabel ${e(i.sublabel)}`), (i.x !== void 0 || i.y !== void 0) && s.push(`    graphics [ x ${i.x ?? 0} y ${i.y ?? 0}${i.z !== void 0 ? ` z ${i.z}` : ""} ]`), i.group && s.push(`    group ${e(i.group)}`), i.url && s.push(`    url ${e(i.url)}`), i.color && s.push(`    color ${e(i.color)}`), i.shape && s.push(`    shape ${e(i.shape)}`), i.size !== void 0 && s.push(`    size ${i.size}`), i.body?.length && s.push(`    body ${e(i.body.join(`
`))}`), s.push("  ]");
  for (const i of o.edges)
    s.push("  edge [", `    source ${t.get(i.source)}`, `    target ${t.get(i.target)}`), i.weight !== void 0 && s.push(`    weight ${i.weight}`), i.label && s.push(`    label ${e(i.label)}`), i.url && s.push(`    url ${e(i.url)}`), i.color && s.push(`    color ${e(i.color)}`), i.directed !== void 0 && i.directed !== o.directed && s.push(`    directed ${i.directed ? 1 : 0}`), s.push("  ]");
  return s.push("]"), s.join(`
`) + `
`;
}
const vt = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };
function ue(o) {
  return o.includes("&") ? o.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (e, t) => {
    if (t[0] === "#") {
      const s = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
      return Number.isFinite(s) && s > 0 && s <= 1114111 ? String.fromCodePoint(s) : e;
    }
    return vt[t.toLowerCase()] ?? e;
  }) : o;
}
function D(o) {
  return o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Mt(o) {
  const e = { name: "#root", attrs: {}, children: [], text: "" }, t = [e], s = /<(\/?)([^\s/>!?]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/y, i = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g, n = o.length;
  let r = o.charCodeAt(0) === 65279 ? 1 : 0;
  for (; r < n; ) {
    const a = t[t.length - 1], h = o.indexOf("<", r);
    if (h === -1) {
      a.text += ue(o.slice(r));
      break;
    }
    if (h > r && (a.text += ue(o.slice(r, h))), r = h, o.startsWith("<!--", r)) {
      const c = o.indexOf("-->", r + 4);
      if (c < 0) throw new Error("Unterminated XML comment");
      r = c + 3;
    } else if (o.startsWith("<![CDATA[", r)) {
      const c = o.indexOf("]]>", r);
      if (c < 0) throw new Error("Unterminated CDATA section");
      a.text += o.slice(r + 9, c), r = c + 3;
    } else if (o.startsWith("<?", r)) {
      const c = o.indexOf("?>", r);
      if (c < 0) throw new Error("Unterminated processing instruction");
      r = c + 2;
    } else if (o.startsWith("<!", r)) {
      let c = 0, d = r + 2;
      for (; d < n; d++) {
        const l = o[d];
        if (l === "[") c++;
        else if (l === "]") c--;
        else if (l === ">" && c <= 0) break;
      }
      r = d + 1;
    } else {
      s.lastIndex = r;
      const c = s.exec(o);
      if (!c) throw new Error(`Malformed XML near offset ${r}`);
      if (r = s.lastIndex, c[1]) {
        if (t.length < 2 || t[t.length - 1].name !== c[2]) throw new Error(`Unexpected closing tag </${c[2]}>`);
        t.pop();
      } else {
        const d = {};
        i.lastIndex = 0;
        let l;
        for (; (l = i.exec(c[3])) !== null; ) d[l[1]] = ue(l[2] ?? l[3] ?? "");
        const u = { name: c[2], attrs: d, children: [], text: "" };
        a.children.push(u), c[4] || t.push(u);
      }
    }
  }
  if (t.length !== 1) throw new Error(`Unclosed XML element <${t[t.length - 1].name}>`);
  if (e.children.length === 0) throw new Error("Empty XML document");
  return e.children[0];
}
const H = (o) => o.name.slice(o.name.indexOf(":") + 1);
function ee(o, e) {
  return o.children.filter((t) => H(t) === e);
}
function G(o, e) {
  for (const t of o.children) {
    if (e(t)) return t;
    const s = G(t, e);
    if (s) return s;
  }
}
const Et = /* @__PURE__ */ new Set(["ShapeNode", "GenericNode", "ImageNode", "SVGNode", "UMLClassNode", "GroupNode", "GenericGroupNode", "TableNode"]), kt = /* @__PURE__ */ new Set(["PolyLineEdge", "ArcEdge", "QuadCurveEdge", "SplineEdge", "BezierEdge", "GenericEdge", "ImageEdge"]), Ne = /* @__PURE__ */ new Set(["GroupNode", "GenericGroupNode"]), St = {
  rectangle: "rectangle",
  rectangle3d: "rectangle",
  roundrectangle: "rectangle",
  parallelogram: "rectangle",
  ellipse: "circle",
  diamond: "diamond",
  hexagon: "hexagon",
  octagon: "hexagon",
  triangle: "triangle",
  trapezoid: "triangle",
  trapezoid2: "triangle",
  fatarrow: "triangle",
  fatarrow2: "triangle"
}, V = (o) => o ? (o.text + o.children.map((e) => V(e)).join("")).trim() : "", _ = (o) => (e) => H(e) === o;
function Ct(o, e) {
  return e === "boolean" ? o.trim().toLowerCase() === "true" : ["int", "long", "float", "double"].includes(e) ? T(o) ?? o : o;
}
function fe(o) {
  return Math.round(o * 100) / 100;
}
function Lt(o, e = {}) {
  const t = Mt(o);
  if (H(t) !== "graphml") throw new Error("Not a GraphML document (missing <graphml> root)");
  const s = e.scale ?? 0.5, i = /* @__PURE__ */ new Map();
  for (const f of ee(t, "key"))
    i.set(f.attrs.id, {
      id: f.attrs.id,
      name: f.attrs["attr.name"] ?? "",
      type: f.attrs["attr.type"] ?? "string",
      target: f.attrs.for ?? "all",
      yType: f.attrs["yfiles.type"]
    });
  const n = ee(t, "graph")[0];
  if (!n) throw new Error("GraphML document contains no <graph>");
  const r = new oe();
  r.directed = n.attrs.edgedefault === "directed";
  const a = [], h = (f, p) => {
    for (const y of f.children) {
      const w = H(y);
      if (w === "node") {
        const E = r.addNode(y.attrs.id, { group: p });
        d(y, E);
        const g = ee(y, "graph")[0];
        if (g) {
          const m = E.label?.split(`
`)[0] || E.id;
          E.tags?.includes("group") || (E.tags = [...E.tags ?? [], "group"]), h(g, m);
        }
      } else w === "edge" ? a.push(y) : w === "hyperedge" && r.warnings.push("Hyperedges are not supported and were skipped");
    }
  }, c = (f, p, y, w) => {
    const E = p.name.toLowerCase(), g = y.trim(), m = f;
    switch (E) {
      case "label":
        m.label === void 0 && g && (m.label = g);
        return;
      case "url":
      case "href":
      case "link":
        g && (m.url = g);
        return;
      case "color":
        g && (m.color = g);
        return;
      case "group":
        g && (m.group = g);
        return;
      case "sublabel":
        w && g && (m.sublabel = g);
        return;
      case "weight":
      case "value":
        w || (m.weight = T(g));
        return;
      case "x":
      case "y":
      case "z":
      case "size": {
        const M = T(g);
        w && M !== void 0 && (m[E] = M);
        return;
      }
      case "shape":
        w && ge.includes(g) && (m.shape = g);
        return;
      case "directed":
        w || (m.directed = K(g));
        return;
      default:
        p.name && g !== "" && ((f.props ??= {})[p.name] = Ct(g, p.type));
    }
  }, d = (f, p) => {
    for (const y of ee(f, "data")) {
      const w = i.get(y.attrs.key);
      w && (w.yType === "nodegraphics" ? l(y, p) : c(p, w, V(y), !0));
    }
  }, l = (f, p) => {
    const y = G(f, (v) => Et.has(H(v)));
    if (!y) return;
    const w = H(y), E = G(y, _("Geometry"));
    let g = "rectangle";
    if (E) {
      const v = T(E.attrs.width) ?? 30, S = T(E.attrs.height) ?? 30, L = T(E.attrs.x) ?? 0, N = T(E.attrs.y) ?? 0;
      p.x = fe((L + v / 2) * s), p.y = fe(-(N + S / 2) * s), Ne.has(w) || (p.size = fe(Math.max(Math.min(v, S), 1) * s));
    }
    const m = G(y, _("Fill"));
    if (m && m.attrs.transparent !== "true") {
      const v = te(m.attrs.color);
      v && (p.color = v);
    }
    const M = G(y, _("Shape"));
    M?.attrs.type && (g = St[M.attrs.type.toLowerCase()] ?? g), p.shape = g;
    const b = V(G(y, _("NodeLabel")));
    if (b && (p.label = b), w === "UMLClassNode") {
      p.shape = "card";
      const v = V(G(y, _("AttributeLabel"))), S = V(G(y, _("MethodLabel"))), L = [];
      v && L.push(...v.split(/\r?\n/)), (v || S) && L.push("---"), S && L.push(...S.split(/\r?\n/)), p.body = L;
    } else Ne.has(w) && (p.shape = "rectangle", p.tags = [...p.tags ?? [], "group"]);
  }, u = (f) => {
    let p = f.attrs.source, y = f.attrs.target;
    (!r.hasNode(p) || !r.hasNode(y)) && r.warnings.push(`Edge ${p} -> ${y} references an undeclared node; it was created`);
    const w = { id: f.attrs.id };
    let g = K(f.attrs.directed);
    const m = { id: "", source: p, target: y };
    for (const v of ee(f, "data")) {
      const S = i.get(v.attrs.key);
      if (S)
        if (S.yType === "edgegraphics") {
          const L = G(v, (P) => kt.has(H(P)));
          if (!L) continue;
          const N = G(L, _("Arrows"));
          if (N) {
            const P = (N.attrs.source ?? "none") !== "none", x = (N.attrs.target ?? "none") !== "none";
            P && !x ? ([p, y] = [y, p], g = !0) : g = x && !P;
          }
          const z = G(L, _("LineStyle"));
          if (z) {
            const P = te(z.attrs.color);
            P && P !== "#000000" && (m.color = P), /dash|dot/i.test(z.attrs.type ?? "") && (m.dashed = !0);
            const x = T(z.attrs.width);
            x !== void 0 && Math.abs(x - 1) > 0.01 && (m.width = Math.min(8, Math.max(0.5, x)));
          }
          const O = V(G(L, _("EdgeLabel")));
          O && (m.label = O);
        } else c(m, S, V(v), !1);
    }
    e.numericLabelsAsWeights && m.label !== void 0 && m.weight === void 0 && /^-?\d+(\.\d+)?$/.test(m.label) && (m.weight = Number(m.label), delete m.label);
    const M = r.addEdge(p, y, { ...m, id: w.id, directed: void 0 }), b = g ?? r.directed;
    b !== r.directed && (M.directed = b);
  };
  h(n);
  for (const f of a) u(f);
  return { graph: r.build(), warnings: r.warnings, format: "graphml" };
}
const $t = {
  circle: "ellipse",
  square: "rectangle",
  rectangle: "rectangle",
  diamond: "diamond",
  hexagon: "hexagon",
  triangle: "triangle",
  card: "rectangle"
};
function Nt(o, e = {}) {
  const t = e.scale ?? 0.5, s = e.defaultSize ?? 14, i = [], n = (d, l, u) => {
    let f = i.find((p) => p.target === d && p.name === l);
    return f || (f = { id: `k${i.length + 2}`, target: d, name: l, type: u }, i.push(f)), f.id;
  }, r = (d) => typeof d == "number" ? "double" : typeof d == "boolean" ? "boolean" : "string", a = [];
  for (const d of o.nodes) {
    const l = d.size ?? s, u = d.shape ?? "circle", f = (u === "rectangle" ? l * 1.6 : u === "card" ? Math.max(l * 3, 60) : l) / t, p = (u === "card" ? Math.max(l * 3, 40) : l) / t, y = (d.x ?? 0) / t - f / 2, w = -(d.y ?? 0) / t - p / 2, E = te(d.color) ?? "#CCCCFF", g = D(d.label ?? d.id);
    let m;
    if (u === "card") {
      const b = (d.body ?? []).indexOf("---"), v = (b < 0 ? d.body ?? [] : (d.body ?? []).slice(0, b)).join(`
`), S = b < 0 ? "" : (d.body ?? []).slice(b + 1).join(`
`);
      m = `<y:UMLClassNode><y:Geometry height="${p}" width="${f}" x="${y}" y="${w}"/><y:Fill color="${E}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${g}</y:NodeLabel><y:UML clipContent="true" omitDetails="false" stereotype="" use3DEffect="false"><y:AttributeLabel>${D(v)}</y:AttributeLabel><y:MethodLabel>${D(S)}</y:MethodLabel></y:UML></y:UMLClassNode>`;
    } else
      m = `<y:ShapeNode><y:Geometry height="${p}" width="${f}" x="${y}" y="${w}"/><y:Fill color="${E}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${g}</y:NodeLabel><y:Shape type="${$t[u]}"/></y:ShapeNode>`;
    const M = [`<data key="d0">${m}</data>`];
    d.url && M.push(`<data key="${n("node", "url", "string")}">${D(d.url)}</data>`), d.group && M.push(`<data key="${n("node", "group", "string")}">${D(d.group)}</data>`), d.sublabel && M.push(`<data key="${n("node", "sublabel", "string")}">${D(d.sublabel)}</data>`), d.z !== void 0 && M.push(`<data key="${n("node", "z", "double")}">${d.z}</data>`), d.color && !te(d.color) && M.push(`<data key="${n("node", "color", "string")}">${D(d.color)}</data>`);
    for (const [b, v] of Object.entries(d.props ?? {})) M.push(`<data key="${n("node", b, r(v))}">${D(String(v))}</data>`);
    a.push(`    <node id="${D(d.id)}">
      ${M.join(`
      `)}
    </node>`);
  }
  const h = [];
  for (const d of o.edges) {
    const l = d.directed ?? o.directed, u = te(d.color) ?? "#000000", f = d.label ? `<y:EdgeLabel>${D(d.label)}</y:EdgeLabel>` : "", y = [`<data key="d1">${`<y:PolyLineEdge><y:Path sx="0.0" sy="0.0" tx="0.0" ty="0.0"/><y:LineStyle color="${u}" type="${d.dashed ? "dashed" : "line"}" width="${d.width ?? 1}"/><y:Arrows source="none" target="${l ? "standard" : "none"}"/>${f}</y:PolyLineEdge>`}</data>`];
    d.weight !== void 0 && y.push(`<data key="${n("edge", "weight", "double")}">${d.weight}</data>`), d.url && y.push(`<data key="${n("edge", "url", "string")}">${D(d.url)}</data>`), d.group && y.push(`<data key="${n("edge", "group", "string")}">${D(d.group)}</data>`);
    for (const [w, E] of Object.entries(d.props ?? {})) y.push(`<data key="${n("edge", w, r(E))}">${D(String(E))}</data>`);
    h.push(`    <edge id="${D(d.id)}" source="${D(d.source)}" target="${D(d.target)}">
      ${y.join(`
      `)}
    </edge>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:y="http://www.yworks.com/xml/graphml" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd">
${[
    '  <key for="node" id="d0" yfiles.type="nodegraphics"/>',
    '  <key for="edge" id="d1" yfiles.type="edgegraphics"/>',
    ...i.map((d) => `  <key attr.name="${D(d.name)}" attr.type="${d.type}" for="${d.target}" id="${d.id}"/>`)
  ].join(`
`)}
  <graph id="G" edgedefault="${o.directed ? "directed" : "undirected"}">
${a.join(`
`)}
${h.join(`
`)}
  </graph>
</graphml>
`;
}
const q = (o) => typeof o == "object" && o !== null && !Array.isArray(o), F = (o) => o == null ? void 0 : String(o), zt = /* @__PURE__ */ new Set(["id", "name", "key", "index", "vx", "vy", "vz", "fx", "fy", "fz", "source", "target", "from", "to", "value", "w"]);
function Ge(o, e) {
  const t = {};
  for (const [s, i] of Object.entries(o))
    e.has(s) || zt.has(s) || (typeof i == "string" || typeof i == "number" || typeof i == "boolean") && (t[s] = i);
  return Object.keys(t).length ? t : void 0;
}
const At = /* @__PURE__ */ new Set(["label", "sublabel", "x", "y", "z", "group", "tags", "url", "color", "shape", "size", "body", "pinned", "props"]), It = /* @__PURE__ */ new Set(["weight", "directed", "label", "url", "color", "width", "dashed", "group", "props"]);
function Pt(o) {
  const e = F(o.shape);
  return {
    label: F(o.label ?? o.name),
    sublabel: F(o.sublabel),
    x: T(o.x),
    y: T(o.y),
    z: T(o.z),
    group: F(o.group),
    tags: Array.isArray(o.tags) ? o.tags.map(String) : void 0,
    url: F(o.url),
    color: F(o.color),
    shape: e && ge.includes(e) ? e : void 0,
    size: T(o.size),
    body: Array.isArray(o.body) ? o.body.map(String) : void 0,
    pinned: K(o.pinned),
    props: q(o.props) ? o.props : Ge(o, At)
  };
}
function Ot(o) {
  return {
    id: F(o.id),
    weight: T(o.weight ?? o.value ?? o.w),
    directed: K(o.directed),
    label: F(o.label),
    url: F(o.url),
    color: F(o.color),
    width: T(o.width),
    dashed: K(o.dashed),
    group: F(o.group),
    props: q(o.props) ? o.props : Ge(o, It)
  };
}
function Tt(o) {
  const e = JSON.parse(o);
  if (!q(e)) throw new Error("JSON graph must be an object");
  const t = new oe();
  let s = [], i = [];
  if (q(e.elements)) {
    const a = (h) => Array.isArray(h) ? h.map((c) => q(c) && q(c.data) ? c.data : c) : [];
    s = a(e.elements.nodes), i = a(e.elements.edges);
  } else
    s = Array.isArray(e.nodes) ? e.nodes : [], i = Array.isArray(e.edges) ? e.edges : Array.isArray(e.links) ? e.links : [];
  if (t.directed = K(e.directed) ?? !1, q(e.meta)) {
    const a = F(e.meta.dimension);
    t.meta = { title: F(e.meta.title), description: F(e.meta.description), dimension: a === "3d" ? "3d" : a === "2d" ? "2d" : void 0 };
  }
  const n = [];
  s.forEach((a, h) => {
    const c = q(a) ? a : { id: a }, d = F(c.id ?? c.name ?? c.key) ?? `n${h + 1}`;
    n.push(d), t.addNode(d, Pt(c));
  });
  const r = (a) => q(a) ? F(a.id ?? a.name ?? a.key) : typeof a == "number" && !t.hasNode(String(a)) && n[a] !== void 0 ? n[a] : F(a);
  for (const a of i) {
    if (!q(a)) continue;
    const h = r(a.source ?? a.from), c = r(a.target ?? a.to);
    if (h === void 0 || c === void 0) {
      t.warnings.push("Skipped an edge without source or target");
      continue;
    }
    (!t.hasNode(h) || !t.hasNode(c)) && t.warnings.push(`Edge ${h} -> ${c} referenced unknown nodes; they were created`), t.addEdge(h, c, Ot(a));
  }
  return { graph: t.build(), warnings: t.warnings, format: "json" };
}
function Rt(o) {
  return JSON.stringify({ format: "graphscape", version: 1, ...o }, null, 2);
}
const Dt = [
  { id: "json", label: "Graphscape JSON (also D3 / Cytoscape)", extensions: ["json"], mime: "application/json" },
  { id: "graphml", label: "GraphML (yEd)", extensions: ["graphml", "xml"], mime: "application/xml" },
  { id: "gml", label: "GML", extensions: ["gml"], mime: "text/plain" },
  { id: "dot", label: "Graphviz DOT", extensions: ["dot", "gv"], mime: "text/vnd.graphviz" },
  { id: "csv", label: "CSV edge list", extensions: ["csv", "tsv", "txt"], mime: "text/csv" }
];
function Ft(o, e) {
  const t = e?.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  if (t) {
    for (const i of Dt) if (i.id !== "csv" && i.extensions.includes(t)) return i.id;
  }
  const s = o.replace(/^\uFEFF/, "").trimStart();
  return s.startsWith("{") || s.startsWith("[") ? "json" : /^<\?xml|^<graphml/i.test(s) || /<graphml[\s>]/i.test(s.slice(0, 2e3)) ? "graphml" : /(^|\n)\s*graph\s*\[/.test(s.replace(/^\s*#.*$/gm, "")) ? "gml" : /^(strict\s+)?(di)?graph\b[^[{]*\{/i.test(s.replace(/^(\s*(\/\/.*|#.*|\/\*[\s\S]*?\*\/)\s*)+/, "")) ? "dot" : "csv";
}
function hs(o, e = {}) {
  const t = e.format ?? Ft(o, e.filename), s = o.replace(/^\uFEFF/, "");
  switch (t) {
    case "json":
      return Tt(s);
    case "graphml":
      return Lt(s, { scale: e.scale, numericLabelsAsWeights: e.numericLabelsAsWeights });
    case "gml":
      return wt(s);
    case "dot":
      return ft(s);
    case "csv":
      return dt(s, e.directed ?? !1);
  }
}
function us(o, e) {
  switch (e) {
    case "json":
      return Rt(o);
    case "graphml":
      return Nt(o);
    case "gml":
      return xt(o);
    case "dot":
      return gt(o);
    case "csv":
      return lt(o);
  }
}
function qe(o) {
  return o === "circle" || o === "diamond" || o === "hexagon" || o === "triangle";
}
function ye(o, e, t, s) {
  const i = e / 2;
  return { hw: o === "rectangle" ? i * t : i, hh: i };
}
function pe(o, e, t) {
  const s = o[0] - e.pos[0], i = o[1] - e.pos[1];
  if (t) {
    const n = o[2] - e.pos[2];
    return s * s + i * i + n * n < e.hw * e.hw;
  }
  return e.ellipse ? s * s / (e.hw * e.hw) + i * i / (e.hh * e.hh) < 1 : Math.abs(s) < e.hw && Math.abs(i) < e.hh;
}
const be = (o, e, t) => [o[0] + (e[0] - o[0]) * t, o[1] + (e[1] - o[1]) * t, o[2] + (e[2] - o[2]) * t], Q = (o, e) => Math.hypot(o[0] - e[0], o[1] - e[1], o[2] - e[2]);
function je(o, e, t, s) {
  const i = [];
  for (let n = 0; n <= s; n++) {
    const r = n / s, a = 1 - r;
    i.push([
      a * a * o[0] + 2 * a * r * e[0] + r * r * t[0],
      a * a * o[1] + 2 * a * r * e[1] + r * r * t[1],
      a * a * o[2] + 2 * a * r * e[2] + r * r * t[2]
    ]);
  }
  return i;
}
function _e(o, e, t) {
  let s = [e, -o, 0], i = Math.hypot(s[0], s[1], s[2]);
  return i < 1e-9 && (s = [-t, 0, o], i = Math.hypot(s[0], s[1], s[2])), i < 1e-9 ? [0, 1, 0] : [s[0] / i, s[1] / i, s[2] / i];
}
function Ut(o, e, t) {
  const s = Math.max(o.hw, o.hh), i = s * t.loopScale * (1 + 0.5 * e), n = e * (Math.PI / 3), r = s + i * 0.35, a = o.pos[0] - Math.sin(n) * r, h = o.pos[1] + Math.cos(n) * r, c = n - Math.PI / 2, d = 0.35, l = Math.max(12, t.segments * 2), u = [];
  for (let f = 0; f <= l; f++) {
    const p = c + d + f / l * (2 * Math.PI - 2 * d);
    u.push([a + i * Math.cos(p), h + i * Math.sin(p), o.pos[2]]);
  }
  return u;
}
function we(o, e, t) {
  let s = 0;
  for (; s < o.length && pe(o[s], e, t); ) s++;
  if (s === 0 || s >= o.length) return o;
  let i = o[s - 1], n = o[s];
  for (let r = 0; r < 18; r++) {
    const a = be(i, n, 0.5);
    pe(a, e, t) ? i = a : n = a;
  }
  return [n, ...o.slice(s)];
}
function Be(o, e, t) {
  return we([...o].reverse(), e, t).reverse();
}
function We(o, e, t, s, i, n, r) {
  let a;
  if (n)
    a = Ut(o, t, r);
  else {
    const h = (t - (s - 1) / 2) * r.spacing * (i ? -1 : 1);
    if (Math.abs(h) < 1e-6) a = [o.pos, e.pos];
    else {
      const c = e.pos[0] - o.pos[0], d = e.pos[1] - o.pos[1], l = r.dim3 ? e.pos[2] - o.pos[2] : 0, u = _e(c, d, l), f = [(o.pos[0] + e.pos[0]) / 2, (o.pos[1] + e.pos[1]) / 2, (o.pos[2] + e.pos[2]) / 2], p = [f[0] + u[0] * 2 * h, f[1] + u[1] * 2 * h, f[2] + u[2] * 2 * h];
      a = je(o.pos, p, e.pos, r.segments);
    }
  }
  return a = we(a, o, r.dim3), a = Be(a, e, r.dim3), a;
}
function xe(o) {
  let e = 0;
  for (let t = 1; t < o.length; t++) e += Q(o[t - 1], o[t]);
  return e;
}
function Ve(o, e) {
  if (o.length < 2 || xe(o) <= e * 1.2) return o;
  const t = o.slice();
  let s = e;
  for (; t.length >= 2; ) {
    const i = t[t.length - 2], n = t[t.length - 1], r = Q(i, n);
    if (r > s + 1e-9)
      return t[t.length - 1] = be(i, n, (r - s) / r), t;
    s -= r, t.pop();
  }
  return o;
}
function He(o, e) {
  const t = xe(o);
  if (t === 0) return o[0];
  let s = t * e;
  for (let i = 1; i < o.length; i++) {
    const n = Q(o[i - 1], o[i]);
    if (s <= n) return be(o[i - 1], o[i], n === 0 ? 0 : s / n);
    s -= n;
  }
  return o[o.length - 1];
}
function Ke(o) {
  const e = o[o.length - 1];
  let t = o.length - 2;
  for (; t > 0 && Q(o[t], e) < 1e-6; ) t--;
  const s = o[Math.max(0, t)], i = Q(s, e) || 1;
  return { tip: e, dir: [(e[0] - s[0]) / i, (e[1] - s[1]) / i, (e[2] - s[2]) / i] };
}
function Xe(o, e, t, s, i, n) {
  const r = i - t, a = n - s, h = r * r + a * a;
  let c = h === 0 ? 0 : ((o - t) * r + (e - s) * a) / h;
  return c = Math.max(0, Math.min(1, c)), Math.hypot(o - (t + c * r), e - (s + c * a));
}
const fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dist3: Q,
  distToSegment: Xe,
  edgePath: We,
  inside: pe,
  isEllipseShape: qe,
  nodeExtents: ye,
  normalTo: _e,
  pathLength: xe,
  pointAtFraction: He,
  quadratic: je,
  shortenEnd: Ve,
  tipOf: Ke,
  trimEnd: Be,
  trimStart: we
}, Symbol.toStringTag, { value: "Module" })), Gt = 0.58, qt = 1.25;
function ae(o, e, t) {
  const s = o.split(`
`).map((i) => Math.min(i.length, t));
  return { w: Math.max(0, ...s) * e * Gt, h: s.length * e * qt };
}
function j(o, e) {
  return o.boxes?.get(e) ?? { w: o.spacing, h: o.spacing };
}
function jt(o, e, t = !1) {
  const s = De(o), i = e.label.show && o.nodes.length <= e.label.maxCount, n = /* @__PURE__ */ new Map();
  for (const r of o.nodes) {
    const a = Fe(r, e, s);
    if (a.shape === "card") {
      const l = ae(r.label ?? r.id, e.card.size, 80), u = ae((r.body ?? []).join(`
`), e.card.size, 80), f = e.card.padding;
      n.set(r.id, { w: Math.max(l.w, u.w) + f * 3, h: (l.h + u.h) * 1.12 + f * 3 });
      continue;
    }
    const h = ye(a.shape, a.size, e.node.aspect);
    let c = h.hw * 2, d = h.hh * 2;
    if (i) {
      const l = ae(r.label ?? r.id, e.label.size, e.label.maxChars), u = r.sublabel ? ae(r.sublabel, e.label.subSize, e.label.maxChars) : { w: 0, h: 0 };
      c = Math.max(c, l.w, u.w), d += e.label.gap + l.h + u.h;
    }
    n.set(r.id, { w: c, h: d });
  }
  return n;
}
class Ye {
  ids;
  pos;
  temperature;
  t0;
  n;
  k;
  dim3;
  disp;
  fixed;
  ea;
  eb;
  es;
  index = /* @__PURE__ */ new Map();
  rnd;
  gravity;
  constructor(e, t) {
    const s = e.nodes;
    this.n = s.length, this.k = t.idealLength, this.dim3 = t.dimension === "3d", this.gravity = t.gravity, this.rnd = ie(t.seed), this.ids = s.map((r) => r.id), this.pos = new Float64Array(this.n * 3), this.disp = new Float64Array(this.n * 3), this.fixed = new Uint8Array(this.n);
    const i = this.k * (this.dim3 ? Math.cbrt(this.n) : Math.sqrt(this.n)) * 0.6 + this.k;
    s.forEach((r, a) => {
      this.index.set(r.id, a), this.pos[3 * a] = r.x ?? (this.rnd() * 2 - 1) * i, this.pos[3 * a + 1] = r.y ?? (this.rnd() * 2 - 1) * i, this.pos[3 * a + 2] = this.dim3 ? r.z ?? (this.rnd() * 2 - 1) * i : r.z ?? 0, r.pinned && (this.fixed[a] = 1);
    });
    const n = e.edges.filter((r) => r.source !== r.target);
    this.ea = new Int32Array(n.length), this.eb = new Int32Array(n.length), this.es = new Float64Array(n.length), n.forEach((r, a) => {
      this.ea[a] = this.index.get(r.source), this.eb[a] = this.index.get(r.target);
      const h = e.weightOf(r);
      this.es[a] = t.weightMode === "strength" ? Math.min(4, Math.max(0.25, Math.sqrt(Math.max(h, 0)))) : 1;
    }), this.t0 = this.k * 2, this.temperature = this.t0;
  }
  /** 1 at the start, approaching 0 when the layout has settled. */
  get alpha() {
    return this.temperature / this.t0;
  }
  /** Fix a node at a position (e.g. while the user drags it). */
  pin(e, t) {
    const s = this.index.get(e);
    s !== void 0 && (this.pos[3 * s] = t[0], this.pos[3 * s + 1] = t[1], this.dim3 && (this.pos[3 * s + 2] = t[2]), this.fixed[s] = 1);
  }
  unpin(e, t = !1) {
    const s = this.index.get(e);
    s !== void 0 && !t && (this.fixed[s] = 0);
  }
  step() {
    const { n: e, k: t, dim3: s, pos: i, disp: n } = this, r = t * t;
    n.fill(0);
    const a = (c, d, l) => {
      let u = i[3 * c] - i[3 * d], f = i[3 * c + 1] - i[3 * d + 1], p = s ? i[3 * c + 2] - i[3 * d + 2] : 0, y = u * u + f * f + p * p;
      if (y > l) return;
      y < 1e-6 && (u = (this.rnd() - 0.5) * 0.1, f = (this.rnd() - 0.5) * 0.1, p = s ? (this.rnd() - 0.5) * 0.1 : 0, y = u * u + f * f + p * p + 1e-6);
      const w = r / y;
      n[3 * c] += u * w, n[3 * c + 1] += f * w, n[3 * c + 2] += p * w, n[3 * d] -= u * w, n[3 * d + 1] -= f * w, n[3 * d + 2] -= p * w;
    };
    if (e <= 400)
      for (let c = 0; c < e; c++) for (let d = c + 1; d < e; d++) a(c, d, 1 / 0);
    else {
      const c = t * 4, d = c * c, l = (g) => Math.max(-1e3, Math.min(1e3, Math.floor(g / c))), u = (g, m, M) => ((g + 1024) * 2048 + (m + 1024)) * 2048 + (M + 1024), f = /* @__PURE__ */ new Map(), p = new Int16Array(e), y = new Int16Array(e), w = new Int16Array(e);
      for (let g = 0; g < e; g++) {
        p[g] = l(i[3 * g]), y[g] = l(i[3 * g + 1]), w[g] = s ? l(i[3 * g + 2]) : 0;
        const m = u(p[g], y[g], w[g]), M = f.get(m);
        M ? M.push(g) : f.set(m, [g]);
      }
      const E = s ? 1 : 0;
      for (let g = 0; g < e; g++)
        for (let m = -1; m <= 1; m++)
          for (let M = -1; M <= 1; M++)
            for (let b = -E; b <= E; b++) {
              const v = f.get(u(p[g] + m, y[g] + M, w[g] + b));
              if (v)
                for (const S of v) S > g && a(g, S, d);
            }
    }
    for (let c = 0; c < this.ea.length; c++) {
      const d = this.ea[c], l = this.eb[c], u = i[3 * d] - i[3 * l], f = i[3 * d + 1] - i[3 * l + 1], p = s ? i[3 * d + 2] - i[3 * l + 2] : 0, w = Math.sqrt(u * u + f * f + p * p) / t * this.es[c];
      n[3 * d] -= u * w, n[3 * d + 1] -= f * w, n[3 * d + 2] -= p * w, n[3 * l] += u * w, n[3 * l + 1] += f * w, n[3 * l + 2] += p * w;
    }
    const h = this.temperature;
    for (let c = 0; c < e; c++) {
      if (this.fixed[c]) continue;
      n[3 * c] -= i[3 * c] * this.gravity, n[3 * c + 1] -= i[3 * c + 1] * this.gravity, s && (n[3 * c + 2] -= i[3 * c + 2] * this.gravity);
      const d = s ? n[3 * c + 2] : 0, l = Math.sqrt(n[3 * c] ** 2 + n[3 * c + 1] ** 2 + d * d);
      if (l < 1e-9) continue;
      const u = Math.min(l, h) / l;
      i[3 * c] += n[3 * c] * u, i[3 * c + 1] += n[3 * c + 1] * u, s && (i[3 * c + 2] += d * u);
    }
    this.temperature = Math.max(this.temperature * 0.985, this.t0 * 2e-3);
  }
  entries() {
    return this.ids.map((e, t) => [e, [this.pos[3 * t], this.pos[3 * t + 1], this.dim3 ? this.pos[3 * t + 2] : 0]]);
  }
  /** Writes the current positions into the graph (one `position` event). */
  commit(e) {
    e.setPositions(this.entries());
  }
}
function _t(o, e) {
  const t = o.nodes.map((b) => b.id), s = new Map(t.map((b, v) => [b, v])), i = t.length, n = Array.from({ length: i }, () => []);
  for (const b of o.edges) {
    const v = s.get(b.source), S = s.get(b.target);
    v !== S && n[v].push(S);
  }
  const r = new Uint8Array(i), a = Array.from({ length: i }, () => []), h = [];
  for (let b = 0; b < i; b++) {
    if (r[b]) continue;
    const v = [[b, 0]];
    for (r[b] = 1, h.push(b); v.length; ) {
      const S = v[v.length - 1], L = S[0];
      if (S[1] < n[L].length) {
        const N = n[L][S[1]++];
        r[N] === 0 ? (r[N] = 1, h.push(N), a[L].push(N), v.push([N, 0])) : r[N] === 1 ? a[N].push(L) : a[L].push(N);
      } else
        r[L] = 2, v.pop();
    }
  }
  const c = new Int32Array(i);
  for (let b = 0; b < i; b++) for (const v of a[b]) c[v]++;
  const d = new Int32Array(i), l = [];
  for (let b = 0; b < i; b++) c[b] === 0 && l.push(b);
  for (let b = 0; b < l.length; b++) {
    const v = l[b];
    for (const S of a[v])
      d[S] = Math.max(d[S], d[v] + 1), --c[S] === 0 && l.push(S);
  }
  const u = [];
  for (const b of h) (u[d[b]] ??= []).push(b);
  const f = Array.from({ length: i }, () => []);
  for (let b = 0; b < i; b++) for (const v of a[b]) f[v].push(b);
  const p = new Float64Array(i);
  u.forEach((b) => b?.forEach((v, S) => p[v] = S));
  for (let b = 0; b < 8; b++) {
    const v = b % 2 === 0, S = u.map((L, N) => N);
    v || S.reverse();
    for (const L of S.slice(1)) {
      const N = u[L];
      if (!N) continue;
      const z = /* @__PURE__ */ new Map();
      for (const O of N) {
        const P = v ? f[O] : a[O];
        z.set(O, P.length ? P.reduce((x, C) => x + p[C], 0) / P.length : p[O]);
      }
      N.sort((O, P) => z.get(O) - z.get(P)), N.forEach((O, P) => p[O] = P);
    }
  }
  const y = e.direction === "TB", w = (b) => y ? j(e, b).w : j(e, b).h, E = (b) => y ? j(e, b).h : j(e, b).w, g = /* @__PURE__ */ new Map();
  let m = 0, M = 0;
  return u.forEach((b, v) => {
    if (!b) return;
    const S = Math.max(...b.map((z) => E(t[z])));
    m += v === 0 ? S / 2 : M / 2 + e.gap * 2.2 + S / 2, M = S;
    let N = -(b.reduce((z, O) => z + w(t[O]), 0) + e.gap * (b.length - 1)) / 2;
    for (const z of b) {
      const O = w(t[z]), P = N + O / 2;
      N += O + e.gap, g.set(t[z], y ? [P, -m, 0] : [m, -P, 0]);
    }
  }), g;
}
function ve(o) {
  const e = /* @__PURE__ */ new Map();
  for (const t of o.nodes) t.group !== void 0 && !e.has(t.group) && e.set(t.group, e.size);
  return o.nodes.map((t, s) => ({ id: t.id, g: t.group === void 0 ? -1 : e.get(t.group), i: s })).sort((t, s) => t.g - s.g || t.i - s.i).map((t) => t.id);
}
function Me(o, e) {
  const t = j(o, e);
  return Math.hypot(t.w, t.h) * 0.75 + o.gap;
}
function Bt(o, e) {
  const t = ve(o), s = t.map((h) => Me(e, h)), i = s.reduce((h, c) => h + c, 0) || 1, n = Math.max(i / (2 * Math.PI), Math.max(0, ...s) * 0.5 || 1), r = /* @__PURE__ */ new Map();
  let a = 0;
  return t.forEach((h, c) => {
    const d = (a + s[c] / 2) / i * Math.PI * 2 - Math.PI / 2;
    a += s[c], r.set(h, [n * Math.cos(d), n * Math.sin(d), 0]);
  }), r;
}
function Wt(o, e) {
  const t = ve(o), s = t.length;
  let i = 0, n = 0;
  for (const u of t) {
    const f = j(e, u);
    i = Math.max(i, f.w), n = Math.max(n, f.h);
  }
  i += e.gap, n += e.gap;
  const r = !!e.dim3, a = r ? Math.max(1, Math.ceil(Math.cbrt(s))) : Math.max(1, Math.round(Math.sqrt(s * n / i))), h = r ? a : Math.ceil(s / a), c = r ? Math.ceil(s / (a * h)) : 1, d = Math.max(i, n), l = /* @__PURE__ */ new Map();
  return t.forEach((u, f) => {
    const p = f % a, y = Math.floor(f / a) % h, w = r ? Math.floor(f / (a * h)) : 0;
    l.set(u, [(p - (a - 1) / 2) * i, ((h - 1) / 2 - y) * n, r ? (w - (c - 1) / 2) * d : 0]);
  }), l;
}
function Vt(o, e) {
  const t = ve(o), s = t.length, i = t.reduce((h, c) => h + Me(e, c), 0) / Math.max(s, 1) || 1, n = Math.max(i, i * Math.sqrt(s / (4 * Math.PI)) * 1.1), r = Math.PI * (3 - Math.sqrt(5)), a = /* @__PURE__ */ new Map();
  return t.forEach((h, c) => {
    const d = s === 1 ? 0 : 1 - c / (s - 1) * 2, l = Math.sqrt(Math.max(0, 1 - d * d)), u = r * c;
    a.set(h, [Math.cos(u) * l * n, d * n, Math.sin(u) * l * n]);
  }), a;
}
function Ht(o, e) {
  const t = ie(e.seed ?? 1), s = o.nodes.map((a) => a.id), n = (s.reduce((a, h) => a + Me(e, h), 0) / Math.max(s.length, 1) || 1) * Math.sqrt(s.length) * 0.9, r = /* @__PURE__ */ new Map();
  for (const a of s) r.set(a, [(t() * 2 - 1) * n, (t() * 2 - 1) * n, e.dim3 ? (t() * 2 - 1) * n : 0]);
  return r;
}
function Kt(o, e) {
  const t = o.nodes.map((x) => x.id), s = t.length, i = /* @__PURE__ */ new Map();
  if (s === 0) return i;
  const n = new Map(t.map((x, C) => [x, C])), r = Array.from({ length: s }, () => []), a = new Int32Array(s), h = new Int32Array(s);
  for (const x of o.edges) {
    const C = n.get(x.source), $ = n.get(x.target);
    C !== $ && (h[C]++, h[$]++, r[C].push($), o.isDirected(x) ? a[$]++ : r[$].push(C));
  }
  const c = new Int32Array(s).fill(-1), d = new Int32Array(s).fill(-1), l = Array.from({ length: s }, () => []), u = [], f = (x) => {
    u.push(x), d[x] = 0;
    const C = [x];
    for (let $ = 0; $ < C.length; $++) {
      const A = C[$];
      for (const I of r[A])
        d[I] === -1 && (d[I] = d[A] + 1, c[I] = A, l[A].push(I), C.push(I));
    }
  }, p = [...Array(s).keys()].filter((x) => a[x] === 0);
  a.some((x) => x > 0) || p.sort((x, C) => h[C] - h[x] || x - C);
  for (const x of p) d[x] === -1 && f(x);
  const y = (x) => {
    const C = /* @__PURE__ */ new Map([[x, 0]]), $ = [x];
    let A = 0;
    for (let I = 0; I < $.length; I++) {
      const X = $[I];
      for (const J of r[X])
        d[J] !== -1 || C.has(J) || (C.set(J, C.get(X) + 1), A = Math.max(A, C.get(J)), $.push(J));
    }
    return { reach: $.length, height: A };
  };
  for (; ; ) {
    const x = [...Array(s).keys()].filter((A) => d[A] === -1).sort((A, I) => h[I] - h[A] || A - I);
    if (!x.length) break;
    let C = x[0], $ = { reach: -1, height: 0 };
    for (const A of x.slice(0, 8)) {
      const I = y(A);
      (I.reach > $.reach || I.reach === $.reach && I.height < $.height) && (C = A, $ = I);
    }
    f(C);
  }
  const w = e.direction === "TB", E = (x) => w ? j(e, t[x]).w : j(e, t[x]).h, g = (x) => w ? j(e, t[x]).h : j(e, t[x]).w, m = [];
  for (const x of u) {
    const C = [x];
    for (; C.length; ) {
      const $ = C.pop();
      m.push($);
      for (let A = l[$].length - 1; A >= 0; A--) C.push(l[$][A]);
    }
  }
  const M = new Float64Array(s);
  for (let x = m.length - 1; x >= 0; x--) {
    const C = m[x], $ = l[C], A = $.reduce((I, X) => I + M[X], 0) + e.gap * Math.max(0, $.length - 1);
    M[C] = Math.max(E(C), A);
  }
  const b = new Float64Array(s);
  let v = 0;
  for (const x of u)
    b[x] = v, v += M[x] + e.gap * 2;
  const S = v - e.gap * 2;
  for (const x of m) {
    const C = l[x];
    if (!C.length) continue;
    const $ = C.reduce((I, X) => I + M[X], 0) + e.gap * (C.length - 1);
    let A = b[x] + (M[x] - $) / 2;
    for (const I of C)
      b[I] = A, A += M[I] + e.gap;
  }
  const L = new Float64Array(s);
  for (let x = m.length - 1; x >= 0; x--) {
    const C = m[x], $ = l[C];
    L[C] = $.length ? (L[$[0]] + L[$[$.length - 1]]) / 2 : b[C] + M[C] / 2;
  }
  const N = Math.max(...Array.from(d)), z = new Float64Array(N + 1);
  for (let x = 0; x < s; x++) z[d[x]] = Math.max(z[d[x]], g(x));
  const O = new Float64Array(N + 1);
  let P = 0;
  for (let x = 0; x <= N; x++)
    P += x === 0 ? z[0] / 2 : z[x - 1] / 2 + e.gap * 2.2 + z[x] / 2, O[x] = P;
  for (let x = 0; x < s; x++) {
    const C = L[x] - S / 2;
    i.set(t[x], w ? [C, -O[d[x]], 0] : [O[d[x]], -C, 0]);
  }
  return i;
}
const Ze = {
  dimension: "2d",
  spacing: 40,
  gap: 12,
  idealLength: 60,
  gravity: 0.05,
  weightMode: "ignore",
  direction: "TB",
  seed: 1,
  iterations: 300
}, ps = ["force", "tree", "layered", "circle", "grid", "sphere", "random"];
function Xt(o, e, t = {}) {
  const s = { ...Ze, ...t }, i = { spacing: s.spacing, gap: s.gap, boxes: s.boxes, dim3: s.dimension === "3d", seed: s.seed };
  switch (e) {
    case "circle":
      return Bt(o, i);
    case "grid":
      return Wt(o, i);
    case "sphere":
      return Vt(o, i);
    case "random":
      return Ht(o, i);
    case "layered":
      return _t(o, { ...i, direction: s.direction });
    case "tree":
      return Kt(o, { ...i, direction: s.direction });
    case "force": {
      const n = new Ye(o, s);
      for (let r = 0; r < s.iterations && n.alpha > 0.02; r++) n.step();
      return new Map(n.entries());
    }
  }
}
function ze(o, e, t, s) {
  const i = ie(s), n = e === "3d", r = (c) => c.x !== void 0 && c.y !== void 0, a = t * Math.sqrt(Math.max(o.nodes.length, 1)) * 0.6 + t;
  let h = 0;
  for (const c of o.nodes) {
    if (r(c)) {
      c.z === void 0 && (c.z = 0);
      continue;
    }
    let d;
    for (const u of o.edges) {
      const f = u.source === c.id ? o.getNode(u.target) : u.target === c.id ? o.getNode(u.source) : void 0;
      if (f && f !== c && r(f)) {
        d = { x: f.x, y: f.y, z: f.z ?? 0 };
        break;
      }
    }
    const l = d ? t * 0.6 : a;
    c.x = (d?.x ?? 0) + (i() * 2 - 1) * l, c.y = (d?.y ?? 0) + (i() * 2 - 1) * l, c.z = n ? (d?.z ?? 0) + (i() * 2 - 1) * l : d?.z ?? 0, h++;
  }
  return h;
}
const de = 4096;
function Yt(o, e, t, s, i, n) {
  o.beginPath(), typeof o.roundRect == "function" ? o.roundRect(e, t, s, i, n) : o.rect(e, t, s, i);
}
class Zt {
  constructor(e = 4) {
    this.resolution = e;
  }
  map = /* @__PURE__ */ new Map();
  clear() {
    for (const e of this.map.values()) e.texture.dispose();
    this.map.clear();
  }
  make(e) {
    const t = new k.CanvasTexture(e);
    return t.colorSpace = k.SRGBColorSpace, t.anisotropy = 4, t;
  }
  /**
   * Label texture. `text` may contain line breaks; `sub` adds a smaller second block below
   * (its own size and color) that is also allowed to contain line breaks.
   */
  text(e, t, s) {
    const i = JSON.stringify(["t", e, t, s ?? null, this.resolution]), n = this.map.get(i);
    if (n) return n;
    const r = this.resolution, a = (w) => w.length > t.maxChars ? w.slice(0, Math.max(1, t.maxChars - 1)) + "…" : w, h = [
      ...e.split(`
`).map((w) => ({ t: a(w), px: t.size * r, color: t.color })),
      ...s?.text ? s.text.split(`
`).map((w) => ({ t: a(w), px: s.size * r, color: s.color })) : []
    ], c = t.padding * r, d = document.createElement("canvas");
    let l = d.getContext("2d"), u = 0, f = 0;
    for (const w of h)
      l.font = `${w.px}px ${t.font}`, u = Math.max(u, l.measureText(w.t).width), f += w.px * 1.25;
    d.width = Math.min(de, Math.max(2, Math.ceil(u + c * 2))), d.height = Math.min(de, Math.max(2, Math.ceil(f + c * 2))), l = d.getContext("2d"), l.textAlign = "center", l.textBaseline = "middle", t.background && (l.fillStyle = t.background, Yt(l, 0, 0, d.width, d.height, t.size * r * 0.25), l.fill());
    let p = c;
    for (const w of h) {
      const E = w.px * 1.25;
      l.font = `${w.px}px ${t.font}`, l.fillStyle = w.color, l.fillText(w.t, d.width / 2, p + E / 2), p += E;
    }
    const y = { texture: this.make(d), w: d.width / r, h: d.height / r };
    return this.map.set(i, y), y;
  }
  /** UML-like card: title in a header band, body lines below; a line `---` draws a separator. */
  card(e, t, s) {
    const i = s.card, n = e.label ?? e.id, r = e.body ?? [], a = JSON.stringify(["c", n, r, t.color, i, this.resolution]), h = this.map.get(a);
    if (h) return h;
    const c = this.resolution, d = i.size * c, l = d * 1.4, u = i.padding * c, f = document.createElement("canvas").getContext("2d"), p = n.split(`
`);
    f.font = `bold ${d}px ${i.font}`;
    const y = Math.max(...p.map((L) => f.measureText(L).width));
    f.font = `${d}px ${i.font}`;
    const w = r.length ? Math.max(...r.map((L) => L === "---" ? 0 : f.measureText(L).width)) : 0, E = Math.min(de, Math.ceil(Math.max(y, w) + u * 3)), g = p.length * l + u * 1.5, m = r.length ? r.length * l + u * 1.5 : 0, M = Math.min(de, Math.ceil(g + m)), b = document.createElement("canvas");
    b.width = Math.max(2, E), b.height = Math.max(2, M);
    const v = b.getContext("2d");
    v.fillStyle = i.background, v.fillRect(0, 0, b.width, b.height), v.fillStyle = i.headerBackground ?? t.color, v.fillRect(0, 0, b.width, g), v.textBaseline = "middle", v.textAlign = "center", v.font = `bold ${d}px ${i.font}`, v.fillStyle = i.headerColor, p.forEach((L, N) => v.fillText(L, b.width / 2, u * 0.75 + l * (N + 0.5))), v.textAlign = "left", v.font = `${d}px ${i.font}`, r.forEach((L, N) => {
      const z = g + u * 0.75 + l * (N + 0.5);
      L === "---" ? (v.strokeStyle = i.border, v.lineWidth = Math.max(1, c * 0.3), v.beginPath(), v.moveTo(0, z), v.lineTo(b.width, z), v.stroke()) : (v.fillStyle = i.textColor, v.fillText(L, u * 1.5, z));
    }), v.strokeStyle = i.border, v.lineWidth = Math.max(2, c * 0.5), v.strokeRect(0, 0, b.width, b.height);
    const S = { texture: this.make(b), w: b.width / c, h: b.height / c };
    return this.map.set(a, S), S;
  }
}
const Qt = `
.gs-container{position:relative;overflow:hidden}
.gs-root{position:absolute;inset:0;overflow:hidden;font-family:var(--gs-font,system-ui,sans-serif);color:var(--gs-panel-fg,#1f2933);touch-action:none;user-select:none;-webkit-user-select:none}
.gs-root canvas{display:block;outline:none}
.gs-tooltip{position:absolute;z-index:3;pointer-events:none;max-width:260px;padding:6px 9px;font-size:12px;line-height:1.35;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px);box-shadow:0 2px 8px rgba(0,0,0,.18);white-space:pre-wrap;overflow-wrap:anywhere}
.gs-tooltip[hidden]{display:none}
.gs-tt-title{font-weight:600}
.gs-tt-muted{opacity:.7}
.gs-controls{position:absolute;z-index:2;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.gs-btn{min-width:32px;height:32px;padding:0 8px;font:inherit;font-size:13px;cursor:pointer;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px)}
.gs-btn:hover{border-color:var(--gs-accent,#e8590c)}
.gs-btn:focus-visible{outline:2px solid var(--gs-accent,#e8590c);outline-offset:1px}
.gs-pseudo-fullscreen{position:fixed!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;z-index:2147483000;margin:0!important;border-radius:0!important}
.gs-box{position:absolute;z-index:2;pointer-events:none;border:1px dashed var(--gs-accent,#e8590c);background:color-mix(in srgb,var(--gs-accent,#e8590c) 12%,transparent)}
.gs-panel{position:absolute;z-index:4;top:0;right:0;bottom:0;width:min(46%,520px);display:flex;flex-direction:column;background:var(--gs-panel-bg,#fff);border-left:1px solid var(--gs-panel-border,#cfd6de);box-shadow:-4px 0 14px rgba(0,0,0,.15)}
.gs-panel-head{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid var(--gs-panel-border,#cfd6de);font-size:13px}
.gs-panel-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gs-panel iframe{flex:1;border:0;width:100%;background:#fff}
.gs-error{padding:12px;font:13px system-ui,sans-serif;color:#b42318}
`;
function Jt() {
  if (typeof document > "u" || document.getElementById("gs-styles")) return;
  const o = document.createElement("style");
  o.id = "gs-styles", o.textContent = Qt, document.head.appendChild(o);
}
const Z = 400, es = new k.Vector3(1, 0, 0), Ae = { x: 0, y: 1, z: 2 }, Ie = { x: "#e03131", y: "#2f9e44", z: "#1c7ed6" }, Pe = new k.Quaternion(), ts = 4;
class gs {
  events = new Oe();
  config;
  _graph;
  userConfig;
  container;
  root;
  canvas;
  renderer;
  scene = new k.Scene();
  persp;
  ortho;
  camera;
  controls;
  orbit = null;
  disposeControls = () => {
  };
  pointerIsDown = !1;
  activeUntil = 0;
  ambient = new k.AmbientLight(16777215, 1.8);
  headlight = new k.DirectionalLight(16777215, 1.6);
  tex;
  width = 1;
  height = 1;
  ro = null;
  raf = 0;
  disposed = !1;
  unsubGraph = () => {
  };
  nodeInfo = /* @__PURE__ */ new Map();
  edgeInfo = /* @__PURE__ */ new Map();
  layers = /* @__PURE__ */ new Map();
  buckets = [];
  arrowMesh = null;
  geoms = /* @__PURE__ */ new Map();
  colors = /* @__PURE__ */ new Map();
  selNodes = /* @__PURE__ */ new Set();
  selEdges = /* @__PURE__ */ new Set();
  hoverNode = null;
  hoverEdge = null;
  tool = "select";
  dirtyStructure = !0;
  dirtyPositions = !1;
  dirtyNodes = !1;
  dirtyEdges = !1;
  dirtyLabels = !1;
  pendingFit = !0;
  pendingLayout = !1;
  sim = null;
  simResolve = null;
  dragIds = [];
  drag = null;
  down = null;
  lastPointer = { x: 0, y: 0 };
  hoverRaf = 0;
  rubber = null;
  guide = null;
  axisKeys = /* @__PURE__ */ new Set();
  appliedVars = [];
  tooltipEl;
  boxEl;
  controlsEl = null;
  dimButton = null;
  fsButton = null;
  panelEl = null;
  tmpM = new k.Matrix4();
  tmpV = new k.Vector3();
  tmpV2 = new k.Vector3();
  tmpQ = new k.Quaternion();
  tmpS = new k.Vector3();
  raycaster = new k.Raycaster();
  plane = new k.Plane();
  constructor(e, t = {}, s) {
    this.container = e, this.userConfig = t, this.config = ce(t), this._graph = s instanceof le ? s : new le(s), this.config.ui.injectStyles && Jt(), e.classList.add("gs-container"), this.root = document.createElement("div"), this.root.className = "gs-root", e.appendChild(this.root), this.renderer = new k.WebGLRenderer({ antialias: this.config.render.antialias, alpha: !0 }), this.renderer.setClearColor(0, 0), this.canvas = this.renderer.domElement, this.root.appendChild(this.canvas), this.tex = new Zt(this.config.label.resolution), this.persp = new k.PerspectiveCamera(this.config.camera.fov, 1, 1, 1e5), this.ortho = new k.OrthographicCamera(-1, 1, 1, -1, 0.1, 1e4), this.camera = this.config.dimension === "3d" ? this.persp : this.ortho, this.scene.add(this.ambient, this.headlight, this.headlight.target), this.tooltipEl = document.createElement("div"), this.tooltipEl.className = "gs-tooltip gs-ui", this.tooltipEl.hidden = !0, this.boxEl = document.createElement("div"), this.boxEl.className = "gs-box", this.boxEl.hidden = !0, this.root.append(this.tooltipEl, this.boxEl), this.setupCamera(), this.buildControls(), this.applyAppearance(), this.root.addEventListener("pointerdown", this.onPointerDown, !0), this.root.addEventListener("pointermove", this.onPointerMove), this.root.addEventListener("pointerup", this.onPointerUp), this.root.addEventListener("pointercancel", this.onPointerUp), this.root.addEventListener("pointerleave", this.onPointerLeave), this.root.addEventListener("dblclick", this.onDblClick), this.root.addEventListener("wheel", this.onWheel, { passive: !0 }), window.addEventListener("keydown", this.onKeyDown), window.addEventListener("keyup", this.onKeyUp), window.addEventListener("blur", this.onBlur), document.addEventListener("fullscreenchange", this.onFullscreenChange), typeof ResizeObserver < "u" && (this.ro = new ResizeObserver(() => this.resize()), this.ro.observe(e)), this.subscribe(), this.resize(), this.afterLoad();
  }
  // ------------------------------------------------------------------ public API
  get graph() {
    return this._graph;
  }
  on(e, t) {
    return this.events.on(e, t);
  }
  /** Replaces the content with a graph (or graph data). The view adopts `meta.dimension` when present. */
  load(e) {
    this.stopLayout(), this.unsubGraph(), e instanceof le ? this._graph = e : this._graph.load(e, !1), this.subscribe(), this.selNodes.clear(), this.selEdges.clear(), this.hoverNode = this.hoverEdge = null;
    const t = this._graph.meta.dimension;
    t && t !== this.config.dimension && this.setDimension(t), this.afterLoad();
  }
  /** Forces a full rebuild (e.g. after changing node data without going through the Graph API). */
  refresh() {
    this.dirtyStructure = !0, this.requestRender();
  }
  getConfig() {
    return this.config;
  }
  /** The partial config that was passed in / patched so far (what you would save as a config file). */
  getUserConfig() {
    return this.userConfig;
  }
  /** Deep-merges a patch into the user config and re-applies everything (theme, colors, labels, ...). */
  setConfig(e) {
    const { dimension: t, ...s } = e, i = this.config.camera.rotation;
    this.userConfig = se(this.userConfig, s), this.config = ce(this.userConfig), this.tex.resolution = this.config.label.resolution, this.tex.clear(), this.persp.fov = this.config.camera.fov, this.persp.updateProjectionMatrix(), this.config.dimension === "3d" && this.config.camera.rotation !== i && this.setupCamera(!0), this.orbit && (this.orbit.enableDamping = this.config.camera.damping), this.applyControlLimits(), this.applyAppearance(), this.dirtyStructure = !0, this.requestRender(), t !== void 0 && this.setDimension(t);
  }
  getDimension() {
    return this.config.dimension;
  }
  setDimension(e) {
    e !== this.config.dimension && (this.stopLayout(), this.userConfig = se(this.userConfig, { dimension: e }), this.config = ce(this.userConfig), this.camera = e === "3d" ? this.persp : this.ortho, this.setupCamera(), this.resize(), this.dirtyStructure = !0, this.pendingFit = this.config.camera.autoFit, this.dimButton && (this.dimButton.textContent = e === "2d" ? "3D" : "2D"), this.events.emit("dimensionchange", { dimension: e }), this.requestRender());
  }
  /** True when all nodes lie in one plane (z = 0), e.g. right after switching a 2D graph to 3D. */
  isFlat() {
    return this._graph.nodes.every((e) => !e.z);
  }
  /**
   * Runs a layout. `force` is animated and resolves when the simulation has settled; the other layouts
   * apply immediately. Pinned nodes stay in place.
   */
  runLayout(e = this.config.layout.name, t = {}) {
    this.stopLayout();
    const s = this._graph;
    if (s.nodes.length === 0) return Promise.resolve();
    const i = this.config;
    ze(s, i.dimension, i.layout.idealLength, i.layout.seed);
    const n = {
      ...Ze,
      dimension: i.dimension,
      spacing: i.layout.spacing,
      idealLength: i.layout.idealLength,
      gravity: i.layout.gravity,
      weightMode: i.layout.weightMode,
      direction: i.layout.direction,
      seed: i.layout.seed,
      gap: i.layout.gap,
      boxes: jt(s, i, i.dimension === "3d"),
      ...t
    };
    if (this.events.emit("layoutstart", { name: e }), e === "force")
      return this.sim = new Ye(s, n), this.simName = e, this.requestRender(), new Promise((a) => {
        this.simResolve = a;
      });
    const r = Xt(s, e, n);
    return s.setPositions([...r].filter(([a]) => !s.getNode(a)?.pinned)), i.camera.autoFit && (this.pendingFit = !0), this.events.emit("layoutend", { name: e, completed: !0 }), this.requestRender(), Promise.resolve();
  }
  simName = "force";
  stopLayout(e = !1) {
    if (!this.sim) return;
    this.sim = null;
    const t = this.simResolve;
    this.simResolve = null, e && this.config.camera.autoFit && (this.pendingFit = !0), this.events.emit("layoutend", { name: this.simName, completed: e }), t?.(), this.requestRender();
  }
  get isLayoutRunning() {
    return this.sim !== null;
  }
  /** Frames the whole graph. */
  fit() {
    const e = [...this.nodeInfo.values()], t = this.camera, s = this.config.dimension === "3d";
    if (e.length === 0) {
      this.controls.target.set(0, 0, 0), s ? this.persp.position.set(0, 0, 300) : (this.ortho.zoom = 1, this.ortho.position.set(0, 0, 1e3)), this.ortho.updateProjectionMatrix(), this.controls.update(), this.requestRender();
      return;
    }
    let i = 1 / 0, n = 1 / 0, r = 1 / 0, a = -1 / 0, h = -1 / 0, c = -1 / 0;
    for (const E of e) {
      const [g, m, M] = E.body.pos;
      i = Math.min(i, g - E.body.hw), a = Math.max(a, g + E.body.hw), n = Math.min(n, m - E.body.hh), h = Math.max(h, m + E.body.hh), r = Math.min(r, M), c = Math.max(c, M);
    }
    const d = (i + a) / 2, l = (n + h) / 2, u = (r + c) / 2, f = this.config.camera.fitPadding, p = Math.max(a - i, 10), y = Math.max(h - n, 10), w = c - r;
    if (s) {
      const E = Math.max(0.5 * Math.hypot(p, y, w), 10), g = k.MathUtils.degToRad(this.persp.fov) / 2, m = Math.atan(Math.tan(g) * (this.width / this.height)), M = E / Math.sin(Math.min(g, m)) * f * 0.8, b = this.tmpV.copy(t.position).sub(this.controls.target);
      b.lengthSq() < 1e-9 && b.set(0, 0, 1), b.normalize(), this.controls.target.set(d, l, u), t.position.set(d, l, u).addScaledVector(b, M);
    } else {
      const E = this.width / this.height, g = Math.min(Z * E / p, Z / y) / f;
      this.ortho.zoom = Math.min(this.config.camera.zoomMax, Math.max(this.config.camera.zoomMin, g)), this.ortho.position.set(d, l, 1e3), this.controls.target.set(d, l, 0), this.ortho.updateProjectionMatrix();
    }
    this.controls.update(), this.requestRender();
  }
  zoomBy(e) {
    if (this.config.dimension === "2d") {
      const t = this.config.camera;
      this.ortho.zoom = Math.min(t.zoomMax, Math.max(t.zoomMin, this.ortho.zoom * e)), this.ortho.updateProjectionMatrix();
    } else {
      const t = this.tmpV.copy(this.persp.position).sub(this.controls.target).multiplyScalar(1 / e);
      this.persp.position.copy(this.controls.target).add(t);
    }
    this.controls.update(), this.requestRender();
  }
  setTool(e) {
    this.tool = e, this.canvas.style.cursor = e === "connect" ? "crosshair" : "";
  }
  getTool() {
    return this.tool;
  }
  getSelection() {
    return { nodes: [...this.selNodes], edges: [...this.selEdges] };
  }
  setSelection(e) {
    this.selNodes = new Set((e.nodes ?? []).filter((t) => this._graph.hasNode(t))), this.selEdges = new Set((e.edges ?? []).filter((t) => !!this._graph.getEdge(t))), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender();
  }
  selectAll() {
    this.setSelection({ nodes: this._graph.nodes.map((e) => e.id) });
  }
  clearSelection() {
    (this.selNodes.size || this.selEdges.size) && this.setSelection({});
  }
  getNodeStyle(e) {
    return this.nodeInfo.get(e)?.style;
  }
  getEdgeStyle(e) {
    return this.edgeInfo.get(e)?.style;
  }
  /** True while the view is shown full screen (native Fullscreen API or the CSS fallback). */
  get isFullscreen() {
    return document.fullscreenElement === this.container || this.container.classList.contains("gs-pseudo-fullscreen");
  }
  /**
   * Switches the whole view (container) in or out of full screen. Uses the Fullscreen API and falls back to a
   * fixed, viewport-filling container where it is unavailable (e.g. iPhone Safari). Must be called from a user gesture.
   * Esc leaves full screen in both variants.
   */
  async toggleFullscreen(e) {
    const t = e ?? !this.isFullscreen;
    if (t === this.isFullscreen) return;
    const s = this.container;
    if (t) {
      if (typeof s.requestFullscreen == "function")
        try {
          await s.requestFullscreen();
          return;
        } catch {
        }
      s.classList.add("gs-pseudo-fullscreen");
    } else if (document.fullscreenElement === s) {
      await document.exitFullscreen();
      return;
    } else s.classList.remove("gs-pseudo-fullscreen");
    this.onFullscreenChange();
  }
  onFullscreenChange = () => {
    if (this.disposed) return;
    const e = this.isFullscreen;
    this.fsButton && (this.fsButton.textContent = e ? "Exit" : "Full"), this.resize(), this.events.emit("fullscreenchange", { fullscreen: e });
  };
  /** Opens the url of a node or edge according to `links` (self / blank / panel / event). */
  openLink(e, t) {
    const s = e === "node" ? this._graph.getNode(t) : this._graph.getEdge(t), i = ot(s?.url, this.config.links);
    if (!s || !s.url || !i) return !1;
    const n = { url: s.url, resolved: i, kind: e, id: t, handled: !1 };
    if (this.events.emit("link", n), n.handled || this.config.links.target === "event") return !0;
    switch (this.config.links.target) {
      case "blank":
        window.open(i, "_blank", "noopener");
        break;
      case "panel":
        this.openPanel(i, s.label ?? t);
        break;
      default:
        window.location.assign(i);
    }
    return !0;
  }
  closePanel() {
    this.panelEl?.remove(), this.panelEl = null;
  }
  /** PNG (or other) data URL of the current view including the background. */
  exportImage(e = "image/png", t) {
    this.frame();
    const s = document.createElement("canvas");
    s.width = this.canvas.width, s.height = this.canvas.height;
    const i = s.getContext("2d"), n = this.config.background;
    if (!n.transparent) {
      if (n.gradientTo) {
        const r = i.createLinearGradient(0, 0, 0, s.height);
        r.addColorStop(0, n.color), r.addColorStop(1, n.gradientTo), i.fillStyle = r;
      } else i.fillStyle = n.color;
      i.fillRect(0, 0, s.width, s.height);
    }
    return i.drawImage(this.canvas, 0, 0), s.toDataURL(e, t);
  }
  resize() {
    const e = Math.max(1, this.container.clientWidth), t = Math.max(1, this.container.clientHeight);
    this.width = e, this.height = t, this.renderer.setPixelRatio(this.config.render.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2)), this.renderer.setSize(e, t);
    const s = e / t;
    this.persp.aspect = s, this.persp.updateProjectionMatrix(), this.ortho.left = -Z * s / 2, this.ortho.right = Z * s / 2, this.ortho.top = Z / 2, this.ortho.bottom = -Z / 2, this.ortho.updateProjectionMatrix();
    for (const i of this.buckets) i.mesh.material.resolution.set(e, t);
    this.controls && !this.orbit && this.controls.handleResize(), this.dirtyLabels = !0, this.requestRender();
  }
  destroy() {
    this.disposed = !0, cancelAnimationFrame(this.raf), cancelAnimationFrame(this.hoverRaf), this.ro?.disconnect(), this.unsubGraph(), this.stopLayout(), this.root.removeEventListener("pointerdown", this.onPointerDown, !0), window.removeEventListener("keydown", this.onKeyDown), window.removeEventListener("keyup", this.onKeyUp), window.removeEventListener("blur", this.onBlur), document.removeEventListener("fullscreenchange", this.onFullscreenChange), this.container.classList.remove("gs-pseudo-fullscreen"), this.setAxisGuide(null), this.disposeControls(), this.clearScene();
    for (const e of this.geoms.values()) e.dispose();
    this.tex.clear(), this.renderer.dispose(), this.root.remove(), this.container.classList.remove("gs-container"), this.events.clear();
  }
  // ------------------------------------------------------------------ setup helpers
  subscribe() {
    this.unsubGraph = this._graph.events.on("change", this.onGraphChange);
  }
  onGraphChange = (e) => {
    e.kind === "position" ? this.dirtyPositions = !0 : (this.sim && this.stopLayout(), this.dirtyStructure = !0), this.requestRender();
  };
  afterLoad() {
    const e = this._graph.nodes.some((t) => t.x === void 0 || t.y === void 0);
    this.pendingFit = this.config.camera.autoFit, this.pendingLayout = e && this.config.layout.autoRun, this.dirtyStructure = !0, this.requestRender();
  }
  /** @param preserve keep the current camera pose (used when only the control scheme changes) */
  setupCamera(e = !1) {
    const t = this.config.dimension === "3d", s = t && this.config.camera.rotation === "free", i = this.controls ? this.controls.target.clone() : null;
    if (this.disposeControls(), this.camera = t ? this.persp : this.ortho, e || (t ? this.persp.position.set(0, 0, 300) : (this.ortho.position.set(0, 0, 1e3), this.ortho.zoom = 1)), t && this.persp.up.set(0, 1, 0), s) {
      const n = new Je(this.camera, this.canvas);
      n.rotateSpeed = 2.5, n.zoomSpeed = 1.2, n.panSpeed = 0.8, n.staticMoving = !1, n.dynamicDampingFactor = 0.12, n.keys = ["", "", ""], n.addEventListener("change", this.onCameraChange), this.disposeControls = () => {
        n.removeEventListener("change", this.onCameraChange), n.dispose();
      }, this.orbit = null, this.controls = n;
    } else {
      const n = new Qe(this.camera, this.canvas);
      n.enableDamping = this.config.camera.damping, n.zoomToCursor = !0, n.addEventListener("change", this.onCameraChange), t ? (n.mouseButtons = { LEFT: k.MOUSE.ROTATE, MIDDLE: k.MOUSE.DOLLY, RIGHT: k.MOUSE.PAN }, n.touches = { ONE: k.TOUCH.ROTATE, TWO: k.TOUCH.DOLLY_PAN }) : (n.enableRotate = !1, n.screenSpacePanning = !0, n.mouseButtons = { LEFT: k.MOUSE.PAN, MIDDLE: k.MOUSE.DOLLY, RIGHT: k.MOUSE.PAN }, n.touches = { ONE: k.TOUCH.PAN, TWO: k.TOUCH.DOLLY_PAN }), this.disposeControls = () => {
        n.removeEventListener("change", this.onCameraChange), n.dispose();
      }, this.orbit = n, this.controls = n;
    }
    e && i && this.controls.target.copy(i), this.applyControlLimits(), this.controls.update();
  }
  applyControlLimits() {
    const e = this.config.camera;
    this.orbit && (this.orbit.minZoom = e.zoomMin, this.orbit.maxZoom = e.zoomMax), this.controls.minDistance = 5, this.controls.maxDistance = 5e4;
  }
  /** Trackball controls only move the camera when `update()` runs, so keep frames coming while the user interacts. */
  get needsContinuousFrames() {
    return !this.orbit && this.config.dimension === "3d" && (this.pointerIsDown || performance.now() < this.activeUntil);
  }
  onCameraChange = () => {
    (this.config.label.mode === "screen" || this.config.dimension === "3d") && (this.dirtyLabels = !0), this.requestRender();
  };
  applyAppearance() {
    const e = this.config, t = e.background;
    this.root.style.background = t.transparent ? "transparent" : t.gradientTo ? `linear-gradient(${t.color}, ${t.gradientTo})` : t.color;
    for (const s of this.appliedVars) this.root.style.removeProperty(`--gs-${s}`);
    this.appliedVars = Object.keys(e.ui.cssVars);
    for (const [s, i] of Object.entries(e.ui.cssVars)) this.root.style.setProperty(`--gs-${s}`, i);
    this.tooltipEl.hidden = !0;
  }
  buildControls() {
    if (this.controlsEl?.remove(), this.controlsEl = null, !this.config.ui.controls) return;
    const e = document.createElement("div");
    e.className = "gs-controls gs-ui";
    const t = (s, i, n) => {
      const r = document.createElement("button");
      return r.type = "button", r.className = "gs-btn", r.textContent = s, r.title = i, r.setAttribute("aria-label", i), r.addEventListener("click", n), e.appendChild(r), r;
    };
    t("+", "Zoom in", () => this.zoomBy(1.4)), t("−", "Zoom out", () => this.zoomBy(1 / 1.4)), t("Fit", "Fit graph to view", () => this.fit()), this.dimButton = t(this.config.dimension === "2d" ? "3D" : "2D", "Switch between 2D and 3D", () => {
      this.setDimension(this.config.dimension === "2d" ? "3d" : "2d");
    }), this.fsButton = null, this.config.ui.fullscreen && (this.fsButton = t(this.isFullscreen ? "Exit" : "Full", "Toggle full screen", () => {
      this.toggleFullscreen();
    })), this.root.appendChild(e), this.controlsEl = e;
  }
  // ------------------------------------------------------------------ render loop
  requestRender() {
    this.raf || this.disposed || (this.raf = requestAnimationFrame(this.tick));
  }
  tick = () => {
    this.raf = 0, !this.disposed && (this.frame(), (this.sim || this.needsContinuousFrames) && this.requestRender());
  };
  frame() {
    this.sim && this.stepSimulation(), this.dirtyStructure && this.rebuildStructure(), this.pendingFit && (this.pendingFit = !1, this.fit()), this.pendingLayout && (this.pendingLayout = !1, this.runLayout()), this.dirtyPositions && this.updatePositions(), this.dirtyNodes && (this.dirtyNodes = !1, this.updateNodeInstances()), this.dirtyEdges && (this.dirtyEdges = !1, this.writeEdges()), this.dirtyLabels && (this.dirtyLabels = !1, this.updateLabels()), this.controls.update(), this.config.dimension === "3d" && (this.headlight.position.copy(this.persp.position), this.headlight.target.position.copy(this.controls.target), this.headlight.target.updateMatrixWorld()), this.renderer.render(this.scene, this.camera);
  }
  stepSimulation() {
    const e = this.sim;
    if (!e) return;
    const t = this._graph.nodes.length, s = t <= 1500 ? 3 : t <= 5e3 ? 2 : 1;
    for (const i of this.dragIds) {
      const n = this._graph.getNode(i);
      n && e.pin(i, [n.x ?? 0, n.y ?? 0, n.z ?? 0]);
    }
    for (let i = 0; i < s; i++) e.step();
    e.commit(this._graph), e.alpha < 0.02 && this.stopLayout(!0);
  }
  // ------------------------------------------------------------------ scene construction
  color(e) {
    let t = this.colors.get(e);
    return t || (t = new k.Color(e), this.colors.set(e, t)), t;
  }
  geometryFor(e) {
    let t = this.geoms.get(e);
    if (t) return t;
    switch (e) {
      case "circle3d":
        t = new k.SphereGeometry(0.5, 24, 16);
        break;
      case "square3d":
      case "rectangle3d":
        t = new k.BoxGeometry(1, 1, 1);
        break;
      case "diamond3d":
        t = new k.OctahedronGeometry(0.62);
        break;
      case "hexagon3d":
        t = new k.CylinderGeometry(0.5, 0.5, 1, 6), t.rotateX(Math.PI / 2), t.rotateZ(Math.PI / 2);
        break;
      case "triangle3d":
        t = new k.CylinderGeometry(0.5, 0.5, 1, 3), t.rotateX(-Math.PI / 2);
        break;
      case "square":
      case "rectangle":
        t = new k.PlaneGeometry(1, 1);
        break;
      case "diamond":
        t = new k.CircleGeometry(0.5, 4);
        break;
      case "hexagon":
        t = new k.CircleGeometry(0.5, 6);
        break;
      case "triangle":
        t = new k.CircleGeometry(0.5, 3), t.rotateZ(Math.PI / 2);
        break;
      case "arrow":
        t = new k.ConeGeometry(0.5, 1, 14), t.rotateZ(-Math.PI / 2), t.translate(-0.5, 0, 0);
        break;
      default:
        t = new k.CircleGeometry(0.5, 40);
    }
    return this.geoms.set(e, t), t;
  }
  /** Material flags that differ between 2D (ordered by renderOrder) and 3D (depth buffer). */
  applyMode(e, t) {
    const s = this.config.dimension === "3d";
    e.transparent = s ? t < 1 : !0, e.opacity = t, e.depthTest = s, e.depthWrite = s;
  }
  clearScene() {
    for (const e of this.layers.values())
      this.scene.remove(e.body, e.outline), e.body.material.dispose(), e.outline.material.dispose(), e.body.dispose(), e.outline.dispose();
    this.layers.clear();
    for (const e of this.buckets)
      this.scene.remove(e.mesh), e.mesh.geometry.dispose(), e.mesh.material.dispose();
    this.buckets = [], this.arrowMesh && (this.scene.remove(this.arrowMesh), this.arrowMesh.material.dispose(), this.arrowMesh.dispose(), this.arrowMesh = null);
    for (const e of this.nodeInfo.values()) e.sprite && this.dropSprite(e.sprite);
    for (const e of this.edgeInfo.values()) e.sprite && this.dropSprite(e.sprite);
    this.nodeInfo.clear(), this.edgeInfo.clear();
  }
  dropSprite(e) {
    this.scene.remove(e), e.material.dispose();
  }
  makeSprite(e, t) {
    const s = this.config.dimension === "3d", i = new k.SpriteMaterial({ map: e.texture, transparent: !0, depthTest: s, depthWrite: !1 }), n = new k.Sprite(i);
    return n.renderOrder = t, n.frustumCulled = !1, this.scene.add(n), n;
  }
  rebuildStructure() {
    this.dirtyStructure = !1, this.clearScene();
    const e = this.config, t = this._graph, s = e.dimension === "3d";
    ze(t, e.dimension, e.layout.idealLength, e.layout.seed);
    for (const l of [...this.selNodes]) t.hasNode(l) || this.selNodes.delete(l);
    for (const l of [...this.selEdges]) t.getEdge(l) || this.selEdges.delete(l);
    this.hoverNode && !t.hasNode(this.hoverNode) && (this.hoverNode = null), this.hoverEdge && !t.getEdge(this.hoverEdge) && (this.hoverEdge = null);
    const i = De(t), n = /* @__PURE__ */ new Map();
    for (const l of t.nodes) {
      const u = Fe(l, e, i), f = ye(u.shape, u.size, e.node.aspect), p = {
        node: l,
        style: u,
        body: { pos: [0, 0, 0], hw: f.hw, hh: f.hh, ellipse: qe(u.shape) },
        layerKey: null,
        layer: null,
        slot: -1
      };
      if (u.shape === "card")
        p.card = this.tex.card(l, u, e), p.body.hw = p.card.w / 2, p.body.hh = p.card.h / 2, p.body.ellipse = !1, s && (p.body.hw = p.body.hh = Math.max(p.body.hw, p.body.hh)), p.sprite = this.makeSprite(p.card, 4);
      else {
        p.layerKey = s ? `${u.shape}3d` : u.shape;
        const y = n.get(p.layerKey) ?? [];
        y.push(p), n.set(p.layerKey, y);
      }
      this.nodeInfo.set(l.id, p);
    }
    for (const [l, u] of n) {
      const f = this.geometryFor(l), p = s ? new k.MeshLambertMaterial() : new k.MeshBasicMaterial();
      this.applyMode(p, e.node.opacity);
      const y = new k.MeshBasicMaterial({ side: s ? k.BackSide : k.FrontSide });
      this.applyMode(y, e.node.opacity);
      const w = new k.InstancedMesh(f, p, u.length), E = new k.InstancedMesh(f, y, u.length);
      for (const m of [w, E])
        m.frustumCulled = !1, m.instanceMatrix.setUsage(k.DynamicDrawUsage);
      E.renderOrder = 3, w.renderOrder = 4;
      const g = { key: l, body: w, outline: E };
      u.forEach((m, M) => {
        m.layer = g, m.slot = M, w.setColorAt(M, this.color(m.style.color)), E.setColorAt(M, this.color(m.style.borderColor));
      }), this.layers.set(l, g), this.scene.add(E, w);
    }
    if (e.label.show && t.nodes.length <= e.label.maxCount)
      for (const l of this.nodeInfo.values()) {
        if (l.card) continue;
        const u = l.node.sublabel ? { text: l.node.sublabel, size: e.label.subSize, color: e.label.subColor } : void 0, f = this.tex.text(l.node.label ?? l.node.id, { ...e.label, color: l.style.labelColor }, u);
        l.sprite = this.makeSprite(f, 5);
      }
    let r = 1 / 0, a = -1 / 0;
    for (const l of t.edges) {
      const u = t.weightOf(l);
      r = Math.min(r, u), a = Math.max(a, u);
    }
    const h = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
    let d = 0;
    for (const l of t.edges) {
      const u = t.weightOf(l), f = nt(l, u, e, { min: r, max: a }), p = l.source === l.target, y = {
        edge: l,
        style: f,
        weight: u,
        directed: t.isDirected(l),
        index: 0,
        count: 1,
        flip: !p && l.source > l.target,
        self: p,
        path: [],
        arrowSlot: -1,
        bucketKey: `${f.width}|${f.dashed ? 1 : 0}`
      }, w = p ? `s\0${l.source}` : l.source < l.target ? `${l.source}\0${l.target}` : `${l.target}\0${l.source}`, E = h.get(w) ?? [];
      E.push(y), h.set(w, E), this.edgeInfo.set(l.id, y), y.directed && e.edge.arrows && (y.arrowSlot = d++);
      let g = c.get(y.bucketKey);
      if (!g) {
        const m = new et({
          color: 16777215,
          linewidth: f.width,
          vertexColors: !0,
          dashed: f.dashed,
          dashSize: e.edge.dashSize,
          gapSize: e.edge.gapSize
        });
        m.resolution.set(this.width, this.height), this.applyMode(m, e.edge.opacity);
        const M = new tt(new Ee(), m);
        M.frustumCulled = !1, M.renderOrder = 1, M.visible = !1, this.scene.add(M), g = { key: y.bucketKey, mesh: M, edges: [], dashed: f.dashed }, c.set(y.bucketKey, g);
      }
      g.edges.push(y);
    }
    for (const l of h.values()) l.forEach((u, f) => {
      u.index = f, u.count = l.length;
    });
    if (this.buckets = [...c.values()], d > 0) {
      const l = new k.MeshBasicMaterial();
      this.applyMode(l, e.edge.opacity);
      const u = new k.InstancedMesh(this.geometryFor("arrow"), l, d);
      u.frustumCulled = !1, u.renderOrder = 2, u.instanceMatrix.setUsage(k.DynamicDrawUsage);
      for (let f = 0; f < d; f++) u.setColorAt(f, this.color("#ffffff"));
      this.arrowMesh = u, this.scene.add(u);
    }
    if (t.edges.length <= e.weight.maxCount)
      for (const l of this.edgeInfo.values()) {
        const u = this.edgeText(l);
        u && (l.img = this.tex.text(u, { ...e.weight, maxChars: e.label.maxChars }), l.sprite = this.makeSprite(l.img, 5));
      }
    this.dirtyPositions = !1, this.dirtyNodes = this.dirtyEdges = !1, this.updatePositions();
  }
  edgeText(e) {
    const t = this.config.weight, i = t.show === "always" || t.show === "auto" && e.weight !== 1 ? String(Number(e.weight.toFixed(t.decimals))) : "", n = e.edge.label ?? "";
    return n && i ? `${n} (${i})` : n || i;
  }
  // ------------------------------------------------------------------ per-frame updates
  updatePositions() {
    this.dirtyPositions = !1;
    const e = this.config.dimension === "3d";
    for (const t of this.nodeInfo.values()) {
      const s = t.node;
      t.body.pos[0] = s.x ?? 0, t.body.pos[1] = s.y ?? 0, t.body.pos[2] = e ? s.z ?? 0 : 0;
    }
    this.updateNodeInstances(), this.computePaths(), this.writeEdges(), this.updateLabels();
  }
  updateNodeInstances() {
    const e = this.config, t = e.dimension === "3d", s = this.tmpM;
    for (const [i, n] of this.nodeInfo) {
      const r = n.layer;
      if (!r) continue;
      const a = this.selNodes.has(i), h = i === this.hoverNode, c = a ? e.selection.width : h ? e.selection.width * 0.8 : n.style.borderWidth, d = n.body.hw * 2, l = n.body.hh * 2, [u, f, p] = n.body.pos;
      s.compose(this.tmpV.set(u, f, p), Pe, this.tmpS.set(d, l, t ? l : 1)), r.body.setMatrixAt(n.slot, s), s.compose(this.tmpV.set(u, f, p), Pe, this.tmpS.set(d + 2 * c, l + 2 * c, t ? l + 2 * c : 1)), r.outline.setMatrixAt(n.slot, s), r.outline.setColorAt(n.slot, this.color(a ? e.selection.color : h ? e.selection.hoverColor : n.style.borderColor));
    }
    for (const i of this.layers.values())
      i.body.instanceMatrix.needsUpdate = !0, i.outline.instanceMatrix.needsUpdate = !0, i.outline.instanceColor && (i.outline.instanceColor.needsUpdate = !0);
  }
  computePaths() {
    const e = this.config, t = { spacing: e.edge.curveSpacing, segments: 16, dim3: e.dimension === "3d", loopScale: e.edge.loopSize };
    for (const s of this.edgeInfo.values()) {
      const i = this.nodeInfo.get(s.edge.source)?.body, n = this.nodeInfo.get(s.edge.target)?.body;
      if (!i || !n) {
        s.path = [];
        continue;
      }
      let r = We(i, n, s.index, s.count, s.flip, s.self, t);
      s.tip = void 0, s.arrowSlot >= 0 && r.length >= 2 && (s.tip = Ke(r), r = Ve(r, e.edge.arrowSize * 0.9)), s.path = r;
    }
  }
  edgeColor(e) {
    const t = this.config.selection;
    return this.selEdges.has(e.edge.id) ? this.color(t.color) : e.edge.id === this.hoverEdge ? this.color(t.hoverColor) : this.color(e.style.color);
  }
  /** Writes line and arrow buffers from the cached paths. */
  writeEdges() {
    for (const e of this.buckets) {
      let t = 0;
      for (const a of e.edges) t += Math.max(0, a.path.length - 1);
      const s = new Float32Array(t * 6), i = new Float32Array(t * 6);
      let n = 0;
      for (const a of e.edges) {
        const h = this.edgeColor(a);
        for (let c = 1; c < a.path.length; c++) {
          const d = a.path[c - 1], l = a.path[c];
          s[n] = d[0], s[n + 1] = d[1], s[n + 2] = d[2], s[n + 3] = l[0], s[n + 4] = l[1], s[n + 5] = l[2], i[n] = i[n + 3] = h.r, i[n + 1] = i[n + 4] = h.g, i[n + 2] = i[n + 5] = h.b, n += 6;
        }
      }
      const r = new Ee();
      t > 0 && (r.setPositions(s), r.setColors(i)), e.mesh.geometry.dispose(), e.mesh.geometry = r, e.mesh.visible = t > 0, t > 0 && e.dashed && e.mesh.computeLineDistances();
    }
    if (this.arrowMesh) {
      const e = this.config.edge.arrowSize;
      for (const t of this.edgeInfo.values()) {
        if (t.arrowSlot < 0) continue;
        if (!t.tip) {
          this.arrowMesh.setMatrixAt(t.arrowSlot, this.tmpM.makeScale(0, 0, 0));
          continue;
        }
        const s = t.tip.dir;
        this.tmpQ.setFromUnitVectors(es, this.tmpV2.set(s[0], s[1], s[2])), this.tmpM.compose(this.tmpV.set(t.tip.tip[0], t.tip.tip[1], t.tip.tip[2]), this.tmpQ, this.tmpS.set(e, e * 0.8, e * 0.8)), this.arrowMesh.setMatrixAt(t.arrowSlot, this.tmpM), this.arrowMesh.setColorAt(t.arrowSlot, this.edgeColor(t));
      }
      this.arrowMesh.instanceMatrix.needsUpdate = !0, this.arrowMesh.instanceColor && (this.arrowMesh.instanceColor.needsUpdate = !0);
    }
  }
  updateLabels() {
    const e = this.config, t = e.label.mode === "screen", s = e.dimension === "3d";
    for (const i of this.nodeInfo.values()) {
      const n = i.sprite;
      if (!n) continue;
      const [r, a, h] = i.body.pos;
      if (i.card) {
        n.position.set(r, a, h), n.scale.set(i.card.w, i.card.h, 1);
        continue;
      }
      const c = n.material.map.image, d = this.tex.resolution, l = t ? 1 / this.pxPerUnitAt(r, a, h) : 1, u = c.width / d * l, f = c.height / d * l;
      n.scale.set(u, f, 1), n.position.set(r, a - i.body.hh - e.label.gap * l - f / 2, h), s && this.towardCamera(n.position, i.body.hw + 1);
    }
    for (const i of this.edgeInfo.values()) {
      const n = i.sprite;
      if (!n || !i.img || i.path.length < 2) {
        n && (n.visible = !1);
        continue;
      }
      const r = He(i.path, 0.5), a = t ? 1 / this.pxPerUnitAt(r[0], r[1], r[2]) : 1;
      n.visible = !0, n.scale.set(i.img.w * a, i.img.h * a, 1), n.position.set(r[0], r[1], r[2]), s && this.towardCamera(n.position, 1.5);
    }
  }
  /** Moves a point toward the camera so a label always sits in front of the node it belongs to. */
  towardCamera(e, t) {
    const s = this.tmpV2.copy(this.persp.position).sub(e);
    s.lengthSq() < 1e-9 || e.addScaledVector(s.normalize(), t);
  }
  /** CSS pixels per world unit at a world position. */
  pxPerUnitAt(e, t, s) {
    if (this.camera === this.ortho) return this.height / ((this.ortho.top - this.ortho.bottom) / this.ortho.zoom);
    const i = this.tmpV2.set(e, t, s).applyMatrix4(this.persp.matrixWorldInverse), n = Math.max(1e-3, -i.z);
    return this.height / (2 * Math.tan(k.MathUtils.degToRad(this.persp.fov) / 2) * n);
  }
  // ------------------------------------------------------------------ picking
  ndc = new k.Vector2();
  eventPoint(e) {
    const t = this.canvas.getBoundingClientRect();
    return { x: e.clientX - t.left, y: e.clientY - t.top };
  }
  /** World position of a screen point on the plane through `anchor` that faces the camera. */
  worldAt(e, t, s) {
    this.camera.updateMatrixWorld(), this.ndc.set(e / this.width * 2 - 1, -(t / this.height) * 2 + 1), this.raycaster.setFromCamera(this.ndc, this.camera);
    const i = this.camera.getWorldDirection(this.tmpV2);
    this.plane.setFromNormalAndCoplanarPoint(i, this.tmpV.set(s[0], s[1], s[2]));
    const n = this.raycaster.ray.intersectPlane(this.plane, this.tmpS);
    return n ? [n.x, n.y, n.z] : null;
  }
  pick(e, t) {
    this.camera.updateMatrixWorld();
    const s = this.config.dimension === "3d", i = this.tmpV;
    let n = null, r = 1 / 0;
    for (const [c, d] of this.nodeInfo) {
      const l = d.body.pos;
      if (i.set(l[0], l[1], l[2]).project(this.camera), i.z < -1 || i.z > 1) continue;
      const u = (i.x * 0.5 + 0.5) * this.width, f = (-i.y * 0.5 + 0.5) * this.height, p = this.pxPerUnitAt(l[0], l[1], l[2]), y = (e - u) / Math.max(d.body.hw * p, 4), w = (t - f) / Math.max(d.body.hh * p, 4);
      (d.body.ellipse || s ? y * y + w * w <= 1 : Math.abs(y) <= 1 && Math.abs(w) <= 1) && i.z <= r && (n = c, r = i.z);
    }
    if (n) return { kind: "node", id: n };
    if (this.edgeInfo.size > this.config.interaction.pickLimit) return { kind: null, id: null };
    let a = null, h = 6;
    for (const [c, d] of this.edgeInfo) {
      const l = d.path;
      if (l.length < 2) continue;
      let u = 0, f = 0;
      for (let p = 0; p < l.length; p++) {
        i.set(l[p][0], l[p][1], l[p][2]).project(this.camera);
        const y = (i.x * 0.5 + 0.5) * this.width, w = (-i.y * 0.5 + 0.5) * this.height;
        if (p > 0) {
          const E = Xe(e, t, u, f, y, w);
          E < h && (h = E, a = c);
        }
        u = y, f = w;
      }
    }
    return a ? { kind: "edge", id: a } : { kind: null, id: null };
  }
  // ------------------------------------------------------------------ pointer interaction
  onWheel = () => {
    this.activeUntil = performance.now() + 700, this.requestRender();
  };
  onPointerDown = (e) => {
    if (e.target.closest?.(".gs-ui") || (this.pointerIsDown = !0, this.requestRender(), e.button !== 0)) return;
    const t = this.eventPoint(e);
    this.lastPointer = t;
    const s = this.pick(t.x, t.y), i = e.shiftKey, n = this.config.interaction, r = s.kind === "node" && this.selNodes.has(s.id);
    if (this.down = { x: t.x, y: t.y, hit: s, additive: i, wasSelected: r, moved: !1, button: e.button }, this.hideTooltip(), s.kind === "node") {
      if (this.tool === "connect")
        this.drag = { type: "connect", from: s.id };
      else if (n.select && !r && (i && n.multiSelect ? this.selNodes.add(s.id) : (this.selNodes = /* @__PURE__ */ new Set([s.id]), this.selEdges.clear()), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), n.dragNodes) {
        const a = this.selNodes.has(s.id) ? [...this.selNodes] : [s.id], h = this.nodeInfo.get(s.id).body.pos, c = this.worldAt(t.x, t.y, h);
        if (c) {
          const d = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
          for (const u of a) {
            const f = this.nodeInfo.get(u)?.body.pos;
            f && (d.set(u, [f[0] - c[0], f[1] - c[1], f[2] - c[2]]), l.set(u, [f[0], f[1], f[2]]));
          }
          this.drag = { type: "nodes", ids: a, primary: s.id, offsets: d, starts: l, anchor: [h[0], h[1], h[2]], px: t.x, py: t.y, moved: !1 };
        }
      }
    } else e.shiftKey && n.select && n.multiSelect && (this.drag = { type: "box", x0: t.x, y0: t.y });
    this.drag && (this.controls.enabled = !1, this.canvas.setPointerCapture(e.pointerId));
  };
  onPointerMove = (e) => {
    const t = this.eventPoint(e);
    this.lastPointer = t;
    const s = this.down;
    s && !s.moved && Math.hypot(t.x - s.x, t.y - s.y) > ts && (s.moved = !0);
    const i = this.drag;
    if (!i) {
      s || this.scheduleHover(), this.moveTooltip(t);
      return;
    }
    if (i.type === "nodes") {
      if (!s?.moved) return;
      i.moved || (i.moved = !0, this.dragIds = i.ids, this.canvas.style.cursor = "grabbing", this.events.emit("nodedragstart", { ids: i.ids })), this.dragNodes(i, t);
    } else if (i.type === "connect") {
      this.updateRubber(i.from, t);
      const n = this.pick(t.x, t.y), r = n.kind === "node" ? n.id : null;
      r !== this.hoverNode && (this.hoverNode = r, this.dirtyNodes = !0, this.requestRender());
    } else if (s?.moved) {
      const n = Math.min(i.x0, t.x), r = Math.min(i.y0, t.y);
      this.boxEl.hidden = !1, Object.assign(this.boxEl.style, { left: `${n}px`, top: `${r}px`, width: `${Math.abs(t.x - i.x0)}px`, height: `${Math.abs(t.y - i.y0)}px` });
    }
  };
  onPointerUp = (e) => {
    this.pointerIsDown = !1, this.activeUntil = performance.now() + 1e3, this.requestRender();
    const t = this.down, s = this.drag;
    if (this.down = null, this.drag = null, this.controls.enabled = !0, this.canvas.hasPointerCapture?.(e.pointerId) && this.canvas.releasePointerCapture(e.pointerId), this.boxEl.hidden = !0, this.removeRubber(), this.setAxisGuide(null), this.canvas.style.cursor = this.tool === "connect" ? "crosshair" : "", s?.type === "nodes" && s.moved) {
      for (const n of s.ids) this.sim?.unpin(n, !!this._graph.getNode(n)?.pinned);
      this.dragIds = [], this.events.emit("nodedragend", { ids: s.ids });
      return;
    }
    if (!t || e.type === "pointercancel") return;
    const i = this.eventPoint(e);
    if (s?.type === "connect") {
      const n = this.pick(i.x, i.y);
      n.kind === "node" && this.events.emit("connect", { source: s.from, target: n.id });
      return;
    }
    if (s?.type === "box" && t.moved) {
      this.selectInBox(s.x0, s.y0, i.x, i.y, t.additive);
      return;
    }
    t.moved || this.handleClick(t.hit, t.additive, t.wasSelected, e);
  };
  handleClick(e, t, s, i) {
    const n = this.config.interaction, r = (h) => n.openLinks === "click" || n.openLinks === "ctrl-click" && h, a = i.ctrlKey || i.metaKey;
    if (e.kind === "node") {
      const h = this._graph.getNode(e.id);
      if (!h) return;
      n.select && s && (t ? this.selNodes.delete(e.id) : this.selNodes.size > 1 && (this.selNodes = /* @__PURE__ */ new Set([e.id])), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), this.events.emit("nodeclick", { id: e.id, node: h, originalEvent: i }), r(a) && this.openLink("node", e.id);
    } else if (e.kind === "edge") {
      const h = this._graph.getEdge(e.id);
      if (!h) return;
      n.select && (t && n.multiSelect ? this.selEdges.delete(e.id) || this.selEdges.add(e.id) : (this.selNodes.clear(), this.selEdges = /* @__PURE__ */ new Set([e.id])), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), this.events.emit("edgeclick", { id: e.id, edge: h, originalEvent: i }), r(a) && this.openLink("edge", e.id);
    } else {
      t || this.clearSelection();
      const h = this.eventPoint(i), c = this.worldAt(h.x, h.y, this.config.dimension === "3d" ? this.controls.target.toArray() : [0, 0, 0]) ?? [0, 0, 0];
      this.events.emit("backgroundclick", { position: c, originalEvent: i });
    }
  }
  onDblClick = (e) => {
    if (e.target.closest?.(".gs-ui")) return;
    const t = this.eventPoint(e), s = this.pick(t.x, t.y), i = this.config.interaction.openLinks === "dblclick";
    if (s.kind === "node") {
      const n = this._graph.getNode(s.id);
      n && this.events.emit("nodedblclick", { id: s.id, node: n, originalEvent: e }), i && this.openLink("node", s.id);
    } else if (s.kind === "edge")
      i && this.openLink("edge", s.id);
    else {
      const n = this.worldAt(t.x, t.y, this.config.dimension === "3d" ? this.controls.target.toArray() : [0, 0, 0]) ?? [0, 0, 0];
      this.events.emit("backgrounddblclick", { position: n, originalEvent: e });
    }
  };
  onPointerLeave = () => {
    this.drag || (this.hideTooltip(), (this.hoverNode || this.hoverEdge) && (this.hoverNode = this.hoverEdge = null, this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("hover", { kind: null, id: null }), this.requestRender()));
  };
  /** Axes currently locked by the X / Y / Z keys (Z only exists in 3D). */
  activeAxes() {
    if (!this.config.interaction.axisLock) return [];
    const e = this.config.dimension === "3d";
    return [...this.axisKeys].filter((t) => e || t !== "z");
  }
  toScreen(e) {
    return this.camera.updateMatrixWorld(), this.tmpV.set(e[0], e[1], e[2]).project(this.camera), { x: (this.tmpV.x * 0.5 + 0.5) * this.width, y: (-this.tmpV.y * 0.5 + 0.5) * this.height };
  }
  /**
   * Moves the dragged nodes. Without axis keys they follow the pointer. With one held key (X, Y or Z) they move only
   * along that axis, measured by projecting the pointer motion onto the axis as it appears on screen. With two keys they
   * move within that plane.
   */
  dragNodes(e, t) {
    const s = this.config.dimension === "3d", i = this.activeAxes(), n = [];
    let r = null;
    if (i.length === 1) {
      const a = i[0], h = e.starts.get(e.primary);
      if (!h) return;
      const c = [0, 0, 0];
      c[Ae[a]] = 1;
      const d = 10, l = this.toScreen(h), u = this.toScreen([h[0] + c[0] * d, h[1] + c[1] * d, h[2] + c[2] * d]), f = u.x - l.x, p = u.y - l.y, y = f * f + p * p, w = y > 1e-6 ? ((t.x - e.px) * f + (t.y - e.py) * p) / y * d : 0;
      for (const E of e.ids) {
        const g = e.starts.get(E), m = this._graph.getNode(E);
        !g || !m || n.push([E, [g[0] + c[0] * w, g[1] + c[1] * w, s ? g[2] + c[2] * w : m.z ?? 0]]);
      }
      r = { origin: h, axis: a };
    } else {
      const a = this.worldAt(t.x, t.y, e.anchor);
      if (!a) return;
      const h = i.length === 0;
      for (const c of e.ids) {
        const d = e.offsets.get(c), l = e.starts.get(c), u = this._graph.getNode(c);
        if (!d || !l || !u) continue;
        const f = (p, y) => h || i.includes(y) ? a[p] + d[p] : l[p];
        n.push([c, [f(0, "x"), f(1, "y"), s ? f(2, "z") : u.z ?? 0]]);
      }
    }
    this.setAxisGuide(r), this._graph.setPositions(n);
  }
  setAxisGuide(e) {
    if (!e) {
      if (!this.guide) return;
      this.scene.remove(this.guide), this.guide.geometry.dispose(), this.guide.material.dispose(), this.guide = null, this.requestRender();
      return;
    }
    if (!this.guide) {
      const r = new k.BufferGeometry();
      r.setAttribute("position", new k.BufferAttribute(new Float32Array(6), 3)), this.guide = new k.Line(r, new k.LineBasicMaterial({ color: this.color(Ie[e.axis]), depthTest: !1, transparent: !0, opacity: 0.8 })), this.guide.renderOrder = 19, this.guide.frustumCulled = !1, this.scene.add(this.guide);
    }
    this.guide.material.color.copy(this.color(Ie[e.axis]));
    const t = this.guide.geometry.getAttribute("position"), s = Ae[e.axis], i = [e.origin[0], e.origin[1], e.origin[2]], n = [e.origin[0], e.origin[1], e.origin[2]];
    i[s] -= 5e4, n[s] += 5e4, t.setXYZ(0, i[0], i[1], i[2]), t.setXYZ(1, n[0], n[1], n[2]), t.needsUpdate = !0, this.requestRender();
  }
  onKeyDown = (e) => {
    if (e.key === "Escape" && this.container.classList.contains("gs-pseudo-fullscreen") && this.toggleFullscreen(!1), e.ctrlKey || e.metaKey || e.altKey || e.target?.matches?.("input, textarea, select")) return;
    const s = e.key.toLowerCase();
    (s === "x" || s === "y" || s === "z") && !this.axisKeys.has(s) && (this.axisKeys.add(s), this.refreshAxisDrag());
  };
  onKeyUp = (e) => {
    const t = e.key.toLowerCase();
    (t === "x" || t === "y" || t === "z") && this.axisKeys.delete(t) && this.refreshAxisDrag();
  };
  onBlur = () => {
    this.axisKeys.size && (this.axisKeys.clear(), this.refreshAxisDrag());
  };
  /** Re-applies the running node drag after a key press or release so the constraint takes effect immediately. */
  refreshAxisDrag() {
    const e = this.drag;
    e?.type === "nodes" && e.moved && this.dragNodes(e, this.lastPointer);
  }
  selectInBox(e, t, s, i, n) {
    this.camera.updateMatrixWorld();
    const r = Math.min(e, s), a = Math.max(e, s), h = Math.min(t, i), c = Math.max(t, i), d = n ? new Set(this.selNodes) : /* @__PURE__ */ new Set();
    for (const [l, u] of this.nodeInfo) {
      const f = u.body.pos;
      this.tmpV.set(f[0], f[1], f[2]).project(this.camera);
      const p = (this.tmpV.x * 0.5 + 0.5) * this.width, y = (-this.tmpV.y * 0.5 + 0.5) * this.height;
      this.tmpV.z >= -1 && this.tmpV.z <= 1 && p >= r && p <= a && y >= h && y <= c && d.add(l);
    }
    this.setSelection({ nodes: [...d] });
  }
  scheduleHover() {
    !this.config.interaction.hover || this.hoverRaf || (this.hoverRaf = requestAnimationFrame(() => {
      this.hoverRaf = 0, this.updateHover();
    }));
  }
  updateHover() {
    if (this.drag || this.disposed) return;
    const e = this.pick(this.lastPointer.x, this.lastPointer.y), t = e.kind === "node" ? e.id : null, s = e.kind === "edge" ? e.id : null;
    t !== this.hoverNode && (this.dirtyNodes = !0), s !== this.hoverEdge && (this.dirtyEdges = !0), (t !== this.hoverNode || s !== this.hoverEdge) && (this.hoverNode = t, this.hoverEdge = s, this.events.emit("hover", { kind: e.kind, id: e.id }), this.showTooltip(e), this.requestRender());
    const i = e.kind === "node" ? this._graph.getNode(e.id) : e.kind === "edge" ? this._graph.getEdge(e.id) : void 0;
    this.canvas.style.cursor = this.tool === "connect" ? "crosshair" : i?.url ? "pointer" : "";
  }
  // ------------------------------------------------------------------ tooltip, rubber band, link panel
  hideTooltip() {
    this.tooltipEl.hidden = !0;
  }
  showTooltip(e) {
    const t = this.tooltipEl;
    if (!this.config.interaction.tooltip || e.kind === null) {
      t.hidden = !0;
      return;
    }
    t.replaceChildren();
    const s = (n, r) => {
      const a = document.createElement("div");
      r && (a.className = r), a.textContent = n, t.appendChild(a);
    }, i = this._graph;
    if (e.kind === "node") {
      const n = i.getNode(e.id);
      if (!n) return;
      s(n.label ?? n.id, "gs-tt-title"), n.sublabel && s(n.sublabel, "gs-tt-muted"), n.group && s(n.group, "gs-tt-muted"), n.url && s(n.url, "gs-tt-muted");
      for (const [r, a] of Object.entries(n.props ?? {})) s(`${r}: ${a}`, "gs-tt-muted");
    } else {
      const n = i.getEdge(e.id);
      if (!n) return;
      const r = (a) => i.getNode(a)?.label ?? a;
      s(`${r(n.source)} ${i.isDirected(n) ? "→" : "—"} ${r(n.target)}`, "gs-tt-title"), s(`weight ${i.weightOf(n)}`, "gs-tt-muted"), n.label && s(n.label), n.url && s(n.url, "gs-tt-muted");
    }
    t.hidden = !1, this.moveTooltip(this.lastPointer);
  }
  moveTooltip(e) {
    const t = this.tooltipEl;
    if (t.hidden) return;
    const s = 14;
    let i = e.x + s, n = e.y + s;
    i + t.offsetWidth > this.width && (i = Math.max(0, e.x - t.offsetWidth - s)), n + t.offsetHeight > this.height && (n = Math.max(0, e.y - t.offsetHeight - s)), t.style.left = `${i}px`, t.style.top = `${n}px`;
  }
  updateRubber(e, t) {
    const s = this.nodeInfo.get(e);
    if (!s) return;
    const i = this.worldAt(t.x, t.y, s.body.pos) ?? s.body.pos;
    if (!this.rubber) {
      const r = new k.BufferGeometry();
      r.setAttribute("position", new k.BufferAttribute(new Float32Array(6), 3));
      const a = new k.LineBasicMaterial({ color: this.color(this.config.selection.color), depthTest: !1, transparent: !0 });
      this.rubber = new k.Line(r, a), this.rubber.renderOrder = 20, this.rubber.frustumCulled = !1, this.scene.add(this.rubber);
    }
    const n = this.rubber.geometry.getAttribute("position");
    n.setXYZ(0, s.body.pos[0], s.body.pos[1], s.body.pos[2]), n.setXYZ(1, i[0], i[1], i[2]), n.needsUpdate = !0, this.requestRender();
  }
  removeRubber() {
    this.rubber && (this.scene.remove(this.rubber), this.rubber.geometry.dispose(), this.rubber.material.dispose(), this.rubber = null, this.requestRender());
  }
  openPanel(e, t) {
    this.closePanel();
    const s = document.createElement("div");
    s.className = "gs-panel gs-ui";
    const i = document.createElement("div");
    i.className = "gs-panel-head";
    const n = document.createElement("span");
    n.className = "gs-panel-title", n.textContent = t;
    const r = document.createElement("button");
    r.type = "button", r.className = "gs-btn", r.textContent = "×", r.title = "Close", r.setAttribute("aria-label", "Close panel"), r.addEventListener("click", () => this.closePanel()), i.append(n, r);
    const a = document.createElement("iframe");
    a.setAttribute("sandbox", this.config.links.panelSandbox), a.title = t, a.src = e, s.append(i, a), this.root.appendChild(s), this.panelEl = s;
  }
}
const ms = "0.1.0";
export {
  Se as DEFAULT_CONFIG,
  Ze as DEFAULT_LAYOUT_OPTIONS,
  st as DEFAULT_WEIGHT,
  Oe as Emitter,
  Dt as FORMATS,
  Ye as ForceSimulation,
  le as Graph,
  gs as GraphView,
  ps as LAYOUT_NAMES,
  ge as NODE_SHAPES,
  De as buildGroupIndex,
  Bt as circleLayout,
  Xt as computeLayout,
  ce as createConfig,
  Qt as defaultCss,
  cs as defineConfig,
  Ft as detectFormat,
  ae as estimateTextBox,
  as as generateClustered,
  ds as generateMixedNetwork,
  fs as geometry,
  Wt as gridLayout,
  Jt as injectStyles,
  _t as layeredLayout,
  se as mergeConfig,
  jt as nodeBoxes,
  dt as parseCsv,
  ft as parseDot,
  wt as parseGml,
  hs as parseGraph,
  Lt as parseGraphML,
  Tt as parseJson,
  ze as placeNewNodes,
  Ht as randomLayout,
  ls as registerTheme,
  nt as resolveEdgeStyle,
  Fe as resolveNodeStyle,
  ot as resolveUrl,
  lt as serializeCsv,
  gt as serializeDot,
  xt as serializeGml,
  us as serializeGraph,
  Nt as serializeGraphML,
  Rt as serializeJson,
  Vt as sphereLayout,
  Te as themes,
  Kt as treeLayout,
  ms as version
};
//# sourceMappingURL=graphscape.js.map
