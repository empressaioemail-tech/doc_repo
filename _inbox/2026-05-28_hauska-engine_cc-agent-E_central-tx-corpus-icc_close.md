---
id: 2026-05-28_hauska-engine_cc-agent-E_central-tx-corpus-icc_close
title: Close — cc-agent-E Central TX corpus + ICC (Dispatch C)
date: 2026-05-29
agent: cc-agent-E
repo: hauska-engine
kind: close
related: [2026-05-28_dispatch-C_engine_central-tx-corpus-icc, 75b_brief_coverage_v0]
---

# Close — cc-agent-E Central TX corpus + ICC (Dispatch C)

## C1 — Corpus registry export ✅

| Deliverable | Path |
|-------------|------|
| **Coverage registry artifact** | `hauska-engine/services/retrieval-api/corpus/central_texas_coverage.json` |
| **Source of truth** | `hauska-engine/services/retrieval-api/corpus/snapshot.json` (`generatedAt`: 2026-05-26T17:26:12.400Z) |
| **Regenerate CLI** | `pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts export-central-texas-coverage` |
| **Legacy JSONL export (per key)** | `export-snapshot-jurisdiction-legacy --jurisdiction <key>` |
| **Operator warmup runbook** | `hauska-engine/services/retrieval-api/docs/ldt-neon-warmup-runbook.md` |
| **75b manifest** | `doc_repo/75b_brief_coverage_v0.md` — atom counts + `last_updated` 2026-05-29 |

### Snapshot key diff (vs 2026-05-26 baseline)

- **Count:** 34 keys (unchanged)
- **Added:** none
- **Removed:** none
- **`keysMatchBaseline`:** true in `central_texas_coverage.json`

Baseline list matches dispatch and LDT `ENGINE_CORPUS_JURISDICTION_KEYS` in `legacy-design-tools/lib/codes/src/centralTexasPilot.ts`.

### Atom count spot-check (engine snapshot → 75b)

All 34 jurisdictions aligned; no deltas flagged. Examples:

| `jurisdiction_key` | Atoms | Eval (top3 / sec / xref) |
|--------------------|------:|--------------------------|
| `round_rock_tx` | 355 | 1.0 / 1.0 / 1.0 |
| `austin_tx` | 2211 | 1.0 / 1.0 / 1.0 |
| `cedar_hill_tx` | 706 | 0.913 / 1.0 / 1.0 |
| `hutto_tx` | 1741 | 1.0 / 1.0 / 1.0 |

**Note:** Plano is not in the engine snapshot; pilot “Plano-class” suburbs use listed keys (e.g. `round_rock_tx`, `cedar_hill_tx`) until Plano ingest lands.

## C2 — Brief law retrieval via substrate MCP ✅ (contract documented)

| Doc | Path |
|-----|------|
| MCP / retrieval-api handoff | `hauska-engine/services/retrieval-api/docs/brief-code-retrieval-mcp.md` |

- retrieval-api `GET /search?jurisdiction=<jurisdiction_key>` — tenant slug = underscore form (`round_rock_tx`).
- MCP `search_atoms` proxies same contract; LDT `BRIEF_CODE_RETRIEVAL=mcp` wiring remains **cc-agent-C** (currently falls back to Neon in `retrieval.ts`).

## C3 — ICC L1 ingest ✅ (scaffold + handoff; creds blocked)

| Doc | Path |
|-----|------|
| ICC ingest + effective-code handoff | `hauska-engine/services/retrieval-api/docs/icc-l1-ingest-handoff.md` |
| Adapter (live-ready, unconfigured) | `packages/corpus/src/adapters/icc-code-connect/` |
| Layer 1 tenant | `icc-model-code` (`ICC_MODEL_CODE_TENANT`) |

## Blockers (verbatim)

1. **Dispatch `blocked_on`:** ICC API credentials for wave 2.6  
2. **ICC client:** Operator bringing OpenAPI/Swagger + OAuth2 token-endpoint details from ICC meeting; reconcile `code-connect-client.ts` when landed.  
3. **LDT MCP path:** `BRIEF_CODE_RETRIEVAL=mcp not wired in @workspace/codes — falling back to neon` until cc-agent-C wires MCP client.

## Out of scope (confirmed)

- Dallas city UDC (`dallas|tx` blocked — AmLegal)
- Paywall / Stripe

## Acceptance mapping

| Criterion | Status |
|-----------|--------|
| Operator can warm Round Rock / Austin-class keys into LDT Neon | Runbook + `export-snapshot-jurisdiction-legacy` JSONL path |
| 75b atom counts match engine snapshot | Synced 2026-05-29 |
| ICC path documented without creds | `icc-l1-ingest-handoff.md` |

## Code touched (hauska-engine)

- `tools/migrate-legacy-codes/src/central-texas-geocode.ts`
- `tools/migrate-legacy-codes/src/export-central-texas-coverage.ts`
- `tools/migrate-legacy-codes/src/export-snapshot-jurisdiction-legacy.ts`
- `tools/migrate-legacy-codes/src/repo-root.ts`
- `tools/migrate-legacy-codes/src/index.ts` (CLI commands)
- `tools/migrate-legacy-codes/src/__tests__/export-central-texas-coverage.test.ts`
- `services/retrieval-api/corpus/central_texas_coverage.json` (generated)
- `services/retrieval-api/docs/*.md`
- `services/retrieval-api/DEPLOY.md` (export pointer)

**Tests:** `pnpm --filter @hauska-engine/migrate-legacy-codes test` — 30 passed.
