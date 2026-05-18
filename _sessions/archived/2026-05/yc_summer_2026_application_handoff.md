---
Filed: 2026-05-18
From: Claude Code (P:\doc_repo strategic session)
To: Valerie (commercial / GTM lead) — for use inside a Claude project
Re: YC Summer 2026 application — Hauska Inc., "Software for Agents" RFS
Objective: acceptance into the YC Summer 2026 batch
---

# YC Summer 2026 application — handoff package

This document is self-contained. Drop it into a Claude project as the project knowledge base. Everything Claude needs to draft a strong application is in here. There is no external repo to reference; if Claude wants to cite a source, it cites this document.

## Section 1 — Mission

Submit the strongest possible application to Y Combinator's Summer 2026 batch on behalf of Hauska Inc., positioned against the "Software for Agents" Request for Startups (RFS #12, owned by partner Aaron Epstein), with secondary positioning support from "SaaS Challengers" (#11) and "AI-Native Service Companies" (#3).

The on-time application deadline (May 4, 2026) has passed. Late applications are still being accepted. Submit as a late application. The structural disadvantage of being a late applicant is real but not fatal; the work below is calibrated to make the packet good enough to clear the bar anyway. Decisions for on-time applicants land June 5, 2026; late decisions follow on a rolling basis.

Success criterion: interview invitation. The application's job is to earn the partner interview. Everything after that is Nick's job.

## Section 2 — How to use this package inside a Claude project

1. Create a new Claude project. Title: "YC Summer 2026 — Hauska Inc."
2. Paste this entire document into the project instructions, or upload it as a project file. Both work; project instructions keeps it in the system prompt.
3. In the project, ask Claude to draft each application question one at a time, providing the question verbatim from the YC form. The recommended angles for each question are in Section 8 below.
4. Iterate on each draft until it reads tight, concrete, and load-bearing. The voice guide is in Section 9.
5. Before final submission, walk through Section 10 (submission checklist) and Section 4 (decisions Nick must confirm). Do not submit until Nick has confirmed Section 4.

The bias of every draft should be: short, concrete, evidence-first, no filler, no hedging. YC partners read thousands of applications. A sentence that says nothing costs you the interview.

## Section 3 — The strategic frame

### Bullseye category

YC's RFS #12 "Software for Agents" (Aaron Epstein) asks for builders making machine-readable interfaces — APIs, MCPs, CLIs — and documentation that lets AI agents discover and use tools programmatically, without humans in the loop.

Hauska is exactly this. The Hauska MCP Server is a public Model Context Protocol endpoint exposing structured municipal jurisdiction data (building codes, zoning, permitting requirements) to any MCP-capable agent. The atom contract underneath it is the data shape every agent consumes, with provenance, citation, and confidence on every response. The buyer is the agent operator, not the human end user. This is the literal description of the category, with a live anchor city in production and a v1 sprint shipping.

Position the application as: "We are building the canonical agent-readable interface for physical-world jurisdictional intelligence. Buyer is the agent operator. First city is live. v1 ships this quarter."

### Secondary categories

Mention these only if a question invites breadth. Do not muddy the bullseye.

- **#11 SaaS Challengers.** Codex (plan review plus code intelligence) and Cortex (design accelerator) challenge entrenched AEC and permitting software incumbents. The substrate they sit on is Hauska.
- **#3 AI-Native Service Companies.** "Sell reasoning, not data" is a Hauska structural commitment. Hauska delivers jurisdictional reasoning as a service routed through agents, not a software tool sold to humans.

### The thesis in one paragraph

The SaaS bundle (UI plus integration plus customer success plus per-seat pricing) was built for humans adopting software. Agents collapse the bundle. UI becomes optional. Integration goes through protocols like MCP. Per-seat pricing makes no sense for a buyer with no seats. The post-SaaS substrate is where value pools: unique data, network effects, regulatory positions, and protocol substrates other businesses build on. Hauska is the substrate for physical-world jurisdictional intelligence in North America. Plaid for the data side. Stripe for the payment side. Vertical: building codes, zoning, permitting, plan review across cities, counties, and AEC firms.

### Why Hauska wins this category

Three reasons.

First, the substrate is partnership-sourced, not scraped. Cities, counties, and firms are licensors with revenue share, not extraction targets. The Hauska SDK is the payment substrate that makes revenue share mechanically enforced, not contractually promised. This is a different bet than the dominant "extract and resell" pattern in adjacent industries, and the bet is that platforms which distribute value back to contributors outperform pure rent-extraction plays on a decade horizon.

Second, the moat is the use history. Layer 1 atoms (what the code says) are free and publishable as `.atompack` files. Layer 2 atoms (how reviewers actually apply the code, adjudication patterns, comparable project precedents) are paid because they cannot be replicated without years of platform use. Free-tier consumption drives signal. Paid-tier consumption drives revenue.

Third, the cost structure is enforced at the structural-commitment level. Onboarding a new jurisdiction must come in under $200 of compute plus one hour of human review. Hard kill at three counties if not achievable. This is a load-bearing operational constraint that keeps the substrate genuinely cheap to scale, not just claimed to be.

