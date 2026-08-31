---
id: 2026-08-25_review_bandera_48019_leftover
title: Adversarial review — P-78 Bandera 48019 leftover (Texas fill #7)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Bandera 48019 leftover

Apply is real. 48019 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. Do not replay to chase year_built.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_bandera_48019_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`.

Log is `--county=48019` only. Vintage quoted. DBF year in zip is 202503, named in announce. Writer claimed `46e1a5a1` on `P:/tmp/ldt-p78-bastrop`. No fallback flag.

After JSON: 2025 n=32755 / yb=0 / la=32755. No 2026 row.

Pre-write queue check matches KEEP n including Atascosa 34649.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48019. Not an Atascosa rewrite.
- Path B greenfield. 33261 read, 32755 parsed, 506 dupes, 0 skipped, 32755 upserted. After n matches upserted.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.

## year_built 0

STAT_LAND_ present = 0. Same leftover-year shape as Williamson and Travis: acres on every new key, no parseable year. Rejected alternative: the writer never ran. n and acres both moved from empty.

Do not replay Bandera. Atascosa 202503 wrote years; this 202503 drop did not. That is a drop difference, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Bandera artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48029 Bexar**. Registry L17 is **2025 / stratmap-roll**. Leftover 2025 may be on the inspect read set. Derive path from census. Do not flip L17.
