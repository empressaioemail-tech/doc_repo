---
decision_id: 2026-06-06_v1_tier_pricing_decision_b
date: 2026-06-06
owner: Nick
status: active
related_canonical: [14_pricing_framework, 16_commercialization_roadmap, 08_tiered_access_model, 29_mcp_surface_tier_model, 00d_portfolio_roadmap_reference]
supersedes_open: "16_commercialization_roadmap step 2 (Decision B deferral); 14_pricing_framework deferred tier-prices/quotas"
---

## Decision

Decision B (Hauska Layer 2 v1 tier pricing and bundled call quotas) is ratified. The v1 ladder, against the settled shape of free plus two self-serve paid tiers for the agent-builder ICP (Decision A):

| Tier | Price | Layer 2 calls bundled | Overage | Audience |
|---|---|---|---|---|
| Free / Developer | $0 | Layer 1 unlimited; 100 Layer 2 calls/mo (hard cap) | none | evaluate + build |
| Builder (metered) | $49/mo | 1,000 Layer 2 calls/mo | $0.04/call | indie dev / small agent app |
| Pro (stream) | $199/mo | 10,000 Layer 2 calls/mo + stream subscription to a jurisdiction/corpus | $0.02/call | power users / production agents |

The 1.5–2.5% take rate (source-actor routing cut) is a separate knob and still sets its exact value at first paid call; these tier numbers are the access price the builder pays Hauska.

## Context

The commercialization sprint (`16` step 2) and `14_pricing_framework.md` both deferred the tier numbers, blocking the paid signup flow (`16` step 3) which cannot quote without them. Decision A is ratified as the agent builder (Claude/Cursor developers on the SDK), which narrows the comparable set to metered-API pricing (Plaid-style) rather than enterprise reseller contracts. These numbers were surfaced in the 2026-06-06 working session and ratified by the operator.

## Structural commitment check

Pre-mortem run 2026-06-06, green across all four structural commitments and the quality gate. Layer 1 stays free, Layer 2 stays paid per-call (commitment 1, the tier model, intact); reasoning-chain/citation/confidence/timestamp unaffected. No sourcing or jurisdiction-cost commitment touched. On the Hauska spine, on the active commercialization sprint. One operational caveat acknowledged: numbers are set against zero revenue data and revisit at first paid call per the framework's take-rate philosophy.

## Reasoning

$0.04/call undercuts the Regrid ~$0.25/parcel reference roughly 6x, so a builder reselling into a $20/mo consumer app keeps margin. The 100 free Layer 2 calls let an agent builder prove value before paying, matching the positioning framework's "wide surface = acquisition cost, not profit center." The Pro tier's stream subscription is where the substrate-not-rent thesis lives (recurring access to a jurisdiction/corpus rather than per-rent maximization). The ladder is deliberately simple (one metered tier, one stream tier) per the recommended resolution path in `16`.

## Reversal criteria

Revisit any number when first paid-call signal lands (per framework), if the agent-builder ICP proves price-insensitive or hyper-sensitive at these points, if Cotality/ICP data-cost pass-through changes the floor, or if inbound interest surfaces the reseller ICP (Decision A candidate 3) requiring contract pricing instead.

## Dependencies

Closes `16_commercialization_roadmap.md` step 2 and the `14_pricing_framework.md` deferred tier decision (written in as the "v1 tier pricing" section). Unblocks `16` step 3 (Circle + self-serve signup, which can now quote). Pairs with Decision C (GTM channels).

## Counterparties

Internal. Sets the price the external agent-builder customer pays at first paid Layer 2 contract.
