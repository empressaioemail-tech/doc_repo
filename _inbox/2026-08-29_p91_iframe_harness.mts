/*
 * Read-only instrument for the P-91 mcp-app review.
 * Executes the INLINE script of buildAppHtml() (the served iframe code) in a
 * fake DOM under node:vm, drives it with postMessage-shaped events and fake
 * timers, and reads back what root.innerHTML would paint.
 * Self-tests in both directions first (a positive that must pass and a
 * negative that must fail) so the instrument is shown to be able to fail.
 */
import vm from "node:vm";
import { pathToFileURL } from "node:url";

const SRC = "P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp/src/mcp-app.ts";
const mod: any = await import(pathToFileURL(SRC).href);
const { buildAppHtml, parseToolResult, NOT_ON_FILE, OPEN_DID_NOT_REACH_ME, EMPTY_BOARD_TITLE, OPEN_DEAD_MS } = mod;

const html: string = buildAppHtml();
const script = html.slice(html.indexOf("<script>") + 8, html.indexOf("</script>"));

type El = ReturnType<typeof el>;
function el() {
  const attrs: Record<string, string> = {};
  return {
    attrs,
    style: {} as Record<string, string>,
    innerHTML: "",
    textContent: "",
    className: "",
    scrollHeight: 500,
    setAttribute(k: string, v: unknown) { attrs[k] = String(v); },
    getAttribute(k: string) { return k in attrs ? attrs[k] : null; },
    querySelector() { return null; },
    addEventListener() {},
    appendChild() {},
  };
}

