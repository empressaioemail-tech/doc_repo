/**
 * READ-ONLY PARCEL-R1-CROSSWALK instruments.
 * Secrets from env. Never print a URL. Writes JSON only.
 *
 * Usage (from P:/doc_repo):
 *   node _inbox/2026-09-01_parcel-r1-crosswalk_measure.mjs catalog
 *   node _inbox/2026-09-01_parcel-r1-crosswalk_measure.mjs premise
 *   node _inbox/2026-09-01_parcel-r1-crosswalk_measure.mjs link-census
 *   node _inbox/2026-09-01_parcel-r1-crosswalk_measure.mjs fixtures
 *
 * Self-tests (no store):
 *   node _inbox/2026-09-01_parcel-r1-crosswalk_measure.mjs self-test
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("P:/tmp/hauska-factory-parcel-fill/src/jobs/parcel-record-fill.mjs");
const { Client } = require("pg");

const HERE = dirname(fileURLToPath(import.meta.url));

function writeJson(name, obj) {
  writeFileSync(join(HERE, name), JSON.stringify(obj, null, 2) + "\n", "utf8");
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
  await client.query("SET application_name = 'parcel-r1-crosswalk'");
  return client;
}

async function q(client, sql, params = []) {
  const started = Date.now();
  const { rows } = await client.query(sql, params);
  return { ms: Date.now() - started, rows };
}

function latestCad() {
  return `
    SELECT DISTINCT ON (prop_id)
           prop_id::text AS prop_id,
           tax_year,
           owner_name,
           owner_mailing_address,
           situs_address,
           situs_city,
           situs_zip,
           legal_description,
           exemption_codes,
           land_value,
           improvement_value,
           market_value,
           assessed_value,
           year_built,
           living_area_sqft,
           land_acres,
           property_use_code,
           source_file,
           source_vintage
      FROM cad_property
     WHERE county_fips = $1
     ORDER BY prop_id, tax_year DESC`;
}

function scheme(expr) {
  return `
    CASE
      WHEN ${expr} ~ '^R[0-9]+$' THEN 'R-prefix'
      WHEN ${expr} ~ '^[0-9]+$' THEN 'numeric'
      ELSE 'other'
    END`;
}

/** Catalog: columns that exist, not columns we wish existed. */
export async function runCatalog(client) {
  const measuredAt = new Date().toISOString();
  const cadCols = await q(
    client,
    `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'cad_property'
      ORDER BY ordinal_position`,
  );
  const txgioCols = await q(
    client,
    `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'txgio_parcel'
      ORDER BY ordinal_position`,
  );
  const cadHas = Object.fromEntries(cadCols.rows.map((r) => [r.column_name, r.data_type]));
  const namedByDispatch = ["geo_id", "ref_id", "situs_address", "owner_name", "owner_mailing_address"];
  const dispatchNamedPresent = Object.fromEntries(
    namedByDispatch.map((c) => [c, Object.prototype.hasOwnProperty.call(cadHas, c)]),
  );
  const out = {
    measuredAt,
    store: "PRODUCTION_NEONDB_URL / neondb",
    countingRule: "information_schema.columns WHERE table_name IN (cad_property, txgio_parcel) AND table_schema = current_schema()",
    cad_property: cadCols.rows,
    txgio_parcel: txgioCols.rows,
    dispatchNamedPresent,
    cadMs: cadCols.ms,
    txgioMs: txgioCols.ms,
    snapshot: { db: client.database },
  };
  writeJson("2026-09-01_parcel-r1-crosswalk_catalog.json", out);
  return out;
}

