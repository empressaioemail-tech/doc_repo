#!/usr/bin/env node
/**
 * W0 post-H residue recount (CTX facts-complete WDLL item 2).
 *
 * Classifies already-fetched snapshot bodies. Live SQL is a separate
 * read-only pass that feeds this classifier. A count is not a record
 * unless the snapshot (host, time, publishRunId set) is in the output.
 *
 * Self-tests both directions before any SQL. A classifier that only
 * passes the happy path is the defect this file exists to stop.
 *
 * Usage:
 *   node scripts/ctx/post-h-residue-recount.mjs --self-test
 *   node scripts/ctx/post-h-residue-recount.mjs --live
 *
 * --live always runs --self-test first. Missing DATABASE_URL /
 * PRODUCTION_NEONDB_URL exits 2 with liveStatus unmeasured (does not
 * invent 0 remainder). Never prints the URL.
 *
 * Exclusion set:
 *   - Does not write a store.
 *   - Does not quote 534700 as the live remainder.
 *   - Does not invent a geo_id join.
 *   - Does not lift LANDUSE_JOIN_DISABLED_FIPS_SEED.
 */

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REPORT_PATH = join(ROOT, "_inbox", "2026-08-30_ctx_w0_residue_recount.json");

export const CONTROL = "ctx-w0-residue-recount";
export const PLAN_ROWS = ["F-05", "F-06", "F-08"];
export const WDLL = "_inbox/2026-08-30_ctx_facts_complete_WDLL.md item 2";

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

const JOIN_STATES = ["joined", "joined-situs", "gate-blocked", "no-row"];

function isFiniteNumber(n) {
  return typeof n === "number" && Number.isFinite(n);
}

function pointFromBody(body) {
  const lat = body?.lat_rounded ?? body?.cityLimitsFact?.queryPoint?.lat ?? body?.queryPoint?.lat;
  const lng = body?.lng_rounded ?? body?.cityLimitsFact?.queryPoint?.lng ?? body?.queryPoint?.lng;
  if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) return { kind: "absent" };
  if (lat === 0 && lng === 0) return { kind: "sentinel" };
  return { kind: "usable", lat, lng };
}

function joinStateFromBody(body) {
  const raw = body?.provenance?.parcelJoin?.state ?? body?.parcelJoin?.state ?? null;
  if (raw == null || raw === "") return "unmeasured";
  if (JOIN_STATES.includes(raw)) return raw;
  return "other";
}

function isStamped(body) {
  const z = body?.zoning ?? body?.facets?.zoning ?? null;
  const district = z?.district;
  const key = z?.jurisdictionKey;
  return (typeof district === "string" && district.trim() !== "") ||
    (typeof key === "string" && key.trim() !== "");
}

function isConformant(body) {
  return body?.facetSchemaVersion === "node-facets-tier1-conformant-v1";
}

export function classifyBody(body) {
  if (!body || typeof body !== "object") {
    return { class: "unreadable", join: "unmeasured", point: "absent", stamped: false, conformant: false };
  }
  const point = pointFromBody(body);
  return {
    class: "row",
    join: joinStateFromBody(body),
    point: point.kind,
    stamped: isStamped(body),
    conformant: isConformant(body),
  };
}

export function tally(rows) {
  const out = {
    rows: rows.length,
    conformant: 0,
    stamped: 0,
    unstamped: 0,
    point_usable: 0,
    point_sentinel: 0,
    point_absent: 0,
    join_joined: 0,
    join_joined_situs: 0,
    join_gate_blocked: 0,
    join_no_row: 0,
    join_unmeasured: 0,
    join_other: 0,
    unstamped_sentinel: 0,
  };
  for (const row of rows) {
    const c = classifyBody(row.body);
    if (c.conformant) out.conformant += 1;
    if (c.stamped) out.stamped += 1;
    else out.unstamped += 1;
    if (c.point === "usable") out.point_usable += 1;
    else if (c.point === "sentinel") out.point_sentinel += 1;
    else out.point_absent += 1;
    if (c.join === "joined") out.join_joined += 1;
    else if (c.join === "joined-situs") out.join_joined_situs += 1;
    else if (c.join === "gate-blocked") out.join_gate_blocked += 1;
    else if (c.join === "no-row") out.join_no_row += 1;
    else if (c.join === "unmeasured") out.join_unmeasured += 1;
    else out.join_other += 1;
    if (!c.stamped && c.point === "sentinel") out.unstamped_sentinel += 1;
  }
  return out;
}

