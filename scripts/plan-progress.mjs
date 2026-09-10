#!/usr/bin/env node
/**
 * plan-progress.mjs — OPS-21's completion predicates, as runnable queries.
 *
 * WHY THIS EXISTS. Every plan in this operation has strayed the same way: the plan is
 * prose, the work happens in lanes, the lanes close into _inbox/, and nothing reconciles
 * the closes back to the plan's own definition of done. OPS-16 has 120+ amendment rows;
 * it grows, it does not converge. A lane reporting "done" is a claim.
 *
 * OPS-21 is the first plan whose completion is machine-checkable, because the parcel_record
 * ledger already tracks exactly what the plan is about. Each lane below carries a predicate
 * whose answer is a NUMBER, not an opinion. A lane is done when its predicate says so.
 *
 * FAIL LOUD, NEVER SILENT. Without a DSN this prints the SQL and exits non-zero. It never
 * reports 0 for a query it could not run — a check that cannot run and silently passes is
 * the defect ENFORCEMENT.md names first.
 *
 *   node scripts/plan-progress.mjs --self-test    prove the predicates are non-vacuous
 *   node scripts/plan-progress.mjs --sql          print the SQL for a credentialed seat
 *   node scripts/plan-progress.mjs                run them (needs FACTORY_DATABASE_URL
 *                                                 or PRODUCTION_NEONDB_URL)
 */

const CTX = ["48021", "48055", "48209", "48309", "48453", "48491"];
const FIPS_LIST = CTX.map((f) => `'${f}'`).join(",");

const SETBACK_RAILS = [
  "setbackFrontFt",
  "setbackSideFt",
  "setbackRearFt",
  "setbackCornerFt",
  "setbackRules",
];
const ENVELOPE_RAILS = [
  "parcelAreaSqFt",
  "buildableAreaSqFt",
  "buildableAreaPct",
  "envelopeStatus",
  "envelopeDisclosure",
  "maxHeightFt",
  "maxLotCoveragePct",
  "maxFootprintSqFt",
];
const DERIVABLE_RAILS = [
  "situsState",
  "acreageSqft",
  "landUseDescription",
  "landUseVintage",
  "exemptionCodes",
  "citationUrl",
];
const WRITER_RAILS = ["roads", "railCorridor", "pipelines", "parcelGeometry"];
const ONDEMAND_RAILS = ["hoaDeedRestrictions", "ossf", "publicRecordRefs"];

const railList = (rails) => rails.map((r) => `'${r}'`).join(",");

/**
 * IN-CITY population only. Setback and envelope rails are written not-applicable at
 * row creation for unincorporated parcels (UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS),
 * so counting them would understate progress against a denominator that is already done.
 */
const IN_CITY = `
    JOIN landing_parcel_jurisdiction lpj
      ON lpj.county_fips = split_part(c.place_key, ':', 1)
     AND lpj.prop_id     = substr(c.place_key, strpos(c.place_key, ':') + 1)
     AND lpj.disposition = 'in-city'`;

const unaccountedIn = (rails, extraJoin = "") => `
  SELECT count(*) AS n
    FROM parcel_record_cell c${extraJoin}
   WHERE split_part(c.place_key, ':', 1) IN (${FIPS_LIST})
     AND c.rail_key IN (${railList(rails)})
     AND c.cell_state = 'unaccounted'`;