export async function runPremise(client) {
  const measuredAt = new Date().toISOString();
  const wilco = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              improvement_value,
              living_area_sqft
         FROM cad_property
        WHERE county_fips = '48491'
        ORDER BY prop_id, tax_year DESC
     )
     SELECT ${scheme("prop_id")} AS scheme,
            count(*)::bigint AS n,
            count(*) FILTER (WHERE improvement_value = 0)::bigint AS improvement_eq_0,
            count(*) FILTER (WHERE living_area_sqft > 0)::bigint AS living_gt_0,
            count(*) FILTER (WHERE improvement_value IS NULL)::bigint AS improvement_null,
            count(*) FILTER (WHERE living_area_sqft IS NULL)::bigint AS living_null
       FROM latest
      GROUP BY 1
      ORDER BY 1`,
  );
  const landingWilco = await q(
    client,
    `SELECT ${scheme("prop_id")} AS scheme, count(*)::bigint AS n
       FROM landing_parcel_jurisdiction
      WHERE county_fips = '48491'
      GROUP BY 1
      ORDER BY 1`,
  );
  const bastrop = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              improvement_value,
              living_area_sqft
         FROM cad_property
        WHERE county_fips = '48021'
        ORDER BY prop_id, tax_year DESC
     ),
     living AS (
       SELECT prop_id FROM latest WHERE living_area_sqft > 0
     ),
     zero AS (
       SELECT prop_id FROM latest WHERE improvement_value = 0
     )
     SELECT
       (SELECT count(*) FROM living) AS living_gt_0,
       (SELECT count(*) FROM living l
         JOIN landing_parcel_jurisdiction j
           ON j.county_fips = '48021' AND j.prop_id = l.prop_id) AS living_in_landing,
       (SELECT count(*) FROM living l
         JOIN txgio_parcel t
           ON t.county_fips = '48021' AND t.prop_id = l.prop_id) AS living_in_txgio,
       (SELECT count(*) FROM zero) AS improvement_eq_0,
       (SELECT count(*) FROM zero z
         JOIN landing_parcel_jurisdiction j
           ON j.county_fips = '48021' AND j.prop_id = z.prop_id) AS zero_in_landing`,
  );
  const out = {
    measuredAt,
    store: "PRODUCTION_NEONDB_URL / neondb",
    countingRule: {
      cadLatest: "DISTINCT ON (prop_id) FROM cad_property ORDER BY prop_id, tax_year DESC",
      scheme: "R-prefix = ^R[0-9]+$; numeric = ^[0-9]+$; else other",
      bastropLiving: "latest living_area_sqft > 0; join landing/txgio on exact prop_id",
      bastropZero: "latest improvement_value = 0; join landing on exact prop_id",
    },
    williamsonCadSchemes: wilco.rows,
    williamsonLandingSchemes: landingWilco.rows,
    bastropOverlap: bastrop.rows[0],
    wilcoMs: wilco.ms,
    landingMs: landingWilco.ms,
    bastropMs: bastrop.ms,
    snapshot: { db: client.database },
  };
  writeJson("2026-09-01_parcel-r1-crosswalk_premise.json", out);
  return out;
}

