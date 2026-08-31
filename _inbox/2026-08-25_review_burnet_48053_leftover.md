---
id: 2026-08-25_review_burnet_48053_leftover
title: Adversarial review — P-78 Burnet 48053 leftover (Texas fill #10)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Burnet 48053 leftover

Apply is real. 48053 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert. Years and acres both moved. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_burnet_48053_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48053` only. Vintage quoted. DBF year in zip is 202503. 50138 read, 49243 parsed, 895 dupes, 0 skipped, 49243 upserted in 30.4s. After n matches upserted. STAT_LAND_ present 27524.

After JSON: 2025 n=49243 / yb=24607 / la=49243. No 2026 row.

Dest identity live this session (`scripts/p78-leftover-dest-identity.mjs` self-test PASS, then live PASS at 2026-08-25T20:02:06Z): prior nine KEEP n hold, Burnet 49243.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48053. Not a Blanco rewrite.
- Path B greenfield. Acres on every new key. Years on 24607 of 49243 (Atascosa-shaped 202503 drop, not Bandera-shaped).
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.

Rejected alternative: the writer never ran. n, year, and acres all moved from empty.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Burnet artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48085 Collin**. Registry L17 is **2025 / stratmap-roll**. Leftover 2025 may be on the inspect read set. Derive path from census. Do not flip L17.
