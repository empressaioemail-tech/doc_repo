---
id: 2026-07-23_phase1a_storage_port_live_close
title: Phase 1a StoragePort — live close (WDLL 3.1 hard bar cleared)
status: active
date: 2026-07-23
applies_to: hauska-engine, hauska-retrieval-api
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_phase0_spine_readiness_audit_GATE_A, 2026-07-23_phase05_contract_extension_design_GATE_B]
owner: nick
---

# Phase 1a StoragePort — live close

Master WDLL item **3.1** hard bar (Gate A Option A): durable-write-PLUS-retrieval-serve on one atom family. **CLEARED** 2026-07-23 against live state.

## Code

| Item | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/hauska-engine/pull/98 |
| Merge SHA | `f9a224b` |
| Surfaces | `PgStorage`, migration `005_atoms_storage_port.sql`, `LayeredStorage`, retrieval `boot-storage.ts`, proof CLI |

## Live ops

| Step | Evidence |
|---|---|
| Migration 005 | Applied to Neon DB `hauska_mcp` via secret `DATABASE_URL` (not `CORTEX_DATABASE_URL` / `neondb`) |
| Proof write | `did:hauska:code-section:storage-port-proof/phase-1a` — `roundTripOk: true`; absent from `snapshot.json` |
| Retrieval revision | `hauska-retrieval-api-00013-q74` @ 100% |
| Secret wire | `SUBSTRATE_DATABASE_URL` → `DATABASE_URL` (hauska_mcp). Was previously pointed at `CORTEX_DATABASE_URL` (neondb) which has no `atoms` table. |

### Deploy traps recorded

1. Traffic was pinned to tagged revision `iccmint` → `00010-bif`; plain `gcloud run deploy` created new revisions that did not receive 100% until `update-traffic --to-revisions=…=100`.
2. Relative `CORPUS_SNAPSHOT_PATH=services/...` overrides the image default and boot-crashes (`ENOENT`). Use `/app/services/retrieval-api/corpus/snapshot.json`.

## Live verify (verbatim)

**Revision:** `hauska-retrieval-api-00013-q74`

**/healthz/**:
```json
{"status":"ok","db":{"ok":true,"status":"up","source":"probe:substrate-neon SELECT 1","latencyMs":350},"corpus":{"ok":true,"atomCount":29878,"source":"storage:countAtoms"}}
```

**GET** `/atoms/did:hauska:code-section:storage-port-proof/phase-1a`:
```json
{"atom":{"title":"StoragePort Phase 1a proof section","bodyText":"Phase 1a StoragePort proof section. Search token storage-port-proof confirms durable Postgres write and retrieval-api serve.","entityId":"storage-port-proof/phase-1a",...,"sourceAdapter":"storage-port-proof","jurisdictionTenant":"storage_port_proof_tx"}}
```

**GET** `/search?q=storage-port-proof&limit=5`:
```json
{"results":[{"atomDid":"did:hauska:code-section:storage-port-proof/phase-1a",...,"score":1}],"totalCandidates":1}
```

## Grade

| Item | Grade |
|---|---|
| 3.1 StoragePort landed | **MET** — durable write + retrieval serve proven on `code-section` proof family |

Phase 1b property kinds (master 3.2+) unblocked. Gate C remains the next stop gate (live-serving cutover).
