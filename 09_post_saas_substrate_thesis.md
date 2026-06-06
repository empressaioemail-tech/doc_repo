---
id: 09_post_saas_substrate_thesis
title: Post-SaaS substrate thesis
status: active
last_updated: 2026-05-27
applies_to: portfolio
related: [05_living_lineage_thesis, 06_cities_value_narrative, 07_product_line_summary, 08_tiered_access_model, 14_pricing_framework, 28_mcp_first_product_design, 77_place_graph_strategy]
owner: nick
---

# Post-SaaS substrate thesis

The strategic frame for Empressa and Hauska as a company. Articulates what kind of business is being built, what makes it durable, and where it leads. Intended for external use with investors, partners, hires, and strategic counterparties as a standalone explanation of the operating thesis.

## The SaaS bundle is being unbundled

The SaaS model worked for two decades because it solved real problems for humans adopting software. UI plus integration plus customer success plus per-seat pricing plus annual contracts were a coherent bundle that reduced the cost of human-driven software adoption. Each piece existed because humans needed help getting value from software.

Agents collapse the bundle. UI becomes optional; agents don't need it. Integration becomes self-service via protocols like MCP. Customer success is absorbed by the agent reading the documentation. Per-seat pricing makes no sense for a buyer with no seats. Annual contracts become awkward when usage is volatile.

What replaces the bundle is still being figured out across the industry. The naive answer is "usage-based pricing with API access" but that has existed for fifteen years and isn't quite right either. The fuller answer is substrate-level commerce where value flows back to the actual sources of value, mediated by a thin protocol layer, with reasoning chains as the unit of accounting rather than human seats or even raw API calls.

The deeper economic shift underneath this is that software pricing follows the cost structure of producing software. Software used to be expensive because skilled humans made it slowly. Now it is much cheaper because skilled humans plus agents make it fast. Prices compress toward production cost. The 70-80 percent gross margins SaaS companies got used to are going to be hard to defend over time.

## What Empressa is pioneering

The combination of four operating principles is uncommon. Each principle exists in isolation at other companies; the integration is the difference.

**MCP-first product design.** Every Empressa product surface is designed for agent consumption first, with human UI as the second surface wrapped around the same engine. For products with UI heritage (SmartCity OS, Codex plan review, Design Accelerator) the MCP surface is retrofitted as a tracked roadmap item. Net-new products ship MCP-first from day one. The detailed product line architecture lives in 28_mcp_first_product_design.md.

**Partnership-first sourcing with substrate-enforced revenue share.** Cities, counties, firms, and other data sources are treated as licensors with revenue share, not as extraction targets. The design intent is that the Hauska SDK as payment substrate makes revenue share mechanically enforced rather than contractually promised. That is the designed model, not yet the running state: the SDK crypto settlement rail is built, but the revenue-routing layer that splits and pays a source actor's share is not yet implemented, so revenue share today is contractually promised and substrate-enforced settlement is the committed direction. Sources are aligned commercially because the substrate is built to ensure they capture value when their data drives agent consumption. The pricing framework lives in 14_pricing_framework.md.

**Scope clarifier (2026-05-23 per `_decisions/2026-05-23_partnership_first_scoping.md`).** Partnership-first sourcing governs city operational data plus the Hauska substrate ingest pipeline: Bastrop UDC, code corpus, permit history, plan review precedent, SmartCity OS data, the @hauska/atom-contract catalog atoms produced by the substrate. It does not govern Cortex product-baseline data sourcing for architect-facing layers, where national public-records aggregators (Regrid for parcels and zoning) and federal national APIs (FEMA, USGS, USDA, USFWS, FCC) are out of scope. The Hauska refusal target is operational-data aggregation that locks cities out of revenue share, not public-records aggregation. Cortex consumes from any source with provenance per atom; the substrate continues to grow partnership-first.

**Compounding intelligence via dogfooded company intelligence.** Empressa Company Intelligence (ECI) atomizes against the same Hauska atom contract that external customers use. Every decision, sprint, conversation, and procedure-execution becomes structured organizational memory. Strategic decisions stop starting from zero. The platform improves itself by being used internally. The implementation plan lives in 60_eci_atomization.md.

**Lean operator plus agent fleet.** A single human operator plus a Grok-first agent fleet (doc_repo planner and named cc-agents C/C2/E/R/M/AC on Cursor, default Grok Build 0.1 per HR-12; Replit Agent for scoped prototyping; Claude on explicit escalation only) can build and operate what would have required dozens of engineers in the SaaS era. The operating model documentation lives in [`20_agent_operating_rules.md`](20_agent_operating_rules.md) (HR-12), [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md), and [`01a_atom_conventions.md`](01a_atom_conventions.md) (atom-first context).