export const PREDICATES = [
  {
    lane: "S1",
    title: "setback cells filled on in-city parcels",
    target: 0,
    sql: unaccountedIn(SETBACK_RAILS, IN_CITY),
    note: "In-city only. Unincorporated is already not-applicable at row creation.",
  },
  {
    lane: "S2",
    title: "envelope cells filled on in-city parcels",
    target: 0,
    sql: unaccountedIn(ENVELOPE_RAILS, IN_CITY),
  },
  {
    lane: "S4",
    title: "zoning-envelope (county, rail) pairs carrying a gate verdict",
    target: 0,
    sql: `
  SELECT count(*) AS n
    FROM (SELECT unnest(ARRAY[${FIPS_LIST}]) AS county_fips) f
   CROSS JOIN (SELECT unnest(ARRAY[${railList([...SETBACK_RAILS, ...ENVELOPE_RAILS])}]) AS rail_key) r
   WHERE NOT EXISTS (
           SELECT 1 FROM parcel_gate_verdict v
            WHERE v.county_fips = f.county_fips AND v.rail_key = r.rail_key)`,
    note: "Counts pairs with NO verdict row at all. A refuse verdict is a result; absence is not.",
  },
  {
    lane: "D1",
    title: "derivable rails filled from data on hand",
    target: 0,
    sql: unaccountedIn(DERIVABLE_RAILS),
  },
  {
    lane: "D2",
    title: "permits filled on Austin-city parcels in Travis",
    target: 0,
    sql: `
  SELECT count(*) AS n
    FROM parcel_record_cell c
    JOIN landing_parcel_jurisdiction lpj
      ON lpj.county_fips = split_part(c.place_key, ':', 1)
     AND lpj.prop_id     = substr(c.place_key, strpos(c.place_key, ':') + 1)
   WHERE split_part(c.place_key, ':', 1) = '48453'
     AND lpj.disposition = 'in-city'
     AND lower(lpj.city_name) = 'austin'
     AND c.rail_key = 'permits'
     AND c.cell_state = 'unaccounted'`,
    note: "Austin/Travis ONLY. San Antonio is Bexar, outside the six. The other five counties stay honestly unaccounted and that is correct, not a failure.",
  },
  {
    lane: "D3",
    title: "rails whose writer exists but had no runner",
    target: 0,
    sql: unaccountedIn(WRITER_RAILS),
  },
  {
    lane: "D4",
    title: "terrain cell carries a state",
    target: 0,
    sql: unaccountedIn(["terrain"]),
  },
  {
    lane: "D6",
    title: "on-demand rails dispositioned",
    target: 0,
    sql: `
  SELECT count(*) AS n
    FROM parcel_record_cell c
   WHERE split_part(c.place_key, ':', 1) IN (${FIPS_LIST})
     AND c.rail_key IN (${railList(ONDEMAND_RAILS)})
     AND c.cell_state <> 'available-on-request'`,
    note: "RULED 2026-09-10: these carry the new sixth state `available-on-request`, which requires a named REACHABLE requestPath (P-85 Records Request) and which the gate treats as satisfied. The predicate counts cells NOT in that state, so a cell relabelled to anything else — including a fabricated absence — reopens this lane. `_decisions/2026-09-10_available_on_request_sixth_cell_state.md`.",
  },
  {
    lane: "PROGRAM",
    title: "unaccounted across ALL rails, six counties",
    target: 0,
    sql: `
  SELECT count(*) AS n
    FROM parcel_record_cell c
   WHERE split_part(c.place_key, ':', 1) IN (${FIPS_LIST})
     AND c.cell_state = 'unaccounted'`,
    note: "The headline. Excludes nothing. Z8-deferred and D6-ruled rails still count here until their rulings land, deliberately, so the number cannot be improved by redefining it.",
  },
];

/**
 * D5 and S3 are NOT ledger queries — they are code-shape predicates and are checked in
 * their own repos, not here. Declared so the plan's row count and this file's row count
 * cannot silently diverge.
 */
export const CODE_PREDICATES = [
  {
    lane: "D5",
    title: "DEFAULT_SCHED_RAIL_KEYS length == 65",
    where: "hauska-factory src/jobs/publish-gate-sched.mjs",
  },
  {
    lane: "S3",
    title: "every registered write path has a non-vacuity test",
    where: "hauska-engine + hauska-factory",
  },
  {
    lane: "H1",
    title: "Hays place_key set measured against cad_property accounts, every non-intersecting row dispositioned",
    where: "hauska-factory, its own instrument",
  },
  {
    lane: "L1",
    title:
      "every slated (county, rail) pair's OLD serve path audited for reachability — 97 pairs shipped (measured, not the 94 stated); L1 CLOSED 2026-09-10: 70 present-reachable, 27 legacy-absent, 6 present-unreachable",
    where: "legacy-design-tools, read-only audit",
  },
  {
    lane: "L2",
    title: "PARCEL_RECORD_SLATE covers every rail not ruled out of the grid",
    where: "legacy-design-tools artifacts/api-server/src/lib/parcelRecordAllowlist.ts",
  },
  {
    lane: "L3",
    title:
      "legacy paths L1 found reachable are retired — a retired path returns a decline or 404 and CI fails if it reappears",
    where: "legacy-design-tools",
  },
];

// --------------------------------------------------------------------- self-test

