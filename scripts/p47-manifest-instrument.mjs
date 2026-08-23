#!/usr/bin/env node
/**
 * P-47 County Manifest honesty instrument (OPS-16 P-47 / DC-3 near-term).
 *
 * Grades a county-ledger JSON payload by field name. Never a positional
 * formatter. Never a scorer. Never POSTs recompute. Never invents a roads
 * coverage row.
 *
 * Self-tests both directions before any live GET:
 *   invented roads honestCoveragePct  -> MUST FAIL
 *   254 roads displayState=not-yet    -> MUST PASS
 *
 * Exclusion set (part of the contract):
 *   - Does not score rails or write county_facet_coverage.
 *   - Does not treat A-020 as closed when GET is 200.
 *   - Does not require specified rails (geometry/flood/mud) to be 254/254.
 *   - Does not treat mud as unspecified. Card specified set is
 *     geometry / flood / mud; unspecified set is A-020's six zero-row rails.
 *   - Does not fail depth manifest rails (cad / owner / zoning / envelope /
 *     landuse) for satisfied-present without countyRailScoreCli; those are
 *     honest-not-scored per gate-grade DC-6..DC-8, not A-020 scorer rails.
 *   - Does not start P-52. Does not POST /api/county-ledger/recompute.
 *
 * Usage:
 *   node scripts/p47-manifest-instrument.mjs --self-test
 *   node scripts/p47-manifest-instrument.mjs --live
 * --live always runs --self-test first and refuses if a fixture direction fails.
 */

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER_URL =
  process.env.COUNTY_LEDGER_URL ||
  "https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger";
const EXPECTED_ROADS_N = 254;
const HARRIS_FIPS = "48201";

/**
 * Rails with a checked-in scorer spec (P-59 closed 2026-08-23). satisfied-present
 * is allowed when countyRailScoreCli ran; phantom rails without a spec are not.
 */
const SCORER_SPEC_RAILS = [
  "geometry",
  "flood",
  "mud",
  "roads",
  "footprint",
  "easement",
  "rrc-wells",
  "rrc-pipelines",
  "rail-corridor",
];

/**
 * Jurisdiction-depth manifest rails (gate-grade.mjs DEPTH_RAILS). May show
 * satisfied-present from depth/writer paths without a countyRailScoreCli spec.
 */
const HONEST_NOT_SCORED_RAILS = [
  "cad",
  "owner",
  "zoning",
  "envelope",
  "landuse",
];

/** @deprecated fixture iteration only; use SCORER_SPEC_RAILS for grading. */
const UNSPECIFIED_RAILS = SCORER_SPEC_RAILS.filter(
  (r) => !["geometry", "flood", "mud"].includes(r),
);

/** Legacy alias — geometry / flood / mud had specs before P-59. */
const SPECIFIED_RAILS = ["geometry", "flood", "mud"];

export function isPctSet(value) {
  return value !== null && value !== undefined;
}

export function texasCountyFipsList() {
  const list = [];
  for (let i = 1; i <= 507; i += 2) {
    list.push(String(48000 + i));
  }
  return list;
}

function bump(map, key) {
  const k = key === undefined ? "<missing>" : String(key);
  map[k] = (map[k] || 0) + 1;
}

export function summarizeByRail(cells) {
  const byRail = {};
  for (const cell of cells) {
    const key = cell.railKey;
    if (typeof key !== "string" || key.length === 0) {
      continue;
    }
    if (!byRail[key]) {
      byRail[key] = {
        n: 0,
        displayState: {},
        honestCoveragePctNull: 0,
        honestCoveragePctSet: 0,
      };
    }
    const row = byRail[key];
    row.n += 1;
    bump(row.displayState, cell.displayState);
    if (isPctSet(cell.honestCoveragePct)) {
      row.honestCoveragePctSet += 1;
    } else {
      row.honestCoveragePctNull += 1;
    }
  }
  return byRail;
}