### Live traction the application must reference

- **Bastrop, Texas (city, ~10K residents):** first city in the network, in production today on SmartCity OS. Plan reviewer (Sylvia Carrillo, city manager; Jaime, reviewer) actively using Codex 1b. Bastrop is the partnership template for every subsequent city. Currently in a live multi-year proposal negotiation.
- **Hauska MCP Server v1 sprint:** repo bootstrapped at github.com/empressaioemail-tech/hauska-mcp-server on 2026-05-18. Five tools scaffolded. Streamable HTTP transport. Auth and logging stubs. Targets ~20-jurisdiction Texas corpus at public launch.
- **Code Ingestion Pipeline v1 sprint:** in active execution. Municode and eCode360 adapters in flight. Target end state is any Texas city's published code ingestible into a quality-gated atomized corpus via a pipeline run.
- **Active enterprise prospect:** 300-person, 45-location, 12,000-unit Austin-based multifamily operator. Post-call-1. 90-day integration pilot scoping in flight. Decision maker named, relationship active. (Do not name the prospect in the application; describe by shape.)
- **Atom contract:** shipped and in production use. Hauska commercial substrate, ratified at ADR-018 (2026-05-18) as `@hauska/atom-contract`. Type-enforced, 19 of 24 expected atom types registered, zero external SDK dependency.
- **Payment substrate (Hauska SDK):** v0.1.0 published. Full x402 + USDC + Circle integration built. 56 tests green. Payment phasing committed in the pricing framework; settlement infrastructure phased post-Bastrop revenue share contract test.

### What is intentionally NOT in the pitch

- Real estate development at Jarrell (separate operation, out of scope).
- Personal financial structuring.
- Legacy Group ATX LLC operations beyond what is necessary to explain entity structure.
- Anything about the agent fleet operating model. It is novel and load-bearing internally but reads as "no team" to YC partners. Address the team question on its own terms (Section 8 — Question: Why are you the right people).

## Section 4 — Decisions Nick must confirm before submission

These are the load-bearing questions Valerie cannot answer alone. The package assumes the defaults below; Nick must confirm or override before submission.

### 4.1 — Founder structure on the application

**Default assumption:** Nick is the sole named founder. Valerie is listed in the team narrative as commercial / GTM lead but not as a co-founder for equity purposes.

**Why this matters:** YC strongly prefers two or more technical co-founders. Solo founder is a known structural disadvantage. If Valerie is named as a co-founder on the application, this materially strengthens the team narrative and addresses the solo-founder objection, but it commits Hauska to a co-founder equity arrangement that may not yet be settled.

**Nick must confirm:** Sole founder (default), or co-founder structure with Valerie named explicitly. If co-founder, equity split must be confirmed before submission.

### 4.2 — Entity on the application

**Default assumption:** Hauska Inc. (Delaware C-corp, entity separation already established) is the applicant. Software for Agents is the bullseye, the Hauska MCP Server is the Hauska commercial substrate, and YC funds Delaware C-corps cleanly.

**Why this matters:** Empressa is the product brand carrying product surfaces (SmartCity OS, Cortex, Codex, Revit Connector). Hauska Inc. is the substrate company. The category we are applying against is substrate work, so Hauska Inc. is the right legal entity.

**Nick must confirm:** Hauska Inc. (default), with the brand layering explained in the "What does your company do" answer.

### 4.3 — Naming the enterprise prospect

**Default assumption:** Do not name the multifamily prospect by name. Describe as "a 300-person, 45-location, 12,000-unit Austin-based multifamily operator currently in post-call-1 scoping for a 90-day integration pilot."

**Why this matters:** The prospect relationship is live and the deal is not closed. Naming the counterparty in an application that may be read by competitive YC portfolio companies (proptech is a crowded YC space) is uncontrolled exposure.

**Nick must confirm:** Anonymize (default), or name explicitly if comfortable.

### 4.4 — Bastrop disclosure depth

**Default assumption:** Name Bastrop explicitly. Frame as "pioneering first city in the network" per the partnership narrative.

**Why this matters:** Bastrop is the strongest proof point in the application. It is a real city in production. Sylvia and Jaime are real reviewers. The relationship is public-facing in a way the multifamily prospect is not. Per memory, Bastrop's preferred narrative is "pioneering first city in a network," not "data source we extract from."

**Nick must confirm:** Name Bastrop (default), with the pioneering framing held.

### 4.5 — Phone interview availability

**Required from Nick before submission.** YC asks every applicant for interview-availability windows. Nick must provide a two-week window with concrete days and times he can take a 10-minute call.

### 4.6 — Demo and founder video filming

**Required from Nick before submission.** YC requires two videos. Founder video is mandatory and must show every named founder on camera, ~1 minute, talking about what you do and why you are the team. Demo video is ~1 minute showing the product. Scripts are in Section 9.

Nick must record and Valerie must upload before submission. If filming slips, the application slips. Do not submit without both videos.

## Section 5 — Company facts

For Claude to pull from when answering factual questions.

