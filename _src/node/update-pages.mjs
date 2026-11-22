#!/usr/bin/env node
/**
 * update-pages.mjs – syncs character pages with a Foundry VTT party.json export.
 *
 * Input: party-live.json from export-party-live.js (preferred) or a raw actor export.
 * A page belongs to an actor when <main ... data-uuid="..."> equals the actor's _id.
 * Only the data-driven parts of a page are rewritten; everything else
 * (portrait, diary line, GM notes, links, pager, ...) is left untouched.
 *
 *   Updated:  <title>, <h1>, breadcrumb, tags (class/ancestry/community/level),
 *             Traits, Vitals, Experiences
 *   Sheet block (live exports only), collapsible <details> sections without any
 *   images or extra files: Features, Loadout, Inventory, Biography. It lives between
 *   <!-- sheet:start --> and <!-- sheet:end -->; first run inserts it right after the
 *   Experiences list, later runs replace it in place. Style it with fold.css.
 *   The hand-written "Backstory" section of a page is never touched.
 *
 * Zero dependencies, Node >= 18.
 */
import { parseArgs } from 'node:util';
import { readFile, writeFile, readdir, rename, copyFile } from 'node:fs/promises';
import path from 'node:path';

const HELP = `
Usage:
  node update-pages.mjs [party.json] [site-dir] [options]

  party.json may be either the output of export-party-live.js (recommended,
  contains Foundry's own prepared values) or a raw actor export (values are
  then reconstructed and may be inaccurate).

Options:
  -p, --party <file>   Foundry export (default: party.json)
  -s, --site <dir>     Site root, searched recursively for *.html (default: .)
      --only <name>    Only actors whose name contains <name> (repeatable)
      --raw            Use stored values only (ignore level-up bonuses)
  -n, --dry-run        Show what would change, write nothing
      --backup         Save <file>.bak before overwriting
  -v, --verbose        Show changed lines for every section
  -h, --help           This help
`;

const TRAITS = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'];
const MINUS = '\u2212'; // the pages use a real minus sign

