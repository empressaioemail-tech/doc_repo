---
id: 2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy
title: Handoff — cc-agent-M snapshot refresh + MCP deploy (post batch #49)
date: 2026-05-26
from: cc-agent-E
to: cc-agent-M
for_review: planning-agent
repo: [hauska-engine, hauska-mcp-server]
sprint: [51_substrate_v1_sprint, 40i_cortex_dallas_e2e_grok_plan_review_sprint]
related: [QA-58, QA-60, QA-61, 43_cortex_qa_backlog, 50_hauska_mcp_server]
status: completed
completed_by: _inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md
completed_at: 2026-05-26
---

# Handoff — cc-agent-M: post–batch-#49 snapshot refresh + MCP deploy

> **Completed 2026-05-26** by cc-agent-M. Close report:
> [`_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md`](_inbox/2026-05-26_hauska-mcp-server_cc-agent-M_post_batch49_snapshot_deploy_close.md)

**From:** cc-agent-E (hauska-engine ingest lane)  
**To:** cc-agent-M (hauska-mcp-server + retrieval-api deploy lane)  
**For:** Planning-agent review → dispatch cc-agent-M  
**Trigger:** PR [#49](https://github.com/empressaioemail-tech/hauska-engine/pull/49) **merged to `main`** 2026-05-25 — batch consolidation of 18 open Sync 5 ingest PRs (#30, #32–#48).

---

## TL;DR

**hauska-engine `main` now wires 31 jurisdiction ingest units** (was ~12 deployed in the last snapshot). The committed `services/retrieval-api/corpus/snapshot.json` artifact is **stale** (~4.3 MB, pre-batch — last prod deploy carried **5 jurisdictions** per [2026-05-21 retrieval-api session](_sessions/2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E.md)).

**cc-agent-M must:**

1. Regenerate `snapshot.json` from live ingests on current `main`
2. Commit snapshot + redeploy **`hauska-retrieval-api`** (Cloud Run)
3. Confirm **`hauska-mcp-server`** `list_jurisdictions` reflects the new catalog (redeploy MCP if it caches URL/revision)

This unblocks **QA-61** (localhost Code Library shows fixture not live catalog), **QA-60** (Cedar Hill municipal code substrate), and Sprint **40i** Dallas E2E prep.

---

## What landed on `hauska-engine` `main`

| Event | PR | Notes |
|-------|-----|-------|
| Copperas Cove | #31 | Already merged before batch |
| **Batch consolidation** | **#49** | 18 cities — supersedes #30, #32–#37, #38–#47, #48 |
| Individual PRs | #30–#48 | **Closed** with pointer to #49 |

### Jurisdiction keys now in `build-corpus-snapshot.ts` UNITS (31 ingest units)

**Pre-existing (Sync 4 / Tier 1–2):**  
`bastrop_tx`, Bastrop B3, `bastrop_county_tx`, `elgin_tx`, `hutto_tx`, `round_rock_tx`, `taylor_tx`, `leander_tx`, `georgetown_tx`, `new_braunfels_tx`, `killeen_tx`, `copperas_cove_tx`

**New in batch #49 (18):**

| Key | City | QA note |
|-----|------|---------|
| `austin_tx` | Austin LDC | Tier 2 |
| `manor_tx` | Manor | Tier 2 |
| `lockhart_tx` | Lockhart | Tier 2 |
| `lago_vista_tx` | Lago Vista | Tier 2 |
| `dripping_springs_tx` | Dripping Springs | Tier 2 |
| `wimberley_tx` | Wimberley | Tier 2 |
| `rollingwood_tx` | Rollingwood | Tier 2 |
| `san_antonio_tx` | San Antonio UDC | TX metro |
| `boerne_tx` | Boerne UDC | TX metro |
| `brownsville_tx` | Brownsville | TX metro |
| `mission_tx` | Mission | TX metro |
| `schertz_tx` | Schertz UDC | TX metro |
| `saginaw_tx` | Saginaw | TX metro |
| `live_oak_tx` | Live Oak | TX metro |
| `keller_tx` | Keller UDC | TX metro |
| `crowley_tx` | Crowley | TX metro |
| `converse_tx` | Converse | TX metro |
| **`cedar_hill_tx`** | **Cedar Hill** | **QA-58 / QA-60 primary** |

**Path B (best-effort):** `grand_county_ut` — skipped if `LEGACY_DATABASE_URL` unset.

> **Key naming:** Confirm exact tenant strings from each `*-curated-queries.ts` export (`*_JURISDICTION` constant). Table above uses inferred slugs; **verify against snapshot output** before wiring Cortex `substrate_jurisdiction_key`.

All Path C jurisdictions tagged **`accessPolicy: platform-internal`** (pilot). MCP visibility for unauthenticated callers still filters to `public-free` only per ADR-017; operator-internal / platform scope sees full catalog.

---

## cc-agent-M runbook

### Prerequisites

| Item | Source |
|------|--------|
| `hauska-engine` clone at **`main` ≥ merge commit `ebfca0f`** (PR #49) | GitHub |
| `RETRIEVAL_API_KEY` | `doc_repo/Secrets.txt` |
| `LEGACY_DATABASE_URL` (optional) | Neon — only needed for Grand County Path B unit |
| GCP access | `legacy-design-tools-prod` / `us-central1` |
| TLS | Windows dev: `NODE_OPTIONS=--use-system-ca` on all `pnpm`/`tsx` calls (AVG MITM) |

### Step 1 — Regenerate corpus snapshot

From **hauska-engine repo root**:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
# Optional — Grand County Path B; omit if Neon unreachable (unit skips gracefully)
$env:LEGACY_DATABASE_URL='<neon-url>'

pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts build-corpus-snapshot `
  --out services/retrieval-api/corpus/snapshot.json
```

**Expectations:**

- **Wall time:** 30–90+ min (31 live Municode/PDF ingests, 0.7 req/s politeness). Large metros (Austin, San Antonio) use `maxLeafFetches: 8000`.
- **Stdout:** Per-jurisdiction `[snapshot] ingesting: …` lines with section counts + eval PASS/FAIL.
- **Degraded OK:** Units returning 0 sections are skipped (logged); build succeeds if ≥1 unit ingests.
- **Commit:** Regenerated `services/retrieval-api/corpus/snapshot.json` → PR to `hauska-engine` `main` (or include in deploy branch).

Reference: [`services/retrieval-api/DEPLOY.md`](https://github.com/empressaioemail-tech/hauska-engine/blob/main/services/retrieval-api/DEPLOY.md)

### Step 2 — Redeploy retrieval-api

```bash
gcloud run deploy hauska-retrieval-api \
  --source . \
  --project=legacy-design-tools-prod \
  --region=us-central1 \
  --allow-unauthenticated \
  --port=8080 \
  --memory=1Gi \
  --cpu=1 \
  --set-env-vars=RETRIEVAL_API_KEY=<key>
```

Prior prod URL (verify still current):  
`https://hauska-retrieval-api-172690833726.us-central1.run.app`  
Update `doc_repo/Secrets.txt` → `RETRIEVAL_API_URL` if URL changes.

### Step 3 — Verify retrieval-api catalog

```bash
curl -s https://<service-url>/health

curl -s -H "Authorization: Bearer <key>" \
  "https://<service-url>/jurisdictions?qualityBarOnly=true" | jq '.jurisdictions | length'

curl -s -H "Authorization: Bearer <key>" \
  "https://<service-url>/jurisdictions?qualityBarOnly=true" | jq '.jurisdictions[] | select(.jurisdictionTenant=="cedar_hill_tx")'
```

**Accept:**

- Jurisdiction count **≫ 5** (target: high twenties to low thirties passing quality bar)
- **`cedar_hill_tx`** row present with **`atomCount > 0`**
- Sample search works:  
  `GET /search?q=20-10+preliminary+plat&limit=3` with Cedar Hill scoped query

### Step 4 — MCP server (`hauska-mcp-server`)

1. Confirm MCP env points at current `RETRIEVAL_API_URL` + `RETRIEVAL_API_KEY` (see `50_hauska_mcp_server.md`).
2. Redeploy MCP if it pins a revision or caches catalog at boot.
3. Call **`list_jurisdictions`** (platform-internal / operator auth scope):

**Accept:**

- Returns **`cedar_hill_tx`** and other batch cities
- Count matches retrieval-api (minus ADR-017 visibility filter for unauthenticated vs internal callers)

### Step 5 — Close the loop (operator / cc-agent-C)

| QA | Unblocked when |
|----|----------------|
| **QA-61** | localhost Code Library shows live MCP catalog, not 5-row fixture |
| **QA-60** | Plan-review E2E can cite Cedar Hill code sections |
| **QA-58** | Engagement geocode → `cedar_hill_tx` substrate (cc-agent-C `CITY_STATE_TO_KEY`) |

Dispatch ref: [`_dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md`](_dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md)

---

## Acceptance checklist (cc-agent-M close doc)

- [ ] `build-corpus-snapshot` run on `main` post-#49; `snapshot.json` committed
- [ ] `hauska-retrieval-api` redeployed with new snapshot baked into image
- [ ] `/jurisdictions?qualityBarOnly=true` returns **>20** rows (document exact count)
- [ ] `cedar_hill_tx` visible with `atomCount > 0`
- [ ] MCP `list_jurisdictions` (internal scope) matches retrieval-api
- [ ] `Secrets.txt` updated if service URL rotated
- [ ] Close note filed; ping cc-agent-C for Cortex warmup / Code Library verification

---

## Risks / operator heads-up

| Risk | Mitigation |
|------|------------|
| Snapshot build exceeds 1h | Run overnight; or slice UNITS temporarily (document skipped) |
| Austin / San Antonio Municode timeout | Units may partial-ingest; check eval FAIL lines in build log |
| Grand County Neon down | Expected skip — do not block deploy |
| Memory on Cloud Run | If snapshot JSON grows >1Gi load, bump `--memory` |
| **Dallas city / Dallas County** | **Not in this batch** — AmLegal partnership track; QA-58 uses **Cedar Hill** |

---

## Related inbox / session refs

- Cedar Hill ingest close: [`_inbox/2026-05-26_hauska-engine_cc-agent-E_dallas_substrate_ingest.md`](_inbox/2026-05-26_hauska-engine_cc-agent-E_dallas_substrate_ingest.md)
- Sync 5 batch session: [`_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md`](_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md)
- Operator localhost runbook: [`_inbox/2026-05-26_operator_localhost_substrate_qa_runbook.md`](_inbox/2026-05-26_operator_localhost_substrate_qa_runbook.md)
- Prior retrieval-api deploy: [`_sessions/2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E.md`](_sessions/2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E.md)

---

## Suggested dispatch title (planning agent)

> **Dispatch cc-agent-M:** Regenerate corpus snapshot + redeploy retrieval-api + verify MCP `list_jurisdictions` post hauska-engine #49 (31 jurisdictions, Cedar Hill QA-60)

🤖 cc-agent-E → cc-agent-M handoff
