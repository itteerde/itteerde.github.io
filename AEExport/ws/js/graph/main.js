/* main.js – entry point. Finds every <div class="graph" data-src="…"> and boots a graph there.
   Attributes on the div:
     data-src       URL of the built graph JSON (relative to the page)                         [required]
     data-editable  allow the editor when the page is opened with ?edit=1
     data-focus     comma separated node ids  ┐  show only a part of the graph (read-only):
     data-depth     hops around the focus ids │  the neighbourhood of data-focus (default 1 hop)
     data-groups    comma separated group ids ┘  plus all members of these groups (union)
   Everything else is in the other modules; see README.md. */
import { Graph } from './model.js';
import { seedMissing } from './layout.js';
import { Selection } from './selection.js';
import { History } from './editor.js';
import { Interaction } from './interaction.js';
import { loadJson } from './io.js';
import { buildShell, attachUI } from './ui.js';

const list = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean);

async function boot(el) {
  try {
    const srcUrl = new URL(el.dataset.src, document.baseURI).href;
    let graph = Graph.fromBuilt(await loadJson(srcUrl));
    const focus = list(el.dataset.focus), groups = list(el.dataset.groups);
    const filtered = focus.length || groups.length;
    if (filtered) graph = graph.subgraph({ focus, depth: +el.dataset.depth || 1, groups });
    const editMode = !filtered && el.hasAttribute('data-editable') && new URLSearchParams(location.search).has('edit');
    seedMissing(graph);

    const shell = buildShell(el, { editMode });
    let GraphView;
    try { ({ GraphView } = await import('./view.js')); }
    catch (err) {
      console.error(err);
      throw new Error('three.js could not be loaded. Run “npm i -D three && npm run vendor” once (see js/graph/README.md).');
    }
    const selection = new Selection();
    const view = new GraphView(shell.stage, graph, selection);
    const history = editMode ? new History(graph) : null;
    const interaction = new Interaction({ view, graph, selection, history });
    attachUI(shell, { graph, view, selection, history, interaction, srcUrl, exportName: el.dataset.export || 'graph.json' });
    el.graph = { graph, view, selection, history, interaction };      // handy in the browser console
  } catch (err) {
    el.classList.add('graph-error');
    el.replaceChildren(Object.assign(document.createElement('p'), { textContent: err.message }));
  }
}
document.querySelectorAll('.graph[data-src]').forEach(boot);
