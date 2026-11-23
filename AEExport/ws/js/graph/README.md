# Connections graph

An interactive 3D network (three.js) for the Aetherial Expanse site, with an in-browser editor whose export goes back into the repository.

```
 Foundry export ──┐
 tmp/party-live.json
                  ├─▶ npm run graph ─▶ data/graphs/crew-and-npcs.json ─▶ page (view / ?edit=1)
 hand-written    ─┤    (build-graph.mjs)        (built, committed)              │
 _src/data/npcs.json                                                          │ Export JSON
                  │                                                           ▼
 overlay ─────────┘◀──────────────────────────────────────────── _src/data/graph.json
 _src/data/graph.json  (groups, edges, positions, stubs, exclusions)
```

**Rule of thumb:** each fact has one owner. Names, sublines and page links belong to the *sources* (Foundry or `npcs.json`).
Groups, edges, positions and group colours belong to the *overlay*, which is what the editor exports.

## Everyday workflow

1. Add or change people in `_src/data/npcs.json` (or export from Foundry).
2. `npm run graph` – merges, validates (dangling edges, unknown groups, missing pages …), lays out new nodes, writes the built file.
3. Open `connections/crew-and-npcs.html?edit=1`, arrange nodes, assign groups, draw connections.
4. **Export JSON** → save as `_src/data/graph.json` (Chrome/Edge can “Save in place…”).
5. `npm run graph` again, `npm run search`, commit, push.

Unsaved editor work is kept as a draft in the browser and offered again after a reload.

## Data files

### `_src/data/npcs.json` (hand-written)
```json
[
  { "name": "Isolde Varrow", "sub": "Harbour Master", "href": "contacts/c_00001.html" },
  { "name": "Black Tom", "sub": "Fence" },
  { "name": "Mère Odile", "id": "odile", "was": ["old-odile"] }
]
```
- `id` is optional and defaults to the slug of the name (`black-tom`, `mere-odile`). Pin it with `id` if the name may change.
- `was` lists former ids; the build rewrites edges that still use them.
- `href` is relative to the site root; without it the node is shown muted and is not clickable.
- Any extra field (e.g. `"demo": true`) passes through to the built file.
- Same id in Foundry **and** here = one node; the entry here overrides fields (handy to add a `sub` to a PC). Same id twice in one file = error.

### `_src/data/foundry-map.json`
Fixes for Foundry actors, keyed by actor name or `_id`: `{ "Amber": { "id": "amber", "label": "Mirielle" } }`. Fields: `id`, `label`, `sub`, `type` (`pc`/`npc`), `href`, `skip`.
The only code that knows the Foundry export's shape is `readFoundry()` in `_src/node/build-graph.mjs`.
PCs get `href = characters/<id>.html` unless the map says otherwise.

### `_src/data/graph.json` (overlay – written by the editor)
```json
{
  "version": 1,
  "groups": { "navy": { "label": "Crown Navy", "color": "#c0462f" } },
  "nodes": [ { "id": "black-tom", "group": "smugglers", "pos": [12.5, -3, 40] } ],
  "edges": [ { "source": "kelly", "target": "black-tom", "kind": "rival", "label": "old grudge" } ],
  "exclude": ["pell-the-ropemaker"]
}
```
- `nodes`: group + position for source nodes. A node *created in the editor* is a **stub** and also carries `label`, `type`, `href`; the build tells you to move it to `npcs.json`.
- `exclude`: source nodes you deleted in the editor (they stay in `npcs.json`, just not in this graph).
- Edges are undirected; `kind` is optional (see `config.js`).
- The file is written one node/edge per line with sorted ids and rounded positions, so diffs stay readable.

Schemas for editor autocompletion: `schema/overlay.schema.json`, `schema/built.schema.json`.

## Page markup
```html
<div class="graph" data-src="../data/graphs/crew-and-npcs.json" data-editable data-export="graph.json"></div>
```
| attribute | meaning |
|---|---|
| `data-src` | built graph JSON, relative to the page (required) |
| `data-editable` | allow editing when the URL has `?edit=1` |
| `data-focus="kelly,enona"` `data-depth="2"` | read-only part of the graph: these nodes plus N hops (default 1) |
| `data-groups="navy,smugglers"` | read-only: all members of these groups (union with `data-focus`) |
| `data-export` | file name offered by the export button |

