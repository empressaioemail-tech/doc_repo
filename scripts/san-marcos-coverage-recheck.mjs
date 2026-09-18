#!/usr/bin/env node
/**
 * Ruling 19's precondition (A-216): before San Marcos is served from @empressaio/setback-corpus 1.4.0,
 * re-run the 2026-09-07 area-coverage check (live zoning layer, area-weighted by district) against
 * the 1.4.0 table. If coverage has fallen below that check's, the switch stops and goes back to the
 * operator. `_decisions/2026-09-18_phase0_closeout_rulings.md`, ruling 19.
 *
 *   node scripts/san-marcos-coverage-recheck.mjs --router <setback-table-router.mjs> \
 *        --table <1.4.0 san-marcos-tx.json> --baseline-table <1.1.0 san-marcos-tx.json> --out <json>
 *   node scripts/san-marcos-coverage-recheck.mjs --self-test --router <setback-table-router.mjs>
 *
 * WHAT DECIDES "COVERED". Not this file. A zone code is covered when the factory setback writer's own
 * matcher (`mapDistrict` in hauska-factory src/lib/setback-writer/setback-table-router.mjs, passed by
 * path so the SHA is declared) maps it to a row. A re-derived matcher here would be a second copy of
 * the rule that decides what San Marcos serves.
 *
 * TWO DERIVATIONS OF AREA, AND THEY MUST AGREE. The layer's geometry area (`SHAPE.STArea()`) is summed
 * twice: by the server (outStatistics, grouped by ZONECODE) and by this file over every feature it
 * pages. A disagreement past a declared tolerance refuses: an instrument that cannot reproduce its own
 * total is not measuring. The declared `ACREAGE` field is reported beside it, not used to decide.
 *
 * VERDICT. HOLDS (exit 0): the 1.4.0 table's covered area share is at or above the 2026-09-07 figure
 * (12.93 percent, SF-6 plus SF-4.5, the rows that check counted) AND at or above what the table served
 * today (1.1.0) covers on the same layer read. FALLS (exit 1): either is lower. REFUSE (exit 2): the
 * layer could not be read, returned no features, carried a feature with no area, or the two area
 * derivations disagree. Usage errors exit 3. Absent, zero and unmeasured stay three states: an empty
 * layer is REFUSE, never a coverage of zero.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const LAYER_URL = "https://smgis.sanmarcostx.gov/arcgis/rest/services/MPN/MyPermitNowFeatures/MapServer/6";
export const CODE_FIELD = "ZONECODE";
export const AREA_FIELD = "SHAPE.STArea()";
export const BASELINE_2026_09_07 = Object.freeze({ coveredCodes: ["SF-6", "SF-4.5"], coveredShare: 0.1293, legacyCodes: ["D", "DR", "TH"], legacyShare: 0.009 });
/** Server sum vs client sum, relative. Area sums of the same features in one read must agree closely. */
export const AREA_AGREEMENT_TOLERANCE = 1e-6;
export const EXIT = Object.freeze({ HOLDS: 0, FALLS: 1, REFUSE: 2, USAGE: 3 });

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : null;
}

class Refusal extends Error {
  constructor(code, detail) { super(`${code}: ${detail}`); this.code = code; }
}

/**
 * Pure. features: [{ code, area, acreage }]; serverByCode: Map code -> summed area (or null when the
 * server leg was not taken, as in fixtures that test the pure path only); tables: { name: table }.
 */
