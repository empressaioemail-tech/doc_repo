---
id: 2026-05-28_planner_gtm_engine_governance
title: Dispatch — GTM engine Track P (governance + steward)
date: 2026-05-28
agent: planner
repo: doc_repo
kind: dispatch
related: [76b_gtm_engine_polish_sprint, _decisions/2026-05-28_gtm_engine_polish_sprint, 16_commercialization_roadmap, 79a_weekly_moat_scoreboard, 90_runbooks/steward_daily_digest]
---

# Lane P — GTM engine governance (doc_repo)

You are the **doc_repo planner**. Execute in `P:\doc_repo`. No product-repo code in this lane unless Nick greenlights a docs-site PR.

**Sprint:** [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md)

## Atoms to resolve

- `strategy-module:gtm-engine-polish-sprint`
- `ops-scoreboard:weekly`

## Deliverables

### P1 — Public capability matrix (done at sprint open)

File: [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](../_catalog/ops/gtm_public_capability_matrix_v1.yaml)

- Rows: every MCP tool group + HTTP route exposed to agents.
- Columns: `tier`, `data_planes`, `attribution_required`, `anonymous_ok`, `notes`.
- Reconcile with Path A (`platform-internal` cities not listed as public-free).

### P2 — Launch channel plan scaffold

File: [`_catalog/ops/gtm_launch_channel_plan_v1.yaml`](../_catalog/ops/gtm_launch_channel_plan_v1.yaml)

- Channels from decision C ratification: Anthropic directory, awesome-mcp, blog, Show HN, MCP/Claude communities.
- Fields: `owner`, `target_date`, `depends_on`, `publish_artifact_path`, `status`.
- Leave `target_date` and `owner` for Nick to fill in N1 session; pre-fill artifact paths pointing to `hauska-mcp-server/docs/gtm/`.

### P3 — Steward + scoreboard

- Update [`90_runbooks/steward_daily_digest.md`](../90_runbooks/steward_daily_digest.md): MCP daily checks (log filter, external caller), digest `source_surface=mcp`.
- Update [`79a_weekly_moat_scoreboard.md`](../79a_weekly_moat_scoreboard.md): metrics `external_mcp_callers_wau`, `registry_submissions_live`, `docs_llms_fetch_ok`.

### P4 — Cross-links

- Add one paragraph + `related` in [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md) step 5 pointing to `76b_*`.
- Bump `last_updated` on touched canonical docs.

## Acceptance

- [ ] Matrix reviewed against `50_hauska_mcp_server` tool list (40 tools).
- [ ] Launch plan file ready for Nick edit.
- [ ] Steward runbook includes copy-paste Logging queries (placeholder until M close report supplies final filter).
- [ ] No contradiction with `_decisions/2026-05-28_gtm_engine_polish_sprint.md`.

## Report back

Session summary: `_sessions/2026-05-28_gtm_engine_governance_planner.md`  
Optional inbox: `_inbox/2026-05-28_doc_repo_planner_gtm_engine_governance_close.md`
