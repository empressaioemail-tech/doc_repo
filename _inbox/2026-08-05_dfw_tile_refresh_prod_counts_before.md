---
title: DFW tile refresh — prod txgio_parcel counts (before bake)
date: 2026-08-05
---

## Verdict

All nine DFW Phase 1 counties are present in **prod** `txgio_parcel`. Staging holds only Bastrop (48021) duplicate rows. **No staging→prod promotion required.**

## Distinct parcel counts (COUNT DISTINCT feature_index)

| FIPS | County | prod distinct | load log target | match |
|------|--------|---------------|-----------------|-------|
| 48113 | Dallas | 694,160 | 694,160 | OK |
| 48439 | Tarrant | 757,161 | 757,161 | OK |
| 48085 | Collin | 387,737 | 387,738 | OK (-1) |
| 48121 | Denton | 353,631 | 353,705 | OK (-74) |
| 48251 | Johnson | 101,847 | 101,847 | OK |
| 48367 | Parker | 100,548 | 100,548 | OK |
| 48139 | Ellis | 98,803 | — | present |
| 48257 | Kaufman | 94,650 | — | present |
| 48397 | Rockwall | 52,739 | — | present |

## Staging (same FIPS filter)

Only `48021: 74729` rows in `txgio_parcel_staging`. No DFW county rows in staging.

## Current live artifact

`gs://hauska-map-tiles/parcels.4af31e1901e2.pmtiles` (Central TX only, pre-DFW bake)

## Query timestamp

2026-08-05 ~07:30 CDT (planner session)
