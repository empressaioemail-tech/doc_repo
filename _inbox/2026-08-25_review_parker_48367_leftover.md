---
id: 2026-08-25_review_parker_48367_leftover
title: Adversarial review — P-78 Parker 48367 leftover (Texas fill #29)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Parker 48367 leftover

Apply is real. 48367 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Johnson-shaped 202507 drop). STAT_LAND_ was blank on every parsed row. Do not replay to chase years or land-use codes.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_parker_48367_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48367` only. Vintage quoted. DBF year in zip is 202507. 100555 read, 92583 parsed, 6950 dupes, 1022 skipped (no Prop_ID; skip samples are no Prop_ID), 92583 upserted in 51.5s. After n matches upserted. Land-use present 0 of 92583.

After JSON: 2025 n=92583 / yb=0 / la=92583. No 2026 row. Null-acres keys: none.

Dest identity live at 2026-08-25T22:04:40.777Z: prior twenty-eight KEEP n hold, including Medina 40571.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48367. Not a Medina rewrite.
- Path B greenfield. Acres on every new key. Years 0 of 92583.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- 1022 skips are missing Prop_ID. Named in the log. Not a second FIPS.
- Blank STAT_LAND_ is the drop, not a failed apply.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 is the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Parker artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48397 Rockwall**. Registry L17 is null. CAD REST is honest_absent; leftover still uses StratMap. Derive path from census. Do not flip L17.
