# Map level-up — ship report (v0.6.21)

**Date:** 2026-06-18  
**Version:** `0.6.21`  
**Branch:** `extension/unified-signin-v067` (uncommitted at report time)  
**Build:** keyed `release/` + `hauska-brief-extension-v0.6.21.zip`

## Scope adjustment (operator heads-up)

**GIS proxy is pin-intersect today** — single subject parcel + zoning polygon at the brief coordinates. **Full-bleed area mesh is blocked** until cc-agent-C ships bbox on `POST /map-data/gis-layer`.

This pass:
- Renders **real** pin-intersect polygons from ArcGIS proxy (`parcels` + `zoning`) — **not** Cotality/map-layers assemble
- **Does not fake** a viewport mesh
- Wires **bbox viewport loader** behind `isGisBboxMeshEnabled()` — auto-activates when cortex accepts `bbox` in request body
- Ships all **layout / UX** work independent of bbox

---

## Shipped

### 1. Pin-intersect GIS (subject parcel + zoning)

| Item | Detail |
|------|--------|
| API | `POST /api/brokerage/v1/map-data/gis-layer` with `{ layer, latitude, longitude }` |
| Layers | `parcels` → parcel boundary, `zoning` → district highlight |
| Client | `src/lib/gis-proxy-api.js` — `fetchSubjectPinLayers()` |
| Render | `src/lib/gis-map-render.js` — saturated data-driven fills (P-5/P-4/P-2 palette) |
| Canvas | `#3d2f24` brown background (`HAUSKA_GIS_BASE_STYLE`) |
| Overlays | `map-data` still used **only** for reasoning overlays (optional; GIS geometry no longer depends on Cotality slots) |

### 2. Layout / resize (fixed)

| Fix | Detail |
|-----|--------|
| Map↔brief drag | `research-dock.js` syncs `--dock-map-w` on root **and** `#hauska-dock-split` during drag |
| Live resize | `onMapWidthChange` → `resizeSiteMap()` on every pointermove |
| Edge divider | 8px resizer column flush to map; `body.hauska-dock-resizing` cursor |
| Right edge | Map column fills dock edge; collapsed pull-tab 40px overlay (no scrollbar gutter gap) |
| Collapsible | Nav / rail collapse toggles preserved |

### 3. Full-screen + popout chat

| Control | Behavior |
|---------|----------|
| ⛶ Full-screen | `body.hauska-map-fullscreen` — hides brief/nav/rail; map fills workspace |
| Dock | Returns to side-by-side split |
| Float chat | `#hp-map-float-chat` over map in full-screen; submits via `submitQuestion()` |
| Detail strip | Cited reasoning panel floats above chat in full-screen |

### 4. Map pull-tab (redesigned)

- 40px branded tab: navy gradient, map pin icon, **Map** label, **Max** badge
- Hover widen + shadow — deliberate affordance vs. old 26px sliver

### 5. Interaction polish (pin-intersect scope)

| Interaction | Status |
|-------------|--------|
| Hover tooltip | Address / zoning district on parcel + zoning fills |
| Click parcel | `onParcelSelect` → `runBriefFromAddress()` when situs address present |
| Fly-to | `fitToSlots()` on subject parcel + zoning bounds |
| Legend | Floating legend notes **pin-intersect** + pending **area mesh** |
| Filters drawer | Overlay drawer; area mesh layers marked pending until bbox |

### 6. Bbox mesh (wired, inactive)

- `createGisViewportLoader()` + `probeGisBboxSupport()` — probes once; prod returns `400` on `bbox` key today → mesh disabled
- `moveend` handler no-ops until `isGisBboxMeshEnabled() === true`
- When cc-agent-C ships: no extension flag flip needed — probe flips on first successful bbox response

---

## Files

| Area | Files |
|------|-------|
| GIS API | `src/lib/gis-proxy-api.js` (new) |
| GIS render | `src/lib/gis-map-render.js` (new), `src/lib/gis-map-paint.js` (new) |
| Map shell | `src/lib/site-map.js` |
| Dock | `src/lib/research-dock.js` |
| Research | `src/research/research-app.js` |
| CSS | `styles/site-map.css`, `research/research.css` |
| Version | `manifest.json`, `package.json` → **0.6.21** |

---

## Build

```powershell
npm run build
.\scripts\build-release.ps1
```

| Output | Path |
|--------|------|
| Dev load | `P:\hauska-brief-extension` |
| Tester load | `P:\hauska-brief-extension\release` |
| Zip | `P:\hauska-brief-extension\hauska-brief-extension-v0.6.21.zip` |

---

## QA checklist

1. **Max or map-max-qa** — set dev product `map-max-qa` or complete Max checkout
2. Open Deep Research on Bastrop brief → expand **Map** tab
3. **Pin-intersect:** subject parcel boundary + zoning polygon on brown canvas (not empty Cotality slots)
4. **Resize:** drag 8px divider — map column width changes; map canvas reflows
5. **Full-screen:** toolbar ⛶ → map fills; float chat asks area questions; Dock returns to split
6. **Tab:** 40px navy pull-tab when collapsed
7. **After bbox ships:** pan map → viewport mesh loads without extension update (probe auto-enables)

---

## Screenshots

**Not captured in this pass** — prod `gis-layer` + `map-data` return `403 tier_required` for QA install id on 2026-06-18 (wallet gate). Visual verification requires Max subscription or restored `extension-agent-map-max-qa` allowlist. Operator: capture after tier unlock:

- [ ] Docked map with subject parcel + zoning on brown canvas
- [ ] Full-screen + float chat
- [ ] Resizer mid-drag showing wider map column

---

## Follow-up (cc-agent-C)

- Ship `bbox` + `zoom` on `POST /map-data/gis-layer` → extension mesh activates automatically
- Full-bleed zoning / FEMA / parcels mesh per viewport — no extension release required beyond probe succeeding
