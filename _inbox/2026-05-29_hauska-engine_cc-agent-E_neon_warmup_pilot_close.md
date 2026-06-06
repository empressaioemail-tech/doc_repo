---
id: 2026-05-29_hauska-engine_cc-agent-E_neon_warmup_pilot_close
title: Close — cc-agent-E Neon warmup pilot batch (PB-001)
date: 2026-05-29
agent: cc-agent-E
repo: hauska-engine
branch: feat/neon-warmup-pilot-load
kind: close
related: [2026-05-29_cc-agent-E_neon_warmup_pilot_batch, 75c_property_brief_data_backlog PB-001]
---

# Close — cc-agent-E Neon warmup pilot batch (PB-001)

## Delivered (hauska-engine `feat/neon-warmup-pilot-load`)

| Artifact | Path |
|----------|------|
| **Operator runbook** | `services/retrieval-api/docs/ldt-neon-warmup-runbook.md` |
| **Idempotent loader** | `load-neon-warmup-jsonl` CLI → `tools/migrate-legacy-codes/src/load-neon-warmup-jsonl.ts` |
| **JSONL export** | `export-snapshot-jurisdiction-legacy`, `export-neon-warmup-pilot-batch` |
| **Coverage registry** | `export-central-texas-coverage` → `services/retrieval-api/corpus/central_texas_coverage.json` |
| **Pilot JSONL** | `tools/migrate-legacy-codes/tmp/neon-warmup-pilot/*.jsonl` (regenerated this session) |
| **Tests** | `src/__tests__/neon-warmup.test.ts`, `export-central-texas-coverage.test.ts` — 31 passed |

### `source_name` pattern

`{jurisdiction_key}_substrate` (e.g. `round_rock_tx_substrate`), `code_book = SUBSTRATE`, idempotent on `content_hash` (LDT orchestrator hash).

## JSONL row counts (exported vs dispatch)

| `jurisdiction_key` | JSONL rows | Dispatch | Match |
|--------------------|----------:|---------:|:-----:|
| `round_rock_tx` | 276 | 276 | yes |
| `georgetown_tx` | 571 | 571 | yes |
| `new_braunfels_tx` | 170 | 170 | yes |
| `leander_tx` | 156 | 156 | yes |
| `hutto_tx` | 1376 | 1376 | yes |
| `austin_tx` | 1810 | 1810 | yes |

Export rule: `code-section` atoms with non-empty `bodyText` from `services/retrieval-api/corpus/snapshot.json` (`generatedAt` 2026-05-26).

## Operator handoff (Nick — staging first)

```powershell
cd P:\hauska-engine
git checkout feat/neon-warmup-pilot-load

$env:DATABASE_URL = "<staging-cortex-postgres-url>"

# 1. Load (priority order)
pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts load-neon-warmup-jsonl --file tools/migrate-legacy-codes/tmp/neon-warmup-pilot/round_rock_tx.jsonl
# … repeat for georgetown_tx, new_braunfels_tx, leander_tx, hutto_tx, austin_tx

# 2. Embeddings (loop until remaining=0)
curl -sS -X POST "$CORTEX_BASE/api/codes/embeddings/backfill?limit=1000" -H "x-brokerage-api-key: $BROKERAGE_DEV_API_KEY"

# 3. Verify
curl -sS "$CORTEX_BASE/api/brokerage/v1/coverage" -H "x-brokerage-api-key: $BROKERAGE_DEV_API_KEY"
```

Full steps: `services/retrieval-api/docs/ldt-neon-warmup-runbook.md`.

## Not run here (blockers)

| Item | Reason |
|------|--------|
| Staging/prod **load** | No `DATABASE_URL` for cortex-api Postgres in agent environment |
| **Embedding backfill** | Requires deployed cortex-api + `OPENAI_API_KEY` |
| **`GET /coverage` tier `neon`** | Needs LDT deploy; `getPilotCoverageTier` still maps pilot keys to `engine_only` until `JURISDICTIONS` entry or PR #134 atom-count tier. **`atomCount` in coverage API** is only populated for keys already in `JURISDICTIONS` today — brief retrieval still benefits from loaded rows via `countAtomsForJurisdiction`. |
| **75b manifest bump** | Planner sync after operator confirms staging loads |

## Acceptance mapping

| Criterion | Status |
|-----------|--------|
| Load script + runbook | Done |
| Operator pnpm/SQL documented | Done (`ldt-neon-warmup-runbook.md`) |
| Embeddings backfill documented | Done (curl/PowerShell loop) |
| Staging load ≥1 key | **Operator** — `round_rock_tx` first |
| Close row counts | Above table |

## Out of scope (confirmed)

- `dallas|tx` city proper
- New Municode ingest (PB-201)

## 75b / planner

Report atom counts above for manifest sync. After staging load, expect `round_rock_tx` brief smoke on a Round Rock pilot address once embeddings backfill completes.
