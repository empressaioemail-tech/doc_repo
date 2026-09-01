#!/usr/bin/env node
// CAD-SERVE-RECONCILE instrument. READ ONLY. Never writes the store.
// Usage:
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs discover
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs source-cols
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs atom-keys
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs serve-keys
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs source-counts
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs atom-counts
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs serve-counts
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs leaks
//   node _inbox/2026-09-01_cad-serve-reconcile_instrument.mjs gold-match
// Credential from PRODUCTION_NEONDB_URL. Never printed.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
// pg is not a doc_repo dependency. Borrow the factory worktree copy; do not install.
const require = createRequire(
  "P:/seat-worktrees/property/hauska-factory/package.json"
);
const pg = require("pg");

const CONN = process.env.PRODUCTION_NEONDB_URL;
if (!CONN) {
  console.error("NO PRODUCTION_NEONDB_URL");
  process.exit(1);
}

const OUT_DIR = path.resolve("P:/doc_repo/_inbox");
const FIPS = ["48021", "48055", "48209", "48309", "48453", "48491"];
const FIPS_CASE = `
  CASE
    WHEN $RANGE THEN $FIPS
    ELSE 'other'
  END`.trim();

function rangeSql(alias, col) {
  const a = alias ? `${alias}.` : "";
  const c = `${a}${col}`;
  return FIPS.map(
    (f) => `(${c} >= '${f}:' AND ${c} < '${String(Number(f) + 1)}:')`
  ).join(" OR ");
}

function fipsExpr(col) {
  return `CASE ${FIPS.map(
    (f) =>
      `WHEN ${col} >= '${f}:' AND ${col} < '${String(Number(f) + 1)}:' THEN '${f}'`
  ).join(" ")} ELSE 'other' END`;
}

function mkUrl(db) {
  const u = new URL(CONN);
  u.pathname = `/${db}`;
  return u.toString();
}

async function connect(db) {
  const c = new pg.Client({
    connectionString: mkUrl(db),
    ssl: { rejectUnauthorized: false },
    statement_timeout: 30 * 60 * 1000,
  });
  await c.connect();
  return c;
}

function writeJson(name, obj) {
  const p = path.join(OUT_DIR, name);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log("WROTE " + p);
  return p;
}

async function discover() {
  const out = { at: new Date().toISOString(), host: new URL(CONN).hostname, dbs: {} };
  for (const db of ["neondb", "hauska_mcp"]) {
    const c = await connect(db);
    const cur = await c.query(
      "SELECT current_database() AS db, now() AS ts"
    );
    const tables = await c.query(`
      SELECT n.nspname AS schema, c.relname AS table, c.relkind,
             c.reltuples::bigint AS reltuples
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname NOT IN ('pg_catalog','information_schema')
        AND c.relkind IN ('r','p','m','v')
      ORDER BY n.nspname, c.relname
    `);
    const cols = await c.query(`
      SELECT table_schema, table_name, column_name, data_type, udt_name, is_nullable
      FROM information_schema.columns
      WHERE table_schema NOT IN ('pg_catalog','information_schema')
        AND (
          table_name ILIKE '%cad%'
          OR table_name ILIKE '%property%'
          OR table_name ILIKE '%parcel%'
          OR table_name IN ('place_layer_snapshots','atoms')
        )
      ORDER BY table_schema, table_name, ordinal_position
    `);
    await c.end();
    out.dbs[db] = {
      current: cur.rows[0],
      tableCount: tables.rows.length,
      tables: tables.rows,
      cadishColumns: cols.rows,
    };
  }
  writeJson("2026-09-01_cad-serve-reconcile_discover.json", out);
}

