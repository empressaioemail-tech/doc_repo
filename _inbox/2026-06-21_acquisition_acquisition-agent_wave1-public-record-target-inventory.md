---
id: 2026-06-21_acquisition_acquisition-agent_wave1-public-record-target-inventory
title: Acquisition agent — Wave 1 public-record target inventory (Calibrated Spine K1 scoping)
date: 2026-06-21
agent: acquisition-agent
repo: doc_repo (inventory only; no data pulled)
dispatch: Calibrated Spine Wave 1 — K1 scoping and inventory only
tasks: [K1-scoping]
blocks_unblocked: [K1 Wave 2 acquisition pulls]
wave: 1
status: close
---

# Close — Wave 1 public-record target inventory

## Summary

Wave 1 scoped historical public-record acquisition targets for Central Texas backtest fuel (permits, inspections, variances, incidents). **No data was pulled or stored.** Bastrop is the highest-yield anchor: MyGov public portal plus an existing SmartCity OS scraper path (`mygov_work_orders`, permit-scale volume observed at ~12k+ in ops logs). Austin and San Antonio are the next bulk-open-data anchors. Most corridor cities sit on per-vendor portals (MGO Connect, Tyler EnerGov/CSS, GovWell, SmartGov, CityView, AMS) with account-gated search and uneven bulk-export paths. Historical **code edition** depth is shallow in the engine corpus (L3 current snapshots only); Municode **Previous Versions** covers many cities for ordinance text but **building-code adoption ordinances** (I-Code edition + local amendments) must be acquired separately for edition-correct retrodiction.

Scope follows [`61a_central_tx_coverage_program.md`](../61a_central_tx_coverage_program.md) Tier-A footprint (~40–50 deal-volume cities across Travis, Williamson, Hays, Bastrop, Caldwell, Comal, Guadalupe, Bexar, Bell, McLennan) plus the engine snapshot keys already held.

---

## Target inventory table

Legend: **Yield** = expected backtest case density for calibration. **Friction** = effort to bulk-acquire through public channels. **Depth** = approximate historical span visible without PIR unless noted.

### Tier 0 — Bastrop anchor (richest; operational head start)

| Jurisdiction | Source | Access method | Format | Depth | Constraints | Yield | Friction |
|---|---|---|---|---|---|---|---|
| **Bastrop city** | MyGov public portal — https://public.mygov.us/bastrop_tx | Address Lookup (all activity at location); permit/planning module categories; open-records request via portal | Web UI + scraper; JSON/HTML in SmartCity raw path | Full MyGov era (portal is system of record; SmartCity integration live 1+ yr) | Public search is UI-first; bulk needs permitted scraping or authenticated collaborator export. SmartCity `mygov_raw_records` / `mygov_work_orders` is regenerable scrape (tenant-tagged; 90-day raw retention policy). Categories include building, zoning, variances, historic COA, code enforcement, subdivisions, special events. | **Highest** | **Low** (existing scraper + public portal) |
| **Bastrop city** | OpenGov transparency (SmartCity integration) | Portal browse / API if exposed | Web / possible API | Budget and transparency records; not primary permit ledger | Complements MyGov; not a substitute for permit outcomes. | Low | Medium |
| **Bastrop city** | City secretary / TPIA | Public information request | PDF/email | Pre-MyGov paper/electronic | Needed only for gaps before MyGov cutover. | Medium (legacy tail) | High |
| **Bastrop County** (unincorporated) | MyGovernmentOnline — mygovernmentonline.org | Account + application queue | Portal PDF/forms | MGO live Jan 2021+ | **No county building permits or COOs.** Development/OSSF/floodplain/driveway only. HB 2833 residential inspections are private (no county ledger). Weak for building-permit backtest; useful for floodplain/OSSF outcomes only. | Low | Medium |

### Tier 1 — Bulk open data (low friction, high volume)

