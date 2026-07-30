# TX jurisdiction source registry — Batch 1 (CAPCOG) coverage summary

Merged: `2026-07-30T03:27:18.461320+00:00` by planner from `6` shard files.
Seed: `tx_capcog_batch1_seed.json` (55 jurisdictions).
Track A wave_complete: **True** (attempted 55/55; rows complete 54; gaps 5).

## Completeness ledger

| shard_id | in_scope | attempted | complete | gaps |
|---|---:|---:|---:|---:|
| capcog_shard_0_counties | 5 | 5 | 5 | 0 |
| capcog_shard_1_bastrop | 3 | 3 | 3 | 0 |
| capcog_shard_2_caldwell | 3 | 3 | 3 | 0 |
| capcog_shard_3_hays | 11 | 11 | 11 | 0 |
| capcog_shard_4_travis | 18 | 18 | 17 | 1 |
| capcog_shard_5_williamson | 15 | 15 | 15 | 4 |
| **TOTAL** | **55** | **55** | **54** | **5** |

## By regime_type

- `euclidean`: 38
- `unzoned`: 8
- `hybrid`: 6
- `unknown`: 2
- `form-based`: 1

## By reachable_adapter

- `raw-pdf`: 18
- `municode`: 13
- `ecode360`: 7
- `ecode360-scraper`: 7
- `muni-site-scraper`: 6
- `manual-only`: 3
- `unknown`: 1

**eCode360 path count** (`ecode360` + `ecode360-scraper`): **14** — these are the cities the eCode360 scraper newly unlocks once header/headless path clears.

**Unzoned / no zoning** (regime_type=unzoned OR has_zoning=false): **9**

## By confidence

- `high`: 32
- `medium`: 16
- `low`: 7

## Recent-repeal / replacement onboarding-risk register

Jurisdictions with `prior_code` dated 2023+ and/or a `stale_source_flag`. This is the list that would have caught Bastrop.

- **Bastrop County** (`48021`): prior `Bastrop County Subdivision Regulations (Revised April 24, 2017)` repeal `2026-06-08` → current `Bastrop County Subdivision Regulations (Revised 2026)` (adapter `raw-pdf`)
- **Caldwell County** (`48055`): prior `Caldwell County Development Ordinance (Amended Ordinance Adopted March 24, 2020)` repeal `2023-02-14` → current `Caldwell County Development Ordinance` (adapter `raw-pdf`) stale: Commissioners Court authorized Development Ordinance rewrite (Doucet & Associates scope approved ~2025-04-08 per county recap). Current published PDF remains Order 02-2023 (2023-02-14). No adopted replacement detected on Sanitation/Development Services page.
- **Bastrop** (`4805864`): prior `Bastrop Building Block (B3) Code` repeal `2026-04-14` → current `Bastrop Development Code (BDC) — Chapter 14` (adapter `raw-pdf`) stale: city-site-marks-B3-ineffective-2026-04-14; Municode CoO link on plan.home is NOT the land-use dimensional source — use city BDC PDF (Chapter 14). Abandoned Zoning_Place_Type/0 place-type layer is NOT current district map.
- **Bee Cave** (`4807156`): prior `Pre-UDC zoning ordinance regime (replaced by UDC Ord. 475)` repeal `2022-06-28` → current `City of Bee Cave Unified Development Code (within Code of Ordinances on eCode360)` (adapter `ecode360-scraper`) stale: eCode360 displayDate through Ord. No. 610 adopted 2026-06-23; eCode laws ledger shows Ord. 614 adopted 2026-07-14 amending UDC Zoning Regulations (Art. 3) not yet in library currency line.
- **Hays County** (`48209`): prior `Hays County Development Regulations (2017 revision)` repeal `2025-01-17` → current `Hays County Development Regulations (Revised Version — January 17, 2025)` (adapter `raw-pdf`) stale: Comprehensive Development Regulations Re-Write in progress (Freese & Nichols); county timeline targets Commissioners Court adoption Q2/Q3 2026. January 17, 2025 PDF remains the published current code until rewrite adopts. Watch https://www.hayscountytx.gov/565/Development-Regulations-Re-Write.
- **Travis County** (`48453`): prior `Travis County Code Chapter 82 — Standards for Construction of Streets and Drainage in Subdivisions (renumbered to 482)` repeal `2018-06-01` → current `Travis County Code Chapter 482 — Development Regulations` (adapter `raw-pdf`) stale: Chapter 482 PDF header states amendments only through 2019-08-27 (Item 26 / HB 3167). No newer county-published replacement detected on TNR Development Services page; watch for post-2019 amendments not yet reflected in served PDF.
- **Williamson County** (`48491`): prior `Williamson County Subdivision Regulations (December 7, 2021 revision)` repeal `2025-03-04` → current `Williamson County Subdivision Regulations` (adapter `raw-pdf`)
- **San Marcos** (`4865600`): prior `San Marcos Development Code / Land Development Code prior edition (ORD-2025-01 effective 2025-01-25; itself amending the 2018 Development Code lineage)` repeal `2026-06-16` → current `Land Development Code of San Marcos, Texas (Subpart B) — ORD-2026-08` (adapter `raw-pdf`) stale: Codes & Ordinances prose still says 'most recently amended on January 25, 2025' while linked PDF/Flipbook title is Effective June 16, 2026 — prose lag; treat linked ORD-2026-08 artifacts as current
- **Taylor** (`4871948`): prior `Pre-LDC Zoning / Subdivision regulations previously reflected in Municode Code of Ordinances (incl. Appendix C Subdivision Ordinance / Ch. 21 Planning and Development)` repeal `2023-11-09` → current `Taylor Land Development Code (LDC) — Zoning, Subdivision, Sign, Historic Preservation` (adapter `raw-pdf`) stale: Municode product 11624 Code of Ordinances still publishes Chapter 21 Planning and Development + Appendix C Subdivision Ordinance; city Zoning and Ordinances page states 2023-11-09 LDC is current zoning/subdivision/sign/historic regs and all properties were rezoned. Prefer city LDC PDF over Municode for land use (Bastrop-class currency trap).
- **The Hills** (`4872578`): prior `Pre-2025 comprehensive zoning framework (village operated without the 2025 citywide zoning ordinance)` repeal `None` → current `Village of The Hills Zoning Ordinance No. 2025-016 (city DocumentCenter) + Code of Ordinances on eCode360` (adapter `raw-pdf`) stale: eCode360 TH6547 currency only through Ord. No. 2025-011 adopted 2025-06-10; city Code of Ordinances page also links Zoning Ordinance 2025 PDF (Ord. 2025-016) and Mayor minutes report zoning ordinance/map adopted Oct 2025 — library may lag zoning adoption.

