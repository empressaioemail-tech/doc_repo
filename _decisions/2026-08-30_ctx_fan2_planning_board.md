---
decision_id: 2026-08-30_ctx_fan2_planning_board
date: 2026-08-30
owner: Nick (operator), recorded from planning-agent board
status: superseded
superseded_by: 2026-08-31_ctx_board_0005a_first
related_canonical:
  - _inbox/2026-08-30_ctx_fan2_planning_handoff.md
  - _inbox/2026-08-30_ctx_consolidated_execution_plan.md
  - _inbox/2026-08-30_ctx_execute_waves_WDLL.md
  - _inbox/2026-08-30_ctx_chew_next.md
---

Superseded 2026-08-31 by `_decisions/2026-08-31_ctx_board_0005a_first.md`.
Historical board only.

## Decision

Fan 2 local commits push and merge in the stated order. Item 8
(`source_url_verified_at` on `landing_easement_gis`) amends P1-FACTORY before
that merge. P4 wells, footprint, and flood start. P4 setbacks, edges, and
envelope wait on retiring the road-class-setback path. Map deploy waits on
merge to main. Wave R and the named parks stay parked.

## Context

The executing seat landed six product branches locally and asked the planning
agent for go / hold / refuse. The board returned 2026-08-30. One real gap:
`source_url_verified_at` appeared four times in `0005a` and zero times on
`landing_easement_gis`, so synthesised Round Rock and Cedar Park URLs would
seed as gis-layer facts with no unverified mark.

## Structural commitment check

Sell reasoning, not data: an unverified URL is labelled, not presented as a
confirmed layer.
Confidence is earned: `source_url_verified_at` NULL is the honest stamp until
a probe.
Fail closed: synthesised layer keys refuse a non-null verified timestamp.
Cost per jurisdiction: one column on an unapplied migration, not a new lane.

## Reasoning

Push is not merge and not deploy. Factory merge is serial because two green
PRs can merge red when the base moves; `gh api update-branch`, not a local
rebase. P2b-serve is independent of factory. P1-LDT stays unmerged until a
post-P2b diff is empty, then the branch closes. P2-JURIS `00`+`01` on a
short-lived RO URI converts UNMEASURED to measured; a clean-looking total
from the wrong predicate is the trap, so a miss versus 357,269 / 624,141 /
981,410 names the join wrong and does not adopt the number. 0005a and 0005b
apply as split. P4's setback half writes on
`boundaryEdgeFact.setback.provenance: "road-class-setback-table"`, a path the
mold retired 2026-07-29; wells / footprint / flood do not.

Gate 8 emits `dayOne` C3/C4/C7 from the served body
(`scripts/gate8/run.mjs` fixture arm and production arm). Production `verdict`
rollups every assertion, including C1/C2/C5 which refuse without a browser.
P4 keys `dayOne`, not `production.verdict`. The phrase is not in the Factory
tree; it is this ruling plus the instrument's exported fields.

## Reversal criteria

If live TOTALS miss the reconcile target, stop persist and name the join.
If 0005a live CHECK does not refuse `kind=absence probed_at NULL`, do not
continue to 0005b. If P2b lands and `seat/property-ctx-p1-ldt` is not empty,
reopen the fold. If F-11 does not retire the road-class-setback path, P4
setbacks stay held.

## Dependencies

P1-FACTORY merge before the other three Factory branches. 0005a apply after
the item-8 amend. 0005b bake `neondb` only. Persist after measured TOTALS,
as Cloud Run, not a laptop. F-11 dispatch waits on operator word.

## Counterparties

Internal. Operator, integration planner, property product trees.