| Jurisdiction | Source | Access method | Format | Depth | Constraints | Yield | Friction |
|---|---|---|---|---|---|---|---|
| **Austin** | data.austintexas.gov — Issued Construction Permits (`3syk-w9eu`) | SODA API / CSV bulk download | CSV (~2.35M rows, ~68 cols per third-party mirror) | ~1990–present (ABC links "since 1990") | Permit **issued** records; inspection pass/fail detail sparse in this dataset. AMANDA backend. | **Highest** | **Lowest** |
| **Austin** | data.austintexas.gov — Board of Adjustment Cases (`ykxk-t5y9`) | CSV / GeoJSON / ArcGIS REST | CSV, GeoJSON | AMANDA-sourced; calendar/fiscal year fields | Variance outcomes; join to permits by address/case id. | High | Low |
| **Austin** | ABC portal — abc.austintexas.gov/public-search | Authenticated/public search | Web | Default **365-day** window unless street/zip/type also set | Case-level detail, violations module; not bulk-friendly. | Medium | Medium |
| **Austin** | EDIMS — services.austintexas.gov/edims | Document fetch by id | PDF/HTML | Case documents | Enrichment for variance/plan review outcomes. | Medium | Medium |
| **San Antonio** | Open Data SA — Permits Issued 2020–2024 | CSV download | CSV | 2020–2024 | "As-is"; PIR for fields not in dataset. Hansen + Accela sources. | **High** | **Low** |
| **San Antonio** | Legacy Permit Data Portal | Web search (issued only) | Web | Apr 2003 – Nov 2020 (+ limited 1998–2003 batch) | Issued-stage only; TSLAC retention limits. | High | Low–Medium |
| **San Antonio** | Open Data SA — Board of Adjustment / Variance Requests | CSV | CSV | 2021+ (BOA dataset refreshed 2026) | Variance and special-exception outcomes. | High | Low |
| **San Antonio** | BuildSA / Accela (current) | Portal search | Web | Nov 2020–present (overlap with legacy) | No confirmed bulk export; PIR fallback. | Medium | Medium |
| **San Antonio** | Code enforcement / 311 | Open Data SA 311 service calls + CES search | CSV / web | Varies | Incidents, not plan-review outcomes; useful for enforcement tail. | Medium | Medium |

### Tier 2 — Portal with guest search or export path (medium friction)

| Jurisdiction | Source | Access method | Format | Depth | Constraints | Yield | Friction |
|---|---|---|---|---|---|---|---|
| **Round Rock** | permits.roundrocktexas.gov | Guest Access search | Web | Unknown bulk depth; date-range search in portal | Custom Tyler-ish portal; scrape or export TBD. | High | Medium |
| **New Braunfels** | publicsearch.nbtexas.org + nbpermits.nbtexas.org | Public search + applicant portal | Web | Planning types include **Variance** in search dropdown | AMS/CSS-style; bulk export unverified. | High | Medium |
| **San Marcos** | Legacy MyPermitNow / MGO — mypermitnow.org | "Advanced Reporting or Bulk Downloads" → Permitted Uses Detail → CSV | CSV export path documented in city Development Guide (2013) | MyPermitNow from ~2012; **Clariti cutover Jan 2, 2025** | **Split system:** Clariti for new permits; legacy bulk path may not cover 2025+. ArcGIS FeatureServer `CoSM_BuildingPermits` (REST, max 1000/query). | High | Medium–High |
| **San Marcos** | clariti.sanmarcostx.gov | Account portal | Web | 2025+ | New system; historical backfill unknown. | Medium | Medium |
| **San Marcos** | MGO Connect (planning cases, fire) | Account search | Web | Planning/zoning cases | Variance/plat cases; building moved to Clariti. | Medium | Medium |
| **Waco** | selfservice.wacotx.gov (Tyler EnerGov) | Self-service portal | Web | EnerGov era | Bulk export unverified; PIR likely for deep history. | High | Medium |
| **Georgetown** | MGO Connect | Account; Public Project Report pattern (see Rollingwood) | Web / possible report export | MGO era | Same vendor family as Bastrop County. | Medium–High | Medium |
| **Cedar Park** | MGO Connect (JID=47) | Account search | Web | MGO era | eCode360 for code text (partnership-gated ingest). | Medium–High | Medium |
| **Buda** | MGO Connect (JID=129) | Account search | Web | MGO era | eCode360 UDC. | Medium | Medium |
| **Taylor** | MGO Connect (JID=152) | Account search | Web | MGO era | | Medium | Medium |
| **Dripping Springs** | MGO Connect | Account search | Web | MGO era (transition to new vendor mentioned in 2024 packet) | | Medium | Medium |
| **Live Oak** | MGO Connect | Account search | Web | MGO era | | Medium | Medium |
| **Rollingwood** | MGO Connect | Public Project Report (date-range export to PDF/CSV per city guide) | Report export | Post Jun 2022 | Small jurisdiction; report pattern may generalize to other MGO cities. | Low–Medium | Medium |
| **Lago Vista** | MGO / mypermitnow.org login | Portal | Web | | | Low | Medium |
| **Pflugerville** | ams.pflugervilletx.gov/PublicAccess | Account search | Web | AMS portal | eCode360 code; open records via city secretary for gaps. | Medium–High | Medium |
| **Kyle** | Tyler Citizen Self-Service (CSS) | Account portal | Web | CSS from ~2020 | No public bulk dataset found. | Medium–High | Medium–High |
| **Leander** | leandertx-energovpub.tylerhost.net (Development Hub) | Self-service | Web | EnerGov | Code enforcement in same hub. | Medium–High | Medium–High |
| **Hutto** | GovWell — app.govwelltech.com/hutto | Account portal | Web | GovWell era | New platform; pre-GovWell history likely PIR. | Medium | Medium–High |
| **Manor** | GovWell (building) + MGO (planning) | Account portal | Web | GovWell from Feb 2026 for building | **Split portal.** CivicEngage PDF archive for monthly permit lists back to ~Jan 2022 only. | Medium | Medium–High |
| **Schertz** | development.schertz.com (CityView) | Portal | Web | CityView | Code enforcement in same system per city docs. | Medium | Medium–High |
| **Converse** | ci-converse-tx.smartgovcommunity.com | Public parcel search + portal | Web | SmartGov | | Medium | Medium |
| **Boerne** | MGO (post Jul 2025) + SmartGov (pre Jul 2025) | Two portals | Web | **Bifurcated at Jul 14, 2025** | Must pull both systems for continuous history. | Medium | Medium–High |
| **Copperas Cove** | (unverified this wave) | Email/PIR likely | — | — | Not resolved; treat as PIR-first. | Low | High |

