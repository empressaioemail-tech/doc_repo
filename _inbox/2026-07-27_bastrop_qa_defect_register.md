---
id: 2026-07-27_bastrop_qa_defect_register
title: Bastrop QA defect + scope register — the Stage-3 market-ready quality pass (living plan)
date: 2026-07-27
status: active (the QA track's living plan; ranked; fixable-now vs needs-v2-build separated)
owner: nick
planner: qa (CTX HELD)
verified: live health-board (/health/spine/run) + code read against origin/main tips (map f386190, ldt 556f297f, engine 5b6f465)
related: [27f_bastrop_through_v2_program, 2026-07-27_bastrop_composition_inventory, 2026-07-27_COMPLETE_BASTROP_hardening_audit, 75j_property_explorer_destination_ledger]
purpose: The ranked, evidence-backed defect+scope list across the six QA areas, separating "fixable now" (polish/fix on data that exists) from "needs a v2 build" (missing data / ingest), so sub-agent waves can be planned against a measurable target rather than a vibe.
---

# Bastrop QA defect + scope register

The hardening gate (D1) passed 2026-07-27: Bastrop is APPROVABLE (sound, honest, correct, provenanced; commitment #1 green — zoning-fact now cites the real AGOL layer). This register is the SECOND bar: Bastrop-DONE = sound PLUS beautiful, legible, professional, genuinely useful. QA is the gap, judged by looking at live output, never by mechanical grades.

Method note: the customer map / PDF / CC canvas cannot be pixel-inspected from this environment (sandbox has no shell egress; WebFetch renders markdown not canvas; gated endpoints 401). So this register is built from (a) LIVE population-level ground truth via the B1 health board, and (b) exact code-level rendering audit against origin/main. Per-parcel visual verification across many parcels is the ACCEPTANCE step on each fix (operator-in-the-loop looking), not the audit step. Where a fix lands, it is verified by viewing the live surface across multiple different-data parcels before it is graded MET.

## DEPLOY STATUS (2026-07-27, all five merged + deployed)

| QA | Surface | Deployed | Verified |
|---|---|---|---|
| QA1 road feather | PE prod `property-explorer-xi` | YES (Vercel Ready) | operator visual look owed |
| QA2 site-plan craft | engine-api `00095-hak` @100% | YES (canary shifted) | craft shipped; **QA2.2 template-match owed** (operator dropped a template) |
| QA3 CC majors | CC prod `cmdcenter-blush` | YES (Vercel Ready) | panels LIVE on prod keys; **node inspect TIMES OUT (20s) — QA-CC-BUG**; **inspector flow wrong — QA-CC-PORT owed** |
| QA4 overpass | retrieval `00041-hed` @100% | YES | live probe clean; migration 007 CONFIRMED applied (schema_migrations + constraint) |
| QA5 bearing parity | on main (test-only) | n/a | origin/main imports shared module + guard |

Deploy notes: engine-api deploys = Cloud Build (`cloudbuild.engine-api.yaml` builds `:latest`) then `gcloud run deploy --image --no-traffic --tag` + smoke + `update-traffic`. retrieval + Vercel apps already covered. Detour cost: 3 hygiene commits (#82/#83/#84) chasing non-fatal Vercel type warnings misread as a deploy block; PE was Ready throughout. Pre-existing BFF type bugs filed at `_inbox/2026-07-27_pe_api_bff_type_debt.md`.

## NEW WORKSTREAMS (operator input 2026-07-27 post-deploy)

- **QA-CC-PORT (major):** the CC node/atom inspector flow is WRONG. Operator's model = the Empressa Trading Control Tower (`empressa-cockpit-admin.vercel.app`; source `/p/Empressa Trading` repo `empressa-trading`, `apps/cockpit/admin/src/control/panels/NodeGraphBrowser.tsx` + `AtomInspector.tsx`). Target flow: BROWSE node list (filters node_type/asset_class/status/resolution_status/q, paginated) → click node → detail (field grid + identifiers + edges_in/out + atom_counts_by_family pills + merge-chain) → click family → atoms inline (paginated) → atom inspector (claim + JSON body + confidence n/width/basis never-bare + provenance/citation + bitemporal + access/license + TIME TRAVEL live/as-of + lineage/supersession chain) with the STATE LEGEND as a first-class right rail. CC-A was supposed to port this; it shipped a thinner hash-input version, and QA3 collapsed the StateLegend — RECONSIDER that collapse (reference keeps it visible as the decoder ring). This is a faithful-port job against real reference source, not a screenshot reverse-engineer.
- **QA-CC-BUG:** live CC Node & Graph inspect on `48021:28286` "timed out after 20000ms" + TALLY STALE (prod, keys work). Real defect — the property node inspect path is timing out. Run down separately from the port.
- **QA2.2 (site-plan template-match):** operator dropped a professional HTML/SVG template at `_inbox/2026-07-27_qa2_site_plan_craft_samples/Siteplan style template design/` (`Site Plan Template.dc.html` + `Site Plan Template v1 (3 options).dc.html` + `ds-industry.css`, Barlow fonts). DECISION: port the template DESIGN into the existing pdf-lib engine (embed Barlow TTF; header/stat-cluster, SVG-style drawing w/ edge bearing tags, accent setback labels, legend swatches, graphic scale bar, honesty footer) — NOT switch to HTML→PDF. QA2 craft ships now; this is the follow-up design pass.

## IN FLIGHT (2 builders dispatched 2026-07-27, operator said "do the work with sub-agents + deploy everything")

- **CC inspector port + timeout** → branch `qa/cc-inspector-port` (hauska-map). Faithful port of the Trading Control Tower flow (`/p/Empressa Trading` NodeGraphBrowser+AtomInspector) into CC, wired to spine endpoints (honest-empty where spine lacks a list/merge-chain/lineage/as-of endpoint), State Legend kept VISIBLE (un-collapse the QA3 collapse), + fix the 20s node-inspect timeout on 48021:28286. Preview will show DEGRADED (no keys) — verify live on prod after merge.
- **QA2.2 template-match** → branch `qa/site-plan-template-match` (hauska-engine). Port the template design into pdf-lib, embed Barlow, `_v2` sample PDFs written to the samples dir for comparison.

Planner (this seat) verifies both live, then deploys: hauska-map = Vercel prod (repo-root link=cmdcenter for CC; `apps/property-explorer` link for PE); hauska-engine site-plan = engine-api Cloud Build → `gcloud run deploy --image --no-traffic --tag` → smoke → update-traffic. No builder self-grades.

## EXPORT "ENGINE API UNREACHABLE" — RESOLVED (no gate regression; honest-refusal + pre-fix mislabel)

Operator flagged PE "Export site plan" → "Engine API unreachable at .../v1/property-nodes/48021:39282/site-plan-export/refresh". Investigated in depth (planner + 2 agents), reconciled against LIVE logs + Neon:
- The gate is HEALTHY — NOT a regression. Deployed MCP (`00029-9xn`) signs, deployed engine-api (`00097-pij`) verifies (`gate_context_verified` in logs). `GATE_CONTEXT_SIGNING_KEY` one version, matches both. `GATE_CONTEXT_MODE` unset (log-mode, never rejects). Every logged MCP→engine site-plan error in the last 3+ days is **422**, zero 401/500/timeout.
- The 422 = engine's honest-absence guardrail (`parcel-terrain.ts:262` `setback_rule_missing` — refuses to fabricate F/S/R for parcels lacking a setback-rule atom; commitment #1). A data-coverage state, not a fault.
- Planner's original "missing Bearer token" diagnosis was WRONG (owned): engine-api needs a signed gate-front context (only MCP calls it); the 401 the planner saw was a DIRECT header-less hit = gate working as designed. PE's HAUSKA_ENGINE_API_KEY was already set.
- The screenshot parcel `48021:39282` HAS setback-rule + buildable-envelope atoms (verified Neon) — so it would NOT 422; and there is NO logged 39282 failure. Conclusion: the operator saw the PRE-FIX-1 mislabel (old BFF said "unreachable" for ANY non-2xx). FIX 1 (shipped + deployed PR #86) now distinguishes gate-config / payment / honest-refusal / genuinely-unreachable — so a parcel-with-setbacks now exports (201) or shows an honest message, not "unreachable".
- Broader: 5,729 setback-rule atoms = 5,729 buildable-envelope atoms in Bastrop (Neon). Parcels WITHOUT a setback-rule (PDD/unstamped) honestly 422 — that's coverage, addressed by zoning/setback stamp expansion (wired-city-stamp gap), NOT a gate/export fix.
- REMAINING (operator belt-and-suspenders): confirm a live PE export on a setback-having parcel returns 201 through the paid path (needs a paid X-Hauska-Key; planner has it). FIX 2 (the gate) turned out to be a non-issue — nothing to fix.

## QA-TOPO (v2-fidelity BUILD, greenlit 2026-07-27) — real topography ingest, REPLACE-NOT-BREAK

Ranked as a v2-fidelity BUILD (ingest + wire + re-verify consumers), NOT a styling fix. This is QA-STUDY-2 from Bucket C, now greenlit. The operator expected "nice tight topography"; terrain is still USGS 3DEP ~10m (confidence 0.60 asserted). This ADDS real topo as an ADDITIVE fidelity tier with provenance and honest 3DEP fallback — it must not break the downstream consumers.

SWAP SURFACE (scouted by planner 2026-07-27, before dispatch):
- DEM parse/source: `packages/engine-core/src/site-topography/derivation.ts` (parses a 3DEP GeoTIFF into ParsedDem; derives contours via d3-contour). THE swap point.
- Integrity gate: `parcel-terrain/elevation.ts` (NAVD88 datum; fail-closed on nodata-as-zero spikes). New topo must pass or extend this gate.
- Consumers (parcel-terrain public API): `mesh.ts` (GLB), `emitters.ts` (DXF-3dface, DXF-contour, IFC via runIfcWorker/runDxfWorker → Python `artifacts/ifc-worker/run.py` + `dxf-worker/run.py`), `solid-mass.ts` (the IFC solid the terrain sits under), `author.ts` (orchestration).
- Downstream: site-plan PDF contours (`site-plan/pdf/`), PE terrain export (`hauska-map .../api/pe-terrain-export*` + `TerrainExportSection.tsx`), PE site-plan export, CC `ParcelTerrainTile.tsx`.
- UNKNOWN until Phase 1: WHERE the DEM bytes come from today (live 3DEP fetch? bboxOverride? synthetic on samples?) — the enumerate agent must establish this; it decides the ingest wiring.

SOURCES TO INGEST (v2-sourcing recon; enumerate what's actually published FIRST):
- 1-ft/2-ft contours: Bastrop County `RoadAndBridgeMap/Contour1Ft2017` + `Contour2Ft2017` FeatureServers (county-authoritative).
- LiDAR/higher-res DEM: TxGIO/TNRIS StratMap (free, statewide point cloud).
- ALSO audit county `Topography/Topography_BP/Hydrography/Imagery` folders — never looked; enumerate published layers before choosing the source.

PIPELINE (gated; planner adversarially reviews each phase before the next):
1. ENUMERATE-CONSUMERS + SOURCE-RECON (read-only) → verified consumer list + what elevation each reads + where DEM comes from today + a live enumeration of the county topo/hydro FeatureServers (what's actually published, resolution, coverage). PLANNER ADVERSARIALLY VERIFIES this against the code before any ingest. No incomplete map → no swap.
2. INGEST additive fidelity tier (LiDAR/1ft where available) WITH provenance (source/vintage/resolution), 3DEP honest fallback where absent. Do NOT rip out 3DEP.
3. PER-CONSUMER RE-VERIFY LIVE on gold parcels (IFC export valid, GLB exports, hydrology computes + improved, contours render, site-plan intact) — before/after per consumer, pasted.
4. RENDER the now-better terrain (tight contours, clean hillshade) on map + report.

NEGATIVE DONE-LINE (any = NOT done): IFC export breaks/degrades; terrain GLB breaks; hydrology stops/regresses; contours vanish/wrong; new topo shown without honest provenance; 3DEP ripped out leaving gaps where LiDAR absent (must fall back honestly). CTX HELD; deploys planner-owned.

### SCOPE DECISION (operator 2026-07-27, post-recon): Option 1 — batched terrain-fidelity workstream

RECON REFRAME (planner-verified live): 3DEP already serves ~1m (pixelSize 0.9999999900, F32 — verified `.../3DEPElevation/ImageServer?f=json`). The "coarse ~10m terrain" was a CODE-DEFAULT (`resolutionMeters: 10`), NOT a source limit. So the fidelity gap is smaller than the "10m" framing implied. Operator scoped Option 1 (both moves as ONE workstream — touch the terrain pipeline once, verify IFC/hydrology/consumers once):
1. CONFIG-TO-1M (instant, safe): lower the 3DEP request from 10m toward 1m (source already serves it; adaptive ladder already supports it). Watch `MAX_PIXELS_PER_AXIS=4096` on large bboxes (catchment-scale hydrology fetch especially). Zero new source, zero consumer-source-assumption change.
2. INGEST 1-FT CONTOURS (the real fidelity): Bastrop `RoadAndBridgeMap/Contour1Ft2017/FeatureServer/0` — VERIFIED LIVE: esriGeometryPolyline, `contour` field (Double), 1,122,076 features, county-wide extent, range 258–765, WKID 2277 (TX State Plane US-feet), vertical NAVD88 **US SURVEY FEET** ("1-ft contours from 2017 StratMap LiDAR"). Additive tier with provenance (source/vintage/resolution), 3DEP fallback outside Bastrop's-plus-9-neighbors footprint. CRITICAL RECONCILIATION: `contour` is US-survey-FEET NAVD88; 3DEP is METRES NAVD88 — must convert ft→m (US survey foot = 1200/3937 m, NOT international foot) or every feature trips `assertTerrainElevationIntegrity` (258–765 ft vs ~120–235 m band). Vector = no nodata risk.
3. DEFERRED (not this build): raw StratMap 50cm/1m IMG DEM (TxGIO `api.tnris.org` collection `0549d3ba-...`, 470 Bastrop-covering tiles, NAVD88/GEOID12B/UTM14N) — download-and-mosaic (not a live service), marginal grid gain over 3DEP's existing 1m, and UNDOCUMENTED nodata (needs a tile pull + gdalinfo before it can cross the integrity gate). Skipped as low-value/higher-risk; revisit only if the 1m-config + contours don't satisfy.

HYDROLOGY NOTE (from consumer map): hydrology has its OWN separate `fetchUsgs3depDem` and downsamples to 256² — the config-to-1m helps terrain-mesh/contours immediately but does NOT auto-improve hydrology unless the 256² cap is also raised. Decide during ingest whether hydrology is in-scope for this batch or a follow-up (it's a separate cap change, not a source change).

### PHASE 1 CONSUMER MAP — planner-adversarially-verified 2026-07-27 (Phase 2 ingest diffs against THIS)

THE SWAP POINT (single seam for the terrain-mesh/contour/IFC pipeline): `packages/adapters/src/topography/usgs3dep.ts:411` `fetchUsgs3depDem()` → hits `elevation.nationalmap.gov/.../3DEPElevation/ImageServer/exportImage` (line 49), F32 GeoTIFF, no auth, default 10 m/px, adaptive ladder `[10,5,3,2,1]` toward a 1 m floor, hard `MAX_PIXELS_PER_AXIS=4096` cap (line 62). `resolutionMetersActual` is ALWAYS `null` on the `f=image` path (line 170/523) — the honest floor a 1-ft/LiDAR swap must fill in. Parsed by `site-topography/derivation.ts:52` `parseDemBytes` → `ParsedDem{width,height,values(NaN=nodata),minElevation,maxElevation,nodataCount}`. bbox/ring from real parcel store (`parcel-geometry-resolver.ts`), NOT synthetic (synthetic DEM is sample-script + hydrology-warm only, never prod).

CONSUMERS (all must re-verify green post-swap):
- Terrain MESH/GLB `parcel-terrain/mesh.ts` (O(w·h) vertices — explodes at 1-ft; GLB size scales).
- IFC export `parcel-terrain/emitters.ts:224` + `solid-mass.ts:79` + Python `artifacts/ifc-worker/run.py` (denser tessellation; solid-mass fails closed if a nodata notch carves the rim — HIGHER RISK at higher res).
- DXF 3dface + DXF contours `emitters.ts:102,124`; Python `dxf-worker/run.py`.
- Contour derivation `site-topography/derivation.ts:119` (d3-contour).
- HYDROLOGY `services/engine-api/src/routes/hydrology.ts:80` — has its OWN separate `fetchUsgs3depDem` @10m and DOWNSAMPLES to ≤256×256 (`MAX_DRAINAGE_CELLS`, line 43-54). CRITICAL: higher-res 3DEP barely helps hydrology unless that cap is raised — "improve hydrology" ≠ automatic from the swap; it's a separate cap change. pysheds worker `artifacts/hydrology-worker/`.
- Site-plan contours + elevation labels `site-plan/site-model.ts:246,360,475` → PDF `site-plan/pdf/render.ts:329`.
- parcel-terrain-model ATOM `parcel-terrain/author.ts:145` + `site-plan/author.ts:305` (confidence 0.6 asserted at author.ts:174 / site-plan author.ts:334; `resolutionMetersActual` should become non-null on swap).
- engine-api routes `parcel-terrain.ts:187,255` (export/site-plan), `topography.ts:37,123` (/contours,/dem), `mapLayersWave3.ts:245,275` (map DEM+topo slots @10m hardcoded).
- MCP proxy `hauska-mcp-server engine-api-client.ts:367,400` + hardcoded "USGS 3DEP"/"elevation.nationalmap.gov/3dep" strings in `atom-shape.ts:279`,`tool-copy.ts:56,140` (source-RENAME would misattribute — update on swap).
- PE terrain-export + site-plan-export BFFs (hardcoded format lists), CC `ParcelTerrainTile.tsx:622` (surfaces resolutionMetersActual — changes when populated).
- NOT a consumer (do not migrate): map-renderer `gis-terrain.js`/`gis-hydrology-flow.js` are SELF-CONTAINED FIXTURES, zero engine DEM read.

INTEGRITY GATES (must stay green): `assertTerrainElevationIntegrity` (`parcel-terrain/elevation.ts:46` — mesh Z within DEM band ±0.05; land-parcel nodata-spike refusals) — HIGHEST-RISK GATE: a 1-ft/LiDAR source with UNTAGGED nodata (e.g. -9999 without GDAL_NODATA) would drag minElevation down and trip the band; probe a real 1-ft sample's nodata encoding EARLY. Plus IFC `assert_complete_spatial_model` (NAVD88 required), DXF NAVD88 assertions, `usgs3dep.test.ts` (default-10m + adaptive-ladder + 4096-cap — a 1-ft default violates the cap for larger bboxes and changes these expectations), solid-mass closed-solid, derivation nodata tests.

PLANNER ADVERSARIAL FINDING (enumeration miss, corrected): the report claimed usgs3dep is the ONLY DEM fetch. Verified FALSE — `packages/adapters/src/federal/usgs-ned.ts` is a SECOND elevation source (USGS EPQS point-query `epqs.nationalmap.gov/v1/json`), wired as `usgsNedAdapter` in the general adapter registry. It is a PARALLEL spot-elevation data atom (per-parcel summary alongside FEMA/EPA/FCC), NOT a terrain-DEM-mesh consumer — so NOT in the break-risk set, but the topo build must NOTE it so two elevation sources don't tell different stories. Terrain-mesh swap seam remains the single `fetchUsgs3depDem`.

UNCERTAIN (resolve in Phase 2 pre-ingest): mcp-server test assertions on the hardcoded 3DEP strings (unread); whether a live cortex-api path still fetches/persists DEM contours independently (no cortex clone under /p/); the TRUE native 3DEP resolution today (needs a live `f=json` probe for the before/after baseline); the actual nodata encoding of a real Bastrop 1-ft sample (the highest-risk unknown for the integrity gate).

## The three buckets

- **BUCKET A — fixable now** (styling / layout / craft on data that already exists and serves). No new data, no ingest, no hardening-file collision. These can be dispatched immediately.
- **BUCKET B — design-then-build** (needs a spec before a fixer; the data mostly exists but the surface must be designed: report suite, render-what-exists study layers, non-drawing-parcel UX).
- **BUCKET C — NOT a QA fix; a deferred fidelity-v2 build** (missing data / ingest). Flagged so it cannot masquerade as rendering polish. The LiDAR/topo/hydrology ingest lives here.

## LIVE ground truth (health board, /health/spine/run @ 2026-07-27T16:24Z)

Population-level, not gold parcels. All firing unless noted: parcels 74,729; boundary-edges 26,454; depth-warm 3,642 (`depth-warm-promoted-v1`); zoning-agol firing (574 features, PlaceTypeClass); rule-setback resolves P-5 front=15ft on 48021:33512; reasoning-chain complete (zoningFact+setbackRule+buildableEnvelope). Two honest findings fell out of the board itself:
- **osm-overpass DEAD, alert=true** (HTTP 504). Roads still serve today via county-roadway (11,351) + streets-surveyed-2016 (1,307), so this is masked — but it is a live single-source-fragility signal, not a non-event. Register item QA-BEHAV-2.
- **S-14 bake lag = 444** (txgio zd 6213 vs tier1 zoning_present 5769). Accepted in writing per the hardening audit; monitored live. Not a QA fix; noted.

No silent-wrong-answers surfaced at population level. Per-parcel behavior verification (city + county, many parcels, anti-fixture) is QA-BEHAV-1, pending the gated-endpoint key / operator-in-the-loop.

---

## RANKED REGISTER

### AREA 1 — ROAD RENDERING (styling; data is sound) — BUCKET A

The "heavy/doubled/overlapping blue bands" are literally three stacked opaque fixed-pixel lines per road, drawn ON TOP of parcels, with zero zoom-scaling. All confirmed against origin/main in `hauska-map`.

| # | Defect | Evidence (file:line) | Fix |
|---|---|---|---|
| RD-1 | Doubled band: centerline (2.5px) + 2 ROW edges (1.5px each) = 3 stacked opaque strokes per road | `road-overlay.ts:81-107` | Collapse to a single cased line; drop ROW edges or gate to zoom >=18 |
| RD-2 | Zero zoom-scaling: every width is a fixed pixel constant; roads render full 2.5px at z14 (most zoomed-out, most crowded) | `road-overlay.ts:90,104`; renderer choke point `overlay-render.js:193-215,204` | Convert widths to `["interpolate",["linear"],["zoom"],...]` |
| RD-3 | Z-ORDER bug: roads paint ABOVE parcels (no `beforeId`), re-added above on every pan/zoom | `overlay-render.js:198`; parcels `parcel-tiles.js:159,175,187` | Pass `beforeId` so roads draw beneath parcel line/fill; roads obscuring parcels is a render-order defect, not a data one |
| RD-4 | Heavy saturated blues + high opacity (0.85-0.95) so roads dominate | `road-overlay.ts:12-13` (`#1a5f9e`,`#3b82b0`) | Desaturate to low-contrast grey-blue; drop opacity ~0.7 |
| RD-5 | No road on/off or opacity control (roads not in LAYER_REGISTRY, pushed unconditionally) | `layer-registry.js:23-92`; `road-overlay.ts:92,106` hard `visible:true` | Register road layer; honor visibleLayers/opacity in chrome |
| RD-6 | Intersections stack (no dedup/merge of coincident geometry) → "blobs" | `road-overlay.ts:52-78` | Largely resolved by RD-1/RD-4 (thin+low-opacity); true fix merges coincident segments |
| RD-7 | No shared map-style token module; road color/width/opacity scattered inline | `road-overlay.ts`, `overlay-render.js`, `live-gis.ts` | Introduce `mapTokens.ts` / single road-style module |

Single-builder shape: one fixer, targets `road-overlay.ts:81-107` + `overlay-render.js:193-215` (the one choke point for zoom-expr + beforeId across all overlay lines). Promote a styling regression test (RD-2/RD-3 go red on pre-fix code). Zero hardening collision.

### AREA 2 — PE MAP APP UI (customer's primary surface) — BUCKET A (+ some B)

MapLibre GL via `@hauska/map-renderer`. Roads are Area 1. Remaining PE-map surface:
- QA-PE-1 [A]: Parcel legibility once roads recede — parcel strokes are fixed 1.1-1.4px, fill-opacity 0.14-0.32, no zoom-scaling (`parcel-tiles.js:46-95`, `live-gis.ts:183-195`). Verify parcels read cleanly at every zoom after the road z-order fix.
- QA-PE-2 [A]: FEMA flood overlay IS rendered on the map (`ExplorerMap.tsx:162,258,610`) — QA is "does it render well / legibly," part of the study story (Area 3) but the surface exists.
- QA-PE-3 [B]: Full customer-surface UX audit (InspectCard, layer control discoverability, mobile/PWA, honest-decline copy) — needs an operator-in-the-loop looking pass across many parcels; this is where the "premium product not debug view" bar is judged. Decompose after the road/parcel styling lands so the audit isn't dominated by the road noise.
- QA-PE-4 [B]: Non-drawing-parcel UX (Flagged Risk A) — at the true ceiling ~13% of parcels (honest-irregular + no-road) show NO envelope. What does the customer SEE and what can they DO? Engineering-honest != customer-ready. Needs a small design spec.

### AREA 3 — SITE-PLAN EXPORT + REPORTS + STUDY RENDERING

**3a. Site-plan PDF craft — BUCKET A** (`hauska-engine`, pdf-lib, `render.ts:308`). Bones are good (parcel-primary fit + street clipping IN; provenance panel strong). Craft is weak:

| # | Defect | Evidence | Fix |
|---|---|---|---|
| SP-1 | Collision engine SILENTLY gives up — after 12 iterations draws the label overlapping anyway | `annotation-placement.ts:149-155` | Add fallback: leader line, shrink, or drop; never silent-overlap |
| SP-2 | Fixed font sizes (7pt) vs geometry-scaled drawing → small parcels overlap by construction | `render.ts:154,165,119,176`; `layout.ts:284,312` | Scale font to parcel draw-scale, or leader-line small parcels |
| SP-3 | Two disjoint label passes (tags outward / setbacks inward) don't share `placed[]` | `layout.ts:278` vs `:319` | Single shared collision set across both label classes |
| SP-4 | Collision boxes estimated (`0.52*len`) not measured (pdf-lib `widthOfTextAtSize` available) | `annotation-placement.ts:90-92` | Use real measured widths |
| SP-5 | Street/contour/elevation/footer labels bypass collision entirely (fixed offsets) | `render.ts:110-122,172,176` | Route through the collision engine |
| SP-6 | Crude north arrow (bare line + "N", no arrowhead/rose) | `render.ts:183-184` | Proper north-arrow graphic |
| SP-7 | Crude scale bar (line + text, no ticks/graphic divisions/imperial) | `render.ts:185-192` | Graphic scale bar with ticks + 0/mid/max + feet |
| SP-8 | 3-word inline legend, no swatches / line-style key (dashed-setback vs solid-property) | `render.ts:33-36` | Real legend with swatches |
| SP-MISSING [B] | No sheet border/neatline; no bordered title block (scale/date/drawn-by/sheet#/rev); no on-drawing lot-area callout; no leader lines | — | Design additions (spec then build) |

**3b. Other reports (the report suite) — BUCKET B.** Design work, not a fix. Each report held to the same professional bar as the site-plan sheet. Scope: which reports (buildable-summary, constraints, flood, terrain, three-persona variants), what each contains, shared design language. Needs a design spec before any fixer.

**3c. STUDY RENDERING (topo + hydrology) — SPLIT: B (render-what-exists) and C (the ingest).** This is the honest gap and the register holds the line hard.
- Reality (traced in code): terrain today is an EXPORT-ONLY feature — download GLB/IFC/DXF-3dface/DXF-contour from USGS **3DEP ~10m** (`TerrainExportSection.tsx`; `parcel-terrain.ts`; source cite literally "USGS 3DEP", confidence asserted). There is **NO topo/contour/slope map LAYER** on the customer map at all. FEMA flood IS a rendered map overlay. LandXML TIN is explicitly deferred.
- CC structural tell: Site Analysis already has empty/thin tile slots named `['map','topography','drainage','hydrology','subsurface']` (`presets.ts`). The slots exist; the study surfaces behind them are thin/absent.
- **QA-STUDY-1 [BUCKET B, render-what-exists]:** add a topo/contour map layer from the 3DEP data already exported + polish the existing FEMA flood overlay. Renders honestly at ~10m; does NOT pretend to be survey-grade. Real, buildable-now improvement.
- **QA-STUDY-2 [BUCKET C, v2 ingest — NOT a QA fix]:** 1-ft contours + LiDAR + real hydrology (flow/drainage) depth. Recon-found, NOT ingested. No rendering polish converts 10m into 1-ft. This is its own big fidelity-v2 build item, flagged, owner-less until the operator schedules it. The current visible "study" output being road lines rather than topo is BECAUSE topo has no map-render path — QA-STUDY-1 gives it one at honest fidelity; QA-STUDY-2 gives it real depth.

### AREA 4 — BASTROP PARCEL BEHAVIOR VERIFICATION (city + county) — cross-cutting ground truth

- QA-BEHAV-1: Click through MANY real Bastrop city + county parcels (not golds — anti-fixture), confirm envelope/setbacks/roads/tags render correctly OR honest-decline, no silent wrong answers. Population-level ground truth is GREEN via the health board; per-parcel visual pass is the acceptance step, needs the gated-endpoint key or operator-in-the-loop. This is the method that validates the whole inventory, not a single defect.
- QA-BEHAV-2 → **QA4 GO** (2026-07-27): osm-overpass DEAD/alerting was masked by county-roadway; now a real fix — fallback + honest degraded (no silent zero roads) + retry/backoff + probe semantics. Dispatch: [`_dispatches/2026-07-27_QA4_overpass_honest_fallback.md`](../_dispatches/2026-07-27_QA4_overpass_honest_fallback.md). Coordinate with B1 probe (extend, do not collide).

### AREA 5 — COMMAND CENTER (major adjustments) — BUCKET A/B

Operator direction: audit-and-propose, lean node-atom-flow legibility. Audit found legibility issues AND two bigger structural ones. Ranked worst-first (`hauska-map/apps/command-center`, origin/main):

| # | Adjustment | Severity | Evidence | Note |
|---|---|---|---|---|
| CC-1 | Reclaim 504px fixed side chrome — StateLegend (296px, reference-only glossary, non-collapsible) + NavRail (208px) always-on | MAJOR | `StateLegend.tsx:5-8` ("explains state, does not show it"); `NavRail.tsx:69` | Collapse StateLegend to a drawer; give width to inspector/map. Biggest usability win. |
| CC-2 | Node & Graph buries the walk under a 12-column stats table (horizontal-scroll spreadsheet) — the flagship CC-A feature is below the fold | MAJOR | `NodeGraph.tsx:729-779` | Promote NodeInspect to top; move/collapse the Central-TX tally |
| CC-3 | Design-token system split — undefined `--color-background-tertiary` (4 refs render transparent); LiveMapTile runs on `--h-*` fallback-hex; design-tokens imported only inside SpacePanel not the shell | MAJOR | `SpacePanel.tsx:721,814`; `LiveMapTile.tsx:100-115`; `main.tsx:19` | One namespace, defined once, imported at root |
| CC-4 | Type scale too flat and too small (9.5-11px everywhere; one 14px node name) | MEDIUM | `primitives.tsx:24-31,71`; `NodeGraph.tsx:235`; `AtomInspector.tsx:138` | Real type scale; lift atom-id/caption floor off 9.5px |
| CC-5 | Breadcrumb shows one hop, not the traversal (no node>family>atom trail) | MEDIUM | `NodeGraph.tsx:681-689`; `AtomInspector.tsx:642-643` | Render the full walk trail |
| CC-6 | Map is a cramped 1/5 grid cell in an already-narrowed column | MEDIUM | `presets.ts` 3x2; `SpacePanel.tsx:750-762` | First-class/expanded map default (touches Track-C map-swap; coordinate) |
| CC-7 | Four inconsistent card/container idioms (NodeGraph rows / tally table / SpineHealth grid / SpacePanel tiles) | MEDIUM | as cited | Standardize one card primitive |
| CC-8 | Two atom-row renderers; raw truncated JSON in cells; stale NavRail group comment; hand-rolled buttons | MINOR | `NodeGraph.tsx:182-243` vs `AtomInspector.tsx:151-180`; `SpineHealth.tsx:64`; `NavRail.tsx:3-4` | Hygiene |

Cleanest recent work: the B1 Spine Health panel is correctly integrated (shared Panel/registry/probe), not bolted on. Its only nits are shared with the rest of the console.

Coordination: CC-6 (first-class map) overlaps the separately-HELD Track-C thin-engine-panel + map-swap. CC health-board is B1's (merged). My CC work is quality/layout on what exists; flag Track-C-shaped items, don't collide.

### AREA 6 — bearing parity → **QA5 GO** (2026-07-27)

- **PARITY RISK on branch `pr-151-c1`:** it DELETES the shared-module import and re-inlines a full copy of the bearing/tag formula into `annotation-placement.ts`. If merged, PDF bearings and atom bearings come from two independent copies. origin/main is correctly unified (thin re-export from `geometry/gis-property-line-tags.ts`). **QA5** restores/keeps the single shared formula and promotes a mechanical parity guard so the fork cannot reappear. Dispatch: [`_dispatches/2026-07-27_QA5_bearing_parity_restore.md`](../_dispatches/2026-07-27_QA5_bearing_parity_restore.md).

---

## Dispatch shape (fewer agents, tighter contracts)

Ready-now BUCKET A waves (no design spec, no collision):
1. ROAD-STYLING fixer — Area 1 (RD-1..RD-7); one builder; `road-overlay.ts` + `overlay-render.js`; styling regression test promoted. → **QA1**
2. SITE-PLAN-CRAFT fixer — Area 3a (SP-1..SP-8); one builder; `annotation-placement.ts` + `render.ts` + `layout.ts`; label-non-overlap test promoted. → **QA2**
3. CC-STRUCTURE fixer — CC-1/CC-2/CC-3 (the three MAJORs); one builder; then a CC-legibility pass (CC-4..CC-8). → **QA3**
4. **QA4 GO** — Overpass honest fallback (`hauska-engine`); dispatch `_dispatches/2026-07-27_QA4_overpass_honest_fallback.md`. Self-contained; coordinate B1 probe only.
5. **QA5 GO** — Bearing parity restore (`hauska-engine`); dispatch `_dispatches/2026-07-27_QA5_bearing_parity_restore.md`. Self-contained.

BUCKET B (design-then-build; spec first):
4. Report-suite design spec (3b), study render-what-exists spec (QA-STUDY-1 + FEMA polish), non-drawing-parcel UX spec (QA-PE-4).

BUCKET C (flag, don't build under QA):
5. LiDAR/1-ft-contour/hydrology ingest (QA-STUDY-2) — its own fidelity-v2 item, operator-scheduled.

Every fix: builder does NOT self-grade; planner verifies live across multiple different-data parcels before MET; promote to a mechanical guard where possible (styling regression, label-non-overlap, parcel-behavior smoke).
