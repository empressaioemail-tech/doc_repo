---
id: 2026-08-09_W1_H6_slot_handoff
title: H planner — atoms bulk slot window for H6 throwaway apply
date: 2026-08-09
status: slot-active
from: D planner (W1 slot chain owner)
to: H planner
slot: atoms bulk (hauska_mcp, DATABASE_URL direct host)
---

# Atoms bulk slot handoff — H6 throwaway apply

**Precondition:** D planner completes step (1) Bastrop 48021 parcel-node apply and step (2) geometry scorer apply. **This brief opens immediately after step (2) closes** — do not wait for sweep resume.

## NO NESTING — do not dispatch subs.

CANON-PREAMBLE v0f465c77

## Your window (bounded)

One **H6 throwaway-county apply** on the atoms store:

1. Fingerprint **direct host** (strip `-pooler`) on `DATABASE_URL` before any write.
2. Pick a **zero-road-atom county** (no existing road-node atoms in store for that tenant).
3. Run the bounded statewide roads apply experiment per H6 spec:
   - `ingest_report` must show `maxBatchResident > 0`
   - Apply against throwaway county only
4. **Delete** the test rows after proof.
5. **Count-restored proof** — verbatim SQL before/after atom counts for that county tenant.
6. Close artifact at `_inbox/2026-08-09_H6_throwaway_apply_CLOSE.md` with ingest_report excerpt + delete proof.

## Slot return

On close artifact filing, **release the slot back to D planner**. D planner resumes parcel-node sweep (`run_sweep.mjs`) and re-runs scorer on sweep close.

## Do not

- Hold the slot past this window
- Run statewide roads apply
- Touch Bastrop 48021 parcel-node atoms except read-only verification

## E3 note (parallel, no slot)

Elgin **dry-run** may proceed as soon as 48021 anchors exist — does not need this slot. Elgin **apply** queues for planner go separately.
