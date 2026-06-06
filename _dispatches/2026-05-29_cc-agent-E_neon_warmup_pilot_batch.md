---
id: 2026-05-29_cc-agent-E_neon_warmup_pilot_batch
title: Dispatch — Neon warmup pilot batch (Central TX demo cities)
date: 2026-05-29
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [75c_property_brief_data_backlog, 75b_brief_coverage_v0, 2026-05-28_dispatch-C_engine_central-tx-corpus-icc, 90_runbooks/property_brief_cortex_deploy]
---

# Neon warmup — Central TX pilot batch

You are **cc-agent-E** on `hauska-engine` (+ LDT load coordination).

**Backlog:** [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md) **PB-001**.

## Model (HR-12)

Default: **Grok Build 0.1**.

## Atoms to resolve

- `current-state:portfolio`
- `substrate:central-texas-corpus`

## Already done (planner, 2026-05-29)

JSONL exports at:

```
P:\hauska-engine\tools\migrate-legacy-codes\tmp\neon-warmup-pilot\
  round_rock_tx.jsonl      (276 rows)
  georgetown_tx.jsonl       (571 rows)
  new_braunfels_tx.jsonl    (170 rows)
  austin_tx.jsonl          (1810 rows)
  hutto_tx.jsonl           (1376 rows)
  leander_tx.jsonl         (156 rows)
```

Regenerated `services/retrieval-api/corpus/central_texas_coverage.json` (34 keys, `keysMatchBaseline: true`).

## Your tasks

1. **CLI `load-neon-warmup-pilot`** — idempotent `code_atoms` insert from JSONL (`--jurisdiction`, `--file`, `--database-url`). Contract: [`90_runbooks/ldt-neon-warmup-runbook.md`](../90_runbooks/ldt-neon-warmup-runbook.md).
2. **CLI `embed-neon-warmup-pilot`** — backfill `embedding` for rows where null (OpenAI `text-embedding-3-small`, match LDT `lib/codes/src/embeddings.ts`).
3. **Operator automation** — Nick runs [`90_runbooks/property_brief_neon_warmup.ps1`](../90_runbooks/property_brief_neon_warmup.ps1) after your CLIs land (calls both commands + verifies coverage + brief).
4. **Verify:** after load, `GET /api/brokerage/v1/coverage` should show `tier: neon` and `atomCount > 0` for each warmed key (requires LDT deploy).
5. **75b sync:** planner will bump manifest when you report counts in close note.

## Priority order

1. `round_rock_tx` (Valerie demo suburb)  
2. `georgetown_tx`  
3. `new_braunfels_tx`  
4. `leander_tx`  
5. `hutto_tx`  
6. `austin_tx` (largest; last)

## Out of scope

- `dallas|tx` city proper
- New Municode ingest (PB-201 is separate)

## Acceptance

- [ ] Load script or runbook step tested on staging for ≥1 key.
- [ ] Close note lists row counts loaded vs JSONL row counts.
- [ ] Blockers verbatim (DB creds, embedding API, etc.).

## Report back

`P:/doc_repo/_inbox/2026-05-29_hauska-engine_cc-agent-E_neon_warmup_pilot_close.md`
