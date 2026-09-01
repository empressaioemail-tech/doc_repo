---
id: factory_1_5_acquisition_staging
title: Factory 1.5 — Acquisition and Staging Runbook
status: active
last_updated: 2026-08-12
date: 2026-08-11
applies_to: portfolio
owner: nick
related:
  [
    90_runbooks/factory_onboarding_runbook,
    90_operations/OPS-13_store_topology,
    90_operations/OPS-1_texas_source_registry,
    90_operations/OPS-7_coverage_and_honesty_doctrine,
    90_operations/OPS-14_texas_flush_game_plan,
    _inbox/2026-08-11_CONNECTOR_factory_seam_inventory,
    _inbox/2026-08-11_FACTORY_operating_procedure_of_record,
    _catalog/tx_cad_source_registry.json,
  ]
---

# Factory 1.5 — Acquisition and Staging Runbook

Purpose: the operator procedure for Factory 1.5, the acquisition and staging tier. Find, fetch, parse, normalize, and **persist** payloads with provenance into `neondb`. This tier is network-bound, failure-prone, and **infinitely parallel**. It does **not** inherit the one-bulk-writer-per-database slot rule that governs Factory 1 atom writes; only Factory 1 atom writes serialize. Once a county appears in `txgio_parcel`, Factory 1 (`write-parcel-node-county.mjs`) can drain it without an allowlist.

## Standing decisions (do not violate)

- **Cotality is EXTINGUISHED** — re-route, never rotate its credential.
- **Deploys are planner-owned** — never escalate a deploy to the operator.
- **No privileged data access** — uniform public-record only.
- **CTX / national is HELD** until Bastrop QA-done and operator go.
- **Code-done != customer-done** — a grade is a live probe on the deployed surface, never a merged PR.

Registry/source availability is not data-loaded. Every coverage figure in this doc names which leg it measures. See `90_operations/OPS-7_coverage_and_honesty_doctrine.md`.

## What Factory 1.5 is

Factory 1.5 is the tier between public sources and Factory 1 (parcel-node atom minting). Its job ends when staged rows exist in `neondb` with vintage provenance, projection verdict, and source citation. It does not mint atoms, warm envelopes, or serve product.

The code already exists. It is **`legacy-design-tools/lib/cad-ingest`**. What was missing until this runbook is a named tier, a queue posture, verbatim invocations, and a close-artifact contract. Per `_inbox/2026-08-11_CONNECTOR_factory_seam_inventory.md`, the retier is mostly naming, queue, and documentation; the blockers for state two are portability fixes in this tier, not a greenfield build.

## Prerequisites — read before touching anything

1. `90_operations/OPS-13_store_topology.md` — one Neon endpoint, two databases, pooler hazard, propagation legs.
2. `90_operations/OPS-1_texas_source_registry.md` — Texas source registry shape, four-point probe rule, frozen row schema.
3. `_inbox/2026-08-11_CONNECTOR_factory_seam_inventory.md` — acquisition section, portability blockers, handoff to Factory 1.
4. `90_runbooks/factory_onboarding_runbook.md` section "Operate-not-rebuild" — reuse discipline applies here too.

**Credentials.** Acquisition writes to `neondb` only (parcels, addresses, boundaries, flood, CAD attributes). Resolve from Secret Manager:

```
gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project=legacy-design-tools-prod
```

`CORTEX_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` are byte-identical; both name `neondb`. Atoms live in `DATABASE_URL` / `hauska_mcp` and are **out of scope** for Factory 1.5 except as a read-only verification target after Factory 1 drains a county.

**Repo.** Run from `P:/legacy-design-tools`. Package: `@workspace/cad-ingest`.

## Code home — `lib/cad-ingest` modules

