---
id: 2026-07-29_BDC_STEP7_mold_draft_checkin
title: Check-in — STEP 7 mold rewrite + 3 gates (draft; WDLL item 10)
date: 2026-07-29
status: draft-filed
wdll: 2026-07-29_BASTROP_BDC_setback_correction_WDLL
wdll_items: [10]
dispatch: 2026-07-29_BDC_STEP7_mold_gates_draft
related: [28_THE_BASTROP_MOLD_engine_build_spec, 2026-07-29_setback_authoritative_source_and_road_decouple]
---

# STEP 7 mold draft check-in

Executor draft against WDLL item 10. Planner owns item 11 (CERTIFIED-CLEAN) after LIVE verify. No CERTIFIED-CLEAN claim here. CTX remains HELD.

## File touched

`28_THE_BASTROP_MOLD_engine_build_spec.md` (`last_updated` → 2026-07-29)

## What changed

1. **PART 1a setback model replaced.** Retired `roadClassSetbackTable` / road-class prefer-fallback as setback VALUE source. New model: CURRENT adopted ordinance dimensional table (ordinance-text-true), ONE authoring source per jurisdiction, parcel→district from LIVE zoning GIS, cited to ordinance section that contains the number, road-DECOUPLED (front EDGE only), honest-decline on conditional/contextual standards. Kept `assumedRowWidthFt` for the road twin.

2. **PART 1b Zoning + Setbacks rows updated.** Bastrop stamp example → Zoned_Parcels/83 ZoneType (not abandoned PlaceType). Setbacks row matches the corrected model.

3. **PART 2 RULE gate (item 4) rewritten** to ordinance-text / road-decoupled / dual-fork-forbidden. ROAD gate note: roads identify front edge, not values.

4. **Three NEW mold gates (a)(b)(c)** added under PART 2 as prose that MUST become mechanical fail-closed (same class as phantom gates 7/8). Gate (a)/(c) explicitly scope out IBC thin editions and the 213k `storage-port-proof/phase-1a` placeholder cohort so fail-closed does not brick ~27.6% of corpus.

5. **PART 3 baked decisions:** CORRECTION A (GIS card ≠ numbers; Zoned_Parcels maps district only), CORRECTION C (honest-decline conditional), plus road-decouple and edition-currency (CORRECTION B) one-liners. Zoning-source bullet updated for live-layer stamp.

## Not done (by design)

- No CERTIFIED-CLEAN audit (WDLL 11, planner).
- No CTX flip.
- No commit (planner session-close).
- Gates (a)(b)(c) are draft-in-mold prose; mechanical implementation is engine follow-on.
