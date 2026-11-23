/* ui.js – everything made of HTML: toolbar, legend, inspector, node list, shortcuts, export, drafts.
   Two steps: buildShell() creates the empty page structure (so the view has a stage to draw into),
   attachUI() fills it and wires it to graph / view / selection / history. */
import { EDGE_KINDS, NODE_TYPES } from './config.js';
import { slugify } from './model.js';
import * as C from './editor.js';
import { runLayout } from './layout.js';
import { download, copyText, canSaveInPlace, saveInPlace, readDraft, writeDraft, clearDraft } from './io.js';
import { formatJson } from './model.js';

const h = (tag, props = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'value' || k === 'checked' || k === 'disabled' || k === 'selected') el[k] = v;
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  }
  el.append(...kids.flat().filter((x) => x != null && x !== false));
  return el;
};

export function buildShell(root, { editMode }) {
  root.classList.add('graph-app'); root.textContent = '';
  const toolbar = h('div', { class: 'graph-toolbar', role: 'toolbar', 'aria-label': 'Graph tools' });
  const banner = h('div', { class: 'graph-banner', hidden: true });
  const stage = h('div', { class: 'graph-stage' });
  const side = h('aside', { class: 'graph-side', 'aria-label': 'Legend and details' });
  const list = h('details', { class: 'graph-list' });
  root.append(toolbar, banner, h('div', { class: 'graph-main' }, stage, side), list);
  if (editMode) root.classList.add('is-edit');
  return { root, toolbar, banner, stage, side, list };
}

