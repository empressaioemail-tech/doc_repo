---
id: 2026-05-26_hauska-mcp-server_cc-agent-M_post_lane-batch_snapshot_deploy_close
title: Close — cc-agent-M post–lane-batch snapshot refresh + retrieval-api redeploy (partial)
date: 2026-05-26
agent: cc-agent-M
from: cc-agent-M
to: [planning-agent, cc-agent-C, cc-agent-E, operator]
for_review: planning-agent
repo: [hauska-engine, hauska-mcp-server]
sprint: [51_substrate_v1_sprint, 40i_cortex_dallas_e2e_grok_plan_review_sprint]
related:
  - _inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md
  - _sessions/2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E.md
  - _inbox/2026-05-26_hauska-engine_cc-agent-E-C_batch1-pharr-suburbs.md
  - _inbox/2026-05-26_hauska-engine_cc-agent-E-N_lane-kickoff.md
  - _inbox/2026-05-26_hauska-engine_cc-agent-E-H_discovery-kickoff.md
  - _inbox/2026-05-26_hauska-engine_cc-agent-E-W_el-paso-slice-kickoff.md
status: closed
---

# Close — cc-agent-M: post–lane-batch corpus snapshot + prod deploy (merged PRs only)

**Session:** cc-agent-M (Cursor, cente workstation)  
**Worktrees:** `P:\hauska-engine`, `P:\hauska-mcp-server` (verify-only; no MCP code changes)  
**Baseline:** prior close [`_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md`](_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md) — snapshot `5f32390`, **30** jurisdictions.

---

## Executive summary

| Item | Status |
|------|--------|
| Pre-flight: `main` pulled (`b639846` → lane merges) | **Done** |
| **Operator merge gate** | **10 PRs still OPEN** — see §1; snapshot includes **merged** lane work only |
| UNITS gap fix (Pasadena + Sugar Land on main, missing from snapshot builder) | **Done** — `0a73bbe` |
| `build-corpus-snapshot` | **Done** (~150 min wall time, exit 0) |
| `snapshot.json` committed + pushed | **Done** — `3da7ed7` on `main` |
| `hauska-retrieval-api` redeploy | **Done** — revision **`hauska-retrieval-api-00004-m9t`** |
| Retrieval-api verification | **Pass** — **34** jurisdictions (was 30) |
| MCP `list_jurisdictions` (authenticated) | **Pass** — **34**; matches retrieval-api |
| MCP unauthenticated | **Pass** — **2** (`bastrop_tx`, `grand_county_ut`) per ADR-017 |
| MCP redeploy | **Not required** — `HAUSKA_BACKEND_URL` already prod retrieval-api |
| **cc-agent-C ping** | **Ready** — QA-61 / QA-60 / QA-58 substrate unblocked for **merged** catalog |

**Prod catalog: 30 → 34 quality-bar jurisdictions** (+4 from lane batch merges on `main`).

---

## 1. Operator merge gate (blocked keys — NOT in this snapshot)

Pre-flight after snapshot commit `5f32390` found **10 open ingest PRs**. Per runbook: **do not snapshot unmerged branches**. This deploy reflects **only** what is on `origin/main`.

### Merged since `5f32390` (included)

