---
title: MAP/UX scope — three net-new items on the Texas launch push
date: 2026-08-11
status: scoping pass (read-only; no code changed)
repos_read: hauska-map (current), legacy-design-tools-wave0 (4 behind, read from origin/main), hauska-engine (4 behind, read from origin/main)
machine_artifact: _inbox/2026-08-11_MAPUX_scope_three_net_new.json
---

# Scope: three net-new UI/UX items

Read-only scoping pass on three items the operator added to the Texas launch push. No implementation. Output is intended to become executor dispatches.

## Staleness check first

`P:\hauska-map` is current: HEAD `5041236` on `feat/statewide-parcel-tiles`, zero commits behind and zero ahead of `origin/main` (the branch is merged and identical to main). The two supporting checkouts were not current. `P:\legacy-design-tools-wave0` sat 4 commits behind on `feat/manifest-observability-tables`, and `P:\hauska-engine` sat 4 commits behind. Every finding attributed to those two repos below was read from `origin/main` via `git show`, never from the working tree. This matches the pattern the task flagged, and it mattered: the footprint writer commits and the boundary migration both live in ranges the local checkouts had not pulled.

## The short version

M2 is the smallest item and carries the sharpest trap. M1 sounds like frontend work and is actually blocked on a missing server read path. M3 is not a UI item at all; it is three stacked builds sitting on data that was never applied. None of the three is a one-line change, and only M2 can ship on its own.

## M1 — highlight cities and counties on search

Complexity M. Data exists but is unreachable.

Today the search box is a Photon type-ahead through the same-origin BFF at `/api/pe-geocode`. Every geocoder hit gets classified into one of four kinds by `classifyFeature()` in `apps/property-explorer/src/lib/search-kinds.ts:68` — parcel, address, street, or place — and both cities and counties fall into the catch-all place bucket. Selecting a place runs `executeSearchLanding` case `place` at `apps/property-explorer/src/lib/search-landing.ts:94`, which calls `fitExtent` with Photon's rectangular bbox. The camera moves. Nothing is drawn. There is a telling asymmetry here: the `street` kind does get a visual, a fading cyan rectangle painted by `highlightStreet` at `apps/property-explorer/src/browse/ExplorerMap.tsx:738`, but place deliberately does not. So a city search today recenters on a rectangle and highlights nothing, which is precisely the gap the operator noticed.

The key data question has a clean answer and an ugly consequence. The polygons are real: `tx_city_boundary` holds roughly 1,225 TxGIO/CPA city polygons keyed by `geo_id`, and `tx_county_boundary` holds 254 Census TIGERweb polygons keyed by `county_fips`, both created by `legacy-design-tools:lib/db/drizzle/0070_tx_city_and_county_boundary.sql`. Geometry is GeoJSON in WGS84 stored as jsonb, with per-row bbox columns indexed and documented as backing viewport pre-filter without decoding the jsonb. That is a well-built table.

The consequence is that the polygons live in a Postgres database, not a tileset and not a GeoJSON asset, and nothing reads them. A grep across `legacy-design-tools` `origin/main` for `txCityBoundary` and `txCountyBoundary` returns the ingest CLI, the two schema files, and `schema/index.ts`. That is all. There is no API route, no service layer, no BFF, no tile build. `hauska-map` contains no reference to city or county boundaries anywhere in the tree. So the recorded status "L1 city + county boundaries DONE, LIVE — 1,222 city + 254 county polygons" is true about ingest and misleading about availability. The frontend cannot reach this data today, and a dispatch written from the summary line would send an executor to build a highlight against something the browser cannot fetch.

There is a second problem the summary would not have surfaced. Photon does not reliably return counties. Probing live on 2026-08-11, the query "Bastrop County" returns Bastrop County High Point (a `natural=peak`) and three parks; the county polygon is absent from the result set entirely. "Travis County Texas" returns a courthouse and two cemeteries. Only the bare token works: "Bastrop" returns `type: "county"` at rank one and `type: "city"` at rank two. Since "Bastrop County" is how a user would naturally type it, an implementation that simply reads Photon's type field will silently fail on the most common county query. The better design is to serve jurisdiction suggestions from our own boundary names, which we already own for all 1,225 cities and 254 counties. The existing TODO at `search-kinds.ts:8` already points in that direction, and it would remove a third-party dependency from the launch wedge.

