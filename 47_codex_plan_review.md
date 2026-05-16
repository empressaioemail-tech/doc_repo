---
id: 47_codex_plan_review
title: Codex — plan review intelligence + code intelligence
status: active
last_updated: 2026-05-16
applies_to: codex
related: [05_living_lineage_thesis, 06_cities_value_narrative, 07_product_line_summary, 08_tiered_access_model, 28_mcp_first_product_design, 30_smartcity_os, 40_design_accelerator, 41_revit_connector, 50_hauska_mcp_server, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out]
supersedes: pre-docs-repo `47_plan_review_amplifier_features.md` and pre-docs-repo `47b_plan_review_amplifier_addendum.md`
owner: nick
---

# Codex

> Plan review intelligence layer plus code intelligence surface. As plan review: operates as a reviewer's amplifier when invited into a host markup tool (Bluebeam, Acrobat, ProjectDox), or as a standalone web review surface when no host tool is in use. As code intelligence: human-facing code-lookup surface plus agent-facing tools on the Hauska MCP Server over `code-section` atoms (free at Layer 1 per [`08_tiered_access_model.md`](08_tiered_access_model.md)). Same engine, three surfaces.
>
> **2026-05-16 scope expansion.** The Codex brand was consolidated to cover plan review (1a + 1b) AND code intelligence (the code-lookup surface) per the 2026-05-16 strategic brainstorm session. See "Three deployment surfaces" below and [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) for the product-line context.

