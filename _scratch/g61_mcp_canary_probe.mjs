/**
 * G-61 tagged MCP probe. Mints a public probe key, revokes it. Does not print secrets.
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const MCP = "https://g61---hauska-mcp-server-h7gvu7rgcq-uc.a.run.app";
const GCLOUD =
  "C:\\Users\\cente\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd";
const ADMIN = execSync(
  `"${GCLOUD}" secrets versions access latest --secret=HAUSKA_ADMIN_BOOTSTRAP_KEY --project=hauska-prod-497015`,
  { encoding: "utf8" },
).trim();

async function mcp(method, params, key) {
  const res = await fetch(`${MCP}/mcp`, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      ...(key ? { "X-Hauska-Key": key } : {}),
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: "g61", method, params }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    const m = text.match(/data:\s*(\{[\s\S]*\})/);
    if (m) {
      try {
        json = JSON.parse(m[1]);
      } catch {
        json = { _raw: text.slice(0, 500) };
      }
    } else {
      json = { _raw: text.slice(0, 500) };
    }
  }
  return { status: res.status, json };
}

function toolText(json) {
  const c = json?.result?.content?.[0]?.text;
  return typeof c === "string" ? c.slice(0, 800) : JSON.stringify(json).slice(0, 800);
}

const out = { mcp: MCP, ts: new Date().toISOString() };

const healthRes = await fetch(`${MCP}/health`);
out.health = { status: healthRes.status, body: await healthRes.json() };

const listed = await mcp("tools/list", {});
const names = (listed.json?.result?.tools ?? []).map((t) => t.name);
out.toolsList = {
  status: listed.status,
  hasListLenses: names.includes("dashboards_list_lenses"),
  hasGetPack: names.includes("dashboards_get_city_pack"),
  toolCount: names.length,
};

const listLenses = await mcp("tools/call", { name: "dashboards_list_lenses", arguments: {} });
out.listLensesAnon = {
  status: listLenses.status,
  isError: listLenses.json?.result?.isError === true,
  text: toolText(listLenses.json),
};

const packAnon = await mcp("tools/call", {
  name: "dashboards_get_city_pack",
  arguments: { cityKey: "template-city" },
});
out.getPackAnon = {
  status: packAnon.status,
  isError: packAnon.json?.result?.isError === true,
  text: toolText(packAnon.json),
};

const mintRes = await fetch(`${MCP}/admin/keys`, {
  method: "POST",
  headers: {
    "X-Hauska-Admin-Key": ADMIN,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    tier: "developer_pro",
    product: "public",
    owner_email: "g61-probe@hauska.dev",
    notes: "G-61 canary probe — revoke after",
  }),
});
const minted = await mintRes.json();
if (mintRes.status !== 201) {
  out.mint = { status: mintRes.status, error: minted };
} else {
  out.mint = { status: 201, key_id: minted.key_id ?? minted.id ?? "present" };
  const key = minted.raw_key ?? minted.key ?? minted.api_key ?? minted.token;
  const packId = await mcp(
    "tools/call",
    { name: "dashboards_get_city_pack", arguments: { cityKey: "template-city" } },
    key,
  );
  out.getPackIdentified = {
    status: packId.status,
    isError: packId.json?.result?.isError === true,
    text: toolText(packId.json),
  };
  const kid = minted.key_id ?? minted.id;
  if (kid) {
    const rev = await fetch(`${MCP}/admin/keys/${kid}`, {
      method: "DELETE",
      headers: { "X-Hauska-Admin-Key": ADMIN },
    });
    out.revoke = { status: rev.status };
  }
}

writeFileSync("P:/doc_repo/_scratch/g61_mcp_canary_probe.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
