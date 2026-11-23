/* config.js – the extension points you are most likely to touch.
   Pure data, no DOM, no three.js: the Node build script imports it too. */

/** Edge kinds. An edge without "kind" is "default". Add a line, use it in the editor: done. */
export const EDGE_KINDS = {
  default:  { label: 'Connection', color: '#8fb0a8' },
  ally:     { label: 'Ally',       color: '#6fbfb0' },
  rival:    { label: 'Rival',      color: '#b8322a' },
  family:   { label: 'Family',     color: '#f0d589' },
  business: { label: 'Business',   color: '#c9a24b' },
  secret:   { label: 'Secret',     color: '#b07acb' }
};

/** Node types. "size" is a multiplier on DEFAULTS.nodeRadius. */
export const NODE_TYPES = {
  pc:  { label: 'Crew member', size: 1.35 },
  npc: { label: 'Character',   size: 1.0 }
};

export const DEFAULTS = {
  nodeRadius: 2.2,          // world units
  linkDistance: 28,         // preferred edge length for the force layout
  maxLabels: 45,            // labels shown in "near" mode
  dragThreshold: 4,         // px between "click" and "drag"
  ungroupedColor: '#8a8f93',
  mutedMix: 0.45            // nodes without href are blended this far toward the background
};
