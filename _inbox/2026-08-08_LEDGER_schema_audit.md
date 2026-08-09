---
id: 2026-08-08_LEDGER_schema_audit
title: County Ledger schema audit — can the live ledger carry 254 x 13 three-state?
date: 2026-08-08
status: active
owner: planner
related: [_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _catalog/texas_roster_v1.json, 90_operations/PHASE_C_HANDOFF_bastrop_warm, _inbox/2026-08-04_factory_onboarding_runbook_DRAFT]
---

# County Ledger schema audit

Read-only audit against live source in `P:\legacy-design-tools`, `P:\hauska-map`, and the deployed cortex-api. Target model is the operator ruling at `_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md`: 254 counties x 13 required rails, three states per cell, thresholds and per-cell provenance.

## Verdict up front

**Question 6 answer: SCHEMA EXTENSION on the cell table, plus a genuinely NEW manifest table. Not a fill, not a full rebuild.**

The cell table `county_facet_coverage` is already keyed `(county_fips, facet)`, so the rail dimension exists and the grid shape survives. What does not exist anywhere is the denominator: there is no table, no seed, and no query path that enumerates all 254 counties or all 13 rails. The ledger is a work-product table, and the endpoint reads it directly with no LEFT JOIN from any county list. The three-state model also has no home, the current vocabulary cannot distinguish honest-absence from unacquired.

**Question 3 answer: NO. The ledger has rows only where work happened.** Measured live: 19 counties, 3 facets. Not 254, not 13.

## 1. What exists today

**Endpoint.** `GET /api/county-ledger`, mounted at `P:\legacy-design-tools\artifacts\api-server\src\routes\index.ts:107-108`:

```
// Reachable at /api/county-ledger (mounted under the /api router).
router.use("/county-ledger", countyLedgerRouter);
```

Imported at `P:\legacy-design-tools\artifacts\api-server\src\routes\index.ts:55`.

**Handler.** `P:\legacy-design-tools\artifacts\api-server\src\routes\countyLedger.ts`, the router defined at line 23 and the single GET at line 89. Tests at `P:\legacy-design-tools\artifacts\api-server\src\__tests__\countyLedger.test.ts`.

**Front-end panel.** `P:\hauska-map\apps\command-center\src\admin\control\panels\CountyLedger.tsx` (component exported line 570). Registered at `P:\hauska-map\apps\command-center\src\admin\control\center\PanelRegistry.ts:69`:

```
{ id: 'county-ledger', label: 'County Ledger', group: 'Engines', probe: 'cortex-coverage', Component: CountyLedger },
```

The panel fetches `${api}/api/county-ledger` at `CountyLedger.tsx:592-596`. Tests at `CountyLedger.test.tsx`.

**Writer.** The only writer of `county_facet_coverage` is the per-county scorer CLI at `P:\legacy-design-tools\artifacts\api-server\src\countyCoverageScoreCli.ts` (upsert function `upsertLedger` at line 621, INSERT at line 626-629).

**Supporting tables** joined additively by the handler (`countyLedger.ts:95-102`): `jurisdiction_registry_row_mirror`, `county_gate_cert_state`, `onboarding_ledger_event`.

## 2. The `county_facet_coverage` table

Migration `P:\legacy-design-tools\lib\db\drizzle\0060_county_facet_coverage.sql:30-50`, verbatim:

```sql
CREATE TABLE IF NOT EXISTS "county_facet_coverage" (
  "county_fips" text NOT NULL,
  "facet" text NOT NULL,
  "honest_coverage_pct" numeric(5, 2) NOT NULL DEFAULT '0'::numeric,
  "integrity_verdict" text NOT NULL,
  "owner_match_rate" numeric(5, 4),
  "source" text,
  "source_vintage" text,
  "sampled" integer NOT NULL DEFAULT 0,
  "classification" text NOT NULL,
  "checked_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "county_facet_coverage_county_fips_facet_pk"
    PRIMARY KEY ("county_fips", "facet"),
  CONSTRAINT "county_facet_coverage_integrity_verdict_check"
    CHECK ("integrity_verdict" IN
      ('pass', 'block', 'insufficient-sample', 'n/a')),
  CONSTRAINT "county_facet_coverage_classification_check"
    CHECK ("classification" IN
      ('real-at-ceiling', 'needs-crosswalk', 'true-source-gap',
       'fabricated-blocked'))
);
```

Extended additively by `P:\legacy-design-tools\lib\db\drizzle\0064_county_facet_coverage_performance_fields.sql:28-41`, verbatim:

