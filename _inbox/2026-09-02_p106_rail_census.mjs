/**
 * P-106 item 1 — READ-ONLY per-rail per-county census of the BAKE, the
 * jurisdiction landing table, and the two atom families the serve path reads.
 *
 * Why this file exists rather than a shell one-liner: ENFORCEMENT.md, "the
 * instrument that produced a claim is part of the claim". Every predicate here
 * is exercised by `selftest` against inline fixtures in BOTH directions before
 * any live number is trusted, including an explicit not-vacuous case.
 *
 * Snapshot discipline: every output row carries the store, the database, the
 * measured_at instant, and the exact predicate name. Sentinels count as
 * UNMEASURED, never as present.
 *
 * Read-only is enforced, not promised: every session runs
 * `SET default_transaction_read_only = on`, and `selftest` proves that a write
 * is refused before any measurement runs.
 *
 * Usage (from P:/doc_repo):
 *   node _inbox/2026-09-02_p106_rail_census.mjs selftest
 *   node _inbox/2026-09-02_p106_rail_census.mjs bake      [fips...]
 *   node _inbox/2026-09-02_p106_rail_census.mjs juris     [fips...]
 *   node _inbox/2026-09-02_p106_rail_census.mjs atoms     [fips...]
 *   node _inbox/2026-09-02_p106_rail_census.mjs zoningdiv [fips...]
 *
 * Env: P106_DEPLOYMENT_URL (neondb, DIRECT endpoint)
 *      P106_ATOMS_URL      (hauska_mcp, DIRECT endpoint)
 * Never printed. Never written to an output file.
 */
import { appendFileSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(
  "P:/tmp/hauska-factory-parcel-fill/src/jobs/parcel-record-fill.mjs",
);
const { Client } = require("pg");

const HERE = dirname(fileURLToPath(import.meta.url));
const FIPS = ["48021", "48055", "48209", "48309", "48453", "48491"];
const COUNTY_NAME = {
  48021: "Bastrop",
  48055: "Caldwell",
  48209: "Hays",
  48309: "McLennan",
  48453: "Travis",
  48491: "Williamson",
};

/* ------------------------------------------------------------------ */
/* The predicates. One SQL text per rail, named, reused by selftest.    */
/* ------------------------------------------------------------------ */

/**
 * Sentinel rule for situs, transcribed from
 * artifacts/api-server/src/lib/situsCompose.ts PUNCTUATION_ONLY_RE
 * (/^[\s,.\-;:'"`]+$/, read 2026-09-02 at LDT 91e9086d). A value that is
 * punctuation-only is NOT a situs; the serve path labels it unknown.
 */
const SITUS_REAL_SQL = `
  (p->'baseFacts'->>'situsAddress') is not null
  and btrim(p->'baseFacts'->>'situsAddress') <> ''
  and btrim(p->'baseFacts'->>'situsAddress') !~ '^[[:space:],.;:''"\`-]+$'
`;

/** The naive test the card says overstates coverage. Kept so the gap is measured, not asserted. */
const SITUS_NAIVE_SQL = `(p->'baseFacts'->>'situsAddress') is not null`;

/**
 * zoningDisposition, transcribed from r1BriefCompose.ts: a non-empty string,
 * or an object carrying a non-empty district / zone / code / zoningCode.
 */
const ZONING_PRESENT_SQL = `
  (
    (jsonb_typeof(p->'zoning') = 'string' and btrim(p->>'zoning') <> '')
    or (
      jsonb_typeof(p->'zoning') = 'object'
      and (
        coalesce(btrim(p->'zoning'->>'district'), '') <> ''
        or coalesce(btrim(p->'zoning'->>'zone'), '') <> ''
        or coalesce(btrim(p->'zoning'->>'code'), '') <> ''
        or coalesce(btrim(p->'zoning'->>'zoningCode'), '') <> ''
      )
    )
  )
`;

/** landUseDisposition, transcribed from r1BriefCompose.ts: code or landUseCode. */
const LANDUSE_PRESENT_SQL = `
  (
    (jsonb_typeof(p->'baseFacts'->'landUse') = 'string' and btrim(p->'baseFacts'->>'landUse') <> '')
    or (
      jsonb_typeof(p->'baseFacts'->'landUse') = 'object'
      and (
        coalesce(btrim(p->'baseFacts'->'landUse'->>'code'), '') <> ''
        or coalesce(btrim(p->'baseFacts'->'landUse'->>'landUseCode'), '') <> ''
      )
    )
  )
`;

const ACREAGE_PRESENT_SQL = `
  jsonb_typeof(p->'baseFacts'->'acreage'->'value') = 'number'
  and (p->'baseFacts'->'acreage'->>'value')::numeric > 0
`;

const numberRail = (path) => `jsonb_typeof(${path}) = 'number'`;

const BAKE_RAILS = [
  ["acreage", ACREAGE_PRESENT_SQL],
  ["zoningDistrict", ZONING_PRESENT_SQL],
  ["landUse", LANDUSE_PRESENT_SQL],
  ["yearBuilt", numberRail("p->'baseFacts'->'yearBuilt'")],
  ["marketValue", numberRail("p->'baseFacts'->'cadRoll'->'marketValue'")],
  ["landValue", numberRail("p->'baseFacts'->'cadRoll'->'landValue'")],
  ["improvementValue", numberRail("p->'baseFacts'->'cadRoll'->'improvementValue'")],
  ["livingAreaSqft", numberRail("p->'baseFacts'->'cadRoll'->'livingAreaSqft'")],
  ["situs_real", SITUS_REAL_SQL],
  ["situs_naive_nonnull", SITUS_NAIVE_SQL],
];

/** Declared refusal on the bake, distinct from never-measured. */
const LANDUSE_GATE_BLOCKED_SQL = `(p->'provenance'->>'landUseGateBlocked') = 'true'`;

/* ------------------------------------------------------------------ */
/* Plumbing                                                            */
/* ------------------------------------------------------------------ */

function outPath(name) {
  return join(HERE, name);
}

function writeJson(name, obj) {
  writeFileSync(outPath(name), JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function progress(line) {
  const stamped = `${new Date().toISOString()} ${line}\n`;
  process.stdout.write(stamped);
  appendFileSync(outPath("2026-09-02_p106_rail_census_progress.log"), stamped, "utf8");
}

async function connect(url, label, timeoutMs) {
  if (!url) throw new Error(`URL_REQUIRED:${label}`);
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: true },
    statement_timeout: timeoutMs,
  });
  await client.connect();
  await client.query("SET default_transaction_read_only = on");
  return client;
}