export function attachUI(shell, { graph, view, selection, history, interaction, srcUrl, exportName = 'graph.json' }) {
  const edit = !!history;
  const { toolbar, banner, side, list } = shell;
  const status = h('span', { class: 'graph-status', role: 'status' });
  const say = (t) => { status.textContent = t; };

  /* ------------------------------------------------------------ actions */
  const sel = () => [...selection.ids];
  const A = {
    undo: () => history.undo(), redo: () => history.redo(),
    connect() {
      const [a, b] = sel();
      if (selection.size !== 2) return say('Select exactly two nodes to connect.');
      if (graph.hasEdge(a, b)) return say('These two are already connected.');
      history.exec(new C.AddEdge({ source: a, target: b }));
    },
    remove() {
      if (!selection.size) return;
      const ids = sel(); selection.clear(); history.exec(new C.DeleteNodes(ids));
    },
    async relayout() {
      const ids = sel(), before = new Map([...graph.nodes].map(([id, n]) => [id, [...n.pos]]));
      const pinned = ids.length ? new Set([...graph.nodes.keys()].filter((id) => !ids.includes(id))) : new Set();
      say('Laying out…');
      await runLayout(graph, { pinned, iterations: 250, onProgress: (f) => say(`Laying out… ${Math.round(f * 100)} %`) });
      const moves = [...graph.nodes].map(([id, n]) => ({ id, from: before.get(id), to: [...n.pos] })).filter((m) => m.from.some((v, i) => v !== m.to[i]));
      if (moves.length) history.push(new C.MoveNodes(moves));
      say(ids.length ? 'Selected nodes re-laid out around the rest.' : 'Layout done.'); view.fit();
    },
    exportText: () => formatJson(graph.toOverlay()),
    download() { download(A.exportText(), exportName); done('Downloaded ' + exportName); },
    async copy() { await copyText(A.exportText()); done('Copied to clipboard.'); },
    async save() { try { done('Saved to ' + await saveInPlace(A.exportText(), exportName)); } catch (e) { if (e.name !== 'AbortError') say('Save failed: ' + e.message); } }
  };
  const done = (msg) => { history.markSaved(); clearDraft(srcUrl); say(msg); };

  /* ------------------------------------------------------------ toolbar */
  const btn = (label, fn, title, extra = {}) => h('button', { type: 'button', class: 'btn ghost', title, onclick: fn, ...extra }, label);
  const search = h('input', { type: 'search', class: 'graph-search', placeholder: 'Find…', list: 'graph-names', 'aria-label': 'Find a node' });
  const names = h('datalist', { id: 'graph-names' });
  const refreshNames = () => { names.textContent = ''; for (const n of graph.nodes.values()) names.append(h('option', { value: n.label })); };
  const jump = () => {
    const q = search.value.trim().toLowerCase(); if (!q) return;
    const all = [...graph.nodes.values()];
    const n = all.find((x) => x.label.toLowerCase() === q) || all.find((x) => x.label.toLowerCase().startsWith(q)) || all.find((x) => x.label.toLowerCase().includes(q));
    if (n) { selection.set([n.id]); view.flyTo([n.id]); say(''); } else say('Nothing found.');
  };
  search.addEventListener('change', jump);
  const labels = h('select', { class: 'graph-select', 'aria-label': 'Labels', onchange: (e) => view.setLabelMode(e.target.value) },
    ...[['near', 'Labels: nearby'], ['all', 'Labels: all'], ['none', 'Labels: off']].map(([v, t]) => h('option', { value: v }, t)));
  const flat = h('button', { type: 'button', class: 'btn ghost', 'aria-pressed': 'false', title: 'Show the network flat (ignore depth)', onclick: () => { const on = !view.flat; view.setFlat(on); flat.setAttribute('aria-pressed', on); } }, 'Flat 2D');
  toolbar.append(search, names, labels, flat, btn('Fit', () => view.fit(), 'Show the whole network'));
  refreshNames();

  let undoB, redoB, selB, delB, conB, expB;
  if (edit) {
    undoB = btn('↶ Undo', A.undo, 'Ctrl+Z'); redoB = btn('↷ Redo', A.redo, 'Ctrl+Shift+Z');
    selB = h('button', { type: 'button', class: 'btn ghost', 'aria-pressed': 'false', title: 'Drag on empty space to box-select (touch screens; with a mouse: Shift+drag)', onclick: () => { interaction.selectMode = !interaction.selectMode; selB.setAttribute('aria-pressed', interaction.selectMode); } }, 'Select mode');
    conB = btn('Connect', A.connect, 'Connect the two selected nodes (C)');
    delB = btn('Delete', A.remove, 'Delete selected nodes (Del)');
    expB = h('details', { class: 'graph-export' }, h('summary', { class: 'btn' }, 'Export JSON'),
      h('div', { class: 'graph-export-menu' },
        btn('Download', A.download, 'Download ' + exportName),
        btn('Copy', A.copy, 'Copy to clipboard'),
        canSaveInPlace ? btn('Save in place…', A.save, 'Overwrite _src/data/graph.json directly (Chrome / Edge)') : null));
    toolbar.append(undoB, redoB, selB, conB, h('button', { type: 'button', class: 'btn ghost', onclick: A.relayout, title: 'Re-run the force layout (only the selected nodes, if any)' }, 'Relayout'), delB, expB);
  }
  toolbar.append(status);

  /* -------------------------------------------------------------- legend */
  const legend = h('div', { class: 'graph-legend' });
  const renderLegend = () => {
    legend.textContent = '';
    legend.append(h('h3', {}, 'Groups'));
    const counts = {}; for (const n of graph.nodes.values()) counts[n.group || ''] = (counts[n.group || ''] || 0) + 1;
    const chip = (id, label, color) => h('button', {
      type: 'button', class: 'graph-chip', title: 'Select all members (Shift: add)',
      onclick: (e) => { const ids = [...graph.nodes.values()].filter((n) => (n.group || '') === id).map((n) => n.id); e.shiftKey ? selection.add(ids) : selection.set(ids); }
    }, h('i', { style: `background:${color}` }), label, h('small', {}, String(counts[id] || 0)));
    for (const [id, g] of Object.entries(graph.groups)) legend.append(chip(id, g.label || id, g.color));
    if (counts['']) legend.append(chip('', 'Unassigned', view.o.ungroupedColor));
    const kinds = [...new Set(graph.edges.map((e) => e.kind || 'default'))];
    if (kinds.length) legend.append(h('h3', {}, 'Connections'), h('ul', { class: 'graph-kinds' }, ...kinds.map((k) => h('li', {}, h('i', { class: 'line', style: `background:${(EDGE_KINDS[k] || EDGE_KINDS.default).color}` }), (EDGE_KINDS[k] || { label: k }).label))));
  };

  /* ----------------------------------------------------------- inspector */
  const insp = h('div', { class: 'graph-inspector' });
  const field = (label, input) => h('label', { class: 'graph-field' }, h('span', {}, label), input);
  const groupSelect = (value, onchange, multi = false) => h('select', { onchange: (e) => onchange(e.target.value) },
    ...(multi ? [h('option', { value: '\0', selected: true }, '— choose —')] : []),
    h('option', { value: '', selected: !multi && !value }, '(none)'),
    ...Object.entries(graph.groups).map(([id, g]) => h('option', { value: id, selected: !multi && id === value }, g.label || id)));
  const kindSelect = (value, onchange) => h('select', { onchange: (e) => onchange(e.target.value) },
    ...Object.entries(EDGE_KINDS).map(([k, d]) => h('option', { value: k, selected: (value || 'default') === k }, d.label)));

  const renderInspector = () => {
    insp.textContent = '';
    const ids = sel();
    if (ids.length === 1) {
      const n = graph.nodes.get(ids[0]); if (!n) return;
      const own = n.src === 'overlay';
      insp.append(h('h3', {}, n.label), n.sub ? h('p', { class: 'muted' }, n.sub) : null);
      if (!edit) {
        insp.append(h('p', {}, (graph.groups[n.group]?.label || ''), n.type ? ` · ${NODE_TYPES[n.type]?.label || n.type}` : ''));
        insp.append(n.href ? h('a', { class: 'btn', href: (document.body.dataset.root || '') + n.href }, 'Open page') : h('p', { class: 'muted' }, 'No page for this one (yet).'));
        const nb = graph.edgesOf(n.id);
        if (nb.length) insp.append(h('h3', {}, 'Connected to'), h('ul', { class: 'graph-links' }, ...nb.map((e) => { const o = graph.nodes.get(e.source === n.id ? e.target : e.source); return h('li', {}, h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); selection.set([o.id]); view.flyTo([o.id]); } }, o.label), e.label ? ` – ${e.label}` : ''); })));
        return;
      }
      const upd = (k) => (e) => history.exec(new C.UpdateNode(graph, n.id, { [k]: e.target.value.trim() }));
      insp.append(
        field('Name', h('input', { value: n.label, disabled: !own, onchange: upd('label') })),
        field('Subline', h('input', { value: n.sub || '', disabled: !own, onchange: upd('sub') })),
        field('Type', h('select', { disabled: !own, onchange: upd('type') }, ...Object.entries(NODE_TYPES).map(([k, t]) => h('option', { value: k, selected: n.type === k }, t.label)))),
        field('Page', h('input', { value: n.href || '', disabled: !own, placeholder: 'contacts/c_00002.html', onchange: upd('href') })),
        field('Group', groupSelect(n.group, (v) => history.exec(new C.SetGroup(graph, [n.id], v)))),
        h('p', { class: 'muted' }, `id: ${n.id} · from ${own ? 'this editor (stub)' : n.src}` + (own ? '' : ' – name, subline and page are edited in the source file')));
      const g = graph.groups[n.group];
      if (g) insp.append(h('div', { class: 'graph-groupdef' },
        field('Group name', h('input', { value: g.label || '', onchange: (e) => history.exec(new C.SetGroupDef(graph, n.group, { ...g, label: e.target.value })) })),
        field('Group colour', h('input', { type: 'color', value: g.color || '#888888', onchange: (e) => history.exec(new C.SetGroupDef(graph, n.group, { ...g, color: e.target.value })) }))));
      const nb = graph.edgesOf(n.id);
      insp.append(h('h3', {}, `Connections (${nb.length})`), h('ul', { class: 'graph-edges' }, ...nb.map((e) => {
        const o = graph.nodes.get(e.source === n.id ? e.target : e.source);
        return h('li', {}, h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); selection.set([o.id]); } }, o.label),
          kindSelect(e.kind, (v) => history.exec(new C.UpdateEdge(e, { kind: v === 'default' ? undefined : v }))),
          h('input', { value: e.label || '', placeholder: 'note', 'aria-label': 'Note', onchange: (ev) => history.exec(new C.UpdateEdge(e, { label: ev.target.value.trim() })) }),
          h('button', { type: 'button', class: 'btn ghost', title: 'Remove connection', onclick: () => history.exec(new C.DeleteEdge(e)) }, '×'));
      })));
    } else if (ids.length > 1) {
      insp.append(h('h3', {}, `${ids.length} nodes selected`));
      if (edit) insp.append(field('Set group', groupSelect('', (v) => { if (v !== '\0') history.exec(new C.SetGroup(graph, ids, v)); }, true)),
        ids.length === 2 ? btn('Connect the two', A.connect) : null, btn('Delete selected', A.remove));
      else insp.append(h('ul', { class: 'graph-links' }, ...ids.slice(0, 30).map((id) => h('li', {}, graph.nodes.get(id).label))));
    } else {
      insp.append(h('p', { class: 'muted' }, edit
        ? 'Click a node to select it, Shift+click to add, Shift+drag on empty space for a box. Drag moves all selected nodes. Alt+click opens the node’s page; double-click flies to it.'
        : 'Drag to turn, scroll to zoom, right-drag to pan. Click a node to open its page; double-click flies to it. Pick a group below to light it up.'));
    }
    if (edit) insp.append(addForms());
  };

  const addForms = () => {
    const name = h('input', { placeholder: 'Name of the new node' }), type = h('select', {}, ...Object.entries(NODE_TYPES).map(([k, t]) => h('option', { value: k, selected: k === 'npc' }, t.label)));
    const preview = h('small', { class: 'muted' }, ' ');
    const idOf = () => slugify(name.value);
    name.addEventListener('input', () => { const id = idOf(); preview.textContent = id ? (graph.nodes.has(id) ? `id “${id}” is taken` : `id: ${id}`) : ' '; });
    const add = () => {
      const id = idOf(); if (!id || graph.nodes.has(id)) return say(id ? `id “${id}” is taken – rename it.` : 'Give the node a name.');
      const t = view.targetPoint(), j = () => (Math.random() - 0.5) * 12;
      const first = graph.nodes.get(sel()[0]);
      history.exec(new C.AddNode({ id, label: name.value.trim(), type: type.value, group: first?.group || undefined, pos: [t[0] + j(), t[1] + j(), view.flat ? 0 : t[2] + j()] }));
      selection.set([id]); name.value = ''; say(`Added “${id}” as a stub – move it to _src/data/npcs.json when you can.`);
    };
    const gl = h('input', { placeholder: 'Name of the new group' }), gc = h('input', { type: 'color', value: '#c9a24b' });
    const addGroup = () => {
      const id = slugify(gl.value); if (!id || graph.groups[id]) return say(id ? `group “${id}” exists.` : 'Give the group a name.');
      history.exec(new C.SetGroupDef(graph, id, { label: gl.value.trim(), color: gc.value }));
      if (selection.size) history.exec(new C.SetGroup(graph, sel(), id));
      gl.value = '';
    };
    return h('div', { class: 'graph-add' }, h('h3', {}, 'Add'),
      h('div', { class: 'graph-row' }, name, type, btn('Add node', add)), preview,
      h('div', { class: 'graph-row' }, gl, gc, btn('Add group', addGroup)),
      h('small', { class: 'muted' }, 'A new group is applied to the selected nodes.'));
  };
  side.append(insp, legend);

  /* ------------------------------------------------------------ node list */
  const renderList = () => {
    list.textContent = '';
    list.append(h('summary', {}, `All nodes (${graph.nodes.size}) – text list`));
    const by = {};
    for (const n of graph.nodes.values()) (by[n.group || ''] ||= []).push(n);
    for (const [gid, ns] of Object.entries(by)) list.append(h('h3', {}, graph.groups[gid]?.label || 'Unassigned'),
      h('ul', {}, ...ns.sort((a, b) => a.label.localeCompare(b.label)).map((n) => h('li', {}, n.href ? h('a', { href: (document.body.dataset.root || '') + n.href }, n.label) : n.label, n.sub ? ` – ${n.sub}` : ''))));
  };

  /* ------------------------------------------------------------- wiring */
  const refreshAll = () => { renderLegend(); renderInspector(); renderList(); refreshNames(); };
  graph.on((e) => {
    if (e.kind === 'move') return;
    if (e.kind === 'structure') selection.set(sel().filter((id) => graph.nodes.has(id)));
    refreshAll();
  });
  selection.on(renderInspector);
  refreshAll();

  if (edit) {
    const syncButtons = () => {
      undoB.disabled = !history.canUndo; redoB.disabled = !history.canRedo;
      undoB.title = 'Undo' + (history.undoLabel ? ': ' + history.undoLabel : '') + ' (Ctrl+Z)';
      expB.firstChild.textContent = history.dirty ? 'Export JSON •' : 'Export JSON';
    };
    const syncSel = () => { delB.disabled = !selection.size; conB.disabled = selection.size !== 2; };
    let t; history.on(() => { syncButtons(); clearTimeout(t); t = setTimeout(() => history.dirty ? writeDraft(srcUrl, A.exportText()) : clearDraft(srcUrl), 400); });
    selection.on(syncSel); syncButtons(); syncSel();
    addEventListener('beforeunload', (e) => { if (history.dirty) { e.preventDefault(); e.returnValue = ''; } });

    addEventListener('keydown', (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
      if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? A.redo() : A.undo(); }
      else if (mod && k === 'y') { e.preventDefault(); A.redo(); }
      else if (mod && k === 'a') { e.preventDefault(); selection.set([...graph.nodes.keys()]); }
      else if (!mod && (k === 'delete' || k === 'backspace')) { e.preventDefault(); A.remove(); }
      else if (!mod && k === 'c') A.connect();
      else if (!mod && k === 'f') view.flyTo(selection.size ? sel() : undefined);
      else if (k === 'escape') selection.clear();
    });

    const draft = readDraft(srcUrl);
    if (draft && draft !== A.exportText()) {
      banner.hidden = false;
      banner.append('An unsaved draft from an earlier session was found. ',
        btn('Restore', () => { graph.applyOverlay(JSON.parse(draft)); graph.emit('structure'); history.markDirty(); banner.hidden = true; }),
        btn('Discard', () => { clearDraft(srcUrl); banner.hidden = true; }));
    }
  }
  return A;
}
