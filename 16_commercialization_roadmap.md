---
id: 16_commercialization_roadmap
title: Commercialization roadmap — Hauska layer
status: active
last_updated: 2026-06-06
applies_to: portfolio
related: [00_current_state, 09_post_saas_substrate_thesis, 11_roadmap, 14_pricing_framework, 28_mcp_first_product_design, 29_mcp_surface_tier_model, 50_hauska_mcp_server, 51_substrate_v1_sprint, 52_mcp_offer_and_buildout, 53_hauska_sdk_completion_sprint, 72_hauska_inc_operations, 76b_gtm_engine_polish_sprint, 80_adrs/adr_018_atom_contract_substrate_layer, 80_adrs/adr_019_layered_code_substrate, _decisions/2026-05-21_hauska_commercialization_sprint, _decisions/2026-05-28_gtm_engine_polish_sprint, _decisions/2026-06-06_v1_tier_pricing_decision_b]
owner: nick
---

# Commercialization roadmap — Hauska layer

> **Forward-execution queue.** What advances Hauska commercialization. Spans launch infrastructure, pricing finalization, payment substrate wire-up, corpus depth, distribution, partnership flips, and first paid contract. Does not duplicate `11_roadmap.md` (portfolio surfaces) or `14_pricing_framework.md` (pricing decision framework); this doc sequences the Hauska-spine commercial activation that those two and `51_substrate_v1_sprint.md` Streams 2C/2D/2B feed into.

> **Execution status (2026-05-21).** The combined Cortex/Codex sprint cutover is complete. This queue is now in execution as the Hauska commercialization sprint per [`_decisions/2026-05-21_hauska_commercialization_sprint.md`](_decisions/2026-05-21_hauska_commercialization_sprint.md): a two-wave, one-agent-per-repo, maximum-autonomy sprint. Wave 1 (steps 1 and 4, decision-independent) is dispatched to cc-agent-M and cc-agent-E. Wave 2 (steps 2, 3, 5, 7, decision-gated) follows. Decision A (ICP) is ratified as agent builders; decisions B and C have ratified shapes with numbers and channel plan pending. The sprint decision record is the live execution authority; this doc is the standing queue rationale.

## Why this exists

The substrate v1 sprint shipped the catalog substrate. The combined Cortex/Codex sprint shipped the L-surface atom shapes, MCP product tools, and product-surface modernization. Once cutover lands, the operator's next strategic question is "how does Hauska start producing revenue." That question is currently spread across `51_substrate_v1_sprint.md` Streams 2C/2D/2B (infra), `14_pricing_framework.md` (model and open questions), `72_hauska_inc_operations.md` (corporate readiness), and `28_mcp_first_product_design.md` (product MCP retrofit). This doc names the sequence across those, flags the three open decisions Nick owns, and sets the rules that keep the queue Hauska-spine-aligned.

The Hauska spine rule from CLAUDE.md governs: workstreams that do not feed or express Hauska do not consume cycles. The commercialization queue inherits that rule; product-side stabilization and internal dogfooding sit out.

## Frame

Layer 1 is free; Layer 2 is paid per `08_tiered_access_model.md`. Every output carries reasoning chain, source citation, confidence score, timestamp regardless of tier per the "sell reasoning, not data" structural commitment. The full thesis lives in `09_post_saas_substrate_thesis.md`.

v1 canonical pricing-model composition (per `14_pricing_framework.md` close-the-loop pass 2026-05-18): Layer 2 per-call by default, optional stream subscription when call volume justifies, composition royalty deferred, reasoning-call as the unifying metaphor, marketplace dynamics future. Take-rate range settled at 1.5 to 2.5 percent; exact number sets at first paid Layer 2 call. v1 fiat rail is Stripe Connect; v1 crypto rail is USDC on Base, Ethereum, and Polygon (already built in `@hauska-sdk/payment` v0.1.0).

Hauska Inc. is the C-corp carrying commercial substrate. Corporate readiness state lives in `72_hauska_inc_operations.md`.

## Build-out lane (precedes the launch steps)

