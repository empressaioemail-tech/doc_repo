---
id: 30_block_cert_harness_spec
title: The block-cert harness — three-way convergence + measured-geometry setback verification, scoped to one block, driven to 100%
last_updated: 2026-08-09
status: superseded
owner: nick
related: [2026-07-29_setback_authoritative_source_and_road_decouple, 28_THE_BASTROP_MOLD_engine_build_spec, 29_scale_warm_architecture, 55_spine_data_intelligence_stack]
purpose: Crack ONE block to provable 100% correctness against the authoritative record, with a mechanical harness that measures the DRAWN envelope geometry (not card text) and triangulates PE vs SmartCity vs city GIS. Then replicate the METHOD to other blocks. This harness is the seed of the mold's automated visual/geometry cert (gate 8 / R19-R24) that removes manual per-parcel QA.
---

# The block-cert harness

> **2026-08-09: superseded, fully consumed** by `90_operations/OPS-5_cert_standard.md` (three-way convergence is R20; measured per-edge geometry is R32; area-sweep-not-sampling is R3/R11/R14/R17) and section 5 of `90_runbooks/factory_onboarding_runbook.md` (block-13 7/7 is the standing regression gate), per `_decisions/2026-08-09_factory_spec_precedence_ruling.md`. The harness specified here was built as `block13-cert-grade.mjs` and ran.

## Why this exists
Repeated R6 QA failures (repealed code, wrong district, broken envelopes, un-swept parcels, and — the deepest — setbacks NOT DRAWN RIGHT even where card numbers were correct) proved that grading card TEXT or a curated LIST or a single SOURCE is insufficient. The block-cert grades the DRAWN geometry against the authoritative record, triangulated across three sources, on every field of every parcel in one block, to 100%. It is the tightest possible proving ground and the replicable method for national cert.

## The block
Block 13, downtown Bastrop: Chestnut / Pecan / Pine / Jefferson. Chosen for stress: multiple zoning districts (GC, MU, SF-1), an interior alley, non-uniform property lines, split-zone parcels. If the harness cracks this block, the method generalizes.

## THE THREE-WAY CONVERGENCE PRINCIPLE (R20)
PE, SmartCity, and the City of Bastrop public ArcGIS (Parcels_One_Click/FeatureServer/23 + Zoned_Parcels/FeatureServer/83) all read the SAME underlying record. For every field of every parcel they MUST show identical values. Divergence IS the defect; which source diverges localizes the bug:
- PE differs, SmartCity == GIS -> OUR read/transform/warm bug.
- SmartCity differs, PE == GIS -> SmartCity red herring; we're correct.
- All three differ -> the underlying record is ambiguous (e.g. split-zone); flag, do not guess.
- All three agree BUT the drawn envelope is wrong -> geometry-render bug (R21).
This replaces GIS-as-sole-truth (which was failing). Triangulation, not comparison.

## WHAT THE HARNESS GRADES (per parcel, R24 full parity)
1. DISTRICT (the keystone — if wrong, everything cascades): PE stamp == SmartCity == Zoned_Parcels/83 ZoneType.
2. SETBACKS (numbers): front / interior-side / corner-side / rear, all three sources.
3. ENVELOPE GEOMETRY (R21, the hard new gate): measure the emitted WGS84 envelope polygon; each edge's inset distance from its lot line, in FEET (tolerance ~1ft), must equal the setback for that edge's ROLE. Front edge inset front_ft, side side_ft, alley per R23, etc.
4. FULL ONCLICK FIELDS: impervious coverage %, max building height, min lot size, porch-encroachment nuance — surfaced on the card AND matching all three sources (mostly already parsed; surface+verify).
5. ZONING REFERENCE + district description: cited, matching.
6. PROPERTY-LINE GEOMETRY: parcel ring matches BCAD; non-uniform lines + interior-alley edges correctly identified.
7. SCREENSHOT: captured per parcel (PE rendered envelope-in-lot) for human + vision-model visual confirmation. Not the gate; the confirmation.

