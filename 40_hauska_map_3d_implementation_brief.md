---
id: 40_hauska_map_3d_implementation_brief
title: Hauska Map 3D Implementation Brief
status: draft (filed canonical 2026-07-30; Phase 0A DONE 2026-07-31; Phase 1 gated on block-cert)
last_updated: 2026-07-31 (T-003 closed; TxGIO terrain wave dispatched)
applies_to: hauska-map
related: [30_block_cert_harness_spec, 2026-07-29_setback_authoritative_source_and_road_decouple, map_inventory_report]
owner: planner
---

# Hauska Map 3D Implementation Brief

## PLANNER FRAMING (added on filing 2026-07-30) — where this lands vs the block-cert work

This brief is the PRODUCT-SURFACE expression of everything the setback/envelope thread proved in the DATA layer. The block-cert work made the buildable envelope PROVABLY correct (measured in feet, cited, honest, with the three-way convergence + measured-geometry harness in `30_block_cert_harness_spec.md`). This brief makes that same envelope the PRIMARY VISUAL ARTIFACT — an extruded regulatory volume. The 3D viewer and the block-cert are the SAME commitment from two ends: one proves the volume is right, the other shows it. Keep them coupled.

TWO SEQUENCING RULINGS on filing:

1. PHASE 0A (visual hierarchy) DONE 2026-07-31 (hauska-map #122+#123+#124). Canonical paint authority: `packages/map-renderer/src/map/layer-role-taxonomy.js` (GROUND / CONTEXT / DATA / SUBJECT / INTERACTION). Live problem (land-use choropleth wash) killed; amber reserved for SUBJECT envelope; cold-open = parcel line-only; Flood/Entitlement/Terrain presets on PE MapToolset + CC LayersControl. Screenshots: `_inbox/2026-07-31_phase0a_screenshots/`. WDLL: `_inbox/2026-07-31_hauska_map_phase0a_visual_hierarchy_WDLL.md`.

2. PHASE 1 (envelope extrusion) IS GATED ON THE TARGET BLOCK BEING CERT-CLEAN. Do NOT extrude a wrong envelope — extruding makes an error 3D AND more authoritative-looking, the opposite of the honesty commitment. Phase 1 ships on a block only after that block passes the block-cert harness (envelope geometry measured-correct per R21). Block-13 is mid-cert (data layer 7/7 correct; drawn-envelope grade being resolved) — Phase 1 waits on cert-clean, not on the brief.

## >>> OPERATOR DECISION 2026-08-01: 3D PUSH PAUSED — DO NOT DISPATCH PHASE 1 <<<
The whole 3D push (Phase 1 envelope extrusion onward) is PAUSED by operator decision 2026-08-01. Rationale (operator): a 3D map with terrain relief but NO 3D BUILDINGS reads as BROKEN to a normal user, not sophisticated — a buildable-envelope volume floating on bumpy terrain with no buildings around it is a worse experience than a clean 2D map. We do NOT go partway into 3D; we go all the way (buildings + refinement, i.e. through Phase 4) or not yet. And the real priority is COVERAGE, not dimension: a 2D map with the WHOLE STATE OF TEXAS fleshed out (statewide smart-site coverage — the thesis actually delivering) is worth far more than a polished 3D view of one block. 3D is polish on coverage we don't yet have. Also: no appetite to add one more surface to QA right now.
WHAT STAYS (already shipped, not reverted): Phase 0A visual hierarchy (DONE); the TxGIO terrain LAYER as an OPTIONAL toggle (shipped, clean after the 2026-08-01 nodata/bounds fix) — it enhances topo when a user wants it, but 3D is NOT the default map and NOT the near-term push.
WHAT'S PAUSED: Phase 1 (T-004..T-007 envelope extrusion), Phase 4 (buildings/footprints), and the camera-tilt/volume-legend work. Do NOT dispatch Phase 1. The extrusion-base-anchors-to-terrain finding (TERRAIN_EXTRUSION_ANCHORING.md, PASS) is BANKED for when 3D resumes — the technical gate is answered, so resuming later is de-risked.
REVISIT WHEN: statewide 2D coverage is substantially built AND we're ready to go all-the-way on 3D (envelope volumes + real building footprints + refinement together, not partway). Until then the flagship is 2D statewide coverage, not dimension.

The rest of this doc is the original implementation brief, unchanged.

---

## Purpose

Sequenced implementation plan to take hauska-map from a flat multi layer 2D view to a
dimensional view whose primary artifact is the buildable envelope volume, with terrain
and flood depth following. Derived from the read-only map inventory at hauska-map
`d92dae7b564deb78ff99d4388da8275feb893593`, hauska-engine `6bc60cded2404394a854833907fe2c95a8ca7404`,
legacy-design-tools `7c37b8e127f0369bbc7fe5e47a579f6729e4ffe9`.

## Scope

In scope: envelope extrusion, pitch-aware fetch, terrain, flood depth surface, building
footprint acquisition path.

Out of scope: Cesium migration, Google Photorealistic 3D Tiles, deck.gl adoption, globe
projection, flythrough or cinematic camera, first person navigation. Do not introduce
three.js, deck.gl, or Cesium as dependencies without a separate ADR. MapLibre 5.24 is
sufficient for everything in this brief. Do not upgrade to MapLibre 6.x as part of this
work.

## Governing principle

The inventory found no building footprints anywhere, but it found that zoning envelope
parameters already exist as structured numerics. The product is therefore not a 3D city
model. It is a regulatory volume viewer. Every ticket below serves the question "what
does the code let me build here, and what does the water do to it." Anything that does
not serve that question is out of scope.

---

## Phase 0A: Visual hierarchy — DONE 2026-07-31

Shipped on hauska-map main via #122 (taxonomy + paint + cold-open), #123 (MapToolset presets), #124 (live-parcels line-only). Canonical paint authority: `packages/map-renderer/src/map/layer-role-taxonomy.js`. Do not re-inline role hues.

### T-H01: Layer role taxonomy and channel budget — MET

**Blocked by:** nothing
**Files:** `packages/map-renderer/src/map/layer-role-taxonomy.js` (+ test), consumed by gis-map-paint / hauska-map-style / live-gis / parcel-tiles / envelope-overlay / flood-map-overlay / MapToolset / LayersControl

Paint values are currently defined inline at each layer's definition site, which is why
they have drifted into collision. Centralize them and assign every layer in the inventory
to exactly one role. Roles determine which visual channels a layer may use.

| Role | Layers | Permitted channels | Forbidden |
|------|--------|--------------------|-----------|
| Ground | basemap, satellite base | Low opacity, desaturated, no hue | Any saturated color |
| Context | FEMA, topography, hydrography, road band, ROW | Line weight, dash, hatch, texture, single muted hue per layer | Saturated area fill |
| Data | land use choropleth, rent heat, constraint density | Full categorical hue, area fill | Being on by default, or on simultaneously with each other |
| Subject | inspected parcel, buildable envelope, envelope volume | Reserved amber, full saturation, highest z | Use by any other layer |
| Interaction | hover highlight, search highlight, parcel glow | Reserved cyan, transient only | Persisting past the interaction |

The load-bearing rule is the Data row: at most one Data layer may be visible at a time,
and turning one on dims every Context layer. Right now the land use choropleth paints
every parcel in the viewport by default, which is what is consuming the screen.

**Definition of done:** a single exported constant defines the palette and opacity budget
per role, every layer definition reads from it rather than a literal, and a test asserts
no two Data layers can be simultaneously visible.

### T-H02: Rebalance existing paint against the taxonomy — MET

**Blocked by:** T-H01
**Files:** (verify paths on current main — brief line refs were stale)

Four specific collisions the inventory exposed, each of which needs a decision:

Basemap opacity is 0.88 with saturation and contrast adjustments applied on top
(`hauska-map-style.js` L29-36). A ground layer sitting beneath ten data layers should not
be at 0.88. Take it down substantially and desaturate further. It should establish
position and nothing else.

The color `#7dd3fc` is used by both the `live-parcels` line and `search-street-highlight`.
Per the taxonomy, cyan belongs to Interaction. Reassign the parcel line.

The buildable envelope uses amber fill at 0.12 and the flood study overlays are described
as a "warm amber family" (`flood-map-overlay.ts` L71-93). Amber is the Subject color and
the envelope is the single most important object in the product. Move the flood study
overlays off amber entirely.

FEMA fill sits at opacity 0.4 (`live-gis.ts` L741-745) while being a Context layer that is
effectively always on above zoom 11. Invert it: dominant boundary with hatch or pattern
inside the SFHA, minimal fill. The zone boundary is the information; the interior area is
not.

**Definition of done:** no hue is used by two roles, no Context layer exceeds the fill
opacity budget from T-H01, and a screenshot of the Bastrop default view shows clear
figure and ground separation.

### T-H03: Progressive disclosure and cold open — MET

**Blocked by:** T-H02
**Files:** consumer-layers / ExplorerMap / MapToolset / sharedMapDefaults / layer-registry DEFAULT_VISIBLE_LAYERS / CC LiveMapTile

The cold open currently turns on parcels, FEMA, hydrography and more simultaneously in PE,
and CC seeds an even larger default set including `dem-hillshade` and `rent-heat`. Users
arrive at maximum density and have to subtract.

Invert it. Default state is basemap, parcel boundaries as line only with no fill, and
nothing else. Layers arrive in response to a question. Add a small set of named presets
that turn on coherent groups, which is a better interaction than fifteen independent
checkboxes: something like Flood, Entitlement, Terrain, each activating two or three
layers and dimming the rest.

**Definition of done:** the Bastrop cold open renders at most three layers, and each
preset produces a view where the layer answering the question is unambiguously dominant.

---

## Phase 0B: Architecture blockers

These must land before pitch is ever raised above 0 in production. Raising pitch first
will make the map look broken in ways that get attributed to 3D rather than to the
underlying fetch architecture.

### T-001: Resolve dual parcel representation

**Blocked by:** nothing
**Files:** `apps/property-explorer/src/lib/consumer-layers.ts`, `packages/map-renderer/src/browse/liveGis.ts`, `ExplorerMap.tsx` L247-318

The inventory gaps section records that `fetchGisLayer(..., 'parcels')` and the PMTiles
browse corpus are both active in PE, toggled by overlapping layer keys, producing
overlapping representations of the same geometry. Flat, these merely double draw. Under
extrusion they will z-fight.

Decide and enforce one rule: PMTiles is the browse corpus for all parcels in view, live
GeoJSON is fetched only for the inspected parcel and its immediate neighbors. Remove
`live-parcels` from the viewport fetch path in PE.

**Definition of done:** at any zoom and any pitch, exactly one parcel geometry source is
rendering fills. A test asserts that `hauska-ovl-live-parcels-fill` and
`hauska-parcel-tiles-fill` are never simultaneously visible.

### T-002: Pitch-aware viewport bbox clamp

**Blocked by:** nothing
**Files:** `packages/map-renderer/src/browse/live-gis.ts` L41-52, L85-89; `brokerageGisLayers.ts` L52-54; `map-renderer.js` L71, L376-381

`VIEWPORT_PAGE_SIZE = 50` and `MAX_VIEWPORT_PAGES = 4` cap live fetches at roughly 200
features per viewport. At pitch 0 the visible bbox is a rectangle. At pitch 60 it is a
trapezoid extending toward the horizon, covering several times the ground area, and the
cap truncates hard. The user sees populated foreground and empty distance and reads it
as a bug.

Implement: when `map.getPitch() > 20`, do not use `map.getBounds()` for the fetch bbox.
Instead compute a bbox from `map.unproject()` at the four corners of a clamped screen
region, bounded to a fixed ground radius around the camera target. Cap the requested
ground area so the feature count stays inside the existing page budget.

Surface the existing truncation flag in the UI when it fires, in both PE and CC. It is
already plumbed to CC chips at `LiveMapTile.tsx` L323-324.

**Definition of done:** at pitch 60, zoom 15, the fetched ground area is within 1.5x the
pitch 0 area at the same zoom, and no truncation flag fires under normal panning.

### T-003: Locate the tile build pipeline — DONE 2026-07-31

**Blocked by:** nothing
**Canonical doc:** `40j_hauska_map_tile_build_pipeline.md`

The PMTiles archive at `storage.googleapis.com/hauska-map-tiles/parcels.4af31e1901e2.pmtiles`
is consumed from hauska-map config. The bake lives in **legacy-design-tools** (not
hauska-map or hauska-engine): `artifacts/api-server/src/parcelsPmtilesBakeCli.ts`, run via
`pnpm --filter @workspace/api-server parcels-pmtiles-bake`, manual upload to
`gs://hauska-map-tiles`. Terrain-RGB adds a sibling Python/GDAL bake in the same repo;
same bucket discipline. Phase 2 (T-008/T-009) unblocked.

**Definition of done:** MET — pipeline location, trigger, inputs, and who-can-run recorded
in `40j_hauska_map_tile_build_pipeline.md`.

---

## Phase 1: Envelope volume

This is the highest value per unit of effort in the entire brief. The polygon exists, the
height number exists, and the extrusion code path exists in the fixture stack. They have
never been connected on live data.

GATE (planner, 2026-07-30): ships on a block ONLY after that block passes the block-cert
harness (envelope geometry measured-correct, `30_block_cert_harness_spec.md`). Do not
extrude an uncertified envelope.

### T-004: Promote maxHeightFt onto envelope feature properties

**Blocked by:** nothing
**Files:** `apps/property-explorer/src/.../envelope-overlay.ts` L37-39; `atom-chain-to-facets.ts` L53, L463-464; `hauska-engine/.../emit-setback-rule.ts` L50, L66

`maxHeightFt` currently resolves through facets and atom-chain and lands on the inspect
card. The `buildable-envelope` GeoJSON overlay feature does not carry it. Add it to the
feature properties at overlay construction time, alongside the district code.

Also carry `heightSource` and `heightNotSpecified`, mirroring the existing
`setback-not-specified.ts` honesty pattern. A parcel with no height stamp must render
differently from a parcel with a 35 foot limit. Do not default a missing height to any
number.

**Definition of done:** the envelope feature emitted for a parcel with a known district
carries numeric `maxHeightFt`, a source label, and an explicit not-specified flag when
the stamp is absent.

### T-005: Envelope volume extrusion layer

**Blocked by:** T-004
**Files:** `packages/map-renderer/src/.../envelope-overlay.ts`, `gis-map-render.js`

Add a `fill-extrusion` layer against the existing envelope source.

```js
{
  id: 'buildable-envelope-volume',
  type: 'fill-extrusion',
  source: ENVELOPE_SOURCE,
  filter: ['!=', ['get', 'heightNotSpecified'], true],
  paint: {
    'fill-extrusion-color': '#f0b429',
    'fill-extrusion-opacity': 0.32,
    'fill-extrusion-base': 0,
    'fill-extrusion-height': ['*', ['to-number', ['get', 'maxHeightFt'], 0], 0.3048]
  }
}
```

**Unit trap, read this twice.** MapLibre `fill-extrusion-height` is always in meters. The
existing fixture layer at `gis-map-render.js` L236-249 feeds `allowedHeightFt` directly
into the height property with no conversion, which renders every fixture volume 3.28
times too tall. That bug is currently invisible because the fixture stack is off in PE and
nobody has checked it against a known building. Fix the fixture layer in the same commit.

Establish one canonical internal unit now and convert only at the paint boundary.
Recommend feet internally, since every regulatory source you touch is in feet, with a
single `FT_TO_M` constant applied in paint expressions.

Keep the existing `buildable-envelope-setback` dashed line layer untouched. See landmines
below.

**Definition of done:** inspecting a Bastrop SF-1 parcel renders a translucent amber
volume whose height in meters equals `maxHeightFt * 0.3048` within rendering tolerance,
verified against a manual calculation.

### T-006: Camera mode on inspect

**Blocked by:** T-005
**Files:** `map-renderer.js` L174-186; `ExplorerMap.tsx` L1328-1338

`maxPitch` is already 68 and `pitch` defaults to 0. On envelope resolve, `easeTo` a pitch
of roughly 45 and a modest bearing offset over 600 to 800ms. On inspect dismiss, ease back
to 0. Persist the user's manual pitch if they have adjusted it themselves and do not
override it.

The tilt must read as a deliberate mode change. An instant jump reads as a glitch.

**Definition of done:** opening an inspect card tilts the camera smoothly and closing it
returns to flat, unless the user has manually pitched, in which case their pitch is
preserved.

### T-007: Volume legend and toggle

**Blocked by:** T-005
**Files:** `LayersControl` in `@hauska/map-renderer`, `consumer-layers.ts`

Add a layer key for the envelope volume, defaulting on. Legend must state the height
source and the district, and must display an explicit "height not specified" state rather
than an empty volume. Users will read a volume as an authoritative entitlement claim, so
the provenance label is not optional.

**Definition of done:** the layer panel exposes the volume, and the legend names the
district and the height source or states its absence.

---

## Phase 2: Terrain

### T-008: Acquire the DEM

**Blocked by:** T-003
**Files:** new asset, pipeline location per T-003

Do not derive a DEM from the existing 1-ft Bastrop contours in
`hauska-engine/.../bastrop-contours.ts`. Those contours were themselves derived from
lidar, and re-interpolating them back into a surface is lossy for no reason.

Pull the source DEM directly from the TxGIO DataHub. TxGIO and partners have flown lidar
covering the entire state, and all projects download free from the DataHub. Take the
Bastrop County collection, bare earth DTM, highest available resolution.

Record for the asset, because Phase 3 depends on all three: horizontal CRS, vertical
datum, and vertical unit. Use the existing contours as a validation check, not as input.

**Definition of done:** a DTM covering the Bastrop city limits plus a two mile buffer is
staged, with CRS, vertical datum, and units recorded in the pipeline doc.

### T-009: Terrain RGB tiles

**Blocked by:** T-008
**Files:** tile pipeline per T-003

Reproject the DTM to EPSG:3857, encode to terrain RGB with rio-rgbify using mapbox
encoding, tile to the same zoom range as the parcel corpus, and publish to the same GCS
bucket as a PMTiles or z/x/y raster archive.

**Definition of done:** terrain RGB tiles are served from the hauska-map-tiles bucket and
fetch successfully in a browser.

### T-010: Wire setTerrain

**Blocked by:** T-009
**Files:** `hauska-map-style.js`, `gis-map-render.js` L145-147

`gis-map-render.js` currently carries the comment that setTerrain and raster-dem are
explicitly deferred. Remove the deferral. Add a `raster-dem` source with the correct
encoding, call `setTerrain` with exaggeration 1.0, and add a `sky` layer so the horizon
does not render as void.

Set exaggeration to 1.0 and leave it there. Bastrop sits on a river bluff with real relief
against the Colorado. Exaggerated terrain in a product that makes regulatory claims is a
credibility problem, not a feature.

Verify how `fill-extrusion-base` behaves once terrain is live. Envelope volumes must sit
on the ground surface, not at sea level. If MapLibre 5.24 does not anchor extrusion bases
to terrain in the way this requires, that finding blocks T-012 and needs to be raised
before Phase 3 is scheduled rather than discovered inside it.

Replace the CARTO raster basemap for pitched views. Raster basemaps smear badly toward
the horizon under tilt. Either swap to a vector basemap or apply a distance fog that hides
the degradation. Also replace the glyph endpoint: the style currently points at
`demotiles.maplibre.org`, which is MapLibre's demo server and not a production service.

**Definition of done:** terrain renders at pitch 45 over Bastrop with visible bluff
relief, envelope volumes sit correctly on the ground surface, and no production asset is
served from a demo endpoint.

---

## Phase 3: Flood depth surface

### T-011: Plumb STATIC_BFE to the client

**Blocked by:** nothing, can run parallel to Phase 2
**Files:** `brokerageGisLayers.ts` L46-47, L105-108; `nodeFacetBakeTier2Cli.ts` L515; `live-gis.ts` L741-745

The bake CLI already requests `FLD_ZONE,ZONE_SUBTY,SFHA_TF,STATIC_BFE,DFIRM_ID` in its
outFields, but the inventory confirms `STATIC_BFE` never reaches client map features, and
`DEPTH`, BFE lines, and cross sections are absent entirely.

Add `STATIC_BFE`, `SFHA_TF`, and `DFIRM_ID` to the client-facing FEMA feature properties
on the gis-layer path. Pull NFHL BFE lines as a separate layer if the depth grid in T-012
proves insufficient.

**Definition of done:** live FEMA features in an AE zone carry a numeric `STATIC_BFE` and
a `DFIRM_ID` on the client.

### T-012: Depth grid, not a water plane

**Blocked by:** T-010, T-011
**Files:** new engine map-layer slot, `flood-map-overlay.ts` L71-93

Do not attempt to render a flat water plane at absolute elevation. MapLibre does not
position fill-extrusion geometry at absolute sea-level elevation when terrain is active,
and forcing it requires a custom three.js layer, which this brief rules out.

Instead compute depth server side. Tessellate the AE zone polygon into a grid at roughly
10 to 30 meters, sample the DTM at each cell, compute `depth = BFE - ground_elevation`,
discard cells where depth is negative, and emit the grid as a new engine map-layer slot.
Render it as `fill-extrusion` with height driven by the depth attribute.

This is better than a water plane on three counts: it hugs terrain correctly with no
custom rendering, the depth number is exactly what a buyer, lender, or reviewer needs, and
it degrades gracefully into a flat depth choropleth when pitch is 0.

**Vertical datum trap.** FEMA BFE values are published against the datum of the governing
DFIRM panel. Older panels use NGVD29, newer ones NAVD88. TxGIO lidar is NAVD88. In Central
Texas the offset between the two is roughly half a foot to a foot, which is a material
error in a depth product. Check `DFIRM_ID` against the panel datum and apply the
conversion explicitly. Do not assume the datums match. Log the datum on every emitted
depth grid.

**Definition of done:** a depth grid renders over a known Bastrop AE zone, spot depths
match a manual BFE minus DEM calculation within 0.25 feet, and the emitted layer records
its vertical datum and units.

---

## Phase 4: Buildings

Lowest priority. Do not start before Phases 1 through 3 ship. The product thesis does not
require buildings; it requires envelopes.

### T-013: Footprint acquisition

**Blocked by:** T-008

No building footprints exist anywhere in the three repos. Acquire from Overture or
Microsoft building footprints for Bastrop County. Both are polygon only with no height.

### T-014: Derive heights from lidar

**Blocked by:** T-013

Pull the DSM alongside the DTM already acquired in T-008. For each footprint polygon,
compute the 90th percentile of DSM minus DTM inside the polygon. That is your LOD1 height.
Discard footprints with fewer than a minimum number of covered lidar returns rather than
emitting a low confidence height.

### T-015: Building extrusion layer

**Blocked by:** T-014

Extrude actual buildings inside the envelope volumes. The gap between the two is
developable capacity, which is the payoff for the entire brief.

---

## Known landmines

Carried forward from the inventory so they are not rediscovered the hard way.

| Issue | Location | Consequence |
|-------|----------|-------------|
| `line-dasharray` combined with data-driven color crashes MapLibre | `gis-map-render.js` L369-373, `gis-hydrology-flow.js` L35-43 | Do not add data-driven color to `buildable-envelope-setback` or any dashed layer |
| LineAtlas exhaustion from animated dash | `gis-hydrology-flow.js` L38-41 | Do not animate dashes on any layer added by this work |
| 3DEP contour MultiPolygon blue wash | `live-gis.ts` L267-281 | Already converted to lines, do not revert |
| Vercel Hobby 12-function cap | `pe-map-layers.ts` L6-12 | New engine slots in T-012 must merge into the existing BFF, not add a function |
| Viewport debounce 350ms | `map-renderer.js` L71, L376-381 | Pitch changes must also trigger refetch, not just pan and zoom |
| Height unit mismatch | `gis-map-render.js` L236-249 | Fixture extrusion is 3.28x too tall today, fix in T-005 |

---

## Open questions

1. ~~Where does the PMTiles build pipeline live~~ **RESOLVED 2026-07-31** — `40j_hauska_map_tile_build_pipeline.md`; sibling raster bake in legacy-design-tools, same GCS bucket.
2. Does MapLibre 5.24 anchor `fill-extrusion-base` to terrain elevation in the way T-012
   requires. **Pre-answer (shader):** yes at feature centroid via `get_elevation(a_centroid)` when terrain active; live verify required in T-010. Routes to T-010, blocks Phase 3 if live probe fails.
3. Is the PMTiles parcel corpus schema documented anywhere outside these repos. The
   inventory found only id and land use referenced, with no assessor fields. Blocks any
   attempt to extrude parcels by value or permit age.
4. FAR, lot coverage, and minimum lot size are absent from the facet types. Is that a
   parsing gap in the engine or a genuine absence from the Bastrop ordinance. Affects
   envelope fidelity but does not block Phase 1. (Planner note: min-lot IS parsed on the
   per-parcel record per the block-cert work — this is a facet-surfacing gap, not an
   ingest absence; ties to T-004.)

## Dependencies

Phase 0A depends on nothing and runs first (near-term, independent of the 3D arc — fixes the live wash-out). Phase 1 must not ship before it.
Phase 0B depends on nothing and can run parallel to 0A.
Phase 1 depends on Phase 0A and 0B, on nothing outside hauska-map, AND on the target block being block-cert-clean.
Phase 2 depends on T-003 being answered.
Phase 3 depends on Phase 2 and on the vertical datum question being settled.
Phase 4 depends on Phase 2.

## Revision history

2026-07-30, planner, initial draft from map inventory report.
2026-07-30, planner, added Phase 0A visual hierarchy. The original draft went straight to
3D mechanics and omitted the layer weighting problem that prompted the review. Extrusion
without it buries the subject volume in the land use choropleth.
2026-07-30, planner (claude), filed canonical + added PLANNER FRAMING: Phase 0A moves near-term/independent (fixes live wash-out); Phase 1 gated on block-cert-clean (don't extrude a wrong envelope); coupled the 3D viewer to the block-cert commitment.
