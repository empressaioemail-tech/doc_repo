---
id: 79a_weekly_moat_scoreboard
title: Weekly moat scoreboard — execution and compounding checks
status: active
last_updated: 2026-05-28
applies_to: portfolio
related: [79_competitive_execution_system, 76b_gtm_engine_polish_sprint, 90_runbooks/steward_daily_digest, _catalog/ops/gtm_public_capability_matrix_v1.yaml, 01a_atom_conventions, _dispatches/_template]
owner: planner
---

# Weekly moat scoreboard

Use this every Friday to decide what to continue, what to kill, and what to atomize.

Latest prefilled artifact: [`_inbox/2026-05-27_competitive_execution_week1_scoreboard.md`](_inbox/2026-05-27_competitive_execution_week1_scoreboard.md).

## Scoreboard template

```yaml
week_of: 2026-05-27
as_of: 2026-05-27T17:00:00Z
confidence: medium
source_pack:
  - 00_current_state.md
  - _inbox/<weekly reports>
  - CI and deploy logs
metrics:
  lead_time_to_verified_result_hours:
    value:
    target:
    trend: up|flat|down
  first_pass_success_rate:
    value:
    target:
    trend: up|flat|down
  citation_compliance_rate:
    value:
    target:
    trend: up|flat|down
  reusable_atom_yield_per_week:
    value:
    target:
    trend: up|flat|down
  jurisdiction_cost_envelope_hit_rate:
    value:
    target:
    trend: up|flat|down
  external_mcp_callers_wau:
    value:
    target:
    trend: up|flat|down
    source: Cloud Logging hauska-mcp-server is_external
  registry_submissions_live:
    value:
    target: "2"
    trend: up|flat|down
    source: anthropic directory + awesome-mcp PR status
  docs_llms_fetch_ok:
    value:
    target: "pass"
    trend: up|flat|down
    source: curl https://hauska.dev/llms.txt
lane_split:
  lane_a_percent:
  lane_b_percent:
  within_policy: true|false
wip:
  active_initiatives:
  over_cap_hours:
binary_calls:
  unresolved_over_72h:
kill_list:
  - item:
    reason:
promotions:
  - atom_or_template:
    reason:
```

## Weekly review checklist

1. Did we ship verified moat capability this week?
2. Did Lane B stay at or below 20% effort?
3. Did any decision remain unresolved beyond 72 hours?
4. Did we promote at least one reusable artifact?
5. Did we kill at least one low-leverage activity?

If 3 or more answers are "no," run an immediate focus reset on Monday.

## Targets (initial)

| Metric | Initial target |
|---|---|
| lead_time_to_verified_result_hours | minus 25% in 30 days |
| first_pass_success_rate | 70% or higher |
| citation_compliance_rate | 95% or higher |
| reusable_atom_yield_per_week | 1 or higher |
| jurisdiction_cost_envelope_hit_rate | 90% or higher |
| external_mcp_callers_wau | 1+ (sprint E5); distinct `key_hash` where `is_external=true` |
| registry_submissions_live | 2 (Anthropic directory + awesome-mcp PR merged) |
| docs_llms_fetch_ok | pass (`curl -sf https://hauska.dev/llms.txt`) |

MCP metric sources: [`90_runbooks/steward_daily_digest.md`](90_runbooks/steward_daily_digest.md) §Daily (MCP / agent GTM); sprint exit [`76b_gtm_engine_polish_sprint.md`](76b_gtm_engine_polish_sprint.md) E5, E4, E2.

## Atom ref

- `ops-scoreboard:weekly`

## Revision history

- **2026-05-28:** Added three MCP GTM metrics (E12) with targets and steward runbook cross-link.
- **2026-05-27:** Added link to prefilled week-1 scoreboard artifact.
- **2026-05-27:** Initial template filed.
