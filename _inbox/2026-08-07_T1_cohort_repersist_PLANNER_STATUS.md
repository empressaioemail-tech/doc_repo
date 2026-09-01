---
id: T1_cohort_repersist_planner_status
title: Cohort re-persist — planner status (2026-08-07)
status: in_progress
owner: nick
last_updated: 2026-08-07
related: [2026-08-07_envelope_saga_close_and_geometry_law, 2026-08-07_T1_cohort_repersist_roster_store]
---

# Cohort re-persist — planner status

**Heavy-scan slot:** HELD (T1). Not released until BOTH cohorts close.

**Engine pipeline:** main @ `a1989d0` (PRs #266–#275) + merged #276 (Elgin `--force-overwrite` parity).

## Store-truth roster (2026-08-07T22:57Z)

| Cohort | Count | Artifact |
|--------|------:|----------|
| FIPS 48021 total promoted | 4,003 | `_inbox/2026-08-07_T1_cohort_repersist_roster_store.json` |
| Bastrop city (non-Elgin) | 2,026 | same |
| Elgin | 1,977 | same |
| Operator twelve in roster | 12/12 | write-then-verify idempotent |

## Bastrop city cohort

| Leg | Status | Key numbers |
|-----|--------|-------------|
| block13 pre | **7/7** | `_inbox/2026-08-07_T1_block13_pre_cohort_repersist_v2.json` @ a1989d0 |
| Dry-run | **DONE** @ a1989d0 | verifyPass **2438** — `_inbox/2026-08-07_T1_bastrop_cohort_dryrun_summary.json` |
| Apply | **ABORT** | verifyPass **1670** ≠ 2438; pair **VOID**; partial writes (1670 promote + 3746 honestDeclines). See `_inbox/2026-08-07_T1_bastrop_cohort_apply_ABORT.md` |
| block13 post | **7/7** | regression held — does not override dry/apply fail |
| Recovery | **QUEUED** | fresh store query + single-process dry/apply @ same SHA |
| Post-verify (partial) | recorded | harness 12/12; block13 7/7; plain-geom **FAIL** (0/12 twelve); warden **23** findings (v1.3 blocked `situs_addr`); see ABORT doc |

Dry-run buckets (verifyFail / early decline):

| Bucket | Count |
|--------|------:|
| no-setback-row | 1,947 |
| r32-per-edge-inset | 287 |
| front-orientation | 437 |
| null-inset | 218 |
| faces-answer | 197 |
| no-road-adjacency | 116 |
| front-orientation-unresolved | 61 |
| superseded-prop-id | 84 |

PARCEL-RING-SOURCE-DIVERGENCE: **200** observations filed (R15 candidates; includes operator twelve — expected, BCAD vs txgio report-only).

## Elgin city cohort

| Leg | Status |
|-----|--------|
| Blocker | **CLEARED** — PR [#276](https://github.com/empressaioemail-tech/hauska-engine/pull/276) merged (`c0ba200`) |
| Dry-run | queued after Bastrop apply closes |
| Apply | queued (~1,977 store roster) |

## Gates outstanding

- [ ] Bastrop apply dry/apply exact-match
- [ ] Bastrop post-verify pack + render sample
- [ ] Elgin dry/apply @ main post-#276
- [ ] Elgin post-verify pack + render sample
- [ ] Slot release to master planner (T3 footprint pilot next)
