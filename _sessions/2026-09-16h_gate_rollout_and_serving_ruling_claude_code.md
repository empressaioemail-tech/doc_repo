---
id: 2026-09-16h_gate_rollout_and_serving_ruling_claude_code
title: "Session checkpoint: the gate rollout, the county-verdict ruling, P-205 customer-done, P-258 integrated"
date: 2026-09-16
last_updated: 2026-09-17
kind: session
status: checkpoint (session continuing)
agent: claude_code
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md
  - _inbox/2026-09-16_HANDOFF_integration_seat.md
  - _decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-191 to A-198, rows P-297, P-298)
  - _catalog/program_preambles/OPS-24.md (law 7)
---

# Session checkpoint: the gate rollout and the county-verdict ruling

Ran from the `integration` seat, `P:/doc_repo` on `main`, starting from
`_inbox/2026-09-16_HANDOFF_integration_seat.md` at doc_repo `15399eb8`. This is a checkpoint
written at the operator's request to regroup; the session continues. The live state and the
queue are in the roadmap, which this session rewrote.

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
- **Owed by the operator:** three P-295 rulings (a transition window for copied values, the
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
