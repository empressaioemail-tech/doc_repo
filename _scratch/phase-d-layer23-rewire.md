# Phase D — layer-23 cohort rewire (2026-08-03)

## Status: REWIRE ON BRANCH — MU full re-warm DONE; R6 target NOT met

**Branch:** `feat/phase-d-layer23-cohort` @ hauska-engine

## What changed (mechanism-not-build)

- `BASTROP_REGISTRY_ROW.railPerParcel` — registry-keyed Rail-A layer config (layer URL, CITY filter, ZoneTypeClass map)
- `src/registry/parcel-cohort-loader.ts` — `loadRegistryDistrictCohort(fips, districtPrefix)` generic paginated AGOL query
- `bastrop-dominant-district-roster.mjs` — cohort SOURCE = layer-23 registry (not atom setback-rule)
- `depth-warm-bastrop-batch.mjs` — iterates full layer-23 roster; LEFT JOIN zoning-fact; declines missing stamp
- `bastrop-layer23-roster.mjs` — un-zombied; delegates to registry loader

## Verification (pre-merge)

- Registry tests: 5/5 pass
- Block-13 regression: 7/7 blockPass (branch)
- MU layer-23 cohort: **516** parcels, **141364 included** (was absent from 189 atom roster)

## onboard(fips) readiness

**Landed:** registry row `railPerParcel` + `loadRegistryDistrictCohort(fips, district)` — Bastrop is first instance, not a fork.
**TODO:** per-state provider to resolve district field mapping from registry metadata when second jurisdiction lands.

## MU full re-warm (2026-08-03)

**Log:** `_scratch/phase-d-mu-full-warm.log` — exit 0, ~588s

| Metric | Value |
|--------|-------|
| Processed | 440 unique parcels |
| layer-23 features (raw) | 516 |
| layer-23 unique prop_ids | 444 (72 AGOL duplicates) |
| Dominant roster (deduped + filters) | 440 |
| Promoted | 267 |
| Honest declines | 165 (8 `no-zoning-fact-stamp`) |
| verifyFail | 154 |

**R6 probe `48021:141364`:** still `setback-rule-pending`, snapshot 2026-07-23 — NOT fixed.

**440 vs 516:** AGOL returns 516 features but only **444 unique** prop_ids (72 duplicates). Dominant roster = 440 after dedupe + Block-13 quarantine overlap (4 MU parcels). `layer23Count` metadata still reports raw 516.

**141364 diagnosis (evidence 2026-08-03, NOT inference):**

| Check | 141364 | 109388 (control) |
|-------|--------|------------------|
| MU roster index | **14 / 440** (processed in full warm) | in sampleOutcomes (promoted) |
| Warm log row | no per-parcel row (log only keeps 8 samples); substrate proves warm | `"parcelNodeId":"48021:109388","verifyPass":true` |
| Substrate envelope `updated_at` | **2026-08-03T15:11:03** | 2026-08-03T15:10:51 |
| Warm outcome | `superseded-prop-id` honest decline | `depth-warm-promoted-v1` |
| Zoning-fact stamp | **present** MU (2026-07-30) | present MU (2026-07-30) |
| txgio_parcel | present (1101 Pine St) | present |
| BCAD cadastral | **absent** (R9 currency gate) | ok |
| Live PE `snapshotAt` | **2026-07-23** (STALE) | 2026-08-03 |
| Live PE envelope | `setback-rule-pending` (OLD) | ok F15/S5/R15 |

**Ruled OUT:** not-warmed-yet (substrate written 08-03 during MU warm); no-zoning-fact-stamp (stamp exists).

**Confirmed:** warm processed 141364 → `superseded-prop-id` because prop_id is on layer-23 + txgio but **absent from BCAD**. That's a cadastral-currency layer beneath roster (10 MU parcels in this warm bucket).

**PE serve gap:** substrate carries fresh honest decline (`warmVerifyDeclineCode: superseded-prop-id`) but PE still serves pre-warm `setback-rule-pending` at 07-23. R6 needs PE path to surface named decline, not stale pending.

**Warm log excerpt (109388 only — 141364 not in 8-sample tail):**
```json
{"parcelNodeId":"48021:109388","verifyPass":true,"buildableAreaSqFt":44857.64}
```

## Next

1. **PE serve path:** honest-decline atoms (`superseded-prop-id`, etc.) must replace stale `setback-rule-pending` on facets read — 141364 is the proof parcel.
2. **Cadastral currency cohort:** quantify layer-23 ∩ ¬BCAD across all blocks (10 superseded-prop-id in MU warm alone); successor re-key or honest-decline at PE, not pending.
3. Fix duplicate prop_id counting in `layer23Count` metadata (cosmetic).
4. Merge PR #213 after CI green.
5. Post-merge: SF-1 → GC → MU → RR → PI → IND full re-warm + sweep; re-curl 141364 must show named decline OR MU setbacks.