export async function runStoreProbe(client) {
  const measuredAt = new Date().toISOString();
  const schemes = await q(
    client,
    `SELECT
       CASE
         WHEN prop_id ~ '^R[0-9]+$' THEN 'R-prefix'
         WHEN prop_id ~ '^[0-9]+$' THEN 'numeric'
         ELSE 'other'
       END AS prop_scheme,
       CASE
         WHEN geo_id ~ '^R[0-9]+$' THEN 'R-prefix'
         WHEN geo_id ~ '^[0-9]+$' THEN 'numeric'
         WHEN geo_id IS NULL OR btrim(geo_id) = '' THEN 'empty'
         ELSE 'other'
       END AS geo_scheme,
       count(*)::bigint AS n
       FROM txgio_parcel
      WHERE county_fips = '48491'
      GROUP BY 1, 2
      ORDER BY 1, 2`,
  );
  const samples = await q(
    client,
    `SELECT prop_id, geo_id, left(situs_address, 80) AS situs
       FROM txgio_parcel
      WHERE county_fips = '48491'
      ORDER BY prop_id
      LIMIT 12`,
  );
  const geoHitsNumericCad = await q(
    client,
    `WITH t AS (
       SELECT DISTINCT prop_id, geo_id
         FROM txgio_parcel
        WHERE county_fips = '48491'
          AND geo_id ~ '^[0-9]+$'
     ),
     cad AS (
       SELECT DISTINCT ON (prop_id) prop_id::text AS prop_id
         FROM cad_property
        WHERE county_fips = '48491'
        ORDER BY prop_id, tax_year DESC
     )
     SELECT
       (SELECT count(*) FROM t) AS txgio_numeric_geo,
       (SELECT count(*) FROM t JOIN cad c ON c.prop_id = t.geo_id) AS geo_equals_cad_prop,
       (SELECT count(*) FROM t JOIN cad c ON c.prop_id = t.prop_id) AS prop_equals_cad_prop`,
  );
  const bastrop = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              owner_name,
              nullif(btrim(situs_address), '') AS situs,
              living_area_sqft
         FROM cad_property
        WHERE county_fips = '48021'
        ORDER BY prop_id, tax_year DESC
     ),
     living_out AS (
       SELECT l.*
         FROM latest l
        WHERE l.living_area_sqft > 0
          AND NOT EXISTS (
            SELECT 1 FROM landing_parcel_jurisdiction j
             WHERE j.county_fips = '48021' AND j.prop_id = l.prop_id
          )
     )
     SELECT
       count(*)::bigint AS living_out,
       count(DISTINCT owner_name)::bigint AS distinct_owners,
       count(*) FILTER (WHERE owner_name IS NULL OR btrim(owner_name) = '')::bigint AS owner_blank,
       count(*) FILTER (WHERE situs IS NOT NULL)::bigint AS with_situs,
       count(*) FILTER (
         WHERE situs IS NOT NULL AND EXISTS (
           SELECT 1 FROM landing_parcel_jurisdiction j
           JOIN latest land ON land.prop_id = j.prop_id
            WHERE j.county_fips = '48021'
              AND land.situs = living_out.situs
         )
       )::bigint AS situs_hits_a_landing_cad_row
       FROM living_out`,
  );
  const out = {
    measuredAt,
    store: "PRODUCTION_NEONDB_URL / neondb",
    txgioSchemes: schemes.rows,
    txgioSamples: samples.rows,
    geoVsCad: geoHitsNumericCad.rows[0],
    bastropLivingOut: bastrop.rows[0],
    timings: { schemes: schemes.ms, samples: samples.ms, geo: geoHitsNumericCad.ms, bastrop: bastrop.ms },
    snapshot: { db: client.database },
  };
  writeJson("2026-09-01_parcel-r1-crosswalk_store_probe.json", out);
  return out;
}

export async function runLinkCensus(client) {
  const measuredAt = new Date().toISOString();
  const samples = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              tax_year,
              owner_name,
              owner_mailing_address,
              situs_address,
              situs_city,
              situs_zip,
              left(legal_description, 160) AS legal_head,
              land_value,
              improvement_value,
              market_value,
              living_area_sqft,
              source_file,
              source_vintage
         FROM cad_property
        WHERE county_fips = '48491'
        ORDER BY prop_id, tax_year DESC
     )
     (
       SELECT 'R-prefix' AS scheme, *
         FROM latest
        WHERE prop_id ~ '^R[0-9]+$'
        ORDER BY prop_id
        LIMIT 8
     )
     UNION ALL
     (
       SELECT 'numeric' AS scheme, *
         FROM latest
        WHERE prop_id ~ '^[0-9]+$'
          AND living_area_sqft > 0
        ORDER BY prop_id
        LIMIT 8
     )`,
  );

  const situsLink = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              nullif(btrim(situs_address), '') AS situs,
              living_area_sqft,
              improvement_value
         FROM cad_property
        WHERE county_fips = '48491'
        ORDER BY prop_id, tax_year DESC
     ),
     r AS (
       SELECT prop_id, situs FROM latest WHERE prop_id ~ '^R[0-9]+$' AND situs IS NOT NULL
     ),
     n AS (
       SELECT prop_id, situs, living_area_sqft, improvement_value
         FROM latest WHERE prop_id ~ '^[0-9]+$' AND situs IS NOT NULL
     )
     SELECT
       (SELECT count(*) FROM r) AS r_with_situs,
       (SELECT count(*) FROM n) AS n_with_situs,
       (SELECT count(*) FROM (
          SELECT r.situs FROM r JOIN n ON n.situs = r.situs GROUP BY r.situs
        ) s) AS shared_situs_values,
       (SELECT count(*) FROM r WHERE EXISTS (SELECT 1 FROM n WHERE n.situs = r.situs)) AS r_with_numeric_situs_hit,
       (SELECT count(*) FROM n WHERE EXISTS (SELECT 1 FROM r WHERE r.situs = n.situs)) AS n_with_r_situs_hit,
       (SELECT count(*) FROM (
          SELECT r.situs FROM r JOIN n ON n.situs = r.situs GROUP BY r.situs HAVING count(DISTINCT r.prop_id) = 1 AND count(DISTINCT n.prop_id) = 1
        ) u) AS unique_1to1_situs`,
  );

  const ownerLink = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              nullif(btrim(owner_name), '') AS owner
         FROM cad_property
        WHERE county_fips = '48491'
        ORDER BY prop_id, tax_year DESC
     ),
     r AS (SELECT prop_id, owner FROM latest WHERE prop_id ~ '^R[0-9]+$' AND owner IS NOT NULL),
     n AS (SELECT prop_id, owner FROM latest WHERE prop_id ~ '^[0-9]+$' AND owner IS NOT NULL)
     SELECT
       (SELECT count(*) FROM r) AS r_with_owner,
       (SELECT count(*) FROM n) AS n_with_owner,
       (SELECT count(*) FROM r WHERE EXISTS (SELECT 1 FROM n WHERE n.owner = r.owner)) AS r_with_numeric_owner_hit`,
  );

  const legalLink = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              nullif(btrim(legal_description), '') AS legal
         FROM cad_property
        WHERE county_fips = '48491'
        ORDER BY prop_id, tax_year DESC
     ),
     r AS (SELECT prop_id, legal FROM latest WHERE prop_id ~ '^R[0-9]+$' AND legal IS NOT NULL),
     n AS (SELECT prop_id, legal FROM latest WHERE prop_id ~ '^[0-9]+$' AND legal IS NOT NULL)
     SELECT
       (SELECT count(*) FROM r) AS r_with_legal,
       (SELECT count(*) FROM n) AS n_with_legal,
       (SELECT count(*) FROM r WHERE EXISTS (SELECT 1 FROM n WHERE n.legal = r.legal)) AS r_with_numeric_legal_hit,
       (SELECT count(*) FROM (
          SELECT r.legal FROM r JOIN n ON n.legal = r.legal GROUP BY r.legal HAVING count(DISTINCT r.prop_id) = 1 AND count(DISTINCT n.prop_id) = 1
        ) u) AS unique_1to1_legal`,
  );

  const mailingLink = await q(
    client,
    `WITH latest AS (
       SELECT DISTINCT ON (prop_id)
              prop_id::text AS prop_id,
              nullif(btrim(owner_mailing_address), '') AS mail
         FROM cad_property
        WHERE county_fips = '48491'
        ORDER BY prop_id, tax_year DESC
     ),
     r AS (SELECT prop_id, mail FROM latest WHERE prop_id ~ '^R[0-9]+$' AND mail IS NOT NULL),
     n AS (SELECT prop_id, mail FROM latest WHERE prop_id ~ '^[0-9]+$' AND mail IS NOT NULL)
     SELECT
       (SELECT count(*) FROM r) AS r_with_mail,
       (SELECT count(*) FROM n) AS n_with_mail,
       (SELECT count(*) FROM r WHERE EXISTS (SELECT 1 FROM n WHERE n.mail = r.mail)) AS r_with_numeric_mail_hit`,
  );

  const txgioGeo = await q(
    client,
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'txgio_parcel'
        AND column_name IN ('geo_id','ref_id','prop_id','situs','situs_address')
      ORDER BY 1`,
  );

  const out = {
    measuredAt,
    store: "PRODUCTION_NEONDB_URL / neondb",
    samples: samples.rows,
    situs: situsLink.rows[0],
    owner: ownerLink.rows[0],
    legal: legalLink.rows[0],
    mailing: mailingLink.rows[0],
    txgioLinkColumnsPresent: txgioGeo.rows.map((r) => r.column_name),
    timings: {
      samples: samples.ms,
      situs: situsLink.ms,
      owner: ownerLink.ms,
      legal: legalLink.ms,
      mailing: mailingLink.ms,
    },
    snapshot: { db: client.database },
  };
  writeJson("2026-09-01_parcel-r1-crosswalk_link.json", out);
  return out;
}

