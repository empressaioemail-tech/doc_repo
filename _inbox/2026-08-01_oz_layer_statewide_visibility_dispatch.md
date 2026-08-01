---
id: 2026-08-01_oz_layer_statewide_visibility_dispatch
title: DISPATCH — Opportunity Zone layer must stay visible zoomed out (statewide/CTX pockets), not zoom-gated to 11+
date: 2026-08-01
status: dispatch (PE-map fix; isolated worktree; deploys planner-owned)
owner: nick
related: [2026-08-01_PE_qa_round3_and_mobile_dispatch]
purpose: Operator QA — the OZ layer only renders at zoom >= 11 (per-viewport fetch), so zoomed out to Texas/CTX you see nothing. OZ is a REGIONAL-PATTERN layer; its value is seeing the pockets across the whole state at a glance. Change from zoom-gated-close-in to statewide-visible.
---

# OZ layer — statewide visibility

## THE PROBLEM (grounded in source)
The OZ layer toggle is on + live, but nothing renders zoomed out. Cause (verified):
- `packages/map-renderer/src/live-gis.ts:64`: `MIN_OPPORTUNITY_ZONE_ZOOM = 11`.
- `apps/property-explorer/src/browse/ExplorerMap.tsx:464-465`: below zoom 11 → sets `zoom-gated`, returns NO data.
- `ExplorerMap.tsx:472`: fetches per-viewport `bbox` only (close-in model).
So at CTX/Texas zoom, the layer is empty. Operator wants the opposite: OZ pockets visible across all of Texas / Central TX at a glance — a see-the-whole-picture regional layer.

## SIZING (already checked — informs the design, not heavy)
CDFI OZ FeatureServer: 628 designated tracts in Texas (STATE=48); ~35 across the central-TX counties. 628 tract polygons is a MODEST payload; simplified polygons or centroids are tiny. So a statewide representation is cheap — no need for tiling.

## THE FIX
Make OZ a statewide-visible layer with level-of-detail:
- ZOOMED OUT (state/region, below ~zoom 11): show ALL Texas OZ tracts as the pockets — simplified fill polygons (or centroid/point markers if simpler) so the statewide pattern is visible at a glance. Fetch the full TX set ONCE and cache it (not per-viewport); 628 features loads fine in one shot. Drop the `zoom < 11 → no data` gate.
- ZOOMED IN (>= ~11): the full-detail tract geometry as today (the per-tract polygon with designation + source + vintage on click).
- Keep the existing provenance/citation (CDFI designation + TIGER/Line 2010 geometry + vintage) on every rendered tract at both levels.
- Scope to Texas for now (STATE=48) — the app's coverage area; do not pull all ~8,700 national tracts.

Implementation notes (agent decides the cleanest):
- Simplest correct approach: a one-time statewide OZ fetch (STATE=48) rendered as a simplified fill, always visible when the toggle is on, with the detailed per-viewport polygons layered on at high zoom (or just use the simplified statewide set at all zooms if detail is adequate — verify the tract shapes read cleanly zoomed in).
- If payload/perf needs it, use ArcGIS geometry simplification (`maxAllowableOffset`) at low zoom for lighter polygons. 628 tracts likely fine unsimplified — measure.
- Preserve the toggle binding, the layer-registry entry, and the honest "no OZ tracts here" state where a region genuinely has none.

## STANDING DECISIONS / DISCIPLINE
Isolated worktree off origin/main (hauska-map has many active worktrees — do NOT edit the shared clone tree; collision hazard). Stage explicit paths. Public data only (CDFI OZ list + Census TIGER/Line — no Cotality/Regrid/relationship path; works for any jurisdiction). Cited + dated on every tract. Build+tsc+tests green (update oz-overlay.test.ts + the zoom-gate assertion at oz-overlay.test.ts:121 which currently expects MIN=11 — that gate is being removed/changed). PR base main, CI green on HEAD SHA. Do NOT merge or deploy (planner-owned). Note if the statewide fetch needs a BFF change (pe-opportunity-zone / pe-map-layers) vs client-only. No timeframe estimates. This is the PE MAP frontend — does NOT touch the spine-ledger fleet's repos (ldt/mcp/smartcity), no collision.

## DELIVER
OZ tracts visible statewide/CTX zoomed out (pockets at a glance) + full detail zoomed in, cited/dated, toggle works. PR base main, CI green. Report client-only vs BFF-touch.
