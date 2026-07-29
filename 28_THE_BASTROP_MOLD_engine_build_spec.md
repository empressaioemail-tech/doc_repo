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
A county is a DESCRIPTOR + the engine. Authoring the descriptor is the ONLY per-county input; everything downstream is mechanical. The GOLDEN SHAPE is `bastrop_tx_descriptor.json` + `caldwell_tx_descriptor.json` — read them verbatim; do not author from this summary alone. The descriptor carries:
- FIPS, displayName, jurisdictionTenant, parcelFips, defaultAccessPolicy, sourceAdapter.
- `assumedRowWidthFt` per road class (highway/major_collector/minor_collector/residential/alley/gravel/unclassified).
- TWO setback tables (verified in code `resolve-road-class-setback.ts`), NOT one:
  1. `setbackTable` — FLAT, per district (front/rear/side/side_corner) → setback_ft {value, confidence, verification_state, not_specified}.
  2. `roadClassSetbackTable` — per (district, road_class, edge_role) → setback_ft.
  RESOLUTION: the resolver PREFERS the `roadClassSetbackTable` cell and FALLS BACK to the flat `setbackTable` (`resolve-road-class-setback.ts:96-127`). The engine bakes this prefer/fallback; the descriptor author supplies both.
- `match_basis` on rows: `exact` / `prefix` / `fallback` (`resolve-road-class-setback.ts:33-45`) — how the author declares an exact district row vs a catch-all. Bake this.
- Every setback carries `confidence` + `verification_state` (human-verified / transcribed) — commitment #2 discipline; not optional.
- Cited to the code (e.g. B3 §6.5.003) — OR, where a city has no code table, honest-absence: the CALDWELL descriptor declares HARD-HOLD districts with NO rows (PDD/CCB/IH/AO/PI/MH) and OMITS alley-specific feet as honest-absence. The descriptor-author's HONEST-ABSENCE discipline (declare a district present-but-unresolved rather than invent feet) is a general skill, not a Bastrop quirk.

