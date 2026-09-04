---
date: 2026-09-04
owner: nick
status: research-complete, scope-deferred
related_canonical: [90_operations/OPS-17_govtech_stack_plan_of_record, _decisions/2026-08-17_g45_smartsite_staff_map, _decisions/2026-08-26_factory_program_and_hold_lifts, 80_adrs/adr_024_shared_surface_package_architecture, 80_adrs/adr_029_building_footprint_and_utility_easement_rails]
---

# Dashboards map architecture — findings and deferred scope

## Why this exists

Operator asked (2026-09-04) to stop embedding SmartSite in `smartcity-dashboards`' staff map and instead pull from "the root map repo that smartsite feeds from," then separately asked to look at layering a Bastrop-only water/utility network on the same base map. A deep-dive (3 parallel research passes: `smartcity-os`'s current production map, the `hauska-map`/`hauska-factory` stack, and this repo's own prior planning) found the ask was larger and more tangled than it first looked, and the operator's own call after seeing the findings was: **don't build any of this now — document it, keep using what already works for the current cutover, and treat this as a separately, carefully scoped future project.** This doc is that documentation. Nothing here is authorized to build against; it is a record of what's actually true today, so the future scoping pass starts from evidence, not from the assumption "SmartSite feeds the permit map."

## The three systems, disambiguated

The request conflated three genuinely separate things. Naming them precisely is the single most load-bearing finding here, because it changes what "fix the map" even means:

1. **`smartcity-os`'s own production map** — the thing that actually does "type an address, see the permit, the zoning, the flood-plain status, the code case" on `smartcityos.io` today. This has **zero relationship to SmartSite** — no reference to SmartSite, "smart site," or `smartsite.cloud` exists anywhere in the `smartcity-os` codebase (confirmed by direct search). It is its own real, live, already-working system.
2. **SmartSite / `hauska-map`** — a separate, property-seat-owned product (parcel explorer, `hauska-map-tiles` bucket, `hauska-factory` publish pipeline). Real, live, has nothing to do with Bastrop permits specifically, and is not what powers `smartcity-os`'s permit-by-address lookup.
3. **`smartcity-dashboards`' current staff map embed** — a plain iframe pointed at SmartSite (`smartsiteEmbedUrl()`, `src/mounts.mjs:57`), mounted through a generic animated panel (`MountStage`, `web/app.js:273`). This is the ONE thing govtech actually owns and can change unilaterally.

## Finding 1: `smartcity-os`'s real map/permit-lookup mechanism

- **Map library**: Leaflet (`react-leaflet`), via a shared `InteractiveMap.tsx` component AND a second, separately hand-built map in `EmergencyResponse.tsx`. Two independent Leaflet stacks in one codebase, not one shared component everywhere.
- **Data source**: live ArcGIS REST Feature Services owned directly by the City of Bastrop and Bastrop CAD (county) — `server/routes/esri.ts`, `BASTROP_LAYER_REGISTRY` (~40 layers: parcels, zoning, FEMA flood zones, water/wastewater, hydrants, sidewalks, historic district, etc). Not cached, not vendored — called live.
- **Address → permit chain**: user searches in the "Property Intel" tab (`DevelopmentServicesDashboard.tsx`, tab `property-intel`) → `/api/esri/geocode` (local address feature-service LIKE-query, falls back to Esri's world geocoder) → `/api/esri/one-click-at-point` (lat/lng point-in-polygon against `Parcels_One_Click`) → `<PropertyDossier>` → `/api/property-intelligence/summary`. **The permit/violation join is address-STRING matching plus a 50m lat/lng proximity check** (`property-intelligence.ts`'s `extractStreetKey`/`addressMatch`), not a parcel-ID join — a real architectural quirk worth knowing before anyone builds against this data.
- **No survey-PDF integration exists.** `PropertyDossier.tsx` generates its own client-side PDF report via `jsPDF` from the fetched data. The marketing flyer's "the survey PDF" line does not correspond to a stored document anywhere in this codebase.
- **Access-gated layers**: mostly unbuilt. `layerCatalog.ts`'s `LayerConfig` has no role/department field. `EmergencyResponse.tsx` has real, unused scaffolding for a `locked`/`lockMessage` per-layer toggle (full UI support — disabled state, lock icon, exclusion from bulk actions) but **zero layers currently set `locked: true`** — dead capability, not wired to any real permission source. The platform does have a real `teamMemberships.role` + `department`/`departmentId` schema elsewhere, just never consulted by map code.
- **Extending this map is architecturally cheap on the primary stack** (`InteractiveMap` + `LayerManager` + `layerCatalog.ts` + a generic `/api/esri/bastrop-feature-layer?key=...` GeoJSON endpoint that already serves any registry entry) — add a registry entry, add a catalog entry. `EmergencyResponse.tsx`'s map is a single ~4000-line page with layers hand-coded inline; extending that one is more invasive, though its dormant `locked` scaffolding is the closer starting point for a real role-gated layer if that's ever wired to a real permission source.

