---
id: 2026-08-25_review_frio_48163_leftover
title: Adversarial review — P-78 Frio 48163 leftover (Texas fill #16)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Frio 48163 leftover

Apply is real. 48163 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent. KEEP the Path B insert and the acres fill. year_built stayed 0 (Bandera-shaped 202505 drop). Do not replay to chase years.

CAD REST honest_absent was not a leftover stop. StratMap zip wrote.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_frio_48163_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48163` only. Vintage quoted. DBF year in zip is 202505. 13214 read, 12489 parsed, 725 dupes, 0 skipped, 12489 upserted in 7.6s. After n matches upserted.

After JSON: 2025 n=12489 / yb=0 / la=12489. No 2026 row.

Dest identity live at 2026-08-25T20:43:30.460Z: prior fifteen KEEP n hold, including Fayette 22432.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48163. Not a Fayette rewrite.
- Path B greenfield. Acres on every new key. Years 0 of 12489. Same drop shape as Bandera / Comal / Ellis.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- County CAD REST absence did not stop leftover.

Rejected alternative: the writer never ran. n and acres moved from empty. year_built 0 is the drop, not a failed apply.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026 to chase year_built. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Frio artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48171 Gillespie**. Registry L17 is null. Derive path from census. Do not flip L17.
