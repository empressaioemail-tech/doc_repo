---
title: PARCEL-SCOUT-GIS source inventory
date: 2026-09-02
status: reference
---

# PARCEL-SCOUT-GIS source inventory

Step-4 scouting for six declared-ahead rails (`schoolDistrict`, `utilityService`, `overlayDistricts`,
`agValuation`, `maxImperviousCoverPct`, `treeProtection`) against `RAILS_V2_DECLARED_AHEAD` in
`src/lib/parcel-record-engine/rail-keys.js`. READ-ONLY: no purchases, no store writes, no credentialed
portal. Every URL below was fetched live by the researching agent on 2026-09-02 unless marked
"found via search, not independently fetched." A claim without a fetchable citation is not in this
inventory. Where a fetch failed (403/404/DNS), that is reported as a **read-path failure**, not as
"the data doesn't exist" — those are different claims and this document keeps them separate.

## 1. `schoolDistrict` — strong, statewide, ready to card

**Primary source: TEA-hosted ArcGIS Hub mirror of the Texas Legislative Council's "School Districts 2025."**

- Landing page: `https://schoolsdata2-tea-texas.opendata.arcgis.com/datasets/TEA-Texas::school-districts-2025-`
- Live REST endpoint (verified): `https://services2.arcgis.com/5MVN2jsqIrNZD4tP/arcgis/rest/services/Map/FeatureServer/0`
- Direct downloads (verified links): shapefile / GeoJSON / CSV, all under `.../api/download/v1/items/edbb3c145304494382da3aa30c154b5e/<format>?layers=0`
- Format: ArcGIS FeatureServer + direct shapefile/GeoJSON/CSV/KML
- Vintage: item last edited **2026-01-06**, "Current Version: 12," 2024-2025 school year
- Coverage: statewide (all six program counties)
- License: item's own `licenseInfo` field is **empty** (confirmed by direct fetch). The prior-version items in the same lineage carry an informational-use-only disclaimer (quoted verbatim below) but that text is not confirmed attached to this specific 2025 item:
  > "This map was updated by the Texas Education Agency in February 2022. It is for informational purposes only and has not been prepared for, nor is it suitable for, legal or engineering purposes."
- Cost: $0, no auth
- Fetch mechanism: direct file download or REST query (supports `where`, `outFields`, GeoJSON output, pagination)
- Feature count: **1,017 polygons statewide**, confirmed via live `returnCountOnly=true` query
- Join key: `GEOID20` (7-digit Census GEOID), `DISTRICT`/`DISTRICT_C` (Texas County-District `CCC-DDD` code — the same code format already carried on Texas CAD parcel records, a candidate attribute join, not just spatial), `NCES_DISTR` (NCES LEAID crosswalk), `NAME`/`NAME20`.

**Cross-check source: NCES EDGE School District Boundaries.**

