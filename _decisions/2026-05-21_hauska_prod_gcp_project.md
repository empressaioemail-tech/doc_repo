---
id: 2026-05-21_hauska_prod_gcp_project
title: Decision — hauska-prod is the GCP project for Hauska commercial substrate
date: 2026-05-21
status: active
related: [2026-05-21_hauska_commercialization_sprint, 50_hauska_mcp_server, 72_hauska_inc_operations, 80_adrs/adr_008_engine_factor_out]
owner: nick
---

# Decision — hauska-prod GCP project

## Status

**Active, 2026-05-21.** Project created and live: `hauska-prod-497015` (display name `hauska-prod`, project number 172690833726, region `us-central1`, no GCP organization, billing linked).

## Decision

`hauska-prod-497015` is the canonical GCP project for Hauska Inc. commercial substrate. Both the Hauska MCP Server and the hauska-engine retrieval API deploy there. `cortex-api` and `api-server` stay in `legacy-design-tools-prod`; they are the Empressa Cortex product backend, not Hauska substrate. Cross-project calls (the MCP server's product-gated Cortex and Codex tools calling `cortex-api`) are expected and fine.

## Context

Lane M of the commercialization sprint chose a dedicated GCP project for the public MCP server. cc-agent-E, executing Lane E Phase E0 before the project existed, deployed the retrieval API to `legacy-design-tools-prod` as an interim and documented that redeploys would be unchanged once a Hauska project existed. The operator created `hauska-prod` on 2026-05-21; cc-agent-M deployed the MCP server straight into it (`hauska-mcp-server-h7gvu7rgcq-uc.a.run.app`).

## Reasoning

The commercialization layer is Hauska Inc. commercial substrate. It is revenue-bearing and carries a payment substrate with money-transmitter posture. Entity separation (Hauska Inc. as a separate C-corp from Legacy Group ATX LLC) is a settled principle per ADR-008 and CLAUDE.md. Hauska's commercial substrate belongs in a Hauska-owned GCP project, not inside an Empressa product project. Doing this before anything is public, with no live traffic and no customers, is far cheaper than migrating later.

## Consequences

The `legacy-design-tools-prod` retrieval API deploy is the interim and is superseded. cc-agent-E redeploys the retrieval API into `hauska-prod`, re-hands the endpoint URL and bearer key to cc-agent-M, and tears down the interim deploy.

## Reversal criteria

Revisit only if a Hauska Inc. GCP organization is stood up (tracked as future work in `72_hauska_inc_operations.md`). At that point `hauska-prod` moves under the organization; that is a migration, not a reversal of this decision.
