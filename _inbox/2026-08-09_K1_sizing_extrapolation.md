---
date: 2026-08-09
status: complete
checkpoint: K1
---

# K1 sizing dry pass — extrapolation (2026-08-09)

## Sample bake (metro / mid / small)

| FIPS | role | expected (store) | baked | match |
|------|------|-----------------:|------:|-------|
| 48201 | Harris metro | 1,523,641 | 1,523,641 | yes |
| 48021 | Bastrop mid + regression | 63,357 | 63,357 | yes |
| 48261 | smallest loaded | 538 | 538 | yes |
| **total** | | **1,587,536** | **1,587,536** | yes |

**Wall time:** 748.4 s (~12.5 min)  
**GeoJSONSeq + PMTiles output:** `parcels.2ad470006daa.pmtiles` — **253.1 MB**  
**Bytes/feature (sample):** ~167 B/feature  

Checkpoint 1 preregister: `_inbox/2026-08-09_K2_checkpoint1_preregister.json`  
**totalDistinctFeatures (196 counties):** 13,710,413  

## Extrapolation to full statewide bake

| metric | sample | scale factor | estimate |
|--------|--------|-------------:|---------:|
| features | 1,587,536 | × 8.63 | **13,710,413** |
| PMTiles size | 253.1 MB | × 8.63 | **~2.2 GB** (2.0–2.5 GB band) |
| wall time | 748 s | × 8.63 | **~1.8 h** (1.5–3 h band; tippecanoe may superlinear) |

**Cross-check vs prior Central-TX artifact:** `parcels.3431529a2e8d.pmtiles` = 936 MB / ~5.15M features → linear scale to 13.7M ≈ **2.49 GB**. Consistent.

**Neon read load:** full bake is a read-only full-table scan, county-batched inside the CLI. Run during low write contention (current window: no bulk writer until D1/F1).

## Proceed to K3

Full bake authorized on extrapolation within expected band.
