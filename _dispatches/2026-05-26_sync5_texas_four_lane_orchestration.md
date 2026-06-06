---
id: 2026-05-26_sync5_texas_four_lane_orchestration
title: Orchestration — Sync 5 Texas statewide ingest (four parallel cc-agent-E lanes)
date: 2026-05-26
agent: planner
repo: doc_repo
kind: dispatch-orchestration
status: active
related: [00_current_state, _decisions/2026-05-22_sync5_texas_ingest_undeferred, 49_code_ingestion_pipeline, 51_substrate_v1_sprint, 73_partnerships, _sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E, 90_runbooks/agent_workspace_hygiene, 01a_atom_conventions]
---

# Sync 5 Texas statewide ingest — four-lane orchestration

## What this is

Scale Sync 5 from one cc-agent-E (three worktrees) to **four long-running parallel lanes** on `hauska-engine`, each with its own Cursor workspace and clone. Goal: climb toward **deep municipal-code context on all of Texas** — every reachable city ingested and eval-passing, every access-blocked city named on the General Code partnership track in [`73_partnerships.md`](../73_partnerships.md).

This is **jurisdictional code corpus ingest** (UDC / CoO / LDC `code-section` atoms), not parcel or property-record data. Same pipeline as Bastrop, Austin, San Antonio, and the central-TX corridor.

## Pre-mortem (2026-05-26)

| # | Commitment | Result |
|---|------------|--------|
| 1 | Sell reasoning, not data | **Green** — eval harness + source attribution unchanged |
| 2 | Partnership-first sourcing | **Green** — eCode360 / NO-RESULT cities route to partnership; no scraping |
| 3 | Cost per jurisdiction | **Green** — proven at scale; hard-kill + skip-on-grind unchanged |
| 4 | Dual interface | **Green** — substrate ingest only |
| 5 | Hauska spine | **Green** — catalog width moat |
| 6 | Focus queue | **Green** — cc-agent-E idle; Cortex QA does not displace this |
| 7 | Quality gate | **Green** — 1.0/1.0/1.0 bar (≥0.9 floor per metro batch) |

**Overall: GREEN.** Proceed.

## Corpus baseline (do not re-ingest)

~33 jurisdictions with open or merged PRs on `hauska-engine` (`#20`–`#47` plus Sync 4.5). See [`00_current_state.md`](../00_current_state.md) §2 Sync 5 and [`_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md`](../_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md). Each lane **skips cities already on `main` with a passing eval** unless doing a deliberate re-ingest (Pharr query fix only).

## Four lanes

| Lane | Agent ID | Clone path | Dispatch | Geographic scope |
|------|----------|------------|----------|------------------|
| **Central** | `cc-agent-E-C` | `P:\hauska-engine-e-central` | [`2026-05-26_cc-agent-E-C_sync5_lane_central.md`](2026-05-26_cc-agent-E-C_sync5_lane_central.md) | Finish I-35 / Bastrop-network stragglers, staged SA-metro suburbs, `tocRootNodeIds` adapter + blocked cities |
| **North** | `cc-agent-E-N` | `P:\hauska-engine-e-north` | [`2026-05-26_cc-agent-E-N_sync5_lane_north.md`](2026-05-26_cc-agent-E-N_sync5_lane_north.md) | DFW metro (Municode suburbs), North/East TX, Panhandle |
| **Houston** | `cc-agent-E-H` | `P:\hauska-engine-e-houston` | [`2026-05-26_cc-agent-E-H_sync5_lane_houston.md`](2026-05-26_cc-agent-E-H_sync5_lane_houston.md) | Houston metro suburbs, Upper Gulf Coast |
| **West** | `cc-agent-E-W` | `P:\hauska-engine-e-west` | [`2026-05-26_cc-agent-E-W_sync5_lane_west.md`](2026-05-26_cc-agent-E-W_sync5_lane_west.md) | El Paso (scoped), West TX, RGV stragglers, Laredo, border metros |

Legacy single-agent ID **`cc-agent-E`** remains the repo owner label in fleet docs; these four lanes are parallel **sub-identities** for hygiene and reporting only (same HR-12 model stack).

## Operator pre-flight (before firing lanes)

1. **Merge backlog** — PRs `#30`–`#47` on `empressaioemail-tech/hauska-engine` (operator-supervised cadence). Lanes should branch from current `origin/main` after merges when possible.
2. **Bootstrap four clones** (one per lane; never share a working tree):

```powershell
cd P:\
$repo = "https://github.com/empressaioemail-tech/hauska-engine.git"
foreach ($lane in @("central","north","houston","west")) {
  git clone $repo "hauska-engine-e-$lane"
  Set-Location "P:\hauska-engine-e-$lane"
  git fetch origin
  git checkout -b "stream-1d/sync5-lane-$lane"
  Set-Location P:\
}
```

3. **Open four Cursor windows**, each rooted at the matching clone path.
4. **Paste** the lane dispatch prompt from each lane file (§Paste-ready prompt) into the corresponding window.
5. **Snapshot refresh** — after each merge batch (not per PR), operator or planner runs corpus snapshot refresh + retrieval-api redeploy per prior cc-agent-E handoff (covers merged-but-undeployed cities).

## Shared rules (all lanes)

- **Model:** Grok Build 0.1 default; `grok-code-fast-1` for single-file query fixes only.
- **Branch prefix:** `stream-1d/sync5-lane-{central|north|houston|west}/<city-slug>`
- **One PR per city** (or one PR for a single adapter enhancement that unblocks multiple cities).
- **Path A:** `accessPolicy: platform-internal` on every non-partnered ingest.
- **Eval bar:** target 1.0/1.0/1.0; ship at ≥0.9 only with documented waiver in session summary; below 0.9 = fix or defer.
- **Blocked sources:** eCode360 / EncodePlus / Municode NO-RESULT → append to [`73_partnerships.md`](../73_partnerships.md); do not scrape.
- **Municode throttle:** **0.5 req/sec per clone** (four lanes ≈ 2.0 req/sec combined). Do not raise per-process rate without planner approval.
- **TLS:** `NODE_OPTIONS=--use-system-ca` on every `pnpm` / `tsx` invocation (AVG MITM environment).
- **Autonomy:** self-merge **off** for this wave — PR held for operator merge (matches recent cc-agent-E metro batch).
- **Reporting:** `_inbox/YYYY-MM-DD_hauska-engine_cc-agent-E-{C|N|H|W}_<topic>.md` per city batch or every ~4 hours of wall time, whichever comes first.

## Lane coordination

- **No cross-lane file edits.** Adapter work (`tocRootNodeIds`) is owned by **E-C** only; other lanes defer mixed-wrapper cities to E-C or skip with note.
- **City claim:** first lane to open a PR for a `jurisdiction_id` owns it; other lanes skip if they discover duplicate work.
- **Discovery ladder:** for each metro, run Municode `/Clients/name` probe → Path C ingest → else partnership route. Houston and Dallas **city proper** are partnership-track; suburbs are fair game on Municode.

## Success metric (statewide)

Standing goal per [`_decisions/2026-05-22_sync5_texas_ingest_undeferred.md`](../_decisions/2026-05-22_sync5_texas_ingest_undeferred.md): every Texas city either **ingested + eval-passing** or **deferred with blocker** on the partnership track. Track running totals in inbox reports (cities count, atom count, public-free vs platform-internal split).

## End state for this orchestration

Four lanes running continuously until queues exhaust or hit partnership/API blockers. Planner updates [`00_current_state.md`](../00_current_state.md) at session close from inbox rollup.
