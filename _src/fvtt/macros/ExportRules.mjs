// ===== Config =====
const folderName = "Aetherial Expanse Campaign Settings";
const embedImages = false;   // true = embed images as base64 (fully standalone, but a bigger file)
// ==================

const TE = foundry.applications.ux?.TextEditor?.implementation ?? TextEditor;
const root = game.folders.find(f => f.type === "JournalEntry" && f.name === folderName);
if (!root) return ui.notifications.error(`Folder "${folderName}" not found`);

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Fallback only: manual sort value, ties broken by name (natural order: "Chapter 2" < "Chapter 10")
const bySort = (a, b) =>
    (a.sort ?? 0) - (b.sort ?? 0) || String(a.name).localeCompare(String(b.name), undefined, { numeric: true });
const visible = d => d.testUserPermission(game.user, "OBSERVER");

// ---------- Pass 1: collect structure (needed to resolve internal links) ----------
const pageIndex = new Map();       // page uuid  -> page id
const entryFirstPage = new Map();  // entry uuid -> id of its first page

// The sidebar order is decided by Foundry (per-folder "sort alphabetically/manually", ties, ...).
// Ask Foundry's own directory tree instead of re-implementing it; fall back to sort values + name.
function findNode(node, id) {
    if (node?.folder?.id === id) return node;
    for (const c of node?.children ?? []) {
        const hit = findNode(c, id);
        if (hit) return hit;
    }
    return null;
}
let rootNode = null;
try { rootNode = findNode(game.journal.tree, root.id); } catch (err) { console.warn("Directory tree not available", err); }
console.log(`[ExportRules] ordering by ${rootNode ? "Foundry directory tree" : "fallback (sort value, then name)"}`);

function collect(folder, node) {
    const out = { type: "folder", name: folder.name, children: [] };
    // like Foundry's sidebar: subfolders first, then entries
    const subs = node?.children
        ? node.children.map(c => ({ folder: c.folder, node: c }))
        : game.folders.filter(f => f.folder?.id === folder.id).sort(bySort).map(f => ({ folder: f, node: null }));
    for (const s of subs) out.children.push(collect(s.folder, s.node));

    const docs = node?.entries
        ? node.entries.map(e => e.document ?? e)
        : folder.contents.slice().sort(bySort);
    for (const e of docs) {
        if (!visible(e)) continue;
        const pages = e.pages.contents.slice().sort(bySort).filter(visible);
        if (!pages.length) continue;
        entryFirstPage.set(e.uuid, pages[0].id);
        pages.forEach(p => pageIndex.set(p.uuid, p.id));
        out.children.push({ type: "entry", doc: e, pages });
    }
    return out;
}
const tree = collect(root, rootNode);

// ---------- Pass 2: render pages ----------
async function toDataUrl(src) {
    try {
        const blob = await (await fetch(src)).blob();
        return await new Promise(res => {
            const fr = new FileReader();
            fr.onload = () => res(fr.result);
            fr.readAsDataURL(blob);
        });
    } catch { return src; }
}

async function renderPage(p) {
    let html = "";
    if (p.type === "text") {
        html = await TE.enrichHTML(p.text.content ?? "", { secrets: false, relativeTo: p });
    } else if (p.type === "image") {
        html = `<figure><img src="${esc(p.src)}" alt="${esc(p.name)}">` +
            (p.image?.caption ? `<figcaption>${esc(p.image.caption)}</figcaption>` : "") + `</figure>`;
    } else if (p.type === "video") {
        html = `<video controls src="${esc(p.src)}" style="max-width:100%"></video>`;
    } else if (p.type === "pdf") {
        html = `<p><a href="${esc(p.src)}">${esc(p.name)} (PDF)</a></p>`;
    }

    const dom = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const box = dom.body.firstElementChild;

    // Foundry icons (Font Awesome) are not available outside the game
    box.querySelectorAll("i[class*='fa-']").forEach(i => i.remove());

    // Content links: internal ones become real links, everything else plain text
    for (const a of box.querySelectorAll("a.content-link, a.inline-roll")) {
        const target = a.dataset.uuid && (pageIndex.get(a.dataset.uuid) ?? entryFirstPage.get(a.dataset.uuid));
        if (target) {
            a.setAttribute("href", `#${target}`);
            a.className = "internal";
            for (const k of Object.keys(a.dataset)) delete a.dataset[k];
        } else {
            const span = dom.createElement("span");
            span.className = a.classList.contains("inline-roll") ? "roll" : "unresolved";
            span.textContent = a.textContent.trim();
            a.replaceWith(span);
        }
    }

    // Heading ids + outline
    const toc = [], used = new Set();
    for (const h of box.querySelectorAll("h1,h2,h3,h4")) {
        let slug = h.textContent.trim().toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section";
        while (used.has(slug)) slug += "-2";
        used.add(slug);
        h.id = `${p.id}~${slug}`;
        toc.push({ id: h.id, text: h.textContent.trim(), level: Number(h.tagName[1]) });
    }

    if (embedImages) {
        for (const img of box.querySelectorAll("img")) {
            const src = img.getAttribute("src");
            if (src && !src.startsWith("data:")) img.setAttribute("src", await toDataUrl(src));
        }
    }
    return { html: box.innerHTML, toc };
}

