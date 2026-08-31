---
decision_id: 2026-08-31_ctx_board_0005a_first
date: 2026-08-31
owner: Nick (operator)
status: active
related_canonical:
  - _decisions/2026-08-30_ctx_fan2_planning_board.md
  - _dispatches/2026-08-31_f11-ldt_dispatch.md
  - _inbox/2026-08-30_ctx_chew_next.md
---

## Decision

Prove the live 0005a CHECK first, from the migrate job image, as
BEGIN / INSERT kind=absence probed_at NULL / ROLLBACK. Merge F-11
engine #366 on green. Fan the compiled LDT setback refuse
(`_dispatches/2026-08-31_f11-ldt_dispatch.md`). Apply 0005b only
to bake neondb, never the migrate job, never a laptop. Deploy
hauska-map now; acceptance is `dataset.hauskaBuild` equal to the
serving sha. Keep p1-ldt / p1-edges held. P4 wells / footprint /
flood stay GO on `dayOne`. P4 setbacks stay HOLD until the LDT
refuse lands. TOTALS is GO: mint a short-lived RO URI, refuse a
write, run `00`+`01`, reconcile 357,269 / 624,141 / 981,410, then
delete the credential and confirm it is dead. Wave R and the
named parks stay parked.

## Context

0005a applied on execution `factory-conformant-migrate-c2h5d`
(`sha256:4bd728c5`) with `{ok:true, ran:["0005a_landing_setback_easement.sql"]}`.
That proves the file ran, not that
`landing_setback_registry_absence_probed` fires. Engine F-11
#366 is the consumer refuse in hauska-engine; C7 stays red until
LDT stops copying `lead.setback`. Map #316 merged as `bb02f3b`;
the prior hold was on that merge.

## Structural commitment check

Sell reasoning, not data: a refused INSERT is the grade, not a
migrate ok.
Confidence is earned: TOTALS stays unadopted on a miss.
Fail closed: ROLLBACK so a silent CHECK cannot leave a row.
Cost per jurisdiction: one job execution, not a new store.

## Reasoning

A control that exists and has not been observed working is the
class this program has been clearing. The Factory file list
seeing 0005a and not 0005b is the non-recursive readdir plus the
bake-directory regex, not a miss. C7 going red after #366 is
expected. The map marker is the accept; PE typecheck failing on
`globalThis.__HAUSKA_BUILD__` (fixed in `2dd8ffb`) is that define
working. Minting a Neon RO URI is a credential act and needed
the operator word; that word is this board.

## Reversal criteria

If the live INSERT is not refused with check_violation 23514 and
the absence_probed constraint, do not apply 0005b. If f11-ldt
moves C3 or C4, do not treat C7 green as a release. If TOTALS
misses 357,269 / 624,141 / 981,410, name the join and do not
adopt a new total. If `dataset.hauskaBuild` does not equal the
serving sha after deploy, the deploy is not accepted.

## Dependencies

0005a CHECK before 0005b. f11-ldt before P4 setbacks. #366 merged
does not release P4 setbacks. p1-ldt leftovers stay a separate
tree.

## Counterparties

Internal. Operator, integration planner, planning agent on TOTALS
(holds NEON_API_KEY), property product trees.
