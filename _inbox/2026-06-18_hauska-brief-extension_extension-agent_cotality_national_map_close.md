# Cotality national map visual unlock — ship report (v0.6.22)

**Date:** 2026-06-18  
**Version:** `0.6.22`  
**Branch:** `extension/unified-signin-v067` (uncommitted at report time)  
**Build:** keyed `release/` + `hauska-brief-extension-v0.6.22.zip`

## Summary

Extension retargeted for **cc-agent-C Cotality national retarget** on `POST /map-data/gis-layer`. When bbox is accepted, the v0.6.21 viewport loader **auto-enables** and now renders:

- **Full-bleed Cotality SpatialTile parcel polygons** (not pin-only markers)
- **Land-use / zoning choropleth** from Property `site-location` fields joined on features (`landUseCode`, `zoningCode`, descriptions)
- **FEMA NFHL** as semi-transparent federal overlay (below parcel fills in stack)
- Click parcel → cited reasoning; hover tooltips; legend keyed to land-use + FEMA colors

Pin-intersect fallback remains when bbox probe fails (single subject parcel).

---

## Live API probe (2026-06-18)

`node scripts/probe-gis-cotality.mjs` against prod cortex-api:

| Site | Mode | Status | Features |
|------|------|--------|----------|
| Bastrop | pin parcels | 502 | 0 |
| Bastrop | bbox parcels | 400 invalid_request | 0 |
| Austin | pin parcels | 502 | 0 |
| Austin | bbox parcels | 400 invalid_request | 0 |
| Both | bbox fema | 400 | 0 |

**Conclusion:** Cotality retarget not yet live on prod for QA install / bbox contract. Extension is **ready** — mesh unlocks automatically on first successful bbox response. **Screenshots not captured** (no polygon data returned); operator should re-run probe + visual QA after cc-agent-C deploy.

---

## Extension changes

### GIS proxy (`src/lib/gis-proxy-api.js`)

| Behavior | Detail |
|----------|--------|
| Pin-intersect | `parcels` only at brief lat/lng (land-use attrs on feature) |
| Viewport mesh | `parcels` + `fema` bbox layers |
| Bbox formats | `{westLng,southLat,eastLng,northLat}` and `{west,south,east,north}` |
| Auto-enable | `probeGisBboxSupport()` probes **parcels+bbox**; sets `bboxSupported=true` on OK |
| Merge | `mergeGisSlots()` — mesh replaces pin parcel slot without dropping fema |

### Choropleth paint (`src/lib/gis-map-paint.js`)

- Parcel fill: data-driven `landUseFillColorExpr()` from Cotality codes + description keywords
- FEMA: federal purple/yellow overlay at ~48% fill opacity
- Legend palettes: `LAND_USE_LEGEND` + `FEMA_LEGEND`
- Stack order: flood → parcels (parcels on top for click targets)

### Render (`src/lib/gis-map-render.js`)

- `upsertGisLayer(map, slot, meshMode)` — higher opacity (0.78) for multi-parcel mesh
- `selectionFromParcelFeature()` — cited reasoning with Cotality provider + land-use copy
- Tooltips: address + landUseDescription + zoningCode
- Float legend: land-use swatches + FEMA overlay keys + parcel count note

### Map shell (`src/lib/site-map.js`)

- Filter **Land use (parcels)** toggles parcel choropleth
- Filter **FEMA flood** toggles federal overlay
- On map load + `moveend`: `viewportLoader.loadNow()` when bbox enabled
- Click parcel → detail panel + optional `runBriefFromAddress`

---

## Operator visual QA (after Cotality deploy)

Use **Max** account (or `map-max-qa` dev product). Verify **two addresses**:

| City | Suggested address | Expect |
|------|-------------------|--------|
| **Bastrop** | `251 Cool Water Dr, Bastrop, TX 78602` | Dense colored parcel mesh + FEMA overlay |
| **Austin** | `501 Congress Ave, Austin, TX 78701` | Same — proves **national** not Bastrop-only |

### Checklist

1. Expand Map tab → full-bleed colored parcels on `#3d2f24` brown canvas (not 0–1 pin markers)
2. Legend shows land-use colors + FEMA keys; note shows parcel count > 1
3. Pan map → mesh refreshes on viewport
4. Hover parcel → address + land use tooltip
5. Click parcel → cited reasoning in detail strip
6. Toggle FEMA filter → flood overlay hides/shows
7. Full-screen + float chat still work (v0.6.21)

### Capture screenshots (when live)

Save to this folder or attach to follow-up close:

- `bastrop-mesh-docked.png` — Bastrop full-bleed colored mesh, docked
- `austin-mesh-docked.png` — Austin full-bleed colored mesh, docked
- `bastrop-mesh-fullscreen-chat.png` — full-screen + popout chat (optional)

---

## Build

```powershell
npm run build
.\scripts\build-release.ps1
node scripts/probe-gis-cotality.mjs   # post-deploy smoke
```

| Output | Path |
|--------|------|
| Tester load | `P:\hauska-brief-extension\release` |
| Zip | `P:\hauska-brief-extension\hauska-brief-extension-v0.6.22.zip` |

---

## Screenshots

**Not attached** — prod `gis-layer` returned 502/400 on 2026-06-18 probe. Re-capture after cc-agent-C Cotality bbox deploy + Max tier active.

---

## Follow-up

1. **cc-agent-C:** ship Cotality SpatialTile bbox + Property site-location enrichment on `/gis-layer`
2. **Operator:** run probe script; confirm Bastrop + Austin feature counts > 1 on bbox
3. **extension-agent:** commit + push v0.6.22 after visual sign-off