## Finding 2: SmartSite / `hauska-map` / `hauska-factory`

- **`hauska-factory`** (code lives on unmerged property-seat branches, e.g. `seat/property-publish`; `main` is currently just a README) is a control-plane that orchestrates jobs and publishes to serving stores — it does not itself bake tiles; the bake tooling lives in `legacy-design-tools`, re-tiered as Factory jobs. "**Serving never reads the Factory store**" — `hauska-map` only ever consumes the published output.
- **The published output is a real, public, unauthenticated GCS bucket** (`hauska-map-tiles`), fetched by `hauska-map` with plain unauthenticated HTTP — `PARCEL_PMTILES_BASE`/`TERRAIN_RGB` in `apps/property-explorer/src/lib/config.ts`. Cache-control is `public, max-age=31536000, immutable`; a bake CLI comment explicitly calls the parcels archive "a public, bulk-downloadable, cache-forever artifact."
- **No discoverable "latest" manifest.** No `tiles.json` is ever actually written to the bucket — the current PMTiles hash is hardcoded in `config.ts`. A consumer would need the hash out-of-band; there's no stable pointer to fetch.
- **Rendering technology is MapLibre GL JS**, consistently, across the `hauska-map` monorepo. `smartcity-dashboards` has no MapLibre dependency today — adopting this data source means adopting a new rendering stack, not just a new URL.
- **A `smartcity-os` integration stub already exists and is unused**: `packages/map-renderer/src/layer-allocation.js` declares an `AppId` for `smartcity-os` with its own allowed layer set (parcel, flood, municipal overlay) — but `resolveLayerAllocation` is never called from any runtime code outside its own module. Someone on the property side already sketched this door; nobody opened it.
- **No fine-grained access-control concept exists at the map-layer level anywhere** (nothing like "sewer network, public-works-only"). The real access control that exists (`hauska-factory`'s `access-policy-prestep.mjs`, a 5-value policy enum) operates on individual property "atoms," not on map tiles or layers.
- **Bastrop-specific scope, checked against the marketing claim**: parcels ARE genuinely plumbed for Bastrop (FIPS 48021 has its own publish job) but as part of a ~2.5M-feature, 19-county bundle, not isolated. **Roads for Bastrop are explicitly documented as unbuilt** ("no roads adapter shipped... stay with OSM-direct") — the flyer's "full road network" claim does not hold for Bastrop specifically. Zoning/flood/terrain are live per-viewport API responses except terrain, which is baked. The flyer's "74,729 parcels" figure is not traceable to any dataset in either repo.

## Finding 3: prior planning in this repo

- **The access-control principle is real elsewhere in the platform** (an atom-level 5-value policy: `public-free`/`public-paid`/`platform-internal`/`tenant-private`/`tenant-shared`, enforced at resolution time per the SmartSite technical white paper) — but that is a data-record guarantee, not a map-tile-compositing design. Nobody has designed how a tenant-private layer would actually sit on the public, unauthenticated tile pipeline described in Finding 2.
- **ADR-029** models utility *easements* (property-rights lines) as `public-free` — the literal opposite of what a private water/utility *network* (mains, valves, lift stations) would need, and not the same kind of object.
- **Asset Management — the product that would actually hold a city's water/utility network — is already named, scoped, and priced** (`_smartcity_masters/32_smartcity_asset_management.md`, $52k entry / $13k annual) and carded as **G-24** in `90_operations/OPS-17_govtech_stack_plan_of_record.md`. G-24's own grading: "LIVE... ZERO city assets ingested."
- **A standing operator ruling exists: "Do not fill G-24"** (A-054, 2026-08-17). **This needs to be explicitly revisited before any Bastrop water/utility layer becomes real scope** — it may be superseded by this conversation, or it may still hold and this whole thread stays parked. Not resolved in this document; flagged for the operator.
- **Two prior rulings sit in tension** on the general "embed vs. build native" question: ADR-024 rejects iframe/running-URL sharing platform-wide, ruling the map should ship as an importable package (`@hauska/map-renderer`); G-45 (the decision that produced today's actual SmartSite iframe embed) considered direct/native consumption, called it "not blocked," and chose the iframe anyway.
- **The closest real precedent for "read another seat's system directly, narrowly"** is this program's own `smartcity-os` platform-internal-read pattern (`_decisions/2026-09-03_smartcity_os_platform_read_authorization.md`) — a narrow, API-key-gated, read-only endpoint, explicitly stated as a reusable template and already reused five times this week (mygov, samsara, spireon, firstdue, powerbi). No equivalent narrow-read pattern exists yet for reading FROM property's map infrastructure — it would need to be requested/negotiated the same way, not assumed.

## The one piece of genuinely good news: the current embed mechanism is content-agnostic

`smartcity-dashboards`' map panel is not SmartSite-specific code. It's a generic, animated "stage" (`MountStage`, `web/app.js:273`) shared with the Plan Review and Files embeds — spring-physics present/collapsed/max transitions, scroll-anchoring, resize handling, all driven by one thing: `mount(src)`, which is exactly `this.frame.src = src` (`web/app.js:287-293`). **The entire animation and interaction the operator wants preserved is completely independent of what's inside the iframe.** Whatever the future scoping decides should be "Bastrop's real functional map," swapping it in requires touching exactly one thing — the URL composed for `data.smartsite.url` in `src/compose.mjs`/`src/mounts.mjs` — and none of the UI shell.

## The real open design question for the future scoping pass

What actually gets put behind that URL is NOT a solved problem, and is exactly the "significant lift" the operator flagged. Two real candidate directions, deliberately not chosen here:

1. **Iframe a route inside `smartcity-os` itself** (its own Property Intel map, already live, already has the real permit/zoning/flood data). Unresolved: `smartcity-os` is a session-cookie-authenticated SPA (`requireTenant` middleware) — whether it can even be framed by a different origin (X-Frame-Options / CSP `frame-ancestors`), and whose auth session would apply inside the frame, is a real, unanswered technical question, not an assumption to build on.
2. **Build a Dashboards-native map view** that reads the same real Bastrop ArcGIS data via a NEW narrow, platform-internal, read-only endpoint on `smartcity-os` — the same proven pattern used for every other real domain this week. Safer and more consistent with everything already built, but is real new engineering (a map renderer inside Dashboards, likely Leaflet to match the real data's own stack), not a URL swap.

Neither is chosen. Both, plus the G-24 reconciliation, are the actual content of the "carefully scoped larger project" the operator asked for.

## What this pass is NOT recommending doing now

- Not adopting MapLibre / consuming `hauska-factory`'s tiles directly — it would buy parcel geometry and terrain, not the permit/zoning/flood-plain richness the flyers describe, since that data lives entirely in `smartcity-os`'s separate ArcGIS stack.
- Not starting the Bastrop water/utility layer (G-24 territory, standing "do not fill" ruling, no compositing/access-control mechanism exists on either side to build it on).
- Not changing the current SmartSite embed today. It keeps working exactly as it does now until the future scoping pass lands on a real destination.

## Status

Research complete. No code changed. This is the reference document for when this becomes active scope.
