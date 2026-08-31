---
id: 2026-08-25_review_ellis_48139_leftover
title: Adversarial review — P-78 Ellis 48139 leftover (Texas fill #14)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Ellis 48139 leftover

Apply is real. 48139 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. Do not replay to chase year_built or the one null-acres key.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_ellis_48139_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48139` only. Vintage quoted. DBF year in zip is 202507. 98803 read, 98150 parsed, 653 dupes, 0 skipped, 98150 upserted in 38.1s. After n matches upserted. STAT_LAND_ present = 0.

After JSON: 2025 n=98150 / yb=0 / la=98149. No 2026 row. One leftover key still has null acres. Named, not a failed apply.

Dest identity live this session (`scripts/p78-leftover-dest-identity.mjs` self-test PASS, then live PASS at 2026-08-25T20:34:13Z): prior thirteen KEEP n hold, Ellis 98150.

prop_id `0` @ 2025 = 0, counted not success.

## Accept

- Named FIPS 48139. Not a Denton rewrite.
- Path B greenfield. Acres on 98149 of 98150.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.

## year_built 0

STAT_LAND_ present = 0. Same leftover-year shape as Bandera / Comal: acres filled, no parseable year. Rejected alternative: the writer never ran. n and acres both moved from empty.

Do not replay Ellis.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Ellis artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48149 Fayette**. Registry L17 is null. Derive path from census. Do not flip L17.
