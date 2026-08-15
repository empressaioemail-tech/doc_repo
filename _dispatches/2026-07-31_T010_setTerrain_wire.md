---
id: 2026-07-31_T010_setTerrain_wire
title: Dispatch — T-010 wire setTerrain + extrusion anchoring probe
status: in_progress
branch: feat/terrain-setTerrain-txgio
note: **Merge held** until live extrusion anchoring verify post-GCS publish + deploy. Code @ local `21bde8e`.
evidence: setTerrain wired; hash 09ee4eaa72ca; extrusion PASS shader-cited (TERRAIN_EXTRUSION_ANCHORING.md)
---

# T-010 — setTerrain wire + Phase-1 extrusion probe

## STANDING DECISIONS

- Cotality EXTINGUISHED — re-route, never rotate credential.
- Deploys planner-owned — agent deploys and fixes failed deploys; never escalate deploy to operator.
- No privileged data — TxGIO is public/free; uniform public-record only.
- CTX / national HELD until Bastrop QA-done + operator go.
- Code-done ≠ customer-done — grade is live probe on deployed surface, not merged PR.
- Stage explicit paths — shared clone per repo; standing decisions travel in dispatches.

## Goal

Wire production terrain-RGB tiles into MapLibre 5.24 via `setTerrain`. Answer the **fill-extrusion-base anchoring** question. Fix production landmines (glyphs, basemap smear). **Do not** repoint live reports.

## Repo + paths

- **Repo:** `hauska-map` @ fresh `origin/main`
- **Primary files:**
  - `packages/map-renderer/src/map/hauska-map-style.js` — add `raster-dem` source, sky layer, glyph URL
  - `packages/map-renderer/src/map/gis-map-render.js` — remove setTerrain deferral; terrain exaggeration **1.0**
  - `packages/map-renderer/src/map/gis-terrain.js` — split fixture vs production terrain helpers
  - `apps/property-explorer/src/lib/config.ts` — terrain URL + hash from T-009 output
  - `packages/map-renderer/src/chrome/sharedMapDefaults.ts` — same
  - MapToolset **Terrain** preset — enable 3D terrain (not just fixture hillshade)

## setTerrain contract

```javascript
map.addSource('hauska-terrain-dem', {
  type: 'raster-dem',
  tiles: [TERRAIN_RGB_URL_TEMPLATE],
  tileSize: 256,
  encoding: 'mapbox',
  maxzoom: 16,
});
map.setTerrain({ source: 'hauska-terrain-dem', exaggeration: 1.0 });
```

Add `sky` layer (MapLibre `sky` type) so pitched horizon is not void.

**Exaggeration stays 1.0** — regulatory-claim credibility (doc 40 landmine).

## fill-extrusion-base anchoring probe (WDLL item 5 — Phase 1 unblocker)

**Pre-read (shader evidence, MapLibre 5.24):** When `TERRAIN3D` is active, `fill_extrusion.vertex.glsl` adds `get_elevation(a_centroid)` to both base and height — extrusions anchor to terrain at feature **centroid**, with a basement hack for `base === 0` (extends floor 10m below centroid elevation to reduce hover on slopes).

**Executor must live-verify on deployed terrain:**

1. Enable terrain + inspect a Bastrop parcel with known sloped ground (river bluff area)
2. Place or preview envelope extrusion (fixture extrusion layer OK for probe if T-005 not shipped)
3. Capture pitch-45 screenshot: volume base should follow ground, not sit at z=0 sea level
4. Document: **PASS** (anchors at centroid — acceptable for Phase 1 envelope volumes) or **FAIL** (visible float/gap > rendering tolerance) with screenshot

**Known limitation to report:** Large polygons on steep slopes may show centroid anchoring artifacts (MapLibre #2513 class) — note whether Bastrop envelope polygons are small enough for Phase 1.

If **FAIL**: escalate to planner before Phase 1/3 scheduling; do not silently ship.

## Glyph endpoint

Replace `https://demotiles.maplibre.org/font/...` in `hauska-map-style.js` and `gis-map-paint.js` with production-capable source (MapLibre demo tiles repo CDN, self-hosted, or Protomaps glyphs — pick one stable URL; document in PR).

## Basemap under pitch

Raster CARTO smears at horizon. Pick one:

- **A (preferred):** Vector basemap source for pitched mode (MapLibre demo tiles or Protomaps v4 light)
- **B:** Keep raster + add `sky` + reduce basemap opacity under pitch + optional fog

Document choice in PR; WDLL item 7 screenshot required.

## Safety (WDLL item 6)

- **Do NOT** change engine routes, MCP tools, flood overlay, or terrain export refresh URLs
- **Do NOT** replace `upsertTerrainLayers` fixture path used by CC fixture stack unless feature-flagged
- Production terrain is a **new source id** (e.g. `hauska-terrain-dem`); fixture `hauska-fixture-dem` stays for tests

## Deploy

Planner-owned: merge on green CI → Vercel PE + CC redeploy → live probe pitch 45 over Bastrop.

## Definition of done

- WDLL items **4**, **5**, **6**, **7**
- Extrusion anchoring finding explicitly stated in PR body + `_scratch/terrain_3d.md` LESSON entry

## Landmines

- Vercel Hobby 12-fn cap — **no new serverless function**
- No demo endpoints in production
- `line-dasharray` + data-driven color crash — do not touch dashed envelope layer
- MapLibre 6.x upgrade out of scope