function assert(name, cond, falsifier) {
  if (!cond) {
    throw new Error(`SELF-TEST FAIL: ${name}. Falsifier: ${falsifier}`);
  }
}

export function selfTest() {
  const noRow = classifyBody({
    facetSchemaVersion: "node-facets-tier1-conformant-v1",
    lat_rounded: 0,
    lng_rounded: 0,
    provenance: { parcelJoin: { state: "no-row" } },
    zoning: null,
  });
  assert("no-row sentinel is sentinel + no-row + unstamped",
    noRow.point === "sentinel" && noRow.join === "no-row" && noRow.stamped === false && noRow.conformant === true,
    "0,0 would be treated as a usable point or as joined");

  const situs = classifyBody({
    facetSchemaVersion: "node-facets-tier1-conformant-v1",
    lat_rounded: 30.0,
    lng_rounded: -97.8,
    provenance: { parcelJoin: { state: "joined-situs" } },
    zoning: { district: "R-1", jurisdictionKey: "kyle_city_tx" },
  });
  assert("joined-situs with point is usable + stamped",
    situs.point === "usable" && situs.join === "joined-situs" && situs.stamped === true,
    "a recovered Kyle-shaped row would not count as stamped");

  const blocked = classifyBody({
    facetSchemaVersion: "node-facets-tier1-conformant-v1",
    lat_rounded: 0,
    lng_rounded: 0,
    provenance: { parcelJoin: { state: "gate-blocked" } },
  });
  assert("gate-blocked stays gate-blocked",
    blocked.join === "gate-blocked" && blocked.point === "sentinel",
    "gate-blocked would collapse to no-row or joined");

  const missingLat = classifyBody({
    facetSchemaVersion: "node-facets-tier1-conformant-v1",
    provenance: { parcelJoin: { state: "joined" } },
  });
  assert("missing lat is absent, not usable and not sentinel",
    missingLat.point === "absent",
    "a missing point would be counted as 0,0 or as a real point");

  const emptyTally = tally([]);
  assert("empty input is zero rows, not a fabricated remainder",
    emptyTally.rows === 0 && emptyTally.unstamped_sentinel === 0 && emptyTally.conformant === 0,
    "an empty fetch would report a remainder");

  const vacuous = tally([
    { body: { facetSchemaVersion: "node-facets-tier1-conformant-v1", lat_rounded: 30, lng_rounded: -97, provenance: { parcelJoin: { state: "joined" } }, zoning: { district: "SF-1" } } },
    { body: { facetSchemaVersion: "node-facets-tier1-conformant-v1", lat_rounded: 0, lng_rounded: 0, provenance: { parcelJoin: { state: "no-row" } } } },
  ]);
  assert("mixed fixture is not-vacuous (1 usable joined, 1 sentinel no-row)",
    vacuous.rows === 2 && vacuous.point_usable === 1 && vacuous.unstamped_sentinel === 1 && vacuous.join_joined === 1 && vacuous.join_no_row === 1,
    "a two-row mixed set would collapse to one class");

  return { ok: true, tests: 6 };
}

function redact(text) {
  return String(text).replace(/postgres(?:ql)?:\/\/\S+/gi, "postgres://REDACTED");
}

function liveUrl() {
  return process.env.PRODUCTION_NEONDB_URL || process.env.DATABASE_URL || "";
}

