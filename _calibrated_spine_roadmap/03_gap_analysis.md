---
id: calibrated_spine_gap_analysis
title: Calibrated spine — gap analysis (current state versus the five end-states)
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibrated_spine_roadmap_overview, calibrated_spine_task_roadmap, _research/2026-06-06_cross_repo_recon, 55_spine_data_intelligence_stack]
---

# Gap analysis

Grounded in the cross-repo recon (2026-06-06) and the spine stack doc (2026-06-07), both roughly two weeks stale. The shared clone can have moved. Before any build, the F-track current state must be re-verified against live main, specifically the ledger field set, the EngineEnvelope confidence shape, the read-attribution grain, and whether any consequence metadata is present on atoms. Those are marked verify-first and they are the first execution step of the program.

## Status by task

| Task | Current state | Gap | Status |
|---|---|---|---|
| F1 per-atom read attribution | MCP and retrieval logs exist; grain unconfirmed, probably tool or finding level | Atom-grain instrumentation. Probable first blocker | GAP, verify-first |
| F2 consequence metadata join | Disciplines taxonomy exists; ASCE 7 and IBC occupancy and importance not known on atoms | Corpus enrichment with risk-category and occupancy metadata | GAP, verify-first |
| F3 rich raw ledger | Phase 1 evidence ledger exists (atom_events, findings.citations[].atomId); Codex accept/edit/reject captured | Add model-attribution stamp and adjudicator role-at-judgment; confirm source-event-type and raw counts stamped | PARTIAL |
| F4 read-contract object | Confidence is a scalar; EngineEnvelope carries confidence plus kind, not n plus width plus provenance as one object | Wide refactor across 46 MCP tools, Cortex, Codex, Radar, Brief, EngineEnvelope | GAP, the long pole |
| F5 raw-conflict log | Synthesis emits the resolved answer; precedence latent, not logged | Log disagreeing inputs with provenance and vintage | GAP |
| F6 three-axis contract | assertedConfidence and calibratedConfidence split exists (0036/0037); severity axis absent | Add severity axis (depends F2) and provenance field | PARTIAL |
| F7 granular invalidation | Edition-scoped, source-set-drift invalidation exists; granularity likely whole-edition | Narrow to section-plus-dependents | PARTIAL |
| F8 drift model | source-set-drift invalidation exists; code-amendment atoms exist; hazard rate not built | Add hazard-from-amendments with floor as cold-start prior | PARTIAL |
| F9 close present-tense violation | Plan-review confidence still LLM-emitted; overlay (0037) not wired to displayed number | Wire raw-adjudication loop through the read-contract object | GAP |
| M1 measurement | Not run | Run A and B; strengthened by K-track backtest | GAP |
| K1 to K6 base calibration | Edition retrieval and amendment atoms exist; no historical permit data acquired; no backtest harness | Net-new acquisition, retrodiction harness, de-confound, gold set, provenance | NEW |
| X1 tenant leg | In flight (sprint 54, dispatches queued) | Resource as moat infrastructure | PARTIAL |
| X2 outcome capture | Phase 2, sequenced, not built | Build live outcome capture | GAP |
| X3 public-record classification | Not built | New classification logic, shared with K1 | GAP |
| S1 to S5 model tier | Calibration overlay (0037) exists as substrate; no grader, meta-cal, active learning, weighting, refusal | All deferred; S5 consequence-gated routing can land early on F2 | GAP, deferred |
| W warming and QA | Brief pipeline exists; reasoning_atoms and cold-warm UPSERT exist (sprint 57); orchestration and QA harness absent | Build parcel-universe orchestration, cost-quota guardrail, synthetic-read tagging | PARTIAL |
| V map | Map exists (EngineEnvelope, FEMA live, D8 fixture-rendered, flood/parcel/zoning, Carto track); floating viewer and decoupled renderer is Chris's new design; registry and per-app allocation absent; reasoning layers absent | Build renderer contract, window manager, registry, reasoning layers; calibrated and dev-pulse layers fuel-gated | PARTIAL to GAP |
| R reporting | Reports exist (Brief, Codex review, Cortex L1-L6, site-context, hydrology, Cotality gated, Radar); embedded-map, per-app allocation, read-contract-on-every-claim absent | Embed renderer, allocate layers, migrate confidence; unify warming and reporting as one pipeline | PARTIAL |
| E spine console | Map localhost app exists; no operator console | Net-new function-only dashboard: MCP, atoms, layers, calibration tracker, files rail, legend rail, floating map | NEW |

## Shape of the gap

The foundation (F1, F2, F4) is mostly missing or unverified and gates everything. The ledger and overlay (F3, F6, parts of F7 and F8) exist and need extension, not invention. The model tier (S) and forward fuel (X2, X3) are absent by design and now have a pre-client substitute in the K-track backtest. Warming, map, and reporting all exist in primitive form and need the read-contract plus the registry to become honest and composable. The spine console (E) and the base-calibration bootstrap (K) are net-new. The long pole is F4, the read-contract refactor, because its reach is across every confidence-emitting surface and both the map's honesty guarantee and the warming run's honest confidence depend on it.

## First execution step

Run the verify-first re-check of F1, F2, F3, F4 against live main before building, and record the result to `_inbox/`. The gap rows above are the hypothesis; the re-check is the ground truth the build plans against.

## F0 verify results (2026-06-21) — ground truth from Wave 1

Consolidated from the Wave 1 closes (C, E, M, AC, R, C2, extension, acquisition). These supersede the hypotheses above where they differ.