async function sourceCols() {
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db");
  const tables = await c.query(`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema NOT IN ('pg_catalog','information_schema')
      AND table_type IN ('BASE TABLE','VIEW','FOREIGN TABLE')
      AND (table_name ILIKE '%cad%' OR table_name ILIKE '%property%')
    ORDER BY 1, 2
  `);
  const cols = await c.query(`
    SELECT table_schema, table_name, column_name, data_type, udt_name, is_nullable,
           numeric_precision, numeric_scale
    FROM information_schema.columns
    WHERE table_schema NOT IN ('pg_catalog','information_schema')
      AND (table_name ILIKE '%cad%' OR table_name ILIKE '%property%')
    ORDER BY table_schema, table_name, ordinal_position
  `);
  await c.end();
  writeJson("2026-09-01_cad-serve-reconcile_source_cols.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    tables: tables.rows,
    columns: cols.rows,
  });
}

async function atomKeys() {
  console.error("HEAVY SCAN START atom-keys hauska_mcp atoms cad-parcel-roll six FIPS ranges");
  const c = await connect("hauska_mcp");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const sql = `
    SELECT ${fipsExpr("entity_id")} AS fips, key, count(*)::bigint AS n_rows
    FROM atoms,
    LATERAL jsonb_object_keys(body) AS key
    WHERE entity_type = 'cad-parcel-roll'
      AND (${rangeSql("", "entity_id")})
    GROUP BY 1, 2
    ORDER BY 1, 2
  `;
  const r = await c.query(sql);
  await c.end();
  console.error("HEAVY SCAN END atom-keys rows=" + r.rows.length);
  writeJson("2026-09-01_cad-serve-reconcile_atom_keys.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    entity_type: "cad-parcel-roll",
    scope: "half-open entity_id FIPS ranges",
    keys: r.rows,
  });
}

function flattenPathsSql(jsonCol) {
  // Recursive leaf paths of a jsonb object. Arrays are treated as a leaf.
  return `
    WITH RECURSIVE t AS (
      SELECT ARRAY[k]::text[] AS path, v, jsonb_typeof(v) AS typ
      FROM jsonb_each(${jsonCol}) AS e(k, v)
      UNION ALL
      SELECT t.path || e.k, e.v, jsonb_typeof(e.v)
      FROM t
      JOIN LATERAL jsonb_each(t.v) AS e(k, v) ON t.typ = 'object'
    )
    SELECT array_to_string(path, '.') AS path
    FROM t
    WHERE typ <> 'object'
  `;
}

async function serveKeys() {
  console.error("HEAVY SCAN START serve-keys neondb place_layer_snapshots node-facets:tier1");
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const sql = `
    SELECT ${fipsExpr("substring(place_key from 6)")} AS fips, p.path, count(*)::bigint AS n_rows
    FROM place_layer_snapshots s,
    LATERAL (${flattenPathsSql("s.payload_json")}) AS p
    WHERE s.adapter_key = 'node-facets:tier1'
      AND s.place_key LIKE 'node:%'
      AND (${rangeSql("", "substring(place_key from 6)")})
    GROUP BY 1, 2
    ORDER BY 1, 2
  `;
  const r = await c.query(sql);
  await c.end();
  console.error("HEAVY SCAN END serve-keys rows=" + r.rows.length);
  writeJson("2026-09-01_cad-serve-reconcile_serve_keys.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    table: "place_layer_snapshots",
    adapter_key: "node-facets:tier1",
    place_key: "node:{fips}:{prop_id}",
    keys: r.rows,
  });
}

function isNumericType(dt, udt) {
  const n = new Set([
    "integer",
    "bigint",
    "smallint",
    "numeric",
    "real",
    "double precision",
    "decimal",
  ]);
  return n.has(dt) || n.has(udt);
}

