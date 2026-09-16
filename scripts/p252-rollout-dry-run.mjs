#!/usr/bin/env node
/**
 * p252-rollout-dry-run.mjs -- what changes in the six counties when P-252's gate code runs.
 *
 * P-252 (factory PR #157) makes a rail that is live somewhere in Texas, but has no earned cell and
 * at least one `unaccounted` cell in a county, REFUSE in that county instead of reading
 * `excluded`. The lane could not measure the consequence (no read-only credential). This reads the
 * factory store read-only and computes, without writing:
 *   1. every (county, rail) verdict that changes, old and new, with the cell counts behind it;
 *   2. the publish-floor rails that would then refuse a publish, per county, with and without
 *      P-292's county scope (maxImperviousCoverPct required only in Travis);
 *   3. floor rails that ALREADY refuse today (a publish is already blocked on them).
 * Serving consequence is a code read, not a measurement, and is stated in the output: LDT's
 * resolveAllowlistState serves `refuse` and `excluded` the same way (refused, old value kept).
 *
 * Program-wide liveness is approximated from the verdict table (a rail with `pass` or `refuse` in
 * any county has earned cells somewhere); the scheduler derives it from cells. Stated, not hidden.
 *
 * USAGE  FACTORY_DATABASE_URL_RO=... node scripts/p252-rollout-dry-run.mjs [--json out]
 *        node scripts/p252-rollout-dry-run.mjs --self-test
 * EXIT   0 measured, 2 UNMEASURED.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./setback-parcel-census.mjs";
import { SIX } from "./envelope-draw-gap.mjs";

/** PUBLISH_FLOOR_RAIL_KEYS at hauska-factory 9171279 (read by importing the module at that SHA, 2026-09-16). */
export const FLOOR_AT_9171279 = ["cityLimits", "flood", "wells", "specialDistricts", "valueHistory", "overlayDistricts",
  "maxImperviousCoverPct", "zoningDistrict", "marketValue", "assessedValue", "landValue", "improvementValue",
  "livingAreaSqft", "yearBuilt", "utilityService", "landUseCode", "owner"];
/** P-292's declared scope (engine #444): a scoped floor rail is required only in these counties. */
export const P292_SCOPE = { maxImperviousCoverPct: ["48453"] };
const EARNED = ["value", "absent-verified", "refused"];

/** Pure: P-252's verdict for one (county, rail) from its cell counts. */
export function newVerdict(oldVerdict, counts, liveProgramWide) {
  if (oldVerdict === "pass" || oldVerdict === "refuse") return { verdict: oldVerdict, changed: false };
  const earned = EARNED.reduce((s, k) => s + (counts[k] ?? 0), 0);
  const unaccounted = counts.unaccounted ?? 0;
  if (earned > 0) return { verdict: oldVerdict, changed: false, anomaly: "excluded verdict over earned cells" };
  if (liveProgramWide && unaccounted > 0) return { verdict: "refuse", changed: true, unaccounted };
  if (liveProgramWide) return { verdict: "excluded-not-applicable", changed: false };
  return { verdict: "excluded-declared-ahead", changed: false };
}

/** Pure: floor rails that refuse a publish for one county under a verdict map. */
export function floorRefusals(fips, verdictByRail, floor, scope = {}) {
  const out = [];
  for (const rail of floor) {
    if (scope[rail] && !scope[rail].includes(fips)) continue;
    const v = verdictByRail[rail];
    if (v === undefined) { out.push({ rail, verdict: "missing" }); continue; }
    if (v === "pass" || v === "excluded-not-applicable") continue;
    if (v === "excluded") continue; // pre-P-252 code clears any excluded
    out.push({ rail, verdict: v });
  }
  return out;
}