The pattern to copy already exists in the codebase. The Opportunity Zone layer is a statewide polygon set fetched once, simplified server-side with `TEXAS_OZ_STATEWIDE_MAX_OFFSET = 0.001` in `apps/property-explorer/api/_lib/pe-opportunity-zone-core.ts`, turned into an `OverlaySpec` by `toOpportunityZoneOverlay` at `packages/map-renderer/src/live-gis.ts:891`, and wired into the viewport effect in `ExplorerMap.tsx` around line 466. A boundary layer is the same shape of problem with the same shape of solution.

One hard constraint on where the fetch lives. `apps/property-explorer/api/` currently holds exactly 11 serverless function files, and `vercel.json` documents a Hobby-plan cap of 12 — a prior consolidation already collapsed three functions into `pe-map-layers.ts` for exactly this reason. A new `/api/pe-boundary.ts` would burn the last slot. The boundary fetch must fold into `pe-map-layers.ts` as a `layer=` branch with a `vercel.json` rewrite.

Worth firewalling early: migration 0070's own comment frames these tables as enabling "real point-in-polygon in-city determination instead of address-string inference." The moment a read path exists there will be pull to use it to decide which jurisdiction a parcel is in. That changes what the product asserts, not just what it draws, and it should not ride along on a cosmetic highlight PR.

## M2 — open on all of Texas instead of downtown Bastrop

Complexity M. The constant change is trivial; the companion change is not optional.

The current values, quoted with file and line. `apps/property-explorer/src/lib/config.ts:37` declares `export const DEFAULT_CENTER = { latitude: 30.1105, longitude: -97.3184 };`, passed as the mount-time seed at `ExplorerMap.tsx:1412` as `center={DEFAULT_CENTER}`. The same coordinates are mirrored at `packages/map-renderer/src/chrome/sharedMapDefaults.ts:15` as `SHARED_DEFAULT_CENTER`, duplicated rather than imported so PE vitest can resolve without a renderer build, and both files carry explicit comments that the two must stay in lockstep per CC-A WDLL 7.

The zoom is a trap. `config.ts:40` exports `DEFAULT_ZOOM = 15`, and that constant has zero consumers anywhere in the repo. The zoom actually applied is the hardcoded fallback at `packages/map-renderer/src/map-renderer.js:206`, `zoom: savedViewState?.zoom ?? 15.2`. An executor told to change the default zoom will edit `DEFAULT_ZOOM`, observe no behavior change, and either thrash or conclude the deploy failed. Both files must be named explicitly in the dispatch. Two further hardcoded Bastrop coordinates sit at `FloatingMap.tsx:206` and `FloatingMap.tsx:308`.

Now the single most important finding for M2. The parcel tile layer has no minzoom gate, and this is explicit rather than accidental: `packages/map-renderer/src/map/parcel-tiles.js:197` carries the comment "No minzoom gate: the browse layer renders at all zooms," and none of the three `addLayer` calls for glow (line 192), fill (line 208), or line (line 221) sets one.

Rather than trust the comment, I verified against the live archive. The PMTiles header of `parcels.b692c6534d26.pmtiles` decodes to `min_zoom=0`, `max_zoom=16`, 2,642,588 addressed tiles, bbox covering Texas. Tiles genuinely exist at low zoom, so MapLibre will request and render them. Range-fetching real tiles gives the cost: a z6 tile is 439,363 bytes gzipped and 1,219,347 bytes decompressed; z7 is 266,669 gzipped; z8 is 247,405 gzipped. A statewide Texas view sits near z5 to z6, where four to nine tiles cover the state bbox. That is roughly 4 MB gzipped and about 11 MB of decompressed geometry decoded and drawn on first paint, before the user does anything.

The honest verdict, stated carefully. Tippecanoe's metadata shows 13,710,413 source features built with `--drop-densest-as-needed`, so low-zoom tiles are pre-thinned and the browser will not literally draw 13.7M features. It will probably not hard-hang. But the cold-open cost is severe and the render at state scale is a meaningless grey smear of thinned parcels. Shipping the constant change alone would visibly degrade the launch landing. Setting minzoom on the three parcel layers, and correcting the now-false comment, is a required companion rather than an optimization.

Two blast-radius notes. `apps/command-center/src/admin/workspace/tiles/LiveMapTile.tsx:166` falls back to `SHARED_DEFAULT_CENTER`, so moving the shared constant silently relocates the internal operator console as well as the customer app. The operator asked for the customer app. Recommendation is a PE-specific override, or an explicit ruling. And `LiveMapTile.test.tsx:34` hardcodes the Bastrop coordinates, so it will fail.

