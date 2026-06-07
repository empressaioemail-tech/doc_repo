---
id: 53_hauska_sdk_completion_sprint
title: Hauska SDK completion sprint — Circle rail, revenue routing, MCP metering
status: active
last_updated: 2026-06-06
applies_to: hauska
related: [52_mcp_offer_and_buildout, 50_hauska_mcp_server, 14_pricing_framework, 16_commercialization_roadmap, 29_mcp_surface_tier_model, 72_hauska_inc_operations, 08_tiered_access_model, _research/2026-06-06_cross_repo_recon, _decisions/2026-05-21_fiat_rail_circle, _decisions/2026-06-06_v1_tier_pricing_decision_b, 80_adrs/adr_018_atom_contract_substrate_layer]
owner: nick
---

# Hauska SDK completion sprint

> **Purpose.** Finish the Hauska SDK so a Layer 2 paid MCP call actually transacts. This is the commerce backbone for the whole catalog thesis and it is unfinished. The plan resolves the open question in [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md) §6 (where the SDK completion plan lives) and sequences the five-item punch list from §4 of that doc into a sprint with acceptance criteria.
>
> **Sourcing.** Code state read directly from `p:\Hauska SDK` and the cross-repo recon at [`_research/2026-06-06_cross_repo_recon.md`](_research/2026-06-06_cross_repo_recon.md). Verified 2026-06-06: `generateFiatCheckoutUrl()` is a stub returning a hardcoded `checkout.circle.com` URL with a TODO at `packages/payment/src/payment-request.ts:253`; no revenue, payout, or split code exists in any `@hauska-sdk/*` package; the repo is internally branded "CNS Protocol SDK"; 12 packages at v0.1.0, dormant since 2026-04-05.

## Why this is the gate

The pricing model is settled, the tier numbers are ratified (Decision B), the storefront is deployed. None of it produces a dollar until the SDK can take money. The dependency chain to first paid revenue is short and strict: the Circle rail must create and verify a real checkout (item 1); a paid Layer 2 call must meter and charge through the MCP gate (item 3, which consumes item 1); and the source-actor share must route so the substrate-enforced revenue-share promise stops being only contractual (item 2). Items 4 and 5 (test pass, polish) gate touching real money safely. Until items 1 through 3 land, every Tier 1 Layer 2 tool from `52` §3a is access-gated by product key but cannot charge per call. That is acceptable for the build-before-launch sequence in `52` §5, and it is the reason this sprint follows the Tier 1 build-out and precedes unpinning Decision C.

The crypto rail is the asymmetry worth stating plainly: `@hauska-sdk/payment` already does genuine on-chain USDC verification via ethers across Base, Ethereum, and Polygon (56 tests green, re-verified 2026-05-18 per `14_pricing_framework.md`). It is an x402 pull model, verifying a payment the client executed, not an outbound settlement engine. So the crypto half is real and the fiat half is a stub; the routing layer is absent on both. This sprint finishes fiat, builds routing, and wires metering.

## What is settled going in (do not relitigate)

v1 fiat rail is Circle per [`_decisions/2026-05-21_fiat_rail_circle.md`](_decisions/2026-05-21_fiat_rail_circle.md). v1 crypto rail is USDC on Base, Ethereum, and Polygon, already built. Tier prices and bundled call quotas are Decision B ([`_decisions/2026-06-06_v1_tier_pricing_decision_b.md`](_decisions/2026-06-06_v1_tier_pricing_decision_b.md)): Free $0 with 100 Layer 2 calls/mo hard cap, Builder $49/mo with 1,000 calls and $0.04 overage, Pro $199/mo with 10,000 calls plus a stream subscription and $0.02 overage. The 1.5 to 2.5 percent take rate is a separate source-actor routing cut whose exact value sets at first paid call. Layer 1 free, Layer 2 paid per `08_tiered_access_model.md`. The metering wire-up consumes `@hauska-sdk/payment` at the tool-call layer per [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md).

## The five-item punch list, sequenced

