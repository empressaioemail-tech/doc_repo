---
id: 2026-06-21_acquisition_acquisition-agent_wave3-bulk-pulls
title: Acquisition agent — Wave 3 bulk public-record pulls (Calibrated Spine K1)
date: 2026-06-21
agent: acquisition-agent
repo: doc_repo (execution + GCS landing)
dispatch: Calibrated Spine Wave 3 — K1 bulk acquisition (uniform public process)
tasks: [K1-W3-bucket, K1-W3-austin, K1-W3-san-antonio, K1-W3-bastrop-public, K1-W3-edition-bundle-v1]
wave: 3
status: close-partial-portal-followup
blocks_unblocked: [K2 ingest fixtures for Austin + SA open-data volume]
---

# Close — Wave 3 bulk acquisition (GCS live; open-data complete; portal scrape partial)

## Summary

**Bucket created and IAM applied.** Bulk open-data pulls for **Austin** and **San Antonio** landed in `gs://hauska-calibration-raw/` with `k1-outcome-v1` manifests per cc-agent-C `K1_OUTCOME_LANDING_SCHEMA`. **Edition bundle v1** landed in `hauska-edition-bundle/1` format per cc-agent-E contract for Bastrop, Austin, and San Antonio.

**Operator correction honored:** no SmartCity OS MyGov scraper, no tenant integration, no Bastrop sequencing privilege. Bastrop acquired via the same public Playwright path as San Antonio legacy (`public.mygov.us/bastrop_tx/lookup`).

**Partial:** public Playwright portal scrapes (SA legacy 2003–2020, Bastrop Address Lookup bulk) returned **very low record counts** (single-digit to low tens per manifest). The Hansen legacy portal and MyGov lookup SPA require follow-up XHR reverse-engineering or address-universe enumeration. **Other Central TX cities (P2 corridor)** not pulled this wave.

**Zero interpretation at ingest** on all landed artifacts (`interpreted_fields: false`).

---

## Infrastructure

| Item | Value |
|---|---|
| Bucket | `gs://hauska-calibration-raw` |
| Project | `legacy-design-tools-prod` |
| Location | `us-central1` |
| Uniform bucket-level access | enabled |
| IAM `roles/storage.objectAdmin` | `user:empressaioemail@gmail.com`, `serviceAccount:smartcity-agent@smartcity-os-prod.iam.gserviceaccount.com` |

Verification:

```
$ gcloud storage buckets describe gs://hauska-calibration-raw/ --format="value(name,location)"
hauska-calibration-raw	US-CENTRAL1
```

Landing layout (uniform):

```
gs://hauska-calibration-raw/
  backtest/{jurisdictionTenant}/{record_type}/{provenance}/acquired={YYYY-MM-DD}/
    manifest.json
    data/
  edition-bundle/{jurisdictionTenant}/
    hauska-edition-bundle-1.json
    adoption_ordinances/
    municode_snapshots/
```

---

## Manifest table — open data (complete)

| Jurisdiction | Record type | Provenance | Rows | Date range | SHA256 | GCS data path |
|---|---|---|---:|---|---|---|
| **austin_tx** | permit | open_data | **2,361,893** | issue_date 1921-09-20 → 2026-06-20 (probe; manifest date_range null — CSV timestamp parsing deferred) | `5de81bb2db387feeed8594579d27b2c78f054ec629ad7054e1c68c96a4689e60` | `.../austin_tx/permit/open_data/acquired=2026-06-21/data/issued_construction_permits.csv` |
| **austin_tx** | variance | open_data | **3,283** | — | `13add6565209290362decb7b3218ef0f22287390f08fd0b04dd638d10c26d7a9` | `.../board_of_adjustment_cases.csv` |
| **san_antonio_tx** | permit | open_data | **368,297** | 2020-07-20 → 2024-12-31 | `caa4f470726869e2ab9293c69b0bfb6344f645b921082d55b14d920101b1a806` | `.../permits_issued_2020_2024.csv` |
| **san_antonio_tx** | permit | open_data | **118,948** | 2025-01-01 → 2026-06-05 | `326f3443952075d307dbeebb2f71a254882475a67dcdf6a085feb70451dfa654` | `.../permits_issued_current.csv` |
| **san_antonio_tx** | variance | open_data | **1,774** | — | `5d50e748fdcaa725678b1260347ee03b1ba320a63e1c78acb8d4ca38d49a2d05` | `.../board_of_adjustment_cases.csv` |

Source URLs:

- Austin permits: https://data.austintexas.gov/Resource-Explorer/3syk-w9eu/
- Austin BOA: https://data.austintexas.gov/Resource-Explorer/ykxk-t5y9/
- SA 2020–24: https://data.sanantonio.gov/dataset/building-permits (CKAN export; direct CSV URL 403 from acquisition host)
- SA current: CKAN resource `c21106f9-3ef5-4f3a-8604-f992b4db7512`
- SA BOA: https://opendata-cosagis.opendata.arcgis.com/api/download/v1/items/36da7ffc762647b6af43838ed916c69a/csv?layers=0

