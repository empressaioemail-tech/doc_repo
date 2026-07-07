---
id: 2026-07-07_legacy-design-tools_m1c_case-grain
title: M1-C — K2 edition-correct retrodiction + case-grain Measurement A/B
date: 2026-07-07
repo: legacy-design-tools
status: close
related: [m1-case-grain-recalibration, 05_measurement_spec, dispatch-E-wave4-edition-ingest]
---

# M1-C: K2 edition-correct retrodiction + case-grain Measurement A/B

**Mode:** GCS-backed (live fuel)

## Input provenance honesty

| Input | Provenance | Notes |
|---|---|---|
| lambda (edition-bump hazard) | **amendment-history** (jurisdiction x family grain) | 10 code-amendment atoms in corpus; computed from amendment effectiveDate range |
| q (query frequency) | **solved-for** (uniform) | F1 atom-grain attribution unavailable; only tool/finding-grain telemetry exists — fabricated weights disabled per 05 spec |
| a (adjudication rate) | **observed** (backtest) | Austin + San Antonio variance/BOA + local-evaluable permits; Bastrop excluded (~2 rows) |
| Consequence stratum | **unavailable** | F2 consequence metadata absent; all atoms stratum "II" (routine) — ICC ingest HELD |
| Match rate | **outcome-label heuristic** | Approval-rate proxy, not substrate-prediction comparison (K3 outcomeDisposition: issued-clean/with-condition/denied/withdrawn/unknown) |

## Austin

- Cases: 136,132 | match rate: 85.4%
- Corpus atoms: 2211
- Lambda: 0.339/yr (amendment-history)

### Slice earned fraction — adjudication-weighted

| Granularity | Slice earned (read+amendment) | Slice earned (read grain) | Corpus-uniform (read grain) |
|---|---:|---:|---:|
| whole-edition | **100.0%** | 100.0% | 3.5% |
| section-scoped | **100.0%** | 100.0% | 3.5% |
| section-plus-dependents | **100.0%** | 100.0% | 3.5% |

### Decision read

**INSUFFICIENT SLICE (n=1 adjudicated atoms < floor 3) — slice metric not decision-grade.** Citation-lineage attribution reached too few atoms for the slice fraction (100.0%) to mean anything. Corpus-uniform contextualizer: 3.5%. Un-adjudicated tail: 2210 atoms (100.0%) carry asserted-with-provenance. Match rate 85.4% (outcome-label heuristic). The bottleneck is deposit→atom lineage attribution, not earning arithmetic.

## San Antonio

- Cases: 0 | match rate: 0.0%
- Corpus atoms: 941
- Lambda: 0.400/yr (amendment-history)

### Slice earned fraction — adjudication-weighted

| Granularity | Slice earned (read+amendment) | Slice earned (read grain) | Corpus-uniform (read grain) |
|---|---:|---:|---:|
| whole-edition | **0.0%** | 0.0% | 0.0% |
| section-scoped | **0.0%** | 0.0% | 0.0% |
| section-plus-dependents | **0.0%** | 0.0% | 0.0% |

### Decision read

**INSUFFICIENT SLICE (n=0 adjudicated atoms < floor 3) — slice metric not decision-grade.** Citation-lineage attribution reached too few atoms for the slice fraction (0.0%) to mean anything. Corpus-uniform contextualizer: 0.0%. Un-adjudicated tail: 941 atoms (100.0%) carry asserted-with-provenance. Match rate 0.0% (outcome-label heuristic). The bottleneck is deposit→atom lineage attribution, not earning arithmetic.

## Measurement B — high-consequence slice (deferred slot)

| Field | Value |
|---|---|
| Status | **deferred** |
| Stratum | II-routine-only |
| W_actuation bar | 0.2 |
| High-consequence atoms identified | 0 |
| ICC fuel required | true |

ICC ingest HELD — no I-Code consequence stratification; all atoms treated as stratum "II" (routine). High-consequence slice (W_actuation=0.2) cannot earn until ICC fuel lands.

## Conditions A & B

**Condition A** (provenance honesty):

### Austin

| Provenance class | Count | Meaning |
|---|---:|---|
| earned-slice-own | 1 | own-earned at atom grain, cited |
| earned-slice-pooled | 0 | pooled-applied with adjudicated pool signal |
| adjudicated-not-earned | 0 | cited; width ≥ W_target or n<3 |
| asserted-tail | 2210 | zero adjudication; asserted prior only |

### San Antonio

| Provenance class | Count | Meaning |
|---|---:|---|
| earned-slice-own | 0 | own-earned at atom grain, cited |
| earned-slice-pooled | 0 | pooled-applied with adjudicated pool signal |
| adjudicated-not-earned | 0 | cited; width ≥ W_target or n<3 |
| asserted-tail | 941 | zero adjudication; asserted prior only |

**Condition B** (public partition only): Family pooling draws only `PUBLIC_PARTITION` (__public__) signal; tenant-private adjudications excluded.
