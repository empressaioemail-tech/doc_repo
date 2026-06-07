---
id: steward_daily_digest
title: Steward daily digest — maintenance + GTM loops
status: active
last_updated: 2026-05-28
applies_to: portfolio
related: [76a_operator_autonomous_loops, 76b_gtm_engine_polish_sprint, 76_empressa_wedge_90d_operating_plan, 90_runbooks/diagrams/self_healing_loop.mermaid, 90_runbooks/diagrams/gtm_loop.mermaid, _catalog/ops/gtm_public_capability_matrix_v1.yaml]
owner: planner
---

# Steward daily digest — maintenance + GTM loops

> **Purpose.** Operator-facing checklist until an automated steward agent ships. Planner (or Nick) runs this **daily** (5 min) and **Friday weekly KPI** (15 min).

## Daily (maintenance loop)

Automated by the **health-watch aggregator** (76e observability sprint, `cortex/observability-hub`). **Deploy-pending:** live once the cc-agent-C PR merges and `cortex-api` deploys; use the manual fallbacks below until then. Cloud Scheduler fires `POST /api/ops/health-watch` on `cortex-api` daily (7 AM US Central). The report polls all six Cloud Run services, revision/traffic drift, peer `hauska_health` signals (gate probe, scraper jobs, Neon size), and emits structured Cloud Logging lines.

**Copy-paste — latest health-watch report (service token required):**

```bash
curl -sS -X POST \
  -H "Authorization: Bearer $SERVICE_API_KEY" \
  "https://cortex-api.hauska.dev/api/ops/health-watch" | jq .
```

**Copy-paste — Cloud Logging filter for emitted maintenance signals:**

```
jsonPayload.hauska_health=true
timestamp>="-24h"
```

Group by `jsonPayload.check` and `jsonPayload.service`. Every line carries `source`, `value`, `threshold`, and `ts`.

**Manual fallbacks** (when the aggregator or Scheduler is down):

1. **Cloud Run** `cortex-api` latest revision receiving traffic (not pinned stale revision).
2. **Brokerage smoke:** one `POST /api/brokerage/v1/brief` on Bastrop + Cedar Hill pilot addresses (or internal script).
3. **Error scan:** Cloud Logging filter `severity>=ERROR` + `brokerage` last 24h.

**Steward triage (still manual):**

4. **Open `_inbox/`** cc-agent-C items; tag triage bin: bug | degradation | friction | opportunity.
5. **Note blockers** for next dispatch.

## Daily (GTM loop)

1. **`GET /api/brokerage/v1/gtm/digest`** (brokerage API key) — event counts last 7 days.
2. **Brief volume:** count `brief_completed` vs `brief_failed`.
3. **Consent:** new `gtm_consent` rows vs extension installs (rough ratio).
4. **Pipeline:** any pilot reply due today ([`71_pipeline.md`](../71_pipeline.md)).
5. **MCP upsell:** count `mcp_docs_clicked` (after extension ships C5).

## Daily (MCP / agent GTM)

Per [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md) and [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](../_catalog/ops/gtm_public_capability_matrix_v1.yaml).

**Placeholder log filter (replace when cc-agent-M close report lands):**

```
LOG_FILTER_PLACEHOLDER_M_CLOSE
resource.type="cloud_run_revision"
resource.labels.service_name="hauska-mcp-server"
jsonPayload.tool!=""
timestamp>="-24h"
```

**Copy-paste — external tool calls last 24h (Cloud Console → Logging → Query):**

```
resource.type="cloud_run_revision"
resource.labels.service_name="hauska-mcp-server"
jsonPayload.tool!=""
jsonPayload.is_external=true
timestamp>="-24h"
```

**Copy-paste — gcloud (adjust project if not `legacy-design-tools-prod`):**

```bash
gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="hauska-mcp-server" AND jsonPayload.tool!="" AND jsonPayload.is_external=true AND timestamp>="-24h"' --project=legacy-design-tools-prod --limit=50 --format=json
```

**Copy-paste — digest MCP slice (after migration `0029_gtm_mcp_observation.sql`):**

```bash
curl -sS -H "Authorization: Bearer $BROKERAGE_API_KEY" \
  "https://cortex-api.hauska.dev/api/brokerage/v1/gtm/digest?days=7" \
  | jq '.events | map(select(.source_surface=="mcp")) | group_by(.event_type) | map({type: .[0].event_type, count: length})'
```

Daily checks:

1. Run external-caller query above; record distinct `key_hash` where `is_external=true` (sprint E5).
2. **`GET /api/brokerage/v1/gtm/digest`** — counts for `source_surface=mcp`, top `tool_name`, `mcp_error` / `brief_failed` rate (when 0029 landed).
3. **`curl -sf https://hauska.dev/llms.txt`** — must return 200 (E2 docs flip).
4. **Coverage sanity:** `GET /api/brokerage/v1/coverage` — one `neon` city and one `engine_only` city vs [`75b_brief_coverage_v0.md`](../75b_brief_coverage_v0.md); confirm no `platform-internal` city appears as public-free in marketing copy.

## Friday weekly KPI

| Metric | Source |
|--------|--------|
| Brief success rate | `brief_completed / (completed + failed)` from digest |
| Active install IDs | distinct `install_id` in digest |
| Corpus misses | `corpusStatus=no_match` in brief payloads (sample) |
| Paid pipeline | `71_pipeline` brokerage rows |
| Legal gates | E&O bound Y/N; pilot agreement sent Y/N ([`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md)) |
| External MCP callers (WAU) | Cloud Logging `is_external=true` distinct `key_hash` |
| Registry submissions live | Anthropic directory + awesome-mcp PR merged (Y/N) |
| `llms.txt` fetch OK | `curl -sf https://hauska.dev/llms.txt` |

Escalate to Nick (Tier 3): enterprise meeting, municipal, partnership contract, architecture fork.

## Automated steward (queued)

Replace manual digest with agent reading Cloud Logging + `gtm/digest` + `_inbox/` → single markdown post to `_sessions/` or operator channel.
