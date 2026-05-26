---
id: 2026-05-26_operator_localhost_substrate_qa_runbook
title: Operator runbook — localhost substrate QA (40i / QA-61 / QA-62)
date: 2026-05-26
for: Nick (operator)
related: [QA-61, QA-62, QA-60, 40i_cortex_dallas_e2e_grok_plan_review_sprint]
---

# Operator runbook — localhost substrate + Dallas QA

Use this while **Agent E** runs Dallas ingest on `hauska-engine` and **cc-agent-C** runs 40i tracks on `legacy-design-tools`.

## What you are seeing vs what is real

| Layer | Where data lives | Your localhost today |
|-------|------------------|----------------------|
| **Hauska ingest** | `hauska-engine` DB + MCP `list_jurisdictions` | Real (Sync 5 metros #38–#47; Dallas after E merges) |
| **Code Library substrate grid** | cortex-api → MCP | **Fixture (5 rows)** unless `HAUSKA_SUBSTRATE_MODE=mcp` |
| **Your firm / Warm up** | Cortex `code_atoms` + `JURISDICTIONS` | Only cities cc-agent-C mapped (Bastrop, Grand, …) |

**Ingest alone does not create Warm up cards or plan-review citations.**

---

## Parallel work (who does what)

| Agent | Branch | Repo | You wait for |
|-------|--------|------|--------------|
| **E** | `stream-1d/dallas-county-tx` | `hauska-engine` | Dallas row in MCP catalog; handoff keys |
| **C** | `cortex/substrate-catalog-live-local` | `legacy-design-tools` | QA-61 UI + deploy.md (in progress on main worktree) |
| **C** | `cortex/grok-finding-engine` | `legacy-design-tools` | `AIR_FINDING_LLM_MODE=grok` |
| **C** | `cortex/dallas-code-corpus` | `legacy-design-tools` | Cedar Hill / Dallas in `jurisdictions.ts` + warmup |
| **You** | — | `.env.local` + MCP deploy | MCP mode + keys (QA-62) |

---

## QA-61 + QA-62 — unblock localhost substrate (do this now)

### 1. Edit `P:\legacy-design-tools\.env.local`

```text
HAUSKA_SUBSTRATE_MODE=mcp
HAUSKA_MCP_URL=https://<your-mcp-host>/mcp
HAUSKA_MCP_KEY=<cortex product key>
```

Copy template from `.env.local.example` if needed.

### 2. MCP server must be current

- Deployed **hauska-mcp-server** wired to engine DB **after** PRs #38–#47 (and Dallas after E merges).
- If `list_jurisdictions` over MCP still returns only 5 or old keys → **stop and redeploy MCP** (cc-agent-M / you). Do not file a Cortex ingest bug.

### 3. Restart api-server

```powershell
cd P:\legacy-design-tools
.\scripts\dev-local-windows.ps1
```

Or restart the api-server window only after editing `.env.local`.

### 4. Curl checks (before opening UI)

```powershell
curl -s http://localhost:8080/api/substrate/health
curl -s "http://localhost:8080/api/substrate/jurisdictions?states=TX"
```

**Pass:**

- `health.mode` = `mcp`
- `jurisdictions` JSON: `"source":"mcp"`, `total` >> 5
- Names include **San Antonio**, **Crowley**, **Converse**, … (with `states=TX`)

### 5. UI acceptance (Code Library)

- Badge: **live** (not fixture)
- Yellow fixture banner **gone**
- **Show all jurisdictions** → nationwide count matches MCP
- With Workspace practice state **TX**: filtered grid includes metros

---

## While Agent E runs Dallas

- **Do not** expect Dallas in plan review until **C** lands `cortex/dallas-code-corpus` + you **Warm up**.
- **Do** expect Dallas in substrate grid after E merge + MCP redeploy + your QA-62 env (browse only).
- E close file: `_inbox/2026-05-26_hauska-engine_cc-agent-E_dallas_substrate_ingest.md` — note `jurisdictionKey`(s) for C.

---

## QA-58 Dallas E2E (after substrate live)

Order:

1. QA-62 — MCP env (above)
2. QA-61 — C PR merged / or use worktree with substrate UI fixes
3. E — Dallas ingest merged + MCP refreshed
4. C — `cortex/dallas-code-corpus` + Warm up Dallas/Cedar Hill
5. C — `cortex/grok-finding-engine` + `.env.local`:

   ```text
   AIR_FINDING_LLM_MODE=grok
   XAI_API_KEY=<set>
   REGRID_API_KEY=<trial>
   ```

6. Engagement `430 Evergreen Trl` → Generate layers → coverage **ready** → Re-run plan review → citations with `[[CODE:...]]`

---

## Tickets

| ID | Owner | Status |
|----|-------|--------|
| **QA-61** | cc-agent-C | Code: mock banner, show-all, count fix, deploy.md, `/api/substrate/health` |
| **QA-62** | **Operator** | MCP URL + key + MCP deploy freshness — see `43_cortex_qa_backlog.md` |
| **QA-60** | C + you | Dallas E2E Grok + corpus (40i) |

---

## If still only 5 jurisdictions after mcp mode

1. `curl` still says `"source":"mock"` → api-server did not load `.env.local` (restart wrong window).
2. `"source":"mcp"` but count = 5 → **MCP catalog stale**; redeploy MCP against current engine.
3. Live catalog OK but no **Your firm** card → expected until C adds `JURISDICTIONS` + Warm up (not QA-61).
