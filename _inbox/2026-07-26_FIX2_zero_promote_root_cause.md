---
id: 2026-07-26_FIX2_zero_promote_root_cause
title: Finding — FIX2 0 promote vs recon 395 (road filter / front steal)
status: finding
date: 2026-07-26
planner: depth-engine planning agent
parent_checkin: _inbox/2026-07-26_FIX2_place_type_residual_promote_checkin.md
---

# FIX2 zero-promote root cause

## Verdict

The recon **395 would-promote** and the FIX2 batch **0 verifyPass** are not the same classifier. Batch load-filters roads with `isFrontEligibleRoad` (**3617**); recon reported **4894** road atoms. On specimen `48021:34785`, that delta flips the front edge and empties the warm inset.

## Live evidence (2026-07-26, HEAD with FIX 1.1)

| Road set | Count | Front label | Warm | verifyPass |
|----------|------:|-------------|------|------------|
| Load-filtered (`isFrontEligibleRoad` at batch intake) | 3617 | edge **0** `major_collector` / `secondary` | empty — setbacks exceed lot | **false** |
| All road-node polylines (no load filter) | 4894 | edge **3** `unclassified` | area ≈ **13641** | **true** |

Front eligibility is already enforced inside `labelEdgesFromRoads` when picking `nonAlleyHits` (`edgeLabeling.ts`). The **extra** filter in `roadAtomToWarmSource` (batch script) removes footways/paths from the hit pool entirely. Those ineligible ways can still be the closest hit on a collector edge; when present they occupy `bestByEdge[i]`, get excluded from front competition, and leave the local unclassified street free to win front. When stripped at load, the collector becomes `bestByEdge` on that edge and wins front by distance (preference tie-break only within 2 m).

So recon’s 395 is **real under the unfiltered load path**, not under the production batch path. FIX2 did not “miss” promotes — it honestly re-ran the filtered path and got zero.

## Bucket drift explained

| Bucket | Recon (≈4894 roads) | FIX2 batch (3617) |
|--------|--------------------:|------------------:|
| no-road-adjacency | 110 | 407 |
| geometry-empty | 807 | 902 |
| would-promote | 395 | 0 |

Same residual size (1312); different front/adjacency outcomes under the two road sets.

## What FIX 1.1 does / does not do

FIX 1.1 fixed **site-plan** WGS84 inset parity. Depth-warm inset on 34785 was already fine under the unclassified-front labeling. FIX2’s 34785 failure is **edge labeling / road intake**, not polygon-clipping.

## Recommended FIX 2.1 — SUPERSEDED by approved WDLL

Operator amendment 2026-07-26: stopping the load-filter alone is **wrong framing** (restores footway-shadow accident). Load-bearing bar is correct-by-rule front competition + M0 FRONT-LABELING FIXTURE GATE. Card: `_inbox/2026-07-26_FIX2_1_front_labeling_WDLL.md`.

## Central-TX

Still **HELD**. True place-type ceiling unknown until 2.1 lands and residual is reclassified once under one road path.
