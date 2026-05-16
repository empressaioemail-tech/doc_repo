---
id: 30_smartcity_os
title: SmartCity OS
status: active
last_updated: 2026-05-16
applies_to: smartcity-os
related: [10_ground_truth, 28_mcp_first_product_design, 29_mcp_surface_tier_model, 30a_smartcity_stabilization_sprint, 33_smartcity_codex_1b_integration, 40_design_accelerator]
---

# SmartCity OS

Live municipal intelligence platform. Single live customer (City of
Bastrop, Texas). Second city (Jarrell, TX) confirmed in pipeline.

This doc is the product home: identity, suite, architecture, customers,
strategic positioning. For *current* implementation state — production
revision, fires, recent recon findings — see
[`10_ground_truth.md`](10_ground_truth.md). For sub-product depth, see
the `3X` docs as they land (e.g. `31_smartcity_os_operations_dashboard.md`).

## What it is

Suite of integrated municipal intelligence tools served from a single
multi-tenant Cloud Run service backed by a single Postgres graph. All
applications are lenses over the same entity graph; no per-product data
silos. The architectural commitment is the **atom-graph thesis**: every
domain object is an atom carrying data, context, history, and identity,
and applications render those atoms in different ways. Atom architecture
detail belongs in `80_adrs/adr_001_atom_architecture.md` when written.

Production target: Google Cloud Run, project `smartcity-os-prod`, region
`us-central1`. Custom domain `smartcityos.io`. Cutover from Replit on
2026-05-03. Pre-cutover lineage and Replit-era artifacts are tracked in
[`10_ground_truth.md`](10_ground_truth.md).

Backing services: Neon PostgreSQL (Replit-managed today, Empressa-owned
post-migration), GCP Secret Manager for credentials, Cloud Build for
container builds, Artifact Registry for image storage.

## Customer context

### Bastrop, Texas (primary, paying)

- **City Manager:** Sylvia Carrillo. 24-year tenure. Active product
  champion. Connected to TCMA / ICMA networks; primary brand
  ambassador for city-manager peer-network outreach.
- **IT / Operations:** Jaime Hernandez (also seen as Rodriguez in some
  records — name needs verification). Trust-sensitive around
  infrastructure integrations; treat any IT touchpoint with care.
- **Tenant ID:** `tenant_id = 2` is always Bastrop production. Codified
  in `AGENT_RULES.md` in the smartcity-os repo. `tenant_id = 1` is
  always demo data.

### Jarrell, Texas (confirmed, in pipeline)

Second city committed. Triggers a new architectural requirement
(informally tagged M9): city-to-city communication architecture and a
federated best-practices knowledge base across Compass AI models per
city. Cross-tenant data sharing is a deliberate moat — knowledge
learned on one city's data improves the AI surface for all cities,
without the underlying records crossing tenants.

### Sales pipeline

Outreach driven by Sylvia's peer network plus targeted outbound.
Tooling: Pipedrive CRM, 8-stage pipeline "SmartCity OS — City Inbound".
Synthesia AI avatar videos planned for top-of-funnel; 21-day email
cadence designed.

EdgeConneX (second Bastrop County data center campus) is a partnership
target, not a customer. First conversation should be framed as
community partnership rather than complex technical integration. Key
contacts noted in CRM: Evan Pierce, Lynn Smullen, Phillip Marangella,
Pierre Maitre.

## Suite

Five products served from the same Cloud Run service:

| Product | Status | Purpose | Sub-doc |
|---|---|---|---|
| Operations Dashboard | Live | Real-time city ops view — fleet, incidents, permits, calls, calendar | `31_*` (TBD) |
| Parcel Intelligence | Live | Parcel-level briefings combining municipal + federal + spatial data | `32_*` (TBD) |
| AI Plan Review (Codex 1b) | In development (M4-B) | Reviewer-side plan review with AI-assisted finding generation. SmartCity-side standalone surface (1b); companion to contractor-firm-side Codex 1a deployed via host markup tools. See [`47_codex_plan_review.md`](47_codex_plan_review.md). | `33_*` (TBD) |
| CitizenConnect | Live | Citizen-facing app for service requests, status, communication | `34_*` (TBD) |
| Digital Twinning | Early | 3D model of city assets, integration with parcel + ops data | `35_*` (TBD) |

**Architectural prerequisite chain:** Parcel Intelligence is a
prerequisite to AI Plan Review. Settled ADR — do not re-litigate.

**AI Plan Review (M4-B → Codex 1b):** The SmartCity-side reviewer
surface is now Codex 1b — see
[`47_codex_plan_review.md`](47_codex_plan_review.md). M4-B / PLR-1..28
/ SD-1..SD-8 / W1-W6 vocabulary stays here as the SmartCity-internal
milestone, sprint inventory, settled-decision catalog, and activation
sequence; per-item cross-mapping to Codex's CDX-* feature structure
lands in the `33_*` sub-doc when written.

