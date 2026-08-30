// P-91 deep dive: run the LIVE iframe script (buildAppHtml) in a DOM shim and
// deliver recorded host messages. Self-tests in both directions. No deploy.
// Snapshot: reads P:/tmp/legacy-design-tools-p91-stone mcp-app.ts (dirty tree).
import { pathToFileURL } from "node:url";

const SRC = "P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp/src/mcp-app.ts";
const mod = await import(pathToFileURL(SRC).href);
const html = mod.buildAppHtml();
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) throw new Error("no script block");
const script = m[1];

function makeEl(id) {
  const el = {
    id,
    attrs: {},
    innerHTML: "",
    textContent: "",
    className: "",
    style: {},
    scrollHeight: 500,
    parentNode: null,
    children: [],
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return this.attrs[k] ?? null; },
    addEventListener() {},
    querySelector() { return null; },
    appendChild(c) { c.parentNode = this; this.children.push(c); return c; },
    closest() { return null; },
  };
  return el;
}

function boot() {
  const boot = makeEl("boot");
  const root = makeEl("root");
  const body = makeEl("body");
  const docEl = makeEl("html");
  const document = {
    getElementById(id) { return id === "boot" ? boot : id === "root" ? root : null; },
    body,
    documentElement: docEl,
    createElement(tag) { return makeEl(tag); },
  };
  const outbound = [];
  const parent = { postMessage(msg) { outbound.push(msg); } };
  const listeners = [];
  const window = { addEventListener(type, fn) { if (type === "message") listeners.push(fn); } };
  const timers = [];
  let tid = 0;
  const setTimeout = (fn, ms) => { const id = ++tid; timers.push({ id, fn, ms, cleared: false }); return id; };
  const clearTimeout = (id) => { const t = timers.find((x) => x.id === id); if (t) t.cleared = true; };
  const requestAnimationFrame = (fn) => { fn(); };
  const run = new Function("document", "parent", "window", "setTimeout", "clearTimeout", "requestAnimationFrame", script);
  run(document, parent, window, setTimeout, clearTimeout, requestAnimationFrame);
  const deliver = (data) => { for (const fn of listeners) fn({ data }); };
  const fire = (ms) => {
    const live = timers.filter((t) => !t.cleared && t.ms === ms);
    for (const t of live) { t.cleared = true; t.fn(); }
    return live.length;
  };
  return { boot, root, window, outbound, deliver, fire, timers };
}

const gold = JSON.stringify({
  parcelNodeId: "48021:34137",
  draw: {
    label: "908 PINE , BASTROP, TX 78602",
    ring: [[0, 0], [100, 0], [100, 60], [0, 60]],
    edges: [{ i: 0, role: "front", road: "PINE", ft: 100 }, { i: 1, neighbor: "48021:34169", ft: 60 }],
    overlays: [{ id: "envelope", state: "refused", label: "Envelope", reason: "atom_path_pending" }],
  },
});
const miss = JSON.stringify({ parcels: [], notFound: ["48021:900099"] });
const board = JSON.stringify({
  id: "4316b571-c7d2-4b9f-9e50-4f7a16dbfa94",
  rows: [
    { query: "908 Pine, Bastrop TX", parcelNodeId: "48021:34137", resolution: "resolved", stub: {} },
    { query: "48021:34169", parcelNodeId: "48021:34169", resolution: "resolved", stub: {} },
    { query: "48021:900099", parcelNodeId: "48021:900099", resolution: "resolved", stub: {} },
  ],
});
const toolResult = (text) => ({ jsonrpc: "2.0", method: "ui/notifications/tool-result", params: { content: [{ type: "text", text }] } });
const initReply = { jsonrpc: "2.0", id: 1, result: { protocolVersion: "2026-01-26", hostCapabilities: { message: {} } } };

const results = [];
function check(name, cond, detail) { results.push({ name, pass: !!cond, detail }); }

// ---- Fixture 1: positive control. Fresh iframe + gold tool-result paints a parcel.
{
  const f = boot();
  f.deliver(initReply);
  f.deliver(toolResult(gold));
  check("F1 gold paints ring", f.root.innerHTML.includes('aria-label="parcel ring"'), f.root.innerHTML.slice(0, 160));
  check("F1 gold envelope human", f.root.innerHTML.includes("Withheld, setbacks unruled"));
  check("F1 gold no machine reason", !f.root.innerHTML.includes("atom_path_pending"));
}

