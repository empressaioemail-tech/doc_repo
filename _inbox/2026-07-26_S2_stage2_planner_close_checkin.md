---
id: 2026-07-26_S2_stage2_planner_close_checkin
title: Check-in — Stage 2 boundary primitive CLOSE (planner grades vs live)
status: check-in
date: 2026-07-26
planner: depth-engine planning agent
governs: 27f Stage 2 WDLL 4–6
related:
  - _inbox/2026-07-26_S2U1_planner_verify_checkin.md
  - _inbox/2026-07-26_S2U2_planner_verify_checkin.md
  - _inbox/2026-07-26_S2U3_planner_verify_checkin.md
  - _inbox/2026-07-26_PRE2_adjacency_at_scale_checkin.md
---

# Stage 2 — planner close

Autonomy from fail-closed gates + live probes. Three units graded independently; this is the rollup.

## Merge SHAs (live)

| Unit | PR | Merge / state |
|------|-----|---------------|
| U1 StreetsSurveyed2016 | [#137](https://github.com/empressaioemail-tech/hauska-engine/pull/137) | merged `ab9d5fd` |
| U2 Boundary primitive | [#138](https://github.com/empressaioemail-tech/hauska-engine/pull/138) | closed superseded by #139 |
| U3 Offset consumes | [#139](https://github.com/empressaioemail-tech/hauska-engine/pull/139) | merged `7540de2` (includes U2) |

## 27f Stage 2 WDLL grades

| # | Item | Grade | Live evidence |
|---|------|-------|---------------|
| 4 | Property lines first-class (role+adjacency+rule+interior+temporal) | **MET** | 26,454 `property-boundary-edge` atoms / 3654 parcels; gold bodies carry all fields |
| 5 | Adjacency from live parcel+road (PRE-2 method) | **MET** | Gold PRE-2 neighbors exact; persist via `adjacency-grid.ts` cell-grid+PIP |
| 6 | Offset consumes primitive; 28286-class cannot recur | **MET** | Live warm 28286 area=**7316.34** inset=[0,0,15,0] via `depth-warm-boundary-primitive-v1` |
| Amend | StreetsSurveyed2016 retires OSM proxy in labeling | **PARTIAL** | +1307 county CR roads; city specimens still osm-fallback |

## Re-promote (pasted)

```
BEFORE: depth_warm=3538 / 3657 = 96.75%
AFTER:  depth_warm=3642 / 3657 = 99.59%   (+104)
boundary_edges=26454  boundary_not_warm=12
```

## StreetsSurveyed before/after (proxy retirement)

| Specimen | Before | After |
|----------|--------|-------|
| City gold (28286/34785/33512/104985) | OSM proxy labels | **unchanged osm-fallback** (no county CR hit) |
| County CR (e.g. POTATO SMITH RD) | n/a | `county-surveyed-2016` gravel live |

## M0 promotions (planner)

1. **PRE-2 adjacency** → durable code: `packages/engine-core/src/boundary-primitive/adjacency-grid.ts` (+ live scale check-in). Rule: county+ = one-load + cell-grid + PIP; forbid per-edge bbox scan.
2. **Offset reads primitive** → `offset-consumes-primitive.test.ts` (spy + 28286 ~7316).
3. **Unmapped honest** → same suite + live `unmapped-adjacency` atoms.
4. **County-wins-OSM** → `county-osm-priority.test.ts` (unit); live city coverage still OPEN.

## OPEN / HOLD

- Central-TX **HELD** (operator).
- U1 city street authoritative source still owed (StreetsSurveyed2016 ≠ city grid).
- Atom-contract publish of `property-boundary-edge` (vendored in engine for now).
- Already-promoted gold envelope atoms not rewritten on re-promote (compute path is correct; optional refresh).

## Negative done-line check

Guard not weakened (self-touch fixture green). Boundary is first-class temporal node, not a private helper. No Central-TX fan-out. No fabricated v2 coverage claim.