### Tier 3 — PDF reports / email intake / PIR-first (high friction)

| Jurisdiction | Source | Access method | Format | Depth | Constraints | Yield | Friction |
|---|---|---|---|---|---|---|---|
| **Killeen** | Development Services | Email intake buildingpermits@killeentexas.gov | PDF forms / internal CMS | Public **annual summary PDF** 1996–2025 (counts/values only, not case-level) | No online case search found. Case-level requires PIR. | High volume city, **low public granularity** | **High** |
| **Temple** | Revize Document Center — weekly + monthly PDF reports | Bulk PDF download | PDF tables | Weekly reports current year; monthly YTD back to ~2024 visible | Not machine-native; OCR/parsing needed. | Medium | **High** |
| **Elgin** | Planning & Development (no portal found) | Email/phone; possible Accela elsewhere not confirmed | Paper/email | Unknown | Zoning variances handled in-house. | Low–Medium | **High** |
| **Lockhart** | Development Services | Email inspections@lockhart-tx.org; Bureau Veritas for some inspections | Email | Unknown | No public search portal found. | Low–Medium | **High** |
| **Wimberley** | wimberleypermits.com (per third-party guides; not verified live) | Portal TBD | Web | Unknown | Verify portal ownership (city vs vendor). | Low | High |
| **Belton, Seguin, Cibolo, Universal City, Helotes, Leon Valley, Temple-adjacent Tier-A Municode cities** | Not individually resolved this wave | Default: MGO/GovWell/AMS pattern by county peers + PIR | — | — | Schedule Tier-2 portal recon in Wave 2 before pull. | Medium (collectively) | Medium–High |

### Tier 4 — Not primary AHJ permit sources

| Source | Role | Backtest use |
|---|---|---|
| **Cotality Property API — building permits** | National aggregator; not wired (`75l_cotality_data_stack_catalog.md`) | Secondary cross-check only; demo keys entitlement-gated; **not authoritative for AHJ outcome grading** |
| **US Census BPS / TRERC** | Metro/monthly aggregates | Calibration insufficient (no case-level outcomes) |
| **County clerk recorded plats/variance orders** | Official recorded instruments | Parcel-level enrichment; not a substitute for permit ledger |

---

## Historical code-edition availability

