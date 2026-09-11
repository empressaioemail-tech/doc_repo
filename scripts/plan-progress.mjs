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
/**
 * D1's derivable set. landUseDescription REMOVED 2026-09-10: the D1 lane verified live that
 * cad_property carries no such column and no code-to-description lookup exists anywhere in the
 * database. Not derivable from data on hand, so not D1's, and it must NOT be written
 * absent-verified -- we hold landUseCode, so the value exists and only the lookup is missing.
 * It stays `unaccounted` and moves to the Phase 3P deferred register.
 * landUseVintage STAYS: DECLARED_CAD_VINTAGES (hauska-factory src/config/cad-declared-vintages.mjs)
 * carries taxYear and tier per county.
 */
const DERIVABLE_RAILS = [
  "situsState",
  "acreageSqft",
  "landUseVintage",
  "exemptionCodes",
  "citationUrl",
];
const WRITER_RAILS = ["roads", "railCorridor", "pipelines", "parcelGeometry"];
const ONDEMAND_RAILS = ["hoaDeedRestrictions", "ossf", "publicRecordRefs"];

const railList = (rails) => rails.map((r) => `'${r}'`).join(",");

/**
 * CROSS-STORE JOIN REMOVED 2026-09-11, found by the S2 lane. These predicates used to JOIN
 * parcel_record_cell to landing_parcel_jurisdiction. That JOIN CANNOT EXECUTE: they are on two
 * genuinely different Neon hosts, both of whose default database is named `neondb`.
 *
 *   FACTORY_DATABASE_URL      parcel_record, parcel_record_cell, parcel_record_companion_row,
 *                             parcel_gate_verdict            (the Factory control store)
 *   PRODUCTION_NEONDB_URL     landing_parcel_jurisdiction, txgio_parcel, cad_property, tx_*
 *                             (the cortex store) -- parcel-record-fill.mjs:13-14 states it:
 *                             "That table is NOT on the Factory control store."
 *   DATABASE_URL / hauska_mcp atoms
 *
 * THE JOIN WAS ALSO UNNECESSARY, which is why it survived review. Setback and envelope rails
 * are written `not-applicable` at row creation for unincorporated parcels
 * (UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS), so an unincorporated cell is NEVER `unaccounted`.
 * Counting `unaccounted` alone already yields exactly the in-city population. One store, no
 * join, same answer, and it can actually run.
 */
const IN_CITY = "";

const unaccountedIn = (rails, extraJoin = "") => `
  SELECT count(*) AS n
    FROM parcel_record_cell c${extraJoin}
   WHERE split_part(c.place_key, ':', 1) IN (${FIPS_LIST})
     AND c.rail_key IN (${railList(rails)})
     AND c.cell_state->>'kind' = 'unaccounted'`;

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
   WHERE split_part(c.place_key, ':', 1) = '48453'
     AND c.rail_key = 'permits'
     AND c.cell_state->>'kind' = 'unaccounted'`,
    note: "Travis-wide, NOT Austin-only: the city restriction lived in landing_parcel_jurisdiction, which is on a DIFFERENT Neon host and cannot be joined. This predicate therefore over-counts (it includes non-Austin Travis parcels) and is declared as such rather than silently narrowed. San Antonio is Bexar, outside the six. The other five counties stay honestly unaccounted and that is correct, not a failure.",
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
     AND c.cell_state->>'kind' <> 'available-on-request'`,
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
     AND c.cell_state->>'kind' = 'unaccounted'`,
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
    "STORE: no predicate JOINs parcel_record_cell to a cortex-store table - they are different Neon hosts",
    PREDICATES.every(
      (p) =>
        !/parcel_record_cell[\s\S]*JOIN[\s\S]*(landing_parcel_jurisdiction|txgio_parcel|cad_property|tx_)/i.test(
          p.sql
        )
    )
  );
  push(
    "TYPE: no predicate compares cell_state directly - it is jsonb, the state is at ->>'kind'",
    PREDICATES.every((p) => !/cell_state\s*(=|<>)/.test(p.sql))
  );
  push(
    "TYPE: every predicate touching cell_state reads ->>'kind'",
    PREDICATES.every((p) => !p.sql.includes("cell_state") || p.sql.includes("cell_state->>'kind'"))
  );
  push(
    "NON-VACUITY: no predicate matches every row — each names cell_state or a verdict absence",
    PREDICATES.every((p) => p.sql.includes("cell_state") || p.sql.includes("parcel_gate_verdict"))
  );
  push(
    "setback + envelope predicates reach the in-city population WITHOUT a cross-store join — " +
      "counting `unaccounted` alone already excludes unincorporated, whose cells are " +
      "not-applicable at row creation",
    ["S1", "S2"].every((l) => {
      const q = PREDICATES.find((p) => p.lane === l).sql;
      return q.includes("'unaccounted'") && !q.includes("landing_parcel_jurisdiction");
    })
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
