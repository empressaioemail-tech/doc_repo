---
title: County Fan Cadastral Recon — 8-County Parcel Service Source Table
date: 2026-08-04
status: recon-complete
author: recon executor subagent (planner-dispatched, read-only)
scope: Bell 48027, Bexar 48029, Comal 48091, Guadalupe 48187, Hays 48209, McLennan 48309, Travis 48453, Williamson 48491
purpose: per-county source table for planner to author registry rows for the county-fan cadastral parcel pickup, analog to Bastrop Cadastral_BP/FeatureServer/0 and Caldwell_CAD_Parcel_Map/FeatureServer
---

# County Fan Cadastral Recon

Method: web search to locate each county's live CAD/GIS ArcGIS service, then direct read-only GET probes (service metadata `?f=json`, field list, `returnCountOnly=true` count query, and a 2-record field-value sample). No writes, no auth attempted beyond anonymous public access. All requests succeeded anonymously (no token/WAF friction encountered) unless noted.

StratMap baseline counts pulled from `P:\doc_repo\_land_records\txgio_stratmap_county_matrix_2026-08-02.json` (vintage 2025-03 to 2025-08, per-county `vintage_yyyymm` noted below).

## Summary table

| County | FIPS | Service URL | Layer | prop-id field | Sample value | Live count | StratMap count | Confidence |
|---|---|---|---|---|---|---|---|---|
| Bell | 48027 | `https://services7.arcgis.com/EHW2HuuyZNO7DZct/arcgis/rest/services/BellCADWebService/FeatureServer` | 0 (Parcels) | `prop_id` (Integer) / `prop_id_text` (String) | 496496 / "496496" | 169,398 | 167,441 (vintage 202503) | CONFIRMED |
| Bexar | 48029 | `https://maps.bexar.org/arcgis/rest/services/Parcels/MapServer` | 0 (Parcels) | `PropID` (Double) + `AcctNumb` (String, CAD account format) | PropID 344800.0 / AcctNumb "05489-000-0010" | 710,772 | 709,541 (vintage 202507) | CONFIRMED |
| Comal | 48091 | `https://services6.arcgis.com/eNPJk90aMrXNOKF8/arcgis/rest/services/Comal_County_Parcels/FeatureServer` | 40 (Comal_County_Parcels — only layer in service) | `PROP_ID` (String) | "60213" (GEO_ID "520216012800", FIPS "48091") | 92,549 | 103,537 (vintage 202503) | CONFIRMED, see caveat |
| Guadalupe | 48187 | `https://services9.arcgis.com/1l4hbpt78hjlsIcl/arcgis/rest/services/GuadalupeCADWebService/FeatureServer` | 0 (Parcels) | `prop_id` (Integer) / `prop_id_text` (String) | 53150 / "53150" | 98,925 | 95,571 (vintage 202503) | CONFIRMED |
| Hays | 48209 | none found — see NOT-FOUND notes | n/a | n/a | n/a | n/a | 117,427 (vintage 202503) | NOT-FOUND (CAD-native); one stale CANDIDATE found |
| McLennan | 48309 | `https://services8.arcgis.com/5e4b1SY8bogTc3pH/arcgis/rest/services/McLennanCADWebService/FeatureServer` | 0 (Parcels) | `prop_id` (Integer) / `prop_id_text` (String) | 420532 / "420532" (geo_id "440016000672030") | 116,146 | 115,362 (vintage 202503) | CONFIRMED |
| Travis | 48453 | `https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/TCAD/MapServer` | 0 (TCAD Parcels) | `PROP_ID` (Integer) | 177373 (geo_id "0174230307") | 386,682 | 834,936 (vintage 202508) | CONFIRMED but flag large divergence, see caveat |
| Williamson | 48491 | `https://gis.wilco.org/arcgis/rest/services/public/county_wcad_parcels/MapServer` | 0 (WCAD Parcels) | `PropertyID` (String, integer-shaped) — also `PARCELID` (CAD account format) | PropertyID "67611" / PARCELID "R008912" | 289,494 | 282,983 (vintage 202507) | CONFIRMED |

## Per-county detail

