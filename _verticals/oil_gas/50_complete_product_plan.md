---
id: 50_complete_product_plan
title: Oil and gas platform - complete end-to-end build, holistic view
status: exploration
last_updated: 2026-06-14
applies_to: [hauska, empressa]
owner: nick
related: [00_oil_gas_index, 20_tech_to_og_map, 60_data_package_and_providers, 70_market_thesis, 53a_noncustodial_settlement_rail, 55_spine_data_intelligence_stack, _prospects/mox/2026-06-11_mox_master_dossier]
---

# The complete oil and gas platform, end to end

> **Holistic view, deliberately not phased.** This describes the whole product as a single system so we can see it entire and divide and conquer later. There is no MVP carve-out here and no sequencing or timeline by design. The wedge and rollout decisions live elsewhere; this is the map of everything the platform is when complete. Exploration status: not a commitment, a vision to refine against Chris's design.
>
> Each domain notes whether its substrate already exists, to inform later division of work, not to imply an order. "Reuse" means the substrate is built or in flight for another surface (the spine, Mox, the SDK). "Build" means net-new for this platform.

## Organizing model: the revenue-producing well twin

The platform is one product, a revenue-producing asset turned into a verified digital twin. The asset is the well or pad. The twin is the inverted kind: the asset owns its data and the geometry is one optional lens, per Living Lineage ([`05`](../../05_living_lineage_thesis.md)) and the Inverted Pyramid. It stands on four layers and is read through three lenses.

The four layers, which are the cross-domain offering shared with Mox and SmartCity:

1. Spine, the shared ground truth. RRC, regulatory, offset wells, geology, title. Public and calibrated.
2. The well twin, tenant-private. The asset's living atom graph, geometry as a lens, never pooled.
3. Connect operational systems. Ride on top of SCADA, the historian, Quorum, Enverus; capture their exhaust as atoms; no rip and replace.
4. Monetize. Once verified, the twin is transactable: the investor room, the deal package, the marketplace, non-custodial settlement.

The three lenses, all on the same twin:

- Operations and surveillance (Permian Field Health, [`40`](40_chris_app_overlay.md)): is it producing, is it healthy, what intervention is warranted, and with what certainty.
- Land and obligations: the leases and payments that protect the revenue.
- Capital: who owns the revenue stream, and can it be financed or sold.

The well produces revenue directly, so the operations lens is a revenue lens; downtime exposure in BOE is dollars at risk. Revenue is the through-line that fuses the three lenses, which is why this is one product and not three. Mox proves the twin on a building, where revenue is rent. SmartCity proves the connect-and-unify pattern on a city, live in production. O&G is the same product where the asset produces revenue. The ten capability domains below are the detailed build map under this model.

## The shape in one paragraph

A small or mid oil and gas operator or dealmaker brings their book of business onto one platform. The platform manages their agreements, tracks every obligation so no lease is lost, holds and reasons over their documents with provenance, stands up secure revocable data rooms for diligence, and connects deals to capital with verified, non-custodial settlement. Underneath, the Hauska spine supplies jurisdictional and property intelligence with citation and confidence on every fact. Their own agents can query the whole thing through an MCP surface. The aggregate of many operators' verified books, over time, is a market.

## Domain 1: the spine (substrate)

The jurisdictional and property intelligence layer. Fully mapped in [`20_tech_to_og_map.md`](20_tech_to_og_map.md); summarized here as the foundation every other domain reads from.

| Capability | Reuse or build |
|---|---|
| Reasoning and finding engine with citation, confidence, provenance, timestamp | Reuse (LIVE) |
| Jurisdictional corpus and atom retrieval | Reuse (LIVE), extend with oil and gas county and state corpora |
| Precedence and conflict resolution primitive | Reuse (planned in spine roadmap) |
| Oil and gas data adapters (mineral, lease, well, title, regulatory) | Build (the marginal oil and gas work; see [`60`](60_data_package_and_providers.md)) |