```sql
ALTER TABLE "county_facet_coverage"
  ADD COLUMN IF NOT EXISTS "recipe_version" text,
  ADD COLUMN IF NOT EXISTS "cert_state" text,
  ADD COLUMN IF NOT EXISTS "last_rewarm_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "last_refresh_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "staleness_flag" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "rewarm_unsafe" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "cost_usd" numeric(10, 2),
  ADD COLUMN IF NOT EXISTS "onboarded" boolean NOT NULL DEFAULT false;

ALTER TABLE "county_facet_coverage"
  ADD CONSTRAINT "county_facet_coverage_cert_state_check"
    CHECK ("cert_state" IS NULL OR "cert_state" IN
      ('uncerted', 'mechanical-pass', 'r6-pass', 'certified'));
```

The live-schema fixture at `P:\legacy-design-tools\lib\db\src\__tests__\__fixtures__\schema.sql.template:590-612` confirms the applied shape matches (all 18 columns, three check constraints). Drizzle model at `P:\legacy-design-tools\lib\db\src\schema\countyFacetCoverage.ts:45-157`.

**Can it represent per-rail state? Yes, structurally.** The primary key is `(county_fips, facet)` (`0060_county_facet_coverage.sql:41-42`), so it is already one row per county per rail, not one row per county. The `facet` column is free `text` with no enum constraint (`countyFacetCoverage.ts:51`), so adding ten more rail names requires no DDL change to the column itself.

**But the rail vocabulary in practice is 3, not 13.** The scorer emits exactly three facets, hardcoded at `countyCoverageScoreCli.ts:616`:

```
    facets: [landUse, zoning, envelope],
```

constructed at `countyCoverageScoreCli.ts:538` (`facet: "land-use"`), `:591` (`facet: "zoning"`), `:602` (`facet: "envelope"`). Confirmed live (section 3). Of the ruling's 13 rails, only three have any representation, and `envelope` is a derived rail; parcel geometry, CAD attributes, join quality, roads/frontage, flood/terrain, building footprints, utility easements, owner facet, RRC, and MUD have no facet rows at all.

Note that `join_quality` is measured but not stored as its own rail: it lives as the `owner_match_rate` column on the land-use row (`countyFacetCoverage.ts:71`), not as a peer cell.

## 3. The denominator problem — decisive

**The query is a bare SELECT from the work-product table.** `countyLedger.ts:91`, verbatim:

```ts
    const rows = await db.select().from(countyFacetCoverage);
```

There is no LEFT JOIN, no county list, no seed. The county set is built by iterating whatever rows came back (`countyLedger.ts:112-128`), and `totalCounties` is literally the length of that map (`countyLedger.ts:221`):

```ts
        totalCounties: counties.length,
```

The only other source of county entries is the registry mirror loop at `countyLedger.ts:160-177`, which creates a county entry for a mirror row that has no coverage rows. That mirror is itself a work product: `jurisdiction_registry_row_mirror` is described in `0065_onboarding_ledger.sql:19-22` as "a read-side mirror of hauska-engine's frozen JurisdictionRegistryRow ... upserted from the ingest contract's rowMirror payload", a row exists only after an onboarding run posted it.

**The write path also skips unworked counties.** `countyCoverageScoreCli.ts:713-719`:

```ts
    for (const fips of targets) {
      const county = await locateCounty(pool, fips);
      if (!county) {
        log(`county ${fips} has no parcels in either table — skipping`);
        skipped += 1;
        continue;
      }
```

A county with no parcels loaded produces no row at all, not a `not-yet` row. And `targets` under `--all` is not 254 counties; it is a hardcoded ten-entry map (`countyCoverageScoreCli.ts:698`):

```ts
  const targets = all ? Object.keys(COUNTY_NAMES) : [single as string];
```

`COUNTY_NAMES` is defined at `countyCoverageScoreCli.ts:63-74` and contains exactly ten FIPS: Hays, Comal, Travis, Williamson, Bexar, Bastrop, Caldwell, Guadalupe, Bell, McLennan.

**Empirical confirmation from the deployed endpoint.** `GET https://cortex-api-1062716564162.us-central1.run.app/api/county-ledger` returned HTTP 200, 35444 bytes. Parsed:

```
summary: {"onboardedCount": 1, "totalCounties": 19, "staleCount": 0, "rewarmUnsafeCount": 0}
TOTAL county entries in payload: 19
distinct facet names + row counts: {'land-use': 19, 'zoning': 19, 'envelope': 19}
counties with >=1 facet row: 19
counties with >=1 registry row: 10
```

Per-county detail as served:

```
48021 Bastrop    land-use 98.01 pass    zoning 99.77 n/a   envelope 99.77 n/a   rows=3
48027 Bell       land-use 77.76 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=1
48029 Bexar      land-use 87.85 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=1
48055 Caldwell   land-use 95.48 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=1
48085 (no name)  land-use 99.42 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=0
48091 Comal      land-use  0.00 insufficient-sample  zoning 25.82 n/a  envelope 25.82 n/a  rows=1
48113 (no name)  land-use 92.83 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=0
48121 (no name)  land-use 86.59 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=0
48139 (no name)  land-use  0.00 insufficient-sample  zoning 0.00 n/a  envelope 0.00 n/a  rows=0
48187 Guadalupe  land-use 78.18 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=1
48209 Hays       land-use 81.29 pass    zoning  3.61 n/a   envelope  3.61 n/a   rows=1
48251 (no name)  land-use  0.00 insufficient-sample  zoning 0.00 n/a  envelope 0.00 n/a  rows=0
48257 Kaufman    land-use 75.25 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=1
48309 McLennan   land-use 79.21 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=1
48367 (no name)  land-use  0.00 insufficient-sample  zoning 0.00 n/a  envelope 0.00 n/a  rows=0
48397 (no name)  land-use  0.00 insufficient-sample  zoning 0.00 n/a  envelope 0.00 n/a  rows=0
48439 (no name)  land-use 99.38 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=0
48453 (no name)  land-use 46.76 pass    zoning  0.00 n/a   envelope  0.00 n/a   rows=0
48491 Williamson land-use 89.14 pass    zoning 33.98 n/a   envelope 33.98 n/a   rows=1
```

19 counties of 254 (7.5 percent), 3 rails of 13. The grid the ruling requires is 3,302 cells; the live ledger holds 57 plus 10 registry rows.

Two further observations from this payload. First, nine of the 19 counties have no `countyName`, county naming currently arrives only via the registry mirror (`countyLedger.ts:65`, `:176`), so unworked counties would render as a bare FIPS. Second, the `onboardedCount` of 1 against `totalCounties` of 19 shows the summary is already a ratio over the worked set, not over Texas.

## 4. State model

**There is no three-state model, and no notion of honest-absence-as-satisfied.** The cell carries two independent classification vocabularies, both enforced as CHECK constraints, neither of which encodes the ruling's distinction.

`integrity_verdict`, per `0060_county_facet_coverage.sql:43-45`:

```sql
  CONSTRAINT "county_facet_coverage_integrity_verdict_check"
    CHECK ("integrity_verdict" IN
      ('pass', 'block', 'insufficient-sample', 'n/a'))
```

`classification`, per `0060_county_facet_coverage.sql:46-49`:

```sql
  CONSTRAINT "county_facet_coverage_classification_check"
    CHECK ("classification" IN
      ('real-at-ceiling', 'needs-crosswalk', 'true-source-gap',
       'fabricated-blocked'))
```

`cert_state`, per `0064_county_facet_coverage_performance_fields.sql:38-41`:

```sql
  ADD CONSTRAINT "county_facet_coverage_cert_state_check"
    CHECK ("cert_state" IS NULL OR "cert_state" IN
      ('uncerted', 'mechanical-pass', 'r6-pass', 'certified'));
```

Mapping these against the ruling's three states:

- `satisfied-present` has a rough analogue in `classification = 'real-at-ceiling'` with `integrity_verdict = 'pass'`, but there is no threshold anywhere, nothing compares `honest_coverage_pct` against a declared value. Ruling 3's SATISFIED/PARTIAL/ABSENT tiering does not exist.
- `satisfied-absent` has NO representation. The closest is `true-source-gap`, but the doc comment at `0060_county_facet_coverage.sql:12-14` shows absence is recorded as a coverage number, not a verdict: "For land-use a BLOCKED join records 0 (honest-absence), never the fabricated stamp rate." So honest absence and unacquired both land as `0.00`, indistinguishable. The live payload demonstrates this exactly: every county's `zoning` reads `0.00 / n/a`, whether that is a genuinely unzoned unincorporated county (satisfied-absent under the ruling) or a city that simply has not been stamped (not-yet). The two are collapsed today.
- `not-yet` has NO representation, because an unacquired rail has no row at all. Absence of a row is the only signal, and absence of a row is exactly what makes the denominator uncountable.

There is a threshold-shaped constant in the classifier, but it is not a per-rail declared threshold; classification logic lives in `countyCoverageScoreCli.ts:90-93` (the `Classification` union) and `classifyFacet`. No `threshold` column exists on the table.

## 5. What the panel actually renders

