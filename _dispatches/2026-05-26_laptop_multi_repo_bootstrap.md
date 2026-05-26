---
id: 2026-05-26_laptop_multi_repo_bootstrap
title: Dispatch — Laptop multi-repo bootstrap (all Cursor agents)
date: 2026-05-26
agent: cc-agent-C, cc-agent-E, cc-agent-M, cc-agent-AC (as needed)
repo: multiple
sprint: laptop_workspace_sync
related: [90_runbooks/laptop_workspace_sync.md, 00_current_state.md, 22_workstation_inventory.md]
---

# Laptop multi-repo bootstrap

**Operator context:** Desktop has been the active workstation for two weeks. Laptop Cursor needs the same repo versions, env files, and smoke checks. **doc_repo** was just updated; `git pull` there first.

**Read first (atoms):** `runbook:laptop-workspace-sync`, `00_current_state`, `sprint:40i`

Full runbook: [`90_runbooks/laptop_workspace_sync.md`](../90_runbooks/laptop_workspace_sync.md)

---

## Global rules

1. Set `<DEV_ROOT>` once (e.g. `C:\dev` or `P:\`) — all clones are siblings under it.
2. **One clone per agent.** Never two agents in one working tree.
3. **No secrets in git.** Copy `.env` / `.env.local` from desktop via secure channel.
4. Model: **Grok Build 0.1** (HR-12). Claude only on escalation.
5. Report back with `git log -1 --oneline` per repo and smoke results.

---

## Repo: legacy-design-tools (cc-agent-C) — REQUIRED

```powershell
cd <DEV_ROOT>
git clone https://github.com/empressaioemail-tech/legacy-design-tools.git
cd legacy-design-tools
git checkout main
git pull origin main
```

Copy `.env.local` from desktop (see `.env.local.example` + runbook §5).

```powershell
pnpm install --frozen-lockfile
cd lib\db
pnpm run push
cd ..\..
.\scripts\dev-local-windows.ps1
```

**Verify**

```powershell
curl.exe -s http://127.0.0.1:8080/api/healthz
curl.exe -s http://127.0.0.1:8080/api/substrate/health
```

Open http://localhost:20295 — confirm UI loads.

**Must be on `main` at or after PR #127** (`74569dc` — Grok briefing, codes warmup fix).

---

## Repo: hauska-mcp-server (cc-agent-M) — MCP config only unless hacking server

```powershell
cd <DEV_ROOT>
git clone https://github.com/empressaioemail-tech/hauska-mcp-server.git
cd hauska-mcp-server
git pull origin main
pnpm install --frozen-lockfile
```

**Laptop Cursor:** configure `~/.cursor/mcp.json` with **prod** URL (no local server required for substrate QA):

```text
https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/mcp
```

Header: `X-Hauska-Key` (not Bearer). Copy keys from desktop `mcp.json`.

Local dev only if changing MCP tools: copy `.env` from desktop, `NODE_OPTIONS=--use-system-ca`, `pnpm dev`.

---

## Repo: hauska-engine (cc-agent-E) — only if ingest work scheduled

```powershell
cd <DEV_ROOT>
git clone https://github.com/empressaioemail-tech/hauska-engine.git
cd hauska-engine
git pull origin main
pnpm install --frozen-lockfile
```

No daily smoke required unless running ingest. Confirm open PRs / branch state against `00_current_state` Sync 5 section.

---

## Repo: hauska-atom-contract (cc-agent-AC) — only if contract work scheduled

```powershell
cd <DEV_ROOT>
git clone https://github.com/empressaioemail-tech/hauska-atom-contract.git
cd hauska-atom-contract
git pull origin main
pnpm install --frozen-lockfile
```

---

## Optional repos

| Repo | When |
|------|------|
| `smartcity-os` | M-Stabilize unheld — check `00_current_state` |
| `legacy-revit-sensor` | Revit add-in work only |

---

## Close report (file in doc_repo `_inbox/`)

```markdown
---
date: 2026-05-26
repo: <repo-name>
agent: <seat>
---

# Laptop bootstrap close — <repo>

- git log -1: `<sha> <subject>`
- smoke: pass | fail — <detail>
- blockers: none | <list>
```

---

## Out of scope

- Changing production Cloud Run (operator / Cloud Shell)
- Merging open PRs without operator approval
- doc_repo canonical edits (planner only)
