#!/usr/bin/env node
/**
 * P-78 cad_property merge reference (no database).
 *
 * Loads scripts/fixtures/p78-cad-merge/*.json and applies the JS merge
 * locked in _inbox/2026-08-24_p78_cad_property_merge_SPEC.md.
 *
 * Both directions:
 *   PASS: every fixture matches the reference merge
 *   FAIL: last-wins (current origin/main upsert) must fail F1 and F3;
 *         keep-existing must fail F2; assume-acres must fail F5;
 *         write-year-0 must fail F6; mutated F7 expect must fail
 *
 * Usage: node scripts/p78-merge-fixtures-selftest.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE_DIR = join(ROOT, "scripts", "fixtures", "p78-cad-merge");
const REFUSE_REASON = "gis_area_u_not_acres_or_convertible";

const ACRES_UNITS = new Set(["AC", "ACRE", "ACRES"]);
const SQFT_UNITS = new Set(["SF", "SQFT", "SQ.FT", "SQ FT", "SQUARE FEET"]);
const HA_UNITS = new Set(["HA", "HECTARE", "HECTARES"]);

const COALESCE_FIELDS = [
  "ownerName",
  "ownerMailingAddress",
  "situsAddress",
  "situsCity",
  "situsZip",
  "legalDescription",
  "exemptionCodes",
  "landValue",
  "improvementValue",
  "marketValue",
  "assessedValue",
  "landAcres",
  "propertyUseCode",
];

const IDENTITY = ["countyFips", "propId", "taxYear"];

/** Inclusive. Spec calendar year 2026 + 1. Implementing lane may use ingest year + 1. */
export const YEAR_BUILT_MIN = 1800;
export const YEAR_BUILT_MAX = 2027;

/**
 * YEAR_BUILT is StratMap C(60). Caldwell 202503 is 34% comma-joined lists
 * (`1962,2011,2023`). Number(YEAR_BUILT) is NaN on those rows and drops them.
 * Take the first token that is a 4-digit year in [YEAR_BUILT_MIN, YEAR_BUILT_MAX].
 * Skip junk tokens (`209`). Empty / 0 / no valid token → null. Never emit 0.
 */
export function parseYearBuilt(v) {
  if (v === 0 || v === "0" || v === "" || v == null) return null;
  if (typeof v === "number") {
    if (!Number.isInteger(v) || v < YEAR_BUILT_MIN || v > YEAR_BUILT_MAX) {
      return null;
    }
    return v;
  }
  const raw = String(v).trim();
  if (!raw) return null;
  for (const token of raw.split(",")) {
    const t = token.trim();
    if (!/^\d{4}$/.test(t)) continue;
    const n = Number(t);
    if (n >= YEAR_BUILT_MIN && n <= YEAR_BUILT_MAX) return n;
  }
  return null;
}

export function normalizeYearBuilt(v) {
  return parseYearBuilt(v);
}

function formatAcres(n) {
  const rounded = Math.round(n * 10000 + Number.EPSILON) / 10000;
  return rounded.toFixed(4);
}

/** GIS_AREA_U gate. Returns {landAcres} or {refuse, reason}. */
export function landAcresFromGis(gisArea, gisAreaU) {
  const unitRaw = gisAreaU == null ? "" : String(gisAreaU).trim();
  if (unitRaw.length === 0) {
    return { refuse: true, reason: REFUSE_REASON };
  }
  const unit = unitRaw.toUpperCase();
  const n = typeof gisArea === "number" ? gisArea : Number(gisArea);
  if (!Number.isFinite(n) || n <= 0) {
    return { landAcres: null };
  }
  if (ACRES_UNITS.has(unit)) return { landAcres: formatAcres(n) };
  if (SQFT_UNITS.has(unit)) return { landAcres: formatAcres(n / 43560) };
  if (HA_UNITS.has(unit)) {
    return { landAcres: formatAcres(n * 2.471053814671653) };
  }
  return { refuse: true, reason: REFUSE_REASON };
}

function isCamaVintage(vintage) {
  return typeof vintage === "string" && vintage.startsWith("tier:cad-export;");
}

function coalesce(incoming, existing) {
  return incoming == null ? existing : incoming;
}

function mergeAuthority(incoming, existing, incomingVintage, existingVintage, normalize) {
  const inc = normalize ? normalize(incoming) : incoming;
  const ex = normalize ? normalize(existing) : existing;
  if (inc == null) return ex;
  if (ex == null) return inc;
  if (isCamaVintage(incomingVintage)) return inc;
  if (isCamaVintage(existingVintage)) return ex;
  return inc;
}

