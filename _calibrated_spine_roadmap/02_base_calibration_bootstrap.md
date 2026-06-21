---
id: base_calibration_bootstrap
title: Base calibration bootstrap — getting calibrated before clients
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibration_architecture_addendum, calibrated_spine_measurement_spec, calibrated_spine_task_roadmap, calibrated_spine_agent_execution_model]
---

# Base calibration bootstrap

## The problem

Warming alone does not calibrate. Warming is arrow one at scale: it produces predictions, fills the cache, and populates the conflict and triage overlays, but it generates no outcome and no adjudication, so calibratedConfidence stays at the asserted baseline. If clients are the only fuel, then on day one every confidence number on the map and in every report is asserted, which is the exact hype trap the positioning section retires. We need a base level of calibration earned before the first client, and clients will continue to calibrate it over time after.

## The mechanism: the backtest anchor

Public-record outcomes also exist historically. Permits, inspections, variances, and incidents are public record in Texas not only going forward but going back. We run the substrate's predictions retrospectively against outcomes that already happened, which is backtesting, and a backtest produces real, outcome-graded calibration signal with no live client because the ground truth already exists. The forward loop and the backtest share the same ledger, the same overlay, the same read-contract, and the same public-record classification. The backtest is the loop run over the past.

## The bootstrap stack, strongest to weakest

All four flow through the same machinery and all are provenance-tagged so base is never presented as live-earned.

Historical backtest, the anchor. For each historical case, the substrate predicts the finding using the code edition in effect at that case's date, then compares to the recorded outcome and deposits it as outcome-graded evidence with provenance backtest. This is real calibration, earned against real outcomes, available pre-launch.

Expert seed gold set, the tail coverage. A budgeted multi-expert adjudication pass over a curated, consequence-stratified sample, deliberately weighted to the high-consequence tail the backtest under-covers because catastrophes are rare in any historical record too. Multiple experts on the same items also seed the inter-adjudicator agreement the grader model needs. This is part of what the one-hour-per-jurisdiction human-review budget buys. These are our own experts, not city-provided data.

Labeled weak priors, triage only. Cross-source agreement (engine corpus versus ICC, D8 versus FEMA) and a stronger-model-as-judge pass, used only to prioritize where the scarce seed-review budget goes and as clearly-labeled weak priors, never as a calibration anchor, because model-grading-model and agreement-with-priors are the circularity trap.

Asserted baseline, the floor, under everything.

## Historical-data acquisition is the first dependency and has no fallback

There is no fallback onto cities providing data as a partner, and no jurisdiction gets special-access treatment. The backtest anchor stands or falls on how much historical public-record data we can acquire through public means applied uniformly to every jurisdiction: public permit and inspection portals, bulk public-records access, and scraping where permitted. No city relationship is leveraged for data, no tenant integration is a data path, and the SmartCity OS deployment is not an acquisition shortcut. Bastrop is acquired through the same public-record process as every other jurisdiction, with no sequencing privilege and no use of any tenant-side tooling; if its public portal is easy to pull, that is a property of the public portal, not of the relationship. Because there is no safety net, acquisition must be maximal in coverage and quality across the footprint. Treat acquisition breadth and cleanliness as the gating quality bar for the whole calibration program, not as a preliminary step. Everything stands on its own merit through the processes we are putting in place now.

## Requirements the backtest imposes

Edition-correct retrodiction. The substrate must predict with the code edition in effect at the historical case's date, not today's edition. This is exactly what the edition-scoped corpus and code-amendment atoms exist to support. Depth of edition history in the corpus is a verify-first item; if historical editions are shallow, acquisition must include the historical code editions as well as the permit records.

Historical-outcome de-confounding. An approved-with-variance permit is not the same evidence as an approved-clean one. The grader discipline applies to historical data: distinguish approved-clean from approved-with-condition or variance so the outcome signal is real.

## What this buys, and its honest limits

Base calibration will be uneven, strongest where historical permit data is deep, thinning across other jurisdictions, and weakest on the rare high-consequence tail. That unevenness is honest and the map renders it via calibration provenance. The backtest also gives a real observed adjudication-and-outcome rate for historical jurisdictions, so Measurement A becomes measure-against-backtest where history exists rather than purely solve-for-the-unknown, which is a far stronger pre-launch signal. See [`05_measurement_spec.md`](05_measurement_spec.md).

## Multi-agent shape

The bootstrap is fanned across agents and is the most multi-agent part of the program. Acquisition, the retrodiction harness, historical-outcome de-confounding, and the gold-set tooling are separable units with their own owners, run in parallel against disjoint file sets. The calibration engines that consume the bootstrapped evidence (grader, meta-calibration) are split across the two cortex-api clones to avoid collisions. Ownership and parallelization in [`06_agent_execution_model.md`](06_agent_execution_model.md); task units K1 through K6 in [`04_task_roadmap.md`](04_task_roadmap.md).
