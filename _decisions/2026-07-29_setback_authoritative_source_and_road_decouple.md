---
id: 2026-07-29_setback_authoritative_source_and_road_decouple
title: Decision — setbacks come from the jurisdiction's AUTHORITATIVE per-parcel record (plan-reviewer-grade), decoupled from the road twin
date: 2026-07-29
type: decision_record
status: active
owner: nick
decided_by: nick (operator), captured by claude_code (planner)
related: [28_THE_BASTROP_MOLD_engine_build_spec, 27c_road_node_engine_and_warm_digital_twin_spec, 29_scale_warm_architecture, 2026-07-26_v2_sourcing_recon_bastrop]
reversal_criteria: reverse only if a jurisdiction genuinely publishes NO authoritative per-parcel/per-district dimensional record and the only source is code-transcription — then the fallback tier applies, but the primary principle (authoritative-published-record, plan-reviewer-grade, road-decoupled) stands.
---

# Setbacks: authoritative source, road-decoupled

Root cause found (3-probe diagnosis 2026-07-29): our setback engine KEYED SETBACK VALUES ON ROAD-CLASS (front-on-collector vs front-on-local, with not_specified defaults). That is the wrong model. Bastrop's B3 code is form-based (build-to-line + neighbor-averaged first-layer-setback; side/rear defer to IBC) — it has NO road-class-indexed scalars. The practical numbers a builder/plan-reviewer uses (25/5/15/25/35) come from the city's authoritative per-parcel GIS record (Parcels_One_Click), which the city's GIS staff maintain and which SmartCity reads correctly. Our road-class model mis-modeled the mechanism AND degraded to our road-classification accuracy (the OSM footway/gravel/collector bugs).

## RULINGS (operator 2026-07-29)

1. GIVE THE PRACTICAL ANSWER. Serve the real, usable dimensional numbers a builder/plan-reviewer applies day-to-day (front/side/corner-side/rear/height/impervious/min-lot), NOT the form-based "it's a rule / neighbor-average" reading. Practical = what SCALES NATIONWIDE (every jurisdiction has practical numbers a plan reviewer applies; not every jurisdiction is form-based).

2. ROADS STAY A TWIN, DECOUPLED FROM SETBACKS. The mix-up was using the ROAD as the setback MEASUREMENT BASIS. The road node as a first-class twin (centerline, ROW, classification — for frontage, digital twin, rendering, and knowing WHICH edge is the front) is CORRECT and STAYS. KILL only the road-class -> setback-VALUE dependency. Roads may still identify the front EDGE; they must not supply the setback NUMBER. Do NOT kill the road twin.

3. AUTHORITATIVE PLAN-REVIEWER-GRADE SOURCE. Setbacks come from the record the jurisdiction's own PLANNING & ZONING department uses — the record that STANDS AGAINST A PLAN REVIEWER. Not our PDF transcription, not our derivation. For Bastrop: the City of Bastrop Parcels_One_Click ArcGIS layer (services7.arcgis.com/qOeXJdBtGknaCJC4, the city's maintained per-parcel dimensional record, carries the ordinance link). GENERALIZES: every county -> find the jurisdiction's authoritative published dimensional-standards record and use THAT. Public source, no relationship-privilege.

4. HYDRO VIZ — out of scope for this correction.

## MOLD IMPLICATION
The mold's setback model (road-class-indexed descriptor table) is WRONG and must be replaced: setbacks = the jurisdiction's authoritative per-parcel/per-district dimensional record (plan-reviewer-grade, published GIS where available), cited to the ordinance, road-DECOUPLED. This is a mold-level correction and it gates scaling. Setbacks are NOT a uniform simple lookup across jurisdictions (form-based vs Euclidean vs hybrid) — but the PRACTICAL published record is the universal, scalable answer.
