---
id: endstate_A_calibrated_spine
title: End-state A — calibrated spine
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibrated_spine_task_roadmap, calibration_architecture_addendum, base_calibration_bootstrap, calibrated_spine_measurement_spec, calibrated_spine_agent_execution_model]
---

# End-state A: calibrated spine

## Definition of done

Confidence is shaped honestly: three axes (accuracy, source-quality, severity) plus a calibration-provenance field, returned as a widthed read-contract object with no scalar accessor. The LLM-self-emitted plan-review number is replaced by the raw-adjudication calibration loop. The drift model is amendment-hazard plus discrete event invalidation, with the launch floor as the hazard cold-start prior. A base level of calibration is in place via the backtest before any client. Measurement A has returned a go signal. The model tier (grader, meta-calibration, active learning, weighting, refusal) is scaffolded with its inputs recorded, deferred to earn on backtest then live fuel.

## Tasks

Foundational: F0 verify-first, F1 per-atom read attribution, F2 consequence metadata, F3 rich raw ledger, F4 read-contract object, F5 raw-conflict log, F6 three-axis contract, F7 granular invalidation, F8 drift model, F9 close the present-tense violation.

Base calibration: K1 to K6 (see [`02_base_calibration_bootstrap.md`](02_base_calibration_bootstrap.md)).

Gate: M1 (see [`05_measurement_spec.md`](05_measurement_spec.md)).

Deferred model tier: S1 to S5.

Forward fuel: X1 to X3.

Full task detail and owners in [`04_task_roadmap.md`](04_task_roadmap.md).

## Acceptance criteria

- No surface or MCP tool can emit a confidence number without its n, width, and provenance. Attempting to is a type error, not a lint warning.
- Plan-review confidence is the raw-adjudication loop output, never the LLM's emitted number.
- Every atom carries enough metadata to derive its consequence stratum from code risk classifications, with no invented severity scalar stored.
- The ledger stamps source-event-type, adjudicator identity and role at judgment, and model attribution; agreement, posterior, and reliability are all derived at read.
- An amendment to a section invalidates calibration at section-plus-dependents scope, not whole-edition, and the validity of a belief decays on a per-class hazard rate with the floor as its cold-start prior.
- Base calibration exists with provenance backtest on the jurisdictions where historical data was acquired, clearly distinct from asserted and from live.
- Measurement A has run (measured where backtest data exists, solved-for elsewhere) and returned go at some invalidation granularity; Measurement B has sized the safety tail.

## Reports back

Each F, K, M, S, X close goes to `_inbox/` with the task id, the PR or commit, verified raw output, and any contradiction of the gap-analysis hypothesis. F0 closes rewrite [`03_gap_analysis.md`](03_gap_analysis.md) where reality differs.
