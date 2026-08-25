---
decision_id: 2026-08-24_write_path_data_capture_order
date: 2026-08-24
owner: Nick (operator), recorded by planner
status: active
related_canonical:
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
  - _decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# Decision

Parcel public-facts work executes in write-path dependency order. Independent bind cards and already-staged read paths go first. CAMA, REST harvest, footprint atom drain, and Travis join fix go last. The game plan at `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md` is the execution instrument. Phase 2 and feasibility §6 no longer sequence ingest.

## Context

Three sequences were live (Phase 2 stack, feasibility §6 effort-tier, canvas roadmap-fit) and they disagreed. Operator asked for write-path order: no-dependency quick wins first, heavy dependencies last. Four read-only probes then falsified parts of the 2026-08-24 effort-tier list: StratMap values already land via `stratmap-landuse`; L20 291k is zoning not footprint; city limits is not ETJ; REST harvest has no writer; CAMA last-upsert-wins.

This refines decision 6 in `_decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md`. Map-before-ingest (A3) and backfill-as-24/7 still stand. The "low-hanging" list changes: city-limits PIP and who-serves read stay front; footprint drain moves to heavy; CAMA stays A-017 backfill and may not start before the authority rule.

**Ruling 3 narrowed, not closed.** P-76 is the city-limits adapter (incorporated / unincorporated). The ETJ adapter remains approved and **deferred**: no statewide ETJ layer exists, so the product ships `unresolved` until a derivation card is scoped. P-76 must not be graded as closing ruling 3.

## Structural commitment check

- Sell reasoning, not data: honest lookup-failed and unresolved ETJ over silent thin cards.
- Confidence earned: store sqft % measured after CAMA, not asserted.
- Cost per jurisdiction: reuse existing CLIs (boundary, stratmap-landuse, cad-ingest) before new writers.
- Dual interface: who-serves and city-limits are serve paths first, atoms later if ever.

## Reasoning

A write that lands on the wrong join, or that clobbers a StratMap legal line with a CAMA row that has no legal, is the cleanup debt A3 exists to stop. Bind cards (situs sentinel, who-serves PIP, city-limits PIP, Travis honest miss) do not create that debt and unblock the report. Dallas/Tarrant CAMA is independent of the Travis join and still needs the authority rule. Footprint is a 10.67M slotted drain and was mis-ranked because L20 zoning counts were copied onto the wrong family.

## Reversal criteria

Operator approved the write-path WDLL 2026-08-24 for Wave 1 (P-75, P-76) via A-027. Verification_pending cleared.

- Operator rejects a later wave, in which case that wave stays held and no P-25 / P-09 dispatch starts.
- A paying customer makes a Wave 6 item a launch blocker, in which case that item jumps by a new amendment, not by drift.
- Code read shows `upsertCadProperties` already preserves unpopulated fields, in which case P-78 item 1 shrinks to a test that locks the behavior.

## Dependencies

Depends on: 2026-08-24 feasibility rulings 3-7, A-017, A-022, A-012.4 superseded for who-serves read by ruling 4.
Unlocks: P-73 through P-80, Phase 2 execution-order rewrite.
