---
id: 2026-07-23_terrain_ifc_cleanup_and_phase1_kickoff
title: Terrain-IFC program — cleanup confirmation + Phase 1 kickoff
status: active
date: 2026-07-23
applies_to: legacy-design-tools, hauska-mcp-server, hauska-engine, hauska-atom-contract
related: [2026-07-23_terrain_ifc_spine_lift_WDLL]
owner: planner
---

# Cleanup confirmation (verbatim) — before Phase 1

## Map key `f472a8ba-001b-4290-9e12-a30ac3a98a5f`

```
GET https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/admin/keys
{"key_id":"f472a8ba-001b-4290-9e12-a30ac3a98a5f","tier":"team","product":"map",...,"status":"revoked","notes":"wave0-terrain-probe-2026-07-23 REVOKED",...}
status=revoked (expect revoked)
```

DEAD. Raw key was not retained after the prior probe revoke.

## Scratch engagement `a2e0d52f-e3bd-48d7-beae-9f91beba6a00`

Note: prior probe used `a2e0d52f-…` (not `a2e0d052-…`).

```
GET /api/engagements/a2e0d52f-e3bd-48d7-beae-9f91beba6a00  → 200 active (wave0-terrain-probe-REVOKE)
DELETE /api/engagements/... → 404 (no hard-delete route)
PATCH {"status":"archived"} → 200 status=archived
PATCH {"name":"wave0-terrain-probe-PURGED"} → 200 name=wave0-terrain-probe-PURGED status=archived
```

Re-GET after purge:

```
{"id":"a2e0d52f-e3bd-48d7-beae-9f91beba6a00","name":"wave0-terrain-probe-PURGED","status":"archived",...}
```

Hard row delete is not exposed on the engagements API; archived + renamed is the available purge. Row retained only as archived inert record (no active probe surface).

## Cleanup grade (WDLL item 1)

MET — key revoked; engagement non-active (archived/PURGED).

## Premortem (program)

| Commitment | Grade | Note |
|---|---|---|
| 1 Sell reasoning | green | IFC/mesh carry citation + confidence + timestamp |
| 2 Confidence earned | green | asserted baseline with USGS 3DEP provenance (honest; earning loop not claimed) |
| 3 Cost/jurisdiction | green | DEM path already jurisdiction-agnostic |
| 4 Dual interface | green | MCP catalog-tool first; UI second |
| 5 Hauska spine | green | lift TO spine, retire cortex authoring |
| 6 Focus | green | operator-ordered program |
| 7 Quality gate | green | I-C on served atom |

Overall: green. Proceed Phase 1.

## I-K note (USGS 3DEP)

USGS 3DEP elevation is public-domain US government work. No inbound royalty meter required for DEM→mesh/IFC derivation. Gate Y will restate this with the pay-gate evidence; do not invent a source-actor obligation for 3DEP.

## Phase 1 kickoff (toward Gate X)

Pattern: same as property-reasoning envelope (`emit-buildable-envelope` + `writePropertyAtom` + `GET /property-nodes/:id/atom-chain`).

**Amendment 2026-07-23 — four emitters off ONE triangulation** (see WDLL Amendments): lift `buildTerrainMeshGeometry` once; hang `glb` / `ifc` / `dxf-3dface` / `dxf-contour` / `landxml-tin` emitters on that mesh. Atom is format-parameterized (`terrain-export` / `parcel-terrain-model`), not four atoms. Contour = elevation-interval polyline extraction (not 3DFACE). LandXML may honest-defer. Metering: one SDK event per export request (restate at Gate Y).

Deliverables before Gate X STOP:
1. Contract: derived kind with format-keyed artifact map + DEM referenced-field + `public-paid`.
2. Engine: shared mesh authoring + IFC lift + CAD emitters (3DFACE, contour; TIN ship-or-defer); resolve by `county_fips:prop_id`; persist; serve.
3. Live prove on `48021:27303` (or gold alternate): IFC4 schema-parity + downloadable samples of each shipped format for operator CAD open.
4. File Gate X check-in to doc_repo planner; WAIT.

Do not retire cortex path until Gate X go. Do not flip public-paid SDK metering until Gate Y.