function psqlCsv(dsn, sql, timeoutMs = 290000) {
  const dir = mkdtempSync(join(tmpdir(), "p252-dry-"));
  const file = join(dir, "q.sql");
  writeFileSync(file, `set default_transaction_read_only = on;\nset statement_timeout = '280s';\n${sql}`, "utf8");
  try {
    const r = spawnSync("psql", [dsn, "-X", "-q", "--csv", "-v", "ON_ERROR_STOP=1", "-f", file], {
      encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: timeoutMs,
      env: { ...process.env, PGOPTIONS: "-c default_transaction_read_only=on" },
    });
    if (r.error) throw new Error(`psql spawn error: ${r.error.message}`);
    if (r.status !== 0) throw new Error(`psql failed (status ${r.status}): ${(r.stderr || "").split("\n")[0]}`);
    return parseCsv(r.stdout.split(/\r?\n/).filter((l) => l !== "SET").join("\n"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function measure(dsn) {
  const verdicts = psqlCsv(dsn, `select county_fips, rail_key, verdict, coalesce(unaccounted_count,0) as unaccounted
    from (select distinct on (county_fips, rail_key) * from parcel_gate_verdict order by county_fips, rail_key, evaluated_at desc) v;`);
  const live = new Set(verdicts.filter((v) => v.verdict === "pass" || v.verdict === "refuse").map((v) => v.rail_key));
  const counties = [];
  for (const fips of Object.keys(SIX)) {
    const rows = verdicts.filter((v) => v.county_fips === fips);
    const excludedRails = rows.filter((v) => v.verdict !== "pass" && v.verdict !== "refuse").map((v) => v.rail_key);
    const counts = {};
    if (excludedRails.length) {
      const list = excludedRails.map((r) => `'${r.replace(/[^A-Za-z0-9_]/g, "")}'`).join(",");
      for (const c of psqlCsv(dsn, `select rail_key, cell_state->>'kind' as kind, count(*) as n from parcel_record_cell
          where place_key >= '${fips}:' and place_key < '${fips};' and rail_key in (${list}) group by 1, 2;`)) {
        (counts[c.rail_key] ??= {})[c.kind] = Number(c.n);
      }
    }
    const before = {}, after = {}, changes = [], anomalies = [];
    for (const v of rows) {
      before[v.rail_key] = v.verdict;
      const nv = newVerdict(v.verdict, counts[v.rail_key] ?? {}, live.has(v.rail_key));
      after[v.rail_key] = nv.verdict;
      if (nv.changed) changes.push({ rail: v.rail_key, from: v.verdict, to: nv.verdict, unaccounted: nv.unaccounted, cells: counts[v.rail_key] });
      if (nv.anomaly) anomalies.push({ rail: v.rail_key, anomaly: nv.anomaly, cells: counts[v.rail_key] });
    }
    counties.push({
      countyFips: fips, county: SIX[fips], rails: rows.length, changes, anomalies,
      floorRefusingToday: floorRefusals(fips, before, FLOOR_AT_9171279),
      floorRefusingAfterP252: floorRefusals(fips, after, FLOOR_AT_9171279),
      floorRefusingAfterP252AndP292: floorRefusals(fips, after, FLOOR_AT_9171279, P292_SCOPE),
    });
    process.stderr.write(`[dry-run] ${fips} ${changes.length} changes\n`);
  }
  return { liveProgramWide: [...live].sort(), counties };
}

function selfTest() {
  const results = [];
  const check = (n, c) => results.push({ n, ok: !!c });
  check("an excluded live rail with unaccounted cells becomes refuse", newVerdict("excluded", { unaccounted: 5 }, true).verdict === "refuse");
  check("an excluded live rail whose cells are all not-applicable stays an exclusion", newVerdict("excluded", { "not-applicable": 5 }, true).verdict === "excluded-not-applicable");
  check("an excluded rail declared ahead program-wide does not become refuse", newVerdict("excluded", { unaccounted: 5 }, false).changed === false);
  check("pass and refuse are untouched", !newVerdict("pass", {}, true).changed && !newVerdict("refuse", { unaccounted: 1 }, true).changed);
  check("an excluded verdict over earned cells is reported as an anomaly, not changed", newVerdict("excluded", { value: 1 }, true).anomaly !== undefined);
  const after = { cityLimits: "pass", maxImperviousCoverPct: "refuse", flood: "refuse" };
  const floor = ["cityLimits", "maxImperviousCoverPct", "flood", "owner"];
  const plain = floorRefusals("48209", after, floor).map((x) => x.rail).sort().join(",");
  check("NOT VACUOUS: floor refusals include a refusing rail and a missing verdict", plain === "flood,maxImperviousCoverPct,owner");
  const scoped = floorRefusals("48209", after, floor, P292_SCOPE).map((x) => x.rail).sort().join(",");
  check("P-292 scope drops maxImperviousCoverPct outside Travis only", scoped === "flood,owner" && floorRefusals("48453", after, floor, P292_SCOPE).some((x) => x.rail === "maxImperviousCoverPct"));
  check("the floor list has the 17 rails read at 9171279", FLOOR_AT_9171279.length === 17);
  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.n}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad})` : `SELF-TEST OK (${results.length})`);
  process.exit(bad ? 1 : 0);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const dsn = process.env.FACTORY_DATABASE_URL_RO;
  if (!dsn) { console.error("UNMEASURED: FACTORY_DATABASE_URL_RO is not set"); process.exit(2); }
  const ranAt = new Date().toISOString();
  let res;
  try { res = measure(dsn); } catch (e) { console.error(`UNMEASURED: ${e.message}`); process.exit(2); }
  const out = {
    instrument: "scripts/p252-rollout-dry-run.mjs", ranAt, factoryCodeBasis: "P-252 PR #157 logic as specified in its close; floor list at hauska-factory 9171279",
    livenessBasis: "a rail with pass or refuse in any county's latest verdict",
    servingConsequence: "code read, LDT artifacts/api-server/src/lib/parcelRecordAllowlist.ts resolveAllowlistState at 0bf2377f: refuse and excluded both resolve to refused (the old value is kept); parcelGateVerdictRead.ts accepts only pass, refuse and excluded, so P-201's excluded-* strings read as no verdict (legacy) once that scheduler code runs",
    ...res,
  };
  const oi = args.indexOf("--json");
  if (oi >= 0) writeFileSync(args[oi + 1], JSON.stringify(out, null, 1));
  console.log(`P-252 ROLLOUT DRY RUN  ${ranAt}`);
  for (const c of res.counties) {
    const names = (xs) => xs.map((x) => `${x.rail}${x.verdict && x.verdict !== "refuse" ? `(${x.verdict})` : ""}`).join(", ") || "none";
    console.log(`${c.countyFips} ${c.county.padEnd(10)} changes=${c.changes.length} [${c.changes.map((x) => `${x.rail}:${x.unaccounted}`).join(", ")}]`);
    console.log(`    floor refusing today: ${names(c.floorRefusingToday)}`);
    console.log(`    after P-252:          ${names(c.floorRefusingAfterP252)}`);
    console.log(`    after P-252 + P-292:  ${names(c.floorRefusingAfterP252AndP292)}`);
    if (c.anomalies.length) console.log(`    anomalies: ${JSON.stringify(c.anomalies)}`);
  }
  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
