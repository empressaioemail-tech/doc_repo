---
id: 40d_cortex_site_context_sprint
title: Cortex site context sprint — 2D-first
status: active
last_updated: 2026-06-06
applies_to: design-accelerator
related: [40_design_accelerator, 40c_cortex_rendering_sprint, 42_design_accelerator_program_plan, 43_cortex_qa_backlog, 46_smartcity_parcel_intelligence, 27_engine_evolution_plan, 28_mcp_first_product_design, 77b_cotality_integration_strategy, _decisions/2026-05-23_site_context_2d_first]
owner: nick
---

# Cortex site context sprint — 2D-first

> **What this is.** The execution plan for the 2D site-context
> completeness scope: real topography, real drainage analysis, real
> rainfall simulation on the Cortex Site tab, layered as overlays on
> the existing 2D `SiteMap`. The 3D site assembly remains a follow-on
> visual layer, queued. Activation decision:
> [`_decisions/2026-05-23_site_context_2d_first.md`](_decisions/2026-05-23_site_context_2d_first.md).
> Reframes the deferred 3D-site-assembly capability (cc-agent-C Phase 1
> P0-3 flag) into a 2D-first sprint.

## Origin

The 2026-05-22 cc-agent-C Phase 1 diagnosis flagged P0-3 as a missing
capability: no code assembles terrain + parcel + building into a
georeferenced scene; `ugrc:dem` returns contour attributes rather than
a terrain mesh; no hydrology / runoff / rainfall code exists. The
2026-05-23 operator QA verify on the cleanly-deployed
`cortex-api-00019-bxf` re-surfaced the gap with reordering: prioritize
2D site context completeness + drainage analysis first; 3D becomes a
follow-on visual layer.

