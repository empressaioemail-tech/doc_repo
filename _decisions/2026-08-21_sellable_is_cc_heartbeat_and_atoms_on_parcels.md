---
decision_id: 2026-08-21_sellable_is_cc_heartbeat_and_atoms_on_parcels
date: 2026-08-21
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-18a_path_to_smartsite_market
  - 90_operations/OPS-18b_data_remediation_plan
  - _decisions/2026-08-17_qa_launch_current_map
  - _decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby
  - _decisions/2026-08-09_texas_flush_launch_gate
  - _decisions/2026-08-21_smartsite_gtm_via_structural_then_data
  - _inbox/2026-08-21_sellable_WDLL.md
  - 90_operations/OPS-18c_parallel_execution
  - _decisions/2026-08-21_all_board_parallel_execution.md
---

# Decision

Sellable means two things only: a live heartbeat on the Command Center County Manifest, and every property-spine atom we already store serving its parcel on the SmartSite frontend. Anything short of that is not sellable. No new data. Pipedrive tags, pricing popup, and Stripe amount rebuild are checkout polish. They are not the sellable gate.

## Context

OPS-18a step 6 had treated "sell on the current map" as GTM chrome (Pipedrive, popup, amounts). Texas flush still grades measured-everywhere on uniform rails (zero `not-yet`). Operator 2026-08-21 afternoon: that is the wrong definition of sellable. The product is sellable when Command Center shows a live ledger beat and SmartSite actually uses the atoms already in `hauska_mcp` on the parcels they belong to. New ingest (Harris PBF, statewide roads apply, new wells, minting absence) stays out.

## Structural commitment check

Sell reasoning, not data: aligned. We sell the atoms we have, on the parcel, with provenance. We do not sell a coverage percentage that the inspect card cannot show.

Confidence earned, not asserted: aligned. A ledger cell that scores `satisfied-present` while inspect reads a retired table is an unearned claim. Dual-grammar atoms that do not bind are unserved data, not a join footnote.

Cost per jurisdiction: aligned. No new onboarding. Identity and serve-path work on the existing store.

Dual interface: partial. SmartSite is the existing UI-first wedge. MCP retrofit stays a tracked item. This ruling does not add a catalog web UI.

## Reasoning

Command Center County Manifest is the operator-visible heartbeat of `GET /api/county-ledger`. Today the snapshot moves only when a planner POSTs recompute. L18 already recorded that the panel goes STALE after 15 minutes because scorers do not invoke materialize. A dead beat with a green GET from an hour ago is not live.

SmartSite inspect still SELECTs `place_layer_snapshots` for the node and refuses flood values (SS-W16), while 10M+ `flood-hazard-fact` atoms sit in the store. That is the defect class: atoms exist, the parcel page does not use them. R-07 Q8 measured the same shape on join: one fact in six does not bind its parcel. Serving "respective parcels" includes fixing that bind, not minting more rows.

Texas flush measured-everywhere remains the later launch claim (uniform rails terminal). Sellable is nearer and is serve-path complete for data we already have.

2026-08-21 evening: operator put remaining ingest and HOLD-family serve on OPS-18c. This decision still defines sellable. It no longer blocks Wave A `--apply` as program work. Harris PBF stays out. See `_decisions/2026-08-21_all_board_parallel_execution.md`.

## Reversal criteria

Reverse criterion 1 if Command Center is retired as the operator board and a named replacement panel is the heartbeat. Reverse criterion 2 if a named QA session proves a family is honestly not a SmartSite consumer (for example code-section stays Codex) and that HOLD is listed. Reverse "no new data" if a named inspect-card hole cannot be filled from existing atoms and the operator wants one bounded apply. Do not reverse back into DC-3 254/254 or Pipedrive-as-sellable.

## Dependencies

Depends on: live PE at `https://smartsite.cloud`; Command Center at `https://cmdcenter-blush.vercel.app`; serving cortex-api ledger GET. Blocks: treating OPS-18a step 6 GTM chrome as sellable. Does not block: scoring coverage for rails that already have atoms; geometry `48135` score after a named denom; inspect repoint to `flood-hazard-fact`; Wave A `--apply` under OPS-18c COVER.

## Counterparties

Internal. Operator owns the ruling. Property owns SmartSite inspect and County Manifest. Planner owns ledger recompute until a heartbeat executor exists.
