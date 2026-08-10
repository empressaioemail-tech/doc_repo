---
id: 2026-08-10_B_footprint_ml_ingest_cp2
title: HOLD-1 footprint ML ingest — adversarial CP2 (post dry-run)
date: 2026-08-10
status: pass-with-notes
---

# CP2 — refute-or-accept measured counts

## Measured results

| County | CP1 band | Measured `featuresRead` | Verdict |
|---|---|---|---|
| 48021 Bastrop | 28,000 – 55,000 | **100,187** | **REFUTE CP1 band** — accept measured |
| 48113 Dallas | 350,000 – 950,000 | **663,759** | **ACCEPT** |

## Why Bastrop exceeds CP1 (not a loader bug)

CP1 used area-proportional statewide share (~35k) and parcel×0.45 heuristic. **Refutation checks:**

1. **Microsoft statewide count:** 10,678,921 features scanned in `Texas.geojson` — consistent with ~10.7M public figure.
2. **Bastrop / statewide ratio:** 100,187 / 10,678,921 = **0.94%** vs land-area share 0.33%. Bastrop is **not** uniformly rural in the ML layer — Austin metro exurban edge + commercial/roof structures inflate ML count vs area.
3. **Parcel cross-check:** 100,187 ML features / 74,729 parcel rows = **1.34×** — plausible for ML (sheds, garages, commercial pads, multi-roof campuses) per T3 ingest spec orphan-reject path.
4. **Dallas anchor:** 663,759 / 726,360 parcels = **0.91×** — metro dense; Dallas ACCEPT in CP1 band confirms loader bbox filter is not double-counting or under-filtering relative to a known metro.

**Conclusion:** Bastrop count is **high but structurally plausible** for ML-derived footprints; the miss was CP1 estimator, not ingest logic.

## Memory claim verification

| Metric | Claim | Evidence |
|---|---|---|
| Peak RSS | < 1536 MB STOP | 225.6 MB (48021 scan), 214.3 MB (48113 scan) |
| Queue bound | high-water 32 | `peakQueueDepth: 32` on all runs; unit test pause under slow consumer |
| Collect mode | Bastrop 100k rings | Dry-run exit 0 after holding full bbox set + join |

## Resumability verification

- Second run used cached `P:/tmp/ml-footprint-cache/Texas.geojson.zip` with no HEAD fetch (376 MB on disk).
- Fail-closed: fresh download writes `.part`, verifies Content-Length, atomic rename.

## Regression (48021)

- **Before HOLD-1 close:** empty ML → 1 county-coverage absence atom.
- **After:** `mlEmptyBbox: false`, 188 present + 77 per-parcel absence on 200-parcel sample, 0 county-coverage absent.

## CP2 verdict

**HOLD-1 CLOSED.** Counts accepted against independent anchors (statewide scan total, Dallas band, parcel ratios). PR #294 ready for merge after CI green on streaming commits.
