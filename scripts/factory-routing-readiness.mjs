#!/usr/bin/env node
/**
 * Factory routing readiness (WDLL items 3-6 / P-73).
 *
 * Grades `_inbox/2026-08-24_factory_routing_pin.json`. A READY lie is a
 * fail. Canvas captions are not this instrument.
 *
 * Three-question gate:
 *   Executes: this file. Not a person.
 *   Triggers: WDLL items 3-6. Not a repo-wide hook (that would block
 *     unrelated docs and teach bypass).
 *   Fails: exit 1. ready:true with empty dest/join/servingHop/planRow,
 *     ready:true with a non-null defect, who-serves or city-limits claimed
 *     as a Manifest rail, a vacuous empty phrase, or P-25 / P-09 / roads
 *     COVER marked ready:true.
 *   Bypasses: anyone who does not run it.
 *
 * Usage:
 *   node scripts/factory-routing-readiness.mjs --self-test
 *   node scripts/factory-routing-readiness.mjs --check
 * --check always self-tests first. Default is --check.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PIN_PATH = join(ROOT, "_inbox", "2026-08-24_factory_routing_pin.json");
const DUMP_PATH = join(ROOT, "_inbox", "2026-08-24_county_manifest_dump.json");

export const MANIFEST_RAILS = [
  "cad",
  "owner",
  "landuse",
  "geometry",
  "flood",
  "mud",
  "zoning",
  "roads",
  "footprint",
  "easement",
  "envelope",
  "rrc-wells",
  "rrc-pipelines",
  "rail-corridor",
];

export const NOT_A_RAIL = ["who-serves", "city-limits"];

export const ROW_FIELDS = [
  "rail",
  "factory",
  "source",
  "dest",
  "join",
  "servingHop",
  "planRow",
  "ready",
  "defect",
  "manifestRail",
];

const FACTORIES = new Set([1, 1.5, 2]);
const HELD_PLAN_ROWS = new Set(["P-25", "P-09"]);

/** Leftover phrases item 6 requires on the live pin. Empty phrase is refused. */
export const LEFTOVER_PHRASES = [
  "P-75 #475",
  "403d8010",
  "P-76",
  "last-wins",
  "tax_year DESC",
  "A-004",
  "A-017",
];

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * Presence of required phrases in text. An empty phrase would match every
 * string (indexOf("") === 0). Refuse that. That is F4.
 */
export function gradeRequiredPhrases(text, phrases) {
  if (!Array.isArray(phrases) || phrases.length === 0) {
    return {
      ok: false,
      reason: "phrase list empty (vacuous)",
      missing: [],
    };
  }
  if (phrases.some((p) => p === "" || (typeof p === "string" && p.trim() === ""))) {
    return {
      ok: false,
      reason: "empty phrase refused (would match every string)",
      missing: [],
    };
  }
  const hay = typeof text === "string" ? text : "";
  const missing = phrases.filter((p) => !hay.includes(p));
  return {
    ok: missing.length === 0,
    reason: missing.length ? "missing required phrase" : null,
    missing,
  };
}

export function missingRowFields(row) {
  if (!row || typeof row !== "object") return ROW_FIELDS.slice();
  return ROW_FIELDS.filter((k) => !Object.prototype.hasOwnProperty.call(row, k));
}

export function gradeReadyPredicate(row) {
  const missingFields = missingRowFields(row);
  if (missingFields.length) {
    return {
      ok: false,
      reason: `row missing fields: ${missingFields.join(",")}`,
      violations: missingFields,
    };
  }
  if (typeof row.ready !== "boolean") {
    return { ok: false, reason: "ready must be boolean", violations: ["ready"] };
  }
  if (!(row.defect === null || typeof row.defect === "string")) {
    return { ok: false, reason: "defect must be string or null", violations: ["defect"] };
  }
  if (!FACTORIES.has(row.factory)) {
    return { ok: false, reason: "factory must be 1 | 1.5 | 2", violations: ["factory"] };
  }
  if (row.ready !== true) {
    return { ok: true, reason: null, violations: [] };
  }
  const violations = [];
  if (!isNonEmptyString(row.dest)) violations.push("dest");
  if (!isNonEmptyString(row.join)) violations.push("join");
  if (!isNonEmptyString(row.servingHop)) violations.push("servingHop");
  if (!isNonEmptyString(row.planRow)) violations.push("planRow");
  if (row.defect !== null) violations.push("defect");
  return {
    ok: violations.length === 0,
    reason: violations.length
      ? `ready:true forbidden unless dest, join, servingHop, planRow are non-empty and defect is null (bad: ${violations.join(",")})`
      : null,
    violations,
  };
}