function fresh() {
  const boot = el(), root = el(), body = el(), docEl = el();
  let msgHandler: ((ev: { data: unknown }) => void) | null = null;
  const posted: any[] = [];
  const timers = new Map<number, { fn: Function; ms: number }>();
  let tid = 0;
  const sandbox: any = {
    document: {
      getElementById: (id: string) => (id === "boot" ? boot : id === "root" ? root : null),
      body,
      documentElement: docEl,
      createElement: () => el(),
    },
    parent: { postMessage: (m: any) => posted.push(m) },
    setTimeout: (fn: Function, ms: number) => { const id = ++tid; timers.set(id, { fn, ms }); return id; },
    clearTimeout: (id: number) => { timers.delete(id); },
    requestAnimationFrame: (fn: Function) => { fn(); return 0; },
    addEventListener: (type: string, fn: any) => { if (type === "message") msgHandler = fn; },
    console,
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  const deliver = (data: unknown) => { if (!msgHandler) throw new Error("no message handler bound"); msgHandler({ data }); };
  const fire = (ms: number) => {
    let n = 0;
    for (const [id, t] of [...timers]) { if (t.ms === ms) { timers.delete(id); t.fn(); n++; } }
    return n;
  };
  const text = () => root.innerHTML.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const init = () => deliver({ jsonrpc: "2.0", id: 1, result: { hostCapabilities: { message: true } } });
  const toolResult = (payload: unknown) =>
    deliver({ jsonrpc: "2.0", method: "ui/notifications/tool-result", params: { content: [{ type: "text", text: JSON.stringify(payload) }] } });
  const open = (node: string) => sandbox.__ss.open({ getAttribute: (k: string) => (k === "data-node" ? node : null) });
  return { boot, root, posted, timers, deliver, fire, text, init, toolResult, open };
}

const BOARD = { id: "screen-1", rows: [
  { query: "908 PINE , BASTROP, TX 78602", parcelNodeId: "48021:34137", resolution: "resolved", stub: { situs: "present", envelope: "refused" } },
  { query: "zzzz-not-a-situs-99999", parcelNodeId: null, resolution: "unresolved" },
] };
const PARCEL = { parcelNodeId: "48021:34137", draw: { label: "908 PINE , BASTROP, TX 78602", ring: [[48.6, 83.94], [-50.37, 83.7], [-49.07, -84.28], [50.84, -83.36]], overlays: [{ id: "flood", state: "present", label: "Zone X" }] } };
const MISS = { parcels: [], notFound: ["48021:900099"] };

let failures = 0;
function check(name: string, got: boolean, want: boolean, detail?: string) {
  const ok = got === want;
  if (!ok) failures++;
  console.log(`${ok ? "OK  " : "FAIL"} ${name}: got=${got} want=${want}${detail ? "\n      " + detail : ""}`);
}

console.log("=== SELF-TEST (instrument must be able to fail) ===");
{
  const f = fresh(); f.init(); f.toolResult(PARCEL);
  check("positive: parcel paint shows node + label", f.text().includes("48021:34137") && f.text().includes("908 PINE"), true, f.text());
  const negativeResult = f.text().includes("NEVER_THERE_STRING");
  console.log(`${negativeResult === false ? "OK  " : "FAIL"} negative: a string that is not painted is reported absent (instrument can fail): got=${negativeResult}`);
  if (negativeResult !== false) failures++;
}

console.log("\n=== S1 fresh iframe receives the county miss via ui/notifications/tool-result ===");
{
  const f = fresh(); f.init(); f.toolResult(MISS);
  console.log("      visible: " + JSON.stringify(f.text()));
  check("S1 paints NOT_ON_FILE", f.text().includes(NOT_ON_FILE), false);
  check("S1 paints OPEN_DID_NOT_REACH_ME", f.text().includes(OPEN_DID_NOT_REACH_ME), false);
  check("S1 paints EMPTY_BOARD_TITLE ('No screen yet')", f.text().includes(EMPTY_BOARD_TITLE), true);
  check("S1 mentions the notFound id anywhere", f.root.innerHTML.includes("48021:900099"), false);
}

console.log("\n=== S2 board iframe: Open, host acks {result:{}} (reply=ok, no content), 12s elapses ===");
{
  const f = fresh(); f.init(); f.toolResult(BOARD);
  check("S2 board painted with Open button", f.root.innerHTML.includes('data-act="open"'), true);
  f.open("48021:34137");
  const msg = f.posted.find((m) => m.method === "ui/message");
  check("S2 ui/message posted with id 2", !!msg && msg.id === 2, true, JSON.stringify(msg && { id: msg.id, text: msg.params.content[0].text }));
  f.deliver({ jsonrpc: "2.0", id: 2, result: {} });
  check("S2 boot shows reply=ok after ack", f.boot.textContent.includes("reply=ok"), true, f.boot.textContent);
  const pendingOpenTimers = [...f.timers.values()].filter((t) => t.ms === OPEN_DEAD_MS).length;
  check("S2 12s timer still armed after reply=ok ack (should be 0 if ack cleared it)", pendingOpenTimers, 1);
  check("S2 board shows any fail line immediately after ack", f.root.innerHTML.includes('class="fail"'), false);
  f.fire(OPEN_DEAD_MS);
  console.log("      visible after 12s: " + JSON.stringify(f.text().slice(0, 140)));
  check("S2 paints OPEN_DID_NOT_REACH_ME although host replied ok", f.text().includes(OPEN_DID_NOT_REACH_ME), true);
  check("S2 boot still says reply=ok at the same time", f.boot.textContent.includes("reply=ok"), true, f.boot.textContent);
}

console.log("\n=== S3 same iframe: Open then a miss tool-result lands HERE (hypothetical same-frame host) ===");
{
  const f = fresh(); f.init(); f.toolResult(BOARD); f.open("48021:34137");
  f.deliver({ jsonrpc: "2.0", id: 2, result: {} });
  f.toolResult(MISS);
  console.log("      visible: " + JSON.stringify(f.text().slice(0, 160)));
  check("S3 paints NOT_ON_FILE", f.text().includes(NOT_ON_FILE), true);
  check("S3 board rows survived the miss (kind=empty replaces model)", f.root.innerHTML.includes("48021:34137"), false);
  f.toolResult(BOARD);
  check("S3 stale NOT_ON_FILE survives a later successful board paint", f.text().includes(NOT_ON_FILE), true, f.text().slice(0, 120));
  f.toolResult(PARCEL);
  check("S3 parcel paint hides it", f.text().includes(NOT_ON_FILE), false);
  f.toolResult(BOARD);
  check("S3 ...and it comes back on the next board paint", f.text().includes(NOT_ON_FILE), true);
}

console.log("\n=== S4 dead Open (timer fired) then an unrelated board paint ===");
{
  const f = fresh(); f.init(); f.toolResult(BOARD); f.open("48021:34137");
  f.fire(OPEN_DEAD_MS);
  check("S4 DNR painted", f.text().includes(OPEN_DID_NOT_REACH_ME), true);
  f.toolResult(BOARD);
  check("S4 a fresh BOARD paint after DNR is relabelled NOT_ON_FILE", f.text().includes(NOT_ON_FILE), true, f.text().slice(0, 120));
}

console.log("\n=== S5 injection from a non-parent window (no ev.source/origin check) + attribute escaping ===");
{
  const f = fresh(); f.init(); f.toolResult(BOARD);
  const evil = { id: "s", rows: [{ query: "q", parcelNodeId: '48021:x" data-pwn="1', resolution: "resolved", stub: { situs: 'present" onmouseover="alert(1)' } }] };
  f.deliver({ result: { content: [{ type: "text", text: JSON.stringify(evil) }] } });
  check("S5 bare {result:{content}} from anyone repaints the board", f.root.innerHTML.includes("data-pwn"), true);
  check("S5 double quote in parcelNodeId breaks out of data-node attr", f.root.innerHTML.includes('data-node="48021:x" data-pwn="1"'), true);
  check("S5 rail state lands unescaped in glyph title/class", f.root.innerHTML.includes('onmouseover="alert(1)"'), true);
  const m = f.root.innerHTML.match(/<span class="g g-[^"]*" title="[^"]*"[^>]*>/);
  console.log("      glyph markup: " + (m ? m[0] : "(none)"));
}

console.log("\n=== S6 unrecognised rail state paints as a bare bordered square (looks like absent-verified) ===");
{
  const f = fresh(); f.init();
  f.toolResult({ id: "s", rows: [{ query: "q", parcelNodeId: "48021:1", resolution: "resolved", stub: { situs: "pending", zoning: "absent", flood: 7 } }] });
  const m = f.root.innerHTML.match(/class="g g-[^"]*"/g);
  console.log("      classes: " + JSON.stringify(m));
  check("S6 inline parse passes 'pending' through (no whitelist)", f.root.innerHTML.includes('g-pending'), true);
  check("S6 numeric 7 passes through", f.root.innerHTML.includes('g-7'), true);
  const exported = parseToolResult(JSON.stringify({ id: "s", rows: [{ query: "q", parcelNodeId: "48021:1", resolution: "resolved", stub: { situs: "pending", zoning: "absent", flood: 7 } }] }));
  console.log("      exported parseToolResult rails: " + JSON.stringify(exported.rows[0].rails));
}

console.log("\n=== S7 a tool-result whose first content part has no .text wipes the board ===");
{
  const f = fresh(); f.init(); f.toolResult(BOARD);
  f.deliver({ jsonrpc: "2.0", method: "ui/notifications/tool-result", params: { content: [{ type: "image", data: "AAAA", mimeType: "image/png" }] } });
  check("S7 board replaced by 'No screen yet'", f.text().includes(EMPTY_BOARD_TITLE) && !f.root.innerHTML.includes("48021:34137"), true, f.text().slice(0, 100));
}

console.log("\n=== S8 rows non-array throws inside the listener before clearOpenTimer ===");
{
  const f = fresh(); f.init(); f.toolResult(BOARD); f.open("48021:34137");
  let threw = "";
  try { f.toolResult({ rows: "abc" }); } catch (e: any) { threw = String(e && e.message); }
  check("S8 listener throws", threw.length > 0, true, threw);
  check("S8 12s timer still armed after the throw", [...f.timers.values()].some((t) => t.ms === OPEN_DEAD_MS), true);
}

console.log("\n=== S9 prototype-key id enters the pendingMsg branch ===");
{
  const f = fresh(); f.init();
  f.deliver({ jsonrpc: "2.0", id: "constructor", result: { content: [{ type: "text", text: JSON.stringify(BOARD) }] } });
  check("S9 boot shows reply=ok for an id the app never issued", f.boot.textContent.includes("reply=ok"), true, f.boot.textContent);
}

console.log("\n=== S10 init-id collision: a host request with id 1 (no result/error) ===");
{
  const f = fresh();
  f.deliver({ jsonrpc: "2.0", id: 1, method: "ui/some-request", params: {} });
  check("S10 handshake stays 'wait' (guard holds)", f.boot.textContent.includes("handshake=wait"), true, f.boot.textContent);
  f.deliver({ jsonrpc: "2.0", id: "1", result: {} });
  check("S10 string id '1' with empty result completes handshake (caps=none)", f.boot.textContent.includes("handshake=ready"), true, f.boot.textContent);
}

console.log("\n=== S11 inline parse vs exported parseToolResult on the same fixtures ===");
{
  const start = script.indexOf("function parse(text){");
  const end = script.indexOf("function glyph(state){");
  const helpers = ["var RAILS=", "var NODE_RE=", "function ringFrom(", "function edgesFrom("].map((h) => {
    const s = script.indexOf(h);
    const e = script.indexOf("\n", h.startsWith("var") ? s : script.indexOf("\n  }\n", s) + 4);
    return h.startsWith("var") ? script.slice(s, e + 1) : script.slice(s, script.indexOf("\n", script.indexOf("return", s) + 1) + 1) + "}\n";
  });
  // simpler: pull the full function bodies by brace matching
  function fn(name: string) {
    const s = script.indexOf(name);
    let i = script.indexOf("{", s), depth = 0;
    for (; i < script.length; i++) { if (script[i] === "{") depth++; else if (script[i] === "}") { depth--; if (depth === 0) break; } }
    return script.slice(s, i + 1);
  }
  const rails = script.slice(script.indexOf("var RAILS="), script.indexOf("\n", script.indexOf("var RAILS=")));
  const nodeRe = script.slice(script.indexOf("var NODE_RE="), script.indexOf("\n", script.indexOf("var NODE_RE=")));
  const body = [rails, nodeRe, fn("function ringFrom(draw)"), fn("function edgesFrom(draw)"), script.slice(start, end), "return parse;"].join("\n");
  const inlineParse = new Function(body)();
  const fixtures: Record<string, unknown> = {
    miss: MISS,
    idFallback: { rows: [{ query: "a", id: "48021:1" }] },
    absentState: { rows: [{ query: "a", parcelNodeId: "48021:1", stub: { situs: "absent" } }] },
    emptyRow: { rows: [{}] },
    capsResolution: { rows: [{ query: "q", parcelNodeId: "48021:1", resolution: "Resolved" }] },
    junkState: { rows: [{ query: "q", parcelNodeId: "48021:1", stub: { situs: "pending" } }] },
    stringStub: { rows: [{ query: "q", parcelNodeId: "48021:1", stub: "present" }] },
    nanRing: { parcelNodeId: "48021:1", draw: { ring: [[1, 2], [NaN, 3], [4, 5]], overlays: [] } },
    numericId: { id: 7, rows: [{ query: "q", parcelNodeId: "48021:1" }] },
    overlayNoLabel: { parcelNodeId: "48021:1", draw: { overlays: [{ id: 5, state: 3 }] } },
  };
  for (const [name, fx] of Object.entries(fixtures)) {
    const a = JSON.stringify(inlineParse(JSON.stringify(fx)));
    const b = JSON.stringify(parseToolResult(JSON.stringify(fx)));
    console.log(`  ${a === b ? "same" : "DIFF"} ${name}\n      inline  : ${a}\n      exported: ${b}`);
  }
}

console.log(`\n=== DONE: ${failures} unexpected result(s) ===`);