function snapshotOf(client) {
  return {
    database: client.database,
    host: String(client.host || "").replace(/^ep-[^.]+/, "ep-***"),
    readOnly: true,
  };
}

/* ------------------------------------------------------------------ */
/* selftest — every predicate exercised in BOTH directions             */
/* ------------------------------------------------------------------ */

/**
 * Fixture rows. Each carries an id, a payload, and the expected verdict per
 * rail. The fixtures are literal jsonb in a VALUES list, so this runs on the
 * live connection with zero DDL and zero writes.
 */
const FIXTURES = [
  {
    id: "f1_full",
    payload: {
      zoning: { district: "SF-1" },
      baseFacts: {
        acreage: { value: 5.7853 },
        landUse: { code: "A1" },
        yearBuilt: 1998,
        cadRoll: { marketValue: 250000, landValue: 90000, improvementValue: 160000, livingAreaSqft: 1800 },
        situsAddress: "123 PINE ST",
      },
      provenance: { landUseGateBlocked: false },
    },
    expect: {
      acreage: 1, zoningDistrict: 1, landUse: 1, yearBuilt: 1,
      marketValue: 1, landValue: 1, improvementValue: 1, livingAreaSqft: 1,
      situs_real: 1, situs_naive_nonnull: 1, landUseGateBlocked: 0,
    },
  },
  {
    id: "f2_live_sentinel",
    // The live 48021:25420 defect verbatim: situs present to a non-null test,
    // and not a situs.
    payload: {
      zoning: null,
      baseFacts: {
        acreage: { value: 5.7853 },
        landUse: null,
        yearBuilt: null,
        cadRoll: { marketValue: null, landValue: null, improvementValue: null, livingAreaSqft: null },
        situsAddress: ", ,",
      },
      provenance: { landUseGateBlocked: false },
    },
    expect: {
      acreage: 1, zoningDistrict: 0, landUse: 0, yearBuilt: 0,
      marketValue: 0, landValue: 0, improvementValue: 0, livingAreaSqft: 0,
      situs_real: 0, situs_naive_nonnull: 1, landUseGateBlocked: 0,
    },
  },
  {
    id: "f3_empty_records",
    // Objects that carry metadata but no determination. zoningDisposition and
    // landUseDisposition both call these absent.
    payload: {
      zoning: { provenance: { cityKey: "x" } },
      baseFacts: {
        acreage: { value: 0 },
        landUse: { description: "Residential", source: "cad" },
        situsAddress: "   ",
        cadRoll: {},
      },
      provenance: { landUseGateBlocked: true },
    },
    expect: {
      acreage: 0, zoningDistrict: 0, landUse: 0, yearBuilt: 0,
      marketValue: 0, landValue: 0, improvementValue: 0, livingAreaSqft: 0,
      situs_real: 0, situs_naive_nonnull: 1, landUseGateBlocked: 1,
    },
  },
  {
    id: "f4_string_forms",
    // The string branch of both dispositions, plus a zero-value dollar rail
    // that is a real measured zero and must NOT be collapsed into absent.
    payload: {
      zoning: "SF-1",
      baseFacts: {
        acreage: { value: 0.25 },
        landUse: "A1",
        yearBuilt: 0,
        cadRoll: { marketValue: 0, landValue: 0, improvementValue: 0, livingAreaSqft: 0 },
        situsAddress: "77 A ST",
      },
    },
    expect: {
      acreage: 1, zoningDistrict: 1, landUse: 1, yearBuilt: 1,
      marketValue: 1, landValue: 1, improvementValue: 1, livingAreaSqft: 1,
      situs_real: 1, situs_naive_nonnull: 1, landUseGateBlocked: 0,
    },
  },
  {
    id: "f5_absent_everything",
    payload: { baseFacts: {} },
    expect: {
      acreage: 0, zoningDistrict: 0, landUse: 0, yearBuilt: 0,
      marketValue: 0, landValue: 0, improvementValue: 0, livingAreaSqft: 0,
      situs_real: 0, situs_naive_nonnull: 0, landUseGateBlocked: 0,
    },
  },
];

