---
id: 2026-08-10_B_footprint_ml_ingest_cp1
title: HOLD-1 footprint ML ingest — adversarial CP1 (pre-code expectations)
date: 2026-08-10
status: recorded
---

# CP1 — pre-register expectations + memory/resumability attack

## Pre-registered footprint counts (independent estimates)

| County | FIPS | Independent basis | Expected `featuresRead` (bbox filter) |
|---|---|---|---|
| Bastrop | 48021 | Texas legacy zip ~10.7M statewide (Microsoft README); Bastrop land area ~896 sq mi / Texas ~268,596 sq mi → ~0.33% → **~35k** structures; cross-check: txgio **74,729** parcel rows × ~0.45 improved-parcel ratio → **~34k** | **28,000 – 55,000** |
| Dallas | 48113 | Same statewide denominator; Dallas is dense urban — parcel rows **726,360** (txgio) × ~0.55 improved ratio → **~400k**; metro commercial/multi-family lifts upper bound | **350,000 – 950,000** |

These ranges are registered **before** any loader output. A count outside both ranges is a STOP for CP2, not auto-pass.

## Memory design attack

| Claim | Attack | Mitigation in build |
|---|---|---|
| "Memory-bounded" | 3 GB `Texas.geojson` FeatureCollection inside one zip entry — naive `JSON.parse` OOM | `yauzl` entry `openReadStream` + `stream-json` `streamArray()` — never materialize full FC |
| "NFHL backpressure" | stream-json internal buffers could still grow unbounded | Port `streamGeoJsonSeqWithBackpressure` (high-water **32**, low-water **8**); unit test proves pause under slow consumer |
| Dallas county bbox collect | `--probe-only` avoids accumulating rings; full Bastrop join holds O(county matches) only | Metro dry-run uses probe path; apply slot not taken |
| Peak RSS "estimate" | Prior NFHL OOM at 116k features with unbounded queue | **Measured** via 50ms RSS sampler in probe script; STOP if > **1536 MB** |

## Resumability attack

| Claim | Attack | Response |
|---|---|---|
| "Resumable" | Single 376 MB zip re-download every run | Cache dir `ML_FOOTPRINT_CACHE_DIR`; skip download when on-disk zip ≥ 300 MB (fail-closed size check on fresh download) |
| "Resume mid-scan" | No byte-offset checkpoint inside FeatureCollection | **Honest scope:** partition-level resume only (cached zip). Intra-file resume deferred — would need GeoJSONL partition or quadkey tiles |
| Network fail-closed | Partial `.part` file | Write to `.part`, verify Content-Length, atomic rename; mismatch deletes part |

## CP1 verdict

Design accepted to implement. Intra-file resume explicitly **not** claimed — only partition cache resume.
