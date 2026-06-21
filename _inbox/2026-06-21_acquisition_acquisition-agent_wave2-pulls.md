---
id: 2026-06-21_acquisition_acquisition-agent_wave2-pulls
title: Acquisition agent — Wave 2 public-record pulls (Calibrated Spine K1)
date: 2026-06-21
agent: acquisition-agent
repo: doc_repo (canary pulls + staging; bulk gated)
dispatch: Calibrated Spine Wave 2 — K1 acquisition begins
tasks: [K1-W2-P0-bastrop, K1-W2-P1-austin, K1-W2-P1-san-antonio, K1-W2-edition-bundle]
wave: 2
status: close-canary-blocked-on-gating
blocks_unblocked: []
---

# Close — Wave 2 acquisition pulls (canary complete; bulk gated)

## Summary

Wave 2 K1 acquisition executed **canary-only** pulls per gating: operator GCS landing bucket **not confirmed** (`gs://hauska-calibration-raw/` returns 404). cc-agent-C F3 raw-ledger landing schema **not yet stamped** (pending Wave 2 F3 build). Canary artifacts landed at interim dev path `_inbox/acquisition_staging/backtest/` per Wave 1 fallback policy. **No bulk storage, no Neon load, zero interpretation at ingest.**

Open-data anchors (Austin, San Antonio) are **ready to bulk-pull** once bucket + schema confirmed. Bastrop MyGov Address Lookup requires **Playwright extension** to the existing SmartCity scraper (no unauthenticated REST shortcut found). Edition bundle v0 acquired two adoption-ordinance canaries (Bastrop 2018 IBC, Austin 2021 IBC); Municode Previous Versions and full adoption chains remain **critical-path gaps** for K2 retrodiction.

Read: [`02_base_calibration_bootstrap.md`](../_calibrated_spine_roadmap/02_base_calibration_bootstrap.md), Wave 1 inventory [`2026-06-21_acquisition_acquisition-agent_wave1-public-record-target-inventory.md`](2026-06-21_acquisition_acquisition-agent_wave1-public-record-target-inventory.md).

---

## Gating status (operator action required)

| Gate | Status | Evidence |
|---|---|---|
| GCS landing bucket `gs://hauska-calibration-raw/` | **BLOCKED — bucket does not exist** | `gcloud storage ls gs://hauska-calibration-raw/` → `404 not found` |
| cc-agent-C F3 raw-ledger manifest schema | **BLOCKED — not stamped** | F3 close notes schema gaps; acquisition used Wave 1 proposed manifest shape with `schema_hash: null` |
| Single-address canary before bulk | **DONE** | Bastrop lookup recon + 100-row open-data samples (see manifests below) |
| Bulk pulls | **HELD** | Awaiting operator bucket confirm + cc-agent-C schema stamp |

**Proposed landing layout** (unchanged from Wave 1):

```
gs://hauska-calibration-raw/
  backtest/
    {jurisdiction_key}/
      {record_type}/          # permit | inspection | variance | incident | edition_adoption
        {provenance}/         # open_data | portal_scrape | pir | smartcity_mygov
          acquired={YYYY-MM-DD}/
            manifest.json
            data/
```

**Interim canary path (dev only):** `P:/doc_repo/_inbox/acquisition_staging/backtest/`

Existing GCS buckets on project (for operator reference): `gs://cortex-api-objects-prod/`, `gs://legacy-design-tools-prod-objects/`.

---

## P0 — Bastrop MyGov (Address Lookup extension)

### Canary result

| Item | Value |
|---|---|
| Portal | https://public.mygov.us/bastrop_tx |
| Address Lookup UI | https://public.mygov.us/bastrop_tx/lookup |
| Canary address | `1311 Main St` (recon only; SPA did not return case rows without browser automation) |
| REST shortcut | **None confirmed** — probes to `/lookup/search`, `/api/lookup`, `/AddressLookup/Search` all 404 |
| Existing acceleration path | SmartCity OS `mygov_work_orders` / `mygov_raw_records` Playwright scraper (tenant-tagged; 90-day raw retention per [`2026-06-08_mygov_raw_retention.md`](../_decisions/2026-06-08_mygov_raw_retention.md)) |

### Wave 2 extension plan (dispatch to cc-agent-M / SmartCity scraper)

Extend the existing MyGov scraper path to:

