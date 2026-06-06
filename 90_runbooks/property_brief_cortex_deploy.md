---
id: property_brief_cortex_deploy
title: Property Brief — cortex-api deploy runbook (operator)
status: active
last_updated: 2026-05-28
applies_to: portfolio
related: [75a_hauska_brief_extension, 90_runbooks/property_brief_cortex_deploy.ps1, 90_runbooks/brokerage_cortex_deploy_checklist, 90_runbooks/cloud_run_canary_deploy.md]
owner: nick
---

# Property Brief — cortex-api deploy runbook

> **Purpose.** Single operator guide for shipping Property Brief backend changes to production. Written after the 2026-05-28 deploy (PRs #132, #133) which surfaced confusion between GitHub Actions push vs dispatch, missing API keys, and Cloud Run traffic pinning.
>
> **Automated path (preferred):** [`property_brief_cortex_deploy.ps1`](property_brief_cortex_deploy.ps1)

## What you are deploying

| Layer | Repo | Service | Prod URL |
|-------|------|---------|----------|
| API | `empressaioemail-tech/legacy-design-tools` | Cloud Run **`cortex-api`** | `https://cortex-api-tds7av26va-uc.a.run.app` |
| Extension | `P:\hauska-brief-extension` | Chrome MV3 (local unpacked) | Points at API via options |

**GCP project:** `legacy-design-tools-prod` (already provisioned — do not create a new project).

**API path (legacy name):** `/api/brokerage/v1/*` — product is Property Brief; path rename deferred.

## Prerequisites (one-time)

| Tool | Check |
|------|--------|
| `gh` | `gh auth login` |
| `gcloud` | `gcloud auth login` then `gcloud config set project legacy-design-tools-prod` |
| `curl.exe` | Built into Windows |

## The API key (you create it)

There is **no** pre-issued `BROKERAGE_DEV_API_KEY`. You invent a shared secret:

```powershell
-join ((48..57 + 65..90 + 97..122 | Get-Random -Count 48 | ForEach-Object { [char]$_ }))
```

Use the **same value** in:

- Cloud Run env `BROKERAGE_DEV_API_KEY`
- Extension option `hauskaKey`

## How GitHub Actions actually works (common confusion)

| Event | What runs |
|-------|-----------|
| **Push to `main`** (merge PR) | **Only** `Build & push image` — builds Docker image, tags SHA + `latest` |
| **Run workflow** (manual) | One of: `deploy-canary`, `run-migrations`, `shift-traffic`, `rollback` |

Gray/skipped jobs on a **push** run are **normal**. You must trigger deploy steps separately (script or GitHub **Run workflow** button).

Workflow name: **`Cloud Run Deploy (cortex-api)`**

## Migrations (Property Brief)

Apply on prod DB when shipping workspace/wallet/lay-summary:

| File | From |
|------|------|
| `0026_brokerage_brief_runs.sql` | Brief API (#128) |
| `0028_gtm_observation_layer.sql` | GTM consent/events |
| `0029_brokerage_workspace_wallet.sql` | Workspace + wallet (#132) |
| `0030_place_layer_snapshots.sql` | Permanent Regrid/FEMA archive + workspace geo columns |

Applied via GitHub Actions `action=run-migrations` (not on push).

## Neon warmup — `engine_only` jurisdiction keys

Brief code retrieval reads `code_atoms` in **this** cortex-api Postgres database. Keys listed as `engine_only` in [`75b_brief_coverage_v0.md`](../75b_brief_coverage_v0.md) and `GET /api/brokerage/v1/coverage` have substrate corpus in hauska-engine but **no** rows in LDT Neon until warmed.

**Pilot JSONL batch (2026-05-29, ready to load):**

| `jurisdiction_key` | Rows | Path under `hauska-engine` |
|--------------------|-----:|----------------------------|
| `round_rock_tx` | 276 | `tools/migrate-legacy-codes/tmp/neon-warmup-pilot/round_rock_tx.jsonl` |
| `georgetown_tx` | 571 | `.../georgetown_tx.jsonl` |
| `new_braunfels_tx` | 170 | `.../new_braunfels_tx.jsonl` |
| `leander_tx` | 156 | `.../leander_tx.jsonl` |
| `hutto_tx` | 1376 | `.../hutto_tx.jsonl` |
| `austin_tx` | 1810 | `.../austin_tx.jsonl` |

Dispatch: [`_dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch.md`](../_dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch.md).

**Automate:** [`property_brief_neon_warmup.ps1`](property_brief_neon_warmup.ps1) + [`ldt-neon-warmup-runbook.md`](ldt-neon-warmup-runbook.md) (operator; requires cc-agent-E CLI commands).

**Operator batch:**

1. Load JSONL into cortex-api Postgres `code_atoms` (staging first) per engine runbook § Path A.
2. Embeddings backfill per jurisdiction.
3. Verify: `GET /api/brokerage/v1/coverage` shows `tier: neon` and non-null `atomCount` for the key.
4. Smoke: `POST /api/brokerage/v1/brief` on a pilot address in that city returns `corpusStatus: in_corpus` and non-empty `citations` when retrieval hits.

**Optional env:** `BRIEF_CODE_RETRIEVAL=neon` (default) or `mcp` (falls back to neon until MCP retrieve is wired in `@workspace/codes`).

**Do not** warm `dallas|tx` city proper — blocked per partnership rule (`75b` blocked table). Plano is not in the engine snapshot; use listed `*_tx` keys until ingest lands.

## Data wave + Neon warmup (one operator path)

After cc-agent-C branches land, use [`property_brief_data_wave.ps1`](property_brief_data_wave.ps1) to merge federal + retrieval + encumbrance, deploy, and load pilot JSONL:

```powershell
cd P:\doc_repo\90_runbooks
.\property_brief_data_wave.ps1 -MergeBranches -CreatePr
# review PR, then:
.\property_brief_data_wave.ps1 -MergePr -Deploy -UseGcloudKey -Warmup
```

Neon load alone (no deploy): [`property_brief_neon_warmup.ps1 -Auto`](property_brief_neon_warmup.ps1) reads `BROKERAGE_DEV_API_KEY` + `DEPLOYMENT_DATABASE_URL` from GCP.

## Automated deploy (recommended)

### Full deploy from merge SHA

```powershell
cd P:\doc_repo\90_runbooks

.\property_brief_cortex_deploy.ps1 `
  -ImageTag aa415548d36cc5912f29ce21bb72b72e1148992e `
  -UseGcloudKey
```

Script sequence:

1. `deploy-canary` (image at 0% default traffic, `canary` tag)
2. `run-migrations`
3. `shift-traffic` (workflow moves traffic to canary-tagged revision)
4. `gcloud` env update (Grok + `BROKERAGE_DEV_API_KEY` + wallet defaults + `XAI_API_KEY` secret)
5. `gcloud run services update-traffic --to-latest` (critical — see pitfalls)
6. Smoke `healthz` + `POST /api/brokerage/v1/brief` with `laySummary`

### Resume after GH steps already green

```powershell
.\property_brief_cortex_deploy.ps1 `
  -ImageTag <sha> `
  -BrokerageKey "YOUR-KEY" `
  -SkipGh
```

### Dry run

```powershell
.\property_brief_cortex_deploy.ps1 -ImageTag <sha> -BrokerageKey "x" -DryRun
```

### Script flags

| Flag | Effect |
|------|--------|
| `-SkipGh` | Skip steps 1–3; only env + traffic + smoke |
| `-SkipMigrations` | Skip migration workflow |
| `-SkipShiftTraffic` | Skip shift-traffic workflow |
| `-DryRun` | Print actions only |

## Manual deploy (GitHub UI)

Repo → **Actions** → **Cloud Run Deploy (cortex-api)** → **Run workflow**:

1. `deploy-canary` + `image_tag` = full merge SHA
2. `run-migrations` + `bootstrap` = false
3. `shift-traffic`
4. Run [`property_brief_cortex_deploy.ps1`](property_brief_cortex_deploy.ps1) with `-SkipGh` for env + smoke

## Required Cloud Run env (Property Brief)

| Variable | Prod value |
|----------|------------|
| `BRIEFING_LLM_MODE` | `grok` |
| `BROKERAGE_DEV_API_KEY` | your generated key |
| `XAI_API_KEY` | Secret Manager `XAI_API_KEY:latest` |
| `BROKERAGE_WALLET_START_BALANCE_CENTS` | `1000` (pilot; avoid instant 402) |
| `BROKERAGE_WALLET_BYPASS` | `false` |
| `BROKERAGE_TOP_UP_INCREMENT_CENTS` | `500` |
| `BROKERAGE_COMPUTE_COST_CENTS` | `100` |

`deploy-canary` ships with `BRIEFING_LLM_MODE=mock` and **no** brokerage key — env patch step is mandatory.

## Post-deploy smoke (manual)

```powershell
$PROD = "https://cortex-api-tds7av26va-uc.a.run.app"
$KEY = "YOUR-KEY"

curl.exe -sS -o NUL -w "healthz: %{http_code}`n" "$PROD/api/healthz"

$bodyFile = "$env:TEMP\brief-smoke.json"
'{"address":"251 Cool Water Dr, Bastrop, TX 78602","source":"smoke","presentationMode":"consumer"}' | Set-Content $bodyFile -NoNewline

curl.exe -sS -X POST "$PROD/api/brokerage/v1/brief" `
  -H "Authorization: Bearer $KEY" `
  -H "Content-Type: application/json" `
  -H "X-Hauska-Install-Id: smoke-01" `
  --data-binary "@$bodyFile"
```

**Pass:** HTTP 200 JSON with `runId` and `laySummary.verdicts`.  
**Fail:** `401` (wrong key), `503` / `property_brief_api_unconfigured` (key not on serving revision).

### Parcel layers (step 4b)

FEMA + Regrid ship in PR #131 on `main`. Flood verdict in `laySummary` only populates when `siteContext.layers` includes an ok FEMA layer.

| Check | Pass |
|-------|------|
| `siteContext.layers` | Array present; at least one `status: "ok"` with `layerKind` containing `fema` or `regrid` |
| `laySummary.verdicts` | Entry `id: "flood"` not `unknown` when FEMA layer ok |
| Regrid empty | Mount `REGRID_API_KEY` on `cortex-api` (Secret Manager); redeploy serving revision |

Dispatch: [`_dispatches/2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers.md`](../_dispatches/2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers.md).

## Extension configuration (after API smoke passes)

Chrome → Hauska Property Brief → **Options**:

| Setting | Value |
|---------|--------|
| `briefApiUrl` | `https://cortex-api-tds7av26va-uc.a.run.app` (no path) |
| `hauskaKey` | same as `BROKERAGE_DEV_API_KEY` |
| `defaultJurisdiction` | `bastrop_tx` (pilot) |

Reload unpacked extension → open Zillow **homedetails** → Run brief → Deep research.

Extension **v0.5.0** (Carfax UI + starter chips) is a separate build in `P:\hauska-brief-extension` — backend can be live before UI ships.

## Pitfalls (learned 2026-05-28)

### 1. Push does not deploy

Merging to `main` only builds the image. You must run `deploy-canary` (and migrations, shift) yourself.

### 2. Canary tag vs LATEST revision

`shift-traffic` routes to the revision tagged **`canary`**, which was built with **mock** LLM and no brokerage keys.

The script's **env update + `--to-latest`** creates a new revision with Grok + keys and moves **100% LATEST** traffic to it. Skipping `--to-latest` after env update leaves prod on a revision without keys.

Verify serving revision:

```powershell
gcloud run services describe cortex-api --region=us-central1 --project=legacy-design-tools-prod --format="yaml(status.traffic)"
```

### 3. Two prod URLs in gcloud output

Cloud Run may print both a numeric URL and the `tds7av26va` hostname. Extension and smoke should use the URL from:

```powershell
gcloud run services describe cortex-api --region=us-central1 --format="value(status.url)"
```

Current canonical: `https://cortex-api-tds7av26va-uc.a.run.app`

### 4. PowerShell is not the agent prompt

Paste **only** PowerShell commands into the terminal. Bullet lists like `Requirements:` are for agent chat, not the shell.

### 5. Windows curl JSON

Use `--data-binary "@file.json"` for POST bodies, not inline `-d '{...}'` (quoting breaks).

### 6. gcloud stderr warnings

`InsecureRequestWarning` on Windows must not abort the script — handled in `Invoke-Gcloud` wrapper in the PS1 script.

## Operator checklist (copy per deploy)

- [ ] Merge PR on `legacy-design-tools`; note merge **SHA**
- [ ] Wait for **Build & push image** green on push workflow
- [ ] Generate or reuse `BROKERAGE_DEV_API_KEY`
- [ ] Run `property_brief_cortex_deploy.ps1` with `-ImageTag` + `-BrokerageKey`
- [ ] Confirm smoke: `runId` + `laySummary`
- [ ] Configure extension `briefApiUrl` + `hauskaKey`
- [ ] Zillow E2E: brief → deep research → recent workspaces (after extension v0.5.0)

## Optional follow-ons (not blocking extension)

| Item | When |
|------|------|
| npm `@hauska/atom-contract@1.3.0` | Before merging hauska-engine #65 |
| Merge hauska-mcp-server #23 | MCP workspace tools |
| Parcel layers on brief API | Separate cc-agent-C dispatch |
| Rename `/api/brokerage/v1` → neutral path | Post-launch cleanup |

## Related docs

- Script: [`property_brief_cortex_deploy.ps1`](property_brief_cortex_deploy.ps1)
- Short checklist: [`brokerage_cortex_deploy_checklist.md`](brokerage_cortex_deploy_checklist.md)
- Generic canary: [`cloud_run_canary_deploy.md`](cloud_run_canary_deploy.md)
- Full GHA reference: `P:\legacy-design-tools\docs\deploy.md`
- Product contracts: [`75a_hauska_brief_extension.md`](../75a_hauska_brief_extension.md)

## Revision history

| Date | Change |
|------|--------|
| 2026-05-28 | Initial runbook after #132/#133 deploy; documents PS1 automation, pitfalls, API key, GH push vs dispatch |
