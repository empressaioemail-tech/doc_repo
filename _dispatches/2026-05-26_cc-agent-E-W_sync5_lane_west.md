---
id: 2026-05-26_cc-agent-E-W_sync5_lane_west
title: Dispatch — cc-agent-E-W Sync 5 lane West (El Paso + Permian + RGV + Laredo)
date: 2026-05-26
agent: cc-agent-E-W
repo: hauska-engine
kind: dispatch
status: ready
related: [2026-05-26_sync5_texas_four_lane_orchestration, _sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E, 73_partnerships]
---

# Sync 5 lane West — cc-agent-E-W

You are **cc-agent-E-W**, west-Texas and border lane for statewide Sync 5 on `hauska-engine`. Long-running continuous ingest.

## Model (HR-12)

Default: **Grok Build 0.1**.

## Atoms to resolve

- `current-state:portfolio` — El Paso deferred, RGV batch outcomes
- `sprint:51` — Tier 2: El Paso, Laredo, Lubbock (Lubbock overlaps E-N — **E-N owns Lubbock** unless you coordinate; prefer E-N for Lubbock)
- `decision:2026-05-22_sync5_texas_ingest_undeferred`

## Read first (after atoms)

1. [`_dispatches/2026-05-26_sync5_texas_four_lane_orchestration.md`](2026-05-26_sync5_texas_four_lane_orchestration.md)
2. [`_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md`](../_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md) — El Paso wall-time, Pharr, Edinburg, Brownsville/Mission shipped
3. Branch stash note: `stream-1d/sync-5-tx-metros-el-paso` (if still on remote/local)

## Workspace ownership

- Clone: `P:\hauska-engine-e-west`
- Branch prefix: `stream-1d/sync5-lane-west/`

## Scope

**In scope**

- **El Paso — per-Title incremental ingest** (mandatory approach): one PR per Title or logical slice (Titles 18–21 first per prior narrow retry). Do not run full CoO broad scope in one job. Document wall-time per slice in inbox.
- **Laredo** — Tier 2 metro; full Path C probe + ingest.
- **Permian / West Texas:** Midland, Odessa, San Angelo, Abilene (if E-N has not claimed), Big Spring, Alpine (probe).
- **RGV stragglers:** Pharr only if E-C has not completed re-ingest; Edinburg partnership recon (partial Municode corpus — file gap in 73); Harlingen / McAllen / Horizon City recon (partnership from metro batch).
- Skip re-ingest: Brownsville, Mission, Converse (already shipped #40, #41, #47).

**Out of scope**

- DFW, Houston, Central I-35 (other lanes).
- Lubbock (prefer E-N unless idle).

## City queue (priority order)

| Priority | City | Notes |
|----------|------|-------|
| P0 | El Paso | Per-Title PRs only |
| P1 | Laredo | Tier 2 |
| P1 | Midland, Odessa | Discovery |
| P2 | San Angelo, Abilene | Coordinate with E-N |
| P2 | Edinburg | Partnership recon + gap note |
| P3 | Horizon City, Harlingen, McAllen | Recon only (partnership) |

## Acceptance criteria

- El Paso: no single ingest job exceeding 15 min wall without operator waiver in report.
- Eval ≥0.9; platform-internal.
- Inbox reports include per-Title El Paso progress table.

## Reporting

`P:\doc_repo\_inbox\2026-05-26_hauska-engine_cc-agent-E-W_<topic>.md`

---

## Paste-ready prompt (operator)

```
You are cc-agent-E-W on hauska-engine (clone P:\hauska-engine-e-west).

Read and execute:
P:\doc_repo\_dispatches\2026-05-26_cc-agent-E-W_sync5_lane_west.md
P:\doc_repo\_dispatches\2026-05-26_sync5_texas_four_lane_orchestration.md

Long-running Sync 5 west-Texas lane. El Paso first — per-Title incremental ingests only (one PR per Title/slice; do not rerun full CoO). Then Laredo, Midland, Odessa, San Angelo. RGV: skip Brownsville/Mission/Converse; Edinburg/Harlingen/McAllen/Horizon City partnership recon. Pharr re-ingest only if E-C has not finished it.

Prior work: branch stream-1d/sync-5-tx-metros-el-paso may have staged queries.

Rules: platform-internal; 0.5 req/sec Municode; NODE_OPTIONS=--use-system-ca; one PR per city/slice; hold PRs for operator merge; inbox every ~4h with El Paso slice table.

Continuous run until queue exhausted or blocked.
```