export function gradeManifest(payload) {
  const failures = [];
  const summary = payload && payload.summary;
  const cells = payload && payload.manifestCells;
  if (!summary || typeof summary !== "object") {
    return {
      pass: false,
      failures: ["missing summary object (read by name)"],
      quotes: null,
      byRail: {},
      harrisRoads: null,
      specifiedSatisfied: {},
      unspecifiedSatisfiedPresent: {},
      honestNotScoredPresent: {},
    };
  }
  if (!Array.isArray(cells)) {
    return {
      pass: false,
      failures: ["missing manifestCells[] (read by name)"],
      quotes: {
        computedAt: summary.computedAt,
        servedAt: summary.servedAt,
        totalCells: summary.totalCells,
        totalRails: summary.totalRails,
      },
      byRail: {},
      harrisRoads: null,
      specifiedSatisfied: {},
      unspecifiedSatisfiedPresent: {},
      honestNotScoredPresent: {},
    };
  }

  const quotes = {
    computedAt: summary.computedAt,
    servedAt: summary.servedAt,
    totalCells: summary.totalCells,
    totalRails: summary.totalRails,
  };
  const byRail = summarizeByRail(cells);
  const roads = cells.filter((cell) => cell.railKey === "roads");
  if (roads.length !== EXPECTED_ROADS_N) {
    failures.push(
      `roads n=${roads.length} expected ${EXPECTED_ROADS_N} (counted by railKey, not subtraction)`,
    );
  }
  for (const cell of roads) {
    if (isPctSet(cell.honestCoveragePct)) {
      failures.push(
        `roads invented honestCoveragePct countyFips=${cell.countyFips} value=${JSON.stringify(cell.honestCoveragePct)}`,
      );
    }
    if (cell.displayState !== "not-yet") {
      failures.push(
        `roads displayState=${JSON.stringify(cell.displayState)} countyFips=${cell.countyFips} (expected not-yet)`,
      );
    }
  }

  const harrisRoads = roads.find((cell) => cell.countyFips === HARRIS_FIPS) || null;
  if (!harrisRoads) {
    failures.push("Harris 48201 roads cell missing");
  } else if (harrisRoads.displayState !== "not-yet") {
    failures.push(
      `Harris 48201 roads displayState=${JSON.stringify(harrisRoads.displayState)} (A-017 expected not-yet)`,
    );
  }

  const unspecifiedSatisfiedPresent = {};
  const honestNotScoredPresent = {};
  const badUnspecified = cells.filter(
    (cell) =>
      cell.displayState === "satisfied-present" &&
      !SCORER_SPEC_RAILS.includes(cell.railKey) &&
      !HONEST_NOT_SCORED_RAILS.includes(cell.railKey),
  );
  for (const cell of badUnspecified) {
    const rail = cell.railKey;
    unspecifiedSatisfiedPresent[rail] =
      (unspecifiedSatisfiedPresent[rail] || 0) + 1;
    failures.push(
      `rail ${rail} satisfied-present without scorer spec (countyFips=${cell.countyFips})`,
    );
  }
  for (const cell of cells) {
    if (
      cell.displayState === "satisfied-present" &&
      HONEST_NOT_SCORED_RAILS.includes(cell.railKey)
    ) {
      const rail = cell.railKey;
      honestNotScoredPresent[rail] =
        (honestNotScoredPresent[rail] || 0) + 1;
    }
  }

  const specifiedSatisfied = {};
  let anySpecifiedSatisfied = false;
  for (const rail of SPECIFIED_RAILS) {
    const sat = cells.filter(
      (cell) =>
        cell.railKey === rail &&
        typeof cell.displayState === "string" &&
        cell.displayState.startsWith("satisfied-"),
    );
    specifiedSatisfied[rail] = {
      n: sat.length,
      displayState: {},
    };
    for (const cell of sat) {
      bump(specifiedSatisfied[rail].displayState, cell.displayState);
    }
    if (sat.length > 0) {
      anySpecifiedSatisfied = true;
    }
  }
  if (!anySpecifiedSatisfied) {
    failures.push(
      "no specified rail (geometry / flood / mud) has satisfied-* cells",
    );
  }

  return {
    pass: failures.length === 0,
    failures,
    quotes,
    byRail,
    harrisRoads: harrisRoads
      ? {
          countyFips: harrisRoads.countyFips,
          railKey: harrisRoads.railKey,
          displayState: harrisRoads.displayState,
          honestCoveragePct: harrisRoads.honestCoveragePct ?? null,
        }
      : null,
    specifiedSatisfied,
    unspecifiedSatisfiedPresent,
    honestNotScoredPresent,
  };
}

