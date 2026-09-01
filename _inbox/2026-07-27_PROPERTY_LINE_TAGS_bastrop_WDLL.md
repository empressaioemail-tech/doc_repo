---
id: 2026-07-27_PROPERTY_LINE_TAGS_bastrop_WDLL
title: WDLL — Computed property-line-tags on Bastrop boundary edges (GIS-approximate)
status: approved
date: 2026-07-27
operator_approval: 2026-07-27 (operator PROPERTY-LINE-TAGS dispatch)
related:
  - 27f_bastrop_through_v2_program
  - _inbox/2026-07-27_bastrop_composition_inventory.md
  - _inbox/2026-07-27_CC_A_legible_node_atom_flow_WDLL.md
  - _inbox/2026-07-27_TRACK_B_customer_ui_quality_WDLL.md
---

# WDLL: Computed property-line-tags — Bastrop

## Done looks like

Every Bastrop `property-boundary-edge` atom carries GIS-computed bearing + distance (plat-style N/S _ E/W DMS + feet) derived from the parcel-ring edge endpoints already stored on the boundary primitive. Provenance is load-bearing: labeled **"GIS-approximate — not a survey"** everywhere — never survey-grade. Tags surface in (a) CC boundary-edge inspector and (b) site-plan PDF with the same honesty line. Geometrically sane on gold parcels (28286 near-rect opposite sides ~parallel; distances match the ring). Depth write-path untouched. CTX HELD.

## Acceptance items

1. **Compute + attach.** For each Bastrop boundary-edge, compute bearing (DMS, N/S _°_' E/W) + distance (feet) from ring vertices / `interior.edgeEndpoints`; attach as `propertyLineTags` (or equivalent) on the boundary-edge atom with provenance `gis-approximate` / honesty string. | check: live atom body on a gold edge | grade: [ ]

2. **Anti-fabrication.** Tags are NEVER presented as survey-grade. Mechanical guard: honesty constant present; test goes RED if "survey" claim appears without GIS-approx negation. Survey-grade = courthouse/plat = v2 OUT OF SCOPE. | check: vitest + live CC/PDF copy | grade: [ ]

3. **Geometry sanity (gold).** On `48021:28286` (near-rect), opposite sides ~parallel (bearings differ by ~180° / reciprocal), distances match ring edge lengths (±tolerance). Spot-check `33512` and `34785` sane. Paste computed tags for **one** parcel in planner check-in. | check: planner paste + parallel/length asserts | grade: [ ]

4. **CC surface.** Boundary-edge inspector shows tags + "not a survey (GIS-approx)" pill (CC-A already has the slot). | check: live CC walk on one gold boundary-edge | grade: [ ]

5. **PDF surface.** Site-plan PDF tags consistent with atom tags (same compute or same numbers) and honesty line present (Track B already has honesty — confirm consistency, do not invent a second formula). | check: PDF text / fixture test shares honesty + bearing format | grade: [ ]

6. **Bounded / depth untouched.** No depth-warm promote batch; no CTX fan-out; no survey/plat ingest. | check: no depth ratio change claimed; CTX HELD | grade: [ ]

## Negative done-line

NOT done if: a computed tag is shown anywhere as survey-grade; tags do not match the ring geometry; depth substrate is rewritten for this; CTX opened; survey-grade claims ship from courthouse/plat extraction (v2).

## Finish card (graded at close — 2026-07-27 planner)

1. met: 26454/26454 Bastrop edges tagged; live atom body on 28286
2. met: honesty on all; kind=gis-approximate; vitest anti-survey-grade
3. met: 28286 reciprocal ~60×137; 33512/34785 spot — check-in paste
4. met: CC inspector slot + live field (no map PR)
5. met: shared `gis-property-line-tags` module with PDF
6. met: no depth-warm; CTX HELD; PR #150 merged `933d884`

## Amendments

(none)
