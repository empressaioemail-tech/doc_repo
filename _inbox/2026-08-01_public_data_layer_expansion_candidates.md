---
id: 2026-08-01_public_data_layer_expansion_candidates
title: Public data layer — expansion candidates (utility/power lines + the broader "what's worth adding" map)
date: 2026-08-01
status: parked (idea capture; scope when we return — not dispatched)
owner: nick
related: [42_stub_thesis_national_twin_substrate, 41_three_wedge_spine_strategy, 2026-07-31_smart_site_MARKET_white_paper]
purpose: Capture the operator's two questions — (1) what power-line / utility routes are public in TX (Encore/Oncor), and (2) the broader "what can we add to the public data layer that's valuable." Ranked by the lens that matters: does it change what you can BUILD, what it COSTS, or what it's WORTH on a specific site. Honors no-special-data-access (uniform public sources only). Parked for a real scoping pass later.
---

# Public data layer — expansion candidates

The lens throughout: a layer earns a spot only if it changes the ANSWER to "what can I do here and what's the risk," not if it's merely nice to see. A see-it layer is a mapping-company feature; an answer-changing layer is a Smart Site layer. And the through-line for all of these: we already win on the boring assembled truth. Every candidate below is a PUBLIC dataset nobody has bothered to join to the parcel, reconcile, and date. That is the moat — the assembly, not the data.

## PART 1 — Power lines / utility infrastructure (the direct question)

### Transmission (high-voltage towers) — PUBLIC, clean
- Source: HIFLD (Homeland Infrastructure Foundation-Level Data) / EIA "Electric Power Transmission Lines" — national, downloadable geospatial vector lines with voltage class, covers the ERCOT-region grid statewide.
- Substations + power plants: also HIFLD/EIA, downloadable point features.
- This is the reliable one. Easy to pull, statewide.

### Distribution (poles + wires to the building) — MOSTLY NOT PUBLIC
- Distribution-level line routing is generally NOT published as open geo data. Utilities treat it as security-sensitive (CEII rules) + proprietary. "Encore/Oncor's exact lines down your street" is not cleanly pullable.
- NOTE: for DFW the utility is ONCOR (not "Encore") for transmission/distribution — confirm which the operator means; it changes the territory data.
- What IS available at the distribution layer:
  - Service-territory boundary (who serves this area) — PUBLIC via PUCT (Public Utility Commission of Texas).
  - Outage maps (Oncor/utility) — a live VIEWER, not clean downloadable data.
  - Transmission feeding the territory — public (HIFLD).

### The genuinely valuable + genuinely public utility layers for us
- HIFLD transmission lines + substations (reliable, statewide, downloadable).
- Retail electric provider / utility service territories (PUCT) — "who is your provider here."
- Pipelines — TX RRC (Railroad Commission) publishes oil/gas pipeline data; PHMSA National Pipeline Mapping System (public viewer, precise download restricted).
- Broadband availability — FCC National Broadband Map, fully public, per-location.

Bottom line: transmission = easy + public; distribution routing = mostly not; service territories = public.

## PART 2 — The broader map: what's worth adding, ranked

### Tier 1 — directly changes buildability / risk / value (highest leverage)
- UTILITY AVAILABILITY AT THE PARCEL. Not the line routes — the question "is there water/sewer/electric/gas service to this lot, or is it septic-and-well." THE question for raw-land development. Derivable from public sources (service territories + municipal utility districts + transmission/pipeline proximity). Big for the RE-pro and developer wedges; nobody assembles it well.
- WETLANDS — USFWS National Wetlands Inventory. Public. A hard buildability constraint, pairs directly with the existing flood layer.
- SOILS — USDA SSURGO. Public, statewide. Septic suitability, foundation / EXPANSIVE-CLAY risk (a real Central-TX pain), agricultural value. Changes what you can build and what it costs.
- SCHOOL DISTRICT + ATTENDANCE ZONES — public. The single biggest value driver in residential; the realtor wedge would lean on this hard.

### Tier 2 — strong context, some already partially in reach
- EASEMENTS / ROW / pipeline setbacks — where you legally can't build. Partially public (RRC pipelines give the pipeline; easements proper live in deed records).
- TRANSMISSION-LINE PROXIMITY + easement — public (HIFLD); "can't build under the towers" constraint + a value/marketability factor.
- GROUNDWATER / AQUIFER + well data — TWDB, public; matters for well-dependent land.
- HISTORIC DISTRICTS / OVERLAYS — public at city level; changes what you can do to a structure.

### Tier 3 — valuable but harder or thinner
- TRAFFIC COUNTS — TxDOT AADT, public; matters for commercial siting.
- BROADBAND — FCC map, public; increasingly matters for rural land value.
- ENVIRONMENTAL HAZARDS — EPA brownfields/Superfund, TCEQ; public; commercial diligence.

## RECOMMENDATION (if picking a first add)
The two highest-leverage: UTILITY AVAILABILITY AT THE PARCEL (the raw-land wedge; poorly assembled anywhere today) and SOILS / SSURGO (septic + expansive-clay is a Central-TX-specific, fully-public, genuinely valuable pain). Both pass the "changes the answer, not the picture" test, both honor no-special-data-access (uniform public sources), and both slot next to the existing flood/terrain/zoning layers as another cited atom family.

## WHEN WE RETURN — scoping pass shape
For each chosen candidate: source-by-source pullability (URL, format, license, statewide-or-not), the atom shape (type/fields/confidence/provenance/freshness TTL), which wedge it serves, and the cost-per-jurisdiction check. Same discipline as any layer: cited, dated, honest-absence where it genuinely lacks coverage.
