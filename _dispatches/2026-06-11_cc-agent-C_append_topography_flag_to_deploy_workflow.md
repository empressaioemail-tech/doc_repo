---
id: 2026-06-11_cc-agent-C_append_topography_flag_to_deploy_workflow
title: Dispatch — append ENGINE_SPINE_TOPOGRAPHY to cloud-run-deploy.yml (the last spine flag; completes the bake)
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — topography is LIVE in prod (00169-jep @ 100%) but its flag is still manual-only; this is the last bake
related: [58_gtm_readiness_sprint, 61_property_intelligence_master_plan, _dispatches/2026-06-11_cc-agent-C_append_briefing_hydro_flags_to_deploy_workflow]
---

# Append the topography spine flag to the deploy workflow

> Final durability step for the engine cut. All four reasoning engines are live on the spine in prod (`cortex-api-00169-jep` @ 100%). The bake currently covers findings (#174) + briefing + hydrology (the briefing+hydro append). Topography's flag (`ENGINE_SPINE_TOPOGRAPHY=1`) was applied manually after its verify and is NOT yet in the workflow, so the next `deploy-canary` would clobber it and silently revert topography to the local engine. This appends it, completing the bake. If the briefing+hydro append PR is still open, fold this in there; otherwise a standalone one-line PR.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main`. Branch prefix `cortex/`. Model: Grok Build 0.1.

## The change

In `.github/workflows/cloud-run-deploy.yml`, the `deploy-canary` step's `--set-env-vars` line (which now carries `ENGINE_SPINE_FINDINGS=1,ENGINE_SPINE_FINDINGS_ORCHESTRATED=1,ENGINE_SPINE_BRIEFING=1,ENGINE_SPINE_HYDROLOGY=1`): **append** `ENGINE_SPINE_TOPOGRAPHY=1`. Update the one-at-a-time comment to record that all four engines are now flipped and baked (the flip is complete; the next engine work is C3, not a flag).

## Acceptance

- `--set-env-vars` carries all five spine entries: `ENGINE_SPINE_FINDINGS=1`, `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1`, `ENGINE_SPINE_BRIEFING=1`, `ENGINE_SPINE_HYDROLOGY=1`, `ENGINE_SPINE_TOPOGRAPHY=1`, plus `ENGINE_API_URL` and the `ENGINE_API_GATE_TOKEN` secret.
- Comment updated (all four engines flipped + baked; C3 is next, not a flag).
- PR held for operator merge. Post-merge durability proof: one `deploy-canary`, then `gcloud run revisions describe <new> --format='value(spec.containers[0].env)'` shows all five spine flags + the gate-token secret with no manual `update`.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_append_topography_flag_fix.md`: the diff (file:line), PR URL + SHA, post-merge durability-proof env dump verbatim.
