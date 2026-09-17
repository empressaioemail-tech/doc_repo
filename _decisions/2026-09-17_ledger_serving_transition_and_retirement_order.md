---
decision_id: 2026-09-17_ledger_serving_transition_and_retirement_order
date: 2026-09-17
owner: Nick (operator rulings on P-295's recommendations, endorsed by the integration seat)
status: active
related_canonical:
  - _decisions/2026-09-11_ledger_as_serving_path_seven_steps.md (amended in effect by this record)
  - _decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-197, A-199, rows P-163, P-295)
  - _inbox/2026-09-16_p295-ledger-serving-measure_close.json
  - hauska-engine services/retrieval-api/scripts/ledger-serving-measure.mjs
---

## Decision

Three rulings on how the ledger becomes the serving path, given P-295's measurement that no
ledger value cell carries an atom pointer: a named transition window for copied values, a fixed
retirement order, and a content version in the writer's scope.

## Context

The 2026-09-11 ruling says a cell is accounting (state, atom reference, provenance, a rendering
keyed to atom and vocabulary version), never a copied value, and that one reader in retrieval-api
dereferences atoms. P-295 phase 1 measured the store on 2026-09-16: 63,791,325 cells across the
six counties, 26,814,129 of them values, and zero carrying an atom reference under eight candidate
spellings; `parcel_record_cell` has no pointer or version column; setback atoms are missing for
38.3 percent of parcels with a setback value and disagree with the cell on 30.2 percent where
both exist; and three readers exist on disk, one of which serves customers today. The lane
recommended three rulings; the integration seat endorsed them; the operator approved them.

## The rulings

1. **Transition window.** Until the writer that stores an atom pointer lands (P-163), a copied
   value in a cell is permitted, and only while that cell carries no pointer. Every such cell is a
   counted defect: `ledger-serving-measure.mjs` reports the count per rail and county, and the
   count must fall as the writer lands, never be hidden. A cell that carries a pointer may not
   also carry a diverging copied value.
2. **Retirement order**, in this order and no other:
   1. the writer stores a pointer and a content version in each cell (P-163);
   2. LDT's cell reader (`parcelRecordCellRead.ts`) is repointed to retrieval-api's reader, so the
      two stop being parallel implementations;
   3. the map's atom-chain adapter (`atom-chain-to-facets.ts`) is repointed to the same reader;
   4. the bake is retired per rail, not per county, with a divergence test during each overlap;
   5. only then is the legacy envelope derive (`buildableEnvelope/derive.ts`) retired.
   A lane that would add a reader outside this order is refused as a fourth producer.
3. **Content version.** P-163's scope includes a content version in the cell, so a cached
   rendering keys to the cell's content and vocabulary version, never to `updated_at`.

The setback disagreement (cell 30 against atom 25 in Bastrop, probe `48021:103387`) is decided by
the existing most-current-source-wins ruling once each side's effective date is read at source;
an unreadable date produces a conflict row, never a silent pick.

## Structural commitment check

Sell reasoning, not data: strengthened; every served value will trace to one atom and its
version. Confidence earned: strengthened; a copied value is visible as a defect instead of passing
as canonical. Cost per jurisdiction: neutral now, lower later (one reader). Dual interface:
strengthened; the MCP, map and PDF converge on one reader. Tenant sovereignty: unaffected.

## Reasoning

Without a transition window, every consumer repoint is blocked behind the writer and nothing can
move; with an uncounted window, copied values become permanent. Counting them keeps the window
honest. The retirement order is the one that avoids turning an invisible defect into a visible
regression (ENFORCEMENT: repoint consumers first, then retire), and it retires the bake per rail
because rails reach readiness at different times. A rendering keyed to a wall-clock stamp fails
silently when content changes without a write or a write changes nothing, which is exactly the
class this program keeps finding.

## Reversal criteria

- If P-163 cannot store a pointer without a schema change that breaks the gate or the publish
  path, revisit the window's end condition, not its existence.
- If a rail cannot be retired from the bake without a customer regression that the divergence
  test does not catch, stop that rail and revisit the order for it.
- If the measured defect count does not fall after P-163 lands, the window is failing; escalate.

## Dependencies

Depends on: the 2026-09-11 ledger ruling, A-193 (per-cell serving), P-295 phase 1. Depended on
by: P-163 (scope grows by the pointer and content version), P-295 phase 2, P-297's engine half,
P-294 (a stopgap that lives inside the window), every future serve cutover.

## Counterparties

Internal: the property seat (writer, readers), the integration seat. No customer-visible change
by itself.
