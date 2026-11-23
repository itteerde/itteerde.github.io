/* view.js – the only module that talks to three.js.
   Renders a Graph: one InstancedMesh for all nodes, one LineSegments for all edges, HTML labels on top.
   Picking and box-select are done in screen space (project every node once per camera change), so they stay
   cheap for thousands of nodes and need no raycasting.
   Public surface used by the other modules: see the "API" comment blocks. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DEFAULTS, NODE_TYPES, EDGE_KINDS } from './config.js';

const WHITE = new THREE.Color('#ffffff');
const _m = new THREE.Matrix4(), _c = new THREE.Color(), _e = new THREE.Color(), _v = new THREE.Vector3(), _n = new THREE.Vector3(), _ndc = new THREE.Vector2();

export class GraphView {
  constructor(container, graph, selection, opts = {}) {
    this.container = container; this.graph = graph; this.selection = selection;
    this.o = { ...DEFAULTS, ...opts };
    const css = getComputedStyle(document.documentElement);
    this.bg = new THREE.Color(css.getPropertyValue('--sea-0').trim() || '#07151c');
    this.labelMode = 'near'; this.flat = false; this.hover = null; this.tween = null;
    this.dirty = true; this.projDirty = true; this.w = 1; this.h = 1;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(this.bg);
    this.canvas = this.renderer.domElement;
    container.append(this.canvas);
    this.labelLayer = Object.assign(document.createElement('div'), { className: 'graph-labels' });
    container.append(this.labelLayer);
    this.labelPool = [];

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(this.bg, 1, 1000);
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 5000);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.12; this.controls.screenSpacePanning = true;
    this.controls.addEventListener('change', () => this.markDirty());
    this.ray = new THREE.Raycaster(); this.plane = new THREE.Plane(); this._pm = new THREE.Matrix4();

    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(container);
    selection.on(() => this.updateStyle());
    graph.on((e) => this.onGraph(e));
    this.rebuild(); this.resize(); this.fit();
    const frame = () => {
      requestAnimationFrame(frame);
      if (this.tween) this.stepTween();
      const moved = this.controls.update();
      if (moved || this.dirty) { this.renderFrame(); this.dirty = false; }
    };
    frame();
  }

  markDirty() { this.dirty = true; this.projDirty = true; }

  /* ------------------------------------------------------------------ build */
  onGraph(e) {
    if (e.kind === 'move') this.updateMatrices();
    else if (e.kind === 'structure') { this.rebuild(); }
    else this.updateStyle();            // 'groups' | 'node'
  }

  rebuild() {
    if (this.mesh) { this.scene.remove(this.mesh, this.lines); this.mesh.geometry.dispose(); this.mesh.material.dispose(); this.mesh.dispose(); this.lines.geometry.dispose(); this.lines.material.dispose(); }
    this.list = [...this.graph.nodes.values()];
    this.ids = this.list.map((n) => n.id);
    this.index = new Map(this.ids.map((id, i) => [id, i]));
    const n = this.list.length;
    const seg = n > 3000 ? [6, 4] : n > 800 ? [10, 7] : [16, 12];
    this.mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, seg[0], seg[1]), new THREE.MeshBasicMaterial(), Math.max(n, 1));
    this.mesh.count = n; this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.edgeList = this.graph.edges.filter((e) => this.index.has(e.source) && this.index.has(e.target));
    const E = this.edgeList.length;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(E * 6), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(E * 6), 3));
    this.lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true }));
    this.lines.frustumCulled = false;
    this.scene.add(this.mesh, this.lines);
    this.disp = new Float32Array(n * 3); this.screen = new Float32Array(n * 3);
    this.updateMatrices(); this.updateStyle();
  }

  nodeScale(i) {
    const n = this.list[i];
    let s = this.o.nodeRadius * (NODE_TYPES[n.type]?.size || 1) * (n.href ? 1 : 0.8);
    if (this.selection.has(n.id)) s *= 1.6;
    if (this.hover === n.id) s *= 1.3;
    return s;
  }
  /** Positions changed (drag, layout, undo): matrices + edge endpoints. */
  updateMatrices() {
    const f = this.flat ? 0 : 1, d = this.disp;
    this.list.forEach((n, i) => {
      const p = n.pos || [0, 0, 0];
      d[i * 3] = p[0]; d[i * 3 + 1] = p[1]; d[i * 3 + 2] = p[2] * f;
      const s = this.nodeScale(i);
      _m.makeScale(s, s, s).setPosition(d[i * 3], d[i * 3 + 1], d[i * 3 + 2]);
      this.mesh.setMatrixAt(i, _m);
    });
    this.mesh.instanceMatrix.needsUpdate = true;
    const pa = this.lines.geometry.attributes.position.array;
    this.edgeList.forEach((e, k) => {
      const a = this.index.get(e.source) * 3, b = this.index.get(e.target) * 3;
      pa.set([d[a], d[a + 1], d[a + 2], d[b], d[b + 1], d[b + 2]], k * 6);
    });
    this.lines.geometry.attributes.position.needsUpdate = true;
    this.markDirty();
  }
  /** Selection / groups / labels changed: colours and scales (cheap, no geometry rebuild). */
  updateStyle() {
    if (!this.list) return;
    const sel = this.selection.ids, hasSel = sel.size > 0, near = new Set();
    if (hasSel) for (const e of this.edgeList) { if (sel.has(e.source)) near.add(e.target); if (sel.has(e.target)) near.add(e.source); }
    this.list.forEach((n, i) => {
      const g = this.graph.groups[n.group];
      _c.set(g?.color || this.o.ungroupedColor);
      if (!n.href) _c.lerp(this.bg, this.o.mutedMix);
      if (sel.has(n.id)) _c.lerp(WHITE, 0.4); else if (hasSel && !near.has(n.id)) _c.lerp(this.bg, 0.55);
      this.mesh.setColorAt(i, _c);
    });
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    const ca = this.lines.geometry.attributes.color.array;
    this.edgeList.forEach((e, k) => {
      _e.set((EDGE_KINDS[e.kind] || EDGE_KINDS.default).color);
      _e.lerp(this.bg, hasSel ? (sel.has(e.source) || sel.has(e.target) ? 0 : 0.88) : 0.4);
      _e.toArray(ca, k * 6); _e.toArray(ca, k * 6 + 3);
    });
    this.lines.geometry.attributes.color.needsUpdate = true;
    this.updateMatrices();   // scales depend on selection
  }
  setHover(id) {
    if (id === this.hover) return;
    const prev = this.hover; this.hover = id;
    for (const x of [prev, id]) {
      const i = this.index.get(x); if (i === undefined) continue;
      const s = this.nodeScale(i);
      _m.makeScale(s, s, s).setPosition(this.disp[i * 3], this.disp[i * 3 + 1], this.disp[i * 3 + 2]);
      this.mesh.setMatrixAt(i, _m);
    }
    this.mesh.instanceMatrix.needsUpdate = true; this.dirty = true;
  }

  /* ----------------------------------------------------------------- camera */
  resize() {
    this.w = Math.max(this.container.clientWidth, 1); this.h = Math.max(this.container.clientHeight, 1);
    this.renderer.setSize(this.w, this.h);
    this.camera.aspect = this.w / this.h; this.camera.updateProjectionMatrix();
    this.markDirty();
  }
  bounds(ids) {
    const sel = ids ? ids.map((id) => this.index.get(id)).filter((i) => i !== undefined) : this.list.map((_, i) => i);
    const c = new THREE.Vector3();
    if (!sel.length) return { center: c, radius: 10 };
    for (const i of sel) c.add(_v.set(this.disp[i * 3], this.disp[i * 3 + 1], this.disp[i * 3 + 2]));
    c.divideScalar(sel.length);
    let r = 0;
    for (const i of sel) r = Math.max(r, _v.set(this.disp[i * 3], this.disp[i * 3 + 1], this.disp[i * 3 + 2]).distanceTo(c));
    return { center: c, radius: Math.max(r, 10) };
  }
  fit() {
    const { center, radius } = this.bounds();
    const dist = radius / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2)) * 1.05;
    const dir = this.flat ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0.35, 0.28, 1).normalize();
    this.camera.position.copy(center).addScaledVector(dir, dist);
    this.controls.target.copy(center);
    this.radius = radius;
    this.camera.far = dist + radius * 12; this.camera.updateProjectionMatrix();
    this.controls.update(); this.markDirty();
  }
  flyTo(ids) {
    const { center, radius } = this.bounds(ids);
    const d = Math.max(radius * 3.2, 32);
    const dir = this.flat ? _n.set(0, 0, 1) : _n.copy(this.camera.position).sub(this.controls.target).normalize();
    this.tween = { t0: performance.now(), dur: 550, fp: this.camera.position.clone(), ft: this.controls.target.clone(), tp: center.clone().addScaledVector(dir, d), tt: center.clone() };
  }
  stepTween() {
    const t = this.tween, k0 = Math.min((performance.now() - t.t0) / t.dur, 1), k = k0 * k0 * (3 - 2 * k0);
    this.camera.position.lerpVectors(t.fp, t.tp, k); this.controls.target.lerpVectors(t.ft, t.tt, k);
    if (k0 >= 1) this.tween = null;
    this.controls.update(); this.markDirty();
  }
  /** Flat 2D: z is ignored for display and the camera looks straight down; stored positions keep their z. */
  setFlat(on) {
    if (on === this.flat) return;
    this.flat = on;
    if (on) this._saved = { p: this.camera.position.clone(), t: this.controls.target.clone() };
    this.controls.enableRotate = !on;
    this.updateMatrices();
    if (on) {
      const { center } = this.bounds(), d = this.camera.position.distanceTo(this.controls.target);
      this.controls.target.set(center.x, center.y, 0);
      this.camera.position.set(center.x, center.y, d);
      this.camera.up.set(0, 1, 0);
    } else if (this._saved) { this.camera.position.copy(this._saved.p); this.controls.target.copy(this._saved.t); }
    this.controls.update(); this.markDirty();
  }
  setLabelMode(m) { this.labelMode = m; this.markDirty(); }
  /** Where new nodes should appear: the point the camera is looking at. */
  targetPoint() { const t = this.controls.target; return [t.x, t.y, this.flat ? 0 : t.z]; }

  /* ---------------------------------------------------------------- picking */
  ensureProjected() {
    if (!this.projDirty) return;
    this.camera.updateMatrixWorld();
    const M = _pm(this).multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse).elements;
    const d = this.disp, s = this.screen, W = this.w, H = this.h;
    for (let i = 0; i < this.list.length; i++) {
      const x = d[i * 3], y = d[i * 3 + 1], z = d[i * 3 + 2];
      const cw = M[3] * x + M[7] * y + M[11] * z + M[15];
      if (cw <= 1e-4) { s[i * 3 + 2] = -1; continue; }
      s[i * 3] = ((M[0] * x + M[4] * y + M[8] * z + M[12]) / cw * 0.5 + 0.5) * W;
      s[i * 3 + 1] = (1 - ((M[1] * x + M[5] * y + M[9] * z + M[13]) / cw * 0.5 + 0.5)) * H;
      s[i * 3 + 2] = cw;
    }
    this.projDirty = false;
  }
  radiusPx(i) { return this.nodeScale(i) * (this.h / 2) / (Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.screen[i * 3 + 2]); }
  /** API: node id under canvas pixel (x, y), nearest to the camera wins; null if none. */
  pick(x, y) {
    this.ensureProjected();
    let best = -1, bd = Infinity;
    for (let i = 0; i < this.list.length; i++) {
      const dep = this.screen[i * 3 + 2]; if (dep <= 0 || dep >= bd) continue;
      const dx = this.screen[i * 3] - x, dy = this.screen[i * 3 + 1] - y, r = Math.max(7, this.radiusPx(i) + 3);
      if (dx * dx + dy * dy <= r * r) { best = i; bd = dep; }
    }
    return best < 0 ? null : this.ids[best];
  }
  /** API: ids of all nodes whose centre lies inside the rectangle (canvas pixels). */
  inBox(x0, y0, x1, y1) {
    this.ensureProjected();
    const [a, b] = [Math.min(x0, x1), Math.max(x0, x1)], [c, d] = [Math.min(y0, y1), Math.max(y0, y1)], out = [];
    for (let i = 0; i < this.list.length; i++) {
      if (this.screen[i * 3 + 2] <= 0) continue;
      const x = this.screen[i * 3], y = this.screen[i * 3 + 1];
      if (x >= a && x <= b && y >= c && y <= d) out.push(this.ids[i]);
    }
    return out;
  }
  /** API: world position of a node as shown (z is 0 in flat mode). */
  nodeDisplayPos(id) { const i = this.index.get(id); return new THREE.Vector3(this.disp[i * 3], this.disp[i * 3 + 1], this.disp[i * 3 + 2]); }
  /** API: the point where the pointer ray meets the camera-facing plane through `anchor`. */
  pointOnPlane(clientX, clientY, anchor) {
    const r = this.canvas.getBoundingClientRect();
    _ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(_ndc, this.camera);
    this.camera.getWorldDirection(_n);
    this.plane.setFromNormalAndCoplanarPoint(_n, anchor);
    return this.ray.ray.intersectPlane(this.plane, new THREE.Vector3());
  }

  /* ----------------------------------------------------------------- render */
  renderFrame() {
    const d = this.camera.position.distanceTo(this.controls.target), R = this.radius || 100;
    this.scene.fog.near = Math.max(d - R * 0.5, 0.1); this.scene.fog.far = d + R * 2.5;
    this.renderer.render(this.scene, this.camera);
    this.updateLabels();
  }
  updateLabels() {
    this.ensureProjected();
    const want = new Map();                       // idx -> flags
    const on = (i) => { const s = this.screen; return s[i * 3 + 2] > 0 && s[i * 3] >= 0 && s[i * 3] <= this.w && s[i * 3 + 1] >= 0 && s[i * 3 + 1] <= this.h; };
    for (const id of this.selection.ids) { const i = this.index.get(id); if (i !== undefined && on(i)) want.set(i, 'sel'); }
    const hi = this.index.get(this.hover); if (hi !== undefined && on(hi)) want.set(hi, 'hover');
    if (this.labelMode !== 'none') {
      const cap = this.labelMode === 'all' ? 400 : this.o.maxLabels;
      const cand = [];
      for (let i = 0; i < this.list.length; i++) if (on(i)) cand.push(i);
      cand.sort((a, b) => this.screen[a * 3 + 2] - this.screen[b * 3 + 2]);
      for (const i of cand.slice(0, cap)) if (!want.has(i)) want.set(i, '');
    }
    let k = 0;
    for (const [i, flag] of want) {
      let el = this.labelPool[k];
      if (!el) { el = document.createElement('div'); el.className = 'graph-label'; el.innerHTML = '<b></b><small></small>'; this.labelLayer.append(el); this.labelPool[k] = el; }
      const n = this.list[i];
      if (el._id !== n.id || el._sub !== n.sub) { el.firstChild.textContent = n.label; el.lastChild.textContent = n.sub || ''; el._id = n.id; el._sub = n.sub; }
      el.style.display = ''; el.className = 'graph-label' + (flag ? ' is-' + flag : '');
      el.style.transform = `translate(${this.screen[i * 3].toFixed(1)}px, ${(this.screen[i * 3 + 1] + this.radiusPx(i) + 4).toFixed(1)}px) translateX(-50%)`;
      k++;
    }
    for (; k < this.labelPool.length; k++) this.labelPool[k].style.display = 'none';
  }
}
const _pm = (v) => v._pm;
