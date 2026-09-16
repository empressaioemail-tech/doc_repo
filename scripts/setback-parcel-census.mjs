#!/usr/bin/env node
/**
 * setback-parcel-census.mjs (OPS-24 P-255; scope S0 and R0).
 *
 * Replaces the 2026-09-16 session queries (`_inbox/2026-09-16_setback_parcel_grain_queries.sql`)
 * with an instrument that can be re-run, and adds the population P-249 actually unlocks.
 *
 * WHAT IT MEASURES, per county, per city, per district, at PARCEL grain:
 *   - setback state on `setbackFrontFt`: value, false absence (a district missing from its city's
 *     table, or a city with no table), other absent-verified, refused, unaccounted, not-applicable,
 *     no cell. The false-absence writers write every setback rail the same way, so the front rail
 *     sizes the class; the other four rails are graded by the Phase 0 exit (P-253).
 *   - for district misses, the raw district code, with codes that look like non-districts
 *     (right-of-way, water, blanks) flagged as CANDIDATES for `not-applicable`, never asserted;
 *   - for no-table cities, whether the city has a zoning layer (district on record) or not;
 *   - when the atoms store is joined, P-249's populations:
 *       gapUpperBound: setback value + a `no-buildable-area` atom that is neither depth-warm
 *                      promoted nor a machine-verify diagnostic (the research wave's 131,357);
 *       predicatePopulation: the same, AND a district on record AND the value cell names the city
 *                      table it resolved from (`resolvedTableKey`), which is P-249's predicate;
 *                      (value cells carry `source`, `districtCode` and `resolvedTableKey`, not
 *                      `basis.method`; the first run keyed on the method and read 0 everywhere);
 *       reasonlessZeroBlocked: parcels whose envelope atom is a zero with no reason at all.
 *
 * TWO STORES, joined by place_key ({countyFips}:{propId}, never a bare number):
 *   factory store  FACTORY_DATABASE_URL_RO  parcel_record_cell, one county at a time, key-range bounded
 *   atoms store    ATOMS_DATABASE_URL       atoms, entity_type 'buildable-envelope', prefix on
 *                                           body->>'parcelNodeId' (its partial index); optional
 * Both sessions run with default_transaction_read_only on. DSNs are never printed.
 *
 * USAGE
 *   FACTORY_DATABASE_URL_RO=... [ATOMS_DATABASE_URL=...] node scripts/setback-parcel-census.mjs
 *       [--counties 48021,48209] [--json <out>]
 *   node scripts/setback-parcel-census.mjs --self-test
 * EXIT  0 measured; 2 UNMEASURED (no factory DSN, or every county failed). A county that fails is
 *       reported by name and its numbers are absent, never zero.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { classifyReason, SIX } from "./envelope-draw-gap.mjs";

export const NO_TABLE_PREFIX = "no ruled setback table exists for ";
export const ROUTER_METHOD_PREFIX = "setback-table-router";
// Unambiguous words only. Two-letter codes are real districts somewhere: Austin's RR is Rural
// Residence (2,917 parcels), not railroad, and the first run flagged it (2026-09-16). A candidate is
// a lead for S1's raw-code review, never a ruling that the code is not a district.
const NON_DISTRICT = /^(|ROW|R\.O\.W\.?|RIGHT[- ]?OF[- ]?WAY|WATER|WATERWAY|STREET|STREETS|HIGHWAY|RAILROAD|NULL|NONE|UNKNOWN|UNZONED|NOT ZONED)$/i;
/** Planned-development codes: A-164 gives these the PUD message, not an acquisition task. */
export const PLANNED_DEVELOPMENT = /^(PUD|PDD|PD|PC|P-?U-?D)([\s-].*)?$/i;

