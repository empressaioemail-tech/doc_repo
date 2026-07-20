---
id: 2026-07-20_map_calibration_backlog_scope
title: Map calibration backlog — scoped (topo coverage, lot-line/aerial alignment, septic)
status: queued
date: 2026-07-20
applies_to: hauska-brief-extension, legacy-design-tools (cortex-api site-context), @hauska/map-renderer
related: [2026-07-15_ossf_septic_records_access_survey, 2026-07-18_property_brief_gtm_critical_path, 2026-07-16_map_data_gaps_pickup_list]
owner: nick
---

# Map calibration backlog — scoped

Three items the operator flagged during envelope-calibration QA, scoped here so they are actionable later without re-derivation. None built in this run (this run = envelope opacity/lot-lines + zoning-stamp roll). Ranked below envelope accuracy per operator ruling.

## 1. Topo / elevation layer bound to "one box" — the fix is BACKEND, not frontend

Operator observation: the elevation/topo (contour) layer is bound by a single box and does not cover the viewport when zoomed out or panned far.

Grounded finding (verified in `spine-map.js`, live): the FRONTEND is already correct and defensive. `refetchTopoForViewport` re-keys the contour fetch on the VIEWPORT CENTER as the user pans, with an LRU pan-back cache (`topoCache`, `centerCellKey`), a generation guard against stale in-flight results (`topoGen`), and honest degradation (a failed pan-fetch keeps the last-good contours on screen, never blanks or fabricates). Contours-on also fires an immediate viewport refetch. So the client already chases the pan and stitches cells.

The "one box" is upstream: `fetchSiteContext` is POINT-KEYED with NO bbox or radius parameter (documented at spine-map.js ~1081). The server decides the topography extent around the single point it is given. So each fetch returns a fixed-size patch around one point; panning re-keys to a new point and gets a new patch, but a zoomed-OUT view wants topo across an area larger than one server-decided patch, and the client cannot ask for more because the API has no extent param.

Scope of the real fix (backend, cortex-api site-context):
- Add a bbox (or center+radius/zoom) parameter to the site-context topography endpoint so a caller can request contours for a specified extent, not just a server-decided patch around a point.
- OR, if the upstream contour source is inherently point-patch, do a CLIENT zoom-gated grid-stitch: at low zoom, issue N center-keyed fetches across the viewport grid and union the results (the client cache + gen-guard machinery already supports multi-cell; this is an extension of the existing center-key loop to a grid of keys, gated so it only fans out when zoomed out enough to need it, to bound cost).
- Honest-degradation and no-fabrication rules already in the client must carry to whichever path.

Priority: cosmetic relative to envelope accuracy. It does not block the wedge (the subject parcel's own topo patch is correct). Queue below corpus + envelope. Related export spec already drafted: `2026-07-15_parcel_topo_tile_export_spec_DRAFT.md` (worth reading before building — a baked topo-tile export would remove the per-point fetch entirely and is the cleaner long-run answer, same PMTiles-style model as parcels).

## 2. Lot-line vs aerial imagery alignment — SCOPE FIRST (datum offset vs inherent source accuracy)

Operator ask: "is there any future calibration we could do so that the lot lines and aerial imagery are tighter aligned? I know it's always an issue with lot lines and aerials but if we could sharpen that it would be really high value."

This is a two-fork scoping question BEFORE any build, because the two causes have completely different fixes and one of them is unfixable:

Fork A — a systematic DATUM / projection offset (FIXABLE, high value). If the parcel geometry and the satellite basemap are in slightly different datums or the parcel source has a consistent shift, the misalignment is uniform in direction+magnitude across all parcels and correctable with a reprojection or a fixed offset applied at bake/render time. This is the high-value case the operator is hoping for. Diagnostic: sample several parcels across different counties; if every lot line is off by the SAME vector (e.g. always ~2m NE), it is a datum/offset bug -> fix once, region-wide.

Fork B — inherent CAD source accuracy + imagery ortho error (NOT fixable by us). County CAD parcel fabric is drafted to a tolerance and the aerial ortho has its own registration error; the mismatch is variable per parcel and per image tile. No global correction sharpens it because there is no single offset. Diagnostic: if the misalignment varies in direction/magnitude parcel-to-parcel, it is source accuracy -> the honest move is to disclose "parcel lines are approximate, not survey-grade" (the envelope disclosure already says this) and NOT claim a precision we do not have.

Scope of the first (cheap) step: a diagnostic pass, not a build. Overlay parcel geometry on the satellite base for a sample of parcels across the metro counties (Travis/Williamson/Bexar/Hays/Comal + a rural one), measure the offset vector per parcel, and classify: uniform (Fork A, build the correction) vs variable (Fork B, keep the honest disclosure, do not over-promise). Only after that classification is it worth committing build effort. Ranked below envelope accuracy per operator ("fold into calibration scope, rank below accuracy").

## 3. Septic / OSSF on plans — already has a program record

Operator running-list item: "needs to deal with septic at some point and showing septic on plans."

This already has a records-access survey filed: `2026-07-15_ossf_septic_records_access_survey.md` (7-county tiers, Comal Tier-1 PoC path, phase-3 georef flagged as load-bearing risk). Also captured as GTM gap #5 in `2026-07-18_property_brief_gtm_critical_path.md` (pull OSSF records -> site-plan extraction -> map overlay -> SSURGO suitability compose). No new scope needed here — this pointer exists so the calibration-QA mention is linked to the existing OSSF sub-program rather than re-opened as a fresh thread. It is an additive story (rural Central-TX), not a first-demo blocker; queue behind the wedge per the GTM sequencing.

## Sequencing (all below envelope accuracy)

1. Envelope accuracy calibration (in progress this run: opacity/lot-lines + zoning-stamp roll to the 7 setback cities). 
2. Lot-line/aerial DIAGNOSTIC pass (item 2, cheap, decides if there is a fixable global offset). 
3. Topo viewport coverage (item 1, backend bbox param or client grid-stitch; consider the baked topo-tile export instead). 
4. Septic/OSSF (item 3, its own sub-program, additive story, behind the wedge).