const SELFTEST_RAILS = [...BAKE_RAILS, ["landUseGateBlocked", LANDUSE_GATE_BLOCKED_SQL]];

async function selftest() {
  const failures = [];
  const notes = [];
  const dep = await connect(process.env.P106_DEPLOYMENT_URL, "deployment", 60_000);

  // 0. Prove read-only is armed rather than asserted.
  let writeRefused = null;
  try {
    await dep.query(
      "create table p106_selftest_should_never_exist (x int)",
    );
    writeRefused = "NOT REFUSED — a DDL succeeded on a read-only session";
  } catch (err) {
    writeRefused = String(err.message).trim();
  }
  if (!/read-only/i.test(writeRefused)) {
    failures.push({ check: "read_only_armed", got: writeRefused });
  }
  notes.push({ check: "read_only_armed", verbatim: writeRefused });

  // 1. Every rail predicate, per fixture, both directions.
  const values = FIXTURES.map((f, i) => `($${i * 2 + 1}::text, $${i * 2 + 2}::jsonb)`).join(",");
  const params = FIXTURES.flatMap((f) => [f.id, JSON.stringify(f.payload)]);
  const selects = SELFTEST_RAILS.map(
    ([name, sql]) => `(case when ${sql} then 1 else 0 end) as "${name}"`,
  ).join(",\n ");
  const sql = `with fx(id, p) as (values ${values})\nselect id,\n ${selects}\nfrom fx order by id`;
  const { rows } = await dep.query(sql, params);
  for (const fixture of FIXTURES) {
    const row = rows.find((r) => r.id === fixture.id);
    if (!row) {
      failures.push({ check: `fixture_missing:${fixture.id}` });
      continue;
    }
    for (const [rail, expected] of Object.entries(fixture.expect)) {
      const got = Number(row[rail]);
      if (got !== expected) {
        failures.push({ check: `${fixture.id}.${rail}`, expected, got });
      }
    }
  }

  // 2. NOT-VACUOUS. Each rail must produce BOTH a 1 and a 0 across the
  //    fixture set. A predicate that only ever fires, or never fires, is
  //    indistinguishable from a constant and is not a check.
  for (const [rail] of SELFTEST_RAILS) {
    const vals = rows.map((r) => Number(r[rail]));
    if (!vals.includes(1)) failures.push({ check: `not_vacuous:${rail}`, problem: "never fires" });
    if (!vals.includes(0)) failures.push({ check: `not_vacuous:${rail}`, problem: "always fires" });
  }

  // 3. The sentinel gap is REAL, not asserted: the naive predicate must
  //    over-count relative to the sentinel-aware one on this fixture set.
  const naive = rows.reduce((n, r) => n + Number(r.situs_naive_nonnull), 0);
  const real = rows.reduce((n, r) => n + Number(r.situs_real), 0);
  if (!(naive > real)) {
    failures.push({ check: "sentinel_gap_measurable", naive, real });
  }
  notes.push({ check: "sentinel_gap_measurable", naive, real });

  await dep.end();

  const result = {
    at: new Date().toISOString(),
    instrument: "_inbox/2026-09-02_p106_rail_census.mjs",
    fixtures: FIXTURES.length,
    rails: SELFTEST_RAILS.map(([n]) => n),
    notes,
    failures,
    verdict: failures.length === 0 ? "PASS" : "FAIL",
  };
  writeJson("2026-09-02_p106_rail_census_selftest.json", result);
  progress(`selftest ${result.verdict} (${failures.length} failures)`);
  if (failures.length) {
    process.stdout.write(JSON.stringify(failures, null, 2) + "\n");
    process.exitCode = 1;
  }
}

