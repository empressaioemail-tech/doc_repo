---
id: 2026-06-25_calibration_ground_truth_and_doc_audit
title: Session — world-model framing, Wave 4 fuel landing, four-loop ground truth, doc-supersession audit
date: 2026-06-25
type: session
applies_to: hauska
owner: nick
related: [04a_arrow_two_calibration_capture, calibrated_spine_roadmap_overview, calibration_architecture_addendum, base_calibration_bootstrap, endstate_A_m1_amendment, _research/2026-06-25_ground_truth_recon, _inbox/2026-06-22_acquisition_acquisition-agent_wave4-dated-edition-harvest]
---

# Session summary — calibration ground truth and doc-supersession audit

Strategic session, no product code touched. Started from a LeCun world-model interview transcript and ran through to a reality-and-roadmap ground-truth pass plus a doc-cleanup audit. Two dispatches drafted and hand-carried; one correctness fix and a ground-truth record committed. The substantive output is a corrected understanding of where the calibration program actually stands against structural commitment #2.

## What happened

World-model framing. Worked the LeCun AMI/JEPA thesis (predict consequences of actions, plan by search, abstract-not-pixel representation, objective-driven constraints, data efficiency via earned models) against our architecture. Conclusion held at planning altitude: we are not building JEPA and should not; our domain is largely the language substrate where LLMs are the right tool, and our edge is the earned-calibration flywheel plus the atom catalog as an explicit abstract world-representation, not trained weights. The one genuine fit for an open vision/world model (DINO/V-JEPA lineage, not AMI which has no consumable product) is the spatial leg: a queued, cost-driven probe at the uncached, imagery-derivable Cotality seams (the brokerageGisLayers.ts per-CLIP quota burn), leaving authoritative layers (flood, risk, ownership) bought. Not opened; queued behind the launch gates.

Cotality / spatial correction. Corrected an under-weighting: spatial awareness is core, not a sliver. Cotality is our rented perception layer (the physical-property world model we consume as structured records), which is the correct architecture; vision models only earn a place at Cotality's cost-and-coverage seams.

Next move in AI, reframed. "AI training" for us is not foundation pretraining or fine-tuning; it is making the calibration loops earn. The bottleneck is fuel (historical public-record outcomes plus historical code editions), and the gate is Measurement M1.

Wave 4 fuel landed. The acquisition agent closed Wave 4 (`_inbox/2026-06-22_acquisition_acquisition-agent_wave4-dated-edition-harvest.md`): edition-effective-date tables plus ten distinct-SHA256 adoption-ordinance PDFs for Austin (full IBC chain 2012/2015/2021/2024, paired with 2.36M Wave 3 permit rows), San Antonio (2015/2018/2021/2024, ~487K rows), and Bastrop (2018 IBC plus 2026 BDC, edition-correct but outcome-thin at ~2 permit rows). Uniform public-record, interpreted_fields false, no tenant tooling. This clears the 33-of-34 single-edition blocker for the two metros that carry the M1 decision.

Two dispatches drafted (hand-carried, not yet run). cc-agent-E: ingest the three Wave 4 edition bundles via the existing ingestEditionBundle / resolveEditionAtDate path (adoption-window ingest only; I-Code body text stays on the separate ICC-licensed path). cc-agent-C: build the K2 edition-correct retrodiction harness on Austin plus San Antonio (predict with the edition in effect at each permit date, de-confound approved-clean vs approved-with-condition, deposit backtest-provenance evidence via citation lineage), then re-run M1 at the case grain per the amendment. Sequence: E then C.

Ground-truth and doc-audit pass (two background agents). Located the earlier doc audit (2026-06-19, project-refresh) and ran a week-synthesis ground-truth pass. Findings filed at `_research/2026-06-25_ground_truth_recon.md`.

## Decisions and corrections

- Commitment #2 is currently NOT met, and a doc said it was. `04a_arrow_two_calibration_capture.md` claimed the deposit loop is closed and invariant I3 (confidence earned, not asserted) is satisfied end-to-end. Retracted: confidence today is still asserted (plan-review number still LLM-self-emitted, task F9 open); migration 0037 is demoted to a cache, not the source of truth. M1 at case grain is the gate that tests whether commitment #2 is earned. 04a now carries a supersession banner.
- The four loops, stated precisely: forward live loop (arrow two, 04a) + backtest/retrodiction loop (`02_base_calibration_bootstrap.md`) + model-as-grader loop (`01_calibration_architecture_addendum.md`) + amendment-hazard-plus-event drift loop (`01`), all over one raw ledger with derive-at-read. Earning re-grained from per-atom to the case grain (`_decisions/2026-06-22_m1_grain_case_recalibration.md`).
- Correction to prior in-session claim: the 0.898 Austin / 0.723 San Antonio retrodiction numbers are from the first M1 run, not the Wave 4 fuel. They evidenced sound reasoning under a wrong grain; the Wave 4 fuel has not been retrodicted yet.

## State at close

Wave 4 fuel committed and verified in GCS. Dispatches E and C ready to hand-carry (E first). M1 re-run is the live gate; nothing downstream (S-track model tier, warming, map fuel) resources until it returns go. The number-one external clock is unchanged: production Cotality keys, demo tier expires ~2026-07-06.

## Open threads / next steps

- Hand cc-agent-E the ingest dispatch, then cc-agent-C the K2-plus-M1 dispatch on E's close.
- Doc-cleanup queued (not done this session, scoped for a dedicated pass): CLAUDE.md headline corrections (atom/jurisdiction counts 698/4 to 21,126/34 with the ~478-public/2-jurisdiction split, MCP tools 46 to 62 / four gates, atom-contract 1.5.0, commitment-2 wording to the four-loop model with M1 pending); the Cortex-as-product cluster deep rewrites (40/42/44/07/09/10/25/11); 00d and the 00_current_state deep palimpsest; the calibrated_spine homes correction. All tracked in `_architecture_homes/05_scrub_tracker.md` and `_research/2026-06-25_ground_truth_recon.md`.
- Git hygiene queued as its own pass (from the 2026-06-19 audit, still open): add `.gitattributes` plus renormalize to kill the CRLF phantoms; add `_tmp_*` to `.gitignore`; clean the ~35 root `_tmp_*` probes, preserving cited execution artifacts like `_tmp_k1_wave4_dated_edition_harvest.py` (move, do not delete). Held off this session because a repo-wide renormalize collides with the other agents in the shared clone.
- ICC I-Code ingest unhold (parallel, off the M1-A path; gates Measurement B).

## Discipline reminders carried forward

Earned-not-asserted is a present claim only after M1 returns go; do not say calibrated before it is real. Tenant sovereignty (private adjudications never pool). No special-access data; Bastrop's thin fuel stays thin rather than reaching for tenant tooling. Rail-quiet. No timeframe estimates. Route brand moves through catalog-thesis-check, load-bearing commitments through premortem-check.
