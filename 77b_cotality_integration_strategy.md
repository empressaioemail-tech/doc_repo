---
id: 77b_cotality_integration_strategy
title: Cotality integration strategy — multi-plane place-graph feed, hydrology blend, Carfax depth, insurability surface
status: superseded
last_updated: 2026-08-09
applies_to: portfolio
related: [77_place_graph_strategy, 75_hauska_brokerage_workflow_plan, 75c_property_brief_data_backlog, 40d_cortex_site_context_sprint, 46_smartcity_parcel_intelligence, 50_hauska_mcp_server, 14_pricing_framework, _research/2026-06-06_cotality_api_surface_catalog, _research/2026-05-30_cotality_property_brief_recon, _decisions/2026-06-06_cotality_parcel_provider, 80_meetings/transcripts/2026-06-cotality_corelogic_gene_sales_engineer_call_otter]
owner: nick
---

# Cotality integration strategy

> **SUPERSEDED 2026-08-09.** Status flipped from active. Cotality was extinguished 2026-07-13: it went dark at OAuth, the wedge surfaces migrated to public-record providers per `_decisions/2026-07-13_cotality_swap_public_record_migration.md`, and the standing rule is that live code hitting Cotality is a wrong-routing defect to re-route to county-GIS or public record, never a credential to rotate. Regrid is dead as well. Nothing in this doc is an implementation sequence anymore; the multi-plane strategy, the MCP federation idea, and the endpoint catalog stay only as the re-entry reference if production keys ever land, matching the posture already recorded in `75l_cotality_data_stack_catalog.md`. Current disposition of the map layers this strategy fed is in `90_operations/QUEUE_parked_work_index.md` (W3 RRC and W4 MUD both HELD; greenfield).

> **Purpose.** Capture the full Cotality opportunity beyond the parcel/zoning swap, and lay out the implementation path the operator wants to leverage as far as possible. Cotality is not a Regrid replacement; it is a multi-plane feed on the [place graph](77_place_graph_strategy.md) plus a governed MCP server (launched 2026-03-31) we can federate under ours. Grounds the brainstorm so it is not lost. Decision basis: [`_decisions/2026-06-06_cotality_parcel_provider.md`](_decisions/2026-06-06_cotality_parcel_provider.md); product map: [`_research/2026-05-30_cotality_property_brief_recon.md`](_research/2026-05-30_cotality_property_brief_recon.md).
>
> **Posture.** Strategy + implementation sequence. Most layers are post-wedge and tier/license gated; the near-term increment is the already-dispatched parcel/zoning adapter, then the climate (hydrology) and property (Carfax) layers the operator has greenlit pursuing.
>
> **Full endpoint reference (2026-06-06):** the complete Cotality platform swagger set is cataloged in [`_research/2026-06-06_cotality_api_surface_catalog.md`](_research/2026-06-06_cotality_api_surface_catalog.md). Three corrections it lands against earlier assumptions in this doc: (1) **parcel polygon is solved** via Spatial Tile `/spatial-tile/parcels` (§2/§6 "point-only" is superseded); (2) **climate is demo-key reachable** via Property CRA AR6 + RiskMeter `/climate-risk` and inland-flood-cat-model flood depths (§2 hydrology forcing is directly available; not eval-gated); (3) **Spatial Tile SpatialRecord Oil & Gas** tiers feed the [place-graph](77_place_graph_strategy.md) vertical/mineral estate plane — a new lane for the TX CRG minerals workstream.

## 1. Cotality lights up three place-graph planes

The [six-plane model](77_place_graph_strategy.md) shows Cotality is not one layer:

| Plane | Place-graph content | Cotality SKUs | Surfaces amplified |
|---|---|---|---|
| **C — Parcel economics** | Boundary, acres, zoning, owner, tax, assessed value | Property Characteristics, Parcel Data, SpatialRecord, AVM, CLIP (stable join key) | Property Brief, Cortex, SmartCity Parcel Intel |
| **D — Physical / environmental** | Flood, climate, perils, precipitation | Climate Risk Analytics (C3 Models): inland flood, storm surge, wildfire, wind, hail, winter storm, severe convective; chronic perils (heat, cold, drought, extreme precip; 84 indices); parcel AAL/PML; scenarios to 2030/2040/2050 | Property Brief (risk), Cortex (hydrology, feasibility), SmartCity (hazard planning) |
| **F — Market / transaction** | Comps, last sale, transaction history, valuation | Transaction history, AVM, Marshall & Swift reconstruction cost, cognitive imagery (Property Vision) | Property Brief (Carfax depth), Cortex (cost-to-build) |

