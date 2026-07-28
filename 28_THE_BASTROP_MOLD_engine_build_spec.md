---
id: 28_THE_BASTROP_MOLD_engine_build_spec
title: THE BASTROP MOLD — the engine build specification (what a complete county contains + every baked decision/gotcha the fan-out engine must replicate)
last_updated: 2026-07-28
status: living spec (the input to the CTX/national engine build; kept current as QA continues)
owner: nick
related: [_STATE.md, 27_MASTER_WDLL_spine_completion_and_depth_engine, 27a_jurisdiction_factory_engine_spec, 27d_county_onboarding_recipe_and_fleet_reliability, 27f_bastrop_through_v2_program, 2026-07-27_bastrop_composition_inventory, 2026-07-27_COMPLETE_BASTROP_hardening_audit]
purpose: When we build the engine to fan agents and finish CTX / go national, THIS is the specification. It answers "what does a complete, correct, market-ready county contain, and every decision + gotcha the engine must bake so a fresh county inherits them instead of re-deriving them." Assembled from the whole Bastrop program (depth → boundary primitive → hardening → topo → QA). This is the mold; a new county is this, produced by the engine, from a descriptor.
---

# THE BASTROP MOLD — engine build specification

Bastrop is the reference county. Everything below is what the engine must PRODUCE for each new county, and every DECISION/GOTCHA it must bake so county #2..#254 inherit them. This is a LIVING doc — as QA surfaces more, it is updated (see the capture protocol at the end). It is the antidote to re-deriving the county by archaeology.

## PART 1 — WHAT A COMPLETE COUNTY CONTAINS (the output the engine produces)

### 1a. The per-county INPUT (the descriptor — the only per-county human-ish authoring)
A county is a DESCRIPTOR + the engine. The descriptor (verified shape: `bastrop_tx_descriptor.json`, `caldwell_tx_descriptor.json`) carries:
- FIPS, displayName, jurisdictionTenant, parcelFips, defaultAccessPolicy, sourceAdapter.
- `assumedRowWidthFt` per road class (highway/major_collector/minor_collector/residential/alley/gravel/unclassified).
- `setbackTable.rows` indexed by (district_code, road_class, edge_role) → setback_ft {value, confidence, verification_state, not_specified}. Cited to the code (e.g. B3 §6.5.003).
Authoring the descriptor is the ONLY per-county input; everything downstream is mechanical.

