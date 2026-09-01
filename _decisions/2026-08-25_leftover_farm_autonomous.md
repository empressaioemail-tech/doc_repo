---
decision_id: 2026-08-25_leftover_farm_autonomous
date: 2026-08-25
owner: Nick
status: active
related_canonical:
  - _inbox/2026-08-25_leftover_queue.md
  - _inbox/2026-08-25_wave_leftover_farm_handoff.md
  - _inbox/2026-08-25_texas_complete_wave_plan.md
  - _inbox/2026-08-25_cad_ingest_apply_gate_WDLL.md
---

## Decision

After Bexar 48029 leftover KEEP, the remaining tranche-1 leftover list is a planner-owned farm. The integration planner spawns one leftover-apply child at a time, reviews KEEP or HOLD, restamps the five family canvases, and starts the next FIPS without another operator hand-carry, until the remaining 25 counties are KEEP or the farm stops.

## Context

Through Bexar the operator ran leftover as one hand-carry prompt per county. That loop is complete for county 8. The remaining roster is mechanical from `_catalog/tx_cad_source_registry.json` (25 after Bexar KEEP). Nick ordered the planner to spawn agents, work the list one by one, manage review and canvases, and keep children running until that list is done.

Rejected alternative: keep asking Nick for each next prompt. That is what this ruling ends.

Rejected alternative: fan two leftover applies at once. The writer tree and dest-identity contract forbid it.

## Structural commitment check

Sell reasoning, not data: leftover is store hygiene, not a customer claim. Confidence earned: KEEP is packet re-PASS plus dest-identity plus before/after, not a merged PR. Cost per jurisdiction: leftover is slot-free StratMap upsert, not a new onboarding. Dual interface: not in scope.

## Reasoning

The gate, writer SHA pin, dest-identity instrument, and leftover queue already make one-FIPS leftover mechanical. The remaining risk is two writers or a silent L17 flip, not missing operator taste on each county. Planner-owned review after each close is the control. Manifest stays 667/3556 SNAPSHOT. Leftover does not deploy Cortex and does not take the atoms `--apply` slot.

## Reversal criteria

Stop the farm and return to hand-carry if dest identity fails, the writer SHA is not `46e1a5a1`, a packet fails, a child writes a second FIPS, L17 is flipped, Nick says stop, or a KEEP county needs DELETE or replay.

## Dependencies

Depends on Bexar 48029 KEEP. Downstream: Blanco 48031 then FIPS-ascending remainder. Does not unlock atoms `--apply`, rematerialize, Dallas 48113, Tarrant 48439, P-80, P-79, P-09, or COVER.

## Counterparties

Internal: Nick, integration planner, leftover apply children.
