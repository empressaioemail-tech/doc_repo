#!/usr/bin/env node
// Live /facets sweep. READ ONLY. Area blocks, not random.
import fs from "node:fs";

const blocks = JSON.parse(
  fs.readFileSync("P:/doc_repo/_inbox/2026-09-01_cad-serve-reconcile_area_blocks.json", "utf8")
);

function pick(block) {
  const rows = block.rows;
  if (block.fips === "48021") {
    return rows.filter((r) => /9\d{2} PINE(\s|,|$)/i.test(r.situs || ""));
  }
  if (block.fips === "48309") {
    return rows.filter((r) => /420[048] BEVERLY/i.test(r.situs || ""));
  }
  if (block.fips === "48491") {
    return rows.filter((r) => /180[0-9] DAVIS/i.test(r.situs || ""));
  }
  return rows;
}

const forced = [
  "48021:34137",
  "48021:8720522",
  "48209:135570",
  "48491:76149",
  "48453:493738",
  "48453:231086",
  "48309:176914",
  "48055:20478",
];

const selected = new Map();
for (const id of forced) selected.set(id, { reason: "gold" });
for (const b of blocks.blocks) {
  for (const r of pick(b)) {
    const id = r.place_key.replace(/^node:/, "");
    if (!selected.has(id)) selected.set(id, { reason: "block", ...r });
  }
}

function extract(body) {
  const f = body.facets || {};
  const bf = f.baseFacts || {};
  const sf = body.structuralFact || {};
  const cl = body.cityLimitsFact || {};
  const z = f.zoning || {};
  const words = [];
  const walk = (obj, p) => {
    if (obj == null) return;
    if (typeof obj === "string") {
      if (["unmeasured", "unresolved", "pending", "unknown"].includes(obj)) {
        words.push({ path: p, value: obj });
      }
      return;
    }
    if (typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) walk(v, p ? p + "." + k : k);
    }
  };
  walk(body, "");
  return {
    parcelNodeId: body.parcelNodeId,
    snapshotAt: body.snapshotAt,
    situs: bf.situsAddress || null,
    city: bf.situsCity || null,
    cadRoll: Boolean(bf.cadRoll),
    marketValue: bf.marketValue ?? bf.cadRoll?.marketValue ?? null,
    livingBake: bf.livingAreaSqft ?? bf.cadRoll?.livingAreaSqft ?? null,
    structuralLiving: sf.livingAreaSqft ?? null,
    structuralYear: sf.yearBuilt ?? null,
    structuralState: sf.state ?? null,
    landUseCode: body.landUseFact?.landUseCode ?? bf.landUse?.code ?? null,
    cityLimitsStatus: cl.status ?? null,
    etjStatus: cl.etjStatus ?? null,
    cityLimitsBasis: cl.basis ?? null,
    zoningVerdict: z.verdict ?? null,
    zoningAuthority: z.authority ?? null,
    zoningDistrict: z.district ?? null,
    pipelineWords: words,
  };
}

const out = [];
for (const [id, meta] of selected) {
  const enc = id.replace(":", "%3A");
  const url = `https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/node/${enc}/facets`;
  const t0 = Date.now();
  try {
    const res = await fetch(url);
    const json = await res.json();
    out.push({
      id,
      reason: meta.reason,
      join_state: meta.join_state || null,
      ms: Date.now() - t0,
      status: res.status,
      ...extract(json),
    });
    process.stderr.write("OK " + id + "\n");
  } catch (e) {
    out.push({ id, reason: meta.reason, error: String(e) });
    process.stderr.write("FAIL " + id + " " + e + "\n");
  }
}

const leakSummary = {};
for (const row of out) {
  for (const w of row.pipelineWords || []) {
    const k = w.path + "=" + w.value;
    leakSummary[k] = leakSummary[k] || { path: w.path, value: w.value, n: 0, counties: {} };
    leakSummary[k].n += 1;
    const fips = row.id.split(":")[0];
    leakSummary[k].counties[fips] = (leakSummary[k].counties[fips] || 0) + 1;
  }
}

fs.writeFileSync(
  "P:/doc_repo/_inbox/2026-09-01_cad-serve-reconcile_sweep_live.json",
  JSON.stringify(
    {
      at: new Date().toISOString(),
      selected: selected.size,
      leakSummary,
      rows: out,
    },
    null,
    2
  ) + "\n"
);
console.log("WROTE sweep n=" + out.length);
