---
title: P-25 Tarrant (48439) cad_property keep-or-drop — net-new +91,349 tad_full keys
date: 2026-08-25
plan_row: P-25
author: integration planner (Track A classify + sample SQL)
status: DECISION FILED
decision: DROP
p25_ready: false
---

# P-25 Tarrant keep-or-drop

## Decision

**DROP** — delete the **91,931** net-new `prop_id` keys at `tax_year=2026` and restore the approved **883,954** row baseline from `_inbox/2026-08-14_P25_full_loads_reconcile.md`.

P-25 stays **`ready:false`**. No L17 flip. No tad.org fetch. No cad-ingest in this lane.

## Snapshot

| Field | Value |
|---|---|
| Repo | `P:/doc_repo` @ `11763c0` |
| Store | cortex-prod `neondb` via `CORTEX_DATABASE_URL` |
| County | 48439 Tarrant |
| Baseline (approved 2026-08-14) | **883,954** rows upserted |
| Current `@ tax_year=2026` | **975,885** rows |
| Delta | **+91,931** |
| Classify authority | `_inbox/2026-08-25_p25_tarrant_drift_classify.md` / `.json` |

## What the 91,349 `tad_propertydata_full` net-new keys are

They are **real TAD CAMA accounts** present in the **2026-08-25** `PropertyData(Delimited).ZIP` parse but **absent from the approved 2026-08-14 parse set**. They are **not** StratMap-key duplicates enriched with CAMA.

### Evidence

**1. Count math matches ingest logs**

| Load | Date | Drop tag | Rows parsed/upserted |
|---|---|---|---|
| Approved baseline | 2026-08-14 | `propertydata(delimited)` | **883,954** |
| Off-path Wave-4 | 2026-08-25 | `tad_propertydata_full` | **975,303** |

`975,303 − 883,954 = **91,349**` — matches classify cohort count.

Aug-25 zip is larger (685 MB vs 670 MB; 2,286,328 vs 2,244,021 rows read). Parser skip counts also rose (1,277,056 vs 267), so part of the +91,349 may be **parser/path change at LDT `72cffc8`** (P-78 merge) in addition to zip vintage. Both add keys; neither was operator-approved.

**2. Not StratMap duplicates — different key namespace**

From classify JSON `cross_year_prop_id_context`:

| Metric | Count |
|---|---|
| 2026 rows | 975,885 |
| 2025 StratMap rows | 689,838 |
| Overlap `prop_id` (2025 ∩ 2026) | 681,588 |
| **2026-only** `prop_id` | **294,297** |
| tad_full 2026 not in 2025 | 293,735 |

The net-new +91,931 increased the 2026-only bucket. Keys live in **TAD GIS_Link / plat-style space**, not StratMap plat keys that are **2025-only** (84,498 keys like `"10-1-1A"` per reconcile doc).

**3. Field completeness — real records, not empty shells**

Read-only SQL on cortex-prod (Track A, 2026-08-25):

| Cohort | n | legal | owner | situs | sqft | year_built |
|---|---|---|---|---|---|---|
| Overlap 2025∩2026 | 681,588 | 100% | (not measured) | 681,579 | 619,907 (91%) | 623,499 (91%) |
| 2026-only (not in StratMap) | 294,297 | ≈100% | 100% | 15,415 (5%) | 1,727 (0.6%) | 1,834 (0.6%) |

Net-new keys sit primarily in the **2026-only** slice: full **legal + owner**, sparse **situs/sqft/yb** (mineral/water-right splits, MHP pads, plat-style accounts).

**4. Separate +582 delimited-only keys**

582 rows retain `drop:propertydata(delimited)` from 2026-08-14 ingest; not overwritten by Aug-25 tad_full reload. Included in total +91,931 net-new vs baseline.

## Analysis questions

### 1. Duplicates of StratMap-only keys with richer CAMA?

**No.** Overlap keys (681,588) are shared-namespace joins across vintages. The +91,349 are **additional TAD accounts** in the Aug-25 file/parse, overwhelmingly **not present in 2025 StratMap at all**.

### 2. Samples — situs/legal/values or empty shells?

**Populated legal/owner; situs/sqft varies by class.**

### 3. Impact on Manifest vs store honesty

| Surface | Impact |
|---|---|
| **Store honesty** | **Drift.** Approved baseline **883,954**; live **975,885**. Documented in `_inbox/2026-08-25_p25_repair_or_skip.md` (SKIP, no repair). |
| **County Manifest** | **Unchanged until rematerialize.** Tarrant `cad` rail still **not-yet @ 89.45%** on last dump. Extra rows do not auto-fix Manifest; they make store row-count claims vs P-25 baseline false. |
| **L17** | No flip performed; still held. DROP does not resolve cross-vintage mapping. |

