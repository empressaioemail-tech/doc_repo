---
id: 2026-06-10_cc-agent-C_C1_cortex_cut_to_gate
title: Dispatch — C1, cut Cortex to the gate (+ S1 precedence wire + provenance envelope)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY after the merge queue is current (task #29 + wedge merged); the big launch-gating cut; engine-side unblocked
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, 54_tenant_leg_sprint, _dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine, _dispatches/2026-06-07_cc-agent-C_cortex_consume_spine_and_thin_bff, _decisions/2026-06-07_adr008_gate_front_seam_scoping, 20_agent_operating_rules]
---

# C1 — cut Cortex to the gate

> The first and biggest app-by-app cut (sprint 58 C1). The engine lift is COMPLETE (A1 #69 adapters, A2 #70 reasoning engines + endpoints, A2-PR2 #71 calibration overlay I/O on Topology A), the gate-front seam is live (#160), and gate citation lineage is closed (#30/#159). This cut repoints cortex-api's engine call sites to the spine `engine-api` through the gate, folds in the precedence production wire (S1) and the uniform provenance envelope on Cortex's architect-facing surfaces, and QAs Cortex in its final topology. It does NOT yet remove the migrated cortex-api engine code (that is C3) — per-engine feature flags keep the cut reversible. Supersedes the C1 portion of the umbrella `cortex_consume_spine_and_thin_bff` dispatch.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools` (worktree on a `cortex/` branch if the main clone is busy). Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Branch prefix `cortex/`.

## Read first

1. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) — target architecture; the engine-api `/v1/*` endpoints
2. [`_dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine.md`](2026-06-10_cc-agent-C_precedence_wire_finding_engine.md) — **S1, executed as part of this cut**
3. The engine-api surface (from the lift reports): `POST /v1/briefing/generate`, `/v1/findings/generate`, `/v1/findings/generate-orchestrated`, `/v1/hydrology/*`, `/v1/site-context/*`; the gate-front seam contract (the `X-Hauska-*` context the gate supplies); the Topology-A `CalibrationRepositoryPort` (PR #71) to wire to the cortex `DATABASE_URL`
4. [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) — the gate seam this consumes
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Scope (sequence; multiple PRs expected)

1. **Recon (read-only, report first).** Confirm each engine reaches behavior parity on the spine and is reachable via the gate-front seam. **Resolve the one open question:** does the gate (`hauska-mcp-server`) already proxy the `/v1/*` engine-api endpoints, or does cutting Cortex's reasoning through the gate need new gate routes? If new gate routes are required, that is a cc-agent-M companion — report it; do not build gate code from this repo. Report the per-engine readiness before cutting.
2. **Cut cortex-api engine call sites to the spine, one engine at a time, behind per-engine feature flags.** Brief → findings → findings-orchestrated → hydrology → topography → decomposition → precedence. Each engine: cortex-api calls the spine `engine-api` via the gate-front seam (carrying tenant), the local `lib/*-engine` path stays in place but dark behind the flag (reversible). Verify behavior parity per engine before flipping the next.
3. **Wire the calibration port (Topology A).** Bind the `CalibrationRepositoryPort` drizzle adapter (PR #71) to the cortex `DATABASE_URL` so the spine engine-core's overlay I/O reads/writes the cortex Neon — the arrow-two deposit/read path must keep working through the cut (the deposit loop is gate-independent server-side, but verify it does not break).
4. **Fold in S1 — precedence into the production finding path.** Execute the precedence wire dispatch as part of the findings cut: when multiple same-topic+dimension standards apply, the finding path calls `reconcileRequirementsByTopic` and emits the governing finding via `formatPrecedenceFindingText` with every compared standard's `citations[].atomId` preserved. This makes the reconciliation hero line true in production (scope held to federal accessibility + model code + local amendments; no zoning/CC&R overclaim).
5. **Provenance envelope on architect-facing surfaces.** Cortex findings, the brief, and code lookups emit the uniform envelope (lineage = cited atom-id[s]; sources = authoritative deeplink[s] + edition + retrieved-at + verification state; reasoning chain = rule + precedence + project facts; confidence; timestamp + edition). **Rail-quiet (I7): the calibration GRADE stays out of buyer-facing output.**
6. **QA Cortex in its final topology.** The plan-review + brief + chat flows work end-to-end consuming the spine through the gate; the web-first wedge (pre-Revit chat + image vision, #165) still works; the deliverable-letter flow works.

## Acceptance criteria

- Recon report filed: per-engine spine parity confirmed; the gate-proxy-vs-new-gate-routes question answered (cc-agent-M companion flagged if needed).
- Each engine served from the spine through the gate behind a reversible per-engine flag; behavior parity verified per engine.
- **Citation/confidence/atomId lineage intact end to end (HARD — a cut that drops lineage is a regression).**
- Calibration port wired to the cortex Neon; arrow-two deposit/read still works through the cut (verify).
- S1: multi-standard findings call reconcile in production with all compared citations preserved; reconciliation claim scoped honestly.
- Architect-facing surfaces emit the uniform provenance envelope; calibration grade absent from buyer-facing output (rail-quiet).
- Cortex QA'd in final topology; the wedge + letter flows work.
- Migrated engine code NOT removed yet (C3); flags allow rollback. CI green. PRs held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_C1_cortex_cut_to_gate.md`: the recon (per-engine readiness + the gate-route answer), the per-engine cut + flag state, the lineage-preserved proof, the S1 integration-test output, the provenance-envelope shape, the final-topology QA, PR URLs + SHAs, and blockers verbatim.
