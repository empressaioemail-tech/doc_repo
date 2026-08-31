---
id: 2026-08-25_review_comal_48091_leftover
title: Adversarial review — P-78 Comal 48091 leftover (Texas fill #12)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Comal 48091 leftover

Apply is real. 48091 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path A, leftoverN=103207. In-place update @ 2025. n unchanged. land_acres filled. year_built stayed 0. Registry L17 stays 2025 / stratmap-roll. KEEP the Path A acres fill. Do not flip L17. Do not replay to chase year_built.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_comal_48091_packet.json` PASS. `derivedPath=A`. `leftoverN=103207`. `inspectReadSet=true`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48091` only. Vintage quoted. DBF year in zip is 202503. 103537 read, 103207 parsed, 330 dupes, 0 skipped, 103207 upserted in 40.0s. STAT_LAND_ present = 0.

After JSON: 2025 n=103207 / yb=0 / la=103207. Delta n=0, yb=0, la=+103207.

Dest identity live this session (`scripts/p78-leftover-dest-identity.mjs` self-test PASS, then live PASS at 2026-08-25T20:18:53Z): prior eleven KEEP n hold, Comal 103207.

Live inspect this session on `https://smartsite.cloud/api/spine/property-atoms/48091%3A10003/facets`: structuralFact status absent, verdict absent-verified, yearBuilt null, livingAreaSqft null. Store land_acres on that key is 0.1771. Not gold. Not 48085:10000.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48091. Not a Collin rewrite.
- Path A in-place. n held. Acres on every leftover key.
- Registry L17 not flipped. Inspect probe required and filed.

## year_built 0

STAT_LAND_ present = 0. Same leftover-year shape as Williamson / Travis / Bandera: acres filled, no parseable year. Rejected alternative: the writer never ran. n held and acres moved from 0.

Do not replay Comal.

## Do not

DELETE the 2025 rows. Flip L17. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Comal artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48121 Denton**. Registry L17 is **2025 / stratmap-roll**. Leftover 2025 may be on the inspect read set. Derive path from census. Do not flip L17.
