---
id: 2026-09-02_parcel-scout-ossf_inventory
title: OSSF/septic + Travis living-area scout — Factory six-county extension
date: 2026-09-02
kind: inbox-scoping
related: [_inbox/2026-07-15_ossf_septic_records_access_survey, _queue/cards/parcel-scout-ossf]
owner: nick
---

# PARCEL-SCOUT-OSSF close inventory

Read-only scout, card `parcel-scout-ossf` (F-01, hauska-factory). Extends the 2026-07-15
OSSF survey to the Factory's actual six-county footprint and separately scouts the Travis
`livingAreaSqft` zero-read. Probes run 2026-09-02 (WebSearch/WebFetch, sub-agent research
independently re-verified at three load-bearing URLs — see CP2). Every claim below carries
a source.

## Footprint correction

The 2026-07-15 survey covers 7 counties (Comal 48091, Travis 48453, Bexar 48029, Hays
48209, Williamson 48491, Bastrop 48021, Caldwell 48055). The Factory's actual six-county
footprint (per `thesis_parity_ledger.md` 2026-07-24 entry and the CELL-LEDGER dispatch's
`livingAreaSqft` figures) is **Bastrop 48021, Caldwell 48055, Hays 48209, Travis 48453,
Williamson 48491, McLennan 48309**. Comal and Bexar are out of scope; McLennan had zero
prior coverage. This scout closes that gap rather than re-deriving the five overlapping
counties from zero — the July entries for Bastrop, Caldwell, Hays, Travis (access-route
row only) and Williamson are carried forward as-is, NOT re-verified this session except
where noted below, and should be treated as ~7-weeks-stale if used for anything
consequential.

## McLennan County (48309) — net new

| Field | Finding | Source |
|---|---|---|
| Authorized Agent | Waco-McLennan County Public Health District, Environmental Health / OSSF Program, 401 Franklin Ave, Waco TX 76701. McLennan Commissioners Court is the formal TCEQ Authorized Agent entity; the Health District is Designated Representative. Phone (254) 299-2473 verified live on the program page. A second number, (254) 299-2405, appeared in a search snippet and is UNVERIFIED — flagged, not stated as fact. | [waco-texas.com OSSF program page](https://www.waco-texas.com/Departments/Health-District/Environmental-Health/On-Site-Sewage-Facilities-Program) (fetched and independently re-verified) |
| Access route | No online portal, no MGO integration. Verified by direct fetch and full link enumeration of the OSSF program page: only a blank permit-application PDF and contact info, no search tool. Route is phone/email (OSSF@wacotx.gov) / in-person to the OSSF office directly. | Same page, re-verified |
| Queryable by | N/A — no query tool exists to test. | — |
| Site-plan / record format | Blank application is a standard fillable PDF. The county's 2009 OSSF adoption order is CCITT-fax scanned (raster), consistent with older adopted-rule records being scans, not structured data. No confirmed format for an actual filed septic record (none was reachable to sample). | [OSSF permit application](https://www.waco-texas.com/files/sharedassets/public/v/8/departments/health-district/documents/enviro-health/ossf-permit-app.pdf); [2009 OSSF Order](https://www.mclennan.gov/DocumentCenter/View/591/2009-OSSF-Order-PDF) |
| Per-parcel OSSF GIS layer | Not found. Checked county parcel viewer (propaccess.trueautomation.com) and several third-party GIS/parcel vendors covering McLennan; none carry a septic feature layer. Consistent with the July survey's finding that no county exposes one. | Search sweep; verified absence, not an unchecked gap |
| Edwards Aquifer overlay | Does not apply. TCEQ's §285.40 / 30 TAC §213 Edwards Aquifer Protection Program covers only Medina, Bexar, Comal, Kinney, Uvalde, Hays, Travis, Williamson — McLennan is well outside. | [TxDOT summary of TCEQ Edwards Aquifer requirements](https://www.txdot.gov/manuals/cst/cah/environment/water_resources-cfadfcff/complying_with_tceqrequirements_for_work_over_the_.html) |
| Difficulty tier | **Tier 3 — PIR/direct-contact only, no portal.** Weaker than Tier 2 (no gated portal exists at all to log into) but stronger than "unreachable" (the custodian office and contact channel are clearly identified). | — |
| Open item | Waco's city EnerGov Citizen Self Service portal (selfservice.wacotx.gov) is a JS-rendered SPA that could not be evaluated for anonymous search capability by the tooling used, AND belongs to city Inspection Services (building permits) rather than the county Health District that runs OSSF. Needs a real-browser manual check before ruling it in or out; not assumed either way. | [selfservice.wacotx.gov/EnerGov/SelfService/#/home](https://selfservice.wacotx.gov/EnerGov/SelfService/#/home) — needs manual check |

McLennan joins Caldwell in Tier 3 (PIR-only). Updated tier picture across the Factory six:
Tier 1 none (Comal, the prior flagship Tier-1 county, is out of Factory scope); Tier 2 Hays,
Williamson (both MGO-gated, per July survey, not re-verified this session); Tier 3 Bastrop,
Caldwell, McLennan; Travis access-route not carried forward as a tier here since this
session's Travis research targeted `livingAreaSqft`, not OSSF (Travis OSSF tier from July
was Easy-Medium / effectively Tier 1-2, not re-verified this session).

