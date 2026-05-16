---
id: 14_pricing_framework
title: Pricing framework â Path A vs Path B
status: active
last_updated: 2026-05-16
applies_to: portfolio
related: [10_ground_truth, 11_roadmap, 30_smartcity_os, 40_design_accelerator]
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
| Empressa Land + future B2B products | **Revisit when there's market signal** | Pricing for these products is not yet settled; first paid engagements will set the precedent |
| AEC firms (Design Accelerator B2B) | **Revisit when there's market signal** | Customer-zero is Empressa; external pricing pending |

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

## Cross-surface pricing â pending

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

The Hauska SDK is the payment substrate for atom transactions. When agents consume atoms via the Hauska MCP Server, micropayments flow through the SDK back to the source actors of those atoms (cities, firms, regulators, professionals). This makes partnership-first sourcing substrate-enforced rather than contract-enforced.

Repositioning: Hauska is "Plaid for jurisdiction-grounded physical-world data" plus "Stripe for atom transactions in that domain."

### Commercial model

Usage-based pricing replaces SaaS per-seat pricing as the commercial model for agent consumption. Several composing models:
- Per-atom-access (small fee per MCP call, routed to source actor)
- Stream subscription (recurring fee, revenue-shared)
- Composition royalty (percentage of derivative product revenue)
- Reasoning-call pricing (aligned with "sell reasoning not data")
- Marketplace dynamic pricing (flexible, operationally complex)

Most likely outcome: a composition. Layer 1 free. Layer 2 paid via per-call or stream. High-value derivative via composition royalty. Reasoning-call as unifying frame.

### Entity structure

Hauska Inc. is a separate C-corp, already established. Hauska Inc. carries the payment-bearing operations and the regulatory posture (money transmitter status, KYC/AML, tax reporting, escheatment as applicable). Legacy Group ATX LLC and Empressa product brands sit cleanly above Hauska Inc. with payment substrate isolated.

### Settlement model

Hybrid fiat and stablecoin processor. Fiat settlement for traditional counterparty preferences (cities, firms with conservative compliance postures); stablecoin rails for high-volume, low-friction micropayment flows and for agent-to-agent transactions in future phases. Stripe Connect is a candidate fiat partner; stablecoin rail TBD.

### Take rate philosophy

Lower than the current SaaS landscape. Software pricing is in deflationary regime as production costs fall toward compute costs. Hauska's value is in being the substrate everyone runs on, which compounds. Maximizing rent per transaction is not the optimization target; volume and adoption are. Specific take rate is TBD pending modeling work but anchors below Stripe (3 percent) and well below app store rates (30 percent). Probably in the 1-3 percent range depending on transaction type.

### Phased implementation

Phase 1 (Sprint 51 timeframe): Atom contract supports licensing and revenue-share metadata on atoms. accessPolicy carries source actor for routing. No payments yet.

Phase 2 (post-51, alongside ECI atomization and SmartCity OS MCP retrofit): Metering at the SDK and MCP server tools layer. Records who consumed what when. Accounting infrastructure exists; no actual money movement.

Phase 3 (after Bastrop revenue share contract is operationally tested with manual reconciliation): Settlement infrastructure. Hauska Inc. operating with full regulatory posture. Real money flows. Partners receive payments.

Phase 4 (longer term, 18-36 months out): Marketplace dynamics, dynamic pricing, agent-to-agent atom transactions, the full payment substrate vision.

### Open questions

- Specific take rate (lower than landscape; modeling work needed)
- Pricing model composition (per-call vs stream vs composition vs reasoning vs marketplace blend)
- Regulatory posture details (money transmitter requirements per state; KYC/AML thresholds)
- Settlement rail selection (Stripe Connect plus stablecoin choice)
- Adversarial agent mitigations (signed SDK builds; attestation; accessPolicy enforcement)

### References

- 09_post_saas_substrate_thesis.md (strategic positioning that motivates this model)
- 28_mcp_first_product_design.md (product line architecture that produces the consumption events)
- 50_hauska_mcp_server.md (the enforcement surface)
- ADR-017 (atom access control; accessPolicy field carries source actor routing)
- ADR-013 (procedure-execution atoms; the unit of metering)
- Session origin: _sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md

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

## Revision history

- **2026-05-16:** Added "SDK as payment substrate" section per the 2026-05-16 strategic brainstorm session ([`_sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md`](_sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md)). Captures the Hauska SDK as payment substrate principle commitment — usage-based pricing with revenue routed to source actors via accessPolicy. Phased implementation (Phase 1 atom-contract metadata in Sprint 51 timeframe; Phase 2 metering post-51; Phase 3 settlement after Bastrop revenue share contract testing; Phase 4 marketplace dynamics longer term). Companion to new canonical docs [`09_post_saas_substrate_thesis.md`](09_post_saas_substrate_thesis.md) and [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md).
- **2026-05-05 (origin):** Extracted from Section 10.2 of
  `04_strategic_conversation_record.md` during pre-docs-repo
  migration. Path A and Path B preserved verbatim. Default segment
  table preserved. Live-application section (Sylvia $1M proposal)
  added based on 2026-05-05 inbound email and outbound reply
  options.
