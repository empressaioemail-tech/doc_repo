---
title: Adversarial review of Tarrant +91,931 classify and Dallas SKIP
date: 2026-08-25
plan_row: P-25
author: integration reviewer (no commit)
status: evidence for keep-or-drop author
snapshot:
  repo: P:/doc_repo
  branch: main
  commit: 11763c0d13f0f3b7d622ce637f477e21b8953bb9
  seat: integration reviewer on P:/doc_repo
  classify_artifact_commit: 9842ed2a038109a66f657a34cb1f07f5620d5d8d
  sql_run_this_review: none
---

# Adversarial review: Tarrant store classify and Dallas SKIP

This file does not decide KEEP or DROP. It states which claims are honest as count arithmetic, which are not honest as store identity, and what the keep-or-drop author must still prove.

No cad-ingest, DELETE, L17 write, tad.org, rematerialize, UPDATE, or full-table scan was run. Numbers below are recomputed from filed JSON and from SQL strings already in those artifacts.

## Snapshot of files read

| Path | Role |
| --- | --- |
| `_inbox/2026-08-25_p25_tarrant_drift_classify.md` | Prose classify. JSON outranks it. |
| `_inbox/2026-08-25_p25_tarrant_drift_classify.json` | Count and vintage measure. SQL listed. |
| `_inbox/2026-08-25_p25_repair_or_skip.md` | SKIP decision and cross-vintage legal probe. |
| `_inbox/2026-08-25_p25_dallas_tarrant_store_measure.json` | preLoad 939,435 and post counts. |
| `_inbox/2026-08-25_p25_wave4_handoff.md` | SUPERSEDED forensic. Wave-4 vs preLoad +36,450. Dallas retry 806,563 upserts. |
| `_inbox/2026-08-14_P25_full_loads_reconcile.md` | 883,954 is an ingest-log upsert count, not a later store census. |
| `_inbox/2026-08-14_l21_tarrant_post_reload_residual.json` | Same-day store census: 2026 rows already 939,435. |
| `_inbox/2026-08-24_p78_cad_property_merge_SPEC.md` | Path A same PK vs Path B new tax_year. |
| `_scratch/parcel-facts-write-path.md` | Wave-4 stop and Dallas retry note. |
| `_catalog/tx_cad_source_registry.json` | 48439 and 48113 already `2026` / `cad-export`. |
| `_inbox/2026-08-24_inspect_hop_diagram.md` | PE does not SELECT `cad_property`. Structural living area is a cortex live read at declared vintage. |
| `_inbox/2026-08-25_p25_tarrant_keep_or_drop.md` | **Absent.** |

## Recomputed numbers (from JSON, not markdown)

Classify JSON current store: `row_count` 975885, tad_full cohort 975303, delimited cohort 582, baseline 883954.

```
975885 - 883954 = 91931
91349 + 582     = 91931
975303 + 582    = 975885
975303 - 883954 = 91349
```

The split 91349 + 582 equals the headline +91,931. Arithmetic against the 2026-08-14 ingest log is honest.

The re-upsert line in classify JSON is not a second derivation. It is the same subtraction reversed:

```
keys_re_upserted = 975303 - 91349 = 883954
```

That identity cannot prove the 883,954 Aug-14 keys are still the same `prop_id` set.

Store measure JSON `preLoad.48439.rows2026` is 939435. Wave-4 handoff states that block was queried on 2026-08-25 before the Tarrant reload. L21 residual JSON, measured 2026-08-14T17:30Z, already has `rows2026` 939435.

```
939435 - 883954 = 55481
975885 - 939435 = 36450
55481 + 36450   = 91931
```

If preLoad delimited was the same 582 survivors, tad_full before Wave-4 was 938853 and Wave-4 tad_full net vs that store is 975303 - 938853 = 36450. The keep-or-drop author must treat +36,450 (Wave-4 vs live preLoad) and +91,931 (current vs Aug-14 ingest log) as different questions.

Tarrant 2026 sqft / year-built from store measure: 63.7 / 64.1. Aug-14 reconcile over the 883,954 upsert: 65.1 / 65.2. A larger, lower-fill cohort can move those percentages without any wipe.