/**
 * Reference merge. If the fixture carries gisArea/gisAreaU and the unit
 * gate refuses, return {refuse, reason} (F5). Otherwise return the row.
 */
export function applyMerge(fixture) {
  if (fixture.gisArea != null || fixture.gisAreaU != null) {
    const gate = landAcresFromGis(fixture.gisArea, fixture.gisAreaU);
    if (gate.refuse) return { refuse: true, reason: gate.reason };
  }

  const existing = fixture.existingRow;
  const incoming = { ...fixture.incomingRow };
  incoming.yearBuilt = normalizeYearBuilt(incoming.yearBuilt);

  if (fixture.gisArea != null || fixture.gisAreaU != null) {
    const gate = landAcresFromGis(fixture.gisArea, fixture.gisAreaU);
    if (!gate.refuse) incoming.landAcres = gate.landAcres;
  }

  const out = {};
  for (const k of IDENTITY) out[k] = incoming[k];
  for (const k of COALESCE_FIELDS) out[k] = coalesce(incoming[k], existing[k]);
  out.yearBuilt = mergeAuthority(
    incoming.yearBuilt,
    existing.yearBuilt,
    incoming.sourceVintage,
    existing.sourceVintage,
    normalizeYearBuilt,
  );
  out.livingAreaSqft = mergeAuthority(
    incoming.livingAreaSqft,
    existing.livingAreaSqft,
    incoming.sourceVintage,
    existing.sourceVintage,
    null,
  );
  out.sourceFile = incoming.sourceFile;
  out.sourceVintage = incoming.sourceVintage;
  return out;
}

/** Current origin/main upsert: every attribute from incoming, including null. */
export function applyLastWins(fixture) {
  return { ...fixture.incomingRow };
}

export function applyKeepExisting(fixture) {
  return { ...fixture.existingRow };
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a !== "object" || typeof b !== "object") return false;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}

