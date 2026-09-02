---
title: SCOUT-FLOOD-DEPTH inventory — closing the BFE/panel-date wedge gap
lane: PARCEL-SCOUT-FLOOD
plan_row: F-01
date: 2026-09-02
status: scout, read-only, no purchases, no writes
---

# The headline finding

The four data gaps R3 left open all close from public, no-cost, no-account sources. Three of
the four close from the exact same FEMA ArcGIS service `tx_fema_nfhl_flood_zone` already
queries -- the loader asked for one layer (Flood Hazard Zones) out of thirty-one in that
service and never asked for the others. This is not an external-acquisition problem for
those three; it is an unasked-question problem.

# Target-by-target

## 1. Base Flood Elevation values (closes: STATIC_BFE <1% populated)

- **URL:** `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/16`
- **Name:** Base Flood Elevations (S_BFE)
- **Format:** ArcGIS REST feature service, polyline geometry, JSON/GeoJSON via query endpoint
- **Fields:** `DFIRM_ID`, `VERSION_ID`, `BFE_LN_ID`, `ELEV` (double, the real elevation value),
  `LEN_UNIT`, `V_DATUM`, `SOURCE_CIT`
- **Join mechanism:** `DFIRM_ID` shared with the already-loaded zone polygon layer (28); spatial
  join is nearest-line / buffer-to-parcel, NOT point-in-polygon (BFE lines are contour-like,
  they do not cover area the way zone polygons do) -- a genuinely different join shape than the
  one R3 already built, and the one piece of real new engineering here.
- **Vintage/coverage:** current effective NFHL, national, same currency as the zone layer.
- **License:** see License section below -- public domain in practice, no cost.
- **Magnitude:** 12,114 features in a bbox loosely covering the six counties (approximate
  envelope, not exact county polygons -- see caveat below).
- **What it closes:** a real elevation value in feet, with vertical datum, wherever FEMA drew a
  BFE line -- for AE-zone parcels near a line this is a usable per-parcel estimate; it does not
  reach every AE parcel (BFE lines are drawn at specific cross-sections, not everywhere).

## 2. Panel effective dates (closes: "absent from NFHL entirely")

- **URL:** `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/3`
- **Name:** FIRM Panels (S_FIRM_PAN)
- **Format:** ArcGIS REST feature service, **polygon** geometry (same shape as the zone layer)
- **Fields:** `DFIRM_ID`, `VERSION_ID`, `FIRM_ID`, `PANEL`, `SUFFIX`, `FIRM_PAN`, `PANEL_TYP`,
  `PRE_DATE` (date), **`EFF_DATE`** (date -- the exact field described as missing), `SCALE`,
  `BASE_TYP`
- **Join mechanism:** point-on-surface / point-in-polygon against parcel centroid -- IDENTICAL
  pattern to R3's already-proven, already-falsified zone-determination join. No new join
  engineering; same code, new layer ID.
- **Vintage/coverage:** current effective panels, national.
- **License:** same as above.
- **Magnitude:** 595 panel polygons in the six-county bbox.
- **What it closes:** this fully closes the "no panel effective date" gap for every matched
  parcel, at the cost of one more spatial join using code that already exists and is already
  verified against a live falsifier.

## 3. Cross-sections (bonus target, not explicitly requested but in scope of "sibling tables")

- **URL:** `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/14`
- **Name:** Cross-Sections (S_XS)
- **Format:** polyline
- **Fields:** `WSEL_REG` (regulatory water surface elevation), `STRMBED_EL` (streambed
  elevation), `V_DATUM`, `WTR_NM` (named waterway)
- **Magnitude:** 11,084 features in the six-county bbox.
- **What it closes:** hydraulic-study reference detail, not directly parcel-actionable the way
  BFE lines or panel dates are. Lower priority; noted for completeness since it was named in the
  card's target list.

## 4. Preliminary / pending panels for the six counties

- **URLs:** `https://hazards.fema.gov/arcgis/rest/services/PrelimPending/Prelim_NFHL/MapServer`
  and `.../PrelimPending/Pending_NFHL/MapServer` -- a **separate top-level service**, not a
  filter parameter on the effective NFHL service. Discovered by fetching the REST catalog root
  (`.../arcgis/rest/services?f=json`), not documented anywhere in doc_repo prior to this scout.