| Module | Path | Target table(s) | Role |
|---|---|---|---|
| **txgio/** | `src/txgio/` | `txgio_parcel` | Rail C parcel geometry: StratMap bulk zip per county, shapefile parse, projection guards, county replace semantics. CLI: `txgio-ingest`. |
| **address/** | `src/address/` | `txgio_address` | StratMap address points, paginated ArcGIS REST per county. CLI: `address-ingest`. |
| **boundary/** | `src/boundary/` | city + county boundary tables | L1 uniform layers: TxGIO city limits, Census TIGER counties. CLI: `boundary-ingest`. |
| **nfhl/** | `src/nfhl/` | `tx_fema_nfhl_flood_zone` | FEMA NFHL statewide flood polygons from bulk FileGDB. CLI: `nfhl-ingest`. |
| **pacs/** | `src/pacs/` | `cad_property` (via shared ingest) | PACS fixed-width appraisal export parser (Travis, Bastrop, Caldwell). |
| **orion/** | `src/orion/` | `cad_property` | Orion CSV parser (Hays, Williamson). |
| **permits/** | `src/permits/` | `permit_record` | Municipal permit CSV corpus (Austin, San Antonio). CLI: `permits-ingest`. |
| **Shared** | `src/cli.ts`, `src/ingest.ts`, `src/counties.ts`, `src/sources.ts`, `src/jurisdictions.ts` | `cad_property` | CAD bulk roll orchestration; read-only jurisdiction composition view. |

**npm scripts** (from `lib/cad-ingest/package.json`):

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- ...
pnpm --filter @workspace/cad-ingest address-ingest -- ...
pnpm --filter @workspace/cad-ingest boundary-ingest -- ...
pnpm --filter @workspace/cad-ingest nfhl-ingest -- ...
pnpm --filter @workspace/cad-ingest cad-ingest -- ...
pnpm --filter @workspace/cad-ingest permits-ingest -- ...
```

**Trap:** for address and boundary CLIs, prefer `pnpm exec tsx src/<module>/cli.ts` when argument parsing breaks on extra `--` injection (documented in `address/cli.ts` header).

## Slot posture — Factory 1.5 is SLOT-FREE

Factory 1 enforces **one bulk writer per database** for atom writes (`hauska_mcp`). Factory 1.5 does **not** inherit that rule.

| Tier | Store | Concurrency rule |
|---|---|---|
| Factory 1.5 (this runbook) | `neondb` | Network-bound lanes may run in parallel across **counties** and **layers**, subject to the `txgio_parcel` write cap below. |
| Factory 1 (connector) | `hauska_mcp` | One atoms bulk writer at a time. Record handoff in `_STATE.md`. |

**Exception that still binds:** concurrent **writes to `txgio_parcel`** must stay at **1–2** total, even when counties are disjoint. County-disjoint keys do not imply index-disjointness; 8-way concurrency deadlocked with Postgres `40P01` during Wave 3 (evidence in `90_operations/OPS-13_store_topology.md`).

Parallelism that is safe: different tables (`txgio_parcel` + `txgio_address` + boundary load), different counties when total `txgio_parcel` writers ≤ 2, read-only dry-runs, and network-bound downloads that have not yet opened a write transaction.

## Staging procedure — every acquisition lane

These steps apply to **every** Factory 1.5 apply, regardless of layer.

### S1 — Resolve the direct host (mandatory before any bulk write)

Strip `-pooler` from the connection string. Print the resolved host and confirm it has no `-pooler` before the first write.

```
DIRECT=$(echo "$DEPLOYMENT_DATABASE_URL" | sed 's/-pooler//')
export DATABASE_URL="$DIRECT"
echo "$DATABASE_URL" | sed -E 's/:[^:@]+@/@/'   # fingerprint host only, no password
```

Operating rule stands on **cost asymmetry**, not a proven pooler mechanism: direct host costs nothing and removes one candidate cause of intermittent `25006` read-only errors. Full evidence and limits: OPS-13 pooler section.

### S2 — Dry-run must predict apply

Every apply-capable CLI supports `--dry-run`. Run dry first. The dry summary must be **explainably comparable** to apply: features parsed, rows would delete, rows would insert, projection verdict, source vintage. Mismatch without a named benign cause is a STOP.

### S3 — Concurrency on `txgio_parcel`

Hold active writers on `txgio_parcel` to **1–2**. Queue additional counties; do not launch an 8-way wave.

### S4 — Vintage provenance

Every persisted row carries provenance the warm path can read later:

- `source_file` — archive or URL basename
- `source_vintage` — shapefile or layer vintage label (default: basename, e.g. `stratmap25-landparcels_48209_hays_202503`)
- Reprojection suffix when applicable: `+reprojected-from-epsg3857` (operator ruling 2026-08-08)

Record the vintage string in the close artifact. Stale vintage loaded with fresh intent is a registry defect, not a silent success.

### S5 — Projection guards

Texas parcel ingest (`txgio/parse.ts`) enforces per-feature coordinate range via `assertTexasWgs84Bbox`. The guard runs **after** optional `--reproject=3857` conversion; reprojection is never a bypass.

| Condition | Action |
|---|---|
| GCS WGS84 degrees in Texas envelope | Proceed |
| EPSG:3857 Web Mercator (202505 vintage) | Re-run with `--reproject=3857`; guard runs on converted coords |
| PROJCS other than supported 3857 path | Fail closed; do not load |
| Multi-shapefile archive (Harris 48201) | `--multi-shp=concat`; never silently take `files.find()` first match |

NFHL ingest reuses the same Texas envelope assertion (`nfhl/parse.ts` imports `assertTexasWgs84Bbox`).

### S6 — Apply and post-verify

After apply, query the store at execution time (never trust process memory alone):

```sql
-- parcel geometry leg
SELECT county_fips, count(*), count(DISTINCT source_file), min(source_vintage), max(source_vintage)
  FROM txgio_parcel WHERE county_fips = '<FIPS>' GROUP BY county_fips;
```

For multi-file counties, verify `count(DISTINCT source_file)` against the **source archive**, not the store alone. A single-file reader always reports 1 in the store even when the archive held more (Harris case, OPS-13).

### S7 — File the close artifact

See [Close-artifact contract](#close-artifact-contract) below. Acquisition is not done until the artifact lands in `_inbox/`.

## Acquisition lanes — verbatim invocations (Texas)

All commands assume `DATABASE_URL` points at the **direct** `neondb` host unless `--dry-run` only.

### Lane C — Parcel geometry (Rail C spine)

Primary CLI header: `lib/cad-ingest/src/txgio/cli.ts`.

**List loaded vs unloaded counties:**

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- --list
```

**Dry-run one county (default: TxGIO per-county zip):**

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- \
  --county=48079 \
  --dry-run
```

**Apply (degrees vintage):**

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- \
  --county=48079 \
  --batch-size=250
```

**Apply (202505 EPSG:3857 vintage — opt-in reprojection):**

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- \
  --county=<FIPS> \
  --reproject=3857 \
  --batch-size=250
```

**Multi-shapefile county (Harris 48201 only at time of writing):**

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- \
  --county=48201 \
  --multi-shp=concat \
  --batch-size=250
```

**Local file override (probe or re-load without re-download):**

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- \
  --county=<FIPS> \
  --file=<local zip | dir | .shp | https URL> \
  [--vintage=<label>] \
  [--dry-run]
```

Replace semantics: one transaction deletes the county's existing rows then inserts the new set. Re-runs are idempotent at the county grain.

**Multi-county Wave 4 reprojection (57 Web Mercator counties):** do not hand-roll a new orchestrator. Use the versioned driver at `P:/hauska-engine/packages/engine-core/scripts/sweep/wave4_reproject_orchestrator.mjs` with `--out-dir`, `--ingest-repo-path=P:/legacy-design-tools`, and `--matrix-path` pointing at the county source matrix. The worker runs `txgio-ingest --reproject=3857` via `@workspace/cad-ingest`, enforces dry/apply parity, reprojection vintage markers, Census bbox verification, and idempotent apply2. Full invocation lives in `90_runbooks/factory_1_statewide_fabric.md` Wave 4 section. Close 2026-08-11: `_inbox/2026-08-11_P2-2_wave4_reprojection_close.json`.

### Lane A — Address points

```
pnpm exec tsx lib/cad-ingest/src/address/cli.ts \
  --county=48453 \
  --count-only

pnpm exec tsx lib/cad-ingest/src/address/cli.ts \
  --county=48453 \
  --dry-run \
  --limit=500

pnpm exec tsx lib/cad-ingest/src/address/cli.ts \
  --county=48453 \
  --batch-size=1000
```

Statewide crawl is the operator looping per county; one invocation does not pull the full ~11.7M REST total.

### Lane L1 — Boundaries

```
pnpm exec tsx lib/cad-ingest/src/boundary/cli.ts \
  --count-only \
  --layer=both

pnpm exec tsx lib/cad-ingest/src/boundary/cli.ts \
  --dry-run \
  --layer=both

pnpm exec tsx lib/cad-ingest/src/boundary/cli.ts \
  --layer=both \
  --batch-size=100
```

Sources probed 2026-08-08: TxGIO city limits (~1,225), Census TIGER counties (254 for Texas). See `boundary/service.ts` header for four-point probe evidence.

### Lane D — NFHL flood

```
pnpm exec tsx lib/cad-ingest/src/nfhl/cli.ts \
  --count-only

pnpm exec tsx lib/cad-ingest/src/nfhl/cli.ts \
  --dry-run \
  --limit=100

pnpm exec tsx lib/cad-ingest/src/nfhl/cli.ts \
  --batch-size=250
```

Default source: FEMA statewide bulk `NFHL_48_*.zip`. Requires `ogr2ogr` on PATH for FileGDB extract.

### Lane B — CAD attributes (Rail B)

```
pnpm --filter @workspace/cad-ingest cad-ingest -- \
  --county=48021 \
  --file=<local PACS export | directory> \
  --tax-year=2026 \
  --dry-run

pnpm --filter @workspace/cad-ingest cad-ingest -- \
  --county=48491 \
  --tax-year=2026 \
  --dry-run
```

PACS counties need local files. Orion counties may open-fetch when `sources.ts` resolves a public bulk endpoint. Parser modules: `pacs/parser.ts`, `orion/parser.ts`.

### Lane P — Permits (metro corpus)

```
pnpm --filter @workspace/cad-ingest permits-ingest -- \
  --metro=austin_tx \
  --file=./issued_construction_permits.csv \
  --acquired=2026-06-21 \
  --dry-run
```

## SOURCE-DISCOVERY procedure — state with no TxGIO equivalent

Use this when onboarding a **new state** whose parcel authority is not yet in the registry. Texas is the easy case: one agency (TxGIO/StratMap), one collection GUID, one URL template for 253/254 counties. Other states require this procedure **before** any Factory 1.5 lane is planned.

**Output:** frozen registry rows plus probe artifacts. Pattern: `90_operations/OPS-1_texas_source_registry.md` and `_catalog/tx_cad_source_registry.json` (`_schema.generic_design_note` is state-agnostic by design).

### Step D0 — Name the state and county roster

- Enumerate counties with FIPS (Census TIGER or state GIS office publication).
- Record count N. Factory 1 premise assumes a **blanketing** statewide source or an honest documented absence.
- `jurisdictions.ts` / engine `stateFromFips` already maps `48→TX`, `49→UT`, `16→ID`; the roster file for the new state does not exist until you author it.

### Step D1 — Identify the statewide parcel authority (or honest absence)

| State | Likely authority | Posture to probe (NOT completed recon) |
|---|---|---|
| **Utah** | UGRC (Utah Geospatial Resource Center) | State GIS hub; search for statewide parcel layer, download vs REST, county coverage gaps |
| **New Mexico** | RGIS (Resource Geographic Information System) | NM Bureau of GIS; county federated vs unified schema |
| **Arizona** | AZGeo (Arizona Geospatial Data Portal) | ADOA statewide parcels; verify bulk vs token-gated REST |
| **Colorado** | **No known statewide parcel authority** | County-by-county only; if confirmed, **blocks Factory 1 premise** that one source blankets a state — probe this first before scoping UT/NM/AZ |

For each candidate authority, record:

- Agency name and canonical portal URL
- Whether a **single normalized schema** covers all counties or county adapters are required
- License/terms (public-record posture only; no privileged feeds)
- **Honest absence:** if no statewide layer exists, file `format: honest_absent` at state grain and STOP Factory 1 planning for that state until a per-county strategy is operator-approved

### Step D2 — Four-point REST/download probe (per layer)

Permanent rule from OPS-1 (same for any state):

1. **Service root / catalog** — layer list, geometry type, maxRecordCount
2. **Fields** — parcel ID field name and exact casing; owner, situs, acreage if present
3. **Sample query** — one polygon feature, confirm GeoJSON/WGS84 or documented CRS
4. **Count** — `returnCountOnly` or bulk manifest feature count; owner/org metadata

Rate limit ~2 req/s per host. Save raw JSON responses.

**Bulk path probes** (when REST is display-only or blocked):

- Download URL template resolves for a sample of counties (urban + rural + border)
- Zip contains one vs many shapefiles (Harris-class trap)
- DBF/schema field list matches across counties
- `.prj` CRS: degrees vs Web Mercator vs state plane

### Step D3 — Record in state source registry

Author machine-readable rows mirroring `_catalog/tx_cad_source_registry.json` schema:

```
_catalog/<state>_parcel_source_registry.json   # proposed path; create on first freeze
_inbox/<YYYY-MM-DD>_<state>_parcel_probe_<fips>.json   # per-county probe evidence
_scratch/<state>_parcel_stratmap_equivalent_matrix.json   # optional statewide matrix
```

Minimum row fields: `jurisdiction_key`, `state_code`, `fips`, `name`, `service_url`, `layer_id`, `prop_id_field`, `format`, `vintage`, `auth_posture`, `adapter_kind`, `probe_evidence_path`, `verified_at`, `confidence`.

Adversarial re-probe mandatory before `verified` status (OPS-1 four-point rule).

### Step D4 — Join-integrity spot check

Where CAD attributes exist separately from geometry, probe `prop_id` join rate on 3–5 counties. Counties with bad rate ≥ 0.25 route to crosswalk/address join, same doctrine as OPS-1 Travis/Robertson list.

### Step D5 — Freeze and commit

Registry rows pass adversarial review, then `frozen_at` + `frozen_by`. Warm path reads frozen rows only; it does not author them (OPS-1 prep-time seam).

### Step D6 — Portability gate before first non-TX ingest

Do **not** run Factory 1.5 apply for state two until [Portability blockers](#portability-blockers-planner-verified) are cleared or explicitly deviated. A Utah bbox will throw under current `assertTexasWgs84Bbox`.

## Portability blockers (planner-verified — do not re-derive)

These are **absolute blockers** for non-Texas ingest until code or registry work lands. Do not "try Utah and see"; the hot path fails closed by design.

| Blocker | Location | Effect |
|---|---|---|
| **`assertTexasWgs84Bbox`** | `lib/cad-ingest/src/txgio/parse.ts:185` | Throws `TxgioProjectionError` on any bbox outside the Texas WGS84 envelope. Called per feature at `parse.ts:584`. Reused by `nfhl/parse.ts:145`. Utah coordinates are refused ingest. **Fix:** per-state envelope from registry row, not a hardcoded Texas box. |
| **`WHERE STATE='48'`** | `lib/cad-ingest/src/boundary/service.ts` (`countCountyBoundaries`, `fetchCountyBoundaryFeatures`) | County boundary fetch hardcoded to Texas FIPS prefix. **Fix:** parameterize state FIPS on boundary service. |
| **Texas coupling density** | **30 of 48** production `*.ts` under `lib/cad-ingest/src` (executable-body; tests/fixtures excluded; measured 2026-08-12 C2). Inclusive token scan = **36/48** (U1). Prior **26/47** retired. | References to Texas, FIPS 48, or `geographic.texas.gov` in executable code. Notable: `address/service.ts` pins `stratmap_address_points_48_most_recent`; `boundary/parse.ts` defaults `stateFips` to `"48"`; `txgio/counties.ts` carries 254-entry roster behind `isTexasCountyFips`. OPS-14 rule: no state constant in factory machinery. |
| **State template worksheet** | W5 acceptance item 9 | **OWED** — grade empty; no worksheet doc. U1 (`_inbox/2026-08-12_U1_utah_reference_probe.json`) is the first UT recon note; NM/CO/AZ still absent. |
| **Per-state cost model** | Commitment 3 vs factory economics | Gate is per-jurisdiction; Factory 1.5 costs are per-state. No pricing instrument in doc set. |
| **Utah product shape** | U1 probe 2026-08-12 | Utah statewide parcels exist (`uniformProduct: false`) — a **county-steward merge** with staggered vintage and a reduced statewide schema, not one uniform StratMap-class product. The **acquisition** motion ports (one authority blankets the state); the **normalisation** motion does not (per-steward completeness/schema variance). Size second-state acquisition and normalisation as separate efforts. |

Factory 2 (`hauska-engine` `packages/engine-core/src`) is **NOT Texas-clean** for state constants (source-URL defaults + `txgio_parcel` SQL + pilot registries). Absolute ingest blockers still concentrate in this acquisition tier; engine-core defaults must also be parameterized before a second state runs.

## Handoff to Factory 1

Factory 1.5 is **done for a county** when:

1. Rail C geometry for that county exists in `txgio_parcel` with verified provenance, and
2. The acquisition close artifact is filed.

Factory 1 producer: `hauska-engine/packages/engine-core/scripts/write-parcel-node-county.mjs`.

**No allowlist.** The writer reads its roster from store truth at execution time. The moment a county appears in `txgio_parcel`, the connector can drain it.

**Suggested drain diff (conceptual):**

```sql
-- counties in txgio_parcel but not yet in parcel-node atoms (run both stores; no cross-DB join)
SELECT DISTINCT county_fips FROM txgio_parcel ORDER BY 1;
-- compare to atoms store:
SELECT DISTINCT body->>'countyFips' FROM atoms WHERE entity_type = 'parcel-node' ORDER BY 1;
```

Factory 1 still obeys **one bulk writer on `hauska_mcp`**. Coordinate with `_STATE.md` before starting a sweep. Operating procedure: `_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md`.

Factory 1.5 does **not** wait for CAD attributes, zoning stamps, or address points unless a specific lane's WDLL names them as prerequisites for that wave.

## DO NOT REBUILD — and DEVIATION requirement

Standing ruling: **OPERATE THE FACTORY, DO NOT REBUILD IT.** Same pattern as Factory 1 (`90_runbooks/factory_onboarding_runbook.md`, `_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md`).

**Do not write parallel acquisition wrappers.** Run the existing CLIs in `lib/cad-ingest`. A fresh script reproduces none of the projection guards, replace semantics, multi-shp fail-closed, dry-run parity, or provenance fields paid for in L2 waves.

**Do not bypass the CLIs with ad-hoc SQL loads** into `txgio_parcel` unless the dispatch carries an explicit deviation block (below).

**Do not spawn a second custom ingest pipeline** for "state two" when extending `txgio/parse.ts` envelope logic and registry rows is the correct fix.

**Do not re-probe Texas StratMap** county-by-county from scratch when `_scratch/txgio_stratmap_county_matrix_2026-08-02.json` and OPS-1 already record the matrix. Re-probe only the county in question or when vintage changes.

### DEVIATION block (required before any new file)

If a frozen artifact genuinely cannot be extended, the dispatch must carry:

```
DEVIATION: bypassing <frozen artifact path> because <one-line reason>, operator-approved
```

Absent that block, the executor operates the named CLI. A new script without approval is a reject at verify and gets redone against the frozen one.

Legitimate rebuild case (from Factory 1 precedent): when **no frozen artifact survives** (lost code, not merely inconvenient flags). That is not the case for Factory 1.5; the CLIs exist on main.

## Close-artifact contract — acquisition lanes

Every county-layer apply pair (dry + apply) closes with **one artifact** in `_inbox/`. The file is the durable audit record; it is not optional because the CLI printed a summary.

**Naming:**

```
_inbox/<YYYY-MM-DD>_F15_<state>_<fips>_<layer>_<dry|apply>.json
```

Example: `_inbox/2026-08-11_F15_TX_48079_parcel_dry.json`

**Required fields (JSON):**

```json
{
  "factory_tier": "1.5",
  "lane": "parcel|address|boundary_city|boundary_county|nfhl|cad|permits",
  "state_code": "TX",
  "county_fips": "48079",
  "county_name": "Cochran",
  "source_citation": "https://...",
  "source_file": "stratmap25-landparcels_48079_lp.zip",
  "source_vintage": "stratmap25-landparcels_48079_cochran_202503",
  "source_crs": "wgs84-geographic|epsg3857-reprojected|...",
  "projection_verdict": "pass|reprojected|fail_closed",
  "multi_shp_mode": null,
  "dry_run": true,
  "host_fingerprint": "ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech (direct, no pooler)",
  "features_read": 5735,
  "features_parsed": 5735,
  "rows_deleted": 0,
  "rows_inserted": 5735,
  "loaded_before": false,
  "store_verify_query": "SELECT count(*), count(DISTINCT source_file) FROM txgio_parcel WHERE county_fips='48079'",
  "store_verify_result": { "count": 5735, "distinct_source_files": 1 },
  "honest_absence": null,
  "exit_code": 0,
  "log_path": "_inbox/2026-08-08_L2_WAVE2_48079_dry.log",
  "closed_at": "2026-08-11T20:00:00Z",
  "operator": "agent-or-nick"
}
```

**Honest absence:** when a county or layer has no public source, file an artifact with `honest_absence: "<reason>"`, `rows_inserted: 0`, and probe evidence path. Do not skip the artifact.

**Queue consumption:** Factory 1 sweep drivers and planners drain counties that have closed apply artifacts with `exit_code: 0` and matching store verify. Dry-only artifacts do not qualify.

Attach raw CLI log alongside JSON when the run is wave-scale.

## Utah-from-docs-alone — honest gaps remaining after this runbook

This runbook closes the **missing Factory 1.5 procedure** gap identified in `_inbox/2026-08-11_CONNECTOR_factory_seam_inventory.md`. It does **not** make Utah onboardable from documentation alone. After this file, the following remain **open**:

1. **UGRC recon note exists (U1, 2026-08-12) — product is not uniform.** `_inbox/2026-08-12_U1_utah_reference_probe.json` four-point-probed UtahStatewideParcels (1,592,583 features; 29/29 counties). `uniformProduct: false`: county-steward merge, staggered vintage, reduced statewide schema. Acquisition motion ports; normalisation motion does not. NM/CO/AZ recon notes still absent.
2. **Portability blockers unset.** `assertTexasWgs84Bbox` will reject Utah coordinates on first apply. Boundary and address modules still pin Texas hosts and FIPS 48. Engine-core still defaults to Texas ML zip / Geofabrik Texas PBF / Harris RRC mirror.
3. **No Utah county roster artifact.** 29 counties need FIPS enumeration, probe matrix, and frozen registry rows.
4. **No state template worksheet.** W5 acceptance item 9 deliverable still absent (registry row schema for state two, adapter contract list, "what changes" section). OPS-14:86 records this as **OWED**.
5. **No per-state cost model.** Commitment 3 gate cannot price a Utah blanket acquisition.
6. **Colorado posture unverified.** If Colorado has no statewide parcel authority, the Factory 1 "one source blankets a state" premise fails for that state; that should be probed before Utah work is scoped.
7. **Code changes required.** Documentation alone cannot generalize the Texas envelope, boundary `STATE='48'` filter, StratMap-specific URL templates, or engine-core source-URL defaults; engineering work in `lib/cad-ingest` and `packages/engine-core/src` is mandatory before the first non-TX apply. CTX/national remains HELD.

**Bottom line:** an operator can now run Texas acquisition lanes with verbatim commands, staging discipline, and close artifacts. Onboarding Utah (or any non-TX state) still requires source discovery execution (Steps D1–D5), portability fixes, frozen registry rows, and operator go — not additional prose alone. Do not size second-state as "copy Texas normalisation"; size acquisition (portable) and normalisation (state-specific) separately.

## GRADABLE ACCEPTANCE (Texas Factory 1.5)

Each item is pass/fail via the named instrument only. A item graded by narration fails.

**F15-1. Direct host before bulk write (S1).** **Pass:** connection string used for apply contains no `-pooler` substring; host fingerprint in close artifact matches direct endpoint. **Fail:** `-pooler` present on first write. **Instrument:** `echo "$DATABASE_URL" | rg -v pooler` (bash) or PowerShell equivalent on resolved URL.

**F15-2. Dry-run before apply (S2).** **Pass:** apply close artifact pairs with a dry artifact for the same county/layer with `dry_run: true` and matching `features_parsed` / `rows_inserted` prediction within explainable delta. **Fail:** apply without prior dry artifact. **Instrument:** `_inbox/*_F15_*_<fips>_*` artifact pair filenames + JSON field compare.

**F15-3. txgio_parcel concurrency cap (S3).** **Pass:** at no instant during a wave are more than two active `txgio-ingest` apply processes writing `txgio_parcel` (orchestrator `BATCH_SIZE` ≤ 2). **Fail:** observed `40P01` deadlock or orchestrator config > 2 without deviation block. **Instrument:** orchestrator source `BATCH_SIZE` grep or wave log timestamp overlap audit.

**F15-4. Post-apply store verify (S6).** **Pass:** for county `<fips>`, SQL `SELECT count(*), count(DISTINCT source_file), min(source_vintage), max(source_vintage) FROM txgio_parcel WHERE county_fips='<fips>' GROUP BY county_fips` row count equals close artifact `store_verify_result.count`. **Fail:** SQL count ≠ artifact. **Instrument:** one-shot psql vs close JSON.

**F15-5. Vintage provenance on every row (S4).** **Pass:** `SELECT count(*) FILTER (WHERE source_vintage IS NULL OR source_vintage = '') FROM txgio_parcel WHERE county_fips='<fips>'` returns 0 after apply. **Fail:** any null/empty vintage. **Instrument:** one-shot psql.

**F15-6. Reprojection marker when CRS was EPSG:3857.** **Pass:** for counties in matrix `ingest_safe_today=false` (excluding Donley 48129), after Wave 4 apply, `SELECT count(*) FILTER (WHERE source_vintage NOT LIKE '%reprojected-from-epsg3857%') FROM txgio_parcel WHERE county_fips='<fips>' AND source_vintage LIKE '%202505%'` returns 0 for Web Mercator cohort counties (native WGS84 202505 outliers documented in P2-2 close). **Fail:** Web Mercator county loaded without marker. **Instrument:** one-shot psql per cohort county or spot-check 48011 + matrix row.

**F15-7. Close artifact filed (S7).** **Pass:** `_inbox/<date>_F15_TX_<fips>_<layer>_apply.json` exists with `exit_code: 0` and `factory_tier: "1.5"`. **Fail:** apply completed with no artifact. **Instrument:** file exists + JSON parse.

**F15-8. Projection guard fail-closed.** **Pass:** `pnpm --filter @workspace/cad-ingest txgio-ingest -- --county=49001 --dry-run` (Utah FIPS) exits non-zero with projection/bbox error before insert. **Fail:** Utah coordinates load without deviation. **Instrument:** CLI dry-run one-shot (no apply).

**F15-9. Harris multi-shp concat.** **Pass:** Harris 48201 apply artifact records `multi_shp_mode: "concat"` OR CLI log contains `--multi-shp=concat`; `SELECT count(DISTINCT source_file) FROM txgio_parcel WHERE county_fips='48201'` > 1. **Fail:** single-file ingest for Harris archive. **Instrument:** artifact field + SQL distinct source_file count.

**F15-10. Versioned Wave 4 driver referenced.** **Pass:** file exists at `P:/hauska-engine/packages/engine-core/scripts/sweep/wave4_reproject_orchestrator.mjs`. **Fail:** path missing. **Instrument:** file existence.

**F15-11. County replace idempotency.** **Pass:** second apply for same county without source change yields `rows_deleted` ≈ prior row count and final `count(*)` unchanged vs first apply (±0). **Fail:** duplicate accumulation without delete. **Instrument:** two apply logs + post-second SQL count.

**F15-12. StratMap matrix row for county.** **Pass:** `_inbox/2026-08-08_SWEEP_county_source_matrix.json` contains entry with matching `fips` and live `download_url` HTTP 200/206 on adversarial re-probe. **Fail:** county absent or URL dead without honest_absence artifact. **Instrument:** JSON lookup + `curl -sI` one-shot.

**F15-13. Host fingerprint in artifact.** **Pass:** close JSON `host_fingerprint` field non-null and matches direct Neon host (no pooler). **Fail:** missing fingerprint. **Instrument:** JSON field parse.

`gradable: true` for Texas acquisition lanes with close artifacts. `gradable: false` for Utah/non-TX until Steps D1–D6 and portability PRs land.

## Related documents

| Doc | Role |
|---|---|
| `90_operations/OPS-13_store_topology.md` | Direct host, concurrency, propagation legs |
| `90_operations/OPS-1_texas_source_registry.md` | Texas registry shape and probe doctrine |
| `90_runbooks/factory_onboarding_runbook.md` | Factory 2; operate-not-rebuild pattern |
| `_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md` | Factory 1 producer; DO NOT REBUILD list |
| `_inbox/2026-08-11_CONNECTOR_factory_seam_inventory.md` | Seam inventory; acquisition gap analysis |
