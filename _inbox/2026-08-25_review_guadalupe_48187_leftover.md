---
id: 2026-08-25_review_guadalupe_48187_leftover
title: Adversarial review — P-78 Guadalupe 48187 leftover (Texas fill #18)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Guadalupe 48187 leftover

Apply is real. 48187 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path A, leftoverN=93728. In-place fill @ 2025. n unchanged. L17 stays 2025 / stratmap-roll. KEEP year and acres. Do not replay. Do not flip L17.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_guadalupe_48187_packet.json` PASS. `derivedPath=A`. `leftoverN=93728`. `inspectReadSet=true`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48187` only. Vintage quoted. DBF year in zip is 202503. 95571 read, 93728 parsed, 1843 dupes, 0 skipped, 93728 upserted in 57.9s. After n matches upserted and matches before n.

After JSON: 2025 n=93728 / yb=69294 / la=93728. Delta n=0, yb +69294, la +93728. No other tax year.

Dest identity live at 2026-08-25T20:53:17.345Z: prior seventeen KEEP n hold, including Gillespie 31452.

Inspect probe ran because leftover year equals L17. `48187:106109` HTTP 200. structuralFact yearBuilt 1994, livingAreaSqft null. landAcres is not on the facet; store land_acres 1.0163. Same facet shape as Collin / Denton / Bexar leftover probes.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48187. Not a Gillespie rewrite.
- Path A in-place. n held. Years and acres filled on existing keys.
- Registry L17 not flipped. Inspect probe used a Guadalupe parcel, not a forbidden gold.
- livingAreaSqft null on inspect is leftover, not a gold HOLD. There is no Guadalupe living-area gold.

Rejected alternative: the writer never ran. year_built and land_acres both moved from 0. n held, so this is not a greenfield insert.

## Do not

DELETE the 2025 rows. Flip L17. Replay. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Guadalupe artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48221 Hood**. Registry L17 is null. Derive path from census. Do not flip L17.