Filtered views are always read-only, so an export can never drop the rest of the graph.

## Controls
| | view mode | edit mode (`?edit=1`) |
|---|---|---|
| click node | open its page (Ctrl/⌘: new tab) | select (Shift: add/remove; Alt: open page) |
| drag node | – | move; moves every selected node together |
| drag empty space | orbit | orbit; **Shift+drag** = box select (“Select mode” button on touch screens) |
| double-click node | fly to it | fly to it |
| right-drag / wheel | pan / zoom | pan / zoom |
| keys | | `Del` delete · `C` connect two selected · `F` fly to selection · `Ctrl+Z` / `Ctrl+Shift+Z` undo/redo · `Ctrl+A` all · `Esc` clear |

Legend: click a group to select all its members (Shift adds). “Flat 2D” ignores depth (stored z is untouched). “Relayout” re-runs the force layout – only on the selected nodes if there is a selection.

## Code map (`js/graph/`)
| file | job | knows about |
|---|---|---|
| `config.js` | edge kinds, node types, defaults | – |
| `model.js` | `Graph`: nodes/edges/groups, events, `toBuilt`, `toOverlay`, `applyOverlay`, `validate`, `subgraph`, JSON formatting | config |
| `layout.js` | seeding + force layout (grid-accelerated, group-aware, deterministic) | model |
| `selection.js` | selected ids | – |
| `view.js` | **the only three.js code**: instanced nodes, line segments, labels, picking, camera | model, config |
| `interaction.js` | pointer state machine (click / drag / box / orbit) | view API, editor |
| `editor.js` | `History` + undoable command classes | model |
| `ui.js` | toolbar, legend, inspector, node list, shortcuts, export, drafts | everything but three |
| `io.js` | fetch, download, save in place, drafts | – |
| `main.js` | finds `.graph` elements and wires the above | all |

`model.js`, `layout.js`, `config.js` and `editor.js` are plain JS and run in Node as well; `_src/node/build-graph.mjs` and `test-graph.mjs` use them.

## Extending
- **New connection type** – add a line to `EDGE_KINDS` in `config.js`. It appears in the editor dropdown and the legend automatically.
- **New node type** – add it to `NODE_TYPES` (label, size).
- **New editor action** – write a command class in `editor.js` (`do(graph)`, `undo(graph)`), call `history.exec(new MyCommand(...))` from a button or key in `ui.js`. Undo, redo and the “unsaved” marker come for free.
- **New node field** (e.g. `faction rank`) – add it to the source file (it passes through to the built file), show it in `ui.js` `renderInspector()` and, if you want it on the map, in `view.js` `updateLabels()`.
- **New graph / subgraph page** – copy `connections/crew-and-npcs.html`, change `data-src` and the filters; for a second dataset add an entry to `GRAPHS` in `build-graph.mjs`, a menu entry in `site.js`.
- **Layout tuning** – `runLayout()` options in `layout.js` (`linkDistance`, `groupPull`, `groupSpread`, `gravity`, `iterations`).
- **Look** – colours come from `aetherial.css` variables; the graph-specific rules are in `css/graph.css`.
- **Different renderer** – only `view.js` imports three.js. Keep its public methods (`pick`, `inBox`, `pointOnPlane`, `nodeDisplayPos`, `flyTo`, `fit`, `setFlat`, `setHover`, `setLabelMode`, `targetPoint`, `canvas`, `container`, `controls.enabled`) and the rest keeps working.

## three.js
Vendored, because the site is static. Once: `npm i -D three && npm run vendor`, then commit `js/graph/vendor/`. Repeat after updating three.
The page loads it through the import map in the HTML (`three` → `vendor/three.module.min.js`, `three/addons/` → `vendor/addons/`).
ES modules do not load from `file://`; use `npm run preview` (it already serves the site).

## Performance notes
Nodes are one instanced mesh and all edges one line mesh, so thousands of nodes/edges are a handful of draw calls. Picking and box selection project every node to the screen once per camera change (no raycasting). Labels are DOM elements, capped (45 “nearby”, 400 “all”). The force layout is O(n·k) through a spatial grid; 10 000 nodes with 30 000 edges take roughly 20 seconds for 300 iterations and run in small slices, so the page stays responsive.
