---
id: 2026-08-05_T3_footprint_source_recon
title: T3 Workstream 1 — building footprints source recon (read-only)
date: 2026-08-05
status: recon-complete
owner: nick
related: [T3_rails_track, 90_runbooks/factory_onboarding_runbook, HEALTH_CHECK_2026-08-05_verdict, _inbox/2026-08-04_county_fan_cadastral_recon]
method: curl.exe live GET probes only; no prod writes; public record only
---

# T3 Workstream 1 — building footprints source recon

Read-only recon for the catch-up program footprints rail. Method: four-point live probe per factory runbook (service root layer list, layer fields + casing, one roster-parcel query, feature count where available). Probes run 2026-08-05 via `curl.exe` from Windows.

## Executive summary

**BCAD:** No public ArcGIS REST layer named building footprint, improvement sketch, or structure polygon was found. The operator-visible "clean footprints" on `esearch.bastropcad.org` and `gis.bisclient.com/bastropcad/` correlate with **EagleView ortho mosaics** (2022/2024/2025) in the published web maps plus **CAMA tabular improvement components** (MAIN AREA sqft, porches, etc.) on the property page — not a queryable footprint vector service. The authoritative public CAD polygon service is `BastropCADWebService` layer 0 Parcels (65,285 features).

**Onboarded counties:** **0 of 11** probed jurisdictions expose a CAD-authoritative building-footprint vector layer on public REST. All require **ML-derived fallback** (Microsoft Global ML Building Footprints primary; Overture buildings secondary) until a county publishes footprints or a bulk CAD export recon finds sketch shapefiles.

**USA Structures (USGS):** Point landmark inventory (schools, fire stations, etc.) — **not** building footprint polygons. Do not route the footprints rail here.

---

## BCAD deep dive (48021) — operator priority

### What the operator sees vs what REST exposes

| Surface | URL | Footprint vector? | Evidence |
|---|---|---|---|
| eSearch property | `https://esearch.bastropcad.org/Property/View/34785` | Tabular only | "Property Improvement - Building" panel lists MAIN AREA 1,722 sqft, porches, storage — no geometry API in page source |
| BIS interactive map | `https://gis.bisclient.com/bastropcad/` | No footprint layer in web map | Web map item `106c21d3761a42bcabbf5cf556cd2077` operational layers = EagleView mosaics + BastropCADWebService parcels/lot lines/streets — no Building/Sketch layer |
| ArcGIS Online (bis_bastropcad) | org `aS4XD9PgZha28y8P` | No footprint service | Org search: 5 items total (BastropCADWebService, BastropCADAdditionalLayers, two web maps) — none building/sketch named |
| County GIS | `maps.co.bastrop.tx.us` Cadastral_BP | Parcels only | Layer 0 BCAD_Parcels, 65,283 features |

EagleView mosaic layers in the BCAD web map (visual roof outlines at zoom, not attributes):

- `2015 EagleView Mosaic`, `2019 EagleView Mosaic`, `2022 EagleView Mosaic`, `2024 EagleView Mosaic` (Pictometry WMTS via `svc.pictometry.com`)

### Four-point probe — primary CAD service (RECOMMENDED parcel + footprint recon anchor)

**Service:** `https://services.arcgis.com/aS4XD9PgZha28y8P/arcgis/rest/services/BastropCADWebService/FeatureServer`

| Probe | Result |
|---|---|
| 1. Layer list | 0 Parcels, 1 Abstracts, 2 Subdivisions, 3 School Districts, 4 City Limits, 5 Lot Lines, 6 Streets, 7 Bastrop County Boundary, 8 Texas Counties — **no building/structure/sketch layer** |
| 2. Fields (layer 0) | `prop_id` (Integer), `prop_id_text` (String), `file_as_name`, `legal_acreage`, `hood_cd`, `school`, `city`, `county`, `next_appraisal_dt`, … |
| 3. Sample query | `prop_id=34785` → **1 feature**; attrs include `prop_id=34785`, `file_as_name`, `legal_acreage` |
| 4. Count | **65,285** parcels (layer 0, `returnCountOnly=true`) |

Proxy URL (same data, higher traffic on eSearch go-links for other counties):  
`https://utility.arcgis.com/usrsvcs/servers/3c3898a5ef9a46caa69d8fd34de0f488/rest/services/BastropCADWebService/FeatureServer`

### Four-point probe — county-hosted parcel mirror

**Service:** `https://maps.co.bastrop.tx.us/server/rest/services/Cadastral_BP/Bastrop_County_Parcels/FeatureServer/0`