Each principle compounds with the others. MCP-first products produce execution atoms via the SDK. Execution atoms feed ECI. ECI improves strategic judgment. Better strategic judgment guides more MCP-first product investment. Partnership-first sourcing brings more cities and firms into the substrate, which produces more consumption, which generates more revenue routed back to sources, which deepens the partnerships. The loop closes.

## The substrate is the durable layer

Most software companies' moats erode when production costs fall. Companies that depended on "we built software that solves X" find their software replicable by an agent in a weekend. Companies that depended on "we have integration with Y" find that MCP and similar protocols commoditize integration.

The durable categories in the post-SaaS economy are different. They are: unique data, network effects, regulatory positions, and protocol substrates that other businesses build on.

Hauska's position is intentionally in the substrate category. The catalog contains jurisdictional data that is genuinely hard to replicate because acquiring it requires partnership relationships that take years to build. The reasoning layer over that data has fewer training-data parallels than general reasoning because physical-world jurisdictional adjudication is a long-tail domain not well-represented in foundation model training. The payment substrate has switching costs because cities and firms sign revenue share contracts that align them with the platform's success.

Plaid is the closest analog for what Hauska is becoming on the data side. Stripe is the closest analog for what the SDK is becoming on the payment side. The combination of both layers, in a specific vertical (physical-world jurisdictional intelligence), is the differentiated position.

**Place graph (2026-05-27).** The substrate is not a flat catalog of jurisdictions. It is a **place graph**: one resolvable location (parcel, legal description, jurisdiction context) as the node; normative law, physical constraints, recorded private instruments, operational precedent, and (over time) mineral and airspace estates as typed, provenanced edges. Agent queries are metered reasoning walks on that graph, not document dumps. Product GTM lanes (Property Brief, TX CRG CRM, Cortex, future O&G land admin) are views on the same node. Full strategy: [`77_place_graph_strategy.md`](77_place_graph_strategy.md).

## Partnership-first as political-economy statement

There is a second dimension to partnership-first sourcing worth being explicit about. It is not only a commercial decision. It is implicitly a statement about how value should flow in the agent-mediated economy.

The companies that scale fastest in agent economies will be tempted to extract maximum rent from data sources, treating them as commodity inputs to be acquired cheaply and resold expensively. The historic precedent in adjacent industries (search, social media, marketplaces) shows where that leads. Concentrated platform power, declining terms for contributors, eventual regulatory backlash.

Empressa's commitment to partnership-first sourcing with substrate-enforced revenue share is a different bet. It is the bet that platforms which distribute value back to contributors will outperform platforms that extract value, both commercially and politically, over a decade-plus horizon.

This matters for investors and partners because it implies operational decisions that occasionally trade short-term margin for long-term position. Take rates lower than the landscape would tolerate. Settlement infrastructure built earlier than strict cost-benefit would justify. Contract terms favoring contributors. The thesis is that these choices compound into a market position that pure rent-extraction plays cannot match.

## Where this leads for Empressa

Three honest paths.

**Optimistic path.** Hauska becomes the canonical payment and reasoning substrate for physical-world jurisdictional intelligence across North America. Every developer, broker, AEC firm, title company, and multifamily operator pays per-call for jurisdictional reasoning. Cities are revenue centers via the partnership rather than expense centers. Empressa is a holding company over product brands (SmartCity OS, Codex, Cortex, Revit Connector, additional surfaces) that ride on Hauska. Ten to fifty humans, hundreds of millions in revenue, agent-leveraged operations. Independent or acquired by a strategic depending on operator preference.

**Realistic path.** Hauska is the leading vertical infrastructure provider for jurisdictional data in Texas and adjacent states. Fifty to two hundred cities, hundreds of firms, low tens of millions in revenue. Steady growth, defensible position, attractive acquisition target in three to seven years if desired, or independent indefinitely. This is the path most likely to actually happen and it is a very good outcome by any reasonable measure.

**Pessimistic path.** Foundation model providers absorb the data catalog space directly. Cities prefer government-mandated open data over startup-mediated substrate. Regulatory burden on payment infrastructure proves heavier than expected. Commercial position cannot capture enough value to justify the substrate build. Acquihire or graceful wind-down.

The realistic path is achievable because the unusual things have already been done. Anchor city is live in production. Customer-zero is the company's own design operation. The atom contract is shipped. The skills and protocols for compounding intelligence are built. The remaining work is execution against a clear architecture, which is the easier kind of work. Most companies fail on figuring out the architecture, not on executing against one that exists.

