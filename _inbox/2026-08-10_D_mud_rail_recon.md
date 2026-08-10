---
id: 2026-08-10_D_mud_rail_recon
title: MUD / special-district rail recon (W4, ordinal 14)
date: 2026-08-10
status: complete
owner: planner
task: exit-bounded scoping recon — go/no-go with sized program
related: [_decisions/2026-08-01_scale_before_new_layers_sequencing, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, 90_operations/OPS-14_texas_flush_game_plan, _inbox/2026-08-08_ATOM_families_specify_only_shapes, _inbox/2026-08-08_lightbox_gap_closure_spec]
---

# MUD / special-district rail recon

**Rail:** `mud` (ordinal 14 after R1–R4 split). **Today:** `atomFamilyState=missing`, `hasWriter=false`, W4 HELD.

**Commercial stake:** A Texas MUD (or PID, WCID, ESD) materially changes the tax bill and is a standard sale disclosure. Buyers ask it in the top five; the factory answers nothing today.

**Verdict:** **GO — phased, with honest partial coverage.** Acquisition is statewide-uniform (OZ/NFHL pattern). Parcel assignment is a bulk spatial join we perform ourselves; no source ships parcel-native district keys. Registry completeness and boundary quality are partial by design; the product must say so with numbers, not imply 254-county closure on day one.

---

## Adversarial review

### Pre-registered expectations (before live fetch)

| # | Expectation to attack | Rationale |
|---|---|---|
| A1 | Any claim of **complete statewide special-district coverage** will fail | Comptroller FAQ explicitly states the SPDPID omits districts that did not meet reporting criteria or failed to submit |
| A2 | **Comptroller registry ≠ TCEQ boundary universe** | Different statutes, different agencies, different district-type filters |
| A3 | **No parcel-native join exists** | If a vendor ever claimed "parcel MUD lookup," it was assembled (spatial or tax-string), not sourced |
| A4 | **Tax rates in registry will be sparse** | Self-reported annual filings; many entities report debt without usable rate fields |
| A5 | **ESD / PID will not fully resolve from TCEQ water polygons alone** | TCEQ layer is water-district typed; ESD is a separate political subdivision class |

### Review outcome (2026-08-10, live fetches below)

| Expectation | Result | Evidence |
|---|---|---|
| A1 | **CONFIRMED** | Comptroller FAQ: "The database may not include some SPDs from across the state…" (`lookup.php` fetch). Live CSV: **3,028** unique `spd_publ_id` (latest report row each), **86** rows on `spdpid-non-compliant.csv` |
| A2 | **CONFIRMED** | Comptroller latest MUD count **1,379** vs TCEQ polygon MUD count **1,906** vs TCEQ tabular MUD rows **2,043** — three different numbers, same nominal type |
| A3 | **CONFIRMED** | Neither source exposes `parcel_id`, `geo_id`, or CAD account fields. TCEQ polygon fields stop at district metadata + geometry |
| A4 | **CONFIRMED** | Of **3,028** latest registry entities, only **425** carry `totl_rate_pc > 0`; **382** carry `avt_eff_rate_pc > 0` (live parse of `spdpid-entity.csv`) |
| A5 | **CONFIRMED** | Comptroller lists **282** Emergency Services District entities; TCEQ polygon `TYPE` breakdown has **no ESD class** (15 water-district acronyms only, user guide PDF) |

**Reviewer call:** Do not market this rail as "every Texas special district." Ship **water-district membership from TCEQ polygons** plus **registry enrichment where joinable**, and **registry-only / honest-absence** for ESD and other non-water types until boundary sources are verified per type.

---

## Sources table