Two updates to the prior framing fall out of the Codex rename and the
1a/1b surface split:

- **Bluebeam framing.** SD-1's "replace Bluebeam for the 70% case while
  keeping an embedded editor escape for the 30%" is superseded by the
  hybrid: Codex 1a *invites into* Bluebeam (and other host tools —
  Acrobat, ProjectDox) for contractor-firm reviewers, while Codex 1b
  is the standalone surface for cities that don't use a host tool. We
  don't replace Bluebeam; we serve both ICPs.
- **Wave order.** W1-W6's parity-first sequencing yields to CDX-*
  commercial-wedge-first (1a invited foundation → 1b activation →
  moat-grade compounding → versatility → fabric). W1-W6 labels can
  stay as a SmartCity-side activation reference for 1b deployment if
  the `33_*` author finds them useful; not load-bearing.

Detail belongs in `33_*` when written.

## Architecture

### Atom graph

Every domain entity (engagement, parcel, finding, work order, snapshot,
etc.) is modeled as an atom. Applications are lenses over the atom
graph. No application maintains its own private store of data that
belongs to another application's atoms. Implications:

- Schema changes propagate via the TS schema (Drizzle) — see
  [`20_agent_operating_rules.md`](20_agent_operating_rules.md) HR-4.
- Any new feature that creates its own data silo gets reworked.
- Cross-product views (a parcel's permits + work orders + AI plan
  reviews on one screen) are cheap because the underlying graph unifies
  them.

Full atom architecture spec lives in
`80_adrs/adr_001_atom_architecture.md` when written; current memory of
the design is in pre-docs-repo project knowledge as
`20_empressaio_atom_architecture.md`.

### Multi-tenancy

- `tenant_id` column on every atomic table.
- Middleware in `server/middleware/tenant.ts` resolves tenant per
  request from session, header, or fallback.
- `tenant_id = 2` is Bastrop production (locked). `tenant_id = 1` is
  always demo.
- Reviewer-side surfaces use tenant scoping, not URL-path-based gating.
  Sandbox-leftover slugs (`bastrop`, `your-city`) are flagged as
  cleanup debt.

### Integrations inventory

External systems SmartCity OS reads from or writes to:

| Integration | Purpose | Auth | Health-check pattern |
|---|---|---|---|
| MyGov | Permits, work orders | username + password (scrape) | Cron-driven, `sync_health` rows |
| Samsara | Fleet telemetry | API token + webhook signature | Cron + webhook |
| Spireon | Police fleet telemetry | 3-credential set, X-Nspire-AppToken | In-memory cache, no `sync_health` |
| Verkada | Cameras, doors | API key + webhook | In-memory cache |
| GoTo Connect | Telephony | OAuth (descoped, in-memory only) | Degraded |
| FirstDue / VFD | Fire/EMS incidents | API + signed webhook | 5-min cron |
| OpenGov BNP | Budget data | API key | On-demand + 4h cache |
| ArcGIS / Esri | GIS / geocoding | OAuth2 + ESRI_API_KEY | On-demand |
| Power BI | Embedded reports | Azure AD client_credentials | On-demand embed token |
| Anthropic | Compass AI surface | API key (Secret Manager) | 15-min thread health |
| Google APIs | Calendar, OAuth login | Passport OAuth | Calendar on-demand |
| Pipedrive | CRM (sales-side) | API token | Fire-and-forget |

Health uniformity is a known gap: not all integrations write
`sync_health` rows. Universal `sync_health` adoption is a Phase 1
backlog item. Cron registration is in
`server/services/cache-refresh-cron.ts`.

### Compass AI

Anthropic-API-driven assistant surface embedded throughout the suite.
System prompt lives in `server/routes/ai-assistant.ts:1005` (marker
`// COMPASS SYSTEM PROMPT — edit here for prompt changes`). Model
routing splits by complexity: Haiku for classification / lookup, Sonnet
for complex writing and multi-step reasoning. Per-tenant context is
hydrated from atom queries before each prompt fires.

Federated knowledge base across Compass models per city is the
network-effect moat — knowledge learned in Bastrop's Compass model
improves Jarrell's, and so on, without crossing the underlying tenant
boundary on private records. See
[`06_cities_value_narrative.md`](06_cities_value_narrative.md) for the
cities-facing narrative on this city-to-city knowledge sharing, and
[`47_codex_plan_review.md`](47_codex_plan_review.md) for how Codex
surfaces the federated layer to reviewers via the conversational
primitive.

## Competitive positioning

