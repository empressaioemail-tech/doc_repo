import { writeFileSync } from "node:fs";

const mcp = "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/mcp";
const headers = {
  "content-type": "application/json",
  accept: "application/json, text/event-stream",
};

async function rpc(body, extra = {}) {
  const r = await fetch(mcp, {
    method: "POST",
    headers: { ...headers, ...extra },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  return { status: r.status, headers: Object.fromEntries(r.headers), text };
}

function sseJson(text) {
  const line = text.split("\n").find((l) => l.startsWith("data:"));
  if (!line) return text;
  try {
    return JSON.parse(line.slice(5).trim());
  } catch {
    return text;
  }
}

const init = await rpc({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "g62-probe", version: "0" },
  },
});
const sid = init.headers["mcp-session-id"];
const sess = sid ? { "mcp-session-id": sid } : {};
await rpc({ jsonrpc: "2.0", method: "notifications/initialized" }, sess);

const call = await rpc(
  {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "dashboards_compose_city_manager",
      arguments: {
        parcel_node_id: "48021:34137",
        city_key: "template-city",
      },
    },
  },
  sess,
);
const packAnon = await rpc(
  {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "dashboards_get_city_pack",
      arguments: { cityKey: "template-city" },
    },
  },
  sess,
);
const healthRes = await fetch(
  "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/health",
);
const health = { status: healthRes.status, json: await healthRes.json() };
const parsed = sseJson(call.text);
const inner = parsed?.result?.content?.[0]?.text;
let compose = inner;
try {
  compose = typeof inner === "string" ? JSON.parse(inner) : inner;
} catch {
  compose = inner;
}
const types = compose?.data?.atoms?.types || compose?.atoms?.types || [];
const out = {
  healthStatus: health.status,
  healthOk: health.json?.status,
  initStatus: init.status,
  session: Boolean(sid),
  composeHttp: call.status,
  composeIsError: parsed?.result?.isError === true,
  ownerFact: Array.isArray(types) ? types.includes("owner-fact") : String(inner).includes("owner-fact"),
  types,
  atomCount: compose?.data?.atoms?.atomCount ?? compose?.atoms?.atomCount,
  filesStatus: compose?.data?.filesRoom?.status ?? compose?.filesRoom?.status,
  filesBasis: compose?.data?.filesRoom?.basis ?? compose?.filesRoom?.basis,
  packAnonIsError: sseJson(packAnon.text)?.result?.isError === true,
  packAnonText: String(sseJson(packAnon.text)?.result?.content?.[0]?.text || "").slice(0, 200),
};
writeFileSync("P:/doc_repo/_scratch/g62_mcp_serving_probe.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
