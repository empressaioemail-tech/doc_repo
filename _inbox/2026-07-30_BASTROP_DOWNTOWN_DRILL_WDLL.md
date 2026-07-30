---
id: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
title: WDLL — Bastrop downtown drill (cert revoked, four defects, area-sweep gate)
date: 2026-07-30
status: approved
owner: nick
operator_approval: 2026-07-30 (operator program dispatch)
related: [2026-07-29_setback_authoritative_source_and_road_decouple, 28_THE_BASTROP_MOLD_engine_build_spec, _catalog/bastrop_downtown_drill_test_area.json, _STATE]
purpose: Observable end state for fixing F1–F4 in ONE focused downtown test area, area-sweep re-cert every parcel, then expand. Supersedes parcel-sampling cert. CTX stays HELD.
---

# WDLL: Bastrop downtown drill

Date: 2026-07-30  Status: approved  
Operator approval: 2026-07-30 (this program dispatch)  
**Prior cert REVOKED:** `_inbox/2026-07-30_BASTROP_CERTIFIED_CLEAN_audit.md` status flipped 2026-07-30 per AMENDMENT 3.

## Done looks like

The 2026-07-30 CERTIFIED-CLEAN is **REVOKED**. In the defined downtown test area ONLY (`_catalog/bastrop_downtown_drill_test_area.json`), every parcel is on the **current** edition (no P-x/build-to), setback **numbers** match the city's authoritative **per-parcel** public record (`Parcels_One_Click/FeatureServer/23`), interior-side and corner-side are distinct on the PE card, MU/GC/PDD serve base dimensional values from that record (conditional axes honest-decline with reason), lot-line geometry is scrubbed so rectangular lots yield clean rectangular envelopes, and a planner **area-sweep** grades **every** parcel in the manifest against the live city record + geometry invariant on the **traffic-shifted** serving revision. Zero side-by-side regime splits in the area. All-Bastrop re-warm stays **out of scope** until area-sweep passes. Mold updated for per-parcel-record source, area-sweep cert, and envelope-geometry sanity gate.

## Mandatory sequence (deps)

0 → 1 → 2 ∥ 3 → 4 → 5 → 6 → 7. Step 1 (per-parcel source + sideInterior/sideCorner model) before Step 2 (MU/GC/PDD) and Step 4 (area promotion). Step 3 (geometry scrub) may run parallel with Step 2 after Step 0 manifest lands; Step 4 waits for 1–3. Planner owns deploy (5) and area-sweep (6). Executors never self-grade LIVE.

## Authoritative source (LIVE-confirmed 2026-07-30)

| Role | Endpoint | Notes |
|---|---|---|
| **NUMBER source (primary)** | `https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Parcels_One_Click/FeatureServer/23` | Layer `Parcel_OneClick_Join`. Public, no auth. SmartCity reference path (`smartcity-os/server/routes/esri.ts`). |
| District stamp (parcel→zone) | `Zoned_Parcels/FeatureServer/83` | Maps district ONLY; **not** setback numbers. |
| Ordination citation | `Ordinance_Link` on layer 23 | Per-parcel; cite on every setback atom. |
| Corner side | Parse from `SideSetback` text when pattern `(Corner Side Street Setback: N ft)`; else `CornerSideSetbacks` on layer 83 for GC/MU rows | `CornerSideSetback` field name in user spec = `CornerSideSetbacks` on 83; layer 23 uses text embed. |

Numeric fields on layer 23: `FrontSetback_`, `SideSetback_`, `RearSetback_`, `MaxBuildingHt`, `MinimumLotSize_`, `MaxImpervisionCoverage` (string %). Specimen: 1010 Jefferson (`105054`) → 25 / 5 (corner 15) / 25 — matches operator city screen; PE today serves ordinance-chart 30/10/20/30 (F4).

## Test area

Manifest: `_catalog/bastrop_downtown_drill_test_area.json`  
Envelope (WGS84): `-97.3175, 30.1105, -97.3155, 30.1125`  
Streets: Jefferson, Spring, Pecan, Hill, Chestnut, Pine (downtown block cluster).  
**36 unique parcels** (8723767 excluded as non-CAD prop_id). Districts present: SF-1, GC, MU. Evidence anchors in manifest `evidence_anchors`.

