---
id: 2026-08-08_L2_WAVE3_BOSQUE_48035_INSPECTION
title: Bosque 48035 inspection — byte anomaly explained as vertex density, not defect
date: 2026-08-08
status: explained
owner: wave3-resume-planner
related: [_inbox/2026-08-08_L2_WAVE3_RESUME_REPORT]
---

# Bosque County 48035 — anomaly inspection

Bosque was held for a solo, attended run because its source archive is 104,239,810 bytes for an estimated 19,975 parcels — far out of line with its peers. This document is the inspection that was owed, performed by a read-only structural probe of the live source before ingest.

**Conclusion: the anomaly is real, benign, and fully explained by geometry vertex density. It is not a defect, not a projection error, and not a duplication.**

## The anomaly is genuine, not a rounding artifact

Across all 117 Wave 3 members with byte and parcel-count metadata, the median is 488.4 bytes per parcel. Bosque sits at 5,218.

| FIPS | County | Bytes | Parcels | Bytes/parcel | vs median |
|---|---|---:|---:|---:|---:|
| 48035 | **Bosque** | 104,239,810 | 19,975 | **5,219** | **10.69x** |
| 48119 | Delta | 9,001,152 | 6,470 | 1,391 | 2.85x |
| 48171 | Gillespie | 39,097,345 | 32,363 | 1,208 | 2.47x |
| 48201 | Harris | 479,483,352 | 536,512 | 894 | 1.83x |
| 48471 | Walker | 28,805,459 | 35,584 | 810 | 1.66x |

Bosque is not the top of a smooth continuum. The next-densest county is 2.85x, so Bosque is a genuine outlier separated by a wide gap, which is why an attended run was the right call.

## Root cause: a minority of hyper-detailed polygons

Full structural scan of the shapefile inside the archive:

| Measure | Value |
|---|---|
| Records | 19,975 |
| SHP uncompressed size | 125,161,032 bytes (125.2 MB) |
| Bytes per record in SHP | 6,266 |
| Total vertices | 7,751,827 |
| Total parts (rings) | 23,250 |
| **Median vertices/parcel** | **9** |
| **Mean vertices/parcel** | **388.1** |
| p95 vertices/parcel | 1,578 |
| Max vertices (record 12807) | 46,353 |
| Rings per parcel (mean) | 1.16 |
| **Records outside Texas WGS84 envelope** | **0** |
| Header bbox | -98.0052, 31.5876, -97.2771, 32.2070 |

A median of 9 vertices against a mean of 388 is the whole story. The typical Bosque parcel is an ordinary rectangle. A small minority of polygons are digitized at extreme precision, the worst at 46,353 vertices, and those few records carry the file size. This is the signature of survey-precision boundaries following natural features, which fits Bosque County's geography along the Bosque and Brazos river corridors and the Lake Whitney shoreline.

Rings per parcel at 1.16 rules out a multipolygon explosion, so this is not the `2026-08-08_DEFECT_multipolygon_truncation` failure mode. Zero out-of-envelope records rules out the Wood 48499 failure mode. The header bbox sits correctly inside Bosque County, so there is no projection problem.

## Why this is safe to ingest

The data is honest, correctly projected, and inside its county. The cost is byte size and ingest time, not correctness. The expected consequence is a raised seam factor, because the ingest writes one row per intersecting grid cell and a 46,353-vertex polygon spans more cells than a rectangle.

**Calibrating that expectation against measured values, not a remembered one.** An earlier draft of this document cited a Wave 3 mean seam of ~1.30 as the bar; the adversarial reviewer correctly flagged that as wrong. The measured mean across the 22 counties landed in this resume is **1.1546**, with min 1.0698 (Lubbock) and max 1.3045 (Wilson). So the honest prediction is that Bosque should land **above 1.30, plausibly well above it**, and that such a value is the explainable outcome rather than a red flag. What would be a red flag is the opposite: a seam factor near the 1.15 mean would mean the dense polygons did not survive ingest, and would point at the multipolygon-truncation defect rather than at clean loading.

The per-county gates still apply unchanged: dry must predict apply exactly, the idempotent re-run must hold the row count, zero rows may fall outside Texas degree bounds, and the store bbox must match the source header. Bosque earns no exemption from any of them; the inspection only establishes that a large file here is expected rather than suspicious.

## Finding

**W3-BOSQUE-DENSITY (source characteristic, closed).** Bosque 48035's 10.69x byte-per-parcel outlier is explained: 7.75M vertices across 19,975 parcels, median 9 and max 46,353, driven by a minority of survey-precision boundaries. Geometry is clean (0 out-of-envelope records, correct bbox, 1.16 rings/parcel). No defect. Recorded so a future wave does not re-litigate the same outlier from scratch.