function cell(countyFips, railKey, displayState, honestCoveragePct) {
  return { countyFips, railKey, displayState, honestCoveragePct };
}

export function fixture254NotYet() {
  const fips = texasCountyFipsList();
  if (fips.length !== EXPECTED_ROADS_N) {
    throw new Error(`fixture generator produced ${fips.length} FIPS, not 254`);
  }
  if (!fips.includes(HARRIS_FIPS)) {
    throw new Error("fixture generator omitted Harris 48201");
  }
  const manifestCells = [];
  for (const countyFips of fips) {
    manifestCells.push(cell(countyFips, "roads", "not-yet", null));
    for (const rail of UNSPECIFIED_RAILS) {
      if (rail === "roads") continue;
      manifestCells.push(cell(countyFips, rail, "not-yet", null));
    }
    manifestCells.push(
      cell(countyFips, "geometry", "satisfied-present", 99.5),
    );
  }
  return {
    summary: {
      computedAt: "fixture-254-not-yet",
      servedAt: "fixture-254-not-yet",
      totalCells: manifestCells.length,
      totalRails: 1 + (UNSPECIFIED_RAILS.length - 1) + 1,
    },
    manifestCells,
  };
}

export function fixtureRoadsInvented() {
  const payload = fixture254NotYet();
  const harris = payload.manifestCells.find(
    (c) => c.railKey === "roads" && c.countyFips === HARRIS_FIPS,
  );
  harris.honestCoveragePct = 12;
  harris.displayState = "not-yet";
  payload.summary.computedAt = "fixture-roads-invented";
  payload.summary.servedAt = "fixture-roads-invented";
  return payload;
}

export const ROADS_INVENTED_CELL = {
  countyFips: HARRIS_FIPS,
  railKey: "roads",
  displayState: "not-yet",
  honestCoveragePct: 12,
};