async function sourceCounts() {
  const colsPath = path.join(OUT_DIR, "2026-09-01_cad-serve-reconcile_source_cols.json");
  const colsDoc = JSON.parse(fs.readFileSync(colsPath, "utf8"));
  const skip = new Set([
    "public.cotality_property_attr_cache",
    "public.pe_property_unlocks",
    "public.cad_property_vintage_crosswalk",
    "public.cad_property_vintage_fallback",
    "public.landing_cad_txgio_alias",
  ]);
  const byTable = new Map();
  for (const col of colsDoc.columns) {
    const k = `${col.table_schema}.${col.table_name}`;
    if (skip.has(k)) continue;
    if (!byTable.has(k)) byTable.set(k, []);
    byTable.get(k).push(col);
  }

  console.error("HEAVY SCAN START source-counts neondb CAD tables");
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const results = [];

  for (const [qual, cols] of byTable) {
    const [schema, table] = qual.split(".");
    const fipsColGuess = cols.find((x) =>
      ["county_fips", "fips", "county"].includes(x.column_name)
    );
    const propColGuess = cols.find((x) =>
      ["prop_id", "propid", "property_id"].includes(x.column_name)
    );
    if (!fipsColGuess) {
      results.push({ table: qual, skipped: "no county_fips-like column" });
      continue;
    }
    const fipsCol = fipsColGuess.column_name;
    const propCol = propColGuess?.column_name || null;
    const parts = [
      `${fipsCol} AS fips`,
      "count(*)::bigint AS n_rows",
      propCol
        ? `count(DISTINCT ${propCol})::bigint AS n_parcels`
        : "NULL::bigint AS n_parcels",
    ];
    for (const col of cols) {
      const q = `"${col.column_name}"`;
      const nonempty =
        col.data_type === "text" || col.udt_name === "text" || col.data_type === "character varying"
          ? `count(*) FILTER (WHERE nullif(btrim(${q}::text), '') IS NOT NULL)::bigint`
          : `count(*) FILTER (WHERE ${q} IS NOT NULL)::bigint`;
      parts.push(`${nonempty} AS ${JSON.stringify("nn__" + col.column_name)}`);
      if (isNumericType(col.data_type, col.udt_name)) {
        parts.push(
          `count(*) FILTER (WHERE ${q} IS NOT NULL AND ${q}::numeric = 0)::bigint AS ${JSON.stringify("zero__" + col.column_name)}`
        );
      }
    }
    const sql = `
      SELECT ${parts.join(",\n             ")}
      FROM ${schema}."${table}"
      WHERE ${fipsCol} IN (${FIPS.map((f) => `'${f}'`).join(",")})
      GROUP BY 1
      ORDER BY 1
    `;
    const r = await c.query(sql);
    results.push({ table: qual, fipsCol, propCol, rows: r.rows });
  }
  await c.end();
  console.error("HEAVY SCAN END source-counts");
  writeJson("2026-09-01_cad-serve-reconcile_source_counts.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    results,
  });
}

async function atomCounts() {
  const keys = [
    "assessedValue",
    "improvementValue",
    "landValue",
    "marketValue",
    "landAcres",
    "livingAreaSqft",
    "yearBuilt",
    "legalDescription",
    "exemptionCodes",
    "propertyUseCode",
    "situsAddress",
    "situsCity",
    "situsZip",
    "ownerName",
    "ownerMailingAddress",
    "absence",
    "taxYear",
  ];
  console.error("HEAVY SCAN START atom-counts keys=" + keys.length);
  const c = await connect("hauska_mcp");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const parts = [
    `${fipsExpr("entity_id")} AS fips`,
    "count(*)::bigint AS n_roll",
    "count(DISTINCT split_part(entity_id, ':', 2))::bigint AS n_prop_suffix",
  ];
  for (const k of keys) {
    const lit = k.replace(/'/g, "''");
    parts.push(
      `count(*) FILTER (WHERE body ? '${lit}')::bigint AS ${JSON.stringify("key__" + k)}`
    );
    parts.push(
      `count(*) FILTER (WHERE nullif(btrim(body->>'${lit}'), '') IS NOT NULL)::bigint AS ${JSON.stringify("nn__" + k)}`
    );
    parts.push(
      `count(*) FILTER (WHERE body ? '${lit}' AND jsonb_typeof(body->'${lit}') IN ('number','string') AND nullif(btrim(body->>'${lit}'), '') IS NOT NULL AND (body->>'${lit}') ~ '^-?[0-9]+(\\.[0-9]+)?$' AND (body->>'${lit}')::numeric = 0)::bigint AS ${JSON.stringify("zero__" + k)}`
    );
  }
  const sql = `
    SELECT ${parts.join(",\n           ")}
    FROM atoms
    WHERE entity_type = 'cad-parcel-roll'
      AND (${rangeSql("", "entity_id")})
    GROUP BY 1
    ORDER BY 1
  `;
  const r = await c.query(sql);
  await c.end();
  console.error("HEAVY SCAN END atom-counts");
  writeJson("2026-09-01_cad-serve-reconcile_atom_counts.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    keys,
    rows: r.rows,
  });
}

