---
decision_id: 2026-08-17_qa_launch_current_map
date: 2026-08-17
owner: operator
status: active
related_canonical:
  - _decisions/2026-08-09_texas_flush_launch_gate.md
  - _decisions/2026-08-11_texas_flush_launch_gate_amendment.md
  - _inbox/2026-08-15_texas_flush_server_plan_WDLL.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 76j_smartsite_launch_readiness_program.md
---

# Decision

QA and launch Smart Site on the current map. Remaining statewide PBF roads and CAMA structural loads are post-launch backfill. Do not restart the Harris statewide-PBF extract. Do not treat roads 254/254 or Dallas year-built/sqft as launch blockers.

## Context

L26 spent days on a Python nested-loop Harris roads extract that wrote zero atoms, then a third restart that was killed at 64k ways. Operator 2026-08-17: the map already has enough context to QA and market; remaining roads and CAMA wait until the backfill method is redesigned. This returns launch to the 2026-08-09 intent (measured product surface, filled-everywhere as the permanent engine) and stops using DC-3 uniform-rail 254/254 as an ingest factory.

## Structural commitment check

- Sell reasoning, not data: launch on what the map actually serves (parcels, flood, landed roads, pipelines, CAD identity/value where A1 applied). Honest not-yet on remaining road counties. Do not mint honest-absence for Harris roads.
- Confidence earned, not asserted: remaining cells stay not-yet until stored atoms exist. Do not grade DC-3 by narration.
- Cost per jurisdiction: another week of raise-and-restart on the same extractor is the cost failure.
- Dual interface: MCP and PE keep reading the same spine; no new surface.

## Reasoning

The L26 scoreboard counted drain JSON (98/254 PBF roads) as if it were customer-done. CAPCOG already has Overpass road atoms (Bastrop 19,907); Dallas/Bexar/Fort Bend PBF landed; Harris flood is on the map. Dallas CAD identity and value atoms already exist from the 2026-08-12 15-county apply. The Dallas UX hole is CAMA living area and year built (0% sqft on StratMap), which `write-cad-parcel-roll-county` does not fill. Marketing and checkout can proceed on the live inspect card. Backfill gets a new method (indexed or clipped extract; DCAD zip after announce) after that work is designed, not by restarting the serial PBF drain.

## Reversal criteria

Reverse if a named QA session on the launch-footprint map finds a missing layer that makes the product un-demoable (for example Bastrop inspect card empty, or tiles 403 from the PE origin). Reverse the roads backfill deferral if a prepared-geometry or clipped-PBF Harris extract is proven on Dallas parity and the operator wants Harris roads before first paid users. Do not reverse back onto statewide-PBF raise-and-restart.

## Dependencies

Depends on: live PE at smartsite.cloud; no second atoms writer for a fill factory. Blocks: using `gate-grade.mjs` DC-3 as the launch go. Does not block: Stripe catalog amount rebuild, affiliate platform, CRM ruling, Vercel plan check.
Does not block: G-45 / G-11 / Smart Files work on other rows.

## Counterparties

Internal: Nick (operator), doc_repo planner, L26 drain (idle). External: none.
