---
id: 2026-08-05_T3_easement_source_recon
title: T3 Workstream 2 — easement / utility ROW source recon (read-only)
date: 2026-08-05
status: finding
owner: nick
read_only: true
workstream: T3 catch-up program 2026-08-05
related: [2026-07-26_v2_sourcing_recon_bastrop, 2026-08-04_county_fan_cadastral_recon]
probe_timestamp: 2026-08-05T19:30Z
---

# T3 — Easement source recon

Read-only recon across onboarded jurisdictions: probe county (and city, where onboarded) GIS REST for easement / utility / ROW / plat-easement layers; note utility-district and state pipeline/CCN sources where discoverable without relationship asks; document honest-absence and document-parse tracks separately.

**Prior Bastrop finding stands for county REST:** no county-wide recorded-easement feature layer; easements live in recorded plats/deeds (`_inbox/2026-07-26_v2_sourcing_recon_bastrop.md`). This pass extends that pattern across the breadth cohort and adds municipal / CAD-derived / state-utility nuance.

## Verdict rollup (per jurisdiction)

| Jurisdiction | FIPS | Easement source verdict | Queryable GIS? | Notes |
|---|---|---|---|---|
| **Bastrop County** | 48021 | **Honest-absence (county)** + **document-parse** + utility-adjacent pipeline layer | County: no. PipelinePlus: yes (not parcel easement) | City of Bastrop municipal easement layer exists separately (148 polys) — not county coverage |
| **Elgin** (city) | 48021 / 48453 ETJ | **Honest-absence (GIS)** + **document-parse** | No public REST found | PDF/Web AppBuilder maps only; GIS vendor TRC — no discoverable easement FeatureServer |
| **Guadalupe County** | 48187 | **Honest-absence** + utility-adjacent (MUD / water districts) | MUD polygons only (4) | BIS CAD Web Service has no easement layers; TrueAutomation CAD map has Water Districts only |
| **Caldwell County** | 48055 | **Honest-absence** + utility-adjacent (CCN / MUD) | CCN service areas (42 statewide subset in map service) | No easement layer in Caldwell County Parcel Map FeatureServer (85 layers scanned) |
| **McLennan County** | 48309 | **CAD-derived plat easement linework** (partial GIS rail) + **document-parse** for gaps | Yes — Easement Lines (44,197) + Easement Text (16,578) | BIS CAD layers; TYPE=UTILITY/UE, partial DOC_NUM; survey linework not a dedicated easement registry |
| **Comal County** | 48091 | **Honest-absence** + **document-parse** | No county easement layer found | County GIS hosts (`cceo.co.comal.tx.us`, `maps.co.comal.tx.us`) 404; hosted AGOL org polluted with non-Comal projects |
| **Williamson County** | 48491 | **Honest-absence (county)** + **document-parse**; municipal easement layers in cities | County `gis.wilco.org`: no easement service | Round Rock (1,254) and Cedar Park (8,400) city easement polygons — ETJ/municipal only |
| **Hays County** | 48209 | **Honest-absence** + **document-parse** | No easement layer on `maps.co.hays.tx.us` | County REST is thin (address locator, concept plans, vendor booths); San Marcos / Kyle REST not found |
| **Bell County** | 48027 | **Honest-absence** + **document-parse** | BIS CAD Web Service: 11 layers, zero easement | County Engineer maps available on request, not as public easement REST |

### Rail definitions used in this doc

| Rail | Meaning | Ingest posture |
|---|---|---|
| **Queryable easement layer** | County or city FeatureServer/MapServer whose primary semantics are property/utility easements (polygons or labeled easement linework with type/doc fields) | GIS adapter rail |
| **CAD-derived plat easement** | Easement geometry digitized from recorded plats into CAD/GIS (McLennan pattern) | GIS rail with document lineage; coverage = CAD digitization completeness |
| **Utility-adjacent** | Pipelines, CCN franchise areas, MUD boundaries — encumbrance-adjacent but **not** parcel-level recorded easement | Separate rail; do not conflate with property easement atoms |
| **Document-parse track** | Recorded plats, deeds, subdivision PDFs at county clerk (scanned, no bulk API) | OCR + geometry extraction; non-uniform coverage |
| **Honest-absence** | Public REST catalog probed; no easement/utility-easement/ROW-easement layer published |