## Travis livingAreaSqft — 0 of 500,307 at TCAD source

**Root cause identified, not merely hypothesized.** TCAD publishes the "Improvement
Details Report 2026" as a product SEPARATE from the certified appraisal export (confirmed
live on traviscad.org/publicinformation — listed with no format-spec link attached, unlike
the certified/supplemental exports which link an Export Layouts spec). The certified roll's
base property file carries only improvement dollar values, never area. Living area lives
one file deeper, in the improvement-DETAIL file (`APPRAISAL_IMPROVEMENT_DETAIL.TXT` /
`IMP_DET.TXT`, field `imprv_det_area numeric(15)`), per the shared True Automation PACS
"Appraisal Export Layout" that Travis and numerous other Texas CADs use (TCAD's own copy is
a zip; read via a peer CAD's identical-family copy, Kaufman CAD's dated 2025-01-21). That
same layout document states plainly that the improvement-detail file's presence "depends on
what option the user chose when building the cd" — i.e. it is possible to receive a
certified-roll export that structurally never contained this file. **The 0-of-500,307 read
is consistent with an ingest that pulled the certified export only, not a null/blank field
on parcels that were queried** — the file the field lives in was never in the file set.
`imprv_det_area` is per improvement-detail-record, not per-property, so consuming it
correctly requires filtering to main-dwelling detail-type code(s) rather than summing every
detail row (porches, garages, etc. carry their own rows).

One open item: the live delimiter/format of TCAD's actual export files is unconfirmed —
TCAD's own product-page prose describes the "Standard Appraisal Export" generally as ASCII
comma-delimited, while the True Automation layout document (filename family
"Legacy8.0.33") documents a fixed-width positional structure. This may be an older/legacy
layout track coexisting with a newer delimited product. Not resolved this session; resolving
it requires downloading and inspecting the actual TCAD zip, out of scope for a
citation-only scout.

**Fallback/proxy: City of Austin Open Data "Issued Construction Permits."** Verified live
(dataset id `3syk-w9eu`): 2,373,377 rows, license USGOV_WORKS (public domain), fields
include a direct parcel-level join key (**TCAD ID**) plus **Total Existing Bldg SQFT**,
**Remodel Repair SQFT**, **Total New Add SQFT**, address, lat/long, issue/complete dates.
**Coverage limitation: City-of-Austin-jurisdiction permits only** — this does NOT cover
unincorporated Travis County or other Travis municipalities (Lakeway, Pflugerville portions,
etc.), so it is a partial proxy at best and cannot substitute for a countywide field.

Other candidates checked and found insufficient: Travis County's GIS Hub / MapServer parcel
layer carries building-footprint polygons, but they date to 2012-2013 orthoimagery/LiDAR
digitizing and a populated sqft attribute on them could not be confirmed. A third-party
commercial source (Regrid) reportedly carries a calculated footprint-sqft attribute at
roughly 87% coverage — noted only as a data point; this operation's standing ruling is that
Regrid is a retired/dead source and this is not a recommendation to re-adopt it.

**Recommendation:** pull TCAD's "Improvement Details Report 2026" as a distinct ingest
target (not a re-request of the certified export), parse `imprv_det_area` filtered to
main-dwelling detail-type codes, and treat the City of Austin permits dataset as a narrow,
city-limited cross-check / gap-fill for parcels inside Austin city limits only — never as
the primary source for a countywide field.

## Sources (verbatim)

- https://traviscad.org/publicinformation (fetched directly, re-verified)
- https://traviscad.org/opengovernment/
- https://kaufman-cad.org/wp-content/uploads/2025/01/Appraisal-Export-Layout-8.0.30-01212025.pdf
- https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu
- https://data.austintexas.gov/api/views/3syk-w9eu.json (fetched directly, re-verified)
- https://tnr-traviscountytx.opendata.arcgis.com/
- https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/TCAD_Travis_County_Property/MapServer
- https://www.waco-texas.com/Departments/Health-District/Environmental-Health/On-Site-Sewage-Facilities-Program (fetched directly, re-verified)
- https://www.waco-texas.com/files/sharedassets/public/v/8/departments/health-district/documents/enviro-health/ossf-permit-app.pdf
- https://www.mclennan.gov/DocumentCenter/View/591/2009-OSSF-Order-PDF
- https://www.mclennan.gov/382/Public-Record-Copy-Requests
- https://www.txdot.gov/manuals/cst/cah/environment/water_resources-cfadfcff/complying_with_tceqrequirements_for_work_over_the_.html
- https://selfservice.wacotx.gov/EnerGov/SelfService/#/home (needs manual check, JS-rendered, not confirmed either way)
