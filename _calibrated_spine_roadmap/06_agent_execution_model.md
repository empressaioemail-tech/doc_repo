---
id: calibrated_spine_agent_execution_model
title: Calibrated spine — agent execution model
status: active
last_updated: 2026-07-05
applies_to: hauska
owner: nick
related: [calibrated_spine_roadmap_overview, calibrated_spine_task_roadmap, base_calibration_bootstrap]
---

# Agent execution model

This program is executed multi-agent. The point of this doc is that the operator can point each agent at its lane and its end-state doc, the agent reports back to `_inbox/`, and a sweep loop reconciles and re-dispatches. The calibration engines in particular are split across agents and clones so they run in parallel without colliding.

## Agent lanes and ownership

| Agent | Repo / clone | Owns |
|---|---|---|
| cc-agent-E | hauska-engine | F2 consequence metadata, F7 granular invalidation, F8 amendment-hazard drift, edition-correct retrieval for backtest, corpus breadth, subsurface adapters (R5) |
| cc-agent-C | legacy-design-tools (main clone) | F3 ledger extension, F4 cortex-api side, F5 conflict log, F9 present-tense fix, K1 acquisition wiring, K2 retrodiction harness, W warming and QA, X1 to X3 fuel, S4 refusal, M1 run |
| cc-agent-C2 | legacy-design-tools-c2 clone | K3 historical de-confound, K5 weak priors, S1 grader, S2 meta-calibration and active learning, S3 model weighting, R5 precedence. Disjoint file sets from C |
| cc-agent-M | hauska-mcp-server | F1 MCP read attribution, F4 propagation across the gate's tools (62 across four gates public/codex/reporting/map, PR #35 merged 2026-07-05), MCP introspection for the console. No doc_repo access: paste dispatch content and mirror its closes into `_inbox/` |
| cc-agent-AC | hauska-atom-contract | F4 read-contract type, F6 three-axis plus provenance field, K6 calibration provenance, model-attribution fields |
| cc-agent-R | Cortex runtime | F4 propagation, S5 consequence-gated routing, R1 to R6 reporting surface |
| map agent | map repo | V1 to V9 white-label map, E1 to E6 spine console. Function only; Chris owns design |
| extension | hauska-brief-extension | F4 read-contract migration in the extension |
| acquisition agent(s) | data acquisition | K1 historical public-record acquisition (dedicated, because it has no fallback and must be maximal) |

## Collision avoidance

cc-agent-C stays on the main legacy-design-tools clone; cc-agent-C2 stays on the c2 clone. The calibration engines (grader, meta-calibration, weighting, de-confound) are C2 work; the deposit-loop and warming plumbing are C work; they touch disjoint file sets. Engine-side work (consequence metadata, invalidation, hazard) is cc-agent-E in hauska-engine, disjoint from both. The read-contract type lands in hauska-atom-contract (cc-agent-AC) first and propagates outward, so consumers pick it up rather than each inventing a shape.

## Dispatch protocol

1. Point the agent at its end-state doc, the relevant task units in [`04_task_roadmap.md`](04_task_roadmap.md), and this doc.
2. The agent executes its unit against the acceptance criteria in the end-state doc.
3. The agent reports back to `_inbox/` with a close note: task id, what changed, the PR or commit, what was verified (paste raw command or test output), what it discovered that the plan did not anticipate, and what it is now blocked on or what it unblocked.
4. cc-agent-M cannot read doc_repo: paste its dispatch content into its window and mirror its close note into `_inbox/` by hand.

## The loop

The planner runs a sweep loop over `_inbox/` on an interval. Each pass: read new closes, update task status against the roadmap, mark unblocked units, dispatch the next wave, and flag any close that contradicts the gap-analysis hypothesis so the plan is corrected against ground truth rather than assumption. Verify-first (F0) runs before any build and its close rewrites the gap analysis where reality differs.

## Parallel waves

Sequencing is operator-watchable-first: stand up the visible shell before the invisible plumbing, so the build can be watched coming together in localhost. Warming and calibration are Wave 2, never Wave 1.

- Wave 1, the visible shell plus verify-first. The map agent stands up the all-white localhost spine console (End-state E): port the brief-extension map, the floating window manager, the left files rail, the right legend rail, the parcel drill-through atom trace (E7), populated with whatever the current read APIs return. In parallel: the extension agent hands off the current map implementation; cc-agent-C, cc-agent-E, and cc-agent-M run F0 verify-first and expose or confirm the read APIs the shell consumes (parcel resolve, atoms-for-parcel and cross-reference traversal, MCP introspection); cc-agent-AC drafts the read-contract object type (F4 type plus the three-axis and calibration-provenance fields); cc-agent-R inventories F4 reach and defines the embedded-map mount contract (R1); cc-agent-C2 maps the calibration-engine hooks (design only, no build); the acquisition agent inventories public-record targets (scoping only, no pulls). Nothing in the calibration or warming tier builds until F0 reports.
- Wave 2, warming and base calibration plus the rest of the schema. F-track completion (F1, F2, F3, F4 propagation, F5, F6, F7, F8, F9); K1 acquisition begins and K2 retrodiction; W1 to W5 the warming-and-QA run; the now-buildable reasoning layers (V4, V5, V8, V9); S5 consequence-gated routing.
- Wave 3, the measurement gate. K3, K4, K5, K6, then M1 measured against backtest. M1 is the go/rework gate; nothing past it is resourced until it returns.
- Wave 4, after M1 go, on backtest then live fuel. X1 to X3 fuel, S1 to S4 model tier, V6 and V7 fuel-gated layers, R1 to R6 reporting surface.

Waves are dependency gates, not time boxes. Run everything in a wave that has its dependencies met; a task that finishes early pulls its dependents forward.