Backtest requires **edition in effect at case date** ([`02_base_calibration_bootstrap.md`](../_calibrated_spine_roadmap/02_base_calibration_bootstrap.md)). Current engine corpus holds **Layer-3 local ordinance snapshots (mostly current edition)**; reasoning-warmed I-Code adoption is essentially **Austin-only and edition-drifting** (warmed 2021 vs in-force 2024 per B2 recon in `registry_and_gaps.md`).

| Jurisdiction / layer | Current corpus | Historical edition source | Availability | Gap severity |
|---|---|---|---|---|
| **Bastrop L3** | Municode B3 Apr 2025 (193 atoms, public-free) | Municode **Previous Versions** tab — https://library.municode.com/tx/bastrop | Ordinance text snapshots by supplement; depth TBD verify-first in Wave 2 | Medium — L3 likely adequate; adoption ordinances separate |
| **Austin LDC + I-Codes** | L3 neon; reasoning 2021 | Municode previous versions + council adoption ordinances; UpCodes slug | 2024 I-Codes verified in-force (Jul 2025 eff.) | **High** — must acquire 2021/2018/… adoption chain for retrodiction |
| **San Antonio** | engine_only L3 | Municode + Open Data; adoption ord. | 2024 I-Codes / 2021 IECC verified | High — L1/L2 not warmed |
| **Round Rock, San Marcos, New Braunfels, Georgetown, Hutto, Leander** | L3 neon or engine_only | Municode previous versions where hosted | I-Code editions partially verified (Round Rock 2024, San Marcos 2021) | High for unwarmed cities |
| **eCode360 cluster** (Kyle, Buda, Pflugerville, Cedar Park, Lakeway, Bee Cave, Liberty Hill, Bulverde, Smithville + 9 Tier-A) | Blocked or thin | eCode360 — **partnership-gated** programmatic access | Historical PDFs may exist on eCode360 UI; bulk needs General Code partnership or manual ordnance archive | **High** — 13 Central TX cities |
| **Statewide floors (all TX)** | SECO/TDLR | comptroller.texas.gov / txenergycode.com | 2015 IRC Ch.11 res energy; 2015 IECC commercial; 2012 TAS | Baseline only; does not replace local adoption timing |
| **Bastrop County unincorporated** | County ordinance (17 atoms) | HB 2833 choice: 2006 IRC or City of Bastrop edition | Builder-selected; inspections private | **Not suitable** for standard permit-outcome backtest |

**Wave 2 edition acquisition (parallel to permit pulls):**

1. For each jurisdiction in the permit pull set, fetch **building-code adoption ordinance** PDFs from city clerk / Municode ordinance attachments / council minutes archives, keyed by effective date.
2. Pull Municode **Previous Versions** exports for L3 at 2–3 snapshot dates (e.g., 2015, 2018, 2021, 2024) for Municode-hosted cities.
3. eCode360 cities: manual ordnance PDF harvest from city websites + PIR; track General Code partnership as unblock (does not replace public-record ordnance acquisition for adoption dates).

---

## Highest-yield / lowest-friction flags

| Flag | Target | Why |
|---|---|---|
| ~~**Pull first**~~ **FORBIDDEN 2026-08-31** | ~~Bastrop MyGov (city)~~ | **DO NOT PULL. Operator ruling 2026-08-31.** Bastrop is a SmartCity OS customer and MyGov is TENANT DATA. Routing it into the property product pools a tenant's private data into a shared asset, which the tenant-sovereignty commitment forbids, and "existing SmartCity scraper / deepest operational familiarity" is the privileged-relationship path the no-privileged-data rule forbids by name. Use a uniform public source or serve nothing. |
| **Bulk anchor** | Austin Issued Construction Permits CSV | ~2.35M issued permits, direct API, lowest extraction cost |
| **Bulk anchor** | San Antonio Open Data + Legacy Portal | ~20+ years issued permits across two systems; variance CSV |
| **Export pattern to prototype** | San Marcos MyPermitNow "Advanced Reporting" CSV | Documented bulk-export workflow; test before Clariti split |
| **Export pattern to prototype** | Rollingwood MGO Public Project Report | Date-range report export; may generalize across MGO jurisdictions |
| **Defer / PIR batch** | Killeen, Temple, Elgin, Lockhart | No case-level public bulk path confirmed |
| **Weak anchor** | Bastrop County unincorporated | No building permit ledger |
| **Not backtest-grade** | Cotality permits, Census BPS | Aggregates or non-AHJ |
| **Edition blocker** | eCode360 corridor + Austin edition drift | Retrodiction wrong without adoption ordnance timeline |

