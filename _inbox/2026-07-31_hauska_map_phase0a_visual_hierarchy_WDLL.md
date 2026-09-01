---
id: 2026-07-31_hauska_map_phase0a_visual_hierarchy_WDLL
title: WDLL — Hauska Map Phase 0A visual hierarchy
status: approved
date: 2026-07-31
applies_to: hauska-map
related: [40_hauska_map_3d_implementation_brief, 30_block_cert_harness_spec]
owner: planner
---

# WDLL: Hauska Map Phase 0A — visual hierarchy

Date: 2026-07-31  Status: graded
Operator approval: 2026-07-31 (C6 planner handoff — Execute Phase 0A)

## Done looks like

On production PE (and CC if defaults changed), the Bastrop cold-open map reads as figure/ground: basemap recessive, parcel boundaries as line-only, no land-use wash, no FEMA/hydro stacking by default. Amber is reserved for the buildable envelope / subject parcel and nothing else. Cyan is reserved for transient interaction. Flood study paint is off the amber family. Named presets (Flood / Entitlement / Terrain) each make their answer-layer dominant. The taxonomy constant in `packages/map-renderer/src/map/` is the single paint authority every layer reads.

## Acceptance items

1. **T-H01 taxonomy constant** — one exported module assigns every map layer to exactly one role (GROUND / CONTEXT / DATA / SUBJECT / INTERACTION) with palette, opacity budget, and permitted/forbidden channels; every layer definition consumes it (no colliding inline role hues). | check: module exists + grep shows consumers; unit test asserts no two DATA layers can be simultaneously visible | grade: [ ]
2. **T-H02 paint rebalance** — basemap substantially down + desaturated; parcel line not cyan; flood study off amber; land-use choropleth DATA (off-by-default, dimmed when Context on); FEMA Context as dominant boundary + hatch/minimal fill. | check: no hue shared across roles; Context fill ≤ budget; DEPLOYED Bastrop default screenshot shows figure/ground | grade: [ ]
3. **T-H03 progressive disclosure** — cold-open ≤3 layers (basemap + parcel line-only + at most one more if unavoidable); presets Flood / Entitlement / Terrain each turn on 2–3 coherent layers and dim the rest; PE + CC both apply. | check: live Bastrop cold-open ≤3; one screenshot per preset with answer-layer dominant | grade: [ ]
4. **Ship gate** — CI green on head SHA; PE (and CC if touched) deployed via Vercel CLI with NEW deployment timestamp; live-app screenshots are the customer-done gate (code-done ≠ customer-done). | check: headRefOid match + deploy timestamp + screenshots filed | grade: [ ]

## Scope

IN: T-H01, T-H02, T-H03 in hauska-map only.
OUT: Phase 0B, Phase 1 extrusion, pitch>0, terrain deps, three.js/deck.gl/Cesium, MapLibre 6.x, PE #118, engine changes.

## Standing decisions (travel with every sub-dispatch)

Deploys/commits are PLANNER-OWNED; executors build+verify, never deploy.
CODE-DONE ≠ CUSTOMER-DONE: verify on the deployed app (screenshot the real Bastrop view), not on a merged PR or a self-report.
MERGE ONLY ON GREEN CI (local pass ≠ PR checks; verify CI on the ACTUAL head SHA, not a stale run — compare headRefOid).
hauska-map does NOT auto-deploy on merge — Vercel CLI deploy per app, verify a NEW deployment timestamp + bundle marker.
Verify PATHS against current main first (brief line-refs are stale); the shared clone may carry other agents' dirty files — stage EXPLICIT paths only, never git add -A.
No new heavy dependency without an ADR. MapLibre 5.24 is sufficient.

## Amendments

(none yet)

## Finish card (graded at close)

1. met: `layer-role-taxonomy.js` + `layer-role-taxonomy.test.js` on main; every paint consumer reads taxonomy; DATA mutex test green. Evidence: hauska-map #122.
2. met: basemap 0.48/-0.55; parcel line `#8a9aab`; flood study slate-teal (off amber); zoning DATA off-by-default at 0.22; FEMA fill ≤0.15. Live PE cold-open shows no choropleth. Evidence: #122+#124 + `_inbox/2026-07-31_phase0a_screenshots/phase0a-coldopen-layers.png`.
3. met: cold-open = parcel-polygon (+ pins chrome); Flood/Entitlement/Terrain presets on MapToolset (PE) + LayersControl (CC). Live checkboxes confirm ≤3 map layers cold-open; each preset checks 2–3 coherent rows. Evidence: #122+#123 + screenshots.
4. met: CI green on head SHAs; PE `dpl_2uJKAVjDT4w8U7r8Egitb3eWXKtS` (and prior #122/#123 deploys) + CC `dpl_jxh5onnQ5UsKJGy7uz5DoJhvyyeB`; screenshots filed. Residual polish (optional): light CARTO basemap still reads milky at 0.48 — dark basemap swap is not blocking.

## Amendments

- 2026-07-31: added #123 MapToolset presets because PE chrome is MapToolset, not LayersControl.
- 2026-07-31: added #124 live-parcels fill-opacity 0 because viewport live mesh still painted faint land-use fill.
