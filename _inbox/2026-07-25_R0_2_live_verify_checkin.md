---
id: 2026-07-25_R0_2_live_verify_checkin
title: Check-in — R0.2 live verify + WDLL 1 grade (R0 closeable)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
pr: https://github.com/empressaioemail-tech/legacy-design-tools/pull/357
merge_sha: 124060c1f0cd775f41a00dc9c48c87e2ae925aff
serving: cortex-api-00438-zop
---

# R0.2 live verify check-in

## Independent evidence

```
PR #357 CI green (30175823548); local spineZoningDistrict 4/4; conditions ["workspace"] unchanged
Merged squash → 124060c1… ; image build 30176121405; canary 30176255519 → cortex-api-00438-zop
Shift 30176338465 → serving cortex-api-00438-zop @ 100%

CANARY/PROD POST 714 Spring St:
  status=ok decline=null parcel_node_id=48021:33512
  spineZoningSource=baked-snapshot effectiveZoningCode=P-5
  features=1 geom=Polygon ringLen=7 empty=false
  buildableAreaSqFt=21198 parcelAreaSqFt=25797 edgeSignal=road (corner lot)
  coverage cites baked node-facet snapshot @ 2026-07-23; not invented

Structural geometryCorrectnessGate(parcelFixture, liveRing, zeros): pass=true reasons=[]

PROD companions:
  802 CHESTNUT → 48021:47728 status=ok features=1 area=8707 edge=road
  1010 PECAN  → 48021:47595 status=ok features=1 area=22302 edge=road ringLen=8
  gate(47728 fixture, live ring, zeros): pass=true
```

## Grades (R0 close card)

| Item | Grade | Evidence |
|---|---|---|
| 27c WDLL 1 | **MET** | Live rings on 714 Spring (corner+road), 47728 irregular, 47595 multi-edge; structural gate pass; rectangular covered by CI fixtures on same `insetPerEdge` path. Approximate disclosure honest (not_specified axes). |
| 27c WDLL 2 | **MET** | Prior R0.1 + still green on main. |
| 27c WDLL 5 | **MET** | Prior R0.1; live 714 uses road signal (not shape shortest-edge). |
| M0.2 / M0.3 | **MET** | Scratch dogfood; mechanical guards promoted via tests. |

## R0 status

**R0 CLOSEABLE.** Geometry truth + spine zoning unblock live on serving cortex-api. Next program step: **R1 road node**.

## Negative checks held

- True absence still declines (companions without bake still `no-zoning-stamp`).
- Anti-fabrication: district provenance names baked snapshot; GIS zoningCode remains null on parcel props.
