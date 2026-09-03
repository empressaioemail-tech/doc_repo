---
title: PARCEL wave 2 source inventory
date: 2026-09-03
status: reference
---

# PARCEL wave 2 source inventory

Phase 1 scouting for `_dispatches/2026-09-03_parcel-wave2_dispatch.md`: the 7 never-scouted
declared-ahead rails, plus 3 follow-ups on ACQUIRE-GIS wave 1's own deferred items. Four
parallel read-only research agents, mirroring `PARCEL-SCOUT-GIS`'s own discipline: no
purchases, no store writes, no credentialed-portal login, every claim backed by a live
fetch actually made this session, and every "not found" result distinguishes a CONFIRMED
ABSENCE from a READ-PATH FAILURE (403/404/DNS/bot-block — common on government sites, not
evidence data doesn't exist).

## 1. `owner` — STRONG (Williamson), PARTIAL (5 counties)

**Williamson (WCAD) — STRONG.** `data.wcad.org`'s own dataset catalog includes a dedicated
**`Owner`** dataset (id `bbia-wsxs`, "Property Owner Information"), live-sampled: one row
per owner-of-record, keyed to `propertyid`, carrying `percentownership`. Real sample rows
confirm both single-party (`"ZUNA ZEFERINO HORALES"`) and multi-party/entity names
(`"ARCHER BRAD & TERRI"`, `"GONZALEZ MARCO A G & MONICA G DELA CRUZ MORALES"`,
`"COUNTRY GLEN ESTATES LLC"`) — a richer, structured source than the flat `owner_name`
string already in `cad_property`.

**All 6 counties — baseline already staged.** `cad_property.owner_name` /
`owner_mailing_address` are live in this program's own store today (confirmed earlier this
session: 100% populated on a 200-row Williamson sample) — a usable single-owner-string
source for every county with zero new acquisition needed as a floor.

**Travis, Bastrop, Caldwell, Hays, McLennan — PARTIAL.** Each CAD's own public-data pages
confirm an owner-searchable export/API exists (Travis: `traviscad.org/publicinformation`,
Bastrop: `bastropcad.org/data-downloads/`, Caldwell: `caldwellcad.org/public-information/`
explicitly states search shows "ownership", Hays: 403-blocked but corroborated by secondary
sources describing an owner field, McLennan: JS-shell-blocked, weakest of the five). None
were sampled live beyond confirming existence — binary export formats or bot-blocks stopped
a real value pull.

**Statewide fallback (unsampled):** TxGIO StratMap `stratmap_land_parcels_48_most_recent`
schema confirms `owner_name`/`mail_addr` fields exist, but the query capability is disabled
server-side (`"Requested operation is not supported by this service"`) — schema-confirmed
only, not a usable acquisition path on its own.

## 2. `valueHistory` — STRONG (Williamson, Travis), WEAK (Bastrop, Caldwell), UNCONFIRMED (Hays, McLennan)

**Not already staged** — confirmed via live query: `cad_property` and WCAD's own current
Socrata table are both current-year-only (`tax_year=2026` on every sampled row; a
`tax_year=2025` filter against WCAD's Socrata land API returned zero rows even though the
field exists in the schema).

**Williamson — STRONG.** `wcad.org/historical-data/` is a real parcel-level certified
appraisal-roll archive, tax years **1999–2026**, downloadable ZIP/TXT (2014 also MDB),
40–305MB per year, plus a 1999–2026 certified-values summary.

**Travis — STRONG.** `traviscad.org/publicinformation` lists individually-downloadable EARS
submissions for tax years **2021–2025** plus current-year certified exports (2025, 2026).

**Bastrop, Caldwell — WEAK.** Confirmed real but shallow: Bastrop 3 years (2024–2026),
Caldwell 4 years (2023–2026), both from the CAD's own live-fetched export pages.