export function evaluateCoverage({ features, serverByCode, tables, mapDistrict, baselineName, candidateName }) {
  if (!Array.isArray(features) || features.length === 0) throw new Refusal("LAYER_EMPTY", "the layer returned no features; an empty read is unmeasured, not zero coverage");
  const byCode = new Map();
  let total = 0;
  for (const f of features) {
    if (!(typeof f.area === "number" && Number.isFinite(f.area) && f.area >= 0)) throw new Refusal("FEATURE_AREA_MISSING", `a feature with code ${JSON.stringify(f.code)} carries no usable area`);
    const code = f.code == null ? "(null)" : String(f.code).trim() || "(blank)";
    const e = byCode.get(code) ?? { code, area: 0, acreage: 0, acreageMissing: 0, polygons: 0 };
    e.area += f.area; e.polygons += 1;
    if (typeof f.acreage === "number" && Number.isFinite(f.acreage)) e.acreage += f.acreage; else e.acreageMissing += 1;
    byCode.set(code, e);
    total += f.area;
  }
  if (!(total > 0)) throw new Refusal("LAYER_ZERO_AREA", "the features sum to no area");
  if (serverByCode) {
    let serverTotal = 0;
    for (const [code, e] of byCode) {
      const s = serverByCode.get(code);
      if (s == null) throw new Refusal("AREA_DERIVATIONS_DISAGREE", `the server's group-by has no row for ${code}, which the paged read holds`);
      if (Math.abs(s - e.area) / Math.max(e.area, 1) > AREA_AGREEMENT_TOLERANCE) throw new Refusal("AREA_DERIVATIONS_DISAGREE", `${code}: server ${s} vs paged ${e.area}`);
      serverTotal += s;
    }
    if (serverByCode.size !== byCode.size) throw new Refusal("AREA_DERIVATIONS_DISAGREE", `server groups ${serverByCode.size} codes, paged read ${byCode.size}`);
    if (Math.abs(serverTotal - total) / total > AREA_AGREEMENT_TOLERANCE) throw new Refusal("AREA_DERIVATIONS_DISAGREE", `total: server ${serverTotal} vs paged ${total}`);
  }
  const coverage = {};
  for (const [name, table] of Object.entries(tables)) {
    let covered = 0;
    const rows = [];
    for (const e of [...byCode.values()].sort((a, b) => b.area - a.area)) {
      const m = e.code.startsWith("(") ? null : mapDistrict(table, e.code);
      if (m) covered += e.area;
      rows.push({ code: e.code, share: e.area / total, polygons: e.polygons, matched: m ? { district: m.district.district_name, kind: m.kind, confidence: m.confidence } : null });
    }
    coverage[name] = { districts: table.districts.length, coveredShare: covered / total, codes: rows };
  }
  const shareOf = (codes) => codes.reduce((s, c) => s + (byCode.get(c)?.area ?? 0), 0) / total;
  const comparable = {
    coveredCodesShare: shareOf(BASELINE_2026_09_07.coveredCodes),
    legacyCodesShare: shareOf(BASELINE_2026_09_07.legacyCodes),
    sf11Present: byCode.has("SF-11"),
  };
  const cand = coverage[candidateName].coveredShare;
  const base = coverage[baselineName].coveredShare;
  const reasons = [];
  if (cand < BASELINE_2026_09_07.coveredShare) reasons.push(`candidate ${candidateName} covers ${(cand * 100).toFixed(2)}% < the 2026-09-07 figure ${(BASELINE_2026_09_07.coveredShare * 100).toFixed(2)}%`);
  if (cand < base) reasons.push(`candidate ${candidateName} covers ${(cand * 100).toFixed(2)}% < today's ${baselineName} ${(base * 100).toFixed(2)}%`);
  return {
    verdict: reasons.length ? "FALLS" : "HOLDS",
    reasons,
    totalArea: total,
    polygons: features.length,
    codes: byCode.size,
    comparable,
    coverage,
    acreageCrossCheck: {
      totalAcreage: [...byCode.values()].reduce((s, e) => s + e.acreage, 0),
      featuresWithoutAcreage: [...byCode.values()].reduce((s, e) => s + e.acreageMissing, 0),
      totalAreaAcres: total / 43560,
    },
  };
}

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Refusal("LAYER_UNREADABLE", `${res.status} from ${url}`);
  const j = await res.json();
  if (j.error) throw new Refusal("LAYER_UNREADABLE", `${JSON.stringify(j.error).slice(0, 300)} from ${url}`);
  return j;
}

