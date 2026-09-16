#!/usr/bin/env node
/**
 * six-county-completeness.mjs -- the Phase 0 exit instrument for the Texas scale-up program.
 *
 * Question it answers: are the six onboarded counties COMPLETE, meaning every one of the 65
 * rails per county is in a state the program has ruled acceptable, and no cell carries an
 * earned state (absent-verified, not-applicable) that no probe earned?
 *
 * Two independent reads, both from the factory store (read-only):
 *   1. parcel_gate_verdict, latest verdict per (county, rail). Classified against RAIL_POLICY
 *      below. A rail missing from RAIL_POLICY fails closed as `undeclared-rail`.
 *   2. parcel_record_cell, per rail, counting cells whose earned state was written without a
 *      probe of the source of record (FALSE_EARNED below). The gate counts these as accounted,
 *      which is exactly why the rail verdicts alone cannot answer the question.
 *
 * Exit codes: 0 COMPLETE, 1 INCOMPLETE, 2 UNMEASURED (no DSN, a query failed, or a county
 * returned no verdicts). UNMEASURED is never COMPLETE: an empty county passing is the P-195
 * defect and this instrument must not repeat it.
 *
 * Usage:
 *   FACTORY_DATABASE_URL_RO=<dsn> node scripts/six-county-completeness.mjs [--json <out>]
 *   node scripts/six-county-completeness.mjs --self-test
 *
 * The DSN is read from the environment and never printed. Requires `psql` on PATH.
 * Snapshot: every run prints its own evaluated_at range and wall-clock time.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

export const SIX = {
  "48021": "Bastrop",
  "48055": "Caldwell",
  "48209": "Hays",
  "48309": "McLennan",
  "48453": "Travis",
  "48491": "Williamson",
};

/**
 * Per-rail policy. `accept` lists the non-pass verdicts the program has RULED acceptable, with
 * the ruling named. Anything else that is not `pass` is an open item of the named class.
 * Classes: must-pass | ruled-withheld | county-scoped | ruled-unavailable | mid-cutover |
 * no-source | make-unbuilt | derived-trivial.
 */
