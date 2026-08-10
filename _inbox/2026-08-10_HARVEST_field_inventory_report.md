---
id: 2026-08-10_HARVEST_field_inventory_report
title: Harvest field inventory — what sources carry vs what we persist
date: 2026-08-10
status: lane close artifact
owner: planner
related:
  [
    _decisions/2026-08-10_harvest_completeness_ruling,
    _inbox/2026-08-10_harvest_gap_prework_findings,
    _catalog/source_field_inventory.json,
  ]
---

# Harvest field inventory report

Governing ruling: `_decisions/2026-08-10_harvest_completeness_ruling.md`. Machine-readable catalogue: `_catalog/source_field_inventory.json` (1,434 field rows across 11 sources, generated 2026-08-10). Phase-2 probe artifacts: `_inbox/phase2_probes_2026-08-10/*.json`. Live schema queried read-only against deployment Neon (`DEPLOYMENT_DATABASE_URL` / `neondb`) via `information_schema.columns` for `cad_property` (21 cols), `txgio_parcel` (19 cols), `tx_fema_nfhl_flood_zone` (16 cols).

## Executive summary

The factory already paid for 254 county CAD visits and wrote full ArcGIS field inventories to disk, then used two fields per county for routing. Rolling those probes up yields **1,193 distinct (field, type) pairs** on county CAD REST layers, averaging **47.3 fields/county** across **176 counties with field lists**. Against live store schemas, **~1088 CAD REST fields are unpersisted or only partially persisted** (many value fields exist in `cad_property` under different source names; identity fields like `geo_id` exist on `txgio_parcel` but not `cad_property`).

Structural building data (`living_area_sqft`, `year_built`) is **not in the REST layer at scale** (YEAR_BUILT in 9/176 probed counties; IMPRVMAINAREA in 2/176). That remains the separate CAMA bulk-export motion — not conflated here.

---

## CP1 adversarial review (before Phase 2) — FALSE ABSENCE check

**Reviewer mandate:** reject gap inflation from naming mismatches before any Phase-2 probe spend.

| Probe name | Persisted as | Verdict |
|---|---|---|
| `market` / `MKT_VALUE` | `cad_property.market_value` | CONFIRMED persisted — not a gap |
| `imprv_val` / `IMP_VALUE` | `cad_property.improvement_value` | CONFIRMED persisted |
| `land_val` / `LAND_VALUE` | `cad_property.land_value` | CONFIRMED persisted |
| `legal_desc` / `LEGAL_DESC` | `cad_property.legal_description` | CONFIRMED persisted |
| `owner_name` / `OWNER_NAME` | `cad_property.owner_name` + `txgio_parcel.owner_name` | CONFIRMED persisted |
| `file_as_name` | `cad_property.owner_name` (alternate sort key) | CONFIRMED persisted — do not re-harvest as separate column |
| `situs_num` + `situs_street` (+ suffix/prefix) | `cad_property.situs_address` / `txgio_parcel.situs_address` (concatenated) | CONFIRMED persisted as single line — **structured components are a real gap** |
| `addr_line1-3`, `mail_line1` | `cad_property.owner_mailing_address` (single concatenated line) | CONFIRMED partially persisted — structured mailing is a gap |
| `geo_id` / `GEO_ID` | `txgio_parcel.geo_id` only | **PARTIAL** — persisted on geometry store, **absent from `cad_property`**; remains Class **A** for CAD-roll harvest |

**CP1 result:** zero false absences on value/owner/legal fields after alias pass. Gap list is not inflated by naming. Structured situs/mailing and cross-store join keys (`geo_id` on CAD roll) survive as real gaps.

---

## Phase 1 — CAD REST rollup (254 probe files)

| Metric | Count |
|---|---:|
| Probe files | 254 |
| With full field list | 176 |
| Without field list | 78 |
| Distinct (field, type) pairs | 1,193 |
| Distinct field names (case variants) | 1,089 |
| Avg fields / county (of 176) | 47.3 |

