#!/usr/bin/env node
/**
 * envelope-draw-gap.mjs -- the L-B instrument for OPS-24 P-249: per city, how many parcels
 * carry a setback ON RECORD (factory store) but draw NO buildable envelope (atoms store)?
 *
 * Two independent stores, joined by place_key ("{countyFips}:{propId}", the parcel-map id --
 * OPS-21 identity paragraph: never joined by bare number):
 *   1. factory store (FACTORY_DATABASE_URL_RO): parcel_record_cell, rail_key='setbackFrontFt',
 *      cell_state->>'kind'. 'value' = a real setback distance is on record for this parcel.
 *      situsCity rail supplies the per-city grouping (raw CAD text -- see CITY_ALIASES; a
 *      parcel whose city does not match a known alias for the county's wired cities buckets to
 *      "(unincorporated/other)", never silently dropped).
 *   2. atoms store (ATOMS_DATABASE_URL): entity_type='buildable-envelope', keyed by
 *      body->>'parcelNodeId' (the documented partial index for this family). outcome.kind
 *      classifies into DRAWN ("buildable", or "no-buildable-area" when the reason is a
 *      machine-verify diagnostic per P-214's isMachineVerifyDiagnostic -- see reconcileLogic
 *      below) vs NOT DRAWN.
 *
 * The headline bucket is GAP: setback on record (kind='value') AND envelope atom says
 * no-buildable-area for a non-diagnostic, non-depth-warm-verified reason. This is P-249's
 * target population -- the parcels a generalized depth-warm-gated reconciliation predicate
 * would unlock. depthWarmPromoted atoms (verified) and machine-verify-diagnostic reasons are
 * carved OUT of GAP and counted separately (NOT_A_GAP_* buckets) so the instrument cannot be
 * tricked into recommending an override for a genuinely-verified zero (falsifier 3).
 *
 * Usage:
 *   FACTORY_DATABASE_URL_RO=<dsn> [ATOMS_DATABASE_URL=<dsn>] node scripts/envelope-draw-gap.mjs [--json <out>]
 *   node scripts/envelope-draw-gap.mjs --self-test
 *
 * Exit codes: 0 measured (factory-only or factory+atoms), 2 UNMEASURED (no FACTORY DSN, or a
 * query failed). Missing ATOMS_DATABASE_URL is NOT an error -- the atoms-store sequencing gate
 * (AGENT_CONTRACT section 4, heavy-scan serialization) may still be held by another lane; the
 * result carries `atomsJoined: false` and every GAP-dependent count reads null / UNMEASURED
 * rather than a false zero (DEV_PROCESS 4.3: an empty result is not an absence).
 *
 * DSNs are read from the environment and NEVER printed. Requires `psql` on PATH.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

export const SIX = {
  "48021": "Bastrop",
  "48055": "Caldwell",
  "48209": "Hays",
  "48309": "McLennan",
  "48453": "Travis",
  "48491": "Williamson",
};

/**
 * The wired cities named in the OPS-24 L-B dispatch, with the raw CAD situsCity spellings
 * observed live in the factory store on 2026-09-16 (see _inbox/2026-09-16_scaleup-lb-envelope-
 * roads_report.md query q1) that should roll up to each. Anything not listed here, for a
 * county below, buckets to "(unincorporated/other)" -- NEVER silently merged into a named city
 * (DEV_PROCESS 1.3: measure the class you are reporting, never derive it by subtraction).
 */
export const CITY_ALIASES = {
  "48021": { Bastrop: ["BASTROP", "BASTROP TEXAS"], Elgin: ["ELGIN", "ELGIN TEXAS"], Smithville: ["SMITHVILLE"] },
  "48055": { Lockhart: ["LOCKHART"], Luling: ["LULING"], Kyle: ["KYLE"] },
  "48209": { Kyle: ["KYLE"], "San Marcos": ["SAN MARCOS", "SAN MARCOS TX"], Buda: ["BUDA"], "Dripping Springs": ["DRIPPING SPRINGS", "DRIPPING SPRINGS TX"] },
  "48309": { Waco: ["WACO"], Woodway: ["WOODWAY"], Hewitt: ["HEWITT"] },
  "48453": { Austin: ["AUSTIN"], Pflugerville: ["PFLUGERVILLE"], "Cedar Park": ["CEDAR PARK"], "Round Rock": ["ROUND ROCK"] },
  "48491": { Georgetown: ["GEORGETOWN"], "Round Rock": ["ROUND ROCK"], Leander: ["LEANDER"], "Cedar Park": ["CEDAR PARK"], Hutto: ["HUTTO"], Taylor: ["TAYLOR"] },
};