**Hays, McLennan — UNCONFIRMED (read-path failure, not absence).** Both CAD sites are
bot-blocked (403 / JS-shell) on every direct-fetch attempt; Hays is corroborated by
secondary sources to have a similarly shallow ~3-year archive; McLennan has only 2 indexed
PDF certified-roll reports (2020, 2021) found, too thin to verdict either way.

**Statewide fallback — CONFIRMED ABSENCE.** Texas Comptroller PTAD publishes only
aggregate/jurisdiction-level ratio-study data; EARS itself is a private inbound-only SFTP
channel from CADs to the Comptroller, never republished. Read directly, not inferred.
TxGIO StratMap's archival-vintage question is inconclusive (only the "most recent" service
resolves live; older vintage-named services 404 and the DataHub catalog is 403-blocked).

## 3. `salesHistory` — PARTIAL (price absent everywhere, as expected; transaction-date signal partial)

**Price: CONFIRMED ABSENCE everywhere, exactly as the rails-v2 template predicted** (Texas
non-disclosure state). Bastrop CAD's own page explicitly cites Texas Government Code
§552.148 as the reason sales info isn't released except to the owner/agent. This is the
regime working as expected, not a sourcing gap.

**Transaction-date-only signal (no price), per county:**
- **McLennan — PARTIAL, best-confirmed of the six.** `mclennan.gov/178/Official-Public-Records`
  directly confirms a free public deed-index portal (`mclennancountytx-web.tylerhost.net`)
  covering OPR documents from January 1996 forward, plus digitized deeds back to December 1968.
- **Williamson — PARTIAL.** `wcad.org/data-downloads/` confirms real bulk export
  infrastructure (Certified/Preliminary/Historical/Owners data, documented file-layout
  guides) but the actual field-level layout PDFs weren't extractable in this pass (no
  PDF-rendering tooling available) — existence confirmed, deed-date field unconfirmed.
- **Travis — PARTIAL.** County clerk index confirmed to exist
  (`countyclerk.traviscountytx.gov`) pointing to `tccsearch.org`, which itself 403-blocked
  on direct fetch. TCAD's own bulk exports referenced but not field-verified (same PDF
  tooling gap).
- **Bastrop, Caldwell, Hays — WEAK/PARTIAL.** Portals confirmed to exist
  (redirect-loop/empty-JS-shell/403 blocked respectively on the actual query interface) but
  not confirmed working end to end.

**Bottom line:** a bare transaction-occurred + date signal is plausible in all 6 counties
via county-clerk deed indices, confirmed working in McLennan only; the rest need a
real-browser retry (most blocks look like bot-blocks, not genuine access walls) before
ruling either way.

## 4. `publicRecordRefs` — schema read, not a search task

Per the rails-v2 template's own ruling, this rail points into the existing P-85 records
store in `legacy-design-tools` (not a new source). Read directly from
`P:/seat-worktrees/property/legacy-design-tools`, branch `feat/p85-portal-ruling-2026-09-01`
(the primary `P:/legacy-design-tools` checkout is on an unrelated branch and does not carry
these migrations):

- `clerk_portal_terms` (migrations 0084 + 0087): portal-level terms metadata, unique on
  `(county_fips, portal_id)`.
- `records_request_jobs` (migration 0084): `engagement_id` and `user_id` both **NOT NULL**
  — every row is structurally a user-request row.
- `records_request_artifacts` (migration 0086): per-artifact acquisition detail, including
  `acquisition_method` (download/purchase/capture/human) — a different axis from the rail's
  wanted `acquiredBy` (public-ingest vs user-request).

**Confirmed gap, not a missing enum value:** a repo-wide grep for `acquiredBy`,
`acquired_by`, `public-ingest`, `acquisition_source` returned zero matches anywhere. There
is no table representing a bulk/catalog "public-ingest" fact independent of a specific
user's paid engagement. `clerk_portal_terms` is the one genuinely tenant-agnostic table
here, but it's portal metadata, not a records/facts table a `publicRecordRefs` row could
point at for the public-ingest case.

