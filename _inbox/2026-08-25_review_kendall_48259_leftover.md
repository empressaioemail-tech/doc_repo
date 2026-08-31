---
id: 2026-08-25_review_kendall_48259_leftover
title: Adversarial review — P-78 Kendall 48259 leftover (Texas fill #24)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Kendall 48259 leftover

Apply is real. 48259 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert. Years and acres both moved. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_kendall_48259_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48259` only. Vintage quoted. DBF year in zip is 202503. 30388 read, 28852 parsed, 1098 dupes, 438 skipped (no Prop_ID; skip samples are no Prop_ID), 28852 upserted in 17.3s. After n matches upserted.

After JSON: 2025 n=28852 / yb=19193 / la=28852. No 2026 row. Null-acres keys: none.

Dest identity live at 2026-08-25T21:31:29.559Z: prior twenty-three KEEP n hold, including Kaufman 93292.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48259. Not a Kaufman rewrite.
- Path B greenfield. Acres on every new key. Years on 19193 of 28852 (Atascosa-shaped 202503 drop).
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- 438 skips are missing Prop_ID. Named in the log. Not a second FIPS.

Rejected alternative: the writer never ran. n, year, and acres all moved from empty.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Kendall artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48265 Kerr**. Registry L17 is null. Derive path from census. Do not flip L17.
