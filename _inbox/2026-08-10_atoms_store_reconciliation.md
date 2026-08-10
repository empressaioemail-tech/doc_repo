---
id: 2026-08-10_atoms_store_reconciliation
title: Atoms store reconciliation — what the 10.9M atoms are, what reads cost, and the zoning/geometry inversion
date: 2026-08-10
status: complete
owner: planner
memory_graded: pending
related:
  [
    90_operations/OPS-13_store_topology,
    _sessions/2026-08-10_five_rails_and_write_throughput_claude_code,
  ]
---

# Atoms store reconciliation

Planner-run, read-only, no dispatch. Answers two of the three ranked reconciliation targets directly and turns up a finding neither question anticipated.

## 1. What the 10.9M atoms actually are

Live inventory of `hauska_mcp.atoms`, 2026-08-10:

| entity_type | count | body size | avg | newest |
|---|---:|---:|---:|---|
| zoning-fact | **4,606,757** | **6,317 MB** | 1,438 B | 2026-08-06 |
| parcel-node | 3,972,570 | 3,781 MB | 998 B | 2026-08-10 |
| buildable-envelope | 1,478,708 | 1,707 MB | 1,210 B | 2026-08-09 |
| setback-rule | 778,676 | 892 MB | 1,201 B | 2026-08-09 |
| code-section | 28,567 | 39 MB | 1,443 B | 2026-08-05 |
| property-boundary-edge | 26,846 | 39 MB | 1,521 B | 2026-08-09 |
| road-node | 25,078 | 52 MB | 2,183 B | 2026-08-04 |
| code-cross-reference | 8,105 | 7.8 MB | 990 B | 2026-08-05 |
| parcel-terrain-model | 61 | 116 kB | — | 2026-08-10 |
| code-edition | 58 | 187 kB | — | 2026-08-05 |
| cad-parcel-roll | 50 | 67 kB | — | 2026-08-09 |
| land-use-fact | 50 | 40 kB | — | 2026-08-09 |
| flood-hazard-fact | 49 | 41 kB | — | 2026-08-09 |
| jurisdiction-corpus | 43 | 29 kB | — | 2026-08-05 |
| code-amendment | 10 | 6.5 kB | — | 2026-07-30 |
| **TOTAL** | **10,925,628** | | | |

**Verdict on the "dead weight" hypothesis: NO.** Four types account for 99.9% of rows and all four are actively served (zoning-fact, parcel-node, buildable-envelope, setback-rule are exactly the chain `get_property_atom_chain` returns). Nothing here is orphaned storage. Retired rows are negligible: 3 zoning-facts, 1 parcel-node, 723 boundary-edges.

The bottom eleven types total **89,067 rows / 0.8% of the store**. Cheap to keep; not worth a cleanup lane.

## 2. Read-path cost — measured, and it is fine

The customer-facing question ("what does a PE parcel click cost at 10.9M atoms?") had never been measured. It is healthy:

| Parcel | Kind | Latency |
|---|---|---|
| 48021:34137 | Bastrop, certified, full warm chain | 1.71 s cold, then **0.63 / 0.71 s** |
| 48121:145609 | Denton, fabric-only (CAD base facts, no warm chain) | **0.51 / 0.47 s** |

Sub-second warm on both shapes. **There is no read crisis at this table size**, and the 20 GB table is not degrading the product. This closes reconciliation target #2 without a dispatch.

Note the asymmetry worth remembering: the SERVING read is fine because it looks up ONE parcel by an indexed path. The sweep's write-then-verify was slow because it looked up 500 scattered parcels at once, which no index serves profitably. Same table, same size, opposite outcomes — the query SHAPE decided it, not the row count.

## 3. THE FINDING NEITHER QUESTION ASKED FOR — zoning and geometry are inverted

zoning-fact is the LARGEST type (4.6M rows, 6.3 GB) and exceeds parcel-node by 634,187. Chasing that gap produced the real result:

```
counties with zoning-fact  : 19
counties with parcel-node  : 168
BOTH                       : 5
zoning WITHOUT parcel-node : 0
```

**Only FIVE counties have both.** 4.6M zoning-facts sit in 19 counties (Bexar 703k, Dallas 694k, Tarrant 690k, Collin 387k, Travis 381k, Denton 352k, Williamson 283k...) — the metros. 168 counties have parcel-nodes. The overlap is five.

Why: the zoning breadth-bake ran metro-first; the parcel-node sweep runs smallest-first and has not reached the metro tail yet. So the two largest atom families are almost disjoint by county.

**Consequences that matter:**

1. **The metro zoning work is already done.** When the sweep reaches Bexar / Dallas / Tarrant / Travis / Collin — the remaining tail — those counties gain parcel-nodes and immediately have zoning-facts waiting. Those five counties alone hold ~2.9M zoning-facts. The manifest should jump when the tail lands, more than the county count suggests.
2. **`zoning-fact` carries NO `countyFips` field** while `parcel-node` does. County must be parsed out of `parcelNodeId` (`48029:741437`). That is a schema asymmetry across two families in the same store, and it silently produced `fips = null` for all 4.6M rows on the obvious grouping query. Any future cross-family join or scorer must split the composite key, not read a column. Worth normalizing when a contract revision next touches zoning-fact.
3. **No duplicates.** 4,606,754 distinct `parcelNodeId` across 4,606,757 rows — the stamp is clean.

## 4. Ranked target #1 (index audit) — still dispatched, and now better informed

The IDX brief remains out. This reconciliation sharpens it: `atoms_section_number_idx` (106 MB) and `atoms_jurisdiction_idx` (100 MB) are maintained on every insert, and the inventory shows `code-section` — the only family that populates `section_number` meaningfully — is **28,567 rows, 0.26% of the store**. An index maintained across 10.9M rows to serve 28.5k is exactly the partial-index candidate the brief predicts.

## 5. What this closes and what it opens

**CLOSED:** target #2 (read path, healthy) and target #3 (store inventory, not dead weight).

**OPENED:** the zoning/geometry county inversion, which is a scheduling insight rather than a defect — and a concrete prediction: the manifest gains disproportionately when the metro tail lands, because the zoning half is already sitting there.
