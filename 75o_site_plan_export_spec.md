---
id: 75o_site_plan_export_spec
title: Site-plan export — spec (the data-rich, cited, importable site deliverable)
status: in_progress
last_updated: 2026-07-25
applies_to: hauska-engine (spine terrain/site emit), hauska-mcp-server (the gate), property-explorer, the paid-export product line
owner: nick
related: [75j_property_explorer_destination_ledger, 2026-07-23_MASTER_WDLL_property_reasoning_substrate, 25b_monetization_provenance_storage_stack, 2026-07-23_terrain_export_surfaces_finish_checkin]
---

# Site-plan export — spec

The next slice of the export product line: evolve the terrain export (contours + mesh) into a data-rich, cited, importable SITE PLAN — property lines, corners, line lengths, setbacks drawn + labeled, contours + elevation labels, bordering street names, north arrow, layered — PLUS a human-readable PDF site-plan sheet with a summary block and a provenance/citation panel. Every element sources from a cited atom; CAD and PDF are the same source of truth, guaranteed identical.

Prerequisite: the setback/atom work in flight must land first (the site plan DRAWS setbacks — it depends on the setback-rule atom being solid). Dispatch this program after that agent finishes. The terrain-export base file (IFC spatial hierarchy + NAVD88 datum) is already fixed and importable, verified live 2026-07-24.

## The frame (why this is the product, not a feature)

We are not selling a terrain file; we are selling "the site, pre-built." An architect starting a project spends 1-3 days assembling a base (survey, parcel, redraw setbacks, model terrain, place context). Every one of those is data we hold as atoms. The site-plan export collapses that setup phase to one download, everything cited. The PDF sheet extends that value to the non-CAD humans downstream (owner, lender, permit clerk, investor) who can't open a DXF but can read a one-page site plan — and to whom the cited-provenance story matters most.

The differentiator, restated: competitors sell geometry. We sell a decided, sourced, buildable site model where every line traces to a cited atom. No survey PDF or CAD marketplace file can claim its own data lineage. That is the atom substrate expressed as a deliverable.

## IN SCOPE (this program)

### 1. The readable CAD site plan (DXF + IFC, layered)
Each feature class on its OWN layer (toggleable, readable, not a wire tangle):
- PROPERTY_LINE — parcel boundary as a closed polyline; corner points marked. Source: parcel geometry (the node ring — what draws the map boundary).
- DIMENSION — per-segment property-line lengths annotated. Source: computed from the ring segments.
- SETBACK — setback lines drawn as offsets inside the boundary, labeled (F/S/R). Source: the setback-rule atom (F/S/R values). THE MONEY LAYER — a site plan with setbacks drawn is what an architect actually wants.
- CONTOUR — contours with elevation labels (NAVD88, per the datum fix). Source: the terrain mesh (already shipping).
- ELEVATION_LABEL — spot elevations at corners + contour labels. Source: the mesh Z (NAVD88 orthometric).
- STREET — bordering streets drawn + NAME labeled. Source: the road-anchor data (Overpass, from the envelope program).
- NORTH — north arrow + scale bar. Source: the CRS (north is derivable; the file is already true-oriented in projected ENU metres — this makes the orientation VISIBLE, which solves the "I can't tell where the streets are" problem for free).