### Bell (48027) — CONFIRMED
- Service: `https://services7.arcgis.com/EHW2HuuyZNO7DZct/arcgis/rest/services/BellCADWebService/FeatureServer`, owner `bis_bellcad` on ArcGIS Online (BIS Consultants vendor tenant — same vendor family as Bexar's `services7.arcgis.com/BUFM2kw4MpxDUJVh` and Guadalupe's `bis_guadalupecad`).
- Layer 0 "Parcels" (service also carries Abstracts, City Limits, Subdivisions, School Districts, Lot Lines, Land Hook, Military Boundary, Streets, Bell County Boundary, Texas Counties — 11 layers total, id 0-10).
- objectIdField `ObjectID_1`. `prop_id` (esriFieldTypeInteger) is the primary key; `prop_id_text` is the string mirror. Both match the `{fips}:{propId}` node convention's expected integer-shaped propId directly.
- Live count via `returnCountOnly=true`: 169,398. StratMap 167,441 (vintage 202503). Ratio 1.012 — tight agreement, live is marginally ahead as expected (CAD live vs 5-month-stale StratMap snapshot).
- Auth/rate posture: fully public, anonymous GET succeeded on metadata, field query, and count query. No WAF/throttle behavior observed across ~3 requests.
- Same-source hypothesis: strong — BIS Consultants is a known CAD-GIS vendor whose exports likely feed TNRIS/StratMap ingestion too, so this is probably the same underlying CAD roll repackaged, not an independent source. Count alignment supports this.

### Bexar (48029) — CONFIRMED
- Two Bexar services surfaced: (a) county-run `https://maps.bexar.org/arcgis/rest/services/Parcels/MapServer` (layer 0 "Parcels", data source "Bexar County Appraisal District (BCAD)"), and (b) a hosted ArcGIS Online copy at `https://services7.arcgis.com/BUFM2kw4MpxDUJVh/ArcGIS/rest/services/Bexar_CAD_Parcels/FeatureServer/3` (layer 3, fields Prop_ID + GEO_ID, "acquired by TxGIO July 2025 / processed September 2025" — i.e. this second one is itself a StratMap-vintage repackage, not an independent CAD-live source).
- Recommend the county-run `maps.bexar.org` service as the primary CAD-live record: objectIdField `OBJECTID`, `PropID` (esriFieldTypeDouble, e.g. 344800.0) as the numeric prop id, `AcctNumb` (String, e.g. "05489-000-0010") as the CAD account/legal parcel id.
- Live count on maps.bexar.org layer 0: 710,772. StratMap 709,541 (vintage 202507, same month TxGIO acquired the BUFM2kw4MpxDUJVh copy). Ratio 1.002 — very tight, consistent with maps.bexar.org and the StratMap 202507 vintage being close-to-simultaneous pulls from the same BCAD roll.
- Auth/rate posture: fully public, no token required, no WAF friction across 4 requests (service metadata, layer metadata, field sample, count).
- Same-source hypothesis: very likely the same source — the StratMap 202507 vintage date lines up almost exactly with the "acquired July 2025" note on the ArcGIS Online mirror, and the maps.bexar.org live count tracks StratMap within 0.2%.

