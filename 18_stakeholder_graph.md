---
id: 18_stakeholder_graph
title: Stakeholder graph — relationships, contacts, channels
status: active
last_updated: 2026-05-15
applies_to: portfolio
related: [11_roadmap, 13_risk_register, 14_pricing_framework, 06_cities_value_narrative, 11a_bastrop_live_roadmap, 47_codex_plan_review, 51_substrate_v1_sprint]
owner: nick
---

# Stakeholder graph

> **Purpose.** Durable map of relationships that matter to portfolio
> execution — people, organizations, channels, counterparties. Split
> into established relationships (the current contact graph) and
> contacts to engage (work-items that the roadmap depends on but that
> aren't yet in the contact graph). The "contacts to engage" list is
> the action surface: every entry implies a roadmap item.
>
> **Status posture.** Origin 2026-05-15, seeded from the catalog
> roadmap agent's stakeholder list (per
> [`_sessions/2026-05-15_catalog_roadmap_input.md`](_sessions/2026-05-15_catalog_roadmap_input.md))
> + existing references across [`11_roadmap.md`](11_roadmap.md),
> [`13_risk_register.md`](13_risk_register.md), and
> [`06_cities_value_narrative.md`](06_cities_value_narrative.md).
> Maintained going forward as a living artifact — every new
> stakeholder conversation produces an entry; every retired
> relationship is marked, not deleted.

## How this doc relates to others

This doc is the **contact graph**. Other docs reference these
stakeholders by name; this doc is where they live as first-class
entities with role, relationship status, owner, and engagement
context.

- [`11_roadmap.md`](11_roadmap.md) carries the **work items** that
  require contact engagement (e.g., "engage Texas IP attorney" is a
  P1 task; this doc lists the candidate firms).
- [`13_risk_register.md`](13_risk_register.md) carries the **risks**
  that specific relationships mitigate or expose (e.g., Risk 5
  single-customer is about Sylvia; the contact lives here).
- [`14_pricing_framework.md`](14_pricing_framework.md) carries the
  **commercial posture** for specific deal shapes; the customer-side
  contacts live here.
- [`06_cities_value_narrative.md`](06_cities_value_narrative.md)
  carries the **city-side strategic frame**; city-side contacts live
  here.

## Empressa internal

| Name / Role | Function | Owner notation |
|---|---|---|
| **Nick** (operator) | All strategic decisions, architecture review, final approvals | Self |
| **Valerie** (commercial / GTM) | Commercial and GTM lead; enterprise + broker pipeline | Nick + Valerie |
| **AI development agents** (Claude Code, Cursor, Replit Agent, claude.ai planners) | Build under direction; per-repo soft specialization | Nick directs |

## Established relationships (current contact graph)

### Cities + municipal

| Name | Role | Relationship status | Strategic role |
|---|---|---|---|
| **Sylvia Carrillo** | Bastrop city manager; municipal-network anchor | Active deep partnership | Gate for city partnerships; reviewer-zero for Codex 1b; Bastrop-pioneering narrative anchor. Risk 5 (single-customer existential) is about this relationship. |
| **Jaime** (Bastrop reviewer) | Bastrop plan reviewer | Active | Reviewer-zero alongside Sylvia for Codex 1b adjudication-capture |
| **Bastrop city** | First SmartCity OS partner | Active deep partnership | Source of permit + inspection ingestion patterns; partnership template for subsequent cities |

### Active customer opportunities

| Name | Role | Relationship status | Strategic role |
|---|---|---|---|
| **Mox Living CEO** (Miguel Arce) | Multifamily operator decision-maker | Active prospect — post-call-1 | 90-day integration pilot framing; case study candidate. Per Mox memory: 300 ppl / 45 locations / 12k units Austin multifamily; lead Phase 1 with accounting close, not parcel intel |
| **Valerie Thompson** (eXp Realty) | Realtor; CMA tool user | Active | Consumer of parcel + comp data; tier-conversion candidate for Cortex / SmartCity OS data surfaces |
| **Sylvia $1M proposal pipeline** | Bastrop expansion | Live negotiation | Pricing posture is Path A per [`14_pricing_framework.md`](14_pricing_framework.md); phase the work, anchor Y1, expansion via change orders |

## Contacts to engage (action surface)

These roles are required to execute the plan and are **not yet** in
the contact graph. Each entry implies a roadmap item with an owner
and a sequencing.

### Legal and risk

| Need | Candidates | Owner | Sequencing |
|---|---|---|---|
| **Texas IP attorney** for data licensing opinion memo (gate for non-Bastrop catalog ingest) | Husch Blackwell Austin · Norton Rose Fulbright Austin · Pillsbury Austin (data licensing + AI practice) | Nick | **P1** — gates [`51`](51_substrate_v1_sprint.md) Stream 1D non-Bastrop ingestion. Budget $8–12K |
| **Texas startup / corporate attorney** for partnership agreement templates + Legacy Group separation work | TBD — different counsel from IP attorney | Nick | P2 — needed before first city partnership signs |
| **Tech E&O insurance broker** | Look for specialists in data-provider + AI liability coverage | Nick | **P3** — needed before first enterprise contract. Mitigates Risk 12 (data provider liability) |

### Municipal channel

