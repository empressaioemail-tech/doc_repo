---
id: 2026-08-10_W1_atom_write_throughput_CP1
title: CP1 adversarial review — atom write throughput (pre-code)
date: 2026-08-10
status: pre-register
---

# CP1 — atom write throughput (before code)

## Expected speedup

Baseline: **47 atoms/sec** (32 concurrent single-row INSERTs, each with its own round trip and ON CONFLICT).

Target: **3,000+ atoms/sec** via one multi-row `INSERT ... VALUES (...),(...),... ON CONFLICT (atom_did) DO UPDATE` per batch.

Expected ratio: **~60×** on write phase alone (round-trip amortization). Measured curve should be monotonic in batch size until Postgres parse/plan or bind-parameter ceiling binds; expect diminishing returns above ~2,000 rows/statement and hard cap near **5,040 rows** (65,535 params ÷ 13 columns).

Secondary win: remove per-atom `JSON.stringify(instance)` for pin (InProcessIpfsPin is Map.set only — not network). Pin leak fix should drop peak RSS materially on large counties (1.5M+ atom bodies held in Map today).

## Batch-size curve shape (pre-register)

| Batch size | Expected atoms/sec (order of magnitude) |
|---|---|
| 500 | 800–1,500 |
| 1000 | 1,500–2,500 |
| 5000 | 2,500–4,000+ (may hit param ceiling → internal chunk at ~5040) |

If 500 beats 5000, suspect statement-size overhead or Neon packet limits — not a success.

## ON CONFLICT preservation attack (primary CP1 concern)

Current batch path (`writePropertyAtomsBatch`, lines 348–359) DO UPDATE columns:

1. `cid = EXCLUDED.cid`
2. `content_hash = EXCLUDED.content_hash`
3. `entity_type = EXCLUDED.entity_type`
4. `entity_id = EXCLUDED.entity_id`
5. `jurisdiction_tenant = EXCLUDED.jurisdiction_tenant`
6. `source_adapter = EXCLUDED.source_adapter`
7. `source_url = EXCLUDED.source_url`
8. `fetched_at = EXCLUDED.fetched_at`
9. `body = EXCLUDED.body`
10. `access_policy = EXCLUDED.access_policy`
11. `updated_at = now()`

**NOT in batch DO UPDATE (and must stay out unless intentionally changed):** `section_number`, `subsection_path`. Single-row `writePropertyAtom` updates those; batch path never has — property atoms INSERT nulls for both.

**Silent-failure mode:** dropping any of columns 1–10 from DO UPDATE would leave stale values on re-warm forever; INSERT-only tests would not catch it. Differential test must compare ALL stored columns after a **second write with changed body**.

## Duplicate atom_did within one batch (sharp edge)

Old path: 32 concurrent single-row INSERTs — duplicate `atom_did` in same slice races; last completed upsert wins, no PG error.

New path: multi-row INSERT with duplicate `atom_did` in one statement → `ON CONFLICT DO UPDATE command cannot affect row a second time`.

**Mitigation (required):** dedupe within batch by `atom_did`, last occurrence wins, before building VALUES. Prove in CP2 differential + explicit duplicate-in-batch fixture.

## Idempotency

Re-run unchanged input must yield zero net row change (same bytes, same counts). Test: write → write → `COUNT(*)` unchanged and column-wise identity.

## Write-then-verify

Must remain in county writers; storage change must not bypass verify paths. Benchmark uses storage only; county script unchanged.

## Reviewer verdict (CP1)

**Proceed** with implementation contingent on: (1) column-by-column DO UPDATE diff in PR body, (2) legacy oracle retained for differential test, (3) in-batch dedupe, (4) no change to cid format (`bafy-${contentHash}`).
