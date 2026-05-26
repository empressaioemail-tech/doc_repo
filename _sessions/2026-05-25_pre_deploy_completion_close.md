---
id: 2026_05_25_pre_deploy_completion_close
title: Pre-deploy completion — Track R merged, Track C PR #123 open
status: active
last_updated: 2026-05-25
related: [40h_cortex_pre_deploy_completion_sprint, _sessions/2026-05-25_cc-agent-C_qa_fix_batch1]
---

# Pre-deploy completion close (2026-05-25)

## Track R (cc-agent-R) — DONE

- **PR #122** merged `01e7523` — QA-46 floor plan viz API, QA-48 video tab

## Track C (cc-agent-C) — PR OPEN

- **PR #123** `fix/predeploy/wsi-track-c-close` @ `b4211d0` (base `01e7523`)
- CI: typecheck green; **Test job FAILED** at close — merge blocked until green
- Migration **0019_workspace_settings.sql**
- WS-I Track C QA closed in code (see courier)

## Operator next

1. Fix or wait for #123 CI Test → merge #123
2. Deploy pin = merge SHA of #123 on `main`
3. Operator env: substrate MCP + Regrid + optional `RENDERS_PROD_ENABLED` / `MNML_RENDER_MODE=live`
4. Canary: build-and-push → deploy-canary → **run-migrations** (0019) → smoke → traffic
5. QA pass 5 full WS-I + 40g §J
