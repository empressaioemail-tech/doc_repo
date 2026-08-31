---
id: 2026-08-25_review_blanco_48031_leftover
title: Adversarial review — P-78 Blanco 48031 leftover (Texas fill #9)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Blanco 48031 leftover

Apply is real. 48031 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. Do not replay to chase year_built.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_blanco_48031_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48031` only. Vintage quoted. DBF year in zip is 202503. 14269 read, 13648 parsed, 621 dupes, 0 skipped, 13648 upserted in 8.7s. After n matches upserted.

After JSON: 2025 n=13648 / yb=0 / la=13648. No 2026 row.

Dest identity live this session (`scripts/p78-leftover-dest-identity.mjs` self-test PASS, then live PASS at 2026-08-25T19:57:10Z): prior eight KEEP n hold, Blanco 13648.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48031. Not a Bexar rewrite.
- Path B greenfield. STAT_LAND_ present = 0. Acres on every new key.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.

## year_built 0

Same leftover-year shape as Bandera 202503: acres on every new key, no parseable year. Rejected alternative: the writer never ran. n and acres both moved from empty.

Do not replay Blanco.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Blanco artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48053 Burnet**. Registry L17 is null. Derive path from census. Do not flip L17.
