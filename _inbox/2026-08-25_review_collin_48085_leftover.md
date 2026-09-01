---
id: 2026-08-25_review_collin_48085_leftover
title: Adversarial review — P-78 Collin 48085 leftover (Texas fill #11)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Collin 48085 leftover

Apply is real. 48085 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path A, leftoverN=387334. In-place update @ 2025. n unchanged. year_built and land_acres filled. Registry L17 stays 2025 / stratmap-roll. KEEP the Path A fill. Do not flip L17. Do not replay to chase living area.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_collin_48085_packet.json` PASS. `derivedPath=A`. `leftoverN=387334`. `inspectReadSet=true`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48085` only. Vintage quoted. DBF year in zip is 202503. 387738 read, 387334 parsed, 404 dupes, 0 skipped, 387334 upserted in 191.2s.

After JSON: 2025 n=387334 / yb=338301 / la=387334. Delta n=0, yb=+338301, la=+387334.

Dest identity live this session (`scripts/p78-leftover-dest-identity.mjs` self-test PASS, then live PASS at 2026-08-25T20:11:38Z): prior ten KEEP n hold, Collin 387334.

Live inspect this session on `https://smartsite.cloud/api/spine/property-atoms/48085%3A10000/facets`: `structuralFact.yearBuilt=1987`, `taxYear=2025`, `tier=stratmap-roll`, `sourceVintage` matches packet, `livingAreaSqft=null`. Not gold. Not 48021:34137. Not 48453:280238. Not 48029:262160.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48085. Not a Burnet rewrite.
- Path A in-place. n held. Acres on every leftover key. Years on 338301 of 387334.
- Registry L17 not flipped. Inspect probe required and filed. Year is on the inspect wire.

## livingAreaSqft null

StratMap leftover does not restore sqft. Same leftover-year shape as Bexar. Rejected alternative: the writer never ran. n held and acres and year both moved from 0.

Do not replay Collin for sqft.

## Do not

DELETE the 2025 rows. Flip L17. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Collin artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48091 Comal**. Registry L17 is **2025 / stratmap-roll**. Leftover 2025 may be on the inspect read set. Derive path from census. Do not flip L17.
