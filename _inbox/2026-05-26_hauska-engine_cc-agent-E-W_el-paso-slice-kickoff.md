---
id: 2026-05-26_hauska-engine_cc-agent-E-W_el-paso-slice-kickoff
title: cc-agent-E-W — Sync 5 lane West kickoff (El Paso per-Title + queue)
date: 2026-05-26
agent: cc-agent-E-W
repo: hauska-engine
clone: P:\hauska-engine-e-west
branch: stream-1d/sync5-lane-west-el-paso-title-18
kind: inbox
---

# cc-agent-E-W — lane West kickoff

**Dispatch:** `2026-05-26_cc-agent-E-W_sync5_lane_west.md`, four-lane orchestration.

**Workspace:** Cloned `P:\hauska-engine-e-west` (lane branch `stream-1d/sync5-lane-west` on `origin/main`). Prior El Paso WIP recovered from `P:\tmp\sync5-staging-el-paso.ts` + stash on `stream-1d/sync-5-tx-metros-el-paso` (index/snapshot only; queries file was never committed).

## El Paso per-Title progress

| Title | Topic | Status | Atoms | Eval | Wall (min) | PR / branch |
|-------|--------|--------|------:|------|------------|-------------|
| **18** | Building and Construction | **PR #50** | 659 | 1.0 / 1.0 / 1.0 | **4.4** | [PR #50](https://github.com/empressaioemail-tech/hauska-engine/pull/50) |
| **19** | Subdivision and Development Plats | **PR #52** | 268 | 1.0 / 1.0 / 1.0 | **3.6** | [PR #52](https://github.com/empressaioemail-tech/hauska-engine/pull/52) |
| **20** | Zoning | **PR #57** (waiver) | 938 | 1.0 / 1.0 / 1.0 | **23.9** ⚠️ | [PR #57](https://github.com/empressaioemail-tech/hauska-engine/pull/57) — exceeds 15 min envelope |
| **21** | SmartCode | **PR #58** | (see PR) | 1.0 / 1.0 / 1.0 | **0.7** | [PR #58](https://github.com/empressaioemail-tech/hauska-engine/pull/58) |

**Dev core (Titles 18–21) complete:** 4 PRs held for operator merge (#50, #52, #57, #58). Combined ~1954+ atoms (Title 20 dominates). Title 20 needs **wall-time waiver** (~24 min @ 0.5 rps).
| 13 | Streets, Sidewalks and Public Places | P2 after 18–21 | — | — | — | — |
| 14 | Aircraft and Airports | P2 | — | — | — | — |
| 15 | Public Services | P2 | — | — | — | — |
| 17 | Housing | P2 | — | — | — | — |

**Slice policy:** `^title N ` filter only; `maxLeafFetches` 1200; Municode **0.5 req/sec** via shared `RespectfulFetch` on adapter + JSON client; `NODE_OPTIONS=--use-system-ca`. No full CoO or multi-Title jobs.

**Title 18 note:** Prior combined Titles 18–21 attempt stalled (>9 min, incomplete). Single-Title ingest completes under the 15 min envelope (~264 s observed).

## Lane queue (next)

| Priority | City | Action |
|----------|------|--------|
| P0 | El Paso | Titles 19 → 20 → 21 (one PR each) |
| P1 | Laredo | Municode probe + Path C ingest |
| P1 | Midland, Odessa | Discovery |
| P2 | San Angelo | After Permian probe |
| P2 | Edinburg | Partnership recon (partial Municode corpus) |
| P3 | Harlingen, McAllen, Horizon City | Partnership recon only |
| — | Pharr | **Skipped** — E-C lane owns re-ingest unless confirmed idle |
| — | Brownsville, Mission, Converse | Skip (shipped #40, #41, #47) |

## Commands (Title 18)

```powershell
cd P:\hauska-engine-e-west\tools\migrate-legacy-codes
$env:NODE_OPTIONS='--use-system-ca'
pnpm dev path-c-eval-el-paso-title-18
```

## Blockers

None for Title 18. Title 20 (Zoning) may be the largest slice — watch wall-time; keep per-Title scope.

🤖 cc-agent-E-W
