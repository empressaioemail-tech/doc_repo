---
id: 2026-08-23_p60-map-layers_WDLL
title: WDLL — P-60 SmartSite map layers CP2
date: 2026-08-23
status: approved
plan_row: P-60
parent: _inbox/2026-08-22_atom_full_surface_WDLL.md items 8-9
---

# WDLL: P-60 map layers CP2

## Done looks like

Top-3 CP1 flips ship atom-backed map layers on gold without GIS bake masquerading as atoms. Paired falsifiers pass on 48021:34137.

## Acceptance items

1. **building-footprint** — registry row + near-bbox retrieval (engine) + PE overlay; `live:true` when fetch works. | check: gold map probe + inspect-footprint paired | grade: [ ]
2. **buildable-envelope** — registry `live:true`; wedge gated on atom presence + LAYERS toggle; no POST fallback when atom absent. | check: ExplorerMap + registry | grade: [ ]
3. **special-district-fact** (`mud-pid` key) — atom near-bbox or parcel-scoped fetch; `districtType` filter; not mud-pid GIS bake. | check: gold-mud 48021:102817 | grade: [ ]
4. Item 9 falsifier suite — map silent when inspect atom-miss for same family on same parcel. | check: test or live probe doc in close | grade: [ ]
5. PE deploy smartsite.cloud; planner-owned. | check: deploy id in close | grade: [ ]

## Out of scope

flood-zone GIS retire, texas-rrc split, rail-corridor (P-52 HOLD)
