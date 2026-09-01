---
id: 2026-08-25_review_denton_48121_leftover
title: Adversarial review — P-78 Denton 48121 leftover (Texas fill #13)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Denton 48121 leftover

Apply is real. 48121 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path A, leftoverN=351798. In-place update @ 2025. n unchanged. year_built and land_acres filled. Registry L17 stays 2025 / stratmap-roll. KEEP the Path A fill. Do not flip L17. Do not replay the nine keys that still have null acres.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_denton_48121_packet.json` PASS. `derivedPath=A`. `leftoverN=351798`. `inspectReadSet=true`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48121` only. Vintage quoted. DBF year in zip is 202503. 353705 read, 351798 parsed, 1907 dupes, 0 skipped, 351798 upserted in 203.1s.

After JSON: 2025 n=351798 / yb=300454 / la=351789. Delta n=0, yb=+300454, la=+351789. Nine leftover keys still have null land_acres. Named, not a failed apply.

Dest identity live this session (`scripts/p78-leftover-dest-identity.mjs` self-test PASS, then live PASS at 2026-08-25T20:28:23Z): prior twelve KEEP n hold, Denton 351798.

Live inspect this session on `https://smartsite.cloud/api/spine/property-atoms/48121%3A10/facets`: `structuralFact.yearBuilt=2000`, `taxYear=2025`, `tier=stratmap-roll`, `sourceVintage` matches packet, `livingAreaSqft=null`. Store land_acres 0.1555. Not gold.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48121. Not a Comal rewrite.
- Path A in-place. n held. Years on 300454. Acres on 351789 of 351798.
- Registry L17 not flipped. Inspect probe required and filed. Year is on the inspect wire.

## livingAreaSqft null and 9 null acres

StratMap leftover does not restore sqft. Nine keys without GIS_AREA is a drop residue, not a second county write. Rejected alternative: the writer never ran. n held and year and acres both moved from 0.

Do not replay Denton.

## Do not

DELETE the 2025 rows. Flip L17. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Denton artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48139 Ellis**. Registry L17 is null. Derive path from census. Do not flip L17.
