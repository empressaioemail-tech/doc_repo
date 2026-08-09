---
title: "Multi-shapefile truncation — sweep, geo verify, reader fix, Harris re-ingest"
date: 2026-08-09
status: closed-with-holds
authority: "Operator-authorized MULTI-SHAPEFILE TRUNCATION PLANNER 2026-08-09"
pr: "https://github.com/empressaioemail-tech/legacy-design-tools/pull/404"
canon_preamble: "v0f465c77"
memory_graded: false
---

# Multi-shapefile truncation report

Harris County was short-loaded by roughly two thirds because `files.find(/\.shp$/i)` kept the first shapefile and silently discarded `harris_west`. This lane swept all 254 StratMap archives, geographically checked all 196 loaded counties, fixed the reader fail-closed, re-ingested Harris alone, assessed atom contamination, and ran an adversarial refute.

## 1. Sweep — all 254 counties

Method: ZIP EOCD + central-directory HTTP range reads against every URL in `_inbox/2026-08-08_SWEEP_county_source_matrix.json`. No full-archive download of the 6.6 GB corpus.

| Metric | Value |
| --- | ---: |
| Attempted | 254 |
| OK | 253 |
| Method failed | 0 |
| Dead | 1 (Donley `48129`, HTTP 404) |
| Multi-shapefile | **1** |

**Only multi-shapefile county:** Harris `48201`

- `shp/stratmap25-landparcels_48201_harris_east_202508.shp`
- `shp/stratmap25-landparcels_48201_harris_west_202508.shp`

Filename inference: east/west geographic halves of the same land-parcels layer (not a second feature class).

Artifacts: `_inbox/2026-08-09_MULTI_SHP_sweep_raw.json`, `_inbox/2026-08-09_MULTI_SHP_sweep_summary.md`.

**Independent spot-check (planner, after adversarial HOLD):** re-fetched central directories for Bastrop, Travis, Hays, Bexar, and Harris. All five matched the sweep (`zip64=false`). Artifact: `_inbox/multishp_harris_logs/sweep_spotcheck.json`.

**Coverage caveat (adversarial, accepted):** the sweep raw JSON does not retain per-archive EOCD bytes / ZIP64 parse path. Uniqueness of Harris is therefore conditioned on the roster + spot-check, not on a fully re-playable ZIP64 audit trail. No ZIP64 sentinel was observed in the five-county spot-check; Harris itself is not ZIP64.

## 2. Geographic verification — 196 loaded counties

Live store: **196** distinct `county_fips` in `txgio_parcel`.

Method (count-independent): store envelope (`west_lng`/`east_lng`/`south_lat`/`north_lat`) vs TIGERweb `State_County/MapServer/1` extent (`GEOID=48xxx`, EPSG:4326). Short if any edge inset > 0.05° or lon/lat span coverage < 0.85.

Artifacts: `_inbox/2026-08-09_MULTI_SHP_geo_verify_raw.json`, `_inbox/2026-08-09_MULTI_SHP_geo_verify_summary.md` (generated **before** Harris re-ingest).

| FIPS | Name | shp_count | Flag | Notes |
| --- | --- | ---: | --- | --- |
| 48201 | Harris | 2 | short (pre-apply) | West wall at −95.4364; lon coverage 0.503. **This is the multi-shp defect.** |
| 48027 | Bell | 1 | known false positive | CAD north of Census; not re-litigated. |
| 48061 | Cameron | 1 | short | East inset |
| 48245 | Jefferson | 1 | short | South inset |
| 48261 | Kenedy | 1 | short | East inset; lon coverage 0.741 |
| 48273 | Kleberg | 1 | short | East inset |
| 48321 | Matagorda | 1 | short | South inset |
| 48355 | Nueces | 1 | short | East inset |
| 48361 | Orange | 1 | short | South inset; lat coverage 0.732 |
| 48489 | Willacy | 1 | short | East inset |

