/* editor.js – undoable edits. Every change the editor makes is a command object with do(graph) / undo(graph).
   To add an editor feature: write a command class here, call history.exec(new MyCommand(...)) from ui.js. */

export class History {
  constructor(graph) { this.g = graph; this.undoS = []; this.redoS = []; this.version = 0; this.savedVersion = 0; this._l = []; }
  on(fn) { this._l.push(fn); }
  _emit() { for (const f of this._l) f(this); }
  exec(cmd) { cmd.do(this.g); this.push(cmd); }
  /** Register a command whose effect has already been applied (e.g. a finished drag). */
  push(cmd) { this.undoS.push(cmd); this.redoS.length = 0; this.version++; this._emit(); }
  undo() { const c = this.undoS.pop(); if (!c) return; c.undo(this.g); this.redoS.push(c); this.version++; this._emit(); }
  redo() { const c = this.redoS.pop(); if (!c) return; c.do(this.g); this.undoS.push(c); this.version++; this._emit(); }
  get canUndo() { return this.undoS.length > 0; }
  get canRedo() { return this.redoS.length > 0; }
  get undoLabel() { return this.undoS.at(-1)?.label; }
  get redoLabel() { return this.redoS.at(-1)?.label; }
  /** "Dirty" = something changed since the last export. */
  get dirty() { return this.version !== this.savedVersion; }
  markSaved() { this.savedVersion = this.version; this._emit(); }
  markDirty() { this.version++; this._emit(); }
}

export class MoveNodes {
  /** moves: [{ id, from:[x,y,z], to:[x,y,z] }] */
  constructor(moves) { this.moves = moves; this.label = `Move ${moves.length} node${moves.length === 1 ? '' : 's'}`; }
  do(g) { g.setPositions(this.moves.map((m) => [m.id, m.to])); }
  undo(g) { g.setPositions(this.moves.map((m) => [m.id, m.from])); }
}
export class AddNode {
  constructor(node) { this.node = node; this.label = `Add ${node.label}`; }
  do(g) { g.addNode({ ...this.node }); }
  undo(g) { g.removeNode(this.node.id); }
}
export class DeleteNodes {
  constructor(ids) { this.ids = ids; this.label = `Delete ${ids.length} node${ids.length === 1 ? '' : 's'}`; }
  do(g) { this.removed = this.ids.map((id) => g.removeNode(id)).filter(Boolean); }
  undo(g) { for (const r of [...this.removed].reverse()) g.restoreNode(r); }
}
export class UpdateNode {
  constructor(g, id, patch) { this.id = id; this.patch = patch; this.prev = Object.fromEntries(Object.keys(patch).map((k) => [k, g.nodes.get(id)[k]])); this.label = 'Edit node'; }
  do(g) { g.updateNode(this.id, this.patch); }
  undo(g) { g.updateNode(this.id, this.prev); }
}
export class SetGroup {
  constructor(g, ids, group) { this.ids = ids; this.group = group; this.prev = ids.map((id) => g.nodes.get(id).group); this.label = `Set group of ${ids.length}`; }
  do(g) { for (const id of this.ids) g.updateNode(id, { group: this.group }); }
  undo(g) { this.ids.forEach((id, i) => g.updateNode(id, { group: this.prev[i] })); }
}
export class AddEdge {
  constructor(edge) { this.edge = edge; this.label = 'Connect'; }
  do(g) { g.addEdge(this.edge); }
  undo(g) { g.removeEdge(this.edge); }
}
export class DeleteEdge {
  constructor(edge) { this.edge = edge; this.label = 'Remove connection'; }
  do(g) { this.index = g.removeEdge(this.edge); }
  undo(g) { g.insertEdge(this.edge, this.index); }
}
export class UpdateEdge {
  constructor(edge, patch) { this.edge = edge; this.patch = patch; this.prev = Object.fromEntries(Object.keys(patch).map((k) => [k, edge[k]])); this.label = 'Edit connection'; }
  do(g) { g.updateEdge(this.edge, this.patch); }
  undo(g) { g.updateEdge(this.edge, this.prev); }
}
export class SetGroupDef {
  constructor(g, id, def) { this.id = id; this.def = def; this.prev = g.groups[id] ? { ...g.groups[id] } : undefined; this.label = 'Edit group'; }
  do(g) { g.setGroupDef(this.id, this.def && { ...this.def }); }
  undo(g) { g.setGroupDef(this.id, this.prev && { ...this.prev }); }
}
