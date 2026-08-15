---
id: 2026-07-23_parcel_ifc_tile_land_and_deploy
title: Dispatch — surface the parcel-terrain mesh/IFC tile live in Empressa command center
status: active
date: 2026-07-23
last_updated: 2026-07-23
applies_to: [legacy-design-tools, hauska-mcp-server, hauska-map]
owner: nick
related: [2026-07-15_parcel_mesh_ifc_build_complete_handoff, 2026-07-15_parcel_mesh_ifc_tile_spec, 2026-07-23_pe_lookup_reachability_finding]
---

# Surface the parcel-terrain mesh/IFC tile live — deploy + wire dispatch

Goal (operator, 2026-07-23): a LIVE tile in the Empressa command center. Operator opens it, types a Bastrop CAD property id (`48021:27303` / `48021:27312`, no 911 address), and gets a georeferenced 3D terrain mesh + a schema-valid IFC4 model out, provenance + confidence stamped.

## Wave 0 verdict (2026-07-23) — the build is MERGED, not pending

All four feature branches MERGED 2026-07-16 (verified via recovered PR heads + `gh pr view`, fresh tmp clones):

| Repo | PR | Merged | Content |
|---|---|---|---|
| hauska-engine | #97 | 2026-07-16 | Layer 0 DEM coverage-honesty adapters |
| legacy-design-tools | #272 | 2026-07-16 | Layers 0-2: nodata fix, materializer, `artifacts/ifc-worker/` (ifcopenshell+numpy), `ifcWorkerClient.ts` |
| hauska-mcp-server | #42 | 2026-07-16 | `generate_parcel_terrain_model` under the map gate |
| hauska-map | #29 | 2026-07-16 | `parcel-terrain-model` tile |

`artifacts/ifc-worker/` is on current origin/main, intact (Dockerfile, run.py, requirements.txt pinned `ifcopenshell>=0.8.0,<0.9` + `numpy>=2.0,<3.0`, test_ifc_worker.py). No dangling files. LDT recovered-PR rebase conflicts were replay-vs-evolved-main noise (squash #272 + terrain/IFC follow-ons already on main), NOT a land blocker. The entire "merge the substrate" sequence is DONE.

So the open question is deploy + surface, not build. Merged does not equal deployed, and the tile can be merged-but-dormant.

## Wave A — live-state probe (blocks the rest; report then stop)

Determine, against DEPLOYED prod (not clones), the three things that gate operator use. Paste raw output, do not summarize.

1. Is `generate_parcel_terrain_model` live on the deployed map gate?
   - Hit the deployed hauska-mcp map-gate introspection. Expect map tools 7 including `generate_parcel_terrain_model` (was 6). Use the `X-Hauska-Key` header for the map product (wrong header silently falls to public → false negative).
   - Report: map-gate tool count + whether the tool is listed.

2. Is the IFC-worker sidecar actually RUNNING in the deployed ldt/cortex-api revision?
   - Describe the live revision's containers/env: is there an ifc-worker sidecar (mirrors hydrology-worker), and are `IFC_PYTHON` / `IFC_WORKER_TIMEOUT_MS` set? If absent, IFC is SILENTLY SKIPPED (mesh lands, IFC does not — best-effort by design).
   - If reachable, make one real `generate_parcel_terrain_model` call for a known-good deployed parcel and report whether the response carries an IFC artifact or mesh-only.

3. Did the tile ever surface in the command center?
   - Is the `parcel-terrain-model` capability present in the DEPLOYED `@empressaio/cortex-client` (authored in ldt `packages/cortex-client/`, published via ldt publish-packages workflow) with `mcpTools: ["generate_parcel_terrain_model"]`? Is the command center consuming that published version?
   - Does `parcel-terrain-model` appear in TILE_COMPONENTS AND surface in ALL_TILES on the deployed command center? (Merged tile is dormant until the cortex-client capability ships — the known follow-on.)

STOP after reporting. Planner reads the three answers and issues only the deltas that are actually missing.

## Likely remaining deltas (planner will confirm against Wave A, not assume)

Ranked by likelihood given the 2026-07-16 merge with no recorded deploy/capability-publish since:

- MOST LIKELY OPEN: the `cortex-client` `parcel-terrain-model` capability was the named follow-on in the build handoff and keeps the tile dormant until published. If Wave A confirms it absent: add the capability in ldt `packages/cortex-client/`, bump, run Publish Packages, bump the command center dep, redeploy the command center.
- LIKELY OPEN: the IFC-worker sidecar deploy. If Wave A shows mesh-only / no sidecar env: deploy the sidecar into the ldt/cortex-api revision (python:3.11-slim + libgomp1/libstdc++6 + ifcopenshell + numpy; mirrors hydrology-worker), wire `IFC_PYTHON`/`IFC_WORKER_TIMEOUT_MS`, canary sequence (deploy-canary → run-migrations → smoke → shift-traffic), env is authoritative-replace so describe-before-shift.
- PROBABLY DONE: the merges themselves. Only redeploy a repo if Wave A shows deployed < merged.

## Property-id input (operator's no-911-address requirement)

The tile must accept `county_fips:prop_id` (e.g. `48021:27303`) with no address. property-explorer PR #50 (merged, live) shipped exactly this resolver: `ParcelLookupBar` → `fetchBakedNodeFacets` / property-atoms facets → parcel node → `inspectInPlace`. Reuse that resolve chain to feed the tile's parcel input; do NOT build a second resolver. Honest miss on unknown id (never invent a neighbor parcel). Confirm during Wave A step 3 whether the command-center tile input is already wired to a `fips:prop_id` resolver or needs this graft.

## Final verify gate (planner, live, browser)

- Open the tile in the Empressa command center.
- Enter `48021:27303` (no address) → resolves the Bastrop parcel → returns mesh GLB + valid IFC4, both stamped source citation + coverage-honest confidence (never a bare number) + timestamp.
- Repeat `48021:27312`. Confirm adjacency (operator ground truth) and each IFC opens as a valid georeferenced site/terrain element.
- Unknown id → honest not-found, no fabricated parcel.

## Bastrop identifiers (verified)

- Bastrop county FIPS `48021` (traced live: `apn:48021:47822`, `48021:33512`).
- Operator's parcels: 27303, 27312 → `48021:27303`, `48021:27312`. Adjacent per operator. CAD: esearch.bastropcad.org/Property/View/27303 and /27312.

## Hazards

- Deployed != merged; check deployed revision vs merge SHA before assuming live.
- Deploy env is authoritative-replace; describe the new revision's env before shifting traffic (or the worker env reverts).
- `X-Hauska-Key` header for gate probes (Authorization Bearer silently falls to public).
- No special data access: path must work for a no-relationship jurisdiction via uniform public record (Bastrop is a customer, not a data-source licensor).
