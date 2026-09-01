---
id: 2026-08-25_review_medina_48325_leftover
title: Adversarial review — P-78 Medina 48325 leftover (Texas fill #28)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Medina 48325 leftover

Apply is real. 48325 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert. Years and acres both moved. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_medina_48325_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48325` only. Vintage quoted. DBF year in zip is 202503. 44330 read, 40571 parsed, 3759 dupes, 0 skipped, 40571 upserted in 22.6s. After n matches upserted. STAT_LAND_ present on 23626 of 40571.

After JSON: 2025 n=40571 / yb=22366 / la=40571. No 2026 row. Null-acres keys: none.

Dest identity live at 2026-08-25T21:57:38.314Z: prior twenty-seven KEEP n hold, including Llano 34821.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48325. Not a Llano rewrite.
- Path B greenfield. Acres on every new key. Years on 22366 of 40571 (Atascosa-shaped 202503 drop).
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.

Rejected alternative: the writer never ran. n, year, and acres all moved from empty.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Medina artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48367 Parker**. Registry L17 is null. Derive path from census. Do not flip L17.
