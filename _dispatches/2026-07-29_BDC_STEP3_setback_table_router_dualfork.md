---
id: 2026-07-29_BDC_STEP3_setback_table_router_dualfork
title: Dispatch — STEP 3 BDC setback table + router + kill dual-fork
date: 2026-07-29
status: dispatched
repo: hauska-engine
wdll: 2026-07-29_BASTROP_BDC_setback_correction_WDLL
wdll_items: [1, 2, 3]
---

# STEP 3 — FIRST (prerequisite for stamp RUN)

## STANDING DECISIONS (travel with this dispatch)
- Cotality extinguished; no Regrid ever; public-record adapters only.
- No privileged/relationship data; every source must work for a no-relationship jurisdiction. SmartCity is READ-ONLY, no-touch (reference only, never a data path).
- Deploys are planner-owned; code-done ≠ customer-done; verify against LIVE serving revision, not agent-said-done.
- Standing decisions travel in dispatches (M0-reach). CTX HELD until certification passes.

## WDLL items you own
1 (BDC table), 2 (router), 3 (dual-fork kill).

## Do
1. Create `packages/adapters/src/local/setbacks/bastrop-development-code.json` with ordinance-text rows ONLY:
   - SF-1: 30/10/20/30, height 35, impervious 50%, min-lot note 1/3 ac
   - SF-2: 25/7.5/15/20, 35, 50%, min-lot 7500sf
   - SF-3: 15/5/10/15, 35, 50%, min-lot 5000sf
   - RR: 50/20/20/50, 35, 50%, min-lot 1 ac
   - Cite Sec. 14.02.003 / Ord. 2026-06. CORRECTION A: numbers from ORDINANCE TEXT, not GIS card.
   - Do NOT invent scalars for MU/GC/PI/IND/P/OS/PDD (CORRECTION C — honest-decline via no row).
2. Wire import+entry in `packages/adapters/src/local/setbacks/index.ts`.
3. REWRITE `getSetbackTableForZoning` (~80-95): today only P-[1-5]/P-CS/P-EC/PDD → bastrop-city-tx, else legacy bastrop-tx. When stamp emits SF-x that SILENTLY hits wrong table. Route BDC Euclidean codes → bastrop-development-code.json. Decide explicitly what happens to repealed P-* (do not silently serve B3 as current).
4. Kill descriptor/adapter dual-fork: ONE authoritative setback source. Survivor = adapter BDC table for city Euclidean; rewire `bake-from-tier1-snapshot.ts` and `depth-warm-bastrop-batch.mjs` (descriptor import at :21) so both resolve the SAME numbers. Update `bastrop_tx_descriptor.json` setbackTable to BDC SF/RR rows OR make depth-warm call the adapter — pick one survivor, document in PR.
5. Unit tests for SF-1 routing + no fallthrough to bastrop-tx.json.
6. Open PR. Do NOT deploy. Do NOT self-grade LIVE.

## Out
- Stamp re-point (STEP 2 / LDT)
- Edition ingest (STEP 1)
- Road decouple (STEP 4)
- Re-warm (STEP 5)
