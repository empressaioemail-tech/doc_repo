// P-91: run the served iframe script against the p555 wire contract (plan 4.1/4.4).
// Usage: node iframe-instrument-p555.mjs [module-path]  (default: stone src/mcp-app.ts)
import { pathToFileURL } from "node:url";
const SRC = process.argv[2] || "P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp/src/mcp-app.ts";
const mod = await import(pathToFileURL(SRC).href);
const html = mod.buildAppHtml();
const m = html.match(/<script>([\s\S]*?)<\/script>/); if (!m) throw new Error("no script");
function makeEl(id){ return { id, attrs:{}, innerHTML:"", textContent:"", className:"", style:{}, scrollHeight:500, parentNode:null, children:[],
  setAttribute(k,v){this.attrs[k]=String(v)}, getAttribute(k){return this.attrs[k]??null}, addEventListener(){}, querySelector(){return null},
  appendChild(c){c.parentNode=this;this.children.push(c);return c}, closest(){return null} }; }
function boot(){
  const bootEl=makeEl("boot"), root=makeEl("root"), body=makeEl("body"), docEl=makeEl("html");
  const document={ getElementById:(id)=>id==="boot"?bootEl:id==="root"?root:null, body, documentElement:docEl, createElement:(t)=>makeEl(t) };
  const outbound=[]; const parent={ postMessage(msg){outbound.push(msg)} };
  const listeners=[]; const window={ parent, addEventListener(t,fn){ if(t==="message") listeners.push(fn) } };
  const timers=[]; let tid=0;
  const setTimeout=(fn,ms)=>{const id=++tid;timers.push({id,fn,ms,cleared:false});return id};
  const clearTimeout=(id)=>{const t=timers.find(x=>x.id===id); if(t) t.cleared=true};
  const run=new Function("document","parent","window","setTimeout","clearTimeout","requestAnimationFrame", m[1]);
  run(document,parent,window,setTimeout,clearTimeout,(fn)=>fn());
  const deliver=(data,source=parent)=>{ for(const fn of listeners) fn({data,source}) };
  const fire=(ms)=>{ const live=timers.filter(t=>!t.cleared&&t.ms===ms); for(const t of live){t.cleared=true;t.fn()} return live.length };
  return { bootEl, root, window, outbound, deliver, fire };
}
const text=(h)=>h.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const tr=(t)=>({jsonrpc:"2.0",method:"ui/notifications/tool-result",params:{content:[{type:"text",text:t}]}});
const init={jsonrpc:"2.0",id:1,result:{protocolVersion:"2026-01-26",hostCapabilities:{message:{}}}};
const gold=JSON.stringify({parcelNodeId:"48021:34137",draw:{label:"908 PINE",ring:[[0,0],[100,0],[100,60],[0,60]],edges:[{i:0,role:"front",road:"PINE",ft:100}],overlays:[{id:"envelope",state:"refused",label:"Envelope",reason:"atom_path_pending"}]}});
const missAbsent=JSON.stringify({parcels:[],notFound:["48021:900099"],reason:"parcel_not_found",parcelExists:false});
const missUnbaked=JSON.stringify({parcels:[],notFound:["48453:1"],reason:"baked_snapshot_not_found",parcelExists:"unmeasured"});
const refused=JSON.stringify({parcels:[],notFound:[],refused:[{parcelNodeId:"48021:34137",reason:"upgrade_required"}]});
const board=JSON.stringify({id:"s1",rows:[{query:"908 Pine",parcelNodeId:"48021:34137",resolution:"resolved",stub:{zoning:"present"},stubRead:"ok"},{query:"48021:900099",parcelNodeId:"48021:900099",resolution:"resolved"}]});
const R=[]; const check=(n,c,d)=>R.push({n,pass:!!c,d});
{ const f=boot(); f.deliver(init); f.deliver(tr(gold)); check("gold paints ring (positive control)", f.root.innerHTML.includes('aria-label="parcel ring"')); }
{ const f=boot(); f.deliver(init); f.deliver(tr(missAbsent)); const h=text(f.root.innerHTML); check("FRESH instance, absent miss -> Not on file in Bastrop", h.includes("Not on file in Bastrop"), h.slice(0,120)); check("  and not the empty copy", !h.includes(mod.EMPTY_BOARD_TITLE)); }
{ const f=boot(); f.deliver(init); f.deliver(tr(missUnbaked)); const h=text(f.root.innerHTML); check("FRESH instance, unbaked 48453 -> No baked snapshot yet, never Bastrop", h.includes("No baked snapshot yet") && !h.includes("Bastrop"), h.slice(0,120)); }
{ const f=boot(); f.deliver(init); f.deliver(tr(refused)); const h=text(f.root.innerHTML); check("FRESH instance, 402 -> Upgrade to open this parcel", h.includes("Upgrade to open this parcel"), h.slice(0,120)); }
{ const f=boot(); f.deliver(init); f.deliver(tr(board)); check("board: rails from stub at first paint (present glyph)", f.root.innerHTML.includes("g-present"));
  f.window.__ss.open({getAttribute:()=>"48021:900099"}); const msg=f.outbound.find(x=>x.method==="ui/message"); f.deliver({jsonrpc:"2.0",id:msg.id,result:{}});
  const h=text(f.root.innerHTML); check("board after ack -> Sent to chat, rows kept", h.includes("Sent to chat")&&f.root.innerHTML.includes('data-act="open"'), h.slice(0,100));
  const fired=f.fire(mod.OPEN_DEAD_MS); check("board: 12s timer cleared by ack (fires=0)", fired===0, `fired=${fired}`); check("board: no dead sentence after ack", !f.root.innerHTML.includes("Open did not reach me")); }
{ const f=boot(); f.deliver(init); f.deliver(tr(board)); f.window.__ss.open({getAttribute:()=>"48021:900099"}); const fired=f.fire(mod.OPEN_DEAD_MS); check("board: no reply in 12s -> Open did not reach me", fired===1 && f.root.innerHTML.includes("Open did not reach me")); }
{ const f=boot(); f.deliver(init); f.deliver(tr(board)); const before=f.root.innerHTML; f.deliver(tr(gold), {}); check("foreign source cannot repaint", f.root.innerHTML===before && f.bootEl.textContent.includes("foreign=1"), f.bootEl.textContent); }
{ const f=boot(); f.deliver(init); f.deliver(tr("not json")); const h=text(f.root.innerHTML); check("garbage -> Result not readable, no sentence, no ring", h.includes("Result not readable") && !h.includes("Not on file") && !f.root.innerHTML.includes("parcel ring")); }
for(const r of R) console.log(`${r.pass?"PASS":"FAIL"}  ${r.n}${r.d?`\n       ${r.d}`:""}`);
console.log(`\n${R.filter(r=>r.pass).length}/${R.length} passed. module=${SRC} URI=${mod.APP_RESOURCE_URI}`);
