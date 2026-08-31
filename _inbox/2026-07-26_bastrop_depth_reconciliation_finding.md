---
id: 2026-07-26_bastrop_depth_reconciliation_finding
title: Finding — Bastrop depth reconciliation (CC 9.27% vs agent 64%) + residual + 1009 Chestnut
status: finding
date: 2026-07-26
planner: depth-engine planning agent
governs: 27c WDLL 7 / Central-TX greenlight gate
read_only: true
---

# Bastrop depth diagnostic (read-only)

Scratch read first. No promote. No executor dispatch. All counts from live Neon `hauska-prod-497015` / `DATABASE_URL` unless noted.

---

## QUESTION A — Reconcile the two depth numbers

### A1. True live depth-warm count (verbatim)

```
 depth_warm_promoted
---------------------
                2345
```

```sql
SELECT count(*)::int AS depth_warm_promoted
FROM atoms
WHERE entity_type = 'buildable-envelope'
  AND body->>'parcelNodeId' LIKE '48021:%'
  AND body->>'depthWarmPromotion' = 'depth-warm-promoted-v1';
```

Place-type cross-check (all 2345 sit on P-1..P-5):

```
 zoning_with_district | zoning_place_type | depth_warm | depth_warm_on_place_type
----------------------+-------------------+------------+--------------------------
                 5769 |              3657 |       2345 |                     2345
```

### A2. Why console 9.27% / 5726 disagrees with agent 64% / 2345

**Verdict: (a) + (b) + (c). Not (d).**

| Candidate | Ruled | Evidence |
|-----------|-------|----------|
| (a) stale console artifact vs live | **IN** | Banner admits STALE. Artifact `generatedAt=2026-07-25T10:49:52.830Z` (pre-R4 warm). NodeGraph fetches `/stats/central-tx-node-graph` **without** `Authorization`; unauthenticated call is **401**. UI falls back to `/central_tx_node_graph_tally.json`. With Bearer, live retrieval returns **200** and Bastrop setback/envelope **5729** (not 5726). |
| (b) different denominators | **IN** | CC `%` column is `zoning_present_pct` = 5769/62257 = **9.27%** (breadth zoning), not depth. Agent 64.12% = 2345/3657 place-type. Agent 40.65% = 2345/5769 zoning-with-district. |
| (c) different numerators | **IN** | CC Setback/Envelope/Full-chain count **any** `setback-rule` / `buildable-envelope` atom present (ledger SQL `bool_or(entity_type=…)`). Live that is **5729**. Depth-warm marker is a subset: **2345**. Of 5729 envelopes: 2345 depth-warm + geojson; **3384** have no `depthWarmPromotion` (pre-warm bake atoms). |
| (d) live ledger vs promote path count the same thing differently | **OUT** | Same Neon. Ledger-shaped live SELECT matches auth retrieval. Depth-warm is an additive marker the CC columns never filter on. |

Live ledger-shaped SELECT (same shape as `central-tx-tally.ts`):

```
 nodes | zoning_present | setback_present | envelope_present | full_chain_nodes | depth_warm_nodes | zoning_present_pct | depth_warm_pct_of_zoning | depth_warm_pct_of_nodes
-------+----------------+-----------------+------------------+------------------+------------------+--------------------+--------------------------+-------------------------
 62257 |           5769 |            5729 |             5729 |             5729 |             2345 |               9.27 |                    40.65 |                    3.77
```

Authenticated live retrieval (2026-07-26T12:28:35Z):

```json
{"fips":"48021","county":"Bastrop","nodes":62257,"zoning_present":5769,"setback_present":5729,"envelope_present":5729,"full_chain_nodes":5729,"zoning_present_pct":9.27,"full_chain_pct":9.2}
```

Envelope marker breakdown:

```
  n   | depth_warm | no_depth_warm_marker | outcome_buildable | has_geojson
------+------------+----------------------+-------------------+-------------
 5729 |       2345 |                 3384 |              3905 |        2345
```

### A3. The ONE honest number to quote

For **27c depth** (warm digital twin):

**2,345 depth-warm-promoted envelopes / 3,657 place-type zoning-facts = 64.12%**  
(alternate: **40.65%** of 5,769 zoning-with-district; **3.77%** of 62,257 nodes).

For **breadth zoning** (what the CC `%` column actually shows): **5,769 / 62,257 = 9.27%**.

The CC ledger is **currently STALE in the UI** (unauthenticated live fetch → artifact from 2026-07-25). Even when live, its Setback/Envelope columns are **not** depth-warm; quoting them as depth is wrong. G1: the depth number that isn’t a live `depthWarmPromotion='depth-warm-promoted-v1'` SELECT does not exist.

---

## QUESTION B — Residual unwarmed place-type (~1312)

### B0. Residual size (verbatim)

```
 place_type_n | warmed | residual_unwarmed
--------------+--------+-------------------
         3657 |   2345 |              1312
```

By place type: P-1=1, P-2=115, P-3=933, P-4=114, P-5=149.

### B1–B2. Live re-classify of all 1312 (read-only warm path, no promote)

Roads loaded: 4894. Classifier: `labelEdgesFromRoads` + `computeWarmCandidate` on main (`dbb1f81`).

