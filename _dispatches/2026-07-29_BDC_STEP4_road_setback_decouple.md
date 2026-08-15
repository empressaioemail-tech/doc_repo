---
id: 2026-07-29_BDC_STEP4_road_setback_decouple
title: Dispatch — STEP 4 decouple roads from setback VALUES (keep twin)
date: 2026-07-29
status: dispatched
repo: hauska-engine
wdll: 2026-07-29_BASTROP_BDC_setback_correction_WDLL
wdll_items: [7]
depends_on: [STEP 3 for Bastrop table shape; Caldwell blast radius named]
---

# STEP 4 — road twin stays; road-class setback VALUES die

## STANDING DECISIONS
- Cotality extinguished; no Regrid ever; public-record adapters only.
- No privileged/relationship data; SmartCity READ-ONLY, no-touch.
- Deploys planner-owned; code-done ≠ customer-done; LIVE serving revision.
- Standing decisions travel. CTX HELD until certification passes.

## WDLL item: 7

## Do
1. Retire `roadClassSetbackTable` as a setback-VALUE source in:
   - `packages/engine-core/src/depth-warm/warm-compute.ts` (`buildFlatSetbackFallback`, `resolveInsetFeetForEdge`)
   - `packages/engine-core/src/boundary-primitive/compute.ts` (if it resolves setback values via road class)
   - `packages/engine-core/src/depth-warm/verify-mechanical.ts`
   - `resolve-road-class-setback.ts` consumers — prefer flat district table / adapter row for the NUMBER; road class may still inform edge ROLE only.
2. KILL hard-coded `front:15` fallback in `buildFlatSetbackFallback` (~line 71) — legacy B3 artifact; must not serve wrong SF-1 fronts.
3. BLAST RADIUS: Caldwell shares descriptor path (`caldwell_tx_descriptor.json` has roadClassSetbackTable). Do not break Caldwell — migrate it to flat setbackTable as the value source (or honest-decline where no flat row). Name Caldwell in PR. Keep road twin (centerline/ROW/class for frontage + rendering).
4. Tests: Bastrop SF-1 front=30 without road-class override; Caldwell descriptor tests green; front EDGE labeling still works.
5. Open PR. Do NOT deploy. Do NOT self-grade LIVE.

## Ruling cite
`_decisions/2026-07-29_setback_authoritative_source_and_road_decouple.md` RULING 2 + AMENDMENT.
