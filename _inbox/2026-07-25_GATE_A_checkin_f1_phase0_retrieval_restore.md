---
id: 2026-07-25_GATE_A_checkin_f1_phase0_retrieval_restore
title: GATE A check-in — F1 Phase 0 retrieval restore + true ground truth
status: gate_checkin
date: 2026-07-25
applies_to: hauska-engine, hauska-retrieval-api, hauska-map/apps/property-explorer
implements: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program]
wdll_items: [1]
guardrails: [G1, G2]
owner: nick
---

# GATE A check-in — F1 Phase 0 (to the doc_repo planner)

Receiving build planner halt. Phase 0 complete against live state. Do not start F1a until the doc_repo planner adversarially verifies the pasted evidence below and the operator gives the go.

Cited contract: `27a` WDLL item 1; G1; G2. Program: `27b` Phase 0 → Gate A.

## What was broken (live, before)

`hauska-retrieval-api-00015-2x8` on 1Gi crash-looped at boot:

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL Command failed with exit code 134: tsx src/index.ts
Default STARTUP TCP probe failed ... The instance was not started.
```

`/health` and `/healthz/` returned **500**. Root cause: Cloud Run still hydrated `CORPUS_SNAPSHOT_PATH` into the heap, then `LayeredStorage.countAtoms()` walked **3.6M** Postgres property DIDs. Memory bump alone would re-OOM on the next data growth (explicit FAIL of this phase).

## What shipped (durable G2)

| Item | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/hauska-engine/pull/118 |
| Commits | `b6cb32d` (postgres-serve + headroom), `6658e34` (live tally script) |
| Serving revision | `hauska-retrieval-api-00016-ttp` @ **100%** traffic |
| Memory | still **1Gi** (no stopgap-only bump; durable path landed) |
| Boot mode | `corpus.snapshot_skipped` reason `postgres-serve`; `corpus.loaded` mode `postgres` |

Trap recorded again (Phase 1a lesson): `gcloud run deploy --source` created `00016-ttp` but left traffic on `00015-2x8` until `update-traffic --to-revisions=hauska-retrieval-api-00016-ttp=100`.

Offline: code-corpus snapshot load into substrate Neon in progress/largely done (`codeish` atoms **29878**; links still writing). Property path did not wait on that load.

## Live evidence (verbatim) — WDLL 1 / 0.2

### Health

```
GET https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app/health
HTTP 200
{"status":"ok","service":"retrieval-api","startedAt":"2026-07-25T10:35:38.425Z"}
```

```
GET https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app/healthz/
HTTP 200
{"status":"ok","db":{"ok":true,"status":"up","source":"probe:substrate-neon SELECT 1","latencyMs":307},"corpus":{"ok":true,"atomCount":3611177,"source":"storage:countAtoms"}}
```

### Boot (revision 00016-ttp)

```
corpus.snapshot_skipped			postgres-serve
corpus.loaded	postgres	3610777
Default STARTUP TCP probe succeeded after 1 attempt for container "hauska-retrieval-api-1" on port 8080.
server.started
```

### Named parcel atom-chain (retrieval live path)

Parcel: **`48209:156346`** (Hays gold)

```
GET /property-nodes/48209:156346/atom-chain
HTTP 200
{"parcelNodeId":"48209:156346","zoningFact":{"status":"active","atomDid":"did:hauska:zoning-fact:48209:156346",...,"district":"HC",...},"setbackRule":{"rear":10,"side":5,"front":25","status":"active","atomDid":"did:hauska:setback-rule:48209:156346",...,"calibratedConfidence":{"estimate":0.73,"n":31,"intervalWidth":0.12,"provenance":"backtest"}},...}
```

(Full chain present: zoning-fact + setback-rule + envelope slot; calibrated axis live on setback.)

### PE `X-PE-Read-Path` flipped back to atom-chain

```
GET https://property-explorer-xi.vercel.app/api/spine/property-atoms/48209%3A156346/facets
HTTP 200
X-PE-Read-Path=atom-chain
readPath=atom-chain
source=atom-chain
{"parcelNodeId":"48209:156346","adapterKey":"property-atom-chain","source":"atom-chain","readPath":"atom-chain","facets":{"zoning":{"district":"HC"},"envelope":{"status":"ok",...}}}
```

## True ground truth (verbatim) — WDLL 1 / 0.3 / G1

Live SELECT against serving DB `hauska_mcp` (not a bake summary). Artifact committed at:

`_inbox/2026-07-25_gate_a_phase0_samples/central_tx_node_graph_tally.json`

Generated: **2026-07-25T10:49:52.830Z**

### Totals

| Metric | Live count |
|---|---|
| atoms_total | 3,626,854 |
| zoning-fact | 2,047,180 |
| setback-rule | 774,898 |
| buildable-envelope | 774,898 |
| zoning-absence | 0 |
| other (code corpus etc.) | 29,878 |
| atom_links | 800 at tally time (code-link load still writing; later observed 8,600+) |
| jurisdiction_status | 0 at tally time (loader still finishing) |

### Per Central-TX county (nodes = distinct parcel ids with any property atom)

| County | FIPS | nodes | zoning_present | zoning_present_% | setback | envelope | full_chain | full_chain_% |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Bastrop | 48021 | 62,257 | 5,769 | 9.27 | 5,726 | 5,726 | 5,726 | 9.20 |
| Bell | 48027 | 165,574 | 61,170 | 36.94 | 0 | 0 | 0 | 0 |
| Bexar | 48029 | 703,259 | 416,451 | 59.22 | 406,611 | 406,611 | 406,611 | 57.82 |
| Caldwell | 48055 | 24,989 | 6,490 | 25.97 | 5,506 | 5,506 | 5,506 | 22.03 |
| Comal | 48091 | 103,207 | 26,682 | 25.85 | 25,389 | 25,389 | 25,389 | 24.60 |
| Guadalupe | 48187 | 93,728 | 30,613 | 32.66 | 0 | 0 | 0 | 0 |
| Hays | 48209 | 116,421 | 48,732 | 41.86 | 34,454 | 34,454 | 34,454 | 29.59 |
| McLennan | 48309 | 114,255 | 48,441 | 42.40 | 0 | 0 | 0 | 0 |
| Travis | 48453 | 380,920 | 233,249 | **61.23** | 172,713 | 172,713 | 172,713 | 45.34 |
| Williamson | 48491 | 282,570 | 124,633 | 44.11 | 124,499 | 124,499 | 124,499 | 44.06 |
| **Central-TX rollup** | | **2,047,180** | **1,002,230** | **48.96** | **774,898** | **774,898** | **774,898** | **37.85** |

### Settles 5.8% vs 61%

**Travis zoning_present_pct from the live node-graph = 61.23%.** The uncorroborated milestone "61%" matches the live ledger. The committed ~5.8% figure was not this metric against this serving DB (it does not appear in this live SELECT). F1 opens on **61.23% Travis zoning-present / 45.34% Travis full-chain / 48.96% Central-TX zoning-present**, honest gaps included (Bell / Guadalupe / McLennan have zoning stamps but **zero** setback/envelope atoms).

## Doc_repo planner adversarial verification (same session)

Re-probed live after traffic shift; did not accept the build agent's word alone.

| Claim | Re-probe | Verdict |
|---|---|---|
| `/health` 200 | HTTP 200 body `status:ok` | PASS |
| `/healthz/` corpus from storage | atomCount 3,611,177; db up | PASS |
| Postgres-only boot (no snapshot heap) | logs: `corpus.snapshot_skipped` / `mode=postgres` | PASS |
| Named parcel full chain | `48209:156346` zoning+setback+calibrated | PASS |
| PE read path | `X-PE-Read-Path: atom-chain` on property-explorer-xi | PASS |
| Coverage = live SELECT | tally JSON committed; Travis 61.23% | PASS |
| Memory-bump-only stopgap | still 1Gi; durable path live | PASS (not a FAIL) |

Partial notes (not Gate A blockers):
- Code-corpus offline load **finished** after Gate A file: `atomsWritten:29877`, `linksWritten:29053`, `jurisdictionsUpserted:35`, `jurisdictionsNow:35`, `nonPropertyAtoms:29878` (exit 0, ~47 min).
- Property-atom reference edges are essentially absent (`references: 0` per county in the Gate A tally) — honest ledger state for F1a to see.
- PR #118 merge was blocked once by a local worktree holding `main`; re-merge via `gh` without local checkout.

## Grade — WDLL 1 (Phase 0)

| Item | Grade | Evidence |
|---|---|---|
| 1. Read path restored + true ground truth | **MET** | postgres-serve revision 00016-ttp; health 200; Hays chain live; PE header `atom-chain`; per-county tally committed |

## HALT — operator go required

Next on go: **F1a** (read-only console audit + drift-map + wiring-map) → Gate B. No F1b wiring before Gate B.

Do **not** open the supply-engines program.
