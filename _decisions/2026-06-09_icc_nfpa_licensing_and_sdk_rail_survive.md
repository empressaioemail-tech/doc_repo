---
decision_id: 2026-06-09_icc_nfpa_licensing_and_sdk_rail_survive
date: 2026-06-09
owner: Nick
status: active
refines: [2026-06-09_retire_partnership_first_amend_constitution]
related_canonical: [73_partnerships, 14_pricing_framework, 74_commercial_agreements, 08_tiered_access_model, 57_national_code_warming_sprint, 09_post_saas_substrate_thesis]
related_adr: [80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_008_engine_factor_out]
---

## Decision

The partnership-first retirement (`_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`) retired the cities-as-operational-data-licensors sourcing ethic only. Two adjacent mechanisms it left ambiguous are resolved here.

1. **ICC/NFPA standards-body content licensing survives, reclassified as content/display IP licensing.** It is distinct from and opposite in direction to the retired city sourcing ethic: ICC and NFPA own the copyrighted model-code text (the I-Codes, the NEC), and Hauska needs a license to display that text as full-text rather than deeplink. This reinforces sell-reasoning-not-data, since licensed display is the legal full-text path and the interim is deeplink, never hoarded verbatim. One ICC deal clears the Layer-1 model-code base for the whole catalog and moots the model-code copyright question (ADR-019). It is NOT the Bastrop partnership template (retired); it is a content-licensing relationship where Hauska is the metered agent-retrieval channel and the standards body is the content owner. The "we pay you, not we host your code" framing is the differentiator against UpCodes-style hosting. The commercial structure (flat content-license fee versus metered per-retrieval revenue share) is TBD in the negotiation, not pre-settled. The enhance phase and ICC credential delivery proceed on their existing gate in the national code-warming sprint.

2. **The SDK source-actor revenue rail survives as designed-not-built available plumbing, not a structural commitment.** The crypto USDC rail in `@hauska-sdk/payment` is built and tested; the routing/split layer that routes a share to a source actor is unbuilt. It is not load-bearing, not a headline, and stays rail-quiet (I7). Its first concrete use is ICC/NFPA revenue routing if and only if that deal carries a metered-share component; firm and code-rewrite-firm co-publishing is a parked speculative use. No aspirational "substrate-enforced revenue share" claim: until the routing layer ships, revenue share is contractually promised, not substrate-enforced, and BD and investor materials say so (consistent with the honesty correction that motivated retiring partnership-first).

## Context

Surfaced by the partnership-first propagation sweep, which found partnership-first bundled three things and the amendment retired only the first. Premortem-check run 2026-06-09: GREEN on all commitments. ICC/NFPA licensing reinforces commitment 1 (licensed display is the legal full-text path) and lowers commitment 3 (one deal clears the catalog). The SDK rail decision adds zero build cycles (rail stays dormant). The single guardrail is honesty: do not re-inflate the "substrate-enforced revenue share" claim the partnership-first retirement was partly correcting; the rail stays designed-not-built and the structure stays contractually-promised until shipped.

## Reasoning

ICC/NFPA is IP compliance, not optional sourcing: to show full code text legally Hauska must license it, and the alternative (deeplink-only) is a real but lesser product. The relationship is Hauska-as-payer to a content owner, the opposite of the retired model where cities were to be paid for their operational data, so retiring city sourcing does not touch it. The SDK rail is built infrastructure with a real residual use (routing a share to ICC/NFPA if their deal carries it); ripping it out would discard tested code for no gain, while building its routing layer now would be premature. Keeping it dormant-but-available is the lean call.

## Reversal criteria

Drop ICC/NFPA content licensing only if the model-code copyright question is mooted another way (for example a government-edicts-doctrine outcome establishing that adopted codes are public domain in Hauska's operating jurisdictions, making a license unnecessary), or if ICC's terms prove commercially unviable and deeplink-only display is sufficient for the product. Drop the SDK source-actor rail only if no paid-source revenue-routing use has materialized (no ICC/NFPA metered-share, no firm co-publishing) by the time the payment substrate would otherwise be built, at which point the rail stays dormant indefinitely rather than receiving a routing layer.

## Dependencies

Doc edits: `73_partnerships.md` (reclassify the ICC/NFPA section from licensor-partnership/Bastrop-template to content/display licensing), `14_pricing_framework.md` (resolve the SDK-principle flag to the decided state), `74_commercial_agreements.md` (re-trigger the revenue-share template off the retired Bastrop pilot onto the ICC/NFPA content-license deal if it carries a share). No build dispatches; the enhance phase already rides its ICC-creds gate.

## Counterparties

ICC and NFPA are content-license counterparties (Hauska is the payer/metered channel). The deal is legal and corporate execution and routes to Nick. No commitment is made here beyond the posture already stated to ICC.
