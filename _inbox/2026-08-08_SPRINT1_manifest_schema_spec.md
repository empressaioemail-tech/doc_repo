---
id: 2026-08-08_SPRINT1_manifest_schema_spec
title: Sprint 1 thin slice — County Manifest schema and API spec (254 x 13, honest render)
date: 2026-08-08
status: spec (read-only; no code written)
owner: planner
related: [_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _inbox/2026-08-08_LEDGER_schema_audit, _inbox/2026-08-08_CONTRACT_coherence_audit, _catalog/texas_roster_v1.json, _scratch/command_center_manifest_mockup.html]
method: read-only spec against live source in P:\legacy-design-tools; zero code, migrations, or DB writes performed
---

# Sprint 1 thin slice — County Manifest schema and API spec

Goal restated: a live operator console showing TRUE state for 254 counties x 13 rails (3,302 cells), where 3 rails have real scorers and the rest render honestly as `no-atom` or `no-writer` rather than blank, zero, or fake. This spec is build-ready DDL, query code, rollup math, and seeding plan. It changes nothing by itself.

All file:line citations below were re-verified live in this session (2026-08-08), reading `P:\legacy-design-tools` directly — not carried forward from the two prior audits without a fresh read.

## 0. Naming and placement

Next free migration number is **`0068`**, confirmed live: `lib/db/drizzle/` runs 0000-0067 with no gap after 0067 (`0067_pe_workbench_state.sql` is the latest; `0068` is free). Two new migration files:

- `lib/db/drizzle/0068_county_manifest_and_rail_dimension.sql` — new tables (items 1, 2)
- `lib/db/drizzle/0069_county_facet_coverage_rail_state.sql` — additive columns on `county_facet_coverage` (item 4)

Two migrations, not one, because the manifest/rail tables are pure-additive new objects while the `county_facet_coverage` change touches a table with live rows and its own existing check-constraint set — keeping them separate matches the repo's own pattern (0060 created the ledger table, 0064 extended it additively, in separate files) and lets either be reverted independently.

Drizzle schema files: `lib/db/src/schema/countyManifest.ts`, `lib/db/src/schema/countyRail.ts`, and an edit to the existing `lib/db/src/schema/countyFacetCoverage.ts` for the additive columns — matching the one-file-per-table convention observed (`countyFacetCoverage.ts` is its own file, not folded into a shared schema barrel; the barrel export lives at `lib/db/src/schema/index.ts`, unread in this pass but referenced by `@workspace/db` in `countyLedger.ts:15-20`).

## 1. `county_manifest` table DDL

Seeded 254 rows from `_catalog/texas_roster_v1.json` `counties[]`. Columns chosen to support the console's identity column, sort-by-parcels, risk-class chip rendering, and cost-heuristic display (all confirmed live in the mockup's `C[]` array and roster read at `_catalog/texas_roster_v1.json` county-object keys: `record_type, fips, name, identity, geometry, cadastral, join_quality, zoning_regime, code_text, rails, risk_class, cost_estimate`).

```sql
-- 0068_county_manifest_and_rail_dimension.sql (part 1 of 2)
--
-- county_manifest: the missing denominator. One row per Texas county (254),
-- seeded from _catalog/texas_roster_v1.json. Without this table there is
-- nothing to LEFT JOIN from and "254" cannot exist as anything but a
-- hardcoded literal. Columns carry only what the roster can currently
-- justify (see section 7) plus identity/sort/display fields the console
-- needs. This is NOT a copy of the full roster JSON — per-rail roster
-- fields (geometry.*, cadastral.*, zoning_regime.*, rails.*) seed
-- county_facet_coverage cells directly (section 7), not this table.

CREATE TABLE IF NOT EXISTS county_manifest (
  county_fips         text PRIMARY KEY,
  county_name         text NOT NULL,
  parcel_count_est     integer,
  population_est       integer,
  population_status    text NOT NULL DEFAULT 'unverified',
  in_stratmap          boolean NOT NULL DEFAULT false,
  stratmap_vintage      text,
  cad_verification      text,
  cad_vendor_pattern    text,
  join_key_kind         text NOT NULL DEFAULT 'prop_id',
  prop_id_bad_rate      numeric(6, 4),
  owner_match_gate_required boolean NOT NULL DEFAULT true,
  risk_class           text[] NOT NULL DEFAULT '{}',
  cost_estimate_usd     numeric(10, 2),
  cost_estimate_method  text,
  roster_schema_version text NOT NULL,
  roster_generated_at   timestamptz NOT NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT county_manifest_population_status_check
    CHECK (population_status IN ('verified', 'unverified')),
  CONSTRAINT county_manifest_join_key_kind_check
    CHECK (join_key_kind IN ('prop_id', 'geo_id_or_address_crosswalk')),
  CONSTRAINT county_manifest_cad_verification_check
    CHECK (cad_verification IS NULL OR cad_verification IN
      ('verified', 'partial', 'honestly_absent', 'pending'))
);

CREATE INDEX IF NOT EXISTS county_manifest_parcel_count_idx
  ON county_manifest (parcel_count_est DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS county_manifest_in_stratmap_idx
  ON county_manifest (in_stratmap);
```

Notes on column choices, each traced:

- `county_fips` PK, 5-digit text, matches `countyFacetCoverage.countyFips` type (`countyFacetCoverage.ts:49`) so the join in item 5 needs no cast.
- `join_key_kind` directly closes contract-audit **S8** (crosswalk counties silently pass the `parcelNodeId` regex with no record of which key kind the second token is — `_inbox/2026-08-08_CONTRACT_coherence_audit.md:264-274`). Recording it on the manifest, even though it does not fix the atom-layer gap, gives the console a place to flag the 8 affected counties (Travis, Robertson, Oldham, Roberts, Motley, Floyd, Dimmit, Lipscomb per `OPS-1:31`).
- `risk_class` as native Postgres `text[]` — the roster carries a list per county (mockup `r:[...]` field, e.g. `['bis-field-template']`) and the console's blockers/chips rendering (`command_center_manifest_mockup.html:576-593`) iterates a list. A `text[]` avoids a needless join table for Sprint 1; if risk classes need independent querying/filtering later, promote to a child table then.
- `cost_estimate_method` stores the literal string `engine_250_heuristic` (roster `cost_estimate.method`, confirmed in the read at `_catalog/texas_roster_v1.json:84`) so the UI can always render the `UNVERIFIED — spine compute only` disclaimer the ruling requires (`_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md:70`) without hardcoding the caveat text away from its source.
- `roster_schema_version` / `roster_generated_at` carry `_catalog/texas_roster_v1.json` top-level `schema_version` (`"t6_roster_v1"`) and `generated_at` (`"2026-08-05T19:59:47.756420+00:00"`) so a re-seed is traceable to the roster snapshot it came from — this table is a load, not a live sync (section 7), and provenance of the load matters given `MEMORY.md` `migration-merged-not-applied-to-deployment-neon`.
- No `updated_at`-triggers specified; matches repo convention (no trigger functions found in 0048-0067; `checked_at`/`updatedAt` columns are set by the application on write, not by DB trigger — `countyFacetCoverage.ts:84-86` sets `checkedAt` via `.defaultNow()` only).

## 2. Rail dimension

**Recommendation: a lookup TABLE, not a hardcoded constant.** Reasoning:

1. The mockup's `RAILS[]` constant (`command_center_manifest_mockup.html:275-289`) is exactly this shape and proves the UI wants to read rail metadata (name, threshold, atom state, writer state, source description, note) as data, not compiled-in strings — the console already re-derives per-cell tags (`NO ATOM`, `UNPUB`, `HALF`, `NO WRITER`) from these fields at render time (`:448-451`).
2. Threshold values are explicitly unfixed by the ruling and due for tuning (`_decisions/...:54`, `"Threshold values are deliberately NOT fixed here"`). A table lets threshold tuning be a data UPDATE with an audit trail; a hardcoded constant requires a code deploy per tuning pass.
3. `atom_family` and `has_writer` are exactly the two facts contract-audit and ledger-audit established will change over time (v1.12.0 publish flips footprint/easement from `unpublished` to real; a new scorer flips a rail's writer bit). A table makes "6 of 13 rails have no atom family" a live queryable fact instead of a doc-layer claim that drifts from code (which is precisely **S1** in the contract audit: the rail list and the atom layer were authored independently and never reconciled — a table with FK-able fields is one mechanism to keep them reconciled going forward, even though nothing enforces it automatically in Sprint 1).
4. A hardcoded 13-entry TS constant duplicates the existing anti-pattern the ledger audit flagged (`COUNTY_NAMES`, a hardcoded 10-entry map at `countyCoverageScoreCli.ts:63-74`, ledger audit section 3) — Sprint 1's own stated purpose is to retire hardcoded enumeration, so introducing a new one for rails would be incoherent with the rest of the spec.

```sql
-- 0068_county_manifest_and_rail_dimension.sql (part 2 of 2)
--
-- county_rail: the 13 ruled rails (_decisions/2026-08-08_..._thirteen_rails...),
-- in ruled order. atom_family / has_writer are DECLARED FACTS about the
-- current state of the atom contract and the scorer CLI, kept here so the
-- console can render `no-atom` / `no-writer` from data rather than a
-- hardcoded TS list that drifts. Neither column enforces anything —
-- updating them here does not create an atom or wire a writer; they are
-- the manifest's honest record of what exists elsewhere, maintained by
-- whoever ships the atom or the writer (part of the build-order in
-- section 9, step where a rail's state changes).

CREATE TABLE IF NOT EXISTS county_rail (
  rail_key            text PRIMARY KEY,
  display_name        text NOT NULL,
  ordinal             smallint NOT NULL,
  rail_letter         text,
  kind                text NOT NULL,
  threshold_pct        numeric(5, 2) NOT NULL,
  atom_family_state    text NOT NULL,
  atom_family_ref      text,
  has_writer           boolean NOT NULL DEFAULT false,
  writer_ref           text,
  declared_source       text NOT NULL,
  notes                text,
  updated_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT county_rail_ordinal_unique UNIQUE (ordinal),
  CONSTRAINT county_rail_kind_check
    CHECK (kind IN ('spine', 'derived')),
  CONSTRAINT county_rail_atom_family_state_check
    CHECK (atom_family_state IN ('present', 'missing', 'partial', 'unpublished'))
);

-- Seed: the 13 ruled rails, ruled order, per
-- _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md:18-30
-- and cross-checked against _inbox/2026-08-08_CONTRACT_coherence_audit.md
-- section 1 for atom_family_state / has_writer.
INSERT INTO county_rail (rail_key, display_name, ordinal, rail_letter, kind, threshold_pct, atom_family_state, atom_family_ref, has_writer, writer_ref, declared_source, notes) VALUES
  ('geometry',  'Parcel geometry',      1, 'C', 'spine',   95, 'missing',      NULL,
     false, NULL, 'TxGIO StratMap bulk zip per FIPS; county ArcGIS override where fresher',
     'Spine rail, no atom. ADR-029 builds its graph on a parcel-record type that does not exist (contract audit S2).'),
  ('cad',       'CAD attributes',       2, 'B', 'spine',   95, 'missing',      NULL,
     false, NULL, 'County CAD (BIS/PACS/Orion/HCAD), joined to Rail C geometry', NULL),
  ('join',      'Join quality',         3, NULL,'spine',   95, 'missing',      NULL,
     'partial', 'county_facet_coverage.owner_match_rate (land-use row only, not a peer cell)',
     'Derived; owner_match_gate_required ALWAYS per OPS-1', 'Measured but not stored as its own rail today.'),
  ('zoning',    'Zoning + setback',     4, 'A', 'spine',   95, 'present',      'zoning-fact, setback-rule (contract)',
     true, 'countyCoverageScoreCli.ts facet land-use/:538 no -- zoning:591', 'Municipal code per incorporated city; unincorporated county is unzoned',
     'Typed absence discriminant; satisfied-absent is first-class here.'),
  ('roads',     'Roads / frontage',     5, NULL,'spine',   95, 'present',      'road-node (contract + engine)',
     false, NULL, 'OSM Overpass plus county roadway layers', 'Atom exists, no scorer emits it, and no roster block backs it.'),
  ('flood',     'Flood / terrain',      6, 'D', 'spine',   95, 'partial',      'parcel-terrain-model (terrain only; no flood atom)',
     false, NULL, 'FEMA NFHL, USGS 3DEP, USDA SSURGO', 'Terrain covered; flood half has no atom.'),
  ('envelope',  'Buildable envelope',   7, NULL,'derived', 90, 'present',      'buildable-envelope (contract)',
     true, 'countyCoverageScoreCli.ts:602', 'Derived from parcel geometry + zoning/setback + roads',
     'Absence rides off-contract engine fields (warmVerifyDecline*); will not survive export (contract audit S4).'),
  ('landuse',   'Land use',             8, NULL,'derived', 90, 'missing',      NULL,
     true, 'countyCoverageScoreCli.ts:538 facet land-use', 'CAD roll code',
     'Scored but not atomized. Only live land_use_code carrier is the EXTINGUISHED Cotality adapter.'),
  ('footprint', 'Building footprints',  9, NULL,'derived', 90, 'unpublished',  'building-footprint (contract v1.12.0, unpublished)',
     false, NULL, 'ML-derived default statewide (Microsoft/Overture/USA Structures)', 'One npm publish away from existing.'),
  ('easement',  'Utility easements',   10, NULL,'derived', 90, 'unpublished',  'utility-easement (contract v1.12.0, unpublished)',
     false, NULL, 'County honest-absence default; CAD exception where published',
     'Roster easement_tier "cad-easement-rest" (McLennan) is not a contract enum member -- will hard-fail Zod parse (contract audit S5).'),
  ('owner',     'Owner facet',         11, NULL,'derived', 90, 'missing',      NULL,
     false, NULL, 'CAD owner_name + mailing, authenticated paid facet',
     'Ruled public-paid at the atom level; no owner atom exists to carry the policy.'),
  ('rrc',       'RRC wells / pipelines',12, NULL,'derived', 90, 'partial',      '12 O&G types (wells only; no parcelNodeId edge; pipelines missing)',
     false, NULL, 'RRC public GIS (W-1, H-10, PDQ)', 'W3 HELD per 2026-08-01 scale ruling.'),
  ('mud',       'MUD / special districts', 13, NULL,'derived', 90, 'missing',   NULL,
     false, NULL, 'TX Comptroller special-district registry', 'W4 HELD per 2026-08-01 scale ruling.')
ON CONFLICT (rail_key) DO NOTHING;
```

`atom_family_state` uses `missing | partial | unpublished | present` (a proper enum with a CHECK) rather than the mockup's mixed-type JS field (`atom:false / true / 'partial' / 'unpublished'`, `command_center_manifest_mockup.html:276-288`) — SQL needs a single-typed column, and the four-value enum is a strict superset of the mockup's cases, so no information is lost, and it is directly derivable from contract-audit section 1's per-rail verdicts.

## 3. Cell state model

**Recommendation: derive `no-atom` and `no-writer` at query time from `county_rail`; store only the three ruled states (`satisfied-present`, `satisfied-absent`, `not-yet`) plus `PARTIAL`-as-a-flag on `county_facet_coverage`.**

Justification:

- `no-atom` and `no-writer` are properties of the **rail**, true for every county simultaneously (all 254 counties are `no-atom` on `geometry` today; that is not a per-county fact to store 254 times). Storing them per-cell in `county_facet_coverage` would mean writing 254 identical rows every time a rail's atom-family or writer status changes, and it would let a stale per-cell copy silently diverge from `county_rail.atom_family_state` — a second source of truth for the exact fact the contract audit already flagged as unreconciled (S1). Deriving from `county_rail` at query time means updating one row (the rail) instantly and correctly reflects across all 254 counties with zero backfill.
- `satisfied-present` / `satisfied-absent` / `not-yet`, by contrast, are genuinely per-cell facts (Bastrop zoning is `satisfied-present`; Anderson zoning is `satisfied-absent`; Loving zoning is `not-yet`) that only exist where work happened, and MUST be stored — there is no rail-level fact that implies them.
- This gives four distinct display states without inventing a four-value stored enum, and it means `no-atom` can NEVER be miscoded as `not-yet` by a stale write (a structural guarantee, not a discipline one): if `county_rail.atom_family_state != 'present'`, the query layer overrides whatever (if anything) is in `county_facet_coverage` for that cell before it reaches the console. Per the CRITICAL instruction in the task ("a cell with no scorer must render as no-writer/no-atom, never as blank, zero, or fake"), this ordering is load-bearing: no-atom must dominate even a stray or leftover row.
- This matches the mockup's own `railState()` logic exactly (`command_center_manifest_mockup.html:356-362`: `if(rail.atom===false) return {s:'x'}` checked FIRST, before any per-county lookup) — the mockup already encodes "no-atom dominates" as the first branch, which is the derive-at-query-time behavior this recommendation formalizes into SQL.

Precedence rule (exact, for the query in item 5): for cell `(county, rail)`,

1. If `county_rail.atom_family_state != 'present'` → display state is `no-atom` (regardless of any `county_facet_coverage` row).
2. Else if `county_rail.has_writer = false` → display state is `no-writer` (regardless of any `county_facet_coverage` row — a rail can have an atom but nothing populating it, e.g. `roads`).
3. Else if no `county_facet_coverage` row exists for `(county_fips, rail_key)` → `not-yet`.
4. Else read `rail_state` off the stored row (`satisfied-present` / `satisfied-absent` / `not-yet`), and separately check `honest_coverage_pct < threshold_pct` for the `PARTIAL` flag (only applies to `satisfied-present`; ruling 3 has no PARTIAL concept for `satisfied-absent`, which is binary — established or not).

Do not overload `integrity_verdict` or `classification` — both are confirmed live at `countyFacetCoverage.ts:62-66` and `:78-82` to encode join-integrity meaning (`pass/block/insufficient-sample/n/a`, `real-at-ceiling/needs-crosswalk/true-source-gap/fabricated-blocked`), and neither vocabulary has a slot for "established absence" vs "unacquired" (ledger audit section 4 confirms both collapse absence to `0.00` today, indistinguishably). `rail_state` is a new, independent axis.

## 4. Additive columns on `county_facet_coverage`

```sql
-- 0069_county_facet_coverage_rail_state.sql
--
-- Additive extension of county_facet_coverage for the 13-rail three-state
-- manifest. All columns nullable or defaulted; every existing row
-- (19 counties x 3 facets, live 2026-08-08) stays valid with zero backfill,
-- matching the pattern 0064 used for the Phase A7 performance fields.

ALTER TABLE county_facet_coverage
  ADD COLUMN IF NOT EXISTS rail_state           text,
  ADD COLUMN IF NOT EXISTS threshold_pct         numeric(5, 2),
  ADD COLUMN IF NOT EXISTS absence_basis         text,
  ADD COLUMN IF NOT EXISTS last_verified_at       timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by_instrument  text,
  ADD COLUMN IF NOT EXISTS verification_method    text,
  ADD COLUMN IF NOT EXISTS artifact_path          text;

ALTER TABLE county_facet_coverage
  ADD CONSTRAINT county_facet_coverage_rail_state_check
    CHECK (rail_state IS NULL OR rail_state IN
      ('satisfied-present', 'satisfied-absent', 'not-yet'));

ALTER TABLE county_facet_coverage
  ADD CONSTRAINT county_facet_coverage_verification_method_check
    CHECK (verification_method IS NULL OR verification_method IN
      ('sweep', 'sample', 'roster-load', 'unverified'));

-- absence_basis is REQUIRED (not just present) whenever rail_state is
-- satisfied-absent -- ruling 2 makes absence a finding, and a finding
-- needs its citation or the state is unfalsifiable.
ALTER TABLE county_facet_coverage
  ADD CONSTRAINT county_facet_coverage_absence_basis_required_check
    CHECK (rail_state IS DISTINCT FROM 'satisfied-absent' OR absence_basis IS NOT NULL);

CREATE INDEX IF NOT EXISTS county_facet_coverage_rail_state_idx
  ON county_facet_coverage (rail_state);
```

Column-by-column justification against the task's item 4 requirements:

- `rail_state` — the three-state axis itself (section 3).
- `threshold_pct` — ruling 3 requires SATISFIED vs PARTIAL to compare against a declared threshold; nothing does this today (ledger audit section 4, last paragraph: "No threshold column exists on the table"). Stored per-row (not only on `county_rail`) because a given county's threshold could in principle be overridden from the rail default (e.g. a county-specific data-quality carve-out) — Sprint 1 always writes `county_rail.threshold_pct` into this column at write time, but the column exists independently so a future override doesn't require a schema change.
- `absence_basis` — the public-record citation for `satisfied-absent`, enforced NOT NULL-when-absent via the CHECK above (this is the one place this spec adds enforcement beyond the task's ask, because ruling 2's own text — "A complete answer" — is meaningless without a citation to check it against, and the task explicitly asks for evidence drill-through in the same item).
- `last_verified_at` — per-cell trust: when was this specific cell last checked, distinct from `checked_at` (which the existing column doc at `countyFacetCoverage.ts:83` already defines as "When the scorer last wrote this row" — i.e., write time, not verification time; they can diverge if a row is verified without a rewrite, e.g. a sweep confirms an existing value is still correct).
- `verified_by_instrument` — free-text identifier of what did the verifying (a CLI name, a sweep job id, `roster-load` for cells seeded from the roster with no independent instrument run) — needed because "trust" per the task means knowing not just that it was checked but by what.
- `verification_method` — `sample | sweep | roster-load | unverified`, directly responsive to the task's explicit ask ("verification_method sample-vs-sweep") and to the standing MEMORY.md rule `area-sweep-not-parcel-sample` (a sample-verified cell is a materially weaker claim than a sweep-verified one, and the console must be able to show the difference, not collapse them).
- `artifact_path` — evidence drill-through, a pointer to the artifact (JSON probe file, CAD service response, roster evidence field) backing the cell, mirroring the roster's own `evidence` field pattern already seen at multiple points (e.g. `_catalog/texas_roster_v1.json` county `geometry.evidence: "_land_records/txgio_stratmap_county_matrix_2026-08-02.json"`).

None of the three existing CHECK constraints (`integrity_verdict`, `classification`, `cert_state`) are touched, per the task's explicit instruction not to overload them.

## 5. The rewritten query

Replaces the bare select at `countyLedger.ts:91` (`const rows = await db.select().from(countyFacetCoverage);`) and the `totalCounties: counties.length` at `:221`. Below is the Drizzle-flavored TypeScript version, matching the existing file's import style (`countyLedger.ts:13-21`) and its `num`/`iso` coercion helpers (`:80-83`).

```typescript
// Replaces countyLedger.ts:91 and the totalCounties computation at :221.
// LEFT JOIN county_manifest x county_rail -> LEFT JOIN county_facet_coverage,
// so every one of the 254 x 13 = 3,302 cells returns exactly one row.
// Precedence (section 3): atom_family_state != 'present' => no-atom;
// has_writer = false => no-writer; no coverage row => not-yet; else stored
// rail_state, with a PARTIAL flag computed from honest_coverage_pct vs
// the row's threshold_pct.

import { sql } from "drizzle-orm";
import { countyManifest, countyRail } from "@workspace/db"; // new tables, item 1/2

interface ManifestCell {
  countyFips: string;
  railKey: string;
  displayState: "no-atom" | "no-writer" | "not-yet" | "satisfied-present" | "satisfied-absent";
  isPartial: boolean;
  honestCoveragePct: number | null;
  thresholdPct: number | null;
  absenceBasis: string | null;
  source: string | null;
  sourceVintage: string | null;
  lastVerifiedAt: string | null;
  verifiedByInstrument: string | null;
  verificationMethod: string | null;
  artifactPath: string | null;
}

async function readManifestGrid(): Promise<ManifestCell[]> {
  // One SQL statement: manifest x rail (3,302 rows always) LEFT JOIN the
  // one work-product table. Raw SQL (not the query builder) because the
  // precedence CASE is the load-bearing part and is clearer written once,
  // explicitly, than composed from partial Drizzle helpers.
  const { rows } = await db.execute(sql`
    SELECT
      m.county_fips,
      r.rail_key,
      r.threshold_pct AS rail_default_threshold,
      r.atom_family_state,
      r.has_writer,
      c.rail_state,
      c.honest_coverage_pct,
      c.threshold_pct AS cell_threshold,
      c.absence_basis,
      c.source,
      c.source_vintage,
      c.last_verified_at,
      c.verified_by_instrument,
      c.verification_method,
      c.artifact_path,
      CASE
        WHEN r.atom_family_state <> 'present' THEN 'no-atom'
        WHEN r.has_writer = false THEN 'no-writer'
        WHEN c.rail_state IS NULL THEN 'not-yet'
        ELSE c.rail_state
      END AS display_state,
      CASE
        WHEN r.atom_family_state = 'present'
         AND r.has_writer = true
         AND c.rail_state = 'satisfied-present'
         AND c.honest_coverage_pct < COALESCE(c.threshold_pct, r.threshold_pct)
        THEN true
        ELSE false
      END AS is_partial
    FROM county_manifest m
    CROSS JOIN county_rail r
    LEFT JOIN county_facet_coverage c
      ON c.county_fips = m.county_fips
     AND c.facet = r.rail_key
    ORDER BY m.county_fips, r.ordinal
  `);
  return rows.map((row: any) => ({
    countyFips: row.county_fips,
    railKey: row.rail_key,
    displayState: row.display_state,
    isPartial: Boolean(row.is_partial),
    honestCoveragePct: num(row.honest_coverage_pct),
    thresholdPct: num(row.cell_threshold ?? row.rail_default_threshold),
    absenceBasis: row.absence_basis ?? null,
    source: row.source ?? null,
    sourceVintage: row.source_vintage ?? null,
    lastVerifiedAt: iso(row.last_verified_at),
    verifiedByInstrument: row.verified_by_instrument ?? null,
    verificationMethod: row.verification_method ?? null,
    artifactPath: row.artifact_path ?? null,
  }));
}
```

Then in the route handler:

```typescript
router.get("/", async (_req: Request, res: Response) => {
  try {
    const cells = await readManifestGrid();          // 3,302 rows, always
    const manifestRows = await db.select().from(countyManifest); // 254 rows, for identity/name/parcel_count_est

    // totalCounties is now 254 BY CONSTRUCTION, not by accident of what was
    // worked (fixes ledger audit section 3's decisive finding).
    const totalCounties = manifestRows.length;

    // ... existing mirror/gate/cert/openEvents joins (countyLedger.ts:92-210)
    // are UNCHANGED and still additive; they enrich the 254-county set built
    // here rather than defining it.
    ...
    res.json({
      manifestCells: cells,          // NEW: the 3,302-cell grid
      counties,                      // EXISTING shape, still served for back-compat
      summary: {
        onboardedCount: counties.filter((c) => c.onboarded).length,
        totalCounties,                // now 254, not counties.length
        totalRails: 13,
        totalCells: cells.length,     // 3,302
        satisfiedCells: cells.filter(c => c.displayState === "satisfied-present" && !c.isPartial
                                        || c.displayState === "satisfied-absent").length,
        staleCount: counties.filter((c) => c.hasStale).length,
        rewarmUnsafeCount: counties.filter((c) => c.rewarmUnsafe).length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "county_ledger_read_failed", message: err instanceof Error ? err.message : String(err) });
  }
});
```

`manifestCells` is added as a new top-level field rather than restructuring `counties[].facets[]` in place, so the existing Command Center panel (`CountyLedger.tsx`, five columns, `PanelRegistry.ts:69`) keeps working unmodified while a new manifest-grid view (matching `command_center_manifest_mockup.html`) is built against `manifestCells`. This is the honest reading of "thin slice" — ship the new data path additively, do not force a simultaneous frontend rewrite as a Sprint 1 dependency.

## 6. The rollup math

Per ruling 3, only SATISFIED counts (`satisfied-present` at-or-above threshold, plus `satisfied-absent`); PARTIAL (below threshold) is visible but contributes zero.

**Formula**, parcel-weighted, matching the mockup's `rollup()` (`command_center_manifest_mockup.html:401-410`) generalized to all 254 counties:

```
For county c, satisfied_count(c) = count over the 13 rails where
  displayState(c, rail) == 'satisfied-present' AND NOT isPartial(c, rail)
  OR displayState(c, rail) == 'satisfied-absent'

texas_pct = 100 * SUM_over_c( parcel_count_est(c) * satisfied_count(c) )
                 / ( SUM_over_c( parcel_count_est(c) ) * 13 )
```

Equivalently, in SQL against the grid from item 5 joined to `county_manifest.parcel_count_est`:

```sql
WITH satisfied AS (
  SELECT county_fips, county_manifest.parcel_count_est,
         COUNT(*) FILTER (
           WHERE (display_state = 'satisfied-present' AND NOT is_partial)
              OR display_state = 'satisfied-absent'
         ) AS sat_count
  FROM manifest_grid_view                      -- the item-5 query, materialized as a view
  JOIN county_manifest USING (county_fips)
  GROUP BY county_fips, county_manifest.parcel_count_est
)
SELECT
  100.0 * SUM(COALESCE(parcel_count_est, 0) * sat_count)
        / NULLIF(SUM(COALESCE(parcel_count_est, 0)) * 13, 0) AS texas_pct
FROM satisfied;
```

Denominator is `SUM(parcel_count_est) * 13`, not `254 * 13` counties and not a plain per-county average — parcel-weighting means Harris County's near-zero completeness counts far more against the number than Loving County's, which is the stated intent of weighting by `parcel_count_est` (task item 6; also matches the mockup's `TX_PARCELS * RAILS.length` denominator at `:408`, `TX_PARCELS = 13360496` sourced from the roster coverage total).

`parcel_count_est` NULL handling: three counties in the roster carry `population.value: null` but `parcel_count_est` is present on every read county row inspected in this session; if any county's `parcel_count_est` is genuinely NULL (Donley, `48129`, is flagged `no-stratmap` in the mockup with `p: null`, `command_center_manifest_mockup.html:335` — carried from the roster's own null, not invented), `COALESCE(parcel_count_est, 0)` means that county contributes zero weight to both numerator and denominator, which is correct: an unweighable county should not silently inflate or deflate the Texas percentage, and it still appears in the grid with its own `not-yet`/`no-atom` cells for the per-county view.

## 7. Seeding plan

`_catalog/texas_roster_v1.json` is a **file only**, confirmed unread into any of the three code repos in the ledger audit (section 7: zero hits for `texas_roster` in `hauska-engine`, `legacy-design-tools`, `hauska-map`). Seeding is a one-time load script (or a migration-adjacent seed script run once, matching the repo's existing pattern of DDL-only migrations plus separate CLI seed/backfill scripts — no INSERT-of-254-rows belongs inside a `.sql` migration file given the roster's size and its non-SQL source format).

**`county_manifest` (254 rows) — every row is honestly seedable today**, because every field on the table (section 1) has a direct, unconditional source in the roster's per-county object:

| `county_manifest` column | Roster source | Coverage |
|---|---|---|
| `county_fips`, `county_name` | `fips`, `name` | 254/254 |
| `parcel_count_est` | `identity.parcel_count_est` | 254/254 (NULL where roster itself is null, e.g. Donley) |
| `population_est`, `population_status` | `identity.population.value`, `.status` | 254/254 (`status` always populated; `value` mostly null — roster documents this as "not probed this session") |
| `in_stratmap`, `stratmap_vintage` | `geometry.in_stratmap`, `geometry.vintage_yyyymm` | 253/254 verified true; Donley is the one `NOT_COVERED` (roster `geometry.flags`) |
| `cad_verification`, `cad_vendor_pattern` | `cadastral.verification`, `cadastral.vendor_pattern` | 254/254 (`verified`/`partial`/`honestly_absent` per roster coverage tally: 173/22/59) |
| `join_key_kind`, `prop_id_bad_rate` | `join_quality.join_key`, `.prop_id_bad_rate` | 254/254 (246 `prop_id`, 8 crosswalk) |
| `owner_match_gate_required` | `join_quality.owner_match_gate_required` | 254/254, always `true` |
| `risk_class` | `risk_class[]` | 254/254 (possibly empty array) |
| `cost_estimate_usd`, `cost_estimate_method` | `cost_estimate.estimated_usd`, `.method` | 254/254, always `engine_250_heuristic` |

**`county_facet_coverage` cells — which can be honestly pre-populated from the roster TODAY, and which cannot:**

Only for rails where `county_rail.atom_family_state = 'present'` AND `has_writer = true` does a pre-populated cell make sense as `satisfied-present`/`satisfied-absent` under the precedence rule in section 3 (a `no-atom`/`no-writer` rail's cells are never written — they are derived, per item 3's explicit design goal of not needing 254 identical writes). That leaves exactly **zoning** and **envelope** as rails where the roster can seed real cell rows without a live scorer run, plus one partial case:

- **`zoning`**: `zoning_regime.doctrine` on every unincorporated-county row reads `"PASS — county unincorporated = honest absence"` (verbatim, e.g. `_catalog/texas_roster_v1.json` FIPS 48001 `zoning_regime.doctrine`). This is a literal pre-computed `satisfied-absent` finding for the COUNTY-LEVEL unincorporated zoning question, with `absence_basis` = the doctrine string itself and `verification_method = 'roster-load'`. **This does NOT cover incorporated cities within the county** — city-level zoning stamping is a separate, unseeded question (matches item 8's explicit deferral of the city dimension). Seedable: 254/254 counties get a `satisfied-absent` county-unincorporated-zoning cell; this is a partial answer to the `zoning` rail, not a complete one, and the manifest must not claim county-level `satisfied-absent` implies the rail is fully satisfied for that county's cities.
- **`cad` is NOT seedable as a `county_facet_coverage` cell** despite having roster data (`cadastral.verification`), because `cad` has `atom_family_state = 'missing'` (section 2) — under the precedence rule, `cad` renders `no-atom` for every county regardless of what the roster knows. The roster's CAD verification data lives on `county_manifest.cad_verification` instead (section 1 table above), visible in the county identity panel, NOT as a rail cell. This is deliberate: the task's own framing (item 8's answer to the mockup's open question 1) is "if the contract cannot hold the finding, the finding does not count" — surfacing it as manifest metadata rather than a cell honors that while still not hiding the information from the operator.
- **`envelope`**: no unconditional roster field. The mockup's fabricated `envelope` cells (`command_center_manifest_mockup.html:373-378`) are explicitly marked FABRICATED in the mockup's own header comment (`:8-12`) and must NOT be carried into Sprint 1 seeding — envelope is `derived` and requires an actual scorer run (`countyCoverageScoreCli.ts:602`) per county; it renders `not-yet` for any county the scorer has not touched.
- **`landuse`**: has a writer (`countyCoverageScoreCli.ts:538`) but `atom_family_state = 'missing'` — renders `no-atom` regardless of any scored value, per the same precedence rule. The 19 counties with a scored `land-use` value in the live ledger today (ledger audit section 3) will display `no-atom`, not their scored percentage, under this spec. **This is a deliberate, load-bearing consequence, not an oversight** — flagged explicitly in open questions below because it changes what the console shows for counties that already have real land-use scores.
- **`easement`**: roster carries `rails.easement_tier` (253 `absent`, 1 `cad-easement-rest` at McLennan) but `atom_family_state = 'unpublished'` — renders `no-atom` for all 254 today. The moment v1.12.0 publishes and `county_rail.atom_family_state` flips to `present` for `easement` (a one-row UPDATE, no migration), the roster's 253 `absent` values become immediately seedable as `satisfied-absent` (`absence_basis = 'county-level honest-absence default per OPS-1:97'`), EXCEPT McLennan, which must be fixed at the roster-or-enum level first per contract-audit S5 (`cad-easement-rest` is not a member of `UTILITY_EASEMENT_SOURCE_TIER_SCHEMA` and will hard-fail Zod parse) — do not seed McLennan's easement cell until S5 is resolved; seed the other 253 and leave McLennan `not-yet` with a note, or block the whole easement seed on S5's resolution. Recommend the latter (block all 254) for internal consistency of a single seed pass, since which choice for McLennan is a one-line follow-up either way.
- **`footprint`**: same unpublished gate as easement; roster's `rails.footprint_tier` is uniformly `ml-derived` (254/254) and would seed cleanly as `satisfied-present` (national ML default, `public-free` per the 2026-08-05 ruling) once v1.12.0 publishes — flagged as a fast-follow seed, not Sprint 1.
- **Geometry, CAD, join-quality, owner, RRC, MUD**: no seeding is possible or meaningful under this spec, because all six render `no-atom` (or `no-writer` for RRC/join's partial cases) unconditionally. Their roster data (geometry verification, CAD probe results, join bad-rates) lives on `county_manifest`, visible to the operator, but never as a rail cell — consistent with mockup open question 1's strict answer.

**Net Sprint-1-honest seed**: `county_manifest` 254/254 rows; `county_facet_coverage` gets 254 new `zoning` cells (county-unincorporated-absence only) plus whatever the live 19-county x {land-use, zoning, envelope} data already holds (unchanged, but note land-use will display `no-atom` per the point above regardless of its stored value). Total newly-seeded coverage rows: 254 (zoning only). Every other cell in the 3,302-cell grid renders `no-atom` or `not-yet` purely from the `county_rail`/LEFT JOIN logic, with zero rows written for it — which is the intended "honest, not complete" state for a thin slice.

## 8. What Sprint 1 does NOT include

Named explicitly per the task's instruction not to silently drop mockup-implied features:

- **History / time-series table.** The mockup's "Recent run outcomes" table (`command_center_manifest_mockup.html:698-706`) is explicitly marked `fabricated for layout — no run log is wired` in its own header. A real version needs a `county_rail_run_event` (or similar) table keyed on `(county_fips, rail_key, run_id)` with `started_at`, `finished_at`, `outcome`, `in_count`, `out_count`, `refused_count`, `note` — essentially `onboarding_ledger_event` (already live, `0065_onboarding_ledger.sql:28-51`) generalized from "defect finding" to "run outcome," or a peer table if the two purposes shouldn't share a schema. Needs: a decision on whether run-history is a NEW table or an extension of `onboarding_ledger_event`'s existing `source_kind` enum (`preflight | cert-grade | block13-quarantine | warden-sweep`, `0065:47-48`) to add a `coverage-score-run` kind.
- **Run-state surface** (the mockup's "Heavy-scan slot: HELD" card, `:432`, `:648`). This needs a live lock/semaphore table or a read against whatever process currently enforces the one-heavy-scan-at-a-time rule (referenced but not located in this session — the audits note the constraint exists but not where it's enforced in code). Needs: locating the enforcement mechanism (likely in `hauska-engine`, out of this session's read scope) before a schema can be specified.
- **City dimension.** The roster carries 1,223 incorporated cities (`_catalog/texas_roster_v1.json` `cities[]`, confirmed read this session: keys `record_type, place_fips, geoid, name, full_name, parent_county_name, parent_county_fips, zoning_regime, code_text, zoning_layer, parcel_record_layer, rails, risk_class`) with their own zoning/code-text/rail state, entirely separate from the county-level `zoning_regime.doctrine` used in section 7's zoning seed. The 13-rail ruling and this manifest are county-shaped; a city manifest is a structurally similar but separate `city_manifest` + `city_facet_coverage` pair, deferred. Needs: a ruling on whether cities get their own 13-rail shape or a subset (zoning/code-text rails only plausibly apply at city grain; geometry/CAD/RRC/MUD are county-grain concepts), and whether `parent_county_fips` (frequently null in the sampled read, e.g. Abbott city's `parent_county_fips: null` despite `parent_county_name: "A"` — likely a roster join defect worth flagging separately) is reliable enough to join on.
- **Cost actuals.** Every cost figure in this spec and the mockup is the roster's `engine_250_heuristic` estimate, explicitly `UNVERIFIED — spine compute only` per the ruling (`_decisions/...:70`) and the mockup's own disclosure (`:557`, `:613-615`). Actual cost tracking needs a real cost-capture mechanism per onboarding run (compute + the 1-hour human-review commitment from the four structural commitments) feeding `county_facet_coverage.cost_usd` (already a live column, `countyFacetCoverage.ts:124`, currently unpopulated by any writer found in this session) — out of scope for a schema spec; this is an instrumentation build, not a table.

## 9. Build order

1. Write and apply `0068_county_manifest_and_rail_dimension.sql` (creates `county_manifest` empty, `county_rail` seeded with 13 rows).
2. Write and apply `0069_county_facet_coverage_rail_state.sql` (additive columns + 3 new CHECK constraints on `county_facet_coverage`; zero data loss, all existing rows remain valid since every new column is nullable).
3. Add Drizzle schema files `countyManifest.ts`, `countyRail.ts`; extend `countyFacetCoverage.ts` with the 7 new columns and 3 new checks; export all from `lib/db/src/schema/index.ts` (unread this session — verify export pattern before writing).
4. Write the one-time roster-load script (`county_manifest` 254-row seed per section 7's table) as a CLI under `artifacts/api-server/src/` alongside `countyCoverageScoreCli.ts`, reading `_catalog/texas_roster_v1.json` — this requires the roster file to be available to the `legacy-design-tools` build/runtime, which it currently is NOT (ledger audit section 7: the roster lives only in `doc_repo`). **Open dependency**: decide whether the seed script reads the file from a checked-in copy inside `legacy-design-tools`, a build-time fetch from `doc_repo`, or an operator-supplied path at run time.
5. Run the seed script once against target Postgres; verify row count `SELECT COUNT(*) FROM county_manifest` = 254 and `SELECT COUNT(*) FROM county_rail` = 13.
6. Write and run the zoning-cell seed (section 7's `satisfied-absent` pass for the 254 unincorporated-county doctrine rows) — either folded into step 4's script or a separate idempotent pass; must not overwrite any of the live 19-county real zoning scores from `countyCoverageScoreCli.ts` (the seed should `INSERT ... ON CONFLICT (county_fips, facet) DO NOTHING`, never overwrite a scorer-written row with a roster default).
7. Rewrite `countyLedger.ts:91` per section 5; add the `manifestCells` field to the response; leave the existing `counties[]` shape untouched for the current panel.
8. Build the `manifest_grid_view` (or materialize the item-5 query as a Postgres VIEW rather than inline SQL in the route, for reuse by the rollup query in section 6 and any future CLI).
9. Verify live: hit `/api/county-ledger`, confirm `summary.totalCounties === 254`, `summary.totalCells === 3302`, and spot-check that a rail with `atom_family_state != 'present'` (e.g. `geometry`) shows `no-atom` for every county in `manifestCells`, never a stored value.
10. Frontend: new manifest-grid view consuming `manifestCells`, matching the mockup's layout — explicitly the LAST step and explicitly NOT required to ship Sprint 1's backend truthfully; the API can be verified and correct before any UI consumes it.

## OPEN QUESTIONS FOR THE MASTER PLANNER

1. **Land-use display regression.** Under this spec's precedence rule (no-atom dominates), the 19 counties with real, scored `land-use` coverage in the live ledger today will display `no-atom` instead of their scored percentage, because `land-use` has no atom family (contract audit, confirmed live). Is this the intended reading of "no-atom must dominate," or should a rail with `has_writer = true` but `atom_family_state = missing` get a distinct fifth display state (e.g. `scored-not-atomized`) so real, honest scorer output isn't hidden behind the same tag as a rail nobody has ever touched? The task's CRITICAL instruction says a cell with no scorer must never render as fake — but land-use DOES have a scorer; it just has no atom. This spec chose strict no-atom-dominates for internal consistency with the mockup's own open question 1 answer, but it is a real product tradeoff, not a mechanical default, and should be confirmed rather than inherited silently.
2. **McLennan easement enum conflict (S5).** This spec recommends blocking the entire 254-county easement seed on resolving whether the roster's `cad-easement-rest` value or the contract's four-value enum is canonical, rather than seeding 253 and leaving one county inconsistent. Confirm that sequencing, or accept the partial seed with McLennan flagged.
3. **Where does the 254-county roster live at runtime?** Build order step 4 surfaces a real, unresolved dependency: `_catalog/texas_roster_v1.json` is a doc_repo-only file today, and `legacy-design-tools` (where the seed script must run) cannot see it. This blocks step 4 until resolved and was out of scope for a read-only schema spec to decide.
4. **Threshold values remain unset.** `county_rail.threshold_pct` is seeded at the ruling's tuning-start values (95 spine / 90 derived) per section 2's INSERT. Ruling 3 explicitly leaves these for tuning against measured reality — confirm these starting values are acceptable to seed literally, since the CHECK constraint's absence means changing them later is a one-row UPDATE, not a migration, so the cost of shipping with a placeholder is low, but the console will display these numbers to the operator as if declared, not placeholder.
5. **`manifestCells` as a new top-level field vs. restructuring `counties[]`.** Section 5 chose additive-only to avoid forcing a simultaneous frontend rewrite. Confirm that is the right scope boundary for "thin slice," or whether the existing `CountyLedger.tsx` panel should be retired/replaced in the same sprint rather than left to read a now-partially-superseded shape.