---

## Prioritized acquisition order

Dependency: edition dates must land before or alongside case pulls for K2 retrodiction ([`04_task_roadmap.md`](../_calibrated_spine_roadmap/04_task_roadmap.md) K1→K2).

| Order | Jurisdiction / bundle | Record types | Rationale |
|---|---|---|---|
| **P0** | Bastrop city | Permits, inspections, variances (zoning), code enforcement incidents | Richest source; extend existing MyGov scrape to historical Address Lookup + module inventory; map to raw-ledger schema |
| **P1** | Austin | Issued permits CSV + BOA/variance CSV + EDIMS enrichment sample | Largest case-level bulk; immediate backtest volume |
| **P1** | San Antonio | 2020–24 CSV + legacy portal scrape + variance/BOA CSV | Second metro bulk |
| **P2** | Williamson corridor | Round Rock, Georgetown, Cedar Park, Leander, Hutto, Taylor | High deal volume; mixed vendors (MGO, EnerGov, GovWell) |
| **P2** | Hays corridor | San Marcos (dual system), Kyle, Buda, Dripping Springs | San Marcos is live customer; Clariti/MyPermitNow split is critical path |
| **P3** | Comal / Guadalupe | New Braunfels, Schertz, Cibolo | NB public search includes variance type |
| **P3** | Bexar suburbs | Converse, Live Oak, Schertz, Boerne (dual portal) | SmartGov/MGO mix |
| **P4** | Bell / McLennan | Killeen (PIR), Temple (PDF OCR), Waco (EnerGov), Belton | Friction-heavy; batch PIRs |
| **P5** | Remaining Tier-A Municode onboards | Waco, Temple, Seguin, etc. | After portal recon wave |
| **Parallel** | All pulled jurisdictions | Building-code adoption ordinances + Municode previous versions | Edition-correct retrodiction gate |

---

## Proposed Wave 2 acquisition plan

### What to pull first

1. ~~**Bastrop MyGov module inventory**~~ **STRUCK 2026-08-31 by operator ruling. Do not enumerate, recon, canary or pull Bastrop MyGov.** It is tenant data belonging to a SmartCity OS customer. Read-only recon is still access to tenant data and is still forbidden. Start at item 2.
2. **Austin** — full `3syk-w9eu` CSV + `ykxk-t5y9` BOA CSV via SODA API.
3. **San Antonio** — `PERMITS ISSUED 2020-2024.csv` + variance/BOA CSV + scripted legacy portal queries for sample addresses (prove pagination/retention behavior).
4. **Edition bundle v0** — Bastrop + Austin adoption ordinance PDFs and Municode Previous Versions exports for the same date windows as the permit samples.

### Format

| Source type | Landing format | Notes |
|---|---|---|
| Open data CSV | `.csv` as delivered | Preserve vendor column names verbatim |
| Portal scrape | `.jsonl` one record per HTTP response or parsed row | Include `source_url`, `scraped_at`, `jurisdiction_key`, `record_type` |
| PDF reports (Temple, ordnances) | `.pdf` + parsed `.jsonl` sidecar | OCR in Wave 2b if needed |
| EDIMS / case docs | `.pdf` + metadata json | Store hash; do not interpret outcome at write time (log raw, derive late) |

### Landing location (proposed; operator confirm)

```
gs://hauska-calibration-raw/
  backtest/
    {jurisdiction_key}/
      {record_type}/          # permit | inspection | variance | incident
        {provenance}/         # open_data | portal_scrape | pir | smartcity_mygov
          acquired={YYYY-MM-DD}/
            manifest.json     # row counts, source URLs, schema hash, wave id
            data/             # csv | jsonl | pdf
```

- **No hot Neon load** for raw (consistent with `mygov_raw_records` archive-then-drop pattern).
- Normalized outcome-graded evidence waits for K2/K3 ([`06_agent_execution_model.md`](../_calibrated_spine_roadmap/06_agent_execution_model.md)).
- SmartCity MyGov re-scrape runs through existing smartcity-scraper job contract; export snapshots to GCS for calibration repo isolation.