### 1b. The DATA LAYERS (sources → atoms) — with provenance on every atom
| Layer | Source pattern | Atom / node | Provenance rule |
|---|---|---|---|
| Parcels | county GIS ArcGIS FeatureServer (BCAD-equivalent) | parcel node (geometry, "not survey grade") | source URL + vintage |
| Zoning | THE CITY source — per incorporated city. NOT county GIS (counties don't zone unincorporated land). The city source varies: an AGOL layer (Bastrop: PlaceTypeClass), a city ORDINANCE table/PDF (Caldwell/Lockhart: ord_2024-18), or ABSENT. Find the real city source per incorporated city — do NOT assume AGOL. | zoning-fact (district) | MUST cite the real source (AGOL layer URL + codeField + cityKey + stampedAt, OR the ordinance ref) — NEVER the internal bake URL (the commitment-#1 red we fixed) |
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
- PAID REPORTS follow ONE PATTERN (set by Flood & Drainage, the first, 2026-07-29): bubble → LockedToolPanel gate (property-unlock/Pro) → run-in-dock → self-contained viz w/ provenance → Sheet-Standard PDF → dossier auto-attach. Every future report (comps/hazard/plan-review) inherits this pattern AND the Standard — never a second visual system, never a per-report wall. STAT HONESTY RULE (canary-caught): any headline area/quantity stat on a report sheet must be PARCEL-SCOPED (clipped to the parcel ring) or explicitly labeled otherwise — a whole-modeled-region number on a parcel sheet reads as fabricated scale (the 3.47M-SF-ponding-on-0.19-ac defect, caught at 0% traffic by canary-smoke-before-shift; the discipline is load-bearing).
- Site-plan EXPORT (PDF): parcel, envelope, setbacks, road, property-line-tags, + aerial-context page. GOVERNED BY THE SHEET STANDARD v1.0 (operator-authored, binding): committed in-repo at `hauska-engine/packages/engine-core/src/site-plan/pdf/SHEET_STANDARD_v1.html` — 20 rules (3-sheet order, header form, layer weights, label collision cascade, draw-once guarantee, honest chips, number/unit form, degenerate treatment, duotone aerial + provenance strip) with the ACCEPTANCE CHECKLIST ENCODED AS TESTS (sheet-standard.test.ts, draw-call MarkRegistry seam, decode-pdf-text string scans) on gold + degenerate fixtures. A fresh county inherits the standard mechanically; do not restyle the sheet outside it.
- Terrain EXPORT (GLB mesh) + IFC export.

### 1d. The OPERATOR SURFACE (CC) a complete county serves
- Node & Graph: county roster → node list → search-by-many-ids → node detail → atoms-by-family → atom inspector (confidence n/width/basis, provenance, bitemporal, lineage) → back-nav to county list. TRUE DEPTH (2026-07-28): the /nodes list endpoint is live and the CC nav flow shipped; a faithful port of the Trading Control Tower inspector (`NodeGraphBrowser.tsx`/`AtomInspector.tsx`) may still have polish OWED — verify against _STATE.md, do not assume the CC surface is fully at target. `/nodes total` caps at 10,000 (`total_capped:true`) — roster count is capped at Bexar (~700k) scale. Search is by node-id/propId + road name; atom bodies carry NO address/APN (situsAddress is on the cortex facets, not the atom).
- Map↔node binding (click map parcel → focus Node&Graph to that node, and back).
- Spine Health board (per-adapter/per-engine firing/degraded/dead, alert on zero-with-baseline).
- The State Legend (atom contract as operator vocabulary).
- GOTCHA: node/atom INSPECT requires jsonb expression indexes on the substrate Neon (migration 008) or it TIMES OUT at county scale (the 20s gold-parcel inspect timeout). And MIGRATION MERGED ≠ APPLIED — apply + verify the index migration on the live Neon before trusting inspect.

### 1e. The HONEST CEILING (a complete county is NOT 100%)
- Depth ~99.6% of RESOLVABLE place-type parcels (honest residual = no-road-adjacency + genuinely-irregular geometry). This % IS a general target for resolvable place-type.
- Zoning coverage = f(INCORPORATED-LAND RATIO), PER-COUNTY — NOT a fixed target. Bastrop's 9.27% is BASTROP'S ratio (mostly unincorporated county land, which is legitimately unzoned — only cities zone). A dense/fully-incorporated county could be 60-70%+; a rural one lower. Label it "CITY-ZONED", never a bare % that reads as failure, and NEVER flag a legitimately-high-zoned county as anomalous or accept a broken low % in a county that should be high.
- PDD / overlay districts honestly decline (site-specific, separate wave).

## PART 2 — THE ENGINE (how the county is produced — the recipe gates)

Per 27d, the 8-gate recipe. CRITICAL HONESTY (verified in code 2026-07-28): gates 1-6 are REAL mechanical fail-closed gates (backed by tests). Gates 7 and 8 are NOT mechanical yet — they are prose/ad-hoc scripts. Do NOT trust them as fail-closed. **BUILDING GATES 7 + 8 AS REAL FAIL-CLOSED GATES IS AN ENGINE-BUILD PREREQUISITE** — a fan-out without a real smoke gate re-creates the 3-day scan-fix loop (the exact failure the program exists to prevent).

1. DESCRIPTOR IN — validates against contract; golden-descriptor test (REAL: `cook_county_il_stub.json` non-TX + a jurisdiction-literal grep gate).
2. INTAKE — parcels/zoning/roads onto the substrate. GATE: source-verified + provenance; a 404 is honest-absent, never silent zero. INCLUDES: AUTHORITATIVE-SOURCE-RECON + SCHEMA≠DATA + ENUMERATE-ALL-PUBLISHED-FOLDERS (the recon JSON is an artifact this gate checks — promoted from prose to a gate per the completeness recon).
3. ROAD + FRONT LABELING — front-labeling fixture gate (REAL: footway-ineligible, local>collector, not-by-accident).
4. RULE — road-type setback from descriptor; citation resolves to a real code atom (REAL).
5. REASONING — buildable envelope via real polygon-offset; geometry-correctness gate (REAL: contained/non-self-intersecting/correct-offset, positive-space fixtures).
6. WARM → VERIFY → PROMOTE — mechanical verify, not re-assertion (REAL: verify-mechanical.ts).
7. TALLY + COST — **NOT MECHANICAL YET.** Today: ad-hoc `.mjs` tally scripts, NO cost-per-parcel check, NO CI fail-closed. Commitment #3 (cost hard-kill) is NOT measured in code. MUST be built into a real gate before the fan-out (coverage = live SELECT per G1; cost-per-jurisdiction measured + gated).
8. SMOKE — **NOT MECHANICAL YET.** Today: prose only; no end-to-end live-availability gate in engine-core. This is G5, THE "is the data true and available in the app" benchmark that killed the scan-fix loop. MUST be built as a real fail-closed gate (click N known nodes through the LIVE ledger + map, atoms render, fails loudly) before the fan-out. SEED FROM THE 2026-07-28 QA SESSION (working skeleton, not yet a gate): (a) CC is HASH-DRIVABLE — `#panel=node-graph&county=<fips>`, `&q=<propId>`, `&node=<id>` deep-link every browse state, so browser assertions need NO canvas clicks; the session's headless-Chrome CDP script (spawn chrome --headless=new --remote-debugging-port, Page.navigate, Runtime.evaluate innerText, Page.captureScreenshot — zero deps, Node 24 global WebSocket) walked county-list/search/node-inspect live and asserted content. (b) Per-layer live probes with TIMING against the deployed BFFs (pe-hydrology POST with a fixture bbox; facets GET; MCP tools/call refresh+download asserting real `%PDF` bytes + pageCount) caught what merged code could not (the Esri LOD 500, the cold-start-vs-60s window). (c) Deployed-BUNDLE marker check (fetch index → bundle JS → assert a change-marker string) proves the prod build actually contains the change — catches the Vercel no-auto-deploy trap mechanically.

Anti-zombie (REAL, verified): reasoning lives in the engine (jurisdiction-agnostic); jurisdiction lives ONLY in descriptor + adapters + provenance. County #500 is a descriptor a background agent runs.

## PART 3 — EVERY BAKED DECISION / GOTCHA THE ENGINE MUST CARRY (the traps, so a fresh county inherits them)

These were discovered by building/fixing Bastrop. If the engine does NOT bake each, the fan-out re-derives it wrong per county. THIS is the highest-value part of the mold.

DATA / PROVENANCE:
- ZONING SOURCE IS THE CITY AGOL LAYER, cited by URL — never the internal bake URL (commitment-#1 red; hardening A1). County zoning GIS is typically DEAD.
- AUTHORITATIVE SOURCES ARE SPLIT BY JURISDICTION LEVEL — county-road vs comprehensive-roadway vs city-street are different layers; find ALL of them per county.
- SCHEMA ≠ DATA — a layer can carry owner/surface FIELDS while barely POPULATING them (Bastrop city streets: 67 defined / 994 undefined). Check DATA population, not schema existence. Keep OSM best-available where authoritative is sparse; never fabricate an authoritative label from undefined.
- UNREACHABLE-CITY-GIS — a city's GIS may not resolve (Lockhart DNS NXDOMAIN); honest-absent → OSM, never invent.
- ENUMERATE ALL PUBLISHED FOLDERS FIRST — Bastrop county publishes ~26 folders; we'd only queried 4 and missed contours/imagery/hydrography/address/subdivisions. The recipe must enumerate every published layer before deciding ingest (now a PART 2 INTAKE gate, not prose).
- THE PROPERTY BRIEF IS A CROSS-REPO PORT, not an engine output — the renderer (`buildR1Brief`, `briefingHtml.ts`, `briefingPdf.ts`) is AUTHORED in legacy-design-tools (cortex, `routes/propertyExplorer.ts`), CONSUMED by PE. An engine-builder must NOT look for it in the engine. The port carries a MANDATORY no-fabrication field-scrub: every rendered field must trace to a real payload key or it is OMITTED, never invented. (Ties to the MEMORY.md "confirm where a thing is AUTHORED not imported" trap.)
- SURFACE-SHOWS-FIXTURE (the twin of stranded-data) — a customer surface can render a plausible FIXTURE never wired to engine truth (the topo/hillshade/hydrology map layers shipped as self-contained fixtures reading zero engine DEM). Every layer/panel must be PROVEN to read live engine data; honest-not-live must be labeled and dropped, never faked. Distinct from stranded-data (data exists, no route): here a convincing fake exists where truth should be.
- LAND-USE/ACREAGE SUPPRESSED BY A COVERAGE FLAG — data present in the payload (land-use A1/cad-roll, acreage shoelace-wgs84) was HIDDEN by a facetCoverage flag. Present values must WIN over coverage flags; a flag may gate a caption, NEVER suppress a present value. (Distinct from schema≠data: that is data-absent-despite-schema; this is data-present-but-flag-suppressed.)

GEOMETRY:
- REAL POLYGON-OFFSET (polygon-clipping), never naive per-edge miter (self-intersects on concave rings).
- CLEAN CLIP ARTIFACTS before the degeneracy guard (ringHasSelfTouch); never WEAKEN the guard to pass a specimen (would let genuinely-degenerate lots fabricate).
- GEOMETRY GATE NEEDS POSITIVE-SPACE FIXTURES (good near-rects on every edge PASS), not only bad-shapes-fail — the 28286 near-rect hole.
- BOUNDARY PRIMITIVE: interior computed ONCE per ring + STORED; the offset CONSUMES it (orientation-invariant), never re-derives per edge. EVERY CONSUMER — depth-warm AND the site-plan export AND any future surface — must consume the SAME primitive; two independent per-edge computations "patched to agree" WILL drift on a future county's ring shape (caught 2026-07-28: the export path still ran its own vertex-count-branched per-edge heuristic — n==4 → geometric front guess, n≠4 → uniform-min fabrication — producing 90%-vs-55% envelopes on same-district parcels and a false degenerate on a jog ring; the fix is routing the export through the primitive, NOT hardening the heuristic). The reconciliation gate (export area == depth-warm area on the same ring+rule) must pass because they are ONE computation.
- BUILD-TO-LINE RULING (operator-ratified 2026-07-28): a side/rear axis marked not_specified ("build-to-line governs") gets ZERO INSET and the envelope is labeled PROVISIONAL — never fabricate a yard value the code doesn't state (fabrication in the other direction). The descriptor's not_specified flags are load-bearing; consumers must honor fieldProvenance.notSpecified.
- ADJACENCY at county scale = one-load + cell-grid + PIP, NOT per-edge bbox scan (O(n²); 55h on Bexar). Scales to Bexar (~700k).

INFRA / TOPO / HYDROLOGY:
- TOPO IS A CONFIG, NOT A LIMIT — 3DEP serves ~1m; the "coarse" was a 10m default. Config-to-1m is the instant win; county 1-ft contours are the additive tier.
- HYDROLOGY MUST SCALE WITH THE DEM — the 1m topo swap broke D8 flow (fetched 1m it didn't need, fixed 50-cell threshold, blew the worker budget → 504). Bake a hydrology resolution FLOOR (10m) + resolution-scaled threshold. ANY topo change must re-verify hydrology. RESIDUAL: the sibling `/dem` route still defaults to 1m; a caller doing /dem → /drainage at default can feed pysheds a 1m raster — close this or it 504s the same way.
- ENGINE COLD-START vs PE 60s CAP — cold engine-api can exceed the PE Vercel fn 60s cap on first hit; min-instances=1 eliminates it (operator cost call). MCP→engine timeout must be 50s (warm refresh ~23s).
- ESRI AERIAL EXPORT floors at its deepest cached LOD — precisely 0.298 WEB-MERCATOR-UNITS/px (level 19), NOT ground-meters; asking finer returns HTTP 500 "Error: bytes" even though service metadata advertises maxImageWidth 4096 (the advertised max is a lie for cached services; pixel count is a red herring — a 1024px request fails on a 150m box and passes on a 400m box). Live-bisected 2026-07-28: 0.300 ok / 0.296 fails. DURABLE FORM EXISTS: `AERIAL_MIN_MERC_UNITS_PER_PX = 0.33` in engine-core `site-plan/pdf/aerial.ts` + always-emit honest-unavailable panel + artifact records `aerialImageryEmbedded`/`aerialImageryUnavailableReason` + offline tests. Alignment rule baked with it: imagery requested `bboxSR=3857` and the SAME mercator bbox drives the overlay transform — never mix SRs, a misaligned overlay is worse than none.
- TIMEOUT TEXT MUST NEVER CLASSIFY AS AN AUTH/GATE ERROR — the B1 trap: an MCP→engine timeout surfaced as "unreachable … requires engine-api", and PE's failure classifier pattern-matched that into the GATE class, showing customers a false "needs an engine-api gate token" for days while auth was fine. Baked rule (PE `pe-site-plan-export-core.ts`): classifiers check timeout/unreachable-shaped messages BEFORE any gate/auth pattern; transient classes return 503 `retryable:true` with honest cold-start wording. Chain budget: each hop's timeout < its caller's window (MCP→engine 50s < PE fn 60s; engine itself 300s).
- STRANDED DATA — persisting to StoragePort ≠ serving it; every new node type/query needs a StoragePort method AND an HTTP route AND a consumer, or it's invisible (hit 3×: boundary edges, road-bbox, /nodes list). The engine must expose what it persists.

- SHEETS MUST BE OVERFLOW-AWARE — county data sizes the summary sheet (a 32-acre parcel's ~16-segment table overdrew provenance past the frame). Baked rule (engine #180): measure every block with the SAME line-box composers the draw pass uses (planned height == drawn height, no second measurement system), break to continuation sheets ("(CONTINUED)" heading, repeated table header, split only between rows, never orphan a heading), and derive every "SHEET k OF n" from the post-pagination list (no hard-coded totals — the dossier's TOTAL_SHEETS was the one that lied). Gate = mechanical frame-bottom containment test on a many-segment fixture, plus byte-stable single-sheet fixtures.

DEPLOY / OPS (all planner-owned):
- ENGINE IMAGE BUILDS GO THROUGH cloudbuild.engine-api.yaml — a bare `gcloud builds submit --tag` builds the ROOT (retrieval-api) Dockerfile and poisons the engine-api tag with the wrong service; always `--config cloudbuild.engine-api.yaml --substitutions _IMAGE=...`. And a local Ctrl-C/kill does NOT cancel the remote Cloud Build — `gcloud builds list --ongoing` + cancel, or the stray build overwrites the tag minutes later.
- Cloud Run traffic trap (new revision ≠ serving until shift-traffic); engine-api 4Gi is LIVE-SET only; Vercel does NOT auto-deploy on merge (CLI from repo root, vercel link --project first); migration MERGED ≠ APPLIED to the live Neon (apply + verify before a data-run); workflow deploys revert manual env.
- VERCEL HOBBY 12-FUNCTION CAP — a deploy FAILS (not degrades) at the 13th serverless function; a merged-green PR can be undeployable. Fix pattern: consolidate same-skeleton BFFs into one function dispatching on a query param with rewrites keeping client URLs stable (pe-map-layers 2026-07-29). Budget function slots per app; a new per-layer/per-report BFF is NOT free.
- COUNTY ARCGIS QUIRKS ARE PER-SERVICE — Bastrop's Creeks_Streams has NO FeatureServer (MapServer/0/query only) and NO pagination (resultRecordCount → 400); probe each service's real capabilities live before wiring, never assume the standard surface (hydrography adapter 2026-07-29).
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