| Source | URL | Access shape | Licence / ToS | Update cadence | Statewide? | Geometry? | Live counts (2026-08-10) |
|---|---|---|---|---|---|---|---|
| **Comptroller SPDPID (registry + tax/debt)** | Portal: https://spdpid.comptroller.texas.gov/ ; bulk CSV: https://assets.comptroller.texas.gov/open-data-files/spdpid-entity.csv (+ 5 sibling CSVs joined on `spd_publ_id`) | **Bulk CSV only** (6 files). Web search UI. **No SPDPID endpoint** on https://api-doc.comptroller.texas.gov/ (sales tax / SIFT APIs only) | Public Texas government transparency data; Comptroller open-records / compact-with-Texans policies. No restrictive click-wrap on CSV download | **Continuous** (FAQ: "updated continuously"; CSV `Last-Modified: Mon, 10 Aug 2026 07:32:22 GMT`) | **Partial** — only Gov Code §403.0241(b) reporters who filed; FAQ denies completeness | **No** — tabular registry rows only | **21,688** report rows (multi-year); **3,028** unique districts (latest year per `spd_publ_id`); **1,379** MUD, **282** ESD, **197** PID, **167** WCID (latest-type parse) |
| **Comptroller SPDPID FAQ / coverage disclaimer** | https://comptroller.texas.gov/transparency/local/sb625/lookup.php | HTML | Same | Continuous | Defines **incomplete universe** | No | Self-reported; not independently verified |
| **TCEQ Water Districts — boundary GIS** | ArcGIS REST: https://gisweb.tceq.texas.gov/arcgis/rest/services/Public/WaterDistricts/MapServer/0 | FeatureServer query (GeoJSON/PBF), maxRecordCount **3000** | TCEQ public GIS (`copyrightText: TCEQ Info Resources Division`) | Not published on REST metadata; data.texas.gov sibling tabular set lists **Daily** | **Statewide layer extent** (WGS84 envelope covers all TX) | **Yes — polygons** (`esriGeometryPolygon`) | **2,796** total polygons; **1,906** MUD; **1,295** MUD with `STATUS='A'` |
| **TCEQ Water Districts — tabular (office / contact)** | https://data.texas.gov/resource/hr84-s96f.json (dataset uid `hr84-s96f`) | Socrata API + CSV export | Texas Open Data Portal, official provenance | **Daily** (`rowsUpdatedAt` epoch 1786194154 ≈ 2026-08-08) | Statewide rows | **Point only** (`coordinates_decimal_degrees_` — district office, not service boundary) | **3,092** rows; **2,043** MUD type string |
| **TCEQ Water Districts map viewer docs** | https://www.tceq.texas.gov/downloads/gis/docs/water-districts-user-guide.pdf | PDF | Public | — | Describes 15 water-district types | Viewer searches **boundary** layers | Confirms polygon viewer + iWDD link; **no ESD** in type list |

**Prior in-repo adapter (dead path, shape reference only):** `_inbox/2026-06-17_legacy-design-tools_cc-agent-C_map_layers_wave3_close.md` records `txSpecialDistrictIngest.ts` targeting data.texas.gov SPDPID — **not live in factory today**; Cotality-era MUD/PID per-parcel scan is extinguished (`_inbox/2026-08-08_DOCSET_coverage_corrections.md`).

---

## Recon answers

### 1. Comptroller special-district registry — API/bulk shape

- **Not an API rail.** Six CSV files at `assets.comptroller.texas.gov/open-data-files/`, keyed on `spd_publ_id`.
- **Primary table:** `spdpid-entity.csv` — 33 columns including `ent_ty_tx` (human-readable type), `ent_dis_nm`, `cnty_cd`, `rpt_yr`, `tp_id` (11-digit taxpayer ID), debt totals, and rate fields (`totl_rate_pc`, `avt_eff_rate_pc`, `mant_oper_rate_pc`, …).
- **Sibling files:** county mappings (`spdpid-county.csv`, 22,594 rows), alternates, individual debt, related parties (163,653 rows), non-compliant list (86 entities).
- **Licence:** public-record transparency publication; uniform public-record posture satisfied.
- **Cadence:** continuous portal updates; bulk CSV refreshed same day as this recon.
- **Completeness:** **not statewide-universe.** Only filing entities under SB 625 / Gov Code §403.0241. Comptroller FAQ answer to "Does the database include all special purpose districts?" is **No.**

### 2. TCEQ district boundary GIS — polygons or lists?

- **Both exist; boundaries are the GIS MapServer, not the open-data table.**
- **Polygons:** `Public/WaterDistricts/MapServer/0` — single statewide polygon layer, 2,796 features, 15 `TYPE` codes (MUD, WCID, FWSD, SUD, …).
- **Tabular list:** `hr84-s96f` — 3,092 district **office** records with point coordinates; useful for contact metadata, **not** for parcel membership.
- **Quality flags on polygons:** MUD `DIGITIZED` field mostly `N` / `NA` (1,760 + 60 of 1,906); polygons still present — metadata reflects survey lineage, not "no geometry."
- **ESD / PID / crime-control / hospital districts:** appear in Comptroller registry counts; **absent from TCEQ water boundary layer.**

