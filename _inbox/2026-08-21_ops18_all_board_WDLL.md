---
id: 2026-08-21_ops18_all_board_WDLL
title: All remaining SmartSite and Texas-flush work — parallel board
status: approved
date: 2026-08-21
plan_row: OPS-18c / P-48 through P-56 / R-06
operator_approval: 2026-08-21 evening verbal. All remaining work on the board. Capture the fan plan, then WDLL, then OPS-16 amendment rows, then stop before compile.
related:
  - 90_operations/OPS-18c_parallel_execution.md
  - 90_operations/OPS-18a_path_to_smartsite_market.md
  - 90_operations/OPS-18b_data_remediation_plan.md
  - _decisions/2026-08-21_all_board_parallel_execution.md
  - _inbox/2026-08-21_sellable_WDLL.md
---

# WDLL: all remaining work on the board

Date: 2026-08-21  Status: approved
Operator approval: 2026-08-21 evening

## Done looks like

SmartSite gold inspect serves every in-scope HOLD family that already has atoms (S1 through S6 live on anonymous inspect; S7 owner on identified inspect only). Command Center heartbeat stays live. Geometry `48135` is scored against a named denominator that excludes the 3791 retired `prop_id` rows, and DC-2 is re-graded from that GET. Wave A `--apply` then proceeds one rail at a time until DC-3 remaining `not-yet` counts are either `satisfied-*` or named honest-absent under the verified pair. Wave C pins do not rise. R-06 is armed in production (executor, trigger, failure, proven by violation). Harris PBF stays out. Typed absence is not minted until the A2 ruling below.

This card is the program. The sellable card (`_inbox/2026-08-21_sellable_WDLL.md`) remains the step-6 heartbeat-plus-atoms slice and is not reopened.

## Operator stamps (this card)

S7 owner: `owner-fact` serves identified-session inspect only. Anonymous browse and anonymous inspect never render owner. Fabricated owner is never acceptable.

A2 absence: HELD. Do not mint typed `absence` and do not copy L7 `--honest-absent` onto wells, pipelines, rail, or mud. Operator still owes L7 facet-only versus the verified pair (`evaluated: true` and non-empty `provenanceScope`). Cells stay `not-yet` until that ruling. This is a stamp that the item exists and is blocked, not a stamp to execute it.

Wave A `--apply`: IN. Sellable item 6 "no new ingest" is superseded for COVER only. A-017 Harris PBF stays NO.

## Acceptance items

1. S1 special-district (`mud-pid`) on gold inspect reads `special-district-fact`, not a bake table. Check: live gold parcel in a county with those atoms; `data-state` present or honest miss that names the atom. | grade: [ ]
2. S2 pipelines (`texas-rrc`) live on gold inspect or map. Check: layer `live:true` and inspect cites `rrc-pipeline-fact`. | grade: [ ]
3. S3 wells live on gold. Check: inspect or map cites `well-fact`. | grade: [ ]
4. S4 building footprints live on gold. Check: inspect or map cites `building-footprint`. | grade: [ ]
5. S5 rail live on gold. Check: inspect or map cites `rail-corridor-fact`. | grade: [ ]
6. S6 property-boundary-edge live on gold. Check: inspect or map cites that family. | grade: [ ]
7. S7 owner on identified inspect only. Check: anonymous inspect has no owner body; identified session shows `owner-fact` or an honest miss that names the atom. Fail if anonymous sees owner. Fail if identified is a CAD-roll bake presented as the atom. | grade: [ ]
8. DC-2 geometry `48135`: denom named in the COVER close (active geo_id count and retired exclusion). Score then ledger recompute. Check: live GET `geometry` cell for `48135` is not the 2026-08-12 5 percent `B2_cp2` row. | grade: [ ]
9. DC-3 Wave A: after each `--apply`, score and recompute. Remaining `not-yet` is a named count on a dated GET, never a prose "in progress". Harris PBF 0. Check: GET field names, not positional CLI. | grade: [ ]
10. DC-6 Wave B in slot gaps: footprint-28 depth rails named on GET. Not a SERVE substitute. | grade: [ ]
11. Wave C pins: Q8 flood unresolved+mismatch does not exceed 16/100; special-district does not exceed 20/100. New writes use integer grammar; padded form in `externalKeys`; no `:outside` or `:primary` in new `entity_id`; `applies-to` written with the fact; verified-absence pair unfed stays unfed (not widened). Check: writer tests plus a bounded Q8 re-sample. | grade: [ ]
12. R-06 armed. Check: a known violation fails a running job (CI or schedule). `--check-only` does not write `_catalog/canon_divergence.md`. A control that only self-tests has not met this item. | grade: [ ]
13. Slot law held. Check: at most one atoms `--apply` in flight; SERVE close artifacts show zero `--apply`; IDENT backfill did not start while COVER held the slot. | grade: [ ]

## Amendments

- 2026-08-21 evening: opened with operator go on all remaining work, four teams, S7 identified-only, A2 held, Wave A apply in, Harris PBF out.

## Finish card (graded at close)

1. pending
2. pending
3. pending
4. pending
5. pending
6. pending
7. pending
8. pending
9. pending
10. pending
11. pending
12. pending
13. pending
