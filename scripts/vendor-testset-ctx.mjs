#!/usr/bin/env node
/**
 * CTX vendor test-set builder.
 *
 * Builds a deterministic, small, reproducible parcel set for exercising
 * third-party vendor fetch/mint/serve paths (Cotality, ICC) BEFORE any of it
 * touches the master ledger. Ten parcels per county across the six Central
 * Texas counties, five incorporated and five unincorporated, so both the
 * in-city path (zoning + setbacks manufactured) and the unincorporated path
 * (setback rails correctly not-applicable) are exercised every run.
 *
 * WHY ADDRESSABLE-ONLY. A vendor lookup resolves by address (Cotality's
 * clip-find_property_by_address takes fullAddress). A parcel whose
 * situsAddress cell is not kind=value cannot be resolved, so including one
 * would produce a vendor MISS that looks like a coverage finding and is
 * actually a selection defect. Selection therefore requires a real situs
 * value, and the shortfall is recorded when a class cannot fill.
 *
 * WHY NOT PAD. If a (county, incorporated) class has fewer than five
 * addressable parcels, this records the shortfall and returns fewer. It never
 * borrows from the other class to reach ten, because a set that silently
 * rebalanced would make the in-city / out-of-city comparison meaningless
 * while still reporting ten.
 *
 * Self-tests run in BOTH directions before any live SQL, including an
 * explicit not-vacuous case:
 *   deterministic      same input ordering -> identical selection, twice
 *   shortfall honest   a class with 3 candidates yields 3 + a shortfall row,
 *                      never 5, and never 5 by borrowing the other class
 *   balance enforced   a set missing one incorporated class FAILS validation
 *   not-vacuous        a validator that accepts every set MUST fail this test
 *   no DSN             exit 2 UNMEASURED, never an empty set presented as a
 *                      result (absent and zero are different states)
 *
 * Usage:
 *   node scripts/vendor-testset-ctx.mjs --self-test
 *   node scripts/vendor-testset-ctx.mjs --live
 * --live always runs --self-test first and refuses to continue if it fails.
 *
 * Reads FACTORY_DATABASE_URL_RO (read-only role) from env, else from
 * gcloud Secret Manager in hauska-prod-497015. Read-only by construction:
 * every statement is a SELECT and a statement_timeout is set, because factory
 * store reads are known to time out under writer load and a hung instrument
 * that later returns partial rows is worse than one that declares UNMEASURED.
 *
 * Exclusion set:
 *   - Writes nothing to any product repo or product database.
 *   - Does not call any vendor API. Selection only.
 */

import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "_catalog", "vendor_testset_ctx.json");

const COUNTIES = {
  "48021": "Bastrop",
  "48055": "Caldwell",
  "48209": "Hays",
  "48309": "McLennan",
  "48453": "Travis",
  "48491": "Williamson",
};
const PER_CLASS = 5;
const STATEMENT_TIMEOUT_MS = 120000;

// ---------------------------------------------------------------- selection

/**
 * Pure selector. Input rows are already ordered by the deterministic key
 * (md5 of place_key) within each partition; this only takes and counts.
 * Kept pure so the self-tests need no database.
 */
