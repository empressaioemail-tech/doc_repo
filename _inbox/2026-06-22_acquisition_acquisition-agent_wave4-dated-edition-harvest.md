---
id: 2026-06-22_acquisition_acquisition-agent_wave4-dated-edition-harvest
title: Acquisition agent — Wave 4 dated-edition harvest (K2 unblock)
date: 2026-06-22
agent: acquisition-agent
repo: doc_repo (execution + GCS landing)
dispatch: Calibrated Spine Wave 4 — dated-edition harvest for K2 edition-correct retrodiction
tasks: [K2-W4-edition-tables, K2-W4-adoption-pdfs, K2-W4-municode-probe, K2-W4-bastrop-2026-06]
wave: 4
status: close-primary-deliverable
blocks_unblocked: [cc-agent-C K2 edition-correct harness for Austin + San Antonio; Bastrop edition map (thin permit fuel)]
---

# Close — Wave 4 dated-edition harvest (K2 unblock)

## Summary

**Primary deliverable landed.** Edition-effective-date tables and distinct adoption-ordinance PDFs for **Bastrop**, **Austin**, and **San Antonio** are in `gs://hauska-calibration-raw/edition-bundle/{jurisdiction}/` as `edition-effective-date-table.json` plus `hauska-edition-bundle-1-wave4.json` (`hauska-edition-bundle/1` format). **10 adoption ordinance PDFs**, each with a **distinct SHA256** (no Wave 3 duplicate-SHA Municode shell placeholders).

**K2 edition map source:** adoption ordinance PDFs are the legal effective-date authority. Municode CodeBank "Previous Versions" per-date exports remain **not publicly retrievable** via headless browser (API returns SPA shell or 401). Gaps recorded explicitly; no fake dated editions emitted.

**Post-harvest fixes applied:**
- Bastrop Ord 2026-06: initial Municode URL landed a 6 KB HTML SPA shell; replaced with cityofbastrop.org PDF (`%PDF-1.6`, 7.85 MB).
- Austin effective dates: normalized against ordinance PDF text (2015 window uses Jan 1 2018 per landed EDIMS package; 2021 uses Sept 1 2021 not council passage date; 2024 uses city schedule where PDF effective line is blank).

**Zero interpretation at ingest** (`interpreted_fields: false`). Uniform public-record process only. No tenant tooling.

---

## Edition-effective-date tables (inline)

### Bastrop (`bastrop_tx`)

| editionId | codeFamily | editionYear | effective_from | effective_to | adopting_ordinance_citation | source_url |
|---|---|---:|---|---|---|---|
| `bastrop_tx-ibc-2018-adopted` | IBC | 2018 | 2019-11-26 | 2026-04-13 | Ordinance No. 2019-61 | https://www.cityofbastrop.org/page/open/6743/0/ORDINANCE%20NO.%202019-61%20BUILDING%20REGULATIONS.pdf |
| `bastrop_tx-bdc-2026-adopted` | BDC | 2026 | 2026-04-14 | null | Ordinance No. 2026-06 | https://www.cityofbastrop.org/page/open/18744/0/ORDINANCE%20NO.%202026-06%20B3%20Code%20Repeal%20and%20Bastrop%20Development%20Code%20Adoption.pdf |

**Note:** Bastrop's public record for this harvest starts at 2018 IBC family (Ord 2019-61). Pre-2019 building-code adoption chain not harvested. Apr 2026 row is Bastrop Development Code (zoning/land-use), not an IBC edition bump; IBC family remains 2018 per city planning page through B3 repeal.

### Austin (`austin_tx`)

