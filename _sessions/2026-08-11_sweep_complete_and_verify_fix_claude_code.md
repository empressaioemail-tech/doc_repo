---
id: 2026-08-11_sweep_complete_and_verify_fix_claude_code
title: Session close — the sweep finished, the verify fix that finished it, and seven writers repaired
date: 2026-08-11
type: session-summary
owner: planner
memory_graded: pending
related:
  [
    _sessions/2026-08-10_write_path_rails_and_harvest_claude_code,
    _sessions/2026-08-10_five_rails_and_write_throughput_claude_code,
    _inbox/2026-08-11_verify_by_primary_key_TRIAGE,
    _decisions/2026-08-10_harvest_completeness_ruling,
  ]
---

# Session close — 2026-08-11

Third capture in the arc. The two 2026-08-10 sessions are NOT superseded; read them for the rulings and the harvest work. This one covers the sweep finishing and why.

## 1. THE PARCEL-NODE SWEEP IS COMPLETE

**132 of 132 counties. Store truth: 11,603,489 `parcel-node` atoms across 195 counties; 18,556,547 atoms total.** Runner exited 0, queue empty, no halt. **The atoms bulk-writer slot is FREE for the first time since 2026-08-09.**

## 2. WHY IT ALMOST DIDN'T — three misdiagnoses in a row, each corrected by measurement

This is the most transferable thing in the session. The sweep degraded to ~20 atoms/sec on the metro tail and I got the cause wrong twice before getting it right.

