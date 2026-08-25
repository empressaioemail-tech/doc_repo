---
id: 2026-08-25_review_hays_48209_leftover
title: Adversarial review — P-78 Hays 48209 leftover (Texas fill #3)
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main d52ddc0; claimed writer 46e1a5a1
---

# Review: Hays 48209 leftover

Apply is real. 48209 only. Packet PASSed with `ldtSha=46e1a5a1`. Leftover stayed on 2025. Declared 2026 counts unchanged in the filed census. Do not flip L17. Do not rewrite Hays to chase year_built. KEEP the acres fill.

## Verified this session

`--check --packet _inbox/2026-08-25_p78_announce_hays_48209_packet.json` PASS. Derived Path A. leftoverN=131246. Packet lists both 2025 and 2026. `inspectReadSet=false`. `willFlipL17=false`.

Log is `--county=48209` only. Structured vintage stamped. 117427 read, 116421 parsed, 926 dupes, 80 skipped, 116421 upserted. No fallback flag. No second FIPS.

After JSON 2026 row matches before JSON bit for bit: 134606 / 85489 / 68869.

## Accept

- Named FIPS 48209. Not gold. Not Caldwell rewrite. Not Travis / Dallas / Tarrant.
- Path announced as Path A plus 40870 new keys @ 2025. That matches n 131246 → 172116.
- Writer claimed `P:/tmp/ldt-p78-bastrop` at `46e1a5a1`. Directory name is leftover from county 2. SHA is the control.
- No inspect probe. Correct. Leftover year ≠ L17.
- prop_id `0` @ 2025 = 1, named not success.
- Scope locks in the close match the handoff.

## year_built delta 0

82120 before and after at 2025. Acres 67231 → 144674 (+77443).

Mechanism: this drop filled acres on keys that lacked them, including most of the 40870 inserts. It did not add a parseable `YEAR_BUILT` on any row that was still null. The 82120 years were already on the leftover year. Rejected alternative: the writer never ran. Acres and n both moved, and the log upserted 116421.

Do not replay Hays. Do not treat unchanged year_built as a failed leftover. The leftover that landed is acres.

Log also reports STAT_LAND_ present = 0 on this zip. Land-use code was not this card.

## Hold (not a reject)

Announce now carries the after counts. The packet still has the before census. That is honest enough. Next county: keep after numbers out of the pre-apply announce.

I did not re-query cortex. 2026-unchanged is accepted from the filed before/after pair, not from a second derivation this session.

## Do not

DELETE the 2025 rows. Flip L17. Replay onto 2026. Rewrite Caldwell or Bastrop. Restore gold 2800. Atoms `--apply`. Rematerialize. Dallas / Tarrant / Travis CAMA. County 4 until this review is committed and a named FIPS is handed.

## leave_behind

- Commit Hays artifacts + this review.
- County 4 is a later named-FIPS card. Do not shop.
- Gold 34137 living_area restore remains later.
