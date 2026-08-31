---
id: 2026-08-25_review_lee_48287_leftover
title: Adversarial review — P-78 Lee 48287 leftover (Texas fill #26)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Lee 48287 leftover

Apply is real. 48287 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert. Years and acres both moved. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_lee_48287_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48287` only. Vintage quoted. DBF year in zip is 202503. 16091 read, 14769 parsed, 1297 dupes, 25 skipped (no Prop_ID; skip samples are no Prop_ID), 14769 upserted in 8.9s. After n matches upserted. STAT_LAND_ present on 8922 of 14769.

After JSON: 2025 n=14769 / yb=8359 / la=14769. No 2026 row. Null-acres keys: none.

Dest identity live at 2026-08-25T21:47:20.770Z: prior twenty-five KEEP n hold, including Kerr 34594.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48287. Not a Kerr rewrite.
- Path B greenfield. Acres on every new key. Years on 8359 of 14769 (Atascosa-shaped 202503 drop).
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- 25 skips are missing Prop_ID. Named in the log. Not a second FIPS.

Rejected alternative: the writer never ran. n, year, and acres all moved from empty.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Lee artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48299 Llano**. Registry L17 is null. Derive path from census. Do not flip L17.