export function runSelfTests() {
  const cases = [];

  const invented = gradeManifest(fixtureRoadsInvented());
  cases.push({
    name: "invented roads percent FAILS",
    expectPass: false,
    pass: invented.pass === false,
    observedPass: invented.pass,
    failures: invented.failures,
    whatWouldProveInstrumentWrong: "this fixture PASSES (instrument admits an invented roads percent)",
  });

  const honest = gradeManifest(fixture254NotYet());
  cases.push({
    name: "254 roads not-yet PASSES",
    expectPass: true,
    pass: honest.pass === true,
    observedPass: honest.pass,
    failures: honest.failures,
    whatWouldProveInstrumentWrong: "this fixture FAILS (instrument rejects honest 254 not-yet)",
  });

  const empty = gradeManifest({});
  cases.push({
    name: "empty payload FAILS (not vacuous)",
    expectPass: false,
    pass: empty.pass === false,
    observedPass: empty.pass,
    failures: empty.failures,
    whatWouldProveInstrumentWrong: "empty payload PASSES (instrument is vacuous-pass)",
  });

  const noSpecified = fixture254NotYet();
  noSpecified.manifestCells = noSpecified.manifestCells.filter(
    (c) => c.railKey !== "geometry",
  );
  const noSpecGrade = gradeManifest(noSpecified);
  cases.push({
    name: "254 not-yet with no specified satisfied-* FAILS",
    expectPass: false,
    pass: noSpecGrade.pass === false,
    observedPass: noSpecGrade.pass,
    failures: noSpecGrade.failures,
    whatWouldProveInstrumentWrong:
      "payload with no geometry/flood/mud satisfied-* PASSES",
  });

  const leak = fixture254NotYet();
  leak.manifestCells.push(
    cell(HARRIS_FIPS, "phantom-rail", "satisfied-present", 50),
  );
  const leakGrade = gradeManifest(leak);
  cases.push({
    name: "phantom rail satisfied-present without scorer spec FAILS",
    expectPass: false,
    pass: leakGrade.pass === false,
    observedPass: leakGrade.pass,
    failures: leakGrade.failures,
    whatWouldProveInstrumentWrong:
      "phantom rail satisfied-present PASSES",
  });

  const depthOk = fixture254NotYet();
  depthOk.manifestCells.push(
    cell(HARRIS_FIPS, "cad", "satisfied-present", null),
    cell(HARRIS_FIPS, "owner", "satisfied-present", null),
    cell(HARRIS_FIPS, "zoning", "satisfied-present", null),
    cell(HARRIS_FIPS, "landuse", "satisfied-present", null),
  );
  const depthGrade = gradeManifest(depthOk);
  cases.push({
    name: "depth rail satisfied-present without scorer spec PASSES",
    expectPass: true,
    pass: depthGrade.pass === true,
    observedPass: depthGrade.pass,
    failures: depthGrade.failures,
    whatWouldProveInstrumentWrong:
      "cad/owner/zoning/landuse satisfied-present FAILS (depth rails misclassified as phantom)",
  });

  const ok = cases.every((c) => c.pass === true);
  return {
    ok,
    cases,
    roadsInventedCell: ROADS_INVENTED_CELL,
    texasFipsN: texasCountyFipsList().length,
    harrisInGenerator: texasCountyFipsList().includes(HARRIS_FIPS),
  };
}

function curlExecutable() {
  const names = process.platform === "win32" ? ["curl.exe", "curl"] : ["curl"];
  for (const name of names) {
    const probe = spawnSync(name, ["--version"], {
      encoding: "utf8",
      timeout: 5000,
      windowsHide: true,
    });
    if (probe.status === 0) return name;
  }
  return null;
}

export function fetchLedger() {
  const startedAt = new Date().toISOString();
  const curl = curlExecutable();
  if (!curl) {
    return {
      httpStatus: null,
      ok: false,
      error: "curl executable unavailable (node fetch cannot verify the Cloud Run leaf cert)",
      startedAt,
      fetchedAt: new Date().toISOString(),
      url: LEDGER_URL,
      byteLength: 0,
      json: null,
      transport: "none",
    };
  }
  const marker = "__P47_HTTP_STATUS__:";
  const args = [
    ...(process.platform === "win32" ? ["--ssl-no-revoke"] : []),
    "--max-time",
    "60",
    "--connect-timeout",
    "15",
    "-sS",
    "-H",
    "Accept: application/json",
    "-w",
    `\n${marker}%{http_code}`,
    LEDGER_URL,
  ];
  const run = spawnSync(curl, args, {
    encoding: "utf8",
    timeout: 70_000,
    maxBuffer: 40 * 1024 * 1024,
    windowsHide: true,
  });
  const fetchedAt = new Date().toISOString();
  if (run.error) {
    return {
      httpStatus: null,
      ok: false,
      error: `curl failed: ${run.error.message}`,
      startedAt,
      fetchedAt,
      url: LEDGER_URL,
      byteLength: 0,
      json: null,
      transport: curl,
    };
  }
  if (run.status !== 0) {
    return {
      httpStatus: null,
      ok: false,
      error: `curl exited ${run.status}: ${(run.stderr || run.stdout || "").slice(0, 400)}`,
      startedAt,
      fetchedAt,
      url: LEDGER_URL,
      byteLength: 0,
      json: null,
      transport: curl,
    };
  }
  const stdout = run.stdout || "";
  const i = stdout.lastIndexOf(`\n${marker}`);
  if (i < 0) {
    return {
      httpStatus: null,
      ok: false,
      error: "curl status marker missing",
      startedAt,
      fetchedAt,
      url: LEDGER_URL,
      byteLength: stdout.length,
      json: null,
      transport: curl,
    };
  }
  const bodyText = stdout.slice(0, i);
  const httpStatus = Number(stdout.slice(i + marker.length + 1));
  let json = null;
  try {
    json = JSON.parse(bodyText);
  } catch {
    return {
      httpStatus,
      ok: false,
      error: "response is not JSON",
      startedAt,
      fetchedAt,
      url: LEDGER_URL,
      byteLength: bodyText.length,
      json: null,
      transport: curl,
    };
  }
  return {
    httpStatus,
    ok: httpStatus === 200 && json !== null,
    error: httpStatus === 200 ? null : `HTTP ${httpStatus}`,
    startedAt,
    fetchedAt,
    url: LEDGER_URL,
    byteLength: bodyText.length,
    json,
    transport: curl,
  };
}

