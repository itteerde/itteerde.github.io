/**
 * Export party (live values) – Foundry VTT script macro for the Daggerheart system.
 *
 * Reads the *prepared* actors (actor.system after Foundry + the Daggerheart system ran
 * their data preparation and applied active effects), i.e. the numbers the character
 * sheet renders, plus everything the website needs for its text sections:
 * features, domain-card loadout/vault, inventory (weapons, armor, consumables, loot, gold)
 * and biography. Rich text is enriched by Foundry (@UUID, inline rolls, @Lookup ...) and
 * GM secrets are removed. No images or other files are exported or needed.
 *
 * Create: Macro Directory -> Create Macro -> Type "Script" -> paste -> Execute.
 * Output: party-live.json (browser download). Feed it to update-pages.mjs.
 *
 * Property paths marked (guess) could not be checked against the system source and are
 * resolved defensively; unresolved core values are listed in `missing` of that actor and
 * reported in a notification. Set DEBUG = true to also dump the prepared system data.
 */
const DEBUG = false;

// Choose WHICH actors to export – there is no "export everything" default.
// Fill in at least one of the two (if both are set, the union is exported):
const FOLDER = null; // Actor folder name, e.g. "The Crew"
const ACTOR_IDS = [
  'twWrF3i7MvYRg7In', // Alden Crowe
  'VIw7VK9r8utgN6qS', // Gial Engstrand
  '6XqwOxQJGn5CHxWA', // Hamenja
  'XmMP8XL78NhvmUmT', // Lynyxia Stormborn
  'CA9vwKRL4hpaiOUI', // Rosemary Everclear
]; // Actor IDs, e.g. ["H6DSaCHG4p4BEI5t", "FyFRyyIWkPGJdykU"]

const TRAITS = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'];
const TE = foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;

// ------------------------------------------------------------------ helpers
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const firstNum = (...vals) => vals.find(isNum) ?? null;
/** number, or { value|current|marked, max } -> { value, max } */
const asRes = (v) => {
  if (isNum(v)) return { value: null, max: v };
  if (v && typeof v === 'object') {
    const value = [v.value, v.current, v.marked].find(isNum);
    return { value: value ?? null, max: isNum(v.max) ? v.max : null };
  }
  return { value: null, max: null };
};
/** "veryFar" -> "Very Far" */
const title = (s) =>
  String(s ?? '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());
/** Localize an i18n key; fall back when the key is missing/unresolved. */
const loc = (key, fallback = '') => {
  if (!key || typeof key !== 'string') return fallback;
  const s = game.i18n.localize(key);
  return s === key ? fallback : s;
};
const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `-${Math.abs(n)}` : '');

/** Foundry-enriched HTML with GM secrets removed (falls back to the raw text). */
async function enrich(html, relativeTo, rollData) {
  if (!html) return '';
  try {
    return await TE.enrichHTML(html, { secrets: false, relativeTo, rollData });
  } catch (err) {
    console.warn('[export-party-aou] enrich failed', relativeTo?.name, err);
    return html;
  }
}

// ----------------------------------------------------------- item mappers
const SOURCE = { ancestry: 'Ancestry', community: 'Community', class: 'Class', subclass: 'Subclass' };
const SOURCE_RANK = ['Ancestry', 'Community', 'Class', 'Subclass', 'Other'];
const KIND_RANK = ['primary', 'secondary', 'hope', 'class', 'foundation', 'specialization', 'mastery'];
const rank = (list, v) => {
  const i = list.indexOf(v);
  return i < 0 ? list.length : i;
};

async function mapFeatures(actor) {
  const rows = [];
  for (const it of actor.items.filter((i) => i.type === 'feature')) {
    const g = it.system?.granter;
    rows.push({
      name: it.name,
      source: g ? (SOURCE[g.type] ?? title(g.type)) : 'Other',
      origin: g ? (actor.items.get(g.id)?.name ?? null) : null,
      kind: g?.identifier ?? null,
      form: it.system?.featureForm ?? 'passive',
      description: await enrich(it.system?.description, it, it.getRollData?.()),
    });
  }
  return rows.sort(
    (a, b) => rank(SOURCE_RANK, a.source) - rank(SOURCE_RANK, b.source) || rank(KIND_RANK, a.kind) - rank(KIND_RANK, b.kind),
  );
}