// ---- Fixture 2: PRE-REGISTERED. Fresh iframe (no Open clicked here) receives the p554 miss.
// Prediction: paints EMPTY_BOARD_TITLE, never NOT_ON_FILE. If NOT_ON_FILE appears, mechanism C is wrong.
{
  const f = boot();
  f.deliver(initReply);
  f.deliver(toolResult(miss));
  const h = f.root.innerHTML;
  check("F2 fresh-iframe miss paints NOT_ON_FILE? (prediction: NO)", h.includes(mod.NOT_ON_FILE), h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  check("F2 fresh-iframe miss paints EMPTY_BOARD_TITLE (prediction: YES)", h.includes(mod.EMPTY_BOARD_TITLE));
}

// ---- Fixture 3: board iframe. Open click, host acks ui/message with {}, timer, then late miss.
{
  const f = boot();
  f.deliver(initReply);
  f.deliver(toolResult(board));
  check("F3 board painted 3 rows", (f.root.innerHTML.match(/data-act="open"/g) || []).length === 3);
  f.window.__ss.open({ getAttribute: () => "48021:900099" });
  const uiMsg = f.outbound.find((x) => x.method === "ui/message");
  check("F3 ui/message posted with id", uiMsg && uiMsg.id != null, JSON.stringify(uiMsg && { id: uiMsg.id, text: uiMsg.params.content[0].text.slice(0, 60) }));
  f.deliver({ jsonrpc: "2.0", id: uiMsg.id, result: {} });
  check("F3 boot reply=ok after ack", f.boot.textContent.includes("reply=ok"), f.boot.textContent);
  check("F3 no fail line right after ack", !f.root.innerHTML.includes(mod.OPEN_DID_NOT_REACH_ME));
  const fired = f.fire(mod.OPEN_DEAD_MS);
  check("F3 12s timer still armed after ack (prediction: YES, fires)", fired === 1, `fired=${fired}`);
  check("F3 board paints OPEN_DID_NOT_REACH_ME after ack+12s", f.root.innerHTML.includes(mod.OPEN_DID_NOT_REACH_ME));
  // Hypothetical: the host DID route the miss into this same iframe.
  f.deliver(toolResult(miss));
  check("F3 same-iframe late miss paints NOT_ON_FILE", f.root.innerHTML.includes(mod.NOT_ON_FILE), f.root.innerHTML.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200));
  check("F3 same-iframe late miss drops the board rows (kind empty)", !f.root.innerHTML.includes('data-act="open"'));
}

// ---- Fixture 4: board iframe, gold Open, ack, 12s, then late gold (same-iframe hypothetical).
{
  const f = boot();
  f.deliver(initReply);
  f.deliver(toolResult(board));
  f.window.__ss.open({ getAttribute: () => "48021:34137" });
  const uiMsg = f.outbound.find((x) => x.method === "ui/message");
  f.deliver({ jsonrpc: "2.0", id: uiMsg.id, result: {} });
  f.fire(mod.OPEN_DEAD_MS);
  check("F4 gold Open on board: dead-Open painted after ack+12s too", f.root.innerHTML.includes(mod.OPEN_DID_NOT_REACH_ME));
}

// ---- Fixture 5: not-vacuous. Garbage tool-result must not paint a parcel or a miss sentence.
{
  const f = boot();
  f.deliver(initReply);
  f.deliver(toolResult("not json"));
  check("F5 garbage does not paint ring", !f.root.innerHTML.includes("parcel ring"));
  check("F5 garbage does not paint NOT_ON_FILE", !f.root.innerHTML.includes(mod.NOT_ON_FILE));
  // and an unrelated window message with result.content is accepted (origin unchecked)
  const g = boot();
  g.deliver(initReply);
  g.deliver({ result: { content: [{ type: "text", text: gold }] } });
  check("F5b bare {result.content} from any window repaints panel (origin unchecked)", g.root.innerHTML.includes("parcel ring"));
}

for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n       ${r.detail}` : ""}`);
console.log(`\n${results.filter((r) => r.pass).length}/${results.length} checks passed. APP_RESOURCE_URI=${mod.APP_RESOURCE_URI}`);
