---
id: 2026-08-25_bastrop_review_handback
title: Handback — Bastrop leftover review; SHA pin then stop
date: 2026-08-25
status: filed
plan_row: P-78
from: integration reviewer
to: leftover apply agent
---

# Handback: Bastrop 48021 leftover

Paste everything below the line into the other agent's session.

---

You already applied Bastrop 48021 leftover. Integration reviewed it. Do not start county 3. Do not restore gold sqft this card. Do not DELETE. Do not flip L17.

## Snapshot (re-verify)

- Integration `P:/doc_repo` `main` at the handback commit (parent of this file in git log). Declare your own seat, worktree, branch, commit.
- Review `_inbox/2026-08-25_review_bastrop_48021_leftover.md` is the authority for this card.
- Probe `_inbox/2026-08-25_p78_bastrop_48021_gold_34137_probe.json`. Live gold `48021:34137` `yearBuilt=1910`, `livingAreaSqft=null` (was 2800).
- Serving writer SHA is `46e1a5a1`. Cortex `cortex-api-00584-gaf`. PE #222 `9224a73` smartsite.cloud.
- P-25 / P-09 / COVER stay `ready:false`. Caldwell 48055 24989 @ 2025 untouched. Memory pin stays.

## Standing

Cotality extinguished. Deploys planner-owned. Public-record only. CTX/national held. Code-done is not customer-done. One atoms `--apply` slot. `ready:true` means already serving, not write-allowed.

## This card (do these three, then stop)

1. Amend `_inbox/2026-08-25_p78_announce_bastrop_48021.md` (and the close if you file one): Path A update plus 726 new keys @ 2025. Not a pure in-place merge. Name both logs: `_inbox/2026-08-25_p78_bastrop_48021_apply.log` (bad run on `feat/s1-instrument-hardening`) and `_inbox/2026-08-25_p78_bastrop_48021_apply_repair.log` (authoritative, detached `46e1a5a1`). KEEP year/acres. HOLD gold living area.

2. Pin writer SHA on `scripts/cad-ingest-apply-gate.mjs`. Packet field `ldtSha` must equal `46e1a5a1` (or the current serving merge if you re-verify it). Missing SHA fails. Other SHA fails. Add fixture F10 that fails a wrong SHA. `--self-test` both directions. Verify by violation: `--check --packet` on a packet with `ldtSha` of the hardening branch exits 1. A matching SHA still PASSes F2/F3-shaped packets after you add the field.

3. File `_inbox/2026-08-25_p78_bastrop_48021_leftover_close.json` grading this card. leave_behind: gold 34137 `living_area_sqft` restore is a later card that needs the CAMA export or a named backup. County 3 waits until the SHA pin is merged and `--self-test` PASSes.

## Do not

County 3 leftover. Dallas / Tarrant / Travis CAMA. L17 flip. Atoms `--apply`. Rematerialize. Rewrite Caldwell 24989. Invent a 2800 restore. Raise the memory pin. Re-implement the rest of the gate.

## Read first

`_STATE.md`, `MEMORY.md`, `_scratch/parcel-facts-write-path.md`, `_inbox/2026-08-25_review_bastrop_48021_leftover.md`, `_inbox/2026-08-25_factory_operating_instructions.md`.

When 1–3 are filed, stop for review again.
