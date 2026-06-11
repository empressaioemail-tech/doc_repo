---
id: 2026-06-11_cc-agent-C_bake_engine_spine_flags_into_deploy_workflow
title: Dispatch — bake ENGINE_SPINE_* (findings) + engine-api wiring into cloud-run-deploy.yml so deploys stop clobbering the flip
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — findings-on-spine is LIVE in prod (00155-jex @ 100%) but only durable until the next deploy; this makes it durable
related: [58_gtm_readiness_sprint, 61_property_intelligence_master_plan, _dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate]
---

# Bake the engine-spine flip into the deploy workflow

> Findings-on-spine is live: `cortex-api-00155-jex` serves 100% with `ENGINE_SPINE_FINDINGS=1` + `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1` + `ENGINE_API_URL` + the `ENGINE_API_GATE_TOKEN` secret, applied via `gcloud ... update`. The deploy workflow's `deploy-canary` step uses `--set-env-vars` which REPLACES the whole env on every deploy (the line-204 clobber class we fought three times on 2026-06-11), so the next `deploy-canary` will drop these flags and silently revert prod findings to the local engine. This bakes them into the workflow so they survive. **Do not run `deploy-canary` until this merges** (or re-apply the env manually after, as the operator has been doing).

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main`. Branch prefix `cortex/`. Model: Grok Build 0.1; escalate on failure after retry. HR-8 verbatim artifacts.

## The change

In `.github/workflows/cloud-run-deploy.yml`, the `deploy-canary` job's `gcloud run ... deploy/update` step (the `--set-env-vars=...` line, ~line 204, the same one #154 fixed from mock to anthropic):

1. **Add to `--set-env-vars`** (append, do not remove the existing `AIR_FINDING_LLM_MODE=anthropic`, `BRIEFING_LLM_MODE=anthropic`, `AIR_FINDING_ORCHESTRATED=1`, etc.):
   ```
   ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app,
   ENGINE_SPINE_FINDINGS=1,
   ENGINE_SPINE_FINDINGS_ORCHESTRATED=1
   ```
2. **Add the gate-token secret** to the step's secret wiring (`--set-secrets` / `--update-secrets`, matching how the step already binds secrets):
   ```
   ENGINE_API_GATE_TOKEN=HAUSKA_ENGINE_API_KEY:latest
   ```
   The secret `HAUSKA_ENGINE_API_KEY` already exists in `legacy-design-tools-prod` (mirrored from engine-api's value, sha8 `e625ab2b`) and is IAM-bound to the `api-server-runtime@legacy-design-tools-prod.iam.gserviceaccount.com` service account. No secret creation needed; just reference it.

**Scope: findings only.** Do NOT add `ENGINE_SPINE_BRIEFING`, `ENGINE_SPINE_HYDROLOGY`, or `ENGINE_SPINE_TOPOGRAPHY` yet. The flip is one-engine-at-a-time with canary verification; each of those flags gets appended here only AFTER its engine is verified green on the canary (briefing next, then hydrology, then topography). Leave a comment in the workflow noting this so the next flip knows to append its flag here.

## Acceptance

- `deploy-canary` env block carries `ENGINE_API_URL` + `ENGINE_SPINE_FINDINGS=1` + `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1` and the `ENGINE_API_GATE_TOKEN` secret ref, additive to the existing env (nothing removed).
- Briefing/hydrology/topography spine flags absent (findings-only).
- A comment documents the one-at-a-time append convention.
- PR held for operator merge. After merge, the operator runs one `deploy-canary` + `shift-traffic` to confirm the flags survive a workflow deploy (the durability proof), reading `gcloud run revisions describe <new> --format=...` to verify the three env + secret are present without any manual `update`.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_bake_engine_spine_flags_fix.md`: the exact diff (file:line), PR URL + SHA, and the post-merge durability-proof revision env dump verbatim.
