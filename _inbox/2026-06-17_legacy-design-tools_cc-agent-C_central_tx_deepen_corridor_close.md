---
id: 2026-06-17_legacy-design-tools_cc-agent-C_central_tx_deepen_corridor_close
agent: cc-agent-C
repo: legacy-design-tools
date: 2026-06-18
status: batch-complete
---

# Central TX corridor deepen close

## Batch config

| Setting | Value |
|---|---|
| Script | `scripts/deepen-central-tx-batch.ps1 -AllowBatch` |
| Budget cap | **$200/city** |
| Jurisdiction timeout | **90m** (`Start-Job` + kill on hang) |
| Error policy | `Continue` — failed city logs warning, batch continues |
| HTTP timeout | `CODEWARM_HTTP_TIMEOUT_MS=180000` via `batchRunner.ts` |
| Progress | `scripts/_deepen-central-tx-batch-progress.jsonl` |
| Report | `scripts/_deepen-central-tx-batch-report.json` |

## Corridor queue (completed 2026-06-17)

Started at `san_antonio_tx` (Austin done in prior run). All cities exit 0, none hung.

| Jurisdiction | Before verified | After verified | Est. cost USD | Under $200 cap | Log |
|---|---:|---:|---:|---|---|
| san_antonio_tx | 0 | 0 | 1.06 | yes | `_deepen-san_antonio_tx-20260617-185941.log` |
| round_rock_tx | 0 | 0 | 2.17 | yes | `_deepen-round_rock_tx-20260617-190750.log` |
| georgetown_tx | 0 | 0 | 2.17 | yes | `_deepen-georgetown_tx-20260617-191949.log` |
| hutto_tx | 0 | 0 | 1.92 | yes | `_deepen-hutto_tx-20260617-193205.log` |
| leander_tx | 0 | 0 | 2.17 | yes | `_deepen-leander_tx-20260617-194407.log` |
| new_braunfels_tx | 0 | 0 | 2.17 | yes | `_deepen-new_braunfels_tx-20260617-195607.log` |
| dripping_springs_tx | 0 | 0 | 2.18 | yes | `_deepen-dripping_springs_tx-20260617-200830.log` |
| killeen_tx | 0 | 0 | 3.14 | yes | `_deepen-killeen_tx-20260617-202033.log` |
| schertz_tx | 0 | 0 | 3.14 | yes | `_deepen-schertz_tx-20260617-203610.log` |
| boerne_tx | 0 | 0 | 3.14 | yes | `_deepen-boerne_tx-20260617-205149.log` |

**Corridor total estimated cost:** ~**$23.26** (all under per-city $200 cap).

## Interpretation

Verified rates stayed **0** across the corridor on this pass: deepen ran safe-incremental fetches (ICC/IECC manifests) but **verify-before-promote** skipped unverified atoms — no new verified rows promoted. Primary value: jurisdiction-scoped atom id prefixing (`24158735`) so future corridor passes can persist rows without Austin edition-id collisions.

## Commits

- `3dbba6a3` — hardened batch orchestration (90m timeout, progress JSONL, continue-on-error)
- `24158735` — jurisdiction-scoped reasoning atom ids for non-Austin cities

## Re-run

```powershell
.\scripts\deepen-central-tx-batch.ps1 -AllowBatch -StartAt <jurisdiction_key> -BudgetCap 200
```