function loadFixtures() {
  const files = readdirSync(FIXTURE_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
  if (files.length < 8) {
    throw new Error(`expected at least 8 fixtures, found ${files.length}`);
  }
  return files.map((f) => {
    const fix = JSON.parse(readFileSync(join(FIXTURE_DIR, f), "utf8"));
    fix._file = f;
    return fix;
  });
}

function fail(msg) {
  console.error(`FAIL ${msg}`);
  process.exitCode = 1;
}

function main() {
  const fixtures = loadFixtures();
  const byName = Object.fromEntries(fixtures.map((f) => [f.name, f]));
  for (const required of ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"]) {
    if (!byName[required]) {
      fail(`missing required fixture ${required}`);
      return;
    }
  }

  let passed = 0;
  for (const fix of fixtures) {
    const got = applyMerge(fix);
    if (!deepEqual(got, fix.expect)) {
      fail(`${fix.name} (${fix._file}): reference merge != expect`);
      console.error("  got   ", JSON.stringify(got));
      console.error("  expect", JSON.stringify(fix.expect));
      return;
    }
    passed += 1;
  }
  console.log(`PASS fixtures ${passed}/${fixtures.length} against reference merge`);

  const f1Last = applyLastWins(byName.F1);
  if (deepEqual(f1Last, byName.F1.expect)) {
    fail("F1 last-wins matched expect (vacuous: last-wins must wipe legal)");
    return;
  }
  if (f1Last.legalDescription !== null) {
    fail("F1 last-wins expected incoming null legal");
    return;
  }
  console.log("PASS F1 last-wins fails (null legal would wipe StratMap)");

  const f3Last = applyLastWins(byName.F3);
  if (deepEqual(f3Last, byName.F3.expect)) {
    fail("F3 last-wins matched expect (vacuous: last-wins must wipe year)");
    return;
  }
  if (f3Last.yearBuilt !== null) {
    fail("F3 last-wins expected incoming null year_built");
    return;
  }
  console.log("PASS F3 last-wins fails (null year would wipe CAMA)");

  const f2Keep = applyKeepExisting(byName.F2);
  if (deepEqual(f2Keep, byName.F2.expect)) {
    fail("F2 keep-existing matched expect (vacuous: sqft would stay null)");
    return;
  }
  console.log("PASS F2 keep-existing fails (sqft would stay null)");

  const assumeAcres = landAcresFromGis(byName.F5.gisArea, "AC");
  if (assumeAcres.refuse) {
    fail("assume-acres control refused AC (unit table inverted)");
    return;
  }
  if (deepEqual({ refuse: true, reason: REFUSE_REASON }, { landAcres: assumeAcres.landAcres })) {
    fail("F5 assume-acres collapsed into refuse expect");
    return;
  }
  const f5Ref = applyMerge(byName.F5);
  if (!f5Ref.refuse) {
    fail("F5 reference did not refuse land_acres");
    return;
  }
  console.log("PASS F5 refuse fires; assume-acres is a different outcome");

  const writeZero = { ...applyMerge(byName.F6), yearBuilt: 0 };
  if (deepEqual(writeZero, byName.F6.expect)) {
    fail("F6 writing year_built 0 matched expect");
    return;
  }
  if (applyMerge(byName.F6).yearBuilt !== null) {
    fail("F6 reference stored a non-null year_built");
    return;
  }
  console.log("PASS F6 incoming 0 stores null; writing 0 would fail");

  const mutated = {
    ...byName.F7,
    expect: { ...byName.F7.expect, legalDescription: "MUTATED" },
  };
  if (deepEqual(applyMerge(mutated), mutated.expect)) {
    fail("F7 mutated expect matched (runner is matching everything)");
    return;
  }
  const f7 = applyMerge(byName.F7);
  if (!deepEqual(f7, byName.F7.existingRow) || !deepEqual(f7, byName.F7.incomingRow)) {
    fail("F7 merge is not identity");
    return;
  }
  console.log("PASS F7 identity; mutated expect fails");

  const ac = landAcresFromGis(1.5, "AC");
  const sf = landAcresFromGis(43560, "SQFT");
  const ha = landAcresFromGis(1, "HA");
  const sqm = landAcresFromGis(2.15, "SQM");
  const missing = landAcresFromGis(2.15, "");
  if (ac.landAcres !== "1.5000" || sf.landAcres !== "1.0000" || ha.landAcres !== "2.4711") {
    fail(`unit table identity/convert: ac=${ac.landAcres} sf=${sf.landAcres} ha=${ha.landAcres}`);
    return;
  }
  if (!sqm.refuse || !missing.refuse) {
    fail("unit table did not refuse SQM / blank");
    return;
  }
  const zeroArea = landAcresFromGis(0, "AC");
  if (zeroArea.landAcres !== null || zeroArea.refuse) {
    fail("GIS_AREA 0 with AC must emit null acres, not refuse and not 0");
    return;
  }
  console.log("PASS GIS unit table both directions (AC/SQFT/HA write; SQM/blank refuse; 0 area null)");

  const keepYear = applyMerge({
    existingRow: { ...byName.F6.existingRow, yearBuilt: 1984, sourceVintage: "tier:cad-export;adapter:x;drop:y" },
    incomingRow: { ...byName.F6.incomingRow, yearBuilt: 0 },
  });
  if (keepYear.yearBuilt !== 1984) {
    fail(`incoming 0 must not wipe existing 1984, got ${keepYear.yearBuilt}`);
    return;
  }
  console.log("PASS incoming year_built 0 does not wipe existing 1984");

  const listYear = parseYearBuilt("1962,2011,2023");
  const skipJunk = parseYearBuilt("209,1975,2002");
  const numberCoerce = Number("1962,2011,2023");
  if (listYear !== 1962 || skipJunk !== 1975) {
    fail(`YEAR_BUILT list parse: list=${listYear} skipJunk=${skipJunk}`);
    return;
  }
  if (parseYearBuilt("209") !== null || parseYearBuilt("") !== null) {
    fail("YEAR_BUILT junk/empty must be null");
    return;
  }
  if (Number.isFinite(numberCoerce) || numberCoerce === listYear) {
    fail("Number(YEAR_BUILT) must not be the parser (NaN on comma lists)");
    return;
  }
  if (byName.F8.expect.yearBuilt !== 1962) {
    fail("F8 expect is not first YYYY 1962");
    return;
  }
  const f8Last = applyLastWins(byName.F8);
  if (f8Last.yearBuilt === 1962 || f8Last.yearBuilt !== "1962,2011,2023") {
    fail("F8 last-wins must keep the raw list so the parse rule is visible");
    return;
  }
  console.log("PASS YEAR_BUILT first-valid-YYYY (lists; skip 209; Number() is not the parser)");

  if (process.exitCode) return;
  console.log("P-78 merge fixtures selftest PASS");
}

main();
