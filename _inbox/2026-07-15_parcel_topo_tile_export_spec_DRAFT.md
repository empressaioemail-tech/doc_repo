---
id: 2026-07-15_parcel_topo_tile_export_spec
title: On-demand parcel topo tile plus importable-geometry export — isolated spec
status: superseded
last_updated: 2026-07-15
applies_to: revit-connector
owner: planner
related: [2026-07-15_parcel_mesh_ifc_tile_spec, 55_spine_data_intelligence_stack, 08_tiered_access_model, 41_revit_connector]
---

> SUPERSEDED 2026-07-15 by [`2026-07-15_parcel_mesh_ifc_tile_spec_DRAFT.md`](2026-07-15_parcel_mesh_ifc_tile_spec_DRAFT.md), which expands this trimmed-scope draft to the full mesh-plus-IFC vision. Retained for scope-history reconciliation only; do not build from this draft.

# On-demand parcel topo tile plus importable-geometry export

Isolated spec. Scoped as a component on the existing map-gate tile library, not a new pipeline or brand. Written to hand to a build agent. Grounded against live main as of 2026-07-15; the "already exists" and "does not exist" claims below are traced to source, not to prior doc-state.

## Vision

Given a parcel ID or address, return georeferenced terrain geometry sourced from public elevation and parcel data, exposed as a tile-library component and callable tool, with a coverage-honest confidence signal, and exportable as a Z-preserved importable file (DXF contours first). Replaces the manual 20-to-45-minute per-parcel QGIS walkthrough with a tool call.

## What already exists on live main (do not rebuild)

The assembly this feature needs is already running engine-side and exposed through the map gate. Confirmed in source:

- Elevation and DEM: `usgs-ned.ts` (point elevation, USGS EPQS) and `usgs3dep.ts` (10m / 1m-where-lidar DEM raster, 3DEP ImageServer). All elevation is USGS 3DEP; no OpenTopography, no dedicated TNM Access API client.
- Contours: `siteTopographyIngest.ts`, geotiff to d3-contour at 5m interval, clipped to parcel plus upstream catchment. Live.
- Parcel boundary: county-GIS ArcGIS (`brokerageTxParcels.ts`: Travis, Williamson, Bexar, Bastrop, Caldwell) plus the `cad_property` roll store (~1.07M rows / 5 counties). TxGIO for Hays/Comal in flight on `feat/txgio-parcel-geometry`.
- Map gate: six tools live and probed 6/6 on the deployed four-gate revision, including `get_parcel_polygon`, `get_site_topography`, `get_site_drainage`, `assemble_map_layers`.
- IFC ingest (inbound only): `ifcIngest.ts`, wrapped as `cortex_ifc_ingest`.

The clip, reproject, parcel-fetch, and contour steps are done. This feature is an export and coverage-honesty layer over that, plus tile registration. It is not a new clip/reproject/contour pipeline. Naming it as a fresh `generate_parcel_mesh` tool risks duplicating the assembly; build it as an export path on the existing topo assembly.

## What does NOT exist (the actual work)

1. Importable-geometry export. The engine produces contour geometry as atoms/read-model, not as a downloadable CAD file. No DXF/DWG export, no TIN, no point-cloud/LAS. The only 3D mesh in the product is the Three.js viewer, fed by manually-uploaded DXF converted to GLB, i.e. inbound and manual, not from the USGS raster. Outbound generation to an importable file is the gap.
2. Coverage-honest confidence on the topo output. This is load-bearing and is a prerequisite for paid exposure, not a polish item. The engine robustness audit flags the DEM path HIGH-severity: resolution is not coverage-aware (silently interpolates 10m where no lidar), nodata cells are replaced with `minElevation` before contouring (spurious contours at data/nodata boundaries), and `nodataCount` is computed but never projected to the read model. Today the topo output cannot honestly say where it is real lidar versus interpolated. Per structural commitment 1 every output carries source citation and confidence regardless of tier, with no geometry carve-out, and per commitment 2 confidence must never be a bare or unearned number presented as earned. Shipping an interpolated mesh with an asserted-earned confidence would violate both. So the confidence signal must encode source resolution (10m vs 1m), coverage honesty (measured vs interpolated, from the already-computed `nodataCount`), and DEM collection date.
3. Tile registration. Register the parcel-plus-topo assembly as a tile-library component alongside the existing six, with export as a property of the tile.