### The 78 counties without field lists — not a footnote

These are **not** "never probed." All 78 have probe artifacts; they lack `fields[]` because the probe concluded no usable REST inventory. Breakdown by `status`:

| Status | Count | Meaning |
|---|---:|---|
| `honestly_absent` | 55 | No public ArcGIS REST parcel service found after BIS + GIS-hub search; StratMap fallback flagged |
| `partial` | 16 | Service reachable; fields step OK but sample query or count failed (no reliable prop_id join) |
| `probe_failed` | 3 | HTTP/transport failure mid-probe |
| `not_found` | 3 | Discovery returned no candidate service |
| `honestly_absent_rest` | 1 | REST explicitly absent (vendor-specific) |

**Examples verified in artifacts:**

- **48009 Archer** (`honestly_absent`): `"No public ArcGIS REST parcel service found after search + host patterns"`, `stratmap_fallback: true`
- **48483 Wheeler** (`honestly_absent`): BIS search 0 hits; GIS hub 4 results, none parcel REST; StratMap has 7,692 features at 6.73% bad prop_id rate
- **48447 / 48495** (`partial`): layer list + fields HTTP 200, but sample query used `1=1 fallback` and count returned null

**Coverage implication:** harvest completeness at CAD REST applies to **176 counties with inventories**, not 254. The other 78 honestly rely on StratMap (or bulk export where flagged `bulk_primary`).

### Known-unpersisted CAD REST fields at wide coverage (of 176)

From rollup + live schema diff (prework confirmed, alias-cleaned):

| Field | Counties (of 176) | Class | accessPolicy |
|---|---:|---|---|
| **DEED_DATE** / Deed_Date | 148 | B | public-free |
| **GEO_ID** (cad_property gap) | 148 | A | public-free |
| **SCHOOL** / school | 147 | B | public-free |
| **HOOD_CD** / hood_cd | 147 | B | public-free |
| **DEED_SEQ**, VOLUME, PAGE | 147–150 | B | public-free |
| **ADDR_LINE1–3**, ADDR_CITY, ADDR_STATE, zip | 147–148 | B | public-paid (mailing) |
| **NEXT_APPRAISAL_DT** | 142 | B | public-free |
| **MAP_ID**, BLOCK, TRACT_OR_LOT, ABS_SUBDV_CD | 142–151 | A | public-free |
| **FILE_AS_NAME** | 142 | D (alias of owner_name) | — |
| CREATED_DATE / LAST_EDITED_DATE | 135 | B | public-free |

Structural REST fields (confirmed sparse): `YEAR_BUILT` 9 counties, `IMPRVMAINAREA` 2, exemption detail 1 county each — **IGNORE for REST harvest; CAMA bulk is the path.**

---

## Phase 2 — other sources (live probes, exit-bounded)

Each source: one `?f=json` layer metadata GET; no polling loops.

### TxGIO StratMap parcels (`txgio_stratmap_parcels`)

Source schema documented in `legacy-design-tools/lib/cad-ingest/src/txgio/parse.ts` (36-field TNRIS schema; ingest subset). **196 counties loaded** in `txgio_parcel`.

**Persisted:** `prop_id`, `geo_id`, `owner_name`, situs line + city/state/zip, geometry, zoning stamp columns.

**Not persisted from StratMap zip (available on every loaded county):** `LEGAL_DESC`, `LAND_VALUE`, `IMP_VALUE`, `MKT_VALUE`, `STAT_LAND_` (use code), `YEAR_BUILT`, `GIS_AREA`, structured situs components (`SITUS_NUM`, `SITUS_STRE`, …), all `MAIL_*`, `DATE_ACQ`, `TAX_YEAR`, `NAME_CARE`.

These duplicate facts that *should* land in `cad_property` when CAD roll is wired; today they are discarded at ingest by design.

### TCEQ water districts