Order is by dependency, not by size. Items 1 and 2 are parallel-safe with each other (different code paths). Item 3 hard-depends on item 1. Item 4 covers the new code from 1 through 3. Item 5 is independent and can run alongside.

### Item 1 — Circle fiat rail, replace the stub

Replace the placeholder `generateFiatCheckoutUrl()` with a real Circle integration: checkout-session creation, webhook handling for payment-state transitions, and server-side payment verification. The config already allows only `provider: "circle"`, so this is a build-out of the path the SDK already commits to, not a provider selection.

Acceptance criteria. A checkout session is created against the Circle API from a tier and amount and returns a live checkout URL, not a hardcoded string. A Circle webhook is received, signature-verified, and resolved to a settled or failed payment state recorded in the payment-storage substrate. A verification call confirms a settled payment by Circle payment id independent of the webhook (belt-and-suspenders against missed webhooks). The stub at `payment-request.ts:253` is gone and no code path returns a fake `checkout.circle.com` URL. Credentials resolve from config or environment and the integration fails closed (throws, does not silently fake) when they are absent.

Dependency named. Hauska Inc. Circle account and API credentials, tracked in [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md). The integration can be built and tested against Circle's sandbox before the production account clears; production cutover gates on the account.

### Item 2 — Revenue routing and source-actor split, build it

Build the layer that splits a settled micropayment and routes the source-actor share back. This is the code half of the substrate-enforced revenue-share thesis; today collection is a single facilitator wallet and the share is contractual only. The split reads the take-rate cut and the source-actor identity, computes the routed amounts, and records a routing ledger entry per payment.

Acceptance criteria. Given a settled payment and a source-actor reference, the layer computes the facilitator cut (within the 1.5 to 2.5 percent band, value injected, not hardcoded) and the source-actor share. A routing ledger row is written per split with payment id, source-actor, amounts, and timestamp. The split is idempotent on payment id (a replayed webhook does not double-route). Where the source-actor reference is missing or unresolved, the payment is held in a pending-routing state rather than collected silently to the facilitator wallet, so the contractual-versus-enforced gap is visible in data.

Dependency named. The atom-contract source-actor and licensing-metadata fields. The `accessPolicy` five-value union ships in `@hauska/atom-contract` v1.3.0, but dedicated source-actor and licensing-metadata fields are still unbuilt per `14_pricing_framework.md`. Item 2 can build against a provisional source-actor reference shape and harden once those fields land; flag the seam in the report so the atom-contract owner can close it.

### Item 3 — Wire the SDK into the MCP gate

Connect `hauska-mcp-server` to `@hauska-sdk/payment` so a Layer 2 paid tool call meters and charges. Today nothing consumes the SDK except a scaffold command-center, and the Tier 1 Layer 2 tools from `52` §3a are gated by product key but do not transact. The gate checks the caller's bundled-call balance against the Decision B quotas, decrements on a successful Layer 2 call, and triggers overage billing through item 1 when the bundle is exhausted.

Acceptance criteria. A Layer 2 tool call by an authenticated key decrements that key's monthly bundle and records the call against the quota. A Free-tier key is hard-capped at 100 Layer 2 calls/mo and the 101st is refused with a clean upgrade-path error envelope. Builder and Pro overage calls bill at the Decision B per-call rates through the Circle rail from item 1. Layer 1 and anonymous calls are never metered or charged. Metering is fail-safe: a metering-subsystem error does not silently grant free Layer 2 access nor hard-fail a Layer 1 call.

Dependency named. Item 1 (no charge path without the fiat rail) and the Tier 1 tools from `52` §3a being product-gated (already the dispatch scope for cc-agent-M). This is the seam where the SDK and the MCP server meet; coordinate the consuming-side contract with cc-agent-M.

### Item 4 — Test pass over the money paths

The crypto rail is real but untested since April; the new fiat, routing, and metering code touches money and needs coverage before it goes live. This item is the gate between code-complete and credential-clear.

