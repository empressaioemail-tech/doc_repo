---
id: 77_place_graph_strategy
title: Place graph strategy — country-scale AI-native real estate intelligence
status: superseded-as-north-star
superseded_by: 19_the_instrument_contract
retains: go-to-market content and the Texas ingest lane, which remain active and should be relocated rather than lost. The place graph is one shape family under 19; it is no longer the top of the model.
last_updated: 2026-07-07
applies_to: portfolio
related: [09_post_saas_substrate_thesis, 11_roadmap, 16_commercialization_roadmap, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 49_code_ingestion_pipeline, 49b_encumbrance_ingestion_pipeline, 50_hauska_mcp_server, 75_hauska_brokerage_workflow_plan, 75a_hauska_brief_extension, 76_empressa_wedge_90d_operating_plan, 77b_cotality_integration_strategy, 73_partnerships, 80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_020_recorded_instruments_and_restriction_clauses, 80_adrs/adr_021_constraint_resolution_and_precedence, _sessions/2026-05-27_place_graph_tx_crg_minerals_claude_code]
owner: nick
---

# Place graph strategy

> **Purpose.** North-star strategy for Hauska substrate and Empressa product surfaces: a **country-scale place graph** where every resolvable location is a node, every normative, physical, economic, and operational fact is a typed edge with provenance, and every agent query is metered reasoning—not a jurisdiction PDF warehouse or a one-off site report.
>
> **Status posture.** Active strategy (2026-05-27). Supersedes “jurisdiction count” as the primary success metric for corpus work. Does not replace [`75_hauska_brokerage_workflow_plan.md`](75_hauska_brokerage_workflow_plan.md) (eXp / Matrix / SkySlope wedge) or [`76_empressa_wedge_90d_operating_plan.md`](76_empressa_wedge_90d_operating_plan.md) (90-day execution); those are **GTM lanes** on top of this graph.

## North star (one sentence)

**Hauska builds the place graph: resolve a location → return cited, layered intelligence (what applies, what was built, who has rights, what happened before) for agents and professionals, with licensors paid on consumption.**

## What we do differently (vs market)

Stop competing on **jurisdiction count** or **$99 feasibility PDFs** (Buildability, Zoneomics-style dossiers). Ship the **graph** as the product: MCP tools (`resolve_place`, `place_dossier`, `effective_code_at`) with procedure-execution provenance and Layer 2 metering. Texas municipal ingest is the **factory for plane A**; success is **places with complete layers**, not cities on a spreadsheet. ICC + General Code meetings are **integrator + rev-share** deals, not credential-only ingests.

## The place node

A **place** is not only a street address. Canonical anchors (in priority order for Texas v1):

| Anchor | Role | Source |
|--------|------|--------|
| **Address** | UX entry (Google, extension, CRM) | Geocoder, user input |
| **Parcel identity** | Stable join key | Regrid `ll_uuid`, CAD parcel ID |
| **Legal description** | Subsurface and recorded-instrument index | County appraisal district, survey, plat lot/block |
| **Jurisdiction context** | Which municipal code corpus applies | `jurisdiction-corpus` atom |

Address maps to parcel; parcel carries legal description; legal description drives **county clerk** mineral/O&G index searches (high-level, not full title). Replatting splits surface lots while underlying metes-and-bounds may persist—graph must support **parent legal + child plat** relationships over time.

## Six planes (horizontal layers on the place node)

| Plane | Content | Primary build / partner |
|-------|---------|-------------------------|
| **A — Public law** | ICC model codes + local UDC/amendments | ICC, NFPA, General Code, Municode |
| **B — Private surface law** | CC&Rs, easements, deed restrictions | [`49b`](49b_encumbrance_ingestion_pipeline.md), county clerk MOU |
| **C — Parcel economics** | Boundary, acres, zoning taxonomy | Regrid Premium; assessor |
| **D — Physical / environmental** | Flood, soils, slope, habitat | FEMA, USGS, USDA, USFWS, state |
| **E — Operational / precedent** | Permits, staff findings, plan review | Partnership cities (Bastrop template); Shovels-class feeds where licensed |
| **F — Market / transaction** | Comps, MLS (optional v2+) | Defer; not core moat |

## Vertical estates (subsurface and air)

Texas surface real estate often splits **surface**, **mineral**, and (future) **air** rights. These are **edges and constraints on the place node**, not a separate product category.

| Estate | What it is | v1 posture |
|--------|------------|------------|
| **Surface** | Development, zoning, building code | Core (Cortex, brief, Codex) |
| **Minerals** | Mineral deeds (conveyance), O&G leases (who owns minerals, royalty burden) | **High-level index** via county clerk on legal description—not full title run sheet |
| **Airspace** | Rights above parcel after replat / FAA adjacency (future) | **Queued**; legal description + plat evolution is prerequisite |

**Mineral intelligence (operator requirement, 2026-05-27).** For a given CAD legal description, the system should attempt to surface recorded **mineral deeds** and **O&G leases** where the county clerk index is online (coverage varies; Montgomery-class counties back to patent vs electronic pools from ~1964). Output is **triage**: “nothing indexed 1980–today” vs “hits found—review required,” not a guarantee of clear title. In Texas the **mineral estate is dominant** outside city limits that regulate minerals away; developers need **surface waivers** (e.g. ingress/egress for exploration) even when surface and mineral owners align. **Data-center buyers** increasingly seek large tracts (surface + minerals) for on-site gas generation—a segment distinct from urban infill apartments but same graph primitive.

