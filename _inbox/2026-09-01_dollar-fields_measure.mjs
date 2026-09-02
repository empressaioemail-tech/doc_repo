/**
 * READ-ONLY dollar-fields re-verify.
 * Secrets from env. Never print a URL. Writes JSON only.
 *
 *   node _inbox/2026-09-01_dollar-fields_measure.mjs prod
 *   node _inbox/2026-09-01_dollar-fields_measure.mjs factory
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("P:/tmp/hauska-factory-parcel-fill/src/jobs/parcel-record-fill.mjs");
const { Client } = require("pg");

const HERE = dirname(fileURLToPath(import.meta.url));
const FIPS = ["48021", "48055", "48209", "48309", "48453", "48491"];
const DOLLAR_RAILS = [
  "marketValue",
  "landValue",
  "improvementValue",
  "assessedValue",
  "livingAreaSqft",
  "legalDescription",
  "exemptionCodes",
  "yearBuilt",
];

function writeJson(name, obj) {
  writeFileSync(join(HERE, name), JSON.stringify(obj, null, 2) + "\n", "utf8");
}

async function connect(url, timeoutMs, app) {
  if (!url) throw new Error("URL_REQUIRED");
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: true },
    statement_timeout: timeoutMs,
  });
  await client.connect();
  await client.query("SET default_transaction_read_only = on");
  await client.query(`SET statement_timeout = ${timeoutMs}`);
  await client.query(`SET application_name = '${app}'`);
  return client;
}

async function q(client, sql, params = []) {
  const started = Date.now();
  const { rows } = await client.query(sql, params);
  return { ms: Date.now() - started, rows };
}

async function prod() {
  const client = await connect(
    process.env.PRODUCTION_NEONDB_URL,
    180000,
    "dollar-fields-prod",
  );
  const ident = await q(
    client,
    "SELECT current_database() AS db, now() AS ts, current_setting('transaction_read_only') AS ro",
  );
  const latestCad = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (county_fips, prop_id)
              county_fips, prop_id,
              market_value, land_value, improvement_value, assessed_value,
              living_area_sqft, year_built, legal_description, exemption_codes
         FROM cad_property
        WHERE county_fips = ANY($1::text[])
        ORDER BY county_fips, prop_id, tax_year DESC
     )
     SELECT l.county_fips,
            count(*)::bigint AS cad_latest,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL)::bigint AS cad_latest_in_landing,
            count(*) FILTER (WHERE l.market_value IS NOT NULL)::bigint AS mkt_nn,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL AND l.market_value IS NOT NULL)::bigint AS mkt_nn_landing,
            count(*) FILTER (WHERE l.land_value IS NOT NULL)::bigint AS land_nn,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL AND l.land_value IS NOT NULL)::bigint AS land_nn_landing,
            count(*) FILTER (WHERE l.improvement_value IS NOT NULL)::bigint AS imp_nn,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL AND l.improvement_value IS NOT NULL)::bigint AS imp_nn_landing,
            count(*) FILTER (WHERE l.improvement_value = 0)::bigint AS imp_zero,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL AND l.improvement_value = 0)::bigint AS imp_zero_landing,
            count(*) FILTER (WHERE l.assessed_value IS NOT NULL)::bigint AS ass_nn,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL AND l.assessed_value IS NOT NULL)::bigint AS ass_nn_landing,
            count(*) FILTER (WHERE l.living_area_sqft > 0)::bigint AS living_gt0,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL AND l.living_area_sqft > 0)::bigint AS living_gt0_landing,
            count(*) FILTER (WHERE l.year_built IS NOT NULL AND l.year_built > 0)::bigint AS year_pos,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL AND l.year_built IS NOT NULL AND l.year_built > 0)::bigint AS year_pos_landing,
            count(*) FILTER (WHERE nullif(btrim(l.legal_description), '') IS NOT NULL)::bigint AS legal_nn,
            count(*) FILTER (WHERE j.prop_id IS NOT NULL AND nullif(btrim(l.legal_description), '') IS NOT NULL)::bigint AS legal_nn_landing
       FROM latest l
       LEFT JOIN landing_parcel_jurisdiction j
         ON j.county_fips = l.county_fips AND j.prop_id = l.prop_id
      GROUP BY 1
      ORDER BY 1`,
    [FIPS],
  );
  const bake = await q(
    client,
    `SELECT substring(place_key from 6 for 5) AS fips,
            count(*)::bigint AS n_bake,
            count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'marketValue'->>'v') IS NOT NULL)::bigint AS n_mkt_key,
            count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'landValue'->>'v') IS NOT NULL)::bigint AS n_land_key,
            count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'improvementValue'->>'v') IS NOT NULL)::bigint AS n_imp_key,
            count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'assessedValue'->>'v') IS NOT NULL)::bigint AS n_ass_key,
            count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'livingAreaSqft'->>'v') IS NOT NULL)::bigint AS n_living_key,
            count(*) FILTER (WHERE (payload_json->'baseFacts'->'yearBuilt'->>'v') IS NOT NULL)::bigint AS n_year_key,
            count(*) FILTER (WHERE payload_json->'baseFacts'->'legalDescription'->>'v' IS NOT NULL)::bigint AS n_legal_key,
            count(*) FILTER (
              WHERE payload_json->'baseFacts'->'cadRoll'->>'source' = 'cad_property'
                 OR payload_json->'baseFacts'->'cadRoll'->'marketValue'->>'source' = 'cad_property'
            )::bigint AS n_src_cad_property
       FROM place_layer_snapshots
      WHERE adapter_key = 'node-facets:tier1'
        AND place_key LIKE 'node:%'
        AND substring(place_key from 6 for 5) = ANY($1::text[])
      GROUP BY 1
      ORDER BY 1`,
    [FIPS],
  );
  const gold = await q(
    client,
    `SELECT place_key,
            payload_json->'baseFacts'->'cadRoll' AS cad_roll,
            payload_json->'baseFacts'->'yearBuilt' AS year_built,
            payload_json->'baseFacts'->'legalDescription' AS legal,
            payload_json->'baseFacts'->'structuralFact' AS structural_fact,
            snapshot_at
       FROM place_layer_snapshots
      WHERE adapter_key = 'node-facets:tier1'
        AND place_key = 'node:48021:34137'`,
  );
  const haysGold = await q(
    client,
    `SELECT place_key,
            payload_json->'baseFacts'->'cadRoll' AS cad_roll,
            payload_json->'baseFacts'->'yearBuilt' AS year_built,
            payload_json->'baseFacts'->'structuralFact' AS structural_fact,
            snapshot_at
       FROM place_layer_snapshots
      WHERE adapter_key = 'node-facets:tier1'
        AND place_key = 'node:48209:135570'`,
  );
  await client.end();
  const out = {
    kind: "dollar-fields-prod",
    measuredAt: ident.rows[0].ts,
    current_database: ident.rows[0].db,
    read_only: ident.rows[0].ro,
    countingRule: {
      cad: "DISTINCT ON (county_fips, prop_id) ORDER BY tax_year DESC. Landing intersect is exact prop_id on landing_parcel_jurisdiction.",
      bake: "place_layer_snapshots adapter node-facets:tier1, place_key node:{fips}:{prop_id}. Key present = jsonb v is not null.",
    },
    latestCadMs: latestCad.ms,
    latestCad: latestCad.rows,
    bakeMs: bake.ms,
    bake: bake.rows,
    gold48021_34137: gold.rows[0] ?? null,
    gold48209_135570: haysGold.rows[0] ?? null,
  };
  writeJson("2026-09-01_dollar-fields_prod.json", out);
  console.log(JSON.stringify({ wrote: "2026-09-01_dollar-fields_prod.json", db: ident.rows[0].db, ts: ident.rows[0].ts, bakeRows: bake.rows.length, cadRows: latestCad.rows.length }));
}

async function factory() {
  const client = await connect(
    process.env.FACTORY_DATABASE_URL,
    180000,
    "dollar-fields-factory",
  );
  const ident = await q(
    client,
    "SELECT current_database() AS db, now() AS ts, current_setting('transaction_read_only') AS ro",
  );
  const cells = await q(
    client,
    `SELECT r.county_fips,
            c.rail_key,
            c.cell_state->>'kind' AS kind,
            count(*)::bigint AS n
       FROM parcel_record r
       JOIN parcel_record_cell c ON c.place_key = r.place_key
      WHERE r.county_fips = ANY($1::text[])
        AND c.rail_key = ANY($2::text[])
      GROUP BY 1, 2, 3
      ORDER BY 1, 2, 3`,
    [FIPS, DOLLAR_RAILS],
  );
  await client.end();
  const out = {
    kind: "dollar-fields-factory",
    measuredAt: ident.rows[0].ts,
    current_database: ident.rows[0].db,
    read_only: ident.rows[0].ro,
    countingRule:
      "parcel_record JOIN parcel_record_cell on place_key. kind = cell_state->>'kind'. Landing-matched rows are the program denominator; leftovers stay in COUNT(*).",
    cellsMs: cells.ms,
    cells: cells.rows,
  };
  writeJson("2026-09-01_dollar-fields_factory.json", out);
  console.log(JSON.stringify({ wrote: "2026-09-01_dollar-fields_factory.json", db: ident.rows[0].db, ts: ident.rows[0].ts, cellRows: cells.rows.length }));
}

const cmd = process.argv[2];
if (cmd === "prod") await prod();
else if (cmd === "factory") await factory();
else {
  console.error("usage: prod | factory");
  process.exit(2);
}