/* ------------------------------------------------------------------ */
/* bake — per-county tier1 census                                       */
/* ------------------------------------------------------------------ */

async function bake(counties) {
  const dep = await connect(process.env.P106_DEPLOYMENT_URL, "deployment", 45 * 60_000);
  const out = {
    at: new Date().toISOString(),
    store: "P106_DEPLOYMENT_URL",
    snapshot: snapshotOf(dep),
    adapterKey: "node-facets:tier1",
    denominatorRule:
      "one row per place_key under adapter_key node-facets:tier1 whose place_key is node:<fips>:<propId>; this is the set a projection over the bake could cover",
    predicateSource:
      "transcribed from artifacts/api-server/src/lib/r1BriefCompose.ts and situsCompose.ts at LDT 91e9086d, read 2026-09-02",
    counties: [],
  };
  const prior = outPath("2026-09-02_p106_rail_census_bake.json");
  if (existsSync(prior)) {
    try {
      out.counties = JSON.parse(readFileSync(prior, "utf8")).counties ?? [];
    } catch {
      out.counties = [];
    }
  }
  for (const fips of counties) {
    if (out.counties.some((c) => c.countyFips === fips)) {
      progress(`bake ${fips} already measured, skipping`);
      continue;
    }
    const started = Date.now();
    progress(`bake ${fips} (${COUNTY_NAME[fips]}) START — heavy index range scan on place_layer_snapshots`);
    const selects = [
      ...BAKE_RAILS,
      ["landUseGateBlocked", LANDUSE_GATE_BLOCKED_SQL],
    ]
      .map(([name, sql]) => `count(*) filter (where ${sql}) as "${name}"`)
      .join(",\n ");
    const { rows } = await dep.query(
      `with s as (
         select payload_json p
           from place_layer_snapshots
          where adapter_key = 'node-facets:tier1'
            and place_key like $1
       )
       select count(*) as parcels,\n ${selects}\n from s`,
      [`node:${fips}:%`],
    );
    const row = rows[0];
    out.counties.push({
      countyFips: fips,
      countyName: COUNTY_NAME[fips],
      measuredAt: new Date().toISOString(),
      ms: Date.now() - started,
      ...Object.fromEntries(Object.entries(row).map(([k, v]) => [k, Number(v)])),
    });
    writeJson("2026-09-02_p106_rail_census_bake.json", out);
    progress(`bake ${fips} DONE in ${Math.round((Date.now() - started) / 1000)}s parcels=${row.parcels}`);
  }
  await dep.end();
}

/* ------------------------------------------------------------------ */
/* juris — city limits, and whether it can even join to the bake        */
/* ------------------------------------------------------------------ */

