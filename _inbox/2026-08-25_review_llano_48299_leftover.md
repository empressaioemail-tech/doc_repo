---
id: 2026-08-25_review_llano_48299_leftover
title: Adversarial review — P-78 Llano 48299 leftover (Texas fill #27)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Llano 48299 leftover

Apply is real. 48299 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert. Years and acres both moved. One key still null acres, named. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_llano_48299_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48299` only. Vintage quoted. DBF year in zip is 202503. 38879 read, 34821 parsed, 4021 dupes, 37 skipped (no Prop_ID; skip samples are no Prop_ID), 34821 upserted in 20.2s. After n matches upserted. STAT_LAND_ present on 18230 of 34821.

After JSON: 2025 n=34821 / yb=15911 / la=34820. No 2026 row. Null-acres keys: `57662`.

Dest identity live at 2026-08-25T21:52:37.183Z: prior twenty-six KEEP n hold, including Lee 14769.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48299. Not a Lee rewrite.
- Path B greenfield. Acres on 34820 of 34821. Years on 15911 of 34821 (Atascosa-shaped 202503 drop).
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- 37 skips are missing Prop_ID. Named in the log. Not a second FIPS.
- One null-acres key named. Same shape as Johnson leftover, not a HOLD.

Rejected alternative: the writer never ran. n, year, and acres all moved from empty.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase the one null-acres key. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Llano artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48325 Medina**. Registry L17 is null. Derive path from census. Do not flip L17.
