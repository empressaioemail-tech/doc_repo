---
id: 14_pricing_framework
title: Pricing framework â Path A vs Path B
status: active
last_updated: 2026-06-09
applies_to: portfolio
related: [10_ground_truth, 11_roadmap, 16_commercialization_roadmap, 30_smartcity_os, 40_design_accelerator, 55_spine_data_intelligence_stack, 08_tiered_access_model, _decisions/2026-06-07_full_engine_extraction_and_data_packages, 80_adrs/adr_018_atom_contract_substrate_layer]
---

# Pricing framework â Path A vs Path B

> **Operational guide.** Use this when scoping a customer proposal.
> Not a sales playbook â a decision framework for how to price a
> piece of work given the buyer's profile and the product's market
> position. Edit in place as the framework evolves.
>
> **Origin:** extracted 2026-05-05 from Section 10.2 of
> `04_strategic_conversation_record.md` (April 2026 strategic
> planning arc). Original archived at
> [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md).

## When this applies

Any proposal where:

- The customer has a budget anchor (an emotional or stated price
  expectation)
- The work scope can plausibly stretch or shrink without breaking
  what gets delivered
- We have a choice between hitting the buyer's anchor by tightening
  scope vs. pricing the realistic full-scope work

The framework was developed during the April 2026 Bastrop roadmap
pricing exercise. The 2026-05-05 Sylvia $1M proposal pushback is the
live test case: she's signaling sticker shock at a number, asking
for a path forward, and not pulling out. Path A is the right answer
for that conversation; the framework explains why.

## Path A â tighten scope, keep pricing familiar to the buyer

Price each phase against the buyer's emotional price anchor (what
they expect to pay for a piece of work). Explicitly name what's in
and out of each phase. Expansion happens through change orders with
their own scope and pricing.

**Appropriate when:**

- The customer is a price-sensitive smaller-budget account
- The product is pre-scale and reference customers matter more than
  maximum contract value
- Trust and a first contract matter more than the full-scope
  outcome in this engagement
- Change orders are a normal part of the customer's procurement
  pattern (true for municipal work)

**Trade-offs:**

- Lower realized contract value in this deal
- Phase boundaries become harder than ideal â what's in vs. out of
  Phase 1 has to be explicit and defensible
- Risk that change orders don't materialize and Phase 2+ never
  gets funded
- Pressure to under-scope Phase 1 to hit the anchor; resist this

## Path B â price at honest scope-calibrated ranges

Price each phase at what the work actually costs given realistic
scope. Total may exceed the buyer's initial emotional price anchor.

**Appropriate when:**

- The customer has the budget (large city, well-funded project,
  enterprise procurement)
- The work is complex enough that scope tightening creates hidden
  risk (e.g., compliance work where a compressed Phase 1 produces a
  result that fails audit)
- The proposal is being used to establish a market price point for
  a new product
- The customer has indicated they want full-scope execution and are
  evaluating on capability, not price

**Trade-offs:**

- Higher chance of losing the deal entirely if the anchor mismatch
  is large
- Stronger contract structure if won â phase 2+ likelihood is
  higher because the scope was honest in phase 1
- Establishes a higher market reference price that helps subsequent
  deals

## Defaults

| Customer segment | Default | Rationale |
|---|---|---|
| Municipal accounts | **Path A** | Small-city budgets have anchor pressure; change orders are a normal procurement pattern; landing first contract creates references for higher-priced subsequent engagements |
| Enterprise / well-funded | **Path B** | Anchor pressure is lower; honesty about scope reduces phase-2 risk |
| Empressa Land + future B2B products | **Gated on first paid engagement** | Pricing for these products is not yet settled; first paid engagement sets the precedent. Same gating shape as the Open-questions section. |
| AEC firms (Design Accelerator B2B) | **Gated on Codex 1a pilot conversion** | Customer-zero is Empressa; external pricing resolves with the cross-surface pricing Open-question item. |

## Application â Sylvia $1M proposal (live, 2026-05-05)

Path A applies. Sylvia has signaled three things in her email:

1. **Anchor mismatch is real** â "$1M has me falling out of my chair."
2. **She wants a path forward** â explicitly. "Lets work to find common ground."
3. **The relationship is intact** â TML award submission, TCMA/ICMA
   "ALL in" framing.

The Path A move:

- Phase the work. Y1 anchored on what's load-bearing for Bastrop
  (probably the 5-product suite components already live + the
  highest-priority next pieces).
