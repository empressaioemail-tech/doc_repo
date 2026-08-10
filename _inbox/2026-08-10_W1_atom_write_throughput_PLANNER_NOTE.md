---
id: 2026-08-10_W1_atom_write_throughput_PLANNER_NOTE
title: Planner verification of W1 atom write throughput — the 63x headline is 16x in production
date: 2026-08-10
status: accepted with corrected headline
---

# W1 throughput — accepted, headline corrected

The work is sound and the differential proof is real. One number in the close artifact is measured in the wrong environment, and it matters for national planning.

## The tell the close report recorded but did not explain

The artifact contains both of these and never reconciles them:

| Path | Rate |
|---|---|
| Legacy oracle, 8,000-atom benchmark, THROWAWAY schema | **182 atoms/sec** |
| Same legacy code, planner-measured across 97 production counties | **47 atoms/sec** |

Identical code, **3.9x apart**. The benchmark environment is faster than production, so every number measured in it is optimistic — including the new path's 2,961.

## Why: the live atoms table is not the benchmark table

Planner query against `hauska_mcp` 2026-08-10:

```
rows:  10,656,683
size:  20 GB total (17 GB heap, 2,550 MB indexes)
indexes: 9
  atoms_pkey                       1107 MB
  atoms_entity_composite_unique     869 MB
  atoms_property_parcel_node_idx    267 MB
  atoms_section_number_idx          106 MB
  atoms_jurisdiction_idx            100 MB
  atoms_entity_type_idx              99 MB
  atoms_road_node_id_idx           1136 kB
  atoms_boundary_parcel_node_idx    848 kB
  atoms_road_county_fips_idx        200 kB
triggers: none
```

Every INSERT maintains **nine indexes**. The benchmark's throwaway schema does not carry that cost at 8,000 rows. This is the entire 3.9x.

## Corrected expectation

Applying the measured 47/182 penalty to the new path's 2,961:

**~765 atoms/sec in production — a 16x improvement, not 63x.**

| Workload | today (47/s) | corrected (765/s) |
|---|---|---|
| TX remainder, 8.4M features | 49.6 h | **3.1 h** |
| 150M US parcels | ~1.2 months | **~2.3 days** |

16x is an excellent result and it changes the national picture completely. The correction is not a criticism of the change; it is a correction of the number we would otherwise plan fifty states against.

## MOLD THIS — the general rule

**A write benchmark on an empty table measures the code. A write benchmark on the production table measures the system.** Index maintenance, page splits, and autovacuum pressure scale with table size and index count, and none of them exist at 8,000 rows. Any future throughput claim must either run against a table of representative size and index shape, or state the extrapolation explicitly with its penalty factor.

## Follow-up worth its own lane (NOT blocking this merge)

Nine indexes on the hot write path is itself a finding. `atoms_section_number_idx` (106 MB) and `atoms_jurisdiction_idx` (100 MB) are being maintained on every parcel-node insert though parcel-node atoms carry neither field meaningfully. An index audit — which of the nine earn their write cost, which could be partial indexes scoped by `entity_type` — is plausibly worth another large multiple on top of the 16x, and costs nothing but analysis.
