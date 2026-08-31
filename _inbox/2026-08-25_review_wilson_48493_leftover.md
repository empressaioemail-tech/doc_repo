---
id: 2026-08-25_review_wilson_48493_leftover
title: Adversarial review — P-78 Wilson 48493 leftover (Texas fill #32)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Wilson 48493 leftover

Apply is real. 48493 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert. Years and acres both moved. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_wilson_48493_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48493` only. Vintage quoted. DBF year in zip is 202503. 28827 read, 28006 parsed, 821 dupes, 0 skipped, 28006 upserted in 15.9s. After n matches upserted. STAT_LAND_ present on 20456 of 28006.

After JSON: 2025 n=28006 / yb=14226 / la=28006. No 2026 row. Null-acres keys: none.

Dest identity live at 2026-08-25T22:21:01.058Z: prior thirty-one KEEP n hold, including Somervell 6584.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48493. Not a Somervell rewrite.
- Path B greenfield. Acres on every new key. Years on 14226 of 28006 (Atascosa-shaped 202503 drop).
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.

Rejected alternative: the writer never ran. n, year, and acres all moved from empty.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Wilson artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48497 Wise**. Last tranche-1 leftover. Registry L17 is null. Derive path from census. Do not flip L17. After Wise KEEP the farm stops. Do not start Dallas or Tarrant.