### 1b. The DATA LAYERS (sources → atoms) — with provenance on every atom
| Layer | Source pattern | Atom / node | Provenance rule |
|---|---|---|---|
| Parcels | county GIS ArcGIS FeatureServer (BCAD-equivalent) | parcel node (geometry, "not survey grade") | source URL + vintage |
| Zoning | CITY AGOL zoning layer (PlaceTypeClass-equivalent) — NOT county GIS (counties don't zone unincorporated land) | zoning-fact (district) | MUST cite the real AGOL layer URL + codeField + cityKey + stampedAt — NOT the internal bake URL (the commitment-#1 red we fixed) |
| Setbacks | descriptor setbackTable, cited to code | setback-rule | citation resolves to a real code atom; verification_state recorded |
| Buildable envelope | derived (real polygon-offset) | buildable-envelope | declines honestly (approximate/pending), never a confident wrong shape |
| Boundary edges | computed from parcel ring + adjacency | property-boundary-edge (role, adjacency, interior, setback, temporal, GIS bearing+distance tags) | GIS-computed tags labeled "not a survey" |
| Roads | OSM + county StreetsSurveyed + county comprehensive roadway (city+county) | road node (centerline, class, ROW) | provenance.kind per road: county-authoritative vs osm-best-available |
| Flood | county FEMA layer | flood atom | FEMA source + vintage |
| Terrain | USGS 3DEP at 1m (config, NOT 10m default) + county 1-ft contours | parcel-terrain-model | source + resolution; honest fallback where absent |
| Land use | CAD roll | land-use (A1 etc.) | cad-roll + vintage |

### 1c. The CUSTOMER SURFACE (PE) a complete county serves
- Inspect card: zoning, setbacks, buildable, flood, LAND USE + ACREAGE, honest-absence where thin.
- Map: parcels (zoning-colored), roads (viewport network), 1-ft contours, FEMA, hydrology flow, aerial imagery basemap.
- Property BRIEF (Alder-style): sectioned layman prose, per-fact citations + freshness, honest-absence, close + PDF export.
- Site-plan EXPORT (PDF): parcel, envelope, setbacks, road, property-line-tags, + aerial-context page.
- Terrain EXPORT (GLB mesh) + IFC export.

### 1d. The OPERATOR SURFACE (CC) a complete county serves
- Node & Graph: county roster → node list → search-by-many-ids → node detail → atoms-by-family → atom inspector (confidence n/width/basis, provenance, bitemporal, lineage) → back-nav to county list.
- Map↔node binding (click map parcel → focus Node&Graph to that node, and back).
- Spine Health board (per-adapter/per-engine firing/degraded/dead, alert on zero-with-baseline).
- The State Legend (atom contract as operator vocabulary).

### 1e. The HONEST CEILING (a complete county is NOT 100%)
- Depth ~99.6% of RESOLVABLE place-type parcels (honest residual = no-road-adjacency + genuinely-irregular geometry).
- Zoning ~9% of a mostly-unincorporated county is CORRECT (only cities zone; unincorporated land is legitimately unzoned — label it "CITY-ZONED", never a bare % that reads as failure).
- PDD / overlay districts honestly decline (site-specific, separate wave).

## PART 2 — THE ENGINE (how the county is produced — the recipe gates)

Per 27d, the 8-gate recipe (each a fail-closed gate = a baked Bastrop decision):
1. DESCRIPTOR IN — validates against contract; golden-descriptor test shape.
2. INTAKE — parcels/zoning/roads onto the substrate. GATE: source-verified + provenance; a 404 is honest-absent, never silent zero. AUTHORITATIVE-SOURCE-RECON + SCHEMA≠DATA gates (below).
3. ROAD + FRONT LABELING — front-labeling fixture gate (footway-ineligible, local>collector, not-by-accident).
4. RULE — road-type setback from descriptor; citation resolves to a real code atom.
5. REASONING — buildable envelope via real polygon-offset; geometry-correctness gate (contained/non-self-intersecting/correct-offset, positive-space fixtures).
6. WARM → VERIFY → PROMOTE — mechanical verify (not re-assertion) before promote.
7. TALLY + COST — coverage is a live SELECT (G1); cost under commitment #3.
8. SMOKE — end-to-end live availability; fails loudly.

Anti-zombie: reasoning lives in the engine (jurisdiction-agnostic); jurisdiction lives ONLY in descriptor + adapters + provenance. County #500 is a descriptor a background agent runs.

## PART 3 — EVERY BAKED DECISION / GOTCHA THE ENGINE MUST CARRY (the traps, so a fresh county inherits them)

These were discovered by building/fixing Bastrop. If the engine does NOT bake each, the fan-out re-derives it wrong per county. THIS is the highest-value part of the mold.

DATA / PROVENANCE:
- ZONING SOURCE IS THE CITY AGOL LAYER, cited by URL — never the internal bake URL (commitment-#1 red; hardening A1). County zoning GIS is typically DEAD.
- AUTHORITATIVE SOURCES ARE SPLIT BY JURISDICTION LEVEL — county-road vs comprehensive-roadway vs city-street are different layers; find ALL of them per county.
- SCHEMA ≠ DATA — a layer can carry owner/surface FIELDS while barely POPULATING them (Bastrop city streets: 67 defined / 994 undefined). Check DATA population, not schema existence. Keep OSM best-available where authoritative is sparse; never fabricate an authoritative label from undefined.
- UNREACHABLE-CITY-GIS — a city's GIS may not resolve (Lockhart DNS NXDOMAIN); honest-absent → OSM, never invent.
- ENUMERATE ALL PUBLISHED FOLDERS FIRST — Bastrop county publishes ~26 folders; we'd only queried 4 and missed contours/imagery/hydrography/address/subdivisions. The recipe must enumerate every published layer before deciding ingest.

GEOMETRY:
- REAL POLYGON-OFFSET (polygon-clipping), never naive per-edge miter (self-intersects on concave rings).
- CLEAN CLIP ARTIFACTS before the degeneracy guard (ringHasSelfTouch); never WEAKEN the guard to pass a specimen (would let genuinely-degenerate lots fabricate).
- GEOMETRY GATE NEEDS POSITIVE-SPACE FIXTURES (good near-rects on every edge PASS), not only bad-shapes-fail — the 28286 near-rect hole.
- BOUNDARY PRIMITIVE: interior computed ONCE per ring + STORED; the offset CONSUMES it (orientation-invariant), never re-derives per edge.
- ADJACENCY at county scale = one-load + cell-grid + PIP, NOT per-edge bbox scan (O(n²); 55h on Bexar). Scales to Bexar (~700k).

INFRA / TOPO / HYDROLOGY:
- TOPO IS A CONFIG, NOT A LIMIT — 3DEP serves ~1m; the "coarse" was a 10m default. Config-to-1m is the instant win; county 1-ft contours are the additive tier.
- HYDROLOGY MUST SCALE WITH THE DEM — the 1m topo swap broke D8 flow (fetched 1m it didn't need, fixed 50-cell threshold, blew the worker budget → 504). Bake a hydrology resolution FLOOR (10m) + resolution-scaled threshold. ANY topo change must re-verify hydrology.
- ENGINE COLD-START vs PE 60s CAP — cold engine-api can exceed the PE Vercel fn 60s cap on first hit; min-instances=1 eliminates it (operator cost call). MCP→engine timeout must be 50s (warm refresh ~23s).
- ESRI AERIAL EXPORT floors at ~0.3 m/px (its deepest cached LOD) — asking finer 500s; use a resolution floor.
- STRANDED DATA — persisting to StoragePort ≠ serving it; every new node type/query needs a StoragePort method AND an HTTP route AND a consumer, or it's invisible (hit 3×: boundary edges, road-bbox, /nodes list). The engine must expose what it persists.

DEPLOY / OPS (all planner-owned):
- Cloud Run traffic trap (new revision ≠ serving until shift-traffic); engine-api 4Gi is LIVE-SET only; Vercel does NOT auto-deploy on merge (CLI from repo root, vercel link --project first); migration MERGED ≠ APPLIED to the live Neon (apply + verify before a data-run); workflow deploys revert manual env.
- MERGED ≠ CUSTOMER-DONE — grade on the LIVE deployed surface across multiple different-data parcels, never a merged PR.

MEMORY / FLEET:
- STANDING DECISIONS MUST TRAVEL IN THE DISPATCH — memory reaches the planner seat only; embed the standing-decisions block in every sub-agent dispatch or it drifts (the Cotality-rotate drift).
- COTALITY IS EXTINGUISHED — re-route to county-gis, never rotate the credential.

## PART 4 — WHAT IS NOT IN THE MOLD YET (honest — deferred, engine does not produce these)
- Survey-grade ROW / recorded plats / easements / courthouse records (v2 fidelity + Vertosoft channel; records = downloadable-docs first, atomization later).
- Living-layer sensing (zoning-change/annex/ownership/permit/subdivision — temporal atoms exist, sensors not built).
- Infrastructure/digital-twin assets (streetlights/traffic — city layer, likely city data handoff).
- The broader PE report set beyond the brief (product decision owed).
- Marketplace / write-back.

## CAPTURE PROTOCOL (how this doc stays the accurate mold — for every agent)

This is a LIVING mold. Every agent working on Bastrop (QA or otherwise) must feed it:
1. When you FIX or BUILD something that is a COUNTY-GENERAL decision/gotcha (would apply to county #2..#254), add it to PART 3 (the baked-decisions list) with the one-line lesson. If it's a NEW thing a complete county contains, add it to PART 1. If it's a new recipe gate, PART 2.
2. If it's a Bastrop-ONLY quirk (not general), do NOT add it here — it goes in the QA register / _STATE.md.
3. Prefer the DURABLE FORM: if the lesson can be a mechanical gate/test, note the gate. Prose is the fallback.
4. Update `last_updated`. This doc + `_STATE.md` + `MEMORY.md` are the three the engine-build agent reads FIRST.
The test of this doc: a fresh engine-build planner reads it and can build the fan-out engine WITHOUT re-deriving a single Bastrop decision. If the fan-out re-discovers something that was learned here, this doc missed it — add it.
