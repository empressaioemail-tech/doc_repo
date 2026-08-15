---
id: 2026-07-31_PHASE0A_visual_hierarchy
title: Dispatch — Phase 0A visual hierarchy (T-H01 / T-H02 / T-H03)
status: closed
date: 2026-07-31
applies_to: hauska-map
wdll: _inbox/2026-07-31_hauska_map_phase0a_visual_hierarchy_WDLL.md
branch: feat/phase0a-visual-hierarchy (+ follow-ons)
prs: ["#122", "#123", "#124"]
deploys:
  pe: dpl_2uJKAVjDT4w8U7r8Egitb3eWXKtS
  cc: dpl_jxh5onnQ5UsKJGy7uz5DoJhvyyeB
---

# Phase 0A — visual hierarchy wave — CLOSED

Shipped + live-verified 2026-07-31. WDLL graded. Doc 40 Phase 0A marked DONE.

WDLL items: 1 (T-H01), 2 (T-H02), 3 (T-H03), 4 (ship gate).
Repo: hauska-map only. Fresh branch off `origin/main` @ `67db89d` (#121). Do NOT touch PE #118.

## Verified anchors (main tip — reconfirm before edit)

| Path | Role |
|------|------|
| `packages/map-renderer/src/map/gis-map-paint.js` | LAND_USE_COLORS + dark basemap raster-opacity 0.92 |
| `packages/map-renderer/src/map/hauska-map-style.js` | light basemap opacity 0.88 |
| `packages/map-renderer/src/map/parcel-tiles.js` | subject fill 0.92 wash-out |
| `packages/map-renderer/src/live-gis.ts` | FEMA fill 0.4 + parcel `#7dd3fc` |
| `apps/property-explorer/src/browse/{consumer-layers,envelope-overlay,flood-map-overlay}.ts` | PE wiring |
| `packages/map-renderer/src/chrome/{LayersControl.tsx,sharedMapDefaults.ts}` | control + defaults |
| `packages/map-renderer/src/layer-registry.js` | `DEFAULT_VISIBLE_LAYERS` (CC seed) |

## Taxonomy decisions (planner-locked)

| Role | Reserved hue | Notes |
|------|--------------|-------|
| GROUND | none (desat) | basemap opacity ~0.45–0.55, heavy desat |
| CONTEXT | one muted hue each | FEMA = muted blue boundary+hatch; flood study = **slate-teal** (NOT amber, NOT FEMA blue); roads/ROW muted grey |
| DATA | categorical | land-use / rent-heat — OFF by default; mutex |
| SUBJECT | amber `#f2a23c` family | envelope + inspected/subject parcel only |
| INTERACTION | cyan `#7dd3fc` | hover/search/glow only |

## Sequence

1. T-H01 — `layer-role-taxonomy.js` (+ `.d.ts` / exports) + DATA mutex test
2. T-H02 — rewire paints to consume taxonomy; fix four collisions
3. T-H03 — invert `DEFAULT_VISIBLE_LAYERS` + PE seed extras; add presets to LayersControl / shared defaults
4. Planner: CI → merge → Vercel deploy → live screenshots → grade WDLL + update doc 40

## Landmines

- No data-driven color on dashed layers
- No animated dashes
- Do not revert 3DEP contour MultiPolygon→lines
- No new serverless functions (Hobby 12-fn cap)
