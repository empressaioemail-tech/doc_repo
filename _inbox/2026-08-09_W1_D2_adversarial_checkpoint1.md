---
id: 2026-08-09_W1_D2_adversarial_checkpoint1
title: W1 D2 — adversarial checkpoint 1 (footprint + easement BUILD)
date: 2026-08-09
status: partial-pass-holds
reviewer: planner (independent of builder subs)
frame: T3 recon probes + ADR-029 rulings + #291 writer pattern — NOT builder unit tests
related: [_inbox/2026-08-05_T3_footprint_source_recon, _inbox/2026-08-05_T3_ingest_spec_footprints_easements, _decisions/2026-08-05_adr029_rails_rulings]
---

# D2 adversarial checkpoint 1

Review posture: pre-register expectations BEFORE reading builder output, then attack from a different frame than `plan-county-*.test.ts`.

## Pre-registered expectations

### Footprint (`building-footprint`)

| County | Expected route | Expected dry-run shape | accessPolicy |
|---|---|---|---|
| 48021 Bastrop | `ml-global-building-footprints` (0/11 CAD REST per T3 recon) | With live txgio parcels + empty ML bbox: **1** county-coverage absence atom (`verifiedAbsence`, no geometry). With ML features + join: mix of present + `no-footprint-feature` per-parcel — **never zero rows when parcels>0 unless county-coverage path**. | `public-free` + `sourceTier=ml-derived` |
| Any county, `--adapter-kind=honest-absence` | honest-absence | Exactly 1 county-coverage atom | `public-free` |

### Easement (`utility-easement`)

| County / scope | Expected route | Expected dry-run shape | accessPolicy |
|---|---|---|---|
| 48021 `--scope=county` | honest-absence | **1** county-coverage atom; provenanceScope lists checked sources | `public-free` |
| 48021 `--scope=city-limits` | municipal-easement-rest (Bastrop Easements_/43) | Present easements for parcels intersecting city limits polys; per-parcel absence elsewhere in city scope | `public-free` |
| 48309 `--scope=county` | cad-easement-rest layers 9–10 | Present + per-parcel `no-easement-feature`; **not** county-coverage absence | `public-free` |

## Attack results

### Footprint — PASS WITH HOLDS

| Check | Result | Evidence |
|---|---|---|
| Default route is ML, not CAD | **PASS** | `resolve-footprint-route.ts` defaults `ml-global-building-footprints` |
| Empty ML bbox → county-coverage, not silent zero | **PASS** | `plan-county-building-footprints.ts` L70–74; unit test in `plan-county-building-footprints.test.ts` |
| Per-parcel absence when join misses | **PASS** | spatial-join + `no-footprint-feature` path |
| accessPolicy + sourceTier | **PASS** | `building-footprint-writer.ts` → `public-free`, body carries `sourceTier: ml-derived` |
| Write-then-verify seam | **PASS** | mirrors cad-parcel-roll pattern |
| **HOLD-1:** Texas ML zip streaming | **NOT SHIPPED** | `ml-footprint-loader.ts` returns empty without `--fixture`; statewide apply blocked until zip partition ingest lands |
| **HOLD-2:** Registry routing | **ACCEPTED DEVIATION** | `constants.ts` / route resolver only; OPS-1 registry rows not wired — flag for post-BUILD |
| **HOLD-3:** Live dry-run | **NOT EXECUTED** | Needs `CORTEX_DATABASE_URL`; planner to run on 48021 with fixture before PR merge |

### Easement — PASS WITH HOLDS

| Check | Result | Evidence |
|---|---|---|
| 48021 county = honest absence (1 atom) | **PASS** | `plan-county-utility-easement.test.ts` + `constants.ts` |
| 48309 CAD present path | **PASS** | `cad-easement-fetch.ts` + route in constants |
| Bastrop municipal separate scope | **PASS** | `--scope=city-limits` required; county scope correctly absent |
| No fake geometry on absence counties | **PASS** | county-coverage atoms have `verifiedAbsence`, no polygon |
| **HOLD-4:** Live McLennan dry-run | **NOT EXECUTED** | ArcGIS fetch needs network + limit probe before apply PR |
| **HOLD-5:** County constants hardcoded | **ACCEPTED DEVIATION** | Same as footprint; registry follow-on |

## Verdict

**BUILD may proceed to split PRs.** No statewide `--apply`. Live dry-runs on 48021 (footprint w/ fixture, easement county+city-limits) and 48309 (easement limit=100) required before merge. Holds 1–5 are run-stage or verification gaps, not pattern violations.

## Split PR plan

| PR | Branch | Scope |
|---|---|---|
| Footprint | `feat/d2-building-footprint-writer` | atoms seam + engine-core building-footprint/* + script only |
| Easement | `feat/d2-utility-easement-writer` | atoms seam + engine-core utility-easement/* + script only |

Do not combine; easement branch currently also carries footprint untracked files — strip before push.