export const RAIL_POLICY = {
  // Ruled withheld (R-2, _decisions/2026-09-11_ruling_b_reversed_polygon_only.md).
  buildableAreaSqFt: { cls: "ruled-withheld", accept: ["excluded"], ruling: "R-2" },
  buildableAreaPct: { cls: "ruled-withheld", accept: ["excluded"], ruling: "R-2" },
  envelopeStatus: { cls: "ruled-withheld", accept: ["excluded"], ruling: "R-2" },
  envelopeDisclosure: { cls: "ruled-withheld", accept: ["excluded"], ruling: "R-2" },
  // Travis-only by ratified design (engine #444).
  maxImperviousCoverPct: { cls: "county-scoped", accept: ["excluded"], onlyIn: ["48453"], ruling: "engine #444" },
  // Operator ruling 2026-09-14 (P-209): declared Unavailable in Texas, rail kept.
  salesHistory: { cls: "ruled-unavailable", accept: ["excluded"], ruling: "P-209" },
  // P-204: data exists and serves by another path; the ledger is the serving path, so these cut over.
  parcelGeometry: { cls: "mid-cutover" },
  roads: { cls: "mid-cutover" },
  pipelines: { cls: "mid-cutover" },
  railCorridor: { cls: "mid-cutover" },
  etjStatus: { cls: "mid-cutover" },
  landUseDescription: { cls: "mid-cutover" },
  // P-203: no acquisition path anywhere. Accepted ONLY while carried on the capability roadmap.
  easements: { cls: "no-source", accept: ["excluded"], ruling: "P-203 roadmap" },
  hoaDeedRestrictions: { cls: "no-source", accept: ["excluded"], ruling: "P-203 roadmap" },
  mineralRights: { cls: "no-source", accept: ["excluded"], ruling: "P-203 roadmap" },
  ossf: { cls: "no-source", accept: ["excluded"], ruling: "P-203 roadmap" },
  permits: { cls: "no-source", accept: ["excluded"], ruling: "P-203 roadmap" },
  terrain: { cls: "no-source", accept: ["excluded"], ruling: "P-203 roadmap" },
  treeProtection: { cls: "no-source", accept: ["excluded"], ruling: "P-203 roadmap" },
  publicRecordRefs: { cls: "no-source", accept: ["excluded"], ruling: "P-242 coming soon" },
  // Manufactured by us, writer missing or not wired to the gate.
  citationUrl: { cls: "make-unbuilt" },
  edgeSignal: { cls: "make-unbuilt" },
  // Trivially derived; written for Hays only as of 2026-09-16.
  acreageSqft: { cls: "derived-trivial" },
  landUseVintage: { cls: "derived-trivial" },
  situsState: { cls: "derived-trivial" },
};
for (const k of [
  "apn", "situsAddress", "situsCity", "situsZip", "landUseCode", "landUseSource",
  "acreageAcres", "acreageMethod", "yearBuilt", "marketValue", "assessedValue", "landValue",
  "improvementValue", "livingAreaSqft", "legalDescription", "exemptionCodes", "countyFips",
  "cityLimits", "schoolDistrict", "zoningDistrict", "zoningJurisdictionKey", "zoningProvenance",
  "setbackFrontFt", "setbackSideFt", "setbackRearFt", "setbackCornerFt", "parcelAreaSqFt",
  "maxLotCoveragePct", "maxHeightFt", "maxFootprintSqFt", "setbackRules", "wells",
  "buildingFootprint", "specialDistricts", "flood", "owner", "valueHistory", "utilityService",
  "agValuation", "overlayDistricts",
]) RAIL_POLICY[k] ??= { cls: "must-pass" };

/**
 * Earned states written without a probe of the source of record. Each entry names the rail,
 * the cell kind, and a SQL predicate on `cell_state` identifying the false basis.
 */
export const FALSE_EARNED = [
  {
    id: "setback-no-ruled-table",
    rail: "setbackFrontFt",
    kind: "absent-verified",
    sql: "cell_state->'basis'->>'finding' like 'no ruled setback table exists%'",
    why: "the city has no table in our corpus; that is a statement about our corpus, not the lot",
  },
  {
    id: "setback-router-miss",
    rail: "setbackFrontFt",
    kind: "absent-verified",
    sql: "cell_state->'basis'->>'method' = 'setback-table-router.resolveSetbackForParcel'",
    why: "the district has no row in the city's table; the requirement exists and is unacquired",
  },
  {
    id: "ag-valuation-no-source",
    rail: "agValuation",
    kind: "not-applicable",
    sql: "split_part(place_key, ':', 1) not in ('48453','48491')",
    why: "agricultural valuation applies Texas-wide (operator 2026-09-16); no source was acquired. " +
      "A GUARD: live read 2026-09-16 found these cells honestly unaccounted, so this reads 0 until " +
      "the never-run not-applicable sweep in parcel-ag-valuation.mjs is run or reintroduced.",
  },
];