```
no-road-adjacency:           110
verifyFail-geometry-empty:   807   (all emptyReason = "setbacks exceed the lot — no buildable area remains")
would-promote (missed):      395
no-geometry:                   0
────────────────────────────────
total:                      1312
```

So the R4.4 shorthand “honest geometry-empty + no-road-adjacency” understates: **~30% of the residual (395) would promote today** on the current warm path (batch miss / cohort ordering / prior verify state — not re-promoted here).

### B3. Geometry-empty sample (n=12) — honest-irregular vs R0-leak class

All 12 share emptyReason `setbacks exceed the lot — no buildable area remains`.

| Class | Count in sample | Specimens |
|-------|----------------:|-----------|
| Honest-irregular / survey-artifact / sliver | 9 | e.g. 103387 (7-edge, minEdge 8.9'), 104127 (16-edge, min 2.3'), 109905 (min 0.06'), 127129 (alley-only 5') |
| Suspicious handleable (near-rect / simple) | 3 | **105054** (4-edge ~101×134', front-only 15' empty), 108569 (5-edge), plus related |

**Split in sample: 9 honest-decline-like / 3 R0-leak-suspect on depth-warm.** Population of 807 is not fully shape-tallied; the specimen below proves the leak class exists on a clean rectangle for the **site-plan** path, and sample 105054 shows depth-warm can also empty a near-rect with front-only 15'.

### B4. NAMED SPECIMEN — 48021:34785 (1009 Chestnut St)

**Live atom state:** zoning P-5; buildable-envelope exists with `outcome=buildable` but **no** `depthWarmPromotion`, **no** geojson (pre-warm bake atom).

**Lot geometry (txgio):** near-rectangular, 4 edges, area 16111 sqft, edges ≈ 98' / 163.5' / 98.3' / 164.9'.

**Depth-warm path (main): SUCCEEDS**

- Edge labels: front=edge 3 (`unclassified`), sides/rear honest 0 (not_specified axes).
- `insetFeet=[0,0,0,15]`, buildableAreaSqFt ≈ **13641**, `empty=false`.
- Code: `depth-warm/edgeLabeling.ts` → `warm-compute.ts` → `depth-warm/geometry.ts` `insetPerEdge` (polygon-clipping strip→union→difference).

**Site-plan path: FAILS with the exact operator string**

```
setback-consumes-lot: inward offset collapsed or inverted (no honest buildable margin to draw)
```

Even with honest inputs `{front:15, side:0, rear:0}`, `frontEdgeIndex=3`, `notSpecified={side,rear,sideCorner:true}`:

- `computeSetbackOffset` → `degenerate=true`, basis `front-edge-hint`.
- Same failure with geometric heuristic (no hint).
- **Uniform `{15,15,15}` succeeds** (has offset ring).

Code path: `site-plan/site-model.ts` `composeSitePlanModel` → `site-plan/ring-geometry.ts` `computeSetbackOffset` (naive edge-translate-and-intersect + `anyVertexEscapesOriginal` degeneracy check at ~L241–248). This is **not** the R0 polygon-clipping path; site-plan never got the R0 library upgrade.

**Root-cause class for 1009 Chestnut site-plan decline:**

| Hypothesis | Result |
|------------|--------|
| Offset math failing (R0 leak) | **YES — on site-plan path** (asymmetric front-only inset collapses naive miter; depth-warm polygon-clipping OK) |
| Edge-labeling wrong/all-edges front | **NO** — single front @ 15'; sides/rear 0 |
| not_specified-axis bug | **NO** — 0 inset on silent axes; failure reproduces with explicit notSpecified |
| txgio ring quality | **NO** — clean 98×165 rectangle |

---

## Recommendation (Central-TX gate)

1. **Quote depth as 2345 / 3657 = 64.12% place-type** (live). Do not quote CC 9.27% as depth; that is zoning breadth, and the UI is stale until NodeGraph sends the retrieval Bearer (or the route is public).
2. **Residual is mixed — fix-first for the R0 leak class, not a pure accept-the-ceiling.**
   - **110** no-road-adjacency: accept-ceiling until county/road widen (honest).
   - **807** geometry-empty: mostly “setbacks exceed lot”; sample shows both honest irregular **and** near-rect failures → **fix-first** before treating 36% as honest ceiling (depth-warm empty on some near-rects; site-plan R0 leak on asymmetric insets including 1009 Chestnut).
   - **395** would-promote now: batch re-pass (no new science) would lift place-type depth toward ~**74.9%** (2345+395)/3657 — still not a greenlight by itself.
3. **Central-TX:** still **hold eager full-metro**. Place-type-only remains the only candidate path, and only after (i) CC live auth so operators see truth, (ii) site-plan offset brought onto polygon-clipping / shared inset with depth-warm (1009 Chestnut class), (iii) residual near-rect depth-warm empties diagnosed/fixed or honestly capped with evidence.

---

## Artifacts

- Read-only classifier run logged under session; temporary script `packages/engine-core/scripts/_diag-r4-residual-readonly.mjs` used for B (delete after close if undesired on engine tree).
- CC artifact path: `hauska-map/apps/command-center/public/central_tx_node_graph_tally.json`.
