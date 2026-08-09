---
id: 2026-08-08_COUNTY_SHAPE_decision_sheet
title: County shape decision sheet — which rails make a county COMPLETE
date: 2026-08-08
status: DECISION PENDING — operator sort required
owner: nick
related: [90_operations/OPS-1_texas_source_registry, _catalog/texas_roster_v1.json, 80_adrs/adr_029_building_footprint_and_utility_easement_rails, _inbox/2026-08-08_lightbox_gap_closure_spec, 90_operations/OPS-7_coverage_and_honesty_doctrine]
---

# County shape — the decision that gives Texas a denominator

Today "is Texas complete" has no number because completeness is measured against work attempted, not against a declared shape. This sheet fixes that. Sort each rail REQUIRED / OPTIONAL / OUT and every county gets a percentage: rails satisfied divided by rails required.

All coverage numbers below are read live from `_catalog/texas_roster_v1.json` (254 county rows, T6 recon) on 2026-08-08. Texas total parcel estimate across the roster: **13,360,496**.

## The candidate rails

| # | Rail | Source | Current roster coverage | Recommend |
|---|---|---|---|---|
| 1 | Parcel geometry (Rail C) | TxGIO StratMap statewide; county ArcGIS override where fresher | 253/254 in StratMap, all 254 verified. 18 flagged stratmap-vintage-drift, 1 no-stratmap | REQUIRED |
| 2 | CAD attributes (Rail B) | County CAD (PACS/Orion/HCAD) + TxGIO embedded | 173 verified, 22 partial, 59 honestly absent (no REST) | REQUIRED |
| 3 | Join quality / owner match | derived; `owner_match_gate_required` ALWAYS per OPS-1:45 | 254/254 verified; 8 crosswalk-required counties | REQUIRED |
| 4 | Zoning + setback rule (Rail A) | municipal code per incorporated city; county unincorporated = unzoned | 254/254 counties record unincorporated as unzoned (honest absence). 1,223 cities in roster, top-59 recon complete | REQUIRED |
| 5 | Roads / frontage | OSM Overpass + county roadway layers | not tracked as a roster rail today | REQUIRED |
| 6 | Flood / terrain (Rail D) | FEMA NFHL, USGS 3DEP, USDA SSURGO — uniform federal | not tracked per-county in roster | REQUIRED |
| 7 | Buildable envelope (derived) | computed from 1+4+5 | Bastrop city only | REQUIRED |
| 8 | Land use | CAD roll code | varies 0 to 98 percent per county (Travis 46.8; Comal/Hays/Williamson 0) | your call |
| 9 | Building footprints | ML-derived default; no county has CAD footprint REST | `footprint_tier: ml-derived` for all 254 | your call |
| 10 | Utility easements | county honest-absence default; McLennan CAD exception | 253 absent, 1 cad-easement-rest | your call |
| 11 | Owner facet (paywalled) | CAD `owner_name` + mailing, via authenticated BFF | data present wherever Rail B is; not surfaced | your call |
| 12 | RRC wells / pipelines | RRC public GIS | zero factory-side coverage | recommend OUT of shape |
| 13 | MUD / special districts | TX Comptroller special-district registry | zero factory-side coverage | recommend OUT of shape |

## The two semantic rulings (these change every county's number)

**A. Does honest absence count as SATISFIED?**

All 254 counties record unincorporated territory as `unzoned` with doctrine `PASS — county unincorporated = honest absence`. 59 counties have no CAD REST endpoint at all and are marked `honestly_absent`.

Recommendation: **YES, honest absence counts as satisfied.** "We established there is none, from public record, with evidence" is a complete answer and it is what OPS-7 already doctrines. The alternative permanently caps rural counties below 100 for correctly reporting reality.

Consequence if NO: 59 counties can never reach 100 on Rail B, and no unincorporated county can ever reach 100 on zoning. The number stops meaning completeness and starts meaning urbanization.

**B. Is a rail satisfied at ANY coverage, or does it need a threshold?**

Land use runs 0 to 98 percent by county. A binary present/absent flag lets a county show green at 12 percent coverage.

Recommendation: **threshold, not binary.** A rail is SATISFIED at or above its declared threshold, PARTIAL below it, ABSENT at zero — and the county percentage counts only SATISFIED. Partial states must be visible in Command Center, never rounded up. This is the same discipline as the W2 filter coverage disclosure: a set operation that looks authoritative while silently missing half a county is the failure mode we are engineered against.

Open sub-question if you take the threshold: what number? I would start at 90 percent for derived rails and 95 for spine rails, then tune against measured reality rather than pick a round number now.

## What the sort produces

REQUIRED rails form the denominator. A county reports `satisfied / required` as its completeness percentage, and Texas reports the mean weighted by parcel count.

OPTIONAL rails appear in the manifest with their state, and never reduce the number.

OUT rails do not appear in the county shape at all. Note this is a shape decision, not a product decision — W3 RRC and W4 MUD stay HELD under the scale-before-new-layers ruling regardless, and can be added to the shape later if that ruling is revisited.

## Cost note

The roster carries a per-county `cost_estimate` using an `engine_250_heuristic`. Every one of the 254 rows is `flagged_over_200: false`. Sample: Anderson County, 43,894 parcels, estimated 0.75 USD. Those estimates cover compute for the spine rails only and are not a full per-rail cost model — the economics doc is a named ABSENT domain in the doc inventory. Treat the sub-200 commitment as unverified against the full rail set until that model exists.

## Risk classes already known (T6)

156 bis-field-template, 59 no-rest, 18 stratmap-vintage-drift, 8 crosswalk-required, 1 no-stratmap, 1 harris-sharding-required. These are ingest-wave planning inputs, not shape inputs, but they tell you where the required rails will be expensive.

## What I need

One sort per rail, plus a yes/no on each semantic ruling. Everything downstream — the manifest rows, the Command Center columns, the completion percentage, the factory scope — derives from this sheet.
