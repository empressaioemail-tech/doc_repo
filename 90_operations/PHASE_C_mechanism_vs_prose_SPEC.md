---
id: PHASE_C_mechanism_vs_prose_SPEC
title: PHASE C deliverable 2 — mechanism vs prose map for onboard(county_fips)
date: 2026-08-02
status: draft (extracted during Bastrop city warm; Phase D build input)
owner: nick
related: [PHASE_C_HANDOFF_bastrop_warm, OPS-2_county_onboarding_runbook, 2026-08-02_bastrop_recipe_ACCEPTED]
---

# Mechanism vs prose — extracted during Phase C Bastrop run

Target: `onboard(county_fips)` reads frozen registry row → stages source → deterministic warm → generalized cert → fail-closed → ledger → CC → halt for R6. An agent runs with zero recipe knowledge; the mechanism enforces the contract.

## Confirmed MECHANISM (self-enforces today)

| Step | Mechanism | Evidence |
|---|---|---|
| R13 repealed edition | Fail-closed on repealed B3 string-filter at warm | Engine warm path |
| R7 district-default at bake | `compute.ts` resolves unmapped adjacency to district default | Phase A #206 on main |
| R28/R30 re-warm | `--force-repromote` recomputes primitive + relabels roles | `depth-warm-bastrop-batch.mjs` L411–478 |
| R32 measured cert | `measurePerEdgeInsetForRings` index-matched inward-normal | `block13-cert-grade.mjs` on main |
| R10 guard at promote | `warmThenVerify` must pass before promote | Batch script promote path |
| Recipe version stamp | `RECIPE_VERSION="1.0.0"` on promoted atoms | Phase A #204 |
| Cost gate instrumentation | Script emits `extrapolatedJurisdictionUsd` + `flaggedOverCostGate` | C1 live: $0.0267 << $200 |
| Block-13 quarantine | Must be frozen config on roster (added to batch exclude set) | Local patch auto-excludes 7 IDs |
| PROPERTY_ATOM_PATH guard | Script refuses promote without `=1` | L157 batch script |

## PROSE-INTERPRETED (agent must read recipe today — Phase D must freeze)

| Step | Current prose | Phase D freeze target |
|---|---|---|
| DB env split | Handoff said both URLs on cortex Neon; live = substrate atoms on hauska-prod `DATABASE_URL`, txgio + ledger on `CORTEX_DATABASE_URL` | Registry row names both connection targets |
| City cohort definition | ~~BASTROP_CITY_BBOX~~ → local `--layer23-city-cohort` uses layer-23 `CITY='BASTROP'` | Registry `city_boundary_source` + frozen geometry filter |
| District block parallel unit | Local `--district-prefix` + Block-13 auto-quarantine (PR pending) | `--district-block` from registry district roster |
| `--force-repromote` mandatory | Local `--force-overwrite` supersedes stale atoms | Default on in `onboard()`; opt-out forbidden for city warm |
| Cert roster extension | `bastrop-district-cert-grade.mjs` uses layer-23 roster + single-vintage gate | Generic cert takes `--roster-from=district\|file\|query` |
| CC ledger population | Local `--upsert-ledger` writes `county_facet_coverage` post-block | Post-block hook upserts perf fields on cortex Neon |
| Windows TLS for BCAD | `NODE_OPTIONS=--use-system-ca` required | CI/runbook env template |
| Area-sweep fail policy | ONE wrong promoted parcel = block FAIL; unpromoted = honest-decline if disclosed | Cert harness exit code + ledger `cert_state` |

## Two concrete refactors (Phase D)

1. **`depth-warm-bastrop-batch.mjs` → `onboard-warm.mjs`** keyed on registry row (county_fips, city boundary, district blocks, exclude list), not Bastrop constants.
2. **`block13-cert-grade.mjs` → `area-sweep-cert.mjs`** takes jurisdiction roster query + dynamic layer-23 answer key (prototype: `bastrop-district-cert-grade.mjs`).

## C1 cost re-measure (live)

```
150-parcel city-bbox cohort, --force-repromote --dry-run
extrapolatedJurisdictionUsd: 0.0267
flaggedOverCostGate: false
msPerParcel: 626
```

## SF-1 block warm (live, first C2 block)

```
processed: 2285 | promoted: 1444 | verifyFail: 783
declines: no-setback-row 26, superseded 32
wallMsTotal: 1,627,126 (~27 min)
recipeVersion on promoted atoms: 1.0.0 (verified path)
```