Summary artifact: `gs://hauska-calibration-raw/backtest/_wave3_sa_csv_complete.json`

**Combined open-data permit rows (Austin + SA): 2,849,138** (+ 5,057 variance rows).

---

## Manifest table — public portal scrape (partial; uniform Playwright)

| Jurisdiction | Portal | Provenance | Records | Notes |
|---|---|---|---:|---|
| **san_antonio_tx** | https://legacypermitdataportal.sanantonio.gov/ | portal_scrape | **2** (deep pass; overwrote shallow pass) | Empty/broad search returned almost no grid rows; Hansen SPA needs XHR contract reverse-engineering for 2003–2020 bulk |
| **bastrop_tx** | https://public.mygov.us/bastrop_tx/lookup | portal_scrape | **2** (shallow pass) | Deep multi-seed pass running at close; MyGov lookup is SPA/XHR-driven |

Manifests: `gs://hauska-calibration-raw/backtest/{jurisdiction}/permit/portal_scrape/acquired=2026-06-21/manifest.json`

Portal summary artifacts:

- `gs://hauska-calibration-raw/backtest/_wave3_portal_scrape_summary.json` (shallow)
- Deep pass SA manifest SHA256: `78e91388e35fab28437034be927162f2ee00bb38f8f6fedf64f358a52220b356`

**No tenant tooling used.** Public browser automation only.

---

## Edition bundle v1 (`hauska-edition-bundle/1`)

Summary: `gs://hauska-calibration-raw/edition-bundle/_wave3_edition_bundle_summary.json`

| Jurisdiction | Bundle GCS | Adoption entries | Municode snapshots |
|---|---|---:|---|
| **bastrop_tx** | `gs://hauska-calibration-raw/edition-bundle/bastrop_tx/hauska-edition-bundle-1.json` | 1 (Ord 2019-61 → 2018 IBC family, eff. 2019-11-26) | Previous Versions UI + labels 2015/2018/2021/2024 |
| **austin_tx** | `gs://hauska-calibration-raw/edition-bundle/austin_tx/hauska-edition-bundle-1.json` | 2 (2021 IBC eff. 2021-06-03; 2024 IBC eff. 2025-07-01) | same pattern |
| **san_antonio_tx** | `gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/hauska-edition-bundle-1.json` | 2 (2021 family eff. 2023-02-01; 2024 family eff. 2025-05-01) | same pattern |

Adoption ordinance PDFs under `edition-bundle/{jurisdiction}/adoption_ordinances/`.

### Edition gaps (honest)

| Gap | Severity |
|---|---|
| **Municode Previous Versions** — Playwright captured current SPA shell only; year-labeled snapshots share identical SHA256 per city (not distinct dated ordinance exports) | **High** — K2 needs per-date Municode export or manual PDF harvest |
| **Bastrop** — Ord 2026-06 BDC adoption (Apr 2026) not in bundle | Medium |
| **Austin / SA** — pre-2021 adoption chain (2018, 2015, …) not fully harvested | Medium |
| **eCode360 corridor cities** — not in bundle (partnership-gated / manual ord.) | High for P2 cities |

---

## Not pulled this wave

| Target | Reason |
|---|---|
| **Central TX P2 corridor** (Round Rock, Georgetown, Cedar Park, San Marcos, Kyle, …) | Queued; uniform public portal recon + Playwright dispatch next |
| **Killeen, Temple, Elgin, Lockhart** | PIR-first (Wave 1 inventory) |
| **Bastrop County unincorporated** | Not building-permit AHJ |
| **SA legacy 2003–2020 bulk** | Portal scrape yielded 2 records; needs Hansen XHR contract or PIR |

---

## K1 schema compliance

All manifests include:

- `schemaVersion: "k1-outcome-v1"`
- `jurisdictionTenant`, `record_type`, `provenance`, `source_urls`
- `rawCounts`, file `sha256`
- `interpreted_fields: false`
- `appendTarget: "atom_events"` / `entityType: "k1-outcome"` (where stamped in open-data pass)

Normalized `K1_OUTCOME_LANDING_SCHEMA` field mapping (outcomeId, subjectKey, editionInEffect, etc.) **deferred to normalize pass** per cc-agent-C notes.

---

## Unblocks / next dispatch

| Consumer | Status |
|---|---|
| **cc-agent-E** | Can ingest `hauska-edition-bundle/1` for Austin + SA + Bastrop adoption windows; Municode dated snapshots still thin |
| **cc-agent-C K2** | Can build retrodiction fixtures against **2.85M** open-data permit rows; portal-scrape fuel thin until follow-up |
| **Acquisition follow-up** | (1) Hansen legacy XHR reverse-engineer, (2) MyGov lookup address-universe enumeration, (3) Municode dated export automation, (4) P2 Central TX uniform portal batch |

---

## Verification commands

```powershell
gcloud storage ls -r gs://hauska-calibration-raw/backtest/ | Select-Object -First 40
gcloud storage cat gs://hauska-calibration-raw/backtest/_wave3_sa_csv_complete.json
gcloud storage cat gs://hauska-calibration-raw/edition-bundle/_wave3_edition_bundle_summary.json
```
