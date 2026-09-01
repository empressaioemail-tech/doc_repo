---
id: 2026-08-25_review_atascosa_48013_leftover
title: Adversarial review — P-78 Atascosa 48013 leftover (Texas fill #6)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Atascosa 48013 leftover

Apply is real. 48013 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Greenfield insert @ 2025. Registry L17 still null. 2026 still absent on store. KEEP the Path B insert, acres, and the year_built fill.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_atascosa_48013_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet filed leftover 2025 n=0 and declared 2026 n=0 as absent years. `inspectReadSet=false`. `willFlipL17=false`. `declared.tier` is null. That matches the registry.

Log is `--county=48013` only. Vintage quoted: `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48013_lp`. DBF year in zip is 202503, named in announce and after JSON. Writer claimed `46e1a5a1` on `P:/tmp/ldt-p78-bastrop`. No fallback flag.

After JSON has one year: 2025 n=34649 / yb=19709 / la=34649. No 2026 row. That is absent, not a fabricated zero.

Pre-write queue check matches KEEP n: 48055 24989, 48021 77799, 48209 172116, 48491 282570, 48453 380918.

prop_id `0` @ 2025 = 1, named not success.

## Accept

- Named FIPS 48013. First post-CAPCOG leftover. Not a CAPCOG rewrite.
- Path B because leftover year n was 0 and the county had no rows at any year.
- 36796 read, 34649 parsed, 2132 dupes, 15 skipped, 34649 upserted. After n matches upserted.
- Registry L17 not flipped. Inspect probe skipped because L17 is undeclared. Correct.
- Announce named the DBF year from the zip (202503). That was the Travis hold.

## year_built 19709 on a Path B insert

This leftover actually wrote years. Acres filled every new key (34649/34649). STAT_LAND_ present = 19728.

Mechanism: the 202503 Atascosa drop has parseable `YEAR_BUILT` on a subset and acres on all parsed rows. Rejected alternative: the writer never ran. n, yb, and la all moved from a greenfield empty county.

Do not replay Atascosa. Do not flip L17 so 2025 looks like the live roll. A later named card may declare a vintage after leftover is meant to become it. That card is not this apply.

## Do not

DELETE the 2025 rows. Flip L17 / write `current_tax_year` onto `tx-48013`. Replay onto 2026. Rewrite the KEEP set. Atoms `--apply`. Rematerialize. Dallas / Tarrant leftover.

## leave_behind

- Commit Atascosa artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48019 Bandera**. Registry L17 is also null. Same packet shape as Atascosa.
- Gold 34137 living_area restore remains later.