/** Pure classification. `verdicts`: [{county, rail, verdict, unaccounted}]. `falseEarned`: [{county, id, n}]. */
export function classify(verdicts, falseEarned, counties = Object.keys(SIX)) {
  const out = { verdict: "COMPLETE", counties: {} };
  for (const fips of counties) {
    const rows = verdicts.filter((v) => v.county === fips);
    const c = { name: SIX[fips] ?? fips, rails: rows.length, pass: 0, accepted: [], open: [], falseEarned: [] };
    out.counties[fips] = c;
    if (rows.length === 0) {
      c.open.push({ cls: "unmeasured", rail: "*", detail: "no gate verdicts for this county" });
      out.verdict = "UNMEASURED";
      continue;
    }
    const seen = new Set();
    for (const r of rows) {
      seen.add(r.rail);
      const pol = RAIL_POLICY[r.rail];
      if (!pol) { c.open.push({ cls: "undeclared-rail", rail: r.rail, verdict: r.verdict }); continue; }
      if (r.verdict === "pass") {
        if (pol.cls === "county-scoped" && !pol.onlyIn.includes(fips)) {
          c.open.push({ cls: "county-scoped-breach", rail: r.rail, verdict: r.verdict });
        } else c.pass++;
        continue;
      }
      const scopedOk = pol.cls !== "county-scoped" || !pol.onlyIn.includes(fips);
      if (pol.accept?.includes(r.verdict) && scopedOk) {
        c.accepted.push({ rail: r.rail, verdict: r.verdict, ruling: pol.ruling });
      } else {
        c.open.push({ cls: pol.cls, rail: r.rail, verdict: r.verdict, unaccounted: r.unaccounted ?? null });
      }
    }
    for (const rail of Object.keys(RAIL_POLICY)) {
      if (!seen.has(rail)) c.open.push({ cls: "missing-verdict", rail });
    }
    for (const f of falseEarned.filter((x) => x.county === fips && x.n > 0)) {
      c.falseEarned.push({ id: f.id, n: f.n });
    }
    if (c.open.length || c.falseEarned.length) {
      if (out.verdict === "COMPLETE") out.verdict = "INCOMPLETE";
    }
  }
  return out;
}