## Broader economic implications

The shifts that make Empressa's bet sensible are happening at industry scale and have implications beyond any single company.

Software production cost falls toward compute cost. Software gross margins compress. The category of companies that called themselves "software companies" gets reorganized into companies that produce something genuinely durable (data, network effects, regulatory positions, real intellectual property) and companies that were charging rent on capabilities that are now cheap. The latter category compresses.

The economy fragments into smaller units of value transferred. SaaS was a megabundle. Agent economies run on micro-transactions. A million one-tenth-of-a-cent transactions replaces ten one-hundred-dollar subscriptions. Different infrastructure required, different commercial dynamics, different sales motions.

Verticalization matters more than horizontal capability. General agents commoditize each other; specialized data plus reasoning plus payment substrate in specific verticals captures durable value that the general agents cannot. Jurisdictional physical-world reasoning is one such vertical. The pattern will repeat across healthcare, manufacturing process knowledge, scientific instrumentation, legal precedent, and other domains where unique data plus specialized reasoning plus partnership-based sourcing can build a substrate.

The lean shop model spreads. One operator with structured organizational memory and an agent fleet can compete with companies that have a hundred humans doing the same work. Fewer humans needed per dollar of revenue produced. Wealth concentrates in fewer hands per company. Per-capita productivity rises while employment dynamics change unpredictably. Political and regulatory response will follow. Companies that anticipate this and build defensible positions (genuine value creation, value distribution to contributors, transparent operations) will navigate it. Companies that assume status quo will be surprised.

## What this means for investors and partners

For investors. Empressa is not a SaaS company. The metrics that worked for SaaS (per-seat ARR, NDR, CAC payback in 12-18 months) are partially relevant but not the primary lens. The relevant metrics are atom volume, jurisdiction coverage, source revenue routing rate, agent operator adoption, MCP call volume by product, and the compounding rate of the intelligence loop. The investment thesis is that substrate companies built well in the post-SaaS shift will produce returns over a longer horizon than the typical SaaS investment, but with deeper moats and lower commodification risk.

For city and firm partners. Empressa's offer is fundamentally different from a typical software vendor. The platform converts your data into a revenue-generating asset rather than charging you a fee for software access. Revenue share is committed contractually today, and the platform is being built so that settlement becomes substrate-enforced rather than only contractually promised. Your data portability is structural via the atom contract. Your strategic alignment with the platform deepens because your interests are aligned with platform success.

For hiring. Empressa is building the operating system for a new kind of company. The skills and protocols and substrate that make a lean operator plus agent fleet operate effectively are themselves valuable artifacts. Working at Empressa is partly about producing the products and partly about helping build the operating model that other companies will adopt.

## Open questions

Two genuinely open questions that the company does not have answers to yet.

**The dominant agent protocol question.** MCP is the leading candidate today, but the protocol landscape could evolve. Hauska's bet is that the protocol layer will commoditize and the value will pool at the substrate layer underneath (data plus reasoning plus payments). If a different protocol wins, the substrate adapts; the bet is not protocol-specific.

**The regulatory response question.** Payment infrastructure has clear regulatory requirements. AI infrastructure increasingly does as well. The intersection (agent-driven payments for AI-mediated reasoning over regulated domain data) is a regulatory frontier. The company is operating responsibly within current frameworks and building toward defensible positions; how the frontier evolves is genuinely uncertain.

## References

- 05_living_lineage_thesis.md (related strategic frame, focused on lineage and provenance)
- 06_cities_value_narrative.md (city-facing value articulation)
- 07_product_line_summary.md (product portfolio detail)
- 08_tiered_access_model.md (tier model that the payment substrate enforces)
- 14_pricing_framework.md (commercial model detail, including SDK payment substrate section)
- 28_mcp_first_product_design.md (product line architecture principle)
- 60_eci_atomization.md (the compounding intelligence implementation)
- Session origin: _sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md

## Revision history

- **2026-05-21:** Revenue-share language reframed from "substrate-enforced" stated as present fact to the designed model with settlement not yet enforced, after the 2026-05-21 cross-repo reconciliation found no revenue-routing code in the hauska-sdk. The crypto settlement rail is built; the routing layer is not. Affects the partnership-first-sourcing principle and the city-and-firm-partner section.

- **2026-05-16 (origin):** drafted during strategic brainstorm session. Captures the company-level strategic frame for investor, partnership, hiring, and case study use. Companion to 28_mcp_first_product_design.md.