**Ruling on the eight non-Bell shorts:** multi-shapefile truncation is **ruled out** (each ships exactly one `.shp`). They are **not** certified as “just water.” Adversarial review correctly killed that narration. They remain open geographic-short exceptions for a later land-mask / source-coverage lane. They were not re-ingested here.

**Sensitivity (adversarial, accepted):** an edge-aligned one-third loss on a median Texas county should trip the thresholds; a central hole that leaves outliers on all four edges would not. Extrema-only is the right instrument class for this defect, not a full areal coverage proof.

## 3. Reader fix and justification

PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/404 (`fix/txgio-multi-shapefile` @ `4fafeed3`)

**Policy: fail closed when N > 1 unless `--multi-shp=concat`.**

Justification: silent auto-concat of a second shapefile that is a different feature class is its own defect. The explicit flag is the operator decision record. Honest-absence doctrine: every discovered `.shp` is logged; discarding one is a hard error naming every part.

Behavior:

1. `discoverAllShapefiles` finds all `.shp` with `.dbf`/`.prj` siblings, sorted deterministically (east before west).
2. N == 0 → fail; N == 1 → proceed (unchanged).
3. N > 1 without flag → fail naming every basename and requiring `--multi-shp=concat`.
4. With flag → stream all parts under one continuous `feature_index`; refuse mixed CRS across parts; vintage joins stems with `+`.

Unit tests: `shapefileDiscover.test.ts` 7/7 green.

Operational consequence (named, not fixed here): wave scripts that omit the flag will fail closed on Harris until they pass it. That is intentional. `--limit` on apply can still commit a partial multi-part load — adversarial HOLD item; not closed in this lane.

## 4. Harris re-ingest (alone, concurrency 1)

TLS recipe: `NODE_OPTIONS=--use-system-ca` + library browser UA.

### Dry-run

```
shapefiles discovered (2): ...harris_east_202508.shp, ...harris_west_202508.shp
!! MULTI-SHP CONCAT: 2 shapefile parts...
features would load: 1523641
rows would delete:   564948
rows would insert:   1602031
features declined:   0
duration:            199.5s
EXIT=0
```

Dry predicted **1,523,641** features — not ~565k. The fix took. (The ~1.65M briefing estimate was order-of-magnitude; the live archive yields 1.52M.)

### Apply (alone)

```
features load: 1523641
rows delete:   564948
rows insert:   1602031
features declined: 0
duration:      2062.7s
EXIT=0
```

Dry predicted apply exactly. **Count equality is not the completeness proof** (adversarial D) — it is only dry/apply parity of one reader.

### Post-apply geographic proof (the actual grade)

Observed `2026-08-09T16:55:55Z` after the apply transaction committed. Artifact: `_inbox/multishp_harris_logs/48201_post_apply_geo.json`.

| Probe | Pre-apply | Post-apply | Census (TIGERweb) |
| --- | ---: | ---: | ---: |
| westmost | −95.436413 | **−95.960827** | −95.960733 |
| eastmost | −94.907611 | −94.907611 | −94.908492 |
| parcels `west_lng < −95.44` | 0 | **769,053** | — |
| parcels `west_lng < −95.80` | 0 | **26,613** | — |
| parcels `west_lng < −95.90` | 0 | **1,589** | — |
| store row count | 564,948 | 1,602,031 | — |
| west inset vs Census | +0.524° | **−0.00009°** | — |

Westmost now matches the Census west edge within a hundredth of a millidegree. Parcels exist deep into the former missing half (1,589 west of −95.90), so the new edge is not a single garbage outlier. This is the customer-done instrument for this defect.

Logs: `_inbox/multishp_harris_logs/48201_dry.log`, `48201_apply.log`.

## 5. Concurrency note

Recorded only: 8-way concurrency deadlocked (`40P01`) on the shared `txgio_parcel` index despite county-disjoint PKs. This Harris apply ran alone. Future waves: concurrency 1–2.

## 6. Downstream atom contamination

