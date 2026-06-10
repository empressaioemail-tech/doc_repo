---
id: 2026-06-10_cc-agent-M_gate_wire_engine_api
title: Dispatch — wire the gate to engine-api (+ migration 004) for the C1 cut
date: 2026-06-10
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
status: QUEUED — fire after engine-api is deployed (needs its URL); pairs with C1
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, _dispatches/2026-06-10_cc-agent-E_engine_api_deploy, _dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate, 54_tenant_leg_sprint, 20_agent_operating_rules]
---

# Wire the gate to engine-api (+ migration 004)

> C1 cuts Cortex to consume the spine `engine-api` THROUGH the gate. Today the gate's backend points at retrieval-api (the read-only corpus tier), not engine-api (the reasoning tier). This dispatch wires the gate to reach engine-api so the gate can proxy reasoning calls, and applies the parked migration 004 (tenant resolution) on the deploy. Resolves the open question C1's recon flags: whether the gate already proxies the engine-api `/v1/*` endpoints or needs new gate routes/tools.

You are **cc-agent-M**, single owner of `hauska-mcp-server`. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it.

## Read first

1. [`_dispatches/2026-06-10_cc-agent-E_engine_api_deploy.md`](2026-06-10_cc-agent-E_engine_api_deploy.md) — the engine-api deploy; its reported URL is the input here
2. [`_dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate.md`](2026-06-10_cc-agent-C_C1_cortex_cut_to_gate.md) — the cut that consumes this; the gate-route question
3. The gate: `hauska-mcp-server/src/tools.ts`, the backend client, the env (`HAUSKA_BACKEND_URL` → retrieval today); the gate-front seam contract
4. [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) — migration 004 (tenant resolution)
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8

## Scope

1. **Recon (read-only, report first).** Determine whether the gate already proxies the engine-api `/v1/*` reasoning endpoints (briefing/findings/hydrology/site-context) to gate-consumers, or whether new gate routes/tools are needed for cortex-api to reach engine reasoning through the gate. Report the exact gap C1 depends on.
2. **Wire the gate to engine-api.** Point the gate at the deployed engine-api URL (a new `ENGINE_API_URL` env, keeping `HAUSKA_BACKEND_URL` → retrieval for corpus reads; do not collapse the two tiers — retrieval is read-only corpus, engine-api is reasoning). Add the gate routes/tools the recon found missing so cortex-api can consume reasoning through the gate, carrying the tenant context (the seam already threads tenant; preserve it). Preserve citation/atomId lineage through the gate (arrow-two depends on it).
3. **Apply migration 004 (tenant resolution) on the deploy** — the parked reminder; run-migrations on the gate's next deploy.
4. **Deploy the gate** with the new wiring + migration; health-check all deps ok (engine/retrieval/postgres/upstash).

## Acceptance criteria

- Recon: the gate-proxy-vs-new-routes question answered; the C1 gap named.
- Gate reaches engine-api (reasoning) AND retrieval-api (corpus) as distinct tiers; the routes/tools C1 needs exist; tenant context + lineage preserved through the gate.
- Migration 004 applied; gate deployed; health ok (all deps).
- Verbatim verification artifacts (HR-8); the gate's engine-api wiring + deployed revision reported.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_hauska-mcp-server_cc-agent-M_gate_wire_engine_api.md`: the recon (gate-route gap), the wiring (env + routes/tools added), the migration-004 apply, the deploy + health output verbatim, and blockers verbatim.