| Need | Targets | Owner | Sequencing |
|---|---|---|---|
| **City CTO / CIO contacts in Williamson County belt** | Round Rock · Pflugerville · Cedar Park · Hutto · Georgetown | Nick + Sylvia introductions | P2 — supports [`51`](51_substrate_v1_sprint.md) Tier 1 batch ingest framing as partnership-led rather than scrape-led where possible |
| **Bastrop city manager + IT director** (deepen for permit-data partnership template) | Bastrop city org | Nick | P1 — partnership template is upstream of every subsequent city deal |
| **Texas Municipal League (TML)** | TML state office | Nick + Valerie | P2 — municipal channel + credibility builder |
| **Texas City Management Association (TCMA)** | TCMA conference + peer network | Sylvia introductions preferred | P2 — peer network for replicating Bastrop template; TCMA / ICMA conferences strong TX presence |

### Data source partners

| Need | Targets | Owner | Sequencing |
|---|---|---|---|
| **County appraisal district directors** | Williamson CAD · Bastrop CAD · Travis CAD | Nick + Valerie | P2 — required for partner-licensed parcel data; CAD partnership pattern distinct from city permit pattern (catalog agent drafting partnership template) |
| **Texas Railroad Commission** | RRC + possibly Permian Basin operator networks or TIPRO | Nick | P3 — data-access channel for RRC + mineral-rights atom domain (Bump 3) |
| **International Code Council (ICC)** | ICC licensing office | Nick | P2 — licensing relationship for code text; gates "international code lookup" catalog claim |
| **Texas Comptroller (open data office)** | Comptroller open-data team | Nick + Valerie | P3 — multi-county data harmonization support |

### Distribution + GTM channels

| Need | Targets | Owner | Sequencing |
|---|---|---|---|
| **Texas Land Title Association (TLTA)** | TLTA conference + member network | Valerie | P3 — distribution for Parcel + Zoning atoms once live |
| **ULI Austin + Austin Apartment Association** | ULI Austin chapter · AAA | Valerie + Nick | P3 — PropTech customer GTM channel |
| **AGC Texas + AIA Austin** | AGC TX state office · AIA Austin chapter | Valerie | P3 — AEC distribution channels (Cortex + Codex 1a / 1b) |
| **Austin AI + developer community** | Capital Factory · Austin AI meetups | Nick | P2 — dev-rel surface for MCP server free tier marketing |
| **Anthropic developer relations** | Anthropic DevRel team | Nick | P2 — MCP ecosystem positioning; possible co-marketing on agent data catalog framing; gates [`51`](51_substrate_v1_sprint.md) launch listing in Anthropic MCP directory |
| **ATX startup networks** | Capital Factory · Tech Ranch Austin | Nick | P3 — operator network + potential angel pipeline if catalog spins out |

### Customer pipeline targets

| Need | Targets | Owner | Sequencing |
|---|---|---|---|
| **Multifamily operators in Austin / Central TX** | Mox Living (template, active) + others TBD | Valerie + Nick | P2 — catalog buyers for feasibility + acquisition workflows |
| **Title insurance underwriters** | Stewart · First American · Fidelity National | Valerie | P3 — enterprise catalog buyers for title + lien workflows |
| **Outsourced plan review firms** | SAFEbuilt · Bureau Veritas · NV5 · Charles Abbott | Valerie + Nick | P2 — consultant-network distribution play per [`08_tiered_access_model.md`](08_tiered_access_model.md); Codex 1b seat-licensing target |
| **Large AEC firms (TX presence)** | HKS · Page · Pfluger Architects · STG Design · Halff · Kimley-Horn · HR Green · Freese & Nichols · HOK | Valerie + Nick | P3 — enterprise catalog buyers for Codex + Zoning atoms; Cortex per-firm enterprise targets |
| **PropTech embedders** (catalog Embedder License tier) | Yardi · Tyler · Accela · CompStak · Crexi · Reonomy · AppFolio | Valerie + Nick | P3 — gates Scenario C activation for [`50_hauska_mcp_server.md`](50_hauska_mcp_server.md) revenue model; 6–18 month enterprise sales cycle |
| **Code rewrite firms** | Code Studio · ZoneCo · Camiros | Valerie + Nick | P3 — co-publishing partnership candidates per [`08_tiered_access_model.md`](08_tiered_access_model.md) consultant channel |

## Maintenance protocol

- **New stakeholder enters the graph** → add row to the appropriate
  section with role, relationship status, owner, strategic role.
- **Relationship advances** (e.g., "to engage" → "established") →
  move row, mark `last_status_change` in row notes, retain origin
  context in revision history.
- **Relationship retires** → mark status `retired` or `dormant`;
  don't delete (history matters for future re-engagement).
- **Roadmap item closes a "to engage" entry** → leave the row with
  status flipped; the contact graph compounds over time.

## Cross-references

- [`11_roadmap.md`](11_roadmap.md) — work items requiring contact
  engagement
- [`13_risk_register.md`](13_risk_register.md) — relationship-tied
  risks (esp. Risk 5 single-customer)
- [`14_pricing_framework.md`](14_pricing_framework.md) — commercial
  posture for customer contacts
- [`06_cities_value_narrative.md`](06_cities_value_narrative.md) —
  city-side strategic frame
- [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) —
  Bastrop-anchor work
- [`47_codex_plan_review.md`](47_codex_plan_review.md) — consultant
  channel framing
- [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) — sprint
  depending on partnership-track contacts
- [`_sessions/2026-05-15_catalog_roadmap_input.md`](_sessions/2026-05-15_catalog_roadmap_input.md)
  — origin source for the contacts-to-engage list

## Revision history

- **2026-05-15 (origin).** Drafted from catalog roadmap agent's
  stakeholder list + existing references across the doc set.
  Established relationships seeded from current state; contacts-to-engage
  rows tied to roadmap sequencing (P1 / P2 / P3) so the action
  surface is actionable rather than aspirational.
