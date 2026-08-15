---
id: 2026-07-29_BDC_STEP2_zoning_stamp_zoned_parcels
title: Dispatch — STEP 2 zoning stamp → Zoned_Parcels/83 (LDT)
date: 2026-07-29
status: dispatched
repo: legacy-design-tools
wdll: 2026-07-29_BASTROP_BDC_setback_correction_WDLL
wdll_items: [6]
depends_on: [STEP 3 merged before STAMP RUN]
note: Config lives in LDT cad-ingest, NOT hauska-map (WDLL amendment).
---

# STEP 2 — stamp config + dry-run (STAMP RUN after Step 3)

## STANDING DECISIONS
- Cotality extinguished; no Regrid ever; public-record adapters only.
- No privileged/relationship data; SmartCity READ-ONLY, no-touch.
- Deploys planner-owned; code-done ≠ customer-done; LIVE serving revision.
- Standing decisions travel. CTX HELD until certification passes.

## WDLL item: 6

## Repo truth
`P:\legacy-design-tools\lib\cad-ingest\src\txgio\zoning-layers.ts` — `ZONING_LAYERS["bastrop-city-tx"]` currently:
- URL: Zoning_Place_Type/FeatureServer/0
- codeField: PlaceTypeClass
Repoint to LIVE Zoned_Parcels/FeatureServer/83, codeField ZoneType (SF-x). Stamp CLI + same DB; no Cloud Run redeploy for stamp itself.

## Do
1. Confirm live REST of Zoned_Parcels/83: ZoneType field, sample SF-1 including APN/prop near 1010 Jefferson.
2. Update bastrop-city-tx layerUrl + codeField (+ descriptionField if needed). Update comments (B3 Place Types are DEAD).
3. Confirm change does NOT alter other ZONING_LAYERS entries.
4. Dry-run stamp for Bastrop city parcels; report 1010 Jefferson / APN 105054 → SF-1.
5. Update any LDT tests that hardcode Zoning_Place_Type for Bastrop.
6. Open PR. **DO NOT run production stamp until planner confirms STEP 3 merged** (SF-x must route to BDC table). Do NOT self-grade LIVE PE.

## Out
- Setback numbers from GIS card (FORBIDDEN — CORRECTION A)
- Engine adapter work (STEP 3)