## Acceptance items

1. **Authoritative source adapter** | check: engine reads setback numbers from `Parcels_One_Click/23` by `prop_id`; parses interior `SideSetback_` + corner from SideSetback text or 83 `CornerSideSetbacks`; cites `Ordinance_Link`; unit tests on 105054 (25/5/15/25), 34089 GC (20/5/10/20), 34841 MU (15/0-honest/15); **no** ordinance-chart table as number source for Bastrop city | grade: [ ] | deps: 0 | STEP 1 (F4)

2. **Interior/corner side model end-to-end** | check: atom + warm + PE card carry `sideInteriorFt` and `sideCornerFt` distinctly; corner lot 105054 shows 5' interior + 15' corner, not a single "side 20" | grade: [ ] | deps: 1 | STEP 1 (F4, AMENDMENT 2 R2)

3. **MU / GC / PDD from per-parcel record** | check: 34841 (MU) and 34089 (GC) serve base dims from layer 23, not "not verified here"; genuinely non-scalar MU side ("Reference Building Code/Fire Code") → honest-decline WITH reason; no blank district in test area | grade: [ ] | deps: 1 | STEP 2 (F2)

4. **Lot-line geometry scrub** | check: rescrub boundary metadata for all manifest parcels from authoritative parcel geometry; 1006 Jefferson (`34073`) rectangular lot → rectangular envelope (no jog); null-ring/self-intersect verifyFails in area explained parcel-by-parcel or cleared | grade: [ ] | deps: 0 | STEP 3 (F3)

5. **100% area promotion** | check: isolated re-warm/promote **manifest parcels only**; zero parcel in area on P-x/build-to; 34081 (`1004 Jefferson`) same regime as neighbors; any failure = per-parcel explanation row in executor close (not "819 bucket") | grade: [ ] | deps: 1–4 | STEP 4 (F1)

6. **Deploy + traffic shift** | check: planner deploys engine-api + retrieval; smoke; traffic @100% on new revision; PE unchanged unless card shape requires redeploy | grade: [ ] | deps: 5 | STEP 5 (planner)

7. **AREA-SWEEP re-cert** | check: `_inbox/2026-07-30_BASTROP_DOWNTOWN_DRILL_area_sweep_audit.md` grades **every** manifest parcel: (a) internal consistency, (b) current edition, (c) numbers match layer 23, (d) no blank district, (e) envelope geometry invariant; FAIL if ANY wrong; LIVE on traffic-shifted revision + city screen cross-check on evidence anchors | grade: [ ] | deps: 6 | STEP 6 (planner)

8. **Mold update** | check: `28_THE_BASTROP_MOLD` reflects per-parcel record source, interior/corner side, lot-line scrub before inset, area-sweep cert standard, envelope-geometry sanity gate; gates (d) record-vs-chart disagreement flagged | grade: [ ] | deps: 1–7 content | STEP 7

## Out of scope

- All-Bastrop re-warm / county-wide promotion until item 7 passes.
- TX registry / scraper fleet / national / CTX fan-out.
- 213k phase-1a placeholder provenance program.
- SmartCity code changes (READ-ONLY reference).

## Standing decisions (paste into every sub-dispatch)

- Cotality extinguished / no Regrid / public-record only.
- NO privileged data — per-parcel + parcel-geometry sources must be PUBLIC endpoints working for a no-relationship county.
- SmartCity READ-ONLY reference (never a data path).
- Deploys planner-owned.
- Code-done ≠ customer-done — verify vs city live screen AND area-sweep every parcel.
- CTX / national HELD until operator re-QAs the swept area.
- Standing decisions travel in dispatches.

## Amendments

- 2026-07-30: Program opened; CERTIFIED-CLEAN revoked (AMENDMENT 3). Authoritative layer confirmed LIVE as `Parcels_One_Click/23` (not `Zoned_Parcels/83` for numbers). Corner field = `CornerSideSetbacks` on 83; layer 23 embeds corner in SideSetback text.

## Finish card (graded at close)

_(Planner fills after item 7.)_