**Endpoint:** `https://gisweb.tceq.texas.gov/arcgis/rest/services/Public/WaterDistricts/MapServer/0` (confirmed 22 fields, polygon, 2,796 features per prior recon).

| Field | In source | Persisted today | Notes |
|---|---|---|---|
| NAME, DISTRICT_ID, TYPE, COUNTY, FIPS, TX_CNTY, STATUS | yes | ingest script selects these | `ingest-tx-special-districts.mjs` — table load is separate motion |
| **COGO_ACRES**, **PLAT_ACRES** | yes | no | Class B — district acreage for special-district-fact body |
| **CREATION_DATE**, BNDRY_CHANGE, UPDATED | yes | no | Class B — provenance / freshness |
| DIGITIZED, METHOD, SOURCE, ACCURACY, COMMENTS | yes | no | Class D — QC metadata |

### RRC wells + pipelines

**Endpoints** (from `lib/adapters/src/federal/texas-rrc.ts`):

- Wells: `https://www.gis.hctx.net/arcgishcpid/rest/services/TXRRC/Wells/MapServer/0` — **11 fields**
- Pipelines: `.../TXRRC/Pipelines/MapServer/0` — **27 fields**

| Layer | Source carries | Writer / proxy persists | Gap |
|---|---|---|---|
| Wells | SYMNUM, API, RELIAB, SURFACE_ID, WELLID, LONG83/LAT83, … | well-fact uses SURFACE_ID, SYMNUM, API, WELLID, RELIAB, coords | All 11 fields fit in body — none stored relationally yet (atoms slot) |
| Pipelines | P5_NUM, OPER_NM, SYS_NM, COM_CARRIE + 23 more | Map proxy pulls P5_NUM, OPER_NM, SYS_NM, COM_CARRIE only | **DIAMETER, COMMODITY*, STATUS_CD, SYSTYPE, LENGTH** — Class B body fields |

No Class C rails proposed — R1 subcategorize on existing `rrc-wells` / `rrc-pipelines` rails.

### NTAD NARN rail + grade crossings

**Endpoints** (from `hauska-engine/packages/engine-core/src/rail-corridor-fact/ntad-source.ts`):

- Lines: `NTAD_North_American_Rail_Network_Lines/FeatureServer/0` — **34 fields** probed
- Crossings: `NTAD_Railroad_Grade_Crossings/FeatureServer/0` — **49 fields** probed

Writer fetches **NET, RROWNER1, SUBDIV** (+ OBJECTID) for lines; **CrossingID, Longitude, Latitude** for crossings. Remaining ~30 line fields (e.g. TRACKS, PASSENGERS, STRACNET) and ~45 crossing attributes (warning devices, train counts) are **Class B body fields**, not new rails. **CP2: all Class C rail proposals REFUTED.**

### FEMA NFHL (`S_FLD_HAZ_AR` / MapServer/28)

Bulk table `tx_fema_nfhl_flood_zone`: **198,178 rows** statewide (live schema queried).

| Source field | Persisted column | Status |
|---|---|---|
| FLD_ZONE | fld_zone | yes |
| ZONE_SUBTY | zone_subty | yes (floodway lives here) |
| SFHA_TF | sfha_tf | yes |
| STATIC_BFE | static_bfe | yes |
| DFIRM_ID, FLD_AR_ID | dfirm_id, fld_ar_id | yes |
| OBJECTID | fema_object_id | yes |
| **STUDY_TYP** | — | **no** — Class B (study type for confidence) |
| **DEPTH**, **VELOCITY** | — | **no** — Class B (zone AE/V detail) |
| **SOURCE_CIT** | — | **no** — Class B (panel citation) |
| V_DATUM, AR_REVERT, DUAL_ZONE, … | — | Class D — revert/metadata |

Panel effective date is **not** on layer 28 attributes; lives on `S_FIRM_PAN` (separate gdb layer — out of scope for this REST pass).

