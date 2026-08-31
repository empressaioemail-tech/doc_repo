---
id: 2026-07-23_terrain_ifc_spine_lift_WDLL
title: WDLL — Terrain export spine lift + productize (IFC + CAD)
status: approved
date: 2026-07-23
last_updated: 2026-07-24
finish_checkin: 2026-07-23_terrain_export_surfaces_finish_checkin
applies_to: hauska-engine, hauska-atom-contract, hauska-mcp-server, hauska-sdk, legacy-design-tools, hauska-map (command-center + property-explorer)
rolls_up_to: 2026-07-23_MASTER_WDLL_property_reasoning_substrate
related: [25b_monetization_provenance_storage_stack, _architecture_homes/01_homes_and_topology, 2026-07-23_parcel_ifc_tile_land_and_deploy, 2026-07-23_terrain_ifc_cleanup_and_phase1_kickoff]
owner: nick
operator_approval: 2026-07-23 (dispatch greenlight — TERRAIN-IFC SPINE LIFT + PRODUCTIZE; CAD export amendment same day)
---

# WDLL: Terrain export spine lift + productize (IFC + CAD)

Date: 2026-07-23  Status: approved (amended)

## Done looks like

A parcel addressed as `county_fips:prop_id` returns one paid derived atom (`terrain-export` / `parcel-terrain-model`) authored in hauska-engine from a USGS 3DEP referenced DEM field (DEM not atomized). Off a SINGLE shared triangulation (`buildTerrainMeshGeometry` lifted once), four emitters produce importable artifacts that can never diverge: (1) GLB mesh, (2) IFC4 `IfcTriangulatedFaceSet`, (3) CAD 3D surface faces (DXF/DWG `3DFACE`), (4) CAD contour polylines (constant-Z polylines at elevation intervals — contour extraction, not a face dump), (5) Civil3D TIN (LandXML). Callers select format via a format parameter (`glb` | `ifc` | `dxf-3dface` | `dxf-contour` | `landxml-tin`). All formats share georeferencing (real-world XYZ + CRS), USGS-3DEP provenance, asserted confidence, and timestamp. Served through the MCP catalog-tool path under `accessPolicy: public-paid`, metered only via hauska-sdk. Command Center and Property Explorer both surface a paid multi-format export on a real parcel. Cortex engagement-scoped terrain-IFC authoring is retired (grep-clean). No TX literals in the authoring path. USGS 3DEP is public-domain — I-K inbound royalty N/A.

## Format matrix (one triangulation → N emitters)

| Format param | Artifact | Emitter class | Status at program open |
|---|---|---|---|
| `glb` | Georeferenced triangle mesh | existing (lift) | required at Gate X |
| `ifc` | IFC4 IfcTriangulatedFaceSet | existing ifcopenshell worker (lift) | required at Gate X |
| `dxf-3dface` | DXF/DWG 3DFACE surface | net-new | required at Gate X (or honest defer) |
| `dxf-contour` | DXF/DWG constant-Z contour polylines | net-new (marching-squares / equivalent) | required at Gate X; flag if non-straightforward |
| `landxml-tin` | LandXML TIN surface | net-new | ship-or-honest-defer (likeliest heavy lift) |

Hard rule: emitters hang off the shared triangulation. No separate DEM→contour or DEM→TIN pipelines that can drift from the mesh/IFC pair.

## Metering ruling (I-F)

One SDK metering event per export request (authorize once), regardless of how many format artifacts the request returns. Rationale: the paid unit is the terrain-export derivation for the parcel, not per-file bytes. If a future product wants per-format SKUs, that is a WDLL amendment — not silent. State this again at Gate Y with the live authorizeCall trace.

## Acceptance items

