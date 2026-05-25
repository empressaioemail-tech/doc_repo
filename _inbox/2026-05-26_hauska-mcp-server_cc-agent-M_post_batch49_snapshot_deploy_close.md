---
id: 2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close
title: Close — cc-agent-M post–batch-#49 snapshot refresh + retrieval-api redeploy
date: 2026-05-26
agent: cc-agent-M
from: cc-agent-M
to: [planning-agent, cc-agent-C, cc-agent-E, operator]
for_review: planning-agent
repo: [hauska-engine, hauska-mcp-server]
sprint: [51_substrate_v1_sprint, 40i_cortex_dallas_e2e_grok_plan_review_sprint]
related:
  - _inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy.md
  - _sessions/2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E.md
  - _sessions/2026-05-26_cc-agent-M_post_batch49_snapshot_deploy.md
  - _inbox/2026-05-26_hauska-engine_cc-agent-E_dallas_substrate_ingest.md
  - _dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md
  - 43_cortex_qa_backlog.md
status: closed
supersedes_status_of: 2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy
---

# Close — cc-agent-M: post–batch-#49 corpus snapshot + prod deploy

**Session:** cc-agent-M (Cursor, cente workstation)  
**Worktrees:** `P:\hauska-engine`, `P:\hauska-mcp-server` (verify-only; no MCP code changes)  
**Trigger:** cc-agent-E dispatch [`_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy.md`](_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy.md) after **hauska-engine PR #49** merged (`ebfca0f`).

---

## Executive summary

| Item | Status |
|------|--------|
| `build-corpus-snapshot` on `main` post-#49 | **Done** (~96 min wall time) |
| `snapshot.json` committed + pushed | **Done** — `hauska-engine` `5f32390` on `main` |
| `hauska-retrieval-api` redeploy | **Done** — revision `hauska-retrieval-api-00003-gff` |
| Retrieval-api verification | **Pass** — 30 jurisdictions; `cedar_hill_tx` @ 706 atoms |
| MCP `list_jurisdictions` (authenticated) | **Pass** — 30 jurisdictions; matches engine |
| MCP redeploy | **Not required** — `HAUSKA_BACKEND_URL` already pointed at live retrieval-api |
| **cc-agent-C ping** | **Ready** — QA-61 / QA-60 / QA-58 substrate unblocked |

**Prod catalog moved from 5 → 30 quality-bar jurisdictions.** Sprint **40i** primary substrate key **`cedar_hill_tx`** is live in production.

---

## Acceptance checklist (dispatch)

| Criterion | Result |
|-----------|--------|
| `build-corpus-snapshot` on `main` post-#49; `snapshot.json` committed | ✅ |
| `hauska-retrieval-api` redeployed with new snapshot in image | ✅ |
| `/jurisdictions?qualityBarOnly=true` returns **>20** rows | ✅ **30** |
| `cedar_hill_tx` visible with `atomCount > 0` | ✅ **706** |
| MCP `list_jurisdictions` (internal scope) matches retrieval-api | ✅ (authenticated; see §4) |
| `Secrets.txt` updated if URL rotated | ⏭️ **No change** — URL unchanged |
| Close note filed; ping cc-agent-C | ✅ this file |

---

## 1. Snapshot build

### Command (repo root)

```powershell
Set-Location P:\hauska-engine
# LEGACY_DATABASE_URL loaded from workstation .env for Grand County Path B
$env:NODE_OPTIONS='--use-system-ca'
pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts build-corpus-snapshot `
  --out services/retrieval-api/corpus/snapshot.json
```

### Outcome

| Metric | Value |
|--------|-------|
| `generatedAt` | `2026-05-25T19:47:14.324Z` |
| `atomCount` | 18,942 |
| `linkCount` | 18,932 |
| `jurisdictionCount` | **30** |
| Wall time | ~96 minutes |
| Exit code | 0 |

### Ingest units (31 attempted → 30 in snapshot)

| Unit | Result |
|------|--------|
| Bastrop UDC (Path C) | **Skipped** — 0 sections (live-source drift) |
| All other 30 units | **PASS** (eval ≥ 0.9 bar) |
| Grand County (Path B) | **PASS** — 285 sections (`LEGACY_DATABASE_URL` set) |

### Cedar Hill (QA-58 / QA-60 substrate)

| Field | Value |
|-------|-------|
| `jurisdictionTenant` | `cedar_hill_tx` |
| `jurisdictionName` | Cedar Hill, TX |
| `atomCount` | **706** |
| `qualityBar` | passing |
| `accessPolicy` | **platform-internal** |
| Eval | 0.91 / 1.00 / 1.00 PASS |

### Git

- **Commit:** `5f32390` — `chore(corpus): refresh retrieval-api snapshot post-#49 (30 jurisdictions)`
- **Remote:** pushed to `origin/main` (`ebfca0f..5f32390`)