- **Company legal name:** Hauska Inc.
- **Entity type:** Delaware C-corp, separation established
- **Operating company (separate):** Legacy Group ATX LLC (Texas)
- **Sister brand (product surfaces):** Empressa, carrying SmartCity OS, Cortex, Codex, Revit Connector
- **Founder:** Nick (last name to be filled in before submission); operator and architect
- **Commercial lead:** Valerie; commercial and GTM, enterprise and broker pipeline
- **Headquarters:** Austin, Texas
- **Post-YC location:** Nick to confirm; default San Francisco for July through September 2026 batch in-person requirement, then return to Austin
- **Company URL:** hauska.dev (confirm registration status with Nick)
- **Product URLs:**
  - github.com/empressaioemail-tech/hauska-mcp-server (v1 sprint repo)
  - Bastrop production deployment URL (Nick to provide if including)
- **Founded:** 2024 (confirm with Nick — both Hauska Inc. and Legacy Group ATX dates)
- **Incorporated:** Yes — Hauska Inc. Delaware C-corp and Legacy Group ATX LLC Texas. Entity separation in place.
- **Current revenue:** Bastrop is a live customer of SmartCity OS. Nick to confirm specific revenue numbers before final submission; YC asks for monthly revenue if any.
- **Funding:** None (bootstrapped; confirm with Nick if any angel or friends-and-family rounds taken)
- **YC alumni among founders:** No (confirm with Nick)
- **Non-competes:** No (confirm with Nick)

## Section 6 — The full thesis (source material for any narrative question)

This section is the deep source material. Claude should pull from it but compress hard when drafting answers; YC's character limits are unforgiving.

### 6.1 — The post-SaaS shift

The SaaS model worked for two decades because UI plus integration plus customer success plus per-seat pricing plus annual contracts were a coherent bundle for humans adopting software. Agents collapse the bundle. UI becomes optional. Integration becomes self-service via protocols like MCP. Customer success is absorbed by the agent reading the documentation. Per-seat pricing makes no sense for a buyer with no seats. Annual contracts become awkward when usage is volatile.

What replaces the bundle is substrate-level commerce. Value flows back to actual sources of value, mediated by a thin protocol layer, with reasoning chains as the unit of accounting rather than human seats. Software pricing follows the cost structure of producing software, which is now cheap. The 70-80 percent gross margins SaaS companies got used to are hard to defend.

The durable categories in the post-SaaS economy: unique data, network effects, regulatory positions, and protocol substrates other businesses build on. Hauska's position is in the substrate category by design.

### 6.2 — Hauska as Plaid + Stripe for jurisdictional intelligence

Plaid is the closest analog for what Hauska is becoming on the data side. Stripe is the closest analog for what the SDK is becoming on the payment side. The combination of both layers, in a specific vertical (physical-world jurisdictional intelligence), is the differentiated position.

The catalog contains jurisdictional data that is genuinely hard to replicate because acquiring it requires partnership relationships that take years to build. The reasoning layer over that data has fewer training-data parallels than general reasoning because physical-world jurisdictional adjudication is a long-tail domain not well-represented in foundation model training. The payment substrate has switching costs because cities and firms sign revenue share contracts that align them with platform success.

### 6.3 — The four structural commitments

Every architectural and strategic move at Hauska checks against these four.

1. **Sell reasoning, not data.** Every output carries reasoning chain, source citation, confidence score, and timestamp regardless of tier. Layer 1 (bare code reference) is free. Layer 2 (use-context, adjudication patterns, comparable precedent) is paid because it is the moat.

2. **Partnership-first sourcing.** Cities, counties, and firms are licensors with structural revenue share, not extraction targets. Bastrop is the template. Substrate-enforced revenue share via the SDK, not contractually promised.

3. **Cost per jurisdiction onboarded.** Under $200 of compute plus one hour of human review per new jurisdiction. Hard kill at three counties if not achievable. This is a load-bearing constraint, not an aspiration.

4. **Dual interface as product line principle.** Net-new products ship MCP-first with UI second. Existing UI-first products retrofit MCP as a tracked roadmap item. Every product surface tracks an MCP ship date.

### 6.4 — Three-tier atom architecture

The atom contract underneath Hauska distinguishes three architectural tiers.

- **Data atoms (live):** code-section, code-definition, code-amendment, code-cross-reference, parcel-record, adjudication-record, and so on.
- **Procedure-execution atoms (ratified 2026-05-16, ADR-013):** the unit of metering for the SDK payment substrate. Every agent consumption produces one.
- **Actor atoms (ratified 2026-05-16, ADR-015):** the identity layer; cities, firms, reviewers, agents.

Atom access control (ADR-017) enforces scope at the data layer, not the screen. Atom identity persists across versions via DID + IPNS (ADR-011). Atoms are content-addressed via IPFS (ADR-010). The atom export format (ADR-012) makes free-tier atoms publishable as `.atompack` files for offline LLM consumption.

The atom contract was ratified as Hauska commercial substrate (peer to the Hauska SDK, not Empressa product) at ADR-018 on 2026-05-18.

### 6.5 — The product line

Hauska Inc. carries the commercial substrate. Empressa carries product surfaces that consume the substrate.

