---
id: 2026-08-25_review_rockwall_48397_leftover
title: Adversarial review — P-78 Rockwall 48397 leftover (Texas fill #30)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Rockwall 48397 leftover

Apply is real. 48397 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Parker-shaped 202507 drop). STAT_LAND_ was blank on every parsed row. One key still null acres, named. Do not replay.

CAD REST honest_absent was not a leftover stop. StratMap zip wrote.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_rockwall_48397_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48397` only. Vintage quoted. DBF year in zip is 202507. 52739 read, 52420 parsed, 319 dupes, 0 skipped, 52420 upserted in 29.2s. After n matches upserted. Land-use present 0 of 52420.

After JSON: 2025 n=52420 / yb=0 / la=52419. No 2026 row. Null-acres keys: `69836`.

Dest identity live at 2026-08-25T22:10:10.305Z: prior twenty-nine KEEP n hold, including Parker 92583.

prop_id `0` @ 2025 = 0, named not success.

## Accept

- Named FIPS 48397. Not a Parker rewrite.
- Path B greenfield. Acres on 52419 of 52420. Years 0 of 52420.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- County CAD REST absence did not stop leftover.
- One null-acres key named. Same shape as Johnson leftover, not a HOLD.
- Blank STAT_LAND_ is the drop, not a failed apply.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 is the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built or the one null-acres key. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Rockwall artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48425 Somervell**. Registry L17 is null. Derive path from census. Do not flip L17.