Cotality is the national feed for planes C, D, and F at once. CLIP is the stable property ID that joins them, the analog to Regrid `ll_uuid` named in the place-graph place node.

## 2. Priority 1 — hydrology: blend Cotality climate models with the Cortex site simulator

**The question: does blending our hydrology simulator with Cotality's flood/climate models beat either alone? Yes, because they operate at different layers and compose.**

Cotality's climate models are actuarial and regional: statistical catastrophe models over 300,000 stochastic years, returning parcel-level expected loss (AAL/PML), peril probability, and a forward climate trend to 2050. They tell you *how much risk, priced, and which way it is trending*, with national coverage and insurance-grade validation. What they do not model is *this site's physical behavior*: grading, impervious cover, drainage paths, where water actually goes on this lot, or what a specific design change does.

The Cortex site hydrology simulator (40d: 2D.1 topography built; 2D.2 drainage and 2D.3 rainfall sim not built) is physics-based and site-specific: given a rainfall input on this parcel's actual DEM, it computes ponding, drainage, and flood extent, and answers the architect/city design question. What it lacks is a defensible rainfall input, forward climate scenarios, and a regional risk baseline.

**The blend: Cotality's extreme-precipitation and inland-flood scenarios become the forcing input to the site simulator.** Cotality says "the design-storm and forward-scenario rainfall intensity for this location is X in/hr, trending to Y by 2040"; the simulator takes X as the boundary condition and computes site-specific flood behavior on the real terrain. Neither competitor has both: actuarially-grounded, forward-looking forcing coupled to physics-based site response with design feedback. That coupling is the moat for the "4 inches of rain" capability.

Two further wins. **Sequencing:** Cotality climate gives a cited v1 answer now, before the simulator is built, so M-PropIntel / the "4 inches of rain" capability stops being fully gated on 40d 2D.2/2D.3. **Calibration:** over time, Cotality's observed loss/claims data validates the simulator's flood predictions (does the sim match the AAL?), an earned-confidence loop consistent with the calibration root.

Implementation: ship a `cotality:climate` brief layer first (cited flood/peril/precip risk, AAL, forward scenario); then re-scope Cortex 40d 2D.2/2D.3 to consume Cotality precipitation scenarios as forcing rather than inventing rainfall inputs.

## 3. Priority 2 — Carfax depth (planes C + F)

The brief today is description (parcel, zoning, FEMA, code). Carfax has history, value, and risk columns. Cotality supplies the history-and-value spine: owner, last sale, transaction history, tax, assessed and AVM value, structure characteristics, all CLIP-joined. Implementation: a `cotality:property` brief layer extending the existing site-context port, mirroring the parcel-adapter shape. This is the "Carfax for real estate" backbone the operator wants leveraged.

## 4. New surface — insurability / climate-resilience brief module

Cotality's home market is insurance underwriting (AAL, PML, RCV, perils), so we can surface an insurability and climate-resilience module that synthesizes planes C, D, and F plus Marshall & Swift reconstruction cost and local drainage/floodplain code (ICC track). Audiences and willingness to pay: brokers and buyers (in Texas, "will this be insurable and what will it cost" is a top anxiety amid the wind/hail/flood insurance crisis); architects (design-for-insurability and resilience, tied to RCV); cities (aggregate hazard exposure, mitigation planning, resilience-grant narratives); lenders/investors (climate risk to collateral).

**Positioning (structural check).** This is a premium module on existing surfaces (Property Brief Pro tier, Cortex, SmartCity), not a new brand and not a new tier model. It is Layer 2/3 paid reasoning over cited Cotality data, consistent with sell-reasoning-not-data and the tier ladder. It is informational and source-cited, not regulated insurance advice. No brand or tier conflict; a formal catalog-thesis-check and premortem fire when we commit to building it, not at strategy-capture.

## 5. The strategic play — reasoning provider over data provider