### 3. Parcel joint — district-to-parcel or intersect ourselves?

**We intersect ourselves.** Explicit joint answer:

| Question | Answer |
|---|---|
| Does any source assign districts to parcels? | **No.** |
| Practical membership path | **Point-in-polygon** (parcel centroid or `txgio_parcel` geometry) against TCEQ boundary polygons → `membershipBasis: "point-in-polygon"` per `_inbox/2026-08-08_ATOM_families_specify_only_shapes.md` |
| Tax-rate / district-identity enrich | Left-join Comptroller registry on normalized `(district type, district number/name, county)` after spatial hit — expect **imperfect match** (527 more MUD polygons than registry MUD rows) |
| Secondary signal (CAD counties only) | Scan CAD assessment / exemption strings for MUD/PID tokens (`61a`, legacy Cotality dispatch) — **15 CAD counties**, supplements, does not replace spatial rail |
| Outside all verified boundaries | **`no-special-district` satisfied-present** (honest absence), not `not-yet` |

**Cost class:** Same factory pattern as **NFHL / OZ** (statewide layer load + bulk spatial writer), **not** zoning/setback assembly.

### 4. Scale ruling classification (2026-08-01)

**Class: statewide-UNIFORM acquisition + bulk spatial join** — rides the cheap parallel track, not per-jurisdiction-ASSEMBLY.

The 2026-08-01 decision deferred **"utility-availability from municipal utility districts"** (a reasoning product about water/sewer service), not **district membership + published tax-rate disclosure**. This rail wires two single statewide sources (TCEQ boundaries + Comptroller registry) and one statewide spatial join — the OZ template — without a per-city certification surface. Caveat that moves it off a naive "100% everywhere" reading: **coverage of the district universe is partial** (non-filers, non-water district types, registry/spatial mismatch). OPS-14 already lists MUD as statewide-uniform with "satisfied everywhere"; honest absence must cover (a) parcels outside known boundaries and (b) district types we only hold as registry rows without verified geometry — not a fifth assembly rail.

---

## Coverage math (numbers the program must carry)

| Measure | Count | Notes |
|---|---|---|
| Comptroller unique districts (latest report) | **3,028** | Superset of types beyond MUD |
| Comptroller MUD (latest) | **1,379** | Tax/disclosure registry |
| Comptroller ESD (latest) | **282** | **No TCEQ polygon source** in this recon |
| Comptroller PID (latest) | **197** | Boundary source not verified here |
| Registry entities with any `totl_rate_pc > 0` | **425 / 3,028 (14%)** | Tax-impact field often empty |
| TCEQ boundary polygons (all water types) | **2,796** | Membership geometry source |
| TCEQ MUD polygons (all statuses) | **1,906** | **527 > registry MUD count** |
| TCEQ MUD polygons (`STATUS='A'`) | **1,295** | Active-only subset |
| Non-compliant list | **86** | Separate CSV |
| Parcel geometry counties loaded | **196 / 254** | `_STATE.md` — spatial join denominator |
| CAD rows with owner (MUD string scan potential) | **4.6M / 15 counties** | `_STATE.md` — enrich only |

**Implication for manifest gate:** Rail can reach **satisfied-present** statewide for "no known water-district boundary intersection" quickly; **satisfied-present with district identity** concentrates in metro greenfield belts where MUDs cluster (Harris, Fort Bend, Williamson, Hays, …). ESD/PID completeness is a **phase-2** boundary hunt, not a launch blocker if typed absence is honest.

---

## Go / no-go

| | |
|---|---|
| **Go?** | **Yes** |
| **Why now** | Top-5 buyer question; public-record-only; no relationship required; factory already holds parcel geometry statewide and NFHL-style spatial join precedent |
| **Why not naive full coverage** | Registry incomplete; types split across agencies; tax rates sparse; crosswalk fuzzy |
| **No-go triggers (reversal)** | If operator requires **ESD + PID boundary completeness at launch** before any ship — that reclassifies phase 1 into multi-source assembly and should wait |

---

## Sized build proposal

