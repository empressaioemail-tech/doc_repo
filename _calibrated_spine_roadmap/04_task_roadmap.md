---
id: calibrated_spine_task_roadmap
title: Calibrated spine — untimed task roadmap
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibrated_spine_roadmap_overview, calibration_architecture_addendum, base_calibration_bootstrap, calibrated_spine_agent_execution_model, calibrated_spine_measurement_spec]
---

# Task roadmap

Untimed and task-ordered. Tasks are stacked in execution order with dependencies named; no day, week, or session estimates. Agent owners are indicative and resolve in [`06_agent_execution_model.md`](06_agent_execution_model.md). Each task is a dispatchable unit: an agent takes it, executes, and reports back to `_inbox/`.

## Gate zero: foundational now-tasks (everything depends on these)

- F0 Verify-first. Re-check F1, F2, F3, F4 against live main; record to `_inbox/`. Owner: planner plus per-repo agents. Depends on: nothing. Blocks: all builds.
- F1 Per-atom read attribution. Instrument retrieval and MCP logs at atom grain. Owner: cc-agent-M (MCP) plus cc-agent-C (retrieval). Depends on: F0. Blocks: M1, W, V query-weighted layers.
- F2 Consequence metadata join. Populate ASCE 7 risk category, IBC occupancy and importance, location onto code-section atoms. Owner: cc-agent-E. Depends on: F0. Blocks: consequence everywhere (M1-B, S5, W, V, R).

## Foundational schema lock (build now regardless of gates)

- F3 Rich raw ledger. Stamp source-event-type, provenance, subject key, adjudicator identity and role at judgment, model-attribution (model id and version, prompt and context template version, sampling params, retrieved atom-set id); store success and trial counts at finest grain; never persist a derived number. Owner: cc-agent-C. Depends on: F0.
- F4 Read-contract object, propagated. Confidence, n, width, provenance as one inseparable object, no scalar accessor; migrate EngineEnvelope and every surface and tool. Owner: cc-agent-AC (contract type) plus cc-agent-M, cc-agent-C, cc-agent-R, extension (propagation). Depends on: F0. The long pole.
- F5 Raw-conflict log. Record disagreeing inputs with provenance and vintage; derive type at read. Owner: cc-agent-C. Depends on: F0.
- F6 Three-axis contract stated. accuracy, source-quality, severity, plus calibration-provenance field. Owner: cc-agent-AC. Depends on: F2.
- F7 Granular invalidation. Section-plus-dependents scope. Owner: cc-agent-E. Depends on: F0.
- F8 Drift model. Amendment hazard rate from code-amendment atoms plus discrete event invalidation; floor is the hazard cold-start prior. Owner: cc-agent-E. Depends on: F7.
- F9 Close the present-tense violation. Replace LLM-emitted plan-review confidence with the raw-adjudication loop emitted through F4. Owner: cc-agent-C. Depends on: F3, F4.

## Base calibration bootstrap (the pre-client anchor; first dependency is acquisition, no fallback)

- K1 Historical public-record acquisition. Acquire permit, inspection, variance, incident data through public channels (portals, bulk public-records, permitted scraping); maximal coverage and quality; Bastrop first. Also acquire historical code editions where corpus edition history is shallow. Owner: dedicated acquisition agent(s). Depends on: F0. Blocks: K2.
- K2 Edition-correct retrodiction harness. Predict each historical case with the edition in effect at its date; compare to outcome; deposit as outcome-graded evidence with provenance backtest. Owner: cc-agent-C. Depends on: K1, F3, F7.
- K3 Historical-outcome de-confounding. Distinguish approved-clean from approved-with-variance/condition. Owner: cc-agent-C2. Depends on: K2.
- K4 Expert seed gold set. Budgeted multi-expert adjudication over a consequence-stratified sample, weighted to the high-consequence tail; record inter-adjudicator agreement. Owner: planner plus experts plus tooling agent. Depends on: F3.
- K5 Labeled weak priors. Cross-source agreement and model-as-judge as triage and clearly-labeled weak priors only. Owner: cc-agent-C2. Depends on: F5.
- K6 Calibration provenance in the read-contract. Carry asserted, backtest, seed, live so base is never shown as live-earned; map renders them distinctly. Owner: cc-agent-AC. Depends on: F4.