async function mapDomainCards(actor) {
  const mk = async (it) => ({
    name: it.name,
    domain: loc(get(CONFIG, `DH.DOMAIN.domains.${it.system?.domain}.label`), title(it.system?.domain)), // (guess)
    level: firstNum(it.system?.level),
    recallCost: firstNum(it.system?.recallCost),
    cardType: title(it.system?.type),
    description: await enrich(it.system?.description, it, it.getRollData?.()),
  });
  const cards = actor.items.filter((i) => i.type === 'domainCard');
  const loadout = [];
  const vault = [];
  for (const it of cards) (it.system?.inVault ? vault : loadout).push(await mk(it));
  return { loadout, vault };
}

function itemFeatures(it, table) {
  return Object.entries(it.system?.itemFeatures ?? {}).map(([k, v]) => {
    const key = v?.value ?? k;
    const def = get(CONFIG, `DH.ITEM.${table}.${key}`); // (guess)
    return { name: loc(def?.label, title(key)), description: loc(def?.description, '') };
  });
}

/** Attack damage like "1d8+3 phy"; the proficiency multiplier is resolved with the live proficiency. */
function damageText(atk, prof) {
  const parts = atk?.damage?.parts ? Object.values(atk.damage.parts) : [atk?.damage?.main].filter(Boolean);
  return parts
    .map((p) => {
      const v = p.value ?? {};
      let formula;
      if (v.custom?.enabled && v.custom.formula) formula = v.custom.formula;
      else if (v.dice) {
        const n = v.multiplier === 'prof' ? (prof ?? 1) : (v.flatMultiplier ?? 1);
        formula = `${n}${v.dice}${signed(v.bonus ?? 0)}`;
      }
      if (!formula) return null;
      const types = (p.type ?? []).map((t) => ({ physical: 'phy', magical: 'mag' })[t] ?? String(t).slice(0, 3));
      const typeList =
        types instanceof Set ? Array.from(types) :
          Array.isArray(types) ? types :
            typeof types === "string" ? [types] :
              types && typeof types === "object" ? Object.keys(types).filter(k => types[k]) :
                [];
      return [formula, typeList.join('/')].filter(Boolean).join(' ');
    })
    .filter(Boolean)
    .join(' + ');
}

async function mapInventory(actor, prof) {
  const of = (type) => actor.items.filter((i) => i.type === type);
  const desc = (it) => enrich(it.system?.description, it, it.getRollData?.());

  const weapons = [];
  for (const it of of('weapon')) {
    const atk = it.system?.attack;
    weapons.push({
      name: it.name,
      tier: firstNum(it.system?.tier),
      equipped: !!it.system?.equipped,
      secondary: !!it.system?.secondary,
      burden: title(it.system?.burden),
      trait: title(atk?.roll?.trait),
      range: title(atk?.range),
      damage: damageText(atk, prof),
      features: itemFeatures(it, 'weaponFeatures'),
      description: await desc(it),
    });
  }
  const armor = [];
  for (const it of of('armor')) {
    armor.push({
      name: it.name,
      tier: firstNum(it.system?.tier),
      equipped: !!it.system?.equipped,
      slots: firstNum(it.system?.armor?.max),
      thresholds: { major: firstNum(it.system?.baseThresholds?.major), severe: firstNum(it.system?.baseThresholds?.severe) },
      features: itemFeatures(it, 'armorFeatures'),
      description: await desc(it),
    });
  }
  const stack = async (type) => {
    const rows = [];
    for (const it of of(type)) rows.push({ name: it.name, quantity: firstNum(it.system?.quantity) ?? 1, description: await desc(it) });
    return rows;
  };
  const sortEq = (a, b) => Number(b.equipped) - Number(a.equipped);
  return {
    gold: actor.system?.gold ?? {},
    weapons: weapons.sort(sortEq),
    armor: armor.sort(sortEq),
    consumables: await stack('consumable'),
    loot: await stack('loot'),
  };
}

