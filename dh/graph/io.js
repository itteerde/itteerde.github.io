/* io.js – loading, exporting, drafts. Browser only. */
export async function loadJson(url) {
  const r = await fetch(url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.json();
}
export function download(text, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = filename;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
}
export const canSaveInPlace = typeof window !== 'undefined' && 'showSaveFilePicker' in window;
let handle = null;
/** Chromium only: overwrite a file on disk (pick _src/data/graph.json once, later saves reuse the handle). */
export async function saveInPlace(text, name) {
  handle ||= await window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }] });
  const w = await handle.createWritable(); await w.write(text); await w.close();
  return handle.name;
}
/* drafts survive an accidental reload */
const dk = (src) => 'ae-graph-draft:' + src;
export const readDraft = (src) => { try { return localStorage.getItem(dk(src)); } catch { return null; } };
export const writeDraft = (src, text) => { try { localStorage.setItem(dk(src), text); } catch { } };
export const clearDraft = (src) => { try { localStorage.removeItem(dk(src)); } catch { } };
