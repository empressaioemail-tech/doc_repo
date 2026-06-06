---
id: ldt_neon_warmup_runbook
title: Property Brief — Neon warmup (code_atoms load + verify)
status: active
last_updated: 2026-05-29
applies_to: portfolio
related: [75c_property_brief_data_backlog, 75b_brief_coverage_v0, 90_runbooks/property_brief_neon_warmup.ps1, _dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch]
owner: nick
---

# Property Brief — Neon warmup runbook

> **Automated path:** [`property_brief_neon_warmup.ps1`](property_brief_neon_warmup.ps1) + [`property_brief_neon_warmup.config.json`](property_brief_neon_warmup.config.json)

## What this does

Loads pre-exported substrate **`code_atoms`** JSONL into the **same Postgres** `cortex-api` uses, backfills **embeddings**, then verifies:

- `GET /api/brokerage/v1/coverage` → `tier: neon`, `atomCount > 0`
- `POST /api/brokerage/v1/brief` → `corpusStatus: in_corpus` + non-empty `citations`

## Prerequisites

| Item | How |
|------|-----|
| **PR #134** merged + deployed | Place graph + coverage API live |
| **`DATABASE_URL`** | Cortex-api prod Postgres (Cloud SQL). Use [Auth Proxy](https://cloud.google.com/sql/docs/postgres/connect-auth-proxy) or operator secret — never commit. |
| **`BROKERAGE_KEY`** | **Exact** same string as extension `hauskaKey` = Cloud Run `BROKERAGE_DEV_API_KEY`. Not a doc placeholder. |
| **`OPENAI_API_KEY`** | For embedding backfill (`text-embedding-3-small`, 1536-dim) |
| **JSONL batch** | `hauska-engine/tools/migrate-legacy-codes/tmp/neon-warmup-pilot/*.jsonl` |
| **Engine CLI** | `load-neon-warmup-jsonl` on branch `feat/neon-warmup-pilot-load` |

## Get the API key (401 = wrong key)

There is no pre-issued key. Use the **same 48-char secret** everywhere:

1. Chrome extension options → `hauskaKey`, or
2. Cloud Run (serving revision):

```powershell
gcloud run services describe cortex-api `
  --region=us-central1 `
  --project=legacy-design-tools-prod `
  --format="yaml(spec.template.spec.containers[0].env)" | Select-String BROKERAGE
```

Do **not** paste doc placeholders (`your-pilot-key`, `YOUR-ACTUAL-48-CHAR-KEY-FROM-DEPLOY`).

Quick smoke (auto-read key from Cloud Run; no manual paste):

```powershell
cd P:\doc_repo\90_runbooks
.\property_brief_neon_warmup.ps1 -VerifyOnly -UseGcloudKey
```

Or set the key yourself (raw string only, **no** angle brackets):

```powershell
$env:BROKERAGE_KEY = 'paste-48-char-key-from-extension-options-here'
Invoke-RestMethod -Uri "https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/coverage" `
  -Headers @{ Authorization = "Bearer $env:BROKERAGE_KEY" }
```

## One-command automation (Windows)

**Verify only** (auth + coverage + brief smoke; no DB load):

```powershell
cd P:\doc_repo\90_runbooks
.\property_brief_neon_warmup.ps1 -VerifyOnly -UseGcloudKey
```

**Full load Round Rock** (reads API key + `DEPLOYMENT_DATABASE_URL` from GCP; fails if brief not `in_corpus`):

```powershell
cd P:\doc_repo\90_runbooks
.\property_brief_neon_warmup.ps1 -Auto -Jurisdiction round_rock_tx
```

**All six pilot keys:**

```powershell
.\property_brief_neon_warmup.ps1 -Auto
```

**Merge cc-agent-C branches + deploy + warmup** (see [`property_brief_data_wave.ps1`](property_brief_data_wave.ps1)):

```powershell
# 1. Build integration PR (federal + retrieval + encumbrance)
.\property_brief_data_wave.ps1 -MergeBranches -CreatePr

# 2. After review + CI green — merge, deploy, load Round Rock
.\property_brief_data_wave.ps1 -MergePr -Deploy -UseGcloudKey -Warmup
```

Manual env (only if not using `-Auto` / `-UseGcloud*`):

```powershell
$env:DATABASE_URL = "postgresql://USER:PASS@127.0.0.1:5432/cortex"   # via Cloud SQL proxy
$env:BROKERAGE_KEY = "<copy extension hauskaKey exactly>"
$env:OPENAI_API_KEY = "sk-..."

cd P:\doc_repo\90_runbooks
.\property_brief_neon_warmup.ps1
```

**Single city:**

```powershell
.\property_brief_neon_warmup.ps1 -Jurisdiction round_rock_tx
```

**Verify only** (after manual load):

```powershell
.\property_brief_neon_warmup.ps1 -VerifyOnly
```

**Dry run:**

```powershell
.\property_brief_neon_warmup.ps1 -DryRun
```

Writes summary to `_inbox/YYYY-MM-DD_operator_neon_warmup_report.md`.

## Cloud Shell (verify-only)

After load/embed from Windows or cc-agent-E:

```bash
export BROKERAGE_KEY="your-key"
export PROD="https://cortex-api-tds7av26va-uc.a.run.app"

curl -sS "$PROD/api/brokerage/v1/coverage" -H "Authorization: Bearer $BROKERAGE_KEY" | head -c 600

**Windows manual curl:** add `--ssl-no-revoke` if you see `CRYPT_E_NO_REVOCATION_CHECK`. Prefer `property_brief_neon_warmup.ps1 -VerifyOnly` (uses `Invoke-RestMethod`).

curl -sS -X POST "$PROD/api/brokerage/v1/brief" \
  -H "Authorization: Bearer $BROKERAGE_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Hauska-Install-Id: warmup-rr-01" \
  -d '{"address":"1400 Destin Dr, Round Rock, TX 78664","source":"warmup","presentationMode":"consumer"}' \
  | grep -E 'corpusStatus|citations|runId'
```

## Priority order (pilot)

| # | `jurisdiction_key` | JSONL rows | Smoke address |
|---|------------------|----------:|----------------|
| 1 | `round_rock_tx` | 276 | 1400 Destin Dr, Round Rock, TX 78664 |
| 2 | `austin_tx` | 1810 | 101 Colorado St, Austin, TX 78701 |
| 3 | `hutto_tx` | 1376 | 100 Ed Schmidt Blvd, Hutto, TX 78634 |
| 4 | `georgetown_tx` | 571 | 809 S Austin Ave, Georgetown, TX 78626 |
| 5 | `new_braunfels_tx` | 170 | 295 W San Antonio St, New Braunfels, TX 78130 |
| 6 | `leander_tx` | 156 | 1091 S Bagdad Rd, Leander, TX 78641 |

**Do not load:** `dallas|tx` city proper (partnership blocked).

## Engine CLI contract (cc-agent-E)

Implement in `hauska-engine/tools/migrate-legacy-codes`:

### `load-neon-warmup-pilot`

```bash
pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts load-neon-warmup-pilot \
  --jurisdiction round_rock_tx \
  --file P:/hauska-engine/tools/migrate-legacy-codes/tmp/neon-warmup-pilot/round_rock_tx.jsonl \
  --database-url "$DATABASE_URL"
```

**Behavior:**

- Idempotent upsert into `code_atoms` (+ `code_atom_sources` if row references new source)
- `source_name` pattern: `{jurisdiction_key}_substrate` or match JSONL
- Preserve `content_hash` unique index — skip duplicates
- Log: inserted / skipped counts

### `embed-neon-warmup-pilot`

```bash
pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts embed-neon-warmup-pilot \
  --jurisdiction round_rock_tx \
  --database-url "$DATABASE_URL"
```

**Behavior:**

- Select `code_atoms` where `jurisdiction_key = ?` and `embedding IS NULL`
- Call OpenAI `text-embedding-3-small` (same as `@workspace/codes` / `lib/codes/src/embeddings.ts`)
- Batch size ≤ 32; respect rate limits
- Set `embedded_at`, `embedding_model`

**Alternative:** implement both commands in `legacy-design-tools/scripts` if engine repo is inconvenient — point PS1 `engineRepo` at LDT and add subcommands there.

## Manual fallback (if CLI not ready)

1. Inspect JSONL line shape: `head -1 round_rock_tx.jsonl`
2. Map columns to [`code_atoms`](../../legacy-design-tools/lib/db/src/schema/codeAtoms.ts) (legacy-design-tools)
3. Use `psql $DATABASE_URL` + `\copy` or a one-off `tsx` loader
4. Embed via LDT: run queue drain is **wrong** for substrate (re-fetches Municode); use explicit embed backfill only

## After warmup

1. Bump [`75b_brief_coverage_v0.md`](../75b_brief_coverage_v0.md) row `engine_only` → `neon`
2. Extension smoke on Round Rock / Austin listing URLs
3. Optional: second city brief on same coords → 0 new code HTTP (snapshots separate concern)

## Related

- Deploy: [`property_brief_cortex_deploy.md`](property_brief_cortex_deploy.md)
- Dispatch: [`_dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch.md`](../_dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch.md)
- Backlog: [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md) PB-001