function psqlCsv(dsn, sql) {
  const r = spawnSync("psql", [dsn, "-X", "-q", "--csv", "-v", "ON_ERROR_STOP=1",
    "-c", "set default_transaction_read_only = on", "-c", "set statement_timeout = '300s'", "-c", sql], {
    encoding: "utf8", maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) throw new Error(`psql failed: ${(r.stderr || "").split("\n")[0]}`);
  const lines = r.stdout.trim().split(/\r?\n/).filter((l) => l && l !== "SET");
  const header = lines.shift().split(",");
  return lines.map((l) => Object.fromEntries(l.split(",").map((v, i) => [header[i], v])));
}

function measure(dsn) {
  const list = Object.keys(SIX).map((f) => `'${f}'`).join(",");
  const verdicts = psqlCsv(dsn, `
    select county_fips as county, rail_key as rail, verdict, coalesce(unaccounted_count, 0) as unaccounted,
           evaluated_at::text as evaluated_at
    from (select distinct on (county_fips, rail_key) * from parcel_gate_verdict
          where county_fips in (${list}) order by county_fips, rail_key, evaluated_at desc) v`);
  const falseEarned = [];
  for (const f of FALSE_EARNED) {
    const rows = psqlCsv(dsn, `
      select split_part(place_key, ':', 1) as county, count(*) as n
      from parcel_record_cell
      where rail_key = '${f.rail}' and cell_state->>'kind' = '${f.kind}' and (${f.sql})
        and split_part(place_key, ':', 1) in (${list})
      group by 1`);
    for (const r of rows) falseEarned.push({ county: r.county, id: f.id, n: Number(r.n) });
  }
  return { verdicts: verdicts.map((v) => ({ ...v, unaccounted: Number(v.unaccounted) })), falseEarned };
}

function selfTest() {
  const results = [];
  const check = (name, cond) => results.push({ name, ok: !!cond });
  const full = (fips, overrides = {}) => Object.keys(RAIL_POLICY).map((rail) => {
    const pol = RAIL_POLICY[rail];
    let verdict = "pass";
    if (pol.cls === "ruled-withheld" || pol.cls === "no-source" || pol.cls === "ruled-unavailable") verdict = "excluded";
    if (pol.cls === "county-scoped" && !pol.onlyIn.includes(fips)) verdict = "excluded";
    return { county: fips, rail, verdict: overrides[rail] ?? verdict, unaccounted: 0 };
  });
  const one = ["48209"];

  const clean = classify(full("48209"), [], one);
  check("1 a fully ruled county reads COMPLETE", clean.verdict === "COMPLETE");

  const falseAv = classify(full("48209"), [{ county: "48209", id: "setback-no-ruled-table", n: 1026 }], one);
  check("2 NOT VACUOUS: one false absent-verified population makes it INCOMPLETE", falseAv.verdict === "INCOMPLETE");

  const midCut = classify(full("48209", { roads: "excluded" }), [], one);
  check("3 a mid-cutover rail left excluded is open", midCut.verdict === "INCOMPLETE"
    && midCut.counties["48209"].open.some((o) => o.rail === "roads" && o.cls === "mid-cutover"));

  const undeclared = classify([...full("48209"), { county: "48209", rail: "newRail", verdict: "pass" }], [], one);
  check("4 an undeclared rail fails closed", undeclared.counties["48209"].open.some((o) => o.cls === "undeclared-rail"));

  const empty = classify([], [], one);
  check("5 an empty county is UNMEASURED, never COMPLETE", empty.verdict === "UNMEASURED");

  const r2 = classify(full("48209", { buildableAreaSqFt: "excluded" }), [], one);
  check("6 NEGATIVE CONTROL: an R-2 rail excluded does not open anything", r2.verdict === "COMPLETE");

  const scoped = classify(full("48453", { maxImperviousCoverPct: "excluded" }), [], ["48453"]);
  check("7 the county-scoped rail excluded IN its own county is open", scoped.verdict === "INCOMPLETE");

  const missing = classify(full("48209").filter((r) => r.rail !== "owner"), [], one);
  check("8 a rail with no verdict row is open", missing.counties["48209"].open.some((o) => o.cls === "missing-verdict" && o.rail === "owner"));

  const refuse = classify(full("48209", { maxHeightFt: "refuse" }), [], one);
  check("9 a refusal is open even on a must-pass rail with a count", refuse.verdict === "INCOMPLETE");

  check("10 the policy declares exactly 65 rails", Object.keys(RAIL_POLICY).length === 65);

  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad})` : `SELF-TEST OK (${results.length})`);
  process.exit(bad ? 1 : 0);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const dsn = process.env.FACTORY_DATABASE_URL_RO;
  if (!dsn) {
    console.error("UNMEASURED: FACTORY_DATABASE_URL_RO is not set");
    process.exit(2);
  }
  const started = new Date().toISOString();
  let data;
  try {
    data = measure(dsn);
  } catch (e) {
    console.error(`UNMEASURED: ${e.message}`);
    process.exit(2);
  }
  const result = classify(data.verdicts, data.falseEarned);
  const evals = data.verdicts.map((v) => v.evaluated_at).sort();
  result.snapshot = { ranAt: started, verdictsEvaluatedFrom: evals[0] ?? null, verdictsEvaluatedTo: evals.at(-1) ?? null };
  const outIdx = args.indexOf("--json");
  if (outIdx >= 0) writeFileSync(args[outIdx + 1], JSON.stringify(result, null, 2));
  console.log(`VERDICT ${result.verdict}  (ran ${started})`);
  for (const [fips, c] of Object.entries(result.counties)) {
    const fe = c.falseEarned.map((f) => `${f.id}=${f.n}`).join(" ") || "none";
    console.log(`${fips} ${c.name.padEnd(10)} pass ${String(c.pass).padStart(2)}  ruled ${String(c.accepted.length).padStart(2)}  open ${String(c.open.length).padStart(2)}  false-earned: ${fe}`);
    for (const o of c.open) console.log(`    open  ${o.cls.padEnd(16)} ${o.rail}${o.verdict ? ` (${o.verdict}${o.unaccounted ? ` ${o.unaccounted}` : ""})` : ""}`);
  }
  process.exit(result.verdict === "COMPLETE" ? 0 : result.verdict === "UNMEASURED" ? 2 : 1);
}

main();
