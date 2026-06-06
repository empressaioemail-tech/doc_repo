---
id: 2026-05-26_cc-agent-E-C_sync5_lane_central
title: Dispatch — cc-agent-E-C Sync 5 lane Central (finish corridor + adapter)
date: 2026-05-26
agent: cc-agent-E-C
repo: hauska-engine
kind: dispatch
status: ready
related: [2026-05-26_sync5_texas_four_lane_orchestration, _decisions/2026-05-22_sync5_texas_ingest_undeferred, 49_code_ingestion_pipeline, 80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_017_atom_access_control, _sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E]
---

# Sync 5 lane Central — cc-agent-E-C

You are **cc-agent-E-C**, central-Texas lane for statewide Sync 5 on `hauska-engine`. Long-running continuous ingest until the queue below is exhausted or blocked.

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only on failure after retry; log escalation in inbox report.

## Atoms to resolve

- `current-state:portfolio` — Sync 5 status, open PR backlog
- `sprint:51` — Stream 1D ingest ladder
- `decision:2026-05-22_sync5_texas_ingest_undeferred` — statewide goal, partnership routing

## Read first (after atoms)

1. [`_dispatches/2026-05-26_sync5_texas_four_lane_orchestration.md`](2026-05-26_sync5_texas_four_lane_orchestration.md) — shared rules + Municode throttle
2. [`_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md`](../_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md) — reserved-range query trap, dev-only-wrapper pattern
3. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — Path A/B/C
4. [`80_adrs/adr_017_atom_access_control.md`](../80_adrs/adr_017_atom_access_control.md) — `platform-internal` tagging
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-8 verbatim verification

## Workspace ownership

- Clone: `P:\hauska-engine-e-central`
- Branch prefix: `stream-1d/sync5-lane-central/`
- You **own** `tocRootNodeIds` adapter work in this wave; other lanes must not implement it.

Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`.

## Scope

**In scope**

1. **Staged quick wins** (staging files may exist under `P:\tmp\sync5-staging-*.ts` from 2026-05-23 — wire, eval, PR): Cibolo, Selma, Universal City, Leon Valley, Anthony, Socorro.
2. **Pharr re-ingest** — curated-queries fix only (729-atom ingest is clean; eval failed on reserved-range queries).
3. **`tocRootNodeIds` adapter enhancement** — unblocks Luling, Woodcreek, Belton, Creedmoor (mixed dev+non-dev wrapper class); then ingest those four.
4. **Tier 3 / corridor stragglers:** Jarrell; any I-35 city not already on `main` with passing eval.
5. **Corpus-quality follow-up** flagged in `00_current_state`: single-product cities with ~zero in-corpus xrefs — diagnose chapter-filter vs query set; fix where mechanical.

**Out of scope**

- DFW, Houston, West TX queues (other lanes).
- Partnership cities (Fort Worth, Arlington, etc.) — recon + `73_partnerships.md` row only.
- Layer 1 ICC model-code ingest (credential-gated; paused per ADR-019).
- Self-merge / deploy — PRs held for operator.

## City queue (priority order)

| Priority | City | Notes |
|----------|------|-------|
| P0 | Pharr | Query-only re-ingest |
| P0 | Cibolo, Selma, Universal City, Leon Valley, Anthony, Socorro | Staged wiring |
| P1 | `tocRootNodeIds` PR | Adapter first |
| P1 | Luling, Woodcreek, Belton, Creedmoor | After adapter merges |
| P2 | Jarrell | Tier 3 |
| P3 | Discovery pass | Remaining Bastrop-network / I-35 small cities not on main |

Skip any city another lane already has an open PR for.

## Acceptance criteria

- Each shipped city: eval ≥0.9 (target 1.0/1.0/1.0), `accessPolicy: platform-internal`, one PR per city.
- Adapter PR: tests green; unblocks ≥1 queued city.
- Tests: `pnpm test` (or package-scoped tests touched by adapter) with `NODE_OPTIONS=--use-system-ca`.
- Inbox report per batch with PR URLs, atom counts, eval scores, blockers verbatim.

## Reporting

`P:\doc_repo\_inbox\2026-05-26_hauska-engine_cc-agent-E-C_<topic>.md`

---

## Paste-ready prompt (operator)

```
You are cc-agent-E-C on hauska-engine (clone P:\hauska-engine-e-central).

Read and execute:
P:\doc_repo\_dispatches\2026-05-26_cc-agent-E-C_sync5_lane_central.md
P:\doc_repo\_dispatches\2026-05-26_sync5_texas_four_lane_orchestration.md

Long-running Sync 5 central-Texas lane. Start with Pharr query-fix re-ingest, then staged suburbs (Cibolo, Selma, Universal City, Leon Valley, Anthony, Socorro), then tocRootNodeIds adapter + Luling/Woodcreek/Belton/Creedmoor, then Jarrell and I-35 discovery.

Rules: platform-internal Path A; 0.5 req/sec Municode; NODE_OPTIONS=--use-system-ca; one PR per city; hold PRs for operator merge; inbox report every ~4h or per batch.

Do not stop for instruction between cities unless eval <0.9, cost overrun, or partnership-only blocker.
```
