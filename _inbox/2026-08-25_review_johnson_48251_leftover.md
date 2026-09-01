---
id: 2026-08-25_review_johnson_48251_leftover
title: Adversarial review — P-78 Johnson 48251 leftover (Texas fill #21)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Johnson 48251 leftover

Apply is real. 48251 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Bandera-shaped 202508 drop). STAT_LAND_ was blank on every parsed row. Two keys still null acres, named. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_johnson_48251_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48251` only. Vintage quoted. DBF year in zip is 202508. 101852 read, 100603 parsed, 61 dupes, 1188 skipped (no Prop_ID; skip samples are no Prop_ID), 100603 upserted in 40.9s. After n matches upserted.

After JSON: 2025 n=100603 / yb=0 / la=100601. No 2026 row. Null-acres keys: `R000111988`, `R000124112`.

Dest identity live at 2026-08-25T21:11:22.028Z: prior twenty KEEP n hold, including Hunt 69542.

prop_id `0` @ 2025 = 0, named not success.

## Accept

- Named FIPS 48251. Not a Hunt rewrite.
- Path B greenfield. Acres on 100601 of 100603. Years 0 of 100603.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- 1188 skips are missing Prop_ID. Named in the log. Not a second FIPS.
- Two null-acres keys named. Same shape as Denton leftover, not a HOLD.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 and blank STAT_LAND_ are the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built or the two null-acres keys. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Johnson artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48255 Karnes**. Registry L17 is null. CAD REST is honest_absent; leftover still uses StratMap. Derive path from census. Do not flip L17.