- Live layer: `https://nces.ed.gov/opengis/rest/services/School_District_Boundaries/EDGE_SCHOOLDISTRICT_TL25_SY2425/MapServer/1`
- Vintage: 2024-2025 (TIGER/Line 2025 base)
- Texas feature count: **1,018**, confirmed via live query — near-exact match to the primary source, a useful independent corroboration
- License: not found as explicit text (federal EDGE program; do not assume public domain without a page that states it)
- Join key: `GEOID` (crosswalks directly to Source 1's `GEOID20`)

**Rejected / not usable directly:**
- TEA's own "Geographic Data" page is stale (references 2009-2010 data) and has no download link — TEA is the legal authority for boundary *descriptions* per Texas Education Code §13.010, but the Texas Legislative Council (mirrored in the primary source above) is the operational GIS distributor.
- Texas Legislative Council's own portal (`data.capitol.texas.gov`) returned HTTP 403 to the fetcher on every path — not needed since the TEA Hub mirror above serves the identical dataset with no auth.
- TxGIO/TNRIS (`data.geographic.texas.gov`) returned 403; no TxGIO-specific school-district holding was found distinct from the TLC/TEA data already sourced.

**Open item:** ~1,017-1,018 features vs. Texas's ~1,200+ total LEAs — the gap is very likely open-enrollment charter authorities, which typically have no discrete boundary polygon since they operate inside a host ISD's boundary. Flag on the acquisition card; don't assume the statewide layer is missing real ISDs.

**Verdict: genuinely acquirable, free, live, two independently cross-checked sources. Recommend carding directly.**

## 2. `utilityService` — split verdict: water/sewer strong, electric weaker/federal, gas does not exist as GIS data

**Water & sewer: PUCT CCN (Certificate of Convenience and Necessity) polygons — REAL, verified via three independent live mirrors.**

- Canonical PUCT page (found via search, blocked to fetcher with HTTP 402 on every attempt — a fetcher-side bot block, not evidence the page doesn't exist): `https://www.puc.texas.gov/industry/water/utilities/gis/Default.aspx`
- **Mirror 1 (TWDB, most official-adjacent):** `https://services.twdb.texas.gov/arcgis/rest/services/PWS/Public_Utility_Commission_CCN_Water/MapServer` — layer 0 `PUC_CCN_WATER`. Fields: `TYPE, CCN_NO, UTILITY, COUNTY, STATUS, CCN_TYPE`. Metadata "Last Updated" **October 1, 2021**, though the same description claims quarterly updates — a real vintage discrepancy, not resolved this pass.
- **Mirror 2 (Harris County GIS):** `https://www.gis.hctx.net/arcgishcpid/rest/services/State/PUC_CCN_Sewer_Water/MapServer` — separate Water Service Areas (layer 1) and Sewer Service Areas (layer 2) polygons, explicit copyright "Public Utility Commission of Texas."
- **Mirror 3 (Esri Hub):** `https://services6.arcgis.com/N6Lzvtb46cpxThhu/ArcGIS/rest/services/Sewer_CCN_Service_Areas/FeatureServer/230` — underlying-data note says "Data Last Updated: December 11, 2015" (treat as the more trustworthy vintage signal than a mirror-sync timestamp).
- Format: shapefile per the PUCT page description, served live as ArcGIS FeatureServer/MapServer REST (polygon) on all three mirrors
- Coverage: statewide, includes all six program counties (CCN certificates exist wherever a non-municipal retail water/sewer utility operates — common in unincorporated growth areas across all six)
- License: no verbatim license text found on any of the three mirrors (a copyright attribution line on Mirror 2 is not a license grant)
- Cost: $0, no auth on any mirror
- Join key: spatial only (point-in-polygon of parcel centroid). Attribute fields available for classification once joined: `UTILITY`, `CCN_NO` (leading digit distinguishes water=1/sewer=2), `CCN_TYPE`, `STATUS`, `COUNTY`

**Electric: no PUCT-native GIS layer found; best public polygon source is a federal HIFLD dataset, unconfirmed live.**

- All six program counties confirmed inside the ERCOT deregulated grid footprint (Travis/Williamson/Hays as "ERCOT's Central Texas hub"; Bastrop served in part by Oncor; McLennan/Waco confirmed Oncor-delivered, ERCOT deregulated retail market). Inside ERCOT, "who serves you" splits into a TDU (regulated wires monopoly) and a REP (competitive retail seller) — there is no single CCN-style polygon the way there is for water/sewer.
- PUCT's own electric maps (`puc.texas.gov/industry/maps/electricity/Default.aspx`, and a PDF mirror at `ftp.puc.texas.gov/.../tdumap.pdf`) are described in search results as static cartographic PDFs (CREZ map, TDU-in-competitive-areas map) — **no ArcGIS REST endpoint for PUCT's own TDU boundaries was found anywhere**, unlike the water/sewer CCN data. This is a real, structural gap, not a search failure.
- Best actual candidate: **HIFLD "Electric Retail Service Territories"** (federal, DHS). Catalog page fetched directly: `https://catalog.data.gov/dataset/electric-retail-service-territories`. Last updated **2026-10-24** per data.gov. License URL (directly fetched field): `https://www.usa.gov/government-works`. A REST endpoint was identified (`https://maps.nccs.nasa.gov/mapping/rest/services/hifld_open/energy/FeatureServer/26`) but **could not be verified live** — the researching agent's DNS could not resolve that host (explicit `ENOTFOUND`), a tool-network limitation, not proof the endpoint is dead. **The field list reported for this source (utility name, ZIP, NAICS code, etc.) is from secondary search-result descriptions, not an independently confirmed fetch — flagged explicitly as the one source in this inventory that did not clear the "actually fetch to confirm" bar.**
- ERCOT itself has no GIS/open-data portal for TDU boundaries — only static market/pricing map images.
- Rural electric co-ops (Pedernales Electric Cooperative, Bluebonnet Electric Cooperative — both materially relevant, covering large unincorporated portions of these six counties) file service-area boundary maps with PUCT's Interchange system, found via search only, likely PDF exhibits rather than a live GIS layer; Bluebonnet's own public map page returned 403 to the fetcher.

**Gas: no public GIS polygon-level source exists — confirmed structural absence, not a search gap.**

- Texas gas distribution is not organized under an exclusive-certificated-territory model. Jurisdiction splits between the municipality (franchise ordinance, original jurisdiction) and the Railroad Commission of Texas (rates outside municipal limits, pipeline safety) — this is franchise-based, not polygon-based.
- RRC's own public GIS viewer publishes oil & gas well/pipeline/administrative-district layers; nothing describing gas distribution retail-territory polygons was found.
- **If this rail is ever filled, it needs a different mechanism than GIS acquisition** (e.g., franchise-city boundary + a self-published utility territory map, which would not be authoritative GIS data). Reported as a genuine structural gap per the every-record-full-shape doctrine, not a sourcing failure to keep chasing.

**Verdict: water/sewer is a strong, ready-to-card source (three redundant live mirrors). Electric is buildable but weaker (one federal source, unverified live endpoint) and is NOT a PUCT source the way water/sewer is. Gas has no GIS acquisition path and should stay unaccounted with that basis on record.**

## 3. `overlayDistricts` — 12 of 18 in-scope cities confirmed with a real, distinct layer

Checked against all 18 cities already holding a real base-zoning layer (`tx_zoning_district_staging`).

| City | Overlay/historic layer(s) found | Feature count | Notes |
|---|---|---|---|
| Austin | PARD Historic Resource Polygons, NCCD, ETOD Overlay, ~15 more named overlays (Capitol View Corridors, Barton Springs, Lake Austin, CURE, Airport, Convention Center, Downtown Plan Districts, Scenic Roadways, Waterfront, West Campus, etc.) | 324 (PARD); 2 (ETOD); others not individually counted | Richest single-city find by breadth. PARD layer is park-property historic resources, not a citywide district-boundary layer — locally-designated Historic (-H) combining districts appear as an attribute on the base zoning layer, not a standalone layer. |
| Waco | Sanger Heights Conservation Overlay, West End District Overlay, + Brazos River Corridor / Downtown / La Salle Avenue District / University Overlay (service confirmed, not field-verified) | 1 (Sanger Heights) | Bare ArcGIS Server, no license/metadata page found. |
| Round Rock | Zoning Overlays (Historic (H), Chisholm Trail (CT), Palm Valley (PV)) | not queried | Verbatim license: "The City of Round Rock cannot guarantee the accuracy of the data contained in this layer..." Fields: `OVERLAY`, `NAME`, `ORD_NO`, `YEAR_`, `ACRES`. |
| Georgetown | National Register Districts (4), Historic Overlay-Area 1 (1), Local Historic Landmarks, Downtown Overlay-Area 2, Recorded Texas Landmarks, Other Historical Designations, Courthouse View Corridors, Gateway Overlay, Gateway Image Corridors | 4 (National Register); 1 (Historic Overlay Area 1) | **Richest schema of any city checked** — 8+ named historic/overlay layers on one bare ArcGIS Server. |
| Bastrop | Historical District; also Character Districts / Place Type Zoning Districts (Building Block Code, overlay-like but not historic-specific) | 1 (Historical District) | One of our six home counties. |
| San Marcos | Historic District (7), Overlay District (3); large adjacent CodeSMTX family (River Corridor, River Protection Zone, Stormwater Management District, Central Business Area, CONA Boundary, Historic Annexation, Historic Marker, Neighborhood Character Study Areas) | 7 (Historic); 3 (Overlay) | Largest overlay-adjacent family besides Austin. |
| Kyle | ZoningOverlays (`Overlay_District`, `Ordinance`, `Ord_Date` fields) | not queried | Not historic-specific but a genuine, well-attributed overlay layer. |
| Cedar Park | Zoning - Corridor Overlay | not queried | Sparse schema (ID/GlobalID/geometry only, no name field) — district identity likely lives in symbology, not data. No historic-specific layer found. |
| Pflugerville | Zoning Overlay District (Old Town, "685," Business Park overlays named in description) | not queried | Not historic-specific; no separate historic layer found. |
| Hutto | Historical Overlay District ("Historic Overlay District (H)"), Gateway Overlay Zoning District | 1 (Historical) | |
| Taylor | Overlay (generic layer within a broader Zoning FeatureServer) | not queried | Not historic-specific. |
| Buda | Zoning Overlay (Oct 2017), Buda Historic District (Oct 2017); plus a separate "Historic Buda" ArcGIS Experience app apparently containing HPC survey/Certificate-of-Appropriateness records | not queried | Two clean, well-described FeatureServer layers with explicit descriptions. |

**Not found / unconfirmed (6 of 18):**
- **Leander** — genuine confirmed negative. Correct Hub domain identified (`gis-leander.hub.arcgis.com`); its 37-dataset DCAT feed contains no historic/landmark/preservation/conservation/design-district layer of any kind.
- **Lockhart** — city references a "Historic Landmarks Zoning Map" but the downloads page 404'd after a domain redirect; no ArcGIS Hub or REST service surfaced. Likely PDF-only; not conclusively ruled out (a GIS coordinator contact was found: Christine Banda, 512-398-3461).
- **Robinson** — no GIS Hub/portal/REST service surfaced; zoning appears to be PDF exhibits plus a non-open-data clickable map only.
- **Elgin** — served through Bastrop County's GIS org; the zoning district list found (A, C1, C2, C3, PDD, R1, R3) shows no overlay/combining-district codes.
- **Dripping Springs** — Municode confirms a legal "Overlay Districts" section and a Historic Overlay ("H") designation exists on the zoning map/PDF, but no Hub/opendata portal or REST layer surfaced.
- **Liberty Hill** — inconclusive; a page reference to an "Open Data Hub" resolved to an invalid-looking domain that is very likely a fetch/summarization artifact, not a real URL. Needs a direct follow-up, not trusted as either a positive or negative finding.

**Verdict: strong, broad hit — 12 of 18 cities have a real, fetchable, distinct overlay and/or historic-district layer. Georgetown, San Marcos, and Buda are the most promising for a near-term acquisition card (richest schemas, cleanest license/description text). The 6 unconfirmed cities need one more direct-fetch pass or a phone check before being written off, except Leander which is a clean confirmed negative.**

## 4. `agValuation` — one strong hit (Williamson), rest unconfirmed or gated

- **Williamson CAD (WCAD) — FOUND, strong.** Socrata open-data API: `https://data.wcad.org/resource/2ckt-cqwj.json` ("Land - PropertyDataExport"), with sibling datasets for Exemptions and a geometry-bearing Parcels layer (`an3x-cnmw`). Live sample confirmed real, populated fields: `agflag:"Y"`, `statecode:"D1"` (the statewide-standard "qualified open-space agricultural land" code), `landtype` (e.g. "Native Pasture I", "Wasteland"), acreage and dollar values. Join key: `propertyid` (matches the Parcels dataset's `PropertyID`, which carries `the_geom`). No stated license in the Socrata metadata; site-level disclaimer at `wcad.org/data-disclaimer/` ("as is," no warranty). Cost $0, no auth. ~305,879 total land records in the dataset.
- **Travis CAD — right-shaped field, not confirmed populated.** Live ArcGIS layer `https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/TCAD_Travis_County_Property/MapServer/3` carries `land_state_cd` and `land_type_desc` fields (architecturally where a D1 code would live) but no populated ag value was confirmed live in this pass. TCAD's separate bulk "Certified Data Export" (pipe-delimited flat file) is a more likely actual location for ag status; not verified this pass.
- **Bastrop, Caldwell, McLennan, Hays CAD — not confirmed as GIS/API sources.** Bastrop and Caldwell each have a real, confirmed ArcGIS parcel layer, but neither carries an ag/exemption attribute (pure geometry/ID fields). McLennan CAD has no open-data or REST endpoint at all — only a paywalled interactive viewer and third-party resellers (Regrid, Dynamo Spatial, TaxNetUSA Pro), none confirmed free. Hays CAD's downloads page returned HTTP 403 to the fetcher (possible bot-block, not confirmed as a real paywall); a separate Hays County GIS Hub page would not render its catalog through the fetch tool.
- **Statewide reference (not a data source, but the methodology authority):** Texas Comptroller / PTAD (`comptroller.texas.gov/taxes/property-tax/ag-timber/`) — Form 50-129, the Manual for Appraisal of Agricultural Land, and the Wildlife Management guidelines. The D1/D2 state category codes themselves are documented in the statewide EARS Record Layout and Instructions Manual (mirrored live on TCAD's own site); a TaxNetUSA cross-reference sheet explicitly disclaims "State codes are not standardized across all counties in Texas — verify with your local appraisal district."

**Verdict: genuinely acquirable for exactly one of six counties today (Williamson, via the WCAD Socrata portal). The other five require either a bulk flat-file CAD export (Bastrop, plausible) or remain unconfirmed/possibly-gated (Caldwell, McLennan, Hays) or need the export-flat-file path re-checked (Travis). This is a per-CAD acquisition problem, not a solved statewide one.**

## 5. `maxImperviousCoverPct` — zone classification is acquirable; the percent value itself is not a GIS attribute anywhere

- **City of Austin watershed regulation classification — FOUND.** Live ArcGIS layer: `https://services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/BOUNDARIES_watershed_regulation_areas/FeatureServer/0` (Socrata mirror also live). Last modified 2025-09-18. Key field `WATERSHED_DEVELOPMENT_TYPE`, confirmed live values: `BSZ` (Barton Springs Zone), `Suburban`, `Urban`, `Water Supply Rural`, `Water Supply Suburban`. **Important caveat: this gives the regulatory zone, not the impervious-cover-percent number itself** — the percent-by-zone table lives in Austin's Land Development Code Chapter 25-8 text, not in this layer's attributes. A downstream job would need a small hand-built zone-to-percent crosswalk.
- **Edwards Aquifer Recharge Zone (TCEQ, statewide regulatory trigger) — FOUND.** Austin mirror confirmed live: `https://data.austintexas.gov/Locations-and-Maps/Edwards-Aquifer-Recharge-Zone/ahuv-whai`. Original TCEQ metadata record confirms "This dataset belongs to TCEQ and is public information." A direct TCEQ download link 404'd this pass; the interactive TCEQ Map Viewer is an alternate access path, not fetched. County/city-specific downstream mirrors exist (Cedar Park, Williamson County) as re-publications of the same boundary.
- **Hays County / Dripping Springs specific impervious-cover layer — NOT FOUND.** The rule is confirmed to exist in ordinance text (per-plat "impervious cover exhibit" requirement) but is administered per-permit, not published as a standing zone layer.

**Verdict: the regulatory-zone layers (Austin watershed classification, Edwards Aquifer recharge/contributing zone) are real, free, and acquirable — but they answer "which regulatory regime applies," not "what is the percent limit." Filling this rail with an actual number requires a small manually-built ordinance crosswalk on top of the zone join, for Austin at least; every other jurisdiction checked is administered per-permit with no GIS layer at all.**

## 6. `treeProtection` — Austin only, and only as a permit-event log, not a parcel census

- **Austin Issued Tree Permits — FOUND, strong for what it is.** Socrata dataset: `https://data.austintexas.gov/Building-and-Development/Issued-Tree-Permits/ac2h-ha3r`. License (verbatim): "Open Data Commons Public Domain Dedication and License" (`http://opendatacommons.org/licenses/pddl/1.0/`). 54,007 total records. Live sample confirmed a populated `heritage_tree` boolean field, species, trunk diameter, coordinates. Join key: address field or spatial point-in-parcel.
  **Critical caveat, stated plainly: this is a permit-EVENT log, not a parcel-level census.** A parcel with a protected/heritage tree that has never had a permit action filed against it will not appear in this dataset at all. It answers "has this address had a heritage-tree-relevant permit," never "does this parcel currently have a protected tree." Absence here is not evidence of absence.
- **No spatial tree-preservation ZONE layer found anywhere** (Austin or otherwise) — Austin's protection is administered tree-by-tree via a per-tree DBH/species/critical-root-zone process, not a zoned overlay, so a zone-shaped GIS layer likely does not exist because the underlying ordinance isn't zone-shaped.
- **Round Rock and Georgetown both have real, specific tree ordinances** (Round Rock §3.1100, 8"+ DBH; Georgetown 12"+ DBH protected / 26"+ DBH + species = heritage) but **no GIS source was found for either** — text ordinance only.

**Verdict: acquirable only for Austin, and only as an incomplete permit-event log rather than a true parcel-level registry. Every other city checked (and, by the pattern found, likely the remainder of the 18) has text-only ordinances with no spatial layer. If this rail matters enough to fill even partially, Austin's permit log is the only real candidate, with the incompleteness caveat carried into the cell's own basis/provenance if it's ever converted from unaccounted.**

## Cross-cutting notes

- Every "not found" finding above distinguishes a **confirmed absence** (a portal was checked and genuinely has nothing, e.g. Leander's overlay layers) from a **read-path failure** (403/404/DNS failure prevented verification, e.g. `hayscad.com`, `tceq.texas.gov/gis/download-data.html`, the HIFLD electric REST endpoint). Treat the latter as open items for a follow-up fetch, not as negative findings.
- No purchase was made and no credentialed portal was entered anywhere in this scouting pass, per the card's authorization.
- Every URL, feature count, and field name above was independently fetched by the researching agent unless explicitly marked "found via search, not independently fetched" or "not individually field-checked" — those markers are load-bearing, not decorative.
