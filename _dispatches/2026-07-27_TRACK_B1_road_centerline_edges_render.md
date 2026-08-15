---
id: 2026-07-27_TRACK_B1_road_centerline_edges_render
title: Dispatch — Track B1 road centerline + edges render (site plan + map)
status: active
date: 2026-07-27
applies_to: [hauska-engine, hauska-map]
planner: Track B customer-UI planner
cites:
  - 2026-07-27_TRACK_B_customer_ui_quality_WDLL items 1, 2, 6
related: [75o_site_plan_export_spec, 27c_road_node_engine_and_warm_digital_twin_spec, _scratch/customer-ui-track-b]
---

# B1 — Render road centerline + edges (site plan + map)

## Role

You are BUILDER-B1. Build code only. Do not merge. Do not claim live customer QA — planner verifies. Return scratch block in close.

## FLEET MEMORY (M0)

As you work, capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in your close. Read the scratch block below FIRST. Do NOT promote to durable memory yourself — planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close.

## Scratch (start warm)

```
LESSON: site-plan STREET was honestAbsence because composer sought a missing road-anchor atom — road-nodes NOW exist; consume them.
LESSON (R1): v1 ROW = centerline + assumed-per-class width; provenance approximate-assumed-per-class MUST appear on drawn edges.
LESSON (F1a): backend-healthy ≠ app-correct; still ship working PE map path + site-plan model.
DEAD-END: esbuild conditions beyond ["workspace"] in ldt boot-crash.
DEAD-END: fabricate STREET when no road-node attaches.
GROUND-TRUTH (2026-07-27): Bastrop road_nodes live (~17k); depth_warm ~99.59% place-type; RENDER missing.
OPEN: gold 48021:34785 + 48021:33512; forbidden 48021:27303.
```

## Problem

Road nodes exist in the ledger (centerline + classification + ROW). Site plan draws an EMPTY STREET box; map does not show the road as a real object. Competitors have pixels; we have the road as data — this is a missing deliverable element + moat feature, not polish.

## Required (WDLL 1 + 2)

1. **Site-plan (hauska-engine):** `composeSitePlanModel` (or successor) loads attaching road-node(s) for the parcel frontage. STREET layer draws:
   - centerline from road-node geometry (accurate)
   - edges from ROW assumed width (v1), provenance-marked `approximate-assumed-per-class` (or live field if present)
   - street name label when available
   - honest absence ONLY when no road-node attaches (reason string, no empty decorative box pretending data)
2. **Map (hauska-map / property-explorer):** draw the same road object (centerline + edges) from road-node data when a gold parcel is selected / in view. Reuse shared geometry helper if cheap; do NOT invent a second road model.
3. **Mechanical tests:** at least one fixture where STREET is non-empty given a road-node input; one honest-absence when none; provenance field asserted on edges.
4. PRs on engine (+ map if needed). CI green. Do not merge until planner go.

## Out of scope

True survey ROW; depth promote; CC; site-plan design polish (B2); vocab copy (B3); Central-TX.

## Done when

PR(s) open, CI green, close returns: SHAs, test names, sample artifact paths or regenerate commands for `48021:34785` / `48021:33512`, scratch block. Planner live-verifies gold site plan + PE map DRAW the fronting road.
