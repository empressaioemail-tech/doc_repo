#!/usr/bin/env node
/**
 * Cad-ingest apply gate (before Texas fill).
 *
 * Grades a one-county apply packet. Does not run SQL. Does not apply.
 * Caldwell 2025-08-25: announce Path A + census only empty 2025 while
 * 2026 CAMA already existed and L17 was 2026/cad-export.
 *
 * Three-question gate:
 *   Executes: this file. Not a person.
 *   Triggers: leftover or CAMA apply packet. Not a repo-wide hook.
 *   Fails: exit 1. Missing packet, one-year-filtered census, Path A on
 *     empty leftover year, L17 flip when years differ, second FIPS,
 *     fallback flag, pin not PASS, P-25 ready, unstructured vintage,
 *     missing or wrong ldtSha (must equal SERVING_LDT_SHA).
 *   Bypasses: anyone who applies without --check --packet.
 *
 * Usage:
 *   node scripts/cad-ingest-apply-gate.mjs --self-test
 *   node scripts/cad-ingest-apply-gate.mjs --check --packet <path>
 * --check always self-tests first. No packet is a refuse.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE_DIR = join(ROOT, "scripts", "fixtures", "cad-ingest-apply-gate");

/** Serving LDT merge for stratmap-landuse / P-78 writer. Re-verify origin/main before bumping. */
export const SERVING_LDT_SHA = "46e1a5a1";

const YEAR_EQ = /tax_year\s*=/i;
const STRUCTURED = /^tier:(stratmap-roll|cad-export);/;

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function yearRow(rows, year) {
  if (!Array.isArray(rows)) return null;
  return rows.find((r) => Number(r.tax_year) === Number(year)) ?? null;
}

export function gradePacket(packet) {
  const failures = [];

  if (!packet || typeof packet !== "object") {
    return { ok: false, failures: ["packet missing"] };
  }

  const query = typeof packet.censusQuery === "string" ? packet.censusQuery : "";
  if (!query.trim()) failures.push("censusQuery empty");
  if (YEAR_EQ.test(query)) {
    failures.push("censusQuery filters tax_year = (must GROUP BY all years)");
  }
  if (!/group\s+by/i.test(query)) {
    failures.push("censusQuery missing GROUP BY tax_year");
  }

  const rows = packet.censusRows;
  if (!Array.isArray(rows)) failures.push("censusRows not an array");

  const leftoverYear = packet.leftoverTaxYear;
  const declaredYear = packet.declared?.taxYear;
  if (typeof leftoverYear !== "number" || !Number.isInteger(leftoverYear)) {
    failures.push("leftoverTaxYear missing");
  }
  if (typeof declaredYear !== "number" || !Number.isInteger(declaredYear)) {
    failures.push("declared.taxYear missing");
  }

  if (Array.isArray(rows) && Number.isInteger(leftoverYear)) {
    if (!rows.some((r) => Number(r.tax_year) === leftoverYear)) {
      failures.push(`censusRows missing leftover tax_year ${leftoverYear}`);
    }
  }
  if (Array.isArray(rows) && Number.isInteger(declaredYear)) {
    if (!rows.some((r) => Number(r.tax_year) === declaredYear)) {
      failures.push(`censusRows missing declared tax_year ${declaredYear}`);
    }
  }

  const leftover = Array.isArray(rows) ? yearRow(rows, leftoverYear) : null;
  const leftoverN = leftover ? Number(leftover.n) : null;
  const derivedPath = leftoverN === 0 ? "B" : leftoverN > 0 ? "A" : null;
  const announced = packet.announcedPath;
  if (derivedPath && announced !== derivedPath) {
    failures.push(
      `announcedPath ${announced} does not match census Path ${derivedPath} (leftover n=${leftoverN})`,
    );
  }

  if (
    Number.isInteger(leftoverYear) &&
    Number.isInteger(declaredYear) &&
    leftoverYear !== declaredYear
  ) {
    if (packet.inspectReadSet !== false) {
      failures.push("leftover year != declared year requires inspectReadSet=false");
    }
    if (packet.willFlipL17 !== false) {
      failures.push("willFlipL17 must be false when leftover year != declared year");
    }
  }

  if (Number(packet.countyCount) !== 1) {
    failures.push("countyCount must be 1");
  }
  if (packet.allowStratmapFallback !== false) {
    failures.push("allowStratmapFallback must be false");
  }
  if (packet.secondCounty !== false) {
    failures.push("secondCounty must be false");
  }
  if (packet.pinCheckPass !== true) {
    failures.push("pinCheckPass must be true");
  }
  if (packet.p25Ready !== false) {
    failures.push("p25Ready must be false");
  }

  const vintage = packet.sourceVintage;
  if (typeof vintage !== "string" || !STRUCTURED.test(vintage)) {
    failures.push("sourceVintage must start with tier:stratmap-roll; or tier:cad-export;");
  }

  if (typeof packet.fips !== "string" || !/^\d{5}$/.test(packet.fips)) {
    failures.push("fips must be a 5-digit county");
  }

  const ldtSha = packet.ldtSha;
  if (typeof ldtSha !== "string" || !ldtSha.trim()) {
    failures.push("ldtSha missing");
  } else if (ldtSha.trim() !== SERVING_LDT_SHA) {
    failures.push(
      `ldtSha ${ldtSha.trim()} does not match serving writer ${SERVING_LDT_SHA}`,
    );
  }

  return { ok: failures.length === 0, failures, derivedPath, leftoverN };
}

