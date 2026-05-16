---
id: 2026-05-15_catalog_roadmap_input
title: Catalog roadmap — external planning input
status: input-under-review
last_updated: 2026-05-15
applies_to: portfolio
related: [07_product_line_summary, 08_tiered_access_model, 11_roadmap, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 47_codex_plan_review, 49_code_ingestion_pipeline, 50_hauska_mcp_server, 51_substrate_v1_sprint, adr_008_engine_factor_out]
owner: nick
---

# Catalog roadmap — external planning input

> **What this is.** A strategic-roadmap doc handed to Empressa
> planning on 2026-05-15 from an external planning context. Filed here
> verbatim as an input artifact for analysis against the active doc
> set, NOT adopted as canonical. Reconciliation analysis happens in
> the 2026-05-15 session record and via targeted edits to
> [`07`](../07_product_line_summary.md), [`08`](../08_tiered_access_model.md),
> [`51`](../51_substrate_v1_sprint.md), and [`11`](../11_roadmap.md) as
> decisions land.
>
> **Why it's filed here, not at top level.** Several framings in this
> doc (the "Codex" name for building-code lookup MCP, the "paywall
> raw data" Move 1, the six-separate-MCPs architecture, the
> Empressa-brand placement of the catalog) conflict with settled
> positions in the canonical doc set ([ADR-008](../80_adrs/adr_008_engine_factor_out.md)
> brand layer, [08](../08_tiered_access_model.md) Layer 1 free
> framing, [47](../47_codex_plan_review.md) Codex = plan review).
> These conflicts need explicit operator decisions before any of this
> doc's content becomes canonical.

---

# Empressa Agent Data Catalog
## Technical Roadmap and Business Context

Status: active development. Codex MCP and data ingestion engine in progress.
Owner: Empressa under Legacy Group ATX LLC
Last updated: May 2026

---

## Purpose of this document

This is the source of truth for the Empressa catalog strategy. AI development agents (Claude Code, Cursor, Replit Agent) should read this before making architectural decisions, opening pull requests against catalog components, or scoping new work.

It contains:
1. The business thesis and why we are building this
2. The system architecture and where each component fits
3. The six atomic MCPs that constitute the catalog
4. The four structural commitments that protect the model from known failure modes
5. The shipping sequence and decision gates
6. The stakeholder graph including contacts to engage

If you are an agent and you find yourself making a decision that is not anchored in this document, stop and surface the gap to the human operator.

---

## 1. Strategic thesis

Empressa is positioning as the canonical data catalog for AI agents that reason about physical-world jurisdictions. The buyer is the agent operator (developer, AEC firm, title company, municipal stack, eventually large platform vendors), not the human end user.

Reference analogies: Plaid for banking data, Stripe for payments, Empressa for jurisdiction-grounded physical-world data.

The moat is two layered:
- Data ingestion engine (proprietary cleaning, schema inference, multi-source harmonization)
- Hauska reasoning layer (verifiable, jurisdiction-aware reasoning over the data)

Free wrappers around public APIs are commodity. We do not compete there. We sell reasoning over data, not data alone.

---

## 2. System architecture

The catalog is a layered stack. Each layer has a defined responsibility and a defined interface upward.

- Layer 1 (top): Agent clients and web UI clients (Claude, Cursor, browsers, third-party agents)
- Layer 2: MCP server layer (one per atom) and parallel web UI per atom, sharing one deployment skeleton
- Layer 3: Hauska Engine (reasoning, jurisdiction awareness, verification, confidence scoring)
- Layer 4: Data Ingestion Engine (schema inference, drift detection, source loaders, partner pipelines)
- Layer 5 (bottom): Source Library (counties, RRC, FEMA, ICC, partnered cities)

Where this sits in the broader Empressa stack:
- Hauska Engine is shared with SmartCity OS, Cortex, Codex, and the Revit Connector
- The catalog is an expression of Hauska's four commitments (AI-accessible, verifiable, integrative, portable) made commercial through standardized MCP and web UI surfaces
- Revit Connector remains a separate consumer-facing surface; the catalog does not absorb it

---

## 3. The six atomic MCPs

Each atom ships as both a hosted web UI (free tier and paid) and an MCP server (free metered tier and paid). All atoms share the same deployment skeleton.

### Atom 1: Codex (status: in progress)
- Function: International and local building or residential code lookup with jurisdiction-aware amendments
- Primary sources: ICC code text, state amendments, municipal amendments (Austin first)
- ToS notes: ICC has licensing constraints on code text; reasoning-over-data frame applies
- Distribution: free Codex 1a public tool drives developer and consultant awareness