### Operator pitfall (document for next refresh)

`pnpm --filter @hauska-engine/migrate-legacy-codes exec` runs with **package cwd** `tools/migrate-legacy-codes/`. A relative `--out services/retrieval-api/corpus/snapshot.json` initially wrote to:

`tools/migrate-legacy-codes/services/retrieval-api/corpus/snapshot.json`

**Fix applied:** copy artifact to repo-root `services/retrieval-api/corpus/snapshot.json` before commit.

**Recommendation:** always pass **absolute** `--out` from repo root, e.g.:

`--out P:/hauska-engine/services/retrieval-api/corpus/snapshot.json`

---

## 2. Retrieval-api redeploy

### Where it actually runs

| Doc says | Reality |
|----------|---------|
| `services/retrieval-api/DEPLOY.md` → `legacy-design-tools-prod` | **Stale** — no `hauska-retrieval-api` in that project |
| E0 session (2026-05-21) | Service lives in **`hauska-prod-497015`** / `us-central1` |

Deploy targeted the **live** service per [`_sessions/2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E.md`](_sessions/2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E.md).

### Deploy

```powershell
Set-Location P:\hauska-engine
# RETRIEVAL_API_KEY sourced from HAUSKA_ENGINE_API_KEY (Secret Manager) — matches MCP binding
gcloud run deploy hauska-retrieval-api --source . `
  --project=hauska-prod-497015 --region=us-central1 `
  --allow-unauthenticated --port=8080 --memory=1Gi --cpu=1 `
  --set-env-vars=RETRIEVAL_API_KEY=<from-secret>
```

| Field | Value |
|-------|-------|
| Revision | `hauska-retrieval-api-00003-gff` |
| Traffic | 100% |
| Primary URL | `https://hauska-retrieval-api-172690833726.us-central1.run.app` |
| Alt URL | `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` |

`doc_repo/Secrets.txt` **RETRIEVAL_API_URL** unchanged — no edit required.

**Follow-up (doc hygiene):** update `hauska-engine/services/retrieval-api/DEPLOY.md` project ID to `hauska-prod-497015` so future dispatches do not target the wrong GCP project.

---

## 3. Retrieval-api verification

Bearer: `HAUSKA_ENGINE_API_KEY` (Secret Manager, `hauska-prod-497015`).

```bash
curl -s -H "Authorization: Bearer <key>" \
  "https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app/jurisdictions?qualityBarOnly=true"
```

| Check | Before (pre-deploy) | After |
|-------|---------------------|-------|
| Row count (`qualityBarOnly=true`) | **5** | **30** |
| `cedar_hill_tx` | absent | present, `atomCount: 706` |

Sample `cedar_hill_tx` row (authenticated catalog):

```json
{
  "jurisdictionTenant": "cedar_hill_tx",
  "jurisdictionName": "Cedar Hill, TX",
  "atomCount": 706,
  "qualityBar": "passing",
  "accessPolicy": "platform-internal"
}
```

### Full jurisdiction keys in prod snapshot (30)

`austin_tx`, `bastrop_county_tx`, `bastrop_tx`, `boerne_tx`, `brownsville_tx`, `cedar_hill_tx`, `converse_tx`, `copperas_cove_tx`, `crowley_tx`, `dripping_springs_tx`, `elgin_tx`, `georgetown_tx`, `grand_county_ut`, `hutto_tx`, `keller_tx`, `killeen_tx`, `lago_vista_tx`, `leander_tx`, `live_oak_tx`, `lockhart_tx`, `manor_tx`, `mission_tx`, `new_braunfels_tx`, `rollingwood_tx`, `round_rock_tx`, `saginaw_tx`, `san_antonio_tx`, `schertz_tx`, `taylor_tx`, `wimberley_tx`

**Out of scope (unchanged):** City of Dallas / Dallas County — AmLegal partnership track per dispatch.

---

## 4. MCP server (`hauska-mcp-server`)

### Redeploy

**Not performed.** Cloud Run env already binds:

