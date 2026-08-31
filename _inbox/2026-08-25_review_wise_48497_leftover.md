---
id: 2026-08-25_review_wise_48497_leftover
title: Adversarial review — P-78 Wise 48497 leftover (Texas fill #33)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Wise 48497 leftover

Apply is real. 48497 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Bandera-shaped 202503 drop). STAT_LAND_ was blank on every parsed row. Do not replay to chase years or land-use codes.

This is the last tranche-1 leftover. Farm stops.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_wise_48497_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48497` only. Vintage quoted. DBF year in zip is 202503. 48705 read, 48428 parsed, 277 dupes, 0 skipped, 48428 upserted in 26.9s. After n matches upserted. Land-use present 0 of 48428.

After JSON: 2025 n=48428 / yb=0 / la=48428. No 2026 row. Null-acres keys: none.

Dest identity live at 2026-08-25T22:27:01.548Z: prior thirty-two KEEP n hold, including Wilson 28006.

prop_id `0` @ 2025 = 0, named not success.

## Accept

- Named FIPS 48497. Not a Wilson rewrite.
- Path B greenfield. Acres on every new key. Years 0 of 48428.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- Blank STAT_LAND_ is the drop, not a failed apply.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 is the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built. Rewrite the KEEP set. Atoms `--apply`. Rematerialize. Start Dallas 48113. Start Tarrant 48439.

## leave_behind

- Commit Wise artifacts + this review when Nick asks.
- Tranche-1 leftover farm is done. Eligible 33 / KEEP 33. Dallas 48113 and Tarrant 48439 stay skipped on this gate.