Dallas 2026 from store measure: 806563, sqft 72.3, yb 73.9. Matches the Aug-14 ingest-log row count and the same percentages.

## Findings

### 1. The +91,931 classify is honest as log-vs-now arithmetic and not honest as "Wave-4 added 91,349 new tad_full keys"

Claim: 91,349 tad_full keys are net new versus the 2026-08-14 load.

First mechanism: Wave-4 `tad_propertydata_full.zip` parsed and upserted 975303 keys (load2 log, filed in repair-or-skip and wave4 handoff), so 975303 - 883954 = 91349 new keys.

Second mechanism: the 883,954 figure is the Aug-14 ingest **log** (`rows upserted`). The live 2026 store was already 939,435 on 2026-08-14 (L21) and still 939,435 as Wave-4 preLoad. Most of the 91,349 count gap predates the Aug-25 reload. Wave-4's own handoff already filed +36,450 versus preLoad. The classify agent subtracted the wrong before-count.

Rejected: that 91,349 is a measured set difference. Classify SQL lists COUNT, GROUP BY `source_vintage`, ingest day, and a 2025/2026 `prop_id` overlap. It never subtracts key sets. After Wave-4, every tad_full row shares `ingested_at` on 2026-08-25 and the same `source_vintage`. The extras are not tagged.

Open question the classify left standing: are those keys real TAD accounts missing from the Aug-14 zip, or junk GIS_Link values the fuller zip parsed? A count cannot answer that.

### 2. The 91,349 are not distinguishable in the store from the rest of tad_full

Hunt: prop_id length, situs null rate, legal null rate, overlap with 2025 StratMap, on the extras versus the 883,954.

Classify JSON does **not** carry those splits for the +91k. Absence is the finding. KEEP/DROP cannot be honest without samples.

What the JSON does carry, for all 2026 keys, not for the extras:

| Field | Value |
| --- | --- |
| rows_2025 | 689838 |
| rows_2026 | 975885 |
| overlap_prop_ids_2025_and_2026 | 681588 |
| prop_ids_only_2026 | 294297 |
| prop_ids_only_2025 | 8250 |
| tad_full_2026_not_in_2025_prop_ids | 293735 |

Check: 681588 + 294297 = 975885. 681588 + 8250 = 689838. 294297 - 293735 = 562, near the 582 delimited cohort (about 20 delimited keys also sit in 2025).

L21 (2026-08-14 store, 939435 at 2026) had identical overlap 654675. Current overlap 681588 is +26913. 2025-only if taken as 689838 - 654675 = 35163 then 35163 - 8250 = 26913. That is consistent with Wave-4 adding on the order of 26,913 keys that already existed as 2025 StratMap parcels. It is a cross-vintage count, not a sample of the extras, and it uses two dates. The keep-or-drop author must re-run the overlap on a named extra sample, not treat this reviewer arithmetic as a key list.

Repair-or-skip 2026 legal fill on Tarrant is 975882 of 975885. Legal-null cannot separate extras from baseline inside tad_full.

Wave-4 skip line (1,277,056 malformed; sample `gis_link=""`) is consistent with L21's ~1.23M blank-GIS mineral rows being refused, not upserted. That argues the upserted extras had a GIS_Link. It does not prove the Link is a live account rather than a colliding or retired key.

### 3. Dallas SKIP is honest as "no named wipe parcel and no count change" and not honest as "count match proves no wipe"

Claim: Dallas 2026 still 806,563 after a kill at ~450k and a retry, therefore the store was not wiped.

First mechanism: row count equals the Aug-14 baseline, sqft and year-built percentages match, so the retry was a no-op.

Second mechanism: same-PK last-wins (and P-78 incoming-non-null overwrite) refresh `ingested_at` and attributes in place. Count does not move. Wave-4 handoff records `dallas_wave4_load_retry.log` as 806563 upserted in 325.0s and says "P-78 merge re-applied." Writes landed. A count match is what a successful same-key replay looks like.

Rejected: that matching percentages prove field identity with Aug-14. The same zip and the same parser will reproduce 72.3 / 73.9. No Dallas `ingested_at` day-break is in the measure JSON. Classify JSON is Tarrant-only.

