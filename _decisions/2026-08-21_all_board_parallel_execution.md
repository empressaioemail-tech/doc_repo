---
decision_id: 2026-08-21_all_board_parallel_execution
date: 2026-08-21
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-18c_parallel_execution
  - 90_operations/OPS-18a_path_to_smartsite_market
  - 90_operations/OPS-18b_data_remediation_plan
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _inbox/2026-08-21_ops18_all_board_WDLL.md
  - _decisions/2026-08-21_sellable_is_cc_heartbeat_and_atoms_on_parcels.md
  - _decisions/2026-08-17_qa_launch_current_map.md
---

# Decision

All remaining SmartSite and Texas-flush work is on the board and runs as four parallel teams (SERVE, COVER, IDENT, GOV). Sellable remains heartbeat plus atoms on parcels. It is not program complete. Wave A `--apply` was in; operator 2026-08-22 parked COVER fill in favor of SERVE + IDENT + DC-3 instrument (`_decisions/2026-08-22_serve_ident_then_background_cover.md`). Harris PBF stays out. Owner-fact is identified inspect only. Honest-absent stays held until the verified-absence pair is ruled against L7.

## Context

Sellable WDLL items 1 through 6 (heartbeat plus flood and land-use inspect for in-scope families) met on 2026-08-21. Operator rejected treating that as OPS-18 or OPS-18a done. HOLD families, DC-2/3/6, Wave C identity, and R-06 remain. The sellable decision had blocked new ingest factories as sellable work. This decision keeps that definition of sellable and puts the remaining ingest and serve work on a separate card (OPS-18c).

## Structural commitment check

Sell reasoning, not data: aligned. SERVE shows stored atoms on the parcel with provenance. COVER fills rails the launch DCs still fail.

Confidence earned, not asserted: aligned. Geometry `48135` may not be scored against the retired 3791. Absence may not be minted without the pair.

Cost per jurisdiction: aligned. No new onboarding factory. Statewide apply uses existing writers.

Dual interface: partial. SmartSite stays UI-first. MCP retrofit is not this board.

## Reasoning

Four write-paths cannot share one lane without idle time. Cortex fact-read PRs parallelize. PE inspect serializes. Atoms `--apply` is one slot, so COVER holds it and SERVE does not write. Identity backfill on 100 million rows during COVER would recreate the A2 rogue shape. Governance that is not armed is the defect class OPS-18 exists to kill; folding it into SERVE would make R-06 a comment on a PE PR.

S7 owner on anonymous inspect is privileged-data shaped even when the source is public CAD. Identified session is the consumer. A2 executed without the pair would close DC-3 with the Q5d bypass.

## Reversal criteria

Reverse the four-team split if one seat is idle for a full working day while blocked on another. Reverse Wave A `--apply` in if a named QA session shows current-map inspect is the only paid motion this quarter. Reverse S7 identified-only if a named legal review says anonymous public CAD owner display is required. Reverse A2 hold when the operator rules L7 facet-only versus the pair. Do not reverse A-017 Harris PBF. Do not reverse one-slot `--apply`.

## Dependencies

Depends on: OPS-16 A-021 adding P-48 through P-56; program WDLL approved this date; land-use pair live as the SERVE pattern. Blocks: compiling SERVE/COVER/IDENT/GOV before those files exist. Does not block: scoring `48135` after a named denom; SERVE PRs with no `--apply`.

## Counterparties

Internal. Operator owns the ruling. Property owns SERVE and COVER. Engine owns IDENT. Systems owns GOV. Integration compiles and deploys.
