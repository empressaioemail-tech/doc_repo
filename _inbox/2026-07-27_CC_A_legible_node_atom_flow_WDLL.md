---
id: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
title: WDLL — CC-A Command Center legible node/atom flow (Control-Tower parity)
status: closed
date: 2026-07-27
applies_to: hauska-map/apps/command-center, hauska-engine/services/retrieval-api
implements: [27a_jurisdiction_factory_engine_spec, 27e_multitrack_program_structure_and_wave_plan]
owner: nick
related: [2026-07-27_CC_A_phase0_live_reaudit_and_build_spec, 2026-07-25_f1a_console_audit, 2026-07-27_CC_A_post_deploy_planner_live_verify]
---

# WDLL: CC-A — Legible node/atom flow (Control-Tower parity)

Date: 2026-07-27  Status: **closed** (planner live-graded 2026-07-27)  
Operator approval: 2026-07-27 (with Amendments 1–2)
Close evidence: `_inbox/2026-07-27_CC_A_post_deploy_planner_live_verify.md`

Reference organism (PORT, do not invent): trading Control Tower
`P:\Empressa Trading\apps\cockpit\admin\src\control\panels\NodeGraphBrowser.tsx` +
`AtomInspector.tsx` (live URL Clerk-gated; shape is source-of-truth).

F1 closed the ledger (tally + present/absent + binding). CC-A makes the graph
**legible and traversable** so road + boundary-edge nodes are inspectable as
they land. The load-bearing unlock: boundary edges are persisted in StoragePort
but stranded (no HTTP; atom-chain carries zero edge refs) — serve the graph,
then make it legible. Thin engine-control panel is OUT OF SCOPE (comes after).
CTX HELD.

## Done looks like

An operator opens Command Center, inspects a gold Bastrop parcel, and sees a
structured node card (not a JSON blob): type, resolution, identifiers, edges
OUT/IN (boundary-edge nodes, road frontage, neighbor parcels). Clicking an edge
opens that node. Atoms are grouped by family and open a rich inspector
(confidence object never bare; provenance; bitemporal; lineage; accessPolicy ∩
license). Back-nav via `return=…&node=…` restores place. Road and
property-boundary-edge nodes work the same way. Parcel Trace and Revenue Meter
are live or honestly degraded for a named reason. CC map is the shared PE
layered map (one component, both surfaces). Badges stay mechanically computed.

## Acceptance items

1. **Node card (all types).** Parcel / road / property-boundary-edge each render
   a structured card: node_id, type, resolution status, identifiers, merge/
   supersede when present. | check: live CC inspect `48021:33512` (parcel), a
   live `48021:road:…`, and one boundary-edge id from that parcel; no raw JSON
   as the primary view. | grade: [x] MET
2. **Edges OUT/IN + traversal (WALKABLE).** Parcel card lists clickable edges to
   its boundary-edge nodes, road frontage, and neighbor-parcel adjacencies.
   Click edge → that node's card. **U1 is NOT MET by endpoint-200 alone** — the
   graph must be walkable in the live UI. | check: planner live walk on
   `48021:28286`: parcel → boundary-edge (role/adjacency/setback visible) →
   road it fronts → neighbor parcel. Traversal, not status codes. | grade: [x] MET
3. **Atoms by family.** Node inspect shows atoms grouped by family/kind, each
   clickable. | check: gold parcel shows zoning-fact / setback-rule /
   buildable-envelope / property-boundary-edge (and road attach) as separate
   family groups — not one undifferentiated blob. | grade: [x] MET
4. **Atom inspector (property-rich).** Per-atom view ports Control Tower shape:
   claim; confidence `{n,width,basis}` never bare; provenance/citation;
   bitemporal (valid_from/to, knowledge_time, captured_at); lineage/
   supersession; time-travel LIVE/AS-OF when supported; accessPolicy ∩ license.
   Boundary-edge atoms also show role, adjacency (ROW/neighbor/alley/unmapped),
   setback, interior. Property-line-tags when present are GIS-approx labeled
   **"not a survey"** (never survey-grade). | check: open one boundary-edge atom
   from `48021:28286`; screenshot-equivalent description pasted by planner. |
   grade: [x] MET
5. **Back-navigation with state.** `return=…&node=…` (and return_* filters)
   breadcrumb; leaving atom inspector restores the node card with prior state. |
   check: node → atom → back; hash + UI place preserved. | grade: [x] MET