const UNINC = "(unincorporated/other)";

/** Pure. Raw CAD situsCity text (may be null/misspelled) -> canonical wired-city name or UNINC. */
export function normalizeCity(countyFips, rawCity) {
  const aliases = CITY_ALIASES[countyFips];
  if (!aliases || !rawCity) return UNINC;
  const upper = rawCity.trim().toUpperCase();
  for (const [canonical, spellings] of Object.entries(aliases)) {
    if (spellings.includes(upper)) return canonical;
  }
  return UNINC;
}

/**
 * Reason-class buckets, mirroring the dispatch's scope-section-2c breakdown of the 490,185
 * no-buildable-area atoms, PLUS the P-214 machine-verify-diagnostic class this instrument
 * discovered is load-bearing for the reconciliation predicate (LDT reconcileAtomEnvelope.ts
 * isMachineVerifyDiagnostic, legacy-design-tools/artifacts/api-server/src/lib/buildableEnvelope/
 * reconcileAtomEnvelope.ts). Order matters: first match wins.
 */
const REASON_CLASSES = [
  { id: "machine-verify-diagnostic", test: (r) => /; /.test(r) || /\b(edge|road)\s+\S+:/i.test(r) || /\d+\.\d{4,}/.test(r) },
  { id: "unzoned", test: (r) => /unzoned/i.test(r) },
  { id: "not-onboarded", test: (r) => /not.?(yet)?.?onboard/i.test(r) },
  { id: "no-layer-23", test: (r) => /layer.?23/i.test(r) },
  { id: "road-edge-failure", test: (r) => /\bedge\b|\broad\b/i.test(r) },
  { id: "inset-failure", test: (r) => /inset/i.test(r) },
  { id: "superseded", test: (r) => /supersed/i.test(r) },
];

/** Pure. atom `reason` string (may be null/empty) -> reason class id. */
export function classifyReason(reason) {
  if (reason == null || reason.trim() === "") return "zero-no-reason";
  for (const c of REASON_CLASSES) if (c.test(reason)) return c.id;
  return "zero-other-reason";
}

/**
 * Pure. Classifies one parcel's draw-gap bucket from its factory-store setback kind and
 * (when the atoms store was joined) its envelope atom outcome. `envelope` is null when the
 * atoms store was not queried (gate not yet cleared) -- distinct from an envelope atom that
 * does not exist for this parcel at all (`envelope: undefined`... no: absence of an atom is
 * represented by passing envelope as {kind: null}, never by omitting the argument, so a
 * caller cannot accidentally conflate "not joined" with "no atom").
 */
export function classifyParcel(setbackKind, envelope) {
  const hasSetback = setbackKind === "value";
  if (envelope === null) {
    return hasSetback ? "SETBACK_ON_RECORD_ATOMS_UNJOINED" : "NO_SETBACK_ATOMS_UNJOINED";
  }
  const kind = envelope?.kind ?? null;
  if (kind === "buildable") return hasSetback ? "DRAWN" : "DRAWN_NO_SETBACK_RECORD";
  if (kind === "no-buildable-area") {
    const reasonClass = classifyReason(envelope.reason ?? null);
    const depthWarm = envelope.depthWarmPromoted === true;
    if (!hasSetback) return "NOT_A_GAP_NO_SETBACK_RECORD";
    if (depthWarm) return "NOT_A_GAP_DEPTH_WARM_VERIFIED_ZERO"; // falsifier 3 negative control
    if (reasonClass === "machine-verify-diagnostic") return "NOT_A_GAP_MACHINE_DIAGNOSTIC"; // P-214 already exempts this
    return "GAP"; // the P-249 headline bucket
  }
  // no envelope atom at all, or an unrecognized/pending kind (e.g. provisional-front-edge)
  return hasSetback ? "SETBACK_ON_RECORD_NO_ENVELOPE_ATOM" : "NO_SETBACK_NO_ENVELOPE_ATOM";
}