- Y2-Y3 expansion via change orders for the rest.
- Don't drop Y1 prices to hit a smaller anchor; tighten Y1 scope.
- Walk her through the line items in a working session â the
  number should resolve to "this work, this year, this price"
  rather than "$1M for everything blob."

What Path A explicitly does NOT do:

- Discount the per-line-item rate. The rate reflects what the work
  costs.
- Bundle features she wasn't asking for.
- Negotiate by email. The conversation goes to a working session.

## Pitch discipline (from the same strategic record)

Cross-reference: Section 10.3 of the original strategic record
("Pitch discipline â what not to claim") covered honest claim
discipline for pitches. That content extracts to a separate doc if
sales materials become a workstream needing it; for now it lives in
the archived record.

The relevant principle for pricing conversations: **claim what's
true and exciting, not what would be true if certain things were
true.** In a pricing conversation, this means: don't promise
features that depend on yet-to-ship work as if they're in the
proposal. Phase boundaries respect what's actually shippable.

## Cross-surface pricing â gated on Codex 1a + 1b pilot conversion

The fabric framing introduces multi-surface customers:
- A city like Bastrop runs SmartCity OS + Codex 1b standalone
  in one deployment.
- A contractor firm runs Codex 1a invited mode (commercial
  product, separate sale).
- Future: an architect firm runs Design Accelerator while
  reviewing through a city using SmartCity OS + Codex 1b.

Pricing framework extension needed for:
- Synergy / discount logic for customers buying multiple
  surfaces vs. independent pricing per surface
- Cross-surface bundle defaults vs. Ã -la-carte
- Contractor-firm-to-city pricing relationship (does the firm's
  Codex 1a usage on a city's behalf imply a city-side pricing
  effect?)

Resolution pending pilot conversion data from Codex 1a (firms)
and Codex 1b (cities). See
[`47_codex_plan_review.md`](47_codex_plan_review.md) for product
context.

## SDK as payment substrate

The 2026-05-16 strategic brainstorm session extended the catalog thesis from "data catalog" to "data catalog plus payment substrate." This section captures the principle commitment; implementation is phased and not currently active work.

### Principle

The Hauska SDK is the payment substrate for atom transactions. When agents consume atoms via the Hauska MCP Server, micropayments flow through the SDK back to the paid source actors of those atoms (content licensors such as ICC / NFPA, firms, professionals). This routes revenue to paid sources mechanically rather than only by contract. (Note 2026-06-09: partnership-first sourcing was retired as a structural commitment; the city-operational-data revenue-share rationale is gone. The rail itself survives for content-licensing and firm models. Whether the SDK source-actor routing is retained as a commercial mechanism is a separate decision, flagged in `_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`.)

**Implementation status (2026-05-21).** This is the designed model, not yet the running state. The crypto settlement rail is built and tested in `@hauska-sdk/payment` (one of twelve published `@hauska-sdk/*` packages). The revenue-routing layer that splits a micropayment and routes the source-actor share back does not yet exist: the 2026-05-21 cross-repo reconciliation found no routing, payout, or split code in any `@hauska-sdk/*` package. Revenue share is designed and its settlement components are partially present; it is not yet substrate-enforced. Until the routing layer ships, revenue share is contractually promised, and partner-facing and BD materials must say so.

Repositioning: Hauska is "Plaid for jurisdiction-grounded physical-world data" plus "Stripe for atom transactions in that domain."

### Commercial model

Usage-based pricing replaces SaaS per-seat pricing as the commercial model for agent consumption. Five composing models are available; **v1 canonical composition is a settled subset** (promoted from "most likely outcome" to v1 canon 2026-05-18):

- **Per-atom-access** (small fee per MCP call, routed to source actor) â v1 default for Layer 2 paid.
- **Stream subscription** (recurring fee, revenue-shared) â v1 optional upsell when call volume justifies; the agent-developer's choice.
- **Composition royalty** (percentage of derivative product revenue) â deferred to derivative products that do not yet exist.
- **Reasoning-call pricing** (aligned with "sell reasoning not data") â unifying metaphor across all paid surfaces; the unit of paid metering even when packaged as per-call or stream.
- **Marketplace dynamic pricing** (flexible, operationally complex) â genuinely future, 18 to 36 months out.

**v1 canonical:** Layer 1 free; Layer 2 per-call by default with optional stream subscription when call volume justifies; composition royalty deferred; reasoning-call as unifying frame; marketplace dynamics future.

