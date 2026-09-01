#!/usr/bin/env node
/**
 * P-78 leftover dest-identity: prior KEEP leftover-year n must still hold.
 * Meaning-shaped: expected n from KEEP artifacts vs live COUNT(*) per FIPS.
 * Usage:
 *   node scripts/p78-leftover-dest-identity.mjs --self-test
 *   node scripts/p78-leftover-dest-identity.mjs --keep _inbox/2026-08-25_leftover_dest_identity_keep.json --out path.json
 */

import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const pg = require("P:/legacy-design-tools/lib/cad-ingest/node_modules/pg");

const COUNT_SQL = `
SELECT COUNT(*)::int AS n
FROM cad_property
WHERE county_fips = $1 AND tax_year = $2
`;

function resolveDatabaseUrl() {
  for (const name of ["CORTEX_DATABASE_URL", "DATABASE_URL"]) {
    const v = process.env[name]?.trim();
    if (v) return { url: v, source: name };
  }
  throw new Error("CORTEX_DATABASE_URL or DATABASE_URL required");
}

function selfTest() {
  const fails = [];
  if (!COUNT_SQL.includes("county_fips = $1")) fails.push("sql missing fips bind");
  if (!COUNT_SQL.includes("tax_year = $2")) fails.push("sql missing year bind");
  if (COUNT_SQL.includes("tax_year = 2025") && !COUNT_SQL.includes("$2")) {
    fails.push("hardcoded year without bind");
  }
  const emptyKeep = { leftoverTaxYear: 2025, counties: [] };
  if (emptyKeep.counties.length === 0) {
    // expected refuse path
  } else {
    fails.push("empty-keep fixture should be empty");
  }
  try {
    assertKeepShape({ leftoverTaxYear: 2025, counties: [] });
    fails.push("empty keep should refuse");
  } catch (err) {
    if (!String(err.message).includes("empty keep")) fails.push(String(err.message));
  }
  try {
    assertKeepShape({ leftoverTaxYear: 2025, counties: [{ fips: "48021" }] });
    fails.push("missing expectedN should refuse");
  } catch (err) {
    if (!String(err.message).includes("expectedN")) fails.push(String(err.message));
  }
  if (fails.length) {
    console.error("SELF-TEST FAIL\n" + fails.join("\n"));
    process.exit(1);
  }
  console.log("SELF-TEST PASS");
}

function assertKeepShape(keep) {
  if (!keep || typeof keep !== "object") throw new Error("keep missing");
  if (!Number.isInteger(keep.leftoverTaxYear)) throw new Error("leftoverTaxYear missing");
  if (!Array.isArray(keep.counties) || keep.counties.length === 0) {
    throw new Error("empty keep");
  }
  for (const row of keep.counties) {
    if (!/^\d{5}$/.test(row.fips || "")) throw new Error(`bad fips ${row.fips}`);
    if (!Number.isInteger(row.expectedN)) throw new Error(`expectedN missing for ${row.fips}`);
  }
}

async function main() {
  if (process.argv.includes("--self-test")) {
    selfTest();
    return;
  }
  const keepIdx = process.argv.indexOf("--keep");
  const outIdx = process.argv.indexOf("--out");
  if (keepIdx < 0) {
    console.error("REFUSE --keep required");
    process.exit(1);
  }
  const keep = JSON.parse(readFileSync(process.argv[keepIdx + 1], "utf8"));
  assertKeepShape(keep);
  const { url, source } = resolveDatabaseUrl();
  const pool = new pg.Pool({ connectionString: url });
  const results = [];
  let pass = true;
  try {
    const client = await pool.connect();
    try {
      for (const row of keep.counties) {
        const q = await client.query(COUNT_SQL, [row.fips, keep.leftoverTaxYear]);
        const liveN = q.rows[0].n;
        const ok = liveN === row.expectedN;
        if (!ok) pass = false;
        results.push({
          fips: row.fips,
          name: row.name || null,
          expectedN: row.expectedN,
          liveN,
          ok,
        });
      }
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
  const payload = {
    artifact: "p78-leftover-dest-identity",
    planRow: "P-78",
    measuredAt: new Date().toISOString(),
    leftoverTaxYear: keep.leftoverTaxYear,
    databaseSource: source,
    query: COUNT_SQL.trim(),
    pass,
    results,
  };
  const text = JSON.stringify(payload, null, 2) + "\n";
  if (outIdx >= 0) writeFileSync(process.argv[outIdx + 1], text);
  console.log(text);
  if (!pass) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
