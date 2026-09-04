#!/usr/bin/env node
/**
 * W0 post-H residue recount (CTX facts-complete WDLL item 2).
 *
 * REPAIRED 2026-08-30 per _inbox/2026-08-30_ctx_remainder_deep_review.md
 * item 2 and the facts-complete WDLL item 10 leave-behind
 * (write guard, run-time commit, host, publishRunId assert, ownersAgree column).
 *
 * Single source of truth for classification: COLUMN_SPEC below pairs each
 * counted column's SQL expression with the JS predicate that means the same
 * thing, and LIVE_SQL is GENERATED from that spec. Deleting a clause from the
 * SQL is not possible without deleting the spec entry, which the self-tests
 * then catch. The prior standalone classifyBody/tally pair was dead code that
 * the live path never called and had already drifted from the SQL; it is gone.
 *
 * Usage:
 *   node scripts/ctx/post-h-residue-recount.mjs --self-test
 *   node scripts/ctx/post-h-residue-recount.mjs --sql        (print generated SQL, no DB)
 *   node scripts/ctx/post-h-residue-recount.mjs --live
 *
 * --live always runs --self-test first. Missing DATABASE_URL /
 * PRODUCTION_NEONDB_URL exits 2 with liveStatus unmeasured (does not
 * invent 0 remainder) and DOES NOT WRITE the report.
 *
 * Write guard (repair 1): the report file is written only when this module is
 * the process entrypoint, --live was passed, the payload carries this control,
 * and live.liveStatus === "measured". Importing this module writes nothing and
 * runs nothing. A failed --live never overwrites a good measurement.
 *
 * Exclusion set:
 *   - Does not write a store.
 *   - Does not quote 534700 as the live remainder.
 *   - Does not invent a geo_id join.
 *   - Does not lift LANDUSE_JOIN_DISABLED_FIPS_SEED.
 *   - Never prints or records a connection string, user, or password.
 */

import { spawnSync } from "node:child_process";
import { writeFileSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REPORT_PATH = join(ROOT, "_inbox", "2026-08-30_ctx_w0_residue_recount.json");

export const CONTROL = "ctx-w0-residue-recount";
export const PLAN_ROWS = ["F-05", "F-06", "F-08"];

// REPAIRED 2026-09-04: `writeReport`'s liveFlag/isMain were read from the REAL
// process.argv/entrypoint, not the self-test's fixture inputs. `--live` always
// runs selfTest() first (see the Usage note above), so the moment selfTest()
// exercised the real writeReport() to prove it refuses, the real process WAS
// already the entrypoint AND already had --live in argv -- both true for real,
// independent of what the self-test intended to simulate. The guard's other
// three gates were all fine; this one was checking a fixture that could never
// actually occur (self-test always run standalone), so it never caught that a
// real --live invocation's own self-test satisfies every gate for real and
// writes. Confirmed live: it truncated the committed report to 88 bytes on the
// first --live attempt after this file's original 2026-08-30 repair. IN_SELF_TEST
// is the second, independent input the guard needed -- set only for the
// duration of selfTest() itself, unrelated to argv or entrypoint identity.
let IN_SELF_TEST = false;
export const WDLL = "_inbox/2026-08-30_ctx_facts_complete_WDLL.md item 2";
export const SCHEMA_VERSION = "node-facets-tier1-conformant-v1";
export const ADAPTER_KEY = "node-facets:tier1";

export const CARD_H_RUNS = {
  48021: "e2c5c6d7",
  48055: "cd961998",
  48309: "70a92b2a",
  48453: "bb77fa65",
  48209: "003cdc7c",
  48491: "4a4efa03",
};

export const COUNTIES = [
  { fips: "48021", name: "Bastrop" },
  { fips: "48055", name: "Caldwell" },
  { fips: "48309", name: "McLennan" },
  { fips: "48453", name: "Travis" },
  { fips: "48209", name: "Hays" },
  { fips: "48491", name: "Williamson" },
];

/** LANDUSE_JOIN_DISABLED_FIPS_SEED. A prop_id join fabricates on these two. */
export const BLOCKED_FIPS = ["48209", "48491"];

export const JOIN_STATES = ["joined", "joined-situs", "gate-blocked", "no-row"];

/**
 * Pre-H figures, each carrying its source. These were bare literals inside the
 * reading block with no provenance until the 2026-08-30 repair.
 */
export const PRE_H = {
  source: "_inbox/2026-08-28_ctx-f_cp1.json (card F CP1, 2026-08-28T19:48Z)",
  unstamped_sentinel_total: 534700,
  join_no_row: { 48453: 119389 },
};

/**
 * Owner-gate provenance the card H bake writes.
 * Field names evidenced by _inbox/2026-08-29_ctx-h_cp2.json lines 39-42 and
 * _inbox/2026-08-28_ctx-e_cp1.json line 45.
 */
export const OWNER_AGREE_SOURCE_VALUE = "cad-roll-address-join";

// ---------------------------------------------------------------------------
// Row accessors. These mirror what the SQL sees: a place_layer_snapshots ROW,
// with lat_rounded / lng_rounded as TABLE COLUMNS (not payload fields) and
// everything else under payload_json. The retired classifyBody read lat/lng out
// of the payload, which is one of the ways it had drifted from the live path.
// ---------------------------------------------------------------------------

function jget(row, path) {
  let cur = row?.payload_json;
  for (const key of path) {
    if (cur === null || cur === undefined || typeof cur !== "object") return null;
    cur = cur[key];
  }
  return cur === undefined ? null : cur;
}

/** Mirrors postgres ->> / #>> : returns text or null. */
function asText(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : null;
  return JSON.stringify(value);
}

/** Mirrors postgres COALESCE(expr, ''). */
function coalesceText(value) {
  const t = asText(value);
  return t === null ? "" : t;
}

function isNullCol(value) {
  return value === null || value === undefined;
}

/** Mirrors postgres `col = n` on a numeric column: NULL is not equal. */
function colEq(value, n) {
  if (isNullCol(value)) return false;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) && num === n;
}

function joinStateText(row) {
  return asText(jget(row, ["provenance", "parcelJoin", "state"]));
}

// ---------------------------------------------------------------------------
// Predicates. Each carries BOTH halves. The SQL is generated from `sql`; the
// self-tests exercise `js`. They cannot be added or deleted independently
// because a counted column exists only if this entry exists.
// ---------------------------------------------------------------------------

