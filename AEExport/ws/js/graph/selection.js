/* selection.js – the set of selected node ids. Views and panels subscribe to it. */
export class Selection {
  constructor() { this.ids = new Set(); this._l = []; }
  on(fn) { this._l.push(fn); }
  get size() { return this.ids.size; }
  has(id) { return this.ids.has(id); }
  _emit() { for (const f of this._l) f(this); }
  set(ids) { this.ids = new Set(ids); this._emit(); }
  add(ids) { for (const i of ids) this.ids.add(i); this._emit(); }
  toggle(id) { this.ids.has(id) ? this.ids.delete(id) : this.ids.add(id); this._emit(); }
  clear() { if (this.ids.size) { this.ids.clear(); this._emit(); } }
}