### Entity structure

Hauska Inc. is a separate C-corp, already established. Hauska Inc. carries the payment-bearing operations and the regulatory posture (money transmitter status, KYC/AML, tax reporting, escheatment as applicable). Legacy Group ATX LLC and Empressa product brands sit cleanly above Hauska Inc. with payment substrate isolated.

### Settlement model

Hybrid fiat and stablecoin processor. Fiat settlement for traditional counterparty preferences (cities, firms with conservative compliance postures); stablecoin rails for high-volume, low-friction micropayment flows and for agent-to-agent transactions in future phases.

**v1 fiat rail: Circle** (selected 2026-05-21 per [`_decisions/2026-05-21_fiat_rail_circle.md`](_decisions/2026-05-21_fiat_rail_circle.md), superseding the Stripe Connect placeholder pinned 2026-05-18). The 2026-05-21 hauska-sdk reconciliation found the SDK payment package already built Circle-shaped, with a hardcoded `provider: "circle"` and no Stripe code; the decision follows the code reality. Circle is also USDC-native, so it unifies the fiat rail with the existing USDC crypto rail under one provider. Revisit trigger is a regulatory or onboarding blocker surfaced in Hauska Inc. corporate-readiness work, or a fiat-preferring counterparty at first paid Layer 2 call requiring a rail Circle cannot serve.

**v1 crypto rail: USDC on Base, Ethereum, and Polygon** â already built in `@hauska-sdk/payment` v0.1.0 (56 tests green; on-chain verification via ethers v6) per the substrate-state subsection above. No further rail-selection work pending on the crypto side.

### Take rate philosophy

Lower than the current SaaS landscape. Software pricing is in deflationary regime as production costs fall toward compute costs. Hauska's value is in being the substrate everyone runs on, which compounds. Maximizing rent per transaction is not the optimization target; volume and adoption are.

**Settled v1 range: 1.5 to 2.5 percent depending on transaction type** (closed 2026-05-18). Below the 3 percent card-processing benchmark and well below app-store 30 percent matches the substrate-not-rent positioning of the post-SaaS thesis; floor stays above the Circle fiat-passthrough overhead so the fiat rail does not run at a loss. The exact number within the range sets at first paid Layer 2 call rather than from modeling against zero data.

### v1 tier pricing (Layer 2 access) — Decision B

Ratified 2026-06-06 per [`_decisions/2026-06-06_v1_tier_pricing_decision_b.md`](_decisions/2026-06-06_v1_tier_pricing_decision_b.md), closing the deferred tier-prices/quotas decision and `16_commercialization_roadmap.md` step 2. Shape is free plus two self-serve paid tiers for the agent-builder ICP (Decision A). These are the access prices the builder pays Hauska for Layer 2 calls; the 1.5–2.5% take rate is the separate source-actor routing cut.

| Tier | Price | Layer 2 calls bundled | Overage | Audience |
|---|---|---|---|---|
| Free / Developer | $0 | Layer 1 unlimited; 100 Layer 2 calls/mo (hard cap) | none | evaluate + build |
| Builder (metered) | $49/mo | 1,000 Layer 2 calls/mo | $0.04/call | indie dev / small agent app |
| Pro (stream) | $199/mo | 10,000 Layer 2 calls/mo + stream subscription to a jurisdiction/corpus | $0.02/call | power users / production agents |

Rationale: $0.04/call undercuts the Regrid ~$0.25/parcel reference ~6x so a builder reselling into a $20/mo consumer app keeps margin; the 100 free Layer 2 calls are acquisition cost per the positioning framework wide-surface logic; the Pro stream tier expresses substrate-not-rent. All three numbers revisit at first paid-call signal per the take-rate philosophy above.

### Substrate state — code reality vs integration work

The 2026-05-16 framing treated the SDK payment substrate as principle-committed and entirely future-phased work. The 2026-05-18 SDK recon and re-verification (see ADR-018 follow-on for context) established that the on-chain half of the substrate is substantially built and the bottleneck is integration plus operational posture, not core SDK code. The accurate state breakdown follows.

Built today in `@hauska-sdk/payment` v0.1.0 (verified 2026-05-18 against `p:\Hauska SDK`; 56 tests passing across five test files):