### 4. KEEP vs DROP reasoning

| | KEEP | DROP |
|---|---|---|
| Pro | Newer/larger TAD zip; real accounts; overlap keys refreshed | Off-path ingest operator-stopped; P-25 SKIP; store must match approved baseline until WDLL amendment |
| Con | Retains unapproved +10% row growth; baseline docs lie | Loses legitimate newer TAD accounts until **approved** reload |

**DROP** because governance trumps data freshness for an unauthorized write: Wave-4 was **void-off-path** per `_inbox/2026-08-25_p25_repair_or_skip.md`. Operator can later **KEEP via approved path** (announce + WDLL amendment accepting 975,885 as new baseline).

## Sample `prop_id` snapshots

| prop_id | situs | legal (trunc) | sqft | yb | market_value | in StratMap 2025? |
|---|---|---|---|---|---|---|
| `-1305H-A-1` | 1607 AMANDA AVE | AVELAR MARTINEZ ADDITION Block A Lot 1 | 1610 | 2025 | 278573 | no |
| `-3680-1--10` | 6200 LT JG BARNETT RD | EAST GATE MHP PAD 72… | 1064 | 1984 | 3230 | no |
| `-6430--8R2` | 520 NORTH RD | AVALON MHP Lot PAD 105… | 1216 | 2015 | 24892 | no |
| `16529782` | 4730 OLD BLUE CIR | WILLOW SPRINGS MHP PAD 38… | 1152 | 2018 | 25190 | no |
| `12325160` | 5232 E LANCASTER AVE | HACIENDA MHP PAD 400… | 1216 | 1997 | 11463 | no |
| `1-51-191544-000-R-001000` | *(empty)* | INDIAN CREEK W#C-1… | null | null | null | no |
| `A  13-4F01` *(delimited-only)* | 2905 S SHADY LN | ABBOTT, B R SURVEY… | 2364 | 1976 | 409855 | no |

Overlap keys (pre-existing baseline, re-upserted Aug-25) have **~100% situs + legal + ~91% sqft**.

## DROP procedure (do not run until operator go)

Current store cannot tag net-new rows by `ingested_at` alone (Aug-25 reload re-upserted all 883,954 baseline keys in place). **Authoritative net-new set = prop_ids in store minus prop_ids from Aug-14 baseline zip parse.**

### Step 1 — Build baseline prop_id set (offline, no DELETE)

Export prop_ids from the **2026-08-14** approved zip parse (883,954 expected). Load into temp table `tarrant_baseline_20260814`.

### Step 2 — Dry-run count (expect 91,931)

```sql
SELECT COUNT(*) AS net_new_to_delete
FROM cad_property c
WHERE c.county_fips = '48439'
  AND c.tax_year = 2026
  AND NOT EXISTS (
    SELECT 1 FROM tarrant_baseline_20260814 b WHERE b.prop_id = c.prop_id
  );
-- Expected: 91931

SELECT COUNT(*) AS post_delete_expect
FROM cad_property c
WHERE c.county_fips = '48439'
  AND c.tax_year = 2026
  AND EXISTS (
    SELECT 1 FROM tarrant_baseline_20260814 b WHERE b.prop_id = c.prop_id
  );
-- Expected: 883954
```

Sanity: `net_new_to_delete + post_delete_expect = 975885`.

### Step 3 — DELETE (operator only, after dry-run matches)

```sql
BEGIN;

DELETE FROM cad_property c
WHERE c.county_fips = '48439'
  AND c.tax_year = 2026
  AND NOT EXISTS (
    SELECT 1 FROM tarrant_baseline_20260814 b WHERE b.prop_id = c.prop_id
  );

SELECT COUNT(*) FROM cad_property WHERE county_fips = '48439' AND tax_year = 2026;
-- Expected: 883954 before COMMIT

COMMIT;
```

Record mutation per enforcement doctrine.

### If operator chooses KEEP instead

No DELETE. File WDLL amendment accepting **975,885** as Tarrant 2026 baseline, cite Aug-25 TAD zip SHA/size, set new Manifest rematerialize card. P-25 remains `ready:false` until amendment approved.

## leave_behind

- DROP decision filed; DELETE not run (operator go required)
- Baseline prop_id export + dry-run count is the next mechanical step before any DELETE
- P-25 stays `ready:false`
