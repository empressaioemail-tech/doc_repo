---
id: 2026-07-27_TRACK_B_STATUS
title: STATUS — Track B customer-UI quality
status: closed
date: 2026-07-27
last_updated: 2026-07-27 (B1-map viewport network MET)
applies_to: hauska-engine, hauska-map (property-explorer)
related: [2026-07-27_TRACK_B_customer_ui_quality_WDLL, 2026-07-27_TRACK_B_live_after_grades, _scratch/customer-ui-track-b]
owner: nick
---

# STATUS — Track B customer-UI quality

Planner verifies against live PE + live site-plan. CTX HELD.

## Serving

| Service | Revision @ 100% | Note |
|---|---|---|
| hauska-engine-api | `00090-juq` tag `track-b` | #146 |
| hauska-retrieval-api | `00037-nil` tag `b1map` | #147 near-bbox |
| property-explorer | `property-explorer-xi` | #78 viewport roads |

## Wave board

| Unit | Status | Evidence |
|---|---|---|
| B1 Road render | **MET** | Site-plan STREET + PE viewport road NETWORK |
| B2 Design pass | **MET** | Live 34785 PDF |
| B3 Vocab | **MET** | Card ~13641 matches PDF |
| M0 | **MET** | dual-repo parity |
| Finish | **CLOSED** | `_inbox/2026-07-27_TRACK_B_live_after_grades.md` |

## Live URLs

- PE: `https://property-explorer-xi.vercel.app`
- Retrieval near-bbox: `GET /road-nodes/near-bbox?countyFips=&westLng=&southLat=&eastLng=&northLat=`
