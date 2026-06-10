---
id: 2026-06-10_cc-agent-E_engine_api_deploy
title: Dispatch — deploy engine-api to Cloud Run (the spine reasoning tier)
date: 2026-06-10
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
status: FIRE-READY — the C1 prerequisite; ICC-independent (deploy the engines we have; ICC backfills the corpus later)
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, _dispatches/2026-06-10_cc-agent-M_gate_wire_engine_api, _dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate, 80_adrs/adr_008_engine_factor_out, 20_agent_operating_rules]
---

# Deploy engine-api to Cloud Run

> The engine lift is merged (adapters #69, reasoning engines #70, calibration overlay I/O #71) but `engine-api` has never been deployed to Cloud Run — deploy was out of scope on the lift PRs. C1 (the Cortex cut) consumes `engine-api` through the gate, so it must be a live service first. This dispatch stands `engine-api` up in prod. **ICC-independent:** this deploys the reasoning engines we already have (web-first grounding, Topology-A calibration); the ICC licensed corpus backfills later when creds land and does not gate this.

You are **cc-agent-E**, single owner of `P:\hauska-engine` (worktree if the primary clone is dirty). Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it.

## Read first

1. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) — engine-api is the new reasoning service, sibling to retrieval-api
2. The engine-api service: `services/engine-api/` (its Dockerfile incl. the pysheds install; the `/v1/*` routes; the gate-front seam contract)
3. The retrieval-api deploy as the pattern: how retrieval-api is built + deployed to Cloud Run in `hauska-prod` (the deploy workflow / gcloud config / DEPLOY.md)
4. The Topology-A calibration port (PR #71): engine-api needs the cortex `DATABASE_URL` binding for the overlay I/O
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8

## Scope

1. **Recon (read-only, report first).** Confirm engine-api's deploy story against live source: the Dockerfile (pysheds + the reasoning deps build), the service config, and the env it needs — the LLM keys (Grok-first / Anthropic fallback), the `DATABASE_URL` for the calibration port (Topology A reaches the cortex Neon), and the gate-front seam context (`X-Hauska-*`). Report what the retrieval-api deploy does and how engine-api mirrors it (project/region, service account, secrets).
2. **Deploy engine-api to Cloud Run.** Build + push the image (pysheds baked), deploy the service in the same project/region as retrieval-api (or per the repo's deploy config), bind the required env/secrets. Health-check `/v1/*` (or the service health route) returns ok; the reasoning endpoints respond behind the seam contract.
3. **Report the engine-api URL** — the gate needs it (the paired cc-agent-M gate-wiring dispatch points `HAUSKA_BACKEND_URL` / a new engine URL at this service). Report the deployed revision + URL + health verbatim.
4. **Do NOT change the gate** (cc-agent-M) or cortex-api (cc-agent-C); this dispatch only stands up the engine-api service.

## Acceptance criteria

- Recon report: engine-api deploy config + required env confirmed against live source.
- engine-api deployed to Cloud Run; health ok; the `/v1/briefing|findings|hydrology|site-context` endpoints respond; pysheds baked (hydrology full-fidelity).
- Calibration port env (`DATABASE_URL` → cortex Neon) bound; LLM keys bound.
- The deployed URL + revision + health reported verbatim for the gate wiring.
- Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_hauska-engine_cc-agent-E_engine_api_deploy.md`: the recon, the deploy commands + the deployed URL + revision + health output verbatim, the env bound, and blockers verbatim.