export async function readLayer(layer = LAYER_URL) {
  const meta = await getJson(`${layer}?f=json`);
  const names = new Set((meta.fields ?? []).map((f) => f.name));
  for (const need of [CODE_FIELD, AREA_FIELD, "OBJECTID"]) if (!names.has(need)) throw new Refusal("LAYER_SCHEMA_CHANGED", `field ${need} is not on the layer`);
  const ids = await getJson(`${layer}/query?where=1%3D1&returnIdsOnly=true&f=json`);
  const objectIds = (ids.objectIds ?? []).slice().sort((a, b) => a - b);
  if (objectIds.length === 0) throw new Refusal("LAYER_EMPTY", "returnIdsOnly returned no ids");
  const features = [];
  const batch = 400;
  for (let i = 0; i < objectIds.length; i += batch) {
    const chunk = objectIds.slice(i, i + batch).join(",");
    const outFields = encodeURIComponent(`OBJECTID,${CODE_FIELD},ACREAGE,${AREA_FIELD}`);
    const page = await getJson(`${layer}/query?objectIds=${chunk}&outFields=${outFields}&returnGeometry=false&f=json`);
    for (const f of page.features ?? []) {
      const a = f.attributes ?? {};
      features.push({ id: a.OBJECTID, code: a[CODE_FIELD], area: a[AREA_FIELD], acreage: a.ACREAGE });
    }
  }
  if (features.length !== objectIds.length) throw new Refusal("LAYER_PAGING_SHORT", `paged ${features.length} of ${objectIds.length} ids`);
  const stats = encodeURIComponent(JSON.stringify([{ statisticType: "sum", onStatisticField: AREA_FIELD, outStatisticFieldName: "area_sum" }]));
  const grouped = await getJson(`${layer}/query?where=1%3D1&groupByFieldsForStatistics=${CODE_FIELD}&outStatistics=${stats}&f=json`);
  const serverByCode = new Map();
  for (const f of grouped.features ?? []) {
    const a = f.attributes ?? {};
    const raw = a[CODE_FIELD];
    const code = raw == null ? "(null)" : String(raw).trim() || "(blank)";
    serverByCode.set(code, (serverByCode.get(code) ?? 0) + Number(a.area_sum ?? a.AREA_SUM));
  }
  return { meta: { name: meta.name, currentVersion: meta.currentVersion ?? null, editingInfo: meta.editingInfo ?? null }, objectIds: objectIds.length, features, serverByCode };
}

async function loadRouter(path) {
  if (!path) { console.error("--router <path to hauska-factory setback-table-router.mjs> is required"); process.exit(EXIT.USAGE); }
  const m = await import(pathToFileURL(resolve(path)).href);
  if (typeof m.mapDistrict !== "function") { console.error(`${path} exports no mapDistrict`); process.exit(EXIT.USAGE); }
  return m;
}

