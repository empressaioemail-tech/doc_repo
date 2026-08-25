#!/usr/bin/env node
/**
 * P-78 Caldwell 48055 before/after store measure (read-only).
 * Usage: node scripts/p78-caldwell-48055-measure.mjs --out path.json [--label before|after]
 */

import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const pg = require(
  "P:/legacy-design-tools/lib/cad-ingest/node_modules/pg",
);

const COUNTY = "48055";
const STRATMAP_TAX_YEAR = 2025;

const MEASURE_SQL = `
SELECT
  COUNT(*)::int AS n,
  COUNT(*) FILTER (WHERE year_built IS NOT NULL)::int AS year_built_non_null,
  COUNT(*) FILTER (WHERE land_acres IS NOT NULL)::int AS land_acres_non_null,
  COUNT(*) FILTER (WHERE prop_id IN ('0', '00'))::int AS prop_id_zero_keys
FROM cad_property
WHERE county_fips = $1 AND tax_year = $2
`;

const BY_VINTAGE_SQL = `
SELECT
  LEFT(source_vintage, 40) AS vintage_prefix,
  COUNT(*)::int AS n
FROM cad_property
WHERE county_fips = $1 AND tax_year = $2
GROUP BY 1
ORDER BY n DESC
LIMIT 5
`;

function resolveDatabaseUrl() {
  for (const name of ["CORTEX_DATABASE_URL", "DATABASE_URL"]) {
    const v = process.env[name]?.trim();
    if (v) return { url: v, source: name };
  }
  throw new Error("CORTEX_DATABASE_URL or DATABASE_URL required");
}

async function main() {
  const outIdx = process.argv.indexOf("--out");
  const labelIdx = process.argv.indexOf("--label");
  const outPath = outIdx >= 0 ? process.argv[outIdx + 1] : null;
  const label = labelIdx >= 0 ? process.argv[labelIdx + 1] : "measure";

  const { url, source } = resolveDatabaseUrl();
  const pool = new pg.Pool({ connectionString: url });
  try {
    const client = await pool.connect();
    try {
      const main = await client.query(MEASURE_SQL, [COUNTY, STRATMAP_TAX_YEAR]);
      const byVintage = await client.query(BY_VINTAGE_SQL, [COUNTY, STRATMAP_TAX_YEAR]);
      const payload = {
        artifact: `p78-caldwell-48055-${label}`,
        planRow: "P-78",
        measuredAt: new Date().toISOString(),
        countyFips: COUNTY,
        taxYear: STRATMAP_TAX_YEAR,
        databaseSource: source,
        query: MEASURE_SQL.trim(),
        counts: main.rows[0],
        vintageTop: byVintage.rows,
      };
      const text = JSON.stringify(payload, null, 2) + "\n";
      if (outPath) {
        writeFileSync(outPath, text);
        console.log(`Wrote ${outPath}`);
      } else {
        console.log(text);
      }
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
