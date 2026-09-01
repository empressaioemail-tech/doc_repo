---
id: 2026-08-25_review_williamson_48491_leftover
title: Adversarial review — P-78 Williamson 48491 leftover (Texas fill #4)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 9753b83; claimed writer 46e1a5a1
---

# Review: Williamson 48491 leftover

Apply is real. 48491 only. Packet re-PASS this session with `ldtSha=46e1a5a1`, derived Path B, leftoverN=0. Leftover landed on 2025. Declared 2026 counts unchanged in the filed census. Do not flip L17. Do not rewrite Williamson to chase year_built. KEEP the Path B insert and the acres fill.

## Verified this session

`node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_williamson_48491_packet.json` PASS. `derivedPath=B`. `leftoverN=0`. Packet still has the before census (2025 n=0, 2026 319480/245450/100813). `inspectReadSet=false`. `willFlipL17=false`.

Log is `--county=48491` only on both passes. No fallback flag. Writer SHA `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`. Worktree `P:/tmp/ldt-p78-bastrop`.

After JSON 2026 row matches before JSON bit for bit: 319480 / 245450 / 100813.

2025 after: n=282570, year_built=0, land_acres=282570. Path B insert. prop_id `0` = 0.

Announce kept the before census. Packet kept the before census.

## Accept

- Named FIPS 48491. Not gold. Not Caldwell / Bastrop / Hays rewrite. Not Travis / Dallas / Tarrant.
- Path announced as B because leftover year n was 0. After n=282570 is a new-year insert, not a Path A in-place.
- Writer claimed detached `46e1a5a1`. Directory name is leftover from county 2. SHA is the control.
- No inspect probe. Correct. Leftover year ≠ L17.
- Scope locks in the close match the handoff.
- [Leftover apply](3093c81d-30e1-43dd-b823-7c9c820ccd26) stopped. No second FIPS.

## year_built delta 0 on a Path B insert

Every new 2025 row has acres and none has year_built. Log: STAT_LAND_ present = 0. Drop name in the zip is 202507.

Mechanism: this leftover year had no parseable `YEAR_BUILT` in the StratMap land-use fields the writer reads. Acres came through. Rejected alternative: the writer never ran. n and acres both moved 0 → 282570, and the log upserted 282570 on the first pass and again on the quoted restamp.

Do not replay Williamson. Do not treat year_built 0 as a failed leftover. The leftover that landed is keys plus acres, off the inspect read set.

## Vintage restamp (not a reject)

First PowerShell pass split `--vintage` on `;`. CLI received `tier:stratmap-roll` only. Same-session quoted restamp wrote `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48491_lp`. After JSON names that string as `sourceVintage2025`. n/yb/la did not change on restamp.

Farm children must quote the vintage argument. Unquoted `;` is a PowerShell statement separator. That is a process lesson, not a store reject.

I did not re-query cortex. 2026-unchanged and dest identity (Caldwell 24989 / Bastrop 77799 / Hays 172116 at 2025) are accepted from the filed before/after pair, not from a second derivation this session.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite 48055 / 48021 / 48209. Restore gold 2800. Atoms `--apply`. Rematerialize. Dallas / Tarrant / Travis CAMA. Start Travis leftover from this review session.

## leave_behind

- Commit Williamson artifacts + this review when Nick asks.
- County 5 is Travis leftover only. Handoff `_inbox/2026-08-25_county5_travis_48453_handoff.md`. Farm steward `_inbox/2026-08-25_wave_leftover_farm_handoff.md`. Quote `--vintage`.
- Gold 34137 living_area restore remains later.
