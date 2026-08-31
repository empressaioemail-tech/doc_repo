---
id: 2026-07-25_site_plan_export_WDLL
title: WDLL — Site-plan export (data-rich cited site deliverable)
status: approved
date: 2026-07-25
last_updated: 2026-07-25 (Wave 3 items 7-8 graded PARTIAL — PRs open, CI green, no STOP, live probe owed)
applies_to: hauska-engine, hauska-atom-contract, hauska-mcp-server, hauska-sdk, hauska-map (property-explorer + command-center)
rolls_up_to: 2026-07-23_MASTER_WDLL_property_reasoning_substrate
related: [75o_site_plan_export_spec, 2026-07-23_terrain_ifc_spine_lift_WDLL, 2026-07-23_terrain_export_surfaces_finish_checkin, 2026-07-24_post_breadth_three_gaps_MILESTONE]
owner: nick
operator_approval: 2026-07-25 (dispatch greenlight — SITE-PLAN EXPORT SPRINT; planner-led)
---

# WDLL: Site-plan export

Date: 2026-07-25  Status: approved

## Done looks like

A representative residential parcel returns one paid site-plan export (format family extending the live terrain-export path) authored in hauska-engine off the SAME cited atoms the map already serves: parcel ring, setback-rule (F/S/R), terrain mesh (NAVD88), road-anchor streets. Off ONE shared site model, emitters produce (1) layered DXF site plan, (2) layered IFC site plan with terrain as a CLOSED SOLID MASS (skirt + flat bottom ~0.5 m below min-Z; replace thin surface, no dual-offer), and (3) a PDF site-plan sheet (drawing + summary block + provenance/citation panel + honesty line). CAD and PDF cannot diverge. Every layer cited (CAD entity metadata + PDF panel). Served public-paid via MCP/SDK with ONE meter per export request regardless of format count. Proven importing into Revit (DXF+IFC) with PDF reviewed. Live PE URL surfaced. No survey-grade claim.

## Representative parcel (locked)

| Field | Value |
|---|---|
| parcelNodeId | `48029:105129` |
| Address | 1127 N PINE ST, SAN ANTONIO, TX 78202 |
| County | Bexar (48029) |
| Zoning | R-6 (`san_antonio_tx`) |
| Setbacks | F/S/R = 10 / 5 / 20 ft, cited `san_antonio_tx/udc/35-310.01` |
| Lot | ~7756 sqft, land-use A1 single-family |
| Forbidden demo | `48021:27303` (P-3, setbacks-consume-lot) |

Prerequisite evidence: PE facets 2026-07-25 show R-6 + SF residential; setback/envelope chain verified in `_inbox/2026-07-24_post_breadth_three_gaps_MILESTONE.md` (engine emit+write). Wave 0 must re-verify atom-chain LIVE (PE BFF reported `atom-chain HTTP 500` on 2026-07-25 — treat as hazard, not as "setbacks missing").

Backup if SA parcel fails Wave 0: `48453:225513` (Austin SF-3, 25/5/10, cited `austin_tx/ldc/25-2-492`). Amend this WDLL if backup is used.

## Acceptance items

