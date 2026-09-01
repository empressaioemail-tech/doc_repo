---
id: 2026-07-27_siteplan_frame_regression_grades
title: Site-plan extent regression — live multi-parcel grades
status: active
date: 2026-07-27
planner: Track B customer-UI planner
related: [2026-07-27_site_plan_bad_attach_road_15094293_audit_flag, _scratch/customer-ui-track-b]
---

# Site-plan frame regression — grades

Engine #149 + #152. Serving: `hauska-engine-api-00093-gej` @ 100% tag `siteplan-frame`. Samples: `_inbox/2026-07-27_siteplan_frame_fix_live/`.

## Diagnosis (confirmed)

1. **Extent included full street geometry** in `computeDrawingTransform` — long OSM ways + outliers blew the bbox; parcel scaled to a dot.
2. **`48021:road:15094293` is a distant bad attach** (~1.6 km from 33890) — also flagged for audit planner.

## Fix

Fit on parcel + setback + margin only. Streets clipped to local parcel+ROW buffer `max(0.5×span, 40 m)`. Blank street-name labels skipped.

## Live AFTER (four parcels)

| Parcel | Extent / frame | Frontage road | Notes |
|---|---|---|---|
| **33890** | **MET** — parcel fills frame, centered | **MET** — Chestnut at south frontage | Outlier 15094293 dropped. Residual bottom setback/bearing overlap (craft debt). |
| **34785** | **MET** | none drawn | Attaching Wilson ~680 m away — clip correct; data skeleton. |
| **33512** | **MET** | none drawn | Spring ~184 m; 15094293 ~1.5 km — clip correct. Labels clean. |
| **28286** | **MET** | none drawn | Spring ~1.2 km — clip correct. Side label overlap craft debt. |

## Negative done-line

| Criterion | Result |
|---|---|
| Parcel collapsed / off-center | **CLEARED** (all four) |
| Road as distant floating outlier | **CLEARED** (33890 outlier dropped; no floaters) |
| Overlapping labels | **PARTIAL** — 33890 bottom + 34785/28286 side setback vs bearing (pre-existing craft; not extent) |
| Graded on one parcel only | **CLEARED** — four parcels |

## Verdict

**Extent regression MET.** Frontage road MET where attaching is near (33890/Chestnut). Distant attaching is an audit/data thread, not a reopen of the frame bug.
