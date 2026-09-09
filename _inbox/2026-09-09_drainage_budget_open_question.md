---
id: 2026-09-09_drainage_budget_open_question
title: The drainage budget, and the class of work that is too slow for a synchronous report
date: 2026-09-09
status: OPEN — pinned by operator 2026-09-09, no decision made
plan_row: P-120 (OPS-16)
owner: operator decides; r05 lane (doc-repo-55) holds the measurements
snapshot: hauska-engine main b92468b, serving hauska-engine-api-00193-xex digest sha256:25446d8e. All latencies below measured live against production revisions on 2026-09-08/09, not estimated.
related:
  - _inbox/2026-09-07_reports_one_model_recut_WDLL.md
  - _sessions/2026-09-08_p120_unfinished_inventory_claude_code.md
---

# The drainage budget

Pinned at operator request. Nothing here is decided.

## The incident that raised it

The operator ran a Feasibility report twice on parcel `48021:31172` and both
attempts timed out in the UI. The engine SUCCEEDED both times — 201, real
reports — in 148.8s and 90.6s. Property Explorer's BFF aborts at 55s, so the
customer saw a timeout while the engine kept working.

Both runs computed a full drainage study from scratch. The persisted studies
were written at 00:04:34, after both requests finished.

## What was NOT the cause

Recorded because a wrong attribution was made first, and stood for twenty
minutes before it was corrected.

Not the P-120 R-05 changes. Clean paired A/B, same parcel, both warm, two
rounds each:

    old 00189-cej   21.2s / 19.3s
    new 00193-xex   23.3s / 21.7s     both 13 pages, narrative live, 10 cited

About two seconds apart. The original "4.7x regression" claim compared a
cold-instance cold-parcel 90.6s against a fourth-run warm 19.4s — three
variables between two numbers — and led to an unnecessary production
rollback.

Not cold start either: `minScale` is 1.

## What it is

`resolveParcelDrainage` in `report-model.ts`:

    const { study } = await runFloodDrainageStudy(options);   // unbounded

That call fetches a DEM over a padded catchment, runs D8 flow accumulation,
and fetches NOAA rainfall. Nothing caps it. Measured cost of a parcel's FIRST
Feasibility, against the serving revision:

    48021:25549  ordinary cold parcel    37.7s
    48021:31172  operator's parcel      148.8s then 90.6s
    any parcel, study warm              ~20s

A 4x spread between cold parcels, cause unmeasured. Catchment size is the
obvious guess and it is a guess. Picking a budget from the 37.7s parcel would
silently starve every large one, which is the same correlated-sample mistake
this program has now made three times.

## Why a budget alone is not a fix

`runFloodDrainageStudy` RETURNS the study and the author persists it
afterwards. Stop waiting and nothing persists. A big parcel would then time
out at N seconds, save nothing, and repeat the identical work on every
subsequent request — forever.

A naive budget converts "slow once, then fast" into "fast and permanently
thin", for exactly the parcels that most need the study. That is strictly
worse than today.

So the budget only works paired with somewhere for the computation to land.

## The three options, which are different products

**Finish in the background and persist.** Cheapest to write, least reliable:
Cloud Run throttles CPU after the response returns and can reclaim the
instance, so the study may never complete. Must be MEASURED before it is
trusted, not assumed.

**Precompute out of band.** The warm/factory pipeline already exists in this
fleet. The report only ever reads a persisted study. First-run reports are
thin until the sweep reaches the parcel, so coverage has to be visible
somewhere or the thinness is invisible.

**Return "being prepared" and let a second request complete it.** Honest to
the customer and reliable, and the most work: it is a UX change in
hauska-map, not only an engine change.

## The larger shape, which is why this is worth deciding rather than patching

Two separate asks now want the same thing.

The drainage study is too slow for a synchronous report. So is web-search
narrative generation: measured 95s with search against 17.5s without, on the
same parcel and prompt. Both are work whose value is high and whose latency
does not fit inside a customer waiting on a document.

Deciding "where does slow, valuable work go" once answers both. Deciding it
twice, separately, produces two mechanisms that drift.

## What must be true of any answer

Per `ENFORCEMENT.md`: degradation is permitted only when declared. A report
that ships without a drainage study says so, in the document, with the reason
— never a silent thin report and never a fabricated one.

## Not decided

- N, the budget value. Should not be chosen before the 4x cold-parcel spread
  is explained.
- Which of the three options.
- Whether web search rides the same mechanism.
