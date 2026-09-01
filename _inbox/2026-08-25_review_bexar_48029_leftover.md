---
id: 2026-08-25_review_bexar_48029_leftover
title: Adversarial review — P-78 Bexar 48029 leftover (Texas fill #8)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Bexar 48029 leftover

Apply is real. 48029 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path A, leftoverN=703258. In-place update @ 2025. n unchanged. year_built and land_acres filled. Registry L17 stays 2025 / stratmap-roll. KEEP the Path A fill. Do not flip L17. Do not replay to chase living area.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_bexar_48029_packet.json` PASS. `derivedPath=A`. `leftoverN=703258`. `inspectReadSet=true`. `willFlipL17=false`. Writer `P:/tmp/ldt-p78-bastrop` HEAD `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`.

Log is `--county=48029` only. Vintage quoted. DBF in zip is 202507. 709541 read, 703258 parsed, 6283 dupes, 0 skipped, 703258 upserted in 312.1s.

After JSON: 2025 n=703258 / yb=619203 / la=703258. Delta n=0, yb=+619203, la=+703258. No other tax_year row.

Dest identity live this session (`scripts/p78-leftover-dest-identity.mjs --self-test` PASS, then live PASS at 2026-08-25T19:49:47Z): Caldwell 24989, Bastrop 77799, Hays 172116, Williamson 282570, Travis 380918, Atascosa 34649, Bandera 32755, Bexar 703258.

Live inspect this session on `https://smartsite.cloud/api/spine/property-atoms/48029%3A262160/facets`: `structuralFact.yearBuilt=1999`, `taxYear=2025`, `tier=stratmap-roll`, `sourceVintage` matches packet, `livingAreaSqft=null`. Store land_acres on that key is 1.7619. Not gold. Not 48021:34137. Not 48453:280238.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48029. Not a Bandera rewrite.
- Path A in-place. n held. Acres on every leftover key. Years on 619203 of 703258.
- Registry L17 not flipped. Inspect probe required and filed. Year is on the inspect wire.

## livingAreaSqft null

StratMap leftover does not restore sqft. Same leftover-year shape as Williamson / Travis / Bandera acres-without-sqft. Rejected alternative: the writer never ran. n held and acres and year both moved from 0.

Do not replay Bexar for sqft.

## Do not

DELETE the 2025 rows. Flip L17. Rewrite the KEEP set. Atoms `--apply`. Rematerialize.

## leave_behind

- Commit Bexar artifacts + this review when Nick asks.
- Operator ruling 2026-08-25: leftover farm is planner-owned after this KEEP. Next FIPS is Blanco **48031**. Registry L17 null. Derive path from census. Do not flip L17.
