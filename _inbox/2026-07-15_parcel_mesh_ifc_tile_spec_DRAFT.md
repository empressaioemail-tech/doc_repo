---
id: 2026-07-15_parcel_mesh_ifc_tile_spec
title: On-demand parcel 3D mesh and IFC from command center tile — isolated spec
status: draft
last_updated: 2026-07-15
applies_to: revit-connector
owner: planner
related: [55_spine_data_intelligence_stack, 08_tiered_access_model, 41_revit_connector, 30_smartcity_os_state]
---

# On-demand parcel 3D mesh and IFC from command center tile

Isolated spec. Full vision: call a parcel in the spine, instantly get a georeferenced 3D terrain mesh AND an IFC model, from an Empressa command center tile component. Built and adversarially reviewed here, NOT deployed. Coordinated with the master planning agent (see the coordination handoff filed alongside this spec). Grounded against live main as of 2026-07-15; every "exists" / "does not exist" claim below is traced to source read this session, not to prior doc-state.

## Vision

From the Empressa command center, select or pass a parcel (ID or address). The tile assembles parcel boundary plus terrain from public elevation and parcel data, and returns two importable deliverables: a georeferenced 3D terrain mesh and an IFC model, each Z-preserved, each carrying source citation, coverage-honest confidence, source resolution, and collection metadata. Replaces the manual 20-to-45-minute per-parcel QGIS-to-Revit walkthrough with a single tool call.

## What already exists on live main (reuse, do not rebuild)

Traced to source this session:

- DEM raster fetch: `usgs3dep.ts` (identical copies at `hauska-engine/packages/adapters/src/topography/usgs3dep.ts` and `legacy-design-tools/lib/site-context/src/server/usgs3dep.ts`). Hits the 3DEP ImageServer `/exportImage` as F32 GeoTIFF. Returns bytes plus echoed request params.
- Point elevation: `usgs-ned.ts` (identical copies in both repos, `.../federal/usgs-ned.ts`). EPQS point query.
- Contour derivation: `siteTopographyIngest.ts` (only in `legacy-design-tools/artifacts/api-server/src/lib/`). GeoTIFF parse to d3-contour at 5m interval, clipped to parcel plus upstream catchment. `parseDemBytes` already computes `nodataCount`.
- Parcel boundary: county-GIS ArcGIS (`brokerageTxParcels.ts`: Travis, Williamson, Bexar, Bastrop, Caldwell) plus the `cad_property` roll store (~1.07M rows / 5 counties). TxGIO for Hays/Comal in flight.
- Map gate: six live tools including `get_parcel_polygon`, `get_site_topography`, `assemble_map_layers`, probed 6/6 on the deployed four-gate revision.
- IFC INGEST only: `ifcIngest.ts`, wrapped as `cortex_ifc_ingest`. Reads IFC into BIM geometry. Does not author IFC.

The clip, reproject, parcel-fetch, DEM-fetch, and contour steps are done. Reuse them.

## What does NOT exist (the actual work), in dependency order

### Layer 0 — coverage-honesty fix (foundation, required before any paid tile output)

The DEM path is coverage-blind today. Confirmed in source:

- nodata silently substituted with `minElevation` before contouring: `siteTopographyIngest.ts` `deriveContoursGeoJson`, lines 490-494. Produces spurious isolines at the data/nodata boundary.
- `nodataCount` computed (`parseDemBytes`, lines 429/436, returned 456) and written to the atom event (line 868) but DROPPED from the read model the tile consumes: `siteTopographyMaterializer.ts` `propertySet`, lines 146-168, has no `nodataCount` field.
- Actual DEM resolution / lidar coverage never captured. Both `usgs3dep.ts` and `usgs-ned.ts` only echo the requested resolution. `usgs-ned.ts` discards the EPQS `rasterId` that would distinguish 1m lidar from 10m fallback.
- No confidence field in any of the three read-model / output shapes. The contract confidence type to match is `WidthedConfidence` from `@hauska/atom-contract` 1.5.0+ (`{ estimate (branded [0,1]), n, intervalWidth, provenance }`, built via `createWidthedConfidence`); uncalibrated topo ships `provenance:"asserted"`, `n:0`, `intervalWidth:1`, mirroring `createOgAssertedConfidence`. Bare numbers are deliberately unassignable.
- No true collection/acquisition date. Every "date" (`demFetchedAt`, `snapshotDate`) is the wall-clock HTTP-call time, explicitly a proxy, not the lidar collection year.

Per structural commitment 1, every output carries source citation and confidence regardless of tier, no geometry carve-out. Per commitment 2, confidence must never be a bare or unearned number presented as earned. A mesh or IFC generated on the current path would present interpolated terrain with an asserted-earned confidence, violating both. So Layer 0 is a prerequisite, not a polish item: surface `nodataCount` to the read model, stop the nodata-to-minElevation boundary artifact, capture actual resolution/coverage (read and carry the EPQS `rasterId` and the 3DEP staged-product resolution), and attach source-resolution + coverage-honesty + collection metadata + confidence to the topo output.

### Layer 1 — 3D terrain mesh from DEM

Net-new but bounded, and there is a reusable asset. Today the pipeline produces contours, not a triangulated surface. Build DEM-raster to mesh (gridded mesh or TIN with Z), georeferenced, buffered to parameter. REUSE the existing GLB authoring core: `@gltf-transform/core` (`Document` / `NodeIO`) is already used in `legacy-design-tools/.../ifcParser/gltfEmitter.ts` to write GLB from web-ifc geometry; the same writer emits a terrain GLB from the DEM grid, so the command center viewer (which renders one GLB per materializable_elements row) consumes it unchanged. Reuse the clip/reproject already in the contour path. No TIN/Delaunay/triangulation library exists today; if a true TIN is wanted over a gridded mesh, that library is a small net-new dep.

