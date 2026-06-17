---
id: 2026-06-17_legacy-design-tools_cc-agent-C_gtm_external_caller_fix_close
title: cc-agent-C close — #187 GTM external-caller fix (dev-key purge regression)
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
status: fix verified locally; awaiting commit/push to PR #187
note: Mirrored into doc_repo by planner from the agent's chat report.
---

# cc-agent-C — #187 GTM external-caller fix — close (mirrored)

**Root cause:** the `BROKERAGE_DEV_API_KEY` purge mistakenly moved ALL of `BROKERAGE_API_KEYS` into `loadInternalGtmApiKeys()`, so external MCP caller keys (`external-mcp-caller-key-01/02`) were classified internal and `externalEventCount` stayed 0 — failing the two `brokerageGtm.test.ts` assertions (`GET /gtm/digest` line 150, `GET /gtm/triage` line 170). The CI failure was a real regression from the purge, not flakiness.

**Fix — restore the pre-purge split:**
- `gtmMcpEvents.ts`: `loadInternalGtmApiKeys()` uses `BROKERAGE_OPERATOR_API_KEYS` + `SERVICE_API_KEY` (replaces `BROKERAGE_DEV_API_KEY`) for the internal-GTM bucket.
- `brokerageAuth.ts`: `loadBrokerageApiKeys()` also loads `BROKERAGE_OPERATOR_API_KEYS`; `BROKERAGE_API_KEYS` = external MCP caller keys only (auth + GTM external).
- `brokerageGtm.test.ts`: restored split seeding (operator key in `BROKERAGE_OPERATOR_API_KEYS`, external keys in `BROKERAGE_API_KEYS`).
- `.env.example`, `.env.local.example`: document the new var.

**Verified locally:** all 8 `brokerageGtm.test.ts` tests pass (incl. the two that failed); `pnpm run typecheck` passes. **Pending:** commit + push to `feat/brokerage-federal-data-live-ingest` to re-run #187 CI.

**Planner flag (deploy):** before #187 deploys, confirm `BROKERAGE_OPERATOR_API_KEYS` is NOT wired into `cloud-run-deploy.yml --set-secrets` unless the secret exists in the cortex-api project (1062716564162) — otherwise it recreates the exact `BROKERAGE_DEV_API_KEY` deploy-canary failure. Keep it a plain env / optional, or create the secret first.
