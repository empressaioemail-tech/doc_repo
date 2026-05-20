---
id: 16_commercialization_roadmap
title: Commercialization roadmap — Hauska layer
status: active
last_updated: 2026-05-19
applies_to: portfolio
related: [00_current_state, 09_post_saas_substrate_thesis, 11_roadmap, 14_pricing_framework, 28_mcp_first_product_design, 29_mcp_surface_tier_model, 50_hauska_mcp_server, 51_substrate_v1_sprint, 72_hauska_inc_operations, 80_adrs/adr_018_atom_contract_substrate_layer]
owner: nick
---

# Commercialization roadmap — Hauska layer

> **Forward-execution queue.** What advances Hauska commercialization once the in-flight combined Cortex/Codex sprint (Lane A, Lane B, Lane C, operator cutover) lands. Spans launch infrastructure, pricing finalization, payment substrate wire-up, corpus depth, distribution, partnership flips, and first paid contract. Does not duplicate `11_roadmap.md` (portfolio surfaces) or `14_pricing_framework.md` (pricing decision framework); this doc sequences the Hauska-spine commercial activation that those two and `51_substrate_v1_sprint.md` Streams 2C/2D/2B feed into.

## Why this exists

The substrate v1 sprint shipped the catalog substrate. The combined Cortex/Codex sprint shipped the L-surface atom shapes, MCP product tools, and product-surface modernization. Once cutover lands, the operator's next strategic question is "how does Hauska start producing revenue." That question is currently spread across `51_substrate_v1_sprint.md` Streams 2C/2D/2B (infra), `14_pricing_framework.md` (model and open questions), `72_hauska_inc_operations.md` (corporate readiness), and `28_mcp_first_product_design.md` (product MCP retrofit). This doc names the sequence across those, flags the three open decisions Nick owns, and sets the rules that keep the queue Hauska-spine-aligned.

The Hauska spine rule from CLAUDE.md governs: workstreams that do not feed or express Hauska do not consume cycles. The commercialization queue inherits that rule; product-side stabilization and internal dogfooding sit out.

## Frame

Layer 1 is free; Layer 2 is paid per `08_tiered_access_model.md`. Every output carries reasoning chain, source citation, confidence score, timestamp regardless of tier per the "sell reasoning, not data" structural commitment. The full thesis lives in `09_post_saas_substrate_thesis.md`.

v1 canonical pricing-model composition (per `14_pricing_framework.md` close-the-loop pass 2026-05-18): Layer 2 per-call by default, optional stream subscription when call volume justifies, composition royalty deferred, reasoning-call as the unifying metaphor, marketplace dynamics future. Take-rate range settled at 1.5 to 2.5 percent; exact number sets at first paid Layer 2 call. v1 fiat rail is Stripe Connect; v1 crypto rail is USDC on Base, Ethereum, and Polygon (already built in `@hauska-sdk/payment` v0.1.0).

Hauska Inc. is the C-corp carrying commercial substrate. Corporate readiness state lives in `72_hauska_inc_operations.md`.

## Sequence

Seven steps. Order is by Hauska-spine weight, with technical and operator-decision dependencies named per step. Some steps are technically parallel-safe; the ordering reflects strategic priority, not strict gating.

### 1. Hauska MCP Server public launch (Streams 2C and 2D)

The storefront. Without it, nothing else commercializes. Stream 2C covers structured logger, Cloud Logging integration, dashboards, training-data export query, cost monitoring. Stream 2D covers containerization, Cloud Run deployment, custom domain at `mcp.hauska.dev`, docs site, cross-client testing across MCP Inspector + Claude Desktop + Claude Code + Cursor, launch artifacts, public launch coordination. Scope detailed in `51_substrate_v1_sprint.md` lines 573 through 682.

Current state: streams not started. Quality-gated 5-jurisdiction corpus (Grand County full + 3 Bastrop-network) already in place per Sync 4.5 close. `hauska.dev` registered 2026-05-18 per `72_hauska_inc_operations.md` Domains section.

