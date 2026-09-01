#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const dir = "P:/doc_repo/_inbox/cad-serve-reconcile-live";
const files = fs.readdirSync(dir).filter((f) => f.startsWith("facets_") && f.endsWith(".json"));

const WORDS = new Set(["unmeasured", "unresolved", "pending", "unknown"]);
function walk(obj, p, acc) {
  if (obj == null) return;
  if (typeof obj === "string") {
    if (WORDS.has(obj)) acc.push({ path: p, value: obj });
    return;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) walk(v, p ? p + "." + k : k, acc);
  }
}

const rows = [];
const leaks = {};
let cadRollAny = 0;
let dollarAny = 0;
let livingWirePos = 0;
let livingWireNull = 0;
let yearWirePos = 0;

for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), "utf8").replace(/^\uFEFF/, "");
  const body = JSON.parse(raw);
  const words = [];
  walk(body, "", words);
  const bf = body.facets?.baseFacts || {};
  const sf = body.structuralFact || {};
  const cl = body.cityLimitsFact || {};
  const z = body.facets?.zoning || {};
  if (bf.cadRoll) cadRollAny++;
  if (bf.marketValue != null || bf.cadRoll?.marketValue != null) dollarAny++;
  if (sf.livingAreaSqft != null) livingWirePos++;
  else livingWireNull++;
  if (sf.yearBuilt != null) yearWirePos++;
  const row = {
    id: body.parcelNodeId,
    situs: bf.situsAddress || null,
    city: bf.situsCity || null,
    cadRoll: Boolean(bf.cadRoll),
    structuralState: sf.state || null,
    structuralLiving: sf.livingAreaSqft ?? null,
    structuralYear: sf.yearBuilt ?? null,
    landUseCode: body.landUseFact?.landUseCode ?? bf.landUse?.code ?? null,
    cityLimitsStatus: cl.status ?? null,
    etjStatus: cl.etjStatus ?? null,
    cityLimitsBasis: cl.basis ?? null,
    zoningVerdict: z.verdict ?? null,
    zoningAuthority: z.authority ?? null,
    zoningDistrict: z.district ?? null,
    pipelineWords: words,
  };
  rows.push(row);
  for (const w of words) {
    const k = w.path + "=" + w.value;
    leaks[k] = leaks[k] || { path: w.path, value: w.value, n: 0, counties: {}, examples: [] };
    leaks[k].n += 1;
    const fips = (body.parcelNodeId || "").split(":")[0];
    leaks[k].counties[fips] = (leaks[k].counties[fips] || 0) + 1;
    if (leaks[k].examples.length < 6) leaks[k].examples.push(body.parcelNodeId);
  }
}

const byCounty = {};
for (const r of rows) {
  const f = (r.id || "").split(":")[0];
  byCounty[f] = byCounty[f] || { n: 0, etjUnresolved: 0, clUnmeasured: 0, zoningUnmeasured: 0, livingPos: 0, yearPos: 0, cadRoll: 0 };
  byCounty[f].n++;
  if (r.etjStatus === "unresolved") byCounty[f].etjUnresolved++;
  if (r.cityLimitsStatus === "unmeasured") byCounty[f].clUnmeasured++;
  if (r.zoningVerdict === "unmeasured") byCounty[f].zoningUnmeasured++;
  if (r.structuralLiving != null) byCounty[f].livingPos++;
  if (r.structuralYear != null) byCounty[f].yearPos++;
  if (r.cadRoll) byCounty[f].cadRoll++;
}

fs.writeFileSync(
  "P:/doc_repo/_inbox/2026-09-01_cad-serve-reconcile_live_parse.json",
  JSON.stringify(
    {
      at: new Date().toISOString(),
      nFiles: files.length,
      cadRollAny,
      dollarAny,
      livingWirePos,
      livingWireNull,
      yearWirePos,
      byCounty,
      leaks,
      golds: rows.filter((r) =>
        [
          "48021:34137",
          "48021:8720522",
          "48209:135570",
          "48491:76149",
          "48453:493738",
          "48453:231086",
          "48309:176914",
          "48055:20478",
        ].includes(r.id)
      ),
    },
    null,
    2
  ) + "\n"
);
console.log("parsed", files.length, "leaks", Object.keys(leaks).length);
