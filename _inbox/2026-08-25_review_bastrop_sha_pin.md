---
id: 2026-08-25_review_bastrop_sha_pin
title: Adversarial review — Bastrop announce amend + ldtSha pin + close
date: 2026-08-25
status: filed
plan_row: P-78
author: integration reviewer
snapshot: doc_repo main 2526bc9; pin still uncommitted on this tree
---

# Review: handback items 1–3

All three items are met. Pin is real. County 3 is still blocked until this pin is committed. Do not start it from a dirty tree.

## Verified this session

`--self-test` PASS F1–F10.

`--check --packet` F10 exit 1. Failures: only `ldtSha 10069854 does not match serving writer 46e1a5a1`. Path A otherwise honest. That is the violation the card asked for.

Bastrop packet with `ldtSha=46e1a5a1` PASS.

Same packet with `ldtSha` deleted: FAIL `ldtSha missing`.

## Accept

1. Announce names Path A plus 726 new keys, both logs, KEEP year/acres, HOLD gold living area, cites the 34137 probe.
2. `SERVING_LDT_SHA` is `46e1a5a1`. Missing and wrong SHA refuse. F2 / F3 / template carry the pin. F10 is a meaning-shaped fail (wrong SHA on an otherwise legal Path A packet).
3. Close KEEP / HOLD / leave_behind match the review. County 3 and gold sqft restore are not started.

## Hold (not a reject)

Exact string match refuses the full serving SHA `46e1a5a1b52a…`. Verified this session: that packet exits 1. The handback asked for `46e1a5a1`. The pin matches that contract. A later packet that pastes `git rev-parse` will fail until they shorten it. Widen only if a later card says so. Do not treat a full-SHA refuse as a broken pin.

F10 uses `10069854`. That string is the stale LDT checkout in `_inbox/2026-08-24_p78_cad_property_merge_SPEC.md`. It is not independently verified as the hardening-branch tip. The fixture still proves a non-serving SHA fails.

Factory operating instructions still do not name `ldtSha`. The instrument is the control. Add one sentence when this pin commits so the next leftover agent does not copy a packet without the field.

## Do not

County 3 from this dirty tree. Gold sqft restore. DELETE. L17 flip. Caldwell rewrite. Dallas / Tarrant / Travis CAMA. Atoms `--apply`. Rematerialize. Raise the memory pin.

## leave_behind

- Commit the pin + announce + close + this review. After that commit, county 3 may open a packet. Not before.
- Gold 34137 living_area restore remains a later card (CAMA or backup).
- Optional: one sentence on `ldtSha` in `_inbox/2026-08-25_factory_operating_instructions.md` in the same commit.