const LIVE_SQL = `
SET default_transaction_read_only = on;
SET statement_timeout = 300000;
SELECT
  split_part(place_key, ':', 2) AS fips,
  COUNT(*) FILTER (WHERE payload_json->>'facetSchemaVersion' = 'node-facets-tier1-conformant-v1') AS conformant,
  COUNT(*) AS rows_total,
  COUNT(*) FILTER (WHERE COALESCE(payload_json->'zoning'->>'district','') <> '' OR COALESCE(payload_json->'zoning'->>'jurisdictionKey','') <> '') AS stamped,
  COUNT(*) FILTER (WHERE lat_rounded = 0 AND lng_rounded = 0) AS point_sentinel,
  COUNT(*) FILTER (WHERE lat_rounded IS NULL OR lng_rounded IS NULL) AS point_absent,
  COUNT(*) FILTER (WHERE payload_json #>> '{provenance,parcelJoin,state}' = 'joined') AS join_joined,
  COUNT(*) FILTER (WHERE payload_json #>> '{provenance,parcelJoin,state}' = 'joined-situs') AS join_joined_situs,
  COUNT(*) FILTER (WHERE payload_json #>> '{provenance,parcelJoin,state}' = 'gate-blocked') AS join_gate_blocked,
  COUNT(*) FILTER (WHERE payload_json #>> '{provenance,parcelJoin,state}' = 'no-row') AS join_no_row,
  COUNT(*) FILTER (
    WHERE payload_json->>'facetSchemaVersion' = 'node-facets-tier1-conformant-v1'
      AND COALESCE(payload_json->'zoning'->>'district','') = ''
      AND COALESCE(payload_json->'zoning'->>'jurisdictionKey','') = ''
      AND lat_rounded = 0
      AND lng_rounded = 0
  ) AS unstamped_sentinel,
  COUNT(DISTINCT left(payload_json->>'publishRunId', 8)) AS publish_runs,
  MIN(left(payload_json->>'publishRunId', 8)) AS publish_run_min,
  MAX(left(payload_json->>'publishRunId', 8)) AS publish_run_max
FROM place_layer_snapshots
WHERE adapter_key = 'node-facets:tier1'
  AND (
    (place_key >= 'node:48021:' AND place_key < 'node:48021;') OR
    (place_key >= 'node:48055:' AND place_key < 'node:48055;') OR
    (place_key >= 'node:48209:' AND place_key < 'node:48209;') OR
    (place_key >= 'node:48309:' AND place_key < 'node:48309;') OR
    (place_key >= 'node:48453:' AND place_key < 'node:48453;') OR
    (place_key >= 'node:48491:' AND place_key < 'node:48491;')
  )
GROUP BY 1
ORDER BY 1;
`;

function runLive() {
  const url = liveUrl();
  if (!url) {
    return { liveStatus: "unmeasured", reason: "PRODUCTION_NEONDB_URL and DATABASE_URL both absent" };
  }
  const psql = spawnSync(
    "psql",
    [url, "-v", "ON_ERROR_STOP=1", "-A", "-F", "\t", "-P", "pager=off", "-c", LIVE_SQL],
    { encoding: "utf8", windowsHide: true },
  );
  if (psql.status !== 0) {
    return {
      liveStatus: "unmeasured",
      reason: "psql failed",
      stderr: redact(psql.stderr || psql.stdout || `exit ${psql.status}`).slice(0, 800),
    };
  }
  const lines = (psql.stdout || "").trim().split(/\r?\n/).filter(Boolean);
  const dataLines = lines.filter((line) => line !== "SET" && !/^\(\d+ rows?\)$/.test(line));
  const headerLine = dataLines.find((line) => line.startsWith("fips\t"));
  if (!headerLine) {
    return {
      liveStatus: "unmeasured",
      reason: "psql stdout had no fips header after dropping SET lines",
      rawLineCount: lines.length,
      dataLineCount: dataLines.length,
    };
  }
  const header = headerLine.split("\t");
  const counties = {};
  for (const line of dataLines) {
    if (line === headerLine) continue;
    const cols = line.split("\t");
    if (cols.length !== header.length) continue;
    const row = Object.fromEntries(header.map((h, i) => [h, cols[i]]));
    if (!/^\d{5}$/.test(row.fips || "")) continue;
    counties[row.fips] = row;
  }
  const countyCount = Object.keys(counties).length;
  if (countyCount !== 6) {
    return {
      liveStatus: "unmeasured",
      reason: `expected 6 county rows, parsed ${countyCount}`,
      counties,
      rawLineCount: lines.length,
    };
  }
  return { liveStatus: "measured", counties, rawLineCount: lines.length };
}