## Domain 2: identity, tenancy, and access

The foundation that makes everything else multi-tenant and trustworthy. This is the Mox tenant leg, reused.

| Capability | Reuse or build |
|---|---|
| Authentication, organization membership, JWT session | Reuse (Mox demo, auth build) |
| Tenant-private isolation, a tenant's book never pools (accessPolicy, ADR-005) | Reuse (in flight, tenant leg) |
| Scoped cross-stakeholder access, owner plus brokers, counsel, counterparties as scoped readers and writers (ADR-007) | Reuse (designed) |
| Role-based access enforced at the data layer, not the screen | Reuse (Mox) |
| Onboarding for a new operator organization | Build (thin, on the reused auth) |

## Domain 3: deal and land management (the book)

Where the operator's deals live. This is the land-administration capability and the data-acquisition heart of the platform.

| Capability | Reuse or build |
|---|---|
| Agreements registry: right-of-way, surface and mineral leases, easements, pipeline corridors | Build on atom spine |
| Parties and property: grantor and grantee, entity, acreage, legal description, tract | Reuse atom families (party, tract), build registry surface |
| Obligation engine: delay rentals, bonus, annual rentals, taxes, insurance, shut-in and minimum royalty, with deadline reasoning, status derivation, recurrence, and payment recording | Build (reasoning reuses the engine) |
| Field activity log: site visits, inspections, surveys, meetings, calls, linked to agreements | Build |
| Field tier system: locked, audited, and free-edit fields with an audit trail on change | Build (audit trail reuses provenance and event log) |

## Domain 4: documents and workspace

Ingestion, authoring, and the provenance link between a record and its source documents.

| Capability | Reuse or build |
|---|---|
| Document ingestion: born-digital and scanned PDF peel, vision OCR, text extraction | Reuse (LIVE spine) |
| Auto-matching documents to agreement records by identifier and pattern | Build |
| System-of-record document repair: the broken record-to-document link that the land vision centers on | Build (integration, Domain 8) |
| Authoring workspace: rich-text editor, templates, version history, export with letterhead | Build |
| Provenance on every extracted fact: source document or field marker | Reuse (LIVE invariant) |

## Domain 5: data rooms

Secure, revocable, role-scoped diligence rooms. The single largest direct reuse from Mox.

| Capability | Reuse or build |
|---|---|
| Room creation, manifest of included agreements and documents | Reuse and extend (Mox data room) |
| Granular access: full, view-only, view-only-no-download, per party | Reuse (ADR-007 scoping) |
| Auto-expiring access tokens, revocation, NDA gate, watermarking | Build on the reused substrate |
| Content-addressed signed manifests, self-rendering `.atom` and `.atompack` containers, integrity hashing | Reuse (ADR-010/011/012) |
| Activity monitoring: who viewed what and when | Build |
| The deal package as the underwriting artifact, a signed verifiable container an investor can independently check | Build (novel framing on reused containers) |

## Domain 6: the intelligence surface

The AI layer the user actually talks to. The structured, provenance-backed output is the spine commitment rendered as product.

