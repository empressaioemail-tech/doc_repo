---
id: 2026-07-29_pe_hydrography_layer_and_flood_drainage_report_spec
title: PE — Hydrography map layer (real mapped streams) + Flood & Drainage report bubble (paid, sheet-standard PDF)
date: 2026-07-29
status: spec (addendum to the PE Workbench build)
owner: nick
related: [2026-07-29_pe_workbench_concept_spec, 2026-07-29_pe_ai_chat_atom_citations_spec, 28_THE_BASTROP_MOLD_engine_build_spec, 2026-07-27_bastrop_public_data_completeness_recon]
purpose: Resolve the "hydrology means two things" confusion. The MAP LAYER becomes real mapped hydrography (county streams, toggleable). The STUDY becomes a paid "Flood & Drainage" REPORT bubble in the workbench — sharply visualized, exported to a site-plan-standard PDF. This is the FIRST paid report bubble; it sets the pattern for all future report bubbles.
---

# PE Hydrography layer + Flood & Drainage report

Unpacking the confusion: "hydrology" was doing double duty in PE. It is now cleanly split into TWO distinct, accurately-named things:
- HYDROGRAPHY (map layer) — the real, mapped, county-surveyed creeks/streams. Authoritative reality. Toggleable.
- FLOOD & DRAINAGE (report bubble) — the paid engineering study: where water accumulates around and on the parcel, rainfall response, exported as a sheet-standard PDF.

The old cryptic blue "flow lines" (derived D8 flow from the DEM) STOP being the headline map layer — they were a terrain-derived approximation reading as noise. D8 flow becomes an INPUT to the report, not a standalone map layer.

## PART 1 — THE HYDROGRAPHY MAP LAYER (real streams, toggleable)

- SOURCE: the county's mapped hydrography — `Hydrography/Creeks_Streams` (Bastrop county ArcGIS, found in the public-data completeness recon; NOT yet ingested). This is SURVEYED/MAPPED water features, not DEM-derived — authoritative-over-derived (same discipline as roads).
- Named "Hydrography" in the LAYERS panel; a toggle like the other layers (contours, FEMA, parcel, zoning).
- Provenance on the layer: county source + vintage. Honest-absent where the county doesn't map a stream.
- The derived D8 flow lines are REMOVED as a standalone customer map layer (they were the confusing squiggle). D8 flow survives as an input to the Flood & Drainage report (PART 2). (An operator/debug toggle for raw D8 flow is optional, not customer-facing.)
- This ingest is the same adapter pattern as any county GIS layer; provenance-stamped; the mold's ENUMERATE-ALL-FOLDERS already surfaced it.

## PART 2 — THE FLOOD & DRAINAGE REPORT (paid bubble — the first paid report)

A workbench report bubble (per the PE Workbench spec): runs on the active property, generates in the shared dock, renders visually in the container, exports to a sheet-standard PDF. This is a PAID report (public-paid), engineering-grade, worth paying for — NOT a squiggle.

### What it shows (all backed by REAL engine output — verified in code)
The site-drainage study already produces exactly this (`hydrology/hydrologyNative.ts` + `siteDrainageIngest.ts`):
- CATCHMENT — the upstream watershed delivering runoff toward the parcel (water accumulation AROUND the property). `catchment` output.
- DRAINAGE ZONES — the accumulation zones (`drainageZonesGeoJson`) — the "gradient" visualization of where water concentrates.
- RAINFALL RESULT — the modeled ponding/flood response ON the parcel at a rainfall depth (`rainfallResultGeoJson`, `rainfallDepthInches`/`rainfallDepthMm`, forced by NOAA Atlas-14). This is the "how deep does water pool here when it rains" answer.
- FLOW LINES — the traced flow exits / pour points (`flowLinesGeoJson`) — where water leaves the parcel.
- The layman briefing text already exists (`siteDrainageBriefing.ts`): "upstream catchment delivers runoff toward the parcel pour point... verify finished-floor elevation against the ponding scenario before locking the envelope." Use it.

Operator ruling on gradients: show the gradients on WHAT WE COLLECT — the drainage-zone / rainfall-result visualization gives people a good-enough idea; do NOT over-engineer specific 1"/2"/3"/4" inch bands. The catchment + drainage-zone + rainfall-ponding viz is the value.

### The report FLOW (workbench pattern)
1. User taps the Flood & Drainage bubble on the active property.
2. The report GENERATES in the shared dock (like every report bubble; may run the drainage study / refresh if not cached).
3. It renders VISUALLY in the container — the catchment + drainage zones + rainfall ponding + flow lines, sharply drawn (NOT the old cryptic squiggle; a real, legible drainage visualization on/around the parcel).
4. Export to PDF: MERGES the on-screen visual + the study data into a professional sheet.

### THE PDF INHERITS THE SITE-PLAN SHEET STANDARD (the leverage decision)
The Flood & Drainage PDF uses the SAME visual system as the site plan — the Sheet Standard v1.0 (`hauska-engine/packages/engine-core/src/site-plan/pdf/SHEET_STANDARD_v1.html`, the 20 rules + tested acceptance checklist). Same header form, layer weights, label-collision cascade, honest chips, number/unit form, provenance strip, PDF craft. ONE sheet standard, multiple report types. This is both cheaper (reuse the hard-won craft) and better (consistency = one premium product line). RULE GOING FORWARD: every report we bring forward into PE inherits the sheet standard — do not create a second visual system.

## PART 3 — NAMING (resolve the overload)
- Map layer = "Hydrography" (mapped water features — accurate).
- Report = "Flood & Drainage" (leads with flood — what the customer cares about — accurate to the drainage study).
- These are two distinct, accurately-named things. No more bare "hydrology" that confuses a layer with a study.

## PART 4 — WHY THIS MATTERS BEYOND HYDROLOGY (the pattern-setter)
This is the FIRST genuine PAID REPORT BUBBLE in the workbench. It sets the template for every future paid report (comps, hazard, plan-review, etc.): run-in-dock → visualize-in-container → export-to-sheet-standard-PDF. Build it well — the pattern it establishes is reused. The workbench's "reports/tools" bubble is where these live; Flood & Drainage is its first real inhabitant beyond the free exports (site-plan, terrain).

## PART 5 — BUILD NOTES / HONESTY
- The drainage study exists (CC `/place/drainage` + `/place/hydrology`, the engine hydrology worker). Bringing it into PE as a paid, sharply-visualized, sheet-standard report is a REAL build (viz + PDF + the paid gate), not just surfacing.
- It's public-PAID (gate accordingly — the free browse layers stay free; this study is a paid report).
- Provenance/honesty on every value (DEM source + resolution, NOAA Atlas-14 forcing, D8 provenance) — the study carries its basis, per commitment #1. On flat terrain / DEM void, honest-empty (the study says "no significant drainage concentration modeled here", never a fake result).
- Hydrology is DEM-derived — it inherits the topo fidelity (1m/1-ft contours) and the hydrology-resolution-floor gotcha (the mold's PART 3: any topo change re-verifies hydrology; the /dem sibling 1m-default residual). Verify the report against the current topo.

## EXECUTION
Folds into the PE Workbench build (same planner, planner-manages-background-agents, verify live, deploys planner-owned, standing decisions in every sub-dispatch). Suggested: (a) ingest the Hydrography layer + toggle + retire the D8 map layer; (b) the Flood & Drainage report bubble = run-in-dock + sharp viz + sheet-standard PDF export + paid gate. CTX HELD.