P-78 on the Wave-4 tree (`72cffc8`) is a real reason incoming **null** legal would not wipe an existing 2026 legal. That is a code-read, not a store proof. Incoming non-null still overwrites. SKIP may stand as "no named wiped PK and no further ingest." It may not stand as "the retry did not write."

### 4. The cross-vintage legal query is the wrong wipe test

Repair-or-skip: 0 rows where 2026 cad-export `legal_description` is null and 2025 StratMap legal is present on the same `prop_id` (Dallas overlap 399965).

Path A wipe in the P-78 spec is same `(county_fips, prop_id, tax_year)`. StratMap 2025 and CAMA 2026 are different PKs (Path B). A 2025 legal cannot be last-wins-wiped by a 2026 INSERT. Zero rows on that join is the expected Path B layout, also expected if 2026 CAMA fills legal on overlap keys (Dallas 2026 `legal_n` 705536).

It does not test CAMA-on-CAMA replay on 2026, which is what Wave-4 did. It does not test last-wins absence.

Fixture F1 remaining synthetic is correctly stated. The gap is a same-year before/after, which this lane was forbidden to manufacture in prod.

### 5. L17 readers already bind 2026/cad-export. The extras are already in the structural read set

Hunt asked what happens if someone flips 48439 to 2026/cad-export.

Registry `tx-48439` already has `current_tax_year` 2026 and `current_tier` cad-export (L21 follow-up 3 / 2026-08-14). Same for 48113. Wave-4 handoff: no flip performed because both counties already declare 2026/cad-export. Repair-or-skip "L17 flips still held" is stale against the registry and against that handoff.

Inspect hop (filed 2026-08-24): PE never SELECTs `cad_property`. Cortex live-reads `living_area_sqft` / `year_built` through `tryResolveDeclaredCadVintage` + `makeCadPropertyLookup`. Title, land use, acreage stay baked from `txgio_parcel`.

So KEEP versus DROP of the extra 2026 keys is not a future flip problem. It is a now problem for any Tarrant map node whose `prop_id` exists in the 2026 cad-export cohort.

What a junk KEEP would do to PE/inspect: if the junk `prop_id` equals a StratMap / PMTiles node id, the next facets GET is a **hit** at declared vintage. Null sqft becomes absent-verified on a hit row, not lookup-failed. Wrong sqft becomes a live Inspect living-area number. PE will render whatever cortex returns. Keys that do not match a map node never appear on inspect; they still pollute any county-wide 2026 census, Manifest score, or later atom apply.

What DROP would break if aimed at "the 91k" without a key list: `ingested_at` and `source_vintage` are shared by all 975,303 tad_full rows. A drop-by-timestamp or drop-by-drop-name deletes the whole 2026 Tarrant CAMA read set, including the overlap that L21 already treated as the 2026 universe (939,435). Reverting L17 to 2025/stratmap-roll would hide all 2026 CAMA from structural live-read (StratMap sqft is the empty tier that justified the flip) and would change gold `48439:14437-2-1` from today's lookup-failed class to a 2025 StratMap hit if that plat key still exists only on 2025.

Atom apply of owner / land-use / cad-roll against declared 2026 is still queued, not executed (`l21_drain_queue_manifest.json` `executed: false`). KEEP or DROP of extras changes the apply universe if that queue ever runs.

### 6. `_inbox/2026-08-25_p25_tarrant_keep_or_drop.md` is absent

The keep-or-drop author must file it. Minimum sample queries are below. COUNT or LIMIT only. Named FIPS. `tax_year` filter. No SELECT * of 900k rows. No rematerialize. No UPDATE.

## What KEEP must still prove