async function serveCounts() {
  const keysDoc = JSON.parse(
    fs.readFileSync(path.join(OUT_DIR, "2026-09-01_cad-serve-reconcile_serve_keys.json"), "utf8")
  );
  const paths = [...new Set(keysDoc.keys.map((r) => r.path))].sort();
  console.error("HEAVY SCAN START serve-counts paths=" + paths.length);
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const parts = [
    `${fipsExpr("substring(place_key from 6)")} AS fips`,
    "count(*)::bigint AS n_rows",
  ];
  for (const p of paths) {
    const lit = p.replace(/'/g, "''");
    const extract = `jsonb_extract_path(payload_json, VARIADIC string_to_array('${lit}', '.'))`;
    parts.push(
      `count(*) FILTER (WHERE ${extract} IS NOT NULL AND ${extract} <> 'null'::jsonb)::bigint AS ${JSON.stringify("nn__" + p)}`
    );
    parts.push(
      `count(*) FILTER (WHERE ${extract} IS NOT NULL AND jsonb_typeof(${extract}) IN ('number','string') AND nullif(btrim(${extract} #>> '{}'), '') IS NOT NULL AND (${extract} #>> '{}') ~ '^-?[0-9]+(\\.[0-9]+)?$' AND (${extract} #>> '{}')::numeric = 0)::bigint AS ${JSON.stringify("zero__" + p)}`
    );
  }
  const sql = `
    SELECT ${parts.join(",\n           ")}
    FROM place_layer_snapshots
    WHERE adapter_key = 'node-facets:tier1'
      AND place_key LIKE 'node:%'
      AND (${rangeSql("", "substring(place_key from 6)")})
    GROUP BY 1
    ORDER BY 1
  `;
  const r = await c.query(sql);
  await c.end();
  console.error("HEAVY SCAN END serve-counts");
  writeJson("2026-09-01_cad-serve-reconcile_serve_counts.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    table: "place_layer_snapshots",
    adapter_key: "node-facets:tier1",
    paths,
    rows: r.rows,
  });
}

async function leaks() {
  console.error("HEAVY SCAN START leaks pipeline words on place_layer_snapshots");
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const words = ["unmeasured", "unresolved", "pending", "unknown"];
  const sql = `
    WITH leaves AS (
      SELECT ${fipsExpr("substring(s.place_key from 6)")} AS fips,
             s.place_key,
             p.path,
             p.val
      FROM place_layer_snapshots s,
      LATERAL (
        WITH RECURSIVE t AS (
          SELECT ARRAY[k]::text[] AS path, v, jsonb_typeof(v) AS typ
          FROM jsonb_each(s.payload_json) AS e(k, v)
          UNION ALL
          SELECT t.path || e.k, e.v, jsonb_typeof(e.v)
          FROM t
          JOIN LATERAL jsonb_each(t.v) AS e(k, v) ON t.typ = 'object'
        )
        SELECT array_to_string(path, '.') AS path, v #>> '{}' AS val
        FROM t
        WHERE typ = 'string'
      ) AS p
      WHERE s.adapter_key = 'node-facets:tier1'
        AND s.place_key LIKE 'node:%'
        AND (${rangeSql("", "substring(s.place_key from 6)")})
        AND p.val IN (${words.map((w) => `'${w}'`).join(",")})
    )
    SELECT fips, path, val, count(*)::bigint AS n
    FROM leaves
    GROUP BY 1, 2, 3
    ORDER BY 1, 2, 3
  `;
  const r = await c.query(sql);
  await c.end();
  console.error("HEAVY SCAN END leaks");
  writeJson("2026-09-01_cad-serve-reconcile_leaks.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    words,
    rows: r.rows,
  });
}

