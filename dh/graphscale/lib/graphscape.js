import * as M from "three";
import { OrbitControls as ot } from "three/addons/controls/OrbitControls.js";
import { TrackballControls as nt } from "three/addons/controls/TrackballControls.js";
import { TransformControls as rt } from "three/addons/controls/TransformControls.js";
import { LineMaterial as at } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 as lt } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry as Le } from "three/addons/lines/LineSegmentsGeometry.js";
const xe = ["circle", "square", "rectangle", "diamond", "hexagon", "triangle", "card"], dt = 1;
class Re {
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
const Z = (n) => JSON.parse(JSON.stringify(n));
class pe {
  directed = !1;
  meta = {};
  events = new Re();
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
    this.nodeMap.clear(), this.edgeMap.clear(), this.invalidate(), this.directed = !!e.directed, this.meta = Z(e.meta ?? {});
    for (const s of e.nodes ?? []) {
      const i = Z(s);
      i.id = String(i.id), this.nodeMap.set(i.id, i);
    }
    for (const s of e.edges ?? []) {
      const i = Z(s);
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
    const s = { ...Z(e), id: t };
    return this.nodeMap.set(t, s), this.emit("structure"), s;
  }
  /** Patch a node. A value of `undefined` removes the field. */
  updateNode(e, t) {
    const s = this.nodeMap.get(e);
    if (!s) throw new Error(`Unknown node "${e}"`);
    return $e(s, t), this.emit("structure"), s;
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
    const o = { ...Z(e), id: i, source: t, target: s };
    return this.edgeMap.set(i, o), this.emit("structure"), o;
  }
  updateEdge(e, t) {
    const s = this.edgeMap.get(e);
    if (!s) throw new Error(`Unknown edge "${e}"`);
    if (t.source !== void 0 && !this.nodeMap.has(t.source)) throw new Error("Unknown source node");
    if (t.target !== void 0 && !this.nodeMap.has(t.target)) throw new Error("Unknown target node");
    return $e(s, t), this.emit("structure"), s;
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
    return typeof e.weight == "number" && Number.isFinite(e.weight) ? e.weight : dt;
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
    return Z({ directed: this.directed, meta: this.meta, nodes: this.nodes, edges: this.edges });
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
function $e(n, e) {
  const t = n;
  for (const [s, i] of Object.entries(e))
    i === void 0 ? delete t[s] : t[s] = i;
}
const ct = ["label", "sublabel", "id", "group", "tags", "props"], ht = {
  label: "label",
  name: "label",
  sublabel: "sublabel",
  sub: "sublabel",
  id: "id",
  group: "group",
  tag: "tags",
  tags: "tags",
  url: "url",
  prop: "props",
  props: "props"
};
function ut(n) {
  const e = [], t = /(?:([A-Za-z]+):)?(?:"([^"]*)"|(\S+))/g;
  let s;
  for (; (s = t.exec(n)) !== null; ) {
    const i = s[1] ? ht[s[1].toLowerCase()] : void 0, o = (i ? s[2] ?? s[3] ?? "" : s[0].replace(/^"|"$/g, "")).trim().toLowerCase();
    o && e.push({ field: i, term: o });
  }
  return e;
}
class Ge {
  entries;
  constructor(e) {
    this.entries = e.nodes.map((t) => ({
      id: t.id,
      text: {
        label: (t.label ?? "").toLowerCase(),
        sublabel: (t.sublabel ?? "").toLowerCase(),
        id: t.id.toLowerCase(),
        group: (t.group ?? "").toLowerCase(),
        tags: (t.tags ?? []).join(`
`).toLowerCase(),
        url: (t.url ?? "").toLowerCase(),
        props: Object.values(t.props ?? {}).join(`
`).toLowerCase()
      }
    }));
  }
  search(e, t = {}) {
    const s = t.minChars ?? 2, i = t.fields ?? ct, o = ut(e), r = o.filter((l) => l.term.length >= s);
    if (r.length === 0) return { query: e, ids: [], tooShort: o.length > 0 };
    const a = [];
    for (const l of this.entries) {
      let c = !0;
      for (const d of r)
        if (!(d.field ? l.text[d.field].includes(d.term) : i.some((u) => l.text[u].includes(d.term)))) {
          c = !1;
          break;
        }
      c && a.push(l.id);
    }
    return { query: e, ids: a, tooShort: !1 };
  }
}
function Ms(n, e, t) {
  return new Ge(n).search(e, t);
}
const pt = /^[a-z][a-z0-9+.-]*:/i;
function J(n, e) {
  if (!n) return null;
  const t = n.replace(/[\u0000-\u001f\u007f\s]+/g, (s) => s.includes(" ") ? " " : "").trim();
  return t === "" ? null : t.startsWith("//") ? e.allowAbsolute && /^\/\/[^/]/.test(t) ? t : null : pt.test(t) ? e.allowAbsolute && /^(https?|mailto):/i.test(t) ? t : null : t.startsWith("/") || t.startsWith("#") || t.startsWith("?") || !e.baseUrl ? t : e.baseUrl.replace(/\/+$/, "") + "/" + t.replace(/^\.\//, "");
}
function je(n, e = !1) {
  switch (n) {
    case "click":
      return "Click";
    case "dblclick":
      return "Double-click";
    case "ctrl-click":
      return e ? "Cmd+click" : "Ctrl+click";
    default:
      return "";
  }
}
function ft(n, e = !1) {
  const t = n.interaction, s = n.dimension === "3d", i = [];
  if (i.push({ keys: "Drag background", text: s ? n.camera.rotation === "free" ? "Rotate freely" : "Rotate" : "Pan" }), s && i.push({ keys: "Right-drag", text: "Pan" }), i.push({ keys: "Mouse wheel, pinch", text: "Zoom" }), t.select && i.push({ keys: "Click", text: "Select a node or edge" }), t.select && t.multiSelect && i.push({ keys: "Shift+click, Shift+drag", text: "Add to the selection, box select" }), t.dragNodes && i.push({ keys: "Drag a node", text: "Move it (the whole selection moves together)" }), t.dragNodes && t.axisLock && i.push({ keys: s ? "X, Y or Z while dragging" : "X or Y while dragging", text: "Lock the movement to that axis" }), t.gizmo && i.push({ keys: "Select, then use the handles", text: "Move, rotate or scale the selection (Ctrl snaps)" }), t.openLinks !== "never") {
    const o = je(t.openLinks, e);
    i.push({ keys: `${o} on a badge item`, text: "Open the linked page" }), n.links.chip && i.push({ keys: `Select it, then "${n.links.chipLabel}"`, text: "Open the page without a modifier key" });
  }
  return n.ui.search && i.push({ keys: "Search box", text: "Find and select nodes while typing; Enter zooms to them. group:Sales, tag:x, id:n1 search one field" }), n.ui.controls && i.push({ keys: "+  −  Fit  2D/3D", text: "Zoom in, zoom out, fit the graph, switch 2D / 3D" }), n.ui.fullscreen && i.push({ keys: "Full screen button", text: "Full screen; Esc leaves it" }), i;
}
function re(n) {
  let e = n >>> 0;
  return () => {
    e = e + 1831565813 >>> 0;
    let t = e;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function Ss(n) {
  const e = Math.max(1, Math.floor(n.nodes)), t = Math.max(1, Math.min(n.clusters ?? Math.ceil(Math.sqrt(e) / 2), e)), s = re(n.seed ?? 1), i = [], o = Array.from({ length: t }, () => []);
  for (let d = 0; d < e; d++) {
    const h = d % t;
    o[h].push(d), i.push({ id: `n${d + 1}`, label: `N${d + 1}`, group: `Group ${h + 1}` });
  }
  const r = Math.floor(e * (n.avgDegree ?? 4) / 2), a = n.crossRatio ?? 0.08, l = /* @__PURE__ */ new Set(), c = [];
  for (let d = 0; c.length < r && d < r * 20; d++) {
    const h = Math.floor(s() * e);
    let u;
    if (s() < a) u = Math.floor(s() * e);
    else {
      const y = o[h % t];
      u = y[Math.floor(s() * y.length)];
    }
    if (h === u) continue;
    const p = h < u ? `${h}-${u}` : `${u}-${h}`;
    if (l.has(p)) continue;
    l.add(p);
    const f = { id: `e${c.length + 1}`, source: i[h].id, target: i[u].id };
    n.weighted && (f.weight = 1 + Math.floor(s() * 5)), c.push(f);
  }
  return { directed: !!n.directed, nodes: i, edges: c };
}
function Es(n) {
  const e = Math.max(20, Math.floor(n.nodes)), t = re(n.seed ?? 1), s = [], i = [], o = /* @__PURE__ */ new Set(), r = (g) => g[Math.floor(t() * g.length)], a = (g, m) => {
    const v = `n${s.length + 1}`;
    return s.push({ id: v, label: `${g[0]}${s.length + 1}`, group: g, props: m }), v;
  }, l = (g, m, v = {}, b = !1) => {
    const x = g < m ? `${g}|${m}` : `${m}|${g}`;
    if (!b && (g === m || o.has(x))) return;
    o.add(x);
    const E = { id: `e${i.length + 1}`, source: g, target: m, ...v };
    !("weight" in v) && t() < 0.25 && (E.weight = 1 + Math.floor(t() * 4)), i.push(E);
  }, c = (g) => Math.floor(e * g), d = c(0.04), h = c(0.3), u = c(0.32), p = c(0.14), f = [];
  for (; s.length < h; ) {
    const g = Math.min(3 + Math.floor(t() * 7), h - s.length);
    if (g < 2) break;
    const m = Array.from({ length: g }, () => a("Cliques", { clique: f.length + 1 }));
    for (let v = 0; v < g; v++) for (let b = v + 1; b < g; b++) l(m[v], m[b]);
    f.push(m);
  }
  const y = [], w = Math.min(5, u - s.length), S = Array.from({ length: Math.max(w, 2) }, () => a("Hubs"));
  for (let g = 0; g < S.length; g++) for (let m = g + 1; m < S.length; m++)
    l(S[g], S[m]), y.push(S[g], S[m]);
  for (f.length && l(S[0], r(r(f))); s.length < h + u; ) {
    const g = a("Hubs"), m = 1 + Math.floor(t() * 3);
    for (let v = 0; v < m; v++) {
      const b = r(y);
      l(g, b), y.push(g, b);
    }
  }
  for (; s.length < h + u + p; ) {
    const g = Math.min(3 + Math.floor(t() * 10), h + u + p - s.length), m = Array.from({ length: g }, () => a("Chains"));
    l(m[0], r(s.slice(0, s.length - g)).id);
    for (let v = 1; v < g; v++) l(m[v - 1], m[v]);
    g > 4 && t() < 0.3 && l(m[g - 1], m[0]);
  }
  for (; s.length < e - d; ) {
    const g = a("Leaves");
    l(g, t() < 0.5 ? r(y) : r(s.slice(0, s.length - 1)).id);
  }
  for (; s.length < e; ) a("Isolated");
  for (let g = 0; g < Math.ceil(e / 80); g++) l(r(s.filter((m) => m.group !== "Isolated")).id, r(s.filter((m) => m.group !== "Isolated")).id);
  for (let g = 0; g < 4 && i.length; g++) {
    const m = r(i);
    l(m.source, m.target, { weight: 2 + g, label: `parallel ${g + 1}` }, !0);
  }
  for (let g = 0; g < 3; g++) {
    const m = r(s.filter((v) => v.group !== "Isolated")).id;
    l(m, m, { label: "self" }, !0);
  }
  return { directed: !!n.directed, meta: { title: `Mixed network, ${e} nodes` }, nodes: s, edges: i };
}
const le = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', oe = {
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
  label: { show: !0, font: le, size: 6, color: "#1f2933", subSize: 4.6, subColor: "#5f6b76", background: null, padding: 1, maxCount: 1500, maxChars: 40, mode: "world", resolution: 4, gap: 1.5 },
  weight: { show: "auto", font: le, size: 5, color: "#3b4652", background: "rgba(255,255,255,0.85)", padding: 1, maxCount: 3e3, decimals: 2 },
  card: { background: "#ffffff", border: "#2b3a4a", headerBackground: null, headerColor: "#ffffff", textColor: "#1f2933", font: le, size: 4.5, padding: 2 },
  selection: { color: "#e8590c", hoverColor: "#f59f00", width: 2.5 },
  gizmo: { size: 0.9, space: "world", snapTranslate: 10, snapRotate: 15, snapScale: 0.1 },
  groups: { palette: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ac"], colors: {} },
  rules: [],
  camera: { fov: 50, zoomMin: 0.02, zoomMax: 60, fitPadding: 1.25, autoFit: !0, damping: !1, rotation: "orbit" },
  layout: { name: "force", idealLength: 60, spacing: 40, gap: 14, weightMode: "ignore", gravity: 0.05, direction: "TB", seed: 1, autoRun: !0 },
  search: { minChars: 2, fields: ["label", "sublabel", "id", "group", "tags", "props"], fitOnEnter: !0 },
  interaction: { dragNodes: !0, select: !0, multiSelect: !0, hover: !0, tooltip: !0, gizmo: !1, axisLock: !0, openLinks: "ctrl-click", pickLimit: 2e4 },
  links: { baseUrl: "", target: "self", allowAbsolute: !1, panelSandbox: "allow-same-origin allow-scripts allow-popups allow-forms", badge: !0, badgeColor: "#1c7ed6", badgeSize: 5, hint: !0, chip: !0, chipLabel: "Open page" },
  ui: {
    controls: !0,
    search: !0,
    help: !0,
    fullscreen: !0,
    injectStyles: !0,
    cssVars: {
      font: le,
      "panel-bg": "rgba(255,255,255,0.96)",
      "panel-fg": "#1f2933",
      "panel-border": "#cfd6de",
      accent: "#e8590c",
      radius: "4px"
    }
  },
  render: { antialias: !0, pixelRatio: null }
}, Ue = {
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
    links: { badgeColor: "#4dabf7" },
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
    links: { badgeColor: "#f4d35e" },
    ui: { cssVars: { "panel-bg": "rgba(10,44,77,0.96)", "panel-fg": "#faf0ca", "panel-border": "#2f5d8a", accent: "#f4d35e" } }
  }
};
function Cs(n, e) {
  Ue[n] = e;
}
function de(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n) && Object.getPrototypeOf(n) === Object.prototype;
}
function ne(n, e) {
  if (!de(n) || !de(e)) return e === void 0 ? n : e;
  const t = { ...n };
  for (const [s, i] of Object.entries(e))
    i !== void 0 && (t[s] = de(i) && de(t[s]) ? ne(t[s], i) : Array.isArray(i) ? [...i] : i);
  return t;
}
function fe(n = {}) {
  const e = n.theme ?? oe.theme, t = Ue[e] ?? {};
  return ne(ne(oe, t), n);
}
function zs(n) {
  return n;
}
const ye = {
  theme: 'Base look. Built in: "light", "dark", "blueprint"; more can be added with registerTheme(). Everything below overrides the theme.',
  dimension: '"2d" (flat, orthographic) or "3d" (perspective). A graph file can store its own dimension in meta.dimension.',
  background: "Canvas background.",
  "background.color": "CSS color of the background (top color when gradientTo is set).",
  "background.gradientTo": "CSS color for a vertical gradient from color to this one, or null for a solid background.",
  "background.transparent": "true: no background at all, the page behind the view shows through.",
  node: "Default look of nodes. A node can override color, shape and size itself; group colors and rules sit in between.",
  "node.color": "Fill color when the node has neither its own color nor a group color.",
  "node.shape": "circle, square, rectangle, diamond, hexagon, triangle or card (title plus lines, e.g. UML classes). 2D: flat polygons, 3D: solids.",
  "node.size": "Diameter in world units.",
  "node.aspect": 'Width / height of the "rectangle" shape.',
  "node.opacity": "Opacity of all nodes, 0 to 1.",
  "node.borderColor": "Outline color.",
  "node.borderWidth": "Outline width in world units.",
  "node.labelColor": "Text color of the node label.",
  edge: "Default look of edges. An edge can override color, width and dashed itself; rules sit in between.",
  "edge.color": "Line color.",
  "edge.width": "Line width in CSS pixels.",
  "edge.dashed": "true: dashed lines.",
  "edge.opacity": "Opacity of all edges, 0 to 1.",
  "edge.arrows": "Draw arrow heads on directed edges.",
  "edge.arrowSize": "Arrow head length in world units.",
  "edge.curveSpacing": "Distance between parallel edges of the same node pair, in world units.",
  "edge.loopSize": "Radius of self loops relative to the node size.",
  "edge.dashSize": "Length of a dash in world units (dashed edges).",
  "edge.gapSize": "Length of a gap in world units (dashed edges).",
  "edge.widthByWeight": "Map the weights of the graph to line widths.",
  "edge.widthByWeight.enabled": "true: width depends on the weight (lowest weight = min, highest = max).",
  "edge.widthByWeight.min": "Line width in pixels for the lowest weight.",
  "edge.widthByWeight.max": "Line width in pixels for the highest weight.",
  label: "Node labels. A label may contain line breaks, and a node can have a smaller sublabel below it.",
  "label.show": "Show labels at all.",
  "label.font": "CSS font family of labels and sublabels.",
  "label.size": 'Font size: world units in "world" mode, CSS pixels in "screen" mode.',
  "label.color": "Default label color (a node style can override it with labelColor).",
  "label.subSize": "Font size of the sublabel.",
  "label.subColor": "Color of the sublabel.",
  "label.background": "CSS color of a box behind the label, or null for none.",
  "label.padding": "Space between text and label box edge.",
  "label.maxCount": "Labels are skipped above this node count (tooltips still work).",
  "label.maxChars": "Longer lines are cut off with an ellipsis.",
  "label.mode": '"world": labels scale with the zoom. "screen": constant pixel size.',
  "label.resolution": "Texture pixels per label unit. Higher is sharper and needs more memory.",
  "label.gap": "Distance between node and label, in world units.",
  weight: "Text on edges: label and weight.",
  "weight.show": '"auto": show weights other than 1. "always" or "never".',
  "weight.font": "CSS font family of edge texts.",
  "weight.size": "Font size of edge texts.",
  "weight.color": "Text color of edge texts.",
  "weight.background": "CSS color of the box behind edge texts, or null.",
  "weight.padding": "Space between text and box edge.",
  "weight.maxCount": "Edge texts are skipped above this edge count.",
  "weight.decimals": "Maximum number of decimals shown for weights.",
  card: 'Look of nodes with the "card" shape (title in a header band, lines below; "---" is a separator).',
  "card.background": "Card body color.",
  "card.border": "Border and separator color.",
  "card.headerBackground": "Header band color, or null to use the node color.",
  "card.headerColor": "Title text color.",
  "card.textColor": "Body text color.",
  "card.font": "CSS font family.",
  "card.size": "Font size in world units.",
  "card.padding": "Inner padding in world units.",
  selection: "Highlighting of selected and hovered items.",
  "selection.color": "Outline color of selected nodes and color of selected edges.",
  "selection.hoverColor": "Outline color of the hovered node and color of the hovered edge.",
  "selection.width": "Outline width of selected nodes, in world units.",
  gizmo: "Transform gizmo of the selection (needs interaction.gizmo). Snapping is active while Ctrl or Cmd is held.",
  "gizmo.size": "Size of the gizmo.",
  "gizmo.space": '"world" or "local" axes.',
  "gizmo.snapTranslate": "Snap distance for moving, in world units.",
  "gizmo.snapRotate": "Snap angle for rotating, in degrees.",
  "gizmo.snapScale": "Snap step for scaling.",
  groups: "Colors by node group.",
  "groups.palette": "Colors handed out to groups in order of first appearance, then repeated.",
  "groups.colors": 'Fixed colors per group name, for example { "Sales": "#e0b872" }.',
  rules: `Style rules, applied in order after the group color and before the values stored on the node or edge.
Example: { "target": "node", "match": { "group": "Design" }, "style": { "shape": "diamond" } }
match keys: id, group, tag, prop [key, value]. Node style keys: color, shape, size, borderColor, borderWidth, labelColor. Edge: color, width, dashed.`,
  camera: "Camera and view fitting.",
  "camera.fov": "3D field of view in degrees.",
  "camera.zoomMin": "Smallest 2D zoom.",
  "camera.zoomMax": "Largest 2D zoom.",
  "camera.fitPadding": "Margin factor when the graph is fitted into the view (1 = tight).",
  "camera.autoFit": "Fit the graph into the view after loading and after a layout.",
  "camera.damping": "Smooth camera motion (orbit mode).",
  "camera.rotation": '3D only. "orbit": horizon stays level, tilt stops at the poles. "free": trackball, unlimited rotation around every axis.',
  layout: "Automatic placement of nodes.",
  "layout.name": "force (general networks), tree (clean hierarchy), layered (DAG with cross links), circle, grid, sphere or random.",
  "layout.idealLength": "Spring length of the force layout, in world units.",
  "layout.spacing": "Minimum node distance when node sizes are unknown.",
  "layout.gap": "Free space kept between node boxes (node plus label) by tree, layered, circle, grid and sphere.",
  "layout.weightMode": 'Edge weights in the force layout. "ignore": no effect. "closer": heavier edge = shorter (similarity, strength of a tie). "longer": heavier edge = longer (distance, cost, duration). Lengths are relative to the median weight and limited to 0.25x to 4x of layout.idealLength.',
  "layout.gravity": "Pull towards the center in the force layout, keeps separate parts together.",
  "layout.direction": '"TB" (top to bottom) or "LR" (left to right) for tree and layered.',
  "layout.seed": "Seed of the random start positions, so layouts are reproducible.",
  "layout.autoRun": "Run the layout when a loaded graph has nodes without coordinates.",
  search: 'Search box (ui.search): finds nodes while typing and selects them. Terms are case-insensitive substrings, several terms must all match. field:term searches one field: group:Sales, tag:team, id:n12, label:"New York", url:pages/, prop:2019.',
  "search.minChars": "Terms shorter than this are ignored, so typing the first letter does not select half the graph.",
  "search.fields": "Fields searched by plain terms: label, sublabel, id, group, tags, url, props.",
  "search.fitOnEnter": "Enter in the search box zooms to the matches.",
  interaction: "What visitors can do.",
  "interaction.dragNodes": "Nodes can be dragged.",
  "interaction.select": "Nodes and edges can be selected.",
  "interaction.multiSelect": "Shift-click and Shift-drag select several.",
  "interaction.hover": "Highlight the item under the pointer.",
  "interaction.tooltip": "Show a tooltip with details for the hovered item.",
  "interaction.gizmo": "Show the transform gizmo (move, rotate, scale) for the selected nodes.",
  "interaction.axisLock": "Holding X, Y or Z while dragging a node locks the movement to that axis.",
  "interaction.openLinks": 'Gesture that opens the url of a node or edge: "ctrl-click" (default, keeps plain clicks for selecting), "click", "dblclick" or "never" (no links at all).',
  "interaction.pickLimit": "Edges are not hit-tested above this edge count (speed).",
  links: "Website content behind node and edge urls.",
  "links.baseUrl": 'Prefix for relative urls, for example "content/".',
  "links.target": '"self" (navigate), "blank" (new tab), "panel" (sandboxed iframe inside the view) or "event" (your code decides, listen to the link event).',
  "links.allowAbsolute": "Allow absolute http(s) and mailto links. Relative paths are always allowed; javascript: and data: never.",
  "links.panelSandbox": 'sandbox attribute of the iframe used by target "panel".',
  "links.badge": "Draw a small link badge on every node and edge that has a url, so visitors see what is clickable.",
  "links.badgeColor": "Color of the link badge.",
  "links.badgeSize": "Size of the link badge in world units.",
  "links.hint": 'Tooltips of linked items say how to open the page (for example "Ctrl+click to open the page").',
  "links.chip": 'Show an "Open page" chip next to a single selected node or edge that has a url. Works with touch and needs no modifier key.',
  "links.chipLabel": "Text of that chip (translate it here).",
  ui: "Buttons, tooltip and panel around the canvas.",
  "ui.controls": "Zoom, fit and 2D/3D buttons.",
  "ui.search": "Search box in the corner: finds and selects nodes and whole groups while you type (see search).",
  "ui.help": "Help button (question mark) that lists the controls of this view, including the link gesture and full screen.",
  "ui.fullscreen": "Full screen / back button (the usual corner icon). Set false to remove it.",
  "ui.injectStyles": 'Inject the default CSS once. Set false to ship your own (the class names start with "gs-").',
  "ui.cssVars": "CSS custom properties set on the view as --gs-<name>; they style tooltip, buttons and panel.",
  "ui.cssVars.font": "Font family of the DOM parts.",
  "ui.cssVars.panel-bg": "Background of tooltip, buttons and panel.",
  "ui.cssVars.panel-fg": "Text color of tooltip, buttons and panel.",
  "ui.cssVars.panel-border": "Border color of tooltip, buttons and panel.",
  "ui.cssVars.accent": "Highlight color (button hover, selection box).",
  "ui.cssVars.radius": "Corner radius of buttons and tooltip.",
  render: "Renderer settings.",
  "render.antialias": "Smooth edges (needs a reload of the view to change).",
  "render.pixelRatio": "Device pixel ratio to render at, or null for the screen default (maximum 2)."
}, q = (n) => typeof n == "object" && n !== null && !Array.isArray(n), He = /* @__PURE__ */ new Set(["groups.colors", "ui.cssVars"]);
function gt(n, e) {
  const t = [];
  for (const s of n.split(`
`)) {
    let i = "";
    for (const o of s.split(" "))
      i && i.length + 1 + o.length > e ? (t.push(i), i = o) : i = i ? `${i} ${o}` : o;
    t.push(i);
  }
  return t;
}
const mt = `// Graphscape configuration: JSON with comments.
// Comments (// and /* */) and trailing commas are allowed here and are ignored when applying.
// Values that equal the default are fine to keep, they are dropped when the configuration is saved.
`;
function Ls(n, e = !0) {
  const t = (i, o) => {
    const r = ye[i];
    return r ? gt(r, Math.max(40, 100 - o.length)).map((a) => `${o}// ${a}`.trimEnd()).join(`
`) + `
` : "";
  }, s = (i, o, r) => {
    if (q(i)) {
      const a = Object.keys(i);
      if (a.length === 0) return "{}";
      const l = r + "  ";
      return `{
${a.map((d) => {
        const h = o ? `${o}.${d}` : d;
        return `${t(h, l)}${l}${JSON.stringify(d)}: ${s(i[d], h, l)}`;
      }).join(`,
`)}
${r}}`;
    }
    if (Array.isArray(i)) {
      if (i.length === 0) return "[]";
      if (i.every((l) => typeof l != "object" || l === null)) return `[${i.map((l) => JSON.stringify(l)).join(", ")}]`;
      const a = r + "  ";
      return `[
${i.map((l) => a + JSON.stringify(l)).join(`,
`)}
${r}]`;
    }
    return JSON.stringify(i) ?? "null";
  };
  return (e ? mt : "") + s(n, "", "") + `
`;
}
function bt(n) {
  let e = "", t = 0;
  const s = n.length;
  let i = !1;
  for (; t < s; ) {
    const o = n[t];
    if (i) {
      if (e += o, o === "\\") {
        e += n[t + 1] ?? "", t += 2;
        continue;
      }
      o === '"' && (i = !1), t++;
    } else if (o === '"')
      i = !0, e += o, t++;
    else if (o === "/" && n[t + 1] === "/")
      for (; t < s && n[t] !== `
`; ) t++;
    else if (o === "/" && n[t + 1] === "*") {
      const r = n.indexOf("*/", t + 2);
      t = r < 0 ? s : r + 2;
    } else
      (o === "}" || o === "]") && (e = e.replace(/,\s*$/, "")), e += o, t++;
  }
  return e;
}
function $s(n) {
  return JSON.parse(bt(n.replace(/^\uFEFF/, "")));
}
function yt(n, e) {
  const t = {};
  if (!q(e)) return t;
  for (const [s, i] of Object.entries(e)) {
    const o = q(n) ? n[s] : void 0;
    if (q(i) && q(o)) {
      const r = yt(o, i);
      Object.keys(r).length && (t[s] = r);
    } else JSON.stringify(i) !== JSON.stringify(o) && (t[s] = i);
  }
  return t;
}
function wt(n, e = oe, t = "") {
  const s = [];
  if (!q(n) || !q(e)) return s;
  for (const [i, o] of Object.entries(n)) {
    const r = t ? `${t}.${i}` : i;
    i in e ? q(o) && !He.has(r) && s.push(...wt(o, e[i], r)) : s.push(r);
  }
  return s;
}
function Ns() {
  const n = [], e = (t, s) => {
    if (q(t))
      for (const [i, o] of Object.entries(t)) {
        const r = s ? `${s}.${i}` : i;
        r in ye || n.push(r), He.has(r) || e(o, r);
      }
  };
  e(oe, "");
  for (const t of Object.keys(oe.ui.cssVars)) `ui.cssVars.${t}` in ye || n.push(`ui.cssVars.${t}`);
  return n;
}
function Be(n, e) {
  const t = n.match;
  return typeof t == "function" ? t(e) : !(t.id !== void 0 && e.id !== t.id || t.group !== void 0 && e.group !== t.group || t.tag !== void 0 && !e.tags?.includes(t.tag) || t.prop && e.props?.[t.prop[0]] !== t.prop[1]);
}
function qe(n) {
  const e = /* @__PURE__ */ new Map();
  for (const t of n.nodes) t.group !== void 0 && !e.has(t.group) && e.set(t.group, e.size);
  return e;
}
function _e(n, e, t) {
  const { aspect: s, opacity: i, ...o } = e.node, r = { ...o };
  if (n.group !== void 0) {
    const a = e.groups.palette, l = e.groups.colors[n.group] ?? (a.length ? a[(t.get(n.group) ?? 0) % a.length] : void 0);
    l && (r.color = l);
  }
  for (const a of e.rules) a.target === "node" && Be(a, n) && Object.assign(r, a.style);
  return n.color && (r.color = n.color), n.shape && (r.shape = n.shape), n.size && n.size > 0 && (r.size = n.size), r;
}
function xt(n, e, t, s) {
  const { color: i, width: o, dashed: r } = t.edge, a = { color: i, width: o, dashed: r }, l = t.edge.widthByWeight;
  if (l.enabled) {
    const c = s.max > s.min ? (e - s.min) / (s.max - s.min) : 0;
    a.width = l.min + (l.max - l.min) * Math.max(0, Math.min(1, c));
  }
  for (const c of t.rules) c.target === "edge" && Be(c, n) && Object.assign(a, c.style);
  return n.color && (a.color = n.color), n.width && n.width > 0 && (a.width = n.width), n.dashed !== void 0 && (a.dashed = n.dashed), a.width = Math.round(a.width * 2) / 2, a;
}
function ge(n) {
  const e = {};
  for (const [t, s] of Object.entries(n)) s !== void 0 && (e[t] = s);
  return e;
}
class ae {
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
      return Object.assign(s, ge(t), { id: e }), s;
    const i = { ...ge(t), id: e };
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
    const o = { ...ge(s), id: i, source: e, target: t };
    return this.edges.push(o), o;
  }
  build() {
    return { directed: this.directed, meta: this.meta, nodes: [...this.nodes.values()], edges: this.edges };
  }
}
function T(n) {
  if (typeof n == "number") return Number.isFinite(n) ? n : void 0;
  if (typeof n == "string" && n.trim() !== "") {
    const e = Number(n);
    return Number.isFinite(e) ? e : void 0;
  }
}
function K(n) {
  if (typeof n == "boolean") return n;
  if (typeof n == "number") return n !== 0;
  if (typeof n == "string") {
    const e = n.trim().toLowerCase();
    if (["true", "1", "yes"].includes(e)) return !0;
    if (["false", "0", "no"].includes(e)) return !1;
  }
}
function ie(n) {
  if (!n) return;
  const e = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(n.trim());
  if (!e) return;
  let t = e[1];
  return t.length === 3 && (t = [...t].map((s) => s + s).join("")), "#" + t.slice(0, 6).toUpperCase();
}
function vt(n, e) {
  const t = [];
  let s = [], i = "", o = !1;
  for (let r = 0; r < n.length; r++) {
    const a = n[r];
    o ? a === '"' ? n[r + 1] === '"' ? (i += '"', r++) : o = !1 : i += a : a === '"' && i === "" ? o = !0 : a === e ? (s.push(i), i = "") : a === `
` || a === "\r" ? (a === "\r" && n[r + 1] === `
` && r++, s.push(i), i = "", s.some((l) => l.trim() !== "") && t.push(s), s = []) : i += a;
  }
  return s.push(i), s.some((r) => r.trim() !== "") && t.push(s), t;
}
const kt = {
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
function Mt(n, e = !1) {
  const t = n.split(/\r?\n/, 1)[0] ?? "", s = [",", ";", "	"].map((d) => ({ d, n: t.split(d).length })).sort((d, h) => h.n - d.n)[0].d, i = vt(n, s), o = new ae();
  if (o.directed = e, i.length === 0) return { graph: o.build(), warnings: ["Empty file"], format: "csv" };
  const r = i[0].map((d) => kt[d.trim().toLowerCase()]), a = r.includes("source") && r.includes("target"), l = a ? r : ["source", "target", "weight", "label"];
  for (const d of a ? i.slice(1) : i) {
    const h = {};
    if (l.forEach((f, y) => {
      f && d[y] !== void 0 && (h[f] = d[y].trim());
    }), !h.source) continue;
    if (!h.target) {
      o.addNode(h.source, { label: h.label || void 0, url: h.url || void 0, group: h.group || void 0 });
      continue;
    }
    let u = T(h.weight), p = h.label || void 0;
    !a && u === void 0 && h.weight && (p = h.weight, u = void 0), o.addEdge(h.source, h.target, { weight: u, label: p, url: h.url || void 0, directed: K(h.directed) });
  }
  const c = o.build();
  for (const d of c.edges) d.directed === c.directed && delete d.directed;
  return { graph: c, warnings: o.warnings, format: "csv" };
}
const Ne = (n) => {
  const e = n === void 0 ? "" : String(n);
  return /[",\n\r;]/.test(e) ? `"${e.replace(/"/g, '""')}"` : e;
};
function St(n) {
  const e = ["source,target,weight,label,url,directed"], t = /* @__PURE__ */ new Set();
  for (const s of n.edges)
    t.add(s.source), t.add(s.target), e.push([s.source, s.target, s.weight ?? 1, s.label, s.url, s.directed ?? n.directed].map(Ne).join(","));
  for (const s of n.nodes) t.has(s.id) || e.push([s.id, "", "", s.label, s.url, ""].map(Ne).join(","));
  return e.join(`
`) + `
`;
}
function Et(n) {
  const e = [], t = /-?(?:\d+\.?\d*|\.\d+)/y, s = /[A-Za-z_\u0080-\uffff][A-Za-z_0-9\u0080-\uffff]*/y, i = n.length;
  let o = 0;
  for (; o < i; ) {
    const r = n[o];
    if (/\s/.test(r)) o++;
    else if (r === "/" && n[o + 1] === "/") {
      const a = n.indexOf(`
`, o);
      o = a < 0 ? i : a + 1;
    } else if (r === "/" && n[o + 1] === "*") {
      const a = n.indexOf("*/", o + 2);
      o = a < 0 ? i : a + 2;
    } else if (r === "#" && (o === 0 || n[o - 1] === `
`)) {
      const a = n.indexOf(`
`, o);
      o = a < 0 ? i : a + 1;
    } else if (r === '"') {
      let a = o + 1, l = "";
      for (; a < i && n[a] !== '"'; )
        n[a] === "\\" && n[a + 1] === '"' ? (l += '"', a += 2) : n[a] === "\\" && n[a + 1] === `
` ? a += 2 : l += n[a++];
      e.push({ t: "str", v: l }), o = a + 1;
    } else if (r === "<") {
      let a = 0, l = o;
      for (; l < i; l++)
        if (n[l] === "<") a++;
        else if (n[l] === ">" && --a === 0) break;
      const c = n.slice(o + 1, l).replace(/<br\s*\/?>/gi, `
`).replace(/<[^>]*>/g, "");
      e.push({ t: "str", v: c.trim() }), o = l + 1;
    } else if (r === "-" && (n[o + 1] === ">" || n[o + 1] === "-"))
      e.push({ t: "sym", v: n.slice(o, o + 2) }), o += 2;
    else {
      t.lastIndex = o, s.lastIndex = o;
      const a = t.exec(n), l = s.exec(n);
      a ? (e.push({ t: "id", v: a[0] }), o += a[0].length) : l ? (e.push({ t: "id", v: l[0] }), o += l[0].length) : (e.push({ t: "sym", v: r }), o++);
    }
  }
  return e;
}
const Ct = {
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
}, W = (n) => n.replace(/\\n|\\l|\\r/g, `
`);
function Ae(n) {
  const e = n.replace(/^\/[a-z0-9]+\//i, "");
  return e.startsWith("#") ? e.slice(0, 7) : e.split(":")[0];
}
class zt {
  constructor(e) {
    this.toks = e;
  }
  p = 0;
  b = new ae();
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
        const l = this.attrList();
        i === "node" ? Object.assign(e.nodeDef, l) : i === "edge" ? Object.assign(e.edgeDef, l) : l.label && (e.label = l.label);
        continue;
      }
      if ((s.t === "id" || s.t === "str") && this.isSym("=", 1)) {
        this.next(), this.next();
        const l = this.next().v;
        s.v === "label" && (e.label = l);
        continue;
      }
      const o = [this.operand(e, t)];
      let r = !1;
      for (; this.isSym("->") || this.isSym("--"); )
        this.next(), r = !0, o.push(this.operand(e, t));
      const a = this.attrList();
      if (r)
        for (let l = 0; l + 1 < o.length; l++)
          for (const c of o[l]) for (const d of o[l + 1]) this.addEdge(c, d, { ...e.edgeDef, ...a });
      else
        for (const l of o[0]) this.applyNode(l, a);
    }
    throw new Error('Unterminated DOT block (missing "}")');
  }
  operand(e, t) {
    const s = this.peek();
    if (!s) throw new Error("Unexpected end of DOT input");
    if (s.t === "id" && s.v.toLowerCase() === "subgraph" || s.t === "sym" && s.v === "{") {
      let o = "";
      if (s.t === "id" && (this.next(), this.isSym("{") || (o = this.next().v)), !this.isSym("{")) return [];
      this.next();
      const r = { nodeDef: { ...e.nodeDef }, edgeDef: { ...e.edgeDef } }, a = this.stmtList(r);
      if (/^cluster/i.test(o)) {
        const l = r.label ? W(r.label) : o.replace(/^cluster_?/i, "") || o;
        for (const c of a) {
          const d = this.b.node(c);
          d && d.group === void 0 && (d.group = l);
        }
      }
      return a.forEach((l) => t.add(l)), [...a];
    }
    const i = this.next().v;
    for (; this.isSym(":"); )
      this.next(), this.peek() && this.peek().t !== "sym" && this.next();
    return this.b.hasNode(i) || (this.b.addNode(i), this.applyNode(i, e.nodeDef)), t.add(i), [i];
  }
  applyNode(e, t) {
    const s = this.b.ensureNode(e), i = {};
    t.label !== void 0 && t.label !== "\\N" && (i.label = W(t.label));
    const o = t.fillcolor ?? (t.style?.includes("filled") ? t.color : void 0) ?? t.color;
    o && (i.color = Ae(o));
    const r = t.shape ? Ct[t.shape.toLowerCase()] : void 0;
    r && (i.shape = r);
    const a = t.URL ?? t.href ?? t.url;
    a && (i.url = a), t.group && (i.group = t.group);
    const l = t.sublabel ?? t.xlabel;
    if (l && (i.sublabel = W(l)), Object.assign(s, i), s.shape === "card" && t.label !== void 0) {
      const c = t.label.replace(/[{}]/g, "").split("|");
      s.label = W(c[0]).trim() || e;
      const d = [];
      c.slice(1).forEach((h, u) => {
        u > 0 && d.push("---"), d.push(...W(h).split(`
`).map((p) => p.trim()).filter(Boolean));
      }), s.body = d;
    }
  }
  addEdge(e, t, s) {
    this.b.hasNode(e) || this.b.addNode(e), this.b.hasNode(t) || this.b.addNode(t);
    const i = s.dir?.toLowerCase();
    let o = this.b.directed, r = e, a = t;
    i === "none" ? o = !1 : i === "forward" ? o = !0 : i === "back" ? (o = !0, r = t, a = e) : i === "both" && (o = !1, this.warnedBoth || (this.b.warnings.push("Edges with dir=both were imported as undirected"), this.warnedBoth = !0));
    const l = {
      weight: T(s.weight),
      label: s.label ? W(s.label) : void 0,
      url: s.URL ?? s.href ?? s.url,
      color: s.color ? Ae(s.color) : void 0,
      dashed: s.style && /dashed|dotted/.test(s.style) ? !0 : void 0,
      width: T(s.penwidth)
    }, c = this.b.addEdge(r, a, l);
    o !== this.b.directed && (c.directed = o);
  }
}
function Lt(n) {
  const e = new zt(Et(n));
  return e.parse(), { graph: e.b.build(), warnings: e.b.warnings, format: "dot" };
}
const $t = {
  circle: "ellipse",
  square: "square",
  rectangle: "box",
  diamond: "diamond",
  hexagon: "hexagon",
  triangle: "triangle",
  card: "record"
}, G = (n) => `"${n.replace(/"/g, '\\"').replace(/\r?\n/g, "\\n")}"`;
function Nt(n) {
  const e = [`${n.directed ? "digraph" : "graph"} ${G(n.meta?.title ?? "G")} {`];
  for (const s of n.nodes) {
    const i = [];
    if (s.shape === "card") {
      const o = s.body?.indexOf("---") ?? -1, r = o < 0 ? s.body ?? [] : (s.body ?? []).slice(0, o), a = o < 0 ? [] : (s.body ?? []).slice(o + 1), l = (c) => c.join("\\l") + (c.length ? "\\l" : "");
      i.push(`label=${G(`{${s.label ?? s.id}|${l(r)}|${l(a)}}`).replace(/\\\\l/g, "\\l")}`, "shape=record");
    } else
      s.label !== void 0 && i.push(`label=${G(s.label)}`), s.shape && i.push(`shape=${$t[s.shape]}`);
    s.sublabel && i.push(`sublabel=${G(s.sublabel)}`), s.color && i.push(`fillcolor=${G(s.color)}`, "style=filled"), s.url && i.push(`URL=${G(s.url)}`), s.group && i.push(`group=${G(s.group)}`), e.push(`  ${G(s.id)}${i.length ? ` [${i.join(", ")}]` : ""};`);
  }
  const t = n.directed ? "->" : "--";
  for (const s of n.edges) {
    const i = [];
    s.weight !== void 0 && i.push(`weight=${s.weight}`), s.label && i.push(`label=${G(s.label)}`), s.url && i.push(`URL=${G(s.url)}`), s.color && i.push(`color=${G(s.color)}`), s.dashed && i.push("style=dashed"), s.width && i.push(`penwidth=${s.width}`), s.directed !== void 0 && s.directed !== n.directed && i.push(`dir=${s.directed ? "forward" : "none"}`), e.push(`  ${G(s.source)} ${t} ${G(s.target)}${i.length ? ` [${i.join(", ")}]` : ""};`);
  }
  return e.push("}"), e.join(`
`) + `
`;
}
const At = (n) => n.replace(/&quot;/g, '"').replace(/&amp;/g, "&"), It = (n) => n.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
function Ot(n) {
  const e = n.replace(/^\s*#.*$/gm, ""), t = /\s*(\[|\]|"[^"]*"|[^\s[\]"]+)/y, s = [];
  let i;
  for (t.lastIndex = 0; (i = t.exec(e)) !== null; ) s.push(i[1]);
  return s;
}
function We(n, e, t) {
  const s = [];
  for (; e.i < n.length; ) {
    const i = n[e.i++];
    if (i === "]") {
      if (t) throw new Error('Unexpected "]" in GML');
      return s;
    }
    const o = n[e.i++];
    if (o === void 0) throw new Error("Unexpected end of GML");
    o === "[" ? s.push([i, We(n, e, !1)]) : o.startsWith('"') ? s.push([i, At(o.slice(1, -1))]) : s.push([i, T(o) ?? o]);
  }
  if (!t) throw new Error("Unterminated list in GML");
  return s;
}
const ve = (n, e) => n.find(([t]) => t === e)?.[1], P = (n, e) => {
  const t = ve(n, e);
  return typeof t == "string" || typeof t == "number" ? String(t) : void 0;
}, _ = (n, e) => {
  const t = ve(n, e);
  return typeof t == "number" ? t : typeof t == "string" ? T(t) : void 0;
}, Ie = (n, e) => {
  const t = ve(n, e);
  return Array.isArray(t) ? t : void 0;
};
function Dt(n) {
  const e = We(Ot(n), { i: 0 }, !0), t = Ie(e, "graph");
  if (!t) throw new Error("GML document contains no graph [ ... ]");
  const s = new ae();
  s.directed = _(t, "directed") === 1;
  const i = P(t, "label");
  i && (s.meta.title = i);
  for (const [a, l] of t) {
    if (a !== "node" || !Array.isArray(l)) continue;
    const c = P(l, "gsId"), d = c ?? P(l, "id");
    if (d === void 0) {
      s.warnings.push("Skipped a node without id");
      continue;
    }
    const h = Ie(l, "graphics"), u = P(l, "shape"), p = P(l, "body");
    s.addNode(d, {
      label: P(l, "label"),
      sublabel: P(l, "sublabel"),
      x: h ? _(h, "x") : void 0,
      y: h ? _(h, "y") : void 0,
      z: h ? _(h, "z") : void 0,
      group: P(l, "group"),
      url: P(l, "url"),
      color: P(l, "color") ?? (h ? P(h, "fill") : void 0),
      size: _(l, "size"),
      shape: u && xe.includes(u) ? u : void 0,
      body: p ? p.split(`
`) : void 0
    }), c !== void 0 && (s.node(d)._gml = P(l, "id"));
  }
  const o = /* @__PURE__ */ new Map();
  for (const a of s.build().nodes) {
    const l = a._gml;
    l !== void 0 && o.set(l, a.id), delete a._gml;
  }
  const r = (a) => a === void 0 ? void 0 : o.get(a) ?? a;
  for (const [a, l] of t) {
    if (a !== "edge" || !Array.isArray(l)) continue;
    const c = r(P(l, "source")), d = r(P(l, "target"));
    if (c === void 0 || d === void 0) {
      s.warnings.push("Skipped an edge without source/target");
      continue;
    }
    const h = {
      weight: _(l, "weight") ?? _(l, "value"),
      label: P(l, "label"),
      url: P(l, "url"),
      color: P(l, "color")
    }, u = _(l, "directed");
    u !== void 0 && u === 1 !== s.directed && (h.directed = u === 1), s.addEdge(c, d, h);
  }
  return { graph: s.build(), warnings: s.warnings, format: "gml" };
}
function Tt(n) {
  const e = (i) => `"${It(i)}"`, t = /* @__PURE__ */ new Map();
  n.nodes.forEach((i, o) => t.set(i.id, o));
  const s = ["graph [", `  directed ${n.directed ? 1 : 0}`];
  n.meta?.title && s.push(`  label ${e(n.meta.title)}`);
  for (const i of n.nodes)
    s.push("  node [", `    id ${t.get(i.id)}`, `    gsId ${e(i.id)}`), i.label !== void 0 && s.push(`    label ${e(i.label)}`), i.sublabel && s.push(`    sublabel ${e(i.sublabel)}`), (i.x !== void 0 || i.y !== void 0) && s.push(`    graphics [ x ${i.x ?? 0} y ${i.y ?? 0}${i.z !== void 0 ? ` z ${i.z}` : ""} ]`), i.group && s.push(`    group ${e(i.group)}`), i.url && s.push(`    url ${e(i.url)}`), i.color && s.push(`    color ${e(i.color)}`), i.shape && s.push(`    shape ${e(i.shape)}`), i.size !== void 0 && s.push(`    size ${i.size}`), i.body?.length && s.push(`    body ${e(i.body.join(`
`))}`), s.push("  ]");
  for (const i of n.edges)
    s.push("  edge [", `    source ${t.get(i.source)}`, `    target ${t.get(i.target)}`), i.weight !== void 0 && s.push(`    weight ${i.weight}`), i.label && s.push(`    label ${e(i.label)}`), i.url && s.push(`    url ${e(i.url)}`), i.color && s.push(`    color ${e(i.color)}`), i.directed !== void 0 && i.directed !== n.directed && s.push(`    directed ${i.directed ? 1 : 0}`), s.push("  ]");
  return s.push("]"), s.join(`
`) + `
`;
}
const Pt = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };
function me(n) {
  return n.includes("&") ? n.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (e, t) => {
    if (t[0] === "#") {
      const s = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
      return Number.isFinite(s) && s > 0 && s <= 1114111 ? String.fromCodePoint(s) : e;
    }
    return Pt[t.toLowerCase()] ?? e;
  }) : n;
}
function F(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Ft(n) {
  const e = { name: "#root", attrs: {}, children: [], text: "" }, t = [e], s = /<(\/?)([^\s/>!?]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/y, i = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g, o = n.length;
  let r = n.charCodeAt(0) === 65279 ? 1 : 0;
  for (; r < o; ) {
    const a = t[t.length - 1], l = n.indexOf("<", r);
    if (l === -1) {
      a.text += me(n.slice(r));
      break;
    }
    if (l > r && (a.text += me(n.slice(r, l))), r = l, n.startsWith("<!--", r)) {
      const c = n.indexOf("-->", r + 4);
      if (c < 0) throw new Error("Unterminated XML comment");
      r = c + 3;
    } else if (n.startsWith("<![CDATA[", r)) {
      const c = n.indexOf("]]>", r);
      if (c < 0) throw new Error("Unterminated CDATA section");
      a.text += n.slice(r + 9, c), r = c + 3;
    } else if (n.startsWith("<?", r)) {
      const c = n.indexOf("?>", r);
      if (c < 0) throw new Error("Unterminated processing instruction");
      r = c + 2;
    } else if (n.startsWith("<!", r)) {
      let c = 0, d = r + 2;
      for (; d < o; d++) {
        const h = n[d];
        if (h === "[") c++;
        else if (h === "]") c--;
        else if (h === ">" && c <= 0) break;
      }
      r = d + 1;
    } else {
      s.lastIndex = r;
      const c = s.exec(n);
      if (!c) throw new Error(`Malformed XML near offset ${r}`);
      if (r = s.lastIndex, c[1]) {
        if (t.length < 2 || t[t.length - 1].name !== c[2]) throw new Error(`Unexpected closing tag </${c[2]}>`);
        t.pop();
      } else {
        const d = {};
        i.lastIndex = 0;
        let h;
        for (; (h = i.exec(c[3])) !== null; ) d[h[1]] = me(h[2] ?? h[3] ?? "");
        const u = { name: c[2], attrs: d, children: [], text: "" };
        a.children.push(u), c[4] || t.push(u);
      }
    }
  }
  if (t.length !== 1) throw new Error(`Unclosed XML element <${t[t.length - 1].name}>`);
  if (e.children.length === 0) throw new Error("Empty XML document");
  return e.children[0];
}
const X = (n) => n.name.slice(n.name.indexOf(":") + 1);
function se(n, e) {
  return n.children.filter((t) => X(t) === e);
}
function j(n, e) {
  for (const t of n.children) {
    if (e(t)) return t;
    const s = j(t, e);
    if (s) return s;
  }
}
const Rt = /* @__PURE__ */ new Set(["ShapeNode", "GenericNode", "ImageNode", "SVGNode", "UMLClassNode", "GroupNode", "GenericGroupNode", "TableNode"]), Gt = /* @__PURE__ */ new Set(["PolyLineEdge", "ArcEdge", "QuadCurveEdge", "SplineEdge", "BezierEdge", "GenericEdge", "ImageEdge"]), Oe = /* @__PURE__ */ new Set(["GroupNode", "GenericGroupNode"]), jt = {
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
}, V = (n) => n ? (n.text + n.children.map((e) => V(e)).join("")).trim() : "", B = (n) => (e) => X(e) === n;
function Ut(n, e) {
  return e === "boolean" ? n.trim().toLowerCase() === "true" : ["int", "long", "float", "double"].includes(e) ? T(n) ?? n : n;
}
function be(n) {
  return Math.round(n * 100) / 100;
}
function Ht(n, e = {}) {
  const t = Ft(n);
  if (X(t) !== "graphml") throw new Error("Not a GraphML document (missing <graphml> root)");
  const s = e.scale ?? 0.5, i = /* @__PURE__ */ new Map();
  for (const p of se(t, "key"))
    i.set(p.attrs.id, {
      id: p.attrs.id,
      name: p.attrs["attr.name"] ?? "",
      type: p.attrs["attr.type"] ?? "string",
      target: p.attrs.for ?? "all",
      yType: p.attrs["yfiles.type"]
    });
  const o = se(t, "graph")[0];
  if (!o) throw new Error("GraphML document contains no <graph>");
  const r = new ae();
  r.directed = o.attrs.edgedefault === "directed";
  const a = [], l = (p, f) => {
    for (const y of p.children) {
      const w = X(y);
      if (w === "node") {
        const S = r.addNode(y.attrs.id, { group: f });
        d(y, S);
        const g = se(y, "graph")[0];
        if (g) {
          const m = S.label?.split(`
`)[0] || S.id;
          S.tags?.includes("group") || (S.tags = [...S.tags ?? [], "group"]), l(g, m);
        }
      } else w === "edge" ? a.push(y) : w === "hyperedge" && r.warnings.push("Hyperedges are not supported and were skipped");
    }
  }, c = (p, f, y, w) => {
    const S = f.name.toLowerCase(), g = y.trim(), m = p;
    switch (S) {
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
        const v = T(g);
        w && v !== void 0 && (m[S] = v);
        return;
      }
      case "shape":
        w && xe.includes(g) && (m.shape = g);
        return;
      case "directed":
        w || (m.directed = K(g));
        return;
      default:
        f.name && g !== "" && ((p.props ??= {})[f.name] = Ut(g, f.type));
    }
  }, d = (p, f) => {
    for (const y of se(p, "data")) {
      const w = i.get(y.attrs.key);
      w && (w.yType === "nodegraphics" ? h(y, f) : c(f, w, V(y), !0));
    }
  }, h = (p, f) => {
    const y = j(p, (x) => Rt.has(X(x)));
    if (!y) return;
    const w = X(y), S = j(y, B("Geometry"));
    let g = "rectangle";
    if (S) {
      const x = T(S.attrs.width) ?? 30, E = T(S.attrs.height) ?? 30, z = T(S.attrs.x) ?? 0, $ = T(S.attrs.y) ?? 0;
      f.x = be((z + x / 2) * s), f.y = be(-($ + E / 2) * s), Oe.has(w) || (f.size = be(Math.max(Math.min(x, E), 1) * s));
    }
    const m = j(y, B("Fill"));
    if (m && m.attrs.transparent !== "true") {
      const x = ie(m.attrs.color);
      x && (f.color = x);
    }
    const v = j(y, B("Shape"));
    v?.attrs.type && (g = jt[v.attrs.type.toLowerCase()] ?? g), f.shape = g;
    const b = V(j(y, B("NodeLabel")));
    if (b && (f.label = b), w === "UMLClassNode") {
      f.shape = "card";
      const x = V(j(y, B("AttributeLabel"))), E = V(j(y, B("MethodLabel"))), z = [];
      x && z.push(...x.split(/\r?\n/)), (x || E) && z.push("---"), E && z.push(...E.split(/\r?\n/)), f.body = z;
    } else Oe.has(w) && (f.shape = "rectangle", f.tags = [...f.tags ?? [], "group"]);
  }, u = (p) => {
    let f = p.attrs.source, y = p.attrs.target;
    (!r.hasNode(f) || !r.hasNode(y)) && r.warnings.push(`Edge ${f} -> ${y} references an undeclared node; it was created`);
    const w = { id: p.attrs.id };
    let g = K(p.attrs.directed);
    const m = { id: "", source: f, target: y };
    for (const x of se(p, "data")) {
      const E = i.get(x.attrs.key);
      if (E)
        if (E.yType === "edgegraphics") {
          const z = j(x, (O) => Gt.has(X(O)));
          if (!z) continue;
          const $ = j(z, B("Arrows"));
          if ($) {
            const O = ($.attrs.source ?? "none") !== "none", k = ($.attrs.target ?? "none") !== "none";
            O && !k ? ([f, y] = [y, f], g = !0) : g = k && !O;
          }
          const N = j(z, B("LineStyle"));
          if (N) {
            const O = ie(N.attrs.color);
            O && O !== "#000000" && (m.color = O), /dash|dot/i.test(N.attrs.type ?? "") && (m.dashed = !0);
            const k = T(N.attrs.width);
            k !== void 0 && Math.abs(k - 1) > 0.01 && (m.width = Math.min(8, Math.max(0.5, k)));
          }
          const D = V(j(z, B("EdgeLabel")));
          D && (m.label = D);
        } else c(m, E, V(x), !1);
    }
    e.numericLabelsAsWeights && m.label !== void 0 && m.weight === void 0 && /^-?\d+(\.\d+)?$/.test(m.label) && (m.weight = Number(m.label), delete m.label);
    const v = r.addEdge(f, y, { ...m, id: w.id, directed: void 0 }), b = g ?? r.directed;
    b !== r.directed && (v.directed = b);
  };
  l(o);
  for (const p of a) u(p);
  return { graph: r.build(), warnings: r.warnings, format: "graphml" };
}
const Bt = {
  circle: "ellipse",
  square: "rectangle",
  rectangle: "rectangle",
  diamond: "diamond",
  hexagon: "hexagon",
  triangle: "triangle",
  card: "rectangle"
};
function qt(n, e = {}) {
  const t = e.scale ?? 0.5, s = e.defaultSize ?? 14, i = [], o = (d, h, u) => {
    let p = i.find((f) => f.target === d && f.name === h);
    return p || (p = { id: `k${i.length + 2}`, target: d, name: h, type: u }, i.push(p)), p.id;
  }, r = (d) => typeof d == "number" ? "double" : typeof d == "boolean" ? "boolean" : "string", a = [];
  for (const d of n.nodes) {
    const h = d.size ?? s, u = d.shape ?? "circle", p = (u === "rectangle" ? h * 1.6 : u === "card" ? Math.max(h * 3, 60) : h) / t, f = (u === "card" ? Math.max(h * 3, 40) : h) / t, y = (d.x ?? 0) / t - p / 2, w = -(d.y ?? 0) / t - f / 2, S = ie(d.color) ?? "#CCCCFF", g = F(d.label ?? d.id);
    let m;
    if (u === "card") {
      const b = (d.body ?? []).indexOf("---"), x = (b < 0 ? d.body ?? [] : (d.body ?? []).slice(0, b)).join(`
`), E = b < 0 ? "" : (d.body ?? []).slice(b + 1).join(`
`);
      m = `<y:UMLClassNode><y:Geometry height="${f}" width="${p}" x="${y}" y="${w}"/><y:Fill color="${S}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${g}</y:NodeLabel><y:UML clipContent="true" omitDetails="false" stereotype="" use3DEffect="false"><y:AttributeLabel>${F(x)}</y:AttributeLabel><y:MethodLabel>${F(E)}</y:MethodLabel></y:UML></y:UMLClassNode>`;
    } else
      m = `<y:ShapeNode><y:Geometry height="${f}" width="${p}" x="${y}" y="${w}"/><y:Fill color="${S}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${g}</y:NodeLabel><y:Shape type="${Bt[u]}"/></y:ShapeNode>`;
    const v = [`<data key="d0">${m}</data>`];
    d.url && v.push(`<data key="${o("node", "url", "string")}">${F(d.url)}</data>`), d.group && v.push(`<data key="${o("node", "group", "string")}">${F(d.group)}</data>`), d.sublabel && v.push(`<data key="${o("node", "sublabel", "string")}">${F(d.sublabel)}</data>`), d.z !== void 0 && v.push(`<data key="${o("node", "z", "double")}">${d.z}</data>`), d.color && !ie(d.color) && v.push(`<data key="${o("node", "color", "string")}">${F(d.color)}</data>`);
    for (const [b, x] of Object.entries(d.props ?? {})) v.push(`<data key="${o("node", b, r(x))}">${F(String(x))}</data>`);
    a.push(`    <node id="${F(d.id)}">
      ${v.join(`
      `)}
    </node>`);
  }
  const l = [];
  for (const d of n.edges) {
    const h = d.directed ?? n.directed, u = ie(d.color) ?? "#000000", p = d.label ? `<y:EdgeLabel>${F(d.label)}</y:EdgeLabel>` : "", y = [`<data key="d1">${`<y:PolyLineEdge><y:Path sx="0.0" sy="0.0" tx="0.0" ty="0.0"/><y:LineStyle color="${u}" type="${d.dashed ? "dashed" : "line"}" width="${d.width ?? 1}"/><y:Arrows source="none" target="${h ? "standard" : "none"}"/>${p}</y:PolyLineEdge>`}</data>`];
    d.weight !== void 0 && y.push(`<data key="${o("edge", "weight", "double")}">${d.weight}</data>`), d.url && y.push(`<data key="${o("edge", "url", "string")}">${F(d.url)}</data>`), d.group && y.push(`<data key="${o("edge", "group", "string")}">${F(d.group)}</data>`);
    for (const [w, S] of Object.entries(d.props ?? {})) y.push(`<data key="${o("edge", w, r(S))}">${F(String(S))}</data>`);
    l.push(`    <edge id="${F(d.id)}" source="${F(d.source)}" target="${F(d.target)}">
      ${y.join(`
      `)}
    </edge>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:y="http://www.yworks.com/xml/graphml" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd">
${[
    '  <key for="node" id="d0" yfiles.type="nodegraphics"/>',
    '  <key for="edge" id="d1" yfiles.type="edgegraphics"/>',
    ...i.map((d) => `  <key attr.name="${F(d.name)}" attr.type="${d.type}" for="${d.target}" id="${d.id}"/>`)
  ].join(`
`)}
  <graph id="G" edgedefault="${n.directed ? "directed" : "undirected"}">
${a.join(`
`)}
${l.join(`
`)}
  </graph>
</graphml>
`;
}
const U = (n) => typeof n == "object" && n !== null && !Array.isArray(n), R = (n) => n == null ? void 0 : String(n), _t = /* @__PURE__ */ new Set(["id", "name", "key", "index", "vx", "vy", "vz", "fx", "fy", "fz", "source", "target", "from", "to", "value", "w"]);
function Ve(n, e) {
  const t = {};
  for (const [s, i] of Object.entries(n))
    e.has(s) || _t.has(s) || (typeof i == "string" || typeof i == "number" || typeof i == "boolean") && (t[s] = i);
  return Object.keys(t).length ? t : void 0;
}
const Wt = /* @__PURE__ */ new Set(["label", "sublabel", "x", "y", "z", "group", "tags", "url", "color", "shape", "size", "body", "pinned", "props"]), Vt = /* @__PURE__ */ new Set(["weight", "directed", "label", "url", "color", "width", "dashed", "group", "props"]);
function Xt(n) {
  const e = R(n.shape);
  return {
    label: R(n.label ?? n.name),
    sublabel: R(n.sublabel),
    x: T(n.x),
    y: T(n.y),
    z: T(n.z),
    group: R(n.group),
    tags: Array.isArray(n.tags) ? n.tags.map(String) : void 0,
    url: R(n.url),
    color: R(n.color),
    shape: e && xe.includes(e) ? e : void 0,
    size: T(n.size),
    body: Array.isArray(n.body) ? n.body.map(String) : void 0,
    pinned: K(n.pinned),
    props: U(n.props) ? n.props : Ve(n, Wt)
  };
}
function Kt(n) {
  return {
    id: R(n.id),
    weight: T(n.weight ?? n.value ?? n.w),
    directed: K(n.directed),
    label: R(n.label),
    url: R(n.url),
    color: R(n.color),
    width: T(n.width),
    dashed: K(n.dashed),
    group: R(n.group),
    props: U(n.props) ? n.props : Ve(n, Vt)
  };
}
function Yt(n) {
  const e = JSON.parse(n);
  if (!U(e)) throw new Error("JSON graph must be an object");
  const t = new ae();
  let s = [], i = [];
  if (U(e.elements)) {
    const a = (l) => Array.isArray(l) ? l.map((c) => U(c) && U(c.data) ? c.data : c) : [];
    s = a(e.elements.nodes), i = a(e.elements.edges);
  } else
    s = Array.isArray(e.nodes) ? e.nodes : [], i = Array.isArray(e.edges) ? e.edges : Array.isArray(e.links) ? e.links : [];
  if (t.directed = K(e.directed) ?? !1, U(e.meta)) {
    const a = R(e.meta.dimension);
    t.meta = { title: R(e.meta.title), description: R(e.meta.description), dimension: a === "3d" ? "3d" : a === "2d" ? "2d" : void 0 };
  }
  const o = [];
  s.forEach((a, l) => {
    const c = U(a) ? a : { id: a }, d = R(c.id ?? c.name ?? c.key) ?? `n${l + 1}`;
    o.push(d), t.addNode(d, Xt(c));
  });
  const r = (a) => U(a) ? R(a.id ?? a.name ?? a.key) : typeof a == "number" && !t.hasNode(String(a)) && o[a] !== void 0 ? o[a] : R(a);
  for (const a of i) {
    if (!U(a)) continue;
    const l = r(a.source ?? a.from), c = r(a.target ?? a.to);
    if (l === void 0 || c === void 0) {
      t.warnings.push("Skipped an edge without source or target");
      continue;
    }
    (!t.hasNode(l) || !t.hasNode(c)) && t.warnings.push(`Edge ${l} -> ${c} referenced unknown nodes; they were created`), t.addEdge(l, c, Kt(a));
  }
  return { graph: t.build(), warnings: t.warnings, format: "json" };
}
function Zt(n) {
  return JSON.stringify({ format: "graphscape", version: 1, ...n }, null, 2);
}
const Jt = [
  { id: "json", label: "Graphscape JSON (also D3 / Cytoscape)", extensions: ["json"], mime: "application/json" },
  { id: "graphml", label: "GraphML (yEd)", extensions: ["graphml", "xml"], mime: "application/xml" },
  { id: "gml", label: "GML", extensions: ["gml"], mime: "text/plain" },
  { id: "dot", label: "Graphviz DOT", extensions: ["dot", "gv"], mime: "text/vnd.graphviz" },
  { id: "csv", label: "CSV edge list", extensions: ["csv", "tsv", "txt"], mime: "text/csv" }
];
function Qt(n, e) {
  const t = e?.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  if (t) {
    for (const i of Jt) if (i.id !== "csv" && i.extensions.includes(t)) return i.id;
  }
  const s = n.replace(/^\uFEFF/, "").trimStart();
  return s.startsWith("{") || s.startsWith("[") ? "json" : /^<\?xml|^<graphml/i.test(s) || /<graphml[\s>]/i.test(s.slice(0, 2e3)) ? "graphml" : /(^|\n)\s*graph\s*\[/.test(s.replace(/^\s*#.*$/gm, "")) ? "gml" : /^(strict\s+)?(di)?graph\b[^[{]*\{/i.test(s.replace(/^(\s*(\/\/.*|#.*|\/\*[\s\S]*?\*\/)\s*)+/, "")) ? "dot" : "csv";
}
function As(n, e = {}) {
  const t = e.format ?? Qt(n, e.filename), s = n.replace(/^\uFEFF/, "");
  switch (t) {
    case "json":
      return Yt(s);
    case "graphml":
      return Ht(s, { scale: e.scale, numericLabelsAsWeights: e.numericLabelsAsWeights });
    case "gml":
      return Dt(s);
    case "dot":
      return Lt(s);
    case "csv":
      return Mt(s, e.directed ?? !1);
  }
}
function Is(n, e) {
  switch (e) {
    case "json":
      return Zt(n);
    case "graphml":
      return qt(n);
    case "gml":
      return Tt(n);
    case "dot":
      return Nt(n);
    case "csv":
      return St(n);
  }
}
function Xe(n) {
  return n === "circle" || n === "diamond" || n === "hexagon" || n === "triangle";
}
function ke(n, e, t, s) {
  const i = e / 2;
  return { hw: n === "rectangle" ? i * t : i, hh: i };
}
function we(n, e, t) {
  const s = n[0] - e.pos[0], i = n[1] - e.pos[1];
  if (t) {
    const o = n[2] - e.pos[2];
    return s * s + i * i + o * o < e.hw * e.hw;
  }
  return e.ellipse ? s * s / (e.hw * e.hw) + i * i / (e.hh * e.hh) < 1 : Math.abs(s) < e.hw && Math.abs(i) < e.hh;
}
const Me = (n, e, t) => [n[0] + (e[0] - n[0]) * t, n[1] + (e[1] - n[1]) * t, n[2] + (e[2] - n[2]) * t], ee = (n, e) => Math.hypot(n[0] - e[0], n[1] - e[1], n[2] - e[2]);
function Ke(n, e, t, s) {
  const i = [];
  for (let o = 0; o <= s; o++) {
    const r = o / s, a = 1 - r;
    i.push([
      a * a * n[0] + 2 * a * r * e[0] + r * r * t[0],
      a * a * n[1] + 2 * a * r * e[1] + r * r * t[1],
      a * a * n[2] + 2 * a * r * e[2] + r * r * t[2]
    ]);
  }
  return i;
}
function Ye(n, e, t) {
  let s = [e, -n, 0], i = Math.hypot(s[0], s[1], s[2]);
  return i < 1e-9 && (s = [-t, 0, n], i = Math.hypot(s[0], s[1], s[2])), i < 1e-9 ? [0, 1, 0] : [s[0] / i, s[1] / i, s[2] / i];
}
function es(n, e, t) {
  const s = Math.max(n.hw, n.hh), i = s * t.loopScale * (1 + 0.5 * e), o = e * (Math.PI / 3), r = s + i * 0.35, a = n.pos[0] - Math.sin(o) * r, l = n.pos[1] + Math.cos(o) * r, c = o - Math.PI / 2, d = 0.35, h = Math.max(12, t.segments * 2), u = [];
  for (let p = 0; p <= h; p++) {
    const f = c + d + p / h * (2 * Math.PI - 2 * d);
    u.push([a + i * Math.cos(f), l + i * Math.sin(f), n.pos[2]]);
  }
  return u;
}
function Se(n, e, t) {
  let s = 0;
  for (; s < n.length && we(n[s], e, t); ) s++;
  if (s === 0 || s >= n.length) return n;
  let i = n[s - 1], o = n[s];
  for (let r = 0; r < 18; r++) {
    const a = Me(i, o, 0.5);
    we(a, e, t) ? i = a : o = a;
  }
  return [o, ...n.slice(s)];
}
function Ze(n, e, t) {
  return Se([...n].reverse(), e, t).reverse();
}
function Je(n, e, t, s, i, o, r) {
  let a;
  if (o)
    a = es(n, t, r);
  else {
    const l = (t - (s - 1) / 2) * r.spacing * (i ? -1 : 1);
    if (Math.abs(l) < 1e-6) a = [n.pos, e.pos];
    else {
      const c = e.pos[0] - n.pos[0], d = e.pos[1] - n.pos[1], h = r.dim3 ? e.pos[2] - n.pos[2] : 0, u = Ye(c, d, h), p = [(n.pos[0] + e.pos[0]) / 2, (n.pos[1] + e.pos[1]) / 2, (n.pos[2] + e.pos[2]) / 2], f = [p[0] + u[0] * 2 * l, p[1] + u[1] * 2 * l, p[2] + u[2] * 2 * l];
      a = Ke(n.pos, f, e.pos, r.segments);
    }
  }
  return a = Se(a, n, r.dim3), a = Ze(a, e, r.dim3), a;
}
function Ee(n) {
  let e = 0;
  for (let t = 1; t < n.length; t++) e += ee(n[t - 1], n[t]);
  return e;
}
function Qe(n, e) {
  if (n.length < 2 || Ee(n) <= e * 1.2) return n;
  const t = n.slice();
  let s = e;
  for (; t.length >= 2; ) {
    const i = t[t.length - 2], o = t[t.length - 1], r = ee(i, o);
    if (r > s + 1e-9)
      return t[t.length - 1] = Me(i, o, (r - s) / r), t;
    s -= r, t.pop();
  }
  return n;
}
function ue(n, e) {
  const t = Ee(n);
  if (t === 0) return n[0];
  let s = t * e;
  for (let i = 1; i < n.length; i++) {
    const o = ee(n[i - 1], n[i]);
    if (s <= o) return Me(n[i - 1], n[i], o === 0 ? 0 : s / o);
    s -= o;
  }
  return n[n.length - 1];
}
function et(n) {
  const e = n[n.length - 1];
  let t = n.length - 2;
  for (; t > 0 && ee(n[t], e) < 1e-6; ) t--;
  const s = n[Math.max(0, t)], i = ee(s, e) || 1;
  return { tip: e, dir: [(e[0] - s[0]) / i, (e[1] - s[1]) / i, (e[2] - s[2]) / i] };
}
function tt(n, e, t, s, i, o) {
  const r = i - t, a = o - s, l = r * r + a * a;
  let c = l === 0 ? 0 : ((n - t) * r + (e - s) * a) / l;
  return c = Math.max(0, Math.min(1, c)), Math.hypot(n - (t + c * r), e - (s + c * a));
}
const Os = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dist3: ee,
  distToSegment: tt,
  edgePath: Je,
  inside: we,
  isEllipseShape: Xe,
  nodeExtents: ke,
  normalTo: Ye,
  pathLength: Ee,
  pointAtFraction: ue,
  quadratic: Ke,
  shortenEnd: Qe,
  tipOf: et,
  trimEnd: Ze,
  trimStart: Se
}, Symbol.toStringTag, { value: "Module" })), ts = 0.58, ss = 1.25;
function ce(n, e, t) {
  const s = n.split(`
`).map((i) => Math.min(i.length, t));
  return { w: Math.max(0, ...s) * e * ts, h: s.length * e * ss };
}
function H(n, e) {
  return n.boxes?.get(e) ?? { w: n.spacing, h: n.spacing };
}
function is(n, e, t = !1) {
  const s = qe(n), i = e.label.show && n.nodes.length <= e.label.maxCount, o = /* @__PURE__ */ new Map();
  for (const r of n.nodes) {
    const a = _e(r, e, s);
    if (a.shape === "card") {
      const h = ce(r.label ?? r.id, e.card.size, 80), u = ce((r.body ?? []).join(`
`), e.card.size, 80), p = e.card.padding;
      o.set(r.id, { w: Math.max(h.w, u.w) + p * 3, h: (h.h + u.h) * 1.12 + p * 3 });
      continue;
    }
    const l = ke(a.shape, a.size, e.node.aspect);
    let c = l.hw * 2, d = l.hh * 2;
    if (i) {
      const h = ce(r.label ?? r.id, e.label.size, e.label.maxChars), u = r.sublabel ? ce(r.sublabel, e.label.subSize, e.label.maxChars) : { w: 0, h: 0 };
      c = Math.max(c, h.w, u.w), d += e.label.gap + h.h + u.h;
    }
    o.set(r.id, { w: c, h: d });
  }
  return o;
}
class st {
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
    this.n = s.length, this.k = t.idealLength, this.dim3 = t.dimension === "3d", this.gravity = t.gravity, this.rnd = re(t.seed), this.ids = s.map((l) => l.id), this.pos = new Float64Array(this.n * 3), this.disp = new Float64Array(this.n * 3), this.fixed = new Uint8Array(this.n);
    const i = this.k * (this.dim3 ? Math.cbrt(this.n) : Math.sqrt(this.n)) * 0.6 + this.k;
    s.forEach((l, c) => {
      this.index.set(l.id, c), this.pos[3 * c] = l.x ?? (this.rnd() * 2 - 1) * i, this.pos[3 * c + 1] = l.y ?? (this.rnd() * 2 - 1) * i, this.pos[3 * c + 2] = this.dim3 ? l.z ?? (this.rnd() * 2 - 1) * i : l.z ?? 0, l.pinned && (this.fixed[c] = 1);
    });
    const o = e.edges.filter((l) => l.source !== l.target);
    this.ea = new Int32Array(o.length), this.eb = new Int32Array(o.length), this.es = new Float64Array(o.length);
    const r = o.map((l) => e.weightOf(l)).filter((l) => l > 0).sort((l, c) => l - c), a = r.length ? r[Math.floor(r.length / 2)] : 1;
    o.forEach((l, c) => {
      this.ea[c] = this.index.get(l.source), this.eb[c] = this.index.get(l.target);
      const d = Math.max(e.weightOf(l), 1e-6), h = t.weightMode === "closer" ? a / d : t.weightMode === "longer" ? d / a : 1, u = Math.min(4, Math.max(0.25, h));
      this.es[c] = 1 / (u * u * u);
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
    const { n: e, k: t, dim3: s, pos: i, disp: o } = this, r = t * t;
    o.fill(0);
    const a = (c, d, h) => {
      let u = i[3 * c] - i[3 * d], p = i[3 * c + 1] - i[3 * d + 1], f = s ? i[3 * c + 2] - i[3 * d + 2] : 0, y = u * u + p * p + f * f;
      if (y > h) return;
      y < 1e-6 && (u = (this.rnd() - 0.5) * 0.1, p = (this.rnd() - 0.5) * 0.1, f = s ? (this.rnd() - 0.5) * 0.1 : 0, y = u * u + p * p + f * f + 1e-6);
      const w = r / y;
      o[3 * c] += u * w, o[3 * c + 1] += p * w, o[3 * c + 2] += f * w, o[3 * d] -= u * w, o[3 * d + 1] -= p * w, o[3 * d + 2] -= f * w;
    };
    if (e <= 400)
      for (let c = 0; c < e; c++) for (let d = c + 1; d < e; d++) a(c, d, 1 / 0);
    else {
      const c = t * 4, d = c * c, h = (g) => Math.max(-1e3, Math.min(1e3, Math.floor(g / c))), u = (g, m, v) => ((g + 1024) * 2048 + (m + 1024)) * 2048 + (v + 1024), p = /* @__PURE__ */ new Map(), f = new Int16Array(e), y = new Int16Array(e), w = new Int16Array(e);
      for (let g = 0; g < e; g++) {
        f[g] = h(i[3 * g]), y[g] = h(i[3 * g + 1]), w[g] = s ? h(i[3 * g + 2]) : 0;
        const m = u(f[g], y[g], w[g]), v = p.get(m);
        v ? v.push(g) : p.set(m, [g]);
      }
      const S = s ? 1 : 0;
      for (let g = 0; g < e; g++)
        for (let m = -1; m <= 1; m++)
          for (let v = -1; v <= 1; v++)
            for (let b = -S; b <= S; b++) {
              const x = p.get(u(f[g] + m, y[g] + v, w[g] + b));
              if (x)
                for (const E of x) E > g && a(g, E, d);
            }
    }
    for (let c = 0; c < this.ea.length; c++) {
      const d = this.ea[c], h = this.eb[c], u = i[3 * d] - i[3 * h], p = i[3 * d + 1] - i[3 * h + 1], f = s ? i[3 * d + 2] - i[3 * h + 2] : 0, w = Math.sqrt(u * u + p * p + f * f) / t * this.es[c];
      o[3 * d] -= u * w, o[3 * d + 1] -= p * w, o[3 * d + 2] -= f * w, o[3 * h] += u * w, o[3 * h + 1] += p * w, o[3 * h + 2] += f * w;
    }
    const l = this.temperature;
    for (let c = 0; c < e; c++) {
      if (this.fixed[c]) continue;
      o[3 * c] -= i[3 * c] * this.gravity, o[3 * c + 1] -= i[3 * c + 1] * this.gravity, s && (o[3 * c + 2] -= i[3 * c + 2] * this.gravity);
      const d = s ? o[3 * c + 2] : 0, h = Math.sqrt(o[3 * c] ** 2 + o[3 * c + 1] ** 2 + d * d);
      if (h < 1e-9) continue;
      const u = Math.min(h, l) / h;
      i[3 * c] += o[3 * c] * u, i[3 * c + 1] += o[3 * c + 1] * u, s && (i[3 * c + 2] += d * u);
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
function os(n, e) {
  const t = n.nodes.map((b) => b.id), s = new Map(t.map((b, x) => [b, x])), i = t.length, o = Array.from({ length: i }, () => []);
  for (const b of n.edges) {
    const x = s.get(b.source), E = s.get(b.target);
    x !== E && o[x].push(E);
  }
  const r = new Uint8Array(i), a = Array.from({ length: i }, () => []), l = [];
  for (let b = 0; b < i; b++) {
    if (r[b]) continue;
    const x = [[b, 0]];
    for (r[b] = 1, l.push(b); x.length; ) {
      const E = x[x.length - 1], z = E[0];
      if (E[1] < o[z].length) {
        const $ = o[z][E[1]++];
        r[$] === 0 ? (r[$] = 1, l.push($), a[z].push($), x.push([$, 0])) : r[$] === 1 ? a[$].push(z) : a[z].push($);
      } else
        r[z] = 2, x.pop();
    }
  }
  const c = new Int32Array(i);
  for (let b = 0; b < i; b++) for (const x of a[b]) c[x]++;
  const d = new Int32Array(i), h = [];
  for (let b = 0; b < i; b++) c[b] === 0 && h.push(b);
  for (let b = 0; b < h.length; b++) {
    const x = h[b];
    for (const E of a[x])
      d[E] = Math.max(d[E], d[x] + 1), --c[E] === 0 && h.push(E);
  }
  const u = [];
  for (const b of l) (u[d[b]] ??= []).push(b);
  const p = Array.from({ length: i }, () => []);
  for (let b = 0; b < i; b++) for (const x of a[b]) p[x].push(b);
  const f = new Float64Array(i);
  u.forEach((b) => b?.forEach((x, E) => f[x] = E));
  for (let b = 0; b < 8; b++) {
    const x = b % 2 === 0, E = u.map((z, $) => $);
    x || E.reverse();
    for (const z of E.slice(1)) {
      const $ = u[z];
      if (!$) continue;
      const N = /* @__PURE__ */ new Map();
      for (const D of $) {
        const O = x ? p[D] : a[D];
        N.set(D, O.length ? O.reduce((k, C) => k + f[C], 0) / O.length : f[D]);
      }
      $.sort((D, O) => N.get(D) - N.get(O)), $.forEach((D, O) => f[D] = O);
    }
  }
  const y = e.direction === "TB", w = (b) => y ? H(e, b).w : H(e, b).h, S = (b) => y ? H(e, b).h : H(e, b).w, g = /* @__PURE__ */ new Map();
  let m = 0, v = 0;
  return u.forEach((b, x) => {
    if (!b) return;
    const E = Math.max(...b.map((N) => S(t[N])));
    m += x === 0 ? E / 2 : v / 2 + e.gap * 2.2 + E / 2, v = E;
    let $ = -(b.reduce((N, D) => N + w(t[D]), 0) + e.gap * (b.length - 1)) / 2;
    for (const N of b) {
      const D = w(t[N]), O = $ + D / 2;
      $ += D + e.gap, g.set(t[N], y ? [O, -m, 0] : [m, -O, 0]);
    }
  }), g;
}
function Ce(n) {
  const e = /* @__PURE__ */ new Map();
  for (const t of n.nodes) t.group !== void 0 && !e.has(t.group) && e.set(t.group, e.size);
  return n.nodes.map((t, s) => ({ id: t.id, g: t.group === void 0 ? -1 : e.get(t.group), i: s })).sort((t, s) => t.g - s.g || t.i - s.i).map((t) => t.id);
}
function ze(n, e) {
  const t = H(n, e);
  return Math.hypot(t.w, t.h) * 0.75 + n.gap;
}
function ns(n, e) {
  const t = Ce(n), s = t.map((l) => ze(e, l)), i = s.reduce((l, c) => l + c, 0) || 1, o = Math.max(i / (2 * Math.PI), Math.max(0, ...s) * 0.5 || 1), r = /* @__PURE__ */ new Map();
  let a = 0;
  return t.forEach((l, c) => {
    const d = (a + s[c] / 2) / i * Math.PI * 2 - Math.PI / 2;
    a += s[c], r.set(l, [o * Math.cos(d), o * Math.sin(d), 0]);
  }), r;
}
function rs(n, e) {
  const t = Ce(n), s = t.length;
  let i = 0, o = 0;
  for (const u of t) {
    const p = H(e, u);
    i = Math.max(i, p.w), o = Math.max(o, p.h);
  }
  i += e.gap, o += e.gap;
  const r = !!e.dim3, a = r ? Math.max(1, Math.ceil(Math.cbrt(s))) : Math.max(1, Math.round(Math.sqrt(s * o / i))), l = r ? a : Math.ceil(s / a), c = r ? Math.ceil(s / (a * l)) : 1, d = Math.max(i, o), h = /* @__PURE__ */ new Map();
  return t.forEach((u, p) => {
    const f = p % a, y = Math.floor(p / a) % l, w = r ? Math.floor(p / (a * l)) : 0;
    h.set(u, [(f - (a - 1) / 2) * i, ((l - 1) / 2 - y) * o, r ? (w - (c - 1) / 2) * d : 0]);
  }), h;
}
function as(n, e) {
  const t = Ce(n), s = t.length, i = t.reduce((l, c) => l + ze(e, c), 0) / Math.max(s, 1) || 1, o = Math.max(i, i * Math.sqrt(s / (4 * Math.PI)) * 1.1), r = Math.PI * (3 - Math.sqrt(5)), a = /* @__PURE__ */ new Map();
  return t.forEach((l, c) => {
    const d = s === 1 ? 0 : 1 - c / (s - 1) * 2, h = Math.sqrt(Math.max(0, 1 - d * d)), u = r * c;
    a.set(l, [Math.cos(u) * h * o, d * o, Math.sin(u) * h * o]);
  }), a;
}
function ls(n, e) {
  const t = re(e.seed ?? 1), s = n.nodes.map((a) => a.id), o = (s.reduce((a, l) => a + ze(e, l), 0) / Math.max(s.length, 1) || 1) * Math.sqrt(s.length) * 0.9, r = /* @__PURE__ */ new Map();
  for (const a of s) r.set(a, [(t() * 2 - 1) * o, (t() * 2 - 1) * o, e.dim3 ? (t() * 2 - 1) * o : 0]);
  return r;
}
function ds(n, e) {
  const t = n.nodes.map((k) => k.id), s = t.length, i = /* @__PURE__ */ new Map();
  if (s === 0) return i;
  const o = new Map(t.map((k, C) => [k, C])), r = Array.from({ length: s }, () => []), a = new Int32Array(s), l = new Int32Array(s);
  for (const k of n.edges) {
    const C = o.get(k.source), L = o.get(k.target);
    C !== L && (l[C]++, l[L]++, r[C].push(L), n.isDirected(k) ? a[L]++ : r[L].push(C));
  }
  const c = new Int32Array(s).fill(-1), d = new Int32Array(s).fill(-1), h = Array.from({ length: s }, () => []), u = [], p = (k) => {
    u.push(k), d[k] = 0;
    const C = [k];
    for (let L = 0; L < C.length; L++) {
      const A = C[L];
      for (const I of r[A])
        d[I] === -1 && (d[I] = d[A] + 1, c[I] = A, h[A].push(I), C.push(I));
    }
  }, f = [...Array(s).keys()].filter((k) => a[k] === 0);
  a.some((k) => k > 0) || f.sort((k, C) => l[C] - l[k] || k - C);
  for (const k of f) d[k] === -1 && p(k);
  const y = (k) => {
    const C = /* @__PURE__ */ new Map([[k, 0]]), L = [k];
    let A = 0;
    for (let I = 0; I < L.length; I++) {
      const Y = L[I];
      for (const te of r[Y])
        d[te] !== -1 || C.has(te) || (C.set(te, C.get(Y) + 1), A = Math.max(A, C.get(te)), L.push(te));
    }
    return { reach: L.length, height: A };
  };
  for (; ; ) {
    const k = [...Array(s).keys()].filter((A) => d[A] === -1).sort((A, I) => l[I] - l[A] || A - I);
    if (!k.length) break;
    let C = k[0], L = { reach: -1, height: 0 };
    for (const A of k.slice(0, 8)) {
      const I = y(A);
      (I.reach > L.reach || I.reach === L.reach && I.height < L.height) && (C = A, L = I);
    }
    p(C);
  }
  const w = e.direction === "TB", S = (k) => w ? H(e, t[k]).w : H(e, t[k]).h, g = (k) => w ? H(e, t[k]).h : H(e, t[k]).w, m = [];
  for (const k of u) {
    const C = [k];
    for (; C.length; ) {
      const L = C.pop();
      m.push(L);
      for (let A = h[L].length - 1; A >= 0; A--) C.push(h[L][A]);
    }
  }
  const v = new Float64Array(s);
  for (let k = m.length - 1; k >= 0; k--) {
    const C = m[k], L = h[C], A = L.reduce((I, Y) => I + v[Y], 0) + e.gap * Math.max(0, L.length - 1);
    v[C] = Math.max(S(C), A);
  }
  const b = new Float64Array(s);
  let x = 0;
  for (const k of u)
    b[k] = x, x += v[k] + e.gap * 2;
  const E = x - e.gap * 2;
  for (const k of m) {
    const C = h[k];
    if (!C.length) continue;
    const L = C.reduce((I, Y) => I + v[Y], 0) + e.gap * (C.length - 1);
    let A = b[k] + (v[k] - L) / 2;
    for (const I of C)
      b[I] = A, A += v[I] + e.gap;
  }
  const z = new Float64Array(s);
  for (let k = m.length - 1; k >= 0; k--) {
    const C = m[k], L = h[C];
    z[C] = L.length ? (z[L[0]] + z[L[L.length - 1]]) / 2 : b[C] + v[C] / 2;
  }
  const $ = Math.max(...Array.from(d)), N = new Float64Array($ + 1);
  for (let k = 0; k < s; k++) N[d[k]] = Math.max(N[d[k]], g(k));
  const D = new Float64Array($ + 1);
  let O = 0;
  for (let k = 0; k <= $; k++)
    O += k === 0 ? N[0] / 2 : N[k - 1] / 2 + e.gap * 2.2 + N[k] / 2, D[k] = O;
  for (let k = 0; k < s; k++) {
    const C = z[k] - E / 2;
    i.set(t[k], w ? [C, -D[d[k]], 0] : [D[d[k]], -C, 0]);
  }
  return i;
}
const it = {
  dimension: "2d",
  spacing: 40,
  gap: 12,
  idealLength: 60,
  gravity: 0.05,
  weightMode: "ignore",
  direction: "TB",
  seed: 1,
  iterations: 300
}, Ds = ["force", "tree", "layered", "circle", "grid", "sphere", "random"];
function cs(n, e, t = {}) {
  const s = { ...it, ...t }, i = { spacing: s.spacing, gap: s.gap, boxes: s.boxes, dim3: s.dimension === "3d", seed: s.seed };
  switch (e) {
    case "circle":
      return ns(n, i);
    case "grid":
      return rs(n, i);
    case "sphere":
      return as(n, i);
    case "random":
      return ls(n, i);
    case "layered":
      return os(n, { ...i, direction: s.direction });
    case "tree":
      return ds(n, { ...i, direction: s.direction });
    case "force": {
      const o = new st(n, s);
      for (let r = 0; r < s.iterations && o.alpha > 0.02; r++) o.step();
      return new Map(o.entries());
    }
  }
}
function De(n, e, t, s) {
  const i = re(s), o = e === "3d", r = (c) => c.x !== void 0 && c.y !== void 0, a = t * Math.sqrt(Math.max(n.nodes.length, 1)) * 0.6 + t;
  let l = 0;
  for (const c of n.nodes) {
    if (r(c)) {
      c.z === void 0 && (c.z = 0);
      continue;
    }
    let d;
    for (const u of n.edges) {
      const p = u.source === c.id ? n.getNode(u.target) : u.target === c.id ? n.getNode(u.source) : void 0;
      if (p && p !== c && r(p)) {
        d = { x: p.x, y: p.y, z: p.z ?? 0 };
        break;
      }
    }
    const h = d ? t * 0.6 : a;
    c.x = (d?.x ?? 0) + (i() * 2 - 1) * h, c.y = (d?.y ?? 0) + (i() * 2 - 1) * h, c.z = o ? (d?.z ?? 0) + (i() * 2 - 1) * h : d?.z ?? 0, l++;
  }
  return l;
}
const he = 4096;
function hs(n, e, t, s, i, o) {
  n.beginPath(), typeof n.roundRect == "function" ? n.roundRect(e, t, s, i, o) : n.rect(e, t, s, i);
}
class us {
  constructor(e = 4) {
    this.resolution = e;
  }
  map = /* @__PURE__ */ new Map();
  clear() {
    for (const e of this.map.values()) e.texture.dispose();
    this.map.clear();
  }
  make(e) {
    const t = new M.CanvasTexture(e);
    return t.colorSpace = M.SRGBColorSpace, t.anisotropy = 4, t;
  }
  /**
   * Label texture. `text` may contain line breaks; `sub` adds a smaller second block below
   * (its own size and color) that is also allowed to contain line breaks.
   */
  text(e, t, s) {
    const i = JSON.stringify(["t", e, t, s ?? null, this.resolution]), o = this.map.get(i);
    if (o) return o;
    const r = this.resolution, a = (w) => w.length > t.maxChars ? w.slice(0, Math.max(1, t.maxChars - 1)) + "…" : w, l = [
      ...e.split(`
`).map((w) => ({ t: a(w), px: t.size * r, color: t.color })),
      ...s?.text ? s.text.split(`
`).map((w) => ({ t: a(w), px: s.size * r, color: s.color })) : []
    ], c = t.padding * r, d = document.createElement("canvas");
    let h = d.getContext("2d"), u = 0, p = 0;
    for (const w of l)
      h.font = `${w.px}px ${t.font}`, u = Math.max(u, h.measureText(w.t).width), p += w.px * 1.25;
    d.width = Math.min(he, Math.max(2, Math.ceil(u + c * 2))), d.height = Math.min(he, Math.max(2, Math.ceil(p + c * 2))), h = d.getContext("2d"), h.textAlign = "center", h.textBaseline = "middle", t.background && (h.fillStyle = t.background, hs(h, 0, 0, d.width, d.height, t.size * r * 0.25), h.fill());
    let f = c;
    for (const w of l) {
      const S = w.px * 1.25;
      h.font = `${w.px}px ${t.font}`, h.fillStyle = w.color, h.fillText(w.t, d.width / 2, f + S / 2), f += S;
    }
    const y = { texture: this.make(d), w: d.width / r, h: d.height / r };
    return this.map.set(i, y), y;
  }
  /** Round badge with an arrow pointing to the upper right ("opens something"). One unit wide and high. */
  badge(e) {
    const t = JSON.stringify(["b", e]), s = this.map.get(t);
    if (s) return s;
    const i = 64, o = document.createElement("canvas");
    o.width = o.height = i;
    const r = o.getContext("2d");
    r.fillStyle = e, r.beginPath(), r.arc(i / 2, i / 2, i / 2 - 2, 0, Math.PI * 2), r.fill(), r.lineWidth = 3, r.strokeStyle = "#ffffff", r.stroke(), r.lineWidth = 6, r.lineCap = "round", r.lineJoin = "round", r.beginPath(), r.moveTo(22, 42), r.lineTo(42, 22), r.moveTo(26, 22), r.lineTo(42, 22), r.lineTo(42, 38), r.stroke();
    const a = { texture: this.make(o), w: 1, h: 1 };
    return this.map.set(t, a), a;
  }
  /** UML-like card: title in a header band, body lines below; a line `---` draws a separator. */
  card(e, t, s) {
    const i = s.card, o = e.label ?? e.id, r = e.body ?? [], a = JSON.stringify(["c", o, r, t.color, i, this.resolution]), l = this.map.get(a);
    if (l) return l;
    const c = this.resolution, d = i.size * c, h = d * 1.4, u = i.padding * c, p = document.createElement("canvas").getContext("2d"), f = o.split(`
`);
    p.font = `bold ${d}px ${i.font}`;
    const y = Math.max(...f.map((z) => p.measureText(z).width));
    p.font = `${d}px ${i.font}`;
    const w = r.length ? Math.max(...r.map((z) => z === "---" ? 0 : p.measureText(z).width)) : 0, S = Math.min(he, Math.ceil(Math.max(y, w) + u * 3)), g = f.length * h + u * 1.5, m = r.length ? r.length * h + u * 1.5 : 0, v = Math.min(he, Math.ceil(g + m)), b = document.createElement("canvas");
    b.width = Math.max(2, S), b.height = Math.max(2, v);
    const x = b.getContext("2d");
    x.fillStyle = i.background, x.fillRect(0, 0, b.width, b.height), x.fillStyle = i.headerBackground ?? t.color, x.fillRect(0, 0, b.width, g), x.textBaseline = "middle", x.textAlign = "center", x.font = `bold ${d}px ${i.font}`, x.fillStyle = i.headerColor, f.forEach((z, $) => x.fillText(z, b.width / 2, u * 0.75 + h * ($ + 0.5))), x.textAlign = "left", x.font = `${d}px ${i.font}`, r.forEach((z, $) => {
      const N = g + u * 0.75 + h * ($ + 0.5);
      z === "---" ? (x.strokeStyle = i.border, x.lineWidth = Math.max(1, c * 0.3), x.beginPath(), x.moveTo(0, N), x.lineTo(b.width, N), x.stroke()) : (x.fillStyle = i.textColor, x.fillText(z, u * 1.5, N));
    }), x.strokeStyle = i.border, x.lineWidth = Math.max(2, c * 0.5), x.strokeRect(0, 0, b.width, b.height);
    const E = { texture: this.make(b), w: b.width / c, h: b.height / c };
    return this.map.set(a, E), E;
  }
}
const ps = `
.gs-container{position:relative;overflow:hidden}
.gs-root{position:absolute;inset:0;overflow:hidden;font-family:var(--gs-font,system-ui,sans-serif);color:var(--gs-panel-fg,#1f2933);touch-action:none;user-select:none;-webkit-user-select:none}
.gs-root canvas{display:block;outline:none}
.gs-tooltip{position:absolute;z-index:3;pointer-events:none;max-width:260px;padding:6px 9px;font-size:12px;line-height:1.35;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px);box-shadow:0 2px 8px rgba(0,0,0,.18);white-space:pre-wrap;overflow-wrap:anywhere}
.gs-tooltip[hidden]{display:none}
.gs-search{position:absolute;z-index:2;left:10px;top:10px;display:flex;align-items:center;gap:6px;height:32px;padding:0 6px 0 9px;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px)}
.gs-search:focus-within{border-color:var(--gs-accent,#e8590c)}
.gs-search input{width:150px;max-width:38vw;min-width:0;border:0;outline:0;background:transparent;color:inherit;font:inherit;font-size:13px}
.gs-search-count{font-size:12px;opacity:.7;white-space:nowrap}
.gs-search-clear{border:0;background:transparent;color:inherit;font-size:18px;line-height:1;cursor:pointer;padding:0 4px;opacity:.7}
.gs-search-clear:hover{opacity:1}
.gs-search-clear[hidden]{display:none}
.gs-help{position:absolute;z-index:4;right:52px;bottom:10px;width:min(360px,calc(100% - 70px));max-height:calc(100% - 20px);overflow:auto;padding:10px 12px;font-size:12px;line-height:1.4;background:var(--gs-panel-bg,rgba(255,255,255,.98));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px);box-shadow:0 4px 14px rgba(0,0,0,.22);user-select:text;-webkit-user-select:text}
.gs-help-title{font-weight:700;font-size:13px;margin-bottom:6px}
.gs-help-row{display:grid;grid-template-columns:42% 1fr;gap:8px;padding:3px 0;border-top:1px solid var(--gs-panel-border,#cfd6de)}
.gs-help-row b{font-weight:600}
.gs-tt-title{font-weight:600}
.gs-tt-muted{opacity:.7}
.gs-tt-hint{margin-top:3px;color:var(--gs-accent,#e8590c)}
.gs-chip{position:absolute;z-index:2;height:26px;padding:0 11px;font:600 12px var(--gs-font,system-ui,sans-serif);cursor:pointer;white-space:nowrap;background:var(--gs-panel-bg,#fff);color:var(--gs-panel-fg,#1f2933);border:1.5px solid var(--gs-accent,#e8590c);border-radius:13px;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.gs-chip[hidden]{display:none}
.gs-chip:hover{background:var(--gs-accent,#e8590c);color:#fff}
.gs-chip:focus-visible{outline:2px solid var(--gs-accent,#e8590c);outline-offset:2px}
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
function fs() {
  if (typeof document > "u" || document.getElementById("gs-styles")) return;
  const n = document.createElement("style");
  n.id = "gs-styles", n.textContent = ps, document.head.appendChild(n);
}
const Q = 400, gs = new M.Vector3(1, 0, 0), Te = { x: 0, y: 1, z: 2 }, Pe = { x: "#e03131", y: "#2f9e44", z: "#1c7ed6" }, Fe = new M.Quaternion(), ms = 4;
class Ts {
  events = new Re();
  config;
  _graph;
  userConfig;
  container;
  root;
  canvas;
  renderer;
  scene = new M.Scene();
  persp;
  ortho;
  camera;
  controls;
  orbit = null;
  disposeControls = () => {
  };
  pointerIsDown = !1;
  activeUntil = 0;
  ambient = new M.AmbientLight(16777215, 1.8);
  headlight = new M.DirectionalLight(16777215, 1.6);
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
  searchIndex = null;
  searchEl = null;
  searchInput = null;
  searchCount = null;
  searchText = "";
  searchActive = !1;
  helpEl = null;
  helpButton = null;
  pointerInside = !1;
  chipEl;
  chipTarget = null;
  // transform gizmo: TransformControls attached to an invisible pivot at the center of the selection
  tc = null;
  tcHelper = null;
  pivot = new M.Object3D();
  gizmoMode = "translate";
  gizmoDragging = !1;
  gizmoStart = null;
  snapHeld = !1;
  panelEl = null;
  tmpM = new M.Matrix4();
  tmpV = new M.Vector3();
  tmpV2 = new M.Vector3();
  tmpQ = new M.Quaternion();
  tmpS = new M.Vector3();
  raycaster = new M.Raycaster();
  plane = new M.Plane();
  constructor(e, t = {}, s) {
    this.container = e, this.userConfig = t, this.config = fe(t), this._graph = s instanceof pe ? s : new pe(s), this.config.ui.injectStyles && fs(), e.classList.add("gs-container"), this.root = document.createElement("div"), this.root.className = "gs-root", e.appendChild(this.root), this.renderer = new M.WebGLRenderer({ antialias: this.config.render.antialias, alpha: !0 }), this.renderer.setClearColor(0, 0), this.canvas = this.renderer.domElement, this.root.appendChild(this.canvas), this.tex = new us(this.config.label.resolution), this.persp = new M.PerspectiveCamera(this.config.camera.fov, 1, 1, 1e5), this.ortho = new M.OrthographicCamera(-1, 1, 1, -1, 0.1, 1e4), this.camera = this.config.dimension === "3d" ? this.persp : this.ortho, this.scene.add(this.ambient, this.headlight, this.headlight.target, this.pivot), this.tooltipEl = document.createElement("div"), this.tooltipEl.className = "gs-tooltip gs-ui", this.tooltipEl.hidden = !0, this.boxEl = document.createElement("div"), this.boxEl.className = "gs-box", this.boxEl.hidden = !0, this.chipEl = document.createElement("button"), this.chipEl.type = "button", this.chipEl.className = "gs-chip gs-ui", this.chipEl.hidden = !0, this.chipEl.addEventListener("click", () => {
      this.chipTarget && this.openLink(this.chipTarget.kind, this.chipTarget.id);
    }), this.root.append(this.tooltipEl, this.boxEl, this.chipEl), this.setupCamera(), this.buildControls(), this.buildSearch(), this.applyAppearance(), this.root.addEventListener("pointerdown", this.onPointerDown, !0), this.root.addEventListener("pointermove", this.onPointerMove), this.root.addEventListener("pointerup", this.onPointerUp), this.root.addEventListener("pointercancel", this.onPointerUp), this.root.addEventListener("pointerleave", this.onPointerLeave), this.root.addEventListener("pointerenter", () => {
      this.pointerInside = !0;
    }), this.root.addEventListener("dblclick", this.onDblClick), this.root.addEventListener("wheel", this.onWheel, { passive: !0 }), window.addEventListener("keydown", this.onKeyDown), window.addEventListener("keyup", this.onKeyUp), window.addEventListener("blur", this.onBlur), document.addEventListener("fullscreenchange", this.onFullscreenChange), typeof ResizeObserver < "u" && (this.ro = new ResizeObserver(() => this.resize()), this.ro.observe(e)), this.subscribe(), this.resize(), this.afterLoad();
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
    this.stopLayout(), this.unsubGraph(), e instanceof pe ? this._graph = e : this._graph.load(e, !1), this.subscribe(), this.selNodes.clear(), this.selEdges.clear(), this.hoverNode = this.hoverEdge = null;
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
  /** Deep-merges a patch into the user config and re-applies everything (theme, colors, labels, buttons, ...). */
  setConfig(e) {
    const { dimension: t, ...s } = e;
    this.applyUserConfig(ne(this.userConfig, s)), t !== void 0 && this.setDimension(t);
  }
  /**
   * Replaces the whole user config (instead of merging into it): keys that are missing fall back to the
   * theme and the defaults again. The current dimension is kept unless the new config names one.
   */
  setUserConfig(e) {
    const { dimension: t, ...s } = e;
    this.applyUserConfig({ ...s, dimension: this.config.dimension }), t !== void 0 && this.setDimension(t);
  }
  applyUserConfig(e) {
    const t = this.config.camera.rotation;
    this.userConfig = e, this.config = fe(this.userConfig), this.tex.resolution = this.config.label.resolution, this.tex.clear(), this.persp.fov = this.config.camera.fov, this.persp.updateProjectionMatrix(), this.config.dimension === "3d" && this.config.camera.rotation !== t && this.setupCamera(!0), this.orbit && (this.orbit.enableDamping = this.config.camera.damping), this.applyControlLimits(), this.applyAppearance(), this.buildControls(), this.buildSearch(), this.closeHelp(), this.setupGizmo(), this.dirtyStructure = !0, this.requestRender();
  }
  getDimension() {
    return this.config.dimension;
  }
  setDimension(e) {
    e !== this.config.dimension && (this.stopLayout(), this.userConfig = ne(this.userConfig, { dimension: e }), this.config = fe(this.userConfig), this.camera = e === "3d" ? this.persp : this.ortho, this.setupCamera(), this.resize(), this.dirtyStructure = !0, this.pendingFit = this.config.camera.autoFit, this.dimButton && (this.dimButton.textContent = e === "2d" ? "3D" : "2D"), this.events.emit("dimensionchange", { dimension: e }), this.requestRender());
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
    De(s, i.dimension, i.layout.idealLength, i.layout.seed);
    const o = {
      ...it,
      dimension: i.dimension,
      spacing: i.layout.spacing,
      idealLength: i.layout.idealLength,
      gravity: i.layout.gravity,
      weightMode: i.layout.weightMode,
      direction: i.layout.direction,
      seed: i.layout.seed,
      gap: i.layout.gap,
      boxes: is(s, i, i.dimension === "3d"),
      ...t
    };
    if (this.events.emit("layoutstart", { name: e }), e === "force")
      return this.sim = new st(s, o), this.simName = e, this.requestRender(), new Promise((a) => {
        this.simResolve = a;
      });
    const r = cs(s, e, o);
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
  /** Frames the whole graph, or only the given nodes. */
  fit(e) {
    const t = e ? e.map((v) => this.nodeInfo.get(v)).filter((v) => !!v) : [...this.nodeInfo.values()], s = !!e, i = this.camera, o = this.config.dimension === "3d";
    if (t.length === 0) {
      this.controls.target.set(0, 0, 0), o ? this.persp.position.set(0, 0, 300) : (this.ortho.zoom = 1, this.ortho.position.set(0, 0, 1e3)), this.ortho.updateProjectionMatrix(), this.controls.update(), this.requestRender();
      return;
    }
    let r = 1 / 0, a = 1 / 0, l = 1 / 0, c = -1 / 0, d = -1 / 0, h = -1 / 0;
    for (const v of t) {
      const [b, x, E] = v.body.pos;
      r = Math.min(r, b - v.body.hw), c = Math.max(c, b + v.body.hw), a = Math.min(a, x - v.body.hh), d = Math.max(d, x + v.body.hh), l = Math.min(l, E), h = Math.max(h, E);
    }
    const u = (r + c) / 2, p = (a + d) / 2, f = (l + h) / 2, y = this.config.camera.fitPadding, w = s ? 90 : 10, S = Math.max(c - r, w), g = Math.max(d - a, w), m = h - l;
    if (o) {
      const v = Math.max(0.5 * Math.hypot(S, g, m), w / 2), b = M.MathUtils.degToRad(this.persp.fov) / 2, x = Math.atan(Math.tan(b) * (this.width / this.height)), E = v / Math.sin(Math.min(b, x)) * y * 0.8, z = this.tmpV.copy(i.position).sub(this.controls.target);
      z.lengthSq() < 1e-9 && z.set(0, 0, 1), z.normalize(), this.controls.target.set(u, p, f), i.position.set(u, p, f).addScaledVector(z, E);
    } else {
      const v = this.width / this.height, b = Math.min(Q * v / S, Q / g) / y;
      this.ortho.zoom = Math.min(this.config.camera.zoomMax, Math.max(this.config.camera.zoomMin, b)), this.ortho.position.set(u, p, 1e3), this.controls.target.set(u, p, 0), this.ortho.updateProjectionMatrix();
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
    this.tool = e, this.canvas.style.cursor = e === "connect" ? "crosshair" : "", this.syncGizmo();
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
  /** Icon button like in video players: four corners pointing out (enter) or in (exit). */
  updateFullscreenButton() {
    const e = this.fsButton;
    if (!e) return;
    const t = this.isFullscreen, s = t ? "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" : "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5";
    e.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${s}"/></svg>`;
    const i = t ? "Exit full screen" : "Full screen";
    e.title = i, e.setAttribute("aria-label", i);
  }
  onFullscreenChange = () => {
    if (this.disposed) return;
    const e = this.isFullscreen;
    this.updateFullscreenButton(), this.resize(), this.events.emit("fullscreenchange", { fullscreen: e });
  };
  /** Opens the url of a node or edge according to `links` (self / blank / panel / event). */
  openLink(e, t) {
    const s = e === "node" ? this._graph.getNode(t) : this._graph.getEdge(t), i = J(s?.url, this.config.links);
    if (!s || !s.url || !i) return !1;
    const o = { url: s.url, resolved: i, kind: e, id: t, handled: !1 };
    if (this.events.emit("link", o), o.handled || this.config.links.target === "event") return !0;
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
    const i = s.getContext("2d"), o = this.config.background;
    if (!o.transparent) {
      if (o.gradientTo) {
        const r = i.createLinearGradient(0, 0, 0, s.height);
        r.addColorStop(0, o.color), r.addColorStop(1, o.gradientTo), i.fillStyle = r;
      } else i.fillStyle = o.color;
      i.fillRect(0, 0, s.width, s.height);
    }
    return i.drawImage(this.canvas, 0, 0), s.toDataURL(e, t);
  }
  resize() {
    const e = Math.max(1, this.container.clientWidth), t = Math.max(1, this.container.clientHeight);
    this.width = e, this.height = t, this.renderer.setPixelRatio(this.config.render.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2)), this.renderer.setSize(e, t);
    const s = e / t;
    this.persp.aspect = s, this.persp.updateProjectionMatrix(), this.ortho.left = -Q * s / 2, this.ortho.right = Q * s / 2, this.ortho.top = Q / 2, this.ortho.bottom = -Q / 2, this.ortho.updateProjectionMatrix();
    for (const i of this.buckets) i.mesh.material.resolution.set(e, t);
    this.controls && !this.orbit && this.controls.handleResize(), this.dirtyLabels = !0, this.requestRender();
  }
  destroy() {
    this.disposed = !0, cancelAnimationFrame(this.raf), cancelAnimationFrame(this.hoverRaf), this.ro?.disconnect(), this.unsubGraph(), this.stopLayout(), this.root.removeEventListener("pointerdown", this.onPointerDown, !0), window.removeEventListener("keydown", this.onKeyDown), window.removeEventListener("keyup", this.onKeyUp), window.removeEventListener("blur", this.onBlur), document.removeEventListener("fullscreenchange", this.onFullscreenChange), this.container.classList.remove("gs-pseudo-fullscreen"), this.setAxisGuide(null), this.disposeGizmo(), this.disposeControls(), this.clearScene();
    for (const e of this.geoms.values()) e.dispose();
    this.tex.clear(), this.renderer.dispose(), this.root.remove(), this.container.classList.remove("gs-container"), this.events.clear();
  }
  // ------------------------------------------------------------------ setup helpers
  subscribe() {
    this.unsubGraph = this._graph.events.on("change", this.onGraphChange);
  }
  onGraphChange = (e) => {
    e.kind === "position" ? this.dirtyPositions = !0 : (this.sim && this.stopLayout(), this.searchIndex = null, this.dirtyStructure = !0), this.requestRender();
  };
  afterLoad() {
    const e = this._graph.nodes.some((t) => t.x === void 0 || t.y === void 0);
    this.pendingFit = this.config.camera.autoFit, this.pendingLayout = e && this.config.layout.autoRun, this.dirtyStructure = !0, this.requestRender();
  }
  /** @param preserve keep the current camera pose (used when only the control scheme changes) */
  setupCamera(e = !1) {
    const t = this.config.dimension === "3d", s = t && this.config.camera.rotation === "free", i = this.controls ? this.controls.target.clone() : null;
    if (this.disposeControls(), this.camera = t ? this.persp : this.ortho, e || (t ? this.persp.position.set(0, 0, 300) : (this.ortho.position.set(0, 0, 1e3), this.ortho.zoom = 1)), t && this.persp.up.set(0, 1, 0), s) {
      const o = new nt(this.camera, this.canvas);
      o.rotateSpeed = 2.5, o.zoomSpeed = 1.2, o.panSpeed = 0.8, o.staticMoving = !1, o.dynamicDampingFactor = 0.12, o.keys = ["", "", ""], o.addEventListener("change", this.onCameraChange), this.disposeControls = () => {
        o.removeEventListener("change", this.onCameraChange), o.dispose();
      }, this.orbit = null, this.controls = o;
    } else {
      const o = new ot(this.camera, this.canvas);
      o.enableDamping = this.config.camera.damping, o.zoomToCursor = !0, o.addEventListener("change", this.onCameraChange), t ? (o.mouseButtons = { LEFT: M.MOUSE.ROTATE, MIDDLE: M.MOUSE.DOLLY, RIGHT: M.MOUSE.PAN }, o.touches = { ONE: M.TOUCH.ROTATE, TWO: M.TOUCH.DOLLY_PAN }) : (o.enableRotate = !1, o.screenSpacePanning = !0, o.mouseButtons = { LEFT: M.MOUSE.PAN, MIDDLE: M.MOUSE.DOLLY, RIGHT: M.MOUSE.PAN }, o.touches = { ONE: M.TOUCH.PAN, TWO: M.TOUCH.DOLLY_PAN }), this.disposeControls = () => {
        o.removeEventListener("change", this.onCameraChange), o.dispose();
      }, this.orbit = o, this.controls = o;
    }
    e && i && this.controls.target.copy(i), this.applyControlLimits(), this.controls.update(), this.setupGizmo();
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
    const t = (s, i, o) => {
      const r = document.createElement("button");
      return r.type = "button", r.className = "gs-btn", r.textContent = s, r.title = i, r.setAttribute("aria-label", i), r.addEventListener("click", o), e.appendChild(r), r;
    };
    t("+", "Zoom in", () => this.zoomBy(1.4)), t("−", "Zoom out", () => this.zoomBy(1 / 1.4)), t("Fit", "Fit graph to view", () => this.fit()), this.dimButton = t(this.config.dimension === "2d" ? "3D" : "2D", "Switch between 2D and 3D", () => {
      this.setDimension(this.config.dimension === "2d" ? "3d" : "2d");
    }), this.fsButton = null, this.config.ui.fullscreen && (this.fsButton = t("", "Full screen", () => {
      this.toggleFullscreen();
    }), this.updateFullscreenButton()), this.helpButton = null, this.config.ui.help && (this.helpButton = t("?", "Help: the controls of this view", () => this.toggleHelp()), this.helpButton.classList.add("gs-help-btn")), this.root.appendChild(e), this.controlsEl = e;
  }
  // ------------------------------------------------------------------ render loop
  requestRender() {
    this.raf || this.disposed || (this.raf = requestAnimationFrame(this.tick));
  }
  tick = () => {
    this.raf = 0, !this.disposed && (this.frame(), (this.sim || this.needsContinuousFrames) && this.requestRender());
  };
  frame() {
    this.sim && this.stepSimulation(), this.dirtyStructure && this.rebuildStructure(), this.pendingFit && (this.pendingFit = !1, this.fit()), this.pendingLayout && (this.pendingLayout = !1, this.runLayout()), this.dirtyPositions && this.updatePositions(), this.dirtyNodes && (this.dirtyNodes = !1, this.updateNodeInstances()), this.dirtyEdges && (this.dirtyEdges = !1, this.writeEdges()), this.dirtyLabels && (this.dirtyLabels = !1, this.updateLabels()), this.controls.update(), this.updateChip(), this.config.dimension === "3d" && (this.headlight.position.copy(this.persp.position), this.headlight.target.position.copy(this.controls.target), this.headlight.target.updateMatrixWorld()), this.renderer.render(this.scene, this.camera);
  }
  stepSimulation() {
    const e = this.sim;
    if (!e) return;
    const t = this._graph.nodes.length, s = t <= 1500 ? 3 : t <= 5e3 ? 2 : 1;
    for (const i of this.dragIds) {
      const o = this._graph.getNode(i);
      o && e.pin(i, [o.x ?? 0, o.y ?? 0, o.z ?? 0]);
    }
    for (let i = 0; i < s; i++) e.step();
    e.commit(this._graph), e.alpha < 0.02 && this.stopLayout(!0);
  }
  // ------------------------------------------------------------------ scene construction
  color(e) {
    let t = this.colors.get(e);
    return t || (t = new M.Color(e), this.colors.set(e, t)), t;
  }
  geometryFor(e) {
    let t = this.geoms.get(e);
    if (t) return t;
    switch (e) {
      case "circle3d":
        t = new M.SphereGeometry(0.5, 24, 16);
        break;
      case "square3d":
      case "rectangle3d":
        t = new M.BoxGeometry(1, 1, 1);
        break;
      case "diamond3d":
        t = new M.OctahedronGeometry(0.62);
        break;
      case "hexagon3d":
        t = new M.CylinderGeometry(0.5, 0.5, 1, 6), t.rotateX(Math.PI / 2), t.rotateZ(Math.PI / 2);
        break;
      case "triangle3d":
        t = new M.CylinderGeometry(0.5, 0.5, 1, 3), t.rotateX(-Math.PI / 2);
        break;
      case "square":
      case "rectangle":
        t = new M.PlaneGeometry(1, 1);
        break;
      case "diamond":
        t = new M.CircleGeometry(0.5, 4);
        break;
      case "hexagon":
        t = new M.CircleGeometry(0.5, 6);
        break;
      case "triangle":
        t = new M.CircleGeometry(0.5, 3), t.rotateZ(Math.PI / 2);
        break;
      case "arrow":
        t = new M.ConeGeometry(0.5, 1, 14), t.rotateZ(-Math.PI / 2), t.translate(-0.5, 0, 0);
        break;
      default:
        t = new M.CircleGeometry(0.5, 40);
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
    for (const e of this.nodeInfo.values())
      e.sprite && this.dropSprite(e.sprite), e.badge && this.dropSprite(e.badge);
    for (const e of this.edgeInfo.values())
      e.sprite && this.dropSprite(e.sprite), e.badge && this.dropSprite(e.badge);
    this.nodeInfo.clear(), this.edgeInfo.clear();
  }
  dropSprite(e) {
    this.scene.remove(e), e.material.dispose();
  }
  makeSprite(e, t) {
    const s = this.config.dimension === "3d", i = new M.SpriteMaterial({ map: e.texture, transparent: !0, depthTest: s, depthWrite: !1 }), o = new M.Sprite(i);
    return o.renderOrder = t, o.frustumCulled = !1, this.scene.add(o), o;
  }
  rebuildStructure() {
    this.dirtyStructure = !1, this.clearScene();
    const e = this.config, t = this._graph, s = e.dimension === "3d";
    De(t, e.dimension, e.layout.idealLength, e.layout.seed);
    for (const h of [...this.selNodes]) t.hasNode(h) || this.selNodes.delete(h);
    for (const h of [...this.selEdges]) t.getEdge(h) || this.selEdges.delete(h);
    this.hoverNode && !t.hasNode(this.hoverNode) && (this.hoverNode = null), this.hoverEdge && !t.getEdge(this.hoverEdge) && (this.hoverEdge = null);
    const i = qe(t), o = /* @__PURE__ */ new Map();
    for (const h of t.nodes) {
      const u = _e(h, e, i), p = ke(u.shape, u.size, e.node.aspect), f = {
        node: h,
        style: u,
        body: { pos: [0, 0, 0], hw: p.hw, hh: p.hh, ellipse: Xe(u.shape) },
        layerKey: null,
        layer: null,
        slot: -1
      };
      if (u.shape === "card")
        f.card = this.tex.card(h, u, e), f.body.hw = f.card.w / 2, f.body.hh = f.card.h / 2, f.body.ellipse = !1, s && (f.body.hw = f.body.hh = Math.max(f.body.hw, f.body.hh)), f.sprite = this.makeSprite(f.card, 4);
      else {
        f.layerKey = s ? `${u.shape}3d` : u.shape;
        const y = o.get(f.layerKey) ?? [];
        y.push(f), o.set(f.layerKey, y);
      }
      this.nodeInfo.set(h.id, f);
    }
    for (const [h, u] of o) {
      const p = this.geometryFor(h), f = s ? new M.MeshLambertMaterial() : new M.MeshBasicMaterial();
      this.applyMode(f, e.node.opacity);
      const y = new M.MeshBasicMaterial({ side: s ? M.BackSide : M.FrontSide });
      this.applyMode(y, e.node.opacity);
      const w = new M.InstancedMesh(p, f, u.length), S = new M.InstancedMesh(p, y, u.length);
      for (const m of [w, S])
        m.frustumCulled = !1, m.instanceMatrix.setUsage(M.DynamicDrawUsage);
      S.renderOrder = 3, w.renderOrder = 4;
      const g = { key: h, body: w, outline: S };
      u.forEach((m, v) => {
        m.layer = g, m.slot = v, w.setColorAt(v, this.color(m.style.color)), S.setColorAt(v, this.color(m.style.borderColor));
      }), this.layers.set(h, g), this.scene.add(S, w);
    }
    if (e.label.show && t.nodes.length <= e.label.maxCount)
      for (const h of this.nodeInfo.values()) {
        if (h.card) continue;
        const u = h.node.sublabel ? { text: h.node.sublabel, size: e.label.subSize, color: e.label.subColor } : void 0, p = this.tex.text(h.node.label ?? h.node.id, { ...e.label, color: h.style.labelColor }, u);
        h.sprite = this.makeSprite(p, 5);
      }
    let r = 1 / 0, a = -1 / 0;
    for (const h of t.edges) {
      const u = t.weightOf(h);
      r = Math.min(r, u), a = Math.max(a, u);
    }
    const l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
    let d = 0;
    for (const h of t.edges) {
      const u = t.weightOf(h), p = xt(h, u, e, { min: r, max: a }), f = h.source === h.target, y = {
        edge: h,
        style: p,
        weight: u,
        directed: t.isDirected(h),
        index: 0,
        count: 1,
        flip: !f && h.source > h.target,
        self: f,
        path: [],
        arrowSlot: -1,
        bucketKey: `${p.width}|${p.dashed ? 1 : 0}`
      }, w = f ? `s\0${h.source}` : h.source < h.target ? `${h.source}\0${h.target}` : `${h.target}\0${h.source}`, S = l.get(w) ?? [];
      S.push(y), l.set(w, S), this.edgeInfo.set(h.id, y), y.directed && e.edge.arrows && (y.arrowSlot = d++);
      let g = c.get(y.bucketKey);
      if (!g) {
        const m = new at({
          color: 16777215,
          linewidth: p.width,
          vertexColors: !0,
          dashed: p.dashed,
          dashSize: e.edge.dashSize,
          gapSize: e.edge.gapSize
        });
        m.resolution.set(this.width, this.height), this.applyMode(m, e.edge.opacity);
        const v = new lt(new Le(), m);
        v.frustumCulled = !1, v.renderOrder = 1, v.visible = !1, this.scene.add(v), g = { key: y.bucketKey, mesh: v, edges: [], dashed: p.dashed }, c.set(y.bucketKey, g);
      }
      g.edges.push(y);
    }
    for (const h of l.values()) h.forEach((u, p) => {
      u.index = p, u.count = h.length;
    });
    if (this.buckets = [...c.values()], d > 0) {
      const h = new M.MeshBasicMaterial();
      this.applyMode(h, e.edge.opacity);
      const u = new M.InstancedMesh(this.geometryFor("arrow"), h, d);
      u.frustumCulled = !1, u.renderOrder = 2, u.instanceMatrix.setUsage(M.DynamicDrawUsage);
      for (let p = 0; p < d; p++) u.setColorAt(p, this.color("#ffffff"));
      this.arrowMesh = u, this.scene.add(u);
    }
    if (t.edges.length <= e.weight.maxCount)
      for (const h of this.edgeInfo.values()) {
        const u = this.edgeText(h);
        u && (h.img = this.tex.text(u, { ...e.weight, maxChars: e.label.maxChars }), h.sprite = this.makeSprite(h.img, 5));
      }
    if (e.links.badge && e.interaction.openLinks !== "never") {
      const h = this.tex.badge(e.links.badgeColor);
      for (const u of this.nodeInfo.values()) J(u.node.url, e.links) && (u.badge = this.makeSprite(h, 6));
      for (const u of this.edgeInfo.values()) J(u.edge.url, e.links) && (u.badge = this.makeSprite(h, 6));
    }
    this.dirtyPositions = !1, this.dirtyNodes = this.dirtyEdges = !1, this.updatePositions();
  }
  edgeText(e) {
    const t = this.config.weight, i = t.show === "always" || t.show === "auto" && e.weight !== 1 ? String(Number(e.weight.toFixed(t.decimals))) : "", o = e.edge.label ?? "";
    return o && i ? `${o} (${i})` : o || i;
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
    for (const [i, o] of this.nodeInfo) {
      const r = o.layer;
      if (!r) continue;
      const a = this.selNodes.has(i), l = i === this.hoverNode, c = a ? e.selection.width : l ? e.selection.width * 0.8 : o.style.borderWidth, d = o.body.hw * 2, h = o.body.hh * 2, [u, p, f] = o.body.pos;
      s.compose(this.tmpV.set(u, p, f), Fe, this.tmpS.set(d, h, t ? h : 1)), r.body.setMatrixAt(o.slot, s), s.compose(this.tmpV.set(u, p, f), Fe, this.tmpS.set(d + 2 * c, h + 2 * c, t ? h + 2 * c : 1)), r.outline.setMatrixAt(o.slot, s), r.outline.setColorAt(o.slot, this.color(a ? e.selection.color : l ? e.selection.hoverColor : o.style.borderColor));
    }
    for (const i of this.layers.values())
      i.body.instanceMatrix.needsUpdate = !0, i.outline.instanceMatrix.needsUpdate = !0, i.outline.instanceColor && (i.outline.instanceColor.needsUpdate = !0);
    this.syncGizmo();
  }
  computePaths() {
    const e = this.config, t = { spacing: e.edge.curveSpacing, segments: 16, dim3: e.dimension === "3d", loopScale: e.edge.loopSize };
    for (const s of this.edgeInfo.values()) {
      const i = this.nodeInfo.get(s.edge.source)?.body, o = this.nodeInfo.get(s.edge.target)?.body;
      if (!i || !o) {
        s.path = [];
        continue;
      }
      let r = Je(i, o, s.index, s.count, s.flip, s.self, t);
      s.tip = void 0, s.arrowSlot >= 0 && r.length >= 2 && (s.tip = et(r), r = Qe(r, e.edge.arrowSize * 0.9)), s.path = r;
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
      let o = 0;
      for (const a of e.edges) {
        const l = this.edgeColor(a);
        for (let c = 1; c < a.path.length; c++) {
          const d = a.path[c - 1], h = a.path[c];
          s[o] = d[0], s[o + 1] = d[1], s[o + 2] = d[2], s[o + 3] = h[0], s[o + 4] = h[1], s[o + 5] = h[2], i[o] = i[o + 3] = l.r, i[o + 1] = i[o + 4] = l.g, i[o + 2] = i[o + 5] = l.b, o += 6;
        }
      }
      const r = new Le();
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
        this.tmpQ.setFromUnitVectors(gs, this.tmpV2.set(s[0], s[1], s[2])), this.tmpM.compose(this.tmpV.set(t.tip.tip[0], t.tip.tip[1], t.tip.tip[2]), this.tmpQ, this.tmpS.set(e, e * 0.8, e * 0.8)), this.arrowMesh.setMatrixAt(t.arrowSlot, this.tmpM), this.arrowMesh.setColorAt(t.arrowSlot, this.edgeColor(t));
      }
      this.arrowMesh.instanceMatrix.needsUpdate = !0, this.arrowMesh.instanceColor && (this.arrowMesh.instanceColor.needsUpdate = !0);
    }
  }
  updateLabels() {
    const e = this.config, t = e.label.mode === "screen", s = e.dimension === "3d";
    for (const i of this.nodeInfo.values()) {
      const o = i.sprite;
      if (!o) continue;
      const [r, a, l] = i.body.pos;
      if (i.card) {
        o.position.set(r, a, l), o.scale.set(i.card.w, i.card.h, 1);
        continue;
      }
      const c = o.material.map.image, d = this.tex.resolution, h = t ? 1 / this.pxPerUnitAt(r, a, l) : 1, u = c.width / d * h, p = c.height / d * h;
      o.scale.set(u, p, 1), o.position.set(r, a - i.body.hh - e.label.gap * h - p / 2, l), s && this.towardCamera(o.position, i.body.hw + 1);
    }
    for (const i of this.edgeInfo.values()) {
      const o = i.sprite;
      if (!o || !i.img || i.path.length < 2) {
        o && (o.visible = !1);
        continue;
      }
      const r = ue(i.path, 0.5), a = t ? 1 / this.pxPerUnitAt(r[0], r[1], r[2]) : 1;
      o.visible = !0, o.scale.set(i.img.w * a, i.img.h * a, 1), o.position.set(r[0], r[1], r[2]), s && this.towardCamera(o.position, 1.5);
    }
    this.updateBadges();
  }
  /** Link badges: top right of a node, beside the middle of an edge. */
  updateBadges() {
    const e = this.config.links.badgeSize, t = this.config.dimension === "3d";
    for (const s of this.nodeInfo.values()) {
      const i = s.badge;
      if (!i) continue;
      const [o, r, a] = s.body.pos;
      i.scale.set(e, e, 1), i.position.set(o + s.body.hw * 0.72, r + s.body.hh * 0.72, a), t && this.towardCamera(i.position, s.body.hw + 2);
    }
    for (const s of this.edgeInfo.values()) {
      const i = s.badge;
      if (!i) continue;
      if (s.path.length < 2) {
        i.visible = !1;
        continue;
      }
      const o = ue(s.path, 0.5);
      i.visible = !0, i.scale.set(e, e, 1), i.position.set(o[0] + e * 0.9, o[1] + e * 0.9, o[2]), t && this.towardCamera(i.position, 2);
    }
  }
  /** The "Open page" chip next to a single selected node or edge that has a url. */
  updateChip() {
    const e = this.chipEl, t = this.config, s = this.dragIds.length > 0 || this.gizmoDragging || this.drag?.type === "nodes" && this.drag.moved;
    let i = null;
    if (t.links.chip && t.interaction.openLinks !== "never" && !s) {
      if (this.selNodes.size === 1 && this.selEdges.size === 0) {
        const c = [...this.selNodes][0], d = this.nodeInfo.get(c);
        if (d && J(d.node.url, t.links)) {
          const h = this.pxPerUnitAt(d.body.pos[0], d.body.pos[1], d.body.pos[2]);
          i = { kind: "node", id: c, at: d.body.pos, dx: d.body.hw * h + 8, dy: -d.body.hh * h - 4 };
        }
      } else if (this.selEdges.size === 1 && this.selNodes.size === 0) {
        const c = [...this.selEdges][0], d = this.edgeInfo.get(c);
        d && d.path.length >= 2 && J(d.edge.url, t.links) && (i = { kind: "edge", id: c, at: ue(d.path, 0.5), dx: 12, dy: -12 });
      }
    }
    if (!i) {
      e.hidden || (e.hidden = !0), this.chipTarget = null;
      return;
    }
    this.camera.updateMatrixWorld();
    const o = this.tmpV.set(i.at[0], i.at[1], i.at[2]).project(this.camera);
    if (o.z < -1 || o.z > 1) {
      e.hidden = !0, this.chipTarget = null;
      return;
    }
    const r = `${t.links.chipLabel} ↗`;
    e.textContent !== r && (e.textContent = r), this.chipTarget = { kind: i.kind, id: i.id }, e.hidden = !1;
    const a = (o.x * 0.5 + 0.5) * this.width + i.dx, l = (-o.y * 0.5 + 0.5) * this.height + i.dy;
    e.style.left = `${Math.max(4, Math.min(a, this.width - e.offsetWidth - 4))}px`, e.style.top = `${Math.max(4, Math.min(l, this.height - e.offsetHeight - 4))}px`;
  }
  /** "Ctrl+click to open the page", or "" when the item has no usable link. */
  linkHint(e) {
    const t = this.config;
    if (!t.links.hint || t.interaction.openLinks === "never" || !J(e, t.links)) return "";
    const s = typeof navigator < "u" && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent), i = je(t.interaction.openLinks, s);
    return t.links.chip ? `${i} to open the page, or select it and use “${t.links.chipLabel}”` : `${i} to open the page`;
  }
  /** Moves a point toward the camera so a label always sits in front of the node it belongs to. */
  towardCamera(e, t) {
    const s = this.tmpV2.copy(this.persp.position).sub(e);
    s.lengthSq() < 1e-9 || e.addScaledVector(s.normalize(), t);
  }
  /** CSS pixels per world unit at a world position. */
  pxPerUnitAt(e, t, s) {
    if (this.camera === this.ortho) return this.height / ((this.ortho.top - this.ortho.bottom) / this.ortho.zoom);
    const i = this.tmpV2.set(e, t, s).applyMatrix4(this.persp.matrixWorldInverse), o = Math.max(1e-3, -i.z);
    return this.height / (2 * Math.tan(M.MathUtils.degToRad(this.persp.fov) / 2) * o);
  }
  // ------------------------------------------------------------------ transform gizmo
  getGizmoMode() {
    return this.gizmoMode;
  }
  /**
   * Move, rotate or scale. With one selected node only `translate` does something; rotating and scaling act on
   * the positions of two or more selected nodes around the center of the selection.
   */
  setGizmoMode(e) {
    this.gizmoMode = e, this.tc?.setMode(e), this.applyGizmoAxes(), this.syncGizmo(), this.events.emit("gizmomode", { mode: e }), this.requestRender();
  }
  disposeGizmo() {
    this.tc && (this.tc.detach(), this.tcHelper && this.scene.remove(this.tcHelper), this.tc.dispose(), this.tc = null, this.tcHelper = null, this.gizmoDragging = !1);
  }
  /** (Re)creates the gizmo for the current camera. Called whenever the camera or the configuration changes. */
  setupGizmo() {
    if (this.disposeGizmo(), !this.config.interaction.gizmo) return;
    const e = new rt(this.camera, this.canvas);
    e.setMode(this.gizmoMode), e.setSpace(this.config.gizmo.space), e.setSize(this.config.gizmo.size), e.addEventListener("dragging-changed", (s) => {
      this.controls.enabled = !s.value, s.value ? this.beginGizmoDrag() : this.endGizmoDrag();
    }), e.addEventListener("objectChange", () => this.applyGizmoDrag()), e.addEventListener("change", () => this.requestRender());
    const t = typeof e.getHelper == "function" ? e.getHelper() : e;
    this.scene.add(t), this.tc = e, this.tcHelper = t, this.applyGizmoAxes(), this.applySnap(), this.syncGizmo();
  }
  /** 2D: arrows and planes for X/Y, and only the Z ring for rotation. 3D: everything. */
  applyGizmoAxes() {
    const e = this.tc;
    e && (this.config.dimension === "3d" ? e.showX = e.showY = e.showZ = !0 : this.gizmoMode === "rotate" ? (e.showX = !1, e.showY = !1, e.showZ = !0) : (e.showX = !0, e.showY = !0, e.showZ = !1));
  }
  setSnap(e) {
    e !== this.snapHeld && (this.snapHeld = e, this.applySnap());
  }
  applySnap() {
    const e = this.tc;
    if (!e) return;
    const t = this.config.gizmo;
    e.setTranslationSnap(this.snapHeld ? t.snapTranslate : null), e.setRotationSnap(this.snapHeld ? M.MathUtils.degToRad(t.snapRotate) : null), e.setScaleSnap(this.snapHeld ? t.snapScale : null);
  }
  /** Is the pointer over a gizmo handle? (TransformControls only updates its hover state on pointer moves.) */
  gizmoHovered(e) {
    const t = this.tc;
    if (!t || !t.object) return !1;
    const s = this.canvas.getBoundingClientRect();
    try {
      t.pointerHover({
        x: (e.clientX - s.left) / s.width * 2 - 1,
        y: -(e.clientY - s.top) / s.height * 2 + 1,
        button: e.button
      });
    } catch {
    }
    return !!t.axis;
  }
  /** Attaches the gizmo to the selection (or detaches it) and keeps the pivot at the selection center. */
  syncGizmo() {
    const e = this.tc;
    if (!e) return;
    const t = [...this.selNodes].filter((i) => this.nodeInfo.has(i));
    if (!(this.tool === "select" && t.length > 0 && (this.gizmoMode === "translate" || t.length >= 2))) {
      e.object && e.detach();
      return;
    }
    if (!this.gizmoDragging) {
      let i = 0, o = 0, r = 0;
      for (const a of t) {
        const l = this.nodeInfo.get(a).body.pos;
        i += l[0], o += l[1], r += l[2];
      }
      this.pivot.position.set(i / t.length, o / t.length, r / t.length), this.pivot.quaternion.identity(), this.pivot.scale.set(1, 1, 1), this.pivot.updateMatrixWorld(!0);
    }
    e.object !== this.pivot && e.attach(this.pivot);
  }
  beginGizmoDrag() {
    const e = [...this.selNodes].filter((s) => this.nodeInfo.has(s)), t = /* @__PURE__ */ new Map();
    for (const s of e) {
      const i = this.nodeInfo.get(s).body.pos;
      t.set(s, [i[0], i[1], i[2]]);
    }
    this.gizmoStart = { pivot: this.pivot.position.clone(), nodes: t }, this.gizmoDragging = !0, this.dragIds = e, this.events.emit("nodedragstart", { ids: e });
  }
  applyGizmoDrag() {
    const e = this.gizmoStart, t = this.tc;
    if (!e || !t || !this.gizmoDragging) return;
    const s = this.config.dimension === "3d", i = e.pivot, o = t.mode, r = this.pivot.position, a = [], l = new M.Vector3();
    for (const [c, d] of e.nodes) {
      const h = this._graph.getNode(c);
      if (!h) continue;
      let u;
      o === "translate" ? u = [d[0] + r.x - i.x, d[1] + r.y - i.y, d[2] + r.z - i.z] : (l.set(d[0] - i.x, d[1] - i.y, d[2] - i.z), o === "rotate" ? l.applyQuaternion(this.pivot.quaternion) : l.multiply(this.pivot.scale), u = [i.x + l.x, i.y + l.y, i.z + l.z]), a.push([c, [u[0], u[1], s ? u[2] : h.z ?? 0]]);
    }
    this._graph.setPositions(a);
  }
  endGizmoDrag() {
    const e = this.dragIds;
    this.gizmoDragging = !1, this.gizmoStart = null, this.dragIds = [];
    for (const t of e) this.sim?.unpin(t, !!this._graph.getNode(t)?.pinned);
    this.syncGizmo(), this.events.emit("nodedragend", { ids: e }), this.requestRender();
  }
  // ------------------------------------------------------------------ search and help
  /**
   * Finds nodes (see `search` in the configuration for the syntax) and, by default, selects them.
   * Returns the matches; terms shorter than `search.minChars` are ignored.
   */
  search(e, t = {}) {
    this.searchIndex || (this.searchIndex = new Ge(this._graph));
    const s = this.searchIndex.search(e, { fields: this.config.search.fields, minChars: this.config.search.minChars });
    return (t.select ?? !0) && (s.ids.length || s.query.trim() !== "" && !s.tooShort ? (this.searchActive = !0, this.setSelection({ nodes: s.ids })) : this.searchActive && (this.searchActive = !1, this.setSelection({}))), t.fit && s.ids.length && this.fit(s.ids), this.events.emit("search", { query: e, ids: s.ids, tooShort: s.tooShort }), s;
  }
  /** Clears the search box and the selection it made. */
  clearSearch() {
    this.searchText = "", this.searchInput && (this.searchInput.value = ""), this.search(""), this.searchCount && (this.searchCount.textContent = "");
  }
  /** Puts the cursor into the search box (the editor binds this to Ctrl+F). */
  focusSearch() {
    this.searchInput?.focus(), this.searchInput?.select();
  }
  buildSearch() {
    if (this.searchEl?.remove(), this.searchEl = this.searchInput = this.searchCount = null, !this.config.ui.search) return;
    const e = document.createElement("div");
    e.className = "gs-search gs-ui", e.setAttribute("role", "search"), e.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>';
    const t = document.createElement("input");
    t.type = "text", t.placeholder = "Search…", t.setAttribute("aria-label", "Search nodes and groups"), t.title = "Find nodes while you type. group:Sales, tag:x, id:n1 search one field. Enter zooms to the matches, Esc clears.", t.autocomplete = "off", t.spellcheck = !1, t.value = this.searchText;
    const s = document.createElement("span");
    s.className = "gs-search-count", s.setAttribute("aria-live", "polite");
    const i = document.createElement("button");
    i.type = "button", i.className = "gs-search-clear", i.textContent = "×", i.title = "Clear search", i.setAttribute("aria-label", "Clear search");
    const o = (r) => {
      this.searchText = t.value;
      const a = this.search(t.value, { fit: r }), l = this.config.search.minChars;
      s.textContent = a.ids.length ? `${a.ids.length} found` : a.tooShort ? `${l}+ characters` : t.value.trim() ? "No match" : "", i.hidden = t.value === "";
    };
    t.addEventListener("input", () => o(!1)), t.addEventListener("keydown", (r) => {
      r.key === "Enter" ? (r.preventDefault(), o(this.config.search.fitOnEnter)) : r.key === "Escape" && (r.stopPropagation(), this.clearSearch(), i.hidden = !0, t.blur());
    }), i.addEventListener("click", () => {
      this.clearSearch(), i.hidden = !0, t.focus();
    }), i.hidden = t.value === "", e.append(t, s, i), this.root.appendChild(e), this.searchEl = e, this.searchInput = t, this.searchCount = s;
  }
  toggleHelp() {
    this.helpEl ? this.closeHelp() : this.openHelp();
  }
  openHelp() {
    this.closeHelp();
    const e = typeof navigator < "u" && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent), t = document.createElement("div");
    t.className = "gs-help gs-ui", t.setAttribute("role", "dialog"), t.setAttribute("aria-label", "Controls");
    const s = document.createElement("div");
    s.className = "gs-help-title", s.textContent = "Controls", t.appendChild(s);
    for (const i of ft(this.config, e)) {
      const o = document.createElement("div");
      o.className = "gs-help-row";
      const r = document.createElement("b");
      r.textContent = i.keys;
      const a = document.createElement("span");
      a.textContent = i.text, o.append(r, a), t.appendChild(o);
    }
    this.root.appendChild(t), this.helpEl = t, this.helpButton?.setAttribute("aria-expanded", "true");
  }
  closeHelp() {
    this.helpEl?.remove(), this.helpEl = null, this.helpButton?.setAttribute("aria-expanded", "false");
  }
  // ------------------------------------------------------------------ picking
  ndc = new M.Vector2();
  eventPoint(e) {
    const t = this.canvas.getBoundingClientRect();
    return { x: e.clientX - t.left, y: e.clientY - t.top };
  }
  /** World position of a screen point on the plane through `anchor` that faces the camera. */
  worldAt(e, t, s) {
    this.camera.updateMatrixWorld(), this.ndc.set(e / this.width * 2 - 1, -(t / this.height) * 2 + 1), this.raycaster.setFromCamera(this.ndc, this.camera);
    const i = this.camera.getWorldDirection(this.tmpV2);
    this.plane.setFromNormalAndCoplanarPoint(i, this.tmpV.set(s[0], s[1], s[2]));
    const o = this.raycaster.ray.intersectPlane(this.plane, this.tmpS);
    return o ? [o.x, o.y, o.z] : null;
  }
  pick(e, t) {
    this.camera.updateMatrixWorld();
    const s = this.config.dimension === "3d", i = this.tmpV;
    let o = null, r = 1 / 0;
    for (const [c, d] of this.nodeInfo) {
      const h = d.body.pos;
      if (i.set(h[0], h[1], h[2]).project(this.camera), i.z < -1 || i.z > 1) continue;
      const u = (i.x * 0.5 + 0.5) * this.width, p = (-i.y * 0.5 + 0.5) * this.height, f = this.pxPerUnitAt(h[0], h[1], h[2]), y = (e - u) / Math.max(d.body.hw * f, 4), w = (t - p) / Math.max(d.body.hh * f, 4);
      (d.body.ellipse || s ? y * y + w * w <= 1 : Math.abs(y) <= 1 && Math.abs(w) <= 1) && i.z <= r && (o = c, r = i.z);
    }
    if (o) return { kind: "node", id: o };
    if (this.edgeInfo.size > this.config.interaction.pickLimit) return { kind: null, id: null };
    let a = null, l = 6;
    for (const [c, d] of this.edgeInfo) {
      const h = d.path;
      if (h.length < 2) continue;
      let u = 0, p = 0;
      for (let f = 0; f < h.length; f++) {
        i.set(h[f][0], h[f][1], h[f][2]).project(this.camera);
        const y = (i.x * 0.5 + 0.5) * this.width, w = (-i.y * 0.5 + 0.5) * this.height;
        if (f > 0) {
          const S = tt(e, t, u, p, y, w);
          S < l && (l = S, a = c);
        }
        u = y, p = w;
      }
    }
    return a ? { kind: "edge", id: a } : { kind: null, id: null };
  }
  // ------------------------------------------------------------------ pointer interaction
  onWheel = () => {
    this.activeUntil = performance.now() + 700, this.requestRender();
  };
  onPointerDown = (e) => {
    if (this.helpEl && !e.target.closest?.(".gs-help, .gs-help-btn") && this.closeHelp(), e.target.closest?.(".gs-ui") || (this.pointerIsDown = !0, this.requestRender(), this.gizmoHovered(e)) || e.button !== 0) return;
    const t = this.eventPoint(e);
    this.lastPointer = t;
    const s = this.pick(t.x, t.y), i = e.shiftKey, o = this.config.interaction, r = s.kind === "node" && this.selNodes.has(s.id);
    if (this.down = { x: t.x, y: t.y, hit: s, additive: i, wasSelected: r, moved: !1, button: e.button }, this.hideTooltip(), s.kind === "node") {
      if (this.tool === "connect")
        this.drag = { type: "connect", from: s.id };
      else if (o.select && !r && (i && o.multiSelect ? this.selNodes.add(s.id) : (this.selNodes = /* @__PURE__ */ new Set([s.id]), this.selEdges.clear()), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), o.dragNodes) {
        const a = this.selNodes.has(s.id) ? [...this.selNodes] : [s.id], l = this.nodeInfo.get(s.id).body.pos, c = this.worldAt(t.x, t.y, l);
        if (c) {
          const d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
          for (const u of a) {
            const p = this.nodeInfo.get(u)?.body.pos;
            p && (d.set(u, [p[0] - c[0], p[1] - c[1], p[2] - c[2]]), h.set(u, [p[0], p[1], p[2]]));
          }
          this.drag = { type: "nodes", ids: a, primary: s.id, offsets: d, starts: h, anchor: [l[0], l[1], l[2]], px: t.x, py: t.y, moved: !1 };
        }
      }
    } else e.shiftKey && o.select && o.multiSelect && (this.drag = { type: "box", x0: t.x, y0: t.y });
    this.drag && (this.controls.enabled = !1, this.canvas.setPointerCapture(e.pointerId));
  };
  onPointerMove = (e) => {
    const t = this.eventPoint(e);
    this.lastPointer = t;
    const s = this.down;
    s && !s.moved && Math.hypot(t.x - s.x, t.y - s.y) > ms && (s.moved = !0);
    const i = this.drag;
    if (!i) {
      !s && !(this.tc?.object && this.tc.axis) && this.scheduleHover(), this.moveTooltip(t);
      return;
    }
    if (i.type === "nodes") {
      if (!s?.moved) return;
      i.moved || (i.moved = !0, this.dragIds = i.ids, this.canvas.style.cursor = "grabbing", this.events.emit("nodedragstart", { ids: i.ids })), this.dragNodes(i, t);
    } else if (i.type === "connect") {
      this.updateRubber(i.from, t);
      const o = this.pick(t.x, t.y), r = o.kind === "node" ? o.id : null;
      r !== this.hoverNode && (this.hoverNode = r, this.dirtyNodes = !0, this.requestRender());
    } else if (s?.moved) {
      const o = Math.min(i.x0, t.x), r = Math.min(i.y0, t.y);
      this.boxEl.hidden = !1, Object.assign(this.boxEl.style, { left: `${o}px`, top: `${r}px`, width: `${Math.abs(t.x - i.x0)}px`, height: `${Math.abs(t.y - i.y0)}px` });
    }
  };
  onPointerUp = (e) => {
    this.pointerIsDown = !1, this.activeUntil = performance.now() + 1e3, this.requestRender();
    const t = this.down, s = this.drag;
    if (this.down = null, this.drag = null, this.controls.enabled = !0, this.canvas.hasPointerCapture?.(e.pointerId) && this.canvas.releasePointerCapture(e.pointerId), this.boxEl.hidden = !0, this.removeRubber(), this.setAxisGuide(null), this.canvas.style.cursor = this.tool === "connect" ? "crosshair" : "", s?.type === "nodes" && s.moved) {
      for (const o of s.ids) this.sim?.unpin(o, !!this._graph.getNode(o)?.pinned);
      this.dragIds = [], this.events.emit("nodedragend", { ids: s.ids });
      return;
    }
    if (!t || e.type === "pointercancel") return;
    const i = this.eventPoint(e);
    if (s?.type === "connect") {
      const o = this.pick(i.x, i.y);
      o.kind === "node" && this.events.emit("connect", { source: s.from, target: o.id });
      return;
    }
    if (s?.type === "box" && t.moved) {
      this.selectInBox(s.x0, s.y0, i.x, i.y, t.additive);
      return;
    }
    t.moved || this.handleClick(t.hit, t.additive, t.wasSelected, e);
  };
  handleClick(e, t, s, i) {
    const o = this.config.interaction, r = (l) => o.openLinks === "click" || o.openLinks === "ctrl-click" && l, a = i.ctrlKey || i.metaKey;
    if (e.kind === "node") {
      const l = this._graph.getNode(e.id);
      if (!l) return;
      o.select && s && (t ? this.selNodes.delete(e.id) : this.selNodes.size > 1 && (this.selNodes = /* @__PURE__ */ new Set([e.id])), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), this.events.emit("nodeclick", { id: e.id, node: l, originalEvent: i }), r(a) && this.openLink("node", e.id);
    } else if (e.kind === "edge") {
      const l = this._graph.getEdge(e.id);
      if (!l) return;
      o.select && (t && o.multiSelect ? this.selEdges.delete(e.id) || this.selEdges.add(e.id) : (this.selNodes.clear(), this.selEdges = /* @__PURE__ */ new Set([e.id])), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), this.events.emit("edgeclick", { id: e.id, edge: l, originalEvent: i }), r(a) && this.openLink("edge", e.id);
    } else {
      t || this.clearSelection();
      const l = this.eventPoint(i), c = this.worldAt(l.x, l.y, this.config.dimension === "3d" ? this.controls.target.toArray() : [0, 0, 0]) ?? [0, 0, 0];
      this.events.emit("backgroundclick", { position: c, originalEvent: i });
    }
  }
  onDblClick = (e) => {
    if (e.target.closest?.(".gs-ui")) return;
    const t = this.eventPoint(e), s = this.pick(t.x, t.y), i = this.config.interaction.openLinks === "dblclick";
    if (s.kind === "node") {
      const o = this._graph.getNode(s.id);
      o && this.events.emit("nodedblclick", { id: s.id, node: o, originalEvent: e }), i && this.openLink("node", s.id);
    } else if (s.kind === "edge")
      i && this.openLink("edge", s.id);
    else {
      const o = this.worldAt(t.x, t.y, this.config.dimension === "3d" ? this.controls.target.toArray() : [0, 0, 0]) ?? [0, 0, 0];
      this.events.emit("backgrounddblclick", { position: o, originalEvent: e });
    }
  };
  onPointerLeave = () => {
    this.pointerInside = !1, !this.drag && (this.hideTooltip(), (this.hoverNode || this.hoverEdge) && (this.hoverNode = this.hoverEdge = null, this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("hover", { kind: null, id: null }), this.requestRender()));
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
    const s = this.config.dimension === "3d", i = this.activeAxes(), o = [];
    let r = null;
    if (i.length === 1) {
      const a = i[0], l = e.starts.get(e.primary);
      if (!l) return;
      const c = [0, 0, 0];
      c[Te[a]] = 1;
      const d = 10, h = this.toScreen(l), u = this.toScreen([l[0] + c[0] * d, l[1] + c[1] * d, l[2] + c[2] * d]), p = u.x - h.x, f = u.y - h.y, y = p * p + f * f, w = y > 1e-6 ? ((t.x - e.px) * p + (t.y - e.py) * f) / y * d : 0;
      for (const S of e.ids) {
        const g = e.starts.get(S), m = this._graph.getNode(S);
        !g || !m || o.push([S, [g[0] + c[0] * w, g[1] + c[1] * w, s ? g[2] + c[2] * w : m.z ?? 0]]);
      }
      r = { origin: l, axis: a };
    } else {
      const a = this.worldAt(t.x, t.y, e.anchor);
      if (!a) return;
      const l = i.length === 0;
      for (const c of e.ids) {
        const d = e.offsets.get(c), h = e.starts.get(c), u = this._graph.getNode(c);
        if (!d || !h || !u) continue;
        const p = (f, y) => l || i.includes(y) ? a[f] + d[f] : h[f];
        o.push([c, [p(0, "x"), p(1, "y"), s ? p(2, "z") : u.z ?? 0]]);
      }
    }
    this.setAxisGuide(r), this._graph.setPositions(o);
  }
  setAxisGuide(e) {
    if (!e) {
      if (!this.guide) return;
      this.scene.remove(this.guide), this.guide.geometry.dispose(), this.guide.material.dispose(), this.guide = null, this.requestRender();
      return;
    }
    if (!this.guide) {
      const r = new M.BufferGeometry();
      r.setAttribute("position", new M.BufferAttribute(new Float32Array(6), 3)), this.guide = new M.Line(r, new M.LineBasicMaterial({ color: this.color(Pe[e.axis]), depthTest: !1, transparent: !0, opacity: 0.8 })), this.guide.renderOrder = 19, this.guide.frustumCulled = !1, this.scene.add(this.guide);
    }
    this.guide.material.color.copy(this.color(Pe[e.axis]));
    const t = this.guide.geometry.getAttribute("position"), s = Te[e.axis], i = [e.origin[0], e.origin[1], e.origin[2]], o = [e.origin[0], e.origin[1], e.origin[2]];
    i[s] -= 5e4, o[s] += 5e4, t.setXYZ(0, i[0], i[1], i[2]), t.setXYZ(1, o[0], o[1], o[2]), t.needsUpdate = !0, this.requestRender();
  }
  onKeyDown = (e) => {
    this.setSnap(e.ctrlKey || e.metaKey);
    const t = !!e.target?.matches?.("input, textarea, select");
    if (e.key === "Escape" && this.helpEl && this.closeHelp(), e.key === "?" && this.pointerInside && !t && this.config.ui.help && (e.preventDefault(), this.toggleHelp()), e.key === "Escape" && this.container.classList.contains("gs-pseudo-fullscreen") && this.toggleFullscreen(!1), e.ctrlKey || e.metaKey || e.altKey || e.target?.matches?.("input, textarea, select")) return;
    const i = e.key.toLowerCase();
    (i === "x" || i === "y" || i === "z") && !this.axisKeys.has(i) && (this.axisKeys.add(i), this.refreshAxisDrag());
  };
  onKeyUp = (e) => {
    this.setSnap(e.ctrlKey || e.metaKey);
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
  selectInBox(e, t, s, i, o) {
    this.camera.updateMatrixWorld();
    const r = Math.min(e, s), a = Math.max(e, s), l = Math.min(t, i), c = Math.max(t, i), d = o ? new Set(this.selNodes) : /* @__PURE__ */ new Set();
    for (const [h, u] of this.nodeInfo) {
      const p = u.body.pos;
      this.tmpV.set(p[0], p[1], p[2]).project(this.camera);
      const f = (this.tmpV.x * 0.5 + 0.5) * this.width, y = (-this.tmpV.y * 0.5 + 0.5) * this.height;
      this.tmpV.z >= -1 && this.tmpV.z <= 1 && f >= r && f <= a && y >= l && y <= c && d.add(h);
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
    const s = (o, r) => {
      const a = document.createElement("div");
      r && (a.className = r), a.textContent = o, t.appendChild(a);
    }, i = this._graph;
    if (e.kind === "node") {
      const o = i.getNode(e.id);
      if (!o) return;
      s(o.label ?? o.id, "gs-tt-title"), o.sublabel && s(o.sublabel, "gs-tt-muted"), o.group && s(o.group, "gs-tt-muted"), o.url && s(o.url, "gs-tt-muted");
      const r = this.linkHint(o.url);
      r && s(r, "gs-tt-hint");
      for (const [a, l] of Object.entries(o.props ?? {})) s(`${a}: ${l}`, "gs-tt-muted");
    } else {
      const o = i.getEdge(e.id);
      if (!o) return;
      const r = (l) => i.getNode(l)?.label ?? l;
      s(`${r(o.source)} ${i.isDirected(o) ? "→" : "—"} ${r(o.target)}`, "gs-tt-title"), s(`weight ${i.weightOf(o)}`, "gs-tt-muted"), o.label && s(o.label), o.url && s(o.url, "gs-tt-muted");
      const a = this.linkHint(o.url);
      a && s(a, "gs-tt-hint");
    }
    t.hidden = !1, this.moveTooltip(this.lastPointer);
  }
  moveTooltip(e) {
    const t = this.tooltipEl;
    if (t.hidden) return;
    const s = 14;
    let i = e.x + s, o = e.y + s;
    i + t.offsetWidth > this.width && (i = Math.max(0, e.x - t.offsetWidth - s)), o + t.offsetHeight > this.height && (o = Math.max(0, e.y - t.offsetHeight - s)), t.style.left = `${i}px`, t.style.top = `${o}px`;
  }
  updateRubber(e, t) {
    const s = this.nodeInfo.get(e);
    if (!s) return;
    const i = this.worldAt(t.x, t.y, s.body.pos) ?? s.body.pos;
    if (!this.rubber) {
      const r = new M.BufferGeometry();
      r.setAttribute("position", new M.BufferAttribute(new Float32Array(6), 3));
      const a = new M.LineBasicMaterial({ color: this.color(this.config.selection.color), depthTest: !1, transparent: !0 });
      this.rubber = new M.Line(r, a), this.rubber.renderOrder = 20, this.rubber.frustumCulled = !1, this.scene.add(this.rubber);
    }
    const o = this.rubber.geometry.getAttribute("position");
    o.setXYZ(0, s.body.pos[0], s.body.pos[1], s.body.pos[2]), o.setXYZ(1, i[0], i[1], i[2]), o.needsUpdate = !0, this.requestRender();
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
    const o = document.createElement("span");
    o.className = "gs-panel-title", o.textContent = t;
    const r = document.createElement("button");
    r.type = "button", r.className = "gs-btn", r.textContent = "×", r.title = "Close", r.setAttribute("aria-label", "Close panel"), r.addEventListener("click", () => this.closePanel()), i.append(o, r);
    const a = document.createElement("iframe");
    a.setAttribute("sandbox", this.config.links.panelSandbox), a.title = t, a.src = e, s.append(i, a), this.root.appendChild(s), this.panelEl = s;
  }
}
const Ps = "0.1.0";
export {
  ye as CONFIG_DOCS,
  oe as DEFAULT_CONFIG,
  it as DEFAULT_LAYOUT_OPTIONS,
  dt as DEFAULT_WEIGHT,
  Re as Emitter,
  Jt as FORMATS,
  st as ForceSimulation,
  pe as Graph,
  Ts as GraphView,
  Ds as LAYOUT_NAMES,
  xe as NODE_SHAPES,
  Ge as NodeSearchIndex,
  qe as buildGroupIndex,
  ns as circleLayout,
  cs as computeLayout,
  Ls as configToJsonc,
  fe as createConfig,
  ps as defaultCss,
  zs as defineConfig,
  je as describeLinkGesture,
  Qt as detectFormat,
  yt as diffConfig,
  ce as estimateTextBox,
  wt as findUnknownKeys,
  Ss as generateClustered,
  Es as generateMixedNetwork,
  Os as geometry,
  rs as gridLayout,
  ft as helpLines,
  fs as injectStyles,
  os as layeredLayout,
  ne as mergeConfig,
  is as nodeBoxes,
  Mt as parseCsv,
  Lt as parseDot,
  Dt as parseGml,
  As as parseGraph,
  Ht as parseGraphML,
  Yt as parseJson,
  $s as parseJsonc,
  ut as parseQuery,
  De as placeNewNodes,
  ls as randomLayout,
  Cs as registerTheme,
  xt as resolveEdgeStyle,
  _e as resolveNodeStyle,
  J as resolveUrl,
  Ms as searchNodes,
  St as serializeCsv,
  Nt as serializeDot,
  Tt as serializeGml,
  Is as serializeGraph,
  qt as serializeGraphML,
  Zt as serializeJson,
  as as sphereLayout,
  bt as stripJsonComments,
  Ue as themes,
  ds as treeLayout,
  Ns as undocumentedConfigPaths,
  Ps as version
};
//# sourceMappingURL=graphscape.js.map
