---
id: 2026-09-09_report_latency_budget_composition_finding
title: Two report latencies were each measured against the budget separately, and their sum has never been measured
date: 2026-09-09
last_updated: 2026-09-09
status: open
applies_to: hauska-engine, hauska-map
plan_rows: [P-120]
seat: integration (doc_repo)
severity: launch-surface
snapshot: serving hauska-engine-api-00198-cir, digest sha256:2af8119c, engine f2535f4, Cloud Build 7a11d9e6 at 2026-09-09T01:07:36Z. Read by field 2026-09-09. The composed latency below is NOT measured; that is the finding.
related:
  - _inbox/2026-09-09_drainage_budget_open_question.md
  - hauska-engine PR #412, PR #413
---

# The report's latency budget has two consumers and one measurement each

## What is actually true

Property Explorer's BFF aborts a Feasibility compose at 55 seconds. Two separate pieces
of work run inside that budget and each was measured, carefully, against it alone.

**Drainage.** `resolveParcelDrainage` calls `runFloodDrainageStudy` unbounded. Measured
on the serving revision: 37.7s on an ordinary cold parcel, 148.8s then 90.6s on the
operator's parcel `48021:31172`, roughly 20s once the study is warm. A 4x spread between
cold parcels whose cause is unmeasured. Recorded in
`_inbox/2026-09-09_drainage_budget_open_question.md`, pinned by the operator, undecided.

**Narrative.** Shipped to production overnight as engine PR #412, on by default, model
`grok-4.3` at 12.7s. That PR did the right thing: it rejected `grok-4.6` at 74.1s
explicitly because it did not fit the 55s budget, and it names the drainage problem as
unchanged and out of its scope.

Neither of those is careless. Each one checked itself against 55 seconds.

## The finding

**Nobody has measured a report that pays both costs.** Every figure above is a
single-consumer measurement, and the budget is shared.

On a cold parcel the two published numbers sit near enough to the ceiling that the
question is real rather than theoretical, and I am deliberately NOT stating a sum here.
Adding 37.7 to 12.7 and reporting 50.4 would be composing two measurements taken on
different parcels, on different revisions, under different warmth conditions, and
presenting the result as though an instrument produced it. That is the error class this
program has now made repeatedly and it is exactly what this document exists to avoid.

What can be said without an instrument: the margin the narrative decision spent was the
same margin the drainage decision was going to need, and the two decisions were made by
different sessions on the same day without either seeing the other.

## Why it matters now rather than later

The operator ruled on 2026-09-09 that the Feasibility report is a launch surface
alongside the map, and that both must be correct. A report that returns 200 from the
engine while the customer sees a timeout is not correct, and that failure mode is already
documented: the engine succeeded twice on `48021:31172` while both attempts timed out in
the UI.

## What would settle it

One paired measurement on the current serving revision, on the same parcel, back to back:
a cold-parcel Feasibility with narrative on, and the same parcel with
`narrativeGenerate: false`. Report both wall times and whether the BFF returned or
aborted. A cold parcel means one whose drainage study is not persisted; the study is
persisted after the first run, so this is a one-shot measurement per parcel and the
parcel selection is part of the method.

Do not pick the fast parcel. The 4x cold spread is unexplained, and choosing the 37.7s
parcel to size a budget is the correlated-sample mistake this program has made three
times.

## What this does to the drainage decision

It raises its urgency without changing its answer. The operator has already ruled for
precompute out of band, on 2026-09-09, over finish-in-background and
return-being-prepared. That ruling stands and this finding strengthens it: once the study
is persisted, only the narrative's 12.7s is paid at request time and the budget question
largely dissolves.

The condition on that ruling is unchanged and is now load-bearing twice over: coverage
has to be visible somewhere, or a parcel the precompute sweep has not reached produces a
thin report indistinguishable from a complete one. That visibility is `absentFields`,
which is CTX-FAMILIES' surface.

## Also unmeasured, and named because PR #412 named it first

Cost per report, now that every report makes an LLM call by default. The PR records the
tick count as not captured. That is a live unit-economics input at launch and it touches
structural commitment three's compute half, which is the only half of that commitment
with a working instrument.

## Open

The paired cold-parcel measurement above. Owner unassigned; it belongs with whoever takes
the drainage precompute card.

Cost per report per model. Owner unassigned.
