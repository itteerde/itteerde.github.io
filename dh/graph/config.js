/* config.js – the extension points you are most likely to touch.
   Pure data, no DOM, no three.js: the Node build script imports it too. */

/** Built-in edge kinds. An edge without "kind" is "default". The editor can add more and recolour these –
 *  they are stored in the data ("kinds"), which overrides this table. */
export const EDGE_KINDS = {
  default:  { label: 'Connection', color: '#8fb0a8' },
  ally:     { label: 'Ally',       color: '#6fbfb0' },
  rival:    { label: 'Rival',      color: '#b8322a' },
  family:   { label: 'Family',     color: '#f0d589' },
  business: { label: 'Business',   color: '#c9a24b' },
  secret:   { label: 'Secret',     color: '#b07acb' }
};

/** Node types. "shape" is one of SHAPES, "size" a multiplier on DEFAULTS.nodeRadius,
 *  "color" (optional) is used for nodes that have no group.
 *  These are the built-in types; the editor can add more and override these – they are stored in the data ("types"). */
export const NODE_TYPES = {
  pc:  { label: 'Crew member', shape: 'sphere', size: 1.35 },
  npc: { label: 'Character',   shape: 'sphere', size: 1.0 }
};

/** Shapes a node type can use (view.js builds the geometry; "glyph" is only for the UI). */
export const SHAPES = {
  sphere:   { label: 'Sphere',            glyph: '●' },
  cube:     { label: 'Cube',              glyph: '■' },
  diamond:  { label: 'Diamond',           glyph: '◆' },
  pyramid:  { label: 'Pyramid',           glyph: '▲' },
  cone:     { label: 'Cone',              glyph: '△' },
  cylinder: { label: 'Cylinder',          glyph: '▮' },
  hexagon:  { label: 'Hexagon (token)',   glyph: '⬢' },
  ring:     { label: 'Ring',              glyph: '○' },
  gem:      { label: 'Gem (dodecahedron)', glyph: '❖' }
};

export const DEFAULTS = {
  nodeRadius: 2.2,          // world units
  linkDistance: 28,         // preferred edge length for the force layout
  maxLabels: 45,            // labels shown in "near" mode
  dragThreshold: 4,         // px between "click" and "drag"
  ungroupedColor: '#8a8f93',
  mutedMix: 0.45,           // nodes without href are blended this far toward the background
  shaded: true,             // lit (Lambert) material so shapes read as 3D; false = flat colours
  lightAmbient: 1.9,        // three.js light intensities (physical units: ~3.14 = full albedo)
  lightDirect: 2.2
};
