# Installing the Connections graph

Copy the folders of this archive into the repository root (`itteerde.github.io/`); they merge with the existing ones.
Nothing existing is overwritten – three small edits are manual:

## 1. `package.json` – scripts and three.js
```json
"scripts": {
  "search": "pagefind --site AEExport/ws",
  "preview": "npm run graph && npm run search && npx --yes serve AEExport/ws",
  "graph": "node _src/node/build-graph.mjs",
  "graph:test": "node _src/node/test-graph.mjs",
  "vendor": "node _src/node/vendor-three.mjs"
}
```
Then once:
```
npm i -D three
npm run vendor        # copies three.js into AEExport/ws/js/graph/vendor/ – commit that folder
```

## 2. `AEExport/ws/js/site.js` – menu entry
Add this line to `NAV` (e.g. before `Essays`):
```js
['Connections', 'connections/index.html', [['Crew & Contacts', 'connections/crew-and-npcs.html']]],
```

## 3. Try it
```
npm run graph:test    # self-test of the data layer
npm run graph         # builds data/graphs/crew-and-npcs.json
npm run preview
```
Open `/connections/crew-and-npcs.html` (view) and `…?edit=1` (editor).

## Demo data
`_src/data/npcs.json` contains your seven PCs, Isolde Varrow, and invented NPCs marked `"demo": true`; `_src/data/graph.json` has demo groups and connections.
Delete the `demo` entries (and their edges) when you start with real data. Once `tmp/party-live.json` is read correctly you can remove the PC entries from `npcs.json`;
if the build says “no actors recognised”, adjust `readFoundry()` in `_src/node/build-graph.mjs` to the real shape of your export.
