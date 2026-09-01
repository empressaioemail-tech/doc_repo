---
id: 2026-07-27_bastrop_composition_inventory
title: Bastrop composition inventory — exactly what went into Bastrop (verified against code + ledger)
date: 2026-07-27
status: reference (the "approved mold" definition — QA validates against this)
owner: nick
verified: read directly from hauska-engine code + descriptor + ledger, NOT agent reports
related: [27f_bastrop_through_v2_program, 2026-07-27_program_status_done_vs_discussed, 2026-07-26_temporal_boundary_primitive_and_living_layer]
purpose: the precise, verified definition of "what is in Bastrop" so the post-QA approved state is a known, measurable thing future counties are compared against
---

# Bastrop composition inventory

Read directly from code/descriptor/ledger 2026-07-27. This is the definition of the Bastrop mold: every source, node type, gate, and baked decision that composes the Bastrop state. QA validates against THIS; future counties are measured against THIS. Where a fact needs one more live trace, it is flagged OPEN — do not treat OPEN items as settled.

## SOURCES (the actual adapters feeding Bastrop)

| Layer | Source | Provenance |
|---|---|---|
| PARCELS | Bastrop County GIS ArcGIS: `Cadastral_BP/Bastrop_County_Parcels/FeatureServer/0` (BCAD parcels; prop_id, situs) | County GIS, "not survey grade" |
| ZONING | **City of Bastrop AGOL Place Type** (`Zoning_Place_Type` FeatureServer/0, field `PlaceTypeClass`) via `zoning-layers.ts` key `bastrop-city-tx` → stamped to `txgio_parcel.zoning_district` → Tier-1 → breadth bake → zoning-fact. County GIS zoning is DEAD (`bastrop-tx:zoning` = no-coverage, correct). B3 PDF cites setback RULES only, not district facts. **OPEN for mold approval:** live atoms/Tier-1 still omit GIS provenance (audit A). | AGOL city zoning (origin named); serving-path citation still stripped |
| FLOOD | Bastrop County GIS: `Emergency_Management/FEMA_Flood_Hazard_Areas/MapServer/0` (FEMA-derived) | County GIS |
| ROADS | OSM (Overpass bbox) + county StreetsSurveyed2016 (county roads) + Bastrop_County_Roadway (city+county, but city surface SPARSE — 67 defined / 994 undefined per S2-F audit) | mixed: county-roadway-authoritative (2273) / approximate-assumed-per-class OSM (1887) / county-roadway-undefined (1011) on Caldwell; Bastrop analogous |
| SETBACKS | descriptor `setbackTable`, cited to B3 code §6.5.003 (`bastrop_tx/b3-code-april-2025/6.5.003`), indexed by (district, road-class, edge-role) | rules-derived, cited to code; verification_state = human-verified (P-5) / transcribed |
| TERRAIN | USGS 3DEP raster (~10m, "confidence 0.60 asserted") | federal, v1 only |

Note: the Bastrop LOCAL adapter (`local/bastrop-tx.ts`) intentionally does NOT own roads (DA-PI-4 decision: OSM-direct path); roads come through the road-intake engine, not the local adapter.

## NODE / ATOM TYPES (what exists on a Bastrop parcel)

