---
id: 2026-06-11_cc-agent-C_append_briefing_hydro_flags_to_deploy_workflow
title: Dispatch — append ENGINE_SPINE_BRIEFING + ENGINE_SPINE_HYDROLOGY to cloud-run-deploy.yml (both verified + live)
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — briefing + hydrology are LIVE in prod (00167-zac @ 100%) on manual flags; this makes both durable
related: [58_gtm_readiness_sprint, 61_property_intelligence_master_plan, _dispatches/2026-06-11_cc-agent-C_bake_engine_spine_flags_into_deploy_workflow, _dispatches/2026-06-11_cc-agent-C_append_briefing_flag_to_deploy_workflow]
---

# Append briefing + hydrology spine flags to the deploy workflow

> Supersedes the briefing-only append dispatch (`_dispatches/2026-06-11_cc-agent-C_append_briefing_flag_to_deploy_workflow.md`): briefing AND hydrology are now both verified green and live in prod (`cortex-api-00167-zac` @ 100%) on manually-applied flags. Only findings is baked into the workflow (#174). The next `deploy-canary` would clobber briefing + hydrology and silently revert both to the local engines. This appends both, per the one-at-a-time convention the #174 comment documents (both are individually verified, so they go in together now).

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main`. Branch prefix `cortex/`. Model: Grok Build 0.1.

## The change

In `.github/workflows/cloud-run-deploy.yml`, the `deploy-canary` step's `--set-env-vars` line (where #174 added `ENGINE_SPINE_FINDINGS=1,ENGINE_SPINE_FINDINGS_ORCHESTRATED=1`): **append** `ENGINE_SPINE_BRIEFING=1` and `ENGINE_SPINE_HYDROLOGY=1`. Update the one-at-a-time comment to record that findings + briefing + hydrology are live and **topography is the only remaining flip** (do not add `ENGINE_SPINE_TOPOGRAPHY` yet — it flips after its own canary verify).

## Acceptance

- `--set-env-vars` carries `ENGINE_SPINE_FINDINGS=1`, `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1`, `ENGINE_SPINE_BRIEFING=1`, `ENGINE_SPINE_HYDROLOGY=1`; `ENGINE_SPINE_TOPOGRAPHY` absent.
- Comment updated (findings + briefing + hydrology live; topography next).
- PR held for operator merge. Post-merge durability proof: one `deploy-canary`, then `gcloud run revisions describe <new> --format='value(spec.containers[0].env)'` shows all four spine flags + the gate-token secret with no manual `update`.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_append_briefing_hydro_flags_fix.md`: the diff (file:line), PR URL + SHA, post-merge durability-proof env dump verbatim.
