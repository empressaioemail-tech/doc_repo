---
id: 2026-07-25_depth_engine_master_wdll_and_fleet_memory
title: Session close — depth-engine master WDLL, road-node engine, and the M0 fleet-memory install
date: 2026-07-25
type: session_summary
agent: claude_code (planner)
owner: nick
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27a_jurisdiction_factory_engine_spec, 27c_road_node_engine_and_warm_digital_twin_spec, 90_runbooks/fleet_memory_practice, 2026-07-25_depth_engine_planning_agent_handoff, 2026-07-23_ai_memory_substrate_thread_PLACEHOLDER, 2026-07-24_BREADTH_COVERAGE_MILESTONE_central_tx, 2026-07-25_setback_geometry_and_calibration_handoff]
---

# Session close — depth-engine master WDLL + M0 fleet memory

## What this session did

Started from two threads (the AI-memory-substrate placeholder and the unresolved setback-geometry bug from the F1 close) and converged them into one approved, launched build program.

The chain: a read-only code diagnosis of the buildable-envelope geometry (ldt `buildableEnvelope/geometry.ts`) found the 714 Spring St jagged polygon is a naive per-edge mitered offset that self-intersects on real (non-rectangular) parcel rings, with degeneracy guards that only reject-never-repair and a self-intersection check too weak to catch partial tangles, and zero test coverage for the failure class. The module header carried explicit tombstones (no geometry library; reasoned against a whole-polygon buffer but implemented the other naive option). Root cause was diagnosed as poor-memory-architecture, not hard math: an agent re-derived geometry in a dead context window, knew enough to reject one naive path and not the second, left no durable memory.

That diagnosis connected the calibration program and the agent-memory thread as one architecture (a mechanical gate separating cheap-can-be-wrong from promoted-provably-right, plus a durable store). The operator then escalated: roads have types and setbacks depend on road type (the code throws the OSM road-type tag away and applies an untyped default); the fix is to promote the road to a first-class node with a centerline, edges, ROW, and classification — which also gives the aerial/CAD/parcel layers a geometric skeleton to align to, and lays the foundation for a public municipal digital-twin layer (jurisdictions publishing infra onto a public substrate). The operator chose road-object-first as the keystone, eager whole-Central-TX warm-up pre-market with Bastrop city+county as the cost-measured pilot, centerline+assumed-ROW for v1, and declared the effort is morphing into the engine build.

Ground-truth reframe from the 2026-07-24 coverage milestone: breadth is done-wide and cheap (10 counties, ~2.15M zoning-facts, ~$5.12 metro) but depth is ~0.1% (Bexar 703,258 zoning-facts / 814 envelopes). So 27c is the DEPTH engine over 61a's breadth, not a second pipeline; the geometry bug is the depth BLOCKER (you cannot warm-verify millions of envelopes when the derive self-intersects).

The operator scoped 27a/27b/27c + a dev-fleet memory as ONE program under a master WDLL with a nested done-line, and directed that the fleet memory be built FIRST and installed as usable tooling that survives every build.

## Artifacts produced (committed `7000cda`, pushed)

- `27_MASTER_WDLL_spine_completion_and_depth_engine.md` — the umbrella. Nested done-line (product outcome outer; self-truing spine + fleet memory inner). Four sub-WDLLs: M0 (fleet memory, sprint zero), 27b (F1, done), 27a (engine contract), 27c (active build). Breadth-vs-depth through-line. Sequence M0 → R0-R4 → Central-TX depth (operator-gated).
- `27c_road_node_engine_and_warm_digital_twin_spec.md` — the depth engine. Code diagnosis, road-node keystone, road-type setbacks (descriptor-indexed), real polygon-offset + geometry-correctness gate, warm-then-verify loop, Bastrop depth-cost gate, digital-twin design constraint. 9 acceptance items, sprints R0-R4.
- `90_runbooks/fleet_memory_practice.md` — M0 practice. Two-tier (scratch Tier 2 / promoted Tier 1), four entry kinds, flush-and-reload, planner-gated promotion (mechanical guard preferred over prose), split-fleet install.
- `.cursor/rules/fleet-memory.mdc` — the M0 rule, live now (sibling of wdll-practice.mdc).
- `_scratch/README.md` + `_scratch/depth-engine-27c.md` — the Tier-2 convention + first workstream file, seeded with this session's real geometry lessons/ground-truths/dead-ends/open threads. M0 dogfooding itself from entry one.
- `_dispatches/2026-07-25_depth_engine_planning_agent_handoff.md` — the planning-agent handoff (gates make it autonomous, not trust; the per-sprint loop; standing hazards; operator-routed decisions).

## State at close

Master + 27c APPROVED and status-flipped (this close). Planning agent LAUNCHED and R0 is in flight — the `_scratch/depth-engine-27c.md` file already shows live R0 activity (library pick landed on `polygon-clipping@^0.15.7` with esbuild conditions held at `["workspace"]`; PR #356 CI green; two live-verify holds: NaN-inset must decline honestly, and WDLL-5 (shape-front = shortest edge on 714 Spring) not yet met; a cortex derive `no-zoning-stamp` seam blocks the live envelope probe). R0 is on HOLD-merge pending R0.1. M0 is proving itself in real time — the memory loop captured R0 lessons and honest holds without prompting.

Standing arrangement: the operator drives the build via the planning agent; the planner (this seat) adversarially reviews every report against live state and mines each report for memory improvements so the builds get better as the memory gets better. M0's own acceptance (M0.2-M0.4) is graded during R0-R4; R0's close is the first real test of whether the memory process works.

## Owed / open

- Session-close pass done this session (this file + current_state + parity ledger + frontmatter flips).
- R0.1 holds (planning agent owns): honest-decline on non-finite inset + test; WDLL-5 fix/assert on 714 Spring; the cortex no-zoning-stamp seam; then merge + canary + live probe.
- Export-gate session-close commit (engine #121+#122 docs) may still be "say go" pending with that agent — not the planner's to sweep.
