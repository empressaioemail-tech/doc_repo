---
id: 2026-07-27_program_status_done_vs_discussed
title: Program status — what is actually BUILT vs discussed/spec'd/recon'd (verified against code + ledger)
date: 2026-07-27
status: reference
owner: nick
verified: against live hauska-engine code + serving ledger (not agent reports)
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27f_bastrop_through_v2_program, 2026-07-26_v2_sourcing_recon_bastrop, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks, 2026-07-26_temporal_boundary_primitive_and_living_layer]
---

# Program status — DONE vs DISCUSSED

Built 2026-07-27 by reading the actual hauska-engine code + serving ledger, NOT agent reports (prior status summaries had drifted toward "we found the source" = "we ingested it"). This is the honest reference for what physically exists vs what is spec'd/recon'd/vision.

## Direct corrections to prior thin answers

- TOPOGRAPHY did NOT get sharper on the depth pass. `usgs3dep.ts` is the same USGS 3DEP raster (~10m, "confidence 0.60 asserted"), resamples toward 1m only "where lidar-derived DEMs are staged" (opportunistic). The Bastrop 1-ft contours (`Contour1Ft2017`) and TxGIO statewide LiDAR were RECON FINDINGS, not code — NOT ingested.
- ROAD CONTOURS / grade / surface-elevation: NONE. No road-topography ingest exists. Road centerlines + classification yes; road contours no (that is v3 road-fidelity, untouched).
- The GIS depth pass sharpened COVERAGE and CORRECTNESS, not FIDELITY/depth-of-authority.
- Confirmed RIGHT (in code): the boundary primitive DID ship temporal — `property-boundary-edge` atom carries `effectiveDate`, `status: active|retired`, `supersedesEntityId` (packages/atoms/src/boundary-instances.ts). The living-layer decision landed in code, not just doc.
- "Authoritative" on this pass means GIS-AUTHORITATIVE (county-published feature layers), NOT courthouse-record-authoritative. Parcel geometry is the county GIS polygon ("not a survey"); setbacks are rules-table-derived, not read off recorded plats. ZERO courthouse/recorded documents ingested.

## Status table

| Capability | Status | Verified fact |
|---|---|---|
| Buildable envelope (depth) | DONE | 99.59% place-type Bastrop; geometry-bug class closed (PATCH-A) |
| Real polygon-offset geometry | DONE | polygon-clipping + geometry gate + positive-space fixtures |
| Front/edge labeling correct-by-rule | DONE | front-labeling fixture gate; local>collector; footway-ineligible |
| Road as first-class node | DONE | centerline + classification + assumed ROW |
| Boundary primitive (property line as node) | DONE | property-boundary-edge atoms: role+adjacency+interior+setback |
| — temporal fields (supersede-ready) | DONE | effectiveDate/status/supersedesEntityId IN the atom (verified) |
| — parcel-to-parcel adjacency | DONE | cell-grid+PIP, scales to Bexar; adjacency-grid.ts |
| Offset consumes the primitive | DONE | consume.ts + spy test; 28286-class dead by construction |
| County road source (StreetsSurveyed2016) | DONE | fetch-streets-surveyed-2016.ts — COUNTY roads only |
| County roadway source (city+county) | IN FLIGHT | S2-F finisher running; city-street surface data SPARSE/undefined (live-queried) |
| OSM-proxy retirement | PARTIAL | county roads retired; city streets still on OSM proxy (thin authoritative data) |
| Parcels | v1 (GIS) | txgio_parcel GIS polygon — "not a survey" |
| Zoning | v1 (GIS) | zoning-fact atoms from GIS layers |
| Setbacks | v1 (rules) | descriptor table -> code-cited; NOT read off recorded plats |
| Flood | v1 | FEMA NFHL adapter |
| Topography | v1 ONLY | USGS 3DEP ~10m. 1-ft contours + LiDAR recon-found, NOT ingested |
| Road contours / grade / surface-elevation | NONE | no road-topo ingest anywhere |
| True ROW (survey width) | NOT DONE | assumed-per-class only; surface_width field found, not ingested |
| Easements | NOT DONE | recorded-doc parse; not started (v2-enhancement) |
| Courthouse / recorded documents | NONE | plats/deeds/surveys/easements — scanned PDFs, zero ingested |
| Road centerline+edge RENDER (site plan/map) | NOT DONE | Track B; site plan draws empty STREET box |
| Site-plan design pass | NOT DONE | Track B |
| Customer QA (live app end-to-end) | NOT DONE | HTTP smoke owed 3 waves; near-zero customer QA |
| CC cockpit / engine panels / map swap | NOT DONE | Track C, deferred-by-design (last+thin) |
| County-onboarding recipe (start county X) | SPEC'D | 27d written; not built |
| Recipe proof on counties #2-3 | NOT DONE | zero non-Bastrop evidence — the CTX gate |
| CTX fan-out | HELD | operator hold; gated on mold-set + recipe-proof |
| Fidelity track (true ROW / plat / topo v2) | RECON'D | sourcing recon done; build not started |
| Living layer (zoning-change/annex/ownership/permit/subdivision) | DESIGNED | temporal machinery exists; sensing engines not built |
| Marketplace / write-back contract | VISION | decision record; not designed in detail |
| Base-layer / connecting-tissue thesis | THESIS | decision record; the "why" |

## The honest through-line

We have built a genuinely correct, honest, GIS-grade depth engine for ONE county, with a real temporal boundary primitive under it. Solid. But almost everything that makes it v2 / authoritative / a product / a platform is discussed/spec'd/recon'd, NOT built. The things asked about (topo sharper, road contours) are NOT done; the vision-carrying pieces (courthouse records, easements, fidelity, living-layer, marketplace) are all downstream.

Three untouched, high-value, INDEPENDENT bodies of work, none needing more depth work:
1. Track B (customer-UI) — make it SELLABLE (road render + site-plan design + vocabulary reconciliation).
2. Recipe proof on counties #2-3 — verify it SCALES (the CTX gate).
3. Customer QA — verify it's USABLE (LAST — does little without 1+2; QAing an unsellable, unproven surface tests little).

## Next sequence (operator 2026-07-27)

After the S2-F finisher closes Bastrop-depth: run Track B (sellable) + the recipe proof (#2-3, scales) in parallel — this finally makes "multiple tracks in flight" real. THEN customer QA on the market-ready + proven surface (QA last). Then CC (thin, last). CTX stays HELD until the mold is set (Bastrop market-ready) and the recipe proves on #2-3.