const FIXTURES = [
  { id: "F1", file: "F1-caldwell-path-a-empty-2025.json", expectOk: false },
  { id: "F2", file: "F2-path-b-inspect-honest.json", expectOk: true },
  { id: "F3", file: "F3-path-a-same-year.json", expectOk: true },
  { id: "F4", file: "F4-second-county-or-fallback.json", expectOk: false },
  { id: "F5", file: "F5-l17-flip.json", expectOk: false },
  { id: "F6", file: "F6-tax-year-filter.json", expectOk: false },
  { id: "F7", file: "F7-not-vacuous.json", expectOk: false },
  { id: "F8", file: "F8-pin-or-p25-ready.json", expectOk: false },
  { id: "F9", file: "F9-unstructured-vintage.json", expectOk: false },
  { id: "F10", file: "F10-wrong-ldt-sha.json", expectOk: false },
];

export function runSelfTest() {
  const results = [];
  for (const f of FIXTURES) {
    const packet = loadJson(join(FIXTURE_DIR, f.file));
    const graded = gradePacket(packet);
    const pass = graded.ok === f.expectOk;
    results.push({
      id: f.id,
      pass,
      expectOk: f.expectOk,
      gotOk: graded.ok,
      failures: graded.failures,
    });
    if (!pass) {
      const err = new Error(
        `${f.id} expected ok=${f.expectOk} got ok=${graded.ok} ${JSON.stringify(graded.failures)}`,
      );
      err.results = results;
      throw err;
    }
  }
  const notVacuous = results.find((r) => r.id === "F7");
  if (!notVacuous || notVacuous.gotOk !== false) {
    throw new Error("F7 not-vacuous did not fail");
  }
  return results;
}

function usage() {
  console.error(
    "Usage: node scripts/cad-ingest-apply-gate.mjs --self-test\n" +
      "       node scripts/cad-ingest-apply-gate.mjs --check --packet <path>",
  );
}

function main(argv) {
  const selfTest = argv.includes("--self-test");
  const check = argv.includes("--check") || (!selfTest && !argv.includes("--help"));
  if (argv.includes("--help")) {
    usage();
    process.exit(0);
  }

  try {
    const results = runSelfTest();
    console.log(
      JSON.stringify({ selfTest: "PASS", fixtures: results.map((r) => r.id) }),
    );
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  if (selfTest && !argv.includes("--check")) process.exit(0);

  const pIdx = argv.indexOf("--packet");
  const packetPath = pIdx >= 0 ? argv[pIdx + 1] : null;
  if (!packetPath) {
    console.error("REFUSE: --check requires --packet <path>");
    process.exit(1);
  }

  let packet;
  try {
    packet = loadJson(packetPath);
  } catch (err) {
    console.error(`REFUSE: cannot read packet ${packetPath}: ${err.message}`);
    process.exit(1);
  }

  const graded = gradePacket(packet);
  console.log(JSON.stringify({ check: graded.ok ? "PASS" : "FAIL", ...graded }));
  process.exit(graded.ok ? 0 : 1);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2));
}
