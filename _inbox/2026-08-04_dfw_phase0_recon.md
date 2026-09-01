---
id: 2026-08-04_dfw_phase0_recon
title: DFW area onboarding — Phase 0 recon (upstream lane + source truth + schema + blast radius)
date: 2026-08-04
status: complete (read-only; planner-run)
owner: nick
related: [_dispatches/2026-08-04_dallas_area_planner_handoff, 90_runbooks/factory_onboarding_runbook, _land_records/txgio_stratmap_county_matrix_2026-08-02.json, _inbox/2026-07-20_provable_county_data_pipeline_design]
---

# DFW Phase 0 recon

Planner session claim: DFW 9-county fan (48113 Dallas, 48439 Tarrant, 48085 Collin, 48121 Denton, ring 48397 Rockwall, 48139 Ellis, 48251 Johnson, 48257 Kaufman, 48367 Parker). County-unincorporated lane only; city onboarding globally gated on Elgin CERT-RESTORE.

Repo tips at recon: engine `d809c5c`, ldt `f41345b`.

## (a) Upstream ingest lane (ldt cad-ingest + api-server Tier-1 bake)

### StratMap geometry → txgio_parcel

**CLI (verbatim from `lib/cad-ingest/src/txgio/cli.ts`):**

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- \
  --county=<fips|name> \
  [--file=<local zip | dir | .shp | https URL>] \
  [--vintage=<label>] [--batch-size=250] [--limit=N] [--dry-run]
pnpm --filter @workspace/cad-ingest txgio-ingest -- --list
```

**Registry:** `lib/cad-ingest/src/txgio/counties.ts` `TXGIO_COUNTIES` — today ONLY the 10 Central-TX counties. DFW counties are NOT registered; adding each is one `county(fips, name)` line (URL template is uniform via `txgioDownloadUrl`).

**Replace semantics:** county-scoped delete then insert (`deleteCountyParcels`) — re-runs idempotent, no cross-county bleed.

**Env:** `DATABASE_URL` = ldt deployment Neon (`DEPLOYMENT_DATABASE_URL` secret, project `legacy-design-tools-prod`).

### StratMap land-use → cad_property (PTAD STAT_LAND_)

**CLI (verbatim from `lib/cad-ingest/src/txgio/landuse-cli.ts`):**

```
pnpm --filter @workspace/cad-ingest stratmap-landuse -- \
  --county=<fips|name> [--file=<path-or-url>] [--dry-run]
```

Reads `STAT_LAND_` from the same StratMap DBF (geometry loader can share the zip). Owner-match gate applies before promote (coverage-gate doctrine).

### CAD bulk rolls (Rail B, beyond StratMap PTAD)

**Registry:** `lib/cad-ingest/src/sources.ts` `CAD_BULK_SOURCES` — only Williamson (open-fetch Socrata) and Hays (manual). DFW: greenfield.

**Executor recon summary (live HTTP probes, 2026-08-04):**

| FIPS | County | Bulk access | Notes |
|---|---|---|---|
| 48113 | Dallas / DCAD | open-fetch | Year-versioned zip via ViewPDFs proxy; 200 on 2026 certified (~193MB) |
| 48439 | Tarrant / TAD | open-fetch | Year-versioned PropertyData zip; 200 HEAD |
| 48085 | Collin / CCAD | open-fetch | **Socrata** `data.texas.gov/resource/vffy-snc6.csv` — same rail as WCAD |
| 48121 | Denton | open-fetch | Apache dir; `CertifiedDataAll.zip`; PACS-like filenames |
| 48397 | Rockwall | portal-only | React SPA; no static bulk URL found |
| 48139 | Ellis | portal-only | Same vendor SPA as Rockwall; PIA for non-web data |
| 48251 | Johnson | open-fetch | WordPress media zip; 200 HEAD |
| 48257 | Kaufman | open-fetch | WordPress export zip; 200 HEAD |
| 48367 | Parker | manual/none | Forms only; no roll URL found |

Phase 1 can proceed on geometry + StratMap PTAD land-use for ALL nine (no CAD roll required for geometry). CAD bulk is additive for richer land-use; Collin + Denton are the lowest-friction CAD adds.

### Tier-1 facet bake (ldt)

**CLI (verbatim from `artifacts/api-server/src/nodeFacetBakeTier1Cli.ts` header):**

```
pnpm --filter @artifacts/api-server node-facet-bake-tier1 -- \
  --county=<fips> [--limit=500] [--dry-run] [--page-size=5000]