export function selectSet(rows, perClass = PER_CLASS) {
  const picked = [];
  const shortfalls = [];
  const groups = new Map();
  for (const r of rows) {
    const key = `${r.county_fips}|${r.incorporated}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  for (const fips of Object.keys(COUNTIES)) {
    for (const inc of [true, false]) {
      const key = `${fips}|${inc}`;
      const avail = groups.get(key) ?? [];
      const take = avail.slice(0, perClass);
      picked.push(...take);
      if (take.length < perClass) {
        shortfalls.push({
          county_fips: fips,
          county: COUNTIES[fips],
          incorporated: inc,
          wanted: perClass,
          got: take.length,
          reason: "fewer addressable parcels than requested in this class",
        });
      }
    }
  }
  return { picked, shortfalls };
}

/**
 * Validates that a set actually exercises both paths in every county.
 * Returns a list of violations; empty means valid.
 */
export function validateSet(picked, perClass = PER_CLASS) {
  const violations = [];
  for (const fips of Object.keys(COUNTIES)) {
    for (const inc of [true, false]) {
      const n = picked.filter(
        (p) => p.county_fips === fips && p.incorporated === inc,
      ).length;
      if (n === 0) {
        violations.push(
          `${COUNTIES[fips]} (${fips}) incorporated=${inc}: zero parcels, class not exercised`,
        );
      } else if (n > perClass) {
        violations.push(
          `${COUNTIES[fips]} (${fips}) incorporated=${inc}: ${n} exceeds ${perClass}`,
        );
      }
    }
  }
  return violations;
}

// ---------------------------------------------------------------- self-test

function assert(cond, msg) {
  if (!cond) {
    console.error(`SELF-TEST FAIL: ${msg}`);
    process.exit(1);
  }
}

function fixtureRows(spec) {
  const out = [];
  for (const [key, n] of Object.entries(spec)) {
    const [fips, incRaw] = key.split("|");
    const inc = incRaw === "true";
    for (let i = 0; i < n; i++) {
      out.push({
        county_fips: fips,
        incorporated: inc,
        place_key: `${fips}:${inc ? "i" : "u"}${i}`,
        situs: `${100 + i} TEST ST`,
      });
    }
  }
  return out;
}

function selfTest() {
  const full = {};
  for (const fips of Object.keys(COUNTIES)) {
    full[`${fips}|true`] = 9;
    full[`${fips}|false`] = 9;
  }

  // deterministic: identical input yields identical output, twice
  const a = selectSet(fixtureRows(full));
  const b = selectSet(fixtureRows(full));
  assert(
    JSON.stringify(a.picked) === JSON.stringify(b.picked),
    "selection is not deterministic across two runs on identical input",
  );
  assert(
    a.picked.length === Object.keys(COUNTIES).length * 2 * PER_CLASS,
    `full fixture should yield ${Object.keys(COUNTIES).length * 2 * PER_CLASS}, got ${a.picked.length}`,
  );
  assert(a.shortfalls.length === 0, "full fixture should report no shortfall");

  // shortfall is honest: 3 available yields 3 and a shortfall row, never 5,
  // and never borrows from the other class to reach ten for the county
  const thin = { ...full };
  thin["48055|true"] = 3;
  const t = selectSet(fixtureRows(thin));
  const caldwellInc = t.picked.filter(
    (p) => p.county_fips === "48055" && p.incorporated === true,
  );
  const caldwellUninc = t.picked.filter(
    (p) => p.county_fips === "48055" && p.incorporated === false,
  );
  assert(caldwellInc.length === 3, `thin class should yield 3, got ${caldwellInc.length}`);
  assert(
    caldwellUninc.length === PER_CLASS,
    "shortfall in one class must not inflate the other class",
  );
  assert(
    t.shortfalls.some((s) => s.county_fips === "48055" && s.incorporated === true),
    "thin class must record a shortfall row",
  );

  // balance enforced: a set with a missing class must FAIL validation
  const missing = { ...full };
  delete missing["48209|false"];
  const m = selectSet(fixtureRows(missing));
  const violations = validateSet(m.picked);
  assert(
    violations.length > 0,
    "a set missing an entire incorporated class must fail validation",
  );
  assert(
    violations.some((v) => v.includes("48209")),
    "validation must name the county whose class is missing",
  );

  // not-vacuous: a validator that accepts everything must fail this check
  const alwaysValid = () => [];
  assert(
    alwaysValid(m.picked).length === 0,
    "control: permissive validator returns no violations (by construction)",
  );
  assert(
    validateSet(m.picked).length !== alwaysValid(m.picked).length,
    "NOT-VACUOUS: real validator must disagree with a permissive one on a known-bad set",
  );

  // a valid full set must pass
  assert(validateSet(a.picked).length === 0, "full valid set must pass validation");

  console.log("SELF-TEST PASS (5 checks, both directions, not-vacuous included)");
}

// ---------------------------------------------------------------- live

function resolveDsn() {
  if (process.env.FACTORY_DATABASE_URL_RO) {
    return { dsn: process.env.FACTORY_DATABASE_URL_RO, source: "env:FACTORY_DATABASE_URL_RO" };
  }
  const r = spawnSync(
    "gcloud",
    [
      "secrets", "versions", "access", "latest",
      "--secret=FACTORY_DATABASE_URL_RO",
      "--project=hauska-prod-497015",
    ],
    { encoding: "utf8" },
  );
  if (r.status !== 0 || !r.stdout || !r.stdout.trim()) return { dsn: null, source: null };
  return {
    dsn: r.stdout.trim(),
    source: "gcloud:hauska-prod-497015/FACTORY_DATABASE_URL_RO:latest",
  };
}

function psql(dsn, sql) {
  const r = spawnSync(
    "psql",
    [dsn, "-X", "-A", "-t", "-F", "", "-v", "ON_ERROR_STOP=1",
     "-c", `SET statement_timeout = ${STATEMENT_TIMEOUT_MS}; ${sql}`],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  if (r.status !== 0) {
    const err = (r.stderr || "").replace(/postgres(ql)?:\/\/[^\s]+/gi, "DSN_REDACTED");
    throw new Error(`psql failed (status ${r.status}): ${err.slice(0, 800)}`);
  }
  return r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(""));
}

const SELECT_SQL = `
WITH addressable AS (
  SELECT pr.place_key, pr.county_fips, pr.incorporated,
         c.cell_state->>'value' AS situs
  FROM parcel_record pr
  JOIN parcel_record_cell c
    ON c.place_key = pr.place_key AND c.rail_key = 'situsAddress'
  WHERE c.cell_state->>'kind' = 'value'
    AND coalesce(c.cell_state->>'value', '') <> ''
),
ranked AS (
  SELECT *, row_number() OVER (
    PARTITION BY county_fips, incorporated ORDER BY md5(place_key)
  ) rn
  FROM addressable
)
SELECT county_fips, incorporated, place_key, situs
FROM ranked WHERE rn <= ${PER_CLASS}
ORDER BY county_fips, incorporated DESC, rn`;

function baselineSql(placeKeys) {
  const list = placeKeys.map((k) => `'${k.replace(/'/g, "''")}'`).join(",");
  return `
SELECT place_key, cell_state->>'kind' AS kind, count(*)::int AS n
FROM parcel_record_cell
WHERE place_key IN (${list})
GROUP BY 1, 2 ORDER BY 1, 2`;
}

