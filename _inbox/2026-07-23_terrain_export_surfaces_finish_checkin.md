---
id: 2026-07-23_terrain_export_surfaces_finish_checkin
title: Finish check-in — terrain-export surfaces + cortex I-A retirement (WDLL 7–9)
status: awaiting_operator_review
date: 2026-07-23
last_updated: 2026-07-24
applies_to: legacy-design-tools, hauska-map (command-center + property-explorer), hauska-mcp-server, hauska-engine
related: [2026-07-23_terrain_ifc_spine_lift_WDLL, 2026-07-23_GATE_X_checkin_terrain_export_spine, 2026-07-23_GATE_Y_checkin_terrain_export_sdk]
owner: nick
---

# Finish check-in — terrain-export surfaces (WDLL items 7–9)

Gate Y GO unlocked reversible surface/retirement work. Items 7–9 shipped, redeployed, and live-proven on parcel `48021:27303`. **Hand back for operator review.**

## Live links (operator use from the map)

| Surface | URL | How to reach terrain export |
|---|---|---|
| **Command Center** | https://cmdcenter-blush.vercel.app/ | Edit layout → Add tile → **Parcel Terrain Model** → enter `48021:27303` → format → **Refresh terrain export** |
| **Property Explorer** | https://property-explorer-xi.vercel.app/?parcelNodeId=48021:27303 | Inspect card section **Terrain export · public-paid** → format → **Export terrain** (requires signed-in paid entitlement; anon BFF returns 401) |

Deep-link note: PE lookup uses `?parcelNodeId=` (or `?parcel=`), not `?lookup=`.

## PR URLs + merge SHAs

| Item | Repo | PR | Merge SHA | Deploy |
|---|---|---|---|---|
| 7 I-A | legacy-design-tools | https://github.com/empressaioemail-tech/legacy-design-tools/pull/352 | `10c6d962d76533cf3177017d72139ac7ff63a173` | cortex-api **`00432-bob` @ 100%** |
| 9 PE | hauska-map | https://github.com/empressaioemail-tech/hauska-map/pull/51 | `0da893e2029a31401abca06134a45d4e097d1923` | Vercel property-explorer-xi READY |
| 8 CC | hauska-map | https://github.com/empressaioemail-tech/hauska-map/pull/52 | `d393b909ced92d4d99fd5aa8d89432ac1f3b9100` | Vercel cmdcenter-blush READY |

Spine stack (unchanged from Gate Y): engine `hauska-engine-api-00067-koy`, MCP `hauska-mcp-server-00027-d95`, contract `@empressaio/atom-contract@1.10.0`, GCS `gs://hauska-prod-497015-terrain-exports`.

## Item 7 — Cortex terrain mesh/IFC retired (I-A)

Live GET (cortex-api `00432-bob`):

```
GET /api/brokerage/v1/place/48021%3A27303/site-topography/mesh
HTTP 410
{"status":"gone","reason":"Cortex terrain mesh/IFC authoring retired. Use spine refresh_parcel_terrain_export for terrain deliverables.","replacement":"refresh_parcel_terrain_export"}

GET .../site-topography/ifc → same 410
```

Grep-clean on `origin/main` under `artifacts/api-server`: no live `runIfcWorker` / `buildTerrainMeshInWorker` / `siteTopographyMesh` / `terrainMeshWorker` / `ifc-worker` authoring. Sole remaining match is the CI anti-zombie regex in `antiZombieConfidence.test.ts` (intentional gate). Contour/DEM ingest for drainage retained. Dual-serve of mesh/IFC is gone (410 pointer only).

## Item 8 — Command Center Parcel Terrain Model

Live proof (browser, 2026-07-24):

- Tile in ALL_TILES picker as **Add Parcel Terrain Model** (`parcel-terrain-model` from `@empressaio/cortex-client` ≥ 0.1.3).
- Input: `Parcel id (county_fips:prop_id)` placeholder `48021:27303` (not engagement-only).
- Format radios: GLB / IFC4 / DXF 3DFACE / DXF contour; LandXML TIN disabled (deferred).
- Refresh on `48021:27303` / GLB returned live atom:

```
Selected: glb · 48021:27303
Download GLB (35528 bytes)
glb / ifc / dxf-3dface / dxf-contour available (vertices 1012 / triangles 1890 match on face formats)
landxml-tin deferred
SOURCE USGS 3DEP
CONFIDENCE 0.60 … DEM fetch auto-tightened to 1m/px (requested 10m/px for 16px floor)
Source: USGS 3DEP. One SDK meter consumed per export request.
Layer 2 paid export (public-paid).
```