## Gate one: the measurement (go/rework signal)

- M1 Run Measurement A and B; solve for or measure-against the adjudication rate; run A at three invalidation granularities; B sizes the safety tail. Owner: cc-agent-C plus planner. Depends on: F1, F2, F3, F7, and K2 where backtest data exists. Gates: the S-track upper tier and V6.

## Fuel spine (forward fuel; resource as moat infrastructure)

- X1 Tenant leg. Authenticated reviewers plus tenant partitions. Owner: cc-agent-C. Depends on: F-track schema. Blocks: S, X2, X3.
- X2 Outcome capture (live). Owner: cc-agent-C. Depends on: X1. Blocks: earned models.
- X3 Public-record outcome classification. Classify by public-record status, not submitter; public-record AHJ outcomes pool publicly, private adjudications stay sovereign. Owner: cc-agent-C. Depends on: X2. Shared logic with K1.

## Spine model tier (deferred; build only after M1 returns go, on backtest fuel first then live)

- S1 Grader model. Earned reliability anchored on real outcomes and inter-adjudicator agreement, never on the system's beliefs. Owner: cc-agent-C2. Depends on: F3, K2 (backtest fuel) then X2 (live).
- S2 Meta-calibration and active learning. Posterior-at-grain at read; value-of-information routing fed by the F8 hazard-plus-event signal so drift and active learning share one ranking. Owner: cc-agent-C2. Depends on: S1.
- S3 Earned model weighting. Derived at read from F3 model-attribution stamps joined to outcomes. Owner: cc-agent-C2. Depends on: S1, S2.
- S4 Actuation-refusal model. Govern the action not the answer; covers the tail sized at M1-B. Owner: cc-agent-C. Depends on: F2, F6, M1, S1.
- S5 Consequence-gated routing. Stronger model on the high-consequence stratum; ships labeled asserted. Owner: cc-agent-R. Depends on: F2 only (can land early).

## Warming and QA (End-state B)

- W1 Warming-and-QA harness. The cascade controller: ping triggers geocode, jurisdiction resolve, code-atom retrieval, site-context, hydrology, consequence derivation, synthesis, deposit to reasoning_atoms via cold-warm UPSERT, cache. Owner: cc-agent-C. Depends on: F-schema lock, F2, F4, F5.
- W2 Parcel-universe enumeration and orchestration. Enumerate all Central Texas parcels; drive W1 with idempotent re-ping. Owner: cc-agent-C. Depends on: W1.
- W3 QA assertions per parcel: coverage produced, adapters resolved or cleanly declined, confidence widthed and sourced, contested ground logged, triage flag set. Feeds the map. Owner: cc-agent-C. Depends on: W2, F5, F2.
- W4 Cost-and-quota guardrail. Cotality is the sole parcel and property spine (Regrid purged 2026-06-17). Warming reads parcels and Cotality fields from cached snapshots (place_layer_snapshots) only and makes no live Cotality call; live federal layers (FEMA, USGS, EPA) are free. Verify snapshot coverage before the run. Hard constraint. Owner: cc-agent-C. Depends on: W1 design.
- W5 Synthetic-read tagging. Tag warming pings synthetic; exclude from the real query-frequency distribution. Owner: cc-agent-C. Depends on: F1, W1.

## White-label map (End-state C; Chris does design, agents do function)

