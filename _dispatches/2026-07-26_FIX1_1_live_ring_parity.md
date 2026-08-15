---
id: 2026-07-26_FIX1_1_live_ring_parity
title: Dispatch — FIX 1.1 live txgio ring parity (34785 still declines)
status: closed
date: 2026-07-26
applies_to: [hauska-engine]
planner: depth-engine planning agent
parent: FIX 1 PR #133 merged 5f7558d
---

# FIX 1.1 — live ring, not synthetic fixture

## Planner live verify FAIL after #133

On main `5f7558d`, with **live txgio** ring for `48021:34785`:

| Path | Result |
|------|--------|
| depth-warm `insetPerEdge([0,0,0,15])` | empty=false, area=13641 |
| site-plan `computeSetbackOffset` (local ENU) | **still** `setback-consumes-lot` degenerate |

Parity test used a **synthetic axis-aligned fixture** (`PARCEL_1009_CHESTNUT_34785`) that passes; live ring is slightly skewed and fails site-plan path.

```
fixture: sitePlan deg=false area=13695; depthWarm 13695
live-txgio: sitePlan deg=true; depthWarm 13641
```

## Required

1. Unify on WGS84 `insetPerEdge` for the offset ring (then project to local for CAD), OR fix local-meter inset + degeneracy so live 34785 matches depth-warm.
2. Replace/augment parity test with the **live txgio coordinates** (paste the 5-vertex ring from recon), not only the synthetic rect.
3. PR, CI green. Do not merge until planner re-verifies live 34785 site-plan non-degenerate with area ≈ 13641.

No county fan-out. No warm promote in this PR.