1. Wave 0 live lock. | I-I | check: planner pastes live atom-chain (or engine StoragePort read) for `48029:105129` showing zoning-fact R-6, setback-rule 10/5/20 with code cite, envelope with input-atom refs (or honest provisional-front-edge). PE facets confirm SF residential. Forbidden parcel `48021:27303` not used as demo. | grade: [~] PARTIAL — milestone + adapter re-derive + PE facets; live atom-chain HTTP this session still blocked (BFF 503 / no bearer in sandbox)
2. Shared site model. | I-A,I-C | check: one spine authoring path composes parcel ring + setback offsets + contours/elevations + street anchors + north/scale into a single in-memory site model; DXF/IFC/PDF emitters read only that model (no second geometry pipeline). Grep-clean: no TX literals in reasoning/emit path outside descriptor/provenance. | grade: [x] MET — #116 `5e3acea`; composeSitePlanModel single path; TX literals test-only
3. Layered CAD DXF. | check: live DXF on representative parcel has distinct layers PROPERTY_LINE, DIMENSION, SETBACK, CONTOUR, ELEVATION_LABEL (or CONTOUR labels), STREET, NORTH; each entity carries atom/source metadata; AC1015 R2000 structure held (terrain WDLL item 10 bar). Sample filed under `_inbox/`. | grade: [~] PARTIAL — layers+AC1015+XDATA proven on synthetic sample; live TxGIO/3DEP re-run owed Wave 4
4. Layered CAD IFC + solid terrain mass. | check: live IFC has site-plan feature classes as distinct layers/elements; terrain is CLOSED solid (top surface + vertical skirts + flat bottom ~0.5 m below min-Z; ft→m explicit); thin IfcTriangulatedFaceSet-only terrain GONE (replace-not-dual-offer); NAVD88 + spatial hierarchy bars from terrain WDLL items 11–12 held. Sample filed. | grade: [~] PARTIAL — Closed=True + NAVD88 + nodata-boundary fix on #116; site-plan path only (amendment); live sample owed
5. PDF sheet same source. | check: PDF drawing elements match CAD layers (same model hashes/coords); summary block has parcel ID, address, county, zoning, lot area, F/S/R, buildable area (or honest provisional), flood zone (or honest unavailable), elevation range NAVD88; provenance panel lists every layer source + as-of + confidence; honesty line exact: "Derived from public GIS records. Not a boundary survey. Not for legal record." Sample filed. | grade: [~] PARTIAL — #117 `c59a81c` + HOLD `a0a3780`; synthetic sample verified (honesty + provisional + cite); live TxGIO/3DEP/FEMA prove owed Wave 4
6. Citation discipline. | I-C | check: every layer traces to its atom/referenced field (parcel GIS, setback-rule DID + code cite, USGS 3DEP NAVD88, road-anchor, FEMA if present); no bare geometry without provenance on CAD metadata or PDF panel. | grade: [~] PARTIAL — provenance panel + XDATA on CAD path; live as-of still synthetic on sample
7. Pay / meter path. | I-F | check: if only format/tier addition on existing terrain-export pay-gate → no stop gate; finish check-in pastes one SDK authorize per request (usage=1) regardless of format count. IF new public-paid SKU or metering shape changes → STOP, check-in to doc_repo planner before flip. | grade: [~] PARTIAL — no STOP; mcp #48 merged `67b4b64` (`refresh_parcel_site_plan_export` + same authorizePaidCall); live `sdk_metering_authorize` usage=1 trace owed post Cloud Run deploy
8. Surfaces. | check: Property Explorer (and Command Center if tile path reused) exposes site-plan export; live PE deep-link for `48029:105129` pasted; anon/free correctly withheld for paid refresh. | grade: [~] PARTIAL — map #56 merged `3774c4d`; live PE still serves pre-merge shell (BFF `/api/pe-site-plan-export` 404 as of 2026-07-25T10:16Z) — Vercel redeploy + anon 401 probe owed
9. Finish check-in (planner, live). | I-I | check: fresh DXF + IFC + PDF samples on representative parcel; Revit import proven (DXF Link CAD + IFC); PDF reviewed; CI green merges only; thesis_parity_ledger entry filed. | grade: [ ] BLOCKED — see `_inbox/2026-07-25_site_plan_export_finish_checkin.md`

## Out of scope (logged in 75o — do NOT build)

3D buildable-envelope mass; surrounding-building context; multi-format-from-one-source beyond DXF/IFC/PDF this program; living/re-queryable file; Revit-native family + in-plugin streaming; as-of-right study.

## Dependencies (execution order)

1 (Wave 0 lock) → 2 (shared model) → 3+4 (CAD emitters, may parallel after model) → 5 (PDF off same model) → 6 (citation audit) → 7 (pay path / STOP if SKU flip) → 8 (surfaces) → 9 (finish check-in).

## Invariants (inherited)

I-A anti-zombie, I-B jurisdiction-agnostic, I-C quality-gate provenance, I-F SDK money boundary, I-I verification-never-delegated. USGS 3DEP = public-domain → I-K N/A for elevation. Setback code cites remain under existing I-K inbound path (do not bypass).

## Amendments

- 2026-07-25: Representative parcel locked to SA `48029:105129` (operator dispatch; amends 75o "Hays or Williamson" preference to Austin/SA SF-R with real F/S/R). Reason: prerequisite chain proven on SA R-6; terrain-gold Bastrop P-3 forbidden.
- 2026-07-25 (Wave 1 review): Item 4 solid-mass **replace-not-dual-offer** applies to the **site-plan IFC path** (`ifc-site-plan`). The pre-existing terrain-export thin surface (`ifc` / `Closed=False`) stays until a follow-on amendment retires it, so existing terrain consumers do not silently change geometry. Reason: adversarial review of PR #116 — dual-path is intentional sequencing, not a second site-plan terrain offer.

## Finish card (graded at close)

_(empty until close)_
