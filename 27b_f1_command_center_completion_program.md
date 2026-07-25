---
id: 27b_f1_command_center_completion_program
title: F1 build program — complete the Command Center (the spine console)
status: program
last_updated: 2026-07-25
implements: 27a_jurisdiction_factory_engine_spec (the contract; this is the sequence)
applies_to: hauska-map/apps/command-center (internal console), hauska-map/apps/property-explorer (customer app), hauska-engine (spine + retrieval), hauska-mcp-server (gate)
owner: nick
related: [27a_jurisdiction_factory_engine_spec, 2026-07-23_MASTER_WDLL_property_reasoning_substrate, _architecture_homes/01_homes_and_topology]
---

# F1 build program — complete the Command Center

The build sequence that executes the `27a` spec. The spec is the contract (the WDLL is the acceptance card); this is the ordered program to satisfy it. Read `27a` first — its WDLL items (1-9), the G1-G8 guardrails, the two-products guardrail (CC internal / PE customer / preset = shared substrate not collapse), and the one-substrate through-line are assumed here and NOT restated.

Approval: RATIFIED by operator dispatch 2026-07-25 (receiving build planner executing). Phase 0 → Gate A check-in filed; F1a blocked on operator go.

## The build model (the meta-guardrail: don't rebuild the drift)

The 3-day loop failed because it was many agents, loose contracts, each trusting the last one's green check. This program is built the opposite way:
- PLANNER-LED, FEWER AGENTS, TIGHTER CONTRACTS. The planner owns dispatch, adversarial review, merge, and VERIFICATION. Verification is NEVER delegated and is ALWAYS against LIVE state (a live query, a live probe, a live app click) — pasted verbatim, never a sub-agent report or a workflow-green. This is the single discipline whose absence caused the loop.
- Each dispatch cites the WDLL item (1-9) or G-guardrail it satisfies. A deliverable that doesn't map to one isn't in scope.
- STOP GATES at the two irreversible/decision seams (Gate A after phase-0 truth; Gate B before the PE customer-surface flip). Autonomous within a phase. At each gate the agent produces a check-in prompt ADDRESSED TO THE DOC_REPO PLANNER, who adversarially verifies against live state, then the operator gives the go.
- The guardrails (the smoke test, the mechanical badge, the one-read-path assertion) are built EARLY and DOGFOODED — the rest of the build is checked by them as it lands.

## PHASE 0 — restore the read path + establish true ground truth (fixes the live outage; feeds F1)  → WDLL 1

The app is DOWN right now (retrieval-api OOM crash-loop). This phase un-breaks it AND establishes the true baseline the ledger opens on.