Cotality's MCP server (launched 2026-03-31, governed, traceable, client-controlled, with semantic-companion YAML) validates the MCP-first thesis and is the real unlock. Federating Hauska MCP to Cotality MCP means we never host their data (sovereignty and cost win), we orchestrate, reason over, cite, and meter it per call, and layer our event-registration provenance on top of their governed delivery. Their semantic-companion files map onto the atom contract, so atomization of their fields is fast. Their data freshness (they own county data and pay escrowed taxes for 99%+ of counties) is a calibration ground-truth anchor for the place graph. This is the "connective tissue between substrates" thesis made concrete, with a partner who just shipped the MCP rails. It is the production path; the direct REST adapters (sections 2–3) are the bridge until the MCP eval lands.

## 6. Implementation sequence

| # | Increment | Plane(s) | Surface / agent | Gate | Status |
|---|---|---|---|---|---|
| 1 | `cotality:parcels` + `cotality:zoning` adapter on the Regrid port | C | cc-agent-C (legacy-design-tools) | trial key | **Dispatched** ([`_dispatches/2026-06-06_cc-agent-C_cotality_adapter_scaffold.md`](_dispatches/2026-06-06_cc-agent-C_cotality_adapter_scaffold.md)) |
| 2 | `cotality:climate` brief layer (flood/peril/precip, AAL, forward scenario) | D | cc-agent-C | #1 smoke + license display rights | stub below |
| 3 | `cotality:property` brief layer (owner/sale/tax/AVM/characteristics, CLIP) | C+F | cc-agent-C | #1 smoke | stub below |
| 4 | Cortex 40d 2D.2/2D.3 consume Cotality precip scenarios as forcing | D | cc-agent-R (Cortex) | #2 + topography (2D.1 done) | re-scope note in [`40d`](40d_cortex_site_context_sprint.md) |
| 5 | Insurability / climate-resilience module (Pro tier) | C+D+F | cc-agent-C | #2, #3; thesis-check + premortem | post-wedge |
| 6 | Hauska MCP → Cotality MCP federation | C/D/F | cc-agent-M (hauska-mcp-server) | MCP eval signed (Hannah) | production path |

Dispatch stubs (expand to full atom-first dispatches when the trial key lands and the eval confirms which SKUs are accessible):

```yaml
# _dispatches/<date>_cc-agent-C_cotality_climate_layer.md
Goal: cotality:climate brief layer — parcel flood/peril/precip risk + AAL + forward scenario, cited
Gate: parcel adapter smoke green; license confirms consumer-surface display rights
Allowlist: lib/adapters/src/national/cotality-climate.ts, overlays.ts, brokerageSiteContext.ts
Caution: do not double-bill flood vs the FEMA adapter — FEMA stays free-baseline; Cotality climate is premium/forward-looking

# _dispatches/<date>_cc-agent-C_cotality_property_layer.md
Goal: cotality:property brief layer — owner, last sale, tax, AVM, characteristics, CLIP join
Gate: parcel adapter smoke green
Allowlist: lib/adapters/src/national/cotality-property.ts, overlays.ts, brokerageSiteContext.ts
```

## 7. Tier, license, and cost gating

License clearances (PUC, recon §6) before any consumer-surface display: extension display rights, agent metering, sub-licensing via Hauska MCP, attribution string, caching, Texas-scoped pricing. Tier economics: climate, valuation, and insurability SKUs are premium and gate to the Builder/Pro tiers, Cortex, and SmartCity, not the free consumer brief. Do not double-bill flood: FEMA stays the free-baseline flood layer; Cotality climate is the premium forward-looking risk layer. Insurability content stays informational and source-cited, never a regulated insurance quote.

## 8. Cautions and focus discipline

Most of this is post-wedge. The near-term build is increment 1 (dispatched). The climate and property layers (2, 3) are the operator-greenlit next steps and are high-value but gated on the parcel smoke and license clearance. The simulator blend (4) and federation (6) are the differentiators and the production path respectively, sequenced behind their gates so they do not pull build attention off shipping the wedge.

## Revision history

- **2026-06-06 (origin):** Captured from the Cotality brainstorm. Frames Cotality as a planes C/D/F feed, develops the hydrology blend (Cotality forcing + Cortex site simulator) and the Carfax depth layer as the two operator-greenlit implementation priorities, scopes the insurability module and the MCP federation play, and sequences the build with dispatch stubs.