```

**Scoping:** county-only via `--county=`; monotonic promote guard — safe to run per new county without downgrading other counties' snapshots. Reads `txgio_parcel` + `cad_property` join (owner-match gated counties excluded in CLI logic).

### Engine breadth zoning-fact bake

**CLI (verbatim from runbook / `bake-property-atom-county.mjs`):**

```
PROPERTY_ATOM_PATH=1 DATABASE_URL=<atoms> CORTEX_DATABASE_URL=<cortex> \
  pnpm --filter @hauska-engine/engine-core run bake-property-atom-county -- \
    --county=<fips> [--dry-run]
```

**Gap:** `COUNTY_NAMES` in script knows 10 Central-TX FIPS only — small PR required before DFW bakes.

## (b) Per-county StratMap source truth (matrix 2026-08-02)

| FIPS | County | Vintage | Features | prop_id_bad_rate | Join key |
|---|---|---|---:|---:|---|
| 48113 | Dallas | 202508 | 694,160 | 0.0 | prop_id OK |
| 48439 | Tarrant | 202507 | 757,171 | 0.0 | prop_id OK |
| 48085 | Collin | 202503 | 387,738 | 0.0009 | prop_id OK |
| 48121 | Denton | 202503 | 353,705 | 0.0016 | prop_id OK |
| 48397 | Rockwall | 202507 | 52,739 | 0.0 | prop_id OK |
| 48139 | Ellis | 202507 | 98,803 | 0.0 | prop_id OK |
| 48251 | Johnson | 202508 | 101,852 | 0.0117 | prop_id OK |
| 48257 | Kaufman | 202503 | 94,680 | 0.0027 | prop_id OK |
| 48367 | Parker | 202507 | 100,555 | 0.0644 | prop_id OK (<25% gate) |

**Travis precedent (prop_id_bad_rate ≥25%):** NONE of the nine qualify. All may use prop_id join for Phase 1; owner-match gate still required before land-use promote.

All flagged STALE per OPS-1 (>1yr); metros note says prefer county ArcGIS when fresher — Rail C for factory onboarding uses StratMap bulk unless a fresher override is authored in registry row (Phase 3 recon per county).

**Combined StratMap feature estimate:** ~2,641,403 parcels across nine counties.

## (c) Deployment schema / migration state

**Live probe (planner, deployment Neon):**

```json
{ "dfw_txgio_counts": [] }
```

```json
{
  "central_tx_baseline": [
    { "county_fips": "48021", "n": 74729 },
    { "county_fips": "48453", "n": 894657 },
    { "county_fips": "48491", "n": 304298 }
  ]
}
```

```json
{ "county_facet_coverage": { "reg": "county_facet_coverage" } }
{ "onboarding_ledger_event": { "reg": "onboarding_ledger_event" } }
```

Merged ldt migrations through `0065_onboarding_ledger.sql` and `0060_county_facet_coverage.sql` — **effects present on prod** (tables exist). Journal table is `public.schema_migrations` (not `drizzle.__drizzle_migrations`). Pre-flight for any new migration: query for table/column effect before data-runs.

## (d) Blast radius

| Write surface | Scope key | Central-TX risk |
|---|---|---|
| `txgio-ingest` | `county_fips` delete+insert | None if `--county=` correct |
| `stratmap-landuse` | county-scoped | None |
| CAD bulk ingest | county-scoped | None |
| Tier-1 bake | `--county=` pagination | Monotonic guard prevents downgrade of other counties |
| breadth bake | `--county=` | New atoms only for target FIPS |
| cascade (Phase 3) | `--county=` + city exclusion in query | Do not run until prerequisites merged |

## Phase 3 prerequisites (DEPENDENCY — OPS-9 session)

| Fix | Status on engine main `d809c5c` |
|---|---|
| Cascade city-aware decline wording + backfill | **NOT MERGED** (no matching PR open) |
| `gradeUnzonedParcel` cadastral FeatureServer URL parameterization | **NOT MERGED** (still hardcoded BCAD URL) |

**Do not run county factory cascade/cert for DFW until both land.**

## Recommended Phase 1 execution order

1. Small ldt PR: extend `TXGIO_COUNTIES` with nine FIPS.
2. Small engine PR: extend `COUNTY_NAMES` + `FIPS_TO_COUNTY_NAME`.
3. Pilot county ingest: **Rockwall 48397** (smallest, clean prop_id) — `txgio-ingest --dry-run` then apply; verify count ≈52,739.
4. `stratmap-landuse --dry-run` then apply; owner-match gate → `county_facet_coverage` row.
5. Tier-1 bake dry-run then apply for pilot FIPS.
6. Breadth zoning-fact bake dry-run then apply.
7. Scale remaining eight counties in ascending feature-count batches (Ellis → … → Tarrant/Dallas last).

## Phase 4 (queued, recon only)

City source registry for DFW Municode/eCode360/encodeplus bucket — Dallas proper + Fort Worth strategic document-only. No city onboarding until Elgin CERT-RESTORE.
