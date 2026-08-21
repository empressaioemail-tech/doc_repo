---
id: session_2026_08_21_ops18_lanes_and_instrument_rules
title: OPS-18 opened, five lanes run, R-09 fired, and four rules on instruments
status: active
last_updated: 2026-08-21
applies_to: portfolio
owner: nick
related: [90_operations/OPS-18_canon_reconciliation_plan_of_record, _blueprint/00_WDLL, ENFORCEMENT, MEMORY]
---

# Session close — 2026-08-20/21

Long session. Roughly 25 planner commits, `492a452` through `83ecb34`, CI green throughout.

## What this session was

It began as a review of one lane agent's flood-chain work and became the opening of a third
plan of record. The through-line, arrived at rather than planned: **the artifact exists and
nothing feeds it or reads it.** That is now OPS-18's governing line and it was measured, not
asserted.

## What was built

`MEMORY.md`, the Tier 1 fleet store that `fleet_memory_practice.md` had pointed at for months
and that never existed. Tier 2 capture had been running into a gate with no destination.

doc_repo's **first CI**. There was no `.github` directory at all; seven enforcement scripts sat
in `scripts/` with no trigger. Now nine controls run on every push, five BLOCKING and all five
verified by violation, behind a ratchet that pins known debt and fails on new debt.

`OPS-18`, prefix `R`, ten rows. Before it, the programme designed to make rules bind could not
name a plan row, so by the operation's own standard it was unscoped, and its dispatches would
have travelled by the hand-carry path that bypasses the canon gate entirely.

## What was found

`atom_links` exists with 33,066 rows and **zero property edges**; `applies-to` has never been
written. The per-family key grammar, nine families, produced empirically for the first time.
Two coexisting parcel key grammars mean roughly one fact atom in six cannot reach its parcel.
Ten shipped atom-contract fields at zero in production. The contract is at **1.22.0**, not the
1.7.0 CLAUDE.md recorded, with fourteen versions carrying no ADR.

SEAT-01 had **never fired**: a bad import path, registered on two matchers, throwing
ERR_MODULE_NOT_FOUND and exiting 0 on every invocation. An operator ruling had been made on the
assumption it was enforcing a seat boundary.

The fleet memory promotion step had run **zero times in 215 sessions**, and the 2026-08-08 audit
that measured that had itself changed nothing.

## The five lanes

R-01 through R-04 and R-09 ran in parallel. Four returned. **Three of their findings corrected
the planner**, and the planner's own pre-registration of sixteen predictions lost most of its
bets, which was the correct outcome.

R-01's blueprint exists and **fails its own WDLL** on D1 and D5. R-09 fired: on the correct
revision, `hasWriter`, `atomFamilyState` and `isPartial` each take a second value, with cell
ids and a negative control that holds.

## The planner was wrong ten times

Listed in `ENFORCEMENT.md` under the new instrument section, with the four rules each instance
produced. The shape was constant: **an ad hoc shell instrument returned the expected answer, so
it was not interrogated.** Not one was caught by re-reading a conclusion. Each was caught by a
lane, by a seat, or by a control the planner had built earlier the same day.

The controls caught the planner. The planner's opinions did not.

## Where R-09 landed, and the question it raised

PR 447 merged, canary `cortex-api-00525-bev` at 0 percent running the pinned merge SHA.
`00524-pit` before it was an image race: `image_tag=latest` froze a digest seven seconds before
the intended image was pushed, so a dry-run against it read as an overlay no-op when it was
older code.

The indicators fire, and they fire because the engine script is not on the cortex-api
container. `deriveHasWriter` correctly returns `indeterminate` rather than a fake `false`, so
the honesty is intact. But an "I cannot tell" that is permanently "I cannot tell" is not a
measurement.

**And the fix is already half-built.** `RAIL_ENGINE_BINDINGS` is a committed table shipping
inside cortex-api, and `railEngineBindingCoverage.test.ts` already verifies CI-fail-closed that
every declared writer script exists in a real engine checkout. Declaration in production,
verification in CI, and the consumer probes a filesystem instead. That is OPS-18's governing
line appearing in product code, and it is one wire, not a programme.

## State at close

Nine controls live. Memory loop closed and fired twice, producing M-003 through M-006 — the
first entries ever to reach Tier 1 through the gate rather than by hand.

Seats: property now owns eight repos including plan-review, icc-portal and smartcity-os
(owned, no worktree, so writes stay refused). A new **substrate** seat owns hauska-mcp-server
and hauska-atom-contract. Before that assignment those five repos had no legal write path at
all once SEAT-01 was armed.

## What the next planner should not do

Chase `hasWriter`. It is one wire and R-04's second half exists to enumerate all of them.

**R-01 fails two of its own criteria and R-02b and R-04b both gate on it.** Close R-01 first.
The blueprint cannot be the thing everything grades against while it fails its own standard.

leave_behind:
  - item: R-01 D1 and D5 failures; WDLL never bounded "the canon set"
    owner: planner
    plan_row: R-01
  - item: R-02 quarantine half and R-04 blueprint-mapping half, both gated on R-01
    owner: planner
    plan_row: R-02 / R-04
  - item: canary cortex-api-00525-bev at 0 percent; traffic decision is operator
    owner: operator
    plan_row: R-09
  - item: deriveHasWriter should trust the committed binding; CI already proves it
    owner: property
    plan_row: R-06
  - item: ADR-010 and 77 need superseded-in-detail amendments; ADR-028 needs a ruling
    owner: operator
    plan_row: R-02
