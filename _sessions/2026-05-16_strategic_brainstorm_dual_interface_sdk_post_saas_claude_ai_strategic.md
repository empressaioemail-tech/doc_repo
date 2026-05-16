---
id: 2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas
title: Strategic brainstorm — dual-interface product-line principle, SDK payment substrate, post-SaaS operating thesis
status: archived-session
date: 2026-05-16
agent: claude_ai_strategic
repo: doc_repo
session_type: strategic_brainstorm
last_updated: 2026-05-16
applies_to: portfolio
related: [09_post_saas_substrate_thesis, 28_mcp_first_product_design, 14_pricing_framework, 07_product_line_summary, 50_hauska_mcp_server, 60_eci_atomization]
owner: nick
---

# Strategic brainstorm — dual-interface, SDK payment substrate, post-SaaS thesis

Brainstorming session run after the 2026-05-16 Q4/Q5/Q6 session close commit landed. Three strategic threads explored, with operator decisions on direction and explicit deferral on implementation timing.

## Thread 1: dual-interface as product-line principle

Existing structural commitment 4 says "dual interface from day one" at the atom level. The brainstorm extended this to a product-line principle: MCP-first product design for all Empressa surfaces, with concession that existing UI-first products (SmartCity OS, Codex 1a/1b, Design Accelerator) get MCP retrofitted rather than rebuilt.

Walked through each product line:
- SmartCity OS MCP retrofit unlocks city-to-city data sharing as its user-visible feature
- Codex 1a MCP becomes the highest-leverage commercial MCP (architects pay per submission, per-call metering is natural)
- Codex 1b MCP enables AHJ batch operations and cross-jurisdictional compliance tracking
- Codex code intelligence MCP is the cleanest example because MCP IS the primary surface
- Design Accelerator MCP retrofitted at or after launch
- Revit Connector dual interface is different shape (already partly agent-facing via APS Design Automation API)
- ECI atomization (Q1 from prior session) is the dogfooding pattern
- Hauska SDK could itself get a human-facing dashboard
- doc_repo MCP remains parked (was discussed earlier)

The structural insight: SmartCity OS MCP retrofit and city-to-city data sharing are the same work. MCP retrofit is the implementation; city-to-city is the user-visible feature. Should not be tracked as two competing roadmap items.

Sequencing recommendation: ECI atomization first (dogfooding, internal-only, smallest scope, highest leverage), SmartCity OS MCP retrofit second (commercial feature unlock), Codex 1a MCP third (highest-leverage commercial play).

Captured as canonical doc 28_mcp_first_product_design.md with full back-into pattern and product-by-product status.

## Thread 2: SDK payment substrate

Original SDK scope included IP licensing sales. Brainstorm extended this to the SDK as the payment substrate for the catalog, repositioning Hauska from "Plaid for jurisdiction data" to "Plaid plus Stripe for jurisdiction data plus payment substrate."

Several pricing models explored:
- Per-atom-access (small fee per MCP call, routed to source actor)
- Stream subscription (recurring fee, revenue-shared with sources)
- Composition royalty (percentage of derivative product revenue)
- Reasoning-call pricing (most aligned with "sell reasoning not data" commitment)
- Marketplace dynamic pricing (most flexible, most operationally complex)

Most likely: composition of several. Layer 1 free. Layer 2 paid via per-call or stream subscription. High-value derivative products via composition royalty. Reasoning-call as unifying frame.

Bastrop example unpacks: city's atoms carry accessPolicy with revenue terms. Agent consumption generates micropayments routed to Bastrop. City becomes revenue center, not just expense center. Sales motion changes from "pay us for software" to "pay us for software that generates revenue from your data."

Operator decisions:
- Hauska Inc. is already a separate C-corp (entity separation done)
- Direction commitment: yes, SDK as payment substrate
- Implementation: deferred (long way to go, doesn't need to derail current work)
- Settlement model: hybrid fiat plus stablecoin processor
- Take rate: lower than current SaaS landscape (specific number TBD); software pricing will deflate

Implications:
- Partnership-first sourcing becomes substrate-enforced rather than contract-enforced (stronger position)
- Cost-per-jurisdiction math gets more complex (revenue offsets cost)
- Catalog thesis extends from data catalog to data catalog plus payment substrate
- 14_pricing_framework.md needs a section on the payment substrate model

Phased implementation (decided as principle, not yet scheduled):
- Phase 1 (Sprint 51 timeframe): atom contract supports licensing and revenue-share metadata; accessPolicy carries source actor
- Phase 2 (post-51, alongside ECI atomization and SmartCity OS MCP retrofit): metering at SDK and MCP server tools layer; accounting infrastructure exists; no money moves yet
- Phase 3 (after Bastrop revenue share is operationally tested): settlement infrastructure; Hauska Inc. operating with regulatory posture
- Phase 4 (longer term): marketplace dynamics, dynamic pricing, agent-to-agent atom transactions

Risks flagged:
- Regulatory burden (money transmitter licenses, KYC/AML, tax reporting, escheatment) — should be in scope for the Texas IP attorney memo
- Settlement complexity at micropayment scale (Stripe Connect, stablecoin rails, batched settlement options)
- Pricing design as engineering problem
- Adversarial agent behavior (caching, scraping, redistribution); accessPolicy enforcement at MCP layer plus signed SDK builds
- Incumbent response (Stripe, Plaid, Snowflake, AWS Data Exchange)

Section added to 14_pricing_framework.md per Stage 2B.

## Thread 3: post-SaaS operating thesis

What the company is pioneering specifically and where it leads. Nick flagged the resulting framing as investor and partnership material that needs durable preservation.

Key positions:
- SaaS isn't dying so much as being unbundled (UI, integration, customer success, per-seat pricing, annual contracts were responses to human-driven software adoption costs; agents collapse the bundle)
- Software pricing follows production cost; production cost is falling toward compute cost; gross margins compress
- Replacement model isn't simple usage-based API pricing (that's existed for 15 years); it's substrate-level commerce with reasoning chains as the unit of accounting and value routing back to actual sources of value
- Empressa pioneering combination: MCP-first product design + partnership-first sourcing with substrate-enforced revenue share + compounding intelligence via dogfooded company intelligence + lean operator plus agent fleet operating model. Each piece exists elsewhere in isolation; the combination is uncommon.