### City GIS — Bastrop pattern

**Endpoint:** `Zoned_Parcels/FeatureServer/83` — **23 fields** (live probe).

| Field | Taken today | Verdict |
|---|---|---|
| ZoneTypeClass + ZoneDesc | yes → `txgio_parcel.zoning_district` (+ desc in logs) | persisted (stamp) |
| TypicalUses, MinimumLotSize, MaxBuildingHeight, MaxImpervisionCoverage, … | **no** | Class B — could enrich zoning-fact body **if** ordinance text is not authoritative (Bastrop CORRECTION A: setback numbers come from code text, not GIS card) |
| FrontSetback, SideSetback, RearSetback, … | **no** | Class **D** — explicitly rejected per CORRECTION A |
| PDD_doc_ord | no | Class B — PD ordinance pointer |

### USGS 3DEP

**Endpoint:** `https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer` (exportImage raster — not a field list source).

| Derivative | Persisted | Notes |
|---|---|---|
| DEM raster (GeoTIFF) | yes — GCS via `siteTopographyIngest` | atom event payload |
| Contour GeoJSON | yes — atom event | derived from DEM |
| dem_resolution_m, catchment_bbox | yes — atom payload | |
| **slope**, **aspect** | **no** | computed in terrain path, not stored as facts — Class B if terrain reasoning needs citeable slope |

### Municipal code corpora

Adapter: `hauska-engine/packages/corpus/src/adapters/raw-pdf/` + structural extractor.

| Content | Persisted | Gap |
|---|---|---|
| Section text → `code-section` atoms | yes | — |
| Setback table sections → `setback-rule` atoms | yes (where extracted) | — |
| Cross-references, definitions | yes (in tree) | — |
| **Permitted-use tables** | partial | mapped via `district-code-section-map.ts` as separate atom refs — not all districts wired |
| **Overlay districts** | no | overlay refs stay in prose; not structured facts |
| **Amendment history** | no | `code-amendment` + edition-history path exists but `supportsAmendments: false` on RawPdfAdapter |
| PD ordinances | partial | as numbered code-section atoms when extractable |

---

## CP2 adversarial review (after classification)

**Reviewer mandate:** refute Class C rails; challenge non-public-free accessPolicy.

| Proposal | CP2 verdict |
|---|---|
| Any new rail for DEED_DATE, SCHOOL, HOOD_CD | **REFUTED** → Class B body on `cad-parcel-roll` / owner-fact |
| Any new rail for TCEQ acres/dates | **REFUTED** → body on `special-district-fact` |
| Any new rail for NTAD extra columns | **REFUTED** → body on `rail-corridor-fact` |
| Any new rail for NFHL DEPTH/VELOCITY | **REFUTED** → body on `flood-hazard-fact` |
| Structured owner mailing (ADDR_LINE*) | **public-paid** upheld — matches owner-fact tier ruling |
| All other unpersisted public-record fields | **public-free** default — no refutation |

**Class C count in catalogue: 0.** All proposals pushed to body fields per R1 split rule.

---

## Ranked take-list (by reasoning improvement, not field popularity)

Priority order: infrastructure join keys → facts that improve existing chains → everything else.