1. Navigate `/bastrop_tx/lookup`, submit address search, capture all XHR responses (permits, inspections, variances, code enforcement, subdivisions).
2. Map each raw response row to landing schema fields (verbatim vendor columns): `address`, `case_id` / `permit_number`, `record_type`, `status`, `applied_date`, `issued_date`, `finaled_date`, `inspection_steps` (if present in source).
3. Export snapshots to GCS calibration bucket (isolated from SmartCity 90-day Neon raw retention).
4. Rate-limit: respect MyGov ToS; stagger Address Lookup queries; no parallel flood.

### Bastrop canary manifest

| Field | Value |
|---|---|
| Path | `_inbox/acquisition_staging/backtest/bastrop_tx/permit/portal_scrape/acquired=2026-06-21/` |
| Row count | 0 (recon) |
| Source URLs | https://public.mygov.us/bastrop_tx/lookup |
| Module targets | building_permits, planning_zoning, variances, code_enforcement, inspections |
| Interpreted fields | **false** |

---

## P1 — Austin (SODA bulk anchors)

### Manifest — Issued Construction Permits

| Field | Value |
|---|---|
| Dataset | Issued Construction Permits (`3syk-w9eu`) |
| Source URL | https://data.austintexas.gov/Resource-Explorer/3syk-w9eu/ |
| SODA resource | https://data.austintexas.gov/resource/3syk-w9eu.json |
| **Row count (full corpus)** | **2,361,893** |
| Column count | 78 |
| Date range (`issue_date`) | **1921-09-20** → **2026-06-20** |
| Canary sample | 100 rows → `_inbox/acquisition_staging/backtest/austin_tx/permit/open_data/acquired=2026-06-21/data/issued_construction_permits_sample100.json` |
| SHA256 (canary) | `9d04e2580febea92d644e25325abec88c49403ba28a552336bffd4de8f628ce3` |
| Bulk pull command (ready) | `curl -o issued_construction_permits.csv "https://data.austintexas.gov/api/views/3syk-w9eu/rows.csv?accessType=DOWNLOAD"` |
| Inspection pass/fail in dataset | **Sparse** — issued-stage records; secondary ABC/EDIMS pull may be needed for inspection outcomes |
| Interpreted fields | **false** |

### Manifest — Board of Adjustment / variance

| Field | Value |
|---|---|
| Dataset | Board of Adjustment Cases (`ykxk-t5y9`) |
| Source URL | https://data.austintexas.gov/Resource-Explorer/ykxk-t5y9/ |
| SODA resource | https://data.austintexas.gov/resource/ykxk-t5y9.json |
| **Row count (full corpus)** | **3,283** |
| Column count | 63 |
| Canary sample | 100 rows → `_inbox/acquisition_staging/backtest/austin_tx/variance/open_data/acquired=2026-06-21/` |
| Bulk pull command (ready) | `curl -o board_of_adjustment_cases.csv "https://data.austintexas.gov/api/views/ykxk-t5y9/rows.csv?accessType=DOWNLOAD"` |
| Interpreted fields | **false** |

---

## P1 — San Antonio (open data + legacy portal)

### Manifest — Permits Issued 2020–2024

| Field | Value |
|---|---|
| Dataset | Building Permits — PERMITS ISSUED 2020-2024 |
| Source URL | https://data.sanantonio.gov/dataset/building-permits |
| CSV download | https://data.sanantonio.gov/dataset/05012dcb-ba1b-4ade-b5f3-7403bc7f52eb/resource/c22b1ef2-dcf8-4d77-be1a-ee3638092aab/download/permits_issued_ending_12312024.csv |
| **Row count (datastore)** | **368,297** |
| Date range (`DATE ISSUED`) | **2020-07-20** → **2024-12-31** |
| File size (catalog) | ~78 MB |
| Canary sample | 100 rows via CKAN datastore API |
| Interpreted fields | **false** |

### Manifest — Permits Issued (current-year rolling CSV)

| Field | Value |
|---|---|
| CSV download | https://data.sanantonio.gov/dataset/05012dcb-ba1b-4ade-b5f3-7403bc7f52eb/resource/c21106f9-3ef5-4f3a-8604-f992b4db7512/download/permits_issued.csv |
| **Row count (datastore)** | **118,948** |
| Last modified | 2026-06-07 |
| Overlap note | Overlaps BuildSA/Accela era (Nov 2020+); dedupe against 2020–2024 bundle at normalize time (not at ingest) |

### Manifest — Board of Adjustment / variance

| Field | Value |
|---|---|
| Source URL | https://data.sanantonio.gov/dataset/board-of-adjustment-cases |
| CSV download | https://opendata-cosagis.opendata.arcgis.com/api/download/v1/items/36da7ffc762647b6af43838ed916c69a/csv?layers=0 |
| **Row count (ArcGIS)** | **1,417** |
| Canary | CSV head (500 KB) staged |
| Interpreted fields | **false** |

