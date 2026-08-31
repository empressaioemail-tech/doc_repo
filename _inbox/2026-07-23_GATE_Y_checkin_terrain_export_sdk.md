---
id: 2026-07-23_GATE_Y_checkin_terrain_export_sdk
title: GATE Y check-in — terrain-export MCP public-paid + one SDK meter
status: go
date: 2026-07-23
last_updated: 2026-07-23
operator_go: 2026-07-23 (planner live verify — MCP 00027-d95, engine 00067-koy, anon withhold, GCS + adaptive bars, one meter)
applies_to: hauska-mcp-server, hauska-engine, hauska-sdk
related: [2026-07-23_terrain_ifc_spine_lift_WDLL, 2026-07-23_GATE_X_checkin_terrain_export_spine, 2026-07-23_gate_x_go_phase2_pre_gate_y_requirements]
owner: nick
---

# GATE Y check-in — terrain-export SDK money boundary

WDLL items 5–6. Planner live verify. **Operator GO 2026-07-23.** Items 7–9 unlocked (reversible surface/retirement; no further stop gate).

## Verdict

Catalog tool `refresh_parcel_terrain_export` is live on MCP `00027-d95`. Anonymous/free are denied. Paid `developer_pro` / product `public` authorizes via SDK **once per export request**. Engine pre–Gate-Y bars cleared. USGS I-K N/A. **Gate Y: GO.**

## Stack under test

| Layer | Value |
|---|---|
| Engine | `hauska-engine-api-00067-koy` @ 100% (tags `terrain-gate-y`, `envelope-canary`) — merge `e5d649d` (#107) |
| Artifact bucket | `gs://hauska-prod-497015-terrain-exports` (SA objectAdmin) |
| Engine env | `TERRAIN_ARTIFACT_BUCKET=hauska-prod-497015-terrain-exports`; `TXGIO_DATABASE_URL`←`CORTEX_DATABASE_URL` (noted, not fixed) |
| MCP | `hauska-mcp-server-00027-d95` @ 100% — merge `97db556` (#47); `SDK_METERING=1`; `HAUSKA_ENGINE_API_URL` preserved |
| Contract | `@empressaio/atom-contract@1.10.0` (unchanged) |

## Pre–Gate-Y requirements (live)

### Adaptive resolution

```
POST /v1/property-nodes/48021:27303/terrain-export/refresh
Body: {}   # default requested 10m
HTTP 201
coverage.resolutionMetersRequested=10
confidence.provenance includes: "DEM fetch auto-tightened to 1m/px (requested 10m/px for 16px floor)"
```

### GCS durable artifacts

```
glb.ref=gcs://hauska-prod-497015-terrain-exports/terrain/48021_27303/glb/e6fe2195…
GET .../download?format=glb → 200, 35528 bytes, Content-Type=model/gltf-binary
gsutil ls shows glb / ifc / dxf-3dface / dxf-contour objects under terrain/48021_27303/
```

## MCP live evidence

### Anonymous deny

```
POST /mcp tools/call refresh_parcel_terrain_export
(no X-Hauska-Key)
isError=true
text="refresh_parcel_terrain_export requires a paid X-Hauska-Key (public-paid). Anonymous and free tiers cannot refresh terrain exports."
```

### Paid authorize + serve (one meter)

Probe key minted then revoked: `key_id=57606c03-9253-406a-84c6-fcf8ab49c35f`, product `public`, tier `developer_pro`.

```
POST /mcp tools/call refresh_parcel_terrain_export
arguments: { parcel_node_id: "48021:27303", format: "glb" }
X-Hauska-Key: <revoked>
HTTP 200 / SSE message
data.parcelNodeId=48021:27303
data.atom.accessPolicy=public-paid
data.atom.sourceCitation=USGS 3DEP
data.atom.artifacts: glb/ifc/dxf-3dface/dxf-contour with gcs:// refs; landxml-tin deferred=true
```

Cloud Logging on revision `00027-d95` (verbatim fields):

```
event=sdk_metering_authorize
tool=refresh_parcel_terrain_export
key_id=57606c03-9253-406a-84c6-fcf8ab49c35f
mcp_tier=developer_pro
sdk_tier=builder
allowed=true
usage=1
quota=1000
overage=false
product=public
```

**Metering ruling restated:** one `authorizeCall` / one usage increment for this export request, even though the response includes the full multi-format artifact map (and optional format download). Not per-format.

## LandXML deferral (reason holds)

```
landxml-tin.deferred=true
deferredReason: "LandXML TIN writer is deferred; this phase ships the shared mesh and required GLB/IFC/DXF emitters without inventing a second TIN triangulation."
```

Accepted at Gate X GO; still honest on live Gate Y payload.

## Georef-rigor follow-up (logged, not a Gate Y blocker)

IFC4 ships `IfcProjectedCRS` named `EPSG:4326` with **no** `IfcMapConversion`. Mesh coordinates are local ENU metres from bbox SW. BIM tools that expect projected-metre placement need a future IfcMapConversion (or equivalent) rigor pass — tracked outside Gate Y.

## I-K (USGS)

USGS 3DEP DEM is public-domain reference field input (not atomized). Inbound royalty / source-obligation meter: **N/A**.

## What this check-in does NOT authorize

- Cortex terrain-IFC authoring retirement (WDLL item 7)
- Command Center tile flip (item 8)
- Property Explorer paid export surface (item 9)
- Product marketing / public paywall messaging beyond the live MCP gate already proven

## WDLL grade (items 5–6)

| # | Item | Grade | Evidence |
|---|---|---|---|
| 5 | Catalog tool `public-paid` + format param | **AWAITING OPERATOR GO** | tool live; anon denied; paid serves atom+formats |
| 6 | GATE Y SDK meter once per export | **AWAITING OPERATOR GO** | `sdk_metering_authorize` usage=1 for `refresh_parcel_terrain_export` |

## Operator go criteria

Approve Gate Y if the one-meter-per-export trace and anonymous withhold are acceptable. On go, items 7–9 may proceed under separate WDLL sequencing (cortex retire, then surfaces).