Tyler Technologies is the dominant municipal-software incumbent.
SmartCity OS competes as the integration-and-intelligence layer that
sits *over* the operational systems Tyler dominates (and over the stack
of best-of-breed point tools cities already use). The Hauska
integration-layer approach is the differentiator.

**Customer-facing rule:** never attack Tyler directly in customer
materials. Position SmartCity OS as additive to whatever a city already
runs.

## Strategic frames worth carrying forward

**Living lineage and fabric framing.** SmartCity OS is the
city-manager surface in the broader construction-lifecycle
fabric. Reviewer findings (Codex), architect submissions (Design
Accelerator), and future inspector/owner/contractor surfaces
all populate the same atom graph that SmartCity OS dashboards
reason over. Strategic foundation:
[`05_living_lineage_thesis.md`](05_living_lineage_thesis.md).
Cities-facing narrative for that framing:
[`06_cities_value_narrative.md`](06_cities_value_narrative.md).
Plan review surface for cities (1b standalone) and contractor
firms (1a invited):
[`47_codex_plan_review.md`](47_codex_plan_review.md).

- **Atom-graph-first.** Every feature must extend the atom graph or
  get reworked. Routing around the graph creates architectural debt.
- **Parcel Intelligence is a prerequisite to AI Plan Review.** Do not
  re-litigate.
- **Federated knowledge base across Compass models** is the network
  effect; the more cities use the suite, the better each city's AI
  surface gets — without crossing tenant boundaries on records.
- **Integration-layer positioning.** Don't compete head-on with Tyler;
  sit over Tyler + best-of-breed tools and unify.
- **City-to-city communication architecture (M9)** triggers when
  Jarrell goes live; design now or pay later.

**Bastrop property intelligence enhancement** — city-manager view
of property intelligence using a slice of the same engine and
corpus as Design Accelerator parcel briefing, scoped at
jurisdiction level. Cross-property hydrology / drainage /
flood-impact queries (Sylvia's "if we get four inches of rain,
what happens?"). Lightly outlined in pre-docs-repo project
knowledge; formal scope to be expanded after current Bastrop
housekeeping clears. Owner: Nick + planner.

## MCP surface tier model

MCP retrofit is queued post-Sprint 51 ship, sequenced after ECI atomization per [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) sequencing recommendation. MCP retrofit and city-to-city data sharing are the same work per [`28:60`](28_mcp_first_product_design.md#L60), tracked as one roadmap item.

Tier ruling per [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md): city pays existing SmartCity OS subscription; within-tenant scope includes all city-internal atoms plus the city's own Layer 2 atoms generated by their own use (adjudication records, per-reviewer-pattern). Cross-tenant exposes aggregated / anonymized patterns only per [§Compass AI](#compass-ai) and ADR-007 access scopes; raw cross-tenant records do not traverse. Cross-tenant buyer at v1 is the querying city; external agent operators deferred to expansion. Cross-city queries surface in the UI as advanced Layer 2 opt-in with per-query overage billing; revenue share routes to source cities per principle 3 of 29.

## Current state

**Active sprint (2026-05-11):** [SmartCity OS Stabilization Sprint](30a_smartcity_stabilization_sprint.md) — multi-week effort closing the Replit-managed Neon dependency, clearing security debt, landing multi-tenancy contract (ADR-005), and completing W1 sprint backlog. Codex 1b receiving surface is stubbed at [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md) with full spec deferred to post-stabilization coordination. See `30a` for done criteria, workstreams, and status board.

For current state — Cloud Run revision, traffic split, Neon endpoint,
schema management, active fires, recent recon findings — see the
SmartCity OS section of [`10_ground_truth.md`](10_ground_truth.md). That
doc is updated frequently as state changes; this product home stays
durable.

## Cross-references

- Portfolio ground truth: [`10_ground_truth.md`](10_ground_truth.md)
- [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md) — active stabilization sprint
- [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md) — Codex 1b receiving surface (stub)
- Agent operating rules: [`20_agent_operating_rules.md`](20_agent_operating_rules.md)
- Workstation paths: [`22_workstation_inventory.md`](22_workstation_inventory.md)
- Design Accelerator (sister product, separate repo, different schema):
  [`40_design_accelerator.md`](40_design_accelerator.md)
- Sub-product depth: `31_*` through `35_*` when those land
- Atom architecture ADR: `80_adrs/adr_001_atom_architecture.md` when
  that lands
- Strategic foundation:
  [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md)
- Cities value narrative:
  [`06_cities_value_narrative.md`](06_cities_value_narrative.md)
- Reviewer-side surface (shares engine):
  [`47_codex_plan_review.md`](47_codex_plan_review.md)
- Cross-stakeholder atom access:
  [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md)
- Engine factor-out:
  [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md)
