---
title: P-25 repair or skip — Dallas/Tarrant honesty close
date: 2026-08-25
plan_row: P-25
author: Track 1 command lane (no commit)
status: SKIP
snapshot:
  repo: doc_repo
  branch: main
  commit: 9842ed2a038109a66f657a34cb1f07f5620d5d8d
  store_probe_at: 2026-08-25T13:35Z-05 (local)
---

# P-25 repair or skip

## Decision

**SKIP** — no county reload, no L17 flip, no tad.org fetch, no further ingest.

Reason: cannot name a **live** last-wins wipe parcel `(county_fips, prop_id, tax_year)` with **two independent sources** (before StratMap legal present on that PK, after CAMA null legal on the same PK, legal gone on that PK). Docs and fixtures describe the defect class; the store layout for Dallas/Tarrant separates StratMap (`tax_year=2025`) from CAMA (`tax_year=2026`), so a cross-vintage “legal gone on read” is not the same as a same-PK wipe and is already covered by held L17 / key-space divergence.

## Evidence — named wipe parcel

| Requirement | Result |
| --- | --- |
| Specific `prop_id` + county | **Not named** |
| Source 1: StratMap legal on PK | Only synthetic **F1** fixture `48113:1234567` (`scripts/fixtures/p78-cad-merge/F1-cama-null-legal-preserves-stratmap.json`) |
| Source 2: store row showing wipe on same PK | **None found** — live SQL found **0** rows where `tax_year=2026` cad-export has null `legal_description` while joined `tax_year=2025` StratMap row on same `prop_id` has non-null legal (`overlap_2026_legal_null n=0` with `overlap_prop_id_count n=399965`) |
| Same-PK StratMap+cama both on 2026 | **0** StratMap rows on 2026 for 48113/48439 (`stratmap_n=0` on 2026 breakdown) |

**SKIP reason (precise):** Independent source 2 for a production parcel is missing. F1 plus game-plan prose (`_inbox/2026-08-24_parcel_facts_write_path_game_plan.md` § CAMA last-upsert-wins) establish mechanism, not a measured parcel. No temporal audit (pre/post upsert log per `prop_id`) was located in `_scratch` or `_inbox`.

## Baseline comparison — `cad_property` row counts

Authority baseline ingest (2026-08-14): `_inbox/2026-08-14_P25_full_loads_reconcile.md`

| County | Metric | 2026-08-14 baseline | Live store (2026-08-25 probe) | Delta |
| --- | --- | --- | --- | --- |
| Dallas 48113 | rows upserted (2026 CAMA load) | **806,563** | **806,563** `@ tax_year=2026` | **0** |
| Dallas 48113 | sqft % / yb % (2026, all classes) | 72.3 / 73.9 | 72.3 / 73.9 | match |
| Dallas 48113 | all tax years | (not tabulated) | 2026: 806563; 2025 StratMap: 693556 | — |
| Tarrant 48439 | rows upserted (2026 CAMA load) | **883,954** | **975,885** `@ tax_year=2026` | **+91,931** |
| Tarrant 48439 | sqft % / yb % (2026) | 65.1 / 65.2 | 63.7 / 64.1 | drift (off-path reload + parser/file) |
| Tarrant 48439 | all tax years | (not tabulated) | 2026: 975885; 2025 StratMap: 689838 | — |

Store vintage breakdown (live):

```text
breakdown 48113 [{"tax_year":2026,"n":806563,"stratmap_n":0,"cama_n":806563,"legal_n":705536},{"tax_year":2025,"n":693556,"stratmap_n":693556,"cama_n":0,"legal_n":82767}]
breakdown 48439 [{"tax_year":2026,"n":975885,"stratmap_n":0,"cama_n":975885,"legal_n":975882},{"tax_year":2025,"n":689838,"stratmap_n":689838,"cama_n":0,"legal_n":684081}]
```

Interpretation: **Dallas 2026 row count matches the approved 2026-08-14 load** despite Wave-4 partial run (~450k upserted then killed). **Tarrant 2026 count exceeds baseline** after off-path Wave-4 completed load from cached zip (see below).

## Wave-4 damage note (off-path, operator-stopped)