## Scope — v1

In:
- A tile-library component (map gate) that assembles parcel boundary plus topo for a parcel ID or address, reusing the live assembly. No new clip/reproject/contour code.
- DXF-with-Z contour export. Serialization over geometry already produced at 5m interval; contour interval a parameter.
- Coverage-honesty fix on the topo path: surface `nodataCount`, stop the `minElevation` nodata substitution from producing boundary artifacts, and attach source-resolution + collection-date + confidence to the exported output. This fix is in scope because the export cannot be a compliant Layer 2 output without it.
- Provenance packaging on the exported file: source dataset, collection date, generation timestamp, confidence, coverage note.

Out (explicitly deferred, name them so they are not silently assumed):
- IFC / DWG authoring. Needs a real BIM library (IfcOpenShell or equivalent); the stack ingests IFC but authors none. Own funded effort, v2+.
- TIN / triangulated mesh. Moderate lift over the existing DEM; second, after DXF contours prove the surface.
- Point cloud / LAS / LAZ. Zero handling today; net-new ingestion and output. Not v1.
- Proactive push / versioned service with state (see below).

## Inputs

Parcel ID or address; target CRS (default by county/region); output format (v1: DXF contours only, structured to add TIN/mesh later); buffer distance; contour interval.

## Output

Z-preserved DXF contour file, packaged with provenance metadata (source dataset, DEM collection date, confidence, coverage-honesty note, generation timestamp). Confidence is not asserted flat; it reflects source resolution and measured-vs-interpolated coverage.

## Statefulness

Stateless tool call in v1. The assembly is deterministic per input (parcel + DEM + params to geometry). Because the four-signal requirement already stamps DEM collection date and confidence into the output, re-running when new lidar lands is just a fresh call yielding a fresh output with a newer collection date and higher confidence. Versioning falls out of provenance for free; no state machine. A proactive push-on-new-collection service is a v2 question, not a v1 requirement.

## Placement and tier

Empressa product surface (Cortex / Revit Connector), backed by the Hauska map-gate tool. Not a new brand or naming surface. Consistent with settled architecture (ADR-008).

Tier: raw 3DEP data stays Layer 1 free. The tier model explicitly forbids reselling assembled raw federal data as a paid SKU (that would break commitment 1), so this is not priced as packaged USGS data. What is Layer 2 is the reasoning-and-convenience layer: the assembled, coverage-honest, confidence-scored, import-ready deliverable and the QGIS time it removes. Price as an architect-facing per-use / per-parcel Cortex feature; the reciprocal-Revit-flow infrastructure benefit (engine-to-Revit, closing the outbound gap named as the largest time-cost gap in the doc set) is a bonus, not the price story.

## Sequencing

Not on the current critical path (calibration M1 lineage, then engine auth-gate enforce, then setback-corpus fan-out, then OSSF Comal PoC). Does not displace any of those and should not. Strong candidate for the lane right after the auth-gate enforce lands: it monetizes already-built, mostly-idle substrate, which is unusually cheap leverage. Per the focus-queue rule, scheduling it means naming what it queues behind; it queues behind the named critical path, not ahead of it. It does not touch 51 (shipped/rolled-forward), 11a Bastrop (live/maintenance), or 30a SmartCity (walled off).

## Acceptance

- A parcel ID or address returns a Z-preserved DXF contour file via the map-gate tool.
- The output carries all four quality-gate signals; confidence encodes source resolution and measured-vs-interpolated coverage, not a flat asserted number.
- Coverage-honesty fix verified: interpolated-vs-lidar is distinguishable in the output, and the nodata-boundary spurious-contour artifact is gone.
- Registered as a tile-library component; export is a property of the tile.
- Works for a no-relationship jurisdiction through the uniform public-record path (no special data access).

## Open items for the build agent to resolve

- Exact DXF layer/Z convention the Revit/CAD import side expects (check the inbound DXF-to-GLB converter and the Revit Connector's IFC ingest for the assumed conventions before picking one).
- Whether the coverage-honesty fix ships as a standalone engine PR first (it improves the existing topo tile independent of export) or bundled with the exporter. Recommend standalone-first: it is a real defect fix with value on its own and de-risks the paid exposure.
