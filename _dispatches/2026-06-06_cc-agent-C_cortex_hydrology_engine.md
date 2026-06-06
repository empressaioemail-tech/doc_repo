---
id: 2026-06-06_cc-agent-C_cortex_hydrology_engine
title: Dispatch — Cortex hydrology engine (40d Phase 2D.2 drainage + 2D.3 rainfall sim)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [40d_cortex_site_context_sprint, 77b_cotality_integration_strategy, 46_smartcity_parcel_intelligence, 01a_atom_conventions, 20_agent_operating_rules, 80_adrs/adr_017_atom_access_control]
---

# Cortex hydrology engine — 40d Phase 2D.2 + 2D.3

You are **cc-agent-C**, single owner of `P:\legacy-design-tools` (cortex-api) for this run.

Build the site hydrology engine: drainage analysis (2D.2) and rainfall simulation (2D.3) on the parcel-clipped DEM. This is the "4 inches of rain" capability. **Independent of the Cotality integration** (no token needed) — runs on the existing `ugrc:dem` topography (2D.1, built) + a rainfall-depth input. Stack on a fresh branch from `main` (`cortex/hydrology-engine`), independent of the held Cotality branch.

## Model / hygiene

Grok Build 0.1 default per HR-12; api.x.ai/v1. Branch `cortex/hydrology-engine` from `main`. One clone per agent; refuse alien HEAD/uncommitted state; verbatim `git status` + `git log -3`. PR held for operator merge. Verbatim artifacts (HR-8).

## Atoms to resolve (before full reads)

- `current-state:portfolio` — fleet status, blockers
- `site-context:cortex` — the 40d 2D site-context model (DEM, SiteMap, topography)
- `parcel-briefing:round_rock_tx` — the brief that consumes drainage findings (test address 1904 Heathwood Cir)

## Read first (after atoms)

1. [`40d_cortex_site_context_sprint.md`](../40d_cortex_site_context_sprint.md) — Phase 2D scope, hydrology library candidates, `site-drainage` atom shape, briefing integration, the 2026-06-06 rainfall-forcing re-scope note.
2. [`77b_cotality_integration_strategy.md`](../77b_cotality_integration_strategy.md) §2 — the hydrology blend (Cotality forcing/validation, wired later).
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11; [`80_adrs/adr_017_atom_access_control.md`](../80_adrs/adr_017_atom_access_control.md) (tenant-private).

## Phase 2D.2 — drainage

- **Library decision (yours, per 40d 2D.2):** verify and pick between WhiteboxTools (`FlowAccumulation`, `D8FlowDir`, `Watershed`, `RainfallRunoff` — recommended for the 2D.3 fit) and pysheds (lighter, Python-only). Report the choice + why in the close note. Run it as a worker/sidecar invoked from cortex-api.
- **Catchment DEM, not just the parcel:** drainage requires looking upslope. Clip the DEM to the local catchment/buffer around the parcel (watershed extent), run flow analysis on that, then clip results back to the parcel for display.
- Produce: flow-accumulation raster, **drainage-zone polygons** (GeoJSON) + **flow-line polylines** (GeoJSON), rendered on `SiteMap` as overlays.

## Phase 2D.3 — rainfall simulation

- **Rainfall-depth input UI** + simulation result panel on the Site tab. Accept a manual depth (the literal "4 inches" input) AND design-storm presets.
- **Forcing source v1 = NOAA Atlas 14** (NWS Precipitation Frequency Data Server, `hdsc.nws.noaa.gov` PFDS — free/federal): pull point precipitation-frequency estimates (e.g. 2/10/25/100/500-yr at 24-hr) for the parcel lat/lng as selectable design-storm depths. Manual depth overrides.
- **Cotality overlay hook (do not block on it):** leave a documented, pluggable input for the Cotality flood-depth-at-return-period field already shipped in `cotality:hazards` (`floodDepthAtReturnPeriod.{estimatedFloodDepth_50yr…500yr, waterSurfaceElevation, groundElevation}`) so it slots in as forcing/validation once the Cotality token clears. Not wired live this dispatch.
- Run the sim (chosen library's rainfall-runoff / ponding pass) on the catchment DEM with the selected depth; render the result as a heat-mapped polygon overlay on `SiteMap`.

## Atom + briefing integration

- **`site-drainage` atom** in `@hauska-engine/atoms`, `accessPolicy: tenant-private` (ADR-017). Fields per 40d: provenance (per ADR-011, library + version + run parameters), DEM/GCS reference, drainage-zone GeoJSON, flow-line GeoJSON, rainfall-depth input + rainfall-result GeoJSON, forcing source (NOAA Atlas 14 ref or manual), `computedOrigin`. Carries source + confidence + timestamp (quality gate).
- **Briefing integration:** drainage findings cite back to the `site-drainage` atom and surface in the parcel briefing as L1-style response tasks / site-finding callouts (e.g. "this parcel sits in a 100-year floodplain / drains toward …").

## Acceptance

- Library chosen + justified; worker runs against a real catchment-clipped DEM for the test parcel.
- Drainage-zone + flow-line GeoJSON render on SiteMap; rainfall sim produces a result overlay for a given depth (smoke "4 inches" on 1904 Heathwood Cir).
- `site-drainage` atom shape lands (tenant-private, full provenance); briefing cites it.
- NOAA Atlas 14 forcing pulls design-storm depths for the parcel; Cotality overlay hook present but inert.
- Unit tests + recorded fixture (sample DEM tile) green; `pnpm run typecheck` green. PR held.

## Reporting

`P:\doc_repo\_inbox\2026-06-06_legacy-design-tools_cc-agent-C_cortex_hydrology_engine.md` — atom refs, library chosen + rationale, PR URL + SHA, the NOAA Atlas 14 integration shape, the Cotality-overlay hook location (for the 40d blend), and blockers verbatim.
