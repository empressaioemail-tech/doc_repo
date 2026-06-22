---
id: architecture_homes_topology
title: Homes and repo topology
status: active
last_updated: 2026-06-21
applies_to: portfolio
owner: nick
related: [architecture_homes_overview, 80_adrs/adr_008_engine_factor_out, 56_engine_extraction_sprint]
---

# Homes and repo topology

## The function homes

| Function | Home | Notes |
|---|---|---|
| Atoms (corpus + calibration substrate) | hauska-engine (spine) | corpus already there; calibration substrate lifts per sprint 56 |
| Reasoning (finding / briefing / hydrology) | hauska-engine engine-api (spine) | lifts out of cortex-api per 56 |
| Retrieval + calibration engines | hauska-engine (spine) | derive-at-read over the raw ledger |
| The gate | hauska-mcp-server | one control plane: product + tenant + tier, accessPolicy, meter, provenance |
| Payment / metering | hauska-sdk | USDC/Circle rail; SDK, not MCP |
| Reporting | cortex-api (function package) | composes spine reasoning + map layers + atoms into reports; persists report runs; product glue. NOT a product |
| Spatial layers + spatial reasoning + shared renderer + operator console | hauska-map | all map layers and the rendering live here |
| Plan review | Codex (surface over the plan-review function) | plan-set review, findings, comment letters, code lookup |
| Architect tooling (renders, design tools, deliverable UX) | AEC-cortex (new product repo) | consumes our functions through the gate; the design-accelerator redesign |

## Repo classifications

Three classifications, each a folder grouping independent repos. Surfaces is the one the operator named explicitly; the other two are the natural parallels.

```
SUBSTRATE (Hauska spine)
  hauska-engine          atoms + reasoning (engine-api) + retrieval + calibration engines
  hauska-atom-contract   the atom + read-contract
  hauska-mcp-server      the gate
  hauska-sdk             payment / metering rail

FUNCTION PACKAGES
  cortex-api             reporting engine (composition; report runs persist)
  hauska-map             spatial layers + spatial reasoning + shared renderer + operator console

SURFACES (each its own repo, for flexibility)
  hauska-brief-extension     brokerage brief
  radar (NEW repo)           investor deal radar (Free/Pro/Max); live product, backend in cortex-api today
  AEC-cortex (NEW)           architect product: renders, design tools, deliverable UX
  codex                      plan-review UI over the plan-review function
  smartcity-os               municipal; LIVE prod, left untouched until the spine is dialed, then refactored to a spine consumer
  revit-connector            Revit add-in
```

Radar is a live billing product whose backend currently sits inside cortex-api; under the standard it becomes its own Surface repo consuming reporting and map through the gate. SmartCity OS is the only other live prod deployment and is explicitly left alone for now; it is refactored into a spine consumer after everything else is dialed.

## Cross-project seam

The gate (hauska-mcp-server) lives in hauska-prod; the spine (hauska-engine retrieval-api and engine-api) is in hauska-prod; cortex-api (reporting) is in legacy-design-tools-prod. So the gate-to-reporting hop is cross-project. The gate-front seam is the transition bridge; once reasoning lifts to the spine (sprint 56) the hop is internal to the spine, and only the reporting BFF remains a cross-project consumer the gate fronts. The audit must confirm the seam's cross-project auth and networking, not assume same-project calls.

## The decomposition through-line

`legacy-design-tools` is the monolith being decomposed: its reasoning lifts to the spine (sprint 56), its reporting stays as `cortex-api`, its architect product splits to `AEC-cortex`, and its spatial work already left to `hauska-map`. That decomposition is the redesign.

## Cortex reframe (pending ADR-008 amendment)

"Cortex" is repurposed from the design-accelerator product to the reporting function package; cortex-api keeps that name. This supersedes the ADR-008 definition of Cortex as a product surface and is locked only on operator override plus the amendment. The naming overlap with AEC-cortex must be resolved in the amendment so there is one meaning of "Cortex."

## AEC-cortex (new product)

The architect product (renders, design tools, the deliverable UX, the L1 to L6 surface) splits into its own repo, scaffolded as a `P:\AEC-cortex` folder by the assigned agent; the operator creates the GitHub remote afterward, then the agent pushes. It consumes reporting, spatial, and code functions through the gate (MCP-first per ADR-028; record its MCP ship plan in its program). Boundary detail to pin in the amendment: deliverable composition (L1 to L6 content) is reporting; the architect UX and renders around it are AEC-cortex.

## How the map visualizes reports (the manifest contract)

The map does not receive a report. Reporting and map meet at a layer manifest.

A report (cortex-api) produces the reasoning narrative, the cited atoms, and a layer manifest: the spatial layers that visualize this report, bound to its parcel. It draws nothing. The shared map renderer (owned by hauska-map, the decoupled renderer) is embedded wherever the report is shown (floating in the console, embedded-static in a report inside a surface), reads the manifest, pulls the layer data from the spine through the gate, and applies the read-contract styling.

A hydrology report names the drainage, flood-depth, and contour layers in its manifest; the renderer draws them from the spine `site-drainage` atom. The report owns the narrative and the manifest; the map owns the rendering and the spatial data. One renderer, many mount contexts. The seam exists already (the V3 layer-allocation resolver and the R1 embedded-static mount); what is owed is a formal report-to-manifest contract so every report type declares its visualization, and ensuring each report's spatial data lives as a spine atom the renderer can pull independent of the narrative.