async function goldMatch() {
  const golds = [
    "48021:34137",
    "48021:8720522",
    "48209:135570",
    "48491:76149",
    "48453:493738",
    "48453:231086",
  ];
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const r = await c.query(
    `
    SELECT place_key, adapter_key, snapshot_at,
           payload_json->>'facetSchemaVersion' AS schema,
           payload_json->>'publishRunId' AS publish_run,
           payload_json->'baseFacts' AS base_facts,
           payload_json->'cityLimitsFact' AS city_limits,
           payload_json->'landUseFact' AS land_use,
           payload_json->'structuralFact' AS structural,
           payload_json->'cadRoll' AS cad_roll,
           (payload_json->'baseFacts') ? 'cadRoll' AS base_has_cadroll,
           payload_json->'baseFacts'->'cadRoll' AS base_cadroll
    FROM place_layer_snapshots
    WHERE adapter_key = 'node-facets:tier1'
      AND place_key = ANY($1::text[])
    `,
    [golds.map((g) => "node:" + g)]
  );
  await c.end();
  writeJson("2026-09-01_cad-serve-reconcile_gold_bake.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    rows: r.rows,
  });
}

async function sourceDistinct() {
  console.error("HEAVY SCAN START source-distinct cad_property distinct prop_id per field");
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const r = await c.query(`
    SELECT county_fips AS fips,
           count(*)::bigint AS n_rows,
           count(DISTINCT prop_id)::bigint AS n_parcels,
           count(DISTINCT prop_id) FILTER (WHERE living_area_sqft IS NOT NULL)::bigint AS parcels_living_nn,
           count(DISTINCT prop_id) FILTER (WHERE living_area_sqft IS NOT NULL AND living_area_sqft > 0)::bigint AS parcels_living_pos,
           count(DISTINCT prop_id) FILTER (WHERE living_area_sqft = 0)::bigint AS parcels_living_zero,
           count(DISTINCT prop_id) FILTER (WHERE year_built IS NOT NULL)::bigint AS parcels_year_nn,
           count(DISTINCT prop_id) FILTER (WHERE year_built = 0)::bigint AS parcels_year_zero,
           count(DISTINCT prop_id) FILTER (WHERE land_value IS NOT NULL)::bigint AS parcels_land_nn,
           count(DISTINCT prop_id) FILTER (WHERE land_value = 0)::bigint AS parcels_land_zero,
           count(DISTINCT prop_id) FILTER (WHERE improvement_value IS NOT NULL)::bigint AS parcels_imp_nn,
           count(DISTINCT prop_id) FILTER (WHERE improvement_value = 0)::bigint AS parcels_imp_zero,
           count(DISTINCT prop_id) FILTER (WHERE market_value IS NOT NULL)::bigint AS parcels_mkt_nn,
           count(DISTINCT prop_id) FILTER (WHERE market_value = 0)::bigint AS parcels_mkt_zero,
           count(DISTINCT prop_id) FILTER (WHERE assessed_value IS NOT NULL)::bigint AS parcels_ass_nn,
           count(DISTINCT prop_id) FILTER (WHERE assessed_value = 0)::bigint AS parcels_ass_zero,
           count(DISTINCT prop_id) FILTER (WHERE land_acres IS NOT NULL)::bigint AS parcels_acres_nn,
           count(DISTINCT prop_id) FILTER (WHERE land_acres = 0)::bigint AS parcels_acres_zero,
           count(DISTINCT prop_id) FILTER (WHERE nullif(btrim(property_use_code), '') IS NOT NULL)::bigint AS parcels_use_nn,
           count(DISTINCT prop_id) FILTER (WHERE nullif(btrim(situs_address), '') IS NOT NULL)::bigint AS parcels_situs_nn,
           count(DISTINCT prop_id) FILTER (WHERE nullif(btrim(situs_city), '') IS NOT NULL)::bigint AS parcels_city_nn,
           count(DISTINCT prop_id) FILTER (WHERE nullif(btrim(situs_zip), '') IS NOT NULL)::bigint AS parcels_zip_nn,
           count(DISTINCT prop_id) FILTER (WHERE nullif(btrim(legal_description), '') IS NOT NULL)::bigint AS parcels_legal_nn,
           count(DISTINCT prop_id) FILTER (WHERE exemption_codes IS NOT NULL AND cardinality(exemption_codes) > 0)::bigint AS parcels_ex_nn,
           count(DISTINCT tax_year)::bigint AS n_tax_years,
           array_agg(DISTINCT tax_year ORDER BY tax_year) AS tax_years
    FROM cad_property
    WHERE county_fips IN ('48021','48055','48209','48309','48453','48491')
    GROUP BY 1
    ORDER BY 1
  `);
  const golds = await c.query(`
    SELECT county_fips, prop_id, tax_year, living_area_sqft, year_built,
           land_value, improvement_value, market_value, assessed_value,
           land_acres, property_use_code, situs_address, situs_city, situs_zip
    FROM cad_property
    WHERE (county_fips, prop_id) IN (
      ('48021','34137'),('48021','8720522'),('48209','135570'),
      ('48491','76149'),('48453','493738'),('48453','231086'),
      ('48309','176914'),('48055','20478')
    )
    ORDER BY 1, 2, 3
  `);
  await c.end();
  console.error("HEAVY SCAN END source-distinct");
  writeJson("2026-09-01_cad-serve-reconcile_source_distinct.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    counties: r.rows,
    goldSource: golds.rows,
  });
}