- x402-protocol payment-request signing via EIP-712 typed-data (`packages/payment/src/payment-request.ts`).
- On-chain payment verification via ethers v6 with provider abstraction (`packages/payment/src/payment-verification.ts`).
- Wallet integration for request signing (`packages/payment/src/wallet-integration.ts`).
- Payment storage / transaction-record substrate (`packages/payment/src/payment-storage.ts`).
- PaymentSDK orchestrator wiring the above together (`packages/payment/src/PaymentSDK.ts`).
- USDC stablecoin support across Base (chainId 8453), Ethereum (chainId 1), and Polygon (chainId 137) per chain-ID table at `packages/payment/src/payment-request.ts:267-273`.
- Vitest coverage: payment-storage 15 tests, payment-request 8, wallet-integration 11, payment-verification 7, PaymentSDK 15.
- Publish-ready posture: `prepublishOnly: "npm run build"` + npmjs.org publish target in `packages/payment/package.json`.

The crypto rail is operationally complete at the SDK code level.

Remaining as code-level work inside the SDK:

- **The fiat rail is a near-greenfield build, not a single TODO.** The 2026-05-21 hauska-sdk reconciliation corrected the earlier "sole TODO" framing: there is no Circle payment creation, no webhook handling, and no Circle-side payment verification. What exists is a placeholder `generateFiatCheckoutUrl()` at `packages/payment/src/payment-request.ts:253` that silently returns a fake `checkout.circle.com` URL rather than throwing. Provider is settled as Circle per [`_decisions/2026-05-21_fiat_rail_circle.md`](_decisions/2026-05-21_fiat_rail_circle.md); the full integration is Wave 2 step 3.
- **The revenue-routing layer does not exist.** The reconciliation found no routing, payout, or split code in any `@hauska-sdk/*` package. The layer that splits a micropayment and routes the source-actor share back is unbuilt. This is the gap behind the "substrate-enforced revenue share" thesis claim; see the Principle subsection's implementation-status note.

Remaining as integration-and-operational work outside the SDK:

