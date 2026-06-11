# Reproject ArcGIS/UGRC parcel geometry to WGS84 — cc-agent-C report

**Date:** 2026-06-11  
**Agent:** cc-agent-C  
**Repo:** legacy-design-tools  
**Branch:** `cortex/reproject-parcel-geometry-wgs84`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/177  
**SHA:** `c713c3db5b1d4e3e32fd86bcf9cc86f176a16849`  
**Worktree:** `P:\legacy-design-tools`

---

## Problem (verbatim canary symptom)

After #176 folded topography into Generate Layers, Moab engagement `409a3013-273f-4871-b799-bc08def01cec` showed:

```
usgs:3dep-dem failed — bbox longitudes out of WGS84 range: -12193513.438655587, -12193473.565844413
```

Those values are Web Mercator meters (≈ -109.5°W), not WGS84 degrees. UGRC parcel geometry arrives as ArcGIS `rings` with `spatialReference.wkid` 3857/102100; `extractParcelGeometryFromPayload` rewrapped rings without reprojection.

---

## Fix locations

| File | Lines | What |
|------|-------|------|
| `artifacts/api-server/src/lib/siteTopographyGeometry.ts` | 1–178 | **New module** — `webMercatorToWgs84`, `extractParcelGeometryFromPayload` (reads `spatialReference.wkid`, reprojects 3857/102100/900913), `geometryToBboxWgs84` (null + warn if \|lng\|>180 or \|lat\|>90) |
| `artifacts/api-server/src/lib/siteTopographyIngest.ts` | 72–81 | Import + re-export geometry helpers; removed inlined duplicate logic |
| `lib/adapters/src/arcgis.ts` | 47–48, 81, 95 | `outSpatialReference` param; default `outSR=4326` on every ArcGIS query |
| `lib/adapters/src/state/utah.ts` | 145 | `ugrc:parcels` explicitly requests `outSpatialReference: 4326` |
| `artifacts/api-server/src/lib/__tests__/siteTopographyGeometry.test.ts` | 1–118 | Moab Web Mercator ring → WGS84 bbox; 4326 + Regrid pass-through; un-reprojected guard |
| `lib/adapters/src/__tests__/utahAdapters.test.ts` | 35–47 | Asserts `outSR=4326` on UGRC parcels fetch URL |
| `lib/adapters/src/__tests__/federalAdapters.test.ts` | 372 | Asserts default `outSR=4326` on EPA EJScreen query |

### Reprojection helper

```typescript
// siteTopographyGeometry.ts — inverse spherical Mercator
lng = (x / 20037508.34) * 180
lat = atan(exp((y / 20037508.34) * PI)) * 360/PI - 90
```

Applied per ring vertex when `wkid ∈ {3857, 102100, 900913}`. WGS84 (4326) rings pass through as `[lng, lat]`.

---

## Local verification (verbatim)

### Typecheck

```
pnpm run typecheck   # PASS
```

### Unit tests

```
 RUN  v3.2.4 P:/legacy-design-tools/artifacts/api-server

 ✓ src/lib/__tests__/siteTopographyGeometry.test.ts (5 tests) 3ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
```

```
 RUN  v3.2.4 P:/legacy-design-tools/lib/adapters

 ✓ src/__tests__/utahAdapters.test.ts (4 tests) 8ms
```

---

## Moab topography + drainage run logs (post-merge — operator)

**Not captured in this session.** After merge → deploy-canary:

1. Generate Layers on `409a3013-…` — expect `usgs:3dep-dem ok` (bbox lng ≈ -109.5, not -12M).
2. Run drainage — expect `POST /v1/hydrology/drainage 200` and `library` field on canary with `ENGINE_SPINE_HYDROLOGY=1`.

Paste verbatim logs here after operator verification.

---

## Blockers

| Blocker | Status |
|---------|--------|
| Canary re-verify (topography + hydrology flip) | Deferred to post-merge operator steps |
| CI Test job | Pending on PR #177 push |

---

## PR

https://github.com/empressaioemail-tech/legacy-design-tools/pull/177 — held for operator merge.