// NOTE: piping SQL to `psql` via spawnSync's `input:` (stdin) was found to HANG
// indefinitely on this platform (psql.exe never observes EOF on a Node-created pipe,
// confirmed by a standalone repro: spawnSync with `input:` returned status:null after a
// 60s timeout with empty stdout/stderr, while the identical SQL run via `psql -f <file>`
// completed in under 25s). Always use a real temp file with `-f`, never stdin piping.
function psqlCsv(dsn, sql, { timeoutMs = 340000 } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "envelope-draw-gap-"));
  const file = join(dir, "q.sql");
  writeFileSync(file, sql, "utf8");
  try {
    const r = spawnSync("psql", [dsn, "-X", "-q", "--csv", "-v", "ON_ERROR_STOP=1", "-f", file], {
      encoding: "utf8", maxBuffer: 128 * 1024 * 1024, timeout: timeoutMs,
    });
    if (r.error) throw new Error(`psql spawn error: ${r.error.message}`);
    if (r.status !== 0) throw new Error(`psql failed (status ${r.status}): ${(r.stderr || "").split("\n")[0]}`);
    const lines = r.stdout.trim().split(/\r?\n/).filter((l) => l && l !== "SET");
    if (!lines.length) return [];
    const header = lines.shift().split(",");
    return lines.map((l) => Object.fromEntries(l.split(",").map((v, i) => [header[i], v])));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Run per-county rather than one six-county scan: parcel_record_cell has no county-prefix
// index on place_key (its PK is (place_key, rail_key), county is not the leading column), so
// this does not shrink the underlying rail_key scan cost -- but it bounds each query's blast
// radius and lets a slow/degraded county fail in isolation rather than discarding five good
// counties' results (observed live 2026-09-16: the un-chunked six-county query, which ran in
// 18.8s once, took 73s+ for HALF its own join on a later attempt under what looks like a cold
// Neon compute/buffer-cache state -- DEV_PROCESS 1.5, state the environment).
function factorySqlForCounty(fips) {
  return `
set default_transaction_read_only = on;
set statement_timeout = '170s';
with city as (
  select place_key, cell_state->>'value' as city
  from parcel_record_cell where rail_key = 'situsCity' and place_key like '${fips}:%'
),
sb as (
  select place_key, cell_state->>'kind' as kind
  from parcel_record_cell where rail_key = 'setbackFrontFt' and place_key like '${fips}:%'
)
select sb.place_key, city.city, sb.kind
from sb left join city on city.place_key = sb.place_key;
`;
}

/** entity_type='buildable-envelope' is index-bounded on body->>'parcelNodeId' (text_pattern_ops
 *  partial index) per the operational access notes -- filtered per-county via LIKE 'FIPS:%'
 *  rather than an unbounded scan, run once per county so no single query is a full-table scan. */
function atomsSqlForCounty(fips) {
  return `
set default_transaction_read_only = on;
set statement_timeout = '240s';
select body->>'parcelNodeId' as place_key,
       body->'outcome'->>'kind' as kind,
       body->'outcome'->>'reason' as reason,
       (body->>'depthWarmPromotion' = 'depth-warm-promoted-v1'
         or (body->>'sourceCitation') like '%depth-warm-verified%') as depth_warm_promoted
from atoms
where entity_type = 'buildable-envelope'
  and body->>'parcelNodeId' like '${fips}:%';
`;
}

function measure({ factoryDsn, atomsDsn, counties = Object.keys(SIX) }) {
  const byPlace = new Map();
  const factoryCountyErrors = {};
  for (const fips of counties) {
    const t0 = Date.now();
    process.stderr.write(`[factory] ${fips} (${SIX[fips] ?? fips}) starting...\n`);
    try {
      const rows = psqlCsv(factoryDsn, factorySqlForCounty(fips), { timeoutMs: 190000 });
      for (const r of rows) byPlace.set(r.place_key, { countyFips: fips, city: r.city, kind: r.kind });
      process.stderr.write(`[factory] ${fips} done: ${rows.length} rows in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
    } catch (e) {
      factoryCountyErrors[fips] = e.message;
      process.stderr.write(`[factory] ${fips} FAILED after ${((Date.now() - t0) / 1000).toFixed(1)}s: ${e.message}\n`);
    }
  }

  let atomsJoined = false;
  const atomsCountyErrors = {};
  if (atomsDsn) {
    atomsJoined = true;
    for (const fips of counties) {
      const t0 = Date.now();
      process.stderr.write(`[atoms] ${fips} (${SIX[fips] ?? fips}) starting...\n`);
      try {
        const aRows = psqlCsv(atomsDsn, atomsSqlForCounty(fips));
        for (const a of aRows) {
          const p = byPlace.get(a.place_key);
          if (!p) continue; // atom exists for a parcel with no setback-rail cell at all; not this instrument's denominator
          p.envelope = { kind: a.kind || null, reason: a.reason || null, depthWarmPromoted: a.depth_warm_promoted === "t" };
        }
        process.stderr.write(`[atoms] ${fips} done: ${aRows.length} atom rows in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
      } catch (e) {
        // A single county's heavy scan timing out is not grounds to discard every other
        // county's result (DEV_PROCESS 5.2: an honest partial close beats a narrated full
        // close). That county's parcels keep envelope=null (ATOMS_UNJOINED), and the error is
        // reported explicitly rather than silently folded into a false zero.
        atomsCountyErrors[fips] = e.message;
        process.stderr.write(`[atoms] ${fips} FAILED after ${((Date.now() - t0) / 1000).toFixed(1)}s: ${e.message}\n`);
      }
    }
  }

  const buckets = {};
  const perCity = {};
  for (const [placeKey, p] of byPlace) {
    const city = normalizeCity(p.countyFips, p.city);
    const bucket = classifyParcel(p.kind, atomsJoined ? (p.envelope ?? { kind: null }) : null);
    buckets[bucket] = (buckets[bucket] ?? 0) + 1;
    const key = `${p.countyFips}|${city}`;
    perCity[key] ??= { countyFips: p.countyFips, county: SIX[p.countyFips] ?? p.countyFips, city, buckets: {} };
    perCity[key].buckets[bucket] = (perCity[key].buckets[bucket] ?? 0) + 1;
  }
  return { atomsJoined, atomsCountyErrors, factoryCountyErrors, totalParcels: byPlace.size, buckets, perCity: Object.values(perCity), byPlace };
}

function selfTest() {
  const results = [];
  const check = (name, cond) => results.push({ name, ok: !!cond });

  check("normalizeCity: exact alias match", normalizeCity("48209", "SAN MARCOS") === "San Marcos");
  check("normalizeCity: alias-list variant matches", normalizeCity("48209", "SAN MARCOS TX") === "San Marcos");
  check("normalizeCity: unmatched spelling buckets to unincorporated/other, never silently merged", normalizeCity("48209", "SAN MRCOS") === UNINC);
  check("normalizeCity: null city buckets to unincorporated/other", normalizeCity("48209", null) === UNINC);
  check("normalizeCity: unknown county buckets to unincorporated/other", normalizeCity("99999", "SAN MARCOS") === UNINC);

  check("classifyReason: machine-verify diagnostic (live P-214 48021:8723767 string)",
    classifyReason("edge 1: R32 35.02831192164916ft != expected 5ft for role side; edge 4: R32 53.60964475445567ft != expected 25ft for role rear") === "machine-verify-diagnostic");
  check("classifyReason: empty/null reason", classifyReason(null) === "zero-no-reason" && classifyReason("") === "zero-no-reason");
  check("classifyReason: unzoned", classifyReason("Parcel is unzoned") === "unzoned");
  check("classifyReason: not onboarded", classifyReason("City not yet onboarded") === "not-onboarded");
  check("classifyReason: human-authored reason falls to other, never mistaken for a diagnostic",
    classifyReason("Setbacks consume the lot per engine calculation.") === "zero-other-reason");

  // classifyParcel -- NOT VACUOUS falsifiers, F2/F3 shape.
  const sanMarcosLike = classifyParcel("value", { kind: "no-buildable-area", reason: null, depthWarmPromoted: false });
  check("F2 San-Marcos-shaped parcel (setback on record, unverified reasonless zero) lands in GAP", sanMarcosLike === "GAP");

  const pflugervilleLike = classifyParcel("value", { kind: "buildable", reason: null, depthWarmPromoted: false });
  check("F2 Pflugerville-shaped parcel (setback on record, buildable atom) is NOT in GAP", pflugervilleLike !== "GAP" && pflugervilleLike === "DRAWN");

  const verifiedConsumedLot = classifyParcel("value", { kind: "no-buildable-area", reason: "Setbacks consume the lot per engine calculation.", depthWarmPromoted: true });
  check("F3 NEGATIVE CONTROL: a depth-warm-VERIFIED no-buildable-area lot is excluded from GAP", verifiedConsumedLot === "NOT_A_GAP_DEPTH_WARM_VERIFIED_ZERO");

  const diagnosticLot = classifyParcel("value", { kind: "no-buildable-area", reason: "edge 1: R32 35.0ft != expected 5ft for role side; edge 2: x", depthWarmPromoted: false });
  check("F3 a machine-verify-diagnostic reason is excluded from GAP (P-214 already handles it)", diagnosticLot === "NOT_A_GAP_MACHINE_DIAGNOSTIC");

  const noSetbackNoEnvelope = classifyParcel("absent-verified", { kind: null, reason: null, depthWarmPromoted: false });
  check("a parcel with no setback on record is never counted as a gap even with no envelope atom", noSetbackNoEnvelope !== "GAP");

  const unjoined = classifyParcel("value", null);
  check("atoms-store-unjoined parcels read as explicitly unjoined, never silently zero", unjoined === "SETBACK_ON_RECORD_ATOMS_UNJOINED");

  check("CITY_ALIASES declares all six counties", Object.keys(CITY_ALIASES).length === 6 && Object.keys(SIX).every((f) => f in CITY_ALIASES));

  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad}/${results.length})` : `SELF-TEST OK (${results.length})`);
  process.exit(bad ? 1 : 0);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const factoryDsn = process.env.FACTORY_DATABASE_URL_RO;
  if (!factoryDsn) {
    console.error("UNMEASURED: FACTORY_DATABASE_URL_RO is not set");
    process.exit(2);
  }
  const atomsDsn = process.env.ATOMS_DATABASE_URL || null;
  const started = new Date().toISOString();
  let result;
  try {
    result = measure({ factoryDsn, atomsDsn });
  } catch (e) {
    console.error(`UNMEASURED: ${e.message}`);
    process.exit(2);
  }
  result.byPlace = undefined; // do not serialize the full per-parcel map by default
  result.snapshot = { ranAt: started, atomsJoined: result.atomsJoined };
  const outIdx = args.indexOf("--json");
  if (outIdx >= 0) writeFileSync(args[outIdx + 1], JSON.stringify(result, null, 2));
  console.log(`ENVELOPE DRAW GAP  atomsJoined=${result.atomsJoined}  totalParcels=${result.totalParcels}  (ran ${started})`);
  for (const [bucket, n] of Object.entries(result.buckets).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(9)}  ${bucket}`);
  }
  console.log("--- per city (bucket counts) ---");
  for (const c of result.perCity.sort((a, b) => a.countyFips.localeCompare(b.countyFips) || (b.buckets.GAP ?? 0) - (a.buckets.GAP ?? 0))) {
    console.log(`${c.countyFips} ${c.county.padEnd(10)} ${c.city.padEnd(20)} ${JSON.stringify(c.buckets)}`);
  }
  process.exit(0);
}

// Only when run directly: scripts/setback-parcel-census.mjs imports classifyReason (P-255).
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
