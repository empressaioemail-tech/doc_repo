---
id: 2026-08-25_review_travis_48453_leftover
title: Adversarial review — P-78 Travis 48453 leftover (Texas fill #5)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Travis 48453 leftover

Apply is real. 48453 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Leftover landed on 2025. Declared 2026 counts unchanged in the filed census. Do not flip L17. Do not overlay 280238. Do not start Travis CAMA or P-80. KEEP the Path B insert and the acres fill.

CAPCOG leftover for the named five is complete: Caldwell, Bastrop, Hays, Williamson, Travis.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_travis_48453_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet still has the before census (2025 n=0, 2026 492848/0/441047). `inspectReadSet=false`. `willFlipL17=false`.

Log is `--county=48453` only. Vintage was quoted: `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48453_lp`. Writer SHA claimed `46e1a5a1` on `P:/tmp/ldt-p78-bastrop`. No fallback flag.

After JSON 2026 row matches before JSON bit for bit: 492848 / 0 / 441047.

2025 after: n=380918, year_built=0, land_acres=380918. Path B insert. prop_id `0` @ 2025 = 1, named not success.

Pre-write queue check matches KEEP n: 48055 24989, 48021 77799, 48209 172116, 48491 282570.

## Accept

- Named FIPS 48453 leftover only. Not P-80. Not 280238 overlay. Not CAMA.
- Path announced as B because leftover year n was 0. After n=380918 is a new-year insert.
- 834936 rows read, 380918 parsed, 454018 duplicate prop+year in the zip, 0 skipped, 380918 upserted. After n matches upserted.
- No inspect probe. Correct. Leftover year ≠ L17. 280238 not probed.
- Announce kept Path B before write. Packet kept the before census. After counts were added to the announce later (same hold as Hays, not a reject).

## year_built 0 at both years

2026 already had year_built 0 before this apply. Leftover 2025 also has year_built 0. STAT_LAND_ present = 0.

Mechanism: this StratMap land-use drop has no parseable `YEAR_BUILT` for the writer, same shape as Williamson 202507 leftover. Rejected alternative: leftover wiped 2026 years. 2026 n/yb/la are unchanged, and 2026 yb was already 0.

Do not replay Travis leftover to chase year_built. Structural inspect at declared 2026 is unchanged. P-80 / CAMA are later named cards.

## Hold (not a reject)

Announce line says "TxGIO StratMap 202503 zip". Log DBF is `stratmap25-landparcels_48453_travis_202508`. Drop id in vintage is correct. Next announce should name the DBF year from the zip, not copy 202503.

I did not re-query cortex. 2026-unchanged and dest identity are accepted from the filed before/after pair, not from a second derivation this session.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Overlay 280238. Start P-80 or Travis CAMA. Rewrite 48055 / 48021 / 48209 / 48491. Restore gold 2800. Atoms `--apply`. Rematerialize. Dallas / Tarrant leftover.

## leave_behind

- Commit Travis artifacts + this review when Nick asks.
- Next leftover FIPS is mechanical: **48013 Atascosa**. Registry L17 is null. Do not invent a flip.
- Gold 34137 living_area restore remains later.