const JOIN_PATH_SQL = "payload_json #>> '{provenance,parcelJoin,state}'";
const LUAR_PATH_SQL = "payload_json #>> '{provenance,landUseAddressRecovered}'";
const LUSRC_PATH_SQL = "payload_json #>> '{provenance,landUseSource}'";

function and(...ps) {
  return {
    sql: ps.map((p) => `(${p.sql})`).join(" AND "),
    js: (row) => ps.every((p) => p.js(row)),
  };
}

function not(p) {
  return { sql: `NOT (${p.sql})`, js: (row) => !p.js(row) };
}

function joinIs(state) {
  return { sql: `${JOIN_PATH_SQL} = '${state}'`, js: (row) => joinStateText(row) === state };
}

export const P = {
  conformant: {
    sql: `payload_json->>'facetSchemaVersion' = '${SCHEMA_VERSION}'`,
    js: (row) => asText(jget(row, ["facetSchemaVersion"])) === SCHEMA_VERSION,
  },
  nonconformant: {
    sql: `payload_json->>'facetSchemaVersion' IS DISTINCT FROM '${SCHEMA_VERSION}'`,
    js: (row) => asText(jget(row, ["facetSchemaVersion"])) !== SCHEMA_VERSION,
  },
  // NOTE: no trim(). The live SQL does not trim, so a whitespace-only district
  // counts as stamped in production. Mirroring that rather than silently
  // redefining the measure mid-repair. Known limitation, not fixed here.
  stamped: {
    sql: `COALESCE(payload_json->'zoning'->>'district','') <> '' OR COALESCE(payload_json->'zoning'->>'jurisdictionKey','') <> ''`,
    js: (row) =>
      coalesceText(jget(row, ["zoning", "district"])) !== "" ||
      coalesceText(jget(row, ["zoning", "jurisdictionKey"])) !== "",
  },
  point_sentinel: {
    sql: `lat_rounded = 0 AND lng_rounded = 0`,
    js: (row) => colEq(row?.lat_rounded, 0) && colEq(row?.lng_rounded, 0),
  },
  point_absent: {
    sql: `lat_rounded IS NULL OR lng_rounded IS NULL`,
    js: (row) => isNullCol(row?.lat_rounded) || isNullCol(row?.lng_rounded),
  },
  point_usable: {
    sql: `lat_rounded IS NOT NULL AND lng_rounded IS NOT NULL AND NOT (lat_rounded = 0 AND lng_rounded = 0)`,
    js: (row) =>
      !isNullCol(row?.lat_rounded) &&
      !isNullCol(row?.lng_rounded) &&
      !(colEq(row?.lat_rounded, 0) && colEq(row?.lng_rounded, 0)),
  },
  join_joined: joinIs("joined"),
  join_joined_situs: joinIs("joined-situs"),
  join_gate_blocked: joinIs("gate-blocked"),
  join_no_row: joinIs("no-row"),
  join_unmeasured: {
    sql: `${JOIN_PATH_SQL} IS NULL OR ${JOIN_PATH_SQL} = ''`,
    js: (row) => {
      const s = joinStateText(row);
      return s === null || s === "";
    },
  },
  join_other: {
    sql: `${JOIN_PATH_SQL} IS NOT NULL AND ${JOIN_PATH_SQL} NOT IN ('', ${JOIN_STATES.map((s) => `'${s}'`).join(", ")})`,
    js: (row) => {
      const s = joinStateText(row);
      return s !== null && s !== "" && !JOIN_STATES.includes(s);
    },
  },
  owner_agree_recorded: {
    sql: `${LUAR_PATH_SQL} = 'true'`,
    js: (row) => asText(jget(row, ["provenance", "landUseAddressRecovered"])) === "true",
  },
  owner_agree_source: {
    sql: `${LUSRC_PATH_SQL} = '${OWNER_AGREE_SOURCE_VALUE}'`,
    js: (row) => asText(jget(row, ["provenance", "landUseSource"])) === OWNER_AGREE_SOURCE_VALUE,
  },
};

// joined-situs claimed but the owner gate not recorded as fired, or the
// reverse. Either direction is a defect that the join count alone hides.
P.owner_agree_conflict = {
  sql: `COALESCE(${JOIN_PATH_SQL} = 'joined-situs', false) <> COALESCE(${LUAR_PATH_SQL} = 'true', false)`,
  js: (row) => P.join_joined_situs.js(row) !== P.owner_agree_recorded.js(row),
};

P.unstamped = not(P.stamped);
P.unstamped_sentinel = and(P.conformant, not(P.stamped), P.point_sentinel);

/**
 * The counted columns. LIVE_SQL is generated from this list and the parser
 * reads these names out of the psql header. One list, no second place to drift.
 */
export const COLUMN_SPEC = [
  { name: "conformant", pred: P.conformant },
  { name: "nonconformant", pred: P.nonconformant },
  { name: "stamped", pred: P.stamped },
  { name: "unstamped", pred: P.unstamped },
  { name: "point_usable", pred: P.point_usable },
  { name: "point_sentinel", pred: P.point_sentinel },
  { name: "point_absent", pred: P.point_absent },
  { name: "join_joined", pred: P.join_joined },
  { name: "join_joined_situs", pred: P.join_joined_situs },
  { name: "join_gate_blocked", pred: P.join_gate_blocked },
  { name: "join_no_row", pred: P.join_no_row },
  { name: "join_unmeasured", pred: P.join_unmeasured },
  { name: "join_other", pred: P.join_other },
  { name: "unstamped_sentinel", pred: P.unstamped_sentinel },
  { name: "owner_agree_recorded", pred: P.owner_agree_recorded },
  { name: "owner_agree_source", pred: P.owner_agree_source },
  { name: "owner_agree_conflict", pred: P.owner_agree_conflict },
];

const PUBLISH_RUN_EXPR = "left(payload_json->>'publishRunId', 8)";
export const AGG_SPEC = [
  { name: "publish_runs", sql: `COUNT(DISTINCT ${PUBLISH_RUN_EXPR})` },
  { name: "publish_run_min", sql: `MIN(${PUBLISH_RUN_EXPR})` },
  { name: "publish_run_max", sql: `MAX(${PUBLISH_RUN_EXPR})` },
];

