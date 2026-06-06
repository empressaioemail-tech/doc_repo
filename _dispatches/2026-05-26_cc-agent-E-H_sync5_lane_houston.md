---
id: 2026-05-26_cc-agent-E-H_sync5_lane_houston
title: Dispatch — cc-agent-E-H Sync 5 lane Houston (Gulf Coast + upper coast)
date: 2026-05-26
agent: cc-agent-E-H
repo: hauska-engine
kind: dispatch
status: ready
related: [2026-05-26_sync5_texas_four_lane_orchestration, 51_substrate_v1_sprint, 73_partnerships, _sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E]
---

# Sync 5 lane Houston — cc-agent-E-H

You are **cc-agent-E-H**, Houston / Gulf Coast lane for statewide Sync 5 on `hauska-engine`. Long-running continuous ingest.

## Model (HR-12)

Default: **Grok Build 0.1**.

## Atoms to resolve

- `current-state:portfolio`
- `sprint:51` — eCode360 batch notes (Houston, Dallas city proper)
- `decision:2026-05-22_sync5_texas_ingest_undeferred`

## Read first (after atoms)

1. [`_dispatches/2026-05-26_sync5_texas_four_lane_orchestration.md`](2026-05-26_sync5_texas_four_lane_orchestration.md)
2. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) — eCode360 batch (Houston, Dallas)
3. [`_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md`](../_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md) — reserved-range trap, Brownsville 0.9 waiver pattern
4. [`73_partnerships.md`](../73_partnerships.md)

## Workspace ownership

- Clone: `P:\hauska-engine-e-houston`
- Branch prefix: `stream-1d/sync5-lane-houston/`

## Scope

**In scope**

- **Houston metro Municode ladder** — City of Houston and Harris County proper are likely eCode360/partnership; ingest **incorporated suburbs** where Municode Path C works: Pasadena, Pearland, Sugar Land, Missouri City, League City, Baytown, Conroe, Friendswood, Texas City, Galveston, League City, La Porte, Deer Park, etc. (discovery-driven; maintain a running table in inbox reports).
- **Upper Gulf / Coastal:** Corpus Christi, Beaumont, Port Arthur, Victoria, Lake Jackson, Bryan/College Station (probe).
- Route NO-RESULT / eCode360-only to partnership track.

**Out of scope**

- DFW (E-N), Central (E-C), West/RGV/El Paso (E-W).
- Dallas city proper (E-N recon list).

## City queue (seed — discovery expands)

| Tier | Cities |
|------|--------|
| P0 | Pasadena, Pearland, Sugar Land, Missouri City |
| P1 | League City, Baytown, Conroe, Texas City, Galveston |
| P2 | Corpus Christi, Beaumont, Port Arthur, Victoria |
| P3 | Houston / Harris County recon → partnership if no Path C |
| P3 | College Station, Bryan |

## Acceptance criteria

- Eval ≥0.9 before PR; document reserved-range query authoring.
- `platform-internal` on all ingests.
- Metro discovery table updated each inbox report (city, path, atoms, eval, PR #).

## Reporting

`P:\doc_repo\_inbox\2026-05-26_hauska-engine_cc-agent-E-H_<topic>.md`

---

## Paste-ready prompt (operator)

```
You are cc-agent-E-H on hauska-engine (clone P:\hauska-engine-e-houston).

Read and execute:
P:\doc_repo\_dispatches\2026-05-26_cc-agent-E-H_sync5_lane_houston.md
P:\doc_repo\_dispatches\2026-05-26_sync5_texas_four_lane_orchestration.md

Long-running Sync 5 Houston / Gulf Coast lane. Discovery-first: probe Municode for each Houston-metro suburb, ingest Path C cities, route Houston/Dallas proper and eCode360-only to 73_partnerships.md. Then upper coast (Corpus Christi, Beaumont, Victoria, etc.).

Watch reserved-range curated-query trap (chapters with Secs. N-1—N-25 Reserved — walk children before drafting queries).

Rules: platform-internal; 0.5 req/sec Municode; NODE_OPTIONS=--use-system-ca; one PR per city; hold PRs for operator merge; inbox every ~4h with discovery table.

Continuous run until queue exhausted or blocked.
```
