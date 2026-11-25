/* Aetherial Expanse – shared behaviour. Each page sets <body data-root="../"> (path back to the site root).
   Edit NAV below once and every page gets the new menu. */
(() => {
  const root = document.body.dataset.root || '';
  const NAV = [
    ['Home', 'index.html'],
    ['The Crew', 'characters/index.html', [['Old Man Kelly', 'characters/kelly.html'], ['Enona', 'characters/enona.html'], ['Corinne', 'characters/corinne.html'], ['Mirielle', 'characters/amber.html'], ['Nikki', 'characters/nikki.html'], ['Sinder', 'characters/sinder.html'], ['Suture', 'characters/suture.html']]],
    ['Journals', 'journals/index.html', [['Captain’s Log', 'journals/captains-log.html'], ['Enona’s Log', 'journals/enonas-log.html'], ['Corinne’s Log', 'journals/corinnes-log.html'], ['Mirielle’s Log', 'journals/ambers-log.html'], ['Nikki’s Log', 'journals/nikkis-log.html'], ['Sinder’s Log', 'journals/sinders-log.html'], ['Suture’s Log', 'journals/sutures-log.html'], ['Session 1: Landfall', 'journals/session-01.html']]],
    ['Quests', 'quests/index.html', [['Collecting 42 Shark Teeth', 'quests/q_00001.html'], ['Collecting 43 Shark Teeth', 'quests/q_00002.html']]],
    ['Characters', 'contacts/index.html', [['Isolde Varrow', 'contacts/c_00001.html']]],
    ['Connections', 'connections/index.html', [['Crew & Contacts', 'connections/crew-and-npcs.html'], ['Crew & Ship', 'connections/crew-ship.html']]],
    ['Essays', 'essays/index.html', [['The Aether Tides', 'essays/aether-tides.html'], [`Reflections`, 'essays/enonas-reflections.html']]],
    ['Index', 'idx/index.html', [['A', 'idx/a.html'], ['B', 'idx/b.html']]]
  ];
  const url = h => root + h;
  // Compare paths without ".html", "index.html" or a trailing slash, so pretty-URL servers (serve, Netlify, Cloudflare Pages) still match.
  const norm = p => p.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const here = h => norm(new URL(url(h), document.baseURI).pathname) === norm(location.pathname);
  const cur = h => here(h) ? ' aria-current="page"' : '';

  // Fold state of the menu categories, remembered for this browser tab (explicit choices only).
  const KEY = 'nav-open';
  const state = (() => { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; } })();
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch { } };
  const isOpen = (h, kids) => h in state ? state[h] : (here(h) || kids.some(k => here(k[1])));

  const nav = document.createElement('nav');
  nav.className = 'nav'; nav.id = 'site-nav'; nav.setAttribute('aria-label', 'Main');
  nav.innerHTML = `<a class="brand" href="${url('index.html')}"><small>A Daggerheart campaign</small>The Aetherial Expanse</a><ul>` +
    NAV.map(([t, h, kids = []]) => {
      const open = kids.length > 0 && isOpen(h, kids);
      return `<li class="${kids.length ? 'has-kids' : ''}${open ? ' is-open' : ''}" data-h="${h}"><a href="${url(h)}"${cur(h)}>${t}</a>` +
        (kids.length
          ? `<button type="button" class="fold" aria-expanded="${open}" aria-label="Show or hide ${t}">▸</button><ul>` +
          kids.map(([kt, kh]) => `<li><a href="${url(kh)}"${cur(kh)}>${kt}</a></li>`).join('') + '</ul>'
          : '') + '</li>';
    }).join('') + '</ul>';

  const bar = document.createElement('header');
  bar.className = 'topbar';
  bar.innerHTML = `<button class="burger" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">☰</button><a href="${url('index.html')}">The Aetherial Expanse</a>`;
  const scrim = document.createElement('div'); scrim.className = 'scrim';
  document.querySelector('.site').prepend(scrim, nav, bar);

  const burger = bar.querySelector('.burger');
  const set = o => { document.body.classList.toggle('nav-open', o); burger.setAttribute('aria-expanded', o); };
  burger.onclick = () => set(!document.body.classList.contains('nav-open'));
  scrim.onclick = () => set(false);
  addEventListener('keydown', e => e.key === 'Escape' && set(false));

  const toggle = li => {
    const o = !li.classList.contains('is-open');
    li.classList.toggle('is-open', o);
    li.querySelector('.fold').setAttribute('aria-expanded', o);
    state[li.dataset.h] = o; save();
  };
  nav.onclick = e => {
    const li = e.target.closest('li.has-kids');
    if (e.target.closest('.fold')) return toggle(li);            // the little arrow
    const a = e.target.closest('a');
    if (!a) return;
    if (li && a === li.firstElementChild && !(e.ctrlKey || e.metaKey || e.shiftKey)) {   // the category name itself
      const h = li.dataset.h;
      if (here(h)) { e.preventDefault(); return toggle(li); }     // already on its page: just fold/unfold, no reload
      state[h] = !li.classList.contains('is-open'); save();       // open -> fold, folded -> unfold, and go to its page
    }
    set(false);                                                   // close the mobile drawer after real navigation
  };

  // Search (Pagefind). The trigger appears only if the index exists; build it with `npm run search` after every change.
  const sCss = document.createElement('link');
  sCss.rel = 'stylesheet'; sCss.href = url('pagefind/pagefind-component-ui.css');
  const sJs = document.createElement('script');
  sJs.type = 'module'; sJs.src = url('pagefind/pagefind-component-ui.js');
  sJs.onload = () => {
    // Tell Pagefind where the site lives (auto-detection fails for injected scripts and falls back to "/pagefind/").
    const cfg = document.createElement('pagefind-config');
    cfg.setAttribute('bundle-path', new URL(url('pagefind/'), document.baseURI).pathname);
    cfg.setAttribute('base-url', new URL(url('./'), document.baseURI).pathname);
    document.body.append(cfg);
    const slot = () => {
      const d = document.createElement('div'); d.className = 'search-slot';
      d.innerHTML = '<pagefind-modal-trigger></pagefind-modal-trigger>'; return d;
    };
    nav.querySelector('.brand').after(slot());
    bar.append(slot());
    document.body.append(document.createElement('pagefind-modal'));
  };
  document.head.append(sCss, sJs);

  // <span class="pips hope" data-max="6" data-on="4"></span> → diamond tracker
  document.querySelectorAll('.pips').forEach(p => {
    const m = +p.dataset.max, o = +p.dataset.on;
    p.setAttribute('role', 'img'); p.setAttribute('aria-label', `${o} of ${m}`);
    p.innerHTML = Array.from({ length: m }, (_, i) => `<i class="pip${i < o ? ' on' : ''}"></i>`).join('');
  });
  // <span class="spoiler">secret</span> → click / Enter to reveal
  document.querySelectorAll('.spoiler').forEach(s => {
    s.tabIndex = 0; s.setAttribute('role', 'button'); s.title = 'Reveal';
    const f = () => s.classList.toggle('revealed');
    s.onclick = f; s.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } };
  });
  // <div class="toc" data-toc></div> → contents list from .prose h2
  const toc = document.querySelector('[data-toc]');
  if (toc) toc.innerHTML = '<strong>Contents</strong><ol>' + [...document.querySelectorAll('.prose h2')]
    .map((h, i) => { h.id = h.id || 's' + (i + 1); return `<li><a href="#${h.id}">${h.textContent}</a></li>`; }).join('') + '</ol>';
})();

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0) return;
  const t = e.target instanceof Element ? e.target : null;
  if (!t || t.closest('summary')) return; // summaries toggle natively
  // leave links, form controls and anything interactive alone
  if (t.closest('a, button, input, select, textarea, label, [contenteditable]')) return;
  const body = t.closest('.fold-body');
  if (!body) return;
  // don't collapse while the reader is selecting/copying text
  if (String(window.getSelection?.() ?? '').length) return;

  // innermost fold wins: a click inside the Vault closes only the Vault
  const fold = body.closest('details.fold');
  if (!fold) return;
  fold.open = false;

  // a long section collapses upwards: keep its heading in view
  const summary = fold.querySelector(':scope > summary');
  if (summary && summary.getBoundingClientRect().top < 0) summary.scrollIntoView({ block: 'nearest' });
});