export function buildLiveSql() {
  const counted = COLUMN_SPEC.map(
    (c) => `  COUNT(*) FILTER (WHERE ${c.pred.sql}) AS ${c.name}`,
  );
  const aggs = AGG_SPEC.map((a) => `  ${a.sql} AS ${a.name}`);
  const ranges = COUNTIES.map(
    (c) => `    (place_key >= 'node:${c.fips}:' AND place_key < 'node:${c.fips};')`,
  ).join(" OR\n");
  return [
    "SET default_transaction_read_only = on;",
    "SET statement_timeout = 300000;",
    "SELECT",
    "  split_part(place_key, ':', 2) AS fips,",
    "  COUNT(*) AS rows_total,",
    [...counted, ...aggs].join(",\n"),
    "FROM place_layer_snapshots",
    `WHERE adapter_key = '${ADAPTER_KEY}'`,
    "  AND (",
    ranges,
    "  )",
    "GROUP BY 1",
    "ORDER BY 1;",
    "",
  ].join("\n");
}

export const LIVE_SQL = buildLiveSql();

export const META_SQL = `
SET default_transaction_read_only = on;
SELECT
  current_database() AS db,
  COALESCE(inet_server_addr()::text, '') AS server_addr,
  current_setting('server_version') AS server_version,
  now()::text AS server_time;
`;

export const EXPECTED_COLUMNS = [
  "fips",
  "rows_total",
  ...COLUMN_SPEC.map((c) => c.name),
  ...AGG_SPEC.map((a) => a.name),
];

// ---------------------------------------------------------------------------
// Fixture tally. Runs the SAME js half of the SAME predicates the SQL is
// generated from. This is not "the SQL ran" and does not claim to be; it is
// the strongest check available without a database, and it makes the two
// halves impossible to add or delete independently.
// ---------------------------------------------------------------------------

export function tallyRows(rows) {
  const out = { rows_total: rows.length };
  for (const col of COLUMN_SPEC) out[col.name] = 0;
  for (const row of rows) {
    for (const col of COLUMN_SPEC) if (col.pred.js(row)) out[col.name] += 1;
  }
  return out;
}

// ---------------------------------------------------------------------------
// publishRunId audit (repair 4). Pure, so it is self-testable in both
// directions without a database.
//
// Deliberately an ASSERT and not a SQL filter: filtering on publishRunId would
// silently hide a second run in the range and report a clean number. Asserting
// min = max = expected refuses instead.
// ---------------------------------------------------------------------------

export function auditPublishRuns(counties, expected = CARD_H_RUNS) {
  const findings = [];
  for (const { fips } of COUNTIES) {
    const row = counties?.[fips];
    const want = expected?.[fips] ?? null;
    if (!row) {
      findings.push({ fips, verdict: "missing-county-row", expected: want });
      continue;
    }
    const min = row.publish_run_min ?? null;
    const max = row.publish_run_max ?? null;
    const runs = Number(row.publish_runs ?? NaN);
    if (want === null) {
      findings.push({ fips, verdict: "no-expected-run", found_min: min, found_max: max });
      continue;
    }
    if (min !== max) {
      findings.push({ fips, verdict: "multiple-runs", expected: want, found_min: min, found_max: max, publish_runs: runs });
      continue;
    }
    if (min !== want) {
      findings.push({ fips, verdict: "wrong-run", expected: want, found: min });
      continue;
    }
    if (Number.isFinite(runs) && runs !== 1) {
      findings.push({ fips, verdict: "distinct-run-count-not-1", expected: want, publish_runs: runs });
    }
  }
  return { ok: findings.length === 0, checked: COUNTIES.length, findings };
}

// ---------------------------------------------------------------------------
// Write guard (repair 1). Pure verdict function so all four gates are
// self-testable; writeReport applies it against the real process state.
// ---------------------------------------------------------------------------

export function writeGuardVerdict({ isMain, liveFlag, payload, inSelfTest = false }) {
  if (inSelfTest) return { allow: false, reason: "in-self-test: a self-test in progress must never write the report, regardless of the real process's own argv/entrypoint" };
  if (!isMain) return { allow: false, reason: "not-entrypoint: importing this module must never write the report" };
  if (!liveFlag) return { allow: false, reason: "no --live: only a live run writes the report" };
  if (payload?.control !== CONTROL) return { allow: false, reason: `control mismatch: expected ${CONTROL}` };
  if (payload?.live?.liveStatus !== "measured") {
    return {
      allow: false,
      reason: `liveStatus is ${JSON.stringify(payload?.live?.liveStatus ?? null)}, not "measured": a failed live run must not overwrite a good measurement`,
    };
  }
  return { allow: true, reason: "measured live run from the entrypoint" };
}

