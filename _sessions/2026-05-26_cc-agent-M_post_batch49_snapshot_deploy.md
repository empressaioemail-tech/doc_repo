---
id: 2026-05-26_cc-agent-M_post_batch49_snapshot_deploy
title: Session — post–#49 corpus snapshot refresh + retrieval-api prod redeploy
date: 2026-05-26
agent: cc-agent-M
repo: [hauska-engine, hauska-mcp-server]
session_type: engineering
rolled_up: false
related:
  - _inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md
  - _inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy.md
  - _sessions/2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E.md
  - 43_cortex_qa_backlog.md
---

# Session — post–#49 corpus snapshot + retrieval-api redeploy

## Status

Done. Production retrieval catalog upgraded from **5** to **30** quality-bar
jurisdictions. **`cedar_hill_tx`** (706 atoms, platform-internal) is live for
Sprint 40i / QA-58 / QA-60 / QA-61.

## What was done

1. Ran `build-corpus-snapshot` on `hauska-engine` `main` after PR #49 merge
   (~96 min, live Municode + Path B).
2. Committed and pushed `services/retrieval-api/corpus/snapshot.json`
   (`5f32390`).
3. Redeployed `hauska-retrieval-api` to **`hauska-prod-497015`** (revision
   `hauska-retrieval-api-00003-gff`) — not `legacy-design-tools-prod` (doc
   drift in `DEPLOY.md`).
4. Verified retrieval-api and MCP `list_jurisdictions` (authenticated scope).

No `hauska-mcp-server` code or deploy changes.

## Verification

| Surface | Result |
|---------|--------|
| `GET /jurisdictions?qualityBarOnly=true` (retrieval-api) | **30** rows |
| `cedar_hill_tx` | **706** atoms, passing |
| MCP `list_jurisdictions` + auth key | **30** rows, Cedar Hill present |
| MCP unauthenticated | **2** `public-free` only (ADR-017) |

## Handoff

Close courier: [`_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md`](../_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md)

**cc-agent-C:** QA-61, QA-60, QA-58 substrate catalog verification can proceed.

## Next

- Update `hauska-engine/services/retrieval-api/DEPLOY.md` GCP project to
  `hauska-prod-497015`.
- Use absolute `--out` on future snapshot builds.
