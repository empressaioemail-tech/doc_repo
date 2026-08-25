---
title: P-25 Tarrant (48439) cad_property keep-or-drop — three options (operator pick)
date: 2026-08-25
plan_row: P-25
author: integration planner (amended after adversarial review)
status: OPTIONS FILED — identification incomplete
decision: null
operator_go: false
p25_ready: false
supersedes_partial: dae2006 single DROP-to-883954 (withdrawn — not operator go)
related:
  - _inbox/2026-08-25_review_tarrant_store.md
  - _inbox/2026-08-25_review_other_agent_dae2006.md
  - _inbox/2026-08-25_p25_tarrant_drift_classify.json
  - _inbox/2026-08-14_l21_tarrant_post_reload_residual.json
  - _inbox/2026-08-25_p25_dallas_tarrant_store_measure.json
---

# P-25 Tarrant keep-or-drop

## Status

**No operator decision.** Three restore targets are named below. **Do not run DELETE.** `dae2006` is **not** operator go.

Prior draft filed **DROP-to-883,954** as if it undid Wave-4. That is **withdrawn**. It conflated the Aug-14 **ingest log** (883,954 upserted) with the live store L21 already measured at **939,435** on 2026-08-14, and sampled the **294,297** `prop_ids_only_2026` bucket instead of a named `store NOT IN baseline_set`.

## Snapshot

| Field | Value |
|---|---|
| Repo | `P:/doc_repo` @ `dae2006` (amendment pending commit) |
| County | 48439 Tarrant |
| Current `@ tax_year=2026` | **975,885** rows |
| L17 / registry | **`tx-48439` already `current_tax_year=2026` / `current_tier=cad-export`** (L21, 2026-08-14). Wave-4 did not flip L17. Extras are already in the cortex structural live-read set. |
| P-25 | **`ready:false`** |

## Count arithmetic (filed JSON, not markdown)

| Question | Before | After / delta | Source |
|---|---|---|---|
| vs Aug-14 **ingest log** | 883,954 upserted | +91,931 → 975,885 | classify JSON |
| vs **L21 store** (2026-08-14) | 939,435 rows @ 2026 | +36,450 → 975,885 | L21 residual + Wave-4 preLoad |
| Wave-4 tad_full net vs ingest log | 975,303 − 883,954 = **91,349** | | classify + load log |
| Wave-4 vs **preLoad** | 975,303 − 938,853 ≈ **36,450** | | wave4 handoff (582 delimited in preLoad) |

```
55481 + 36450 = 91931     (L21 gap + Wave-4 damage = log gap)
939435 - 883954 = 55481   (already in store before Wave-4)
975885 - 939435 = 36450   (Wave-4 vs live preLoad)
```

**Wave-4 damage to the store Wave-4 walked into is +36,450, not +91,349.** The +91,931 headline is honest vs the **ingest log**, not vs L21/preLoad.

## What the extras are (honest bounds)

- All 975,303 tad_full rows share `source_vintage` prefix `tier:cad-export;adapter:county-run;drop:tad_propertydata_full` and Aug-25 `ingested_at`. **Extras are not tagged in the store.**
- Classify JSON does **not** split field completeness on the +91k set. It only reports cross-vintage counts for **all** 2026 keys (`prop_ids_only_2026` = 294,297).
- Wave-4 skip line (~1.27M malformed; blank `gis_link`) is consistent with L21 mineral rows refused, not upserted. Upserted rows had a GIS_Link; that does not prove live accounts vs colliding keys.

## Samples — WITHHELD

**No valid sample table in this file.** The dae2006 draft sampled `prop_ids_only_2026` (294k bucket). That is **not** `cad_property @ 2026 NOT IN baseline_set`.

Samples are withheld until:

1. **Baseline set is built** for the chosen option (Aug-14 zip prop_id export and/or preLoad prop_id census).
2. SQL runs `LIMIT` on **`store NOT IN baseline_set`**, not on `NOT EXISTS (2025 StratMap)`.

Minimum queries (from review; do not run full county dump):