---

## Method

For each jurisdiction:

1. **Service catalog probe** — walk county (and onboarded city) ArcGIS REST roots and ArcGIS Online org search for `easement`, `utility`, `ROW`, `plat`, `pipeline`, `CCN`, `MUD`.
2. **Four-point probe** (where a candidate layer exists): (a) layer metadata `?f=json`, (b) field list, (c) `returnCountOnly=true`, (d) 1–2 record attribute sample.
3. **Utility cross-cut** — state RRC pipeline posture, PUCT CCN statewide layers, TxDOT commercial-use note from prior recon.
4. **Classification** — layer vs CAD-derived vs document-only vs honest-absence.

All requests anonymous public GET; no relationship asks.

---

## Per-county findings

### Bastrop County (48021)

**County REST:** `https://maps.co.bastrop.tx.us/server/rest/services`

| Probe | Result |
|---|---|
| Easement / utility easement / ROW easement layer | **Not found** (Transportation, Planning, RoadAndBridgeMap, Cadastral folders) |
| Prior recon confirmation | Matches 2026-07-26 Bastrop v2 recon |
| PipelinePlus | **Found** — polyline, 10,085 features, RRC T-4-derived operator pipelines |
| Document-parse | Bastrop County Clerk recorded plats/deeds — scanned PDFs, no API (`cc.co.bastrop.tx.us/RealEstate`, TexasFile) |

**Four-point probe — PipelinePlus** (`RoadAndBridgeMap/PipelinePlus/FeatureServer/0`):

- Geometry: polyline
- Count: 10,085
- Key fields: `operator`, `commodity`, `diameter`, `t4permit`, `county_name`, `status`
- Sample: Energy Transfer natural-gas transmission, Bastrop county FIPS 021

**Verdict:** County = **honest-absence** for recorded easement GIS + **document-parse track**. PipelinePlus = **utility-adjacent** (regulatory pipeline centerlines, not plat easement polygons).

**Municipal note (City of Bastrop, not county):** `https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Easements_/FeatureServer/43`

- Name: Easements (polygons), count **148**
- Fields: `Status` (DRAINAGE, SIDEWALK/PUE, …), `Dedication` (With Plat), `StName`, sparse deed/record fields
- Service description: "City of Bastrop, Texas easements"
- Final Plats layer (4 polys) links to scanned plat JPGs on city site

City easements are **municipal GIS rail** — ETJ/city limits subset only; do not treat as county coverage.

---

### Elgin (city — onboarded jurisdiction)

Elgin spans Bastrop and Travis counties; city GIS is contracted (TRC GIS per city PDF map metadata).

| Probe | Result |
|---|---|
| Public ArcGIS REST | **Not found** — `maps.trcgis.com`, `gis.trcgis.com`, `gis.cityofelgin.com` all failed |
| City web maps | Static PDF zoning/ward maps (`elgintexas.gov/DocumentCenter`) — Web AppBuilder exports, not queryable easement layers |
| Easement FeatureServer | **Not discovered** |

**Verdict:** **Honest-absence (GIS)** + **document-parse track** (Bastrop/Travis county clerk plats/deeds). No relationship-free queryable easement layer.

---

### Guadalupe County (48187)

**Primary CAD REST:** `https://services9.arcgis.com/1l4hbpt78hjlsIcl/arcgis/rest/services/GuadalupeCADWebService/FeatureServer`

| Layer id | Name | Easement? |
|---|---|---|
| 0–8, 9 | Parcels, Abstracts, Subdivisions, Schools, City Limits, Lot Lines, Streets, Boundaries, **MUD** | No easement layer |
| 9 MUD | 4 polygon features (`MUD04`, etc.) | Utility district boundary — **utility-adjacent** |