function parseArgs(argv) {
  const out = { selfTest: false, live: false };
  for (const a of argv) {
    if (a === "--self-test") out.selfTest = true;
    else if (a === "--live") out.live = true;
  }
  if (!out.selfTest && !out.live) {
    out.selfTest = true;
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const selfTest = runSelfTests();
  if (!selfTest.ok) {
    process.stdout.write(
      JSON.stringify({ control: "p47-manifest", selfTest, live: null }, null, 2) +
        "\n",
    );
    process.exit(1);
  }
  if (!args.live) {
    process.stdout.write(
      JSON.stringify(
        { control: "p47-manifest", selfTest, live: null },
        null,
        2,
      ) + "\n",
    );
    process.exit(0);
  }

  const fetched = fetchLedger();
  if (!fetched.ok || !fetched.json) {
    process.stdout.write(
      JSON.stringify(
        {
          control: "p47-manifest",
          selfTest,
          live: {
            pass: false,
            error: fetched.error,
            httpStatus: fetched.httpStatus,
            url: fetched.url,
            startedAt: fetched.startedAt,
            fetchedAt: fetched.fetchedAt,
          },
        },
        null,
        2,
      ) + "\n",
    );
    process.exit(1);
  }

  const grade = gradeManifest(fetched.json);
  const report = {
    control: "p47-manifest",
    selfTest: {
      ok: selfTest.ok,
      caseNames: selfTest.cases.map((c) => c.name),
      roadsInventedCell: selfTest.roadsInventedCell,
    },
    live: {
      url: fetched.url,
      httpStatus: fetched.httpStatus,
      startedAt: fetched.startedAt,
      fetchedAt: fetched.fetchedAt,
      byteLength: fetched.byteLength,
      method: "GET",
      transport: fetched.transport,
      postRecompute: false,
      pass: grade.pass,
      failures: grade.failures,
      quotes: grade.quotes,
      byRail: grade.byRail,
      harrisRoads: grade.harrisRoads,
      specifiedSatisfied: grade.specifiedSatisfied,
      unspecifiedSatisfiedPresent: grade.unspecifiedSatisfiedPresent,
      honestNotScoredPresent: grade.honestNotScoredPresent,
    },
  };
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  const reportPath = join(ROOT, "_inbox", "2026-08-22_p47_manifest_grade.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  process.exit(grade.pass ? 0 : 2);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    process.stderr.write(String(err && err.stack ? err.stack : err) + "\n");
    process.exit(1);
  });
}