Gates this step: Lane B Group 4 cross-client verification close (currently in flight per the Group 4 addendum dispatched 2026-05-19). Parallel-safe with the legacy-design-tools cutover; the two share no infrastructure.

Closes when: free-tier signup is live at `mcp.hauska.dev`, cross-client testing matrix passes, first external MCP call is captured in logs. Stream 2D hand-off as named in `51_substrate_v1_sprint.md` line 681.

First dispatch under this roadmap: `_dispatches/2026-05-19_cc-agent-M_stream_2c_2d_launch_prep.md`.

### 2. Pricing finalization (tier numbers, call quotas, signup quotes)

Take-rate range and v1 model composition are settled. Tier prices and bundled call quotas are still explicitly deferred per `14_pricing_framework.md`. Signup flow under step 3 cannot quote anything until these numbers exist.

Current state: open. Take-rate exact number deferred to first paid Layer 2 call (correct decision); per-tier price points and call quotas need to land before the paid signup flow ships.

Gates this step: Nick decision. Inputs: ICP from open decision A below, comparable-substrate price points (Plaid, Stripe, others in the substrate-not-app reference set), Bastrop revenue-share pilot data when it arrives.

Closes when: per-tier price points and bundled call quotas are written into `14_pricing_framework.md` as a new pricing tiers section.

### 3. Stream 2B Stripe + self-serve signup (Phase 8 of Sprint 51)

Layer 2 paid-tier infrastructure. Crypto rail is built per `@hauska-sdk/payment` v0.1.0. Fiat rail is the gap. Sprint 51 Phase 8 covers Stripe product + price catalog, customer signup to Stripe checkout to webhook to key mint flow per `51_substrate_v1_sprint.md` line 554.

Current state: deferred per Phase 8 scope. Single production-code TODO blocking the fiat half is Circle fiat checkout URL generation at `packages/payment/src/payment-request.ts:253` per `14_pricing_framework.md` substrate-state section.

Gates this step: step 1 live (free-tier signup must exist before paid signup makes sense), step 2 closed (signup needs prices to quote), Hauska Inc. corporate readiness on regulatory posture per `72_hauska_inc_operations.md` (banking, Tech E&O insurance, IP attorney memo).

Closes when: an external paying customer can sign up at `mcp.hauska.dev`, select a paid tier, complete Stripe checkout, receive an API key, and successfully call a Layer 2 tool.

### 4. Sync 5 corpus expansion (16+ remaining TX cities)

Per the 2026-05-19 sprint decision, Sync 5 is deferred to public-launch-sequenced demand. Under the commercialization lens this flips: Texas-statewide corpus depth IS the commercial offering, and the launch narrative is "first 20 of every state, not just TX" per `51_substrate_v1_sprint.md` line 752. Preemptive expansion past 5 jurisdictions strengthens both the launch narrative and the first-paid-contract sales motion.

Current state: corpus at 698 atoms across 5 jurisdictions (Grand County full + Bastrop UDC + Bastrop County + Elgin). Remaining 16+ TX cities sequenced per the Tier 1/2/3 ladder in `51_substrate_v1_sprint.md` line 698.

Gates this step: cc-agent-E availability post Lane A.2 close. Hard-kill cost checkpoint already cleared at 4 onboarding events per Sync 4.5 close; cost trajectory holds.

Closes when: 20-jurisdiction launch-gate threshold reached, evals pass at 1.0 / 1.0 / 1.0 across the new jurisdictions, partnership-pending tagging applied per Path A.

### 5. GTM and distribution motion

Currently unspec'd in the doc set. Stream 2D includes launch artifact drafting (HN post, ProductHunt package, social posts, BD pitch deck, PropTech-press list) but does not name channels, sequence, or owner. The substrate is a developer-facing MCP server; distribution motion is agent-builder-community-shaped, not enterprise-sales-shaped at v1.

Current state: open. Channels mentioned in Sprint 51 Stream 2D launch-prep checklist; ownership and sequencing not assigned.

