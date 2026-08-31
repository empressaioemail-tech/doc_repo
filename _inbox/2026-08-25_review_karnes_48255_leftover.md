---
id: 2026-08-25_review_karnes_48255_leftover
title: Adversarial review — P-78 Karnes 48255 leftover (Texas fill #22)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Karnes 48255 leftover

Apply is real. 48255 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Bandera-shaped 202505 drop). Four keys still null acres, named. Do not replay.

CAD REST honest_absent was not a leftover stop. StratMap zip wrote.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_karnes_48255_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48255` only. Vintage quoted. DBF year in zip is 202505. 14453 read, 12397 parsed, 2056 dupes, 0 skipped, 12397 upserted in 8.5s. After n matches upserted. STAT_LAND_ present on 12328 of 12397.

After JSON: 2025 n=12397 / yb=0 / la=12393. No 2026 row. Null-acres keys: `102924`, `62592`, `65000`, `67036`.

Dest identity live at 2026-08-25T21:18:56.834Z: prior twenty-one KEEP n hold, including Johnson 100603.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48255. Not a Johnson rewrite.
- Path B greenfield. Acres on 12393 of 12397. Years 0 of 12397.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- County CAD REST absence did not stop leftover.
- Four null-acres keys named. Same shape as Denton / Johnson leftover, not a HOLD.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 is the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built or the four null-acres keys. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Karnes artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48257 Kaufman**. Registry L17 is 2025 / stratmap-roll. Leftover 2025 may be on inspect. Derive path from census. Do not flip L17.