**Recommendation carried from the scout:** either (a) scope `publicRecordRefs` v1 to
user-acquired rows only, since that's 100% of what the store holds today, or (b) get a
small schema addition (nullable `acquired_by` column + relaxed NOT NULLs, or a new
lightweight public-ingest table) scoped and merged first. This is a design decision for
whoever owns the P-85 ruling, not something this scouting pass can resolve alone.

## 5. `ossf` — WEAK, one cross-cutting source

**NRCS Web Soil Survey** (`websoilsurvey.nrcs.usda.gov`) — confirmed live, free, no-login,
federal, covers all of Texas, with a specific "Septic Tank Absorption Fields" suitability
interpretation (red/yellow/green rating, drawable area of interest). Answers soil
suitability, not permit history, for every county with one integration.

**Per-county permit history:** every county checked is WEAK or blocked. Hays explicitly
requires an open-records request for existing-permit info (confirmed absence of self-serve
search). Williamson has a live GIS layer but scoped to package treatment plants only, not
individual residential permits. Travis has a documented regional tool
(H-GAC's `datalab.h-gac.com/ossf/`) that returned a "browser not supported" error live —
likely a stale legacy viewer, unconfirmed rather than dead. Bastrop, Caldwell, McLennan
have no searchable database found, only PDF application forms.

**Recommendation:** card as a thin, cross-cutting "soil suitability only" rail via NRCS;
explicitly exclude permit-history search from this wave's scope.

## 6. `mineralRights` — PARTIAL (2 of 6 counties confirmed open)

County clerk real-property-records index, checked per county:

| County | System | Access | Verdict |
|---|---|---|---|
| Hays | EagleWeb (`tylereagle.co.hays.tx.us`) | **Public Login button, no credential needed** | **STRONG** |
| McLennan | `mclennancountytx-web.tylerhost.net` | Disclaimer only, no login fields | **STRONG** |
| Bastrop | Aumentum (`cc.co.bastrop.tx.us`) | Credentialed (logon+password) | NONE — out of bounds |
| Caldwell | `tx.countygovernmentrecords.com` | Free registration required | NONE — out of bounds |
| Travis | `tccsearch.org` | 403 on direct fetch | UNCONFIRMED (read-path failure) |
| Williamson | `williamsoncountytx-web.tylerhost.net` (same vendor family as McLennan's open system) | 403 on direct fetch | UNCONFIRMED (read-path failure) |

Railroad Commission GIS (`gis.rrc.texas.gov`) and Wellbore Query confirmed live as a genuine
secondary/enrichment signal (active oil/gas production tied to survey/abstract) — not a
severance-instrument source itself, but real and free.

**Recommendation:** card Hays and McLennan only with confidence. Retry Travis/Williamson
with a real browser before ruling them out — the 403s look like bot-blocks on the same
vendor family as the two confirmed-open counties, not a different access model.

## 7. `hoaDeedRestrictions` — STRONG, inverts the brief's expectation

**Premise correction:** "Texas does not require HOA registration with the state" is now
FALSE as stated. Since a 2021 law amendment (Property Code Ch. 209), TREC operates
**hoa.texas.gov**, a mandatory statewide HOA/POA "Management Certificate" filing system
with a public, no-login search. Live-confirmed: front page states 17,193 certificates on
file; live searches for `hoa_county=Bastrop` and `hoa_county=Caldwell` both returned real,
named associations (10 results each, paginated).

Search fields are name/county/city/zip/type — not parcel address — so this answers
"does an HOA exist here, and what is it called" directly, with a follow-up name-based
county-clerk search (Hays/McLennan open, others credentialed/blocked per the mineralRights
findings) needed to reach the actual recorded CC&R instrument.

**Recommendation:** this is the strongest of the three title/records rails scouted this
pass — card it around `hoa.texas.gov` as primary source (existence + name + city/zip),
county-clerk index as an optional enrichment step where open.

## 8. utilityService electric sub-row — STRONG (mirror found; original source permanently dead)

The original card's HIFLD endpoint (`maps.nccs.nasa.gov/.../hifld_open/energy/FeatureServer/26`)
is now **permanently gone**, not transiently unreachable: the DHS-hosted HIFLD Open GIS
portal it served was deactivated 2025-08-26 (confirmed via the Data Rescue Project's own
mirror page).

**Live replacement found and verified:**
`https://services2.arcgis.com/LYMgRMwHfrWWEg3s/arcgis/rest/services/HIFLD_Electric_Retail_Service_Territories/FeatureServer/0`
— live `?f=json` metadata, 139 Texas records (`returnCountOnly`), and a targeted query
confirmed real, populated rows for exactly the utilities serving the 6 program counties:
Austin Energy (Travis), Pedernales Electric Coop (Hays), Bluebonnet Electric Coop
(Bastrop/Caldwell/Williamson), Oncor Electric Delivery (McLennan). Multiple other live
re-hosts of the same dataset were also found (redundancy if this one goes down too).

**Caveat:** this is a third-party re-host of a now-defunct official DHS dataset — field
freshness beyond "modified 2026-07-07" isn't independently guaranteed by anyone.

## 9. overlayDistricts — 5 unconfirmed cities resolved

- **Lockhart — CONFIRMED NEGATIVE** for a historic-landmarks-specific layer (checked from
  both city and county angles; a live base-zoning-only layer exists as an unrelated
  fallback asset).
- **Elgin — CONFIRMED NEGATIVE**, re-confirmed from three independent angles against
  Bastrop County's GIS server.
- **Dripping Springs — CONFIRMED NEGATIVE** for the historic overlay specifically, though
  upgraded from "no GIS found" to "a real, comprehensive 16-layer city GIS backend exists,
  the historic overlay just isn't digitized into it."
- **Liberty Hill — CONFIRMED NEGATIVE**, this time via genuine direct URL checks (the prior
  "Open Data Hub" reference is now confirmed real and live; a 39-dataset catalog contains
  no overlay/historic-district layer).
- **Robinson — STILL UNCONFIRMED (genuine read-path failure).** A real, city-owned ArcGIS
  Online "Experience" app exists (integrates parcel/address/zoning/land-use data) but its
  concrete data endpoint resolves client-side in the browser and could not be extracted via
  static fetch. Needs a browser-based (DevTools network tab) follow-up, not a re-scout of
  the same kind.

## 10. agValuation — 5 remaining counties resolved

- **Travis — STRONG.** `land_state_cd`/`land_type_desc` on the live TCAD ArcGIS layer are
  confirmed populated with real D1 codes (e.g. "ACREAGE (AG) 1-D / 1-D-1"). A free bulk
  "Certified Special Export (JSON)" is also confirmed to exist, no login.
- **Bastrop, Caldwell — PARTIAL, upgraded from the original scout.** Real, free, no-login
  bulk export files (.tab/.txt / ZIP) confirmed to exist beyond the base parcel layer
  (which has no ag fields) — field-level ag-code content inside the export files is not yet
  verified (binary/flat-file, needs an actual download+parse pass).
- **McLennan — CONFIRMED NEGATIVE.** Checked from four independent angles (CAD site,
  paywalled viewer, county site, a newly-found single-layer GIS boundary service) — no ag
  or even general parcel data in open form anywhere.
- **Hays — SPLIT.** The county GIS Hub is a genuine confirmed negative (31-dataset catalog,
  nothing ag-related). `hayscad.com` itself (where the real export would live, per the
  Travis/Bastrop/Caldwell pattern) is 403-blocked on both its downloads page and homepage —
  looks like a bot/WAF block, not a deliberate wall, still genuinely unconfirmed.

## Cross-cutting notes

Every "not found" finding above distinguishes a confirmed absence (checked, genuinely
nothing) from a read-path failure (403/404/JS-rendering/DNS — common on government and CAD
sites, not evidence of absence) throughout, per this program's own standing discipline.
No purchase was made and no credentialed portal was entered anywhere in this pass.
