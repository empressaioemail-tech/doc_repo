---
date: 2026-05-26
repo: doc_repo
agent: planner (Grok-capable Cursor)
topic: cortex_prod_qa_laptop_sync
---

# Session — Cortex prod deploy QA + laptop workspace sync

## Outcomes

**Cortex prod (legacy-design-tools-prod).** Operator ran Cloud Shell deploys for `cortex-api`: image `76a5407` (PR #124/#126), then env patches for Studio (`RENDERS_PROD_ENABLED`, `MNML_RENDER_MODE=http`). Substrate MCP verified live (30 TX jurisdictions, `cedar_hill_tx` in catalog). Migrations run via GHA `run-migrations` (multiple dispatches; green). **PR #127 merged** (`74569dc`): Grok briefing engine, prod codes warmup 403 fix, auto-warmup on engagement geocode. Operator deploying image `74569dc` / `:latest` with `BRIEFING_LLM_MODE=grok` — final traffic shift in progress at session close.

**QA engagement.** **430 Evergreen Trl, Cedar Hill, TX** — active test project. Prior revision lacked geocode + cortex-local atoms; warmup button 403 on pre-#127 image. Post-#127: Code Library warmup should 200; PATCH address triggers `cedar_hill_tx` enqueue.

**cc-agent-C.** Dispatched and closed **PR #127** (Grok briefing + warmup + geocode auto-warmup). Prior dispatch: Grok finding engine (#124 wave).

**Laptop continuity.** New runbook [`90_runbooks/laptop_workspace_sync.md`](../90_runbooks/laptop_workspace_sync.md): clone list, `.env.local`, Cursor MCP (`X-Hauska-Key`, prod MCP URL), Grok HR-12, local dev (`dev-local-windows.ps1`), prod vs local table. Updated [`22_workstation_inventory.md`](../22_workstation_inventory.md), [`00b_doc_repo_guide.md`](../00b_doc_repo_guide.md), [`00_README.md`](../00_README.md) (Cortex prod = Cloud Run).

## Operator actions remaining

1. Finish deploy `74569dc` + shift traffic; verify `BRIEFING_LLM_MODE=grok` on serving revision.
2. QA on 430 Evergreen: geocode, warmup Cedar Hill, briefing (Grok), plan review (Grok), Studio floor plan viz (needs migrations + mnml secrets).
3. Laptop: `git pull` doc_repo, follow laptop runbook, copy `.env.local` + `mcp.json` from desktop.
4. **Post-QA:** master secret rotation (operator deferred).

## Security note

Live API keys appeared in Cloud Shell / chat during deploy sessions. Rotation queued post-QA; do not commit secrets to doc_repo.

## Atoms touched

- `runbook:laptop-workspace-sync`
- `sprint:40i` (Dallas / Cedar Hill E2E QA context)
- `decision:partnership-first-scoping` (referenced, unchanged)

## Model

Planner: Grok-capable Cursor in doc_repo.