/** Pure: a minimal RFC 4180 CSV parser (quoted fields, doubled quotes, commas and newlines inside quotes). */
export function parseCsv(text) {
  const rows = [];
  let row = [], field = "", i = 0, q = false;
  const s = String(text ?? "");
  while (i < s.length) {
    const c = s[i];
    if (q) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i += 2; continue; } q = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { q = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows.shift();
  return rows.filter((r) => r.length === header.length).map((r) => Object.fromEntries(r.map((v, k) => [header[k], v])));
}

/** Pure: one parcel's setback class from its front-rail cell. */
export function classifySetback({ sb_kind, sb_method, sb_finding }) {
  if (!sb_kind) return "no-cell";
  if (sb_kind === "value") return "value";
  if (sb_kind === "absent-verified") {
    if (String(sb_method ?? "").startsWith(ROUTER_METHOD_PREFIX)) return "false-absence:district-miss";
    if (String(sb_finding ?? "").startsWith(NO_TABLE_PREFIX)) return "false-absence:no-table";
    return "absent-verified:other";
  }
  return sb_kind; // refused, unaccounted, not-applicable
}

/** Pure: the city a parcel is counted under. No-table cells name their city in the finding. */
export function cityOf(row) {
  if (row.city_key) return row.city_key;
  const f = String(row.sb_finding ?? "");
  if (f.startsWith(NO_TABLE_PREFIX)) return f.slice(NO_TABLE_PREFIX.length).trim() || "(no city)";
  return "(no city)";
}

export function isNonDistrictCandidate(code) {
  return NON_DISTRICT.test(String(code ?? "").trim());
}

/** Pure: P-249 membership for one parcel. `atom` is null when the atoms store was not joined. */
export function envelopeClass(row, atom) {
  if (atom === null) return { gapUpperBound: null, predicatePopulation: null, reasonlessZeroBlocked: null };
  const zero = atom?.kind === "no-buildable-area";
  const reasonClass = zero ? classifyReason(atom.reason ?? null) : null;
  const unverifiedZero = zero && atom.depthWarmPromoted !== true && reasonClass !== "machine-verify-diagnostic";
  const hasValue = row.sb_kind === "value";
  const gapUpperBound = hasValue && unverifiedZero;
  const predicatePopulation = gapUpperBound && !!row.district && !!row.sb_table;
  return { gapUpperBound, predicatePopulation, reasonlessZeroBlocked: zero && reasonClass === "zero-no-reason" };
}

const bump = (o, k, n = 1) => { o[k] = (o[k] ?? 0) + n; };

/** Pure: aggregate parcel rows (and an optional atom map) into the census. */
export function aggregate(countyFips, rows, atomsByPlace) {
  const joined = atomsByPlace !== null;
  const byDistrict = {};
  const noTableCities = {};
  const missCodes = {};
  const totals = {};
  const envelope = { gapUpperBound: joined ? 0 : null, predicatePopulation: joined ? 0 : null, reasonlessZeroBlocked: joined ? 0 : null };
  const envelopeByCity = {};
  for (const r of rows) {
    const cls = classifySetback(r);
    const city = cityOf(r);
    const district = r.district || "(none)";
    bump(totals, cls);
    const dk = `${city}|${district}`;
    byDistrict[dk] ??= { city, district, parcels: 0 };
    byDistrict[dk].parcels++;
    bump(byDistrict[dk], cls);
    if (cls === "false-absence:no-table") {
      noTableCities[city] ??= { city, parcels: 0, withDistrictOnRecord: 0, zoningRefused: 0 };
      noTableCities[city].parcels++;
      if (r.district) noTableCities[city].withDistrictOnRecord++;
      if (r.zd_kind === "refused") noTableCities[city].zoningRefused++;
    }
    if (cls === "false-absence:district-miss") {
      const code = r.sb_code ?? r.district ?? "";
      const mk = `${city}|${code}`;
      missCodes[mk] ??= { city, code, parcels: 0, nonDistrictCandidate: isNonDistrictCandidate(code), plannedDevelopment: PLANNED_DEVELOPMENT.test(String(code).trim()) };
      missCodes[mk].parcels++;
    }
    if (joined) {
      const e = envelopeClass(r, atomsByPlace.get(r.place_key) ?? { kind: null });
      envelopeByCity[city] ??= { city, gapUpperBound: 0, predicatePopulation: 0, reasonlessZeroBlocked: 0 };
      for (const k of ["gapUpperBound", "predicatePopulation", "reasonlessZeroBlocked"]) if (e[k]) { envelope[k]++; envelopeByCity[city][k]++; }
    }
  }
  return {
    countyFips, county: SIX[countyFips] ?? countyFips, parcels: rows.length, totals,
    falseAbsence: {
      districtMiss: totals["false-absence:district-miss"] ?? 0,
      noTable: totals["false-absence:no-table"] ?? 0,
      districtMissPlannedDevelopment: Object.values(missCodes).filter((m) => m.plannedDevelopment).reduce((s, m) => s + m.parcels, 0),
    },
    noTableCities: Object.values(noTableCities).sort((a, b) => b.parcels - a.parcels),
    districtMissCodes: Object.values(missCodes).sort((a, b) => b.parcels - a.parcels),
    byDistrict: Object.values(byDistrict).sort((a, b) => b.parcels - a.parcels),
    envelope, envelopeByCity: joined ? Object.values(envelopeByCity).sort((a, b) => b.predicatePopulation - a.predicatePopulation) : null,
  };
}

// psql via a temp file: stdin piping hangs on this platform (see envelope-draw-gap.mjs).
function psqlCsv(dsn, sql, timeoutMs) {
  const dir = mkdtempSync(join(tmpdir(), "setback-census-"));
  const file = join(dir, "q.sql");
  writeFileSync(file, sql, "utf8");
  try {
    const r = spawnSync("psql", [dsn, "-X", "-q", "--csv", "-v", "ON_ERROR_STOP=1", "-f", file], {
      encoding: "utf8", maxBuffer: 512 * 1024 * 1024, timeout: timeoutMs,
      env: { ...process.env, PGOPTIONS: "-c default_transaction_read_only=on" },
    });
    if (r.error) throw new Error(`psql spawn error: ${r.error.message}`);
    if (r.status !== 0) throw new Error(`psql failed (status ${r.status}): ${(r.stderr || "").split("\n")[0]}`);
    return parseCsv(r.stdout.split(/\r?\n/).filter((l) => l !== "SET").join("\n"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const fipsOk = (f) => /^\d{5}$/.test(f);

export function factorySql(fips) {
  if (!fipsOk(fips)) throw new Error(`bad county fips ${fips}`);
  return `set default_transaction_read_only = on;
set statement_timeout = '240s';
select place_key,
  max(cell_state->>'value') filter (where rail_key = 'zoningJurisdictionKey' and cell_state->>'kind' = 'value') as city_key,
  max(cell_state->>'value') filter (where rail_key = 'zoningDistrict' and cell_state->>'kind' = 'value') as district,
  max(cell_state->>'kind') filter (where rail_key = 'zoningDistrict') as zd_kind,
  max(cell_state->>'kind') filter (where rail_key = 'setbackFrontFt') as sb_kind,
  max(cell_state->'basis'->>'method') filter (where rail_key = 'setbackFrontFt') as sb_method,
  max(cell_state->'basis'->>'finding') filter (where rail_key = 'setbackFrontFt') as sb_finding,
  max(cell_state->'basis'->>'districtCode') filter (where rail_key = 'setbackFrontFt') as sb_code,
  max(cell_state->>'resolvedTableKey') filter (where rail_key = 'setbackFrontFt') as sb_table
from parcel_record_cell
where place_key >= '${fips}:' and place_key < '${fips};'
  and rail_key in ('zoningJurisdictionKey', 'zoningDistrict', 'setbackFrontFt')
group by place_key;
`;
}

export function atomsSql(fips) {
  if (!fipsOk(fips)) throw new Error(`bad county fips ${fips}`);
  return `set default_transaction_read_only = on;
set statement_timeout = '240s';
select body->>'parcelNodeId' as place_key,
       body->'outcome'->>'kind' as kind,
       body->'outcome'->>'reason' as reason,
       (coalesce(body->>'depthWarmPromotion', '') = 'depth-warm-promoted-v1'
         or coalesce(body->>'sourceCitation', '') like '%depth-warm-verified%') as depth_warm_promoted
from atoms
where entity_type = 'buildable-envelope'
  and body->>'parcelNodeId' like '${fips}:%';
`;
}

function measure({ factoryDsn, atomsDsn, counties }) {
  const out = [];
  const errors = {};
  const atomDuplicates = {};
  for (const fips of counties) {
    const t0 = Date.now();
    let rows;
    try {
      rows = psqlCsv(factoryDsn, factorySql(fips), 260000);
    } catch (e) {
      errors[fips] = `factory: ${e.message}`;
      process.stderr.write(`[factory] ${fips} FAILED: ${e.message}\n`);
      continue;
    }
    let atoms = null;
    if (atomsDsn) {
      try {
        atoms = new Map();
        let dup = 0;
        for (const a of psqlCsv(atomsDsn, atomsSql(fips), 260000)) {
          if (atoms.has(a.place_key)) dup++;
          atoms.set(a.place_key, { kind: a.kind || null, reason: a.reason || null, depthWarmPromoted: a.depth_warm_promoted === "t" });
        }
        atomDuplicates[fips] = dup;
        if (dup) process.stderr.write(`[atoms] ${fips} ${dup} parcels carry more than one envelope atom; the last row read was used
`);
      } catch (e) {
        atoms = null;
        errors[`${fips}:atoms`] = `atoms: ${e.message}`;
        process.stderr.write(`[atoms] ${fips} FAILED (envelope figures for this county read null): ${e.message}\n`);
      }
    }
    out.push({ ...aggregate(fips, rows, atoms), atomsJoined: atoms !== null, atomDuplicates: atomDuplicates[fips] ?? null, seconds: Math.round((Date.now() - t0) / 100) / 10 });
    process.stderr.write(`[census] ${fips} ${rows.length} parcels in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
  }
  return { counties: out, errors };
}

function selfTest() {
  const results = [];
  const check = (name, cond) => results.push({ name, ok: !!cond });
  const csv = parseCsv('place_key,district,sb_finding\n48209:1,"PUD, planned","no ruled setback table exists for woodcreek-tx"\n48209:2,,"a ""quoted"" note"\n');
  check("CSV: a quoted comma stays inside its field", csv.length === 2 && csv[0].district === "PUD, planned");
  check("CSV: a doubled quote decodes and an empty field stays empty", csv[1].sb_finding === 'a "quoted" note' && csv[1].district === "");

  const noTable = { place_key: "48209:10", city_key: "", district: "", zd_kind: "refused", sb_kind: "absent-verified", sb_method: "", sb_finding: `${NO_TABLE_PREFIX}woodcreek-tx`, sb_code: "" };
  const miss = { place_key: "48209:11", city_key: "kyle-tx", district: "PC R2", zd_kind: "value", sb_kind: "absent-verified", sb_method: "setback-table-router.resolveSetbackForParcel", sb_finding: "SETBACK_ROUTER_NOT_A_DISTRICT", sb_code: "PC R2" };
  const row = { place_key: "48209:12", city_key: "san-marcos-tx", district: "SF-6", zd_kind: "value", sb_kind: "value", sb_method: "", sb_finding: "", sb_code: "", sb_table: "san-marcos-tx" };
  const layer23 = { place_key: "48021:13", city_key: "bastrop-tx", district: "", zd_kind: "value", sb_kind: "value", sb_method: "", sb_finding: "", sb_code: "", sb_table: "" };
  const tableNoDistrict = { ...row, place_key: "48209:15", district: "" };
  const odd = { place_key: "48209:14", city_key: "kyle-tx", district: "X", zd_kind: "value", sb_kind: "absent-verified", sb_method: "something-else", sb_finding: "manually confirmed", sb_code: "" };

  check("a no-table parcel is a false absence of the no-table kind", classifySetback(noTable) === "false-absence:no-table");
  check("a no-table parcel is counted under the city its finding names", cityOf(noTable) === "woodcreek-tx");
  check("a router miss is a false absence of the district-miss kind", classifySetback(miss) === "false-absence:district-miss");
  check("an absent-verified cell with another basis is NOT silently counted as a false absence", classifySetback(odd) === "absent-verified:other");
  check("a missing cell reads no-cell, not a value", classifySetback({}) === "no-cell");

  const agg = aggregate("48209", [noTable, noTable, miss, row], null);
  check("NOT VACUOUS: a city with no table shows a non-zero false absence", agg.falseAbsence.noTable === 2 && agg.noTableCities[0].city === "woodcreek-tx" && agg.noTableCities[0].zoningRefused === 2);
  check("the district miss is counted with its raw code", agg.falseAbsence.districtMiss === 1 && agg.districtMissCodes[0].code === "PC R2");
  check("atoms not joined: every envelope figure is null, never zero", agg.envelope.gapUpperBound === null && agg.envelopeByCity === null);

  check("ROW and blank are non-district candidates; SF-2 and PUD are not", isNonDistrictCandidate("ROW") && isNonDistrictCandidate("") && !isNonDistrictCandidate("SF-2") && !isNonDistrictCandidate("PUD"));
  check("REGRESSION: RR (Austin Rural Residence) and W are NOT non-district candidates", !isNonDistrictCandidate("RR") && !isNonDistrictCandidate("W"));
  check("planned-development codes are recognised (PUD, PDD, PD, PC R2, PUD-SF) and ordinary districts are not",
    ["PUD", "PDD", "PD", "PC R2", "PUD-SF"].every((c) => PLANNED_DEVELOPMENT.test(c)) && !["SF-2", "PI", "GC", "MU", "PR"].some((c) => PLANNED_DEVELOPMENT.test(c)));

  const unverifiedZero = { kind: "no-buildable-area", reason: null, depthWarmPromoted: false };
  const e1 = envelopeClass(row, unverifiedZero);
  check("P-249: a table-routed setback with a district and an unverified zero is in both populations", e1.gapUpperBound && e1.predicatePopulation && e1.reasonlessZeroBlocked);
  const e2 = envelopeClass(layer23, unverifiedZero);
  check("P-249: a setback from a non-table source is in the upper bound only", e2.gapUpperBound && !e2.predicatePopulation);
  const e3 = envelopeClass(row, { kind: "no-buildable-area", reason: "Setbacks consume the lot", depthWarmPromoted: true });
  check("P-249 NEGATIVE CONTROL: a depth-warm verified zero is in neither population", !e3.gapUpperBound && !e3.predicatePopulation && !e3.reasonlessZeroBlocked);
  const e4 = envelopeClass(row, { kind: "no-buildable-area", reason: "edge 1: R32 35.02831192164916ft != expected 5ft for role side; edge 2: x", depthWarmPromoted: false });
  check("P-249: a machine-verify diagnostic is in neither population", !e4.gapUpperBound && !e4.predicatePopulation);
  const e5 = envelopeClass(miss, unverifiedZero);
  check("P-249: a parcel with no setback value is in neither population, but its reasonless zero is counted", !e5.gapUpperBound && !e5.predicatePopulation && e5.reasonlessZeroBlocked);
  check("P-249: a table-routed value with no district on record is in the upper bound only", (() => { const e = envelopeClass(tableNoDistrict, unverifiedZero); return e.gapUpperBound && !e.predicatePopulation; })());
  check("REGRESSION (first live run read 0): a value cell recognised by resolvedTableKey, with no basis.method, is in the predicate population", envelopeClass({ ...row, sb_method: undefined }, unverifiedZero).predicatePopulation === true);
  check("P-249: a buildable atom is in neither population", !envelopeClass(row, { kind: "buildable" }).gapUpperBound);

  const aggJ = aggregate("48209", [row, layer23, miss], new Map([[row.place_key, unverifiedZero], [layer23.place_key, unverifiedZero]]));
  check("aggregate with atoms: upper bound 2, predicate 1, reasonless 2", aggJ.envelope.gapUpperBound === 2 && aggJ.envelope.predicatePopulation === 1 && aggJ.envelope.reasonlessZeroBlocked === 2);
  check("a malformed county fips is refused before any SQL is built", (() => { try { factorySql("48209'; drop"); return false; } catch { return true; } })());

  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad}/${results.length})` : `SELF-TEST OK (${results.length})`);
  process.exit(bad ? 1 : 0);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const factoryDsn = process.env.FACTORY_DATABASE_URL_RO;
  if (!factoryDsn) { console.error("UNMEASURED: FACTORY_DATABASE_URL_RO is not set"); process.exit(2); }
  const atomsDsn = process.env.ATOMS_DATABASE_URL || null;
  const ci = args.indexOf("--counties");
  const counties = ci >= 0 ? args[ci + 1].split(",") : Object.keys(SIX);
  const started = new Date().toISOString();
  const { counties: res, errors } = measure({ factoryDsn, atomsDsn, counties });
  if (!res.length) { console.error(`UNMEASURED: every county failed ${JSON.stringify(errors)}`); process.exit(2); }
  const sum = (f) => res.reduce((n, c) => (n == null || f(c) == null ? null : n + f(c)), 0);
  const result = {
    instrument: "scripts/setback-parcel-census.mjs", ranAt: started, atomsRequested: !!atomsDsn, errors,
    totals: {
      parcels: sum((c) => c.parcels),
      falseAbsenceDistrictMiss: sum((c) => c.falseAbsence.districtMiss),
      falseAbsenceNoTable: sum((c) => c.falseAbsence.noTable),
      falseAbsenceDistrictMissPlannedDevelopment: sum((c) => c.falseAbsence.districtMissPlannedDevelopment),
      noTableCities: new Set(res.flatMap((c) => c.noTableCities.map((x) => `${c.countyFips}|${x.city}`))).size,
      gapUpperBound: sum((c) => c.envelope.gapUpperBound),
      predicatePopulation: sum((c) => c.envelope.predicatePopulation),
      reasonlessZeroBlocked: sum((c) => c.envelope.reasonlessZeroBlocked),
    },
    counties: res,
  };
  const oi = args.indexOf("--json");
  if (oi >= 0) writeFileSync(args[oi + 1], JSON.stringify(result, null, 1));
  console.log(`SETBACK PARCEL CENSUS  ran ${started}  atoms=${atomsDsn ? "requested" : "not requested"}`);
  console.log(JSON.stringify(result.totals));
  for (const c of res) {
    console.log(`${c.countyFips} ${c.county.padEnd(10)} parcels=${c.parcels} districtMiss=${c.falseAbsence.districtMiss} noTable=${c.falseAbsence.noTable} noTableCities=${c.noTableCities.length} ` +
      `gapUpper=${c.envelope.gapUpperBound} predicate=${c.envelope.predicatePopulation} reasonlessZero=${c.envelope.reasonlessZeroBlocked} (${c.seconds}s)`);
  }
  if (Object.keys(errors).length) console.log(`ERRORS ${JSON.stringify(errors)}`);
  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