6. **Read path for edges exists.** Retrieval (or BFF) exposes node-detail /
   boundary-edges for parcel/road/boundary — StoragePort
   `listBoundaryEdgesByParcelNodeId` is reachable over HTTP. Atom-chain alone
   is insufficient. Necessary but **not sufficient** for U1 (see item 2 /
   Amendment 1). | check: live GET returns edges for `48021:28286`; 404s on
   `/boundary-edges` and `/edges` are gone. | grade: [x] MET
7. **Map swap.** CC workspace map is the shared PE layered map shell (same
   `@hauska/map-renderer` composition / LAYER_REGISTRY path PE uses), not the
   CARTO/OSM-only LiveMapTile fork. | check: CC Site Analysis attribution /
   layers match PE layered map; grep proves one shared map module, not two
   divergent shells. | grade: [x] MET
8. **Parcel Trace live-or-honest.** Badge matches reality; probe path fixed
   (today: healthz 404 via BFF while `/health` 200 and geocode works). Do not
   make a badge lie LIVE. | check: badge LIVE when resolve works, or DEGRADED
   with named reason that matches the failing probe. | grade: [x] MET
9. **Revenue Meter live-or-honest.** Metering 403 resolved (key wired) OR panel
   shows honest "requires platform_internal key" and badge DEGRADED for that
   reason — never a silent empty; never a lying LIVE. | check: open panel; live
   numbers OR explicit honest block. | grade: [x] MET (honest-DEGRADED)
10. **Negative done-line holds.** No node type that cannot be inspected; no
    raw-JSON-blob where an inspector belongs; badges not hand-set constants;
    not two map components (fork). | check: planner adversarial live walk +
    source grep. | grade: [x] MET

## Dependencies (execution order)

- Items 6 → 1 → 2 (U1 walkable organism). Then 3 → 4 → 5 (U2).
- Items 7, 8, 9 parallel (U3).
- Computed property-line-tags: OPTIONAL in U1 — must not block core organism
  (Amendment 2). Survey-grade plats OUT OF SCOPE.

## Amendments

- **2026-07-27 Amendment 1:** U1 done-line is the live walkable graph on
  `48021:28286` (parcel↔boundary-edge↔road↔neighbor through CC), not
  endpoint-200. Item 2 check rewritten; item 6 marked necessary-not-sufficient.
- **2026-07-27 Amendment 2:** Computed property-line-tags stay OPTIONAL in U1;
  if landed, provenance-marked GIS-approximate ("not a survey") only. Must not
  block the node organism. Survey-grade out of scope (v2/records-extraction).

## Finish card (graded at close)

Graded 2026-07-27 post-Vercel live walk
(`_inbox/2026-07-27_CC_A_post_vercel_live_verify.md`). Evidence: production
`cmdcenter-blush` bundle `index-BTKuoNXu.js` @ map main `91c6268`; retrieval
`00033-wom` @ 100%.

| # | Grade | Evidence (one line) |
|---|---|---|
| 1 | MET | Live cards for `48021:28286`, `…:boundary:2`, `48021:road:123456789`, nbr `48021:35671` — structured, not JSON-primary. |
| 2 | MET | Amendment 1 walk: parcel → boundary:2 (front/ROW/15′) → road + neighbor 35671 via clickable edges. |
| 3 | MET | Family pills (boundary-edge / envelope / setback / zoning / road-node) open NodeAtoms lists. |
| 4 | MET | Inspector on `did:hauska:property-boundary-edge:48021:28286:boundary:2`: confidence `{n,width,basis}`, provenance, bitemporal, role/adj/setback/interior; "not a survey" on card. |
| 5 | MET | Hash `return=node-graph&node=…`; `← back to node` restores node-graph place. |
| 6 | MET | Live HTTP nodes + boundary-edges for 28286 (e1→32341; e2→road+35671). |
| 7 | MET | Site Analysis MapLibre + Fixture layers shared chrome (not CARTO-only fork). |
| 8 | MET | Parcel Trace badge LIVE; resolve → placeKey + honest-0. |
| 9 | MET | Honest-DEGRADED: panel names `platform_internal_required` / 403; badge DEGRADED. |
| 10 | MET | Adversarial walk: inspectable types; mechanical badges; one map chrome path. |

Dropped: none. Partial: none. Optional Amendment 2 property-line-tags: not
shipped (correct). Thin engine-control panel: still out of scope.

Status flip to `closed` is operator call; grades above are the Start-vs-Finish
record.
