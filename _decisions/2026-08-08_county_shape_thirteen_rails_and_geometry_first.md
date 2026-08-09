---
id: 2026-08-08_county_shape_thirteen_rails_and_geometry_first
title: County shape ruled — thirteen required rails, three-state completeness, geometry-first statewide then backfill
date: 2026-08-08
status: active
owner: nick
related: [_inbox/2026-08-08_COUNTY_SHAPE_decision_sheet, _catalog/texas_roster_v1.json, 90_operations/OPS-1_texas_source_registry, 90_operations/OPS-7_coverage_and_honesty_doctrine, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _decisions/2026-08-01_scale_before_new_layers_sequencing]
---

# County shape — the denominator for "Texas complete"

Operator ruling 2026-08-08, on the decision sheet at `_inbox/2026-08-08_COUNTY_SHAPE_decision_sheet.md`. This is the definition every downstream artifact inherits: the manifest schema, the Command Center grid, the completion percentage, and the factory scope.

## Ruling 1 — all thirteen rails are REQUIRED

A county counts as complete only when all thirteen are satisfied. No rail is optional and none is out of shape.

1. Parcel geometry (Rail C) — TxGIO StratMap statewide, county ArcGIS override where fresher
2. CAD attributes (Rail B) — county CAD, joined to Rail C geometry
3. Join quality / owner match — owner_match_gate_required ALWAYS per OPS-1
4. Zoning and setback rule (Rail A) — municipal code per incorporated city; unincorporated county is unzoned
5. Roads and frontage — OSM Overpass plus county roadway layers
6. Flood and terrain (Rail D) — FEMA NFHL, USGS 3DEP, USDA SSURGO
7. Buildable envelope — derived from 1, 4, 5
8. Land use — CAD roll code
9. Building footprints — ML-derived default statewide
10. Utility easements — county honest-absence default, CAD exception where published
11. Owner facet — CAD owner name and mailing, authenticated paid facet
12. RRC wells and pipelines — RRC public GIS
13. MUD and special districts — TX Comptroller special-district registry

The planner recommended RRC and MUD be OUT of the shape. The operator overruled: a rail held in the SEQUENCE is not the same as a rail absent from the SHAPE. W3 RRC and W4 MUD remain HELD under the 2026-08-01 scale-before-new-layers ruling; they are nonetheless part of what a finished county looks like, and the completeness number must reflect their absence rather than hide it by excluding them from the denominator.

Consequence, accepted deliberately: essentially every Texas county sits well below 100 percent today. That is the honest number and it is the point. The denominator does not shrink to flatter the score.

## Ruling 2 — three states, not two

"Honest absence counts as satisfied" collapses two materially different verdicts. The manifest carries three states:

- **satisfied-present** — the rail is acquired and meets its coverage threshold.
- **satisfied-absent** — established from public record that no such data exists for this jurisdiction (unincorporated county is unzoned; county publishes no easement linework). A complete answer. Counts toward completeness.
- **not-yet** — we have not acquired it. The only state that reduces the completeness number.

The user-facing distinction is the product point, in the operator's words: "yeah it's coming" versus "no we don't have it yet" are different statements and both are honest. A rail that is genuinely absent is a finding, not a gap.

Rejected alternative: treating honest absence as unsatisfied. That permanently caps the 59 no-REST counties on Rail B and every unincorporated county on zoning, so the number would measure urbanization rather than completeness.

## Ruling 3 — threshold, not binary

A rail is SATISFIED at or above its declared coverage threshold, PARTIAL below it, ABSENT at zero. Only SATISFIED counts toward the county percentage. PARTIAL must be visible in Command Center and never rounded up.

Rationale: land use runs 0 to 98 percent across counties (Travis 46.8; Comal, Hays, Williamson 0). A binary flag would let a county show green at 12 percent coverage — the same class of quietly-wrong result the W2 filter coverage disclosure exists to prevent, and the same class the envelope saga was fought over.

Threshold values are deliberately NOT fixed here. Starting point for tuning against measured reality: 95 percent for spine rails, 90 percent for derived rails.

## Ruling 4 — geometry first statewide, then backfill behind it

Sequence: complete Rail C parcel geometry across all 254 counties FIRST, then advance the remaining twelve rails behind that statewide footprint.

Rationale: geometry is the only rail already statewide-available (253 of 254 in StratMap, all 254 verified per `_catalog/texas_roster_v1.json`, 2026-08-08). It is the rail every other rail joins to. It is therefore the one rail that can actually be finished, and finishing it establishes the footprint that everything else fills in.

## Ruling 5 — partial counties and cities RELEASE

Jurisdictions ship at partial completeness rather than waiting to be finished. The product serves what is established, states what is not yet acquired, and never implies completeness it does not have.

This is a serve-path requirement, not only a manifest one: a parcel card in a 4-of-13 county must present its four rails with provenance and name the other nine as not-yet, in the same honest-absence discipline already applied at the facet level.

## CORRECTION 2026-08-08 (same day) — coverage figures in this record were AVAILABILITY, not possession

This record cited "253 of 254 in StratMap, all 254 verified" as support for ruling 4 (geometry first). That figure comes from `_catalog/texas_roster_v1.json` and is a SOURCE-AVAILABILITY probe: it means StratMap publishes a download for that county. It does NOT mean the data is loaded.

Live store state (`_inbox/2026-08-08_STATEWIDE_layer_inventory.md`, `_inbox/2026-08-08_FABRIC_statewide_parcel_analysis.md`, both queried directly):

| | Claimed in this record | Live |
|---|---|---|
| Counties with parcel geometry loaded | 253 of 254 available | **19 of 254 loaded** (235 absent, Harris included) |
| Parcels | 13,360,496 estimated statewide | **4,617,181 true distinct**, across those 19 counties only |

Ruling 4 (geometry first, statewide) is UNCHANGED and is in fact strengthened: it is the rail we can finish, and we have not started it at scale. But the work it names is ACQUISITION of 235 counties, not merely certification of counties already held.

Related correction: NO layer is statewide-complete today. Topography is per-parcel on-demand DEM crops (60 terrain atoms total), FEMA and SSURGO are live point-in-polygon adapters with a zero-row cache, roads exist only as hand-authored per-city scripts, and city/county boundary polygons are absent entirely (confirmed by the engine's own code comment at `cascade-unzoned-envelope-decline.ts:62`). Address points are 6 counties, not the statewide 11.7M claimed in OPS-1.

Doctrine: **code exists, data loaded, and served to product are three different states.** This portfolio's docs conflate them routinely. Any coverage claim must name which of the three it means and cite the store, not a registry file.

## What this does not change

The scale-before-new-layers ruling (2026-08-01) still governs sequencing. The Geometry Law (2026-08-07) still governs everything geometric. The sub-200-dollar cost-per-jurisdiction commitment is UNVERIFIED against the full thirteen-rail set: the roster's per-county `cost_estimate` uses an `engine_250_heuristic` covering spine-rail compute only, and the economics doc is a confirmed-absent domain. Do not cite the sub-200 figure against the full rail set until a per-rail cost model exists.

## Reversal criteria

Reverse ruling 1 if a rail proves unacquirable statewide from public record at any cost, in which case it moves to satisfied-absent statewide rather than leaving the shape. Reverse ruling 4 if statewide geometry ingest proves to block on a dependency only the other rails can resolve. Rulings 2 and 3 are doctrine extensions of OPS-7 and should not be reversed without revisiting the honesty doctrine itself.