- **Hauska Engine:** jurisdiction-aware code reasoning over atoms. The shared intelligence underneath every product.
- **Hauska MCP Server:** public MCP endpoint exposing Layer 1 atoms to any MCP-capable agent. Free at Layer 1. The category-bullseye for this YC application.
- **Hauska SDK:** payment substrate for atom transactions. v0.1.0 published. x402 + USDC + Circle integration built.
- **SmartCity OS:** the city's operational platform. Live in Bastrop. Replaces the patchwork of GIS plus permit software plus spreadsheets plus email most cities run on.
- **Codex (plan review and code intelligence):** three surfaces. 1b (city-side reviewer tool, pre-launch), 1a (contractor-side pre-submission review), code intelligence (free Layer 1 code-lookup, MCP-first).
- **Cortex (design accelerator):** AI-assisted design with the jurisdiction's code as a live partner. Architect-facing UI plus MCP retrofit queued.
- **Revit Connector:** bridge between Cortex and Revit. Architects' existing tool.
- **Code Ingestion Pipeline:** the capability that makes onboarding the next city cheap. Without it, every new jurisdiction is a custom project; with it, every new jurisdiction is a pipeline run.

### 6.6 — The buyer

The buyer for Hauska is the agent operator. Not the city. Not the architect. Not the contractor. The agent that those parties (or their developers) build, embed, or buy.

The city pays for SmartCity OS (Layer 3 integrated workflow). The architect pays for Cortex (Layer 3). The contractor pays for Codex 1a (Layer 3). All of those layer on top of Hauska's substrate, but the substrate's commercial counterparty is the agent operator running an agent that queries the MCP server, embeds atom packs, or settles payments through the SDK.

This is unusual for a vertical software pitch. Most "vertical AI" plays sell to the vertical's humans. Hauska sells to the agents acting on behalf of the vertical's humans. That is the post-SaaS shift in concrete form.

## Section 7 — Live traction (source material for traction questions)

### 7.1 — Bastrop, Texas

Bastrop is a city of approximately 10,000 residents in Bastrop County, Texas. Hauska's flagship product surface (SmartCity OS) has been live in production with Bastrop for over a year, replacing patchwork tooling across permitting, inspections, code enforcement, calendar, and constituent-facing dashboards.

