---
id: calibrated_spine_roadmap_overview
title: Calibrated Spine Roadmap — program overview
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibration_architecture_addendum, base_calibration_bootstrap, calibrated_spine_gap_analysis, calibrated_spine_task_roadmap, calibrated_spine_measurement_spec, calibrated_spine_agent_execution_model]
---

# Calibrated Spine Roadmap

> **Superseded-home note (2026-06-21).** This program was written with the calibration substrate in cortex-api. Per the architecture-homes standard ([`../_architecture_homes/`](../_architecture_homes/00_overview.md)), the calibration substrate (ledger, overlay, reasoning atoms, engines) lifts to the spine (hauska-engine) and cortex-api is the reporting function package; atoms carry the read-contract conformance target. Build is frozen pending the audit (done) and the doc scrub, which lands the homes correction here.

This folder is a scoped build program, not part of the master roadmap. It exists to take the Hauska spine from its current state to a calibrated, honestly-shaped, warm, and map-legible state, and it is kept deliberately separate so it does not get confused with `00c_portfolio_master_map.md` or `00d_portfolio_roadmap_reference.md`. The program is executed on its own, in parallel with Chris's design work, and only after execution and design land are the results reconciled into the master roadmap. Do not merge this into the master roadmap prematurely. The single explicit tie is this line: when this program completes, its outcomes reconcile into `00d_portfolio_roadmap_reference.md`.

## Why this program exists

The spine emits confidence on every output today, but that confidence is asserted, not earned: in plan review it is the LLM's own emitted number. The second structural commitment requires confidence to be earned against outcomes. This program builds the machinery that earns it, shapes confidence so it cannot be displayed dishonestly, gets a base level of calibration in place before any client touches the system, warms every Central Texas property to a report-ready state, and exposes all of it through a white-label map and an operator console. The moat is the compounding calibrated reasoning, not the copyable code text, so this program is the moat work.

## The five end-states (definition of done)

A. Calibrated spine. Confidence is shaped honestly (three axes, widthed read-contract), the raw-adjudication calibration loop replaces the LLM-self-emitted number, the drift model is hazard-plus-event, the base calibration is in place, and Measurement A has returned a go signal with the model tier scaffolded to earn on live fuel. See [`endstate_A_calibrated_spine.md`](endstate_A_calibrated_spine.md).

B. Warm, report-ready state. Every Central Texas property is pre-computed and cached so any report renders instantly on ping; the warming run doubles as automated QA, surfacing coverage holes, adapter failures, contested ground, and thin-high-consequence parcels. Warm means report-ready, not calibrated. See [`endstate_B_warm_report_ready.md`](endstate_B_warm_report_ready.md).

C. White-label configurable map. One decoupled renderer, a floating window manager, a dynamic layer registry, and per-app allocation so the same map plugs into Cortex, Radar, the Brief, and SmartCity OS with different layers each. See [`endstate_C_white_label_map.md`](endstate_C_white_label_map.md).

D. Reporting surface. Every report emits through the read-contract and most carry an embedded map composed per app from the same registry. Warming and reporting are two mount contexts on one pipeline. See [`endstate_D_reporting_surface.md`](endstate_D_reporting_surface.md).

E. Spine console. An all-white, function-only localhost dashboard on the map app giving full operator visibility into MCP tools, all atoms, all map layers, and per-property calibration state, with a left files rail, a right styling-legend rail, and the floating map over everything. See [`endstate_E_spine_console.md`](endstate_E_spine_console.md).

## The keystone principle

Log raw, derive late. Append-only immutability is an argument against storing interpreted quantities and for storing raw signal richly. Posteriors, typed conflict labels, severity scores, and reliability numbers are all derived at read time from raw events, never frozen at write time. This collapses the bet surface to a rich raw ledger plus a read-contract object and removes premature-taxonomy risk. Full architecture in [`01_calibration_architecture_addendum.md`](01_calibration_architecture_addendum.md).

## Standing governance rule

The self-modeling frame is a thinking tool only. It is banned from any sentence a customer or investor hears, and every bet must name the concrete product query it unlocks or the metaphor is carrying the bet. This is permanent, because the hazard grows precisely as the self-model gets good.

## How agents use this folder

This program is executed multi-agent. To run it:

1. Point each agent at its end-state doc plus [`04_task_roadmap.md`](04_task_roadmap.md) and [`06_agent_execution_model.md`](06_agent_execution_model.md).
2. Agents execute their assigned task units and report back to `_inbox/` with a close note in the standard format.
3. The planner sweeps `_inbox/` on a loop, reconciles task status against the roadmap, and re-dispatches the next unblocked units.
4. Verify-first tasks (the F-track current-state re-verification flagged in the gap analysis) run before any build, because the gap analysis is grounded in a recon roughly two weeks stale.

## Index

- [`01_calibration_architecture_addendum.md`](01_calibration_architecture_addendum.md) — the architecture and the corrected bet list
- [`02_base_calibration_bootstrap.md`](02_base_calibration_bootstrap.md) — getting to base calibration before clients
- [`03_gap_analysis.md`](03_gap_analysis.md) — current state versus the five end-states
- [`04_task_roadmap.md`](04_task_roadmap.md) — the untimed, dependency-ordered task plan
- [`05_measurement_spec.md`](05_measurement_spec.md) — Measurement A and B
- [`06_agent_execution_model.md`](06_agent_execution_model.md) — agent ownership, dispatch, and the loop
- `endstate_A_calibrated_spine.md` through `endstate_E_spine_console.md` — the five end-states