### Comal (48091) — CONFIRMED with caveat
- Service: `https://services6.arcgis.com/eNPJk90aMrXNOKF8/arcgis/rest/services/Comal_County_Parcels/FeatureServer`, single layer id 40 named "Comal_County_Parcels". Description states data "originates from Comal County Appraisal District via Harris Govern and is distributed through TNRIS DataHub as part of an annual statewide land parcel program," acquired January 2021, with standardized field mapping documentation — this is explicitly a **TNRIS/StratMap-lineage repackage**, not a county-CAD-operated live service. No independent Comal-CAD-run ArcGIS REST endpoint was found (Comal County's own GIS presence is an ArcGIS Enterprise portal at `cceo.co.comal.tx.us/arcgispor/` behind web apps, and an opendata.arcgis.com hub that did not expose a discoverable Parcels REST layer directly in this recon pass — see caveat below).
- Fields: objectIdField `FID`, `PROP_ID` (String, length 70, e.g. "60213"), `GEO_ID` (String, e.g. "520216012800"), `FIPS` (String, "48091" confirmed in sample) — FIPS field directly present and correct, a useful cross-check not seen in the other counties' schemas.
- Live count: 92,549 vs StratMap 103,537 (vintage 202503) — ratio 0.894, an 11% gap. This is a real divergence worth flagging: either this hosted layer is a stale/partial extract (2021 acquisition date noted in its own description, well before the 2025 StratMap vintage) or it excludes some parcel classes StratMap includes. Recommend treating this as CANDIDATE-strength on freshness even though field/schema match is CONFIRMED-strength; the planner should decide whether to accept this or hold Comal for a direct county GIS contact.
- Auth/rate posture: fully public, anonymous, no friction across 3 requests.
- Same-source hypothesis: yes on lineage (both trace to Harris Govern/CAD export via TNRIS), but the live layer is evidently a stale (2021) snapshot rather than a fresh independent CAD-live feed — so despite being "the same source" it is NOT fresher than StratMap and may in fact be staler.

### Guadalupe (48187) — CONFIRMED
- Service: `https://services9.arcgis.com/1l4hbpt78hjlsIcl/arcgis/rest/services/GuadalupeCADWebService/FeatureServer`, owner `bis_guadalupecad` (same BIS Consultants vendor pattern as Bell). A companion `GuadalupeCADWebService_Public` also exists on `utility.arcgis.com` (ArcGIS Server-hosted, likely the CAD's own on-prem-adjacent public endpoint) and a `GuadalupeCADLocatorService` geocoder — not probed, out of scope for this recon.
- Layer 0 "Parcels" (service also carries Abstracts, Subdivisions, Schools, City Limits, Lot Lines, Streets, Guadalupe County Boundary, Texas Counties, MUD — 10 layers, id 0-9).
- objectIdField `ObjectID_1`. `prop_id` (Integer, e.g. 53150) / `prop_id_text` (String mirror) — identical schema shape to Bell and McLennan (confirms the BIS Consultants template is shared verbatim across their CAD client tenants).
- Live count: 98,925 vs StratMap 95,571 (vintage 202503) — ratio 1.035, good agreement.
- Auth/rate posture: fully public, anonymous, no friction across 4 requests. Note the service caps at 2,000 records per query (standard ArcGIS Online hosted-layer default) — any bulk pull will need paging.
- Same-source hypothesis: same as Bell — likely the same underlying CAD roll that also feeds TNRIS, given the shared vendor and tight count alignment.

### Hays (48209) — NOT-FOUND (CAD-native live service)
- Searched: Hays CAD official site (`hayscad.com/maps/`, `hayscad.com/data-downloads/`), Hays County GIS Open Data Portal (`hays-county-haysgis.hub.arcgis.com`), ArcGIS Online org search for `owner:bis_hayscad` (0 results — Hays CAD does not appear to use the BIS Consultants vendor template that Bell/Bexar/Guadalupe use), and a general web app viewer link.
- One CANDIDATE found and probed: `https://gis.urbaneng.com/arcgis/rest/services/HaysCountyParcels/FeatureServer`, layer 0 "Hays County 2020," explicitly described as "Hays County Texas Parcels Shapefile Download 07102020" — a static 2020 snapshot hosted by a private engineering firm (Urban Engineering), not the CAD or county GIS department. Its schema is also thin/joined (TARGET_FID, JOIN_FID, Class, RefName, GlobalID, PROP_ID as String) consistent with a derived join layer rather than the CAD's authoritative parcel roll. Not recommended as the registry source.
- Recommendation: this recon pass did not surface Hays CAD's authoritative live ArcGIS service (if one exists publicly, it may sit behind the `hays-county-haysgis.hub.arcgis.com` open data portal under a dataset title not matched by the search terms tried, or Hays CAD may not publish a public ArcGIS REST parcel service at all — some CADs only offer a downloadable shapefile via `hayscad.com/data-downloads/`, which was not fetched in this recon since it is a bulk download, not a REST service). Flag for a follow-up direct browse of `hayscad.com/data-downloads/` and the Hays open data hub's dataset catalog (not attempted here to stay within the modest per-county request budget and the ArcGIS-REST-only remit of this task).
- StratMap fallback available regardless: 117,427 (vintage 202503) if the registry needs to proceed on StratMap alone for Hays pending a live-service find.

### McLennan (48309) — CONFIRMED
- Service: `https://services8.arcgis.com/5e4b1SY8bogTc3pH/arcgis/rest/services/McLennanCADWebService/FeatureServer`, "McLennan CAD Web Service." Same BIS Consultants schema template as Bell/Guadalupe (12 layers: Parcels, Abstracts, Subdivisions, School District Boundaries, City Limits, Lot Lines, Streets, McLennan County Boundary, Texas County Boundaries, Easement Lines, Easement Text, Address Points — id 0-11).
- Layer 0 "Parcels". objectIdField `ObjectID_1`. `prop_id` (Integer, e.g. 420532) / `prop_id_text` (String mirror), plus `geo_id` populated (e.g. "440016000672030" — this county's geo_id field is populated, unlike Bell's sample where geo_id was null).
- Live count: 116,146 vs StratMap 115,362 (vintage 202503) — ratio 1.007, tight agreement.
- Auth/rate posture: fully public, anonymous, no friction across 4 requests.
- Same-source hypothesis: same BIS vendor pattern as Bell/Guadalupe; tight count match supports same-roll-as-StratMap.

### Travis (48453) — CONFIRMED, flag large count divergence
- Service: `https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/TCAD/MapServer`, layer 0 "TCAD Parcels." County-run (Travis County Transportation & Natural Resources Department), description states "Obtained from Travis Central Appraisal District (TCAD) & assembled & updated monthly by TNR" — this is the authoritative county-operated mirror of TCAD's roll, analogous to Bastrop's own FeatureServer pattern. A `TCAD_public` FeatureServer variant on the same host 500'd on `?f=json` ("Server object extension 'featureserver' not found") — that variant is not usable; the MapServer form works.
- Also found a hosted-org copy at `https://services1.arcgis.com/HGcSYZ5bvjRswoCb/arcgis/rest/services/TCAD_Selected_Locations/FeatureServer/0` (not probed — named "Selected Locations," likely a curated subset, not the full parcel roll).
- Fields: objectIdField `OBJECTID`, `PROP_ID` (Integer, e.g. 177373), `geo_id` (String, e.g. "0174230307") populated.
- Live count: 386,682. StratMap count: 834,936 (vintage 202508 — the newest vintage of any county in this set, per the matrix's `last_modified: Thu, 12 Feb 2026`). **This is a major divergence — StratMap shows roughly 2.16x the TCAD MapServer live count.** This does not fit the "CAD live vs StratMap vintage, order-of-magnitude should agree" expectation; something is structurally different between the two datasets for Travis specifically (possible explanations, unverified: the county TNR mirror may exclude certain parcel classes, e.g. condo/unit records or right-of-way parcels that TCAD's full roll includes; or the "monthly assembled" TNR process may deduplicate or filter differently than TCAD's raw appraisal roll that feeds StratMap; or StratMap's Travis 202508 vintage pulled a materially different extract). Flag this explicitly for the planner — recommend NOT treating the TCAD MapServer count as validated against StratMap without further investigation, even though the service and field-level probe both succeeded cleanly (hence CONFIRMED on mechanics, but the count anomaly is unresolved).
- Auth/rate posture: fully public, anonymous, no friction across 4 requests (one 500 on the dead `TCAD_public` variant, not a WAF block, an application-level service misconfiguration).

### Williamson (48491) — CONFIRMED
- Service: `https://gis.wilco.org/arcgis/rest/services/public/county_wcad_parcels/MapServer`, layer 0 "WCAD Parcels," county-run (gis.wilco.org), description "parcels data is updated daily."
- Fields: objectIdField `OBJECTID`. Multiple candidate id fields present: `PARCELID` (String, length 30, CAD account format e.g. "R008912"), `PropertyNumber` (String, length 255, dash-formatted e.g. "R-07-1000-0004-0007"), `PropertyID` (String, length 20, integer-shaped e.g. "67611" — this is the field matching the txgio prop_id shape), `LOWPARCELID` (String, likely a normalized join key), `QuickRefID`.
- Live count: 289,494 vs StratMap 282,983 (vintage 202507) — ratio 1.023, good agreement.
- Auth/rate posture: fully public, anonymous, no friction across 3 requests.
- Same-source hypothesis: likely yes given tight count alignment, though Williamson does not use the BIS Consultants schema template (its own county-run gis.wilco.org publishing pipeline), so the underlying export chain is less immediately obvious than for the BIS-vendor counties. Recommend `PropertyID` as the propId-matching field, not `PARCELID`.

## Cross-county pattern notes

Three of the eight counties (Bell, Guadalupe, McLennan) run on an identical field template (`ObjectID_1`, `prop_id`/`prop_id_text`, `hood_cd`, `abs_subdv_cd`, `geo_id`, etc.) published through ArcGIS Online tenants owned by `bis_<countycad>` accounts — this is the BIS Consultants CAD-GIS vendor pattern already noted as the Bastrop/Caldwell precedent in the task brief. Bexar and Williamson are independently county-run (maps.bexar.org, gis.wilco.org) with their own schemas but comparable prop-id fields. Comal's only found layer is explicitly a TNRIS/Harris Govern repackage from 2021, not a county-live service, and is stale relative to StratMap. Travis is county-run (gis.traviscountytx.gov, TNR-assembled monthly from TCAD) but shows an unresolved 2.16x undercount versus StratMap's newest-vintage (202508) figure. Hays returned no usable live CAD/county service in this pass.

## Confidence rollup

CONFIRMED (6): Bell, Bexar, Guadalupe, McLennan, Travis (mechanics confirmed, count divergence flagged), Williamson.
CONFIRMED with caveat (1): Comal (schema/fields confirmed; live layer is a stale 2021 snapshot, count 11% below StratMap).
NOT-FOUND (1): Hays (no CAD-native live ArcGIS service located; one weak private-firm 2020-snapshot CANDIDATE found and not recommended; StratMap-only fallback available).