- 0.1 RESTORE RETRIEVAL, DURABLY (G2). The correct fix, not the band-aid: make retrieval-api serve from the Postgres LayeredStorage StoragePort (already built Phase 1a), and RETIRE the in-memory-snapshot boot path (`JSON.parse` of the corpus into a 1GiB heap is what OOM'd). If an immediate stopgap is needed to un-break the app the same hour, a memory bump is allowed AS A STOPGAP ONLY, with the durable Postgres-serve fix landing in the same phase (a stopgap that ships without the durable fix re-OOMs on the next data growth — that is a FAIL of this phase). Add a resource-headroom check so a deploy fails if projected memory > limit.
- 0.2 VERIFY LIVE: `/health` 200, a known parcel (name it) returns its full atom chain through the LIVE retrieval path, and the app's `X-PE-Read-Path` header flips from `atom-pending` back to `atom-chain`.
- 0.3 TRUE GROUND TRUTH (G1). Run ONE honest live tally per Central-TX county against the ACTUAL node-graph in the serving DB: nodes, zoning-present vs honest-absent, setback, envelope, references. From a live `SELECT`, committed. This SETTLES the 5.8%-vs-61% question — the real number is now known and recorded, not reported.
- OUTPUT → GATE A: the app is live again, retrieval serves durably, and the true Central-TX baseline is committed. Check-in to the doc_repo planner with the health probe, the parcel chain, and the per-county tally pasted verbatim. Operator go before F1a.

## F1a — CONSOLE AUDIT + RECONCILE (READ-ONLY, thorough, shapes everything after)  → WDLL 2

Operator-directed to get full attention. NO wiring code until this lands. Establish the TRUE state of the existing Command Center — do not trust the badges.

- 1a.1 PER-PANEL BADGE-VS-REALITY. For every CC panel (Cortex-Workspace, Substrate, Engines, Governance), verify its LIVE/STUB badge against LIVE state. A panel marked LIVE that silently broke (the OOM-class failure) is exactly the drift. Report: real-LIVE / claims-LIVE-but-broken / genuine-STUB, with the live evidence per panel.
- 1a.2 CC-vs-PE DRIFT MAP. Map where the CC console (built before the PE ramp) and the PE parcel leg duplicate, disagree, or where PE built a thing CC already had a slot for. Name the single node/atom read path each currently uses (find the forks — G6/one-substrate).
- 1a.3 THE WIRING MAP. For each STUB (starting with `Node & Graph` → its declared `retrieval /atoms/trace/:did`): what it needs to go LIVE, what merges into what, what PE-leg map/inspect work folds into the shared component library. This document is the input to F1b/c.
- OUTPUT → GATE B (operator-added 2026-07-25): a committed console-audit doc + the drift-map + the wiring map. Read-only, but the planner adversarially reviews it AND the operator reviews the drift-map before ANY F1b wiring — a wrong console-state read costs the most downstream. Check-in to the doc_repo planner; operator go before F1b. (Gates renumber: A after phase-0, B after F1a audit, C before the PE customer flip.)

## F1b — WIRE THE LEDGER + PE CUSTOMER SURFACE + THE BINDING  → WDLL 3, 4, 5, 6

Build on the F1a wiring map. Every piece reads the ONE spine substrate (G6).

- 1b.1 NODE-GRAPH LEDGER LIVE (WDLL 3). Wire the `Node & Graph` panel (STUB → LIVE) to the live node/atom/reference graph via its declared target. It tallies like a balance sheet (counts, present vs honest-absent, references). Same shape as the trading cockpit node-graph, property-native. Verify: a named node shows its real atoms; an empty node shows honest-0, not an error.
- 1b.2 THE BINDING (WDLL 4). Bidirectional, on the ONE canonical node-id (G6): click a parcel on the map → its node highlights in the ledger; click a node in the ledger → the map locks to that node-id and its atoms inspect. Verify both directions on named parcels.
- 1b.3 PE CUSTOMER SURFACE (WDLL 5 — the two-products guardrail is load-bearing here). property-explorer gets the Map | Ledger parcel-focused layout built from the SAME shared components + substrate as CC, but PE STAYS THE CUSTOMER-FACING PRODUCT: curated, customer-safe, exposing NO engine/governance/operator panels. DO NOT collapse PE into CC. Verify: a named parcel renders its full chain in PE; a grep/review confirms PE exposes zero internal operator panels.
- 1b.4 ONE SUBSTRATE, NO FORK (WDLL 6). Consolidate onto a SINGLE node/atom read path used by the ledger, the map, and the PE surface. Remove any second map component / second node model / second read path (F1a named them). A test asserts the single read path. This is the anti-drift core.
- GATE C — before the PE customer-surface flip goes live to customers: prove the surface is customer-safe (no internal panels), reads the one substrate, and renders on named parcels behind a flag first. Check-in to the doc_repo planner; operator go before the customer-facing flip.

## F1c — FORMALIZE THE MECHANICAL HONEST-BADGE  → WDLL 7

- 1c.1 The LIVE/STUB badge is COMPUTED from whether the panel can actually serve its data live, not hand-set. Verify: kill a panel's backend → its badge flips to STUB/degraded automatically; a STUB that claims LIVE fails a check. This makes the console's honesty mechanical (G1/G8) — the primitive that was already there, made fail-closed.

## THE DOGFOODED GUARDRAILS (built EARLY, alongside F1b, not after)  → WDLL 8, 9

- G-smoke (WDLL 8, from G5 — the most important preventive item). The end-to-end live smoke test: click N known nodes through the LIVE ledger AND map, assert their atoms render; runs post-data-change and post-deploy; FAILS LOUDLY. Demonstrate it going RED when a parcel's data is unavailable. Build this EARLY so F1b is checked by it as it lands.
- G-coverage (WDLL 9). Every coverage number shown/reported is a live tally of the node-graph, surfaced in CC; no number exists in prose the ledger contradicts.
- G-id (G6). One canonical node-id contract; a CI test asserts the gate/retrieval/app/contract regexes are the SAME (the numeric-vs-alpha gate-regex drift the recon found).
- G-env (G7). Load-bearing config (PROPERTY_ATOM_PATH, retrieval URL/key, DB) in workflow, not hand-set env; a deploy asserts its required env or fails.

## DEFINITION OF DONE (this program)

The `27a` WDLL items 1-9 grade met/partial-with-reasons on LIVE-verified state, and NONE of the negative-done-line disqualifiers is true: an operator opens Command Center and SEES the true spine state (live ledger, mechanically-true badges, click node↔map inspect a parcel end to end); a customer opens property-explorer and gets the same parcel data through a curated customer-safe surface built from the SAME components; everything reads ONE spine substrate; the live smoke test is green and fails loudly when data is unavailable. THEN — and only then — the SUPPLY ENGINES program (scraping/collection/parsing that flesh out the one substrate) is written as a separate, later program.

## Repo/deploy discipline

CC + PE are `hauska-map/apps/*` (Vercel); retrieval-api + engine via Cloud Build (hauska-prod-497015); hauska-mcp auth `X-Hauska-Key`; contract `@empressaio/atom-contract@^1.9.0` (live 1.10.0). Check `git log -3` before committing, stage explicit paths, merge on GREEN CI only (a red test shipped to ldt main once — #227). Verify against live state, never a report.

## Handoff

This program is dispatch-ready on ratification. The receiving planner runs Phase 0 → GATE A → F1a → GATE B → F1b (+ dogfooded guardrails) → GATE C → F1c, planner-led / fewer-agents / verification-never-delegated, each dispatch citing its WDLL item or G-guardrail. The doc_repo planner adversarially verifies each gate against live state before the operator's go. THREE gates: A (phase-0 truth + app restored), B (console audit reviewed before wiring), C (before the PE customer flip).
