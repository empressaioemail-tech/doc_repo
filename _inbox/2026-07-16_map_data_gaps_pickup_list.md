---
id: 2026-07-16_map_data_gaps_pickup_list
title: Map data gaps and deferred features — pickup list
status: active
last_updated: 2026-07-16
applies_to: hauska-brief-extension, cortex-tiles, cortex-api, hauska-engine
related: [2026-07-15_parcel_mesh_ifc_tile_spec, 55_spine_data_intelligence_stack]
owner: nick
---

# Map data gaps and deferred features — pickup list

Running list of map capabilities that exist in the backend or spine but are NOT yet surfaced in the Property Brief map, or that are surfaced with a known limitation. Operator directive (2026-07-16): every one of these should get live eventually; this is the durable queue so a deferral is a pickup item, never a silent drop. Address in later waves after the current three-track "amazing map" program lands.

The map development lives in three layers: (1) map-data / GIS backend, (2) the shared map renderer / tile logic, (3) app consumers. These gaps are mostly layer 1 (data the backend can serve but the Brief does not render) and a few honesty/coverage items.

## Deferred because the data is fixture/synthetic (commitment #1 blocker)

These are wired in the backend but return fixture/synthetic values ("Composite derived from fixture/synthetic inputs for dev"), so they are deliberately LEFT OUT of the Brief until they are real. Putting synthetic reasoning on the wedge surface violates commitment #1.

- Composite layer: buildable-envelope. Real engine-derived buildable envelope, not fixture.
- Composite layer: constraint-density. Real constraint stacking, not synthetic.
- Composite layer: motivated-seller-heat. Real signal, not the 0.74 fixture.
- Composite layer: OZ deal-crossfilter. Real Opportunity Zone crossfilter.
- Pickup shape: promote each composite from buildCompositeLayerFixture to a real engine-backed derivation, THEN wire into the Brief map with earned confidence + provenance. Until then, not shown.

## Deferred because not yet wired into the Brief (data is real, surface missing)

- Rent-heat / rent-AVM layer as a rendered map surface (the legend referenced it; the live render was tuned for the old path). Real per-CLIP rent data exists but needs the tile+CLIP cache (see the Cotality map-cache gap) to be affordable.
- Zoning enrichment beyond the base parcel layer (the backend has ZONING_ENRICH_CONCURRENCY / MAX_BBOX_ZONING_ENRICH bbox zoning enrich) — surface zoning as its own toggleable layer with the enrich path, not just parcel land-use.
- Federal GIS layers (listFederalGisLayerEndpoints) beyond FEMA NFHL — enumerate and surface the other federal layers the endpoint list already serves.

## Deferred report overlays (real tiles, not yet in the floating map)

The report-overlay tiles exist (Hydrology, Drainage, Topography, Subsurface) and push MapLibre overlays, but only some land in the current program. Any not wired in the first pass:
- Drainage overlay (pysheds flow accumulation / drainage network) as a map layer.
- Subsurface / SSURGO soils overlay as a map layer.
- Full 3D terrain tilt (the current terrain is 2D hillshade relief; setTerrain / raster-dem 3D tilt was explicitly deferred).

## Level-of-detail and coverage honesty (partial fixes; deepen later)

- LOD tail: beyond the first-pass aggregate-when-zoomed-out, a proper tile-pyramid / server-side simplification for large bbox parcel meshes at low zoom (the first pass keeps SOMETHING on screen; a real vector-tile LOD is the deeper fix).
- Viewport cache durability: first pass is in-memory per session; a persistent tile+CLIP cache (ties to the Cotality map-cache gap — Path B /gis-layer bbox mesh has zero cache today) is the affordability fix for rent-heat and per-CLIP layers.
- Coverage-honesty at map level: when a jurisdiction is outside engine coverage, the map should show an honest "no coverage here" state per layer, not an empty silence that reads as "nothing here."

## Mesh/IFC follow-ons (from the 2026-07-15 build handoff, post-deploy)

- Full three.js GLB 3D viewer in the tile (v1 shows metadata + download refs only).
- sourceRasterId threaded to the read model but null on the raster path; fill via a future EPQS-point or 3DEP f=json probe.
- resolutionMetersActual always null on 3DEP /exportImage; the confidence -0.15 unmeasured-resolution penalty is a constant until a measured resolution lands.

## Known landmine to clear in-program (not deferred)

- ldt parcel resolver still leads PARCEL_LAYER_KINDS_BY_PRIORITY with "regrid-parcel" though Regrid was purged 2026-06-17. Fix en route during the mesh/IFC / map-data program, do not defer (Regrid must not resurface).

## Extension reach (separate from data gaps)

- L4: the follow-the-user content/panel injection on listing sites still consumes the old map path; only the research-app is rebuilt on the spine tile. Bringing the listing-site surfaces onto the same tile is the reach item (distinct from these data-breadth items).
