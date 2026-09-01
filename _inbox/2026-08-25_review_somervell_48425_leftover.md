---
id: 2026-08-25_review_somervell_48425_leftover
title: Adversarial review — P-78 Somervell 48425 leftover (Texas fill #31)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Somervell 48425 leftover

Apply is real. 48425 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Parker-shaped 202507 drop). Do not replay to chase years.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_somervell_48425_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48425` only. Vintage quoted. DBF year in zip is 202507. 6823 read, 6584 parsed, 239 dupes, 0 skipped, 6584 upserted in 4.2s. After n matches upserted. STAT_LAND_ present on 5859 of 6584.

After JSON: 2025 n=6584 / yb=0 / la=6584. No 2026 row. Null-acres keys: none.

Dest identity live at 2026-08-25T22:15:14.460Z: prior thirty KEEP n hold, including Rockwall 52420.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48425. Not a Rockwall rewrite.
- Path B greenfield. Acres on every new key. Years 0 of 6584.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 is the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Somervell artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48493 Wilson**. Registry L17 is null. Derive path from census. Do not flip L17.