**Attempt 1 (2026-08-10): single-row INSERTs.** Real defect, W1 (#302) fixed it, benchmarked "63x". **Not the binding constraint** — and the 63x was measured on a throwaway schema while the same code measured 47/sec in production. Corrected to ~16x.

**Attempt 2: a missing index.** I created `atoms_parcel_node_lookup_idx` and measured it WORSE than the seq scan (39/sec forced vs 55/sec). Recorded "the index is not the fix."

**Attempt 3 — the actual cause: the write-then-verify READ, not the write.** `EXPLAIN ANALYZE` on the verify:

```
Seq Scan on atoms
  Rows Removed by Filter: 16,181,789
  Buffers: shared hit=14216 read=3,230,674 dirtied=212,124 written=210,100
  Execution Time: 219,955 ms
```

Every batch seq-scanned the whole table. Past ~11M rows the table stopped fitting cache, so the scan became physical I/O that ALSO evicted and dirtied pages the sweep's own writes needed — it was fighting itself. That is the superlinear term.

**The fix: query the PRIMARY KEY, not a jsonb expression.**

| approach | 5,000-id batch | ceiling |
|---|---:|---:|
| `body->>'parcelNodeId' IN (...)` | 229,382 ms | 22 atoms/sec |
| forced index | 81,493 ms | 61 atoms/sec |
| **`atom_did IN (...)`** | **373 ms** | **12,531 atoms/sec** |

And it was THREE queries, not one — the second and third found only because patching the first produced no speedup:
1. write-then-verify → by `atom_did`
2. orphan-retire read in the reconcile path (same pattern, hidden further up the file) → by `atom_did`
3. `readPriorActiveParcelNodes` needs EVERY atom in a county so no key lookup serves it → new index `atoms_parcel_node_county_idx` `((body->>'countyFips')) WHERE entity_type='parcel-node'`, 61 MB, CONCURRENTLY. **~240,000 ms → 2,234 ms.**

**Result — post-fix metro rates:**

| county | atoms | wall | rate |
|---|---:|---:|---:|
| 48113 Dallas | 693,556 | 632 s | 1,097/sec |
| 48029 Bexar | 703,356 | 533 s | **1,319/sec** |
| 48439 Tarrant | 693,389 | 586 s | 1,184/sec |
| 48453 Travis | 804,457 | 847 s | 950/sec |

**Aggregate 1,114 atoms/sec — 56x the pre-fix ~20.** Those four counties took **43 minutes**; on the old path, **~40 hours**.

### The rules this earned

- **A performance conclusion measured on the PRODUCTION table has a shelf life.** At 10.7M rows the index LOST (39 vs 55); at 16.2M it WON (61 vs 22). The crossover was the cache cliff, and my conclusion expired inside one session.
- **When a fix produces no gain, that is DATA.** Measuring 22/sec after a "63x" fix is what found the real cause. Twice.
- **A phase-level timing attributes cost to the phase's NAME.** "applyWallMs" contained a full-table READ. Profile the steps inside a phase before optimizing the one it is named after.

## 3. ALL SEVEN SIBLING WRITERS FIXED (eng #303 + #304, both merged)

Verified on `origin/main` (`34c94ff`): owner-fact, well-fact, rail-corridor-fact, building-footprint, cad-parcel-roll, land-use-fact, flood-hazard-fact all carry `atom_did IN`, zero `body->>'atomDid' IN`. **The rail applies are unblocked.**

Dispatched as two agents on disjoint file sets. Both did better work than the brief asked for, and both corrected me:

**Group B found the `atom_did` rewrite is CONDITIONAL.** `resolvePropertyAtomDid` (`property-atom-batch-write.ts:46`) KEEPS `instance.atomDid` when it already starts with `did:hauska:`, otherwise MINTS from `buildAtomDid(entityType, entityId)`. That is why `parcel-node` column and body agree on all 10.8M rows (passthrough) while cad-roll/land-use/flood diverge (mint: column `did:hauska:cad-parcel-roll:48055:10005:2026` vs body `cadroll_c0cf2b186a1074b5`). **A naive swap would have matched ZERO rows and turned every verify into a false "atom not readable back" — which looks like data corruption, not a query bug.**

**Group A found an error in MY brief.** I prescribed computing `` `did:hauska:<type>:${a.entityId}` `` assuming a uniform entityId shape. It is not uniform: owner-fact `${parcelNodeId}:${taxYear}`, well-fact `${parcelNodeId}:${wellKey}`, building-footprint `${parcelNodeId}:footprint:${footprintId}`, and **rail-corridor-fact has NO `entityIdOf` helper at all** — it passes the bare `parcelNodeId` (verified at `rail-corridor-fact-writer.ts:147`). It used `a.entityId` directly, the value storage actually persists, which is correct regardless of shape.

**RULE: prescribe the INVARIANT (use the value storage persists), never the RECONSTRUCTION.**

**Residual risk carried forward, named honestly by Group A:** all four of its types have ZERO rows, so the end-to-end match rests on mechanism + sibling evidence (149/149) + a new 15-assertion `cp2-refute.test.ts`, NOT on observing a real round-trip. **WATCH THE FIRST `--apply` OF EACH WRITER for `verifyFailures`** — a systematic "atom not readable back" points at the derivation, not at data corruption.

## 4. A PROCESS DEFECT THE OPERATOR CAUGHT

`_STATE.md` recorded Q6 and Q7 as "DISPATCHED, awaiting return." **Neither had ever been handed to an agent.** I wrote the briefs into chat and recorded them as dispatched on the strength of having written them. No branch, no PR, no close artifact — verified at source after the operator questioned it.

Same class as the K5 defect (correct in production, uncommitted in source): **the artifact existed, so the work looked done.**

Added a standing warning to the register: *a status in that table is a CLAIM and must be verified like one. "Dispatched" means an agent is running or a branch exists.*

## 5. LOCAL TEST BASELINE — do not chase these

`packages/engine-core` on a Windows checkout shows **3 failed / 137 passed of 140 files**:
- `cert-grade-and-report.test.ts` and `preflight-and-report.test.ts` fail to LOAD with `SyntaxError` (CRLF artifact, contribute ZERO tests)
- `preflight-probes.test.ts` "cert-path preflight parity" is FLAKY at its 15 s timeout

Planner reproduced all three independently on a tree with none of the session's changes. **Pre-existing, CI green on Linux.** The flaky test will keep producing false reds on unrelated PRs until its bound is raised.

## 6. STATE AT CLOSE

**Ledger (unchanged — scorer has not applied yet):** 14 rails / 3,556 cells / 89 satisfied / 107 present / 18 partial / **0.7689%**. Geometry rail: 88 satisfied-present, 166 not-yet.

**Atoms store:** 18,556,547 atoms, **eleven** indexes (nine original + my two from the verify fix), 29 GB.

**Open PRs:** eng #295 (utility-easement writer, CI SUCCESS, needs merge-from-main), eng #293 (F5 roads, CI FAILURE, DO-NOT-MERGE).

**Running:** the geometry scorer, dispatched to a Cursor agent by the operator. Nothing else.

**The queue is `_STATE.md` "QUEUED WORK", Q1–Q14.** Q1 and Q2 are unblocked for the first time.
