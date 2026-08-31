---
id: 2026-07-23_GATE_X_checkin_terrain_export_spine
title: GATE X check-in — terrain-export spine live (multi-format samples)
status: go
date: 2026-07-23
last_updated: 2026-07-23
operator_go: 2026-07-23 (planner verified against sample files; DXF Z/contour parity confirmed)
applies_to: hauska-engine, hauska-atom-contract
related: [2026-07-23_terrain_ifc_spine_lift_WDLL, 2026-07-23_terrain_ifc_cleanup_and_phase1_kickoff]
owner: nick
---

# GATE X check-in — terrain-export spine

WDLL items 2–4. Planner live verify. **Operator GO 2026-07-23** (sample-file inspection, not paste). Phase 2 unlocked; Gate Y still stops before pay-gate flip, cortex retirement, and CC/PE surfaces.

## Verdict

Spine authors a `public-paid` `parcel-terrain-model` from USGS 3DEP off one shared triangulation for `48021:27303`. Downloadable GLB, IFC4, DXF 3DFACE, and DXF contour samples are on disk. LandXML TIN is honestly deferred. **Gate X: GO.**

## Stack under test

| Layer | Value |
|---|---|
| Contract | `@empressaio/atom-contract@1.10.0` (PR hauska-atom-contract #9 → `02e0d53`) |
| Engine merge | hauska-engine [#105](https://github.com/empressaioemail-tech/hauska-engine/pull/105) `6b90279` + IFC fix [#106](https://github.com/empressaioemail-tech/hauska-engine/pull/106) `1f004da` |
| Image | `hauska-engine-api:terrain-export-1f004da` digest `sha256:e2deae1466d1bd9df047df02d6e14c7389b61848003e44a572b4f5b4536dea50` |
| Serving revision | `hauska-engine-api-00065-xox` @ 100% (tags `envelope-canary`, `terrain-gate-x`) |
| URL | `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app` |
| Geometry | `TXGIO_DATABASE_URL` ← secret `CORTEX_DATABASE_URL` (engine `DATABASE_URL` lacks `txgio_parcel`) |
| Artifacts | `TERRAIN_ARTIFACT_DIR=/tmp/terrain-exports` (same-instance download; durable GCS still open) |

## Live call (verbatim)

```
GET /health
{"status":"ok","service":"engine-api",...,"startedAt":"2026-07-24T02:02:47.331Z"}

POST /v1/property-nodes/48021:27303/terrain-export/refresh
Body: {"resolutionMeters":1,"contourIntervalMeters":0.5}
Gate-front headers: X-Hauska-Product=cortex, tenant=gate-x-terrain, package=terrain-export, access-tier=public-paid
HTTP 201
```

Atom highlights:

```
atomDid=pterrain_930d9f16fc5487c6
parcelNodeId=48021:27303
sourceCitation=USGS 3DEP
accessPolicy=public-paid
derivationMethod=parcel-terrain-mesh-ifc-v1
confidence={"value":0.6,"kind":"asserted","provenance":"USGS 3DEP DEM field; calibration pending","n":0,"intervalWidth":1}
geometry sourceRef=txgio-parcel:48021:27303:stratmap25-landparcels_48021_bastrop_202503
```

Artifact map (same triangulation):

| format | deferred | byteCount | vertexCount | triangleCount | notes |
|---|---|---|---|---|---|
| glb | no | 35528 | 1012 | 1890 | shared mesh |
| ifc | no | 85193 | 1012 | 1890 | IFC4 IfcTriangulatedFaceSet |
| dxf-3dface | no | 520057 | 1012 | 1890 | 1890× 3DFACE |
| dxf-contour | no | 63959 | — | — | 26× LWPOLYLINE @ 0.5 m |
| landxml-tin | **yes** | — | — | — | deferredReason named in atom |

Full refresh JSON: `_inbox/2026-07-23_gate_x_terrain_samples/refresh.json`.

## Downloadable samples (operator CAD open)

Path: `_inbox/2026-07-23_gate_x_terrain_samples/`

| File | Bytes |
|---|---|
| `48021_27303.glb.glb` | 35528 |
| `48021_27303.ifc.ifc` | 85193 |
| `48021_27303.dxf_3dface.dxf` | 520057 |
| `48021_27303.dxf_contour.dxf` | 63959 |

Live download (same instance, after refresh):

```
GET /v1/property-nodes/48021:27303/terrain-export/download?format=glb|ifc|dxf-3dface|dxf-contour
→ 200 + attachment bytes (all four formats verified)
```

## Schema / format parity checks

IFC sample:

- `FILE_SCHEMA(('IFC4'))`
- `IfcTriangulatedFaceSet` count = 1
- `IfcCartesianPointList3D` count = 1
- `IfcProjectedCRS` count = 1 (`EPSG:4326` named)
- `IfcMapConversion` count = 0

DXF:

- face file: 1890 `3DFACE` entities
- contour file: 26 `LWPOLYLINE` entities, **zero** `3DFACE`

Vertex/triangle counts match across glb / ifc / dxf-3dface (1012 / 1890).

## Honest deferrals and follow-ups (not Gate X blockers)

1. `landxml-tin` deferred with explicit reason (WDLL amendment allows).
2. Default `resolutionMeters=10` fails this small parcel (`computed raster 5x3 below 16px floor`); Gate X used `resolutionMeters=1`. Authoring should pad bbox or auto-tighten before product surfaces.
3. Artifact store is instance-local `/tmp` + in-process download. Durable GCS remains post-Gate-X hardening.
4. Engine `DATABASE_URL` is not the TxGIO store; production geometry depends on `TXGIO_DATABASE_URL` → `CORTEX_DATABASE_URL`.
5. Cortex terrain-IFC path still live (retirement is WDLL item 7, after Gate Y).

## WDLL grade (items 1–4)

| # | Item | Grade | Evidence |
|---|---|---|---|
| 1 | Cleanup | MET | prior session (key revoked; probe engagement archived) |
| 2 | Contract 1.10.0 format map | MET | npm `@empressaio/atom-contract@1.10.0` |
| 3 | Spine authors by `county_fips:prop_id` | MET | live refresh on `48021:27303` without bboxOverride; USGS citation + asserted confidence; IFC4 + CAD parity above |
| 4 | GATE X | **AWAITING OPERATOR GO** | this check-in + samples |

## Operator go criteria

Approve Gate X if the CAD samples open acceptably and the live atom shape is acceptable. On go, Phase 2 starts: MCP `public-paid` + SDK one-meter-per-export → Gate Y STOP. No cortex retirement and no CC/PE surface flip until Gate Y.