| PR | Jurisdiction / scope |
|----|----------------------|
| [#50](https://github.com/empressaioemail-tech/hauska-engine/pull/50) | `el_paso_tx` — CoO Title 18 |
| [#51](https://github.com/empressaioemail-tech/hauska-engine/pull/51) | `watauga_tx` |
| [#53](https://github.com/empressaioemail-tech/hauska-engine/pull/53) | `pasadena_tx` |
| [#54](https://github.com/empressaioemail-tech/hauska-engine/pull/54) | `sugar_land_tx` |

### Still OPEN — **blocked on operator merge** (next snapshot refresh)

| PR | Lane | Keys (expected) |
|----|------|-----------------|
| [#52](https://github.com/empressaioemail-tech/hauska-engine/pull/52) | E-W | `el_paso_tx` Title 19 |
| [#55](https://github.com/empressaioemail-tech/hauska-engine/pull/55) | E-C | `pharr_tx` |
| [#56](https://github.com/empressaioemail-tech/hauska-engine/pull/56) | E-N | `plano_tx` |
| [#57](https://github.com/empressaioemail-tech/hauska-engine/pull/57) | E-W | `el_paso_tx` Title 20 |
| [#58](https://github.com/empressaioemail-tech/hauska-engine/pull/58) | E-W | `el_paso_tx` Title 21 |
| [#59](https://github.com/empressaioemail-tech/hauska-engine/pull/59) | E-C | `selma_tx` |
| [#60](https://github.com/empressaioemail-tech/hauska-engine/pull/60) | E-C | `universal_city_tx` |
| [#61](https://github.com/empressaioemail-tech/hauska-engine/pull/61) | E-C | `leon_valley_tx` |
| [#62](https://github.com/empressaioemail-tech/hauska-engine/pull/62) | E-C | `anthony_tx` |
| [#63](https://github.com/empressaioemail-tech/hauska-engine/pull/63) | E-C | `socorro_tx` |

**Operator action:** merge the above (batch or individual), then re-dispatch cc-agent-M for a full lane-batch snapshot when all critical PRs are on `main`.

---

## 2. Pre-flight fixes on `main`

### UNITS wiring (cc-agent-M)

PRs #53/#54 merged `*-curated-queries.ts` but omitted `build-corpus-snapshot.ts` UNITS entries. Fixed before snapshot:

- **Commit:** `0a73bbe` — `fix(corpus): wire Pasadena + Sugar Land into snapshot UNITS`
- **Docs:** `24add19` — `DEPLOY.md` gcloud `--project=hauska-prod-497015`

---

## 3. Snapshot build

### Command

```powershell
Set-Location P:\hauska-engine
# LEGACY_DATABASE_URL from workstation .env (Grand County Path B)
$env:NODE_OPTIONS='--use-system-ca'
pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts build-corpus-snapshot `
  --out P:/hauska-engine/services/retrieval-api/corpus/snapshot.json
```

### Outcome

| Metric | Value |
|--------|-------|
| `generatedAt` | `2026-05-26T17:26:12.400Z` |
| `atomCount` | **21,126** (was 18,942) |
| `linkCount` | 21,116 |
| `jurisdictionCount` | **34** (was 30) |
| Wall time | ~150 minutes |
| Exit code | 0 |

### New jurisdictions vs post–#49 snapshot (4)

| Key | Atoms (build log) | Eval |
|-----|------------------:|------|
| `el_paso_tx` | 659 (Title 18) | 1.00 / 1.00 / 1.00 PASS |
| `watauga_tx` | 235 | 1.00 / 1.00 / 1.00 PASS |
| `pasadena_tx` | 463 | 1.00 / 1.00 / 1.00 PASS |
| `sugar_land_tx` | 542 | 1.00 / 1.00 / 1.00 PASS |

### Cedar Hill (QA-58 / QA-60)

| Field | Value |
|-------|-------|
| `jurisdictionTenant` | `cedar_hill_tx` |
| `atomCount` | **706** (unchanged) |
| `qualityBar` | passing |

### Git (verbatim `git log -1`)

```
3da7ed788b4288ed6dfaf43897869c7b38a43775
chore(corpus): refresh retrieval-api snapshot post Sync-5 lane batch
generatedAt: 2026-05-26T17:26:12.400Z
jurisdictionCount: 34
atomCount: 21126
linkCount: 21116

Merged lane PRs on main: #50 El Paso Title 18, #51 Watauga, #53 Pasadena, #54 Sugar Land (+ batch #49 baseline). Open PRs #52,#55-#63 held for operator merge.
```

---

## 4. Retrieval-api redeploy

| Field | Value |
|-------|-------|
| Project | `hauska-prod-497015` |
| Region | `us-central1` |
| Service | `hauska-retrieval-api` |
| Revision | **`hauska-retrieval-api-00004-m9t`** |
| Traffic | 100% |
| URL | `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` |

`RETRIEVAL_API_KEY` sourced from Secret Manager `HAUSKA_ENGINE_API_KEY` (matches MCP server binding).

---

## 5. Retrieval-api verification

`GET /jurisdictions?qualityBarOnly=true` with `Authorization: Bearer <HAUSKA_ENGINE_API_KEY>`:

| Check | Before | After |
|-------|--------|-------|
| Row count | 30 | **34** |
| `cedar_hill_tx` | 706 atoms | **706** atoms |
| `watauga_tx` | absent | **235** atoms |
| `pasadena_tx` | absent | **463** atoms |
| `sugar_land_tx` | absent | **542** atoms |
| `pharr_tx`, `plano_tx` | absent | **still absent** (PRs open) |

### Curl samples (Bearer `<HAUSKA_ENGINE_API_KEY>`)

**cedar_hill_tx:**

```bash
curl -s -H "Authorization: Bearer <key>" \
  "https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app/jurisdictions?qualityBarOnly=true" \
  | jq '.jurisdictions[] | select(.jurisdictionTenant=="cedar_hill_tx")'
```

```json
{"jurisdictionTenant":"cedar_hill_tx","jurisdictionName":"Cedar Hill, TX","atomCount":706,"qualityBar":"passing","accessPolicy":"platform-internal"}
```

**pasadena_tx (new):**

```json
{"jurisdictionTenant":"pasadena_tx","jurisdictionName":"Pasadena, TX","atomCount":463,"qualityBar":"passing","accessPolicy":"platform-internal"}
```

**watauga_tx (new):**

```json
{"jurisdictionTenant":"watauga_tx","jurisdictionName":"Watauga, TX","atomCount":235,"qualityBar":"passing","accessPolicy":"platform-internal"}
```

### Full prod keys (34)

`austin_tx`, `bastrop_county_tx`, `bastrop_tx`, `boerne_tx`, `brownsville_tx`, `cedar_hill_tx`, `converse_tx`, `copperas_cove_tx`, `crowley_tx`, `dripping_springs_tx`, `el_paso_tx`, `elgin_tx`, `georgetown_tx`, `grand_county_ut`, `hutto_tx`, `keller_tx`, `killeen_tx`, `lago_vista_tx`, `leander_tx`, `live_oak_tx`, `lockhart_tx`, `manor_tx`, `mission_tx`, `new_braunfels_tx`, `pasadena_tx`, `rollingwood_tx`, `round_rock_tx`, `saginaw_tx`, `san_antonio_tx`, `schertz_tx`, `sugar_land_tx`, `taylor_tx`, `watauga_tx`, `wimberley_tx`

---

## 6. MCP server (`hauska-mcp-server`)

### Redeploy

**Not performed.** Env already binds `HAUSKA_BACKEND_URL` → prod retrieval-api; catalog proxies live per request.

### Verification — `list_jurisdictions`

| Caller | `quality_bar_only: true` | Count |
|--------|--------------------------|------:|
| Unauthenticated | yes | **2** (`bastrop_tx`, `grand_county_ut`) — ADR-017 expected |
| Authenticated (`developer_pro` / `public`, admin-minted `raw_key`) | yes | **34** — matches retrieval-api |

Spot-check authenticated: `cedar_hill_tx` @ 706, `pasadena_tx` @ 463, `sugar_land_tx` @ 542, `watauga_tx` @ 235.

**MCP admin mint:** use response field **`raw_key`**, not `key`, in `X-Hauska-Key`.

| Service | URL |
|---------|-----|
| MCP | `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app` |
| Retrieval-api | `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` |

---

## 7. Downstream — ping cc-agent-C

| QA / sprint | Unblocked by |
|-------------|--------------|
| **QA-61** | Live MCP catalog **34** rows (internal); Code Library should show TX metros **>> 5** with `HAUSKA_SUBSTRATE_MODE=mcp` |
| **QA-60** | Cedar Hill plan-review cites live **`cedar_hill_tx`** atoms |
| **QA-58** | Engagement geocode → **`cedar_hill_tx`** @ 706 atoms |

**Suggested cc-agent-C next steps:**

1. Re-run [`_dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md`](_dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md) — expect **34** internal jurisdictions; confirm `cedar_hill_tx` for QA-58.
2. Note **pharr / plano / central-lane suburbs** will appear only after operator merges PRs #52–#63 and a follow-up snapshot deploy.

**cc-agent-E lanes:** Re-dispatch cc-agent-M after operator merges open PRs; add El Paso Titles 19–21 as separate UNITS or combined-tenant policy before next snapshot.

---

## 8. Risks / residuals

| Item | Severity | Owner |
|------|----------|-------|
| 10 lane PRs still open | **Blocks full lane catalog** | operator |
| `snapshot.json` >50 MB GitHub warning | Ops | consider Git LFS |
| El Paso multi-Title on one tenant (`el_paso_tx`) | Design | E-W — Titles 19–21 PRs merge into same key |
| Bastrop UDC Path C drift (0 sections) | Low | cc-agent-E B.5 |

---

## 9. hauska-engine commits (this session)

| Commit | Purpose |
|--------|---------|
| `0a73bbe` | Pasadena + Sugar Land UNITS |
| `24add19` | DEPLOY.md project id |
| `3da7ed7` | Snapshot artifact |

---

cc-agent-M session closed — **partial** lane-batch snapshot + prod deploy complete (34 jurisdictions). Full four-lane catalog pending operator merge of PRs #52, #55–#63.