Acceptance criteria. The April crypto-rail suite runs green again on current dependencies. New unit and integration coverage exists for Circle checkout creation, webhook signature verification, payment verification, the revenue split (including the idempotency and missing-source-actor cases), and the MCP metering decrement and overage trigger (including the Free-tier hard cap and the fail-safe behavior). A sandbox end-to-end runs from a simulated Layer 2 call through metering, overage, Circle sandbox checkout, webhook, and revenue split to a routing ledger entry. Test artifacts are pasted verbatim in the report per HR-8.

### Item 5 — Branding and publish polish

Reconcile the internal "CNS Protocol SDK" branding (READMEs, EIP-712 domain strings) with Hauska naming, and confirm and automate npm publish. `publish.yml` exists but publish state is unverified.

Acceptance criteria. No user-facing "CNS Protocol" string remains in package metadata, READMEs, or the EIP-712 domain; the SDK presents as Hauska. The EIP-712 domain change is treated as a signing-surface change and called out explicitly, since altering the domain changes signature validity (verify against the on-chain verification path before shipping). npm publish state for the 12 `@hauska-sdk/*` packages is confirmed (published versions enumerated) and the `publish.yml` path is exercised at least once. VDA terminology is reconciled: the SDK means "Verified Digital Asset" (metadata-only ownership proofs on IPFS, not tokens), which differs from the doc-set gloss "verifiable data asset"; align the docs to the code meaning.

## First-paid-revenue dependency, stated explicitly

First paid Layer 2 revenue (step 7 of [`16_commercialization_roadmap.md`](16_commercialization_roadmap.md)) requires items 1, 2, and 3 live and item 4 green. The Circle rail (item 1) is the charge mechanism; the MCP metering wire-up (item 3) is what makes a paid call transact rather than merely gate; the revenue split (item 2) is what makes the partner-city revenue-share promise enforced rather than contractual. Without all three, a Layer 2 tool is access-gated but free, which is fine for build-and-test and not fine for launch. This is why the recommended sequence in `52` §5 puts SDK completion after the Tier 1 build-out and before unpinning Decision C. The exact take-rate value within the 1.5 to 2.5 percent band still sets at first paid call per the `14_pricing_framework.md` take-rate philosophy; the routing layer must accept that value as an injected parameter, not a constant, so it can be set without a code change.

## Out of scope

Marketplace dynamics, agent-to-agent atom transactions, dynamic pricing: genuinely future per `14_pricing_framework.md`. Hauska Inc. regulatory posture (money-transmitter registration per state, KYC/AML thresholds): corporate and legal work tracked in `72_hauska_inc_operations.md`, routed to Nick, not SDK code. The atom-contract source-actor and licensing-metadata fields: the data half of routing, owned by the atom-contract repo, named here as item 2's dependency rather than worked here. Adversarial-agent mitigations (signed builds plus attestation): architecturally settled, implementation gated to first paid revenue per `14_pricing_framework.md` open questions.

## Cross-references

- [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md) — §4 punch list this sprint executes; §3a Tier 1 tools that item 3 meters.
- [`14_pricing_framework.md`](14_pricing_framework.md) — substrate-state breakdown (what exists), take-rate philosophy, Decision B tier numbers.
- [`16_commercialization_roadmap.md`](16_commercialization_roadmap.md) — step 3 (Circle plus self-serve signup) and step 7 (first paid Layer 2 contract) this sprint unblocks.
- [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md) — the tier model the metering enforces.
- [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md) — Circle account, banking, regulatory posture dependencies.
- [`_research/2026-06-06_cross_repo_recon.md`](_research/2026-06-06_cross_repo_recon.md) — SDK ground-truth source.

## Revision history

- **2026-06-06 (origin):** Created to resolve the `52` §6 open question on where the SDK completion plan lives. Five-item punch list sequenced with acceptance criteria and named dependencies; first-paid-revenue dependency chain stated; SDK code state verified against `p:\Hauska SDK` and the 2026-06-06 cross-repo recon.
