(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Mo=["circle","square","rectangle","diamond","hexagon","triangle","card"],gu=1;class Jh{map=new Map;on(t,e){let n=this.map.get(t);return n||(n=new Set,this.map.set(t,n)),n.add(e),()=>this.off(t,e)}off(t,e){this.map.get(t)?.delete(e)}emit(t,e){const n=this.map.get(t);if(n)for(const s of[...n])s(e)}clear(){this.map.clear()}}const Vi=i=>JSON.parse(JSON.stringify(i));class no{directed=!1;meta={};events=new Jh;nodeMap=new Map;edgeMap=new Map;seq=0;nodeList=null;edgeList=null;constructor(t){t&&this.load(t,!1)}get nodes(){return this.nodeList??=[...this.nodeMap.values()]}get edges(){return this.edgeList??=[...this.edgeMap.values()]}hasNode(t){return this.nodeMap.has(t)}getNode(t){return this.nodeMap.get(t)}getEdge(t){return this.edgeMap.get(t)}load(t,e=!0){this.nodeMap.clear(),this.edgeMap.clear(),this.invalidate(),this.directed=!!t.directed,this.meta=Vi(t.meta??{});for(const n of t.nodes??[]){const s=Vi(n);s.id=String(s.id),this.nodeMap.set(s.id,s)}for(const n of t.edges??[]){const s=Vi(n);if(s.source=String(s.source),s.target=String(s.target),s.id=s.id?String(s.id):this.freeId("e",this.edgeMap),!this.nodeMap.has(s.source)||!this.nodeMap.has(s.target))throw new Error(`Edge "${s.id}" references an unknown node`);this.edgeMap.set(s.id,s)}e&&this.emit("structure")}clear(){this.load({directed:this.directed,nodes:[],edges:[]})}addNode(t={}){const e=t.id!==void 0?String(t.id):this.freeId("n",this.nodeMap);if(this.nodeMap.has(e))throw new Error(`Node "${e}" already exists`);const n={...Vi(t),id:e};return this.nodeMap.set(e,n),this.emit("structure"),n}updateNode(t,e){const n=this.nodeMap.get(t);if(!n)throw new Error(`Unknown node "${t}"`);return hc(n,e),this.emit("structure"),n}removeNode(t){if(!this.nodeMap.delete(t))return[];const e=[];for(const n of this.edgeMap.values())(n.source===t||n.target===t)&&e.push(n.id);for(const n of e)this.edgeMap.delete(n);return this.emit("structure"),e}addEdge(t){const e=String(t.source),n=String(t.target);if(!this.nodeMap.has(e)||!this.nodeMap.has(n))throw new Error("Edge endpoints must be existing nodes");const s=t.id!==void 0?String(t.id):this.freeId("e",this.edgeMap);if(this.edgeMap.has(s))throw new Error(`Edge "${s}" already exists`);const r={...Vi(t),id:s,source:e,target:n};return this.edgeMap.set(s,r),this.emit("structure"),r}updateEdge(t,e){const n=this.edgeMap.get(t);if(!n)throw new Error(`Unknown edge "${t}"`);if(e.source!==void 0&&!this.nodeMap.has(e.source))throw new Error("Unknown source node");if(e.target!==void 0&&!this.nodeMap.has(e.target))throw new Error("Unknown target node");return hc(n,e),this.emit("structure"),n}removeEdge(t){const e=this.edgeMap.delete(t);return e&&this.emit("structure"),e}setDirected(t){this.directed=t,this.emit("structure")}edgesOf(t){return this.edges.filter(e=>e.source===t||e.target===t)}degree(t){let e=0;for(const n of this.edges)n.source===t&&e++,n.target===t&&e++;return e}weightOf(t){return typeof t.weight=="number"&&Number.isFinite(t.weight)?t.weight:gu}isDirected(t){return t.directed??this.directed}setPositions(t){for(const[e,n]of t){const s=this.nodeMap.get(e);s&&(s.x=n[0],s.y=n[1],s.z=n[2])}this.events.emit("change",{kind:"position"})}toData(){return Vi({directed:this.directed,meta:this.meta,nodes:this.nodes,edges:this.edges})}emit(t){this.invalidate(),this.events.emit("change",{kind:t})}invalidate(){this.nodeList=null,this.edgeList=null}freeId(t,e){let n;do n=t+ ++this.seq;while(e.has(n));return n}}function hc(i,t){const e=i;for(const[n,s]of Object.entries(t))s===void 0?delete e[n]:e[n]=s}const _u=["label","sublabel","id","group","tags","props"],vu={label:"label",name:"label",sublabel:"sublabel",sub:"sublabel",id:"id",group:"group",tag:"tags",tags:"tags",url:"url",prop:"props",props:"props"};function xu(i){const t=[],e=/(?:([A-Za-z]+):)?(?:"([^"]*)"|(\S+))/g;let n;for(;(n=e.exec(i))!==null;){const s=n[1]?vu[n[1].toLowerCase()]:void 0,r=(s?n[2]??n[3]??"":n[0].replace(/^"|"$/g,"")).trim().toLowerCase();r&&t.push({field:s,term:r})}return t}class yu{entries;constructor(t){this.entries=t.nodes.map(e=>({id:e.id,text:{label:(e.label??"").toLowerCase(),sublabel:(e.sublabel??"").toLowerCase(),id:e.id.toLowerCase(),group:(e.group??"").toLowerCase(),tags:(e.tags??[]).join(`
`).toLowerCase(),url:(e.url??"").toLowerCase(),props:Object.values(e.props??{}).join(`
`).toLowerCase()}}))}search(t,e={}){const n=e.minChars??2,s=e.fields??_u,r=xu(t),o=r.filter(l=>l.term.length>=n);if(o.length===0)return{query:t,ids:[],tooShort:r.length>0};const a=[];for(const l of this.entries){let c=!0;for(const h of o)if(!(h.field?l.text[h.field].includes(h.term):s.some(u=>l.text[u].includes(h.term)))){c=!1;break}c&&a.push(l.id)}return{query:t,ids:a,tooShort:!1}}}const Mu=/^[a-z][a-z0-9+.-]*:/i;function Wi(i,t){if(!i)return null;const e=i.replace(/[\u0000-\u001f\u007f\s]+/g,n=>n.includes(" ")?" ":"").trim();return e===""?null:e.startsWith("//")?t.allowAbsolute&&/^\/\/[^/]/.test(e)?e:null:Mu.test(e)?t.allowAbsolute&&/^(https?|mailto):/i.test(e)?e:null:e.startsWith("/")||e.startsWith("#")||e.startsWith("?")||!t.baseUrl?e:t.baseUrl.replace(/\/+$/,"")+"/"+e.replace(/^\.\//,"")}function Qh(i,t=!1){switch(i){case"click":return"Click";case"dblclick":return"Double-click";case"ctrl-click":return t?"Cmd+click":"Ctrl+click";default:return""}}function bu(i,t=!1){const e=i.interaction,n=i.dimension==="3d",s=[];if(s.push({keys:"Drag background",text:n?i.camera.rotation==="free"?"Rotate freely":"Rotate":"Pan"}),n&&s.push({keys:"Right-drag",text:"Pan"}),s.push({keys:"Mouse wheel, pinch",text:"Zoom"}),e.select&&s.push({keys:"Click",text:"Select a node or edge"}),e.select&&e.multiSelect&&s.push({keys:"Shift+click, Shift+drag",text:"Add to the selection, box select"}),e.dragNodes&&s.push({keys:"Drag a node",text:"Move it (the whole selection moves together)"}),e.dragNodes&&e.axisLock&&s.push({keys:n?"X, Y or Z while dragging":"X or Y while dragging",text:"Lock the movement to that axis"}),e.gizmo&&s.push({keys:"Select, then use the handles",text:"Move, rotate or scale the selection (Ctrl snaps)"}),e.openLinks!=="never"){const r=Qh(e.openLinks,t);s.push({keys:`${r} on a badge item`,text:"Open the linked page"}),i.links.chip&&s.push({keys:`Select it, then "${i.links.chipLabel}"`,text:"Open the page without a modifier key"})}return i.ui.legend&&s.push({keys:"Group legend",text:"Click selects a group, Shift+click adds it, the eye hides or shows it"}),i.ui.search&&s.push({keys:"Search box",text:"Find and select nodes while typing; Enter zooms to them. group:Sales, tag:x, id:n1 search one field"}),i.ui.controls&&s.push({keys:"+  −  Fit  2D/3D",text:"Zoom in, zoom out, fit the graph, switch 2D / 3D"}),i.ui.fullscreen&&s.push({keys:"Full screen button",text:"Full screen; Esc leaves it"}),s}function bo(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Su(i){const t=Math.max(1,Math.floor(i.nodes)),e=Math.max(1,Math.min(i.clusters??Math.ceil(Math.sqrt(t)/2),t)),n=bo(i.seed??1),s=[],r=Array.from({length:e},()=>[]);for(let h=0;h<t;h++){const d=h%e;r[d].push(h),s.push({id:`n${h+1}`,label:`N${h+1}`,group:`Group ${d+1}`})}const o=Math.floor(t*i.avgDegree/2),a=i.crossRatio??.08,l=new Set,c=[];for(let h=0;c.length<o&&h<o*20;h++){const d=Math.floor(n()*t);let u;if(n()<a)u=Math.floor(n()*t);else{const _=r[d%e];u=_[Math.floor(n()*_.length)]}if(d===u)continue;const f=d<u?`${d}-${u}`:`${u}-${d}`;if(l.has(f))continue;l.add(f);const g={id:`e${c.length+1}`,source:s[d].id,target:s[u].id};i.weighted&&(g.weight=1+Math.floor(n()*5)),c.push(g)}return{directed:!!i.directed,nodes:s,edges:c}}const dr='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',Ca={theme:"light",dimension:"2d",background:{color:"#f7f8fa",gradientTo:null,transparent:!1},node:{color:"#4e79a7",shape:"circle",size:14,aspect:1.6,opacity:1,borderColor:"#2b3a4a",borderWidth:1,labelColor:"#1f2933"},edge:{color:"#8b95a1",width:1.5,dashed:!1,opacity:.9,arrows:!0,arrowSize:7,curveSpacing:16,loopSize:.9,dashSize:5,gapSize:3,widthByWeight:{enabled:!1,min:1,max:6}},label:{show:!0,font:dr,size:6,color:"#1f2933",subSize:4.6,subColor:"#5f6b76",background:null,padding:1,maxCount:1500,maxChars:40,mode:"world",resolution:4,gap:1.5},weight:{show:"auto",font:dr,size:5,color:"#3b4652",background:"rgba(255,255,255,0.85)",padding:1,maxCount:3e3,decimals:2},card:{background:"#ffffff",border:"#2b3a4a",headerBackground:null,headerColor:"#ffffff",textColor:"#1f2933",font:dr,size:4.5,padding:2},selection:{color:"#e8590c",hoverColor:"#f59f00",width:2.5},gizmo:{size:.9,space:"world",snapTranslate:10,snapRotate:15,snapScale:.1},groups:{palette:["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f","#edc948","#b07aa1","#ff9da7","#9c755f","#bab0ac"],colors:{}},rules:[],camera:{fov:50,zoomMin:.02,zoomMax:60,fitPadding:1.25,autoFit:!0,damping:!1,rotation:"orbit"},layout:{name:"force",idealLength:60,spacing:40,gap:14,weightMode:"ignore",gravity:.05,direction:"TB",seed:1,autoRun:!0},search:{minChars:2,fields:["label","sublabel","id","group","tags","props"],fitOnEnter:!0},interaction:{dragNodes:!0,select:!0,multiSelect:!0,hover:!0,tooltip:!0,gizmo:!1,axisLock:!0,openLinks:"ctrl-click",pickLimit:2e4},links:{baseUrl:"",target:"self",allowAbsolute:!1,panelSandbox:"allow-same-origin allow-scripts allow-popups allow-forms",badge:!0,badgeColor:"#1c7ed6",badgeSize:5,hint:!0,chip:!0,chipLabel:"Open page"},ui:{controls:!0,search:!0,legend:!0,stats:!1,help:!0,fullscreen:!0,injectStyles:!0,cssVars:{font:dr,"panel-bg":"rgba(255,255,255,0.96)","panel-fg":"#1f2933","panel-border":"#cfd6de",accent:"#e8590c",radius:"4px"}},render:{antialias:!0,pixelRatio:null}},td={light:{},dark:{background:{color:"#14181d",gradientTo:null},node:{color:"#6aa6d9",borderColor:"#0b0e11",labelColor:"#e6ebf0"},edge:{color:"#7d8996"},label:{color:"#e6ebf0",subColor:"#a9b4bf"},weight:{color:"#d3dae1",background:"rgba(20,24,29,0.85)"},card:{background:"#1d242c",border:"#6b7886",textColor:"#e6ebf0"},selection:{color:"#ffa94d",hoverColor:"#ffd43b"},groups:{palette:["#6aa6d9","#ffa94d","#ff7b7b","#63d2c6","#8fd36b","#f2d45c","#c9a0dc","#ffb3c1","#c4a07a","#aab4bd"]},links:{badgeColor:"#4dabf7"},ui:{cssVars:{"panel-bg":"rgba(29,36,44,0.96)","panel-fg":"#e6ebf0","panel-border":"#3a4652",accent:"#ffa94d"}}},blueprint:{background:{color:"#0d3b66",gradientTo:"#0a2c4d"},node:{color:"#faf0ca",borderColor:"#f4d35e",labelColor:"#faf0ca"},edge:{color:"#a9c7e8"},label:{color:"#faf0ca",subColor:"#a9c7e8"},weight:{color:"#0d3b66",background:"rgba(250,240,202,0.92)"},card:{background:"#0a2c4d",border:"#f4d35e",headerBackground:"#f4d35e",headerColor:"#0d3b66",textColor:"#faf0ca"},selection:{color:"#ee964b",hoverColor:"#f95738"},groups:{palette:["#faf0ca","#f4d35e","#ee964b","#f95738","#a9c7e8","#7fb7be","#d3f3ee","#e3b5a4"]},links:{badgeColor:"#f4d35e"},ui:{cssVars:{"panel-bg":"rgba(10,44,77,0.96)","panel-fg":"#faf0ca","panel-border":"#2f5d8a",accent:"#f4d35e"}}}};function ur(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)&&Object.getPrototypeOf(i)===Object.prototype}function tr(i,t){if(!ur(i)||!ur(t))return t===void 0?i:t;const e={...i};for(const[n,s]of Object.entries(t))s!==void 0&&(e[n]=ur(s)&&ur(e[n])?tr(e[n],s):Array.isArray(s)?[...s]:s);return e}function io(i={}){const t=i.theme??Ca.theme,e=td[t]??{};return tr(tr(Ca,e),i)}const wu={theme:'Base look. Built in: "light", "dark", "blueprint"; more can be added with registerTheme(). Everything below overrides the theme.',dimension:'"2d" (flat, orthographic) or "3d" (perspective). A graph file can store its own dimension in meta.dimension.',background:"Canvas background.","background.color":"CSS color of the background (top color when gradientTo is set).","background.gradientTo":"CSS color for a vertical gradient from color to this one, or null for a solid background.","background.transparent":"true: no background at all, the page behind the view shows through.",node:"Default look of nodes. A node can override color, shape and size itself; group colors and rules sit in between.","node.color":"Fill color when the node has neither its own color nor a group color.","node.shape":"circle, square, rectangle, diamond, hexagon, triangle or card (title plus lines, e.g. UML classes). 2D: flat polygons, 3D: solids.","node.size":"Diameter in world units.","node.aspect":'Width / height of the "rectangle" shape.',"node.opacity":"Opacity of all nodes, 0 to 1.","node.borderColor":"Outline color.","node.borderWidth":"Outline width in world units.","node.labelColor":"Text color of the node label.",edge:"Default look of edges. An edge can override color, width and dashed itself; rules sit in between.","edge.color":"Line color.","edge.width":"Line width in CSS pixels.","edge.dashed":"true: dashed lines.","edge.opacity":"Opacity of all edges, 0 to 1.","edge.arrows":"Draw arrow heads on directed edges.","edge.arrowSize":"Arrow head length in world units.","edge.curveSpacing":"Distance between parallel edges of the same node pair, in world units.","edge.loopSize":"Radius of self loops relative to the node size.","edge.dashSize":"Length of a dash in world units (dashed edges).","edge.gapSize":"Length of a gap in world units (dashed edges).","edge.widthByWeight":"Map the weights of the graph to line widths.","edge.widthByWeight.enabled":"true: width depends on the weight (lowest weight = min, highest = max).","edge.widthByWeight.min":"Line width in pixels for the lowest weight.","edge.widthByWeight.max":"Line width in pixels for the highest weight.",label:"Node labels. A label may contain line breaks, and a node can have a smaller sublabel below it.","label.show":"Show labels at all.","label.font":"CSS font family of labels and sublabels.","label.size":'Font size: world units in "world" mode, CSS pixels in "screen" mode.',"label.color":"Default label color (a node style can override it with labelColor).","label.subSize":"Font size of the sublabel.","label.subColor":"Color of the sublabel.","label.background":"CSS color of a box behind the label, or null for none.","label.padding":"Space between text and label box edge.","label.maxCount":"Labels are skipped above this node count (tooltips still work).","label.maxChars":"Longer lines are cut off with an ellipsis.","label.mode":'"world": labels scale with the zoom. "screen": constant pixel size.',"label.resolution":"Texture pixels per label unit. Higher is sharper and needs more memory.","label.gap":"Distance between node and label, in world units.",weight:"Text on edges: label and weight.","weight.show":'"auto": show weights other than 1. "always" or "never".',"weight.font":"CSS font family of edge texts.","weight.size":"Font size of edge texts.","weight.color":"Text color of edge texts.","weight.background":"CSS color of the box behind edge texts, or null.","weight.padding":"Space between text and box edge.","weight.maxCount":"Edge texts are skipped above this edge count.","weight.decimals":"Maximum number of decimals shown for weights.",card:'Look of nodes with the "card" shape (title in a header band, lines below; "---" is a separator).',"card.background":"Card body color.","card.border":"Border and separator color.","card.headerBackground":"Header band color, or null to use the node color.","card.headerColor":"Title text color.","card.textColor":"Body text color.","card.font":"CSS font family.","card.size":"Font size in world units.","card.padding":"Inner padding in world units.",selection:"Highlighting of selected and hovered items.","selection.color":"Outline color of selected nodes and color of selected edges.","selection.hoverColor":"Outline color of the hovered node and color of the hovered edge.","selection.width":"Outline width of selected nodes, in world units.",gizmo:"Transform gizmo of the selection (needs interaction.gizmo). Snapping is active while Ctrl or Cmd is held.","gizmo.size":"Size of the gizmo.","gizmo.space":'"world" or "local" axes.',"gizmo.snapTranslate":"Snap distance for moving, in world units.","gizmo.snapRotate":"Snap angle for rotating, in degrees.","gizmo.snapScale":"Snap step for scaling.",groups:"Colors by node group.","groups.palette":"Colors handed out to groups in order of first appearance, then repeated.","groups.colors":'Fixed colors per group name, for example { "Sales": "#e0b872" }.',rules:`Style rules, applied in order after the group color and before the values stored on the node or edge.
Example: { "target": "node", "match": { "group": "Design" }, "style": { "shape": "diamond" } }
match keys: id, group, tag, prop [key, value]. Node style keys: color, shape, size, borderColor, borderWidth, labelColor. Edge: color, width, dashed.`,camera:"Camera and view fitting.","camera.fov":"3D field of view in degrees.","camera.zoomMin":"Smallest 2D zoom.","camera.zoomMax":"Largest 2D zoom.","camera.fitPadding":"Margin factor when the graph is fitted into the view (1 = tight).","camera.autoFit":"Fit the graph into the view after loading and after a layout.","camera.damping":"Smooth camera motion (orbit mode).","camera.rotation":'3D only. "orbit": horizon stays level, tilt stops at the poles. "free": trackball, unlimited rotation around every axis.',layout:"Automatic placement of nodes.","layout.name":"force (general networks), tree (clean hierarchy), layered (DAG with cross links), circle, grid, sphere or random.","layout.idealLength":"Spring length of the force layout, in world units.","layout.spacing":"Minimum node distance when node sizes are unknown.","layout.gap":"Free space kept between node boxes (node plus label) by tree, layered, circle, grid and sphere.","layout.weightMode":'Edge weights in the force layout. "ignore": no effect. "closer": heavier edge = shorter (similarity, strength of a tie). "longer": heavier edge = longer (distance, cost, duration). Lengths are relative to the median weight and limited to 0.25x to 4x of layout.idealLength.',"layout.gravity":"Pull towards the center in the force layout, keeps separate parts together.","layout.direction":'"TB" (top to bottom) or "LR" (left to right) for tree and layered.',"layout.seed":"Seed of the random start positions, so layouts are reproducible.","layout.autoRun":"Run the layout when a loaded graph has nodes without coordinates.",search:'Search box (ui.search): finds nodes while typing and selects them. Terms are case-insensitive substrings, several terms must all match. field:term searches one field: group:Sales, tag:team, id:n12, label:"New York", url:pages/, prop:2019.',"search.minChars":"Terms shorter than this are ignored, so typing the first letter does not select half the graph.","search.fields":"Fields searched by plain terms: label, sublabel, id, group, tags, url, props.","search.fitOnEnter":"Enter in the search box zooms to the matches.",interaction:"What visitors can do.","interaction.dragNodes":"Nodes can be dragged.","interaction.select":"Nodes and edges can be selected.","interaction.multiSelect":"Shift-click and Shift-drag select several.","interaction.hover":"Highlight the item under the pointer.","interaction.tooltip":"Show a tooltip with details for the hovered item.","interaction.gizmo":"Show the transform gizmo (move, rotate, scale) for the selected nodes.","interaction.axisLock":"Holding X, Y or Z while dragging a node locks the movement to that axis.","interaction.openLinks":'Gesture that opens the url of a node or edge: "ctrl-click" (default, keeps plain clicks for selecting), "click", "dblclick" or "never" (no links at all).',"interaction.pickLimit":"Edges are not hit-tested above this edge count (speed).",links:"Website content behind node and edge urls.","links.baseUrl":'Prefix for relative urls, for example "content/".',"links.target":'"self" (navigate), "blank" (new tab), "panel" (sandboxed iframe inside the view) or "event" (your code decides, listen to the link event).',"links.allowAbsolute":"Allow absolute http(s) and mailto links. Relative paths are always allowed; javascript: and data: never.","links.panelSandbox":'sandbox attribute of the iframe used by target "panel".',"links.badge":"Draw a small link badge on every node and edge that has a url, so visitors see what is clickable.","links.badgeColor":"Color of the link badge.","links.badgeSize":"Size of the link badge in world units.","links.hint":'Tooltips of linked items say how to open the page (for example "Ctrl+click to open the page").',"links.chip":'Show an "Open page" chip next to a single selected node or edge that has a url. Works with touch and needs no modifier key.',"links.chipLabel":"Text of that chip (translate it here).",ui:"Buttons, tooltip and panel around the canvas.","ui.controls":"Zoom, fit and 2D/3D buttons.","ui.search":"Search box in the corner: finds and selects nodes and whole groups while you type (see search).","ui.legend":"Legend of the node groups in the bottom left corner (shown with two or more groups). Click a group to select it, Shift+click to add it, the eye hides or shows it.","ui.stats":"Performance overlay in the top right corner: frames per second while rendering, CPU time per frame, draw calls, triangles, layout and rebuild times, and a benchmark button. For measuring changes.","ui.help":"Help button (question mark) that lists the controls of this view, including the link gesture and full screen.","ui.fullscreen":"Full screen / back button (the usual corner icon). Set false to remove it.","ui.injectStyles":'Inject the default CSS once. Set false to ship your own (the class names start with "gs-").',"ui.cssVars":"CSS custom properties set on the view as --gs-<name>; they style tooltip, buttons and panel.","ui.cssVars.font":"Font family of the DOM parts.","ui.cssVars.panel-bg":"Background of tooltip, buttons and panel.","ui.cssVars.panel-fg":"Text color of tooltip, buttons and panel.","ui.cssVars.panel-border":"Border color of tooltip, buttons and panel.","ui.cssVars.accent":"Highlight color (button hover, selection box).","ui.cssVars.radius":"Corner radius of buttons and tooltip.",render:"Renderer settings.","render.antialias":"Smooth edges (needs a reload of the view to change).","render.pixelRatio":"Device pixel ratio to render at, or null for the screen default (maximum 2)."},li=i=>typeof i=="object"&&i!==null&&!Array.isArray(i),Eu=new Set(["groups.colors","ui.cssVars"]);function Tu(i,t){const e=[];for(const n of i.split(`
`)){let s="";for(const r of n.split(" "))s&&s.length+1+r.length>t?(e.push(s),s=r):s=s?`${s} ${r}`:r;e.push(s)}return e}const Au=`// Graphscape configuration: JSON with comments.
// Comments (// and /* */) and trailing commas are allowed here and are ignored when applying.
// Values that equal the default are fine to keep, they are dropped when the configuration is saved.
`;function ed(i,t=!0){const e=(s,r)=>{const o=wu[s];return o?Tu(o,Math.max(40,100-r.length)).map(a=>`${r}// ${a}`.trimEnd()).join(`
`)+`
`:""},n=(s,r,o)=>{if(li(s)){const a=Object.keys(s);if(a.length===0)return"{}";const l=o+"  ";return`{
${a.map(h=>{const d=r?`${r}.${h}`:h;return`${e(d,l)}${l}${JSON.stringify(h)}: ${n(s[h],d,l)}`}).join(`,
`)}
${o}}`}if(Array.isArray(s)){if(s.length===0)return"[]";if(s.every(l=>typeof l!="object"||l===null))return`[${s.map(l=>JSON.stringify(l)).join(", ")}]`;const a=o+"  ";return`[
${s.map(l=>a+JSON.stringify(l)).join(`,
`)}
${o}]`}return JSON.stringify(s)??"null"};return(t?Au:"")+n(i,"","")+`
`}function Cu(i){let t="",e=0;const n=i.length;let s=!1;for(;e<n;){const r=i[e];if(s){if(t+=r,r==="\\"){t+=i[e+1]??"",e+=2;continue}r==='"'&&(s=!1),e++}else if(r==='"')s=!0,t+=r,e++;else if(r==="/"&&i[e+1]==="/")for(;e<n&&i[e]!==`
`;)e++;else if(r==="/"&&i[e+1]==="*"){const o=i.indexOf("*/",e+2);e=o<0?n:o+2}else(r==="}"||r==="]")&&(t=t.replace(/,\s*$/,"")),t+=r,e++}return t}function Ru(i){return JSON.parse(Cu(i.replace(/^\uFEFF/,"")))}function nd(i,t){const e={};if(!li(t))return e;for(const[n,s]of Object.entries(t)){const r=li(i)?i[n]:void 0;if(li(s)&&li(r)){const o=nd(r,s);Object.keys(o).length&&(e[n]=o)}else JSON.stringify(s)!==JSON.stringify(r)&&(e[n]=s)}return e}function id(i,t=Ca,e=""){const n=[];if(!li(i)||!li(t))return n;for(const[s,r]of Object.entries(i)){const o=e?`${e}.${s}`:s;s in t?li(r)&&!Eu.has(o)&&n.push(...id(r,t[s],o)):n.push(o)}return n}function sd(i,t){const e=i.match;return typeof e=="function"?e(t):!(e.id!==void 0&&t.id!==e.id||e.group!==void 0&&t.group!==e.group||e.tag!==void 0&&!t.tags?.includes(e.tag)||e.prop&&t.props?.[e.prop[0]]!==e.prop[1])}function Ra(i){const t=new Map;for(const e of i.nodes)e.group!==void 0&&!t.has(e.group)&&t.set(e.group,t.size);return t}function Pa(i,t,e){const{aspect:n,opacity:s,...r}=t.node,o={...r};if(i.group!==void 0){const a=t.groups.palette,l=t.groups.colors[i.group]??(a.length?a[(e.get(i.group)??0)%a.length]:void 0);l&&(o.color=l)}for(const a of t.rules)a.target==="node"&&sd(a,i)&&Object.assign(o,a.style);return i.color&&(o.color=i.color),i.shape&&(o.shape=i.shape),i.size&&i.size>0&&(o.size=i.size),o}function Pu(i,t,e,n){const{color:s,width:r,dashed:o}=e.edge,a={color:s,width:r,dashed:o},l=e.edge.widthByWeight;if(l.enabled){const c=n.max>n.min?(t-n.min)/(n.max-n.min):0;a.width=l.min+(l.max-l.min)*Math.max(0,Math.min(1,c))}for(const c of e.rules)c.target==="edge"&&sd(c,i)&&Object.assign(a,c.style);return i.color&&(a.color=i.color),i.width&&i.width>0&&(a.width=i.width),i.dashed!==void 0&&(a.dashed=i.dashed),a.width=Math.round(a.width*2)/2,a}function Oo(i){const t={};for(const[e,n]of Object.entries(i))n!==void 0&&(t[e]=n);return t}class ar{directed=!1;meta={};warnings=[];nodes=new Map;edges=[];edgeIds=new Set;hasNode(t){return this.nodes.has(t)}node(t){return this.nodes.get(t)}addNode(t,e={}){const n=this.nodes.get(t);if(n)return Object.assign(n,Oo(e),{id:t}),n;const s={...Oo(e),id:t};return this.nodes.set(t,s),s}ensureNode(t){return this.nodes.get(t)??this.addNode(t)}addEdge(t,e,n={}){this.ensureNode(t),this.ensureNode(e);let s=n.id;if(!s||this.edgeIds.has(s)){let o=this.edges.length+1;for(;this.edgeIds.has(`e${o}`);)o++;s=`e${o}`}this.edgeIds.add(s);const r={...Oo(n),id:s,source:t,target:e};return this.edges.push(r),r}build(){return{directed:this.directed,meta:this.meta,nodes:[...this.nodes.values()],edges:this.edges}}}function be(i){if(typeof i=="number")return Number.isFinite(i)?i:void 0;if(typeof i=="string"&&i.trim()!==""){const t=Number(i);return Number.isFinite(t)?t:void 0}}function Oi(i){if(typeof i=="boolean")return i;if(typeof i=="number")return i!==0;if(typeof i=="string"){const t=i.trim().toLowerCase();if(["true","1","yes"].includes(t))return!0;if(["false","0","no"].includes(t))return!1}}function Zs(i){if(!i)return;const t=/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(i.trim());if(!t)return;let e=t[1];return e.length===3&&(e=[...e].map(n=>n+n).join("")),"#"+e.slice(0,6).toUpperCase()}function Lu(i,t){const e=[];let n=[],s="",r=!1;for(let o=0;o<i.length;o++){const a=i[o];r?a==='"'?i[o+1]==='"'?(s+='"',o++):r=!1:s+=a:a==='"'&&s===""?r=!0:a===t?(n.push(s),s=""):a===`
`||a==="\r"?(a==="\r"&&i[o+1]===`
`&&o++,n.push(s),s="",n.some(l=>l.trim()!=="")&&e.push(n),n=[]):s+=a}return n.push(s),n.some(o=>o.trim()!=="")&&e.push(n),e}const Du={source:"source",from:"source",src:"source",target:"target",to:"target",dst:"target",dest:"target",weight:"weight",value:"weight",w:"weight",label:"label",url:"url",directed:"directed",group:"group"};function Iu(i,t=!1){const e=i.split(/\r?\n/,1)[0]??"",n=[",",";","	"].map(h=>({d:h,n:e.split(h).length})).sort((h,d)=>d.n-h.n)[0].d,s=Lu(i,n),r=new ar;if(r.directed=t,s.length===0)return{graph:r.build(),warnings:["Empty file"],format:"csv"};const o=s[0].map(h=>Du[h.trim().toLowerCase()]),a=o.includes("source")&&o.includes("target"),l=a?o:["source","target","weight","label"];for(const h of a?s.slice(1):s){const d={};if(l.forEach((g,_)=>{g&&h[_]!==void 0&&(d[g]=h[_].trim())}),!d.source)continue;if(!d.target){r.addNode(d.source,{label:d.label||void 0,url:d.url||void 0,group:d.group||void 0});continue}let u=be(d.weight),f=d.label||void 0;!a&&u===void 0&&d.weight&&(f=d.weight,u=void 0),r.addEdge(d.source,d.target,{weight:u,label:f,url:d.url||void 0,directed:Oi(d.directed)})}const c=r.build();for(const h of c.edges)h.directed===c.directed&&delete h.directed;return{graph:c,warnings:r.warnings,format:"csv"}}const dc=i=>{const t=i===void 0?"":String(i);return/[",\n\r;]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};function Uu(i){const t=["source,target,weight,label,url,directed"],e=new Set;for(const n of i.edges)e.add(n.source),e.add(n.target),t.push([n.source,n.target,n.weight??1,n.label,n.url,n.directed??i.directed].map(dc).join(","));for(const n of i.nodes)e.has(n.id)||t.push([n.id,"","",n.label,n.url,""].map(dc).join(","));return t.join(`
`)+`
`}function Nu(i){const t=[],e=/-?(?:\d+\.?\d*|\.\d+)/y,n=/[A-Za-z_\u0080-\uffff][A-Za-z_0-9\u0080-\uffff]*/y,s=i.length;let r=0;for(;r<s;){const o=i[r];if(/\s/.test(o))r++;else if(o==="/"&&i[r+1]==="/"){const a=i.indexOf(`
`,r);r=a<0?s:a+1}else if(o==="/"&&i[r+1]==="*"){const a=i.indexOf("*/",r+2);r=a<0?s:a+2}else if(o==="#"&&(r===0||i[r-1]===`
`)){const a=i.indexOf(`
`,r);r=a<0?s:a+1}else if(o==='"'){let a=r+1,l="";for(;a<s&&i[a]!=='"';)i[a]==="\\"&&i[a+1]==='"'?(l+='"',a+=2):i[a]==="\\"&&i[a+1]===`
`?a+=2:l+=i[a++];t.push({t:"str",v:l}),r=a+1}else if(o==="<"){let a=0,l=r;for(;l<s;l++)if(i[l]==="<")a++;else if(i[l]===">"&&--a===0)break;const c=i.slice(r+1,l).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]*>/g,"");t.push({t:"str",v:c.trim()}),r=l+1}else if(o==="-"&&(i[r+1]===">"||i[r+1]==="-"))t.push({t:"sym",v:i.slice(r,r+2)}),r+=2;else{e.lastIndex=r,n.lastIndex=r;const a=e.exec(i),l=n.exec(i);a?(t.push({t:"id",v:a[0]}),r+=a[0].length):l?(t.push({t:"id",v:l[0]}),r+=l[0].length):(t.push({t:"sym",v:o}),r++)}}return t}const Ou={box:"rectangle",rect:"rectangle",rectangle:"rectangle",plaintext:"rectangle",plain:"rectangle",none:"rectangle",square:"square",ellipse:"circle",oval:"circle",circle:"circle",doublecircle:"circle",point:"circle",diamond:"diamond",hexagon:"hexagon",octagon:"hexagon",triangle:"triangle",record:"card",mrecord:"card"},pi=i=>i.replace(/\\n|\\l|\\r/g,`
`);function uc(i){const t=i.replace(/^\/[a-z0-9]+\//i,"");return t.startsWith("#")?t.slice(0,7):t.split(":")[0]}class Fu{constructor(t){this.toks=t}p=0;b=new ar;warnedBoth=!1;peek(t=0){return this.toks[this.p+t]}next(){const t=this.toks[this.p++];if(!t)throw new Error("Unexpected end of DOT input");return t}isSym(t,e=0){const n=this.peek(e);return!!n&&n.t==="sym"&&n.v===t}parse(){this.peek()?.t==="id"&&this.peek().v.toLowerCase()==="strict"&&this.next();const t=this.next().v.toLowerCase();if(t!=="graph"&&t!=="digraph")throw new Error('Expected "graph" or "digraph"');if(this.b.directed=t==="digraph",!this.isSym("{")){const n=this.next().v;n&&(this.b.meta.title=n)}if(!this.isSym("{"))throw new Error('Expected "{"');this.next();const e={nodeDef:{},edgeDef:{}};this.stmtList(e),e.label&&!this.b.meta.title&&(this.b.meta.title=pi(e.label))}attrList(){const t={};for(;this.isSym("[");){for(this.next();!this.isSym("]");){const e=this.next();if(e.t==="sym")continue;let n="true";this.isSym("=")&&(this.next(),n=this.next().v),t[e.v]=n}this.next()}return t}stmtList(t){const e=new Set;for(;this.peek();){const n=this.peek();if(n.t==="sym"&&(n.v===";"||n.v===",")){this.next();continue}if(n.t==="sym"&&n.v==="}")return this.next(),e;const s=n.v.toLowerCase();if(n.t==="id"&&(s==="node"||s==="edge"||s==="graph")&&this.isSym("[",1)){this.next();const l=this.attrList();s==="node"?Object.assign(t.nodeDef,l):s==="edge"?Object.assign(t.edgeDef,l):l.label&&(t.label=l.label);continue}if((n.t==="id"||n.t==="str")&&this.isSym("=",1)){this.next(),this.next();const l=this.next().v;n.v==="label"&&(t.label=l);continue}const r=[this.operand(t,e)];let o=!1;for(;this.isSym("->")||this.isSym("--");)this.next(),o=!0,r.push(this.operand(t,e));const a=this.attrList();if(o)for(let l=0;l+1<r.length;l++)for(const c of r[l])for(const h of r[l+1])this.addEdge(c,h,{...t.edgeDef,...a});else for(const l of r[0])this.applyNode(l,a)}throw new Error('Unterminated DOT block (missing "}")')}operand(t,e){const n=this.peek();if(!n)throw new Error("Unexpected end of DOT input");if(n.t==="id"&&n.v.toLowerCase()==="subgraph"||n.t==="sym"&&n.v==="{"){let r="";if(n.t==="id"&&(this.next(),this.isSym("{")||(r=this.next().v)),!this.isSym("{"))return[];this.next();const o={nodeDef:{...t.nodeDef},edgeDef:{...t.edgeDef}},a=this.stmtList(o);if(/^cluster/i.test(r)){const l=o.label?pi(o.label):r.replace(/^cluster_?/i,"")||r;for(const c of a){const h=this.b.node(c);h&&h.group===void 0&&(h.group=l)}}return a.forEach(l=>e.add(l)),[...a]}const s=this.next().v;for(;this.isSym(":");)this.next(),this.peek()&&this.peek().t!=="sym"&&this.next();return this.b.hasNode(s)||(this.b.addNode(s),this.applyNode(s,t.nodeDef)),e.add(s),[s]}applyNode(t,e){const n=this.b.ensureNode(t),s={};e.label!==void 0&&e.label!=="\\N"&&(s.label=pi(e.label));const r=e.fillcolor??(e.style?.includes("filled")?e.color:void 0)??e.color;r&&(s.color=uc(r));const o=e.shape?Ou[e.shape.toLowerCase()]:void 0;o&&(s.shape=o);const a=e.URL??e.href??e.url;a&&(s.url=a),e.group&&(s.group=e.group);const l=e.sublabel??e.xlabel;if(l&&(s.sublabel=pi(l)),Object.assign(n,s),n.shape==="card"&&e.label!==void 0){const c=e.label.replace(/[{}]/g,"").split("|");n.label=pi(c[0]).trim()||t;const h=[];c.slice(1).forEach((d,u)=>{u>0&&h.push("---"),h.push(...pi(d).split(`
`).map(f=>f.trim()).filter(Boolean))}),n.body=h}}addEdge(t,e,n){this.b.hasNode(t)||this.b.addNode(t),this.b.hasNode(e)||this.b.addNode(e);const s=n.dir?.toLowerCase();let r=this.b.directed,o=t,a=e;s==="none"?r=!1:s==="forward"?r=!0:s==="back"?(r=!0,o=e,a=t):s==="both"&&(r=!1,this.warnedBoth||(this.b.warnings.push("Edges with dir=both were imported as undirected"),this.warnedBoth=!0));const l={weight:be(n.weight),label:n.label?pi(n.label):void 0,url:n.URL??n.href??n.url,color:n.color?uc(n.color):void 0,dashed:n.style&&/dashed|dotted/.test(n.style)?!0:void 0,width:be(n.penwidth)},c=this.b.addEdge(o,a,l);r!==this.b.directed&&(c.directed=r)}}function zu(i){const t=new Fu(Nu(i));return t.parse(),{graph:t.b.build(),warnings:t.b.warnings,format:"dot"}}const ku={circle:"ellipse",square:"square",rectangle:"box",diamond:"diamond",hexagon:"hexagon",triangle:"triangle",card:"record"},Ye=i=>`"${i.replace(/"/g,'\\"').replace(/\r?\n/g,"\\n")}"`;function Bu(i){const t=[`${i.directed?"digraph":"graph"} ${Ye(i.meta?.title??"G")} {`];for(const n of i.nodes){const s=[];if(n.shape==="card"){const r=n.body?.indexOf("---")??-1,o=r<0?n.body??[]:(n.body??[]).slice(0,r),a=r<0?[]:(n.body??[]).slice(r+1),l=c=>c.join("\\l")+(c.length?"\\l":"");s.push(`label=${Ye(`{${n.label??n.id}|${l(o)}|${l(a)}}`).replace(/\\\\l/g,"\\l")}`,"shape=record")}else n.label!==void 0&&s.push(`label=${Ye(n.label)}`),n.shape&&s.push(`shape=${ku[n.shape]}`);n.sublabel&&s.push(`sublabel=${Ye(n.sublabel)}`),n.color&&s.push(`fillcolor=${Ye(n.color)}`,"style=filled"),n.url&&s.push(`URL=${Ye(n.url)}`),n.group&&s.push(`group=${Ye(n.group)}`),t.push(`  ${Ye(n.id)}${s.length?` [${s.join(", ")}]`:""};`)}const e=i.directed?"->":"--";for(const n of i.edges){const s=[];n.weight!==void 0&&s.push(`weight=${n.weight}`),n.label&&s.push(`label=${Ye(n.label)}`),n.url&&s.push(`URL=${Ye(n.url)}`),n.color&&s.push(`color=${Ye(n.color)}`),n.dashed&&s.push("style=dashed"),n.width&&s.push(`penwidth=${n.width}`),n.directed!==void 0&&n.directed!==i.directed&&s.push(`dir=${n.directed?"forward":"none"}`),t.push(`  ${Ye(n.source)} ${e} ${Ye(n.target)}${s.length?` [${s.join(", ")}]`:""};`)}return t.push("}"),t.join(`
`)+`
`}const Hu=i=>i.replace(/&quot;/g,'"').replace(/&amp;/g,"&"),Gu=i=>i.replace(/&/g,"&amp;").replace(/"/g,"&quot;");function Vu(i){const t=i.replace(/^\s*#.*$/gm,""),e=/\s*(\[|\]|"[^"]*"|[^\s[\]"]+)/y,n=[];let s;for(e.lastIndex=0;(s=e.exec(t))!==null;)n.push(s[1]);return n}function rd(i,t,e){const n=[];for(;t.i<i.length;){const s=i[t.i++];if(s==="]"){if(e)throw new Error('Unexpected "]" in GML');return n}const r=i[t.i++];if(r===void 0)throw new Error("Unexpected end of GML");r==="["?n.push([s,rd(i,t,!1)]):r.startsWith('"')?n.push([s,Hu(r.slice(1,-1))]):n.push([s,be(r)??r])}if(!e)throw new Error("Unterminated list in GML");return n}const Tl=(i,t)=>i.find(([e])=>e===t)?.[1],Ae=(i,t)=>{const e=Tl(i,t);return typeof e=="string"||typeof e=="number"?String(e):void 0},Jn=(i,t)=>{const e=Tl(i,t);return typeof e=="number"?e:typeof e=="string"?be(e):void 0},fc=(i,t)=>{const e=Tl(i,t);return Array.isArray(e)?e:void 0};function Wu(i){const t=rd(Vu(i),{i:0},!0),e=fc(t,"graph");if(!e)throw new Error("GML document contains no graph [ ... ]");const n=new ar;n.directed=Jn(e,"directed")===1;const s=Ae(e,"label");s&&(n.meta.title=s);for(const[a,l]of e){if(a!=="node"||!Array.isArray(l))continue;const c=Ae(l,"gsId"),h=c??Ae(l,"id");if(h===void 0){n.warnings.push("Skipped a node without id");continue}const d=fc(l,"graphics"),u=Ae(l,"shape"),f=Ae(l,"body");n.addNode(h,{label:Ae(l,"label"),sublabel:Ae(l,"sublabel"),x:d?Jn(d,"x"):void 0,y:d?Jn(d,"y"):void 0,z:d?Jn(d,"z"):void 0,group:Ae(l,"group"),url:Ae(l,"url"),color:Ae(l,"color")??(d?Ae(d,"fill"):void 0),size:Jn(l,"size"),shape:u&&Mo.includes(u)?u:void 0,body:f?f.split(`
`):void 0}),c!==void 0&&(n.node(h)._gml=Ae(l,"id"))}const r=new Map;for(const a of n.build().nodes){const l=a._gml;l!==void 0&&r.set(l,a.id),delete a._gml}const o=a=>a===void 0?void 0:r.get(a)??a;for(const[a,l]of e){if(a!=="edge"||!Array.isArray(l))continue;const c=o(Ae(l,"source")),h=o(Ae(l,"target"));if(c===void 0||h===void 0){n.warnings.push("Skipped an edge without source/target");continue}const d={weight:Jn(l,"weight")??Jn(l,"value"),label:Ae(l,"label"),url:Ae(l,"url"),color:Ae(l,"color")},u=Jn(l,"directed");u!==void 0&&u===1!==n.directed&&(d.directed=u===1),n.addEdge(c,h,d)}return{graph:n.build(),warnings:n.warnings,format:"gml"}}function Xu(i){const t=s=>`"${Gu(s)}"`,e=new Map;i.nodes.forEach((s,r)=>e.set(s.id,r));const n=["graph [",`  directed ${i.directed?1:0}`];i.meta?.title&&n.push(`  label ${t(i.meta.title)}`);for(const s of i.nodes)n.push("  node [",`    id ${e.get(s.id)}`,`    gsId ${t(s.id)}`),s.label!==void 0&&n.push(`    label ${t(s.label)}`),s.sublabel&&n.push(`    sublabel ${t(s.sublabel)}`),(s.x!==void 0||s.y!==void 0)&&n.push(`    graphics [ x ${s.x??0} y ${s.y??0}${s.z!==void 0?` z ${s.z}`:""} ]`),s.group&&n.push(`    group ${t(s.group)}`),s.url&&n.push(`    url ${t(s.url)}`),s.color&&n.push(`    color ${t(s.color)}`),s.shape&&n.push(`    shape ${t(s.shape)}`),s.size!==void 0&&n.push(`    size ${s.size}`),s.body?.length&&n.push(`    body ${t(s.body.join(`
`))}`),n.push("  ]");for(const s of i.edges)n.push("  edge [",`    source ${e.get(s.source)}`,`    target ${e.get(s.target)}`),s.weight!==void 0&&n.push(`    weight ${s.weight}`),s.label&&n.push(`    label ${t(s.label)}`),s.url&&n.push(`    url ${t(s.url)}`),s.color&&n.push(`    color ${t(s.color)}`),s.directed!==void 0&&s.directed!==i.directed&&n.push(`    directed ${s.directed?1:0}`),n.push("  ]");return n.push("]"),n.join(`
`)+`
`}const $u={lt:"<",gt:">",amp:"&",quot:'"',apos:"'"};function Fo(i){return i.includes("&")?i.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(t,e)=>{if(e[0]==="#"){const n=e[1].toLowerCase()==="x"?parseInt(e.slice(2),16):parseInt(e.slice(1),10);return Number.isFinite(n)&&n>0&&n<=1114111?String.fromCodePoint(n):t}return $u[e.toLowerCase()]??t}):i}function Ce(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Yu(i){const t={name:"#root",attrs:{},children:[],text:""},e=[t],n=/<(\/?)([^\s/>!?]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/y,s=/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,r=i.length;let o=i.charCodeAt(0)===65279?1:0;for(;o<r;){const a=e[e.length-1],l=i.indexOf("<",o);if(l===-1){a.text+=Fo(i.slice(o));break}if(l>o&&(a.text+=Fo(i.slice(o,l))),o=l,i.startsWith("<!--",o)){const c=i.indexOf("-->",o+4);if(c<0)throw new Error("Unterminated XML comment");o=c+3}else if(i.startsWith("<![CDATA[",o)){const c=i.indexOf("]]>",o);if(c<0)throw new Error("Unterminated CDATA section");a.text+=i.slice(o+9,c),o=c+3}else if(i.startsWith("<?",o)){const c=i.indexOf("?>",o);if(c<0)throw new Error("Unterminated processing instruction");o=c+2}else if(i.startsWith("<!",o)){let c=0,h=o+2;for(;h<r;h++){const d=i[h];if(d==="[")c++;else if(d==="]")c--;else if(d===">"&&c<=0)break}o=h+1}else{n.lastIndex=o;const c=n.exec(i);if(!c)throw new Error(`Malformed XML near offset ${o}`);if(o=n.lastIndex,c[1]){if(e.length<2||e[e.length-1].name!==c[2])throw new Error(`Unexpected closing tag </${c[2]}>`);e.pop()}else{const h={};s.lastIndex=0;let d;for(;(d=s.exec(c[3]))!==null;)h[d[1]]=Fo(d[2]??d[3]??"");const u={name:c[2],attrs:h,children:[],text:""};a.children.push(u),c[4]||e.push(u)}}}if(e.length!==1)throw new Error(`Unclosed XML element <${e[e.length-1].name}>`);if(t.children.length===0)throw new Error("Empty XML document");return t.children[0]}const Ei=i=>i.name.slice(i.name.indexOf(":")+1);function Is(i,t){return i.children.filter(e=>Ei(e)===t)}function sn(i,t){for(const e of i.children){if(t(e))return e;const n=sn(e,t);if(n)return n}}const qu=new Set(["ShapeNode","GenericNode","ImageNode","SVGNode","UMLClassNode","GroupNode","GenericGroupNode","TableNode"]),ju=new Set(["PolyLineEdge","ArcEdge","QuadCurveEdge","SplineEdge","BezierEdge","GenericEdge","ImageEdge"]),pc=new Set(["GroupNode","GenericGroupNode"]),Zu={rectangle:"rectangle",rectangle3d:"rectangle",roundrectangle:"rectangle",parallelogram:"rectangle",ellipse:"circle",diamond:"diamond",hexagon:"hexagon",octagon:"hexagon",triangle:"triangle",trapezoid:"triangle",trapezoid2:"triangle",fatarrow:"triangle",fatarrow2:"triangle"},bi=i=>i?(i.text+i.children.map(t=>bi(t)).join("")).trim():"",Nn=i=>t=>Ei(t)===i;function Ku(i,t){return t==="boolean"?i.trim().toLowerCase()==="true":["int","long","float","double"].includes(t)?be(i)??i:i}function zo(i){return Math.round(i*100)/100}function Ju(i,t={}){const e=Yu(i);if(Ei(e)!=="graphml")throw new Error("Not a GraphML document (missing <graphml> root)");const n=t.scale??.5,s=new Map;for(const f of Is(e,"key"))s.set(f.attrs.id,{id:f.attrs.id,name:f.attrs["attr.name"]??"",type:f.attrs["attr.type"]??"string",target:f.attrs.for??"all",yType:f.attrs["yfiles.type"]});const r=Is(e,"graph")[0];if(!r)throw new Error("GraphML document contains no <graph>");const o=new ar;o.directed=r.attrs.edgedefault==="directed";const a=[],l=(f,g)=>{for(const _ of f.children){const m=Ei(_);if(m==="node"){const p=o.addNode(_.attrs.id,{group:g});h(_,p);const x=Is(_,"graph")[0];if(x){const y=p.label?.split(`
`)[0]||p.id;p.tags?.includes("group")||(p.tags=[...p.tags??[],"group"]),l(x,y)}}else m==="edge"?a.push(_):m==="hyperedge"&&o.warnings.push("Hyperedges are not supported and were skipped")}},c=(f,g,_,m)=>{const p=g.name.toLowerCase(),x=_.trim(),y=f;switch(p){case"label":y.label===void 0&&x&&(y.label=x);return;case"url":case"href":case"link":x&&(y.url=x);return;case"color":x&&(y.color=x);return;case"group":x&&(y.group=x);return;case"sublabel":m&&x&&(y.sublabel=x);return;case"weight":case"value":m||(y.weight=be(x));return;case"x":case"y":case"z":case"size":{const v=be(x);m&&v!==void 0&&(y[p]=v);return}case"shape":m&&Mo.includes(x)&&(y.shape=x);return;case"directed":m||(y.directed=Oi(x));return;default:g.name&&x!==""&&((f.props??={})[g.name]=Ku(x,g.type))}},h=(f,g)=>{for(const _ of Is(f,"data")){const m=s.get(_.attrs.key);m&&(m.yType==="nodegraphics"?d(_,g):c(g,m,bi(_),!0))}},d=(f,g)=>{const _=sn(f,E=>qu.has(Ei(E)));if(!_)return;const m=Ei(_),p=sn(_,Nn("Geometry"));let x="rectangle";if(p){const E=be(p.attrs.width)??30,A=be(p.attrs.height)??30,P=be(p.attrs.x)??0,S=be(p.attrs.y)??0;g.x=zo((P+E/2)*n),g.y=zo(-(S+A/2)*n),pc.has(m)||(g.size=zo(Math.max(Math.min(E,A),1)*n))}const y=sn(_,Nn("Fill"));if(y&&y.attrs.transparent!=="true"){const E=Zs(y.attrs.color);E&&(g.color=E)}const v=sn(_,Nn("Shape"));v?.attrs.type&&(x=Zu[v.attrs.type.toLowerCase()]??x),g.shape=x;const T=bi(sn(_,Nn("NodeLabel")));if(T&&(g.label=T),m==="UMLClassNode"){g.shape="card";const E=bi(sn(_,Nn("AttributeLabel"))),A=bi(sn(_,Nn("MethodLabel"))),P=[];E&&P.push(...E.split(/\r?\n/)),(E||A)&&P.push("---"),A&&P.push(...A.split(/\r?\n/)),g.body=P}else pc.has(m)&&(g.shape="rectangle",g.tags=[...g.tags??[],"group"])},u=f=>{let g=f.attrs.source,_=f.attrs.target;(!o.hasNode(g)||!o.hasNode(_))&&o.warnings.push(`Edge ${g} -> ${_} references an undeclared node; it was created`);const m={id:f.attrs.id};let x=Oi(f.attrs.directed);const y={id:"",source:g,target:_};for(const E of Is(f,"data")){const A=s.get(E.attrs.key);if(A)if(A.yType==="edgegraphics"){const P=sn(E,z=>ju.has(Ei(z)));if(!P)continue;const S=sn(P,Nn("Arrows"));if(S){const z=(S.attrs.source??"none")!=="none",D=(S.attrs.target??"none")!=="none";z&&!D?([g,_]=[_,g],x=!0):x=D&&!z}const M=sn(P,Nn("LineStyle"));if(M){const z=Zs(M.attrs.color);z&&z!=="#000000"&&(y.color=z),/dash|dot/i.test(M.attrs.type??"")&&(y.dashed=!0);const D=be(M.attrs.width);D!==void 0&&Math.abs(D-1)>.01&&(y.width=Math.min(8,Math.max(.5,D)))}const L=bi(sn(P,Nn("EdgeLabel")));L&&(y.label=L)}else c(y,A,bi(E),!1)}t.numericLabelsAsWeights&&y.label!==void 0&&y.weight===void 0&&/^-?\d+(\.\d+)?$/.test(y.label)&&(y.weight=Number(y.label),delete y.label);const v=o.addEdge(g,_,{...y,id:m.id,directed:void 0}),T=x??o.directed;T!==o.directed&&(v.directed=T)};l(r);for(const f of a)u(f);return{graph:o.build(),warnings:o.warnings,format:"graphml"}}const Qu={circle:"ellipse",square:"rectangle",rectangle:"rectangle",diamond:"diamond",hexagon:"hexagon",triangle:"triangle",card:"rectangle"};function tf(i,t={}){const e=t.scale??.5,n=t.defaultSize??14,s=[],r=(h,d,u)=>{let f=s.find(g=>g.target===h&&g.name===d);return f||(f={id:`k${s.length+2}`,target:h,name:d,type:u},s.push(f)),f.id},o=h=>typeof h=="number"?"double":typeof h=="boolean"?"boolean":"string",a=[];for(const h of i.nodes){const d=h.size??n,u=h.shape??"circle",f=(u==="rectangle"?d*1.6:u==="card"?Math.max(d*3,60):d)/e,g=(u==="card"?Math.max(d*3,40):d)/e,_=(h.x??0)/e-f/2,m=-(h.y??0)/e-g/2,p=Zs(h.color)??"#CCCCFF",x=Ce(h.label??h.id);let y;if(u==="card"){const T=(h.body??[]).indexOf("---"),E=(T<0?h.body??[]:(h.body??[]).slice(0,T)).join(`
`),A=T<0?"":(h.body??[]).slice(T+1).join(`
`);y=`<y:UMLClassNode><y:Geometry height="${g}" width="${f}" x="${_}" y="${m}"/><y:Fill color="${p}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${x}</y:NodeLabel><y:UML clipContent="true" omitDetails="false" stereotype="" use3DEffect="false"><y:AttributeLabel>${Ce(E)}</y:AttributeLabel><y:MethodLabel>${Ce(A)}</y:MethodLabel></y:UML></y:UMLClassNode>`}else y=`<y:ShapeNode><y:Geometry height="${g}" width="${f}" x="${_}" y="${m}"/><y:Fill color="${p}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${x}</y:NodeLabel><y:Shape type="${Qu[u]}"/></y:ShapeNode>`;const v=[`<data key="d0">${y}</data>`];h.url&&v.push(`<data key="${r("node","url","string")}">${Ce(h.url)}</data>`),h.group&&v.push(`<data key="${r("node","group","string")}">${Ce(h.group)}</data>`),h.sublabel&&v.push(`<data key="${r("node","sublabel","string")}">${Ce(h.sublabel)}</data>`),h.z!==void 0&&v.push(`<data key="${r("node","z","double")}">${h.z}</data>`),h.color&&!Zs(h.color)&&v.push(`<data key="${r("node","color","string")}">${Ce(h.color)}</data>`);for(const[T,E]of Object.entries(h.props??{}))v.push(`<data key="${r("node",T,o(E))}">${Ce(String(E))}</data>`);a.push(`    <node id="${Ce(h.id)}">
      ${v.join(`
      `)}
    </node>`)}const l=[];for(const h of i.edges){const d=h.directed??i.directed,u=Zs(h.color)??"#000000",f=h.label?`<y:EdgeLabel>${Ce(h.label)}</y:EdgeLabel>`:"",_=[`<data key="d1">${`<y:PolyLineEdge><y:Path sx="0.0" sy="0.0" tx="0.0" ty="0.0"/><y:LineStyle color="${u}" type="${h.dashed?"dashed":"line"}" width="${h.width??1}"/><y:Arrows source="none" target="${d?"standard":"none"}"/>${f}</y:PolyLineEdge>`}</data>`];h.weight!==void 0&&_.push(`<data key="${r("edge","weight","double")}">${h.weight}</data>`),h.url&&_.push(`<data key="${r("edge","url","string")}">${Ce(h.url)}</data>`),h.group&&_.push(`<data key="${r("edge","group","string")}">${Ce(h.group)}</data>`);for(const[m,p]of Object.entries(h.props??{}))_.push(`<data key="${r("edge",m,o(p))}">${Ce(String(p))}</data>`);l.push(`    <edge id="${Ce(h.id)}" source="${Ce(h.source)}" target="${Ce(h.target)}">
      ${_.join(`
      `)}
    </edge>`)}return`<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:y="http://www.yworks.com/xml/graphml" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd">
${['  <key for="node" id="d0" yfiles.type="nodegraphics"/>','  <key for="edge" id="d1" yfiles.type="edgegraphics"/>',...s.map(h=>`  <key attr.name="${Ce(h.name)}" attr.type="${h.type}" for="${h.target}" id="${h.id}"/>`)].join(`
`)}
  <graph id="G" edgedefault="${i.directed?"directed":"undirected"}">
${a.join(`
`)}
${l.join(`
`)}
  </graph>
</graphml>
`}const Sn=i=>typeof i=="object"&&i!==null&&!Array.isArray(i),De=i=>i==null?void 0:String(i),ef=new Set(["id","name","key","index","vx","vy","vz","fx","fy","fz","source","target","from","to","value","w"]);function od(i,t){const e={};for(const[n,s]of Object.entries(i))t.has(n)||ef.has(n)||(typeof s=="string"||typeof s=="number"||typeof s=="boolean")&&(e[n]=s);return Object.keys(e).length?e:void 0}const nf=new Set(["label","sublabel","x","y","z","group","tags","url","color","shape","size","body","pinned","props"]),sf=new Set(["weight","directed","label","url","color","width","dashed","group","props"]);function rf(i){const t=De(i.shape);return{label:De(i.label??i.name),sublabel:De(i.sublabel),x:be(i.x),y:be(i.y),z:be(i.z),group:De(i.group),tags:Array.isArray(i.tags)?i.tags.map(String):void 0,url:De(i.url),color:De(i.color),shape:t&&Mo.includes(t)?t:void 0,size:be(i.size),body:Array.isArray(i.body)?i.body.map(String):void 0,pinned:Oi(i.pinned),props:Sn(i.props)?i.props:od(i,nf)}}function of(i){return{id:De(i.id),weight:be(i.weight??i.value??i.w),directed:Oi(i.directed),label:De(i.label),url:De(i.url),color:De(i.color),width:be(i.width),dashed:Oi(i.dashed),group:De(i.group),props:Sn(i.props)?i.props:od(i,sf)}}function af(i){const t=JSON.parse(i);if(!Sn(t))throw new Error("JSON graph must be an object");const e=new ar;let n=[],s=[];if(Sn(t.elements)){const a=l=>Array.isArray(l)?l.map(c=>Sn(c)&&Sn(c.data)?c.data:c):[];n=a(t.elements.nodes),s=a(t.elements.edges)}else n=Array.isArray(t.nodes)?t.nodes:[],s=Array.isArray(t.edges)?t.edges:Array.isArray(t.links)?t.links:[];if(e.directed=Oi(t.directed)??!1,Sn(t.meta)){const a=De(t.meta.dimension);e.meta={title:De(t.meta.title),description:De(t.meta.description),dimension:a==="3d"?"3d":a==="2d"?"2d":void 0}}const r=[];n.forEach((a,l)=>{const c=Sn(a)?a:{id:a},h=De(c.id??c.name??c.key)??`n${l+1}`;r.push(h),e.addNode(h,rf(c))});const o=a=>Sn(a)?De(a.id??a.name??a.key):typeof a=="number"&&!e.hasNode(String(a))&&r[a]!==void 0?r[a]:De(a);for(const a of s){if(!Sn(a))continue;const l=o(a.source??a.from),c=o(a.target??a.to);if(l===void 0||c===void 0){e.warnings.push("Skipped an edge without source or target");continue}(!e.hasNode(l)||!e.hasNode(c))&&e.warnings.push(`Edge ${l} -> ${c} referenced unknown nodes; they were created`),e.addEdge(l,c,of(a))}return{graph:e.build(),warnings:e.warnings,format:"json"}}function lf(i){return JSON.stringify({format:"graphscape",version:1,...i},null,2)}const vs=[{id:"json",label:"Graphscape JSON (also D3 / Cytoscape)",extensions:["json"],mime:"application/json"},{id:"graphml",label:"GraphML (yEd)",extensions:["graphml","xml"],mime:"application/xml"},{id:"gml",label:"GML",extensions:["gml"],mime:"text/plain"},{id:"dot",label:"Graphviz DOT",extensions:["dot","gv"],mime:"text/vnd.graphviz"},{id:"csv",label:"CSV edge list",extensions:["csv","tsv","txt"],mime:"text/csv"}];function ad(i,t){const e=t?.split(/[?#]/)[0].split(".").pop()?.toLowerCase();if(e){for(const s of vs)if(s.id!=="csv"&&s.extensions.includes(e))return s.id}const n=i.replace(/^\uFEFF/,"").trimStart();return n.startsWith("{")||n.startsWith("[")?"json":/^<\?xml|^<graphml/i.test(n)||/<graphml[\s>]/i.test(n.slice(0,2e3))?"graphml":/(^|\n)\s*graph\s*\[/.test(n.replace(/^\s*#.*$/gm,""))?"gml":/^(strict\s+)?(di)?graph\b[^[{]*\{/i.test(n.replace(/^(\s*(\/\/.*|#.*|\/\*[\s\S]*?\*\/)\s*)+/,""))?"dot":"csv"}function ld(i,t={}){const e=t.format??ad(i,t.filename),n=i.replace(/^\uFEFF/,"");switch(e){case"json":return af(n);case"graphml":return Ju(n,{scale:t.scale,numericLabelsAsWeights:t.numericLabelsAsWeights});case"gml":return Wu(n);case"dot":return zu(n);case"csv":return Iu(n,t.directed??!1)}}function cf(i,t){switch(t){case"json":return lf(i);case"graphml":return tf(i);case"gml":return Xu(i);case"dot":return Bu(i);case"csv":return Uu(i)}}function hf(i){return i==="circle"||i==="diamond"||i==="hexagon"||i==="triangle"}function cd(i,t,e,n){const s=t/2;return{hw:i==="rectangle"?s*e:s,hh:s}}function mc(i,t,e){const n=i[0]-t.pos[0],s=i[1]-t.pos[1];if(e){const r=i[2]-t.pos[2];return n*n+s*s+r*r<t.hw*t.hw}return t.ellipse?n*n/(t.hw*t.hw)+s*s/(t.hh*t.hh)<1:Math.abs(n)<t.hw&&Math.abs(s)<t.hh}const Al=(i,t,e)=>[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e],er=(i,t)=>Math.hypot(i[0]-t[0],i[1]-t[1],i[2]-t[2]);function df(i,t,e,n){const s=[];for(let r=0;r<=n;r++){const o=r/n,a=1-o;s.push([a*a*i[0]+2*a*o*t[0]+o*o*e[0],a*a*i[1]+2*a*o*t[1]+o*o*e[1],a*a*i[2]+2*a*o*t[2]+o*o*e[2]])}return s}function uf(i,t,e){let n=[t,-i,0],s=Math.hypot(n[0],n[1],n[2]);return s<1e-9&&(n=[-e,0,i],s=Math.hypot(n[0],n[1],n[2])),s<1e-9?[0,1,0]:[n[0]/s,n[1]/s,n[2]/s]}function ff(i,t,e){const n=Math.max(i.hw,i.hh),s=n*e.loopScale*(1+.5*t),r=t*(Math.PI/3),o=n+s*.35,a=i.pos[0]-Math.sin(r)*o,l=i.pos[1]+Math.cos(r)*o,c=r-Math.PI/2,h=.35,d=Math.max(12,e.segments*2),u=[];for(let f=0;f<=d;f++){const g=c+h+f/d*(2*Math.PI-2*h);u.push([a+s*Math.cos(g),l+s*Math.sin(g),i.pos[2]])}return u}function hd(i,t,e){let n=0;for(;n<i.length&&mc(i[n],t,e);)n++;if(n===0||n>=i.length)return i;let s=i[n-1],r=i[n];for(let o=0;o<18;o++){const a=Al(s,r,.5);mc(a,t,e)?s=a:r=a}return[r,...i.slice(n)]}function pf(i,t,e){return hd([...i].reverse(),t,e).reverse()}function mf(i,t,e,n,s,r,o){let a;if(r)a=ff(i,e,o);else{const l=(e-(n-1)/2)*o.spacing*(s?-1:1);if(Math.abs(l)<1e-6)a=[i.pos,t.pos];else{const c=t.pos[0]-i.pos[0],h=t.pos[1]-i.pos[1],d=o.dim3?t.pos[2]-i.pos[2]:0,u=uf(c,h,d),f=[(i.pos[0]+t.pos[0])/2,(i.pos[1]+t.pos[1])/2,(i.pos[2]+t.pos[2])/2],g=[f[0]+u[0]*2*l,f[1]+u[1]*2*l,f[2]+u[2]*2*l];a=df(i.pos,g,t.pos,o.segments)}}return a=hd(a,i,o.dim3),a=pf(a,t,o.dim3),a}function dd(i){let t=0;for(let e=1;e<i.length;e++)t+=er(i[e-1],i[e]);return t}function gf(i,t){if(i.length<2||dd(i)<=t*1.2)return i;const e=i.slice();let n=t;for(;e.length>=2;){const s=e[e.length-2],r=e[e.length-1],o=er(s,r);if(o>n+1e-9)return e[e.length-1]=Al(s,r,(o-n)/o),e;n-=o,e.pop()}return i}function ko(i,t){const e=dd(i);if(e===0)return i[0];let n=e*t;for(let s=1;s<i.length;s++){const r=er(i[s-1],i[s]);if(n<=r)return Al(i[s-1],i[s],r===0?0:n/r);n-=r}return i[i.length-1]}function _f(i){const t=i[i.length-1];let e=i.length-2;for(;e>0&&er(i[e],t)<1e-6;)e--;const n=i[Math.max(0,e)],s=er(n,t)||1;return{tip:t,dir:[(t[0]-n[0])/s,(t[1]-n[1])/s,(t[2]-n[2])/s]}}function vf(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a;let c=l===0?0:((i-e)*o+(t-n)*a)/l;return c=Math.max(0,Math.min(1,c)),Math.hypot(i-(e+c*o),t-(n+c*a))}const xf=.58,yf=1.25;function fr(i,t,e){const n=i.split(`
`).map(s=>Math.min(s.length,e));return{w:Math.max(0,...n)*t*xf,h:n.length*t*yf}}function An(i,t){return i.boxes?.get(t)??{w:i.spacing,h:i.spacing}}function Mf(i,t,e=!1){const n=Ra(i),s=t.label.show&&i.nodes.length<=t.label.maxCount,r=new Map;for(const o of i.nodes){const a=Pa(o,t,n);if(a.shape==="card"){const d=fr(o.label??o.id,t.card.size,80),u=fr((o.body??[]).join(`
`),t.card.size,80),f=t.card.padding;r.set(o.id,{w:Math.max(d.w,u.w)+f*3,h:(d.h+u.h)*1.12+f*3});continue}const l=cd(a.shape,a.size,t.node.aspect);let c=l.hw*2,h=l.hh*2;if(s){const d=fr(o.label??o.id,t.label.size,t.label.maxChars),u=o.sublabel?fr(o.sublabel,t.label.subSize,t.label.maxChars):{w:0,h:0};c=Math.max(c,d.w,u.w),h+=t.label.gap+d.h+u.h}r.set(o.id,{w:c,h})}return r}class ud{ids;pos;temperature;t0;n;k;dim3;disp;fixed;ea;eb;es;index=new Map;rnd;gravity;constructor(t,e){const n=t.nodes;this.n=n.length,this.k=e.idealLength,this.dim3=e.dimension==="3d",this.gravity=e.gravity,this.rnd=bo(e.seed),this.ids=n.map(l=>l.id),this.pos=new Float64Array(this.n*3),this.disp=new Float64Array(this.n*3),this.fixed=new Uint8Array(this.n);const s=this.k*(this.dim3?Math.cbrt(this.n):Math.sqrt(this.n))*.6+this.k;n.forEach((l,c)=>{this.index.set(l.id,c),this.pos[3*c]=l.x??(this.rnd()*2-1)*s,this.pos[3*c+1]=l.y??(this.rnd()*2-1)*s,this.pos[3*c+2]=this.dim3?l.z??(this.rnd()*2-1)*s:l.z??0,l.pinned&&(this.fixed[c]=1)});const r=t.edges.filter(l=>l.source!==l.target);this.ea=new Int32Array(r.length),this.eb=new Int32Array(r.length),this.es=new Float64Array(r.length);const o=r.map(l=>t.weightOf(l)).filter(l=>l>0).sort((l,c)=>l-c),a=o.length?o[Math.floor(o.length/2)]:1;r.forEach((l,c)=>{this.ea[c]=this.index.get(l.source),this.eb[c]=this.index.get(l.target);const h=Math.max(t.weightOf(l),1e-6),d=e.weightMode==="closer"?a/h:e.weightMode==="longer"?h/a:1,u=Math.min(4,Math.max(.25,d));this.es[c]=1/(u*u*u)}),this.t0=this.k*2,this.temperature=this.t0}get alpha(){return this.temperature/this.t0}pin(t,e){const n=this.index.get(t);n!==void 0&&(this.pos[3*n]=e[0],this.pos[3*n+1]=e[1],this.dim3&&(this.pos[3*n+2]=e[2]),this.fixed[n]=1)}unpin(t,e=!1){const n=this.index.get(t);n!==void 0&&!e&&(this.fixed[n]=0)}step(){const{n:t,k:e,dim3:n,pos:s,disp:r}=this,o=e*e;r.fill(0);const a=(c,h,d)=>{let u=s[3*c]-s[3*h],f=s[3*c+1]-s[3*h+1],g=n?s[3*c+2]-s[3*h+2]:0,_=u*u+f*f+g*g;if(_>d)return;_<1e-6&&(u=(this.rnd()-.5)*.1,f=(this.rnd()-.5)*.1,g=n?(this.rnd()-.5)*.1:0,_=u*u+f*f+g*g+1e-6);const m=o/_;r[3*c]+=u*m,r[3*c+1]+=f*m,r[3*c+2]+=g*m,r[3*h]-=u*m,r[3*h+1]-=f*m,r[3*h+2]-=g*m};if(t<=400)for(let c=0;c<t;c++)for(let h=c+1;h<t;h++)a(c,h,1/0);else{const c=e*4,h=c*c,d=x=>Math.max(-1e3,Math.min(1e3,Math.floor(x/c))),u=(x,y,v)=>((x+1024)*2048+(y+1024))*2048+(v+1024),f=new Map,g=new Int16Array(t),_=new Int16Array(t),m=new Int16Array(t);for(let x=0;x<t;x++){g[x]=d(s[3*x]),_[x]=d(s[3*x+1]),m[x]=n?d(s[3*x+2]):0;const y=u(g[x],_[x],m[x]),v=f.get(y);v?v.push(x):f.set(y,[x])}const p=n?1:0;for(let x=0;x<t;x++)for(let y=-1;y<=1;y++)for(let v=-1;v<=1;v++)for(let T=-p;T<=p;T++){const E=f.get(u(g[x]+y,_[x]+v,m[x]+T));if(E)for(const A of E)A>x&&a(x,A,h)}}for(let c=0;c<this.ea.length;c++){const h=this.ea[c],d=this.eb[c],u=s[3*h]-s[3*d],f=s[3*h+1]-s[3*d+1],g=n?s[3*h+2]-s[3*d+2]:0,m=Math.sqrt(u*u+f*f+g*g)/e*this.es[c];r[3*h]-=u*m,r[3*h+1]-=f*m,r[3*h+2]-=g*m,r[3*d]+=u*m,r[3*d+1]+=f*m,r[3*d+2]+=g*m}const l=this.temperature;for(let c=0;c<t;c++){if(this.fixed[c])continue;r[3*c]-=s[3*c]*this.gravity,r[3*c+1]-=s[3*c+1]*this.gravity,n&&(r[3*c+2]-=s[3*c+2]*this.gravity);const h=n?r[3*c+2]:0,d=Math.sqrt(r[3*c]**2+r[3*c+1]**2+h*h);if(d<1e-9)continue;const u=Math.min(d,l)/d;s[3*c]+=r[3*c]*u,s[3*c+1]+=r[3*c+1]*u,n&&(s[3*c+2]+=h*u)}this.temperature=Math.max(this.temperature*.985,this.t0*.002)}entries(){return this.ids.map((t,e)=>[t,[this.pos[3*e],this.pos[3*e+1],this.dim3?this.pos[3*e+2]:0]])}commit(t){t.setPositions(this.entries())}}function bf(i,t){const e=i.nodes.map(T=>T.id),n=new Map(e.map((T,E)=>[T,E])),s=e.length,r=Array.from({length:s},()=>[]);for(const T of i.edges){const E=n.get(T.source),A=n.get(T.target);E!==A&&r[E].push(A)}const o=new Uint8Array(s),a=Array.from({length:s},()=>[]),l=[];for(let T=0;T<s;T++){if(o[T])continue;const E=[[T,0]];for(o[T]=1,l.push(T);E.length;){const A=E[E.length-1],P=A[0];if(A[1]<r[P].length){const S=r[P][A[1]++];o[S]===0?(o[S]=1,l.push(S),a[P].push(S),E.push([S,0])):o[S]===1?a[S].push(P):a[P].push(S)}else o[P]=2,E.pop()}}const c=new Int32Array(s);for(let T=0;T<s;T++)for(const E of a[T])c[E]++;const h=new Int32Array(s),d=[];for(let T=0;T<s;T++)c[T]===0&&d.push(T);for(let T=0;T<d.length;T++){const E=d[T];for(const A of a[E])h[A]=Math.max(h[A],h[E]+1),--c[A]===0&&d.push(A)}const u=[];for(const T of l)(u[h[T]]??=[]).push(T);const f=Array.from({length:s},()=>[]);for(let T=0;T<s;T++)for(const E of a[T])f[E].push(T);const g=new Float64Array(s);u.forEach(T=>T?.forEach((E,A)=>g[E]=A));for(let T=0;T<8;T++){const E=T%2===0,A=u.map((P,S)=>S);E||A.reverse();for(const P of A.slice(1)){const S=u[P];if(!S)continue;const M=new Map;for(const L of S){const z=E?f[L]:a[L];M.set(L,z.length?z.reduce((D,F)=>D+g[F],0)/z.length:g[L])}S.sort((L,z)=>M.get(L)-M.get(z)),S.forEach((L,z)=>g[L]=z)}}const _=t.direction==="TB",m=T=>_?An(t,T).w:An(t,T).h,p=T=>_?An(t,T).h:An(t,T).w,x=new Map;let y=0,v=0;return u.forEach((T,E)=>{if(!T)return;const A=Math.max(...T.map(M=>p(e[M])));y+=E===0?A/2:v/2+t.gap*2.2+A/2,v=A;let S=-(T.reduce((M,L)=>M+m(e[L]),0)+t.gap*(T.length-1))/2;for(const M of T){const L=m(e[M]),z=S+L/2;S+=L+t.gap,x.set(e[M],_?[z,-y,0]:[y,-z,0])}}),x}function Cl(i){const t=new Map;for(const e of i.nodes)e.group!==void 0&&!t.has(e.group)&&t.set(e.group,t.size);return i.nodes.map((e,n)=>({id:e.id,g:e.group===void 0?-1:t.get(e.group),i:n})).sort((e,n)=>e.g-n.g||e.i-n.i).map(e=>e.id)}function Rl(i,t){const e=An(i,t);return Math.hypot(e.w,e.h)*.75+i.gap}function Sf(i,t){const e=Cl(i),n=e.map(l=>Rl(t,l)),s=n.reduce((l,c)=>l+c,0)||1,r=Math.max(s/(2*Math.PI),Math.max(0,...n)*.5||1),o=new Map;let a=0;return e.forEach((l,c)=>{const h=(a+n[c]/2)/s*Math.PI*2-Math.PI/2;a+=n[c],o.set(l,[r*Math.cos(h),r*Math.sin(h),0])}),o}function wf(i,t){const e=Cl(i),n=e.length;let s=0,r=0;for(const u of e){const f=An(t,u);s=Math.max(s,f.w),r=Math.max(r,f.h)}s+=t.gap,r+=t.gap;const o=!!t.dim3,a=o?Math.max(1,Math.ceil(Math.cbrt(n))):Math.max(1,Math.round(Math.sqrt(n*r/s))),l=o?a:Math.ceil(n/a),c=o?Math.ceil(n/(a*l)):1,h=Math.max(s,r),d=new Map;return e.forEach((u,f)=>{const g=f%a,_=Math.floor(f/a)%l,m=o?Math.floor(f/(a*l)):0;d.set(u,[(g-(a-1)/2)*s,((l-1)/2-_)*r,o?(m-(c-1)/2)*h:0])}),d}function Ef(i,t){const e=Cl(i),n=e.length,s=e.reduce((l,c)=>l+Rl(t,c),0)/Math.max(n,1)||1,r=Math.max(s,s*Math.sqrt(n/(4*Math.PI))*1.1),o=Math.PI*(3-Math.sqrt(5)),a=new Map;return e.forEach((l,c)=>{const h=n===1?0:1-c/(n-1)*2,d=Math.sqrt(Math.max(0,1-h*h)),u=o*c;a.set(l,[Math.cos(u)*d*r,h*r,Math.sin(u)*d*r])}),a}function Tf(i,t){const e=bo(t.seed??1),n=i.nodes.map(a=>a.id),r=(n.reduce((a,l)=>a+Rl(t,l),0)/Math.max(n.length,1)||1)*Math.sqrt(n.length)*.9,o=new Map;for(const a of n)o.set(a,[(e()*2-1)*r,(e()*2-1)*r,t.dim3?(e()*2-1)*r:0]);return o}function Af(i,t){const e=i.nodes.map(D=>D.id),n=e.length,s=new Map;if(n===0)return s;const r=new Map(e.map((D,F)=>[D,F])),o=Array.from({length:n},()=>[]),a=new Int32Array(n),l=new Int32Array(n);for(const D of i.edges){const F=r.get(D.source),k=r.get(D.target);F!==k&&(l[F]++,l[k]++,o[F].push(k),i.isDirected(D)?a[k]++:o[k].push(F))}const c=new Int32Array(n).fill(-1),h=new Int32Array(n).fill(-1),d=Array.from({length:n},()=>[]),u=[],f=D=>{u.push(D),h[D]=0;const F=[D];for(let k=0;k<F.length;k++){const H=F[k];for(const X of o[H])h[X]===-1&&(h[X]=h[H]+1,c[X]=H,d[H].push(X),F.push(X))}},g=[...Array(n).keys()].filter(D=>a[D]===0);a.some(D=>D>0)||g.sort((D,F)=>l[F]-l[D]||D-F);for(const D of g)h[D]===-1&&f(D);const _=D=>{const F=new Map([[D,0]]),k=[D];let H=0;for(let X=0;X<k.length;X++){const W=k[X];for(const Q of o[W])h[Q]!==-1||F.has(Q)||(F.set(Q,F.get(W)+1),H=Math.max(H,F.get(Q)),k.push(Q))}return{reach:k.length,height:H}};for(;;){const D=[...Array(n).keys()].filter(H=>h[H]===-1).sort((H,X)=>l[X]-l[H]||H-X);if(!D.length)break;let F=D[0],k={reach:-1,height:0};for(const H of D.slice(0,8)){const X=_(H);(X.reach>k.reach||X.reach===k.reach&&X.height<k.height)&&(F=H,k=X)}f(F)}const m=t.direction==="TB",p=D=>m?An(t,e[D]).w:An(t,e[D]).h,x=D=>m?An(t,e[D]).h:An(t,e[D]).w,y=[];for(const D of u){const F=[D];for(;F.length;){const k=F.pop();y.push(k);for(let H=d[k].length-1;H>=0;H--)F.push(d[k][H])}}const v=new Float64Array(n);for(let D=y.length-1;D>=0;D--){const F=y[D],k=d[F],H=k.reduce((X,W)=>X+v[W],0)+t.gap*Math.max(0,k.length-1);v[F]=Math.max(p(F),H)}const T=new Float64Array(n);let E=0;for(const D of u)T[D]=E,E+=v[D]+t.gap*2;const A=E-t.gap*2;for(const D of y){const F=d[D];if(!F.length)continue;const k=F.reduce((X,W)=>X+v[W],0)+t.gap*(F.length-1);let H=T[D]+(v[D]-k)/2;for(const X of F)T[X]=H,H+=v[X]+t.gap}const P=new Float64Array(n);for(let D=y.length-1;D>=0;D--){const F=y[D],k=d[F];P[F]=k.length?(P[k[0]]+P[k[k.length-1]])/2:T[F]+v[F]/2}const S=Math.max(...Array.from(h)),M=new Float64Array(S+1);for(let D=0;D<n;D++)M[h[D]]=Math.max(M[h[D]],x(D));const L=new Float64Array(S+1);let z=0;for(let D=0;D<=S;D++)z+=D===0?M[0]/2:M[D-1]/2+t.gap*2.2+M[D]/2,L[D]=z;for(let D=0;D<n;D++){const F=P[D]-A/2;s.set(e[D],m?[F,-L[h[D]],0]:[L[h[D]],-F,0])}return s}const fd={dimension:"2d",spacing:40,gap:12,idealLength:60,gravity:.05,weightMode:"ignore",direction:"TB",seed:1,iterations:300},Cf=["force","tree","layered","circle","grid","sphere","random"];function Rf(i,t,e={}){const n={...fd,...e},s={spacing:n.spacing,gap:n.gap,boxes:n.boxes,dim3:n.dimension==="3d",seed:n.seed};switch(t){case"circle":return Sf(i,s);case"grid":return wf(i,s);case"sphere":return Ef(i,s);case"random":return Tf(i,s);case"layered":return bf(i,{...s,direction:n.direction});case"tree":return Af(i,{...s,direction:n.direction});case"force":{const r=new ud(i,n);for(let o=0;o<n.iterations&&r.alpha>.02;o++)r.step();return new Map(r.entries())}}}function gc(i,t,e,n){const s=bo(n),r=t==="3d",o=c=>c.x!==void 0&&c.y!==void 0,a=e*Math.sqrt(Math.max(i.nodes.length,1))*.6+e;let l=0;for(const c of i.nodes){if(o(c)){c.z===void 0&&(c.z=0);continue}let h;for(const u of i.edges){const f=u.source===c.id?i.getNode(u.target):u.target===c.id?i.getNode(u.source):void 0;if(f&&f!==c&&o(f)){h={x:f.x,y:f.y,z:f.z??0};break}}const d=h?e*.6:a;c.x=(h?.x??0)+(s()*2-1)*d,c.y=(h?.y??0)+(s()*2-1)*d,c.z=r?(h?.z??0)+(s()*2-1)*d:h?.z??0,l++}return l}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pl="170",Te={ROTATE:0,DOLLY:1,PAN:2},Cn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Pf=0,_c=1,Lf=2,pd=1,Df=2,Hn=3,Yn=0,He=1,En=2,ci=0,ms=1,vc=2,xc=3,yc=4,If=5,Ti=100,Uf=101,Nf=102,Of=103,Ff=104,zf=200,kf=201,Bf=202,Hf=203,La=204,Da=205,Gf=206,Vf=207,Wf=208,Xf=209,$f=210,Yf=211,qf=212,jf=213,Zf=214,Ia=0,Ua=1,Na=2,xs=3,Oa=4,Fa=5,za=6,ka=7,Ll=0,Kf=1,Jf=2,hi=0,Qf=1,tp=2,ep=3,np=4,ip=5,sp=6,rp=7,md=300,ys=301,Ms=302,Ba=303,Ha=304,So=306,Ga=1e3,Pi=1001,Va=1002,Ke=1003,op=1004,pr=1005,Rn=1006,Bo=1007,Li=1008,qn=1009,gd=1010,_d=1011,nr=1012,Dl=1013,Fi=1014,Pn=1015,lr=1016,Il=1017,Ul=1018,bs=1020,vd=35902,xd=1021,yd=1022,gn=1023,Md=1024,bd=1025,gs=1026,Ss=1027,Nl=1028,Ol=1029,Sd=1030,Fl=1031,zl=1033,so=33776,ro=33777,oo=33778,ao=33779,Wa=35840,Xa=35841,$a=35842,Ya=35843,qa=36196,ja=37492,Za=37496,Ka=37808,Ja=37809,Qa=37810,tl=37811,el=37812,nl=37813,il=37814,sl=37815,rl=37816,ol=37817,al=37818,ll=37819,cl=37820,hl=37821,lo=36492,dl=36494,ul=36495,wd=36283,fl=36284,pl=36285,ml=36286,ap=3200,lp=3201,Ed=0,cp=1,ai="",Ze="srgb",As="srgb-linear",wo="linear",te="srgb",Xi=7680,Mc=519,hp=512,dp=513,up=514,Td=515,fp=516,pp=517,mp=518,gp=519,gl=35044,bc=35048,Sc="300 es",Wn=2e3,uo=2001;class ki{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let wc=1234567;const Ks=Math.PI/180,ir=180/Math.PI;function Xn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Ie(i,t,e){return Math.max(t,Math.min(e,i))}function kl(i,t){return(i%t+t)%t}function _p(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function vp(i,t,e){return i!==t?(e-i)/(t-i):0}function Js(i,t,e){return(1-e)*i+e*t}function xp(i,t,e,n){return Js(i,t,1-Math.exp(-e*n))}function yp(i,t=1){return t-Math.abs(kl(i,t*2)-t)}function Mp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function bp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Sp(i,t){return i+Math.floor(Math.random()*(t-i+1))}function wp(i,t){return i+Math.random()*(t-i)}function Ep(i){return i*(.5-Math.random())}function Tp(i){i!==void 0&&(wc=i);let t=wc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ap(i){return i*Ks}function Cp(i){return i*ir}function Rp(i){return(i&i-1)===0&&i!==0}function Pp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Lp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Dp(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function mn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Qt(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ii={DEG2RAD:Ks,RAD2DEG:ir,generateUUID:Xn,clamp:Ie,euclideanModulo:kl,mapLinear:_p,inverseLerp:vp,lerp:Js,damp:xp,pingpong:yp,smoothstep:Mp,smootherstep:bp,randInt:Sp,randFloat:wp,randFloatSpread:Ep,seededRandom:Tp,degToRad:Ap,radToDeg:Cp,isPowerOfTwo:Rp,ceilPowerOfTwo:Pp,floorPowerOfTwo:Lp,setQuaternionFromProperEuler:Dp,normalize:Qt,denormalize:mn};class pt{constructor(t=0,e=0){pt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ut{constructor(t,e,n,s,r,o,a,l,c){Ut.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],x=s[1],y=s[4],v=s[7],T=s[2],E=s[5],A=s[8];return r[0]=o*_+a*x+l*T,r[3]=o*m+a*y+l*E,r[6]=o*p+a*v+l*A,r[1]=c*_+h*x+d*T,r[4]=c*m+h*y+d*E,r[7]=c*p+h*v+d*A,r[2]=u*_+f*x+g*T,r[5]=u*m+f*y+g*E,r[8]=u*p+f*v+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,g=e*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=d*_,t[1]=(s*c-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=u*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ho.makeScale(t,e)),this}rotate(t){return this.premultiply(Ho.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ho.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ho=new Ut;function Ad(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function fo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ip(){const i=fo("canvas");return i.style.display="block",i}const Ec={};function $s(i){i in Ec||(Ec[i]=!0,console.warn(i))}function Up(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Np(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Op(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Wt={enabled:!0,workingColorSpace:As,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===te&&(i.r=$n(i.r),i.g=$n(i.g),i.b=$n(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===te&&(i.r=_s(i.r),i.g=_s(i.g),i.b=_s(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ai?wo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function $n(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function _s(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Tc=[.64,.33,.3,.6,.15,.06],Ac=[.2126,.7152,.0722],Cc=[.3127,.329],Rc=new Ut().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pc=new Ut().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Wt.define({[As]:{primaries:Tc,whitePoint:Cc,transfer:wo,toXYZ:Rc,fromXYZ:Pc,luminanceCoefficients:Ac,workingColorSpaceConfig:{unpackColorSpace:Ze},outputColorSpaceConfig:{drawingBufferColorSpace:Ze}},[Ze]:{primaries:Tc,whitePoint:Cc,transfer:te,toXYZ:Rc,fromXYZ:Pc,luminanceCoefficients:Ac,outputColorSpaceConfig:{drawingBufferColorSpace:Ze}}});let $i;class Fp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{$i===void 0&&($i=fo("canvas")),$i.width=t.width,$i.height=t.height;const n=$i.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=$i}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=fo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=$n(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor($n(e[n]/255)*255):e[n]=$n(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let zp=0;class Cd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zp++}),this.uuid=Xn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Go(s[o].image)):r.push(Go(s[o]))}else r=Go(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Go(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Fp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let kp=0;class ze extends ki{constructor(t=ze.DEFAULT_IMAGE,e=ze.DEFAULT_MAPPING,n=Pi,s=Pi,r=Rn,o=Li,a=gn,l=qn,c=ze.DEFAULT_ANISOTROPY,h=ai){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kp++}),this.uuid=Xn(),this.name="",this.source=new Cd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==md)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ga:t.x=t.x-Math.floor(t.x);break;case Pi:t.x=t.x<0?0:1;break;case Va:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ga:t.y=t.y-Math.floor(t.y);break;case Pi:t.y=t.y<0?0:1;break;case Va:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=md;ze.DEFAULT_ANISOTROPY=1;class se{constructor(t=0,e=0,n=0,s=1){se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,v=(f+1)/2,T=(p+1)/2,E=(h+u)/4,A=(d+_)/4,P=(g+m)/4;return y>v&&y>T?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=E/n,r=A/n):v>T?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=E/s,r=P/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=A/r,s=P/r),this.set(n,s,r,e),this}let x=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(d-_)/x,this.z=(u-h)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Bp extends ki{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new ze(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Cd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zi extends Bp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Rd extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hp extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _e{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const u=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(d!==_||l!==u||c!==f||h!==g){let m=1-a;const p=l*u+c*f+h*g+d*_,x=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const T=Math.sqrt(y),E=Math.atan2(T,p*x);m=Math.sin(m*E)/T,a=Math.sin(a*E)/T}const v=a*x;if(l=l*m+u*v,c=c*m+f*v,h=h*m+g*v,d=d*m+_*v,m===1-a){const T=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=T,c*=T,h*=T,d*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*d+l*f-c*u,t[e+1]=l*g+h*u+c*d-a*f,t[e+2]=c*g+h*f+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Lc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Lc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Vo.copy(this).projectOnVector(t),this.sub(Vo)}reflect(t){return this.sub(Vo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Vo=new R,Lc=new _e;class Dn{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,hn):hn.fromBufferAttribute(r,o),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),mr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),mr.copy(n.boundingBox)),mr.applyMatrix4(t.matrixWorld),this.union(mr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Us),gr.subVectors(this.max,Us),Yi.subVectors(t.a,Us),qi.subVectors(t.b,Us),ji.subVectors(t.c,Us),Qn.subVectors(qi,Yi),ti.subVectors(ji,qi),mi.subVectors(Yi,ji);let e=[0,-Qn.z,Qn.y,0,-ti.z,ti.y,0,-mi.z,mi.y,Qn.z,0,-Qn.x,ti.z,0,-ti.x,mi.z,0,-mi.x,-Qn.y,Qn.x,0,-ti.y,ti.x,0,-mi.y,mi.x,0];return!Wo(e,Yi,qi,ji,gr)||(e=[1,0,0,0,1,0,0,0,1],!Wo(e,Yi,qi,ji,gr))?!1:(_r.crossVectors(Qn,ti),e=[_r.x,_r.y,_r.z],Wo(e,Yi,qi,ji,gr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(On[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),On[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),On[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),On[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),On[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),On[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),On[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),On[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(On),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const On=[new R,new R,new R,new R,new R,new R,new R,new R],hn=new R,mr=new Dn,Yi=new R,qi=new R,ji=new R,Qn=new R,ti=new R,mi=new R,Us=new R,gr=new R,_r=new R,gi=new R;function Wo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){gi.fromArray(i,r);const a=s.x*Math.abs(gi.x)+s.y*Math.abs(gi.y)+s.z*Math.abs(gi.z),l=t.dot(gi),c=e.dot(gi),h=n.dot(gi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Gp=new Dn,Ns=new R,Xo=new R;class di{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Gp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ns.subVectors(t,this.center);const e=Ns.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ns,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Xo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ns.copy(t.center).add(Xo)),this.expandByPoint(Ns.copy(t.center).sub(Xo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Fn=new R,$o=new R,vr=new R,ei=new R,Yo=new R,xr=new R,qo=new R;class Eo{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Fn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Fn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Fn.copy(this.origin).addScaledVector(this.direction,e),Fn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){$o.copy(t).add(e).multiplyScalar(.5),vr.copy(e).sub(t).normalize(),ei.copy(this.origin).sub($o);const r=t.distanceTo(e)*.5,o=-this.direction.dot(vr),a=ei.dot(this.direction),l=-ei.dot(vr),c=ei.lengthSq(),h=Math.abs(1-o*o);let d,u,f,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy($o).addScaledVector(vr,u),f}intersectSphere(t,e){Fn.subVectors(t.center,this.origin);const n=Fn.dot(this.direction),s=Fn.dot(Fn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Fn)!==null}intersectTriangle(t,e,n,s,r){Yo.subVectors(e,t),xr.subVectors(n,t),qo.crossVectors(Yo,xr);let o=this.direction.dot(qo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ei.subVectors(this.origin,t);const l=a*this.direction.dot(xr.crossVectors(ei,xr));if(l<0)return null;const c=a*this.direction.dot(Yo.cross(ei));if(c<0||l+c>o)return null;const h=-a*ei.dot(qo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $t{constructor(t,e,n,s,r,o,a,l,c,h,d,u,f,g,_,m){$t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,f,g,_,m)}set(t,e,n,s,r,o,a,l,c,h,d,u,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $t().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Zi.setFromMatrixColumn(t,0).length(),r=1/Zi.setFromMatrixColumn(t,1).length(),o=1/Zi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,f=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=u-_*c,e[9]=-a*l,e[2]=_-u*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,g=c*h,_=c*d;e[0]=u+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=_+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,g=c*h,_=c*d;e[0]=u-_*a,e[4]=-o*d,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=_-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,f=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=g*c-f,e[8]=u*c+_,e[1]=l*d,e[5]=_*c+u,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-u*d,e[8]=g*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+g,e[10]=u-_*d}else if(t.order==="XZY"){const u=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+_,e[5]=o*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=a*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Vp,t,Wp)}lookAt(t,e,n){const s=this.elements;return qe.subVectors(t,e),qe.lengthSq()===0&&(qe.z=1),qe.normalize(),ni.crossVectors(n,qe),ni.lengthSq()===0&&(Math.abs(n.z)===1?qe.x+=1e-4:qe.z+=1e-4,qe.normalize(),ni.crossVectors(n,qe)),ni.normalize(),yr.crossVectors(qe,ni),s[0]=ni.x,s[4]=yr.x,s[8]=qe.x,s[1]=ni.y,s[5]=yr.y,s[9]=qe.y,s[2]=ni.z,s[6]=yr.z,s[10]=qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],x=n[3],y=n[7],v=n[11],T=n[15],E=s[0],A=s[4],P=s[8],S=s[12],M=s[1],L=s[5],z=s[9],D=s[13],F=s[2],k=s[6],H=s[10],X=s[14],W=s[3],Q=s[7],ht=s[11],_t=s[15];return r[0]=o*E+a*M+l*F+c*W,r[4]=o*A+a*L+l*k+c*Q,r[8]=o*P+a*z+l*H+c*ht,r[12]=o*S+a*D+l*X+c*_t,r[1]=h*E+d*M+u*F+f*W,r[5]=h*A+d*L+u*k+f*Q,r[9]=h*P+d*z+u*H+f*ht,r[13]=h*S+d*D+u*X+f*_t,r[2]=g*E+_*M+m*F+p*W,r[6]=g*A+_*L+m*k+p*Q,r[10]=g*P+_*z+m*H+p*ht,r[14]=g*S+_*D+m*X+p*_t,r[3]=x*E+y*M+v*F+T*W,r[7]=x*A+y*L+v*k+T*Q,r[11]=x*P+y*z+v*H+T*ht,r[15]=x*S+y*D+v*X+T*_t,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*d-s*c*d-r*a*u+n*c*u+s*a*f-n*l*f)+_*(+e*l*f-e*c*u+r*o*u-s*o*f+s*c*h-r*l*h)+m*(+e*c*d-e*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-e*l*d+e*a*u+s*o*d-n*o*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],x=d*m*c-_*u*c+_*l*f-a*m*f-d*l*p+a*u*p,y=g*u*c-h*m*c-g*l*f+o*m*f+h*l*p-o*u*p,v=h*_*c-g*d*c+g*a*f-o*_*f-h*a*p+o*d*p,T=g*d*l-h*_*l-g*a*u+o*_*u+h*a*m-o*d*m,E=e*x+n*y+s*v+r*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=x*A,t[1]=(_*u*r-d*m*r-_*s*f+n*m*f+d*s*p-n*u*p)*A,t[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*p+n*l*p)*A,t[3]=(d*l*r-a*u*r-d*s*c+n*u*c+a*s*f-n*l*f)*A,t[4]=y*A,t[5]=(h*m*r-g*u*r+g*s*f-e*m*f-h*s*p+e*u*p)*A,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*A,t[7]=(o*u*r-h*l*r+h*s*c-e*u*c-o*s*f+e*l*f)*A,t[8]=v*A,t[9]=(g*d*r-h*_*r-g*n*f+e*_*f+h*n*p-e*d*p)*A,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*p+e*a*p)*A,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*f-e*a*f)*A,t[12]=T*A,t[13]=(h*_*s-g*d*s+g*n*u-e*_*u-h*n*m+e*d*m)*A,t[14]=(g*a*s-o*_*s-g*n*l+e*_*l+o*n*m-e*a*m)*A,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*u+e*a*u)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,g=r*d,_=o*h,m=o*d,p=a*d,x=l*c,y=l*h,v=l*d,T=n.x,E=n.y,A=n.z;return s[0]=(1-(_+p))*T,s[1]=(f+v)*T,s[2]=(g-y)*T,s[3]=0,s[4]=(f-v)*E,s[5]=(1-(u+p))*E,s[6]=(m+x)*E,s[7]=0,s[8]=(g+y)*A,s[9]=(m-x)*A,s[10]=(1-(u+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Zi.set(s[0],s[1],s[2]).length();const o=Zi.set(s[4],s[5],s[6]).length(),a=Zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],dn.copy(this);const c=1/r,h=1/o,d=1/a;return dn.elements[0]*=c,dn.elements[1]*=c,dn.elements[2]*=c,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=d,dn.elements[9]*=d,dn.elements[10]*=d,e.setFromRotationMatrix(dn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Wn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let f,g;if(a===Wn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===uo)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Wn){const l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),u=(e+t)*c,f=(n+s)*h;let g,_;if(a===Wn)g=(o+r)*d,_=-2*d;else if(a===uo)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Zi=new R,dn=new $t,Vp=new R(0,0,0),Wp=new R(1,1,1),ni=new R,yr=new R,qe=new R,Dc=new $t,Ic=new _e;class _n{constructor(t=0,e=0,n=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ie(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ie(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Dc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Dc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ic.setFromEuler(this),this.setFromQuaternion(Ic,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class Bl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Xp=0;const Uc=new R,Ki=new _e,zn=new $t,Mr=new R,Os=new R,$p=new R,Yp=new _e,Nc=new R(1,0,0),Oc=new R(0,1,0),Fc=new R(0,0,1),zc={type:"added"},qp={type:"removed"},Ji={type:"childadded",child:null},jo={type:"childremoved",child:null};class fe extends ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=Xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=fe.DEFAULT_UP.clone();const t=new R,e=new _n,n=new _e,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $t},normalMatrix:{value:new Ut}}),this.matrix=new $t,this.matrixWorld=new $t,this.matrixAutoUpdate=fe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.multiply(Ki),this}rotateOnWorldAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.premultiply(Ki),this}rotateX(t){return this.rotateOnAxis(Nc,t)}rotateY(t){return this.rotateOnAxis(Oc,t)}rotateZ(t){return this.rotateOnAxis(Fc,t)}translateOnAxis(t,e){return Uc.copy(t).applyQuaternion(this.quaternion),this.position.add(Uc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nc,t)}translateY(t){return this.translateOnAxis(Oc,t)}translateZ(t){return this.translateOnAxis(Fc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(zn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Mr.copy(t):Mr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zn.lookAt(Os,Mr,this.up):zn.lookAt(Mr,Os,this.up),this.quaternion.setFromRotationMatrix(zn),s&&(zn.extractRotation(s.matrixWorld),Ki.setFromRotationMatrix(zn),this.quaternion.premultiply(Ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(zc),Ji.child=t,this.dispatchEvent(Ji),Ji.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(qp),jo.child=t,this.dispatchEvent(jo),jo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),zn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),zn.multiply(t.parent.matrixWorld)),t.applyMatrix4(zn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(zc),Ji.child=t,this.dispatchEvent(Ji),Ji.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,t,$p),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,Yp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}fe.DEFAULT_UP=new R(0,1,0);fe.DEFAULT_MATRIX_AUTO_UPDATE=!0;fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const un=new R,kn=new R,Zo=new R,Bn=new R,Qi=new R,ts=new R,kc=new R,Ko=new R,Jo=new R,Qo=new R,ta=new se,ea=new se,na=new se;class on{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),un.subVectors(t,e),s.cross(un);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){un.subVectors(s,e),kn.subVectors(n,e),Zo.subVectors(t,e);const o=un.dot(un),a=un.dot(kn),l=un.dot(Zo),c=kn.dot(kn),h=kn.dot(Zo),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Bn)===null?!1:Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Bn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Bn.x),l.addScaledVector(o,Bn.y),l.addScaledVector(a,Bn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return ta.setScalar(0),ea.setScalar(0),na.setScalar(0),ta.fromBufferAttribute(t,e),ea.fromBufferAttribute(t,n),na.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ta,r.x),o.addScaledVector(ea,r.y),o.addScaledVector(na,r.z),o}static isFrontFacing(t,e,n,s){return un.subVectors(n,e),kn.subVectors(t,e),un.cross(kn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return un.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),un.cross(kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return on.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return on.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return on.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return on.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return on.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Qi.subVectors(s,n),ts.subVectors(r,n),Ko.subVectors(t,n);const l=Qi.dot(Ko),c=ts.dot(Ko);if(l<=0&&c<=0)return e.copy(n);Jo.subVectors(t,s);const h=Qi.dot(Jo),d=ts.dot(Jo);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Qi,o);Qo.subVectors(t,r);const f=Qi.dot(Qo),g=ts.dot(Qo);if(g>=0&&f<=g)return e.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(ts,a);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return kc.subVectors(r,s),a=(d-h)/(d-h+(f-g)),e.copy(s).addScaledVector(kc,a);const p=1/(m+_+u);return o=_*p,a=u*p,e.copy(n).addScaledVector(Qi,o).addScaledVector(ts,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Pd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ii={h:0,s:0,l:0},br={h:0,s:0,l:0};function ia(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Wt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Wt.workingColorSpace){if(t=kl(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ia(o,r,t+1/3),this.g=ia(o,r,t),this.b=ia(o,r,t-1/3)}return Wt.toWorkingColorSpace(this,s),this}setStyle(t,e=Ze){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ze){const n=Pd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=$n(t.r),this.g=$n(t.g),this.b=$n(t.b),this}copyLinearToSRGB(t){return this.r=_s(t.r),this.g=_s(t.g),this.b=_s(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ze){return Wt.fromWorkingColorSpace(Oe.copy(this),t),Math.round(Ie(Oe.r*255,0,255))*65536+Math.round(Ie(Oe.g*255,0,255))*256+Math.round(Ie(Oe.b*255,0,255))}getHexString(t=Ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wt.workingColorSpace){Wt.fromWorkingColorSpace(Oe.copy(this),e);const n=Oe.r,s=Oe.g,r=Oe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Wt.workingColorSpace){return Wt.fromWorkingColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=Ze){Wt.fromWorkingColorSpace(Oe.copy(this),t);const e=Oe.r,n=Oe.g,s=Oe.b;return t!==Ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ii),this.setHSL(ii.h+t,ii.s+e,ii.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ii),t.getHSL(br);const n=Js(ii.h,br.h,e),s=Js(ii.s,br.s,e),r=Js(ii.l,br.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new Ht;Ht.NAMES=Pd;let jp=0;class Bi extends ki{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jp++}),this.uuid=Xn(),this.name="",this.blending=ms,this.side=Yn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=La,this.blendDst=Da,this.blendEquation=Ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ms&&(n.blending=this.blending),this.side!==Yn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==La&&(n.blendSrc=this.blendSrc),this.blendDst!==Da&&(n.blendDst=this.blendDst),this.blendEquation!==Ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==xs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ui extends Bi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Ll,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ge=new R,Sr=new pt;class Xe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=gl,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Sr.fromBufferAttribute(this,e),Sr.applyMatrix3(t),this.setXY(e,Sr.x,Sr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix4(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyNormalMatrix(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.transformDirection(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=mn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),s=Qt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),s=Qt(s,this.array),r=Qt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==gl&&(t.usage=this.usage),t}}class Ld extends Xe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Dd extends Xe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ne extends Xe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Zp=0;const nn=new $t,sa=new fe,es=new R,je=new Dn,Fs=new Dn,Ee=new R;class ve extends ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=Xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ad(t)?Dd:Ld)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ut().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return nn.makeRotationFromQuaternion(t),this.applyMatrix4(nn),this}rotateX(t){return nn.makeRotationX(t),this.applyMatrix4(nn),this}rotateY(t){return nn.makeRotationY(t),this.applyMatrix4(nn),this}rotateZ(t){return nn.makeRotationZ(t),this.applyMatrix4(nn),this}translate(t,e,n){return nn.makeTranslation(t,e,n),this.applyMatrix4(nn),this}scale(t,e,n){return nn.makeScale(t,e,n),this.applyMatrix4(nn),this}lookAt(t){return sa.lookAt(t),sa.updateMatrix(),this.applyMatrix4(sa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(es).negate(),this.translate(es.x,es.y,es.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ne(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];je.setFromBufferAttribute(r),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,je.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,je.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(je.min),this.boundingBox.expandByPoint(je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(je.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Fs.setFromBufferAttribute(a),this.morphTargetsRelative?(Ee.addVectors(je.min,Fs.min),je.expandByPoint(Ee),Ee.addVectors(je.max,Fs.max),je.expandByPoint(Ee)):(je.expandByPoint(Fs.min),je.expandByPoint(Fs.max))}je.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ee.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ee));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ee.fromBufferAttribute(a,c),l&&(es.fromBufferAttribute(t,c),Ee.add(es)),s=Math.max(s,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Xe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new R,l[P]=new R;const c=new R,h=new R,d=new R,u=new pt,f=new pt,g=new pt,_=new R,m=new R;function p(P,S,M){c.fromBufferAttribute(n,P),h.fromBufferAttribute(n,S),d.fromBufferAttribute(n,M),u.fromBufferAttribute(r,P),f.fromBufferAttribute(r,S),g.fromBufferAttribute(r,M),h.sub(c),d.sub(c),f.sub(u),g.sub(u);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(L),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),a[P].add(_),a[S].add(_),a[M].add(_),l[P].add(m),l[S].add(m),l[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let P=0,S=x.length;P<S;++P){const M=x[P],L=M.start,z=M.count;for(let D=L,F=L+z;D<F;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const y=new R,v=new R,T=new R,E=new R;function A(P){T.fromBufferAttribute(s,P),E.copy(T);const S=a[P];y.copy(S),y.sub(T.multiplyScalar(T.dot(S))).normalize(),v.crossVectors(E,S);const L=v.dot(l[P])<0?-1:1;o.setXYZW(P,y.x,y.y,y.z,L)}for(let P=0,S=x.length;P<S;++P){const M=x[P],L=M.start,z=M.count;for(let D=L,F=L+z;D<F;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Xe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new R,r=new R,o=new R,a=new R,l=new R,c=new R,h=new R,d=new R;if(t)for(let u=0,f=t.count;u<f;u+=3){const g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new Xe(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ve,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bc=new $t,_i=new Eo,wr=new di,Hc=new R,Er=new R,Tr=new R,Ar=new R,ra=new R,Cr=new R,Gc=new R,Rr=new R;class at extends fe{constructor(t=new ve,e=new Ui){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Cr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(ra.fromBufferAttribute(d,t),o?Cr.addScaledVector(ra,h):Cr.addScaledVector(ra.sub(e),h))}e.add(Cr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),wr.copy(n.boundingSphere),wr.applyMatrix4(r),_i.copy(t.ray).recast(t.near),!(wr.containsPoint(_i.origin)===!1&&(_i.intersectSphere(wr,Hc)===null||_i.origin.distanceToSquared(Hc)>(t.far-t.near)**2))&&(Bc.copy(r).invert(),_i.copy(t.ray).applyMatrix4(Bc),!(n.boundingBox!==null&&_i.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,_i)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),y=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=x,T=y;v<T;v+=3){const E=a.getX(v),A=a.getX(v+1),P=a.getX(v+2);s=Pr(this,p,t,n,c,h,d,E,A,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const x=a.getX(m),y=a.getX(m+1),v=a.getX(m+2);s=Pr(this,o,t,n,c,h,d,x,y,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=x,T=y;v<T;v+=3){const E=v,A=v+1,P=v+2;s=Pr(this,p,t,n,c,h,d,E,A,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const x=m,y=m+1,v=m+2;s=Pr(this,o,t,n,c,h,d,x,y,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Kp(i,t,e,n,s,r,o,a){let l;if(t.side===He?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Yn,a),l===null)return null;Rr.copy(a),Rr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Rr);return c<e.near||c>e.far?null:{distance:c,point:Rr.clone(),object:i}}function Pr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Er),i.getVertexPosition(l,Tr),i.getVertexPosition(c,Ar);const h=Kp(i,t,e,n,Er,Tr,Ar,Gc);if(h){const d=new R;on.getBarycoord(Gc,Er,Tr,Ar,d),s&&(h.uv=on.getInterpolatedAttribute(s,a,l,c,d,new pt)),r&&(h.uv1=on.getInterpolatedAttribute(r,a,l,c,d,new pt)),o&&(h.normal=on.getInterpolatedAttribute(o,a,l,c,d,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new R,materialIndex:0};on.getNormal(Er,Tr,Ar,u.normal),h.face=u,h.barycoord=d}return h}class me extends ve{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ne(c,3)),this.setAttribute("normal",new ne(h,3)),this.setAttribute("uv",new ne(d,2));function g(_,m,p,x,y,v,T,E,A,P,S){const M=v/A,L=T/P,z=v/2,D=T/2,F=E/2,k=A+1,H=P+1;let X=0,W=0;const Q=new R;for(let ht=0;ht<H;ht++){const _t=ht*L-D;for(let Pt=0;Pt<k;Pt++){const Kt=Pt*M-z;Q[_]=Kt*x,Q[m]=_t*y,Q[p]=F,c.push(Q.x,Q.y,Q.z),Q[_]=0,Q[m]=0,Q[p]=E>0?1:-1,h.push(Q.x,Q.y,Q.z),d.push(Pt/A),d.push(1-ht/P),X+=1}}for(let ht=0;ht<P;ht++)for(let _t=0;_t<A;_t++){const Pt=u+_t+k*ht,Kt=u+_t+k*(ht+1),Y=u+(_t+1)+k*(ht+1),nt=u+(_t+1)+k*ht;l.push(Pt,Kt,nt),l.push(Kt,Y,nt),W+=6}a.addGroup(f,W,S),f+=W,u+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new me(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ws(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Be(i){const t={};for(let e=0;e<i.length;e++){const n=ws(i[e]);for(const s in n)t[s]=n[s]}return t}function Jp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Id(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Wt.workingColorSpace}const Hl={clone:ws,merge:Be};var Qp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class jn extends Bi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Qp,this.fragmentShader=tm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ws(t.uniforms),this.uniformsGroups=Jp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ud extends fe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $t,this.projectionMatrix=new $t,this.projectionMatrixInverse=new $t,this.coordinateSystem=Wn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const si=new R,Vc=new pt,Wc=new pt;class rn extends Ud{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ir*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ks*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ir*2*Math.atan(Math.tan(Ks*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(si.x,si.y).multiplyScalar(-t/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(si.x,si.y).multiplyScalar(-t/si.z)}getViewSize(t,e){return this.getViewBounds(t,Vc,Wc),e.subVectors(Wc,Vc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ks*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ns=-90,is=1;class em extends fe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new rn(ns,is,t,e);s.layers=this.layers,this.add(s);const r=new rn(ns,is,t,e);r.layers=this.layers,this.add(r);const o=new rn(ns,is,t,e);o.layers=this.layers,this.add(o);const a=new rn(ns,is,t,e);a.layers=this.layers,this.add(a);const l=new rn(ns,is,t,e);l.layers=this.layers,this.add(l);const c=new rn(ns,is,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===uo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Nd extends ze{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ys,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class nm extends zi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Nd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new me(5,5,5),r=new jn({name:"CubemapFromEquirect",uniforms:ws(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:He,blending:ci});r.uniforms.tEquirect.value=e;const o=new at(s,r),a=e.minFilter;return e.minFilter===Li&&(e.minFilter=Rn),new em(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const oa=new R,im=new R,sm=new Ut;class Gn{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=oa.subVectors(n,e).cross(im.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(oa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||sm.getNormalMatrix(t),s=this.coplanarPoint(oa).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const vi=new di,Lr=new R;class Gl{constructor(t=new Gn,e=new Gn,n=new Gn,s=new Gn,r=new Gn,o=new Gn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Wn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],x=s[13],y=s[14],v=s[15];if(n[0].setComponents(l-r,u-c,m-f,v-p).normalize(),n[1].setComponents(l+r,u+c,m+f,v+p).normalize(),n[2].setComponents(l+o,u+h,m+g,v+x).normalize(),n[3].setComponents(l-o,u-h,m-g,v-x).normalize(),n[4].setComponents(l-a,u-d,m-_,v-y).normalize(),e===Wn)n[5].setComponents(l+a,u+d,m+_,v+y).normalize();else if(e===uo)n[5].setComponents(a,d,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vi)}intersectsSprite(t){return vi.center.set(0,0,0),vi.radius=.7071067811865476,vi.applyMatrix4(t.matrixWorld),this.intersectsSphere(vi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Lr.x=s.normal.x>0?t.max.x:t.min.x,Lr.y=s.normal.y>0?t.max.y:t.min.y,Lr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Lr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Od(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function rm(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const _=d[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class Cs extends ve{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const x=p*u-o;for(let y=0;y<c;y++){const v=y*d-r;g.push(v,-x,0),_.push(0,0,1),m.push(y/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<a;x++){const y=x+c*p,v=x+c*(p+1),T=x+1+c*(p+1),E=x+1+c*p;f.push(y,v,E),f.push(v,T,E)}this.setIndex(f),this.setAttribute("position",new ne(g,3)),this.setAttribute("normal",new ne(_,3)),this.setAttribute("uv",new ne(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cs(t.width,t.height,t.widthSegments,t.heightSegments)}}var om=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,am=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,lm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,um=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,fm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,mm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_m=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,xm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ym=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Mm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,bm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Em=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Tm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Am=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Cm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Rm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Pm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Lm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Dm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Im=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Um=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Om="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,km=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Bm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Hm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Vm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$m=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ym=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,qm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Km=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Jm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Qm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,eg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ng=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ig=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,sg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,rg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,og=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ag=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ug=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,mg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_g=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,bg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,wg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Eg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ag=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Rg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ig=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ug=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ng=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Og=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Gg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Vg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Wg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Xg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$g=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Yg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,jg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Zg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Kg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,t_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,e_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,n_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,i_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,s_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const r_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,o_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,l_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,h_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,u_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,f_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,p_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,m_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,g_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,__=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,v_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,x_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,y_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,b_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,w_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,T_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,A_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,C_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,P_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,L_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,D_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,I_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,U_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,N_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,O_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,F_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,z_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ot={alphahash_fragment:om,alphahash_pars_fragment:am,alphamap_fragment:lm,alphamap_pars_fragment:cm,alphatest_fragment:hm,alphatest_pars_fragment:dm,aomap_fragment:um,aomap_pars_fragment:fm,batching_pars_vertex:pm,batching_vertex:mm,begin_vertex:gm,beginnormal_vertex:_m,bsdfs:vm,iridescence_fragment:xm,bumpmap_pars_fragment:ym,clipping_planes_fragment:Mm,clipping_planes_pars_fragment:bm,clipping_planes_pars_vertex:Sm,clipping_planes_vertex:wm,color_fragment:Em,color_pars_fragment:Tm,color_pars_vertex:Am,color_vertex:Cm,common:Rm,cube_uv_reflection_fragment:Pm,defaultnormal_vertex:Lm,displacementmap_pars_vertex:Dm,displacementmap_vertex:Im,emissivemap_fragment:Um,emissivemap_pars_fragment:Nm,colorspace_fragment:Om,colorspace_pars_fragment:Fm,envmap_fragment:zm,envmap_common_pars_fragment:km,envmap_pars_fragment:Bm,envmap_pars_vertex:Hm,envmap_physical_pars_fragment:Jm,envmap_vertex:Gm,fog_vertex:Vm,fog_pars_vertex:Wm,fog_fragment:Xm,fog_pars_fragment:$m,gradientmap_pars_fragment:Ym,lightmap_pars_fragment:qm,lights_lambert_fragment:jm,lights_lambert_pars_fragment:Zm,lights_pars_begin:Km,lights_toon_fragment:Qm,lights_toon_pars_fragment:tg,lights_phong_fragment:eg,lights_phong_pars_fragment:ng,lights_physical_fragment:ig,lights_physical_pars_fragment:sg,lights_fragment_begin:rg,lights_fragment_maps:og,lights_fragment_end:ag,logdepthbuf_fragment:lg,logdepthbuf_pars_fragment:cg,logdepthbuf_pars_vertex:hg,logdepthbuf_vertex:dg,map_fragment:ug,map_pars_fragment:fg,map_particle_fragment:pg,map_particle_pars_fragment:mg,metalnessmap_fragment:gg,metalnessmap_pars_fragment:_g,morphinstance_vertex:vg,morphcolor_vertex:xg,morphnormal_vertex:yg,morphtarget_pars_vertex:Mg,morphtarget_vertex:bg,normal_fragment_begin:Sg,normal_fragment_maps:wg,normal_pars_fragment:Eg,normal_pars_vertex:Tg,normal_vertex:Ag,normalmap_pars_fragment:Cg,clearcoat_normal_fragment_begin:Rg,clearcoat_normal_fragment_maps:Pg,clearcoat_pars_fragment:Lg,iridescence_pars_fragment:Dg,opaque_fragment:Ig,packing:Ug,premultiplied_alpha_fragment:Ng,project_vertex:Og,dithering_fragment:Fg,dithering_pars_fragment:zg,roughnessmap_fragment:kg,roughnessmap_pars_fragment:Bg,shadowmap_pars_fragment:Hg,shadowmap_pars_vertex:Gg,shadowmap_vertex:Vg,shadowmask_pars_fragment:Wg,skinbase_vertex:Xg,skinning_pars_vertex:$g,skinning_vertex:Yg,skinnormal_vertex:qg,specularmap_fragment:jg,specularmap_pars_fragment:Zg,tonemapping_fragment:Kg,tonemapping_pars_fragment:Jg,transmission_fragment:Qg,transmission_pars_fragment:t_,uv_pars_fragment:e_,uv_pars_vertex:n_,uv_vertex:i_,worldpos_vertex:s_,background_vert:r_,background_frag:o_,backgroundCube_vert:a_,backgroundCube_frag:l_,cube_vert:c_,cube_frag:h_,depth_vert:d_,depth_frag:u_,distanceRGBA_vert:f_,distanceRGBA_frag:p_,equirect_vert:m_,equirect_frag:g_,linedashed_vert:__,linedashed_frag:v_,meshbasic_vert:x_,meshbasic_frag:y_,meshlambert_vert:M_,meshlambert_frag:b_,meshmatcap_vert:S_,meshmatcap_frag:w_,meshnormal_vert:E_,meshnormal_frag:T_,meshphong_vert:A_,meshphong_frag:C_,meshphysical_vert:R_,meshphysical_frag:P_,meshtoon_vert:L_,meshtoon_frag:D_,points_vert:I_,points_frag:U_,shadow_vert:N_,shadow_frag:O_,sprite_vert:F_,sprite_frag:z_},it={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ut}},envmap:{envMap:{value:null},envMapRotation:{value:new Ut},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ut},normalScale:{value:new pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0},uvTransform:{value:new Ut}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}}},We={basic:{uniforms:Be([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:Ot.meshbasic_vert,fragmentShader:Ot.meshbasic_frag},lambert:{uniforms:Be([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Ot.meshlambert_vert,fragmentShader:Ot.meshlambert_frag},phong:{uniforms:Be([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Ot.meshphong_vert,fragmentShader:Ot.meshphong_frag},standard:{uniforms:Be([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag},toon:{uniforms:Be([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Ot.meshtoon_vert,fragmentShader:Ot.meshtoon_frag},matcap:{uniforms:Be([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:Ot.meshmatcap_vert,fragmentShader:Ot.meshmatcap_frag},points:{uniforms:Be([it.points,it.fog]),vertexShader:Ot.points_vert,fragmentShader:Ot.points_frag},dashed:{uniforms:Be([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ot.linedashed_vert,fragmentShader:Ot.linedashed_frag},depth:{uniforms:Be([it.common,it.displacementmap]),vertexShader:Ot.depth_vert,fragmentShader:Ot.depth_frag},normal:{uniforms:Be([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:Ot.meshnormal_vert,fragmentShader:Ot.meshnormal_frag},sprite:{uniforms:Be([it.sprite,it.fog]),vertexShader:Ot.sprite_vert,fragmentShader:Ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ot.background_vert,fragmentShader:Ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ut}},vertexShader:Ot.backgroundCube_vert,fragmentShader:Ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ot.cube_vert,fragmentShader:Ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ot.equirect_vert,fragmentShader:Ot.equirect_frag},distanceRGBA:{uniforms:Be([it.common,it.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ot.distanceRGBA_vert,fragmentShader:Ot.distanceRGBA_frag},shadow:{uniforms:Be([it.lights,it.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Ot.shadow_vert,fragmentShader:Ot.shadow_frag}};We.physical={uniforms:Be([We.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ut},clearcoatNormalScale:{value:new pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ut},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ut},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ut},transmissionSamplerSize:{value:new pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ut},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ut},anisotropyVector:{value:new pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ut}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag};const Dr={r:0,b:0,g:0},xi=new _n,k_=new $t;function B_(i,t,e,n,s,r,o){const a=new Ht(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function g(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?e:t).get(y)),y}function _(x){let y=!1;const v=g(x);v===null?p(a,l):v&&v.isColor&&(p(v,1),y=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,y){const v=g(y);v&&(v.isCubeTexture||v.mapping===So)?(h===void 0&&(h=new at(new me(1,1,1),new jn({name:"BackgroundCubeMaterial",uniforms:ws(We.backgroundCube.uniforms),vertexShader:We.backgroundCube.vertexShader,fragmentShader:We.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),xi.copy(y.backgroundRotation),xi.x*=-1,xi.y*=-1,xi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(k_.makeRotationFromEuler(xi)),h.material.toneMapped=Wt.getTransfer(v.colorSpace)!==te,(d!==v||u!==v.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=v,u=v.version,f=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new at(new Cs(2,2),new jn({name:"BackgroundMaterial",uniforms:ws(We.background.uniforms),vertexShader:We.background.vertexShader,fragmentShader:We.background.fragmentShader,side:Yn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Wt.getTransfer(v.colorSpace)!==te,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(d!==v||u!==v.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=v,u=v.version,f=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,y){x.getRGB(Dr,Id(i)),n.buffers.color.setClear(Dr.r,Dr.g,Dr.b,y,o)}return{getClearColor:function(){return a},setClearColor:function(x,y=1){a.set(x),l=y,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(a,l)},render:_,addToRenderList:m}}function H_(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(M,L,z,D,F){let k=!1;const H=d(D,z,L);r!==H&&(r=H,c(r.object)),k=f(M,D,z,F),k&&g(M,D,z,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,v(M,L,z,D),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function d(M,L,z){const D=z.wireframe===!0;let F=n[M.id];F===void 0&&(F={},n[M.id]=F);let k=F[L.id];k===void 0&&(k={},F[L.id]=k);let H=k[D];return H===void 0&&(H=u(l()),k[D]=H),H}function u(M){const L=[],z=[],D=[];for(let F=0;F<e;F++)L[F]=0,z[F]=0,D[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:D,object:M,attributes:{},index:null}}function f(M,L,z,D){const F=r.attributes,k=L.attributes;let H=0;const X=z.getAttributes();for(const W in X)if(X[W].location>=0){const ht=F[W];let _t=k[W];if(_t===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(_t=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(_t=M.instanceColor)),ht===void 0||ht.attribute!==_t||_t&&ht.data!==_t.data)return!0;H++}return r.attributesNum!==H||r.index!==D}function g(M,L,z,D){const F={},k=L.attributes;let H=0;const X=z.getAttributes();for(const W in X)if(X[W].location>=0){let ht=k[W];ht===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(ht=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(ht=M.instanceColor));const _t={};_t.attribute=ht,ht&&ht.data&&(_t.data=ht.data),F[W]=_t,H++}r.attributes=F,r.attributesNum=H,r.index=D}function _(){const M=r.newAttributes;for(let L=0,z=M.length;L<z;L++)M[L]=0}function m(M){p(M,0)}function p(M,L){const z=r.newAttributes,D=r.enabledAttributes,F=r.attributeDivisors;z[M]=1,D[M]===0&&(i.enableVertexAttribArray(M),D[M]=1),F[M]!==L&&(i.vertexAttribDivisor(M,L),F[M]=L)}function x(){const M=r.newAttributes,L=r.enabledAttributes;for(let z=0,D=L.length;z<D;z++)L[z]!==M[z]&&(i.disableVertexAttribArray(z),L[z]=0)}function y(M,L,z,D,F,k,H){H===!0?i.vertexAttribIPointer(M,L,z,F,k):i.vertexAttribPointer(M,L,z,D,F,k)}function v(M,L,z,D){_();const F=D.attributes,k=z.getAttributes(),H=L.defaultAttributeValues;for(const X in k){const W=k[X];if(W.location>=0){let Q=F[X];if(Q===void 0&&(X==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),X==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor)),Q!==void 0){const ht=Q.normalized,_t=Q.itemSize,Pt=t.get(Q);if(Pt===void 0)continue;const Kt=Pt.buffer,Y=Pt.type,nt=Pt.bytesPerElement,Mt=Y===i.INT||Y===i.UNSIGNED_INT||Q.gpuType===Dl;if(Q.isInterleavedBufferAttribute){const rt=Q.data,At=rt.stride,Lt=Q.offset;if(rt.isInstancedInterleavedBuffer){for(let Ft=0;Ft<W.locationSize;Ft++)p(W.location+Ft,rt.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Ft=0;Ft<W.locationSize;Ft++)m(W.location+Ft);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let Ft=0;Ft<W.locationSize;Ft++)y(W.location+Ft,_t/W.locationSize,Y,ht,At*nt,(Lt+_t/W.locationSize*Ft)*nt,Mt)}else{if(Q.isInstancedBufferAttribute){for(let rt=0;rt<W.locationSize;rt++)p(W.location+rt,Q.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let rt=0;rt<W.locationSize;rt++)m(W.location+rt);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let rt=0;rt<W.locationSize;rt++)y(W.location+rt,_t/W.locationSize,Y,ht,_t*nt,_t/W.locationSize*rt*nt,Mt)}}else if(H!==void 0){const ht=H[X];if(ht!==void 0)switch(ht.length){case 2:i.vertexAttrib2fv(W.location,ht);break;case 3:i.vertexAttrib3fv(W.location,ht);break;case 4:i.vertexAttrib4fv(W.location,ht);break;default:i.vertexAttrib1fv(W.location,ht)}}}}x()}function T(){P();for(const M in n){const L=n[M];for(const z in L){const D=L[z];for(const F in D)h(D[F].object),delete D[F];delete L[z]}delete n[M]}}function E(M){if(n[M.id]===void 0)return;const L=n[M.id];for(const z in L){const D=L[z];for(const F in D)h(D[F].object),delete D[F];delete L[z]}delete n[M.id]}function A(M){for(const L in n){const z=n[L];if(z[M.id]===void 0)continue;const D=z[M.id];for(const F in D)h(D[F].object),delete D[F];delete z[M.id]}}function P(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:S,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function G_(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function a(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];e.update(f,n,1)}function l(c,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*u[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function V_(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==gn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const P=A===lr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==qn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Pn&&!P)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:T,maxSamples:E}}function W_(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Gn,a=new Ut,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const x=r?0:n,y=x*4;let v=p.clippingState||null;l.value=v,v=h(g,u,y,f);for(let T=0;T!==y;++T)v[T]=e[T];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,x=u.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,v=f;y!==_;++y,v+=4)o.copy(d[y]).applyMatrix4(x,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function X_(i){let t=new WeakMap;function e(o,a){return a===Ba?o.mapping=ys:a===Ha&&(o.mapping=Ms),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ba||a===Ha)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new nm(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Vl extends Ud{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const us=4,Xc=[.125,.215,.35,.446,.526,.582],Ai=20,aa=new Vl,$c=new Ht;let la=null,ca=0,ha=0,da=!1;const Si=(1+Math.sqrt(5))/2,ss=1/Si,Yc=[new R(-Si,ss,0),new R(Si,ss,0),new R(-ss,0,Si),new R(ss,0,Si),new R(0,Si,-ss),new R(0,Si,ss),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class qc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),da=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Kc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(la,ca,ha),this._renderer.xr.enabled=da,t.scissorTest=!1,Ir(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ys||t.mapping===Ms?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),da=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Rn,minFilter:Rn,generateMipmaps:!1,type:lr,format:gn,colorSpace:As,depthBuffer:!1},s=jc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=jc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$_(r)),this._blurMaterial=Y_(r,t,e)}return s}_compileMaterial(t){const e=new at(this._lodPlanes[0],t);this._renderer.compile(e,aa)}_sceneToCubeUV(t,e,n,s){const a=new rn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor($c),h.toneMapping=hi,h.autoClear=!1;const f=new Ui({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1}),g=new at(new me,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy($c),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):x===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const y=this._cubeSize;Ir(s,x*y,p>2?y:0,y,y),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ys||t.mapping===Ms;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Kc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new at(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Ir(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,aa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Yc[(s-r-1)%Yc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new at(this._lodPlanes[s],c),u=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ai-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Ai;m>Ai&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ai}`);const p=[];let x=0;for(let A=0;A<Ai;++A){const P=A/_,S=Math.exp(-P*P/2);p.push(S),A===0?x+=S:A<m&&(x+=2*S)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:y}=this;u.dTheta.value=g,u.mipInt.value=y-n;const v=this._sizeLods[s],T=3*v*(s>y-us?s-y+us:0),E=4*(this._cubeSize-v);Ir(e,T,E,3*v,2*v),l.setRenderTarget(e),l.render(d,aa)}}function $_(i){const t=[],e=[],n=[];let s=i;const r=i-us+1+Xc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-us?l=Xc[o-i+us-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*f),y=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let E=0;E<f;E++){const A=E%3*2/3-1,P=E>2?0:-1,S=[A,P,0,A+2/3,P,0,A+2/3,P+1,0,A,P,0,A+2/3,P+1,0,A,P+1,0];x.set(S,_*g*E),y.set(u,m*g*E);const M=[E,E,E,E,E,E];v.set(M,p*g*E)}const T=new ve;T.setAttribute("position",new Xe(x,_)),T.setAttribute("uv",new Xe(y,m)),T.setAttribute("faceIndex",new Xe(v,p)),t.push(T),s>us&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function jc(i,t,e){const n=new zi(i,t,e);return n.texture.mapping=So,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ir(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Y_(i,t,e){const n=new Float32Array(Ai),s=new R(0,1,0);return new jn({name:"SphericalGaussianBlur",defines:{n:Ai,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Wl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Zc(){return new jn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Kc(){return new jn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Wl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function q_(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ba||l===Ha,h=l===ys||l===Ms;if(c||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new qc(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new qc(i)),d=c?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function j_(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&$s("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Z_(i,t,e,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}u.removeEventListener("dispose",o),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)t.update(u[g],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,g=d.attributes.position;let _=0;if(f!==null){const x=f.array;_=f.version;for(let y=0,v=x.length;y<v;y+=3){const T=x[y+0],E=x[y+1],A=x[y+2];u.push(T,E,E,A,A,T)}}else if(g!==void 0){const x=g.array;_=g.version;for(let y=0,v=x.length/3-1;y<v;y+=3){const T=y+0,E=y+1,A=y+2;u.push(T,E,E,A,A,T)}}else return;const m=new(Ad(u)?Dd:Ld)(u,1);m.version=_;const p=r.get(d);p&&t.remove(p),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function K_(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,f){i.drawElements(n,f,r,u*o),e.update(f,n,1)}function c(u,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,u*o,g),e.update(f,n,g))}function h(u,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function d(u,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)c(u[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=f[x]*_[x];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function J_(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Q_(i,t,e){const n=new WeakMap,s=new se;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let M=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",M)};var f=M;u!==void 0&&u.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let T=a.attributes.position.count*v,E=1;T>t.maxTextureSize&&(E=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);const A=new Float32Array(T*E*4*d),P=new Rd(A,T,E,d);P.type=Pn,P.needsUpdate=!0;const S=v*4;for(let L=0;L<d;L++){const z=p[L],D=x[L],F=y[L],k=T*E*4*L;for(let H=0;H<z.count;H++){const X=H*S;g===!0&&(s.fromBufferAttribute(z,H),A[k+X+0]=s.x,A[k+X+1]=s.y,A[k+X+2]=s.z,A[k+X+3]=0),_===!0&&(s.fromBufferAttribute(D,H),A[k+X+4]=s.x,A[k+X+5]=s.y,A[k+X+6]=s.z,A[k+X+7]=0),m===!0&&(s.fromBufferAttribute(F,H),A[k+X+8]=s.x,A[k+X+9]=s.y,A[k+X+10]=s.z,A[k+X+11]=F.itemSize===4?s.w:1)}}u={count:d,texture:P,size:new pt(T,E)},n.set(a,u),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function t0(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Fd extends ze{constructor(t,e,n,s,r,o,a,l,c,h=gs){if(h!==gs&&h!==Ss)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===gs&&(n=Fi),n===void 0&&h===Ss&&(n=bs),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ke,this.minFilter=l!==void 0?l:Ke,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const zd=new ze,Jc=new Fd(1,1),kd=new Rd,Bd=new Hp,Hd=new Nd,Qc=[],th=[],eh=new Float32Array(16),nh=new Float32Array(9),ih=new Float32Array(4);function Rs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Qc[s];if(r===void 0&&(r=new Float32Array(s),Qc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Se(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function we(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function To(i,t){let e=th[t];e===void 0&&(e=new Int32Array(t),th[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function e0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function n0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2fv(this.addr,t),we(e,t)}}function i0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Se(e,t))return;i.uniform3fv(this.addr,t),we(e,t)}}function s0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4fv(this.addr,t),we(e,t)}}function r0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),we(e,t)}else{if(Se(e,n))return;ih.set(n),i.uniformMatrix2fv(this.addr,!1,ih),we(e,n)}}function o0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),we(e,t)}else{if(Se(e,n))return;nh.set(n),i.uniformMatrix3fv(this.addr,!1,nh),we(e,n)}}function a0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),we(e,t)}else{if(Se(e,n))return;eh.set(n),i.uniformMatrix4fv(this.addr,!1,eh),we(e,n)}}function l0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function c0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2iv(this.addr,t),we(e,t)}}function h0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3iv(this.addr,t),we(e,t)}}function d0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4iv(this.addr,t),we(e,t)}}function u0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function f0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2uiv(this.addr,t),we(e,t)}}function p0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3uiv(this.addr,t),we(e,t)}}function m0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4uiv(this.addr,t),we(e,t)}}function g0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Jc.compareFunction=Td,r=Jc):r=zd,e.setTexture2D(t||r,s)}function _0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Bd,s)}function v0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Hd,s)}function x0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||kd,s)}function y0(i){switch(i){case 5126:return e0;case 35664:return n0;case 35665:return i0;case 35666:return s0;case 35674:return r0;case 35675:return o0;case 35676:return a0;case 5124:case 35670:return l0;case 35667:case 35671:return c0;case 35668:case 35672:return h0;case 35669:case 35673:return d0;case 5125:return u0;case 36294:return f0;case 36295:return p0;case 36296:return m0;case 35678:case 36198:case 36298:case 36306:case 35682:return g0;case 35679:case 36299:case 36307:return _0;case 35680:case 36300:case 36308:case 36293:return v0;case 36289:case 36303:case 36311:case 36292:return x0}}function M0(i,t){i.uniform1fv(this.addr,t)}function b0(i,t){const e=Rs(t,this.size,2);i.uniform2fv(this.addr,e)}function S0(i,t){const e=Rs(t,this.size,3);i.uniform3fv(this.addr,e)}function w0(i,t){const e=Rs(t,this.size,4);i.uniform4fv(this.addr,e)}function E0(i,t){const e=Rs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function T0(i,t){const e=Rs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function A0(i,t){const e=Rs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function C0(i,t){i.uniform1iv(this.addr,t)}function R0(i,t){i.uniform2iv(this.addr,t)}function P0(i,t){i.uniform3iv(this.addr,t)}function L0(i,t){i.uniform4iv(this.addr,t)}function D0(i,t){i.uniform1uiv(this.addr,t)}function I0(i,t){i.uniform2uiv(this.addr,t)}function U0(i,t){i.uniform3uiv(this.addr,t)}function N0(i,t){i.uniform4uiv(this.addr,t)}function O0(i,t,e){const n=this.cache,s=t.length,r=To(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||zd,r[o])}function F0(i,t,e){const n=this.cache,s=t.length,r=To(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Bd,r[o])}function z0(i,t,e){const n=this.cache,s=t.length,r=To(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Hd,r[o])}function k0(i,t,e){const n=this.cache,s=t.length,r=To(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||kd,r[o])}function B0(i){switch(i){case 5126:return M0;case 35664:return b0;case 35665:return S0;case 35666:return w0;case 35674:return E0;case 35675:return T0;case 35676:return A0;case 5124:case 35670:return C0;case 35667:case 35671:return R0;case 35668:case 35672:return P0;case 35669:case 35673:return L0;case 5125:return D0;case 36294:return I0;case 36295:return U0;case 36296:return N0;case 35678:case 36198:case 36298:case 36306:case 35682:return O0;case 35679:case 36299:case 36307:return F0;case 35680:case 36300:case 36308:case 36293:return z0;case 36289:case 36303:case 36311:case 36292:return k0}}class H0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=y0(e.type)}}class G0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=B0(e.type)}}class V0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const ua=/(\w+)(\])?(\[|\.)?/g;function sh(i,t){i.seq.push(t),i.map[t.id]=t}function W0(i,t,e){const n=i.name,s=n.length;for(ua.lastIndex=0;;){const r=ua.exec(n),o=ua.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){sh(e,c===void 0?new H0(a,i,t):new G0(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new V0(a),sh(e,d)),e=d}}}class co{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);W0(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function rh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const X0=37297;let $0=0;function Y0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const oh=new Ut;function q0(i){Wt._getMatrix(oh,Wt.workingColorSpace,i);const t=`mat3( ${oh.elements.map(e=>e.toFixed(4))} )`;switch(Wt.getTransfer(i)){case wo:return[t,"LinearTransferOETF"];case te:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ah(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Y0(i.getShaderSource(t),o)}else return s}function j0(i,t){const e=q0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Z0(i,t){let e;switch(t){case Qf:e="Linear";break;case tp:e="Reinhard";break;case ep:e="Cineon";break;case np:e="ACESFilmic";break;case sp:e="AgX";break;case rp:e="Neutral";break;case ip:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ur=new R;function K0(){Wt.getLuminanceCoefficients(Ur);const i=Ur.x.toFixed(4),t=Ur.y.toFixed(4),e=Ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function J0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ys).join(`
`)}function Q0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function tv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ys(i){return i!==""}function lh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ch(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ev=/^[ \t]*#include +<([\w\d./]+)>/gm;function _l(i){return i.replace(ev,iv)}const nv=new Map;function iv(i,t){let e=Ot[t];if(e===void 0){const n=nv.get(t);if(n!==void 0)e=Ot[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return _l(e)}const sv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hh(i){return i.replace(sv,rv)}function rv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function dh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function ov(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===pd?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Df?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Hn&&(t="SHADOWMAP_TYPE_VSM"),t}function av(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ys:case Ms:t="ENVMAP_TYPE_CUBE";break;case So:t="ENVMAP_TYPE_CUBE_UV";break}return t}function lv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ms:t="ENVMAP_MODE_REFRACTION";break}return t}function cv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ll:t="ENVMAP_BLENDING_MULTIPLY";break;case Kf:t="ENVMAP_BLENDING_MIX";break;case Jf:t="ENVMAP_BLENDING_ADD";break}return t}function hv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function dv(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=ov(e),c=av(e),h=lv(e),d=cv(e),u=hv(e),f=J0(e),g=Q0(r),_=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ys).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ys).join(`
`),p.length>0&&(p+=`
`)):(m=[dh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ys).join(`
`),p=[dh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==hi?"#define TONE_MAPPING":"",e.toneMapping!==hi?Ot.tonemapping_pars_fragment:"",e.toneMapping!==hi?Z0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ot.colorspace_pars_fragment,j0("linearToOutputTexel",e.outputColorSpace),K0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ys).join(`
`)),o=_l(o),o=lh(o,e),o=ch(o,e),a=_l(a),a=lh(a,e),a=ch(a,e),o=hh(o),a=hh(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Sc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Sc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=x+m+o,v=x+p+a,T=rh(s,s.VERTEX_SHADER,y),E=rh(s,s.FRAGMENT_SHADER,v);s.attachShader(_,T),s.attachShader(_,E),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(L){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(_).trim(),D=s.getShaderInfoLog(T).trim(),F=s.getShaderInfoLog(E).trim();let k=!0,H=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,T,E);else{const X=ah(s,T,"vertex"),W=ah(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+z+`
`+X+`
`+W)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(D===""||F==="")&&(H=!1);H&&(L.diagnostics={runnable:k,programLog:z,vertexShader:{log:D,prefix:m},fragmentShader:{log:F,prefix:p}})}s.deleteShader(T),s.deleteShader(E),P=new co(s,_),S=tv(s,_)}let P;this.getUniforms=function(){return P===void 0&&A(this),P};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,X0)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=$0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=E,this}let uv=0;class fv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new pv(t),e.set(t,n)),n}}class pv{constructor(t){this.id=uv++,this.code=t,this.usedTimes=0}}function mv(i,t,e,n,s,r,o){const a=new Bl,l=new fv,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,M,L,z,D){const F=z.fog,k=D.geometry,H=S.isMeshStandardMaterial?z.environment:null,X=(S.isMeshStandardMaterial?e:t).get(S.envMap||H),W=X&&X.mapping===So?X.image.height:null,Q=g[S.type];S.precision!==null&&(f=s.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const ht=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,_t=ht!==void 0?ht.length:0;let Pt=0;k.morphAttributes.position!==void 0&&(Pt=1),k.morphAttributes.normal!==void 0&&(Pt=2),k.morphAttributes.color!==void 0&&(Pt=3);let Kt,Y,nt,Mt;if(Q){const Jt=We[Q];Kt=Jt.vertexShader,Y=Jt.fragmentShader}else Kt=S.vertexShader,Y=S.fragmentShader,l.update(S),nt=l.getVertexShaderID(S),Mt=l.getFragmentShaderID(S);const rt=i.getRenderTarget(),At=i.state.buffers.depth.getReversed(),Lt=D.isInstancedMesh===!0,Ft=D.isBatchedMesh===!0,de=!!S.map,Gt=!!S.matcap,pe=!!X,O=!!S.aoMap,tn=!!S.lightMap,zt=!!S.bumpMap,kt=!!S.normalMap,Et=!!S.displacementMap,ae=!!S.emissiveMap,wt=!!S.metalnessMap,C=!!S.roughnessMap,b=S.anisotropy>0,B=S.clearcoat>0,j=S.dispersion>0,K=S.iridescence>0,q=S.sheen>0,bt=S.transmission>0,ot=b&&!!S.anisotropyMap,ft=B&&!!S.clearcoatMap,Vt=B&&!!S.clearcoatNormalMap,tt=B&&!!S.clearcoatRoughnessMap,mt=K&&!!S.iridescenceMap,Tt=K&&!!S.iridescenceThicknessMap,Ct=q&&!!S.sheenColorMap,gt=q&&!!S.sheenRoughnessMap,Bt=!!S.specularMap,Nt=!!S.specularColorMap,re=!!S.specularIntensityMap,I=bt&&!!S.transmissionMap,st=bt&&!!S.thicknessMap,$=!!S.gradientMap,Z=!!S.alphaMap,dt=S.alphaTest>0,lt=!!S.alphaHash,Dt=!!S.extensions;let ue=hi;S.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(ue=i.toneMapping);const Ue={shaderID:Q,shaderType:S.type,shaderName:S.name,vertexShader:Kt,fragmentShader:Y,defines:S.defines,customVertexShaderID:nt,customFragmentShaderID:Mt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Ft,batchingColor:Ft&&D._colorsTexture!==null,instancing:Lt,instancingColor:Lt&&D.instanceColor!==null,instancingMorph:Lt&&D.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:As,alphaToCoverage:!!S.alphaToCoverage,map:de,matcap:Gt,envMap:pe,envMapMode:pe&&X.mapping,envMapCubeUVHeight:W,aoMap:O,lightMap:tn,bumpMap:zt,normalMap:kt,displacementMap:u&&Et,emissiveMap:ae,normalMapObjectSpace:kt&&S.normalMapType===cp,normalMapTangentSpace:kt&&S.normalMapType===Ed,metalnessMap:wt,roughnessMap:C,anisotropy:b,anisotropyMap:ot,clearcoat:B,clearcoatMap:ft,clearcoatNormalMap:Vt,clearcoatRoughnessMap:tt,dispersion:j,iridescence:K,iridescenceMap:mt,iridescenceThicknessMap:Tt,sheen:q,sheenColorMap:Ct,sheenRoughnessMap:gt,specularMap:Bt,specularColorMap:Nt,specularIntensityMap:re,transmission:bt,transmissionMap:I,thicknessMap:st,gradientMap:$,opaque:S.transparent===!1&&S.blending===ms&&S.alphaToCoverage===!1,alphaMap:Z,alphaTest:dt,alphaHash:lt,combine:S.combine,mapUv:de&&_(S.map.channel),aoMapUv:O&&_(S.aoMap.channel),lightMapUv:tn&&_(S.lightMap.channel),bumpMapUv:zt&&_(S.bumpMap.channel),normalMapUv:kt&&_(S.normalMap.channel),displacementMapUv:Et&&_(S.displacementMap.channel),emissiveMapUv:ae&&_(S.emissiveMap.channel),metalnessMapUv:wt&&_(S.metalnessMap.channel),roughnessMapUv:C&&_(S.roughnessMap.channel),anisotropyMapUv:ot&&_(S.anisotropyMap.channel),clearcoatMapUv:ft&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:Vt&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:tt&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:mt&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Tt&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ct&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:gt&&_(S.sheenRoughnessMap.channel),specularMapUv:Bt&&_(S.specularMap.channel),specularColorMapUv:Nt&&_(S.specularColorMap.channel),specularIntensityMapUv:re&&_(S.specularIntensityMap.channel),transmissionMapUv:I&&_(S.transmissionMap.channel),thicknessMapUv:st&&_(S.thicknessMap.channel),alphaMapUv:Z&&_(S.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(kt||b),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!k.attributes.uv&&(de||Z),fog:!!F,useFog:S.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:At,skinning:D.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:_t,morphTextureStride:Pt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:ue,decodeVideoTexture:de&&S.map.isVideoTexture===!0&&Wt.getTransfer(S.map.colorSpace)===te,decodeVideoTextureEmissive:ae&&S.emissiveMap.isVideoTexture===!0&&Wt.getTransfer(S.emissiveMap.colorSpace)===te,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===En,flipSided:S.side===He,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Dt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Dt&&S.extensions.multiDraw===!0||Ft)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ue.vertexUv1s=c.has(1),Ue.vertexUv2s=c.has(2),Ue.vertexUv3s=c.has(3),c.clear(),Ue}function p(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)M.push(L),M.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(x(M,S),y(M,S),M.push(i.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function x(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function y(S,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),S.push(a.mask)}function v(S){const M=g[S.type];let L;if(M){const z=We[M];L=Hl.clone(z.uniforms)}else L=S.uniforms;return L}function T(S,M){let L;for(let z=0,D=h.length;z<D;z++){const F=h[z];if(F.cacheKey===M){L=F,++L.usedTimes;break}}return L===void 0&&(L=new dv(i,M,S,r),h.push(L)),L}function E(S){if(--S.usedTimes===0){const M=h.indexOf(S);h[M]=h[h.length-1],h.pop(),S.destroy()}}function A(S){l.remove(S)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:T,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:P}}function gv(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function _v(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function uh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function fh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,u,f,g,_,m){let p=i[t];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},i[t]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=m),t++,p}function a(d,u,f,g,_,m){const p=o(d,u,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(d,u,f,g,_,m){const p=o(d,u,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(d,u){e.length>1&&e.sort(d||_v),n.length>1&&n.sort(u||uh),s.length>1&&s.sort(u||uh)}function h(){for(let d=t,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function vv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new fh,i.set(n,[o])):s>=r.length?(o=new fh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function xv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Ht};break;case"SpotLight":e={position:new R,direction:new R,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function yv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Mv=0;function bv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Sv(i){const t=new xv,e=yv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const s=new R,r=new $t,o=new $t;function a(c){let h=0,d=0,u=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,x=0,y=0,v=0,T=0,E=0,A=0;c.sort(bv);for(let S=0,M=c.length;S<M;S++){const L=c[S],z=L.color,D=L.intensity,F=L.distance,k=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=z.r*D,d+=z.g*D,u+=z.b*D;else if(L.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(L.sh.coefficients[H],D);A++}else if(L.isDirectionalLight){const H=t.get(L);if(H.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const X=L.shadow,W=e.get(L);W.shadowIntensity=X.intensity,W.shadowBias=X.bias,W.shadowNormalBias=X.normalBias,W.shadowRadius=X.radius,W.shadowMapSize=X.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=k,n.directionalShadowMatrix[f]=L.shadow.matrix,x++}n.directional[f]=H,f++}else if(L.isSpotLight){const H=t.get(L);H.position.setFromMatrixPosition(L.matrixWorld),H.color.copy(z).multiplyScalar(D),H.distance=F,H.coneCos=Math.cos(L.angle),H.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),H.decay=L.decay,n.spot[_]=H;const X=L.shadow;if(L.map&&(n.spotLightMap[T]=L.map,T++,X.updateMatrices(L),L.castShadow&&E++),n.spotLightMatrix[_]=X.matrix,L.castShadow){const W=e.get(L);W.shadowIntensity=X.intensity,W.shadowBias=X.bias,W.shadowNormalBias=X.normalBias,W.shadowRadius=X.radius,W.shadowMapSize=X.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=k,v++}_++}else if(L.isRectAreaLight){const H=t.get(L);H.color.copy(z).multiplyScalar(D),H.halfWidth.set(L.width*.5,0,0),H.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=H,m++}else if(L.isPointLight){const H=t.get(L);if(H.color.copy(L.color).multiplyScalar(L.intensity),H.distance=L.distance,H.decay=L.decay,L.castShadow){const X=L.shadow,W=e.get(L);W.shadowIntensity=X.intensity,W.shadowBias=X.bias,W.shadowNormalBias=X.normalBias,W.shadowRadius=X.radius,W.shadowMapSize=X.mapSize,W.shadowCameraNear=X.camera.near,W.shadowCameraFar=X.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=L.shadow.matrix,y++}n.point[g]=H,g++}else if(L.isHemisphereLight){const H=t.get(L);H.skyColor.copy(L.color).multiplyScalar(D),H.groundColor.copy(L.groundColor).multiplyScalar(D),n.hemi[p]=H,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=it.LTC_FLOAT_1,n.rectAreaLTC2=it.LTC_FLOAT_2):(n.rectAreaLTC1=it.LTC_HALF_1,n.rectAreaLTC2=it.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const P=n.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==x||P.numPointShadows!==y||P.numSpotShadows!==v||P.numSpotMaps!==T||P.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=v+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,P.directionalLength=f,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=x,P.numPointShadows=y,P.numSpotShadows=v,P.numSpotMaps=T,P.numLightProbes=A,n.version=Mv++)}function l(c,h){let d=0,u=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const y=c[p];if(y.isDirectionalLight){const v=n.directional[d];v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(y.isSpotLight){const v=n.spot[f];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const v=n.point[u];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),u++}else if(y.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function ph(i){const t=new Sv(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function wv(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new ph(i),t.set(s,[a])):r>=o.length?(a=new ph(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Ev extends Bi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=ap,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Tv extends Bi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Av=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Cv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Rv(i,t,e){let n=new Gl;const s=new pt,r=new pt,o=new se,a=new Ev({depthPacking:lp}),l=new Tv,c={},h=e.maxTextureSize,d={[Yn]:He,[He]:Yn,[En]:En},u=new jn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pt},radius:{value:4}},vertexShader:Av,fragmentShader:Cv}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new ve;g.setAttribute("position",new Xe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new at(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pd;let p=this.type;this.render=function(E,A,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const S=i.getRenderTarget(),M=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),z=i.state;z.setBlending(ci),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const D=p!==Hn&&this.type===Hn,F=p===Hn&&this.type!==Hn;for(let k=0,H=E.length;k<H;k++){const X=E[k],W=X.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const Q=W.getFrameExtents();if(s.multiply(Q),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,W.mapSize.y=r.y)),W.map===null||D===!0||F===!0){const _t=this.type!==Hn?{minFilter:Ke,magFilter:Ke}:{};W.map!==null&&W.map.dispose(),W.map=new zi(s.x,s.y,_t),W.map.texture.name=X.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const ht=W.getViewportCount();for(let _t=0;_t<ht;_t++){const Pt=W.getViewport(_t);o.set(r.x*Pt.x,r.y*Pt.y,r.x*Pt.z,r.y*Pt.w),z.viewport(o),W.updateMatrices(X,_t),n=W.getFrustum(),v(A,P,W.camera,X,this.type)}W.isPointLightShadow!==!0&&this.type===Hn&&x(W,P),W.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(S,M,L)};function x(E,A){const P=t.update(_);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new zi(s.x,s.y)),u.uniforms.shadow_pass.value=E.map.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,P,u,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,P,f,_,null)}function y(E,A,P,S){let M=null;const L=P.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)M=L;else if(M=P.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=M.uuid,D=A.uuid;let F=c[z];F===void 0&&(F={},c[z]=F);let k=F[D];k===void 0&&(k=M.clone(),F[D]=k,A.addEventListener("dispose",T)),M=k}if(M.visible=A.visible,M.wireframe=A.wireframe,S===Hn?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:d[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,P.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const z=i.properties.get(M);z.light=P}return M}function v(E,A,P,S,M){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&M===Hn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,E.matrixWorld);const D=t.update(E),F=E.material;if(Array.isArray(F)){const k=D.groups;for(let H=0,X=k.length;H<X;H++){const W=k[H],Q=F[W.materialIndex];if(Q&&Q.visible){const ht=y(E,Q,S,M);E.onBeforeShadow(i,E,A,P,D,ht,W),i.renderBufferDirect(P,null,D,ht,E,W),E.onAfterShadow(i,E,A,P,D,ht,W)}}}else if(F.visible){const k=y(E,F,S,M);E.onBeforeShadow(i,E,A,P,D,k,null),i.renderBufferDirect(P,null,D,k,E,null),E.onAfterShadow(i,E,A,P,D,k,null)}}const z=E.children;for(let D=0,F=z.length;D<F;D++)v(z[D],A,P,S,M)}function T(E){E.target.removeEventListener("dispose",T);for(const P in c){const S=c[P],M=E.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const Pv={[Ia]:Ua,[Na]:za,[Oa]:ka,[xs]:Fa,[Ua]:Ia,[za]:Na,[ka]:Oa,[Fa]:xs};function Lv(i,t){function e(){let I=!1;const st=new se;let $=null;const Z=new se(0,0,0,0);return{setMask:function(dt){$!==dt&&!I&&(i.colorMask(dt,dt,dt,dt),$=dt)},setLocked:function(dt){I=dt},setClear:function(dt,lt,Dt,ue,Ue){Ue===!0&&(dt*=ue,lt*=ue,Dt*=ue),st.set(dt,lt,Dt,ue),Z.equals(st)===!1&&(i.clearColor(dt,lt,Dt,ue),Z.copy(st))},reset:function(){I=!1,$=null,Z.set(-1,0,0,0)}}}function n(){let I=!1,st=!1,$=null,Z=null,dt=null;return{setReversed:function(lt){if(st!==lt){const Dt=t.get("EXT_clip_control");st?Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.ZERO_TO_ONE_EXT):Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.NEGATIVE_ONE_TO_ONE_EXT);const ue=dt;dt=null,this.setClear(ue)}st=lt},getReversed:function(){return st},setTest:function(lt){lt?rt(i.DEPTH_TEST):At(i.DEPTH_TEST)},setMask:function(lt){$!==lt&&!I&&(i.depthMask(lt),$=lt)},setFunc:function(lt){if(st&&(lt=Pv[lt]),Z!==lt){switch(lt){case Ia:i.depthFunc(i.NEVER);break;case Ua:i.depthFunc(i.ALWAYS);break;case Na:i.depthFunc(i.LESS);break;case xs:i.depthFunc(i.LEQUAL);break;case Oa:i.depthFunc(i.EQUAL);break;case Fa:i.depthFunc(i.GEQUAL);break;case za:i.depthFunc(i.GREATER);break;case ka:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Z=lt}},setLocked:function(lt){I=lt},setClear:function(lt){dt!==lt&&(st&&(lt=1-lt),i.clearDepth(lt),dt=lt)},reset:function(){I=!1,$=null,Z=null,dt=null,st=!1}}}function s(){let I=!1,st=null,$=null,Z=null,dt=null,lt=null,Dt=null,ue=null,Ue=null;return{setTest:function(Jt){I||(Jt?rt(i.STENCIL_TEST):At(i.STENCIL_TEST))},setMask:function(Jt){st!==Jt&&!I&&(i.stencilMask(Jt),st=Jt)},setFunc:function(Jt,ln,In){($!==Jt||Z!==ln||dt!==In)&&(i.stencilFunc(Jt,ln,In),$=Jt,Z=ln,dt=In)},setOp:function(Jt,ln,In){(lt!==Jt||Dt!==ln||ue!==In)&&(i.stencilOp(Jt,ln,In),lt=Jt,Dt=ln,ue=In)},setLocked:function(Jt){I=Jt},setClear:function(Jt){Ue!==Jt&&(i.clearStencil(Jt),Ue=Jt)},reset:function(){I=!1,st=null,$=null,Z=null,dt=null,lt=null,Dt=null,ue=null,Ue=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],g=null,_=!1,m=null,p=null,x=null,y=null,v=null,T=null,E=null,A=new Ht(0,0,0),P=0,S=!1,M=null,L=null,z=null,D=null,F=null;const k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,X=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(W)[1]),H=X>=1):W.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),H=X>=2);let Q=null,ht={};const _t=i.getParameter(i.SCISSOR_BOX),Pt=i.getParameter(i.VIEWPORT),Kt=new se().fromArray(_t),Y=new se().fromArray(Pt);function nt(I,st,$,Z){const dt=new Uint8Array(4),lt=i.createTexture();i.bindTexture(I,lt),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Dt=0;Dt<$;Dt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(st,0,i.RGBA,1,1,Z,0,i.RGBA,i.UNSIGNED_BYTE,dt):i.texImage2D(st+Dt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,dt);return lt}const Mt={};Mt[i.TEXTURE_2D]=nt(i.TEXTURE_2D,i.TEXTURE_2D,1),Mt[i.TEXTURE_CUBE_MAP]=nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Mt[i.TEXTURE_2D_ARRAY]=nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Mt[i.TEXTURE_3D]=nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),rt(i.DEPTH_TEST),o.setFunc(xs),zt(!1),kt(_c),rt(i.CULL_FACE),O(ci);function rt(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function At(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Lt(I,st){return d[I]!==st?(i.bindFramebuffer(I,st),d[I]=st,I===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=st),I===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=st),!0):!1}function Ft(I,st){let $=f,Z=!1;if(I){$=u.get(st),$===void 0&&($=[],u.set(st,$));const dt=I.textures;if($.length!==dt.length||$[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,Dt=dt.length;lt<Dt;lt++)$[lt]=i.COLOR_ATTACHMENT0+lt;$.length=dt.length,Z=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,Z=!0);Z&&i.drawBuffers($)}function de(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const Gt={[Ti]:i.FUNC_ADD,[Uf]:i.FUNC_SUBTRACT,[Nf]:i.FUNC_REVERSE_SUBTRACT};Gt[Of]=i.MIN,Gt[Ff]=i.MAX;const pe={[zf]:i.ZERO,[kf]:i.ONE,[Bf]:i.SRC_COLOR,[La]:i.SRC_ALPHA,[$f]:i.SRC_ALPHA_SATURATE,[Wf]:i.DST_COLOR,[Gf]:i.DST_ALPHA,[Hf]:i.ONE_MINUS_SRC_COLOR,[Da]:i.ONE_MINUS_SRC_ALPHA,[Xf]:i.ONE_MINUS_DST_COLOR,[Vf]:i.ONE_MINUS_DST_ALPHA,[Yf]:i.CONSTANT_COLOR,[qf]:i.ONE_MINUS_CONSTANT_COLOR,[jf]:i.CONSTANT_ALPHA,[Zf]:i.ONE_MINUS_CONSTANT_ALPHA};function O(I,st,$,Z,dt,lt,Dt,ue,Ue,Jt){if(I===ci){_===!0&&(At(i.BLEND),_=!1);return}if(_===!1&&(rt(i.BLEND),_=!0),I!==If){if(I!==m||Jt!==S){if((p!==Ti||v!==Ti)&&(i.blendEquation(i.FUNC_ADD),p=Ti,v=Ti),Jt)switch(I){case ms:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vc:i.blendFunc(i.ONE,i.ONE);break;case xc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case yc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case xc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case yc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}x=null,y=null,T=null,E=null,A.set(0,0,0),P=0,m=I,S=Jt}return}dt=dt||st,lt=lt||$,Dt=Dt||Z,(st!==p||dt!==v)&&(i.blendEquationSeparate(Gt[st],Gt[dt]),p=st,v=dt),($!==x||Z!==y||lt!==T||Dt!==E)&&(i.blendFuncSeparate(pe[$],pe[Z],pe[lt],pe[Dt]),x=$,y=Z,T=lt,E=Dt),(ue.equals(A)===!1||Ue!==P)&&(i.blendColor(ue.r,ue.g,ue.b,Ue),A.copy(ue),P=Ue),m=I,S=!1}function tn(I,st){I.side===En?At(i.CULL_FACE):rt(i.CULL_FACE);let $=I.side===He;st&&($=!$),zt($),I.blending===ms&&I.transparent===!1?O(ci):O(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);const Z=I.stencilWrite;a.setTest(Z),Z&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ae(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):At(i.SAMPLE_ALPHA_TO_COVERAGE)}function zt(I){M!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),M=I)}function kt(I){I!==Pf?(rt(i.CULL_FACE),I!==L&&(I===_c?i.cullFace(i.BACK):I===Lf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):At(i.CULL_FACE),L=I}function Et(I){I!==z&&(H&&i.lineWidth(I),z=I)}function ae(I,st,$){I?(rt(i.POLYGON_OFFSET_FILL),(D!==st||F!==$)&&(i.polygonOffset(st,$),D=st,F=$)):At(i.POLYGON_OFFSET_FILL)}function wt(I){I?rt(i.SCISSOR_TEST):At(i.SCISSOR_TEST)}function C(I){I===void 0&&(I=i.TEXTURE0+k-1),Q!==I&&(i.activeTexture(I),Q=I)}function b(I,st,$){$===void 0&&(Q===null?$=i.TEXTURE0+k-1:$=Q);let Z=ht[$];Z===void 0&&(Z={type:void 0,texture:void 0},ht[$]=Z),(Z.type!==I||Z.texture!==st)&&(Q!==$&&(i.activeTexture($),Q=$),i.bindTexture(I,st||Mt[I]),Z.type=I,Z.texture=st)}function B(){const I=ht[Q];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function j(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function K(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function bt(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ft(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Vt(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function mt(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Tt(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ct(I){Kt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),Kt.copy(I))}function gt(I){Y.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),Y.copy(I))}function Bt(I,st){let $=c.get(st);$===void 0&&($=new WeakMap,c.set(st,$));let Z=$.get(I);Z===void 0&&(Z=i.getUniformBlockIndex(st,I.name),$.set(I,Z))}function Nt(I,st){const Z=c.get(st).get(I);l.get(st)!==Z&&(i.uniformBlockBinding(st,Z,I.__bindingPointIndex),l.set(st,Z))}function re(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Q=null,ht={},d={},u=new WeakMap,f=[],g=null,_=!1,m=null,p=null,x=null,y=null,v=null,T=null,E=null,A=new Ht(0,0,0),P=0,S=!1,M=null,L=null,z=null,D=null,F=null,Kt.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:rt,disable:At,bindFramebuffer:Lt,drawBuffers:Ft,useProgram:de,setBlending:O,setMaterial:tn,setFlipSided:zt,setCullFace:kt,setLineWidth:Et,setPolygonOffset:ae,setScissorTest:wt,activeTexture:C,bindTexture:b,unbindTexture:B,compressedTexImage2D:j,compressedTexImage3D:K,texImage2D:mt,texImage3D:Tt,updateUBOMapping:Bt,uniformBlockBinding:Nt,texStorage2D:Vt,texStorage3D:tt,texSubImage2D:q,texSubImage3D:bt,compressedTexSubImage2D:ot,compressedTexSubImage3D:ft,scissor:Ct,viewport:gt,reset:re}}function mh(i,t,e,n){const s=Dv(n);switch(e){case xd:return i*t;case Md:return i*t;case bd:return i*t*2;case Nl:return i*t/s.components*s.byteLength;case Ol:return i*t/s.components*s.byteLength;case Sd:return i*t*2/s.components*s.byteLength;case Fl:return i*t*2/s.components*s.byteLength;case yd:return i*t*3/s.components*s.byteLength;case gn:return i*t*4/s.components*s.byteLength;case zl:return i*t*4/s.components*s.byteLength;case so:case ro:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case oo:case ao:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Xa:case Ya:return Math.max(i,16)*Math.max(t,8)/4;case Wa:case $a:return Math.max(i,8)*Math.max(t,8)/2;case qa:case ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Za:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ka:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ja:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Qa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case tl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case el:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case nl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case il:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case sl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case rl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ol:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case al:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ll:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case cl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case hl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case lo:case dl:case ul:return Math.ceil(i/4)*Math.ceil(t/4)*16;case wd:case fl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case pl:case ml:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Dv(i){switch(i){case qn:case gd:return{byteLength:1,components:1};case nr:case _d:case lr:return{byteLength:2,components:1};case Il:case Ul:return{byteLength:2,components:4};case Fi:case Dl:case Pn:return{byteLength:4,components:1};case vd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Iv(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new pt,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,b){return f?new OffscreenCanvas(C,b):fo("canvas")}function _(C,b,B){let j=1;const K=wt(C);if((K.width>B||K.height>B)&&(j=B/Math.max(K.width,K.height)),j<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const q=Math.floor(j*K.width),bt=Math.floor(j*K.height);d===void 0&&(d=g(q,bt));const ot=b?g(q,bt):d;return ot.width=q,ot.height=bt,ot.getContext("2d").drawImage(C,0,0,q,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+q+"x"+bt+")."),ot}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){i.generateMipmap(C)}function x(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(C,b,B,j,K=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let q=b;if(b===i.RED&&(B===i.FLOAT&&(q=i.R32F),B===i.HALF_FLOAT&&(q=i.R16F),B===i.UNSIGNED_BYTE&&(q=i.R8)),b===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.R8UI),B===i.UNSIGNED_SHORT&&(q=i.R16UI),B===i.UNSIGNED_INT&&(q=i.R32UI),B===i.BYTE&&(q=i.R8I),B===i.SHORT&&(q=i.R16I),B===i.INT&&(q=i.R32I)),b===i.RG&&(B===i.FLOAT&&(q=i.RG32F),B===i.HALF_FLOAT&&(q=i.RG16F),B===i.UNSIGNED_BYTE&&(q=i.RG8)),b===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RG8UI),B===i.UNSIGNED_SHORT&&(q=i.RG16UI),B===i.UNSIGNED_INT&&(q=i.RG32UI),B===i.BYTE&&(q=i.RG8I),B===i.SHORT&&(q=i.RG16I),B===i.INT&&(q=i.RG32I)),b===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RGB8UI),B===i.UNSIGNED_SHORT&&(q=i.RGB16UI),B===i.UNSIGNED_INT&&(q=i.RGB32UI),B===i.BYTE&&(q=i.RGB8I),B===i.SHORT&&(q=i.RGB16I),B===i.INT&&(q=i.RGB32I)),b===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),B===i.UNSIGNED_INT&&(q=i.RGBA32UI),B===i.BYTE&&(q=i.RGBA8I),B===i.SHORT&&(q=i.RGBA16I),B===i.INT&&(q=i.RGBA32I)),b===i.RGB&&B===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),b===i.RGBA){const bt=K?wo:Wt.getTransfer(j);B===i.FLOAT&&(q=i.RGBA32F),B===i.HALF_FLOAT&&(q=i.RGBA16F),B===i.UNSIGNED_BYTE&&(q=bt===te?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function v(C,b){let B;return C?b===null||b===Fi||b===bs?B=i.DEPTH24_STENCIL8:b===Pn?B=i.DEPTH32F_STENCIL8:b===nr&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Fi||b===bs?B=i.DEPTH_COMPONENT24:b===Pn?B=i.DEPTH_COMPONENT32F:b===nr&&(B=i.DEPTH_COMPONENT16),B}function T(C,b){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ke&&C.minFilter!==Rn?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function E(C){const b=C.target;b.removeEventListener("dispose",E),P(b),b.isVideoTexture&&h.delete(b)}function A(C){const b=C.target;b.removeEventListener("dispose",A),M(b)}function P(C){const b=n.get(C);if(b.__webglInit===void 0)return;const B=C.source,j=u.get(B);if(j){const K=j[b.__cacheKey];K.usedTimes--,K.usedTimes===0&&S(C),Object.keys(j).length===0&&u.delete(B)}n.remove(C)}function S(C){const b=n.get(C);i.deleteTexture(b.__webglTexture);const B=C.source,j=u.get(B);delete j[b.__cacheKey],o.memory.textures--}function M(C){const b=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(b.__webglFramebuffer[j]))for(let K=0;K<b.__webglFramebuffer[j].length;K++)i.deleteFramebuffer(b.__webglFramebuffer[j][K]);else i.deleteFramebuffer(b.__webglFramebuffer[j]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[j])}else{if(Array.isArray(b.__webglFramebuffer))for(let j=0;j<b.__webglFramebuffer.length;j++)i.deleteFramebuffer(b.__webglFramebuffer[j]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let j=0;j<b.__webglColorRenderbuffer.length;j++)b.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[j]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const B=C.textures;for(let j=0,K=B.length;j<K;j++){const q=n.get(B[j]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(B[j])}n.remove(C)}let L=0;function z(){L=0}function D(){const C=L;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),L+=1,C}function F(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function k(C,b){const B=n.get(C);if(C.isVideoTexture&&Et(C),C.isRenderTargetTexture===!1&&C.version>0&&B.__version!==C.version){const j=C.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(B,C,b);return}}e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+b)}function H(C,b){const B=n.get(C);if(C.version>0&&B.__version!==C.version){Y(B,C,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+b)}function X(C,b){const B=n.get(C);if(C.version>0&&B.__version!==C.version){Y(B,C,b);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+b)}function W(C,b){const B=n.get(C);if(C.version>0&&B.__version!==C.version){nt(B,C,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+b)}const Q={[Ga]:i.REPEAT,[Pi]:i.CLAMP_TO_EDGE,[Va]:i.MIRRORED_REPEAT},ht={[Ke]:i.NEAREST,[op]:i.NEAREST_MIPMAP_NEAREST,[pr]:i.NEAREST_MIPMAP_LINEAR,[Rn]:i.LINEAR,[Bo]:i.LINEAR_MIPMAP_NEAREST,[Li]:i.LINEAR_MIPMAP_LINEAR},_t={[hp]:i.NEVER,[gp]:i.ALWAYS,[dp]:i.LESS,[Td]:i.LEQUAL,[up]:i.EQUAL,[mp]:i.GEQUAL,[fp]:i.GREATER,[pp]:i.NOTEQUAL};function Pt(C,b){if(b.type===Pn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Rn||b.magFilter===Bo||b.magFilter===pr||b.magFilter===Li||b.minFilter===Rn||b.minFilter===Bo||b.minFilter===pr||b.minFilter===Li)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Q[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Q[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Q[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,ht[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,ht[b.minFilter]),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,_t[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Ke||b.minFilter!==pr&&b.minFilter!==Li||b.type===Pn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Kt(C,b){let B=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",E));const j=b.source;let K=u.get(j);K===void 0&&(K={},u.set(j,K));const q=F(b);if(q!==C.__cacheKey){K[q]===void 0&&(K[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),K[q].usedTimes++;const bt=K[C.__cacheKey];bt!==void 0&&(K[C.__cacheKey].usedTimes--,bt.usedTimes===0&&S(b)),C.__cacheKey=q,C.__webglTexture=K[q].texture}return B}function Y(C,b,B){let j=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(j=i.TEXTURE_3D);const K=Kt(C,b),q=b.source;e.bindTexture(j,C.__webglTexture,i.TEXTURE0+B);const bt=n.get(q);if(q.version!==bt.__version||K===!0){e.activeTexture(i.TEXTURE0+B);const ot=Wt.getPrimaries(Wt.workingColorSpace),ft=b.colorSpace===ai?null:Wt.getPrimaries(b.colorSpace),Vt=b.colorSpace===ai||ot===ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt);let tt=_(b.image,!1,s.maxTextureSize);tt=ae(b,tt);const mt=r.convert(b.format,b.colorSpace),Tt=r.convert(b.type);let Ct=y(b.internalFormat,mt,Tt,b.colorSpace,b.isVideoTexture);Pt(j,b);let gt;const Bt=b.mipmaps,Nt=b.isVideoTexture!==!0,re=bt.__version===void 0||K===!0,I=q.dataReady,st=T(b,tt);if(b.isDepthTexture)Ct=v(b.format===Ss,b.type),re&&(Nt?e.texStorage2D(i.TEXTURE_2D,1,Ct,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,Ct,tt.width,tt.height,0,mt,Tt,null));else if(b.isDataTexture)if(Bt.length>0){Nt&&re&&e.texStorage2D(i.TEXTURE_2D,st,Ct,Bt[0].width,Bt[0].height);for(let $=0,Z=Bt.length;$<Z;$++)gt=Bt[$],Nt?I&&e.texSubImage2D(i.TEXTURE_2D,$,0,0,gt.width,gt.height,mt,Tt,gt.data):e.texImage2D(i.TEXTURE_2D,$,Ct,gt.width,gt.height,0,mt,Tt,gt.data);b.generateMipmaps=!1}else Nt?(re&&e.texStorage2D(i.TEXTURE_2D,st,Ct,tt.width,tt.height),I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,tt.width,tt.height,mt,Tt,tt.data)):e.texImage2D(i.TEXTURE_2D,0,Ct,tt.width,tt.height,0,mt,Tt,tt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Nt&&re&&e.texStorage3D(i.TEXTURE_2D_ARRAY,st,Ct,Bt[0].width,Bt[0].height,tt.depth);for(let $=0,Z=Bt.length;$<Z;$++)if(gt=Bt[$],b.format!==gn)if(mt!==null)if(Nt){if(I)if(b.layerUpdates.size>0){const dt=mh(gt.width,gt.height,b.format,b.type);for(const lt of b.layerUpdates){const Dt=gt.data.subarray(lt*dt/gt.data.BYTES_PER_ELEMENT,(lt+1)*dt/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,lt,gt.width,gt.height,1,mt,Dt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,gt.width,gt.height,tt.depth,mt,gt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,Ct,gt.width,gt.height,tt.depth,0,gt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,gt.width,gt.height,tt.depth,mt,Tt,gt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,$,Ct,gt.width,gt.height,tt.depth,0,mt,Tt,gt.data)}else{Nt&&re&&e.texStorage2D(i.TEXTURE_2D,st,Ct,Bt[0].width,Bt[0].height);for(let $=0,Z=Bt.length;$<Z;$++)gt=Bt[$],b.format!==gn?mt!==null?Nt?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,gt.width,gt.height,mt,gt.data):e.compressedTexImage2D(i.TEXTURE_2D,$,Ct,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?I&&e.texSubImage2D(i.TEXTURE_2D,$,0,0,gt.width,gt.height,mt,Tt,gt.data):e.texImage2D(i.TEXTURE_2D,$,Ct,gt.width,gt.height,0,mt,Tt,gt.data)}else if(b.isDataArrayTexture)if(Nt){if(re&&e.texStorage3D(i.TEXTURE_2D_ARRAY,st,Ct,tt.width,tt.height,tt.depth),I)if(b.layerUpdates.size>0){const $=mh(tt.width,tt.height,b.format,b.type);for(const Z of b.layerUpdates){const dt=tt.data.subarray(Z*$/tt.data.BYTES_PER_ELEMENT,(Z+1)*$/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Z,tt.width,tt.height,1,mt,Tt,dt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,mt,Tt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ct,tt.width,tt.height,tt.depth,0,mt,Tt,tt.data);else if(b.isData3DTexture)Nt?(re&&e.texStorage3D(i.TEXTURE_3D,st,Ct,tt.width,tt.height,tt.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,mt,Tt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,Ct,tt.width,tt.height,tt.depth,0,mt,Tt,tt.data);else if(b.isFramebufferTexture){if(re)if(Nt)e.texStorage2D(i.TEXTURE_2D,st,Ct,tt.width,tt.height);else{let $=tt.width,Z=tt.height;for(let dt=0;dt<st;dt++)e.texImage2D(i.TEXTURE_2D,dt,Ct,$,Z,0,mt,Tt,null),$>>=1,Z>>=1}}else if(Bt.length>0){if(Nt&&re){const $=wt(Bt[0]);e.texStorage2D(i.TEXTURE_2D,st,Ct,$.width,$.height)}for(let $=0,Z=Bt.length;$<Z;$++)gt=Bt[$],Nt?I&&e.texSubImage2D(i.TEXTURE_2D,$,0,0,mt,Tt,gt):e.texImage2D(i.TEXTURE_2D,$,Ct,mt,Tt,gt);b.generateMipmaps=!1}else if(Nt){if(re){const $=wt(tt);e.texStorage2D(i.TEXTURE_2D,st,Ct,$.width,$.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,mt,Tt,tt)}else e.texImage2D(i.TEXTURE_2D,0,Ct,mt,Tt,tt);m(b)&&p(j),bt.__version=q.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function nt(C,b,B){if(b.image.length!==6)return;const j=Kt(C,b),K=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+B);const q=n.get(K);if(K.version!==q.__version||j===!0){e.activeTexture(i.TEXTURE0+B);const bt=Wt.getPrimaries(Wt.workingColorSpace),ot=b.colorSpace===ai?null:Wt.getPrimaries(b.colorSpace),ft=b.colorSpace===ai||bt===ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);const Vt=b.isCompressedTexture||b.image[0].isCompressedTexture,tt=b.image[0]&&b.image[0].isDataTexture,mt=[];for(let Z=0;Z<6;Z++)!Vt&&!tt?mt[Z]=_(b.image[Z],!0,s.maxCubemapSize):mt[Z]=tt?b.image[Z].image:b.image[Z],mt[Z]=ae(b,mt[Z]);const Tt=mt[0],Ct=r.convert(b.format,b.colorSpace),gt=r.convert(b.type),Bt=y(b.internalFormat,Ct,gt,b.colorSpace),Nt=b.isVideoTexture!==!0,re=q.__version===void 0||j===!0,I=K.dataReady;let st=T(b,Tt);Pt(i.TEXTURE_CUBE_MAP,b);let $;if(Vt){Nt&&re&&e.texStorage2D(i.TEXTURE_CUBE_MAP,st,Bt,Tt.width,Tt.height);for(let Z=0;Z<6;Z++){$=mt[Z].mipmaps;for(let dt=0;dt<$.length;dt++){const lt=$[dt];b.format!==gn?Ct!==null?Nt?I&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,dt,0,0,lt.width,lt.height,Ct,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,dt,Bt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,dt,0,0,lt.width,lt.height,Ct,gt,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,dt,Bt,lt.width,lt.height,0,Ct,gt,lt.data)}}}else{if($=b.mipmaps,Nt&&re){$.length>0&&st++;const Z=wt(mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,st,Bt,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(tt){Nt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,mt[Z].width,mt[Z].height,Ct,gt,mt[Z].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Bt,mt[Z].width,mt[Z].height,0,Ct,gt,mt[Z].data);for(let dt=0;dt<$.length;dt++){const Dt=$[dt].image[Z].image;Nt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,dt+1,0,0,Dt.width,Dt.height,Ct,gt,Dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,dt+1,Bt,Dt.width,Dt.height,0,Ct,gt,Dt.data)}}else{Nt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Ct,gt,mt[Z]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Bt,Ct,gt,mt[Z]);for(let dt=0;dt<$.length;dt++){const lt=$[dt];Nt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,dt+1,0,0,Ct,gt,lt.image[Z]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,dt+1,Bt,Ct,gt,lt.image[Z])}}}m(b)&&p(i.TEXTURE_CUBE_MAP),q.__version=K.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function Mt(C,b,B,j,K,q){const bt=r.convert(B.format,B.colorSpace),ot=r.convert(B.type),ft=y(B.internalFormat,bt,ot,B.colorSpace),Vt=n.get(b),tt=n.get(B);if(tt.__renderTarget=b,!Vt.__hasExternalTextures){const mt=Math.max(1,b.width>>q),Tt=Math.max(1,b.height>>q);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,q,ft,mt,Tt,b.depth,0,bt,ot,null):e.texImage2D(K,q,ft,mt,Tt,0,bt,ot,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),kt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,K,tt.__webglTexture,0,zt(b)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,K,tt.__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function rt(C,b,B){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer){const j=b.depthTexture,K=j&&j.isDepthTexture?j.type:null,q=v(b.stencilBuffer,K),bt=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=zt(b);kt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,q,b.width,b.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,q,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,q,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,bt,i.RENDERBUFFER,C)}else{const j=b.textures;for(let K=0;K<j.length;K++){const q=j[K],bt=r.convert(q.format,q.colorSpace),ot=r.convert(q.type),ft=y(q.internalFormat,bt,ot,q.colorSpace),Vt=zt(b);B&&kt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,ft,b.width,b.height):kt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Vt,ft,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ft,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function At(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=n.get(b.depthTexture);j.__renderTarget=b,(!j.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),k(b.depthTexture,0);const K=j.__webglTexture,q=zt(b);if(b.depthTexture.format===gs)kt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(b.depthTexture.format===Ss)kt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function Lt(C){const b=n.get(C),B=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){const j=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),j){const K=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,j.removeEventListener("dispose",K)};j.addEventListener("dispose",K),b.__depthDisposeCallback=K}b.__boundDepthTexture=j}if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");At(b.__webglFramebuffer,C)}else if(B){b.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[j]),b.__webglDepthbuffer[j]===void 0)b.__webglDepthbuffer[j]=i.createRenderbuffer(),rt(b.__webglDepthbuffer[j],C,!1);else{const K=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=b.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),rt(b.__webglDepthbuffer,C,!1);else{const j=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,K)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ft(C,b,B){const j=n.get(C);b!==void 0&&Mt(j.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Lt(C)}function de(C){const b=C.texture,B=n.get(C),j=n.get(b);C.addEventListener("dispose",A);const K=C.textures,q=C.isWebGLCubeRenderTarget===!0,bt=K.length>1;if(bt||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=b.version,o.memory.textures++),q){B.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(b.mipmaps&&b.mipmaps.length>0){B.__webglFramebuffer[ot]=[];for(let ft=0;ft<b.mipmaps.length;ft++)B.__webglFramebuffer[ot][ft]=i.createFramebuffer()}else B.__webglFramebuffer[ot]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){B.__webglFramebuffer=[];for(let ot=0;ot<b.mipmaps.length;ot++)B.__webglFramebuffer[ot]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(bt)for(let ot=0,ft=K.length;ot<ft;ot++){const Vt=n.get(K[ot]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&kt(C)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ot=0;ot<K.length;ot++){const ft=K[ot];B.__webglColorRenderbuffer[ot]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[ot]);const Vt=r.convert(ft.format,ft.colorSpace),tt=r.convert(ft.type),mt=y(ft.internalFormat,Vt,tt,ft.colorSpace,C.isXRRenderTarget===!0),Tt=zt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt,mt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,B.__webglColorRenderbuffer[ot])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),rt(B.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),Pt(i.TEXTURE_CUBE_MAP,b);for(let ot=0;ot<6;ot++)if(b.mipmaps&&b.mipmaps.length>0)for(let ft=0;ft<b.mipmaps.length;ft++)Mt(B.__webglFramebuffer[ot][ft],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,ft);else Mt(B.__webglFramebuffer[ot],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);m(b)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let ot=0,ft=K.length;ot<ft;ot++){const Vt=K[ot],tt=n.get(Vt);e.bindTexture(i.TEXTURE_2D,tt.__webglTexture),Pt(i.TEXTURE_2D,Vt),Mt(B.__webglFramebuffer,C,Vt,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,0),m(Vt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let ot=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ot=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ot,j.__webglTexture),Pt(ot,b),b.mipmaps&&b.mipmaps.length>0)for(let ft=0;ft<b.mipmaps.length;ft++)Mt(B.__webglFramebuffer[ft],C,b,i.COLOR_ATTACHMENT0,ot,ft);else Mt(B.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,ot,0);m(b)&&p(ot),e.unbindTexture()}C.depthBuffer&&Lt(C)}function Gt(C){const b=C.textures;for(let B=0,j=b.length;B<j;B++){const K=b[B];if(m(K)){const q=x(C),bt=n.get(K).__webglTexture;e.bindTexture(q,bt),p(q),e.unbindTexture()}}}const pe=[],O=[];function tn(C){if(C.samples>0){if(kt(C)===!1){const b=C.textures,B=C.width,j=C.height;let K=i.COLOR_BUFFER_BIT;const q=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=n.get(C),ot=b.length>1;if(ot)for(let ft=0;ft<b.length;ft++)e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let ft=0;ft<b.length;ft++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),ot){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,bt.__webglColorRenderbuffer[ft]);const Vt=n.get(b[ft]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Vt,0)}i.blitFramebuffer(0,0,B,j,0,0,B,j,K,i.NEAREST),l===!0&&(pe.length=0,O.length=0,pe.push(i.COLOR_ATTACHMENT0+ft),C.depthBuffer&&C.resolveDepthBuffer===!1&&(pe.push(q),O.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,O)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,pe))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ot)for(let ft=0;ft<b.length;ft++){e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,bt.__webglColorRenderbuffer[ft]);const Vt=n.get(b[ft]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,Vt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const b=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function zt(C){return Math.min(s.maxSamples,C.samples)}function kt(C){const b=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Et(C){const b=o.render.frame;h.get(C)!==b&&(h.set(C,b),C.update())}function ae(C,b){const B=C.colorSpace,j=C.format,K=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||B!==As&&B!==ai&&(Wt.getTransfer(B)===te?(j!==gn||K!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),b}function wt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=z,this.setTexture2D=k,this.setTexture2DArray=H,this.setTexture3D=X,this.setTextureCube=W,this.rebindTextures=Ft,this.setupRenderTarget=de,this.updateRenderTargetMipmap=Gt,this.updateMultisampleRenderTarget=tn,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=kt}function Uv(i,t){function e(n,s=ai){let r;const o=Wt.getTransfer(s);if(n===qn)return i.UNSIGNED_BYTE;if(n===Il)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ul)return i.UNSIGNED_SHORT_5_5_5_1;if(n===vd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gd)return i.BYTE;if(n===_d)return i.SHORT;if(n===nr)return i.UNSIGNED_SHORT;if(n===Dl)return i.INT;if(n===Fi)return i.UNSIGNED_INT;if(n===Pn)return i.FLOAT;if(n===lr)return i.HALF_FLOAT;if(n===xd)return i.ALPHA;if(n===yd)return i.RGB;if(n===gn)return i.RGBA;if(n===Md)return i.LUMINANCE;if(n===bd)return i.LUMINANCE_ALPHA;if(n===gs)return i.DEPTH_COMPONENT;if(n===Ss)return i.DEPTH_STENCIL;if(n===Nl)return i.RED;if(n===Ol)return i.RED_INTEGER;if(n===Sd)return i.RG;if(n===Fl)return i.RG_INTEGER;if(n===zl)return i.RGBA_INTEGER;if(n===so||n===ro||n===oo||n===ao)if(o===te)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===so)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ro)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===oo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ao)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===so)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ro)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===oo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ao)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Wa||n===Xa||n===$a||n===Ya)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Wa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Xa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===$a)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ya)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===qa||n===ja||n===Za)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===qa||n===ja)return o===te?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Za)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ka||n===Ja||n===Qa||n===tl||n===el||n===nl||n===il||n===sl||n===rl||n===ol||n===al||n===ll||n===cl||n===hl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ka)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ja)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Qa)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===tl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===el)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===nl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===il)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===sl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===rl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ol)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===al)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ll)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===cl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===hl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===lo||n===dl||n===ul)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===lo)return o===te?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===dl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ul)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wd||n===fl||n===pl||n===ml)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===lo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===fl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===pl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ml)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===bs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Nv extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Nr extends fe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ov={type:"move"};class fa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ov)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Nr;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Fv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class kv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new ze,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new jn({vertexShader:Fv,fragmentShader:zv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new at(new Cs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Bv extends ki{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const _=new kv,m=e.getContextAttributes();let p=null,x=null;const y=[],v=[],T=new pt;let E=null;const A=new rn;A.viewport=new se;const P=new rn;P.viewport=new se;const S=[A,P],M=new Nv;let L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let nt=y[Y];return nt===void 0&&(nt=new fa,y[Y]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Y){let nt=y[Y];return nt===void 0&&(nt=new fa,y[Y]=nt),nt.getGripSpace()},this.getHand=function(Y){let nt=y[Y];return nt===void 0&&(nt=new fa,y[Y]=nt),nt.getHandSpace()};function D(Y){const nt=v.indexOf(Y.inputSource);if(nt===-1)return;const Mt=y[nt];Mt!==void 0&&(Mt.update(Y.inputSource,Y.frame,c||o),Mt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function F(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",k);for(let Y=0;Y<y.length;Y++){const nt=v[Y];nt!==null&&(v[Y]=null,y[Y].disconnect(nt))}L=null,z=null,_.reset(),t.setRenderTarget(p),f=null,u=null,d=null,s=null,x=null,Kt.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",F),s.addEventListener("inputsourceschange",k),m.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(T),s.renderState.layers===void 0){const nt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,nt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new zi(f.framebufferWidth,f.framebufferHeight,{format:gn,type:qn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let nt=null,Mt=null,rt=null;m.depth&&(rt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=m.stencil?Ss:gs,Mt=m.stencil?bs:Fi);const At={colorFormat:e.RGBA8,depthFormat:rt,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(At),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),x=new zi(u.textureWidth,u.textureHeight,{format:gn,type:qn,depthTexture:new Fd(u.textureWidth,u.textureHeight,Mt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Kt.setContext(s),Kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function k(Y){for(let nt=0;nt<Y.removed.length;nt++){const Mt=Y.removed[nt],rt=v.indexOf(Mt);rt>=0&&(v[rt]=null,y[rt].disconnect(Mt))}for(let nt=0;nt<Y.added.length;nt++){const Mt=Y.added[nt];let rt=v.indexOf(Mt);if(rt===-1){for(let Lt=0;Lt<y.length;Lt++)if(Lt>=v.length){v.push(Mt),rt=Lt;break}else if(v[Lt]===null){v[Lt]=Mt,rt=Lt;break}if(rt===-1)break}const At=y[rt];At&&At.connect(Mt)}}const H=new R,X=new R;function W(Y,nt,Mt){H.setFromMatrixPosition(nt.matrixWorld),X.setFromMatrixPosition(Mt.matrixWorld);const rt=H.distanceTo(X),At=nt.projectionMatrix.elements,Lt=Mt.projectionMatrix.elements,Ft=At[14]/(At[10]-1),de=At[14]/(At[10]+1),Gt=(At[9]+1)/At[5],pe=(At[9]-1)/At[5],O=(At[8]-1)/At[0],tn=(Lt[8]+1)/Lt[0],zt=Ft*O,kt=Ft*tn,Et=rt/(-O+tn),ae=Et*-O;if(nt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ae),Y.translateZ(Et),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),At[10]===-1)Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const wt=Ft+Et,C=de+Et,b=zt-ae,B=kt+(rt-ae),j=Gt*de/C*wt,K=pe*de/C*wt;Y.projectionMatrix.makePerspective(b,B,j,K,wt,C),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Q(Y,nt){nt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(nt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let nt=Y.near,Mt=Y.far;_.texture!==null&&(_.depthNear>0&&(nt=_.depthNear),_.depthFar>0&&(Mt=_.depthFar)),M.near=P.near=A.near=nt,M.far=P.far=A.far=Mt,(L!==M.near||z!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),L=M.near,z=M.far),A.layers.mask=Y.layers.mask|2,P.layers.mask=Y.layers.mask|4,M.layers.mask=A.layers.mask|P.layers.mask;const rt=Y.parent,At=M.cameras;Q(M,rt);for(let Lt=0;Lt<At.length;Lt++)Q(At[Lt],rt);At.length===2?W(M,A,P):M.projectionMatrix.copy(A.projectionMatrix),ht(Y,M,rt)};function ht(Y,nt,Mt){Mt===null?Y.matrix.copy(nt.matrixWorld):(Y.matrix.copy(Mt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(nt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=ir*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let _t=null;function Pt(Y,nt){if(h=nt.getViewerPose(c||o),g=nt,h!==null){const Mt=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let rt=!1;Mt.length!==M.cameras.length&&(M.cameras.length=0,rt=!0);for(let Lt=0;Lt<Mt.length;Lt++){const Ft=Mt[Lt];let de=null;if(f!==null)de=f.getViewport(Ft);else{const pe=d.getViewSubImage(u,Ft);de=pe.viewport,Lt===0&&(t.setRenderTargetTextures(x,pe.colorTexture,u.ignoreDepthValues?void 0:pe.depthStencilTexture),t.setRenderTarget(x))}let Gt=S[Lt];Gt===void 0&&(Gt=new rn,Gt.layers.enable(Lt),Gt.viewport=new se,S[Lt]=Gt),Gt.matrix.fromArray(Ft.transform.matrix),Gt.matrix.decompose(Gt.position,Gt.quaternion,Gt.scale),Gt.projectionMatrix.fromArray(Ft.projectionMatrix),Gt.projectionMatrixInverse.copy(Gt.projectionMatrix).invert(),Gt.viewport.set(de.x,de.y,de.width,de.height),Lt===0&&(M.matrix.copy(Gt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),rt===!0&&M.cameras.push(Gt)}const At=s.enabledFeatures;if(At&&At.includes("depth-sensing")){const Lt=d.getDepthInformation(Mt[0]);Lt&&Lt.isValid&&Lt.texture&&_.init(t,Lt,s.renderState)}}for(let Mt=0;Mt<y.length;Mt++){const rt=v[Mt],At=y[Mt];rt!==null&&At!==void 0&&At.update(rt,nt,c||o)}_t&&_t(Y,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}const Kt=new Od;Kt.setAnimationLoop(Pt),this.setAnimationLoop=function(Y){_t=Y},this.dispose=function(){}}}const yi=new _n,Hv=new $t;function Gv(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Id(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,y,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,x,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===He&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===He&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),y=x.envMap,v=x.envMapRotation;y&&(m.envMap.value=y,yi.copy(v),yi.x*=-1,yi.y*=-1,yi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(yi.y*=-1,yi.z*=-1),m.envMapRotation.value.setFromMatrix4(Hv.makeRotationFromEuler(yi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===He&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Vv(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const v=y.program;n.uniformBlockBinding(x,v)}function c(x,y){let v=s[x.id];v===void 0&&(g(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",m));const T=y.program;n.updateUBOMapping(x,T);const E=t.render.frame;r[x.id]!==E&&(u(x),r[x.id]=E)}function h(x){const y=d();x.__bindingPointIndex=y;const v=i.createBuffer(),T=x.__size,E=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,T,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,v),v}function d(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const y=s[x.id],v=x.uniforms,T=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let E=0,A=v.length;E<A;E++){const P=Array.isArray(v[E])?v[E]:[v[E]];for(let S=0,M=P.length;S<M;S++){const L=P[S];if(f(L,E,S,T)===!0){const z=L.__offset,D=Array.isArray(L.value)?L.value:[L.value];let F=0;for(let k=0;k<D.length;k++){const H=D[k],X=_(H);typeof H=="number"||typeof H=="boolean"?(L.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,z+F,L.__data)):H.isMatrix3?(L.__data[0]=H.elements[0],L.__data[1]=H.elements[1],L.__data[2]=H.elements[2],L.__data[3]=0,L.__data[4]=H.elements[3],L.__data[5]=H.elements[4],L.__data[6]=H.elements[5],L.__data[7]=0,L.__data[8]=H.elements[6],L.__data[9]=H.elements[7],L.__data[10]=H.elements[8],L.__data[11]=0):(H.toArray(L.__data,F),F+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(x,y,v,T){const E=x.value,A=y+"_"+v;if(T[A]===void 0)return typeof E=="number"||typeof E=="boolean"?T[A]=E:T[A]=E.clone(),!0;{const P=T[A];if(typeof E=="number"||typeof E=="boolean"){if(P!==E)return T[A]=E,!0}else if(P.equals(E)===!1)return P.copy(E),!0}return!1}function g(x){const y=x.uniforms;let v=0;const T=16;for(let A=0,P=y.length;A<P;A++){const S=Array.isArray(y[A])?y[A]:[y[A]];for(let M=0,L=S.length;M<L;M++){const z=S[M],D=Array.isArray(z.value)?z.value:[z.value];for(let F=0,k=D.length;F<k;F++){const H=D[F],X=_(H),W=v%T,Q=W%X.boundary,ht=W+Q;v+=Q,ht!==0&&T-ht<X.storage&&(v+=T-ht),z.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=X.storage}}}const E=v%T;return E>0&&(v+=T-E),x.__size=v,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const v=o.indexOf(y.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(const x in s)i.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class Wv{constructor(t={}){const{canvas:e=Ip(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ze,this.toneMapping=hi,this.toneMappingExposure=1;const v=this;let T=!1,E=0,A=0,P=null,S=-1,M=null;const L=new se,z=new se;let D=null;const F=new Ht(0);let k=0,H=e.width,X=e.height,W=1,Q=null,ht=null;const _t=new se(0,0,H,X),Pt=new se(0,0,H,X);let Kt=!1;const Y=new Gl;let nt=!1,Mt=!1;const rt=new $t,At=new $t,Lt=new R,Ft=new se,de={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Gt=!1;function pe(){return P===null?W:1}let O=n;function tn(w,U){return e.getContext(w,U)}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Pl}`),e.addEventListener("webglcontextlost",Z,!1),e.addEventListener("webglcontextrestored",dt,!1),e.addEventListener("webglcontextcreationerror",lt,!1),O===null){const U="webgl2";if(O=tn(U,w),O===null)throw tn(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let zt,kt,Et,ae,wt,C,b,B,j,K,q,bt,ot,ft,Vt,tt,mt,Tt,Ct,gt,Bt,Nt,re,I;function st(){zt=new j_(O),zt.init(),Nt=new Uv(O,zt),kt=new V_(O,zt,t,Nt),Et=new Lv(O,zt),kt.reverseDepthBuffer&&u&&Et.buffers.depth.setReversed(!0),ae=new J_(O),wt=new gv,C=new Iv(O,zt,Et,wt,kt,Nt,ae),b=new X_(v),B=new q_(v),j=new rm(O),re=new H_(O,j),K=new Z_(O,j,ae,re),q=new t0(O,K,j,ae),Ct=new Q_(O,kt,C),tt=new W_(wt),bt=new mv(v,b,B,zt,kt,re,tt),ot=new Gv(v,wt),ft=new vv,Vt=new wv(zt),Tt=new B_(v,b,B,Et,q,f,l),mt=new Rv(v,q,kt),I=new Vv(O,ae,kt,Et),gt=new G_(O,zt,ae),Bt=new K_(O,zt,ae),ae.programs=bt.programs,v.capabilities=kt,v.extensions=zt,v.properties=wt,v.renderLists=ft,v.shadowMap=mt,v.state=Et,v.info=ae}st();const $=new Bv(v,O);this.xr=$,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const w=zt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=zt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(w){w!==void 0&&(W=w,this.setSize(H,X,!1))},this.getSize=function(w){return w.set(H,X)},this.setSize=function(w,U,G=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=w,X=U,e.width=Math.floor(w*W),e.height=Math.floor(U*W),G===!0&&(e.style.width=w+"px",e.style.height=U+"px"),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(H*W,X*W).floor()},this.setDrawingBufferSize=function(w,U,G){H=w,X=U,W=G,e.width=Math.floor(w*G),e.height=Math.floor(U*G),this.setViewport(0,0,w,U)},this.getCurrentViewport=function(w){return w.copy(L)},this.getViewport=function(w){return w.copy(_t)},this.setViewport=function(w,U,G,V){w.isVector4?_t.set(w.x,w.y,w.z,w.w):_t.set(w,U,G,V),Et.viewport(L.copy(_t).multiplyScalar(W).round())},this.getScissor=function(w){return w.copy(Pt)},this.setScissor=function(w,U,G,V){w.isVector4?Pt.set(w.x,w.y,w.z,w.w):Pt.set(w,U,G,V),Et.scissor(z.copy(Pt).multiplyScalar(W).round())},this.getScissorTest=function(){return Kt},this.setScissorTest=function(w){Et.setScissorTest(Kt=w)},this.setOpaqueSort=function(w){Q=w},this.setTransparentSort=function(w){ht=w},this.getClearColor=function(w){return w.copy(Tt.getClearColor())},this.setClearColor=function(){Tt.setClearColor.apply(Tt,arguments)},this.getClearAlpha=function(){return Tt.getClearAlpha()},this.setClearAlpha=function(){Tt.setClearAlpha.apply(Tt,arguments)},this.clear=function(w=!0,U=!0,G=!0){let V=0;if(w){let N=!1;if(P!==null){const et=P.texture.format;N=et===zl||et===Fl||et===Ol}if(N){const et=P.texture.type,ct=et===qn||et===Fi||et===nr||et===bs||et===Il||et===Ul,vt=Tt.getClearColor(),xt=Tt.getClearAlpha(),Rt=vt.r,It=vt.g,yt=vt.b;ct?(g[0]=Rt,g[1]=It,g[2]=yt,g[3]=xt,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Rt,_[1]=It,_[2]=yt,_[3]=xt,O.clearBufferiv(O.COLOR,0,_))}else V|=O.COLOR_BUFFER_BIT}U&&(V|=O.DEPTH_BUFFER_BIT),G&&(V|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Z,!1),e.removeEventListener("webglcontextrestored",dt,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),ft.dispose(),Vt.dispose(),wt.dispose(),b.dispose(),B.dispose(),q.dispose(),re.dispose(),I.dispose(),bt.dispose(),$.dispose(),$.removeEventListener("sessionstart",nc),$.removeEventListener("sessionend",ic),fi.stop()};function Z(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function dt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const w=ae.autoReset,U=mt.enabled,G=mt.autoUpdate,V=mt.needsUpdate,N=mt.type;st(),ae.autoReset=w,mt.enabled=U,mt.autoUpdate=G,mt.needsUpdate=V,mt.type=N}function lt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Dt(w){const U=w.target;U.removeEventListener("dispose",Dt),ue(U)}function ue(w){Ue(w),wt.remove(w)}function Ue(w){const U=wt.get(w).programs;U!==void 0&&(U.forEach(function(G){bt.releaseProgram(G)}),w.isShaderMaterial&&bt.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,G,V,N,et){U===null&&(U=de);const ct=N.isMesh&&N.matrixWorld.determinant()<0,vt=fu(w,U,G,V,N);Et.setMaterial(V,ct);let xt=G.index,Rt=1;if(V.wireframe===!0){if(xt=K.getWireframeAttribute(G),xt===void 0)return;Rt=2}const It=G.drawRange,yt=G.attributes.position;let Xt=It.start*Rt,oe=(It.start+It.count)*Rt;et!==null&&(Xt=Math.max(Xt,et.start*Rt),oe=Math.min(oe,(et.start+et.count)*Rt)),xt!==null?(Xt=Math.max(Xt,0),oe=Math.min(oe,xt.count)):yt!=null&&(Xt=Math.max(Xt,0),oe=Math.min(oe,yt.count));const le=oe-Xt;if(le<0||le===1/0)return;re.setup(N,V,vt,G,xt);let Ge,qt=gt;if(xt!==null&&(Ge=j.get(xt),qt=Bt,qt.setIndex(Ge)),N.isMesh)V.wireframe===!0?(Et.setLineWidth(V.wireframeLinewidth*pe()),qt.setMode(O.LINES)):qt.setMode(O.TRIANGLES);else if(N.isLine){let St=V.linewidth;St===void 0&&(St=1),Et.setLineWidth(St*pe()),N.isLineSegments?qt.setMode(O.LINES):N.isLineLoop?qt.setMode(O.LINE_LOOP):qt.setMode(O.LINE_STRIP)}else N.isPoints?qt.setMode(O.POINTS):N.isSprite&&qt.setMode(O.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)qt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(zt.get("WEBGL_multi_draw"))qt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const St=N._multiDrawStarts,Un=N._multiDrawCounts,jt=N._multiDrawCount,cn=xt?j.get(xt).bytesPerElement:1,Gi=wt.get(V).currentProgram.getUniforms();for(let $e=0;$e<jt;$e++)Gi.setValue(O,"_gl_DrawID",$e),qt.render(St[$e]/cn,Un[$e])}else if(N.isInstancedMesh)qt.renderInstances(Xt,le,N.count);else if(G.isInstancedBufferGeometry){const St=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Un=Math.min(G.instanceCount,St);qt.renderInstances(Xt,le,Un)}else qt.render(Xt,le)};function Jt(w,U,G){w.transparent===!0&&w.side===En&&w.forceSinglePass===!1?(w.side=He,w.needsUpdate=!0,hr(w,U,G),w.side=Yn,w.needsUpdate=!0,hr(w,U,G),w.side=En):hr(w,U,G)}this.compile=function(w,U,G=null){G===null&&(G=w),p=Vt.get(G),p.init(U),y.push(p),G.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),w!==G&&w.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const V=new Set;return w.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const et=N.material;if(et)if(Array.isArray(et))for(let ct=0;ct<et.length;ct++){const vt=et[ct];Jt(vt,G,N),V.add(vt)}else Jt(et,G,N),V.add(et)}),y.pop(),p=null,V},this.compileAsync=function(w,U,G=null){const V=this.compile(w,U,G);return new Promise(N=>{function et(){if(V.forEach(function(ct){wt.get(ct).currentProgram.isReady()&&V.delete(ct)}),V.size===0){N(w);return}setTimeout(et,10)}zt.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let ln=null;function In(w){ln&&ln(w)}function nc(){fi.stop()}function ic(){fi.start()}const fi=new Od;fi.setAnimationLoop(In),typeof self<"u"&&fi.setContext(self),this.setAnimationLoop=function(w){ln=w,$.setAnimationLoop(w),w===null?fi.stop():fi.start()},$.addEventListener("sessionstart",nc),$.addEventListener("sessionend",ic),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(U),U=$.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,U,P),p=Vt.get(w,y.length),p.init(U),y.push(p),At.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Y.setFromProjectionMatrix(At),Mt=this.localClippingEnabled,nt=tt.init(this.clippingPlanes,Mt),m=ft.get(w,x.length),m.init(),x.push(m),$.enabled===!0&&$.isPresenting===!0){const et=v.xr.getDepthSensingMesh();et!==null&&No(et,U,-1/0,v.sortObjects)}No(w,U,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(Q,ht),Gt=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,Gt&&Tt.addToRenderList(m,w),this.info.render.frame++,nt===!0&&tt.beginShadows();const G=p.state.shadowsArray;mt.render(G,w,U),nt===!0&&tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=m.opaque,N=m.transmissive;if(p.setupLights(),U.isArrayCamera){const et=U.cameras;if(N.length>0)for(let ct=0,vt=et.length;ct<vt;ct++){const xt=et[ct];rc(V,N,w,xt)}Gt&&Tt.render(w);for(let ct=0,vt=et.length;ct<vt;ct++){const xt=et[ct];sc(m,w,xt,xt.viewport)}}else N.length>0&&rc(V,N,w,U),Gt&&Tt.render(w),sc(m,w,U);P!==null&&(C.updateMultisampleRenderTarget(P),C.updateRenderTargetMipmap(P)),w.isScene===!0&&w.onAfterRender(v,w,U),re.resetDefaultState(),S=-1,M=null,y.pop(),y.length>0?(p=y[y.length-1],nt===!0&&tt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function No(w,U,G,V){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)G=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Y.intersectsSprite(w)){V&&Ft.setFromMatrixPosition(w.matrixWorld).applyMatrix4(At);const ct=q.update(w),vt=w.material;vt.visible&&m.push(w,ct,vt,G,Ft.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Y.intersectsObject(w))){const ct=q.update(w),vt=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ft.copy(w.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),Ft.copy(ct.boundingSphere.center)),Ft.applyMatrix4(w.matrixWorld).applyMatrix4(At)),Array.isArray(vt)){const xt=ct.groups;for(let Rt=0,It=xt.length;Rt<It;Rt++){const yt=xt[Rt],Xt=vt[yt.materialIndex];Xt&&Xt.visible&&m.push(w,ct,Xt,G,Ft.z,yt)}}else vt.visible&&m.push(w,ct,vt,G,Ft.z,null)}}const et=w.children;for(let ct=0,vt=et.length;ct<vt;ct++)No(et[ct],U,G,V)}function sc(w,U,G,V){const N=w.opaque,et=w.transmissive,ct=w.transparent;p.setupLightsView(G),nt===!0&&tt.setGlobalState(v.clippingPlanes,G),V&&Et.viewport(L.copy(V)),N.length>0&&cr(N,U,G),et.length>0&&cr(et,U,G),ct.length>0&&cr(ct,U,G),Et.buffers.depth.setTest(!0),Et.buffers.depth.setMask(!0),Et.buffers.color.setMask(!0),Et.setPolygonOffset(!1)}function rc(w,U,G,V){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[V.id]===void 0&&(p.state.transmissionRenderTarget[V.id]=new zi(1,1,{generateMipmaps:!0,type:zt.has("EXT_color_buffer_half_float")||zt.has("EXT_color_buffer_float")?lr:qn,minFilter:Li,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Wt.workingColorSpace}));const et=p.state.transmissionRenderTarget[V.id],ct=V.viewport||L;et.setSize(ct.z,ct.w);const vt=v.getRenderTarget();v.setRenderTarget(et),v.getClearColor(F),k=v.getClearAlpha(),k<1&&v.setClearColor(16777215,.5),v.clear(),Gt&&Tt.render(G);const xt=v.toneMapping;v.toneMapping=hi;const Rt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),p.setupLightsView(V),nt===!0&&tt.setGlobalState(v.clippingPlanes,V),cr(w,G,V),C.updateMultisampleRenderTarget(et),C.updateRenderTargetMipmap(et),zt.has("WEBGL_multisampled_render_to_texture")===!1){let It=!1;for(let yt=0,Xt=U.length;yt<Xt;yt++){const oe=U[yt],le=oe.object,Ge=oe.geometry,qt=oe.material,St=oe.group;if(qt.side===En&&le.layers.test(V.layers)){const Un=qt.side;qt.side=He,qt.needsUpdate=!0,oc(le,G,V,Ge,qt,St),qt.side=Un,qt.needsUpdate=!0,It=!0}}It===!0&&(C.updateMultisampleRenderTarget(et),C.updateRenderTargetMipmap(et))}v.setRenderTarget(vt),v.setClearColor(F,k),Rt!==void 0&&(V.viewport=Rt),v.toneMapping=xt}function cr(w,U,G){const V=U.isScene===!0?U.overrideMaterial:null;for(let N=0,et=w.length;N<et;N++){const ct=w[N],vt=ct.object,xt=ct.geometry,Rt=V===null?ct.material:V,It=ct.group;vt.layers.test(G.layers)&&oc(vt,U,G,xt,Rt,It)}}function oc(w,U,G,V,N,et){w.onBeforeRender(v,U,G,V,N,et),w.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),N.onBeforeRender(v,U,G,V,w,et),N.transparent===!0&&N.side===En&&N.forceSinglePass===!1?(N.side=He,N.needsUpdate=!0,v.renderBufferDirect(G,U,V,N,w,et),N.side=Yn,N.needsUpdate=!0,v.renderBufferDirect(G,U,V,N,w,et),N.side=En):v.renderBufferDirect(G,U,V,N,w,et),w.onAfterRender(v,U,G,V,N,et)}function hr(w,U,G){U.isScene!==!0&&(U=de);const V=wt.get(w),N=p.state.lights,et=p.state.shadowsArray,ct=N.state.version,vt=bt.getParameters(w,N.state,et,U,G),xt=bt.getProgramCacheKey(vt);let Rt=V.programs;V.environment=w.isMeshStandardMaterial?U.environment:null,V.fog=U.fog,V.envMap=(w.isMeshStandardMaterial?B:b).get(w.envMap||V.environment),V.envMapRotation=V.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Rt===void 0&&(w.addEventListener("dispose",Dt),Rt=new Map,V.programs=Rt);let It=Rt.get(xt);if(It!==void 0){if(V.currentProgram===It&&V.lightsStateVersion===ct)return lc(w,vt),It}else vt.uniforms=bt.getUniforms(w),w.onBeforeCompile(vt,v),It=bt.acquireProgram(vt,xt),Rt.set(xt,It),V.uniforms=vt.uniforms;const yt=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(yt.clippingPlanes=tt.uniform),lc(w,vt),V.needsLights=mu(w),V.lightsStateVersion=ct,V.needsLights&&(yt.ambientLightColor.value=N.state.ambient,yt.lightProbe.value=N.state.probe,yt.directionalLights.value=N.state.directional,yt.directionalLightShadows.value=N.state.directionalShadow,yt.spotLights.value=N.state.spot,yt.spotLightShadows.value=N.state.spotShadow,yt.rectAreaLights.value=N.state.rectArea,yt.ltc_1.value=N.state.rectAreaLTC1,yt.ltc_2.value=N.state.rectAreaLTC2,yt.pointLights.value=N.state.point,yt.pointLightShadows.value=N.state.pointShadow,yt.hemisphereLights.value=N.state.hemi,yt.directionalShadowMap.value=N.state.directionalShadowMap,yt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,yt.spotShadowMap.value=N.state.spotShadowMap,yt.spotLightMatrix.value=N.state.spotLightMatrix,yt.spotLightMap.value=N.state.spotLightMap,yt.pointShadowMap.value=N.state.pointShadowMap,yt.pointShadowMatrix.value=N.state.pointShadowMatrix),V.currentProgram=It,V.uniformsList=null,It}function ac(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=co.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function lc(w,U){const G=wt.get(w);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function fu(w,U,G,V,N){U.isScene!==!0&&(U=de),C.resetTextureUnits();const et=U.fog,ct=V.isMeshStandardMaterial?U.environment:null,vt=P===null?v.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:As,xt=(V.isMeshStandardMaterial?B:b).get(V.envMap||ct),Rt=V.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,It=!!G.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),yt=!!G.morphAttributes.position,Xt=!!G.morphAttributes.normal,oe=!!G.morphAttributes.color;let le=hi;V.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(le=v.toneMapping);const Ge=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,qt=Ge!==void 0?Ge.length:0,St=wt.get(V),Un=p.state.lights;if(nt===!0&&(Mt===!0||w!==M)){const en=w===M&&V.id===S;tt.setState(V,w,en)}let jt=!1;V.version===St.__version?(St.needsLights&&St.lightsStateVersion!==Un.state.version||St.outputColorSpace!==vt||N.isBatchedMesh&&St.batching===!1||!N.isBatchedMesh&&St.batching===!0||N.isBatchedMesh&&St.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&St.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&St.instancing===!1||!N.isInstancedMesh&&St.instancing===!0||N.isSkinnedMesh&&St.skinning===!1||!N.isSkinnedMesh&&St.skinning===!0||N.isInstancedMesh&&St.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&St.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&St.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&St.instancingMorph===!1&&N.morphTexture!==null||St.envMap!==xt||V.fog===!0&&St.fog!==et||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==tt.numPlanes||St.numIntersection!==tt.numIntersection)||St.vertexAlphas!==Rt||St.vertexTangents!==It||St.morphTargets!==yt||St.morphNormals!==Xt||St.morphColors!==oe||St.toneMapping!==le||St.morphTargetsCount!==qt)&&(jt=!0):(jt=!0,St.__version=V.version);let cn=St.currentProgram;jt===!0&&(cn=hr(V,U,N));let Gi=!1,$e=!1,Ls=!1;const ce=cn.getUniforms(),xn=St.uniforms;if(Et.useProgram(cn.program)&&(Gi=!0,$e=!0,Ls=!0),V.id!==S&&(S=V.id,$e=!0),Gi||M!==w){Et.buffers.depth.getReversed()?(rt.copy(w.projectionMatrix),Np(rt),Op(rt),ce.setValue(O,"projectionMatrix",rt)):ce.setValue(O,"projectionMatrix",w.projectionMatrix),ce.setValue(O,"viewMatrix",w.matrixWorldInverse);const Zn=ce.map.cameraPosition;Zn!==void 0&&Zn.setValue(O,Lt.setFromMatrixPosition(w.matrixWorld)),kt.logarithmicDepthBuffer&&ce.setValue(O,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&ce.setValue(O,"isOrthographic",w.isOrthographicCamera===!0),M!==w&&(M=w,$e=!0,Ls=!0)}if(N.isSkinnedMesh){ce.setOptional(O,N,"bindMatrix"),ce.setOptional(O,N,"bindMatrixInverse");const en=N.skeleton;en&&(en.boneTexture===null&&en.computeBoneTexture(),ce.setValue(O,"boneTexture",en.boneTexture,C))}N.isBatchedMesh&&(ce.setOptional(O,N,"batchingTexture"),ce.setValue(O,"batchingTexture",N._matricesTexture,C),ce.setOptional(O,N,"batchingIdTexture"),ce.setValue(O,"batchingIdTexture",N._indirectTexture,C),ce.setOptional(O,N,"batchingColorTexture"),N._colorsTexture!==null&&ce.setValue(O,"batchingColorTexture",N._colorsTexture,C));const Ds=G.morphAttributes;if((Ds.position!==void 0||Ds.normal!==void 0||Ds.color!==void 0)&&Ct.update(N,G,cn),($e||St.receiveShadow!==N.receiveShadow)&&(St.receiveShadow=N.receiveShadow,ce.setValue(O,"receiveShadow",N.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(xn.envMap.value=xt,xn.flipEnvMap.value=xt.isCubeTexture&&xt.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&U.environment!==null&&(xn.envMapIntensity.value=U.environmentIntensity),$e&&(ce.setValue(O,"toneMappingExposure",v.toneMappingExposure),St.needsLights&&pu(xn,Ls),et&&V.fog===!0&&ot.refreshFogUniforms(xn,et),ot.refreshMaterialUniforms(xn,V,W,X,p.state.transmissionRenderTarget[w.id]),co.upload(O,ac(St),xn,C)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(co.upload(O,ac(St),xn,C),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&ce.setValue(O,"center",N.center),ce.setValue(O,"modelViewMatrix",N.modelViewMatrix),ce.setValue(O,"normalMatrix",N.normalMatrix),ce.setValue(O,"modelMatrix",N.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const en=V.uniformsGroups;for(let Zn=0,Kn=en.length;Zn<Kn;Zn++){const cc=en[Zn];I.update(cc,cn),I.bind(cc,cn)}}return cn}function pu(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function mu(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(w,U,G){wt.get(w.texture).__webglTexture=U,wt.get(w.depthTexture).__webglTexture=G;const V=wt.get(w);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=G===void 0,V.__autoAllocateDepthBuffer||zt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,U){const G=wt.get(w);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,G=0){P=w,E=U,A=G;let V=!0,N=null,et=!1,ct=!1;if(w){const xt=wt.get(w);if(xt.__useDefaultFramebuffer!==void 0)Et.bindFramebuffer(O.FRAMEBUFFER,null),V=!1;else if(xt.__webglFramebuffer===void 0)C.setupRenderTarget(w);else if(xt.__hasExternalTextures)C.rebindTextures(w,wt.get(w.texture).__webglTexture,wt.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const yt=w.depthTexture;if(xt.__boundDepthTexture!==yt){if(yt!==null&&wt.has(yt)&&(w.width!==yt.image.width||w.height!==yt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(w)}}const Rt=w.texture;(Rt.isData3DTexture||Rt.isDataArrayTexture||Rt.isCompressedArrayTexture)&&(ct=!0);const It=wt.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(It[U])?N=It[U][G]:N=It[U],et=!0):w.samples>0&&C.useMultisampledRTT(w)===!1?N=wt.get(w).__webglMultisampledFramebuffer:Array.isArray(It)?N=It[G]:N=It,L.copy(w.viewport),z.copy(w.scissor),D=w.scissorTest}else L.copy(_t).multiplyScalar(W).floor(),z.copy(Pt).multiplyScalar(W).floor(),D=Kt;if(Et.bindFramebuffer(O.FRAMEBUFFER,N)&&V&&Et.drawBuffers(w,N),Et.viewport(L),Et.scissor(z),Et.setScissorTest(D),et){const xt=wt.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,xt.__webglTexture,G)}else if(ct){const xt=wt.get(w.texture),Rt=U||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,xt.__webglTexture,G||0,Rt)}S=-1},this.readRenderTargetPixels=function(w,U,G,V,N,et,ct){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=wt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ct!==void 0&&(vt=vt[ct]),vt){Et.bindFramebuffer(O.FRAMEBUFFER,vt);try{const xt=w.texture,Rt=xt.format,It=xt.type;if(!kt.textureFormatReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!kt.textureTypeReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-V&&G>=0&&G<=w.height-N&&O.readPixels(U,G,V,N,Nt.convert(Rt),Nt.convert(It),et)}finally{const xt=P!==null?wt.get(P).__webglFramebuffer:null;Et.bindFramebuffer(O.FRAMEBUFFER,xt)}}},this.readRenderTargetPixelsAsync=async function(w,U,G,V,N,et,ct){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=wt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ct!==void 0&&(vt=vt[ct]),vt){const xt=w.texture,Rt=xt.format,It=xt.type;if(!kt.textureFormatReadable(Rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!kt.textureTypeReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=w.width-V&&G>=0&&G<=w.height-N){Et.bindFramebuffer(O.FRAMEBUFFER,vt);const yt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,yt),O.bufferData(O.PIXEL_PACK_BUFFER,et.byteLength,O.STREAM_READ),O.readPixels(U,G,V,N,Nt.convert(Rt),Nt.convert(It),0);const Xt=P!==null?wt.get(P).__webglFramebuffer:null;Et.bindFramebuffer(O.FRAMEBUFFER,Xt);const oe=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Up(O,oe,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,yt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,et),O.deleteBuffer(yt),O.deleteSync(oe),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,U=null,G=0){w.isTexture!==!0&&($s("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,w=arguments[1]);const V=Math.pow(2,-G),N=Math.floor(w.image.width*V),et=Math.floor(w.image.height*V),ct=U!==null?U.x:0,vt=U!==null?U.y:0;C.setTexture2D(w,0),O.copyTexSubImage2D(O.TEXTURE_2D,G,0,0,ct,vt,N,et),Et.unbindTexture()},this.copyTextureToTexture=function(w,U,G=null,V=null,N=0){w.isTexture!==!0&&($s("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,w=arguments[1],U=arguments[2],N=arguments[3]||0,G=null);let et,ct,vt,xt,Rt,It,yt,Xt,oe;const le=w.isCompressedTexture?w.mipmaps[N]:w.image;G!==null?(et=G.max.x-G.min.x,ct=G.max.y-G.min.y,vt=G.isBox3?G.max.z-G.min.z:1,xt=G.min.x,Rt=G.min.y,It=G.isBox3?G.min.z:0):(et=le.width,ct=le.height,vt=le.depth||1,xt=0,Rt=0,It=0),V!==null?(yt=V.x,Xt=V.y,oe=V.z):(yt=0,Xt=0,oe=0);const Ge=Nt.convert(U.format),qt=Nt.convert(U.type);let St;U.isData3DTexture?(C.setTexture3D(U,0),St=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(C.setTexture2DArray(U,0),St=O.TEXTURE_2D_ARRAY):(C.setTexture2D(U,0),St=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const Un=O.getParameter(O.UNPACK_ROW_LENGTH),jt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),cn=O.getParameter(O.UNPACK_SKIP_PIXELS),Gi=O.getParameter(O.UNPACK_SKIP_ROWS),$e=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,le.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,le.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,xt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Rt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,It);const Ls=w.isDataArrayTexture||w.isData3DTexture,ce=U.isDataArrayTexture||U.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const xn=wt.get(w),Ds=wt.get(U),en=wt.get(xn.__renderTarget),Zn=wt.get(Ds.__renderTarget);Et.bindFramebuffer(O.READ_FRAMEBUFFER,en.__webglFramebuffer),Et.bindFramebuffer(O.DRAW_FRAMEBUFFER,Zn.__webglFramebuffer);for(let Kn=0;Kn<vt;Kn++)Ls&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,wt.get(w).__webglTexture,N,It+Kn),w.isDepthTexture?(ce&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,wt.get(U).__webglTexture,N,oe+Kn),O.blitFramebuffer(xt,Rt,et,ct,yt,Xt,et,ct,O.DEPTH_BUFFER_BIT,O.NEAREST)):ce?O.copyTexSubImage3D(St,N,yt,Xt,oe+Kn,xt,Rt,et,ct):O.copyTexSubImage2D(St,N,yt,Xt,oe+Kn,xt,Rt,et,ct);Et.bindFramebuffer(O.READ_FRAMEBUFFER,null),Et.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ce?w.isDataTexture||w.isData3DTexture?O.texSubImage3D(St,N,yt,Xt,oe,et,ct,vt,Ge,qt,le.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(St,N,yt,Xt,oe,et,ct,vt,Ge,le.data):O.texSubImage3D(St,N,yt,Xt,oe,et,ct,vt,Ge,qt,le):w.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,N,yt,Xt,et,ct,Ge,qt,le.data):w.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,N,yt,Xt,le.width,le.height,Ge,le.data):O.texSubImage2D(O.TEXTURE_2D,N,yt,Xt,et,ct,Ge,qt,le);O.pixelStorei(O.UNPACK_ROW_LENGTH,Un),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,jt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,cn),O.pixelStorei(O.UNPACK_SKIP_ROWS,Gi),O.pixelStorei(O.UNPACK_SKIP_IMAGES,$e),N===0&&U.generateMipmaps&&O.generateMipmap(St),Et.unbindTexture()},this.copyTextureToTexture3D=function(w,U,G=null,V=null,N=0){return w.isTexture!==!0&&($s("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,V=arguments[1]||null,w=arguments[2],U=arguments[3],N=arguments[4]||0),$s('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,U,G,V,N)},this.initRenderTarget=function(w){wt.get(w).__webglFramebuffer===void 0&&C.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?C.setTextureCube(w,0):w.isData3DTexture?C.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?C.setTexture2DArray(w,0):C.setTexture2D(w,0),Et.unbindTexture()},this.resetState=function(){E=0,A=0,P=null,Et.reset(),re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Wt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Wt._getUnpackColorSpace()}}class Xv extends fe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Gd{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=gl,this.updateRanges=[],this.version=0,this.uuid=Xn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ke=new R;class Ln{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix4(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyNormalMatrix(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.transformDirection(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=mn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=mn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=mn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=mn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=mn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),s=Qt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),s=Qt(s,this.array),r=Qt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Xe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ln(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Vd extends Bi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Ht(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let rs;const zs=new R,os=new R,as=new R,ls=new pt,ks=new pt,Wd=new $t,Or=new R,Bs=new R,Fr=new R,gh=new pt,pa=new pt,_h=new pt;class $v extends fe{constructor(t=new Vd){if(super(),this.isSprite=!0,this.type="Sprite",rs===void 0){rs=new ve;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Gd(e,5);rs.setIndex([0,1,2,0,2,3]),rs.setAttribute("position",new Ln(n,3,0,!1)),rs.setAttribute("uv",new Ln(n,2,3,!1))}this.geometry=rs,this.material=t,this.center=new pt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),os.setFromMatrixScale(this.matrixWorld),Wd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),as.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&os.multiplyScalar(-as.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;zr(Or.set(-.5,-.5,0),as,o,os,s,r),zr(Bs.set(.5,-.5,0),as,o,os,s,r),zr(Fr.set(.5,.5,0),as,o,os,s,r),gh.set(0,0),pa.set(1,0),_h.set(1,1);let a=t.ray.intersectTriangle(Or,Bs,Fr,!1,zs);if(a===null&&(zr(Bs.set(-.5,.5,0),as,o,os,s,r),pa.set(0,1),a=t.ray.intersectTriangle(Or,Fr,Bs,!1,zs),a===null))return;const l=t.ray.origin.distanceTo(zs);l<t.near||l>t.far||e.push({distance:l,point:zs.clone(),uv:on.getInterpolation(zs,Or,Bs,Fr,gh,pa,_h,new pt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function zr(i,t,e,n,s,r){ls.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(ks.x=r*ls.x-s*ls.y,ks.y=s*ls.x+r*ls.y):ks.copy(ls),i.copy(t),i.x+=ks.x,i.y+=ks.y,i.applyMatrix4(Wd)}class Yv extends ze{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Ke,h=Ke,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class vh extends Xe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const cs=new $t,xh=new $t,kr=[],yh=new Dn,qv=new $t,Hs=new at,Gs=new di;class ma extends at{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new vh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,qv)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Dn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,cs),yh.copy(t.boundingBox).applyMatrix4(cs),this.boundingBox.union(yh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new di),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,cs),Gs.copy(t.boundingSphere).applyMatrix4(cs),this.boundingSphere.union(Gs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Hs.geometry=this.geometry,Hs.material=this.material,Hs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gs.copy(this.boundingSphere),Gs.applyMatrix4(n),t.ray.intersectsSphere(Gs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,cs),xh.multiplyMatrices(n,cs),Hs.matrixWorld=xh,Hs.raycast(t,kr);for(let o=0,a=kr.length;o<a;o++){const l=kr[o];l.instanceId=r,l.object=this,e.push(l)}kr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new vh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Yv(new Float32Array(s*this.count),s,this.count,Nl,Pn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class po extends Bi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Ht(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const mo=new R,go=new R,Mh=new $t,Vs=new Eo,Br=new di,ga=new R,bh=new R;class wn extends fe{constructor(t=new ve,e=new po){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)mo.fromBufferAttribute(e,s-1),go.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=mo.distanceTo(go);t.setAttribute("lineDistance",new ne(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Br.copy(n.boundingSphere),Br.applyMatrix4(s),Br.radius+=r,t.ray.intersectsSphere(Br)===!1)return;Mh.copy(s).invert(),Vs.copy(t.ray).applyMatrix4(Mh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=h.getX(_),x=h.getX(_+1),y=Hr(this,t,Vs,l,p,x);y&&e.push(y)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=Hr(this,t,Vs,l,_,m);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=Hr(this,t,Vs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Hr(this,t,Vs,l,g-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Hr(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(mo.fromBufferAttribute(o,s),go.fromBufferAttribute(o,r),e.distanceSqToSegment(mo,go,ga,bh)>n)return;ga.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(ga);if(!(l<t.near||l>t.far))return{distance:l,point:bh.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}class jv extends ze{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class fs extends ve{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new R,h=new pt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=n+d/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new ne(o,3)),this.setAttribute("normal",new ne(a,3)),this.setAttribute("uv",new ne(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fs(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Me extends ve{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const _=[],m=n/2;let p=0;x(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new ne(d,3)),this.setAttribute("normal",new ne(u,3)),this.setAttribute("uv",new ne(f,2));function x(){const v=new R,T=new R;let E=0;const A=(e-t)/n;for(let P=0;P<=r;P++){const S=[],M=P/r,L=M*(e-t)+t;for(let z=0;z<=s;z++){const D=z/s,F=D*l+a,k=Math.sin(F),H=Math.cos(F);T.x=L*k,T.y=-M*n+m,T.z=L*H,d.push(T.x,T.y,T.z),v.set(k,A,H).normalize(),u.push(v.x,v.y,v.z),f.push(D,1-M),S.push(g++)}_.push(S)}for(let P=0;P<s;P++)for(let S=0;S<r;S++){const M=_[S][P],L=_[S+1][P],z=_[S+1][P+1],D=_[S][P+1];(t>0||S!==0)&&(h.push(M,L,D),E+=3),(e>0||S!==r-1)&&(h.push(L,z,D),E+=3)}c.addGroup(p,E,0),p+=E}function y(v){const T=g,E=new pt,A=new R;let P=0;const S=v===!0?t:e,M=v===!0?1:-1;for(let z=1;z<=s;z++)d.push(0,m*M,0),u.push(0,M,0),f.push(.5,.5),g++;const L=g;for(let z=0;z<=s;z++){const F=z/s*l+a,k=Math.cos(F),H=Math.sin(F);A.x=S*H,A.y=m*M,A.z=S*k,d.push(A.x,A.y,A.z),u.push(0,M,0),E.x=k*.5+.5,E.y=H*.5*M+.5,f.push(E.x,E.y),g++}for(let z=0;z<s;z++){const D=T+z,F=L+z;v===!0?h.push(F,F+1,D):h.push(F+1,F,D),P+=3}c.addGroup(p,P,v===!0?1:2),p+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Me(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xl extends Me{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Xl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $l extends ve{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new ne(r,3)),this.setAttribute("normal",new ne(r.slice(),3)),this.setAttribute("uv",new ne(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const y=new R,v=new R,T=new R;for(let E=0;E<e.length;E+=3)f(e[E+0],y),f(e[E+1],v),f(e[E+2],T),l(y,v,T,x)}function l(x,y,v,T){const E=T+1,A=[];for(let P=0;P<=E;P++){A[P]=[];const S=x.clone().lerp(v,P/E),M=y.clone().lerp(v,P/E),L=E-P;for(let z=0;z<=L;z++)z===0&&P===E?A[P][z]=S:A[P][z]=S.clone().lerp(M,z/L)}for(let P=0;P<E;P++)for(let S=0;S<2*(E-P)-1;S++){const M=Math.floor(S/2);S%2===0?(u(A[P][M+1]),u(A[P+1][M]),u(A[P][M])):(u(A[P][M+1]),u(A[P+1][M+1]),u(A[P+1][M]))}}function c(x){const y=new R;for(let v=0;v<r.length;v+=3)y.x=r[v+0],y.y=r[v+1],y.z=r[v+2],y.normalize().multiplyScalar(x),r[v+0]=y.x,r[v+1]=y.y,r[v+2]=y.z}function h(){const x=new R;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const v=m(x)/2/Math.PI+.5,T=p(x)/Math.PI+.5;o.push(v,1-T)}g(),d()}function d(){for(let x=0;x<o.length;x+=6){const y=o[x+0],v=o[x+2],T=o[x+4],E=Math.max(y,v,T),A=Math.min(y,v,T);E>.9&&A<.1&&(y<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),T<.2&&(o[x+4]+=1))}}function u(x){r.push(x.x,x.y,x.z)}function f(x,y){const v=x*3;y.x=t[v+0],y.y=t[v+1],y.z=t[v+2]}function g(){const x=new R,y=new R,v=new R,T=new R,E=new pt,A=new pt,P=new pt;for(let S=0,M=0;S<r.length;S+=9,M+=6){x.set(r[S+0],r[S+1],r[S+2]),y.set(r[S+3],r[S+4],r[S+5]),v.set(r[S+6],r[S+7],r[S+8]),E.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),P.set(o[M+4],o[M+5]),T.copy(x).add(y).add(v).divideScalar(3);const L=m(T);_(E,M+0,x,L),_(A,M+2,y,L),_(P,M+4,v,L)}}function _(x,y,v,T){T<0&&x.x===1&&(o[y]=x.x-1),v.x===0&&v.z===0&&(o[y]=T/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $l(t.vertices,t.indices,t.radius,t.details)}}class Di extends $l{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Di(t.radius,t.detail)}}class Ao extends ve{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new R,u=new R,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const x=[],y=p/n;let v=0;p===0&&o===0?v=.5/e:p===n&&l===Math.PI&&(v=-.5/e);for(let T=0;T<=e;T++){const E=T/e;d.x=-t*Math.cos(s+E*r)*Math.sin(o+y*a),d.y=t*Math.cos(o+y*a),d.z=t*Math.sin(s+E*r)*Math.sin(o+y*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(E+v,1-y),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){const y=h[p][x+1],v=h[p][x],T=h[p+1][x],E=h[p+1][x+1];(p!==0||o>0)&&f.push(y,v,E),(p!==n-1||l<Math.PI)&&f.push(v,T,E)}this.setIndex(f),this.setAttribute("position",new ne(g,3)),this.setAttribute("normal",new ne(_,3)),this.setAttribute("uv",new ne(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ao(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ci extends ve{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],h=new R,d=new R,u=new R;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*r,m=f/n*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(_),d.y=(t+e*Math.cos(m))*Math.sin(_),d.z=e*Math.sin(m),a.push(d.x,d.y,d.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,x=(s+1)*f+g;o.push(_,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new ne(a,3)),this.setAttribute("normal",new ne(l,3)),this.setAttribute("uv",new ne(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ci(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Zv extends ve{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new R,r=new R;if(t.index!==null){const o=t.attributes.position,a=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,f=d.count;for(let g=u,_=u+f;g<_;g+=3)for(let m=0;m<3;m++){const p=a.getX(g+m),x=a.getX(g+(m+1)%3);s.fromBufferAttribute(o,p),r.fromBufferAttribute(o,x),Sh(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,d),Sh(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new ne(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function Sh(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class Kv extends Bi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ed,this.normalScale=new pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Ll,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Xd extends fe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const _a=new $t,wh=new R,Eh=new R;class Jv{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pt(512,512),this.map=null,this.mapPass=null,this.matrix=new $t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gl,this._frameExtents=new pt(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;wh.setFromMatrixPosition(t.matrixWorld),e.position.copy(wh),Eh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Eh),e.updateMatrixWorld(),_a.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_a),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(_a)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Qv extends Jv{constructor(){super(new Vl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class tx extends Xd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(fe.DEFAULT_UP),this.updateMatrix(),this.target=new fe,this.shadow=new Qv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class ex extends Xd{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class nx extends ve{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class vl extends Gd{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}const Th=new $t;class $d{constructor(t,e,n=0,s=1/0){this.ray=new Eo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Bl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Th.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Th),this}intersectObject(t,e=!0,n=[]){return xl(t,this,n,e),n.sort(Ah),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)xl(t[s],this,n,e);return n.sort(Ah),n}}function Ah(i,t){return i.distance-t.distance}function xl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)xl(r[o],t,e,!0)}}class Ch{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ie(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Rh=new R,Gr=new R;class ix{constructor(t=new R,e=new R){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Rh.subVectors(t,this.start),Gr.subVectors(this.end,this.start);const n=Gr.dot(Gr);let r=Gr.dot(Rh)/n;return e&&(r=Ie(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class Yl extends ki{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Pl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Pl);const Ph={type:"change"},ql={type:"start"},Yd={type:"end"},Vr=new Eo,Lh=new Gn,sx=Math.cos(70*Ii.DEG2RAD),ye=new R,Ve=2*Math.PI,ee={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},va=1e-6;class rx extends Yl{constructor(t,e=null){super(t,e),this.state=ee.NONE,this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Te.ROTATE,MIDDLE:Te.DOLLY,RIGHT:Te.PAN},this.touches={ONE:Cn.ROTATE,TWO:Cn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new R,this._lastQuaternion=new _e,this._lastTargetPosition=new R,this._quat=new _e().setFromUnitVectors(t.up,new R(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ch,this._sphericalDelta=new Ch,this._scale=1,this._panOffset=new R,this._rotateStart=new pt,this._rotateEnd=new pt,this._rotateDelta=new pt,this._panStart=new pt,this._panEnd=new pt,this._panDelta=new pt,this._dollyStart=new pt,this._dollyEnd=new pt,this._dollyDelta=new pt,this._dollyDirection=new R,this._mouse=new pt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=ax.bind(this),this._onPointerDown=ox.bind(this),this._onPointerUp=lx.bind(this),this._onContextMenu=mx.bind(this),this._onMouseWheel=dx.bind(this),this._onKeyDown=ux.bind(this),this._onTouchStart=fx.bind(this),this._onTouchMove=px.bind(this),this._onMouseDown=cx.bind(this),this._onMouseMove=hx.bind(this),this._interceptControlDown=gx.bind(this),this._interceptControlUp=_x.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ph),this.update(),this.state=ee.NONE}update(t=null){const e=this.object.position;ye.copy(e).sub(this.target),ye.applyQuaternion(this._quat),this._spherical.setFromVector3(ye),this.autoRotate&&this.state===ee.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Ve:n>Math.PI&&(n-=Ve),s<-Math.PI?s+=Ve:s>Math.PI&&(s-=Ve),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(ye.setFromSpherical(this._spherical),ye.applyQuaternion(this._quatInverse),e.copy(this.target).add(ye),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=ye.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new R(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new R(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=ye.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Vr.origin.copy(this.object.position),Vr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Vr.direction))<sx?this.object.lookAt(this.target):(Lh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Vr.intersectPlane(Lh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>va||8*(1-this._lastQuaternion.dot(this.object.quaternion))>va||this._lastTargetPosition.distanceToSquared(this.target)>va?(this.dispatchEvent(Ph),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Ve/60*this.autoRotateSpeed*t:Ve/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ye.setFromMatrixColumn(e,0),ye.multiplyScalar(-t),this._panOffset.add(ye)}_panUp(t,e){this.screenSpacePanning===!0?ye.setFromMatrixColumn(e,1):(ye.setFromMatrixColumn(e,0),ye.crossVectors(this.object.up,ye)),ye.multiplyScalar(t),this._panOffset.add(ye)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ye.copy(s).sub(this.target);let r=ye.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ve*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ve*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(Ve*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-Ve*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(Ve*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-Ve*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ve*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ve*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new pt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function ox(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function ax(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function lx(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Yd),this.state=ee.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function cx(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Te.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ee.DOLLY;break;case Te.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ee.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ee.ROTATE}break;case Te.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ee.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ee.PAN}break;default:this.state=ee.NONE}this.state!==ee.NONE&&this.dispatchEvent(ql)}function hx(i){switch(this.state){case ee.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ee.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ee.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function dx(i){this.enabled===!1||this.enableZoom===!1||this.state!==ee.NONE||(i.preventDefault(),this.dispatchEvent(ql),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Yd))}function ux(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function fx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Cn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ee.TOUCH_ROTATE;break;case Cn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ee.TOUCH_PAN;break;default:this.state=ee.NONE}break;case 2:switch(this.touches.TWO){case Cn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ee.TOUCH_DOLLY_PAN;break;case Cn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ee.TOUCH_DOLLY_ROTATE;break;default:this.state=ee.NONE}break;default:this.state=ee.NONE}this.state!==ee.NONE&&this.dispatchEvent(ql)}function px(i){switch(this._trackPointer(i),this.state){case ee.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ee.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ee.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ee.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ee.NONE}}function mx(i){this.enabled!==!1&&i.preventDefault()}function gx(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function _x(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const xa={type:"change"},jl={type:"start"},Zl={type:"end"},Dh=1e-6,Yt={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4},Wr=new pt,ri=new pt,vx=new R,Xr=new R,ya=new R,hs=new _e,Ih=new R,$r=new R,Ma=new R,Yr=new R;class xx extends Yl{constructor(t,e=null){super(t,e),this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:Te.ROTATE,MIDDLE:Te.DOLLY,RIGHT:Te.PAN},this.state=Yt.NONE,this.keyState=Yt.NONE,this.target=new R,this._lastPosition=new R,this._lastZoom=1,this._touchZoomDistanceStart=0,this._touchZoomDistanceEnd=0,this._lastAngle=0,this._eye=new R,this._movePrev=new pt,this._moveCurr=new pt,this._lastAxis=new R,this._zoomStart=new pt,this._zoomEnd=new pt,this._panStart=new pt,this._panEnd=new pt,this._pointers=[],this._pointerPositions={},this._onPointerMove=Mx.bind(this),this._onPointerDown=yx.bind(this),this._onPointerUp=bx.bind(this),this._onPointerCancel=Sx.bind(this),this._onContextMenu=Px.bind(this),this._onMouseWheel=Rx.bind(this),this._onKeyDown=Ex.bind(this),this._onKeyUp=wx.bind(this),this._onTouchStart=Lx.bind(this),this._onTouchMove=Dx.bind(this),this._onTouchEnd=Ix.bind(this),this._onMouseDown=Tx.bind(this),this._onMouseMove=Ax.bind(this),this._onMouseUp=Cx.bind(this),this._target0=this.target.clone(),this._position0=this.object.position.clone(),this._up0=this.object.up.clone(),this._zoom0=this.object.zoom,e!==null&&(this.connect(),this.handleResize()),this.update()}connect(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="none"}disconnect(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}handleResize(){const t=this.domElement.getBoundingClientRect(),e=this.domElement.ownerDocument.documentElement;this.screen.left=t.left+window.pageXOffset-e.clientLeft,this.screen.top=t.top+window.pageYOffset-e.clientTop,this.screen.width=t.width,this.screen.height=t.height}update(){this._eye.subVectors(this.object.position,this.target),this.noRotate||this._rotateCamera(),this.noZoom||this._zoomCamera(),this.noPan||this._panCamera(),this.object.position.addVectors(this.target,this._eye),this.object.isPerspectiveCamera?(this._checkDistances(),this.object.lookAt(this.target),this._lastPosition.distanceToSquared(this.object.position)>Dh&&(this.dispatchEvent(xa),this._lastPosition.copy(this.object.position))):this.object.isOrthographicCamera?(this.object.lookAt(this.target),(this._lastPosition.distanceToSquared(this.object.position)>Dh||this._lastZoom!==this.object.zoom)&&(this.dispatchEvent(xa),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type.")}reset(){this.state=Yt.NONE,this.keyState=Yt.NONE,this.target.copy(this._target0),this.object.position.copy(this._position0),this.object.up.copy(this._up0),this.object.zoom=this._zoom0,this.object.updateProjectionMatrix(),this._eye.subVectors(this.object.position,this.target),this.object.lookAt(this.target),this.dispatchEvent(xa),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom}_panCamera(){if(ri.copy(this._panEnd).sub(this._panStart),ri.lengthSq()){if(this.object.isOrthographicCamera){const t=(this.object.right-this.object.left)/this.object.zoom/this.domElement.clientWidth,e=(this.object.top-this.object.bottom)/this.object.zoom/this.domElement.clientWidth;ri.x*=t,ri.y*=e}ri.multiplyScalar(this._eye.length()*this.panSpeed),Xr.copy(this._eye).cross(this.object.up).setLength(ri.x),Xr.add(vx.copy(this.object.up).setLength(ri.y)),this.object.position.add(Xr),this.target.add(Xr),this.staticMoving?this._panStart.copy(this._panEnd):this._panStart.add(ri.subVectors(this._panEnd,this._panStart).multiplyScalar(this.dynamicDampingFactor))}}_rotateCamera(){Yr.set(this._moveCurr.x-this._movePrev.x,this._moveCurr.y-this._movePrev.y,0);let t=Yr.length();t?(this._eye.copy(this.object.position).sub(this.target),Ih.copy(this._eye).normalize(),$r.copy(this.object.up).normalize(),Ma.crossVectors($r,Ih).normalize(),$r.setLength(this._moveCurr.y-this._movePrev.y),Ma.setLength(this._moveCurr.x-this._movePrev.x),Yr.copy($r.add(Ma)),ya.crossVectors(Yr,this._eye).normalize(),t*=this.rotateSpeed,hs.setFromAxisAngle(ya,t),this._eye.applyQuaternion(hs),this.object.up.applyQuaternion(hs),this._lastAxis.copy(ya),this._lastAngle=t):!this.staticMoving&&this._lastAngle&&(this._lastAngle*=Math.sqrt(1-this.dynamicDampingFactor),this._eye.copy(this.object.position).sub(this.target),hs.setFromAxisAngle(this._lastAxis,this._lastAngle),this._eye.applyQuaternion(hs),this.object.up.applyQuaternion(hs)),this._movePrev.copy(this._moveCurr)}_zoomCamera(){let t;this.state===Yt.TOUCH_ZOOM_PAN?(t=this._touchZoomDistanceStart/this._touchZoomDistanceEnd,this._touchZoomDistanceStart=this._touchZoomDistanceEnd,this.object.isPerspectiveCamera?this._eye.multiplyScalar(t):this.object.isOrthographicCamera?(this.object.zoom=Ii.clamp(this.object.zoom/t,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(t=1+(this._zoomEnd.y-this._zoomStart.y)*this.zoomSpeed,t!==1&&t>0&&(this.object.isPerspectiveCamera?this._eye.multiplyScalar(t):this.object.isOrthographicCamera?(this.object.zoom=Ii.clamp(this.object.zoom/t,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),this.staticMoving?this._zoomStart.copy(this._zoomEnd):this._zoomStart.y+=(this._zoomEnd.y-this._zoomStart.y)*this.dynamicDampingFactor)}_getMouseOnScreen(t,e){return Wr.set((t-this.screen.left)/this.screen.width,(e-this.screen.top)/this.screen.height),Wr}_getMouseOnCircle(t,e){return Wr.set((t-this.screen.width*.5-this.screen.left)/(this.screen.width*.5),(this.screen.height+2*(this.screen.top-e))/this.screen.width),Wr}_addPointer(t){this._pointers.push(t)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e].pointerId==t.pointerId){this._pointers.splice(e,1);return}}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new pt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0].pointerId?this._pointers[1]:this._pointers[0];return this._pointerPositions[e.pointerId]}_checkDistances(){(!this.noZoom||!this.noPan)&&(this._eye.lengthSq()>this.maxDistance*this.maxDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.maxDistance)),this._zoomStart.copy(this._zoomEnd)),this._eye.lengthSq()<this.minDistance*this.minDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.minDistance)),this._zoomStart.copy(this._zoomEnd)))}}function yx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i))}function Mx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function bx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchEnd(i):this._onMouseUp(),this._removePointer(i),this._pointers.length===0&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp)))}function Sx(i){this._removePointer(i)}function wx(){this.enabled!==!1&&(this.keyState=Yt.NONE,window.addEventListener("keydown",this._onKeyDown))}function Ex(i){this.enabled!==!1&&(window.removeEventListener("keydown",this._onKeyDown),this.keyState===Yt.NONE&&(i.code===this.keys[Yt.ROTATE]&&!this.noRotate?this.keyState=Yt.ROTATE:i.code===this.keys[Yt.ZOOM]&&!this.noZoom?this.keyState=Yt.ZOOM:i.code===this.keys[Yt.PAN]&&!this.noPan&&(this.keyState=Yt.PAN)))}function Tx(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Te.DOLLY:this.state=Yt.ZOOM;break;case Te.ROTATE:this.state=Yt.ROTATE;break;case Te.PAN:this.state=Yt.PAN;break;default:this.state=Yt.NONE}const e=this.keyState!==Yt.NONE?this.keyState:this.state;e===Yt.ROTATE&&!this.noRotate?(this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr)):e===Yt.ZOOM&&!this.noZoom?(this._zoomStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._zoomEnd.copy(this._zoomStart)):e===Yt.PAN&&!this.noPan&&(this._panStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._panEnd.copy(this._panStart)),this.dispatchEvent(jl)}function Ax(i){const t=this.keyState!==Yt.NONE?this.keyState:this.state;t===Yt.ROTATE&&!this.noRotate?(this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY))):t===Yt.ZOOM&&!this.noZoom?this._zoomEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY)):t===Yt.PAN&&!this.noPan&&this._panEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY))}function Cx(){this.state=Yt.NONE,this.dispatchEvent(Zl)}function Rx(i){if(this.enabled!==!1&&this.noZoom!==!0){switch(i.preventDefault(),i.deltaMode){case 2:this._zoomStart.y-=i.deltaY*.025;break;case 1:this._zoomStart.y-=i.deltaY*.01;break;default:this._zoomStart.y-=i.deltaY*25e-5;break}this.dispatchEvent(jl),this.dispatchEvent(Zl)}}function Px(i){this.enabled!==!1&&i.preventDefault()}function Lx(i){switch(this._trackPointer(i),this._pointers.length){case 1:this.state=Yt.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(this._pointers[0].pageX,this._pointers[0].pageY)),this._movePrev.copy(this._moveCurr);break;default:this.state=Yt.TOUCH_ZOOM_PAN;const t=this._pointers[0].pageX-this._pointers[1].pageX,e=this._pointers[0].pageY-this._pointers[1].pageY;this._touchZoomDistanceEnd=this._touchZoomDistanceStart=Math.sqrt(t*t+e*e);const n=(this._pointers[0].pageX+this._pointers[1].pageX)/2,s=(this._pointers[0].pageY+this._pointers[1].pageY)/2;this._panStart.copy(this._getMouseOnScreen(n,s)),this._panEnd.copy(this._panStart);break}this.dispatchEvent(jl)}function Dx(i){switch(this._trackPointer(i),this._pointers.length){case 1:this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY));break;default:const t=this._getSecondPointerPosition(i),e=i.pageX-t.x,n=i.pageY-t.y;this._touchZoomDistanceEnd=Math.sqrt(e*e+n*n);const s=(i.pageX+t.x)/2,r=(i.pageY+t.y)/2;this._panEnd.copy(this._getMouseOnScreen(s,r));break}}function Ix(i){switch(this._pointers.length){case 0:this.state=Yt.NONE;break;case 1:this.state=Yt.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr);break;case 2:this.state=Yt.TOUCH_ZOOM_PAN;for(let t=0;t<this._pointers.length;t++)if(this._pointers[t].pointerId!==i.pointerId){const e=this._pointerPositions[this._pointers[t].pointerId];this._moveCurr.copy(this._getMouseOnCircle(e.x,e.y)),this._movePrev.copy(this._moveCurr);break}break}this.dispatchEvent(Zl)}const Mi=new $d,Fe=new R,oi=new R,he=new _e,Uh={X:new R(1,0,0),Y:new R(0,1,0),Z:new R(0,0,1)},ba={type:"change"},Nh={type:"mouseDown",mode:null},Oh={type:"mouseUp",mode:null},Fh={type:"objectChange"};class Ux extends Yl{constructor(t,e=null){super(void 0,e);const n=new Bx(this);this._root=n;const s=new Hx;this._gizmo=s,n.add(s);const r=new Gx;this._plane=r,n.add(r);const o=this;function a(y,v){let T=v;Object.defineProperty(o,y,{get:function(){return T!==void 0?T:v},set:function(E){T!==E&&(T=E,r[y]=E,s[y]=E,o.dispatchEvent({type:y+"-changed",value:E}),o.dispatchEvent(ba))}}),o[y]=v,r[y]=v,s[y]=v}a("camera",t),a("object",void 0),a("enabled",!0),a("axis",null),a("mode","translate"),a("translationSnap",null),a("rotationSnap",null),a("scaleSnap",null),a("space","world"),a("size",1),a("dragging",!1),a("showX",!0),a("showY",!0),a("showZ",!0),a("minX",-1/0),a("maxX",1/0),a("minY",-1/0),a("maxY",1/0),a("minZ",-1/0),a("maxZ",1/0);const l=new R,c=new R,h=new _e,d=new _e,u=new R,f=new _e,g=new R,_=new R,m=new R,p=0,x=new R;a("worldPosition",l),a("worldPositionStart",c),a("worldQuaternion",h),a("worldQuaternionStart",d),a("cameraPosition",u),a("cameraQuaternion",f),a("pointStart",g),a("pointEnd",_),a("rotationAxis",m),a("rotationAngle",p),a("eye",x),this._offset=new R,this._startNorm=new R,this._endNorm=new R,this._cameraScale=new R,this._parentPosition=new R,this._parentQuaternion=new _e,this._parentQuaternionInv=new _e,this._parentScale=new R,this._worldScaleStart=new R,this._worldQuaternionInv=new _e,this._worldScale=new R,this._positionStart=new R,this._quaternionStart=new _e,this._scaleStart=new R,this._getPointer=Nx.bind(this),this._onPointerDown=Fx.bind(this),this._onPointerHover=Ox.bind(this),this._onPointerMove=zx.bind(this),this._onPointerUp=kx.bind(this),e!==null&&this.connect()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(t){if(this.object===void 0||this.dragging===!0)return;t!==null&&Mi.setFromCamera(t,this.camera);const e=Sa(this._gizmo.picker[this.mode],Mi);e?this.axis=e.object.name:this.axis=null}pointerDown(t){if(!(this.object===void 0||this.dragging===!0||t!=null&&t.button!==0)&&this.axis!==null){t!==null&&Mi.setFromCamera(t,this.camera);const e=Sa(this._plane,Mi,!0);e&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(e.point).sub(this.worldPositionStart)),this.dragging=!0,Nh.mode=this.mode,this.dispatchEvent(Nh)}}pointerMove(t){const e=this.axis,n=this.mode,s=this.object;let r=this.space;if(n==="scale"?r="local":(e==="E"||e==="XYZE"||e==="XYZ")&&(r="world"),s===void 0||e===null||this.dragging===!1||t!==null&&t.button!==-1)return;t!==null&&Mi.setFromCamera(t,this.camera);const o=Sa(this._plane,Mi,!0);if(o){if(this.pointEnd.copy(o.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&e!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),e.indexOf("X")===-1&&(this._offset.x=0),e.indexOf("Y")===-1&&(this._offset.y=0),e.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&e!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(he.copy(this._quaternionStart).invert()),e.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(Fe.setFromMatrixPosition(s.parent.matrixWorld)),e.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(Fe.setFromMatrixPosition(s.parent.matrixWorld)))),s.position.x=Math.max(this.minX,Math.min(this.maxX,s.position.x)),s.position.y=Math.max(this.minY,Math.min(this.maxY,s.position.y)),s.position.z=Math.max(this.minZ,Math.min(this.maxZ,s.position.z));else if(n==="scale"){if(e.search("XYZ")!==-1){let a=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(a*=-1),oi.set(a,a,a)}else Fe.copy(this.pointStart),oi.copy(this.pointEnd),Fe.applyQuaternion(this._worldQuaternionInv),oi.applyQuaternion(this._worldQuaternionInv),oi.divide(Fe),e.search("X")===-1&&(oi.x=1),e.search("Y")===-1&&(oi.y=1),e.search("Z")===-1&&(oi.z=1);s.scale.copy(this._scaleStart).multiply(oi),this.scaleSnap&&(e.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const a=20/this.worldPosition.distanceTo(Fe.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;e==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(Fe.copy(this.rotationAxis).cross(this.eye))*a):(e==="X"||e==="Y"||e==="Z")&&(this.rotationAxis.copy(Uh[e]),Fe.copy(Uh[e]),r==="local"&&Fe.applyQuaternion(this.worldQuaternion),Fe.cross(this.eye),Fe.length()===0?l=!0:this.rotationAngle=this._offset.dot(Fe.normalize())*a),(e==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&e!=="E"&&e!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(he.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(he.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(ba),this.dispatchEvent(Fh)}}pointerUp(t){t!==null&&t.button!==0||(this.dragging&&this.axis!==null&&(Oh.mode=this.mode,this.dispatchEvent(Oh)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this._root.dispose()}attach(t){return this.object=t,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(ba),this.dispatchEvent(Fh),this.pointStart.copy(this.pointEnd))}getRaycaster(){return Mi}getMode(){return this.mode}setMode(t){this.mode=t}setTranslationSnap(t){this.translationSnap=t}setRotationSnap(t){this.rotationSnap=t}setScaleSnap(t){this.scaleSnap=t}setSize(t){this.size=t}setSpace(t){this.space=t}}function Nx(i){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:i.button};{const t=this.domElement.getBoundingClientRect();return{x:(i.clientX-t.left)/t.width*2-1,y:-(i.clientY-t.top)/t.height*2+1,button:i.button}}}function Ox(i){if(this.enabled)switch(i.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(i));break}}function Fx(i){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(i)),this.pointerDown(this._getPointer(i)))}function zx(i){this.enabled&&this.pointerMove(this._getPointer(i))}function kx(i){this.enabled&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(i)))}function Sa(i,t,e){const n=t.intersectObject(i,!0);for(let s=0;s<n.length;s++)if(n[s].object.visible||e)return n[s];return!1}const qr=new _n,ie=new R(0,1,0),zh=new R(0,0,0),kh=new $t,jr=new _e,ho=new _e,yn=new R,Bh=new $t,qs=new R(1,0,0),wi=new R(0,1,0),js=new R(0,0,1),Zr=new R,Ws=new R,Xs=new R;class Bx extends fe{constructor(t){super(),this.isTransformControlsRoot=!0,this.controls=t,this.visible=!1}updateMatrixWorld(t){const e=this.controls;e.object!==void 0&&(e.object.updateMatrixWorld(),e.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):e.object.parent.matrixWorld.decompose(e._parentPosition,e._parentQuaternion,e._parentScale),e.object.matrixWorld.decompose(e.worldPosition,e.worldQuaternion,e._worldScale),e._parentQuaternionInv.copy(e._parentQuaternion).invert(),e._worldQuaternionInv.copy(e.worldQuaternion).invert()),e.camera.updateMatrixWorld(),e.camera.matrixWorld.decompose(e.cameraPosition,e.cameraQuaternion,e._cameraScale),e.camera.isOrthographicCamera?e.camera.getWorldDirection(e.eye).negate():e.eye.copy(e.cameraPosition).sub(e.worldPosition).normalize(),super.updateMatrixWorld(t)}dispose(){this.traverse(function(t){t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}}class Hx extends fe{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const t=new Ui({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),e=new po({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=t.clone();n.opacity=.15;const s=e.clone();s.opacity=.5;const r=t.clone();r.color.setHex(16711680);const o=t.clone();o.color.setHex(65280);const a=t.clone();a.color.setHex(255);const l=t.clone();l.color.setHex(16711680),l.opacity=.5;const c=t.clone();c.color.setHex(65280),c.opacity=.5;const h=t.clone();h.color.setHex(255),h.opacity=.5;const d=t.clone();d.opacity=.25;const u=t.clone();u.color.setHex(16776960),u.opacity=.25,t.clone().color.setHex(16776960);const g=t.clone();g.color.setHex(7895160);const _=new Me(0,.04,.1,12);_.translate(0,.05,0);const m=new me(.08,.08,.08);m.translate(0,.04,0);const p=new ve;p.setAttribute("position",new ne([0,0,0,1,0,0],3));const x=new Me(.0075,.0075,.5,3);x.translate(0,.25,0);function y(k,H){const X=new Ci(k,.0075,3,64,H*Math.PI*2);return X.rotateY(Math.PI/2),X.rotateX(Math.PI/2),X}function v(){const k=new ve;return k.setAttribute("position",new ne([0,0,0,1,1,1],3)),k}const T={X:[[new at(_,r),[.5,0,0],[0,0,-Math.PI/2]],[new at(_,r),[-.5,0,0],[0,0,Math.PI/2]],[new at(x,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new at(_,o),[0,.5,0]],[new at(_,o),[0,-.5,0],[Math.PI,0,0]],[new at(x,o)]],Z:[[new at(_,a),[0,0,.5],[Math.PI/2,0,0]],[new at(_,a),[0,0,-.5],[-Math.PI/2,0,0]],[new at(x,a),null,[Math.PI/2,0,0]]],XYZ:[[new at(new Di(.1,0),d.clone()),[0,0,0]]],XY:[[new at(new me(.15,.15,.01),h.clone()),[.15,.15,0]]],YZ:[[new at(new me(.15,.15,.01),l.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new at(new me(.15,.15,.01),c.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},E={X:[[new at(new Me(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new at(new Me(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new at(new Me(.2,0,.6,4),n),[0,.3,0]],[new at(new Me(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new at(new Me(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new at(new Me(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new at(new Di(.2,0),n)]],XY:[[new at(new me(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new at(new me(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new at(new me(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},A={START:[[new at(new Di(.01,2),s),null,null,null,"helper"]],END:[[new at(new Di(.01,2),s),null,null,null,"helper"]],DELTA:[[new wn(v(),s),null,null,null,"helper"]],X:[[new wn(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new wn(p,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new wn(p,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},P={XYZE:[[new at(y(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new at(y(.5,.5),r)]],Y:[[new at(y(.5,.5),o),null,[0,0,-Math.PI/2]]],Z:[[new at(y(.5,.5),a),null,[0,Math.PI/2,0]]],E:[[new at(y(.75,1),u),null,[0,Math.PI/2,0]]]},S={AXIS:[[new wn(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},M={XYZE:[[new at(new Ao(.25,10,8),n)]],X:[[new at(new Ci(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new at(new Ci(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new at(new Ci(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new at(new Ci(.75,.1,2,24),n)]]},L={X:[[new at(m,r),[.5,0,0],[0,0,-Math.PI/2]],[new at(x,r),[0,0,0],[0,0,-Math.PI/2]],[new at(m,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new at(m,o),[0,.5,0]],[new at(x,o)],[new at(m,o),[0,-.5,0],[0,0,Math.PI]]],Z:[[new at(m,a),[0,0,.5],[Math.PI/2,0,0]],[new at(x,a),[0,0,0],[Math.PI/2,0,0]],[new at(m,a),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new at(new me(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new at(new me(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new at(new me(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new at(new me(.1,.1,.1),d.clone())]]},z={X:[[new at(new Me(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new at(new Me(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new at(new Me(.2,0,.6,4),n),[0,.3,0]],[new at(new Me(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new at(new Me(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new at(new Me(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new at(new me(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new at(new me(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new at(new me(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new at(new me(.2,.2,.2),n),[0,0,0]]]},D={X:[[new wn(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new wn(p,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new wn(p,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function F(k){const H=new fe;for(const X in k)for(let W=k[X].length;W--;){const Q=k[X][W][0].clone(),ht=k[X][W][1],_t=k[X][W][2],Pt=k[X][W][3],Kt=k[X][W][4];Q.name=X,Q.tag=Kt,ht&&Q.position.set(ht[0],ht[1],ht[2]),_t&&Q.rotation.set(_t[0],_t[1],_t[2]),Pt&&Q.scale.set(Pt[0],Pt[1],Pt[2]),Q.updateMatrix();const Y=Q.geometry.clone();Y.applyMatrix4(Q.matrix),Q.geometry=Y,Q.renderOrder=1/0,Q.position.set(0,0,0),Q.rotation.set(0,0,0),Q.scale.set(1,1,1),H.add(Q)}return H}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=F(T)),this.add(this.gizmo.rotate=F(P)),this.add(this.gizmo.scale=F(L)),this.add(this.picker.translate=F(E)),this.add(this.picker.rotate=F(M)),this.add(this.picker.scale=F(z)),this.add(this.helper.translate=F(A)),this.add(this.helper.rotate=F(S)),this.add(this.helper.scale=F(D)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(t){const n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:ho;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){const o=s[r];o.visible=!0,o.rotation.set(0,0,0),o.position.copy(this.worldPosition);let a;if(this.camera.isOrthographicCamera?a=(this.camera.top-this.camera.bottom)/this.camera.zoom:a=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),o.scale.set(1,1,1).multiplyScalar(a*this.size/4),o.tag==="helper"){o.visible=!1,o.name==="AXIS"?(o.visible=!!this.axis,this.axis==="X"&&(he.setFromEuler(qr.set(0,0,0)),o.quaternion.copy(n).multiply(he),Math.abs(ie.copy(qs).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Y"&&(he.setFromEuler(qr.set(0,0,Math.PI/2)),o.quaternion.copy(n).multiply(he),Math.abs(ie.copy(wi).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Z"&&(he.setFromEuler(qr.set(0,Math.PI/2,0)),o.quaternion.copy(n).multiply(he),Math.abs(ie.copy(js).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="XYZE"&&(he.setFromEuler(qr.set(0,Math.PI/2,0)),ie.copy(this.rotationAxis),o.quaternion.setFromRotationMatrix(kh.lookAt(zh,ie,wi)),o.quaternion.multiply(he),o.visible=this.dragging),this.axis==="E"&&(o.visible=!1)):o.name==="START"?(o.position.copy(this.worldPositionStart),o.visible=this.dragging):o.name==="END"?(o.position.copy(this.worldPosition),o.visible=this.dragging):o.name==="DELTA"?(o.position.copy(this.worldPositionStart),o.quaternion.copy(this.worldQuaternionStart),Fe.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),Fe.applyQuaternion(this.worldQuaternionStart.clone().invert()),o.scale.copy(Fe),o.visible=this.dragging):(o.quaternion.copy(n),this.dragging?o.position.copy(this.worldPositionStart):o.position.copy(this.worldPosition),this.axis&&(o.visible=this.axis.search(o.name)!==-1));continue}o.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(o.name==="X"&&Math.abs(ie.copy(qs).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Y"&&Math.abs(ie.copy(wi).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Z"&&Math.abs(ie.copy(js).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XY"&&Math.abs(ie.copy(js).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="YZ"&&Math.abs(ie.copy(qs).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XZ"&&Math.abs(ie.copy(wi).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1)):this.mode==="rotate"&&(jr.copy(n),ie.copy(this.eye).applyQuaternion(he.copy(n).invert()),o.name.search("E")!==-1&&o.quaternion.setFromRotationMatrix(kh.lookAt(this.eye,zh,wi)),o.name==="X"&&(he.setFromAxisAngle(qs,Math.atan2(-ie.y,ie.z)),he.multiplyQuaternions(jr,he),o.quaternion.copy(he)),o.name==="Y"&&(he.setFromAxisAngle(wi,Math.atan2(ie.x,ie.z)),he.multiplyQuaternions(jr,he),o.quaternion.copy(he)),o.name==="Z"&&(he.setFromAxisAngle(js,Math.atan2(ie.y,ie.x)),he.multiplyQuaternions(jr,he),o.quaternion.copy(he))),o.visible=o.visible&&(o.name.indexOf("X")===-1||this.showX),o.visible=o.visible&&(o.name.indexOf("Y")===-1||this.showY),o.visible=o.visible&&(o.name.indexOf("Z")===-1||this.showZ),o.visible=o.visible&&(o.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),o.material._color=o.material._color||o.material.color.clone(),o.material._opacity=o.material._opacity||o.material.opacity,o.material.color.copy(o.material._color),o.material.opacity=o.material._opacity,this.enabled&&this.axis&&(o.name===this.axis||this.axis.split("").some(function(l){return o.name===l}))&&(o.material.color.setHex(16776960),o.material.opacity=1)}super.updateMatrixWorld(t)}}class Gx extends at{constructor(){super(new Cs(1e5,1e5,2,2),new Ui({visible:!1,wireframe:!0,side:En,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(t){let e=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(e="local"),Zr.copy(qs).applyQuaternion(e==="local"?this.worldQuaternion:ho),Ws.copy(wi).applyQuaternion(e==="local"?this.worldQuaternion:ho),Xs.copy(js).applyQuaternion(e==="local"?this.worldQuaternion:ho),ie.copy(Ws),this.mode){case"translate":case"scale":switch(this.axis){case"X":ie.copy(this.eye).cross(Zr),yn.copy(Zr).cross(ie);break;case"Y":ie.copy(this.eye).cross(Ws),yn.copy(Ws).cross(ie);break;case"Z":ie.copy(this.eye).cross(Xs),yn.copy(Xs).cross(ie);break;case"XY":yn.copy(Xs);break;case"YZ":yn.copy(Zr);break;case"XZ":ie.copy(Xs),yn.copy(Ws);break;case"XYZ":case"E":yn.set(0,0,0);break}break;case"rotate":default:yn.set(0,0,0)}yn.length()===0?this.quaternion.copy(this.cameraQuaternion):(Bh.lookAt(Fe.set(0,0,0),yn,ie),this.quaternion.setFromRotationMatrix(Bh)),super.updateMatrixWorld(t)}}it.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new pt(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};We.line={uniforms:Hl.merge([it.common,it.fog,it.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class qd extends jn{static get type(){return"LineMaterial"}constructor(t){super({uniforms:Hl.clone(We.line.uniforms),vertexShader:We.line.vertexShader,fragmentShader:We.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Hh=new Dn,Kr=new R;class yl extends nx{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new ne(t,3)),this.setAttribute("uv",new ne(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new vl(e,6,1);return this.setAttribute("instanceStart",new Ln(n,3,0)),this.setAttribute("instanceEnd",new Ln(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new vl(e,6,1);return this.setAttribute("instanceColorStart",new Ln(n,3,0)),this.setAttribute("instanceColorEnd",new Ln(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Zv(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dn);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Hh.setFromBufferAttribute(e),this.boundingBox.union(Hh))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Kr.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Kr)),Kr.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Kr));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}const wa=new se,Gh=new R,Vh=new R,Re=new se,Pe=new se,Mn=new se,Ea=new R,Ta=new $t,Le=new ix,Wh=new R,Jr=new Dn,Qr=new di,bn=new se;let Tn,Ni;function Xh(i,t,e){return bn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),bn.multiplyScalar(1/bn.w),bn.x=Ni/e.width,bn.y=Ni/e.height,bn.applyMatrix4(i.projectionMatrixInverse),bn.multiplyScalar(1/bn.w),Math.abs(Math.max(bn.x,bn.y))}function Vx(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,l=o;a<l;a++){Le.start.fromBufferAttribute(s,a),Le.end.fromBufferAttribute(r,a),Le.applyMatrix4(e);const c=new R,h=new R;Tn.distanceSqToSegment(Le.start,Le.end,h,c),h.distanceTo(c)<Ni*.5&&t.push({point:h,pointOnLine:c,distance:Tn.origin.distanceTo(h),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function Wx(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),d=-t.near;Tn.at(1,Mn),Mn.w=1,Mn.applyMatrix4(t.matrixWorldInverse),Mn.applyMatrix4(n),Mn.multiplyScalar(1/Mn.w),Mn.x*=r.x/2,Mn.y*=r.y/2,Mn.z=0,Ea.copy(Mn),Ta.multiplyMatrices(t.matrixWorldInverse,o);for(let u=0,f=h;u<f;u++){if(Re.fromBufferAttribute(l,u),Pe.fromBufferAttribute(c,u),Re.w=1,Pe.w=1,Re.applyMatrix4(Ta),Pe.applyMatrix4(Ta),Re.z>d&&Pe.z>d)continue;if(Re.z>d){const y=Re.z-Pe.z,v=(Re.z-d)/y;Re.lerp(Pe,v)}else if(Pe.z>d){const y=Pe.z-Re.z,v=(Pe.z-d)/y;Pe.lerp(Re,v)}Re.applyMatrix4(n),Pe.applyMatrix4(n),Re.multiplyScalar(1/Re.w),Pe.multiplyScalar(1/Pe.w),Re.x*=r.x/2,Re.y*=r.y/2,Pe.x*=r.x/2,Pe.y*=r.y/2,Le.start.copy(Re),Le.start.z=0,Le.end.copy(Pe),Le.end.z=0;const _=Le.closestPointToPointParameter(Ea,!0);Le.at(_,Wh);const m=Ii.lerp(Re.z,Pe.z,_),p=m>=-1&&m<=1,x=Ea.distanceTo(Wh)<Ni*.5;if(p&&x){Le.start.fromBufferAttribute(l,u),Le.end.fromBufferAttribute(c,u),Le.start.applyMatrix4(o),Le.end.applyMatrix4(o);const y=new R,v=new R;Tn.distanceSqToSegment(Le.start,Le.end,v,y),e.push({point:v,pointOnLine:y,distance:Tn.origin.distanceTo(v),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}class Xx extends at{constructor(t=new yl,e=new qd({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,l=e.count;o<l;o++,a+=2)Gh.fromBufferAttribute(e,o),Vh.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+Gh.distanceTo(Vh);const r=new vl(s,2,1);return t.setAttribute("instanceDistanceStart",new Ln(r,1,0)),t.setAttribute("instanceDistanceEnd",new Ln(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;Tn=t.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;Ni=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),Qr.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=Ni*.5;else{const d=Math.max(s.near,Qr.distanceToPoint(Tn.origin));c=Xh(s,d,l.resolution)}if(Qr.radius+=c,Tn.intersectsSphere(Qr)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),Jr.copy(a.boundingBox).applyMatrix4(o);let h;if(n)h=Ni*.5;else{const d=Math.max(s.near,Jr.distanceToPoint(Tn.origin));h=Xh(s,d,l.resolution)}Jr.expandByScalar(h),Tn.intersectsBox(Jr)!==!1&&(n?Vx(this,e):Wx(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(wa),this.material.uniforms.resolution.value.set(wa.z,wa.w))}}const to=4096;function $x(i,t,e,n,s,r){i.beginPath(),typeof i.roundRect=="function"?i.roundRect(t,e,n,s,r):i.rect(t,e,n,s)}class Yx{constructor(t=4){this.resolution=t}map=new Map;clear(){for(const t of this.map.values())t.texture.dispose();this.map.clear()}make(t){const e=new jv(t);return e.colorSpace=Ze,e.anisotropy=4,e}text(t,e,n){const s=JSON.stringify(["t",t,e,n??null,this.resolution]),r=this.map.get(s);if(r)return r;const o=this.resolution,a=m=>m.length>e.maxChars?m.slice(0,Math.max(1,e.maxChars-1))+"…":m,l=[...t.split(`
`).map(m=>({t:a(m),px:e.size*o,color:e.color})),...n?.text?n.text.split(`
`).map(m=>({t:a(m),px:n.size*o,color:n.color})):[]],c=e.padding*o,h=document.createElement("canvas");let d=h.getContext("2d"),u=0,f=0;for(const m of l)d.font=`${m.px}px ${e.font}`,u=Math.max(u,d.measureText(m.t).width),f+=m.px*1.25;h.width=Math.min(to,Math.max(2,Math.ceil(u+c*2))),h.height=Math.min(to,Math.max(2,Math.ceil(f+c*2))),d=h.getContext("2d"),d.textAlign="center",d.textBaseline="middle",e.background&&(d.fillStyle=e.background,$x(d,0,0,h.width,h.height,e.size*o*.25),d.fill());let g=c;for(const m of l){const p=m.px*1.25;d.font=`${m.px}px ${e.font}`,d.fillStyle=m.color,d.fillText(m.t,h.width/2,g+p/2),g+=p}const _={texture:this.make(h),w:h.width/o,h:h.height/o};return this.map.set(s,_),_}badge(t){const e=JSON.stringify(["b",t]),n=this.map.get(e);if(n)return n;const s=64,r=document.createElement("canvas");r.width=r.height=s;const o=r.getContext("2d");o.fillStyle=t,o.beginPath(),o.arc(s/2,s/2,s/2-2,0,Math.PI*2),o.fill(),o.lineWidth=3,o.strokeStyle="#ffffff",o.stroke(),o.lineWidth=6,o.lineCap="round",o.lineJoin="round",o.beginPath(),o.moveTo(22,42),o.lineTo(42,22),o.moveTo(26,22),o.lineTo(42,22),o.lineTo(42,38),o.stroke();const a={texture:this.make(r),w:1,h:1};return this.map.set(e,a),a}card(t,e,n){const s=n.card,r=t.label??t.id,o=t.body??[],a=JSON.stringify(["c",r,o,e.color,s,this.resolution]),l=this.map.get(a);if(l)return l;const c=this.resolution,h=s.size*c,d=h*1.4,u=s.padding*c,f=document.createElement("canvas").getContext("2d"),g=r.split(`
`);f.font=`bold ${h}px ${s.font}`;const _=Math.max(...g.map(P=>f.measureText(P).width));f.font=`${h}px ${s.font}`;const m=o.length?Math.max(...o.map(P=>P==="---"?0:f.measureText(P).width)):0,p=Math.min(to,Math.ceil(Math.max(_,m)+u*3)),x=g.length*d+u*1.5,y=o.length?o.length*d+u*1.5:0,v=Math.min(to,Math.ceil(x+y)),T=document.createElement("canvas");T.width=Math.max(2,p),T.height=Math.max(2,v);const E=T.getContext("2d");E.fillStyle=s.background,E.fillRect(0,0,T.width,T.height),E.fillStyle=s.headerBackground??e.color,E.fillRect(0,0,T.width,x),E.textBaseline="middle",E.textAlign="center",E.font=`bold ${h}px ${s.font}`,E.fillStyle=s.headerColor,g.forEach((P,S)=>E.fillText(P,T.width/2,u*.75+d*(S+.5))),E.textAlign="left",E.font=`${h}px ${s.font}`,o.forEach((P,S)=>{const M=x+u*.75+d*(S+.5);P==="---"?(E.strokeStyle=s.border,E.lineWidth=Math.max(1,c*.3),E.beginPath(),E.moveTo(0,M),E.lineTo(T.width,M),E.stroke()):(E.fillStyle=s.textColor,E.fillText(P,u*1.5,M))}),E.strokeStyle=s.border,E.lineWidth=Math.max(2,c*.5),E.strokeRect(0,0,T.width,T.height);const A={texture:this.make(T),w:T.width/c,h:T.height/c};return this.map.set(a,A),A}}const qx=`
.gs-container{position:relative;overflow:hidden}
.gs-root{position:absolute;inset:0;overflow:hidden;font-family:var(--gs-font,system-ui,sans-serif);color:var(--gs-panel-fg,#1f2933);touch-action:none;user-select:none;-webkit-user-select:none}
.gs-root canvas{display:block;outline:none}
.gs-tooltip{position:absolute;z-index:3;pointer-events:none;max-width:260px;padding:6px 9px;font-size:12px;line-height:1.35;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px);box-shadow:0 2px 8px rgba(0,0,0,.18);white-space:pre-wrap;overflow-wrap:anywhere}
.gs-tooltip[hidden]{display:none}
.gs-search{position:absolute;z-index:2;left:10px;top:10px;display:flex;align-items:center;gap:6px;height:32px;padding:0 6px 0 9px;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px)}
.gs-search:focus-within{border-color:var(--gs-accent,#e8590c)}
.gs-search input{width:150px;max-width:38vw;min-width:0;border:0;outline:0;background:transparent;color:inherit;font:inherit;font-size:13px}
.gs-search-count{font-size:12px;opacity:.7;white-space:nowrap}
.gs-search-clear{border:0;background:transparent;color:inherit;font-size:18px;line-height:1;cursor:pointer;padding:0 4px;opacity:.7}
.gs-search-clear:hover{opacity:1}
.gs-search-clear[hidden]{display:none}
.gs-legend{position:absolute;z-index:2;left:10px;bottom:10px;max-width:min(230px,45%);max-height:45%;display:flex;flex-direction:column;font-size:12px;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px)}
.gs-legend-head{border:0;background:transparent;color:inherit;font:600 12px var(--gs-font,system-ui,sans-serif);text-align:left;padding:6px 9px;cursor:pointer}
.gs-legend-list{overflow:auto;padding:0 4px 4px}
.gs-legend-list[hidden]{display:none}
.gs-legend-item{display:flex;align-items:center}
.gs-legend-row{flex:1;min-width:0;display:flex;align-items:center;gap:7px;border:0;border-radius:3px;background:transparent;color:inherit;font:inherit;padding:3px 5px;cursor:pointer;text-align:left}
.gs-legend-row:hover{background:color-mix(in srgb,var(--gs-accent,#e8590c) 14%,transparent)}
.gs-legend-row.gs-on{outline:1.5px solid var(--gs-accent,#e8590c);outline-offset:-1.5px}
.gs-legend-row i{flex:none;width:11px;height:11px;border-radius:50%;border:1px solid rgba(0,0,0,.25)}
.gs-legend-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gs-legend-count{opacity:.65}
.gs-legend-row.gs-off .gs-legend-name{text-decoration:line-through;opacity:.55}
.gs-legend-row.gs-off i{opacity:.35}
.gs-legend-eye{flex:none;display:grid;place-items:center;width:24px;height:24px;border:0;border-radius:3px;background:transparent;color:inherit;opacity:.7;cursor:pointer}
.gs-legend-eye:hover{opacity:1;background:color-mix(in srgb,var(--gs-accent,#e8590c) 14%,transparent)}
.gs-stats{position:absolute;z-index:2;right:10px;top:10px;max-width:min(520px,90%);padding:8px 10px;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px)}
.gs-stats pre{margin:0 0 6px;font:11px/1.45 ui-monospace,Consolas,monospace;white-space:pre-wrap;user-select:text;-webkit-user-select:text}
.gs-stats .gs-btn{height:26px;font-size:12px}
.gs-help{position:absolute;z-index:4;right:52px;bottom:10px;width:min(360px,calc(100% - 70px));max-height:calc(100% - 20px);overflow:auto;padding:10px 12px;font-size:12px;line-height:1.4;background:var(--gs-panel-bg,rgba(255,255,255,.98));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px);box-shadow:0 4px 14px rgba(0,0,0,.22);user-select:text;-webkit-user-select:text}
.gs-help-title{font-weight:700;font-size:13px;margin-bottom:6px}
.gs-help-row{display:grid;grid-template-columns:42% 1fr;gap:8px;padding:3px 0;border-top:1px solid var(--gs-panel-border,#cfd6de)}
.gs-help-row b{font-weight:600}
.gs-tt-title{font-weight:600}
.gs-tt-muted{opacity:.7}
.gs-tt-hint{margin-top:3px;color:var(--gs-accent,#e8590c)}
.gs-chip{position:absolute;z-index:2;height:26px;padding:0 11px;font:600 12px var(--gs-font,system-ui,sans-serif);cursor:pointer;white-space:nowrap;background:var(--gs-panel-bg,#fff);color:var(--gs-panel-fg,#1f2933);border:1.5px solid var(--gs-accent,#e8590c);border-radius:13px;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.gs-chip[hidden]{display:none}
.gs-chip:hover{background:var(--gs-accent,#e8590c);color:#fff}
.gs-chip:focus-visible{outline:2px solid var(--gs-accent,#e8590c);outline-offset:2px}
.gs-controls{position:absolute;z-index:2;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.gs-btn{min-width:32px;height:32px;padding:0 8px;font:inherit;font-size:13px;cursor:pointer;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px)}
.gs-btn:hover{border-color:var(--gs-accent,#e8590c)}
.gs-btn:focus-visible{outline:2px solid var(--gs-accent,#e8590c);outline-offset:1px}
.gs-pseudo-fullscreen{position:fixed!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;z-index:2147483000;margin:0!important;border-radius:0!important}
.gs-box{position:absolute;z-index:2;pointer-events:none;border:1px dashed var(--gs-accent,#e8590c);background:color-mix(in srgb,var(--gs-accent,#e8590c) 12%,transparent)}
.gs-panel{position:absolute;z-index:4;top:0;right:0;bottom:0;width:min(46%,520px);display:flex;flex-direction:column;background:var(--gs-panel-bg,#fff);border-left:1px solid var(--gs-panel-border,#cfd6de);box-shadow:-4px 0 14px rgba(0,0,0,.15)}
.gs-panel-head{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid var(--gs-panel-border,#cfd6de);font-size:13px}
.gs-panel-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gs-panel iframe{flex:1;border:0;width:100%;background:#fff}
.gs-error{padding:12px;font:13px system-ui,sans-serif;color:#b42318}
`;function jx(){if(typeof document>"u"||document.getElementById("gs-styles"))return;const i=document.createElement("style");i.id="gs-styles",i.textContent=qx,document.head.appendChild(i)}const fn="\0",ds=400,Zx=new R(1,0,0),Kx=new R(0,1,0),$h={x:0,y:1,z:2},Yh={x:"#e03131",y:"#2f9e44",z:"#1c7ed6"},qh=new _e,Jx=4;class Qx{events=new Jh;config;_graph;userConfig;container;root;canvas;renderer;scene=new Xv;persp;ortho;camera;controls;orbit=null;disposeControls=()=>{};pointerIsDown=!1;activeUntil=0;ambient=new ex(16777215,1.8);headlight=new tx(16777215,1.6);tex;width=1;height=1;ro=null;raf=0;disposed=!1;unsubGraph=()=>{};nodeInfo=new Map;edgeInfo=new Map;layers=new Map;buckets=[];arrowMesh=null;geoms=new Map;colors=new Map;selNodes=new Set;selEdges=new Set;hoverNode=null;hoverEdge=null;tool="select";dirtyStructure=!0;dirtyPositions=!1;dirtyNodes=!1;dirtyEdges=!1;dirtyLabels=!1;pendingFit=!0;pendingLayout=!1;sim=null;simResolve=null;dragIds=[];drag=null;down=null;lastPointer={x:0,y:0};hoverRaf=0;rubber=null;guide=null;axisKeys=new Set;appliedVars=[];tooltipEl;boxEl;controlsEl=null;dimButton=null;fsButton=null;hiddenGroups=new Set;legendEl=null;legendRows=[];legendCollapsed=!1;statsEl=null;statsText=null;statsTimer=0;benchText="";benchmarking=!1;gpuName=null;perf={n:0,update:new Float32Array(120),render:new Float32Array(120),stamps:[],rebuildMs:0,positionsMs:0,stepMs:0};searchIndex=null;searchEl=null;searchInput=null;searchCount=null;searchText="";searchActive=!1;helpEl=null;helpButton=null;pointerInside=!1;chipEl;chipTarget=null;tc=null;tcHelper=null;pivot=new fe;gizmoMode="translate";gizmoDragging=!1;gizmoStart=null;snapHeld=!1;panelEl=null;tmpM=new $t;tmpV=new R;tmpV2=new R;tmpQ=new _e;tmpS=new R;raycaster=new $d;plane=new Gn;constructor(t,e={},n){this.container=t,this.userConfig=e,this.config=io(e),this._graph=n instanceof no?n:new no(n),this.config.ui.injectStyles&&jx(),t.classList.add("gs-container"),this.root=document.createElement("div"),this.root.className="gs-root",t.appendChild(this.root),this.renderer=new Wv({antialias:this.config.render.antialias,alpha:!0}),this.renderer.setClearColor(0,0),this.canvas=this.renderer.domElement,this.root.appendChild(this.canvas),this.tex=new Yx(this.config.label.resolution),this.persp=new rn(this.config.camera.fov,1,1,1e5),this.ortho=new Vl(-1,1,1,-1,.1,1e4),this.camera=this.config.dimension==="3d"?this.persp:this.ortho,this.scene.add(this.ambient,this.headlight,this.headlight.target,this.pivot),this.tooltipEl=document.createElement("div"),this.tooltipEl.className="gs-tooltip gs-ui",this.tooltipEl.hidden=!0,this.boxEl=document.createElement("div"),this.boxEl.className="gs-box",this.boxEl.hidden=!0,this.chipEl=document.createElement("button"),this.chipEl.type="button",this.chipEl.className="gs-chip gs-ui",this.chipEl.hidden=!0,this.chipEl.addEventListener("click",()=>{this.chipTarget&&this.openLink(this.chipTarget.kind,this.chipTarget.id)}),this.root.append(this.tooltipEl,this.boxEl,this.chipEl),this.setupCamera(),this.buildControls(),this.buildSearch(),this.buildStats(),this.applyAppearance(),this.events.on("selection",()=>this.updateLegendSelection()),this.root.addEventListener("pointerdown",this.onPointerDown,!0),this.root.addEventListener("pointermove",this.onPointerMove),this.root.addEventListener("pointerup",this.onPointerUp),this.root.addEventListener("pointercancel",this.onPointerUp),this.root.addEventListener("pointerleave",this.onPointerLeave),this.root.addEventListener("pointerenter",()=>{this.pointerInside=!0}),this.root.addEventListener("dblclick",this.onDblClick),this.root.addEventListener("wheel",this.onWheel,{passive:!0}),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("fullscreenchange",this.onFullscreenChange),typeof ResizeObserver<"u"&&(this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(t)),this.subscribe(),this.resize(),this.afterLoad()}get graph(){return this._graph}on(t,e){return this.events.on(t,e)}load(t){this.stopLayout(),this.unsubGraph(),t instanceof no?this._graph=t:this._graph.load(t,!1),this.subscribe(),this.selNodes.clear(),this.selEdges.clear(),this.hoverNode=this.hoverEdge=null;const e=this._graph.meta.dimension;e&&e!==this.config.dimension&&this.setDimension(e),this.afterLoad()}refresh(){this.dirtyStructure=!0,this.requestRender()}getConfig(){return this.config}getUserConfig(){return this.userConfig}setConfig(t){const{dimension:e,...n}=t;this.applyUserConfig(tr(this.userConfig,n)),e!==void 0&&this.setDimension(e)}setUserConfig(t){const{dimension:e,...n}=t;this.applyUserConfig({...n,dimension:this.config.dimension}),e!==void 0&&this.setDimension(e)}applyUserConfig(t){const e=this.config.camera.rotation;this.userConfig=t,this.config=io(this.userConfig),this.tex.resolution=this.config.label.resolution,this.tex.clear(),this.persp.fov=this.config.camera.fov,this.persp.updateProjectionMatrix(),this.config.dimension==="3d"&&this.config.camera.rotation!==e&&this.setupCamera(!0),this.orbit&&(this.orbit.enableDamping=this.config.camera.damping),this.applyControlLimits(),this.applyAppearance(),this.buildControls(),this.buildSearch(),this.buildStats(),this.closeHelp(),this.setupGizmo(),this.dirtyStructure=!0,this.requestRender()}getDimension(){return this.config.dimension}setDimension(t){t!==this.config.dimension&&(this.stopLayout(),this.userConfig=tr(this.userConfig,{dimension:t}),this.config=io(this.userConfig),this.camera=t==="3d"?this.persp:this.ortho,this.setupCamera(),this.resize(),this.dirtyStructure=!0,this.pendingFit=this.config.camera.autoFit,this.dimButton&&(this.dimButton.textContent=t==="2d"?"3D":"2D"),this.events.emit("dimensionchange",{dimension:t}),this.requestRender())}isFlat(){return this._graph.nodes.every(t=>!t.z)}runLayout(t=this.config.layout.name,e={}){this.stopLayout();const n=this._graph;if(n.nodes.length===0)return Promise.resolve();const s=this.config;gc(n,s.dimension,s.layout.idealLength,s.layout.seed);const r={...fd,dimension:s.dimension,spacing:s.layout.spacing,idealLength:s.layout.idealLength,gravity:s.layout.gravity,weightMode:s.layout.weightMode,direction:s.layout.direction,seed:s.layout.seed,gap:s.layout.gap,boxes:Mf(n,s,s.dimension==="3d"),...e};if(this.events.emit("layoutstart",{name:t}),t==="force")return this.sim=new ud(n,r),this.simName=t,this.requestRender(),new Promise(a=>{this.simResolve=a});const o=Rf(n,t,r);return n.setPositions([...o].filter(([a])=>!n.getNode(a)?.pinned)),s.camera.autoFit&&(this.pendingFit=!0),this.events.emit("layoutend",{name:t,completed:!0}),this.requestRender(),Promise.resolve()}simName="force";stopLayout(t=!1){if(!this.sim)return;this.sim=null;const e=this.simResolve;this.simResolve=null,t&&this.config.camera.autoFit&&(this.pendingFit=!0),this.events.emit("layoutend",{name:this.simName,completed:t}),e?.(),this.requestRender()}get isLayoutRunning(){return this.sim!==null}fit(t){const e=t?t.map(v=>this.nodeInfo.get(v)).filter(v=>!!v):[...this.nodeInfo.values()],n=!!t,s=this.camera,r=this.config.dimension==="3d";if(e.length===0){this.controls.target.set(0,0,0),r?this.persp.position.set(0,0,300):(this.ortho.zoom=1,this.ortho.position.set(0,0,1e3)),this.ortho.updateProjectionMatrix(),this.controls.update(),this.requestRender();return}let o=1/0,a=1/0,l=1/0,c=-1/0,h=-1/0,d=-1/0;for(const v of e){const[T,E,A]=v.body.pos;o=Math.min(o,T-v.body.hw),c=Math.max(c,T+v.body.hw),a=Math.min(a,E-v.body.hh),h=Math.max(h,E+v.body.hh),l=Math.min(l,A),d=Math.max(d,A)}const u=(o+c)/2,f=(a+h)/2,g=(l+d)/2,_=this.config.camera.fitPadding,m=n?90:10,p=Math.max(c-o,m),x=Math.max(h-a,m),y=d-l;if(r){const v=Math.max(.5*Math.hypot(p,x,y),m/2),T=Ii.degToRad(this.persp.fov)/2,E=Math.atan(Math.tan(T)*(this.width/this.height)),A=v/Math.sin(Math.min(T,E))*_*.8,P=this.tmpV.copy(s.position).sub(this.controls.target);P.lengthSq()<1e-9&&P.set(0,0,1),P.normalize(),this.controls.target.set(u,f,g),s.position.set(u,f,g).addScaledVector(P,A)}else{const v=this.width/this.height,T=Math.min(ds*v/p,ds/x)/_;this.ortho.zoom=Math.min(this.config.camera.zoomMax,Math.max(this.config.camera.zoomMin,T)),this.ortho.position.set(u,f,1e3),this.controls.target.set(u,f,0),this.ortho.updateProjectionMatrix()}this.controls.update(),this.requestRender()}zoomBy(t){if(this.config.dimension==="2d"){const e=this.config.camera;this.ortho.zoom=Math.min(e.zoomMax,Math.max(e.zoomMin,this.ortho.zoom*t)),this.ortho.updateProjectionMatrix()}else{const e=this.tmpV.copy(this.persp.position).sub(this.controls.target).multiplyScalar(1/t);this.persp.position.copy(this.controls.target).add(e)}this.controls.update(),this.requestRender()}setTool(t){this.tool=t,this.canvas.style.cursor=t==="connect"?"crosshair":"",this.syncGizmo()}getTool(){return this.tool}getSelection(){return{nodes:[...this.selNodes],edges:[...this.selEdges]}}setSelection(t){this.selNodes=new Set((t.nodes??[]).filter(e=>this._graph.hasNode(e))),this.selEdges=new Set((t.edges??[]).filter(e=>!!this._graph.getEdge(e))),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()}selectAll(){this.setSelection({nodes:this._graph.nodes.map(t=>t.id)})}clearSelection(){(this.selNodes.size||this.selEdges.size)&&this.setSelection({})}getNodeStyle(t){return this.nodeInfo.get(t)?.style}getEdgeStyle(t){return this.edgeInfo.get(t)?.style}get isFullscreen(){return document.fullscreenElement===this.container||this.container.classList.contains("gs-pseudo-fullscreen")}async toggleFullscreen(t){const e=t??!this.isFullscreen;if(e===this.isFullscreen)return;const n=this.container;if(e){if(typeof n.requestFullscreen=="function")try{await n.requestFullscreen();return}catch{}n.classList.add("gs-pseudo-fullscreen")}else if(document.fullscreenElement===n){await document.exitFullscreen();return}else n.classList.remove("gs-pseudo-fullscreen");this.onFullscreenChange()}updateFullscreenButton(){const t=this.fsButton;if(!t)return;const e=this.isFullscreen,n=e?"M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5":"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5";t.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${n}"/></svg>`;const s=e?"Exit full screen":"Full screen";t.title=s,t.setAttribute("aria-label",s)}onFullscreenChange=()=>{if(this.disposed)return;const t=this.isFullscreen;this.updateFullscreenButton(),this.resize(),this.events.emit("fullscreenchange",{fullscreen:t})};openLink(t,e){const n=t==="node"?this._graph.getNode(e):this._graph.getEdge(e),s=Wi(n?.url,this.config.links);if(!n||!n.url||!s)return!1;const r={url:n.url,resolved:s,kind:t,id:e,handled:!1};if(this.events.emit("link",r),r.handled||this.config.links.target==="event")return!0;switch(this.config.links.target){case"blank":window.open(s,"_blank","noopener");break;case"panel":this.openPanel(s,n.label??e);break;default:window.location.assign(s)}return!0}closePanel(){this.panelEl?.remove(),this.panelEl=null}exportImage(t="image/png",e){this.frame();const n=document.createElement("canvas");n.width=this.canvas.width,n.height=this.canvas.height;const s=n.getContext("2d"),r=this.config.background;if(!r.transparent){if(r.gradientTo){const o=s.createLinearGradient(0,0,0,n.height);o.addColorStop(0,r.color),o.addColorStop(1,r.gradientTo),s.fillStyle=o}else s.fillStyle=r.color;s.fillRect(0,0,n.width,n.height)}return s.drawImage(this.canvas,0,0),n.toDataURL(t,e)}resize(){const t=Math.max(1,this.container.clientWidth),e=Math.max(1,this.container.clientHeight);this.width=t,this.height=e,this.renderer.setPixelRatio(this.config.render.pixelRatio??Math.min(window.devicePixelRatio||1,2)),this.renderer.setSize(t,e);const n=t/e;this.persp.aspect=n,this.persp.updateProjectionMatrix(),this.ortho.left=-ds*n/2,this.ortho.right=ds*n/2,this.ortho.top=ds/2,this.ortho.bottom=-ds/2,this.ortho.updateProjectionMatrix();for(const s of this.buckets)s.mesh.material.resolution.set(t,e);this.controls&&!this.orbit&&this.controls.handleResize(),this.dirtyLabels=!0,this.requestRender()}destroy(){this.disposed=!0,cancelAnimationFrame(this.raf),cancelAnimationFrame(this.hoverRaf),this.ro?.disconnect(),this.unsubGraph(),this.stopLayout(),this.root.removeEventListener("pointerdown",this.onPointerDown,!0),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("fullscreenchange",this.onFullscreenChange),this.container.classList.remove("gs-pseudo-fullscreen"),this.setAxisGuide(null),window.clearInterval(this.statsTimer),this.disposeGizmo(),this.disposeControls(),this.clearScene();for(const t of this.geoms.values())t.dispose();this.tex.clear(),this.renderer.dispose(),this.root.remove(),this.container.classList.remove("gs-container"),this.events.clear()}subscribe(){this.unsubGraph=this._graph.events.on("change",this.onGraphChange)}onGraphChange=t=>{t.kind==="position"?this.dirtyPositions=!0:(this.sim&&this.stopLayout(),this.searchIndex=null,this.dirtyStructure=!0),this.requestRender()};afterLoad(){const t=this._graph.nodes.some(e=>e.x===void 0||e.y===void 0);this.pendingFit=this.config.camera.autoFit,this.pendingLayout=t&&this.config.layout.autoRun,this.dirtyStructure=!0,this.requestRender()}setupCamera(t=!1){const e=this.config.dimension==="3d",n=e&&this.config.camera.rotation==="free",s=this.controls?this.controls.target.clone():null;if(this.disposeControls(),this.camera=e?this.persp:this.ortho,t||(e?this.persp.position.set(0,0,300):(this.ortho.position.set(0,0,1e3),this.ortho.zoom=1)),e&&this.persp.up.set(0,1,0),n){const r=new xx(this.camera,this.canvas);r.rotateSpeed=2.5,r.zoomSpeed=1.2,r.panSpeed=.8,r.staticMoving=!1,r.dynamicDampingFactor=.12,r.keys=["","",""],r.addEventListener("change",this.onCameraChange),this.disposeControls=()=>{r.removeEventListener("change",this.onCameraChange),r.dispose()},this.orbit=null,this.controls=r}else{const r=new rx(this.camera,this.canvas);r.enableDamping=this.config.camera.damping,r.zoomToCursor=!0,r.addEventListener("change",this.onCameraChange),e?(r.mouseButtons={LEFT:Te.ROTATE,MIDDLE:Te.DOLLY,RIGHT:Te.PAN},r.touches={ONE:Cn.ROTATE,TWO:Cn.DOLLY_PAN}):(r.enableRotate=!1,r.screenSpacePanning=!0,r.mouseButtons={LEFT:Te.PAN,MIDDLE:Te.DOLLY,RIGHT:Te.PAN},r.touches={ONE:Cn.PAN,TWO:Cn.DOLLY_PAN}),this.disposeControls=()=>{r.removeEventListener("change",this.onCameraChange),r.dispose()},this.orbit=r,this.controls=r}t&&s&&this.controls.target.copy(s),this.applyControlLimits(),this.controls.update(),this.setupGizmo()}applyControlLimits(){const t=this.config.camera;this.orbit&&(this.orbit.minZoom=t.zoomMin,this.orbit.maxZoom=t.zoomMax),this.controls.minDistance=5,this.controls.maxDistance=5e4}get needsContinuousFrames(){return!this.orbit&&this.config.dimension==="3d"&&(this.pointerIsDown||performance.now()<this.activeUntil)}onCameraChange=()=>{(this.config.label.mode==="screen"||this.config.dimension==="3d")&&(this.dirtyLabels=!0),this.requestRender()};applyAppearance(){const t=this.config,e=t.background;this.root.style.background=e.transparent?"transparent":e.gradientTo?`linear-gradient(${e.color}, ${e.gradientTo})`:e.color;for(const n of this.appliedVars)this.root.style.removeProperty(`--gs-${n}`);this.appliedVars=Object.keys(t.ui.cssVars);for(const[n,s]of Object.entries(t.ui.cssVars))this.root.style.setProperty(`--gs-${n}`,s);this.tooltipEl.hidden=!0}buildControls(){if(this.controlsEl?.remove(),this.controlsEl=null,!this.config.ui.controls)return;const t=document.createElement("div");t.className="gs-controls gs-ui";const e=(n,s,r)=>{const o=document.createElement("button");return o.type="button",o.className="gs-btn",o.textContent=n,o.title=s,o.setAttribute("aria-label",s),o.addEventListener("click",r),t.appendChild(o),o};e("+","Zoom in",()=>this.zoomBy(1.4)),e("−","Zoom out",()=>this.zoomBy(1/1.4)),e("Fit","Fit graph to view",()=>this.fit()),this.dimButton=e(this.config.dimension==="2d"?"3D":"2D","Switch between 2D and 3D",()=>{this.setDimension(this.config.dimension==="2d"?"3d":"2d")}),this.fsButton=null,this.config.ui.fullscreen&&(this.fsButton=e("","Full screen",()=>{this.toggleFullscreen()}),this.updateFullscreenButton()),this.helpButton=null,this.config.ui.help&&(this.helpButton=e("?","Help: the controls of this view",()=>this.toggleHelp()),this.helpButton.classList.add("gs-help-btn")),this.root.appendChild(t),this.controlsEl=t}requestRender(){this.raf||this.disposed||(this.raf=requestAnimationFrame(this.tick))}tick=()=>{this.raf=0,!this.disposed&&(this.frame(),(this.sim||this.needsContinuousFrames)&&this.requestRender())};frame(){const t=performance.now();if(this.sim&&this.stepSimulation(),this.dirtyStructure){const n=performance.now();this.rebuildStructure(),this.perf.rebuildMs=performance.now()-n}if(this.pendingFit&&(this.pendingFit=!1,this.fit()),this.pendingLayout&&(this.pendingLayout=!1,this.runLayout()),this.dirtyPositions){const n=performance.now();this.updatePositions(),this.perf.positionsMs=performance.now()-n}this.dirtyNodes&&(this.dirtyNodes=!1,this.updateNodeInstances()),this.dirtyEdges&&(this.dirtyEdges=!1,this.writeEdges()),this.dirtyLabels&&(this.dirtyLabels=!1,this.updateLabels()),this.controls.update(),this.updateChip(),this.config.dimension==="3d"&&(this.headlight.position.copy(this.persp.position),this.headlight.target.position.copy(this.controls.target),this.headlight.target.updateMatrixWorld());const e=performance.now();this.renderer.render(this.scene,this.camera),this.recordFrame(t,e,performance.now())}recordFrame(t,e,n){const s=this.perf,r=s.n%120;for(s.update[r]=e-t,s.render[r]=n-e,s.n++,s.stamps.push(n);s.stamps.length&&n-s.stamps[0]>1e3;)s.stamps.shift()}stepSimulation(){const t=this.sim;if(!t)return;const e=this._graph.nodes.length,n=e<=1500?3:e<=5e3?2:1;for(const r of this.dragIds){const o=this._graph.getNode(r);o&&t.pin(r,[o.x??0,o.y??0,o.z??0])}const s=performance.now();for(let r=0;r<n;r++)t.step();t.commit(this._graph),this.perf.stepMs=performance.now()-s,t.alpha<.02&&this.stopLayout(!0)}color(t){let e=this.colors.get(t);return e||(e=new Ht(t),this.colors.set(t,e)),e}geometryFor(t){let e=this.geoms.get(t);if(e)return e;switch(t){case"circle3d":e=new Ao(.5,24,16);break;case"square3d":case"rectangle3d":e=new me(1,1,1);break;case"diamond3d":e=new Di(.62);break;case"hexagon3d":e=new Me(.5,.5,1,6),e.rotateX(Math.PI/2),e.rotateZ(Math.PI/2);break;case"triangle3d":e=new Me(.5,.5,1,3),e.rotateX(-Math.PI/2);break;case"square":case"rectangle":e=new Cs(1,1);break;case"diamond":e=new fs(.5,4);break;case"hexagon":e=new fs(.5,6);break;case"triangle":e=new fs(.5,3),e.rotateZ(Math.PI/2);break;case"arrow":e=new Xl(.5,1,14),e.rotateZ(-Math.PI/2),e.translate(-.5,0,0);break;default:e=new fs(.5,40)}return this.geoms.set(t,e),e}applyMode(t,e){const n=this.config.dimension==="3d";t.transparent=n?e<1:!0,t.opacity=e,t.depthTest=n,t.depthWrite=n}clearScene(){for(const t of this.layers.values())this.scene.remove(t.body,t.outline),t.body.material.dispose(),t.outline.material.dispose(),t.body.dispose(),t.outline.dispose();this.layers.clear();for(const t of this.buckets)this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose();this.buckets=[],this.arrowMesh&&(this.scene.remove(this.arrowMesh),this.arrowMesh.material.dispose(),this.arrowMesh.dispose(),this.arrowMesh=null);for(const t of this.nodeInfo.values())t.sprite&&this.dropSprite(t.sprite),t.badge&&this.dropSprite(t.badge);for(const t of this.edgeInfo.values())t.sprite&&this.dropSprite(t.sprite),t.badge&&this.dropSprite(t.badge);this.nodeInfo.clear(),this.edgeInfo.clear()}dropSprite(t){this.scene.remove(t),t.material.dispose()}makeSprite(t,e){const n=this.config.dimension==="3d",s=new Vd({map:t.texture,transparent:!0,depthTest:n,depthWrite:!1}),r=new $v(s);return r.renderOrder=e,r.frustumCulled=!1,this.scene.add(r),r}rebuildStructure(){this.dirtyStructure=!1,this.clearScene();const t=this.config,e=this._graph,n=t.dimension==="3d";gc(e,t.dimension,t.layout.idealLength,t.layout.seed);for(const d of[...this.selNodes])e.hasNode(d)||this.selNodes.delete(d);for(const d of[...this.selEdges])e.getEdge(d)||this.selEdges.delete(d);this.hoverNode&&!e.hasNode(this.hoverNode)&&(this.hoverNode=null),this.hoverEdge&&!e.getEdge(this.hoverEdge)&&(this.hoverEdge=null);const s=Ra(e),r=new Map;for(const d of e.nodes){if(this.hiddenGroups.has(d.group??fn))continue;const u=Pa(d,t,s),f=cd(u.shape,u.size,t.node.aspect),g={node:d,style:u,body:{pos:[0,0,0],hw:f.hw,hh:f.hh,ellipse:hf(u.shape)},layerKey:null,layer:null,slot:-1};if(u.shape==="card")g.card=this.tex.card(d,u,t),g.body.hw=g.card.w/2,g.body.hh=g.card.h/2,g.body.ellipse=!1,n&&(g.body.hw=g.body.hh=Math.max(g.body.hw,g.body.hh)),g.sprite=this.makeSprite(g.card,4);else{g.layerKey=n?`${u.shape}3d`:u.shape;const _=r.get(g.layerKey)??[];_.push(g),r.set(g.layerKey,_)}this.nodeInfo.set(d.id,g)}for(const[d,u]of r){const f=this.geometryFor(d),g=n?new Kv:new Ui;this.applyMode(g,t.node.opacity);const _=new Ui({side:n?He:Yn});this.applyMode(_,t.node.opacity);const m=new ma(f,g,u.length),p=new ma(f,_,u.length);for(const y of[m,p])y.frustumCulled=!1,y.instanceMatrix.setUsage(bc);p.renderOrder=3,m.renderOrder=4;const x={key:d,body:m,outline:p};u.forEach((y,v)=>{y.layer=x,y.slot=v,m.setColorAt(v,this.color(y.style.color)),p.setColorAt(v,this.color(y.style.borderColor))}),this.layers.set(d,x),this.scene.add(p,m)}if(t.label.show&&e.nodes.length<=t.label.maxCount)for(const d of this.nodeInfo.values()){if(d.card)continue;const u=d.node.sublabel?{text:d.node.sublabel,size:t.label.subSize,color:t.label.subColor}:void 0,f=this.tex.text(d.node.label??d.node.id,{...t.label,color:d.style.labelColor},u);d.sprite=this.makeSprite(f,5)}let o=1/0,a=-1/0;for(const d of e.edges){const u=e.weightOf(d);o=Math.min(o,u),a=Math.max(a,u)}const l=new Map,c=new Map;let h=0;for(const d of e.edges){if(!this.nodeInfo.has(d.source)||!this.nodeInfo.has(d.target))continue;const u=e.weightOf(d),f=Pu(d,u,t,{min:o,max:a}),g=d.source===d.target,_={edge:d,style:f,weight:u,directed:e.isDirected(d),index:0,count:1,flip:!g&&d.source>d.target,self:g,path:[],arrowSlot:-1,bucketKey:`${f.width}|${f.dashed?1:0}`},m=g?`s\0${d.source}`:d.source<d.target?`${d.source}\0${d.target}`:`${d.target}\0${d.source}`,p=l.get(m)??[];p.push(_),l.set(m,p),this.edgeInfo.set(d.id,_),_.directed&&t.edge.arrows&&(_.arrowSlot=h++);let x=c.get(_.bucketKey);if(!x){const y=new qd({color:16777215,linewidth:f.width,vertexColors:!0,dashed:f.dashed,dashSize:t.edge.dashSize,gapSize:t.edge.gapSize});y.resolution.set(this.width,this.height),this.applyMode(y,t.edge.opacity);const v=new Xx(new yl,y);v.frustumCulled=!1,v.renderOrder=1,v.visible=!1,this.scene.add(v),x={key:_.bucketKey,mesh:v,edges:[],dashed:f.dashed},c.set(_.bucketKey,x)}x.edges.push(_)}for(const d of l.values())d.forEach((u,f)=>{u.index=f,u.count=d.length});if(this.buckets=[...c.values()],h>0){const d=new Ui;this.applyMode(d,t.edge.opacity);const u=new ma(this.geometryFor("arrow"),d,h);u.frustumCulled=!1,u.renderOrder=2,u.instanceMatrix.setUsage(bc);for(let f=0;f<h;f++)u.setColorAt(f,this.color("#ffffff"));this.arrowMesh=u,this.scene.add(u)}if(e.edges.length<=t.weight.maxCount)for(const d of this.edgeInfo.values()){const u=this.edgeText(d);u&&(d.img=this.tex.text(u,{...t.weight,maxChars:t.label.maxChars}),d.sprite=this.makeSprite(d.img,5))}if(t.links.badge&&t.interaction.openLinks!=="never"){const d=this.tex.badge(t.links.badgeColor);for(const u of this.nodeInfo.values())Wi(u.node.url,t.links)&&(u.badge=this.makeSprite(d,6));for(const u of this.edgeInfo.values())Wi(u.edge.url,t.links)&&(u.badge=this.makeSprite(d,6))}for(const d of[...this.selNodes])this.nodeInfo.has(d)||this.selNodes.delete(d);for(const d of[...this.selEdges])this.edgeInfo.has(d)||this.selEdges.delete(d);this.dirtyPositions=!1,this.dirtyNodes=this.dirtyEdges=!1,this.updatePositions(),this.updateLegend()}edgeText(t){const e=this.config.weight,s=e.show==="always"||e.show==="auto"&&t.weight!==1?String(Number(t.weight.toFixed(e.decimals))):"",r=t.edge.label??"";return r&&s?`${r} (${s})`:r||s}updatePositions(){this.dirtyPositions=!1;const t=this.config.dimension==="3d";for(const e of this.nodeInfo.values()){const n=e.node;e.body.pos[0]=n.x??0,e.body.pos[1]=n.y??0,e.body.pos[2]=t?n.z??0:0}this.updateNodeInstances(),this.computePaths(),this.writeEdges(),this.updateLabels()}updateNodeInstances(){const t=this.config,e=t.dimension==="3d",n=this.tmpM;for(const[s,r]of this.nodeInfo){const o=r.layer;if(!o)continue;const a=this.selNodes.has(s),l=s===this.hoverNode,c=a?t.selection.width:l?t.selection.width*.8:r.style.borderWidth,h=r.body.hw*2,d=r.body.hh*2,[u,f,g]=r.body.pos;n.compose(this.tmpV.set(u,f,g),qh,this.tmpS.set(h,d,e?d:1)),o.body.setMatrixAt(r.slot,n),n.compose(this.tmpV.set(u,f,g),qh,this.tmpS.set(h+2*c,d+2*c,e?d+2*c:1)),o.outline.setMatrixAt(r.slot,n),o.outline.setColorAt(r.slot,this.color(a?t.selection.color:l?t.selection.hoverColor:r.style.borderColor))}for(const s of this.layers.values())s.body.instanceMatrix.needsUpdate=!0,s.outline.instanceMatrix.needsUpdate=!0,s.outline.instanceColor&&(s.outline.instanceColor.needsUpdate=!0);this.syncGizmo()}computePaths(){const t=this.config,e={spacing:t.edge.curveSpacing,segments:16,dim3:t.dimension==="3d",loopScale:t.edge.loopSize};for(const n of this.edgeInfo.values()){const s=this.nodeInfo.get(n.edge.source)?.body,r=this.nodeInfo.get(n.edge.target)?.body;if(!s||!r){n.path=[];continue}let o=mf(s,r,n.index,n.count,n.flip,n.self,e);n.tip=void 0,n.arrowSlot>=0&&o.length>=2&&(n.tip=_f(o),o=gf(o,t.edge.arrowSize*.9)),n.path=o}}edgeColor(t){const e=this.config.selection;return this.selEdges.has(t.edge.id)?this.color(e.color):t.edge.id===this.hoverEdge?this.color(e.hoverColor):this.color(t.style.color)}writeEdges(){for(const t of this.buckets){let e=0;for(const a of t.edges)e+=Math.max(0,a.path.length-1);const n=new Float32Array(e*6),s=new Float32Array(e*6);let r=0;for(const a of t.edges){const l=this.edgeColor(a);for(let c=1;c<a.path.length;c++){const h=a.path[c-1],d=a.path[c];n[r]=h[0],n[r+1]=h[1],n[r+2]=h[2],n[r+3]=d[0],n[r+4]=d[1],n[r+5]=d[2],s[r]=s[r+3]=l.r,s[r+1]=s[r+4]=l.g,s[r+2]=s[r+5]=l.b,r+=6}}const o=new yl;e>0&&(o.setPositions(n),o.setColors(s)),t.mesh.geometry.dispose(),t.mesh.geometry=o,t.mesh.visible=e>0,e>0&&t.dashed&&t.mesh.computeLineDistances()}if(this.arrowMesh){const t=this.config.edge.arrowSize;for(const e of this.edgeInfo.values()){if(e.arrowSlot<0)continue;if(!e.tip){this.arrowMesh.setMatrixAt(e.arrowSlot,this.tmpM.makeScale(0,0,0));continue}const n=e.tip.dir;this.tmpQ.setFromUnitVectors(Zx,this.tmpV2.set(n[0],n[1],n[2])),this.tmpM.compose(this.tmpV.set(e.tip.tip[0],e.tip.tip[1],e.tip.tip[2]),this.tmpQ,this.tmpS.set(t,t*.8,t*.8)),this.arrowMesh.setMatrixAt(e.arrowSlot,this.tmpM),this.arrowMesh.setColorAt(e.arrowSlot,this.edgeColor(e))}this.arrowMesh.instanceMatrix.needsUpdate=!0,this.arrowMesh.instanceColor&&(this.arrowMesh.instanceColor.needsUpdate=!0)}}updateLabels(){const t=this.config,e=t.label.mode==="screen",n=t.dimension==="3d";for(const s of this.nodeInfo.values()){const r=s.sprite;if(!r)continue;const[o,a,l]=s.body.pos;if(s.card){r.position.set(o,a,l),r.scale.set(s.card.w,s.card.h,1);continue}const c=r.material.map.image,h=this.tex.resolution,d=e?1/this.pxPerUnitAt(o,a,l):1,u=c.width/h*d,f=c.height/h*d;r.scale.set(u,f,1),r.position.set(o,a-s.body.hh-t.label.gap*d-f/2,l),n&&this.towardCamera(r.position,s.body.hw+1)}for(const s of this.edgeInfo.values()){const r=s.sprite;if(!r||!s.img||s.path.length<2){r&&(r.visible=!1);continue}const o=ko(s.path,.5),a=e?1/this.pxPerUnitAt(o[0],o[1],o[2]):1;r.visible=!0,r.scale.set(s.img.w*a,s.img.h*a,1),r.position.set(o[0],o[1],o[2]),n&&this.towardCamera(r.position,1.5)}this.updateBadges()}updateBadges(){const t=this.config.links.badgeSize,e=this.config.dimension==="3d";for(const n of this.nodeInfo.values()){const s=n.badge;if(!s)continue;const[r,o,a]=n.body.pos;s.scale.set(t,t,1),s.position.set(r+n.body.hw*.72,o+n.body.hh*.72,a),e&&this.towardCamera(s.position,n.body.hw+2)}for(const n of this.edgeInfo.values()){const s=n.badge;if(!s)continue;if(n.path.length<2){s.visible=!1;continue}const r=ko(n.path,.5);s.visible=!0,s.scale.set(t,t,1),s.position.set(r[0]+t*.9,r[1]+t*.9,r[2]),e&&this.towardCamera(s.position,2)}}updateChip(){const t=this.chipEl,e=this.config,n=this.dragIds.length>0||this.gizmoDragging||this.drag?.type==="nodes"&&this.drag.moved;let s=null;if(e.links.chip&&e.interaction.openLinks!=="never"&&!n){if(this.selNodes.size===1&&this.selEdges.size===0){const c=[...this.selNodes][0],h=this.nodeInfo.get(c);if(h&&Wi(h.node.url,e.links)){const d=this.pxPerUnitAt(h.body.pos[0],h.body.pos[1],h.body.pos[2]);s={kind:"node",id:c,at:h.body.pos,dx:h.body.hw*d+8,dy:-h.body.hh*d-4}}}else if(this.selEdges.size===1&&this.selNodes.size===0){const c=[...this.selEdges][0],h=this.edgeInfo.get(c);h&&h.path.length>=2&&Wi(h.edge.url,e.links)&&(s={kind:"edge",id:c,at:ko(h.path,.5),dx:12,dy:-12})}}if(!s){t.hidden||(t.hidden=!0),this.chipTarget=null;return}this.camera.updateMatrixWorld();const r=this.tmpV.set(s.at[0],s.at[1],s.at[2]).project(this.camera);if(r.z<-1||r.z>1){t.hidden=!0,this.chipTarget=null;return}const o=`${e.links.chipLabel} ↗`;t.textContent!==o&&(t.textContent=o),this.chipTarget={kind:s.kind,id:s.id},t.hidden=!1;const a=(r.x*.5+.5)*this.width+s.dx,l=(-r.y*.5+.5)*this.height+s.dy;t.style.left=`${Math.max(4,Math.min(a,this.width-t.offsetWidth-4))}px`,t.style.top=`${Math.max(4,Math.min(l,this.height-t.offsetHeight-4))}px`}linkHint(t){const e=this.config;if(!e.links.hint||e.interaction.openLinks==="never"||!Wi(t,e.links))return"";const n=typeof navigator<"u"&&/mac|iphone|ipad/i.test(navigator.platform||navigator.userAgent),s=Qh(e.interaction.openLinks,n);return e.links.chip?`${s} to open the page, or select it and use “${e.links.chipLabel}”`:`${s} to open the page`}towardCamera(t,e){const n=this.tmpV2.copy(this.persp.position).sub(t);n.lengthSq()<1e-9||t.addScaledVector(n.normalize(),e)}pxPerUnitAt(t,e,n){if(this.camera===this.ortho)return this.height/((this.ortho.top-this.ortho.bottom)/this.ortho.zoom);const s=this.tmpV2.set(t,e,n).applyMatrix4(this.persp.matrixWorldInverse),r=Math.max(.001,-s.z);return this.height/(2*Math.tan(Ii.degToRad(this.persp.fov)/2)*r)}getGizmoMode(){return this.gizmoMode}setGizmoMode(t){this.gizmoMode=t,this.tc?.setMode(t),this.applyGizmoAxes(),this.syncGizmo(),this.events.emit("gizmomode",{mode:t}),this.requestRender()}disposeGizmo(){this.tc&&(this.tc.detach(),this.tcHelper&&this.scene.remove(this.tcHelper),this.tc.dispose(),this.tc=null,this.tcHelper=null,this.gizmoDragging=!1)}setupGizmo(){if(this.disposeGizmo(),!this.config.interaction.gizmo)return;const t=new Ux(this.camera,this.canvas);t.setMode(this.gizmoMode),t.setSpace(this.config.gizmo.space),t.setSize(this.config.gizmo.size),t.addEventListener("dragging-changed",n=>{this.controls.enabled=!n.value,n.value?this.beginGizmoDrag():this.endGizmoDrag()}),t.addEventListener("objectChange",()=>this.applyGizmoDrag()),t.addEventListener("change",()=>this.requestRender());const e=typeof t.getHelper=="function"?t.getHelper():t;this.scene.add(e),this.tc=t,this.tcHelper=e,this.applyGizmoAxes(),this.applySnap(),this.syncGizmo()}applyGizmoAxes(){const t=this.tc;t&&(this.config.dimension==="3d"?t.showX=t.showY=t.showZ=!0:this.gizmoMode==="rotate"?(t.showX=!1,t.showY=!1,t.showZ=!0):(t.showX=!0,t.showY=!0,t.showZ=!1))}setSnap(t){t!==this.snapHeld&&(this.snapHeld=t,this.applySnap())}applySnap(){const t=this.tc;if(!t)return;const e=this.config.gizmo;t.setTranslationSnap(this.snapHeld?e.snapTranslate:null),t.setRotationSnap(this.snapHeld?Ii.degToRad(e.snapRotate):null),t.setScaleSnap(this.snapHeld?e.snapScale:null)}gizmoHovered(t){const e=this.tc;if(!e||!e.object)return!1;const n=this.canvas.getBoundingClientRect();try{e.pointerHover({x:(t.clientX-n.left)/n.width*2-1,y:-(t.clientY-n.top)/n.height*2+1,button:t.button})}catch{}return!!e.axis}syncGizmo(){const t=this.tc;if(!t)return;const e=[...this.selNodes].filter(s=>this.nodeInfo.has(s));if(!(this.tool==="select"&&e.length>0&&(this.gizmoMode==="translate"||e.length>=2))){t.object&&t.detach();return}if(!this.gizmoDragging){let s=0,r=0,o=0;for(const a of e){const l=this.nodeInfo.get(a).body.pos;s+=l[0],r+=l[1],o+=l[2]}this.pivot.position.set(s/e.length,r/e.length,o/e.length),this.pivot.quaternion.identity(),this.pivot.scale.set(1,1,1),this.pivot.updateMatrixWorld(!0)}t.object!==this.pivot&&t.attach(this.pivot)}beginGizmoDrag(){const t=[...this.selNodes].filter(n=>this.nodeInfo.has(n)),e=new Map;for(const n of t){const s=this.nodeInfo.get(n).body.pos;e.set(n,[s[0],s[1],s[2]])}this.gizmoStart={pivot:this.pivot.position.clone(),nodes:e},this.gizmoDragging=!0,this.dragIds=t,this.events.emit("nodedragstart",{ids:t})}applyGizmoDrag(){const t=this.gizmoStart,e=this.tc;if(!t||!e||!this.gizmoDragging)return;const n=this.config.dimension==="3d",s=t.pivot,r=e.mode,o=this.pivot.position,a=[],l=new R;for(const[c,h]of t.nodes){const d=this._graph.getNode(c);if(!d)continue;let u;r==="translate"?u=[h[0]+o.x-s.x,h[1]+o.y-s.y,h[2]+o.z-s.z]:(l.set(h[0]-s.x,h[1]-s.y,h[2]-s.z),r==="rotate"?l.applyQuaternion(this.pivot.quaternion):l.multiply(this.pivot.scale),u=[s.x+l.x,s.y+l.y,s.z+l.z]),a.push([c,[u[0],u[1],n?u[2]:d.z??0]])}this._graph.setPositions(a)}endGizmoDrag(){const t=this.dragIds;this.gizmoDragging=!1,this.gizmoStart=null,this.dragIds=[];for(const e of t)this.sim?.unpin(e,!!this._graph.getNode(e)?.pinned);this.syncGizmo(),this.events.emit("nodedragend",{ids:t}),this.requestRender()}getGroups(){return this.groupList().map(t=>({name:t.key===fn?null:t.key,count:t.ids.length,color:t.color,visible:!this.hiddenGroups.has(t.key)}))}selectGroup(t,e=!1){const n=t??fn;if(this.searchActive=!1,this.hiddenGroups.has(n))return;const s=this._graph.nodes.filter(a=>(a.group??fn)===n).map(a=>a.id),r=new Set(this.selNodes),o=s.length>0&&s.every(a=>r.has(a));if(e){for(const a of s)o?r.delete(a):r.add(a);this.setSelection({nodes:[...r]})}else o&&r.size===s.length?this.setSelection({}):this.setSelection({nodes:s})}setGroupVisible(t,e){const n=t??fn;e===this.hiddenGroups.has(n)&&(e?this.hiddenGroups.delete(n):this.hiddenGroups.add(n),this.dirtyStructure=!0,this.requestRender(),this.events.emit("groupvisibility",{hidden:[...this.hiddenGroups].map(s=>s===fn?null:s)}))}groupList(){const t=this._graph,e=Ra(t),n=new Map;for(const r of t.nodes){const o=r.group??fn;let a=n.get(o);a||(a={key:o,name:r.group??"No group",ids:[],first:r},n.set(o,a)),a.ids.push(r.id)}const s=[...n.values()];return s.sort((r,o)=>(r.key===fn?1:0)-(o.key===fn?1:0)),s.map(r=>({key:r.key,name:r.name,ids:r.ids,color:Pa(r.first,this.config,e).color}))}updateLegend(){if(this.legendEl?.remove(),this.legendEl=null,this.legendRows=[],!this.config.ui.legend)return;const t=this.groupList();if(t.length<2)return;const e=document.createElement("div");e.className="gs-legend gs-ui";const n=document.createElement("button");n.type="button",n.className="gs-legend-head";const s=document.createElement("div");s.className="gs-legend-list";const r=o=>{this.legendCollapsed=o,s.hidden=o,n.textContent=`${o?"▸":"▾"} Groups (${t.length})`,n.setAttribute("aria-expanded",String(!o))};n.addEventListener("click",()=>r(!this.legendCollapsed));for(const o of t){const a=document.createElement("div");a.className="gs-legend-item";const l=this.hiddenGroups.has(o.key),c=document.createElement("button");c.type="button",c.className="gs-legend-row"+(l?" gs-off":""),c.title=l?`${o.name} is hidden`:`Select ${o.name} (Shift+click adds)`;const h=document.createElement("i");h.style.background=o.color;const d=document.createElement("span");d.className="gs-legend-name",d.textContent=o.name;const u=document.createElement("span");u.className="gs-legend-count",u.textContent=String(o.ids.length),c.append(h,d,u),c.addEventListener("click",p=>this.selectGroup(o.key===fn?null:o.key,p.shiftKey||p.ctrlKey||p.metaKey));const f=document.createElement("button");f.type="button",f.className="gs-legend-eye";const g="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",_="M3 3l18 18M10.6 6.2A9.6 9.6 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.7M6.6 7.6A17 17 0 002 12s4 7 10 7a9.4 9.4 0 004.4-1.1";f.innerHTML=`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${l?_:g}"/></svg>`;const m=l?`Show ${o.name}`:`Hide ${o.name}`;f.title=m,f.setAttribute("aria-label",m),f.addEventListener("click",()=>this.setGroupVisible(o.key===fn?null:o.key,l)),a.append(c,f),s.appendChild(a),this.legendRows.push({key:o.key,ids:o.ids,row:c})}e.append(n,s),r(this.legendCollapsed),this.root.appendChild(e),this.legendEl=e,this.updateLegendSelection()}updateLegendSelection(){for(const t of this.legendRows){const e=!this.hiddenGroups.has(t.key)&&t.ids.length>0&&t.ids.every(n=>this.selNodes.has(n));t.row.classList.toggle("gs-on",e),t.row.setAttribute("aria-pressed",String(e))}}setStatsVisible(t){this.setConfig({ui:{stats:t}})}toggleStats(){this.setStatsVisible(!this.config.ui.stats)}buildStats(){if(window.clearInterval(this.statsTimer),this.statsEl?.remove(),this.statsEl=this.statsText=null,!this.config.ui.stats)return;const t=document.createElement("div");t.className="gs-stats gs-ui";const e=document.createElement("pre"),n=document.createElement("button");n.type="button",n.className="gs-btn",n.textContent="Run benchmark",n.title="Moves the camera for a few seconds, first alone, then together with position updates every frame",n.addEventListener("click",()=>{n.disabled=!0,this.benchText="benchmark running ...",this.runBenchmark(4).then(s=>{const r=o=>`${o.fps.toFixed(0)} fps (display capped), frame ${o.frameMsAvg.toFixed(1)} avg / ${o.frameMsP95.toFixed(1)} p95 / ${o.frameMsMax.toFixed(1)} max ms, CPU update ${o.updateMsAvg.toFixed(2)} + render ${o.renderMsAvg.toFixed(2)} ms`;this.benchText=`camera only:  ${r(s.camera)}
with updates: ${r(s.updates)}`,n.disabled=!1})}),t.append(e,n),this.root.appendChild(t),this.statsEl=t,this.statsText=e,this.statsTimer=window.setInterval(()=>this.renderStats(),500),this.renderStats()}renderStats(){const t=this.statsText;if(!t)return;const e=this.perf,n=Math.min(e.n,120);let s=0,r=0,o=0;for(let u=0;u<n;u++)s+=e.update[u],r+=e.render[u],o=Math.max(o,e.update[u]+e.render[u]);const a=performance.now(),l=e.stamps.length>0&&a-e.stamps[e.stamps.length-1]<600,c=this.renderer.info;if(this.gpuName===null){const u=this.renderer.getContext(),f=u.getExtension("WEBGL_debug_renderer_info");this.gpuName=f?String(u.getParameter(f.UNMASKED_RENDERER_WEBGL)):"unknown"}const h=u=>u.toFixed(u<10?2:1),d=[l?`${e.stamps.length} fps`:"idle (draws only when something changes)",`CPU per frame  ${h(n?(s+r)/n:0)} ms avg, ${h(o)} max`,`  update ${h(n?s/n:0)}   render ${h(n?r/n:0)}`,`draw calls ${c.render.calls}   triangles ${c.render.triangles.toLocaleString()}`,`nodes ${this.nodeInfo.size}   edges ${this.edgeInfo.size}   geometries ${c.memory.geometries}   textures ${c.memory.textures}`,`layout ${this.sim?`running, step ${h(e.stepMs)} ms, alpha ${this.sim.alpha.toFixed(2)}`:"idle"}`,`last rebuild ${h(e.rebuildMs)} ms   last position update ${h(e.positionsMs)} ms`,`GPU ${this.gpuName}`];this.benchText&&d.push("",this.benchText),t.textContent=d.join(`
`)}async runBenchmark(t=4){if(this.benchmarking)throw new Error("A benchmark is already running");this.benchmarking=!0,this.stopLayout();const e=this.camera,n={pos:e.position.clone(),zoom:this.ortho.zoom,target:this.controls.target.clone()};try{const s=await this.benchPhase(t*1e3/2,!1),r=await this.benchPhase(t*1e3/2,!0);return{camera:s,updates:r}}finally{e.position.copy(n.pos),this.ortho.zoom=n.zoom,this.ortho.updateProjectionMatrix(),this.controls.target.copy(n.target),this.controls.update(),this.benchmarking=!1,this.requestRender()}}benchPhase(t,e){return new Promise(n=>{const s=[],r=[],o=[],a=this.ortho.zoom,l=performance.now();let c=0,h=0;const d=()=>{const f=[...s].sort((m,p)=>m-p),g=m=>m.length?m.reduce((p,x)=>p+x,0)/m.length:0,_=g(s);n({frames:s.length,fps:_?1e3/_:0,frameMsAvg:_,frameMsP95:f.length?f[Math.floor(f.length*.95)]:0,frameMsMax:f.length?f[f.length-1]:0,updateMsAvg:g(r),renderMsAvg:g(o)})},u=f=>{if(this.disposed)return d();if(c&&s.push(f-c),c=f,h+=.04,this.config.dimension==="2d")this.ortho.zoom=a*(1+.15*Math.sin(h)),this.ortho.updateProjectionMatrix();else{const _=this.tmpV.copy(this.persp.position).sub(this.controls.target);_.applyAxisAngle(Kx,.02),this.persp.position.copy(this.controls.target).add(_)}this.dirtyLabels=!0,e&&(this.dirtyPositions=!0),this.frame();const g=(this.perf.n-1)%120;r.push(this.perf.update[g]),o.push(this.perf.render[g]),performance.now()-l<t?requestAnimationFrame(u):d()};requestAnimationFrame(u)})}search(t,e={}){this.searchIndex||(this.searchIndex=new yu(this._graph));const n=this.searchIndex.search(t,{fields:this.config.search.fields,minChars:this.config.search.minChars});return(e.select??!0)&&(n.ids.length||n.query.trim()!==""&&!n.tooShort?(this.searchActive=!0,this.setSelection({nodes:n.ids})):this.searchActive&&(this.searchActive=!1,this.setSelection({}))),e.fit&&n.ids.length&&this.fit(n.ids),this.events.emit("search",{query:t,ids:n.ids,tooShort:n.tooShort}),n}clearSearch(){this.searchText="",this.searchInput&&(this.searchInput.value=""),this.search(""),this.searchCount&&(this.searchCount.textContent="")}focusSearch(){this.searchInput?.focus(),this.searchInput?.select()}buildSearch(){if(this.searchEl?.remove(),this.searchEl=this.searchInput=this.searchCount=null,!this.config.ui.search)return;const t=document.createElement("div");t.className="gs-search gs-ui",t.setAttribute("role","search"),t.innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>';const e=document.createElement("input");e.type="text",e.placeholder="Search…",e.setAttribute("aria-label","Search nodes and groups"),e.title="Find nodes while you type. group:Sales, tag:x, id:n1 search one field. Enter zooms to the matches, Esc clears.",e.autocomplete="off",e.spellcheck=!1,e.value=this.searchText;const n=document.createElement("span");n.className="gs-search-count",n.setAttribute("aria-live","polite");const s=document.createElement("button");s.type="button",s.className="gs-search-clear",s.textContent="×",s.title="Clear search",s.setAttribute("aria-label","Clear search");const r=o=>{this.searchText=e.value;const a=this.search(e.value,{fit:o}),l=this.config.search.minChars;n.textContent=a.ids.length?`${a.ids.length} found`:a.tooShort?`${l}+ characters`:e.value.trim()?"No match":"",s.hidden=e.value===""};e.addEventListener("input",()=>r(!1)),e.addEventListener("keydown",o=>{o.key==="Enter"?(o.preventDefault(),r(this.config.search.fitOnEnter)):o.key==="Escape"&&(o.stopPropagation(),this.clearSearch(),s.hidden=!0,e.blur())}),s.addEventListener("click",()=>{this.clearSearch(),s.hidden=!0,e.focus()}),s.hidden=e.value==="",t.append(e,n,s),this.root.appendChild(t),this.searchEl=t,this.searchInput=e,this.searchCount=n}toggleHelp(){this.helpEl?this.closeHelp():this.openHelp()}openHelp(){this.closeHelp();const t=typeof navigator<"u"&&/mac|iphone|ipad/i.test(navigator.platform||navigator.userAgent),e=document.createElement("div");e.className="gs-help gs-ui",e.setAttribute("role","dialog"),e.setAttribute("aria-label","Controls");const n=document.createElement("div");n.className="gs-help-title",n.textContent="Controls",e.appendChild(n);for(const s of bu(this.config,t)){const r=document.createElement("div");r.className="gs-help-row";const o=document.createElement("b");o.textContent=s.keys;const a=document.createElement("span");a.textContent=s.text,r.append(o,a),e.appendChild(r)}this.root.appendChild(e),this.helpEl=e,this.helpButton?.setAttribute("aria-expanded","true")}closeHelp(){this.helpEl?.remove(),this.helpEl=null,this.helpButton?.setAttribute("aria-expanded","false")}ndc=new pt;eventPoint(t){const e=this.canvas.getBoundingClientRect();return{x:t.clientX-e.left,y:t.clientY-e.top}}worldAt(t,e,n){this.camera.updateMatrixWorld(),this.ndc.set(t/this.width*2-1,-(e/this.height)*2+1),this.raycaster.setFromCamera(this.ndc,this.camera);const s=this.camera.getWorldDirection(this.tmpV2);this.plane.setFromNormalAndCoplanarPoint(s,this.tmpV.set(n[0],n[1],n[2]));const r=this.raycaster.ray.intersectPlane(this.plane,this.tmpS);return r?[r.x,r.y,r.z]:null}pick(t,e){this.camera.updateMatrixWorld();const n=this.config.dimension==="3d",s=this.tmpV;let r=null,o=1/0;for(const[c,h]of this.nodeInfo){const d=h.body.pos;if(s.set(d[0],d[1],d[2]).project(this.camera),s.z<-1||s.z>1)continue;const u=(s.x*.5+.5)*this.width,f=(-s.y*.5+.5)*this.height,g=this.pxPerUnitAt(d[0],d[1],d[2]),_=(t-u)/Math.max(h.body.hw*g,4),m=(e-f)/Math.max(h.body.hh*g,4);(h.body.ellipse||n?_*_+m*m<=1:Math.abs(_)<=1&&Math.abs(m)<=1)&&s.z<=o&&(r=c,o=s.z)}if(r)return{kind:"node",id:r};if(this.edgeInfo.size>this.config.interaction.pickLimit)return{kind:null,id:null};let a=null,l=6;for(const[c,h]of this.edgeInfo){const d=h.path;if(d.length<2)continue;let u=0,f=0;for(let g=0;g<d.length;g++){s.set(d[g][0],d[g][1],d[g][2]).project(this.camera);const _=(s.x*.5+.5)*this.width,m=(-s.y*.5+.5)*this.height;if(g>0){const p=vf(t,e,u,f,_,m);p<l&&(l=p,a=c)}u=_,f=m}}return a?{kind:"edge",id:a}:{kind:null,id:null}}onWheel=()=>{this.activeUntil=performance.now()+700,this.requestRender()};onPointerDown=t=>{if(this.helpEl&&!t.target.closest?.(".gs-help, .gs-help-btn")&&this.closeHelp(),t.target.closest?.(".gs-ui")||(this.pointerIsDown=!0,this.requestRender(),this.gizmoHovered(t))||t.button!==0)return;const e=this.eventPoint(t);this.lastPointer=e;const n=this.pick(e.x,e.y),s=t.shiftKey,r=this.config.interaction,o=n.kind==="node"&&this.selNodes.has(n.id);if(this.down={x:e.x,y:e.y,hit:n,additive:s,wasSelected:o,moved:!1,button:t.button},this.hideTooltip(),n.kind==="node"){if(this.tool==="connect")this.drag={type:"connect",from:n.id};else if(r.select&&!o&&(s&&r.multiSelect?this.selNodes.add(n.id):(this.selNodes=new Set([n.id]),this.selEdges.clear()),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),r.dragNodes){const a=this.selNodes.has(n.id)?[...this.selNodes]:[n.id],l=this.nodeInfo.get(n.id).body.pos,c=this.worldAt(e.x,e.y,l);if(c){const h=new Map,d=new Map;for(const u of a){const f=this.nodeInfo.get(u)?.body.pos;f&&(h.set(u,[f[0]-c[0],f[1]-c[1],f[2]-c[2]]),d.set(u,[f[0],f[1],f[2]]))}this.drag={type:"nodes",ids:a,primary:n.id,offsets:h,starts:d,anchor:[l[0],l[1],l[2]],px:e.x,py:e.y,moved:!1}}}}else t.shiftKey&&r.select&&r.multiSelect&&(this.drag={type:"box",x0:e.x,y0:e.y});this.drag&&(this.controls.enabled=!1,this.canvas.setPointerCapture(t.pointerId))};onPointerMove=t=>{const e=this.eventPoint(t);this.lastPointer=e;const n=this.down;n&&!n.moved&&Math.hypot(e.x-n.x,e.y-n.y)>Jx&&(n.moved=!0);const s=this.drag;if(!s){!n&&!(this.tc?.object&&this.tc.axis)&&this.scheduleHover(),this.moveTooltip(e);return}if(s.type==="nodes"){if(!n?.moved)return;s.moved||(s.moved=!0,this.dragIds=s.ids,this.canvas.style.cursor="grabbing",this.events.emit("nodedragstart",{ids:s.ids})),this.dragNodes(s,e)}else if(s.type==="connect"){this.updateRubber(s.from,e);const r=this.pick(e.x,e.y),o=r.kind==="node"?r.id:null;o!==this.hoverNode&&(this.hoverNode=o,this.dirtyNodes=!0,this.requestRender())}else if(n?.moved){const r=Math.min(s.x0,e.x),o=Math.min(s.y0,e.y);this.boxEl.hidden=!1,Object.assign(this.boxEl.style,{left:`${r}px`,top:`${o}px`,width:`${Math.abs(e.x-s.x0)}px`,height:`${Math.abs(e.y-s.y0)}px`})}};onPointerUp=t=>{this.pointerIsDown=!1,this.activeUntil=performance.now()+1e3,this.requestRender();const e=this.down,n=this.drag;if(this.down=null,this.drag=null,this.controls.enabled=!0,this.canvas.hasPointerCapture?.(t.pointerId)&&this.canvas.releasePointerCapture(t.pointerId),this.boxEl.hidden=!0,this.removeRubber(),this.setAxisGuide(null),this.canvas.style.cursor=this.tool==="connect"?"crosshair":"",n?.type==="nodes"&&n.moved){for(const r of n.ids)this.sim?.unpin(r,!!this._graph.getNode(r)?.pinned);this.dragIds=[],this.events.emit("nodedragend",{ids:n.ids});return}if(!e||t.type==="pointercancel")return;const s=this.eventPoint(t);if(n?.type==="connect"){const r=this.pick(s.x,s.y);r.kind==="node"&&this.events.emit("connect",{source:n.from,target:r.id});return}if(n?.type==="box"&&e.moved){this.selectInBox(n.x0,n.y0,s.x,s.y,e.additive);return}e.moved||this.handleClick(e.hit,e.additive,e.wasSelected,t)};handleClick(t,e,n,s){const r=this.config.interaction,o=l=>r.openLinks==="click"||r.openLinks==="ctrl-click"&&l,a=s.ctrlKey||s.metaKey;if(t.kind==="node"){const l=this._graph.getNode(t.id);if(!l)return;r.select&&n&&(e?this.selNodes.delete(t.id):this.selNodes.size>1&&(this.selNodes=new Set([t.id])),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),this.events.emit("nodeclick",{id:t.id,node:l,originalEvent:s}),o(a)&&this.openLink("node",t.id)}else if(t.kind==="edge"){const l=this._graph.getEdge(t.id);if(!l)return;r.select&&(e&&r.multiSelect?this.selEdges.delete(t.id)||this.selEdges.add(t.id):(this.selNodes.clear(),this.selEdges=new Set([t.id])),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),this.events.emit("edgeclick",{id:t.id,edge:l,originalEvent:s}),o(a)&&this.openLink("edge",t.id)}else{e||this.clearSelection();const l=this.eventPoint(s),c=this.worldAt(l.x,l.y,this.config.dimension==="3d"?this.controls.target.toArray():[0,0,0])??[0,0,0];this.events.emit("backgroundclick",{position:c,originalEvent:s})}}onDblClick=t=>{if(t.target.closest?.(".gs-ui"))return;const e=this.eventPoint(t),n=this.pick(e.x,e.y),s=this.config.interaction.openLinks==="dblclick";if(n.kind==="node"){const r=this._graph.getNode(n.id);r&&this.events.emit("nodedblclick",{id:n.id,node:r,originalEvent:t}),s&&this.openLink("node",n.id)}else if(n.kind==="edge")s&&this.openLink("edge",n.id);else{const r=this.worldAt(e.x,e.y,this.config.dimension==="3d"?this.controls.target.toArray():[0,0,0])??[0,0,0];this.events.emit("backgrounddblclick",{position:r,originalEvent:t})}};onPointerLeave=()=>{this.pointerInside=!1,!this.drag&&(this.hideTooltip(),(this.hoverNode||this.hoverEdge)&&(this.hoverNode=this.hoverEdge=null,this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("hover",{kind:null,id:null}),this.requestRender()))};activeAxes(){if(!this.config.interaction.axisLock)return[];const t=this.config.dimension==="3d";return[...this.axisKeys].filter(e=>t||e!=="z")}toScreen(t){return this.camera.updateMatrixWorld(),this.tmpV.set(t[0],t[1],t[2]).project(this.camera),{x:(this.tmpV.x*.5+.5)*this.width,y:(-this.tmpV.y*.5+.5)*this.height}}dragNodes(t,e){const n=this.config.dimension==="3d",s=this.activeAxes(),r=[];let o=null;if(s.length===1){const a=s[0],l=t.starts.get(t.primary);if(!l)return;const c=[0,0,0];c[$h[a]]=1;const h=10,d=this.toScreen(l),u=this.toScreen([l[0]+c[0]*h,l[1]+c[1]*h,l[2]+c[2]*h]),f=u.x-d.x,g=u.y-d.y,_=f*f+g*g,m=_>1e-6?((e.x-t.px)*f+(e.y-t.py)*g)/_*h:0;for(const p of t.ids){const x=t.starts.get(p),y=this._graph.getNode(p);!x||!y||r.push([p,[x[0]+c[0]*m,x[1]+c[1]*m,n?x[2]+c[2]*m:y.z??0]])}o={origin:l,axis:a}}else{const a=this.worldAt(e.x,e.y,t.anchor);if(!a)return;const l=s.length===0;for(const c of t.ids){const h=t.offsets.get(c),d=t.starts.get(c),u=this._graph.getNode(c);if(!h||!d||!u)continue;const f=(g,_)=>l||s.includes(_)?a[g]+h[g]:d[g];r.push([c,[f(0,"x"),f(1,"y"),n?f(2,"z"):u.z??0]])}}this.setAxisGuide(o),this._graph.setPositions(r)}setAxisGuide(t){if(!t){if(!this.guide)return;this.scene.remove(this.guide),this.guide.geometry.dispose(),this.guide.material.dispose(),this.guide=null,this.requestRender();return}if(!this.guide){const o=new ve;o.setAttribute("position",new Xe(new Float32Array(6),3)),this.guide=new wn(o,new po({color:this.color(Yh[t.axis]),depthTest:!1,transparent:!0,opacity:.8})),this.guide.renderOrder=19,this.guide.frustumCulled=!1,this.scene.add(this.guide)}this.guide.material.color.copy(this.color(Yh[t.axis]));const e=this.guide.geometry.getAttribute("position"),n=$h[t.axis],s=[t.origin[0],t.origin[1],t.origin[2]],r=[t.origin[0],t.origin[1],t.origin[2]];s[n]-=5e4,r[n]+=5e4,e.setXYZ(0,s[0],s[1],s[2]),e.setXYZ(1,r[0],r[1],r[2]),e.needsUpdate=!0,this.requestRender()}onKeyDown=t=>{this.setSnap(t.ctrlKey||t.metaKey);const e=!!t.target?.matches?.("input, textarea, select");if(t.key==="Escape"&&this.helpEl&&this.closeHelp(),t.key==="?"&&this.pointerInside&&!e&&this.config.ui.help&&(t.preventDefault(),this.toggleHelp()),t.key==="Escape"&&this.container.classList.contains("gs-pseudo-fullscreen")&&this.toggleFullscreen(!1),t.ctrlKey||t.metaKey||t.altKey||t.target?.matches?.("input, textarea, select"))return;const s=t.key.toLowerCase();(s==="x"||s==="y"||s==="z")&&!this.axisKeys.has(s)&&(this.axisKeys.add(s),this.refreshAxisDrag())};onKeyUp=t=>{this.setSnap(t.ctrlKey||t.metaKey);const e=t.key.toLowerCase();(e==="x"||e==="y"||e==="z")&&this.axisKeys.delete(e)&&this.refreshAxisDrag()};onBlur=()=>{this.axisKeys.size&&(this.axisKeys.clear(),this.refreshAxisDrag())};refreshAxisDrag(){const t=this.drag;t?.type==="nodes"&&t.moved&&this.dragNodes(t,this.lastPointer)}selectInBox(t,e,n,s,r){this.camera.updateMatrixWorld();const o=Math.min(t,n),a=Math.max(t,n),l=Math.min(e,s),c=Math.max(e,s),h=r?new Set(this.selNodes):new Set;for(const[d,u]of this.nodeInfo){const f=u.body.pos;this.tmpV.set(f[0],f[1],f[2]).project(this.camera);const g=(this.tmpV.x*.5+.5)*this.width,_=(-this.tmpV.y*.5+.5)*this.height;this.tmpV.z>=-1&&this.tmpV.z<=1&&g>=o&&g<=a&&_>=l&&_<=c&&h.add(d)}this.setSelection({nodes:[...h]})}scheduleHover(){!this.config.interaction.hover||this.hoverRaf||(this.hoverRaf=requestAnimationFrame(()=>{this.hoverRaf=0,this.updateHover()}))}updateHover(){if(this.drag||this.disposed)return;const t=this.pick(this.lastPointer.x,this.lastPointer.y),e=t.kind==="node"?t.id:null,n=t.kind==="edge"?t.id:null;e!==this.hoverNode&&(this.dirtyNodes=!0),n!==this.hoverEdge&&(this.dirtyEdges=!0),(e!==this.hoverNode||n!==this.hoverEdge)&&(this.hoverNode=e,this.hoverEdge=n,this.events.emit("hover",{kind:t.kind,id:t.id}),this.showTooltip(t),this.requestRender());const s=t.kind==="node"?this._graph.getNode(t.id):t.kind==="edge"?this._graph.getEdge(t.id):void 0;this.canvas.style.cursor=this.tool==="connect"?"crosshair":s?.url?"pointer":""}hideTooltip(){this.tooltipEl.hidden=!0}showTooltip(t){const e=this.tooltipEl;if(!this.config.interaction.tooltip||t.kind===null){e.hidden=!0;return}e.replaceChildren();const n=(r,o)=>{const a=document.createElement("div");o&&(a.className=o),a.textContent=r,e.appendChild(a)},s=this._graph;if(t.kind==="node"){const r=s.getNode(t.id);if(!r)return;n(r.label??r.id,"gs-tt-title"),r.sublabel&&n(r.sublabel,"gs-tt-muted"),r.group&&n(r.group,"gs-tt-muted"),r.url&&n(r.url,"gs-tt-muted");const o=this.linkHint(r.url);o&&n(o,"gs-tt-hint");for(const[a,l]of Object.entries(r.props??{}))n(`${a}: ${l}`,"gs-tt-muted")}else{const r=s.getEdge(t.id);if(!r)return;const o=l=>s.getNode(l)?.label??l;n(`${o(r.source)} ${s.isDirected(r)?"→":"—"} ${o(r.target)}`,"gs-tt-title"),n(`weight ${s.weightOf(r)}`,"gs-tt-muted"),r.label&&n(r.label),r.url&&n(r.url,"gs-tt-muted");const a=this.linkHint(r.url);a&&n(a,"gs-tt-hint")}e.hidden=!1,this.moveTooltip(this.lastPointer)}moveTooltip(t){const e=this.tooltipEl;if(e.hidden)return;const n=14;let s=t.x+n,r=t.y+n;s+e.offsetWidth>this.width&&(s=Math.max(0,t.x-e.offsetWidth-n)),r+e.offsetHeight>this.height&&(r=Math.max(0,t.y-e.offsetHeight-n)),e.style.left=`${s}px`,e.style.top=`${r}px`}updateRubber(t,e){const n=this.nodeInfo.get(t);if(!n)return;const s=this.worldAt(e.x,e.y,n.body.pos)??n.body.pos;if(!this.rubber){const o=new ve;o.setAttribute("position",new Xe(new Float32Array(6),3));const a=new po({color:this.color(this.config.selection.color),depthTest:!1,transparent:!0});this.rubber=new wn(o,a),this.rubber.renderOrder=20,this.rubber.frustumCulled=!1,this.scene.add(this.rubber)}const r=this.rubber.geometry.getAttribute("position");r.setXYZ(0,n.body.pos[0],n.body.pos[1],n.body.pos[2]),r.setXYZ(1,s[0],s[1],s[2]),r.needsUpdate=!0,this.requestRender()}removeRubber(){this.rubber&&(this.scene.remove(this.rubber),this.rubber.geometry.dispose(),this.rubber.material.dispose(),this.rubber=null,this.requestRender())}openPanel(t,e){this.closePanel();const n=document.createElement("div");n.className="gs-panel gs-ui";const s=document.createElement("div");s.className="gs-panel-head";const r=document.createElement("span");r.className="gs-panel-title",r.textContent=e;const o=document.createElement("button");o.type="button",o.className="gs-btn",o.textContent="×",o.title="Close",o.setAttribute("aria-label","Close panel"),o.addEventListener("click",()=>this.closePanel()),s.append(r,o);const a=document.createElement("iframe");a.setAttribute("sandbox",this.config.links.panelSandbox),a.title=e,a.src=t,n.append(s,a),this.root.appendChild(n),this.panelEl=n}}const Qe=i=>document.getElementById(i);function J(i,t={},...e){const n=document.createElement(i),{class:s,...r}=t;return typeof s=="string"&&(n.className=s),Object.assign(n,r),n.append(...e),n}const eo=document.createElement("canvas").getContext("2d");function jh(i){return i?(eo.fillStyle="#000000",eo.fillStyle=i,/^#[0-9a-f]{6}$/i.test(eo.fillStyle)?eo.fillStyle:"#888888"):"#888888"}function Ml(i,t,e){const n=J("a",{href:URL.createObjectURL(new Blob([t],{type:e})),download:i});document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(n.href),2e3)}class ty{stack=[];i=-1;push(t){this.stack[this.i]!==t&&(this.stack.length=this.i+1,this.stack.push(t),this.stack.length>100&&this.stack.shift(),this.i=this.stack.length-1)}reset(){this.stack=[],this.i=-1}get current(){return this.stack[this.i]??null}get canUndo(){return this.i>0}get canRedo(){return this.i<this.stack.length-1}undo(){return this.canUndo?this.stack[--this.i]:null}redo(){return this.canRedo?this.stack[++this.i]:null}}const jd="graphscape.theme";function ey(){try{return localStorage.getItem(jd)??"light"}catch{return"light"}}const Zt=new no,Je=new ty,Es=window,Kl=typeof Es.showOpenFilePicker=="function"&&typeof Es.showSaveFilePicker=="function";let Vn=null,Co=null;const Ro=()=>Je.current!==Co,bl=()=>Vn?.name??"Untitled graph",ny={theme:ey(),interaction:{openLinks:"ctrl-click",gizmo:!0},links:{target:"blank",allowAbsolute:!0},ui:{fullscreen:!1}},ut=new Qx(Qe("stage"),ny,Zt);let Jl="select",Ps="",vn="";const iy=[["Social network (JSON)","social.json"],["Evolution, directed (JSON)","evolution.json"],["Class diagram (yEd GraphML)","classes.graphml"]];function an(){Zt.meta.dimension=ut.getDimension(),Je.push(JSON.stringify(Zt.toData())),xe()}function Po(i,t="",e=null){Je.reset(),ut.load(i),vn="",Ps=t,Vn=e,an(),Co=Je.current,xe(),ui()}function _o(i){i&&(Zt.load(JSON.parse(i)),ut.clearSelection(),xe(),ui())}function Zd(i){const t=Zt.nodes.length+1,e=Zt.addNode({label:`Node ${t}`,x:i[0],y:i[1],z:ut.getDimension()==="3d"?i[2]:0});ut.setSelection({nodes:[e.id]}),an()}function Lo(){const i=ut.getSelection();if(!(!i.nodes.length&&!i.edges.length)){for(const t of i.edges)Zt.removeEdge(t);for(const t of i.nodes)Zt.removeNode(t);ut.clearSelection(),an(),ui()}}function Kd(i,t){const e=Zt.addEdge({source:i,target:t});ut.setSelection({edges:[e.id]}),an()}function ps(i){Jl=i,ut.setTool(i==="connect"?"connect":"select");for(const t of document.querySelectorAll("button.tool[data-tool]"))t.setAttribute("aria-pressed",String(t.dataset.tool===i));xe()}const sy={select:"Drag nodes freely, or use the gizmo of the selection: M move, R rotate, S scale (Ctrl snaps). Hold X, Y or Z while dragging to lock an axis. Shift selects several.",add:"Click on the canvas to add a node.",connect:"Drag from one node to another to add an edge. Release on the same node for a self loop."},Jd=J("button",{textContent:"Undo",title:"Undo (Ctrl+Z)",onclick:()=>_o(Je.undo())}),Qd=J("button",{textContent:"Redo",title:"Redo (Ctrl+Y)",onclick:()=>_o(Je.redo())}),Zh=J("select",{title:"Layout algorithm","aria-label":"Layout algorithm"},...Cf.map(i=>J("option",{value:i,textContent:i}))),Do=J("button",{textContent:"Stop",title:"Stop the running layout",disabled:!0,onclick:()=>ut.stopLayout()}),tu=J("button",{title:"Switch between 2D and 3D",onclick:()=>ut.setDimension(ut.getDimension()==="2d"?"3d":"2d")}),sr=J("select",{title:"Theme","aria-label":"Theme",onchange:()=>{ut.setConfig({theme:sr.value});try{localStorage.setItem(jd,sr.value)}catch{}xe(),ui()}},...Object.keys(td).map(i=>J("option",{value:i,textContent:i})));sr.value=ut.getConfig().theme;const Sl=J("span",{class:"ed-file"}),eu=J("select",{title:"File format for new files"+(Kl?" (you can also pick it in the Save as dialog)":" and downloads"),"aria-label":"File format"},...vs.map(i=>J("option",{value:i.id,textContent:i.label}))),wl=J("select",{title:"Load a sample","aria-label":"Samples",onchange:()=>{const i=wl.value;wl.value="",i&&hu(i)}},J("option",{value:"",textContent:"Samples…"}),...iy.map(([i,t])=>J("option",{value:t,textContent:i})));Qe("top").append(J("span",{class:"ed-brand",textContent:"Graphscape"}),J("div",{class:"ed-group"},J("button",{textContent:"New",title:"New empty graph",onclick:()=>void ay()}),J("button",{textContent:"Open…",title:"Open a graph file (Ctrl+O)",onclick:()=>void cu()}),wl,J("button",{textContent:"Generate…",title:"Random clustered graph",onclick:()=>void ly()})),J("div",{class:"ed-group"},J("button",{textContent:"Save",title:"Save to the open file (Ctrl+S)",onclick:()=>void Ql()}),J("button",{textContent:"Save as…",title:"Save under a new name (Ctrl+Shift+S)",onclick:()=>void vo()}),eu,J("button",{textContent:"PNG",title:"Export the current view as image",onclick:()=>{J("a",{href:ut.exportImage(),download:`${Zt.meta.title||"graph"}.png`}).click()}}),Sl),J("div",{class:"ed-group"},Jd,Qd),J("div",{class:"ed-group"},Zh,J("button",{textContent:"Run layout",onclick:()=>{ut.runLayout(Zh.value).then(an)}}),Do),J("div",{class:"ed-group"},tu,J("button",{textContent:"Fit",title:"Fit graph to view (F)",onclick:()=>ut.fit()}),sr));function Aa(i,t,e,n){return J("button",{class:"tool",title:n,"aria-pressed":i==="select",onclick:()=>ps(i)},J("span",{class:"glyph",textContent:t}),e)}const nu=[Aa("select","↖","Select","Select and move (V)"),Aa("add","○","Node","Add nodes (N)"),Aa("connect","↗","Edge","Connect nodes (E)")];nu.forEach((i,t)=>i.dataset.tool=["select","add","connect"][t]);const iu=["translate","rotate","scale"].map(i=>{const t={translate:"✥",rotate:"↻",scale:"⤢"}[i],e={translate:"Move",rotate:"Rotate",scale:"Scale"}[i],n={translate:"M",rotate:"R",scale:"S"}[i],s=J("button",{class:"tool",title:`${e} gizmo (${n}); Ctrl snaps. Rotate and scale need two or more selected nodes.`,"aria-pressed":i==="translate",onclick:()=>ut.setGizmoMode(i)},J("span",{class:"glyph",textContent:t}),e);return s.dataset.gizmo=i,s});Qe("tools").append(...nu,J("hr",{class:"ed-sep"}),...iu,J("button",{class:"tool danger",title:"Delete selection (Del)",onclick:Lo},J("span",{class:"glyph",textContent:"✕"}),"Delete"));function xe(){const i=ut.getConfig().ui.cssVars,t=document.documentElement.style;t.setProperty("--ed-panel-bg",(i["panel-bg"]??"#fff").replace(/rgba\(([^)]+),\s*[\d.]+\)/,"rgb($1)")),t.setProperty("--ed-panel-fg",i["panel-fg"]??"#1f2933"),t.setProperty("--ed-panel-border",i["panel-border"]??"#cfd6de"),t.setProperty("--ed-accent",i.accent??"#e8590c"),tu.textContent=ut.getDimension()==="2d"?"Switch to 3D":"Switch to 2D",Jd.disabled=!Je.canUndo,Qd.disabled=!Je.canRedo,Do.disabled=!ut.isLayoutRunning;const e=Ro();Sl.textContent=`${bl()}${e?" •":""}`,Sl.title=e?"Unsaved changes":Vn?.handle?"Saved; Save overwrites this file":"No unsaved changes",document.title=`${e?"• ":""}${bl()} – Graphscape`;const n=ut.getSelection();Qe("status").replaceChildren(J("span",{textContent:`${Zt.nodes.length} nodes, ${Zt.edges.length} edges, ${Zt.directed?"directed":"undirected"}, ${ut.getDimension().toUpperCase()}`}),J("span",{textContent:n.nodes.length+n.edges.length?`${n.nodes.length} nodes and ${n.edges.length} edges selected`:""}),J("span",{textContent:Ps||sy[Jl]}),J("span",{class:"warn",textContent:vn}))}const ry={json:"",graphml:"Graphscape writes its own GraphML. Positions, colors, shapes, labels, URLs and weights are kept, but anything it does not model is lost, for example yEd bend points, ports, nested group containers, table nodes and custom node graphics.",gml:"Graphscape writes its own GML. Attributes it does not model are lost.",dot:"Graphscape writes its own DOT. Graphviz attributes it does not model (ranks, ports, most styles) are lost.",csv:"A CSV edge list only stores edges: node colors, shapes, groups, positions and other node details are not saved."};function su(i,t,e){return new Promise(n=>{const s=J("dialog",{class:"ed-dialog ed-small","aria-label":i}),r=J("div",{class:"ed-actions"},...e.map(o=>J("button",{class:o.primary?"primary":"",textContent:o.label,onclick:()=>s.close(o.value)})));s.append(J("div",{class:"ed-dialog-body"},J("h2",{class:"ed-title",textContent:i}),J("p",{class:"ed-pre",textContent:t}),r)),s.addEventListener("close",()=>{const o=s.returnValue||"cancel";s.remove(),n(o)}),document.body.append(s),s.showModal(),r.querySelector("button.primary")?.focus()})}const ru=i=>i instanceof DOMException&&i.name==="AbortError",oy=i=>{const t=i.split(".").pop()?.toLowerCase()??"";return vs.find(e=>e.extensions.includes(t))?.id},ou=i=>[...vs].sort((t,e)=>t.id===i?-1:e.id===i?1:0).map(t=>({description:t.label,accept:{[t.mime]:t.extensions.map(e=>`.${e}`)}}));function au(i){const t=Zt.toData();return t.meta={...t.meta,dimension:ut.getDimension()},cf(t,i)}async function Io(){if(!Ro())return!0;const i=await su("Unsaved changes",`Do you want to save the changes to "${bl()}" first?`,[{label:"Save",value:"save",primary:!0},{label:"Don't save",value:"discard"},{label:"Cancel",value:"cancel"}]);return i==="save"?Ql():i==="discard"}async function lu(i){if(!i.handle)return!1;try{const t=await i.handle.createWritable();return await t.write(au(i.format)),await t.close(),Co=Je.current,vn="",Ps=`Saved ${i.name}`,xe(),!0}catch(t){return vn=`Could not save ${i.name}: ${t.message}`,xe(),!1}}async function Ql(){const i=Vn;if(!i?.handle)return vo();if(!Ro())return Ps="No changes to save.",xe(),!0;if(i.fromDisk&&!i.confirmed){const t=await su(`Overwrite ${i.name}?`,`${i.format==="json"?"":ry[i.format]+`

`}This replaces the file on disk with the current graph. You will not be asked again for this file during this session.`,[{label:"Overwrite",value:"ok",primary:!0},{label:"Save as…",value:"as"},{label:"Cancel",value:"cancel"}]);if(t==="as")return vo();if(t!=="ok")return!1;i.confirmed=!0}return lu(i)}async function vo(){const i=Vn?.format??eu.value;if(Kl&&Es.showSaveFilePicker)try{const n=vs.find(o=>o.id===i).extensions[0],s=await Es.showSaveFilePicker({suggestedName:Vn?.name??`${Zt.meta.title||"graph"}.${n}`,types:ou(i)}),r={name:s.name,format:oy(s.name)??i,handle:s,fromDisk:!1,confirmed:!0};return Vn=r,lu(r)}catch(n){return ru(n)||(vn=`Could not save: ${n.message}`,xe()),!1}const t=vs.find(n=>n.id===i),e=Vn?.name??`${Zt.meta.title||"graph"}.${t.extensions[0]}`;return Ml(e,au(i),t.mime),Vn={name:e,format:i,fromDisk:!1,confirmed:!0},Co=Je.current,Ps=`Downloaded ${e}. This browser cannot overwrite files; Chrome and Edge can.`,xe(),!0}async function ay(){await Io()&&Po({directed:!1,nodes:[],edges:[]})}async function cu(){if(Kl&&Es.showOpenFilePicker)try{const[i]=await Es.showOpenFilePicker({multiple:!1,mode:"readwrite",types:ou()});await tc(await i.getFile(),i)}catch(i){ru(i)||(vn=`Could not open: ${i.message}`,xe())}else Qe("file").click()}async function hu(i){if(await Io())try{const t=await fetch(`samples/${i}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const{graph:e,warnings:n}=ld(await t.text(),{filename:i});Po(e,`Loaded sample ${i}`),n.length&&(vn=`${n.length} import warning(s): ${n[0]}`),xe()}catch(t){vn=`Could not load sample: ${t.message}`,xe()}}async function tc(i,t){if(await Io())try{const e=await i.text(),s=ad(e,i.name)==="csv"?confirm("This is an edge list. Treat edges as directed?"):!1,r=ld(e,{filename:i.name,directed:s});Po(r.graph,`Opened ${i.name} (${r.format})`,{name:i.name,format:r.format,handle:t,fromDisk:!0,confirmed:!1}),r.warnings.length&&(vn=`${r.warnings.length} import warning(s): ${r.warnings[0]}`),xe()}catch(e){vn=`Import failed: ${e.message}`,xe()}}async function ly(){if(!await Io())return;const i=Number(prompt("Number of nodes (1 to 10000)","200"));if(!Number.isFinite(i)||i<1)return;const t=Math.min(1e4,Math.floor(i));Po(Su({nodes:t,clusters:Math.max(2,Math.round(Math.sqrt(t)/3)),avgDegree:4,seed:Date.now()%1e6}),`Generated ${t} nodes`)}window.addEventListener("beforeunload",i=>{Ro()&&(i.preventDefault(),i.returnValue="")});Qe("file").addEventListener("change",i=>{const t=i.target,e=t.files?.[0];t.value="",e&&tc(e)});const Ts=Qe("stage");Ts.addEventListener("dragover",i=>{i.preventDefault(),Ts.classList.add("drop")});Ts.addEventListener("dragleave",()=>Ts.classList.remove("drop"));Ts.addEventListener("drop",i=>{i.preventDefault(),Ts.classList.remove("drop");const t=i.dataTransfer?.files[0];if(!t)return;const n=i.dataTransfer?.items?.[0]?.getAsFileSystemHandle?.();(async()=>{let s;try{const r=await n;r&&typeof r.createWritable=="function"&&(s=r)}catch{}await tc(t,s)})()});function Hi(i,t){return J("label",{class:"ed-field"},J("span",{textContent:i}),t)}function rr(i,t,e,n=""){const s=J("input",{type:"text",value:t??"",placeholder:n,onchange:()=>e(s.value===""?void 0:s.value)});return Hi(i,s)}function Kh(i,t,e,n="",s=2){const r=J("textarea",{value:t??"",placeholder:n,rows:s,onchange:()=>e(r.value===""?void 0:r.value)});return Hi(i,r)}function El(i,t,e,n=""){const s=J("input",{type:"number",value:t===void 0?"":String(t),placeholder:n,step:"any",onchange:()=>e(s.value===""||!Number.isFinite(Number(s.value))?void 0:Number(s.value))});return Hi(i,s)}function xo(i,t,e,n){const s=J("select",{onchange:()=>n(s.value)},...e.map(([r,o])=>J("option",{value:r,textContent:o})));return s.value=t,Hi(i,s)}function Ri(i,t,e){const n=J("input",{type:"checkbox",checked:t,onchange:()=>e(n.checked)});return Hi(i,n)}function du(i,t,e,n){const s=J("input",{type:"color",value:jh(t??e),onchange:()=>n(s.value)}),r=J("button",{textContent:"Default",title:"Use the color from the theme",onclick:()=>{n(void 0),s.value=jh(e)}});return Hi(i,J("div",{class:"ed-row"},s,r))}const pn=i=>i.every(t=>t===i[0])?i[0]:void 0;function cy(i){const t=i.map(r=>Zt.getNode(r)).filter(r=>!!r);if(!t.length)return;const e=t.length===1?t[0]:null,n=r=>{for(const o of t)Zt.updateNode(o.id,r);an()},s=Qe("inspector");if(s.replaceChildren(J("h2",{class:"ed-title",textContent:e?`Node ${e.id}`:`${t.length} nodes`})),e&&s.append(Kh("Label",e.label,r=>n({label:r}),e.id),Kh("Subline",e.sublabel,r=>n({sublabel:r}),"second, smaller line"),J("p",{class:"ed-hint",textContent:"Press Enter for a line break inside the label."})),s.append(rr("Group",pn(t.map(r=>r.group)),r=>n({group:r}),t.length>1?"mixed":""),rr("URL",pn(t.map(r=>r.url)),r=>n({url:r}),"relative path, e.g. pages/a.html"),du("Color",pn(t.map(r=>r.color)),ut.getNodeStyle(t[0].id)?.color,r=>n({color:r})),xo("Shape",pn(t.map(r=>r.shape))??"",[["","default"],...Mo.map(r=>[r,r])],r=>n({shape:r||void 0})),El("Size",pn(t.map(r=>r.size)),r=>n({size:r}),String(ut.getConfig().node.size)),Ri("Pinned",t.every(r=>r.pinned),r=>n({pinned:r||void 0}))),e&&e.shape==="card"){const r=J("textarea",{rows:6,value:(e.body??[]).join(`
`),onchange:()=>n({body:r.value===""?void 0:r.value.split(`
`)})});s.append(Hi("Body",r),J("p",{class:"ed-hint",textContent:"One line per row. A row with --- draws a separator."}))}e&&s.append(J("p",{class:"ed-muted",textContent:`${Zt.degree(e.id)} edge ends, position ${Math.round(e.x??0)}, ${Math.round(e.y??0)}`})),s.append(J("div",{class:"ed-actions"},...e?.url?[J("button",{textContent:"Open link",onclick:()=>ut.openLink("node",e.id)})]:[],...t.length===2?[J("button",{textContent:"Connect",onclick:()=>Kd(t[0].id,t[1].id)})]:[],J("button",{class:"danger",textContent:"Delete",onclick:Lo})))}function hy(i){const t=i.map(a=>Zt.getEdge(a)).filter(a=>!!a);if(!t.length)return;const e=t.length===1?t[0]:null,n=a=>{for(const l of t)Zt.updateEdge(l.id,a);an()},s=Qe("inspector"),r=a=>Zt.getNode(a)?.label??a;s.replaceChildren(J("h2",{class:"ed-title",textContent:e?`Edge ${r(e.source)} ${Zt.isDirected(e)?"→":"—"} ${r(e.target)}`:`${t.length} edges`}));const o=a=>a.directed===void 0?"inherit":a.directed?"yes":"no";s.append(El("Weight",pn(t.map(a=>a.weight)),a=>n({weight:a}),"1 (default)"),rr("Label",pn(t.map(a=>a.label)),a=>n({label:a})),rr("URL",pn(t.map(a=>a.url)),a=>n({url:a}),"relative path"),du("Color",pn(t.map(a=>a.color)),ut.getEdgeStyle(t[0].id)?.color,a=>n({color:a})),xo("Direction",pn(t.map(o))??"inherit",[["inherit",`graph default (${Zt.directed?"directed":"undirected"})`],["yes","directed"],["no","undirected"]],a=>n({directed:a==="inherit"?void 0:a==="yes"})),Ri("Dashed",t.every(a=>a.dashed),a=>n({dashed:a||void 0})),El("Width",pn(t.map(a=>a.width)),a=>n({width:a}),String(ut.getConfig().edge.width))),s.append(J("div",{class:"ed-actions"},...e?[J("button",{textContent:"Reverse",title:"Swap source and target",onclick:()=>{n({source:e.target,target:e.source}),ui()}})]:[],...e?.url?[J("button",{textContent:"Open link",onclick:()=>ut.openLink("edge",e.id)})]:[],J("button",{class:"danger",textContent:"Delete",onclick:Lo})))}function dy(){Qe("inspector").replaceChildren(J("h2",{class:"ed-title",textContent:"Graph"}),rr("Title",Zt.meta.title,t=>{Zt.meta.title=t,an()},"untitled"),Ri("Directed",Zt.directed,t=>{Zt.setDirected(t),an()}),J("p",{class:"ed-hint",textContent:"Directed is the default for all edges; individual edges can override it."}),xo("3D rotation",ut.getConfig().camera.rotation,[["orbit","Orbit (horizon stays level)"],["free","Free (trackball)"]],t=>ut.setConfig({camera:{rotation:t}})),xo("Force weights",ut.getConfig().layout.weightMode,[["ignore","Ignore weights"],["closer","Heavier = shorter"],["longer","Heavier = longer"]],t=>ut.setConfig({layout:{weightMode:t}})),J("p",{class:"ed-hint",textContent:"Edge weights as lengths in the force layout: similarity (heavier = shorter) or distance (heavier = longer). Applies the next time the force layout runs."}),Ri("Weights",ut.getConfig().weight.show!=="never",t=>{ut.setConfig({weight:{show:t?"auto":"never"}})}),Ri("Group legend",ut.getConfig().ui.legend,t=>{ut.setConfig({ui:{legend:t}})}),Ri("Perf. stats",ut.getConfig().ui.stats,t=>{ut.setConfig({ui:{stats:t}})}),Ri("Width by weight",ut.getConfig().edge.widthByWeight.enabled,t=>{ut.setConfig({edge:{widthByWeight:{enabled:t}}})}),J("h3",{class:"ed-section",textContent:"Skin and configuration"}),J("p",{class:"ed-hint",textContent:"Every option with an explanation, as JSON with comments. Edit and apply it, or save it as the skin file of your website."}),J("div",{class:"ed-actions"},J("button",{textContent:"Edit configuration…",onclick:uy}),J("button",{textContent:"Load file…",onclick:()=>Qe("cfgfile").click()})),J("p",{class:"ed-hint",textContent:"Select a node or edge to edit it. The README lists every option as well."}))}const yo=J("textarea",{class:"ed-code ed-code-big",spellcheck:!1,wrap:"off","aria-label":"Configuration"}),Qs=J("p",{class:"ed-hint"}),uu=J("input",{type:"checkbox",checked:!0,onchange:()=>{ec(yo.value,!0),Uo()}}),or=J("dialog",{class:"ed-dialog","aria-label":"Configuration"},J("div",{class:"ed-dialog-body"},J("h2",{class:"ed-title",textContent:"Configuration"}),J("p",{class:"ed-muted",textContent:"JSON with comments: // and /* */ are allowed, so is a trailing comma. Only values that differ from the defaults and the theme are kept when you apply or save."}),J("label",{class:"ed-row"},uu,"Show all options with explanations (otherwise only what you changed)"),yo,Qs,J("div",{class:"ed-actions"},J("button",{textContent:"Apply",onclick:()=>{Qs.textContent=ec(yo.value)}}),J("button",{textContent:"Reset to theme",title:"Remove all your changes except the theme",onclick:()=>{ut.setUserConfig({theme:ut.getConfig().theme}),Uo(),Qs.textContent="Reset.",xe()}}),J("button",{textContent:"Download .json",onclick:()=>Ml("graphscape.config.json",JSON.stringify(ut.getUserConfig(),null,2)+`
`,"application/json")}),J("button",{textContent:"Download .jsonc",title:"With comments; data-config of the script-tag bundle reads it",onclick:()=>Ml("graphscape.config.jsonc",ed(ut.getUserConfig()),"application/json")}),J("button",{textContent:"Load file…",onclick:()=>Qe("cfgfile").click()}),J("button",{textContent:"Close",onclick:()=>or.close()}))));document.body.append(or);function Uo(){yo.value=ed(uu.checked?ut.getConfig():ut.getUserConfig())}function ec(i,t=!1){try{const e=Ru(i),n=id(e),s=io({theme:e.theme});return ut.setUserConfig(nd(s,e)),sr.value=ut.getConfig().theme,xe(),n.length?`Applied. Not an option, ignored: ${n.join(", ")}`:t?"":"Applied."}catch(e){return`Not applied: ${e.message}`}}function uy(){Uo(),Qs.textContent="",or.open||or.showModal()}function ui(){const i=ut.getSelection();i.nodes.length?cy(i.nodes):i.edges.length?hy(i.edges):dy(),xe()}Qe("cfgfile").addEventListener("change",async i=>{const t=i.target,e=t.files?.[0];if(t.value="",!e)return;const n=ec(await e.text());or.open?(Uo(),Qs.textContent=n):(vn=n.startsWith("Not applied")?n:"",ui())});ut.on("selection",ui);ut.on("gizmomode",({mode:i})=>{for(const t of iu)t.setAttribute("aria-pressed",String(t.dataset.gizmo===i))});ut.on("backgroundclick",({position:i})=>{Jl==="add"&&Zd(i)});ut.on("backgrounddblclick",({position:i})=>Zd(i));ut.on("connect",({source:i,target:t})=>Kd(i,t));ut.on("nodedragend",an);ut.on("layoutstart",()=>{Do.disabled=!1});ut.on("layoutend",()=>{Do.disabled=!0,xe()});ut.on("dimensionchange",({dimension:i})=>{i==="3d"&&ut.isFlat()&&Zt.nodes.length>1&&ut.runLayout("force").then(an),an()});Zt.events.on("change",()=>{Ps="",xe()});window.addEventListener("keydown",i=>{const t=i.target,e=i.ctrlKey||i.metaKey,n=i.key.toLowerCase();if(e&&!i.altKey&&n==="s"){i.preventDefault(),i.shiftKey?vo():Ql();return}if(e&&!i.altKey&&n==="o"){i.preventDefault(),cu();return}if(e&&!i.altKey&&n==="f"){i.preventDefault(),ut.focusSearch();return}t.matches("input, textarea, select")||(e&&n==="z"?(i.preventDefault(),_o(i.shiftKey?Je.redo():Je.undo())):e&&n==="y"?(i.preventDefault(),_o(Je.redo())):e&&n==="a"?(i.preventDefault(),ut.selectAll()):!e&&(n==="delete"||n==="backspace")?(i.preventDefault(),Lo()):!e&&n==="v"?ps("select"):!e&&n==="m"?ut.setGizmoMode("translate"):!e&&n==="r"?ut.setGizmoMode("rotate"):!e&&n==="s"?ut.setGizmoMode("scale"):!e&&n==="n"?ps("add"):!e&&n==="e"?ps("connect"):!e&&n==="f"?ut.fit():n==="escape"&&(ps("select"),ut.clearSelection()))});hu("social.json");ps("select");ui();