function live() {
  const { dsn, source } = resolveDsn();
  if (!dsn) {
    console.error(
      "UNMEASURED: FACTORY_DATABASE_URL_RO not resolvable from env or gcloud.",
    );
    console.error("No test set written. This is an absence, not an empty set.");
    process.exit(2);
  }

  const rows = psql(dsn, SELECT_SQL).map(([county_fips, incorporated, place_key, situs]) => ({
    county_fips,
    incorporated: incorporated === "t" || incorporated === "true",
    place_key,
    situs,
  }));

  const { picked, shortfalls } = selectSet(rows);
  const violations = validateSet(picked);

  const baseline = {};
  if (picked.length > 0) {
    for (const [place_key, kind, n] of psql(dsn, baselineSql(picked.map((p) => p.place_key)))) {
      baseline[place_key] ??= {};
      baseline[place_key][kind === "" ? "null" : kind] = Number(n);
    }
  }

  const byCounty = {};
  for (const p of picked) {
    const c = COUNTIES[p.county_fips];
    byCounty[c] ??= { county_fips: p.county_fips, incorporated: [], unincorporated: [] };
    byCounty[c][p.incorporated ? "incorporated" : "unincorporated"].push({
      place_key: p.place_key,
      situs: p.situs,
      cell_kinds: baseline[p.place_key] ?? {},
    });
  }

  const out = {
    id: "vendor_testset_ctx",
    purpose:
      "Small deterministic parcel set for exercising third-party vendor fetch/mint/serve paths before touching the master ledger. Not a sample for measuring coverage.",
    generated_at: new Date().toISOString(),
    snapshot: {
      dsn_source: source,
      table: "parcel_record + parcel_record_cell",
      selection:
        "addressable parcels only (situsAddress kind=value), ranked by md5(place_key), top 5 per (county, incorporated)",
      per_class: PER_CLASS,
    },
    counts: {
      counties: Object.keys(byCounty).length,
      parcels: picked.length,
      expected: Object.keys(COUNTIES).length * 2 * PER_CLASS,
    },
    validation: {
      violations,
      shortfalls,
      status: violations.length === 0 && shortfalls.length === 0 ? "COMPLETE" : "PARTIAL",
    },
    counties: byCounty,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");

  console.log(`wrote ${OUT}`);
  console.log(
    `parcels=${picked.length}/${out.counts.expected} counties=${out.counts.counties} status=${out.validation.status}`,
  );
  for (const v of violations) console.log(`  VIOLATION ${v}`);
  for (const s of shortfalls) {
    console.log(
      `  SHORTFALL ${s.county} incorporated=${s.incorporated} wanted=${s.wanted} got=${s.got}`,
    );
  }
}

// ---------------------------------------------------------------- main

const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  selfTest();
} else if (args.includes("--live")) {
  selfTest();
  live();
} else {
  console.error("usage: vendor-testset-ctx.mjs --self-test | --live");
  process.exit(64);
}