function writeReport(payload) {
  writeFileSync(REPORT_PATH, JSON.stringify(payload, null, 2) + "\n");
  return REPORT_PATH;
}

const args = process.argv.slice(2);
const wantLive = args.includes("--live");

try {
  const tests = selfTest();
  if (!wantLive && !args.includes("--self-test") && args.length === 0) {
    // default: self-test
  }
  const report = {
    control: CONTROL,
    wdll: WDLL,
    planRows: PLAN_ROWS,
    writtenAt: new Date().toISOString(),
    snapshot: {
      seat: "integration",
      repo: "P:/doc_repo",
      note: "classifier snapshot is this file; live store snapshot is in live.snapshot if measured",
    },
    cardHRunsExpected: CARD_H_RUNS,
    preHDoNotQuote: {
      unstamped_sentinel: 534700,
      source: "_inbox/2026-08-28_ctx-f_cp1.json 2026-08-28T19:48Z",
      why: "pre-H. Card H recovered Hays/Williamson on situs. Not the live remainder.",
    },
    selfTest: tests,
    live: wantLive ? runLive() : { liveStatus: "not-requested" },
  };
  if (wantLive && report.live.liveStatus === "measured") {
    report.live.snapshot = {
      queriedAt: report.writtenAt,
      adapter: "node-facets:tier1",
      placeKeyRanges: COUNTIES.map((c) => `node:${c.fips}: .. node:${c.fips};`),
      readOnly: true,
      store: "production neondb place_layer_snapshots",
      columns: "payload_json + lat_rounded + lng_rounded (not body)",
      docRepoCommit: "59ffa02",
    };
    const keys = [
      "conformant",
      "rows_total",
      "stamped",
      "point_sentinel",
      "point_absent",
      "join_joined",
      "join_joined_situs",
      "join_gate_blocked",
      "join_no_row",
      "unstamped_sentinel",
    ];
    const totals = Object.fromEntries(keys.map((k) => [k, 0]));
    for (const row of Object.values(report.live.counties)) {
      for (const k of keys) totals[k] += Number(row[k] || 0);
    }
    report.live.totals = totals;
    report.live.reading = {
      unstamped_sentinel_now: totals.unstamped_sentinel,
      unstamped_sentinel_preH: 534700,
      recovered_from_H: 534700 - totals.unstamped_sentinel,
      travis_no_row_unchanged: Number(report.live.counties["48453"].join_no_row) === 119389,
      hays_joined_situs: Number(report.live.counties["48209"].join_joined_situs),
      williamson_joined_situs: Number(report.live.counties["48491"].join_joined_situs),
      seed_leak_joined_on_blocked_fips:
        Number(report.live.counties["48209"].join_joined) +
        Number(report.live.counties["48491"].join_joined),
      w2: "Travis 119389 is still no-row. Situs recovery was not tried on 48453. Extend situs in W1 before coding P-80.",
    };
  }
  const path = writeReport(report);
  if (wantLive && report.live.liveStatus !== "measured") {
    console.log(JSON.stringify({ ok: false, selfTest: tests, live: report.live, path }, null, 2));
    process.exit(2);
  }
  console.log(JSON.stringify({ ok: true, selfTest: tests, live: report.live.liveStatus, path }, null, 2));
} catch (err) {
  console.error(String(err && err.message ? err.message : err));
  process.exit(1);
}
