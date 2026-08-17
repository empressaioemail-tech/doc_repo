/**
 * Live G-61 probes on Dashboards Cloud Run. Does not print secrets.
 */
import { writeFileSync } from "node:fs";

const KEY = String(process.env.DASHBOARDS_API_KEY || "").trim();
if (!KEY) throw new Error("DASHBOARDS_API_KEY env required");
const BASE = "https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app";

async function get(path, auth) {
  const res = await fetch(`${BASE}${path}`, {
    headers: auth ? { authorization: `Bearer ${KEY}` } : {},
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _raw: text.slice(0, 400) };
  }
  return { status: res.status, json };
}

const out = { base: BASE, ts: new Date().toISOString() };
out.health = await get("/health");
out.composeEmpty = await get("/api/lenses/city-manager/compose");
out.composeGold = await get(
  "/api/lenses/city-manager/compose?parcelNodeId=48021:34137&cityKey=template-city",
);
out.packsAnon = await get("/api/city-packs");
out.packsAuth = await get("/api/city-packs");
out.packsAuth = await get("/api/city-packs", true);
out.packOne = await get("/api/city-packs/template-city", true);
out.mounts = await get("/api/mounts");

const gold = out.composeGold.json || {};
out.composeGoldSummary = {
  status: out.composeGold.status,
  lensId: gold.lensId,
  cityKey: gold.cityKey,
  smartsiteHasParcel: String(gold.smartsite?.url || "").includes("parcelNodeId="),
  atoms: { status: gold.atoms?.status, basis: gold.atoms?.basis, atomCount: gold.atoms?.atomCount, types: gold.atoms?.types },
  files: { status: gold.filesRoom?.status, basis: gold.filesRoom?.basis, folderCount: gold.filesRoom?.folderCount },
  leakedBody: JSON.stringify(gold).includes("shouldNotLeak") || JSON.stringify(gold).includes("\"body\""),
};

writeFileSync("P:/doc_repo/_scratch/g61_dashboards_live_probe.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify({
  health: out.health,
  packsAnon: out.packsAnon.status,
  packsAuth: { status: out.packsAuth.status, keys: (out.packsAuth.json?.cityPacks || []).map((p) => p.cityKey) },
  packOneStoreHints: {
    cityKey: out.packOne.json?.cityPack?.cityKey,
    hasRepo: out.packOne.json?.cityPack ? "repo" in out.packOne.json.cityPack : null,
  },
  mountsServing: out.mounts.json?.mcp?.serving,
  composeEmpty: {
    status: out.composeEmpty.status,
    atoms: out.composeEmpty.json?.atoms?.status,
    basis: out.composeEmpty.json?.atoms?.basis,
    smartsiteUrl: out.composeEmpty.json?.smartsite?.url,
  },
  composeGold: out.composeGoldSummary,
}, null, 2));
