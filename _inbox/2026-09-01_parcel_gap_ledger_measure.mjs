/**
 * READ-ONLY parcel-gap-ledger instruments.
 * Secrets from env. Never print a URL. Writes JSON only.
 *
 * Usage (from P:/doc_repo, factory pg via createRequire):
 *   node _inbox/2026-09-01_parcel_gap_ledger_measure.mjs factory
 *   node _inbox/2026-09-01_parcel_gap_ledger_measure.mjs prod
 *   node _inbox/2026-09-01_parcel_gap_ledger_measure.mjs flood
 *   node _inbox/2026-09-01_parcel_gap_ledger_measure.mjs trace
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("P:/tmp/hauska-factory-parcel-fill/src/jobs/parcel-record-fill.mjs");
const { Client } = require("pg");

const HERE = dirname(fileURLToPath(import.meta.url));
const FIPS = ["48021", "48055", "48209", "48309", "48453", "48491"];
const CAD_RAILS = {
  situs_address: "situsAddress",
  situs_city: "situsCity",
  situs_zip: "situsZip",
  legal_description: "legalDescription",
  exemption_codes: "exemptionCodes",
  property_use_code: "landUseCode",
  land_value: "landValue",
  improvement_value: "improvementValue",
  market_value: "marketValue",
  assessed_value: "assessedValue",
  year_built: "yearBuilt",
  living_area_sqft: "livingAreaSqft",
  land_acres: "acreageAcres",
};

function outPath(name) {
  return join(HERE, name);
}

function writeJson(name, obj) {
  writeFileSync(outPath(name), JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function redact(client) {
  return {
    database: client.database,
    hostFingerprint: String(client.host || "").replace(/^ep-[^.]+/, "ep-***"),
  };
}

async function connect(url, timeoutMs) {
  if (!url) throw new Error("URL_REQUIRED");
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: true },
    statement_timeout: timeoutMs,
  });
  await client.connect();
  await client.query("SET default_transaction_read_only = on");
  await client.query(`SET statement_timeout = ${timeoutMs}`);
  await client.query("SET application_name = 'parcel-gap-ledger'");
  return client;
}

async function q(client, sql, params = []) {
  const started = Date.now();
  const { rows } = await client.query(sql, params);
  return { ms: Date.now() - started, rows };
}

async function factoryCounty(client, fips) {
  const records = await q(
    client,
    `SELECT county_fips,
            count(*)::bigint AS records,
            count(*) FILTER (WHERE incorporated IS TRUE)::bigint AS in_city,
            count(*) FILTER (WHERE incorporated IS FALSE)::bigint AS unincorporated,
            count(*) FILTER (WHERE incorporated IS NULL)::bigint AS unresolved
       FROM parcel_record
      WHERE county_fips = $1
      GROUP BY county_fips`,
    [fips],
  );
  const cellsKind = await q(
    client,
    `SELECT c.cell_state->>'kind' AS kind, count(*)::bigint AS n
       FROM parcel_record_cell c
       JOIN parcel_record r ON r.place_key = c.place_key
      WHERE r.county_fips = $1
      GROUP BY 1
      ORDER BY 1`,
    [fips],
  );
  const census = await q(
    client,
    `SELECT c.rail_key, c.cell_state->>'kind' AS kind, count(*)::bigint AS n
       FROM parcel_record_cell c
       JOIN parcel_record r ON r.place_key = c.place_key
      WHERE r.county_fips = $1
      GROUP BY 1, 2
      ORDER BY 1, 2`,
    [fips],
  );
  const cellsPerPlace = await q(
    client,
    `SELECT n_cells, count(*)::bigint AS parcels
       FROM (
         SELECT r.place_key, count(*)::int AS n_cells
           FROM parcel_record r
           JOIN parcel_record_cell c ON c.place_key = r.place_key
          WHERE r.county_fips = $1
          GROUP BY r.place_key
       ) t
      GROUP BY 1
      ORDER BY 1`,
    [fips],
  );
  const orphans = await q(
    client,
    `SELECT r.place_key, r.prop_id, r.incorporated, r.instantiated_at, t.n_cells
       FROM parcel_record r
       JOIN (
         SELECT r2.place_key, count(*)::int AS n_cells
           FROM parcel_record r2
           JOIN parcel_record_cell c ON c.place_key = r2.place_key
          WHERE r2.county_fips = $1
          GROUP BY r2.place_key
         HAVING count(*) <> 65
       ) t ON t.place_key = r.place_key
      ORDER BY r.place_key`,
    [fips],
  );
  const naAudit = await q(
    client,
    `SELECT c.rail_key,
            c.cell_state->>'reason' AS reason,
            count(*) FILTER (WHERE r.incorporated IS FALSE)::bigint AS unincorporated,
            count(*) FILTER (WHERE r.incorporated IS TRUE)::bigint AS in_city,
            count(*) FILTER (WHERE r.incorporated IS NULL)::bigint AS unresolved,
            count(*)::bigint AS n
       FROM parcel_record_cell c
       JOIN parcel_record r ON r.place_key = c.place_key
      WHERE r.county_fips = $1
        AND c.cell_state->>'kind' = 'not-applicable'
      GROUP BY 1, 2
      ORDER BY 1`,
    [fips],
  );
  const liveRails = await q(
    client,
    `SELECT c.rail_key, count(*)::bigint AS earned
       FROM parcel_record_cell c
       JOIN parcel_record r ON r.place_key = c.place_key
      WHERE r.county_fips = $1
        AND c.cell_state->>'kind' IN ('value', 'absent-verified', 'refused')
      GROUP BY 1
      ORDER BY 1`,
    [fips],
  );
  const cadJoin = await q(
    client,
    `SELECT count(*)::bigint AS records,
            count(*) FILTER (WHERE x.place_key IS NOT NULL)::bigint AS with_cad_value_cell
       FROM parcel_record r
       LEFT JOIN (
         SELECT DISTINCT c.place_key
           FROM parcel_record_cell c
           JOIN parcel_record r2 ON r2.place_key = c.place_key
          WHERE r2.county_fips = $1
            AND c.cell_state->>'kind' = 'value'
            AND c.cell_state->>'source' = 'cad_property'
       ) x ON x.place_key = r.place_key
      WHERE r.county_fips = $1`,
    [fips],
  );
  const cadMoved = await q(
    client,
    `SELECT count(*)::bigint AS cad_value_cells
       FROM parcel_record_cell c
       JOIN parcel_record r ON r.place_key = c.place_key
      WHERE r.county_fips = $1
        AND c.cell_state->>'kind' = 'value'
        AND c.cell_state->>'source' = 'cad_property'`,
    [fips],
  );
  const cadValueRails = await q(
    client,
    `SELECT c.rail_key, count(*)::bigint AS n
       FROM parcel_record_cell c
       JOIN parcel_record r ON r.place_key = c.place_key
      WHERE r.county_fips = $1
        AND c.cell_state->>'kind' = 'value'
        AND c.cell_state->>'source' = 'cad_property'
      GROUP BY 1
      ORDER BY 1`,
    [fips],
  );
  const unaccountedByRail = await q(
    client,
    `SELECT c.rail_key, count(*)::bigint AS unaccounted
       FROM parcel_record_cell c
       JOIN parcel_record r ON r.place_key = c.place_key
      WHERE r.county_fips = $1
        AND c.cell_state->>'kind' = 'unaccounted'
      GROUP BY 1
      ORDER BY unaccounted DESC, c.rail_key`,
    [fips],
  );
  const floodCells = await q(
    client,
    `SELECT c.cell_state->>'kind' AS kind,
            c.cell_state->>'source' AS source,
            c.cell_state->>'disposition' AS disposition,
            count(*)::bigint AS n
       FROM parcel_record_cell c
       JOIN parcel_record r ON r.place_key = c.place_key
      WHERE r.county_fips = $1
        AND c.rail_key = 'flood'
      GROUP BY 1, 2, 3`,
    [fips],
  );
  return {
    county_fips: fips,
    records: records.rows[0],
    cellsKind: cellsKind.rows,
    census: census.rows,
    cellsPerPlace: cellsPerPlace.rows,
    orphans: orphans.rows,
    naAudit: naAudit.rows,
    liveRails: liveRails.rows,
    cadJoin: cadJoin.rows[0],
    cadMoved: cadMoved.rows[0],
    cadValueRails: cadValueRails.rows,
    unaccountedByRail: unaccountedByRail.rows,
    floodCells: floodCells.rows,
    timingsMs: {
      records: records.ms,
      cellsKind: cellsKind.ms,
      census: census.ms,
      cellsPerPlace: cellsPerPlace.ms,
      orphans: orphans.ms,
      naAudit: naAudit.ms,
      liveRails: liveRails.ms,
      cadJoin: cadJoin.ms,
      cadMoved: cadMoved.ms,
    },
  };
}

async function factory() {
  const client = await connect(process.env.FACTORY_DATABASE_URL, 120000);
  const snap = await q(client, "SELECT current_database() AS db, now() AS measured_at");
  const gold = await q(
    client,
    `SELECT c.rail_key, c.cell_state
       FROM parcel_record_cell c
      WHERE c.place_key = '48021:34137'
      ORDER BY c.rail_key`,
  );
  const counties = [];
  for (const fips of FIPS) {
    const t0 = Date.now();
    let row;
    try {
      row = await factoryCounty(client, fips);
      row.elapsedMs = Date.now() - t0;
    } catch (e) {
      row = { county_fips: fips, error: String(e.message).slice(0, 300), elapsedMs: Date.now() - t0 };
    }
    counties.push(row);
    writeJson("2026-09-01_parcel_gap_ledger_factory.json", {
      at: new Date().toISOString(),
      store: "FACTORY_DATABASE_URL / neondb",
      snapshot: snap.rows[0],
      gold48021_34137: gold.rows,
      counties,
      partial: counties.length < FIPS.length,
    });
    console.log("factory county", fips, "ms", row.elapsedMs, row.error || row.records.records);
  }
  await client.end();
  writeJson("2026-09-01_parcel_gap_ledger_factory.json", {
    at: new Date().toISOString(),
    store: "FACTORY_DATABASE_URL / neondb",
    snapshot: snap.rows[0],
    gold48021_34137: gold.rows,
    counties,
    partial: false,
  });
  console.log("factory ok", counties.map((c) => c.county_fips).join(","));
}

async function prod() {
  const client = await connect(process.env.PRODUCTION_NEONDB_URL, 180000);
  const snap = await q(client, "SELECT current_database() AS db, now() AS measured_at");
  const landing = await q(
    client,
    `SELECT county_fips,
            count(*)::bigint AS n,
            count(*) FILTER (WHERE disposition = 'in-city')::bigint AS in_city,
            count(*) FILTER (WHERE disposition = 'unincorporated')::bigint AS unincorporated,
            count(*) FILTER (WHERE disposition = 'unresolved')::bigint AS unresolved
       FROM landing_parcel_jurisdiction
      WHERE county_fips = ANY($1)
      GROUP BY 1
      ORDER BY 1`,
    [FIPS],
  );
  const nonNumeric = await q(
    client,
    `SELECT county_fips,
            count(*) FILTER (WHERE prop_id !~ '^[0-9]+$')::bigint AS non_numeric,
            count(*) FILTER (WHERE prop_id ~ '^[0-9]+$')::bigint AS numeric_only,
            count(*) FILTER (WHERE prop_id ~ '^R[0-9]+$')::bigint AS r_prefix,
            count(*) FILTER (WHERE prop_id ~ '[A-Za-z]' AND prop_id !~ '^R[0-9]+$')::bigint AS other_alpha,
            count(*) FILTER (WHERE prop_id ~ '\\s')::bigint AS has_space
       FROM landing_parcel_jurisdiction
      WHERE county_fips = ANY($1)
      GROUP BY 1
      ORDER BY 1`,
    [FIPS],
  );
  const nonNumericSamples = await q(
    client,
    `SELECT county_fips, prop_id, disposition
       FROM landing_parcel_jurisdiction
      WHERE county_fips = ANY($1)
        AND prop_id !~ '^[0-9]+$'
      ORDER BY county_fips, prop_id
      LIMIT 80`,
    [FIPS],
  );
  writeJson("2026-09-01_parcel_gap_ledger_prod.json", {
    at: new Date().toISOString(),
    store: "PRODUCTION_NEONDB_URL / neondb",
    snapshot: snap.rows[0],
    landing: landing.rows,
    nonNumericLanding: nonNumeric.rows,
    nonNumericSamples: nonNumericSamples.rows,
    partial: true,
  });
  const cadKeyShape = [];
  const cadNull = [];
  const cadHeadlines = [];
  for (const fips of FIPS) {
    const shape = await q(
      client,
      `SELECT $1::text AS county_fips,
              count(*)::bigint AS cad_rows,
              count(DISTINCT prop_id)::bigint AS distinct_prop,
              count(*) FILTER (WHERE prop_id::text !~ '^[0-9]+$')::bigint AS non_numeric,
              count(*) FILTER (WHERE prop_id::text ~ '^[0-9]+$')::bigint AS numeric_only,
              count(*) FILTER (WHERE prop_id::text ~ '^R[0-9]+$')::bigint AS r_prefix
         FROM cad_property
        WHERE county_fips = $1`,
      [fips],
    );
    cadKeyShape.push({ ...shape.rows[0], ms: shape.ms });
    const headlines = await q(
      client,
      `WITH latest AS (
         SELECT DISTINCT ON (prop_id)
                prop_id::text AS prop_id,
                improvement_value, living_area_sqft, assessed_value, market_value
           FROM cad_property
          WHERE county_fips = $1
          ORDER BY prop_id, tax_year DESC
       )
       SELECT
         (SELECT count(*) FROM latest) AS cad_latest,
         (SELECT count(*) FROM latest l JOIN landing_parcel_jurisdiction j
            ON j.county_fips = $1 AND j.prop_id = l.prop_id) AS cad_latest_in_landing,
         (SELECT count(*) FROM latest WHERE improvement_value = 0) AS imp_zero,
         (SELECT count(*) FROM latest l JOIN landing_parcel_jurisdiction j
            ON j.county_fips = $1 AND j.prop_id = l.prop_id
           WHERE l.improvement_value = 0) AS imp_zero_in_landing,
         (SELECT count(*) FROM latest WHERE living_area_sqft > 0) AS living_gt0,
         (SELECT count(*) FROM latest l JOIN landing_parcel_jurisdiction j
            ON j.county_fips = $1 AND j.prop_id = l.prop_id
           WHERE l.living_area_sqft > 0) AS living_gt0_in_landing`,
      [fips],
    );
    cadHeadlines.push({ county_fips: fips, ...headlines.rows[0], ms: headlines.ms });
    const nulls = await q(
      client,
      `WITH latest AS (
         SELECT DISTINCT ON (prop_id)
                prop_id::text AS prop_id,
                situs_address, situs_city, situs_zip, legal_description, exemption_codes,
                property_use_code, land_value, improvement_value, market_value, assessed_value,
                year_built, living_area_sqft, land_acres
           FROM cad_property
          WHERE county_fips = $1
          ORDER BY prop_id, tax_year DESC
       )
       SELECT
         count(*)::bigint AS landing_with_cad,
         count(*) FILTER (WHERE l.situs_address IS NULL OR btrim(l.situs_address) = '')::bigint AS situs_address_null,
         count(*) FILTER (WHERE l.situs_city IS NULL OR btrim(l.situs_city) = '')::bigint AS situs_city_null,
         count(*) FILTER (WHERE l.situs_zip IS NULL OR btrim(l.situs_zip) = '')::bigint AS situs_zip_null,
         count(*) FILTER (WHERE l.legal_description IS NULL OR btrim(l.legal_description) = '')::bigint AS legal_description_null,
         count(*) FILTER (WHERE l.exemption_codes IS NULL OR l.exemption_codes::text IN ('', '{}'))::bigint AS exemption_codes_null,
         count(*) FILTER (WHERE l.property_use_code IS NULL OR btrim(l.property_use_code) = '')::bigint AS property_use_code_null,
         count(*) FILTER (WHERE l.land_value IS NULL)::bigint AS land_value_null,
         count(*) FILTER (WHERE l.improvement_value IS NULL)::bigint AS improvement_value_null,
         count(*) FILTER (WHERE l.market_value IS NULL)::bigint AS market_value_null,
         count(*) FILTER (WHERE l.assessed_value IS NULL)::bigint AS assessed_value_null,
         count(*) FILTER (WHERE l.year_built IS NULL)::bigint AS year_built_null,
         count(*) FILTER (WHERE l.living_area_sqft IS NULL)::bigint AS living_area_null,
         count(*) FILTER (WHERE l.living_area_sqft IS NOT NULL AND l.living_area_sqft = 0)::bigint AS living_area_zero,
         count(*) FILTER (WHERE l.land_acres IS NULL)::bigint AS land_acres_null
         FROM landing_parcel_jurisdiction j
         JOIN latest l ON l.prop_id = j.prop_id
        WHERE j.county_fips = $1`,
      [fips],
    );
    cadNull.push({ county_fips: fips, ...nulls.rows[0], ms: nulls.ms, fieldToRail: CAD_RAILS });
    writeJson("2026-09-01_parcel_gap_ledger_prod.json", {
      at: new Date().toISOString(),
      store: "PRODUCTION_NEONDB_URL / neondb",
      snapshot: snap.rows[0],
      landing: landing.rows,
      nonNumericLanding: nonNumeric.rows,
      nonNumericSamples: nonNumericSamples.rows,
      cadKeyShape,
      cadHeadlines,
      cadNullWhereJoined: cadNull,
      partial: true,
    });
    console.log("prod cad", fips, headlines.ms, nulls.ms);
  }
  let catalogCounts = {};
  try {
    const catalogs = await q(
      client,
      `SELECT
         (SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='tx_rrc_well') AS has_tx_rrc_well,
         (SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='tx_special_district') AS has_tx_special_district,
         (SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='tx_fema_nfhl_flood_zone') AS has_nfhl,
         (SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='txgio_parcel') AS has_txgio`,
    );
    catalogCounts = { ms: catalogs.ms, flags: catalogs.rows[0] };
    if (String(catalogs.rows[0].has_tx_rrc_well) === "1") {
      const w = await q(client, `SELECT count(*)::bigint AS n, count(DISTINCT county_fips)::bigint AS counties FROM tx_rrc_well`);
      catalogCounts.tx_rrc_well = { ...w.rows[0], ms: w.ms };
    }
    if (String(catalogs.rows[0].has_tx_special_district) === "1") {
      const cols = await q(
        client,
        `SELECT column_name FROM information_schema.columns
          WHERE table_schema='public' AND table_name='tx_special_district'
          ORDER BY ordinal_position`,
      );
      const n = await q(client, `SELECT count(*)::bigint AS n FROM tx_special_district`);
      catalogCounts.tx_special_district = { n: n.rows[0].n, columns: cols.rows.map((r) => r.column_name), ms: n.ms };
    }
  } catch (e) {
    catalogCounts = { error: String(e.message).slice(0, 300) };
  }
  await client.end();
  writeJson("2026-09-01_parcel_gap_ledger_prod.json", {
    at: new Date().toISOString(),
    store: "PRODUCTION_NEONDB_URL / neondb",
    snapshot: snap.rows[0],
    landing: landing.rows,
    nonNumericLanding: nonNumeric.rows,
    nonNumericSamples: nonNumericSamples.rows,
    cadKeyShape,
    cadHeadlines,
    cadNullWhereJoined: cadNull,
    catalogCounts,
  });
  console.log("prod ok", JSON.stringify({ landing: landing.rows.length, nonNumeric: nonNumeric.rows.length }));
}

async function flood() {
  const client = await connect(process.env.PRODUCTION_NEONDB_URL, 120000);
  const nfhlCols = await q(
    client,
    `SELECT column_name, data_type
       FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'tx_fema_nfhl_flood_zone'
      ORDER BY ordinal_position`,
  );
  const nfhlCounts = await q(
    client,
    `SELECT count(*)::bigint AS n,
            count(*) FILTER (WHERE fld_zone ILIKE 'AO%')::bigint AS ao,
            count(*) FILTER (WHERE fld_zone ILIKE 'AE%')::bigint AS ae,
            count(*) FILTER (WHERE zone_subty ILIKE '%FLOODWAY%')::bigint AS floodway_subty,
            count(*) FILTER (WHERE static_bfe IS NOT NULL)::bigint AS has_bfe
       FROM tx_fema_nfhl_flood_zone`,
  );
  const nfhlPanel = await q(
    client,
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'tx_fema_nfhl_flood_zone'
        AND (column_name ILIKE '%panel%' OR column_name ILIKE '%dfirm%' OR column_name ILIKE '%eff%' OR column_name ILIKE '%floodway%' OR column_name ILIKE '%bfe%')`,
  );
  const snapFlood = await q(
    client,
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'place_layer_snapshots'
        AND (column_name ILIKE '%flood%' OR column_name ILIKE '%zone%')
      ORDER BY 1`,
  );
  let snapshotFloodN = null;
  try {
    const s = await q(
      client,
      `SELECT count(*)::bigint AS n
         FROM place_layer_snapshots
        WHERE layer_key ILIKE '%flood%' OR entity_type ILIKE '%flood%'`,
    );
    snapshotFloodN = { ...s.rows[0], ms: s.ms, ok: true };
  } catch (e) {
    snapshotFloodN = { ok: false, code: e.code, message: String(e.message).slice(0, 200) };
  }
  await client.end();

  let atoms = null;
  const atomsUrl = process.env.PRODUCTION_NEONDB_URL.replace(/\/neondb(\?|$)/, "/hauska_mcp$1");
  const atomsClient = await connect(atomsUrl, 120000);
  try {
    const atomDb = await q(atomsClient, "SELECT current_database() AS db, now() AS measured_at");
    const atomShape = await q(
      atomsClient,
      `SELECT
         count(*)::bigint AS n,
         count(*) FILTER (WHERE body ? 'floodZone')::bigint AS has_floodZone,
         count(*) FILTER (WHERE body ? 'inSpecialFloodHazardArea')::bigint AS has_sfha,
         count(*) FILTER (WHERE body ? 'baseFloodElevation')::bigint AS has_bfe,
         count(*) FILTER (WHERE body ? 'zoneSubtype')::bigint AS has_subtype,
         count(*) FILTER (WHERE body ? 'floodway')::bigint AS has_floodway,
         count(*) FILTER (WHERE body ? 'panelId' OR body ? 'femaPanel' OR body ? 'panel')::bigint AS has_panel,
         count(*) FILTER (WHERE body->>'floodZone' ILIKE 'AO%')::bigint AS ao,
         count(*) FILTER (WHERE body->>'floodZone' ILIKE 'AE%')::bigint AS ae
         FROM atoms
        WHERE entity_type = 'flood-hazard-fact'
          AND split_part(entity_id, ':', 1) = ANY($1)`,
      [FIPS],
    );
    const goldAtom = await q(
      atomsClient,
      `SELECT entity_id, body
         FROM atoms
        WHERE entity_type = 'flood-hazard-fact'
          AND entity_id = '48021:34137'
        LIMIT 1`,
    );
    atoms = { snapshot: atomDb.rows[0], shape: atomShape.rows[0], gold: goldAtom.rows };
  } finally {
    await atomsClient.end();
  }

  writeJson("2026-09-01_parcel_gap_ledger_flood.json", {
    at: new Date().toISOString(),
    nfhlColumns: nfhlCols.rows,
    nfhlCounts: nfhlCounts.rows[0],
    nfhlPanelish: nfhlPanel.rows,
    snapshotFloodCols: snapFlood.rows,
    snapshotFloodN,
    atoms,
    committedCompanionShape: {
      parcel_record_flood: "{kind, disposition, rowCount, source, vintage} — no zone, floodway, BFE, panel",
      flood_hazard_fact_atom: "inSpecialFloodHazardArea, floodZone, zoneSubtype, baseFloodElevation — no floodway flag, no panel, no effective date",
    },
  });
  console.log("flood ok");
}

async function trace() {
  const client = await connect(process.env.PRODUCTION_NEONDB_URL, 180000);
  const sample = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              living_area_sqft, improvement_value, situs_address, legal_description
         FROM cad_property
        WHERE county_fips = '48021'
        ORDER BY prop_id, tax_year DESC
     ),
     missing AS (
       SELECT l.prop_id, l.living_area_sqft, l.improvement_value, l.situs_address
         FROM latest l
         LEFT JOIN landing_parcel_jurisdiction j
           ON j.county_fips = '48021' AND j.prop_id = l.prop_id
        WHERE l.living_area_sqft > 0
          AND j.prop_id IS NULL
     )
     SELECT *
       FROM missing
      ORDER BY prop_id
      LIMIT 20`,
  );
  const missingN = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id) prop_id::text AS prop_id, living_area_sqft
         FROM cad_property
        WHERE county_fips = '48021'
        ORDER BY prop_id, tax_year DESC
     )
     SELECT count(*)::bigint AS n
       FROM latest l
       LEFT JOIN landing_parcel_jurisdiction j
         ON j.county_fips = '48021' AND j.prop_id = l.prop_id
      WHERE l.living_area_sqft > 0
        AND j.prop_id IS NULL`,
  );
  const ids = sample.rows.map((r) => r.prop_id);
  const txgio = await q(
    client,
    `SELECT prop_id, feature_index,
            (geometry IS NOT NULL) AS has_geom
       FROM txgio_parcel
      WHERE county_fips = '48021'
        AND prop_id = ANY($1)`,
    [ids],
  );
  const keyFormats = await q(
    client,
    `SELECT
       (SELECT count(*) FROM landing_parcel_jurisdiction WHERE county_fips='48021' AND prop_id ~ '^[0-9]+$') AS landing_numeric,
       (SELECT count(*) FROM landing_parcel_jurisdiction WHERE county_fips='48021' AND prop_id ~ '^0') AS landing_leading_zero,
       (SELECT count(*) FROM cad_property WHERE county_fips='48021' AND prop_id::text ~ '^[0-9]+$') AS cad_numeric,
       (SELECT count(*) FROM cad_property WHERE county_fips='48021' AND prop_id::text ~ '^0') AS cad_leading_zero`,
  );
  const overlapGeom = [];
  for (const id of ids.slice(0, 20)) {
    const hit = await q(
      client,
      `WITH cadp AS (
         SELECT prop_id, geometry
           FROM txgio_parcel
          WHERE county_fips = '48021' AND prop_id = $1
          LIMIT 1
       )
       SELECT c.prop_id AS cad_prop,
              j.prop_id AS landing_prop,
              j.disposition
         FROM cadp c
         JOIN txgio_parcel t
           ON t.county_fips = '48021'
          AND t.prop_id <> c.prop_id
          AND t.geometry IS NOT NULL
          AND ST_Intersects(
                ST_MakeValid(ST_SetSRID(ST_GeomFromGeoJSON(c.geometry::text), 4326)),
                ST_MakeValid(ST_SetSRID(ST_GeomFromGeoJSON(t.geometry::text), 4326))
              )
         JOIN landing_parcel_jurisdiction j
           ON j.county_fips = '48021' AND j.prop_id = t.prop_id
        LIMIT 3`,
      [id],
    );
    overlapGeom.push({ prop_id: id, hits: hit.rows, ms: hit.ms, err: null });
  }
  const perCountyKey = [];
  for (const fips of FIPS) {
    const row = await q(
      client,
      `SELECT $1::text AS county_fips,
              (SELECT left(prop_id, 12) FROM landing_parcel_jurisdiction WHERE county_fips=$1 AND prop_id ~ '^[0-9]+$' ORDER BY prop_id LIMIT 1) AS landing_numeric_ex,
              (SELECT left(prop_id, 12) FROM landing_parcel_jurisdiction WHERE county_fips=$1 AND prop_id ~ '^R' ORDER BY prop_id LIMIT 1) AS landing_r_ex,
              (SELECT left(prop_id::text, 12) FROM cad_property WHERE county_fips=$1 AND prop_id::text ~ '^[0-9]+$' ORDER BY prop_id LIMIT 1) AS cad_numeric_ex,
              (SELECT left(prop_id::text, 12) FROM cad_property WHERE county_fips=$1 AND prop_id::text ~ '^R' ORDER BY prop_id LIMIT 1) AS cad_r_ex`,
      [fips],
    );
    perCountyKey.push(row.rows[0]);
  }
  await client.end();
  writeJson("2026-09-01_parcel_gap_ledger_trace.json", {
    at: new Date().toISOString(),
    missingLivingN: missingN.rows[0],
    sample20: sample.rows,
    txgioHits: txgio.rows,
    keyFormats: keyFormats.rows[0],
    overlapGeom,
    perCountyKeyExamples: perCountyKey,
  });
  console.log("trace ok", JSON.stringify({ missing: missingN.rows[0], sample: sample.rows.length, txgio: txgio.rows.length }));
}

async function flood2() {
  const client = await connect(process.env.PRODUCTION_NEONDB_URL, 60000);
  const nfhlCols = await q(
    client,
    `SELECT column_name, data_type
       FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'tx_fema_nfhl_flood_zone'
      ORDER BY ordinal_position`,
  );
  const nfhlSample = await q(
    client,
    `SELECT fld_zone, zone_subty, sfha_tf, static_bfe, source_vintage
       FROM tx_fema_nfhl_flood_zone
      WHERE fld_zone ILIKE 'AO%' OR fld_zone ILIKE 'AE%'
      LIMIT 8`,
  );
  let nfhlEst = null;
  try {
    const e = await q(
      client,
      `SELECT reltuples::bigint AS est_rows
         FROM pg_class
        WHERE relname = 'tx_fema_nfhl_flood_zone'`,
    );
    nfhlEst = e.rows[0];
  } catch (err) {
    nfhlEst = { error: String(err.message).slice(0, 200) };
  }
  const mud = await q(
    client,
    `SELECT district_type, count(*)::bigint AS n
       FROM tx_special_district
      GROUP BY 1
      ORDER BY n DESC`,
  );
  await client.end();

  let atoms = null;
  const atomsUrl = process.env.PRODUCTION_NEONDB_URL.replace(/\/neondb(\?|$)/, "/hauska_mcp$1");
  const atomsClient = await connect(atomsUrl, 60000);
  try {
    const gold = await q(
      atomsClient,
      `SELECT entity_id, body
         FROM atoms
        WHERE entity_type = 'flood-hazard-fact' AND entity_id = '48021:34137'
        LIMIT 1`,
    );
    const sample = await q(
      atomsClient,
      `SELECT entity_id, body->>'floodZone' AS flood_zone,
              body->>'zoneSubtype' AS zone_subtype,
              body->>'inSpecialFloodHazardArea' AS sfha,
              body ? 'baseFloodElevation' AS has_bfe,
              body ? 'floodway' AS has_floodway,
              body ? 'panelId' AS has_panel
         FROM atoms
        WHERE entity_type = 'flood-hazard-fact'
          AND split_part(entity_id, ':', 1) = '48021'
        LIMIT 12`,
    );
    atoms = { db: "hauska_mcp", gold: gold.rows, sample: sample.rows };
  } catch (err) {
    atoms = { error: String(err.message).slice(0, 300) };
  } finally {
    await atomsClient.end();
  }

  writeJson("2026-09-01_parcel_gap_ledger_flood.json", {
    at: new Date().toISOString(),
    nfhlColumns: nfhlCols.rows,
    nfhlEst,
    nfhlAoAeSample: nfhlSample.rows,
    specialDistrictTypes: mud.rows,
    atoms,
    committedCompanionShape: {
      parcel_record_flood: "{kind, disposition, rowCount, source, vintage} — no zone, floodway, BFE, panel",
      flood_hazard_fact_atom: "inSpecialFloodHazardArea, floodZone, zoneSubtype, baseFloodElevation — no floodway flag, no panel, no effective date",
    },
  });
  console.log("flood2 ok", nfhlCols.rows.length, "nfhl cols", mud.rows.length, "district types");
}

async function trace2() {
  const client = await connect(process.env.PRODUCTION_NEONDB_URL, 180000);
  const split = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id, living_area_sqft, improvement_value
         FROM cad_property
        WHERE county_fips = '48021'
        ORDER BY prop_id, tax_year DESC
     ),
     missing AS (
       SELECT l.prop_id, l.living_area_sqft, l.improvement_value
         FROM latest l
         LEFT JOIN landing_parcel_jurisdiction j
           ON j.county_fips = '48021' AND j.prop_id = l.prop_id
        WHERE l.living_area_sqft > 0 AND j.prop_id IS NULL
     )
     SELECT
       (SELECT count(*) FROM missing) AS missing_living,
       (SELECT count(*) FROM missing m JOIN txgio_parcel t
          ON t.county_fips='48021' AND t.prop_id = m.prop_id) AS missing_in_txgio,
       (SELECT count(*) FROM missing m
         WHERE EXISTS (SELECT 1 FROM txgio_parcel t
                        WHERE t.county_fips='48021' AND t.prop_id = ('0' || m.prop_id))) AS missing_in_txgio_zeropad`,
  );
  const sample = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id, living_area_sqft, improvement_value, situs_address
         FROM cad_property
        WHERE county_fips = '48021'
        ORDER BY prop_id, tax_year DESC
     )
     SELECT l.prop_id, l.living_area_sqft, l.improvement_value, l.situs_address,
            (EXISTS (SELECT 1 FROM txgio_parcel t WHERE t.county_fips='48021' AND t.prop_id = l.prop_id)) AS in_txgio,
            (EXISTS (SELECT 1 FROM landing_parcel_jurisdiction j WHERE j.county_fips='48021' AND j.prop_id = l.prop_id)) AS in_landing
       FROM latest l
       LEFT JOIN landing_parcel_jurisdiction j
         ON j.county_fips = '48021' AND j.prop_id = l.prop_id
      WHERE l.living_area_sqft > 0 AND j.prop_id IS NULL
      ORDER BY l.prop_id
      LIMIT 20`,
  );
  const will = await q(
    client,
    `SELECT
       (SELECT count(*) FROM cad_property WHERE county_fips='48491' AND prop_id::text ~ '^[0-9]+$' AND improvement_value = 0) AS numeric_cad_imp0,
       (SELECT count(*) FROM cad_property WHERE county_fips='48491' AND prop_id::text ~ '^R[0-9]+$' AND improvement_value = 0) AS r_cad_imp0,
       (SELECT count(*) FROM cad_property WHERE county_fips='48491' AND prop_id::text ~ '^[0-9]+$' AND living_area_sqft > 0) AS numeric_cad_living,
       (SELECT count(*) FROM cad_property WHERE county_fips='48491' AND prop_id::text ~ '^R[0-9]+$' AND living_area_sqft > 0) AS r_cad_living`,
  );
  await client.end();
  writeJson("2026-09-01_parcel_gap_ledger_trace.json", {
    at: new Date().toISOString(),
    bastropLivingSplit: split.rows[0],
    sample20: sample.rows,
    williamsonCadFieldByKeyClass: will.rows[0],
  });
  console.log("trace2 ok", JSON.stringify(split.rows[0]), JSON.stringify(will.rows[0]));
}

async function aoexists() {
  const client = await connect(process.env.PRODUCTION_NEONDB_URL, 30000);
  const r = await q(
    client,
    `SELECT
       EXISTS (SELECT 1 FROM tx_fema_nfhl_flood_zone WHERE fld_zone ILIKE 'AO%' LIMIT 1) AS has_ao,
       EXISTS (SELECT 1 FROM tx_fema_nfhl_flood_zone WHERE fld_zone ILIKE 'AE%' LIMIT 1) AS has_ae,
       EXISTS (SELECT 1 FROM tx_fema_nfhl_flood_zone WHERE zone_subty ILIKE '%FLOODWAY%' LIMIT 1) AS has_floodway_subty`,
  );
  await client.end();
  writeJson("2026-09-01_parcel_gap_ledger_flood_ao.json", { at: new Date().toISOString(), ...r.rows[0], ms: r.ms });
  console.log("aoexists", JSON.stringify(r.rows[0]));
}

const cmd = process.argv[2];
const fn = { factory, prod, flood, flood2, trace, trace2, aoexists }[cmd];
if (!fn) {
  console.error("usage: factory | prod | flood | trace");
  process.exit(2);
}
fn().catch((err) => {
  console.error(cmd, "FAIL", err.code || "", String(err.message).slice(0, 400));
  process.exit(1);
});
