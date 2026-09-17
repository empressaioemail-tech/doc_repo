---
id: 2026-09-16h_gate_rollout_and_serving_ruling_claude_code
title: "Session: the gate rollout, the county-verdict ruling, P-205 customer-done, P-258 integrated, the corpus and ledger rulings"
date: 2026-09-16
last_updated: 2026-09-17
kind: session
status: closed (context limit; handoff at _inbox/2026-09-17_HANDOFF_integration_seat.md)
agent: claude_code
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md
  - _inbox/2026-09-16_HANDOFF_integration_seat.md (consumed)
  - _inbox/2026-09-17_HANDOFF_integration_seat.md (the next session starts here)
  - _decisions/2026-09-17_setback_corpus_flag_state_and_default_line_rulings.md
  - _decisions/2026-09-17_ledger_serving_transition_and_retirement_order.md
  - _decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-191 to A-200, rows P-297 to P-300)
  - _catalog/program_preambles/OPS-24.md (law 7)
---

# Session: the gate rollout, the county-verdict ruling and the rulings that followed

Ran from the `integration` seat, `P:/doc_repo` on `main`, starting from
`_inbox/2026-09-16_HANDOFF_integration_seat.md` at doc_repo `15399eb8`, and closed at the context limit about 2026-09-17 00:45Z. A regroup checkpoint was
written at 00:04Z; the sections after "Open at checkpoint" cover the rest. The live state and
the queue are in the roadmap, which this session rewrote.

## What was decided

- **The county verdict is a grade, not the serve switch** (operator ruling, A-193). On a slated
  rail each parcel is served from its own ledger cell, never the legacy or baked value; the
  verdict stays the completeness and publish grade. Recorded as a decision, as OPS-24 law 7 (so it
  travels in every dispatch) and as build row P-297. It came from reviewing P-256: applying that
  honest correction would have turned every county's `setbackFrontFt` verdict to `refuse` and sent
  every parcel back to the stale bake, because LDT and retrieval-api both switch serving on the
  county verdict (A-192).
- **P-256 is held** until P-297 is live, and its apply (about 1.1M cells) needs an explicit
  authorisation, because no factory writer carries the blast-radius refusal P-213 describes.
- **Planner calls, all reversible and recorded:** the gate scheduler has no staging step, so its
  own dry run was replaced by the read-only instrument and its trigger paused around a watched
  apply; the P-205 Marble Falls rule (resolve an ambiguous ZIP with its city, answer a unanimous
  locality, keep a mixed one indeterminate); the P-284 compute cost is the execution window until
  reconciled against the billing export; P-269 folded into P-297's LDT lane.
- **Owed by the operator at the checkpoint (all but the last three ruled later, A-199):** three P-295 rulings (a transition window for copied values, the
  retirement order, a content version in P-163), four P-258 corpus rulings (OT-1, OT-2, OT-3,
  OT-10), P-256's apply authorisation, P-278, the Cotality contract, and the P-243/P-244a check.

## What was built, merged and deployed

- **Gate:** factory #159 (P-292), #157 (P-252, integrated by the seat: a comment-only textual
  conflict plus two semantic ones the merge did not show, fixed and re-run in CI), LDT #702 and
  engine #462 (P-293, both halves). Migration `0011a` had never been applied and was.
  `cortex-api-00815-fiw` and `hauska-retrieval-api-00094-wed` deployed by canary and lease. The
  scheduler's new image deployed with its hourly trigger paused; the old-code run was cancelled
  when it crawled; the apply is running and graded by the new `scripts/p252-apply-compare.mjs`.
- **P-205:** engine #463 and retrieval `00096-div`; `find_parcel` names Burnet County for a
  Marble Falls address. Customer-done.
- **P-281:** factory #161 and its doc_repo branch; migration `0013`; `factory-control-00008-vid`;
  a real job refused `LEASE_HELD` while a session held its store.
- **P-284:** factory #158 and #162; migrations `0012` and `0014`; writers, publish and reaper
  images on `47c7dfc`; a real dry run wrote its stage record.
- **P-277:** the id-allocation gate covers amendment ids and reads the index; seven collisions
  annotated; C15 reconciled to 7.
- **P-258:** six corpus PRs and six LDT PRs integrated as one merge each; corpus `1.3.0`
  published; LDT `44029db`. P-262: engine #461.