### Atom 2: Parcel and CAD (status: next up)
- Function: Owner, parcel boundary, assessed value, ownership history by address
- Primary sources: county appraisal districts (Williamson, Bastrop, Travis as first three)
- ToS notes: county data is mostly TPIA protected; partnership preferred where available
- Use case: brokers, developers, title researchers, feasibility agents

### Atom 3: Zoning and ETJ
- Function: Allowed uses, setbacks, overlays, ETJ status by address
- Primary sources: city zoning ordinances and GIS layers
- ToS notes: mostly public; some cities require contract for bulk access
- Composes with Atoms 1 and 2 into a development feasibility query

### Atom 4: Permit and inspection status
- Function: Permit applications, status, inspections, code violations by address
- Primary sources: partnered cities (Bastrop first), scraped where ToS allows
- ToS notes: highest friction atom due to MGO incumbent contracts
- Strategic: this is the wedge against MGO; partnership-first sourcing is non-negotiable

### Atom 5: RRC and mineral rights
- Function: Texas Railroad Commission well permits, production, operator data, plug and abandonment status
- Primary sources: Texas RRC public records
- ToS notes: state public records, TPIA protected; cleanest ingestion case
- Use case: landmen, mineral buyers, royalty owners, surface developers

### Atom 6: Hazard and environmental
- Function: FEMA flood zones, wetlands, ESA habitat, USGS overlays
- Primary sources: federal datasets (FEMA, USFWS, USGS)
- ToS notes: federal data, FOIA protected, redistribution permitted
- Compositional bonus: applies to every site in the country

---

## 4. Structural commitments (pre-mortem fixes baked in)

These four moves are not optional. Every architectural decision should be checked against them.

### Move 1: Sell reasoning, not data
We do not redistribute datasets. We return derivative reasoning over data. The MCP interface returns answers with source attribution and confidence scores, not raw records. This addresses licensing exposure, pricing compression, big tech competition, and quality liability simultaneously.

Implementation requirement: every MCP response must include reasoning chain, source citation, and confidence score. Raw data passthrough is not permitted at the free tier and is paywalled at the enterprise tier.

Gate: Texas IP attorney opinion memo required before scaling beyond the first three jurisdictions. Budget: eight to twelve thousand dollars.

### Move 2: Partnership-first sourcing
Cities and counties are contractual data licensors, not extraction targets. Each partnership includes revenue share on third-party API calls. Bastrop is the template. Target: six to ten partnered municipalities by end of year one.

Implementation requirement: ingestion engine supports partner-licensed sources as a first-class type, with audit trails and partner-facing revenue dashboards.

### Move 3: Cost per jurisdiction onboarded
Master metric. Target: under two hundred dollars in compute plus one hour of human review per new jurisdiction onboarded.

Implementation requirement: ingestion engine reports this metric per source automatically. Sources exceeding the target are flagged for engineering review, not silently absorbed.

Hard kill criterion: if the metric is not achievable after three counties (proof set in month 1 through month 2), the catalog thesis is invalidated and the business reverts to a services model.

### Move 4: Dual interface from day one
Every atom ships as web UI plus MCP server. The web UI captures human revenue and serves as distribution marketing. The MCP server captures agent revenue when it materializes. This removes timeline risk from autonomous agent adoption.

Implementation requirement: shared deployment skeleton enforces both interfaces. Atoms that ship MCP-only are not deployable.

---

## 5. Roadmap and decision gates

### Month 1
- Codex MCP and Codex web tool live
- Free tier active with rate limits
- Ingestion engine validated on three Codex sources
- One paying design partner (existing relationship, not a stranger)
- Texas IP attorney opinion memo delivered

### Month 2
- Parcel and CAD atom ships for Williamson, Bastrop, Travis counties
- Cost per jurisdiction measured against target
- First metered API customer onboarded

### Month 3
- Zoning and ETJ atom ships for the same three counties
- Composed development feasibility demo published
- Decision gate: if cost per jurisdiction target is missed, halt catalog expansion and review

### Months 4 through 6
- Remaining atoms (Permit, RRC, Environmental) ship at one per month
- Six partnered cities under contract for permit data
- Enterprise pricing tier launched

### Year 1 end state target
- Six atoms live
- Six to ten city partnerships
- Three to five enterprise customers
- Catalog positioned in agent operator conversations as the Texas-first reference implementation

---

## 6. Decision rules

