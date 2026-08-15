---
id: 2026-07-30_BDC_CLOSE_CLASS_R13_R15
title: BDC downtown — close the class (R13/R14/R15)
date: 2026-07-30
owner: planner
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
items: [R11, R12, R13, R14, R15, R6]
status: closed-verified-rendered-set
---

# Close the class — rendered-set cert + repealed fallback removal

## Standing decisions

- Cotality extinguished / no Regrid / public-record only
- NO privileged data — uniform public endpoints only
- SmartCity READ-ONLY reference
- Deploys planner-owned
- Code-done ≠ customer-done — traffic-shifted revision + **RENDERED-SET** sweep + operator live-QA (R6)
- CTX/national HELD until rendered-set pass + operator re-QA

## Fix 1 — R13 repealed fallback removed (fail-closed)

- `getSetbackTableForZoning`: Bastrop city BDC districts return null without layer-23 per-parcel record (no chart/descriptor fallback)
- `bake-from-tier1-snapshot`: skips setback emit for Bastrop city (layer-23 warm only)
- `packages/adapters/.../bastrop-setback-currency.ts`: stale detector
- `retrieval-api` atom-chain: filters stale setback-rule for Bastrop city zoning
- PE `atom-chain-to-facets.ts`: R13 defense-in-depth + honest-decline copy

## Fix 2 — R14 rendered-set sweep

- `scripts/bastrop-downtown-area-sweep.mjs`: cert scope = BCAD bbox query (PE live-GIS path), not manifest alone
- Assertions (h) R13, (i) R14; R10 exempts honest pending-re-warm declines

## Fix 3 — R15 re-plat completeness + unswept parcels

- Added **8741973** (Pecan Place Lot 2); superseded block now `{8741972,8741973,8741974}`
- Added **8723767** to seed manifest (was silently excluded)
- Stamped + warmed **8741973** ✅
- **8723767**: split-zoned GC+SF-1; warm verify fails (null inset — geometry); R13 deploy → honest-decline on PE until geometry resolved

## Blast radius (flagged, not this pass)

Removing R13 fallback makes county-wide missed parcels fail-closed (~10k+ nodes in 48021). County-wide re-warm is follow-on (all-Bastrop expansion).

## Deploy required — DONE 2026-07-30

1. `hauska-retrieval-api` (R13 atom-chain filter) — `00045-yek` @100%
2. PE Vercel prod — `dpl_GcK3dcbqgS5GXG1QrC3o75pgp51M` @ `property-explorer-xi.vercel.app`
3. Rendered-set sweep **36/36 PASS** (2026-07-30) — audit `_inbox/2026-07-30_BASTROP_DOWNTOWN_DRILL_area_sweep_audit.md`
4. **Operator R6 live block-QA owed** (click non-obvious / successor / split-zoned parcels including 8723767, 8741973)