| Probe | Result |
|---|---|
| 1. Layer list | Single layer 0 `BCAD_Parcels` |
| 2. Fields | `objectid`, `prop_id`, `prop_id_text`, `file_as_name`, … (matches BIS schema) |
| 3. Sample | `prop_id=34785` → 1 feature |
| 4. Count | **65,283** |

### Bulk download (not fetched; noted for follow-on)

- `https://bastropcad.org/data-downloads/` — BIS data export portal (shapefile/FGDB; may include sketch layers not published to REST). **Follow-on:** accept-disclaimer fetch + inventory layer names before claiming absence in bulk.

### BCAD routing recommendation

| Tier | Source | Use |
|---|---|---|
| **Now (vector footprints)** | Microsoft Global ML Building Footprints (Texas partition) | County-wide ML-derived polygons; join to parcel via spatial intersection + provenance chip `sourceTier=ml-derived` |
| **Parcels (existing)** | BastropCADWebService/0 or Cadastral_BP/0 | Unchanged cadastral spine |
| **Follow-on** | bastropcad.org data export | Check for Improvement Sketch / Building Footprint shapefile not on REST |
| **Do not use for footprints** | EagleView WMTS | Imagery only; no footprint attributes |
| **Do not use for footprints** | CAMA tabular improvement rows | Area sqft per component; not parcel-footprint geometry |

---

## Per-county / jurisdiction table (onboarded set + DFW spot check)

Legend: **CAD-FP** = CAD-authoritative footprint polygon layer on public REST. **ML** = ML-derived fallback required. **ABSENT** = no footprint layer found (REST).

| Jurisdiction | FIPS | CAD / parcel REST (known-good) | Building-like layers on REST | Four-point footprint probe | Quality tier | Recommended routing |
|---|---|---|---|---|---|---|
| Bastrop city + county | 48021 | BastropCADWebService/0 (65,285) | **NONE** | Parcels probed; prop_id 34785 OK | **ABSENT** → **ML** | Global ML primary; bulk export follow-on |
| Elgin (city cohort) | 48021 | Same BCAD service | **NONE** | Same as Bastrop | **ABSENT** → **ML** | Same as Bastrop |
| Caldwell | 48055 | Caldwell_CAD_Parcel_Map/1 Parcels (27,463) | False positives only: layer 44 "Fire Station-EMS Building" (points), layer 38 "Improvement_Districts" (special districts — **not** building footprints) | No footprint polygon layer | **ABSENT** → **ML** | Global ML |
| Guadalupe | 48187 | GuadalupeCADWebService/0 (98,925) | **NONE** | prop_id 53150 OK | **ABSENT** → **ML** | Global ML |
| McLennan | 48309 | McLennanCADWebService/0 (116,146) | **NONE** (has Easement Lines/9 — easements rail, not footprints) | prop_id 420532 OK | **ABSENT** → **ML** | Global ML |
| Bell | 48027 | BellCADWebService/0 (169,398) | **NONE** | prop_id 496496 OK | **ABSENT** → **ML** | Global ML |
| Comal | 48091 | Comal_County_Parcels/40 (92,549) | **NONE** | PROP_ID 60213 OK | **ABSENT** → **ML** | Global ML (stale TNRIS-lineage parcel layer — separate parcel concern) |
| Williamson | 48491 | county_wcad_parcels/0 (290,344) | **NONE** | PropertyID 67611 OK | **ABSENT** → **ML** | Global ML |
| Hays | 48209 | No live CAD REST (_inbox/2026-08-04_county_fan_cadastral_recon_) | n/a | n/a | **ABSENT** → **ML** | Global ML + StratMap parcels |
| Bexar (DFW) | 48029 | maps.bexar.org Parcels/0 (710,772) | **NONE** | PropID 344800 OK | **ABSENT** → **ML** | Global ML |
| Tarrant (DFW) | 48439 | mapit.tarrantcounty.com TADParcels/0 | **NONE** (parcel only) | Not sampled | **ABSENT** → **ML** | Global ML; Dallas/Tarrant use bulk zip for parcel ingest per DFW recon |
| Dallas (DFW) | 48113 | Bulk zip primary (DCAD); no stable public FeatureServer found in quick search | n/a | n/a | **ABSENT** → **ML** | Global ML |

**DFW 9-county pattern (quick check):** Same as Central TX BIS/non-BIS parcel services — **parcel polygons only**, no building footprint layer on the public REST services probed (Bexar, Tarrant). Collin/Denton had no `bis_*` ArcGIS Online org hits; expect same ML fallback unless city GIS publishes footprints.

---

## Quality tier doctrine

