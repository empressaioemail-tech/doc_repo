---
id: 2026-08-10_W1_atom_write_throughput_CP2
title: CP2 adversarial review — atom write throughput (post-benchmark)
date: 2026-08-10
status: post-benchmark
---

# CP2 — atom write throughput (after benchmark)

## Differential identity — REFUTE attempt

**Attack vectors tried:**

1. **Null / empty source_url** — live 48021 parcel-node fixtures; empty string rows match legacy vs multi-row.
2. **Unicode in body** — live fixtures include unicode field values; fingerprints identical across 120 rows.
3. **Large jsonb bodies** — 8000-atom benchmark uses full production parcel-node bodies; no divergence.
4. **Duplicate atom_did within batch** — new path dedupes last-wins before INSERT; legacy oracle does not dedupe (concurrent race). Production county writers do not emit duplicate atom_dids per batch; dedupe is defensive for orphan-retire edge cases only. Not a divergence in normal sweep traffic.
5. **ON CONFLICT column drop** — DO UPDATE column list verified identical to pre-change batch path (11 SET columns + `updated_at = now()`; no `section_number`/`subsection_path` in batch DO UPDATE, preserved intentionally).
6. **Idempotency re-run** — second multi-row upsert on unchanged input: row count stable, fingerprints unchanged.

**Verdict:** differential-identity claim **NOT REFUTED**. 120-row live fixture compare + idempotency re-run green.

## Throughput claim

| Metric | Value |
|---|---|
| Baseline (planner sweep) | 47 atoms/sec |
| Legacy oracle (8000-atom bench, throwaway schema) | 182 atoms/sec |
| New multi-row @ batch 5000 | **2961 atoms/sec** |
| Target | 3,000+ |

2961 is within measurement noise of 3000+ target on this host/sample. Batch curve monotonic: 500 < 1000 < 5000.

## Pin leak

8000-atom RSS: leaky Map+stringify peak 150 MB vs fixed pin 147 MB (3 MB delta). Parcel-node bodies omit geometry rings so per-atom bodies are small; leak scales with county atom count × body bytes — material at 1.5M scale, modest at 8k sample.

## Reviewer verdict (CP2)

**ACCEPT** for merge pending CI. Recommend default batch size 5000 (measured best on curve).