Added 2026-06-06 per [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md). A wave of cortex-api and engine work shipped that the commercial surface does not yet express, and the SDK commerce rail is unfinished. Before the launch steps below can produce revenue, two pieces of build-and-test work land first. This lane gates step 3 (paid signup) and the public-launch portion of steps 1 and 5; it does not move anything toward public launch on its own.

**Build-out 1: Tier 1 MCP build-out.** Wrap the shipped property, hydrology, topography, and encumbrance engines as Layer 2 cortex tools, leading with `generate_property_brief`, which makes the wedge itself agent-callable. Specs verified against the live engine surface in `52` §3a. Two dispatches: cc-agent-M (the tool wraps in `hauska-mcp-server`) and cc-agent-C (the cortex-api service-auth and metering seam the brief endpoint needs). The Cotality data tier rides the same dispatch but ships dark until the CoreLogic credential clears. The site-context single tools are de-scoped as redundant with the already-public place tools.

**Build-out 2: SDK completion.** Finish the Hauska SDK so a Layer 2 paid call transacts: Circle fiat rail, revenue routing and source-actor split, MCP-gate metering, tested. Plan and acceptance criteria in [`53_hauska_sdk_completion_sprint.md`](53_hauska_sdk_completion_sprint.md). This is the same work as step 3's fiat-rail gap, now scoped as a sprint; step 3 closes when it lands.

**Decision C stays pinned.** Per the recommended sequence in `52` §5: capture, then Tier 1 build-out, then finish the SDK, then unpin Decision C and launch. Decision C remains drafted but pinned in [`_catalog/ops/gtm_launch_channel_plan_v1.yaml`](_catalog/ops/gtm_launch_channel_plan_v1.yaml) until the build-out lands; nothing in this lane unpins it.

## Sequence

Seven steps. Order is by Hauska-spine weight, with technical and operator-decision dependencies named per step. Some steps are technically parallel-safe; the ordering reflects strategic priority, not strict gating. The build-out lane above precedes the launch portions of these steps.

### 1. Hauska MCP Server public launch (Streams 2C and 2D)

The storefront. Without it, nothing else commercializes. Stream 2C covers structured logger, Cloud Logging integration, dashboards, training-data export query, cost monitoring. Stream 2D covers containerization, Cloud Run deployment, custom domain at `mcp.hauska.dev`, docs site, cross-client testing across MCP Inspector + Claude Desktop + Claude Code + Cursor, launch artifacts, public launch coordination. Scope detailed in `51_substrate_v1_sprint.md` lines 573 through 682.

Current state: dispatched as Lane M of the commercialization sprint. The MCP server is feature-complete on the tool side (35 product-gated plus 5 public catalog tools) and is now deployed: Streams 2C and 2D are complete and the server is live on Cloud Run in `hauska-prod`, wired to the production retrieval API and verified end to end. The custom domain `mcp.hauska.dev` and the GTM publication are the remaining operator-gated residuals. Catalog at 2702 atoms across 5 jurisdictions as of the Hutto rollup; the public-free subset deepens decisively when Lane E Phase E1 lands the Layer 1 model-code base. `hauska.dev` registered per `72_hauska_inc_operations.md`. The combined Cortex/Codex cutover is complete and Group 4 cross-client behavior is de-risked by the cutover smoke matrix; the formal cross-client pass folds into Stream 2D against the deployed surface.

Closes when: the server is deployed at `mcp.hauska.dev` over managed TLS, observability is live, the docs site is live, the cross-client matrix passes, and the public catalog tools are wired to the deployed retrieval API. The GTM publication that produces the first external call is operator-gated and Wave 2.

Live dispatch: [`_dispatches/2026-05-21_cc-agent-M_commercialization_streams_2c_2d.md`](_dispatches/2026-05-21_cc-agent-M_commercialization_streams_2c_2d.md) (supersedes the 2026-05-19 launch-prep dispatch).

### 2. Pricing finalization (tier numbers, call quotas, signup quotes)