async function serveCad() {
  console.error("HEAVY SCAN START serve-cad place_layer_snapshots CAD-related paths");
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const r = await c.query(`
    SELECT ${fipsExpr("substring(place_key from 6)")} AS fips,
           count(*)::bigint AS n_rows,
           count(*) FILTER (WHERE payload_json->>'facetSchemaVersion' = 'node-facets-tier1-conformant-v1')::bigint AS n_conformant,
           count(*) FILTER (WHERE payload_json->'baseFacts' ? 'cadRoll')::bigint AS n_cadroll_key,
           count(*) FILTER (WHERE payload_json->'baseFacts'->'cadRoll' IS NOT NULL AND payload_json->'baseFacts'->'cadRoll' <> 'null'::jsonb)::bigint AS n_cadroll_nn,
           count(*) FILTER (WHERE nullif(payload_json->'baseFacts'->>'situsAddress','') IS NOT NULL)::bigint AS n_situs,
           count(*) FILTER (WHERE nullif(payload_json->'baseFacts'->>'situsCity','') IS NOT NULL)::bigint AS n_city,
           count(*) FILTER (WHERE nullif(payload_json->'baseFacts'->>'situsZip','') IS NOT NULL)::bigint AS n_zip,
           count(*) FILTER (WHERE nullif(payload_json->'baseFacts'->>'situsState','') IS NOT NULL)::bigint AS n_state,
           count(*) FILTER (WHERE payload_json->'baseFacts'->'landUse' IS NOT NULL AND payload_json->'baseFacts'->'landUse' <> 'null'::jsonb)::bigint AS n_base_landuse,
           count(*) FILTER (WHERE payload_json->'baseFacts'->'acreage' IS NOT NULL AND payload_json->'baseFacts'->'acreage' <> 'null'::jsonb)::bigint AS n_acreage,
           count(*) FILTER (WHERE payload_json->'baseFacts' ? 'marketValue')::bigint AS n_bf_mkt_key,
           count(*) FILTER (WHERE payload_json->'baseFacts' ? 'livingAreaSqft')::bigint AS n_bf_living_key,
           count(*) FILTER (WHERE payload_json->'baseFacts' ? 'improvementValue')::bigint AS n_bf_imp_key,
           count(*) FILTER (WHERE payload_json->'baseFacts' ? 'landValue')::bigint AS n_bf_land_key,
           count(*) FILTER (WHERE payload_json->'baseFacts' ? 'assessedValue')::bigint AS n_bf_ass_key,
           count(*) FILTER (WHERE payload_json->'baseFacts' ? 'yearBuilt')::bigint AS n_bf_year_key,
           count(*) FILTER (WHERE payload_json->'baseFacts' ? 'legalDescription')::bigint AS n_bf_legal_key,
           count(*) FILTER (WHERE payload_json ? 'structuralFact')::bigint AS n_structural_key,
           count(*) FILTER (WHERE payload_json ? 'cityLimitsFact')::bigint AS n_citylimits_key,
           count(*) FILTER (WHERE payload_json ? 'landUseFact')::bigint AS n_landusefact_key,
           count(*) FILTER (WHERE payload_json #>> '{cityLimitsFact,status}' = 'unmeasured')::bigint AS n_cl_unmeasured,
           count(*) FILTER (WHERE payload_json #>> '{cityLimitsFact,etjStatus}' = 'unresolved')::bigint AS n_etj_unresolved,
           count(*) FILTER (WHERE payload_json #>> '{zoning,verdict}' = 'unmeasured')::bigint AS n_zoning_verdict_unmeasured,
           count(*) FILTER (WHERE payload_json #>> '{zoning,authority}' = 'unresolved')::bigint AS n_zoning_auth_unresolved
    FROM place_layer_snapshots
    WHERE adapter_key = 'node-facets:tier1'
      AND place_key LIKE 'node:%'
      AND (${rangeSql("", "substring(place_key from 6)")})
    GROUP BY 1
    ORDER BY 1
  `);
  const top = await c.query(`
    SELECT ${fipsExpr("substring(place_key from 6)")} AS fips, k, count(*)::bigint AS n
    FROM place_layer_snapshots s,
    LATERAL jsonb_object_keys(s.payload_json) AS k
    WHERE s.adapter_key = 'node-facets:tier1'
      AND s.place_key LIKE 'node:%'
      AND (${rangeSql("", "substring(s.place_key from 6)")})
    GROUP BY 1, 2
    ORDER BY 1, 2
  `);
  await c.end();
  console.error("HEAVY SCAN END serve-cad");
  writeJson("2026-09-01_cad-serve-reconcile_serve_cad.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    table: "place_layer_snapshots",
    adapter_key: "node-facets:tier1",
    counties: r.rows,
    topLevelKeys: top.rows,
  });
}

