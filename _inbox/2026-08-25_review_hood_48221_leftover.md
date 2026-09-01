---
id: 2026-08-25_review_hood_48221_leftover
title: Adversarial review — P-78 Hood 48221 leftover (Texas fill #19)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Hood 48221 leftover

Apply is real. 48221 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Bandera-shaped 202503 drop). STAT_LAND_ was blank on every parsed row. Do not replay to chase years or land-use codes.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_hood_48221_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48221` only. Vintage quoted. DBF year in zip is 202503. 51275 read, 50876 parsed, 399 dupes, 0 skipped, 50876 upserted in 30.7s. After n matches upserted. Land-use present 0 of 50876.

After JSON: 2025 n=50876 / yb=0 / la=50876. No 2026 row.

Dest identity live at 2026-08-25T20:59:34.888Z: prior eighteen KEEP n hold, including Guadalupe 93728.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48221. Not a Guadalupe rewrite.
- Path B greenfield. Acres on every new key. Years 0 of 50876.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- Blank STAT_LAND_ is the drop, not a failed apply.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 is the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Hood artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48231 Hunt**. Registry L17 is null. Derive path from census. Do not flip L17.