783 verify-fail parcels did not promote — area-sweep cert grades the **promoted/rendered** set; unpromoted require honest-decline surfacing on PE (separate gate).

## STEP 0 diagnose (layer-23 SF-1, dry-run, 2026-08-02)

Roster: layer-23 `CITY='BASTROP' AND ZoneTypeClass=3` (SF-1) = 2,469 − Block-13 = **2,466**. Processed 2,248 (218 lack substrate `zoning-fact` — not in warm loop).

| Outcome | Count | Verdict |
|---|---|---|
| verifyPass | 1,726 | recipe-correct promote candidates |
| verifyFail | 409 | honest-decline on force-overwrite |
| early decline | 113 | honest-decline |
| null-inset | 182 | legitimate (geometry won't close) |
| other-verify-fail | 222 | front-orientation / residual mechanical |
| superseded-prop-id | 26 | legitimate R9 |
| no-road-adjacency | 79 | legitimate |
| geometry (non-convex) | 5 | R29 |
| no-setback-row | 3 | legitimate |

**STEP 0 verdict:** No systematic recipe bug. Proceed to force-overwrite (STEP 1).

**STEP 1 post-probe finding (district-mismatch gap):** 56 layer-23 SF-1 roster parcels had stale `depth-warm-promoted-v1` (no recipeVersion) because substrate `zoning-fact` district ≠ SF-1 (stamped GC/MU/RR) while layer-23 ZoneTypeClass=3. Batch filtered zoning-fact by `--district-prefix` even when roster was already layer-23 filtered — skipped these parcels. **Fix:** when `--layer23-city-cohort`, do NOT apply district-prefix to zoning-fact join; use `args.districtPrefix` as warm authority district. Retry STEP 1b.

## New MECHANISM (Phase C local patches — PR pending)

| Step | Mechanism | Script / module |
|---|---|---|
| Layer-23 city roster | Paginated AGOL `CITY='BASTROP'` + optional `ZoneTypeClass` district filter | `bastrop-layer23-roster.mjs` |
| Force-overwrite | `--force-overwrite` skips already-promoted gate; overwrites stale `depth-warm-promoted-v1`; writes honest-decline on verify-fail | `depth-warm-bastrop-batch.mjs` |
| Honest-decline promote | Supersedes stale envelope with `warmVerifyDecline` + `recipeVersion=1.0.0`, NO `depthWarmPromotion` marker | `honest-decline-promote.ts` |
| Ledger write-path | Post-block `--upsert-ledger` → `county_facet_coverage` on cortex Neon | `upsert-county-facet-ledger.mjs` |
| District area-sweep cert | Roster from layer-23; grades recipe-1.0.0 promote OR honest-decline; flags stale residue | `bastrop-district-cert-grade.mjs` |
| Failure bucket diagnose | `--diagnose-failures` collects verify-fail reasons incl. `frontOrientation.reasons` | batch script |
| **R33 cert-equivalent promote gate** | `verifyWarmCandidateMechanically` calls shared `verifyR32PerEdgeInset` + `verifyFacesAnswerMatch` from `cert-equivalent-gates.ts`; warm and cert cannot diverge | R33 ruling 2026-08-02 |
| **R33 facesAnswer normalization** | `expandStreetAbbreviationTokens` (JR↔JUNIOR, etc.) before situs↔OSM compare | `edgeLabeling.ts` + `cert-equivalent-gates.ts` |

## CC ledger write-path (STEP 2 verify target)

After SF-1 force-overwrite + `--upsert-ledger`:

```
GET /api/county-ledger → 48021 envelope facet
  recipe_version: 1.0.0
  honest_coverage_pct: > 0 (not 0% placeholder)
  onboarded: true
  cert_state: mechanical-pending (until STEP 3 sweep PASS)
```

## STEP 3 cert STOP (2026-08-02)

After STEP 1b (`stale_latest=0`, ledger 94.72%):

```
bastrop-district-cert-grade.mjs --district-prefix=SF-1
pass 2334 / fail 132 / total 2466 | honestDecline 880 | staleResidue 0
blockPass: false
```

Gate failure counts: frontOrientation facesAnswer 67, perEdgeInset R32 54, setbacks 18, district 15.

**Root cause:** warm `verifyWarmCandidateMechanically` does not enforce R32 remeasure or situs facesAnswer; cert does. Promoted parcels fail cert gates warm never checked. Not mixed-vintage. Fix: add R32 + facesAnswer to warm fail-closed before promote.

**Do NOT proceed to STEP 4 until SF-1 cert PASS.**