/**
 * who-serves / city-limits are never Manifest rails. Inventing them as
 * manifestRail:true is F3. A ready who-serves row still cannot imply a rail.
 */
export function gradeManifestRailClaim(row) {
  const rail = row && row.rail;
  if (NOT_A_RAIL.includes(rail)) {
    if (row.manifestRail === true) {
      return {
        ok: false,
        reason: `${rail} is not a Manifest rail (invented rail)`,
      };
    }
    if (row.manifestRail !== false) {
      return { ok: false, reason: `${rail} must set manifestRail:false` };
    }
    return { ok: true, reason: null };
  }
  if (MANIFEST_RAILS.includes(rail)) {
    if (row.manifestRail !== true) {
      return { ok: false, reason: `${rail} is a Manifest rail and must set manifestRail:true` };
    }
    return { ok: true, reason: null };
  }
  return { ok: false, reason: `unknown rail ${rail}` };
}

export function gradeHeldReadyLie(rows) {
  const lies = [];
  for (const row of rows || []) {
    if (row.ready !== true) continue;
    if (HELD_PLAN_ROWS.has(row.planRow)) {
      lies.push(`${row.rail} planRow ${row.planRow} ready:true`);
    }
    if (row.rail === "roads") {
      lies.push("roads COVER ready:true");
    }
  }
  return {
    ok: lies.length === 0,
    reason: lies.length ? `held rows marked ready:true: ${lies.join("; ")}` : null,
    lies,
  };
}

export function goodReadyFixture() {
  return {
    rail: "geometry",
    factory: 1,
    source: "txgio_parcel",
    dest: "txgio_parcel.geometry",
    join: "(county_fips, prop_id)",
    servingHop: "county-ledger geometry 253 present",
    planRow: "P-01",
    ready: true,
    defect: null,
    manifestRail: true,
  };
}

function assert(name, cond, failures) {
  if (!cond) failures.push(name);
}

export function runSelfTests() {
  const failures = [];
  const cases = [];

  const f1 = gradeReadyPredicate(goodReadyFixture());
  const f1Rail = gradeManifestRailClaim(goodReadyFixture());
  const f1ok = f1.ok && f1Rail.ok;
  cases.push({ id: "F1", name: "good ready row with all fields PASS", ok: f1ok });
  assert("F1 good ready row with all fields PASS", f1ok, failures);

  const emptyDest = { ...goodReadyFixture(), dest: "" };
  const f2 = gradeReadyPredicate(emptyDest);
  const f2ok = f2.ok === false && f2.violations.includes("dest");
  cases.push({ id: "F2", name: "ready+empty dest FAIL", ok: f2ok, reason: f2.reason });
  assert("F2 ready+empty dest FAIL", f2ok, failures);

  const invented = {
    ...goodReadyFixture(),
    rail: "who-serves",
    manifestRail: true,
    ready: false,
    dest: "serve DTO",
    join: "centroid PIP",
    servingHop: "",
    planRow: "P-75",
    defect: "fixture",
  };
  const f3 = gradeManifestRailClaim(invented);
  const f3ok = f3.ok === false;
  cases.push({ id: "F3", name: "invented who-serves as manifestRail true FAIL", ok: f3ok, reason: f3.reason });
  assert("F3 invented who-serves as manifestRail true FAIL", f3ok, failures);

  const f4 = gradeRequiredPhrases("anything", [""]);
  const f4ok = f4.ok === false;
  cases.push({ id: "F4", name: "empty phrase / vacuous check FAIL", ok: f4ok, reason: f4.reason });
  assert("F4 empty phrase / vacuous check FAIL", f4ok, failures);

  const pin = loadJson(PIN_PATH);
  const held = gradeHeldReadyLie(pin.rows);
  const f5ok = held.ok === true;
  cases.push({
    id: "F5",
    name: "live pin P-25 and P-09 and roads are ready:false",
    ok: f5ok,
    reason: held.reason,
  });
  assert("F5 live pin P-25 and P-09 and roads are ready:false", f5ok, failures);

  return { ok: failures.length === 0, failures, cases };
}

