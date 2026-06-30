---
id: 2026-06-25_ground_truth_recon
title: Reality and roadmap ground-truth recon — 2026-06-25
status: active
last_updated: 2026-06-25
applies_to: hauska
owner: nick
related: [00_current_state, 04a_arrow_two_calibration_capture, calibrated_spine_roadmap_overview, calibration_architecture_addendum, base_calibration_bootstrap, endstate_A_m1_amendment, _architecture_homes/05_scrub_tracker, _research/2026-06-06_cross_repo_recon, _inbox/2026-06-22_acquisition_acquisition-agent_wave4-dated-edition-harvest]
---

# Ground-truth recon — 2026-06-25

Synthesized from the calibrated-spine and architecture-homes folders, the 2026-06-22 session and decisions, the Wave 4 acquisition close, and the last week of working sessions. Purpose: give the next agent the corrected state so it does not repeat the stale-doc errors this pass surfaced. Sibling to `_research/2026-06-06_cross_repo_recon.md`.

## Live critical path

The single next load-bearing thing is the M1 re-run, the calibrated-spine go/rework gate. M1 has already run once and returned rework on grain and accounting (not reasoning, not fuel), so the next event is a re-run against the case-grain model. Chain, current:

Wave 4 acquisition DONE: edition-correct fuel landed for Austin (full IBC chain plus 2.36M permit rows) and San Antonio (full chain plus ~487K rows); Bastrop edition-correct but outcome-thin (~2 rows, excluded from the gate). Then cc-agent-E ingests the three edition bundles (dispatch drafted 2026-06-25, not yet run). Then cc-agent-C builds and runs K2 edition-correct retrodiction on Austin plus SA and re-runs M1 at case grain (dispatch drafted, not yet run). Nothing downstream (S-track model tier, warming, map fuel, reporting fuel) resources until M1 returns go.

Parallel and off the M1-A path: ICC I-Code body-text ingest unhold (gates Measurement B and consequence-class pooling, not M1-A); phase-2 doc scrub.

## The four-loop calibration model (precise)

Outcome-anchored calibration is four loops over one raw ledger with derive-at-read:

1. Forward live loop (arrow two). Reviewer adjudications plus observed outcomes from live use deposit onto cited atoms. Defined in `04a_arrow_two_calibration_capture.md`. Blocked today: anonymous default tenant means zero authenticated reviewers; gated on the tenant leg.
2. Backtest / retrodiction loop. Predictions run against historical public-record outcomes, edition-correct. Defined in `_calibrated_spine_roadmap/02_base_calibration_bootstrap.md` ("the backtest is the loop run over the past"). This is what the current critical path builds.
3. Model-as-grader loop. A model is a grader of the world, reliability earned against outcomes like a reviewer's, derived at read from model-attribution stamps joined to outcomes. Defined in `01_calibration_architecture_addendum.md` line 61. The S-track, deferred behind M1.
4. Drift / re-validation loop. Amendment-hazard rate plus discrete event invalidation, scoped to section-plus-dependents. Defined in `01_calibration_architecture_addendum.md` line 49.

Load-bearing refinement (2026-06-22): earning moved to the case grain (attribute to atoms via citation lineage, read grain-adaptive); per-atom independent earning abandoned. Source: `endstate_A_m1_amendment.md`, `_decisions/2026-06-22_m1_grain_case_recalibration.md`.

## Ground-truth deltas (docs vs built reality)

The headline: commitment #2 (confidence earned, not asserted) is currently NOT satisfied. `04a` claimed it was, end-to-end; that claim is retracted (see the 04a banner). Confidence today is asserted (plan-review still LLM-self-emitted, F9 open). M1 is the test of whether the case-grain model earns it.

Other deltas a fresh reader must carry:

- Atom/jurisdiction counts. CLAUDE.md still leads with 698 atoms / 4 jurisdictions (Sync-4.5 checkpoint). Truth: 21,126 atoms / 34 jurisdictions, of which only ~478 across 2 (Bastrop B3 193, Grand County/Moab 285) are public-free Layer-1. The corpus was re-minted 100% conformant in the 2026-06-21 phase-1 audit, but live re-ingest is pending network, so the conformant corpus exists in code and may not be live-deployed.
- MCP tools. 46 (three products) to 62 (four product gates: public/codex/reporting/map), with atom_trace / atom_export / read_atom_calibration. Source: 00_current_state, scrub tracker.
- atom-contract. 1.5.0 live (five-value accessPolicy, conformance validator, downloadable-atom export), not the 1.3.0 CLAUDE.md cites.
- Cortex means two things. Per the 2026-06-21 ADR-008 override, Cortex/cortex-api is the reporting function package (not a product); the architect product split to AEC-cortex (scaffolded at P:\AEC-cortex, remote pending). Radar is its own Surface (P:\radar, remote pending). The 40/42/44/07/09/10/25/11 cluster still reads "Cortex the design-accelerator product" behind banners; deep rewrites owed.
- Calibration overlay. Migration 0037 atom_calibration_overlay demoted from source-of-truth to optional read cache; the raw adjudication ledger plus derive-at-read is source of truth ("log raw, derive late").
- Calibration-raw bucket placement. gs://hauska-calibration-raw lives in legacy-design-tools-prod, not hauska-prod-497015; correction deferred to monorepo unpack to avoid re-pulling 2.85M rows (`_decisions/2026-06-22_calibration_raw_bucket_placement.md`).
- Cotality demo quota. 100 req/day (throttling), expires ~2026-07-06. Production Property plus Spatial Tile keys plus display license are the #1 launch blocker; sync to both legacy-design-tools-prod and hauska-prod-497015.

## Stale/contradictory docs a fresh agent would trip on

Reading the CLAUDE.md boot order plus the constitution and 04a, the traps are:

- 04a_arrow_two (status active, was last_updated 2026-06-09): claimed loop-closed / I3-satisfied. Now bannered and retracted. Highest risk because commitment #2 names it directly.
- 00_current_state: top is current; below the fold it is a palimpsest of superseded 2026-06-15 leak-fix and deploy states. Deep rewrite pending.
- 03_structural_constitution_and_drift_guard (Version 2026-06-02): predates the 2026-06-09 partnership-first retirement; invariant set must be cross-read with `_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`.
- 00d_portfolio_roadmap_reference: banner-flagged, body predates the calibrated-spine program; deep rewrite pending.
- The Cortex-as-product cluster (40/42/44/07/09/10/25/11): banner-scrubbed only.

Safe entry points for calibration state: `_calibrated_spine_roadmap/00_overview` plus `endstate_A_m1_amendment`. For homes: `_architecture_homes/00_overview` plus `05_scrub_tracker`.

## Could not verify

Whether the re-minted 21,126-atom conformant corpus is deployed live (docs say pending network); the live deployed MCP tool count (62 is as-built, several deploys described as merged-not-confirmed-live); exact Austin/SA permit-row counts post-K2-ingest (2.36M / 487K are Wave 3 raw landings, pre-retrodiction). K2 and the M1 re-run had not executed as of this recon.