- **Dispatches compiled:** p293r, p205b, p284r, p295 (phase 1), p297-cell-serve-ldt,
  p297-cell-serve-engine; p269 withdrawn.

## What was found

- The gate scheduler runs hourly with `--apply` on the one verdict table production reads, so
  deploying its image is the apply.
- No ledger value cell (0 of 26,814,129) carries an atom pointer; setback atoms are missing for
  38 percent of parcels with a setback value and disagree on 30 percent (P-295).
- P-284's billed metric does not exist in the project, and nothing injects a monitoring reader
  in production; every cost today is the execution window.
- The gate scheduler reads a whole county's index per rail; a cold cache made the six counties
  take hours instead of 33 minutes (P-298).
- The P-213 blast-radius guard exists only in hauska-engine.
- A lane ran heavy scans without taking the lease its dispatch named; the session side of P-281
  is voluntary.

## Lessons (for the fleet-memory gate)

- A textual merge that succeeds can still break the build: two PRs that each pass alone can
  disagree on a test's county or a registry's export list. Re-run CI on the integrated tree.
- A migration merged is not a migration applied; check the live constraint before running code
  that writes the new values.
- A shell command that writes a lease file and then shifts traffic is refused by the lease gate,
  which checks before the command runs; write the lease in its own call.
- In a backgrounded `cd X && A & B &` line, only the first group runs in X.
- Timestamps in a living document come from `date -u`, never from an estimate; four were wrong
  and were corrected to the commit times.

## Open at checkpoint

The gate apply (Travis, then Williamson), then its grade, the trigger resume and the six-county
republish; P-297's LDT PR #710; the first measured P-284 cost; the P-249 staging proof; P-254 and
P-286. The ordered list is the roadmap's "Owed by the integration seat" table.

## After the checkpoint

- **Merged and live:** engine #463 and #464 (retrieval `00096-div`, P-205 customer-done on
  `find_parcel`); factory #162 (P-284 remainder) with migration `0014`, the writers, the
  publish jobs and the reaper image on `47c7dfc`, the reaper backfilling a real record with a
  measured $0.000484 (P-284 graded); LDT #709 (P-258's tables, not yet deployed).
- **Operator rulings (A-199):** the four corpus rulings (a single meaning for the height flag, a
  fourth verification state, a `located` worklist state, city-wide default lines), P-295's three
  rulings (a counted transition window, the retirement order, a content version in P-163),
  P-256's apply authorised with a per-county ceiling, and P-284's cost basis. Two decision
  records; rows P-299 and P-300; OPS-24's range to 320.
- **Found:** LDT's envelope code serves a flagged 999 height as a number (10 district rows at the
  serving commit, 39 at main), so the LDT deploy of P-258's tables waits on P-299's guard.
- **Dispatched (operator fired all six):** P-297 LDT half, P-299, P-298, P-294, P-285, P-259.
- **The old-code scheduler run was cancelled** at 22:39Z; the new-code apply ran under watch with
  the hourly trigger paused and an integration-seat lease on the factory store.

## State at close (2026-09-17 00:42Z)

- The gate apply `8x4jk` was still running: Bastrop, Caldwell, Hays and McLennan graded clean;
  Travis 55 of 65; Williamson not started. Trigger PAUSED. Lease `c52a88cf` live until 02:40Z,
  its handle in `P:/tmp/integration-handoff/p252-apply-lease.json`.
- Six lanes running; P-297's LDT PR #710 open.
- The next session starts from `_inbox/2026-09-17_HANDOFF_integration_seat.md`: grade the apply,
  manage the lease and the trigger, then wait for the operator to report the six closes.

## Commits this session

`d4221fba` A-191, `34cfac85` A-192, `64d875d7` A-193, `9c0881cb` P-281 merge, `a5c6c95a`
P-277, `fd18101a`, `00cbf8c3` A-195, `8151dbfc` P-258 merge, `06e7b398` A-196, `5ed33bb7`,
`c0316827` A-197, `6c5652a6` checkpoint, `9df05c9a`, `20204af9` A-199, and the session-close
commit.

## Skill observations

decision-log was used three times and fitted well; the record format carried consequences and
reversal criteria without strain. No other skill fired.