- Atom-contract licensing-metadata and accessPolicy source-actor fields. The `accessPolicy` four-value union shipped in `@hauska/atom-contract` v1.1.0; dedicated source-actor and licensing-metadata fields are still unbuilt. These are the data half of source-actor revenue routing per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md); the code half is the SDK routing layer noted above.
- Hauska MCP Server metering wire-up. The server consumes `@hauska-sdk/payment` at the tool-call layer for Layer 2 paid calls per [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md); sequenced after both M2-C extraction and the dedicated repo at [`empressaioemail-tech/hauska-mcp-server`](https://github.com/empressaioemail-tech/hauska-mcp-server) (bootstrapped 2026-05-18) gains its first backend connection.
- Bastrop revenue-share contract operationally tested with manual reconciliation. Gates first real money movement and informs the operational shape before the SDK rails switch on for production traffic.
- Hauska Inc. regulatory posture. Money transmitter registration per state and KYC/AML thresholds, now driven by Circle's onboarding and compliance requirements rather than Stripe's. Settlement-rail selection is settled: Circle for fiat, USDC stablecoin on the three live chains for crypto. Org and legal work, not SDK code.
- Marketplace dynamics. Dynamic pricing, agent-to-agent atom transactions, the broader payment-substrate vision. Genuinely future work, 18–36 month horizon.

Verification artifact: SDK recon `p:\Hauska SDK\RECON_2026-05-18.md`; re-verification 2026-05-18 by direct reads of `packages/payment/package.json`, `packages/payment/src/payment-request.ts` (lines 250–273), and `npm test --workspace=@hauska-sdk/payment` (56 passed in 783ms).

### Open questions

Three items remain after the 2026-05-18 close-the-loop pass. Five prior items resolved or rephrased; see revision history.

- **Regulatory posture details** (money-transmitter requirements per state; KYC/AML thresholds). Resolves when the Texas IP attorney memo is delivered AND Hauska Inc. operating banking is established. Both items tracked in `72_hauska_inc_operations.md` (70-band, in design 2026-05-18). Watch state, not undefined work.
- **Cross-surface pricing** (synergy/discount logic; bundle vs Ã -la-carte defaults; contractor-firm-to-city pricing relationship). Resolves when both Codex 1a (firms) and Codex 1b (cities) pilot conversion datasets land. Same gating applies to the "Revisit when market signal" rows in the Defaults table.
- **Adversarial agent mitigations.** Architecturally settled as signed SDK builds plus attestation plus accessPolicy enforcement. Implementation gated to first paid Layer 2 revenue; not active work until the metering wire-up clears.

### References

- 09_post_saas_substrate_thesis.md (strategic positioning that motivates this model)
- 28_mcp_first_product_design.md (product line architecture that produces the consumption events)
- 50_hauska_mcp_server.md (the enforcement surface)
- ADR-017 (atom access control; accessPolicy field carries source actor routing)
- ADR-013 (procedure-execution atoms; the unit of metering)
- Session origin: _sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md

## Spine COGS (cost floor for pricing)

All-inclusive monthly cost of running the Hauska spine, verified against live infra 2026-06-07. Full inventory and evidence: [`55_spine_data_intelligence_stack.md`](55_spine_data_intelligence_stack.md) Section 9.

| Category | Monthly | Confidence |
|---|---|---|
| Compute (Cloud Run: retrieval-api + mcp-gate min-1 warm + cortex-api 2vCPU/8Gi) | $500-875 | Med |
| Data (Neon x3) | $150-350 | Med |
| Storage (GCS objects + logs) | $50-150 | Low-Med |
| External APIs (Cotality unknown tier, ICC partnership TBD, Regrid eval; FEMA/USGS/EPA/NOAA/FCC/USDA free) | $500-5,650+ | Low (dominant uncertainty) |
| LLM runtime (Grok-first + Anthropic fallback) | $20-60 | Med |
| Other (Cloud Build, Upstash, Secret Manager, Artifact Registry, domain, logging) | $30-90 | Med |
| **Fixed spine total** | **~$1,250-7,200/mo** (midpoint ~$3-4k excluding Cotality/ICC) | |
| Per-jurisdiction onboard (variable) | ~$1-2k LLM + 60-100 person-hours across first 30 cities, amortizing toward the under-$200-compute + 1hr-review target | Med |

Pricing implications: the fixed floor (compute + Neon, ~$700-1,200) is manageable and LLM is cheap until call volume scales. Cotality is the swing factor and can multiply COGS on its own, so it is the binding constraint on any Cotality-backed Layer 2 SKU. Discipline: sell reasoning (LLM, the margin), price third-party raw data (Cotality) at floor as pass-through, and do not finalize a Cotality-backed SKU price until the Cotality production tier is known. This feeds the deferred tier-prices decision (step 2 of the commercialization queue).

**Decision B reshape (2026-06-07).** The tier model is being reframed from generic SaaS price points into composable data packages (Subsurface, Hydrology, Parcel/property, Code/plan-review, Environmental) crossed with the access layer (L1 free public baseline, L2 paid calibrated reasoning), per [`08_tiered_access_model.md`](08_tiered_access_model.md) and [`_decisions/2026-06-07_full_engine_extraction_and_data_packages.md`](_decisions/2026-06-07_full_engine_extraction_and_data_packages.md). Decision B's $0 / $49 / $199 points become package-composed rather than flat tiers; the exact package prices are an open operator decision, floored by the spine COGS above (and, for any Cotality-backed package, by the Cotality production tier). The binding constraint holds: a package's L2 sells reasoning over the domain, not raw-data resale.

## Cross-references

- [`30_smartcity_os.md`](30_smartcity_os.md) â SmartCity OS
  customer context (Sylvia, Bastrop, Jarrell pipeline)
- [`13_risk_register.md`](13_risk_register.md) â Risk 5
  (single-customer) and Risk 6 (velocity tax) inform pricing
  posture
- [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md)
  â original record (Section 10.2 source, plus Section 10.3 pitch
  discipline material if needed)
- [`11_roadmap.md`](11_roadmap.md) â open commercial questions
  (per-city price envelope for deal #2; tenth-deal economics)
- [`16_commercialization_roadmap.md`](16_commercialization_roadmap.md): post-cutover Hauska-layer commercialization sequencing. Step 2 of that queue closes this framework's deferred tier-prices and bundled-call-quotas decision; step 7 closes the take-rate-exact-number decision at first paid Layer 2 call.

## Revision history

- **2026-06-07:** Added "Spine COGS (cost floor for pricing)" section with the all-inclusive monthly cost table (verified against live infra; full inventory in 55_spine_data_intelligence_stack.md). Flags Cotality as the binding pricing constraint and sets the discipline: sell reasoning, price raw third-party data at floor, do not finalize a Cotality-backed SKU price until the production tier is known. Added the Decision B reshape note: tiers reframed into composable data packages x access layer per 08 + the 2026-06-07 extraction/data-packages decision. Frontmatter `related` extended (55); `last_updated` bumped. No change to Path A/B or the SDK section.
- **2026-05-21:** Fiat rail changed from the Stripe Connect placeholder to Circle per [`_decisions/2026-05-21_fiat_rail_circle.md`](_decisions/2026-05-21_fiat_rail_circle.md), following the cross-repo reconciliation finding that the hauska-sdk payment package is already built Circle-shaped. Substrate-state section corrected: the fiat rail is a near-greenfield build, not a single TODO, and the revenue-routing layer does not exist in the SDK. Principle subsection gains an implementation-status note reframing substrate-enforced revenue share as designed but not yet enforced. Take-rate-philosophy and regulatory-posture lines re-pointed from Stripe Connect to Circle.

- **2026-05-19:** Cross-reference added to new [`16_commercialization_roadmap.md`](16_commercialization_roadmap.md) (post-cutover Hauska-layer commercialization sequencing). Step 2 of the commercialization queue closes this framework's deferred tier-prices and bundled-call-quotas decision; step 7 closes the take-rate-exact-number decision at first paid Layer 2 call. Frontmatter `related` extended; no body changes outside the cross-references section.
- **2026-05-18 (close-the-loop pass):** Four prior Open-question items resolved with binary calls. Take-rate range settled at 1.5 to 2.5 percent for v1 with exact number set at first paid Layer 2 call. Pricing-model composition promoted from "most likely outcome" to v1 canon (Layer 1 free; Layer 2 per-call default with optional stream upsell; composition royalty deferred; reasoning-call as unifying frame; marketplace dynamics future). Stripe Connect pinned as v1 fiat-rail candidate; crypto rail already built in `@hauska-sdk/payment` v0.1.0. Open-questions section narrowed from five items to two gated items plus one architecturally-settled-implementation-gated item, each with explicit resolution criteria named. Defaults-table "Revisit when market signal" rows rewritten with concrete gating shape matching the Open-questions section. Cross-surface pricing section header retitled from "pending" to "gated on Codex 1a + 1b pilot conversion." Companion edit at [`11_roadmap.md`](11_roadmap.md) inlines the `@hauska/atom-contract` commercial-posture revisit trigger as third-party-consumption OR first-paid-Layer-2-revenue, whichever-first.
- **2026-05-18:** Replaced the "Phased implementation" subsection with "Substrate state — code reality vs integration work" after the 2026-05-18 Hauska SDK recon ([`80_adrs/adr_018_atom_contract_substrate_layer.md`](80_adrs/adr_018_atom_contract_substrate_layer.md) follow-on item 7) established the 2026-05-16 phasing language was significantly behind code reality. `@hauska-sdk/payment` v0.1.0 has the x402 + USDC on Base/ETH/Polygon crypto rail substantially built and tested (56 tests green across five test files; re-verified 2026-05-18). Sole production code TODO is Circle fiat checkout URL generation at `packages/payment/src/payment-request.ts:253`. Remaining work is integration (atom-contract licensing-metadata at M2-C `@hauska/atom-contract` publication; MCP server metering wire-up; Bastrop revenue-share manual reconciliation pilot) plus operational posture (Hauska Inc. money-transmitter / KYC/AML / settlement-rail selection). Marketplace dynamics remain 18–36 month horizon. Frontmatter `related` extended to ADR-018. `related` field also bumped at this revision.
- **2026-05-16:** Added "SDK as payment substrate" section per the 2026-05-16 strategic brainstorm session ([`_sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md`](_sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md)). Captures the Hauska SDK as payment substrate principle commitment — usage-based pricing with revenue routed to source actors via accessPolicy. Phased implementation (Phase 1 atom-contract metadata in Sprint 51 timeframe; Phase 2 metering post-51; Phase 3 settlement after Bastrop revenue share contract testing; Phase 4 marketplace dynamics longer term). Companion to new canonical docs [`09_post_saas_substrate_thesis.md`](09_post_saas_substrate_thesis.md) and [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md). **Note (2026-05-18):** the "Phased implementation" subsection produced in this revision was superseded the same week by the substrate-state subsection above after the SDK recon established code reality.
- **2026-05-05 (origin):** Extracted from Section 10.2 of
  `04_strategic_conversation_record.md` during pre-docs-repo
  migration. Path A and Path B preserved verbatim. Default segment
  table preserved. Live-application section (Sylvia $1M proposal)
  added based on 2026-05-05 inbound email and outbound reply
  options.