- **Layer scheme:** identical numbering to the effective service (layer 28 = "Preliminary Flood
  Hazard Zones", layer 3 = "Preliminary FIRM Panels", etc.) -- the same join/query code written
  for the effective layers works unchanged against this service, just a different base URL.
- **Live finding:** a bbox query against `Prelim_NFHL/MapServer/28` returned 13,879 features
  intersecting the program's six-county envelope. There is live preliminary remap activity in
  or near the program footprint right now. Which specific county (or counties) was NOT resolved
  at this scout's bbox resolution -- county boundaries are tighter than the rectangular envelope
  used for these counts, so this needs a proper county-polygon-clipped query before it is acted
  on, not the bbox estimate used here.
- **Use restriction (real, not a formality):** preliminary/pending data is explicitly for review
  only and "cannot be used to rate flood insurance policies or enforce the Federal mandatory
  purchase requirement" per FEMA's own public guidance -- it must be surfaced as a distinct,
  separately-labeled signal (e.g. "a remap is in progress here"), never merged into or replacing
  the effective determination.

## 5. Base Level Engineering (BLE) — the FEMA BLE / HUC8 target

- **Status source used:** `https://gis1.twdb.texas.gov/server/rest/services/WSC-FSCA-FM/Texas_BLE_Status/MapServer/0`
  (Texas Water Development Board, not FEMA directly -- FEMA's own Estimated BFE Viewer at
  `webapps.usgs.gov/infrm/estBFE` is a JavaScript application and does not expose a fetchable
  data endpoint the way the TWDB status layer does).
- **Fields:** `HUC8_Code`, `HUC8_Name`, `Study_Type` (1D/2D), `Study_Status`, `Comp_DATE`,
  `Est_Comp_Date`. No county field -- join is by HUC8 geometry, not county FIPS.
- **Live finding:** 19 HUC8 watersheds intersect the six-county bbox; **all 19 report
  `Study_Status = "Complete"`** (verbatim field value, not summarized), spanning dates from
  roughly 2016 through early 2025 depending on watershed (converted from epoch-millisecond
  `Comp_DATE` values; approximate, not re-verified to the day).
- **What this means and does NOT mean:** BLE study completion for the covering watersheds is
  confirmed. The actual downloadable deliverables -- water-surface-elevation and depth grids
  per HUC8 -- live behind USGS's separate Estimated BFE Viewer as bulk raster downloads, not a
  REST feature/attribute service. Getting a per-parcel BLE-derived value requires downloading
  those grids and extracting a value at each parcel's location or footprint -- a genuinely
  different acquisition and processing shape than the attribute-join pattern that closes
  targets 1, 2, and 4. This is real, closable, no-cost work; it is not a one-line query change.

# License, verbatim

From `https://hazards.fema.gov/filedownload/metadata/NFHL/NFHL_metadata.xml`:

- Access Constraints: **"None"**
- Use Constraints: "The hardcopy FIRM and FIRM Database and the accompanying FIS are the
  official designation of SFHAs and Base Flood Elevations (BFEs) for the NFIP. For the purposes
  of the NFIP, changes to the flood risk information published by FEMA may only be performed by
  FEMA and through the mechanisms established in the NFIP regulations (44 CFR Parts 59-78)."
- Distribution Liability: "No warranty expressed or implied is made by FEMA regarding the
  utility of the data on any other system nor shall the act of distribution constitute any such
  warranty."
- Acknowledgment: "Acknowledgement of FEMA would be appreciated in products derived from these
  data" -- requested, not mandatory.

No cost, no API key, no account, no purchase for any of the four services scouted here (NFHL,
Prelim_NFHL, Pending_NFHL, TWDB Texas_BLE_Status). This satisfies "no purchases" cleanly across
the whole inventory.

# What public sources cannot close, stated plainly

Nothing in this inventory is blocked outright. The one real distinction to carry forward
honestly: three targets (BFE lines, panel dates, preliminary/pending) close with the SAME
acquisition shape already built and proven -- an ArcGIS REST spatial query against a layer in a
service we already talk to. BLE closes with a DIFFERENT shape -- bulk grid download plus
raster-to-parcel extraction -- and should not be scoped or estimated as if it were the same size
of task as the other three. Any GTM claim of "flood depth/elevation coverage" should say which
of the two mechanisms backs which county/parcel, because they carry different confidence and
different build cost.

# Magnitude caveat

All bbox counts in this document used a single rectangular envelope
(`-98.3,29.9` to `-96.7,31.8`) approximating the six-county footprint, not the exact county
polygons. This over-counts (includes some area outside the six counties) and could miss slivers
at the envelope edges. Treat these as order-of-magnitude figures for sizing the scout, not as
counts to build a budget from -- an exact county-clipped count is cheap to run as a first step
of any build card that picks this up.

# Sources

- [FEMA NFHL MapServer root](https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer?f=json)
- [FEMA NFHL layer 28, Flood Hazard Zones](https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28?f=json)
- [FEMA NFHL layer 3, FIRM Panels](https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/3?f=json)
- [FEMA NFHL layer 16, Base Flood Elevations](https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/16?f=json)
- [FEMA NFHL layer 14, Cross-Sections](https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/14?f=json)
- [FEMA REST services catalog root](https://hazards.fema.gov/arcgis/rest/services?f=json)
- [FEMA PrelimPending / Prelim_NFHL MapServer](https://hazards.fema.gov/arcgis/rest/services/PrelimPending/Prelim_NFHL/MapServer?f=json)
- [FEMA NFHL metadata XML (license text)](https://hazards.fema.gov/filedownload/metadata/NFHL/NFHL_metadata.xml)
- [TWDB Texas_BLE_Status MapServer](https://gis1.twdb.texas.gov/server/rest/services/WSC-FSCA-FM/Texas_BLE_Status/MapServer/0?f=json)
- [FEMA Base Level Engineering (Region 6) program page](https://www.fema.gov/about/organization/region-6/base-level-engineering-ble-tools-and-resources)
- doc_repo: `_inbox/2026-08-08_STATEWIDE_layer_inventory.md`, `_inbox/phase2_probes_2026-08-10/fema_nfhl_layer28.json`, `_inbox/2026-09-01_parcel-r3-flood_close.json`
