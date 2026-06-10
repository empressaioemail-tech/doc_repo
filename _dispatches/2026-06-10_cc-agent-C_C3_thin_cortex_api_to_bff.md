---
id: 2026-06-10_cc-agent-C_C3_thin_cortex_api_to_bff
title: Dispatch — C3, thin cortex-api to a product BFF
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: QUEUED — fire after C1 + C2 cuts are verified in their final topology (every consumer served from the spine)
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out, _dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate, _dispatches/2026-06-10_cc-agent-C_C2_extension_cut_and_unified_signin, 20_agent_operating_rules]
---

# C3 — thin cortex-api to a product BFF

> The final step of the lift (sprint 58 C3 / 56 step 6). With Cortex (C1) and the extension (C2) consuming engine reasoning from the spine through the gate, the migrated engine code in cortex-api is now dead weight behind feature flags. This cut removes it, locks the direct engine routes so nothing reaches an engine except through the gate, and leaves cortex-api as a thin product BFF: UI serving, session/auth (incl. the task #29 identity), and the snapshot/sheet/IFC ingest intake. Completes ADR-008. Supersedes the C3 portion of the umbrella `cortex_consume` dispatch.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools` (worktree on a `cortex/` branch if busy). Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Branch prefix `cortex/`. Refuse alien HEAD; report verbatim `git status` + `git log -3`.

## Read first

1. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) — the target BFF state + what stays in cortex-api
2. [`80_adrs/adr_008_engine_factor_out.md`](../80_adrs/adr_008_engine_factor_out.md) — the no-ungated-path principle
3. [`_dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate.md`](2026-06-10_cc-agent-C_C1_cortex_cut_to_gate.md) + [`_dispatches/2026-06-10_cc-agent-C_C2_extension_cut_and_unified_signin.md`](2026-06-10_cc-agent-C_C2_extension_cut_and_unified_signin.md) — the cuts this finalizes
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Scope

1. **Confirm every consumer is served from the spine (recon).** C1 (Cortex: brief/findings/hydrology/topo/decomposition/precedence) and C2 (extension brokerage path) all consume through the gate, verified, flags stable. Report any engine still served locally — do not remove its code until it is cut.
2. **Remove the migrated engine code from cortex-api.** Delete `lib/adapters`, `lib/briefing-engine`, `lib/finding-engine` (incl. decomposition + precedence, now on the spine), and the hydrology/topography engine code that lifted. Remove the now-dead per-engine feature-flag branches. Keep only what the BFF needs (the seam client that calls the gate, the calibration-port binding if it stays cortex-side per Topology A).
3. **Lock the direct engine routes.** Remove or hard-disable any cortex-api route that reaches an engine except through the gate-front seam. Verify no ungated path remains (a test or an explicit route audit).
4. **Leave cortex-api a thin BFF:** UI serving; session/auth (the task #29 per-user identity, shared with the extension); the snapshot/sheet/IFC ingest intake (Revit + extension ingress); product glue. Preserve the wedge intake (pre-Revit chat + image vision, #165), the deliverable-letter flow, and the artifact-UX.
5. **Regression-verify the whole product** in the BFF topology: plan review, brief, chat/wedge, letters, the extension (both tiers), Revit ingress — all work; lineage + provenance intact; calibration deposit/read intact.

## Acceptance criteria

- Recon confirms every consumer is spine-served before any code removal.
- Migrated engine code removed from cortex-api; dead flag branches removed; cortex-api builds + runs as a BFF.
- No ungated path to an engine remains (verified by audit/test).
- cortex-api = UI/session/auth + ingest only; the wedge, letters, extension (both tiers), and Revit ingress all work; lineage/provenance/calibration intact end to end.
- CI green. PRs held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_C3_thin_cortex_api_to_bff.md`: the recon (all-consumers-spine-served), what code was removed, the no-ungated-path audit, the full-product regression in BFF topology, PR URLs + SHAs, and blockers verbatim.
