---
id: laptop_workspace_sync
title: Laptop workspace sync — match desktop Cursor + local Cortex QA
status: active
last_updated: 2026-05-26
applies_to: portfolio
related: [22_workstation_inventory, 21c_grok_atom_migration_plan, 44_mcp_cortex_architecture_map, 90_runbooks/agent_workspace_hygiene, 90_runbooks/cloud_run_canary_deploy, _inbox/2026-05-26_operator_localhost_substrate_qa_runbook, legacy-design-tools/docs/local-dev-windows.md]
owner: Nick
---

# Laptop workspace sync

> **Use this when** you open `doc_repo` on a machine that has not been used for portfolio work in the last two weeks (laptop, fresh clone, or reinstall). Goal: same working posture as the desktop — **local Cortex** for fast QA/E2E (`localhost:20295`), **prod Cloud Run** for deploy verification, **Cursor Grok** + **Hauska MCP** wired like the primary box.

**Desktop is source of truth** for secrets and `.env.local`. Nothing secret goes in git. Copy credentials via password manager, encrypted USB, or `gcloud secrets` after auth — never commit keys into `doc_repo` or product repos.

---

## Quick checklist (laptop day one)

| Step | Done |
|------|------|
| Pull latest `doc_repo` + read [`00_current_state.md`](../00_current_state.md) | |
| Install Node 20, pnpm 10, Git, GitHub CLI (`gh auth login`) | |
| Clone `legacy-design-tools` (+ `doc_repo` if not already) | |
| Copy `.env.local` from desktop (or rebuild from `.env.local.example`) | |
| `pnpm install` + `lib/db` push on `legacy-design-tools` | |
| Paste Cursor global rule + enable xAI (Grok) models | |
| Configure `~/.cursor/mcp.json` (prod MCP URL + keys) | |
| Open `doc_repo` in Cursor; confirm `CLAUDE.md` rules apply | |
| Run `.\scripts\dev-local-windows.ps1` → http://localhost:20295 | |
| Curl substrate health + optional prod smoke | |

---

## 1. Pick a dev root (paths)

