---
id: 2026-08-25_p78_caldwell_leftover_rebake_WDLL
title: WDLL — P-78 leftover store-land, Caldwell 48055 only
date: 2026-08-25
status: approved
operator_approval: verbal 2026-08-25 (next small wave after KEEP)
plan_row: P-78
related:
  - _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
  - _inbox/2026-08-24_p78_cad_property_merge_SPEC.md
  - _inbox/2026-08-25_p78_leftover_dryrun_caldwell_48055.json
  - _decisions/2026-08-25_p25_tarrant_keep.md
---

# WDLL: Caldwell leftover rebake (48055 only)

Date: 2026-08-25  Status: approved  Operator approval: 2026-08-25

## Done looks like

Caldwell `cad_property` rows at the StratMap tax year carry `year_built` and `land_acres` from the same 202503 DBF the parse-only dry-run already measured. Path A merge (COALESCE / CAMA-wins CASE) is the writer. No other FIPS is touched. No atoms `--apply`. No L17 write. No rematerialize. A before/after store measure with snapshot proves the leftover landed. Prop_ID literal `0` is counted and is not treated as leftover success.

## Acceptance items

1. **KEEP restamp already on the boards.** Five family canvases say Tarrant KEEP 975885 and `53a0139` (or later KEEP SHA). | check: write-path SNAPSHOT string | grade: [met 2026-08-25] other-agent close: origin `53a0139`, five SNAPSHOTs KEEP, no DELETE

2. **Announce before write.** File `_inbox/2026-08-25_p78_announce_caldwell_48055.md` naming FIPS 48055, zip/DBF path, LDT SHA `46e1a5a1` / `72cffc8`, dest `cad_property`, Path A, no atoms. | check: announce file exists before upsert log starts | grade: [ ]

3. **Before measure.** COUNT Caldwell `cad_property` at the StratMap tax year: n, year_built non-null, land_acres non-null. File JSON with query text and snapshot. | check: `_inbox/2026-08-25_p78_caldwell_48055_before.json` | grade: [ ]

4. **Apply one county only.** Isolated LDT from `origin/main`. `stratmap-landuse --county=48055` against the named 202503 zip/DBF. No `--allow-stratmap-fallback`. No 48113. No 48439. `DATABASE_URL` is cortex-prod only if that is the same dest the dry-run described; say the dest in the announce. | check: CLI log county=48055; git/process list shows no other FIPS | grade: [ ]

5. **After measure.** Same query as item 3. year_built non-null and land_acres non-null rise vs before. n does not jump by a second county. File JSON. | check: `_inbox/2026-08-25_p78_caldwell_48055_after.json` plus delta | grade: [ ]

6. **Prop_ID 0.** Skip count or single-key note. Literal `0` is not leftover success. Do not invent a product patch unless the upsert of key `0` is the only writer and you file it as leave_behind. | check: log or SQL COUNT where prop_id in (`0`,`00`) for 48055 | grade: [ ]

7. **No silent scope.** Dallas, Tarrant, Travis, atoms `--apply`, L17, rematerialize, P-80, P-79, P-09, COVER not started. | check: announce + close `notStarted` list | grade: [ ]

8. **Close.** `_inbox/2026-08-25_p78_caldwell_leftover_rebake_close.json` grades this card. leave_behind named. Canvases restamp this SHA. Then stop. Review is a later card. | check: close file + SNAPSHOT | grade: [ ]

## Amendments

None at approval.

## Finish card (graded at close)

| # | Grade | Evidence |
|---|---|---|
| 1 | met (53a0139) | Prior agent; not re-restamped |
| 2 | met | `_inbox/2026-08-25_p78_announce_caldwell_48055.md` before apply |
| 3 | met | `_inbox/2026-08-25_p78_caldwell_48055_before.json` n=0 @ 2025 |
| 4 | met | apply log county=48055; LDT 46e1a5a1; 24989 upserted |
| 5 | met | after JSON yb 16937 la 24989 vs before 0 |
| 6 | met | prop_id zero keys=1; not leftover success |
| 7 | met | close notStarted |
| 8 | met | `_inbox/2026-08-25_p78_caldwell_leftover_rebake_close.json` |