// ---------- Build navigation + articles ----------
const articles = [];

async function renderNode(node) {
    if (node.type === "entry") {
        let nav = `<details class="entry"><summary>${esc(node.doc.name)}</summary>`;
        for (const p of node.pages) {
            const { html, toc } = await renderPage(p);
            const lvl = Math.min(Math.max(p.title?.level ?? 1, 1), 4);
            nav += `<a class="page l${lvl}" href="#${p.id}" data-page="${p.id}">${esc(p.name)}</a>`;
            nav += `<ul class="toc">` + toc.map(t =>
                `<li class="t${t.level}"><a class="h" href="#${esc(t.id)}">${esc(t.text)}</a></li>`).join("") + `</ul>`;
            const title = p.title?.show === false ? "" : `<h1 class="page-title">${esc(p.name)}</h1>`;
            articles.push(`<article data-page="${p.id}" hidden>` +
                `<div class="crumb">${esc(node.doc.name)}</div>${title}${html}</article>`);
        }
        return nav + `</details>`;
    }
    let inner = "";
    for (const c of node.children) inner += await renderNode(c);
    return `<details class="folder" open><summary>${esc(node.name)}</summary>${inner}</details>`;
}

let navHtml = "";
for (const c of tree.children) navHtml += await renderNode(c);

if (!articles.length) return ui.notifications.warn("No visible pages found in this folder.");

// ---------- Runtime (runs inside the exported file) ----------
function runtime() {
    const links = [...document.querySelectorAll("nav a.page")];
    const arts = new Map([...document.querySelectorAll("article")].map(a => [a.dataset.page, a]));
    const ids = links.map(l => l.dataset.page);

    // previous / next
    ids.forEach((id, i) => {
        const pager = document.createElement("div");
        pager.className = "pager";
        const mk = (j, dir) => {
            const a = document.createElement("a");
            if (j >= 0 && j < ids.length) {
                a.href = "#" + ids[j];
                a.textContent = (dir < 0 ? "← " : "") + links[j].textContent + (dir > 0 ? " →" : "");
            }
            return a;
        };
        pager.append(mk(i - 1, -1), mk(i + 1, 1));
        arts.get(id).append(pager);
    });

    const main = document.querySelector("main");
    function show() {
        const hash = decodeURIComponent(location.hash.slice(1));
        const pageId = hash.split("~")[0];
        const art = arts.get(pageId) ?? arts.get(ids[0]);
        arts.forEach(a => (a.hidden = a !== art));
        links.forEach(l => l.classList.toggle("active", l.dataset.page === art.dataset.page));
        document.querySelectorAll("nav a.h").forEach(a =>
            a.classList.toggle("active", decodeURIComponent(a.getAttribute("href").slice(1)) === hash));
        const active = document.querySelector("nav a.page.active");
        for (let d = active?.parentElement; d; d = d.parentElement) if (d.tagName === "DETAILS") d.open = true;
        const target = hash.includes("~") ? document.getElementById(hash) : null;
        if (target) target.scrollIntoView(); else main.scrollTo(0, 0);
        document.body.classList.remove("nav-open");
    }
    addEventListener("hashchange", show);
    show();

    // search (page names + full text)
    const texts = new Map(ids.map(id => [id, arts.get(id).textContent.toLowerCase()]));
    document.getElementById("q").addEventListener("input", e => {
        const s = e.target.value.trim().toLowerCase();
        links.forEach(l => {
            l.hidden = !!s && !(l.textContent.toLowerCase().includes(s) || texts.get(l.dataset.page).includes(s));
        });
        document.querySelectorAll("nav details").forEach(d => {
            d.hidden = !!s && !d.querySelector("a.page:not([hidden])");
            if (s) d.open = true;
        });
    });
    document.getElementById("toggle").addEventListener("click", () => document.body.classList.toggle("nav-open"));
}

