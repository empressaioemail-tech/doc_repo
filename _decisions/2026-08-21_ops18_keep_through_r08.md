---
decision_id: 2026-08-21_ops18_keep_through_r08
date: 2026-08-21
owner: integration
status: active
related_canonical: [90_operations/OPS-18_canon_reconciliation_plan_of_record, _inbox/2026-08-21_R-lanes_consolidated_report, _blueprint/40_rule_register, _catalog/tooling_register]
---

## Decision

Do not retire OPS-18 at R-05. Do not fold R-06 into OPS-16 or OPS-17. Retire when R-08 closes, or when R-06 has landed and an operator ruling explicitly folds R-07 and R-08. R-09 stays until a live GET on a deployed revision returns a named cell that reads negative.

## Context

OPS-18's reversal criterion asked this question at R-04: whether the remaining rows still earn their place, because a governance plan that outlives its own repair becomes the artifact class it was built to remove. R-04's first half produced a tooling register. R-05 mapped twenty-four blueprint rules onto that register and found zero armed consumers.

## Structural commitment check

Hauska spine rule: R-06 feeds the rules that bind the spine. Folding it into a product plan would recreate the ENFORCEMENT.md failure (prose, no executor).

## Reasoning

Catalogs without wiring are the defect this plan exists to fix. R-06 is the wiring. R-07 and R-08 are store audit and a fix plan; those can fold into OPS-16 after R-06 has at least one new control proven by violation per defect class they will grade. R-09 is instrument repair on the launch gate, not a Texas-flush product card.

## Reversal criteria

Reverse if an operator ruling folds R-06 into OPS-16 or OPS-17 by name. Reverse if R-06 lands and the operator then folds R-07 and R-08. Do not reverse because the catalogs exist.

## Dependencies

Depends on R-04 mapping (zero ENFORCED). R-01 remaining D1/D5 work does not change this. R-09 live firing is independent.

## Counterparties

Internal. Operator is the only party who can fold rows.