## EDGE-ROLE RULES (the non-uniform cases this block forces)
- ALLEY edge (R23): its own role, inset per what the city record specifies for alley-abutting edges. NOT assumed = rear. Convergence check reveals mis-roling.
- BUILDING/FIRE-CODE DEFERRAL (R22): where the record says "None - Reference Building/Fire Code" (e.g. MU side), do BOTH — surface the city language AND apply the fire-code 5' standard (broad, citable) so the envelope DRAWS. Honest-decline was CAUSING broken envelopes (NaN -> null inset -> collapse); a known deferral resolves to the code minimum, not a decline.
- CORNER-SIDE: interior-side and corner-side distinct (parse from SideSetback text / CornerSideSetbacks field).
- GRACEFUL DEGRADE: a genuinely-unknowable single axis must NOT collapse the whole envelope; resolvable edges still draw.

## GROUND TRUTH — the answer key (SmartCity + city GIS, Block 13, transcribed 2026-07-30)
| APN | Situs | District | Front | Side | Corner | Rear | Height | Impervious | MinLot |
|---|---|---|---|---|---|---|---|---|---|
| 34145 | 909 Pecan | GC | 20 | 5 | - | 20 | 55 | 65% | 1/4 ac |
| 34121 | 907 Chestnut | GC | 20 | 5 | - | 20 | 55 | 65% | 1/4 ac |
| 34153 | 909 Chestnut | GC | 20 | 5 | - | 20 | 55 | 65% | 1/4 ac |
| 34137 | 908 Pine | SF-1 | 25 | 5 | 15 | 25 | 35 | 50% | 1/3 ac |
| 34169 | 906 Pine | SF-1 | 25 | 5 | 15 | 25 | 35 | 50% | 1/3 ac |
| 34177 | 901 Pecan | MU | 15 | 5 (bldg/fire code) | - | 15 | 40 | 60% | 1/3 ac |
| 34161 | 905 Pecan | MU | 15 | 5 (bldg/fire code) | - | 15 | 40 | 60% | 1/3 ac |
(Remaining Block-13 parcels to be enumerated from the BCAD render set at run time — the cert scope is the RENDERED block, per R14/R17, not a curated subset. SF-1 front carries "porches may encroach up to 10 ft"; capture it.)

## THE HARNESS (mechanical, replicable)
For each parcel in the rendered block:
- Query city GIS 23/83 (public, direct) -> authoritative record.
- Read PE facets (deployed atom-chain / facets endpoint) -> our served values + envelope geojson.
- Compare against SmartCity transcribed ground truth (operator-supplied / OCR).
- Measure envelope polygon inset per edge in feet vs the role setback.
- Emit a per-parcel row: every field, all three source values, PASS (converge + geometry matches) or FAIL (diverging source named / measured-vs-expected inset delta).
- Capture screenshot.
Output: PER-PARCEL x PER-FIELD CONVERGENCE MATRIX + screenshot per parcel. 100% = every cell green. First run READ-ONLY (true failure map, no fixes); then fix to 100%; then replicate the METHOD to a next block with different characteristics.

## RELATION TO THE FAN-OUT (why this is the keystone, not a detour)
This harness IS the mold's automated cert (gate 8 / R19). Proving it on one block to 100% gives the fan-out a mechanical, ground-truthed, screenshot-confirmed per-parcel cert that removes manual visual QA: for any county, query the rendered set, three-way-converge every field against the authoritative record, measure every envelope's geometry, flag divergence. The vision-model screenshot layer is the safety net for unknown-unknowns; its recurring catches become new mechanical assertions. Block-cert @ 100% is the unit of trust that lets a county deploy without the operator eyeballing every parcel.

## APPROACH POSTURE (R-amendment 11)
Finish+extend is the bet: source is right, inset is metric-correct, full fields already parsed; the gaps are district-assignment, drawn-geometry verification, and field surfacing. The rebuild door stays open — if this block hits a wall the current model cannot clear, that is the rethink trigger, with the tightest possible test case.