async function juris(counties) {
  const dep = await connect(process.env.P106_DEPLOYMENT_URL, "deployment", 45 * 60_000);
  const out = {
    at: new Date().toISOString(),
    store: "P106_DEPLOYMENT_URL",
    snapshot: snapshotOf(dep),
    note:
      "landing_parcel_jurisdiction is keyed (county_fips, prop_id). The bake key is place_key node:<fips>:<propId>. joinable counts the bake parcels for which a jurisdiction row EXISTS on that exact prop_id; a county whose landing prop_id grammar differs from the bake grammar shows joinable=0 and that is a blocker, not a coverage number.",
    counties: [],
  };
  for (const fips of counties) {
    const started = Date.now();
    progress(`juris ${fips} START`);
    const { rows } = await dep.query(
      `with s as (
         select split_part(place_key, ':', 3) as prop_id
           from place_layer_snapshots
          where adapter_key = 'node-facets:tier1'
            and place_key like $1
       )
       select count(*) as bake_parcels,
              count(j.prop_id) as joinable,
              count(*) filter (where j.disposition = 'in-city') as in_city,
              count(*) filter (where j.disposition = 'unincorporated') as unincorporated,
              count(*) filter (where j.disposition = 'unresolved') as unresolved
         from s
         left join landing_parcel_jurisdiction j
           on j.county_fips = $2 and j.prop_id = s.prop_id`,
      [`node:${fips}:%`, fips],
    );
    out.counties.push({
      countyFips: fips,
      countyName: COUNTY_NAME[fips],
      measuredAt: new Date().toISOString(),
      ms: Date.now() - started,
      ...Object.fromEntries(Object.entries(rows[0]).map(([k, v]) => [k, Number(v)])),
    });
    writeJson("2026-09-02_p106_rail_census_juris.json", out);
    progress(`juris ${fips} DONE in ${Math.round((Date.now() - started) / 1000)}s`);
  }
  await dep.end();
}

/* ------------------------------------------------------------------ */
/* zoningdiv — the zoning rail's EVALUABLE share once the jurisdiction   */
/* table is joined, and the exact size of the divergence against         */
/* get_smart_site's single-input `unknown`.                              */
/* ------------------------------------------------------------------ */

async function zoningdiv(counties) {
  const dep = await connect(process.env.P106_DEPLOYMENT_URL, "deployment", 45 * 60_000);
  const out = {
    at: new Date().toISOString(),
    store: "P106_DEPLOYMENT_URL",
    snapshot: snapshotOf(dep),
    note:
      "zoning_present = the bake carries a district. zoning_absent_verified = the bake carries NO district AND landing_parcel_jurisdiction says unincorporated, which is a POSITIVE determination (unincorporated Texas land carries no municipal zoning) and needs both inputs. zoning_unknown = everything else. The serve path (r1BriefCompose zoningDisposition -> smartSiteStub) reads ONE input and therefore reports `unknown` for every row in the absent_verified column: that count IS the divergence between the projection and get_smart_site.",
    counties: [],
  };
  for (const fips of counties) {
    const started = Date.now();
    progress(`zoningdiv ${fips} START`);
    const { rows } = await dep.query(
      `with s as (
         select split_part(place_key, ':', 3) as prop_id, payload_json p
           from place_layer_snapshots
          where adapter_key = 'node-facets:tier1'
            and place_key like $1
       )
       select count(*) as parcels,
              count(*) filter (where ${ZONING_PRESENT_SQL}) as zoning_present,
              count(*) filter (
                where not (${ZONING_PRESENT_SQL}) and j.disposition = 'unincorporated'
              ) as zoning_absent_verified,
              count(*) filter (
                where not (${ZONING_PRESENT_SQL})
                  and (j.disposition is null or j.disposition <> 'unincorporated')
              ) as zoning_unknown
         from s
         left join landing_parcel_jurisdiction j
           on j.county_fips = $2 and j.prop_id = s.prop_id`,
      [`node:${fips}:%`, fips],
    );
    const row = rows[0];
    const parcels = Number(row.parcels);
    out.counties.push({
      countyFips: fips,
      countyName: COUNTY_NAME[fips],
      measuredAt: new Date().toISOString(),
      ms: Date.now() - started,
      parcels,
      zoningPresent: Number(row.zoning_present),
      zoningAbsentVerified: Number(row.zoning_absent_verified),
      zoningUnknown: Number(row.zoning_unknown),
      evaluablePct: Number(
        (((Number(row.zoning_present) + Number(row.zoning_absent_verified)) / parcels) * 100).toFixed(1),
      ),
      divergenceVsGetSmartSite: Number(row.zoning_absent_verified),
    });
    writeJson("2026-09-02_p106_rail_census_zoningdiv.json", out);
    progress(`zoningdiv ${fips} DONE in ${Math.round((Date.now() - started) / 1000)}s`);
  }
  await dep.end();
}

