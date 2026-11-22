/**
 * Export party (live values) – Foundry VTT script macro for the Daggerheart system.
 *
 * Unlike a raw actor export (actor.toObject()), this reads the *prepared* actor
 * (actor.system after Foundry + the Daggerheart system ran their data preparation
 * and applied active effects), i.e. the same numbers the character sheet renders.
 *
 * Create: Macro Directory -> Create Macro -> Type "Script" -> paste -> Execute.
 * Output: party-live.json (browser download). Feed it to update-pages.mjs.
 *
 * Property paths below could not be checked against the system source, so every
 * field is resolved defensively. Anything that cannot be resolved is listed in
 * `missing` of that actor and reported in a notification. Set DEBUG = true to
 * also dump the prepared system data to the browser console (F12) and into the file.
 */
const DEBUG = false;

// Choose WHICH actors to export – there is no "export everything" default.
// Fill in at least one of the two (if both are set, the union is exported):
const FOLDER = null; // Actor folder name, e.g. "The Crew"
const ACTOR_IDS = [
  'H6DSaCHG4p4BEI5t', // Old Man Kelly
  'FyFRyyIWkPGJdykU', // Enona
  'nOhIzDIvVr8Hx7hv', // Corinne Vale
  '5VUzhf74KMqjThM5', // Amber Sunshadow
  'xhu7HXG6GwPYUKwB', // Nikki Doboro
  'aty1EvOcmp1D8Avd', // Sinder Jack Marrow
  'm8PlmFST5MscpRrs'  // Suture
]; // Actor IDs, e.g. ["H6DSaCHG4p4BEI5t", "FyFRyyIWkPGJdykU"]

const TRAITS = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'];

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** number, or { value|current|marked, max } -> { value, max } */
const asRes = (v) => {
  if (isNum(v)) return { value: null, max: v };
  if (v && typeof v === 'object') {
    const value = [v.value, v.current, v.marked].find(isNum);
    return { value: value ?? null, max: isNum(v.max) ? v.max : null };
  }
  return { value: null, max: null };
};
const firstNum = (...vals) => vals.find(isNum) ?? null;

function exportActor(actor) {
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

  const experiences = Object.values(sys.experiences ?? {})
    .filter((e) => e?.name)
    .map((e) => ({ name: e.name, value: firstNum(e.value) ?? 0 }));

  const record = {
    _id: actor.id,
    type: actor.type,
    name: actor.name,
    img: actor.img,
    live: {
      level: need('level', firstNum(get(sys, 'levelData.level.current'), get(sys, 'levelData.level.changed'))),
      class: item('class')?.name ?? null,
      subclass: item('subclass')?.name ?? null,
      ancestry: item('ancestry')?.name ?? null,
      community: item('community')?.name ?? null,
      traits,
      evasion,
      proficiency: firstNum(sys.proficiency),
      hp: { value: hp.value, max: hp.max },
      stress: { value: stress.value, max: stress.max },
      hope: { value: hope.value, max: hope.max },
      armor,
      thresholds,
      experiences,
      scars: firstNum(sys.scars),
      gold: sys.gold ?? null,
      characteristics: sys.biography?.characteristics ?? {},
      background: sys.biography?.background ?? '',
      connections: sys.biography?.connections ?? '',
      missing,
    },
  };
  if (DEBUG) {
    record.debug = { system: sys.toObject?.(false) ?? foundry.utils.deepClone(sys) };
    console.log(`[export-party-live] ${actor.name}`, record, sys);
  }
  return record;
}

const folderName = typeof FOLDER === 'string' ? FOLDER.trim() : '';
const ids = [...new Set((Array.isArray(ACTOR_IDS) ? ACTOR_IDS : []).map((i) => String(i).trim()).filter(Boolean))];

if (!folderName && !ids.length) {
  ui.notifications.error('export-party-live: set FOLDER to an actor folder name or fill ACTOR_IDS with actor IDs. Nothing exported.');
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
    ui.notifications.error(`export-party-live: ${errors.join('; ')}. Nothing exported.`);
  } else if (!actors.length) {
    ui.notifications.error('export-party-live: the selection contains no character actors. Nothing exported.');
  } else {
    const out = {
      format: 'live-v1',
      exportedAt: new Date().toISOString(),
      foundry: game.version,
      system: `${game.system.id} ${game.system.version}`,
      actors: actors.map(exportActor),
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