### Wave 2 acceptance criteria (acquisition agent)

- [ ] Manifest per jurisdiction with row counts and date range coverage
- [ ] Permit records include: address or parcel id, permit/case id, type, status, key dates (applied/issued/finaled)
- [ ] Variance records distinguish clean approval vs approval-with-condition where present in source
- [ ] Edition manifest maps `{jurisdiction_key, effective_date, irc/ibc/ifc edition, source_document_hash}`
- [ ] Zero interpretation at ingest: no derived confidence, no outcome labels beyond source fields

---

## Blockers

| Blocker | Owner | Impact |
|---|---|---|
| **Raw ledger landing bucket + schema** not yet confirmed (F3/K1 wiring is cc-agent-C Wave 2) | cc-agent-C + operator | Cannot mass-store pulls |
| **MyGov / MGO rate limits and ToS** for bulk Address Lookup | acquisition agent + operator | Bastrop depth and MGO-cluster scale |
| **San Marcos Clariti vs MyPermitNow split** | acquisition agent | Gap risk 2024–2025 |
| **Killeen / Temple / Elgin / Lockhart** lack case-level bulk exports | acquisition agent via PIR | Thin backtest unless PIR batch approved |
| **Boerne dual-portal cutover Jul 2025** | acquisition agent | Must merge two sources |
| **eCode360 edition history** partnership-gated | operator / bizops (`73_partnerships.md`) | Retrodiction for 13 cities stalls on L3/L2 alone |
| **Austin edition drift** (corpus 2021 vs in-force 2024) | cc-agent-E + acquisition | Wrong predictions on 2024–2025 cases without adoption pull |
| **Inspection outcome detail** often absent from issued-permit CSVs | acquisition agent | May need secondary ABC/portal pull or PIR for pass/fail |
| **Cotality building permits** demo entitlement 403 | operator / Cotality | Not blocking AHJ-first plan; do not substitute for municipal ledger |

---

## Discoveries not in the plan

1. **SmartCity MyGov integration already surfaces permit-scale volume** (~12k permits cited in 2026-05-11 deploy logs). Wave 2 should treat this as an acceleration path for Bastrop, not a greenfield portal integration.
2. **San Marcos documents a MyPermitNow bulk CSV export workflow** in its Development Guide — underused if still live pre-Clariti.
3. **Rollingwood MGO "Public Project Report"** is a repeatable date-range export pattern worth testing across MGO jurisdictions (Georgetown, Taylor, Cedar Park, Live Oak, etc.).
4. **Manor split GovWell/MGO (Feb 2026)** and **Boerne split SmartGov/MGO (Jul 2025)** are recent portal migrations that will bisect historical pulls unless both systems are queried.
5. **Bastrop County is not a building-permit AHJ** — backtest fuel for unincorporated Bastrop County parcels must come from city-of-Bastrop ETJ rules or private inspection records (generally not public), not county permit ledgers.

---

## Wave 1 verification statement

- Read [`00_overview.md`](../_calibrated_spine_roadmap/00_overview.md) and [`02_base_calibration_bootstrap.md`](../_calibrated_spine_roadmap/02_base_calibration_bootstrap.md).
- Cross-referenced Central TX jurisdiction list from [`61a_central_tx_coverage_program.md`](../61a_central_tx_coverage_program.md) and `p:\tmp\central_tx_coverage\registry_and_gaps.md`.
- Web recon of public portals and open-data endpoints only; **no API keys used, no files downloaded, no GCS writes.**

---

## Unblocks

K1 Wave 2 acquisition pulls can begin once:

1. F0 verify-first closes (in flight).
2. Operator confirms GCS landing bucket (or interim `_inbox/acquisition_staging/` policy for dev-only).
3. cc-agent-C stamps F3 raw-ledger minimum manifest schema.

~~Recommended first dispatch: **K1-W2-A Bastrop MyGov module recon**~~ **STRUCK 2026-08-31.** The Bastrop MyGov half is forbidden per the operator ruling above. The Austin CSV pull and edition bundle v0 stand. Corrected 2026-08-31; see `_inbox/2026-08-31_capability_inventory.md`.
