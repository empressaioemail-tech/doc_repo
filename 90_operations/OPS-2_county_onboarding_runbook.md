---
id: OPS-2_county_onboarding_runbook
title: OPS-2 — County Onboarding Runbook (the deterministic loop: raw sources → certified served parcels)
date: 2026-08-02
status: operations doc (the repeatable mechanical procedure; Bastrop-city is its first proof)
owner: nick
related: [OPS-1_texas_source_registry, OPS-3_engine_contract_determinism_register, OPS-5_cert_standard, 2026-08-02_bastrop_recipe_ACCEPTED]
layer: L-SOURCE → L-ENGINE → L-LEDGER
closes_gaps: [6 R7-primitive-bake]
---

# OPS-2 — County Onboarding Runbook

## WHAT THIS IS
The deterministic, repeatable procedure to bring ONE jurisdiction from raw public sources to certified, served parcels — honoring the accepted recipe (`2026-08-02_bastrop_recipe_ACCEPTED`). This is the factory production line. Bastrop city (minus quarantined Block-13) is its FIRST proof (R-FND-1).

## THE LINE (stages; each stage's output feeds the next; agents OPERATE, machinery TRANSFORMS)

### STAGE 0 — REGISTRY AUTHORING (prep, agent-authored → frozen; per OPS-1)
Author the jurisdiction's registry row: Rail C source (TxGIO staged bulk zip, or county-ArcGIS override where fresher per OPS-1 freshness flags), Rail A source (per-parcel dimensional record + adopted code + currency/repeal), Rail B CAD, join_key + owner_match, conflict-register, currency-register. Adversarial review → FREEZE + commit. Bastrop row: TxGIO 48021 (staged) + layer-23 per-parcel record + BDC edition + B3-repealed currency row. OUTPUT: a frozen registry row the engine reads.

### STAGE 1 — ACQUIRE (staged, vintaged; NOT the warm — per OPS-3 I3)
Pull the frozen sources into a staged, vintaged snapshot: TxGIO parcel zip (browser-UA, per-county, WGS84), county-ArcGIS override where fresher, CAD roll, address points, road (OSM+county). Record the vintage. This is the ACQUISITION step — the only live-network step. Warm reads the staged snapshot, never live. OUTPUT: staged vintaged source snapshot.

### STAGE 2 — PARCEL-CURRENCY + JOIN (R9/R15, owner-match firewall)
For each parcel: confirm prop_id still exists in the current cadastral (R9); re-plats enumerate ALL successors (R15). Join Rail C geometry ↔ Rail B CAD via join_key (prop_id, or geo_id/address-crosswalk for the 8 high-bad-id counties per OPS-1) — GATED by owner-match (R9 firewall: a value is recorded only after owner agreement). Bastrop: prop_id bad-rate 0.0022 (clean) — prop_id join fine. OUTPUT: currency-checked, owner-matched parcel set.

### STAGE 3 — WARM (mechanical; setback-rule atom)
Deterministically over the staged snapshot: fetch per-parcel record (R1); map district from live zoning layer / dominant row (R26 split-zone); resolve setback numbers from the per-parcel record (R1, not ordinance); interior/corner-side distinct (R2); district-default-for-role on unmapped-but-known-role (R7); GC/MU from record (R8); fire-code-defer→5' (R22); alley role (R23); conflict-disclose layer-83 (R25); currency gate blocks repealed (R13). OUTPUT: setback-rule atom (+ recipe-version, OPS-4).
GAP #6 CLOSE (R7 at bake): every warmed parcel MUST run the R28/R30 re-warm path (recompute boundary primitive against the ring + re-derive edge roles) so the primitive-bake unmapped-adjacency decline (compute.ts:104) never strands a city parcel. Mandate the re-warm path for all onboarding warms until R7 is closed at bake.

### STAGE 4 — INSET (mechanical; buildable-envelope atom)
BCAD rings trusted, no scrub (A5); recompute primitive on ring-swap + winding invariant (R28); edge-role re-derive to frontage (R30); inset per-edge (R0); conditional convexity gate (R29); invalidate stale envelope on source-repeal (R27). OUTPUT: buildable-envelope atom (+ recipe-version).

### STAGE 5 — PROMOTE (mechanical; to the served ledger)
Warm → verify → promote: verify persisted == recompute (R10); promote to the served ledger; record in county_facet_coverage (OPS-4/6 performance fields). Customer reads the promoted ledger, not cold re-derive. OUTPUT: served atoms + ledger row.

### STAGE 6 — CERT (mechanical + operator R6; per OPS-5)
Area-sweep the FULL browsable extent (R17 — the whole city for a city, not a bbox/list); grade drawn envelope in feet by engine-frame R32 + per-edge orientation R31 + district + numbers (the 4 gates); three-way convergence R20; full field parity R24; parcel-currency R9. Then OPERATOR R6 live QA in CC (R6). BOTH required. OUTPUT: cert pass/fail; on fail → fix root cause, re-sweep whole area (never sample).

## THE OPERATOR'S JOB (per stage — the factory-operator model, OPS-3)
Watch each stage's mechanical run; troubleshoot failures (a stuck warm, a null-ring, a decline); reason through sticky parts (a novel conflict, a re-plat) → capture in scratch → freeze to a registry/currency row before it counts; report to the performance ledger; optimize throughput (cohort batching R4.1 — geographic not lexical). No operator writes an atom by hand.

## BASTROP CITY — THE FIRST RUN (R-FND-1)
- Roster: layer-23 CITY='BASTROP' = ~6,972 parcels (Phase 1 finding). MINUS quarantined Block-13 (7). Warmable-scalar ≈ 4,877 (6,972 − 1,978 PDD honest-decline − 117 null).
- Parallel unit: DISTRICT BLOCKS (SF-1 → GC → MU → RR → PI → IND), each area-swept whole, operator R6 per block before next.
- PDD (28%) + null → graceful honest-decline (S-10 accepted), not cert failures.
- Prerequisites before city warm (from OPS-5/recipe): merge cert script to main; extend cert harness to the city roster; re-measure warm cost on a 150-parcel city cohort (R4 path: --city-cohort, --force-repromote, DATABASE_URL+TXGIO_DATABASE_URL, PROPERTY_ATOM_PATH=1).

## COST GATE (commitment #3: <$200 + <1hr human review per jurisdiction)
R4 measured: ~$0.34 compute + ~8.6 wall-hours for 6,972 Bastrop parcels (single-thread) — CLEARS the $200 gate by orders of magnitude. Re-measure with BDC --force-repromote + layer-23 fetch overhead on a 150-parcel cohort before the full run. Human review = operator R6 per district block.

## THE PROOF THIS RUNBOOK IS CORRECT
Bastrop city runs this line end to end and produces a certified city (mechanical sweep + operator R6). If it does, the runbook is the fan's production line — replicated per county via each county's frozen registry row. If a stage hits a wall the recipe can't clear, THAT is the rebuild trigger with the tightest failing test.