1. The extra keys are a **set**, not a subtracted count. Name how they are selected (for example: 2026 tad_full `prop_id` NOT IN a reconstructed Aug-14 or preLoad key list). If no baseline key list exists, say so and stop claiming 91,349 identifiable rows.
2. A LIMIT sample of extras is distinguishable from a LIMIT sample of 2025-overlapping 2026 keys by something other than ingest time (length, hyphen/plat shape, situs null, legal null, owner null, `living_area_sqft` null).
3. Wave-4 +36,450 versus preLoad 939,435 is the damage number, or explain why the Aug-14 ingest log 883,954 is the better before-count after L21 already measured 939,435.
4. At least one named extra `prop_id` that exists on 2025 StratMap and one that does not, with those two rows printed (columns named, LIMIT 1 each).
5. If KEEP, state the inspect effect: extra keys that match PMTiles nodes become structural live hits. Extra keys that do not match stay invisible on the card and remain in the 2026 census.

## What DROP must still prove

1. The same identifiable extra set as KEEP. Dropping "rows ingested on 2026-08-25" or "drop:tad_propertydata_full" is a 975,303-row delete, not a 91k trim.
2. What the 2026 Tarrant structural read set becomes after the delete (count, sqft %, overlap with 2025).
3. Whether gold `48439:14437-2-1` and any named extra that today would hit would flip to lookup-failed.
4. That Dallas is out of scope for a Tarrant extra-key drop (Dallas count match is not a Tarrant license).
5. A restore path that is not tad.org open-fetch and not a full rematerialize, or an explicit refuse of restore.

## Minimum sample queries the other agent must run

All: `county_fips = '48439'` and `tax_year` literal. LIMIT. No `SELECT *` of the county.

1. Confirm Wave-4 versus preLoad, not versus the ingest log:

```sql
SELECT COUNT(*) AS n_2026
FROM cad_property
WHERE county_fips = '48439' AND tax_year = 2026;
```

Already filed as 975885. Re-run only if the keep-or-drop author needs a new snapshot timestamp.

2. LENGTH / null rates on a **sample** of 2026 tad_full keys that do **not** exist at 2025, LIMIT 50 (identity columns only):

```sql
SELECT c.prop_id,
       LENGTH(c.prop_id) AS prop_id_len,
       (c.situs_address IS NULL OR BTRIM(c.situs_address) = '') AS situs_empty,
       (c.legal_description IS NULL OR BTRIM(c.legal_description) = '') AS legal_empty,
       (c.owner_name IS NULL OR BTRIM(c.owner_name) = '') AS owner_empty,
       (c.living_area_sqft IS NULL) AS sqft_null
FROM cad_property c
WHERE c.county_fips = '48439'
  AND c.tax_year = 2026
  AND c.source_vintage LIKE 'tier:cad-export;adapter:county-run;drop:tad_propertydata_full%'
  AND NOT EXISTS (
    SELECT 1 FROM cad_property s
    WHERE s.county_fips = '48439' AND s.tax_year = 2025 AND s.prop_id = c.prop_id
  )
ORDER BY c.prop_id
LIMIT 50;
```

3. Same column list, LIMIT 50, for 2026 tad_full keys that **do** exist at 2025. Compare rates by eye. Do not scan both populations without LIMIT.

4. One named extra that overlaps 2025 and one that does not (LIMIT 1 each), including `prop_id`, `situs_address`, `legal_description`, `living_area_sqft`, `source_vintage`. These are the two rows KEEP/DROP must cite.

5. Dallas write-landed check (COUNT only, no row dump):

```sql
SELECT date_trunc('day', ingested_at AT TIME ZONE 'UTC')::date AS ingest_day,
       COUNT(*) AS n
FROM cad_property
WHERE county_fips = '48113' AND tax_year = 2026
GROUP BY 1
ORDER BY 1;
```

If ingest_day is 2026-08-25, SKIP cannot say the retry did not write. If it is still 2026-08-14, the retry log and the store disagree and that disagreement is the finding.

6. Do not use a 2025-legal / 2026-null-legal join as a Path A wipe test. If a same-PK wipe check is required, it is 2026 vs 2026 (needs a before snapshot that this lane does not have). Refuse rather than substitute Path B.

## leave_behind

```yaml
leave_behind:
  - item: _inbox/2026-08-25_review_tarrant_store.md
    owner: keep-or-drop author / planner
    plan_row: P-25
  - item: _inbox/2026-08-25_p25_tarrant_keep_or_drop.md
    owner: keep-or-drop author (not filed)
    plan_row: P-25
```

No KEEP/DROP decision in this review.
