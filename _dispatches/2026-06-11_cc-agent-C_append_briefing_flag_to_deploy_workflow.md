---
id: 2026-06-11_cc-agent-C_append_briefing_flag_to_deploy_workflow
title: Dispatch — append ENGINE_SPINE_BRIEFING to cloud-run-deploy.yml (briefing flip verified + live)
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — briefing-on-spine is LIVE in prod (00161-mus @ 100%); this makes it durable across deploys
related: [58_gtm_readiness_sprint, 61_property_intelligence_master_plan, _dispatches/2026-06-11_cc-agent-C_bake_engine_spine_flags_into_deploy_workflow]
---

# Append ENGINE_SPINE_BRIEFING to the deploy workflow

> The briefing flip is verified green and live: `cortex-api-00161-mus` serves 100% with `ENGINE_SPINE_BRIEFING=1` applied manually (briefing now generated on the spine via `engine-api`, grok, persisting cleanly after the #175 date fix). Like findings before the #174 bake, this flag is manual-only and the next `deploy-canary` would clobber it. This appends it to the workflow so it survives, per the one-at-a-time convention the #174 comment documents.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main`. Branch prefix `cortex/`. Model: Grok Build 0.1.

## The change

In `.github/workflows/cloud-run-deploy.yml`, the `deploy-canary` step's `--set-env-vars` line (where #174 added `ENGINE_SPINE_FINDINGS=1,ENGINE_SPINE_FINDINGS_ORCHESTRATED=1`): **append** `ENGINE_SPINE_BRIEFING=1` to that list. Update the one-at-a-time comment to record that briefing is now live and hydrology is next.

Do NOT add `ENGINE_SPINE_HYDROLOGY` or `ENGINE_SPINE_TOPOGRAPHY` (those flip after their own canary verify).

## Acceptance

- `--set-env-vars` carries `ENGINE_SPINE_FINDINGS=1`, `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1`, and now `ENGINE_SPINE_BRIEFING=1`; hydro/topo absent.
- Comment updated (findings + briefing live; hydrology next).
- PR held for operator merge. Post-merge durability proof: one `deploy-canary` then `gcloud run revisions describe <new> --format='value(spec.containers[0].env)'` shows all three spine flags + the gate-token secret with no manual `update`.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_append_briefing_flag_fix.md`: the diff (file:line), PR URL + SHA, post-merge durability-proof env dump verbatim.
