---
date: 2026-05-29
agent: planner
repo: doc_repo
topic: property_brief_data_backlog_execute
---

# Execute — Property Brief data backlog (2026-05-29)

## Filed

| Artifact | Path |
|----------|------|
| Scored backlog | [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md) |
| Partner outreach runbook | [`90_runbooks/partner_outreach_brief_wave.md`](../90_runbooks/partner_outreach_brief_wave.md) |
| Decision | [`_decisions/2026-05-29_property_brief_data_backlog_priorities.md`](../_decisions/2026-05-29_property_brief_data_backlog_priorities.md) |
| Dispatch — federal layers | [`_dispatches/2026-05-29_cc-agent-C_brief_federal_site_context_layers.md`](../_dispatches/2026-05-29_cc-agent-C_brief_federal_site_context_layers.md) |
| Dispatch — Neon warmup | [`_dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch.md`](../_dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch.md) |
| Dispatch — encumbrance R4 | [`_dispatches/2026-05-29_cc-agent-C_brief_encumbrance_upload_path.md`](../_dispatches/2026-05-29_cc-agent-C_brief_encumbrance_upload_path.md) |

## Executed today (engine)

```text
pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts export-central-texas-coverage
→ 34 keys, keysMatchBaseline: true

Pilot JSONL exports (tools/migrate-legacy-codes/tmp/neon-warmup-pilot/):
  round_rock_tx.jsonl   276 rows
  georgetown_tx.jsonl   571 rows
  new_braunfels_tx.jsonl 170 rows
  austin_tx.jsonl      1810 rows
  hutto_tx.jsonl       1376 rows
  leander_tx.jsonl      156 rows
```

**Not done (operator):** Load JSONL into cortex-api Postgres; merge PR #134; mount `REGRID_API_KEY`; partner calls.

## Fire cc-agents (operator)

1. **cc-agent-C** — federal layers dispatch (can run parallel to PR #134 review).
2. **cc-agent-E** — Neon load script + staging load for `round_rock_tx` first.
3. **cc-agent-C** — encumbrance upload after #134 merge (or separate PR).

## Tomorrow (Nick)

Use [`90_runbooks/partner_outreach_brief_wave.md`](../90_runbooks/partner_outreach_brief_wave.md): General Code → ICC → county clerk → Bastrop → HOA pilot.
