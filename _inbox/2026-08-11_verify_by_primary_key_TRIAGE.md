---
id: 2026-08-11_verify_by_primary_key_TRIAGE
title: TRIAGE — the write-then-verify should query the PRIMARY KEY, not a jsonb expression (575x)
date: 2026-08-11
status: MEASURED — fix identified, not yet applied (sweep is mid-metro)
owner: planner
memory_graded: pending
related:
  [
    _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md,
    _inbox/2026-08-10_W1_atom_write_throughput_PLANNER_NOTE.md,
    90_operations/OPS-13_store_topology,
  ]
---

# The verify should query the primary key

Operator flagged 2026-08-11 that the sweep rate "isn't acceptable and any slower will be alarming." Planner measured. **It IS worse than reported, the cause is now fully understood, and the fix is a one-line change to the query — not an index, not a schema migration.**

## What is actually happening

The sweep's write-then-verify does:

```sql
SELECT body FROM atoms
 WHERE entity_type = 'parcel-node'
   AND body->>'parcelNodeId' = ANY($1::text[])
```

That is a **jsonb expression predicate**, which no index serves for a 5,000-element array, so Postgres seq-scans the entire table every batch.

## The degradation is SUPERLINEAR, and here is why

| | session start | now |
|---|---|---|
| rows | 10,656,683 | **16,186,789** (+51.9%) |
| total size | 20 GB | **29 GB** |
| indexes | 2,550 MB | **4,159 MB** |

Linear scan-cost scaling predicted ~147 atoms/sec at the new size. **Actual measured ceiling is 22.** The gap is explained by the `EXPLAIN (ANALYZE, BUFFERS)`:

```
Seq Scan on atoms (actual time=216374..219955 rows=5000)
  Rows Removed by Filter: 16,181,789
  Buffers: shared hit=14216 read=3,230,674 dirtied=212,124 written=210,100
```

**`read=3,230,674` blocks come from DISK.** The table has outgrown cache, so every verify is now physical I/O — and `dirtied`/`written` show the scan is evicting and writing back pages, competing with the sweep's own writes. That is the superlinear term: past the cache cliff, cost stops tracking row count and starts tracking disk.

## Three options, all measured on the live table at 16.2M rows

| approach | 5,000-id batch | ceiling |
|---|---:|---:|
| current — jsonb expression, seq scan | 229,382 ms | **22 atoms/sec** |
| force the index (`enable_seqscan=off`) | 81,493 ms | 61 atoms/sec |
| **verify by `atom_did` (PRIMARY KEY)** | **399 ms** | **12,531 atoms/sec** |

**575x over current.** No new index, no migration, no schema change.

### Why the primary key works and the jsonb index does not

`atom_did` is the table's PRIMARY KEY (`atoms_pkey`, 1,107 MB). A `= ANY(array)` against a btree primary key is a straightforward index scan. The jsonb expression index (`atoms_parcel_node_lookup_idx`, which the planner created earlier this session) can serve single-value equality — measured 8,700 ms -> 3 ms — but the planner will not choose it for a 5,000-element array, and forcing it only reaches 61/sec because it still does 5,000 separate index descents plus heap fetches.

**The writer already knows every `atom_did` it just wrote.** `writePropertyAtomsBatch` returns `{atomDid, cid}` per row. The verify does not need to look atoms up by their business key at all — it can look them up by the key it just used to write them.

### A finding that reverses an earlier one, and the reversal is the lesson

Earlier this session, at **10.7M rows**, the planner measured the index as WORSE than the seq scan (39/sec forced vs 55/sec seq) and recorded "the index is not the fix." At **16.2M rows** the index is now 3x BETTER (61 vs 22).

**The crossover happened as the table outgrew cache.** A performance conclusion measured at one table size expired at another — and it expired within a single session, silently. Same family as "a benchmark on an empty table measures the code, not the system," but sharper: **a measurement on the production table also has a shelf life, and the shelf life is however long it takes the table to change scale.**

## Recommended fix (NOT yet applied — sweep is mid-metro)

In `packages/engine-core/scripts/write-parcel-node-county.mjs`, the verify block: keep the returned `atomDid` from `writePropertyAtomsBatch` and query `WHERE atom_did = ANY($1)` instead of `WHERE entity_type = ... AND body->>'parcelNodeId' = ANY($1)`.

**What must NOT change:** the verify still reads the STORED BYTES back and re-validates against the schema and the plan. This changes only HOW the rows are located, never what is checked. `verifyStoredParcelNodeAtom` keeps its current contract. The same fix applies to every sibling writer (owner-fact, well-fact, rail-corridor, footprint, special-district, cad-parcel-roll, land-use-fact, flood-hazard-fact) — all of them use the same jsonb-expression verify pattern.

## Why it is NOT being applied right now

The sweep is mid-Dallas with 4 metro counties left and has already been broken once this session by an edit to its live tree. Editing `P:/hauska-engine` while it runs is a live deploy to a running lane. **Options, operator's call:**

- **(A) Let the sweep finish on the slow path.** Predicted ~4.5-6 h for the last three plus Dallas's re-run. Zero risk, known cost.
- **(B) Halt at the next county boundary, patch in a worktree, resume.** The halt is clean and idempotent (proven 7 times). Costs one county restart; the remaining ~3M atoms then run at a fundamentally different rate.

**Planner recommendation: (B), but only at a county boundary and only if the operator wants the time back.** (A) is genuinely fine for finishing Texas. What matters far more is that **this fix lands before the next statewide pass and before the five queued rail applies** — those applies will hit the identical wall, and every state after Texas starts at 16M+ rows rather than 10M.

## The bigger implication

This is the third time this session that the same underlying issue produced a different-looking symptom: single-row INSERTs (real, fixed, not binding), a missing index (real, not the fix), and now a jsonb-expression verify against a table past its cache cliff. **The write path was never the problem. The verify read was, from the beginning.**