| Rank | Field(s) | Source | Coverage | Class | Improves |
|---|---|---|---:|---|---|
| 1 | **GEO_ID** on `cad_property` | CAD REST | 148/176 | A | Address-to-parcel + 8 CROSSWALK_HOLD / 2 LANDUSE_JOIN_HOLD county joins |
| 2 | **MAP_ID, BLOCK, TRACT_OR_LOT, ABS_SUBDV_CD** | CAD REST | 142–151/176 | A | Plat identity for legal-description resolution and crosswalk |
| 3 | **DEED_DATE** | CAD REST | 148/176 | B | Tenure fact in property brief / market-layer reasoning without MLS |
| 4 | **SCHOOL** | CAD REST | 147/176 | B | School district citation; pairs with mud/special-district reasoning |
| 5 | **HOOD_CD** | CAD REST | 147/176 | B | Appraisal district comparables cohort — citable vs invented comps |
| 6 | **Structured situs** (num, street, prefix, suffix) | CAD REST + StratMap | 143–196 | B | Address-to-parcel batch resolution (`txgio_parcel.situs_address` exists but unstructured) |
| 7 | **DEED_SEQ + VOLUME + PAGE** | CAD REST | 147–150/176 | B | Recorded-instrument pointer for citation chain |
| 8 | **NEXT_APPRAISAL_DT** | CAD REST | 142/176 | B | Freshness confidence on appraised values |
| 9 | **NFHL STUDY_TYP, DEPTH, VELOCITY, SOURCE_CIT** | FEMA bulk/REST | statewide | B | Flood-hazard-fact depth beyond zone polygon label |
| 10 | **TCEQ COGO_ACRES, PLAT_ACRES, CREATION_DATE** | TCEQ | 2,796 polys | B | special-district-fact body + provenance |
| 11 | **RRC pipeline DIAMETER, COMMODITY, STATUS_CD** | RRC GIS | statewide mirror | B | rrc-pipelines atom body enrichment |
| 12 | **StratMap LEGAL_DESC, STAT_LAND_, YEAR_BUILT** (on ingest path) | TxGIO zip | 196 loaded | B | Stop discarding at parse — land in `cad_property` or txgio extension |
| 13 | **NTAD line/crossing extra attributes** | NTAD | statewide | B | rail-corridor-fact body (warning devices, traffic counts) |
| 14 | **3DEP slope/aspect** (if persisted) | USGS derivative | on-demand | B | Terrain / drainage reasoning with citation |

---

## NOT-WORTH-TAKING list (Class D, with reasons)

| Field / group | Reason |
|---|---|
| ArcGIS OBJECTID, Shape__Area/Length, GlobalID, GFID | Service metadata; no product reasoning |
| GIS setback card fields (FrontSetback, SideSetback, …) on Bastrop zoning layer | CORRECTION A — ordinance text is authoritative; GIS card duplicates and can drift |
| Abandoned B3 PlaceTypeClass / Place Type layers | Repealed ordinance; must not stamp |
| `FILE_AS_NAME` as separate column | Alias of `owner_name`; CP1 confirmed |
| VALUE fields already in `cad_property` under different probe names | CP1 confirmed — market/imprv/land/legal |
| YEAR_BUILT / IMPRVMAINAREA on CAD REST (most counties) | Not present on REST layer; CAMA bulk is the correct motion |
| Exemption detail on REST (1 county) | CAMA bulk motion |
| FEMA AR_REVERT, DUAL_ZONE, V_DATUM | Revert/metadata; no current chain consumer |
| TCEQ DIGITIZED, ACCURACY, COMMENTS, INITIALS | QC housekeeping |
| Municipal overlay districts as GIS layer | Not extracted; would need code-ingest scope, not harvest pass |
| Raw PDF amendment history | Requires edition-history wiring, not field harvest |

---

## Store schema reference (live query 2026-08-10)

**cad_property (21 cols):** county_fips, prop_id, tax_year, owner_name, owner_mailing_address, situs_address, situs_city, situs_zip, legal_description, exemption_codes, land_value, improvement_value, market_value, assessed_value, year_built, living_area_sqft, land_acres, property_use_code, source_file, source_vintage, ingested_at

**txgio_parcel (19 cols):** county_fips, tile_key, feature_index, prop_id, geo_id, owner_name, situs_address, situs_city, situs_state, situs_zip, geometry, bbox cols, source_file, source_vintage, ingested_at, zoning_district, zoning_jurisdiction

**tx_fema_nfhl_flood_zone (16 cols):** zone_row_id, dfirm_id, fld_ar_id, fld_zone, zone_subty, sfha_tf, static_bfe, fema_object_id, geometry, bbox cols, source, source_vintage, source_citation, ingested_at