| Tier | Label | Definition | Confidence / provenance | When to use |
|---|---|---|---|---|
| **A** | `cad-authoritative` | CAD or county GIS building/improvement sketch polygons maintained for appraisal | Highest for footprint shape; cite CAD layer + vintage + prop_id join method | When REST or bulk export exposes sketch/footprint layer with prop_id (or joinable account key) |
| **B** | `city-gis-authoritative` | City planning/building footprint layer (not CAD) | High within city limits; cite city layer | City-only cohorts (e.g. San Marcos `BuildingFootprint` exists on city planning MapServer — **not** probed live this pass; out of onboarded county set) |
| **C** | `ml-derived` | Microsoft Global ML / Overture / legacy USBuildingFootprints | ML-derived; must carry model vintage + "not survey/CAD" disclaimer | **Default for all onboarded counties** until Tier A found |
| **D** | `honest-absence` | No public footprint source for county | Named absence atom; no silent fill | Uninhabited/unbuilt parcels, counties with zero ML intersection after good-faith join |

**Routing rule:** Prefer A over B over C. Never present C as CAD. Never use USA Structures points as footprint polygons.

---

## National fallback sources

### Microsoft Global ML Building Footprints (PRIMARY fallback)

| Item | Detail |
|---|---|
| Access | `https://github.com/microsoft/GlobalMLBuildingFootprints` — `dataset-links.csv` (country + quadkey `.csv.gz` files, geojsonl inside) |
| Legacy US state zip | `https://minedbuildings.z5.web.core.windows.net/legacy/usbuildings-v2/Texas.geojson.zip` — **10,678,921** buildings (README; vintage mixed, focal refresh 2019-2020 in highlighted regions) |
| Coverage | Texas statewide |
| Quality tier | **C — ml-derived** |
| Join | Spatial intersection (and optionally centroid-in-parcel) to `{fips}:{prop_id}` nodes; store source vintage + release tag on atom |
| License | Open Data Commons Attribution License (ODC-By) |

### Microsoft US Building Footprints v2 (legacy sibling)

Same lineage as Global ML; state-level zips. Prefer Global ML quadkey partitions for incremental county onboarding.

### Overture Maps — buildings theme (SECONDARY)

| Item | Detail |
|---|---|
| Access | `https://overturemaps.org` — buildings theme as GeoParquet on Azure/S3 (`release/` paths) |
| Coverage | Global including US |
| Quality tier | **C — ml-derived** (conflates OSM + ML) |
| Use | Cross-check / refresh path; not primary unless Global ML gap analysis says otherwise |

### USA Structures — USGS National Map (NOT for footprints rail)

| Item | Detail |
|---|---|
| REST | `https://carto.nationalmap.gov/arcgis/rest/services/structures/MapServer` |
| Content | **Point** landmarks (schools, fire stations, hospitals, …) — 40+ sublayers, all points or group labels |
| Quality tier | N/A for footprints — wrong geometry type |
| Use | Points-of-interest overlay only; do not use for site-plan building footprint |

---

## Counts (program planning)

| Metric | Count |
|---|---|
| Onboarded jurisdictions probed | 11 (+ DFW spot check 2) |
| Counties with **CAD-authoritative** footprint REST layer | **0** |
| Counties requiring **ML fallback** for vector footprints | **11** (all probed) |
| BCAD public REST footprint layer | **Not found** (parcels yes, footprints no) |

---

## Recommended next steps (not in scope for this read-only pass)

1. **Bastrop bulk export recon** — inventory `bastropcad.org/data-downloads` export layers for sketch/footprint shapefiles (may unlock Tier A without REST).
2. **Bastrop pilot** — ingest Global ML footprints for 48021; spatial join to parcel nodes; serve with `ml-derived` provenance chip; cert on Jones/Higgins block (pairs with T1 envelope re-warm).
3. **Registry row** — add `footprintSourceUrl`, `footprintSourceTier`, `footprintLayerId`, `footprintJoinField` to county recipe (preflight probe: fail-closed if tier C not declared).
4. **Contract shape** — geometry-bearing data atom keyed to `parcelNodeId` + `sourceTier` + vintage (T3 WS3).

---

## Probe command log (verbatim samples)

```text
# BCAD layer list
curl.exe -sS "https://services.arcgis.com/aS4XD9PgZha28y8P/arcgis/rest/services/BastropCADWebService/FeatureServer?f=json"

# BCAD count
curl.exe -sS ".../BastropCADWebService/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json"
→ {"count":65285}

# BCAD sample 34785
curl.exe -sS ".../FeatureServer/0/query?where=prop_id%3D34785&outFields=*&f=json"
→ 1 feature, prop_id=34785

# Bell / Guadalupe / McLennan — same pattern, 0 building layers
# USA Structures — polygon layer absent; points only
```

Batch probe script (repro): `_scratch/footprint_batch_probe.py` (2026-08-05).