- `HAUSKA_BACKEND_URL` → `https://hauska-retrieval-api-172690833726.us-central1.run.app`
- `HAUSKA_ENGINE_API_KEY` → Secret Manager (matches retrieval bearer)

Catalog is **not cached at MCP boot** — each `list_jurisdictions` proxies live to retrieval-api. New snapshot effective after retrieval-api revision only.

### Verification — `list_jurisdictions`

| Caller | `quality_bar_only: true` | Count | Notes |
|--------|--------------------------|-------|-------|
| Unauthenticated (no `X-Hauska-Key`) | yes | **2** | `bastrop_tx`, `grand_county_ut` only (`public-free` per ADR-017) — **expected** |
| Authenticated `developer_pro` / `public` key | yes | **30** | includes `cedar_hill_tx` @ 706 atoms; no free-tier attribution string |

**MCP admin mint field:** response uses `raw_key`, not `key` — use `raw_key` in `X-Hauska-Key` for verification scripts.

### Service reference

| Service | URL |
|---------|-----|
| MCP | `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app` |
| Retrieval-api | `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` |

---

## 5. Downstream unblocks — ping cc-agent-C

| QA / sprint | Unblocked by |
|-------------|--------------|
| **QA-61** | Code Library / localhost substrate can show **live** MCP catalog (30 rows internal; 2 public-free anonymous) |
| **QA-60** | Plan-review E2E can cite **Cedar Hill** municipal code sections from prod substrate |
| **QA-58** | Engagement geocode → **`cedar_hill_tx`** (430 Evergreen Trl, Cedar Hill TX) |
| **Sprint 40i** | Primary substrate key **`cedar_hill_tx`** live — not Dallas / Dallas County |

**Suggested cc-agent-C next steps:**

1. Re-run [`_dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md`](_dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md) — expect `GET /api/substrate/jurisdictions?states=TX` **`total >> 5`** when MCP mode points at prod retrieval backend.
2. Confirm Code Library **LIVE** badge + `cedar_hill_tx` in catalog (platform-internal visibility via team/authenticated MCP key).
3. Proceed QA-60 Cedar Hill plan-review against live atoms.

**Operator localhost note:** If local `hauska-mcp-server` still shows 5 jurisdictions, restart `pnpm dev` so it picks up prod `HAUSKA_BACKEND_URL` / key from `.env` (see parallel recon inbox).

---

## 6. Risks / residuals

| Item | Severity | Owner |
|------|----------|-------|
| `DEPLOY.md` project ID wrong (`legacy-design-tools-prod`) | Doc drift | cc-agent-E or cc-agent-M |
| Relative `--out` path pitfall on snapshot build | Ops | cc-agent-M runbook |
| Bastrop UDC Path C drift (0 sections) | Low — B3 PDF still in corpus | cc-agent-E B.5 follow-up |
| Cloud Run memory if snapshot grows | Watch | operator — bump `--memory` if cold-start OOM |
| MCP free-anonymous still 2 jurisdictions | **By design** | ADR-017 — not a regression |

---

## 7. Related artifacts

| Artifact | Location |
|----------|----------|
| Dispatch (completed) | [`_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy.md`](_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy.md) |
| Session record | [`_sessions/2026-05-26_cc-agent-M_post_batch49_snapshot_deploy.md`](_sessions/2026-05-26_cc-agent-M_post_batch49_snapshot_deploy.md) |
| Cedar Hill ingest close | [`_inbox/2026-05-26_hauska-engine_cc-agent-E_dallas_substrate_ingest.md`](_inbox/2026-05-26_hauska-engine_cc-agent-E_dallas_substrate_ingest.md) |
| Build log (local, not committed) | `P:\hauska-engine\_snapshot-build.log` (operator may delete) |
| Engine commit | `https://github.com/empressaioemail-tech/hauska-engine/commit/5f32390` |

---

## 8. Planner actions

- [x] Mark dispatch acceptance checklist complete (this file).
- [ ] Archive or annotate dispatch inbox file `status: superseded-by-close`.
- [ ] Refresh `00_current_state.md` corpus / substrate bullets (30 jurisdictions live).
- [ ] Optional: patch `hauska-engine/services/retrieval-api/DEPLOY.md` GCP project.
- [ ] Fire / confirm cc-agent-C substrate catalog verification dispatch.

---

cc-agent-M session closed — post–batch-#49 snapshot + prod deploy complete.