The architect cares first about a working parcel-intelligence story
(what does this parcel support, what flood / drainage / topo
constraints apply, what's the briefing) and second about presentation
of that story in 3D. 2D-first delivers the analytical substrate; 3D
follows when the analysis is real.

## Scope

In scope for this sprint:

- USGS 3DEP DEM raster ingest, clipped to parcel + upstream catchment
  per engagement.
- Topo overlay rendering on the 2D `SiteMap` — contour lines from
  existing `ugrc:dem` attributes as the immediate win; optional
  hillshade tile overlay as a separate ingest.
- Flow-accumulation / hydrology pass over the parcel-clipped DEM, via
  an off-the-shelf hydrology library.
- Drainage-zone polygons + flow-line polylines rendered on `SiteMap`.
- Rainfall-depth input UI + simulation result panel on the Site tab.
  **Re-scope 2026-06-06:** the rainfall forcing input should be sourceable from
  the Cotality climate layer (extreme-precipitation design-storm intensity +
  forward scenarios to 2050) per [`77b_cotality_integration_strategy.md`](77b_cotality_integration_strategy.md)
  §2, not only a manual depth entry. 2D.2/2D.3 consume the Cotality precip
  intensity exposed by the `cotality:climate` adapter as actuarially-grounded,
  forward-looking forcing on the parcel DEM; manual depth stays as an override.
  This couples the regional climate model (Cotality) with site physics (the
  simulator) into the "4 inches of rain" capability. cc-agent-C exposes the
  precip field; cc-agent-R wires it as simulator input.
- Briefing integration so drainage findings cite into the parcel
  briefing as L1-style response tasks or site-finding atoms.
- Two new atom shapes in `@hauska-engine/atoms`: `site-topography`
  and `site-drainage`. Both tenant-private per ADR-017.
- Address-to-parcel auto-resolve polish: parcel auto-fetch on address
  resolve, auto-clip DEM, auto-trigger ingest.

Deferred to a follow-on (not in this sprint's exit):

- The full 3D site-assembly capability — terrain mesh build,
  georeferenced scene-assembly stage feeding `SiteContextViewer`,
  Three.js viewer extension to handle the assembled scene. Lands as a
  separate roadmap line once 2D is complete.
- Vendor circuit-breakers for the Generate Layers adapters
  (`epa:ejscreen`, `fcc:broadband`, `grand-county-ut:parcels`,
  `grand-county-ut:zoning`) — that is QA-22 reopen, in the cleanup
  batch ahead of this sprint.
- The `cortex/site_context_*` MCP tool surface — UI-first product MCP
  retrofit per
  [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md),
  recorded as a tracked follow-on on doc 42's watch line.

Out of scope: TX-specific overlays (TCEQ aquifer zones, county flood
ordinances) — v1 is federal-only USGS 3DEP. Pure 3D rendering work.
Per-jurisdiction permit-history ingest (that is the SmartCity OS
Parcel Intelligence scope per
[`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md)).

## USGS 3DEP API surface

USGS 3DEP (3D Elevation Program) is the federal national elevation
dataset. Public domain, no auth, served via the National Map
WMS / WCS / staged-products endpoints. Reference, to be verified at
build time:

| Capability | Endpoint family | Notes |
|---|---|---|
| DEM raster (1m / 1/3 arc-second / 1 arc-second) | The National Map staged products + WCS | Clip by bbox; download as GeoTIFF. 1/3 arc-second (~10m) is the typical national coverage; 1m is regional and the right choice when available. |
| Hillshade tiles | National Map tile service | Optional overlay; pre-rendered hillshade as a base-map layer. |
| Contour data | Derived from DEM via `gdal_contour` or library equivalent | Local computation rather than separate ingest. The `ugrc:dem` adapter already returns Utah-state contour attributes; broaden to derive contours from USGS DEM for non-Utah engagements. |

Three properties drive the architecture. The DEM is raster geospatial
data (GeoTIFF or COG), so storage + per-engagement clipping is the
spine. Clipping must respect the parcel boundary + the upstream
catchment (drainage analysis requires looking upslope, not just at
the parcel). Hydrology runs on the clipped DEM, not the national one.

## Hydrology library choice

Two candidates, cc-agent-C verifies + picks during Phase 2D.2:

- **whitebox-tools** — Rust binary with Python and JS bindings.
  Comprehensive geomorphometric + hydrology functions
  (`FlowAccumulation`, `D8FlowDir`, `Watershed`, `RainfallRunoff`,
  more). Active maintenance; stable Cargo crate. Best fit if Rust /
  Node binding is feasible.
- **richdem** — Python C++ binding focused on terrain analysis +
  hydrology. Lighter weight than whitebox. Python-only, so requires
  a Python subprocess from Node (api-server pattern: spawn a
  contained worker, exchange JSON over stdio).

Decision factors: existing api-server runtime (Node, Cloud Run);
whether a Rust crate can ship as a Cloud Run sidecar or a build-time
binary; Python subprocess overhead acceptable for per-engagement
analysis. cc-agent-C reports the choice at Phase 2D.2 dispatch open
+ writes a small ADR fragment captured in the session summary if the
choice has non-obvious tradeoffs.

## Architecture

**DEM client + ingest worker.** A generic typed client wrapping the
USGS 3DEP staged-products + WCS endpoints, bbox-clipping at request
time. Downloads the parcel + upstream-catchment GeoTIFF into the GCS
bucket per engagement (`engagement-id/site-topography/dem.tif` or
similar). Idempotent: re-running for the same engagement re-clips and
re-stores, superseding the prior atom.

**`site-topography` atom.** Per
[ADR-001](80_adrs/adr_001_atom_architecture.md) and
[ADR-012](80_adrs/adr_012_atom_export_format.md), `accessPolicy:
tenant-private` per
[ADR-017](80_adrs/adr_017_atom_access_control.md). Fields: engagement
id, parcel geometry reference, parcel + upstream-catchment bbox, DEM
source (`usgs-3dep`) + resolution + acquisition date, DEM GCS
reference, derived contour-line GeoJSON, hillshade tile URL pattern
if used, an `aiOrigin: false` / `computedOrigin: true` marker since
this is deterministic geospatial computation not AI generation,
created + updated timestamps.

**Hydrology worker.** Runs the chosen hydrology library against the
parcel-clipped DEM. Produces: flow-accumulation raster, drainage-zone
polygons (catchment basins clipped to parcel), flow-line polylines
(D8 flow direction + accumulation threshold). Stores outputs in GCS
adjacent to the source DEM. The worker is a separate process or
subprocess per the library choice (Rust binding inline; Python
subprocess if `richdem`).

**`site-drainage` atom.** `accessPolicy: tenant-private`. Fields:
engagement id, source `site-topography` atom reference + version pin
per ADR-011, hydrology library + version + run parameters
(D8 vs D-Infinity, accumulation threshold, ...), flow-accumulation
GCS reference, drainage-zone GeoJSON, flow-line GeoJSON, optional
rainfall-depth input (mm) + rainfall-result GeoJSON, `computedOrigin:
true` marker, created + completed timestamps.

**2D map rendering.** Extends the existing Leaflet-based `SiteMap`
component. Contour lines render as a polyline overlay layer (toggle
in the layer panel). Drainage zones render as a polygon overlay with
fill (semi-transparent). Flow lines render as styled polylines.
Rainfall simulation result renders as a heat-mapped polygon overlay.

**Briefing integration.** Drainage findings cite back to the
`site-drainage` atom. The parcel briefing's existing structure (per
the L1 / L2 / L3 pipeline) gains a "Site context" section with
drainage callouts: "This parcel sits in a 100-year floodplain"
(existing FEMA layer), "Upstream catchment delivers ~X cubic meters
to the parcel under 4 inches of rainfall" (new), "Primary flow path
exits at the southwest corner" (new). Each callout is a real finding
atom with citations.

## Build phases

Owner: cc-agent-C, sequential phases. Queued behind the cleanup
batch (QA-33 + QA-22 reopen). Phase 3 features (QA-27 / QA-28 /
QA-29) yield until this sprint closes.

**Phase 2D.1 — DEM ingest + topo overlay.**

- 2D.1.1 USGS 3DEP client (staged products + WCS, bbox-clipping).
- 2D.1.2 Ingest worker: parcel boundary → bbox → DEM download → GCS
  store → `site-topography` atom emit.
- 2D.1.3 `site-topography` atom shape in `@hauska-engine/atoms`,
  registered per ADR-001 / ADR-012, accessPolicy tenant-private.
- 2D.1.4 Contour-line derivation (`gdal_contour` or library
  equivalent) from the clipped DEM; emit as GeoJSON onto the atom.
- 2D.1.5 `SiteMap` overlay: render contour lines as a polyline layer
  with toggle.
- 2D.1.6 Optional hillshade tile overlay (separate, optional path —
  may defer to a 2D.5 if scope inflates).

Phase 2D.1 exits when Musgrave_Residence_B and Redd both show real
contour lines on the Site tab map.

**Phase 2D.2 — Hydrology / drainage analysis.**

- 2D.2.1 Hydrology library choice (whitebox-tools vs richdem) +
  integration pattern (Rust binding inline vs Python subprocess).
- 2D.2.2 Hydrology worker: flow-accumulation calc, drainage-zone
  polygon generation, flow-line polyline generation.
- 2D.2.3 `site-drainage` atom shape in `@hauska-engine/atoms`,
  references `site-topography` per ADR-011 version pin.
- 2D.2.4 `SiteMap` overlays: drainage zones as polygon fill,
  flow-lines as styled polylines.

Phase 2D.2 exits when the Site tab shows drainage zones + flow lines
on a parcel-clipped basis, with each render backed by a
`site-drainage` atom carrying full provenance.

**Phase 2D.3 — Rainfall simulation UI + briefing integration.**

- 2D.3.1 Rainfall-depth input control on the Site tab (e.g. "How much
  rain?" → 1, 2, 4, 8 inches preset + free-input).
- 2D.3.2 Rainfall simulation worker: applies rainfall input over the
  flow-accumulation raster, computes per-zone runoff volumes + flow
  exits.
- 2D.3.3 Simulation result panel: which zones flood, where flow
  exceeds parcel boundaries, where runoff exits.
- 2D.3.4 Briefing integration: drainage callouts ("100-year
  floodplain, X cubic meters at 4 inches", "primary flow exits SW")
  emit as finding atoms with citations back to `site-drainage`.

Phase 2D.3 exits when the architect can input a rainfall depth and
see a simulation result that ties back into the parcel briefing.

**Phase 2D.4 — Address-to-parcel auto-resolve polish.**

- 2D.4.1 Parcel auto-fetch on address resolve (the geocoder already
  updates the map; add parcel boundary fetch).
- 2D.4.2 Auto-clip DEM + auto-trigger Phase 2D.1 ingest when a new
  parcel is resolved.
- 2D.4.3 UI polish: loading states, idempotent re-runs, fallback when
  parcel boundary unavailable.

Phase 2D.4 exits when entering an address on a new engagement
automatically lands the architect on a Site tab with contours +
drainage + briefing populated.

## Sequencing

cc-agent-C is one agent. Sequential by nature. Order on
legacy-design-tools:

1. Cleanup batch (QA-33 + QA-22 reopen) — small, fast, ahead of any
   sprint.
2. This sprint, phases 2D.1 → 2D.2 → 2D.3 → 2D.4.
3. Phase 3 features (QA-27 / QA-28 / QA-29) per the existing
   dispatch.

Atom-registry coordination: site-topography + site-drainage are
new atom types. Coordinate with the engine planner (cc-agent-E
territory) per the Stream B registry-bump pattern. Single coordinated
bump.

## Exit criteria

- Phase 2D.1 — contour lines render on the Site tab map for
  Musgrave_Residence_B and Redd; `site-topography` atoms emitted with
  full provenance and tenant-private accessPolicy.
- Phase 2D.2 — drainage zones + flow lines render on the Site tab map;
  `site-drainage` atoms emitted with full provenance and pinned
  version of `site-topography`.
- Phase 2D.3 — rainfall input + simulation result panel work
  end-to-end; drainage callouts emit as finding atoms in the parcel
  briefing.
- Phase 2D.4 — new-engagement address entry auto-resolves parcel +
  contours + drainage + briefing.

## Watch line

3D site assembly (terrain mesh + georeferenced scene + Three.js
viewer extension) remains queued as a follow-on visual layer, not
deferred indefinitely — once 2D is complete it becomes a real
roadmap line. Vendor reliability for the existing site-context
adapters (`epa:ejscreen`, `fcc:broadband`, `grand-county-ut:*`) is
the QA-22 reopen ahead of this sprint; circuit-breaker pattern lands
there, not here. The `cortex/site_context_*` MCP tool surface is a
tracked MCP retrofit follow-on per
[`28_mcp_first_product_design.md`](28_mcp_first_product_design.md),
to land on hauska-mcp-server after the 2D sprint ships. TX-specific
hydrology overlays (TCEQ aquifer zones, county flood ordinances)
queued for v2 — federal-only USGS 3DEP for v1.

## Structural commitment check

Pre-mortem run 2026-05-23, cleared green. Load-bearing commitments
clean: site-topography + site-drainage atoms carry full provenance
("sell reasoning" discipline); USGS 3DEP is federal public-domain,
not a jurisdictional licensor (partnership-first does not apply);
per-engagement DEM clip + flow-accumulation is product COGS, ~1-5
dollars per engagement, well within COGS norms (cost-per-jurisdiction
envelope governs corpus ingest, not per-engagement compute).

Two operational yellows, both absorbed per operator standing framing:
this builds UI-first on existing UI-first Cortex with MCP retrofit
recorded as a tracked follow-on (commitment 4); the work is Cortex
product layer adjacent to substrate, sanctioned per
[`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md)
which frames parcel-intelligence as a portfolio surface (rule 5).
Focus-queue (rule 6) green: Phase 3 explicitly yields. Quality-gate
(rule 7) green: drainage findings cite back to source atoms with
reasoning chains.

Catalog-thesis-check 2026-05-23, passes. site-topography and
site-drainage are Cortex tenant-private workflow atoms
(`accessPolicy: tenant-private`), not Layer 1 / Layer 2 catalog
atoms; no tier inversion. USGS 3DEP is a public-domain federal
dataset, no commercial exposure. UI-first is correct for Cortex; the
`cortex/site_context_*` MCP retrofit recorded as a tracked follow-on
in 42 per the MCP-first rule.

## Cross-references

- [`40_design_accelerator.md`](40_design_accelerator.md) — Cortex
  product home
- [`40c_cortex_rendering_sprint.md`](40c_cortex_rendering_sprint.md) —
  the parallel rendering sprint precedent (gap-fill + activation
  patterns)
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) —
  program plan this sprint feeds; `cortex/site_context_*` MCP
  retrofit goes on the watch line
- [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md) — P0-3 origin
  flag; QA-22 reopen in the ahead-of-sprint cleanup batch
- [`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md) —
  the SmartCity-OS-side parcel-intelligence analog (city-staff
  audience); this is the architect-facing analog
- [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) —
  the MCP-retrofit principle for existing UI-first products
- [`_decisions/2026-05-23_site_context_2d_first.md`](_decisions/2026-05-23_site_context_2d_first.md) —
  activation decision record
