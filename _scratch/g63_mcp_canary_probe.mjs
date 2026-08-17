import { writeFileSync } from "node:fs";

const mcp = process.argv[2] || "https://g63---hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/mcp";
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

function envelopeData(parsed) {
  const inner = parsed?.result?.content?.[0]?.text;
  if (typeof inner !== "string") return inner;
  try {
    return JSON.parse(inner);
  } catch {
    return inner;
  }
}

const init = await rpc({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "g63-probe", version: "0" },
  },
});
const sid = init.headers["mcp-session-id"];
const sess = sid ? { "mcp-session-id": sid } : {};
await rpc({ jsonrpc: "2.0", method: "notifications/initialized" }, sess);

const kindsCall = await rpc(
  {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: { name: "dashboards_list_adapter_kinds", arguments: {} },
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

const kindsParsed = sseJson(kindsCall.text);
const kindsEnv = envelopeData(kindsParsed);
const kinds = kindsEnv?.data?.kinds || kindsEnv?.kinds || [];
const ids = Array.isArray(kinds) ? kinds.map((k) => k.id) : [];
const samsara = Array.isArray(kinds) ? kinds.find((k) => k.id === "samsara") : null;
const dumped = JSON.stringify(kindsEnv || kindsParsed);

const out = {
  mcp,
  initStatus: init.status,
  session: Boolean(sid),
  kindsHttp: kindsCall.status,
  kindsIsError: kindsParsed?.result?.isError === true,
  kindIds: ids,
  samsaraWritesTo: samsara?.writesTo,
  pipedrivePresent: ids.includes("pipedrive") || dumped.includes("pipedrive"),
  credentialLeak: /api[_-]?key|secret|password|Bearer /i.test(dumped),
  packAnonIsError: sseJson(packAnon.text)?.result?.isError === true,
};
writeFileSync("P:/doc_repo/_scratch/g63_mcp_canary_probe.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