| Capability | Reuse or build |
|---|---|
| Conversational interface returning structured components, not prose | Build surface, reuse engine |
| Interactive component library (risk matrices, deadline rails, detail cards, timelines, calendars, comparison panels, the full set) | Build (Chris's frontend; we supply the structured payloads) |
| Provenance markers in output: document, field, inference, tappable entity references | Reuse (LIVE provenance) |
| Confirmation enforcement: a confirmation artifact required before any real-world action | Build (trust-layer contract on the engine) |
| Morning briefings: prioritized judgment on the most urgent item, overdue obligations first | Build on the engine |
| Title run-sheet reasoning: chain of title with confidence and explicit gaps, not an asserted clean answer | Build (reasoning over title and county data) |
| Deal scoring: graded assessment with confidence and comparison, reasoning shown | Build on the engine |
| Surveillance-to-intervention reasoning: anomaly to root cause to recommended intervention, each with evidence, bounded confidence, and source (the operations lens, [`40`](40_chris_app_overlay.md)) | Build (reasoning reuse, anomaly scoring net-new) |
| Generated listing and marketing copy from structured deal data | Build (light) |

## Domain 7: capital and marketplace

Connecting deals to capital, and the eventual market. The settlement rail must be non-custodial per [`53a`](53a_noncustodial_settlement_rail.md).

| Capability | Reuse or build |
|---|---|
| Capital formation: present a verified deal package to capital, raise against a secured lease | Build |
| Listings and discovery: assets searchable by basin, type, acreage; the listing venue | Build |
| Deal packaging: bundle producing and non-producing assets, working-interest and override structures | Build |
| Offers and negotiation tracking | Build |
| Non-custodial settlement verification: capital moves party-to-party, bank-to-bank or wallet-to-wallet, Hauska verifies and never custodies | Build (see [`53a`](53a_noncustodial_settlement_rail.md); reuses the verification primitive) |
| Technology fee billed separately from the deal amount | Reuse (Context 1 billing) |
| Reputation and track record: a dealmaker's verified outcome history becomes their credential to raise faster | Build (reuses calibration and outcome capture) |
| Deal-structure support: acreage exchanges, joint operating agreements, working-interest partnerships, override trading | Build |

## Domain 8: data package and integrations

The external data that makes the platform complete, and the connections to the systems operators already run. Detailed in [`60`](60_data_package_and_providers.md).

| Capability | Reuse or build |
|---|---|
| Title and ownership, leases, production, pricing, geology, regulatory and permits, valuation, produced water | Build adapters; sources in [`60`](60_data_package_and_providers.md) |
| System-of-record integration: the operator's land system (Quorum Land Suite and equivalents) | Build (read and sync) |
| Document-store integration (SharePoint and equivalents) | Build (ingestion connector) |
| Provider-agnostic data layer: no single third-party data dependency is load-bearing | Build (design principle, stay vendor-agnostic per operator direction) |

## Domain 9: agent and MCP surface

The platform as a substrate the operator's own agents can consume. MCP-first per commitment 4.

| Capability | Reuse or build |
|---|---|
| Oil and gas product key gating the tool surface | Reuse (MCP gate) |
| Tools: query a lease, check obligations, pull a run sheet, verify a title chain, score a deal, open a room | Build (tool definitions over the engines) |
| Metering and tiered billing for paid tools | Reuse (SDK metering, Context 1) |

## Domain 10: delivery surfaces

How the platform reaches users.

| Capability | Reuse or build |
|---|---|
| Product frontend (Chris's design system and app) | Chris (partner-built) |
| Product API or thin BFF in front of the MCP and engine surface | Build (the integration contract with Chris) |
| White-label and multi-tenant theming | Build (light) |
| Mobile and notifications | Build (later surface) |

## The seam with Chris

Chris owns Domains 6's component rendering and Domain 10's frontend. We own Domains 1 through 9 behind the API. The integration contract in Domain 10 is the negotiable boundary: whether his frontend calls our MCP surface directly or a thin product API in front of it. That decision is in [`40_chris_app_overlay.md`](40_chris_app_overlay.md), to settle against his actual design.

## What is genuinely net-new versus reused

Reading down the reuse columns: the spine, identity and tenancy, document ingestion, data rooms, the reasoning and provenance engine, the MCP gate and metering, and the verification primitive are all reuse, built or in flight for the spine and Mox. The net-new is concentrated in oil and gas data adapters, the deal and land management surfaces and obligation engine, the capital and marketplace domain, the non-custodial settlement rebuild, and the system-of-record integrations. That concentration is the argument that this is a vertical expression of the substrate, not a second company: the foundation is shared, the marginal build is the oil and gas specifics.