function pinDefectText(pin) {
  return (pin.rows || [])
    .map((r) => (typeof r.defect === "string" ? r.defect : ""))
    .join("\n");
}

export function checkLive(pin, dump) {
  const failures = [];
  const rows = Array.isArray(pin.rows) ? pin.rows : [];

  const expected = [...MANIFEST_RAILS, ...NOT_A_RAIL];
  const seen = rows.map((r) => r.rail);
  for (const rail of expected) {
    if (!seen.includes(rail)) failures.push(`missing row ${rail}`);
  }
  const extras = seen.filter((r) => !expected.includes(r));
  if (extras.length) failures.push(`unknown rows: ${extras.join(",")}`);

  const dumpRails = (dump.rails || []).map((r) => r.railKey).sort();
  const pinManifest = rows.filter((r) => r.manifestRail === true).map((r) => r.rail).sort();
  if (JSON.stringify(dumpRails) !== JSON.stringify([...MANIFEST_RAILS].sort())) {
    failures.push(
      `dump rails ${dumpRails.join(",")} != pin Manifest set ${[...MANIFEST_RAILS].sort().join(",")}`,
    );
  }
  if (JSON.stringify(pinManifest) !== JSON.stringify([...MANIFEST_RAILS].sort())) {
    failures.push("pin manifestRail:true set != Manifest rails");
  }
  if (dumpRails.includes("who-serves") || dumpRails.includes("city-limits")) {
    failures.push("dump invented who-serves or city-limits as a rail");
  }

  const readyTrue = [];
  for (const row of rows) {
    const pred = gradeReadyPredicate(row);
    if (!pred.ok) failures.push(`${row.rail}: ${pred.reason}`);
    const claim = gradeManifestRailClaim(row);
    if (!claim.ok) failures.push(`${row.rail}: ${claim.reason}`);
    if (row.ready === true) {
      readyTrue.push({
        rail: row.rail,
        planRow: row.planRow,
        servingHop: row.servingHop,
      });
    }
  }

  const held = gradeHeldReadyLie(rows);
  if (!held.ok) failures.push(held.reason);

  const leftovers = gradeRequiredPhrases(pinDefectText(pin), LEFTOVER_PHRASES);
  if (!leftovers.ok) {
    failures.push(leftovers.reason + (leftovers.missing.length ? ` (${leftovers.missing.join(",")})` : ""));
  }

  return {
    status: failures.length === 0 ? "PASS" : "FAIL",
    snapshot: pin.snapshot || null,
    rowCount: rows.length,
    readyTrue,
    readyFalse: rows.filter((r) => r.ready === false).map((r) => r.rail),
    failures,
  };
}

function parseArgs(argv) {
  const out = { selfTest: false, check: false };
  for (const a of argv) {
    if (a === "--self-test") out.selfTest = true;
    else if (a === "--check") out.check = true;
  }
  if (!out.selfTest && !out.check) out.check = true;
  return out;
}

function main() {
  // F-03 item 9: pin retired by refuse after holds are imported as data.
  const consoleUrl = process.env.FACTORY_CONSOLE_URL || "Smart Site Factory";
  process.stdout.write(
    JSON.stringify(
      {
        control: "factory-routing-readiness",
        status: "RETIRED",
        exit: 2,
        message: `retired by refuse. Holds live in the Factory store. Read them on the console: ${consoleUrl}`,
      },
      null,
      2,
    ) + "\n",
  );
  process.exit(2);
  const args = parseArgs(process.argv.slice(2));
  const selfTest = runSelfTests();
  if (!selfTest.ok) {
    process.stdout.write(
      JSON.stringify({ control: "factory-routing-readiness", selfTest }, null, 2) + "\n",
    );
    process.exit(1);
  }
  if (!args.check) {
    process.stdout.write(
      JSON.stringify({ control: "factory-routing-readiness", selfTest, live: null }, null, 2) + "\n",
    );
    process.exit(0);
  }

  const pin = loadJson(PIN_PATH);
  const dump = loadJson(DUMP_PATH);
  const live = checkLive(pin, dump);
  process.stdout.write(
    JSON.stringify(
      {
        control: "factory-routing-readiness",
        planRow: pin.planRow,
        wdllItems: pin.wdllItems,
        selfTest,
        live,
      },
      null,
      2,
    ) + "\n",
  );
  process.exit(live.status === "PASS" ? 0 : 1);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