### Legacy portal (2003–2020 gap)

| Field | Value |
|---|---|
| Portal | https://www.sa.gov/Directory/Departments/DSD/Resources/Legacy-Portal |
| Coverage | Issued permits Apr 2003 – Nov 2020; limited 1998–2003 batch |
| Access method | Web search (Hansen-era); **no bulk CSV** — scripted pagination/scrape or PIR for full extract |
| Help PDF | https://www.sa.gov/files/assets/main/v/1/dsd/documents/shared/legacypermitdataportalhelp.pdf |
| Probe note | Direct fetch from acquisition host returned **403** on sa.gov; browser/Playwright path required |
| Status | **Not pulled this wave** — queued as P1b after bucket confirm |

---

## Edition bundle (critical-path for K2)

Engine corpus holds **current-edition L3 only** (33/34 jurisdictions, no temporal depth). K2 retrodiction blocked until adoption ordinances + historical Municode snapshots land.

### cc-agent-E edition-ingest contract (coordinate)

Proposed minimum fields (acquisition side; pending cc-agent-E stamp):

```json
{
  "jurisdiction_key": "string",
  "effective_date": "YYYY-MM-DD",
  "edition": { "ibc": "YYYY", "irc": "YYYY", "ifc": "YYYY", "iecc": "YYYY", "nec": "YYYY" },
  "source_document_url": "string",
  "source_document_hash_sha256": "string",
  "doc_type": "building_code_adoption_ordinance | municode_previous_version_export",
  "provenance": "portal_scrape | open_data | pir",
  "interpreted_fields": false
}
```

### Acquired this wave (canary)

| Jurisdiction | Document | Effective date | Edition | SHA256 | Staged path |
|---|---|---|---|---|---|
| **bastrop_tx** | Ordinance 2019-61 Building Regulations PDF | 2019-11-26 | 2018 IBC family | `fde8dabb5051a7097e1ed8ae0fbc3dde7a7024acf2c20439a508d2622d0b6204` | `_inbox/acquisition_staging/backtest/bastrop_tx/edition_adoption/.../building_code_adoption_ordinance_2019-11-26.pdf` |
| **austin_tx** | EDIMS Ordinance 20210603-059 (2021 IBC adoption) | 2021-06-03 | 2021 IBC | `6087f4f2e99220ab3cb0c22f7710937679190190dd88354b65c9b3c72fbc09c6` | `_inbox/acquisition_staging/backtest/austin_tx/edition_adoption/.../building_code_adoption_ordinance_2021-06-03.pdf` |

### Identified, not yet acquired (next pull batch)

| Jurisdiction | Document | Effective date | Edition | Source URL |
|---|---|---|---|---|
| **bastrop_tx** | Ordinance 2026-06 (repeals Building Block Code; adopts Bastrop Development Code Ch.14) | 2026-04-14 | TBD — verify I-Code refs in BDC | Municode adopted-not-codified list |
| **austin_tx** | 2024 IBC adoption (Ord. 2025-01-30 or successor) | 2025-07 (verify) | 2024 IBC | https://services.austintexas.gov/edims/document.cfm?id=447390 |
| **austin_tx** | Prior chain (2018, 2015, …) | various | various | Municode Previous Versions + council archive |
| **san_antonio_tx** | Ord. 2022-11-10-0875 | 2023-02-01 | 2021 IBC family | https://docsonline.sanantonio.gov/DSDUploads/2021Ch10BuildingRelatedCodesFinal.pdf |
| **san_antonio_tx** | Ord. 2025-01-30-0075 | 2025-05-01 | 2024 IBC family | https://docsonline.sanantonio.gov/DSDUploads/2024Ch10Building-RelatedCodesFinal.pdf |
| **san_antonio_tx** | Ord. 2018-06-21-0493 | 2018 | 2015/2018 chain | council archive / docsonline |

### Municode Previous Versions (all three P1 jurisdictions)

| Jurisdiction | URL | Status |
|---|---|---|
| Bastrop | https://library.municode.com/tx/bastrop | **UI confirmed** (Supplement 19, Apr 2026); Previous Versions tab is JS-rendered — export requires browser automation or manual PDF export per snapshot date |
| Austin | https://library.municode.com/tx/austin/codes/code_of_ordinances | Same — not bulk-pulled |
| San Antonio | https://library.municode.com/tx/san_antonio/codes/code_of_ordinances | Same — not bulk-pulled |