Gates this step: Nick decision on the open question C below (channels, sequence, owner). Inputs: ICP from open decision A, the launch artifacts cc-agent-M produces under step 1's Stream 2D scope.

Closes when: a launch motion plan exists with named channels, named publish dates relative to step 1 completion, named owner per channel.

### 6. Partnership-pending visibility flips

Smithville, Elgin, and Bastrop County are tagged `platform-internal` per the Path A visibility partition (cc-agent-AC Lane Foundation v1.1.0). Each partnership close flips that tag to `public-free`, widening the free-tier surface area visible to anonymous callers and pulling distribution-funnel signal into the substrate. Sylvia outreach is the operator-paced channel per `73_partnerships.md`.

Under the commercialization lens this re-elevates from "deprioritized parallel bizops" to "distribution lever." Each flip is a discrete commercial-substrate improvement; the order Nick works them is the order they convert from sprint-tracked to substrate-visible.

Current state: 3 partnerships pending. Smithville additionally gated on General Code partnership API (added to `73_partnerships.md` as publisher-aggregator partnership target per the 2026-05-19 Smithville eCode360 structural defer).

Gates this step: Sylvia outreach pace (operator-led), General Code outreach for Smithville (parallel bizops).

Closes per-jurisdiction when: `accessPolicy` flips to `public-free` in the engine, `list_jurisdictions` MCP tool returns the jurisdiction to unauthenticated callers, partnership agreement signed and filed in `74_commercial_agreements.md`.

### 7. First paid Layer 2 contract

The commercial substrate proof point. Per `14_pricing_framework.md` take-rate philosophy, the exact take-rate number within the 1.5 to 2.5 percent range sets at first paid Layer 2 call rather than from modeling against zero data. This step also sets KYC/AML thresholds per `72_hauska_inc_operations.md` regulatory posture (currently gated).

Current state: zero contracts. Buyer is the agent operator per the post-SaaS substrate thesis; specific buyer profile open per decision A below.

Gates this step: steps 1, 2, and 3 live. Hauska Inc. regulatory posture cleared. ICP decision A landed (or first inbound external interest forces the question).

Closes when: external customer pays for Layer 2 substrate usage, take-rate number sets, KYC/AML thresholds land in `14_pricing_framework.md` and `72_hauska_inc_operations.md`.

## Open decisions Nick owns

Three decisions block clean progress through the queue. None can be resolved by an agent.

### Decision A: ICP for paid Layer 2

The thesis names the buyer as "agent operator" without specifying which agent operators. Three candidate ICPs surface from current portfolio context:

The Claude agent builder building permit, zoning, or jurisdictional-research workflows on top of Anthropic SDK. Individual developer or small team. Per-call pricing fits; stream subscription on power users.

The Cursor or coding-agent user building real-estate diligence, due-diligence, or site-evaluation agents. Same pricing shape as above; different channel.

The enterprise legal-tech, proptech, or AEC vendor reselling jurisdictional intelligence as a feature in their own product. Higher contract value; reseller pricing structure (volume discount, white-label terms, possible composition royalty).

The pricing tier shape under decision B depends on which of the three the v1 paid surface targets. If individual builder, simple per-tier pricing. If reseller, contract pricing with negotiation. Hybrid is possible but slower.

Recommended resolution path: pick the v1 primary ICP from the three, name the secondary as "served by same tier with light adjustment," defer the third. The MCP server launch itself produces signal on which inbound interest surfaces first; revisit decision A after step 1 ships if no clear answer emerges before then.

### Decision B: pricing tier numbers and bundled call quotas

Per the framework. Resolution depends on decision A. Once a primary ICP is named, comparable-substrate pricing references narrow (Plaid for builder ICP, Stripe Connect for reseller ICP, others) and tier numbers become a tractable decision.

Recommended resolution path: draft 2 to 3 tier numbers per the ICP choice; ratify in a working session against the substrate-not-app positioning; write into `14_pricing_framework.md` as a new "v1 tier pricing" section.

### Decision C: GTM channels, sequence, and owner per channel