| County | Wave-4 behavior | Log |
| --- | --- | --- |
| Dallas 48113 | **Partial** — upsert progressed to ~450k then process exit (`dallas_wave4_load.log`); **2026 count still equals 806,563** vs baseline | `P:/tmp/l9_full_loads/p25_wave4/dallas_wave4_load.log` |
| Tarrant 48439 | First attempt **failed** TLS on tad.org; loader refused StratMap fallback (`tarrant_wave4_load.log`). Second run **completed** **975,303** upserts from `P:/tmp/l9_full_loads/p25_wave4/tad_propertydata_full.zip` | `P:/tmp/l9_full_loads/p25_wave4/tarrant_wave4_load2.log` |

Tarrant load2 summary (verbatim tail):

```text
[cad-ingest] county:          48439 (Tarrant)
[cad-ingest] source file:     tad_propertydata_full.zip
[cad-ingest] rows read:       2286328
[cad-ingest] rows parsed:     975303
[cad-ingest] rows upserted:   975303
[cad-ingest] rows skipped:    1277056 (malformed)
[cad-ingest] duration:        269.6s
```

Wave-4 worktree `P:/tmp/ldt-p25` HEAD **is** P-78 merge `72cffc8` (cad-ingest authority rule). **No further ingest** per operator stop.

Scratch status line already filed: `_scratch/parcel-facts-write-path.md` § Wave-4 Dallas 48113 (PARTIAL + Tarrant off-path).

## Live P-78 probe result

### A. File instrument (no DB) — **PASS**

```text
> node scripts/p78-merge-fixtures-selftest.mjs
PASS fixtures 8/8 against reference merge
PASS F1 last-wins fails (null legal would wipe StratMap)
...
P-78 merge fixtures selftest PASS
```

### B. Store read probe (CORTEX prod via `CORTEX_DATABASE_URL`, 2026-08-25) — **partial / no upsert replay**

Queries executed from `P:/tmp/ldt-p25/lib/cad-ingest` (pg pool). Connection string from GCP Secret Manager `CORTEX_DATABASE_URL` @ `hauska-prod-497015` (not printed).

County totals:

```text
county 48113 [{"tax_year":2026,"n":806563},{"tax_year":2025,"n":693556}]
county 48439 [{"tax_year":2026,"n":975885},{"tax_year":2025,"n":689838}]
pre_measures_2026 [{"county_fips":"48113","total":806563,"sqft_pct":"72.3","yb_pct":"73.9","legal_pct":"87.5"},{"county_fips":"48439","total":975885,"sqft_pct":"63.7","yb_pct":"64.1","legal_pct":"100.0"}]
```

Same-PK wipe candidate search (48113):

```text
dallas_cross_vintage_stratmap_legal_cama_null_2026 {"n":0}
dallas_2026_stratmap_legal_samples []
dallas_same_pk_wipe_candidates []
dallas_named_cross_year_pairs []
overlap_prop_id_count {"n":399965}
overlap_2026_legal_null {"n":0}
```

**Verdict:** Store probe does **not** demonstrate a live last-wins wipe on a named PK. It **does** show that on **399,965** shared `prop_id`s between 2025 StratMap and 2026 CAMA, **zero** have CAMA 2026 null legal while StratMap 2025 has legal — consistent with CAMA supplying legal on overlap keys, not wiping StratMap rows (different `tax_year`). A **write replay** probe (StratMap row + CAMA null legal upsert on **same** PK) was **not run** (would mutate prod; operator forbids reload).

### C. Live cortex API

Not used for merge semantics (API reads baked facets; does not re-execute `upsertCadProperties`).

## Gates honored

- No county reload in this lane.
- No tad.org / live TAD open-fetch.
- L17 vintage flips not touched.
- A-017 posture: CAMA backfill not QA gate; Dallas Manifest-present 99.91 unchanged by this note.

## Commands not run

- Any `cad-ingest --county=48113|48439`
- L17 `current_tax_year` flip
- Atom `--apply` / rematerialize

## leave_behind

- This file: `_inbox/2026-08-25_p25_repair_or_skip.md`
- Ephemeral probe scripts under `P:/tmp/l9_full_loads/p25_wave4/` and `P:/tmp/ldt-p25/lib/cad-ingest/` (not committed; parent may delete)