How the agent and human operator filter what to work on.

- Hauska spine rule: if a workstream does not feed or express Hauska, it does not consume catalog cycles
- Cost per jurisdiction rule: if onboarding exceeds two hundred dollars plus one hour, engineering review required before adding the source
- Focus queue rule: if it is not on the six atom roadmap or an existing anchor deployment, it queues; no parallel exploratory work
- Quality gate rule: every MCP response carries source attribution, confidence score, and timestamp; releases blocked without these
- Partnership preferred rule: if a city is on the target partnership list, do not scrape their data; route to Sylvia's pipeline

---

## 7. Stakeholder graph

### Empressa internal
- Operator (sole human): all strategic decisions, architecture review, final approvals
- AI development agents: Claude Code, Cursor, Replit Agent (building under direction)

### Existing relationships
- Sylvia Carrillo: municipal network anchor; gate for city partnerships
- Valerie: commercial and GTM lead; pipeline for enterprise and broker conversations
- Nick: architecture and engineering decisions; review on technical scope
- Bastrop city (anchor deployment): first SmartCity OS partner and source of permit and inspection ingestion patterns
- Mox Living CEO (active opportunity): 90 day integration pilot framing; case study candidate
- Valerie Thompson (eXp Realty): CMA tool user; consumer of parcel and comp data

### Contacts to engage (not yet established)

These roles are required to execute the plan and are not yet in the contact graph. Action: identify and engage in month 1 unless noted otherwise.

Legal and risk
- Texas IP attorney: required for Move 1 opinion memo before month 3. Candidates: Husch Blackwell Austin, Norton Rose Fulbright Austin, or Pillsbury Austin (data licensing and AI practice)
- Texas startup or corporate attorney: partnership agreement templates and any Legacy Group separation work; should be different from IP counsel
- Tech E and O insurance broker: before first enterprise contract. Look for specialists in data provider and AI liability coverage

Municipal channel
- City CTO and CIO contacts in the Williamson County belt: Round Rock, Pflugerville, Cedar Park, Hutto, Georgetown. Sylvia introductions preferred
- Bastrop city manager and IT director (deepen existing relationship for permit data partnership template)
- Texas Municipal League (TML): municipal channel and credibility builder
- Texas City Management Association (TCMA): peer network for city managers, helpful for replication of Bastrop template

Data source partners
- County appraisal district directors: Williamson CAD, Bastrop CAD, Travis CAD. Required for partner-licensed parcel data
- Texas Railroad Commission outreach: data access channel for RRC atom, possibly through Permian Basin operator networks or TIPRO
- International Code Council (ICC): licensing relationship for Codex
- Texas Comptroller (open data office): support for multi-county data harmonization

Distribution and GTM channels
- Texas Land Title Association (TLTA): distribution channel for Parcel and Zoning atoms once live
- ULI Austin and Austin Apartment Association: GTM channel for property tech customers
- AGC Texas and AIA Austin: AEC distribution channels
- Austin AI and developer community: dev rel surface for free tier marketing (Capital Factory, Austin AI meetups)
- Anthropic developer relations: MCP ecosystem positioning, possible co-marketing on agent data catalog framing
- ATX startup networks (Capital Factory, Tech Ranch Austin): operator network and potential angel pipeline if catalog spins out

Customer pipeline targets
- Multifamily operators in Austin and Central Texas (Mox Living is template): catalog buyers for feasibility and acquisition workflows
- Title insurance underwriters (Stewart, First American, Fidelity National): enterprise catalog buyers for title and lien workflows
- Outsourced plan review firms: identified previously as part of consultant network distribution play
- Large AEC firms with Texas presence (HKS, Page, Pfluger Architects, STG Design): enterprise catalog buyers for Codex and Zoning atoms

---

## 8. Open questions

Unresolved and require human operator decision. Agents should flag if these block progress.

- Per-atom pricing structure (free tier limits, metered rates, enterprise floor)
- Hauska and Legacy Group separation timing and structure
- Whether the catalog operates under Empressa brand or a sub-brand
- Data license template language (working draft needed by month 2)
- Specific city order for partnership push (Bastrop confirmed; next three TBD)
- Insurance carrier and coverage limits
- Whether to incorporate a separate legal entity for the catalog
- Revenue share percentage with partnered municipalities

---

## How to update this document

Changes to this document require human operator review. Agents may propose updates via pull request. The structural commitments in section 4 are versioned: a change to any of the four moves is a strategic pivot and requires explicit operator sign-off.

End of document.