Verified against `P:\hauska-map\apps\command-center\src\admin\control\panels\CountyLedger.tsx`. The table header is declared at lines 656-662, five columns:

```
County / jurisdiction row | Gate | Cert | Open defect classes | Focused-fix
```

Checking each claim in `_inbox/2026-08-04_factory_onboarding_runbook_DRAFT.md:215`:

| Runbook claim | Real? | Evidence |
|---|---|---|
| Gate verdict, 8 checks, PASS/decline chips with named reasons | REAL | `GateCell` lines 154-195; `{pass}/{total || 8}` at line 172, per-check `outcome`/`id`/`reason` at lines 176-186 |
| Cert label, date, scopeAnnotations count | REAL | `CertCell` lines 198-236; label line 212, annotations count line 215, `graded {gradedAt}` line 222 |
| Per-rail coverage with correct percent-math denominator | PARTIAL / MISLEADING | Coverage renders only in the legacy `FacetCoverageRow` (lines 499-531), and only for the 3 facets that exist. The percent-math fix is real and commented at lines 507-509 (the 9801.0% bug). But "per-rail" over 13 rails is aspirational, there are 3 |
| Open defect classes | REAL | `DefectClassesCell` lines 258-271 |
| Focused-fix parcel count (expandable) | REAL | `FocusedFixCell` lines 367-477, lazily fetching `/api/onboarding-ledger/events` at line 380 |
| Source vintages / staleness flags | REAL | `sourceVintage` rendered line 514; `stale` pill lines 518-522; `unsafe` pill lines 523-527 |

Summary pills render `{certified}/{totalRows} certified` (line 632), computed by `countCertifiedRows` (lines 139-149) over registry rows, again a ratio over worked rows, never over 254.

The empty state at lines 647-651 reads "No county has been through the factory line yet", confirming the panel's own mental model is a run log, not a manifest. There is a per-county empty branch at lines 553-559 ("no coverage or ledger data for this county yet") which would be the natural render slot for a `not-yet` county, but it only fires for a county that already has an entry from one of the two work-product sources.

## 6. The gap — what changes

**SCHEMA EXTENSION on the cell table, plus a NEW manifest table.** Concretely:

**New: a county manifest table** (this is the missing piece and the real work). Something like `county_manifest (county_fips PK, county_name, parcel_count_est, in_stratmap, risk_class, ...)`, seeded with all 254 rows. Without it there is nothing to LEFT JOIN from, and the completeness denominator cannot exist. `_catalog/texas_roster_v1.json` is the natural seed (see section 7).

**New: a rail dimension**, either a `rail` lookup table with the 13 names and their declared thresholds, or a hardcoded 13-entry constant. The cross product of manifest x rails is what makes an unworked cell renderable as `not-yet`.

**Extend `county_facet_coverage`** (additive columns, existing rows survive):
- `rail_state text` with a new CHECK for `('satisfied-present', 'satisfied-absent', 'not-yet')`. This is a genuinely new axis and cannot be folded into `integrity_verdict` or `classification` without corrupting both, which carry join-integrity meaning, not acquisition meaning.
- `threshold_pct numeric(5,2)`, ruling 3 requires a declared per-rail threshold to compute SATISFIED vs PARTIAL. Nothing today stores one.
- `absence_basis text` (nullable), the public-record evidence that justifies `satisfied-absent`. Ruling 2 makes absence a finding; a finding needs its citation, or the state is unfalsifiable.

**Change the existing CHECK constraints**: none of the three need their values altered, but the new `rail_state` CHECK must be added. The `facet` column needs no DDL change (free text), though the 13 rail names should be constrained or FK'd to the rail table to prevent typo-drift.

**Rewrite the handler query** at `countyLedger.ts:91`. The bare `db.select().from(countyFacetCoverage)` becomes a LEFT JOIN from `county_manifest` cross-joined with the 13 rails, so every county and every rail appears with `not-yet` as the default for a missing cell. `totalCounties` at line 221 becomes 254 by construction rather than by accident of what was worked.

**Rewrite the scorer's target set** at `countyCoverageScoreCli.ts:698`. `COUNTY_NAMES` (10 entries, lines 63-74) is replaced by a read from the manifest. The skip-on-missing branch at lines 715-719 must write a `not-yet` row rather than `continue`, or the manifest LEFT JOIN must supply the default (the latter is cleaner and keeps the scorer honest about only writing what it measured).

**Extend the panel** to add rail-state columns and a per-county `satisfied/13` completeness cell, plus the Texas rollup weighted by parcel count. The existing five columns survive; the facet row rendering (lines 499-531) generalizes to 13 rails.

