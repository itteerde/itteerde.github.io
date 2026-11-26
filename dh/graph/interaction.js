/* interaction.js – pointer handling on top of GraphView. No three.js import: it only uses the view's API
   (pick, inBox, pointOnPlane, nodeDisplayPos, setHover, flyTo, controls, canvas, container).

   One press goes through a small state machine:
     press on node  ─ view mode ─▶ orbit as usual; if the pointer barely moved, it was a CLICK → open the page
                    ─ edit mode ─▶ (select it) ─ moved > threshold ─▶ DRAG all selected nodes in the camera plane
                                              └ not moved ─▶ click: select / Shift+click toggle / Alt+click open page
     press on empty ─ Shift (or "select mode") in edit mode ─▶ BOX select
                    ─ otherwise ─▶ orbit; a click without movement clears the selection
   Keyboard shortcuts live in ui.js. */
import { MoveNodes } from './editor.js';

export class Interaction {
  /** @param {{view, graph, selection, history?:History, threshold?:number}} o   history present = edit mode */
  constructor({ view, graph, selection, history = null, threshold = 4 }) {
    Object.assign(this, { view, graph, selection, history, threshold });
    this.edit = !!history; this.selectMode = false; this.press = null;
    const c = view.canvas;
    view.container.addEventListener('pointerdown', (e) => this.down(e), { capture: true });   // capture: runs before OrbitControls
    c.addEventListener('pointermove', (e) => this.move(e));
    c.addEventListener('pointerup', (e) => this.up(e));
    c.addEventListener('pointercancel', () => this.cancel());
    c.addEventListener('pointerleave', () => { if (!this.press) view.setHover(null); });
    c.addEventListener('dblclick', (e) => { const id = view.pick(...this.local(e)); if (id) view.flyTo([id]); });
  }
  local(e) { const r = this.view.canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }

  down(e) {
    if (e.target !== this.view.canvas) return;
    if (!e.isPrimary) { this.cancel(); return; }                  // second finger = pinch zoom, leave it to OrbitControls
    if (e.button !== 0) return;
    const [x, y] = this.local(e), hit = this.view.pick(x, y);
    const p = this.press = { id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: x, ly: y, hit, moved: false, mode: 'orbit', shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
    if (this.edit && hit) {
      p.mode = 'node';
      if (!this.selection.has(hit)) { e.shiftKey ? this.selection.add([hit]) : this.selection.set([hit]); } else if (e.shiftKey) p.toggle = true;
      this.view.controls.enabled = false; this.view.canvas.setPointerCapture(e.pointerId);
      p.anchor = this.view.nodeDisplayPos(hit);
      p.start = this.view.pointOnPlane(e.clientX, e.clientY, p.anchor);
      p.orig = new Map([...this.selection.ids].map((id) => [id, [...this.graph.nodes.get(id).pos]]));
    } else if (this.edit && !hit && (e.shiftKey || this.selectMode)) {
      p.mode = 'box';
      this.view.controls.enabled = false; this.view.canvas.setPointerCapture(e.pointerId);
      this.band = this.band || Object.assign(document.createElement('div'), { className: 'graph-band' });
      this.view.container.append(this.band);
    } else if (hit) p.mode = 'maybeClick';
  }

  move(e) {
    const p = this.press, v = this.view;
    if (!p) {
      if (e.buttons) return;
      const id = v.pick(...this.local(e));
      v.setHover(id);
      v.canvas.style.cursor = id ? (this.edit ? 'grab' : this.graph.nodes.get(id).href ? 'pointer' : 'default') : '';
      return;
    }
    if (e.pointerId !== p.id) return;
    if (!p.moved && Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > this.threshold) p.moved = true;
    if (!p.moved) return;
    if (p.mode === 'node' && p.start) {
      const pt = v.pointOnPlane(e.clientX, e.clientY, p.anchor); if (!pt) return;
      const d = pt.sub(p.start); if (v.flat) d.z = 0;
      this.graph.setPositions([...p.orig].map(([id, o]) => [id, [o[0] + d.x, o[1] + d.y, o[2] + d.z]]));
      v.canvas.style.cursor = 'grabbing';
    } else if (p.mode === 'box') {
      const [x, y] = this.local(e), s = this.band.style;
      s.left = Math.min(x, p.lx) + 'px'; s.top = Math.min(y, p.ly) + 'px'; s.width = Math.abs(x - p.lx) + 'px'; s.height = Math.abs(y - p.ly) + 'px';
    }
  }

  up(e) {
    const p = this.press; if (!p || e.pointerId !== p.id) return;
    this.press = null;
    const v = this.view;
    v.controls.enabled = true;
    try { v.canvas.releasePointerCapture(e.pointerId); } catch { }
    this.band?.remove();
    v.canvas.style.cursor = '';
    if (p.mode === 'box') {
      if (p.moved) { const [x, y] = this.local(e), ids = v.inBox(p.lx, p.ly, x, y); p.shift ? this.selection.add(ids) : this.selection.set(ids); }
      else if (!p.shift) this.selection.clear();
      return;
    }
    if (p.mode === 'node' && p.moved) {                              // finish a drag → one undo step
      const moves = [...p.orig].map(([id, from]) => ({ id, from, to: [...this.graph.nodes.get(id).pos] }));
      this.history.push(new MoveNodes(moves));
      return;
    }
    if (p.moved) return;                                              // an orbit gesture, not a click
    // ---- a click ----
    if (!p.hit) { if (this.edit || this.selection.size) this.selection.clear(); return; }
    if (this.edit) {
      if (p.alt) this.open(p.hit, p.ctrl);
      else if (p.toggle) this.selection.toggle(p.hit);
      else if (!p.shift) this.selection.set([p.hit]);
    } else this.open(p.hit, p.ctrl);
  }

  cancel() {
    if (!this.press) return;
    this.press = null; this.view.controls.enabled = true; this.band?.remove();
  }

  /** Open a node's page. hrefs in the data are relative to the site root (<body data-root="../">). */
  open(id, newTab = false) {
    const href = this.graph.nodes.get(id)?.href;
    if (!href) return false;
    const url = new URL((document.body.dataset.root || '') + href, document.baseURI).href;
    newTab ? window.open(url, '_blank', 'noopener') : (location.href = url);
    return true;
  }
}