This doc is the product home: identity, surface, architecture, deployment modes, feature roadmap, customer-zero context. For *current* implementation state see [`10_ground_truth.md`](10_ground_truth.md). For the engine the product runs on, see [`adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md). For the strategic frame this product delivers on, see [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md).

## What it is

Codex is the reviewer's interface to the property's institutional memory. A plan reviewer — whether employed by a city or by a contractor firm reviewing on a city's behalf — gets a one-click compliance pass against the actual code corpus for the jurisdiction, complete with parcel context, neighboring context, and firm precedent. Findings appear as native markups in the reviewer's host tool, or as native annotations in the standalone surface. Adjudication uses the reviewer's normal workflow.

The web companion handles deeper interactions: a conversational assistant grounded in corpus + jurisdiction + property history; adaptive UI that flexes from junior trainee to senior plans engineer; voice annotation; throughput dashboards; comment-letter auto-draft; cryptographically-anchored audit trails per ADR-001.

Every finding is an atom scoped to a property. Every finding feeds the property's lineage; the property's lineage feeds back into future review context.

## Why it exists

Two commercial drivers and one strategic driver.

**Commercial driver 1 — outsourcing trend.** A growing share of city plan review is performed by contractor firms (SAFEbuilt, Bureau Veritas, ICC Community Development Solutions, etc.) on behalf of cities that cannot recruit or retain in-house reviewers. These firms have invested in tooling (Bluebeam Revu dominates), training, and workflow integrations. Replacement products fail to penetrate this segment because they ask firms to abandon those investments. Codex amplifies what firms already do rather than replacing it.

**Commercial driver 2 — sales cycle.** Municipal sales cycles run 6-18 months (RFP, council approval, procurement). Firm sales cycles run 1-3 months (decision-maker is the firm owner / ops director). Codex sold to firms is a faster revenue path than SmartCity OS sold to cities, and a soft endorsement channel for SmartCity OS sold downstream.

**Strategic driver — fabric expression.** The reviewer is the highest-network-density stakeholder in the construction lifecycle. Architect submits → reviewer reads → reviewer creates findings → those flow to architect (response), city manager (workflow state), inspector (compliance gates), and the property's lineage. Every reviewer interaction is multi-stakeholder. An amazing reviewer experience pulls demand through the entire fabric.

## Three deployment surfaces

Codex ships as one product with three deployment surfaces. Same engine, same corpus, same atoms. Surface differs based on user and use case. Surfaces 1a and 1b are plan-review-shaped; surface 2 is code-intelligence-shaped (free Layer 1, code-lookup only).

### 1a — Invited participant (commercial wedge)

For reviewers in a host markup tool. Codex authenticates as a regular user of the host tool, gets *invited* to review surfaces (Bluebeam Studio Projects, Adobe Acrobat Shared Reviews, ProjectDox workflow steps, EnerGov plan review, Foxit PhantomPDF, Newforma) as a normal participant. Joins the project, downloads the PDF, runs the engine, writes findings back as native markups under an "AI Reviewer" participant identity.

The reviewer sees findings appear in their existing tool's Markups List exactly like a colleague's contributions. They adjudicate via their normal workflow. They toggle to a web companion (separate browser tab) for AI-only controls (adaptive UI, conversational primitive, firm precedent queries, comment letter draft, throughput dashboard).

This sidesteps partner-integration approval gates. Codex joins as any other user would, with appropriate ToS verification per host tool. Per-firm tenant subscription to the host tool is required (Bluebeam Core/Complete/Max, ~$260-440/year).

### 1b — Standalone web app (city-direct, Bastrop pattern)

For reviewers who don't use a host markup tool, prefer the native experience, or are reviewing for cities that use SmartCity OS Plan Review as the primary surface (Bastrop, Jarrell, future M9 cities). Direct PDF upload, full review in the web app, native UI for everything.

The reviewer logs into SmartCity OS Plan Review, opens an assigned submittal, hits "run review." Engine pass renders findings as native annotations on the PDF in the in-browser viewer (PDF.js + custom annotation layer). Adjudication via native UI. All Codex features render natively rather than through a host-tool roundtrip.

### 2 — Code intelligence (consumer-facing, free Layer 1)

For architects, contractors, code reviewers, and AI agents who need direct query access to atomized municipal code without a plan-review workflow. Two channels:

- **Human web surface.** Code-lookup web tool at the Codex code intelligence URL. Free at Layer 1. Search across loaded jurisdictions; retrieve individual `code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus` atoms with full provenance.
- **Agent surface.** Tools on the Hauska MCP Server (`search_atoms`, `get_atom`, `list_jurisdictions`) over the same atoms. Discovery via Anthropic's MCP directory and `awesome-mcp-servers` listings. Free at Layer 1 with attribution requirement; paid tiers per [`50_hauska_mcp_server.md`](50_hauska_mcp_server.md) commercial model.

The code intelligence surface is the cleanest example of MCP-first product design per [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md): MCP IS the primary surface; the web tool is the human wrapper.

Codex code intelligence shares the corpus with Codex 1a / 1b plan review but does **not** expose Layer 2 paid atoms (`adjudication-record`, `per-reviewer-pattern`, `comparable-project-precedent`). Layer 2 stays inside the plan-review surfaces. The brand consolidates around code-related surfaces; the tier model preserves the moat.

Per the 2026-05-16 operator decision, this third surface lives under the Codex brand alongside the two plan-review surfaces.

### Why three surfaces

City-direct ICP doesn't use Bluebeam. Contractor-firm ICP lives in Bluebeam and won't leave it. Some reviewers will use both modes depending on which city they're working for that day. The hybrid plan-review architecture covers the full plan-review ICP without forcing customers to choose. The code-intelligence surface covers a third, distinct audience (architects/contractors/agents who need code lookup without a plan-review workflow) and provides the free Layer 1 distribution channel that drives Hauska substrate adoption per [`09_post_saas_substrate_thesis.md`](09_post_saas_substrate_thesis.md).

## The four-layer stack

Codex is four layers, each load-bearing.

### Engine

Compliance pass against jurisdiction code, parcel context, neighboring context. Same code as Design Accelerator's incremental pass, run in full-pass mode (30-120s vs <5s). Generates findings with code-section citations, severity, plan location.

The engine is the same code that powers the architect-side view (Design Accelerator's `plan-review` artifact mirrors what the reviewer will see) and is being factored into its own repo per [ADR-008](80_adrs/adr_008_engine_factor_out.md).

### Corpus

Jurisdiction-keyed code atoms (479 across four sources today, growing per jurisdiction onboarded), local amendments, parcel intelligence, firm precedent (the firm's historical findings as a reference layer for new reviews), per-reviewer learning. The corpus compounds with usage; this is where the moat lives.

The most defensible component is firm precedent because it is *firm-specific* learning that does not transfer to a competitor even if they build a comparable code corpus.

### Adaptability

Role-aware UI that flexes from trainee verbosity 5 + locked rejection reasons up to senior plans engineer verbosity 1 + keyboard shortcuts. Plus session controls (verbosity, confidence threshold, guidance density). Plus the conversational primitive for open-ended exploration grounded in corpus + jurisdiction + property history.

Conversational primitive supports queries like:

- "Explain this code section like I'm new"
- "Did the architect address my prior egress comment?"
- "How would Sara have handled this?" (firm-specific precedent)
- "How would Bastrop or Jarrell handle this?" (city-to-city precedent — federated learning across municipalities)

### Lineage

Every finding, adjudication, and decision is anchored to the property's permanent record via the Hauska SDK's cryptographic event chain. Audit trail is not a feature; it is the substrate. When a project is sued or audited five years post-occupancy, the firm produces the audit package in minutes from the property's chain.

Defensibility — the lineage is the differentiator competitors cannot match without rebuilding the substrate.

## Atom set

Codex consumes and produces atoms scoped to the property (per [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md)). Specific atoms relevant to plan review:

**Inherited from Design Accelerator's atom registry:** submission, finding, decision-event, communication-event, reviewer-annotation, reviewer-request, viewpoint-render, submission-classification.

**New for Codex (to be added to registry):** firm-tenant, firm-precedent (cross-engagement learning aggregation), per-reviewer-learning, audit-trail-anchor, code-change-broadcast-event, version-drift-snapshot-diff, jurisdictional-precedent (city-to-city learning aggregation).

The atom registry update is part of the next codebase pass; the shape is captured here for planning purposes.

## Customer pathways

### Cities (1b path)

- **Bastrop** — existing SmartCity OS production customer. Codex 1b ships into the existing SmartCity OS Plan Review surface. Sylvia / Jaime as customer-zero on city side. No new sales motion required; extends existing relationship.
- **Jarrell** — pipeline. Codex 1b is part of the SmartCity OS package by the time Jarrell onboards.
- **Future M9 cities** — Codex 1b ships as standard with new city-direct deployments.

### Contractor firms (1a path)

- **Pilot firm 1** — TBD. Sourced through Sylvia's TCMA/ICMA network or direct outreach to ICC events. Selection criteria from predecessor addendum (TX or UT first because Bastrop UDC and Grand County code atoms already loaded).
- **Pilot firms 2-3** — TBD. Diversity criteria: different size class, different jurisdiction set, different host tool preference (Bluebeam vs ProjectDox vs Acrobat).

### Empressa as 1a customer-zero (under consideration)

Empressa-doing-self-review is a potential 1a customer-zero — using Codex on plans Empressa designed via Design Accelerator, eating own dog food across both surfaces in one workflow. Open question: does this conflict with using Empressa as DA customer-zero, or compound the validation?

## Feature roadmap

Renumbered from the predecessor addendum's AMP-* prefix to CDX-* now that Codex is the canonical name. Wave structure reorganized to reflect the priority shifts established in this session: commercial wedge first (1a), city-side surface second (1b), moat-grade compounding third, versatility fourth, fabric play fifth.

### Wave 1 — Commercial wedge (1a invited foundation)

- **CDX-1a** — Bluebeam invited-participant adapter (highest priority host tool)
- **CDX-2** — Markup format adapters (Bluebeam Studio markups first; Acrobat FDF and ProjectDox follow)
- **CDX-3** — One-click AI review pass (engine output)
- **CDX-4** — Finding accept/edit/reject loop
- **CDX-5** — Jurisdiction switcher
- **Bluebeam ToS verification** — gate, not feature; prerequisite to ship CDX-1a

### Wave 2 — City-side surface (1b standalone, Bastrop activation)

- **CDX-1b** — Standalone web app
- **CDX-Annotation** — PDF viewer + annotation layer in browser
- **CDX-EngineHook** — Engine integration into SmartCity OS Plan Review surface
- **CDX-DashboardFlow** — Findings → SmartCity OS dashboard atom flow

### Wave 3 — Moat-grade compounding (corpus depth + lineage)

- **CDX-7** — Firm precedent layer (most defensible feature)
- **CDX-6** — Parcel intelligence pull (inherits from `46_smartcity_parcel_intelligence` migration)
- **CDX-8** — Per-reviewer learning loop
- **CDX-15** — Cryptographic audit trail (gated on Hauska SDK IPFS cluster + immutable history closing per `33_hauska_sdk_roadmap` migration)

### Wave 4 — Versatility / differentiation user-feels

- **CDX-12** — Adaptive UI tier
- **CDX-13** — Conversational primitive (most expensive, ship on stable foundation; supports firm + jurisdictional precedent queries)
- **CDX-9** — Comment-letter auto-draft
- **CDX-11** — Throughput dashboard
- **CDX-10** — Firm tenancy + role model (gated on firm tenancy ADR)
- **CDX-14** — Version drift detector

### Wave 5 — Fabric play, advanced

- **CDX-17** — Code-change broadcast (jurisdiction-wide notify on code adoption)
- **CDX-16** — Cross-jurisdictional code comparison
- **CDX-Jurisdictional** — Cross-jurisdictional precedent (city-to-city knowledge sharing — federated learning across municipalities; pairs with CDX-13 conversational primitive)
- **CDX-18** — Voice annotation
- **CDX-19** — Three-way collaborative session (Bluebeam Studio Sessions; AI participant in real-time three-party flow)

## Open decisions blocking GA

Carried forward from the predecessor addendum, refined through this session.

- **Firm tenancy schema ADR** — extends ADR-005 multitenancy (queued for migration). Firm-tenancy nests inside city-tenancy with different access scopes per ADR-007.
- **Bluebeam ToS interpretation** — legal review + commercial outreach required. Risk: Bluebeam blocks service accounts, forcing back to partner-integration path.
- **Pricing publication** — addendum default $300/seat/month for 1a. Hold private until two paid conversions close. Pilots free.
- **Comment-letter training data legal handling** — data agreement for ingesting firm historical comment letters.
- **Code licensing economics escalator** — ICC per-tenant fixed fee scaling per tenant size.
- **Conflict-of-interest controls** — firm reviewing for City A and consulting for a developer. Per-engagement metadata + contractual policy. Specifics deferred to firm-tenancy ADR.
- **Bluebeam Max competitive positioning** — vertical-depth play (jurisdiction-keyed corpus + role-aware UI + multi-surface architecture) vs. Max's horizontal AEC AI.

## Verifications outstanding

Carried forward from predecessor addendum.

- Bluebeam Studio Project participant flow (test with second account)
- Bluebeam markup writeback as participant (regular user OAuth)
- Acrobat Shared Reviews FDF roundtrip
- ProjectDox / Avolve API access path
- Bluebeam Max teardown when GA available
- Tyler Technologies plan-review AI capability scan
- Sylvia interview on skill-level pain points (drives CDX-12 trainee tier)
- Reviewer day-in-life observation at one pilot firm
- Director QBR conversation at one pilot firm
- Hauska SDK gap closure timeline (gates CDX-15)
- Multi-surface coherence test design
- Atom graph performance at firm-tenant scale

## Adjacent products (NOT Codex features)

These share Codex's data substrate but warrant separate product treatment, separate roadmaps, possibly separate brands. Listed to prevent re-litigation of scope:

- Code volatility dashboard as data product
- Continuing education content factory (ICC CEU courses)
- Code arbitration service (third-opinion-as-a-service)
- Permit-status data product for developers
- Climate-resilience overlay
- Lawsuit-pattern detection
- Insurance-grade certification stamp (closes loop with CDX-15)

## Strategic frames worth carrying forward

- **Stay reviewer-shaped.** Codex is the reviewer's interface. Feature decisions test against reviewer experience first; architect / city / inspector benefits are downstream effects.
- **Fabric framing is customer-facing.** The product is sold with the network-effects narrative explicit, not buried in architecture. See [`06_cities_value_narrative.md`](06_cities_value_narrative.md).
- **Same engine, two surfaces.** Surface decisions never diverge the engine. If 1b can do something 1a can't, it belongs in the web companion (which 1a also accesses) or it is a candidate for the engine, not for surface-specific divergence.
- **Living lineage governs.** Every feature tests against: does this enrich the property's lineage or hollow it out?
- **Don't pretend B1-B5 exists.** The taxonomy is aspirational per the predecessor addendum. v1 needs B1; the others wait.
- **PropTech ecosystem partners are downstream consumers.** The tool-agnostic invited-participant pattern generalizes beyond markup tools. PropTech network partners (futureproptechmiami.com network) are candidate fabric consumers when the engine repo and ADR-007 land. Captured here to avoid scope drift; pickup is a separate doc later.

## Cross-references

- Strategic foundation: [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md)
- Cities-facing narrative: [`06_cities_value_narrative.md`](06_cities_value_narrative.md)
- Sister architect product: [`40_design_accelerator.md`](40_design_accelerator.md)
- Sister city product: [`30_smartcity_os.md`](30_smartcity_os.md)
- Engine factor-out ADR: [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md)
- Cross-stakeholder atom access ADR: [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md)
- Atom architecture: [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md)
- Pricing framework (cross-surface extension pending): [`14_pricing_framework.md`](14_pricing_framework.md)

## Revision history

- **2026-05-10 (origin):** drafted as Codex product home doc during plan review framing session. Replaces pre-docs-repo `47_plan_review_amplifier_features.md` and `47b_plan_review_amplifier_addendum.md`. Renamed from "Plan Review Amplifier" to "Codex." Reorganized feature priorities to reflect commercial-wedge-first sequencing established in this session. Added city-to-city knowledge sharing and PropTech ecosystem partners as pinned items.
