var Graphscape=function(mt){"use strict";var S0=Object.defineProperty;var E0=(mt,Ve,ns)=>Ve in mt?S0(mt,Ve,{enumerable:!0,configurable:!0,writable:!0,value:ns}):mt[Ve]=ns;var $=(mt,Ve,ns)=>E0(mt,typeof Ve!="symbol"?Ve+"":Ve,ns);const Ve=["circle","square","rectangle","diamond","hexagon","triangle","card"];class Ur{constructor(){$(this,"map",new Map)}on(t,e){let n=this.map.get(t);return n||(n=new Set,this.map.set(t,n)),n.add(e),()=>this.off(t,e)}off(t,e){this.map.get(t)?.delete(e)}emit(t,e){const n=this.map.get(t);if(n)for(const s of[...n])s(e)}clear(){this.map.clear()}}const gi=i=>JSON.parse(JSON.stringify(i));class Ls{constructor(t){$(this,"directed",!1);$(this,"meta",{});$(this,"events",new Ur);$(this,"nodeMap",new Map);$(this,"edgeMap",new Map);$(this,"seq",0);$(this,"nodeList",null);$(this,"edgeList",null);t&&this.load(t,!1)}get nodes(){return this.nodeList??(this.nodeList=[...this.nodeMap.values()])}get edges(){return this.edgeList??(this.edgeList=[...this.edgeMap.values()])}hasNode(t){return this.nodeMap.has(t)}getNode(t){return this.nodeMap.get(t)}getEdge(t){return this.edgeMap.get(t)}load(t,e=!0){this.nodeMap.clear(),this.edgeMap.clear(),this.invalidate(),this.directed=!!t.directed,this.meta=gi(t.meta??{});for(const n of t.nodes??[]){const s=gi(n);s.id=String(s.id),this.nodeMap.set(s.id,s)}for(const n of t.edges??[]){const s=gi(n);if(s.source=String(s.source),s.target=String(s.target),s.id=s.id?String(s.id):this.freeId("e",this.edgeMap),!this.nodeMap.has(s.source)||!this.nodeMap.has(s.target))throw new Error(`Edge "${s.id}" references an unknown node`);this.edgeMap.set(s.id,s)}e&&this.emit("structure")}clear(){this.load({directed:this.directed,nodes:[],edges:[]})}addNode(t={}){const e=t.id!==void 0?String(t.id):this.freeId("n",this.nodeMap);if(this.nodeMap.has(e))throw new Error(`Node "${e}" already exists`);const n={...gi(t),id:e};return this.nodeMap.set(e,n),this.emit("structure"),n}updateNode(t,e){const n=this.nodeMap.get(t);if(!n)throw new Error(`Unknown node "${t}"`);return tl(n,e),this.emit("structure"),n}removeNode(t){if(!this.nodeMap.delete(t))return[];const e=[];for(const n of this.edgeMap.values())(n.source===t||n.target===t)&&e.push(n.id);for(const n of e)this.edgeMap.delete(n);return this.emit("structure"),e}addEdge(t){const e=String(t.source),n=String(t.target);if(!this.nodeMap.has(e)||!this.nodeMap.has(n))throw new Error("Edge endpoints must be existing nodes");const s=t.id!==void 0?String(t.id):this.freeId("e",this.edgeMap);if(this.edgeMap.has(s))throw new Error(`Edge "${s}" already exists`);const r={...gi(t),id:s,source:e,target:n};return this.edgeMap.set(s,r),this.emit("structure"),r}updateEdge(t,e){const n=this.edgeMap.get(t);if(!n)throw new Error(`Unknown edge "${t}"`);if(e.source!==void 0&&!this.nodeMap.has(e.source))throw new Error("Unknown source node");if(e.target!==void 0&&!this.nodeMap.has(e.target))throw new Error("Unknown target node");return tl(n,e),this.emit("structure"),n}removeEdge(t){const e=this.edgeMap.delete(t);return e&&this.emit("structure"),e}setDirected(t){this.directed=t,this.emit("structure")}edgesOf(t){return this.edges.filter(e=>e.source===t||e.target===t)}degree(t){let e=0;for(const n of this.edges)n.source===t&&e++,n.target===t&&e++;return e}weightOf(t){return typeof t.weight=="number"&&Number.isFinite(t.weight)?t.weight:1}isDirected(t){return t.directed??this.directed}setPositions(t){for(const[e,n]of t){const s=this.nodeMap.get(e);s&&(s.x=n[0],s.y=n[1],s.z=n[2])}this.events.emit("change",{kind:"position"})}toData(){return gi({directed:this.directed,meta:this.meta,nodes:this.nodes,edges:this.edges})}emit(t){this.invalidate(),this.events.emit("change",{kind:t})}invalidate(){this.nodeList=null,this.edgeList=null}freeId(t,e){let n;do n=t+ ++this.seq;while(e.has(n));return n}}function tl(i,t){const e=i;for(const[n,s]of Object.entries(t))s===void 0?delete e[n]:e[n]=s}const od=/^[a-z][a-z0-9+.-]*:/i;function el(i,t){if(!i)return null;const e=i.replace(/[\u0000-\u001f\u007f\s]+/g,n=>n.includes(" ")?" ":"").trim();return e===""?null:e.startsWith("//")?t.allowAbsolute&&/^\/\/[^/]/.test(e)?e:null:od.test(e)?t.allowAbsolute&&/^(https?|mailto):/i.test(e)?e:null:e.startsWith("/")||e.startsWith("#")||e.startsWith("?")||!t.baseUrl?e:t.baseUrl.replace(/\/+$/,"")+"/"+e.replace(/^\.\//,"")}function is(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function ad(i){const t=Math.max(1,Math.floor(i.nodes)),e=Math.max(1,Math.min(i.clusters??Math.ceil(Math.sqrt(t)/2),t)),n=is(i.seed??1),s=[],r=Array.from({length:e},()=>[]);for(let h=0;h<t;h++){const d=h%e;r[d].push(h),s.push({id:`n${h+1}`,label:`N${h+1}`,group:`Group ${d+1}`})}const o=Math.floor(t*(i.avgDegree??4)/2),a=i.crossRatio??.08,l=new Set,c=[];for(let h=0;c.length<o&&h<o*20;h++){const d=Math.floor(n()*t);let u;if(n()<a)u=Math.floor(n()*t);else{const _=r[d%e];u=_[Math.floor(n()*_.length)]}if(d===u)continue;const p=d<u?`${d}-${u}`:`${u}-${d}`;if(l.has(p))continue;l.add(p);const g={id:`e${c.length+1}`,source:s[d].id,target:s[u].id};i.weighted&&(g.weight=1+Math.floor(n()*5)),c.push(g)}return{directed:!!i.directed,nodes:s,edges:c}}function ld(i){const t=Math.max(20,Math.floor(i.nodes)),e=is(i.seed??1),n=[],s=[],r=new Set,o=v=>v[Math.floor(e()*v.length)],a=(v,y)=>{const x=`n${n.length+1}`;return n.push({id:x,label:`${v[0]}${n.length+1}`,group:v,props:y}),x},l=(v,y,x={},L=!1)=>{const E=v<y?`${v}|${y}`:`${y}|${v}`;if(!L&&(v===y||r.has(E)))return;r.add(E);const A={id:`e${s.length+1}`,source:v,target:y,...x};!("weight"in x)&&e()<.25&&(A.weight=1+Math.floor(e()*4)),s.push(A)},c=v=>Math.floor(t*v),h=c(.04),d=c(.3),u=c(.32),p=c(.14),g=[];for(;n.length<d;){const v=Math.min(3+Math.floor(e()*7),d-n.length);if(v<2)break;const y=Array.from({length:v},()=>a("Cliques",{clique:g.length+1}));for(let x=0;x<v;x++)for(let L=x+1;L<v;L++)l(y[x],y[L]);g.push(y)}const _=[],m=Math.min(5,u-n.length),f=Array.from({length:Math.max(m,2)},()=>a("Hubs"));for(let v=0;v<f.length;v++)for(let y=v+1;y<f.length;y++)l(f[v],f[y]),_.push(f[v],f[y]);for(g.length&&l(f[0],o(o(g)));n.length<d+u;){const v=a("Hubs"),y=1+Math.floor(e()*3);for(let x=0;x<y;x++){const L=o(_);l(v,L),_.push(v,L)}}for(;n.length<d+u+p;){const v=Math.min(3+Math.floor(e()*10),d+u+p-n.length),y=Array.from({length:v},()=>a("Chains"));l(y[0],o(n.slice(0,n.length-v)).id);for(let x=1;x<v;x++)l(y[x-1],y[x]);v>4&&e()<.3&&l(y[v-1],y[0])}for(;n.length<t-h;){const v=a("Leaves");l(v,e()<.5?o(_):o(n.slice(0,n.length-1)).id)}for(;n.length<t;)a("Isolated");for(let v=0;v<Math.ceil(t/80);v++)l(o(n.filter(y=>y.group!=="Isolated")).id,o(n.filter(y=>y.group!=="Isolated")).id);for(let v=0;v<4&&s.length;v++){const y=o(s);l(y.source,y.target,{weight:2+v,label:`parallel ${v+1}`},!0)}for(let v=0;v<3;v++){const y=o(n.filter(x=>x.group!=="Isolated")).id;l(y,y,{label:"self"},!0)}return{directed:!!i.directed,meta:{title:`Mixed network, ${t} nodes`},nodes:n,edges:s}}const Ds='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',Nr={theme:"light",dimension:"2d",background:{color:"#f7f8fa",gradientTo:null,transparent:!1},node:{color:"#4e79a7",shape:"circle",size:14,aspect:1.6,opacity:1,borderColor:"#2b3a4a",borderWidth:1,labelColor:"#1f2933"},edge:{color:"#8b95a1",width:1.5,dashed:!1,opacity:.9,arrows:!0,arrowSize:7,curveSpacing:16,loopSize:.9,dashSize:5,gapSize:3,widthByWeight:{enabled:!1,min:1,max:6}},label:{show:!0,font:Ds,size:6,color:"#1f2933",subSize:4.6,subColor:"#5f6b76",background:null,padding:1,maxCount:1500,maxChars:40,mode:"world",resolution:4,gap:1.5},weight:{show:"auto",font:Ds,size:5,color:"#3b4652",background:"rgba(255,255,255,0.85)",padding:1,maxCount:3e3,decimals:2},card:{background:"#ffffff",border:"#2b3a4a",headerBackground:null,headerColor:"#ffffff",textColor:"#1f2933",font:Ds,size:4.5,padding:2},selection:{color:"#e8590c",hoverColor:"#f59f00",width:2.5},groups:{palette:["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f","#edc948","#b07aa1","#ff9da7","#9c755f","#bab0ac"],colors:{}},rules:[],camera:{fov:50,zoomMin:.02,zoomMax:60,fitPadding:1.25,autoFit:!0,damping:!1,rotation:"orbit"},layout:{name:"force",idealLength:60,spacing:40,gap:14,weightMode:"ignore",gravity:.05,direction:"TB",seed:1,autoRun:!0},interaction:{dragNodes:!0,select:!0,multiSelect:!0,hover:!0,tooltip:!0,axisLock:!0,openLinks:"dblclick",pickLimit:2e4},links:{baseUrl:"",target:"self",allowAbsolute:!1,panelSandbox:"allow-same-origin allow-scripts allow-popups allow-forms"},ui:{controls:!0,fullscreen:!1,injectStyles:!0,cssVars:{font:Ds,"panel-bg":"rgba(255,255,255,0.96)","panel-fg":"#1f2933","panel-border":"#cfd6de",accent:"#e8590c",radius:"4px"}},render:{antialias:!0,pixelRatio:null}},Or={light:{},dark:{background:{color:"#14181d",gradientTo:null},node:{color:"#6aa6d9",borderColor:"#0b0e11",labelColor:"#e6ebf0"},edge:{color:"#7d8996"},label:{color:"#e6ebf0",subColor:"#a9b4bf"},weight:{color:"#d3dae1",background:"rgba(20,24,29,0.85)"},card:{background:"#1d242c",border:"#6b7886",textColor:"#e6ebf0"},selection:{color:"#ffa94d",hoverColor:"#ffd43b"},groups:{palette:["#6aa6d9","#ffa94d","#ff7b7b","#63d2c6","#8fd36b","#f2d45c","#c9a0dc","#ffb3c1","#c4a07a","#aab4bd"]},ui:{cssVars:{"panel-bg":"rgba(29,36,44,0.96)","panel-fg":"#e6ebf0","panel-border":"#3a4652",accent:"#ffa94d"}}},blueprint:{background:{color:"#0d3b66",gradientTo:"#0a2c4d"},node:{color:"#faf0ca",borderColor:"#f4d35e",labelColor:"#faf0ca"},edge:{color:"#a9c7e8"},label:{color:"#faf0ca",subColor:"#a9c7e8"},weight:{color:"#0d3b66",background:"rgba(250,240,202,0.92)"},card:{background:"#0a2c4d",border:"#f4d35e",headerBackground:"#f4d35e",headerColor:"#0d3b66",textColor:"#faf0ca"},selection:{color:"#ee964b",hoverColor:"#f95738"},groups:{palette:["#faf0ca","#f4d35e","#ee964b","#f95738","#a9c7e8","#7fb7be","#d3f3ee","#e3b5a4"]},ui:{cssVars:{"panel-bg":"rgba(10,44,77,0.96)","panel-fg":"#faf0ca","panel-border":"#2f5d8a",accent:"#f4d35e"}}}};function cd(i,t){Or[i]=t}function Is(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)&&Object.getPrototypeOf(i)===Object.prototype}function _i(i,t){if(!Is(i)||!Is(t))return t===void 0?i:t;const e={...i};for(const[n,s]of Object.entries(t))s!==void 0&&(e[n]=Is(s)&&Is(e[n])?_i(e[n],s):Array.isArray(s)?[...s]:s);return e}function ss(i={}){const t=i.theme??Nr.theme,e=Or[t]??{};return _i(_i(Nr,e),i)}function hd(i){return i}function nl(i,t){const e=i.match;return typeof e=="function"?e(t):!(e.id!==void 0&&t.id!==e.id||e.group!==void 0&&t.group!==e.group||e.tag!==void 0&&!t.tags?.includes(e.tag)||e.prop&&t.props?.[e.prop[0]]!==e.prop[1])}function Fr(i){const t=new Map;for(const e of i.nodes)e.group!==void 0&&!t.has(e.group)&&t.set(e.group,t.size);return t}function zr(i,t,e){const{aspect:n,opacity:s,...r}=t.node,o={...r};if(i.group!==void 0){const a=t.groups.palette,l=t.groups.colors[i.group]??(a.length?a[(e.get(i.group)??0)%a.length]:void 0);l&&(o.color=l)}for(const a of t.rules)a.target==="node"&&nl(a,i)&&Object.assign(o,a.style);return i.color&&(o.color=i.color),i.shape&&(o.shape=i.shape),i.size&&i.size>0&&(o.size=i.size),o}function il(i,t,e,n){const{color:s,width:r,dashed:o}=e.edge,a={color:s,width:r,dashed:o},l=e.edge.widthByWeight;if(l.enabled){const c=n.max>n.min?(t-n.min)/(n.max-n.min):0;a.width=l.min+(l.max-l.min)*Math.max(0,Math.min(1,c))}for(const c of e.rules)c.target==="edge"&&nl(c,i)&&Object.assign(a,c.style);return i.color&&(a.color=i.color),i.width&&i.width>0&&(a.width=i.width),i.dashed!==void 0&&(a.dashed=i.dashed),a.width=Math.round(a.width*2)/2,a}function Br(i){const t={};for(const[e,n]of Object.entries(i))n!==void 0&&(t[e]=n);return t}class rs{constructor(){$(this,"directed",!1);$(this,"meta",{});$(this,"warnings",[]);$(this,"nodes",new Map);$(this,"edges",[]);$(this,"edgeIds",new Set)}hasNode(t){return this.nodes.has(t)}node(t){return this.nodes.get(t)}addNode(t,e={}){const n=this.nodes.get(t);if(n)return Object.assign(n,Br(e),{id:t}),n;const s={...Br(e),id:t};return this.nodes.set(t,s),s}ensureNode(t){return this.nodes.get(t)??this.addNode(t)}addEdge(t,e,n={}){this.ensureNode(t),this.ensureNode(e);let s=n.id;if(!s||this.edgeIds.has(s)){let o=this.edges.length+1;for(;this.edgeIds.has(`e${o}`);)o++;s=`e${o}`}this.edgeIds.add(s);const r={...Br(n),id:s,source:t,target:e};return this.edges.push(r),r}build(){return{directed:this.directed,meta:this.meta,nodes:[...this.nodes.values()],edges:this.edges}}}function de(i){if(typeof i=="number")return Number.isFinite(i)?i:void 0;if(typeof i=="string"&&i.trim()!==""){const t=Number(i);return Number.isFinite(t)?t:void 0}}function jn(i){if(typeof i=="boolean")return i;if(typeof i=="number")return i!==0;if(typeof i=="string"){const t=i.trim().toLowerCase();if(["true","1","yes"].includes(t))return!0;if(["false","0","no"].includes(t))return!1}}function os(i){if(!i)return;const t=/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(i.trim());if(!t)return;let e=t[1];return e.length===3&&(e=[...e].map(n=>n+n).join("")),"#"+e.slice(0,6).toUpperCase()}function dd(i,t){const e=[];let n=[],s="",r=!1;for(let o=0;o<i.length;o++){const a=i[o];r?a==='"'?i[o+1]==='"'?(s+='"',o++):r=!1:s+=a:a==='"'&&s===""?r=!0:a===t?(n.push(s),s=""):a===`
`||a==="\r"?(a==="\r"&&i[o+1]===`
`&&o++,n.push(s),s="",n.some(l=>l.trim()!=="")&&e.push(n),n=[]):s+=a}return n.push(s),n.some(o=>o.trim()!=="")&&e.push(n),e}const ud={source:"source",from:"source",src:"source",target:"target",to:"target",dst:"target",dest:"target",weight:"weight",value:"weight",w:"weight",label:"label",url:"url",directed:"directed",group:"group"};function sl(i,t=!1){const e=i.split(/\r?\n/,1)[0]??"",n=[",",";","	"].map(h=>({d:h,n:e.split(h).length})).sort((h,d)=>d.n-h.n)[0].d,s=dd(i,n),r=new rs;if(r.directed=t,s.length===0)return{graph:r.build(),warnings:["Empty file"],format:"csv"};const o=s[0].map(h=>ud[h.trim().toLowerCase()]),a=o.includes("source")&&o.includes("target"),l=a?o:["source","target","weight","label"];for(const h of a?s.slice(1):s){const d={};if(l.forEach((g,_)=>{g&&h[_]!==void 0&&(d[g]=h[_].trim())}),!d.source)continue;if(!d.target){r.addNode(d.source,{label:d.label||void 0,url:d.url||void 0,group:d.group||void 0});continue}let u=de(d.weight),p=d.label||void 0;!a&&u===void 0&&d.weight&&(p=d.weight,u=void 0),r.addEdge(d.source,d.target,{weight:u,label:p,url:d.url||void 0,directed:jn(d.directed)})}const c=r.build();for(const h of c.edges)h.directed===c.directed&&delete h.directed;return{graph:c,warnings:r.warnings,format:"csv"}}const rl=i=>{const t=i===void 0?"":String(i);return/[",\n\r;]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};function ol(i){const t=["source,target,weight,label,url,directed"],e=new Set;for(const n of i.edges)e.add(n.source),e.add(n.target),t.push([n.source,n.target,n.weight??1,n.label,n.url,n.directed??i.directed].map(rl).join(","));for(const n of i.nodes)e.has(n.id)||t.push([n.id,"","",n.label,n.url,""].map(rl).join(","));return t.join(`
`)+`
`}function fd(i){const t=[],e=/-?(?:\d+\.?\d*|\.\d+)/y,n=/[A-Za-z_\u0080-\uffff][A-Za-z_0-9\u0080-\uffff]*/y,s=i.length;let r=0;for(;r<s;){const o=i[r];if(/\s/.test(o))r++;else if(o==="/"&&i[r+1]==="/"){const a=i.indexOf(`
`,r);r=a<0?s:a+1}else if(o==="/"&&i[r+1]==="*"){const a=i.indexOf("*/",r+2);r=a<0?s:a+2}else if(o==="#"&&(r===0||i[r-1]===`
`)){const a=i.indexOf(`
`,r);r=a<0?s:a+1}else if(o==='"'){let a=r+1,l="";for(;a<s&&i[a]!=='"';)i[a]==="\\"&&i[a+1]==='"'?(l+='"',a+=2):i[a]==="\\"&&i[a+1]===`
`?a+=2:l+=i[a++];t.push({t:"str",v:l}),r=a+1}else if(o==="<"){let a=0,l=r;for(;l<s;l++)if(i[l]==="<")a++;else if(i[l]===">"&&--a===0)break;const c=i.slice(r+1,l).replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]*>/g,"");t.push({t:"str",v:c.trim()}),r=l+1}else if(o==="-"&&(i[r+1]===">"||i[r+1]==="-"))t.push({t:"sym",v:i.slice(r,r+2)}),r+=2;else{e.lastIndex=r,n.lastIndex=r;const a=e.exec(i),l=n.exec(i);a?(t.push({t:"id",v:a[0]}),r+=a[0].length):l?(t.push({t:"id",v:l[0]}),r+=l[0].length):(t.push({t:"sym",v:o}),r++)}}return t}const pd={box:"rectangle",rect:"rectangle",rectangle:"rectangle",plaintext:"rectangle",plain:"rectangle",none:"rectangle",square:"square",ellipse:"circle",oval:"circle",circle:"circle",doublecircle:"circle",point:"circle",diamond:"diamond",hexagon:"hexagon",octagon:"hexagon",triangle:"triangle",record:"card",mrecord:"card"},Zn=i=>i.replace(/\\n|\\l|\\r/g,`
`);function al(i){const t=i.replace(/^\/[a-z0-9]+\//i,"");return t.startsWith("#")?t.slice(0,7):t.split(":")[0]}class md{constructor(t){$(this,"p",0);$(this,"b",new rs);$(this,"warnedBoth",!1);this.toks=t}peek(t=0){return this.toks[this.p+t]}next(){const t=this.toks[this.p++];if(!t)throw new Error("Unexpected end of DOT input");return t}isSym(t,e=0){const n=this.peek(e);return!!n&&n.t==="sym"&&n.v===t}parse(){this.peek()?.t==="id"&&this.peek().v.toLowerCase()==="strict"&&this.next();const t=this.next().v.toLowerCase();if(t!=="graph"&&t!=="digraph")throw new Error('Expected "graph" or "digraph"');if(this.b.directed=t==="digraph",!this.isSym("{")){const n=this.next().v;n&&(this.b.meta.title=n)}if(!this.isSym("{"))throw new Error('Expected "{"');this.next();const e={nodeDef:{},edgeDef:{}};this.stmtList(e),e.label&&!this.b.meta.title&&(this.b.meta.title=Zn(e.label))}attrList(){const t={};for(;this.isSym("[");){for(this.next();!this.isSym("]");){const e=this.next();if(e.t==="sym")continue;let n="true";this.isSym("=")&&(this.next(),n=this.next().v),t[e.v]=n}this.next()}return t}stmtList(t){const e=new Set;for(;this.peek();){const n=this.peek();if(n.t==="sym"&&(n.v===";"||n.v===",")){this.next();continue}if(n.t==="sym"&&n.v==="}")return this.next(),e;const s=n.v.toLowerCase();if(n.t==="id"&&(s==="node"||s==="edge"||s==="graph")&&this.isSym("[",1)){this.next();const l=this.attrList();s==="node"?Object.assign(t.nodeDef,l):s==="edge"?Object.assign(t.edgeDef,l):l.label&&(t.label=l.label);continue}if((n.t==="id"||n.t==="str")&&this.isSym("=",1)){this.next(),this.next();const l=this.next().v;n.v==="label"&&(t.label=l);continue}const r=[this.operand(t,e)];let o=!1;for(;this.isSym("->")||this.isSym("--");)this.next(),o=!0,r.push(this.operand(t,e));const a=this.attrList();if(o)for(let l=0;l+1<r.length;l++)for(const c of r[l])for(const h of r[l+1])this.addEdge(c,h,{...t.edgeDef,...a});else for(const l of r[0])this.applyNode(l,a)}throw new Error('Unterminated DOT block (missing "}")')}operand(t,e){const n=this.peek();if(!n)throw new Error("Unexpected end of DOT input");if(n.t==="id"&&n.v.toLowerCase()==="subgraph"||n.t==="sym"&&n.v==="{"){let r="";if(n.t==="id"&&(this.next(),this.isSym("{")||(r=this.next().v)),!this.isSym("{"))return[];this.next();const o={nodeDef:{...t.nodeDef},edgeDef:{...t.edgeDef}},a=this.stmtList(o);if(/^cluster/i.test(r)){const l=o.label?Zn(o.label):r.replace(/^cluster_?/i,"")||r;for(const c of a){const h=this.b.node(c);h&&h.group===void 0&&(h.group=l)}}return a.forEach(l=>e.add(l)),[...a]}const s=this.next().v;for(;this.isSym(":");)this.next(),this.peek()&&this.peek().t!=="sym"&&this.next();return this.b.hasNode(s)||(this.b.addNode(s),this.applyNode(s,t.nodeDef)),e.add(s),[s]}applyNode(t,e){const n=this.b.ensureNode(t),s={};e.label!==void 0&&e.label!=="\\N"&&(s.label=Zn(e.label));const r=e.fillcolor??(e.style?.includes("filled")?e.color:void 0)??e.color;r&&(s.color=al(r));const o=e.shape?pd[e.shape.toLowerCase()]:void 0;o&&(s.shape=o);const a=e.URL??e.href??e.url;a&&(s.url=a),e.group&&(s.group=e.group);const l=e.sublabel??e.xlabel;if(l&&(s.sublabel=Zn(l)),Object.assign(n,s),n.shape==="card"&&e.label!==void 0){const c=e.label.replace(/[{}]/g,"").split("|");n.label=Zn(c[0]).trim()||t;const h=[];c.slice(1).forEach((d,u)=>{u>0&&h.push("---"),h.push(...Zn(d).split(`
`).map(p=>p.trim()).filter(Boolean))}),n.body=h}}addEdge(t,e,n){this.b.hasNode(t)||this.b.addNode(t),this.b.hasNode(e)||this.b.addNode(e);const s=n.dir?.toLowerCase();let r=this.b.directed,o=t,a=e;s==="none"?r=!1:s==="forward"?r=!0:s==="back"?(r=!0,o=e,a=t):s==="both"&&(r=!1,this.warnedBoth||(this.b.warnings.push("Edges with dir=both were imported as undirected"),this.warnedBoth=!0));const l={weight:de(n.weight),label:n.label?Zn(n.label):void 0,url:n.URL??n.href??n.url,color:n.color?al(n.color):void 0,dashed:n.style&&/dashed|dotted/.test(n.style)?!0:void 0,width:de(n.penwidth)},c=this.b.addEdge(o,a,l);r!==this.b.directed&&(c.directed=r)}}function ll(i){const t=new md(fd(i));return t.parse(),{graph:t.b.build(),warnings:t.b.warnings,format:"dot"}}const gd={circle:"ellipse",square:"square",rectangle:"box",diamond:"diamond",hexagon:"hexagon",triangle:"triangle",card:"record"},Fe=i=>`"${i.replace(/"/g,'\\"').replace(/\r?\n/g,"\\n")}"`;function cl(i){const t=[`${i.directed?"digraph":"graph"} ${Fe(i.meta?.title??"G")} {`];for(const n of i.nodes){const s=[];if(n.shape==="card"){const r=n.body?.indexOf("---")??-1,o=r<0?n.body??[]:(n.body??[]).slice(0,r),a=r<0?[]:(n.body??[]).slice(r+1),l=c=>c.join("\\l")+(c.length?"\\l":"");s.push(`label=${Fe(`{${n.label??n.id}|${l(o)}|${l(a)}}`).replace(/\\\\l/g,"\\l")}`,"shape=record")}else n.label!==void 0&&s.push(`label=${Fe(n.label)}`),n.shape&&s.push(`shape=${gd[n.shape]}`);n.sublabel&&s.push(`sublabel=${Fe(n.sublabel)}`),n.color&&s.push(`fillcolor=${Fe(n.color)}`,"style=filled"),n.url&&s.push(`URL=${Fe(n.url)}`),n.group&&s.push(`group=${Fe(n.group)}`),t.push(`  ${Fe(n.id)}${s.length?` [${s.join(", ")}]`:""};`)}const e=i.directed?"->":"--";for(const n of i.edges){const s=[];n.weight!==void 0&&s.push(`weight=${n.weight}`),n.label&&s.push(`label=${Fe(n.label)}`),n.url&&s.push(`URL=${Fe(n.url)}`),n.color&&s.push(`color=${Fe(n.color)}`),n.dashed&&s.push("style=dashed"),n.width&&s.push(`penwidth=${n.width}`),n.directed!==void 0&&n.directed!==i.directed&&s.push(`dir=${n.directed?"forward":"none"}`),t.push(`  ${Fe(n.source)} ${e} ${Fe(n.target)}${s.length?` [${s.join(", ")}]`:""};`)}return t.push("}"),t.join(`
`)+`
`}const _d=i=>i.replace(/&quot;/g,'"').replace(/&amp;/g,"&"),vd=i=>i.replace(/&/g,"&amp;").replace(/"/g,"&quot;");function xd(i){const t=i.replace(/^\s*#.*$/gm,""),e=/\s*(\[|\]|"[^"]*"|[^\s[\]"]+)/y,n=[];let s;for(e.lastIndex=0;(s=e.exec(t))!==null;)n.push(s[1]);return n}function hl(i,t,e){const n=[];for(;t.i<i.length;){const s=i[t.i++];if(s==="]"){if(e)throw new Error('Unexpected "]" in GML');return n}const r=i[t.i++];if(r===void 0)throw new Error("Unexpected end of GML");r==="["?n.push([s,hl(i,t,!1)]):r.startsWith('"')?n.push([s,_d(r.slice(1,-1))]):n.push([s,de(r)??r])}if(!e)throw new Error("Unterminated list in GML");return n}const kr=(i,t)=>i.find(([e])=>e===t)?.[1],ve=(i,t)=>{const e=kr(i,t);return typeof e=="string"||typeof e=="number"?String(e):void 0},Nn=(i,t)=>{const e=kr(i,t);return typeof e=="number"?e:typeof e=="string"?de(e):void 0},dl=(i,t)=>{const e=kr(i,t);return Array.isArray(e)?e:void 0};function ul(i){const t=hl(xd(i),{i:0},!0),e=dl(t,"graph");if(!e)throw new Error("GML document contains no graph [ ... ]");const n=new rs;n.directed=Nn(e,"directed")===1;const s=ve(e,"label");s&&(n.meta.title=s);for(const[a,l]of e){if(a!=="node"||!Array.isArray(l))continue;const c=ve(l,"gsId"),h=c??ve(l,"id");if(h===void 0){n.warnings.push("Skipped a node without id");continue}const d=dl(l,"graphics"),u=ve(l,"shape"),p=ve(l,"body");n.addNode(h,{label:ve(l,"label"),sublabel:ve(l,"sublabel"),x:d?Nn(d,"x"):void 0,y:d?Nn(d,"y"):void 0,z:d?Nn(d,"z"):void 0,group:ve(l,"group"),url:ve(l,"url"),color:ve(l,"color")??(d?ve(d,"fill"):void 0),size:Nn(l,"size"),shape:u&&Ve.includes(u)?u:void 0,body:p?p.split(`
`):void 0}),c!==void 0&&(n.node(h)._gml=ve(l,"id"))}const r=new Map;for(const a of n.build().nodes){const l=a._gml;l!==void 0&&r.set(l,a.id),delete a._gml}const o=a=>a===void 0?void 0:r.get(a)??a;for(const[a,l]of e){if(a!=="edge"||!Array.isArray(l))continue;const c=o(ve(l,"source")),h=o(ve(l,"target"));if(c===void 0||h===void 0){n.warnings.push("Skipped an edge without source/target");continue}const d={weight:Nn(l,"weight")??Nn(l,"value"),label:ve(l,"label"),url:ve(l,"url"),color:ve(l,"color")},u=Nn(l,"directed");u!==void 0&&u===1!==n.directed&&(d.directed=u===1),n.addEdge(c,h,d)}return{graph:n.build(),warnings:n.warnings,format:"gml"}}function fl(i){const t=s=>`"${vd(s)}"`,e=new Map;i.nodes.forEach((s,r)=>e.set(s.id,r));const n=["graph [",`  directed ${i.directed?1:0}`];i.meta?.title&&n.push(`  label ${t(i.meta.title)}`);for(const s of i.nodes)n.push("  node [",`    id ${e.get(s.id)}`,`    gsId ${t(s.id)}`),s.label!==void 0&&n.push(`    label ${t(s.label)}`),s.sublabel&&n.push(`    sublabel ${t(s.sublabel)}`),(s.x!==void 0||s.y!==void 0)&&n.push(`    graphics [ x ${s.x??0} y ${s.y??0}${s.z!==void 0?` z ${s.z}`:""} ]`),s.group&&n.push(`    group ${t(s.group)}`),s.url&&n.push(`    url ${t(s.url)}`),s.color&&n.push(`    color ${t(s.color)}`),s.shape&&n.push(`    shape ${t(s.shape)}`),s.size!==void 0&&n.push(`    size ${s.size}`),s.body?.length&&n.push(`    body ${t(s.body.join(`
`))}`),n.push("  ]");for(const s of i.edges)n.push("  edge [",`    source ${e.get(s.source)}`,`    target ${e.get(s.target)}`),s.weight!==void 0&&n.push(`    weight ${s.weight}`),s.label&&n.push(`    label ${t(s.label)}`),s.url&&n.push(`    url ${t(s.url)}`),s.color&&n.push(`    color ${t(s.color)}`),s.directed!==void 0&&s.directed!==i.directed&&n.push(`    directed ${s.directed?1:0}`),n.push("  ]");return n.push("]"),n.join(`
`)+`
`}const yd={lt:"<",gt:">",amp:"&",quot:'"',apos:"'"};function Hr(i){return i.includes("&")?i.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(t,e)=>{if(e[0]==="#"){const n=e[1].toLowerCase()==="x"?parseInt(e.slice(2),16):parseInt(e.slice(1),10);return Number.isFinite(n)&&n>0&&n<=1114111?String.fromCodePoint(n):t}return yd[e.toLowerCase()]??t}):i}function xe(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Md(i){const t={name:"#root",attrs:{},children:[],text:""},e=[t],n=/<(\/?)([^\s/>!?]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/y,s=/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,r=i.length;let o=i.charCodeAt(0)===65279?1:0;for(;o<r;){const a=e[e.length-1],l=i.indexOf("<",o);if(l===-1){a.text+=Hr(i.slice(o));break}if(l>o&&(a.text+=Hr(i.slice(o,l))),o=l,i.startsWith("<!--",o)){const c=i.indexOf("-->",o+4);if(c<0)throw new Error("Unterminated XML comment");o=c+3}else if(i.startsWith("<![CDATA[",o)){const c=i.indexOf("]]>",o);if(c<0)throw new Error("Unterminated CDATA section");a.text+=i.slice(o+9,c),o=c+3}else if(i.startsWith("<?",o)){const c=i.indexOf("?>",o);if(c<0)throw new Error("Unterminated processing instruction");o=c+2}else if(i.startsWith("<!",o)){let c=0,h=o+2;for(;h<r;h++){const d=i[h];if(d==="[")c++;else if(d==="]")c--;else if(d===">"&&c<=0)break}o=h+1}else{n.lastIndex=o;const c=n.exec(i);if(!c)throw new Error(`Malformed XML near offset ${o}`);if(o=n.lastIndex,c[1]){if(e.length<2||e[e.length-1].name!==c[2])throw new Error(`Unexpected closing tag </${c[2]}>`);e.pop()}else{const h={};s.lastIndex=0;let d;for(;(d=s.exec(c[3]))!==null;)h[d[1]]=Hr(d[2]??d[3]??"");const u={name:c[2],attrs:h,children:[],text:""};a.children.push(u),c[4]||e.push(u)}}}if(e.length!==1)throw new Error(`Unclosed XML element <${e[e.length-1].name}>`);if(t.children.length===0)throw new Error("Empty XML document");return t.children[0]}const Kn=i=>i.name.slice(i.name.indexOf(":")+1);function as(i,t){return i.children.filter(e=>Kn(e)===t)}function We(i,t){for(const e of i.children){if(t(e))return e;const n=We(e,t);if(n)return n}}const Sd=new Set(["ShapeNode","GenericNode","ImageNode","SVGNode","UMLClassNode","GroupNode","GenericGroupNode","TableNode"]),Ed=new Set(["PolyLineEdge","ArcEdge","QuadCurveEdge","SplineEdge","BezierEdge","GenericEdge","ImageEdge"]),pl=new Set(["GroupNode","GenericGroupNode"]),bd={rectangle:"rectangle",rectangle3d:"rectangle",roundrectangle:"rectangle",parallelogram:"rectangle",ellipse:"circle",diamond:"diamond",hexagon:"hexagon",octagon:"hexagon",triangle:"triangle",trapezoid:"triangle",trapezoid2:"triangle",fatarrow:"triangle",fatarrow2:"triangle"},Jn=i=>i?(i.text+i.children.map(t=>Jn(t)).join("")).trim():"",vn=i=>t=>Kn(t)===i;function wd(i,t){return t==="boolean"?i.trim().toLowerCase()==="true":["int","long","float","double"].includes(t)?de(i)??i:i}function Gr(i){return Math.round(i*100)/100}function ml(i,t={}){const e=Md(i);if(Kn(e)!=="graphml")throw new Error("Not a GraphML document (missing <graphml> root)");const n=t.scale??.5,s=new Map;for(const p of as(e,"key"))s.set(p.attrs.id,{id:p.attrs.id,name:p.attrs["attr.name"]??"",type:p.attrs["attr.type"]??"string",target:p.attrs.for??"all",yType:p.attrs["yfiles.type"]});const r=as(e,"graph")[0];if(!r)throw new Error("GraphML document contains no <graph>");const o=new rs;o.directed=r.attrs.edgedefault==="directed";const a=[],l=(p,g)=>{for(const _ of p.children){const m=Kn(_);if(m==="node"){const f=o.addNode(_.attrs.id,{group:g});h(_,f);const v=as(_,"graph")[0];if(v){const y=f.label?.split(`
`)[0]||f.id;f.tags?.includes("group")||(f.tags=[...f.tags??[],"group"]),l(v,y)}}else m==="edge"?a.push(_):m==="hyperedge"&&o.warnings.push("Hyperedges are not supported and were skipped")}},c=(p,g,_,m)=>{const f=g.name.toLowerCase(),v=_.trim(),y=p;switch(f){case"label":y.label===void 0&&v&&(y.label=v);return;case"url":case"href":case"link":v&&(y.url=v);return;case"color":v&&(y.color=v);return;case"group":v&&(y.group=v);return;case"sublabel":m&&v&&(y.sublabel=v);return;case"weight":case"value":m||(y.weight=de(v));return;case"x":case"y":case"z":case"size":{const x=de(v);m&&x!==void 0&&(y[f]=x);return}case"shape":m&&Ve.includes(v)&&(y.shape=v);return;case"directed":m||(y.directed=jn(v));return;default:g.name&&v!==""&&((p.props??(p.props={}))[g.name]=wd(v,g.type))}},h=(p,g)=>{for(const _ of as(p,"data")){const m=s.get(_.attrs.key);m&&(m.yType==="nodegraphics"?d(_,g):c(g,m,Jn(_),!0))}},d=(p,g)=>{const _=We(p,E=>Sd.has(Kn(E)));if(!_)return;const m=Kn(_),f=We(_,vn("Geometry"));let v="rectangle";if(f){const E=de(f.attrs.width)??30,A=de(f.attrs.height)??30,C=de(f.attrs.x)??0,b=de(f.attrs.y)??0;g.x=Gr((C+E/2)*n),g.y=Gr(-(b+A/2)*n),pl.has(m)||(g.size=Gr(Math.max(Math.min(E,A),1)*n))}const y=We(_,vn("Fill"));if(y&&y.attrs.transparent!=="true"){const E=os(y.attrs.color);E&&(g.color=E)}const x=We(_,vn("Shape"));x?.attrs.type&&(v=bd[x.attrs.type.toLowerCase()]??v),g.shape=v;const L=Jn(We(_,vn("NodeLabel")));if(L&&(g.label=L),m==="UMLClassNode"){g.shape="card";const E=Jn(We(_,vn("AttributeLabel"))),A=Jn(We(_,vn("MethodLabel"))),C=[];E&&C.push(...E.split(/\r?\n/)),(E||A)&&C.push("---"),A&&C.push(...A.split(/\r?\n/)),g.body=C}else pl.has(m)&&(g.shape="rectangle",g.tags=[...g.tags??[],"group"])},u=p=>{let g=p.attrs.source,_=p.attrs.target;(!o.hasNode(g)||!o.hasNode(_))&&o.warnings.push(`Edge ${g} -> ${_} references an undeclared node; it was created`);const m={id:p.attrs.id};let v=jn(p.attrs.directed);const y={id:"",source:g,target:_};for(const E of as(p,"data")){const A=s.get(E.attrs.key);if(A)if(A.yType==="edgegraphics"){const C=We(E,z=>Ed.has(Kn(z)));if(!C)continue;const b=We(C,vn("Arrows"));if(b){const z=(b.attrs.source??"none")!=="none",R=(b.attrs.target??"none")!=="none";z&&!R?([g,_]=[_,g],v=!0):v=R&&!z}const M=We(C,vn("LineStyle"));if(M){const z=os(M.attrs.color);z&&z!=="#000000"&&(y.color=z),/dash|dot/i.test(M.attrs.type??"")&&(y.dashed=!0);const R=de(M.attrs.width);R!==void 0&&Math.abs(R-1)>.01&&(y.width=Math.min(8,Math.max(.5,R)))}const P=Jn(We(C,vn("EdgeLabel")));P&&(y.label=P)}else c(y,A,Jn(E),!1)}t.numericLabelsAsWeights&&y.label!==void 0&&y.weight===void 0&&/^-?\d+(\.\d+)?$/.test(y.label)&&(y.weight=Number(y.label),delete y.label);const x=o.addEdge(g,_,{...y,id:m.id,directed:void 0}),L=v??o.directed;L!==o.directed&&(x.directed=L)};l(r);for(const p of a)u(p);return{graph:o.build(),warnings:o.warnings,format:"graphml"}}const Td={circle:"ellipse",square:"rectangle",rectangle:"rectangle",diamond:"diamond",hexagon:"hexagon",triangle:"triangle",card:"rectangle"};function gl(i,t={}){const e=t.scale??.5,n=t.defaultSize??14,s=[],r=(h,d,u)=>{let p=s.find(g=>g.target===h&&g.name===d);return p||(p={id:`k${s.length+2}`,target:h,name:d,type:u},s.push(p)),p.id},o=h=>typeof h=="number"?"double":typeof h=="boolean"?"boolean":"string",a=[];for(const h of i.nodes){const d=h.size??n,u=h.shape??"circle",p=(u==="rectangle"?d*1.6:u==="card"?Math.max(d*3,60):d)/e,g=(u==="card"?Math.max(d*3,40):d)/e,_=(h.x??0)/e-p/2,m=-(h.y??0)/e-g/2,f=os(h.color)??"#CCCCFF",v=xe(h.label??h.id);let y;if(u==="card"){const L=(h.body??[]).indexOf("---"),E=(L<0?h.body??[]:(h.body??[]).slice(0,L)).join(`
`),A=L<0?"":(h.body??[]).slice(L+1).join(`
`);y=`<y:UMLClassNode><y:Geometry height="${g}" width="${p}" x="${_}" y="${m}"/><y:Fill color="${f}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${v}</y:NodeLabel><y:UML clipContent="true" omitDetails="false" stereotype="" use3DEffect="false"><y:AttributeLabel>${xe(E)}</y:AttributeLabel><y:MethodLabel>${xe(A)}</y:MethodLabel></y:UML></y:UMLClassNode>`}else y=`<y:ShapeNode><y:Geometry height="${g}" width="${p}" x="${_}" y="${m}"/><y:Fill color="${f}" transparent="false"/><y:BorderStyle color="#000000" type="line" width="1.0"/><y:NodeLabel>${v}</y:NodeLabel><y:Shape type="${Td[u]}"/></y:ShapeNode>`;const x=[`<data key="d0">${y}</data>`];h.url&&x.push(`<data key="${r("node","url","string")}">${xe(h.url)}</data>`),h.group&&x.push(`<data key="${r("node","group","string")}">${xe(h.group)}</data>`),h.sublabel&&x.push(`<data key="${r("node","sublabel","string")}">${xe(h.sublabel)}</data>`),h.z!==void 0&&x.push(`<data key="${r("node","z","double")}">${h.z}</data>`),h.color&&!os(h.color)&&x.push(`<data key="${r("node","color","string")}">${xe(h.color)}</data>`);for(const[L,E]of Object.entries(h.props??{}))x.push(`<data key="${r("node",L,o(E))}">${xe(String(E))}</data>`);a.push(`    <node id="${xe(h.id)}">
      ${x.join(`
      `)}
    </node>`)}const l=[];for(const h of i.edges){const d=h.directed??i.directed,u=os(h.color)??"#000000",p=h.label?`<y:EdgeLabel>${xe(h.label)}</y:EdgeLabel>`:"",_=[`<data key="d1">${`<y:PolyLineEdge><y:Path sx="0.0" sy="0.0" tx="0.0" ty="0.0"/><y:LineStyle color="${u}" type="${h.dashed?"dashed":"line"}" width="${h.width??1}"/><y:Arrows source="none" target="${d?"standard":"none"}"/>${p}</y:PolyLineEdge>`}</data>`];h.weight!==void 0&&_.push(`<data key="${r("edge","weight","double")}">${h.weight}</data>`),h.url&&_.push(`<data key="${r("edge","url","string")}">${xe(h.url)}</data>`),h.group&&_.push(`<data key="${r("edge","group","string")}">${xe(h.group)}</data>`);for(const[m,f]of Object.entries(h.props??{}))_.push(`<data key="${r("edge",m,o(f))}">${xe(String(f))}</data>`);l.push(`    <edge id="${xe(h.id)}" source="${xe(h.source)}" target="${xe(h.target)}">
      ${_.join(`
      `)}
    </edge>`)}return`<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:y="http://www.yworks.com/xml/graphml" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd">
