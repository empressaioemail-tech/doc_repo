---
id: 2026-07-25_R4_verify_checkin
title: Check-in — R4 depth-cost PARTIAL (cost clears; coverage does not)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
governs: 27c R4
cites:
  - 27c WDLL 7
  - 27c WDLL 9
related:
  - _dispatches/2026-07-25_R4_bastrop_depth_cost
  - _scratch/depth-engine-27c
---

# R4 verify check-in

## Merge

| Repo | PR | SHA |
|------|-----|-----|
| hauska-engine | [#127](https://github.com/empressaioemail-tech/hauska-engine/pull/127) | (squash to main) |

Tooling merged: Overpass road ingest, batch warm+cost JSON, edge labeling, tally script. WDLL 7 end-state not met.

## Planner live tally (verbatim 2026-07-25)

```
 road_nodes | zoning_facts | depth_warm
------------+--------------+------------
       1188 |         5769 |          1
```

Depth ratio ≈ 0.017%. Still essentially the R3 pilot envelope (`48021:33512`).

## Cost (executor 500-cohort; dollars gate)

Extrapolated jurisdiction compute ≈ **$0.28** (usdPerParcel × 5769), wall ~7h automation — under commitment #3 **$200** compute. `flaggedOverCostGate: false`. Human-review hour is a separate bar; not claimed cleared by wall-clock alone.

Planner city re-probe (`48021:47728`, `48021:47595` with `TXGIO_DATABASE_URL` set): both `verifyPass=false`, reasons `inset ring is null` / warm empty — **0 new promotes**. Lexical 500-cohort skew (450 `no-road-adjacency`) plus city empty-inset means measured cost is real but **promote throughput is not**.

## WDLL grading

| Item | Grade | Evidence |
|------|-------|----------|
| 7 Bastrop warm + cost | **PARTIAL** | Cost measured under $200. Roads 1,188 (city bbox, not full county). depth_warm=1. Batch does not yet promote city cohort at scale. |
| 9 Aerial calibration | **PARTIAL** | ROW still `approximate-assumed-per-class`; ~15m OSM-to-front on 714 Spring. |

## Operator decision (routed)

**Recommendation: do NOT greenlight eager Central-TX depth yet.**

Reasoning: compute cost clears the dollar gate easily; coverage and promote-rate do not. Opening Central-TX would multiply the empty-inset / road-adjacency gap across ~2M zoning-facts. Next is R4.1 (county road bbox + fix empty-inset on city parcels that cortex already envelopes) until depth_warm climbs and a city-cohort promote rate is pasted live. Then re-ask.

## Next

R4.1 — full-county Overpass + diagnose/fix batch empty-inset (47728/47595); city-geo cohort promote; re-tally.