- Live integrations with Municode (the city's code platform), MyGov (permitting), OpenGov (transparency portal), Power BI (CIP reporting), Spireon (vehicle fleet tracking, 21 vehicles), and BeWith.io (iCal feed for constituent calendar subscriptions).
- Plan reviewer Sylvia Carrillo (city manager) and Jaime (reviewer) are reviewer-zero for the Codex 1b plan-review surface.
- Live multi-year proposal negotiation in flight. Bastrop is the partnership template for every subsequent city.
- The dashboard at the production URL (Nick to provide) is what Sylvia walks visiting city managers through.

Bastrop's preferred narrative is "pioneering first city in a network of cities," not "data source feeding the platform." This matters because the framing positions Bastrop as a partner with structural revenue share, which is the differentiation point against the typical extract-and-resell vertical SaaS play.

### 7.2 — Hauska MCP Server v1

Repository: `github.com/empressaioemail-tech/hauska-mcp-server` (bootstrapped 2026-05-18).

v1 ship targets:
- Five MCP tools: `search_atoms`, `get_atom`, `list_jurisdictions`, `query_jurisdiction`, `search_permit_atoms`.
- Streamable HTTP transport.
- Quality-gated corpus of at least 20 Texas jurisdictions at public launch.
- Listed in Anthropic's MCP directory and on `awesome-mcp-servers`.
- Free Layer 1; paid tiers (Developer Pro, Team, Embedder License) scaffolded with Stripe integration.

The MCP server is the live-query complement to `.atompack` files (offline download distribution). Both surfaces operate at Layer 1 (free, attribution-bearing) per the tier model. The moat lives in the Layer 2 atoms consumed by products that wrap the same engine.

### 7.3 — Active enterprise prospect

A 300-person, 45-location, 12,000-unit Austin-based multifamily operator. Currently in post-call-1 scoping for a 90-day integration pilot. Decision maker named and engaged. Phase 1 lead with accounting close (monthly close acceleration via unified data layer plus pre-coded invoices plus pre-drafted variance commentary), with Phase 2 expansion into acquisitions underwriting against operating reality, and Phase 3 into multi-state code intelligence and pre-submission plan review for the construction arm.

Do not name the operator in the application. Describe by shape.

### 7.4 — Payment substrate (Hauska SDK)

v0.1.0 published. Full x402 + USDC + Circle integration built. 56 tests green. The substrate is principle-committed and implementation-phased per the pricing framework. Phase 1 (atom-contract metadata) is shipped. Phase 2 (metering at the SDK and MCP server layers) is queued post-v1. Phase 3 (settlement infrastructure) follows the Bastrop revenue share contract operational test.

### 7.5 — Atom contract

Ratified as Hauska commercial substrate at ADR-018 (2026-05-18). Lives at `@hauska/atom-contract` (M2-C extraction target). Type-enforced. 19 of 24 expected atom types registered. Zero external SDK dependency. The atom contract is consumed by every product surface in the portfolio directly.

## Section 8 — YC application questions, recommended angles

YC application questions vary slightly by batch but the canonical set is stable. Below is the canonical set with the recommended angle for each. Where the actual YC form has slightly different wording, adapt; the angle holds.

For every answer: lead with the load-bearing fact. Then the evidence. Then the implication. No filler sentences. No "we believe" or "we hope." YC partners do not have time.

### 8.1 — Company name

Hauska Inc.

### 8.2 — Company URL

hauska.dev (confirm registration with Nick before submission)

### 8.3 — What is your company going to make?

Answer in 200 words or less. Aim for tight.

Recommended draft:

> Hauska is the canonical agent-readable substrate for physical-world jurisdictional intelligence. We expose municipal codes, zoning, permitting requirements, and plan-review adjudication patterns as structured atoms to AI agents through a public MCP server and a payment SDK. Cities, counties, and firms are licensors with revenue share, not extraction targets. The buyer is the agent operator — the developer or company building an agent that needs to reason about real-world jurisdictional constraints. First city (Bastrop, Texas) is live in production. Our v1 MCP server ships this quarter with a 20-jurisdiction Texas corpus. Plaid for the data side. Stripe for the payment side. Vertical: building codes, zoning, permitting, plan review across cities, counties, and AEC firms in North America.

### 8.4 — Describe the size of the problem you're tackling

Recommended angle: physical-world jurisdictional intelligence is a large, fragmented, structurally underbuilt domain.

Concrete points to draw from:
- There are roughly 19,000 incorporated municipalities in the United States, each with its own published code, plus 3,000+ counties.
- The AEC (architecture, engineering, construction) industry in the US is roughly $2 trillion in annual spend. Plan review and code compliance is friction across every project.
- Today every agent that wants to reason about a jurisdiction either does not (and gets it wrong), or does it by scraping (which is unreliable and exposes the operator to license risk), or does it by paying a vertical SaaS vendor (which is per-seat priced for humans, not per-call priced for agents).
- The cost of resubmission cycles in plan review is conservatively three to six weeks of carrying cost per cycle. For a typical commercial project, one avoided cycle is worth tens of thousands of dollars. For a 12,000-unit multifamily operator running construction across multiple states, the aggregate cost of resubmission and re-discovery is structurally material to the operating model.

The total addressable opportunity is not "the AEC market." It is "every agent that needs to reason about physical-world jurisdictional constraints" — which is becoming every real-estate agent, construction agent, asset-management agent, title-and-lending agent, and city-side ops agent in the country.

### 8.5 — What's new about what you're making?

Recommended angle: nobody else is building this as a substrate.

Three new things compared to substitutes:

First, **MCP-first by design**. Every other vertical-AI player in this space (proptech, regtech, govtech) is building UI-first products and bolting on an API as a roadmap line item. Hauska's primary surface is the MCP server. UI is the secondary surface, wrapped around the same engine. This matches where the buyer actually is.

Second, **partnership-sourced with substrate-enforced revenue share.** Every adjacent play (commercial data brokers, scrape-and-resell GIS plays, foundation model crawl-and-train) treats sources as extraction targets. Hauska treats them as licensors with structural revenue share through the SDK. The downstream consequence is that we onboard cities and firms as commercial partners, not as adversarial counterparties, which is a category difference in unit economics and access.

Third, **reasoning is the unit of accounting, not seats or raw API calls.** Per-seat pricing makes no sense for an agent buyer. Per-API-call pricing under-prices the reasoning chain that makes the call valuable. Hauska prices the reasoning call — the unit that ties cost to value created — and the SDK routes a share back to source actors.

Substitutes people resort to today:
- Foundation model RAG over publicly-scraped city websites (unreliable, no provenance, no payment to source).
- Per-seat SaaS for the vertical's humans (Accela, Tyler, Yardi, Procore-adjacent stacks; not designed for agent consumption).
- In-house data engineering teams that custom-build per-jurisdiction (expensive, fragile, doesn't compound).
- Doing without (most agents currently fail silently when asked jurisdiction-specific questions).

### 8.6 — Why did you pick this idea? Do you have domain expertise?

Recommended angle: Nick has been operating at the intersection of real estate, construction, code compliance, and software for years; the idea picked him.

Draw from these threads in the draft:
- Nick operates Legacy Group ATX LLC, a real-estate-adjacent operating company in Austin. Direct exposure to the cost of jurisdictional friction across permitting, inspection, and plan review.
- SmartCity OS started as an internal tool to make the city of Bastrop's operations work better. It is now a live production platform. The internal-tool-to-platform path means the product is grounded in real operational reality, not in a category map.
- The partnership with Bastrop city (Sylvia Carrillo, city manager; Jaime, reviewer) gave Nick a direct view into what cities actually need and how they buy. That partnership pre-dates the formal product line.
- The atom contract architecture came out of repeated frustration that every vertical-AI play in adjacent spaces was rebuilding the same data substrate badly. Hauska's bet is that the substrate is the durable layer.

How we know people need it:
- Bastrop is paying. Sylvia is recommending us to peer city managers in the Williamson County belt.
- A 300-person Austin-based multifamily operator is scoping a 90-day integration pilot.
- The Hauska MCP Server has not launched publicly yet and we already have inbound from PropTech embedders asking about atom-pack licensing.

### 8.7 — Who are your competitors? Who do you fear most?

Recommended angle: name them honestly. YC partners check.

Three competitive surfaces:

**Vertical SaaS incumbents.** Accela, Tyler Technologies, OpenGov, and Yardi are the dominant per-seat SaaS vendors in adjacent spaces. They are not building MCP-first and their incentive is to keep their data inside their stack. We expect to interoperate with them (we already do at Bastrop) rather than displace them. Their structural disadvantage is that their commercial model is per-seat, which does not match how agent operators want to buy.

**Foundation model providers.** OpenAI, Anthropic, and Google could absorb the data catalog space directly by training on public city websites. Mitigant: physical-world jurisdictional adjudication is a long-tail domain not well-represented in foundation training data, and partnership-sourced data carries provenance and citation that scraped data cannot. The bet is that the substrate value pools at the protocol layer that mediates source-actor payment, not at the model layer.

**Adjacent proptech and regtech plays.** Several proptech startups have built jurisdiction-specific data products in narrow slices (parcel data, zoning data, code lookup for specific cities). None have built the full substrate (data plus reasoning plus payment) as Hauska is. The risk is one of them pivots into the substrate frame; the mitigant is that the partnership relationships take years to build and we have a multi-year head start in Texas.

Who we fear most: a YC portfolio company in an adjacent vertical that pivots into the substrate frame after seeing this RFS land. Best defense is execution speed.

### 8.8 — Have you talked to potential users? What did you learn?

Recommended angle: live customer plus live prospect plus inbound.

- Bastrop city: live customer for over a year. Direct conversations with Sylvia Carrillo (city manager) and Jaime (reviewer) every week. Learned that the per-seat SaaS model is the wrong abstraction for cities; cities want operational platforms that work end-to-end, and they want to be partners in the data layer, not customers of it.
- 300-person multifamily operator: post-call-1 prospect. Learned that monthly close acceleration is the right wedge for this buyer profile (faster ROI signal than parcel intelligence), and that the institutional-knowledge-compounding story resonates harder than the AI-feature story.
- Inbound from PropTech embedders asking about atom-pack licensing before the Hauska MCP Server has even launched publicly. Learned that the substrate framing pulls embedders in without active outbound; they are looking for exactly this category.

### 8.9 — What's your tech stack?

Recommended angle: short and concrete.

- Atom contract: TypeScript, Zod for runtime validation, type-enforced at the package boundary.
- Hauska MCP Server: TypeScript, Anthropic MCP SDK, Streamable HTTP transport. Cloud Run deployment, Postgres for the key and tier tables, Upstash Redis for rate limiting.
- Code Ingestion Pipeline: TypeScript, Cloud Run jobs, Postgres job table, IPFS for content-addressed storage, pgvector for embeddings, Claude (vision for OCR, sonnet for extraction).
- Hauska Engine: TypeScript, retrieval API over the atom storage layer.
- Hauska SDK: TypeScript, x402, USDC, Circle integration. Settlement substrate. 56 tests green at v0.1.0.
- SmartCity OS: Node.js (Express), React, Postgres (Drizzle ORM), Cloud Run.
- Cortex / Codex / Revit Connector: TypeScript core plus C# Revit add-in for the connector.
- Identity: DID + IPNS for atom identity across versions per ADR-011.

### 8.10 — Are you running any prototypes?

Recommended angle: not prototypes, production.

- SmartCity OS is live in production with Bastrop, serving real operational traffic across permitting, inspections, calendar, Power BI dashboards, vehicle fleet, and constituent-facing surfaces.
- The atom contract is in production use across product surfaces.
- The Hauska MCP Server v1 is in active sprint development, repo bootstrapped 2026-05-18.
- The Code Ingestion Pipeline v1 is in active sprint development with the Municode adapter ahead of the eCode360 adapter.

### 8.11 — Have you incorporated?

Yes. Hauska Inc. (Delaware C-corp, the applicant entity) and Legacy Group ATX LLC (Texas LLC, the separate operating company) are both formed. Entity separation in place.

### 8.12 — How long have the founders known each other? Have any not met in person?

Nick to confirm dates. If Valerie is being named as a co-founder per decision 4.1, the relationship history with Valerie goes here. If Nick is sole founder, this question is N/A or "I have known my commercial lead [Valerie] since [date]; we work together in person regularly."

### 8.13 — Why are you the right people to be working on this?

Recommended angle: domain plus operating plus product plus distribution all in one operator.

Lean on these threads:
- Nick has been operating in real-estate-adjacent businesses in Austin for years. Direct experience with jurisdictional friction at every layer (permitting, inspection, plan review, code compliance).
- SmartCity OS exists because Nick built the first version as an operational tool with a live city partner. The platform did not start as a category bet; it started as a working tool. That sequence matters.
- The Bastrop partnership pre-dates the product line and was built on a relationship of operational trust, not a sales motion. Sylvia recommends us to peer city managers. This is a structurally hard thing to fake.
- The atom contract architecture came from years of dealing with the same data-shape problems across multiple product surfaces. Hauska is the third or fourth attempt to get the substrate right; the previous attempts taught the lessons that make this one work.
- The agent-operating-model thread (lean operator plus structured agent fleet) is itself proof we can ship more than a typical solo founder. We have shipped a live city platform, a payment SDK with full x402 integration, a five-tool MCP server scaffold, and a production atom contract in parallel.

If Valerie is being named as co-founder per decision 4.1, add: Valerie owns the commercial relationship layer (enterprise prospects, broker pipeline, partnership channel into TML and TCMA and TLTA). The division of labor is clean: Nick owns substrate and architecture; Valerie owns commercial and channel.

### 8.14 — Any of the founders covered by a non-compete?

No (Nick to confirm).

### 8.15 — Anyone from a YC funded company?

No (Nick to confirm).

### 8.16 — Where do you live now, and where will the company be based after YC?

Nick lives in Austin, Texas. Company is headquartered in Austin. For the YC Summer 2026 batch (July through September 2026) we will be in San Francisco per the in-person batch requirement. Post-batch, we will return to Austin, where our customer base (Bastrop, the multifamily operator, the Williamson County belt of cities) is concentrated and where the partnership channels (TML, TCMA, TLTA, Capital Factory) live.

### 8.17 — How did you hear about YC?

Nick to confirm. If Nick is comfortable, mention the Summer 2026 RFS publication and the bullseye fit with Software for Agents as the trigger for applying.

### 8.18 — Anything else we should know?

Recommended angle: use this slot to drive home one thing.

The one thing: Hauska is the substrate side of the post-SaaS shift, and the substrate side is where the durable returns are. The current sprint ships a public MCP server with a 20-jurisdiction corpus this quarter. The next twelve months ship the SDK payment substrate metering, the SmartCity OS MCP retrofit, the Codex 1a MCP, and the second and third cities in the network. The twelve months after that ship the Embedder License tier with PropTech counterparties already pulling. YC's Software for Agents RFS describes exactly what we are building; we are looking for the partner who sees the same picture and wants to be in the conversation about how it scales.

## Section 9 — Video scripts

YC requires two videos. Both should be recorded at decent (not professional) quality. Phone camera on a tripod with reasonable audio is the standard. Avoid over-production; YC partners distrust slick.

### 9.1 — Founder video (~60 seconds, all founders on camera)

Script for Nick (sole founder case; adapt if Valerie is co-founder per decision 4.1):

> Hi, I'm Nick, founder of Hauska. I'm based in Austin, Texas.
>
> We build the agent-readable substrate for physical-world jurisdictional intelligence. Cities, building codes, zoning, permitting, plan review — exposed to AI agents through a public MCP server and a payment SDK that routes revenue back to source actors.
>
> I've been operating at the intersection of real estate, construction, and code compliance in Austin for years. Our first city, Bastrop, has been live in production for over a year. Our city manager there recommends us to her peers across the Williamson County belt. A 12,000-unit Austin multifamily operator is in scoping for a 90-day integration pilot.
>
> Our MCP server v1 ships this quarter with a 20-jurisdiction Texas corpus. Your RFS this batch describes exactly what we're building. We'd like to be in the room.

Time the read. Should land around 50 to 55 seconds. Adjust pacing.

### 9.2 — Demo video (~60 seconds, product surface)

Two options. Pick one based on what is most legibly impressive on screen.

**Option A: Live Bastrop dashboard walkthrough.** Open the production Bastrop SmartCity OS dashboard. Show permitting, inspection, calendar, Power BI report, vehicle fleet tracker. Narrate: "This is a real city, running their operations on our platform, in production for over a year." Then cut to a terminal showing the Hauska MCP Server scaffold and a sample tool call returning a code-section atom with provenance.

**Option B: MCP server-first demo.** Open Claude Desktop with the Hauska MCP Server (local dev or staging) configured. Ask a jurisdictional question ("What are the parking minimums for multifamily in Bastrop?"). Show the response with cited atom DID and source. Then cut to the Bastrop production dashboard to anchor that this is the substrate underneath a live city platform, not a thought experiment.

**Recommendation: Option B.** The category is Software for Agents. The demo should lead with the agent surface, not the human UI. Bastrop is the credibility anchor that follows.

Nick records both videos. Valerie uploads to unlisted YouTube or Vimeo (YC accepts either) and pastes the URLs into the application.

## Section 10 — Submission checklist

In order. Do not submit until every box is checked.

1. Section 4 decisions confirmed by Nick (founder structure, entity, prospect anonymization, Bastrop disclosure, interview availability, video filming complete).
2. Every application question drafted, reviewed by Nick, and trimmed to within character limits.
3. Founder video recorded and uploaded.
4. Demo video recorded and uploaded.
5. Company URL (hauska.dev) registered and resolves (if not already; confirm with Nick).
6. Hauska Inc. legal name and incorporation date confirmed.
7. Founder full legal name confirmed.
8. Phone interview availability window confirmed (two-week range with concrete days and times).
9. Final read-through by Nick. Specifically: does it sound like Nick? Does it overclaim? Does it underclaim? Is anything in there that should not be (named prospect, unconfirmed revenue numbers, anything sensitive)?
10. Submit.

## Section 11 — Tone and voice guide

YC application voice is its own genre. Calibrate every draft against the following.

**Direct.** Lead with the verb. "We build" is better than "We are building." "First city is live" is better than "Our company has achieved the milestone of having its first city in production."

**Concrete.** Numbers and names beat adjectives. "Bastrop, Texas, 10,000 residents, live in production for over a year" beats "a flagship anchor partnership with a leading municipal customer."

**No hedging.** "We expect to" and "we believe" and "we are confident that" all weaken the sentence. State the thing. If the thing is uncertain, say "TBD" or quantify the uncertainty.

**No filler.** "It is worth noting that," "in many ways," "fundamentally," "essentially," and "ultimately" all add zero information. Cut them.

**Earned conviction.** YC partners read thousands of pitches. They can smell hype. The way to be convincing is to be specific. Specifics earn conviction.

**Honest about what's not done.** YC partners respect founders who name what they have not yet built. They distrust founders who claim everything is done. The application should be unambiguous about: live (SmartCity OS at Bastrop, atom contract, SDK v0.1.0), in active sprint (Hauska MCP Server v1, Code Ingestion Pipeline v1), pre-launch (Codex 1b, Cortex), and phased (payment substrate settlement, ECI atomization).

**No em dashes.** YC application voice rarely needs them and Nick's house style avoids them.

**Tight character count.** YC's text fields have hard character limits. Every draft should be trimmed to fit with margin. A 280-character answer in a 500-character field reads more confident than a 499-character answer.

## Section 12 — Risks the application must address (proactively or in interview)

These are the real objections YC partners will surface. Prepare for them.

### 12.1 — Solo founder (or weak co-founder structure)

The biggest structural objection. Two responses, depending on Nick's decision in 4.1.

If sole founder: lean on operating evidence. "I have shipped a live city platform, a payment SDK with full x402 integration, a production atom contract, and an MCP server v1 sprint in parallel, with a structured agent fleet doing the engineering execution. The work product proves the operating model."

If co-founder structure with Valerie: lean on division of labor. "Nick owns substrate and architecture; Valerie owns commercial and channel. Both have been working together on Hauska's commercial trajectory for [timeframe Nick confirms]."

### 12.2 — Late application

YC's late bucket is real but not closed. Best defense is application quality. The packet above is calibrated to be strong enough that the late-bucket disadvantage is partially offset by the bullseye RFS fit and the live customer.

### 12.3 — Texas-based, batch in SF

YC may push on commitment to the in-person SF batch. Be unambiguous: Nick will relocate to SF for July through September 2026 and return to Austin post-batch. Do not equivocate.

### 12.4 — "Partnership-first" sounds slow

YC partners optimize for venture-pace scale. Partnership-first sourcing sounds like a constraint on scale. Pre-empt: "Partnership-first is how we get a structural advantage on data access that scrape-and-resell plays cannot match. Bastrop's city manager recommends us to peer cities; that's a multiplier on go-to-market that pure cold-outbound cannot replicate. The cost-per-jurisdiction constraint (under $200 compute plus one hour human review) keeps the model genuinely cheap to scale. We are not a slow business; we are a structurally cheap-to-scale business."

### 12.5 — "Cities don't move fast enough for venture pace"

True if cities are the buyer. We are not selling to cities. We are selling to agent operators. The cities are licensors. Different sales motion, different velocity. The MCP server, SDK, and PropTech embedder tiers all move at agent-operator velocity, not city velocity.

### 12.6 — "What happens if foundation models eat the data catalog?"

The bet is that the substrate value pools at the protocol layer that mediates source-actor payment, not at the model layer. Foundation models can train on public city websites but cannot route revenue back to those cities. The partnership-sourced layer is structurally different from the scrape-and-train layer, and the cities know which one they prefer. If foundation models try to absorb this space they will need to build the source-actor payment substrate themselves, which is the actual hard problem.

### 12.7 — Revenue is currently small

Be honest. Bastrop is the only live revenue line at submission time. The pipeline is the multifamily operator (90-day pilot scoping) plus the second city (Jarrell, timing TBD) plus the Hauska MCP Server v1 launch which opens the embedder tier. The application's job is not to claim large current revenue; the application's job is to prove the substrate is real and the velocity is high.

## Section 13 — What to do if the application is accepted

Out of scope for this package. Nick handles. Triggers: interview invitation arrives. Valerie's job ends at submission and ends at uploading any follow-up materials YC requests within the interview cycle.

## Section 14 — What to do if the application is rejected

Out of scope for this package. The submission is exploratory per Nick's framing ("just to see what happens"). Rejection is a data point, not a setback. The Hauska v1 sprint continues regardless.

---

End of handoff package. Drop this whole document into a Claude project for Valerie. Confirm Section 4 decisions with Nick before any draft is finalized. Do not submit without both videos.