## Gap list (authoritative source not fully confirmed)

- **Webberville** (`4876924`, shard `capcog_shard_4_travis`): No live public consolidated code host found for Village of Webberville, TX (Travis). Official site hosts unresolved (DNS/connect fail on candidate domains). AmLegal hits resolve to Webberville MI, not TX. Municode TX index listing not confirmed with live code product. Follow-up: city hall / CAPCOG / open-records PDF ask.
- **Granger** (`4830548`, shard `capcog_shard_5_williamson`): eCode360 GR6326 live (legislation through Ord. 06092025-02, 2025-06-09) has Subdivisions chapter but NO Zoning chapter; P&Z commission exists for platting/land-use recommendations. District zoning ordinance not confirmed in published code.
- **Thorndale** (`4872776`, shard `capcog_shard_5_williamson`): City ordinance index live at /2039/Ordinances shows plat-specific subdivide ordinances and development fee schedules; no comprehensive zoning ordinance title found. Treat land-use district code as unconfirmed.
- **Thrall** (`4872824`, shard `capcog_shard_5_williamson`): City development page lists ordinance packets with setbacks/subdivision/building permits; no titled district Zoning Ordinance located. Authoritative text is fragmented municipal PDFs.
- **Weir** (`4877056`, shard `capcog_shard_5_williamson`): STOP ethics: automated fetch of cityofweir.org/ordinances returned HTTP 403 (bot UA and browser UA). Public search index lists Planning and Zoning Ordinance 20000602 (2000-06-22) and amendment 20210701; row filled from indexed public listing only — planner must re-verify via non-blocked path.

## Track B status

- **B1 eCode360/Smithville** ([ecode360](621b8179-b634-47df-a4e1-53aa05668d7c)): **PASS** — planner-verified. LIVE robots allow `/SM6484` + `/toc/` + numeric paths. Civil UA `PublicLawTextFetcher/1.0` (Chrome spoof → CF 403, do not use). 155 pages / 836/836 TOC sections / 12,793 blocks. Planner fidelity regrade `fromRawHtml` + `fromDecodedCorpus` both **pass=true**, coverage 100%, missing/altered spans 0; 5/5 eyeball samples found in raw. Fixture tests 10/10. Code on `hauska-engine` branch `feat/ecode360-scraper-header-first` (uncommitted). Newly unlocks the **14** Batch-1 eCode360-path cities once onboarded.
- **B2 Pflugerville** ([muni-site](5663ce13-b912-4568-b61a-7435ec94e981)): **STOPPED** — planner-verified. Primary UDC at `online.encodeplus.com/regs/pflugerville/` disallowed by LIVE robots (`User-agent: *` / `Disallow: /regs/`). Pattern shipped under `packages/corpus/src/adapters/muni-site-scraper/` (10/10 fixture tests PASS). Fidelity harness: `OVERALL=STOPPED` (pointer stub checks green). PDF-via-raw-pdf: no. **Planner decision owed:** city PDF / open-records alternate — NOT partnership, NOT evasion (robots bind headless too).

## Schema / merge diagnostics

- missing_from_seed: none
- extra_not_in_seed: none
- duplicate_fips: none
- schema_issues: none