const IS_MAIN = (() => {
  if (typeof import.meta.main === "boolean") return import.meta.main;
  try {
    if (!process.argv[1]) return false;
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();

function writeReport(payload) {
  const liveFlag = process.argv.slice(2).includes("--live");
  const verdict = writeGuardVerdict({ isMain: IS_MAIN, liveFlag, payload, inSelfTest: IN_SELF_TEST });
  if (!verdict.allow) throw new Error(`writeReport refused: ${verdict.reason}`);
  writeFileSync(REPORT_PATH, JSON.stringify(payload, null, 2) + "\n");
  return REPORT_PATH;
}

// ---------------------------------------------------------------------------
// Self-tests. `tests` is derived from a real counter; deleting an assertion
// lowers the reported count and drops a name from `testNames`.
// ---------------------------------------------------------------------------

let TEST_COUNT = 0;
let TEST_NAMES = [];

function assert(name, cond, falsifier) {
  TEST_COUNT += 1;
  TEST_NAMES.push(name);
  if (!cond) throw new Error(`SELF-TEST FAIL: ${name}. Falsifier: ${falsifier}`);
}

function row({
  fips = "48021",
  parcel = "1",
  schema = SCHEMA_VERSION,
  lat = null,
  lng = null,
  state,
  district,
  jurisdictionKey,
  landUseAddressRecovered,
  landUseSource,
} = {}) {
  const payload = {};
  // `schema: null` omits the key. `undefined` cannot: a default parameter
  // would silently restore SCHEMA_VERSION and the fixture would grade nothing.
  if (schema !== null) payload.facetSchemaVersion = schema;
  if (district !== undefined || jurisdictionKey !== undefined) {
    payload.zoning = {};
    if (district !== undefined) payload.zoning.district = district;
    if (jurisdictionKey !== undefined) payload.zoning.jurisdictionKey = jurisdictionKey;
  }
  const provenance = {};
  if (state !== undefined) provenance.parcelJoin = { state };
  if (landUseAddressRecovered !== undefined) provenance.landUseAddressRecovered = landUseAddressRecovered;
  if (landUseSource !== undefined) provenance.landUseSource = landUseSource;
  if (Object.keys(provenance).length > 0) payload.provenance = provenance;
  return { place_key: `node:${fips}:${parcel}`, lat_rounded: lat, lng_rounded: lng, payload_json: payload };
}

export function selfTest() {
  TEST_COUNT = 0;
  TEST_NAMES = [];
  IN_SELF_TEST = true;
  try {
    return selfTestBody();
  } finally {
    IN_SELF_TEST = false;
  }
}

function selfTestBody() {

  // --- classification fixtures -------------------------------------------
  const noRowSentinel = row({ lat: 0, lng: 0, state: "no-row" });
  assert(
    "no-row 0,0 unstamped conformant is sentinel + no-row + unstamped + residue",
    P.point_sentinel.js(noRowSentinel) &&
      P.join_no_row.js(noRowSentinel) &&
      !P.stamped.js(noRowSentinel) &&
      P.conformant.js(noRowSentinel) &&
      P.unstamped_sentinel.js(noRowSentinel),
    "0,0 would be read as a usable point, or the row would not count into unstamped_sentinel",
  );

  const situs = row({
    fips: "48209",
    lat: 30.0,
    lng: -97.8,
    state: "joined-situs",
    district: "R-1",
    jurisdictionKey: "kyle_city_tx",
    landUseAddressRecovered: true,
    landUseSource: OWNER_AGREE_SOURCE_VALUE,
  });
  assert(
    "recovered Kyle-shaped row is usable + joined-situs + stamped + owner-gate recorded",
    P.point_usable.js(situs) &&
      P.join_joined_situs.js(situs) &&
      P.stamped.js(situs) &&
      P.owner_agree_recorded.js(situs) &&
      P.owner_agree_source.js(situs) &&
      !P.owner_agree_conflict.js(situs),
    "a recovered row would not count as stamped, or its owner gate would read as never fired",
  );

  const blocked = row({ fips: "48491", lat: 0, lng: 0, state: "gate-blocked", landUseAddressRecovered: false });
  assert(
    "gate-blocked stays gate-blocked and does not collapse into no-row or joined",
    P.join_gate_blocked.js(blocked) &&
      !P.join_no_row.js(blocked) &&
      !P.join_joined.js(blocked) &&
      P.point_sentinel.js(blocked) &&
      !P.owner_agree_conflict.js(blocked),
    "gate-blocked would collapse into another join state",
  );

  const missingLat = row({ lat: null, lng: -97.8, state: "joined" });
  assert(
    "a missing coordinate is absent, not sentinel and not usable",
    P.point_absent.js(missingLat) && !P.point_sentinel.js(missingLat) && !P.point_usable.js(missingLat),
    "a NULL coordinate would be counted as 0,0 or as a real point",
  );

  // --- non-vacuity: the alias mutants -------------------------------------
  // STAMPED sentinel. Mutating unstamped_sentinel into an alias of
  // point_sentinel, unstamped, or conformant must fail on this fixture.
  const stampedSentinel = row({ lat: 0, lng: 0, state: "no-row", district: "SF-1" });
  assert(
    "stamped sentinel: point_sentinel true, stamped true, unstamped_sentinel FALSE",
    P.point_sentinel.js(stampedSentinel) &&
      P.stamped.js(stampedSentinel) &&
      P.conformant.js(stampedSentinel) &&
      !P.unstamped_sentinel.js(stampedSentinel),
    "unstamped_sentinel is a pure alias of point_sentinel and a stamped 0,0 row is entering the residue",
  );

  // NON-CONFORMANT unstamped sentinel. Kills the mutant that drops the
  // conformant clause from unstamped_sentinel.
  const nonConformantSentinel = row({ schema: "node-facets-tier1-v0", lat: 0, lng: 0, state: "no-row" });
  assert(
    "non-conformant 0,0 unstamped row is NOT unstamped_sentinel",
    P.nonconformant.js(nonConformantSentinel) &&
      !P.conformant.js(nonConformantSentinel) &&
      P.point_sentinel.js(nonConformantSentinel) &&
      !P.stamped.js(nonConformantSentinel) &&
      !P.unstamped_sentinel.js(nonConformantSentinel),
    "the conformant clause was dropped from unstamped_sentinel and non-conformant rows enter the residue",
  );

  // CONFORMANT unstamped row WITH a real point. Kills the mutant that drops
  // the 0,0 clause from unstamped_sentinel.
  const unstampedUsable = row({ lat: 30.2, lng: -97.7, state: "joined" });
  assert(
    "conformant unstamped row with a usable point is NOT unstamped_sentinel",
    P.conformant.js(unstampedUsable) &&
      !P.stamped.js(unstampedUsable) &&
      P.point_usable.js(unstampedUsable) &&
      !P.unstamped_sentinel.js(unstampedUsable),
    "the 0,0 clause was dropped from unstamped_sentinel and every unstamped row enters the residue",
  );

  const missingSchema = row({ schema: null, lat: 0, lng: 0 });
  assert(
    "a row with no facetSchemaVersion is non-conformant and join_unmeasured, not join_other",
    P.nonconformant.js(missingSchema) && P.join_unmeasured.js(missingSchema) && !P.join_other.js(missingSchema),
    "absent and other would be collapsed into one bucket",
  );

  const weirdState = row({ lat: 30, lng: -97, state: "joined-geoid" });
  assert(
    "an unrecognised join state is join_other, not unmeasured and not one of the four",
    P.join_other.js(weirdState) &&
      !P.join_unmeasured.js(weirdState) &&
      !P.join_joined.js(weirdState) &&
      !P.join_joined_situs.js(weirdState),
    "a new join state the bake starts writing would be silently absorbed into a known bucket",
  );

  // --- ownersAgree conflict, both directions ------------------------------
  const claimsSitusNoGate = row({ fips: "48209", lat: 30, lng: -97, state: "joined-situs", landUseAddressRecovered: false });
  assert(
    "joined-situs with the owner gate NOT recorded is an owner-agree conflict",
    P.join_joined_situs.js(claimsSitusNoGate) &&
      !P.owner_agree_recorded.js(claimsSitusNoGate) &&
      P.owner_agree_conflict.js(claimsSitusNoGate),
    "a joined-situs row whose owner gate never fired would be counted as a clean situs recovery",
  );

  const gateNoSitus = row({ fips: "48491", lat: 30, lng: -97, state: "gate-blocked", landUseAddressRecovered: true });
  assert(
    "owner gate recorded on a NON joined-situs row is also a conflict",
    P.owner_agree_conflict.js(gateNoSitus),
    "the conflict check only looks one way and half the disagreements are invisible",
  );

  // --- tally partition invariants -----------------------------------------
  const empty = tallyRows([]);
  assert(
    "empty input is zero rows and zero residue, never a fabricated remainder",
    empty.rows_total === 0 && empty.unstamped_sentinel === 0 && empty.conformant === 0,
    "an empty fetch would report a remainder",
  );

  const mixed = [
    noRowSentinel,
    situs,
    blocked,
    missingLat,
    stampedSentinel,
    nonConformantSentinel,
    unstampedUsable,
    weirdState,
    missingSchema,
  ];
  const t = tallyRows(mixed);
  assert(
    "point classes partition the fixture set exactly once each",
    t.point_usable + t.point_sentinel + t.point_absent === t.rows_total,
    "a row is being counted in two point classes or in none",
  );
  assert(
    "conformant + nonconformant partitions the fixture set",
    t.conformant + t.nonconformant === t.rows_total,
    "the conformant predicate and its negation disagree",
  );
  assert(
    "stamped + unstamped partitions the fixture set",
    t.stamped + t.unstamped === t.rows_total,
    "the stamped predicate and its negation disagree",
  );
  assert(
    "join classes partition the fixture set exactly once each",
    t.join_joined +
      t.join_joined_situs +
      t.join_gate_blocked +
      t.join_no_row +
      t.join_unmeasured +
      t.join_other ===
      t.rows_total,
    "a join state is double counted or falls through every bucket",
  );
  // Non-vacuity, stated as exact expected counts derived by hand and confirmed
  // against a separate probe run. unstamped_sentinel must differ from every
  // column an alias mutation would plausibly collapse it into.
  assert(
    "mixed fixture is not vacuous: unstamped_sentinel differs from every plausible alias",
    t.rows_total === 9 &&
      t.unstamped_sentinel === 2 &&
      t.point_sentinel === 5 &&
      t.unstamped === 7 &&
      t.conformant === 7 &&
      t.nonconformant === 2 &&
      t.stamped === 2 &&
      t.point_usable === 3 &&
      t.point_absent === 1 &&
      t.unstamped_sentinel !== t.point_sentinel &&
      t.unstamped_sentinel !== t.unstamped &&
      t.unstamped_sentinel !== t.conformant &&
      t.unstamped_sentinel !== t.rows_total,
    "the fixture set collapses to one class, so an alias mutation would survive",
  );
  assert(
    "mixed fixture exercises all six join buckets, none of them empty by accident",
    t.join_joined === 2 &&
      t.join_joined_situs === 1 &&
      t.join_gate_blocked === 1 &&
      t.join_no_row === 3 &&
      t.join_unmeasured === 1 &&
      t.join_other === 1,
    "a join bucket is never exercised, so deleting its clause would survive the suite",
  );

  // --- generated SQL structure --------------------------------------------
  const sql = buildLiveSql();
  assert(
    "generated SQL emits every COLUMN_SPEC column",
    COLUMN_SPEC.every((c) => sql.includes(` AS ${c.name}`)),
    "a counted column exists in the spec but not in the SQL that runs",
  );
  assert(
    "generated SQL emits every publish-run aggregate",
    AGG_SPEC.every((a) => sql.includes(` AS ${a.name}`)),
    "the publishRunId audit would run against columns the SQL never selected",
  );
  assert(
    "generated SQL scopes every county in COUNTIES",
    COUNTIES.every(
      (c) => sql.includes(`place_key >= 'node:${c.fips}:'`) && sql.includes(`place_key < 'node:${c.fips};'`),
    ),
    "a county in the list is silently absent from the WHERE clause",
  );
  assert(
    "generated SQL still carries all three unstamped_sentinel clauses",
    /COUNT\(\*\) FILTER \(WHERE [^\n]*facetSchemaVersion[^\n]*AND \(NOT \([^\n]*district[^\n]*\)\) AND \([^\n]*lat_rounded = 0 AND lng_rounded = 0[^\n]*\)\) AS unstamped_sentinel/.test(
      sql,
    ),
    "the unstamped_sentinel SQL column degraded into an alias of another column",
  );
  assert(
    "generated SQL is read only and contains no write verb",
    sql.includes("SET default_transaction_read_only = on;") &&
      !/\b(INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE)\b/i.test(sql),
    "the recount could mutate the store it is measuring",
  );
  assert(
    "parser column expectations match the spec exactly",
    EXPECTED_COLUMNS.length === 2 + COLUMN_SPEC.length + AGG_SPEC.length &&
      EXPECTED_COLUMNS[0] === "fips" &&
      EXPECTED_COLUMNS[1] === "rows_total",
    "the parser reads a column set that is not the one the SQL emits",
  );

  // --- publishRunId audit, both directions --------------------------------
  const goodCounties = Object.fromEntries(
    COUNTIES.map((c) => [
      c.fips,
      { publish_runs: "1", publish_run_min: CARD_H_RUNS[c.fips], publish_run_max: CARD_H_RUNS[c.fips] },
    ]),
  );
  assert(
    "publishRunId audit PASSES when every county carries exactly its card H run",
    auditPublishRuns(goodCounties).ok === true,
    "the audit cannot pass, so a green result would mean nothing",
  );

  const twoRuns = JSON.parse(JSON.stringify(goodCounties));
  twoRuns["48453"].publish_run_max = "deadbeef";
  twoRuns["48453"].publish_runs = "2";
  const twoRunsVerdict = auditPublishRuns(twoRuns);
  assert(
    "publishRunId audit FAILS when a county mixes two runs",
    twoRunsVerdict.ok === false &&
      twoRunsVerdict.findings.some((f) => f.fips === "48453" && f.verdict === "multiple-runs"),
    "a range holding two publish runs would be reported as one clean number",
  );

  const wrongRun = JSON.parse(JSON.stringify(goodCounties));
  wrongRun["48209"].publish_run_min = "00000000";
  wrongRun["48209"].publish_run_max = "00000000";
  const wrongRunVerdict = auditPublishRuns(wrongRun);
  assert(
    "publishRunId audit FAILS when a county carries a run that is not its card H run",
    wrongRunVerdict.ok === false &&
      wrongRunVerdict.findings.some((f) => f.fips === "48209" && f.verdict === "wrong-run"),
    "the numbers could come from a different bake than the one being graded",
  );

  const missingCounty = JSON.parse(JSON.stringify(goodCounties));
  delete missingCounty["48491"];
  assert(
    "publishRunId audit FAILS when a county row is missing entirely",
    auditPublishRuns(missingCounty).ok === false,
    "a county that returned no rows would pass the run audit",
  );

  // --- write guard, all four gates ----------------------------------------
  const measuredPayload = { control: CONTROL, live: { liveStatus: "measured" } };
  assert(
    "write guard ALLOWS an entrypoint --live measured run",
    writeGuardVerdict({ isMain: true, liveFlag: true, payload: measuredPayload }).allow === true,
    "the guard can never allow, so --live could not write and the guard is untested in the positive direction",
  );
  assert(
    "write guard DENIES an import (not the entrypoint)",
    writeGuardVerdict({ isMain: false, liveFlag: true, payload: measuredPayload }).allow === false,
    "importing this module would truncate the live report",
  );
  assert(
    "write guard DENIES a run without --live",
    writeGuardVerdict({ isMain: true, liveFlag: false, payload: measuredPayload }).allow === false,
    "--self-test would truncate the live report",
  );
  assert(
    "write guard DENIES a foreign control",
    writeGuardVerdict({
      isMain: true,
      liveFlag: true,
      payload: { control: "something-else", live: { liveStatus: "measured" } },
    }).allow === false,
    "any payload could be written over this control's report",
  );
  const failedLive = writeGuardVerdict({
    isMain: true,
    liveFlag: true,
    payload: { control: CONTROL, live: { liveStatus: "unmeasured", reason: "psql failed" } },
  });
  assert(
    "write guard DENIES a FAILED live run (unmeasured must not overwrite a measurement)",
    failedLive.allow === false && failedLive.reason.includes("liveStatus"),
    "a failed live run would overwrite a good measurement with an unmeasured stub",
  );
  assert(
    "write guard DENIES a self-test even when isMain/liveFlag/payload all look like a real, legitimate --live write (2026-09-04 repair)",
    writeGuardVerdict({ isMain: true, liveFlag: true, payload: measuredPayload, inSelfTest: true }).allow === false,
    "--live's own self-test IS an entrypoint run with --live in real argv and a legitimate-looking payload -- exactly the case that truncated the live report for real on 2026-09-04; this gate must fire from IN_SELF_TEST alone, not from argv",
  );

  // The real writeReport(), exercised for real from inside a real --live process
  // (IN_SELF_TEST is true here because selfTest() set it before calling this
  // function). Before the 2026-09-04 repair this call actually wrote the file,
  // because writeReport's liveFlag/isMain read the REAL process.argv/entrypoint,
  // which are genuinely true during an actual --live run's own self-test phase --
  // the fixture below never caught it because IN_SELF_TEST didn't exist yet.
  let refused = false;
  try {
    writeReport({ control: CONTROL, live: { liveStatus: "measured" } });
  } catch (err) {
    refused = String(err?.message || err).startsWith("writeReport refused");
  }
  assert(
    "the real writeReport refuses during a self-test in this process",
    refused,
    "running --self-test truncates _inbox/2026-08-30_ctx_w0_residue_recount.json",
  );

  // --- redaction ----------------------------------------------------------
  const secret =
    "psql: error: connection to postgresql://neondb_owner:npg_SUPERSECRET@ep-x-pooler.aws.neon.tech/neondb failed";
  const red = redact(secret);
  assert(
    "redact removes the whole connection string including user and password",
    !red.includes("npg_SUPERSECRET") && !red.includes("neondb_owner") && red.includes("REDACTED"),
    "a psql failure would print the production password into the report",
  );

  return { ok: true, tests: TEST_COUNT, testNames: TEST_NAMES.slice() };
}

// ---------------------------------------------------------------------------
// Live path
// ---------------------------------------------------------------------------

export function redact(text) {
  return String(text)
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "postgres://REDACTED")
    .replace(/\/\/[^@\s/]*@/g, "//REDACTED@");
}

function liveUrl() {
  return process.env.PRODUCTION_NEONDB_URL || process.env.DATABASE_URL || "";
}

/** Host identity only. Never the user, password, or query string. */
function hostIdentity(url) {
  try {
    const u = new URL(url);
    return {
      hostname: u.hostname,
      hostLabel: u.hostname.split(".")[0],
      port: u.port || null,
      urlDatabase: u.pathname.replace(/^\//, "") || null,
    };
  } catch {
    return { hostname: "unparsed", hostLabel: "unparsed", port: null, urlDatabase: null };
  }
}

/** Repair 2: the commit is read at run time, never a string literal. */
function gitSnapshot() {
  const run = (args) => spawnSync("git", ["-C", ROOT, ...args], { encoding: "utf8", windowsHide: true });
  const head = run(["rev-parse", "HEAD"]);
  if (head.status !== 0) {
    return { commit: "unmeasured", reason: redact(head.stderr || `git exit ${head.status}`).slice(0, 300) };
  }
  const commit = (head.stdout || "").trim();
  const branch = run(["rev-parse", "--abbrev-ref", "HEAD"]);
  const status = run(["status", "--porcelain"]);
  const dirtyLines = status.status === 0 ? (status.stdout || "").split(/\r?\n/).filter(Boolean) : null;
  return {
    commit,
    commitShort: commit.slice(0, 7),
    branch: branch.status === 0 ? (branch.stdout || "").trim() : "unmeasured",
    treeDirty: dirtyLines === null ? "unmeasured" : dirtyLines.length > 0,
    dirtyPathCount: dirtyLines === null ? "unmeasured" : dirtyLines.length,
  };
}

function psql(url, sql, label) {
  const res = spawnSync("psql", [url, "-v", "ON_ERROR_STOP=1", "-A", "-F", "\t", "-P", "pager=off", "-c", sql], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (res.error) {
    return {
      ok: false,
      reason: `${label}: psql not runnable`,
      stderr: redact(String(res.error.message || res.error)).slice(0, 400),
    };
  }
  if (res.status !== 0) {
    return {
      ok: false,
      reason: `${label}: psql failed`,
      stderr: redact(res.stderr || res.stdout || `exit ${res.status}`).slice(0, 800),
    };
  }
  return { ok: true, stdout: res.stdout || "" };
}

function parseTsv(stdout, headerFirstCol) {
  const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
  const dataLines = lines.filter((line) => line !== "SET" && !/^\(\d+ rows?\)$/.test(line));
  const headerLine = dataLines.find((line) => line.startsWith(`${headerFirstCol}\t`) || line === headerFirstCol);
  if (!headerLine) return { ok: false, rawLineCount: lines.length, dataLineCount: dataLines.length };
  const header = headerLine.split("\t");
  const rows = [];
  for (const line of dataLines) {
    if (line === headerLine) continue;
    const cols = line.split("\t");
    if (cols.length !== header.length) continue;
    rows.push(Object.fromEntries(header.map((h, i) => [h, cols[i]])));
  }
  return { ok: true, header, rows, rawLineCount: lines.length };
}

/** Repair 3: record the database and host the numbers actually came from. */
function readStoreIdentity(url) {
  const ident = hostIdentity(url);
  const meta = psql(url, META_SQL, "meta");
  if (!meta.ok) {
    return {
      ...ident,
      database: "unmeasured",
      serverAddr: "unmeasured",
      serverVersion: "unmeasured",
      serverTime: "unmeasured",
      metaError: meta.stderr ?? meta.reason,
    };
  }
  const parsed = parseTsv(meta.stdout, "db");
  const first = parsed.ok ? parsed.rows[0] : null;
  if (!first) {
    return {
      ...ident,
      database: "unmeasured",
      serverAddr: "unmeasured",
      serverVersion: "unmeasured",
      serverTime: "unmeasured",
      metaError: "meta query returned no parsable row",
    };
  }
  return {
    ...ident,
    database: first.db,
    serverAddr: first.server_addr === "" ? null : first.server_addr,
    serverVersion: first.server_version,
    serverTime: first.server_time,
  };
}

function runLive() {
  const url = liveUrl();
  if (!url) {
    return { liveStatus: "unmeasured", reason: "PRODUCTION_NEONDB_URL and DATABASE_URL both absent" };
  }
  const store = readStoreIdentity(url);
  const main = psql(url, LIVE_SQL, "recount");
  if (!main.ok) {
    return { liveStatus: "unmeasured", reason: main.reason, stderr: main.stderr, store };
  }
  const parsed = parseTsv(main.stdout, "fips");
  if (!parsed.ok) {
    return {
      liveStatus: "unmeasured",
      reason: "psql stdout had no fips header after dropping SET lines",
      rawLineCount: parsed.rawLineCount,
      dataLineCount: parsed.dataLineCount,
      store,
    };
  }
  const missingCols = EXPECTED_COLUMNS.filter((c) => !parsed.header.includes(c));
  if (missingCols.length > 0) {
    return {
      liveStatus: "unmeasured",
      reason: `psql header is missing expected columns: ${missingCols.join(", ")}`,
      store,
    };
  }
  const counties = {};
  for (const r of parsed.rows) {
    if (!/^\d{5}$/.test(r.fips || "")) continue;
    counties[r.fips] = r;
  }
  const countyCount = Object.keys(counties).length;
  if (countyCount !== COUNTIES.length) {
    return {
      liveStatus: "unmeasured",
      reason: `expected ${COUNTIES.length} county rows, parsed ${countyCount}`,
      counties,
      rawLineCount: parsed.rawLineCount,
      store,
    };
  }
  // Repair 4: these are only the card H numbers if the runs are the card H runs.
  const publishRunAudit = auditPublishRuns(counties);
  if (!publishRunAudit.ok) {
    return {
      liveStatus: "unmeasured",
      reason: "publishRunId audit failed: the rows in range are not exactly the six card H runs",
      publishRunAudit,
      counties,
      store,
    };
  }
  return { liveStatus: "measured", counties, publishRunAudit, rawLineCount: parsed.rawLineCount, store };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const NUMERIC_KEYS = ["rows_total", ...COLUMN_SPEC.map((c) => c.name)];

function buildOwnersAgree(counties) {
  const out = {
    what:
      "Second-derivation check on the two LANDUSE_JOIN_DISABLED_FIPS_SEED counties. Decision 2026-08-29_ctx_open_situs_join_not_prop_id names ownersAgree as the gate that makes a situs recovery legal.",
    derivation:
      "INTERNAL CONSISTENCY, not a second derivation. provenance.parcelJoin.state and provenance.landUseAddressRecovered are both written by the same bake into the same payload, so one party acting alone satisfies both sides. This column detects a bake that contradicts itself; it cannot detect a bake that is uniformly wrong.",
    secondDerivationLivesElsewhere:
      "scripts/ctx/w0b-owner-agree-sample.mjs joins CAD roll owner against TxGIO owner. That is the external derivation and the decision's reversal criterion. Its result is _inbox/2026-08-30_ctx_w0b_owner_agree.json.",
    publishedGate: {
      hays: 0.86,
      williamson: 0.89,
      source: "_decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md",
    },
    counties: {},
  };
  for (const fips of BLOCKED_FIPS) {
    const r = counties[fips];
    if (!r) {
      out.counties[fips] = { verdict: "unmeasured", reason: "no county row" };
      continue;
    }
    const conflict = Number(r.owner_agree_conflict || 0);
    out.counties[fips] = {
      join_joined_situs: Number(r.join_joined_situs || 0),
      owner_agree_recorded: Number(r.owner_agree_recorded || 0),
      owner_agree_source_cad_roll_address_join: Number(r.owner_agree_source || 0),
      owner_agree_conflict: conflict,
      internally_consistent: conflict === 0,
      verdict:
        conflict === 0
          ? "self-consistent: every joined-situs row also records the owner gate as fired, and no other row does"
          : `self-CONTRADICTORY: ${conflict} rows where joined-situs and landUseAddressRecovered disagree`,
    };
  }
  const nonBlockedLeak = {};
  for (const { fips } of COUNTIES) {
    if (BLOCKED_FIPS.includes(fips)) continue;
    const r = counties[fips];
    if (r) nonBlockedLeak[fips] = Number(r.owner_agree_recorded || 0);
  }
  out.nonBlockedOwnerAgreeRecorded = nonBlockedLeak;
  out.nonBlockedNote =
    "Non-blocked counties join on prop_id and must never record an address recovery. Any non-zero here is a seed leak in the other direction.";
  return out;
}

function buildReport({ wantLive, tests, live, git }) {
  const writtenAt = new Date().toISOString();
  const report = {
    control: CONTROL,
    wdll: WDLL,
    planRows: PLAN_ROWS,
    writtenAt,
    snapshot: {
      seat: "integration",
      repo: "P:/doc_repo",
      docRepoCommit: git.commit,
      docRepoCommitShort: git.commitShort ?? "unmeasured",
      docRepoBranch: git.branch ?? "unmeasured",
      docRepoTreeDirty: git.treeDirty ?? "unmeasured",
      docRepoDirtyPathCount: git.dirtyPathCount ?? "unmeasured",
      instrument: "scripts/ctx/post-h-residue-recount.mjs",
      note:
        "docRepoCommit is read with git rev-parse HEAD at run time. It was a hardcoded string literal until the 2026-08-30 repair.",
    },
    cardHRunsExpected: CARD_H_RUNS,
    preHDoNotQuote: {
      unstamped_sentinel: PRE_H.unstamped_sentinel_total,
      source: PRE_H.source,
      why: "pre-H. Card H recovered Hays/Williamson on situs. Not the live remainder.",
    },
    selfTest: tests,
    live: wantLive ? live : { liveStatus: "not-requested" },
  };

  if (!wantLive || report.live.liveStatus !== "measured") return report;

  report.live.snapshot = {
    queriedAt: writtenAt,
    adapter: ADAPTER_KEY,
    placeKeyRanges: COUNTIES.map((c) => `node:${c.fips}: .. node:${c.fips};`),
    readOnly: true,
    table: "place_layer_snapshots",
    database: report.live.store?.database ?? "unmeasured",
    host: report.live.store?.hostname ?? "unmeasured",
    hostLabel: report.live.store?.hostLabel ?? "unmeasured",
    urlDatabase: report.live.store?.urlDatabase ?? "unmeasured",
    serverAddr: report.live.store?.serverAddr ?? "unmeasured",
    serverVersion: report.live.store?.serverVersion ?? "unmeasured",
    serverTime: report.live.store?.serverTime ?? "unmeasured",
    columns: "payload_json + lat_rounded + lng_rounded (table columns, not body)",
    docRepoCommit: git.commit,
    credentialsRecorded: false,
  };
  delete report.live.store;

  const totals = Object.fromEntries(NUMERIC_KEYS.map((k) => [k, 0]));
  for (const r of Object.values(report.live.counties)) {
    for (const k of NUMERIC_KEYS) totals[k] += Number(r[k] || 0);
  }
  report.live.totals = totals;
  report.live.ownersAgree = buildOwnersAgree(report.live.counties);

  const travisNoRow = Number(report.live.counties["48453"].join_no_row);
  const seedLeak =
    Number(report.live.counties["48209"].join_joined) + Number(report.live.counties["48491"].join_joined);

  report.live.reading = {
    measured: {
      unstamped_sentinel_now: totals.unstamped_sentinel,
      unstamped_sentinel_preH: PRE_H.unstamped_sentinel_total,
      unstamped_sentinel_preH_source: PRE_H.source,
      recovered_from_H: PRE_H.unstamped_sentinel_total - totals.unstamped_sentinel,
      recovered_from_H_basis: "like-for-like subtraction: identical predicate on both sides",
      travis_no_row_now: travisNoRow,
      travis_no_row_preH: PRE_H.join_no_row["48453"],
      travis_no_row_preH_source: PRE_H.source,
      travis_no_row_unchanged: travisNoRow === PRE_H.join_no_row["48453"],
      hays_joined_situs: Number(report.live.counties["48209"].join_joined_situs),
      williamson_joined_situs: Number(report.live.counties["48491"].join_joined_situs),
      seed_leak_joined_on_blocked_fips: seedLeak,
      nonconformant_rows_in_range: totals.nonconformant,
      publishRunAudit: report.live.publishRunAudit,
    },
    inferred: {
      travis_situs_never_attempted: {
        claim:
          "The Travis no-row class has had no owner-gated situs attempt, which is why the count did not move across card H.",
        basis:
          "Card H FIPS-gates situs recovery to 48209 and 48491 only (_inbox/2026-08-29_ctx-h_close.json). This instrument does not read that code; it observes only that the count is unchanged.",
        alternativeRejected:
          "Situs was attempted on 48453 and recovered nothing. Rejected because an attempt would be expected to move at least one row, and because card H's own close records addressJoinKey as null for 48453.",
        establishedByThisInstrument: false,
      },
      join_states_are_bake_self_declared: {
        claim: "Every join number in this report is the bake's own label, read back from the payload it wrote.",
        basis:
          "All join columns read provenance.parcelJoin.state. The ownersAgree block is internal consistency on that same payload, not a second derivation.",
        establishedByThisInstrument: true,
      },
    },
    recommended: {
      w2:
        "Extend owner-gated situs to the 48453 / 48021 / 48055 leftover no-row class in W1 before coding P-80.",
      ownerAgreeSample:
        "Re-run scripts/ctx/w0b-owner-agree-sample.mjs to completion (48453 timed out) before treating any joined-situs count as owner-gated.",
      note:
        "Recommendations are neither measurements nor inferences. All three were mixed into a single w2 string until the 2026-08-30 repair.",
    },
  };
  return report;
}

// ---------------------------------------------------------------------------
// Entrypoint. Nothing below runs on import.
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const wantLive = args.includes("--live");
  const wantSql = args.includes("--sql");
  try {
    const tests = selfTest();
    if (wantSql) {
      console.log(buildLiveSql());
      return;
    }
    const git = gitSnapshot();
    const live = wantLive ? runLive() : { liveStatus: "not-requested" };
    const report = buildReport({ wantLive, tests, live, git });
    let path = null;
    if (wantLive && report.live.liveStatus === "measured") path = writeReport(report);
    if (wantLive && report.live.liveStatus !== "measured") {
      console.log(
        JSON.stringify(
          {
            ok: false,
            selfTest: { ok: tests.ok, tests: tests.tests },
            snapshot: report.snapshot,
            live: report.live,
            wroteReport: false,
            reportPreserved: REPORT_PATH,
          },
          null,
          2,
        ),
      );
      process.exit(2);
    }
    console.log(
      JSON.stringify(
        {
          ok: true,
          selfTest: { ok: tests.ok, tests: tests.tests, testNames: tests.testNames },
          snapshot: report.snapshot,
          live: report.live.liveStatus,
          path,
          wroteReport: Boolean(path),
        },
        null,
        2,
      ),
    );
  } catch (err) {
    console.error(redact(String(err && err.message ? err.message : err)));
    process.exit(1);
  }
}

if (IS_MAIN) main();