const cmd = process.argv[2];
const fns = {
  discover,
  "source-cols": sourceCols,
  "atom-keys": atomKeys,
  "serve-keys": serveKeys,
  "source-counts": sourceCounts,
  "source-distinct": sourceDistinct,
  "atom-counts": atomCounts,
  "serve-counts": serveCounts,
  leaks,
  "gold-match": goldMatch,
  "serve-cad": serveCad,
  "serve-join": serveJoin,
  "atom-cad-living": atomCadLiving,
  "area-blocks": areaBlocks,
};

async function serveJoin() {
  console.error("HEAVY SCAN START serve-join provenance + acreage method");
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const r = await c.query(`
    SELECT ${fipsExpr("substring(place_key from 6)")} AS fips,
           payload_json #>> '{provenance,parcelJoin,state}' AS join_state,
           payload_json #>> '{baseFacts,acreage,method}' AS acreage_method,
           count(*)::bigint AS n
    FROM place_layer_snapshots
    WHERE adapter_key = 'node-facets:tier1'
      AND place_key LIKE 'node:%'
      AND (${rangeSql("", "substring(place_key from 6)")})
    GROUP BY 1, 2, 3
    ORDER BY 1, 2, 3
  `);
  await c.end();
  console.error("HEAVY SCAN END serve-join");
  writeJson("2026-09-01_cad-serve-reconcile_serve_join.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    rows: r.rows,
  });
}

