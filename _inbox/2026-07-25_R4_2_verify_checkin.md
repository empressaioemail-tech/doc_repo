---
id: 2026-07-25_R4_2_verify_checkin
title: Check-in — R4.2 road coverage verified (roads 4894, depth_warm 6)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
governs: 27c R4.2
cites:
  - 27c WDLL 7
---

# R4.2 verify close

## Merge

| Repo | PR | SHA |
|------|-----|-----|
| hauska-engine | [#129](https://github.com/empressaioemail-tech/hauska-engine/pull/129) | `1dcd3dfa` |

## Planner live SELECT

```
 road_nodes | depth_warm | zoning
------------+------------+--------
       4894 |          6 |   5769

48021:103281 57077
48021:105103 59563
48021:107923 40417
48021:33512  23507
48021:47595  24644
48021:47728  9248
```

Adjacency gate cleared for city cohort (no-road-adjacency 147→1). Promote rate still low; remaining fail mode is primarily `road-class-setback-no-match` on gravel frontage (descriptor gap).

## WDLL 7

Still **PARTIAL**. Cost under gate. City road coverage MET for bbox. End-to-end Bastrop warm + depth ratio toward full still OPEN.

## Operator

Central-TX remains **NO**. Next: gravel (and missing class) setback rows so cohort verifyPass climbs, then re-tally.
