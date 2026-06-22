---
id: endstate_A_m1_amendment
title: M1 amendment — grain-adaptive, case-grain calibration
status: active
last_updated: 2026-06-22
applies_to: hauska
owner: nick
related: [endstate_A_calibrated_spine, calibrated_spine_measurement_spec, calibration_architecture_addendum, 04a_arrow_two_calibration_capture, _decisions/2026-06-22_m1_grain_case_recalibration]
---

# M1 amendment: grain-adaptive, case-grain calibration

## Why

The first M1 run tested a per-atom independent-Beta earn model and returned rework. At W_target=0.2 the per-atom earn bar was n*=41, so the required adjudication rate was about 0.82 per section-year (section-scoped, the finest tested grain), against a plausible pre-client rate of about 0.15 per year. Earned fraction came out 0.1 to 2 percent. Yet K2 retrodiction matched historical local-code outcomes at 0.898 (Austin) and 0.723 (San Antonio). So the reasoning is good and the fuel is real; the failure is grain and accounting. This confirms, empirically, the grain-adaptive design already specified in `04a_arrow_two_calibration_capture.md` (per-atom where dense, per-class where sparse). The first run measured a model the spec did not call for.

This amendment is not a reframe of the moat. The moat is compounding calibrated reasoning at the grain the data supports; per-atom independence was never the claim.

## The refined calibration model

1. Earn at the case grain. The unit of earning is the prediction-against-outcome (a permit, a variance, a BOA case), where ground truth actually lands. K2 already matches at this grain. Per-atom independent earning is abandoned as the primary loop.

2. Attribute to atoms via citation lineage. A case's earned signal deposits onto the atoms it cited (`findings.citations[].atomId`). This is arrow two's existing deposit path; no new capture is needed.

3. Read at the supported grain (hierarchical partial pooling). Atom confidence is read per-atom where its own accumulated signal is dense, and pooled up to the section-family / citation-graph / class-within-jurisdiction grain where it is sparse, so atoms borrow strength. This is the grain-adaptive read `04a` specified.

4. Decision-relative earn bar. W_target is set by the decision the confidence drives, not a uniform 0.2: coarse for ranking atoms by reliability, tighter only for gating actuation on the high-consequence tail. The earn bar is a function of use, not a constant.

## Two conditions (premortem, load-bearing)

- A. Provenance distinguishes pooled-applied from own-earned. The read-contract calibration provenance must carry a grain/source descriptor so a family-grain-earned number applied to an atom is never presented as that atom's own earned number. Pooling must never launder an unearned atom into an earned one. (Commitment 2.)
- B. Sovereignty within partition. The family/pooled posterior draws only anonymous and public-tier signal. Tenant-private adjudications calibrate only within their own tenant partition and never feed the shared family number. (ADR-005/017, invariant I5.)

## Scope and sequencing

- Buildable now: structural and citation-graph pooling (section-family, link-graph closure), case-grain earning, lineage attribution. These need only the local-code data already in hand.
- Deferred: consequence-class pooling needs the F2 consequence data behind the held ICC ingest. Cut the first re-architecture to structural/citation-graph pooling; add consequence-class pooling when ICC unholds.
- Corpus reality: the link-graph closure must be loaded from the corpus (the first run used closureSize=1 for all atoms, which understated the required rate); and there are zero amendment atoms, so the amendment hazard rate stays at its cold-start prior until the edition/amendment ingest lands.

## Re-run

Re-run M1 against this model (see the M1 re-run section in `calibrated_spine_measurement_spec.md`). Measurement A's earned fraction is computed at the read grain (pooled where sparse), query-weighted, not per-atom-independent. Measurement B (consequence-stratified) stays parked until ICC unholds. The decision rule is unchanged: go if the query-weighted earned fraction at the pooled read grain clears target at a reachable adjudication rate; rework if not even the coarsest defensible grain reaches it.

Everything downstream of M1 (the S-track model tier, warming, map fuel layers, reporting fuel) stays parked behind the re-run.
