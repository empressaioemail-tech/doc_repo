---
id: 2026-07-27_TRACK_B_live_after_grades
title: Track B live-AFTER grades (planner) — B1-map reopened then MET
status: closed
date: 2026-07-27
last_updated: 2026-07-27 (B1-map viewport network live)
planner: Track B customer-UI planner
related: [2026-07-27_TRACK_B_live_verify_proceed, 2026-07-27_TRACK_B_customer_ui_quality_WDLL]
---

# Track B live-AFTER grades

CTX HELD. Verification is planner-only.

## Deploy truth

| Service | Serving @ 100% | Note |
|---|---|---|
| hauska-engine-api | `00090-juq` tag `track-b` | merge #146 |
| hauska-retrieval-api | **`00037-nil` tag `b1map`** | merge #147 near-bbox |
| property-explorer | `property-explorer-xi` | #77 + **#78** viewport roads |

## B1-map reopen diagnosis (read-only)

| Question | Answer |
|---|---|
| Parcel-only or viewport? | **Parcel-only** — `ExplorerMap` fetched `POST …/attaching-roads` on inspect only |
| Bbox HTTP endpoint? | **No** until #147 — StoragePort `listRoadAtomsNearBbox` was stranded (CC-A pattern) |
| Coverage gap? | **No** — gold viewport Neon SELECT = **1078** road-nodes; county 17552 |

Rendering of one fronting road worked; serving scope was the bug.

## Fix

- Engine [#147](https://github.com/empressaioemail-tech/hauska-engine/pull/147): `GET /road-nodes/near-bbox`
- Map [#78](https://github.com/empressaioemail-tech/hauska-map/pull/78): viewport move/zoom loads near-bbox (zoom≥parcel gate); inspect no longer clears road layer

## Live re-verify (network, not one road)

- PE proxy near-bbox **200**, count=400; streets include Spring, Chestnut, Main, Pecan, Water, Jefferson, Pine, Wilson
- Live map (hydrology off): blue centerline+ROW network across the grid, not a single diagonal
- Card still `~13,641 sq ft (provisional)` (B3 holds)

## Per-unit grades

| WDLL | Unit | Grade |
|---|---|---|
| 1 | B1 site-plan | **MET** |
| 2 | B1 map road NETWORK | **MET** (regraded after viewport fix) |
| 3–4 | B2 | **MET** |
| 5 | B3 vocab | **MET** |
| 6 | Customer QA | **MET** |
| 7 | M0 | **MET** |

## Negative done-line

Empty STREET CLEARED. Crude PDF CLEARED. Surface disagreement CLEARED. Roadless viewport CLEARED. Survey-grade fabrication CLEARED.
