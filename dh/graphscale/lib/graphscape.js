import * as S from "three";
import { OrbitControls as st } from "three/addons/controls/OrbitControls.js";
import { TrackballControls as it } from "three/addons/controls/TrackballControls.js";
import { TransformControls as ot } from "three/addons/controls/TransformControls.js";
import { LineMaterial as nt } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 as rt } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry as Le } from "three/addons/lines/LineSegmentsGeometry.js";
const xe = ["circle", "square", "rectangle", "diamond", "hexagon", "triangle", "card"], at = 1;
class Fe {
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
const J = (n) => JSON.parse(JSON.stringify(n));
class fe {
  directed = !1;
  meta = {};
  events = new Fe();
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
    this.nodeMap.clear(), this.edgeMap.clear(), this.invalidate(), this.directed = !!e.directed, this.meta = J(e.meta ?? {});
    for (const s of e.nodes ?? []) {
      const i = J(s);
      i.id = String(i.id), this.nodeMap.set(i.id, i);
    }
    for (const s of e.edges ?? []) {
      const i = J(s);
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
    const s = { ...J(e), id: t };
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
    const o = { ...J(e), id: i, source: t, target: s };
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
    return typeof e.weight == "number" && Number.isFinite(e.weight) ? e.weight : at;
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
    return J({ directed: this.directed, meta: this.meta, nodes: this.nodes, edges: this.edges });
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
const lt = /^[a-z][a-z0-9+.-]*:/i;
function Z(n, e) {
  if (!n) return null;
  const t = n.replace(/[\u0000-\u001f\u007f\s]+/g, (s) => s.includes(" ") ? " " : "").trim();
  return t === "" ? null : t.startsWith("//") ? e.allowAbsolute && /^\/\/[^/]/.test(t) ? t : null : lt.test(t) ? e.allowAbsolute && /^(https?|mailto):/i.test(t) ? t : null : t.startsWith("/") || t.startsWith("#") || t.startsWith("?") || !e.baseUrl ? t : e.baseUrl.replace(/\/+$/, "") + "/" + t.replace(/^\.\//, "");
}
function dt(n, e = !1) {
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
function re(n) {
  let e = n >>> 0;
  return () => {
    e = e + 1831565813 >>> 0;
    let t = e;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function ys(n) {
  const e = Math.max(1, Math.floor(n.nodes)), t = Math.max(1, Math.min(n.clusters ?? Math.ceil(Math.sqrt(e) / 2), e)), s = re(n.seed ?? 1), i = [], o = Array.from({ length: t }, () => []);
  for (let l = 0; l < e; l++) {
    const c = l % t;
    o[c].push(l), i.push({ id: `n${l + 1}`, label: `N${l + 1}`, group: `Group ${c + 1}` });
  }
  const r = Math.floor(e * (n.avgDegree ?? 4) / 2), a = n.crossRatio ?? 0.08, d = /* @__PURE__ */ new Set(), h = [];
  for (let l = 0; h.length < r && l < r * 20; l++) {
    const c = Math.floor(s() * e);
    let u;
    if (s() < a) u = Math.floor(s() * e);
    else {
      const b = o[c % t];
      u = b[Math.floor(s() * b.length)];
    }
    if (c === u) continue;
    const f = c < u ? `${c}-${u}` : `${u}-${c}`;
    if (d.has(f)) continue;
    d.add(f);
    const p = { id: `e${h.length + 1}`, source: i[c].id, target: i[u].id };
    n.weighted && (p.weight = 1 + Math.floor(s() * 5)), h.push(p);
  }
  return { directed: !!n.directed, nodes: i, edges: h };
}
function ws(n) {
  const e = Math.max(20, Math.floor(n.nodes)), t = re(n.seed ?? 1), s = [], i = [], o = /* @__PURE__ */ new Set(), r = (g) => g[Math.floor(t() * g.length)], a = (g, m) => {
    const M = `n${s.length + 1}`;
    return s.push({ id: M, label: `${g[0]}${s.length + 1}`, group: g, props: m }), M;
  }, d = (g, m, M = {}, y = !1) => {
    const v = g < m ? `${g}|${m}` : `${m}|${g}`;
    if (!y && (g === m || o.has(v))) return;
    o.add(v);
    const E = { id: `e${i.length + 1}`, source: g, target: m, ...M };
    !("weight" in M) && t() < 0.25 && (E.weight = 1 + Math.floor(t() * 4)), i.push(E);
  }, h = (g) => Math.floor(e * g), l = h(0.04), c = h(0.3), u = h(0.32), f = h(0.14), p = [];
  for (; s.length < c; ) {
    const g = Math.min(3 + Math.floor(t() * 7), c - s.length);
    if (g < 2) break;
    const m = Array.from({ length: g }, () => a("Cliques", { clique: p.length + 1 }));
    for (let M = 0; M < g; M++) for (let y = M + 1; y < g; y++) d(m[M], m[y]);
    p.push(m);
  }
  const b = [], w = Math.min(5, u - s.length), k = Array.from({ length: Math.max(w, 2) }, () => a("Hubs"));
  for (let g = 0; g < k.length; g++) for (let m = g + 1; m < k.length; m++)
    d(k[g], k[m]), b.push(k[g], k[m]);
  for (p.length && d(k[0], r(r(p))); s.length < c + u; ) {
    const g = a("Hubs"), m = 1 + Math.floor(t() * 3);
    for (let M = 0; M < m; M++) {
      const y = r(b);
      d(g, y), b.push(g, y);
    }
  }
  for (; s.length < c + u + f; ) {
    const g = Math.min(3 + Math.floor(t() * 10), c + u + f - s.length), m = Array.from({ length: g }, () => a("Chains"));
    d(m[0], r(s.slice(0, s.length - g)).id);
    for (let M = 1; M < g; M++) d(m[M - 1], m[M]);
    g > 4 && t() < 0.3 && d(m[g - 1], m[0]);
  }
  for (; s.length < e - l; ) {
    const g = a("Leaves");
    d(g, t() < 0.5 ? r(b) : r(s.slice(0, s.length - 1)).id);
  }
  for (; s.length < e; ) a("Isolated");
  for (let g = 0; g < Math.ceil(e / 80); g++) d(r(s.filter((m) => m.group !== "Isolated")).id, r(s.filter((m) => m.group !== "Isolated")).id);
  for (let g = 0; g < 4 && i.length; g++) {
    const m = r(i);
    d(m.source, m.target, { weight: 2 + g, label: `parallel ${g + 1}` }, !0);
  }
  for (let g = 0; g < 3; g++) {
    const m = r(s.filter((M) => M.group !== "Isolated")).id;
    d(m, m, { label: "self" }, !0);
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
  interaction: { dragNodes: !0, select: !0, multiSelect: !0, hover: !0, tooltip: !0, gizmo: !1, axisLock: !0, openLinks: "ctrl-click", pickLimit: 2e4 },
  links: { baseUrl: "", target: "self", allowAbsolute: !1, panelSandbox: "allow-same-origin allow-scripts allow-popups allow-forms", badge: !0, badgeColor: "#1c7ed6", badgeSize: 5, hint: !0, chip: !0, chipLabel: "Open page" },
  ui: {
    controls: !0,
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
}, Ge = {
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
function xs(n, e) {
  Ge[n] = e;
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
function pe(n = {}) {
  const e = n.theme ?? oe.theme, t = Ge[e] ?? {};
  return ne(ne(oe, t), n);
}
function vs(n) {
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
  "layout.weightMode": '"ignore" or "strength" (heavier edges pull nodes closer in the force layout).',
  "layout.gravity": "Pull towards the center in the force layout, keeps separate parts together.",
  "layout.direction": '"TB" (top to bottom) or "LR" (left to right) for tree and layered.',
  "layout.seed": "Seed of the random start positions, so layouts are reproducible.",
  "layout.autoRun": "Run the layout when a loaded graph has nodes without coordinates.",
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
}, H = (n) => typeof n == "object" && n !== null && !Array.isArray(n), je = /* @__PURE__ */ new Set(["groups.colors", "ui.cssVars"]);
function ct(n, e) {
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
const ht = `// Graphscape configuration: JSON with comments.
// Comments (// and /* */) and trailing commas are allowed here and are ignored when applying.
// Values that equal the default are fine to keep, they are dropped when the configuration is saved.
`;
function Ms(n, e = !0) {
  const t = (i, o) => {
    const r = ye[i];
    return r ? ct(r, Math.max(40, 100 - o.length)).map((a) => `${o}// ${a}`.trimEnd()).join(`
`) + `
` : "";
  }, s = (i, o, r) => {
    if (H(i)) {
      const a = Object.keys(i);
      if (a.length === 0) return "{}";
      const d = r + "  ";
      return `{
${a.map((l) => {
        const c = o ? `${o}.${l}` : l;
        return `${t(c, d)}${d}${JSON.stringify(l)}: ${s(i[l], c, d)}`;
      }).join(`,
`)}
${r}}`;
    }
    if (Array.isArray(i)) {
      if (i.length === 0) return "[]";
      if (i.every((d) => typeof d != "object" || d === null)) return `[${i.map((d) => JSON.stringify(d)).join(", ")}]`;
      const a = r + "  ";
      return `[
${i.map((d) => a + JSON.stringify(d)).join(`,
`)}
${r}]`;
    }
    return JSON.stringify(i) ?? "null";
  };
  return (e ? ht : "") + s(n, "", "") + `
`;
}
function ut(n) {
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
function ks(n) {
  return JSON.parse(ut(n.replace(/^\uFEFF/, "")));
}
function ft(n, e) {
  const t = {};
  if (!H(e)) return t;
  for (const [s, i] of Object.entries(e)) {
    const o = H(n) ? n[s] : void 0;
    if (H(i) && H(o)) {
      const r = ft(o, i);
      Object.keys(r).length && (t[s] = r);
    } else JSON.stringify(i) !== JSON.stringify(o) && (t[s] = i);
  }
  return t;
}
function pt(n, e = oe, t = "") {
  const s = [];
  if (!H(n) || !H(e)) return s;
  for (const [i, o] of Object.entries(n)) {
    const r = t ? `${t}.${i}` : i;
    i in e ? H(o) && !je.has(r) && s.push(...pt(o, e[i], r)) : s.push(r);
  }
  return s;
}
function Ss() {
  const n = [], e = (t, s) => {
    if (H(t))
      for (const [i, o] of Object.entries(t)) {
        const r = s ? `${s}.${i}` : i;
        r in ye || n.push(r), je.has(r) || e(o, r);
      }
  };
  e(oe, "");
  for (const t of Object.keys(oe.ui.cssVars)) `ui.cssVars.${t}` in ye || n.push(`ui.cssVars.${t}`);
  return n;
}
function Ue(n, e) {
  const t = n.match;
  return typeof t == "function" ? t(e) : !(t.id !== void 0 && e.id !== t.id || t.group !== void 0 && e.group !== t.group || t.tag !== void 0 && !e.tags?.includes(t.tag) || t.prop && e.props?.[t.prop[0]] !== t.prop[1]);
}
function qe(n) {
  const e = /* @__PURE__ */ new Map();
  for (const t of n.nodes) t.group !== void 0 && !e.has(t.group) && e.set(t.group, e.size);
  return e;
}
function Be(n, e, t) {
  const { aspect: s, opacity: i, ...o } = e.node, r = { ...o };
  if (n.group !== void 0) {
    const a = e.groups.palette, d = e.groups.colors[n.group] ?? (a.length ? a[(t.get(n.group) ?? 0) % a.length] : void 0);
    d && (r.color = d);
  }
  for (const a of e.rules) a.target === "node" && Ue(a, n) && Object.assign(r, a.style);
  return n.color && (r.color = n.color), n.shape && (r.shape = n.shape), n.size && n.size > 0 && (r.size = n.size), r;
}
function gt(n, e, t, s) {
  const { color: i, width: o, dashed: r } = t.edge, a = { color: i, width: o, dashed: r }, d = t.edge.widthByWeight;
  if (d.enabled) {
    const h = s.max > s.min ? (e - s.min) / (s.max - s.min) : 0;
    a.width = d.min + (d.max - d.min) * Math.max(0, Math.min(1, h));
  }
  for (const h of t.rules) h.target === "edge" && Ue(h, n) && Object.assign(a, h.style);
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
function X(n) {
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
function mt(n, e) {
  const t = [];
  let s = [], i = "", o = !1;
  for (let r = 0; r < n.length; r++) {
    const a = n[r];
    o ? a === '"' ? n[r + 1] === '"' ? (i += '"', r++) : o = !1 : i += a : a === '"' && i === "" ? o = !0 : a === e ? (s.push(i), i = "") : a === `
` || a === "\r" ? (a === "\r" && n[r + 1] === `
` && r++, s.push(i), i = "", s.some((d) => d.trim() !== "") && t.push(s), s = []) : i += a;
  }
  return s.push(i), s.some((r) => r.trim() !== "") && t.push(s), t;
}
const bt = {
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
function yt(n, e = !1) {
  const t = n.split(/\r?\n/, 1)[0] ?? "", s = [",", ";", "	"].map((l) => ({ d: l, n: t.split(l).length })).sort((l, c) => c.n - l.n)[0].d, i = mt(n, s), o = new ae();
  if (o.directed = e, i.length === 0) return { graph: o.build(), warnings: ["Empty file"], format: "csv" };
  const r = i[0].map((l) => bt[l.trim().toLowerCase()]), a = r.includes("source") && r.includes("target"), d = a ? r : ["source", "target", "weight", "label"];
  for (const l of a ? i.slice(1) : i) {
    const c = {};
    if (d.forEach((p, b) => {
      p && l[b] !== void 0 && (c[p] = l[b].trim());
    }), !c.source) continue;
    if (!c.target) {
      o.addNode(c.source, { label: c.label || void 0, url: c.url || void 0, group: c.group || void 0 });
      continue;
    }
    let u = T(c.weight), f = c.label || void 0;
    !a && u === void 0 && c.weight && (f = c.weight, u = void 0), o.addEdge(c.source, c.target, { weight: u, label: f, url: c.url || void 0, directed: X(c.directed) });
  }
  const h = o.build();
  for (const l of h.edges) l.directed === h.directed && delete l.directed;
  return { graph: h, warnings: o.warnings, format: "csv" };
}
const Ne = (n) => {
  const e = n === void 0 ? "" : String(n);
  return /[",\n\r;]/.test(e) ? `"${e.replace(/"/g, '""')}"` : e;
};
function wt(n) {
  const e = ["source,target,weight,label,url,directed"], t = /* @__PURE__ */ new Set();
  for (const s of n.edges)
    t.add(s.source), t.add(s.target), e.push([s.source, s.target, s.weight ?? 1, s.label, s.url, s.directed ?? n.directed].map(Ne).join(","));
  for (const s of n.nodes) t.has(s.id) || e.push([s.id, "", "", s.label, s.url, ""].map(Ne).join(","));
  return e.join(`
`) + `
`;
}
function xt(n) {
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
      let a = o + 1, d = "";
      for (; a < i && n[a] !== '"'; )
        n[a] === "\\" && n[a + 1] === '"' ? (d += '"', a += 2) : n[a] === "\\" && n[a + 1] === `
` ? a += 2 : d += n[a++];
      e.push({ t: "str", v: d }), o = a + 1;
    } else if (r === "<") {
      let a = 0, d = o;
      for (; d < i; d++)
        if (n[d] === "<") a++;
        else if (n[d] === ">" && --a === 0) break;
      const h = n.slice(o + 1, d).replace(/<br\s*\/?>/gi, `
`).replace(/<[^>]*>/g, "");
      e.push({ t: "str", v: h.trim() }), o = d + 1;
    } else if (r === "-" && (n[o + 1] === ">" || n[o + 1] === "-"))
      e.push({ t: "sym", v: n.slice(o, o + 2) }), o += 2;
    else {
      t.lastIndex = o, s.lastIndex = o;
      const a = t.exec(n), d = s.exec(n);
      a ? (e.push({ t: "id", v: a[0] }), o += a[0].length) : d ? (e.push({ t: "id", v: d[0] }), o += d[0].length) : (e.push({ t: "sym", v: r }), o++);
    }
  }
  return e;
}
const vt = {
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
class Mt {
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
        const d = this.attrList();
        i === "node" ? Object.assign(e.nodeDef, d) : i === "edge" ? Object.assign(e.edgeDef, d) : d.label && (e.label = d.label);
        continue;
      }
      if ((s.t === "id" || s.t === "str") && this.isSym("=", 1)) {
        this.next(), this.next();
        const d = this.next().v;
        s.v === "label" && (e.label = d);
        continue;
      }
      const o = [this.operand(e, t)];
      let r = !1;
      for (; this.isSym("->") || this.isSym("--"); )
        this.next(), r = !0, o.push(this.operand(e, t));
      const a = this.attrList();
      if (r)
        for (let d = 0; d + 1 < o.length; d++)
          for (const h of o[d]) for (const l of o[d + 1]) this.addEdge(h, l, { ...e.edgeDef, ...a });
      else
        for (const d of o[0]) this.applyNode(d, a);
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
        const d = r.label ? W(r.label) : o.replace(/^cluster_?/i, "") || o;
        for (const h of a) {
          const l = this.b.node(h);
          l && l.group === void 0 && (l.group = d);
        }
      }
      return a.forEach((d) => t.add(d)), [...a];
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
    const r = t.shape ? vt[t.shape.toLowerCase()] : void 0;
    r && (i.shape = r);
    const a = t.URL ?? t.href ?? t.url;
    a && (i.url = a), t.group && (i.group = t.group);
    const d = t.sublabel ?? t.xlabel;
    if (d && (i.sublabel = W(d)), Object.assign(s, i), s.shape === "card" && t.label !== void 0) {
      const h = t.label.replace(/[{}]/g, "").split("|");
      s.label = W(h[0]).trim() || e;
      const l = [];
      h.slice(1).forEach((c, u) => {
        u > 0 && l.push("---"), l.push(...W(c).split(`
`).map((f) => f.trim()).filter(Boolean));
      }), s.body = l;
    }
  }
  addEdge(e, t, s) {
    this.b.hasNode(e) || this.b.addNode(e), this.b.hasNode(t) || this.b.addNode(t);
    const i = s.dir?.toLowerCase();
    let o = this.b.directed, r = e, a = t;
    i === "none" ? o = !1 : i === "forward" ? o = !0 : i === "back" ? (o = !0, r = t, a = e) : i === "both" && (o = !1, this.warnedBoth || (this.b.warnings.push("Edges with dir=both were imported as undirected"), this.warnedBoth = !0));
    const d = {
      weight: T(s.weight),
      label: s.label ? W(s.label) : void 0,
      url: s.URL ?? s.href ?? s.url,
      color: s.color ? Ae(s.color) : void 0,
      dashed: s.style && /dashed|dotted/.test(s.style) ? !0 : void 0,
      width: T(s.penwidth)
    }, h = this.b.addEdge(r, a, d);
    o !== this.b.directed && (h.directed = o);
  }
}
function kt(n) {
  const e = new Mt(xt(n));
  return e.parse(), { graph: e.b.build(), warnings: e.b.warnings, format: "dot" };
}
const St = {
  circle: "ellipse",
  square: "square",
  rectangle: "box",
  diamond: "diamond",
  hexagon: "hexagon",
  triangle: "triangle",
  card: "record"
}, G = (n) => `"${n.replace(/"/g, '\\"').replace(/\r?\n/g, "\\n")}"`;
function Et(n) {
  const e = [`${n.directed ? "digraph" : "graph"} ${G(n.meta?.title ?? "G")} {`];
  for (const s of n.nodes) {
    const i = [];
    if (s.shape === "card") {
      const o = s.body?.indexOf("---") ?? -1, r = o < 0 ? s.body ?? [] : (s.body ?? []).slice(0, o), a = o < 0 ? [] : (s.body ?? []).slice(o + 1), d = (h) => h.join("\\l") + (h.length ? "\\l" : "");
      i.push(`label=${G(`{${s.label ?? s.id}|${d(r)}|${d(a)}}`).replace(/\\\\l/g, "\\l")}`, "shape=record");
    } else
      s.label !== void 0 && i.push(`label=${G(s.label)}`), s.shape && i.push(`shape=${St[s.shape]}`);
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
const zt = (n) => n.replace(/&quot;/g, '"').replace(/&amp;/g, "&"), Ct = (n) => n.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
function Lt(n) {
  const e = n.replace(/^\s*#.*$/gm, ""), t = /\s*(\[|\]|"[^"]*"|[^\s[\]"]+)/y, s = [];
  let i;
  for (t.lastIndex = 0; (i = t.exec(e)) !== null; ) s.push(i[1]);
  return s;
}
function He(n, e, t) {
  const s = [];
  for (; e.i < n.length; ) {
    const i = n[e.i++];
    if (i === "]") {
      if (t) throw new Error('Unexpected "]" in GML');
      return s;
    }
    const o = n[e.i++];
    if (o === void 0) throw new Error("Unexpected end of GML");
    o === "[" ? s.push([i, He(n, e, !1)]) : o.startsWith('"') ? s.push([i, zt(o.slice(1, -1))]) : s.push([i, T(o) ?? o]);
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
function $t(n) {
  const e = He(Lt(n), { i: 0 }, !0), t = Ie(e, "graph");
  if (!t) throw new Error("GML document contains no graph [ ... ]");
  const s = new ae();
  s.directed = _(t, "directed") === 1;
  const i = P(t, "label");
  i && (s.meta.title = i);
  for (const [a, d] of t) {
    if (a !== "node" || !Array.isArray(d)) continue;
    const h = P(d, "gsId"), l = h ?? P(d, "id");
    if (l === void 0) {
      s.warnings.push("Skipped a node without id");
      continue;
    }
    const c = Ie(d, "graphics"), u = P(d, "shape"), f = P(d, "body");
    s.addNode(l, {
      label: P(d, "label"),
      sublabel: P(d, "sublabel"),
      x: c ? _(c, "x") : void 0,
      y: c ? _(c, "y") : void 0,
      z: c ? _(c, "z") : void 0,
      group: P(d, "group"),
      url: P(d, "url"),
      color: P(d, "color") ?? (c ? P(c, "fill") : void 0),
      size: _(d, "size"),
      shape: u && xe.includes(u) ? u : void 0,
      body: f ? f.split(`
`) : void 0
    }), h !== void 0 && (s.node(l)._gml = P(d, "id"));
  }
  const o = /* @__PURE__ */ new Map();
  for (const a of s.build().nodes) {
    const d = a._gml;
    d !== void 0 && o.set(d, a.id), delete a._gml;
  }
  const r = (a) => a === void 0 ? void 0 : o.get(a) ?? a;
  for (const [a, d] of t) {
    if (a !== "edge" || !Array.isArray(d)) continue;
    const h = r(P(d, "source")), l = r(P(d, "target"));
    if (h === void 0 || l === void 0) {
      s.warnings.push("Skipped an edge without source/target");
      continue;
    }
    const c = {
      weight: _(d, "weight") ?? _(d, "value"),
      label: P(d, "label"),
      url: P(d, "url"),
      color: P(d, "color")
    }, u = _(d, "directed");
    u !== void 0 && u === 1 !== s.directed && (c.directed = u === 1), s.addEdge(h, l, c);
  }
  return { graph: s.build(), warnings: s.warnings, format: "gml" };
}
function Nt(n) {
  const e = (i) => `"${Ct(i)}"`, t = /* @__PURE__ */ new Map();
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
const At = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };
function me(n) {
  return n.includes("&") ? n.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (e, t) => {
    if (t[0] === "#") {
      const s = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
      return Number.isFinite(s) && s > 0 && s <= 1114111 ? String.fromCodePoint(s) : e;
    }
    return At[t.toLowerCase()] ?? e;
  }) : n;
}
function R(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function It(n) {
  const e = { name: "#root", attrs: {}, children: [], text: "" }, t = [e], s = /<(\/?)([^\s/>!?]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/y, i = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g, o = n.length;
  let r = n.charCodeAt(0) === 65279 ? 1 : 0;
  for (; r < o; ) {
    const a = t[t.length - 1], d = n.indexOf("<", r);
    if (d === -1) {
      a.text += me(n.slice(r));
      break;
    }
    if (d > r && (a.text += me(n.slice(r, d))), r = d, n.startsWith("<!--", r)) {
      const h = n.indexOf("-->", r + 4);
      if (h < 0) throw new Error("Unterminated XML comment");
      r = h + 3;
    } else if (n.startsWith("<![CDATA[", r)) {
      const h = n.indexOf("]]>", r);
      if (h < 0) throw new Error("Unterminated CDATA section");
      a.text += n.slice(r + 9, h), r = h + 3;
    } else if (n.startsWith("<?", r)) {
      const h = n.indexOf("?>", r);
      if (h < 0) throw new Error("Unterminated processing instruction");
      r = h + 2;
    } else if (n.startsWith("<!", r)) {
      let h = 0, l = r + 2;
      for (; l < o; l++) {
        const c = n[l];
        if (c === "[") h++;
        else if (c === "]") h--;
        else if (c === ">" && h <= 0) break;
      }
      r = l + 1;
    } else {
      s.lastIndex = r;
      const h = s.exec(n);
      if (!h) throw new Error(`Malformed XML near offset ${r}`);
      if (r = s.lastIndex, h[1]) {
        if (t.length < 2 || t[t.length - 1].name !== h[2]) throw new Error(`Unexpected closing tag </${h[2]}>`);
        t.pop();
      } else {
        const l = {};
        i.lastIndex = 0;
        let c;
        for (; (c = i.exec(h[3])) !== null; ) l[c[1]] = me(c[2] ?? c[3] ?? "");
        const u = { name: h[2], attrs: l, children: [], text: "" };
        a.children.push(u), h[4] || t.push(u);
      }
    }
  }
  if (t.length !== 1) throw new Error(`Unclosed XML element <${t[t.length - 1].name}>`);
  if (e.children.length === 0) throw new Error("Empty XML document");
  return e.children[0];
}
const K = (n) => n.name.slice(n.name.indexOf(":") + 1);
function se(n, e) {
  return n.children.filter((t) => K(t) === e);
}
function j(n, e) {
  for (const t of n.children) {
    if (e(t)) return t;
    const s = j(t, e);
    if (s) return s;
  }
}
const Ot = /* @__PURE__ */ new Set(["ShapeNode", "GenericNode", "ImageNode", "SVGNode", "UMLClassNode", "GroupNode", "GenericGroupNode", "TableNode"]), Dt = /* @__PURE__ */ new Set(["PolyLineEdge", "ArcEdge", "QuadCurveEdge", "SplineEdge", "BezierEdge", "GenericEdge", "ImageEdge"]), Oe = /* @__PURE__ */ new Set(["GroupNode", "GenericGroupNode"]), Tt = {
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
}, V = (n) => n ? (n.text + n.children.map((e) => V(e)).join("")).trim() : "", B = (n) => (e) => K(e) === n;
function Pt(n, e) {
  return e === "boolean" ? n.trim().toLowerCase() === "true" : ["int", "long", "float", "double"].includes(e) ? T(n) ?? n : n;
}
function be(n) {
  return Math.round(n * 100) / 100;
}
function Rt(n, e = {}) {
  const t = It(n);
  if (K(t) !== "graphml") throw new Error("Not a GraphML document (missing <graphml> root)");
  const s = e.scale ?? 0.5, i = /* @__PURE__ */ new Map();
  for (const f of se(t, "key"))
    i.set(f.attrs.id, {
      id: f.attrs.id,
      name: f.attrs["attr.name"] ?? "",
      type: f.attrs["attr.type"] ?? "string",
      target: f.attrs.for ?? "all",
      yType: f.attrs["yfiles.type"]
    });
  const o = se(t, "graph")[0];
  if (!o) throw new Error("GraphML document contains no <graph>");
  const r = new ae();
  r.directed = o.attrs.edgedefault === "directed";
  const a = [], d = (f, p) => {
    for (const b of f.children) {
      const w = K(b);
      if (w === "node") {
        const k = r.addNode(b.attrs.id, { group: p });
        l(b, k);
        const g = se(b, "graph")[0];
        if (g) {
          const m = k.label?.split(`
`)[0] || k.id;
          k.tags?.includes("group") || (k.tags = [...k.tags ?? [], "group"]), d(g, m);
        }
      } else w === "edge" ? a.push(b) : w === "hyperedge" && r.warnings.push("Hyperedges are not supported and were skipped");
    }
  }, h = (f, p, b, w) => {
    const k = p.name.toLowerCase(), g = b.trim(), m = f;
    switch (k) {
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
        w && M !== void 0 && (m[k] = M);
        return;
      }
      case "shape":
        w && xe.includes(g) && (m.shape = g);
        return;
      case "directed":
        w || (m.directed = X(g));
        return;
      default:
        p.name && g !== "" && ((f.props ??= {})[p.name] = Pt(g, p.type));
    }
  }, l = (f, p) => {
    for (const b of se(f, "data")) {
      const w = i.get(b.attrs.key);
      w && (w.yType === "nodegraphics" ? c(b, p) : h(p, w, V(b), !0));
    }
  }, c = (f, p) => {
    const b = j(f, (v) => Ot.has(K(v)));
    if (!b) return;
    const w = K(b), k = j(b, B("Geometry"));
    let g = "rectangle";
    if (k) {
      const v = T(k.attrs.width) ?? 30, E = T(k.attrs.height) ?? 30, C = T(k.attrs.x) ?? 0, $ = T(k.attrs.y) ?? 0;
      p.x = be((C + v / 2) * s), p.y = be(-($ + E / 2) * s), Oe.has(w) || (p.size = be(Math.max(Math.min(v, E), 1) * s));
    }
    const m = j(b, B("Fill"));
    if (m && m.attrs.transparent !== "true") {
      const v = ie(m.attrs.color);
      v && (p.color = v);
    }
    const M = j(b, B("Shape"));
    M?.attrs.type && (g = Tt[M.attrs.type.toLowerCase()] ?? g), p.shape = g;
    const y = V(j(b, B("NodeLabel")));
    if (y && (p.label = y), w === "UMLClassNode") {
      p.shape = "card";
      const v = V(j(b, B("AttributeLabel"))), E = V(j(b, B("MethodLabel"))), C = [];
      v && C.push(...v.split(/\r?\n/)), (v || E) && C.push("---"), E && C.push(...E.split(/\r?\n/)), p.body = C;
    } else Oe.has(w) && (p.shape = "rectangle", p.tags = [...p.tags ?? [], "group"]);
  }, u = (f) => {
    let p = f.attrs.source, b = f.attrs.target;
    (!r.hasNode(p) || !r.hasNode(b)) && r.warnings.push(`Edge ${p} -> ${b} references an undeclared node; it was created`);
    const w = { id: f.attrs.id };
    let g = X(f.attrs.directed);
    const m = { id: "", source: p, target: b };
    for (const v of se(f, "data")) {
      const E = i.get(v.attrs.key);
      if (E)
        if (E.yType === "edgegraphics") {
          const C = j(v, (O) => Dt.has(K(O)));
          if (!C) continue;
          const $ = j(C, B("Arrows"));
          if ($) {
            const O = ($.attrs.source ?? "none") !== "none", x = ($.attrs.target ?? "none") !== "none";
            O && !x ? ([p, b] = [b, p], g = !0) : g = x && !O;
          }
          const N = j(C, B("LineStyle"));
          if (N) {
            const O = ie(N.attrs.color);
            O && O !== "#000000" && (m.color = O), /dash|dot/i.test(N.attrs.type ?? "") && (m.dashed = !0);
            const x = T(N.attrs.width);
            x !== void 0 && Math.abs(x - 1) > 0.01 && (m.width = Math.min(8, Math.max(0.5, x)));
          }
          const D = V(j(C, B("EdgeLabel")));
          D && (m.label = D);
        } else h(m, E, V(v), !1);
    }
    e.numericLabelsAsWeights && m.label !== void 0 && m.weight === void 0 && /^-?\d+(\.\d+)?$/.test(m.label) && (m.weight = Number(m.label), delete m.label);
    const M = r.addEdge(p, b, { ...m, id: w.id, directed: void 0 }), y = g ?? r.directed;
    y !== r.directed && (M.directed = y);
  };
  d(o);
  for (const f of a) u(f);
  return { graph: r.build(), warnings: r.warnings, format: "graphml" };
}
const Ft = {
  circle: "ellipse",
  square: "rectangle",
  rectangle: "rectangle",
  diamond: "diamond",
  hexagon: "hexagon",
  triangle: "triangle",
  card: "rectangle"
};
function Gt(n, e = {}) {
  const t = e.scale ?? 0.5, s = e.defaultSize ?? 14, i = [], o = (l, c, u) => {
    let f = i.find((p) => p.target === l && p.name === c);
    return f || (f = { id: `k${i.length + 2}`, target: l, name: c, type: u }, i.push(f)), f.id;
  }, r = (l) => typeof l == "number" ? "double" : typeof l == "boolean" ? "boolean" : "string", a = [];
  for (const l of n.nodes) {
    const c = l.size ?? s, u = l.shape ?? "circle", f = (u === "rectangle" ? c * 1.6 : u === "card" ? Math.max(c * 3, 60) : c) / t, p = (u === "card" ? Math.max(c * 3, 40) : c) / t, b = (l.x ?? 0) / t - f / 2, w = -(l.y ?? 0) / t - p / 2, k = ie(l.color) ?? "#CCCCFF", g = R(l.label ?? l.id);
    let m;
    if (u === "card") {
      const y = (l.body ?? []).indexOf("---"), v = (y < 0 ? l.body ?? [] : (l.body ?? []).slice(0, y)).join(`
`), E = y < 0 ? "" : (l.body ?? []).slice(y + 1).join(`
`);
      m = `<y:UMLClassNode><y:Geometry height="${p}" width="${f}" x="${b}" y="${w}"/><y:Fill color="${k}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${g}</y:NodeLabel><y:UML clipContent="true" omitDetails="false" stereotype="" use3DEffect="false"><y:AttributeLabel>${R(v)}</y:AttributeLabel><y:MethodLabel>${R(E)}</y:MethodLabel></y:UML></y:UMLClassNode>`;
    } else
      m = `<y:ShapeNode><y:Geometry height="${p}" width="${f}" x="${b}" y="${w}"/><y:Fill color="${k}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${g}</y:NodeLabel><y:Shape type="${Ft[u]}"/></y:ShapeNode>`;
    const M = [`<data key="d0">${m}</data>`];
    l.url && M.push(`<data key="${o("node", "url", "string")}">${R(l.url)}</data>`), l.group && M.push(`<data key="${o("node", "group", "string")}">${R(l.group)}</data>`), l.sublabel && M.push(`<data key="${o("node", "sublabel", "string")}">${R(l.sublabel)}</data>`), l.z !== void 0 && M.push(`<data key="${o("node", "z", "double")}">${l.z}</data>`), l.color && !ie(l.color) && M.push(`<data key="${o("node", "color", "string")}">${R(l.color)}</data>`);
    for (const [y, v] of Object.entries(l.props ?? {})) M.push(`<data key="${o("node", y, r(v))}">${R(String(v))}</data>`);
    a.push(`    <node id="${R(l.id)}">
      ${M.join(`
      `)}
    </node>`);
  }
  const d = [];
  for (const l of n.edges) {
    const c = l.directed ?? n.directed, u = ie(l.color) ?? "#000000", f = l.label ? `<y:EdgeLabel>${R(l.label)}</y:EdgeLabel>` : "", b = [`<data key="d1">${`<y:PolyLineEdge><y:Path sx="0.0" sy="0.0" tx="0.0" ty="0.0"/><y:LineStyle color="${u}" type="${l.dashed ? "dashed" : "line"}" width="${l.width ?? 1}"/><y:Arrows source="none" target="${c ? "standard" : "none"}"/>${f}</y:PolyLineEdge>`}</data>`];
    l.weight !== void 0 && b.push(`<data key="${o("edge", "weight", "double")}">${l.weight}</data>`), l.url && b.push(`<data key="${o("edge", "url", "string")}">${R(l.url)}</data>`), l.group && b.push(`<data key="${o("edge", "group", "string")}">${R(l.group)}</data>`);
    for (const [w, k] of Object.entries(l.props ?? {})) b.push(`<data key="${o("edge", w, r(k))}">${R(String(k))}</data>`);
    d.push(`    <edge id="${R(l.id)}" source="${R(l.source)}" target="${R(l.target)}">
      ${b.join(`
      `)}
    </edge>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:y="http://www.yworks.com/xml/graphml" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd">
${[
    '  <key for="node" id="d0" yfiles.type="nodegraphics"/>',
    '  <key for="edge" id="d1" yfiles.type="edgegraphics"/>',
    ...i.map((l) => `  <key attr.name="${R(l.name)}" attr.type="${l.type}" for="${l.target}" id="${l.id}"/>`)
  ].join(`
`)}
  <graph id="G" edgedefault="${n.directed ? "directed" : "undirected"}">
${a.join(`
`)}
${d.join(`
`)}
  </graph>
</graphml>
`;
}
const U = (n) => typeof n == "object" && n !== null && !Array.isArray(n), F = (n) => n == null ? void 0 : String(n), jt = /* @__PURE__ */ new Set(["id", "name", "key", "index", "vx", "vy", "vz", "fx", "fy", "fz", "source", "target", "from", "to", "value", "w"]);
function _e(n, e) {
  const t = {};
  for (const [s, i] of Object.entries(n))
    e.has(s) || jt.has(s) || (typeof i == "string" || typeof i == "number" || typeof i == "boolean") && (t[s] = i);
  return Object.keys(t).length ? t : void 0;
}
const Ut = /* @__PURE__ */ new Set(["label", "sublabel", "x", "y", "z", "group", "tags", "url", "color", "shape", "size", "body", "pinned", "props"]), qt = /* @__PURE__ */ new Set(["weight", "directed", "label", "url", "color", "width", "dashed", "group", "props"]);
function Bt(n) {
  const e = F(n.shape);
  return {
    label: F(n.label ?? n.name),
    sublabel: F(n.sublabel),
    x: T(n.x),
    y: T(n.y),
    z: T(n.z),
    group: F(n.group),
    tags: Array.isArray(n.tags) ? n.tags.map(String) : void 0,
    url: F(n.url),
    color: F(n.color),
    shape: e && xe.includes(e) ? e : void 0,
    size: T(n.size),
    body: Array.isArray(n.body) ? n.body.map(String) : void 0,
    pinned: X(n.pinned),
    props: U(n.props) ? n.props : _e(n, Ut)
  };
}
function Ht(n) {
  return {
    id: F(n.id),
    weight: T(n.weight ?? n.value ?? n.w),
    directed: X(n.directed),
    label: F(n.label),
    url: F(n.url),
    color: F(n.color),
    width: T(n.width),
    dashed: X(n.dashed),
    group: F(n.group),
    props: U(n.props) ? n.props : _e(n, qt)
  };
}
function _t(n) {
  const e = JSON.parse(n);
  if (!U(e)) throw new Error("JSON graph must be an object");
  const t = new ae();
  let s = [], i = [];
  if (U(e.elements)) {
    const a = (d) => Array.isArray(d) ? d.map((h) => U(h) && U(h.data) ? h.data : h) : [];
    s = a(e.elements.nodes), i = a(e.elements.edges);
  } else
    s = Array.isArray(e.nodes) ? e.nodes : [], i = Array.isArray(e.edges) ? e.edges : Array.isArray(e.links) ? e.links : [];
  if (t.directed = X(e.directed) ?? !1, U(e.meta)) {
    const a = F(e.meta.dimension);
    t.meta = { title: F(e.meta.title), description: F(e.meta.description), dimension: a === "3d" ? "3d" : a === "2d" ? "2d" : void 0 };
  }
  const o = [];
  s.forEach((a, d) => {
    const h = U(a) ? a : { id: a }, l = F(h.id ?? h.name ?? h.key) ?? `n${d + 1}`;
    o.push(l), t.addNode(l, Bt(h));
  });
  const r = (a) => U(a) ? F(a.id ?? a.name ?? a.key) : typeof a == "number" && !t.hasNode(String(a)) && o[a] !== void 0 ? o[a] : F(a);
  for (const a of i) {
    if (!U(a)) continue;
    const d = r(a.source ?? a.from), h = r(a.target ?? a.to);
    if (d === void 0 || h === void 0) {
      t.warnings.push("Skipped an edge without source or target");
      continue;
    }
    (!t.hasNode(d) || !t.hasNode(h)) && t.warnings.push(`Edge ${d} -> ${h} referenced unknown nodes; they were created`), t.addEdge(d, h, Ht(a));
  }
  return { graph: t.build(), warnings: t.warnings, format: "json" };
}
function Wt(n) {
  return JSON.stringify({ format: "graphscape", version: 1, ...n }, null, 2);
}
const Vt = [
  { id: "json", label: "Graphscape JSON (also D3 / Cytoscape)", extensions: ["json"], mime: "application/json" },
  { id: "graphml", label: "GraphML (yEd)", extensions: ["graphml", "xml"], mime: "application/xml" },
  { id: "gml", label: "GML", extensions: ["gml"], mime: "text/plain" },
  { id: "dot", label: "Graphviz DOT", extensions: ["dot", "gv"], mime: "text/vnd.graphviz" },
  { id: "csv", label: "CSV edge list", extensions: ["csv", "tsv", "txt"], mime: "text/csv" }
];
function Kt(n, e) {
  const t = e?.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  if (t) {
    for (const i of Vt) if (i.id !== "csv" && i.extensions.includes(t)) return i.id;
  }
  const s = n.replace(/^\uFEFF/, "").trimStart();
  return s.startsWith("{") || s.startsWith("[") ? "json" : /^<\?xml|^<graphml/i.test(s) || /<graphml[\s>]/i.test(s.slice(0, 2e3)) ? "graphml" : /(^|\n)\s*graph\s*\[/.test(s.replace(/^\s*#.*$/gm, "")) ? "gml" : /^(strict\s+)?(di)?graph\b[^[{]*\{/i.test(s.replace(/^(\s*(\/\/.*|#.*|\/\*[\s\S]*?\*\/)\s*)+/, "")) ? "dot" : "csv";
}
function Es(n, e = {}) {
  const t = e.format ?? Kt(n, e.filename), s = n.replace(/^\uFEFF/, "");
  switch (t) {
    case "json":
      return _t(s);
    case "graphml":
      return Rt(s, { scale: e.scale, numericLabelsAsWeights: e.numericLabelsAsWeights });
    case "gml":
      return $t(s);
    case "dot":
      return kt(s);
    case "csv":
      return yt(s, e.directed ?? !1);
  }
}
function zs(n, e) {
  switch (e) {
    case "json":
      return Wt(n);
    case "graphml":
      return Gt(n);
    case "gml":
      return Nt(n);
    case "dot":
      return Et(n);
    case "csv":
      return wt(n);
  }
}
function We(n) {
  return n === "circle" || n === "diamond" || n === "hexagon" || n === "triangle";
}
function Me(n, e, t, s) {
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
const ke = (n, e, t) => [n[0] + (e[0] - n[0]) * t, n[1] + (e[1] - n[1]) * t, n[2] + (e[2] - n[2]) * t], ee = (n, e) => Math.hypot(n[0] - e[0], n[1] - e[1], n[2] - e[2]);
function Ve(n, e, t, s) {
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
function Ke(n, e, t) {
  let s = [e, -n, 0], i = Math.hypot(s[0], s[1], s[2]);
  return i < 1e-9 && (s = [-t, 0, n], i = Math.hypot(s[0], s[1], s[2])), i < 1e-9 ? [0, 1, 0] : [s[0] / i, s[1] / i, s[2] / i];
}
function Xt(n, e, t) {
  const s = Math.max(n.hw, n.hh), i = s * t.loopScale * (1 + 0.5 * e), o = e * (Math.PI / 3), r = s + i * 0.35, a = n.pos[0] - Math.sin(o) * r, d = n.pos[1] + Math.cos(o) * r, h = o - Math.PI / 2, l = 0.35, c = Math.max(12, t.segments * 2), u = [];
  for (let f = 0; f <= c; f++) {
    const p = h + l + f / c * (2 * Math.PI - 2 * l);
    u.push([a + i * Math.cos(p), d + i * Math.sin(p), n.pos[2]]);
  }
  return u;
}
function Se(n, e, t) {
  let s = 0;
  for (; s < n.length && we(n[s], e, t); ) s++;
  if (s === 0 || s >= n.length) return n;
  let i = n[s - 1], o = n[s];
  for (let r = 0; r < 18; r++) {
    const a = ke(i, o, 0.5);
    we(a, e, t) ? i = a : o = a;
  }
  return [o, ...n.slice(s)];
}
function Xe(n, e, t) {
  return Se([...n].reverse(), e, t).reverse();
}
function Ye(n, e, t, s, i, o, r) {
  let a;
  if (o)
    a = Xt(n, t, r);
  else {
    const d = (t - (s - 1) / 2) * r.spacing * (i ? -1 : 1);
    if (Math.abs(d) < 1e-6) a = [n.pos, e.pos];
    else {
      const h = e.pos[0] - n.pos[0], l = e.pos[1] - n.pos[1], c = r.dim3 ? e.pos[2] - n.pos[2] : 0, u = Ke(h, l, c), f = [(n.pos[0] + e.pos[0]) / 2, (n.pos[1] + e.pos[1]) / 2, (n.pos[2] + e.pos[2]) / 2], p = [f[0] + u[0] * 2 * d, f[1] + u[1] * 2 * d, f[2] + u[2] * 2 * d];
      a = Ve(n.pos, p, e.pos, r.segments);
    }
  }
  return a = Se(a, n, r.dim3), a = Xe(a, e, r.dim3), a;
}
function Ee(n) {
  let e = 0;
  for (let t = 1; t < n.length; t++) e += ee(n[t - 1], n[t]);
  return e;
}
function Je(n, e) {
  if (n.length < 2 || Ee(n) <= e * 1.2) return n;
  const t = n.slice();
  let s = e;
  for (; t.length >= 2; ) {
    const i = t[t.length - 2], o = t[t.length - 1], r = ee(i, o);
    if (r > s + 1e-9)
      return t[t.length - 1] = ke(i, o, (r - s) / r), t;
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
    if (s <= o) return ke(n[i - 1], n[i], o === 0 ? 0 : s / o);
    s -= o;
  }
  return n[n.length - 1];
}
function Ze(n) {
  const e = n[n.length - 1];
  let t = n.length - 2;
  for (; t > 0 && ee(n[t], e) < 1e-6; ) t--;
  const s = n[Math.max(0, t)], i = ee(s, e) || 1;
  return { tip: e, dir: [(e[0] - s[0]) / i, (e[1] - s[1]) / i, (e[2] - s[2]) / i] };
}
function Qe(n, e, t, s, i, o) {
  const r = i - t, a = o - s, d = r * r + a * a;
  let h = d === 0 ? 0 : ((n - t) * r + (e - s) * a) / d;
  return h = Math.max(0, Math.min(1, h)), Math.hypot(n - (t + h * r), e - (s + h * a));
}
const Cs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dist3: ee,
  distToSegment: Qe,
  edgePath: Ye,
  inside: we,
  isEllipseShape: We,
  nodeExtents: Me,
  normalTo: Ke,
  pathLength: Ee,
  pointAtFraction: ue,
  quadratic: Ve,
  shortenEnd: Je,
  tipOf: Ze,
  trimEnd: Xe,
  trimStart: Se
}, Symbol.toStringTag, { value: "Module" })), Yt = 0.58, Jt = 1.25;
function ce(n, e, t) {
  const s = n.split(`
`).map((i) => Math.min(i.length, t));
  return { w: Math.max(0, ...s) * e * Yt, h: s.length * e * Jt };
}
function q(n, e) {
  return n.boxes?.get(e) ?? { w: n.spacing, h: n.spacing };
}
function Zt(n, e, t = !1) {
  const s = qe(n), i = e.label.show && n.nodes.length <= e.label.maxCount, o = /* @__PURE__ */ new Map();
  for (const r of n.nodes) {
    const a = Be(r, e, s);
    if (a.shape === "card") {
      const c = ce(r.label ?? r.id, e.card.size, 80), u = ce((r.body ?? []).join(`
`), e.card.size, 80), f = e.card.padding;
      o.set(r.id, { w: Math.max(c.w, u.w) + f * 3, h: (c.h + u.h) * 1.12 + f * 3 });
      continue;
    }
    const d = Me(a.shape, a.size, e.node.aspect);
    let h = d.hw * 2, l = d.hh * 2;
    if (i) {
      const c = ce(r.label ?? r.id, e.label.size, e.label.maxChars), u = r.sublabel ? ce(r.sublabel, e.label.subSize, e.label.maxChars) : { w: 0, h: 0 };
      h = Math.max(h, c.w, u.w), l += e.label.gap + c.h + u.h;
    }
    o.set(r.id, { w: h, h: l });
  }
  return o;
}
class et {
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
    this.n = s.length, this.k = t.idealLength, this.dim3 = t.dimension === "3d", this.gravity = t.gravity, this.rnd = re(t.seed), this.ids = s.map((r) => r.id), this.pos = new Float64Array(this.n * 3), this.disp = new Float64Array(this.n * 3), this.fixed = new Uint8Array(this.n);
    const i = this.k * (this.dim3 ? Math.cbrt(this.n) : Math.sqrt(this.n)) * 0.6 + this.k;
    s.forEach((r, a) => {
      this.index.set(r.id, a), this.pos[3 * a] = r.x ?? (this.rnd() * 2 - 1) * i, this.pos[3 * a + 1] = r.y ?? (this.rnd() * 2 - 1) * i, this.pos[3 * a + 2] = this.dim3 ? r.z ?? (this.rnd() * 2 - 1) * i : r.z ?? 0, r.pinned && (this.fixed[a] = 1);
    });
    const o = e.edges.filter((r) => r.source !== r.target);
    this.ea = new Int32Array(o.length), this.eb = new Int32Array(o.length), this.es = new Float64Array(o.length), o.forEach((r, a) => {
      this.ea[a] = this.index.get(r.source), this.eb[a] = this.index.get(r.target);
      const d = e.weightOf(r);
      this.es[a] = t.weightMode === "strength" ? Math.min(4, Math.max(0.25, Math.sqrt(Math.max(d, 0)))) : 1;
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
    const a = (h, l, c) => {
      let u = i[3 * h] - i[3 * l], f = i[3 * h + 1] - i[3 * l + 1], p = s ? i[3 * h + 2] - i[3 * l + 2] : 0, b = u * u + f * f + p * p;
      if (b > c) return;
      b < 1e-6 && (u = (this.rnd() - 0.5) * 0.1, f = (this.rnd() - 0.5) * 0.1, p = s ? (this.rnd() - 0.5) * 0.1 : 0, b = u * u + f * f + p * p + 1e-6);
      const w = r / b;
      o[3 * h] += u * w, o[3 * h + 1] += f * w, o[3 * h + 2] += p * w, o[3 * l] -= u * w, o[3 * l + 1] -= f * w, o[3 * l + 2] -= p * w;
    };
    if (e <= 400)
      for (let h = 0; h < e; h++) for (let l = h + 1; l < e; l++) a(h, l, 1 / 0);
    else {
      const h = t * 4, l = h * h, c = (g) => Math.max(-1e3, Math.min(1e3, Math.floor(g / h))), u = (g, m, M) => ((g + 1024) * 2048 + (m + 1024)) * 2048 + (M + 1024), f = /* @__PURE__ */ new Map(), p = new Int16Array(e), b = new Int16Array(e), w = new Int16Array(e);
      for (let g = 0; g < e; g++) {
        p[g] = c(i[3 * g]), b[g] = c(i[3 * g + 1]), w[g] = s ? c(i[3 * g + 2]) : 0;
        const m = u(p[g], b[g], w[g]), M = f.get(m);
        M ? M.push(g) : f.set(m, [g]);
      }
      const k = s ? 1 : 0;
      for (let g = 0; g < e; g++)
        for (let m = -1; m <= 1; m++)
          for (let M = -1; M <= 1; M++)
            for (let y = -k; y <= k; y++) {
              const v = f.get(u(p[g] + m, b[g] + M, w[g] + y));
              if (v)
                for (const E of v) E > g && a(g, E, l);
            }
    }
    for (let h = 0; h < this.ea.length; h++) {
      const l = this.ea[h], c = this.eb[h], u = i[3 * l] - i[3 * c], f = i[3 * l + 1] - i[3 * c + 1], p = s ? i[3 * l + 2] - i[3 * c + 2] : 0, w = Math.sqrt(u * u + f * f + p * p) / t * this.es[h];
      o[3 * l] -= u * w, o[3 * l + 1] -= f * w, o[3 * l + 2] -= p * w, o[3 * c] += u * w, o[3 * c + 1] += f * w, o[3 * c + 2] += p * w;
    }
    const d = this.temperature;
    for (let h = 0; h < e; h++) {
      if (this.fixed[h]) continue;
      o[3 * h] -= i[3 * h] * this.gravity, o[3 * h + 1] -= i[3 * h + 1] * this.gravity, s && (o[3 * h + 2] -= i[3 * h + 2] * this.gravity);
      const l = s ? o[3 * h + 2] : 0, c = Math.sqrt(o[3 * h] ** 2 + o[3 * h + 1] ** 2 + l * l);
      if (c < 1e-9) continue;
      const u = Math.min(c, d) / c;
      i[3 * h] += o[3 * h] * u, i[3 * h + 1] += o[3 * h + 1] * u, s && (i[3 * h + 2] += l * u);
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
function Qt(n, e) {
  const t = n.nodes.map((y) => y.id), s = new Map(t.map((y, v) => [y, v])), i = t.length, o = Array.from({ length: i }, () => []);
  for (const y of n.edges) {
    const v = s.get(y.source), E = s.get(y.target);
    v !== E && o[v].push(E);
  }
  const r = new Uint8Array(i), a = Array.from({ length: i }, () => []), d = [];
  for (let y = 0; y < i; y++) {
    if (r[y]) continue;
    const v = [[y, 0]];
    for (r[y] = 1, d.push(y); v.length; ) {
      const E = v[v.length - 1], C = E[0];
      if (E[1] < o[C].length) {
        const $ = o[C][E[1]++];
        r[$] === 0 ? (r[$] = 1, d.push($), a[C].push($), v.push([$, 0])) : r[$] === 1 ? a[$].push(C) : a[C].push($);
      } else
        r[C] = 2, v.pop();
    }
  }
  const h = new Int32Array(i);
  for (let y = 0; y < i; y++) for (const v of a[y]) h[v]++;
  const l = new Int32Array(i), c = [];
  for (let y = 0; y < i; y++) h[y] === 0 && c.push(y);
  for (let y = 0; y < c.length; y++) {
    const v = c[y];
    for (const E of a[v])
      l[E] = Math.max(l[E], l[v] + 1), --h[E] === 0 && c.push(E);
  }
  const u = [];
  for (const y of d) (u[l[y]] ??= []).push(y);
  const f = Array.from({ length: i }, () => []);
  for (let y = 0; y < i; y++) for (const v of a[y]) f[v].push(y);
  const p = new Float64Array(i);
  u.forEach((y) => y?.forEach((v, E) => p[v] = E));
  for (let y = 0; y < 8; y++) {
    const v = y % 2 === 0, E = u.map((C, $) => $);
    v || E.reverse();
    for (const C of E.slice(1)) {
      const $ = u[C];
      if (!$) continue;
      const N = /* @__PURE__ */ new Map();
      for (const D of $) {
        const O = v ? f[D] : a[D];
        N.set(D, O.length ? O.reduce((x, z) => x + p[z], 0) / O.length : p[D]);
      }
      $.sort((D, O) => N.get(D) - N.get(O)), $.forEach((D, O) => p[D] = O);
    }
  }
  const b = e.direction === "TB", w = (y) => b ? q(e, y).w : q(e, y).h, k = (y) => b ? q(e, y).h : q(e, y).w, g = /* @__PURE__ */ new Map();
  let m = 0, M = 0;
  return u.forEach((y, v) => {
    if (!y) return;
    const E = Math.max(...y.map((N) => k(t[N])));
    m += v === 0 ? E / 2 : M / 2 + e.gap * 2.2 + E / 2, M = E;
    let $ = -(y.reduce((N, D) => N + w(t[D]), 0) + e.gap * (y.length - 1)) / 2;
    for (const N of y) {
      const D = w(t[N]), O = $ + D / 2;
      $ += D + e.gap, g.set(t[N], b ? [O, -m, 0] : [m, -O, 0]);
    }
  }), g;
}
function ze(n) {
  const e = /* @__PURE__ */ new Map();
  for (const t of n.nodes) t.group !== void 0 && !e.has(t.group) && e.set(t.group, e.size);
  return n.nodes.map((t, s) => ({ id: t.id, g: t.group === void 0 ? -1 : e.get(t.group), i: s })).sort((t, s) => t.g - s.g || t.i - s.i).map((t) => t.id);
}
function Ce(n, e) {
  const t = q(n, e);
  return Math.hypot(t.w, t.h) * 0.75 + n.gap;
}
function es(n, e) {
  const t = ze(n), s = t.map((d) => Ce(e, d)), i = s.reduce((d, h) => d + h, 0) || 1, o = Math.max(i / (2 * Math.PI), Math.max(0, ...s) * 0.5 || 1), r = /* @__PURE__ */ new Map();
  let a = 0;
  return t.forEach((d, h) => {
    const l = (a + s[h] / 2) / i * Math.PI * 2 - Math.PI / 2;
    a += s[h], r.set(d, [o * Math.cos(l), o * Math.sin(l), 0]);
  }), r;
}
function ts(n, e) {
  const t = ze(n), s = t.length;
  let i = 0, o = 0;
  for (const u of t) {
    const f = q(e, u);
    i = Math.max(i, f.w), o = Math.max(o, f.h);
  }
  i += e.gap, o += e.gap;
  const r = !!e.dim3, a = r ? Math.max(1, Math.ceil(Math.cbrt(s))) : Math.max(1, Math.round(Math.sqrt(s * o / i))), d = r ? a : Math.ceil(s / a), h = r ? Math.ceil(s / (a * d)) : 1, l = Math.max(i, o), c = /* @__PURE__ */ new Map();
  return t.forEach((u, f) => {
    const p = f % a, b = Math.floor(f / a) % d, w = r ? Math.floor(f / (a * d)) : 0;
    c.set(u, [(p - (a - 1) / 2) * i, ((d - 1) / 2 - b) * o, r ? (w - (h - 1) / 2) * l : 0]);
  }), c;
}
function ss(n, e) {
  const t = ze(n), s = t.length, i = t.reduce((d, h) => d + Ce(e, h), 0) / Math.max(s, 1) || 1, o = Math.max(i, i * Math.sqrt(s / (4 * Math.PI)) * 1.1), r = Math.PI * (3 - Math.sqrt(5)), a = /* @__PURE__ */ new Map();
  return t.forEach((d, h) => {
    const l = s === 1 ? 0 : 1 - h / (s - 1) * 2, c = Math.sqrt(Math.max(0, 1 - l * l)), u = r * h;
    a.set(d, [Math.cos(u) * c * o, l * o, Math.sin(u) * c * o]);
  }), a;
}
function is(n, e) {
  const t = re(e.seed ?? 1), s = n.nodes.map((a) => a.id), o = (s.reduce((a, d) => a + Ce(e, d), 0) / Math.max(s.length, 1) || 1) * Math.sqrt(s.length) * 0.9, r = /* @__PURE__ */ new Map();
  for (const a of s) r.set(a, [(t() * 2 - 1) * o, (t() * 2 - 1) * o, e.dim3 ? (t() * 2 - 1) * o : 0]);
  return r;
}
function os(n, e) {
  const t = n.nodes.map((x) => x.id), s = t.length, i = /* @__PURE__ */ new Map();
  if (s === 0) return i;
  const o = new Map(t.map((x, z) => [x, z])), r = Array.from({ length: s }, () => []), a = new Int32Array(s), d = new Int32Array(s);
  for (const x of n.edges) {
    const z = o.get(x.source), L = o.get(x.target);
    z !== L && (d[z]++, d[L]++, r[z].push(L), n.isDirected(x) ? a[L]++ : r[L].push(z));
  }
  const h = new Int32Array(s).fill(-1), l = new Int32Array(s).fill(-1), c = Array.from({ length: s }, () => []), u = [], f = (x) => {
    u.push(x), l[x] = 0;
    const z = [x];
    for (let L = 0; L < z.length; L++) {
      const A = z[L];
      for (const I of r[A])
        l[I] === -1 && (l[I] = l[A] + 1, h[I] = A, c[A].push(I), z.push(I));
    }
  }, p = [...Array(s).keys()].filter((x) => a[x] === 0);
  a.some((x) => x > 0) || p.sort((x, z) => d[z] - d[x] || x - z);
  for (const x of p) l[x] === -1 && f(x);
  const b = (x) => {
    const z = /* @__PURE__ */ new Map([[x, 0]]), L = [x];
    let A = 0;
    for (let I = 0; I < L.length; I++) {
      const Y = L[I];
      for (const te of r[Y])
        l[te] !== -1 || z.has(te) || (z.set(te, z.get(Y) + 1), A = Math.max(A, z.get(te)), L.push(te));
    }
    return { reach: L.length, height: A };
  };
  for (; ; ) {
    const x = [...Array(s).keys()].filter((A) => l[A] === -1).sort((A, I) => d[I] - d[A] || A - I);
    if (!x.length) break;
    let z = x[0], L = { reach: -1, height: 0 };
    for (const A of x.slice(0, 8)) {
      const I = b(A);
      (I.reach > L.reach || I.reach === L.reach && I.height < L.height) && (z = A, L = I);
    }
    f(z);
  }
  const w = e.direction === "TB", k = (x) => w ? q(e, t[x]).w : q(e, t[x]).h, g = (x) => w ? q(e, t[x]).h : q(e, t[x]).w, m = [];
  for (const x of u) {
    const z = [x];
    for (; z.length; ) {
      const L = z.pop();
      m.push(L);
      for (let A = c[L].length - 1; A >= 0; A--) z.push(c[L][A]);
    }
  }
  const M = new Float64Array(s);
  for (let x = m.length - 1; x >= 0; x--) {
    const z = m[x], L = c[z], A = L.reduce((I, Y) => I + M[Y], 0) + e.gap * Math.max(0, L.length - 1);
    M[z] = Math.max(k(z), A);
  }
  const y = new Float64Array(s);
  let v = 0;
  for (const x of u)
    y[x] = v, v += M[x] + e.gap * 2;
  const E = v - e.gap * 2;
  for (const x of m) {
    const z = c[x];
    if (!z.length) continue;
    const L = z.reduce((I, Y) => I + M[Y], 0) + e.gap * (z.length - 1);
    let A = y[x] + (M[x] - L) / 2;
    for (const I of z)
      y[I] = A, A += M[I] + e.gap;
  }
  const C = new Float64Array(s);
  for (let x = m.length - 1; x >= 0; x--) {
    const z = m[x], L = c[z];
    C[z] = L.length ? (C[L[0]] + C[L[L.length - 1]]) / 2 : y[z] + M[z] / 2;
  }
  const $ = Math.max(...Array.from(l)), N = new Float64Array($ + 1);
  for (let x = 0; x < s; x++) N[l[x]] = Math.max(N[l[x]], g(x));
  const D = new Float64Array($ + 1);
  let O = 0;
  for (let x = 0; x <= $; x++)
    O += x === 0 ? N[0] / 2 : N[x - 1] / 2 + e.gap * 2.2 + N[x] / 2, D[x] = O;
  for (let x = 0; x < s; x++) {
    const z = C[x] - E / 2;
    i.set(t[x], w ? [z, -D[l[x]], 0] : [D[l[x]], -z, 0]);
  }
  return i;
}
const tt = {
  dimension: "2d",
  spacing: 40,
  gap: 12,
  idealLength: 60,
  gravity: 0.05,
  weightMode: "ignore",
  direction: "TB",
  seed: 1,
  iterations: 300
}, Ls = ["force", "tree", "layered", "circle", "grid", "sphere", "random"];
function ns(n, e, t = {}) {
  const s = { ...tt, ...t }, i = { spacing: s.spacing, gap: s.gap, boxes: s.boxes, dim3: s.dimension === "3d", seed: s.seed };
  switch (e) {
    case "circle":
      return es(n, i);
    case "grid":
      return ts(n, i);
    case "sphere":
      return ss(n, i);
    case "random":
      return is(n, i);
    case "layered":
      return Qt(n, { ...i, direction: s.direction });
    case "tree":
      return os(n, { ...i, direction: s.direction });
    case "force": {
      const o = new et(n, s);
      for (let r = 0; r < s.iterations && o.alpha > 0.02; r++) o.step();
      return new Map(o.entries());
    }
  }
}
function De(n, e, t, s) {
  const i = re(s), o = e === "3d", r = (h) => h.x !== void 0 && h.y !== void 0, a = t * Math.sqrt(Math.max(n.nodes.length, 1)) * 0.6 + t;
  let d = 0;
  for (const h of n.nodes) {
    if (r(h)) {
      h.z === void 0 && (h.z = 0);
      continue;
    }
    let l;
    for (const u of n.edges) {
      const f = u.source === h.id ? n.getNode(u.target) : u.target === h.id ? n.getNode(u.source) : void 0;
      if (f && f !== h && r(f)) {
        l = { x: f.x, y: f.y, z: f.z ?? 0 };
        break;
      }
    }
    const c = l ? t * 0.6 : a;
    h.x = (l?.x ?? 0) + (i() * 2 - 1) * c, h.y = (l?.y ?? 0) + (i() * 2 - 1) * c, h.z = o ? (l?.z ?? 0) + (i() * 2 - 1) * c : l?.z ?? 0, d++;
  }
  return d;
}
const he = 4096;
function rs(n, e, t, s, i, o) {
  n.beginPath(), typeof n.roundRect == "function" ? n.roundRect(e, t, s, i, o) : n.rect(e, t, s, i);
}
class as {
  constructor(e = 4) {
    this.resolution = e;
  }
  map = /* @__PURE__ */ new Map();
  clear() {
    for (const e of this.map.values()) e.texture.dispose();
    this.map.clear();
  }
  make(e) {
    const t = new S.CanvasTexture(e);
    return t.colorSpace = S.SRGBColorSpace, t.anisotropy = 4, t;
  }
  /**
   * Label texture. `text` may contain line breaks; `sub` adds a smaller second block below
   * (its own size and color) that is also allowed to contain line breaks.
   */
  text(e, t, s) {
    const i = JSON.stringify(["t", e, t, s ?? null, this.resolution]), o = this.map.get(i);
    if (o) return o;
    const r = this.resolution, a = (w) => w.length > t.maxChars ? w.slice(0, Math.max(1, t.maxChars - 1)) + "…" : w, d = [
      ...e.split(`
`).map((w) => ({ t: a(w), px: t.size * r, color: t.color })),
      ...s?.text ? s.text.split(`
`).map((w) => ({ t: a(w), px: s.size * r, color: s.color })) : []
    ], h = t.padding * r, l = document.createElement("canvas");
    let c = l.getContext("2d"), u = 0, f = 0;
    for (const w of d)
      c.font = `${w.px}px ${t.font}`, u = Math.max(u, c.measureText(w.t).width), f += w.px * 1.25;
    l.width = Math.min(he, Math.max(2, Math.ceil(u + h * 2))), l.height = Math.min(he, Math.max(2, Math.ceil(f + h * 2))), c = l.getContext("2d"), c.textAlign = "center", c.textBaseline = "middle", t.background && (c.fillStyle = t.background, rs(c, 0, 0, l.width, l.height, t.size * r * 0.25), c.fill());
    let p = h;
    for (const w of d) {
      const k = w.px * 1.25;
      c.font = `${w.px}px ${t.font}`, c.fillStyle = w.color, c.fillText(w.t, l.width / 2, p + k / 2), p += k;
    }
    const b = { texture: this.make(l), w: l.width / r, h: l.height / r };
    return this.map.set(i, b), b;
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
    const i = s.card, o = e.label ?? e.id, r = e.body ?? [], a = JSON.stringify(["c", o, r, t.color, i, this.resolution]), d = this.map.get(a);
    if (d) return d;
    const h = this.resolution, l = i.size * h, c = l * 1.4, u = i.padding * h, f = document.createElement("canvas").getContext("2d"), p = o.split(`
`);
    f.font = `bold ${l}px ${i.font}`;
    const b = Math.max(...p.map((C) => f.measureText(C).width));
    f.font = `${l}px ${i.font}`;
    const w = r.length ? Math.max(...r.map((C) => C === "---" ? 0 : f.measureText(C).width)) : 0, k = Math.min(he, Math.ceil(Math.max(b, w) + u * 3)), g = p.length * c + u * 1.5, m = r.length ? r.length * c + u * 1.5 : 0, M = Math.min(he, Math.ceil(g + m)), y = document.createElement("canvas");
    y.width = Math.max(2, k), y.height = Math.max(2, M);
    const v = y.getContext("2d");
    v.fillStyle = i.background, v.fillRect(0, 0, y.width, y.height), v.fillStyle = i.headerBackground ?? t.color, v.fillRect(0, 0, y.width, g), v.textBaseline = "middle", v.textAlign = "center", v.font = `bold ${l}px ${i.font}`, v.fillStyle = i.headerColor, p.forEach((C, $) => v.fillText(C, y.width / 2, u * 0.75 + c * ($ + 0.5))), v.textAlign = "left", v.font = `${l}px ${i.font}`, r.forEach((C, $) => {
      const N = g + u * 0.75 + c * ($ + 0.5);
      C === "---" ? (v.strokeStyle = i.border, v.lineWidth = Math.max(1, h * 0.3), v.beginPath(), v.moveTo(0, N), v.lineTo(y.width, N), v.stroke()) : (v.fillStyle = i.textColor, v.fillText(C, u * 1.5, N));
    }), v.strokeStyle = i.border, v.lineWidth = Math.max(2, h * 0.5), v.strokeRect(0, 0, y.width, y.height);
    const E = { texture: this.make(y), w: y.width / h, h: y.height / h };
    return this.map.set(a, E), E;
  }
}
const ls = `
.gs-container{position:relative;overflow:hidden}
.gs-root{position:absolute;inset:0;overflow:hidden;font-family:var(--gs-font,system-ui,sans-serif);color:var(--gs-panel-fg,#1f2933);touch-action:none;user-select:none;-webkit-user-select:none}
.gs-root canvas{display:block;outline:none}
.gs-tooltip{position:absolute;z-index:3;pointer-events:none;max-width:260px;padding:6px 9px;font-size:12px;line-height:1.35;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px);box-shadow:0 2px 8px rgba(0,0,0,.18);white-space:pre-wrap;overflow-wrap:anywhere}
.gs-tooltip[hidden]{display:none}
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
function ds() {
  if (typeof document > "u" || document.getElementById("gs-styles")) return;
  const n = document.createElement("style");
  n.id = "gs-styles", n.textContent = ls, document.head.appendChild(n);
}
const Q = 400, cs = new S.Vector3(1, 0, 0), Te = { x: 0, y: 1, z: 2 }, Pe = { x: "#e03131", y: "#2f9e44", z: "#1c7ed6" }, Re = new S.Quaternion(), hs = 4;
class $s {
  events = new Fe();
  config;
  _graph;
  userConfig;
  container;
  root;
  canvas;
  renderer;
  scene = new S.Scene();
  persp;
  ortho;
  camera;
  controls;
  orbit = null;
  disposeControls = () => {
  };
  pointerIsDown = !1;
  activeUntil = 0;
  ambient = new S.AmbientLight(16777215, 1.8);
  headlight = new S.DirectionalLight(16777215, 1.6);
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
  chipEl;
  chipTarget = null;
  // transform gizmo: TransformControls attached to an invisible pivot at the center of the selection
  tc = null;
  tcHelper = null;
  pivot = new S.Object3D();
  gizmoMode = "translate";
  gizmoDragging = !1;
  gizmoStart = null;
  snapHeld = !1;
  panelEl = null;
  tmpM = new S.Matrix4();
  tmpV = new S.Vector3();
  tmpV2 = new S.Vector3();
  tmpQ = new S.Quaternion();
  tmpS = new S.Vector3();
  raycaster = new S.Raycaster();
  plane = new S.Plane();
  constructor(e, t = {}, s) {
    this.container = e, this.userConfig = t, this.config = pe(t), this._graph = s instanceof fe ? s : new fe(s), this.config.ui.injectStyles && ds(), e.classList.add("gs-container"), this.root = document.createElement("div"), this.root.className = "gs-root", e.appendChild(this.root), this.renderer = new S.WebGLRenderer({ antialias: this.config.render.antialias, alpha: !0 }), this.renderer.setClearColor(0, 0), this.canvas = this.renderer.domElement, this.root.appendChild(this.canvas), this.tex = new as(this.config.label.resolution), this.persp = new S.PerspectiveCamera(this.config.camera.fov, 1, 1, 1e5), this.ortho = new S.OrthographicCamera(-1, 1, 1, -1, 0.1, 1e4), this.camera = this.config.dimension === "3d" ? this.persp : this.ortho, this.scene.add(this.ambient, this.headlight, this.headlight.target, this.pivot), this.tooltipEl = document.createElement("div"), this.tooltipEl.className = "gs-tooltip gs-ui", this.tooltipEl.hidden = !0, this.boxEl = document.createElement("div"), this.boxEl.className = "gs-box", this.boxEl.hidden = !0, this.chipEl = document.createElement("button"), this.chipEl.type = "button", this.chipEl.className = "gs-chip gs-ui", this.chipEl.hidden = !0, this.chipEl.addEventListener("click", () => {
      this.chipTarget && this.openLink(this.chipTarget.kind, this.chipTarget.id);
    }), this.root.append(this.tooltipEl, this.boxEl, this.chipEl), this.setupCamera(), this.buildControls(), this.applyAppearance(), this.root.addEventListener("pointerdown", this.onPointerDown, !0), this.root.addEventListener("pointermove", this.onPointerMove), this.root.addEventListener("pointerup", this.onPointerUp), this.root.addEventListener("pointercancel", this.onPointerUp), this.root.addEventListener("pointerleave", this.onPointerLeave), this.root.addEventListener("dblclick", this.onDblClick), this.root.addEventListener("wheel", this.onWheel, { passive: !0 }), window.addEventListener("keydown", this.onKeyDown), window.addEventListener("keyup", this.onKeyUp), window.addEventListener("blur", this.onBlur), document.addEventListener("fullscreenchange", this.onFullscreenChange), typeof ResizeObserver < "u" && (this.ro = new ResizeObserver(() => this.resize()), this.ro.observe(e)), this.subscribe(), this.resize(), this.afterLoad();
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
    this.stopLayout(), this.unsubGraph(), e instanceof fe ? this._graph = e : this._graph.load(e, !1), this.subscribe(), this.selNodes.clear(), this.selEdges.clear(), this.hoverNode = this.hoverEdge = null;
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
    this.userConfig = e, this.config = pe(this.userConfig), this.tex.resolution = this.config.label.resolution, this.tex.clear(), this.persp.fov = this.config.camera.fov, this.persp.updateProjectionMatrix(), this.config.dimension === "3d" && this.config.camera.rotation !== t && this.setupCamera(!0), this.orbit && (this.orbit.enableDamping = this.config.camera.damping), this.applyControlLimits(), this.applyAppearance(), this.buildControls(), this.setupGizmo(), this.dirtyStructure = !0, this.requestRender();
  }
  getDimension() {
    return this.config.dimension;
  }
  setDimension(e) {
    e !== this.config.dimension && (this.stopLayout(), this.userConfig = ne(this.userConfig, { dimension: e }), this.config = pe(this.userConfig), this.camera = e === "3d" ? this.persp : this.ortho, this.setupCamera(), this.resize(), this.dirtyStructure = !0, this.pendingFit = this.config.camera.autoFit, this.dimButton && (this.dimButton.textContent = e === "2d" ? "3D" : "2D"), this.events.emit("dimensionchange", { dimension: e }), this.requestRender());
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
      ...tt,
      dimension: i.dimension,
      spacing: i.layout.spacing,
      idealLength: i.layout.idealLength,
      gravity: i.layout.gravity,
      weightMode: i.layout.weightMode,
      direction: i.layout.direction,
      seed: i.layout.seed,
      gap: i.layout.gap,
      boxes: Zt(s, i, i.dimension === "3d"),
      ...t
    };
    if (this.events.emit("layoutstart", { name: e }), e === "force")
      return this.sim = new et(s, o), this.simName = e, this.requestRender(), new Promise((a) => {
        this.simResolve = a;
      });
    const r = ns(s, e, o);
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
    let i = 1 / 0, o = 1 / 0, r = 1 / 0, a = -1 / 0, d = -1 / 0, h = -1 / 0;
    for (const k of e) {
      const [g, m, M] = k.body.pos;
      i = Math.min(i, g - k.body.hw), a = Math.max(a, g + k.body.hw), o = Math.min(o, m - k.body.hh), d = Math.max(d, m + k.body.hh), r = Math.min(r, M), h = Math.max(h, M);
    }
    const l = (i + a) / 2, c = (o + d) / 2, u = (r + h) / 2, f = this.config.camera.fitPadding, p = Math.max(a - i, 10), b = Math.max(d - o, 10), w = h - r;
    if (s) {
      const k = Math.max(0.5 * Math.hypot(p, b, w), 10), g = S.MathUtils.degToRad(this.persp.fov) / 2, m = Math.atan(Math.tan(g) * (this.width / this.height)), M = k / Math.sin(Math.min(g, m)) * f * 0.8, y = this.tmpV.copy(t.position).sub(this.controls.target);
      y.lengthSq() < 1e-9 && y.set(0, 0, 1), y.normalize(), this.controls.target.set(l, c, u), t.position.set(l, c, u).addScaledVector(y, M);
    } else {
      const k = this.width / this.height, g = Math.min(Q * k / p, Q / b) / f;
      this.ortho.zoom = Math.min(this.config.camera.zoomMax, Math.max(this.config.camera.zoomMin, g)), this.ortho.position.set(l, c, 1e3), this.controls.target.set(l, c, 0), this.ortho.updateProjectionMatrix();
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
    const s = e === "node" ? this._graph.getNode(t) : this._graph.getEdge(t), i = Z(s?.url, this.config.links);
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
      const o = new it(this.camera, this.canvas);
      o.rotateSpeed = 2.5, o.zoomSpeed = 1.2, o.panSpeed = 0.8, o.staticMoving = !1, o.dynamicDampingFactor = 0.12, o.keys = ["", "", ""], o.addEventListener("change", this.onCameraChange), this.disposeControls = () => {
        o.removeEventListener("change", this.onCameraChange), o.dispose();
      }, this.orbit = null, this.controls = o;
    } else {
      const o = new st(this.camera, this.canvas);
      o.enableDamping = this.config.camera.damping, o.zoomToCursor = !0, o.addEventListener("change", this.onCameraChange), t ? (o.mouseButtons = { LEFT: S.MOUSE.ROTATE, MIDDLE: S.MOUSE.DOLLY, RIGHT: S.MOUSE.PAN }, o.touches = { ONE: S.TOUCH.ROTATE, TWO: S.TOUCH.DOLLY_PAN }) : (o.enableRotate = !1, o.screenSpacePanning = !0, o.mouseButtons = { LEFT: S.MOUSE.PAN, MIDDLE: S.MOUSE.DOLLY, RIGHT: S.MOUSE.PAN }, o.touches = { ONE: S.TOUCH.PAN, TWO: S.TOUCH.DOLLY_PAN }), this.disposeControls = () => {
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
    }), this.updateFullscreenButton()), this.root.appendChild(e), this.controlsEl = e;
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
    return t || (t = new S.Color(e), this.colors.set(e, t)), t;
  }
  geometryFor(e) {
    let t = this.geoms.get(e);
    if (t) return t;
    switch (e) {
      case "circle3d":
        t = new S.SphereGeometry(0.5, 24, 16);
        break;
      case "square3d":
      case "rectangle3d":
        t = new S.BoxGeometry(1, 1, 1);
        break;
      case "diamond3d":
        t = new S.OctahedronGeometry(0.62);
        break;
      case "hexagon3d":
        t = new S.CylinderGeometry(0.5, 0.5, 1, 6), t.rotateX(Math.PI / 2), t.rotateZ(Math.PI / 2);
        break;
      case "triangle3d":
        t = new S.CylinderGeometry(0.5, 0.5, 1, 3), t.rotateX(-Math.PI / 2);
        break;
      case "square":
      case "rectangle":
        t = new S.PlaneGeometry(1, 1);
        break;
      case "diamond":
        t = new S.CircleGeometry(0.5, 4);
        break;
      case "hexagon":
        t = new S.CircleGeometry(0.5, 6);
        break;
      case "triangle":
        t = new S.CircleGeometry(0.5, 3), t.rotateZ(Math.PI / 2);
        break;
      case "arrow":
        t = new S.ConeGeometry(0.5, 1, 14), t.rotateZ(-Math.PI / 2), t.translate(-0.5, 0, 0);
        break;
      default:
        t = new S.CircleGeometry(0.5, 40);
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
    const s = this.config.dimension === "3d", i = new S.SpriteMaterial({ map: e.texture, transparent: !0, depthTest: s, depthWrite: !1 }), o = new S.Sprite(i);
    return o.renderOrder = t, o.frustumCulled = !1, this.scene.add(o), o;
  }
  rebuildStructure() {
    this.dirtyStructure = !1, this.clearScene();
    const e = this.config, t = this._graph, s = e.dimension === "3d";
    De(t, e.dimension, e.layout.idealLength, e.layout.seed);
    for (const c of [...this.selNodes]) t.hasNode(c) || this.selNodes.delete(c);
    for (const c of [...this.selEdges]) t.getEdge(c) || this.selEdges.delete(c);
    this.hoverNode && !t.hasNode(this.hoverNode) && (this.hoverNode = null), this.hoverEdge && !t.getEdge(this.hoverEdge) && (this.hoverEdge = null);
    const i = qe(t), o = /* @__PURE__ */ new Map();
    for (const c of t.nodes) {
      const u = Be(c, e, i), f = Me(u.shape, u.size, e.node.aspect), p = {
        node: c,
        style: u,
        body: { pos: [0, 0, 0], hw: f.hw, hh: f.hh, ellipse: We(u.shape) },
        layerKey: null,
        layer: null,
        slot: -1
      };
      if (u.shape === "card")
        p.card = this.tex.card(c, u, e), p.body.hw = p.card.w / 2, p.body.hh = p.card.h / 2, p.body.ellipse = !1, s && (p.body.hw = p.body.hh = Math.max(p.body.hw, p.body.hh)), p.sprite = this.makeSprite(p.card, 4);
      else {
        p.layerKey = s ? `${u.shape}3d` : u.shape;
        const b = o.get(p.layerKey) ?? [];
        b.push(p), o.set(p.layerKey, b);
      }
      this.nodeInfo.set(c.id, p);
    }
    for (const [c, u] of o) {
      const f = this.geometryFor(c), p = s ? new S.MeshLambertMaterial() : new S.MeshBasicMaterial();
      this.applyMode(p, e.node.opacity);
      const b = new S.MeshBasicMaterial({ side: s ? S.BackSide : S.FrontSide });
      this.applyMode(b, e.node.opacity);
      const w = new S.InstancedMesh(f, p, u.length), k = new S.InstancedMesh(f, b, u.length);
      for (const m of [w, k])
        m.frustumCulled = !1, m.instanceMatrix.setUsage(S.DynamicDrawUsage);
      k.renderOrder = 3, w.renderOrder = 4;
      const g = { key: c, body: w, outline: k };
      u.forEach((m, M) => {
        m.layer = g, m.slot = M, w.setColorAt(M, this.color(m.style.color)), k.setColorAt(M, this.color(m.style.borderColor));
      }), this.layers.set(c, g), this.scene.add(k, w);
    }
    if (e.label.show && t.nodes.length <= e.label.maxCount)
      for (const c of this.nodeInfo.values()) {
        if (c.card) continue;
        const u = c.node.sublabel ? { text: c.node.sublabel, size: e.label.subSize, color: e.label.subColor } : void 0, f = this.tex.text(c.node.label ?? c.node.id, { ...e.label, color: c.style.labelColor }, u);
        c.sprite = this.makeSprite(f, 5);
      }
    let r = 1 / 0, a = -1 / 0;
    for (const c of t.edges) {
      const u = t.weightOf(c);
      r = Math.min(r, u), a = Math.max(a, u);
    }
    const d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    let l = 0;
    for (const c of t.edges) {
      const u = t.weightOf(c), f = gt(c, u, e, { min: r, max: a }), p = c.source === c.target, b = {
        edge: c,
        style: f,
        weight: u,
        directed: t.isDirected(c),
        index: 0,
        count: 1,
        flip: !p && c.source > c.target,
        self: p,
        path: [],
        arrowSlot: -1,
        bucketKey: `${f.width}|${f.dashed ? 1 : 0}`
      }, w = p ? `s\0${c.source}` : c.source < c.target ? `${c.source}\0${c.target}` : `${c.target}\0${c.source}`, k = d.get(w) ?? [];
      k.push(b), d.set(w, k), this.edgeInfo.set(c.id, b), b.directed && e.edge.arrows && (b.arrowSlot = l++);
      let g = h.get(b.bucketKey);
      if (!g) {
        const m = new nt({
          color: 16777215,
          linewidth: f.width,
          vertexColors: !0,
          dashed: f.dashed,
          dashSize: e.edge.dashSize,
          gapSize: e.edge.gapSize
        });
        m.resolution.set(this.width, this.height), this.applyMode(m, e.edge.opacity);
        const M = new rt(new Le(), m);
        M.frustumCulled = !1, M.renderOrder = 1, M.visible = !1, this.scene.add(M), g = { key: b.bucketKey, mesh: M, edges: [], dashed: f.dashed }, h.set(b.bucketKey, g);
      }
      g.edges.push(b);
    }
    for (const c of d.values()) c.forEach((u, f) => {
      u.index = f, u.count = c.length;
    });
    if (this.buckets = [...h.values()], l > 0) {
      const c = new S.MeshBasicMaterial();
      this.applyMode(c, e.edge.opacity);
      const u = new S.InstancedMesh(this.geometryFor("arrow"), c, l);
      u.frustumCulled = !1, u.renderOrder = 2, u.instanceMatrix.setUsage(S.DynamicDrawUsage);
      for (let f = 0; f < l; f++) u.setColorAt(f, this.color("#ffffff"));
      this.arrowMesh = u, this.scene.add(u);
    }
    if (t.edges.length <= e.weight.maxCount)
      for (const c of this.edgeInfo.values()) {
        const u = this.edgeText(c);
        u && (c.img = this.tex.text(u, { ...e.weight, maxChars: e.label.maxChars }), c.sprite = this.makeSprite(c.img, 5));
      }
    if (e.links.badge && e.interaction.openLinks !== "never") {
      const c = this.tex.badge(e.links.badgeColor);
      for (const u of this.nodeInfo.values()) Z(u.node.url, e.links) && (u.badge = this.makeSprite(c, 6));
      for (const u of this.edgeInfo.values()) Z(u.edge.url, e.links) && (u.badge = this.makeSprite(c, 6));
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
      const a = this.selNodes.has(i), d = i === this.hoverNode, h = a ? e.selection.width : d ? e.selection.width * 0.8 : o.style.borderWidth, l = o.body.hw * 2, c = o.body.hh * 2, [u, f, p] = o.body.pos;
      s.compose(this.tmpV.set(u, f, p), Re, this.tmpS.set(l, c, t ? c : 1)), r.body.setMatrixAt(o.slot, s), s.compose(this.tmpV.set(u, f, p), Re, this.tmpS.set(l + 2 * h, c + 2 * h, t ? c + 2 * h : 1)), r.outline.setMatrixAt(o.slot, s), r.outline.setColorAt(o.slot, this.color(a ? e.selection.color : d ? e.selection.hoverColor : o.style.borderColor));
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
      let r = Ye(i, o, s.index, s.count, s.flip, s.self, t);
      s.tip = void 0, s.arrowSlot >= 0 && r.length >= 2 && (s.tip = Ze(r), r = Je(r, e.edge.arrowSize * 0.9)), s.path = r;
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
        const d = this.edgeColor(a);
        for (let h = 1; h < a.path.length; h++) {
          const l = a.path[h - 1], c = a.path[h];
          s[o] = l[0], s[o + 1] = l[1], s[o + 2] = l[2], s[o + 3] = c[0], s[o + 4] = c[1], s[o + 5] = c[2], i[o] = i[o + 3] = d.r, i[o + 1] = i[o + 4] = d.g, i[o + 2] = i[o + 5] = d.b, o += 6;
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
        this.tmpQ.setFromUnitVectors(cs, this.tmpV2.set(s[0], s[1], s[2])), this.tmpM.compose(this.tmpV.set(t.tip.tip[0], t.tip.tip[1], t.tip.tip[2]), this.tmpQ, this.tmpS.set(e, e * 0.8, e * 0.8)), this.arrowMesh.setMatrixAt(t.arrowSlot, this.tmpM), this.arrowMesh.setColorAt(t.arrowSlot, this.edgeColor(t));
      }
      this.arrowMesh.instanceMatrix.needsUpdate = !0, this.arrowMesh.instanceColor && (this.arrowMesh.instanceColor.needsUpdate = !0);
    }
  }
  updateLabels() {
    const e = this.config, t = e.label.mode === "screen", s = e.dimension === "3d";
    for (const i of this.nodeInfo.values()) {
      const o = i.sprite;
      if (!o) continue;
      const [r, a, d] = i.body.pos;
      if (i.card) {
        o.position.set(r, a, d), o.scale.set(i.card.w, i.card.h, 1);
        continue;
      }
      const h = o.material.map.image, l = this.tex.resolution, c = t ? 1 / this.pxPerUnitAt(r, a, d) : 1, u = h.width / l * c, f = h.height / l * c;
      o.scale.set(u, f, 1), o.position.set(r, a - i.body.hh - e.label.gap * c - f / 2, d), s && this.towardCamera(o.position, i.body.hw + 1);
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
        const h = [...this.selNodes][0], l = this.nodeInfo.get(h);
        if (l && Z(l.node.url, t.links)) {
          const c = this.pxPerUnitAt(l.body.pos[0], l.body.pos[1], l.body.pos[2]);
          i = { kind: "node", id: h, at: l.body.pos, dx: l.body.hw * c + 8, dy: -l.body.hh * c - 4 };
        }
      } else if (this.selEdges.size === 1 && this.selNodes.size === 0) {
        const h = [...this.selEdges][0], l = this.edgeInfo.get(h);
        l && l.path.length >= 2 && Z(l.edge.url, t.links) && (i = { kind: "edge", id: h, at: ue(l.path, 0.5), dx: 12, dy: -12 });
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
    const a = (o.x * 0.5 + 0.5) * this.width + i.dx, d = (-o.y * 0.5 + 0.5) * this.height + i.dy;
    e.style.left = `${Math.max(4, Math.min(a, this.width - e.offsetWidth - 4))}px`, e.style.top = `${Math.max(4, Math.min(d, this.height - e.offsetHeight - 4))}px`;
  }
  /** "Ctrl+click to open the page", or "" when the item has no usable link. */
  linkHint(e) {
    const t = this.config;
    if (!t.links.hint || t.interaction.openLinks === "never" || !Z(e, t.links)) return "";
    const s = typeof navigator < "u" && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent), i = dt(t.interaction.openLinks, s);
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
    return this.height / (2 * Math.tan(S.MathUtils.degToRad(this.persp.fov) / 2) * o);
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
    const e = new ot(this.camera, this.canvas);
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
    e.setTranslationSnap(this.snapHeld ? t.snapTranslate : null), e.setRotationSnap(this.snapHeld ? S.MathUtils.degToRad(t.snapRotate) : null), e.setScaleSnap(this.snapHeld ? t.snapScale : null);
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
        const d = this.nodeInfo.get(a).body.pos;
        i += d[0], o += d[1], r += d[2];
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
    const s = this.config.dimension === "3d", i = e.pivot, o = t.mode, r = this.pivot.position, a = [], d = new S.Vector3();
    for (const [h, l] of e.nodes) {
      const c = this._graph.getNode(h);
      if (!c) continue;
      let u;
      o === "translate" ? u = [l[0] + r.x - i.x, l[1] + r.y - i.y, l[2] + r.z - i.z] : (d.set(l[0] - i.x, l[1] - i.y, l[2] - i.z), o === "rotate" ? d.applyQuaternion(this.pivot.quaternion) : d.multiply(this.pivot.scale), u = [i.x + d.x, i.y + d.y, i.z + d.z]), a.push([h, [u[0], u[1], s ? u[2] : c.z ?? 0]]);
    }
    this._graph.setPositions(a);
  }
  endGizmoDrag() {
    const e = this.dragIds;
    this.gizmoDragging = !1, this.gizmoStart = null, this.dragIds = [];
    for (const t of e) this.sim?.unpin(t, !!this._graph.getNode(t)?.pinned);
    this.syncGizmo(), this.events.emit("nodedragend", { ids: e }), this.requestRender();
  }
  // ------------------------------------------------------------------ picking
  ndc = new S.Vector2();
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
    for (const [h, l] of this.nodeInfo) {
      const c = l.body.pos;
      if (i.set(c[0], c[1], c[2]).project(this.camera), i.z < -1 || i.z > 1) continue;
      const u = (i.x * 0.5 + 0.5) * this.width, f = (-i.y * 0.5 + 0.5) * this.height, p = this.pxPerUnitAt(c[0], c[1], c[2]), b = (e - u) / Math.max(l.body.hw * p, 4), w = (t - f) / Math.max(l.body.hh * p, 4);
      (l.body.ellipse || s ? b * b + w * w <= 1 : Math.abs(b) <= 1 && Math.abs(w) <= 1) && i.z <= r && (o = h, r = i.z);
    }
    if (o) return { kind: "node", id: o };
    if (this.edgeInfo.size > this.config.interaction.pickLimit) return { kind: null, id: null };
    let a = null, d = 6;
    for (const [h, l] of this.edgeInfo) {
      const c = l.path;
      if (c.length < 2) continue;
      let u = 0, f = 0;
      for (let p = 0; p < c.length; p++) {
        i.set(c[p][0], c[p][1], c[p][2]).project(this.camera);
        const b = (i.x * 0.5 + 0.5) * this.width, w = (-i.y * 0.5 + 0.5) * this.height;
        if (p > 0) {
          const k = Qe(e, t, u, f, b, w);
          k < d && (d = k, a = h);
        }
        u = b, f = w;
      }
    }
    return a ? { kind: "edge", id: a } : { kind: null, id: null };
  }
  // ------------------------------------------------------------------ pointer interaction
  onWheel = () => {
    this.activeUntil = performance.now() + 700, this.requestRender();
  };
  onPointerDown = (e) => {
    if (e.target.closest?.(".gs-ui") || (this.pointerIsDown = !0, this.requestRender(), this.gizmoHovered(e)) || e.button !== 0) return;
    const t = this.eventPoint(e);
    this.lastPointer = t;
    const s = this.pick(t.x, t.y), i = e.shiftKey, o = this.config.interaction, r = s.kind === "node" && this.selNodes.has(s.id);
    if (this.down = { x: t.x, y: t.y, hit: s, additive: i, wasSelected: r, moved: !1, button: e.button }, this.hideTooltip(), s.kind === "node") {
      if (this.tool === "connect")
        this.drag = { type: "connect", from: s.id };
      else if (o.select && !r && (i && o.multiSelect ? this.selNodes.add(s.id) : (this.selNodes = /* @__PURE__ */ new Set([s.id]), this.selEdges.clear()), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), o.dragNodes) {
        const a = this.selNodes.has(s.id) ? [...this.selNodes] : [s.id], d = this.nodeInfo.get(s.id).body.pos, h = this.worldAt(t.x, t.y, d);
        if (h) {
          const l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
          for (const u of a) {
            const f = this.nodeInfo.get(u)?.body.pos;
            f && (l.set(u, [f[0] - h[0], f[1] - h[1], f[2] - h[2]]), c.set(u, [f[0], f[1], f[2]]));
          }
          this.drag = { type: "nodes", ids: a, primary: s.id, offsets: l, starts: c, anchor: [d[0], d[1], d[2]], px: t.x, py: t.y, moved: !1 };
        }
      }
    } else e.shiftKey && o.select && o.multiSelect && (this.drag = { type: "box", x0: t.x, y0: t.y });
    this.drag && (this.controls.enabled = !1, this.canvas.setPointerCapture(e.pointerId));
  };
  onPointerMove = (e) => {
    const t = this.eventPoint(e);
    this.lastPointer = t;
    const s = this.down;
    s && !s.moved && Math.hypot(t.x - s.x, t.y - s.y) > hs && (s.moved = !0);
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
    const o = this.config.interaction, r = (d) => o.openLinks === "click" || o.openLinks === "ctrl-click" && d, a = i.ctrlKey || i.metaKey;
    if (e.kind === "node") {
      const d = this._graph.getNode(e.id);
      if (!d) return;
      o.select && s && (t ? this.selNodes.delete(e.id) : this.selNodes.size > 1 && (this.selNodes = /* @__PURE__ */ new Set([e.id])), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), this.events.emit("nodeclick", { id: e.id, node: d, originalEvent: i }), r(a) && this.openLink("node", e.id);
    } else if (e.kind === "edge") {
      const d = this._graph.getEdge(e.id);
      if (!d) return;
      o.select && (t && o.multiSelect ? this.selEdges.delete(e.id) || this.selEdges.add(e.id) : (this.selNodes.clear(), this.selEdges = /* @__PURE__ */ new Set([e.id])), this.dirtyNodes = this.dirtyEdges = !0, this.events.emit("selection", this.getSelection()), this.requestRender()), this.events.emit("edgeclick", { id: e.id, edge: d, originalEvent: i }), r(a) && this.openLink("edge", e.id);
    } else {
      t || this.clearSelection();
      const d = this.eventPoint(i), h = this.worldAt(d.x, d.y, this.config.dimension === "3d" ? this.controls.target.toArray() : [0, 0, 0]) ?? [0, 0, 0];
      this.events.emit("backgroundclick", { position: h, originalEvent: i });
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
    const s = this.config.dimension === "3d", i = this.activeAxes(), o = [];
    let r = null;
    if (i.length === 1) {
      const a = i[0], d = e.starts.get(e.primary);
      if (!d) return;
      const h = [0, 0, 0];
      h[Te[a]] = 1;
      const l = 10, c = this.toScreen(d), u = this.toScreen([d[0] + h[0] * l, d[1] + h[1] * l, d[2] + h[2] * l]), f = u.x - c.x, p = u.y - c.y, b = f * f + p * p, w = b > 1e-6 ? ((t.x - e.px) * f + (t.y - e.py) * p) / b * l : 0;
      for (const k of e.ids) {
        const g = e.starts.get(k), m = this._graph.getNode(k);
        !g || !m || o.push([k, [g[0] + h[0] * w, g[1] + h[1] * w, s ? g[2] + h[2] * w : m.z ?? 0]]);
      }
      r = { origin: d, axis: a };
    } else {
      const a = this.worldAt(t.x, t.y, e.anchor);
      if (!a) return;
      const d = i.length === 0;
      for (const h of e.ids) {
        const l = e.offsets.get(h), c = e.starts.get(h), u = this._graph.getNode(h);
        if (!l || !c || !u) continue;
        const f = (p, b) => d || i.includes(b) ? a[p] + l[p] : c[p];
        o.push([h, [f(0, "x"), f(1, "y"), s ? f(2, "z") : u.z ?? 0]]);
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
      const r = new S.BufferGeometry();
      r.setAttribute("position", new S.BufferAttribute(new Float32Array(6), 3)), this.guide = new S.Line(r, new S.LineBasicMaterial({ color: this.color(Pe[e.axis]), depthTest: !1, transparent: !0, opacity: 0.8 })), this.guide.renderOrder = 19, this.guide.frustumCulled = !1, this.scene.add(this.guide);
    }
    this.guide.material.color.copy(this.color(Pe[e.axis]));
    const t = this.guide.geometry.getAttribute("position"), s = Te[e.axis], i = [e.origin[0], e.origin[1], e.origin[2]], o = [e.origin[0], e.origin[1], e.origin[2]];
    i[s] -= 5e4, o[s] += 5e4, t.setXYZ(0, i[0], i[1], i[2]), t.setXYZ(1, o[0], o[1], o[2]), t.needsUpdate = !0, this.requestRender();
  }
  onKeyDown = (e) => {
    if (this.setSnap(e.ctrlKey || e.metaKey), e.key === "Escape" && this.container.classList.contains("gs-pseudo-fullscreen") && this.toggleFullscreen(!1), e.ctrlKey || e.metaKey || e.altKey || e.target?.matches?.("input, textarea, select")) return;
    const s = e.key.toLowerCase();
    (s === "x" || s === "y" || s === "z") && !this.axisKeys.has(s) && (this.axisKeys.add(s), this.refreshAxisDrag());
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
    const r = Math.min(e, s), a = Math.max(e, s), d = Math.min(t, i), h = Math.max(t, i), l = o ? new Set(this.selNodes) : /* @__PURE__ */ new Set();
    for (const [c, u] of this.nodeInfo) {
      const f = u.body.pos;
      this.tmpV.set(f[0], f[1], f[2]).project(this.camera);
      const p = (this.tmpV.x * 0.5 + 0.5) * this.width, b = (-this.tmpV.y * 0.5 + 0.5) * this.height;
      this.tmpV.z >= -1 && this.tmpV.z <= 1 && p >= r && p <= a && b >= d && b <= h && l.add(c);
    }
    this.setSelection({ nodes: [...l] });
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
      for (const [a, d] of Object.entries(o.props ?? {})) s(`${a}: ${d}`, "gs-tt-muted");
    } else {
      const o = i.getEdge(e.id);
      if (!o) return;
      const r = (d) => i.getNode(d)?.label ?? d;
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
      const r = new S.BufferGeometry();
      r.setAttribute("position", new S.BufferAttribute(new Float32Array(6), 3));
      const a = new S.LineBasicMaterial({ color: this.color(this.config.selection.color), depthTest: !1, transparent: !0 });
      this.rubber = new S.Line(r, a), this.rubber.renderOrder = 20, this.rubber.frustumCulled = !1, this.scene.add(this.rubber);
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
const Ns = "0.1.0";
export {
  ye as CONFIG_DOCS,
  oe as DEFAULT_CONFIG,
  tt as DEFAULT_LAYOUT_OPTIONS,
  at as DEFAULT_WEIGHT,
  Fe as Emitter,
  Vt as FORMATS,
  et as ForceSimulation,
  fe as Graph,
  $s as GraphView,
  Ls as LAYOUT_NAMES,
  xe as NODE_SHAPES,
  qe as buildGroupIndex,
  es as circleLayout,
  ns as computeLayout,
  Ms as configToJsonc,
  pe as createConfig,
  ls as defaultCss,
  vs as defineConfig,
  dt as describeLinkGesture,
  Kt as detectFormat,
  ft as diffConfig,
  ce as estimateTextBox,
  pt as findUnknownKeys,
  ys as generateClustered,
  ws as generateMixedNetwork,
  Cs as geometry,
  ts as gridLayout,
  ds as injectStyles,
  Qt as layeredLayout,
  ne as mergeConfig,
  Zt as nodeBoxes,
  yt as parseCsv,
  kt as parseDot,
  $t as parseGml,
  Es as parseGraph,
  Rt as parseGraphML,
  _t as parseJson,
  ks as parseJsonc,
  De as placeNewNodes,
  is as randomLayout,
  xs as registerTheme,
  gt as resolveEdgeStyle,
  Be as resolveNodeStyle,
  Z as resolveUrl,
  wt as serializeCsv,
  Et as serializeDot,
  Nt as serializeGml,
  zs as serializeGraph,
  Gt as serializeGraphML,
  Wt as serializeJson,
  ss as sphereLayout,
  ut as stripJsonComments,
  Ge as themes,
  os as treeLayout,
  Ss as undocumentedConfigPaths,
  Ns as version
};
//# sourceMappingURL=graphscape.js.map