async function selfTest(router) {
  const t = (names) => ({ districts: names.map((n) => ({ district_name: n })) });
  const tables = { base: t(["SF-6 Single Family 6", "P Public and Institutional (legacy)"]), cand: t(["SF-6 Single Family 6", "CD-5 Character District 5", "P Public and Institutional (legacy)"]) };
  const f = (code, area) => ({ code, area, acreage: area / 43560 });
  const results = [];
  const check = (name, fn) => { try { const ok = fn(); results.push({ name, ok: !!ok }); } catch (e) { results.push({ name, ok: false, err: e.message }); } };
  const run = (features, extra = {}) => evaluateCoverage({ features, serverByCode: null, tables, mapDistrict: router.mapDistrict, baselineName: "base", candidateName: "cand", ...extra });
  const refuses = (code, fn) => { try { fn(); return false; } catch (e) { return e.code === code; } };
  check("candidate adds a district the baseline lacks: HOLDS, and the candidate covers more", () => {
    const r = run([f("SF-6", 50), f("CD-5", 40), f("ZZ-9", 10)]);
    return r.verdict === "HOLDS" && r.coverage.cand.coveredShare === 0.9 && r.coverage.base.coveredShare === 0.5;
  });
  check("candidate covers LESS than the baseline: FALLS (the direction the ruling stops on)", () => {
    // Two-district tables throughout: the router matches EVERY code to a one-district table
    // (`kind: "single"`), so a one-district fixture would not test coverage at all.
    const r = evaluateCoverage({ features: [f("SF-6", 30), f("P", 70)], serverByCode: null, tables: { base: tables.cand, cand: t(["SF-6 Single Family 6", "QQ-9 Nothing"]) }, mapDistrict: router.mapDistrict, baselineName: "base", candidateName: "cand" });
    return r.verdict === "FALLS" && r.coverage.cand.coveredShare === 0.3 && r.coverage.base.coveredShare === 1;
  });
  check("candidate below the 2026-09-07 12.93 percent: FALLS even though it beats the baseline", () => {
    const r = evaluateCoverage({ features: [f("SF-6", 10), f("ZZ-9", 90)], serverByCode: null, tables: { base: t(["QQ-1 Nothing", "QQ-3 Nothing"]), cand: t(["SF-6 Single Family 6", "QQ-2 Nothing"]) }, mapDistrict: router.mapDistrict, baselineName: "base", candidateName: "cand" });
    return r.verdict === "FALLS" && r.coverage.cand.coveredShare === 0.1 && r.coverage.base.coveredShare === 0 && r.reasons.length === 1;
  });
  check("the router's one-district branch is real (why the fixtures above use two districts)", () => router.mapDistrict(t(["QQ-1 Nothing"]), "ZZ-9")?.kind === "single");
  check("an empty layer REFUSES LAYER_EMPTY, never coverage zero", () => refuses("LAYER_EMPTY", () => run([])));
  check("a feature with no area REFUSES", () => refuses("FEATURE_AREA_MISSING", () => run([f("SF-6", 1), { code: "CD-5", area: null }])));
  check("server and paged sums that disagree REFUSE", () => refuses("AREA_DERIVATIONS_DISAGREE", () => run([f("SF-6", 50), f("CD-5", 50)], { serverByCode: new Map([["SF-6", 50], ["CD-5", 49]]) })));
  check("a server group-by missing a code REFUSES", () => refuses("AREA_DERIVATIONS_DISAGREE", () => run([f("SF-6", 50), f("CD-5", 50)], { serverByCode: new Map([["SF-6", 50]]) })));
  check("server and paged sums that agree pass through", () => run([f("SF-6", 50), f("CD-5", 50)], { serverByCode: new Map([["SF-6", 50], ["CD-5", 50]]) }).verdict === "HOLDS");
  check("the real router is loaded: P-5 is NOT matched to the one-letter P row (its own guard)", () => router.mapDistrict(tables.base, "P-5") === null && router.mapDistrict(tables.base, "P") !== null);
  check("a null zone code is never matched", () => run([f(null, 10), f("SF-6", 90)]).coverage.cand.codes.find((c) => c.code === "(null)").matched === null);
  for (const r of results) console.log(`  ${r.ok ? "ok  " : "FAIL"} ${r.name}${r.err ? ` (${r.err})` : ""}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `self-test: ${failed} FAILED` : `self-test: all ${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  const router = await loadRouter(arg("router"));
  if (process.argv.includes("--self-test")) await selfTest(router);
  else {
    const tablePath = arg("table");
    const basePath = arg("baseline-table");
    const out = arg("out");
    if (!tablePath || !basePath || !out) { console.error("usage: --router <f> --table <1.4.0 json> --baseline-table <1.1.0 json> --out <json>"); process.exit(EXIT.USAGE); }
    const readAt = new Date().toISOString();
    let report;
    try {
      const layer = await readLayer(arg("layer") ?? LAYER_URL);
      const tables = { "1.1.0": JSON.parse(readFileSync(basePath, "utf8")), "1.4.0": JSON.parse(readFileSync(tablePath, "utf8")) };
      const r = evaluateCoverage({ features: layer.features, serverByCode: layer.serverByCode, tables, mapDistrict: router.mapDistrict, baselineName: "1.1.0", candidateName: "1.4.0" });
      report = { instrument: "scripts/san-marcos-coverage-recheck.mjs", readAt, layer: arg("layer") ?? LAYER_URL, layerMeta: layer.meta, objectIds: layer.objectIds, router: { path: arg("router"), corpusVersion: router.CORPUS_VERSION ?? null }, baseline20260907: BASELINE_2026_09_07, ...r };
    } catch (e) {
      report = { instrument: "scripts/san-marcos-coverage-recheck.mjs", readAt, verdict: "REFUSE", code: e.code ?? "ERROR", detail: e.message };
    }
    writeFileSync(out, JSON.stringify(report, null, 2) + "\n", "utf8");
    console.log(`${report.verdict}${report.reasons?.length ? `: ${report.reasons.join("; ")}` : ""}${report.detail ? `: ${report.detail}` : ""} -> ${out}`);
    process.exitCode = EXIT[report.verdict];
  }
}
