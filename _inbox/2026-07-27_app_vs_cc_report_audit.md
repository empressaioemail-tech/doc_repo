---
id: 2026-07-27_app_vs_cc_report_audit
title: Report audit — what the customer app (PE) offers vs what CC/the spine can pull, and the gap
date: 2026-07-27
status: recon (queues a QA "report/deliverable" upgrade — bigger than a QA fix, needs an approach decision)
owner: nick
related: [2026-07-16_command_center_function_matrix_bizdev_handoff, 48_cortex_reporting_plan_review_spec, 27f_bastrop_through_v2_program, 2026-07-27_bastrop_composition_inventory]
purpose: The operator wants app-offered-reports vs CC-available-functions side by side, to queue a report/deliverable upgrade as a QA item. The bizdev matrix (2026-07-16) is the aspirational sandbox ("assume complete"); THIS is the honest current gap between the two surfaces.
---

# Report audit — app (PE) vs CC / spine

Two different things:
- The BIZDEV MATRIX (`2026-07-16_command_center_function_matrix_bizdev_handoff`) = the aspirational sandbox of ~30 functions across 6 categories, written "assume the full sandbox is complete." Sell-sheet inventory, not current truth.
- THIS AUDIT = what the CUSTOMER APP (property-explorer) actually EXPORTS/OFFERS today vs what the spine/CC can PULL — the honest gap the operator wants to close.

## A. What the CUSTOMER APP (PE) offers today

From the live PE inspect panel (verified this program): a parcel gives the customer a small set of EXPORTS + the inspect card. Concretely:
- Site-plan export (PDF) — the buildable-envelope sheet (parcel, envelope, setbacks, now road + property-line-tags). LIVE but with heavy design debt (QA).
- Terrain export (GLB mesh) — the 3D terrain model.
- (IFC export exists in the pipeline — the terrain-under-model export the operator flagged.)
- The inspect card: zoning, setbacks, buildable area, flood, land-use (honest-absence where thin), "view as" persona toggle (Homeowner/Investor/Architect).
- "Research this" / "Make subject" / "Save property" actions.

So PE today = ~2-3 real EXPORTS (site-plan PDF, terrain GLB, IFC) + an inspect card. That is the customer's actual report surface.

## B. What the SPINE / CC can pull (the function inventory, by real status)

From the bizdev matrix, re-graded to HONEST current status (Live = actually serving; Building = partial; Planned = not built):

| Category | Function | Bizdev status | Honest current | In the customer APP? |
|---|---|---|---|---|
| A Regulatory | Plan review run | Live | Live (cortex) | NOT in PE (it's the Codex/plan-review surface) |
| A | Finding calibration overlay | Live | Live | no |
| A | ICC Code Connect | Building | gated (ICC contract; operator creds) | no |
| A | Permit approval precedent | Planned | not built | no |
| B Site/Env | Site topography | Live | **coarse (3DEP ~10m; NOT the 1-ft/LiDAR)** | terrain export only |
| B | Site drainage | Live | derived D8 flow | on map (hydrology layer) |
| B | Hydrology / watershed | Building | partial | partial on map |
| B | Stormwater / grading / solar | Planned | not built | no |
| C Property Intel | Property brief | Live | Live (the flagship, separate brief surface) | NOT in PE inspect (separate app) |
| C | Hazard profile | Live | Live | flood in PE; full hazard no |
| C | Place dossier | Live | Live | no |
| C | Encumbrance report | Live | Live (encumbrance atoms) | no |
| C | Comparative jurisdiction | Planned | not built | no |
| D Design Accel | Attached doc parsing / product spec / detail callouts / response tasks | Live | Live (cortex/design) | no (architect surface) |
| D | IFC ingest | Live | Live | IFC export in PE pipeline |
| E Deliverable | Deliverable letter (+ gate/render/send) | Live | Live | NOT in PE (plan-review deliverable) |
| F Market/Investor | AVM / rent / comps | Building | partial | no (investor persona stub) |
| F | Pro forma / deal score / seller heat / rehab | Planned | not built | no |

## C. THE GAP (the finding)

1. The customer APP (PE) exposes a TINY FRACTION of what the spine can pull. PE = ~3 exports + inspect card. The spine has ~15+ Live/Building functions (briefs, hazard, encumbrance, dossier, plan-review, deliverable letters, drainage, design-accel) that are NOT surfaced in the customer app — they live on OTHER surfaces (the Brief app, Codex/plan-review, AEC-cortex, CC).
2. Reports are SCATTERED ACROSS SURFACES, not unified. The property brief is its own app; plan-review/deliverable-letter is Codex; PE has site-plan+terrain+IFC. There is no single "here are all the reports for this parcel" in the customer app.
3. The map is the intended connective surface (bizdev matrix: "any function that produces something spatial shows up on the map") — but PE's map currently draws parcel/zoning/flood/contour/road, NOT the full function output set (no drainage-flow-as-overlay done well, no utility corridors, no encumbrance, etc.).
4. Status honesty: several "Live" functions in the bizdev matrix are coarse or partial in reality (topography is 3DEP not LiDAR; hydrology partial; AVM/comps building). The sell-sheet assumes the sandbox complete; it isn't.

## D. Why this is BIGGER than a QA fix (the approach decision the operator flagged)

This is not "polish the site-plan PDF." It is a REPORT/DELIVERABLE PRODUCT decision:
- WHICH reports should the customer app (PE) actually offer? (Today: 3. The spine can back many more.)
- Should PE become the UNIFIED report surface (pull brief + hazard + encumbrance + plan-review + site-plan + terrain into one parcel's "reports" set), or stay the buildable-answer wedge with reports on separate surfaces?
- The reports each need DESIGN (the site-plan design debt is one instance; every report needs the same professional bar).
- Some "reports" are actually coarse-data (topo) — surfacing them well requires the v2 ingest (contours/LiDAR), tying back to the public-data completeness recon.

So the report upgrade spans: (a) product decision (which reports, which surface, unified or not), (b) design (every report to a professional bar), (c) data (some reports need the deferred v2 ingest to be worth offering). That is a program, not a QA ticket.

## E. Recommendation (for the approach decision)

Queue this as its own workstream, NOT folded into QA polish. Sequence:
1. PRODUCT DECISION (operator): the target report SET for the customer app + whether PE is the unified report surface. This defines the benchmark.
2. Then per report: is the DATA there (or does it need v2 ingest) + does it need DESIGN. Rank fixable-now vs needs-v2.
3. The map-as-connective-surface: which function outputs render as map overlays (ties to the road-styling + topo + public-data-ingest work).

The public-data completeness recon (`2026-07-27_bastrop_public_data_completeness_recon`) and the topo ingest are INPUTS to this — several reports get better/possible only once that data lands. Decide the report target set FIRST so the ingest is prioritized by which reports it unlocks.

## Reference

Bizdev sandbox matrix (aspirational, full inventory): `_inbox/2026-07-16_command_center_function_matrix_bizdev_handoff.md`.