## Item 9 — Property Explorer paid export

Live proof (browser + BFF):

- Inspect card on `48021:27303` shows **Terrain export · public-paid** with format picker (GLB / IFC4 / DXF 3DFACE / DXF contour; LandXML deferred) and **Export terrain**.
- Bundle contains terrain export strings (`/assets/index-D7ZLPhFQ.js`).
- Unauthenticated POST `/api/pe-terrain-export` → **401** `authentication_required` / "Sign in to export parcel terrain." (paid gate held at surface).
- Spine path still serves the same parcel via surface MCP key: `refresh_parcel_terrain_export` → `parcelNodeId=48021:27303`, `accessPolicy=public-paid`, `gcs://` artifacts, USGS citation (same stack as Gate Y).

Operator action for a full PE download click: sign in with a paid-entitled PE session, then Export terrain on the inspect card.

### Hotfix 2026-07-24 — download `gate_front_context_required`

Export refresh worked; Download link hit engine-api without valid gate-front headers (`X-Hauska-Product: public`, wrong package header). Fixed in [hauska-map #53](https://github.com/empressaioemail-tech/hauska-map/pull/53) (`e8952fe`); PE prod redeployed (`dpl_6pHd3pUGjj1ZwCewziUvXSyd9eNA`). Live unauth download now returns session `401 authentication_required` (not engine gate error). Retry Export → Download on `48021:27303`.

### Follow-up 2026-07-24 — DXF HEADER for Revit (WDLL item 10)

Bare ENTITIES-only DXF caused Revit Import CAD "ActiveX / proprietary" blank. Engine [hauska-engine #109](https://github.com/empressaioemail-tech/hauska-engine/pull/109) → revision **`hauska-engine-api-00069-rey` @ 100%**: contour/3DFACE DXF now include `$ACADVER=AC1015`, `$INSUNITS=6` (meters), LAYER tables. Docs: `packages/engine-core/src/parcel-terrain/CAD_IMPORT.md`. PE hint [map #54](https://github.com/empressaioemail-tech/hauska-map/pull/54). Live prove: refresh `48021:27303` contour download starts with HEADER/AC1015/INSUNITS=6.

**Operator retry:** Export DXF contour again on PE (must refresh to get new file), then in Revit use **Link CAD** into a **floor/site plan** (not Drafting View), units **meters**.

### Follow-up 2026-07-24b — Revit still failing after HEADER

HEADER alone was insufficient. Second fix [hauska-engine #110](https://github.com/empressaioemail-tech/hauska-engine/pull/110) → **`hauska-engine-api-00071-bub` @ 100%**:
- Define `LTYPE CONTINUOUS` before LAYER (was referenced but undefined)
- Empty `BLOCKS` section
- Contours as closed 3D `POLYLINE` + `VERTEX` (Z) + `SEQEND` (not elevated LWPOLYLINE)

**Operator retry (critical):**
1. Hard refresh PE → Export DXF contour again (must be the POLYLINE file).
2. Revit: **Insert → Link CAD** (not Import — Import is what shows the ActiveX dialog).
3. Site/floor plan, units **meters**.
4. After link: **Zoom to Fit** — geometry is only ~45 m local near the origin, easy to miss on a large aerial site.

### Follow-up 2026-07-24c — full R2000 via ezdxf (product path)

#110 still failed Link CAD. Root cause: incomplete AC1015 (no handles / BLOCK_RECORD / OBJECTS). Engine [hauska-engine #111](https://github.com/empressaioemail-tech/hauska-engine/pull/111) → **`hauska-engine-api-00073-qeh` @ 100%** (`terrain-export-3e0edaa`): `artifacts/dxf-worker` (ezdxf) writes both `dxf-contour` and `dxf-3dface`.

Live prove after refresh `48021:27303`:
- contour 147253 B: AC1015, INSUNITS=6, BLOCK_RECORD, *Model_Space/*Paper_Space, OBJECTS, LAYOUT, handles, POLYLINE+VERTEX, no LWPOLYLINE
- 3dface 645780 B: same R2000 spine + 3DFACE
- samples: `_inbox/2026-07-23_gate_x_terrain_samples/48021_27303_ezdxf_contour.dxf` (+ `_3dface`)

**Operator retry (this is the product bar):** hard-refresh PE → Export DXF contour → Link CAD in Revit with **no** AutoCAD open/save. Zoom to Fit after link.

### Follow-up 2026-07-24d — IFC spatial hierarchy (real defect)

Planner diagnosis: Revit "Elements Lost" was driven by an incomplete IFC model, not a DXF quirk. Live BEFORE sample had Project + floating `IfcGeographicElement` only (Site/aggregates/containment/placement/MapConversion all zero).

Engine [hauska-engine #112](https://github.com/empressaioemail-tech/hauska-engine/pull/112) → **`hauska-engine-api-00075-vih` @ 100%** (`terrain-export-1ece8bc`):
- Authors `IfcProject → IfcRelAggregates → IfcSite` (RefLat/RefLong + `IfcMapConversion` to local-ENU metres) → `IfcRelContainedInSpatialStructure` → placed `IfcGeographicElement` (`IfcTriangulatedFaceSet`)
- Fail-closed: worker assert + `artifacts/ifc-worker/validate_spatial.py` (old file exits 1)

Fresh samples on `48021:27303`:
- `_inbox/2026-07-23_gate_x_terrain_samples/48021_27303_COMPLETE_hierarchy.ifc`
- `_inbox/2026-07-23_gate_x_terrain_samples/48021_27303_ezdxf_contour.dxf`
- `_inbox/2026-07-23_gate_x_terrain_samples/48021_27303_ezdxf_3dface.dxf`
- BEFORE (fails validation): `48021_27303_BEFORE_hierarchy.ifc`

**Spatial-tree assertion (AFTER, live refresh):**

```json
{
  "counts": {
    "IfcProject": 1,
    "IfcSite": 1,
    "IfcRelAggregates": 1,
    "IfcRelContainedInSpatialStructure": 1,
    "IfcLocalPlacement": 2,
    "IfcGeographicElement": 1,
    "IfcMapConversion": 1,
    "IfcProjectedCRS": 1,
    "IfcTriangulatedFaceSet": 1
  },
  "projectAggregatesSite": true,
  "siteContainsElement": true,
  "elementHasPlacement": true,
  "siteHasPlacement": true,
  "ok": true,
  "errors": []
}
```

**Operator product bar (no workarounds):**
1. Hard refresh PE on `48021:27303` → Export **IFC** (and DXF if retrying Link CAD).
2. Revit: **File → Open / Link IFC** — terrain must be **visible and placed** (not Elements Lost / empty).
3. DXF: Link CAD as before; Zoom to Fit; do **not** AutoCAD re-save.
4. Alternate viewers / CAD round-trip do not count.

### Follow-up 2026-07-24e — NAVD88 + elevation integrity (WDLL item 12)

Engine [#113](https://github.com/empressaioemail-tech/hauska-engine/pull/113) + [#114](https://github.com/empressaioemail-tech/hauska-engine/pull/114):

- IFC `IfcProjectedCRS.VerticalDatum = NAVD88`; Site/CRS descriptions state orthometric metres (USGS 3DEP).
- DXF group-999 comments declare NAVD88 orthometric metres; `$EXTMIN`/`$EXTMAX` patched to real modelspace bbox (ezdxf.write was resetting 1e20 sentinels — that false min was the misleading “0.0”).
- DEM parse: GDAL nodata + zero-fill on elevated land → NaN (skipped); `assertTerrainElevationIntegrity` fails closed on nodata-as-zero spikes before emit.
- Live refresh `48021:27303` provenance: `Z=NAVD88 orthometric metres…; mesh Z band [145.488, 151.514] m`
- Samples: `48021_27303_NAVD88.ifc`, `_NAVD88_3dface.dxf`, `_NAVD88_contour.dxf`

Entity Z prove (ifc + 3DFACE): min 145.488 / max 151.514 / zeros 0. VerticalDatum `NAVD88`.

## Deferred / follow-ups (not blockers)

- LandXML TIN: deferred (reason holds — no second TIN triangulation).
- IFC `IfcMapConversion` georef rigor: logged follow-up (named EPSG:4326 accepted at Gate X).
- `TXGIO_DATABASE_URL` ← `CORTEX_DATABASE_URL` cross-project coupling: noted, not fixed this wave.

## WDLL grades (items 7–9)

| # | Grade | Evidence |
|---|---|---|
| 7 | MET | cortex `00432-bob` 410 on mesh/ifc; grep-clean live authoring; PR #352 |
| 8 | MET | CC tile in ALL_TILES; property-id + format; live refresh on `48021:27303`; URL above |
| 9 | MET | PE inspect card public-paid export UI live; BFF auth gate; spine atom proven; URL above |

## Operator review ask

Confirm from the live links above: CC download works for your key path; PE Export terrain succeeds after sign-in on `48021:27303`. Reply GO to close the WDLL finish card, or name any surface defect.
