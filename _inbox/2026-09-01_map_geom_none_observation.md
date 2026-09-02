---
id: 2026-09-01_map_geom_none_observation
title: Observation — the Smart Site panel receives geom "none" on every overlay, so no map draws
date: 2026-09-01
last_updated: 2026-09-01
status: open-observation
applies_to: smartsite-mcp panel, baked-facet serve path
plan_row: none yet, operator ruled RETEST AFTER THE FILLS rather than card
related:
  - _decisions/2026-09-01_parcel_record_rails_v2_template.md
  - _smartsite_gtm/06_consolidated_roadmap.md
owner: doc_repo planner
---

# geom "none" on every overlay

Logged rather than carded. **Operator read 2026-09-01: this is likely a consequence of the in-flight data pipeline work, and the call is to retest after the fills land rather than open a lane now.** That is a reasonable read, because the snapshots serving today were baked 2026-08-29 and the parcel-record fill is actively rewriting the store against the 65-rail template.

This note exists so the retest is a comparison against a recorded before-state, not a fresh investigation.

## What was observed

The operator ran Smart Site in the Claude web app on 129 Trailstone Dr, Bastrop. The panel rendered and no map drew.

The `draw.overlays` block the panel receives, verbatim, from `get_smart_site` at `depth: node` on `48021:31340`:

    {"id":"boundary",  "label":"Parcel boundary unmeasured",   "geom":"none","state":"unknown"}
    {"id":"flood",     "label":"Zone AE",                      "geom":"none","state":"present"}
    {"id":"footprint", "label":"Structure of record (2023)...","geom":"none","state":"unknown"}
    {"id":"envelope",  "label":"Buildable envelope not computed","geom":"none","state":"refused"}

Every overlay carries `geom: "none"`. There is no ring in the payload, so the panel has nothing to render. The panel is behaving correctly.

## The bake demonstrably held the polygon

Same payload, same parcel:

    "acreage":{"value":0.2339,"sqft":10190,"method":"shoelace-wgs84"}
    "frame":{"units":"ft","origin":"centroid","yAxis":"true-north",
             "quality":"gis-approximate","anchor":{"lat":30.0734,"lng":-97.30513}}

Shoelace is a polygon algorithm. An area cannot be computed by shoelace without a ring. So the bake read the geometry, derived the area from it, and built a complete coordinate frame with an origin, a north axis and a unit conversion, and then emitted `geom: "none"` for every overlay. The geometry is read and dropped somewhere on the way into the draw block.

## What it is not, so nobody re-chases these

**Not missing data.** `txgio_parcel` holds `ST_Polygon` for both parcels tested, `ingested_at` 2026-07-19, six weeks before the 2026-08-29 bake. Bastrop has 74,729 rows with geometry against 77,799 in the CAD roll.

**Not a client fault.** The panel diagnostic line reads `script-ran handshake=ready`, `bridge=ok`, `gl=webgl2`, `esri:ok200`, `svc7:ok200`.

**Not the GCS 404.** The diagnostic shows `gcs:ok404`, and it is benign. The probe hits `https://storage.googleapis.com/hauska-map-tiles/parcels`, which is a prefix rather than an object; the real file is `parcels.3431529a2e8d.pmtiles` and the bucket root returns 200. That 404 is probe design and is a red herring.

**Not the cold start.** That was a separate, real defect on the Chrome extension path, fixed the same day by putting `--min-instances=1` in both deploy workflows (legacy-design-tools #521 and #579). Both services now serve with `minScale 1` verified on the serving revision.

## Scope, stated honestly

Observed on **two of two parcels tested, both Bastrop**: `48021:8705357` from the operator's screenshot and `48021:31340` chosen independently. No other county was tested. It is therefore not established as universal, and the honest statement is that it reproduced every time it was looked for, in one county.

If it is systemic, the map has never drawn for anyone, and the "Parcel boundary unmeasured" label tells a user their parcel has no boundary when one is on file.

## The retest, and what would disprove the pipeline theory

After the fills land, call `get_smart_site` at `depth: node` on a parcel the new fill has written, and read `draw.overlays[].geom`.

**Confirms the operator's read:** `geom` carries a ring and the map draws.

**Disproves it:** `geom` is still `"none"` on a freshly filled parcel. In that case the defect is in the draw-block assembly rather than in the store, the fills will not fix it, and it wants its own lane. Pre-registering that here so the retest cannot be read as a pass by default.

**A weaker early signal:** the pipeline writes to the Factory store while the panel serves from the baked-snapshot path, so a Factory-side check is not a substitute for the serve-path call above. Test the serve path.

## Related observations from the same session, also logged not carded

`citationsDegraded: true` on flood, with `citations: []` and a `sourceCitation` that is prose rather than a resolvable https link. The Central Texas wedge is specifically the flood story told with citations, so the fraction of flood claims carrying a real link is worth measuring before content built on that wedge goes out.

Flood `asOf` is 2026-08-11 while the rest of the snapshot stamps 2026-08-29, so the flood facet runs on an older evaluation than everything around it.