// ---------------------------------------------------------------- helpers

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${Math.abs(n)}` : '0');
const signedExp = (n) => (n < 0 ? `${MINUS}${Math.abs(n)}` : `+${n}`);
const sum = (arr, f) => arr.reduce((n, x) => n + f(x), 0);

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || ['node_modules', 'pagefind'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) yield p;
  }
}

// ------------------------------------------------- derive stats from actor

/**
 * Foundry stores base values; level-up choices live in system.levelData.
 * Derived like the Daggerheart system does it:
 *   trait       = stored + 1 per level-up pick of that trait
 *   experience  = stored + 1 per level-up pick of that experience id
 *   evasion     = class evasion + stored bonus + level-up evasion picks
 *   HP max      = class HP + stored bonus + level-up hitPoint picks
 *   Stress max  = stored max + level-up stress picks
 *   Hope max    = (stored max ?? 6) - scars
 *   Armor max   = equipped armor's armor.max (current = marked slots)
 */
function derive(actor, { raw }) {
  const sys = actor.system ?? {};
  const items = actor.items ?? [];
  const warnings = [];
  const first = (type) => items.find((i) => i.type === type);
  const cls = first('class');
  const armor = items.find((i) => i.type === 'armor' && i.system?.equipped) ?? first('armor');
  if (!cls) warnings.push('no class item');
  if (!armor) warnings.push('no armor item');

  const picks = raw
    ? []
    : Object.values(sys.levelData?.levelups ?? {}).flatMap((l) => l.selections ?? []);
  const count = (type) => sum(picks.filter((p) => p.type === type), (p) => p.value ?? 1);

  const traits = {};
  for (const t of TRAITS) {
    const up = picks.filter((p) => p.type === 'trait' && (p.data ?? []).includes(t)).length;
    traits[t] = (sys.traits?.[t]?.value ?? 0) + up;
  }

  const expBonus = new Map();
  for (const p of picks.filter((p) => p.type === 'experience')) {
    for (const id of p.data ?? []) {
      if (!sys.experiences?.[id]) warnings.push(`level-up references unknown experience id ${id}`);
      else expBonus.set(id, (expBonus.get(id) ?? 0) + (p.value ?? 1));
    }
  }
  const experiences = Object.entries(sys.experiences ?? {}).map(([id, e]) => ({
    name: e.name,
    value: (e.value ?? 0) + (expBonus.get(id) ?? 0),
  }));

  const res = sys.resources ?? {};
  return {
    name: actor.name,
    cls: cls?.name,
    ancestry: first('ancestry')?.name,
    community: first('community')?.name,
    level: sys.levelData?.level?.current ?? 1,
    traits,
    experiences,
    evasion: (cls?.system?.evasion ?? 0) + (sys.evasion ?? 0) + count('evasion'),
    armor: { max: armor?.system?.armor?.max ?? 0, on: armor?.system?.armor?.current ?? 0 },
    hp: {
      max: (cls?.system?.hitPoints ?? 0) + (res.hitPoints?.max ?? 0) + count('hitPoint'),
      on: res.hitPoints?.value ?? 0,
    },
    stress: { max: (res.stress?.max ?? 6) + count('stress'), on: res.stress?.value ?? 0 },
    hope: { max: Math.max(0, (res.hope?.max ?? 6) - (sys.scars ?? 0)), on: res.hope?.value ?? 0 },
    warnings,
  };
}

/**
 * Live export (export-party-live.js, "format": "live-v1"): the macro already ran
 * Foundry's/Daggerheart's own data preparation, so values are used as-is.
 */
function fromLive(actor) {
  const l = actor.live;
  const warnings = (l.missing ?? []).map((m) => `export could not resolve ${m}`);
  const res = (r, fallbackMax = 0) => ({ max: r?.max ?? fallbackMax, on: r?.value ?? 0 });
  return {
    name: actor.name,
    cls: l.class ?? undefined,
    ancestry: l.ancestry ?? undefined,
    community: l.community ?? undefined,
    level: l.level ?? 1,
    traits: Object.fromEntries(TRAITS.map((t) => [t, l.traits?.[t] ?? 0])),
    experiences: l.experiences ?? [],
    evasion: l.evasion ?? 0,
    armor: { max: l.armor?.max ?? 0, on: l.armor?.value ?? 0 },
    hp: res(l.hp),
    stress: res(l.stress),
    hope: res(l.hope),
    sheet: 'features' in l
      ? {
          features: l.features ?? [],
          loadout: l.loadout ?? [],
          vault: l.vault ?? [],
          inventory: l.inventory ?? {},
          characteristics: l.characteristics ?? {},
          background: l.background ?? '',
          connections: l.connections ?? '',
        }
      : null,
    warnings,
  };
}

// -------------------------------------------------------- HTML renderers

function renderTags(d) {
  const tags = [d.cls, d.ancestry, d.community, `Level ${d.level}`].filter(Boolean);
  return `<p>${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join(' ')}</p>`;
}

function renderTraits(d) {
  const li = TRAITS.map(
    (t) =>
      `<li class="trait"><b>${signed(d.traits[t])}</b><span>${t[0].toUpperCase()}${t.slice(1)}</span></li>`,
  );
  const lines = [];
  for (let i = 0; i < li.length; i += 2) lines.push(li.slice(i, i + 2).join(''));
  return `<ul class="traits">\n${lines.join('\n')}\n</ul>`;
}

function renderVitals(d) {
  const pips = (cls, v) =>
    `<span class="${cls}" data-max="${v.max}" data-on="${Math.min(v.on, v.max)}"></span>`;
  return [
    '<dl class="stats">',
    `<dt>Evasion</dt><dd>${d.evasion}</dd>`,
    `<dt>Armor</dt><dd>${pips('pips', d.armor)}</dd>`,
    `<dt>Hit Points</dt><dd>${pips('pips', d.hp)}</dd>`,
    `<dt>Stress</dt><dd>${pips('pips stress', d.stress)}</dd>`,
    `<dt>Hope</dt><dd>${pips('pips hope', d.hope)}</dd>`,
    '</dl>',
  ].join('\n');
}

function renderExperiences(d) {
  return `<ul>${d.experiences.map((e) => `<li>${esc(e.name)} ${signedExp(e.value)}</li>`).join('')}</ul>`;
}

/** Foundry rich text -> a small, attribute-free subset of HTML. */
function sanitizeRich(html) {
  const ALLOWED = new Set(['p', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'br']);
  let s = String(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, '$1') // Foundry enrichers
    .replace(/@\w+\[[^\]]*\]\{([^}]*)\}/g, '$1')
    .replace(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi, '<p><strong>$1</strong></p>') // headings -> bold line
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (m, tag) => {
      tag = tag.toLowerCase();
      if (!ALLOWED.has(tag)) return '';
      return m.startsWith('</') ? `</${tag}>` : `<${tag}>`;
    })
    .replace(/<p>\s*(<br>)?\s*<\/p>/gi, '') // Foundry's empty spacer paragraphs
    .replace(/<li>\s*<p>/gi, '<li>') // <li><p>x</p></li> -> <li>x</li>
    .replace(/<\/p>\s*<\/li>/gi, '</li>')
    .replace(/\s+<\/(p|li)>/gi, '</$1>')
    .replace(/<\/p>\s*/gi, '</p>\n')
    .trim();
  if (s && !/<(p|ul|ol)\b/i.test(s)) s = `<p>${s}</p>`;
  return s;
}

// ---------------------------------------------- collapsible sheet sections

const rich = (html) => sanitizeRich(html ?? '');
const tag = (text, extra = '') => `<span class="tag${extra ? ` ${extra}` : ''}">${esc(text)}</span>`;
const entry = (headInner, ...body) =>
  `<div class="entry">\n<h4>${headInner}</h4>\n${body.filter(Boolean).join('\n')}\n</div>`;
const fold = (id, label, count, inner, cls = 'fold') =>
  `<details class="${cls}" id="${id}">\n<summary>${esc(label)}${count != null ? ` <span class="count">${count}</span>` : ''}</summary>\n<div class="fold-body">\n${inner}\n</div>\n</details>`;

function renderFeatures(list) {
  if (!list?.length) return '';
  const groups = new Map();
  for (const f of list) {
    const key = [f.source, f.origin].filter(Boolean).join(' \u00b7 ');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(f);
  }
  const inner = [...groups]
    .map(([heading, fs]) => {
      const items = fs.map((f) =>
        entry(
          `${esc(f.name)}${f.form && f.form !== 'passive' ? ` ${tag(f.form[0].toUpperCase() + f.form.slice(1))}` : ''}`,
          rich(f.description),
        ),
      );
      return `<h3>${esc(heading)}</h3>\n${items.join('\n')}`;
    })
    .join('\n');
  return fold('features', 'Features', list.length, inner);
}

function cardEntry(c) {
  const tags = [
    c.cardType && tag(c.cardType),
    c.domain && tag(c.level != null ? `${c.domain} \u00b7 Level ${c.level}` : c.domain),
    c.recallCost != null && tag(`Recall ${c.recallCost}`),
  ].filter(Boolean);
  return entry(`${esc(c.name)} ${tags.join(' ')}`, rich(c.description));
}

function renderLoadout(loadout, vault) {
  if (!loadout?.length && !vault?.length) return '';
  let inner = loadout?.length ? loadout.map(cardEntry).join('\n') : '<p class="muted">No cards in the loadout.</p>';
  if (vault?.length) {
    inner += `\n${fold('vault', 'Vault', vault.length, vault.map(cardEntry).join('\n'), 'fold sub')}`;
  }
  return fold('loadout', 'Loadout', loadout?.length ?? 0, inner);
}

function renderInventory(inv) {
  if (!inv) return '';
  const parts = [];
  const gold = Object.entries(inv.gold ?? {}).filter(([, n]) => n > 0);
  if (gold.length) {
    parts.push(`<p class="gold">${gold.map(([k, n]) => `${k[0].toUpperCase()}${k.slice(1)} ${n}`).join(' \u00b7 ')}</p>`);
  }
  const feats = (fs) =>
    (fs ?? []).map((f) => `<p><strong>${esc(f.name)}.</strong>${f.description ? ` ${rich(f.description).replace(/^<p>|<\/p>$/g, '')}` : ''}</p>`);
  const qty = (n) => (n && n !== 1 ? ` \u00d7${n}` : '');

  if (inv.weapons?.length) {
    parts.push('<h3>Weapons</h3>');
    for (const w of inv.weapons) {
      const tags = [w.equipped && tag(w.secondary ? 'Secondary' : 'Equipped', 'on'), w.tier != null && tag(`Tier ${w.tier}`), w.burden && tag(w.burden)].filter(Boolean);
      const line = [w.trait, w.range, w.damage].filter(Boolean).join(' \u00b7 ');
      parts.push(entry(`${esc(w.name)} ${tags.join(' ')}`, line && `<p class="statline">${esc(line)}</p>`, ...feats(w.features), rich(w.description)));
    }
  }
  if (inv.armor?.length) {
    parts.push('<h3>Armor</h3>');
    for (const a of inv.armor) {
      const tags = [a.equipped && tag('Equipped', 'on'), a.tier != null && tag(`Tier ${a.tier}`)].filter(Boolean);
      const bits = [
        a.thresholds?.major != null && a.thresholds?.severe != null && `Thresholds ${a.thresholds.major}/${a.thresholds.severe}`,
        a.slots != null && `Armor Score ${a.slots}`,
      ].filter(Boolean);
      parts.push(entry(`${esc(a.name)} ${tags.join(' ')}`, bits.length && `<p class="statline">${esc(bits.join(' \u00b7 '))}</p>`, ...feats(a.features), rich(a.description)));
    }
  }
  for (const [label, rows] of [['Consumables', inv.consumables], ['Loot', inv.loot]]) {
    if (!rows?.length) continue;
    parts.push(`<h3>${label}</h3>`);
    for (const r of rows) parts.push(entry(`${esc(r.name)}${qty(r.quantity)}`, rich(r.description)));
  }
  if (!parts.length) return '';
  const count = ['weapons', 'armor', 'consumables', 'loot'].reduce((n, k) => n + (inv[k]?.length ?? 0), 0);
  return fold('inventory', 'Inventory', count, parts.join('\n'));
}

function renderBiography(sheet) {
  const ch = sheet.characteristics ?? {};
  const label = { pronouns: '', age: 'Age ', faith: 'Faith: ' };
  const tags = Object.entries(ch)
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
    .map(([k, v]) => tag(`${label[k] ?? `${k[0].toUpperCase()}${k.slice(1)}: `}${v}`));
  const bg = rich(sheet.background);
  const conn = rich(sheet.connections);
  if (!tags.length && !bg && !conn) return '';
  const parts = [];
  if (tags.length) parts.push(`<p>${tags.join(' ')}</p>`);
  if (bg) parts.push(`<h3>Background</h3>\n${bg}`);
  if (conn) parts.push(`<h3>Connections</h3>\n${conn}`);
  return fold('biography', 'Biography', null, parts.join('\n'));
}

function renderSheet(sheet) {
  return [
    renderFeatures(sheet.features),
    renderLoadout(sheet.loadout, sheet.vault),
    renderInventory(sheet.inventory),
    renderBiography(sheet),
  ]
    .filter(Boolean)
    .join('\n');
}

const SHEET_RE = /<!-- sheet:start -->[\s\S]*?<!-- sheet:end -->/;
const EXPERIENCES_RE = /<h2>Experiences<\/h2>\s*<ul>[\s\S]*?<\/ul>/;

function upsertSheet(html, sheet, report) {
  const block = `<!-- sheet:start -->\n${renderSheet(sheet)}\n<!-- sheet:end -->`;
  if (SHEET_RE.test(html)) {
    return html.replace(SHEET_RE, (m) => {
      if (m !== block) report.changed.push({ label: 'sheet (features, loadout, inventory, biography)', before: m, after: block, brief: true });
      return block;
    });
  }
  const insert = (m, where) => {
    report.changed.push({ label: 'sheet (new)', before: '', after: block, brief: true });
    return where === 'after' ? `${m}\n${block}` : `${block}\n${m}`;
  };
  if (EXPERIENCES_RE.test(html)) return html.replace(EXPERIENCES_RE, (m) => insert(m, 'after'));
  if (/<\/article>/.test(html)) return html.replace(/<\/article>/, (m) => insert(m, 'before'));
  report.missing.push('sheet (no Experiences list or </article> to anchor to)');
  return html;
}

// --------------------------------------------------------- page updating

/** Replace group-1-prefixed section via regex; returns [html, changedBoolean]. */
function swap(html, re, build, report, label) {
  if (!re.test(html)) {
    report.missing.push(label);
    return html;
  }
  return html.replace(re, (m, pre = '') => {
    const next = `${pre}${build}`;
    if (next !== m) report.changed.push({ label, before: m, after: next });
    return next;
  });
}

function updateHtml(source, d) {
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  let html = source.replace(/\r\n/g, '\n');
  const report = { changed: [], missing: [] };

  // Name: title (part before " · "), h1, last breadcrumb item
  html = html.replace(/(<title>)([\s\S]*?)(<\/title>)/, (m, a, t, c) => {
    const i = t.indexOf(' \u00b7 ');
    const next = `${a}${esc(d.name)}${i >= 0 ? t.slice(i) : ''}${c}`;
    if (next !== m) report.changed.push({ label: 'title', before: m, after: next });
    return next;
  });
  html = html.replace(/(<h1>)([\s\S]*?)(<\/h1>)/, (m, a, t, c) => {
    const next = `${a}${esc(d.name)}${c}`;
    if (next !== m) report.changed.push({ label: 'h1', before: m, after: next });
    return next;
  });
  html = html.replace(/(<ol class="crumbs">[\s\S]*?<li>)([^<]*)(<\/li><\/ol>)/, (m, a, t, c) => {
    const next = `${a}${esc(d.name)}${c}`;
    if (next !== m) report.changed.push({ label: 'breadcrumb', before: m, after: next });
    return next;
  });

  html = swap(html, /(<h1>[\s\S]*?<\/h1>\s*)<p>(?:<span class="tag">[^<]*<\/span>\s*)+<\/p>/, renderTags(d), report, 'tags');
  html = swap(html, /(<h2>Traits<\/h2>\s*)<ul class="traits">[\s\S]*?<\/ul>/, renderTraits(d), report, 'Traits');
  html = swap(html, /(<h2>Vitals<\/h2>\s*)<dl class="stats">[\s\S]*?<\/dl>/, renderVitals(d), report, 'Vitals');
  html = swap(html, /(<h2>Experiences<\/h2>\s*)<ul>[\s\S]*?<\/ul>/, renderExperiences(d), report, 'Experiences');

  if (d.sheet) html = upsertSheet(html, d.sheet, report);

  return { html: html.replace(/\n/g, eol), report };
}

function showDiff(before, after) {
  const b = before.split('\n');
  const a = after.split('\n');
  for (const l of b) if (!a.includes(l)) console.log(`      - ${l.trim().slice(0, 160)}`);
  for (const l of a) if (!b.includes(l)) console.log(`      + ${l.trim().slice(0, 160)}`);
}

// ------------------------------------------------------------------ main

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      party: { type: 'string', short: 'p' },
      site: { type: 'string', short: 's' },
      only: { type: 'string', multiple: true },
      raw: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', short: 'n', default: false },
      backup: { type: 'boolean', default: false },
      verbose: { type: 'boolean', short: 'v', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) return void console.log(HELP);

  const partyFile = values.party ?? positionals[0] ?? 'party.json';
  const siteDir = values.site ?? positionals[1] ?? '.';
  const dry = values['dry-run'];

  let data = JSON.parse((await readFile(partyFile, 'utf8')).replace(/^\uFEFF/, ''));
  if (!Array.isArray(data)) data = data.actors ?? data.entries ?? [data];
  let actors = data.filter((a) => a?.type === 'character');
  if (values.only?.length) {
    const needles = values.only.map((s) => s.toLowerCase());
    actors = actors.filter((a) => needles.some((n) => a.name.toLowerCase().includes(n)));
  }
  const byId = new Map(actors.map((a) => [a._id, a]));

  const seen = new Set();
  let written = 0;
  let errors = 0;

  for await (const file of walk(siteDir)) {
    const source = await readFile(file, 'utf8');
    const id = source.match(/<main\b[^>]*\bdata-uuid="([^"]+)"/)?.[1];
    if (!id) continue;
    const actor = byId.get(id);
    if (!actor) continue; // other page type or filtered out by --only
    seen.add(id);

    const rel = path.relative(process.cwd(), file) || file;
    try {
      const d = actor.live ? fromLive(actor) : derive(actor, { raw: values.raw });
      const { html, report } = updateHtml(source, d);
      const tag = `${actor.name} -> ${rel}`;

      for (const w of d.warnings) console.warn(`  ! ${actor.name}: ${w}`);
      for (const m of report.missing) console.warn(`  ! ${rel}: section "${m}" not found, skipped`);

      if (!report.changed.length) {
        console.log(`= ${tag} (up to date)`);
        continue;
      }
      console.log(`${dry ? '~' : '*'} ${tag}: ${report.changed.map((c) => c.label).join(', ')}`);
      if (values.verbose || dry) for (const c of report.changed) {
        console.log(`    [${c.label}]`);
        if (c.brief) {
          const n = c.after.split('\n').filter((l) => !c.before.split('\n').includes(l)).length;
          console.log(`      ${n} line(s) new or changed`);
        } else showDiff(c.before, c.after);
      }
      if (!dry) {
        if (values.backup) await copyFile(file, `${file}.bak`);
        const tmp = `${file}.tmp`;
        await writeFile(tmp, html, 'utf8');
        await rename(tmp, file);
        written++;
      }
    } catch (err) {
      errors++;
      console.error(`x ${rel}: ${err.message}`);
    }
  }

  const orphans = actors.filter((a) => !seen.has(a._id));
  if (orphans.length) {
    console.log('\nNo page found for (no <main data-uuid="..."> match):');
    for (const a of orphans) console.log(`  - ${a.name}  [${a._id}]`);
  }
  console.log(`\n${dry ? 'Dry run: nothing written.' : `${written} file(s) written.`}`);
  if (errors) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