**TrueAutomation Harris Govern map:** `GuadalupeMapSearchNoLabels/MapServer` — only **Water Districts** (layer 21); no easement layer.

**Verdict:** **Honest-absence** for easement GIS + **document-parse track**. MUD / water districts = utility-adjacent only.

---

### Caldwell County (48055)

**Primary REST:** `https://services.arcgis.com/rVxY74DxxIDrDbc0/arcgis/rest/services/Caldwell_County_Parcel_Map/FeatureServer`

Layers scanned for easement/utility/ROW/plat/CCN keywords across full service (85 layers):

| Layer | Name | Count | Classification |
|---|---|---|---|
| 0 | Municipal Utility Districts | (boundary) | utility-adjacent |
| 39 | Maxwell Special Utility District | polygon | utility-adjacent |
| 40 | County Line SUD Water CCN area | polygon | utility-adjacent |
| 84 | CCN_WATER_PUCT_TSMS_2025 | 42 | PUCT water CCN service areas (multi-county subset) |

**Four-point probe — CCN_WATER_PUCT_TSMS_2025:**

- Fields: `CCN_NO`, `UTILITY`, `COUNTY`, `STATUS`, `CCN_TYPE`
- Sample utilities span Guadalupe, Hays, etc. — statewide CCN extract embedded in county map service

**Verdict:** **Honest-absence** for parcel easement layer + **document-parse track**. CCN/MUD = **utility-adjacent** (franchise service areas, not recorded easement geometry).

---

### McLennan County (48309)

**Primary REST:** `https://services8.arcgis.com/5e4b1SY8bogTc3pH/arcgis/rest/services/McLennanCADWebService/FeatureServer`

**Only breadth-county with explicit easement layers in CAD GIS:**

| Layer id | Name | Geom | Count | Key fields |
|---|---|---|---|---|
| 9 | Easement Lines | polyline | 44,197 | LENGTH, ANGLE, DISTANCE (CAD survey linework) |
| 10 | Easement Text | polyline | 16,578 | TYPE (UTILITY, UE), WIDTH, LABEL_DESC (UE, UTILITY), DOC_NUM (partial) |

**Four-point probe — Easement Text:**

- Sample: `TYPE=UTILITY`, `WIDTH=10'`, `LABEL_DESC=UE`
- DOC_NUM populated on subset (e.g. `2005030214`, `976/540`); many records null

**Verdict:** **CAD-derived plat easement linework** — queryable GIS rail, but sourced from CAD digitization of plat annotations, not a county easement registry with full deed metadata. Treat as **partial GIS rail** alongside **document-parse track** for clerk source of truth. Strongest easement GIS signal in this cohort after municipal layers.

---

### Comal County (48091)

| Probe target | Result |
|---|---|
| `cceo.co.comal.tx.us/arcgis/rest/services` | 404 |
| `maps.co.comal.tx.us/arcgis/rest/services` | DNS/connect fail |
| Hosted parcels (`Comal_County_Parcels` on `services6.arcgis.com/eNPJk90aMrXNOKF8`) | Parcels only; TNRIS 2021 repackage per 2026-08-04 cadastral recon |
| AGOL search `owner:comal easement` | 0 results |
| New Braunfels city REST (`gis.newbraunfels.gov`, `gis.nbtexas.org`) | Not found |

**Verdict:** **Honest-absence** — no county recorded-easement layer discovered on public REST without relationship asks + **document-parse track** (Comal County Clerk / New Braunfels municipal records).

---

### Williamson County (48491)

**County REST:** `https://gis.wilco.org/arcgis/rest/services/public`

Public folder enumerates 35+ services (parcels, subdivisions, streets, railroad, water body, …). **No easement or utility-easement service.**

**Municipal easement layers (ETJ cities — not county coverage):**

