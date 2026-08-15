---
id: 2026-07-25_site_plan_export_sprint
title: Dispatch — Site-plan export sprint (planner-led)
status: active
date: 2026-07-25
last_updated: 2026-07-25
applies_to: [hauska-engine, hauska-atom-contract, hauska-mcp-server, hauska-map]
owner: nick
related: [75o_site_plan_export_spec, 2026-07-25_site_plan_export_WDLL, 2026-07-25_site_plan_export_STATUS, 2026-07-23_terrain_ifc_spine_lift_WDLL]
---

# SITE-PLAN EXPORT SPRINT — build the data-rich cited site deliverable

Planner-led. Dispatch → adversarial review → merge on green CI only. Verification never delegated (live state, never a report). Same discipline as the terrain export this extends. Master WDLL invariants apply (I-A, I-B, I-C, I-F, I-I).

**Authoritative scope:** `P:\doc_repo\75o_site_plan_export_spec.md`  
**Acceptance card:** `P:\doc_repo\_inbox\2026-07-25_site_plan_export_WDLL.md` (cite item numbers on every PR)  
**Live tracker:** `P:\doc_repo\_inbox\2026-07-25_site_plan_export_STATUS.md`

## Prerequisite (met — re-verify in Wave 0)

Setback-rule + buildable-envelope atoms live at county scale. Named proof: SA `48029:105129` → R-6, setbacks 10/5/20 cited to `san_antonio_tx/udc/35-310.01`, envelope with input-atom refs (`_inbox/2026-07-24_post_breadth_three_gaps_MILESTONE.md`). PE facets 2026-07-25 confirm R-6 + SF residential at 1127 N PINE ST. **Hazard:** PE BFF `atom-chain HTTP 500` — Wave 0 proves chain via engine bearer or MCP `get_property_atom_chain`, then proceeds.

## Locked representative parcel

`48029:105129` (San Antonio R-6). **NOT** `48021:27303`. Backup: `48453:225513` (Austin SF-3) only if Wave 0 fails SA — amend WDLL if used.

## Build (from 75o; WDLL items in brackets)

### Wave 0 — live lock [WDLL 1]
1. Re-verify atom-chain for `48029:105129` live (engine or MCP). Paste verbatim JSON.
2. Confirm PE deep-link opens inspect: https://property-explorer-xi.vercel.app/?parcelNodeId=48029:105129
3. STOP to planner only if chain is missing setback F/S/R or code cite; otherwise proceed.

### Wave 1 — shared site model + layered CAD [WDLL 2,3,4]
Begin here after Wave 0 green. Spine home: hauska-engine (extend terrain-export emitters; additive, not a rewrite of triangulation).

Layered CAD site plan (DXF + IFC) — each feature class its own layer:
- PROPERTY_LINE — parcel ring + corners (node ring)
- DIMENSION — per-segment lengths
- SETBACK — offset lines + F/S/R labels from setback-rule atom
- CONTOUR — + NAVD88 elevation labels
- STREET — bordering streets named (road-anchor / Overpass)
- NORTH — arrow + scale

Terrain as SOLID MASS (not thin surface): skirt walls from terrain edges to flat bottom ~0.5 m (~1.5 ft; unit-explicit ft→m) below min-Z; capped; closed solid. Reuse existing triangulation + NAVD88. Replace-not-dual-offer.

File fresh samples under `_inbox/2026-07-25_site_plan_samples/` on the representative parcel.

### Wave 2 — PDF same source [WDLL 5,6]
PDF sheet renders the SAME model (CAD + PDF cannot diverge):
- Drawing (all layers above)
- Summary: parcel ID, address, county, zoning, lot area, F/S/R, buildable area (honest if provisional), flood zone, elevation range NAVD88
- Provenance/citation panel: every layer source + as-of + confidence
- Honesty line: "Derived from public GIS records. Not a boundary survey. Not for legal record."

### Wave 3 — pay + surfaces [WDLL 7,8]
- Paid: higher public-paid tier than raw terrain; meter through SDK (I-F); **one meter per export request** regardless of format count.
- Reuse terrain-export pay-gate if possible → no stop gate.
- **STOP to doc_repo planner** before flip if new public-paid SKU or metering shape changes.
- Surface on Property Explorer; paste live reachability URL into STATUS.

### Wave 4 — finish [WDLL 9]
Planner: adversarial review against WDLL items; Revit import (DXF + IFC); PDF review; merge green CI only; thesis_parity_ledger entry; finish check-in with samples.

## Do NOT build (75o later-roadmap)

3D buildable-envelope mass; surrounding-building context; multi-format beyond this program's DXF/IFC/PDF; living/re-queryable file; Revit-native family + in-plugin streaming; as-of-right study.

## Process rules

- Every PR cites WDLL acceptance item numbers.
- Adversarial review grades against cited WDLL items, not re-derived intent.
- Scope changes = WDLL amendment with one-line reason.
- Verify against live deployed state (I-I). Do not claim survey-grade.
- Planner merges; executors do not self-merge.

## Premortem (structural — cleared green)

| # | Commitment | Verdict |
|---|---|---|
| 1 | Sell reasoning, not data | GREEN — provenance panel + per-layer atom cites; honesty line mandatory |
| 2 | Confidence earned, not asserted | GREEN — asserted baseline with provenance/as-of on panel; no bare confidence as calibrated |
| 3 | Cost per jurisdiction | GREEN — no new jurisdiction onboard; emit over existing atoms |
| 4 | Dual interface | GREEN — MCP/spine first; PE UI is surface on paid atom |
| 5 | Hauska spine | GREEN — engine emitters + SDK meter |
| 6 | Focus queue | GREEN — extends live terrain-export product line; 75o committed |
| 7 | Quality gate | GREEN — source + confidence + timestamp on every layer |

Overall: **GREEN**. Proceed.
