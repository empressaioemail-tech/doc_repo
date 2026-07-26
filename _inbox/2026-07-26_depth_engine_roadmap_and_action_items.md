---
id: 2026-07-26_depth_engine_roadmap_and_action_items
title: Roadmap + action items — depth engine, the three tracks, and the fresh-session carve-up
date: 2026-07-26
status: active
owner: nick
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27c_road_node_engine_and_warm_digital_twin_spec, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks, 2026-07-26_bastrop_depth_reconciliation_finding, 2026-07-25_depth_engine_planning_agent_handoff]
---

# Roadmap + action items

Distilled 2026-07-26 from the depth-engine session. The near-term work is unchanged by the bigger vision — it is validated by it (see the connecting-tissue decision record). This is the action map for what runs now, what is gated, and how the fresh sessions carve up.

## IN FLIGHT NOW (current planning agent — single owner, no fan-out)

The three Bastrop fixes from the recon (`2026-07-26_bastrop_depth_reconciliation_finding.md`), dispatched, running:
1. Site-plan offset parity — the localized R0 leak: site-plan/ring-geometry.ts computeSetbackOffset is still the old naive miter while depth-warm/geometry.ts insetPerEdge got the R0 fix. Same parcel (1009 Chestnut 48021:34785), two paths, divergent results (depth-warm 13641 sqft vs site-plan degenerate). Make both share ONE offset. Also fixes the map-card-vs-PDF vocabulary drift.
2. Recover the non-ceiling residual — recon reclassified 1312 as 110 no-road / 807 geometry-empty / 395 would-promote-now. Re-run place-type promote after Fix 1; classify what geometry-empty REMAINS (honest-irregular ceiling vs more R0 leak). This determines the TRUE Bastrop ceiling.
3. CC live-auth + honest labeling — the 9.27% was a stale artifact (unauthenticated 401 -> fallback). Auth the CC tally fetch; surface depth_warm_promoted-v1 as its own honest column distinct from zoning breadth and any-envelope count.

GATE: Central-TX greenlight stays HELD until these land and the true ceiling is known. Do NOT open county fan-out yet.

## GATED — opens when the three fixes clarify the ceiling (fresh sessions, fresh agents)

Operator decision 2026-07-26: treat the next moves as THREE fresh sessions with fresh agents, launched once the fixes clarify what we are pressing on. Single owner per shared substrate; parallelize on the axes that do not collide.

STREAM A — CTX county fan-out (the full-court press). One owner of the shared write-path fans out EXECUTORS per county (county = the parallel unit). Requires: the three fixes landed, the residual understood (portable engine work confirmed), and M0 hardened on its cc-agent-reach weakness FIRST (so fan-out lessons do not drift). Then national is the same fan-out, more descriptors, gated on the non-TX golden-descriptor test.

STREAM B — Customer-UI quality (independent, can start as soon as launched; does not touch the depth write-path). Includes:
- RENDER ROAD CENTERLINE + EDGES on the site plan and map — HIGH priority, NOT polish. The road nodes already exist in the ledger (4894 Bastrop); the site plan currently draws an empty STREET box and honestly declines ("no road-anchor atom"). This is a missing deliverable element AND a moat feature (we have the road as data, competitors have pixels). Draw centerline accurately now (we have it), edges as honest-approximate-ROW now (provenance-marked), tighten in the fidelity v2 pass. Do not block render on precision.
- Site-plan DESIGN pass — the current PDF is honest but crude (contour spaghetti over the parcel, colliding dimension labels, no site-plan craft). Make it a deliverable worth paying for.
- Map/PDF vocabulary reconciliation — the same parcel said "buildable % pending" on the map card and "setback-consumes-lot" on the PDF (Fix 1 addresses the root; verify the surfaces speak one truth).

STREAM C — Command Center controls pass (independent; console front-end reading the ledger). Includes:
- Wire the ENGINE panels (Resolver, Autonomous Engines — currently STUB) to show the road-node/rule/depth engines, their live run state and health. The engines RAN (2345 warm parcels) but have no live operator surface yet. This is the gap between "the engine works" and "the operator can see it work."
- SWAP THE CC MAP — the console still shows the old map; PE has the newer layered map (contours, FEMA, hillshade, hydrology, zoning). Completing this finishes the "one shared map" guarantee F1 claimed but did not fully deliver for the CC surface.
- The operator's admin-panel design thoughts (to be drawn out) belong here.

## THE TWO STRATEGIC TRACKS (later; scoped in the connecting-tissue decision record)

FIDELITY / PRECISION track (the survey-grade axis, orthogonal to breadth/depth). Per-domain fidelity engines behind breadth/depth, upgrading the same atom on the same node up the confidence ladder. Version ladders defined (road edges v1->v3, terrain v1->v3, parcel boundary v1->v3). Sourcing: un-ingested public high-fidelity data -> ML-refined precision -> recorded-survey document parsing (the build-to goal: a better base than a surveyor starts from) -> net-new capture only via marketplace write-back, never our own drones.

MARKETPLACE track (SDK/MCP/export + the write-back contract). Consumption surfaces partly planned (IFC-with-frontage-and-topo export is the first piece). The write-back contract is the net-new linchpin: anchored twins contribute higher-fidelity atoms back on existing nodes under sovereignty controls, incentivized by the payment substrate. The marketplace IS the sourcing strategy for the fidelity track — one flywheel.

## FLAGGED, NOT URGENT

- Aerial calibration — no engineered fix queued; it is gated on road-edge v2 precision (WDLL 9 landed PARTIAL: ~15m OSM-to-front). Operator: not needed today, no rush. Needs its own diagnostic-then-fix when it matters; the road-node build did NOT deliver it for free.
- Datum/projection alignment — a separate, possibly-smaller calibration lever (site plan notes "Z=NAVD88 not ellipsoidal; calibration pending"). Distinct from the road-skeleton route.
- IPFS content-layer migration (GCS -> IPFS under the atom CID) — on-vision, independent later migration; the on-chain bridge. Not a today-decision.
- The bigger AI-memory-substrate thread (placeholder 2026-07-23) and the digital-twin infra layer — both "author new atom kinds on proven substrate," both after the property depth engine proves out.

## OWED BOOKKEEPING

- 00_current_state.md still carries the export-gate agent's uncommitted edits (their close is "say go" pending) — not the planner's to sweep. Prepend the depth-engine roadmap entry once that lands.
- Master + 27c frontmatter approval flip: DONE this session (committed 2db88dc / this pass).
- M0 cc-agent-reach hardening — the biggest known M0 weakness; do before STREAM A fan-out.
