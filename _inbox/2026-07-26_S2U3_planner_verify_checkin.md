---
id: 2026-07-26_S2U3_planner_verify_checkin
title: Check-in — S2-U3 planner live verify (MET)
status: check-in
date: 2026-07-26
planner: depth-engine planning agent
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/139
---

# S2-U3 planner verify

Live probes `2026-07-27T05:54Z` (tally) + `2026-07-27T05:56Z` (primitive warm compute).

## Live evidence (pasted)

**Tally**

```
depth_warm              = 3642
place_type universe     = 3657
depth_ratio_place_type  = 99.59%   (was 3538 / 96.75%)
boundary_edges          = 26454
boundary_parcels        = 3654
boundary_not_warm       = 12
road_nodes              = 6201 (county-surveyed-2016=1307)
```

**Gold warm via `readBoundaryEdgesForParcel` + `computeWarmCandidateFromBoundary` (live substrate + txgio rings):**

```
48021:28286  warmAgentId=depth-warm-boundary-primitive-v1
             area=7316.34  insetFeet=[0,0,15,0]  empty=false
             edges: rear0 / side0 / front15 / side_corner0

48021:34785  area=13632.37 insetFeet=[0,0,0,15] empty=false
48021:33512  area=23254.09 insetFeet=[0,0,0,5,15,0] empty=false
```

Unmapped edges on gold: setback.kind=`unmapped-adjacency`, no feet field.

**Fixtures (planner local on `288d658`):** 16/16 — offset-consumes-primitive + clip-self-touch PATCH-A + front-labeling gate.

**CI:** PR #139 `typecheck + test` **pass** (run 30241046568, 1m49s).

Note: persisted `buildable-envelope` atoms for already-warm gold parcels retain older `depthWarmVerifiedAt` / areas (promote skipped already-promoted). Live **compute** path is the U3 proof; tally delta is +104 new promotes.

## Grades

| Item | Grade | Evidence |
|------|-------|----------|
| U3.1 / 27f WDLL 6 | **MET** | 28286 front@edge2 → 7316.34 via primitive; empty=false |
| U3.2 Fixture | **MET** | spy test + live warmAgentId=`depth-warm-boundary-primitive-v1` |
| U3.3 Unmapped honest | **MET** | live unmapped-adjacency; inset 0 |
| U3.4 Self-touch negative | **MET** | fixture still rejects |
| U3.5 Re-promote | **MET** | 3538→3642 (96.75%→99.59%) |
| U3.6 Gates | **MET** | CI green + 16/16 fixture class |

## Verdict

**MET.** Merge #139. Central-TX remains **HELD** (operator gate; U1 city OSM proxy still OPEN).
