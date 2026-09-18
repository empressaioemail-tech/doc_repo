---
id: 2026-09-18_nine_prs_and_phase0_closeout_rulings_claude_code
title: "Session: the nine lane PRs reviewed, merged and deployed where they could be, and the Phase 0 close-out ruled and written down"
date: 2026-09-18
last_updated: 2026-09-18
kind: session
session_type: integration
status: closed (operator-called checkpoint; handoff at _inbox/2026-09-18_HANDOFF_integration_seat.md)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-17d_HANDOFF_integration_seat.md (the handoff this session consumed)
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md (created this session; the durable list)
  - _decisions/2026-09-18_phase0_closeout_rulings.md (A-215, A-216)
  - _decisions/2026-09-18_join_miss_unaccounted_until_scoped_guard.md (A-214)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-213 to A-216; P-327 to P-351)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (updated through close)
snapshot: doc_repo main 6f9188f6; map cfe23197, LDT 25d1782f, engine 72d72c02, factory 85d63e8d; PE 1qrscbkcf; read 2026-09-18 12:06Z
---

# Session: nine PRs merged, and Phase 0 given one accurate definition of what is left

## What the session did

It opened on nine unmerged lane PRs and the question of why factory #173's `ldt-sha` check could not
see its base. The answer was infrastructure: the lane force-pushed over the branch's first tip, so the
`push` run's `github.event.before` pointed at a commit no ref reached, and every re-run replayed the
same payload. A branch update later made the base reachable and the check passed, which confirmed it.

Reading the diffs mattered more than the check. **#173 was held:** its retirement gate measured the
set difference against `txgio_parcel` while the LDT bake retires against `cad_property` at the
declared tax_year, so it refused Williamson by the accident of `txgio_parcel` holding no numeric ids,
and P-320's blast-radius share inherited the same proxy. The lane's own numbers supplied the
counterexample: on the 2026-09-10 run the gate would have measured 0 R-keyspace retirements while the
bake retired 282,569. The P-319 lane had in fact recorded this in its own close; the finding was
reached independently here by reading LDT at the pin. **#175 was held** because its blanket reversal
of join-miss absences conflicted with the 2026-09-05 ruling's own clause asking for a
population-scoped guard. The operator shipped both as ruled partial and blanket fixes (A-214) on
condition that the proper fixes were carded (P-327, P-328, P-333, and later P-351).

Seven PRs merged first, each re-greened against the base it merged into, the P-257 and P-270 pairs
together. Property Explorer deployed from a fresh clone and was graded on the served facets route, not
the deploy result: a Smithville PD parcel that served another district's 20/100/100/100 now declines
as a planned development, a Hays parcel no longer reads Bastrop's "layer 23", and a Bastrop parcel's
undated citation now declares itself. The ACQUIRE-GIS factory jobs were redeployed after finding the
live ag-valuation image still carried the sweep #174 deleted, and graded by a Hays dry run that
refused before opening a store. After the rulings, #173's publish lane deployed with migration 0015
applied alone; #175 merged and was not deployed, because its build also rebuilds the hourly gate
scheduler.

## The question that changed the session

The operator asked whether everything proposed actually moved Phase 0. It did not. Re-reading the
exit definition (scope rev 4, section 5: ledger, customer probe on map, MCP and PDF, coverage, road
residual, walk) showed that half the proposed follow-ups were controls off the exit path, and that the
customer leg had failure classes nobody had cited: the buildable-area figure, "a codified district must
draw" in seven buckets, Waco, two contradiction classes with no owning row, and a PDF leg that could
not be graded because no fixture PDF had been built. The ledger accounting in the prior handoff was
also wrong: 67 open plus 12 unmeasured, not four blocks summing to 78.

The operator then ruled every decision as recommended (A-215, eighteen rulings; A-216, the probe signs
in per run, San Marcos served from the verified corpus after a coverage re-check, Georgetown withheld
until its code takes effect on 2026-11-01), and set the standing instruction: everything gets done,
on the exit path or not, properly and in waves. P-335 to P-351 carry every item that had no row,
including a Phase 1 flag to come back and fix the 30,434 envelope atoms that record failed
computations. The register at `_inbox/2026-09-18_phase0_closeout_REGISTER.md` is the durable list.
Wave 1 (six lanes) was compiled and pushed for the operator to fire.

## Corrections to this seat's own records

Two claims this seat made or repeated were wrong and were caught before they reached a lane. The
register draft repeated a lane close's statement that hauska-engine-api had been pinned; read by
field, the service still follows latest, and retrieval-api is the pinned one. And eighteen lane
artifacts the new missions cite were untracked or lived only in seat worktrees or the other clone;
they are now tracked so every Wave 1 dispatch points at files on `origin/main`. The session was
checkpointed rather than continued into the production writes (dropping `dblink`, the gate-scheduler
deploy, P-258's re-run), per ENFORCEMENT's note that a planner's error rate rises late in a long
session.

## Open at close

The seat's own Wave 1 (register section 3b), Wave 1's six lanes, P-264's close and hauska-engine
#473, and Wave 2 once its gates clear. Everything is in the handoff and the register.