// ---------- Assemble file ----------
const css = `
:root{--bg:#eee8dc;--card:#fffdf8;--fg:#25211d;--accent:#8a3b12;--side:#2a2522;--side-fg:#d9cfc1;--side-dim:#8f8579}
@media (prefers-color-scheme:dark){:root{--bg:#171513;--card:#211e1c;--fg:#ddd5c8;--accent:#e0a060}}
*{box-sizing:border-box}[hidden]{display:none!important}
html,body{height:100%;margin:0}
body{display:grid;grid-template-columns:20rem 1fr;font-family:Georgia,serif;background:var(--bg);color:var(--fg)}
nav{background:var(--side);color:var(--side-fg);overflow:auto;padding:1rem;font:14px/1.4 system-ui,sans-serif}
nav h2{margin:.2rem 0 .8rem;font-size:1.1rem;color:#fff}
nav input{width:100%;padding:.4rem .6rem;margin-bottom:.8rem;border-radius:4px;border:1px solid #555;background:#1b1816;color:inherit}
nav summary{cursor:pointer;padding:.25rem 0;font-weight:600}
nav details details{margin-left:.8rem}
nav details.entry>summary{font-weight:500;color:#fff}
nav a{color:inherit;text-decoration:none}
nav a.page{display:block;padding:.2rem .5rem;margin-left:.8rem;border-radius:3px}
nav a.page.l2{margin-left:1.4rem}nav a.page.l3{margin-left:2rem}nav a.page.l4{margin-left:2.6rem}
nav a.page:hover,nav a.h:hover{background:#3b342f}
nav a.page.active{background:var(--accent);color:#fff}
nav ul.toc{display:none;list-style:none;margin:.1rem 0 .3rem 1.6rem;padding:0;font-size:13px;color:var(--side-dim)}
nav a.page.active+ul.toc{display:block}
nav ul.toc li.t2{margin-left:.6rem}nav ul.toc li.t3{margin-left:1.2rem}nav ul.toc li.t4{margin-left:1.8rem}
nav a.h{display:block;padding:.1rem .4rem;border-radius:3px}nav a.h.active{color:#fff;background:#3b342f}
main{overflow:auto}
article{max-width:50rem;margin:2rem auto;padding:2rem 2.5rem;background:var(--card);border-radius:6px;box-shadow:0 2px 12px #0003;line-height:1.55}
.crumb{font:12px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:var(--accent)}
.page-title{margin-top:.2rem}
article img,article video{max-width:100%;height:auto}
article table{border-collapse:collapse}article td,article th{border:1px solid #9998;padding:.3rem .6rem}
article a{color:var(--accent)}.unresolved{font-style:italic}.roll{font-family:monospace;background:#8882;padding:0 .3em;border-radius:3px}
.pager{display:flex;justify-content:space-between;gap:1rem;margin-top:2.5rem;padding-top:1rem;border-top:1px solid #8884;font:14px system-ui,sans-serif}
#toggle{display:none}
@media (max-width:800px){
  body{grid-template-columns:1fr}
  nav{position:fixed;inset:0 20% 0 0;z-index:10;transform:translateX(-100%);transition:transform .2s}
  body.nav-open nav{transform:none}
  #toggle{display:block;position:fixed;top:.5rem;right:.5rem;z-index:11;padding:.4rem .7rem}
  article{margin:3rem .5rem 1rem;padding:1rem}
}`;

const doc = `<!doctype html>
<html lang="${esc(game.i18n.lang)}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(root.name)}</title><style>${css}</style></head>
<body>
<button id="toggle">☰</button>
<nav><h2>${esc(root.name)}</h2><input id="q" type="search" placeholder="Search…">${navHtml}</nav>
<main>${articles.join("\n")}</main>
<script>(${runtime.toString()})()</script>
</body></html>`;

saveDataToFile(doc, "text/html", `${root.name}.html`);
ui.notifications.info(`Exported ${articles.length} pages.`);