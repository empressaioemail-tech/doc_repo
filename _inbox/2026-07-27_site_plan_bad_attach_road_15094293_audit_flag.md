---
id: 2026-07-27_site_plan_bad_attach_road_15094293_audit_flag
title: Audit flag — bad attaching road-node on 48021:33890
status: active
date: 2026-07-27
planner: Track B customer-UI planner
audience: audit / depth-engine planner
related: [2026-07-27_TRACK_B_customer_ui_quality_WDLL, _scratch/customer-ui-track-b]
---

# Audit flag: `48021:road:15094293` on parcel `48021:33890`

Site-plan PDF regression QA (2026-07-27) found a **data skeleton** in addition to the PDF frame bug (engine #149 clips streets so the sheet no longer depends on this).

## Observation

Live `POST …/property-nodes/48021:33890/attaching-roads` returns two roads:

| roadNodeId | displayName | centerline bbox (approx) | ~dist to parcel |
|---|---|---|---|
| `48021:road:15094293` | (empty) | lng −97.3139…−97.3132 / lat 30.1238…30.1253 | **~1.6 km** |
| `48021:road:50642361` | Chestnut Street | lng −97.3216…−97.3151 / lat ~30.1105 | **~45 m** (frontage OK) |

Parcel / warm envelope ring for `48021:33890` sits near lng −97.3183 / lat 30.1109.

## Sibling attaching distances (same QA set)

| parcel | attaching road | ~min dist | note |
|---|---|---|---|
| `48021:34785` | Wilson `15106232` | **~680 m** | drawn pre-clip; not frontage |
| `48021:33512` | Spring `123456789` | **~184 m** | synthetic-looking id |
| `48021:33512` | `15094293` | **~1.5 km** | same bad node as 33890 |
| `48021:28286` | Spring `123456789` | **~1.2 km** | not frontage |

## Ask for audit planner

1. Why did boundary-edge / attaching resolution attach `15094293` to `33890` and `33512`?
2. Is the road-node geometry wrong, the attach graph wrong, or both?
3. Empty `displayName` on that node — ingest gap or OSM unnamed?
4. Why do Wilson / Spring attach at hundreds of meters for 34785 / 28286 / 33512?
5. Road id `123456789` on Spring — synthetic / fixture leak into prod?

PDF craft now drops geometry outside the parcel+ROW (~40 m) clip, so distant attaches no longer blow the sheet — but attaching-roads remain wrong for any surface that trusts them as “fronting street.”