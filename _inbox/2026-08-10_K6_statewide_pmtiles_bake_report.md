---
date: 2026-08-10
status: ready-for-R6
artifact: statewide-parcel-pmtiles-bake
---

# K6 bake report — statewide TX parcel PMTiles (Handoff K)

## Output

| Field | Value |
|-------|-------|
| Hash | `b692c6534d26` |
| Local path | `legacy-design-tools/_scratch/k3_statewide_2026-08-09/parcels.b692c6534d26.pmtiles` |
| GCS | `gs://hauska-map-tiles/parcels.b692c6534d26.pmtiles` |
| Size | 3,175,452,566 bytes (2.96 GiB) |
| Features | 13,710,413 |
| Counties | 196 |
| Wall time | 25,029 s (~6.95 h) |
| CLI | `parcelsPmtilesBakeCli.ts` (frozen, INV-22) |

## Dedup contract (L0 trap ruling)

Tile-spanning rows in `txgio_parcel` are deduped at bake on `(county_fips, feature_index)` via `DISTINCT ON (feature_index)` per county. **One rendered polygon per distinct feature_index is correct.**

Geometry-identity traps (Tarrant A 36-1 multi-account polygons, Travis `prop_id='0'` sentinels) are **facet/atom concerns**, not tile bugs. Do not split or merge at bake time.

## Prior artifact (rollback)

| Hash | Scope | Size |
|------|-------|------|
| `3431529a2e8d` | Central-TX 19-county | 936 MB |
| `4af31e1901e2` | Central-TX only (older) | 429 MB |

PE rollback: set `VITE_PARCEL_PMTILES_HASH=3431529a2e8d` in Vercel and redeploy.

## Checkpoints

| # | Artifact | Result |
|---|----------|--------|
| 1 | `_inbox/2026-08-09_K2_checkpoint1_preregister.json` | 196 counties pre-registered |
| 2 | `_inbox/2026-08-09_K4_checkpoint2_review.md` | PASS — 0 count mismatches, Harris west -95.960827 |

## Honest absence (no phantom parcels)

Donley 48129 (no source data), Nueces 48355 coastal strip SOURCE_DEFECT — not in tileset; map shows boundary-only.

## PE wiring

Default hash `b692c6534d26` in `config.ts` + `sharedMapDefaults.ts`. Env override: `VITE_PARCEL_PMTILES_HASH`.

## R6 gate

**READY FOR R6** — operator browse of statewide map. Verify visually: Harris west (~-95.96), Bastrop regression vs prior tileset, Dallas/Valley/Panhandle spot checks.