### 2. The site-plan PDF sheet (the cover) — operator-added, high value-per-effort
One or two pages, rendering the SAME atoms the CAD site plan draws (same source, different renderer — guaranteed identical):
- The drawing: parcel boundary, corners, line lengths, setbacks drawn + labeled, contours + elevation labels, streets named, north arrow, scale bar.
- The summary block: parcel ID, address, county, zoning district, lot area, setbacks (F/S/R), buildable area, flood zone, elevation range (NAVD88 stated).
- The provenance / citation panel (the surveyor's-stamp equivalent): every layer's source + as-of date + confidence. E.g. "Parcel: county GIS. Zoning: [ordinance section]. Elevation: USGS 3DEP, NAVD88. Flood: FEMA panel [X]." This is what makes the PDF defensible for permitting / lending / due-diligence, and it is where the cited-provenance story becomes visible to the decision-makers.
- The honesty line (formalized): "Derived from public GIS records. Not a boundary survey. Not for legal record." Legally protective AND brand-consistent with the honest-absence discipline everywhere else.

### 3. Terrain as a SOLID MASS (replaces the thin surface) — operator-directed 2026-07-24
The IFC terrain currently exports as a single IfcTriangulatedFaceSet — a surface, one layer of triangles, which imports into Revit looking paper-thin (a sheet draped over the ground). REPLACE it with a closed SOLID mass so it reads as a real chunk of earth (like a physical topo model / site cut-block):
- Take the terrain surface as the TOP; drop vertical skirt walls from every boundary edge down to a FLAT bottom plane; cap the bottom. Emit as a CLOSED faceset solid (reuses the existing shared triangulation + NAVD88 elevations + placement — an additive emitter change, not a rewrite; keeps the mesh-parity guarantee).
- Bottom plane elevation: ~0.5 m (about 1.5 ft) BELOW the lowest terrain vertex (min-Z). UNIT NOTE: elevations are NAVD88 METRES; the "1-2 ft" operator intent converts to ~0.3-0.6 m — do NOT read "1-2" as metres (that would be 3-6 ft, too deep). Emitter converts ft->m explicitly.
- Flat-bottom block (not constant-thickness underside) — reads cleaner for site presentation.
- Replace, do not dual-offer: the terrain output is the solid mass. (The thin surface is rarely what an architect wants; drop it.)
- Sits with the 3D buildable-envelope mass (later-roadmap) — both are "site as solid objects," built together in this program.

### 4. Prove on a REPRESENTATIVE parcel
NOT the terrain-gold parcel 48021:27303 — it is a P-3 (public) parcel where "setbacks consume the lot, no buildable area." Bad setback demo. Pick a normal residential parcel with real F/S/R so the setback envelope draws clean and the feature proves properly.

**Locked 2026-07-25 (WDLL):** `48029:105129` — San Antonio R-6, 1127 N PINE ST, F/S/R 10/5/20 cited to `san_antonio_tx/udc/35-310.01`. Backup: `48453:225513` (Austin SF-3). Program artifacts: `_inbox/2026-07-25_site_plan_export_WDLL.md`, `_dispatches/2026-07-25_site_plan_export_sprint.md`.

### 5. Discipline
- Every element cited to its atom (CAD entity metadata + the PDF provenance panel).
- CAD and PDF emit from ONE source of truth — they cannot diverge.
- Layered CAD (toggleable feature classes).
- Honest disclosure on every deliverable (not survey grade).
- Paid: this is a higher public-paid tier than raw terrain (it is most of a survey-lite base sheet + a defensible provenance record). Meter through the SDK (I-F), one meter per export request regardless of format count.

## LATER (logged roadmap — not this program)

- BUILDABLE-ENVELOPE 3D MASS: export the computed buildable envelope as a 3D extruded massing solid on the real terrain — the legal build volume, in the file. The wedge, in CAD. Most-differentiated single item (nobody else COMPUTES the envelope). Cheap-ish (we already compute it).
- SURROUNDING-BUILDING CONTEXT: neighboring footprints extruded (estimated height cheap / true height a LiDAR-photogrammetry acquisition lift), neighboring parcels, street network. Context models are paid deliverables. Offer footprints-extruded now, flag true-height as premium.
- MULTI-FORMAT FROM ONE SOURCE: IFC (BIM) / DWG+DXF (CAD) / LandXML (civil) / GeoJSON (GIS) / glTF (viz) / PDF (human) — all the SAME cited model, guaranteed identical because all emitters off one atom set. The 10x is not format COUNT, it is that they cannot diverge.
- LIVING / RE-QUERYABLE FILE: embed atom_did + a re-fetch handle per element, so the file knows where every line came from and can refresh itself. A category no survey PDF or DWG can touch.
- REVIT-NATIVE FAMILY + IN-PLUGIN STREAMING: the biggest moat, a SEPARATE program. Terrain as an editable Revit toposurface (not a linked wire mesh), property lines as Revit property lines, setbacks as Revit setback lines. Then: in Revit (the Hauska add-in ribbon already exists), click a parcel and the site STREAMS into the active model — no export/download/import round-trip. MCP-native thesis pointed at CAD: "call the property into your digital twin." The download is the fallback; the plugin is the product.
- AS-OF-RIGHT STUDY: max FAR / height / coverage as mass options ("the largest by-right building on this lot"). The investor persona's export; pure reasoning-atom output.

## Cautions (10x thinking can overreach)

1. Do NOT claim survey-grade. Property corners + line lengths derived from GIS parcel data are NOT survey-accurate. The provenance panel is the protection — it must state "derived from county GIS, not a boundary survey, not for legal record." Honesty here is brand-consistent and legally necessary.
2. The plugin/streaming path is a DIFFERENT program than the export (it is "build the CAD-native surface"), the highest-value idea but not "improve the export." Keep it separate so the export enrichment (close) is not held hostage to the add-in build.
3. Surrounding-building HEIGHTS and any precision claim are acquisition/liability questions, not export questions. Stay "approximate, not survey grade" until precision is earned.

## Dispatch note (when the setback agent lands)

Build as a planner-led program under the master WDLL invariants (same discipline as the terrain export): the site plan emits from the spine off the SAME atoms; CAD + PDF from one source; layered; cited; honest disclosure; SDK-metered public-paid; proven on a representative residential parcel with a fresh Revit import + PDF review as the acceptance bar. No stop gate needed unless it touches the live pay-gate flip (it reuses the terrain-export gate, so likely just a format/tier addition). Verify against live state, never a report.
