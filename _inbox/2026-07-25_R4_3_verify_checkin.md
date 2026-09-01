---
id: 2026-07-25_R4_3_verify_checkin
title: Check-in — R4.3 gravel rows verified (depth_warm=18); PDD ceiling named
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
governs: 27c R4.3
cites:
  - 27c WDLL 7
---

# R4.3 verify close

## Merge

| Repo | PR | SHA |
|------|-----|-----|
| hauska-engine | [#130](https://github.com/empressaioemail-tech/hauska-engine/pull/130) | (squash to main) |

## Planner live SELECT

```
 road_nodes | depth_warm | zoning
------------+------------+--------
       4894 |         18 |   5769
```

Depth ratio ≈ 0.312%. Cohort promote 12/150 (vs R4.2's 3); remaining mass is honest `no-setback-row` on **PDD** (~130/150), not gravel mismatch.

## Anti-fabrication

Gravel/unclassified → Place Type build-to-line via B3 6.5.003 citation (same atom_did as local street). PDD declines without invented feet. Acceptable for v1; not a silent map.

## WDLL 7

Still **PARTIAL**. Cost under gate. City roads + place-type promote path work. End-to-end "full" Bastrop warm is blocked by PDD site-specific setbacks (majority of city zoning stamps in the cohort), not by compute.

## Operator recommendation

**Central-TX depth: still NO** for eager full-metro warm.

Optional next: R4.4 place-type-only warm pass (P-1..P-5 / non-PDD) across Bastrop to drive depth_warm on the resolvable universe, then re-score WDLL 7 as PARTIAL(place-type) vs MET. PDD path is a separate product/descriptor wave (site-plan / entitlement atoms), not inventing feet in the warm loop.