On dependencies: deep links resolve by parcel id or address through `deepLinkLookupQuery`, not by lat/lng, so share links and the extension handoff are unaffected. There is no reset-view or home control to update. At statewide zoom the roads, topo and hydro layers correctly no-op behind `MIN_PARCEL_ZOOM = 14`, but the Opportunity Zone layer has a deliberate no-zoom-gate and will pull its full statewide tract set on cold open.

The operator's parked concern does relate, directly. `_inbox/2026-08-10_per_state_coverage_addon_PARKED.md:87` records the operator on 2026-08-10: "I will want to do state filters as well to help with loading time on the map." That is the same load-time problem this change creates, one state up, and that doc explicitly rules that filtering-for-speed must not be collapsed into gating-for-payment. M2 should be scoped as the performance fix — minzoom plus a tile budget — that the state-filter idea was reaching toward.

## M3 — building footprints on site plans

Complexity L. Blocked on data that was never applied. This is not a UI item.

**The data half.** A complete building-footprint subsystem exists in `hauska-engine`. There is an atom writer seam at `packages/atoms/src/building-footprint-writer.ts`, eleven source files under `packages/engine-core/src/building-footprint/` covering the ML loader, a streaming reader for the statewide Texas zip, the spatial join, a county planner and a route resolver, and a runnable CLI at `packages/engine-core/scripts/write-building-footprint-county.mjs`. The type is registered: `building-footprint` appears in `PROPERTY_ENTITY_TYPES` at `packages/atoms/src/property-instances.ts:177` against `@empressaio/atom-contract ^1.19.0`. The default source is Microsoft Global ML Building Footprints, `ml-derived`, ODC-By licensed.

So the writer is built. What is missing is any evidence it was ever run. The CLI defaults to dry-run and requires an explicit `--apply`. The T3 track close report at `_inbox/2026-08-05_T3_track_close_report.md:23` records the Bastrop pilot as "NOT MET — blocked," with only a local spatial-join dry-run artifact, and names three blockers including "serve-surface code not implemented." No county has footprint atoms.

**Reconciling the manifest.** The manifest reads footprint = no-writer across all 254 counties, and that reading is stale in a specific, explainable way. `has_writer` is not derived from code. It is a hand-declared dimension column, and the migration that seeds it says so outright at `legacy-design-tools:lib/db/drizzle/0068_county_manifest_and_rail_dimension.sql:20-26`: the columns "are DECLARED FACTS ... Neither column enforces anything — updating them here does not create an atom or wire a writer; they are the manifest's honest record of what exists elsewhere." The seeded footprint row at line 110 reads `atom_family_state='unpublished'`, `atom_family_ref='building-footprint (contract v1.12.0, unpublished)'`, `has_writer=false`, with the note "One npm publish away from existing." Since that seed the contract published, the engine moved to `^1.19.0` with the type registered, and the writer landed across three engine commits (`32fa049`, `fcf6ad2`, `d1a2adb`). Nobody re-ran `countyRailRefreshCli`. Because `artifacts/api-server/src/routes/countyLedger.ts:198` gives `has_writer=false` absolute precedence over any stored row, the grid prints no-writer everywhere.

So the manifest is wrong about the reason and right about the outcome. A writer now exists, but zero footprint atoms have been applied, so no county could serve a footprint today regardless of what the cell says. The fix is not to flip `has_writer` to true — that would replace an honest wrong-reason red with a dishonest green. The honest refresh is `present` plus `has_writer=true` plus 0% coverage, which renders as not-yet.

**The render half.** Site plans are generated server-side in `hauska-engine` under `packages/engine-core/src/site-plan/`, emitted as DXF, IFC and PDF. PE reaches them through `apps/property-explorer/api/pe-site-plan-export.ts`, which proxies the MCP tool `refresh_parcel_site_plan_export`. PE renders no site plan itself; `SitePlanExportSection.tsx` is a download and format-selection UI. The engine's shared `SitePlanModel` in `site-plan/site-model.ts` drives every emitter and carries the property ring, setbacks, envelope, street anchors and terrain. There is no footprint slot. Grepping for footprint across the entire site-plan directory returns zero hits in `author.ts`, `emitters.ts`, `pdf/render.ts` and `SHEET_STANDARD_v1.html`. Site plans do not render building footprints at all today, and nothing in the export path is waiting for them.

There is a third gap between the two halves. Even once atoms are applied, `hauska-mcp-server:src/property-atom-chain.ts:24-30` exposes only four chain slots — `parcel-node`, `zoning-fact`, `setback-rule`, `buildable-envelope` — and its DID regex matches the same four types. Footprint atoms would sit in the database unreachable by the export path.