```sql
-- Extra vs 2025 StratMap (LIMIT 50) — diagnostic only, NOT the extra set
SELECT c.prop_id, LENGTH(c.prop_id) AS prop_id_len,
       (c.situs_address IS NULL OR BTRIM(c.situs_address) = '') AS situs_empty,
       (c.legal_description IS NULL OR BTRIM(c.legal_description) = '') AS legal_empty,
       (c.living_area_sqft IS NULL) AS sqft_null
FROM cad_property c
WHERE c.county_fips = '48439' AND c.tax_year = 2026
  AND c.source_vintage LIKE 'tier:cad-export;adapter:county-run;drop:tad_propertydata_full%'
  AND NOT EXISTS (
    SELECT 1 FROM cad_property s
    WHERE s.county_fips = '48439' AND s.tax_year = 2025 AND s.prop_id = c.prop_id
  )
ORDER BY c.prop_id
LIMIT 50;
```

After baseline_set exists:

```sql
SELECT COUNT(*) FROM cad_property c
WHERE c.county_fips = '48439' AND c.tax_year = 2026
  AND NOT EXISTS (SELECT 1 FROM tarrant_baseline_set b WHERE b.prop_id = c.prop_id);
```

## Three options (operator pick)

### Option A — KEEP

**Action:** Accept **975,885** rows @ 2026. No DELETE.

**Requires:** WDLL amendment naming Aug-25 TAD zip SHA/size as new approved baseline; explain inspect/census effect (PMTiles-matching keys become structural live hits at declared `2026/cad-export`).

**Pros:** Retains all current CAMA rows including Wave-4 +36,450 and pre-L21 +55,481.

**Cons:** Store count disagrees with Aug-14 ingest log and P-25 SKIP narrative unless amended.

### Option B — DROP-to-L21 (**939,435**)

**Action:** DELETE keys in `cad_property @ tax_year=2026` **not in the preLoad / L21 prop_id set** (~**36,450** net-new vs store before Wave-4).

**Restore target:** `_inbox/2026-08-14_l21_tarrant_post_reload_residual.json` `rows2026` **939,435** and Wave-4 `preLoad.48439.rows2026` **939,435**.

**Interpretation:** Undo **Wave-4 damage only**. Keeps ~55k keys that were already 2026 on Aug-14 before the reload.

**Requires:** Named `tarrant_baseline_l21_20260814` prop_id set (store census or export at preLoad snapshot). Dry-run count must return **~36,450** before operator go.

### Option C — DROP-to-log (**883,954**)

**Action:** DELETE keys **not in Aug-14 approved zip parse prop_id set** (~**91,931** net-new vs ingest log).

**Restore target:** `_inbox/2026-08-14_P25_full_loads_reconcile.md` upsert count **883,954**.

**Interpretation:** Restore the **ingest log**, not the live store Wave-4 entered. **Also drops ~55,481 keys L21 already had at 2026** that were never in the Aug-14 delimited parse set.

**Requires:** Offline export of Aug-14 zip prop_ids (883,954 expected). Dry-run must return **91,931** before operator go.

**Warning:** This is **not** undo-Wave-4 alone. Operator must explicitly accept losing the L21 universe above the log.

## DELETE procedure (all options)

**Not authorized.** Shared steps after operator picks A/B/C:

1. Build `tarrant_baseline_set` for the chosen target (offline; no tad.org fetch this lane).
2. Dry-run `COUNT(*)` for `NOT IN baseline_set` — must match option delta (**36,450** or **91,931**).
3. `LIMIT` sample from **that** set only.
4. Operator verbal go → DELETE in transaction → verify post-count → mutation record.

Dropping by `ingested_at` or `drop:tad_propertydata_full` alone deletes **975,303** tad_full rows, not a trim.

## L17 / readers

Registry **`tx-48439` is already `2026/cad-export`**. Readers bind declared vintage today. KEEP vs DROP changes which `prop_id` keys exist at that vintage on structural live-read; it is not a future flip problem.

## P-78 interaction

**No stratmap-landuse write** while Tarrant delete identification is open. Leftover dry-run filed: `_inbox/2026-08-25_p78_leftover_dryrun_caldwell_48055.json` (Caldwell 48055 parse-only).

## leave_behind

- Operator picks KEEP, DROP-to-L21, or DROP-to-log
- Baseline prop_id set + dry-run count for chosen option
- Sample rows from `NOT IN baseline_set` only
- P-25 stays `ready:false`
- DELETE not run