Take-rate range and v1 model composition are settled. Tier prices and bundled call quotas are still explicitly deferred per `14_pricing_framework.md`. Signup flow under step 3 cannot quote anything until these numbers exist.

Current state: open. Take-rate exact number deferred to first paid Layer 2 call (correct decision); per-tier price points and call quotas need to land before the paid signup flow ships.

Gates this step: Nick decision. Inputs: ICP from open decision A below, comparable-substrate price points (Plaid, Stripe, others in the substrate-not-app reference set), Bastrop revenue-share pilot data when it arrives.

Closes when: per-tier price points and bundled call quotas are written into `14_pricing_framework.md` as a new pricing tiers section.

### 3. Stream 2B Circle + self-serve signup (Phase 8 of Sprint 51)

Layer 2 paid-tier infrastructure. Crypto rail is built per `@hauska-sdk/payment` v0.1.0. Fiat rail is the gap. Sprint 51 Phase 8 covers the Circle product and price catalog, customer signup to Circle checkout to webhook to key mint flow per `51_substrate_v1_sprint.md` line 554.

Current state: scoped as a sprint. The fiat rail is Circle per [`_decisions/2026-05-21_fiat_rail_circle.md`](_decisions/2026-05-21_fiat_rail_circle.md), and it is a near-greenfield build, not a single TODO: the 2026-06-06 recon re-confirmed no Circle payment creation, webhook handling, or verification in the SDK, only a placeholder checkout-URL function, and no revenue-routing code anywhere. The full plan, with the five-item punch list and acceptance criteria, is [`53_hauska_sdk_completion_sprint.md`](53_hauska_sdk_completion_sprint.md) (build-out lane above). Decision B tier numbers are now ratified ([`_decisions/2026-06-06_v1_tier_pricing_decision_b.md`](_decisions/2026-06-06_v1_tier_pricing_decision_b.md)), so the signup flow can quote. See `14_pricing_framework.md` substrate-state section.

Gates this step: step 1 live (free-tier signup must exist before paid signup makes sense), step 2 closed (signup needs prices to quote), Hauska Inc. corporate readiness on regulatory posture per `72_hauska_inc_operations.md` (banking, Tech E&O insurance, IP attorney memo).

Closes when: an external paying customer can sign up at `mcp.hauska.dev`, select a paid tier, complete Stripe checkout, receive an API key, and successfully call a Layer 2 tool.

### 4. Sync 5 corpus expansion (ADR-019 layered substrate + remaining TX cities)

Texas-statewide corpus depth is the commercial offering. ADR-019 (layered code substrate, accepted 2026-05-21) restructured the economics: the model-code base, the ICC I-Codes and the NEC, is ingested once and amortized across the whole catalog, and each new city becomes a cheap Layer 2 amendment-overlay plus Layer 3 zoning ingest. The Layer 1 model-code base is itself `public-free` substrate and is arguably the highest-value public content for the agent-builder ICP.

Current state: dispatched as Lane E of the commercialization sprint, three phases: E0 deploy the retrieval API, E1 build the ADR-019 pipeline and ingest the Layer 1 model-code base, E2 onboard the remaining ~20 TX cities. Catalog at 2702 atoms across 5 jurisdictions as of the Hutto rollup.

Gates this step: none blocking; cc-agent-E has capacity. Hard-kill cost checkpoint cleared at the Sync 4.5 and Hutto onboardings; ADR-019 improves the cost trajectory further.

Path A constraint (load-bearing, from the sprint pre-mortem): every non-partnered jurisdiction is tagged `platform-internal`; partnership-flip is the only path to `public-free`. The Layer 1 model-code base is `public-free` by design.

Closes when: the layered pipeline is built, the Layer 1 base is ingested and public-free, and the TX city ladder is worked, each city either eval-passing and Path-A-tagged or explicitly deferred with its blocker named.

Live dispatch: [`_dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5.md`](_dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5.md).

### 5. GTM and distribution motion