/** Normalize situs for a second-derivation compare. Presence-shaped empty stays empty. */
export function normalizeSitus(s) {
  if (s == null) return null;
  const t = String(s).trim().toUpperCase().replace(/\s+/g, " ");
  return t.length ? t : null;
}

/**
 * Pair rule: exact situs equality after normalize, 1:1 on that situs,
 * plus geometry agreement when a landing/txgio feature exists for the R-key.
 * Prefix-strip is never a pair rule.
 */
export function pairFromSitus(rRows, nRows) {
  const rBySitus = new Map();
  for (const r of rRows) {
    const s = normalizeSitus(r.situs);
    if (!s) continue;
    if (!rBySitus.has(s)) rBySitus.set(s, []);
    rBySitus.get(s).push(r);
  }
  const nBySitus = new Map();
  for (const n of nRows) {
    const s = normalizeSitus(n.situs);
    if (!s) continue;
    if (!nBySitus.has(s)) nBySitus.set(s, []);
    nBySitus.get(s).push(n);
  }
  const pairs = [];
  const ambiguous = [];
  const rOnly = [];
  for (const [situs, rs] of rBySitus) {
    const ns = nBySitus.get(situs) ?? [];
    if (rs.length === 1 && ns.length === 1) {
      pairs.push({ situs, rPropId: rs[0].prop_id, nPropId: ns[0].prop_id, r: rs[0], n: ns[0] });
    } else if (ns.length > 0) {
      ambiguous.push({ situs, rCount: rs.length, nCount: ns.length });
    } else {
      rOnly.push({ situs, rCount: rs.length });
    }
  }
  return { pairs, ambiguous, rOnly, rSitus: rBySitus.size, nSitus: nBySitus.size };
}

