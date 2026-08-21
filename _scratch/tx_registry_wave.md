# TX registry + scraper wave scratchpad (2026-07-29)

## GROUND-TRUTH
- WDLL approved via operator handoff: `_inbox/2026-07-29_tx_authoritative_source_registry_and_scraper_fleet_WDLL.md`
- Seed: `_catalog/tx_capcog_batch1_seed.json` ? 5 counties + 50 incorporated places = 55 jurisdictions, 6 shards
- Source of seed: Census `national_place2020.txt` (2020)
- Engine adapters live at `P:\hauska-engine\packages\corpus\src\adapters\` ? ecode360 silently swallows 403 (index.ts:72-73); RespectfulFetch self-identifying UA (http.ts:41); no robots.txt
- Partnership-first RETIRED ? scrape public law; STOP on robots disallow / header-fail 403
- Bastrop BDC correction is SEPARATE active program ? this wave is PRE-onboarding collection only

## OPEN
- RE-FAN: Track A ALL DONE (6/6 merged). **B1 PASS (planner fidelity regrade green 2026-07-30T03:41Z).** **B2 STOPPED (encodeplus robots).**
- Canonical: `_catalog/tx_jurisdiction_source_registry.json` + coverage summary.
- B2 decision owed: city PDF / open-records for Pflugerville UDC (not partnership/evasion).
- Commits PLANNER-OWNED ? await operator go (doc_repo registry + hauska-engine branch `feat/ecode360-scraper-header-first` incl. muni-site-scraper).
- Planner fidelity artifact: `P:\tmp\tx_scraper_proofs\smithville\planner_fidelity_regrade.json`

## GROUND-TRUTH (B1 eCode360 Smithville ? CLOSED PASS, 2026-07-30T03:39Z)
- Adapter: `P:\hauska-engine\packages\corpus\src\adapters\ecode360-scraper\` on branch `feat/ecode360-scraper-header-first` (NOT merged; do not commit unless planner asks)
- robots: UA * disallows /admin,/archives,/attachment,/dashboard,/documents,/output,/permissions,/print,/search,/user ? NOT /SM6484 or /toc/SM6484 or numeric content paths
- HEADER-FIRST results (Node + `--use-system-ca`):
  - HauskaEngineIngest UA ? 200 (historical WAF 403 NOT reproduced on this host)
  - Chrome+Sec-Fetch spoof ? 403 CF "Just a moment" ? do NOT use
  - `PublicLawTextFetcher/1.0` ? 200 ? SELECTED civil profile
- Crawl: 155 unique parent pages @ 0.5 rps; mid-crawl 429 after probe burst recovered with civil backoff (no evasion)
- Extraction: 836/836 TOC sections; 12,793 NormalizedBlocks; fidelity PASS (cheerio-decode span compare); fixture tests 10/10
- Proofs: `P:\tmp\tx_scraper_proofs\smithville\` + inbox `_inbox/2026-07-29_B1_ecode360_smithville_STATUS.md`
- Generalizes: robots ? civil UA ? /toc/{custId} ? parent pages ? .section_content/.para
- NO corpus ingest/bake/warm/DB writes
- SUPERSEDES earlier scratch notes that B1 was STOPPED on 429 / A1 note that Smithville HEAD 403 persists

## GROUND-TRUTH (B2 pflugerville muni-site, 2026-07-29 ~22:30 local)
- Adapter pattern landed (no commit): `P:\hauska-engine\packages\corpus\src\adapters\muni-site-scraper\` ? config-driven; robots gate; loud STOP; PDF?RawPdfAdapter; fixture tests **10/10 PASS**
- Landing stub LIVE: `https://www.pflugervilletx.gov/unified-development-code` (CivicPlus Evolve; WidgetData UUIDs only in static HTML)
- True primary UDC: `http://online.encodeplus.com/regs/pflugerville/index.aspx` ? encodeplus robots UA `*` **Disallow: /regs/** ? **STOPPED** (no fetch, no Googlebot spoof)
- eCode360 Ch.157 ?157.001 LIVE: UDC ?not printed herein?; points to encodeplus. Normalized pointer only at `P:\tmp\tx_scraper_proofs\pflugerville\normalized.json`
- CivicPlus `/api/apps/tx-pflugerville/all` ? HTTP 401 Bearer even with Origin/Referer ? STOP API path (no cookie escalation)
- PDF-via-raw-pdf for UDC: **no**. Proofs: `P:\tmp\tx_scraper_proofs\pflugerville\` + inbox STATUS `2026-07-29_B2_pflugerville_muni_site_STATUS.md`
- Fidelity harness mechanical check: OVERALL=STOPPED (pointer sub-checks green). Planner grades acceptance.

## DONE (planner-verified)
- A0 counties (cffe93db): 5/5/5 fips match. All has_zoning=false / regime_type=unzoned / raw-pdf. Replacements: Bastrop 2017?2026-06-08; Williamson 2021?2025-03-04; Hays 2017?2025-01-17 (full rewrite still pending). Travis/Caldwell: no full repeal.
- A1 bastrop (16df8020): in_scope=attempted=complete=3, fips match seed, all fields present. Repeal: Bastrop B3?BDC Ord.2026-06 2026-04-14. Adapters: raw-pdf / municode / ecode360-scraper. Smithville note: HEAD 403 after header correction (feeds B1 STOP path).
- A2 caldwell (b9c1c76a): 3/3/3 fips match. Lockhart+Luling municode; Martindale AmLegal?manual-only (shell 403 STOP, browser-verified). No 2024?2026 full-code repeal (Luling 2013 historical prior_code only). Note: AmLegal not in reachable_adapter enum ? manual-only is correct under schema.
- A3 hays (738b4c3e): 11/11/11 fips match. eCode360 LIVE 200: Buda BU6262, Kyle KY6871. Recent replacement: San Marcos ORD-2026-08 Dev Code eff 2026-06-16 supersedes ORD-2025-01. Adapters: raw-pdf4 / municode3 / ecode3602 / muni-site-scraper2.
- A4 travis (a5fd0691): 18/18 attempted, complete=17, gap=Webberville (no live code host). eCode360-scraper?6 (Bee Cave/Briarcliff/Jonestown/Lakeway/Volente/West Lake Hills). Pflugerville content=EncodePlus doc-viewer; EncodePlus robots Disallow `/regs/` ? B2 ethics STOP. Repeals: Bee Cave UDC 2022-06-28; The Hills Zoning Ord.2025-016.
- A5 williamson (57b8054e): 15/15/15 fips match, gap_list=4 (honest residual). eCode360: Bartlett/Cedar Park/Granger/Jarrell/Liberty Hill (+Hutto general). Hard stale: Taylor LDC 2023-11-09 vs Municode App C. Georgetown UDC pending ~2026-11-01. Weir city site 403 STOP ? manual-only.

## GROUND-TRUTH (B1 partial, 2026-07-29)
- ecode360 robots.txt: UA * disallows /admin,/archives,/attachment,/dashboard,/documents,/output,/permissions,/print,/search,/user ? NOT the city landing path /SM6484. Header-first on landing is robots-OK; TOC/content paths must be checked against disallow list before fetch.

## GROUND-TRUTH (capcog_shard_3_hays, 2026-07-30T03:25Z)
- Shard file written: `_catalog/tx_registry_shards/capcog_shard_3_hays.json` ? in_scope=11 attempted=11 complete=11 gap_list=[]
- eCode360 LIVE landings HTTP 200 (not 403): Kyle KY6871 (thru Ord 1409 / 2026-06-02), Buda BU6262 (thru Ord 2025-70 / 2025-12-16). robots same disallow list as B1 note; landings OK.
- San Marcos recent replacement: ORD-2026-08 Development Code effective 2026-06-16 supersedes ORD-2025-01 (2025-01-25). City PDF ~37MB HTTP 200. Municode retains general Code of Ordinances only. GIS Zoning = smgis?PlanningFeatures/MapServer/26 (ZONECODE/ZONINGDISTRICT).
- Municode cities (city-linked): Dripping Springs, Wimberley, Woodcreek ? SPA shell 200; Jobs/API JSON 401/404 without SPA session (currency stamp not machine-extracted).
- Thin/manual: Bear Creek unzoned (subdivision PDFs only); Hays City Code PDF Ch.94 (stale ~2013-14 stamps); Mountain City PDF Code 2025 v1 thru Ord 2025-07-07; Niederwald ordinance PDF stack on niederwald.texas.gov; Uhland Municode stub + city ordinance PDFs.
- Cloudflare: bot UA 403 on cityofdrippingsprings.com / mountaincitytx.gov/document-library; browser UA cleared. No evasion beyond corrected UA.

## LESSON
- Nested coordinator fan orphans workers ? planner owns Task fan directly
- Old docs still say "General Code partnership" for eCode360 ? SUPERSEDED by this wave's standing decision
- Municode library SPA landings return HTTP 200 even when content API needs browser session ? do not treat SPA shell alone as TOC currency proof

## DEAD-END
- (none yet this wave)
- Municode `api.municode.com/Jobs/name=*?stateId=44` and library `/api/ClientHtmlDocuments/codes` returned 404/401 from header-first curl (2026-07-30) ? not usable for currency without SPA session cookies

## GROUND-TRUTH (capcog_shard_1_bastrop ? Track A REGISTRY, 2026-07-30T03:20Z)
- Shard file written: `_catalog/tx_registry_shards/capcog_shard_1_bastrop.json`
- Counts: in_scope=3 attempted=3 complete=3 gap_list=[]
- Adapters: Bastrop=raw-pdf (BDC Chapter 14 PDF); Elgin=municode (still live Ch.46); Smithville=ecode360-scraper (HEAD 403 persists after header correction; STOP ? no evasion)
- RECENT-REPEAL DETECTED: Bastrop B3 ? BDC via Ord. 2026-06 effective 2026-04-14 (LIVE plan.home + cs.ordinances + BDC PDF Last-Modified 2026-04-15). Elgin/Smithville: no full-code repeal signal.
- Bastrop zoning_gis LIVE: Zoned_Parcels/FeatureServer/83 (trust=drift-detected; numbers=ordinance-text)
- Smithville currency: city /226/Ordinances still points to eCode360 SM6484; eCode TOC legislation through Ord. 2025-689 (2025-07-14)
- Ethics: ?1 rps; robots checked (ecode360 /SM6484 allowed; city sites OK; cityofbastrop robots 302?404). No corpus/bake/DB writes. No git commit.

## GROUND-TRUTH (capcog_shard_0_counties ? Track A REGISTRY, 2026-07-30T03:22Z)
- Shard file written: `_catalog/tx_registry_shards/capcog_shard_0_counties.json`
- Counts: in_scope=5 attempted=5 complete=5 gap_list=[]
- All five counties: has_zoning=false, regime_type=unzoned, has_land_use_authority=false (TX Ch.232 subdivision only; no Euclidean zoning). reachable_adapter=raw-pdf for all.
- Sources LIVE-fetched: Bastrop Subdivision Regs 2026 PDF + land_divisions page; Travis Ch.482 PDF + TNR DS page; Wilco Subdivision Regs 2025-03-04 PDF + DS page; Hays Dev Regs 2025-01-17 PDF + planning + rewrite pages; Caldwell Dev Ordinance Order 02-2023 PDF + Sanitation page.
- RECENT-REPEAL / REPLACEMENT DETECTED:
  - Bastrop County: April 24, 2017 Subdivision Regs SUPERSEDED by June 8, 2026 revision (county page marks SUPERSEDED).
  - Williamson County: Dec 7, 2021 regs replaced by March 4, 2025 adoption (effective immediately for new apps).
  - Hays County: 2017 regs replaced by January 17, 2025 ADOPTION VERSION; comprehensive rewrite still pending (target Q2/Q3 2026) ? watch, not yet repealed.
  - Caldwell County: March 24, 2020 amended by Order 02-2023 (2023-02-14); rewrite authorized ~2025-04 but current PDF still 02-2023.
  - Travis County: no recent full-code repeal; Ch.482 last amended 2019-08-27 (stale_source_flag watch).
- Ethics: ?1 rps; robots checked (travis/wilco/hays OK for paths used; bastrop/caldwell robots 404). No corpus/bake/DB writes. No git commit.

## GROUND-TRUTH (capcog_shard_2_caldwell, 2026-07-30T03:22Z)
- Shard file written: `_catalog/tx_registry_shards/capcog_shard_2_caldwell.json`
- Ledger: in_scope=3 attempted=3 complete=3 gap_list=[]
- Lockhart (4843240): Municode LIVE ? ClientID 3055 productId 11173 job Supp.79; Ch 64 Zoning; codified through Ord 2026-13 (2026-03-17); uncodified Ch64 amends Ord 2026-22 / 2026-24. reachable_adapter=municode. No full repeal. zoning_gis=null.
- Luling (4845096): Municode LIVE CONFIRMED (prior tag correct) ? ClientID 3105 productId 11920 Supp.11; Appendix B Zoning; codified through Ord 2024-O-05 enacted 2025-08-08; newOrdCount=0. Historical prior_code: Ord 2013-O-04 repealed former App B (2013-03-14). City Planning page still links Municode.
- Martindale (4846848): AmLegal Ch 155 LIVE via browser ? current through Ord 2024-01-04 (2024-01-04). City site cites Ch 155. reachable_adapter=manual-only (no amlegal adapter). Shell 403 after corrected headers ? ethics STOP (no evasion). WATCH stale flag: grant targeted new zoning by 2025-12-31.
- Recent repeals (Bastrop-class 2024?2026 full code replacement): NONE. Historical Luling 2013 App B replacement only.
- Population/parcel_count left null (Census PEP API key required; not fabricated).

## OPEN
- Planner: AmLegal programmatic 403 STOP for Martindale ? need adapter strategy or browser-only path; confirm whether Martindale adopted post-2025-12-31 replacement zoning vs AmLegal lag.
- Planner: Weir cityofweir.org Cloudflare 403 STOP (bot+browser UA) ? re-verify Planning and Zoning Ordinance PDFs when unblocked.

## GROUND-TRUTH (capcog_shard_5_williamson ? Track A REGISTRY, 2026-07-30T03:30Z)
- Shard file written: `_catalog/tx_registry_shards/capcog_shard_5_williamson.json`
- Counts: in_scope=15 attempted=15 complete=15 gap_list=4 (Granger no Zoning chapter; Thorndale no ZO in index; Thrall fragmented/no district ZO; Weir 403)
- Adapters: ecode360=5 (Bartlett BA6238, Cedar Park CE6271, Granger GR6326, Jarrell JA6361, Liberty Hill LI6389); municode=3 (Round Rock 14610, Georgetown UDC 13943, Leander 12187); raw-pdf=4 (Coupland, Florence, Hutto UDC, Taylor LDC); muni-site-scraper=1 (Thrall); manual-only=2 (Thorndale, Weir)
- Hutto hint correction: NOT Municode ? eCode360 HU6354 general + city UDC PDF land-use
- REPEAL: Taylor LDC adopted 2023-11-09 replaced prior zoning/subdivision; Municode 11624 still shows Appendix C Subdivision (stale for land use)
- PENDING (not yet repeal): Georgetown UDC update targeting ~2026-11-01 effective
- Ethics: ?1 rps; ecode360/municode robots OK for paths used; Weir 403 STOP no evasion. No corpus/bake/DB writes. No git commit.

## GROUND-TRUTH (capcog_shard_4_travis ? Track A REGISTRY, 2026-07-30T03:45Z)
- Shard file written: `_catalog/tx_registry_shards/capcog_shard_4_travis.json`
- Counts: in_scope=18 attempted=18 complete=17 gap_list=1 (Webberville TX ? no live code host)
- Adapters: ecode360-scraper=6 (Bee Cave BE6240, Briarcliff BR6544, Jonestown JO6363, Lakeway LA6379, Volente VO6548, West Lake Hills WE6509); municode=4 (Austin, Lago Vista, Manor, Rollingwood); raw-pdf=4 (Creedmoor, Mustang Ridge 23-00435, San Leanna 13-001, The Hills 2025-016); muni-site-scraper=3 (Pflugerville encodeplus, Point Venture MCO, Sunset Valley AmLegal); unknown=1 (Webberville)
- Pflugerville: city `/unified-development-code` CivicPlus stub; CONTENT URL `https://online.encodeplus.com/regs/pflugerville/doc-viewer.aspx` (TOC LIVE); encodeplus robots UA* Disallow:/regs/ ? Track B STOP
- REPEAL/REPLACE: Bee Cave prior zoning ? UDC Ord.475 (2022-06-28); The Hills pre-2025 framework vs Zoning Ord.2025-016 (eCode TH6547 lags at 2025-011)
- Stale watches: Bee Cave Ord.614 (2026-07-14) uncodified vs library through 610; Volente Ord.2026-O-242 (2026-05-19) uncodified vs through O-241
- Sunset Valley AmLegal currency LIVE: 2026 S-31 through Ord.260217 (2026-02-17)
- Ethics: =1 rps; robots checked; AmLegal initial 403 cleared with Accept headers (no evasion); Creedmoor apex 403 STOP (www path OK). No corpus/bake/DB writes. No git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>".
