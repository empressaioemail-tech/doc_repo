---
date: 2026-08-10
status: complete
checkpoint: K4
related: [_inbox/2026-08-09_K2_checkpoint1_preregister.json]
---

# K4 checkpoint 2 — statewide PMTiles review (2026-08-10)

Independent reviewer frame: store SQL counts + bbox columns vs bake output; Harris west icon test at store layer; QA county set.

## Artifact

| Field | Value |
|-------|-------|
| PMTiles | `parcels.b692c6534d26.pmtiles` (2.96 GiB on GCS) |
| Total baked features | **13,710,413** |
| Expected (checkpoint 1) | **13,710,413** |
| Counties in bake | **196** |
| Per-county count mismatches | **0** |

## Harris icon test (store layer)

| Check | Result |
|-------|--------|
| `min(west_lng)` Harris 48201 | **-95.960827** |
| Gate (~-95.9608) | **PASS** |
| Baked feature count | 1,523,641 (matches store) |

West-half reload proof satisfied at store; tile visual QA deferred to R6 (Nick browse).

## QA county set (counts)

| FIPS | Label | store | baked | match |
|------|-------|------:|------:|:-----:|
| 48201 | Harris | 1,523,641 | 1,523,641 | yes |
| 48113 | Dallas | 694,160 | 694,160 | yes |
| 48061 | Cameron (Valley) | 185,062 | 185,062 | yes |
| 48021 | Bastrop regression | 63,357 | 63,357 | yes |
| 48261 | Smallest loaded | 538 | 538 | yes |
| 48033 | Castro (Panhandle) | 3,752 | 3,752 | yes |

## GCS serving verify

```
HTTP/1.1 200 OK
Content-Length: 3175452566
Accept-Ranges: bytes
Cache-Control: public, max-age=31536000, immutable
```

## Dedup ruling (carried from K2)

One rendered polygon per distinct `(county_fips, feature_index)`. Multi-account geometries and `prop_id='0'` sentinels are facet concerns, not tile defects.

## Verdict

**PASS** — counts match checkpoint 1 for all 196 counties; Harris west extent meets icon test at store; GCS artifact live with range requests. Visual regression (Bastrop identical, Harris west parcels visible) = **R6 operator gate**.