/* ------------------------------------------------------------------ */
/* atoms — flood and special district, the two rails the serve path      */
/* reads from hauska_mcp rather than from the bake                       */
/* ------------------------------------------------------------------ */

async function atoms(counties) {
  const at = await connect(process.env.P106_ATOMS_URL, "atoms", 30 * 60_000);
  const out = {
    at: new Date().toISOString(),
    store: "P106_ATOMS_URL",
    snapshot: snapshotOf(at),
    note:
      "Counted by entity_id prefix on atoms_entity_composite_unique (index-only range scan; database collation is C.UTF-8 so a prefix LIKE is a range). Dual grammar per floodHazardFactRead: an atom may be stored at <fips>:<prop> or <fips>:<prop>.00000000; distinct_parcels strips the padded suffix so one parcel is counted once.",
    predicateSource:
      "transcribed from artifacts/api-server/src/lib/floodHazardFactRead.ts interpretBody and specialDistrictFactRead.ts isSpecialDistrictAbsenceSuffix at LDT 91e9086d, read 2026-09-02",
    counties: [],
  };
  for (const fips of counties) {
    const started = Date.now();
    progress(`atoms ${fips} START`);
    const flood = await at.query(
      `select count(*) as rows,
              count(distinct regexp_replace(entity_id, '\\.00000000$', '')) as distinct_parcels,
              count(*) filter (
                where body ? 'absence' or body->>'sourceTier' = 'absent' or body ? 'verifiedAbsence'
              ) as typed_absence,
              count(*) filter (
                where not (body ? 'absence' or body->>'sourceTier' = 'absent' or body ? 'verifiedAbsence')
                  and jsonb_typeof(body->'inSpecialFloodHazardArea') = 'boolean'
              ) as present,
              count(*) filter (
                where not (body ? 'absence' or body->>'sourceTier' = 'absent' or body ? 'verifiedAbsence')
                  and jsonb_typeof(body->'inSpecialFloodHazardArea') <> 'boolean'
              ) as malformed,
              count(*) filter (
                where not (body ? 'absence' or body->>'sourceTier' = 'absent' or body ? 'verifiedAbsence')
                  and (body->>'inSpecialFloodHazardArea') = 'true'
              ) as in_sfha
         from atoms
        where entity_type = 'flood-hazard-fact'
          and entity_id like $1`,
      [`${fips}:%`],
    );
    const sd = await at.query(
      `with r as (
         select entity_id,
                regexp_replace(entity_id, '^(.*):sd(:.*)?$', '\\1') as parcel_prefix,
                case when entity_id ~ ':sd:' then split_part(entity_id, ':sd:', 2) else '' end as district_id
           from atoms
          where entity_type = 'special-district-fact'
            and entity_id like $1
       )
       select count(*) as rows,
              count(distinct regexp_replace(parcel_prefix, '\\.00000000$', '')) as distinct_parcels,
              count(*) filter (where district_id in ('', 'none', 'outside')) as typed_absence,
              count(*) filter (where district_id not in ('', 'none', 'outside')) as present
         from r`,
      [`${fips}:%`],
    );
    out.counties.push({
      countyFips: fips,
      countyName: COUNTY_NAME[fips],
      measuredAt: new Date().toISOString(),
      ms: Date.now() - started,
      flood: Object.fromEntries(Object.entries(flood.rows[0]).map(([k, v]) => [k, Number(v)])),
      specialDistrict: Object.fromEntries(
        Object.entries(sd.rows[0]).map(([k, v]) => [k, Number(v)]),
      ),
    });
    writeJson("2026-09-02_p106_rail_census_atoms.json", out);
    progress(`atoms ${fips} DONE in ${Math.round((Date.now() - started) / 1000)}s`);
  }
  await at.end();
}

/* ------------------------------------------------------------------ */

const [mode, ...rest] = process.argv.slice(2);
const counties = rest.length ? rest : FIPS;
const modes = { selftest, bake, juris, atoms, zoningdiv };
if (!modes[mode]) {
  process.stderr.write(`unknown mode ${String(mode)}; one of ${Object.keys(modes).join(", ")}\n`);
  process.exit(2);
}
modes[mode](counties).catch((err) => {
  progress(`FATAL ${mode}: ${err.message}`);
  process.exitCode = 1;
});
