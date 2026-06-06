---
id: 2026-05-26_cc-agent-E-N_sync5_lane_north
title: Dispatch — cc-agent-E-N Sync 5 lane North (DFW + North/East TX + Panhandle)
date: 2026-05-26
agent: cc-agent-E-N
repo: hauska-engine
kind: dispatch
status: ready
related: [2026-05-26_sync5_texas_four_lane_orchestration, _decisions/2026-05-22_sync5_texas_ingest_undeferred, 73_partnerships, _sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E]
---

# Sync 5 lane North — cc-agent-E-N

You are **cc-agent-E-N**, north-Texas lane for statewide Sync 5 on `hauska-engine`. Long-running continuous ingest until the discovery ladder below is exhausted or blocked.

## Model (HR-12)

Default: **Grok Build 0.1**.

## Atoms to resolve

- `current-state:portfolio` — DFW partnership blockers (Fort Worth anchor)
- `sprint:51` — Tier 2 metro list (Plano, Irving, Garland, …)
- `decision:2026-05-22_sync5_texas_ingest_undeferred`

## Read first (after atoms)

1. [`_dispatches/2026-05-26_sync5_texas_four_lane_orchestration.md`](2026-05-26_sync5_texas_four_lane_orchestration.md)
2. [`_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md`](../_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md) — FW metro already has Crowley, Saginaw, Keller; Fort Worth NO-RESULT
3. [`73_partnerships.md`](../73_partnerships.md) — General Code / eCode360 rows
4. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md)

## Workspace ownership

- Clone: `P:\hauska-engine-e-north`
- Branch prefix: `stream-1d/sync5-lane-north/`
- Do **not** implement `tocRootNodeIds` (cc-agent-E-C owns).

## Scope

**In scope**

- **DFW Municode suburbs** (ingest where Path C works): Plano, Irving, Garland, Frisco, McKinney, Denton, Richardson, Carrollton, Lewisville, Flower Mound, Allen, Grapevine, Southlake, Colleyville, Watauga (staging may exist in `P:\tmp\`), Bedford, Euless, Hurst, DeSoto, Duncanville, Cedar Hill (verify not duplicate of Cortex QA engagement city id), etc.
- **Panhandle / North Plains:** Lubbock, Amarillo, Wichita Falls, Abilene (if not claimed by E-W), San Angelo (coordinate with E-W — **E-W owns San Angelo**; skip if E-W started).
- **East TX:** Tyler, Longview, Sherman, Texarkana (probe first).
- **Partnership recon only (no scrape):** Fort Worth, Arlington, Mansfield, Burleson, North Richland Hills, Dallas (city proper — eCode360 per 51).

**Out of scope**

- Central corridor (E-C), Houston/Gulf (E-H), El Paso / RGV / Laredo (E-W).
- `tocRootNodeIds` mixed-wrapper cities until E-C adapter merges.

## City queue (seed — expand via discovery)

| Tier | Cities |
|------|--------|
| P0 | Watauga (staged), Plano, Irving, Garland |
| P1 | Frisco, McKinney, Denton, Richardson, Carrollton, Lewisville |
| P2 | Allen, Flower Mound, Grapevine, Southlake, Bedford, Cedar Hill |
| P3 | Lubbock, Amarillo, Wichita Falls, Tyler, Longview |
| Recon | Fort Worth, Arlington, Mansfield, Burleson, NRH, Dallas → `73_partnerships.md` only |

Already ingested on main (skip): Crowley, Saginaw, Keller (PRs #43, #45, #46 area).

## Acceptance criteria

- Same as orchestration: eval ≥0.9, platform-internal, one PR/city, 0.5 req/sec, inbox reports.
- Partnership recon entries include platform ID when known (e.g. McAllen `MC6775` pattern from metro batch).

## Reporting

`P:\doc_repo\_inbox\2026-05-26_hauska-engine_cc-agent-E-N_<topic>.md`

---

## Paste-ready prompt (operator)

```
You are cc-agent-E-N on hauska-engine (clone P:\hauska-engine-e-north).

Read and execute:
P:\doc_repo\_dispatches\2026-05-26_cc-agent-E-N_sync5_lane_north.md
P:\doc_repo\_dispatches\2026-05-26_sync5_texas_four_lane_orchestration.md

Long-running Sync 5 north-Texas lane. DFW Municode suburbs first (Plano, Irving, Garland, Frisco, McKinney, Watauga staged, then discovery ladder). Panhandle and East TX after DFW queue thins. Fort Worth, Arlington, Dallas, etc. are partnership recon only — append to 73_partnerships.md, do not scrape.

Skip Crowley/Saginaw/Keller already ingested. Do not build tocRootNodeIds (E-C lane).

Rules: platform-internal; 0.5 req/sec Municode; NODE_OPTIONS=--use-system-ca; one PR per city; hold PRs for operator merge; inbox every ~4h.

Continuous run until queue exhausted or blocked.
```