**O&G land administration (longer horizon).** Separate **landing-pad product** for upstream land (leases, division orders, title chains, production) per historical catalog Atom 5 ([`_sessions/2026-05-15_catalog_roadmap_input.md`](_sessions/2026-05-15_catalog_roadmap_input.md)). Shares **legal-description anchor** and partnership-first recorder access; does not block real-estate place graph v1. Texas RRC public data is the cleanest state-ingest case for production/well status.

## Segment → taste → landing pad

| Segment | “Taste” (free / extension) | Paid landing pad |
|---------|---------------------------|------------------|
| **Architects / engineers** | Address → layers + code citations | Cortex |
| **Residential / commercial brokers (eXp wedge)** | Matrix / extension brief | Property Brief + SkySlope ([`75`](75_hauska_brokerage_workflow_plan.md)) |
| **Texas Commercial Realty Group (TX CRG)** | Google address → push to CRM + mineral flag on brief | TX CRG CRM + shared substrate ([`77a`](77a_txcrg_crm_and_brokerage_ops.md)) |
| **O&G land professionals** | Legal description → mineral/lease index hits | O&G platform (future; land-admin scope) |
| **Agent builders** | MCP `place_dossier` | Hauska catalog + Layer 2 |

Browser extension and Property Brief are **acquisition surfaces** that feed the graph and professional CRM—not the moat alone.

## Graph maturity milestones (replace jurisdiction-only scoreboard)

| Milestone | Exit |
|-----------|------|
| **G0 — Place identity** | `parcel-record` + legal description from CAD for geocoded engagements |
| **G1 — Normative stack (TX)** | ICC Layer 1 + municipal L2/L3; effective-rule resolution; TX coverage ledger |
| **G2 — Physical stack** | Federal/state overlays on place |
| **G3 — Place dossier MCP** | `get_place_dossier(place)` — one agent call, cited layers |
| **G4 — Operational precedent** | Bastrop pilot: permits/findings on place |
| **G5 — Private + mineral index** | Encumbrance upload + clerk index for minerals on legal description |
| **G6 — Commercial graph** | Metered Layer 2 on resolve + reasoning |

Product QA milestones (M-CortexQA, M-CodexQA) prove **end-to-end on a place**, not “N jurisdictions ingested.”

## Partnerships (recalibrated asks)

| Counterparty | Extract beyond ingest |
|--------------|---------------------|
| **ICC / NFPA** | Layer 1 structure, adoption metadata, **agent metering + rev-share**, intros to General Code |
| **General Code** | **Integrator catalog license**, TOC/content API, change notifications, atomize + MCP rights |
| **Regrid** | Premium fields, derivative atom cache rights, `ll_uuid` as join key |
| **County clerks** | Recorded instrument + **mineral/O&G index** API or bulk by legal description |
| **Cities (Bastrop)** | Permits, findings, operational precedent edges |

## Competitive posture (summary)

| They win | We win |
|----------|--------|
| Fast $99 site reports (Buildability) | Cited **composition** + agent API |
| Zoning API breadth (Zoneomics) | **Effective building code** + minerals flag + ops precedent |
| Code library seats (UpCodes) | **Place graph** + MCP + licensor economics |
| CRE data warehouses (LightBox) | **Reasoning layer** on top of their data |

Full landscape: [`_sessions/2026-05-27_place_graph_tx_crg_minerals_claude_code.md`](_sessions/2026-05-27_place_graph_tx_crg_minerals_claude_code.md) § Competitive analysis.

## Sequencing (90-day alignment)

Aligns with [`76_empressa_wedge_90d_operating_plan.md`](76_empressa_wedge_90d_operating_plan.md) but reframes corpus rows:

1. **ICC week** — Layer 1 + adoption ask + GC intro  
2. **G0 + G3** — parcel-record + dossier MCP (parallel)  
3. **Sync 5** — plane A factory + **coverage ledger** (ingested \| blocked:GC \| mineral-index:county)  
4. **General Code** — integrator deal (bizops)  
5. **Mineral index pilot** — one county with strong clerk online depth + Crosby-style surface-waiver use case  
6. **TX CRG CRM** — operator wedge, not Hauska commercial spine ([`77a`](77a_txcrg_crm_and_brokerage_ops.md))

## Open decisions

| ID | Question | Owner |
|----|----------|-------|
| PG-1 | Is mineral index **substrate** (public catalog) or **TX CRG-only** until clerk MOU template exists? | Nick |
| PG-2 | Salesforce vs lightweight CRM for TX CRG vs build on Hauska consent graph | Nick |
| PG-3 | First mineral-index pilot county (Montgomery vs appraisal-district-driven) | Operator + cc-agent-E discovery |
| PG-4 | Airspace: defer ADR until plat/legal-description graph stable | Planner |

## Revision history

- **2026-05-27:** Initial strategy filed from planner session: place graph north star, competitive recalibration, operator conversation (TX CRG CRM, minerals/legal description, data centers, O&G landing pad horizon).
- **2026-07-07:** Commercial data sourcing settled for the G6 commercial-graph path: Moody's CRE declined; the commercial persona runs on CAD public record + LoopNet observed through the user's own extension session + Cotality trends, all estimates labeled with provenance. Borrowed-login crawling rejected (premortem red). LoopNet is the first commercial extension adapter (queued). Record: `_decisions/2026-07-07_cre_data_no_moodys_observation_stack.md`.