**What does NOT need to change:** the `(county_fips, facet)` primary key, `honest_coverage_pct`, `source`, `source_vintage`, `checked_at`, the whole `onboarding_ledger_event` / `county_gate_cert_state` / `jurisdiction_registry_row_mirror` triple, and the gate/cert/defect/focused-fix rendering. That is why this is an extension and not a rebuild, the cell grain is already correct.

## 7. Is `_catalog/texas_roster_v1.json` ingested anywhere?

**No. It lives only as a file in doc_repo.**

Searched all three code repos for the string `texas_roster`, excluding `node_modules` and `.git`: zero hits in `P:\legacy-design-tools`, zero in `P:\hauska-map`, zero in `P:\hauska-engine`. Every reference to it is inside `P:\doc_repo` (14 files: the decision, the decision sheet, OPS-1, the T6 track docs, and the `_scratch` python builders that produced it).

Searched `P:\legacy-design-tools\lib\db` and `P:\hauska-engine` for any table named like a manifest (`county_manifest`, `county_registry`, `all_counties`, `texas_counties`): zero hits. The migration set runs 0048 through 0067 and contains no county-seed migration.

Structure confirmed by direct read:

```
schema keys: ['schema_version', 'generated_at', 'method', 'coverage', 'counties', 'cities', 'city_recon_coverage']
counties: 254
county row keys: ['record_type', 'fips', 'name', 'identity', 'geometry', 'cadastral',
                  'join_quality', 'zoning_regime', 'code_text', 'rails', 'risk_class', 'cost_estimate']
```

This is exactly the manifest seed the model needs, and it already maps onto several of the 13 rails directly: `geometry` carries rail C with `in_stratmap`, vintage, feature count, and verification state; `cadastral` carries rail B with service URL and `verification: partial|verified`; `join_quality` carries `owner_match_gate_required`; `zoning_regime` carries `unincorporated: unzoned` with `doctrine: "PASS, county unincorporated = honest absence"`, which is a literal pre-computed `satisfied-absent` for the zoning rail; `rails` carries `footprint_tier` and easement fields. The roster also already carries per-county `parcel_count_est` (43,894 for Anderson), which is the weight the Texas rollup needs.

The seed work is therefore a load, not a derivation. The roster's `verification` fields would need mapping onto the new `rail_state` vocabulary, and its per-rail evidence pointers onto `absence_basis` / `source`.

## WHAT I COULD NOT DETERMINE

- **Whether the deployed database schema exactly matches the migration files.** I read the DDL from `lib/db/drizzle/*.sql` and the applied-schema fixture at `lib/db/src/__tests__/__fixtures__/schema.sql.template`, and I confirmed the endpoint returns all the expected fields live, which is strong evidence the migrations are applied. But I did not run `information_schema` queries against the deployment Neon (no credentials in this session, and MEMORY.md `migration-merged-not-applied-to-deployment-neon` warns these can diverge). The live payload's shape is my proxy.
- **Whether any rows exist in `county_facet_coverage` with facet names beyond the three.** The live endpoint returned only `land-use`, `zoning`, `envelope` across all 19 counties, and the scorer can only emit those three, so I am confident, but a hand-written INSERT from some other path would not show up in my code search. I searched writers by grepping `county_facet_coverage` across `P:\legacy-design-tools` (13 files, all read paths, the schema, the migrations, the scorer, the join gate, and tests) and found no second writer.
- **Which cortex-api revision is serving.** Both `cortex-api-1062716564162.us-central1.run.app` and `cortex-api-tds7av26va-uc.a.run.app` returned byte-identical 35444-byte payloads, so they are the same service. I did not check the serving revision against main's HEAD (MEMORY.md `cloud-run-traffic-trap`), so the deployed handler could in principle lag the source I read. The payload shape matches the source exactly (including the `rows` array from the OPS-9 S1 additive join), which argues they are in sync.
- **Whether hauska-engine holds a separate 254-county registry.** I grepped `P:\hauska-engine` for `texas_roster` and for manifest-shaped table names and found nothing, but the engine's `JurisdictionRegistryRow` is described in `0065_onboarding_ledger.sql:19-22` as the source of truth that `jurisdiction_registry_row_mirror` mirrors. I did not exhaustively enumerate the engine's registry contents to confirm it is a worked-rows list rather than a 254-row manifest. The mirror holding only 10 rows live suggests it is worked-rows, but that is inference, not measurement.
- **The exact threshold values to declare per rail.** Ruling 3 deliberately leaves these unfixed (95 percent spine / 90 percent derived as a tuning start), so there is nothing in code to audit against.