async function atomCadLiving() {
  console.error("HEAVY SCAN START atom-cad-living Bastrop/Caldwell compare");
  const atoms = await connect("hauska_mcp");
  const cur = await atoms.query("SELECT current_database() AS db, now() AS ts");
  const r = await atoms.query(`
    SELECT ${fipsExpr("entity_id")} AS fips,
           count(*)::bigint AS n_roll,
           count(*) FILTER (WHERE body ? 'livingAreaSqft' AND nullif(btrim(body->>'livingAreaSqft'),'') IS NOT NULL)::bigint AS atom_living_nn,
           count(*) FILTER (WHERE body ? 'yearBuilt' AND nullif(btrim(body->>'yearBuilt'),'') IS NOT NULL)::bigint AS atom_year_nn
    FROM atoms
    WHERE entity_type = 'cad-parcel-roll'
      AND ((entity_id >= '48021:' AND entity_id < '48022:')
        OR (entity_id >= '48055:' AND entity_id < '48056:'))
    GROUP BY 1
    ORDER BY 1
  `);
  const samples = await atoms.query(`
    SELECT entity_id, body->>'livingAreaSqft' AS atom_living, body->>'yearBuilt' AS atom_year,
           body->>'improvementValue' AS atom_imp
    FROM atoms
    WHERE entity_type = 'cad-parcel-roll'
      AND entity_id >= '48021:' AND entity_id < '48022:'
      AND body ? 'livingAreaSqft'
      AND nullif(btrim(body->>'livingAreaSqft'),'') IS NOT NULL
    ORDER BY entity_id
    LIMIT 8
  `);
  await atoms.end();
  const neon = await connect("neondb");
  const ids = samples.rows.map((x) => x.entity_id.split(":")[1]);
  const cad = await neon.query(
    `SELECT prop_id, living_area_sqft, year_built, improvement_value
     FROM cad_property WHERE county_fips='48021' AND prop_id = ANY($1::text[])`,
    [ids]
  );
  await neon.end();
  console.error("HEAVY SCAN END atom-cad-living");
  writeJson("2026-09-01_cad-serve-reconcile_atom_cad_living.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    countyRolls: r.rows,
    atomSamples: samples.rows,
    cadForSamples: cad.rows,
  });
}

async function areaBlocks() {
  const streets = [
    { fips: "48021", needle: "PINE", city: "BASTROP" },
    { fips: "48055", needle: "PLUM ST", city: "LOCKHART" },
    { fips: "48209", needle: "CIBOLO CREEK", city: "KYLE" },
    { fips: "48309", needle: "BEVERLY DR", city: "WACO" },
    { fips: "48453", needle: "LAIRD DR", city: "AUSTIN" },
    { fips: "48491", needle: "DAVIS ST", city: "TAYLOR" },
  ];
  const c = await connect("neondb");
  const cur = await c.query("SELECT current_database() AS db, now() AS ts");
  const blocks = [];
  for (const s of streets) {
    const r = await c.query(
      `
      SELECT place_key,
             payload_json #>> '{baseFacts,situsAddress}' AS situs,
             payload_json #>> '{baseFacts,situsCity}' AS city,
             payload_json #>> '{provenance,parcelJoin,state}' AS join_state,
             payload_json #>> '{zoning,district}' AS zoning_district
      FROM place_layer_snapshots
      WHERE adapter_key = 'node-facets:tier1'
        AND place_key >= $1 AND place_key < $2
        AND payload_json #>> '{baseFacts,situsAddress}' ILIKE $3
        AND payload_json #>> '{baseFacts,situsCity}' ILIKE $4
      ORDER BY place_key
      `,
      [
        `node:${s.fips}:`,
        `node:${String(Number(s.fips) + 1)}:`,
        `%${s.needle}%`,
        s.city,
      ]
    );
    blocks.push({ ...s, n: r.rows.length, rows: r.rows });
  }
  await c.end();
  writeJson("2026-09-01_cad-serve-reconcile_area_blocks.json", {
    at: new Date().toISOString(),
    current_database: cur.rows[0].db,
    ts: cur.rows[0].ts,
    blocks,
  });
}
if (!fns[cmd]) {
  console.error("unknown cmd " + cmd + " expected " + Object.keys(fns).join("|"));
  process.exit(2);
}
await fns[cmd]();
