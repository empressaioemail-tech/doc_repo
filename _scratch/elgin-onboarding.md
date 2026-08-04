# elgin-onboarding scratch

## GROUND-TRUTH 2026-08-04T~12:25Z
STEP1 Tier-1 bake WRITE on 48021 COMPLETE.
- Elgin tier1 zoning facets: 3762 (from 3798 stamped; collision-explained)
- Bastrop city tier1: 5773 unchanged
- Apply: parcels 63357, promoted upgrade 63232, kept mono 125, zoning 9620, 82.2s
- Artifact: _inbox/2026-08-04_elgin_step1_tier1_rebake.md

## LESSON
Tier-1 counts by place_key (prop_id), stamp counts by feature_index — multi-geometry + prop_id=0 collisions make them diverge; always explain the delta before treating as miss.

## OPEN
STEP2 engine zoning-fact bake + code-ref map-key fix
STEP3 re-gate
STEP4 warm+cert

## GROUND-TRUTH 2026-08-04 STEP2
PR #226 merged 5ad7755. Bake apply: zoningPresent 9535 / setback+envelope 3762 / emitErrors 0.
Stale Elgin cascade 0. Cascade remaining 52726. REASON-OVERSTATES Elgin CLEARED.