---

## Scope fence (observed)

This lane produced catalogue + ranked list only. No harvest, no adapter changes, no manifest cells, no CAMA bulk parser opened.

**Next motion (out of scope here):** wire harvest on existing factory passes per ranked list; CAMA bulk routing remains `_inbox/2026-08-10_cad_structured_data_gap.md`.

---

# PLANNER VERIFICATION 2026-08-10 — ACCEPTED WITH ONE CORRECTION

Artifacts confirmed present and well-formed: `_catalog/source_field_inventory.json` (772 KB, **1,434 entries**, 11 sources, schema tracks `persistedCadProperty` / `persistedTxgioParcel` separately — good), 7 Phase-2 probe artifacts, this report at 17 KB.

**Class C = 0 is the right answer and worth stating plainly.** Every new-rail proposal was refuted down to a body field. That is the R1 split rule working: a new FIELD on a source we already touch is almost never a new rail. The reviewer earned that one.

**accessPolicy discipline held:** 1,417 `public-free` / 17 `public-paid`, with the paid set confined to owner mailing components. No public-record field was quietly moved behind the paywall by an ingest decision.

**The 78-without-field-lists question was answered properly** — 55 `honestly_absent`, 16 `partial`, 3 `probe_failed`, 3 `not_found`, 1 `honestly_absent_rest`. Those are probed-and-absent, not never-run. Good; that was a real risk.

## THE CORRECTION — county counts are understated by CASE-SPLITTING

The rollup keyed fields on `(field, type)` **case-sensitively**. ArcGIS services return the same logical field in different casings across counties, so one field became two rows and each row carried only part of the county count.

Planner recount directly from the 254 probe files:

| Field | Report says | Actual | Understated by |
|---|---:|---:|---:|
| **`BLOCK`** | **83** | **151** | **67** |
| `PROP_ID` | 143 | 163 | 20 |
| `LEGAL_DESC` | 149 | 159 | 10 |
| **`GEO_ID`** | **148** | **158** | **10** |
| `COUNTY` | 147 | 156 | 9 |
| `SITUS_NUM` / `SITUS_CITY` / `SITUS_ZIP` | 148 | 157 | 9 each |
| `DEED_DATE` | 147 | 148 | 1 |

Overall: **1,166 case-sensitive distinct names vs 1,089 case-insensitive — 77 entries are pure case duplicates.**

`GEO_ID` is 148 lowercase + 10 uppercase = **158**. `SCHOOL` matched exactly at 147 (no case variance), which is why it looked consistent and masked the pattern.

**Why it matters, and it is not cosmetic:** `BLOCK` was ranked as spotty at 83/176 and is actually near-universal at 151/176. A take-list ranked partly on coverage would have deprioritised a field present in 86% of counties. The top-ranked field, `GEO_ID`, is also 10 counties better than reported — and those 10 counties are exactly the kind that get dropped from a backfill roster built off this catalogue.

**This is the same defect class CP1 was built to catch** — a field that looks absent but is present under another name — arriving as CASE rather than ALIAS. CP1's alias pass (`market`→`market_value`, `imprv_val`→`improvement_value`) was correct and caught real ones; it just did not normalise case first.

**Required fix before the catalogue is used to build anything:** re-key the rollup on `UPPER(field_name)`, merge the 77 duplicate entries, recount, and re-rank. The classifications and accessPolicy assignments do not change — only the counts and therefore the ordering.

## Standing rule from this

**Normalise identifiers before you count them.** Any inventory, coverage, or reconciliation that groups by a name from an external source must case-fold (and trim) first. External services are not consistent about casing across instances, and a case-split count silently understates coverage in exactly the direction that makes a real field look optional.

Same family as the 2026-07-29 situs comma tail and the CAD `prop_id` zero-padding: **an identifier that is not normalised at BOTH ends produces a wrong answer that looks plausible.**