${['  <key for="node" id="d0" yfiles.type="nodegraphics"/>','  <key for="edge" id="d1" yfiles.type="edgegraphics"/>',...s.map(h=>`  <key attr.name="${xe(h.name)}" attr.type="${h.type}" for="${h.target}" id="${h.id}"/>`)].join(`
`)}
  <graph id="G" edgedefault="${i.directed?"directed":"undirected"}">
${a.join(`
`)}
${l.join(`
`)}
  </graph>
</graphml>
`}const rn=i=>typeof i=="object"&&i!==null&&!Array.isArray(i),ye=i=>i==null?void 0:String(i),Ad=new Set(["id","name","key","index","vx","vy","vz","fx","fy","fz","source","target","from","to","value","w"]);function _l(i,t){const e={};for(const[n,s]of Object.entries(i))t.has(n)||Ad.has(n)||(typeof s=="string"||typeof s=="number"||typeof s=="boolean")&&(e[n]=s);return Object.keys(e).length?e:void 0}const Cd=new Set(["label","sublabel","x","y","z","group","tags","url","color","shape","size","body","pinned","props"]),Rd=new Set(["weight","directed","label","url","color","width","dashed","group","props"]);function Pd(i){const t=ye(i.shape);return{label:ye(i.label??i.name),sublabel:ye(i.sublabel),x:de(i.x),y:de(i.y),z:de(i.z),group:ye(i.group),tags:Array.isArray(i.tags)?i.tags.map(String):void 0,url:ye(i.url),color:ye(i.color),shape:t&&Ve.includes(t)?t:void 0,size:de(i.size),body:Array.isArray(i.body)?i.body.map(String):void 0,pinned:jn(i.pinned),props:rn(i.props)?i.props:_l(i,Cd)}}function Ld(i){return{id:ye(i.id),weight:de(i.weight??i.value??i.w),directed:jn(i.directed),label:ye(i.label),url:ye(i.url),color:ye(i.color),width:de(i.width),dashed:jn(i.dashed),group:ye(i.group),props:rn(i.props)?i.props:_l(i,Rd)}}function vl(i){const t=JSON.parse(i);if(!rn(t))throw new Error("JSON graph must be an object");const e=new rs;let n=[],s=[];if(rn(t.elements)){const a=l=>Array.isArray(l)?l.map(c=>rn(c)&&rn(c.data)?c.data:c):[];n=a(t.elements.nodes),s=a(t.elements.edges)}else n=Array.isArray(t.nodes)?t.nodes:[],s=Array.isArray(t.edges)?t.edges:Array.isArray(t.links)?t.links:[];if(e.directed=jn(t.directed)??!1,rn(t.meta)){const a=ye(t.meta.dimension);e.meta={title:ye(t.meta.title),description:ye(t.meta.description),dimension:a==="3d"?"3d":a==="2d"?"2d":void 0}}const r=[];n.forEach((a,l)=>{const c=rn(a)?a:{id:a},h=ye(c.id??c.name??c.key)??`n${l+1}`;r.push(h),e.addNode(h,Pd(c))});const o=a=>rn(a)?ye(a.id??a.name??a.key):typeof a=="number"&&!e.hasNode(String(a))&&r[a]!==void 0?r[a]:ye(a);for(const a of s){if(!rn(a))continue;const l=o(a.source??a.from),c=o(a.target??a.to);if(l===void 0||c===void 0){e.warnings.push("Skipped an edge without source or target");continue}(!e.hasNode(l)||!e.hasNode(c))&&e.warnings.push(`Edge ${l} -> ${c} referenced unknown nodes; they were created`),e.addEdge(l,c,Ld(a))}return{graph:e.build(),warnings:e.warnings,format:"json"}}function xl(i){return JSON.stringify({format:"graphscape",version:1,...i},null,2)}const yl=[{id:"json",label:"Graphscape JSON (also D3 / Cytoscape)",extensions:["json"],mime:"application/json"},{id:"graphml",label:"GraphML (yEd)",extensions:["graphml","xml"],mime:"application/xml"},{id:"gml",label:"GML",extensions:["gml"],mime:"text/plain"},{id:"dot",label:"Graphviz DOT",extensions:["dot","gv"],mime:"text/vnd.graphviz"},{id:"csv",label:"CSV edge list",extensions:["csv","tsv","txt"],mime:"text/csv"}];function Ml(i,t){const e=t?.split(/[?#]/)[0].split(".").pop()?.toLowerCase();if(e){for(const s of yl)if(s.id!=="csv"&&s.extensions.includes(e))return s.id}const n=i.replace(/^\uFEFF/,"").trimStart();return n.startsWith("{")||n.startsWith("[")?"json":/^<\?xml|^<graphml/i.test(n)||/<graphml[\s>]/i.test(n.slice(0,2e3))?"graphml":/(^|\n)\s*graph\s*\[/.test(n.replace(/^\s*#.*$/gm,""))?"gml":/^(strict\s+)?(di)?graph\b[^[{]*\{/i.test(n.replace(/^(\s*(\/\/.*|#.*|\/\*[\s\S]*?\*\/)\s*)+/,""))?"dot":"csv"}function Sl(i,t={}){const e=t.format??Ml(i,t.filename),n=i.replace(/^\uFEFF/,"");switch(e){case"json":return vl(n);case"graphml":return ml(n,{scale:t.scale,numericLabelsAsWeights:t.numericLabelsAsWeights});case"gml":return ul(n);case"dot":return ll(n);case"csv":return sl(n,t.directed??!1)}}function Dd(i,t){switch(t){case"json":return xl(i);case"graphml":return gl(i);case"gml":return fl(i);case"dot":return cl(i);case"csv":return ol(i)}}function El(i){return i==="circle"||i==="diamond"||i==="hexagon"||i==="triangle"}function Vr(i,t,e,n){const s=t/2;return{hw:i==="rectangle"?s*e:s,hh:s}}function Wr(i,t,e){const n=i[0]-t.pos[0],s=i[1]-t.pos[1];if(e){const r=i[2]-t.pos[2];return n*n+s*s+r*r<t.hw*t.hw}return t.ellipse?n*n/(t.hw*t.hw)+s*s/(t.hh*t.hh)<1:Math.abs(n)<t.hw&&Math.abs(s)<t.hh}const Xr=(i,t,e)=>[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e],vi=(i,t)=>Math.hypot(i[0]-t[0],i[1]-t[1],i[2]-t[2]);function bl(i,t,e,n){const s=[];for(let r=0;r<=n;r++){const o=r/n,a=1-o;s.push([a*a*i[0]+2*a*o*t[0]+o*o*e[0],a*a*i[1]+2*a*o*t[1]+o*o*e[1],a*a*i[2]+2*a*o*t[2]+o*o*e[2]])}return s}function wl(i,t,e){let n=[t,-i,0],s=Math.hypot(n[0],n[1],n[2]);return s<1e-9&&(n=[-e,0,i],s=Math.hypot(n[0],n[1],n[2])),s<1e-9?[0,1,0]:[n[0]/s,n[1]/s,n[2]/s]}function Id(i,t,e){const n=Math.max(i.hw,i.hh),s=n*e.loopScale*(1+.5*t),r=t*(Math.PI/3),o=n+s*.35,a=i.pos[0]-Math.sin(r)*o,l=i.pos[1]+Math.cos(r)*o,c=r-Math.PI/2,h=.35,d=Math.max(12,e.segments*2),u=[];for(let p=0;p<=d;p++){const g=c+h+p/d*(2*Math.PI-2*h);u.push([a+s*Math.cos(g),l+s*Math.sin(g),i.pos[2]])}return u}function $r(i,t,e){let n=0;for(;n<i.length&&Wr(i[n],t,e);)n++;if(n===0||n>=i.length)return i;let s=i[n-1],r=i[n];for(let o=0;o<18;o++){const a=Xr(s,r,.5);Wr(a,t,e)?s=a:r=a}return[r,...i.slice(n)]}function Tl(i,t,e){return $r([...i].reverse(),t,e).reverse()}function Al(i,t,e,n,s,r,o){let a;if(r)a=Id(i,e,o);else{const l=(e-(n-1)/2)*o.spacing*(s?-1:1);if(Math.abs(l)<1e-6)a=[i.pos,t.pos];else{const c=t.pos[0]-i.pos[0],h=t.pos[1]-i.pos[1],d=o.dim3?t.pos[2]-i.pos[2]:0,u=wl(c,h,d),p=[(i.pos[0]+t.pos[0])/2,(i.pos[1]+t.pos[1])/2,(i.pos[2]+t.pos[2])/2],g=[p[0]+u[0]*2*l,p[1]+u[1]*2*l,p[2]+u[2]*2*l];a=bl(i.pos,g,t.pos,o.segments)}}return a=$r(a,i,o.dim3),a=Tl(a,t,o.dim3),a}function qr(i){let t=0;for(let e=1;e<i.length;e++)t+=vi(i[e-1],i[e]);return t}function Cl(i,t){if(i.length<2||qr(i)<=t*1.2)return i;const e=i.slice();let n=t;for(;e.length>=2;){const s=e[e.length-2],r=e[e.length-1],o=vi(s,r);if(o>n+1e-9)return e[e.length-1]=Xr(s,r,(o-n)/o),e;n-=o,e.pop()}return i}function Rl(i,t){const e=qr(i);if(e===0)return i[0];let n=e*t;for(let s=1;s<i.length;s++){const r=vi(i[s-1],i[s]);if(n<=r)return Xr(i[s-1],i[s],r===0?0:n/r);n-=r}return i[i.length-1]}function Pl(i){const t=i[i.length-1];let e=i.length-2;for(;e>0&&vi(i[e],t)<1e-6;)e--;const n=i[Math.max(0,e)],s=vi(n,t)||1;return{tip:t,dir:[(t[0]-n[0])/s,(t[1]-n[1])/s,(t[2]-n[2])/s]}}function Ll(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a;let c=l===0?0:((i-e)*o+(t-n)*a)/l;return c=Math.max(0,Math.min(1,c)),Math.hypot(i-(e+c*o),t-(n+c*a))}const Ud=Object.freeze(Object.defineProperty({__proto__:null,dist3:vi,distToSegment:Ll,edgePath:Al,inside:Wr,isEllipseShape:El,nodeExtents:Vr,normalTo:wl,pathLength:qr,pointAtFraction:Rl,quadratic:bl,shortenEnd:Cl,tipOf:Pl,trimEnd:Tl,trimStart:$r},Symbol.toStringTag,{value:"Module"})),Nd=.58,Od=1.25;function ls(i,t,e){const n=i.split(`
`).map(s=>Math.min(s.length,e));return{w:Math.max(0,...n)*t*Nd,h:n.length*t*Od}}function on(i,t){return i.boxes?.get(t)??{w:i.spacing,h:i.spacing}}function Dl(i,t,e=!1){const n=Fr(i),s=t.label.show&&i.nodes.length<=t.label.maxCount,r=new Map;for(const o of i.nodes){const a=zr(o,t,n);if(a.shape==="card"){const d=ls(o.label??o.id,t.card.size,80),u=ls((o.body??[]).join(`
`),t.card.size,80),p=t.card.padding;r.set(o.id,{w:Math.max(d.w,u.w)+p*3,h:(d.h+u.h)*1.12+p*3});continue}const l=Vr(a.shape,a.size,t.node.aspect);let c=l.hw*2,h=l.hh*2;if(s){const d=ls(o.label??o.id,t.label.size,t.label.maxChars),u=o.sublabel?ls(o.sublabel,t.label.subSize,t.label.maxChars):{w:0,h:0};c=Math.max(c,d.w,u.w),h+=t.label.gap+d.h+u.h}r.set(o.id,{w:c,h})}return r}class Yr{constructor(t,e){$(this,"ids");$(this,"pos");$(this,"temperature");$(this,"t0");$(this,"n");$(this,"k");$(this,"dim3");$(this,"disp");$(this,"fixed");$(this,"ea");$(this,"eb");$(this,"es");$(this,"index",new Map);$(this,"rnd");$(this,"gravity");const n=t.nodes;this.n=n.length,this.k=e.idealLength,this.dim3=e.dimension==="3d",this.gravity=e.gravity,this.rnd=is(e.seed),this.ids=n.map(o=>o.id),this.pos=new Float64Array(this.n*3),this.disp=new Float64Array(this.n*3),this.fixed=new Uint8Array(this.n);const s=this.k*(this.dim3?Math.cbrt(this.n):Math.sqrt(this.n))*.6+this.k;n.forEach((o,a)=>{this.index.set(o.id,a),this.pos[3*a]=o.x??(this.rnd()*2-1)*s,this.pos[3*a+1]=o.y??(this.rnd()*2-1)*s,this.pos[3*a+2]=this.dim3?o.z??(this.rnd()*2-1)*s:o.z??0,o.pinned&&(this.fixed[a]=1)});const r=t.edges.filter(o=>o.source!==o.target);this.ea=new Int32Array(r.length),this.eb=new Int32Array(r.length),this.es=new Float64Array(r.length),r.forEach((o,a)=>{this.ea[a]=this.index.get(o.source),this.eb[a]=this.index.get(o.target);const l=t.weightOf(o);this.es[a]=e.weightMode==="strength"?Math.min(4,Math.max(.25,Math.sqrt(Math.max(l,0)))):1}),this.t0=this.k*2,this.temperature=this.t0}get alpha(){return this.temperature/this.t0}pin(t,e){const n=this.index.get(t);n!==void 0&&(this.pos[3*n]=e[0],this.pos[3*n+1]=e[1],this.dim3&&(this.pos[3*n+2]=e[2]),this.fixed[n]=1)}unpin(t,e=!1){const n=this.index.get(t);n!==void 0&&!e&&(this.fixed[n]=0)}step(){const{n:t,k:e,dim3:n,pos:s,disp:r}=this,o=e*e;r.fill(0);const a=(c,h,d)=>{let u=s[3*c]-s[3*h],p=s[3*c+1]-s[3*h+1],g=n?s[3*c+2]-s[3*h+2]:0,_=u*u+p*p+g*g;if(_>d)return;_<1e-6&&(u=(this.rnd()-.5)*.1,p=(this.rnd()-.5)*.1,g=n?(this.rnd()-.5)*.1:0,_=u*u+p*p+g*g+1e-6);const m=o/_;r[3*c]+=u*m,r[3*c+1]+=p*m,r[3*c+2]+=g*m,r[3*h]-=u*m,r[3*h+1]-=p*m,r[3*h+2]-=g*m};if(t<=400)for(let c=0;c<t;c++)for(let h=c+1;h<t;h++)a(c,h,1/0);else{const c=e*4,h=c*c,d=v=>Math.max(-1e3,Math.min(1e3,Math.floor(v/c))),u=(v,y,x)=>((v+1024)*2048+(y+1024))*2048+(x+1024),p=new Map,g=new Int16Array(t),_=new Int16Array(t),m=new Int16Array(t);for(let v=0;v<t;v++){g[v]=d(s[3*v]),_[v]=d(s[3*v+1]),m[v]=n?d(s[3*v+2]):0;const y=u(g[v],_[v],m[v]),x=p.get(y);x?x.push(v):p.set(y,[v])}const f=n?1:0;for(let v=0;v<t;v++)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)for(let L=-f;L<=f;L++){const E=p.get(u(g[v]+y,_[v]+x,m[v]+L));if(E)for(const A of E)A>v&&a(v,A,h)}}for(let c=0;c<this.ea.length;c++){const h=this.ea[c],d=this.eb[c],u=s[3*h]-s[3*d],p=s[3*h+1]-s[3*d+1],g=n?s[3*h+2]-s[3*d+2]:0,m=Math.sqrt(u*u+p*p+g*g)/e*this.es[c];r[3*h]-=u*m,r[3*h+1]-=p*m,r[3*h+2]-=g*m,r[3*d]+=u*m,r[3*d+1]+=p*m,r[3*d+2]+=g*m}const l=this.temperature;for(let c=0;c<t;c++){if(this.fixed[c])continue;r[3*c]-=s[3*c]*this.gravity,r[3*c+1]-=s[3*c+1]*this.gravity,n&&(r[3*c+2]-=s[3*c+2]*this.gravity);const h=n?r[3*c+2]:0,d=Math.sqrt(r[3*c]**2+r[3*c+1]**2+h*h);if(d<1e-9)continue;const u=Math.min(d,l)/d;s[3*c]+=r[3*c]*u,s[3*c+1]+=r[3*c+1]*u,n&&(s[3*c+2]+=h*u)}this.temperature=Math.max(this.temperature*.985,this.t0*.002)}entries(){return this.ids.map((t,e)=>[t,[this.pos[3*e],this.pos[3*e+1],this.dim3?this.pos[3*e+2]:0]])}commit(t){t.setPositions(this.entries())}}function Il(i,t){var L;const e=i.nodes.map(E=>E.id),n=new Map(e.map((E,A)=>[E,A])),s=e.length,r=Array.from({length:s},()=>[]);for(const E of i.edges){const A=n.get(E.source),C=n.get(E.target);A!==C&&r[A].push(C)}const o=new Uint8Array(s),a=Array.from({length:s},()=>[]),l=[];for(let E=0;E<s;E++){if(o[E])continue;const A=[[E,0]];for(o[E]=1,l.push(E);A.length;){const C=A[A.length-1],b=C[0];if(C[1]<r[b].length){const M=r[b][C[1]++];o[M]===0?(o[M]=1,l.push(M),a[b].push(M),A.push([M,0])):o[M]===1?a[M].push(b):a[b].push(M)}else o[b]=2,A.pop()}}const c=new Int32Array(s);for(let E=0;E<s;E++)for(const A of a[E])c[A]++;const h=new Int32Array(s),d=[];for(let E=0;E<s;E++)c[E]===0&&d.push(E);for(let E=0;E<d.length;E++){const A=d[E];for(const C of a[A])h[C]=Math.max(h[C],h[A]+1),--c[C]===0&&d.push(C)}const u=[];for(const E of l)(u[L=h[E]]??(u[L]=[])).push(E);const p=Array.from({length:s},()=>[]);for(let E=0;E<s;E++)for(const A of a[E])p[A].push(E);const g=new Float64Array(s);u.forEach(E=>E?.forEach((A,C)=>g[A]=C));for(let E=0;E<8;E++){const A=E%2===0,C=u.map((b,M)=>M);A||C.reverse();for(const b of C.slice(1)){const M=u[b];if(!M)continue;const P=new Map;for(const z of M){const R=A?p[z]:a[z];P.set(z,R.length?R.reduce((F,V)=>F+g[V],0)/R.length:g[z])}M.sort((z,R)=>P.get(z)-P.get(R)),M.forEach((z,R)=>g[z]=R)}}const _=t.direction==="TB",m=E=>_?on(t,E).w:on(t,E).h,f=E=>_?on(t,E).h:on(t,E).w,v=new Map;let y=0,x=0;return u.forEach((E,A)=>{if(!E)return;const C=Math.max(...E.map(P=>f(e[P])));y+=A===0?C/2:x/2+t.gap*2.2+C/2,x=C;let M=-(E.reduce((P,z)=>P+m(e[z]),0)+t.gap*(E.length-1))/2;for(const P of E){const z=m(e[P]),R=M+z/2;M+=z+t.gap,v.set(e[P],_?[R,-y,0]:[y,-R,0])}}),v}function jr(i){const t=new Map;for(const e of i.nodes)e.group!==void 0&&!t.has(e.group)&&t.set(e.group,t.size);return i.nodes.map((e,n)=>({id:e.id,g:e.group===void 0?-1:t.get(e.group),i:n})).sort((e,n)=>e.g-n.g||e.i-n.i).map(e=>e.id)}function Zr(i,t){const e=on(i,t);return Math.hypot(e.w,e.h)*.75+i.gap}function Ul(i,t){const e=jr(i),n=e.map(l=>Zr(t,l)),s=n.reduce((l,c)=>l+c,0)||1,r=Math.max(s/(2*Math.PI),Math.max(0,...n)*.5||1),o=new Map;let a=0;return e.forEach((l,c)=>{const h=(a+n[c]/2)/s*Math.PI*2-Math.PI/2;a+=n[c],o.set(l,[r*Math.cos(h),r*Math.sin(h),0])}),o}function Nl(i,t){const e=jr(i),n=e.length;let s=0,r=0;for(const u of e){const p=on(t,u);s=Math.max(s,p.w),r=Math.max(r,p.h)}s+=t.gap,r+=t.gap;const o=!!t.dim3,a=o?Math.max(1,Math.ceil(Math.cbrt(n))):Math.max(1,Math.round(Math.sqrt(n*r/s))),l=o?a:Math.ceil(n/a),c=o?Math.ceil(n/(a*l)):1,h=Math.max(s,r),d=new Map;return e.forEach((u,p)=>{const g=p%a,_=Math.floor(p/a)%l,m=o?Math.floor(p/(a*l)):0;d.set(u,[(g-(a-1)/2)*s,((l-1)/2-_)*r,o?(m-(c-1)/2)*h:0])}),d}function Ol(i,t){const e=jr(i),n=e.length,s=e.reduce((l,c)=>l+Zr(t,c),0)/Math.max(n,1)||1,r=Math.max(s,s*Math.sqrt(n/(4*Math.PI))*1.1),o=Math.PI*(3-Math.sqrt(5)),a=new Map;return e.forEach((l,c)=>{const h=n===1?0:1-c/(n-1)*2,d=Math.sqrt(Math.max(0,1-h*h)),u=o*c;a.set(l,[Math.cos(u)*d*r,h*r,Math.sin(u)*d*r])}),a}function Fl(i,t){const e=is(t.seed??1),n=i.nodes.map(a=>a.id),r=(n.reduce((a,l)=>a+Zr(t,l),0)/Math.max(n.length,1)||1)*Math.sqrt(n.length)*.9,o=new Map;for(const a of n)o.set(a,[(e()*2-1)*r,(e()*2-1)*r,t.dim3?(e()*2-1)*r:0]);return o}function zl(i,t){const e=i.nodes.map(R=>R.id),n=e.length,s=new Map;if(n===0)return s;const r=new Map(e.map((R,F)=>[R,F])),o=Array.from({length:n},()=>[]),a=new Int32Array(n),l=new Int32Array(n);for(const R of i.edges){const F=r.get(R.source),V=r.get(R.target);F!==V&&(l[F]++,l[V]++,o[F].push(V),i.isDirected(R)?a[V]++:o[V].push(F))}const c=new Int32Array(n).fill(-1),h=new Int32Array(n).fill(-1),d=Array.from({length:n},()=>[]),u=[],p=R=>{u.push(R),h[R]=0;const F=[R];for(let V=0;V<F.length;V++){const k=F[V];for(const j of o[k])h[j]===-1&&(h[j]=h[k]+1,c[j]=k,d[k].push(j),F.push(j))}},g=[...Array(n).keys()].filter(R=>a[R]===0);a.some(R=>R>0)||g.sort((R,F)=>l[F]-l[R]||R-F);for(const R of g)h[R]===-1&&p(R);const _=R=>{const F=new Map([[R,0]]),V=[R];let k=0;for(let j=0;j<V.length;j++){const W=V[j];for(const it of o[W])h[it]!==-1||F.has(it)||(F.set(it,F.get(W)+1),k=Math.max(k,F.get(it)),V.push(it))}return{reach:V.length,height:k}};for(;;){const R=[...Array(n).keys()].filter(k=>h[k]===-1).sort((k,j)=>l[j]-l[k]||k-j);if(!R.length)break;let F=R[0],V={reach:-1,height:0};for(const k of R.slice(0,8)){const j=_(k);(j.reach>V.reach||j.reach===V.reach&&j.height<V.height)&&(F=k,V=j)}p(F)}const m=t.direction==="TB",f=R=>m?on(t,e[R]).w:on(t,e[R]).h,v=R=>m?on(t,e[R]).h:on(t,e[R]).w,y=[];for(const R of u){const F=[R];for(;F.length;){const V=F.pop();y.push(V);for(let k=d[V].length-1;k>=0;k--)F.push(d[V][k])}}const x=new Float64Array(n);for(let R=y.length-1;R>=0;R--){const F=y[R],V=d[F],k=V.reduce((j,W)=>j+x[W],0)+t.gap*Math.max(0,V.length-1);x[F]=Math.max(f(F),k)}const L=new Float64Array(n);let E=0;for(const R of u)L[R]=E,E+=x[R]+t.gap*2;const A=E-t.gap*2;for(const R of y){const F=d[R];if(!F.length)continue;const V=F.reduce((j,W)=>j+x[W],0)+t.gap*(F.length-1);let k=L[R]+(x[R]-V)/2;for(const j of F)L[j]=k,k+=x[j]+t.gap}const C=new Float64Array(n);for(let R=y.length-1;R>=0;R--){const F=y[R],V=d[F];C[F]=V.length?(C[V[0]]+C[V[V.length-1]])/2:L[F]+x[F]/2}const b=Math.max(...Array.from(h)),M=new Float64Array(b+1);for(let R=0;R<n;R++)M[h[R]]=Math.max(M[h[R]],v(R));const P=new Float64Array(b+1);let z=0;for(let R=0;R<=b;R++)z+=R===0?M[0]/2:M[R-1]/2+t.gap*2.2+M[R]/2,P[R]=z;for(let R=0;R<n;R++){const F=C[R]-A/2;s.set(e[R],m?[F,-P[h[R]],0]:[P[h[R]],-F,0])}return s}const Kr={dimension:"2d",spacing:40,gap:12,idealLength:60,gravity:.05,weightMode:"ignore",direction:"TB",seed:1,iterations:300},Fd=["force","tree","layered","circle","grid","sphere","random"];function Bl(i,t,e={}){const n={...Kr,...e},s={spacing:n.spacing,gap:n.gap,boxes:n.boxes,dim3:n.dimension==="3d",seed:n.seed};switch(t){case"circle":return Ul(i,s);case"grid":return Nl(i,s);case"sphere":return Ol(i,s);case"random":return Fl(i,s);case"layered":return Il(i,{...s,direction:n.direction});case"tree":return zl(i,{...s,direction:n.direction});case"force":{const r=new Yr(i,n);for(let o=0;o<n.iterations&&r.alpha>.02;o++)r.step();return new Map(r.entries())}}}function Jr(i,t,e,n){const s=is(n),r=t==="3d",o=c=>c.x!==void 0&&c.y!==void 0,a=e*Math.sqrt(Math.max(i.nodes.length,1))*.6+e;let l=0;for(const c of i.nodes){if(o(c)){c.z===void 0&&(c.z=0);continue}let h;for(const u of i.edges){const p=u.source===c.id?i.getNode(u.target):u.target===c.id?i.getNode(u.source):void 0;if(p&&p!==c&&o(p)){h={x:p.x,y:p.y,z:p.z??0};break}}const d=h?e*.6:a;c.x=(h?.x??0)+(s()*2-1)*d,c.y=(h?.y??0)+(s()*2-1)*d,c.z=r?(h?.z??0)+(s()*2-1)*d:h?.z??0,l++}return l}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Qr="170",me={ROTATE:0,DOLLY:1,PAN:2},an={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},zd=0,kl=1,Bd=2,Hl=1,kd=2,xn=3,yn=0,Pe=1,Mn=2,On=0,xi=1,Gl=2,Vl=3,Wl=4,Hd=5,Qn=100,Gd=101,Vd=102,Wd=103,Xd=104,$d=200,qd=201,Yd=202,jd=203,to=204,eo=205,Zd=206,Kd=207,Jd=208,Qd=209,tu=210,eu=211,nu=212,iu=213,su=214,no=0,io=1,so=2,yi=3,ro=4,oo=5,ao=6,lo=7,co=0,ru=1,ou=2,Fn=0,au=1,lu=2,cu=3,hu=4,du=5,uu=6,fu=7,Xl=300,Mi=301,Si=302,ho=303,uo=304,Us=306,fo=1e3,ti=1001,po=1002,ze=1003,pu=1004,Ns=1005,ln=1006,mo=1007,ei=1008,Sn=1009,$l=1010,ql=1011,cs=1012,go=1013,ni=1014,cn=1015,hs=1016,_o=1017,vo=1018,Ei=1020,Yl=35902,jl=1021,Zl=1022,Ke=1023,Kl=1024,Jl=1025,bi=1026,wi=1027,xo=1028,yo=1029,Ql=1030,Mo=1031,So=1033,Os=33776,Fs=33777,zs=33778,Bs=33779,Eo=35840,bo=35841,wo=35842,To=35843,Ao=36196,Co=37492,Ro=37496,Po=37808,Lo=37809,Do=37810,Io=37811,Uo=37812,No=37813,Oo=37814,Fo=37815,zo=37816,Bo=37817,ko=37818,Ho=37819,Go=37820,Vo=37821,ks=36492,Wo=36494,Xo=36495,tc=36283,$o=36284,qo=36285,Yo=36286,mu=3200,gu=3201,ec=0,_u=1,zn="",Be="srgb",Ti="srgb-linear",Hs="linear",Kt="srgb",Ai=7680,nc=519,vu=512,xu=513,yu=514,ic=515,Mu=516,Su=517,Eu=518,bu=519,jo=35044,sc=35048,rc="300 es",En=2e3,Gs=2001;class ii{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Te=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let oc=1234567;const ds=Math.PI/180,us=180/Math.PI;function bn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Te[i&255]+Te[i>>8&255]+Te[i>>16&255]+Te[i>>24&255]+"-"+Te[t&255]+Te[t>>8&255]+"-"+Te[t>>16&15|64]+Te[t>>24&255]+"-"+Te[e&63|128]+Te[e>>8&255]+"-"+Te[e>>16&255]+Te[e>>24&255]+Te[n&255]+Te[n>>8&255]+Te[n>>16&255]+Te[n>>24&255]).toLowerCase()}function Me(i,t,e){return Math.max(t,Math.min(e,i))}function Zo(i,t){return(i%t+t)%t}function wu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Tu(i,t,e){return i!==t?(e-i)/(t-i):0}function fs(i,t,e){return(1-e)*i+e*t}function Au(i,t,e,n){return fs(i,t,1-Math.exp(-e*n))}function Cu(i,t=1){return t-Math.abs(Zo(i,t*2)-t)}function Ru(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Pu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Lu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Du(i,t){return i+Math.random()*(t-i)}function Iu(i){return i*(.5-Math.random())}function Uu(i){i!==void 0&&(oc=i);let t=oc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nu(i){return i*ds}function Ou(i){return i*us}function Fu(i){return(i&i-1)===0&&i!==0}function zu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Bu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function ku(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Je(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function jt(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ci={DEG2RAD:ds,RAD2DEG:us,generateUUID:bn,clamp:Me,euclideanModulo:Zo,mapLinear:wu,inverseLerp:Tu,lerp:fs,damp:Au,pingpong:Cu,smoothstep:Ru,smootherstep:Pu,randInt:Lu,randFloat:Du,randFloatSpread:Iu,seededRandom:Uu,degToRad:Nu,radToDeg:Ou,isPowerOfTwo:Fu,ceilPowerOfTwo:zu,floorPowerOfTwo:Bu,setQuaternionFromProperEuler:ku,normalize:jt,denormalize:Je};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Me(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Pt{constructor(t,e,n,s,r,o,a,l,c){Pt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],v=s[1],y=s[4],x=s[7],L=s[2],E=s[5],A=s[8];return r[0]=o*_+a*v+l*L,r[3]=o*m+a*y+l*E,r[6]=o*f+a*x+l*A,r[1]=c*_+h*v+d*L,r[4]=c*m+h*y+d*E,r[7]=c*f+h*x+d*A,r[2]=u*_+p*v+g*L,r[5]=u*m+p*y+g*E,r[8]=u*f+p*x+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,p=c*r-o*l,g=e*d+n*u+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=d*_,t[1]=(s*c-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=u*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=p*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ko.makeScale(t,e)),this}rotate(t){return this.premultiply(Ko.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ko.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ko=new Pt;function ac(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Vs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Hu(){const i=Vs("canvas");return i.style.display="block",i}const lc={};function ps(i){i in lc||(lc[i]=!0,console.warn(i))}function Gu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Vu(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Wu(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Ht={enabled:!0,workingColorSpace:Ti,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Kt&&(i.r=wn(i.r),i.g=wn(i.g),i.b=wn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Kt&&(i.r=Ri(i.r),i.g=Ri(i.g),i.b=Ri(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===zn?Hs:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function wn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ri(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const cc=[.64,.33,.3,.6,.15,.06],hc=[.2126,.7152,.0722],dc=[.3127,.329],uc=new Pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fc=new Pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ht.define({[Ti]:{primaries:cc,whitePoint:dc,transfer:Hs,toXYZ:uc,fromXYZ:fc,luminanceCoefficients:hc,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:cc,whitePoint:dc,transfer:Kt,toXYZ:uc,fromXYZ:fc,luminanceCoefficients:hc,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}});let Pi;class Xu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Pi===void 0&&(Pi=Vs("canvas")),Pi.width=t.width,Pi.height=t.height;const n=Pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Vs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=wn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wn(e[n]/255)*255):e[n]=wn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let $u=0;class pc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=bn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Jo(s[o].image)):r.push(Jo(s[o]))}else r=Jo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Jo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Xu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let qu=0;class Ae extends ii{constructor(t=Ae.DEFAULT_IMAGE,e=Ae.DEFAULT_MAPPING,n=ti,s=ti,r=ln,o=ei,a=Ke,l=Sn,c=Ae.DEFAULT_ANISOTROPY,h=zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=bn(),this.name="",this.source=new pc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Xl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case fo:t.x=t.x-Math.floor(t.x);break;case ti:t.x=t.x<0?0:1;break;case po:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case fo:t.y=t.y-Math.floor(t.y);break;case ti:t.y=t.y<0?0:1;break;case po:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ae.DEFAULT_IMAGE=null,Ae.DEFAULT_MAPPING=Xl,Ae.DEFAULT_ANISOTROPY=1;class Qt{constructor(t=0,e=0,n=0,s=1){Qt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,x=(p+1)/2,L=(f+1)/2,E=(h+u)/4,A=(d+_)/4,C=(g+m)/4;return y>x&&y>L?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=E/n,r=A/n):x>L?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=E/s,r=C/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=A/r,s=C/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(d-_)/v,this.z=(u-h)/v,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yu extends ii{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Qt(0,0,t,e),this.scissorTest=!1,this.viewport=new Qt(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ae(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new pc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class si extends Yu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class mc extends Ae{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ze,this.minFilter=ze,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ju extends Ae{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ze,this.minFilter=ze,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const u=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(d!==_||l!==u||c!==p||h!==g){let m=1-a;const f=l*u+c*p+h*g+d*_,v=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const L=Math.sqrt(y),E=Math.atan2(L,f*v);m=Math.sin(m*E)/L,a=Math.sin(a*E)/L}const x=a*v;if(l=l*m+u*x,c=c*m+p*x,h=h*m+g*x,d=d*m+_*x,m===1-a){const L=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=L,c*=L,h*=L,d*=L}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*d+l*p-c*u,t[e+1]=l*g+h*u+c*d-a*p,t[e+2]=c*g+h*p+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"YZX":this._x=u*h*d+c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d-u*p*g;break;case"XZY":this._x=u*h*d-c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d+u*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>d){const p=2*Math.sqrt(1+n-a-d);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>d){const p=2*Math.sqrt(1+a-n-d);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+d-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Me(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(gc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(gc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Qo.copy(this).projectOnVector(t),this.sub(Qo)}reflect(t){return this.sub(Qo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Me(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qo=new D,gc=new hn;class dn{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Qe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Qe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Qe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Qe):Qe.fromBufferAttribute(r,o),Qe.applyMatrix4(t.matrixWorld),this.expandByPoint(Qe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ws.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ws.copy(n.boundingBox)),Ws.applyMatrix4(t.matrixWorld),this.union(Ws)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Qe),Qe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ms),Xs.subVectors(this.max,ms),Li.subVectors(t.a,ms),Di.subVectors(t.b,ms),Ii.subVectors(t.c,ms),Bn.subVectors(Di,Li),kn.subVectors(Ii,Di),ri.subVectors(Li,Ii);let e=[0,-Bn.z,Bn.y,0,-kn.z,kn.y,0,-ri.z,ri.y,Bn.z,0,-Bn.x,kn.z,0,-kn.x,ri.z,0,-ri.x,-Bn.y,Bn.x,0,-kn.y,kn.x,0,-ri.y,ri.x,0];return!ta(e,Li,Di,Ii,Xs)||(e=[1,0,0,0,1,0,0,0,1],!ta(e,Li,Di,Ii,Xs))?!1:($s.crossVectors(Bn,kn),e=[$s.x,$s.y,$s.z],ta(e,Li,Di,Ii,Xs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Qe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Qe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Tn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Tn=[new D,new D,new D,new D,new D,new D,new D,new D],Qe=new D,Ws=new dn,Li=new D,Di=new D,Ii=new D,Bn=new D,kn=new D,ri=new D,ms=new D,Xs=new D,$s=new D,oi=new D;function ta(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){oi.fromArray(i,r);const a=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),l=t.dot(oi),c=e.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Zu=new dn,gs=new D,ea=new D;class Hn{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Zu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;gs.subVectors(t,this.center);const e=gs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(gs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ea.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(gs.copy(t.center).add(ea)),this.expandByPoint(gs.copy(t.center).sub(ea))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const An=new D,na=new D,qs=new D,Gn=new D,ia=new D,Ys=new D,sa=new D;class js{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,An)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=An.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(An.copy(this.origin).addScaledVector(this.direction,e),An.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){na.copy(t).add(e).multiplyScalar(.5),qs.copy(e).sub(t).normalize(),Gn.copy(this.origin).sub(na);const r=t.distanceTo(e)*.5,o=-this.direction.dot(qs),a=Gn.dot(this.direction),l=-Gn.dot(qs),c=Gn.lengthSq(),h=Math.abs(1-o*o);let d,u,p,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,p=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(na).addScaledVector(qs,u),p}intersectSphere(t,e){An.subVectors(t.center,this.origin);const n=An.dot(this.direction),s=An.dot(An)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,An)!==null}intersectTriangle(t,e,n,s,r){ia.subVectors(e,t),Ys.subVectors(n,t),sa.crossVectors(ia,Ys);let o=this.direction.dot(sa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Gn.subVectors(this.origin,t);const l=a*this.direction.dot(Ys.crossVectors(Gn,Ys));if(l<0)return null;const c=a*this.direction.dot(ia.cross(Gn));if(c<0||l+c>o)return null;const h=-a*Gn.dot(sa);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $t{constructor(t,e,n,s,r,o,a,l,c,h,d,u,p,g,_,m){$t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,p,g,_,m)}set(t,e,n,s,r,o,a,l,c,h,d,u,p,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $t().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ui.setFromMatrixColumn(t,0).length(),r=1/Ui.setFromMatrixColumn(t,1).length(),o=1/Ui.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,p=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=p+g*c,e[5]=u-_*c,e[9]=-a*l,e[2]=_-u*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,p=l*d,g=c*h,_=c*d;e[0]=u+_*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,p=l*d,g=c*h,_=c*d;e[0]=u-_*a,e[4]=-o*d,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,p=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=g*c-p,e[8]=u*c+_,e[1]=l*d,e[5]=_*c+u,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,p=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-u*d,e[8]=g*d+p,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=p*d+g,e[10]=u-_*d}else if(t.order==="XZY"){const u=o*l,p=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+_,e[5]=o*h,e[9]=p*d-g,e[2]=g*d-p,e[6]=a*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ku,t,Ju)}lookAt(t,e,n){const s=this.elements;return ke.subVectors(t,e),ke.lengthSq()===0&&(ke.z=1),ke.normalize(),Vn.crossVectors(n,ke),Vn.lengthSq()===0&&(Math.abs(n.z)===1?ke.x+=1e-4:ke.z+=1e-4,ke.normalize(),Vn.crossVectors(n,ke)),Vn.normalize(),Zs.crossVectors(ke,Vn),s[0]=Vn.x,s[4]=Zs.x,s[8]=ke.x,s[1]=Vn.y,s[5]=Zs.y,s[9]=ke.y,s[2]=Vn.z,s[6]=Zs.z,s[10]=ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],v=n[3],y=n[7],x=n[11],L=n[15],E=s[0],A=s[4],C=s[8],b=s[12],M=s[1],P=s[5],z=s[9],R=s[13],F=s[2],V=s[6],k=s[10],j=s[14],W=s[3],it=s[7],dt=s[11],St=s[15];return r[0]=o*E+a*M+l*F+c*W,r[4]=o*A+a*P+l*V+c*it,r[8]=o*C+a*z+l*k+c*dt,r[12]=o*b+a*R+l*j+c*St,r[1]=h*E+d*M+u*F+p*W,r[5]=h*A+d*P+u*V+p*it,r[9]=h*C+d*z+u*k+p*dt,r[13]=h*b+d*R+u*j+p*St,r[2]=g*E+_*M+m*F+f*W,r[6]=g*A+_*P+m*V+f*it,r[10]=g*C+_*z+m*k+f*dt,r[14]=g*b+_*R+m*j+f*St,r[3]=v*E+y*M+x*F+L*W,r[7]=v*A+y*P+x*V+L*it,r[11]=v*C+y*z+x*k+L*dt,r[15]=v*b+y*R+x*j+L*St,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*l*d-s*c*d-r*a*u+n*c*u+s*a*p-n*l*p)+_*(+e*l*p-e*c*u+r*o*u-s*o*p+s*c*h-r*l*h)+m*(+e*c*d-e*a*p-r*o*d+n*o*p+r*a*h-n*c*h)+f*(-s*a*h-e*l*d+e*a*u+s*o*d-n*o*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],v=d*m*c-_*u*c+_*l*p-a*m*p-d*l*f+a*u*f,y=g*u*c-h*m*c-g*l*p+o*m*p+h*l*f-o*u*f,x=h*_*c-g*d*c+g*a*p-o*_*p-h*a*f+o*d*f,L=g*d*l-h*_*l-g*a*u+o*_*u+h*a*m-o*d*m,E=e*v+n*y+s*x+r*L;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=v*A,t[1]=(_*u*r-d*m*r-_*s*p+n*m*p+d*s*f-n*u*f)*A,t[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*f+n*l*f)*A,t[3]=(d*l*r-a*u*r-d*s*c+n*u*c+a*s*p-n*l*p)*A,t[4]=y*A,t[5]=(h*m*r-g*u*r+g*s*p-e*m*p-h*s*f+e*u*f)*A,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*f-e*l*f)*A,t[7]=(o*u*r-h*l*r+h*s*c-e*u*c-o*s*p+e*l*p)*A,t[8]=x*A,t[9]=(g*d*r-h*_*r-g*n*p+e*_*p+h*n*f-e*d*f)*A,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*f+e*a*f)*A,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*p-e*a*p)*A,t[12]=L*A,t[13]=(h*_*s-g*d*s+g*n*u-e*_*u-h*n*m+e*d*m)*A,t[14]=(g*a*s-o*_*s-g*n*l+e*_*l+o*n*m-e*a*m)*A,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*u+e*a*u)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,p=r*h,g=r*d,_=o*h,m=o*d,f=a*d,v=l*c,y=l*h,x=l*d,L=n.x,E=n.y,A=n.z;return s[0]=(1-(_+f))*L,s[1]=(p+x)*L,s[2]=(g-y)*L,s[3]=0,s[4]=(p-x)*E,s[5]=(1-(u+f))*E,s[6]=(m+v)*E,s[7]=0,s[8]=(g+y)*A,s[9]=(m-v)*A,s[10]=(1-(u+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ui.set(s[0],s[1],s[2]).length();const o=Ui.set(s[4],s[5],s[6]).length(),a=Ui.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],tn.copy(this);const c=1/r,h=1/o,d=1/a;return tn.elements[0]*=c,tn.elements[1]*=c,tn.elements[2]*=c,tn.elements[4]*=h,tn.elements[5]*=h,tn.elements[6]*=h,tn.elements[8]*=d,tn.elements[9]*=d,tn.elements[10]*=d,e.setFromRotationMatrix(tn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=En){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let p,g;if(a===En)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Gs)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=En){const l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),u=(e+t)*c,p=(n+s)*h;let g,_;if(a===En)g=(o+r)*d,_=-2*d;else if(a===Gs)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ui=new D,tn=new $t,Ku=new D(0,0,0),Ju=new D(1,1,1),Vn=new D,Zs=new D,ke=new D,_c=new $t,vc=new hn;class un{constructor(t=0,e=0,n=0,s=un.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Me(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Me(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Me(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Me(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Me(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Me(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return _c.makeRotationFromQuaternion(t),this.setFromRotationMatrix(_c,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return vc.setFromEuler(this),this.setFromQuaternion(vc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}un.DEFAULT_ORDER="XYZ";class ra{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Qu=0;const xc=new D,Ni=new hn,Cn=new $t,Ks=new D,_s=new D,tf=new D,ef=new hn,yc=new D(1,0,0),Mc=new D(0,1,0),Sc=new D(0,0,1),Ec={type:"added"},nf={type:"removed"},Oi={type:"childadded",child:null},oa={type:"childremoved",child:null};class ge extends ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ge.DEFAULT_UP.clone();const t=new D,e=new un,n=new hn,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $t},normalMatrix:{value:new Pt}}),this.matrix=new $t,this.matrixWorld=new $t,this.matrixAutoUpdate=ge.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ra,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ni.setFromAxisAngle(t,e),this.quaternion.multiply(Ni),this}rotateOnWorldAxis(t,e){return Ni.setFromAxisAngle(t,e),this.quaternion.premultiply(Ni),this}rotateX(t){return this.rotateOnAxis(yc,t)}rotateY(t){return this.rotateOnAxis(Mc,t)}rotateZ(t){return this.rotateOnAxis(Sc,t)}translateOnAxis(t,e){return xc.copy(t).applyQuaternion(this.quaternion),this.position.add(xc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(yc,t)}translateY(t){return this.translateOnAxis(Mc,t)}translateZ(t){return this.translateOnAxis(Sc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ks.copy(t):Ks.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),_s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(_s,Ks,this.up):Cn.lookAt(Ks,_s,this.up),this.quaternion.setFromRotationMatrix(Cn),s&&(Cn.extractRotation(s.matrixWorld),Ni.setFromRotationMatrix(Cn),this.quaternion.premultiply(Ni.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ec),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(nf),oa.child=t,this.dispatchEvent(oa),oa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Cn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Cn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ec),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,t,tf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,ef,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ge.DEFAULT_UP=new D(0,1,0),ge.DEFAULT_MATRIX_AUTO_UPDATE=!0,ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const en=new D,Rn=new D,aa=new D,Pn=new D,Fi=new D,zi=new D,bc=new D,la=new D,ca=new D,ha=new D,da=new Qt,ua=new Qt,fa=new Qt;class Xe{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),en.subVectors(t,e),s.cross(en);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){en.subVectors(s,e),Rn.subVectors(n,e),aa.subVectors(t,e);const o=en.dot(en),a=en.dot(Rn),l=en.dot(aa),c=Rn.dot(Rn),h=Rn.dot(aa),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,p=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Pn)===null?!1:Pn.x>=0&&Pn.y>=0&&Pn.x+Pn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Pn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Pn.x),l.addScaledVector(o,Pn.y),l.addScaledVector(a,Pn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return da.setScalar(0),ua.setScalar(0),fa.setScalar(0),da.fromBufferAttribute(t,e),ua.fromBufferAttribute(t,n),fa.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(da,r.x),o.addScaledVector(ua,r.y),o.addScaledVector(fa,r.z),o}static isFrontFacing(t,e,n,s){return en.subVectors(n,e),Rn.subVectors(t,e),en.cross(Rn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return en.subVectors(this.c,this.b),Rn.subVectors(this.a,this.b),en.cross(Rn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(.3333333333333333)}getNormal(t){return Xe.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Xe.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Xe.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Xe.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Xe.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Fi.subVectors(s,n),zi.subVectors(r,n),la.subVectors(t,n);const l=Fi.dot(la),c=zi.dot(la);if(l<=0&&c<=0)return e.copy(n);ca.subVectors(t,s);const h=Fi.dot(ca),d=zi.dot(ca);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Fi,o);ha.subVectors(t,r);const p=Fi.dot(ha),g=zi.dot(ha);if(g>=0&&p<=g)return e.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(zi,a);const m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return bc.subVectors(r,s),a=(d-h)/(d-h+(p-g)),e.copy(s).addScaledVector(bc,a);const f=1/(m+_+u);return o=_*f,a=u*f,e.copy(n).addScaledVector(Fi,o).addScaledVector(zi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const wc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},Js={h:0,s:0,l:0};function pa(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<.16666666666666666?i+(t-i)*6*e:e<.5?t:e<.6666666666666666?i+(t-i)*6*(.6666666666666666-e):i}class Ft{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ht.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Ht.workingColorSpace){return this.r=t,this.g=e,this.b=n,Ht.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Ht.workingColorSpace){if(t=Zo(t,1),e=Me(e,0,1),n=Me(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=pa(o,r,t+.3333333333333333),this.g=pa(o,r,t),this.b=pa(o,r,t-.3333333333333333)}return Ht.toWorkingColorSpace(this,s),this}setStyle(t,e=Be){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=wc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wn(t.r),this.g=wn(t.g),this.b=wn(t.b),this}copyLinearToSRGB(t){return this.r=Ri(t.r),this.g=Ri(t.g),this.b=Ri(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return Ht.fromWorkingColorSpace(Ce.copy(this),t),Math.round(Me(Ce.r*255,0,255))*65536+Math.round(Me(Ce.g*255,0,255))*256+Math.round(Me(Ce.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Ht.workingColorSpace){Ht.fromWorkingColorSpace(Ce.copy(this),e);const n=Ce.r,s=Ce.g,r=Ce.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Ht.workingColorSpace){return Ht.fromWorkingColorSpace(Ce.copy(this),e),t.r=Ce.r,t.g=Ce.g,t.b=Ce.b,t}getStyle(t=Be){Ht.fromWorkingColorSpace(Ce.copy(this),t);const e=Ce.r,n=Ce.g,s=Ce.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Wn),this.setHSL(Wn.h+t,Wn.s+e,Wn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Wn),t.getHSL(Js);const n=fs(Wn.h,Js.h,e),s=fs(Wn.s,Js.s,e),r=fs(Wn.l,Js.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ce=new Ft;Ft.NAMES=wc;let sf=0;class ai extends ii{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sf++}),this.uuid=bn(),this.name="",this.blending=xi,this.side=yn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=to,this.blendDst=eo,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ft(0,0,0),this.blendAlpha=0,this.depthFunc=yi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ai,this.stencilZFail=Ai,this.stencilZPass=Ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xi&&(n.blending=this.blending),this.side!==yn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==to&&(n.blendSrc=this.blendSrc),this.blendDst!==eo&&(n.blendDst=this.blendDst),this.blendEquation!==Qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==yi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class vs extends ai{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.combine=co,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const he=new D,Qs=new ht;class Ie{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=jo,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Qs.fromBufferAttribute(this,e),Qs.applyMatrix3(t),this.setXY(e,Qs.x,Qs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyMatrix3(t),this.setXYZ(e,he.x,he.y,he.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyMatrix4(t),this.setXYZ(e,he.x,he.y,he.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyNormalMatrix(t),this.setXYZ(e,he.x,he.y,he.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.transformDirection(t),this.setXYZ(e,he.x,he.y,he.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Je(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=jt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Je(e,this.array)),e}setX(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Je(e,this.array)),e}setY(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Je(e,this.array)),e}setZ(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Je(e,this.array)),e}setW(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),s=jt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),s=jt(s,this.array),r=jt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==jo&&(t.usage=this.usage),t}}class Tc extends Ie{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Ac extends Ie{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends Ie{constructor(t,e,n){super(new Float32Array(t),e,n)}}let rf=0;const $e=new $t,ma=new ge,Bi=new D,He=new dn,xs=new dn,_e=new D;class Se extends ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=bn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ac(t)?Ac:Tc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Pt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,n){return $e.makeTranslation(t,e,n),this.applyMatrix4($e),this}scale(t,e,n){return $e.makeScale(t,e,n),this.applyMatrix4($e),this}lookAt(t){return ma.lookAt(t),ma.updateMatrix(),this.applyMatrix4(ma.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new oe(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];He.setFromBufferAttribute(r),this.morphTargetsRelative?(_e.addVectors(this.boundingBox.min,He.min),this.boundingBox.expandByPoint(_e),_e.addVectors(this.boundingBox.max,He.max),this.boundingBox.expandByPoint(_e)):(this.boundingBox.expandByPoint(He.min),this.boundingBox.expandByPoint(He.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(He.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];xs.setFromBufferAttribute(a),this.morphTargetsRelative?(_e.addVectors(He.min,xs.min),He.expandByPoint(_e),_e.addVectors(He.max,xs.max),He.expandByPoint(_e)):(He.expandByPoint(xs.min),He.expandByPoint(xs.max))}He.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)_e.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(_e));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)_e.fromBufferAttribute(a,c),l&&(Bi.fromBufferAttribute(t,c),_e.add(Bi)),s=Math.max(s,n.distanceToSquared(_e))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ie(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new D,l[C]=new D;const c=new D,h=new D,d=new D,u=new ht,p=new ht,g=new ht,_=new D,m=new D;function f(C,b,M){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,M),u.fromBufferAttribute(r,C),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,M),h.sub(c),d.sub(c),p.sub(u),g.sub(u);const P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(P),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(P),a[C].add(_),a[b].add(_),a[M].add(_),l[C].add(m),l[b].add(m),l[M].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let C=0,b=v.length;C<b;++C){const M=v[C],P=M.start,z=M.count;for(let R=P,F=P+z;R<F;R+=3)f(t.getX(R+0),t.getX(R+1),t.getX(R+2))}const y=new D,x=new D,L=new D,E=new D;function A(C){L.fromBufferAttribute(s,C),E.copy(L);const b=a[C];y.copy(b),y.sub(L.multiplyScalar(L.dot(b))).normalize(),x.crossVectors(E,b);const P=x.dot(l[C])<0?-1:1;o.setXYZW(C,y.x,y.y,y.z,P)}for(let C=0,b=v.length;C<b;++C){const M=v[C],P=M.start,z=M.count;for(let R=P,F=P+z;R<F;R+=3)A(t.getX(R+0)),A(t.getX(R+1)),A(t.getX(R+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ie(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,h=new D,d=new D;if(t)for(let u=0,p=t.count;u<p;u+=3){const g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=e.count;u<p;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)_e.fromBufferAttribute(t,e),_e.normalize(),t.setXYZ(e,_e.x,_e.y,_e.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*h;for(let f=0;f<h;f++)u[g++]=c[p++]}return new Ie(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Se,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],p=t(u,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const p=c[d];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Cc=new $t,li=new js,tr=new Hn,Rc=new D,er=new D,nr=new D,ir=new D,ga=new D,sr=new D,Pc=new D,rr=new D;class qe extends ge{constructor(t=new Se,e=new vs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){sr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(ga.fromBufferAttribute(d,t),o?sr.addScaledVector(ga,h):sr.addScaledVector(ga.sub(e),h))}e.add(sr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),tr.copy(n.boundingSphere),tr.applyMatrix4(r),li.copy(t.ray).recast(t.near),!(tr.containsPoint(li.origin)===!1&&(li.intersectSphere(tr,Rc)===null||li.origin.distanceToSquared(Rc)>(t.far-t.near)**2))&&(Cc.copy(r).invert(),li.copy(t.ray).applyMatrix4(Cc),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,li)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=o[m.materialIndex],v=Math.max(m.start,p.start),y=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let x=v,L=y;x<L;x+=3){const E=a.getX(x),A=a.getX(x+1),C=a.getX(x+2);s=or(this,f,t,n,c,h,d,E,A,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const v=a.getX(m),y=a.getX(m+1),x=a.getX(m+2);s=or(this,o,t,n,c,h,d,v,y,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=o[m.materialIndex],v=Math.max(m.start,p.start),y=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let x=v,L=y;x<L;x+=3){const E=x,A=x+1,C=x+2;s=or(this,f,t,n,c,h,d,E,A,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const v=m,y=m+1,x=m+2;s=or(this,o,t,n,c,h,d,v,y,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function of(i,t,e,n,s,r,o,a){let l;if(t.side===Pe?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===yn,a),l===null)return null;rr.copy(a),rr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(rr);return c<e.near||c>e.far?null:{distance:c,point:rr.clone(),object:i}}function or(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,er),i.getVertexPosition(l,nr),i.getVertexPosition(c,ir);const h=of(i,t,e,n,er,nr,ir,Pc);if(h){const d=new D;Xe.getBarycoord(Pc,er,nr,ir,d),s&&(h.uv=Xe.getInterpolatedAttribute(s,a,l,c,d,new ht)),r&&(h.uv1=Xe.getInterpolatedAttribute(r,a,l,c,d,new ht)),o&&(h.normal=Xe.getInterpolatedAttribute(o,a,l,c,d,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new D,materialIndex:0};Xe.getNormal(er,nr,ir,u.normal),h.face=u,h.barycoord=d}return h}class ki extends Se{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(d,2));function g(_,m,f,v,y,x,L,E,A,C,b){const M=x/A,P=L/C,z=x/2,R=L/2,F=E/2,V=A+1,k=C+1;let j=0,W=0;const it=new D;for(let dt=0;dt<k;dt++){const St=dt*P-R;for(let Nt=0;Nt<V;Nt++){const te=Nt*M-z;it[_]=te*v,it[m]=St*y,it[f]=F,c.push(it.x,it.y,it.z),it[_]=0,it[m]=0,it[f]=E>0?1:-1,h.push(it.x,it.y,it.z),d.push(Nt/A),d.push(1-dt/C),j+=1}}for(let dt=0;dt<C;dt++)for(let St=0;St<A;St++){const Nt=u+St+V*dt,te=u+St+V*(dt+1),Y=u+(St+1)+V*(dt+1),et=u+(St+1)+V*dt;l.push(Nt,te,et),l.push(te,Y,et),W+=6}a.addGroup(p,W,b),p+=W,u+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ki(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Le(i){const t={};for(let e=0;e<i.length;e++){const n=Hi(i[e]);for(const s in n)t[s]=n[s]}return t}function af(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Lc(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ht.workingColorSpace}const _a={clone:Hi,merge:Le};var lf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ln extends ai{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lf,this.fragmentShader=cf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hi(t.uniforms),this.uniformsGroups=af(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Dc extends ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $t,this.projectionMatrix=new $t,this.projectionMatrixInverse=new $t,this.coordinateSystem=En}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Xn=new D,Ic=new ht,Uc=new ht;class Ye extends Dc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=us*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ds*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return us*2*Math.atan(Math.tan(ds*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Xn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Xn.x,Xn.y).multiplyScalar(-t/Xn.z),Xn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Xn.x,Xn.y).multiplyScalar(-t/Xn.z)}getViewSize(t,e){return this.getViewBounds(t,Ic,Uc),e.subVectors(Uc,Ic)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ds*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Gi=-90,Vi=1;class hf extends ge{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ye(Gi,Vi,t,e);s.layers=this.layers,this.add(s);const r=new Ye(Gi,Vi,t,e);r.layers=this.layers,this.add(r);const o=new Ye(Gi,Vi,t,e);o.layers=this.layers,this.add(o);const a=new Ye(Gi,Vi,t,e);a.layers=this.layers,this.add(a);const l=new Ye(Gi,Vi,t,e);l.layers=this.layers,this.add(l);const c=new Ye(Gi,Vi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===En)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Gs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Nc extends Ae{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Mi,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class df extends si{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Nc(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ln}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ki(5,5,5),r=new Ln({name:"CubemapFromEquirect",uniforms:Hi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pe,blending:On});r.uniforms.tEquirect.value=e;const o=new qe(s,r),a=e.minFilter;return e.minFilter===ei&&(e.minFilter=ln),new hf(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const va=new D,uf=new D,ff=new Pt;class Dn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=va.subVectors(n,e).cross(uf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(va),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ff.getNormalMatrix(t),s=this.coplanarPoint(va).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new Hn,ar=new D;class xa{constructor(t=new Dn,e=new Dn,n=new Dn,s=new Dn,r=new Dn,o=new Dn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=En){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],v=s[13],y=s[14],x=s[15];if(n[0].setComponents(l-r,u-c,m-p,x-f).normalize(),n[1].setComponents(l+r,u+c,m+p,x+f).normalize(),n[2].setComponents(l+o,u+h,m+g,x+v).normalize(),n[3].setComponents(l-o,u-h,m-g,x-v).normalize(),n[4].setComponents(l-a,u-d,m-_,x-y).normalize(),e===En)n[5].setComponents(l+a,u+d,m+_,x+y).normalize();else if(e===Gs)n[5].setComponents(a,d,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(t){return ci.center.set(0,0,0),ci.radius=.7071067811865476,ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ar.x=s.normal.x>0?t.max.x:t.min.x,ar.y=s.normal.y>0?t.max.y:t.min.y,ar.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ar)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Oc(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function pf(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){const g=d[u],_=d[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){const _=d[p];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class ys extends Se{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){const v=f*u-o;for(let y=0;y<c;y++){const x=y*d-r;g.push(x,-v,0),_.push(0,0,1),m.push(y/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let v=0;v<a;v++){const y=v+c*f,x=v+c*(f+1),L=v+1+c*(f+1),E=v+1+c*f;p.push(y,x,E),p.push(x,L,E)}this.setIndex(p),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(_,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ys(t.width,t.height,t.widthSegments,t.heightSegments)}}var mf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gf=`#ifdef USE_ALPHAHASH
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
#endif`,_f=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mf=`#ifdef USE_AOMAP
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
#endif`,Sf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ef=`#ifdef USE_BATCHING
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
#endif`,bf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Af=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Cf=`#ifdef USE_IRIDESCENCE
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
#endif`,Rf=`#ifdef USE_BUMPMAP
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
#endif`,Pf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Lf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,If=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Uf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Nf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Of=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ff=`#if defined( USE_COLOR_ALPHA )
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
#endif`,zf=`#define PI 3.141592653589793
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
} // validated`,Bf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,kf=`vec3 transformedNormal = objectNormal;
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
#endif`,Hf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Gf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xf="gl_FragColor = linearToOutputTexel( gl_FragColor );",$f=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qf=`#ifdef USE_ENVMAP
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
#endif`,Yf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,jf=`#ifdef USE_ENVMAP
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
#endif`,Zf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Kf=`#ifdef USE_ENVMAP
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
#endif`,Jf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ep=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,np=`#ifdef USE_GRADIENTMAP
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
}`,ip=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,op=`uniform bool receiveShadow;
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
#endif`,ap=`#ifdef USE_ENVMAP
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
#endif`,lp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,up=`PhysicalMaterial material;
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
#endif`,fp=`struct PhysicalMaterial {
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
}`,pp=`
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
#endif`,mp=`#if defined( RE_IndirectDiffuse )
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
#endif`,gp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_p=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Mp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Sp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ep=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,bp=`#if defined( USE_POINTS_UV )
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
#endif`,wp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Tp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ap=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pp=`#ifdef USE_MORPHTARGETS
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
#endif`,Lp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ip=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Np=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Op=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Fp=`#ifdef USE_NORMALMAP
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
#endif`,zp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Gp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Wp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$p=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,jp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Kp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Qp=`float getShadowMask() {
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
}`,tm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,em=`#ifdef USE_SKINNING
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
#endif`,nm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,im=`#ifdef USE_SKINNING
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
#endif`,sm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,om=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,am=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,lm=`#ifdef USE_TRANSMISSION
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
#endif`,cm=`#ifdef USE_TRANSMISSION
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
#endif`,hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const It={alphahash_fragment:mf,alphahash_pars_fragment:gf,alphamap_fragment:_f,alphamap_pars_fragment:vf,alphatest_fragment:xf,alphatest_pars_fragment:yf,aomap_fragment:Mf,aomap_pars_fragment:Sf,batching_pars_vertex:Ef,batching_vertex:bf,begin_vertex:wf,beginnormal_vertex:Tf,bsdfs:Af,iridescence_fragment:Cf,bumpmap_pars_fragment:Rf,clipping_planes_fragment:Pf,clipping_planes_pars_fragment:Lf,clipping_planes_pars_vertex:Df,clipping_planes_vertex:If,color_fragment:Uf,color_pars_fragment:Nf,color_pars_vertex:Of,color_vertex:Ff,common:zf,cube_uv_reflection_fragment:Bf,defaultnormal_vertex:kf,displacementmap_pars_vertex:Hf,displacementmap_vertex:Gf,emissivemap_fragment:Vf,emissivemap_pars_fragment:Wf,colorspace_fragment:Xf,colorspace_pars_fragment:$f,envmap_fragment:qf,envmap_common_pars_fragment:Yf,envmap_pars_fragment:jf,envmap_pars_vertex:Zf,envmap_physical_pars_fragment:ap,envmap_vertex:Kf,fog_vertex:Jf,fog_pars_vertex:Qf,fog_fragment:tp,fog_pars_fragment:ep,gradientmap_pars_fragment:np,lightmap_pars_fragment:ip,lights_lambert_fragment:sp,lights_lambert_pars_fragment:rp,lights_pars_begin:op,lights_toon_fragment:lp,lights_toon_pars_fragment:cp,lights_phong_fragment:hp,lights_phong_pars_fragment:dp,lights_physical_fragment:up,lights_physical_pars_fragment:fp,lights_fragment_begin:pp,lights_fragment_maps:mp,lights_fragment_end:gp,logdepthbuf_fragment:_p,logdepthbuf_pars_fragment:vp,logdepthbuf_pars_vertex:xp,logdepthbuf_vertex:yp,map_fragment:Mp,map_pars_fragment:Sp,map_particle_fragment:Ep,map_particle_pars_fragment:bp,metalnessmap_fragment:wp,metalnessmap_pars_fragment:Tp,morphinstance_vertex:Ap,morphcolor_vertex:Cp,morphnormal_vertex:Rp,morphtarget_pars_vertex:Pp,morphtarget_vertex:Lp,normal_fragment_begin:Dp,normal_fragment_maps:Ip,normal_pars_fragment:Up,normal_pars_vertex:Np,normal_vertex:Op,normalmap_pars_fragment:Fp,clearcoat_normal_fragment_begin:zp,clearcoat_normal_fragment_maps:Bp,clearcoat_pars_fragment:kp,iridescence_pars_fragment:Hp,opaque_fragment:Gp,packing:Vp,premultiplied_alpha_fragment:Wp,project_vertex:Xp,dithering_fragment:$p,dithering_pars_fragment:qp,roughnessmap_fragment:Yp,roughnessmap_pars_fragment:jp,shadowmap_pars_fragment:Zp,shadowmap_pars_vertex:Kp,shadowmap_vertex:Jp,shadowmask_pars_fragment:Qp,skinbase_vertex:tm,skinning_pars_vertex:em,skinning_vertex:nm,skinnormal_vertex:im,specularmap_fragment:sm,specularmap_pars_fragment:rm,tonemapping_fragment:om,tonemapping_pars_fragment:am,transmission_fragment:lm,transmission_pars_fragment:cm,uv_pars_fragment:hm,uv_pars_vertex:dm,uv_vertex:um,worldpos_vertex:fm,background_vert:`varying vec2 vUv;
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
}`},nt={common:{diffuse:{value:new Ft(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Pt},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Pt}},envmap:{envMap:{value:null},envMapRotation:{value:new Pt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Pt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ft(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ft(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0},uvTransform:{value:new Pt}},sprite:{diffuse:{value:new Ft(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Pt},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0}}},Ue={basic:{uniforms:Le([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.fog]),vertexShader:It.meshbasic_vert,fragmentShader:It.meshbasic_frag},lambert:{uniforms:Le([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Ft(0)}}]),vertexShader:It.meshlambert_vert,fragmentShader:It.meshlambert_frag},phong:{uniforms:Le([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Ft(0)},specular:{value:new Ft(1118481)},shininess:{value:30}}]),vertexShader:It.meshphong_vert,fragmentShader:It.meshphong_frag},standard:{uniforms:Le([nt.common,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.roughnessmap,nt.metalnessmap,nt.fog,nt.lights,{emissive:{value:new Ft(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:It.meshphysical_vert,fragmentShader:It.meshphysical_frag},toon:{uniforms:Le([nt.common,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.gradientmap,nt.fog,nt.lights,{emissive:{value:new Ft(0)}}]),vertexShader:It.meshtoon_vert,fragmentShader:It.meshtoon_frag},matcap:{uniforms:Le([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,{matcap:{value:null}}]),vertexShader:It.meshmatcap_vert,fragmentShader:It.meshmatcap_frag},points:{uniforms:Le([nt.points,nt.fog]),vertexShader:It.points_vert,fragmentShader:It.points_frag},dashed:{uniforms:Le([nt.common,nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:It.linedashed_vert,fragmentShader:It.linedashed_frag},depth:{uniforms:Le([nt.common,nt.displacementmap]),vertexShader:It.depth_vert,fragmentShader:It.depth_frag},normal:{uniforms:Le([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,{opacity:{value:1}}]),vertexShader:It.meshnormal_vert,fragmentShader:It.meshnormal_frag},sprite:{uniforms:Le([nt.sprite,nt.fog]),vertexShader:It.sprite_vert,fragmentShader:It.sprite_frag},background:{uniforms:{uvTransform:{value:new Pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:It.background_vert,fragmentShader:It.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Pt}},vertexShader:It.backgroundCube_vert,fragmentShader:It.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:It.cube_vert,fragmentShader:It.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:It.equirect_vert,fragmentShader:It.equirect_frag},distanceRGBA:{uniforms:Le([nt.common,nt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:It.distanceRGBA_vert,fragmentShader:It.distanceRGBA_frag},shadow:{uniforms:Le([nt.lights,nt.fog,{color:{value:new Ft(0)},opacity:{value:1}}]),vertexShader:It.shadow_vert,fragmentShader:It.shadow_frag}};Ue.physical={uniforms:Le([Ue.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Pt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Pt},sheen:{value:0},sheenColor:{value:new Ft(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Pt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Pt},attenuationDistance:{value:0},attenuationColor:{value:new Ft(0)},specularColor:{value:new Ft(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Pt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Pt}}]),vertexShader:It.meshphysical_vert,fragmentShader:It.meshphysical_frag};const lr={r:0,b:0,g:0},hi=new un,pm=new $t;function mm(i,t,e,n,s,r,o){const a=new Ft(0);let l=r===!0?0:1,c,h,d=null,u=0,p=null;function g(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?e:t).get(y)),y}function _(v){let y=!1;const x=g(v);x===null?f(a,l):x&&x.isColor&&(f(x,1),y=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,y){const x=g(y);x&&(x.isCubeTexture||x.mapping===Us)?(h===void 0&&(h=new qe(new ki(1,1,1),new Ln({name:"BackgroundCubeMaterial",uniforms:Hi(Ue.backgroundCube.uniforms),vertexShader:Ue.backgroundCube.vertexShader,fragmentShader:Ue.backgroundCube.fragmentShader,side:Pe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),hi.copy(y.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(pm.makeRotationFromEuler(hi)),h.material.toneMapped=Ht.getTransfer(x.colorSpace)!==Kt,(d!==x||u!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,d=x,u=x.version,p=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new qe(new ys(2,2),new Ln({name:"BackgroundMaterial",uniforms:Hi(Ue.background.uniforms),vertexShader:Ue.background.vertexShader,fragmentShader:Ue.background.fragmentShader,side:yn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Ht.getTransfer(x.colorSpace)!==Kt,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||u!==x.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,d=x,u=x.version,p=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function f(v,y){v.getRGB(lr,Lc(i)),n.buffers.color.setClear(lr.r,lr.g,lr.b,y,o)}return{getClearColor:function(){return a},setClearColor:function(v,y=1){a.set(v),l=y,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,f(a,l)},render:_,addToRenderList:m}}function gm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(M,P,z,R,F){let V=!1;const k=d(R,z,P);r!==k&&(r=k,c(r.object)),V=p(M,R,z,F),V&&g(M,R,z,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(V||o)&&(o=!1,x(M,P,z,R),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function d(M,P,z){const R=z.wireframe===!0;let F=n[M.id];F===void 0&&(F={},n[M.id]=F);let V=F[P.id];V===void 0&&(V={},F[P.id]=V);let k=V[R];return k===void 0&&(k=u(l()),V[R]=k),k}function u(M){const P=[],z=[],R=[];for(let F=0;F<e;F++)P[F]=0,z[F]=0,R[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:z,attributeDivisors:R,object:M,attributes:{},index:null}}function p(M,P,z,R){const F=r.attributes,V=P.attributes;let k=0;const j=z.getAttributes();for(const W in j)if(j[W].location>=0){const dt=F[W];let St=V[W];if(St===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(St=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(St=M.instanceColor)),dt===void 0||dt.attribute!==St||St&&dt.data!==St.data)return!0;k++}return r.attributesNum!==k||r.index!==R}function g(M,P,z,R){const F={},V=P.attributes;let k=0;const j=z.getAttributes();for(const W in j)if(j[W].location>=0){let dt=V[W];dt===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(dt=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(dt=M.instanceColor));const St={};St.attribute=dt,dt&&dt.data&&(St.data=dt.data),F[W]=St,k++}r.attributes=F,r.attributesNum=k,r.index=R}function _(){const M=r.newAttributes;for(let P=0,z=M.length;P<z;P++)M[P]=0}function m(M){f(M,0)}function f(M,P){const z=r.newAttributes,R=r.enabledAttributes,F=r.attributeDivisors;z[M]=1,R[M]===0&&(i.enableVertexAttribArray(M),R[M]=1),F[M]!==P&&(i.vertexAttribDivisor(M,P),F[M]=P)}function v(){const M=r.newAttributes,P=r.enabledAttributes;for(let z=0,R=P.length;z<R;z++)P[z]!==M[z]&&(i.disableVertexAttribArray(z),P[z]=0)}function y(M,P,z,R,F,V,k){k===!0?i.vertexAttribIPointer(M,P,z,F,V):i.vertexAttribPointer(M,P,z,R,F,V)}function x(M,P,z,R){_();const F=R.attributes,V=z.getAttributes(),k=P.defaultAttributeValues;for(const j in V){const W=V[j];if(W.location>=0){let it=F[j];if(it===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(it=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(it=M.instanceColor)),it!==void 0){const dt=it.normalized,St=it.itemSize,Nt=t.get(it);if(Nt===void 0)continue;const te=Nt.buffer,Y=Nt.type,et=Nt.bytesPerElement,xt=Y===i.INT||Y===i.UNSIGNED_INT||it.gpuType===go;if(it.isInterleavedBufferAttribute){const rt=it.data,Tt=rt.stride,Rt=it.offset;if(rt.isInstancedInterleavedBuffer){for(let Ot=0;Ot<W.locationSize;Ot++)f(W.location+Ot,rt.meshPerAttribute);M.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Ot=0;Ot<W.locationSize;Ot++)m(W.location+Ot);i.bindBuffer(i.ARRAY_BUFFER,te);for(let Ot=0;Ot<W.locationSize;Ot++)y(W.location+Ot,St/W.locationSize,Y,dt,Tt*et,(Rt+St/W.locationSize*Ot)*et,xt)}else{if(it.isInstancedBufferAttribute){for(let rt=0;rt<W.locationSize;rt++)f(W.location+rt,it.meshPerAttribute);M.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let rt=0;rt<W.locationSize;rt++)m(W.location+rt);i.bindBuffer(i.ARRAY_BUFFER,te);for(let rt=0;rt<W.locationSize;rt++)y(W.location+rt,St/W.locationSize,Y,dt,St*et,St/W.locationSize*rt*et,xt)}}else if(k!==void 0){const dt=k[j];if(dt!==void 0)switch(dt.length){case 2:i.vertexAttrib2fv(W.location,dt);break;case 3:i.vertexAttrib3fv(W.location,dt);break;case 4:i.vertexAttrib4fv(W.location,dt);break;default:i.vertexAttrib1fv(W.location,dt)}}}}v()}function L(){C();for(const M in n){const P=n[M];for(const z in P){const R=P[z];for(const F in R)h(R[F].object),delete R[F];delete P[z]}delete n[M]}}function E(M){if(n[M.id]===void 0)return;const P=n[M.id];for(const z in P){const R=P[z];for(const F in R)h(R[F].object),delete R[F];delete P[z]}delete n[M.id]}function A(M){for(const P in n){const z=n[P];if(z[M.id]===void 0)continue;const R=z[M.id];for(const F in R)h(R[F].object),delete R[F];delete z[M.id]}}function C(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:b,dispose:L,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function _m(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function a(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];e.update(p,n,1)}function l(c,h,d,u){if(d===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*u[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function vm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Ke&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const C=A===hs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Sn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==cn&&!C)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:L,maxSamples:E}}function xm(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Dn,a=new Pt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const p=d.length!==0||u||n!==0||s;return s=u,n=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,p){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const v=r?0:n,y=v*4;let x=f.clippingState||null;l.value=x,x=h(g,u,y,p);for(let L=0;L!==y;++L)x[L]=e[L];f.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,p,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,v=u.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<f)&&(m=new Float32Array(f));for(let y=0,x=p;y!==_;++y,x+=4)o.copy(d[y]).applyMatrix4(v,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function ym(i){let t=new WeakMap;function e(o,a){return a===ho?o.mapping=Mi:a===uo&&(o.mapping=Si),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===ho||a===uo)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new df(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class ya extends Dc{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Wi=4,Fc=[.125,.215,.35,.446,.526,.582],di=20,Ma=new ya,zc=new Ft;let Sa=null,Ea=0,ba=0,wa=!1;const ui=(1+Math.sqrt(5))/2,Xi=1/ui,Bc=[new D(-ui,Xi,0),new D(ui,Xi,0),new D(-Xi,0,ui),new D(Xi,0,ui),new D(0,ui,-Xi),new D(0,ui,Xi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class kc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Sa=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Sa,Ea,ba),this._renderer.xr.enabled=wa,t.scissorTest=!1,cr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Mi||t.mapping===Si?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Sa=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:hs,format:Ke,colorSpace:Ti,depthBuffer:!1},s=Hc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Mm(r)),this._blurMaterial=Sm(r,t,e)}return s}_compileMaterial(t){const e=new qe(this._lodPlanes[0],t);this._renderer.compile(e,Ma)}_sceneToCubeUV(t,e,n,s){const a=new Ye(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(zc),h.toneMapping=Fn,h.autoClear=!1;const p=new vs({name:"PMREM.Background",side:Pe,depthWrite:!1,depthTest:!1}),g=new qe(new ki,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(zc),_=!0);for(let f=0;f<6;f++){const v=f%3;v===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):v===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const y=this._cubeSize;cr(s,v*y,f>2?y:0,y,y),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Mi||t.mapping===Si;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new qe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;cr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Ma)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Bc[(s-r-1)%Bc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new qe(this._lodPlanes[s],c),u=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*di-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):di;m>di&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${di}`);const f=[];let v=0;for(let A=0;A<di;++A){const C=A/_,b=Math.exp(-C*C/2);f.push(b),A===0?v+=b:A<m&&(v+=2*b)}for(let A=0;A<f.length;A++)f[A]=f[A]/v;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:y}=this;u.dTheta.value=g,u.mipInt.value=y-n;const x=this._sizeLods[s],L=3*x*(s>y-Wi?s-y+Wi:0),E=4*(this._cubeSize-x);cr(e,L,E,3*x,2*x),l.setRenderTarget(e),l.render(d,Ma)}}function Mm(i){const t=[],e=[],n=[];let s=i;const r=i-Wi+1+Fc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Wi?l=Fc[o-i+Wi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,_=3,m=2,f=1,v=new Float32Array(_*g*p),y=new Float32Array(m*g*p),x=new Float32Array(f*g*p);for(let E=0;E<p;E++){const A=E%3*2/3-1,C=E>2?0:-1,b=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];v.set(b,_*g*E),y.set(u,m*g*E);const M=[E,E,E,E,E,E];x.set(M,f*g*E)}const L=new Se;L.setAttribute("position",new Ie(v,_)),L.setAttribute("uv",new Ie(y,m)),L.setAttribute("faceIndex",new Ie(x,f)),t.push(L),s>Wi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Hc(i,t,e){const n=new si(i,t,e);return n.texture.mapping=Us,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function cr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Sm(i,t,e){const n=new Float32Array(di),s=new D(0,1,0);return new Ln({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ta(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function Gc(){return new Ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ta(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function Vc(){return new Ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ta(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function Ta(){return`

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
	`}function Em(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===ho||l===uo,h=l===Mi||l===Si;if(c||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new kc(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new kc(i)),d=c?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function bm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&ps("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function wm(i,t,e,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}u.removeEventListener("dispose",o),delete s[u.id];const p=r.get(u);p&&(t.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)t.update(u[g],i.ARRAY_BUFFER);const p=d.morphAttributes;for(const g in p){const _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],i.ARRAY_BUFFER)}}function c(d){const u=[],p=d.index,g=d.attributes.position;let _=0;if(p!==null){const v=p.array;_=p.version;for(let y=0,x=v.length;y<x;y+=3){const L=v[y+0],E=v[y+1],A=v[y+2];u.push(L,E,E,A,A,L)}}else if(g!==void 0){const v=g.array;_=g.version;for(let y=0,x=v.length/3-1;y<x;y+=3){const L=y+0,E=y+1,A=y+2;u.push(L,E,E,A,A,L)}}else return;const m=new(ac(u)?Ac:Tc)(u,1);m.version=_;const f=r.get(d);f&&t.remove(f),r.set(d,m)}function h(d){const u=r.get(d);if(u){const p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Tm(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,p){i.drawElements(n,p,r,u*o),e.update(p,n,1)}function c(u,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,u*o,g),e.update(p,n,g))}function h(u,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function d(u,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/o,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,u,0,_,0,g);let f=0;for(let v=0;v<g;v++)f+=p[v]*_[v];e.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Am(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Cm(i,t,e){const n=new WeakMap,s=new Qt;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let b=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",b)};u!==void 0&&u.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let y=0;p===!0&&(y=1),g===!0&&(y=2),_===!0&&(y=3);let x=a.attributes.position.count*y,L=1;x>t.maxTextureSize&&(L=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const E=new Float32Array(x*L*4*d),A=new mc(E,x,L,d);A.type=cn,A.needsUpdate=!0;const C=y*4;for(let M=0;M<d;M++){const P=m[M],z=f[M],R=v[M],F=x*L*4*M;for(let V=0;V<P.count;V++){const k=V*C;p===!0&&(s.fromBufferAttribute(P,V),E[F+k+0]=s.x,E[F+k+1]=s.y,E[F+k+2]=s.z,E[F+k+3]=0),g===!0&&(s.fromBufferAttribute(z,V),E[F+k+4]=s.x,E[F+k+5]=s.y,E[F+k+6]=s.z,E[F+k+7]=0),_===!0&&(s.fromBufferAttribute(R,V),E[F+k+8]=s.x,E[F+k+9]=s.y,E[F+k+10]=s.z,E[F+k+11]=R.itemSize===4?s.w:1)}}u={count:d,texture:A,size:new ht(x,L)},n.set(a,u),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];const g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Rm(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Wc extends Ae{constructor(t,e,n,s,r,o,a,l,c,h=bi){if(h!==bi&&h!==wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===bi&&(n=ni),n===void 0&&h===wi&&(n=Ei),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:ze,this.minFilter=l!==void 0?l:ze,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Xc=new Ae,$c=new Wc(1,1),qc=new mc,Yc=new ju,jc=new Nc,Zc=[],Kc=[],Jc=new Float32Array(16),Qc=new Float32Array(9),th=new Float32Array(4);function $i(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Zc[s];if(r===void 0&&(r=new Float32Array(s),Zc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function ue(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function fe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function hr(i,t){let e=Kc[t];e===void 0&&(e=new Int32Array(t),Kc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Pm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2fv(this.addr,t),fe(e,t)}}function Dm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ue(e,t))return;i.uniform3fv(this.addr,t),fe(e,t)}}function Im(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4fv(this.addr,t),fe(e,t)}}function Um(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;th.set(n),i.uniformMatrix2fv(this.addr,!1,th),fe(e,n)}}function Nm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;Qc.set(n),i.uniformMatrix3fv(this.addr,!1,Qc),fe(e,n)}}function Om(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;Jc.set(n),i.uniformMatrix4fv(this.addr,!1,Jc),fe(e,n)}}function Fm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function zm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2iv(this.addr,t),fe(e,t)}}function Bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ue(e,t))return;i.uniform3iv(this.addr,t),fe(e,t)}}function km(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4iv(this.addr,t),fe(e,t)}}function Hm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2uiv(this.addr,t),fe(e,t)}}function Vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ue(e,t))return;i.uniform3uiv(this.addr,t),fe(e,t)}}function Wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4uiv(this.addr,t),fe(e,t)}}function Xm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?($c.compareFunction=ic,r=$c):r=Xc,e.setTexture2D(t||r,s)}function $m(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Yc,s)}function qm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||jc,s)}function Ym(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||qc,s)}function jm(i){switch(i){case 5126:return Pm;case 35664:return Lm;case 35665:return Dm;case 35666:return Im;case 35674:return Um;case 35675:return Nm;case 35676:return Om;case 5124:case 35670:return Fm;case 35667:case 35671:return zm;case 35668:case 35672:return Bm;case 35669:case 35673:return km;case 5125:return Hm;case 36294:return Gm;case 36295:return Vm;case 36296:return Wm;case 35678:case 36198:case 36298:case 36306:case 35682:return Xm;case 35679:case 36299:case 36307:return $m;case 35680:case 36300:case 36308:case 36293:return qm;case 36289:case 36303:case 36311:case 36292:return Ym}}function Zm(i,t){i.uniform1fv(this.addr,t)}function Km(i,t){const e=$i(t,this.size,2);i.uniform2fv(this.addr,e)}function Jm(i,t){const e=$i(t,this.size,3);i.uniform3fv(this.addr,e)}function Qm(i,t){const e=$i(t,this.size,4);i.uniform4fv(this.addr,e)}function tg(i,t){const e=$i(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function eg(i,t){const e=$i(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function ng(i,t){const e=$i(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function ig(i,t){i.uniform1iv(this.addr,t)}function sg(i,t){i.uniform2iv(this.addr,t)}function rg(i,t){i.uniform3iv(this.addr,t)}function og(i,t){i.uniform4iv(this.addr,t)}function ag(i,t){i.uniform1uiv(this.addr,t)}function lg(i,t){i.uniform2uiv(this.addr,t)}function cg(i,t){i.uniform3uiv(this.addr,t)}function hg(i,t){i.uniform4uiv(this.addr,t)}function dg(i,t,e){const n=this.cache,s=t.length,r=hr(e,s);ue(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Xc,r[o])}function ug(i,t,e){const n=this.cache,s=t.length,r=hr(e,s);ue(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Yc,r[o])}function fg(i,t,e){const n=this.cache,s=t.length,r=hr(e,s);ue(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||jc,r[o])}function pg(i,t,e){const n=this.cache,s=t.length,r=hr(e,s);ue(n,r)||(i.uniform1iv(this.addr,r),fe(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||qc,r[o])}function mg(i){switch(i){case 5126:return Zm;case 35664:return Km;case 35665:return Jm;case 35666:return Qm;case 35674:return tg;case 35675:return eg;case 35676:return ng;case 5124:case 35670:return ig;case 35667:case 35671:return sg;case 35668:case 35672:return rg;case 35669:case 35673:return og;case 5125:return ag;case 36294:return lg;case 36295:return cg;case 36296:return hg;case 35678:case 36198:case 36298:case 36306:case 35682:return dg;case 35679:case 36299:case 36307:return ug;case 35680:case 36300:case 36308:case 36293:return fg;case 36289:case 36303:case 36311:case 36292:return pg}}class gg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=jm(e.type)}}class _g{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=mg(e.type)}}class vg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Aa=/(\w+)(\])?(\[|\.)?/g;function eh(i,t){i.seq.push(t),i.map[t.id]=t}function xg(i,t,e){const n=i.name,s=n.length;for(Aa.lastIndex=0;;){const r=Aa.exec(n),o=Aa.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){eh(e,c===void 0?new gg(a,i,t):new _g(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new vg(a),eh(e,d)),e=d}}}class dr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);xg(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function nh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const yg=37297;let Mg=0;function Sg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const ih=new Pt;function Eg(i){Ht._getMatrix(ih,Ht.workingColorSpace,i);const t=`mat3( ${ih.elements.map(e=>e.toFixed(4))} )`;switch(Ht.getTransfer(i)){case Hs:return[t,"LinearTransferOETF"];case Kt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function sh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Sg(i.getShaderSource(t),o)}else return s}function bg(i,t){const e=Eg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function wg(i,t){let e;switch(t){case au:e="Linear";break;case lu:e="Reinhard";break;case cu:e="Cineon";break;case hu:e="ACESFilmic";break;case uu:e="AgX";break;case fu:e="Neutral";break;case du:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ur=new D;function Tg(){Ht.getLuminanceCoefficients(ur);const i=ur.x.toFixed(4),t=ur.y.toFixed(4),e=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ag(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function Cg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Rg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ms(i){return i!==""}function rh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function oh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Pg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ca(i){return i.replace(Pg,Dg)}const Lg=new Map;function Dg(i,t){let e=It[t];if(e===void 0){const n=Lg.get(t);if(n!==void 0)e=It[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ca(e)}const Ig=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ah(i){return i.replace(Ig,Ug)}function Ug(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function lh(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Ng(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Hl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===kd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===xn&&(t="SHADOWMAP_TYPE_VSM"),t}function Og(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Mi:case Si:t="ENVMAP_TYPE_CUBE";break;case Us:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Fg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Si:t="ENVMAP_MODE_REFRACTION";break}return t}function zg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case co:t="ENVMAP_BLENDING_MULTIPLY";break;case ru:t="ENVMAP_BLENDING_MIX";break;case ou:t="ENVMAP_BLENDING_ADD";break}return t}function Bg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function kg(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Ng(e),c=Og(e),h=Fg(e),d=zg(e),u=Bg(e),p=Ag(e),g=Cg(r),_=s.createProgram();let m,f,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),f.length>0&&(f+=`
`)):(m=[lh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),f=[lh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Fn?"#define TONE_MAPPING":"",e.toneMapping!==Fn?It.tonemapping_pars_fragment:"",e.toneMapping!==Fn?wg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",It.colorspace_pars_fragment,bg("linearToOutputTexel",e.outputColorSpace),Tg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ms).join(`
`)),o=Ca(o),o=rh(o,e),o=oh(o,e),a=Ca(a),a=rh(a,e),a=oh(a,e),o=ah(o),a=ah(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===rc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===rc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=v+m+o,x=v+f+a,L=nh(s,s.VERTEX_SHADER,y),E=nh(s,s.FRAGMENT_SHADER,x);s.attachShader(_,L),s.attachShader(_,E),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(P){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(_).trim(),R=s.getShaderInfoLog(L).trim(),F=s.getShaderInfoLog(E).trim();let V=!0,k=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,E);else{const j=sh(s,L,"vertex"),W=sh(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+z+`
`+j+`
`+W)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(R===""||F==="")&&(k=!1);k&&(P.diagnostics={runnable:V,programLog:z,vertexShader:{log:R,prefix:m},fragmentShader:{log:F,prefix:f}})}s.deleteShader(L),s.deleteShader(E),C=new dr(s,_),b=Rg(s,_)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,yg)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Mg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=E,this}let Hg=0;class Gg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Vg(t),e.set(t,n)),n}}class Vg{constructor(t){this.id=Hg++,this.code=t,this.usedTimes=0}}function Wg(i,t,e,n,s,r,o){const a=new ra,l=new Gg,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,M,P,z,R){const F=z.fog,V=R.geometry,k=b.isMeshStandardMaterial?z.environment:null,j=(b.isMeshStandardMaterial?e:t).get(b.envMap||k),W=j&&j.mapping===Us?j.image.height:null,it=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));const dt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,St=dt!==void 0?dt.length:0;let Nt=0;V.morphAttributes.position!==void 0&&(Nt=1),V.morphAttributes.normal!==void 0&&(Nt=2),V.morphAttributes.color!==void 0&&(Nt=3);let te,Y,et,xt;if(it){const Zt=Ue[it];te=Zt.vertexShader,Y=Zt.fragmentShader}else te=b.vertexShader,Y=b.fragmentShader,l.update(b),et=l.getVertexShaderID(b),xt=l.getFragmentShaderID(b);const rt=i.getRenderTarget(),Tt=i.state.buffers.depth.getReversed(),Rt=R.isInstancedMesh===!0,Ot=R.isBatchedMesh===!0,ae=!!b.map,Gt=!!b.matcap,ce=!!j,O=!!b.aoMap,je=!!b.lightMap,zt=!!b.bumpMap,Bt=!!b.normalMap,bt=!!b.displacementMap,ie=!!b.emissiveMap,Et=!!b.metalnessMap,T=!!b.roughnessMap,S=b.anisotropy>0,B=b.clearcoat>0,Z=b.dispersion>0,J=b.iridescence>0,q=b.sheen>0,yt=b.transmission>0,ot=S&&!!b.anisotropyMap,ut=B&&!!b.clearcoatMap,Vt=B&&!!b.clearcoatNormalMap,Q=B&&!!b.clearcoatRoughnessMap,ft=J&&!!b.iridescenceMap,wt=J&&!!b.iridescenceThicknessMap,At=q&&!!b.sheenColorMap,pt=q&&!!b.sheenRoughnessMap,kt=!!b.specularMap,Ut=!!b.specularColorMap,ee=!!b.specularIntensityMap,I=yt&&!!b.transmissionMap,st=yt&&!!b.thicknessMap,X=!!b.gradientMap,K=!!b.alphaMap,ct=b.alphaTest>0,at=!!b.alphaHash,Lt=!!b.extensions;let le=Fn;b.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(le=i.toneMapping);const Re={shaderID:it,shaderType:b.type,shaderName:b.name,vertexShader:te,fragmentShader:Y,defines:b.defines,customVertexShaderID:et,customFragmentShaderID:xt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Ot,batchingColor:Ot&&R._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&R.instanceColor!==null,instancingMorph:Rt&&R.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Ti,alphaToCoverage:!!b.alphaToCoverage,map:ae,matcap:Gt,envMap:ce,envMapMode:ce&&j.mapping,envMapCubeUVHeight:W,aoMap:O,lightMap:je,bumpMap:zt,normalMap:Bt,displacementMap:u&&bt,emissiveMap:ie,normalMapObjectSpace:Bt&&b.normalMapType===_u,normalMapTangentSpace:Bt&&b.normalMapType===ec,metalnessMap:Et,roughnessMap:T,anisotropy:S,anisotropyMap:ot,clearcoat:B,clearcoatMap:ut,clearcoatNormalMap:Vt,clearcoatRoughnessMap:Q,dispersion:Z,iridescence:J,iridescenceMap:ft,iridescenceThicknessMap:wt,sheen:q,sheenColorMap:At,sheenRoughnessMap:pt,specularMap:kt,specularColorMap:Ut,specularIntensityMap:ee,transmission:yt,transmissionMap:I,thicknessMap:st,gradientMap:X,opaque:b.transparent===!1&&b.blending===xi&&b.alphaToCoverage===!1,alphaMap:K,alphaTest:ct,alphaHash:at,combine:b.combine,mapUv:ae&&_(b.map.channel),aoMapUv:O&&_(b.aoMap.channel),lightMapUv:je&&_(b.lightMap.channel),bumpMapUv:zt&&_(b.bumpMap.channel),normalMapUv:Bt&&_(b.normalMap.channel),displacementMapUv:bt&&_(b.displacementMap.channel),emissiveMapUv:ie&&_(b.emissiveMap.channel),metalnessMapUv:Et&&_(b.metalnessMap.channel),roughnessMapUv:T&&_(b.roughnessMap.channel),anisotropyMapUv:ot&&_(b.anisotropyMap.channel),clearcoatMapUv:ut&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Vt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:ft&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:wt&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:At&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:pt&&_(b.sheenRoughnessMap.channel),specularMapUv:kt&&_(b.specularMap.channel),specularColorMapUv:Ut&&_(b.specularColorMap.channel),specularIntensityMapUv:ee&&_(b.specularIntensityMap.channel),transmissionMapUv:I&&_(b.transmissionMap.channel),thicknessMapUv:st&&_(b.thicknessMap.channel),alphaMapUv:K&&_(b.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Bt||S),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!V.attributes.uv&&(ae||K),fog:!!F,useFog:b.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Tt,skinning:R.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:St,morphTextureStride:Nt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:le,decodeVideoTexture:ae&&b.map.isVideoTexture===!0&&Ht.getTransfer(b.map.colorSpace)===Kt,decodeVideoTextureEmissive:ie&&b.emissiveMap.isVideoTexture===!0&&Ht.getTransfer(b.emissiveMap.colorSpace)===Kt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Mn,flipSided:b.side===Pe,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Lt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&b.extensions.multiDraw===!0||Ot)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Re.vertexUv1s=c.has(1),Re.vertexUv2s=c.has(2),Re.vertexUv3s=c.has(3),c.clear(),Re}function f(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)M.push(P),M.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(v(M,b),y(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function v(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function y(b,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){const M=g[b.type];let P;if(M){const z=Ue[M];P=_a.clone(z.uniforms)}else P=b.uniforms;return P}function L(b,M){let P;for(let z=0,R=h.length;z<R;z++){const F=h[z];if(F.cacheKey===M){P=F,++P.usedTimes;break}}return P===void 0&&(P=new kg(i,M,b,r),h.push(P)),P}function E(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function A(b){l.remove(b)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:x,acquireProgram:L,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:C}}function Xg(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function $g(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function ch(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function hh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,u,p,g,_,m){let f=i[t];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},i[t]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=_,f.group=m),t++,f}function a(d,u,p,g,_,m){const f=o(d,u,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(d,u,p,g,_,m){const f=o(d,u,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(d,u){e.length>1&&e.sort(d||$g),n.length>1&&n.sort(u||ch),s.length>1&&s.sort(u||ch)}function h(){for(let d=t,u=i.length;d<u;d++){const p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function qg(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new hh,i.set(n,[o])):s>=r.length?(o=new hh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Yg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Ft};break;case"SpotLight":e={position:new D,direction:new D,color:new Ft,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Ft,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Ft,groundColor:new Ft};break;case"RectAreaLight":e={color:new Ft,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function jg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Zg=0;function Kg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Jg(i){const t=new Yg,e=jg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new $t,o=new $t;function a(c){let h=0,d=0,u=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,v=0,y=0,x=0,L=0,E=0,A=0;c.sort(Kg);for(let b=0,M=c.length;b<M;b++){const P=c[b],z=P.color,R=P.intensity,F=P.distance,V=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=z.r*R,d+=z.g*R,u+=z.b*R;else if(P.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(P.sh.coefficients[k],R);A++}else if(P.isDirectionalLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,W=e.get(P);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,n.directionalShadow[p]=W,n.directionalShadowMap[p]=V,n.directionalShadowMatrix[p]=P.shadow.matrix,v++}n.directional[p]=k,p++}else if(P.isSpotLight){const k=t.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(z).multiplyScalar(R),k.distance=F,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,n.spot[_]=k;const j=P.shadow;if(P.map&&(n.spotLightMap[L]=P.map,L++,j.updateMatrices(P),P.castShadow&&E++),n.spotLightMatrix[_]=j.matrix,P.castShadow){const W=e.get(P);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=V,x++}_++}else if(P.isRectAreaLight){const k=t.get(P);k.color.copy(z).multiplyScalar(R),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=k,m++}else if(P.isPointLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){const j=P.shadow,W=e.get(P);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,W.shadowCameraNear=j.camera.near,W.shadowCameraFar=j.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=V,n.pointShadowMatrix[g]=P.shadow.matrix,y++}n.point[g]=k,g++}else if(P.isHemisphereLight){const k=t.get(P);k.skyColor.copy(P.color).multiplyScalar(R),k.groundColor.copy(P.groundColor).multiplyScalar(R),n.hemi[f]=k,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=nt.LTC_FLOAT_1,n.rectAreaLTC2=nt.LTC_FLOAT_2):(n.rectAreaLTC1=nt.LTC_HALF_1,n.rectAreaLTC2=nt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const C=n.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==f||C.numDirectionalShadows!==v||C.numPointShadows!==y||C.numSpotShadows!==x||C.numSpotMaps!==L||C.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=x+L-E,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,C.directionalLength=p,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=f,C.numDirectionalShadows=v,C.numPointShadows=y,C.numSpotShadows=x,C.numSpotMaps=L,C.numLightProbes=A,n.version=Zg++)}function l(c,h){let d=0,u=0,p=0,g=0,_=0;const m=h.matrixWorldInverse;for(let f=0,v=c.length;f<v;f++){const y=c[f];if(y.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),d++}else if(y.isSpotLight){const x=n.spot[p];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),p++}else if(y.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const x=n.point[u];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),u++}else if(y.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function dh(i){const t=new Jg(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Qg(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new dh(i),t.set(s,[a])):r>=o.length?(a=new dh(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class t_ extends ai{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=mu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class e_ extends ai{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const n_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,i_=`uniform sampler2D shadow_pass;
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
}`;function s_(i,t,e){let n=new xa;const s=new ht,r=new ht,o=new Qt,a=new t_({depthPacking:gu}),l=new e_,c={},h=e.maxTextureSize,d={[yn]:Pe,[Pe]:yn,[Mn]:Mn},u=new Ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:n_,fragmentShader:i_}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const g=new Se;g.setAttribute("position",new Ie(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new qe(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hl;let f=this.type;this.render=function(E,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const b=i.getRenderTarget(),M=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),z=i.state;z.setBlending(On),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const R=f!==xn&&this.type===xn,F=f===xn&&this.type!==xn;for(let V=0,k=E.length;V<k;V++){const j=E[V],W=j.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const it=W.getFrameExtents();if(s.multiply(it),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/it.x),s.x=r.x*it.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/it.y),s.y=r.y*it.y,W.mapSize.y=r.y)),W.map===null||R===!0||F===!0){const St=this.type!==xn?{minFilter:ze,magFilter:ze}:{};W.map!==null&&W.map.dispose(),W.map=new si(s.x,s.y,St),W.map.texture.name=j.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const dt=W.getViewportCount();for(let St=0;St<dt;St++){const Nt=W.getViewport(St);o.set(r.x*Nt.x,r.y*Nt.y,r.x*Nt.z,r.y*Nt.w),z.viewport(o),W.updateMatrices(j,St),n=W.getFrustum(),x(A,C,W.camera,j,this.type)}W.isPointLightShadow!==!0&&this.type===xn&&v(W,C),W.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(b,M,P)};function v(E,A){const C=t.update(_);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new si(s.x,s.y)),u.uniforms.shadow_pass.value=E.map.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,C,u,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,C,p,_,null)}function y(E,A,C,b){let M=null;const P=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(P!==void 0)M=P;else if(M=C.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=M.uuid,R=A.uuid;let F=c[z];F===void 0&&(F={},c[z]=F);let V=F[R];V===void 0&&(V=M.clone(),F[R]=V,A.addEventListener("dispose",L)),M=V}if(M.visible=A.visible,M.wireframe=A.wireframe,b===xn?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:d[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const z=i.properties.get(M);z.light=C}return M}function x(E,A,C,b,M){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&M===xn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);const R=t.update(E),F=E.material;if(Array.isArray(F)){const V=R.groups;for(let k=0,j=V.length;k<j;k++){const W=V[k],it=F[W.materialIndex];if(it&&it.visible){const dt=y(E,it,b,M);E.onBeforeShadow(i,E,A,C,R,dt,W),i.renderBufferDirect(C,null,R,dt,E,W),E.onAfterShadow(i,E,A,C,R,dt,W)}}}else if(F.visible){const V=y(E,F,b,M);E.onBeforeShadow(i,E,A,C,R,V,null),i.renderBufferDirect(C,null,R,V,E,null),E.onAfterShadow(i,E,A,C,R,V,null)}}const z=E.children;for(let R=0,F=z.length;R<F;R++)x(z[R],A,C,b,M)}function L(E){E.target.removeEventListener("dispose",L);for(const C in c){const b=c[C],M=E.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const r_={[no]:io,[so]:ao,[ro]:lo,[yi]:oo,[io]:no,[ao]:so,[lo]:ro,[oo]:yi};function o_(i,t){function e(){let I=!1;const st=new Qt;let X=null;const K=new Qt(0,0,0,0);return{setMask:function(ct){X!==ct&&!I&&(i.colorMask(ct,ct,ct,ct),X=ct)},setLocked:function(ct){I=ct},setClear:function(ct,at,Lt,le,Re){Re===!0&&(ct*=le,at*=le,Lt*=le),st.set(ct,at,Lt,le),K.equals(st)===!1&&(i.clearColor(ct,at,Lt,le),K.copy(st))},reset:function(){I=!1,X=null,K.set(-1,0,0,0)}}}function n(){let I=!1,st=!1,X=null,K=null,ct=null;return{setReversed:function(at){if(st!==at){const Lt=t.get("EXT_clip_control");st?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT);const le=ct;ct=null,this.setClear(le)}st=at},getReversed:function(){return st},setTest:function(at){at?rt(i.DEPTH_TEST):Tt(i.DEPTH_TEST)},setMask:function(at){X!==at&&!I&&(i.depthMask(at),X=at)},setFunc:function(at){if(st&&(at=r_[at]),K!==at){switch(at){case no:i.depthFunc(i.NEVER);break;case io:i.depthFunc(i.ALWAYS);break;case so:i.depthFunc(i.LESS);break;case yi:i.depthFunc(i.LEQUAL);break;case ro:i.depthFunc(i.EQUAL);break;case oo:i.depthFunc(i.GEQUAL);break;case ao:i.depthFunc(i.GREATER);break;case lo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=at}},setLocked:function(at){I=at},setClear:function(at){ct!==at&&(st&&(at=1-at),i.clearDepth(at),ct=at)},reset:function(){I=!1,X=null,K=null,ct=null,st=!1}}}function s(){let I=!1,st=null,X=null,K=null,ct=null,at=null,Lt=null,le=null,Re=null;return{setTest:function(Zt){I||(Zt?rt(i.STENCIL_TEST):Tt(i.STENCIL_TEST))},setMask:function(Zt){st!==Zt&&!I&&(i.stencilMask(Zt),st=Zt)},setFunc:function(Zt,nn,In){(X!==Zt||K!==nn||ct!==In)&&(i.stencilFunc(Zt,nn,In),X=Zt,K=nn,ct=In)},setOp:function(Zt,nn,In){(at!==Zt||Lt!==nn||le!==In)&&(i.stencilOp(Zt,nn,In),at=Zt,Lt=nn,le=In)},setLocked:function(Zt){I=Zt},setClear:function(Zt){Re!==Zt&&(i.clearStencil(Zt),Re=Zt)},reset:function(){I=!1,st=null,X=null,K=null,ct=null,at=null,Lt=null,le=null,Re=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,v=null,y=null,x=null,L=null,E=null,A=new Ft(0,0,0),C=0,b=!1,M=null,P=null,z=null,R=null,F=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,j=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(W)[1]),k=j>=1):W.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),k=j>=2);let it=null,dt={};const St=i.getParameter(i.SCISSOR_BOX),Nt=i.getParameter(i.VIEWPORT),te=new Qt().fromArray(St),Y=new Qt().fromArray(Nt);function et(I,st,X,K){const ct=new Uint8Array(4),at=i.createTexture();i.bindTexture(I,at),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Lt=0;Lt<X;Lt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(st,0,i.RGBA,1,1,K,0,i.RGBA,i.UNSIGNED_BYTE,ct):i.texImage2D(st+Lt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ct);return at}const xt={};xt[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),xt[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),xt[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),xt[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),rt(i.DEPTH_TEST),o.setFunc(yi),zt(!1),Bt(kl),rt(i.CULL_FACE),O(On);function rt(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function Tt(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Rt(I,st){return d[I]!==st?(i.bindFramebuffer(I,st),d[I]=st,I===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=st),I===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=st),!0):!1}function Ot(I,st){let X=p,K=!1;if(I){X=u.get(st),X===void 0&&(X=[],u.set(st,X));const ct=I.textures;if(X.length!==ct.length||X[0]!==i.COLOR_ATTACHMENT0){for(let at=0,Lt=ct.length;at<Lt;at++)X[at]=i.COLOR_ATTACHMENT0+at;X.length=ct.length,K=!0}}else X[0]!==i.BACK&&(X[0]=i.BACK,K=!0);K&&i.drawBuffers(X)}function ae(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const Gt={[Qn]:i.FUNC_ADD,[Gd]:i.FUNC_SUBTRACT,[Vd]:i.FUNC_REVERSE_SUBTRACT};Gt[Wd]=i.MIN,Gt[Xd]=i.MAX;const ce={[$d]:i.ZERO,[qd]:i.ONE,[Yd]:i.SRC_COLOR,[to]:i.SRC_ALPHA,[tu]:i.SRC_ALPHA_SATURATE,[Jd]:i.DST_COLOR,[Zd]:i.DST_ALPHA,[jd]:i.ONE_MINUS_SRC_COLOR,[eo]:i.ONE_MINUS_SRC_ALPHA,[Qd]:i.ONE_MINUS_DST_COLOR,[Kd]:i.ONE_MINUS_DST_ALPHA,[eu]:i.CONSTANT_COLOR,[nu]:i.ONE_MINUS_CONSTANT_COLOR,[iu]:i.CONSTANT_ALPHA,[su]:i.ONE_MINUS_CONSTANT_ALPHA};function O(I,st,X,K,ct,at,Lt,le,Re,Zt){if(I===On){_===!0&&(Tt(i.BLEND),_=!1);return}if(_===!1&&(rt(i.BLEND),_=!0),I!==Hd){if(I!==m||Zt!==b){if((f!==Qn||x!==Qn)&&(i.blendEquation(i.FUNC_ADD),f=Qn,x=Qn),Zt)switch(I){case xi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Gl:i.blendFunc(i.ONE,i.ONE);break;case Vl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Wl:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case xi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Gl:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Vl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Wl:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}v=null,y=null,L=null,E=null,A.set(0,0,0),C=0,m=I,b=Zt}return}ct=ct||st,at=at||X,Lt=Lt||K,(st!==f||ct!==x)&&(i.blendEquationSeparate(Gt[st],Gt[ct]),f=st,x=ct),(X!==v||K!==y||at!==L||Lt!==E)&&(i.blendFuncSeparate(ce[X],ce[K],ce[at],ce[Lt]),v=X,y=K,L=at,E=Lt),(le.equals(A)===!1||Re!==C)&&(i.blendColor(le.r,le.g,le.b,Re),A.copy(le),C=Re),m=I,b=!1}function je(I,st){I.side===Mn?Tt(i.CULL_FACE):rt(i.CULL_FACE);let X=I.side===Pe;st&&(X=!X),zt(X),I.blending===xi&&I.transparent===!1?O(On):O(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);const K=I.stencilWrite;a.setTest(K),K&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ie(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):Tt(i.SAMPLE_ALPHA_TO_COVERAGE)}function zt(I){M!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),M=I)}function Bt(I){I!==zd?(rt(i.CULL_FACE),I!==P&&(I===kl?i.cullFace(i.BACK):I===Bd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Tt(i.CULL_FACE),P=I}function bt(I){I!==z&&(k&&i.lineWidth(I),z=I)}function ie(I,st,X){I?(rt(i.POLYGON_OFFSET_FILL),(R!==st||F!==X)&&(i.polygonOffset(st,X),R=st,F=X)):Tt(i.POLYGON_OFFSET_FILL)}function Et(I){I?rt(i.SCISSOR_TEST):Tt(i.SCISSOR_TEST)}function T(I){I===void 0&&(I=i.TEXTURE0+V-1),it!==I&&(i.activeTexture(I),it=I)}function S(I,st,X){X===void 0&&(it===null?X=i.TEXTURE0+V-1:X=it);let K=dt[X];K===void 0&&(K={type:void 0,texture:void 0},dt[X]=K),(K.type!==I||K.texture!==st)&&(it!==X&&(i.activeTexture(X),it=X),i.bindTexture(I,st||xt[I]),K.type=I,K.texture=st)}function B(){const I=dt[it];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Z(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function yt(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ut(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Vt(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ft(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function wt(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function At(I){te.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),te.copy(I))}function pt(I){Y.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),Y.copy(I))}function kt(I,st){let X=c.get(st);X===void 0&&(X=new WeakMap,c.set(st,X));let K=X.get(I);K===void 0&&(K=i.getUniformBlockIndex(st,I.name),X.set(I,K))}function Ut(I,st){const K=c.get(st).get(I);l.get(st)!==K&&(i.uniformBlockBinding(st,K,I.__bindingPointIndex),l.set(st,K))}function ee(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},it=null,dt={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,v=null,y=null,x=null,L=null,E=null,A=new Ft(0,0,0),C=0,b=!1,M=null,P=null,z=null,R=null,F=null,te.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:rt,disable:Tt,bindFramebuffer:Rt,drawBuffers:Ot,useProgram:ae,setBlending:O,setMaterial:je,setFlipSided:zt,setCullFace:Bt,setLineWidth:bt,setPolygonOffset:ie,setScissorTest:Et,activeTexture:T,bindTexture:S,unbindTexture:B,compressedTexImage2D:Z,compressedTexImage3D:J,texImage2D:ft,texImage3D:wt,updateUBOMapping:kt,uniformBlockBinding:Ut,texStorage2D:Vt,texStorage3D:Q,texSubImage2D:q,texSubImage3D:yt,compressedTexSubImage2D:ot,compressedTexSubImage3D:ut,scissor:At,viewport:pt,reset:ee}}function uh(i,t,e,n){const s=a_(n);switch(e){case jl:return i*t;case Kl:return i*t;case Jl:return i*t*2;case xo:return i*t/s.components*s.byteLength;case yo:return i*t/s.components*s.byteLength;case Ql:return i*t*2/s.components*s.byteLength;case Mo:return i*t*2/s.components*s.byteLength;case Zl:return i*t*3/s.components*s.byteLength;case Ke:return i*t*4/s.components*s.byteLength;case So:return i*t*4/s.components*s.byteLength;case Os:case Fs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case zs:case Bs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case bo:case To:return Math.max(i,16)*Math.max(t,8)/4;case Eo:case wo:return Math.max(i,8)*Math.max(t,8)/2;case Ao:case Co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ro:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Lo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Do:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Io:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Uo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case No:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Oo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Fo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case zo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Bo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ko:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Go:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Vo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ks:case Wo:case Xo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case tc:case $o:return Math.ceil(i/4)*Math.ceil(t/4)*8;case qo:case Yo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function a_(i){switch(i){case Sn:case $l:return{byteLength:1,components:1};case cs:case ql:case hs:return{byteLength:2,components:1};case _o:case vo:return{byteLength:2,components:4};case ni:case go:case cn:return{byteLength:4,components:1};case Yl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function l_(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ht,h=new WeakMap;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,S){return p?new OffscreenCanvas(T,S):Vs("canvas")}function _(T,S,B){let Z=1;const J=Et(T);if((J.width>B||J.height>B)&&(Z=B/Math.max(J.width,J.height)),Z<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const q=Math.floor(Z*J.width),yt=Math.floor(Z*J.height);d===void 0&&(d=g(q,yt));const ot=S?g(q,yt):d;return ot.width=q,ot.height=yt,ot.getContext("2d").drawImage(T,0,0,q,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+q+"x"+yt+")."),ot}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),T;return T}function m(T){return T.generateMipmaps}function f(T){i.generateMipmap(T)}function v(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(T,S,B,Z,J=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let q=S;if(S===i.RED&&(B===i.FLOAT&&(q=i.R32F),B===i.HALF_FLOAT&&(q=i.R16F),B===i.UNSIGNED_BYTE&&(q=i.R8)),S===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.R8UI),B===i.UNSIGNED_SHORT&&(q=i.R16UI),B===i.UNSIGNED_INT&&(q=i.R32UI),B===i.BYTE&&(q=i.R8I),B===i.SHORT&&(q=i.R16I),B===i.INT&&(q=i.R32I)),S===i.RG&&(B===i.FLOAT&&(q=i.RG32F),B===i.HALF_FLOAT&&(q=i.RG16F),B===i.UNSIGNED_BYTE&&(q=i.RG8)),S===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RG8UI),B===i.UNSIGNED_SHORT&&(q=i.RG16UI),B===i.UNSIGNED_INT&&(q=i.RG32UI),B===i.BYTE&&(q=i.RG8I),B===i.SHORT&&(q=i.RG16I),B===i.INT&&(q=i.RG32I)),S===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RGB8UI),B===i.UNSIGNED_SHORT&&(q=i.RGB16UI),B===i.UNSIGNED_INT&&(q=i.RGB32UI),B===i.BYTE&&(q=i.RGB8I),B===i.SHORT&&(q=i.RGB16I),B===i.INT&&(q=i.RGB32I)),S===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),B===i.UNSIGNED_INT&&(q=i.RGBA32UI),B===i.BYTE&&(q=i.RGBA8I),B===i.SHORT&&(q=i.RGBA16I),B===i.INT&&(q=i.RGBA32I)),S===i.RGB&&B===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),S===i.RGBA){const yt=J?Hs:Ht.getTransfer(Z);B===i.FLOAT&&(q=i.RGBA32F),B===i.HALF_FLOAT&&(q=i.RGBA16F),B===i.UNSIGNED_BYTE&&(q=yt===Kt?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function x(T,S){let B;return T?S===null||S===ni||S===Ei?B=i.DEPTH24_STENCIL8:S===cn?B=i.DEPTH32F_STENCIL8:S===cs&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ni||S===Ei?B=i.DEPTH_COMPONENT24:S===cn?B=i.DEPTH_COMPONENT32F:S===cs&&(B=i.DEPTH_COMPONENT16),B}function L(T,S){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==ze&&T.minFilter!==ln?Math.log2(Math.max(S.width,S.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?S.mipmaps.length:1}function E(T){const S=T.target;S.removeEventListener("dispose",E),C(S),S.isVideoTexture&&h.delete(S)}function A(T){const S=T.target;S.removeEventListener("dispose",A),M(S)}function C(T){const S=n.get(T);if(S.__webglInit===void 0)return;const B=T.source,Z=u.get(B);if(Z){const J=Z[S.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(T),Object.keys(Z).length===0&&u.delete(B)}n.remove(T)}function b(T){const S=n.get(T);i.deleteTexture(S.__webglTexture);const B=T.source,Z=u.get(B);delete Z[S.__cacheKey],o.memory.textures--}function M(T){const S=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let J=0;J<S.__webglFramebuffer[Z].length;J++)i.deleteFramebuffer(S.__webglFramebuffer[Z][J]);else i.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)i.deleteFramebuffer(S.__webglFramebuffer[Z]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const B=T.textures;for(let Z=0,J=B.length;Z<J;Z++){const q=n.get(B[Z]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(B[Z])}n.remove(T)}let P=0;function z(){P=0}function R(){const T=P;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),P+=1,T}function F(T){const S=[];return S.push(T.wrapS),S.push(T.wrapT),S.push(T.wrapR||0),S.push(T.magFilter),S.push(T.minFilter),S.push(T.anisotropy),S.push(T.internalFormat),S.push(T.format),S.push(T.type),S.push(T.generateMipmaps),S.push(T.premultiplyAlpha),S.push(T.flipY),S.push(T.unpackAlignment),S.push(T.colorSpace),S.join()}function V(T,S){const B=n.get(T);if(T.isVideoTexture&&bt(T),T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){const Z=T.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(B,T,S);return}}e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+S)}function k(T,S){const B=n.get(T);if(T.version>0&&B.__version!==T.version){Y(B,T,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+S)}function j(T,S){const B=n.get(T);if(T.version>0&&B.__version!==T.version){Y(B,T,S);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+S)}function W(T,S){const B=n.get(T);if(T.version>0&&B.__version!==T.version){et(B,T,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+S)}const it={[fo]:i.REPEAT,[ti]:i.CLAMP_TO_EDGE,[po]:i.MIRRORED_REPEAT},dt={[ze]:i.NEAREST,[pu]:i.NEAREST_MIPMAP_NEAREST,[Ns]:i.NEAREST_MIPMAP_LINEAR,[ln]:i.LINEAR,[mo]:i.LINEAR_MIPMAP_NEAREST,[ei]:i.LINEAR_MIPMAP_LINEAR},St={[vu]:i.NEVER,[bu]:i.ALWAYS,[xu]:i.LESS,[ic]:i.LEQUAL,[yu]:i.EQUAL,[Eu]:i.GEQUAL,[Mu]:i.GREATER,[Su]:i.NOTEQUAL};function Nt(T,S){if(S.type===cn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===ln||S.magFilter===mo||S.magFilter===Ns||S.magFilter===ei||S.minFilter===ln||S.minFilter===mo||S.minFilter===Ns||S.minFilter===ei)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,it[S.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,it[S.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,it[S.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,dt[S.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,dt[S.minFilter]),S.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,St[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===ze||S.minFilter!==Ns&&S.minFilter!==ei||S.type===cn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function te(T,S){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,S.addEventListener("dispose",E));const Z=S.source;let J=u.get(Z);J===void 0&&(J={},u.set(Z,J));const q=F(S);if(q!==T.__cacheKey){J[q]===void 0&&(J[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),J[q].usedTimes++;const yt=J[T.__cacheKey];yt!==void 0&&(J[T.__cacheKey].usedTimes--,yt.usedTimes===0&&b(S)),T.__cacheKey=q,T.__webglTexture=J[q].texture}return B}function Y(T,S,B){let Z=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=i.TEXTURE_3D);const J=te(T,S),q=S.source;e.bindTexture(Z,T.__webglTexture,i.TEXTURE0+B);const yt=n.get(q);if(q.version!==yt.__version||J===!0){e.activeTexture(i.TEXTURE0+B);const ot=Ht.getPrimaries(Ht.workingColorSpace),ut=S.colorSpace===zn?null:Ht.getPrimaries(S.colorSpace),Vt=S.colorSpace===zn||ot===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt);let Q=_(S.image,!1,s.maxTextureSize);Q=ie(S,Q);const ft=r.convert(S.format,S.colorSpace),wt=r.convert(S.type);let At=y(S.internalFormat,ft,wt,S.colorSpace,S.isVideoTexture);Nt(Z,S);let pt;const kt=S.mipmaps,Ut=S.isVideoTexture!==!0,ee=yt.__version===void 0||J===!0,I=q.dataReady,st=L(S,Q);if(S.isDepthTexture)At=x(S.format===wi,S.type),ee&&(Ut?e.texStorage2D(i.TEXTURE_2D,1,At,Q.width,Q.height):e.texImage2D(i.TEXTURE_2D,0,At,Q.width,Q.height,0,ft,wt,null));else if(S.isDataTexture)if(kt.length>0){Ut&&ee&&e.texStorage2D(i.TEXTURE_2D,st,At,kt[0].width,kt[0].height);for(let X=0,K=kt.length;X<K;X++)pt=kt[X],Ut?I&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,pt.width,pt.height,ft,wt,pt.data):e.texImage2D(i.TEXTURE_2D,X,At,pt.width,pt.height,0,ft,wt,pt.data);S.generateMipmaps=!1}else Ut?(ee&&e.texStorage2D(i.TEXTURE_2D,st,At,Q.width,Q.height),I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Q.width,Q.height,ft,wt,Q.data)):e.texImage2D(i.TEXTURE_2D,0,At,Q.width,Q.height,0,ft,wt,Q.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ut&&ee&&e.texStorage3D(i.TEXTURE_2D_ARRAY,st,At,kt[0].width,kt[0].height,Q.depth);for(let X=0,K=kt.length;X<K;X++)if(pt=kt[X],S.format!==Ke)if(ft!==null)if(Ut){if(I)if(S.layerUpdates.size>0){const ct=uh(pt.width,pt.height,S.format,S.type);for(const at of S.layerUpdates){const Lt=pt.data.subarray(at*ct/pt.data.BYTES_PER_ELEMENT,(at+1)*ct/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,at,pt.width,pt.height,1,ft,Lt)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,pt.width,pt.height,Q.depth,ft,pt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,X,At,pt.width,pt.height,Q.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,pt.width,pt.height,Q.depth,ft,wt,pt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,X,At,pt.width,pt.height,Q.depth,0,ft,wt,pt.data)}else{Ut&&ee&&e.texStorage2D(i.TEXTURE_2D,st,At,kt[0].width,kt[0].height);for(let X=0,K=kt.length;X<K;X++)pt=kt[X],S.format!==Ke?ft!==null?Ut?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,X,0,0,pt.width,pt.height,ft,pt.data):e.compressedTexImage2D(i.TEXTURE_2D,X,At,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?I&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,pt.width,pt.height,ft,wt,pt.data):e.texImage2D(i.TEXTURE_2D,X,At,pt.width,pt.height,0,ft,wt,pt.data)}else if(S.isDataArrayTexture)if(Ut){if(ee&&e.texStorage3D(i.TEXTURE_2D_ARRAY,st,At,Q.width,Q.height,Q.depth),I)if(S.layerUpdates.size>0){const X=uh(Q.width,Q.height,S.format,S.type);for(const K of S.layerUpdates){const ct=Q.data.subarray(K*X/Q.data.BYTES_PER_ELEMENT,(K+1)*X/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,Q.width,Q.height,1,ft,wt,ct)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ft,wt,Q.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,At,Q.width,Q.height,Q.depth,0,ft,wt,Q.data);else if(S.isData3DTexture)Ut?(ee&&e.texStorage3D(i.TEXTURE_3D,st,At,Q.width,Q.height,Q.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ft,wt,Q.data)):e.texImage3D(i.TEXTURE_3D,0,At,Q.width,Q.height,Q.depth,0,ft,wt,Q.data);else if(S.isFramebufferTexture){if(ee)if(Ut)e.texStorage2D(i.TEXTURE_2D,st,At,Q.width,Q.height);else{let X=Q.width,K=Q.height;for(let ct=0;ct<st;ct++)e.texImage2D(i.TEXTURE_2D,ct,At,X,K,0,ft,wt,null),X>>=1,K>>=1}}else if(kt.length>0){if(Ut&&ee){const X=Et(kt[0]);e.texStorage2D(i.TEXTURE_2D,st,At,X.width,X.height)}for(let X=0,K=kt.length;X<K;X++)pt=kt[X],Ut?I&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,ft,wt,pt):e.texImage2D(i.TEXTURE_2D,X,At,ft,wt,pt);S.generateMipmaps=!1}else if(Ut){if(ee){const X=Et(Q);e.texStorage2D(i.TEXTURE_2D,st,At,X.width,X.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ft,wt,Q)}else e.texImage2D(i.TEXTURE_2D,0,At,ft,wt,Q);m(S)&&f(Z),yt.__version=q.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function et(T,S,B){if(S.image.length!==6)return;const Z=te(T,S),J=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+B);const q=n.get(J);if(J.version!==q.__version||Z===!0){e.activeTexture(i.TEXTURE0+B);const yt=Ht.getPrimaries(Ht.workingColorSpace),ot=S.colorSpace===zn?null:Ht.getPrimaries(S.colorSpace),ut=S.colorSpace===zn||yt===ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const Vt=S.isCompressedTexture||S.image[0].isCompressedTexture,Q=S.image[0]&&S.image[0].isDataTexture,ft=[];for(let K=0;K<6;K++)!Vt&&!Q?ft[K]=_(S.image[K],!0,s.maxCubemapSize):ft[K]=Q?S.image[K].image:S.image[K],ft[K]=ie(S,ft[K]);const wt=ft[0],At=r.convert(S.format,S.colorSpace),pt=r.convert(S.type),kt=y(S.internalFormat,At,pt,S.colorSpace),Ut=S.isVideoTexture!==!0,ee=q.__version===void 0||Z===!0,I=J.dataReady;let st=L(S,wt);Nt(i.TEXTURE_CUBE_MAP,S);let X;if(Vt){Ut&&ee&&e.texStorage2D(i.TEXTURE_CUBE_MAP,st,kt,wt.width,wt.height);for(let K=0;K<6;K++){X=ft[K].mipmaps;for(let ct=0;ct<X.length;ct++){const at=X[ct];S.format!==Ke?At!==null?Ut?I&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ct,0,0,at.width,at.height,At,at.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ct,kt,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ct,0,0,at.width,at.height,At,pt,at.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ct,kt,at.width,at.height,0,At,pt,at.data)}}}else{if(X=S.mipmaps,Ut&&ee){X.length>0&&st++;const K=Et(ft[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,st,kt,K.width,K.height)}for(let K=0;K<6;K++)if(Q){Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ft[K].width,ft[K].height,At,pt,ft[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,kt,ft[K].width,ft[K].height,0,At,pt,ft[K].data);for(let ct=0;ct<X.length;ct++){const Lt=X[ct].image[K].image;Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ct+1,0,0,Lt.width,Lt.height,At,pt,Lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ct+1,kt,Lt.width,Lt.height,0,At,pt,Lt.data)}}else{Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,At,pt,ft[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,kt,At,pt,ft[K]);for(let ct=0;ct<X.length;ct++){const at=X[ct];Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ct+1,0,0,At,pt,at.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ct+1,kt,At,pt,at.image[K])}}}m(S)&&f(i.TEXTURE_CUBE_MAP),q.__version=J.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function xt(T,S,B,Z,J,q){const yt=r.convert(B.format,B.colorSpace),ot=r.convert(B.type),ut=y(B.internalFormat,yt,ot,B.colorSpace),Vt=n.get(S),Q=n.get(B);if(Q.__renderTarget=S,!Vt.__hasExternalTextures){const ft=Math.max(1,S.width>>q),wt=Math.max(1,S.height>>q);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,q,ut,ft,wt,S.depth,0,yt,ot,null):e.texImage2D(J,q,ut,ft,wt,0,yt,ot,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Bt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,J,Q.__webglTexture,0,zt(S)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,J,Q.__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function rt(T,S,B){if(i.bindRenderbuffer(i.RENDERBUFFER,T),S.depthBuffer){const Z=S.depthTexture,J=Z&&Z.isDepthTexture?Z.type:null,q=x(S.stencilBuffer,J),yt=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=zt(S);Bt(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,q,S.width,S.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,q,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,q,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,yt,i.RENDERBUFFER,T)}else{const Z=S.textures;for(let J=0;J<Z.length;J++){const q=Z[J],yt=r.convert(q.format,q.colorSpace),ot=r.convert(q.type),ut=y(q.internalFormat,yt,ot,q.colorSpace),Vt=zt(S);B&&Bt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,ut,S.width,S.height):Bt(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Vt,ut,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,ut,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(T,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(S.depthTexture);Z.__renderTarget=S,(!Z.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),V(S.depthTexture,0);const J=Z.__webglTexture,q=zt(S);if(S.depthTexture.format===bi)Bt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(S.depthTexture.format===wi)Bt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Rt(T){const S=n.get(T),B=T.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==T.depthTexture){const Z=T.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Z){const J=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Z.removeEventListener("dispose",J)};Z.addEventListener("dispose",J),S.__depthDisposeCallback=J}S.__boundDepthTexture=Z}if(T.depthTexture&&!S.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Tt(S.__webglFramebuffer,T)}else if(B){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]===void 0)S.__webglDepthbuffer[Z]=i.createRenderbuffer(),rt(S.__webglDepthbuffer[Z],T,!1);else{const J=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=S.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),rt(S.__webglDepthbuffer,T,!1);else{const Z=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,J)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(T,S,B){const Z=n.get(T);S!==void 0&&xt(Z.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Rt(T)}function ae(T){const S=T.texture,B=n.get(T),Z=n.get(S);T.addEventListener("dispose",A);const J=T.textures,q=T.isWebGLCubeRenderTarget===!0,yt=J.length>1;if(yt||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=S.version,o.memory.textures++),q){B.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(S.mipmaps&&S.mipmaps.length>0){B.__webglFramebuffer[ot]=[];for(let ut=0;ut<S.mipmaps.length;ut++)B.__webglFramebuffer[ot][ut]=i.createFramebuffer()}else B.__webglFramebuffer[ot]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){B.__webglFramebuffer=[];for(let ot=0;ot<S.mipmaps.length;ot++)B.__webglFramebuffer[ot]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(yt)for(let ot=0,ut=J.length;ot<ut;ot++){const Vt=n.get(J[ot]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&Bt(T)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ot=0;ot<J.length;ot++){const ut=J[ot];B.__webglColorRenderbuffer[ot]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[ot]);const Vt=r.convert(ut.format,ut.colorSpace),Q=r.convert(ut.type),ft=y(ut.internalFormat,Vt,Q,ut.colorSpace,T.isXRRenderTarget===!0),wt=zt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,wt,ft,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,B.__webglColorRenderbuffer[ot])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),rt(B.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Nt(i.TEXTURE_CUBE_MAP,S);for(let ot=0;ot<6;ot++)if(S.mipmaps&&S.mipmaps.length>0)for(let ut=0;ut<S.mipmaps.length;ut++)xt(B.__webglFramebuffer[ot][ut],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,ut);else xt(B.__webglFramebuffer[ot],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);m(S)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(yt){for(let ot=0,ut=J.length;ot<ut;ot++){const Vt=J[ot],Q=n.get(Vt);e.bindTexture(i.TEXTURE_2D,Q.__webglTexture),Nt(i.TEXTURE_2D,Vt),xt(B.__webglFramebuffer,T,Vt,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,0),m(Vt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let ot=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ot=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ot,Z.__webglTexture),Nt(ot,S),S.mipmaps&&S.mipmaps.length>0)for(let ut=0;ut<S.mipmaps.length;ut++)xt(B.__webglFramebuffer[ut],T,S,i.COLOR_ATTACHMENT0,ot,ut);else xt(B.__webglFramebuffer,T,S,i.COLOR_ATTACHMENT0,ot,0);m(S)&&f(ot),e.unbindTexture()}T.depthBuffer&&Rt(T)}function Gt(T){const S=T.textures;for(let B=0,Z=S.length;B<Z;B++){const J=S[B];if(m(J)){const q=v(T),yt=n.get(J).__webglTexture;e.bindTexture(q,yt),f(q),e.unbindTexture()}}}const ce=[],O=[];function je(T){if(T.samples>0){if(Bt(T)===!1){const S=T.textures,B=T.width,Z=T.height;let J=i.COLOR_BUFFER_BIT;const q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=n.get(T),ot=S.length>1;if(ot)for(let ut=0;ut<S.length;ut++)e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let ut=0;ut<S.length;ut++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),ot){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,yt.__webglColorRenderbuffer[ut]);const Vt=n.get(S[ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Vt,0)}i.blitFramebuffer(0,0,B,Z,0,0,B,Z,J,i.NEAREST),l===!0&&(ce.length=0,O.length=0,ce.push(i.COLOR_ATTACHMENT0+ut),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ce.push(q),O.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,O)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ce))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ot)for(let ut=0;ut<S.length;ut++){e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,yt.__webglColorRenderbuffer[ut]);const Vt=n.get(S[ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,Vt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const S=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function zt(T){return Math.min(s.maxSamples,T.samples)}function Bt(T){const S=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function bt(T){const S=o.render.frame;h.get(T)!==S&&(h.set(T,S),T.update())}function ie(T,S){const B=T.colorSpace,Z=T.format,J=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==Ti&&B!==zn&&(Ht.getTransfer(B)===Kt?(Z!==Ke||J!==Sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),S}function Et(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=R,this.resetTextureUnits=z,this.setTexture2D=V,this.setTexture2DArray=k,this.setTexture3D=j,this.setTextureCube=W,this.rebindTextures=Ot,this.setupRenderTarget=ae,this.updateRenderTargetMipmap=Gt,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=Bt}function c_(i,t){function e(n,s=zn){let r;const o=Ht.getTransfer(s);if(n===Sn)return i.UNSIGNED_BYTE;if(n===_o)return i.UNSIGNED_SHORT_4_4_4_4;if(n===vo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Yl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===$l)return i.BYTE;if(n===ql)return i.SHORT;if(n===cs)return i.UNSIGNED_SHORT;if(n===go)return i.INT;if(n===ni)return i.UNSIGNED_INT;if(n===cn)return i.FLOAT;if(n===hs)return i.HALF_FLOAT;if(n===jl)return i.ALPHA;if(n===Zl)return i.RGB;if(n===Ke)return i.RGBA;if(n===Kl)return i.LUMINANCE;if(n===Jl)return i.LUMINANCE_ALPHA;if(n===bi)return i.DEPTH_COMPONENT;if(n===wi)return i.DEPTH_STENCIL;if(n===xo)return i.RED;if(n===yo)return i.RED_INTEGER;if(n===Ql)return i.RG;if(n===Mo)return i.RG_INTEGER;if(n===So)return i.RGBA_INTEGER;if(n===Os||n===Fs||n===zs||n===Bs)if(o===Kt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Os)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Fs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===zs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Bs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Os)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Fs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===zs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Bs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Eo||n===bo||n===wo||n===To)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Eo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===bo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===wo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===To)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ao||n===Co||n===Ro)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ao||n===Co)return o===Kt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ro)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Po||n===Lo||n===Do||n===Io||n===Uo||n===No||n===Oo||n===Fo||n===zo||n===Bo||n===ko||n===Ho||n===Go||n===Vo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Po)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Lo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Do)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Io)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Uo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===No)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Oo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===zo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ko)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ho)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Go)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Vo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ks||n===Wo||n===Xo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ks)return o===Kt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Wo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Xo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===tc||n===$o||n===qo||n===Yo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ks)return r.COMPRESSED_RED_RGTC1_EXT;if(n===$o)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===qo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Yo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ei?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class h_ extends Ye{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class fr extends ge{constructor(){super(),this.isGroup=!0,this.type="Group"}}const d_={type:"move"};class Ra{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(d_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new fr;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const u_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,f_=`
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

}`;class p_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ae,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ln({vertexShader:u_,fragmentShader:f_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new qe(new ys(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class m_ extends ii{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,g=null;const _=new p_,m=e.getContextAttributes();let f=null,v=null;const y=[],x=[],L=new ht;let E=null;const A=new Ye;A.viewport=new Qt;const C=new Ye;C.viewport=new Qt;const b=[A,C],M=new h_;let P=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let et=y[Y];return et===void 0&&(et=new Ra,y[Y]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Y){let et=y[Y];return et===void 0&&(et=new Ra,y[Y]=et),et.getGripSpace()},this.getHand=function(Y){let et=y[Y];return et===void 0&&(et=new Ra,y[Y]=et),et.getHandSpace()};function R(Y){const et=x.indexOf(Y.inputSource);if(et===-1)return;const xt=y[et];xt!==void 0&&(xt.update(Y.inputSource,Y.frame,c||o),xt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function F(){s.removeEventListener("select",R),s.removeEventListener("selectstart",R),s.removeEventListener("selectend",R),s.removeEventListener("squeeze",R),s.removeEventListener("squeezestart",R),s.removeEventListener("squeezeend",R),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",V);for(let Y=0;Y<y.length;Y++){const et=x[Y];et!==null&&(x[Y]=null,y[Y].disconnect(et))}P=null,z=null,_.reset(),t.setRenderTarget(f),p=null,u=null,d=null,s=null,v=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",R),s.addEventListener("selectstart",R),s.addEventListener("selectend",R),s.addEventListener("squeeze",R),s.addEventListener("squeezestart",R),s.addEventListener("squeezeend",R),s.addEventListener("end",F),s.addEventListener("inputsourceschange",V),m.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const et={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,et),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new si(p.framebufferWidth,p.framebufferHeight,{format:Ke,type:Sn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let et=null,xt=null,rt=null;m.depth&&(rt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=m.stencil?wi:bi,xt=m.stencil?Ei:ni);const Tt={colorFormat:e.RGBA8,depthFormat:rt,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(Tt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),v=new si(u.textureWidth,u.textureHeight,{format:Ke,type:Sn,depthTexture:new Wc(u.textureWidth,u.textureHeight,xt,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),te.setContext(s),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function V(Y){for(let et=0;et<Y.removed.length;et++){const xt=Y.removed[et],rt=x.indexOf(xt);rt>=0&&(x[rt]=null,y[rt].disconnect(xt))}for(let et=0;et<Y.added.length;et++){const xt=Y.added[et];let rt=x.indexOf(xt);if(rt===-1){for(let Rt=0;Rt<y.length;Rt++)if(Rt>=x.length){x.push(xt),rt=Rt;break}else if(x[Rt]===null){x[Rt]=xt,rt=Rt;break}if(rt===-1)break}const Tt=y[rt];Tt&&Tt.connect(xt)}}const k=new D,j=new D;function W(Y,et,xt){k.setFromMatrixPosition(et.matrixWorld),j.setFromMatrixPosition(xt.matrixWorld);const rt=k.distanceTo(j),Tt=et.projectionMatrix.elements,Rt=xt.projectionMatrix.elements,Ot=Tt[14]/(Tt[10]-1),ae=Tt[14]/(Tt[10]+1),Gt=(Tt[9]+1)/Tt[5],ce=(Tt[9]-1)/Tt[5],O=(Tt[8]-1)/Tt[0],je=(Rt[8]+1)/Rt[0],zt=Ot*O,Bt=Ot*je,bt=rt/(-O+je),ie=bt*-O;if(et.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ie),Y.translateZ(bt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Tt[10]===-1)Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Et=Ot+bt,T=ae+bt,S=zt-ie,B=Bt+(rt-ie),Z=Gt*ae/T*Et,J=ce*ae/T*Et;Y.projectionMatrix.makePerspective(S,B,Z,J,Et,T),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function it(Y,et){et===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(et.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let et=Y.near,xt=Y.far;_.texture!==null&&(_.depthNear>0&&(et=_.depthNear),_.depthFar>0&&(xt=_.depthFar)),M.near=C.near=A.near=et,M.far=C.far=A.far=xt,(P!==M.near||z!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,z=M.far),A.layers.mask=Y.layers.mask|2,C.layers.mask=Y.layers.mask|4,M.layers.mask=A.layers.mask|C.layers.mask;const rt=Y.parent,Tt=M.cameras;it(M,rt);for(let Rt=0;Rt<Tt.length;Rt++)it(Tt[Rt],rt);Tt.length===2?W(M,A,C):M.projectionMatrix.copy(A.projectionMatrix),dt(Y,M,rt)};function dt(Y,et,xt){xt===null?Y.matrix.copy(et.matrixWorld):(Y.matrix.copy(xt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(et.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=us*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let St=null;function Nt(Y,et){if(h=et.getViewerPose(c||o),g=et,h!==null){const xt=h.views;p!==null&&(t.setRenderTargetFramebuffer(v,p.framebuffer),t.setRenderTarget(v));let rt=!1;xt.length!==M.cameras.length&&(M.cameras.length=0,rt=!0);for(let Rt=0;Rt<xt.length;Rt++){const Ot=xt[Rt];let ae=null;if(p!==null)ae=p.getViewport(Ot);else{const ce=d.getViewSubImage(u,Ot);ae=ce.viewport,Rt===0&&(t.setRenderTargetTextures(v,ce.colorTexture,u.ignoreDepthValues?void 0:ce.depthStencilTexture),t.setRenderTarget(v))}let Gt=b[Rt];Gt===void 0&&(Gt=new Ye,Gt.layers.enable(Rt),Gt.viewport=new Qt,b[Rt]=Gt),Gt.matrix.fromArray(Ot.transform.matrix),Gt.matrix.decompose(Gt.position,Gt.quaternion,Gt.scale),Gt.projectionMatrix.fromArray(Ot.projectionMatrix),Gt.projectionMatrixInverse.copy(Gt.projectionMatrix).invert(),Gt.viewport.set(ae.x,ae.y,ae.width,ae.height),Rt===0&&(M.matrix.copy(Gt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),rt===!0&&M.cameras.push(Gt)}const Tt=s.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")){const Rt=d.getDepthInformation(xt[0]);Rt&&Rt.isValid&&Rt.texture&&_.init(t,Rt,s.renderState)}}for(let xt=0;xt<y.length;xt++){const rt=x[xt],Tt=y[xt];rt!==null&&Tt!==void 0&&Tt.update(rt,et,c||o)}St&&St(Y,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}const te=new Oc;te.setAnimationLoop(Nt),this.setAnimationLoop=function(Y){St=Y},this.dispose=function(){}}}const fi=new un,g_=new $t;function __(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Lc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,v,y,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,x)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,v,y):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Pe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Pe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const v=t.get(f),y=v.envMap,x=v.envMapRotation;y&&(m.envMap.value=y,fi.copy(x),fi.x*=-1,fi.y*=-1,fi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),m.envMapRotation.value.setFromMatrix4(g_.makeRotationFromEuler(fi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,v,y){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*v,m.scale.value=y*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,v){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Pe&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const v=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function v_(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,y){const x=y.program;n.uniformBlockBinding(v,x)}function c(v,y){let x=s[v.id];x===void 0&&(g(v),x=h(v),s[v.id]=x,v.addEventListener("dispose",m));const L=y.program;n.updateUBOMapping(v,L);const E=t.render.frame;r[v.id]!==E&&(u(v),r[v.id]=E)}function h(v){const y=d();v.__bindingPointIndex=y;const x=i.createBuffer(),L=v.__size,E=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,L,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,x),x}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){const y=s[v.id],x=v.uniforms,L=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let E=0,A=x.length;E<A;E++){const C=Array.isArray(x[E])?x[E]:[x[E]];for(let b=0,M=C.length;b<M;b++){const P=C[b];if(p(P,E,b,L)===!0){const z=P.__offset,R=Array.isArray(P.value)?P.value:[P.value];let F=0;for(let V=0;V<R.length;V++){const k=R[V],j=_(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,z+F,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,F),F+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,y,x,L){const E=v.value,A=y+"_"+x;if(L[A]===void 0)return typeof E=="number"||typeof E=="boolean"?L[A]=E:L[A]=E.clone(),!0;{const C=L[A];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return L[A]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function g(v){const y=v.uniforms;let x=0;const L=16;for(let A=0,C=y.length;A<C;A++){const b=Array.isArray(y[A])?y[A]:[y[A]];for(let M=0,P=b.length;M<P;M++){const z=b[M],R=Array.isArray(z.value)?z.value:[z.value];for(let F=0,V=R.length;F<V;F++){const k=R[F],j=_(k),W=x%L,it=W%j.boundary,dt=W+it;x+=it,dt!==0&&L-dt<j.storage&&(x+=L-dt),z.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=x,x+=j.storage}}}const E=x%L;return E>0&&(x+=L-E),v.__size=x,v.__cache={},this}function _(v){const y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=48,y.storage=48):v.isMatrix4?(y.boundary=64,y.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),y}function m(v){const y=v.target;y.removeEventListener("dispose",m);const x=o.indexOf(y.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function f(){for(const v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}class x_{constructor(t={}){const{canvas:e=Hu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const v=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Be,this.toneMapping=Fn,this.toneMappingExposure=1;const x=this;let L=!1,E=0,A=0,C=null,b=-1,M=null;const P=new Qt,z=new Qt;let R=null;const F=new Ft(0);let V=0,k=e.width,j=e.height,W=1,it=null,dt=null;const St=new Qt(0,0,k,j),Nt=new Qt(0,0,k,j);let te=!1;const Y=new xa;let et=!1,xt=!1;const rt=new $t,Tt=new $t,Rt=new D,Ot=new Qt,ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Gt=!1;function ce(){return C===null?W:1}let O=n;function je(w,U){return e.getContext(w,U)}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Qr}`),e.addEventListener("webglcontextlost",K,!1),e.addEventListener("webglcontextrestored",ct,!1),e.addEventListener("webglcontextcreationerror",at,!1),O===null){const U="webgl2";if(O=je(U,w),O===null)throw je(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let zt,Bt,bt,ie,Et,T,S,B,Z,J,q,yt,ot,ut,Vt,Q,ft,wt,At,pt,kt,Ut,ee,I;function st(){zt=new bm(O),zt.init(),Ut=new c_(O,zt),Bt=new vm(O,zt,t,Ut),bt=new o_(O,zt),Bt.reverseDepthBuffer&&u&&bt.buffers.depth.setReversed(!0),ie=new Am(O),Et=new Xg,T=new l_(O,zt,bt,Et,Bt,Ut,ie),S=new ym(x),B=new Em(x),Z=new pf(O),ee=new gm(O,Z),J=new wm(O,Z,ie,ee),q=new Rm(O,J,Z,ie),At=new Cm(O,Bt,T),Q=new xm(Et),yt=new Wg(x,S,B,zt,Bt,ee,Q),ot=new __(x,Et),ut=new qg,Vt=new Qg(zt),wt=new mm(x,S,B,bt,q,p,l),ft=new s_(x,q,Bt),I=new v_(O,ie,Bt,bt),pt=new _m(O,zt,ie),kt=new Tm(O,zt,ie),ie.programs=yt.programs,x.capabilities=Bt,x.extensions=zt,x.properties=Et,x.renderLists=ut,x.shadowMap=ft,x.state=bt,x.info=ie}st();const X=new m_(x,O);this.xr=X,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const w=zt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=zt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(w){w!==void 0&&(W=w,this.setSize(k,j,!1))},this.getSize=function(w){return w.set(k,j)},this.setSize=function(w,U,H=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=w,j=U,e.width=Math.floor(w*W),e.height=Math.floor(U*W),H===!0&&(e.style.width=w+"px",e.style.height=U+"px"),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(k*W,j*W).floor()},this.setDrawingBufferSize=function(w,U,H){k=w,j=U,W=H,e.width=Math.floor(w*H),e.height=Math.floor(U*H),this.setViewport(0,0,w,U)},this.getCurrentViewport=function(w){return w.copy(P)},this.getViewport=function(w){return w.copy(St)},this.setViewport=function(w,U,H,G){w.isVector4?St.set(w.x,w.y,w.z,w.w):St.set(w,U,H,G),bt.viewport(P.copy(St).multiplyScalar(W).round())},this.getScissor=function(w){return w.copy(Nt)},this.setScissor=function(w,U,H,G){w.isVector4?Nt.set(w.x,w.y,w.z,w.w):Nt.set(w,U,H,G),bt.scissor(z.copy(Nt).multiplyScalar(W).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(w){bt.setScissorTest(te=w)},this.setOpaqueSort=function(w){it=w},this.setTransparentSort=function(w){dt=w},this.getClearColor=function(w){return w.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor.apply(wt,arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha.apply(wt,arguments)},this.clear=function(w=!0,U=!0,H=!0){let G=0;if(w){let N=!1;if(C!==null){const tt=C.texture.format;N=tt===So||tt===Mo||tt===yo}if(N){const tt=C.texture.type,lt=tt===Sn||tt===ni||tt===cs||tt===Ei||tt===_o||tt===vo,gt=wt.getClearColor(),_t=wt.getClearAlpha(),Ct=gt.r,Dt=gt.g,vt=gt.b;lt?(g[0]=Ct,g[1]=Dt,g[2]=vt,g[3]=_t,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Ct,_[1]=Dt,_[2]=vt,_[3]=_t,O.clearBufferiv(O.COLOR,0,_))}else G|=O.COLOR_BUFFER_BIT}U&&(G|=O.DEPTH_BUFFER_BIT),H&&(G|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",K,!1),e.removeEventListener("webglcontextrestored",ct,!1),e.removeEventListener("webglcontextcreationerror",at,!1),ut.dispose(),Vt.dispose(),Et.dispose(),S.dispose(),B.dispose(),q.dispose(),ee.dispose(),I.dispose(),yt.dispose(),X.dispose(),X.removeEventListener("sessionstart",Jh),X.removeEventListener("sessionend",Qh),mi.stop()};function K(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function ct(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const w=ie.autoReset,U=ft.enabled,H=ft.autoUpdate,G=ft.needsUpdate,N=ft.type;st(),ie.autoReset=w,ft.enabled=U,ft.autoUpdate=H,ft.needsUpdate=G,ft.type=N}function at(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Lt(w){const U=w.target;U.removeEventListener("dispose",Lt),le(U)}function le(w){Re(w),Et.remove(w)}function Re(w){const U=Et.get(w).programs;U!==void 0&&(U.forEach(function(H){yt.releaseProgram(H)}),w.isShaderMaterial&&yt.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,H,G,N,tt){U===null&&(U=ae);const lt=N.isMesh&&N.matrixWorld.determinant()<0,gt=x0(w,U,H,G,N);bt.setMaterial(G,lt);let _t=H.index,Ct=1;if(G.wireframe===!0){if(_t=J.getWireframeAttribute(H),_t===void 0)return;Ct=2}const Dt=H.drawRange,vt=H.attributes.position;let Wt=Dt.start*Ct,ne=(Dt.start+Dt.count)*Ct;tt!==null&&(Wt=Math.max(Wt,tt.start*Ct),ne=Math.min(ne,(tt.start+tt.count)*Ct)),_t!==null?(Wt=Math.max(Wt,0),ne=Math.min(ne,_t.count)):vt!=null&&(Wt=Math.max(Wt,0),ne=Math.min(ne,vt.count));const se=ne-Wt;if(se<0||se===1/0)return;ee.setup(N,G,gt,H,_t);let Oe,qt=pt;if(_t!==null&&(Oe=Z.get(_t),qt=kt,qt.setIndex(Oe)),N.isMesh)G.wireframe===!0?(bt.setLineWidth(G.wireframeLinewidth*ce()),qt.setMode(O.LINES)):qt.setMode(O.TRIANGLES);else if(N.isLine){let Mt=G.linewidth;Mt===void 0&&(Mt=1),bt.setLineWidth(Mt*ce()),N.isLineSegments?qt.setMode(O.LINES):N.isLineLoop?qt.setMode(O.LINE_LOOP):qt.setMode(O.LINE_STRIP)}else N.isPoints?qt.setMode(O.POINTS):N.isSprite&&qt.setMode(O.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)qt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(zt.get("WEBGL_multi_draw"))qt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Mt=N._multiDrawStarts,Un=N._multiDrawCounts,Yt=N._multiDrawCount,sn=_t?Z.get(_t).bytesPerElement:1,es=Et.get(G).currentProgram.getUniforms();for(let Ge=0;Ge<Yt;Ge++)es.setValue(O,"_gl_DrawID",Ge),qt.render(Mt[Ge]/sn,Un[Ge])}else if(N.isInstancedMesh)qt.renderInstances(Wt,se,N.count);else if(H.isInstancedBufferGeometry){const Mt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Un=Math.min(H.instanceCount,Mt);qt.renderInstances(Wt,se,Un)}else qt.render(Wt,se)};function Zt(w,U,H){w.transparent===!0&&w.side===Mn&&w.forceSinglePass===!1?(w.side=Pe,w.needsUpdate=!0,Ir(w,U,H),w.side=yn,w.needsUpdate=!0,Ir(w,U,H),w.side=Mn):Ir(w,U,H)}this.compile=function(w,U,H=null){H===null&&(H=w),f=Vt.get(H),f.init(U),y.push(f),H.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),w!==H&&w.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const G=new Set;return w.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const tt=N.material;if(tt)if(Array.isArray(tt))for(let lt=0;lt<tt.length;lt++){const gt=tt[lt];Zt(gt,H,N),G.add(gt)}else Zt(tt,H,N),G.add(tt)}),y.pop(),f=null,G},this.compileAsync=function(w,U,H=null){const G=this.compile(w,U,H);return new Promise(N=>{function tt(){if(G.forEach(function(lt){Et.get(lt).currentProgram.isReady()&&G.delete(lt)}),G.size===0){N(w);return}setTimeout(tt,10)}zt.get("KHR_parallel_shader_compile")!==null?tt():setTimeout(tt,10)})};let nn=null;function In(w){nn&&nn(w)}function Jh(){mi.stop()}function Qh(){mi.start()}const mi=new Oc;mi.setAnimationLoop(In),typeof self<"u"&&mi.setContext(self),this.setAnimationLoop=function(w){nn=w,X.setAnimationLoop(w),w===null?mi.stop():mi.start()},X.addEventListener("sessionstart",Jh),X.addEventListener("sessionend",Qh),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(U),U=X.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,U,C),f=Vt.get(w,y.length),f.init(U),y.push(f),Tt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Y.setFromProjectionMatrix(Tt),xt=this.localClippingEnabled,et=Q.init(this.clippingPlanes,xt),m=ut.get(w,v.length),m.init(),v.push(m),X.enabled===!0&&X.isPresenting===!0){const tt=x.xr.getDepthSensingMesh();tt!==null&&Qa(tt,U,-1/0,x.sortObjects)}Qa(w,U,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(it,dt),Gt=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,Gt&&wt.addToRenderList(m,w),this.info.render.frame++,et===!0&&Q.beginShadows();const H=f.state.shadowsArray;ft.render(H,w,U),et===!0&&Q.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,N=m.transmissive;if(f.setupLights(),U.isArrayCamera){const tt=U.cameras;if(N.length>0)for(let lt=0,gt=tt.length;lt<gt;lt++){const _t=tt[lt];ed(G,N,w,_t)}Gt&&wt.render(w);for(let lt=0,gt=tt.length;lt<gt;lt++){const _t=tt[lt];td(m,w,_t,_t.viewport)}}else N.length>0&&ed(G,N,w,U),Gt&&wt.render(w),td(m,w,U);C!==null&&(T.updateMultisampleRenderTarget(C),T.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(x,w,U),ee.resetDefaultState(),b=-1,M=null,y.pop(),y.length>0?(f=y[y.length-1],et===!0&&Q.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function Qa(w,U,H,G){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)H=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Y.intersectsSprite(w)){G&&Ot.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Tt);const lt=q.update(w),gt=w.material;gt.visible&&m.push(w,lt,gt,H,Ot.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Y.intersectsObject(w))){const lt=q.update(w),gt=w.material;if(G&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ot.copy(w.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),Ot.copy(lt.boundingSphere.center)),Ot.applyMatrix4(w.matrixWorld).applyMatrix4(Tt)),Array.isArray(gt)){const _t=lt.groups;for(let Ct=0,Dt=_t.length;Ct<Dt;Ct++){const vt=_t[Ct],Wt=gt[vt.materialIndex];Wt&&Wt.visible&&m.push(w,lt,Wt,H,Ot.z,vt)}}else gt.visible&&m.push(w,lt,gt,H,Ot.z,null)}}const tt=w.children;for(let lt=0,gt=tt.length;lt<gt;lt++)Qa(tt[lt],U,H,G)}function td(w,U,H,G){const N=w.opaque,tt=w.transmissive,lt=w.transparent;f.setupLightsView(H),et===!0&&Q.setGlobalState(x.clippingPlanes,H),G&&bt.viewport(P.copy(G)),N.length>0&&Dr(N,U,H),tt.length>0&&Dr(tt,U,H),lt.length>0&&Dr(lt,U,H),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function ed(w,U,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[G.id]===void 0&&(f.state.transmissionRenderTarget[G.id]=new si(1,1,{generateMipmaps:!0,type:zt.has("EXT_color_buffer_half_float")||zt.has("EXT_color_buffer_float")?hs:Sn,minFilter:ei,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ht.workingColorSpace}));const tt=f.state.transmissionRenderTarget[G.id],lt=G.viewport||P;tt.setSize(lt.z,lt.w);const gt=x.getRenderTarget();x.setRenderTarget(tt),x.getClearColor(F),V=x.getClearAlpha(),V<1&&x.setClearColor(16777215,.5),x.clear(),Gt&&wt.render(H);const _t=x.toneMapping;x.toneMapping=Fn;const Ct=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),f.setupLightsView(G),et===!0&&Q.setGlobalState(x.clippingPlanes,G),Dr(w,H,G),T.updateMultisampleRenderTarget(tt),T.updateRenderTargetMipmap(tt),zt.has("WEBGL_multisampled_render_to_texture")===!1){let Dt=!1;for(let vt=0,Wt=U.length;vt<Wt;vt++){const ne=U[vt],se=ne.object,Oe=ne.geometry,qt=ne.material,Mt=ne.group;if(qt.side===Mn&&se.layers.test(G.layers)){const Un=qt.side;qt.side=Pe,qt.needsUpdate=!0,nd(se,H,G,Oe,qt,Mt),qt.side=Un,qt.needsUpdate=!0,Dt=!0}}Dt===!0&&(T.updateMultisampleRenderTarget(tt),T.updateRenderTargetMipmap(tt))}x.setRenderTarget(gt),x.setClearColor(F,V),Ct!==void 0&&(G.viewport=Ct),x.toneMapping=_t}function Dr(w,U,H){const G=U.isScene===!0?U.overrideMaterial:null;for(let N=0,tt=w.length;N<tt;N++){const lt=w[N],gt=lt.object,_t=lt.geometry,Ct=G===null?lt.material:G,Dt=lt.group;gt.layers.test(H.layers)&&nd(gt,U,H,_t,Ct,Dt)}}function nd(w,U,H,G,N,tt){w.onBeforeRender(x,U,H,G,N,tt),w.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),N.onBeforeRender(x,U,H,G,w,tt),N.transparent===!0&&N.side===Mn&&N.forceSinglePass===!1?(N.side=Pe,N.needsUpdate=!0,x.renderBufferDirect(H,U,G,N,w,tt),N.side=yn,N.needsUpdate=!0,x.renderBufferDirect(H,U,G,N,w,tt),N.side=Mn):x.renderBufferDirect(H,U,G,N,w,tt),w.onAfterRender(x,U,H,G,N,tt)}function Ir(w,U,H){U.isScene!==!0&&(U=ae);const G=Et.get(w),N=f.state.lights,tt=f.state.shadowsArray,lt=N.state.version,gt=yt.getParameters(w,N.state,tt,U,H),_t=yt.getProgramCacheKey(gt);let Ct=G.programs;G.environment=w.isMeshStandardMaterial?U.environment:null,G.fog=U.fog,G.envMap=(w.isMeshStandardMaterial?B:S).get(w.envMap||G.environment),G.envMapRotation=G.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Ct===void 0&&(w.addEventListener("dispose",Lt),Ct=new Map,G.programs=Ct);let Dt=Ct.get(_t);if(Dt!==void 0){if(G.currentProgram===Dt&&G.lightsStateVersion===lt)return sd(w,gt),Dt}else gt.uniforms=yt.getUniforms(w),w.onBeforeCompile(gt,x),Dt=yt.acquireProgram(gt,_t),Ct.set(_t,Dt),G.uniforms=gt.uniforms;const vt=G.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(vt.clippingPlanes=Q.uniform),sd(w,gt),G.needsLights=M0(w),G.lightsStateVersion=lt,G.needsLights&&(vt.ambientLightColor.value=N.state.ambient,vt.lightProbe.value=N.state.probe,vt.directionalLights.value=N.state.directional,vt.directionalLightShadows.value=N.state.directionalShadow,vt.spotLights.value=N.state.spot,vt.spotLightShadows.value=N.state.spotShadow,vt.rectAreaLights.value=N.state.rectArea,vt.ltc_1.value=N.state.rectAreaLTC1,vt.ltc_2.value=N.state.rectAreaLTC2,vt.pointLights.value=N.state.point,vt.pointLightShadows.value=N.state.pointShadow,vt.hemisphereLights.value=N.state.hemi,vt.directionalShadowMap.value=N.state.directionalShadowMap,vt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,vt.spotShadowMap.value=N.state.spotShadowMap,vt.spotLightMatrix.value=N.state.spotLightMatrix,vt.spotLightMap.value=N.state.spotLightMap,vt.pointShadowMap.value=N.state.pointShadowMap,vt.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=Dt,G.uniformsList=null,Dt}function id(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=dr.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function sd(w,U){const H=Et.get(w);H.outputColorSpace=U.outputColorSpace,H.batching=U.batching,H.batchingColor=U.batchingColor,H.instancing=U.instancing,H.instancingColor=U.instancingColor,H.instancingMorph=U.instancingMorph,H.skinning=U.skinning,H.morphTargets=U.morphTargets,H.morphNormals=U.morphNormals,H.morphColors=U.morphColors,H.morphTargetsCount=U.morphTargetsCount,H.numClippingPlanes=U.numClippingPlanes,H.numIntersection=U.numClipIntersection,H.vertexAlphas=U.vertexAlphas,H.vertexTangents=U.vertexTangents,H.toneMapping=U.toneMapping}function x0(w,U,H,G,N){U.isScene!==!0&&(U=ae),T.resetTextureUnits();const tt=U.fog,lt=G.isMeshStandardMaterial?U.environment:null,gt=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Ti,_t=(G.isMeshStandardMaterial?B:S).get(G.envMap||lt),Ct=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Dt=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),vt=!!H.morphAttributes.position,Wt=!!H.morphAttributes.normal,ne=!!H.morphAttributes.color;let se=Fn;G.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(se=x.toneMapping);const Oe=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,qt=Oe!==void 0?Oe.length:0,Mt=Et.get(G),Un=f.state.lights;if(et===!0&&(xt===!0||w!==M)){const Ze=w===M&&G.id===b;Q.setState(G,w,Ze)}let Yt=!1;G.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==Un.state.version||Mt.outputColorSpace!==gt||N.isBatchedMesh&&Mt.batching===!1||!N.isBatchedMesh&&Mt.batching===!0||N.isBatchedMesh&&Mt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Mt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Mt.instancing===!1||!N.isInstancedMesh&&Mt.instancing===!0||N.isSkinnedMesh&&Mt.skinning===!1||!N.isSkinnedMesh&&Mt.skinning===!0||N.isInstancedMesh&&Mt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Mt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Mt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Mt.instancingMorph===!1&&N.morphTexture!==null||Mt.envMap!==_t||G.fog===!0&&Mt.fog!==tt||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==Q.numPlanes||Mt.numIntersection!==Q.numIntersection)||Mt.vertexAlphas!==Ct||Mt.vertexTangents!==Dt||Mt.morphTargets!==vt||Mt.morphNormals!==Wt||Mt.morphColors!==ne||Mt.toneMapping!==se||Mt.morphTargetsCount!==qt)&&(Yt=!0):(Yt=!0,Mt.__version=G.version);let sn=Mt.currentProgram;Yt===!0&&(sn=Ir(G,U,N));let es=!1,Ge=!1,Rs=!1;const re=sn.getUniforms(),_n=Mt.uniforms;if(bt.useProgram(sn.program)&&(es=!0,Ge=!0,Rs=!0),G.id!==b&&(b=G.id,Ge=!0),es||M!==w){bt.buffers.depth.getReversed()?(rt.copy(w.projectionMatrix),Vu(rt),Wu(rt),re.setValue(O,"projectionMatrix",rt)):re.setValue(O,"projectionMatrix",w.projectionMatrix),re.setValue(O,"viewMatrix",w.matrixWorldInverse);const qn=re.map.cameraPosition;qn!==void 0&&qn.setValue(O,Rt.setFromMatrixPosition(w.matrixWorld)),Bt.logarithmicDepthBuffer&&re.setValue(O,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&re.setValue(O,"isOrthographic",w.isOrthographicCamera===!0),M!==w&&(M=w,Ge=!0,Rs=!0)}if(N.isSkinnedMesh){re.setOptional(O,N,"bindMatrix"),re.setOptional(O,N,"bindMatrixInverse");const Ze=N.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),re.setValue(O,"boneTexture",Ze.boneTexture,T))}N.isBatchedMesh&&(re.setOptional(O,N,"batchingTexture"),re.setValue(O,"batchingTexture",N._matricesTexture,T),re.setOptional(O,N,"batchingIdTexture"),re.setValue(O,"batchingIdTexture",N._indirectTexture,T),re.setOptional(O,N,"batchingColorTexture"),N._colorsTexture!==null&&re.setValue(O,"batchingColorTexture",N._colorsTexture,T));const Ps=H.morphAttributes;if((Ps.position!==void 0||Ps.normal!==void 0||Ps.color!==void 0)&&At.update(N,H,sn),(Ge||Mt.receiveShadow!==N.receiveShadow)&&(Mt.receiveShadow=N.receiveShadow,re.setValue(O,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(_n.envMap.value=_t,_n.flipEnvMap.value=_t.isCubeTexture&&_t.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&U.environment!==null&&(_n.envMapIntensity.value=U.environmentIntensity),Ge&&(re.setValue(O,"toneMappingExposure",x.toneMappingExposure),Mt.needsLights&&y0(_n,Rs),tt&&G.fog===!0&&ot.refreshFogUniforms(_n,tt),ot.refreshMaterialUniforms(_n,G,W,j,f.state.transmissionRenderTarget[w.id]),dr.upload(O,id(Mt),_n,T)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(dr.upload(O,id(Mt),_n,T),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&re.setValue(O,"center",N.center),re.setValue(O,"modelViewMatrix",N.modelViewMatrix),re.setValue(O,"normalMatrix",N.normalMatrix),re.setValue(O,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Ze=G.uniformsGroups;for(let qn=0,Yn=Ze.length;qn<Yn;qn++){const rd=Ze[qn];I.update(rd,sn),I.bind(rd,sn)}}return sn}function y0(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function M0(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,U,H){Et.get(w.texture).__webglTexture=U,Et.get(w.depthTexture).__webglTexture=H;const G=Et.get(w);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=H===void 0,G.__autoAllocateDepthBuffer||zt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,U){const H=Et.get(w);H.__webglFramebuffer=U,H.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,H=0){C=w,E=U,A=H;let G=!0,N=null,tt=!1,lt=!1;if(w){const _t=Et.get(w);if(_t.__useDefaultFramebuffer!==void 0)bt.bindFramebuffer(O.FRAMEBUFFER,null),G=!1;else if(_t.__webglFramebuffer===void 0)T.setupRenderTarget(w);else if(_t.__hasExternalTextures)T.rebindTextures(w,Et.get(w.texture).__webglTexture,Et.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const vt=w.depthTexture;if(_t.__boundDepthTexture!==vt){if(vt!==null&&Et.has(vt)&&(w.width!==vt.image.width||w.height!==vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(w)}}const Ct=w.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(lt=!0);const Dt=Et.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Dt[U])?N=Dt[U][H]:N=Dt[U],tt=!0):w.samples>0&&T.useMultisampledRTT(w)===!1?N=Et.get(w).__webglMultisampledFramebuffer:Array.isArray(Dt)?N=Dt[H]:N=Dt,P.copy(w.viewport),z.copy(w.scissor),R=w.scissorTest}else P.copy(St).multiplyScalar(W).floor(),z.copy(Nt).multiplyScalar(W).floor(),R=te;if(bt.bindFramebuffer(O.FRAMEBUFFER,N)&&G&&bt.drawBuffers(w,N),bt.viewport(P),bt.scissor(z),bt.setScissorTest(R),tt){const _t=Et.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,_t.__webglTexture,H)}else if(lt){const _t=Et.get(w.texture),Ct=U||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,_t.__webglTexture,H||0,Ct)}b=-1},this.readRenderTargetPixels=function(w,U,H,G,N,tt,lt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=Et.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&lt!==void 0&&(gt=gt[lt]),gt){bt.bindFramebuffer(O.FRAMEBUFFER,gt);try{const _t=w.texture,Ct=_t.format,Dt=_t.type;if(!Bt.textureFormatReadable(Ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Bt.textureTypeReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-G&&H>=0&&H<=w.height-N&&O.readPixels(U,H,G,N,Ut.convert(Ct),Ut.convert(Dt),tt)}finally{const _t=C!==null?Et.get(C).__webglFramebuffer:null;bt.bindFramebuffer(O.FRAMEBUFFER,_t)}}},this.readRenderTargetPixelsAsync=async function(w,U,H,G,N,tt,lt){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let gt=Et.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&lt!==void 0&&(gt=gt[lt]),gt){const _t=w.texture,Ct=_t.format,Dt=_t.type;if(!Bt.textureFormatReadable(Ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Bt.textureTypeReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=w.width-G&&H>=0&&H<=w.height-N){bt.bindFramebuffer(O.FRAMEBUFFER,gt);const vt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,vt),O.bufferData(O.PIXEL_PACK_BUFFER,tt.byteLength,O.STREAM_READ),O.readPixels(U,H,G,N,Ut.convert(Ct),Ut.convert(Dt),0);const Wt=C!==null?Et.get(C).__webglFramebuffer:null;bt.bindFramebuffer(O.FRAMEBUFFER,Wt);const ne=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Gu(O,ne,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,vt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,tt),O.deleteBuffer(vt),O.deleteSync(ne),tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,U=null,H=0){w.isTexture!==!0&&(ps("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,w=arguments[1]);const G=Math.pow(2,-H),N=Math.floor(w.image.width*G),tt=Math.floor(w.image.height*G),lt=U!==null?U.x:0,gt=U!==null?U.y:0;T.setTexture2D(w,0),O.copyTexSubImage2D(O.TEXTURE_2D,H,0,0,lt,gt,N,tt),bt.unbindTexture()},this.copyTextureToTexture=function(w,U,H=null,G=null,N=0){w.isTexture!==!0&&(ps("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,w=arguments[1],U=arguments[2],N=arguments[3]||0,H=null);let tt,lt,gt,_t,Ct,Dt,vt,Wt,ne;const se=w.isCompressedTexture?w.mipmaps[N]:w.image;H!==null?(tt=H.max.x-H.min.x,lt=H.max.y-H.min.y,gt=H.isBox3?H.max.z-H.min.z:1,_t=H.min.x,Ct=H.min.y,Dt=H.isBox3?H.min.z:0):(tt=se.width,lt=se.height,gt=se.depth||1,_t=0,Ct=0,Dt=0),G!==null?(vt=G.x,Wt=G.y,ne=G.z):(vt=0,Wt=0,ne=0);const Oe=Ut.convert(U.format),qt=Ut.convert(U.type);let Mt;U.isData3DTexture?(T.setTexture3D(U,0),Mt=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(T.setTexture2DArray(U,0),Mt=O.TEXTURE_2D_ARRAY):(T.setTexture2D(U,0),Mt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const Un=O.getParameter(O.UNPACK_ROW_LENGTH),Yt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),sn=O.getParameter(O.UNPACK_SKIP_PIXELS),es=O.getParameter(O.UNPACK_SKIP_ROWS),Ge=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,se.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,se.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,_t),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ct),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Dt);const Rs=w.isDataArrayTexture||w.isData3DTexture,re=U.isDataArrayTexture||U.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const _n=Et.get(w),Ps=Et.get(U),Ze=Et.get(_n.__renderTarget),qn=Et.get(Ps.__renderTarget);bt.bindFramebuffer(O.READ_FRAMEBUFFER,Ze.__webglFramebuffer),bt.bindFramebuffer(O.DRAW_FRAMEBUFFER,qn.__webglFramebuffer);for(let Yn=0;Yn<gt;Yn++)Rs&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Et.get(w).__webglTexture,N,Dt+Yn),w.isDepthTexture?(re&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Et.get(U).__webglTexture,N,ne+Yn),O.blitFramebuffer(_t,Ct,tt,lt,vt,Wt,tt,lt,O.DEPTH_BUFFER_BIT,O.NEAREST)):re?O.copyTexSubImage3D(Mt,N,vt,Wt,ne+Yn,_t,Ct,tt,lt):O.copyTexSubImage2D(Mt,N,vt,Wt,ne+Yn,_t,Ct,tt,lt);bt.bindFramebuffer(O.READ_FRAMEBUFFER,null),bt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else re?w.isDataTexture||w.isData3DTexture?O.texSubImage3D(Mt,N,vt,Wt,ne,tt,lt,gt,Oe,qt,se.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(Mt,N,vt,Wt,ne,tt,lt,gt,Oe,se.data):O.texSubImage3D(Mt,N,vt,Wt,ne,tt,lt,gt,Oe,qt,se):w.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,N,vt,Wt,tt,lt,Oe,qt,se.data):w.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,N,vt,Wt,se.width,se.height,Oe,se.data):O.texSubImage2D(O.TEXTURE_2D,N,vt,Wt,tt,lt,Oe,qt,se);O.pixelStorei(O.UNPACK_ROW_LENGTH,Un),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Yt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,sn),O.pixelStorei(O.UNPACK_SKIP_ROWS,es),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Ge),N===0&&U.generateMipmaps&&O.generateMipmap(Mt),bt.unbindTexture()},this.copyTextureToTexture3D=function(w,U,H=null,G=null,N=0){return w.isTexture!==!0&&(ps("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,G=arguments[1]||null,w=arguments[2],U=arguments[3],N=arguments[4]||0),ps('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,U,H,G,N)},this.initRenderTarget=function(w){Et.get(w).__webglFramebuffer===void 0&&T.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?T.setTextureCube(w,0):w.isData3DTexture?T.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?T.setTexture2DArray(w,0):T.setTexture2D(w,0),bt.unbindTexture()},this.resetState=function(){E=0,A=0,C=null,bt.reset(),ee.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Ht._getDrawingBufferColorSpace(t),e.unpackColorSpace=Ht._getUnpackColorSpace()}}class y_ extends ge{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new un,this.environmentIntensity=1,this.environmentRotation=new un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class fh{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=jo,this.updateRanges=[],this.version=0,this.uuid=bn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const De=new D;class fn{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)De.fromBufferAttribute(this,e),De.applyMatrix4(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.applyNormalMatrix(t),this.setXYZ(e,De.x,De.y,De.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.transformDirection(t),this.setXYZ(e,De.x,De.y,De.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Je(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=jt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=jt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Je(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Je(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Je(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Je(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),s=jt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),s=jt(s,this.array),r=jt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ie(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new fn(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ph extends ai{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Ft(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let qi;const Ss=new D,Yi=new D,ji=new D,Zi=new ht,Es=new ht,mh=new $t,pr=new D,bs=new D,mr=new D,gh=new ht,Pa=new ht,_h=new ht;class M_ extends ge{constructor(t=new ph){if(super(),this.isSprite=!0,this.type="Sprite",qi===void 0){qi=new Se;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new fh(e,5);qi.setIndex([0,1,2,0,2,3]),qi.setAttribute("position",new fn(n,3,0,!1)),qi.setAttribute("uv",new fn(n,2,3,!1))}this.geometry=qi,this.material=t,this.center=new ht(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Yi.setFromMatrixScale(this.matrixWorld),mh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ji.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Yi.multiplyScalar(-ji.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;gr(pr.set(-.5,-.5,0),ji,o,Yi,s,r),gr(bs.set(.5,-.5,0),ji,o,Yi,s,r),gr(mr.set(.5,.5,0),ji,o,Yi,s,r),gh.set(0,0),Pa.set(1,0),_h.set(1,1);let a=t.ray.intersectTriangle(pr,bs,mr,!1,Ss);if(a===null&&(gr(bs.set(-.5,.5,0),ji,o,Yi,s,r),Pa.set(0,1),a=t.ray.intersectTriangle(pr,mr,bs,!1,Ss),a===null))return;const l=t.ray.origin.distanceTo(Ss);l<t.near||l>t.far||e.push({distance:l,point:Ss.clone(),uv:Xe.getInterpolation(Ss,pr,bs,mr,gh,Pa,_h,new ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function gr(i,t,e,n,s,r){Zi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Es.x=r*Zi.x-s*Zi.y,Es.y=s*Zi.x+r*Zi.y):Es.copy(Zi),i.copy(t),i.x+=Es.x,i.y+=Es.y,i.applyMatrix4(mh)}class S_ extends Ae{constructor(t=null,e=1,n=1,s,r,o,a,l,c=ze,h=ze,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class vh extends Ie{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ki=new $t,xh=new $t,_r=[],yh=new dn,E_=new $t,ws=new qe,Ts=new Hn;class La extends qe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new vh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,E_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new dn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ki),yh.copy(t.boundingBox).applyMatrix4(Ki),this.boundingBox.union(yh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Hn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ki),Ts.copy(t.boundingSphere).applyMatrix4(Ki),this.boundingSphere.union(Ts)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ws.geometry=this.geometry,ws.material=this.material,ws.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ts.copy(this.boundingSphere),Ts.applyMatrix4(n),t.ray.intersectsSphere(Ts)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ki),xh.multiplyMatrices(n,Ki),ws.matrixWorld=xh,ws.raycast(t,_r);for(let o=0,a=_r.length;o<a;o++){const l=_r[o];l.instanceId=r,l.object=this,e.push(l)}_r.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new vh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new S_(new Float32Array(s*this.count),s,this.count,xo,cn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Da extends ai{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Ft(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const vr=new D,xr=new D,Mh=new $t,As=new js,yr=new Hn,Ia=new D,Sh=new D;class Eh extends ge{constructor(t=new Se,e=new Da){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)vr.fromBufferAttribute(e,s-1),xr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=vr.distanceTo(xr);t.setAttribute("lineDistance",new oe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),yr.copy(n.boundingSphere),yr.applyMatrix4(s),yr.radius+=r,t.ray.intersectsSphere(yr)===!1)return;Mh.copy(s).invert(),As.copy(t.ray).applyMatrix4(Mh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const f=h.getX(_),v=h.getX(_+1),y=Mr(this,t,As,l,f,v);y&&e.push(y)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(p),f=Mr(this,t,As,l,_,m);f&&e.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const f=Mr(this,t,As,l,_,_+1);f&&e.push(f)}if(this.isLineLoop){const _=Mr(this,t,As,l,g-1,p);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Mr(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(vr.fromBufferAttribute(o,s),xr.fromBufferAttribute(o,r),e.distanceSqToSegment(vr,xr,Ia,Sh)>n)return;Ia.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Ia);if(!(l<t.near||l>t.far))return{distance:l,point:Sh.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}class b_ extends Ae{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ji extends Se{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new D,h=new ht;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const p=n+d/e*s;c.x=t*Math.cos(p),c.y=t*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(a,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ji(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Cs extends Se{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],p=[];let g=0;const _=[],m=n/2;let f=0;v(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new oe(d,3)),this.setAttribute("normal",new oe(u,3)),this.setAttribute("uv",new oe(p,2));function v(){const x=new D,L=new D;let E=0;const A=(e-t)/n;for(let C=0;C<=r;C++){const b=[],M=C/r,P=M*(e-t)+t;for(let z=0;z<=s;z++){const R=z/s,F=R*l+a,V=Math.sin(F),k=Math.cos(F);L.x=P*V,L.y=-M*n+m,L.z=P*k,d.push(L.x,L.y,L.z),x.set(V,A,k).normalize(),u.push(x.x,x.y,x.z),p.push(R,1-M),b.push(g++)}_.push(b)}for(let C=0;C<s;C++)for(let b=0;b<r;b++){const M=_[b][C],P=_[b+1][C],z=_[b+1][C+1],R=_[b][C+1];(t>0||b!==0)&&(h.push(M,P,R),E+=3),(e>0||b!==r-1)&&(h.push(P,z,R),E+=3)}c.addGroup(f,E,0),f+=E}function y(x){const L=g,E=new ht,A=new D;let C=0;const b=x===!0?t:e,M=x===!0?1:-1;for(let z=1;z<=s;z++)d.push(0,m*M,0),u.push(0,M,0),p.push(.5,.5),g++;const P=g;for(let z=0;z<=s;z++){const F=z/s*l+a,V=Math.cos(F),k=Math.sin(F);A.x=b*k,A.y=m*M,A.z=b*V,d.push(A.x,A.y,A.z),u.push(0,M,0),E.x=V*.5+.5,E.y=k*.5*M+.5,p.push(E.x,E.y),g++}for(let z=0;z<s;z++){const R=L+z,F=P+z;x===!0?h.push(F,F+1,R):h.push(F+1,F,R),C+=3}c.addGroup(f,C,x===!0?1:2),f+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ua extends Cs{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ua(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Na extends Se{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new oe(r,3)),this.setAttribute("normal",new oe(r.slice(),3)),this.setAttribute("uv",new oe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const y=new D,x=new D,L=new D;for(let E=0;E<e.length;E+=3)p(e[E+0],y),p(e[E+1],x),p(e[E+2],L),l(y,x,L,v)}function l(v,y,x,L){const E=L+1,A=[];for(let C=0;C<=E;C++){A[C]=[];const b=v.clone().lerp(x,C/E),M=y.clone().lerp(x,C/E),P=E-C;for(let z=0;z<=P;z++)z===0&&C===E?A[C][z]=b:A[C][z]=b.clone().lerp(M,z/P)}for(let C=0;C<E;C++)for(let b=0;b<2*(E-C)-1;b++){const M=Math.floor(b/2);b%2===0?(u(A[C][M+1]),u(A[C+1][M]),u(A[C][M])):(u(A[C][M+1]),u(A[C+1][M+1]),u(A[C+1][M]))}}function c(v){const y=new D;for(let x=0;x<r.length;x+=3)y.x=r[x+0],y.y=r[x+1],y.z=r[x+2],y.normalize().multiplyScalar(v),r[x+0]=y.x,r[x+1]=y.y,r[x+2]=y.z}function h(){const v=new D;for(let y=0;y<r.length;y+=3){v.x=r[y+0],v.y=r[y+1],v.z=r[y+2];const x=m(v)/2/Math.PI+.5,L=f(v)/Math.PI+.5;o.push(x,1-L)}g(),d()}function d(){for(let v=0;v<o.length;v+=6){const y=o[v+0],x=o[v+2],L=o[v+4],E=Math.max(y,x,L),A=Math.min(y,x,L);E>.9&&A<.1&&(y<.2&&(o[v+0]+=1),x<.2&&(o[v+2]+=1),L<.2&&(o[v+4]+=1))}}function u(v){r.push(v.x,v.y,v.z)}function p(v,y){const x=v*3;y.x=t[x+0],y.y=t[x+1],y.z=t[x+2]}function g(){const v=new D,y=new D,x=new D,L=new D,E=new ht,A=new ht,C=new ht;for(let b=0,M=0;b<r.length;b+=9,M+=6){v.set(r[b+0],r[b+1],r[b+2]),y.set(r[b+3],r[b+4],r[b+5]),x.set(r[b+6],r[b+7],r[b+8]),E.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),C.set(o[M+4],o[M+5]),L.copy(v).add(y).add(x).divideScalar(3);const P=m(L);_(E,M+0,v,P),_(A,M+2,y,P),_(C,M+4,x,P)}}function _(v,y,x,L){L<0&&v.x===1&&(o[y]=v.x-1),x.x===0&&x.z===0&&(o[y]=L/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function f(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Na(t.vertices,t.indices,t.radius,t.details)}}class Oa extends Na{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Oa(t.radius,t.detail)}}class Fa extends Se{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new D,u=new D,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const v=[],y=f/n;let x=0;f===0&&o===0?x=.5/e:f===n&&l===Math.PI&&(x=-.5/e);for(let L=0;L<=e;L++){const E=L/e;d.x=-t*Math.cos(s+E*r)*Math.sin(o+y*a),d.y=t*Math.cos(o+y*a),d.z=t*Math.sin(s+E*r)*Math.sin(o+y*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(E+x,1-y),v.push(c++)}h.push(v)}for(let f=0;f<n;f++)for(let v=0;v<e;v++){const y=h[f][v+1],x=h[f][v],L=h[f+1][v],E=h[f+1][v+1];(f!==0||o>0)&&p.push(y,x,E),(f!==n-1||l<Math.PI)&&p.push(x,L,E)}this.setIndex(p),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(_,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fa(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class w_ extends Se{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new D,r=new D;if(t.index!==null){const o=t.attributes.position,a=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,p=d.count;for(let g=u,_=u+p;g<_;g+=3)for(let m=0;m<3;m++){const f=a.getX(g+m),v=a.getX(g+(m+1)%3);s.fromBufferAttribute(o,f),r.fromBufferAttribute(o,v),bh(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,d),bh(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new oe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function bh(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class T_ extends ai{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ft(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ec,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.combine=co,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class wh extends ge{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ft(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const za=new $t,Th=new D,Ah=new D;class A_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new $t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xa,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new Qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Th.setFromMatrixPosition(t.matrixWorld),e.position.copy(Th),Ah.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ah),e.updateMatrixWorld(),za.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(za),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(za)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class C_ extends A_{constructor(){super(new ya(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class R_ extends wh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.shadow=new C_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class P_ extends wh{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class L_ extends Se{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Ba extends fh{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}const Ch=new $t;class D_{constructor(t,e,n=0,s=1/0){this.ray=new js(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ra,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Ch.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ch),this}intersectObject(t,e=!0,n=[]){return ka(t,this,n,e),n.sort(Rh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ka(t[s],this,n,e);return n.sort(Rh),n}}function Rh(i,t){return i.distance-t.distance}function ka(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)ka(r[o],t,e,!0)}}class Ph{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Me(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Lh=new D,Sr=new D;class I_{constructor(t=new D,e=new D){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Lh.subVectors(t,this.start),Sr.subVectors(this.end,this.start);const n=Sr.dot(Sr);let r=Sr.dot(Lh)/n;return e&&(r=Me(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class Dh extends ii{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Qr}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Qr);const Ih={type:"change"},Ha={type:"start"},Uh={type:"end"},Er=new js,Nh=new Dn,U_=Math.cos(70*Ci.DEG2RAD),pe=new D,Ne=2*Math.PI,Jt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ga=1e-6;class N_ extends Dh{constructor(t,e=null){super(t,e),this.state=Jt.NONE,this.enabled=!0,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:me.ROTATE,MIDDLE:me.DOLLY,RIGHT:me.PAN},this.touches={ONE:an.ROTATE,TWO:an.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new hn,this._lastTargetPosition=new D,this._quat=new hn().setFromUnitVectors(t.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ph,this._sphericalDelta=new Ph,this._scale=1,this._panOffset=new D,this._rotateStart=new ht,this._rotateEnd=new ht,this._rotateDelta=new ht,this._panStart=new ht,this._panEnd=new ht,this._panDelta=new ht,this._dollyStart=new ht,this._dollyEnd=new ht,this._dollyDelta=new ht,this._dollyDirection=new D,this._mouse=new ht,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=F_.bind(this),this._onPointerDown=O_.bind(this),this._onPointerUp=z_.bind(this),this._onContextMenu=X_.bind(this),this._onMouseWheel=H_.bind(this),this._onKeyDown=G_.bind(this),this._onTouchStart=V_.bind(this),this._onTouchMove=W_.bind(this),this._onMouseDown=B_.bind(this),this._onMouseMove=k_.bind(this),this._interceptControlDown=$_.bind(this),this._interceptControlUp=q_.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ih),this.update(),this.state=Jt.NONE}update(t=null){const e=this.object.position;pe.copy(e).sub(this.target),pe.applyQuaternion(this._quat),this._spherical.setFromVector3(pe),this.autoRotate&&this.state===Jt.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Ne:n>Math.PI&&(n-=Ne),s<-Math.PI?s+=Ne:s>Math.PI&&(s-=Ne),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(pe.setFromSpherical(this._spherical),pe.applyQuaternion(this._quatInverse),e.copy(this.target).add(pe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=pe.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=pe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Er.origin.copy(this.object.position),Er.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Er.direction))<U_?this.object.lookAt(this.target):(Nh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Er.intersectPlane(Nh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Ga||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ga||this._lastTargetPosition.distanceToSquared(this.target)>Ga?(this.dispatchEvent(Ih),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Ne/60*this.autoRotateSpeed*t:Ne/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){pe.setFromMatrixColumn(e,0),pe.multiplyScalar(-t),this._panOffset.add(pe)}_panUp(t,e){this.screenSpacePanning===!0?pe.setFromMatrixColumn(e,1):(pe.setFromMatrixColumn(e,0),pe.crossVectors(this.object.up,pe)),pe.multiplyScalar(t),this._panOffset.add(pe)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;pe.copy(s).sub(this.target);let r=pe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ne*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ne*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(Ne*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-Ne*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(Ne*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-Ne*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ne*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ne*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ht,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function O_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function F_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function z_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Uh),this.state=Jt.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function B_(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case me.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Jt.DOLLY;break;case me.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Jt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Jt.ROTATE}break;case me.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Jt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Jt.PAN}break;default:this.state=Jt.NONE}this.state!==Jt.NONE&&this.dispatchEvent(Ha)}function k_(i){switch(this.state){case Jt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Jt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Jt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function H_(i){this.enabled===!1||this.enableZoom===!1||this.state!==Jt.NONE||(i.preventDefault(),this.dispatchEvent(Ha),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Uh))}function G_(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function V_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case an.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Jt.TOUCH_ROTATE;break;case an.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Jt.TOUCH_PAN;break;default:this.state=Jt.NONE}break;case 2:switch(this.touches.TWO){case an.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Jt.TOUCH_DOLLY_PAN;break;case an.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Jt.TOUCH_DOLLY_ROTATE;break;default:this.state=Jt.NONE}break;default:this.state=Jt.NONE}this.state!==Jt.NONE&&this.dispatchEvent(Ha)}function W_(i){switch(this._trackPointer(i),this.state){case Jt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Jt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Jt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Jt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Jt.NONE}}function X_(i){this.enabled!==!1&&i.preventDefault()}function $_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function q_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Va={type:"change"},Wa={type:"start"},Xa={type:"end"},Oh=1e-6,Xt={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4},br=new ht,$n=new ht,Y_=new D,wr=new D,$a=new D,Qi=new hn,Fh=new D,Tr=new D,qa=new D,Ar=new D;class j_ extends Dh{constructor(t,e=null){super(t,e),this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:me.ROTATE,MIDDLE:me.DOLLY,RIGHT:me.PAN},this.state=Xt.NONE,this.keyState=Xt.NONE,this.target=new D,this._lastPosition=new D,this._lastZoom=1,this._touchZoomDistanceStart=0,this._touchZoomDistanceEnd=0,this._lastAngle=0,this._eye=new D,this._movePrev=new ht,this._moveCurr=new ht,this._lastAxis=new D,this._zoomStart=new ht,this._zoomEnd=new ht,this._panStart=new ht,this._panEnd=new ht,this._pointers=[],this._pointerPositions={},this._onPointerMove=K_.bind(this),this._onPointerDown=Z_.bind(this),this._onPointerUp=J_.bind(this),this._onPointerCancel=Q_.bind(this),this._onContextMenu=o0.bind(this),this._onMouseWheel=r0.bind(this),this._onKeyDown=e0.bind(this),this._onKeyUp=t0.bind(this),this._onTouchStart=a0.bind(this),this._onTouchMove=l0.bind(this),this._onTouchEnd=c0.bind(this),this._onMouseDown=n0.bind(this),this._onMouseMove=i0.bind(this),this._onMouseUp=s0.bind(this),this._target0=this.target.clone(),this._position0=this.object.position.clone(),this._up0=this.object.up.clone(),this._zoom0=this.object.zoom,e!==null&&(this.connect(),this.handleResize()),this.update()}connect(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="none"}disconnect(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}handleResize(){const t=this.domElement.getBoundingClientRect(),e=this.domElement.ownerDocument.documentElement;this.screen.left=t.left+window.pageXOffset-e.clientLeft,this.screen.top=t.top+window.pageYOffset-e.clientTop,this.screen.width=t.width,this.screen.height=t.height}update(){this._eye.subVectors(this.object.position,this.target),this.noRotate||this._rotateCamera(),this.noZoom||this._zoomCamera(),this.noPan||this._panCamera(),this.object.position.addVectors(this.target,this._eye),this.object.isPerspectiveCamera?(this._checkDistances(),this.object.lookAt(this.target),this._lastPosition.distanceToSquared(this.object.position)>Oh&&(this.dispatchEvent(Va),this._lastPosition.copy(this.object.position))):this.object.isOrthographicCamera?(this.object.lookAt(this.target),(this._lastPosition.distanceToSquared(this.object.position)>Oh||this._lastZoom!==this.object.zoom)&&(this.dispatchEvent(Va),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type.")}reset(){this.state=Xt.NONE,this.keyState=Xt.NONE,this.target.copy(this._target0),this.object.position.copy(this._position0),this.object.up.copy(this._up0),this.object.zoom=this._zoom0,this.object.updateProjectionMatrix(),this._eye.subVectors(this.object.position,this.target),this.object.lookAt(this.target),this.dispatchEvent(Va),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom}_panCamera(){if($n.copy(this._panEnd).sub(this._panStart),$n.lengthSq()){if(this.object.isOrthographicCamera){const t=(this.object.right-this.object.left)/this.object.zoom/this.domElement.clientWidth,e=(this.object.top-this.object.bottom)/this.object.zoom/this.domElement.clientWidth;$n.x*=t,$n.y*=e}$n.multiplyScalar(this._eye.length()*this.panSpeed),wr.copy(this._eye).cross(this.object.up).setLength($n.x),wr.add(Y_.copy(this.object.up).setLength($n.y)),this.object.position.add(wr),this.target.add(wr),this.staticMoving?this._panStart.copy(this._panEnd):this._panStart.add($n.subVectors(this._panEnd,this._panStart).multiplyScalar(this.dynamicDampingFactor))}}_rotateCamera(){Ar.set(this._moveCurr.x-this._movePrev.x,this._moveCurr.y-this._movePrev.y,0);let t=Ar.length();t?(this._eye.copy(this.object.position).sub(this.target),Fh.copy(this._eye).normalize(),Tr.copy(this.object.up).normalize(),qa.crossVectors(Tr,Fh).normalize(),Tr.setLength(this._moveCurr.y-this._movePrev.y),qa.setLength(this._moveCurr.x-this._movePrev.x),Ar.copy(Tr.add(qa)),$a.crossVectors(Ar,this._eye).normalize(),t*=this.rotateSpeed,Qi.setFromAxisAngle($a,t),this._eye.applyQuaternion(Qi),this.object.up.applyQuaternion(Qi),this._lastAxis.copy($a),this._lastAngle=t):!this.staticMoving&&this._lastAngle&&(this._lastAngle*=Math.sqrt(1-this.dynamicDampingFactor),this._eye.copy(this.object.position).sub(this.target),Qi.setFromAxisAngle(this._lastAxis,this._lastAngle),this._eye.applyQuaternion(Qi),this.object.up.applyQuaternion(Qi)),this._movePrev.copy(this._moveCurr)}_zoomCamera(){let t;this.state===Xt.TOUCH_ZOOM_PAN?(t=this._touchZoomDistanceStart/this._touchZoomDistanceEnd,this._touchZoomDistanceStart=this._touchZoomDistanceEnd,this.object.isPerspectiveCamera?this._eye.multiplyScalar(t):this.object.isOrthographicCamera?(this.object.zoom=Ci.clamp(this.object.zoom/t,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(t=1+(this._zoomEnd.y-this._zoomStart.y)*this.zoomSpeed,t!==1&&t>0&&(this.object.isPerspectiveCamera?this._eye.multiplyScalar(t):this.object.isOrthographicCamera?(this.object.zoom=Ci.clamp(this.object.zoom/t,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),this.staticMoving?this._zoomStart.copy(this._zoomEnd):this._zoomStart.y+=(this._zoomEnd.y-this._zoomStart.y)*this.dynamicDampingFactor)}_getMouseOnScreen(t,e){return br.set((t-this.screen.left)/this.screen.width,(e-this.screen.top)/this.screen.height),br}_getMouseOnCircle(t,e){return br.set((t-this.screen.width*.5-this.screen.left)/(this.screen.width*.5),(this.screen.height+2*(this.screen.top-e))/this.screen.width),br}_addPointer(t){this._pointers.push(t)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e].pointerId==t.pointerId){this._pointers.splice(e,1);return}}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ht,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0].pointerId?this._pointers[1]:this._pointers[0];return this._pointerPositions[e.pointerId]}_checkDistances(){(!this.noZoom||!this.noPan)&&(this._eye.lengthSq()>this.maxDistance*this.maxDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.maxDistance)),this._zoomStart.copy(this._zoomEnd)),this._eye.lengthSq()<this.minDistance*this.minDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.minDistance)),this._zoomStart.copy(this._zoomEnd)))}}function Z_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i))}function K_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function J_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchEnd(i):this._onMouseUp(),this._removePointer(i),this._pointers.length===0&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp)))}function Q_(i){this._removePointer(i)}function t0(){this.enabled!==!1&&(this.keyState=Xt.NONE,window.addEventListener("keydown",this._onKeyDown))}function e0(i){this.enabled!==!1&&(window.removeEventListener("keydown",this._onKeyDown),this.keyState===Xt.NONE&&(i.code===this.keys[Xt.ROTATE]&&!this.noRotate?this.keyState=Xt.ROTATE:i.code===this.keys[Xt.ZOOM]&&!this.noZoom?this.keyState=Xt.ZOOM:i.code===this.keys[Xt.PAN]&&!this.noPan&&(this.keyState=Xt.PAN)))}function n0(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case me.DOLLY:this.state=Xt.ZOOM;break;case me.ROTATE:this.state=Xt.ROTATE;break;case me.PAN:this.state=Xt.PAN;break;default:this.state=Xt.NONE}const e=this.keyState!==Xt.NONE?this.keyState:this.state;e===Xt.ROTATE&&!this.noRotate?(this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr)):e===Xt.ZOOM&&!this.noZoom?(this._zoomStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._zoomEnd.copy(this._zoomStart)):e===Xt.PAN&&!this.noPan&&(this._panStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._panEnd.copy(this._panStart)),this.dispatchEvent(Wa)}function i0(i){const t=this.keyState!==Xt.NONE?this.keyState:this.state;t===Xt.ROTATE&&!this.noRotate?(this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY))):t===Xt.ZOOM&&!this.noZoom?this._zoomEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY)):t===Xt.PAN&&!this.noPan&&this._panEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY))}function s0(){this.state=Xt.NONE,this.dispatchEvent(Xa)}function r0(i){if(this.enabled!==!1&&this.noZoom!==!0){switch(i.preventDefault(),i.deltaMode){case 2:this._zoomStart.y-=i.deltaY*.025;break;case 1:this._zoomStart.y-=i.deltaY*.01;break;default:this._zoomStart.y-=i.deltaY*25e-5;break}this.dispatchEvent(Wa),this.dispatchEvent(Xa)}}function o0(i){this.enabled!==!1&&i.preventDefault()}function a0(i){switch(this._trackPointer(i),this._pointers.length){case 1:this.state=Xt.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(this._pointers[0].pageX,this._pointers[0].pageY)),this._movePrev.copy(this._moveCurr);break;default:this.state=Xt.TOUCH_ZOOM_PAN;const t=this._pointers[0].pageX-this._pointers[1].pageX,e=this._pointers[0].pageY-this._pointers[1].pageY;this._touchZoomDistanceEnd=this._touchZoomDistanceStart=Math.sqrt(t*t+e*e);const n=(this._pointers[0].pageX+this._pointers[1].pageX)/2,s=(this._pointers[0].pageY+this._pointers[1].pageY)/2;this._panStart.copy(this._getMouseOnScreen(n,s)),this._panEnd.copy(this._panStart);break}this.dispatchEvent(Wa)}function l0(i){switch(this._trackPointer(i),this._pointers.length){case 1:this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY));break;default:const t=this._getSecondPointerPosition(i),e=i.pageX-t.x,n=i.pageY-t.y;this._touchZoomDistanceEnd=Math.sqrt(e*e+n*n);const s=(i.pageX+t.x)/2,r=(i.pageY+t.y)/2;this._panEnd.copy(this._getMouseOnScreen(s,r));break}}function c0(i){switch(this._pointers.length){case 0:this.state=Xt.NONE;break;case 1:this.state=Xt.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr);break;case 2:this.state=Xt.TOUCH_ZOOM_PAN;for(let t=0;t<this._pointers.length;t++)if(this._pointers[t].pointerId!==i.pointerId){const e=this._pointerPositions[this._pointers[t].pointerId];this._moveCurr.copy(this._getMouseOnCircle(e.x,e.y)),this._movePrev.copy(this._moveCurr);break}break}this.dispatchEvent(Xa)}nt.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ht(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},Ue.line={uniforms:_a.merge([nt.common,nt.fog,nt.line]),vertexShader:`
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
		`};class zh extends Ln{static get type(){return"LineMaterial"}constructor(t){super({uniforms:_a.clone(Ue.line.uniforms),vertexShader:Ue.line.vertexShader,fragmentShader:Ue.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Bh=new dn,Cr=new D;class Ya extends L_{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new oe(t,3)),this.setAttribute("uv",new oe(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new Ba(e,6,1);return this.setAttribute("instanceStart",new fn(n,3,0)),this.setAttribute("instanceEnd",new fn(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new Ba(e,6,1);return this.setAttribute("instanceColorStart",new fn(n,3,0)),this.setAttribute("instanceColorEnd",new fn(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new w_(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Bh.setFromBufferAttribute(e),this.boundingBox.union(Bh))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hn),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Cr.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Cr)),Cr.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Cr));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}const ja=new Qt,kh=new D,Hh=new D,Ee=new Qt,be=new Qt,pn=new Qt,Za=new D,Ka=new $t,we=new I_,Gh=new D,Rr=new dn,Pr=new Hn,mn=new Qt;let gn,pi;function Vh(i,t,e){return mn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),mn.multiplyScalar(1/mn.w),mn.x=pi/e.width,mn.y=pi/e.height,mn.applyMatrix4(i.projectionMatrixInverse),mn.multiplyScalar(1/mn.w),Math.abs(Math.max(mn.x,mn.y))}function h0(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,l=o;a<l;a++){we.start.fromBufferAttribute(s,a),we.end.fromBufferAttribute(r,a),we.applyMatrix4(e);const c=new D,h=new D;gn.distanceSqToSegment(we.start,we.end,h,c),h.distanceTo(c)<pi*.5&&t.push({point:h,pointOnLine:c,distance:gn.origin.distanceTo(h),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function d0(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),d=-t.near;gn.at(1,pn),pn.w=1,pn.applyMatrix4(t.matrixWorldInverse),pn.applyMatrix4(n),pn.multiplyScalar(1/pn.w),pn.x*=r.x/2,pn.y*=r.y/2,pn.z=0,Za.copy(pn),Ka.multiplyMatrices(t.matrixWorldInverse,o);for(let u=0,p=h;u<p;u++){if(Ee.fromBufferAttribute(l,u),be.fromBufferAttribute(c,u),Ee.w=1,be.w=1,Ee.applyMatrix4(Ka),be.applyMatrix4(Ka),Ee.z>d&&be.z>d)continue;if(Ee.z>d){const y=Ee.z-be.z,x=(Ee.z-d)/y;Ee.lerp(be,x)}else if(be.z>d){const y=be.z-Ee.z,x=(be.z-d)/y;be.lerp(Ee,x)}Ee.applyMatrix4(n),be.applyMatrix4(n),Ee.multiplyScalar(1/Ee.w),be.multiplyScalar(1/be.w),Ee.x*=r.x/2,Ee.y*=r.y/2,be.x*=r.x/2,be.y*=r.y/2,we.start.copy(Ee),we.start.z=0,we.end.copy(be),we.end.z=0;const _=we.closestPointToPointParameter(Za,!0);we.at(_,Gh);const m=Ci.lerp(Ee.z,be.z,_),f=m>=-1&&m<=1,v=Za.distanceTo(Gh)<pi*.5;if(f&&v){we.start.fromBufferAttribute(l,u),we.end.fromBufferAttribute(c,u),we.start.applyMatrix4(o),we.end.applyMatrix4(o);const y=new D,x=new D;gn.distanceSqToSegment(we.start,we.end,x,y),e.push({point:x,pointOnLine:y,distance:gn.origin.distanceTo(x),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}class u0 extends qe{constructor(t=new Ya,e=new zh({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,l=e.count;o<l;o++,a+=2)kh.fromBufferAttribute(e,o),Hh.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+kh.distanceTo(Hh);const r=new Ba(s,2,1);return t.setAttribute("instanceDistanceStart",new fn(r,1,0)),t.setAttribute("instanceDistanceEnd",new fn(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;gn=t.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;pi=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),Pr.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=pi*.5;else{const d=Math.max(s.near,Pr.distanceToPoint(gn.origin));c=Vh(s,d,l.resolution)}if(Pr.radius+=c,gn.intersectsSphere(Pr)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),Rr.copy(a.boundingBox).applyMatrix4(o);let h;if(n)h=pi*.5;else{const d=Math.max(s.near,Rr.distanceToPoint(gn.origin));h=Vh(s,d,l.resolution)}Rr.expandByScalar(h),gn.intersectsBox(Rr)!==!1&&(n?h0(this,e):d0(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(ja),this.material.uniforms.resolution.value.set(ja.z,ja.w))}}const Lr=4096;function f0(i,t,e,n,s,r){i.beginPath(),typeof i.roundRect=="function"?i.roundRect(t,e,n,s,r):i.rect(t,e,n,s)}class p0{constructor(t=4){$(this,"map",new Map);this.resolution=t}clear(){for(const t of this.map.values())t.texture.dispose();this.map.clear()}make(t){const e=new b_(t);return e.colorSpace=Be,e.anisotropy=4,e}text(t,e,n){const s=JSON.stringify(["t",t,e,n??null,this.resolution]),r=this.map.get(s);if(r)return r;const o=this.resolution,a=m=>m.length>e.maxChars?m.slice(0,Math.max(1,e.maxChars-1))+"…":m,l=[...t.split(`
`).map(m=>({t:a(m),px:e.size*o,color:e.color})),...n?.text?n.text.split(`
`).map(m=>({t:a(m),px:n.size*o,color:n.color})):[]],c=e.padding*o,h=document.createElement("canvas");let d=h.getContext("2d"),u=0,p=0;for(const m of l)d.font=`${m.px}px ${e.font}`,u=Math.max(u,d.measureText(m.t).width),p+=m.px*1.25;h.width=Math.min(Lr,Math.max(2,Math.ceil(u+c*2))),h.height=Math.min(Lr,Math.max(2,Math.ceil(p+c*2))),d=h.getContext("2d"),d.textAlign="center",d.textBaseline="middle",e.background&&(d.fillStyle=e.background,f0(d,0,0,h.width,h.height,e.size*o*.25),d.fill());let g=c;for(const m of l){const f=m.px*1.25;d.font=`${m.px}px ${e.font}`,d.fillStyle=m.color,d.fillText(m.t,h.width/2,g+f/2),g+=f}const _={texture:this.make(h),w:h.width/o,h:h.height/o};return this.map.set(s,_),_}card(t,e,n){const s=n.card,r=t.label??t.id,o=t.body??[],a=JSON.stringify(["c",r,o,e.color,s,this.resolution]),l=this.map.get(a);if(l)return l;const c=this.resolution,h=s.size*c,d=h*1.4,u=s.padding*c,p=document.createElement("canvas").getContext("2d"),g=r.split(`
`);p.font=`bold ${h}px ${s.font}`;const _=Math.max(...g.map(C=>p.measureText(C).width));p.font=`${h}px ${s.font}`;const m=o.length?Math.max(...o.map(C=>C==="---"?0:p.measureText(C).width)):0,f=Math.min(Lr,Math.ceil(Math.max(_,m)+u*3)),v=g.length*d+u*1.5,y=o.length?o.length*d+u*1.5:0,x=Math.min(Lr,Math.ceil(v+y)),L=document.createElement("canvas");L.width=Math.max(2,f),L.height=Math.max(2,x);const E=L.getContext("2d");E.fillStyle=s.background,E.fillRect(0,0,L.width,L.height),E.fillStyle=s.headerBackground??e.color,E.fillRect(0,0,L.width,v),E.textBaseline="middle",E.textAlign="center",E.font=`bold ${h}px ${s.font}`,E.fillStyle=s.headerColor,g.forEach((C,b)=>E.fillText(C,L.width/2,u*.75+d*(b+.5))),E.textAlign="left",E.font=`${h}px ${s.font}`,o.forEach((C,b)=>{const M=v+u*.75+d*(b+.5);C==="---"?(E.strokeStyle=s.border,E.lineWidth=Math.max(1,c*.3),E.beginPath(),E.moveTo(0,M),E.lineTo(L.width,M),E.stroke()):(E.fillStyle=s.textColor,E.fillText(C,u*1.5,M))}),E.strokeStyle=s.border,E.lineWidth=Math.max(2,c*.5),E.strokeRect(0,0,L.width,L.height);const A={texture:this.make(L),w:L.width/c,h:L.height/c};return this.map.set(a,A),A}}const Wh=`
.gs-container{position:relative;overflow:hidden}
.gs-root{position:absolute;inset:0;overflow:hidden;font-family:var(--gs-font,system-ui,sans-serif);color:var(--gs-panel-fg,#1f2933);touch-action:none;user-select:none;-webkit-user-select:none}
.gs-root canvas{display:block;outline:none}
.gs-tooltip{position:absolute;z-index:3;pointer-events:none;max-width:260px;padding:6px 9px;font-size:12px;line-height:1.35;background:var(--gs-panel-bg,rgba(255,255,255,.96));color:var(--gs-panel-fg,#1f2933);border:1px solid var(--gs-panel-border,#cfd6de);border-radius:var(--gs-radius,4px);box-shadow:0 2px 8px rgba(0,0,0,.18);white-space:pre-wrap;overflow-wrap:anywhere}
.gs-tooltip[hidden]{display:none}
.gs-tt-title{font-weight:600}
.gs-tt-muted{opacity:.7}
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
`;function Xh(){if(typeof document>"u"||document.getElementById("gs-styles"))return;const i=document.createElement("style");i.id="gs-styles",i.textContent=Wh,document.head.appendChild(i)}const ts=400,m0=new D(1,0,0),$h={x:0,y:1,z:2},qh={x:"#e03131",y:"#2f9e44",z:"#1c7ed6"},Yh=new hn,g0=4;class jh{constructor(t,e={},n){$(this,"events",new Ur);$(this,"config");$(this,"_graph");$(this,"userConfig");$(this,"container");$(this,"root");$(this,"canvas");$(this,"renderer");$(this,"scene",new y_);$(this,"persp");$(this,"ortho");$(this,"camera");$(this,"controls");$(this,"orbit",null);$(this,"disposeControls",()=>{});$(this,"pointerIsDown",!1);$(this,"activeUntil",0);$(this,"ambient",new P_(16777215,1.8));$(this,"headlight",new R_(16777215,1.6));$(this,"tex");$(this,"width",1);$(this,"height",1);$(this,"ro",null);$(this,"raf",0);$(this,"disposed",!1);$(this,"unsubGraph",()=>{});$(this,"nodeInfo",new Map);$(this,"edgeInfo",new Map);$(this,"layers",new Map);$(this,"buckets",[]);$(this,"arrowMesh",null);$(this,"geoms",new Map);$(this,"colors",new Map);$(this,"selNodes",new Set);$(this,"selEdges",new Set);$(this,"hoverNode",null);$(this,"hoverEdge",null);$(this,"tool","select");$(this,"dirtyStructure",!0);$(this,"dirtyPositions",!1);$(this,"dirtyNodes",!1);$(this,"dirtyEdges",!1);$(this,"dirtyLabels",!1);$(this,"pendingFit",!0);$(this,"pendingLayout",!1);$(this,"sim",null);$(this,"simResolve",null);$(this,"dragIds",[]);$(this,"drag",null);$(this,"down",null);$(this,"lastPointer",{x:0,y:0});$(this,"hoverRaf",0);$(this,"rubber",null);$(this,"guide",null);$(this,"axisKeys",new Set);$(this,"appliedVars",[]);$(this,"tooltipEl");$(this,"boxEl");$(this,"controlsEl",null);$(this,"dimButton",null);$(this,"fsButton",null);$(this,"panelEl",null);$(this,"tmpM",new $t);$(this,"tmpV",new D);$(this,"tmpV2",new D);$(this,"tmpQ",new hn);$(this,"tmpS",new D);$(this,"raycaster",new D_);$(this,"plane",new Dn);$(this,"simName","force");$(this,"onFullscreenChange",()=>{if(this.disposed)return;const t=this.isFullscreen;this.fsButton&&(this.fsButton.textContent=t?"Exit":"Full"),this.resize(),this.events.emit("fullscreenchange",{fullscreen:t})});$(this,"onGraphChange",t=>{t.kind==="position"?this.dirtyPositions=!0:(this.sim&&this.stopLayout(),this.dirtyStructure=!0),this.requestRender()});$(this,"onCameraChange",()=>{(this.config.label.mode==="screen"||this.config.dimension==="3d")&&(this.dirtyLabels=!0),this.requestRender()});$(this,"tick",()=>{this.raf=0,!this.disposed&&(this.frame(),(this.sim||this.needsContinuousFrames)&&this.requestRender())});$(this,"ndc",new ht);$(this,"onWheel",()=>{this.activeUntil=performance.now()+700,this.requestRender()});$(this,"onPointerDown",t=>{if(t.target.closest?.(".gs-ui")||(this.pointerIsDown=!0,this.requestRender(),t.button!==0))return;const e=this.eventPoint(t);this.lastPointer=e;const n=this.pick(e.x,e.y),s=t.shiftKey,r=this.config.interaction,o=n.kind==="node"&&this.selNodes.has(n.id);if(this.down={x:e.x,y:e.y,hit:n,additive:s,wasSelected:o,moved:!1,button:t.button},this.hideTooltip(),n.kind==="node"){if(this.tool==="connect")this.drag={type:"connect",from:n.id};else if(r.select&&!o&&(s&&r.multiSelect?this.selNodes.add(n.id):(this.selNodes=new Set([n.id]),this.selEdges.clear()),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),r.dragNodes){const a=this.selNodes.has(n.id)?[...this.selNodes]:[n.id],l=this.nodeInfo.get(n.id).body.pos,c=this.worldAt(e.x,e.y,l);if(c){const h=new Map,d=new Map;for(const u of a){const p=this.nodeInfo.get(u)?.body.pos;p&&(h.set(u,[p[0]-c[0],p[1]-c[1],p[2]-c[2]]),d.set(u,[p[0],p[1],p[2]]))}this.drag={type:"nodes",ids:a,primary:n.id,offsets:h,starts:d,anchor:[l[0],l[1],l[2]],px:e.x,py:e.y,moved:!1}}}}else t.shiftKey&&r.select&&r.multiSelect&&(this.drag={type:"box",x0:e.x,y0:e.y});this.drag&&(this.controls.enabled=!1,this.canvas.setPointerCapture(t.pointerId))});$(this,"onPointerMove",t=>{const e=this.eventPoint(t);this.lastPointer=e;const n=this.down;n&&!n.moved&&Math.hypot(e.x-n.x,e.y-n.y)>g0&&(n.moved=!0);const s=this.drag;if(!s){n||this.scheduleHover(),this.moveTooltip(e);return}if(s.type==="nodes"){if(!n?.moved)return;s.moved||(s.moved=!0,this.dragIds=s.ids,this.canvas.style.cursor="grabbing",this.events.emit("nodedragstart",{ids:s.ids})),this.dragNodes(s,e)}else if(s.type==="connect"){this.updateRubber(s.from,e);const r=this.pick(e.x,e.y),o=r.kind==="node"?r.id:null;o!==this.hoverNode&&(this.hoverNode=o,this.dirtyNodes=!0,this.requestRender())}else if(n?.moved){const r=Math.min(s.x0,e.x),o=Math.min(s.y0,e.y);this.boxEl.hidden=!1,Object.assign(this.boxEl.style,{left:`${r}px`,top:`${o}px`,width:`${Math.abs(e.x-s.x0)}px`,height:`${Math.abs(e.y-s.y0)}px`})}});$(this,"onPointerUp",t=>{this.pointerIsDown=!1,this.activeUntil=performance.now()+1e3,this.requestRender();const e=this.down,n=this.drag;if(this.down=null,this.drag=null,this.controls.enabled=!0,this.canvas.hasPointerCapture?.(t.pointerId)&&this.canvas.releasePointerCapture(t.pointerId),this.boxEl.hidden=!0,this.removeRubber(),this.setAxisGuide(null),this.canvas.style.cursor=this.tool==="connect"?"crosshair":"",n?.type==="nodes"&&n.moved){for(const r of n.ids)this.sim?.unpin(r,!!this._graph.getNode(r)?.pinned);this.dragIds=[],this.events.emit("nodedragend",{ids:n.ids});return}if(!e||t.type==="pointercancel")return;const s=this.eventPoint(t);if(n?.type==="connect"){const r=this.pick(s.x,s.y);r.kind==="node"&&this.events.emit("connect",{source:n.from,target:r.id});return}if(n?.type==="box"&&e.moved){this.selectInBox(n.x0,n.y0,s.x,s.y,e.additive);return}e.moved||this.handleClick(e.hit,e.additive,e.wasSelected,t)});$(this,"onDblClick",t=>{if(t.target.closest?.(".gs-ui"))return;const e=this.eventPoint(t),n=this.pick(e.x,e.y),s=this.config.interaction.openLinks==="dblclick";if(n.kind==="node"){const r=this._graph.getNode(n.id);r&&this.events.emit("nodedblclick",{id:n.id,node:r,originalEvent:t}),s&&this.openLink("node",n.id)}else if(n.kind==="edge")s&&this.openLink("edge",n.id);else{const r=this.worldAt(e.x,e.y,this.config.dimension==="3d"?this.controls.target.toArray():[0,0,0])??[0,0,0];this.events.emit("backgrounddblclick",{position:r,originalEvent:t})}});$(this,"onPointerLeave",()=>{this.drag||(this.hideTooltip(),(this.hoverNode||this.hoverEdge)&&(this.hoverNode=this.hoverEdge=null,this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("hover",{kind:null,id:null}),this.requestRender()))});$(this,"onKeyDown",t=>{if(t.key==="Escape"&&this.container.classList.contains("gs-pseudo-fullscreen")&&this.toggleFullscreen(!1),t.ctrlKey||t.metaKey||t.altKey||t.target?.matches?.("input, textarea, select"))return;const n=t.key.toLowerCase();(n==="x"||n==="y"||n==="z")&&!this.axisKeys.has(n)&&(this.axisKeys.add(n),this.refreshAxisDrag())});$(this,"onKeyUp",t=>{const e=t.key.toLowerCase();(e==="x"||e==="y"||e==="z")&&this.axisKeys.delete(e)&&this.refreshAxisDrag()});$(this,"onBlur",()=>{this.axisKeys.size&&(this.axisKeys.clear(),this.refreshAxisDrag())});this.container=t,this.userConfig=e,this.config=ss(e),this._graph=n instanceof Ls?n:new Ls(n),this.config.ui.injectStyles&&Xh(),t.classList.add("gs-container"),this.root=document.createElement("div"),this.root.className="gs-root",t.appendChild(this.root),this.renderer=new x_({antialias:this.config.render.antialias,alpha:!0}),this.renderer.setClearColor(0,0),this.canvas=this.renderer.domElement,this.root.appendChild(this.canvas),this.tex=new p0(this.config.label.resolution),this.persp=new Ye(this.config.camera.fov,1,1,1e5),this.ortho=new ya(-1,1,1,-1,.1,1e4),this.camera=this.config.dimension==="3d"?this.persp:this.ortho,this.scene.add(this.ambient,this.headlight,this.headlight.target),this.tooltipEl=document.createElement("div"),this.tooltipEl.className="gs-tooltip gs-ui",this.tooltipEl.hidden=!0,this.boxEl=document.createElement("div"),this.boxEl.className="gs-box",this.boxEl.hidden=!0,this.root.append(this.tooltipEl,this.boxEl),this.setupCamera(),this.buildControls(),this.applyAppearance(),this.root.addEventListener("pointerdown",this.onPointerDown,!0),this.root.addEventListener("pointermove",this.onPointerMove),this.root.addEventListener("pointerup",this.onPointerUp),this.root.addEventListener("pointercancel",this.onPointerUp),this.root.addEventListener("pointerleave",this.onPointerLeave),this.root.addEventListener("dblclick",this.onDblClick),this.root.addEventListener("wheel",this.onWheel,{passive:!0}),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("fullscreenchange",this.onFullscreenChange),typeof ResizeObserver<"u"&&(this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(t)),this.subscribe(),this.resize(),this.afterLoad()}get graph(){return this._graph}on(t,e){return this.events.on(t,e)}load(t){this.stopLayout(),this.unsubGraph(),t instanceof Ls?this._graph=t:this._graph.load(t,!1),this.subscribe(),this.selNodes.clear(),this.selEdges.clear(),this.hoverNode=this.hoverEdge=null;const e=this._graph.meta.dimension;e&&e!==this.config.dimension&&this.setDimension(e),this.afterLoad()}refresh(){this.dirtyStructure=!0,this.requestRender()}getConfig(){return this.config}getUserConfig(){return this.userConfig}setConfig(t){const{dimension:e,...n}=t,s=this.config.camera.rotation;this.userConfig=_i(this.userConfig,n),this.config=ss(this.userConfig),this.tex.resolution=this.config.label.resolution,this.tex.clear(),this.persp.fov=this.config.camera.fov,this.persp.updateProjectionMatrix(),this.config.dimension==="3d"&&this.config.camera.rotation!==s&&this.setupCamera(!0),this.orbit&&(this.orbit.enableDamping=this.config.camera.damping),this.applyControlLimits(),this.applyAppearance(),this.dirtyStructure=!0,this.requestRender(),e!==void 0&&this.setDimension(e)}getDimension(){return this.config.dimension}setDimension(t){t!==this.config.dimension&&(this.stopLayout(),this.userConfig=_i(this.userConfig,{dimension:t}),this.config=ss(this.userConfig),this.camera=t==="3d"?this.persp:this.ortho,this.setupCamera(),this.resize(),this.dirtyStructure=!0,this.pendingFit=this.config.camera.autoFit,this.dimButton&&(this.dimButton.textContent=t==="2d"?"3D":"2D"),this.events.emit("dimensionchange",{dimension:t}),this.requestRender())}isFlat(){return this._graph.nodes.every(t=>!t.z)}runLayout(t=this.config.layout.name,e={}){this.stopLayout();const n=this._graph;if(n.nodes.length===0)return Promise.resolve();const s=this.config;Jr(n,s.dimension,s.layout.idealLength,s.layout.seed);const r={...Kr,dimension:s.dimension,spacing:s.layout.spacing,idealLength:s.layout.idealLength,gravity:s.layout.gravity,weightMode:s.layout.weightMode,direction:s.layout.direction,seed:s.layout.seed,gap:s.layout.gap,boxes:Dl(n,s,s.dimension==="3d"),...e};if(this.events.emit("layoutstart",{name:t}),t==="force")return this.sim=new Yr(n,r),this.simName=t,this.requestRender(),new Promise(a=>{this.simResolve=a});const o=Bl(n,t,r);return n.setPositions([...o].filter(([a])=>!n.getNode(a)?.pinned)),s.camera.autoFit&&(this.pendingFit=!0),this.events.emit("layoutend",{name:t,completed:!0}),this.requestRender(),Promise.resolve()}stopLayout(t=!1){if(!this.sim)return;this.sim=null;const e=this.simResolve;this.simResolve=null,t&&this.config.camera.autoFit&&(this.pendingFit=!0),this.events.emit("layoutend",{name:this.simName,completed:t}),e?.(),this.requestRender()}get isLayoutRunning(){return this.sim!==null}fit(){const t=[...this.nodeInfo.values()],e=this.camera,n=this.config.dimension==="3d";if(t.length===0){this.controls.target.set(0,0,0),n?this.persp.position.set(0,0,300):(this.ortho.zoom=1,this.ortho.position.set(0,0,1e3)),this.ortho.updateProjectionMatrix(),this.controls.update(),this.requestRender();return}let s=1/0,r=1/0,o=1/0,a=-1/0,l=-1/0,c=-1/0;for(const f of t){const[v,y,x]=f.body.pos;s=Math.min(s,v-f.body.hw),a=Math.max(a,v+f.body.hw),r=Math.min(r,y-f.body.hh),l=Math.max(l,y+f.body.hh),o=Math.min(o,x),c=Math.max(c,x)}const h=(s+a)/2,d=(r+l)/2,u=(o+c)/2,p=this.config.camera.fitPadding,g=Math.max(a-s,10),_=Math.max(l-r,10),m=c-o;if(n){const f=Math.max(.5*Math.hypot(g,_,m),10),v=Ci.degToRad(this.persp.fov)/2,y=Math.atan(Math.tan(v)*(this.width/this.height)),x=f/Math.sin(Math.min(v,y))*p*.8,L=this.tmpV.copy(e.position).sub(this.controls.target);L.lengthSq()<1e-9&&L.set(0,0,1),L.normalize(),this.controls.target.set(h,d,u),e.position.set(h,d,u).addScaledVector(L,x)}else{const f=this.width/this.height,v=Math.min(ts*f/g,ts/_)/p;this.ortho.zoom=Math.min(this.config.camera.zoomMax,Math.max(this.config.camera.zoomMin,v)),this.ortho.position.set(h,d,1e3),this.controls.target.set(h,d,0),this.ortho.updateProjectionMatrix()}this.controls.update(),this.requestRender()}zoomBy(t){if(this.config.dimension==="2d"){const e=this.config.camera;this.ortho.zoom=Math.min(e.zoomMax,Math.max(e.zoomMin,this.ortho.zoom*t)),this.ortho.updateProjectionMatrix()}else{const e=this.tmpV.copy(this.persp.position).sub(this.controls.target).multiplyScalar(1/t);this.persp.position.copy(this.controls.target).add(e)}this.controls.update(),this.requestRender()}setTool(t){this.tool=t,this.canvas.style.cursor=t==="connect"?"crosshair":""}getTool(){return this.tool}getSelection(){return{nodes:[...this.selNodes],edges:[...this.selEdges]}}setSelection(t){this.selNodes=new Set((t.nodes??[]).filter(e=>this._graph.hasNode(e))),this.selEdges=new Set((t.edges??[]).filter(e=>!!this._graph.getEdge(e))),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()}selectAll(){this.setSelection({nodes:this._graph.nodes.map(t=>t.id)})}clearSelection(){(this.selNodes.size||this.selEdges.size)&&this.setSelection({})}getNodeStyle(t){return this.nodeInfo.get(t)?.style}getEdgeStyle(t){return this.edgeInfo.get(t)?.style}get isFullscreen(){return document.fullscreenElement===this.container||this.container.classList.contains("gs-pseudo-fullscreen")}async toggleFullscreen(t){const e=t??!this.isFullscreen;if(e===this.isFullscreen)return;const n=this.container;if(e){if(typeof n.requestFullscreen=="function")try{await n.requestFullscreen();return}catch{}n.classList.add("gs-pseudo-fullscreen")}else if(document.fullscreenElement===n){await document.exitFullscreen();return}else n.classList.remove("gs-pseudo-fullscreen");this.onFullscreenChange()}openLink(t,e){const n=t==="node"?this._graph.getNode(e):this._graph.getEdge(e),s=el(n?.url,this.config.links);if(!n||!n.url||!s)return!1;const r={url:n.url,resolved:s,kind:t,id:e,handled:!1};if(this.events.emit("link",r),r.handled||this.config.links.target==="event")return!0;switch(this.config.links.target){case"blank":window.open(s,"_blank","noopener");break;case"panel":this.openPanel(s,n.label??e);break;default:window.location.assign(s)}return!0}closePanel(){this.panelEl?.remove(),this.panelEl=null}exportImage(t="image/png",e){this.frame();const n=document.createElement("canvas");n.width=this.canvas.width,n.height=this.canvas.height;const s=n.getContext("2d"),r=this.config.background;if(!r.transparent){if(r.gradientTo){const o=s.createLinearGradient(0,0,0,n.height);o.addColorStop(0,r.color),o.addColorStop(1,r.gradientTo),s.fillStyle=o}else s.fillStyle=r.color;s.fillRect(0,0,n.width,n.height)}return s.drawImage(this.canvas,0,0),n.toDataURL(t,e)}resize(){const t=Math.max(1,this.container.clientWidth),e=Math.max(1,this.container.clientHeight);this.width=t,this.height=e,this.renderer.setPixelRatio(this.config.render.pixelRatio??Math.min(window.devicePixelRatio||1,2)),this.renderer.setSize(t,e);const n=t/e;this.persp.aspect=n,this.persp.updateProjectionMatrix(),this.ortho.left=-ts*n/2,this.ortho.right=ts*n/2,this.ortho.top=ts/2,this.ortho.bottom=-ts/2,this.ortho.updateProjectionMatrix();for(const s of this.buckets)s.mesh.material.resolution.set(t,e);this.controls&&!this.orbit&&this.controls.handleResize(),this.dirtyLabels=!0,this.requestRender()}destroy(){this.disposed=!0,cancelAnimationFrame(this.raf),cancelAnimationFrame(this.hoverRaf),this.ro?.disconnect(),this.unsubGraph(),this.stopLayout(),this.root.removeEventListener("pointerdown",this.onPointerDown,!0),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("fullscreenchange",this.onFullscreenChange),this.container.classList.remove("gs-pseudo-fullscreen"),this.setAxisGuide(null),this.disposeControls(),this.clearScene();for(const t of this.geoms.values())t.dispose();this.tex.clear(),this.renderer.dispose(),this.root.remove(),this.container.classList.remove("gs-container"),this.events.clear()}subscribe(){this.unsubGraph=this._graph.events.on("change",this.onGraphChange)}afterLoad(){const t=this._graph.nodes.some(e=>e.x===void 0||e.y===void 0);this.pendingFit=this.config.camera.autoFit,this.pendingLayout=t&&this.config.layout.autoRun,this.dirtyStructure=!0,this.requestRender()}setupCamera(t=!1){const e=this.config.dimension==="3d",n=e&&this.config.camera.rotation==="free",s=this.controls?this.controls.target.clone():null;if(this.disposeControls(),this.camera=e?this.persp:this.ortho,t||(e?this.persp.position.set(0,0,300):(this.ortho.position.set(0,0,1e3),this.ortho.zoom=1)),e&&this.persp.up.set(0,1,0),n){const r=new j_(this.camera,this.canvas);r.rotateSpeed=2.5,r.zoomSpeed=1.2,r.panSpeed=.8,r.staticMoving=!1,r.dynamicDampingFactor=.12,r.keys=["","",""],r.addEventListener("change",this.onCameraChange),this.disposeControls=()=>{r.removeEventListener("change",this.onCameraChange),r.dispose()},this.orbit=null,this.controls=r}else{const r=new N_(this.camera,this.canvas);r.enableDamping=this.config.camera.damping,r.zoomToCursor=!0,r.addEventListener("change",this.onCameraChange),e?(r.mouseButtons={LEFT:me.ROTATE,MIDDLE:me.DOLLY,RIGHT:me.PAN},r.touches={ONE:an.ROTATE,TWO:an.DOLLY_PAN}):(r.enableRotate=!1,r.screenSpacePanning=!0,r.mouseButtons={LEFT:me.PAN,MIDDLE:me.DOLLY,RIGHT:me.PAN},r.touches={ONE:an.PAN,TWO:an.DOLLY_PAN}),this.disposeControls=()=>{r.removeEventListener("change",this.onCameraChange),r.dispose()},this.orbit=r,this.controls=r}t&&s&&this.controls.target.copy(s),this.applyControlLimits(),this.controls.update()}applyControlLimits(){const t=this.config.camera;this.orbit&&(this.orbit.minZoom=t.zoomMin,this.orbit.maxZoom=t.zoomMax),this.controls.minDistance=5,this.controls.maxDistance=5e4}get needsContinuousFrames(){return!this.orbit&&this.config.dimension==="3d"&&(this.pointerIsDown||performance.now()<this.activeUntil)}applyAppearance(){const t=this.config,e=t.background;this.root.style.background=e.transparent?"transparent":e.gradientTo?`linear-gradient(${e.color}, ${e.gradientTo})`:e.color;for(const n of this.appliedVars)this.root.style.removeProperty(`--gs-${n}`);this.appliedVars=Object.keys(t.ui.cssVars);for(const[n,s]of Object.entries(t.ui.cssVars))this.root.style.setProperty(`--gs-${n}`,s);this.tooltipEl.hidden=!0}buildControls(){if(this.controlsEl?.remove(),this.controlsEl=null,!this.config.ui.controls)return;const t=document.createElement("div");t.className="gs-controls gs-ui";const e=(n,s,r)=>{const o=document.createElement("button");return o.type="button",o.className="gs-btn",o.textContent=n,o.title=s,o.setAttribute("aria-label",s),o.addEventListener("click",r),t.appendChild(o),o};e("+","Zoom in",()=>this.zoomBy(1.4)),e("−","Zoom out",()=>this.zoomBy(.7142857142857143)),e("Fit","Fit graph to view",()=>this.fit()),this.dimButton=e(this.config.dimension==="2d"?"3D":"2D","Switch between 2D and 3D",()=>{this.setDimension(this.config.dimension==="2d"?"3d":"2d")}),this.fsButton=null,this.config.ui.fullscreen&&(this.fsButton=e(this.isFullscreen?"Exit":"Full","Toggle full screen",()=>{this.toggleFullscreen()})),this.root.appendChild(t),this.controlsEl=t}requestRender(){this.raf||this.disposed||(this.raf=requestAnimationFrame(this.tick))}frame(){this.sim&&this.stepSimulation(),this.dirtyStructure&&this.rebuildStructure(),this.pendingFit&&(this.pendingFit=!1,this.fit()),this.pendingLayout&&(this.pendingLayout=!1,this.runLayout()),this.dirtyPositions&&this.updatePositions(),this.dirtyNodes&&(this.dirtyNodes=!1,this.updateNodeInstances()),this.dirtyEdges&&(this.dirtyEdges=!1,this.writeEdges()),this.dirtyLabels&&(this.dirtyLabels=!1,this.updateLabels()),this.controls.update(),this.config.dimension==="3d"&&(this.headlight.position.copy(this.persp.position),this.headlight.target.position.copy(this.controls.target),this.headlight.target.updateMatrixWorld()),this.renderer.render(this.scene,this.camera)}stepSimulation(){const t=this.sim;if(!t)return;const e=this._graph.nodes.length,n=e<=1500?3:e<=5e3?2:1;for(const s of this.dragIds){const r=this._graph.getNode(s);r&&t.pin(s,[r.x??0,r.y??0,r.z??0])}for(let s=0;s<n;s++)t.step();t.commit(this._graph),t.alpha<.02&&this.stopLayout(!0)}color(t){let e=this.colors.get(t);return e||(e=new Ft(t),this.colors.set(t,e)),e}geometryFor(t){let e=this.geoms.get(t);if(e)return e;switch(t){case"circle3d":e=new Fa(.5,24,16);break;case"square3d":case"rectangle3d":e=new ki(1,1,1);break;case"diamond3d":e=new Oa(.62);break;case"hexagon3d":e=new Cs(.5,.5,1,6),e.rotateX(Math.PI/2),e.rotateZ(Math.PI/2);break;case"triangle3d":e=new Cs(.5,.5,1,3),e.rotateX(-Math.PI/2);break;case"square":case"rectangle":e=new ys(1,1);break;case"diamond":e=new Ji(.5,4);break;case"hexagon":e=new Ji(.5,6);break;case"triangle":e=new Ji(.5,3),e.rotateZ(Math.PI/2);break;case"arrow":e=new Ua(.5,1,14),e.rotateZ(-Math.PI/2),e.translate(-.5,0,0);break;default:e=new Ji(.5,40)}return this.geoms.set(t,e),e}applyMode(t,e){const n=this.config.dimension==="3d";t.transparent=n?e<1:!0,t.opacity=e,t.depthTest=n,t.depthWrite=n}clearScene(){for(const t of this.layers.values())this.scene.remove(t.body,t.outline),t.body.material.dispose(),t.outline.material.dispose(),t.body.dispose(),t.outline.dispose();this.layers.clear();for(const t of this.buckets)this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose();this.buckets=[],this.arrowMesh&&(this.scene.remove(this.arrowMesh),this.arrowMesh.material.dispose(),this.arrowMesh.dispose(),this.arrowMesh=null);for(const t of this.nodeInfo.values())t.sprite&&this.dropSprite(t.sprite);for(const t of this.edgeInfo.values())t.sprite&&this.dropSprite(t.sprite);this.nodeInfo.clear(),this.edgeInfo.clear()}dropSprite(t){this.scene.remove(t),t.material.dispose()}makeSprite(t,e){const n=this.config.dimension==="3d",s=new ph({map:t.texture,transparent:!0,depthTest:n,depthWrite:!1}),r=new M_(s);return r.renderOrder=e,r.frustumCulled=!1,this.scene.add(r),r}rebuildStructure(){this.dirtyStructure=!1,this.clearScene();const t=this.config,e=this._graph,n=t.dimension==="3d";Jr(e,t.dimension,t.layout.idealLength,t.layout.seed);for(const d of[...this.selNodes])e.hasNode(d)||this.selNodes.delete(d);for(const d of[...this.selEdges])e.getEdge(d)||this.selEdges.delete(d);this.hoverNode&&!e.hasNode(this.hoverNode)&&(this.hoverNode=null),this.hoverEdge&&!e.getEdge(this.hoverEdge)&&(this.hoverEdge=null);const s=Fr(e),r=new Map;for(const d of e.nodes){const u=zr(d,t,s),p=Vr(u.shape,u.size,t.node.aspect),g={node:d,style:u,body:{pos:[0,0,0],hw:p.hw,hh:p.hh,ellipse:El(u.shape)},layerKey:null,layer:null,slot:-1};if(u.shape==="card")g.card=this.tex.card(d,u,t),g.body.hw=g.card.w/2,g.body.hh=g.card.h/2,g.body.ellipse=!1,n&&(g.body.hw=g.body.hh=Math.max(g.body.hw,g.body.hh)),g.sprite=this.makeSprite(g.card,4);else{g.layerKey=n?`${u.shape}3d`:u.shape;const _=r.get(g.layerKey)??[];_.push(g),r.set(g.layerKey,_)}this.nodeInfo.set(d.id,g)}for(const[d,u]of r){const p=this.geometryFor(d),g=n?new T_:new vs;this.applyMode(g,t.node.opacity);const _=new vs({side:n?Pe:yn});this.applyMode(_,t.node.opacity);const m=new La(p,g,u.length),f=new La(p,_,u.length);for(const y of[m,f])y.frustumCulled=!1,y.instanceMatrix.setUsage(sc);f.renderOrder=3,m.renderOrder=4;const v={key:d,body:m,outline:f};u.forEach((y,x)=>{y.layer=v,y.slot=x,m.setColorAt(x,this.color(y.style.color)),f.setColorAt(x,this.color(y.style.borderColor))}),this.layers.set(d,v),this.scene.add(f,m)}if(t.label.show&&e.nodes.length<=t.label.maxCount)for(const d of this.nodeInfo.values()){if(d.card)continue;const u=d.node.sublabel?{text:d.node.sublabel,size:t.label.subSize,color:t.label.subColor}:void 0,p=this.tex.text(d.node.label??d.node.id,{...t.label,color:d.style.labelColor},u);d.sprite=this.makeSprite(p,5)}let o=1/0,a=-1/0;for(const d of e.edges){const u=e.weightOf(d);o=Math.min(o,u),a=Math.max(a,u)}const l=new Map,c=new Map;let h=0;for(const d of e.edges){const u=e.weightOf(d),p=il(d,u,t,{min:o,max:a}),g=d.source===d.target,_={edge:d,style:p,weight:u,directed:e.isDirected(d),index:0,count:1,flip:!g&&d.source>d.target,self:g,path:[],arrowSlot:-1,bucketKey:`${p.width}|${p.dashed?1:0}`},m=g?`s\0${d.source}`:d.source<d.target?`${d.source}\0${d.target}`:`${d.target}\0${d.source}`,f=l.get(m)??[];f.push(_),l.set(m,f),this.edgeInfo.set(d.id,_),_.directed&&t.edge.arrows&&(_.arrowSlot=h++);let v=c.get(_.bucketKey);if(!v){const y=new zh({color:16777215,linewidth:p.width,vertexColors:!0,dashed:p.dashed,dashSize:t.edge.dashSize,gapSize:t.edge.gapSize});y.resolution.set(this.width,this.height),this.applyMode(y,t.edge.opacity);const x=new u0(new Ya,y);x.frustumCulled=!1,x.renderOrder=1,x.visible=!1,this.scene.add(x),v={key:_.bucketKey,mesh:x,edges:[],dashed:p.dashed},c.set(_.bucketKey,v)}v.edges.push(_)}for(const d of l.values())d.forEach((u,p)=>{u.index=p,u.count=d.length});if(this.buckets=[...c.values()],h>0){const d=new vs;this.applyMode(d,t.edge.opacity);const u=new La(this.geometryFor("arrow"),d,h);u.frustumCulled=!1,u.renderOrder=2,u.instanceMatrix.setUsage(sc);for(let p=0;p<h;p++)u.setColorAt(p,this.color("#ffffff"));this.arrowMesh=u,this.scene.add(u)}if(e.edges.length<=t.weight.maxCount)for(const d of this.edgeInfo.values()){const u=this.edgeText(d);u&&(d.img=this.tex.text(u,{...t.weight,maxChars:t.label.maxChars}),d.sprite=this.makeSprite(d.img,5))}this.dirtyPositions=!1,this.dirtyNodes=this.dirtyEdges=!1,this.updatePositions()}edgeText(t){const e=this.config.weight,s=e.show==="always"||e.show==="auto"&&t.weight!==1?String(Number(t.weight.toFixed(e.decimals))):"",r=t.edge.label??"";return r&&s?`${r} (${s})`:r||s}updatePositions(){this.dirtyPositions=!1;const t=this.config.dimension==="3d";for(const e of this.nodeInfo.values()){const n=e.node;e.body.pos[0]=n.x??0,e.body.pos[1]=n.y??0,e.body.pos[2]=t?n.z??0:0}this.updateNodeInstances(),this.computePaths(),this.writeEdges(),this.updateLabels()}updateNodeInstances(){const t=this.config,e=t.dimension==="3d",n=this.tmpM;for(const[s,r]of this.nodeInfo){const o=r.layer;if(!o)continue;const a=this.selNodes.has(s),l=s===this.hoverNode,c=a?t.selection.width:l?t.selection.width*.8:r.style.borderWidth,h=r.body.hw*2,d=r.body.hh*2,[u,p,g]=r.body.pos;n.compose(this.tmpV.set(u,p,g),Yh,this.tmpS.set(h,d,e?d:1)),o.body.setMatrixAt(r.slot,n),n.compose(this.tmpV.set(u,p,g),Yh,this.tmpS.set(h+2*c,d+2*c,e?d+2*c:1)),o.outline.setMatrixAt(r.slot,n),o.outline.setColorAt(r.slot,this.color(a?t.selection.color:l?t.selection.hoverColor:r.style.borderColor))}for(const s of this.layers.values())s.body.instanceMatrix.needsUpdate=!0,s.outline.instanceMatrix.needsUpdate=!0,s.outline.instanceColor&&(s.outline.instanceColor.needsUpdate=!0)}computePaths(){const t=this.config,e={spacing:t.edge.curveSpacing,segments:16,dim3:t.dimension==="3d",loopScale:t.edge.loopSize};for(const n of this.edgeInfo.values()){const s=this.nodeInfo.get(n.edge.source)?.body,r=this.nodeInfo.get(n.edge.target)?.body;if(!s||!r){n.path=[];continue}let o=Al(s,r,n.index,n.count,n.flip,n.self,e);n.tip=void 0,n.arrowSlot>=0&&o.length>=2&&(n.tip=Pl(o),o=Cl(o,t.edge.arrowSize*.9)),n.path=o}}edgeColor(t){const e=this.config.selection;return this.selEdges.has(t.edge.id)?this.color(e.color):t.edge.id===this.hoverEdge?this.color(e.hoverColor):this.color(t.style.color)}writeEdges(){for(const t of this.buckets){let e=0;for(const a of t.edges)e+=Math.max(0,a.path.length-1);const n=new Float32Array(e*6),s=new Float32Array(e*6);let r=0;for(const a of t.edges){const l=this.edgeColor(a);for(let c=1;c<a.path.length;c++){const h=a.path[c-1],d=a.path[c];n[r]=h[0],n[r+1]=h[1],n[r+2]=h[2],n[r+3]=d[0],n[r+4]=d[1],n[r+5]=d[2],s[r]=s[r+3]=l.r,s[r+1]=s[r+4]=l.g,s[r+2]=s[r+5]=l.b,r+=6}}const o=new Ya;e>0&&(o.setPositions(n),o.setColors(s)),t.mesh.geometry.dispose(),t.mesh.geometry=o,t.mesh.visible=e>0,e>0&&t.dashed&&t.mesh.computeLineDistances()}if(this.arrowMesh){const t=this.config.edge.arrowSize;for(const e of this.edgeInfo.values()){if(e.arrowSlot<0)continue;if(!e.tip){this.arrowMesh.setMatrixAt(e.arrowSlot,this.tmpM.makeScale(0,0,0));continue}const n=e.tip.dir;this.tmpQ.setFromUnitVectors(m0,this.tmpV2.set(n[0],n[1],n[2])),this.tmpM.compose(this.tmpV.set(e.tip.tip[0],e.tip.tip[1],e.tip.tip[2]),this.tmpQ,this.tmpS.set(t,t*.8,t*.8)),this.arrowMesh.setMatrixAt(e.arrowSlot,this.tmpM),this.arrowMesh.setColorAt(e.arrowSlot,this.edgeColor(e))}this.arrowMesh.instanceMatrix.needsUpdate=!0,this.arrowMesh.instanceColor&&(this.arrowMesh.instanceColor.needsUpdate=!0)}}updateLabels(){const t=this.config,e=t.label.mode==="screen",n=t.dimension==="3d";for(const s of this.nodeInfo.values()){const r=s.sprite;if(!r)continue;const[o,a,l]=s.body.pos;if(s.card){r.position.set(o,a,l),r.scale.set(s.card.w,s.card.h,1);continue}const c=r.material.map.image,h=this.tex.resolution,d=e?1/this.pxPerUnitAt(o,a,l):1,u=c.width/h*d,p=c.height/h*d;r.scale.set(u,p,1),r.position.set(o,a-s.body.hh-t.label.gap*d-p/2,l),n&&this.towardCamera(r.position,s.body.hw+1)}for(const s of this.edgeInfo.values()){const r=s.sprite;if(!r||!s.img||s.path.length<2){r&&(r.visible=!1);continue}const o=Rl(s.path,.5),a=e?1/this.pxPerUnitAt(o[0],o[1],o[2]):1;r.visible=!0,r.scale.set(s.img.w*a,s.img.h*a,1),r.position.set(o[0],o[1],o[2]),n&&this.towardCamera(r.position,1.5)}}towardCamera(t,e){const n=this.tmpV2.copy(this.persp.position).sub(t);n.lengthSq()<1e-9||t.addScaledVector(n.normalize(),e)}pxPerUnitAt(t,e,n){if(this.camera===this.ortho)return this.height/((this.ortho.top-this.ortho.bottom)/this.ortho.zoom);const s=this.tmpV2.set(t,e,n).applyMatrix4(this.persp.matrixWorldInverse),r=Math.max(.001,-s.z);return this.height/(2*Math.tan(Ci.degToRad(this.persp.fov)/2)*r)}eventPoint(t){const e=this.canvas.getBoundingClientRect();return{x:t.clientX-e.left,y:t.clientY-e.top}}worldAt(t,e,n){this.camera.updateMatrixWorld(),this.ndc.set(t/this.width*2-1,-(e/this.height)*2+1),this.raycaster.setFromCamera(this.ndc,this.camera);const s=this.camera.getWorldDirection(this.tmpV2);this.plane.setFromNormalAndCoplanarPoint(s,this.tmpV.set(n[0],n[1],n[2]));const r=this.raycaster.ray.intersectPlane(this.plane,this.tmpS);return r?[r.x,r.y,r.z]:null}pick(t,e){this.camera.updateMatrixWorld();const n=this.config.dimension==="3d",s=this.tmpV;let r=null,o=1/0;for(const[c,h]of this.nodeInfo){const d=h.body.pos;if(s.set(d[0],d[1],d[2]).project(this.camera),s.z<-1||s.z>1)continue;const u=(s.x*.5+.5)*this.width,p=(-s.y*.5+.5)*this.height,g=this.pxPerUnitAt(d[0],d[1],d[2]),_=(t-u)/Math.max(h.body.hw*g,4),m=(e-p)/Math.max(h.body.hh*g,4);(h.body.ellipse||n?_*_+m*m<=1:Math.abs(_)<=1&&Math.abs(m)<=1)&&s.z<=o&&(r=c,o=s.z)}if(r)return{kind:"node",id:r};if(this.edgeInfo.size>this.config.interaction.pickLimit)return{kind:null,id:null};let a=null,l=6;for(const[c,h]of this.edgeInfo){const d=h.path;if(d.length<2)continue;let u=0,p=0;for(let g=0;g<d.length;g++){s.set(d[g][0],d[g][1],d[g][2]).project(this.camera);const _=(s.x*.5+.5)*this.width,m=(-s.y*.5+.5)*this.height;if(g>0){const f=Ll(t,e,u,p,_,m);f<l&&(l=f,a=c)}u=_,p=m}}return a?{kind:"edge",id:a}:{kind:null,id:null}}handleClick(t,e,n,s){const r=this.config.interaction,o=l=>r.openLinks==="click"||r.openLinks==="ctrl-click"&&l,a=s.ctrlKey||s.metaKey;if(t.kind==="node"){const l=this._graph.getNode(t.id);if(!l)return;r.select&&n&&(e?this.selNodes.delete(t.id):this.selNodes.size>1&&(this.selNodes=new Set([t.id])),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),this.events.emit("nodeclick",{id:t.id,node:l,originalEvent:s}),o(a)&&this.openLink("node",t.id)}else if(t.kind==="edge"){const l=this._graph.getEdge(t.id);if(!l)return;r.select&&(e&&r.multiSelect?this.selEdges.delete(t.id)||this.selEdges.add(t.id):(this.selNodes.clear(),this.selEdges=new Set([t.id])),this.dirtyNodes=this.dirtyEdges=!0,this.events.emit("selection",this.getSelection()),this.requestRender()),this.events.emit("edgeclick",{id:t.id,edge:l,originalEvent:s}),o(a)&&this.openLink("edge",t.id)}else{e||this.clearSelection();const l=this.eventPoint(s),c=this.worldAt(l.x,l.y,this.config.dimension==="3d"?this.controls.target.toArray():[0,0,0])??[0,0,0];this.events.emit("backgroundclick",{position:c,originalEvent:s})}}activeAxes(){if(!this.config.interaction.axisLock)return[];const t=this.config.dimension==="3d";return[...this.axisKeys].filter(e=>t||e!=="z")}toScreen(t){return this.camera.updateMatrixWorld(),this.tmpV.set(t[0],t[1],t[2]).project(this.camera),{x:(this.tmpV.x*.5+.5)*this.width,y:(-this.tmpV.y*.5+.5)*this.height}}dragNodes(t,e){const n=this.config.dimension==="3d",s=this.activeAxes(),r=[];let o=null;if(s.length===1){const a=s[0],l=t.starts.get(t.primary);if(!l)return;const c=[0,0,0];c[$h[a]]=1;const h=10,d=this.toScreen(l),u=this.toScreen([l[0]+c[0]*h,l[1]+c[1]*h,l[2]+c[2]*h]),p=u.x-d.x,g=u.y-d.y,_=p*p+g*g,m=_>1e-6?((e.x-t.px)*p+(e.y-t.py)*g)/_*h:0;for(const f of t.ids){const v=t.starts.get(f),y=this._graph.getNode(f);!v||!y||r.push([f,[v[0]+c[0]*m,v[1]+c[1]*m,n?v[2]+c[2]*m:y.z??0]])}o={origin:l,axis:a}}else{const a=this.worldAt(e.x,e.y,t.anchor);if(!a)return;const l=s.length===0;for(const c of t.ids){const h=t.offsets.get(c),d=t.starts.get(c),u=this._graph.getNode(c);if(!h||!d||!u)continue;const p=(g,_)=>l||s.includes(_)?a[g]+h[g]:d[g];r.push([c,[p(0,"x"),p(1,"y"),n?p(2,"z"):u.z??0]])}}this.setAxisGuide(o),this._graph.setPositions(r)}setAxisGuide(t){if(!t){if(!this.guide)return;this.scene.remove(this.guide),this.guide.geometry.dispose(),this.guide.material.dispose(),this.guide=null,this.requestRender();return}if(!this.guide){const o=new Se;o.setAttribute("position",new Ie(new Float32Array(6),3)),this.guide=new Eh(o,new Da({color:this.color(qh[t.axis]),depthTest:!1,transparent:!0,opacity:.8})),this.guide.renderOrder=19,this.guide.frustumCulled=!1,this.scene.add(this.guide)}this.guide.material.color.copy(this.color(qh[t.axis]));const e=this.guide.geometry.getAttribute("position"),n=$h[t.axis],s=[t.origin[0],t.origin[1],t.origin[2]],r=[t.origin[0],t.origin[1],t.origin[2]];s[n]-=5e4,r[n]+=5e4,e.setXYZ(0,s[0],s[1],s[2]),e.setXYZ(1,r[0],r[1],r[2]),e.needsUpdate=!0,this.requestRender()}refreshAxisDrag(){const t=this.drag;t?.type==="nodes"&&t.moved&&this.dragNodes(t,this.lastPointer)}selectInBox(t,e,n,s,r){this.camera.updateMatrixWorld();const o=Math.min(t,n),a=Math.max(t,n),l=Math.min(e,s),c=Math.max(e,s),h=r?new Set(this.selNodes):new Set;for(const[d,u]of this.nodeInfo){const p=u.body.pos;this.tmpV.set(p[0],p[1],p[2]).project(this.camera);const g=(this.tmpV.x*.5+.5)*this.width,_=(-this.tmpV.y*.5+.5)*this.height;this.tmpV.z>=-1&&this.tmpV.z<=1&&g>=o&&g<=a&&_>=l&&_<=c&&h.add(d)}this.setSelection({nodes:[...h]})}scheduleHover(){!this.config.interaction.hover||this.hoverRaf||(this.hoverRaf=requestAnimationFrame(()=>{this.hoverRaf=0,this.updateHover()}))}updateHover(){if(this.drag||this.disposed)return;const t=this.pick(this.lastPointer.x,this.lastPointer.y),e=t.kind==="node"?t.id:null,n=t.kind==="edge"?t.id:null;e!==this.hoverNode&&(this.dirtyNodes=!0),n!==this.hoverEdge&&(this.dirtyEdges=!0),(e!==this.hoverNode||n!==this.hoverEdge)&&(this.hoverNode=e,this.hoverEdge=n,this.events.emit("hover",{kind:t.kind,id:t.id}),this.showTooltip(t),this.requestRender());const s=t.kind==="node"?this._graph.getNode(t.id):t.kind==="edge"?this._graph.getEdge(t.id):void 0;this.canvas.style.cursor=this.tool==="connect"?"crosshair":s?.url?"pointer":""}hideTooltip(){this.tooltipEl.hidden=!0}showTooltip(t){const e=this.tooltipEl;if(!this.config.interaction.tooltip||t.kind===null){e.hidden=!0;return}e.replaceChildren();const n=(r,o)=>{const a=document.createElement("div");o&&(a.className=o),a.textContent=r,e.appendChild(a)},s=this._graph;if(t.kind==="node"){const r=s.getNode(t.id);if(!r)return;n(r.label??r.id,"gs-tt-title"),r.sublabel&&n(r.sublabel,"gs-tt-muted"),r.group&&n(r.group,"gs-tt-muted"),r.url&&n(r.url,"gs-tt-muted");for(const[o,a]of Object.entries(r.props??{}))n(`${o}: ${a}`,"gs-tt-muted")}else{const r=s.getEdge(t.id);if(!r)return;const o=a=>s.getNode(a)?.label??a;n(`${o(r.source)} ${s.isDirected(r)?"→":"—"} ${o(r.target)}`,"gs-tt-title"),n(`weight ${s.weightOf(r)}`,"gs-tt-muted"),r.label&&n(r.label),r.url&&n(r.url,"gs-tt-muted")}e.hidden=!1,this.moveTooltip(this.lastPointer)}moveTooltip(t){const e=this.tooltipEl;if(e.hidden)return;const n=14;let s=t.x+n,r=t.y+n;s+e.offsetWidth>this.width&&(s=Math.max(0,t.x-e.offsetWidth-n)),r+e.offsetHeight>this.height&&(r=Math.max(0,t.y-e.offsetHeight-n)),e.style.left=`${s}px`,e.style.top=`${r}px`}updateRubber(t,e){const n=this.nodeInfo.get(t);if(!n)return;const s=this.worldAt(e.x,e.y,n.body.pos)??n.body.pos;if(!this.rubber){const o=new Se;o.setAttribute("position",new Ie(new Float32Array(6),3));const a=new Da({color:this.color(this.config.selection.color),depthTest:!1,transparent:!0});this.rubber=new Eh(o,a),this.rubber.renderOrder=20,this.rubber.frustumCulled=!1,this.scene.add(this.rubber)}const r=this.rubber.geometry.getAttribute("position");r.setXYZ(0,n.body.pos[0],n.body.pos[1],n.body.pos[2]),r.setXYZ(1,s[0],s[1],s[2]),r.needsUpdate=!0,this.requestRender()}removeRubber(){this.rubber&&(this.scene.remove(this.rubber),this.rubber.geometry.dispose(),this.rubber.material.dispose(),this.rubber=null,this.requestRender())}openPanel(t,e){this.closePanel();const n=document.createElement("div");n.className="gs-panel gs-ui";const s=document.createElement("div");s.className="gs-panel-head";const r=document.createElement("span");r.className="gs-panel-title",r.textContent=e;const o=document.createElement("button");o.type="button",o.className="gs-btn",o.textContent="×",o.title="Close",o.setAttribute("aria-label","Close panel"),o.addEventListener("click",()=>this.closePanel()),s.append(r,o);const a=document.createElement("iframe");a.setAttribute("sandbox",this.config.links.panelSandbox),a.title=e,a.src=t,n.append(s,a),this.root.appendChild(n),this.panelEl=n}}const _0="0.1.0",Ja=new WeakMap;function v0(i){return Ja.get(i)}async function Zh(i){const t=await fetch(i);if(!t.ok)throw new Error(`${i}: HTTP ${t.status}`);return t.text()}async function Kh(i=document){const t=[],e=Array.from(i.querySelectorAll("[data-graphscape]"));return await Promise.all(e.map(async n=>{if(!Ja.has(n))try{let s={};n.dataset.config&&(s=JSON.parse(await Zh(n.dataset.config))),n.dataset.theme&&(s={...s,theme:n.dataset.theme}),(n.dataset.dimension==="2d"||n.dataset.dimension==="3d")&&(s={...s,dimension:n.dataset.dimension}),ss(s);const r=new jh(n,s);if(Ja.set(n,r),n.dataset.src){const o=await Zh(n.dataset.src),{graph:a}=Sl(o,{filename:n.dataset.src,directed:n.dataset.directed==="true"});r.load(a)}t.push(r)}catch(s){const r=document.createElement("div");r.className="gs-error",r.textContent=`Graphscape: ${s.message}`,n.appendChild(r)}})),t}if(typeof document<"u"){const i=()=>void Kh();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i()}return mt.DEFAULT_CONFIG=Nr,mt.DEFAULT_LAYOUT_OPTIONS=Kr,mt.DEFAULT_WEIGHT=1,mt.Emitter=Ur,mt.FORMATS=yl,mt.ForceSimulation=Yr,mt.Graph=Ls,mt.GraphView=jh,mt.LAYOUT_NAMES=Fd,mt.NODE_SHAPES=Ve,mt.autoInit=Kh,mt.buildGroupIndex=Fr,mt.circleLayout=Ul,mt.computeLayout=Bl,mt.createConfig=ss,mt.defaultCss=Wh,mt.defineConfig=hd,mt.detectFormat=Ml,mt.estimateTextBox=ls,mt.generateClustered=ad,mt.generateMixedNetwork=ld,mt.geometry=Ud,mt.getInstance=v0,mt.gridLayout=Nl,mt.injectStyles=Xh,mt.layeredLayout=Il,mt.mergeConfig=_i,mt.nodeBoxes=Dl,mt.parseCsv=sl,mt.parseDot=ll,mt.parseGml=ul,mt.parseGraph=Sl,mt.parseGraphML=ml,mt.parseJson=vl,mt.placeNewNodes=Jr,mt.randomLayout=Fl,mt.registerTheme=cd,mt.resolveEdgeStyle=il,mt.resolveNodeStyle=zr,mt.resolveUrl=el,mt.serializeCsv=ol,mt.serializeDot=cl,mt.serializeGml=fl,mt.serializeGraph=Dd,mt.serializeGraphML=gl,mt.serializeJson=xl,mt.sphereLayout=Ol,mt.themes=Or,mt.treeLayout=zl,mt.version=_0,Object.defineProperty(mt,Symbol.toStringTag,{value:"Module"}),mt}({});
//# sourceMappingURL=graphscape.standalone.js.map
