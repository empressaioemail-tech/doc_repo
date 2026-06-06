---
id: 2026-05-28_cc-agent-C_gtm_engine_observation_place_api
title: Dispatch — GTM engine Track C (place API + MCP observation)
date: 2026-05-28
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [76b_gtm_engine_polish_sprint, _decisions/2026-05-28_gtm_engine_polish_sprint, 75b_brief_coverage_v0, _dispatches/2026-05-28_dispatch-A_ldt_place-graph-brief, _dispatches/2026-05-28_cc-agent-M_gtm_engine_discoverability, 76a_operator_autonomous_loops]
---

# Lane C — GTM engine place API + unified observation

You are **cc-agent-C**, owner of `legacy-design-tools` (`cortex-api`) for this dispatch.

**Sprint:** [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md)  
**Coordination:** Finish or merge Dispatch A (`0030` snapshots) before claiming dossier E2E. Use a **dedicated branch** `cortex/gtm-engine-place-api` to avoid collision with open place-graph PR.

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude on retry failure.

## Atoms to resolve

- `current-state:portfolio`
- `strategy-module:gtm-engine-polish-sprint`
- `empressa-product:property-brief`

## Read first

1. [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md)
2. [`_dispatches/2026-05-28_dispatch-A_ldt_place-graph-brief.md`](2026-05-28_dispatch-A_ldt_place-graph-brief.md) — snapshots, coverage route
3. [`75b_brief_coverage_v0.md`](../75b_brief_coverage_v0.md) — status vocabulary
4. [`76a_operator_autonomous_loops.md`](../76a_operator_autonomous_loops.md) — GTM observation schema
5. [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](../_catalog/ops/gtm_public_capability_matrix_v1.yaml)

## Workspace

- Clone: operator `legacy-design-tools` cc-agent-C path
- Branch: `cortex/gtm-engine-place-api`
- Refuse alien worktree state per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)

## Scope — in

### C1 — Place HTTP API (service-token + brokerage key)

Implement on `artifacts/api-server`:

| Route | Behavior |
|-------|----------|
| `POST /api/brokerage/v1/place/resolve` | Body: `address` or `lat`/`lng`. Returns `placeKey`, `jurisdiction_key`, `ll_uuid?`, `workspaceDid?`, geocode confidence. |
| `GET /api/brokerage/v1/place/:placeKey/layers` | Snapshot → cache → live adapters; layer list with `layerKind`, provenance, DID refs. |
| `GET /api/brokerage/v1/place/:placeKey/dossier` | Bounded JSON: code `inlineRefs` (max 3) + parcel/zoning layers + federal summary refs; **reasoning stub optional**; every field cites source + `asOf`. |

Reuse `fetchBrokerageSiteContext` / place-layer snapshots from Dispatch A. Auth: `requireBrokerageKey` or `requireServiceToken` consistent with other brokerage v1 routes.

### C2 — GTM observation extension

Migration `lib/db/drizzle/0029_gtm_mcp_observation.sql`:

- Add column `source_surface` (`text`, default `api`) if not present.
- Extend `gtm_events.event_type` check or use text + validation for: `mcp_tool_call`, `mcp_connect`, `mcp_error`, `mcp_docs_clicked`.
- Payload JSON: `tool_name`, `error_class`, `jurisdiction_key`, `api_key_hash` (sha256 prefix only).

Update `recordGtmEvent` + `GET /api/brokerage/v1/gtm/digest` aggregations (counts by `source_surface`, top tools, external vs internal if `api_key_hash` tagged).

**Hook:** cortex-api middleware or MCP proxy callback is **out of repo** — for v1, add `POST /api/brokerage/v1/gtm/mcp-event` (brokerage key) that MCP server calls after each tool invocation (cc-agent-M wires caller).

### C3 — Unified error taxonomy

Shared module `artifacts/api-server/src/lib/gtmErrorClass.ts`:

Enum: `no_coverage`, `empty_corpus`, `auth_reject`, `upstream_timeout`, `geocode_miss`, `validation_error`, `unknown`.

Use in `/brief` failure paths and place routes; return in API JSON `errorClass`.

### C4 — Coverage page host

- Ensure `GET /api/brokerage/v1/coverage` matches [`75b_brief_coverage_v0.md`](../75b_brief_coverage_v0.md) manifest (or document drift).
- Static assets or route for **`brief.hauska.dev/coverage`** (or cortex static path documented in close report).
- CORS/read-only public GET for coverage JSON if needed by `hauska.dev/mcp/coverage` embed.

### C5 — Extension upsell (hauska-brief-extension)

If extension repo in scope on same workstation: add footer link “Build on this data → Hauska MCP” → `https://hauska.dev/mcp?utm_source=brief-extension` and fire `mcp_docs_clicked` via existing gtm client.

If not: document exact snippet in close report for operator manual merge.

## Scope — out

- MCP server tool registration (cc-agent-M)
- Docs site / llms.txt (cc-agent-M)
- Registry publish (Nick)
- Paywall / Stripe
- MCP server calling cortex without event hook (M adds hook)

## Acceptance criteria

- [ ] Place routes return 200 on Bastrop + Cedar Hill pilot addresses with citations.
- [ ] Second dossier request for same `placeKey`: **0** live Regrid HTTP (snapshots).
- [ ] Migration 0029 applied on test DB; fixture refresh script run.
- [ ] `brokerageGtm.test.ts` covers new event types + digest aggregates.
- [ ] `errorClass` present on failed `/brief` and failed place resolve in tests.
- [ ] Coverage API matches 75b table (or 75b updated in planner follow-up).
- [ ] `POST /api/brokerage/v1/gtm/mcp-event` accepts sample payload from MCP close report.

## Tests

```bash
pnpm --filter @workspace/api-server run test -- brokerageGtm
pnpm --filter @workspace/api-server run test -- place   # new suite name you add
```

## Report back

`P:/doc_repo/_inbox/2026-05-28_legacy-design-tools_cc-agent-C_gtm_engine_observation_place_api_close.md`

PR URL, migration evidence, sample `place/resolve` + `dossier` JSON (redact keys), digest output snippet, extension PR if any.