Desktop uses `P:\`. Laptop may use a different drive. Pick **one root** and use it consistently:

```text
<DEV_ROOT>\doc_repo
<DEV_ROOT>\legacy-design-tools
<DEV_ROOT>\hauska-mcp-server      (optional — only for MCP server dev)
<DEV_ROOT>\hauska-engine            (optional — ingest / substrate work)
```

Examples: `C:\dev\`, `D:\repos\`, or map `P:\` the same as desktop.

Update Cursor **multi-root** or open folders per session. Agents assume sibling repos under the same parent when paths appear in dispatches.

---

## 2. Pull canonical docs first

```powershell
cd <DEV_ROOT>\doc_repo
git pull origin main
```

Read in order:

1. [`00_current_state.md`](../00_current_state.md)
2. [`CLAUDE.md`](../CLAUDE.md)
3. [`01a_atom_conventions.md`](../01a_atom_conventions.md) (atom-first dispatches)
4. This runbook

Planner sessions and cc-agent dispatches assume this snapshot is current.

---

## 3. Toolchain (Windows)

| Tool | Version | Notes |
|------|---------|--------|
| **Node.js** | 20 LTS | `node -v` |
| **pnpm** | 10.x | `corepack enable` then `corepack prepare pnpm@10 --activate` |
| **Git** | current | HTTPS remotes to `empressaioemail-tech/*` |
| **GitHub CLI** | `gh` | `gh auth login` + `gh auth setup-git` |
| **gcloud** | optional locally | Deploys: prefer **Cloud Shell** ([`cloud_run_canary_deploy.md`](cloud_run_canary_deploy.md)) |

Git identity (same as desktop):

```powershell
git config --global credential.https://github.com.username empressaioemail-tech
```

---

## 4. Clone repos (priority order)

### Required for Cortex local QA (same as recent desktop work)

```powershell
cd <DEV_ROOT>
git clone https://github.com/empressaioemail-tech/doc_repo.git
git clone https://github.com/empressaioemail-tech/legacy-design-tools.git
cd legacy-design-tools
git checkout main
git pull origin main
```

Confirm `main` includes **PR #127** (Grok briefing + codes warmup fix):  
`git log -1 --oneline` should show merge of `cortex/qa-briefing-grok-warmup` (commit `74569dc` or later).

### Optional (when task needs them)

| Repo | When |
|------|------|
| `hauska-mcp-server` | Changing MCP tools, local `:3000` server, minting API keys |
| `hauska-engine` | Jurisdiction ingest, corpus snapshot, retrieval-api |
| `hauska-atom-contract` | Atom contract schema work |
| `smartcity-os` | SmartCity track only |
| `legacy-revit-sensor` | Revit add-in work |

**Hygiene:** one clone per cc-agent; do not share a working tree between agents ([`agent_workspace_hygiene.md`](agent_workspace_hygiene.md)).

---

## 5. Secrets and `.env.local` (from desktop)

### Do not

- Commit `.env.local`, API keys, or `mcp.json` keys into git
- Paste live keys into `doc_repo` or chat logs

### Do

1. On **desktop**, copy `<DEV_ROOT>\legacy-design-tools\.env.local` to laptop (secure channel).
2. Or rebuild from `<DEV_ROOT>\legacy-design-tools\.env.local.example` and fill values from desktop password manager / Secret Manager.

### Minimum `.env.local` for local QA (mirror desktop)

See full template: `legacy-design-tools/.env.local.example` and [`legacy-design-tools/docs/local-dev-windows.md`](../../legacy-design-tools/docs/local-dev-windows.md) (path relative when both repos are siblings).

**Required**

```env
DATABASE_URL=postgresql://...@....neon.tech/neondb?sslmode=require
GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account-json>
PUBLIC_OBJECT_SEARCH_PATHS=/legacy-design-tools-prod-objects/public
PRIVATE_OBJECT_DIR=/legacy-design-tools-prod-objects/.private
```

Use the **same Neon `DATABASE_URL`** as desktop if you want the same engagements (e.g. 430 Evergreen Trl). Use a branch URL only if you intentionally want an isolated DB.

**Substrate catalog (Code Library live, not fixture)**

```env
HAUSKA_SUBSTRATE_MODE=mcp
HAUSKA_MCP_URL=https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/mcp
HAUSKA_MCP_KEY=<cortex product key — from desktop .env.local or Secret Manager>
```

**Grok plan review + briefing (local api-server)**

```env
AIR_FINDING_LLM_MODE=grok
BRIEFING_LLM_MODE=grok
XAI_API_KEY=<from desktop or xAI console>
XAI_BASE_URL=https://api.x.ai/v1
XAI_FINDING_MODEL=grok-3-mini
XAI_BRIEFING_MODEL=grok-3-mini
```

**Anthropic (AI chat only — unchanged)**

```env
AI_INTEGRATIONS_ANTHROPIC_API_KEY=<key>
AI_INTEGRATIONS_ANTHROPIC_BASE_URL=https://api.anthropic.com
```

**Studio / mnml (optional local real renders)**

```env
MNML_RENDER_MODE=http
MNML_API_URL=https://api.mnmlai.dev
MNML_API_KEY=<mnml key>
RENDERS_PROD_ENABLED=true
```

Default local boot uses **mock** mnml unless these are set; prod Cloud Run uses http + secrets.

### GCS credentials on laptop

`GOOGLE_APPLICATION_CREDENTIALS` must point to a JSON key whose SA can read `legacy-design-tools-prod-objects`. Copy the same key file path desktop uses, or create a laptop path and update `.env.local`.

If GLB/sheets return **500**, fix GCS before debugging the UI ([`local-dev-windows.md` § Troubleshooting](../../legacy-design-tools/docs/local-dev-windows.md)).

---

## 6. Database schema (once per machine / after pull)

```powershell
cd <DEV_ROOT>\legacy-design-tools
pnpm install --frozen-lockfile
cd lib\db
pnpm run push
```

After `main` moves forward with new migrations, re-run `push` or use the GHA `run-migrations` job against prod ([`cloud_run_canary_deploy.md`](cloud_run_canary_deploy.md)).

---

## 7. Cursor IDE alignment

### 7a. Open the right folders

- **Strategy / docs:** `<DEV_ROOT>\doc_repo` (planner, dispatches, session close)
- **Cortex code:** `<DEV_ROOT>\legacy-design-tools` (cc-agent-C work)

### 7b. Grok + global rule (HR-12)

Per [`21c_grok_atom_migration_plan.md`](../21c_grok_atom_migration_plan.md) Phase 1:

1. Cursor **Settings → Models**: enable xAI; base URL `https://api.x.ai/v1` if prompted.
2. Default agent model: **Grok Build 0.1** (agentic) or **grok-code-fast-1** (speed).
3. Paste the portfolio global rule from `21c` § Phase 1 (atom-first, workspace hygiene, decisive output).

`doc_repo` uses [`CLAUDE.md`](../CLAUDE.md) as workspace rules when that folder is open.

### 7c. MCP — `~/.cursor/mcp.json`

Two entries, **same prod URL**, different product keys. Header must be **`X-Hauska-Key`**, not `Authorization: Bearer` ([`44_mcp_cortex_architecture_map.md`](../44_mcp_cortex_architecture_map.md)).

**Prod-hosted MCP (recommended on laptop — no local :3000 required for substrate QA)**

```json
{
  "mcpServers": {
    "hauska-cortex": {
      "url": "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/mcp",
      "headers": {
        "X-Hauska-Key": "<CORTEX_PRODUCT_KEY>"
      }
    },
    "hauska-codex": {
      "url": "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/mcp",
      "headers": {
        "X-Hauska-Key": "<CODEX_PRODUCT_KEY>"
      }
    }
  }
}
```

Copy keys from desktop `mcp.json` or mint new keys on `hauska-mcp-server` admin API if rotating.

**Local MCP (optional)** — only if you run `hauska-mcp-server` on the laptop:

```text
url: http://localhost:3000/mcp
```

Requires separate `.env` in that repo (Neon `hauska_mcp` DB, Redis, `NODE_OPTIONS=--use-system-ca` on Windows). See `_sessions/2026-05-20_cutover_orientation_and_workflow_pr_claude_code.md`.

Restart Cursor after editing `mcp.json`. In agent chat, confirm MCP tools list loads (40 tools; product gate at call time).

### 7d. Cursor project MCP (doc_repo folder)

If `doc_repo` shows MCP servers under `.cursor/projects/.../mcps/`, those are **IDE-managed** copies. Laptop still needs global `mcp.json` (or project-level MCP settings in Cursor) with the same URLs/keys.

---

## 8. Start local Cortex (daily)

```powershell
cd <DEV_ROOT>\legacy-design-tools
.\scripts\dev-local-windows.ps1
```

- API: http://127.0.0.1:8080  
- UI: http://localhost:20295 (use Chrome; hard refresh **Ctrl+Shift+R** after api restart)

Verify:

```powershell
.\scripts\verify-local-pipeline.ps1
# optional:
.\scripts\verify-local-pipeline.ps1 -EngagementId <uuid>
```

```powershell
curl.exe -s http://127.0.0.1:8080/api/healthz
curl.exe -s http://127.0.0.1:8080/api/substrate/health
curl.exe -s "http://127.0.0.1:8080/api/substrate/jurisdictions?states=TX"
```

Pass: `substrate.health.mode` = `mcp`, TX `total` >> 5, `cedar_hill_tx` in list.

**Do not** run `pnpm --filter @workspace/api-server run dev` (Cloud Run proxy) unless you intentionally want prod API behavior without local routes.

---

## 9. Prod vs local (when to use which)

| Task | Where |
|------|--------|
| Fast UI/code iteration, E2E, warmup, briefing, plan review | **Local** `:20295` + `.env.local` |
| Deploy verification, stakeholder demo, “real prod” | **Cloud Run** `https://cortex-api-tds7av26va-uc.a.run.app` |
| Deploy / migrations / traffic | **Cloud Shell** + [`cloud_run_canary_deploy.md`](cloud_run_canary_deploy.md) |
| Substrate catalog browse in Code Library | Local api needs `HAUSKA_SUBSTRATE_MODE=mcp` + prod MCP URL |
| Cortex-local code atoms (plan review citations) | **Warm up** in Code Library or geocode PATCH (PR #127+); ingest in `code_atoms` |

Recent prod deploy target image: `74569dc` on `legacy-design-tools` `main` (PR #127). After laptop code changes: push PR → wait for GHA image → redeploy per runbook.

---

## 10. Sync when switching machines

**Leaving desktop → laptop**

1. `git push` any open branches on product repos
2. Copy or sync `.env.local` and `~/.cursor/mcp.json` (secure)
3. Note prod revision if mid-QA: `gcloud run services describe cortex-api --region=us-central1 --format='value(status.traffic[0].revisionName)'`

**Leaving laptop → desktop**

1. Push commits; open PRs from laptop branches
2. Drop `_inbox/` or session note if planner needs to reconcile
3. `git pull` on desktop before resuming

**Both machines**

- `doc_repo`: always `git pull` at session start
- `legacy-design-tools`: `git pull origin main` before `dev-local-windows.ps1`
- Never run two agents on one clone ([`agent_workspace_hygiene.md`](agent_workspace_hygiene.md))

---

## 11. QA reference (current sprint)

Operator localhost substrate steps: [`_inbox/2026-05-26_operator_localhost_substrate_qa_runbook.md`](../_inbox/2026-05-26_operator_localhost_substrate_qa_runbook.md)

Dallas / Cedar Hill E2E: [`40i_cortex_dallas_e2e_grok_plan_review_sprint.md`](../40i_cortex_dallas_e2e_grok_plan_review_sprint.md)

Test engagement: **430 Evergreen Trl, Cedar Hill, TX** (archive the duplicate; keep one active uuid).

Prod deploy env (after merge): `BRIEFING_LLM_MODE=grok`, `AIR_FINDING_LLM_MODE=grok`, `RENDERS_PROD_ENABLED=true`, `MNML_RENDER_MODE=http`, `HAUSKA_SUBSTRATE_MODE=mcp` — see [`legacy-design-tools/docs/deploy.md`](../../legacy-design-tools/docs/deploy.md).

---

## 12. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Code Library shows 5 fixture jurisdictions | Set `HAUSKA_SUBSTRATE_MODE=mcp` + MCP URL/key; restart api |
| Warm up 403 `codes_warmup_requires_internal_audience` | Pull `main` with PR #127; redeploy prod or run local api from #127 |
| GLB 500 in Model viewer | Fix `GOOGLE_APPLICATION_CREDENTIALS` + bucket paths |
| `viewpoint_renders` query errors on prod | Run `run-migrations` workflow ([`cloud_run_canary_deploy.md`](cloud_run_canary_deploy.md)) |
| MCP green but tools fail | Wrong header; use `X-Hauska-Key` |
| pnpm / node errors | Node 20 + `pnpm install --frozen-lockfile` at repo root |
| Laptop paths in docs say `P:\` | Substitute your `<DEV_ROOT>` |

---

## Related docs

- [`22_workstation_inventory.md`](../22_workstation_inventory.md) — per-machine paths (update laptop row when layout confirmed)
- [`44_mcp_cortex_architecture_map.md`](../44_mcp_cortex_architecture_map.md) — MCP topology
- [`90_runbooks/cloud_run_canary_deploy.md`](cloud_run_canary_deploy.md) — prod deploy sequence
- `legacy-design-tools/docs/local-dev-windows.md` — authoritative local dev runbook (in product repo)
