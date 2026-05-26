---
status: pointer
move_to: P:\hauska-brief-extension
last_updated: 2026-05-26
---

# Hauska Property Brief extension (pointer)

**Source repo:** `P:\hauska-brief-extension`  
**Canonical spec:** [`75a_hauska_brief_extension.md`](../75a_hauska_brief_extension.md)  
**GTM plan:** [`75_hauska_brokerage_workflow_plan.md`](../75_hauska_brokerage_workflow_plan.md)

Do not commit extension binaries or `node_modules` into `doc_repo`.

## Install

```powershell
cd P:\hauska-brief-extension
node scripts/generate-icons.mjs
```

Chrome → Developer mode → Load unpacked → `P:\hauska-brief-extension`

## Backend (in flight)

cc-agent-C dispatch: [`_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md`](../_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md)

When deployed, set extension options:

- `briefApiUrl` = `https://<cortex-api-host>`
- `summarizeApiUrl` = `https://<cortex-api-host>/api/brokerage/v1/brief/summarize`

## Quick links

- MCP server: [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md)
- Laptop sync: [`90_runbooks/laptop_workspace_sync.md`](../90_runbooks/laptop_workspace_sync.md)
