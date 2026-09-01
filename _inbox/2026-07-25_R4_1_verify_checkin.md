---
id: 2026-07-25_R4_1_verify_checkin
title: Check-in — R4.1 city promote fix verified (depth_warm=3)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
governs: 27c R4.1
cites:
  - 27c WDLL 7
related:
  - _dispatches/2026-07-25_R4_1_city_promote_throughput
  - _inbox/2026-07-25_R4_verify_checkin
---

# R4.1 verify close

## Merge

| Repo | PR | SHA |
|------|-----|-----|
| hauska-engine | [#128](https://github.com/empressaioemail-tech/hauska-engine/pull/128) | (squash to main) |

## Planner live SELECT

```
   parcel    |          warm          | area
-------------+------------------------+-------
 48021:33512 | depth-warm-promoted-v1 | 23507
 48021:47595 | depth-warm-promoted-v1 | 24644
 48021:47728 | depth-warm-promoted-v1 | 9248

 road_nodes | depth_warm
------------+------------
       1188 |          3
```

Empty-inset root cause (footway/collector front mislabel + alley+front collapse) fixed with mechanical tests (10/10 depth-warm; CI green). No not_specified fabrication.

## WDLL 7 status

Still **PARTIAL**. Promote path works on named city parcels; city-cohort batch still ~147/150 `no-road-adjacency` because road ingest bbox ≠ full city parcel universe. Cost still under gate.

## Operator

Central-TX remains **NO**. Next: widen Overpass road coverage to city/county cohort, re-run city-cohort promote, re-tally depth_warm.
