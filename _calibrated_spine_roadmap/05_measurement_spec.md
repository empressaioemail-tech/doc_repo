---
id: calibrated_spine_measurement_spec
title: Calibrated spine — Measurement A and B spec
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibration_architecture_addendum, base_calibration_bootstrap, calibrated_spine_task_roadmap]
---

# Measurement A and B (the M1 gate)

Determine whether earned calibration thickens faster than amendments reset it (A), and separately size the permanently-asserted safety tail (B). Run against the narrowest invalidation scope we can build, because reset severity is a design lever in our control, not a fixed fact. Where K2 backtest data exists, the adjudication-and-outcome rate is observed, not assumed; elsewhere it is solved for.

## Inputs

| Quantity | Source | Availability |
|---|---|---|
| Amendment hazard lambda per section | code-amendment atoms in the engine corpus | Available now |
| Query frequency q per atom | MCP and retrieval logs | Needs atom-grain attribution (F1); flag if only tool or finding grain today |
| Adjudication and outcome rate a per atom | K2 backtest where history exists; live (X2) otherwise | Observed from backtest; solved-for where no history |
| Prior mu0, strength s0 | assertedConfidence baseline; s0 default 4 to 8 (weak), encodes source quality | Available now |
| Consequence stratum c per atom | ASCE 7 risk category, IBC occupancy and importance (F2) | Derivable after F2 |

## Threshold

Atom i is earned when the 90 percent credible interval width of its Beta(alpha0 + k, beta0 + n minus k) posterior falls below W_target (default 0.2) and n exceeds a small floor so two agreeing reviews cannot fake precision. The required count n*_i is computed per atom from its own prior, not held constant. Earns-within-an-interval test: with mean amendment-free interval 1/lambda_i, atom i earns if a_i times (1/lambda_i) is at least n*_i.

## Measurement A: moat health, query-weighted

Report the sum over atoms of q_i times the indicator that a_i/lambda_i is at least n*_i, divided by the sum of q_i. Where a is observed from backtest, report directly; where unknown, solve for the minimum a that drives the fraction above target (default 0.7). Run at three invalidation granularities (whole-edition, section-scoped, section-plus-dependents) and report the observed-or-required a for each, so the build team sees how much adjudication budget granular invalidation buys back. Output: whether the moat thickens, and the adjudication rate the outcome-capture leg must deliver.

## Measurement B: safety-tail size, consequence-stratified

Same machinery, restricted to the top consequence stratum, weighted by c not q. Report the earned fraction and median time-to-earn at a plausible a. The expected result, the top stratum rarely earns, is not a failure; it is the spec output that sizes the permanently-asserted tail the actuation-refusal model (S4) must cover. Both measurements are needed: A alone ships a real moat sitting on an invisible safety hole; a uniform measurement alone condemns a head that is actually fine.

## Decision rule

If A shows the required adjudication rate is unreachable even at section-plus-dependents granularity, the spine needs rework, not refinement. If A is reachable and B's tail is large, the moat is real and the refusal model is mandatory before any actuator socket. Both are likely true at once, which is expected.

## Note

This is the one execution item that gates the rest, and the K2 backtest is what lets it return a measured answer rather than a hypothetical before any client arrives.