| editionId | codeFamily | editionYear | effective_from | effective_to | adopting_ordinance_citation | source_url |
|---|---|---:|---|---|---|---|
| `austin_tx-ibc-2012-adopted` | IBC | 2012 | 2013-09-16 | 2017-12-31 | Ordinance No. 20130606-089 | https://services.austintexas.gov/edims/document.cfm?id=191778 |
| `austin_tx-ibc-2015-adopted` | IBC | 2015 | 2018-01-01 | 2021-08-31 | Ordinance No. 20150901-098 | https://services.austintexas.gov/edims/document.cfm?id=285177 |
| `austin_tx-ibc-2021-adopted` | IBC | 2021 | 2021-09-01 | 2025-07-09 | Ordinance No. 20210603-059 | https://services.austintexas.gov/edims/document.cfm?id=361492 |
| `austin_tx-ibc-2024-adopted` | IBC | 2024 | 2025-07-10 | null | Ordinance No. 20250410-045 | https://services.austintexas.gov/edims/document.cfm?id=447388 |

**Notes:**
- Austin **skipped 2018 IBC**; chain is 2012 → 2015 → 2021 → 2024.
- 2015 row: landed EDIMS package (Version 2, 2017-09-27) states effective **January 1, 2018** (not September 2015).
- 2024 row: ordinance PDF effective line is blank; **July 10, 2025** from city Building Technical Codes page (https://www.austintexas.gov/development-services/building-technical-codes). Flag for normalize-pass verification.

### San Antonio (`san_antonio_tx`)

| editionId | codeFamily | editionYear | effective_from | effective_to | adopting_ordinance_citation | source_url |
|---|---|---:|---|---|---|---|
| `san_antonio_tx-ibc-2015-adopted` | IBC | 2015 | 2015-05-01 | 2018-09-30 | Ordinance No. 2015-01-29-0066 | https://docsonline.sanantonio.gov/FileUploads/DSD/CH10Ordinance%202015final.pdf |
| `san_antonio_tx-ibc-2018-adopted` | IBC | 2018 | 2018-10-01 | 2023-01-31 | Ordinance No. 2018-06-21-0493 | https://docsonline.sanantonio.gov/DSDUploads/2018Chp10CodeUpdateOrdinance.pdf |
| `san_antonio_tx-ibc-2021-adopted` | IBC | 2021 | 2023-02-01 | 2025-04-30 | Ordinance No. 2022-11-10-0875 | https://docsonline.sanantonio.gov/DSDUploads/2021Ch10BuildingRelatedCodesFinal.pdf |
| `san_antonio_tx-ibc-2024-adopted` | IBC | 2024 | 2025-05-01 | null | Ordinance No. 2025-01-30-0075 | https://docsonline.sanantonio.gov/DSDUploads/2024Ch10Building-RelatedCodesFinal.pdf |

Full pre-2021 chain (2015 + 2018) now landed. SA 2021/2024 PDFs are codified Ch.10 packages (building-related codes bundle), not bare ordinance stubs.

---

## Dated documents — GCS paths + SHA256

| Jurisdiction | GCS path | SHA256 | Bytes |
|---|---|---|---|
| **bastrop_tx** | `gs://hauska-calibration-raw/edition-bundle/bastrop_tx/adoption_ordinances/2019-61-building-regulations.pdf` | `fde8dabb5051a7097e1ed8ae0fbc3dde7a7024acf2c20439a508d2622d0b6204` | 3,028,712 |
| **bastrop_tx** | `gs://hauska-calibration-raw/edition-bundle/bastrop_tx/adoption_ordinances/2026-06-bdc-adoption.pdf` | `e3101ac40c09cd71d7900d9cdafa6a074d1462ce75b0a16d1c36d9a31be4229e` | 7,852,168 |
| **austin_tx** | `gs://hauska-calibration-raw/edition-bundle/austin_tx/adoption_ordinances/20130606-089-2012-ibc.pdf` | `460cf9919078521c054b29820872d426aeff3e79c57a0fc4cddb0563d218aa41` | 41,736 |
| **austin_tx** | `gs://hauska-calibration-raw/edition-bundle/austin_tx/adoption_ordinances/20150901-098-2015-ibc.pdf` | `eae65b103ba9af48270335004ee35806d5939802756e6a4ab990e75fc4c875ff` | 977,895 |
| **austin_tx** | `gs://hauska-calibration-raw/edition-bundle/austin_tx/adoption_ordinances/20210603-059-2021-ibc.pdf` | `6087f4f2e99220ab3cb0c22f7710937679190190dd88354b65c9b3c72fbc09c6` | 549,551 |
| **austin_tx** | `gs://hauska-calibration-raw/edition-bundle/austin_tx/adoption_ordinances/20250410-045-2024-ibc.pdf` | `44da7651e66a029f39c872cbff6db9b9d7592cb5f8335f4ff248355abbc9ae7a` | 244,846 |
| **san_antonio_tx** | `gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/adoption_ordinances/2015-01-29-0066-ch10.pdf` | `59a709dc0517ed33a5a269f666e0b02fffd45e595c2b5f6d3be100ce84409101` | 45,763,840 |
| **san_antonio_tx** | `gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/adoption_ordinances/2018-06-21-0493-ch10.pdf` | `2ec170a5d83e8c6261d32cfe6bbbb45663c18381414178dcb89c1519de2ef55e` | 41,913,223 |
| **san_antonio_tx** | `gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/adoption_ordinances/2022-11-10-0875-ch10.pdf` | `8073713db8df264fe8ec33a6bc447432241ecb02c7a3bd70088be5d1b1f72eeb` | 1,766,406 |
| **san_antonio_tx** | `gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/adoption_ordinances/2025-01-30-0075-ch10.pdf` | `20532339e264ce2ce40a3dc6742c49bcf54da4fa6b5a0a038226099208ea75fd` | 1,359,037 |

**Distinct-hash check:** all 10 Wave 4 adoption PDFs have unique SHA256. Wave 3 `municode_snapshots/` year labels (identical hash per city) are **superseded** for K2; do not ingest as dated editions.

Bundle manifests:

| Jurisdiction | Table GCS | Bundle GCS |
|---|---|---|
| bastrop_tx | `gs://hauska-calibration-raw/edition-bundle/bastrop_tx/edition-effective-date-table.json` | `gs://hauska-calibration-raw/edition-bundle/bastrop_tx/hauska-edition-bundle-1-wave4.json` |
| austin_tx | `gs://hauska-calibration-raw/edition-bundle/austin_tx/edition-effective-date-table.json` | `gs://hauska-calibration-raw/edition-bundle/austin_tx/hauska-edition-bundle-1-wave4.json` |
| san_antonio_tx | `gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/edition-effective-date-table.json` | `gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/hauska-edition-bundle-1-wave4.json` |

Summary: `gs://hauska-calibration-raw/edition-bundle/_wave4_dated_edition_summary.json`

---

## Gap table (honest)

| Gap | Jurisdiction | Severity | Detail |
|---|---|---|---|
| Municode CodeBank per-date export | bastrop_tx, austin_tx, san_antonio_tx | **Medium (non-blocking for K2 map)** | `PublicationVersion/GetAll`, `GetPublicationVersions`, `CodeBank/GetVersions` return SPA HTML in headless session; `api/Jobs/*` returns 401. No distinct dated Municode payload retrieved. **Adoption ordinance chain is sufficient for edition-in-effect mapping.** |
| Pre-2019 IBC adoption chain | bastrop_tx | Medium | Public city ordinance archive has older building regs; not harvested this wave. K2 retrodiction for Bastrop permits before 2019-11-26 has no edition row. |
| Austin 2024 effective date | austin_tx | Low | Ordinance PDF effective line blank (`__________________, 2025`). Date taken from city Building Technical Codes schedule (July 10, 2025). Normalize pass should cross-check council record. |
| Bastrop ordinance OCR | bastrop_tx | Low | 2019-61 and 2026-06 PDFs are image-heavy; effective dates sourced from ordinance metadata / city planning pages where PDF text extraction failed. |
| I-Code body text | all | Out of scope | Licensed ICC text ingested by cc-agent-E; not acquired here. |
| Permit outcome fuel (Bastrop) | bastrop_tx | **High for M1 sample size** | Wave 3 portal scrape: 2 records. Edition map is buildable; retrodiction **volume** remains thin until MyGov enumeration (deprioritized). |

**Not started (deprioritized per dispatch):** Hansen legacy XHR (SA 2003–2020), MyGov address enumeration (Bastrop), P2 Central TX corridor.

---

## K2 readiness verdict (cc-agent-C)

| City | Edition-correct K2? | Rationale |
|---|---|---|
| **Austin** | **Yes** | Full IBC adoption chain (2012/2015/2021/2024) with non-overlapping effective windows and 4 distinct adoption PDFs. Pairs with 2.36M open-data permit rows (Wave 3). |
| **San Antonio** | **Yes** | Full chain (2015/2018/2021/2024) with 4 distinct adoption PDFs. Pairs with ~487K open-data permit rows (Wave 3). |
| **Bastrop** | **Yes (edition map); thin fuel** | Edition-effective-date table is buildable for 2018 IBC window + 2026 BDC transition. **Not edition-blind.** Retrodiction harness can assign editions by date, but permit case fuel is ~2 portal-scrape rows; M1 measured gate needs more outcomes, not more edition rows. |

**Bottom line:** cc-agent-C can build K2 with **edition-correctness for all three cities**. Austin and SA are ready for meaningful retrodiction runs. Bastrop is edition-correct but outcome-thin.

---

## Schema compliance

- `interpreted_fields: false` on all Wave 4 artifacts
- Edition tables: `schemaVersion: edition-effective-date-v1`
- Bundles: `format: hauska-edition-bundle/1` per cc-agent-E contract
- GCS writes use global bucket name only (`gs://hauska-calibration-raw/`)
- Adoption records only; no I-Code body content

---

## Verification commands

```powershell
# Summary + per-jurisdiction tables
gcloud storage cat gs://hauska-calibration-raw/edition-bundle/_wave4_dated_edition_summary.json
gcloud storage cat gs://hauska-calibration-raw/edition-bundle/austin_tx/edition-effective-date-table.json
gcloud storage cat gs://hauska-calibration-raw/edition-bundle/bastrop_tx/edition-effective-date-table.json
gcloud storage cat gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/edition-effective-date-table.json

# List Wave 4 adoption PDFs
gcloud storage ls gs://hauska-calibration-raw/edition-bundle/*/adoption_ordinances/*.pdf

# Distinct-hash spot check (Bastrop 2026-06 must be PDF, not HTML shell)
gcloud storage cat gs://hauska-calibration-raw/edition-bundle/bastrop_tx/adoption_ordinances/2026-06-bdc-adoption.pdf | python -c "import sys; d=sys.stdin.buffer.read(8); print(d)"

# Re-run harvest script (idempotent)
python P:/doc_repo/_tmp_k1_wave4_dated_edition_harvest.py
```

Expected Bastrop 2026-06 head: `b'%PDF-1.6'` (not `<!DOCTYP`).

---

## Unblocks / next dispatch

| Consumer | Status |
|---|---|
| **cc-agent-C K2** | Unblocked for edition-correct retrodiction on Austin + SA; Bastrop edition map ready, fuel thin |
| **cc-agent-E** | Can ingest `hauska-edition-bundle-1-wave4.json` adoption windows; I-Code text remains ICC-licensed path |
| **Acquisition (deprioritized)** | Hansen XHR, MyGov enumeration, Municode CodeBank authenticated export, P2 corridor |

---

## Execution artifact

Harvest script: `P:/doc_repo/_tmp_k1_wave4_dated_edition_harvest.py`
