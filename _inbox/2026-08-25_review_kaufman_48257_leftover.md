---
id: 2026-08-25_review_kaufman_48257_leftover
title: Adversarial review — P-78 Kaufman 48257 leftover (Texas fill #23)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Kaufman 48257 leftover

Apply is real. 48257 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path A, leftoverN=93292. In-place fill @ 2025. n unchanged. L17 stays 2025 / stratmap-roll. KEEP year and acres. Do not replay. Do not flip L17.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_kaufman_48257_packet.json` PASS. `derivedPath=A`. `leftoverN=93292`. `inspectReadSet=true`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48257` only. Vintage quoted. DBF year in zip is 202503. 94680 read, 93292 parsed, 1247 dupes, 141 skipped (no Prop_ID; skip samples are no Prop_ID), 93292 upserted in 55.3s. After n matches upserted and matches before n.

After JSON: 2025 n=93292 / yb=69244 / la=93292. Delta n=0, yb +69244, la +93292. No other tax year.

Dest identity live at 2026-08-25T21:24:19.948Z: prior twenty-two KEEP n hold, including Karnes 12397.

Inspect probe ran because leftover year equals L17. `48257:10005` HTTP 200. structuralFact yearBuilt 1993, livingAreaSqft null. landAcres is not on the facet; store land_acres 1.2736. Same facet shape as Guadalupe leftover probe.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48257. Not a Karnes rewrite.
- Path A in-place. n held. Years and acres filled on existing keys.
- Registry L17 not flipped. Inspect probe used a Kaufman parcel, not a forbidden gold.
- livingAreaSqft null on inspect is leftover, not a gold HOLD.
- 141 skips are missing Prop_ID. Named in the log. Not a second FIPS.

Rejected alternative: the writer never ran. year_built and land_acres both moved from 0. n held, so this is not a greenfield insert.

## Do not

DELETE the 2025 rows. Flip L17. Replay. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Kaufman artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48259 Kendall**. Registry L17 is null. Derive path from census. Do not flip L17.
