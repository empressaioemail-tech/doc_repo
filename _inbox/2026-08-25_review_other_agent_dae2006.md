---
id: 2026-08-25_review_other_agent_dae2006
title: Adversarial grade of store-honesty close dae2006
date: 2026-08-25
status: filed
plan_row: P-25
author: integration reviewer
snapshot: doc_repo main dae2006; reviews at 11763c0
---

# Grade of the other agent's dae2006 close

Their report is half right. Hygiene, canvas restamp, P-78 "no new PR", pin PASS, DELETE not run: accept. The DROP decision as filed is not safe to execute and is not honest as "undo Wave-4."

Three independent reviews: `_inbox/2026-08-25_review_tarrant_store.md`, `_inbox/2026-08-25_review_p78_write_path.md`, `_inbox/2026-08-25_review_serve_honesty.md`. This file grades their close against those, not a fourth derivation.

Serve review (live facets 2026-08-25T14:28Z): WDLL 7 stays met. WDLL 3 is partial, not met. Wave-222 close over-graded the heading fallback as a street win. Do not open a bind card for land-use-fact vocabulary, P-74 bake, or the 280238 overlay while the Tarrant DELETE is still the live fire.

## Accept

- Wave batch was already on `11763c0`. New commit `dae2006`. STOP file untracked.
- Five family canvases restamped: `00584-gaf`, `#222`, P-77 item 7 met, Wave 4 not IN FLIGHT.
- P-78 leftover code is already on LDT `72cffc8` / serving `46e1a5a1`. Isolated tree has no unique commit. No new PR is correct.
- WDLL item 9 left in flight (rebake not replayed). Correct.
- Pin `--check` PASS, P-25 `ready:false`. Correct.
- DELETE not run. Correct. Keep it that way.

## Reject or hold

### 1. DROP-to-883,954 is not undo-Wave-4

L21 residual JSON (2026-08-14T17:30Z) and Wave-4 `preLoad` both already have Tarrant 2026 = **939,435**.

```
939435 - 883954 = 55481   (already in store on Aug-14, before Wave-4)
975885 - 939435 = 36450   (Wave-4 vs live preLoad)
55481 + 36450   = 91931
```

`+91,931` vs the Aug-14 **ingest log** is honest arithmetic. Calling those 91,349 keys "landed via off-path Wave-4" is not. Most of the gap predates Aug-25. A DELETE that restores 883,954 also deletes ~55k keys L21 already treated as the 2026 universe.

Their own file says the extras are not tagged by `ingested_at`. That part is right. The procedure (export Aug-14 zip prop_ids) would identify a set. It identifies the wrong restore target if the approved live baseline after L21 is 939,435.

### 2. Samples are the 294k 2026-only bucket, not the extra set

They sampled keys that are not in 2025 StratMap (`-1305H-A-1`, MHP pads, mineral). That population is **294,297** (`prop_ids_only_2026` in classify JSON). The extra set vs Aug-14 log is **91,931**. Those are not the same set. Completeness rates on 2026-only (legal/owner full, situs 5%) do not describe the extras.

They did not build `tarrant_baseline_20260814`. They documented how they would. Samples without that set are the wrong cohort.

### 3. L17 "still held / no flip" is stale

Registry `tx-48439` is already `current_tax_year=2026` / `current_tier=cad-export` (L21, 2026-08-14). Wave-4 did not need a flip. The extras are already in the cortex structural live-read set. KEEP vs DROP is a now problem, not a future flip problem.

### 4. WDLL 8 "met" via selftest name is thinner than the check

Code review: COALESCE + F1 last-wins fail is real. `p78-merge-fixtures-selftest.mjs` is **absent** on the isolated / main tree they graded. The JS `applyPathAMerge` test is not the drizzle SQL. Grade 8 can stay met on the SET clause read. Do not cite a missing selftest as the check.

WDLL 9 dry-run JSON is still absent. "in flight" is the honest grade. Do not let item 9 close on parser-on-main alone.

### 5. Canvas family still carries the DROP as settled fact

Restamp killed the IN FLIGHT lie. It replaced it with "Tarrant DROP filed" on all five boards. If the operator does not accept DROP-to-883,954, the boards will drive a delete of the L21 set. Hold the caption at "DROP filed, identification incomplete" until the before-count is named: 883,954 ingest log vs 939,435 L21 store.

## What "Texas done" is not

Manifest 667/3556 stays the dump. Do not rematerialize to green Tarrant. P-80 / P-09 / COVER / P-79 stay held.

## Operator call this review wants

Do not run the DELETE. Do not treat dae2006 as a go. Amend keep-or-drop to name two restore targets (883,954 log vs 939,435 L21) and sample from `store prop_id NOT IN baseline_set`, not from 2026-only. Then decide KEEP, DROP-to-L21, or DROP-to-log.

Serve leftovers stay parked: do not rewrite land-use-fact vocabulary, do not bake 280239 situs, do not seed 280238 geometry on this card. WDLL 3 stays partial. WDLL 7 stays met.
