---
id: 2026-07-27_CC_A_post_deploy_planner_live_verify
title: CC-A post-deploy planner live verify — Steps 0–5; WDLL MET; CC-A done
status: checkin
date: 2026-07-27
applies_to: hauska-map/apps/command-center, hauska-engine/services/retrieval-api
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
owner: nick
related:
  - 2026-07-27_CC_A_all_units_planner_rollup
  - 2026-07-27_CC_A_legible_node_atom_flow_WDLL
---

# CC-A post-deploy planner live verify (Steps 0–5)

Planner-only grade. Builders do not self-grade. Verified on live
`https://cmdcenter-blush.vercel.app` at 2026-07-27 ~13:42–13:50Z with
cache-bust `?v=planner-verify-20260727a`. CTX HELD.

## STEP 0 — Bundle landed (not stale)

| Check | Result |
|---|---|
| Browser `document.querySelectorAll('script[src]')` | `…/assets/index-BTKuoNXu.js` |
| Stale `index-eWdGi6qE.js` present? | **NO** (`stale: false`) |
| Organism chrome markers | placeholder accepts `…:boundary:2` / `…:road:…`; copy cites Control-Tower + `return=node-graph` |

**PASS.** Deploy took. Do not grade against stale console.

## STEP 1 — Amendment 1 walk (`48021:28286`) — PASTE

Structured parcel card (not pills+JSON primary):

- `NODE_ID 48021:28286` · `NODE_TYPE parcel` · `RESOLUTION_STATUS resolved` · `STATUS active`
- Identifiers: parcelNodeId / countyFips / propId
- **EDGES OUT 4:** boundary:0 rear unmapped; boundary:1 side neighbor 0ft; **boundary:2 front ROW 15ft**; boundary:3 side_corner ROW 0ft
- Family pills: property-boundary-edge 4 / buildable-envelope 1 / setback-rule 1 / zoning-fact 1

Clicked `out → has-boundary-edge · 48021:28286:boundary:2 — e2 · front · ROW · 15ft`:

- ROLE **front** · ADJACENCY **ROW** · SETBACK `{"feet":15,…}` · NEIGHBOR **35671** · FACING_ROAD **48021:road:123456789**
- Disclaimer: **GIS-approx edge geometry — not a survey.** (no survey-grade tags)
- Clickable: `faces-road · 48021:road:123456789` and `adjacent-parcel · 48021:35671`

Traversed road → structured road card (`displayName Spring Street`, `road-node 1`).
Traversed neighbor → `48021:35671` with 5 clickable boundary edges + family pills.

**PASS.** Stranded boundary graph is walkable in the UI.

## STEP 2 — WDLL 3–5 (inspector + back-nav)

From `48021:28286:boundary:2` → family pill → atom row → inspector:

- Hash: `#panel=atom-inspector&…&id=did:hauska:property-boundary-edge:48021:28286:boundary:2&return=node-graph&node=48021:28286:boundary:2&atoms=property-boundary-edge`
- CONFIDENCE object: **N=0 WIDTH=0.22 BASIS=seed** (never bare)
- Provenance/citation, bitemporal (valid_from / knowledge_time / captured_at)
- BOUNDARY PRIMITIVE: role front, adjacency ROW, setback 15′, interior ring, neighbor, facing road
- Property-line-tags: **not attached** (Amendment 2 optional); card says optional; **not survey-grade**

`← back to node` → `#panel=node-graph&node=48021:28286:boundary:2&atoms=property-boundary-edge` (state preserved).

**PASS** items 3–5.

## STEP 3 — WDLL 7–10 (map + degraded)

| Item | Live observation |
|---|---|
| 7 Map | Site Analysis: **Satellite / aerial**, FEMA, contours, hillshade, hydrology, parcel boundary, zoning, rent heat, Fixture layers + MapTools. Shared PE layered chrome — not CARTO/OSM-only fork. |
| 8 Parcel Trace | Badge **LIVE**. Resolve 1101 Colorado → placeKey + honest-0 atoms. Probe `/api/spine/retrieval/health` **200**. |
| 9 Revenue Meter | Badge **DEGRADED**. Panel: `platform_internal_required` / GET metering **403**. Named fix path. Never lying LIVE. |
| Soft F1c kill-test | Metering 403 ↔ DEGRADED badge; health 200 ↔ Parcel Trace LIVE. Could not take backend down in this session; correlation holds. |
| 10 Negative | No JSON-blob primary; edges traverse; back-nav keeps state; one map chrome; no survey-grade line-tags; badges mechanical. |

**PASS** 7–10.

## STEP 4 — Three gold parcels (not one)

| Parcel | Structured card | Front edge walk |
|---|---|---|
| `48021:28286` | YES — 4 edges | boundary:2 → road `123456789` + nbr 35671 |
| `48021:33512` | YES — 6 edges (+ alley rear 5ft; terrain atom) | boundary:4 front ROW 15′ → road `123456789` + nbr 33617 |
| `48021:34785` | YES — 4 edges (+ terrain atom) | boundary:3 front ROW 15′ → road `15106232` + nbr 34777 |

Item **6** already MET (retrieval `00033-wom`). Reconfirmed walkable UI over live HTTP.

## Per-item grades (LIVE console only)

| # | Grade | Evidence |
|---|---|---|
| 1 | **MET** | Structured cards on all three golds + road + boundary-edge |
| 2 | **MET** | Amendment 1 full traverse on 28286; front walks on 33512/34785 |
| 3 | **MET** | Family pills → NodeAtoms |
| 4 | **MET** | Property-rich inspector; confidence n+width+basis; "not a survey" |
| 5 | **MET** | `return=node-graph` back restores node+atoms |
| 6 | **MET** | (prior) HTTP edges live |
| 7 | **MET** | Shared PE layered map on Site Analysis |
| 8 | **MET** | Parcel Trace LIVE + honest resolve |
| 9 | **MET** | Honest-DEGRADED (403 named) |
| 10 | **MET** | Negative done-line clear |

PARTIAL: **none**. Dropped: **none**.

## STEP 5 — M0 promotion (planner-gated)

**Verdict: port, not re-derive.** Source cites trading Control Tower
(`NodeGraph.tsx` / `AtomInspector.tsx` header comments; smoke test names
Control-Tower NodeInspect). Shape matches NodeGraphBrowser + AtomInspector
(structured card, family groups, `return=` breadcrumb, confidence object).

Promotions:

1. **Mechanical guard (strongest):** keep
   `apps/command-center/src/admin/control/panels/NodeGraph.smoke.test.tsx`
   as the durable gate for clickable edges + family→atoms organism (already on
   map main). Do not invent a second UX.
2. **Prose / parity:** thesis ledger findings-log entry — RE now has a
   Control-Tower-parity node organism on Command Center; trading remains the
   reference shape for future ports.
3. Scratch LESSON marked **promoted** (see `_scratch/depth-engine-27c.md`).

M0-reach miss: **none** observed.

## CC-A done?

**YES** — items 1–5 + 7–10 pass on the live console; 6 already MET.
WDLL flipped to `closed`. Thin engine-control panel remains out of scope.
No further CC-A builders. CTX HELD.
