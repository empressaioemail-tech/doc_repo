---
id: 2026-07-15_parcel_mesh_ifc_build_complete_handoff
title: Parcel mesh/IFC build complete — merge-sequencing handoff
status: draft
last_updated: 2026-07-15
applies_to: portfolio
owner: planner
related: [2026-07-15_parcel_mesh_ifc_tile_spec, 2026-07-15_layer3_coordination_flag]
---

# Parcel mesh/IFC build complete — handoff to the master planning agent

The on-demand parcel terrain mesh + IFC feature (spec: `_inbox/2026-07-15_parcel_mesh_ifc_tile_spec_DRAFT.md`) is code-complete, adversarially reviewed, and committed to per-repo feature branches. Nothing pushed, nothing merged, nothing deployed. This handoff is what you need to sequence the merge later without re-deriving state.

## What shipped

Parcel in (engagement id / address) -> georeferenced 3D terrain mesh (GLB) + schema-valid IFC4 model out, callable as a map-gate MCP tool and surfaced in a command-center tile. Four layers:

- Layer 0 — DEM coverage-honesty. Nodata boundary no longer emits phantom contours; nodataCount + coverageFraction + an asserted WidthedConfidence reach the read model; EPQS rasterId captured; actual-vs-requested 3DEP resolution split honestly. Applied to BOTH byte-identical copies of usgs3dep.ts / usgs-ned.ts (engine + ldt).
- Layer 1 — terrain mesh GLB. Gridded triangle mesh from the DEM in local-ENU metres (not degrees), reusing the existing @gltf-transform GLB writer, compacted vertex buffer so accessor bounds are honest (no phantom Z=0 floor on nodata parcels), nodata triangles skipped (holes, no flat floor).
- Layer 2 — IFC authoring. New ifcopenshell Python worker (sibling to the pysheds worker, stdin-JSON/stdout-JSON) authoring schema-valid IFC4 IfcTriangulatedFaceSet from the SAME geometry as the GLB, with provenance + confidence Psets, an honest named CRS (EPSG:4326) and NO active IfcMapConversion (so no consumer can be placed off-planet). Rejects malformed geometry with a structured error.
- Layer 3 — surface. generate_parcel_terrain_model registered under the map gate (map tools 6 -> 7). Self-contained local-override command-center tile (LiveMapTile pattern) that always shows confidence WITH provenance, never a bare number.

## Branches to open PRs from (one commit each, off the noted base)

| Repo | Branch | Base (origin/main at build time) | Files |
|---|---|---|---|
| hauska-engine | feat/dem-coverage-honesty | f1f1da1 | 2 (usgs3dep.ts, usgs-ned.ts) |
| legacy-design-tools | feat/dem-coverage-honesty | was c5cfae41, main since moved to f3900920 (your #261) | site-context + api-server libs, new artifacts/ifc-worker/ |
| hauska-mcp-server | feat/parcel-terrain-model-tool | 0910d76 | 5 (product-gates, tool-copy, tools, legacy-client, atom-shape) |
| hauska-map | feat/parcel-terrain-tile | 4ac0e77 | tileRegistry + new ParcelTerrainTile.tsx/.test.tsx |

Note the ldt base moved under us (your address-point ingest #261 merged to main). Our branch does not touch cad-ingest, so a rebase onto current main is clean; do it before opening the PR.

## Merge sequence (your two coordination points, honored)

1. The engine PR (feat/dem-coverage-honesty on hauska-engine) touches engine adapter code. Per your note, sequence the auth-gate enforce flip AFTER this merges, not interleaved. Flag when you open it.
2. The hauska-map tile: you have a command-center completion pass warming. This tile registers under id "parcel-terrain-model" in TILE_COMPONENTS; if your completion pass touches tileRegistry.tsx, reconcile the registry map at merge.
3. Recommended order: engine (Layer 0) and ldt (Layers 0-2) first (the substrate), then mcp-server (the tool), then hauska-map (the tile). The tile is inert until step 4.
4. FOLLOW-ON (not in this build): the tile stays dormant until a "parcel-terrain-model" capability is added to @empressaio/cortex-client with mcpTools: ["generate_parcel_terrain_model"]. That is a cortex-client change in whatever repo houses that package (unresolved location — you flagged you don't have it either). Until then the TILE_COMPONENTS entry is wired but ALL_TILES won't surface it.

## Verification boundaries (what is proven where)

Proven locally against real artifacts this session:
- Layer 0 coverage/confidence logic: 8 unit tests, confidence is a real branded WidthedConfidence.
- Layer 1 mesh: 11 unit tests incl. georef-in-metres, nodata holes, GLB round-trip, accessor-bounds guard, row-orientation guard.
- Layer 2 IFC: 9 python tests + real ifcopenshell 0.8.5 authoring + ifcopenshell.validate returning ZERO schema errors; driven end-to-end via the worker's real stdin/stdout contract.
- Layer 3: mcp-server tsc clean + 369/369 suite; tile 7 tests incl. the bare-number confidence guard; cross-repo arg + product-header match verified by trace (engagementId + map).
- END-TO-END SEAM: mesh geometry -> real IFC worker -> valid IFC4 with matching vertex/triangle counts and both Psets (SEAM OK).

CI/deploy-validated by design, NOT run locally (no Postgres, no deploy here):
- The DB-backed site-topography-ingest integration tests (mesh/IFC best-effort steps 5.5/5.6) compile and mock the worker; they run in CI.
- The live tile-through-deployed-MCP call (the tile hitting the real deployed map gate) is a post-deploy check.

Deferred follow-ons (named, not silently dropped):
- Full three.js GLB 3D viewer in the tile (v1 shows metadata + download refs).
- sourceRasterId is threaded to the read model but is null on the raster path; a future EPQS-point or 3DEP f=json probe fills it (resolution axis carries no discriminating power until then).
- resolutionMetersActual is always null on 3DEP /exportImage, so the confidence -0.15 unmeasured-resolution penalty is currently a constant; wired to activate when a measured resolution lands.
- ldt parcel resolver still leads PARCEL_LAYER_KINDS_BY_PRIORITY with "regrid-parcel" (Regrid was purged) — pre-existing, not in this build's scope, flagged for your queue.

## New operational dependency (for the deploy sequence, when it comes)

The ldt deploy now needs a Python IFC worker sidecar: artifacts/ifc-worker/ (python:3.11-slim + libgomp1/libstdc++6, ifcopenshell + numpy). Mirrors the existing hydrology-worker deploy shape. The Node side spawns it via ifcWorkerClient.ts (IFC_PYTHON / IFC_WORKER_TIMEOUT_MS env). Best-effort: if the sidecar is absent, IFC is skipped and the mesh/contour output still lands, so it is not a hard deploy blocker, but IFC output is absent until the sidecar ships.