// ----------------------------------------------------------- actor export
async function exportActor(actor) {
  const sys = actor.system;
  const missing = [];
  const need = (label, v) => {
    if (v === null || v === undefined) missing.push(label);
    return v ?? null;
  };
  const item = (type) => actor.items.find((i) => i.type === type);
  const equipped = actor.items.find((i) => i.type === 'armor' && i.system?.equipped) ?? item('armor');

  // Traits: prepared values
  const traits = {};
  for (const t of TRAITS) traits[t] = need(`traits.${t}`, firstNum(get(sys, `traits.${t}.value`)));

  // Resources: prepared max/value
  const hp = asRes(get(sys, 'resources.hitPoints'));
  const stress = asRes(get(sys, 'resources.stress'));
  const hope = asRes(get(sys, 'resources.hope'));
  need('hitPoints.max', hp.max);
  need('stress.max', stress.max);
  need('hope.max', hope.max);

  // Armor: score/slots from system getters if present, else the equipped armor item
  const armorSys = asRes(sys.armorScore);
  const armorRes = asRes(get(sys, 'resources.armor'));
  const armorItem = asRes(get(equipped, 'system.armor'));
  const armor = {
    max: firstNum(armorSys.max, armorRes.max, armorItem.max),
    value: firstNum(armorRes.value, armorSys.value, armorItem.value),
  };
  need('armor.max', armor.max);
  need('armor.value', armor.value);

  const evasion = need('evasion', firstNum(isNum(sys.evasion) ? sys.evasion : sys.evasion?.value));
  const thresholds = {
    major: firstNum(get(sys, 'damageThresholds.major')),
    severe: firstNum(get(sys, 'damageThresholds.severe')),
  };
  const proficiency = firstNum(sys.proficiency);

  const experiences = Object.values(sys.experiences ?? {})
    .filter((e) => e?.name)
    .map((e) => ({ name: e.name, value: firstNum(e.value) ?? 0 }));

  const rollData = actor.getRollData?.();
  const { loadout, vault } = await mapDomainCards(actor);

  const record = {
    _id: actor.id,
    type: actor.type,
    name: actor.name,
    live: {
      level: need('level', firstNum(get(sys, 'levelData.level.current'), get(sys, 'levelData.level.changed'))),
      class: item('class')?.name ?? null,
      subclass: item('subclass')?.name ?? null,
      ancestry: item('ancestry')?.name ?? null,
      community: item('community')?.name ?? null,
      traits,
      evasion,
      proficiency,
      hp: { value: hp.value, max: hp.max },
      stress: { value: stress.value, max: stress.max },
      hope: { value: hope.value, max: hope.max },
      armor,
      thresholds,
      experiences,
      scars: firstNum(sys.scars),
      features: await mapFeatures(actor),
      loadout,
      vault,
      inventory: await mapInventory(actor, proficiency),
      characteristics: sys.biography?.characteristics ?? {},
      background: await enrich(sys.biography?.background, actor, rollData),
      connections: await enrich(sys.biography?.connections, actor, rollData),
      missing,
    },
  };
  if (DEBUG) {
    record.debug = { system: sys.toObject?.(false) ?? foundry.utils.deepClone(sys) };
    console.log(`[export-party-aou] ${actor.name}`, record, sys);
  }
  return record;
}

// ------------------------------------------------------------------- main
const folderName = typeof FOLDER === 'string' ? FOLDER.trim() : '';
const ids = [...new Set((Array.isArray(ACTOR_IDS) ? ACTOR_IDS : []).map((i) => String(i).trim()).filter(Boolean))];

if (!folderName && !ids.length) {
  ui.notifications.error('export-party-aou: set FOLDER to an actor folder name or fill ACTOR_IDS with actor IDs. Nothing exported.');
} else {
  const errors = [];
  const selected = new Map();

  if (folderName) {
    const folder = game.folders.find((f) => f.type === 'Actor' && f.name === folderName);
    if (!folder) errors.push(`Actor folder "${folderName}" not found`);
    else for (const a of game.actors.filter((a) => a.folder?.id === folder.id)) selected.set(a.id, a);
  }
  for (const id of ids) {
    const a = game.actors.get(id);
    if (!a) errors.push(`Actor ID "${id}" not found`);
    else selected.set(a.id, a);
  }

  const actors = [...selected.values()].filter((a) => a.type === 'character');
  const skipped = selected.size - actors.length;

  if (errors.length) {
    ui.notifications.error(`export-party-aou: ${errors.join('; ')}. Nothing exported.`);
  } else if (!actors.length) {
    ui.notifications.error('export-party-aou: the selection contains no character actors. Nothing exported.');
  } else {
    const exported = [];
    for (const a of actors) exported.push(await exportActor(a));
    const out = {
      format: 'live-v2',
      exportedAt: new Date().toISOString(),
      foundry: game.version,
      system: `${game.system.id} ${game.system.version}`,
      actors: exported,
    };
    const save = foundry.utils?.saveDataToFile ?? globalThis.saveDataToFile;
    save(JSON.stringify(out, null, 2), 'application/json', 'party-live.json');

    ui.notifications.info(`Exported ${out.actors.length} character(s) to party-live.json.`);
    if (skipped) ui.notifications.warn(`${skipped} selected actor(s) skipped (not of type character).`);
    for (const a of out.actors.filter((a) => a.live.missing.length)) {
      ui.notifications.warn(`${a.name}: could not resolve ${a.live.missing.join(', ')}`);
    }
  }
}