1. Cleanup complete. | check: probe engagement `a2e0d52f-e3bd-48d7-beae-9f91beba6a00` non-active (archived/purged); map key `f472a8ba-001b-4290-9e12-a30ac3a98a5f` status=revoked. | grade: [x] MET
2. Contract kind published (`@empressaio/atom-contract` minor bump): one derived `parcel-terrain-model` / `terrain-export` atom; DEM as referenced-field input; artifact map keyed by format param (`glb`/`ifc`/`dxf-3dface`/`dxf-contour`/`landxml-tin`); `accessPolicy` default `public-paid`; reasoning-chain idiom matches property envelope. | check: npm version + `/conformance` fixture green. | grade: [x] MET (`@empressaio/atom-contract@1.10.0`)
3. Spine authors the shared mesh + emitters live by `county_fips:prop_id`. | I-B,I-C | check: engine path on a named parcel (e.g. `48021:27303`) returns artifacts with USGS 3DEP citation + asserted confidence provenance; IFC4 schema parity (`IfcTriangulatedFaceSet`, named CRS, no active `IfcMapConversion`); GLB + IFC + at least the non-deferred CAD formats from the same triangulation (vertex/triangle counts match across face-based formats). Contour format is elevation-interval polylines, not 3DFACE. | grade: [x] MET (live `48021:27303` on `hauska-engine-api-00065-xox`; LandXML deferred)
4. GATE X passed (planner live verify). | I-I | check: Gate X check-in filed with verbatim live evidence AND downloadable samples of each shipped format on a real parcel (operator can open CAD samples before pay-gate); deferred formats named honestly if any; operator go before cortex retirement or surface flip. | grade: [x] MET — operator GO 2026-07-23 (sample-file verify)
5. Gate catalog-tool serves the atom with `public-paid` + format param (not engagement/package path). | I-F | check: MCP tool on deployed gate; anonymous/free correctly withheld; paid key authorizes via SDK once per export request. | grade: [x] MET — operator GO 2026-07-23
6. GATE Y passed (planner live verify). | I-F,I-I | check: paid export meters through SDK (one event per request); free/anonymous gated out; no bespoke charge; USGS I-K confirmed N/A. | grade: [x] MET — operator GO 2026-07-23
7. Cortex terrain-IFC authoring path retired. | I-A | check: grep-clean across ldt for IFC/mesh authoring on the live path after cutover; transitional dual-serve gone. | grade: [x] MET — cortex `00432-bob` 410 mesh/ifc → spine; PR #352 `10c6d962`
8. Command Center surfaces the tile. | check: cmdcenter on `@empressaio/cortex-client@>=0.1.3`; capability in ALL_TILES; tile accepts `county_fips:prop_id` + format picker (not engagement-only); live URL pasted. | grade: [x] MET — https://cmdcenter-blush.vercel.app/ Parcel Terrain Model; live `48021:27303` GLB 35528 B; PR #52 `d393b90`
9. Property Explorer paid export. | check: parcel inspect card offers multi-format terrain export reading the spine atom (`public-paid`); proven on a real parcel; live URL pasted. | grade: [x] MET — https://property-explorer-xi.vercel.app/?parcelNodeId=48021:27303 inspect card Terrain export · public-paid; BFF 401 anon; PR #51 `0da893e`
10. DXF Revit-importable R2000. | check: live `dxf-contour` and `dxf-3dface` are full AC1015 drawings (handles group 5, BLOCK_RECORD `*Model_Space`/`*Paper_Space`, OBJECTS/LAYOUT, `$INSUNITS=6`); CAD_IMPORT.md documents Link CAD → floor/site plan without AutoCAD round-trip. | grade: [~] PARTIAL → structure proven (#111); operator Link CAD pending (do not re-patch DXF structure)
11. IFC complete spatial model (the data-completeness fix). | check: live IFC on `48021:27303` has IfcProject→IfcRelAggregates→IfcSite (RefLat/RefLong + IfcMapConversion)→IfcRelContainedInSpatialStructure→placed IfcGeographicElement; `validate_spatial.py` ok=true; empty-tree IFC fails closed. | grade: [~] PARTIAL → spine proven on `hauska-engine-api-00075-vih` (#112 `1ece8bc`); operator Revit IFC import pending (visibility/placement)
12. Vertical datum + elevation integrity. | check: live IFC `IfcProjectedCRS.VerticalDatum=NAVD88`; DXF declares NAVD88 orthometric metres; entity Z band matches DEM (no nodata-as-zero spike); `assertTerrainElevationIntegrity` fails closed on zero spikes. | grade: [~] PARTIAL → spine proven on `00079`/`f1d3093` (#113+#114); VerticalDatum=NAVD88; entity Z [145.488, 151.514]; operator Revit confirm pending

## Dependencies (execution order)

1 → 2 → 3 → 4 (GATE X STOP) → 5 → 6 (GATE Y STOP) → 7 → 8+9 (surfaces, may parallel after Y).

## Invariants (inherited from master WDLL)

I-A anti-zombie, I-B jurisdiction-agnostic, I-C quality-gate provenance, I-F SDK money boundary, I-I verification-never-delegated, I-K source-obligation (USGS 3DEP = public-domain → N/A inbound; state in Gate Y).

## Amendments

- 2026-07-23: Export set expanded from IFC(+GLB) to four CAD/BIM formats off ONE shared triangulation; atom is format-parameterized `terrain-export`, not four atoms; one SDK meter per export request; LandXML may honest-defer without blocking the set; Gate X must surface CAD samples. Reason: operator CAD deliverable requirement (3DFACE surface, contour polylines, Civil3D TIN).
- 2026-07-23 (Gate X GO): LandXML deferral accepted (reason holds: no second TIN triangulation). IFC named `EPSG:4326` without `IfcMapConversion` accepted for gates; georef-rigor follow-up logged (projected-meter BIM placement). **Phase-2 pre–Gate-Y requirements (not deferrals):** (1) adaptive/auto DEM resolution so random parcels do not hit the 10m-fails-small-parcel trap — default self-selects or export declines honestly; (2) artifact store moves off same-instance `/tmp` to GCS-backed durable storage before paid download. `TXGIO_DATABASE_URL` cross-project coupling noted, not fixed. Metering restated: one SDK meter per export request regardless of format count.
- 2026-07-24 (post-surface operator QA): DXF emitters must ship AutoCAD 2000 HEADER (`$ACADVER=AC1015`, `$INSUNITS=6` meters) + LAYER tables so Revit Link CAD does not fail with the generic ActiveX/proprietary dialog on bare ENTITIES-only files. Document Revit path: Link CAD → floor/site plan (not Drafting View), meters. Reason: operator contour DXF import into Revit blanked after successful PE download. Acceptance addendum item 10 below.
- 2026-07-24 (Revit Link still failing after #109/#110): Hand-rolled AC1015 still missing mandatory handles, BLOCK_RECORD, and OBJECTS/LAYOUT — AutoCAD repairs on open/save; Revit does not. Item 10 raised to full R2000 via `artifacts/dxf-worker` (ezdxf). CAD round-trip is explicitly not acceptance. Reason: operator confirmed same ActiveX dialog on Link CAD after LTYPE+3D POLYLINE ship.
- 2026-07-24 (data-completeness): Primary defect was incomplete IFC scaffolding (floating GeographicElement; zero Site/aggregates/containment/placement/MapConversion). Item 11: author full Project→Site→placed terrain + IfcMapConversion; fail closed via `validate_spatial.py` / worker assert. DXF #111 left as structurally sound — remaining DXF Link issues are narrow (scale/entity import), not header patches. Reason: planner diagnosis against live samples; AutoCAD re-save / alternate software do not count.
- 2026-07-24 (elevation integrity addendum): Declare NAVD88 orthometric metres on IFC CRS + DXF comments; drop zero-fill/GDAL nodata before triangulate; assert mesh min-Z in DEM band (item 12). Reason: Z was real MSL but undeclared; apparent 0.0 min was EXTMIN sentinel / POLYLINE base — harden so a genuine void cannot ship as a 150 m spike.

## Finish card (graded at close)

Close artifact: `_inbox/2026-07-23_terrain_export_surfaces_finish_checkin.md` (awaiting operator review).

| # | Grade | One-line evidence |
|---|---|---|
| 1 | MET | engagement archived; map key revoked |
| 2 | MET | `@empressaio/atom-contract@1.10.0` |
| 3 | MET | spine authors shared mesh + emitters; LandXML deferred |
| 4 | MET | Gate X GO (operator sample-file verify) |
| 5 | MET | MCP catalog tool `public-paid`; anon withheld |
| 6 | MET | Gate Y GO (one SDK meter; GCS + adaptive bars) |
| 7 | MET | cortex mesh/IFC 410; grep-clean; `00432-bob` |
| 8 | MET | CC Parcel Terrain Model property-id; live URL |
| 9 | MET | PE inspect paid export; live URL |
| 10 | PARTIAL | DXF R2000 structure proven (#111); operator Link CAD pending |
| 11 | PARTIAL | IFC hierarchy proven on `00075-vih` (#112); operator Revit IFC import pending |
| 12 | PARTIAL | NAVD88 + Z band proven on `00079-lib` (#113+#114); operator confirm pending |

Start-vs-Finish: LandXML stayed deferred (must stamp verticalDatum=NAVD88 when shipped); IFC MapConversion + VerticalDatum lifted; DXF R2000 + IFC spatial tree + elevation integrity are the import bars.
