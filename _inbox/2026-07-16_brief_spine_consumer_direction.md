---
id: 2026-07-16_brief_spine_consumer_direction
title: Property Brief as spine consumer — vision, direction, and build scope
status: active
date: 2026-07-16
applies_to: hauska-brief-extension, cortex-tiles, cortex-client
related: [55_spine_data_intelligence_stack, 80_adrs/adr_024_shared_surface_package_architecture, 00c_portfolio_master_map]
owner: nick
---

# Property Brief as spine consumer — direction

## The history that grounds this (operator, 2026-07-16)

The causality runs opposite to how it looks today. The Property Brief extension was built FIRST. The map was the hard part. Struggling with the map is what drove building the component/tile library. Experimenting with the library's uses is what produced the command center as the operator's personal backend/admin test bench. So: Brief (original app) to map-struggle to component library to command center (the workshop, not the canonical consumer).

Consequence for how we think about this work: making the Brief consume the library is NOT the Brief catching up to the command center. It is the Brief finally getting back the thing the library was built to give it, a working map tile. The command center is the test bench; the Brief is the reason the library exists and the first real product consumer.

## The core architecture

Spine (data + reasoning: cortex-api, engine, atoms) exposed through the component/tile library (`@empressaio/cortex-tiles` + `@empressaio/cortex-client`), consumed by N apps. The command center is the operator test-bench consumer. The Brief is the first product consumer. Any future app is another consumer. Every consumer gets a SPINE PROXY (the proven `/api/spine/cortex` pattern) as the standard consumer contract.

## The map is a standalone tile (a regression to fix)

The map was the ORIGINAL tile and the reason for the library. It has regressed: the LIVE map loader is trapped command-center-local (`LiveMapTile.tsx` + `liveGis.ts` in hauska-map), while the PUBLISHED `MapTile` in `@empressaio/cortex-tiles` is fixture-only. The live capability leaked into the test bench instead of living in the published library where every consumer can pull it.

Foundational fix, underneath the Brief work: promote the live map tile into `@empressaio/cortex-tiles` as a proper standalone published tile (live viewport GIS, parcel-click card, overlay support, honest states), so the Brief and any future app get a real map, not a fixture. This is a LIBRARY fix, not a Brief-specific task.

## What the Brief consumes vs owns

CONSUMES from the library (retiring its weaker home-grown versions, which lean heavily on fixtures):
- Property brief report (`PropertyBriefTile`)
- Map (the promoted standalone live map tile)
- Hydrology / drainage / flood (`HydrologyTile`, `DrainageTile`, `HazardProfileTile`) — the "will it flood" user story
- Topography / subsurface (`TopographyTile`, `SubsurfaceTile`)
- Setbacks / zoning (`LocalSetbacksTile`) — the "what can be built" user story
- Typed client (`createCortexClient`)

OWNS (Brief-specific, stays put):
- AI research chat (the conversational surface; the ingestion assistant)
- Deal-radar / buy-box (investor persona, keep-pass verdict learning)
- The MV3 extension shell (the follow-the-user-around ingestion point on listing sites — the key product loop)
- Look-and-feel (library tiles inherit via `--h-*` design tokens)
- Entitlement / billing / consumer-tier (Free/Pro/Max)

DEFERRED (recorded, not built this pass):
- Citation-chip reconciliation: the Brief's mature ICC-formal-citation chips stay for now (load-bearing for the ICC demo). The library's dataroom-atom chip model is a separate model. Reconcile after the ICC demo. Migration plan filed in the Brief repo.

## Build decisions (operator-ruled 2026-07-16)

1. **Web app AND extension together** — not phased. The extension following the user around on listing sites (see a property, offer help, begin research) is the KEY ingestion point and the product's core loop, not a second phase. The MV3 map-worker CSP seam is solved as part of the build, not deferred.
2. **Spine proxy** — the Brief gets a spine proxy; this is the standard for every tile-consuming app.
3. **Map standalone** — promote the live map tile into the library as foundational work.
4. **Keep ICC chips** — migration-plan doc filed in the Brief repo for post-ICC-demo reconciliation.

## The three real decisions the scope surfaced (for reference; 1 and 3 resolved above)

1. Backend contract mismatch (library `/plan-review` vs Brief `/api/brokerage/v1`). RESOLVED: Brief spine proxy.
2. Atom-chip reconciliation. DEFERRED with a filed plan.
3. Consumer sequencing. RESOLVED: web + extension together.

## The known technical blockers to design around (from the scope survey)

- MV3 map-worker CSP: the library `FloatingMap` uses MapLibre's default worker with no `workerUrl` override, which fails under MV3 CSP. The Brief already solved this for its own map (vendored `maplibre-gl-csp-worker.js` + `web_accessible_resources` + `wasm-unsafe-eval`). The promoted library map tile must expose a `workerUrl`/`workerClass` seam so the extension can inject its CSP worker. This is part of the standalone-map promotion.
- Extension is vanilla JS (esbuild bundles), no React runtime today, while library tiles are React. Consuming React tiles in the extension surfaces needs a React mount path in the extension panel/content context, or the tiles wrapped for vanilla mounting. Real work, flagged.
- LineAtlas animated-overlay crash precedent (the Brief's hard-won static-glow fix): keep overlay paints static; do not reintroduce animated `line-dasharray`.
- React 18.3 (Brief web) vs React 19 (library dev-deps); peer range `>=18` so likely fine, verify.

## Build sequence (once direction ratified)

Foundation first, then consume:
1. Promote the live map tile into `@empressaio/cortex-tiles` as a standalone published tile with a worker-injection seam (fixes the library regression; unblocks the Brief map).
2. Stand up the Brief spine proxy (the `/plan-review`-speaking same-origin proxy).
3. Wire the Brief web app to consume: map, hydrology/flood, topography, setbacks, brief report — via the library, under the Brief's tokens (look-and-feel preserved).
4. Solve the extension React-mount + MV3 map-worker path so the extension consumes the same tiles.
5. Verify end-to-end against the user stories: run a brief, deep research on what can be built, will-it-flood hydrology, on a real property, from the extension on a listing site.

Every consuming change goes under operator QA (public wedge surface). Verification never delegated.
