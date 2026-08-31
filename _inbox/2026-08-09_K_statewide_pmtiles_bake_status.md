---
date: 2026-08-09
status: in_progress
owner: planner
wdll_items: [K1, K2, K3, K4, K5, K6]
related: [90_operations/OPS-14_texas_flush_game_plan, 40j_hauska_map_tile_build_pipeline]
---

# Handoff K — statewide parcel PMTiles bake (2026-08-09)

Planner lane for OPS-14 statewide parcel tile bake. Operator directive 2026-08-09 late; trigger gate **amended** to txgio_parcel store verification (sweep/scorer artifacts not consumed by tiles).

## Trigger gate (amended) — VERIFIED 2026-08-09

```sql
SELECT count(DISTINCT county_fips), count(*) FROM txgio_parcel;
-- 196 counties, 15,479,206 rows

SELECT min(west_lng), count(DISTINCT feature_index)
  FROM txgio_parcel WHERE county_fips = '48201';
-- westmost -95.960826886, 1,523,641 distinct features (Harris reload proof)
```

Gate: **PASS**. Harris west half reaches ~-95.96 (icon test precondition met at store layer).

## K2 dedup contract (pre-registered)

**Tile dedup key:** `(county_fips, feature_index)` implemented as `DISTINCT ON (feature_index)` per county in `parcelsPmtilesBakeCli.ts` (same as store readers). Raw row count ~15.5M; distinct features ~sum per-county `count(DISTINCT feature_index)`.

**Geometry-identity traps are NOT tile bugs:** one geometry carrying many accounts (e.g. Tarrant A 36-1), Travis `prop_id='0'` sentinels — these are FACET/atom concerns. Correct tile behavior: **one rendered polygon per distinct feature_index**. Do not "fix" by splitting or merging at bake time.

Checkpoint 1 artifact: `_inbox/2026-08-09_K2_checkpoint1_preregister.json` (reviewer expected per-county feature counts from store SQL before bake).

## K1 sizing dry pass — IN FLIGHT

Sample counties (metro / mid+regression / small):

| FIPS | County | distinct features | role |
|------|--------|-------------------:|------|
| 48201 | Harris | 1,523,641 | metro |
| 48021 | Bastrop | 63,357 | mid + regression guard |
| 48261 | (smallest loaded) | 538 | small |

Output dir: `legacy-design-tools/_scratch/k1_sizing_2026-08-09/`

Extrapolation (pending K1 completion): scale PMTiles bytes and wall time by `total_distinct_features / sample_features`.

Prior Central-TX bake reference: `parcels.3431529a2e8d.pmtiles` (~5.15M features, 19 counties). Statewide is ~3× row count; distinct-feature total from checkpoint-1 preregister.

## K3 full bake — CLOSED 2026-08-10

`parcels.b692c6534d26.pmtiles` — 13,710,413 features, 196 counties, 2.96 GiB, 25,029 s wall time. GCS live. K4/K5 closed. Report: `_inbox/2026-08-10_K6_statewide_pmtiles_bake_report.md`.

## K5 PE wiring — DEPLOYED 2026-08-10

Production: https://property-explorer-xi.vercel.app — bundle `index-NZimi-_b.js` contains `b692c6534d26`. Rollback env: `VITE_PARCEL_PMTILES_HASH=3431529a2e8d`.

## K6 — READY FOR R6

Visual QA owed: Harris west (~−95.96), Bastrop regression, Dallas/Valley/Panhandle spot checks.

## Adversarial checkpoints

| # | When | Reviewer frame | Artifact path |
|---|------|----------------|---------------|
| 1 | Pre-bake | Store SQL per-county feature counts | `_inbox/2026-08-09_K2_checkpoint1_preregister.json` |
| 2 | Post-bake | Tile extents vs store bbox + visual QA set | `_inbox/2026-08-09_K4_checkpoint2_review.md` (TBD) |
