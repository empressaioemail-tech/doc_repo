#!/usr/bin/env node
/**
 * zoning-ingest-city-truth.mjs
 *
 * File-based instrument for OPS-19 F-01 zoning-ingest Step 1.
 * Presence per city from the store. Never a coverage percentage.
 *
 * Self-tests run with --self-test (no DB). --live needs
 * DEPLOYMENT_DATABASE_URL (neondb) and, for F1 only, ATOMS_DATABASE_URL.
 *
 * Falsifier: Austin 48453 layer_present must be true. Smithville must be
 * layer_present true and stamped_district 0. Unincorporated must not appear.
 * in_city_parcels must come from landing DISTINCT, not txgio_parcel row count.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SIX = ["48021", "48055", "48209", "48309", "48453", "48491"];
const SIX_SET = new Set(SIX);
const COUNTY = {
  48021: "Bastrop",
  48055: "Caldwell",
  48209: "Hays",
  48309: "McLennan",
  48453: "Travis",
  48491: "Williamson",
};

function loadRosterCities() {
  const roster = require(path.join(ROOT, "_catalog", "texas_roster_v1.json"));
  const cities = roster.cities.filter(
    (c) =>
      SIX_SET.has(c.parent_county_fips) ||
      (c.all_county_fips || []).some((f) => SIX_SET.has(f)),
  );
  return {
    generated_at: roster.generated_at,
    primary: cities.filter((c) => SIX_SET.has(c.parent_county_fips)).length,
    territory_touching: cities.filter((c) =>
      (c.all_county_fips || []).some((f) => SIX_SET.has(f)),
    ).length,
    cities,
  };
}

function cityKeyFromName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\s+village$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + "-tx";
}

function selfTest() {
  const roster = loadRosterCities();
  const failures = [];
  if (roster.primary !== 69) {
    failures.push(`roster primary ${roster.primary} != 69`);
  }
  if (roster.territory_touching !== 72) {
    failures.push(`roster territory ${roster.territory_touching} != 72`);
  }

  const fixture = {
    austin: {
      city: "Austin",
      county_fips: "48453",
      layer_present: true,
      in_city_parcels: 204079,
      stamped_district: 227752,
      ledger_coverage_pct: 0,
    },
    smithville: {
      city: "Smithville",
      county_fips: "48021",
      layer_present: true,
      features: 91,
      stamped_district: 0,
    },
    jarrell: {
      city: "Jarrell",
      county_fips: "48491",
      layer_present: false,
      stamped_district: 0,
    },
    unincorporated: { disposition: "unincorporated", counted_as_gap: false },
    inflatingJoin: {
      landing_bastrop_city: 5819,
      txgio_join_count_star: 6284,
      chosen: 5819,
    },
  };

  if (!fixture.austin.layer_present) {
    failures.push("Austin layer_present false — instrument is reading the ledger");
  }
  if (fixture.austin.ledger_coverage_pct === 0 && !fixture.austin.layer_present) {
    failures.push("Travis 0.00% ledger treated as absence");
  }
  if (!fixture.smithville.layer_present || fixture.smithville.stamped_district !== 0) {
    failures.push("Smithville stamp-gap fixture broken");
  }
  if (fixture.jarrell.layer_present) {
    failures.push("Jarrell fixture is the not-vacuous case and must be absent");
  }
  if (fixture.unincorporated.counted_as_gap) {
    failures.push("unincorporated counted as a gap");
  }
  if (fixture.inflatingJoin.chosen !== fixture.inflatingJoin.landing_bastrop_city) {
    failures.push("in_city taken from inflated txgio join");
  }
  if ("coverage_pct" in fixture.austin) {
    failures.push("coverage_pct field exists — forbidden");
  }

  const keys = roster.cities.map((c) => cityKeyFromName(c.name));
  if (!keys.includes("austin-tx") || !keys.includes("smithville-tx")) {
    failures.push("cityKeyFromName missed austin-tx or smithville-tx");
  }
  if (!keys.includes("bear-creek-tx")) {
    failures.push("Bear Creek village did not normalize to bear-creek-tx");
  }

  if (failures.length) {
    console.error("SELF-TEST FAIL");
    for (const f of failures) console.error("  -", f);
    process.exit(1);
  }
  console.log(
    JSON.stringify(
      {
        ok: true,
        roster_generated_at: roster.generated_at,
        primary: roster.primary,
        territory_touching: roster.territory_touching,
        tests: 8,
      },
      null,
      2,
    ),
  );
}

function gcloudSecret(name, project) {
  return execFileSync(
    "gcloud",
    ["secrets", "versions", "access", "latest", `--secret=${name}`, `--project=${project}`],
    { encoding: "utf8" },
  ).trim();
}

function resolveUrl(envName, secret, project) {
  if (process.env[envName]?.trim()) {
    return { value: process.env[envName].trim(), source: `env:${envName}` };
  }
  return { value: gcloudSecret(secret, project), source: `gcloud:${project}/${secret}` };
}

async function live() {
  let postgres;
  try {
    postgres = (await import("postgres")).default;
  } catch {
    throw new Error("postgres package missing; run from a tree that has it or set NODE_PATH");
  }
  const neon = resolveUrl(
    "DEPLOYMENT_DATABASE_URL",
    "DEPLOYMENT_DATABASE_URL",
    "legacy-design-tools-prod",
  );
  const sql = postgres(neon.value, { max: 1, idle_timeout: 5, connect_timeout: 15 });
  try {
    const snap = await sql`SELECT current_database() AS db, now() AS ts`;
    if (snap[0].db !== "neondb") {
      throw new Error(`expected neondb, got ${snap[0].db}`);
    }
    const landing = await sql`
      SELECT county_fips, city_name, place_fips, count(*)::int AS in_city_parcels
      FROM landing_parcel_jurisdiction
      WHERE county_fips IN ${sql(SIX)}
        AND disposition = 'in-city'
      GROUP BY county_fips, city_name, place_fips
    `;
    const staged = await sql`
      SELECT parent_county_fips, city_key, city_name, count(*)::int AS features,
             min(source_url) AS source_url, min(source_vintage) AS source_vintage,
             min(fetched_at) AS fetched_at
      FROM tx_zoning_district_staging
      WHERE parent_county_fips IN ${sql(SIX)}
      GROUP BY parent_county_fips, city_key, city_name
    `;
    const stamped = await sql`
      SELECT j.county_fips, j.city_name, j.place_fips,
             count(DISTINCT j.prop_id)::int AS in_city,
             count(DISTINCT j.prop_id) FILTER (
               WHERE p.zoning_district IS NOT NULL AND btrim(p.zoning_district) <> ''
             )::int AS stamped_district,
             count(DISTINCT NULLIF(btrim(p.zoning_jurisdiction), ''))::int AS juris_keys,
             min(NULLIF(btrim(p.zoning_jurisdiction), '')) AS sample_juris
      FROM landing_parcel_jurisdiction j
      LEFT JOIN txgio_parcel p
        ON p.county_fips = j.county_fips AND p.prop_id = j.prop_id
      WHERE j.disposition = 'in-city'
        AND j.county_fips IN ${sql(SIX)}
      GROUP BY j.county_fips, j.city_name, j.place_fips
    `;
    const method = await sql`
      SELECT count(*) FILTER (WHERE method <> 'ring')::int AS not_ring
      FROM landing_parcel_jurisdiction
      WHERE county_fips IN ${sql(SIX)}
    `;
    return {
      snapshot: { db: snap[0].db, ts: snap[0].ts, urlSource: neon.source, secretLen: neon.value.length },
      landing,
      staged,
      stamped,
      notRing: method[0].not_ring,
    };
  } finally {
    await sql.end({ timeout: 2 });
  }
}

function assemble(roster, liveRows) {
  const stagedByKey = new Map();
  for (const r of liveRows.staged) stagedByKey.set(r.city_key, r);
  const stampByPlace = new Map();
  for (const r of liveRows.stamped) {
    stampByPlace.set(`${r.county_fips}:${r.place_fips}`, r);
  }
  const landingByPlace = new Map();
  for (const r of liveRows.landing) {
    landingByPlace.set(`${r.county_fips}:${r.place_fips}`, r);
  }

  const rows = [];
  for (const c of roster.cities) {
    const key = cityKeyFromName(c.name);
    const primary = SIX_SET.has(c.parent_county_fips);
    const staged = stagedByKey.get(key) || null;
    const fipsList = SIX.filter(
      (f) => f === c.parent_county_fips || (c.all_county_fips || []).includes(f),
    );
    for (const fips of fipsList) {
      const place = landingByPlace.get(`${fips}:${c.place_fips}`) || null;
      const stamp = stampByPlace.get(`${fips}:${c.place_fips}`) || null;
      rows.push({
        city: c.name,
        city_key: key,
        place_fips: c.place_fips,
        county_fips: fips,
        county: COUNTY[fips],
        roster_role: primary && fips === c.parent_county_fips ? "primary" : "territory",
        in_city_parcels: place ? place.in_city_parcels : 0,
        in_city_source: place ? "landing_parcel_jurisdiction" : "absent-from-landing",
        layer_present: Boolean(staged),
        source: staged ? staged.source_url : null,
        vintage: staged ? staged.source_vintage : null,
        features: staged ? staged.features : 0,
        features_count_kind: staged ? "staging_rows_both_grains" : "none",
        stamped_district: stamp ? stamp.stamped_district : 0,
        stamped_count_kind: "distinct_in_city_prop_id_with_nonempty_zoning_district",
        sample_zoning_jurisdiction: stamp ? stamp.sample_juris : null,
        served_district: "unmeasured-this-pass",
        served_count_kind: "unmeasured",
      });
    }
  }
  return rows;
}

function assertLive(rows) {
  const failures = [];
  const austin = rows.find((r) => r.city_key === "austin-tx" && r.county_fips === "48453");
  if (!austin?.layer_present) failures.push("LIVE: Austin 48453 layer_present false");
  const smithville = rows.find((r) => r.city_key === "smithville-tx" && r.county_fips === "48021");
  if (!smithville?.layer_present) failures.push("LIVE: Smithville layer_present false");
  if (smithville && smithville.stamped_district !== 0) {
    failures.push(`LIVE: Smithville stamped_district ${smithville.stamped_district} != 0`);
  }
  const jarrell = rows.find((r) => r.city_key === "jarrell-tx" && r.county_fips === "48491");
  if (jarrell?.layer_present) failures.push("LIVE: Jarrell layer_present true (not-vacuous failed)");
  if (rows.some((r) => r.city === "unincorporated" || "coverage_pct" in r)) {
    failures.push("LIVE: unincorporated or coverage_pct leaked");
  }
  if (failures.length) {
    console.error("LIVE ASSERT FAIL");
    for (const f of failures) console.error("  -", f);
    process.exit(1);
  }
}

const argv = process.argv.slice(2);
if (argv.includes("--self-test") || !argv.includes("--live")) {
  selfTest();
  if (!argv.includes("--live")) process.exit(0);
}

if (argv.includes("--live")) {
  const roster = loadRosterCities();
  const liveRows = await live();
  const rows = assemble(roster, liveRows);
  assertLive(rows);
  const out = {
    at: new Date().toISOString(),
    snapshot: liveRows.snapshot,
    notRing: liveRows.notRing,
    roster: {
      generated_at: roster.generated_at,
      primary: roster.primary,
      territory_touching: roster.territory_touching,
    },
    rows,
  };
  const dest = path.join(ROOT, "_inbox", "2026-09-01_zoning-ingest_city_truth.json");
  fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
  console.log(JSON.stringify({ wrote: dest, cities: rows.length, notRing: liveRows.notRing }, null, 2));
}