**Target snapshot dates for Wave 2b:** 2015, 2018, 2021, 2024 (or jurisdiction-specific adoption dates from ordinance chain above).

---

## Remaining PIR-only gaps (unchanged from Wave 1)

These jurisdictions lack case-level public bulk paths; backtest fuel requires batched TPIA/PIR unless portal recon in P2 finds an export pattern.

| Jurisdiction | Gap | Friction |
|---|---|---|
| Killeen | No online case search; annual summary PDFs only | **High** |
| Temple | Weekly/monthly PDF reports; OCR needed | **High** |
| Elgin | No portal confirmed | **High** |
| Lockhart | Email intake only | **High** |
| Copperas Cove | Unverified | **High** |
| Bastrop County unincorporated | No building permit ledger (OSSF/floodplain only) | **Not AHJ for building backtest** |
| Austin / SA inspection pass-fail | Sparse in issued-permit CSVs | Medium — ABC/BuildSA/EDIMS secondary pull or PIR |
| San Antonio legacy 2003–2020 | Web portal only (403 from headless host) | Medium — Playwright scrape |
| eCode360 corridor (13 Central TX cities) | Partnership-gated programmatic L3 | **High** — manual ordinance PDF harvest + General Code partnership track |
| Boerne | Dual portal cutover Jul 2025 | Medium — must merge SmartGov + MGO |
| Manor | GovWell/MGO split Feb 2026 | Medium |
| San Marcos | Clariti vs MyPermitNow split Jan 2025 | Medium — critical for Hays corridor |

---

## Verification artifacts (raw command output)

### GCS bucket probe

```
$ gcloud storage ls gs://hauska-calibration-raw/
ERROR: (gcloud.storage.ls) gs://hauska-calibration-raw not found: 404.
```

### Austin SODA count probe (2026-06-21T20:50:51Z)

```
AUSTIN_PERMITS: row_count=2361893, columns=78, issue_date_min=1921-09-20, issue_date_max=2026-06-20
AUSTIN_BOA: row_count=3283, columns=63
```

### San Antonio datastore probe

```
SA_PERMITS_2020_2024: 368297
SA_PERMITS_CURRENT: 118948
SA_BOA_ARCGIS_COUNT: 1417
SA_DATE_ISSUED: 2020-07-20 .. 2024-12-31
```

### Canary staging write

```
$ python _tmp_wave2_canary_staging.py
staging_written P:\doc_repo\_inbox\acquisition_staging\backtest
```

---

## Acceptance criteria scorecard

| Criterion | Status |
|---|---|
| Manifest per jurisdiction with row counts and date range | **Partial** — canary manifests written; full bulk manifests pending GCS landing |
| Permit records include address, case id, type, status, key dates | **Canary samples preserve vendor fields verbatim** |
| Variance records distinguish clean vs conditional where present in source | **Not interpreted at ingest** — source fields only |
| Edition manifest maps jurisdiction + effective_date + edition + hash | **Partial** — 2 canary adoption PDFs; Municode snapshots pending |
| Zero interpretation at ingest | **PASS** — all manifests carry `interpreted_fields: false` |

---

## Blockers and next dispatch

| Blocker | Owner | Next action |
|---|---|---|
| `gs://hauska-calibration-raw/` does not exist | **Operator** | Create bucket + IAM for acquisition agent; confirm path or alternate |
| F3 raw-ledger schema hash | **cc-agent-C** | Stamp manifest schema; acquisition replays canary manifests with `schema_hash` |
| Bastrop Address Lookup = Playwright | **cc-agent-M** (SmartCity scraper) | Extend scraper to `/lookup` XHR capture; export to calibration GCS |
| Municode Previous Versions export | **acquisition agent** | Browser automation batch after bucket confirm |
| SA legacy portal 403 headless | **acquisition agent** | Playwright with realistic UA; paginate issued permits 2003–2020 |

**Recommended operator confirm:** `gs://hauska-calibration-raw/` (or name alternate). On confirm, acquisition agent runs bulk sequence:

1. Austin full CSV ×2 (permits + BOA) → GCS
2. San Antonio CSV ×3 (2020–24, current, BOA) → GCS
3. SA legacy portal scrape (Playwright) → GCS jsonl
4. Edition bundle v1: full adoption chains Bastrop/Austin/SA + Municode snapshots
5. Bastrop MyGov historical Address Lookup (SmartCity scraper extension) → GCS jsonl

---

## Unblocks

K2 retrodiction harness (cc-agent-C) can begin **fixture design** against canary manifests and edition-ingest contract draft. **Full K2 run blocked** until edition bundle depth + bulk permit history land in confirmed GCS bucket.
