#!/usr/bin/env node
/**
 * County Manifest operator dump (write-path WDLL item 13 / P-47 GET).
 *
 * Fetches GET /api/county-ledger (same leaf as p47). Writes a compact
 * dump the canvas embeds. Does not rematerialize. Does not POST recompute.
 * Does not invent a satisfied-present cell.
 *
 * Usage:
 *   node scripts/county-manifest-canvas-dump.mjs --self-test
 *   node scripts/county-manifest-canvas-dump.mjs --live
 *
 * --live always self-tests first. Missing computedAt or missing
 * manifestCells exits 2 with status UNMEASURED.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  fetchLedger,
  gradeManifest,
  summarizeByRail,
} from "./p47-manifest-instrument.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DUMP_PATH = join(ROOT, "_inbox", "2026-08-24_county_manifest_dump.json");
const STALE_AFTER_MS = 15 * 60 * 1000;

export const WATCH_COUNTIES = [
  { fips: "48021", name: "Bastrop", why: "gold 48021:34137" },
  { fips: "48453", name: "Travis", why: "P-77 Simsbrook / 280238" },
  { fips: "48113", name: "Dallas", why: "P-25 first CAMA" },
  { fips: "48439", name: "Tarrant", why: "P-25 first CAMA" },
  { fips: "48201", name: "Harris", why: "A-017 PBF NO; roads not-yet" },
  { fips: "48055", name: "Caldwell", why: "StratMap YEAR_BUILT sample" },
  { fips: "48491", name: "Williamson", why: "P-57 audit county" },
];

export const NOT_A_RAIL = [
  {
    store: "tx_utility_territory_staging",
    fact: "who-serves",
    planRow: "P-75",
    why: "Not a County Manifest rail. Live 10196 rows. CC cannot show it.",
  },
  {
    store: "tx_city_boundary",
    fact: "city-limits",
    planRow: "P-76",
    why: "Not a County Manifest rail. Live 1222 rows. CC cannot show it.",
  },
  {
    store: "cad_property.living_area_sqft",
    fact: "inspect living area",
    planRow: "P-25",
    why: "Live structural hop. Manifest cad rail is atom/scorer, not this column.",
  },
];

export function ageMs(computedAt, fetchedAt) {
  const a = Date.parse(computedAt);
  const b = Date.parse(fetchedAt);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return b - a;
}

export function freshness(computedAt, fetchedAt) {
  const ms = ageMs(computedAt, fetchedAt);
  if (ms == null) {
    return {
      status: "UNMEASURED",
      ageMs: null,
      reason: "computedAt or fetchedAt unparseable",
    };
  }
  if (ms > STALE_AFTER_MS) {
    return {
      status: "STALE",
      ageMs: ms,
      reason: `computedAt is ${Math.round(ms / 60000)} min behind fetch (CC banner is 15 min)`,
    };
  }
  return { status: "FRESH", ageMs: ms, reason: "within 15 min of fetch" };
}

export function compactDump({ payload, fetched, grade }) {
  const summary = payload.summary;
  if (!summary || typeof summary.computedAt !== "string" || !summary.computedAt) {
    return { status: "UNMEASURED", reason: "summary.computedAt missing" };
  }
  if (!Array.isArray(payload.manifestCells)) {
    return { status: "UNMEASURED", reason: "manifestCells missing" };
  }

  const watch = {};
  for (const county of WATCH_COUNTIES) {
    const cells = payload.manifestCells
      .filter((c) => c.countyFips === county.fips)
      .map((c) => ({
        railKey: c.railKey,
        displayState: c.displayState,
        honestCoveragePct: c.honestCoveragePct ?? null,
      }))
      .sort((a, b) => a.railKey.localeCompare(b.railKey));
    watch[county.fips] = { ...county, cells };
  }

  const byRail = summarizeByRail(payload.manifestCells);
  const railRows = Object.entries(byRail)
    .map(([railKey, row]) => ({
      railKey,
      n: row.n,
      satisfiedPresent: row.displayState["satisfied-present"] || 0,
      satisfiedAbsent: row.displayState["satisfied-absent"] || 0,
      notYet: row.displayState["not-yet"] || 0,
      other: row.n
        - (row.displayState["satisfied-present"] || 0)
        - (row.displayState["satisfied-absent"] || 0)
        - (row.displayState["not-yet"] || 0),
      pctSet: row.honestCoveragePctSet,
      pctNull: row.honestCoveragePctNull,
    }))
    .sort((a, b) => a.railKey.localeCompare(b.railKey));

  const fetchedAt = fetched.fetchedAt;
  return {
    status: "MEASURED",
    reason: null,
    control: "county-manifest-canvas-dump",
    planRow: "P-47",
    wdllItem: 13,
    ledgerUrl: fetched.url,
    httpStatus: fetched.httpStatus,
    fetchedAt,
    byteLength: fetched.byteLength,
    postRecompute: false,
    rematerialized: false,
    p47Pass: grade.pass,
    p47Failures: grade.failures,
    quotes: {
      computedAt: summary.computedAt,
      servedAt: summary.servedAt,
      totalCells: summary.totalCells,
      totalRails: summary.totalRails,
      satisfiedCells: summary.satisfiedCells ?? null,
      texasCompletenessPct: summary.texasCompletenessPct ?? null,
    },
    freshness: freshness(summary.computedAt, fetchedAt),
    rails: railRows,
    watchCounties: watch,
    notARail: NOT_A_RAIL,
    note: "This dump is the canvas source. Refresh = rerun --live, then replace DATA in the canvas. Do not invent cells.",
  };
}

function assert(name, cond, failures) {
  if (!cond) failures.push(name);
}

export function runSelfTests() {
  const failures = [];
  const missing = compactDump({
    payload: { summary: {}, manifestCells: [] },
    fetched: { url: "x", httpStatus: 200, fetchedAt: "2026-08-24T00:00:00Z", byteLength: 0 },
    grade: { pass: true, failures: [] },
  });
  assert("missing computedAt is UNMEASURED", missing.status === "UNMEASURED", failures);

  const cells = [
    { countyFips: "48021", railKey: "cad", displayState: "satisfied-present", honestCoveragePct: 1 },
    { countyFips: "48021", railKey: "roads", displayState: "not-yet", honestCoveragePct: null },
    { countyFips: "48201", railKey: "roads", displayState: "not-yet", honestCoveragePct: null },
  ];
  const ok = compactDump({
    payload: {
      summary: {
        computedAt: "2026-08-24T03:00:00Z",
        servedAt: "2026-08-24T03:00:10Z",
        totalCells: 3,
        totalRails: 2,
        satisfiedCells: 1,
      },
      manifestCells: cells,
    },
    fetched: {
      url: "https://example.test/api/county-ledger",
      httpStatus: 200,
      fetchedAt: "2026-08-24T04:00:00Z",
      byteLength: 12,
    },
    grade: { pass: true, failures: [] },
  });
  assert("happy path MEASURED", ok.status === "MEASURED", failures);
  assert("STALE after 15 min", ok.freshness.status === "STALE", failures);
  assert("Bastrop cad present", ok.watchCounties["48021"].cells[0].railKey === "cad", failures);
  assert("does not invent a rail", !ok.rails.some((r) => r.railKey === "who-serves"), failures);

  const inventedGreen = {
    ...ok,
    rails: [...ok.rails, { railKey: "who-serves", satisfiedPresent: 254, n: 254, notYet: 0 }],
  };
  assert(
    "who-serves is listed as not-a-rail, not as a rail row",
    ok.notARail.some((x) => x.fact === "who-serves") &&
      !ok.rails.some((r) => r.railKey === "who-serves"),
    failures,
  );
  assert(
    "invented who-serves rail is a different object than the dump",
    inventedGreen.rails.length !== ok.rails.length,
    failures,
  );

  const fresh = freshness("2026-08-24T04:00:00Z", "2026-08-24T04:05:00Z");
  assert("fresh within 15 min", fresh.status === "FRESH", failures);

  return { ok: failures.length === 0, failures };
}

function parseArgs(argv) {
  const out = { selfTest: false, live: false };
  for (const a of argv) {
    if (a === "--self-test") out.selfTest = true;
    else if (a === "--live") out.live = true;
  }
  if (!out.selfTest && !out.live) out.selfTest = true;
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const selfTest = runSelfTests();
  if (!selfTest.ok) {
    process.stdout.write(JSON.stringify({ control: "county-manifest-canvas-dump", selfTest }, null, 2) + "\n");
    process.exit(1);
  }
  if (!args.live) {
    process.stdout.write(JSON.stringify({ control: "county-manifest-canvas-dump", selfTest, live: null }, null, 2) + "\n");
    process.exit(0);
  }

  const fetched = fetchLedger();
  if (!fetched.ok || !fetched.json) {
    const dump = {
      status: "UNMEASURED",
      reason: fetched.error || "ledger GET failed",
      httpStatus: fetched.httpStatus,
      fetchedAt: fetched.fetchedAt,
      ledgerUrl: fetched.url,
    };
    writeFileSync(DUMP_PATH, JSON.stringify(dump, null, 2) + "\n", "utf8");
    process.stdout.write(JSON.stringify(dump, null, 2) + "\n");
    process.exit(2);
  }

  const grade = gradeManifest(fetched.json);
  const dump = compactDump({ payload: fetched.json, fetched, grade });
  writeFileSync(DUMP_PATH, JSON.stringify(dump, null, 2) + "\n", "utf8");
  process.stdout.write(JSON.stringify({ ...dump, watchCounties: undefined }, null, 2) + "\n");
  process.exit(dump.status === "MEASURED" ? 0 : 2);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
