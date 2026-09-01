---
id: 2026-08-25_review_fayette_48149_leftover
title: Adversarial review — P-78 Fayette 48149 leftover (Texas fill #15)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Fayette 48149 leftover

Apply is real. 48149 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert. Years and acres both moved. Do not replay.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_fayette_48149_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48149` only. Vintage quoted. DBF year in zip is 202503. 23884 read, 22432 parsed, 1243 dupes, 209 skipped (no Prop_ID / no TAX_YEAR; skip samples are no Prop_ID), 22432 upserted in 13.9s. After n matches upserted.

After JSON: 2025 n=22432 / yb=12014 / la=22432. No 2026 row.

Dest identity live this session (`scripts/p78-leftover-dest-identity.mjs` self-test PASS, then live PASS at 2026-08-25T20:40:02Z): prior fourteen KEEP n hold, Fayette 22432.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48149. Not an Ellis rewrite.
- Path B greenfield. Acres on every new key. Years on 12014 of 22432 (Atascosa-shaped 202503 drop).
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- 209 skips are missing Prop_ID. Named in the log. Not a second FIPS.

Rejected alternative: the writer never ran. n, year, and acres all moved from empty.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Fayette artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48163 Frio**. Registry L17 is null. CAD REST is honest_absent; leftover still uses StratMap. Derive path from census. Do not flip L17.
