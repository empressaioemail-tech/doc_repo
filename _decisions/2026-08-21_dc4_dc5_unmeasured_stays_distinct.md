---
decision_id: 2026-08-21_dc4_dc5_unmeasured_stays_distinct
date: 2026-08-21
owner: operator
status: active
related_canonical:
  - _decisions/2026-08-11_texas_flush_launch_gate_amendment
  - 90_operations/OPS-18_canon_reconciliation_plan_of_record
  - _inbox/2026-08-21_r09-finish_close.json
---

## Decision

Do not fold `derivation-indeterminate` into DC-4 `no-atom` or DC-5 `no-writer`. Absent, zero, and unmeasured stay three states. Add a launch criterion that unmeasured cells must be zero, or convert them to measured by trusting the committed `RAIL_ENGINE_BINDINGS` table (CI already proves the scripts exist). Changing DC-4 and DC-5 string-equality is an OPS-16 amendment; this ruling is that amendment's direction.

## Context

R-09 overlay stamps `derivation-indeterminate` on engine-script rails when the engine root is absent from the cortex-api container. DC-4 counts `displayState === "no-atom"`. DC-5 counts `displayState === "no-writer"`. Those strings can stay zero while the field hasWriter goes false and atomFamilyState goes partial. Collapsing unmeasured into no-writer would make the launch gate pass on "we could not tell."

## Structural commitment check

Confidence is earned: a criterion that cannot see unmeasured will certify a constant. Fail closed: do not emit a launch pass by renaming a third state into a counted one.

## Reasoning

The binding-table wire is the conversion of unmeasured into measured. Until that wire exists, a new DC (unmeasured = 0) is the honest gate. Folding is the shortcut the 2026-08-09 ruling already refused for absence-minting.

## Reversal criteria

Reverse the extra DC if the binding wire ships and a live GET shows hasWriter and atomFamilyState taking real true/false/present/absent values with zero indeterminate cells. Then DC-4 and DC-5 can grade the converted states. Do not reverse by widening DC-4 or DC-5 to match the overlay string.

## Dependencies

Depends on R-09 serving snapshot after traffic-then-recompute. Blocks launching on DC-4/DC-5 while they ignore the overlay. Does not block R-01.

## Counterparties

Internal. Operator. OPS-16 amendment is drafted this wave.

## Operator approval

Operator approved 2026-08-21. Do not fold. Draft the OPS-16 DC-unmeasured amendment in this wave.