function streetToken(situs) {
  const n = normalizeSitus(situs);
  if (!n) return null;
  const stripped = n.replace(/,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?$/, "").replace(/,\s*TX\b.*$/, "");
  const m = stripped.match(/^(\d+\S*)\s+(.+?)(?:\s+\d{5})?$/);
  if (!m) return stripped;
  return `${m[1]} ${m[2].replace(/\s+(DR|LN|AVE|ST|RD|CV|CT|CIR|BLVD|HWY|PKWY|TRL|WAY|PL|LOOP)\b.*$/i, " $1")}`.replace(/\s+/g, " ");
}

export async function runFixtures(client) {
  const measuredAt = new Date().toISOString();
  const rawText = readFileSync(join(HERE, "2026-09-01_parcel-r1-crosswalk_wcad_sample.json"), "utf8").replace(/^\uFEFF/, "");
  const raw = JSON.parse(rawText);
  const features = raw.features ?? [];
  const rIds = [...new Set(features.map((f) => String(f.PARCELID)))];
  const nIds = [...new Set(features.map((f) => String(f.PropertyID)))];
  const cad = await q(
    client,
    `SELECT DISTINCT ON (prop_id)
            prop_id::text AS prop_id,
            situs_address,
            living_area_sqft,
            improvement_value,
            market_value
       FROM cad_property
      WHERE county_fips = '48491'
        AND prop_id::text = ANY($1)
      ORDER BY prop_id, tax_year DESC`,
    [[...rIds, ...nIds]],
  );
  const landing = await q(
    client,
    `SELECT prop_id, disposition
       FROM landing_parcel_jurisdiction
      WHERE county_fips = '48491'
        AND prop_id = ANY($1)`,
    [rIds],
  );
  const txgio = await q(
    client,
    `SELECT prop_id, geo_id, situs_address,
            (geom IS NOT NULL OR geometry IS NOT NULL) AS has_geometry
       FROM txgio_parcel
      WHERE county_fips = '48491'
        AND prop_id = ANY($1)`,
    [rIds],
  );
  const cadBy = Object.fromEntries(cad.rows.map((r) => [r.prop_id, r]));
  const landBy = Object.fromEntries(landing.rows.map((r) => [r.prop_id, r]));
  const txgioBy = Object.fromEntries(txgio.rows.map((r) => [r.prop_id, r]));

  const pairs = [];
  let rInCad = 0;
  let nInCad = 0;
  let rInLanding = 0;
  let rInTxgio = 0;
  let situsAgree = 0;
  let streetAgree = 0;
  let geomAgree = 0;
  let secondDerivation = 0;
  for (const f of features) {
    const rId = String(f.PARCELID);
    const nId = String(f.PropertyID);
    const rCad = cadBy[rId];
    const nCad = cadBy[nId];
    if (rCad) rInCad += 1;
    if (nCad) nInCad += 1;
    const land = landBy[rId];
    const tg = txgioBy[rId];
    if (land) rInLanding += 1;
    if (tg) rInTxgio += 1;
    const rSitus = normalizeSitus(rCad?.situs_address);
    const nSitus = normalizeSitus(nCad?.situs_address);
    const wSitus = normalizeSitus(f.SitusAddress);
    const exactSitus = Boolean(rSitus && nSitus && rSitus === nSitus);
    const street = Boolean(
      streetToken(rCad?.situs_address) &&
        streetToken(nCad?.situs_address) &&
        streetToken(rCad?.situs_address) === streetToken(nCad?.situs_address),
    );
    const geom = Boolean(tg?.has_geometry) && Boolean(land);
    if (exactSitus) situsAgree += 1;
    if (street) streetAgree += 1;
    if (geom) geomAgree += 1;
    const second = (exactSitus || street) && geom;
    if (second) secondDerivation += 1;
    pairs.push({
      rPropId: rId,
      nPropId: nId,
      wcadSitus: f.SitusAddress,
      wcadLiving: f.TotalSqFtLivingArea,
      wcadImp: f.TotalImpMktValue,
      rCadPresent: Boolean(rCad),
      nCadPresent: Boolean(nCad),
      rCadSitus: rCad?.situs_address ?? null,
      nCadSitus: nCad?.situs_address ?? null,
      nCadLiving: nCad?.living_area_sqft ?? null,
      nCadImp: nCad?.improvement_value ?? null,
      rCadLiving: rCad?.living_area_sqft ?? null,
      rCadImp: rCad?.improvement_value ?? null,
      landingDisposition: land?.disposition ?? null,
      txgioGeoId: tg?.geo_id ?? null,
      txgioHasGeometry: Boolean(tg?.has_geometry),
      exactSitus,
      streetAgree: street,
      geometryAgree: geom,
      secondDerivation: second,
      prefixStripWouldPair: rId.replace(/^R0*/, "") === nId,
    });
  }
  const prefixStripTrue = pairs.filter((p) => p.prefixStripWouldPair).length;
  const out = {
    measuredAt,
    store: "PRODUCTION_NEONDB_URL / neondb",
    wcadSource: raw.source,
    wcadFetchedAt: raw.fetchedAt,
    countingRule: {
      fixtureUniverse: "WCAD features with TotalSqFtLivingArea>0 AND PARCELID LIKE 'R%' AND PropertyID IS NOT NULL, first 80 by server order",
      cadLookup: "cad_property 48491 DISTINCT ON prop_id latest tax_year, exact string on PARCELID and PropertyID",
      secondDerivation: "situs exact or street-token equal AND landing row present AND txgio geometry present on the R-key",
      prefixStripFalsifier: "R-key with leading R and zeros stripped equals PropertyID",
    },
    n: pairs.length,
    rInCad,
    nInCad,
    rInLanding,
    rInTxgio,
    situsAgree,
    streetAgree,
    geomAgree,
    secondDerivation,
    prefixStripTrue,
    pairs,
    timings: { cad: cad.ms, landing: landing.ms, txgio: txgio.ms },
    snapshot: { db: client.database },
  };
  writeJson("2026-09-01_parcel-r1-crosswalk_fixtures.json", out);
  return out;
}

