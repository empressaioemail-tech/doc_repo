---
decision_id: 2026-07-23_pe_envelope_atom_spine_and_post_map_truth_pickups
date: 2026-07-23
owner: nick
status: active
related_canonical:
  - _inbox/2026-07-21_property_explorer_v1_sprint_STATUS.md
  - _inbox/2026-07-23_pe_no_honest_empty_setbacks_WDLL_amendment.md
  - _inbox/2026-07-23_pe_map_truth_setbacks_handoff.md
  - _architecture_homes/05_scrub_tracker.md
  - _catalog/thesis_parity_ledger.md
  - 80_adrs/adr_008_engine_factor_out.md
---

## Decision

Grade PE setback **table population** (WDLL 51–53) as done and QA-ready; treat **envelope confidence** as a separate unfinished bar. Stop hard-hold setback deepening. Hold atomization of the zoning→setback→envelope chain until the spine/engine plan lands; author that family in **hauska-engine**, not cortex-api. Near-term in-place pickups only: durable Overpass remount, and honesty fix for absent-zoning conservative invent (Bexar null→I-2).

## Context

Planning feedback on `_inbox/2026-07-23_pe_map_truth_setbacks_handoff.md` after the no-honest-empty setback flight (#342–#349) landed. Tables cleared Central-TX empty jurisdiction debt. Envelope trust is still blocked by Overpass regression on tip and by absent-zoning invent at scale. Atomizing in `artifacts/api-server/.../buildableEnvelope/` would deepen reasoning into the reporting monolith that sprint 56 is meant to lift out of. Homes topology: atoms + reasoning belong in hauska-engine (spine).

## Structural commitment check

- Sell reasoning, not data: PASS (honesty declines and confidence grading over invent).
- Confidence is earned, not asserted: PASS directionally (3-axis asserted/calibrated path replaces bare labeling×district multiply; fallback must not stamp a real district as matched).
- Cost per jurisdiction: N/A.
- Dual interface / MCP-first: N/A for this pickup set; atom family later is MCP-facing via spine.
- Hauska spine rule: PASS (atom build routed to engine, not cortex product surface).

## Reasoning

Table population and invent-path fixes (#346/#347/#349) are the right bar for 51–53. Claiming "envelope done" would overclaim while roads are shape-provisional and half a million Bexar parcels can read as matched I-2 without a zoning stamp. Matcher length floors cannot simultaneously serve Kyle R-1-T honesty and SA C-3NA→C-3; atom confidence grading (asserted-high / asserted-medium+match-basis / asserted-low+honest-absence) dissolves that binary. Hard-hold deepen into scalar rows for PDD/OCL would build a structure conditional rule-atoms will replace. Building the atom family in cortex-api would require a second lift into the spine; operator ruled do the sprint-56 reasoning lift as the atom refactor once, in hauska-engine.

## Reversal criteria

- If the spine atom/engine plan is cancelled or delayed past need for PE launch, reconsider a thin cortex-local honesty shim for absent-zoning only (still no full atom family in cortex).
- If Overpass private endpoint is permanently retired, re-grade WDLL 8/9 as dropped and design shape/point tiers as the only front-edge path.
- If operator re-opens hard-hold deepen before atomization, amend this decision with named districts and a reason.

## Dependencies

- Depends on: homes topology / ADR-008 cortex-as-reporting-package; WDLL Overpass correction note on STATUS; upcoming atom+engine plan dispatch.
- Unblocks: durable Overpass remount PR; absent-zoning honesty PR; holds cortex atomization PRs.

## Counterparties

Internal: Nick (operator), PE execution agents, planning agent authoring the atom+engine plan.