So M3 is three sequential builds: apply the data, serve it through MCP, then render it. The third is wasted effort until the first two exist.

Two constraints that should shape the work rather than be discovered during it. ML footprints are machine-derived from imagery; the writer's own type carries `verificationStatus` of machine, human or unsurveyed. A site plan is a document an architect or a city may act on, and drawing an ML-inferred outline at the same visual weight as a surveyed property line invites it to be read as authoritative. The footprint layer must be visually and textually distinguished as unverified. Separately, ODC-By attribution is contractually mandatory and enforced by a negative guard in the contract; it has to appear on the exported sheet, not merely in the atom payload, because an exported PDF or DXF leaves our surface carrying the obligation with it.

There is also no shortcut through county CAD data. The recon found 0 of 11 onboarded counties expose CAD-authoritative footprint polygons on public REST; BCAD publishes EagleView ortho and CAMA tabular improvement areas, not a vector layer. ML is the only statewide source, and applying it statewide is a long heavy job over a roughly 3 GB Texas FeatureCollection that must be scheduled against the heavy-scan slot rather than started opportunistically.

Finally, the phrasing is ambiguous in a way that changes the size of the job. "Show on site plans" may mean the exported DXF/IFC/PDF deliverable, which is what is scoped above, or it may mean the browse map, which would be a separate PE overlay that also does not exist. These are two different lanes.

## Recommended lane grouping

Three lanes, not three tasks, and they are not equal size.

Lane 1 is M2 and should go first because it is smallest and ships alone. One executor in `hauska-map` changes `DEFAULT_CENTER` and `SHARED_DEFAULT_CENTER` in lockstep, sets the real initial zoom at `map-renderer.js:206`, and — non-optionally — adds minzoom to the three parcel layers in `parcel-tiles.js` while correcting the false comment. Verification must be a live probe of the deployed surface measuring cold-open tile bytes, not a merged PR. An operator ruling is needed up front on whether Command Center follows PE to statewide.

Lane 2 is M1 and splits in two. Lane 2a is backend work in `legacy-design-tools` (or the engine) exposing the two boundary tables over HTTP with simplification, using the Opportunity Zone statewide route as the working precedent. Nothing in PE can start until that lands. Lane 2b is the PE work: extend `SuggestionKind` with city and county, strip a trailing "County" token before geocoding or better prefix-search our own boundary names, add a `highlightBoundary` overlay cloned from `highlightStreet`, and fold the fetch into `pe-map-layers.ts` to respect the function cap.

Lane 3 is M3 and should not be dispatched as a UI task. Its three sub-lanes are: run the footprint writer with `--apply` for at least one county and verify atoms land, contending for the heavy-scan slot; add `building-footprint` to the MCP property-atom-chain so the atoms are reachable; then add a footprint slot to the engine `SitePlanModel` and emit it through DXF, IFC and PDF with ODC-By attribution and explicit ml-derived visual distinction.

One sequencing note worth exploiting. M1 and M2 have a real dependency. Statewide Texas is a visually empty landing, and county boundaries are the most natural thing to fill it with. Landing M2 before M1's backend means shipping an empty-looking cold open in the interim.

## Open questions needing an operator decision

For M1: should the boundary highlight persist until the next search or fade like the street highlight; should city and county become real LAYERS panel toggles or stay search-triggered; do we geocode jurisdictions via Photon at all or serve suggestions from our own name index (recommendation: our own); does the boundary read route live in legacy-design-tools where the tables are, or in the engine where PE's other map layers come from; and is ETJ in scope, given the tables hold incorporated city limits only and an `etj` layer key already exists marked pending.

For M2: what minzoom for the parcel layers (recommendation 12 or 13, since `MIN_PARCEL_ZOOM` is already 14 for the live-GIS path); does Command Center follow PE to statewide or stay pinned (recommendation: stay); and should the statewide view carry something — county boundaries, a coverage choropleth, the OZ pattern — so the landing is not an empty basemap.

For M3: confirm whether the scope is exported sheets only or also a browse-map overlay; which counties get an `--apply` pass before launch; whether ml-derived footprint `accessPolicy` is public-free or public-paid, which the T3 report lists as explicitly unresolved and which gates whether anonymous users see footprints; what the ADR-029 status is, given it was PROPOSED and its non-acceptance was blocker one for the Bastrop pilot; how an ML footprint should be visually distinguished from surveyed geometry on the sheet; and whether the manifest footprint cell should be refreshed now so the console stops reporting a reason that is no longer true.
