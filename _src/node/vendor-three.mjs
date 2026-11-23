#!/usr/bin/env node
/* vendor-three.mjs – copies the three.js files the graph needs from node_modules into js/graph/vendor/.
   Run after `npm i -D three` (and again whenever you update three). Commit the vendor folder: GitHub Pages serves it.
   Uses the unminified build (build/three.module.js) and follows its relative imports (e.g. three.core.js),
   so it works whether or not a release ships *.min.js files. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const three = path.join(ROOT, 'node_modules/three');
const dest = path.join(ROOT, 'AEExport/ws/js/graph/vendor');
if (!fs.existsSync(three)) { console.error('three is not installed. Run: npm i -D three'); process.exit(1); }

const copy = (from, to) => {
  if (!fs.existsSync(from)) { console.error('missing ' + path.relative(three, from)); process.exit(1); }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log('copied', path.relative(dest, to));
};
const done = new Set();
const follow = (srcFile, dstFile) => {                       // copy a file and every relative module it imports
  if (done.has(srcFile)) return; done.add(srcFile);
  copy(srcFile, dstFile);
  const text = fs.readFileSync(srcFile, 'utf8');
  for (const m of text.matchAll(/(?:from|import)\s*['"](\.[^'"]+\.js)['"]/g))
    follow(path.resolve(path.dirname(srcFile), m[1]), path.resolve(path.dirname(dstFile), m[1]));
};
follow(path.join(three, 'build/three.module.js'), path.join(dest, 'three.module.js'));
copy(path.join(three, 'examples/jsm/controls/OrbitControls.js'), path.join(dest, 'addons/controls/OrbitControls.js'));

const v = JSON.parse(fs.readFileSync(path.join(three, 'package.json'), 'utf8')).version;
fs.writeFileSync(path.join(dest, 'VERSION.txt'), `three ${v} (MIT, https://threejs.org)\n`);
console.log('three', v);
