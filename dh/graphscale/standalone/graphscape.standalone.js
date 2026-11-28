var Graphscape=function(lt){"use strict";var bv=Object.defineProperty;var Sv=(lt,Ze,xs)=>Ze in lt?bv(lt,Ze,{enumerable:!0,configurable:!0,writable:!0,value:xs}):lt[Ze]=xs;var H=(lt,Ze,xs)=>Sv(lt,typeof Ze!="symbol"?Ze+"":Ze,xs);const Ze=["circle","square","rectangle","diamond","hexagon","triangle","card"];class lo{constructor(){H(this,"map",new Map)}on(t,e){let n=this.map.get(t);return n||(n=new Set,this.map.set(t,n)),n.add(e),()=>this.off(t,e)}off(t,e){this.map.get(t)?.delete(e)}emit(t,e){const n=this.map.get(t);if(n)for(const s of[...n])s(e)}clear(){this.map.clear()}}const Ii=i=>JSON.parse(JSON.stringify(i));class js{constructor(t){H(this,"directed",!1);H(this,"meta",{});H(this,"events",new lo);H(this,"nodeMap",new Map);H(this,"edgeMap",new Map);H(this,"seq",0);H(this,"nodeList",null);H(this,"edgeList",null);t&&this.load(t,!1)}get nodes(){return this.nodeList??(this.nodeList=[...this.nodeMap.values()])}get edges(){return this.edgeList??(this.edgeList=[...this.edgeMap.values()])}hasNode(t){return this.nodeMap.has(t)}getNode(t){return this.nodeMap.get(t)}getEdge(t){return this.edgeMap.get(t)}load(t,e=!0){this.nodeMap.clear(),this.edgeMap.clear(),this.invalidate(),this.directed=!!t.directed,this.meta=Ii(t.meta??{});for(const n of t.nodes??[]){const s=Ii(n);s.id=String(s.id),this.nodeMap.set(s.id,s)}for(const n of t.edges??[]){const s=Ii(n);if(s.source=String(s.source),s.target=String(s.target),s.id=s.id?String(s.id):this.freeId("e",this.edgeMap),!this.nodeMap.has(s.source)||!this.nodeMap.has(s.target))throw new Error(`Edge "${s.id}" references an unknown node`);this.edgeMap.set(s.id,s)}e&&this.emit("structure")}clear(){this.load({directed:this.directed,nodes:[],edges:[]})}addNode(t={}){const e=t.id!==void 0?String(t.id):this.freeId("n",this.nodeMap);if(this.nodeMap.has(e))throw new Error(`Node "${e}" already exists`);const n={...Ii(t),id:e};return this.nodeMap.set(e,n),this.emit("structure"),n}updateNode(t,e){const n=this.nodeMap.get(t);if(!n)throw new Error(`Unknown node "${t}"`);return Al(n,e),this.emit("structure"),n}removeNode(t){if(!this.nodeMap.delete(t))return[];const e=[];for(const n of this.edgeMap.values())(n.source===t||n.target===t)&&e.push(n.id);for(const n of e)this.edgeMap.delete(n);return this.emit("structure"),e}addEdge(t){const e=String(t.source),n=String(t.target);if(!this.nodeMap.has(e)||!this.nodeMap.has(n))throw new Error("Edge endpoints must be existing nodes");const s=t.id!==void 0?String(t.id):this.freeId("e",this.edgeMap);if(this.edgeMap.has(s))throw new Error(`Edge "${s}" already exists`);const r={...Ii(t),id:s,source:e,target:n};return this.edgeMap.set(s,r),this.emit("structure"),r}updateEdge(t,e){const n=this.edgeMap.get(t);if(!n)throw new Error(`Unknown edge "${t}"`);if(e.source!==void 0&&!this.nodeMap.has(e.source))throw new Error("Unknown source node");if(e.target!==void 0&&!this.nodeMap.has(e.target))throw new Error("Unknown target node");return Al(n,e),this.emit("structure"),n}removeEdge(t){const e=this.edgeMap.delete(t);return e&&this.emit("structure"),e}setDirected(t){this.directed=t,this.emit("structure")}edgesOf(t){return this.edges.filter(e=>e.source===t||e.target===t)}degree(t){let e=0;for(const n of this.edges)n.source===t&&e++,n.target===t&&e++;return e}weightOf(t){return typeof t.weight=="number"&&Number.isFinite(t.weight)?t.weight:1}isDirected(t){return t.directed??this.directed}setPositions(t){for(const[e,n]of t){const s=this.nodeMap.get(e);s&&(s.x=n[0],s.y=n[1],s.z=n[2])}this.events.emit("change",{kind:"position"})}toData(){return Ii({directed:this.directed,meta:this.meta,nodes:this.nodes,edges:this.edges})}emit(t){this.invalidate(),this.events.emit("change",{kind:t})}invalidate(){this.nodeList=null,this.edgeList=null}freeId(t,e){let n;do n=t+ ++this.seq;while(e.has(n));return n}}function Al(i,t){const e=i;for(const[n,s]of Object.entries(t))s===void 0?delete e[n]:e[n]=s}const Wd=["label","sublabel","id","group","tags","props"],Xd={label:"label",name:"label",sublabel:"sublabel",sub:"sublabel",id:"id",group:"group",tag:"tags",tags:"tags",url:"url",prop:"props",props:"props"};function Cl(i){const t=[],e=/(?:([A-Za-z]+):)?(?:"([^"]*)"|(\S+))/g;let n;for(;(n=e.exec(i))!==null;){const s=n[1]?Xd[n[1].toLowerCase()]:void 0,r=(s?n[2]??n[3]??"":n[0].replace(/^"|"$/g,"")).trim().toLowerCase();r&&t.push({field:s,term:r})}return t}class co{constructor(t){H(this,"entries");this.entries=t.nodes.map(e=>({id:e.id,text:{label:(e.label??"").toLowerCase(),sublabel:(e.sublabel??"").toLowerCase(),id:e.id.toLowerCase(),group:(e.group??"").toLowerCase(),tags:(e.tags??[]).join(`
`).toLowerCase(),url:(e.url??"").toLowerCase(),props:Object.values(e.props??{}).join(`
`).toLowerCase()}}))}search(t,e={}){const n=e.minChars??2,s=e.fields??Wd,r=Cl(t),o=r.filter(l=>l.term.length>=n);if(o.length===0)return{query:t,ids:[],tooShort:r.length>0};const a=[];for(const l of this.entries){let c=!0;for(const h of o)if(!(h.field?l.text[h.field].includes(h.term):s.some(u=>l.text[u].includes(h.term)))){c=!1;break}c&&a.push(l.id)}return{query:t,ids:a,tooShort:!1}}}function $d(i,t,e){return new co(i).search(t,e)}const Yd=/^[a-z][a-z0-9+.-]*:/i;function ri(i,t){if(!i)return null;const e=i.replace(/[\u0000-\u001f\u007f\s]+/g,n=>n.includes(" ")?" ":"").trim();return e===""?null:e.startsWith("//")?t.allowAbsolute&&/^\/\/[^/]/.test(e)?e:null:Yd.test(e)?t.allowAbsolute&&/^(https?|mailto):/i.test(e)?e:null:e.startsWith("/")||e.startsWith("#")||e.startsWith("?")||!t.baseUrl?e:t.baseUrl.replace(/\/+$/,"")+"/"+e.replace(/^\.\//,"")}function ho(i,t=!1){switch(i){case"click":return"Click";case"dblclick":return"Double-click";case"ctrl-click":return t?"Cmd+click":"Ctrl+click";default:return""}}function Rl(i,t=!1){const e=i.interaction,n=i.dimension==="3d",s=[];if(s.push({keys:"Drag background",text:n?i.camera.rotation==="free"?"Rotate freely":"Rotate":"Pan"}),n&&s.push({keys:"Right-drag",text:"Pan"}),s.push({keys:"Mouse wheel, pinch",text:"Zoom"}),e.select&&s.push({keys:"Click",text:"Select a node or edge"}),e.select&&e.multiSelect&&s.push({keys:"Shift+click, Shift+drag",text:"Add to the selection, box select"}),e.dragNodes&&s.push({keys:"Drag a node",text:"Move it (the whole selection moves together)"}),e.dragNodes&&e.axisLock&&s.push({keys:n?"X, Y or Z while dragging":"X or Y while dragging",text:"Lock the movement to that axis"}),e.gizmo&&s.push({keys:"Select, then use the handles",text:"Move, rotate or scale the selection (Ctrl snaps)"}),e.openLinks!=="never"){const r=ho(e.openLinks,t);s.push({keys:`${r} on a badge item`,text:"Open the linked page"}),i.links.chip&&s.push({keys:`Select it, then "${i.links.chipLabel}"`,text:"Open the page without a modifier key"})}return i.ui.legend&&s.push({keys:"Group legend",text:"Click selects a group, Shift+click adds it, the eye hides or shows it"}),i.ui.search&&s.push({keys:"Search box",text:"Find and select nodes while typing; Enter zooms to them. group:Sales, tag:x, id:n1 search one field"}),i.ui.controls&&s.push({keys:"+  −  Fit  2D/3D",text:"Zoom in, zoom out, fit the graph, switch 2D / 3D"}),i.ui.fullscreen&&s.push({keys:"Full screen button",text:"Full screen; Esc leaves it"}),s}function ys(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function qd(i){const t=Math.max(1,Math.floor(i.nodes)),e=Math.max(1,Math.min(i.clusters??Math.ceil(Math.sqrt(t)/2),t)),n=ys(i.seed??1),s=[],r=Array.from({length:e},()=>[]);for(let h=0;h<t;h++){const d=h%e;r[d].push(h),s.push({id:`n${h+1}`,label:`N${h+1}`,group:`Group ${d+1}`})}const o=Math.floor(t*(i.avgDegree??4)/2),a=i.crossRatio??.08,l=new Set,c=[];for(let h=0;c.length<o&&h<o*20;h++){const d=Math.floor(n()*t);let u;if(n()<a)u=Math.floor(n()*t);else{const _=r[d%e];u=_[Math.floor(n()*_.length)]}if(d===u)continue;const f=d<u?`${d}-${u}`:`${u}-${d}`;if(l.has(f))continue;l.add(f);const g={id:`e${c.length+1}`,source:s[d].id,target:s[u].id};i.weighted&&(g.weight=1+Math.floor(n()*5)),c.push(g)}return{directed:!!i.directed,nodes:s,edges:c}}function jd(i){const t=Math.max(20,Math.floor(i.nodes)),e=ys(i.seed??1),n=[],s=[],r=new Set,o=v=>v[Math.floor(e()*v.length)],a=(v,y)=>{const x=`n${n.length+1}`;return n.push({id:x,label:`${v[0]}${n.length+1}`,group:v,props:y}),x},l=(v,y,x={},L=!1)=>{const S=v<y?`${v}|${y}`:`${y}|${v}`;if(!L&&(v===y||r.has(S)))return;r.add(S);const T={id:`e${s.length+1}`,source:v,target:y,...x};!("weight"in x)&&e()<.25&&(T.weight=1+Math.floor(e()*4)),s.push(T)},c=v=>Math.floor(t*v),h=c(.04),d=c(.3),u=c(.32),f=c(.14),g=[];for(;n.length<d;){const v=Math.min(3+Math.floor(e()*7),d-n.length);if(v<2)break;const y=Array.from({length:v},()=>a("Cliques",{clique:g.length+1}));for(let x=0;x<v;x++)for(let L=x+1;L<v;L++)l(y[x],y[L]);g.push(y)}const _=[],m=Math.min(5,u-n.length),p=Array.from({length:Math.max(m,2)},()=>a("Hubs"));for(let v=0;v<p.length;v++)for(let y=v+1;y<p.length;y++)l(p[v],p[y]),_.push(p[v],p[y]);for(g.length&&l(p[0],o(o(g)));n.length<d+u;){const v=a("Hubs"),y=1+Math.floor(e()*3);for(let x=0;x<y;x++){const L=o(_);l(v,L),_.push(v,L)}}for(;n.length<d+u+f;){const v=Math.min(3+Math.floor(e()*10),d+u+f-n.length),y=Array.from({length:v},()=>a("Chains"));l(y[0],o(n.slice(0,n.length-v)).id);for(let x=1;x<v;x++)l(y[x-1],y[x]);v>4&&e()<.3&&l(y[v-1],y[0])}for(;n.length<t-h;){const v=a("Leaves");l(v,e()<.5?o(_):o(n.slice(0,n.length-1)).id)}for(;n.length<t;)a("Isolated");for(let v=0;v<Math.ceil(t/80);v++)l(o(n.filter(y=>y.group!=="Isolated")).id,o(n.filter(y=>y.group!=="Isolated")).id);for(let v=0;v<4&&s.length;v++){const y=o(s);l(y.source,y.target,{weight:2+v,label:`parallel ${v+1}`},!0)}for(let v=0;v<3;v++){const y=o(n.filter(x=>x.group!=="Isolated")).id;l(y,y,{label:"self"},!0)}return{directed:!!i.directed,meta:{title:`Mixed network, ${t} nodes`},nodes:n,edges:s}}const Zs='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',Ui={theme:"light",dimension:"2d",background:{color:"#f7f8fa",gradientTo:null,transparent:!1},node:{color:"#4e79a7",shape:"circle",size:14,aspect:1.6,opacity:1,borderColor:"#2b3a4a",borderWidth:1,labelColor:"#1f2933"},edge:{color:"#8b95a1",width:1.5,dashed:!1,opacity:.9,arrows:!0,arrowSize:7,curveSpacing:16,loopSize:.9,dashSize:5,gapSize:3,widthByWeight:{enabled:!1,min:1,max:6}},label:{show:!0,font:Zs,size:6,color:"#1f2933",subSize:4.6,subColor:"#5f6b76",background:null,padding:1,maxCount:1500,maxChars:40,mode:"world",resolution:4,gap:1.5},weight:{show:"auto",font:Zs,size:5,color:"#3b4652",background:"rgba(255,255,255,0.85)",padding:1,maxCount:3e3,decimals:2},card:{background:"#ffffff",border:"#2b3a4a",headerBackground:null,headerColor:"#ffffff",textColor:"#1f2933",font:Zs,size:4.5,padding:2},selection:{color:"#e8590c",hoverColor:"#f59f00",width:2.5},gizmo:{size:.9,space:"world",snapTranslate:10,snapRotate:15,snapScale:.1},groups:{palette:["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f","#edc948","#b07aa1","#ff9da7","#9c755f","#bab0ac"],colors:{}},rules:[],camera:{fov:50,zoomMin:.02,zoomMax:60,fitPadding:1.25,autoFit:!0,damping:!1,rotation:"orbit"},layout:{name:"force",idealLength:60,spacing:40,gap:14,weightMode:"ignore",gravity:.05,direction:"TB",seed:1,autoRun:!0},search:{minChars:2,fields:["label","sublabel","id","group","tags","props"],fitOnEnter:!0},interaction:{dragNodes:!0,select:!0,multiSelect:!0,hover:!0,tooltip:!0,gizmo:!1,axisLock:!0,openLinks:"ctrl-click",pickLimit:2e4},links:{baseUrl:"",target:"self",allowAbsolute:!1,panelSandbox:"allow-same-origin allow-scripts allow-popups allow-forms",badge:!0,badgeColor:"#1c7ed6",badgeSize:5,hint:!0,chip:!0,chipLabel:"Open page"},ui:{controls:!0,search:!0,legend:!0,stats:!1,help:!0,fullscreen:!0,injectStyles:!0,cssVars:{font:Zs,"panel-bg":"rgba(255,255,255,0.96)","panel-fg":"#1f2933","panel-border":"#cfd6de",accent:"#e8590c",radius:"4px"}},render:{antialias:!0,pixelRatio:null}},uo={light:{},dark:{background:{color:"#14181d",gradientTo:null},node:{color:"#6aa6d9",borderColor:"#0b0e11",labelColor:"#e6ebf0"},edge:{color:"#7d8996"},label:{color:"#e6ebf0",subColor:"#a9b4bf"},weight:{color:"#d3dae1",background:"rgba(20,24,29,0.85)"},card:{background:"#1d242c",border:"#6b7886",textColor:"#e6ebf0"},selection:{color:"#ffa94d",hoverColor:"#ffd43b"},groups:{palette:["#6aa6d9","#ffa94d","#ff7b7b","#63d2c6","#8fd36b","#f2d45c","#c9a0dc","#ffb3c1","#c4a07a","#aab4bd"]},links:{badgeColor:"#4dabf7"},ui:{cssVars:{"panel-bg":"rgba(29,36,44,0.96)","panel-fg":"#e6ebf0","panel-border":"#3a4652",accent:"#ffa94d"}}},blueprint:{background:{color:"#0d3b66",gradientTo:"#0a2c4d"},node:{color:"#faf0ca",borderColor:"#f4d35e",labelColor:"#faf0ca"},edge:{color:"#a9c7e8"},label:{color:"#faf0ca",subColor:"#a9c7e8"},weight:{color:"#0d3b66",background:"rgba(250,240,202,0.92)"},card:{background:"#0a2c4d",border:"#f4d35e",headerBackground:"#f4d35e",headerColor:"#0d3b66",textColor:"#faf0ca"},selection:{color:"#ee964b",hoverColor:"#f95738"},groups:{palette:["#faf0ca","#f4d35e","#ee964b","#f95738","#a9c7e8","#7fb7be","#d3f3ee","#e3b5a4"]},links:{badgeColor:"#f4d35e"},ui:{cssVars:{"panel-bg":"rgba(10,44,77,0.96)","panel-fg":"#faf0ca","panel-border":"#2f5d8a",accent:"#f4d35e"}}}};function Zd(i,t){uo[i]=t}function Ks(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)&&Object.getPrototypeOf(i)===Object.prototype}function Ni(i,t){if(!Ks(i)||!Ks(t))return t===void 0?i:t;const e={...i};for(const[n,s]of Object.entries(t))s!==void 0&&(e[n]=Ks(s)&&Ks(e[n])?Ni(e[n],s):Array.isArray(s)?[...s]:s);return e}function Ms(i={}){const t=i.theme??Ui.theme,e=uo[t]??{};return Ni(Ni(Ui,e),i)}function Kd(i){return i}const Js={theme:'Base look. Built in: "light", "dark", "blueprint"; more can be added with registerTheme(). Everything below overrides the theme.',dimension:'"2d" (flat, orthographic) or "3d" (perspective). A graph file can store its own dimension in meta.dimension.',background:"Canvas background.","background.color":"CSS color of the background (top color when gradientTo is set).","background.gradientTo":"CSS color for a vertical gradient from color to this one, or null for a solid background.","background.transparent":"true: no background at all, the page behind the view shows through.",node:"Default look of nodes. A node can override color, shape and size itself; group colors and rules sit in between.","node.color":"Fill color when the node has neither its own color nor a group color.","node.shape":"circle, square, rectangle, diamond, hexagon, triangle or card (title plus lines, e.g. UML classes). 2D: flat polygons, 3D: solids.","node.size":"Diameter in world units.","node.aspect":'Width / height of the "rectangle" shape.',"node.opacity":"Opacity of all nodes, 0 to 1.","node.borderColor":"Outline color.","node.borderWidth":"Outline width in world units.","node.labelColor":"Text color of the node label.",edge:"Default look of edges. An edge can override color, width and dashed itself; rules sit in between.","edge.color":"Line color.","edge.width":"Line width in CSS pixels.","edge.dashed":"true: dashed lines.","edge.opacity":"Opacity of all edges, 0 to 1.","edge.arrows":"Draw arrow heads on directed edges.","edge.arrowSize":"Arrow head length in world units.","edge.curveSpacing":"Distance between parallel edges of the same node pair, in world units.","edge.loopSize":"Radius of self loops relative to the node size.","edge.dashSize":"Length of a dash in world units (dashed edges).","edge.gapSize":"Length of a gap in world units (dashed edges).","edge.widthByWeight":"Map the weights of the graph to line widths.","edge.widthByWeight.enabled":"true: width depends on the weight (lowest weight = min, highest = max).","edge.widthByWeight.min":"Line width in pixels for the lowest weight.","edge.widthByWeight.max":"Line width in pixels for the highest weight.",label:"Node labels. A label may contain line breaks, and a node can have a smaller sublabel below it.","label.show":"Show labels at all.","label.font":"CSS font family of labels and sublabels.","label.size":'Font size: world units in "world" mode, CSS pixels in "screen" mode.',"label.color":"Default label color (a node style can override it with labelColor).","label.subSize":"Font size of the sublabel.","label.subColor":"Color of the sublabel.","label.background":"CSS color of a box behind the label, or null for none.","label.padding":"Space between text and label box edge.","label.maxCount":"Labels are skipped above this node count (tooltips still work).","label.maxChars":"Longer lines are cut off with an ellipsis.","label.mode":'"world": labels scale with the zoom. "screen": constant pixel size.',"label.resolution":"Texture pixels per label unit. Higher is sharper and needs more memory.","label.gap":"Distance between node and label, in world units.",weight:"Text on edges: label and weight.","weight.show":'"auto": show weights other than 1. "always" or "never".',"weight.font":"CSS font family of edge texts.","weight.size":"Font size of edge texts.","weight.color":"Text color of edge texts.","weight.background":"CSS color of the box behind edge texts, or null.","weight.padding":"Space between text and box edge.","weight.maxCount":"Edge texts are skipped above this edge count.","weight.decimals":"Maximum number of decimals shown for weights.",card:'Look of nodes with the "card" shape (title in a header band, lines below; "---" is a separator).',"card.background":"Card body color.","card.border":"Border and separator color.","card.headerBackground":"Header band color, or null to use the node color.","card.headerColor":"Title text color.","card.textColor":"Body text color.","card.font":"CSS font family.","card.size":"Font size in world units.","card.padding":"Inner padding in world units.",selection:"Highlighting of selected and hovered items.","selection.color":"Outline color of selected nodes and color of selected edges.","selection.hoverColor":"Outline color of the hovered node and color of the hovered edge.","selection.width":"Outline width of selected nodes, in world units.",gizmo:"Transform gizmo of the selection (needs interaction.gizmo). Snapping is active while Ctrl or Cmd is held.","gizmo.size":"Size of the gizmo.","gizmo.space":'"world" or "local" axes.',"gizmo.snapTranslate":"Snap distance for moving, in world units.","gizmo.snapRotate":"Snap angle for rotating, in degrees.","gizmo.snapScale":"Snap step for scaling.",groups:"Colors by node group.","groups.palette":"Colors handed out to groups in order of first appearance, then repeated.","groups.colors":'Fixed colors per group name, for example { "Sales": "#e0b872" }.',rules:`Style rules, applied in order after the group color and before the values stored on the node or edge.
Example: { "target": "node", "match": { "group": "Design" }, "style": { "shape": "diamond" } }
match keys: id, group, tag, prop [key, value]. Node style keys: color, shape, size, borderColor, borderWidth, labelColor. Edge: color, width, dashed.`,camera:"Camera and view fitting.","camera.fov":"3D field of view in degrees.","camera.zoomMin":"Smallest 2D zoom.","camera.zoomMax":"Largest 2D zoom.","camera.fitPadding":"Margin factor when the graph is fitted into the view (1 = tight).","camera.autoFit":"Fit the graph into the view after loading and after a layout.","camera.damping":"Smooth camera motion (orbit mode).","camera.rotation":'3D only. "orbit": horizon stays level, tilt stops at the poles. "free": trackball, unlimited rotation around every axis.',layout:"Automatic placement of nodes.","layout.name":"force (general networks), tree (clean hierarchy), layered (DAG with cross links), circle, grid, sphere or random.","layout.idealLength":"Spring length of the force layout, in world units.","layout.spacing":"Minimum node distance when node sizes are unknown.","layout.gap":"Free space kept between node boxes (node plus label) by tree, layered, circle, grid and sphere.","layout.weightMode":'Edge weights in the force layout. "ignore": no effect. "closer": heavier edge = shorter (similarity, strength of a tie). "longer": heavier edge = longer (distance, cost, duration). Lengths are relative to the median weight and limited to 0.25x to 4x of layout.idealLength.',"layout.gravity":"Pull towards the center in the force layout, keeps separate parts together.","layout.direction":'"TB" (top to bottom) or "LR" (left to right) for tree and layered.',"layout.seed":"Seed of the random start positions, so layouts are reproducible.","layout.autoRun":"Run the layout when a loaded graph has nodes without coordinates.",search:'Search box (ui.search): finds nodes while typing and selects them. Terms are case-insensitive substrings, several terms must all match. field:term searches one field: group:Sales, tag:team, id:n12, label:"New York", url:pages/, prop:2019.',"search.minChars":"Terms shorter than this are ignored, so typing the first letter does not select half the graph.","search.fields":"Fields searched by plain terms: label, sublabel, id, group, tags, url, props.","search.fitOnEnter":"Enter in the search box zooms to the matches.",interaction:"What visitors can do.","interaction.dragNodes":"Nodes can be dragged.","interaction.select":"Nodes and edges can be selected.","interaction.multiSelect":"Shift-click and Shift-drag select several.","interaction.hover":"Highlight the item under the pointer.","interaction.tooltip":"Show a tooltip with details for the hovered item.","interaction.gizmo":"Show the transform gizmo (move, rotate, scale) for the selected nodes.","interaction.axisLock":"Holding X, Y or Z while dragging a node locks the movement to that axis.","interaction.openLinks":'Gesture that opens the url of a node or edge: "ctrl-click" (default, keeps plain clicks for selecting), "click", "dblclick" or "never" (no links at all).',"interaction.pickLimit":"Edges are not hit-tested above this edge count (speed).",links:"Website content behind node and edge urls.","links.baseUrl":'Prefix for relative urls, for example "content/".',"links.target":'"self" (navigate), "blank" (new tab), "panel" (sandboxed iframe inside the view) or "event" (your code decides, listen to the link event).',"links.allowAbsolute":"Allow absolute http(s) and mailto links. Relative paths are always allowed; javascript: and data: never.","links.panelSandbox":'sandbox attribute of the iframe used by target "panel".',"links.badge":"Draw a small link badge on every node and edge that has a url, so visitors see what is clickable.","links.badgeColor":"Color of the link badge.","links.badgeSize":"Size of the link badge in world units.","links.hint":'Tooltips of linked items say how to open the page (for example "Ctrl+click to open the page").',"links.chip":'Show an "Open page" chip next to a single selected node or edge that has a url. Works with touch and needs no modifier key.',"links.chipLabel":"Text of that chip (translate it here).",ui:"Buttons, tooltip and panel around the canvas.","ui.controls":"Zoom, fit and 2D/3D buttons.","ui.search":"Search box in the corner: finds and selects nodes and whole groups while you type (see search).","ui.legend":"Legend of the node groups in the bottom left corner (shown with two or more groups). Click a group to select it, Shift+click to add it, the eye hides or shows it.","ui.stats":"Performance overlay in the top right corner: frames per second while rendering, CPU time per frame, draw calls, triangles, layout and rebuild times, and a benchmark button. For measuring changes.","ui.help":"Help button (question mark) that lists the controls of this view, including the link gesture and full screen.","ui.fullscreen":"Full screen / back button (the usual corner icon). Set false to remove it.","ui.injectStyles":'Inject the default CSS once. Set false to ship your own (the class names start with "gs-").',"ui.cssVars":"CSS custom properties set on the view as --gs-<name>; they style tooltip, buttons and panel.","ui.cssVars.font":"Font family of the DOM parts.","ui.cssVars.panel-bg":"Background of tooltip, buttons and panel.","ui.cssVars.panel-fg":"Text color of tooltip, buttons and panel.","ui.cssVars.panel-border":"Border color of tooltip, buttons and panel.","ui.cssVars.accent":"Highlight color (button hover, selection box).","ui.cssVars.radius":"Corner radius of buttons and tooltip.",render:"Renderer settings.","render.antialias":"Smooth edges (needs a reload of the view to change).","render.pixelRatio":"Device pixel ratio to render at, or null for the screen default (maximum 2)."},An=i=>typeof i=="object"&&i!==null&&!Array.isArray(i),Pl=new Set(["groups.colors","ui.cssVars"]);function Jd(i,t){const e=[];for(const n of i.split(`
`)){let s="";for(const r of n.split(" "))s&&s.length+1+r.length>t?(e.push(s),s=r):s=s?`${s} ${r}`:r;e.push(s)}return e}const Qd=`// Graphscape configuration: JSON with comments.
// Comments (// and /* */) and trailing commas are allowed here and are ignored when applying.
// Values that equal the default are fine to keep, they are dropped when the configuration is saved.
`;function tu(i,t=!0){const e=(s,r)=>{const o=Js[s];return o?Jd(o,Math.max(40,100-r.length)).map(a=>`${r}// ${a}`.trimEnd()).join(`
`)+`
`:""},n=(s,r,o)=>{if(An(s)){const a=Object.keys(s);if(a.length===0)return"{}";const l=o+"  ";return`{
${a.map(h=>{const d=r?`${r}.${h}`:h;return`${e(d,l)}${l}${JSON.stringify(h)}: ${n(s[h],d,l)}`}).join(`,
`)}
${o}}`}if(Array.isArray(s)){if(s.length===0)return"[]";if(s.every(l=>typeof l!="object"||l===null))return`[${s.map(l=>JSON.stringify(l)).join(", ")}]`;const a=o+"  ";return`[
${s.map(l=>a+JSON.stringify(l)).join(`,
`)}
${o}]`}return JSON.stringify(s)??"null"};return(t?Qd:"")+n(i,"","")+`
`}function Ll(i){let t="",e=0;const n=i.length;let s=!1;for(;e<n;){const r=i[e];if(s){if(t+=r,r==="\\"){t+=i[e+1]??"",e+=2;continue}r==='"'&&(s=!1),e++}else if(r==='"')s=!0,t+=r,e++;else if(r==="/"&&i[e+1]==="/")for(;e<n&&i[e]!==`
`;)e++;else if(r==="/"&&i[e+1]==="*"){const o=i.indexOf("*/",e+2);e=o<0?n:o+2}else(r==="}"||r==="]")&&(t=t.replace(/,\s*$/,"")),t+=r,e++}return t}function Dl(i){return JSON.parse(Ll(i.replace(/^\uFEFF/,"")))}function Il(i,t){const e={};if(!An(t))return e;for(const[n,s]of Object.entries(t)){const r=An(i)?i[n]:void 0;if(An(s)&&An(r)){const o=Il(r,s);Object.keys(o).length&&(e[n]=o)}else JSON.stringify(s)!==JSON.stringify(r)&&(e[n]=s)}return e}function Ul(i,t=Ui,e=""){const n=[];if(!An(i)||!An(t))return n;for(const[s,r]of Object.entries(i)){const o=e?`${e}.${s}`:s;s in t?An(r)&&!Pl.has(o)&&n.push(...Ul(r,t[s],o)):n.push(o)}return n}function eu(){const i=[],t=(e,n)=>{if(An(e))for(const[s,r]of Object.entries(e)){const o=n?`${n}.${s}`:s;o in Js||i.push(o),Pl.has(o)||t(r,o)}};t(Ui,"");for(const e of Object.keys(Ui.ui.cssVars))`ui.cssVars.${e}`in Js||i.push(`ui.cssVars.${e}`);return i}function Nl(i,t){const e=i.match;return typeof e=="function"?e(t):!(e.id!==void 0&&t.id!==e.id||e.group!==void 0&&t.group!==e.group||e.tag!==void 0&&!t.tags?.includes(e.tag)||e.prop&&t.props?.[e.prop[0]]!==e.prop[1])}function Qs(i){const t=new Map;for(const e of i.nodes)e.group!==void 0&&!t.has(e.group)&&t.set(e.group,t.size);return t}function tr(i,t,e){const{aspect:n,opacity:s,...r}=t.node,o={...r};if(i.group!==void 0){const a=t.groups.palette,l=t.groups.colors[i.group]??(a.length?a[(e.get(i.group)??0)%a.length]:void 0);l&&(o.color=l)}for(const a of t.rules)a.target==="node"&&Nl(a,i)&&Object.assign(o,a.style);return i.color&&(o.color=i.color),i.shape&&(o.shape=i.shape),i.size&&i.size>0&&(o.size=i.size),o}function Ol(i,t,e,n){const{color:s,width:r,dashed:o}=e.edge,a={color:s,width:r,dashed:o},l=e.edge.widthByWeight;if(l.enabled){const c=n.max>n.min?(t-n.min)/(n.max-n.min):0;a.width=l.min+(l.max-l.min)*Math.max(0,Math.min(1,c))}for(const c of e.rules)c.target==="edge"&&Nl(c,i)&&Object.assign(a,c.style);return i.color&&(a.color=i.color),i.width&&i.width>0&&(a.width=i.width),i.dashed!==void 0&&(a.dashed=i.dashed),a.width=Math.round(a.width*2)/2,a}function fo(i){const t={};for(const[e,n]of Object.entries(i))n!==void 0&&(t[e]=n);return t}class bs{constructor(){H(this,"directed",!1);H(this,"meta",{});H(this,"warnings",[]);H(this,"nodes",new Map);H(this,"edges",[]);H(this,"edgeIds",new Set)}hasNode(t){return this.nodes.has(t)}node(t){return this.nodes.get(t)}addNode(t,e={}){const n=this.nodes.get(t);if(n)return Object.assign(n,fo(e),{id:t}),n;const s={...fo(e),id:t};return this.nodes.set(t,s),s}ensureNode(t){return this.nodes.get(t)??this.addNode(t)}addEdge(t,e,n={}){this.ensureNode(t),this.ensureNode(e);let s=n.id;if(!s||this.edgeIds.has(s)){let o=this.edges.length+1;for(;this.edgeIds.has(`e${o}`);)o++;s=`e${o}`}this.edgeIds.add(s);const r={...fo(n),id:s,source:t,target:e};return this.edges.push(r),r}build(){return{directed:this.directed,meta:this.meta,nodes:[...this.nodes.values()],edges:this.edges}}}function ve(i){if(typeof i=="number")return Number.isFinite(i)?i:void 0;if(typeof i=="string"&&i.trim()!==""){const t=Number(i);return Number.isFinite(t)?t:void 0}}function oi(i){if(typeof i=="boolean")return i;if(typeof i=="number")return i!==0;if(typeof i=="string"){const t=i.trim().toLowerCase();if(["true","1","yes"].includes(t))return!0;if(["false","0","no"].includes(t))return!1}}function Ss(i){if(!i)return;const t=/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(i.trim());if(!t)return;let e=t[1];return e.length===3&&(e=[...e].map(n=>n+n).join("")),"#"+e.slice(0,6).toUpperCase()}function nu(i,t){const e=[];let n=[],s="",r=!1;for(let o=0;o<i.length;o++){const a=i[o];r?a==='"'?i[o+1]==='"'?(s+='"',o++):r=!1:s+=a:a==='"'&&s===""?r=!0:a===t?(n.push(s),s=""):a===`
`||a==="\r"?(a==="\r"&&i[o+1]===`
`&&o++,n.push(s),s="",n.some(l=>l.trim()!=="")&&e.push(n),n=[]):s+=a}return n.push(s),n.some(o=>o.trim()!=="")&&e.push(n),e}const iu={source:"source",from:"source",src:"source",target:"target",to:"target",dst:"target",dest:"target",weight:"weight",value:"weight",w:"weight",label:"label",url:"url",directed:"directed",group:"group"};function Fl(i,t=!1){const e=i.split(/\r?\n/,1)[0]??"",n=[",",";","	"].map(h=>({d:h,n:e.split(h).length})).sort((h,d)=>d.n-h.n)[0].d,s=nu(i,n),r=new bs;if(r.directed=t,s.length===0)return{graph:r.build(),warnings:["Empty file"],format:"csv"};const o=s[0].map(h=>iu[h.trim().toLowerCase()]),a=o.includes("source")&&o.includes("target"),l=a?o:["source","target","weight","label"];for(const h of a?s.slice(1):s){const d={};if(l.forEach((g,_)=>{g&&h[_]!==void 0&&(d[g]=h[_].trim())}),!d.source)continue;if(!d.target){r.addNode(d.source,{label:d.label||void 0,url:d.url||void 0,group:d.group||void 0});continue}let u=ve(d.weight),f=d.label||void 0;!a&&u===void 0&&d.weight&&(f=d.weight,u=void 0),r.addEdge(d.source,d.target,{weight:u,label:f,url:d.url||void 0,directed:oi(d.directed)})}const c=r.build();for(const h of c.edges)h.directed===c.directed&&delete h.directed;return{graph:c,warnings:r.warnings,format:"csv"}}const zl=i=>{const t=i===void 0?"":String(i);return/[",\n\r;]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};function kl(i){const t=["source,target,weight,label,url,directed"],e=new Set;for(const n of i.edges)e.add(n.source),e.add(n.target),t.push([n.source,n.target,n.weight??1,n.label,n.url,n.directed??i.directed].map(zl).join(","));for(const n of i.nodes)e.has(n.id)||t.push([n.id,"","",n.label,n.url,""].map(zl).join(","));return t.join(`
`)+`
`}function su(i){const t=[],e=/-?(?:\d+\.?\d*|\.\d+)/y,n=/[A-Za-z_\u0080-\uffff][A-Za-z_0-9\u0080-\uffff]*/y,s=i.length;let r=0;for(;r<s;){const o=i[r];if(/\s/.test(o))r++;else if(o==="/"&&i[r+1]==="/"){const a=i.indexOf(`
`,r);r=a<0?s:a+1}else if(o==="/"&&i[r+1]==="*"){const a=i.indexOf("*/",r+2);r=a<0?s:a+2}else if(o==="#"&&(r===0||i[r-1]===`
`)){const a=i.indexOf(`
`,r);r=a<0?s:a+1}else if(o==='"'){let a=r+1,l="";for(;a<s&&i[a]!=='"';)i[a]==="\\"&&i[a+1]==='"'?(l+='"',a+=2):i[a]==="\\"&&i[a+1]===`
`?a+=2:l+=i[a++];t.push({t:"str",v:l}),r=a+1}else if(o==="<"){let a=0,l=r;for(;l<s;l++)if(i[l]==="<")a++;else if(i[l]===">"&&--a===0)break;const c=i.slice(r+1,l).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]*>/g,"");t.push({t:"str",v:c.trim()}),r=l+1}else if(o==="-"&&(i[r+1]===">"||i[r+1]==="-"))t.push({t:"sym",v:i.slice(r,r+2)}),r+=2;else{e.lastIndex=r,n.lastIndex=r;const a=e.exec(i),l=n.exec(i);a?(t.push({t:"id",v:a[0]}),r+=a[0].length):l?(t.push({t:"id",v:l[0]}),r+=l[0].length):(t.push({t:"sym",v:o}),r++)}}return t}const ru={box:"rectangle",rect:"rectangle",rectangle:"rectangle",plaintext:"rectangle",plain:"rectangle",none:"rectangle",square:"square",ellipse:"circle",oval:"circle",circle:"circle",doublecircle:"circle",point:"circle",diamond:"diamond",hexagon:"hexagon",octagon:"hexagon",triangle:"triangle",record:"card",mrecord:"card"},ai=i=>i.replace(/\\n|\\l|\\r/g,`
`);function Bl(i){const t=i.replace(/^\/[a-z0-9]+\//i,"");return t.startsWith("#")?t.slice(0,7):t.split(":")[0]}class ou{constructor(t){H(this,"p",0);H(this,"b",new bs);H(this,"warnedBoth",!1);this.toks=t}peek(t=0){return this.toks[this.p+t]}next(){const t=this.toks[this.p++];if(!t)throw new Error("Unexpected end of DOT input");return t}isSym(t,e=0){const n=this.peek(e);return!!n&&n.t==="sym"&&n.v===t}parse(){this.peek()?.t==="id"&&this.peek().v.toLowerCase()==="strict"&&this.next();const t=this.next().v.toLowerCase();if(t!=="graph"&&t!=="digraph")throw new Error('Expected "graph" or "digraph"');if(this.b.directed=t==="digraph",!this.isSym("{")){const n=this.next().v;n&&(this.b.meta.title=n)}if(!this.isSym("{"))throw new Error('Expected "{"');this.next();const e={nodeDef:{},edgeDef:{}};this.stmtList(e),e.label&&!this.b.meta.title&&(this.b.meta.title=ai(e.label))}attrList(){const t={};for(;this.isSym("[");){for(this.next();!this.isSym("]");){const e=this.next();if(e.t==="sym")continue;let n="true";this.isSym("=")&&(this.next(),n=this.next().v),t[e.v]=n}this.next()}return t}stmtList(t){const e=new Set;for(;this.peek();){const n=this.peek();if(n.t==="sym"&&(n.v===";"||n.v===",")){this.next();continue}if(n.t==="sym"&&n.v==="}")return this.next(),e;const s=n.v.toLowerCase();if(n.t==="id"&&(s==="node"||s==="edge"||s==="graph")&&this.isSym("[",1)){this.next();const l=this.attrList();s==="node"?Object.assign(t.nodeDef,l):s==="edge"?Object.assign(t.edgeDef,l):l.label&&(t.label=l.label);continue}if((n.t==="id"||n.t==="str")&&this.isSym("=",1)){this.next(),this.next();const l=this.next().v;n.v==="label"&&(t.label=l);continue}const r=[this.operand(t,e)];let o=!1;for(;this.isSym("->")||this.isSym("--");)this.next(),o=!0,r.push(this.operand(t,e));const a=this.attrList();if(o)for(let l=0;l+1<r.length;l++)for(const c of r[l])for(const h of r[l+1])this.addEdge(c,h,{...t.edgeDef,...a});else for(const l of r[0])this.applyNode(l,a)}throw new Error('Unterminated DOT block (missing "}")')}operand(t,e){const n=this.peek();if(!n)throw new Error("Unexpected end of DOT input");if(n.t==="id"&&n.v.toLowerCase()==="subgraph"||n.t==="sym"&&n.v==="{"){let r="";if(n.t==="id"&&(this.next(),this.isSym("{")||(r=this.next().v)),!this.isSym("{"))return[];this.next();const o={nodeDef:{...t.nodeDef},edgeDef:{...t.edgeDef}},a=this.stmtList(o);if(/^cluster/i.test(r)){const l=o.label?ai(o.label):r.replace(/^cluster_?/i,"")||r;for(const c of a){const h=this.b.node(c);h&&h.group===void 0&&(h.group=l)}}return a.forEach(l=>e.add(l)),[...a]}const s=this.next().v;for(;this.isSym(":");)this.next(),this.peek()&&this.peek().t!=="sym"&&this.next();return this.b.hasNode(s)||(this.b.addNode(s),this.applyNode(s,t.nodeDef)),e.add(s),[s]}applyNode(t,e){const n=this.b.ensureNode(t),s={};e.label!==void 0&&e.label!=="\\N"&&(s.label=ai(e.label));const r=e.fillcolor??(e.style?.includes("filled")?e.color:void 0)??e.color;r&&(s.color=Bl(r));const o=e.shape?ru[e.shape.toLowerCase()]:void 0;o&&(s.shape=o);const a=e.URL??e.href??e.url;a&&(s.url=a),e.group&&(s.group=e.group);const l=e.sublabel??e.xlabel;if(l&&(s.sublabel=ai(l)),Object.assign(n,s),n.shape==="card"&&e.label!==void 0){const c=e.label.replace(/[{}]/g,"").split("|");n.label=ai(c[0]).trim()||t;const h=[];c.slice(1).forEach((d,u)=>{u>0&&h.push("---"),h.push(...ai(d).split(`
`).map(f=>f.trim()).filter(Boolean))}),n.body=h}}addEdge(t,e,n){this.b.hasNode(t)||this.b.addNode(t),this.b.hasNode(e)||this.b.addNode(e);const s=n.dir?.toLowerCase();let r=this.b.directed,o=t,a=e;s==="none"?r=!1:s==="forward"?r=!0:s==="back"?(r=!0,o=e,a=t):s==="both"&&(r=!1,this.warnedBoth||(this.b.warnings.push("Edges with dir=both were imported as undirected"),this.warnedBoth=!0));const l={weight:ve(n.weight),label:n.label?ai(n.label):void 0,url:n.URL??n.href??n.url,color:n.color?Bl(n.color):void 0,dashed:n.style&&/dashed|dotted/.test(n.style)?!0:void 0,width:ve(n.penwidth)},c=this.b.addEdge(o,a,l);r!==this.b.directed&&(c.directed=r)}}function Hl(i){const t=new ou(su(i));return t.parse(),{graph:t.b.build(),warnings:t.b.warnings,format:"dot"}}const au={circle:"ellipse",square:"square",rectangle:"box",diamond:"diamond",hexagon:"hexagon",triangle:"triangle",card:"record"},We=i=>`"${i.replace(/"/g,'\\"').replace(/\r?\n/g,"\\n")}"`;function Gl(i){const t=[`${i.directed?"digraph":"graph"} ${We(i.meta?.title??"G")} {`];for(const n of i.nodes){const s=[];if(n.shape==="card"){const r=n.body?.indexOf("---")??-1,o=r<0?n.body??[]:(n.body??[]).slice(0,r),a=r<0?[]:(n.body??[]).slice(r+1),l=c=>c.join("\\l")+(c.length?"\\l":"");s.push(`label=${We(`{${n.label??n.id}|${l(o)}|${l(a)}}`).replace(/\\\\l/g,"\\l")}`,"shape=record")}else n.label!==void 0&&s.push(`label=${We(n.label)}`),n.shape&&s.push(`shape=${au[n.shape]}`);n.sublabel&&s.push(`sublabel=${We(n.sublabel)}`),n.color&&s.push(`fillcolor=${We(n.color)}`,"style=filled"),n.url&&s.push(`URL=${We(n.url)}`),n.group&&s.push(`group=${We(n.group)}`),t.push(`  ${We(n.id)}${s.length?` [${s.join(", ")}]`:""};`)}const e=i.directed?"->":"--";for(const n of i.edges){const s=[];n.weight!==void 0&&s.push(`weight=${n.weight}`),n.label&&s.push(`label=${We(n.label)}`),n.url&&s.push(`URL=${We(n.url)}`),n.color&&s.push(`color=${We(n.color)}`),n.dashed&&s.push("style=dashed"),n.width&&s.push(`penwidth=${n.width}`),n.directed!==void 0&&n.directed!==i.directed&&s.push(`dir=${n.directed?"forward":"none"}`),t.push(`  ${We(n.source)} ${e} ${We(n.target)}${s.length?` [${s.join(", ")}]`:""};`)}return t.push("}"),t.join(`
`)+`
`}const lu=i=>i.replace(/&quot;/g,'"').replace(/&amp;/g,"&"),cu=i=>i.replace(/&/g,"&amp;").replace(/"/g,"&quot;");function hu(i){const t=i.replace(/^\s*#.*$/gm,""),e=/\s*(\[|\]|"[^"]*"|[^\s[\]"]+)/y,n=[];let s;for(e.lastIndex=0;(s=e.exec(t))!==null;)n.push(s[1]);return n}function Vl(i,t,e){const n=[];for(;t.i<i.length;){const s=i[t.i++];if(s==="]"){if(e)throw new Error('Unexpected "]" in GML');return n}const r=i[t.i++];if(r===void 0)throw new Error("Unexpected end of GML");r==="["?n.push([s,Vl(i,t,!1)]):r.startsWith('"')?n.push([s,lu(r.slice(1,-1))]):n.push([s,ve(r)??r])}if(!e)throw new Error("Unterminated list in GML");return n}const po=(i,t)=>i.find(([e])=>e===t)?.[1],we=(i,t)=>{const e=po(i,t);return typeof e=="string"||typeof e=="number"?String(e):void 0},Wn=(i,t)=>{const e=po(i,t);return typeof e=="number"?e:typeof e=="string"?ve(e):void 0},Wl=(i,t)=>{const e=po(i,t);return Array.isArray(e)?e:void 0};function Xl(i){const t=Vl(hu(i),{i:0},!0),e=Wl(t,"graph");if(!e)throw new Error("GML document contains no graph [ ... ]");const n=new bs;n.directed=Wn(e,"directed")===1;const s=we(e,"label");s&&(n.meta.title=s);for(const[a,l]of e){if(a!=="node"||!Array.isArray(l))continue;const c=we(l,"gsId"),h=c??we(l,"id");if(h===void 0){n.warnings.push("Skipped a node without id");continue}const d=Wl(l,"graphics"),u=we(l,"shape"),f=we(l,"body");n.addNode(h,{label:we(l,"label"),sublabel:we(l,"sublabel"),x:d?Wn(d,"x"):void 0,y:d?Wn(d,"y"):void 0,z:d?Wn(d,"z"):void 0,group:we(l,"group"),url:we(l,"url"),color:we(l,"color")??(d?we(d,"fill"):void 0),size:Wn(l,"size"),shape:u&&Ze.includes(u)?u:void 0,body:f?f.split(`
`):void 0}),c!==void 0&&(n.node(h)._gml=we(l,"id"))}const r=new Map;for(const a of n.build().nodes){const l=a._gml;l!==void 0&&r.set(l,a.id),delete a._gml}const o=a=>a===void 0?void 0:r.get(a)??a;for(const[a,l]of e){if(a!=="edge"||!Array.isArray(l))continue;const c=o(we(l,"source")),h=o(we(l,"target"));if(c===void 0||h===void 0){n.warnings.push("Skipped an edge without source/target");continue}const d={weight:Wn(l,"weight")??Wn(l,"value"),label:we(l,"label"),url:we(l,"url"),color:we(l,"color")},u=Wn(l,"directed");u!==void 0&&u===1!==n.directed&&(d.directed=u===1),n.addEdge(c,h,d)}return{graph:n.build(),warnings:n.warnings,format:"gml"}}function $l(i){const t=s=>`"${cu(s)}"`,e=new Map;i.nodes.forEach((s,r)=>e.set(s.id,r));const n=["graph [",`  directed ${i.directed?1:0}`];i.meta?.title&&n.push(`  label ${t(i.meta.title)}`);for(const s of i.nodes)n.push("  node [",`    id ${e.get(s.id)}`,`    gsId ${t(s.id)}`),s.label!==void 0&&n.push(`    label ${t(s.label)}`),s.sublabel&&n.push(`    sublabel ${t(s.sublabel)}`),(s.x!==void 0||s.y!==void 0)&&n.push(`    graphics [ x ${s.x??0} y ${s.y??0}${s.z!==void 0?` z ${s.z}`:""} ]`),s.group&&n.push(`    group ${t(s.group)}`),s.url&&n.push(`    url ${t(s.url)}`),s.color&&n.push(`    color ${t(s.color)}`),s.shape&&n.push(`    shape ${t(s.shape)}`),s.size!==void 0&&n.push(`    size ${s.size}`),s.body?.length&&n.push(`    body ${t(s.body.join(`
`))}`),n.push("  ]");for(const s of i.edges)n.push("  edge [",`    source ${e.get(s.source)}`,`    target ${e.get(s.target)}`),s.weight!==void 0&&n.push(`    weight ${s.weight}`),s.label&&n.push(`    label ${t(s.label)}`),s.url&&n.push(`    url ${t(s.url)}`),s.color&&n.push(`    color ${t(s.color)}`),s.directed!==void 0&&s.directed!==i.directed&&n.push(`    directed ${s.directed?1:0}`),n.push("  ]");return n.push("]"),n.join(`
`)+`
`}const du={lt:"<",gt:">",amp:"&",quot:'"',apos:"'"};function mo(i){return i.includes("&")?i.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(t,e)=>{if(e[0]==="#"){const n=e[1].toLowerCase()==="x"?parseInt(e.slice(2),16):parseInt(e.slice(1),10);return Number.isFinite(n)&&n>0&&n<=1114111?String.fromCodePoint(n):t}return du[e.toLowerCase()]??t}):i}function Te(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function uu(i){const t={name:"#root",attrs:{},children:[],text:""},e=[t],n=/<(\/?)([^\s/>!?]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/y,s=/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,r=i.length;let o=i.charCodeAt(0)===65279?1:0;for(;o<r;){const a=e[e.length-1],l=i.indexOf("<",o);if(l===-1){a.text+=mo(i.slice(o));break}if(l>o&&(a.text+=mo(i.slice(o,l))),o=l,i.startsWith("<!--",o)){const c=i.indexOf("-->",o+4);if(c<0)throw new Error("Unterminated XML comment");o=c+3}else if(i.startsWith("<![CDATA[",o)){const c=i.indexOf("]]>",o);if(c<0)throw new Error("Unterminated CDATA section");a.text+=i.slice(o+9,c),o=c+3}else if(i.startsWith("<?",o)){const c=i.indexOf("?>",o);if(c<0)throw new Error("Unterminated processing instruction");o=c+2}else if(i.startsWith("<!",o)){let c=0,h=o+2;for(;h<r;h++){const d=i[h];if(d==="[")c++;else if(d==="]")c--;else if(d===">"&&c<=0)break}o=h+1}else{n.lastIndex=o;const c=n.exec(i);if(!c)throw new Error(`Malformed XML near offset ${o}`);if(o=n.lastIndex,c[1]){if(e.length<2||e[e.length-1].name!==c[2])throw new Error(`Unexpected closing tag </${c[2]}>`);e.pop()}else{const h={};s.lastIndex=0;let d;for(;(d=s.exec(c[3]))!==null;)h[d[1]]=mo(d[2]??d[3]??"");const u={name:c[2],attrs:h,children:[],text:""};a.children.push(u),c[4]||e.push(u)}}}if(e.length!==1)throw new Error(`Unclosed XML element <${e[e.length-1].name}>`);if(t.children.length===0)throw new Error("Empty XML document");return t.children[0]}const li=i=>i.name.slice(i.name.indexOf(":")+1);function Es(i,t){return i.children.filter(e=>li(e)===t)}function Ke(i,t){for(const e of i.children){if(t(e))return e;const n=Ke(e,t);if(n)return n}}const fu=new Set(["ShapeNode","GenericNode","ImageNode","SVGNode","UMLClassNode","GroupNode","GenericGroupNode","TableNode"]),pu=new Set(["PolyLineEdge","ArcEdge","QuadCurveEdge","SplineEdge","BezierEdge","GenericEdge","ImageEdge"]),Yl=new Set(["GroupNode","GenericGroupNode"]),mu={rectangle:"rectangle",rectangle3d:"rectangle",roundrectangle:"rectangle",parallelogram:"rectangle",ellipse:"circle",diamond:"diamond",hexagon:"hexagon",octagon:"hexagon",triangle:"triangle",trapezoid:"triangle",trapezoid2:"triangle",fatarrow:"triangle",fatarrow2:"triangle"},ci=i=>i?(i.text+i.children.map(t=>ci(t)).join("")).trim():"",Cn=i=>t=>li(t)===i;function gu(i,t){return t==="boolean"?i.trim().toLowerCase()==="true":["int","long","float","double"].includes(t)?ve(i)??i:i}function go(i){return Math.round(i*100)/100}function ql(i,t={}){const e=uu(i);if(li(e)!=="graphml")throw new Error("Not a GraphML document (missing <graphml> root)");const n=t.scale??.5,s=new Map;for(const f of Es(e,"key"))s.set(f.attrs.id,{id:f.attrs.id,name:f.attrs["attr.name"]??"",type:f.attrs["attr.type"]??"string",target:f.attrs.for??"all",yType:f.attrs["yfiles.type"]});const r=Es(e,"graph")[0];if(!r)throw new Error("GraphML document contains no <graph>");const o=new bs;o.directed=r.attrs.edgedefault==="directed";const a=[],l=(f,g)=>{for(const _ of f.children){const m=li(_);if(m==="node"){const p=o.addNode(_.attrs.id,{group:g});h(_,p);const v=Es(_,"graph")[0];if(v){const y=p.label?.split(`
`)[0]||p.id;p.tags?.includes("group")||(p.tags=[...p.tags??[],"group"]),l(v,y)}}else m==="edge"?a.push(_):m==="hyperedge"&&o.warnings.push("Hyperedges are not supported and were skipped")}},c=(f,g,_,m)=>{const p=g.name.toLowerCase(),v=_.trim(),y=f;switch(p){case"label":y.label===void 0&&v&&(y.label=v);return;case"url":case"href":case"link":v&&(y.url=v);return;case"color":v&&(y.color=v);return;case"group":v&&(y.group=v);return;case"sublabel":m&&v&&(y.sublabel=v);return;case"weight":case"value":m||(y.weight=ve(v));return;case"x":case"y":case"z":case"size":{const x=ve(v);m&&x!==void 0&&(y[p]=x);return}case"shape":m&&Ze.includes(v)&&(y.shape=v);return;case"directed":m||(y.directed=oi(v));return;default:g.name&&v!==""&&((f.props??(f.props={}))[g.name]=gu(v,g.type))}},h=(f,g)=>{for(const _ of Es(f,"data")){const m=s.get(_.attrs.key);m&&(m.yType==="nodegraphics"?d(_,g):c(g,m,ci(_),!0))}},d=(f,g)=>{const _=Ke(f,S=>fu.has(li(S)));if(!_)return;const m=li(_),p=Ke(_,Cn("Geometry"));let v="rectangle";if(p){const S=ve(p.attrs.width)??30,T=ve(p.attrs.height)??30,C=ve(p.attrs.x)??0,E=ve(p.attrs.y)??0;g.x=go((C+S/2)*n),g.y=go(-(E+T/2)*n),Yl.has(m)||(g.size=go(Math.max(Math.min(S,T),1)*n))}const y=Ke(_,Cn("Fill"));if(y&&y.attrs.transparent!=="true"){const S=Ss(y.attrs.color);S&&(g.color=S)}const x=Ke(_,Cn("Shape"));x?.attrs.type&&(v=mu[x.attrs.type.toLowerCase()]??v),g.shape=v;const L=ci(Ke(_,Cn("NodeLabel")));if(L&&(g.label=L),m==="UMLClassNode"){g.shape="card";const S=ci(Ke(_,Cn("AttributeLabel"))),T=ci(Ke(_,Cn("MethodLabel"))),C=[];S&&C.push(...S.split(/\r?\n/)),(S||T)&&C.push("---"),T&&C.push(...T.split(/\r?\n/)),g.body=C}else Yl.has(m)&&(g.shape="rectangle",g.tags=[...g.tags??[],"group"])},u=f=>{let g=f.attrs.source,_=f.attrs.target;(!o.hasNode(g)||!o.hasNode(_))&&o.warnings.push(`Edge ${g} -> ${_} references an undeclared node; it was created`);const m={id:f.attrs.id};let v=oi(f.attrs.directed);const y={id:"",source:g,target:_};for(const S of Es(f,"data")){const T=s.get(S.attrs.key);if(T)if(T.yType==="edgegraphics"){const C=Ke(S,z=>pu.has(li(z)));if(!C)continue;const E=Ke(C,Cn("Arrows"));if(E){const z=(E.attrs.source??"none")!=="none",P=(E.attrs.target??"none")!=="none";z&&!P?([g,_]=[_,g],v=!0):v=P&&!z}const M=Ke(C,Cn("LineStyle"));if(M){const z=Ss(M.attrs.color);z&&z!=="#000000"&&(y.color=z),/dash|dot/i.test(M.attrs.type??"")&&(y.dashed=!0);const P=ve(M.attrs.width);P!==void 0&&Math.abs(P-1)>.01&&(y.width=Math.min(8,Math.max(.5,P)))}const D=ci(Ke(C,Cn("EdgeLabel")));D&&(y.label=D)}else c(y,T,ci(S),!1)}t.numericLabelsAsWeights&&y.label!==void 0&&y.weight===void 0&&/^-?\d+(\.\d+)?$/.test(y.label)&&(y.weight=Number(y.label),delete y.label);const x=o.addEdge(g,_,{...y,id:m.id,directed:void 0}),L=v??o.directed;L!==o.directed&&(x.directed=L)};l(r);for(const f of a)u(f);return{graph:o.build(),warnings:o.warnings,format:"graphml"}}const _u={circle:"ellipse",square:"rectangle",rectangle:"rectangle",diamond:"diamond",hexagon:"hexagon",triangle:"triangle",card:"rectangle"};function jl(i,t={}){const e=t.scale??.5,n=t.defaultSize??14,s=[],r=(h,d,u)=>{let f=s.find(g=>g.target===h&&g.name===d);return f||(f={id:`k${s.length+2}`,target:h,name:d,type:u},s.push(f)),f.id},o=h=>typeof h=="number"?"double":typeof h=="boolean"?"boolean":"string",a=[];for(const h of i.nodes){const d=h.size??n,u=h.shape??"circle",f=(u==="rectangle"?d*1.6:u==="card"?Math.max(d*3,60):d)/e,g=(u==="card"?Math.max(d*3,40):d)/e,_=(h.x??0)/e-f/2,m=-(h.y??0)/e-g/2,p=Ss(h.color)??"#CCCCFF",v=Te(h.label??h.id);let y;if(u==="card"){const L=(h.body??[]).indexOf("---"),S=(L<0?h.body??[]:(h.body??[]).slice(0,L)).join(`
`),T=L<0?"":(h.body??[]).slice(L+1).join(`
`);y=`<y:UMLClassNode><y:Geometry height="${g}" width="${f}" x="${_}" y="${m}"/><y:Fill color="${p}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${v}</y:NodeLabel><y:UML clipContent="true" omitDetails="false" stereotype="" use3DEffect="false"><y:AttributeLabel>${Te(S)}</y:AttributeLabel><y:MethodLabel>${Te(T)}</y:MethodLabel></y:UML></y:UMLClassNode>`}else y=`<y:ShapeNode><y:Geometry height="${g}" width="${f}" x="${_}" y="${m}"/><y:Fill color="${p}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${v}</y:NodeLabel><y:Shape type="${_u[u]}"/></y:ShapeNode>`;const x=[`<data key="d0">${y}</data>`];h.url&&x.push(`<data key="${r("node","url","string")}">${Te(h.url)}</data>`),h.group&&x.push(`<data key="${r("node","group","string")}">${Te(h.group)}</data>`),h.sublabel&&x.push(`<data key="${r("node","sublabel","string")}">${Te(h.sublabel)}</data>`),h.z!==void 0&&x.push(`<data key="${r("node","z","double")}">${h.z}</data>`),h.color&&!Ss(h.color)&&x.push(`<data key="${r("node","color","string")}">${Te(h.color)}</data>`);for(const[L,S]of Object.entries(h.props??{}))x.push(`<data key="${r("node",L,o(S))}">${Te(String(S))}</data>`);a.push(`    <node id="${Te(h.id)}">
      ${x.join(`
      `)}
    </node>`)}const l=[];for(const h of i.edges){const d=h.directed??i.directed,u=Ss(h.color)??"#000000",f=h.label?`<y:EdgeLabel>${Te(h.label)}</y:EdgeLabel>`:"",_=[`<data key="d1">${`<y:PolyLineEdge><y:Path sx="0.0" sy="0.0" tx="0.0" ty="0.0"/><y:LineStyle color="${u}" type="${h.dashed?"dashed":"line"}" width="${h.width??1}"/><y:Arrows source="none" target="${d?"standard":"none"}"/>${f}</y:PolyLineEdge>`}</data>`];h.weight!==void 0&&_.push(`<data key="${r("edge","weight","double")}">${h.weight}</data>`),h.url&&_.push(`<data key="${r("edge","url","string")}">${Te(h.url)}</data>`),h.group&&_.push(`<data key="${r("edge","group","string")}">${Te(h.group)}</data>`);for(const[m,p]of Object.entries(h.props??{}))_.push(`<data key="${r("edge",m,o(p))}">${Te(String(p))}</data>`);l.push(`    <edge id="${Te(h.id)}" source="${Te(h.source)}" target="${Te(h.target)}">
      ${_.join(`
      `)}
    </edge>`)}return`<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:y="http://www.yworks.com/xml/graphml" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd">
${['  <key for="node" id="d0" yfiles.type="nodegraphics"/>','  <key for="edge" id="d1" yfiles.type="edgegraphics"/>',...s.map(h=>`  <key attr.name="${Te(h.name)}" attr.type="${h.type}" for="${h.target}" id="${h.id}"/>`)].join(`
`)}
  <graph id="G" edgedefault="${i.directed?"directed":"undirected"}">
${a.join(`
`)}
${l.join(`
`)}
  </graph>
</graphml>
`}const fn=i=>typeof i=="object"&&i!==null&&!Array.isArray(i),Ae=i=>i==null?void 0:String(i),vu=new Set(["id","name","key","index","vx","vy","vz","fx","fy","fz","source","target","from","to","value","w"]);function Zl(i,t){const e={};for(const[n,s]of Object.entries(i))t.has(n)||vu.has(n)||(typeof s=="string"||typeof s=="number"||typeof s=="boolean")&&(e[n]=s);return Object.keys(e).length?e:void 0}const xu=new Set(["label","sublabel","x","y","z","group","tags","url","color","shape","size","body","pinned","props"]),yu=new Set(["weight","directed","label","url","color","width","dashed","group","props"]);function Mu(i){const t=Ae(i.shape);return{label:Ae(i.label??i.name),sublabel:Ae(i.sublabel),x:ve(i.x),y:ve(i.y),z:ve(i.z),group:Ae(i.group),tags:Array.isArray(i.tags)?i.tags.map(String):void 0,url:Ae(i.url),color:Ae(i.color),shape:t&&Ze.includes(t)?t:void 0,size:ve(i.size),body:Array.isArray(i.body)?i.body.map(String):void 0,pinned:oi(i.pinned),props:fn(i.props)?i.props:Zl(i,xu)}}function bu(i){return{id:Ae(i.id),weight:ve(i.weight??i.value??i.w),directed:oi(i.directed),label:Ae(i.label),url:Ae(i.url),color:Ae(i.color),width:ve(i.width),dashed:oi(i.dashed),group:Ae(i.group),props:fn(i.props)?i.props:Zl(i,yu)}}function Kl(i){const t=JSON.parse(i);if(!fn(t))throw new Error("JSON graph must be an object");const e=new bs;let n=[],s=[];if(fn(t.elements)){const a=l=>Array.isArray(l)?l.map(c=>fn(c)&&fn(c.data)?c.data:c):[];n=a(t.elements.nodes),s=a(t.elements.edges)}else n=Array.isArray(t.nodes)?t.nodes:[],s=Array.isArray(t.edges)?t.edges:Array.isArray(t.links)?t.links:[];if(e.directed=oi(t.directed)??!1,fn(t.meta)){const a=Ae(t.meta.dimension);e.meta={title:Ae(t.meta.title),description:Ae(t.meta.description),dimension:a==="3d"?"3d":a==="2d"?"2d":void 0}}const r=[];n.forEach((a,l)=>{const c=fn(a)?a:{id:a},h=Ae(c.id??c.name??c.key)??`n${l+1}`;r.push(h),e.addNode(h,Mu(c))});const o=a=>fn(a)?Ae(a.id??a.name??a.key):typeof a=="number"&&!e.hasNode(String(a))&&r[a]!==void 0?r[a]:Ae(a);for(const a of s){if(!fn(a))continue;const l=o(a.source??a.from),c=o(a.target??a.to);if(l===void 0||c===void 0){e.warnings.push("Skipped an edge without source or target");continue}(!e.hasNode(l)||!e.hasNode(c))&&e.warnings.push(`Edge ${l} -> ${c} referenced unknown nodes; they were created`),e.addEdge(l,c,bu(a))}return{graph:e.build(),warnings:e.warnings,format:"json"}}function Jl(i){return JSON.stringify({format:"graphscape",version:1,...i},null,2)}const Ql=[{id:"json",label:"Graphscape JSON (also D3 / Cytoscape)",extensions:["json"],mime:"application/json"},{id:"graphml",label:"GraphML (yEd)",extensions:["graphml","xml"],mime:"application/xml"},{id:"gml",label:"GML",extensions:["gml"],mime:"text/plain"},{id:"dot",label:"Graphviz DOT",extensions:["dot","gv"],mime:"text/vnd.graphviz"},{id:"csv",label:"CSV edge list",extensions:["csv","tsv","txt"],mime:"text/csv"}];function tc(i,t){const e=t?.split(/[?#]/)[0].split(".").pop()?.toLowerCase();if(e){for(const s of Ql)if(s.id!=="csv"&&s.extensions.includes(e))return s.id}const n=i.replace(/^\uFEFF/,"").trimStart();return n.startsWith("{")||n.startsWith("[")?"json":/^<\?xml|^<graphml/i.test(n)||/<graphml[\s>]/i.test(n.slice(0,2e3))?"graphml":/(^|\n)\s*graph\s*\[/.test(n.replace(/^\s*#.*$/gm,""))?"gml":/^(strict\s+)?(di)?graph\b[^[{]*\{/i.test(n.replace(/^(\s*(\/\/.*|#.*|\/\*[\s\S]*?\*\/)\s*)+/,""))?"dot":"csv"}function ec(i,t={}){const e=t.format??tc(i,t.filename),n=i.replace(/^\uFEFF/,"");switch(e){case"json":return Kl(n);case"graphml":return ql(n,{scale:t.scale,numericLabelsAsWeights:t.numericLabelsAsWeights});case"gml":return Xl(n);case"dot":return Hl(n);case"csv":return Fl(n,t.directed??!1)}}function Su(i,t){switch(t){case"json":return Jl(i);case"graphml":return jl(i);case"gml":return $l(i);case"dot":return Gl(i);case"csv":return kl(i)}}function nc(i){return i==="circle"||i==="diamond"||i==="hexagon"||i==="triangle"}function _o(i,t,e,n){const s=t/2;return{hw:i==="rectangle"?s*e:s,hh:s}}function vo(i,t,e){const n=i[0]-t.pos[0],s=i[1]-t.pos[1];if(e){const r=i[2]-t.pos[2];return n*n+s*s+r*r<t.hw*t.hw}return t.ellipse?n*n/(t.hw*t.hw)+s*s/(t.hh*t.hh)<1:Math.abs(n)<t.hw&&Math.abs(s)<t.hh}const xo=(i,t,e)=>[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e],Oi=(i,t)=>Math.hypot(i[0]-t[0],i[1]-t[1],i[2]-t[2]);function ic(i,t,e,n){const s=[];for(let r=0;r<=n;r++){const o=r/n,a=1-o;s.push([a*a*i[0]+2*a*o*t[0]+o*o*e[0],a*a*i[1]+2*a*o*t[1]+o*o*e[1],a*a*i[2]+2*a*o*t[2]+o*o*e[2]])}return s}function sc(i,t,e){let n=[t,-i,0],s=Math.hypot(n[0],n[1],n[2]);return s<1e-9&&(n=[-e,0,i],s=Math.hypot(n[0],n[1],n[2])),s<1e-9?[0,1,0]:[n[0]/s,n[1]/s,n[2]/s]}function Eu(i,t,e){const n=Math.max(i.hw,i.hh),s=n*e.loopScale*(1+.5*t),r=t*(Math.PI/3),o=n+s*.35,a=i.pos[0]-Math.sin(r)*o,l=i.pos[1]+Math.cos(r)*o,c=r-Math.PI/2,h=.35,d=Math.max(12,e.segments*2),u=[];for(let f=0;f<=d;f++){const g=c+h+f/d*(2*Math.PI-2*h);u.push([a+s*Math.cos(g),l+s*Math.sin(g),i.pos[2]])}return u}function yo(i,t,e){let n=0;for(;n<i.length&&vo(i[n],t,e);)n++;if(n===0||n>=i.length)return i;let s=i[n-1],r=i[n];for(let o=0;o<18;o++){const a=xo(s,r,.5);vo(a,t,e)?s=a:r=a}return[r,...i.slice(n)]}function rc(i,t,e){return yo([...i].reverse(),t,e).reverse()}function oc(i,t,e,n,s,r,o){let a;if(r)a=Eu(i,e,o);else{const l=(e-(n-1)/2)*o.spacing*(s?-1:1);if(Math.abs(l)<1e-6)a=[i.pos,t.pos];else{const c=t.pos[0]-i.pos[0],h=t.pos[1]-i.pos[1],d=o.dim3?t.pos[2]-i.pos[2]:0,u=sc(c,h,d),f=[(i.pos[0]+t.pos[0])/2,(i.pos[1]+t.pos[1])/2,(i.pos[2]+t.pos[2])/2],g=[f[0]+u[0]*2*l,f[1]+u[1]*2*l,f[2]+u[2]*2*l];a=ic(i.pos,g,t.pos,o.segments)}}return a=yo(a,i,o.dim3),a=rc(a,t,o.dim3),a}function Mo(i){let t=0;for(let e=1;e<i.length;e++)t+=Oi(i[e-1],i[e]);return t}function ac(i,t){if(i.length<2||Mo(i)<=t*1.2)return i;const e=i.slice();let n=t;for(;e.length>=2;){const s=e[e.length-2],r=e[e.length-1],o=Oi(s,r);if(o>n+1e-9)return e[e.length-1]=xo(s,r,(o-n)/o),e;n-=o,e.pop()}return i}function er(i,t){const e=Mo(i);if(e===0)return i[0];let n=e*t;for(let s=1;s<i.length;s++){const r=Oi(i[s-1],i[s]);if(n<=r)return xo(i[s-1],i[s],r===0?0:n/r);n-=r}return i[i.length-1]}function lc(i){const t=i[i.length-1];let e=i.length-2;for(;e>0&&Oi(i[e],t)<1e-6;)e--;const n=i[Math.max(0,e)],s=Oi(n,t)||1;return{tip:t,dir:[(t[0]-n[0])/s,(t[1]-n[1])/s,(t[2]-n[2])/s]}}function cc(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a;let c=l===0?0:((i-e)*o+(t-n)*a)/l;return c=Math.max(0,Math.min(1,c)),Math.hypot(i-(e+c*o),t-(n+c*a))}const wu=Object.freeze(Object.defineProperty({__proto__:null,dist3:Oi,distToSegment:cc,edgePath:oc,inside:vo,isEllipseShape:nc,nodeExtents:_o,normalTo:sc,pathLength:Mo,pointAtFraction:er,quadratic:ic,shortenEnd:ac,tipOf:lc,trimEnd:rc,trimStart:yo},Symbol.toStringTag,{value:"Module"})),Tu=.58,Au=1.25;function ws(i,t,e){const n=i.split(`
`).map(s=>Math.min(s.length,e));return{w:Math.max(0,...n)*t*Tu,h:n.length*t*Au}}function pn(i,t){return i.boxes?.get(t)??{w:i.spacing,h:i.spacing}}function hc(i,t,e=!1){const n=Qs(i),s=t.label.show&&i.nodes.length<=t.label.maxCount,r=new Map;for(const o of i.nodes){const a=tr(o,t,n);if(a.shape==="card"){const d=ws(o.label??o.id,t.card.size,80),u=ws((o.body??[]).join(`
`),t.card.size,80),f=t.card.padding;r.set(o.id,{w:Math.max(d.w,u.w)+f*3,h:(d.h+u.h)*1.12+f*3});continue}const l=_o(a.shape,a.size,t.node.aspect);let c=l.hw*2,h=l.hh*2;if(s){const d=ws(o.label??o.id,t.label.size,t.label.maxChars),u=o.sublabel?ws(o.sublabel,t.label.subSize,t.label.maxChars):{w:0,h:0};c=Math.max(c,d.w,u.w),h+=t.label.gap+d.h+u.h}r.set(o.id,{w:c,h})}return r}class bo{constructor(t,e){H(this,"ids");H(this,"pos");H(this,"temperature");H(this,"t0");H(this,"n");H(this,"k");H(this,"dim3");H(this,"disp");H(this,"fixed");H(this,"ea");H(this,"eb");H(this,"es");H(this,"index",new Map);H(this,"rnd");H(this,"gravity");const n=t.nodes;this.n=n.length,this.k=e.idealLength,this.dim3=e.dimension==="3d",this.gravity=e.gravity,this.rnd=ys(e.seed),this.ids=n.map(l=>l.id),this.pos=new Float64Array(this.n*3),this.disp=new Float64Array(this.n*3),this.fixed=new Uint8Array(this.n);const s=this.k*(this.dim3?Math.cbrt(this.n):Math.sqrt(this.n))*.6+this.k;n.forEach((l,c)=>{this.index.set(l.id,c),this.pos[3*c]=l.x??(this.rnd()*2-1)*s,this.pos[3*c+1]=l.y??(this.rnd()*2-1)*s,this.pos[3*c+2]=this.dim3?l.z??(this.rnd()*2-1)*s:l.z??0,l.pinned&&(this.fixed[c]=1)});const r=t.edges.filter(l=>l.source!==l.target);this.ea=new Int32Array(r.length),this.eb=new Int32Array(r.length),this.es=new Float64Array(r.length);const o=r.map(l=>t.weightOf(l)).filter(l=>l>0).sort((l,c)=>l-c),a=o.length?o[Math.floor(o.length/2)]:1;r.forEach((l,c)=>{this.ea[c]=this.index.get(l.source),this.eb[c]=this.index.get(l.target);const h=Math.max(t.weightOf(l),1e-6),d=e.weightMode==="closer"?a/h:e.weightMode==="longer"?h/a:1,u=Math.min(4,Math.max(.25,d));this.es[c]=1/(u*u*u)}),this.t0=this.k*2,this.temperature=this.t0}get alpha(){return this.temperature/this.t0}pin(t,e){const n=this.index.get(t);n!==void 0&&(this.pos[3*n]=e[0],this.pos[3*n+1]=e[1],this.dim3&&(this.pos[3*n+2]=e[2]),this.fixed[n]=1)}unpin(t,e=!1){const n=this.index.get(t);n!==void 0&&!e&&(this.fixed[n]=0)}step(){const{n:t,k:e,dim3:n,pos:s,disp:r}=this,o=e*e;r.fill(0);const a=(c,h,d)=>{let u=s[3*c]-s[3*h],f=s[3*c+1]-s[3*h+1],g=n?s[3*c+2]-s[3*h+2]:0,_=u*u+f*f+g*g;if(_>d)return;_<1e-6&&(u=(this.rnd()-.5)*.1,f=(this.rnd()-.5)*.1,g=n?(this.rnd()-.5)*.1:0,_=u*u+f*f+g*g+1e-6);const m=o/_;r[3*c]+=u*m,r[3*c+1]+=f*m,r[3*c+2]+=g*m,r[3*h]-=u*m,r[3*h+1]-=f*m,r[3*h+2]-=g*m};if(t<=400)for(let c=0;c<t;c++)for(let h=c+1;h<t;h++)a(c,h,1/0);else{const c=e*4,h=c*c,d=v=>Math.max(-1e3,Math.min(1e3,Math.floor(v/c))),u=(v,y,x)=>((v+1024)*2048+(y+1024))*2048+(x+1024),f=new Map,g=new Int16Array(t),_=new Int16Array(t),m=new Int16Array(t);for(let v=0;v<t;v++){g[v]=d(s[3*v]),_[v]=d(s[3*v+1]),m[v]=n?d(s[3*v+2]):0;const y=u(g[v],_[v],m[v]),x=f.get(y);x?x.push(v):f.set(y,[v])}const p=n?1:0;for(let v=0;v<t;v++)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)for(let L=-p;L<=p;L++){const S=f.get(u(g[v]+y,_[v]+x,m[v]+L));if(S)for(const T of S)T>v&&a(v,T,h)}}for(let c=0;c<this.ea.length;c++){const h=this.ea[c],d=this.eb[c],u=s[3*h]-s[3*d],f=s[3*h+1]-s[3*d+1],g=n?s[3*h+2]-s[3*d+2]:0,m=Math.sqrt(u*u+f*f+g*g)/e*this.es[c];r[3*h]-=u*m,r[3*h+1]-=f*m,r[3*h+2]-=g*m,r[3*d]+=u*m,r[3*d+1]+=f*m,r[3*d+2]+=g*m}const l=this.temperature;for(let c=0;c<t;c++){if(this.fixed[c])continue;r[3*c]-=s[3*c]*this.gravity,r[3*c+1]-=s[3*c+1]*this.gravity,n&&(r[3*c+2]-=s[3*c+2]*this.gravity);const h=n?r[3*c+2]:0,d=Math.sqrt(r[3*c]**2+r[3*c+1]**2+h*h);if(d<1e-9)continue;const u=Math.min(d,l)/d;s[3*c]+=r[3*c]*u,s[3*c+1]+=r[3*c+1]*u,n&&(s[3*c+2]+=h*u)}this.temperature=Math.max(this.temperature*.985,this.t0*.002)}entries(){return this.ids.map((t,e)=>[t,[this.pos[3*e],this.pos[3*e+1],this.dim3?this.pos[3*e+2]:0]])}commit(t){t.setPositions(this.entries())}}function dc(i,t){var L;const e=i.nodes.map(S=>S.id),n=new Map(e.map((S,T)=>[S,T])),s=e.length,r=Array.from({length:s},()=>[]);for(const S of i.edges){const T=n.get(S.source),C=n.get(S.target);T!==C&&r[T].push(C)}const o=new Uint8Array(s),a=Array.from({length:s},()=>[]),l=[];for(let S=0;S<s;S++){if(o[S])continue;const T=[[S,0]];for(o[S]=1,l.push(S);T.length;){const C=T[T.length-1],E=C[0];if(C[1]<r[E].length){const M=r[E][C[1]++];o[M]===0?(o[M]=1,l.push(M),a[E].push(M),T.push([M,0])):o[M]===1?a[M].push(E):a[E].push(M)}else o[E]=2,T.pop()}}const c=new Int32Array(s);for(let S=0;S<s;S++)for(const T of a[S])c[T]++;const h=new Int32Array(s),d=[];for(let S=0;S<s;S++)c[S]===0&&d.push(S);for(let S=0;S<d.length;S++){const T=d[S];for(const C of a[T])h[C]=Math.max(h[C],h[T]+1),--c[C]===0&&d.push(C)}const u=[];for(const S of l)(u[L=h[S]]??(u[L]=[])).push(S);const f=Array.from({length:s},()=>[]);for(let S=0;S<s;S++)for(const T of a[S])f[T].push(S);const g=new Float64Array(s);u.forEach(S=>S?.forEach((T,C)=>g[T]=C));for(let S=0;S<8;S++){const T=S%2===0,C=u.map((E,M)=>M);T||C.reverse();for(const E of C.slice(1)){const M=u[E];if(!M)continue;const D=new Map;for(const z of M){const P=T?f[z]:a[z];D.set(z,P.length?P.reduce((U,G)=>U+g[G],0)/P.length:g[z])}M.sort((z,P)=>D.get(z)-D.get(P)),M.forEach((z,P)=>g[z]=P)}}const _=t.direction==="TB",m=S=>_?pn(t,S).w:pn(t,S).h,p=S=>_?pn(t,S).h:pn(t,S).w,v=new Map;let y=0,x=0;return u.forEach((S,T)=>{if(!S)return;const C=Math.max(...S.map(D=>p(e[D])));y+=T===0?C/2:x/2+t.gap*2.2+C/2,x=C;let M=-(S.reduce((D,z)=>D+m(e[z]),0)+t.gap*(S.length-1))/2;for(const D of S){const z=m(e[D]),P=M+z/2;M+=z+t.gap,v.set(e[D],_?[P,-y,0]:[y,-P,0])}}),v}function So(i){const t=new Map;for(const e of i.nodes)e.group!==void 0&&!t.has(e.group)&&t.set(e.group,t.size);return i.nodes.map((e,n)=>({id:e.id,g:e.group===void 0?-1:t.get(e.group),i:n})).sort((e,n)=>e.g-n.g||e.i-n.i).map(e=>e.id)}function Eo(i,t){const e=pn(i,t);return Math.hypot(e.w,e.h)*.75+i.gap}function uc(i,t){const e=So(i),n=e.map(l=>Eo(t,l)),s=n.reduce((l,c)=>l+c,0)||1,r=Math.max(s/(2*Math.PI),Math.max(0,...n)*.5||1),o=new Map;let a=0;return e.forEach((l,c)=>{const h=(a+n[c]/2)/s*Math.PI*2-Math.PI/2;a+=n[c],o.set(l,[r*Math.cos(h),r*Math.sin(h),0])}),o}function fc(i,t){const e=So(i),n=e.length;let s=0,r=0;for(const u of e){const f=pn(t,u);s=Math.max(s,f.w),r=Math.max(r,f.h)}s+=t.gap,r+=t.gap;const o=!!t.dim3,a=o?Math.max(1,Math.ceil(Math.cbrt(n))):Math.max(1,Math.round(Math.sqrt(n*r/s))),l=o?a:Math.ceil(n/a),c=o?Math.ceil(n/(a*l)):1,h=Math.max(s,r),d=new Map;return e.forEach((u,f)=>{const g=f%a,_=Math.floor(f/a)%l,m=o?Math.floor(f/(a*l)):0;d.set(u,[(g-(a-1)/2)*s,((l-1)/2-_)*r,o?(m-(c-1)/2)*h:0])}),d}function pc(i,t){const e=So(i),n=e.length,s=e.reduce((l,c)=>l+Eo(t,c),0)/Math.max(n,1)||1,r=Math.max(s,s*Math.sqrt(n/(4*Math.PI))*1.1),o=Math.PI*(3-Math.sqrt(5)),a=new Map;return e.forEach((l,c)=>{const h=n===1?0:1-c/(n-1)*2,d=Math.sqrt(Math.max(0,1-h*h)),u=o*c;a.set(l,[Math.cos(u)*d*r,h*r,Math.sin(u)*d*r])}),a}function mc(i,t){const e=ys(t.seed??1),n=i.nodes.map(a=>a.id),r=(n.reduce((a,l)=>a+Eo(t,l),0)/Math.max(n.length,1)||1)*Math.sqrt(n.length)*.9,o=new Map;for(const a of n)o.set(a,[(e()*2-1)*r,(e()*2-1)*r,t.dim3?(e()*2-1)*r:0]);return o}function gc(i,t){const e=i.nodes.map(P=>P.id),n=e.length,s=new Map;if(n===0)return s;const r=new Map(e.map((P,U)=>[P,U])),o=Array.from({length:n},()=>[]),a=new Int32Array(n),l=new Int32Array(n);for(const P of i.edges){const U=r.get(P.source),G=r.get(P.target);U!==G&&(l[U]++,l[G]++,o[U].push(G),i.isDirected(P)?a[G]++:o[G].push(U))}const c=new Int32Array(n).fill(-1),h=new Int32Array(n).fill(-1),d=Array.from({length:n},()=>[]),u=[],f=P=>{u.push(P),h[P]=0;const U=[P];for(let G=0;G<U.length;G++){const k=U[G];for(const Y of o[k])h[Y]===-1&&(h[Y]=h[k]+1,c[Y]=k,d[k].push(Y),U.push(Y))}},g=[...Array(n).keys()].filter(P=>a[P]===0);a.some(P=>P>0)||g.sort((P,U)=>l[U]-l[P]||P-U);for(const P of g)h[P]===-1&&f(P);const _=P=>{const U=new Map([[P,0]]),G=[P];let k=0;for(let Y=0;Y<G.length;Y++){const X=G[Y];for(const Q of o[X])h[Q]!==-1||U.has(Q)||(U.set(Q,U.get(X)+1),k=Math.max(k,U.get(Q)),G.push(Q))}return{reach:G.length,height:k}};for(;;){const P=[...Array(n).keys()].filter(k=>h[k]===-1).sort((k,Y)=>l[Y]-l[k]||k-Y);if(!P.length)break;let U=P[0],G={reach:-1,height:0};for(const k of P.slice(0,8)){const Y=_(k);(Y.reach>G.reach||Y.reach===G.reach&&Y.height<G.height)&&(U=k,G=Y)}f(U)}const m=t.direction==="TB",p=P=>m?pn(t,e[P]).w:pn(t,e[P]).h,v=P=>m?pn(t,e[P]).h:pn(t,e[P]).w,y=[];for(const P of u){const U=[P];for(;U.length;){const G=U.pop();y.push(G);for(let k=d[G].length-1;k>=0;k--)U.push(d[G][k])}}const x=new Float64Array(n);for(let P=y.length-1;P>=0;P--){const U=y[P],G=d[U],k=G.reduce((Y,X)=>Y+x[X],0)+t.gap*Math.max(0,G.length-1);x[U]=Math.max(p(U),k)}const L=new Float64Array(n);let S=0;for(const P of u)L[P]=S,S+=x[P]+t.gap*2;const T=S-t.gap*2;for(const P of y){const U=d[P];if(!U.length)continue;const G=U.reduce((Y,X)=>Y+x[X],0)+t.gap*(U.length-1);let k=L[P]+(x[P]-G)/2;for(const Y of U)L[Y]=k,k+=x[Y]+t.gap}const C=new Float64Array(n);for(let P=y.length-1;P>=0;P--){const U=y[P],G=d[U];C[U]=G.length?(C[G[0]]+C[G[G.length-1]])/2:L[U]+x[U]/2}const E=Math.max(...Array.from(h)),M=new Float64Array(E+1);for(let P=0;P<n;P++)M[h[P]]=Math.max(M[h[P]],v(P));const D=new Float64Array(E+1);let z=0;for(let P=0;P<=E;P++)z+=P===0?M[0]/2:M[P-1]/2+t.gap*2.2+M[P]/2,D[P]=z;for(let P=0;P<n;P++){const U=C[P]-T/2;s.set(e[P],m?[U,-D[h[P]],0]:[D[h[P]],-U,0])}return s}const wo={dimension:"2d",spacing:40,gap:12,idealLength:60,gravity:.05,weightMode:"ignore",direction:"TB",seed:1,iterations:300},Cu=["force","tree","layered","circle","grid","sphere","random"];function _c(i,t,e={}){const n={...wo,...e},s={spacing:n.spacing,gap:n.gap,boxes:n.boxes,dim3:n.dimension==="3d",seed:n.seed};switch(t){case"circle":return uc(i,s);case"grid":return fc(i,s);case"sphere":return pc(i,s);case"random":return mc(i,s);case"layered":return dc(i,{...s,direction:n.direction});case"tree":return gc(i,{...s,direction:n.direction});case"force":{const r=new bo(i,n);for(let o=0;o<n.iterations&&r.alpha>.02;o++)r.step();return new Map(r.entries())}}}function To(i,t,e,n){const s=ys(n),r=t==="3d",o=c=>c.x!==void 0&&c.y!==void 0,a=e*Math.sqrt(Math.max(i.nodes.length,1))*.6+e;let l=0;for(const c of i.nodes){if(o(c)){c.z===void 0&&(c.z=0);continue}let h;for(const u of i.edges){const f=u.source===c.id?i.getNode(u.target):u.target===c.id?i.getNode(u.source):void 0;if(f&&f!==c&&o(f)){h={x:f.x,y:f.y,z:f.z??0};break}}const d=h?e*.6:a;c.x=(h?.x??0)+(s()*2-1)*d,c.y=(h?.y??0)+(s()*2-1)*d,c.z=r?(h?.z??0)+(s()*2-1)*d:h?.z??0,l++}return l}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ao="170",Se={ROTATE:0,DOLLY:1,PAN:2},mn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ru=0,vc=1,Pu=2,xc=1,Lu=2,Rn=3,Pn=0,Fe=1,gn=2,Xn=0,Fi=1,yc=2,Mc=3,bc=4,Du=5,hi=100,Iu=101,Uu=102,Nu=103,Ou=104,Fu=200,zu=201,ku=202,Bu=203,Co=204,Ro=205,Hu=206,Gu=207,Vu=208,Wu=209,Xu=210,$u=211,Yu=212,qu=213,ju=214,Po=0,Lo=1,Do=2,zi=3,Io=4,Uo=5,No=6,Oo=7,Fo=0,Zu=1,Ku=2,$n=0,Ju=1,Qu=2,tf=3,ef=4,nf=5,sf=6,rf=7,Sc=300,ki=301,Bi=302,zo=303,ko=304,nr=306,Bo=1e3,di=1001,Ho=1002,Xe=1003,of=1004,ir=1005,_n=1006,Go=1007,ui=1008,Ln=1009,Ec=1010,wc=1011,Ts=1012,Vo=1013,fi=1014,vn=1015,As=1016,Wo=1017,Xo=1018,Hi=1020,Tc=35902,Ac=1021,Cc=1022,sn=1023,Rc=1024,Pc=1025,Gi=1026,Vi=1027,$o=1028,Yo=1029,Lc=1030,qo=1031,jo=1033,sr=33776,rr=33777,or=33778,ar=33779,Zo=35840,Ko=35841,Jo=35842,Qo=35843,ta=36196,ea=37492,na=37496,ia=37808,sa=37809,ra=37810,oa=37811,aa=37812,la=37813,ca=37814,ha=37815,da=37816,ua=37817,fa=37818,pa=37819,ma=37820,ga=37821,lr=36492,_a=36494,va=36495,Dc=36283,xa=36284,ya=36285,Ma=36286,af=3200,lf=3201,Ic=0,cf=1,Yn="",$e="srgb",Wi="srgb-linear",cr="linear",Qt="srgb",Xi=7680,Uc=519,hf=512,df=513,uf=514,Nc=515,ff=516,pf=517,mf=518,gf=519,ba=35044,Oc=35048,Fc="300 es",Dn=2e3,hr=2001;class pi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let zc=1234567;const Cs=Math.PI/180,Rs=180/Math.PI;function In(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]).toLowerCase()}function Ce(i,t,e){return Math.max(t,Math.min(e,i))}function Sa(i,t){return(i%t+t)%t}function _f(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function vf(i,t,e){return i!==t?(e-i)/(t-i):0}function Ps(i,t,e){return(1-e)*i+e*t}function xf(i,t,e,n){return Ps(i,t,1-Math.exp(-e*n))}function yf(i,t=1){return t-Math.abs(Sa(i,t*2)-t)}function Mf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function bf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Sf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ef(i,t){return i+Math.random()*(t-i)}function wf(i){return i*(.5-Math.random())}function Tf(i){i!==void 0&&(zc=i);let t=zc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Af(i){return i*Cs}function Cf(i){return i*Rs}function Rf(i){return(i&i-1)===0&&i!==0}function Pf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Lf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Df(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function rn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Zt(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const mi={DEG2RAD:Cs,RAD2DEG:Rs,generateUUID:In,clamp:Ce,euclideanModulo:Sa,mapLinear:_f,inverseLerp:vf,lerp:Ps,damp:xf,pingpong:yf,smoothstep:Mf,smootherstep:bf,randInt:Sf,randFloat:Ef,randFloatSpread:wf,seededRandom:Tf,degToRad:Af,radToDeg:Cf,isPowerOfTwo:Rf,ceilPowerOfTwo:Pf,floorPowerOfTwo:Lf,setQuaternionFromProperEuler:Df,normalize:Zt,denormalize:rn};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Dt{constructor(t,e,n,s,r,o,a,l,c){Dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],v=s[1],y=s[4],x=s[7],L=s[2],S=s[5],T=s[8];return r[0]=o*_+a*v+l*L,r[3]=o*m+a*y+l*S,r[6]=o*p+a*x+l*T,r[1]=c*_+h*v+d*L,r[4]=c*m+h*y+d*S,r[7]=c*p+h*x+d*T,r[2]=u*_+f*v+g*L,r[5]=u*m+f*y+g*S,r[8]=u*p+f*x+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,g=e*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=d*_,t[1]=(s*c-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=u*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ea.makeScale(t,e)),this}rotate(t){return this.premultiply(Ea.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ea.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ea=new Dt;function kc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function dr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function If(){const i=dr("canvas");return i.style.display="block",i}const Bc={};function Ls(i){i in Bc||(Bc[i]=!0,console.warn(i))}function Uf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Nf(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Of(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Gt={enabled:!0,workingColorSpace:Wi,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Qt&&(i.r=Un(i.r),i.g=Un(i.g),i.b=Un(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Qt&&(i.r=$i(i.r),i.g=$i(i.g),i.b=$i(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Yn?cr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Un(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $i(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Hc=[.64,.33,.3,.6,.15,.06],Gc=[.2126,.7152,.0722],Vc=[.3127,.329],Wc=new Dt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xc=new Dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Gt.define({[Wi]:{primaries:Hc,whitePoint:Vc,transfer:cr,toXYZ:Wc,fromXYZ:Xc,luminanceCoefficients:Gc,workingColorSpaceConfig:{unpackColorSpace:$e},outputColorSpaceConfig:{drawingBufferColorSpace:$e}},[$e]:{primaries:Hc,whitePoint:Vc,transfer:Qt,toXYZ:Wc,fromXYZ:Xc,luminanceCoefficients:Gc,outputColorSpaceConfig:{drawingBufferColorSpace:$e}}});let Yi;class Ff{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Yi===void 0&&(Yi=dr("canvas")),Yi.width=t.width,Yi.height=t.height;const n=Yi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Yi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=dr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Un(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Un(e[n]/255)*255):e[n]=Un(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let zf=0;class $c{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=In(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(wa(s[o].image)):r.push(wa(s[o]))}else r=wa(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function wa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ff.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let kf=0;class Ie extends pi{constructor(t=Ie.DEFAULT_IMAGE,e=Ie.DEFAULT_MAPPING,n=di,s=di,r=_n,o=ui,a=sn,l=Ln,c=Ie.DEFAULT_ANISOTROPY,h=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kf++}),this.uuid=In(),this.name="",this.source=new $c(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Sc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Bo:t.x=t.x-Math.floor(t.x);break;case di:t.x=t.x<0?0:1;break;case Ho:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Bo:t.y=t.y-Math.floor(t.y);break;case di:t.y=t.y<0?0:1;break;case Ho:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ie.DEFAULT_IMAGE=null,Ie.DEFAULT_MAPPING=Sc,Ie.DEFAULT_ANISOTROPY=1;class ne{constructor(t=0,e=0,n=0,s=1){ne.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,x=(f+1)/2,L=(p+1)/2,S=(h+u)/4,T=(d+_)/4,C=(g+m)/4;return y>x&&y>L?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=S/n,r=T/n):x>L?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=S/s,r=C/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=T/r,s=C/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(d-_)/v,this.z=(u-h)/v,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Bf extends pi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ne(0,0,t,e),this.scissorTest=!1,this.viewport=new ne(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_n,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ie(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new $c(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gi extends Bf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Yc extends Ie{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hf extends Ie{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class me{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const u=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(d!==_||l!==u||c!==f||h!==g){let m=1-a;const p=l*u+c*f+h*g+d*_,v=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const L=Math.sqrt(y),S=Math.atan2(L,p*v);m=Math.sin(m*S)/L,a=Math.sin(a*S)/L}const x=a*v;if(l=l*m+u*x,c=c*m+f*x,h=h*m+g*x,d=d*m+_*x,m===1-a){const L=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=L,c*=L,h*=L,d*=L}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*d+l*f-c*u,t[e+1]=l*g+h*u+c*d-a*f,t[e+2]=c*g+h*f+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ce(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ta.copy(this).projectOnVector(t),this.sub(Ta)}reflect(t){return this.sub(Ta.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ta=new R,qc=new me;class xn{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(on.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(on.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=on.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,on):on.fromBufferAttribute(r,o),on.applyMatrix4(t.matrixWorld),this.expandByPoint(on);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ur.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ur.copy(n.boundingBox)),ur.applyMatrix4(t.matrixWorld),this.union(ur)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,on),on.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ds),fr.subVectors(this.max,Ds),qi.subVectors(t.a,Ds),ji.subVectors(t.b,Ds),Zi.subVectors(t.c,Ds),qn.subVectors(ji,qi),jn.subVectors(Zi,ji),_i.subVectors(qi,Zi);let e=[0,-qn.z,qn.y,0,-jn.z,jn.y,0,-_i.z,_i.y,qn.z,0,-qn.x,jn.z,0,-jn.x,_i.z,0,-_i.x,-qn.y,qn.x,0,-jn.y,jn.x,0,-_i.y,_i.x,0];return!Aa(e,qi,ji,Zi,fr)||(e=[1,0,0,0,1,0,0,0,1],!Aa(e,qi,ji,Zi,fr))?!1:(pr.crossVectors(qn,jn),e=[pr.x,pr.y,pr.z],Aa(e,qi,ji,Zi,fr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,on).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(on).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Nn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Nn=[new R,new R,new R,new R,new R,new R,new R,new R],on=new R,ur=new xn,qi=new R,ji=new R,Zi=new R,qn=new R,jn=new R,_i=new R,Ds=new R,fr=new R,pr=new R,vi=new R;function Aa(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){vi.fromArray(i,r);const a=s.x*Math.abs(vi.x)+s.y*Math.abs(vi.y)+s.z*Math.abs(vi.z),l=t.dot(vi),c=e.dot(vi),h=n.dot(vi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Gf=new xn,Is=new R,Ca=new R;class Zn{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Gf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Is.subVectors(t,this.center);const e=Is.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Is,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ca.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Is.copy(t.center).add(Ca)),this.expandByPoint(Is.copy(t.center).sub(Ca))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const On=new R,Ra=new R,mr=new R,Kn=new R,Pa=new R,gr=new R,La=new R;class _r{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,On)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=On.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(On.copy(this.origin).addScaledVector(this.direction,e),On.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ra.copy(t).add(e).multiplyScalar(.5),mr.copy(e).sub(t).normalize(),Kn.copy(this.origin).sub(Ra);const r=t.distanceTo(e)*.5,o=-this.direction.dot(mr),a=Kn.dot(this.direction),l=-Kn.dot(mr),c=Kn.lengthSq(),h=Math.abs(1-o*o);let d,u,f,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Ra).addScaledVector(mr,u),f}intersectSphere(t,e){On.subVectors(t.center,this.origin);const n=On.dot(this.direction),s=On.dot(On)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,On)!==null}intersectTriangle(t,e,n,s,r){Pa.subVectors(e,t),gr.subVectors(n,t),La.crossVectors(Pa,gr);let o=this.direction.dot(La),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Kn.subVectors(this.origin,t);const l=a*this.direction.dot(gr.crossVectors(Kn,gr));if(l<0)return null;const c=a*this.direction.dot(Pa.cross(Kn));if(c<0||l+c>o)return null;const h=-a*Kn.dot(La);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xt{constructor(t,e,n,s,r,o,a,l,c,h,d,u,f,g,_,m){Xt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,f,g,_,m)}set(t,e,n,s,r,o,a,l,c,h,d,u,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ki.setFromMatrixColumn(t,0).length(),r=1/Ki.setFromMatrixColumn(t,1).length(),o=1/Ki.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,f=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=u-_*c,e[9]=-a*l,e[2]=_-u*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,g=c*h,_=c*d;e[0]=u+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=_+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,g=c*h,_=c*d;e[0]=u-_*a,e[4]=-o*d,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=_-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,f=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=g*c-f,e[8]=u*c+_,e[1]=l*d,e[5]=_*c+u,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-u*d,e[8]=g*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+g,e[10]=u-_*d}else if(t.order==="XZY"){const u=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+_,e[5]=o*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=a*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Vf,t,Wf)}lookAt(t,e,n){const s=this.elements;return Ye.subVectors(t,e),Ye.lengthSq()===0&&(Ye.z=1),Ye.normalize(),Jn.crossVectors(n,Ye),Jn.lengthSq()===0&&(Math.abs(n.z)===1?Ye.x+=1e-4:Ye.z+=1e-4,Ye.normalize(),Jn.crossVectors(n,Ye)),Jn.normalize(),vr.crossVectors(Ye,Jn),s[0]=Jn.x,s[4]=vr.x,s[8]=Ye.x,s[1]=Jn.y,s[5]=vr.y,s[9]=Ye.y,s[2]=Jn.z,s[6]=vr.z,s[10]=Ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],v=n[3],y=n[7],x=n[11],L=n[15],S=s[0],T=s[4],C=s[8],E=s[12],M=s[1],D=s[5],z=s[9],P=s[13],U=s[2],G=s[6],k=s[10],Y=s[14],X=s[3],Q=s[7],dt=s[11],_t=s[15];return r[0]=o*S+a*M+l*U+c*X,r[4]=o*T+a*D+l*G+c*Q,r[8]=o*C+a*z+l*k+c*dt,r[12]=o*E+a*P+l*Y+c*_t,r[1]=h*S+d*M+u*U+f*X,r[5]=h*T+d*D+u*G+f*Q,r[9]=h*C+d*z+u*k+f*dt,r[13]=h*E+d*P+u*Y+f*_t,r[2]=g*S+_*M+m*U+p*X,r[6]=g*T+_*D+m*G+p*Q,r[10]=g*C+_*z+m*k+p*dt,r[14]=g*E+_*P+m*Y+p*_t,r[3]=v*S+y*M+x*U+L*X,r[7]=v*T+y*D+x*G+L*Q,r[11]=v*C+y*z+x*k+L*dt,r[15]=v*E+y*P+x*Y+L*_t,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*d-s*c*d-r*a*u+n*c*u+s*a*f-n*l*f)+_*(+e*l*f-e*c*u+r*o*u-s*o*f+s*c*h-r*l*h)+m*(+e*c*d-e*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-e*l*d+e*a*u+s*o*d-n*o*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],v=d*m*c-_*u*c+_*l*f-a*m*f-d*l*p+a*u*p,y=g*u*c-h*m*c-g*l*f+o*m*f+h*l*p-o*u*p,x=h*_*c-g*d*c+g*a*f-o*_*f-h*a*p+o*d*p,L=g*d*l-h*_*l-g*a*u+o*_*u+h*a*m-o*d*m,S=e*v+n*y+s*x+r*L;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/S;return t[0]=v*T,t[1]=(_*u*r-d*m*r-_*s*f+n*m*f+d*s*p-n*u*p)*T,t[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*p+n*l*p)*T,t[3]=(d*l*r-a*u*r-d*s*c+n*u*c+a*s*f-n*l*f)*T,t[4]=y*T,t[5]=(h*m*r-g*u*r+g*s*f-e*m*f-h*s*p+e*u*p)*T,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*T,t[7]=(o*u*r-h*l*r+h*s*c-e*u*c-o*s*f+e*l*f)*T,t[8]=x*T,t[9]=(g*d*r-h*_*r-g*n*f+e*_*f+h*n*p-e*d*p)*T,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*p+e*a*p)*T,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*f-e*a*f)*T,t[12]=L*T,t[13]=(h*_*s-g*d*s+g*n*u-e*_*u-h*n*m+e*d*m)*T,t[14]=(g*a*s-o*_*s-g*n*l+e*_*l+o*n*m-e*a*m)*T,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*u+e*a*u)*T,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,g=r*d,_=o*h,m=o*d,p=a*d,v=l*c,y=l*h,x=l*d,L=n.x,S=n.y,T=n.z;return s[0]=(1-(_+p))*L,s[1]=(f+x)*L,s[2]=(g-y)*L,s[3]=0,s[4]=(f-x)*S,s[5]=(1-(u+p))*S,s[6]=(m+v)*S,s[7]=0,s[8]=(g+y)*T,s[9]=(m-v)*T,s[10]=(1-(u+_))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ki.set(s[0],s[1],s[2]).length();const o=Ki.set(s[4],s[5],s[6]).length(),a=Ki.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],an.copy(this);const c=1/r,h=1/o,d=1/a;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=h,an.elements[5]*=h,an.elements[6]*=h,an.elements[8]*=d,an.elements[9]*=d,an.elements[10]*=d,e.setFromRotationMatrix(an),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Dn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let f,g;if(a===Dn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===hr)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Dn){const l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),u=(e+t)*c,f=(n+s)*h;let g,_;if(a===Dn)g=(o+r)*d,_=-2*d;else if(a===hr)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ki=new R,an=new Xt,Vf=new R(0,0,0),Wf=new R(1,1,1),Jn=new R,vr=new R,Ye=new R,jc=new Xt,Zc=new me;class ln{constructor(t=0,e=0,n=0,s=ln.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ce(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ce(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ce(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ce(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ce(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ce(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return jc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(jc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Zc.setFromEuler(this),this.setFromQuaternion(Zc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ln.DEFAULT_ORDER="XYZ";class Da{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Xf=0;const Kc=new R,Ji=new me,Fn=new Xt,xr=new R,Us=new R,$f=new R,Yf=new me,Jc=new R(1,0,0),Qc=new R(0,1,0),th=new R(0,0,1),eh={type:"added"},qf={type:"removed"},Qi={type:"childadded",child:null},Ia={type:"childremoved",child:null};class de extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=In(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=de.DEFAULT_UP.clone();const t=new R,e=new ln,n=new me,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xt},normalMatrix:{value:new Dt}}),this.matrix=new Xt,this.matrixWorld=new Xt,this.matrixAutoUpdate=de.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Da,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ji.setFromAxisAngle(t,e),this.quaternion.multiply(Ji),this}rotateOnWorldAxis(t,e){return Ji.setFromAxisAngle(t,e),this.quaternion.premultiply(Ji),this}rotateX(t){return this.rotateOnAxis(Jc,t)}rotateY(t){return this.rotateOnAxis(Qc,t)}rotateZ(t){return this.rotateOnAxis(th,t)}translateOnAxis(t,e){return Kc.copy(t).applyQuaternion(this.quaternion),this.position.add(Kc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Jc,t)}translateY(t){return this.translateOnAxis(Qc,t)}translateZ(t){return this.translateOnAxis(th,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?xr.copy(t):xr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(Us,xr,this.up):Fn.lookAt(xr,Us,this.up),this.quaternion.setFromRotationMatrix(Fn),s&&(Fn.extractRotation(s.matrixWorld),Ji.setFromRotationMatrix(Fn),this.quaternion.premultiply(Ji.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(eh),Qi.child=t,this.dispatchEvent(Qi),Qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(qf),Ia.child=t,this.dispatchEvent(Ia),Ia.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Fn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(eh),Qi.child=t,this.dispatchEvent(Qi),Qi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,t,$f),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,Yf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}de.DEFAULT_UP=new R(0,1,0),de.DEFAULT_MATRIX_AUTO_UPDATE=!0,de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new R,zn=new R,Ua=new R,kn=new R,ts=new R,es=new R,nh=new R,Na=new R,Oa=new R,Fa=new R,za=new ne,ka=new ne,Ba=new ne;class Je{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),cn.subVectors(t,e),s.cross(cn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){cn.subVectors(s,e),zn.subVectors(n,e),Ua.subVectors(t,e);const o=cn.dot(cn),a=cn.dot(zn),l=cn.dot(Ua),c=zn.dot(zn),h=zn.dot(Ua),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,kn)===null?!1:kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,kn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,kn.x),l.addScaledVector(o,kn.y),l.addScaledVector(a,kn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return za.setScalar(0),ka.setScalar(0),Ba.setScalar(0),za.fromBufferAttribute(t,e),ka.fromBufferAttribute(t,n),Ba.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(za,r.x),o.addScaledVector(ka,r.y),o.addScaledVector(Ba,r.z),o}static isFrontFacing(t,e,n,s){return cn.subVectors(n,e),zn.subVectors(t,e),cn.cross(zn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return cn.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),cn.cross(zn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(.3333333333333333)}getNormal(t){return Je.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Je.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Je.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Je.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Je.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;ts.subVectors(s,n),es.subVectors(r,n),Na.subVectors(t,n);const l=ts.dot(Na),c=es.dot(Na);if(l<=0&&c<=0)return e.copy(n);Oa.subVectors(t,s);const h=ts.dot(Oa),d=es.dot(Oa);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(ts,o);Fa.subVectors(t,r);const f=ts.dot(Fa),g=es.dot(Fa);if(g>=0&&f<=g)return e.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(es,a);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return nh.subVectors(r,s),a=(d-h)/(d-h+(f-g)),e.copy(s).addScaledVector(nh,a);const p=1/(m+_+u);return o=_*p,a=u*p,e.copy(n).addScaledVector(ts,o).addScaledVector(es,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ih={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qn={h:0,s:0,l:0},yr={h:0,s:0,l:0};function Ha(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<.16666666666666666?i+(t-i)*6*e:e<.5?t:e<.6666666666666666?i+(t-i)*6*(.6666666666666666-e):i}class zt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=$e){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Gt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Gt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Gt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Gt.workingColorSpace){if(t=Sa(t,1),e=Ce(e,0,1),n=Ce(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ha(o,r,t+.3333333333333333),this.g=Ha(o,r,t),this.b=Ha(o,r,t-.3333333333333333)}return Gt.toWorkingColorSpace(this,s),this}setStyle(t,e=$e){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=$e){const n=ih[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Un(t.r),this.g=Un(t.g),this.b=Un(t.b),this}copyLinearToSRGB(t){return this.r=$i(t.r),this.g=$i(t.g),this.b=$i(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=$e){return Gt.fromWorkingColorSpace(Ue.copy(this),t),Math.round(Ce(Ue.r*255,0,255))*65536+Math.round(Ce(Ue.g*255,0,255))*256+Math.round(Ce(Ue.b*255,0,255))}getHexString(t=$e){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Gt.workingColorSpace){Gt.fromWorkingColorSpace(Ue.copy(this),e);const n=Ue.r,s=Ue.g,r=Ue.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Gt.workingColorSpace){return Gt.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=$e){Gt.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,s=Ue.b;return t!==$e?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Qn),this.setHSL(Qn.h+t,Qn.s+e,Qn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Qn),t.getHSL(yr);const n=Ps(Qn.h,yr.h,e),s=Ps(Qn.s,yr.s,e),r=Ps(Qn.l,yr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new zt;zt.NAMES=ih;let jf=0;class xi extends pi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=In(),this.name="",this.blending=Fi,this.side=Pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Co,this.blendDst=Ro,this.blendEquation=hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new zt(0,0,0),this.blendAlpha=0,this.depthFunc=zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Fi&&(n.blending=this.blending),this.side!==Pn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Co&&(n.blendSrc=this.blendSrc),this.blendDst!==Ro&&(n.blendDst=this.blendDst),this.blendEquation!==hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Uc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class yi extends xi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=Fo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ge=new R,Mr=new ft;class Be{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ba,this.updateRanges=[],this.gpuType=vn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Mr.fromBufferAttribute(this,e),Mr.applyMatrix3(t),this.setXY(e,Mr.x,Mr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix4(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyNormalMatrix(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.transformDirection(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Zt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=rn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Zt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=rn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Zt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=rn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Zt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=rn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Zt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array),s=Zt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array),s=Zt(s,this.array),r=Zt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ba&&(t.usage=this.usage),t}}class sh extends Be{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class rh extends Be{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class te extends Be{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Zf=0;const Qe=new Xt,Ga=new de,ns=new R,qe=new xn,Ns=new xn,Ee=new R;class _e extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=In(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(kc(t)?rh:sh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Dt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Qe.makeRotationFromQuaternion(t),this.applyMatrix4(Qe),this}rotateX(t){return Qe.makeRotationX(t),this.applyMatrix4(Qe),this}rotateY(t){return Qe.makeRotationY(t),this.applyMatrix4(Qe),this}rotateZ(t){return Qe.makeRotationZ(t),this.applyMatrix4(Qe),this}translate(t,e,n){return Qe.makeTranslation(t,e,n),this.applyMatrix4(Qe),this}scale(t,e,n){return Qe.makeScale(t,e,n),this.applyMatrix4(Qe),this}lookAt(t){return Ga.lookAt(t),Ga.updateMatrix(),this.applyMatrix4(Ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ns).negate(),this.translate(ns.x,ns.y,ns.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new te(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,qe.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,qe.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(qe.min),this.boundingBox.expandByPoint(qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Ns.setFromBufferAttribute(a),this.morphTargetsRelative?(Ee.addVectors(qe.min,Ns.min),qe.expandByPoint(Ee),Ee.addVectors(qe.max,Ns.max),qe.expandByPoint(Ee)):(qe.expandByPoint(Ns.min),qe.expandByPoint(Ns.max))}qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ee.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ee));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ee.fromBufferAttribute(a,c),l&&(ns.fromBufferAttribute(t,c),Ee.add(ns)),s=Math.max(s,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Be(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new R,l[C]=new R;const c=new R,h=new R,d=new R,u=new ft,f=new ft,g=new ft,_=new R,m=new R;function p(C,E,M){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,M),u.fromBufferAttribute(r,C),f.fromBufferAttribute(r,E),g.fromBufferAttribute(r,M),h.sub(c),d.sub(c),f.sub(u),g.sub(u);const D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(D),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(D),a[C].add(_),a[E].add(_),a[M].add(_),l[C].add(m),l[E].add(m),l[M].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let C=0,E=v.length;C<E;++C){const M=v[C],D=M.start,z=M.count;for(let P=D,U=D+z;P<U;P+=3)p(t.getX(P+0),t.getX(P+1),t.getX(P+2))}const y=new R,x=new R,L=new R,S=new R;function T(C){L.fromBufferAttribute(s,C),S.copy(L);const E=a[C];y.copy(E),y.sub(L.multiplyScalar(L.dot(E))).normalize(),x.crossVectors(S,E);const D=x.dot(l[C])<0?-1:1;o.setXYZW(C,y.x,y.y,y.z,D)}for(let C=0,E=v.length;C<E;++C){const M=v[C],D=M.start,z=M.count;for(let P=D,U=D+z;P<U;P+=3)T(t.getX(P+0)),T(t.getX(P+1)),T(t.getX(P+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Be(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new R,r=new R,o=new R,a=new R,l=new R,c=new R,h=new R,d=new R;if(t)for(let u=0,f=t.count;u<f;u+=3){const g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new Be(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new _e,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const oh=new Xt,Mi=new _r,br=new Zn,ah=new R,Sr=new R,Er=new R,wr=new R,Va=new R,Tr=new R,lh=new R,Ar=new R;class rt extends de{constructor(t=new _e,e=new yi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Tr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(Va.fromBufferAttribute(d,t),o?Tr.addScaledVector(Va,h):Tr.addScaledVector(Va.sub(e),h))}e.add(Tr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),br.copy(n.boundingSphere),br.applyMatrix4(r),Mi.copy(t.ray).recast(t.near),!(br.containsPoint(Mi.origin)===!1&&(Mi.intersectSphere(br,ah)===null||Mi.origin.distanceToSquared(ah)>(t.far-t.near)**2))&&(oh.copy(r).invert(),Mi.copy(t.ray).applyMatrix4(oh),!(n.boundingBox!==null&&Mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Mi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=o[m.materialIndex],v=Math.max(m.start,f.start),y=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=v,L=y;x<L;x+=3){const S=a.getX(x),T=a.getX(x+1),C=a.getX(x+2);s=Cr(this,p,t,n,c,h,d,S,T,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const v=a.getX(m),y=a.getX(m+1),x=a.getX(m+2);s=Cr(this,o,t,n,c,h,d,v,y,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=o[m.materialIndex],v=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=v,L=y;x<L;x+=3){const S=x,T=x+1,C=x+2;s=Cr(this,p,t,n,c,h,d,S,T,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const v=m,y=m+1,x=m+2;s=Cr(this,o,t,n,c,h,d,v,y,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Kf(i,t,e,n,s,r,o,a){let l;if(t.side===Fe?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Pn,a),l===null)return null;Ar.copy(a),Ar.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Ar);return c<e.near||c>e.far?null:{distance:c,point:Ar.clone(),object:i}}function Cr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Sr),i.getVertexPosition(l,Er),i.getVertexPosition(c,wr);const h=Kf(i,t,e,n,Sr,Er,wr,lh);if(h){const d=new R;Je.getBarycoord(lh,Sr,Er,wr,d),s&&(h.uv=Je.getInterpolatedAttribute(s,a,l,c,d,new ft)),r&&(h.uv1=Je.getInterpolatedAttribute(r,a,l,c,d,new ft)),o&&(h.normal=Je.getInterpolatedAttribute(o,a,l,c,d,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new R,materialIndex:0};Je.getNormal(Sr,Er,wr,u.normal),h.face=u,h.barycoord=d}return h}class fe extends _e{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new te(c,3)),this.setAttribute("normal",new te(h,3)),this.setAttribute("uv",new te(d,2));function g(_,m,p,v,y,x,L,S,T,C,E){const M=x/T,D=L/C,z=x/2,P=L/2,U=S/2,G=T+1,k=C+1;let Y=0,X=0;const Q=new R;for(let dt=0;dt<k;dt++){const _t=dt*D-P;for(let Pt=0;Pt<G;Pt++){const Kt=Pt*M-z;Q[_]=Kt*v,Q[m]=_t*y,Q[p]=U,c.push(Q.x,Q.y,Q.z),Q[_]=0,Q[m]=0,Q[p]=S>0?1:-1,h.push(Q.x,Q.y,Q.z),d.push(Pt/T),d.push(1-dt/C),Y+=1}}for(let dt=0;dt<C;dt++)for(let _t=0;_t<T;_t++){const Pt=u+_t+G*dt,Kt=u+_t+G*(dt+1),q=u+(_t+1)+G*(dt+1),nt=u+(_t+1)+G*dt;l.push(Pt,Kt,nt),l.push(Kt,q,nt),X+=6}a.addGroup(f,X,E),f+=X,u+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fe(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function is(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ze(i){const t={};for(let e=0;e<i.length;e++){const n=is(i[e]);for(const s in n)t[s]=n[s]}return t}function Jf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ch(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Gt.workingColorSpace}const Wa={clone:is,merge:ze};var Qf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Bn extends xi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Qf,this.fragmentShader=tp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=is(t.uniforms),this.uniformsGroups=Jf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class hh extends de{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xt,this.projectionMatrix=new Xt,this.projectionMatrixInverse=new Xt,this.coordinateSystem=Dn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ti=new R,dh=new ft,uh=new ft;class tn extends hh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Rs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Cs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(Cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ti.x,ti.y).multiplyScalar(-t/ti.z),ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ti.x,ti.y).multiplyScalar(-t/ti.z)}getViewSize(t,e){return this.getViewBounds(t,dh,uh),e.subVectors(uh,dh)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Cs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ss=-90,rs=1;class ep extends de{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new tn(ss,rs,t,e);s.layers=this.layers,this.add(s);const r=new tn(ss,rs,t,e);r.layers=this.layers,this.add(r);const o=new tn(ss,rs,t,e);o.layers=this.layers,this.add(o);const a=new tn(ss,rs,t,e);a.layers=this.layers,this.add(a);const l=new tn(ss,rs,t,e);l.layers=this.layers,this.add(l);const c=new tn(ss,rs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===hr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class fh extends Ie{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ki,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class np extends gi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new fh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:_n}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new fe(5,5,5),r=new Bn({name:"CubemapFromEquirect",uniforms:is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Fe,blending:Xn});r.uniforms.tEquirect.value=e;const o=new rt(s,r),a=e.minFilter;return e.minFilter===ui&&(e.minFilter=_n),new ep(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Xa=new R,ip=new R,sp=new Dt;class Hn{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Xa.subVectors(n,e).cross(ip.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Xa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||sp.getNormalMatrix(t),s=this.coplanarPoint(Xa).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const bi=new Zn,Rr=new R;class $a{constructor(t=new Hn,e=new Hn,n=new Hn,s=new Hn,r=new Hn,o=new Hn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Dn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],v=s[13],y=s[14],x=s[15];if(n[0].setComponents(l-r,u-c,m-f,x-p).normalize(),n[1].setComponents(l+r,u+c,m+f,x+p).normalize(),n[2].setComponents(l+o,u+h,m+g,x+v).normalize(),n[3].setComponents(l-o,u-h,m-g,x-v).normalize(),n[4].setComponents(l-a,u-d,m-_,x-y).normalize(),e===Dn)n[5].setComponents(l+a,u+d,m+_,x+y).normalize();else if(e===hr)n[5].setComponents(a,d,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),bi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bi)}intersectsSprite(t){return bi.center.set(0,0,0),bi.radius=.7071067811865476,bi.applyMatrix4(t.matrixWorld),this.intersectsSphere(bi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Rr.x=s.normal.x>0?t.max.x:t.min.x,Rr.y=s.normal.y>0?t.max.y:t.min.y,Rr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Rr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ph(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function rp(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const _=d[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class os extends _e{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const v=p*u-o;for(let y=0;y<c;y++){const x=y*d-r;g.push(x,-v,0),_.push(0,0,1),m.push(y/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<a;v++){const y=v+c*p,x=v+c*(p+1),L=v+1+c*(p+1),S=v+1+c*p;f.push(y,x,S),f.push(x,L,S)}this.setIndex(f),this.setAttribute("position",new te(g,3)),this.setAttribute("normal",new te(_,3)),this.setAttribute("uv",new te(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new os(t.width,t.height,t.widthSegments,t.heightSegments)}}var op=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ap=`#ifdef USE_ALPHAHASH
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
#endif`,lp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,up=`#ifdef USE_AOMAP
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
#endif`,fp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pp=`#ifdef USE_BATCHING
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
#endif`,mp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_p=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,xp=`#ifdef USE_IRIDESCENCE
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
#endif`,yp=`#ifdef USE_BUMPMAP
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
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,wp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Tp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ap=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Rp=`#define PI 3.141592653589793
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
} // validated`,Pp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Lp=`vec3 transformedNormal = objectNormal;
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
#endif`,Dp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ip=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Up=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Np=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Op="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zp=`#ifdef USE_ENVMAP
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
#endif`,kp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Bp=`#ifdef USE_ENVMAP
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
#endif`,Hp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
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
#endif`,Vp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$p=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yp=`#ifdef USE_GRADIENTMAP
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
}`,qp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kp=`uniform bool receiveShadow;
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
#endif`,Jp=`#ifdef USE_ENVMAP
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
#endif`,Qp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,em=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,im=`PhysicalMaterial material;
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
#endif`,sm=`struct PhysicalMaterial {
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
}`,rm=`
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
#endif`,om=`#if defined( RE_IndirectDiffuse )
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
#endif`,am=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,um=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,mm=`#if defined( USE_POINTS_UV )
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
#endif`,gm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_m=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ym=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mm=`#ifdef USE_MORPHTARGETS
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
#endif`,bm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Em=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,wm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Am=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cm=`#ifdef USE_NORMALMAP
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
#endif`,Rm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Im=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Um=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Nm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,km=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Wm=`float getShadowMask() {
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
}`,Xm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$m=`#ifdef USE_SKINNING
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
#endif`,Ym=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qm=`#ifdef USE_SKINNING
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
#endif`,jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Zm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Km=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qm=`#ifdef USE_TRANSMISSION
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
#endif`,tg=`#ifdef USE_TRANSMISSION
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
#endif`,eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Nt={alphahash_fragment:op,alphahash_pars_fragment:ap,alphamap_fragment:lp,alphamap_pars_fragment:cp,alphatest_fragment:hp,alphatest_pars_fragment:dp,aomap_fragment:up,aomap_pars_fragment:fp,batching_pars_vertex:pp,batching_vertex:mp,begin_vertex:gp,beginnormal_vertex:_p,bsdfs:vp,iridescence_fragment:xp,bumpmap_pars_fragment:yp,clipping_planes_fragment:Mp,clipping_planes_pars_fragment:bp,clipping_planes_pars_vertex:Sp,clipping_planes_vertex:Ep,color_fragment:wp,color_pars_fragment:Tp,color_pars_vertex:Ap,color_vertex:Cp,common:Rp,cube_uv_reflection_fragment:Pp,defaultnormal_vertex:Lp,displacementmap_pars_vertex:Dp,displacementmap_vertex:Ip,emissivemap_fragment:Up,emissivemap_pars_fragment:Np,colorspace_fragment:Op,colorspace_pars_fragment:Fp,envmap_fragment:zp,envmap_common_pars_fragment:kp,envmap_pars_fragment:Bp,envmap_pars_vertex:Hp,envmap_physical_pars_fragment:Jp,envmap_vertex:Gp,fog_vertex:Vp,fog_pars_vertex:Wp,fog_fragment:Xp,fog_pars_fragment:$p,gradientmap_pars_fragment:Yp,lightmap_pars_fragment:qp,lights_lambert_fragment:jp,lights_lambert_pars_fragment:Zp,lights_pars_begin:Kp,lights_toon_fragment:Qp,lights_toon_pars_fragment:tm,lights_phong_fragment:em,lights_phong_pars_fragment:nm,lights_physical_fragment:im,lights_physical_pars_fragment:sm,lights_fragment_begin:rm,lights_fragment_maps:om,lights_fragment_end:am,logdepthbuf_fragment:lm,logdepthbuf_pars_fragment:cm,logdepthbuf_pars_vertex:hm,logdepthbuf_vertex:dm,map_fragment:um,map_pars_fragment:fm,map_particle_fragment:pm,map_particle_pars_fragment:mm,metalnessmap_fragment:gm,metalnessmap_pars_fragment:_m,morphinstance_vertex:vm,morphcolor_vertex:xm,morphnormal_vertex:ym,morphtarget_pars_vertex:Mm,morphtarget_vertex:bm,normal_fragment_begin:Sm,normal_fragment_maps:Em,normal_pars_fragment:wm,normal_pars_vertex:Tm,normal_vertex:Am,normalmap_pars_fragment:Cm,clearcoat_normal_fragment_begin:Rm,clearcoat_normal_fragment_maps:Pm,clearcoat_pars_fragment:Lm,iridescence_pars_fragment:Dm,opaque_fragment:Im,packing:Um,premultiplied_alpha_fragment:Nm,project_vertex:Om,dithering_fragment:Fm,dithering_pars_fragment:zm,roughnessmap_fragment:km,roughnessmap_pars_fragment:Bm,shadowmap_pars_fragment:Hm,shadowmap_pars_vertex:Gm,shadowmap_vertex:Vm,shadowmask_pars_fragment:Wm,skinbase_vertex:Xm,skinning_pars_vertex:$m,skinning_vertex:Ym,skinnormal_vertex:qm,specularmap_fragment:jm,specularmap_pars_fragment:Zm,tonemapping_fragment:Km,tonemapping_pars_fragment:Jm,transmission_fragment:Qm,transmission_pars_fragment:tg,uv_pars_fragment:eg,uv_pars_vertex:ng,uv_vertex:ig,worldpos_vertex:sg,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
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
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
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
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
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
}`,depth_frag:`#if DEPTH_PACKING == 3200
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
}`,distanceRGBA_vert:`#define DISTANCE
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
}`,distanceRGBA_frag:`#define DISTANCE
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
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
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
}`,linedashed_frag:`uniform vec3 diffuse;
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
}`,meshbasic_vert:`#include <common>
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
}`,meshbasic_frag:`uniform vec3 diffuse;
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
}`,meshlambert_vert:`#define LAMBERT
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
}`,meshlambert_frag:`#define LAMBERT
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
}`,meshmatcap_vert:`#define MATCAP
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
}`,meshmatcap_frag:`#define MATCAP
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
}`,meshnormal_vert:`#define NORMAL
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
}`,meshnormal_frag:`#define NORMAL
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
}`,meshphong_vert:`#define PHONG
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
}`,meshphong_frag:`#define PHONG
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
}`,meshphysical_vert:`#define STANDARD
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
}`,meshphysical_frag:`#define STANDARD
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
}`,meshtoon_vert:`#define TOON
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
}`,meshtoon_frag:`#define TOON
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
}`,points_vert:`uniform float size;
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
}`,points_frag:`uniform vec3 diffuse;
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
}`,shadow_vert:`#include <common>
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
}`,shadow_frag:`uniform vec3 color;
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
}`,sprite_vert:`uniform float rotation;
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
}`,sprite_frag:`uniform vec3 diffuse;
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
}`},it={common:{diffuse:{value:new zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Dt},alphaMap:{value:null},alphaMapTransform:{value:new Dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Dt}},envmap:{envMap:{value:null},envMapRotation:{value:new Dt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Dt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Dt},alphaTest:{value:0},uvTransform:{value:new Dt}},sprite:{diffuse:{value:new zt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Dt},alphaMap:{value:null},alphaMapTransform:{value:new Dt},alphaTest:{value:0}}},He={basic:{uniforms:ze([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:ze([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new zt(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:ze([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new zt(0)},specular:{value:new zt(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:ze([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:ze([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new zt(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:ze([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:ze([it.points,it.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:ze([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:ze([it.common,it.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:ze([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:ze([it.sprite,it.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Dt}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:ze([it.common,it.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:ze([it.lights,it.fog,{color:{value:new zt(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};He.physical={uniforms:ze([He.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Dt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Dt},sheen:{value:0},sheenColor:{value:new zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Dt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Dt},attenuationDistance:{value:0},attenuationColor:{value:new zt(0)},specularColor:{value:new zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Dt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Dt}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};const Pr={r:0,b:0,g:0},Si=new ln,rg=new Xt;function og(i,t,e,n,s,r,o){const a=new zt(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function g(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?e:t).get(y)),y}function _(v){let y=!1;const x=g(v);x===null?p(a,l):x&&x.isColor&&(p(x,1),y=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,y){const x=g(y);x&&(x.isCubeTexture||x.mapping===nr)?(h===void 0&&(h=new rt(new fe(1,1,1),new Bn({name:"BackgroundCubeMaterial",uniforms:is(He.backgroundCube.uniforms),vertexShader:He.backgroundCube.vertexShader,fragmentShader:He.backgroundCube.fragmentShader,side:Fe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Si.copy(y.backgroundRotation),Si.x*=-1,Si.y*=-1,Si.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Si.y*=-1,Si.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(rg.makeRotationFromEuler(Si)),h.material.toneMapped=Gt.getTransfer(x.colorSpace)!==Qt,(d!==x||u!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=x,u=x.version,f=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new rt(new os(2,2),new Bn({name:"BackgroundMaterial",uniforms:is(He.background.uniforms),vertexShader:He.background.vertexShader,fragmentShader:He.background.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Gt.getTransfer(x.colorSpace)!==Qt,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||u!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=x,u=x.version,f=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,y){v.getRGB(Pr,ch(i)),n.buffers.color.setClear(Pr.r,Pr.g,Pr.b,y,o)}return{getClearColor:function(){return a},setClearColor:function(v,y=1){a.set(v),l=y,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(a,l)},render:_,addToRenderList:m}}function ag(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(M,D,z,P,U){let G=!1;const k=d(P,z,D);r!==k&&(r=k,c(r.object)),G=f(M,P,z,U),G&&g(M,P,z,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,x(M,D,z,P),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function d(M,D,z){const P=z.wireframe===!0;let U=n[M.id];U===void 0&&(U={},n[M.id]=U);let G=U[D.id];G===void 0&&(G={},U[D.id]=G);let k=G[P];return k===void 0&&(k=u(l()),G[P]=k),k}function u(M){const D=[],z=[],P=[];for(let U=0;U<e;U++)D[U]=0,z[U]=0,P[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:z,attributeDivisors:P,object:M,attributes:{},index:null}}function f(M,D,z,P){const U=r.attributes,G=D.attributes;let k=0;const Y=z.getAttributes();for(const X in Y)if(Y[X].location>=0){const dt=U[X];let _t=G[X];if(_t===void 0&&(X==="instanceMatrix"&&M.instanceMatrix&&(_t=M.instanceMatrix),X==="instanceColor"&&M.instanceColor&&(_t=M.instanceColor)),dt===void 0||dt.attribute!==_t||_t&&dt.data!==_t.data)return!0;k++}return r.attributesNum!==k||r.index!==P}function g(M,D,z,P){const U={},G=D.attributes;let k=0;const Y=z.getAttributes();for(const X in Y)if(Y[X].location>=0){let dt=G[X];dt===void 0&&(X==="instanceMatrix"&&M.instanceMatrix&&(dt=M.instanceMatrix),X==="instanceColor"&&M.instanceColor&&(dt=M.instanceColor));const _t={};_t.attribute=dt,dt&&dt.data&&(_t.data=dt.data),U[X]=_t,k++}r.attributes=U,r.attributesNum=k,r.index=P}function _(){const M=r.newAttributes;for(let D=0,z=M.length;D<z;D++)M[D]=0}function m(M){p(M,0)}function p(M,D){const z=r.newAttributes,P=r.enabledAttributes,U=r.attributeDivisors;z[M]=1,P[M]===0&&(i.enableVertexAttribArray(M),P[M]=1),U[M]!==D&&(i.vertexAttribDivisor(M,D),U[M]=D)}function v(){const M=r.newAttributes,D=r.enabledAttributes;for(let z=0,P=D.length;z<P;z++)D[z]!==M[z]&&(i.disableVertexAttribArray(z),D[z]=0)}function y(M,D,z,P,U,G,k){k===!0?i.vertexAttribIPointer(M,D,z,U,G):i.vertexAttribPointer(M,D,z,P,U,G)}function x(M,D,z,P){_();const U=P.attributes,G=z.getAttributes(),k=D.defaultAttributeValues;for(const Y in G){const X=G[Y];if(X.location>=0){let Q=U[Y];if(Q===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor)),Q!==void 0){const dt=Q.normalized,_t=Q.itemSize,Pt=t.get(Q);if(Pt===void 0)continue;const Kt=Pt.buffer,q=Pt.type,nt=Pt.bytesPerElement,Mt=q===i.INT||q===i.UNSIGNED_INT||Q.gpuType===Vo;if(Q.isInterleavedBufferAttribute){const ot=Q.data,At=ot.stride,Lt=Q.offset;if(ot.isInstancedInterleavedBuffer){for(let Ft=0;Ft<X.locationSize;Ft++)p(X.location+Ft,ot.meshPerAttribute);M.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Ft=0;Ft<X.locationSize;Ft++)m(X.location+Ft);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let Ft=0;Ft<X.locationSize;Ft++)y(X.location+Ft,_t/X.locationSize,q,dt,At*nt,(Lt+_t/X.locationSize*Ft)*nt,Mt)}else{if(Q.isInstancedBufferAttribute){for(let ot=0;ot<X.locationSize;ot++)p(X.location+ot,Q.meshPerAttribute);M.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ot=0;ot<X.locationSize;ot++)m(X.location+ot);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let ot=0;ot<X.locationSize;ot++)y(X.location+ot,_t/X.locationSize,q,dt,_t*nt,_t/X.locationSize*ot*nt,Mt)}}else if(k!==void 0){const dt=k[Y];if(dt!==void 0)switch(dt.length){case 2:i.vertexAttrib2fv(X.location,dt);break;case 3:i.vertexAttrib3fv(X.location,dt);break;case 4:i.vertexAttrib4fv(X.location,dt);break;default:i.vertexAttrib1fv(X.location,dt)}}}}v()}function L(){C();for(const M in n){const D=n[M];for(const z in D){const P=D[z];for(const U in P)h(P[U].object),delete P[U];delete D[z]}delete n[M]}}function S(M){if(n[M.id]===void 0)return;const D=n[M.id];for(const z in D){const P=D[z];for(const U in P)h(P[U].object),delete P[U];delete D[z]}delete n[M.id]}function T(M){for(const D in n){const z=n[D];if(z[M.id]===void 0)continue;const P=z[M.id];for(const U in P)h(P[U].object),delete P[U];delete z[M.id]}}function C(){E(),o=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:E,dispose:L,releaseStatesOfGeometry:S,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function lg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function a(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];e.update(f,n,1)}function l(c,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*u[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function cg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){return!(T!==sn&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const C=T===As&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Ln&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==vn&&!C)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:L,maxSamples:S}}function hg(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Hn,a=new Dt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const v=r?0:n,y=v*4;let x=p.clippingState||null;l.value=x,x=h(g,u,y,f);for(let L=0;L!==y;++L)x[L]=e[L];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,v=u.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,x=f;y!==_;++y,x+=4)o.copy(d[y]).applyMatrix4(v,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function dg(i){let t=new WeakMap;function e(o,a){return a===zo?o.mapping=ki:a===ko&&(o.mapping=Bi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===zo||a===ko)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new np(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Ya extends hh{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const as=4,mh=[.125,.215,.35,.446,.526,.582],Ei=20,qa=new Ya,gh=new zt;let ja=null,Za=0,Ka=0,Ja=!1;const wi=(1+Math.sqrt(5))/2,ls=1/wi,_h=[new R(-wi,ls,0),new R(wi,ls,0),new R(-ls,0,wi),new R(ls,0,wi),new R(0,wi,-ls),new R(0,wi,ls),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class vh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ja=this._renderer.getRenderTarget(),Za=this._renderer.getActiveCubeFace(),Ka=this._renderer.getActiveMipmapLevel(),Ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ja,Za,Ka),this._renderer.xr.enabled=Ja,t.scissorTest=!1,Lr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ki||t.mapping===Bi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ja=this._renderer.getRenderTarget(),Za=this._renderer.getActiveCubeFace(),Ka=this._renderer.getActiveMipmapLevel(),Ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:_n,minFilter:_n,generateMipmaps:!1,type:As,format:sn,colorSpace:Wi,depthBuffer:!1},s=xh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ug(r)),this._blurMaterial=fg(r,t,e)}return s}_compileMaterial(t){const e=new rt(this._lodPlanes[0],t);this._renderer.compile(e,qa)}_sceneToCubeUV(t,e,n,s){const a=new tn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(gh),h.toneMapping=$n,h.autoClear=!1;const f=new yi({name:"PMREM.Background",side:Fe,depthWrite:!1,depthTest:!1}),g=new rt(new fe,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(gh),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):v===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const y=this._cubeSize;Lr(s,v*y,p>2?y:0,y,y),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ki||t.mapping===Bi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new rt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Lr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,qa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=_h[(s-r-1)%_h.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new rt(this._lodPlanes[s],c),u=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ei-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Ei;m>Ei&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ei}`);const p=[];let v=0;for(let T=0;T<Ei;++T){const C=T/_,E=Math.exp(-C*C/2);p.push(E),T===0?v+=E:T<m&&(v+=2*E)}for(let T=0;T<p.length;T++)p[T]=p[T]/v;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:y}=this;u.dTheta.value=g,u.mipInt.value=y-n;const x=this._sizeLods[s],L=3*x*(s>y-as?s-y+as:0),S=4*(this._cubeSize-x);Lr(e,L,S,3*x,2*x),l.setRenderTarget(e),l.render(d,qa)}}function ug(i){const t=[],e=[],n=[];let s=i;const r=i-as+1+mh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-as?l=mh[o-i+as-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*f),y=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let S=0;S<f;S++){const T=S%3*2/3-1,C=S>2?0:-1,E=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];v.set(E,_*g*S),y.set(u,m*g*S);const M=[S,S,S,S,S,S];x.set(M,p*g*S)}const L=new _e;L.setAttribute("position",new Be(v,_)),L.setAttribute("uv",new Be(y,m)),L.setAttribute("faceIndex",new Be(x,p)),t.push(L),s>as&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function xh(i,t,e){const n=new gi(i,t,e);return n.texture.mapping=nr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Lr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function fg(i,t,e){const n=new Float32Array(Ei),s=new R(0,1,0);return new Bn({name:"SphericalGaussianBlur",defines:{n:Ei,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function yh(){return new Bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Mh(){return new Bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Qa(){return`

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
	`}function pg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===zo||l===ko,h=l===ki||l===Bi;if(c||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new vh(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new vh(i)),d=c?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function mg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ls("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function gg(i,t,e,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}u.removeEventListener("dispose",o),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)t.update(u[g],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,g=d.attributes.position;let _=0;if(f!==null){const v=f.array;_=f.version;for(let y=0,x=v.length;y<x;y+=3){const L=v[y+0],S=v[y+1],T=v[y+2];u.push(L,S,S,T,T,L)}}else if(g!==void 0){const v=g.array;_=g.version;for(let y=0,x=v.length/3-1;y<x;y+=3){const L=y+0,S=y+1,T=y+2;u.push(L,S,S,T,T,L)}}else return;const m=new(kc(u)?rh:sh)(u,1);m.version=_;const p=r.get(d);p&&t.remove(p),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function _g(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,f){i.drawElements(n,f,r,u*o),e.update(f,n,1)}function c(u,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,u*o,g),e.update(f,n,g))}function h(u,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function d(u,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)c(u[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,_,0,g);let p=0;for(let v=0;v<g;v++)p+=f[v]*_[v];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function vg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function xg(i,t,e){const n=new WeakMap,s=new ne;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let E=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let y=0;f===!0&&(y=1),g===!0&&(y=2),_===!0&&(y=3);let x=a.attributes.position.count*y,L=1;x>t.maxTextureSize&&(L=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const S=new Float32Array(x*L*4*d),T=new Yc(S,x,L,d);T.type=vn,T.needsUpdate=!0;const C=y*4;for(let M=0;M<d;M++){const D=m[M],z=p[M],P=v[M],U=x*L*4*M;for(let G=0;G<D.count;G++){const k=G*C;f===!0&&(s.fromBufferAttribute(D,G),S[U+k+0]=s.x,S[U+k+1]=s.y,S[U+k+2]=s.z,S[U+k+3]=0),g===!0&&(s.fromBufferAttribute(z,G),S[U+k+4]=s.x,S[U+k+5]=s.y,S[U+k+6]=s.z,S[U+k+7]=0),_===!0&&(s.fromBufferAttribute(P,G),S[U+k+8]=s.x,S[U+k+9]=s.y,S[U+k+10]=s.z,S[U+k+11]=P.itemSize===4?s.w:1)}}u={count:d,texture:T,size:new ft(x,L)},n.set(a,u),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function yg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class bh extends Ie{constructor(t,e,n,s,r,o,a,l,c,h=Gi){if(h!==Gi&&h!==Vi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Gi&&(n=fi),n===void 0&&h===Vi&&(n=Hi),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Xe,this.minFilter=l!==void 0?l:Xe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Sh=new Ie,Eh=new bh(1,1),wh=new Yc,Th=new Hf,Ah=new fh,Ch=[],Rh=[],Ph=new Float32Array(16),Lh=new Float32Array(9),Dh=new Float32Array(4);function cs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Ch[s];if(r===void 0&&(r=new Float32Array(s),Ch[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function xe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ye(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Dr(i,t){let e=Rh[t];e===void 0&&(e=new Int32Array(t),Rh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Mg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function bg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2fv(this.addr,t),ye(e,t)}}function Sg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(xe(e,t))return;i.uniform3fv(this.addr,t),ye(e,t)}}function Eg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4fv(this.addr,t),ye(e,t)}}function wg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ye(e,t)}else{if(xe(e,n))return;Dh.set(n),i.uniformMatrix2fv(this.addr,!1,Dh),ye(e,n)}}function Tg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ye(e,t)}else{if(xe(e,n))return;Lh.set(n),i.uniformMatrix3fv(this.addr,!1,Lh),ye(e,n)}}function Ag(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ye(e,t)}else{if(xe(e,n))return;Ph.set(n),i.uniformMatrix4fv(this.addr,!1,Ph),ye(e,n)}}function Cg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Rg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2iv(this.addr,t),ye(e,t)}}function Pg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;i.uniform3iv(this.addr,t),ye(e,t)}}function Lg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4iv(this.addr,t),ye(e,t)}}function Dg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ig(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2uiv(this.addr,t),ye(e,t)}}function Ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;i.uniform3uiv(this.addr,t),ye(e,t)}}function Ng(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4uiv(this.addr,t),ye(e,t)}}function Og(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Eh.compareFunction=Nc,r=Eh):r=Sh,e.setTexture2D(t||r,s)}function Fg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Th,s)}function zg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ah,s)}function kg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||wh,s)}function Bg(i){switch(i){case 5126:return Mg;case 35664:return bg;case 35665:return Sg;case 35666:return Eg;case 35674:return wg;case 35675:return Tg;case 35676:return Ag;case 5124:case 35670:return Cg;case 35667:case 35671:return Rg;case 35668:case 35672:return Pg;case 35669:case 35673:return Lg;case 5125:return Dg;case 36294:return Ig;case 36295:return Ug;case 36296:return Ng;case 35678:case 36198:case 36298:case 36306:case 35682:return Og;case 35679:case 36299:case 36307:return Fg;case 35680:case 36300:case 36308:case 36293:return zg;case 36289:case 36303:case 36311:case 36292:return kg}}function Hg(i,t){i.uniform1fv(this.addr,t)}function Gg(i,t){const e=cs(t,this.size,2);i.uniform2fv(this.addr,e)}function Vg(i,t){const e=cs(t,this.size,3);i.uniform3fv(this.addr,e)}function Wg(i,t){const e=cs(t,this.size,4);i.uniform4fv(this.addr,e)}function Xg(i,t){const e=cs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function $g(i,t){const e=cs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Yg(i,t){const e=cs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function qg(i,t){i.uniform1iv(this.addr,t)}function jg(i,t){i.uniform2iv(this.addr,t)}function Zg(i,t){i.uniform3iv(this.addr,t)}function Kg(i,t){i.uniform4iv(this.addr,t)}function Jg(i,t){i.uniform1uiv(this.addr,t)}function Qg(i,t){i.uniform2uiv(this.addr,t)}function t_(i,t){i.uniform3uiv(this.addr,t)}function e_(i,t){i.uniform4uiv(this.addr,t)}function n_(i,t,e){const n=this.cache,s=t.length,r=Dr(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),ye(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Sh,r[o])}function i_(i,t,e){const n=this.cache,s=t.length,r=Dr(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),ye(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Th,r[o])}function s_(i,t,e){const n=this.cache,s=t.length,r=Dr(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),ye(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ah,r[o])}function r_(i,t,e){const n=this.cache,s=t.length,r=Dr(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),ye(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||wh,r[o])}function o_(i){switch(i){case 5126:return Hg;case 35664:return Gg;case 35665:return Vg;case 35666:return Wg;case 35674:return Xg;case 35675:return $g;case 35676:return Yg;case 5124:case 35670:return qg;case 35667:case 35671:return jg;case 35668:case 35672:return Zg;case 35669:case 35673:return Kg;case 5125:return Jg;case 36294:return Qg;case 36295:return t_;case 36296:return e_;case 35678:case 36198:case 36298:case 36306:case 35682:return n_;case 35679:case 36299:case 36307:return i_;case 35680:case 36300:case 36308:case 36293:return s_;case 36289:case 36303:case 36311:case 36292:return r_}}class a_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Bg(e.type)}}class l_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=o_(e.type)}}class c_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const tl=/(\w+)(\])?(\[|\.)?/g;function Ih(i,t){i.seq.push(t),i.map[t.id]=t}function h_(i,t,e){const n=i.name,s=n.length;for(tl.lastIndex=0;;){const r=tl.exec(n),o=tl.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Ih(e,c===void 0?new a_(a,i,t):new l_(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new c_(a),Ih(e,d)),e=d}}}class Ir{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);h_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Uh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const d_=37297;let u_=0;function f_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Nh=new Dt;function p_(i){Gt._getMatrix(Nh,Gt.workingColorSpace,i);const t=`mat3( ${Nh.elements.map(e=>e.toFixed(4))} )`;switch(Gt.getTransfer(i)){case cr:return[t,"LinearTransferOETF"];case Qt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Oh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+f_(i.getShaderSource(t),o)}else return s}function m_(i,t){const e=p_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function g_(i,t){let e;switch(t){case Ju:e="Linear";break;case Qu:e="Reinhard";break;case tf:e="Cineon";break;case ef:e="ACESFilmic";break;case sf:e="AgX";break;case rf:e="Neutral";break;case nf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ur=new R;function __(){Gt.getLuminanceCoefficients(Ur);const i=Ur.x.toFixed(4),t=Ur.y.toFixed(4),e=Ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function v_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Os).join(`
`)}function x_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function y_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Os(i){return i!==""}function Fh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function zh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const M_=/^[ \t]*#include +<([\w\d./]+)>/gm;function el(i){return i.replace(M_,S_)}const b_=new Map;function S_(i,t){let e=Nt[t];if(e===void 0){const n=b_.get(t);if(n!==void 0)e=Nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return el(e)}const E_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kh(i){return i.replace(E_,w_)}function w_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bh(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function T_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===xc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Lu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Rn&&(t="SHADOWMAP_TYPE_VSM"),t}function A_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ki:case Bi:t="ENVMAP_TYPE_CUBE";break;case nr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function C_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Bi:t="ENVMAP_MODE_REFRACTION";break}return t}function R_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Fo:t="ENVMAP_BLENDING_MULTIPLY";break;case Zu:t="ENVMAP_BLENDING_MIX";break;case Ku:t="ENVMAP_BLENDING_ADD";break}return t}function P_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function L_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=T_(e),c=A_(e),h=C_(e),d=R_(e),u=P_(e),f=v_(e),g=x_(r),_=s.createProgram();let m,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Os).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Os).join(`
`),p.length>0&&(p+=`
`)):(m=[Bh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Os).join(`
`),p=[Bh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==$n?"#define TONE_MAPPING":"",e.toneMapping!==$n?Nt.tonemapping_pars_fragment:"",e.toneMapping!==$n?g_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,m_("linearToOutputTexel",e.outputColorSpace),__(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Os).join(`
`)),o=el(o),o=Fh(o,e),o=zh(o,e),a=el(a),a=Fh(a,e),a=zh(a,e),o=kh(o),a=kh(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Fc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Fc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=v+m+o,x=v+p+a,L=Uh(s,s.VERTEX_SHADER,y),S=Uh(s,s.FRAGMENT_SHADER,x);s.attachShader(_,L),s.attachShader(_,S),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function T(D){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(_).trim(),P=s.getShaderInfoLog(L).trim(),U=s.getShaderInfoLog(S).trim();let G=!0,k=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,S);else{const Y=Oh(s,L,"vertex"),X=Oh(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+z+`
`+Y+`
`+X)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(P===""||U==="")&&(k=!1);k&&(D.diagnostics={runnable:G,programLog:z,vertexShader:{log:P,prefix:m},fragmentShader:{log:U,prefix:p}})}s.deleteShader(L),s.deleteShader(S),C=new Ir(s,_),E=y_(s,_)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,d_)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=u_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=S,this}let D_=0;class I_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new U_(t),e.set(t,n)),n}}class U_{constructor(t){this.id=D_++,this.code=t,this.usedTimes=0}}function N_(i,t,e,n,s,r,o){const a=new Da,l=new I_,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,M,D,z,P){const U=z.fog,G=P.geometry,k=E.isMeshStandardMaterial?z.environment:null,Y=(E.isMeshStandardMaterial?e:t).get(E.envMap||k),X=Y&&Y.mapping===nr?Y.image.height:null,Q=g[E.type];E.precision!==null&&(f=s.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const dt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,_t=dt!==void 0?dt.length:0;let Pt=0;G.morphAttributes.position!==void 0&&(Pt=1),G.morphAttributes.normal!==void 0&&(Pt=2),G.morphAttributes.color!==void 0&&(Pt=3);let Kt,q,nt,Mt;if(Q){const Jt=He[Q];Kt=Jt.vertexShader,q=Jt.fragmentShader}else Kt=E.vertexShader,q=E.fragmentShader,l.update(E),nt=l.getVertexShaderID(E),Mt=l.getFragmentShaderID(E);const ot=i.getRenderTarget(),At=i.state.buffers.depth.getReversed(),Lt=P.isInstancedMesh===!0,Ft=P.isBatchedMesh===!0,he=!!E.map,Vt=!!E.matcap,pe=!!Y,F=!!E.aoMap,en=!!E.lightMap,kt=!!E.bumpMap,Bt=!!E.normalMap,wt=!!E.displacementMap,oe=!!E.emissiveMap,Et=!!E.metalnessMap,A=!!E.roughnessMap,b=E.anisotropy>0,B=E.clearcoat>0,Z=E.dispersion>0,J=E.iridescence>0,j=E.sheen>0,bt=E.transmission>0,at=b&&!!E.anisotropyMap,pt=B&&!!E.clearcoatMap,Wt=B&&!!E.clearcoatNormalMap,tt=B&&!!E.clearcoatRoughnessMap,mt=J&&!!E.iridescenceMap,Tt=J&&!!E.iridescenceThicknessMap,Ct=j&&!!E.sheenColorMap,gt=j&&!!E.sheenRoughnessMap,Ht=!!E.specularMap,Ot=!!E.specularColorMap,se=!!E.specularIntensityMap,I=bt&&!!E.transmissionMap,st=bt&&!!E.thicknessMap,$=!!E.gradientMap,K=!!E.alphaMap,ut=E.alphaTest>0,ct=!!E.alphaHash,It=!!E.extensions;let ue=$n;E.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(ue=i.toneMapping);const Oe={shaderID:Q,shaderType:E.type,shaderName:E.name,vertexShader:Kt,fragmentShader:q,defines:E.defines,customVertexShaderID:nt,customFragmentShaderID:Mt,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Ft,batchingColor:Ft&&P._colorsTexture!==null,instancing:Lt,instancingColor:Lt&&P.instanceColor!==null,instancingMorph:Lt&&P.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:Wi,alphaToCoverage:!!E.alphaToCoverage,map:he,matcap:Vt,envMap:pe,envMapMode:pe&&Y.mapping,envMapCubeUVHeight:X,aoMap:F,lightMap:en,bumpMap:kt,normalMap:Bt,displacementMap:u&&wt,emissiveMap:oe,normalMapObjectSpace:Bt&&E.normalMapType===cf,normalMapTangentSpace:Bt&&E.normalMapType===Ic,metalnessMap:Et,roughnessMap:A,anisotropy:b,anisotropyMap:at,clearcoat:B,clearcoatMap:pt,clearcoatNormalMap:Wt,clearcoatRoughnessMap:tt,dispersion:Z,iridescence:J,iridescenceMap:mt,iridescenceThicknessMap:Tt,sheen:j,sheenColorMap:Ct,sheenRoughnessMap:gt,specularMap:Ht,specularColorMap:Ot,specularIntensityMap:se,transmission:bt,transmissionMap:I,thicknessMap:st,gradientMap:$,opaque:E.transparent===!1&&E.blending===Fi&&E.alphaToCoverage===!1,alphaMap:K,alphaTest:ut,alphaHash:ct,combine:E.combine,mapUv:he&&_(E.map.channel),aoMapUv:F&&_(E.aoMap.channel),lightMapUv:en&&_(E.lightMap.channel),bumpMapUv:kt&&_(E.bumpMap.channel),normalMapUv:Bt&&_(E.normalMap.channel),displacementMapUv:wt&&_(E.displacementMap.channel),emissiveMapUv:oe&&_(E.emissiveMap.channel),metalnessMapUv:Et&&_(E.metalnessMap.channel),roughnessMapUv:A&&_(E.roughnessMap.channel),anisotropyMapUv:at&&_(E.anisotropyMap.channel),clearcoatMapUv:pt&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:Wt&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:tt&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:mt&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:Tt&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Ct&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:gt&&_(E.sheenRoughnessMap.channel),specularMapUv:Ht&&_(E.specularMap.channel),specularColorMapUv:Ot&&_(E.specularColorMap.channel),specularIntensityMapUv:se&&_(E.specularIntensityMap.channel),transmissionMapUv:I&&_(E.transmissionMap.channel),thicknessMapUv:st&&_(E.thicknessMap.channel),alphaMapUv:K&&_(E.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Bt||b),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!G.attributes.uv&&(he||K),fog:!!U,useFog:E.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:At,skinning:P.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:_t,morphTextureStride:Pt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:ue,decodeVideoTexture:he&&E.map.isVideoTexture===!0&&Gt.getTransfer(E.map.colorSpace)===Qt,decodeVideoTextureEmissive:oe&&E.emissiveMap.isVideoTexture===!0&&Gt.getTransfer(E.emissiveMap.colorSpace)===Qt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===gn,flipSided:E.side===Fe,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:It&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(It&&E.extensions.multiDraw===!0||Ft)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Oe.vertexUv1s=c.has(1),Oe.vertexUv2s=c.has(2),Oe.vertexUv3s=c.has(3),c.clear(),Oe}function p(E){const M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(const D in E.defines)M.push(D),M.push(E.defines[D]);return E.isRawShaderMaterial===!1&&(v(M,E),y(M,E),M.push(i.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function v(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function y(E,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),E.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),E.push(a.mask)}function x(E){const M=g[E.type];let D;if(M){const z=He[M];D=Wa.clone(z.uniforms)}else D=E.uniforms;return D}function L(E,M){let D;for(let z=0,P=h.length;z<P;z++){const U=h[z];if(U.cacheKey===M){D=U,++D.usedTimes;break}}return D===void 0&&(D=new L_(i,M,E,r),h.push(D)),D}function S(E){if(--E.usedTimes===0){const M=h.indexOf(E);h[M]=h[h.length-1],h.pop(),E.destroy()}}function T(E){l.remove(E)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:L,releaseProgram:S,releaseShaderCache:T,programs:h,dispose:C}}function O_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function F_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Hh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Gh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,u,f,g,_,m){let p=i[t];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},i[t]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=m),t++,p}function a(d,u,f,g,_,m){const p=o(d,u,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(d,u,f,g,_,m){const p=o(d,u,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(d,u){e.length>1&&e.sort(d||F_),n.length>1&&n.sort(u||Hh),s.length>1&&s.sort(u||Hh)}function h(){for(let d=t,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function z_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Gh,i.set(n,[o])):s>=r.length?(o=new Gh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function k_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new zt};break;case"SpotLight":e={position:new R,direction:new R,color:new zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new zt,groundColor:new zt};break;case"RectAreaLight":e={color:new zt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function B_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let H_=0;function G_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function V_(i){const t=new k_,e=B_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const s=new R,r=new Xt,o=new Xt;function a(c){let h=0,d=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,v=0,y=0,x=0,L=0,S=0,T=0;c.sort(G_);for(let E=0,M=c.length;E<M;E++){const D=c[E],z=D.color,P=D.intensity,U=D.distance,G=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=z.r*P,d+=z.g*P,u+=z.b*P;else if(D.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(D.sh.coefficients[k],P);T++}else if(D.isDirectionalLight){const k=t.get(D);if(k.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const Y=D.shadow,X=e.get(D);X.shadowIntensity=Y.intensity,X.shadowBias=Y.bias,X.shadowNormalBias=Y.normalBias,X.shadowRadius=Y.radius,X.shadowMapSize=Y.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=G,n.directionalShadowMatrix[f]=D.shadow.matrix,v++}n.directional[f]=k,f++}else if(D.isSpotLight){const k=t.get(D);k.position.setFromMatrixPosition(D.matrixWorld),k.color.copy(z).multiplyScalar(P),k.distance=U,k.coneCos=Math.cos(D.angle),k.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),k.decay=D.decay,n.spot[_]=k;const Y=D.shadow;if(D.map&&(n.spotLightMap[L]=D.map,L++,Y.updateMatrices(D),D.castShadow&&S++),n.spotLightMatrix[_]=Y.matrix,D.castShadow){const X=e.get(D);X.shadowIntensity=Y.intensity,X.shadowBias=Y.bias,X.shadowNormalBias=Y.normalBias,X.shadowRadius=Y.radius,X.shadowMapSize=Y.mapSize,n.spotShadow[_]=X,n.spotShadowMap[_]=G,x++}_++}else if(D.isRectAreaLight){const k=t.get(D);k.color.copy(z).multiplyScalar(P),k.halfWidth.set(D.width*.5,0,0),k.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=k,m++}else if(D.isPointLight){const k=t.get(D);if(k.color.copy(D.color).multiplyScalar(D.intensity),k.distance=D.distance,k.decay=D.decay,D.castShadow){const Y=D.shadow,X=e.get(D);X.shadowIntensity=Y.intensity,X.shadowBias=Y.bias,X.shadowNormalBias=Y.normalBias,X.shadowRadius=Y.radius,X.shadowMapSize=Y.mapSize,X.shadowCameraNear=Y.camera.near,X.shadowCameraFar=Y.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=G,n.pointShadowMatrix[g]=D.shadow.matrix,y++}n.point[g]=k,g++}else if(D.isHemisphereLight){const k=t.get(D);k.skyColor.copy(D.color).multiplyScalar(P),k.groundColor.copy(D.groundColor).multiplyScalar(P),n.hemi[p]=k,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=it.LTC_FLOAT_1,n.rectAreaLTC2=it.LTC_FLOAT_2):(n.rectAreaLTC1=it.LTC_HALF_1,n.rectAreaLTC2=it.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==v||C.numPointShadows!==y||C.numSpotShadows!==x||C.numSpotMaps!==L||C.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=x+L-S,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=T,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=v,C.numPointShadows=y,C.numSpotShadows=x,C.numSpotMaps=L,C.numLightProbes=T,n.version=H_++)}function l(c,h){let d=0,u=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){const y=c[p];if(y.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),d++}else if(y.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const x=n.point[u];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),u++}else if(y.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Vh(i){const t=new V_(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function W_(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Vh(i),t.set(s,[a])):r>=o.length?(a=new Vh(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class X_ extends xi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class $_ extends xi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Y_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,q_=`uniform sampler2D shadow_pass;
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
}`;function j_(i,t,e){let n=new $a;const s=new ft,r=new ft,o=new ne,a=new X_({depthPacking:lf}),l=new $_,c={},h=e.maxTextureSize,d={[Pn]:Fe,[Fe]:Pn,[gn]:gn},u=new Bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Y_,fragmentShader:q_}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new _e;g.setAttribute("position",new Be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new rt(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xc;let p=this.type;this.render=function(S,T,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const E=i.getRenderTarget(),M=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),z=i.state;z.setBlending(Xn),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const P=p!==Rn&&this.type===Rn,U=p===Rn&&this.type!==Rn;for(let G=0,k=S.length;G<k;G++){const Y=S[G],X=Y.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const Q=X.getFrameExtents();if(s.multiply(Q),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,X.mapSize.y=r.y)),X.map===null||P===!0||U===!0){const _t=this.type!==Rn?{minFilter:Xe,magFilter:Xe}:{};X.map!==null&&X.map.dispose(),X.map=new gi(s.x,s.y,_t),X.map.texture.name=Y.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const dt=X.getViewportCount();for(let _t=0;_t<dt;_t++){const Pt=X.getViewport(_t);o.set(r.x*Pt.x,r.y*Pt.y,r.x*Pt.z,r.y*Pt.w),z.viewport(o),X.updateMatrices(Y,_t),n=X.getFrustum(),x(T,C,X.camera,Y,this.type)}X.isPointLightShadow!==!0&&this.type===Rn&&v(X,C),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(E,M,D)};function v(S,T){const C=t.update(_);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new gi(s.x,s.y)),u.uniforms.shadow_pass.value=S.map.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(T,null,C,u,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(T,null,C,f,_,null)}function y(S,T,C,E){let M=null;const D=C.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(D!==void 0)M=D;else if(M=C.isPointLight===!0?l:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const z=M.uuid,P=T.uuid;let U=c[z];U===void 0&&(U={},c[z]=U);let G=U[P];G===void 0&&(G=M.clone(),U[P]=G,T.addEventListener("dispose",L)),M=G}if(M.visible=T.visible,M.wireframe=T.wireframe,E===Rn?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:d[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const z=i.properties.get(M);z.light=C}return M}function x(S,T,C,E,M){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Rn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,S.matrixWorld);const P=t.update(S),U=S.material;if(Array.isArray(U)){const G=P.groups;for(let k=0,Y=G.length;k<Y;k++){const X=G[k],Q=U[X.materialIndex];if(Q&&Q.visible){const dt=y(S,Q,E,M);S.onBeforeShadow(i,S,T,C,P,dt,X),i.renderBufferDirect(C,null,P,dt,S,X),S.onAfterShadow(i,S,T,C,P,dt,X)}}}else if(U.visible){const G=y(S,U,E,M);S.onBeforeShadow(i,S,T,C,P,G,null),i.renderBufferDirect(C,null,P,G,S,null),S.onAfterShadow(i,S,T,C,P,G,null)}}const z=S.children;for(let P=0,U=z.length;P<U;P++)x(z[P],T,C,E,M)}function L(S){S.target.removeEventListener("dispose",L);for(const C in c){const E=c[C],M=S.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}const Z_={[Po]:Lo,[Do]:No,[Io]:Oo,[zi]:Uo,[Lo]:Po,[No]:Do,[Oo]:Io,[Uo]:zi};function K_(i,t){function e(){let I=!1;const st=new ne;let $=null;const K=new ne(0,0,0,0);return{setMask:function(ut){$!==ut&&!I&&(i.colorMask(ut,ut,ut,ut),$=ut)},setLocked:function(ut){I=ut},setClear:function(ut,ct,It,ue,Oe){Oe===!0&&(ut*=ue,ct*=ue,It*=ue),st.set(ut,ct,It,ue),K.equals(st)===!1&&(i.clearColor(ut,ct,It,ue),K.copy(st))},reset:function(){I=!1,$=null,K.set(-1,0,0,0)}}}function n(){let I=!1,st=!1,$=null,K=null,ut=null;return{setReversed:function(ct){if(st!==ct){const It=t.get("EXT_clip_control");st?It.clipControlEXT(It.LOWER_LEFT_EXT,It.ZERO_TO_ONE_EXT):It.clipControlEXT(It.LOWER_LEFT_EXT,It.NEGATIVE_ONE_TO_ONE_EXT);const ue=ut;ut=null,this.setClear(ue)}st=ct},getReversed:function(){return st},setTest:function(ct){ct?ot(i.DEPTH_TEST):At(i.DEPTH_TEST)},setMask:function(ct){$!==ct&&!I&&(i.depthMask(ct),$=ct)},setFunc:function(ct){if(st&&(ct=Z_[ct]),K!==ct){switch(ct){case Po:i.depthFunc(i.NEVER);break;case Lo:i.depthFunc(i.ALWAYS);break;case Do:i.depthFunc(i.LESS);break;case zi:i.depthFunc(i.LEQUAL);break;case Io:i.depthFunc(i.EQUAL);break;case Uo:i.depthFunc(i.GEQUAL);break;case No:i.depthFunc(i.GREATER);break;case Oo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=ct}},setLocked:function(ct){I=ct},setClear:function(ct){ut!==ct&&(st&&(ct=1-ct),i.clearDepth(ct),ut=ct)},reset:function(){I=!1,$=null,K=null,ut=null,st=!1}}}function s(){let I=!1,st=null,$=null,K=null,ut=null,ct=null,It=null,ue=null,Oe=null;return{setTest:function(Jt){I||(Jt?ot(i.STENCIL_TEST):At(i.STENCIL_TEST))},setMask:function(Jt){st!==Jt&&!I&&(i.stencilMask(Jt),st=Jt)},setFunc:function(Jt,dn,Gn){($!==Jt||K!==dn||ut!==Gn)&&(i.stencilFunc(Jt,dn,Gn),$=Jt,K=dn,ut=Gn)},setOp:function(Jt,dn,Gn){(ct!==Jt||It!==dn||ue!==Gn)&&(i.stencilOp(Jt,dn,Gn),ct=Jt,It=dn,ue=Gn)},setLocked:function(Jt){I=Jt},setClear:function(Jt){Oe!==Jt&&(i.clearStencil(Jt),Oe=Jt)},reset:function(){I=!1,st=null,$=null,K=null,ut=null,ct=null,It=null,ue=null,Oe=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],g=null,_=!1,m=null,p=null,v=null,y=null,x=null,L=null,S=null,T=new zt(0,0,0),C=0,E=!1,M=null,D=null,z=null,P=null,U=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,Y=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(X)[1]),k=Y>=1):X.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),k=Y>=2);let Q=null,dt={};const _t=i.getParameter(i.SCISSOR_BOX),Pt=i.getParameter(i.VIEWPORT),Kt=new ne().fromArray(_t),q=new ne().fromArray(Pt);function nt(I,st,$,K){const ut=new Uint8Array(4),ct=i.createTexture();i.bindTexture(I,ct),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let It=0;It<$;It++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(st,0,i.RGBA,1,1,K,0,i.RGBA,i.UNSIGNED_BYTE,ut):i.texImage2D(st+It,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ut);return ct}const Mt={};Mt[i.TEXTURE_2D]=nt(i.TEXTURE_2D,i.TEXTURE_2D,1),Mt[i.TEXTURE_CUBE_MAP]=nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Mt[i.TEXTURE_2D_ARRAY]=nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Mt[i.TEXTURE_3D]=nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ot(i.DEPTH_TEST),o.setFunc(zi),kt(!1),Bt(vc),ot(i.CULL_FACE),F(Xn);function ot(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function At(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Lt(I,st){return d[I]!==st?(i.bindFramebuffer(I,st),d[I]=st,I===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=st),I===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=st),!0):!1}function Ft(I,st){let $=f,K=!1;if(I){$=u.get(st),$===void 0&&($=[],u.set(st,$));const ut=I.textures;if($.length!==ut.length||$[0]!==i.COLOR_ATTACHMENT0){for(let ct=0,It=ut.length;ct<It;ct++)$[ct]=i.COLOR_ATTACHMENT0+ct;$.length=ut.length,K=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,K=!0);K&&i.drawBuffers($)}function he(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const Vt={[hi]:i.FUNC_ADD,[Iu]:i.FUNC_SUBTRACT,[Uu]:i.FUNC_REVERSE_SUBTRACT};Vt[Nu]=i.MIN,Vt[Ou]=i.MAX;const pe={[Fu]:i.ZERO,[zu]:i.ONE,[ku]:i.SRC_COLOR,[Co]:i.SRC_ALPHA,[Xu]:i.SRC_ALPHA_SATURATE,[Vu]:i.DST_COLOR,[Hu]:i.DST_ALPHA,[Bu]:i.ONE_MINUS_SRC_COLOR,[Ro]:i.ONE_MINUS_SRC_ALPHA,[Wu]:i.ONE_MINUS_DST_COLOR,[Gu]:i.ONE_MINUS_DST_ALPHA,[$u]:i.CONSTANT_COLOR,[Yu]:i.ONE_MINUS_CONSTANT_COLOR,[qu]:i.CONSTANT_ALPHA,[ju]:i.ONE_MINUS_CONSTANT_ALPHA};function F(I,st,$,K,ut,ct,It,ue,Oe,Jt){if(I===Xn){_===!0&&(At(i.BLEND),_=!1);return}if(_===!1&&(ot(i.BLEND),_=!0),I!==Du){if(I!==m||Jt!==E){if((p!==hi||x!==hi)&&(i.blendEquation(i.FUNC_ADD),p=hi,x=hi),Jt)switch(I){case Fi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yc:i.blendFunc(i.ONE,i.ONE);break;case Mc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Fi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Mc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}v=null,y=null,L=null,S=null,T.set(0,0,0),C=0,m=I,E=Jt}return}ut=ut||st,ct=ct||$,It=It||K,(st!==p||ut!==x)&&(i.blendEquationSeparate(Vt[st],Vt[ut]),p=st,x=ut),($!==v||K!==y||ct!==L||It!==S)&&(i.blendFuncSeparate(pe[$],pe[K],pe[ct],pe[It]),v=$,y=K,L=ct,S=It),(ue.equals(T)===!1||Oe!==C)&&(i.blendColor(ue.r,ue.g,ue.b,Oe),T.copy(ue),C=Oe),m=I,E=!1}function en(I,st){I.side===gn?At(i.CULL_FACE):ot(i.CULL_FACE);let $=I.side===Fe;st&&($=!$),kt($),I.blending===Fi&&I.transparent===!1?F(Xn):F(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);const K=I.stencilWrite;a.setTest(K),K&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),oe(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):At(i.SAMPLE_ALPHA_TO_COVERAGE)}function kt(I){M!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),M=I)}function Bt(I){I!==Ru?(ot(i.CULL_FACE),I!==D&&(I===vc?i.cullFace(i.BACK):I===Pu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):At(i.CULL_FACE),D=I}function wt(I){I!==z&&(k&&i.lineWidth(I),z=I)}function oe(I,st,$){I?(ot(i.POLYGON_OFFSET_FILL),(P!==st||U!==$)&&(i.polygonOffset(st,$),P=st,U=$)):At(i.POLYGON_OFFSET_FILL)}function Et(I){I?ot(i.SCISSOR_TEST):At(i.SCISSOR_TEST)}function A(I){I===void 0&&(I=i.TEXTURE0+G-1),Q!==I&&(i.activeTexture(I),Q=I)}function b(I,st,$){$===void 0&&(Q===null?$=i.TEXTURE0+G-1:$=Q);let K=dt[$];K===void 0&&(K={type:void 0,texture:void 0},dt[$]=K),(K.type!==I||K.texture!==st)&&(Q!==$&&(i.activeTexture($),Q=$),i.bindTexture(I,st||Mt[I]),K.type=I,K.texture=st)}function B(){const I=dt[Q];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Z(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function j(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function bt(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function at(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Wt(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function mt(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Tt(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ct(I){Kt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),Kt.copy(I))}function gt(I){q.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),q.copy(I))}function Ht(I,st){let $=c.get(st);$===void 0&&($=new WeakMap,c.set(st,$));let K=$.get(I);K===void 0&&(K=i.getUniformBlockIndex(st,I.name),$.set(I,K))}function Ot(I,st){const K=c.get(st).get(I);l.get(st)!==K&&(i.uniformBlockBinding(st,K,I.__bindingPointIndex),l.set(st,K))}function se(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Q=null,dt={},d={},u=new WeakMap,f=[],g=null,_=!1,m=null,p=null,v=null,y=null,x=null,L=null,S=null,T=new zt(0,0,0),C=0,E=!1,M=null,D=null,z=null,P=null,U=null,Kt.set(0,0,i.canvas.width,i.canvas.height),q.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ot,disable:At,bindFramebuffer:Lt,drawBuffers:Ft,useProgram:he,setBlending:F,setMaterial:en,setFlipSided:kt,setCullFace:Bt,setLineWidth:wt,setPolygonOffset:oe,setScissorTest:Et,activeTexture:A,bindTexture:b,unbindTexture:B,compressedTexImage2D:Z,compressedTexImage3D:J,texImage2D:mt,texImage3D:Tt,updateUBOMapping:Ht,uniformBlockBinding:Ot,texStorage2D:Wt,texStorage3D:tt,texSubImage2D:j,texSubImage3D:bt,compressedTexSubImage2D:at,compressedTexSubImage3D:pt,scissor:Ct,viewport:gt,reset:se}}function Wh(i,t,e,n){const s=J_(n);switch(e){case Ac:return i*t;case Rc:return i*t;case Pc:return i*t*2;case $o:return i*t/s.components*s.byteLength;case Yo:return i*t/s.components*s.byteLength;case Lc:return i*t*2/s.components*s.byteLength;case qo:return i*t*2/s.components*s.byteLength;case Cc:return i*t*3/s.components*s.byteLength;case sn:return i*t*4/s.components*s.byteLength;case jo:return i*t*4/s.components*s.byteLength;case sr:case rr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case or:case ar:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ko:case Qo:return Math.max(i,16)*Math.max(t,8)/4;case Zo:case Jo:return Math.max(i,8)*Math.max(t,8)/2;case ta:case ea:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case na:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ia:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case sa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ra:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case oa:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case aa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case la:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ca:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case ha:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case da:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ua:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case fa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case pa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ma:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case ga:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case lr:case _a:case va:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Dc:case xa:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ya:case Ma:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function J_(i){switch(i){case Ln:case Ec:return{byteLength:1,components:1};case Ts:case wc:case As:return{byteLength:2,components:1};case Wo:case Xo:return{byteLength:2,components:4};case fi:case Vo:case vn:return{byteLength:4,components:1};case Tc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Q_(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,b){return f?new OffscreenCanvas(A,b):dr("canvas")}function _(A,b,B){let Z=1;const J=Et(A);if((J.width>B||J.height>B)&&(Z=B/Math.max(J.width,J.height)),Z<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const j=Math.floor(Z*J.width),bt=Math.floor(Z*J.height);d===void 0&&(d=g(j,bt));const at=b?g(j,bt):d;return at.width=j,at.height=bt,at.getContext("2d").drawImage(A,0,0,j,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+j+"x"+bt+")."),at}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function v(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(A,b,B,Z,J=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let j=b;if(b===i.RED&&(B===i.FLOAT&&(j=i.R32F),B===i.HALF_FLOAT&&(j=i.R16F),B===i.UNSIGNED_BYTE&&(j=i.R8)),b===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(j=i.R8UI),B===i.UNSIGNED_SHORT&&(j=i.R16UI),B===i.UNSIGNED_INT&&(j=i.R32UI),B===i.BYTE&&(j=i.R8I),B===i.SHORT&&(j=i.R16I),B===i.INT&&(j=i.R32I)),b===i.RG&&(B===i.FLOAT&&(j=i.RG32F),B===i.HALF_FLOAT&&(j=i.RG16F),B===i.UNSIGNED_BYTE&&(j=i.RG8)),b===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(j=i.RG8UI),B===i.UNSIGNED_SHORT&&(j=i.RG16UI),B===i.UNSIGNED_INT&&(j=i.RG32UI),B===i.BYTE&&(j=i.RG8I),B===i.SHORT&&(j=i.RG16I),B===i.INT&&(j=i.RG32I)),b===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(j=i.RGB8UI),B===i.UNSIGNED_SHORT&&(j=i.RGB16UI),B===i.UNSIGNED_INT&&(j=i.RGB32UI),B===i.BYTE&&(j=i.RGB8I),B===i.SHORT&&(j=i.RGB16I),B===i.INT&&(j=i.RGB32I)),b===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),B===i.UNSIGNED_INT&&(j=i.RGBA32UI),B===i.BYTE&&(j=i.RGBA8I),B===i.SHORT&&(j=i.RGBA16I),B===i.INT&&(j=i.RGBA32I)),b===i.RGB&&B===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),b===i.RGBA){const bt=J?cr:Gt.getTransfer(Z);B===i.FLOAT&&(j=i.RGBA32F),B===i.HALF_FLOAT&&(j=i.RGBA16F),B===i.UNSIGNED_BYTE&&(j=bt===Qt?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function x(A,b){let B;return A?b===null||b===fi||b===Hi?B=i.DEPTH24_STENCIL8:b===vn?B=i.DEPTH32F_STENCIL8:b===Ts&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===fi||b===Hi?B=i.DEPTH_COMPONENT24:b===vn?B=i.DEPTH_COMPONENT32F:b===Ts&&(B=i.DEPTH_COMPONENT16),B}function L(A,b){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Xe&&A.minFilter!==_n?Math.log2(Math.max(b.width,b.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?b.mipmaps.length:1}function S(A){const b=A.target;b.removeEventListener("dispose",S),C(b),b.isVideoTexture&&h.delete(b)}function T(A){const b=A.target;b.removeEventListener("dispose",T),M(b)}function C(A){const b=n.get(A);if(b.__webglInit===void 0)return;const B=A.source,Z=u.get(B);if(Z){const J=Z[b.__cacheKey];J.usedTimes--,J.usedTimes===0&&E(A),Object.keys(Z).length===0&&u.delete(B)}n.remove(A)}function E(A){const b=n.get(A);i.deleteTexture(b.__webglTexture);const B=A.source,Z=u.get(B);delete Z[b.__cacheKey],o.memory.textures--}function M(A){const b=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(b.__webglFramebuffer[Z]))for(let J=0;J<b.__webglFramebuffer[Z].length;J++)i.deleteFramebuffer(b.__webglFramebuffer[Z][J]);else i.deleteFramebuffer(b.__webglFramebuffer[Z]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[Z])}else{if(Array.isArray(b.__webglFramebuffer))for(let Z=0;Z<b.__webglFramebuffer.length;Z++)i.deleteFramebuffer(b.__webglFramebuffer[Z]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Z=0;Z<b.__webglColorRenderbuffer.length;Z++)b.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[Z]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const B=A.textures;for(let Z=0,J=B.length;Z<J;Z++){const j=n.get(B[Z]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),o.memory.textures--),n.remove(B[Z])}n.remove(A)}let D=0;function z(){D=0}function P(){const A=D;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),D+=1,A}function U(A){const b=[];return b.push(A.wrapS),b.push(A.wrapT),b.push(A.wrapR||0),b.push(A.magFilter),b.push(A.minFilter),b.push(A.anisotropy),b.push(A.internalFormat),b.push(A.format),b.push(A.type),b.push(A.generateMipmaps),b.push(A.premultiplyAlpha),b.push(A.flipY),b.push(A.unpackAlignment),b.push(A.colorSpace),b.join()}function G(A,b){const B=n.get(A);if(A.isVideoTexture&&wt(A),A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){const Z=A.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(B,A,b);return}}e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+b)}function k(A,b){const B=n.get(A);if(A.version>0&&B.__version!==A.version){q(B,A,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+b)}function Y(A,b){const B=n.get(A);if(A.version>0&&B.__version!==A.version){q(B,A,b);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+b)}function X(A,b){const B=n.get(A);if(A.version>0&&B.__version!==A.version){nt(B,A,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+b)}const Q={[Bo]:i.REPEAT,[di]:i.CLAMP_TO_EDGE,[Ho]:i.MIRRORED_REPEAT},dt={[Xe]:i.NEAREST,[of]:i.NEAREST_MIPMAP_NEAREST,[ir]:i.NEAREST_MIPMAP_LINEAR,[_n]:i.LINEAR,[Go]:i.LINEAR_MIPMAP_NEAREST,[ui]:i.LINEAR_MIPMAP_LINEAR},_t={[hf]:i.NEVER,[gf]:i.ALWAYS,[df]:i.LESS,[Nc]:i.LEQUAL,[uf]:i.EQUAL,[mf]:i.GEQUAL,[ff]:i.GREATER,[pf]:i.NOTEQUAL};function Pt(A,b){if(b.type===vn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===_n||b.magFilter===Go||b.magFilter===ir||b.magFilter===ui||b.minFilter===_n||b.minFilter===Go||b.minFilter===ir||b.minFilter===ui)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Q[b.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Q[b.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Q[b.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,dt[b.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,dt[b.minFilter]),b.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,_t[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Xe||b.minFilter!==ir&&b.minFilter!==ui||b.type===vn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Kt(A,b){let B=!1;A.__webglInit===void 0&&(A.__webglInit=!0,b.addEventListener("dispose",S));const Z=b.source;let J=u.get(Z);J===void 0&&(J={},u.set(Z,J));const j=U(b);if(j!==A.__cacheKey){J[j]===void 0&&(J[j]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),J[j].usedTimes++;const bt=J[A.__cacheKey];bt!==void 0&&(J[A.__cacheKey].usedTimes--,bt.usedTimes===0&&E(b)),A.__cacheKey=j,A.__webglTexture=J[j].texture}return B}function q(A,b,B){let Z=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Z=i.TEXTURE_3D);const J=Kt(A,b),j=b.source;e.bindTexture(Z,A.__webglTexture,i.TEXTURE0+B);const bt=n.get(j);if(j.version!==bt.__version||J===!0){e.activeTexture(i.TEXTURE0+B);const at=Gt.getPrimaries(Gt.workingColorSpace),pt=b.colorSpace===Yn?null:Gt.getPrimaries(b.colorSpace),Wt=b.colorSpace===Yn||at===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Wt);let tt=_(b.image,!1,s.maxTextureSize);tt=oe(b,tt);const mt=r.convert(b.format,b.colorSpace),Tt=r.convert(b.type);let Ct=y(b.internalFormat,mt,Tt,b.colorSpace,b.isVideoTexture);Pt(Z,b);let gt;const Ht=b.mipmaps,Ot=b.isVideoTexture!==!0,se=bt.__version===void 0||J===!0,I=j.dataReady,st=L(b,tt);if(b.isDepthTexture)Ct=x(b.format===Vi,b.type),se&&(Ot?e.texStorage2D(i.TEXTURE_2D,1,Ct,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,Ct,tt.width,tt.height,0,mt,Tt,null));else if(b.isDataTexture)if(Ht.length>0){Ot&&se&&e.texStorage2D(i.TEXTURE_2D,st,Ct,Ht[0].width,Ht[0].height);for(let $=0,K=Ht.length;$<K;$++)gt=Ht[$],Ot?I&&e.texSubImage2D(i.TEXTURE_2D,$,0,0,gt.width,gt.height,mt,Tt,gt.data):e.texImage2D(i.TEXTURE_2D,$,Ct,gt.width,gt.height,0,mt,Tt,gt.data);b.generateMipmaps=!1}else Ot?(se&&e.texStorage2D(i.TEXTURE_2D,st,Ct,tt.width,tt.height),I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,tt.width,tt.height,mt,Tt,tt.data)):e.texImage2D(i.TEXTURE_2D,0,Ct,tt.width,tt.height,0,mt,Tt,tt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Ot&&se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,st,Ct,Ht[0].width,Ht[0].height,tt.depth);for(let $=0,K=Ht.length;$<K;$++)if(gt=Ht[$],b.format!==sn)if(mt!==null)if(Ot){if(I)if(b.layerUpdates.size>0){const ut=Wh(gt.width,gt.height,b.format,b.type);for(const ct of b.layerUpdates){const It=gt.data.subarray(ct*ut/gt.data.BYTES_PER_ELEMENT,(ct+1)*ut/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,ct,gt.width,gt.height,1,mt,It)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,gt.width,gt.height,tt.depth,mt,gt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,Ct,gt.width,gt.height,tt.depth,0,gt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,gt.width,gt.height,tt.depth,mt,Tt,gt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,$,Ct,gt.width,gt.height,tt.depth,0,mt,Tt,gt.data)}else{Ot&&se&&e.texStorage2D(i.TEXTURE_2D,st,Ct,Ht[0].width,Ht[0].height);for(let $=0,K=Ht.length;$<K;$++)gt=Ht[$],b.format!==sn?mt!==null?Ot?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,gt.width,gt.height,mt,gt.data):e.compressedTexImage2D(i.TEXTURE_2D,$,Ct,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?I&&e.texSubImage2D(i.TEXTURE_2D,$,0,0,gt.width,gt.height,mt,Tt,gt.data):e.texImage2D(i.TEXTURE_2D,$,Ct,gt.width,gt.height,0,mt,Tt,gt.data)}else if(b.isDataArrayTexture)if(Ot){if(se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,st,Ct,tt.width,tt.height,tt.depth),I)if(b.layerUpdates.size>0){const $=Wh(tt.width,tt.height,b.format,b.type);for(const K of b.layerUpdates){const ut=tt.data.subarray(K*$/tt.data.BYTES_PER_ELEMENT,(K+1)*$/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,tt.width,tt.height,1,mt,Tt,ut)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,mt,Tt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ct,tt.width,tt.height,tt.depth,0,mt,Tt,tt.data);else if(b.isData3DTexture)Ot?(se&&e.texStorage3D(i.TEXTURE_3D,st,Ct,tt.width,tt.height,tt.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,mt,Tt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,Ct,tt.width,tt.height,tt.depth,0,mt,Tt,tt.data);else if(b.isFramebufferTexture){if(se)if(Ot)e.texStorage2D(i.TEXTURE_2D,st,Ct,tt.width,tt.height);else{let $=tt.width,K=tt.height;for(let ut=0;ut<st;ut++)e.texImage2D(i.TEXTURE_2D,ut,Ct,$,K,0,mt,Tt,null),$>>=1,K>>=1}}else if(Ht.length>0){if(Ot&&se){const $=Et(Ht[0]);e.texStorage2D(i.TEXTURE_2D,st,Ct,$.width,$.height)}for(let $=0,K=Ht.length;$<K;$++)gt=Ht[$],Ot?I&&e.texSubImage2D(i.TEXTURE_2D,$,0,0,mt,Tt,gt):e.texImage2D(i.TEXTURE_2D,$,Ct,mt,Tt,gt);b.generateMipmaps=!1}else if(Ot){if(se){const $=Et(tt);e.texStorage2D(i.TEXTURE_2D,st,Ct,$.width,$.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,mt,Tt,tt)}else e.texImage2D(i.TEXTURE_2D,0,Ct,mt,Tt,tt);m(b)&&p(Z),bt.__version=j.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function nt(A,b,B){if(b.image.length!==6)return;const Z=Kt(A,b),J=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+B);const j=n.get(J);if(J.version!==j.__version||Z===!0){e.activeTexture(i.TEXTURE0+B);const bt=Gt.getPrimaries(Gt.workingColorSpace),at=b.colorSpace===Yn?null:Gt.getPrimaries(b.colorSpace),pt=b.colorSpace===Yn||bt===at?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const Wt=b.isCompressedTexture||b.image[0].isCompressedTexture,tt=b.image[0]&&b.image[0].isDataTexture,mt=[];for(let K=0;K<6;K++)!Wt&&!tt?mt[K]=_(b.image[K],!0,s.maxCubemapSize):mt[K]=tt?b.image[K].image:b.image[K],mt[K]=oe(b,mt[K]);const Tt=mt[0],Ct=r.convert(b.format,b.colorSpace),gt=r.convert(b.type),Ht=y(b.internalFormat,Ct,gt,b.colorSpace),Ot=b.isVideoTexture!==!0,se=j.__version===void 0||Z===!0,I=J.dataReady;let st=L(b,Tt);Pt(i.TEXTURE_CUBE_MAP,b);let $;if(Wt){Ot&&se&&e.texStorage2D(i.TEXTURE_CUBE_MAP,st,Ht,Tt.width,Tt.height);for(let K=0;K<6;K++){$=mt[K].mipmaps;for(let ut=0;ut<$.length;ut++){const ct=$[ut];b.format!==sn?Ct!==null?Ot?I&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut,0,0,ct.width,ct.height,Ct,ct.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut,Ht,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut,0,0,ct.width,ct.height,Ct,gt,ct.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut,Ht,ct.width,ct.height,0,Ct,gt,ct.data)}}}else{if($=b.mipmaps,Ot&&se){$.length>0&&st++;const K=Et(mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,st,Ht,K.width,K.height)}for(let K=0;K<6;K++)if(tt){Ot?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,mt[K].width,mt[K].height,Ct,gt,mt[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ht,mt[K].width,mt[K].height,0,Ct,gt,mt[K].data);for(let ut=0;ut<$.length;ut++){const It=$[ut].image[K].image;Ot?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut+1,0,0,It.width,It.height,Ct,gt,It.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut+1,Ht,It.width,It.height,0,Ct,gt,It.data)}}else{Ot?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ct,gt,mt[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ht,Ct,gt,mt[K]);for(let ut=0;ut<$.length;ut++){const ct=$[ut];Ot?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut+1,0,0,Ct,gt,ct.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ut+1,Ht,Ct,gt,ct.image[K])}}}m(b)&&p(i.TEXTURE_CUBE_MAP),j.__version=J.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function Mt(A,b,B,Z,J,j){const bt=r.convert(B.format,B.colorSpace),at=r.convert(B.type),pt=y(B.internalFormat,bt,at,B.colorSpace),Wt=n.get(b),tt=n.get(B);if(tt.__renderTarget=b,!Wt.__hasExternalTextures){const mt=Math.max(1,b.width>>j),Tt=Math.max(1,b.height>>j);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,j,pt,mt,Tt,b.depth,0,bt,at,null):e.texImage2D(J,j,pt,mt,Tt,0,bt,at,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),Bt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,J,tt.__webglTexture,0,kt(b)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,J,tt.__webglTexture,j),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ot(A,b,B){if(i.bindRenderbuffer(i.RENDERBUFFER,A),b.depthBuffer){const Z=b.depthTexture,J=Z&&Z.isDepthTexture?Z.type:null,j=x(b.stencilBuffer,J),bt=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=kt(b);Bt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,at,j,b.width,b.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,at,j,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,j,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,bt,i.RENDERBUFFER,A)}else{const Z=b.textures;for(let J=0;J<Z.length;J++){const j=Z[J],bt=r.convert(j.format,j.colorSpace),at=r.convert(j.type),pt=y(j.internalFormat,bt,at,j.colorSpace),Wt=kt(b);B&&Bt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,pt,b.width,b.height):Bt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Wt,pt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,pt,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function At(A,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(b.depthTexture);Z.__renderTarget=b,(!Z.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),G(b.depthTexture,0);const J=Z.__webglTexture,j=kt(b);if(b.depthTexture.format===Gi)Bt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(b.depthTexture.format===Vi)Bt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Lt(A){const b=n.get(A),B=A.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==A.depthTexture){const Z=A.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Z){const J=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Z.removeEventListener("dispose",J)};Z.addEventListener("dispose",J),b.__depthDisposeCallback=J}b.__boundDepthTexture=Z}if(A.depthTexture&&!b.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");At(b.__webglFramebuffer,A)}else if(B){b.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[Z]),b.__webglDepthbuffer[Z]===void 0)b.__webglDepthbuffer[Z]=i.createRenderbuffer(),ot(b.__webglDepthbuffer[Z],A,!1);else{const J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=b.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,j)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),ot(b.__webglDepthbuffer,A,!1);else{const Z=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,J)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ft(A,b,B){const Z=n.get(A);b!==void 0&&Mt(Z.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Lt(A)}function he(A){const b=A.texture,B=n.get(A),Z=n.get(b);A.addEventListener("dispose",T);const J=A.textures,j=A.isWebGLCubeRenderTarget===!0,bt=J.length>1;if(bt||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=b.version,o.memory.textures++),j){B.__webglFramebuffer=[];for(let at=0;at<6;at++)if(b.mipmaps&&b.mipmaps.length>0){B.__webglFramebuffer[at]=[];for(let pt=0;pt<b.mipmaps.length;pt++)B.__webglFramebuffer[at][pt]=i.createFramebuffer()}else B.__webglFramebuffer[at]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){B.__webglFramebuffer=[];for(let at=0;at<b.mipmaps.length;at++)B.__webglFramebuffer[at]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(bt)for(let at=0,pt=J.length;at<pt;at++){const Wt=n.get(J[at]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&Bt(A)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let at=0;at<J.length;at++){const pt=J[at];B.__webglColorRenderbuffer[at]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[at]);const Wt=r.convert(pt.format,pt.colorSpace),tt=r.convert(pt.type),mt=y(pt.internalFormat,Wt,tt,pt.colorSpace,A.isXRRenderTarget===!0),Tt=kt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt,mt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+at,i.RENDERBUFFER,B.__webglColorRenderbuffer[at])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),ot(B.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Pt(i.TEXTURE_CUBE_MAP,b);for(let at=0;at<6;at++)if(b.mipmaps&&b.mipmaps.length>0)for(let pt=0;pt<b.mipmaps.length;pt++)Mt(B.__webglFramebuffer[at][pt],A,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt);else Mt(B.__webglFramebuffer[at],A,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);m(b)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let at=0,pt=J.length;at<pt;at++){const Wt=J[at],tt=n.get(Wt);e.bindTexture(i.TEXTURE_2D,tt.__webglTexture),Pt(i.TEXTURE_2D,Wt),Mt(B.__webglFramebuffer,A,Wt,i.COLOR_ATTACHMENT0+at,i.TEXTURE_2D,0),m(Wt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let at=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(at=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(at,Z.__webglTexture),Pt(at,b),b.mipmaps&&b.mipmaps.length>0)for(let pt=0;pt<b.mipmaps.length;pt++)Mt(B.__webglFramebuffer[pt],A,b,i.COLOR_ATTACHMENT0,at,pt);else Mt(B.__webglFramebuffer,A,b,i.COLOR_ATTACHMENT0,at,0);m(b)&&p(at),e.unbindTexture()}A.depthBuffer&&Lt(A)}function Vt(A){const b=A.textures;for(let B=0,Z=b.length;B<Z;B++){const J=b[B];if(m(J)){const j=v(A),bt=n.get(J).__webglTexture;e.bindTexture(j,bt),p(j),e.unbindTexture()}}}const pe=[],F=[];function en(A){if(A.samples>0){if(Bt(A)===!1){const b=A.textures,B=A.width,Z=A.height;let J=i.COLOR_BUFFER_BIT;const j=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=n.get(A),at=b.length>1;if(at)for(let pt=0;pt<b.length;pt++)e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let pt=0;pt<b.length;pt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),at){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,bt.__webglColorRenderbuffer[pt]);const Wt=n.get(b[pt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Wt,0)}i.blitFramebuffer(0,0,B,Z,0,0,B,Z,J,i.NEAREST),l===!0&&(pe.length=0,F.length=0,pe.push(i.COLOR_ATTACHMENT0+pt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(pe.push(j),F.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,F)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,pe))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),at)for(let pt=0;pt<b.length;pt++){e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,bt.__webglColorRenderbuffer[pt]);const Wt=n.get(b[pt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.TEXTURE_2D,Wt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const b=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function kt(A){return Math.min(s.maxSamples,A.samples)}function Bt(A){const b=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function wt(A){const b=o.render.frame;h.get(A)!==b&&(h.set(A,b),A.update())}function oe(A,b){const B=A.colorSpace,Z=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||B!==Wi&&B!==Yn&&(Gt.getTransfer(B)===Qt?(Z!==sn||J!==Ln)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),b}function Et(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=z,this.setTexture2D=G,this.setTexture2DArray=k,this.setTexture3D=Y,this.setTextureCube=X,this.rebindTextures=Ft,this.setupRenderTarget=he,this.updateRenderTargetMipmap=Vt,this.updateMultisampleRenderTarget=en,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=Bt}function t0(i,t){function e(n,s=Yn){let r;const o=Gt.getTransfer(s);if(n===Ln)return i.UNSIGNED_BYTE;if(n===Wo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Tc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ec)return i.BYTE;if(n===wc)return i.SHORT;if(n===Ts)return i.UNSIGNED_SHORT;if(n===Vo)return i.INT;if(n===fi)return i.UNSIGNED_INT;if(n===vn)return i.FLOAT;if(n===As)return i.HALF_FLOAT;if(n===Ac)return i.ALPHA;if(n===Cc)return i.RGB;if(n===sn)return i.RGBA;if(n===Rc)return i.LUMINANCE;if(n===Pc)return i.LUMINANCE_ALPHA;if(n===Gi)return i.DEPTH_COMPONENT;if(n===Vi)return i.DEPTH_STENCIL;if(n===$o)return i.RED;if(n===Yo)return i.RED_INTEGER;if(n===Lc)return i.RG;if(n===qo)return i.RG_INTEGER;if(n===jo)return i.RGBA_INTEGER;if(n===sr||n===rr||n===or||n===ar)if(o===Qt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===sr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===sr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===rr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===or)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ar)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Zo||n===Ko||n===Jo||n===Qo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Zo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ko)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Jo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Qo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ta||n===ea||n===na)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ta||n===ea)return o===Qt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===na)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ia||n===sa||n===ra||n===oa||n===aa||n===la||n===ca||n===ha||n===da||n===ua||n===fa||n===pa||n===ma||n===ga)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ia)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===sa)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ra)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===oa)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===aa)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===la)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ca)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ha)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===da)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ua)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===fa)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===pa)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ma)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ga)return o===Qt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===lr||n===_a||n===va)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===lr)return o===Qt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===_a)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===va)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Dc||n===xa||n===ya||n===Ma)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===lr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===xa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ya)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ma)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class e0 extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Nr extends de{constructor(){super(),this.isGroup=!0,this.type="Group"}}const n0={type:"move"};class nl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(n0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Nr;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const i0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,s0=`
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

}`;class r0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ie,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Bn({vertexShader:i0,fragmentShader:s0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new rt(new os(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class o0 extends pi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const _=new r0,m=e.getContextAttributes();let p=null,v=null;const y=[],x=[],L=new ft;let S=null;const T=new tn;T.viewport=new ne;const C=new tn;C.viewport=new ne;const E=[T,C],M=new e0;let D=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let nt=y[q];return nt===void 0&&(nt=new nl,y[q]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(q){let nt=y[q];return nt===void 0&&(nt=new nl,y[q]=nt),nt.getGripSpace()},this.getHand=function(q){let nt=y[q];return nt===void 0&&(nt=new nl,y[q]=nt),nt.getHandSpace()};function P(q){const nt=x.indexOf(q.inputSource);if(nt===-1)return;const Mt=y[nt];Mt!==void 0&&(Mt.update(q.inputSource,q.frame,c||o),Mt.dispatchEvent({type:q.type,data:q.inputSource}))}function U(){s.removeEventListener("select",P),s.removeEventListener("selectstart",P),s.removeEventListener("selectend",P),s.removeEventListener("squeeze",P),s.removeEventListener("squeezestart",P),s.removeEventListener("squeezeend",P),s.removeEventListener("end",U),s.removeEventListener("inputsourceschange",G);for(let q=0;q<y.length;q++){const nt=x[q];nt!==null&&(x[q]=null,y[q].disconnect(nt))}D=null,z=null,_.reset(),t.setRenderTarget(p),f=null,u=null,d=null,s=null,v=null,Kt.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",P),s.addEventListener("selectstart",P),s.addEventListener("selectend",P),s.addEventListener("squeeze",P),s.addEventListener("squeezestart",P),s.addEventListener("squeezeend",P),s.addEventListener("end",U),s.addEventListener("inputsourceschange",G),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const nt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,nt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new gi(f.framebufferWidth,f.framebufferHeight,{format:sn,type:Ln,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let nt=null,Mt=null,ot=null;m.depth&&(ot=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=m.stencil?Vi:Gi,Mt=m.stencil?Hi:fi);const At={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(At),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),v=new gi(u.textureWidth,u.textureHeight,{format:sn,type:Ln,depthTexture:new bh(u.textureWidth,u.textureHeight,Mt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Kt.setContext(s),Kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function G(q){for(let nt=0;nt<q.removed.length;nt++){const Mt=q.removed[nt],ot=x.indexOf(Mt);ot>=0&&(x[ot]=null,y[ot].disconnect(Mt))}for(let nt=0;nt<q.added.length;nt++){const Mt=q.added[nt];let ot=x.indexOf(Mt);if(ot===-1){for(let Lt=0;Lt<y.length;Lt++)if(Lt>=x.length){x.push(Mt),ot=Lt;break}else if(x[Lt]===null){x[Lt]=Mt,ot=Lt;break}if(ot===-1)break}const At=y[ot];At&&At.connect(Mt)}}const k=new R,Y=new R;function X(q,nt,Mt){k.setFromMatrixPosition(nt.matrixWorld),Y.setFromMatrixPosition(Mt.matrixWorld);const ot=k.distanceTo(Y),At=nt.projectionMatrix.elements,Lt=Mt.projectionMatrix.elements,Ft=At[14]/(At[10]-1),he=At[14]/(At[10]+1),Vt=(At[9]+1)/At[5],pe=(At[9]-1)/At[5],F=(At[8]-1)/At[0],en=(Lt[8]+1)/Lt[0],kt=Ft*F,Bt=Ft*en,wt=ot/(-F+en),oe=wt*-F;if(nt.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(oe),q.translateZ(wt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),At[10]===-1)q.projectionMatrix.copy(nt.projectionMatrix),q.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const Et=Ft+wt,A=he+wt,b=kt-oe,B=Bt+(ot-oe),Z=Vt*he/A*Et,J=pe*he/A*Et;q.projectionMatrix.makePerspective(b,B,Z,J,Et,A),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Q(q,nt){nt===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(nt.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let nt=q.near,Mt=q.far;_.texture!==null&&(_.depthNear>0&&(nt=_.depthNear),_.depthFar>0&&(Mt=_.depthFar)),M.near=C.near=T.near=nt,M.far=C.far=T.far=Mt,(D!==M.near||z!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),D=M.near,z=M.far),T.layers.mask=q.layers.mask|2,C.layers.mask=q.layers.mask|4,M.layers.mask=T.layers.mask|C.layers.mask;const ot=q.parent,At=M.cameras;Q(M,ot);for(let Lt=0;Lt<At.length;Lt++)Q(At[Lt],ot);At.length===2?X(M,T,C):M.projectionMatrix.copy(T.projectionMatrix),dt(q,M,ot)};function dt(q,nt,Mt){Mt===null?q.matrix.copy(nt.matrixWorld):(q.matrix.copy(Mt.matrixWorld),q.matrix.invert(),q.matrix.multiply(nt.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(nt.projectionMatrix),q.projectionMatrixInverse.copy(nt.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Rs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(q){l=q,u!==null&&(u.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let _t=null;function Pt(q,nt){if(h=nt.getViewerPose(c||o),g=nt,h!==null){const Mt=h.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let ot=!1;Mt.length!==M.cameras.length&&(M.cameras.length=0,ot=!0);for(let Lt=0;Lt<Mt.length;Lt++){const Ft=Mt[Lt];let he=null;if(f!==null)he=f.getViewport(Ft);else{const pe=d.getViewSubImage(u,Ft);he=pe.viewport,Lt===0&&(t.setRenderTargetTextures(v,pe.colorTexture,u.ignoreDepthValues?void 0:pe.depthStencilTexture),t.setRenderTarget(v))}let Vt=E[Lt];Vt===void 0&&(Vt=new tn,Vt.layers.enable(Lt),Vt.viewport=new ne,E[Lt]=Vt),Vt.matrix.fromArray(Ft.transform.matrix),Vt.matrix.decompose(Vt.position,Vt.quaternion,Vt.scale),Vt.projectionMatrix.fromArray(Ft.projectionMatrix),Vt.projectionMatrixInverse.copy(Vt.projectionMatrix).invert(),Vt.viewport.set(he.x,he.y,he.width,he.height),Lt===0&&(M.matrix.copy(Vt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ot===!0&&M.cameras.push(Vt)}const At=s.enabledFeatures;if(At&&At.includes("depth-sensing")){const Lt=d.getDepthInformation(Mt[0]);Lt&&Lt.isValid&&Lt.texture&&_.init(t,Lt,s.renderState)}}for(let Mt=0;Mt<y.length;Mt++){const ot=x[Mt],At=y[Mt];ot!==null&&At!==void 0&&At.update(ot,nt,c||o)}_t&&_t(q,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}const Kt=new ph;Kt.setAnimationLoop(Pt),this.setAnimationLoop=function(q){_t=q},this.dispose=function(){}}}const Ti=new ln,a0=new Xt;function l0(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,ch(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,y,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,v,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Fe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Fe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p),y=v.envMap,x=v.envMapRotation;y&&(m.envMap.value=y,Ti.copy(x),Ti.x*=-1,Ti.y*=-1,Ti.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ti.y*=-1,Ti.z*=-1),m.envMapRotation.value.setFromMatrix4(a0.makeRotationFromEuler(Ti)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,v,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Fe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function c0(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,y){const x=y.program;n.uniformBlockBinding(v,x)}function c(v,y){let x=s[v.id];x===void 0&&(g(v),x=h(v),s[v.id]=x,v.addEventListener("dispose",m));const L=y.program;n.updateUBOMapping(v,L);const S=t.render.frame;r[v.id]!==S&&(u(v),r[v.id]=S)}function h(v){const y=d();v.__bindingPointIndex=y;const x=i.createBuffer(),L=v.__size,S=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,L,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,x),x}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){const y=s[v.id],x=v.uniforms,L=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let S=0,T=x.length;S<T;S++){const C=Array.isArray(x[S])?x[S]:[x[S]];for(let E=0,M=C.length;E<M;E++){const D=C[E];if(f(D,S,E,L)===!0){const z=D.__offset,P=Array.isArray(D.value)?D.value:[D.value];let U=0;for(let G=0;G<P.length;G++){const k=P[G],Y=_(k);typeof k=="number"||typeof k=="boolean"?(D.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,z+U,D.__data)):k.isMatrix3?(D.__data[0]=k.elements[0],D.__data[1]=k.elements[1],D.__data[2]=k.elements[2],D.__data[3]=0,D.__data[4]=k.elements[3],D.__data[5]=k.elements[4],D.__data[6]=k.elements[5],D.__data[7]=0,D.__data[8]=k.elements[6],D.__data[9]=k.elements[7],D.__data[10]=k.elements[8],D.__data[11]=0):(k.toArray(D.__data,U),U+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,y,x,L){const S=v.value,T=y+"_"+x;if(L[T]===void 0)return typeof S=="number"||typeof S=="boolean"?L[T]=S:L[T]=S.clone(),!0;{const C=L[T];if(typeof S=="number"||typeof S=="boolean"){if(C!==S)return L[T]=S,!0}else if(C.equals(S)===!1)return C.copy(S),!0}return!1}function g(v){const y=v.uniforms;let x=0;const L=16;for(let T=0,C=y.length;T<C;T++){const E=Array.isArray(y[T])?y[T]:[y[T]];for(let M=0,D=E.length;M<D;M++){const z=E[M],P=Array.isArray(z.value)?z.value:[z.value];for(let U=0,G=P.length;U<G;U++){const k=P[U],Y=_(k),X=x%L,Q=X%Y.boundary,dt=X+Q;x+=Q,dt!==0&&L-dt<Y.storage&&(x+=L-dt),z.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=x,x+=Y.storage}}}const S=x%L;return S>0&&(x+=L-S),v.__size=x,v.__cache={},this}function _(v){const y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=48,y.storage=48):v.isMatrix4?(y.boundary=64,y.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),y}function m(v){const y=v.target;y.removeEventListener("dispose",m);const x=o.indexOf(y.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(const v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class h0{constructor(t={}){const{canvas:e=If(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const v=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=$e,this.toneMapping=$n,this.toneMappingExposure=1;const x=this;let L=!1,S=0,T=0,C=null,E=-1,M=null;const D=new ne,z=new ne;let P=null;const U=new zt(0);let G=0,k=e.width,Y=e.height,X=1,Q=null,dt=null;const _t=new ne(0,0,k,Y),Pt=new ne(0,0,k,Y);let Kt=!1;const q=new $a;let nt=!1,Mt=!1;const ot=new Xt,At=new Xt,Lt=new R,Ft=new ne,he={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Vt=!1;function pe(){return C===null?X:1}let F=n;function en(w,N){return e.getContext(w,N)}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ao}`),e.addEventListener("webglcontextlost",K,!1),e.addEventListener("webglcontextrestored",ut,!1),e.addEventListener("webglcontextcreationerror",ct,!1),F===null){const N="webgl2";if(F=en(N,w),F===null)throw en(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let kt,Bt,wt,oe,Et,A,b,B,Z,J,j,bt,at,pt,Wt,tt,mt,Tt,Ct,gt,Ht,Ot,se,I;function st(){kt=new mg(F),kt.init(),Ot=new t0(F,kt),Bt=new cg(F,kt,t,Ot),wt=new K_(F,kt),Bt.reverseDepthBuffer&&u&&wt.buffers.depth.setReversed(!0),oe=new vg(F),Et=new O_,A=new Q_(F,kt,wt,Et,Bt,Ot,oe),b=new dg(x),B=new pg(x),Z=new rp(F),se=new ag(F,Z),J=new gg(F,Z,oe,se),j=new yg(F,J,Z,oe),Ct=new xg(F,Bt,A),tt=new hg(Et),bt=new N_(x,b,B,kt,Bt,se,tt),at=new l0(x,Et),pt=new z_,Wt=new W_(kt),Tt=new og(x,b,B,wt,j,f,l),mt=new j_(x,j,Bt),I=new c0(F,oe,Bt,wt),gt=new lg(F,kt,oe),Ht=new _g(F,kt,oe),oe.programs=bt.programs,x.capabilities=Bt,x.extensions=kt,x.properties=Et,x.renderLists=pt,x.shadowMap=mt,x.state=wt,x.info=oe}st();const $=new o0(x,F);this.xr=$,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const w=kt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=kt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(w){w!==void 0&&(X=w,this.setSize(k,Y,!1))},this.getSize=function(w){return w.set(k,Y)},this.setSize=function(w,N,V=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=w,Y=N,e.width=Math.floor(w*X),e.height=Math.floor(N*X),V===!0&&(e.style.width=w+"px",e.style.height=N+"px"),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(k*X,Y*X).floor()},this.setDrawingBufferSize=function(w,N,V){k=w,Y=N,X=V,e.width=Math.floor(w*V),e.height=Math.floor(N*V),this.setViewport(0,0,w,N)},this.getCurrentViewport=function(w){return w.copy(D)},this.getViewport=function(w){return w.copy(_t)},this.setViewport=function(w,N,V,W){w.isVector4?_t.set(w.x,w.y,w.z,w.w):_t.set(w,N,V,W),wt.viewport(D.copy(_t).multiplyScalar(X).round())},this.getScissor=function(w){return w.copy(Pt)},this.setScissor=function(w,N,V,W){w.isVector4?Pt.set(w.x,w.y,w.z,w.w):Pt.set(w,N,V,W),wt.scissor(z.copy(Pt).multiplyScalar(X).round())},this.getScissorTest=function(){return Kt},this.setScissorTest=function(w){wt.setScissorTest(Kt=w)},this.setOpaqueSort=function(w){Q=w},this.setTransparentSort=function(w){dt=w},this.getClearColor=function(w){return w.copy(Tt.getClearColor())},this.setClearColor=function(){Tt.setClearColor.apply(Tt,arguments)},this.getClearAlpha=function(){return Tt.getClearAlpha()},this.setClearAlpha=function(){Tt.setClearAlpha.apply(Tt,arguments)},this.clear=function(w=!0,N=!0,V=!0){let W=0;if(w){let O=!1;if(C!==null){const et=C.texture.format;O=et===jo||et===qo||et===Yo}if(O){const et=C.texture.type,ht=et===Ln||et===fi||et===Ts||et===Hi||et===Wo||et===Xo,vt=Tt.getClearColor(),xt=Tt.getClearAlpha(),Rt=vt.r,Ut=vt.g,yt=vt.b;ht?(g[0]=Rt,g[1]=Ut,g[2]=yt,g[3]=xt,F.clearBufferuiv(F.COLOR,0,g)):(_[0]=Rt,_[1]=Ut,_[2]=yt,_[3]=xt,F.clearBufferiv(F.COLOR,0,_))}else W|=F.COLOR_BUFFER_BIT}N&&(W|=F.DEPTH_BUFFER_BIT),V&&(W|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",K,!1),e.removeEventListener("webglcontextrestored",ut,!1),e.removeEventListener("webglcontextcreationerror",ct,!1),pt.dispose(),Wt.dispose(),Et.dispose(),b.dispose(),B.dispose(),j.dispose(),se.dispose(),I.dispose(),bt.dispose(),$.dispose(),$.removeEventListener("sessionstart",Od),$.removeEventListener("sessionend",Fd),Di.stop()};function K(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function ut(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const w=oe.autoReset,N=mt.enabled,V=mt.autoUpdate,W=mt.needsUpdate,O=mt.type;st(),oe.autoReset=w,mt.enabled=N,mt.autoUpdate=V,mt.needsUpdate=W,mt.type=O}function ct(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function It(w){const N=w.target;N.removeEventListener("dispose",It),ue(N)}function ue(w){Oe(w),Et.remove(w)}function Oe(w){const N=Et.get(w).programs;N!==void 0&&(N.forEach(function(V){bt.releaseProgram(V)}),w.isShaderMaterial&&bt.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,V,W,O,et){N===null&&(N=he);const ht=O.isMesh&&O.matrixWorld.determinant()<0,vt=xv(w,N,V,W,O);wt.setMaterial(W,ht);let xt=V.index,Rt=1;if(W.wireframe===!0){if(xt=J.getWireframeAttribute(V),xt===void 0)return;Rt=2}const Ut=V.drawRange,yt=V.attributes.position;let $t=Ut.start*Rt,re=(Ut.start+Ut.count)*Rt;et!==null&&($t=Math.max($t,et.start*Rt),re=Math.min(re,(et.start+et.count)*Rt)),xt!==null?($t=Math.max($t,0),re=Math.min(re,xt.count)):yt!=null&&($t=Math.max($t,0),re=Math.min(re,yt.count));const ae=re-$t;if(ae<0||ae===1/0)return;se.setup(O,W,vt,V,xt);let Ve,qt=gt;if(xt!==null&&(Ve=Z.get(xt),qt=Ht,qt.setIndex(Ve)),O.isMesh)W.wireframe===!0?(wt.setLineWidth(W.wireframeLinewidth*pe()),qt.setMode(F.LINES)):qt.setMode(F.TRIANGLES);else if(O.isLine){let St=W.linewidth;St===void 0&&(St=1),wt.setLineWidth(St*pe()),O.isLineSegments?qt.setMode(F.LINES):O.isLineLoop?qt.setMode(F.LINE_LOOP):qt.setMode(F.LINE_STRIP)}else O.isPoints?qt.setMode(F.POINTS):O.isSprite&&qt.setMode(F.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)qt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(kt.get("WEBGL_multi_draw"))qt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const St=O._multiDrawStarts,Vn=O._multiDrawCounts,jt=O._multiDrawCount,un=xt?Z.get(xt).bytesPerElement:1,vs=Et.get(W).currentProgram.getUniforms();for(let je=0;je<jt;je++)vs.setValue(F,"_gl_DrawID",je),qt.render(St[je]/un,Vn[je])}else if(O.isInstancedMesh)qt.renderInstances($t,ae,O.count);else if(V.isInstancedBufferGeometry){const St=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Vn=Math.min(V.instanceCount,St);qt.renderInstances($t,ae,Vn)}else qt.render($t,ae)};function Jt(w,N,V){w.transparent===!0&&w.side===gn&&w.forceSinglePass===!1?(w.side=Fe,w.needsUpdate=!0,ao(w,N,V),w.side=Pn,w.needsUpdate=!0,ao(w,N,V),w.side=gn):ao(w,N,V)}this.compile=function(w,N,V=null){V===null&&(V=w),p=Wt.get(V),p.init(N),y.push(p),V.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),w!==V&&w.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();const W=new Set;return w.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const et=O.material;if(et)if(Array.isArray(et))for(let ht=0;ht<et.length;ht++){const vt=et[ht];Jt(vt,V,O),W.add(vt)}else Jt(et,V,O),W.add(et)}),y.pop(),p=null,W},this.compileAsync=function(w,N,V=null){const W=this.compile(w,N,V);return new Promise(O=>{function et(){if(W.forEach(function(ht){Et.get(ht).currentProgram.isReady()&&W.delete(ht)}),W.size===0){O(w);return}setTimeout(et,10)}kt.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let dn=null;function Gn(w){dn&&dn(w)}function Od(){Di.stop()}function Fd(){Di.start()}const Di=new ph;Di.setAnimationLoop(Gn),typeof self<"u"&&Di.setContext(self),this.setAnimationLoop=function(w){dn=w,$.setAnimationLoop(w),w===null?Di.stop():Di.start()},$.addEventListener("sessionstart",Od),$.addEventListener("sessionend",Fd),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(N),N=$.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,N,C),p=Wt.get(w,y.length),p.init(N),y.push(p),At.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),q.setFromProjectionMatrix(At),Mt=this.localClippingEnabled,nt=tt.init(this.clippingPlanes,Mt),m=pt.get(w,v.length),m.init(),v.push(m),$.enabled===!0&&$.isPresenting===!0){const et=x.xr.getDepthSensingMesh();et!==null&&Tl(et,N,-1/0,x.sortObjects)}Tl(w,N,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(Q,dt),Vt=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,Vt&&Tt.addToRenderList(m,w),this.info.render.frame++,nt===!0&&tt.beginShadows();const V=p.state.shadowsArray;mt.render(V,w,N),nt===!0&&tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,O=m.transmissive;if(p.setupLights(),N.isArrayCamera){const et=N.cameras;if(O.length>0)for(let ht=0,vt=et.length;ht<vt;ht++){const xt=et[ht];kd(W,O,w,xt)}Vt&&Tt.render(w);for(let ht=0,vt=et.length;ht<vt;ht++){const xt=et[ht];zd(m,w,xt,xt.viewport)}}else O.length>0&&kd(W,O,w,N),Vt&&Tt.render(w),zd(m,w,N);C!==null&&(A.updateMultisampleRenderTarget(C),A.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(x,w,N),se.resetDefaultState(),E=-1,M=null,y.pop(),y.length>0?(p=y[y.length-1],nt===!0&&tt.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function Tl(w,N,V,W){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)V=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||q.intersectsSprite(w)){W&&Ft.setFromMatrixPosition(w.matrixWorld).applyMatrix4(At);const ht=j.update(w),vt=w.material;vt.visible&&m.push(w,ht,vt,V,Ft.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||q.intersectsObject(w))){const ht=j.update(w),vt=w.material;if(W&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ft.copy(w.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),Ft.copy(ht.boundingSphere.center)),Ft.applyMatrix4(w.matrixWorld).applyMatrix4(At)),Array.isArray(vt)){const xt=ht.groups;for(let Rt=0,Ut=xt.length;Rt<Ut;Rt++){const yt=xt[Rt],$t=vt[yt.materialIndex];$t&&$t.visible&&m.push(w,ht,$t,V,Ft.z,yt)}}else vt.visible&&m.push(w,ht,vt,V,Ft.z,null)}}const et=w.children;for(let ht=0,vt=et.length;ht<vt;ht++)Tl(et[ht],N,V,W)}function zd(w,N,V,W){const O=w.opaque,et=w.transmissive,ht=w.transparent;p.setupLightsView(V),nt===!0&&tt.setGlobalState(x.clippingPlanes,V),W&&wt.viewport(D.copy(W)),O.length>0&&oo(O,N,V),et.length>0&&oo(et,N,V),ht.length>0&&oo(ht,N,V),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function kd(w,N,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[W.id]===void 0&&(p.state.transmissionRenderTarget[W.id]=new gi(1,1,{generateMipmaps:!0,type:kt.has("EXT_color_buffer_half_float")||kt.has("EXT_color_buffer_float")?As:Ln,minFilter:ui,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Gt.workingColorSpace}));const et=p.state.transmissionRenderTarget[W.id],ht=W.viewport||D;et.setSize(ht.z,ht.w);const vt=x.getRenderTarget();x.setRenderTarget(et),x.getClearColor(U),G=x.getClearAlpha(),G<1&&x.setClearColor(16777215,.5),x.clear(),Vt&&Tt.render(V);const xt=x.toneMapping;x.toneMapping=$n;const Rt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),p.setupLightsView(W),nt===!0&&tt.setGlobalState(x.clippingPlanes,W),oo(w,V,W),A.updateMultisampleRenderTarget(et),A.updateRenderTargetMipmap(et),kt.has("WEBGL_multisampled_render_to_texture")===!1){let Ut=!1;for(let yt=0,$t=N.length;yt<$t;yt++){const re=N[yt],ae=re.object,Ve=re.geometry,qt=re.material,St=re.group;if(qt.side===gn&&ae.layers.test(W.layers)){const Vn=qt.side;qt.side=Fe,qt.needsUpdate=!0,Bd(ae,V,W,Ve,qt,St),qt.side=Vn,qt.needsUpdate=!0,Ut=!0}}Ut===!0&&(A.updateMultisampleRenderTarget(et),A.updateRenderTargetMipmap(et))}x.setRenderTarget(vt),x.setClearColor(U,G),Rt!==void 0&&(W.viewport=Rt),x.toneMapping=xt}function oo(w,N,V){const W=N.isScene===!0?N.overrideMaterial:null;for(let O=0,et=w.length;O<et;O++){const ht=w[O],vt=ht.object,xt=ht.geometry,Rt=W===null?ht.material:W,Ut=ht.group;vt.layers.test(V.layers)&&Bd(vt,N,V,xt,Rt,Ut)}}function Bd(w,N,V,W,O,et){w.onBeforeRender(x,N,V,W,O,et),w.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),O.onBeforeRender(x,N,V,W,w,et),O.transparent===!0&&O.side===gn&&O.forceSinglePass===!1?(O.side=Fe,O.needsUpdate=!0,x.renderBufferDirect(V,N,W,O,w,et),O.side=Pn,O.needsUpdate=!0,x.renderBufferDirect(V,N,W,O,w,et),O.side=gn):x.renderBufferDirect(V,N,W,O,w,et),w.onAfterRender(x,N,V,W,O,et)}function ao(w,N,V){N.isScene!==!0&&(N=he);const W=Et.get(w),O=p.state.lights,et=p.state.shadowsArray,ht=O.state.version,vt=bt.getParameters(w,O.state,et,N,V),xt=bt.getProgramCacheKey(vt);let Rt=W.programs;W.environment=w.isMeshStandardMaterial?N.environment:null,W.fog=N.fog,W.envMap=(w.isMeshStandardMaterial?B:b).get(w.envMap||W.environment),W.envMapRotation=W.environment!==null&&w.envMap===null?N.environmentRotation:w.envMapRotation,Rt===void 0&&(w.addEventListener("dispose",It),Rt=new Map,W.programs=Rt);let Ut=Rt.get(xt);if(Ut!==void 0){if(W.currentProgram===Ut&&W.lightsStateVersion===ht)return Gd(w,vt),Ut}else vt.uniforms=bt.getUniforms(w),w.onBeforeCompile(vt,x),Ut=bt.acquireProgram(vt,xt),Rt.set(xt,Ut),W.uniforms=vt.uniforms;const yt=W.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(yt.clippingPlanes=tt.uniform),Gd(w,vt),W.needsLights=Mv(w),W.lightsStateVersion=ht,W.needsLights&&(yt.ambientLightColor.value=O.state.ambient,yt.lightProbe.value=O.state.probe,yt.directionalLights.value=O.state.directional,yt.directionalLightShadows.value=O.state.directionalShadow,yt.spotLights.value=O.state.spot,yt.spotLightShadows.value=O.state.spotShadow,yt.rectAreaLights.value=O.state.rectArea,yt.ltc_1.value=O.state.rectAreaLTC1,yt.ltc_2.value=O.state.rectAreaLTC2,yt.pointLights.value=O.state.point,yt.pointLightShadows.value=O.state.pointShadow,yt.hemisphereLights.value=O.state.hemi,yt.directionalShadowMap.value=O.state.directionalShadowMap,yt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,yt.spotShadowMap.value=O.state.spotShadowMap,yt.spotLightMatrix.value=O.state.spotLightMatrix,yt.spotLightMap.value=O.state.spotLightMap,yt.pointShadowMap.value=O.state.pointShadowMap,yt.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=Ut,W.uniformsList=null,Ut}function Hd(w){if(w.uniformsList===null){const N=w.currentProgram.getUniforms();w.uniformsList=Ir.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function Gd(w,N){const V=Et.get(w);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.batchingColor=N.batchingColor,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.instancingMorph=N.instancingMorph,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function xv(w,N,V,W,O){N.isScene!==!0&&(N=he),A.resetTextureUnits();const et=N.fog,ht=W.isMeshStandardMaterial?N.environment:null,vt=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Wi,xt=(W.isMeshStandardMaterial?B:b).get(W.envMap||ht),Rt=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ut=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),yt=!!V.morphAttributes.position,$t=!!V.morphAttributes.normal,re=!!V.morphAttributes.color;let ae=$n;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(ae=x.toneMapping);const Ve=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,qt=Ve!==void 0?Ve.length:0,St=Et.get(W),Vn=p.state.lights;if(nt===!0&&(Mt===!0||w!==M)){const nn=w===M&&W.id===E;tt.setState(W,w,nn)}let jt=!1;W.version===St.__version?(St.needsLights&&St.lightsStateVersion!==Vn.state.version||St.outputColorSpace!==vt||O.isBatchedMesh&&St.batching===!1||!O.isBatchedMesh&&St.batching===!0||O.isBatchedMesh&&St.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&St.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&St.instancing===!1||!O.isInstancedMesh&&St.instancing===!0||O.isSkinnedMesh&&St.skinning===!1||!O.isSkinnedMesh&&St.skinning===!0||O.isInstancedMesh&&St.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&St.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&St.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&St.instancingMorph===!1&&O.morphTexture!==null||St.envMap!==xt||W.fog===!0&&St.fog!==et||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==tt.numPlanes||St.numIntersection!==tt.numIntersection)||St.vertexAlphas!==Rt||St.vertexTangents!==Ut||St.morphTargets!==yt||St.morphNormals!==$t||St.morphColors!==re||St.toneMapping!==ae||St.morphTargetsCount!==qt)&&(jt=!0):(jt=!0,St.__version=W.version);let un=St.currentProgram;jt===!0&&(un=ao(W,N,O));let vs=!1,je=!1,Ys=!1;const le=un.getUniforms(),Tn=St.uniforms;if(wt.useProgram(un.program)&&(vs=!0,je=!0,Ys=!0),W.id!==E&&(E=W.id,je=!0),vs||M!==w){wt.buffers.depth.getReversed()?(ot.copy(w.projectionMatrix),Nf(ot),Of(ot),le.setValue(F,"projectionMatrix",ot)):le.setValue(F,"projectionMatrix",w.projectionMatrix),le.setValue(F,"viewMatrix",w.matrixWorldInverse);const ii=le.map.cameraPosition;ii!==void 0&&ii.setValue(F,Lt.setFromMatrixPosition(w.matrixWorld)),Bt.logarithmicDepthBuffer&&le.setValue(F,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&le.setValue(F,"isOrthographic",w.isOrthographicCamera===!0),M!==w&&(M=w,je=!0,Ys=!0)}if(O.isSkinnedMesh){le.setOptional(F,O,"bindMatrix"),le.setOptional(F,O,"bindMatrixInverse");const nn=O.skeleton;nn&&(nn.boneTexture===null&&nn.computeBoneTexture(),le.setValue(F,"boneTexture",nn.boneTexture,A))}O.isBatchedMesh&&(le.setOptional(F,O,"batchingTexture"),le.setValue(F,"batchingTexture",O._matricesTexture,A),le.setOptional(F,O,"batchingIdTexture"),le.setValue(F,"batchingIdTexture",O._indirectTexture,A),le.setOptional(F,O,"batchingColorTexture"),O._colorsTexture!==null&&le.setValue(F,"batchingColorTexture",O._colorsTexture,A));const qs=V.morphAttributes;if((qs.position!==void 0||qs.normal!==void 0||qs.color!==void 0)&&Ct.update(O,V,un),(je||St.receiveShadow!==O.receiveShadow)&&(St.receiveShadow=O.receiveShadow,le.setValue(F,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Tn.envMap.value=xt,Tn.flipEnvMap.value=xt.isCubeTexture&&xt.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&N.environment!==null&&(Tn.envMapIntensity.value=N.environmentIntensity),je&&(le.setValue(F,"toneMappingExposure",x.toneMappingExposure),St.needsLights&&yv(Tn,Ys),et&&W.fog===!0&&at.refreshFogUniforms(Tn,et),at.refreshMaterialUniforms(Tn,W,X,Y,p.state.transmissionRenderTarget[w.id]),Ir.upload(F,Hd(St),Tn,A)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Ir.upload(F,Hd(St),Tn,A),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&le.setValue(F,"center",O.center),le.setValue(F,"modelViewMatrix",O.modelViewMatrix),le.setValue(F,"normalMatrix",O.normalMatrix),le.setValue(F,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const nn=W.uniformsGroups;for(let ii=0,si=nn.length;ii<si;ii++){const Vd=nn[ii];I.update(Vd,un),I.bind(Vd,un)}}return un}function yv(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function Mv(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,N,V){Et.get(w.texture).__webglTexture=N,Et.get(w.depthTexture).__webglTexture=V;const W=Et.get(w);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||kt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,N){const V=Et.get(w);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(w,N=0,V=0){C=w,S=N,T=V;let W=!0,O=null,et=!1,ht=!1;if(w){const xt=Et.get(w);if(xt.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(F.FRAMEBUFFER,null),W=!1;else if(xt.__webglFramebuffer===void 0)A.setupRenderTarget(w);else if(xt.__hasExternalTextures)A.rebindTextures(w,Et.get(w.texture).__webglTexture,Et.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const yt=w.depthTexture;if(xt.__boundDepthTexture!==yt){if(yt!==null&&Et.has(yt)&&(w.width!==yt.image.width||w.height!==yt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(w)}}const Rt=w.texture;(Rt.isData3DTexture||Rt.isDataArrayTexture||Rt.isCompressedArrayTexture)&&(ht=!0);const Ut=Et.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ut[N])?O=Ut[N][V]:O=Ut[N],et=!0):w.samples>0&&A.useMultisampledRTT(w)===!1?O=Et.get(w).__webglMultisampledFramebuffer:Array.isArray(Ut)?O=Ut[V]:O=Ut,D.copy(w.viewport),z.copy(w.scissor),P=w.scissorTest}else D.copy(_t).multiplyScalar(X).floor(),z.copy(Pt).multiplyScalar(X).floor(),P=Kt;if(wt.bindFramebuffer(F.FRAMEBUFFER,O)&&W&&wt.drawBuffers(w,O),wt.viewport(D),wt.scissor(z),wt.setScissorTest(P),et){const xt=Et.get(w.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+N,xt.__webglTexture,V)}else if(ht){const xt=Et.get(w.texture),Rt=N||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,xt.__webglTexture,V||0,Rt)}E=-1},this.readRenderTargetPixels=function(w,N,V,W,O,et,ht){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=Et.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ht!==void 0&&(vt=vt[ht]),vt){wt.bindFramebuffer(F.FRAMEBUFFER,vt);try{const xt=w.texture,Rt=xt.format,Ut=xt.type;if(!Bt.textureFormatReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Bt.textureTypeReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-W&&V>=0&&V<=w.height-O&&F.readPixels(N,V,W,O,Ot.convert(Rt),Ot.convert(Ut),et)}finally{const xt=C!==null?Et.get(C).__webglFramebuffer:null;wt.bindFramebuffer(F.FRAMEBUFFER,xt)}}},this.readRenderTargetPixelsAsync=async function(w,N,V,W,O,et,ht){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=Et.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ht!==void 0&&(vt=vt[ht]),vt){const xt=w.texture,Rt=xt.format,Ut=xt.type;if(!Bt.textureFormatReadable(Rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Bt.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(N>=0&&N<=w.width-W&&V>=0&&V<=w.height-O){wt.bindFramebuffer(F.FRAMEBUFFER,vt);const yt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,yt),F.bufferData(F.PIXEL_PACK_BUFFER,et.byteLength,F.STREAM_READ),F.readPixels(N,V,W,O,Ot.convert(Rt),Ot.convert(Ut),0);const $t=C!==null?Et.get(C).__webglFramebuffer:null;wt.bindFramebuffer(F.FRAMEBUFFER,$t);const re=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Uf(F,re,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,yt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,et),F.deleteBuffer(yt),F.deleteSync(re),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,N=null,V=0){w.isTexture!==!0&&(Ls("WebGLRenderer: copyFramebufferToTexture function signature has changed."),N=arguments[0]||null,w=arguments[1]);const W=Math.pow(2,-V),O=Math.floor(w.image.width*W),et=Math.floor(w.image.height*W),ht=N!==null?N.x:0,vt=N!==null?N.y:0;A.setTexture2D(w,0),F.copyTexSubImage2D(F.TEXTURE_2D,V,0,0,ht,vt,O,et),wt.unbindTexture()},this.copyTextureToTexture=function(w,N,V=null,W=null,O=0){w.isTexture!==!0&&(Ls("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,w=arguments[1],N=arguments[2],O=arguments[3]||0,V=null);let et,ht,vt,xt,Rt,Ut,yt,$t,re;const ae=w.isCompressedTexture?w.mipmaps[O]:w.image;V!==null?(et=V.max.x-V.min.x,ht=V.max.y-V.min.y,vt=V.isBox3?V.max.z-V.min.z:1,xt=V.min.x,Rt=V.min.y,Ut=V.isBox3?V.min.z:0):(et=ae.width,ht=ae.height,vt=ae.depth||1,xt=0,Rt=0,Ut=0),W!==null?(yt=W.x,$t=W.y,re=W.z):(yt=0,$t=0,re=0);const Ve=Ot.convert(N.format),qt=Ot.convert(N.type);let St;N.isData3DTexture?(A.setTexture3D(N,0),St=F.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(A.setTexture2DArray(N,0),St=F.TEXTURE_2D_ARRAY):(A.setTexture2D(N,0),St=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,N.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,N.unpackAlignment);const Vn=F.getParameter(F.UNPACK_ROW_LENGTH),jt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),un=F.getParameter(F.UNPACK_SKIP_PIXELS),vs=F.getParameter(F.UNPACK_SKIP_ROWS),je=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,ae.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ae.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,xt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Rt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ut);const Ys=w.isDataArrayTexture||w.isData3DTexture,le=N.isDataArrayTexture||N.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const Tn=Et.get(w),qs=Et.get(N),nn=Et.get(Tn.__renderTarget),ii=Et.get(qs.__renderTarget);wt.bindFramebuffer(F.READ_FRAMEBUFFER,nn.__webglFramebuffer),wt.bindFramebuffer(F.DRAW_FRAMEBUFFER,ii.__webglFramebuffer);for(let si=0;si<vt;si++)Ys&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Et.get(w).__webglTexture,O,Ut+si),w.isDepthTexture?(le&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Et.get(N).__webglTexture,O,re+si),F.blitFramebuffer(xt,Rt,et,ht,yt,$t,et,ht,F.DEPTH_BUFFER_BIT,F.NEAREST)):le?F.copyTexSubImage3D(St,O,yt,$t,re+si,xt,Rt,et,ht):F.copyTexSubImage2D(St,O,yt,$t,re+si,xt,Rt,et,ht);wt.bindFramebuffer(F.READ_FRAMEBUFFER,null),wt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else le?w.isDataTexture||w.isData3DTexture?F.texSubImage3D(St,O,yt,$t,re,et,ht,vt,Ve,qt,ae.data):N.isCompressedArrayTexture?F.compressedTexSubImage3D(St,O,yt,$t,re,et,ht,vt,Ve,ae.data):F.texSubImage3D(St,O,yt,$t,re,et,ht,vt,Ve,qt,ae):w.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,O,yt,$t,et,ht,Ve,qt,ae.data):w.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,O,yt,$t,ae.width,ae.height,Ve,ae.data):F.texSubImage2D(F.TEXTURE_2D,O,yt,$t,et,ht,Ve,qt,ae);F.pixelStorei(F.UNPACK_ROW_LENGTH,Vn),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,jt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,un),F.pixelStorei(F.UNPACK_SKIP_ROWS,vs),F.pixelStorei(F.UNPACK_SKIP_IMAGES,je),O===0&&N.generateMipmaps&&F.generateMipmap(St),wt.unbindTexture()},this.copyTextureToTexture3D=function(w,N,V=null,W=null,O=0){return w.isTexture!==!0&&(Ls("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,W=arguments[1]||null,w=arguments[2],N=arguments[3],O=arguments[4]||0),Ls('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,N,V,W,O)},this.initRenderTarget=function(w){Et.get(w).__webglFramebuffer===void 0&&A.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),wt.unbindTexture()},this.resetState=function(){S=0,T=0,C=null,wt.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Gt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Gt._getUnpackColorSpace()}}class d0 extends de{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Xh{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ba,this.updateRanges=[],this.version=0,this.uuid=In()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=In()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=In()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ke=new R;class yn{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix4(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyNormalMatrix(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.transformDirection(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Zt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Zt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Zt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Zt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Zt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=rn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=rn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=rn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=rn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array),s=Zt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Zt(e,this.array),n=Zt(n,this.array),s=Zt(s,this.array),r=Zt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Be(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new yn(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class $h extends xi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new zt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let hs;const Fs=new R,ds=new R,us=new R,fs=new ft,zs=new ft,Yh=new Xt,Or=new R,ks=new R,Fr=new R,qh=new ft,il=new ft,jh=new ft;class u0 extends de{constructor(t=new $h){if(super(),this.isSprite=!0,this.type="Sprite",hs===void 0){hs=new _e;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Xh(e,5);hs.setIndex([0,1,2,0,2,3]),hs.setAttribute("position",new yn(n,3,0,!1)),hs.setAttribute("uv",new yn(n,2,3,!1))}this.geometry=hs,this.material=t,this.center=new ft(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ds.setFromMatrixScale(this.matrixWorld),Yh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),us.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ds.multiplyScalar(-us.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;zr(Or.set(-.5,-.5,0),us,o,ds,s,r),zr(ks.set(.5,-.5,0),us,o,ds,s,r),zr(Fr.set(.5,.5,0),us,o,ds,s,r),qh.set(0,0),il.set(1,0),jh.set(1,1);let a=t.ray.intersectTriangle(Or,ks,Fr,!1,Fs);if(a===null&&(zr(ks.set(-.5,.5,0),us,o,ds,s,r),il.set(0,1),a=t.ray.intersectTriangle(Or,Fr,ks,!1,Fs),a===null))return;const l=t.ray.origin.distanceTo(Fs);l<t.near||l>t.far||e.push({distance:l,point:Fs.clone(),uv:Je.getInterpolation(Fs,Or,ks,Fr,qh,il,jh,new ft),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function zr(i,t,e,n,s,r){fs.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(zs.x=r*fs.x-s*fs.y,zs.y=s*fs.x+r*fs.y):zs.copy(fs),i.copy(t),i.x+=zs.x,i.y+=zs.y,i.applyMatrix4(Yh)}class f0 extends Ie{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Xe,h=Xe,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Zh extends Be{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ps=new Xt,Kh=new Xt,kr=[],Jh=new xn,p0=new Xt,Bs=new rt,Hs=new Zn;class sl extends rt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Zh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,p0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new xn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ps),Jh.copy(t.boundingBox).applyMatrix4(ps),this.boundingBox.union(Jh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ps),Hs.copy(t.boundingSphere).applyMatrix4(ps),this.boundingSphere.union(Hs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Bs.geometry=this.geometry,Bs.material=this.material,Bs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hs.copy(this.boundingSphere),Hs.applyMatrix4(n),t.ray.intersectsSphere(Hs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ps),Kh.multiplyMatrices(n,ps),Bs.matrixWorld=Kh,Bs.raycast(t,kr);for(let o=0,a=kr.length;o<a;o++){const l=kr[o];l.instanceId=r,l.object=this,e.push(l)}kr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Zh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new f0(new Float32Array(s*this.count),s,this.count,$o,vn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Br extends xi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Hr=new R,Gr=new R,Qh=new Xt,Gs=new _r,Vr=new Zn,rl=new R,td=new R;class Mn extends de{constructor(t=new _e,e=new Br){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Hr.fromBufferAttribute(e,s-1),Gr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Hr.distanceTo(Gr);t.setAttribute("lineDistance",new te(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(s),Vr.radius+=r,t.ray.intersectsSphere(Vr)===!1)return;Qh.copy(s).invert(),Gs.copy(t.ray).applyMatrix4(Qh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=h.getX(_),v=h.getX(_+1),y=Wr(this,t,Gs,l,p,v);y&&e.push(y)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=Wr(this,t,Gs,l,_,m);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=Wr(this,t,Gs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Wr(this,t,Gs,l,g-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Wr(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(Hr.fromBufferAttribute(o,s),Gr.fromBufferAttribute(o,r),e.distanceSqToSegment(Hr,Gr,rl,td)>n)return;rl.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(rl);if(!(l<t.near||l>t.far))return{distance:l,point:td.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}class m0 extends Ie{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ms extends _e{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new R,h=new ft;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=n+d/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new te(o,3)),this.setAttribute("normal",new te(a,3)),this.setAttribute("uv",new te(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ms(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Me extends _e{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const _=[],m=n/2;let p=0;v(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new te(d,3)),this.setAttribute("normal",new te(u,3)),this.setAttribute("uv",new te(f,2));function v(){const x=new R,L=new R;let S=0;const T=(e-t)/n;for(let C=0;C<=r;C++){const E=[],M=C/r,D=M*(e-t)+t;for(let z=0;z<=s;z++){const P=z/s,U=P*l+a,G=Math.sin(U),k=Math.cos(U);L.x=D*G,L.y=-M*n+m,L.z=D*k,d.push(L.x,L.y,L.z),x.set(G,T,k).normalize(),u.push(x.x,x.y,x.z),f.push(P,1-M),E.push(g++)}_.push(E)}for(let C=0;C<s;C++)for(let E=0;E<r;E++){const M=_[E][C],D=_[E+1][C],z=_[E+1][C+1],P=_[E][C+1];(t>0||E!==0)&&(h.push(M,D,P),S+=3),(e>0||E!==r-1)&&(h.push(D,z,P),S+=3)}c.addGroup(p,S,0),p+=S}function y(x){const L=g,S=new ft,T=new R;let C=0;const E=x===!0?t:e,M=x===!0?1:-1;for(let z=1;z<=s;z++)d.push(0,m*M,0),u.push(0,M,0),f.push(.5,.5),g++;const D=g;for(let z=0;z<=s;z++){const U=z/s*l+a,G=Math.cos(U),k=Math.sin(U);T.x=E*k,T.y=m*M,T.z=E*G,d.push(T.x,T.y,T.z),u.push(0,M,0),S.x=G*.5+.5,S.y=k*.5*M+.5,f.push(S.x,S.y),g++}for(let z=0;z<s;z++){const P=L+z,U=D+z;x===!0?h.push(U,U+1,P):h.push(U+1,U,P),C+=3}c.addGroup(p,C,x===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Me(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ol extends Me{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new ol(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class al extends _e{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new te(r,3)),this.setAttribute("normal",new te(r.slice(),3)),this.setAttribute("uv",new te(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const y=new R,x=new R,L=new R;for(let S=0;S<e.length;S+=3)f(e[S+0],y),f(e[S+1],x),f(e[S+2],L),l(y,x,L,v)}function l(v,y,x,L){const S=L+1,T=[];for(let C=0;C<=S;C++){T[C]=[];const E=v.clone().lerp(x,C/S),M=y.clone().lerp(x,C/S),D=S-C;for(let z=0;z<=D;z++)z===0&&C===S?T[C][z]=E:T[C][z]=E.clone().lerp(M,z/D)}for(let C=0;C<S;C++)for(let E=0;E<2*(S-C)-1;E++){const M=Math.floor(E/2);E%2===0?(u(T[C][M+1]),u(T[C+1][M]),u(T[C][M])):(u(T[C][M+1]),u(T[C+1][M+1]),u(T[C+1][M]))}}function c(v){const y=new R;for(let x=0;x<r.length;x+=3)y.x=r[x+0],y.y=r[x+1],y.z=r[x+2],y.normalize().multiplyScalar(v),r[x+0]=y.x,r[x+1]=y.y,r[x+2]=y.z}function h(){const v=new R;for(let y=0;y<r.length;y+=3){v.x=r[y+0],v.y=r[y+1],v.z=r[y+2];const x=m(v)/2/Math.PI+.5,L=p(v)/Math.PI+.5;o.push(x,1-L)}g(),d()}function d(){for(let v=0;v<o.length;v+=6){const y=o[v+0],x=o[v+2],L=o[v+4],S=Math.max(y,x,L),T=Math.min(y,x,L);S>.9&&T<.1&&(y<.2&&(o[v+0]+=1),x<.2&&(o[v+2]+=1),L<.2&&(o[v+4]+=1))}}function u(v){r.push(v.x,v.y,v.z)}function f(v,y){const x=v*3;y.x=t[x+0],y.y=t[x+1],y.z=t[x+2]}function g(){const v=new R,y=new R,x=new R,L=new R,S=new ft,T=new ft,C=new ft;for(let E=0,M=0;E<r.length;E+=9,M+=6){v.set(r[E+0],r[E+1],r[E+2]),y.set(r[E+3],r[E+4],r[E+5]),x.set(r[E+6],r[E+7],r[E+8]),S.set(o[M+0],o[M+1]),T.set(o[M+2],o[M+3]),C.set(o[M+4],o[M+5]),L.copy(v).add(y).add(x).divideScalar(3);const D=m(L);_(S,M+0,v,D),_(T,M+2,y,D),_(C,M+4,x,D)}}function _(v,y,x,L){L<0&&v.x===1&&(o[y]=v.x-1),x.x===0&&x.z===0&&(o[y]=L/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new al(t.vertices,t.indices,t.radius,t.details)}}class Ai extends al{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ai(t.radius,t.detail)}}class Xr extends _e{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new R,u=new R,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const v=[],y=p/n;let x=0;p===0&&o===0?x=.5/e:p===n&&l===Math.PI&&(x=-.5/e);for(let L=0;L<=e;L++){const S=L/e;d.x=-t*Math.cos(s+S*r)*Math.sin(o+y*a),d.y=t*Math.cos(o+y*a),d.z=t*Math.sin(s+S*r)*Math.sin(o+y*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(S+x,1-y),v.push(c++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const y=h[p][v+1],x=h[p][v],L=h[p+1][v],S=h[p+1][v+1];(p!==0||o>0)&&f.push(y,x,S),(p!==n-1||l<Math.PI)&&f.push(x,L,S)}this.setIndex(f),this.setAttribute("position",new te(g,3)),this.setAttribute("normal",new te(_,3)),this.setAttribute("uv",new te(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ci extends _e{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],h=new R,d=new R,u=new R;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*r,m=f/n*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(_),d.y=(t+e*Math.cos(m))*Math.sin(_),d.z=e*Math.sin(m),a.push(d.x,d.y,d.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,v=(s+1)*f+g;o.push(_,m,v),o.push(m,p,v)}this.setIndex(o),this.setAttribute("position",new te(a,3)),this.setAttribute("normal",new te(l,3)),this.setAttribute("uv",new te(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ci(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class g0 extends _e{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new R,r=new R;if(t.index!==null){const o=t.attributes.position,a=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,f=d.count;for(let g=u,_=u+f;g<_;g+=3)for(let m=0;m<3;m++){const p=a.getX(g+m),v=a.getX(g+(m+1)%3);s.fromBufferAttribute(o,p),r.fromBufferAttribute(o,v),ed(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,d),ed(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new te(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function ed(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class _0 extends xi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ic,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=Fo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class nd extends de{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const ll=new Xt,id=new R,sd=new R;class v0{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.map=null,this.mapPass=null,this.matrix=new Xt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $a,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;id.setFromMatrixPosition(t.matrixWorld),e.position.copy(id),sd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(sd),e.updateMatrixWorld(),ll.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ll),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ll)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class x0 extends v0{constructor(){super(new Ya(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class y0 extends nd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.target=new de,this.shadow=new x0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class M0 extends nd{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class b0 extends _e{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class cl extends Xh{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}const rd=new Xt;class od{constructor(t,e,n=0,s=1/0){this.ray=new _r(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Da,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return rd.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rd),this}intersectObject(t,e=!0,n=[]){return hl(t,this,n,e),n.sort(ad),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)hl(t[s],this,n,e);return n.sort(ad),n}}function ad(i,t){return i.distance-t.distance}function hl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)hl(r[o],t,e,!0)}}class ld{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ce(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const cd=new R,$r=new R;class S0{constructor(t=new R,e=new R){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){cd.subVectors(t,this.start),$r.subVectors(this.end,this.start);const n=$r.dot($r);let r=$r.dot(cd)/n;return e&&(r=Ce(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class dl extends pi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ao}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ao);const hd={type:"change"},ul={type:"start"},dd={type:"end"},Yr=new _r,ud=new Hn,E0=Math.cos(70*mi.DEG2RAD),be=new R,Ge=2*Math.PI,ee={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},fl=1e-6;class w0 extends dl{constructor(t,e=null){super(t,e),this.state=ee.NONE,this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Se.ROTATE,MIDDLE:Se.DOLLY,RIGHT:Se.PAN},this.touches={ONE:mn.ROTATE,TWO:mn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new R,this._lastQuaternion=new me,this._lastTargetPosition=new R,this._quat=new me().setFromUnitVectors(t.up,new R(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ld,this._sphericalDelta=new ld,this._scale=1,this._panOffset=new R,this._rotateStart=new ft,this._rotateEnd=new ft,this._rotateDelta=new ft,this._panStart=new ft,this._panEnd=new ft,this._panDelta=new ft,this._dollyStart=new ft,this._dollyEnd=new ft,this._dollyDelta=new ft,this._dollyDirection=new R,this._mouse=new ft,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=A0.bind(this),this._onPointerDown=T0.bind(this),this._onPointerUp=C0.bind(this),this._onContextMenu=N0.bind(this),this._onMouseWheel=L0.bind(this),this._onKeyDown=D0.bind(this),this._onTouchStart=I0.bind(this),this._onTouchMove=U0.bind(this),this._onMouseDown=R0.bind(this),this._onMouseMove=P0.bind(this),this._interceptControlDown=O0.bind(this),this._interceptControlUp=F0.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(hd),this.update(),this.state=ee.NONE}update(t=null){const e=this.object.position;be.copy(e).sub(this.target),be.applyQuaternion(this._quat),this._spherical.setFromVector3(be),this.autoRotate&&this.state===ee.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Ge:n>Math.PI&&(n-=Ge),s<-Math.PI?s+=Ge:s>Math.PI&&(s-=Ge),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(be.setFromSpherical(this._spherical),be.applyQuaternion(this._quatInverse),e.copy(this.target).add(be),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=be.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new R(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new R(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=be.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Yr.origin.copy(this.object.position),Yr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Yr.direction))<E0?this.object.lookAt(this.target):(ud.setFromNormalAndCoplanarPoint(this.object.up,this.target),Yr.intersectPlane(ud,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>fl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>fl||this._lastTargetPosition.distanceToSquared(this.target)>fl?(this.dispatchEvent(hd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Ge/60*this.autoRotateSpeed*t:Ge/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){be.setFromMatrixColumn(e,0),be.multiplyScalar(-t),this._panOffset.add(be)}_panUp(t,e){this.screenSpacePanning===!0?be.setFromMatrixColumn(e,1):(be.setFromMatrixColumn(e,0),be.crossVectors(this.object.up,be)),be.multiplyScalar(t),this._panOffset.add(be)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;be.copy(s).sub(this.target);let r=be.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ge*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ge*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(Ge*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-Ge*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(Ge*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-Ge*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ge*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ge*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ft,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function T0(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function A0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function C0(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(dd),this.state=ee.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function R0(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Se.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ee.DOLLY;break;case Se.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ee.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ee.ROTATE}break;case Se.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ee.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ee.PAN}break;default:this.state=ee.NONE}this.state!==ee.NONE&&this.dispatchEvent(ul)}function P0(i){switch(this.state){case ee.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ee.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ee.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function L0(i){this.enabled===!1||this.enableZoom===!1||this.state!==ee.NONE||(i.preventDefault(),this.dispatchEvent(ul),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(dd))}function D0(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function I0(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case mn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ee.TOUCH_ROTATE;break;case mn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ee.TOUCH_PAN;break;default:this.state=ee.NONE}break;case 2:switch(this.touches.TWO){case mn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ee.TOUCH_DOLLY_PAN;break;case mn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ee.TOUCH_DOLLY_ROTATE;break;default:this.state=ee.NONE}break;default:this.state=ee.NONE}this.state!==ee.NONE&&this.dispatchEvent(ul)}function U0(i){switch(this._trackPointer(i),this.state){case ee.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ee.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ee.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ee.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ee.NONE}}function N0(i){this.enabled!==!1&&i.preventDefault()}function O0(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function F0(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const pl={type:"change"},ml={type:"start"},gl={type:"end"},fd=1e-6,Yt={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4},qr=new ft,ei=new ft,z0=new R,jr=new R,_l=new R,gs=new me,pd=new R,Zr=new R,vl=new R,Kr=new R;class k0 extends dl{constructor(t,e=null){super(t,e),this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:Se.ROTATE,MIDDLE:Se.DOLLY,RIGHT:Se.PAN},this.state=Yt.NONE,this.keyState=Yt.NONE,this.target=new R,this._lastPosition=new R,this._lastZoom=1,this._touchZoomDistanceStart=0,this._touchZoomDistanceEnd=0,this._lastAngle=0,this._eye=new R,this._movePrev=new ft,this._moveCurr=new ft,this._lastAxis=new R,this._zoomStart=new ft,this._zoomEnd=new ft,this._panStart=new ft,this._panEnd=new ft,this._pointers=[],this._pointerPositions={},this._onPointerMove=H0.bind(this),this._onPointerDown=B0.bind(this),this._onPointerUp=G0.bind(this),this._onPointerCancel=V0.bind(this),this._onContextMenu=Z0.bind(this),this._onMouseWheel=j0.bind(this),this._onKeyDown=X0.bind(this),this._onKeyUp=W0.bind(this),this._onTouchStart=K0.bind(this),this._onTouchMove=J0.bind(this),this._onTouchEnd=Q0.bind(this),this._onMouseDown=$0.bind(this),this._onMouseMove=Y0.bind(this),this._onMouseUp=q0.bind(this),this._target0=this.target.clone(),this._position0=this.object.position.clone(),this._up0=this.object.up.clone(),this._zoom0=this.object.zoom,e!==null&&(this.connect(),this.handleResize()),this.update()}connect(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="none"}disconnect(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}handleResize(){const t=this.domElement.getBoundingClientRect(),e=this.domElement.ownerDocument.documentElement;this.screen.left=t.left+window.pageXOffset-e.clientLeft,this.screen.top=t.top+window.pageYOffset-e.clientTop,this.screen.width=t.width,this.screen.height=t.height}update(){this._eye.subVectors(this.object.position,this.target),this.noRotate||this._rotateCamera(),this.noZoom||this._zoomCamera(),this.noPan||this._panCamera(),this.object.position.addVectors(this.target,this._eye),this.object.isPerspectiveCamera?(this._checkDistances(),this.object.lookAt(this.target),this._lastPosition.distanceToSquared(this.object.position)>fd&&(this.dispatchEvent(pl),this._lastPosition.copy(this.object.position))):this.object.isOrthographicCamera?(this.object.lookAt(this.target),(this._lastPosition.distanceToSquared(this.object.position)>fd||this._lastZoom!==this.object.zoom)&&(this.dispatchEvent(pl),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type.")}reset(){this.state=Yt.NONE,this.keyState=Yt.NONE,this.target.copy(this._target0),this.object.position.copy(this._position0),this.object.up.copy(this._up0),this.object.zoom=this._zoom0,this.object.updateProjectionMatrix(),this._eye.subVectors(this.object.position,this.target),this.object.lookAt(this.target),this.dispatchEvent(pl),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom}_panCamera(){if(ei.copy(this._panEnd).sub(this._panStart),ei.lengthSq()){if(this.object.isOrthographicCamera){const t=(this.object.right-this.object.left)/this.object.zoom/this.domElement.clientWidth,e=(this.object.top-this.object.bottom)/this.object.zoom/this.domElement.clientWidth;ei.x*=t,ei.y*=e}ei.multiplyScalar(this._eye.length()*this.panSpeed),jr.copy(this._eye).cross(this.object.up).setLength(ei.x),jr.add(z0.copy(this.object.up).setLength(ei.y)),this.object.position.add(jr),this.target.add(jr),this.staticMoving?this._panStart.copy(this._panEnd):this._panStart.add(ei.subVectors(this._panEnd,this._panStart).multiplyScalar(this.dynamicDampingFactor))}}_rotateCamera(){Kr.set(this._moveCurr.x-this._movePrev.x,this._moveCurr.y-this._movePrev.y,0);let t=Kr.length();t?(this._eye.copy(this.object.position).sub(this.target),pd.copy(this._eye).normalize(),Zr.copy(this.object.up).normalize(),vl.crossVectors(Zr,pd).normalize(),Zr.setLength(this._moveCurr.y-this._movePrev.y),vl.setLength(this._moveCurr.x-this._movePrev.x),Kr.copy(Zr.add(vl)),_l.crossVectors(Kr,this._eye).normalize(),t*=this.rotateSpeed,gs.setFromAxisAngle(_l,t),this._eye.applyQuaternion(gs),this.object.up.applyQuaternion(gs),this._lastAxis.copy(_l),this._lastAngle=t):!this.staticMoving&&this._lastAngle&&(this._lastAngle*=Math.sqrt(1-this.dynamicDampingFactor),this._eye.copy(this.object.position).sub(this.target),gs.setFromAxisAngle(this._lastAxis,this._lastAngle),this._eye.applyQuaternion(gs),this.object.up.applyQuaternion(gs)),this._movePrev.copy(this._moveCurr)}_zoomCamera(){let t;this.state===Yt.TOUCH_ZOOM_PAN?(t=this._touchZoomDistanceStart/this._touchZoomDistanceEnd,this._touchZoomDistanceStart=this._touchZoomDistanceEnd,this.object.isPerspectiveCamera?this._eye.multiplyScalar(t):this.object.isOrthographicCamera?(this.object.zoom=mi.clamp(this.object.zoom/t,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(t=1+(this._zoomEnd.y-this._zoomStart.y)*this.zoomSpeed,t!==1&&t>0&&(this.object.isPerspectiveCamera?this._eye.multiplyScalar(t):this.object.isOrthographicCamera?(this.object.zoom=mi.clamp(this.object.zoom/t,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),this.staticMoving?this._zoomStart.copy(this._zoomEnd):this._zoomStart.y+=(this._zoomEnd.y-this._zoomStart.y)*this.dynamicDampingFactor)}_getMouseOnScreen(t,e){return qr.set((t-this.screen.left)/this.screen.width,(e-this.screen.top)/this.screen.height),qr}_getMouseOnCircle(t,e){return qr.set((t-this.screen.width*.5-this.screen.left)/(this.screen.width*.5),(this.screen.height+2*(this.screen.top-e))/this.screen.width),qr}_addPointer(t){this._pointers.push(t)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e].pointerId==t.pointerId){this._pointers.splice(e,1);return}}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ft,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0].pointerId?this._pointers[1]:this._pointers[0];return this._pointerPositions[e.pointerId]}_checkDistances(){(!this.noZoom||!this.noPan)&&(this._eye.lengthSq()>this.maxDistance*this.maxDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.maxDistance)),this._zoomStart.copy(this._zoomEnd)),this._eye.lengthSq()<this.minDistance*this.minDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.minDistance)),this._zoomStart.copy(this._zoomEnd)))}}function B0(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i))}function H0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function G0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchEnd(i):this._onMouseUp(),this._removePointer(i),this._pointers.length===0&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp)))}function V0(i){this._removePointer(i)}function W0(){this.enabled!==!1&&(this.keyState=Yt.NONE,window.addEventListener("keydown",this._onKeyDown))}function X0(i){this.enabled!==!1&&(window.removeEventListener("keydown",this._onKeyDown),this.keyState===Yt.NONE&&(i.code===this.keys[Yt.ROTATE]&&!this.noRotate?this.keyState=Yt.ROTATE:i.code===this.keys[Yt.ZOOM]&&!this.noZoom?this.keyState=Yt.ZOOM:i.code===this.keys[Yt.PAN]&&!this.noPan&&(this.keyState=Yt.PAN)))}function $0(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Se.DOLLY:this.state=Yt.ZOOM;break;case Se.ROTATE:this.state=Yt.ROTATE;break;case Se.PAN:this.state=Yt.PAN;break;default:this.state=Yt.NONE}const e=this.keyState!==Yt.NONE?this.keyState:this.state;e===Yt.ROTATE&&!this.noRotate?(this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr)):e===Yt.ZOOM&&!this.noZoom?(this._zoomStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._zoomEnd.copy(this._zoomStart)):e===Yt.PAN&&!this.noPan&&(this._panStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._panEnd.copy(this._panStart)),this.dispatchEvent(ml)}function Y0(i){const t=this.keyState!==Yt.NONE?this.keyState:this.state;t===Yt.ROTATE&&!this.noRotate?(this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY))):t===Yt.ZOOM&&!this.noZoom?this._zoomEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY)):t===Yt.PAN&&!this.noPan&&this._panEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY))}function q0(){this.state=Yt.NONE,this.dispatchEvent(gl)}function j0(i){if(this.enabled!==!1&&this.noZoom!==!0){switch(i.preventDefault(),i.deltaMode){case 2:this._zoomStart.y-=i.deltaY*.025;break;case 1:this._zoomStart.y-=i.deltaY*.01;break;default:this._zoomStart.y-=i.deltaY*25e-5;break}this.dispatchEvent(ml),this.dispatchEvent(gl)}}function Z0(i){this.enabled!==!1&&i.preventDefault()}function K0(i){switch(this._trackPointer(i),this._pointers.length){case 1:this.state=Yt.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(this._pointers[0].pageX,this._pointers[0].pageY)),this._movePrev.copy(this._moveCurr);break;default:this.state=Yt.TOUCH_ZOOM_PAN;const t=this._pointers[0].pageX-this._pointers[1].pageX,e=this._pointers[0].pageY-this._pointers[1].pageY;this._touchZoomDistanceEnd=this._touchZoomDistanceStart=Math.sqrt(t*t+e*e);const n=(this._pointers[0].pageX+this._pointers[1].pageX)/2,s=(this._pointers[0].pageY+this._pointers[1].pageY)/2;this._panStart.copy(this._getMouseOnScreen(n,s)),this._panEnd.copy(this._panStart);break}this.dispatchEvent(ml)}function J0(i){switch(this._trackPointer(i),this._pointers.length){case 1:this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY));break;default:const t=this._getSecondPointerPosition(i),e=i.pageX-t.x,n=i.pageY-t.y;this._touchZoomDistanceEnd=Math.sqrt(e*e+n*n);const s=(i.pageX+t.x)/2,r=(i.pageY+t.y)/2;this._panEnd.copy(this._getMouseOnScreen(s,r));break}}function Q0(i){switch(this._pointers.length){case 0:this.state=Yt.NONE;break;case 1:this.state=Yt.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr);break;case 2:this.state=Yt.TOUCH_ZOOM_PAN;for(let t=0;t<this._pointers.length;t++)if(this._pointers[t].pointerId!==i.pointerId){const e=this._pointerPositions[this._pointers[t].pointerId];this._moveCurr.copy(this._getMouseOnCircle(e.x,e.y)),this._movePrev.copy(this._moveCurr);break}break}this.dispatchEvent(gl)}const Ri=new od,Ne=new R,ni=new R,ce=new me,md={X:new R(1,0,0),Y:new R(0,1,0),Z:new R(0,0,1)},xl={type:"change"},gd={type:"mouseDown",mode:null},_d={type:"mouseUp",mode:null},vd={type:"objectChange"};class tv extends dl{constructor(t,e=null){super(void 0,e);const n=new ov(this);this._root=n;const s=new av;this._gizmo=s,n.add(s);const r=new lv;this._plane=r,n.add(r);const o=this;function a(y,x){let L=x;Object.defineProperty(o,y,{get:function(){return L!==void 0?L:x},set:function(S){L!==S&&(L=S,r[y]=S,s[y]=S,o.dispatchEvent({type:y+"-changed",value:S}),o.dispatchEvent(xl))}}),o[y]=x,r[y]=x,s[y]=x}a("camera",t),a("object",void 0),a("enabled",!0),a("axis",null),a("mode","translate"),a("translationSnap",null),a("rotationSnap",null),a("scaleSnap",null),a("space","world"),a("size",1),a("dragging",!1),a("showX",!0),a("showY",!0),a("showZ",!0),a("minX",-1/0),a("maxX",1/0),a("minY",-1/0),a("maxY",1/0),a("minZ",-1/0),a("maxZ",1/0);const l=new R,c=new R,h=new me,d=new me,u=new R,f=new me,g=new R,_=new R,m=new R,p=0,v=new R;a("worldPosition",l),a("worldPositionStart",c),a("worldQuaternion",h),a("worldQuaternionStart",d),a("cameraPosition",u),a("cameraQuaternion",f),a("pointStart",g),a("pointEnd",_),a("rotationAxis",m),a("rotationAngle",p),a("eye",v),this._offset=new R,this._startNorm=new R,this._endNorm=new R,this._cameraScale=new R,this._parentPosition=new R,this._parentQuaternion=new me,this._parentQuaternionInv=new me,this._parentScale=new R,this._worldScaleStart=new R,this._worldQuaternionInv=new me,this._worldScale=new R,this._positionStart=new R,this._quaternionStart=new me,this._scaleStart=new R,this._getPointer=ev.bind(this),this._onPointerDown=iv.bind(this),this._onPointerHover=nv.bind(this),this._onPointerMove=sv.bind(this),this._onPointerUp=rv.bind(this),e!==null&&this.connect()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(t){if(this.object===void 0||this.dragging===!0)return;t!==null&&Ri.setFromCamera(t,this.camera);const e=yl(this._gizmo.picker[this.mode],Ri);e?this.axis=e.object.name:this.axis=null}pointerDown(t){if(!(this.object===void 0||this.dragging===!0||t!=null&&t.button!==0)&&this.axis!==null){t!==null&&Ri.setFromCamera(t,this.camera);const e=yl(this._plane,Ri,!0);e&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(e.point).sub(this.worldPositionStart)),this.dragging=!0,gd.mode=this.mode,this.dispatchEvent(gd)}}pointerMove(t){const e=this.axis,n=this.mode,s=this.object;let r=this.space;if(n==="scale"?r="local":(e==="E"||e==="XYZE"||e==="XYZ")&&(r="world"),s===void 0||e===null||this.dragging===!1||t!==null&&t.button!==-1)return;t!==null&&Ri.setFromCamera(t,this.camera);const o=yl(this._plane,Ri,!0);if(o){if(this.pointEnd.copy(o.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&e!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),e.indexOf("X")===-1&&(this._offset.x=0),e.indexOf("Y")===-1&&(this._offset.y=0),e.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&e!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(ce.copy(this._quaternionStart).invert()),e.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(Ne.setFromMatrixPosition(s.parent.matrixWorld)),e.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(Ne.setFromMatrixPosition(s.parent.matrixWorld)))),s.position.x=Math.max(this.minX,Math.min(this.maxX,s.position.x)),s.position.y=Math.max(this.minY,Math.min(this.maxY,s.position.y)),s.position.z=Math.max(this.minZ,Math.min(this.maxZ,s.position.z));else if(n==="scale"){if(e.search("XYZ")!==-1){let a=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(a*=-1),ni.set(a,a,a)}else Ne.copy(this.pointStart),ni.copy(this.pointEnd),Ne.applyQuaternion(this._worldQuaternionInv),ni.applyQuaternion(this._worldQuaternionInv),ni.divide(Ne),e.search("X")===-1&&(ni.x=1),e.search("Y")===-1&&(ni.y=1),e.search("Z")===-1&&(ni.z=1);s.scale.copy(this._scaleStart).multiply(ni),this.scaleSnap&&(e.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const a=20/this.worldPosition.distanceTo(Ne.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;e==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(Ne.copy(this.rotationAxis).cross(this.eye))*a):(e==="X"||e==="Y"||e==="Z")&&(this.rotationAxis.copy(md[e]),Ne.copy(md[e]),r==="local"&&Ne.applyQuaternion(this.worldQuaternion),Ne.cross(this.eye),Ne.length()===0?l=!0:this.rotationAngle=this._offset.dot(Ne.normalize())*a),(e==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&e!=="E"&&e!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(ce.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(ce.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(xl),this.dispatchEvent(vd)}}pointerUp(t){t!==null&&t.button!==0||(this.dragging&&this.axis!==null&&(_d.mode=this.mode,this.dispatchEvent(_d)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this._root.dispose()}attach(t){return this.object=t,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(xl),this.dispatchEvent(vd),this.pointStart.copy(this.pointEnd))}getRaycaster(){return Ri}getMode(){return this.mode}setMode(t){this.mode=t}setTranslationSnap(t){this.translationSnap=t}setRotationSnap(t){this.rotationSnap=t}setScaleSnap(t){this.scaleSnap=t}setSize(t){this.size=t}setSpace(t){this.space=t}}function ev(i){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:i.button};{const t=this.domElement.getBoundingClientRect();return{x:(i.clientX-t.left)/t.width*2-1,y:-(i.clientY-t.top)/t.height*2+1,button:i.button}}}function nv(i){if(this.enabled)switch(i.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(i));break}}function iv(i){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(i)),this.pointerDown(this._getPointer(i)))}function sv(i){this.enabled&&this.pointerMove(this._getPointer(i))}function rv(i){this.enabled&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(i)))}function yl(i,t,e){const n=t.intersectObject(i,!0);for(let s=0;s<n.length;s++)if(n[s].object.visible||e)return n[s];return!1}const Jr=new ln,ie=new R(0,1,0),xd=new R(0,0,0),yd=new Xt,Qr=new me,to=new me,bn=new R,Md=new Xt,Vs=new R(1,0,0),Pi=new R(0,1,0),Ws=new R(0,0,1),eo=new R,Xs=new R,$s=new R;class ov extends de{constructor(t){super(),this.isTransformControlsRoot=!0,this.controls=t,this.visible=!1}updateMatrixWorld(t){const e=this.controls;e.object!==void 0&&(e.object.updateMatrixWorld(),e.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):e.object.parent.matrixWorld.decompose(e._parentPosition,e._parentQuaternion,e._parentScale),e.object.matrixWorld.decompose(e.worldPosition,e.worldQuaternion,e._worldScale),e._parentQuaternionInv.copy(e._parentQuaternion).invert(),e._worldQuaternionInv.copy(e.worldQuaternion).invert()),e.camera.updateMatrixWorld(),e.camera.matrixWorld.decompose(e.cameraPosition,e.cameraQuaternion,e._cameraScale),e.camera.isOrthographicCamera?e.camera.getWorldDirection(e.eye).negate():e.eye.copy(e.cameraPosition).sub(e.worldPosition).normalize(),super.updateMatrixWorld(t)}dispose(){this.traverse(function(t){t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}}class av extends de{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const t=new yi({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),e=new Br({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=t.clone();n.opacity=.15;const s=e.clone();s.opacity=.5;const r=t.clone();r.color.setHex(16711680);const o=t.clone();o.color.setHex(65280);const a=t.clone();a.color.setHex(255);const l=t.clone();l.color.setHex(16711680),l.opacity=.5;const c=t.clone();c.color.setHex(65280),c.opacity=.5;const h=t.clone();h.color.setHex(255),h.opacity=.5;const d=t.clone();d.opacity=.25;const u=t.clone();u.color.setHex(16776960),u.opacity=.25,t.clone().color.setHex(16776960);const g=t.clone();g.color.setHex(7895160);const _=new Me(0,.04,.1,12);_.translate(0,.05,0);const m=new fe(.08,.08,.08);m.translate(0,.04,0);const p=new _e;p.setAttribute("position",new te([0,0,0,1,0,0],3));const v=new Me(.0075,.0075,.5,3);v.translate(0,.25,0);function y(G,k){const Y=new Ci(G,.0075,3,64,k*Math.PI*2);return Y.rotateY(Math.PI/2),Y.rotateX(Math.PI/2),Y}function x(){const G=new _e;return G.setAttribute("position",new te([0,0,0,1,1,1],3)),G}const L={X:[[new rt(_,r),[.5,0,0],[0,0,-Math.PI/2]],[new rt(_,r),[-.5,0,0],[0,0,Math.PI/2]],[new rt(v,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new rt(_,o),[0,.5,0]],[new rt(_,o),[0,-.5,0],[Math.PI,0,0]],[new rt(v,o)]],Z:[[new rt(_,a),[0,0,.5],[Math.PI/2,0,0]],[new rt(_,a),[0,0,-.5],[-Math.PI/2,0,0]],[new rt(v,a),null,[Math.PI/2,0,0]]],XYZ:[[new rt(new Ai(.1,0),d.clone()),[0,0,0]]],XY:[[new rt(new fe(.15,.15,.01),h.clone()),[.15,.15,0]]],YZ:[[new rt(new fe(.15,.15,.01),l.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new rt(new fe(.15,.15,.01),c.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},S={X:[[new rt(new Me(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new rt(new Me(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new rt(new Me(.2,0,.6,4),n),[0,.3,0]],[new rt(new Me(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new rt(new Me(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new rt(new Me(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new rt(new Ai(.2,0),n)]],XY:[[new rt(new fe(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new rt(new fe(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new rt(new fe(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},T={START:[[new rt(new Ai(.01,2),s),null,null,null,"helper"]],END:[[new rt(new Ai(.01,2),s),null,null,null,"helper"]],DELTA:[[new Mn(x(),s),null,null,null,"helper"]],X:[[new Mn(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Mn(p,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Mn(p,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},C={XYZE:[[new rt(y(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new rt(y(.5,.5),r)]],Y:[[new rt(y(.5,.5),o),null,[0,0,-Math.PI/2]]],Z:[[new rt(y(.5,.5),a),null,[0,Math.PI/2,0]]],E:[[new rt(y(.75,1),u),null,[0,Math.PI/2,0]]]},E={AXIS:[[new Mn(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},M={XYZE:[[new rt(new Xr(.25,10,8),n)]],X:[[new rt(new Ci(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new rt(new Ci(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new rt(new Ci(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new rt(new Ci(.75,.1,2,24),n)]]},D={X:[[new rt(m,r),[.5,0,0],[0,0,-Math.PI/2]],[new rt(v,r),[0,0,0],[0,0,-Math.PI/2]],[new rt(m,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new rt(m,o),[0,.5,0]],[new rt(v,o)],[new rt(m,o),[0,-.5,0],[0,0,Math.PI]]],Z:[[new rt(m,a),[0,0,.5],[Math.PI/2,0,0]],[new rt(v,a),[0,0,0],[Math.PI/2,0,0]],[new rt(m,a),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new rt(new fe(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new rt(new fe(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new rt(new fe(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new rt(new fe(.1,.1,.1),d.clone())]]},z={X:[[new rt(new Me(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new rt(new Me(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new rt(new Me(.2,0,.6,4),n),[0,.3,0]],[new rt(new Me(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new rt(new Me(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new rt(new Me(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new rt(new fe(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new rt(new fe(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new rt(new fe(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new rt(new fe(.2,.2,.2),n),[0,0,0]]]},P={X:[[new Mn(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Mn(p,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Mn(p,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function U(G){const k=new de;for(const Y in G)for(let X=G[Y].length;X--;){const Q=G[Y][X][0].clone(),dt=G[Y][X][1],_t=G[Y][X][2],Pt=G[Y][X][3],Kt=G[Y][X][4];Q.name=Y,Q.tag=Kt,dt&&Q.position.set(dt[0],dt[1],dt[2]),_t&&Q.rotation.set(_t[0],_t[1],_t[2]),Pt&&Q.scale.set(Pt[0],Pt[1],Pt[2]),Q.updateMatrix();const q=Q.geometry.clone();q.applyMatrix4(Q.matrix),Q.geometry=q,Q.renderOrder=1/0,Q.position.set(0,0,0),Q.rotation.set(0,0,0),Q.scale.set(1,1,1),k.add(Q)}return k}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=U(L)),this.add(this.gizmo.rotate=U(C)),this.add(this.gizmo.scale=U(D)),this.add(this.picker.translate=U(S)),this.add(this.picker.rotate=U(M)),this.add(this.picker.scale=U(z)),this.add(this.helper.translate=U(T)),this.add(this.helper.rotate=U(E)),this.add(this.helper.scale=U(P)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(t){const n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:to;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){const o=s[r];o.visible=!0,o.rotation.set(0,0,0),o.position.copy(this.worldPosition);let a;if(this.camera.isOrthographicCamera?a=(this.camera.top-this.camera.bottom)/this.camera.zoom:a=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),o.scale.set(1,1,1).multiplyScalar(a*this.size/4),o.tag==="helper"){o.visible=!1,o.name==="AXIS"?(o.visible=!!this.axis,this.axis==="X"&&(ce.setFromEuler(Jr.set(0,0,0)),o.quaternion.copy(n).multiply(ce),Math.abs(ie.copy(Vs).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Y"&&(ce.setFromEuler(Jr.set(0,0,Math.PI/2)),o.quaternion.copy(n).multiply(ce),Math.abs(ie.copy(Pi).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Z"&&(ce.setFromEuler(Jr.set(0,Math.PI/2,0)),o.quaternion.copy(n).multiply(ce),Math.abs(ie.copy(Ws).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="XYZE"&&(ce.setFromEuler(Jr.set(0,Math.PI/2,0)),ie.copy(this.rotationAxis),o.quaternion.setFromRotationMatrix(yd.lookAt(xd,ie,Pi)),o.quaternion.multiply(ce),o.visible=this.dragging),this.axis==="E"&&(o.visible=!1)):o.name==="START"?(o.position.copy(this.worldPositionStart),o.visible=this.dragging):o.name==="END"?(o.position.copy(this.worldPosition),o.visible=this.dragging):o.name==="DELTA"?(o.position.copy(this.worldPositionStart),o.quaternion.copy(this.worldQuaternionStart),Ne.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),Ne.applyQuaternion(this.worldQuaternionStart.clone().invert()),o.scale.copy(Ne),o.visible=this.dragging):(o.quaternion.copy(n),this.dragging?o.position.copy(this.worldPositionStart):o.position.copy(this.worldPosition),this.axis&&(o.visible=this.axis.search(o.name)!==-1));continue}o.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(o.name==="X"&&Math.abs(ie.copy(Vs).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Y"&&Math.abs(ie.copy(Pi).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Z"&&Math.abs(ie.copy(Ws).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XY"&&Math.abs(ie.copy(Ws).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="YZ"&&Math.abs(ie.copy(Vs).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XZ"&&Math.abs(ie.copy(Pi).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1)):this.mode==="rotate"&&(Qr.copy(n),ie.copy(this.eye).applyQuaternion(ce.copy(n).invert()),o.name.search("E")!==-1&&o.quaternion.setFromRotationMatrix(yd.lookAt(this.eye,xd,Pi)),o.name==="X"&&(ce.setFromAxisAngle(Vs,Math.atan2(-ie.y,ie.z)),ce.multiplyQuaternions(Qr,ce),o.quaternion.copy(ce)),o.name==="Y"&&(ce.setFromAxisAngle(Pi,Math.atan2(ie.x,ie.z)),ce.multiplyQuaternions(Qr,ce),o.quaternion.copy(ce)),o.name==="Z"&&(ce.setFromAxisAngle(Ws,Math.atan2(ie.y,ie.x)),ce.multiplyQuaternions(Qr,ce),o.quaternion.copy(ce))),o.visible=o.visible&&(o.name.indexOf("X")===-1||this.showX),o.visible=o.visible&&(o.name.indexOf("Y")===-1||this.showY),o.visible=o.visible&&(o.name.indexOf("Z")===-1||this.showZ),o.visible=o.visible&&(o.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),o.material._color=o.material._color||o.material.color.clone(),o.material._opacity=o.material._opacity||o.material.opacity,o.material.color.copy(o.material._color),o.material.opacity=o.material._opacity,this.enabled&&this.axis&&(o.name===this.axis||this.axis.split("").some(function(l){return o.name===l}))&&(o.material.color.setHex(16776960),o.material.opacity=1)}super.updateMatrixWorld(t)}}class lv extends rt{constructor(){super(new os(1e5,1e5,2,2),new yi({visible:!1,wireframe:!0,side:gn,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(t){let e=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(e="local"),eo.copy(Vs).applyQuaternion(e==="local"?this.worldQuaternion:to),Xs.copy(Pi).applyQuaternion(e==="local"?this.worldQuaternion:to),$s.copy(Ws).applyQuaternion(e==="local"?this.worldQuaternion:to),ie.copy(Xs),this.mode){case"translate":case"scale":switch(this.axis){case"X":ie.copy(this.eye).cross(eo),bn.copy(eo).cross(ie);break;case"Y":ie.copy(this.eye).cross(Xs),bn.copy(Xs).cross(ie);break;case"Z":ie.copy(this.eye).cross($s),bn.copy($s).cross(ie);break;case"XY":bn.copy($s);break;case"YZ":bn.copy(eo);break;case"XZ":ie.copy($s),bn.copy(Xs);break;case"XYZ":case"E":bn.set(0,0,0);break}break;case"rotate":default:bn.set(0,0,0)}bn.length()===0?this.quaternion.copy(this.cameraQuaternion):(Md.lookAt(Ne.set(0,0,0),bn,ie),this.quaternion.setFromRotationMatrix(Md)),super.updateMatrixWorld(t)}}it.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ft(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},He.line={uniforms:Wa.merge([it.common,it.fog,it.line]),vertexShader:`
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
		`};class bd extends Bn{static get type(){return"LineMaterial"}constructor(t){super({uniforms:Wa.clone(He.line.uniforms),vertexShader:He.line.vertexShader,fragmentShader:He.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Sd=new xn,no=new R;class Ml extends b0{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new te(t,3)),this.setAttribute("uv",new te(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new cl(e,6,1);return this.setAttribute("instanceStart",new yn(n,3,0)),this.setAttribute("instanceEnd",new yn(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new cl(e,6,1);return this.setAttribute("instanceColorStart",new yn(n,3,0)),this.setAttribute("instanceColorEnd",new yn(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new g0(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xn);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Sd.setFromBufferAttribute(e),this.boundingBox.union(Sd))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zn),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)no.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(no)),no.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(no));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}const bl=new ne,Ed=new R,wd=new R,Re=new ne,Pe=new ne,Sn=new ne,Sl=new R,El=new Xt,Le=new S0,Td=new R,io=new xn,so=new Zn,En=new ne;let wn,Li;function Ad(i,t,e){return En.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),En.multiplyScalar(1/En.w),En.x=Li/e.width,En.y=Li/e.height,En.applyMatrix4(i.projectionMatrixInverse),En.multiplyScalar(1/En.w),Math.abs(Math.max(En.x,En.y))}function cv(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,l=o;a<l;a++){Le.start.fromBufferAttribute(s,a),Le.end.fromBufferAttribute(r,a),Le.applyMatrix4(e);const c=new R,h=new R;wn.distanceSqToSegment(Le.start,Le.end,h,c),h.distanceTo(c)<Li*.5&&t.push({point:h,pointOnLine:c,distance:wn.origin.distanceTo(h),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function hv(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),d=-t.near;wn.at(1,Sn),Sn.w=1,Sn.applyMatrix4(t.matrixWorldInverse),Sn.applyMatrix4(n),Sn.multiplyScalar(1/Sn.w),Sn.x*=r.x/2,Sn.y*=r.y/2,Sn.z=0,Sl.copy(Sn),El.multiplyMatrices(t.matrixWorldInverse,o);for(let u=0,f=h;u<f;u++){if(Re.fromBufferAttribute(l,u),Pe.fromBufferAttribute(c,u),Re.w=1,Pe.w=1,Re.applyMatrix4(El),Pe.applyMatrix4(El),Re.z>d&&Pe.z>d)continue;if(Re.z>d){const y=Re.z-Pe.z,x=(Re.z-d)/y;Re.lerp(Pe,x)}else if(Pe.z>d){const y=Pe.z-Re.z,x=(Pe.z-d)/y;Pe.lerp(Re,x)}Re.applyMatrix4(n),Pe.applyMatrix4(n),Re.multiplyScalar(1/Re.w),Pe.multiplyScalar(1/Pe.w),Re.x*=r.x/2,Re.y*=r.y/2,Pe.x*=r.x/2,Pe.y*=r.y/2,Le.start.copy(Re),Le.start.z=0,Le.end.copy(Pe),Le.end.z=0;const _=Le.closestPointToPointParameter(Sl,!0);Le.at(_,Td);const m=mi.lerp(Re.z,Pe.z,_),p=m>=-1&&m<=1,v=Sl.distanceTo(Td)<Li*.5;if(p&&v){Le.start.fromBufferAttribute(l,u),Le.end.fromBufferAttribute(c,u),Le.start.applyMatrix4(o),Le.end.applyMatrix4(o);const y=new R,x=new R;wn.distanceSqToSegment(Le.start,Le.end,x,y),e.push({point:x,pointOnLine:y,distance:wn.origin.distanceTo(x),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}class dv extends rt{constructor(t=new Ml,e=new bd({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,l=e.count;o<l;o++,a+=2)Ed.fromBufferAttribute(e,o),wd.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+Ed.distanceTo(wd);const r=new cl(s,2,1);return t.setAttribute("instanceDistanceStart",new yn(r,1,0)),t.setAttribute("instanceDistanceEnd",new yn(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;wn=t.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;Li=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),so.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=Li*.5;else{const d=Math.max(s.near,so.distanceToPoint(wn.origin));c=Ad(s,d,l.resolution)}if(so.radius+=c,wn.intersectsSphere(so)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),io.copy(a.boundingBox).applyMatrix4(o);let h;if(n)h=Li*.5;else{const d=Math.max(s.near,io.distanceToPoint(wn.origin));h=Ad(s,d,l.resolution)}io.expandByScalar(h),wn.intersectsBox(io)!==!1&&(n?cv(this,e):hv(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(bl),this.material.uniforms.resolution.value.set(bl.z,bl.w))}}const ro=4096;function uv(i,t,e,n,s,r){i.beginPath(),typeof i.roundRect=="function"?i.roundRect(t,e,n,s,r):i.rect(t,e,n,s)}class fv{constructor(t=4){H(this,"map",new Map);this.resolution=t}clear(){for(const t of this.map.values())t.texture.dispose();this.map.clear()}make(t){const e=new m0(t);return e.colorSpace=$e,e.anisotropy=4,e}text(t,e,n){const s=JSON.stringify(["t",t,e,n??null,this.resolution]),r=this.map.get(s);if(r)return r;const o=this.resolution,a=m=>m.length>e.maxChars?m.slice(0,Math.max(1,e.maxChars-1))+"…":m,l=[...t.split(`
`).map(m=>({t:a(m),px:e.size*o,color:e.color})),...n?.text?n.text.split(`
`).map(m=>({t:a(m),px:n.size*o,color:n.color})):[]],c=e.padding*o,h=document.createElement("canvas");let d=h.getContext("2d"),u=0,f=0;for(const m of l)d.font=`${m.px}px ${e.font}`,u=Math.max(u,d.measureText(m.t).width),f+=m.px*1.25;h.width=Math.min(ro,Math.max(2,Math.ceil(u+c*2))),h.height=Math.min(ro,Math.max(2,Math.ceil(f+c*2))),d=h.getContext("2d"),d.textAlign="center",d.textBaseline="middle",e.background&&(d.fillStyle=e.background,uv(d,0,0,h.width,h.height,e.size*o*.25),d.fill());let g=c;for(const m of l){const p=m.px*1.25;d.font=`${m.px}px ${e.font}`,d.fillStyle=m.color,d.fillText(m.t,h.width/2,g+p/2),g+=p}const _={texture:this.make(h),w:h.width/o,h:h.height/o};return this.map.set(s,_),_}badge(t){const e=JSON.stringify(["b",t]),n=this.map.get(e);if(n)return n;const s=64,r=document.createElement("canvas");r.width=r.height=s;const o=r.getContext("2d");o.fillStyle=t,o.beginPath(),o.arc(s/2,s/2,s/2-2,0,Math.PI*2),o.fill(),o.lineWidth=3,o.strokeStyle="#ffffff",o.stroke(),o.lineWidth=6,o.lineCap="round",o.lineJoin="round",o.beginPath(),o.moveTo(22,42),o.lineTo(42,22),o.moveTo(26,22),o.lineTo(42,22),o.lineTo(42,38),o.stroke();const a={texture:this.make(r),w:1,h:1};return this.map.set(e,a),a}card(t,e,n){const s=n.card,r=t.label??t.id,o=t.body??[],a=JSON.stringify(["c",r,o,e.color,s,this.resolution]),l=this.map.get(a);if(l)return l;const c=this.resolution,h=s.size*c,d=h*1.4,u=s.padding*c,f=document.createElement("canvas").getContext("2d"),g=r.split(`
`);f.font=`bold ${h}px ${s.font}`;const _=Math.max(...g.map(C=>f.measureText(C).width));f.font=`${h}px ${s.font}`;const m=o.length?Math.max(...o.map(C=>C==="---"?0:f.measureText(C).width)):0,p=Math.min(ro,Math.ceil(Math.max(_,m)+u*3)),v=g.length*d+u*1.5,y=o.length?o.length*d+u*1.5:0,x=Math.min(ro,Math.ceil(v+y)),L=document.createElement("canvas");L.width=Math.max(2,p),L.height=Math.max(2,x);const S=L.getContext("2d");S.fillStyle=s.background,S.fillRect(0,0,L.width,L.height),S.fillStyle=s.headerBackground??e.color,S.fillRect(0,0,L.width,v),S.textBaseline="middle",S.textAlign="center",S.font=`bold ${h}px ${s.font}`,S.fillStyle=s.headerColor,g.forEach((C,E)=>S.fillText(C,L.width/2,u*.75+d*(E+.5))),S.textAlign="left",S.font=`${h}px ${s.font}`,o.forEach((C,E)=>{const M=v+u*.75+d*(E+.5);C==="---"?(S.strokeStyle=s.border,S.lineWidth=Math.max(1,c*.3),S.beginPath(),S.moveTo(0,M),S.lineTo(L.width,M),S.stroke()):(S.fillStyle=s.textColor,S.fillText(C,u*1.5,M))}),S.strokeStyle=s.border,S.lineWidth=Math.max(2,c*.5),S.strokeRect(0,0,L.width,L.height);const T={texture:this.make(L),w:L.width/c,h:L.height/c};return this.map.set(a,T),T}}const Cd=`
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
`;function Rd(){if(typeof document>"u"||document.getElementById("gs-styles"))return;const i=document.createElement("style");i.id="gs-styles",i.textContent=Cd,document.head.appendChild(i)}const hn="\0",_s=400,pv=new R(1,0,0),mv=new R(0,1,0),Pd={x:0,y:1,z:2},Ld={x:"#e03131",y:"#2f9e44",z:"#1c7ed6"},Dd=new me,gv=4;class Id{constructor(t,e={},n){H(this,"events",new lo);H(this,"config");H(this,"_graph");H(this,"userConfig");H(this,"container");H(this,"root");H(this,"canvas");H(this,"renderer");H(this,"scene",new d0);H(this,"persp");H(this,"ortho");H(this,"camera");H(this,"controls");H(this,"orbit",null);H(this,"disposeControls",()=>{});H(this,"pointerIsDown",!1);H(this,"activeUntil",0);H(this,"ambient",new M0(16777215,1.8));H(this,"headlight",new y0(16777215,1.6));H(this,"tex");H(this,"width",1);H(this,"height",1);H(this,"ro",null);H(this,"raf",0);H(this,"disposed",!1);H(this,"unsubGraph",()=>{});H(this,"nodeInfo",new Map);H(this,"edgeInfo",new Map);H(this,"layers",new Map);H(this,"buckets",[]);H(this,"arrowMesh",null);H(this,"geoms",new Map);H(this,"colors",new Map);H(this,"selNodes",new Set);H(this,"selEdges",new Set);H(this,"hoverNode",null);H(this,"hoverEdge",null);H(this,"tool","select");H(this,"dirtyStructure",!0);H(this,"dirtyPositions",!1);H(this,"dirtyNodes",!1);H(this,"dirtyEdges",!1);H(this,"dirtyLabels",!1);H(this,"pendingFit",!0);H(this,"pendingLayout",!1);H(this,"sim",null);H(this,"simResolve",null);H(this,"dragIds",[]);H(this,"drag",null);H(this,"down",null);H(this,"lastPointer",{x:0,y:0});H(this,"hoverRaf",0);H(this,"rubber",null);H(this,"guide",null);H(this,"axisKeys",new Set);H(this,"appliedVars",[]);H(this,"tooltipEl");H(this,"boxEl");H(this,"controlsEl",null);H(this,"dimButton",null);H(this,"fsButton",null);H(this,"hiddenGroups",new Set);H(this,"legendEl",null);H(this,"legendRows",[]);H(this,"legendCollapsed",!1);H(this,"statsEl",null);H(this,"statsText",null);H(this,"statsTimer",0);H(this,"benchText","");H(this,"benchmarking",!1);H(this,"gpuName",null);H(this,"perf",{n:0,update:new Float32Array(120),render:new Float32Array(120),stamps:[],rebuildMs:0,positionsMs:0,stepMs:0});H(this,"searchIndex",null);H(this,"searchEl",null);H(this,"searchInput",null);H(this,"searchCount",null);H(this,"searchText","");H(this,"searchActive",!1);H(this,"helpEl",null);H(this,"helpButton",null);H(this,"pointerInside",!1);H(this,"chipEl");H(this,"chipTarget",null);H(this,"tc",null);H(this,"tcHelper",null);H(this,"pivot",new de);H(this,"gizmoMode","translate");H(this,"gizmoDragging",!1);H(this,"gizmoStart",null);H(this,"snapHeld",!1);H(this,"panelEl",null);H(this,"tmpM",new Xt);H(this,"tmpV",new R);H(this,"tmpV2",new R);H(this,"tmpQ",new me);H(this,"tmpS",new R);H(this,"raycaster",new od);H(this,"plane",new Hn);H(this,"simName","force");H(this,"onFullscreenChange",()=>{if(this.disposed)return;const t=this.isFullscreen;this.updateFullscreenButton(),this.resize(),this.events.emit("fullscreenchange",{fullscreen:t})});H(this,"onGraphChange",t=>{t.kind==="position"?this.dirtyPositions=!0:(this.sim&&this.stopLayout(),this.searchIndex=null,this.dirtyStructure=!0),this.requestRender()});H(this,"onCameraChange",()=>{(this.config.label.mode==="screen"||this.config.dimension==="3d")&&(this.dirtyLabels=!0),this.requestRender()});H(this,"tick",()=>{this.raf=0,!this.disposed&&(this.frame(),(this.sim||this.needsContinuousFrames)&&this.requestRender())});H(this,"ndc",new ft);H(this,"onWheel",()=>{this.activeUntil=performance.now()+700,this.requestRender()});H(this,"onPointerDown",t=>{if(this.helpEl&&!t.target.closest?.(".gs-help, .gs-help-btn")&&this.closeHelp(),t.target.closest?.(".gs-ui")||(this.pointerIsDown=!0,this.requestRender(),this.gizmoHovered(t))||t.button!==0)return;const e=this.eventPoint(t);this.lastPointer=e;const n=this.pick(e.x,e.y),s=t.shiftKey,r=this.config.interaction,o=n.kind==="node"&&this.selNodes.has(n.id);if(this.down={x:e.x,y:e.y,hit:n,additive:s,wasSelected:o,moved:!1,button:t.button},this.hideTooltip(),n.kind==="node"){if(this.tool==="connect")this.drag={type:"connect",from:n.id};else if(r.select&&!o&&(s&&r.multiSelect?this.selNodes.add(n.id):(this.selNodes=new Set([n.id]),this.selEdges.clear()),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),r.dragNodes){const a=this.selNodes.has(n.id)?[...this.selNodes]:[n.id],l=this.nodeInfo.get(n.id).body.pos,c=this.worldAt(e.x,e.y,l);if(c){const h=new Map,d=new Map;for(const u of a){const f=this.nodeInfo.get(u)?.body.pos;f&&(h.set(u,[f[0]-c[0],f[1]-c[1],f[2]-c[2]]),d.set(u,[f[0],f[1],f[2]]))}this.drag={type:"nodes",ids:a,primary:n.id,offsets:h,starts:d,anchor:[l[0],l[1],l[2]],px:e.x,py:e.y,moved:!1}}}}else t.shiftKey&&r.select&&r.multiSelect&&(this.drag={type:"box",x0:e.x,y0:e.y});this.drag&&(this.controls.enabled=!1,this.canvas.setPointerCapture(t.pointerId))});H(this,"onPointerMove",t=>{const e=this.eventPoint(t);this.lastPointer=e;const n=this.down;n&&!n.moved&&Math.hypot(e.x-n.x,e.y-n.y)>gv&&(n.moved=!0);const s=this.drag;if(!s){!n&&!(this.tc?.object&&this.tc.axis)&&this.scheduleHover(),this.moveTooltip(e);return}if(s.type==="nodes"){if(!n?.moved)return;s.moved||(s.moved=!0,this.dragIds=s.ids,this.canvas.style.cursor="grabbing",this.events.emit("nodedragstart",{ids:s.ids})),this.dragNodes(s,e)}else if(s.type==="connect"){this.updateRubber(s.from,e);const r=this.pick(e.x,e.y),o=r.kind==="node"?r.id:null;o!==this.hoverNode&&(this.hoverNode=o,this.dirtyNodes=!0,this.requestRender())}else if(n?.moved){const r=Math.min(s.x0,e.x),o=Math.min(s.y0,e.y);this.boxEl.hidden=!1,Object.assign(this.boxEl.style,{left:`${r}px`,top:`${o}px`,width:`${Math.abs(e.x-s.x0)}px`,height:`${Math.abs(e.y-s.y0)}px`})}});H(this,"onPointerUp",t=>{this.pointerIsDown=!1,this.activeUntil=performance.now()+1e3,this.requestRender();const e=this.down,n=this.drag;if(this.down=null,this.drag=null,this.controls.enabled=!0,this.canvas.hasPointerCapture?.(t.pointerId)&&this.canvas.releasePointerCapture(t.pointerId),this.boxEl.hidden=!0,this.removeRubber(),this.setAxisGuide(null),this.canvas.style.cursor=this.tool==="connect"?"crosshair":"",n?.type==="nodes"&&n.moved){for(const r of n.ids)this.sim?.unpin(r,!!this._graph.getNode(r)?.pinned);this.dragIds=[],this.events.emit("nodedragend",{ids:n.ids});return}if(!e||t.type==="pointercancel")return;const s=this.eventPoint(t);if(n?.type==="connect"){const r=this.pick(s.x,s.y);r.kind==="node"&&this.events.emit("connect",{source:n.from,target:r.id});return}if(n?.type==="box"&&e.moved){this.selectInBox(n.x0,n.y0,s.x,s.y,e.additive);return}e.moved||this.handleClick(e.hit,e.additive,e.wasSelected,t)});H(this,"onDblClick",t=>{if(t.target.closest?.(".gs-ui"))return;const e=this.eventPoint(t),n=this.pick(e.x,e.y),s=this.config.interaction.openLinks==="dblclick";if(n.kind==="node"){const r=this._graph.getNode(n.id);r&&this.events.emit("nodedblclick",{id:n.id,node:r,originalEvent:t}),s&&this.openLink("node",n.id)}else if(n.kind==="edge")s&&this.openLink("edge",n.id);else{const r=this.worldAt(e.x,e.y,this.config.dimension==="3d"?this.controls.target.toArray():[0,0,0])??[0,0,0];this.events.emit("backgrounddblclick",{position:r,originalEvent:t})}});H(this,"onPointerLeave",()=>{this.pointerInside=!1,!this.drag&&(this.hideTooltip(),(this.hoverNode||this.hoverEdge)&&(this.hoverNode=this.hoverEdge=null,this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("hover",{kind:null,id:null}),this.requestRender()))});H(this,"onKeyDown",t=>{this.setSnap(t.ctrlKey||t.metaKey);const e=!!t.target?.matches?.("input, textarea, select");if(t.key==="Escape"&&this.helpEl&&this.closeHelp(),t.key==="?"&&this.pointerInside&&!e&&this.config.ui.help&&(t.preventDefault(),this.toggleHelp()),t.key==="Escape"&&this.container.classList.contains("gs-pseudo-fullscreen")&&this.toggleFullscreen(!1),t.ctrlKey||t.metaKey||t.altKey||t.target?.matches?.("input, textarea, select"))return;const s=t.key.toLowerCase();(s==="x"||s==="y"||s==="z")&&!this.axisKeys.has(s)&&(this.axisKeys.add(s),this.refreshAxisDrag())});H(this,"onKeyUp",t=>{this.setSnap(t.ctrlKey||t.metaKey);const e=t.key.toLowerCase();(e==="x"||e==="y"||e==="z")&&this.axisKeys.delete(e)&&this.refreshAxisDrag()});H(this,"onBlur",()=>{this.axisKeys.size&&(this.axisKeys.clear(),this.refreshAxisDrag())});this.container=t,this.userConfig=e,this.config=Ms(e),this._graph=n instanceof js?n:new js(n),this.config.ui.injectStyles&&Rd(),t.classList.add("gs-container"),this.root=document.createElement("div"),this.root.className="gs-root",t.appendChild(this.root),this.renderer=new h0({antialias:this.config.render.antialias,alpha:!0}),this.renderer.setClearColor(0,0),this.canvas=this.renderer.domElement,this.root.appendChild(this.canvas),this.tex=new fv(this.config.label.resolution),this.persp=new tn(this.config.camera.fov,1,1,1e5),this.ortho=new Ya(-1,1,1,-1,.1,1e4),this.camera=this.config.dimension==="3d"?this.persp:this.ortho,this.scene.add(this.ambient,this.headlight,this.headlight.target,this.pivot),this.tooltipEl=document.createElement("div"),this.tooltipEl.className="gs-tooltip gs-ui",this.tooltipEl.hidden=!0,this.boxEl=document.createElement("div"),this.boxEl.className="gs-box",this.boxEl.hidden=!0,this.chipEl=document.createElement("button"),this.chipEl.type="button",this.chipEl.className="gs-chip gs-ui",this.chipEl.hidden=!0,this.chipEl.addEventListener("click",()=>{this.chipTarget&&this.openLink(this.chipTarget.kind,this.chipTarget.id)}),this.root.append(this.tooltipEl,this.boxEl,this.chipEl),this.setupCamera(),this.buildControls(),this.buildSearch(),this.buildStats(),this.applyAppearance(),this.events.on("selection",()=>this.updateLegendSelection()),this.root.addEventListener("pointerdown",this.onPointerDown,!0),this.root.addEventListener("pointermove",this.onPointerMove),this.root.addEventListener("pointerup",this.onPointerUp),this.root.addEventListener("pointercancel",this.onPointerUp),this.root.addEventListener("pointerleave",this.onPointerLeave),this.root.addEventListener("pointerenter",()=>{this.pointerInside=!0}),this.root.addEventListener("dblclick",this.onDblClick),this.root.addEventListener("wheel",this.onWheel,{passive:!0}),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("fullscreenchange",this.onFullscreenChange),typeof ResizeObserver<"u"&&(this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(t)),this.subscribe(),this.resize(),this.afterLoad()}get graph(){return this._graph}on(t,e){return this.events.on(t,e)}load(t){this.stopLayout(),this.unsubGraph(),t instanceof js?this._graph=t:this._graph.load(t,!1),this.subscribe(),this.selNodes.clear(),this.selEdges.clear(),this.hoverNode=this.hoverEdge=null;const e=this._graph.meta.dimension;e&&e!==this.config.dimension&&this.setDimension(e),this.afterLoad()}refresh(){this.dirtyStructure=!0,this.requestRender()}getConfig(){return this.config}getUserConfig(){return this.userConfig}setConfig(t){const{dimension:e,...n}=t;this.applyUserConfig(Ni(this.userConfig,n)),e!==void 0&&this.setDimension(e)}setUserConfig(t){const{dimension:e,...n}=t;this.applyUserConfig({...n,dimension:this.config.dimension}),e!==void 0&&this.setDimension(e)}applyUserConfig(t){const e=this.config.camera.rotation;this.userConfig=t,this.config=Ms(this.userConfig),this.tex.resolution=this.config.label.resolution,this.tex.clear(),this.persp.fov=this.config.camera.fov,this.persp.updateProjectionMatrix(),this.config.dimension==="3d"&&this.config.camera.rotation!==e&&this.setupCamera(!0),this.orbit&&(this.orbit.enableDamping=this.config.camera.damping),this.applyControlLimits(),this.applyAppearance(),this.buildControls(),this.buildSearch(),this.buildStats(),this.closeHelp(),this.setupGizmo(),this.dirtyStructure=!0,this.requestRender()}getDimension(){return this.config.dimension}setDimension(t){t!==this.config.dimension&&(this.stopLayout(),this.userConfig=Ni(this.userConfig,{dimension:t}),this.config=Ms(this.userConfig),this.camera=t==="3d"?this.persp:this.ortho,this.setupCamera(),this.resize(),this.dirtyStructure=!0,this.pendingFit=this.config.camera.autoFit,this.dimButton&&(this.dimButton.textContent=t==="2d"?"3D":"2D"),this.events.emit("dimensionchange",{dimension:t}),this.requestRender())}isFlat(){return this._graph.nodes.every(t=>!t.z)}runLayout(t=this.config.layout.name,e={}){this.stopLayout();const n=this._graph;if(n.nodes.length===0)return Promise.resolve();const s=this.config;To(n,s.dimension,s.layout.idealLength,s.layout.seed);const r={...wo,dimension:s.dimension,spacing:s.layout.spacing,idealLength:s.layout.idealLength,gravity:s.layout.gravity,weightMode:s.layout.weightMode,direction:s.layout.direction,seed:s.layout.seed,gap:s.layout.gap,boxes:hc(n,s,s.dimension==="3d"),...e};if(this.events.emit("layoutstart",{name:t}),t==="force")return this.sim=new bo(n,r),this.simName=t,this.requestRender(),new Promise(a=>{this.simResolve=a});const o=_c(n,t,r);return n.setPositions([...o].filter(([a])=>!n.getNode(a)?.pinned)),s.camera.autoFit&&(this.pendingFit=!0),this.events.emit("layoutend",{name:t,completed:!0}),this.requestRender(),Promise.resolve()}stopLayout(t=!1){if(!this.sim)return;this.sim=null;const e=this.simResolve;this.simResolve=null,t&&this.config.camera.autoFit&&(this.pendingFit=!0),this.events.emit("layoutend",{name:this.simName,completed:t}),e?.(),this.requestRender()}get isLayoutRunning(){return this.sim!==null}fit(t){const e=t?t.map(x=>this.nodeInfo.get(x)).filter(x=>!!x):[...this.nodeInfo.values()],n=!!t,s=this.camera,r=this.config.dimension==="3d";if(e.length===0){this.controls.target.set(0,0,0),r?this.persp.position.set(0,0,300):(this.ortho.zoom=1,this.ortho.position.set(0,0,1e3)),this.ortho.updateProjectionMatrix(),this.controls.update(),this.requestRender();return}let o=1/0,a=1/0,l=1/0,c=-1/0,h=-1/0,d=-1/0;for(const x of e){const[L,S,T]=x.body.pos;o=Math.min(o,L-x.body.hw),c=Math.max(c,L+x.body.hw),a=Math.min(a,S-x.body.hh),h=Math.max(h,S+x.body.hh),l=Math.min(l,T),d=Math.max(d,T)}const u=(o+c)/2,f=(a+h)/2,g=(l+d)/2,_=this.config.camera.fitPadding,m=n?90:10,p=Math.max(c-o,m),v=Math.max(h-a,m),y=d-l;if(r){const x=Math.max(.5*Math.hypot(p,v,y),m/2),L=mi.degToRad(this.persp.fov)/2,S=Math.atan(Math.tan(L)*(this.width/this.height)),T=x/Math.sin(Math.min(L,S))*_*.8,C=this.tmpV.copy(s.position).sub(this.controls.target);C.lengthSq()<1e-9&&C.set(0,0,1),C.normalize(),this.controls.target.set(u,f,g),s.position.set(u,f,g).addScaledVector(C,T)}else{const x=this.width/this.height,L=Math.min(_s*x/p,_s/v)/_;this.ortho.zoom=Math.min(this.config.camera.zoomMax,Math.max(this.config.camera.zoomMin,L)),this.ortho.position.set(u,f,1e3),this.controls.target.set(u,f,0),this.ortho.updateProjectionMatrix()}this.controls.update(),this.requestRender()}zoomBy(t){if(this.config.dimension==="2d"){const e=this.config.camera;this.ortho.zoom=Math.min(e.zoomMax,Math.max(e.zoomMin,this.ortho.zoom*t)),this.ortho.updateProjectionMatrix()}else{const e=this.tmpV.copy(this.persp.position).sub(this.controls.target).multiplyScalar(1/t);this.persp.position.copy(this.controls.target).add(e)}this.controls.update(),this.requestRender()}setTool(t){this.tool=t,this.canvas.style.cursor=t==="connect"?"crosshair":"",this.syncGizmo()}getTool(){return this.tool}getSelection(){return{nodes:[...this.selNodes],edges:[...this.selEdges]}}setSelection(t){this.selNodes=new Set((t.nodes??[]).filter(e=>this._graph.hasNode(e))),this.selEdges=new Set((t.edges??[]).filter(e=>!!this._graph.getEdge(e))),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()}selectAll(){this.setSelection({nodes:this._graph.nodes.map(t=>t.id)})}clearSelection(){(this.selNodes.size||this.selEdges.size)&&this.setSelection({})}getNodeStyle(t){return this.nodeInfo.get(t)?.style}getEdgeStyle(t){return this.edgeInfo.get(t)?.style}get isFullscreen(){return document.fullscreenElement===this.container||this.container.classList.contains("gs-pseudo-fullscreen")}async toggleFullscreen(t){const e=t??!this.isFullscreen;if(e===this.isFullscreen)return;const n=this.container;if(e){if(typeof n.requestFullscreen=="function")try{await n.requestFullscreen();return}catch{}n.classList.add("gs-pseudo-fullscreen")}else if(document.fullscreenElement===n){await document.exitFullscreen();return}else n.classList.remove("gs-pseudo-fullscreen");this.onFullscreenChange()}updateFullscreenButton(){const t=this.fsButton;if(!t)return;const e=this.isFullscreen,n=e?"M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5":"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5";t.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${n}"/></svg>`;const s=e?"Exit full screen":"Full screen";t.title=s,t.setAttribute("aria-label",s)}openLink(t,e){const n=t==="node"?this._graph.getNode(e):this._graph.getEdge(e),s=ri(n?.url,this.config.links);if(!n||!n.url||!s)return!1;const r={url:n.url,resolved:s,kind:t,id:e,handled:!1};if(this.events.emit("link",r),r.handled||this.config.links.target==="event")return!0;switch(this.config.links.target){case"blank":window.open(s,"_blank","noopener");break;case"panel":this.openPanel(s,n.label??e);break;default:window.location.assign(s)}return!0}closePanel(){this.panelEl?.remove(),this.panelEl=null}exportImage(t="image/png",e){this.frame();const n=document.createElement("canvas");n.width=this.canvas.width,n.height=this.canvas.height;const s=n.getContext("2d"),r=this.config.background;if(!r.transparent){if(r.gradientTo){const o=s.createLinearGradient(0,0,0,n.height);o.addColorStop(0,r.color),o.addColorStop(1,r.gradientTo),s.fillStyle=o}else s.fillStyle=r.color;s.fillRect(0,0,n.width,n.height)}return s.drawImage(this.canvas,0,0),n.toDataURL(t,e)}resize(){const t=Math.max(1,this.container.clientWidth),e=Math.max(1,this.container.clientHeight);this.width=t,this.height=e,this.renderer.setPixelRatio(this.config.render.pixelRatio??Math.min(window.devicePixelRatio||1,2)),this.renderer.setSize(t,e);const n=t/e;this.persp.aspect=n,this.persp.updateProjectionMatrix(),this.ortho.left=-_s*n/2,this.ortho.right=_s*n/2,this.ortho.top=_s/2,this.ortho.bottom=-_s/2,this.ortho.updateProjectionMatrix();for(const s of this.buckets)s.mesh.material.resolution.set(t,e);this.controls&&!this.orbit&&this.controls.handleResize(),this.dirtyLabels=!0,this.requestRender()}destroy(){this.disposed=!0,cancelAnimationFrame(this.raf),cancelAnimationFrame(this.hoverRaf),this.ro?.disconnect(),this.unsubGraph(),this.stopLayout(),this.root.removeEventListener("pointerdown",this.onPointerDown,!0),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("fullscreenchange",this.onFullscreenChange),this.container.classList.remove("gs-pseudo-fullscreen"),this.setAxisGuide(null),window.clearInterval(this.statsTimer),this.disposeGizmo(),this.disposeControls(),this.clearScene();for(const t of this.geoms.values())t.dispose();this.tex.clear(),this.renderer.dispose(),this.root.remove(),this.container.classList.remove("gs-container"),this.events.clear()}subscribe(){this.unsubGraph=this._graph.events.on("change",this.onGraphChange)}afterLoad(){const t=this._graph.nodes.some(e=>e.x===void 0||e.y===void 0);this.pendingFit=this.config.camera.autoFit,this.pendingLayout=t&&this.config.layout.autoRun,this.dirtyStructure=!0,this.requestRender()}setupCamera(t=!1){const e=this.config.dimension==="3d",n=e&&this.config.camera.rotation==="free",s=this.controls?this.controls.target.clone():null;if(this.disposeControls(),this.camera=e?this.persp:this.ortho,t||(e?this.persp.position.set(0,0,300):(this.ortho.position.set(0,0,1e3),this.ortho.zoom=1)),e&&this.persp.up.set(0,1,0),n){const r=new k0(this.camera,this.canvas);r.rotateSpeed=2.5,r.zoomSpeed=1.2,r.panSpeed=.8,r.staticMoving=!1,r.dynamicDampingFactor=.12,r.keys=["","",""],r.addEventListener("change",this.onCameraChange),this.disposeControls=()=>{r.removeEventListener("change",this.onCameraChange),r.dispose()},this.orbit=null,this.controls=r}else{const r=new w0(this.camera,this.canvas);r.enableDamping=this.config.camera.damping,r.zoomToCursor=!0,r.addEventListener("change",this.onCameraChange),e?(r.mouseButtons={LEFT:Se.ROTATE,MIDDLE:Se.DOLLY,RIGHT:Se.PAN},r.touches={ONE:mn.ROTATE,TWO:mn.DOLLY_PAN}):(r.enableRotate=!1,r.screenSpacePanning=!0,r.mouseButtons={LEFT:Se.PAN,MIDDLE:Se.DOLLY,RIGHT:Se.PAN},r.touches={ONE:mn.PAN,TWO:mn.DOLLY_PAN}),this.disposeControls=()=>{r.removeEventListener("change",this.onCameraChange),r.dispose()},this.orbit=r,this.controls=r}t&&s&&this.controls.target.copy(s),this.applyControlLimits(),this.controls.update(),this.setupGizmo()}applyControlLimits(){const t=this.config.camera;this.orbit&&(this.orbit.minZoom=t.zoomMin,this.orbit.maxZoom=t.zoomMax),this.controls.minDistance=5,this.controls.maxDistance=5e4}get needsContinuousFrames(){return!this.orbit&&this.config.dimension==="3d"&&(this.pointerIsDown||performance.now()<this.activeUntil)}applyAppearance(){const t=this.config,e=t.background;this.root.style.background=e.transparent?"transparent":e.gradientTo?`linear-gradient(${e.color}, ${e.gradientTo})`:e.color;for(const n of this.appliedVars)this.root.style.removeProperty(`--gs-${n}`);this.appliedVars=Object.keys(t.ui.cssVars);for(const[n,s]of Object.entries(t.ui.cssVars))this.root.style.setProperty(`--gs-${n}`,s);this.tooltipEl.hidden=!0}buildControls(){if(this.controlsEl?.remove(),this.controlsEl=null,!this.config.ui.controls)return;const t=document.createElement("div");t.className="gs-controls gs-ui";const e=(n,s,r)=>{const o=document.createElement("button");return o.type="button",o.className="gs-btn",o.textContent=n,o.title=s,o.setAttribute("aria-label",s),o.addEventListener("click",r),t.appendChild(o),o};e("+","Zoom in",()=>this.zoomBy(1.4)),e("−","Zoom out",()=>this.zoomBy(.7142857142857143)),e("Fit","Fit graph to view",()=>this.fit()),this.dimButton=e(this.config.dimension==="2d"?"3D":"2D","Switch between 2D and 3D",()=>{this.setDimension(this.config.dimension==="2d"?"3d":"2d")}),this.fsButton=null,this.config.ui.fullscreen&&(this.fsButton=e("","Full screen",()=>{this.toggleFullscreen()}),this.updateFullscreenButton()),this.helpButton=null,this.config.ui.help&&(this.helpButton=e("?","Help: the controls of this view",()=>this.toggleHelp()),this.helpButton.classList.add("gs-help-btn")),this.root.appendChild(t),this.controlsEl=t}requestRender(){this.raf||this.disposed||(this.raf=requestAnimationFrame(this.tick))}frame(){const t=performance.now();if(this.sim&&this.stepSimulation(),this.dirtyStructure){const n=performance.now();this.rebuildStructure(),this.perf.rebuildMs=performance.now()-n}if(this.pendingFit&&(this.pendingFit=!1,this.fit()),this.pendingLayout&&(this.pendingLayout=!1,this.runLayout()),this.dirtyPositions){const n=performance.now();this.updatePositions(),this.perf.positionsMs=performance.now()-n}this.dirtyNodes&&(this.dirtyNodes=!1,this.updateNodeInstances()),this.dirtyEdges&&(this.dirtyEdges=!1,this.writeEdges()),this.dirtyLabels&&(this.dirtyLabels=!1,this.updateLabels()),this.controls.update(),this.updateChip(),this.config.dimension==="3d"&&(this.headlight.position.copy(this.persp.position),this.headlight.target.position.copy(this.controls.target),this.headlight.target.updateMatrixWorld());const e=performance.now();this.renderer.render(this.scene,this.camera),this.recordFrame(t,e,performance.now())}recordFrame(t,e,n){const s=this.perf,r=s.n%120;for(s.update[r]=e-t,s.render[r]=n-e,s.n++,s.stamps.push(n);s.stamps.length&&n-s.stamps[0]>1e3;)s.stamps.shift()}stepSimulation(){const t=this.sim;if(!t)return;const e=this._graph.nodes.length,n=e<=1500?3:e<=5e3?2:1;for(const r of this.dragIds){const o=this._graph.getNode(r);o&&t.pin(r,[o.x??0,o.y??0,o.z??0])}const s=performance.now();for(let r=0;r<n;r++)t.step();t.commit(this._graph),this.perf.stepMs=performance.now()-s,t.alpha<.02&&this.stopLayout(!0)}color(t){let e=this.colors.get(t);return e||(e=new zt(t),this.colors.set(t,e)),e}geometryFor(t){let e=this.geoms.get(t);if(e)return e;switch(t){case"circle3d":e=new Xr(.5,24,16);break;case"square3d":case"rectangle3d":e=new fe(1,1,1);break;case"diamond3d":e=new Ai(.62);break;case"hexagon3d":e=new Me(.5,.5,1,6),e.rotateX(Math.PI/2),e.rotateZ(Math.PI/2);break;case"triangle3d":e=new Me(.5,.5,1,3),e.rotateX(-Math.PI/2);break;case"square":case"rectangle":e=new os(1,1);break;case"diamond":e=new ms(.5,4);break;case"hexagon":e=new ms(.5,6);break;case"triangle":e=new ms(.5,3),e.rotateZ(Math.PI/2);break;case"arrow":e=new ol(.5,1,14),e.rotateZ(-Math.PI/2),e.translate(-.5,0,0);break;default:e=new ms(.5,40)}return this.geoms.set(t,e),e}applyMode(t,e){const n=this.config.dimension==="3d";t.transparent=n?e<1:!0,t.opacity=e,t.depthTest=n,t.depthWrite=n}clearScene(){for(const t of this.layers.values())this.scene.remove(t.body,t.outline),t.body.material.dispose(),t.outline.material.dispose(),t.body.dispose(),t.outline.dispose();this.layers.clear();for(const t of this.buckets)this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose();this.buckets=[],this.arrowMesh&&(this.scene.remove(this.arrowMesh),this.arrowMesh.material.dispose(),this.arrowMesh.dispose(),this.arrowMesh=null);for(const t of this.nodeInfo.values())t.sprite&&this.dropSprite(t.sprite),t.badge&&this.dropSprite(t.badge);for(const t of this.edgeInfo.values())t.sprite&&this.dropSprite(t.sprite),t.badge&&this.dropSprite(t.badge);this.nodeInfo.clear(),this.edgeInfo.clear()}dropSprite(t){this.scene.remove(t),t.material.dispose()}makeSprite(t,e){const n=this.config.dimension==="3d",s=new $h({map:t.texture,transparent:!0,depthTest:n,depthWrite:!1}),r=new u0(s);return r.renderOrder=e,r.frustumCulled=!1,this.scene.add(r),r}rebuildStructure(){this.dirtyStructure=!1,this.clearScene();const t=this.config,e=this._graph,n=t.dimension==="3d";To(e,t.dimension,t.layout.idealLength,t.layout.seed);for(const d of[...this.selNodes])e.hasNode(d)||this.selNodes.delete(d);for(const d of[...this.selEdges])e.getEdge(d)||this.selEdges.delete(d);this.hoverNode&&!e.hasNode(this.hoverNode)&&(this.hoverNode=null),this.hoverEdge&&!e.getEdge(this.hoverEdge)&&(this.hoverEdge=null);const s=Qs(e),r=new Map;for(const d of e.nodes){if(this.hiddenGroups.has(d.group??hn))continue;const u=tr(d,t,s),f=_o(u.shape,u.size,t.node.aspect),g={node:d,style:u,body:{pos:[0,0,0],hw:f.hw,hh:f.hh,ellipse:nc(u.shape)},layerKey:null,layer:null,slot:-1};if(u.shape==="card")g.card=this.tex.card(d,u,t),g.body.hw=g.card.w/2,g.body.hh=g.card.h/2,g.body.ellipse=!1,n&&(g.body.hw=g.body.hh=Math.max(g.body.hw,g.body.hh)),g.sprite=this.makeSprite(g.card,4);else{g.layerKey=n?`${u.shape}3d`:u.shape;const _=r.get(g.layerKey)??[];_.push(g),r.set(g.layerKey,_)}this.nodeInfo.set(d.id,g)}for(const[d,u]of r){const f=this.geometryFor(d),g=n?new _0:new yi;this.applyMode(g,t.node.opacity);const _=new yi({side:n?Fe:Pn});this.applyMode(_,t.node.opacity);const m=new sl(f,g,u.length),p=new sl(f,_,u.length);for(const y of[m,p])y.frustumCulled=!1,y.instanceMatrix.setUsage(Oc);p.renderOrder=3,m.renderOrder=4;const v={key:d,body:m,outline:p};u.forEach((y,x)=>{y.layer=v,y.slot=x,m.setColorAt(x,this.color(y.style.color)),p.setColorAt(x,this.color(y.style.borderColor))}),this.layers.set(d,v),this.scene.add(p,m)}if(t.label.show&&e.nodes.length<=t.label.maxCount)for(const d of this.nodeInfo.values()){if(d.card)continue;const u=d.node.sublabel?{text:d.node.sublabel,size:t.label.subSize,color:t.label.subColor}:void 0,f=this.tex.text(d.node.label??d.node.id,{...t.label,color:d.style.labelColor},u);d.sprite=this.makeSprite(f,5)}let o=1/0,a=-1/0;for(const d of e.edges){const u=e.weightOf(d);o=Math.min(o,u),a=Math.max(a,u)}const l=new Map,c=new Map;let h=0;for(const d of e.edges){if(!this.nodeInfo.has(d.source)||!this.nodeInfo.has(d.target))continue;const u=e.weightOf(d),f=Ol(d,u,t,{min:o,max:a}),g=d.source===d.target,_={edge:d,style:f,weight:u,directed:e.isDirected(d),index:0,count:1,flip:!g&&d.source>d.target,self:g,path:[],arrowSlot:-1,bucketKey:`${f.width}|${f.dashed?1:0}`},m=g?`s\0${d.source}`:d.source<d.target?`${d.source}\0${d.target}`:`${d.target}\0${d.source}`,p=l.get(m)??[];p.push(_),l.set(m,p),this.edgeInfo.set(d.id,_),_.directed&&t.edge.arrows&&(_.arrowSlot=h++);let v=c.get(_.bucketKey);if(!v){const y=new bd({color:16777215,linewidth:f.width,vertexColors:!0,dashed:f.dashed,dashSize:t.edge.dashSize,gapSize:t.edge.gapSize});y.resolution.set(this.width,this.height),this.applyMode(y,t.edge.opacity);const x=new dv(new Ml,y);x.frustumCulled=!1,x.renderOrder=1,x.visible=!1,this.scene.add(x),v={key:_.bucketKey,mesh:x,edges:[],dashed:f.dashed},c.set(_.bucketKey,v)}v.edges.push(_)}for(const d of l.values())d.forEach((u,f)=>{u.index=f,u.count=d.length});if(this.buckets=[...c.values()],h>0){const d=new yi;this.applyMode(d,t.edge.opacity);const u=new sl(this.geometryFor("arrow"),d,h);u.frustumCulled=!1,u.renderOrder=2,u.instanceMatrix.setUsage(Oc);for(let f=0;f<h;f++)u.setColorAt(f,this.color("#ffffff"));this.arrowMesh=u,this.scene.add(u)}if(e.edges.length<=t.weight.maxCount)for(const d of this.edgeInfo.values()){const u=this.edgeText(d);u&&(d.img=this.tex.text(u,{...t.weight,maxChars:t.label.maxChars}),d.sprite=this.makeSprite(d.img,5))}if(t.links.badge&&t.interaction.openLinks!=="never"){const d=this.tex.badge(t.links.badgeColor);for(const u of this.nodeInfo.values())ri(u.node.url,t.links)&&(u.badge=this.makeSprite(d,6));for(const u of this.edgeInfo.values())ri(u.edge.url,t.links)&&(u.badge=this.makeSprite(d,6))}for(const d of[...this.selNodes])this.nodeInfo.has(d)||this.selNodes.delete(d);for(const d of[...this.selEdges])this.edgeInfo.has(d)||this.selEdges.delete(d);this.dirtyPositions=!1,this.dirtyNodes=this.dirtyEdges=!1,this.updatePositions(),this.updateLegend()}edgeText(t){const e=this.config.weight,s=e.show==="always"||e.show==="auto"&&t.weight!==1?String(Number(t.weight.toFixed(e.decimals))):"",r=t.edge.label??"";return r&&s?`${r} (${s})`:r||s}updatePositions(){this.dirtyPositions=!1;const t=this.config.dimension==="3d";for(const e of this.nodeInfo.values()){const n=e.node;e.body.pos[0]=n.x??0,e.body.pos[1]=n.y??0,e.body.pos[2]=t?n.z??0:0}this.updateNodeInstances(),this.computePaths(),this.writeEdges(),this.updateLabels()}updateNodeInstances(){const t=this.config,e=t.dimension==="3d",n=this.tmpM;for(const[s,r]of this.nodeInfo){const o=r.layer;if(!o)continue;const a=this.selNodes.has(s),l=s===this.hoverNode,c=a?t.selection.width:l?t.selection.width*.8:r.style.borderWidth,h=r.body.hw*2,d=r.body.hh*2,[u,f,g]=r.body.pos;n.compose(this.tmpV.set(u,f,g),Dd,this.tmpS.set(h,d,e?d:1)),o.body.setMatrixAt(r.slot,n),n.compose(this.tmpV.set(u,f,g),Dd,this.tmpS.set(h+2*c,d+2*c,e?d+2*c:1)),o.outline.setMatrixAt(r.slot,n),o.outline.setColorAt(r.slot,this.color(a?t.selection.color:l?t.selection.hoverColor:r.style.borderColor))}for(const s of this.layers.values())s.body.instanceMatrix.needsUpdate=!0,s.outline.instanceMatrix.needsUpdate=!0,s.outline.instanceColor&&(s.outline.instanceColor.needsUpdate=!0);this.syncGizmo()}computePaths(){const t=this.config,e={spacing:t.edge.curveSpacing,segments:16,dim3:t.dimension==="3d",loopScale:t.edge.loopSize};for(const n of this.edgeInfo.values()){const s=this.nodeInfo.get(n.edge.source)?.body,r=this.nodeInfo.get(n.edge.target)?.body;if(!s||!r){n.path=[];continue}let o=oc(s,r,n.index,n.count,n.flip,n.self,e);n.tip=void 0,n.arrowSlot>=0&&o.length>=2&&(n.tip=lc(o),o=ac(o,t.edge.arrowSize*.9)),n.path=o}}edgeColor(t){const e=this.config.selection;return this.selEdges.has(t.edge.id)?this.color(e.color):t.edge.id===this.hoverEdge?this.color(e.hoverColor):this.color(t.style.color)}writeEdges(){for(const t of this.buckets){let e=0;for(const a of t.edges)e+=Math.max(0,a.path.length-1);const n=new Float32Array(e*6),s=new Float32Array(e*6);let r=0;for(const a of t.edges){const l=this.edgeColor(a);for(let c=1;c<a.path.length;c++){const h=a.path[c-1],d=a.path[c];n[r]=h[0],n[r+1]=h[1],n[r+2]=h[2],n[r+3]=d[0],n[r+4]=d[1],n[r+5]=d[2],s[r]=s[r+3]=l.r,s[r+1]=s[r+4]=l.g,s[r+2]=s[r+5]=l.b,r+=6}}const o=new Ml;e>0&&(o.setPositions(n),o.setColors(s)),t.mesh.geometry.dispose(),t.mesh.geometry=o,t.mesh.visible=e>0,e>0&&t.dashed&&t.mesh.computeLineDistances()}if(this.arrowMesh){const t=this.config.edge.arrowSize;for(const e of this.edgeInfo.values()){if(e.arrowSlot<0)continue;if(!e.tip){this.arrowMesh.setMatrixAt(e.arrowSlot,this.tmpM.makeScale(0,0,0));continue}const n=e.tip.dir;this.tmpQ.setFromUnitVectors(pv,this.tmpV2.set(n[0],n[1],n[2])),this.tmpM.compose(this.tmpV.set(e.tip.tip[0],e.tip.tip[1],e.tip.tip[2]),this.tmpQ,this.tmpS.set(t,t*.8,t*.8)),this.arrowMesh.setMatrixAt(e.arrowSlot,this.tmpM),this.arrowMesh.setColorAt(e.arrowSlot,this.edgeColor(e))}this.arrowMesh.instanceMatrix.needsUpdate=!0,this.arrowMesh.instanceColor&&(this.arrowMesh.instanceColor.needsUpdate=!0)}}updateLabels(){const t=this.config,e=t.label.mode==="screen",n=t.dimension==="3d";for(const s of this.nodeInfo.values()){const r=s.sprite;if(!r)continue;const[o,a,l]=s.body.pos;if(s.card){r.position.set(o,a,l),r.scale.set(s.card.w,s.card.h,1);continue}const c=r.material.map.image,h=this.tex.resolution,d=e?1/this.pxPerUnitAt(o,a,l):1,u=c.width/h*d,f=c.height/h*d;r.scale.set(u,f,1),r.position.set(o,a-s.body.hh-t.label.gap*d-f/2,l),n&&this.towardCamera(r.position,s.body.hw+1)}for(const s of this.edgeInfo.values()){const r=s.sprite;if(!r||!s.img||s.path.length<2){r&&(r.visible=!1);continue}const o=er(s.path,.5),a=e?1/this.pxPerUnitAt(o[0],o[1],o[2]):1;r.visible=!0,r.scale.set(s.img.w*a,s.img.h*a,1),r.position.set(o[0],o[1],o[2]),n&&this.towardCamera(r.position,1.5)}this.updateBadges()}updateBadges(){const t=this.config.links.badgeSize,e=this.config.dimension==="3d";for(const n of this.nodeInfo.values()){const s=n.badge;if(!s)continue;const[r,o,a]=n.body.pos;s.scale.set(t,t,1),s.position.set(r+n.body.hw*.72,o+n.body.hh*.72,a),e&&this.towardCamera(s.position,n.body.hw+2)}for(const n of this.edgeInfo.values()){const s=n.badge;if(!s)continue;if(n.path.length<2){s.visible=!1;continue}const r=er(n.path,.5);s.visible=!0,s.scale.set(t,t,1),s.position.set(r[0]+t*.9,r[1]+t*.9,r[2]),e&&this.towardCamera(s.position,2)}}updateChip(){const t=this.chipEl,e=this.config,n=this.dragIds.length>0||this.gizmoDragging||this.drag?.type==="nodes"&&this.drag.moved;let s=null;if(e.links.chip&&e.interaction.openLinks!=="never"&&!n){if(this.selNodes.size===1&&this.selEdges.size===0){const c=[...this.selNodes][0],h=this.nodeInfo.get(c);if(h&&ri(h.node.url,e.links)){const d=this.pxPerUnitAt(h.body.pos[0],h.body.pos[1],h.body.pos[2]);s={kind:"node",id:c,at:h.body.pos,dx:h.body.hw*d+8,dy:-h.body.hh*d-4}}}else if(this.selEdges.size===1&&this.selNodes.size===0){const c=[...this.selEdges][0],h=this.edgeInfo.get(c);h&&h.path.length>=2&&ri(h.edge.url,e.links)&&(s={kind:"edge",id:c,at:er(h.path,.5),dx:12,dy:-12})}}if(!s){t.hidden||(t.hidden=!0),this.chipTarget=null;return}this.camera.updateMatrixWorld();const r=this.tmpV.set(s.at[0],s.at[1],s.at[2]).project(this.camera);if(r.z<-1||r.z>1){t.hidden=!0,this.chipTarget=null;return}const o=`${e.links.chipLabel} ↗`;t.textContent!==o&&(t.textContent=o),this.chipTarget={kind:s.kind,id:s.id},t.hidden=!1;const a=(r.x*.5+.5)*this.width+s.dx,l=(-r.y*.5+.5)*this.height+s.dy;t.style.left=`${Math.max(4,Math.min(a,this.width-t.offsetWidth-4))}px`,t.style.top=`${Math.max(4,Math.min(l,this.height-t.offsetHeight-4))}px`}linkHint(t){const e=this.config;if(!e.links.hint||e.interaction.openLinks==="never"||!ri(t,e.links))return"";const n=typeof navigator<"u"&&/mac|iphone|ipad/i.test(navigator.platform||navigator.userAgent),s=ho(e.interaction.openLinks,n);return e.links.chip?`${s} to open the page, or select it and use “${e.links.chipLabel}”`:`${s} to open the page`}towardCamera(t,e){const n=this.tmpV2.copy(this.persp.position).sub(t);n.lengthSq()<1e-9||t.addScaledVector(n.normalize(),e)}pxPerUnitAt(t,e,n){if(this.camera===this.ortho)return this.height/((this.ortho.top-this.ortho.bottom)/this.ortho.zoom);const s=this.tmpV2.set(t,e,n).applyMatrix4(this.persp.matrixWorldInverse),r=Math.max(.001,-s.z);return this.height/(2*Math.tan(mi.degToRad(this.persp.fov)/2)*r)}getGizmoMode(){return this.gizmoMode}setGizmoMode(t){this.gizmoMode=t,this.tc?.setMode(t),this.applyGizmoAxes(),this.syncGizmo(),this.events.emit("gizmomode",{mode:t}),this.requestRender()}disposeGizmo(){this.tc&&(this.tc.detach(),this.tcHelper&&this.scene.remove(this.tcHelper),this.tc.dispose(),this.tc=null,this.tcHelper=null,this.gizmoDragging=!1)}setupGizmo(){if(this.disposeGizmo(),!this.config.interaction.gizmo)return;const t=new tv(this.camera,this.canvas);t.setMode(this.gizmoMode),t.setSpace(this.config.gizmo.space),t.setSize(this.config.gizmo.size),t.addEventListener("dragging-changed",n=>{this.controls.enabled=!n.value,n.value?this.beginGizmoDrag():this.endGizmoDrag()}),t.addEventListener("objectChange",()=>this.applyGizmoDrag()),t.addEventListener("change",()=>this.requestRender());const e=typeof t.getHelper=="function"?t.getHelper():t;this.scene.add(e),this.tc=t,this.tcHelper=e,this.applyGizmoAxes(),this.applySnap(),this.syncGizmo()}applyGizmoAxes(){const t=this.tc;t&&(this.config.dimension==="3d"?t.showX=t.showY=t.showZ=!0:this.gizmoMode==="rotate"?(t.showX=!1,t.showY=!1,t.showZ=!0):(t.showX=!0,t.showY=!0,t.showZ=!1))}setSnap(t){t!==this.snapHeld&&(this.snapHeld=t,this.applySnap())}applySnap(){const t=this.tc;if(!t)return;const e=this.config.gizmo;t.setTranslationSnap(this.snapHeld?e.snapTranslate:null),t.setRotationSnap(this.snapHeld?mi.degToRad(e.snapRotate):null),t.setScaleSnap(this.snapHeld?e.snapScale:null)}gizmoHovered(t){const e=this.tc;if(!e||!e.object)return!1;const n=this.canvas.getBoundingClientRect();try{e.pointerHover({x:(t.clientX-n.left)/n.width*2-1,y:-(t.clientY-n.top)/n.height*2+1,button:t.button})}catch{}return!!e.axis}syncGizmo(){const t=this.tc;if(!t)return;const e=[...this.selNodes].filter(s=>this.nodeInfo.has(s));if(!(this.tool==="select"&&e.length>0&&(this.gizmoMode==="translate"||e.length>=2))){t.object&&t.detach();return}if(!this.gizmoDragging){let s=0,r=0,o=0;for(const a of e){const l=this.nodeInfo.get(a).body.pos;s+=l[0],r+=l[1],o+=l[2]}this.pivot.position.set(s/e.length,r/e.length,o/e.length),this.pivot.quaternion.identity(),this.pivot.scale.set(1,1,1),this.pivot.updateMatrixWorld(!0)}t.object!==this.pivot&&t.attach(this.pivot)}beginGizmoDrag(){const t=[...this.selNodes].filter(n=>this.nodeInfo.has(n)),e=new Map;for(const n of t){const s=this.nodeInfo.get(n).body.pos;e.set(n,[s[0],s[1],s[2]])}this.gizmoStart={pivot:this.pivot.position.clone(),nodes:e},this.gizmoDragging=!0,this.dragIds=t,this.events.emit("nodedragstart",{ids:t})}applyGizmoDrag(){const t=this.gizmoStart,e=this.tc;if(!t||!e||!this.gizmoDragging)return;const n=this.config.dimension==="3d",s=t.pivot,r=e.mode,o=this.pivot.position,a=[],l=new R;for(const[c,h]of t.nodes){const d=this._graph.getNode(c);if(!d)continue;let u;r==="translate"?u=[h[0]+o.x-s.x,h[1]+o.y-s.y,h[2]+o.z-s.z]:(l.set(h[0]-s.x,h[1]-s.y,h[2]-s.z),r==="rotate"?l.applyQuaternion(this.pivot.quaternion):l.multiply(this.pivot.scale),u=[s.x+l.x,s.y+l.y,s.z+l.z]),a.push([c,[u[0],u[1],n?u[2]:d.z??0]])}this._graph.setPositions(a)}endGizmoDrag(){const t=this.dragIds;this.gizmoDragging=!1,this.gizmoStart=null,this.dragIds=[];for(const e of t)this.sim?.unpin(e,!!this._graph.getNode(e)?.pinned);this.syncGizmo(),this.events.emit("nodedragend",{ids:t}),this.requestRender()}getGroups(){return this.groupList().map(t=>({name:t.key===hn?null:t.key,count:t.ids.length,color:t.color,visible:!this.hiddenGroups.has(t.key)}))}selectGroup(t,e=!1){const n=t??hn;if(this.searchActive=!1,this.hiddenGroups.has(n))return;const s=this._graph.nodes.filter(a=>(a.group??hn)===n).map(a=>a.id),r=new Set(this.selNodes),o=s.length>0&&s.every(a=>r.has(a));if(e){for(const a of s)o?r.delete(a):r.add(a);this.setSelection({nodes:[...r]})}else o&&r.size===s.length?this.setSelection({}):this.setSelection({nodes:s})}setGroupVisible(t,e){const n=t??hn;e===this.hiddenGroups.has(n)&&(e?this.hiddenGroups.delete(n):this.hiddenGroups.add(n),this.dirtyStructure=!0,this.requestRender(),this.events.emit("groupvisibility",{hidden:[...this.hiddenGroups].map(s=>s===hn?null:s)}))}groupList(){const t=this._graph,e=Qs(t),n=new Map;for(const r of t.nodes){const o=r.group??hn;let a=n.get(o);a||(a={key:o,name:r.group??"No group",ids:[],first:r},n.set(o,a)),a.ids.push(r.id)}const s=[...n.values()];return s.sort((r,o)=>(r.key===hn?1:0)-(o.key===hn?1:0)),s.map(r=>({key:r.key,name:r.name,ids:r.ids,color:tr(r.first,this.config,e).color}))}updateLegend(){if(this.legendEl?.remove(),this.legendEl=null,this.legendRows=[],!this.config.ui.legend)return;const t=this.groupList();if(t.length<2)return;const e=document.createElement("div");e.className="gs-legend gs-ui";const n=document.createElement("button");n.type="button",n.className="gs-legend-head";const s=document.createElement("div");s.className="gs-legend-list";const r=o=>{this.legendCollapsed=o,s.hidden=o,n.textContent=`${o?"▸":"▾"} Groups (${t.length})`,n.setAttribute("aria-expanded",String(!o))};n.addEventListener("click",()=>r(!this.legendCollapsed));for(const o of t){const a=document.createElement("div");a.className="gs-legend-item";const l=this.hiddenGroups.has(o.key),c=document.createElement("button");c.type="button",c.className="gs-legend-row"+(l?" gs-off":""),c.title=l?`${o.name} is hidden`:`Select ${o.name} (Shift+click adds)`;const h=document.createElement("i");h.style.background=o.color;const d=document.createElement("span");d.className="gs-legend-name",d.textContent=o.name;const u=document.createElement("span");u.className="gs-legend-count",u.textContent=String(o.ids.length),c.append(h,d,u),c.addEventListener("click",p=>this.selectGroup(o.key===hn?null:o.key,p.shiftKey||p.ctrlKey||p.metaKey));const f=document.createElement("button");f.type="button",f.className="gs-legend-eye";const g="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",_="M3 3l18 18M10.6 6.2A9.6 9.6 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.7M6.6 7.6A17 17 0 002 12s4 7 10 7a9.4 9.4 0 004.4-1.1";f.innerHTML=`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${l?_:g}"/></svg>`;const m=l?`Show ${o.name}`:`Hide ${o.name}`;f.title=m,f.setAttribute("aria-label",m),f.addEventListener("click",()=>this.setGroupVisible(o.key===hn?null:o.key,l)),a.append(c,f),s.appendChild(a),this.legendRows.push({key:o.key,ids:o.ids,row:c})}e.append(n,s),r(this.legendCollapsed),this.root.appendChild(e),this.legendEl=e,this.updateLegendSelection()}updateLegendSelection(){for(const t of this.legendRows){const e=!this.hiddenGroups.has(t.key)&&t.ids.length>0&&t.ids.every(n=>this.selNodes.has(n));t.row.classList.toggle("gs-on",e),t.row.setAttribute("aria-pressed",String(e))}}setStatsVisible(t){this.setConfig({ui:{stats:t}})}toggleStats(){this.setStatsVisible(!this.config.ui.stats)}buildStats(){if(window.clearInterval(this.statsTimer),this.statsEl?.remove(),this.statsEl=this.statsText=null,!this.config.ui.stats)return;const t=document.createElement("div");t.className="gs-stats gs-ui";const e=document.createElement("pre"),n=document.createElement("button");n.type="button",n.className="gs-btn",n.textContent="Run benchmark",n.title="Moves the camera for a few seconds, first alone, then together with position updates every frame",n.addEventListener("click",()=>{n.disabled=!0,this.benchText="benchmark running ...",this.runBenchmark(4).then(s=>{const r=o=>`${o.fps.toFixed(0)} fps (display capped), frame ${o.frameMsAvg.toFixed(1)} avg / ${o.frameMsP95.toFixed(1)} p95 / ${o.frameMsMax.toFixed(1)} max ms, CPU update ${o.updateMsAvg.toFixed(2)} + render ${o.renderMsAvg.toFixed(2)} ms`;this.benchText=`camera only:  ${r(s.camera)}
with updates: ${r(s.updates)}`,n.disabled=!1})}),t.append(e,n),this.root.appendChild(t),this.statsEl=t,this.statsText=e,this.statsTimer=window.setInterval(()=>this.renderStats(),500),this.renderStats()}renderStats(){const t=this.statsText;if(!t)return;const e=this.perf,n=Math.min(e.n,120);let s=0,r=0,o=0;for(let u=0;u<n;u++)s+=e.update[u],r+=e.render[u],o=Math.max(o,e.update[u]+e.render[u]);const a=performance.now(),l=e.stamps.length>0&&a-e.stamps[e.stamps.length-1]<600,c=this.renderer.info;if(this.gpuName===null){const u=this.renderer.getContext(),f=u.getExtension("WEBGL_debug_renderer_info");this.gpuName=f?String(u.getParameter(f.UNMASKED_RENDERER_WEBGL)):"unknown"}const h=u=>u.toFixed(u<10?2:1),d=[l?`${e.stamps.length} fps`:"idle (draws only when something changes)",`CPU per frame  ${h(n?(s+r)/n:0)} ms avg, ${h(o)} max`,`  update ${h(n?s/n:0)}   render ${h(n?r/n:0)}`,`draw calls ${c.render.calls}   triangles ${c.render.triangles.toLocaleString()}`,`nodes ${this.nodeInfo.size}   edges ${this.edgeInfo.size}   geometries ${c.memory.geometries}   textures ${c.memory.textures}`,`layout ${this.sim?`running, step ${h(e.stepMs)} ms, alpha ${this.sim.alpha.toFixed(2)}`:"idle"}`,`last rebuild ${h(e.rebuildMs)} ms   last position update ${h(e.positionsMs)} ms`,`GPU ${this.gpuName}`];this.benchText&&d.push("",this.benchText),t.textContent=d.join(`
`)}async runBenchmark(t=4){if(this.benchmarking)throw new Error("A benchmark is already running");this.benchmarking=!0,this.stopLayout();const e=this.camera,n={pos:e.position.clone(),zoom:this.ortho.zoom,target:this.controls.target.clone()};try{const s=await this.benchPhase(t*1e3/2,!1),r=await this.benchPhase(t*1e3/2,!0);return{camera:s,updates:r}}finally{e.position.copy(n.pos),this.ortho.zoom=n.zoom,this.ortho.updateProjectionMatrix(),this.controls.target.copy(n.target),this.controls.update(),this.benchmarking=!1,this.requestRender()}}benchPhase(t,e){return new Promise(n=>{const s=[],r=[],o=[],a=this.ortho.zoom,l=performance.now();let c=0,h=0;const d=()=>{const f=[...s].sort((m,p)=>m-p),g=m=>m.length?m.reduce((p,v)=>p+v,0)/m.length:0,_=g(s);n({frames:s.length,fps:_?1e3/_:0,frameMsAvg:_,frameMsP95:f.length?f[Math.floor(f.length*.95)]:0,frameMsMax:f.length?f[f.length-1]:0,updateMsAvg:g(r),renderMsAvg:g(o)})},u=f=>{if(this.disposed)return d();if(c&&s.push(f-c),c=f,h+=.04,this.config.dimension==="2d")this.ortho.zoom=a*(1+.15*Math.sin(h)),this.ortho.updateProjectionMatrix();else{const _=this.tmpV.copy(this.persp.position).sub(this.controls.target);_.applyAxisAngle(mv,.02),this.persp.position.copy(this.controls.target).add(_)}this.dirtyLabels=!0,e&&(this.dirtyPositions=!0),this.frame();const g=(this.perf.n-1)%120;r.push(this.perf.update[g]),o.push(this.perf.render[g]),performance.now()-l<t?requestAnimationFrame(u):d()};requestAnimationFrame(u)})}search(t,e={}){this.searchIndex||(this.searchIndex=new co(this._graph));const n=this.searchIndex.search(t,{fields:this.config.search.fields,minChars:this.config.search.minChars});return(e.select??!0)&&(n.ids.length||n.query.trim()!==""&&!n.tooShort?(this.searchActive=!0,this.setSelection({nodes:n.ids})):this.searchActive&&(this.searchActive=!1,this.setSelection({}))),e.fit&&n.ids.length&&this.fit(n.ids),this.events.emit("search",{query:t,ids:n.ids,tooShort:n.tooShort}),n}clearSearch(){this.searchText="",this.searchInput&&(this.searchInput.value=""),this.search(""),this.searchCount&&(this.searchCount.textContent="")}focusSearch(){this.searchInput?.focus(),this.searchInput?.select()}buildSearch(){if(this.searchEl?.remove(),this.searchEl=this.searchInput=this.searchCount=null,!this.config.ui.search)return;const t=document.createElement("div");t.className="gs-search gs-ui",t.setAttribute("role","search"),t.innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>';const e=document.createElement("input");e.type="text",e.placeholder="Search…",e.setAttribute("aria-label","Search nodes and groups"),e.title="Find nodes while you type. group:Sales, tag:x, id:n1 search one field. Enter zooms to the matches, Esc clears.",e.autocomplete="off",e.spellcheck=!1,e.value=this.searchText;const n=document.createElement("span");n.className="gs-search-count",n.setAttribute("aria-live","polite");const s=document.createElement("button");s.type="button",s.className="gs-search-clear",s.textContent="×",s.title="Clear search",s.setAttribute("aria-label","Clear search");const r=o=>{this.searchText=e.value;const a=this.search(e.value,{fit:o}),l=this.config.search.minChars;n.textContent=a.ids.length?`${a.ids.length} found`:a.tooShort?`${l}+ characters`:e.value.trim()?"No match":"",s.hidden=e.value===""};e.addEventListener("input",()=>r(!1)),e.addEventListener("keydown",o=>{o.key==="Enter"?(o.preventDefault(),r(this.config.search.fitOnEnter)):o.key==="Escape"&&(o.stopPropagation(),this.clearSearch(),s.hidden=!0,e.blur())}),s.addEventListener("click",()=>{this.clearSearch(),s.hidden=!0,e.focus()}),s.hidden=e.value==="",t.append(e,n,s),this.root.appendChild(t),this.searchEl=t,this.searchInput=e,this.searchCount=n}toggleHelp(){this.helpEl?this.closeHelp():this.openHelp()}openHelp(){this.closeHelp();const t=typeof navigator<"u"&&/mac|iphone|ipad/i.test(navigator.platform||navigator.userAgent),e=document.createElement("div");e.className="gs-help gs-ui",e.setAttribute("role","dialog"),e.setAttribute("aria-label","Controls");const n=document.createElement("div");n.className="gs-help-title",n.textContent="Controls",e.appendChild(n);for(const s of Rl(this.config,t)){const r=document.createElement("div");r.className="gs-help-row";const o=document.createElement("b");o.textContent=s.keys;const a=document.createElement("span");a.textContent=s.text,r.append(o,a),e.appendChild(r)}this.root.appendChild(e),this.helpEl=e,this.helpButton?.setAttribute("aria-expanded","true")}closeHelp(){this.helpEl?.remove(),this.helpEl=null,this.helpButton?.setAttribute("aria-expanded","false")}eventPoint(t){const e=this.canvas.getBoundingClientRect();return{x:t.clientX-e.left,y:t.clientY-e.top}}worldAt(t,e,n){this.camera.updateMatrixWorld(),this.ndc.set(t/this.width*2-1,-(e/this.height)*2+1),this.raycaster.setFromCamera(this.ndc,this.camera);const s=this.camera.getWorldDirection(this.tmpV2);this.plane.setFromNormalAndCoplanarPoint(s,this.tmpV.set(n[0],n[1],n[2]));const r=this.raycaster.ray.intersectPlane(this.plane,this.tmpS);return r?[r.x,r.y,r.z]:null}pick(t,e){this.camera.updateMatrixWorld();const n=this.config.dimension==="3d",s=this.tmpV;let r=null,o=1/0;for(const[c,h]of this.nodeInfo){const d=h.body.pos;if(s.set(d[0],d[1],d[2]).project(this.camera),s.z<-1||s.z>1)continue;const u=(s.x*.5+.5)*this.width,f=(-s.y*.5+.5)*this.height,g=this.pxPerUnitAt(d[0],d[1],d[2]),_=(t-u)/Math.max(h.body.hw*g,4),m=(e-f)/Math.max(h.body.hh*g,4);(h.body.ellipse||n?_*_+m*m<=1:Math.abs(_)<=1&&Math.abs(m)<=1)&&s.z<=o&&(r=c,o=s.z)}if(r)return{kind:"node",id:r};if(this.edgeInfo.size>this.config.interaction.pickLimit)return{kind:null,id:null};let a=null,l=6;for(const[c,h]of this.edgeInfo){const d=h.path;if(d.length<2)continue;let u=0,f=0;for(let g=0;g<d.length;g++){s.set(d[g][0],d[g][1],d[g][2]).project(this.camera);const _=(s.x*.5+.5)*this.width,m=(-s.y*.5+.5)*this.height;if(g>0){const p=cc(t,e,u,f,_,m);p<l&&(l=p,a=c)}u=_,f=m}}return a?{kind:"edge",id:a}:{kind:null,id:null}}handleClick(t,e,n,s){const r=this.config.interaction,o=l=>r.openLinks==="click"||r.openLinks==="ctrl-click"&&l,a=s.ctrlKey||s.metaKey;if(t.kind==="node"){const l=this._graph.getNode(t.id);if(!l)return;r.select&&n&&(e?this.selNodes.delete(t.id):this.selNodes.size>1&&(this.selNodes=new Set([t.id])),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),this.events.emit("nodeclick",{id:t.id,node:l,originalEvent:s}),o(a)&&this.openLink("node",t.id)}else if(t.kind==="edge"){const l=this._graph.getEdge(t.id);if(!l)return;r.select&&(e&&r.multiSelect?this.selEdges.delete(t.id)||this.selEdges.add(t.id):(this.selNodes.clear(),this.selEdges=new Set([t.id])),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),this.events.emit("edgeclick",{id:t.id,edge:l,originalEvent:s}),o(a)&&this.openLink("edge",t.id)}else{e||this.clearSelection();const l=this.eventPoint(s),c=this.worldAt(l.x,l.y,this.config.dimension==="3d"?this.controls.target.toArray():[0,0,0])??[0,0,0];this.events.emit("backgroundclick",{position:c,originalEvent:s})}}activeAxes(){if(!this.config.interaction.axisLock)return[];const t=this.config.dimension==="3d";return[...this.axisKeys].filter(e=>t||e!=="z")}toScreen(t){return this.camera.updateMatrixWorld(),this.tmpV.set(t[0],t[1],t[2]).project(this.camera),{x:(this.tmpV.x*.5+.5)*this.width,y:(-this.tmpV.y*.5+.5)*this.height}}dragNodes(t,e){const n=this.config.dimension==="3d",s=this.activeAxes(),r=[];let o=null;if(s.length===1){const a=s[0],l=t.starts.get(t.primary);if(!l)return;const c=[0,0,0];c[Pd[a]]=1;const h=10,d=this.toScreen(l),u=this.toScreen([l[0]+c[0]*h,l[1]+c[1]*h,l[2]+c[2]*h]),f=u.x-d.x,g=u.y-d.y,_=f*f+g*g,m=_>1e-6?((e.x-t.px)*f+(e.y-t.py)*g)/_*h:0;for(const p of t.ids){const v=t.starts.get(p),y=this._graph.getNode(p);!v||!y||r.push([p,[v[0]+c[0]*m,v[1]+c[1]*m,n?v[2]+c[2]*m:y.z??0]])}o={origin:l,axis:a}}else{const a=this.worldAt(e.x,e.y,t.anchor);if(!a)return;const l=s.length===0;for(const c of t.ids){const h=t.offsets.get(c),d=t.starts.get(c),u=this._graph.getNode(c);if(!h||!d||!u)continue;const f=(g,_)=>l||s.includes(_)?a[g]+h[g]:d[g];r.push([c,[f(0,"x"),f(1,"y"),n?f(2,"z"):u.z??0]])}}this.setAxisGuide(o),this._graph.setPositions(r)}setAxisGuide(t){if(!t){if(!this.guide)return;this.scene.remove(this.guide),this.guide.geometry.dispose(),this.guide.material.dispose(),this.guide=null,this.requestRender();return}if(!this.guide){const o=new _e;o.setAttribute("position",new Be(new Float32Array(6),3)),this.guide=new Mn(o,new Br({color:this.color(Ld[t.axis]),depthTest:!1,transparent:!0,opacity:.8})),this.guide.renderOrder=19,this.guide.frustumCulled=!1,this.scene.add(this.guide)}this.guide.material.color.copy(this.color(Ld[t.axis]));const e=this.guide.geometry.getAttribute("position"),n=Pd[t.axis],s=[t.origin[0],t.origin[1],t.origin[2]],r=[t.origin[0],t.origin[1],t.origin[2]];s[n]-=5e4,r[n]+=5e4,e.setXYZ(0,s[0],s[1],s[2]),e.setXYZ(1,r[0],r[1],r[2]),e.needsUpdate=!0,this.requestRender()}refreshAxisDrag(){const t=this.drag;t?.type==="nodes"&&t.moved&&this.dragNodes(t,this.lastPointer)}selectInBox(t,e,n,s,r){this.camera.updateMatrixWorld();const o=Math.min(t,n),a=Math.max(t,n),l=Math.min(e,s),c=Math.max(e,s),h=r?new Set(this.selNodes):new Set;for(const[d,u]of this.nodeInfo){const f=u.body.pos;this.tmpV.set(f[0],f[1],f[2]).project(this.camera);const g=(this.tmpV.x*.5+.5)*this.width,_=(-this.tmpV.y*.5+.5)*this.height;this.tmpV.z>=-1&&this.tmpV.z<=1&&g>=o&&g<=a&&_>=l&&_<=c&&h.add(d)}this.setSelection({nodes:[...h]})}scheduleHover(){!this.config.interaction.hover||this.hoverRaf||(this.hoverRaf=requestAnimationFrame(()=>{this.hoverRaf=0,this.updateHover()}))}updateHover(){if(this.drag||this.disposed)return;const t=this.pick(this.lastPointer.x,this.lastPointer.y),e=t.kind==="node"?t.id:null,n=t.kind==="edge"?t.id:null;e!==this.hoverNode&&(this.dirtyNodes=!0),n!==this.hoverEdge&&(this.dirtyEdges=!0),(e!==this.hoverNode||n!==this.hoverEdge)&&(this.hoverNode=e,this.hoverEdge=n,this.events.emit("hover",{kind:t.kind,id:t.id}),this.showTooltip(t),this.requestRender());const s=t.kind==="node"?this._graph.getNode(t.id):t.kind==="edge"?this._graph.getEdge(t.id):void 0;this.canvas.style.cursor=this.tool==="connect"?"crosshair":s?.url?"pointer":""}hideTooltip(){this.tooltipEl.hidden=!0}showTooltip(t){const e=this.tooltipEl;if(!this.config.interaction.tooltip||t.kind===null){e.hidden=!0;return}e.replaceChildren();const n=(r,o)=>{const a=document.createElement("div");o&&(a.className=o),a.textContent=r,e.appendChild(a)},s=this._graph;if(t.kind==="node"){const r=s.getNode(t.id);if(!r)return;n(r.label??r.id,"gs-tt-title"),r.sublabel&&n(r.sublabel,"gs-tt-muted"),r.group&&n(r.group,"gs-tt-muted"),r.url&&n(r.url,"gs-tt-muted");const o=this.linkHint(r.url);o&&n(o,"gs-tt-hint");for(const[a,l]of Object.entries(r.props??{}))n(`${a}: ${l}`,"gs-tt-muted")}else{const r=s.getEdge(t.id);if(!r)return;const o=l=>s.getNode(l)?.label??l;n(`${o(r.source)} ${s.isDirected(r)?"→":"—"} ${o(r.target)}`,"gs-tt-title"),n(`weight ${s.weightOf(r)}`,"gs-tt-muted"),r.label&&n(r.label),r.url&&n(r.url,"gs-tt-muted");const a=this.linkHint(r.url);a&&n(a,"gs-tt-hint")}e.hidden=!1,this.moveTooltip(this.lastPointer)}moveTooltip(t){const e=this.tooltipEl;if(e.hidden)return;const n=14;let s=t.x+n,r=t.y+n;s+e.offsetWidth>this.width&&(s=Math.max(0,t.x-e.offsetWidth-n)),r+e.offsetHeight>this.height&&(r=Math.max(0,t.y-e.offsetHeight-n)),e.style.left=`${s}px`,e.style.top=`${r}px`}updateRubber(t,e){const n=this.nodeInfo.get(t);if(!n)return;const s=this.worldAt(e.x,e.y,n.body.pos)??n.body.pos;if(!this.rubber){const o=new _e;o.setAttribute("position",new Be(new Float32Array(6),3));const a=new Br({color:this.color(this.config.selection.color),depthTest:!1,transparent:!0});this.rubber=new Mn(o,a),this.rubber.renderOrder=20,this.rubber.frustumCulled=!1,this.scene.add(this.rubber)}const r=this.rubber.geometry.getAttribute("position");r.setXYZ(0,n.body.pos[0],n.body.pos[1],n.body.pos[2]),r.setXYZ(1,s[0],s[1],s[2]),r.needsUpdate=!0,this.requestRender()}removeRubber(){this.rubber&&(this.scene.remove(this.rubber),this.rubber.geometry.dispose(),this.rubber.material.dispose(),this.rubber=null,this.requestRender())}openPanel(t,e){this.closePanel();const n=document.createElement("div");n.className="gs-panel gs-ui";const s=document.createElement("div");s.className="gs-panel-head";const r=document.createElement("span");r.className="gs-panel-title",r.textContent=e;const o=document.createElement("button");o.type="button",o.className="gs-btn",o.textContent="×",o.title="Close",o.setAttribute("aria-label","Close panel"),o.addEventListener("click",()=>this.closePanel()),s.append(r,o);const a=document.createElement("iframe");a.setAttribute("sandbox",this.config.links.panelSandbox),a.title=e,a.src=t,n.append(s,a),this.root.appendChild(n),this.panelEl=n}}const _v="0.1.0",wl=new WeakMap;function vv(i){return wl.get(i)}async function Ud(i){const t=await fetch(i);if(!t.ok)throw new Error(`${i}: HTTP ${t.status}`);return t.text()}async function Nd(i=document){const t=[],e=Array.from(i.querySelectorAll("[data-graphscape]"));return await Promise.all(e.map(async n=>{if(!wl.has(n))try{let s={};n.dataset.config&&(s=Dl(await Ud(n.dataset.config))),n.dataset.theme&&(s={...s,theme:n.dataset.theme}),(n.dataset.dimension==="2d"||n.dataset.dimension==="3d")&&(s={...s,dimension:n.dataset.dimension}),Ms(s);const r=new Id(n,s);if(wl.set(n,r),n.dataset.src){const o=await Ud(n.dataset.src),{graph:a}=ec(o,{filename:n.dataset.src,directed:n.dataset.directed==="true"});r.load(a)}t.push(r)}catch(s){const r=document.createElement("div");r.className="gs-error",r.textContent=`Graphscape: ${s.message}`,n.appendChild(r)}})),t}if(typeof document<"u"){const i=()=>void Nd();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i()}return lt.CONFIG_DOCS=Js,lt.DEFAULT_CONFIG=Ui,lt.DEFAULT_LAYOUT_OPTIONS=wo,lt.DEFAULT_WEIGHT=1,lt.Emitter=lo,lt.FORMATS=Ql,lt.ForceSimulation=bo,lt.Graph=js,lt.GraphView=Id,lt.LAYOUT_NAMES=Cu,lt.NODE_SHAPES=Ze,lt.NodeSearchIndex=co,lt.autoInit=Nd,lt.buildGroupIndex=Qs,lt.circleLayout=uc,lt.computeLayout=_c,lt.configToJsonc=tu,lt.createConfig=Ms,lt.defaultCss=Cd,lt.defineConfig=Kd,lt.describeLinkGesture=ho,lt.detectFormat=tc,lt.diffConfig=Il,lt.estimateTextBox=ws,lt.findUnknownKeys=Ul,lt.generateClustered=qd,lt.generateMixedNetwork=jd,lt.geometry=wu,lt.getInstance=vv,lt.gridLayout=fc,lt.helpLines=Rl,lt.injectStyles=Rd,lt.layeredLayout=dc,lt.mergeConfig=Ni,lt.nodeBoxes=hc,lt.parseCsv=Fl,lt.parseDot=Hl,lt.parseGml=Xl,lt.parseGraph=ec,lt.parseGraphML=ql,lt.parseJson=Kl,lt.parseJsonc=Dl,lt.parseQuery=Cl,lt.placeNewNodes=To,lt.randomLayout=mc,lt.registerTheme=Zd,lt.resolveEdgeStyle=Ol,lt.resolveNodeStyle=tr,lt.resolveUrl=ri,lt.searchNodes=$d,lt.serializeCsv=kl,lt.serializeDot=Gl,lt.serializeGml=$l,lt.serializeGraph=Su,lt.serializeGraphML=jl,lt.serializeJson=Jl,lt.sphereLayout=pc,lt.stripJsonComments=Ll,lt.themes=uo,lt.treeLayout=gc,lt.undocumentedConfigPaths=eu,lt.version=_v,Object.defineProperty(lt,Symbol.toStringTag,{value:"Module"}),lt}({});
//# sourceMappingURL=graphscape.standalone.js.map