Property entity types (`packages/atoms/src/property-instances.ts`):
- `zoning-fact`
- `setback-rule`
- `buildable-envelope`
- `parcel-terrain-model` (vendored from @empressaio/atom-contract PR #9)

Net-new node types built this program:
- `property-boundary-edge` (`packages/atoms/src/boundary-instances.ts`) — the boundary primitive; carries role, adjacencyKind, parcelNeighborPropId, facingRoad, setback, interior (BoundaryInteriorFrame), AND temporal (effectiveDate/status/supersedesEntityId). 26,454 in Bastrop.
- ROAD nodes (`road-intake/`) — centerline + classification + assumed/authoritative ROW; id `{fips}:road:{osm_way_id}`. ~4,894 in Bastrop.

## THE ENGINE PIPELINE (how a parcel gets its answer)

Boundary primitive (`boundary-primitive/`): adjacency-grid (cell-grid+PIP, scales to Bexar) -> compute -> interior (once per ring, stored) -> persist -> consume (the offset READS the stored interior, orientation-invariant).

Road intake (`road-intake/`): fetch (overpass-bbox + streets-surveyed-2016 + bastrop-county-roadway) -> classify (county-street + osm) -> emit road nodes.

Depth-warm (`depth-warm/`): warm-compute -> verify-mechanical (the gate) -> warm-then-verify -> promote (`depth-warm-promoted-v1`).

## THE GATES (baked Bastrop decisions — the mechanical guards)

- GEOMETRY-CORRECTNESS GATE — real polygon-offset (polygon-clipping); contained/non-self-intersecting/correct-offset; positive-space fixtures (near-rect-front-on-each-edge, closes the 28286 hole); genuine-self-touch still rejected (guard not weakened).
- FRONT-LABELING FIXTURE GATE — footway-ineligible; local-street-preferred-over-collector; remove-footway invariance (correct-by-rule not by-accident); covers R4.1/R4.3/FIX2 cases.
- MECHANICAL VERIFY GATE (`verify-mechanical.ts`) — second-agent mechanical check (geometry gate + classification-vs-source parity + per-edge inset match); not re-assertion.
- SCHEMA≠DATA / UNREACHABLE-CITY-GIS gates (recipe-level, 27d) — check data population not schema; honest-absent on unreachable sources.
- SMOKE / TALLY — coverage is a live SELECT (G1); cost under commitment #3.

## LIVE LEDGER STATE (Bastrop, from prior live SELECTs)

- Parcels (geometry): 74,729 (txgio); zoning-facts: 5,769; place-type: 3,657.
- Depth-warm-promoted envelopes: 3,642 = **99.59% of resolvable place-type** (post-PATCH-A). Honest residual: ~110 no-road + ~6 honest-irregular.
- Road nodes: 17,552 (OSM 4,894 + roadway auth 5,431 + undef 5,920 + surveyed 1,307). Boundary edges: 26,454.
- All-zoning depth ratio: ~lower (PDD-diluted; PDD honestly declines, separate wave).

## WHAT IS AND ISN'T IN THE APPROVED STATE

IN (v1.5, GIS-grade): parcels, zoning-facts, rules-derived setbacks (cited to B3 §6.5.003), buildable envelopes (99.59% place-type), boundary primitive (adjacency + temporal + **GIS property-line-tags** bearing/distance honestly labeled not-a-survey), road nodes (mixed authoritative/OSM ROW), terrain (3DEP ~10m), flood (FEMA). CC-A console legibility. Track B customer surface (drawn roads PENDING the road-render network fix; PDF; vocab).

NOT IN (deferred): survey-grade ROW / plats / easements / courthouse records (v2/channel); 1-ft contours + LiDAR topo (recon-found, not ingested); road contours; PDD/overlay resolution; the road-render-across-viewport (reopened).

## OPEN TRACES (resolve before "approved" is final)

1. **ZONING SOURCE (RESOLVED origin / OPEN provenance backfill)** — Origin named 2026-07-27 adversarial audit: City of Bastrop AGOL `Zoning_Place_Type` FeatureServer/0 field `PlaceTypeClass` (`zoning-layers.ts` `bastrop-city-tx`), stamped onto `txgio_parcel.zoning_district`, then Tier-1 → breadth bake → zoning-fact. County GIS adapter remains dead (correct). **Still OPEN for mold approval:** live atoms cite only the bake intermediate; Tier-1 zoning.provenance is empty (0/5769); `zoning_jurisdiction` null on all Bastrop stamps. Fix = A1 backfill. Audit: `_inbox/2026-07-27_COMPLETE_BASTROP_hardening_audit.md`.
2. Road-render network fix (reopened — roads exist, not served-to-map-by-viewport).
3. Computed property-line-tags — **CLOSED MET** (PR #150 `933d884`; 26454/26454; check-in `_inbox/2026-07-27_PROPERTY_LINE_TAGS_planner_verify_checkin.md`).
4. Market-ready non-drawing-parcel UX (Flagged Risk A).
5. Customer QA (the heavy pass — validates this whole inventory live).

## Purpose restated

This is the measurable definition of the Bastrop mold. "Bastrop approved post-QA" = this inventory, with the OPEN traces resolved, the COMPLETE-BASTROP hardening WDLL green (or knowingly accepted), and the customer-QA pass green. Every future county's composition is diffed against THIS. Zoning origin is named; provenance backfill + health monitors still gate approval.