| City | URL | Count | Sample fields |
|---|---|---|---|
| Round Rock | `maps.roundrocktexas.gov/.../Easements/MapServer/0` | 1,254 | Grantor, Grantee, Type (Water/Wastewater), Recordation_Num, Doc_Path → Williamson clerk TylerHost |
| Cedar Park | `gis.cedarparktexas.gov/.../Easements/FeatureServer/0` | 8,400 | PlanID, PlanName, EasementType (Drainage, Water, …) |

**Roadbond / corridor ROW (not easement registry):** background scan also hit `roadbond/WilCo_Parcel_ROW_Prod` (2,459 polys) and `WilCo_ROW_Prod` — these are **road-bond corridor acquisition parcels** (`PROJECT_NAME`, `PARCEL_STATUS: Closed Parcel`), not recorded utility/plat easement geometry. Classify as ROW-adjacent infrastructure planning, not easement atom source.

**Verdict:** County = **honest-absence** + **document-parse**. Municipal easement GIS exists in incorporated cities only — separate municipal rail, not county fan-out.

---

### Hays County (48209)

**County REST:** `https://maps.co.hays.tx.us/arcgis/rest/services`

Folders: DevelopmentServices (address locator), Hosted (concept plans, vendor booths), Utilities (empty). **No easement layer.**

| Probe | Result |
|---|---|
| Hays open data hub easement tag search | No datasets returned |
| San Marcos / Kyle city REST | Not found on probed hosts |
| Stale candidate (Urban Engineering 2020 parcels) | Out of scope — not easement |

**Verdict:** **Honest-absence** + **document-parse track** (Hays County Clerk; San Marcos zoning/easement may exist behind undiscovered city GIS).

---

### Bell County (48027)

**Primary REST:** `https://services7.arcgis.com/EHW2HuuyZNO7DZct/arcgis/rest/services/BellCADWebService/FeatureServer`

| Layer ids 0–10 | Parcels, Abstracts, City Limits, Subdivisions, Schools, Lot Lines, Streets, Boundaries | **No easement** |

Bell County Engineer (`bellcountytx.com/departments/engineer/maps.php`): maps available in ArcGIS format **by contacting the office** — not a public easement REST endpoint.

**Verdict:** **Honest-absence** on public REST + **document-parse track**. Possible future GIS-on-request path is relationship-adjacent — out of scope for uniform public-record rail.

---

## State / regional utility sources (cross-cutting)

### Texas RRC pipelines

| Source | Access | Easement relevance |
|---|---|---|
| RRC Public GIS Viewer | `https://gis.rrc.texas.gov/GISViewer/` — interactive map, nightly update | Pipeline centerlines; **not** parcel easement polygons |
| RRC digital map download | County shapefiles, updated twice weekly (`rrc.texas.gov/.../data-sets-available-for-download/`) | Bulk download rail; no state REST API discovered (`gis.rrc.texas.gov/arcgis/rest` → 404) |
| Harris County mirror | `gis.hctx.net/.../TXRRC/Pipelines/MapServer/0` | Third-party host; metadata says **last acquired 2017** — stale |
| Bastrop PipelinePlus | County-hosted RRC-derived layer (see Bastrop) | Same T-4 lineage, fresher county copy |

**Note:** RRC data locates permitted pipelines for safety/excavation notification — not a substitute for recorded utility easements on private parcels.

### TxDOT

Per prior Bastrop v2 recon: TxDOT Open Data roadways carry **commercial-use / no-resale / no-redistribution** licensing (`gis-txdot.opendata.arcgis.com`). ROW geometry is highway ROW, not private utility easement. Licensing check required before product use.

### PUCT CCN (water / sewer franchise areas)

| Source | URL | Count | Classification |
|---|---|---|---|
| PUCT Water CCN Service Areas (statewide) | `services2.arcgis.com/LYMgRMwHfrWWEg3s/.../PUCT_Water_CCN_Service_Areas/FeatureServer/0` | 3,812 | Utility-adjacent — bounded **service area**, not easement |
| Caldwell embedded CCN layer | Caldwell County Parcel Map layer 84 | 42 | Same lineage |
| City of Bastrop CCN | `services7.arcgis.com/qOeXJdBtGknaCJC4/.../CCN_Utility/FeatureServer/0` | 3 | Municipal utility CCN boundaries |