Artifact: `_inbox/2026-08-09_MULTI_SHP_atom_contamination.md`.

| Check | Result |
| --- | --- |
| Harris `48201` parcel-node atoms | **0** |
| Any Harris-scoped atoms | **0** |
| Live parcel-node total | 796,046 across 79 county tenants |

Harris truncation did **not** contaminate the atoms store. No atom writer was run.

**Repair if a future truncated county were atomized (named, not executed):** retire scoped `tx_<FIPS>` parcel-node and dependent atoms keyed by `parcelNodeId`, re-mint from the complete geometry store after full ingest, regenerate dependents, validate reference integrity. Some atoms use `_feature-<vintage>-<index>` keys, so vintage/index remapping after a multi-part re-index must be planned explicitly.

## 7. Adversarial review (verbatim verdict)

Review file: `_inbox/2026-08-09_MULTI_SHP_adversarial_review.md`.

> VERDICT: HOLD. The planner has demonstrated an internally complete 254-row sweep roster, a real Harris two-file archive, and a reader change that stops the original silent-first-file behavior on PR #404. It has not demonstrated the two conclusions it wants to operationalize: that every non-Harris short extent is water rather than missing parcel data, or that the Harris reload now contains real west-Harris land. The supplied geographic artifact predates the reload; dry/apply equality, feature totals, row totals, and decline totals all share the same reader and are therefore non-independent. Treat the eight non-Bell short counties as unresolved, require a post-apply spatial proof for Harris, and do not call the statewide blast radius exactly one until the sweep retains parse-level ZIP/ZIP64 evidence and an independent archive sample succeeds. Merge #404 only with an explicit Harris `--multi-shp=concat` wave invocation and a guard against `--limit` committing a partial replacement.

**Planner response to HOLD (post-review evidence, not a re-grade by the reviewer):**

1. Coastal-as-water narration: **accepted kill.** Eight shorts stay unresolved; multi-shp ruled out only.
2. Post-apply spatial proof: **produced** at `48201_post_apply_geo.json` (westmost −95.960827; 26,613 west of −95.80; 1,589 west of −95.90; Census inset −0.00009°).
3. Independent archive sample: **produced** (`sweep_spotcheck.json`, 5/5 match, `zip64=false`).
4. `--limit` partial-apply and wave-flag wiring: **open debt**, correctly held.

Lane status: reader fix PR open; Harris geometry customer-done by geographic probe; statewide multi-shp blast radius is Harris-only under the conditioned sweep claim; eight coastal shorts remain open non-multi-shp exceptions.

## 8. Authority boundaries observed

No merge. No deploy. No atoms-store writes. No VACUUM. Direct Neon host (pooler stripped); writability proven with CREATE/INSERT/DELETE/DROP before runs. Harris applied alone.

## 9. Verbatim git status

### legacy-design-tools worktree (`P:\legacy-design-tools-multishp`)

```
## fix/txgio-multi-shapefile...origin/fix/txgio-multi-shapefile
```

Commit: `4fafeed3 fix(txgio): fail-closed multi-shapefile discovery with --multi-shp=concat`
PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/404 (OPEN)

### doc_repo lane artifacts (`git status --porcelain`)

```
?? _inbox/2026-08-09_MULTI_SHP_TRUNCATION_report.md
?? _inbox/2026-08-09_MULTI_SHP_adversarial_review.md
?? _inbox/2026-08-09_MULTI_SHP_atom_contamination.md
?? _inbox/2026-08-09_MULTI_SHP_geo_verify_raw.json
?? _inbox/2026-08-09_MULTI_SHP_geo_verify_summary.md
?? _inbox/2026-08-09_MULTI_SHP_sweep_raw.json
?? _inbox/2026-08-09_MULTI_SHP_sweep_summary.md
?? _inbox/multishp_harris_logs/
```

Also updated in working tree: `_STATE.md`, `_catalog/thesis_parity_ledger.md`.