**Active execution:** [`76b_gtm_engine_polish_sprint.md`](76b_gtm_engine_polish_sprint.md) (2026-05-28). Unifies agent discoverability (`hauska.dev/mcp`, registries, `llms.txt`), MCP observation in `gtm_events`, place read MCP tools, and steward digests. Decision record: [`_decisions/2026-05-28_gtm_engine_polish_sprint.md`](_decisions/2026-05-28_gtm_engine_polish_sprint.md). Channel scaffold: [`_catalog/ops/gtm_launch_channel_plan_v1.yaml`](_catalog/ops/gtm_launch_channel_plan_v1.yaml). Public honesty: [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](_catalog/ops/gtm_public_capability_matrix_v1.yaml).

Current state: **in flight** (Lane M/C/P dispatches filed). Stream 2D launch-artifact **drafts** remain cc-agent-M scope; **publish** is operator-gated.

Gates this step: Nick completes decision C in `gtm_launch_channel_plan_v1.yaml` (N1 session); DNS + directory submit (N2–N3).

Closes when: sprint exit E1–E12 in `76b` met, including first external MCP caller in prod logs and launch plan dates filled.

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

Three decisions. **Status as of 2026-05-21 per [`_decisions/2026-05-21_hauska_commercialization_sprint.md`](_decisions/2026-05-21_hauska_commercialization_sprint.md):** Decision A is ratified (agent builders). Decisions B and C have ratified shapes (free plus two self-serve paid tiers; developer-community distribution); the tier numbers and the channel plan are pending working sessions and gate Wave 2, not Wave 1. The original framing of all three is retained below as rationale.

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

- **2026-06-06:** Build-out lane added ahead of the launch steps per [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md): Tier 1 MCP build-out (cc-agent-M tool wraps plus cc-agent-C cortex-api seam) and SDK completion ([`53_hauska_sdk_completion_sprint.md`](53_hauska_sdk_completion_sprint.md)) land before the launch portions of steps 1, 3, and 5. Decision C confirmed pinned until the lane lands. Step 3 rescoped from "deferred" to "scoped as a sprint" pointing at 53; Decision B tier numbers noted ratified, unblocking signup quoting. Frontmatter `related` extended with 52, 53, and the Decision B record.
- **2026-05-28:** Step 5 cross-linked to active GTM engine polish sprint ([`76b_gtm_engine_polish_sprint.md`](76b_gtm_engine_polish_sprint.md)); capability matrix and launch channel plan paths confirmed in step body (Lane P planner sign-off).
- **2026-05-21:** Queue moved into execution as the Hauska commercialization sprint per [`_decisions/2026-05-21_hauska_commercialization_sprint.md`](_decisions/2026-05-21_hauska_commercialization_sprint.md). Execution-status banner added. Decision A ratified (agent-builder ICP); decisions B and C shapes ratified. Step 1 refreshed for post-cutover reality (server feature-complete, Group 4 de-risked by cutover, 2414-atom corpus). Step 4 rewritten to integrate ADR-019 layered code substrate and the Path A load-bearing constraint from the sprint pre-mortem. Wave 1 dispatches filed for cc-agent-M (Streams 2C/2D) and cc-agent-E (ADR-019 pipeline plus Sync 5); the 2026-05-19 launch-prep dispatch is superseded. `related` extended with ADR-019 and the sprint decision record. Reconciliation update (same day): catalog total corrected to 2702 (the 2414 tally omitted code-edition and cross-reference atoms); step 1 current-state marked deployed after Streams 2C and 2D completed; step 3 fiat rail changed from Stripe to Circle per [`_decisions/2026-05-21_fiat_rail_circle.md`](_decisions/2026-05-21_fiat_rail_circle.md).
- **2026-05-19 (origin):** doc seeded after the combined Cortex/Codex sprint mid-sync. Captures the post-cutover commercialization queue surfaced in the 2026-05-19 forward-planning thread. Seven steps named with current state, gating, and close criteria. Three open Nick decisions explicitly called out with recommended resolution paths. Companion dispatch for step 1 filed at `_dispatches/2026-05-19_cc-agent-M_stream_2c_2d_launch_prep.md`.
