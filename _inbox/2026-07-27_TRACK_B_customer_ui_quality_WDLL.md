---
id: 2026-07-27_TRACK_B_customer_ui_quality_WDLL
title: WDLL — Track B customer-UI quality (make Bastrop sellable)
status: approved
date: 2026-07-27
last_updated: 2026-07-27
applies_to: hauska-engine (site-plan emitters), hauska-map/apps/property-explorer, legacy-design-tools (PE BFF facets only if vocab lives there)
owner: nick
operator_approval: 2026-07-27 (operator greenlight — TRACK B CUSTOMER-UI QUALITY; planner-led)
sub_wdll_of: 27e_multitrack_program_structure_and_wave_plan
related: [75o_site_plan_export_spec, 27c_road_node_engine_and_warm_digital_twin_spec, 2026-07-27_program_status_done_vs_discussed, _scratch/customer-ui-track-b]
---

# WDLL: Track B — customer-UI quality (make Bastrop sellable)

Date: 2026-07-27  Status: approved (operator greenlight this session)

## Done looks like

A customer opening Property Explorer on a gold Bastrop parcel sees the fronting road drawn as a real object (centerline + ROW edges) on the map and on the site-plan PDF/CAD — not an empty STREET box. The site-plan PDF reads as a professional deliverable (clean layout, readable dimensions, parcel + envelope + road + setbacks legible; GIS-approximate property-line tags ok if honestly labeled). Map card, inspect panel, and PDF speak ONE truth about setbacks and buildable area. Depth engine / CC are out of scope; Central-TX fan-out stays HELD. Customer QA is "does a customer see it correctly through the live app" — F1a backend-healthy ≠ app-correct.

## Gold parcels (locked)

| Role | parcelNodeId | Notes |
|---|---|---|
| Primary gold | `48021:34785` | 1009 Chestnut; FIX1.1 ring parity ~13641; residential front |
| Corner / road attach | `48021:33512` | 714 Spring; depth-warm; Spring Street road node |
| Vocab trio | `48021:34785`, `48021:47728`, `48021:47595` | Chestnut / Chestnut / Pecan — depth-warm set |
| Forbidden demo | `48021:27303` | P-3 setbacks-consume-lot (do not use as sellable demo) |

## Acceptance items

1. **B1 — Road renders on site plan.** Site-plan model + PDF/DXF STREET layer draw the fronting road centerline from road-node geometry and ROW edges from assumed-per-class width (provenance `approximate-assumed-per-class` or successor). Empty STREET honest-absence only when no road-node attaches. | check: planner regenerates site plan for `48021:34785` (and spot `48021:33512`); STREET layer has centerline + edges + name; not empty box. Live PDF/DXF evidence pasted. | grade: [MET]
2. **B1 — Road renders on map.** PE map draws the same road object (centerline + edges) from road-node data for the selected parcel's frontage. | check: planner opens live PE on gold parcel; screenshot/probe shows road geometry, not parcel-only negative space. | grade: [MET]
3. **B2 — Site-plan design pass.** PDF is a professional one-page (or two-page) deliverable: clean layout, non-colliding dimension labels, contours not spaghetti over the parcel, parcel + envelope + road + setbacks legible. | check: planner generates gold site-plan PDF; customer-reads-as-paid-deliverable judgment with pasted notes. | grade: [MET]
4. **B2 (near-free) — Property-line tags.** If computed bearing+distance from parcel GIS ring can be shown, show them honestly labeled (GIS-approximate / not survey-grade). Survey-grade claim = FAIL. | check: tags present OR explicit deferral with reason; if present, honesty line/provenance visible. | grade: [MET]
5. **B3 — Vocabulary reconciliation.** Map card, inspect, and PDF agree on setback/buildable state for the same parcel (no "buildable % pending" vs "setback-consumes-lot" split when one truth exists). FIX-1 geometry root already addressed; this is surface vocabulary. | check: planner picks 3 gold parcels; pastes map card + inspect + PDF summary for each; agreement or honest shared pending. | grade: [MET]
6. **Customer QA at each unit end-state.** Each of B1/B2/B3 closes only after planner live customer-surface verify (not executor report, not backend-only). | check: per-unit check-in with pasted live evidence. | grade: [MET]
7. **M0 promotion (planner-gated).** Reusable render/UX lessons promoted to mechanical guards or durable notes; scratch updated. | check: scratch entries + promotion decisions in finish check-in. | grade: [MET]

## Negative done-line

Road still an empty STREET box on site plan or map; site plan still crude/unreadable; map card vs PDF vs inspect disagree on setbacks/buildable; a fabricated (non-provenance-marked) property-line-tag shown as survey-grade.

## Out of scope

Depth-engine promote / county fan-out; Command Center; true survey ROW; survey-grade property corners; Central-TX greenlight; new atom families beyond wiring existing road-nodes into render.

## Dependencies

B1 / B2 / B3 are independent features (safe parallel). Within B1: site-plan STREET and map road may ship in one PR pair or sequenced site-plan→map if shared model helper. B2 may consume B1 road geometry if B1 lands first; if not, design pass still ships on parcel+envelope+setbacks and leaves STREET as current. B3 does not wait on B1/B2 polish — vocab must reconcile even if road still missing (honest shared state).

## Invariants

I-C provenance on every drawn element; I-I verification never delegated; anti-fabrication (no survey-grade claim from GIS); customer-surface verify (app-correct, not backend-healthy alone).
