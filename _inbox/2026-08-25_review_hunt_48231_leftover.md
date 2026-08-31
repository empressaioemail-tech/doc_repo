---
id: 2026-08-25_review_hunt_48231_leftover
title: Adversarial review — P-78 Hunt 48231 leftover (Texas fill #20)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Hunt 48231 leftover

Apply is real. 48231 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert. Years and acres both moved. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_hunt_48231_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48231` only. Vintage quoted. DBF year in zip is 202503. 69737 read, 69542 parsed, 186 dupes, 9 skipped (no Prop_ID; skip samples are no Prop_ID), 69542 upserted in 28.7s. After n matches upserted.

After JSON: 2025 n=69542 / yb=48088 / la=69542. No 2026 row.

Dest identity live at 2026-08-25T21:06:16.952Z: prior nineteen KEEP n hold, including Hood 50876.

prop_id `0` @ 2025 = 0, named not success.

## Accept

- Named FIPS 48231. Not a Hood rewrite.
- Path B greenfield. Acres on every new key. Years on 48088 of 69542 (Atascosa-shaped 202503 drop).
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- 9 skips are missing Prop_ID. Named in the log. Not a second FIPS.

Rejected alternative: the writer never ran. n, year, and acres all moved from empty.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Hunt artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48251 Johnson**. Registry L17 is null. Derive path from census. Do not flip L17.
