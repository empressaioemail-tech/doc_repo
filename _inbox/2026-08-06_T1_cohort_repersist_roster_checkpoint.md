---
id: T1_cohort_repersist_roster_checkpoint
title: T1 WS1 — cohort re-persist roster checkpoint (store-derived sizing)
status: active
owner: nick
last_updated: 2026-08-06
related: [T1_WS1_serve_truth_amendment, 2026-08-06_T1_elgin_close]
---

# Cohort re-persist roster — checkpoint (master 2026-08-06)

## Ruling

**Size the re-persist roster from the atoms store**, not from either warm run's promote count. Any parcel with a promoted buildable-envelope written under the old no-persist path carries the stale-edge condition regardless of which warm wrote it.

Run-level promote counts (Bastrop apply **2,015**, Elgin re-warm **91/91 parity**) measure **net-new writes in that run**, not the full cohort needing boundary-edge re-persist.

## Elgin reconciliation

| Source | Count | Meaning |
|--------|------:|---------|
| Original Elgin warm (2026-08-04) | **1,886** promoted | First city-cohort promote; no boundary-edge persist |
| Elgin re-warm @ `1256277` (2026-08-06) | **91** net new force-overwrite | Dry-run: `alreadyPromotedSkipped: 1886`; apply parity 91/91 |
| **Store query (authoritative)** | **~1,977** promoted envelopes | 1,886 + 91 = 1,977 (exact match on live recon) |

Elgin close **91/91** documents warm parity for the re-warm leg only. Cohort re-persist target for Elgin = **all store-promoted Elgin parcels (~1,977)**, not 91.

## Bastrop city reconciliation

| Source | Count | Meaning |
|--------|------:|---------|
| City re-warm apply (2026-08-05) | **2,015** promoted | WS1 apply leg at `6f940d2` |
| Prior depth-warm batches (e.g. 2026-08-03) | additional | Also no boundary-edge persist |
| **Store query (authoritative)** | **~2,026** promoted envelopes (non-Elgin 48021) | Includes apply 2,015 + earlier promotes |

## Store query (roster derivation)

Recon artifact: `_inbox/2026-08-06_T1_cohort_repersist_roster_recon.json` (2026-08-06T16:48Z)

```sql
-- All promoted envelopes needing re-persist (per parcel, active)
SELECT DISTINCT body->>'parcelNodeId' AS parcel_node_id
FROM atoms
WHERE entity_type = 'buildable-envelope'
  AND COALESCE(body->>'status', 'active') = 'active'
  AND (
    body->>'depthWarmPromotion' = 'depth-warm-promoted-v1'
    OR body->>'sourceAdapter' = 'depth-warm-verify-promote'
  )
  AND body->>'parcelNodeId' LIKE '48021:%'
ORDER BY 1;
```

Split Bastrop city vs Elgin by registry row / situs-city / jurisdiction tenant at roster-export time (same resolver the warm CLIs use). **Do not** filter to a single run's promote ledger.

## Step 5 sizing (cohort-wide re-persist)

| Cohort | Run-count (wrong) | Store-derived (correct) |
|--------|------------------:|------------------------:|
| Bastrop city (non-Elgin) | 2,015 | **~2,026** |
| Elgin city | 91 | **~1,977** |
| **FIPS 48021 total** | ~2,106 | **~4,003** |

Heavy-scan reservation must budget for **store count**, not ~2,106. Re-run store query immediately before apply (promotes may land between recon and slot).

## Heavy-scan reservation — PRE-APPROVED (2026-08-06)

Master planner pre-approves step-5 slot at **~4,003** parcels (store-derived; re-query before apply). **Take slot immediately after T3 pilot apply completes** — no further master round-trip.

**Release conditions (must all pass before cohort apply):**

1. Engine Option-A PR merged (conclusion-string gate + block13 7/7)
2. Scoped operator-twelve re-persist (same-SHA dry/apply)
3. Warden v1.3 `serveTruthEdgeLabels` reads **12/12 OK**
4. Served-state render pack delivered

**Apply artifact must record:** store roster count at dry-run time AND at apply time (both legs, same engineSha).

## Gates unchanged

- same-SHA dry-run then apply
- block13 7/7 before/after
- Warden v1.3 on operator twelve before render pack; spot-check on cohort post-apply
- slot: **after T3 pilot apply**