function selfTest() {
  const cases = [];
  const push = (name, ok) => cases.push({ name, ok });

  push("every predicate has a lane, title and target", PREDICATES.every((p) => p.lane && p.title && p.target === 0));
  push("every predicate carries SQL", PREDICATES.every((p) => typeof p.sql === "string" && p.sql.trim().length > 40));
  push(
    "NON-VACUITY: every SQL scopes to at least one CTX county",
    PREDICATES.every((p) => CTX.some((f) => p.sql.includes(f)))
  );
  push(
    "a predicate narrower than the six counties DECLARES why (D2 is deliberately Travis-only)",
    PREDICATES.every((p) => CTX.every((f) => p.sql.includes(f)) || Boolean(p.note))
  );
  push(
    "NON-VACUITY: no predicate matches every row — each names cell_state or a verdict absence",
    PREDICATES.every((p) => p.sql.includes("cell_state") || p.sql.includes("parcel_gate_verdict"))
  );
  push(
    "setback + envelope predicates restrict to in-city (unincorporated is already not-applicable)",
    ["S1", "S2"].every((l) => PREDICATES.find((p) => p.lane === l).sql.includes("'in-city'"))
  );
  push(
    "the PROGRAM headline excludes nothing — no rail_key filter",
    !PREDICATES.find((p) => p.lane === "PROGRAM").sql.includes("rail_key")
  );
  push(
    "lane ids are unique across ledger and code predicates",
    new Set([...PREDICATES, ...CODE_PREDICATES].map((p) => p.lane)).size ===
      PREDICATES.length + CODE_PREDICATES.length
  );
  push(
    "D6 counts cells NOT in available-on-request, so a relabel reopens it",
    PREDICATES.find((p) => p.lane === "D6").sql.includes("available-on-request")
  );

  let failures = 0;
  for (const c of cases) {
    if (!c.ok) failures++;
    console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.name}`);
  }
  console.log(`\nfailures=${failures}`);
  return failures;
}

// ------------------------------------------------------------------------- main

const arg = process.argv[2];

if (arg === "--self-test") {
  process.exit(selfTest() === 0 ? 0 : 1);
}

if (arg === "--sql") {
  for (const p of PREDICATES) {
    console.log(`-- ${p.lane}: ${p.title}   TARGET ${p.target}`);
    if (p.note) console.log(`-- note: ${p.note}`);
    if (p.blocked) console.log(`-- BLOCKED: ${p.blocked}`);
    console.log(p.sql.trim() + ";\n");
  }
  console.log("-- Code-shape predicates, checked in their own repos, not here:");
  for (const p of CODE_PREDICATES) console.log(`--   ${p.lane}: ${p.title}  [${p.where}]`);
  process.exit(0);
}

const dsn = process.env.FACTORY_DATABASE_URL || process.env.PRODUCTION_NEONDB_URL;
if (!dsn) {
  console.error(
    "REFUSED: no FACTORY_DATABASE_URL or PRODUCTION_NEONDB_URL.\n" +
      "This tool does NOT report zero for a query it could not run. Use --sql to print the\n" +
      "predicates for a credentialed seat, or --self-test to check the predicates themselves."
  );
  process.exit(2);
}

const { default: pg } = await import("pg");
const client = new pg.Client({ connectionString: dsn, ssl: { rejectUnauthorized: false } });
await client.connect();

console.log(`\nOPS-21 PROGRESS   ${new Date().toISOString()}`);
console.log("lane      target  actual   status  title");
let open = 0;
for (const p of PREDICATES) {
  let actual, status;
  try {
    const r = await client.query(p.sql);
    actual = Number(r.rows[0].n);
    status = actual === p.target ? "DONE" : "OPEN";
  } catch (e) {
    actual = "ERR";
    status = "UNMEASURED";
  }
  if (status !== "DONE") open++;
  console.log(
    `${p.lane.padEnd(9)} ${String(p.target).padStart(6)}  ${String(actual).padStart(6)}   ${status.padEnd(
      10
    )} ${p.title}`
  );
  if (p.blocked) console.log(`          BLOCKED: ${p.blocked}`);
}
await client.end();

console.log(`\n${PREDICATES.length - open} of ${PREDICATES.length} ledger predicates met.`);
console.log("Code-shape predicates (D5, S3, H1) are checked in their own repos, not here.");
console.log(
  "\nIf the PROGRAM number is not falling week over week, the plan has strayed and this\n" +
    "line says so without anyone having to notice."
);