Three honest paths for Empressa:
- Optimistic: Hauska becomes the canonical payment and reasoning substrate for physical-world jurisdictional intelligence across North America. 10-50 humans, hundreds of millions in revenue, acquired or independent.
- Realistic: Leading vertical infrastructure provider for jurisdictional data in Texas and adjacent states. 50-200 cities, hundreds of firms, low tens of millions in revenue. Attractive acquisition target in 3-7 years or independent.
- Pessimistic: Foundation model providers absorb the space directly, or regulatory burden swamps the build, or commercial position can't capture enough value. Acquihire or wind-down.

The realistic path is achievable because the unusual things have already been done (anchor city live, customer-zero in-house, atom contract shipped, skills and protocols for compounding intelligence built).

Broader economic implications discussed:
- Software production cost falls toward compute cost; SaaS margins compress
- Economy fragments into smaller transaction units (micro-transactions replace megabundles)
- Verticalization matters more than horizontal capability
- Lean shop model spreads (fewer humans per dollar of revenue, wealth concentrates per company, political economy implications)
- Partnership-first sourcing with structural revenue share is implicitly a political-economy statement about how value should flow in the new economy

Captured as canonical doc 09_post_saas_substrate_thesis.md, formatted to stand alone for external readers.

## Operator decisions from this session

1. Dual-interface as product-line principle: committed as direction. Implementation phased starting with ECI atomization post-51 ship.
2. SDK payment substrate: principle committed; implementation deferred and phased. Hybrid fiat/stablecoin processor model; lower take rate than current SaaS landscape.
3. Post-SaaS thesis: captured as canonical doc for external use (investors, partnerships, hiring, case studies).
4. Codex naming override (decision-logged 2026-05-16 alignment session followup): Codex is the product brand covering plan review (1a contractor-side + 1b city-side) AND code intelligence (the code-lookup surface on the Hauska MCP Server, free at Layer 1). The catalog-roadmap-default "skip sub-brand, describe functionally" was overridden in favor of consolidating the Codex brand across all code-related surfaces. Captured in [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) §Product-by-product status §Codex. Propagation to [`47_codex_plan_review.md`](../47_codex_plan_review.md), [`48_codex_program_plan.md`](../48_codex_program_plan.md), [`07_product_line_summary.md`](../07_product_line_summary.md), and [`11_roadmap.md`](../11_roadmap.md) "Open architectural questions" closeout landed in the alignment session followup commit.

## Open questions surfaced this session

1. Specific take rate for Hauska Inc. payment substrate (lower than landscape, but how much lower)
2. Specific pricing model composition for atom transactions (per-call vs stream vs composition vs reasoning vs marketplace blend)
3. Tier model for product MCP surfaces (different per product; how each maps to 08 tier model)
4. Customer pull validation mechanism for which product MCPs to build first
5. Dev rel capacity question (in-line per product or formalize after N MCPs)

## Carry forward for the next planner

These threads compound with the existing carry-overs from earlier in this session (merged Project instructions drafting, Codex naming followup, bizops files question, ADR-013 scaffolding). The post-SaaS thesis doc plus the MCP-first product design doc plus the SDK payment substrate principle become reference material for any future strategic conversation. The handoff prompt for the next planner already references this commit; next planner should fetch the two new docs as part of orientation when relevant.

## References

- Prior session commit (Q4/Q5/Q6/master roadmap): see _sessions/2026-05-16_q4_q5_q6_master_roadmap_resolution_claude_ai_strategic.md
- Prior session commit (2026-05-15 catalog roadmap dialogue): see _sessions/2026-05-15_catalog_roadmap_*
- New canonical doc this session: 09_post_saas_substrate_thesis.md
- New canonical doc this session: 28_mcp_first_product_design.md
- Modified canonical doc this session: 14_pricing_framework.md (new section)