### Layer 2 — IFC authoring (the long pole)

Net-new capability, but with a defined home. Nothing in the stack authors IFC; `ifcIngest.ts` is inbound-only via `web-ifc` (WASM, read-only usage; no `WriteLine`/`SaveModel` anywhere). The clean host is the existing Python worker: the pysheds hydrology worker (`artifacts/hydrology-worker/run.py`, spawn-JSON-over-stdio via `hydrologyWorkerClient.ts`, `python:3.11-slim` Dockerfile, `requirements.txt`). Add IfcOpenShell there (or a sibling worker on the same spawn-JSON pattern) and wrap the terrain mesh as a georeferenced IFC site/terrain element with the same provenance and confidence metadata. This dominates the build and review surface. In scope per operator direction (both in one build), largest single piece, primary adversarial-review target.

### Layer 3 — command center tile component

Register the parcel-to-(mesh, IFC) capability as an Empressa command center tile, backed by the Hauska map-gate tool. Parcel in, two importable deliverables out, provenance-stamped. No new brand or naming surface.

## Inputs

Parcel ID or address; target CRS (default by county/region); output formats (mesh, IFC); buffer distance; mesh resolution / contour interval.

## Output

Two Z-preserved deliverables (3D terrain mesh; IFC model), each packaged with provenance: source dataset, actual DEM resolution, lidar-vs-fallback coverage note, collection metadata, confidence, generation timestamp. Confidence reflects source resolution and measured-vs-interpolated coverage, never a flat asserted number.

## Statefulness

Stateless tool call. Deterministic per input (parcel + DEM + params to geometry). Because provenance stamps collection metadata and confidence into the output, re-running when new lidar lands yields a fresh output with newer collection metadata and higher confidence. Versioning falls out of provenance; no state machine in scope. Proactive push-on-new-collection is a later question.

## Placement and tier

Empressa command center tile (product surface), backed by a Hauska map-gate tool (substrate). Not a new brand. Consistent with ADR-008. Note the `applies_to` frontmatter reads `revit-connector` for slot reasons; the primary surface is the command center tile, with the Revit Connector as the reciprocal import consumer.

Tier: raw 3DEP data stays Layer 1 free. The tier model forbids reselling assembled raw federal data as a paid SKU (breaks commitment 1), so this is not priced as packaged USGS data. Layer 2 is the reasoning-and-convenience layer: the assembled, coverage-honest, confidence-scored, import-ready mesh and IFC, and the QGIS-to-Revit time removed. Architect-facing per-use / per-parcel Cortex feature. The reciprocal engine-to-Revit flow (closing the outbound gap named as the largest time-cost gap in the doc set) is a bonus, not the price story.

## Build model

Planner / subagent / adversarial-review. Planner scopes and decomposes; subagents implement in the product repos; a separate adversarial-review pass verifies each layer before it is accepted; verification is never delegated to the implementer. Built and reviewed here. NOT deployed. Deploy is a later, separately-gated step coordinated with the master planning agent.

## Hazards (specific to this repo family, must be respected)

- DEM code is DUPLICATED byte-for-byte across `hauska-engine` and `legacy-design-tools`, both live and both touched 2026-07-15. Any Layer 0 fix to `usgs3dep.ts` / `usgs-ned.ts` must be applied to both copies or the duplication resolved deliberately; a one-repo fix leaves the other path coverage-blind.
- `siteTopographyIngest.ts` + `siteTopographyMaterializer.ts` exist only in `legacy-design-tools/artifacts/api-server/src/lib/`.
- Shared-clone concurrency: other agents commit in the shared clones; check `git log` right before committing, stage explicit paths, commit promptly. Do not deploy.
- Collision with the auth-gate enforce lane and the master planning agent's in-flight work: coordinate before touching `hauska-engine` or `legacy-design-tools` (see the coordination handoff).

## Acceptance

- A parcel ID or address, called from the command center tile, returns a Z-preserved 3D terrain mesh AND an IFC model.
- Both outputs carry all four quality-gate signals; confidence encodes actual source resolution and measured-vs-interpolated coverage, not a flat asserted number.
- Layer 0 verified: `nodataCount` reaches the read model; the nodata-boundary spurious-contour artifact is gone; actual resolution / lidar-vs-fallback coverage is captured (EPQS `rasterId` / 3DEP staged resolution read, not discarded); applied to BOTH duplicated adapter copies.
- Mesh is georeferenced and imports cleanly; IFC opens as a valid georeferenced site/terrain element.
- Works for a no-relationship jurisdiction through the uniform public-record path (no special data access).
- Built and adversarially reviewed here; NOT deployed.

## Open items for the planning pass

- Exact mesh format and IFC schema version the command center viewer and Revit import expect (check the inbound DXF-to-GLB converter and `ifcIngest.ts` for the assumed conventions before choosing).
- IfcOpenShell (or equivalent) selection and whether IFC authoring runs in the Python worker alongside pysheds or as a separate service.
- Whether Layer 0 lands as a standalone reviewed PR before Layer 1/2 begin (recommended: it is a real defect fix with value on its own and de-risks the paid exposure), even though the overall build ships mesh and IFC together.
- Deconfliction result from the master planning agent before any repo is touched.