- Regrid was purged 2026-06-17; Cotality is the sole parcel and property spine. Warming reads parcels from cached snapshots, never a live Cotality call.
- MCP live tool count is 57 on main (59 on an unmerged branch), not 46. The console reads the count from M's introspection endpoint rather than pinning a number.
- Read attribution is tool-grain. The `request_log.atom_ids_returned` column and the Postgres sink already exist; handlers just never emit the atom DID list, so F1 is "wire the emit," not build the pipeline.
- EngineEnvelope confidence is `{value, kind}` scalar with no n, width, or provenance. The `atom_calibration_overlay` (migration 0037) stores derived scalars and is demoted to a cache per Decision 5; the raw ledger plus derive-at-read is the source of truth.
- The ledger (`atom_events`) is append-only and hash-chained (prev_hash/chain_hash). Adjudication events are `finding.accepted/rejected/overridden` on `entity_type=finding`, not `codex.*`. Missing for the F3 rich spec: model-attribution stamp, adjudicator role-at-judgment, source-event-type, finest-grain counts.
- Read APIs exist: POST /place/resolve, GET /place/:key/layers, GET /place/:key/dossier (capped at 5 queries and 3 inline refs), /codes/jurisdictions/:key/atoms, /codes/atoms/:id, /atoms/:slug/:id/summary and /history. There is no uncapped atoms-for-parcel route; building it is AUTHORIZED (Decision 6). Reasoning atoms are DB-only with no HTTP route.
- Two brief pipelines: the brokerage brief (extension path) and the engagement briefing (architect path), on separate tables.
- F2: zero typed consequence fields on atoms; only 58 ASCE and 140 IBC prose mentions. Enrichment must parse prose into typed fields.
- F8 blocker: zero code-amendment atom instances in the production snapshot, so the amendment-hazard model has no data and runs at its cold-start prior until amendments are ingested.
- K2 blocker: shallow edition history (33/34 jurisdictions hold one edition, no temporal effective-date depth). Edition-correct retrodiction cannot run until historical editions and adoption ordinances are acquired (acquisition K1) AND ingested (engine). This is now on the K2 critical path.
- E7 atom-trace shipped engine-side: GET /atoms/trace/:did returns the full atom, contextSummary, provenance, citations, and inbound plus outbound graph edges (19/19 tests). The trace chain is cc-agent-C's uncapped atoms route (parcel to DIDs) then cc-agent-E's trace (DID to full graph).
- Cortex renders maps with Leaflet, not the shared MapLibre renderer; migration deferred (Decision 4).

Plan implication: the base-calibration backtest (K-track) now has a hard prerequisite that was not in the corpus. Historical editions and amendments must be acquired and ingested before K2, and F8's hazard has no fuel until amendments land. The acquisition agent's edition-and-ordinance work plus a new engine ingest task are the K2 unblockers.

## Wave 2 build results (2026-06-21)

Built across all eight agents; product-repo work to be committed/PR'd/merged by the agents.

- F3 rich ledger (C): source-event-type, adjudicator role-at-judgment, model-attribution stamp, finest-grain counts; no derived numbers persisted.
- F4 read-contract (AC type 1.4.0 published; 1.5.0 local for legacy subpaths): propagated through cortex-api findings/site-context/composite (C), Cortex UI/API/chat (R), the extension map (refuses scalar-only fills, width-as-saturation), and the map console (V4). MCP propagation pending M's filed close.
- F5 raw-conflict log (C): synthesis.conflict events on atom_events; conflict type derived at read.
- F9 (C+R): plan-review displayed confidence is the read-contract derived at read; LLM scalar retained ledger-only and deprecated on the wire.
- Decision 6 (C): uncapped GET /place/:placeKey/atoms shipped.
- F2 (E): typed consequenceInputs field + parser + atom-trace exposure. Honest correction: the Wave 1 "58 ASCE / 140 IBC" counts were false-positive substring matches; the L3 corpus carries near-zero structural ASCE/IBC classification. Thick coverage needs Layer 1 ICC I-Code ingest. Consequence runs on a conservative asserted default until then.
- F7 (E): section-plus-dependents invalidation closure shipped.
- F8 (E): amendment-hazard scaffold at cold-start prior 0.02; zero amendment instances, so it earns out only after amendment ingest.
- K2 unblocker (E): hauska-edition-bundle/1 contract + ingestEditionBundle + resolveEditionAtDate + CLI. K2 retrodiction itself not built; blocked on acquisition delivery + ingest.
- S5 (R): consequence-gated routing, labeled asserted, Grok high/low tiers; defaults to routine until F2 thickens.
- R1 (R): @workspace/map-embed adapter + resolveLayerAllocation; no report embeds yet.
- Map console (map): V3 registry + per-app allocation, V5 reasoning layers (fixture-live, awaiting real F2/F5 inputs), E1/E7 wired, V9 positioning fix. V6/V7/V8 deferred; Cortex Leaflet migration deferred (Decision 4).
- Calibration engines (C2): @workspace/calibration-engines scaffold + raw-events collector on derive-at-read; overlay confirmed cache-only. K3/K5/S-track blocked.
- Acquisition (acquisition): canary-only. Anchors sized: Austin 2,361,893 issued permits (1921-present) + 3,283 BOA; San Antonio ~487k permits + 1,417 BOA. Two edition adoption ordinances acquired (Bastrop 2018 IBC, Austin 2021 IBC). Bulk pulls held on the GCS bucket.

Open critical path to M1: create gs://hauska-calibration-raw/, bulk-acquire permits + edition bundles via the uniform public-record process (no special access, no SmartCity scraper, no Bastrop privilege), ingest editions (E) and run ICC I-Code ingest for consequence coverage, build K2 retrodiction (C), deposit backtest-graded evidence, then M1 measures.