CCN polygons answer "who may serve water/sewer here" — not "where is the 10' utility easement on this lot."

---

## Strategic read

1. **Pattern holds:** recorded **property** easements are overwhelmingly **document-parse track** at county level. Only McLennan exposes CAD-digitized plat easement linework at county scale in this cohort.
2. **Do not overclaim utility layers:** PipelinePlus, RRC downloads, PUCT CCN, and MUD boundaries are **utility-adjacent** — useful context rails, not easement atom substitutes.
3. **Municipal splits matter:** City of Bastrop, Round Rock, and Cedar Park publish real easement polygons — but ETJ/city-limits scoped. County fan-out cannot assume municipal coverage.
4. **McLennan is the GIS exception:** Easement Lines + Easement Text warrant a pilot adapter with explicit CAD-lineage provenance and honest partial DOC_NUM coverage grading.
5. **Elgin gap:** onboarded city with no public REST easement path — document-parse + Bastrop/Travis clerk remains the uniform rail.

---

## Recon artifacts / evidence URLs

- Bastrop County REST: https://maps.co.bastrop.tx.us/server/rest/services
- Bastrop PipelinePlus: https://maps.co.bastrop.tx.us/server/rest/services/RoadAndBridgeMap/PipelinePlus/FeatureServer/0
- City of Bastrop Easements: https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Easements_/FeatureServer/43
- Caldwell Parcel Map: https://services.arcgis.com/rVxY74DxxIDrDbc0/arcgis/rest/services/Caldwell_County_Parcel_Map/FeatureServer
- Guadalupe CAD: https://services9.arcgis.com/1l4hbpt78hjlsIcl/arcgis/rest/services/GuadalupeCADWebService/FeatureServer
- McLennan CAD (easement layers 9–10): https://services8.arcgis.com/5e4b1SY8bogTc3pH/arcgis/rest/services/McLennanCADWebService/FeatureServer
- Williamson public GIS: https://gis.wilco.org/arcgis/rest/services/public
- Hays County GIS: https://maps.co.hays.tx.us/arcgis/rest/services
- Bell CAD: https://services7.arcgis.com/EHW2HuuyZNO7DZct/arcgis/rest/services/BellCADWebService/FeatureServer
- RRC data downloads: https://www.rrc.texas.gov/resource-center/research/data-sets-available-for-download/
- PUCT Water CCN: https://services2.arcgis.com/LYMgRMwHfrWWEg3s/arcgis/rest/services/PUCT_Water_CCN_Service_Areas/FeatureServer
- Prior Bastrop recon: `_inbox/2026-07-26_v2_sourcing_recon_bastrop.md`

---

## Per-county one-line verdicts (operator pickup)

| County / city | Verdict |
|---|---|
| Bastrop 48021 | **Honest-absence (county easement layer)** · document-parse · pipeline utility-adjacent · city easements municipal-only |
| Elgin | **Honest-absence (GIS)** · document-parse |
| Guadalupe 48187 | **Honest-absence** · MUD/water-district utility-adjacent · document-parse |
| Caldwell 48055 | **Honest-absence** · CCN/MUD utility-adjacent · document-parse |
| McLennan 48309 | **CAD-derived plat easement linework (partial GIS)** · document-parse for gaps |
| Comal 48091 | **Honest-absence** · document-parse |
| Williamson 48491 | **Honest-absence (county)** · municipal easements in Round Rock/Cedar Park only · document-parse |
| Hays 48209 | **Honest-absence** · document-parse |
| Bell 48027 | **Honest-absence** · document-parse |

**Doc path:** `P:\doc_repo\_inbox\2026-08-05_T3_easement_source_recon.md`
