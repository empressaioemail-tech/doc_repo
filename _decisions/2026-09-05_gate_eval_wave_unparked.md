---
decision_id: 2026-09-05_gate_eval_wave_unparked
date: 2026-09-05
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
  - _inbox/2026-09-05_ledger_serving_audit
---

## Decision

The "gate eval wave" (promoting the 7 rails currently serving via a frozen
one-time manual gate verdict into a real recurring gate slate) is reversed
from deferred back to active, run alongside the sprint's remaining waves
rather than after them.

## Context

Earlier the same day, the operator ruled this wave explicitly out of scope
("gate eval stays parked"), reasoning that QA and market-readiness work on
the rest of the app could run in parallel without it. The operator reversed
that ruling directly: the 7 rails in question are `marketValue`,
`assessedValue`, `landValue`, `improvementValue`, `livingAreaSqft`,
`yearBuilt`, and `utilityService` — the CAD dollar fields and utility data a
CTX-facing product is being taken to market on. Treating the mechanism that
keeps that data honest as post-launch cleanup was a scoping error: this is
the data the app serves, not a background hygiene task.

## Structural commitment check

Quality gate rule (`CLAUDE.md`): every output carries source attribution,
confidence score, timestamp. A frozen one-time verdict cannot satisfy this
on an ongoing basis — it is a snapshot dressed as a live signal. ENFORCEMENT.md's
governing rule applies directly: a verdict that was correct once, is never
re-checked, and still gets served as current is "an artifact that exists, is
correct, and does nothing" the moment the underlying data drifts.

## Reasoning

These 7 rails are allowlisted and serving today only because someone ran the
gate by hand once (`_inbox/2026-09-05_ledger_serving_audit.md`, layer-2
table). No scheduled job re-evaluates them; a future writer regression or a
CAD re-ingest that changes a value would never be caught, because nothing is
watching. That gap was tolerable as a "known, tracked, deferred" item while
the wave's other launch-blocking work was still open. It stops being
tolerable once the product built on top of this exact data is going to
market — at that point "we know it's not being re-checked" is no longer a
scoping note, it's an unmonitored dependency the launch is standing on.

## Reversal criteria

If a future review finds the 7 rails' underlying CAD/utility source data is
provably static (never re-ingested, never re-derived) for the counties in
scope, a one-time verdict would be sufficient and this wave could be closed
as unnecessary rather than shipped. Not the case today — CAD data is
re-ingested per county on a recurring basis.

## Dependencies

Sequenced after Factory's in-flight item 10 (atoms-side owner-rail
cross-check) completes, per operator instruction to let the current track
finish first. Mirrors the pattern already proven for `overlayDistricts` /
`maxImperviousCoverPct` (PR #91) and `zoningDistrict` (PR #94) — a new
`SLATE_1D`-equivalent rail-keys array folded into `DEFAULT_SCHED_RAIL_KEYS`
in `factory-publish-gate-sched.mjs`, verified against a one-time regression
check that automated criteria reproduce the existing frozen verdicts before
cutover.

## Counterparties

Internal: Factory lane (`cente-b5`, implements), operator (ruling).
