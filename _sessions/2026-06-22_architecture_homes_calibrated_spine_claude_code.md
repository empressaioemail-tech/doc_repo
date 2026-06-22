---
id: 2026-06-22_architecture_homes_calibrated_spine
title: Session — architecture-homes standard, calibrated-spine program, phase-1 audit, doc scrub
date: 2026-06-22
type: session
applies_to: portfolio
owner: nick
related: [architecture_homes_overview, calibrated_spine_roadmap_overview, 80_adrs/adr_008_engine_factor_out, _decisions/2026-06-21_adr008_cortex_reframe_override, calibrated_spine_agent_execution_model, architecture_homes_scrub_tracker]
---

# Session summary — architecture homes + calibrated spine

Long session (work 2026-06-21 into 2026-06-22). Three connected bodies of work: a calibrated-spine build program synthesized from external reasoning-agent threads, an architecture-homes standard that fixes where every function and atom lives, and a phase-1 audit plus doc scrub that begins enforcing the standard. All commits are on `origin/main` through `2763a43`.

## What happened

Calibrated-spine program. Synthesized a multi-thread exchange (consciousness-vs-self-modeling, recursive calibration, an adversarial stress test) into a buildable program. The keystone is "log raw, derive late": the raw adjudication ledger is the source of truth and confidence is derived at read, never stored. Authored [`_calibrated_spine_roadmap/`](../_calibrated_spine_roadmap/00_overview.md): five end-states (calibrated spine, warm/report-ready, white-label map, reporting surface, spine console), a base-calibration bootstrap (backtest against historical public-record outcomes, no city-data fallback, no special access), Measurement A/B as the go/rework gate, and an agent execution model. Ran Waves 1 and 2 across the cc-agent fleet; closes filed and committed.

Architecture-homes standard. Clarified the homes: atoms and reasoning on the spine (hauska-engine); the gate (hauska-mcp-server); reporting is cortex-api (the reporting function package); spatial layers and the operator console are hauska-map; plan review is Codex; the architect product (renders, design tools, deliverable UX) splits to a new repo AEC-cortex; Radar is its own Surface. "Surfaces" is a repo classification, each surface its own repo. Authored [`_architecture_homes/`](../_architecture_homes/00_overview.md): homes/topology, atom lifecycle and ownership (including user-generated tenant-private parcel/project atoms and the downloadable-atom export), the MCP gate rework and agent surface, the audit-first sequence, the scrub tracker, and the model-registry-and-routing workstream.

Phase-1 audit. Seven-agent audit/cleanup, all closes in. AC shipped the atom conformance target and downloadable-atom export and published `@hauska/atom-contract@1.5.0`. E re-minted the corpus born-correct (21,126 atoms 0 to 100% conformant; live re-ingest pending network). C backfilled the mutable/tenant families (migration 0044) and scaffolded `P:\radar`. C2 audited the calibration-engines. R scaffolded `P:\AEC-cortex` and produced the full legacy-design-tools decomposition map. The map agent built the console audit instrument (downloadable-atom inspector, E8 Agent View, report-to-manifest contract, header-docked window). M did the Track C gate rework: four product gates (public/codex/reporting/map), 62 tools, atom_trace/atom_export/read_atom_calibration, 1.5.0 conformance, migration 003, plus the phase-3 onboarding/metering design.

Doc scrub. Banner-floor scrub across the boot path and the reframe-affected set (50 fully scrubbed; 44/52/07/40/42/00/00c/00d/README/10/01a/25/calibrated-spine bannered; keystones done). Tracker holds the remaining tail and the deep-rewrite worklist.

## Decisions

- ADR-008 override granted: Cortex reframed from the design-accelerator product to the reporting function package; architect tooling splits to AEC-cortex. Recorded in [`_decisions/2026-06-21_adr008_cortex_reframe_override.md`](../_decisions/2026-06-21_adr008_cortex_reframe_override.md); ADR-008 amended; ran through catalog-thesis-check.
- No special-access data: no jurisdiction (Bastrop included) gets relationship or tenant-integration data; all acquisition runs the uniform public-record process. Memory written.
- Regrid is purged; Cotality is the sole parcel/property spine. Live docs scrubbed; memory written.
- Calibration overlay (0037) demoted to cache; raw ledger plus derive-at-read is source of truth.
- Model selection is the calibration thesis applied to models (registry + consequence-gated routing + earned weighting + new-model watch); captured as a phase-3 workstream.
- Warming reads cached snapshots only, never live Cotality (post-Regrid quota guardrail).

## State at close

Standard ratified and active. Phase-1 audit complete. New feature building frozen pending the doc scrub and the audit. SmartCity OS left untouched (live prod; becomes a spine consumer later). The localhost spine console runs at `hauska-map` (localhost:5173). All doc work committed and pushed.

## Open threads / next steps

- Phase 2 (doc scrub): finish the lower-leverage tail (00b, 09, 47/48, 11, 56) and the deep line-by-line rewrites of the banner-scrubbed set, per [`_architecture_homes/05_scrub_tracker.md`](../_architecture_homes/05_scrub_tracker.md).
- Operator/product-repo actions: commit/PR the phase-1 product-repo work (it landed in working trees); create GitHub remotes for `AEC-cortex` and `radar` and push; run engine `build-corpus-snapshot` for a live re-ingest when network is available; publish-confirm `@hauska/atom-contract@1.5.0` consumers co-bump.
- The calibrated-spine critical path to M1: create `gs://hauska-calibration-raw/`, let the acquisition agent bulk-pull permits + edition bundles (uniform public-record), engine ingests editions + runs ICC I-Code ingest (the consequence-coverage unlock), C builds K2 retrodiction, then M1 measures. M1 is the go/rework gate; nothing past it resources until it returns.
- Phase 3 (build, after scrub): the calibrated-spine model tier (S1 grader, S2 meta-cal, S3 earned weighting, S4 refusal), the warming run, the white-label map layers, the reporting surface, agent-operator onboarding + metering (Circle rail, not Stripe), and the model-registry workstream.
- Acquisition agent is the one long-running thread; bring its close to the planner when it lands.

## Discipline reminders carried forward

Earned-not-asserted at every level. Tenant sovereignty (private adjudications never pool). Rail-quiet (the buyer hears the best answer, not the plumbing or the model). Cost per jurisdiction under the budget. Route brand/product-line moves through catalog-thesis-check and load-bearing commitments through premortem-check. No timeframe estimates; stack tasks by dependency.