- V1 Decoupled map renderer with the thin contract (mount slot, resize signal, layer-visibility set, context binding). Owner: map agent. Depends on: nothing.
- V2 Floating window manager (FSM: floating, snapped, minimized, maximized, closed). Owner: map agent. Depends on: V1.
- V3 Dynamic layer registry plus per-app allocation config. Owner: map agent. Depends on: V1.
- V4 EngineEnvelope read-contract consumption. Owner: map agent. Depends on: F4.
- V5 Now-buildable reasoning layers: consequence choropleth, width-as-uncertainty saturation, contested-ground overlay (hydrology headline), triage state. Owner: map agent. Depends on: F2, F4, F5, V3.
- V6 Fuel-gated calibrated-accuracy layer; asserted-with-provenance until M1 shows thickening, then lights region by region. Owner: map agent. Depends on: M1, X, V5.
- V7 Development-pulse layer (permit, inspection, incident activity), public free-tier, double-duty with X3. Owner: map agent. Depends on: X3.
- V8 Vintage-decay rendering on the F8 hazard signal and dataVintage; shares the time-slider. Owner: map agent. Depends on: F7, F8.
- V9 Positioning fix in the connective map footer and every map surface. Owner: map agent. Depends on: nothing. Do now.

## Reporting surface (End-state D)

- R1 Report-rendering contract: composed atoms plus reasoning plus lay summary plus embedded map allocation plus read-contract on every claim; static (non-floating) renderer mount. Owner: cc-agent-R plus map agent. Depends on: V1, V3, F4.
- R2 Unify warming and reporting on one pipeline (two mount contexts). Owner: cc-agent-C. Depends on: W1, R1.
- R3 Now-buildable map-embedded reports: Property Brief, site-context, hydrology, Codex plan review site-context, Cortex site-bound deliverables, Radar baseline. Owner: cc-agent-R. Depends on: R1, V5, W2.
- R4 Fuel and credential-gated report maps: Cotality property intelligence, Radar Cotality layers, hydrology Cotality forcing, calibrated-accuracy surface. Owner: cc-agent-R. Depends on: Cotality key plus cache, X, M1, V6.
- R5 Planned-corpus reports: subsurface (SSURGO soils, geology, groundwater), precedence-engine jurisdiction overlay, plan-set decomposition site locator. Owner: cc-agent-C2 plus cc-agent-E. Depends on: their corpus and engine workstreams in the master roadmap.
- R6 Per-report, per-app layer allocation through the V3 registry. Owner: cc-agent-R. Depends on: V3, R1.

## Spine console (End-state E)

- E1 to E6 in [`endstate_E_spine_console.md`](endstate_E_spine_console.md). Owner: map agent. Depends on: V1 to V3, F4, the calibration overlay read API, MCP introspection, the atom read API.

## Critical-path summary

## Operator decisions locked (2026-06-21)

- Decision 4, Cortex renderer migration: DEFERRED. Cortex stays on its current Leaflet map for now; it is not in active use. Get the new hauska-map repo running smooth first, then swap Cortex onto the shared V1 renderer. Not a Wave 2 task.
- Decision 5, calibration overlay: CONFIRMED as cache. The migration 0037 `atom_calibration_overlay` is demoted from source-of-truth to an optional read cache and legacy bootstrap. The raw ledger plus read-time derivation (C2's lane) is the source of truth. C2 builds to this.
- Decision 6, uncapped atoms route: AUTHORIZED. cc-agent-C builds `GET /api/brokerage/v1/place/:placeKey/atoms`, returning every atom behind a parcel (code plus reasoning, overlay-joined), uncapped, so the console E7 atom-trace can show every atom. Supersedes the capped dossier for the trace. Folds into cc-agent-C's Wave 2.

## Critical-path summary (cont.)

F0 then F1 and F2 unblock M1. F3, F4, F5, F6, F7, F8 lock the schema; F4 is the widest and most-shared dependency. K1 is the first dependency of the base-calibration anchor and has no fallback. M1 is the go/rework gate; nothing past it is resourced until it returns, and K2 backtest data lets M1 measure rather than guess. X1 then X2 then X3 are the forward fuel that, with the backtest, unlocks the S-track and V6 and V7. C-track now-layers and the E console proceed in parallel with the fuel spine; only V6, V7, and R4 wait on fuel. The dependency chain to the highest-value sockets is explicit: per-atom attribution and consequence metadata, then base calibration via backtest, then outcome capture through the tenant leg, then M1-B sizes the safety tail, then the refusal model covers it, then the autonomy, AHJ, and insurer sockets light.