Per step 5. Resolution can wait for decision A (channel selection depends on ICP), but the channels list, the timeline relative to step 1 launch, and the owner per channel each need a Nick call.

Recommended resolution path: a single working session producing a one-page launch plan that step 1 cc-agent dispatches reference; ratify before step 1 hand-off to public-launch coordination.

## What is out of scope under this lens

ECI atomization sprint (P1 registry scaffold, P2 backfill). Internal dogfood instance per `60_eci_atomization.md`; not commercialization.

Legacy-design-tools api-server import migration from `@workspace/empressa-atom` to `@hauska/atom-contract`. Named can-kick from the 2026-05-19 doc-sweep; hygiene, not commercialization. Routes to its own dedicated cc-agent session per the carry-forward.

SmartCity OS WS-1, WS-3, WS-4 stabilization remainder. Product-side state per `30a_smartcity_stabilization_sprint.md`; not Hauska.

Cortex, Codex product-surface evolution beyond what the combined Cortex/Codex sprint already shipped. Empressa product brand per CLAUDE.md identity section; not Hauska commercial substrate.

Postgres-backed StoragePort (Stream 1C prerequisite for production write). Internal substrate hygiene; sequences naturally when production write pressure arrives.

Cortex-branded subdomain DNS follow-on after legacy-design-tools cutover. Product-side, not commercial substrate.

## Sequencing rules

The Hauska spine rule from CLAUDE.md applies to every queue addition. Anything that does not advance Hauska commercialization gets queued or killed to make room per the focus queue rule.

Free-tier-first holds: step 1 ships free-tier signup, distribution motion runs under step 5, paid signup follows under step 3. Reverse ordering forces pricing decisions ahead of demand signal, which `14_pricing_framework.md` take-rate philosophy explicitly rejects.

Demand-pull applies to step 4: the 16+ TX cities batch ingest accelerates if step 1 surfaces inbound interest that names jurisdictions Hauska does not yet cover. Default cadence is "preemptive but not crash priority"; crash priority gets earned by a real demand signal.

Parallel-safe pairings: step 1 (cc-agent-M) and step 4 (cc-agent-E) can run in parallel; they share no repo. Step 2 (Nick) and step 5 (Nick) cannot run in parallel with each other; both demand the same decision attention. Step 6 (Sylvia outreach + General Code outreach) is operator-paced and parallel to everything.

Quality-gate rule from CLAUDE.md continues to apply: every commercial output (docs site copy, launch artifacts, pricing-page numbers) carries source attribution where applicable, confidence-and-timestamp posture where applicable, and structural-commitment alignment.

## Cross-references

- `09_post_saas_substrate_thesis.md` — strategic positioning that motivates the queue.
- `11_roadmap.md` — portfolio-wide roadmap; commercialization queue sits inside the Hauska band of that roadmap without duplicating it.
- `14_pricing_framework.md` — pricing-decision framework; this doc's steps 2 and 7 close open items there.
- `28_mcp_first_product_design.md` — product MCP retrofit principle; informs which product surfaces become commercial surfaces over time.
- `29_mcp_surface_tier_model.md` — tier model that step 1 ships against.
- `50_hauska_mcp_server.md` — the storefront repo; step 1 ships this.
- `51_substrate_v1_sprint.md` — Streams 2C, 2D, 2B scope detail.
- `72_hauska_inc_operations.md` — corporate-readiness state that step 3 and step 7 read.
- `73_partnerships.md` — partnership flips queue for step 6.
- `74_commercial_agreements.md` — first paid contract files here.
- `80_adrs/adr_018_atom_contract_substrate_layer.md` — substrate-layer placement.

## Revision history

- **2026-05-19 (origin):** doc seeded after the combined Cortex/Codex sprint mid-sync. Captures the post-cutover commercialization queue surfaced in the 2026-05-19 forward-planning thread. Seven steps named with current state, gating, and close criteria. Three open Nick decisions explicitly called out with recommended resolution paths. Companion dispatch for step 1 filed at `_dispatches/2026-05-19_cc-agent-M_stream_2c_2d_launch_prep.md`.
