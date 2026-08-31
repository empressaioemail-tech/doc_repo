---
id: 2026-07-27_CC_A_fanout_checkin
title: CC-A fan-out — WDLL approved (Amendments 1–2); U1+U3 builders launched
status: checkin
date: 2026-07-27
applies_to: hauska-map, hauska-engine
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
owner: nick
related: [2026-07-27_CC_A_builder_units, 2026-07-27_CC_A_phase0_live_reaudit_and_build_spec]
---

# CC-A fan-out check-in

**WDLL:** approved 2026-07-27 with Amendments 1–2.  
**CTX:** HELD.

## Amendments locked

1. U1 done-line = live **walkable** graph on `48021:28286` through CC UI
   (parcel↔boundary-edge↔road↔neighbor) — not endpoint-200.
2. Property-line-tags OPTIONAL; if landed, provenance **"not a survey"** only;
   must not block organism. Survey-grade out of scope.

## Builders

| Unit | Status | Agent |
|---|---|---|
| U1 node organism + edges API | **RUNNING** | [CC-A U1](9dd3cbe4-b9ec-45aa-bc2c-98bddf2619a5) |
| U3 map swap + degraded | **RUNNING** | [CC-A U3](6afc58ad-4a4d-428f-9e3f-6b68cd9c1b3c) |
| U2 inspector + back-nav | **QUEUED** — fans when U1 APIs/walkable card land | — |

Planner owns live grades on gold parcels after each unit close. Builders do not
self-grade. Per-unit grades will be filed in a follow-on planner check-in.