function selfTest() {
  const cases = [];
  const a = pairFromSitus(
    [{ prop_id: "R000001", situs: "100 MAIN ST" }],
    [{ prop_id: "123", situs: "100 Main St" }],
  );
  cases.push({ name: "1to1-case-insensitive", pass: a.pairs.length === 1 && a.pairs[0].nPropId === "123" });

  const strip = pairFromSitus(
    [{ prop_id: "R000123", situs: "1 OAK" }],
    [{ prop_id: "123", situs: "9 PINE" }],
  );
  cases.push({ name: "prefix-strip-is-not-a-pair", pass: strip.pairs.length === 0 });

  const amb = pairFromSitus(
    [
      { prop_id: "R1", situs: "1 OAK" },
      { prop_id: "R2", situs: "1 OAK" },
    ],
    [{ prop_id: "9", situs: "1 OAK" }],
  );
  cases.push({ name: "ambiguous-situs-refused", pass: amb.pairs.length === 0 && amb.ambiguous.length === 1 });

  const empty = pairFromSitus([{ prop_id: "R1", situs: "   " }], [{ prop_id: "9", situs: "   " }]);
  cases.push({ name: "blank-situs-not-a-key", pass: empty.pairs.length === 0 });

  const vacuous = pairFromSitus([], []);
  cases.push({ name: "not-vacuous-empty-is-zero", pass: vacuous.pairs.length === 0 });

  const failed = cases.filter((c) => !c.pass);
  const out = { ok: failed.length === 0, cases, failed: failed.map((c) => c.name) };
  if (!out.ok) {
    console.error(JSON.stringify(out, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ selfTest: "pass", cases: cases.map((c) => c.name) }));
  }
  return out;
}

async function main() {
  const cmd = process.argv[2];
  if (cmd === "self-test") {
    selfTest();
    return;
  }
  const url = process.env.PRODUCTION_NEONDB_URL;
  const client = await connect(url, 180000);
  try {
    if (cmd === "catalog") await runCatalog(client);
    else if (cmd === "premise") await runPremise(client);
    else if (cmd === "store-probe") await runStoreProbe(client);
    else if (cmd === "link-census") await runLinkCensus(client);
    else if (cmd === "fixtures") await runFixtures(client);
    else {
      console.error("usage: catalog | premise | link-census | fixtures | self-test");
      process.exitCode = 2;
    }
  } finally {
    await client.end();
  }
}

const isMain = process.argv[1] && process.argv[1].replaceAll("\\", "/").endsWith("2026-09-01_parcel-r1-crosswalk_measure.mjs");
if (isMain) {
  main().catch((err) => {
    console.error(String(err && err.message ? err.message : err));
    process.exitCode = 1;
  });
}