Program follows WDLL practice before implementation (`90_runbooks/wdll_practice.md`). No time estimates — dependency-ordered phases only.

### Phase 0 — WDLL + source registry (planner)

- Operator-approved WDLL with numbered acceptance items: spatial join on gold Bastrop parcel, honest absence outside boundaries, registry rate surfaced when join succeeds, `no-special-district` outside polygons, manifest cell flips off `missing`.
- Register verified rows in `_land_records/source_rail_registry.md` for TCEQ MapServer + Comptroller CSV (four-point probe artifacts in `_inbox/`).

### Phase 1 — Contract + tables (factory)

- Publish `@empressaio/atom-contract` **`special-district-membership`** (spec exists: `_inbox/2026-08-08_ATOM_families_specify_only_shapes.md`).
- Deployment DB tables: `tx_tceq_water_district` (polygon + attributes), `tx_comptroller_spd` (registry snapshot keyed `spd_publ_id` + normalized district key).
- Ingest jobs: TCEQ full polygon pull (≤3k features — trivial size); Comptroller CSV nightly/weekly refresh from `assets.comptroller.texas.gov`.

### Phase 2 — Crosswalk + writer (engine, bulk slot)

- Deterministic crosswalk: TCEQ `DISTRICT_ID` / `NAME` / `TYPE` / `FIPS` → Comptroller entity (log **unmatched** both directions; do not silently drop).
- County-batch writer `write-special-district-membership-county.mjs`: spatial join `txgio_parcel` → districts; mint 0..N atoms per parcel; `write-then-verify` on stored bytes.
- **Dependency:** parcel geometry county loaded; parcel-node anchors preferred but join can run on geometry table alone.
- **Slot:** shares neondb bulk-writer slot with other statewide writers (currently sweep-held).

### Phase 3 — Serve + manifest (factory joint)

- Engine registration + MCP/PE facet for district list + total rate where present (vintage mandatory).
- `countyRailRefreshCli` already lists `mud` ordinal 14; flip `atomFamilyState` → `present`, `hasWriter` → `true` only after apply + serve probes.
- Ledger re-denominator already at 254×14 = 3,556 cells (`_STATE.md`).

### Phase 4 — Type expansion (post-MVP)

- ESD boundaries: county GIS / legislative map sources — **per-type probe**, not assumed statewide uniform.
- PID / improvement districts: Comptroller registry row served **without boundary** where geometry unverified (`membershipBasis` cannot be `point-in-polygon`; surface as named district with `sourceTier: comptroller-registry` + confidence downgrade).
- CAD assessment string cross-check in 15 CAD counties as independent instrument (INV-5), not writer self-proof.

### Acceptance sketch (for WDLL)

1. Live serve on Bastrop gold parcel inside known MUD returns district name + type + rate vintage when registry join hits.
2. Live serve on rural parcel outside all TCEQ polygons returns `no-special-district` satisfied-present.
3. County with geometry but zero registry match still serves spatial membership with `taxRate: absent` honest shape.
4. Manifest `mud` cell moves off `missing` / `no-writer` for probe counties after apply.
5. Adversarial re-grade: quoted coverage numbers match SQL counts, not prose.

### Effort shape (relative, not calendar)

| Phase | Relative size | Comparable lane |
|---|---|---|
| 0 WDLL + registry | S | NFHL source probe |
| 1 contract + ingest | S | OZ registry + NFHL table load |
| 2 crosswalk + writer | **M** | `flood-hazard-fact` county writer (spatial join at scale) |
| 3 serve + manifest | S | cad-parcel-roll serve seam |
| 4 ESD/PID expansion | **L** | Easement per-county hunt — defer |

**Critical path:** bulk writer slot after parcel-node sweep → Phase 2 apply → serve probes (code-done ≠ customer-done).

---

## Recommendation to operator

1. **Un-HELD W4 for Phase 1–3 only** (water-district types with TCEQ polygons + Comptroller enrich).
2. **Keep ESD/PID boundary completeness out of launch gate** — registry-only or phase-4 unless a deal demands it.
3. **Do not assert OPS-14 "satisfied everywhere" means every district type** — it means every **parcel** has a provenanced outcome (membership or honest absence), not that every SPD in Texas appears in the registry.

---

## Live fetch log (audit trail)

