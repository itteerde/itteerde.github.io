/* ui.js – everything made of HTML: toolbar, legend, inspector, node list, shortcuts, export, drafts.
   Two steps: buildShell() creates the empty page structure (so the view has a stage to draw into),
   attachUI() fills it and wires it to graph / view / selection / history. */
import { SHAPES } from './config.js';
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
    /** Two nodes: connect them. More: connect every other selected node to the one selected LAST (the hub, e.g. an event). */
    connect() {
      const ids = sel();
      if (ids.length < 2) return say('Select two or more nodes to connect (with more than two, the last selected is the hub).');
      const hub = ids.at(-1), kind = kindPick.value === 'default' ? undefined : kindPick.value;
      const edges = ids.slice(0, -1).filter((id) => !graph.hasEdge(id, hub, kind)).map((id) => ({ source: id, target: hub, ...(kind ? { kind } : {}) }));
      if (!edges.length) return say('Already connected.');
      history.exec(new C.AddEdges(edges));
      say(`Connected ${edges.length} node${edges.length === 1 ? '' : 's'} to “${graph.nodes.get(hub).label}”.`);
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
  const hrefList = h('datalist', { id: 'graph-hrefs' });
  const kindPick = h('select', { class: 'graph-select', title: 'Kind of the connections that “Connect” creates', 'aria-label': 'Kind for new connections' });
  const refreshNames = () => {
    names.textContent = ''; for (const n of graph.nodes.values()) names.append(h('option', { value: n.label }));
    hrefList.textContent = ''; for (const href of new Set([...graph.nodes.values()].map((n) => n.href).filter(Boolean))) hrefList.append(h('option', { value: href }));
    const keep = kindPick.value || 'default';
    kindPick.textContent = ''; for (const [k, d] of graph.allKinds()) kindPick.append(h('option', { value: k, selected: k === keep }, d.label));
  };
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
    conB = btn('Connect', A.connect, 'Connect the selected nodes (C): two nodes, or all to the last selected one. The kind is chosen in the list next to it');
    delB = btn('Delete', A.remove, 'Delete selected nodes (Del)');
    expB = h('details', { class: 'graph-export' }, h('summary', { class: 'btn' }, 'Export JSON'),
      h('div', { class: 'graph-export-menu' },
        btn('Download', A.download, 'Download ' + exportName),
        btn('Copy', A.copy, 'Copy to clipboard'),
        canSaveInPlace ? btn('Save in place…', A.save, 'Overwrite _src/data/graph.json directly (Chrome / Edge)') : null));
    toolbar.append(undoB, redoB, selB, conB, kindPick, hrefList, h('button', { type: 'button', class: 'btn ghost', onclick: A.relayout, title: 'Re-run the force layout (only the selected nodes, if any)' }, 'Relayout'), delB, expB);
  }
  /* --------------------------------------------------------- full window
     "is-max" turns the whole .graph-app (toolbar, stage, side panel) into a fixed full-window layer and, where the browser
     allows it, also asks for real full screen. Without Fullscreen API support (iPhone Safari) the CSS layer alone is used. */
  const root = shell.root;
  const maxB = h('button', { type: 'button', class: 'btn ghost graph-maxbtn', onclick: () => toggleMax() });
  const corner = h('button', { type: 'button', class: 'graph-maxcorner', onclick: () => toggleMax() });
  root.prepend(h('div', { class: 'graph-maxtitle' }, h('strong', {}, document.querySelector('h1')?.textContent || 'Graph'), h('span', {}, ' · press Esc or use the button to return to the page')));
  shell.stage.append(corner);
  const paintMax = () => {
    const on = root.classList.contains('is-max');
    maxB.textContent = on ? '⤡ Exit full window' : '⤢ Full window';
    corner.textContent = on ? '⤡ Exit' : '⤢ Full window';
    maxB.title = corner.title = on ? 'Back to the page (Esc or M)' : 'Use the whole window (M)';
    maxB.setAttribute('aria-pressed', on);
  };
  const applyMax = (on) => { root.classList.toggle('is-max', on); document.documentElement.classList.toggle('graph-max-lock', on); paintMax(); };
  const toggleMax = async () => {
    if (!root.classList.contains('is-max')) { applyMax(true); try { await root.requestFullscreen?.(); } catch { } return; }
    if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch { } }
    applyMax(false);
  };
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) applyMax(false); });
  addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
    if (e.key === 'Escape' && root.classList.contains('is-max')) { e.stopImmediatePropagation(); toggleMax(); }
    else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'm') toggleMax();
  });
  paintMax();
  toolbar.append(status, maxB);

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
    const used = {}; for (const n of graph.nodes.values()) used[n.type || 'npc'] = (used[n.type || 'npc'] || 0) + 1;
    if (Object.keys(used).length > 1) {
      legend.append(h('h3', {}, 'Types'));
      for (const [id, count] of Object.entries(used)) {
        const t = graph.typeDef(id);
        legend.append(h('button', { type: 'button', class: 'graph-chip', title: 'Select all of this type (Shift: add)',
          onclick: (e) => { const ids = [...graph.nodes.values()].filter((n) => (n.type || 'npc') === id).map((n) => n.id); e.shiftKey ? selection.add(ids) : selection.set(ids); } },
          h('span', { class: 'glyph' }, SHAPES[t.shape]?.glyph || '●'), t.label, h('small', {}, String(count))));
      }
    }
    const kinds = [...new Set(graph.edges.map((e) => e.kind || 'default'))];
    if (kinds.length) legend.append(h('h3', {}, 'Connections'), h('ul', { class: 'graph-kinds' }, ...kinds.map((k) => h('li', {}, h('i', { class: 'line', style: `background:${graph.kindDef(k).color}` }), graph.kindDef(k).label))));
  };

  /* ----------------------------------------------------------- inspector */
  const insp = h('div', { class: 'graph-inspector' });
  const field = (label, input) => h('label', { class: 'graph-field' }, h('span', {}, label), input);
  const groupSelect = (value, onchange, multi = false) => h('select', { onchange: (e) => onchange(e.target.value) },
    ...(multi ? [h('option', { value: '\0', selected: true }, '— choose —')] : []),
    h('option', { value: '', selected: !multi && !value }, '(none)'),
    ...Object.entries(graph.groups).map(([id, g]) => h('option', { value: id, selected: !multi && id === value }, g.label || id)));
  const kindSelect = (value, onchange) => h('select', { onchange: (e) => onchange(e.target.value) },
    ...graph.allKinds().map(([k, d]) => h('option', { value: k, selected: (value || 'default') === k }, d.label)));

  const renderInspector = () => {
    insp.textContent = '';
    const ids = sel();
    if (ids.length === 1) {
      const n = graph.nodes.get(ids[0]); if (!n) return;
      const own = n.src === 'overlay';
      insp.append(h('h3', {}, n.label), n.sub ? h('p', { class: 'muted' }, n.sub) : null);
      if (!edit) {
        insp.append(h('p', {}, (graph.groups[n.group]?.label || ''), n.type ? ` · ${graph.typeDef(n.type).label}` : ''));
        insp.append(n.href ? h('a', { class: 'btn', href: (document.body.dataset.root || '') + n.href }, 'Open page') : h('p', { class: 'muted' }, 'No page for this one (yet).'));
        const nb = graph.edgesOf(n.id);
        if (nb.length) insp.append(h('h3', {}, 'Connected to'), h('ul', { class: 'graph-links' }, ...nb.map((e) => { const o = graph.nodes.get(e.source === n.id ? e.target : e.source); return h('li', {}, h('a', { href: '#', onclick: (ev) => { ev.preventDefault(); selection.set([o.id]); view.flyTo([o.id]); } }, o.label), e.label ? ` – ${e.label}` : ''); })));
        return;
      }
      const upd = (k) => (e) => history.exec(new C.UpdateNode(graph, n.id, { [k]: e.target.value.trim() }));
      insp.append(
        field('Name', h('input', { value: n.label, disabled: !own, onchange: upd('label') })),
        field('Subline', h('input', { value: n.sub || '', disabled: !own, onchange: upd('sub') })),
        field('Type', h('select', { disabled: !own, onchange: upd('type') }, ...graph.allTypes().map(([k, t]) => h('option', { value: k, selected: n.type === k }, t.label)))),
        field('Page', h('input', { value: n.href || '', disabled: !own, placeholder: 'journals/session-01.html', list: 'graph-hrefs', onchange: upd('href') })),
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
        btn(ids.length === 2 ? 'Connect the two' : 'Connect all to the last selected', A.connect), btn('Delete selected', A.remove));
      else insp.append(h('ul', { class: 'graph-links' }, ...ids.slice(0, 30).map((id) => h('li', {}, graph.nodes.get(id).label))));
    } else {
      insp.append(h('p', { class: 'muted' }, edit
        ? 'Click a node to select it, Shift+click to add, Shift+drag on empty space for a box. Drag moves all selected nodes. Alt+click opens the node’s page; double-click flies to it.'
        : 'Drag to turn, scroll to zoom, right-drag to pan. Click a node to open its page; double-click flies to it. Pick a group below to light it up.'));
    }
    if (edit) insp.append(addForms());
  };

  const addForms = () => {
    const name = h('input', { placeholder: 'Name of the new node' }), type = h('select', {}, ...graph.allTypes().map(([k, t]) => h('option', { value: k, selected: k === 'npc' }, t.label)));
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
  /* --------------------------------------- node types & connection kinds (editor) */
  const defs = h('details', { class: 'graph-defs' }, h('summary', {}, 'Node types & connection kinds'));
  const shapeSelect = (value, onchange) => h('select', { 'aria-label': 'Shape', onchange: (e) => onchange(e.target.value) },
    ...Object.entries(SHAPES).map(([k, d]) => h('option', { value: k, selected: k === value }, `${d.glyph} ${d.label}`)));
  const clean = (o) => { for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k]; return o; };
  const renderDefs = () => {
    const head = defs.firstChild; defs.textContent = ''; defs.append(head);
    // --- types
    defs.append(h('h3', {}, 'Node types'), h('p', { class: 'muted' }, 'Shape and size; the colour box sets a colour for nodes that have no group.'));
    defs.append(h('ul', { class: 'graph-defs-list' }, ...graph.allTypes().map(([id, t]) => {
      const set = (patch) => history.exec(new C.SetTypeDef(graph, id, clean({ label: t.label, shape: t.shape, size: t.size, color: t.color, ...patch })));
      const col = h('input', { type: 'color', value: t.color || '#c9a24b', disabled: !t.color, 'aria-label': 'Colour', onchange: (e) => set({ color: e.target.value }) });
      return h('li', { class: 'graph-defrow' },
        h('span', { class: 'glyph', title: id }, SHAPES[t.shape]?.glyph || '●'),
        h('input', { value: t.label, 'aria-label': 'Name', onchange: (e) => set({ label: e.target.value.trim() || t.label }) }),
        shapeSelect(t.shape, (v) => set({ shape: v })),
        h('input', { type: 'number', min: '0.3', max: '4', step: '0.1', value: String(t.size), 'aria-label': 'Size', title: 'Size', onchange: (e) => set({ size: Math.min(4, Math.max(0.3, +e.target.value || 1)) }) }),
        h('input', { type: 'checkbox', checked: !!t.color, title: 'Use a colour for nodes without a group', onchange: (e) => set({ color: e.target.checked ? col.value : undefined }) }), col);
    })));
    const tn = h('input', { placeholder: 'New type, e.g. Event' }), ts = shapeSelect('cube', () => { });
    defs.append(h('div', { class: 'graph-row' }, tn, ts, btn('Add type', () => {
      const id = slugify(tn.value); if (!id) return say('Give the type a name.');
      if (graph.allTypes().some(([k]) => k === id)) return say(`Type “${id}” exists.`);
      history.exec(new C.SetTypeDef(graph, id, { label: tn.value.trim(), shape: ts.value, size: 1.2 })); tn.value = '';
    })));
    // --- kinds
    defs.append(h('h3', {}, 'Connection kinds'));
    defs.append(h('ul', { class: 'graph-defs-list' }, ...graph.allKinds().map(([id, d]) => {
      const set = (patch) => history.exec(new C.SetKindDef(graph, id, { label: d.label, color: d.color, ...patch }));
      return h('li', { class: 'graph-defrow kind' },
        h('i', { class: 'line', style: `background:${d.color}` }),
        h('input', { value: d.label, 'aria-label': 'Name', onchange: (e) => set({ label: e.target.value.trim() || d.label }) }),
        h('input', { type: 'color', value: d.color, 'aria-label': 'Colour', onchange: (e) => set({ color: e.target.value }) }));
    })));
    const kn = h('input', { placeholder: 'New kind, e.g. Witnessed' }), kc = h('input', { type: 'color', value: '#d98f4a', 'aria-label': 'Colour' });
    defs.append(h('div', { class: 'graph-row' }, kn, kc, btn('Add kind', () => {
      const id = slugify(kn.value); if (!id) return say('Give the kind a name.');
      if (graph.allKinds().some(([k]) => k === id)) return say(`Kind “${id}” exists.`);
      history.exec(new C.SetKindDef(graph, id, { label: kn.value.trim(), color: kc.value })); kn.value = '';
    })));
    defs.append(h('small', { class: 'muted' }, 'Types and kinds you add can be renamed and recoloured here; removing them means deleting their line in graph.json.'));
  };
  side.append(insp, legend);
  if (edit) side.append(defs);

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
  const refreshAll = () => { renderLegend(); renderInspector(); renderList(); refreshNames(); if (edit) renderDefs(); };
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
    const syncSel = () => { delB.disabled = !selection.size; conB.disabled = selection.size < 2; };
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
