---
id: 2026-06-22_m1_grain_case_recalibration
title: M1 rework — recalibrate at case grain with grain-adaptive pooled read
date: 2026-06-22
status: active
applies_to: hauska
owner: nick
related: [endstate_A_m1_amendment, calibrated_spine_measurement_spec, endstate_A_calibrated_spine, 04a_arrow_two_calibration_capture]
---

# Decision: M1 rework — case-grain earning, grain-adaptive pooled read

## Decision

M1 returned a rework signal. Committed direction: recalibrate the earning loop to earn at the case/prediction grain (where outcomes land), attribute the earned signal to atoms via citation lineage, and read confidence at a grain-adaptive grain (per-atom where dense, section-family/citation-graph/class-within-jurisdiction where sparse, hierarchical partial pooling). The earn bar (W_target) is decision-relative, not a uniform 0.2. Then re-run M1 against this model. Full spec: [`endstate_A_m1_amendment.md`](../_calibrated_spine_roadmap/endstate_A_m1_amendment.md).

## Reasoning

The per-atom independent-Beta model required ~0.82 adjudications/section-year to earn (n*=41 at W_target=0.2) versus a plausible ~0.15/year, so earned fraction was 0.1 to 2 percent. But K2 retrodiction matched historical outcomes at 0.72 to 0.90. The failure is grain and accounting, not reasoning or fuel. The grain-adaptive read was already specified in `04a_arrow_two_calibration_capture.md`; the first run tested a model the spec did not call for. The case is the natural earning unit because that is where ground truth (permits, variances) exists; atoms inherit earned confidence through the citation lineage they were always part of. This is not a reframe of the moat (compounding calibrated reasoning at the supported grain); it is enforcing the design plus naming the earning unit.

## Conditions

- A. Calibration provenance distinguishes pooled-applied from own-earned, so pooling never presents an unearned atom as earned (commitment 2).
- B. Family pooling draws only anonymous and public-tier signal; tenant-private adjudications calibrate within their partition only (ADR-005/017, I5).

## Scope

Structural and citation-graph pooling is buildable now; consequence-class pooling waits on the held ICC ingest. Re-run scoped to structural/citation-graph pooling first.

## Reversal criteria

If the pooled-grain re-run still cannot reach a reachable adjudication rate even at the coarsest defensible grain, then per-atom earned calibration is the wrong frame entirely and we reframe calibration as a case-level product (atoms carry asserted-with-provenance only, calibrated confidence attaches to predictions/cases, not atoms). That is the deeper reframe this rework is the proportionate alternative to.
