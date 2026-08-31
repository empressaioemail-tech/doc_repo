---
id: 2026-07-26_PATCH_A_checkin
title: Check-in — PATCH-A place-type re-promote (96.75% ceiling)
status: check-in
date: 2026-07-26
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/136
merge: 12ab8a1ebf6cad1cfc6f5663dde5f2db233aaa0c
---

# PATCH-A promote check-in

Promote finished **2026-07-26T18:05:45-05:00** (~2.1 h wall). Executor stalled before filing; planner closed from live SQL + `patcha-promote-log.txt`.

## Code

PR [#136](https://github.com/empressaioemail-tech/hauska-engine/pull/136) merged `12ab8a1e` — `cleanClipRingArtifacts` before guard; positive-space fixtures. Live 28286 verified earlier (edge2 7316).

## BEFORE → AFTER

| | depth_warm | place_type | ratio |
|--|--:|--:|--:|
| BEFORE | 2712 | 3657 | 74.16% |
| AFTER (live) | **3538** | 3657 | **96.75%** |

**+826** new promotes (matches log `promoted=826`).

## Promote outcomes (verbatim from log)

```
roadsLoaded: 4894
processed: 3654
promoted: 826
verifyPass: 826
verifyFail: 6
already-promoted: 2712
no-road-adjacency: 110
wallMsTotal: 7420521 (~2.06 h)
extrapolatedJurisdictionUsd: 0.0858
```

## Residual (one path)

| Bucket | Count |
|--------|------:|
| no-road-adjacency | 110 |
| geometry-empty (verifyFail) | **6** |
| would-promote remaining | **0** |
| place-type outside city bbox | 3 |
| **Remaining unwarmed** | **119** (3657−3538) |

Pre-patch SHOULD-DRAW estimate was ~461; recovery was **826** (clip cleanup unblocked more than the near-rect sample class). Geometry-empty collapsed **832 → 6**.

## Honest ceiling (place-type)

**3538 / 3657 = 96.75%** under the FIX 2.1 road path + PATCH-A geometry.

Remaining tail: **110** no-road (honest until roads widen) + **6** geometry-empty + **3** outside city cohort. PDD still separate.

## Central-TX

Still **HELD** for operator greenlight (boundary primitive Wave 1 is next product work; depth ceiling is now known and high).
