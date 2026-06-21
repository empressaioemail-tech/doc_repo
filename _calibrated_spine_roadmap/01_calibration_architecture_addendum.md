---
id: calibration_architecture_addendum
title: Calibration architecture addendum
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibrated_spine_roadmap_overview, base_calibration_bootstrap, calibrated_spine_measurement_spec, 04a_arrow_two_calibration_capture, 55_spine_data_intelligence_stack]
---

# Calibration architecture addendum

Extends the arrow-two calibration spec (`04a_arrow_two_calibration_capture.md`) and the spine data-intelligence stack (`55_spine_data_intelligence_stack.md`). Decision-grade on the principle and the contract shapes; hypothesis-grade on the models, which are deferred by design until fuel exists. Produced from a three-session adversarial synthesis between the planner and external reasoning agents, stress-tested to convergence.

## The keystone principle: log raw, derive late

Append-only immutability is an argument against storing interpreted quantities and for storing raw signal richly. A posterior, a typed conflict label, a severity scalar are all lossy interpretations frozen at the moment we understand them worst. Every quantity that is derived, typed, or modeled is computed at read time from raw events, not written at deposit time. This collapses what looked like five schema bets into two genuine ones (a rich raw ledger and a read-contract object) and removes premature-taxonomy risk.

## The three-axis confidence contract

State these as three distinct axes so that consequence being asserted coexists with the second structural commitment instead of reading as an exception to it.

Accuracy axis: calibratedConfidence. Earned against outcomes. Commitment #2 governs only this axis.

Source-quality axis: assertedConfidence baseline. Asserted with provenance, set on every write. Legitimate; commitment #2 does not govern it.

Severity axis: consequence. Asserted, audited, asymmetrically ratcheted (outcomes can raise it quickly, lower it only slowly), sourced from the codes' own risk classifications (ASCE 7 risk category, IBC occupancy and importance factors), never an invented number. Commitment #2 does not govern it. Insurers and sureties distrust self-graded confidence, not asserted-and-audited severity schedules, which are their native language.

A fourth field rides the accuracy axis: calibration provenance, one of asserted, backtest, seed, or live, so base calibration is never presented as live-earned. See [`02_base_calibration_bootstrap.md`](02_base_calibration_bootstrap.md).

## Corrected bet list

Keep and do now, because irreversible and cheap:

Rich raw ledger. Every deposit stamps source-event-type and provenance, the subject key, and adjudicator identity and role at time of judgment. Store success and trial counts at finest grain. Add a model-attribution stamp (model id and version, prompt and context template version, sampling params, retrieved atom-set id). Never persist a derived number; agreement, posterior, and per-model reliability are derived at read.

Read-contract object. Calibrated confidence and its n and width and provenance are one inseparable object with no scalar accessor. Unwidthed, unsourced confidence is unrepresentable. This is the single best schema-shaped protection of the honesty discipline.

Raw-conflict log. On synthesis output, record the disagreeing inputs with provenance and vintage; derive the conflict type at read, no frozen enum.

Consequence-derivable metadata. Atoms carry discipline, ASCE 7 risk category, IBC occupancy and importance, and location, enough to derive severity from the codes' own classifications. Do not store an invented severity scalar.

Drop or replace:

Generic overlay subject: dropped as an early bet. YAGNI, and the upper rungs it would serve are un-earnable at this domain's data rates. Revisit only when meta-belief shape is concrete.

Materialized per-atom posteriors: dropped. Compute posterior-at-grain at read from stored counts, aggregating to class when atom-grain n is too small.

Protected drift floor as a standalone mechanism: replaced. Validity is governed by an amendment hazard rate (estimated from code-amendment atoms) combined with discrete event-driven invalidation (source-set-drift). The launch floor is the hazard rate's own conservative cold-start prior that earns out, not a second instrument.

## Govern actuation, not silence

Consequence gates the action, never the prediction. Predict and log the outcome always, including on thin high-consequence cases, because refusing to predict starves the very tail that most needs to learn. Refuse to act, or flag human-required, when an answer is thin and high-consequence. Govern silence is the wrong verb and a launch hazard; govern actuation is correct and is the precondition for any actuator socket.

## Model deferral and sequencing

Close the present-tense violation first: replace the LLM-self-emitted, uncalibrated confidence in plan review with the raw-adjudication calibration loop, emitted through the read-contract object.

Defer the model tier (grader, meta-calibration, active learning, earned model weighting, actuation-refusal) until base calibration and live fuel exist. Production runs an anonymous default tenant today, so there are no authenticated reviewers and effectively zero per-tenant signal; the grader's own safety criterion (anchor on real outcomes, never on the system's own beliefs) is blocked until outcomes exist. The base-calibration bootstrap (backtest over historical public-record outcomes) is what provides outcome-anchored signal before clients arrive. Record the inputs now; build the models on backtest fuel first, then on live fuel.

Model weighting is a grader problem: a model is a grader of the world, its reliability earned against outcomes like a reviewer's. It inherits all three disciplines for free and is derived at read from the model-attribution stamps joined to outcomes. The only routing move that does not wait on fuel is consequence-gated routing (stronger model on the high-consequence stratum, cheap model on the low), shipped labeled asserted until earned weights replace it.

## The fuel line

The moat compounds at the speed of ground truth, and outcome-data access is the rate limiter. Forward fuel is public-record AHJ outcomes (permit, inspection, incident records, public record in Texas). Classify outcome data by public-record status, not by submitter: public-record outcomes pool freely into public calibration without violating sovereignty and without reducing cities to data-sourcing licensors; private enterprise-tenant adjudications stay sovereign. The pre-client form of the same fuel is the historical backtest in [`02_base_calibration_bootstrap.md`](02_base_calibration_bootstrap.md).

## Positioning

Stop saying the one calibrated source the industry has to reference to be correct; at launch that is itself an asserted claim, the hype trap elevated to the brand. Launch language: the source that shows its work, with provenance, citation, and audit on every output, built to earn calibration where outcome signal exists. Do not claim calibrated until calibration is real and Measurement A shows query-weighted thickening.
