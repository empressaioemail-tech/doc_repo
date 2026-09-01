---
id: 2026-08-25_review_kerr_48265_leftover
title: Adversarial review — P-78 Kerr 48265 leftover (Texas fill #25)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Kerr 48265 leftover

Apply is real. 48265 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Hood-shaped 202503 drop). STAT_LAND_ was blank on every parsed row. Do not replay to chase years or land-use codes.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_kerr_48265_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48265` only. Vintage quoted. DBF year in zip is 202503. 36913 read, 34594 parsed, 2319 dupes (same prop+year in file), 0 skipped, 34594 upserted in 20.2s. After n matches upserted. Land-use present 0 of 34594.

After JSON: 2025 n=34594 / yb=0 / la=34594. No 2026 row. Null-acres keys: none.

Dest identity live at 2026-08-25T21:41:06.793Z: prior twenty-four KEEP n hold, including Kendall 28852.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48265. Not a Kendall rewrite.
- Path B greenfield. Acres on every new key. Years 0 of 34594.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- Blank STAT_LAND_ is the drop, not a failed apply.
- 2319 duplicate rows are same prop+year in the zip. Named in the log. Not a second FIPS.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 is the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Kerr artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48287 Lee**. Registry L17 is null. Derive path from census. Do not flip L17.