```
# TCEQ polygon count
curl "https://gisweb.tceq.texas.gov/arcgis/rest/services/Public/WaterDistricts/MapServer/0/query?where=1%3D1&returnCountOnly=true&f=json"
→ {"count":2796}

# TCEQ MUD count
→ {"count":1906}

# TCEQ active MUD
→ {"count":1295}

# TCEQ TYPE breakdown (groupBy)
→ MUD 1906, WCID 251, MMD 198, FWSD 84, SUD 82, …

# Comptroller CSV
curl -L "https://assets.comptroller.texas.gov/open-data-files/spdpid-entity.csv"
→ 21,688 rows; Last-Modified 2026-08-10

# data.texas.gov tabular
curl "https://data.texas.gov/resource/hr84-s96f.json?$select=count(*)"
→ [{"count":"3092"}]
```

Parse script (local): `P:/tmp/mud_recon/analyze_spdpid.mjs` → unique districts **3,028**; MUD **1,379**; rates **425** with `totl_rate_pc > 0`.

---

## PLANNER VERIFICATION AT SOURCE (2026-08-10, independent of the recon agent)

Every headline number below was re-fetched by the planner against the live TCEQ endpoint, not taken from the report.

| Claim | Report | Planner live re-fetch | Verdict |
|---|---|---|---|
| TCEQ total district polygons | 2,796 | **2,796** (`returnCountOnly` on `Public/WaterDistricts/MapServer/0`) | **CONFIRMED exactly** |
| TCEQ MUD polygons | 1,906 | **1,906** (`where=TYPE='MUD'`) | **CONFIRMED exactly** |
| No ESD in the TCEQ water layer (A5) | ESD absent | **CONFIRMED** — 17 distinct `TYPE` values, none is ESD: SWCD, MMD, ND, ID, WID, GCD, LID, WCID, DD, RD, FWSD, OTH, SUD, RA, NYD, MUD, MD | **CONFIRMED** |

The recon's counts are accurate and its adversarial pre-registration was genuine (expectations written before the fetch, all five attacked and confirmed with numbers). **Accepted.**

### Two amendments the recon did not surface — both make Phase 1 BIGGER and CHEAPER than scoped

1. **The field name is `TYPE`, not `DISTRICT_TYPE`.** A query on `DISTRICT_TYPE` returns HTTP 400 `Failed to execute query`. Real schema: `OBJECTID, NAME, DISTRICT_ID, TYPE, COUNTY, COGO_ACRES, PLAT_ACRES, DIGITIZED, STATUS, CREATION_DATE, BNDRY_CHANGE, METHOD, SOURCE, ACCURACY, COMMENTS, INITIALS, UPDATED, TX_CNTY, FIPS, SHAPE`. Whoever builds the ingest must use `TYPE` or every filtered query fails closed.

2. **`FIPS` is populated on ALL 2,796 polygons** (`where=FIPS IS NOT NULL` returns 2,796), and the layer also carries `TX_CNTY`. The polygons arrive with a COUNTY KEY ALREADY ATTACHED. That removes a whole class of work the recon implied: we do not need to derive county membership before the parcel join, only the parcel-to-polygon PIP itself. It also gives the writer a natural per-county batching key, matching every other county writer we run.

3. **Scope MUD-only understates the rail.** Other tax-bearing types in the same layer, same fetch, same geometry: **WCID 251, MMD 198, FWSD 84**. With MUD that is ~**2,439 tax-relevant polygons** of the 2,796. A buyer in a WCID or a MMD has exactly the same disclosure and tax-bill question as one in a MUD; shipping MUD alone would answer the question for 1,906 polygons and stay silent on 533 more from the SAME already-ingested layer. Recommend Phase 1 ingest the whole layer and let the atom body carry `districtType`, subcategorizing WITHIN the rail rather than filtering at ingest — the R1 split rule applied to this rail (split on source+geometry, subcategorize on attribute; these share both source and geometry, so they subcategorize).

### Standing caution carried forward

The rail must state its own incompleteness with numbers, never imply 254-county closure: the Comptroller registry is self-reported and admits omissions, the two agency universes disagree (1,379 vs 1,906 vs 2,043 for nominally the same type), and ESD/PID have no polygon coverage in this source at all. Same discipline as the zoning rail's "wired-city, not data" lesson.
