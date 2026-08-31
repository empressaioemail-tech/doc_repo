---
decision_id: 2026-08-15_icc_first_sdk_customer
date: 2026-08-15
owner: nick
status: active
related_canonical: [_thought_leadership/04_positioning_narrative, portfolio_thesis/03_three_questions_data_room_and_sdk, 14_pricing_framework, 90_operations/OPS-17_govtech_stack_plan_of_record, 75n_icc_code_connect_catalog, 29_mcp_surface_tier_model]
---

# Decision

ICC is the first real customer that touches the Hauska SDK. Command Center, Smart Files CC-done, and the Vertosoft $25k deploy SKU do not count as SDK customers.

## Context

The 2026-08-14 Empressa positioning narrative (`_thought_leadership/04_positioning_narrative.md`) states that every agent transaction asks three questions: who, what, how do I pay. The data room answers the first two. The SDK answers the third. Operator confirmed 2026-08-15: ICC should be the first real customer touching the SDK. This matches `14_pricing_framework.md` (first concrete use of the payment rail is ICC/NFPA revenue routing if the license carries a metered-share component) and OPS-17 Lane D (G-50 upgrades ICC atoms from platform-internal to public-paid).

Alternatives considered: (a) wire SDK payment into CC-done so the operator can see a charge, rejected because `29_mcp_surface_tier_model.md` rules Command Center non-commercial; (b) let ATX Bulls or a SmartCity tenant be first, rejected because ICC is a licensed source with a known actor and two citing surfaces on one ledger, which is the actual payment event the rail was built for.

## Structural commitment check

- Sell reasoning, not data: ICC metering charges for the cited code-section reasoning, not a dump of the book.
- Confidence earned, not asserted: SDK must not charge for a record that cannot open with evidence. Typed absence stays free of a paid hit that pretends content exists.
- Cost per jurisdiction: unchanged. ICC is a licensed source, not a county onboard.
- Dual interface: MCP tools meter; UI does not get a private payment path.

## Reasoning

Question 3 without a verified source actor is a rails demo. ICC is the first counterparty where "who stands behind this" is a licensor, "what is this" is a code section with edition identity, and "how do I pay" is a metered reference across Smart Site and Plan Review (OPS-17 S-4, G-17, G-23, G-50). Smart Files in Command Center is the operator proving ground for question 2. A city paying Vertosoft $25k is buying a door onto the layer, not settling an atom. ATX Bulls is a parallel proof of the architecture and is not allowed to jump this queue.

## Reversal criteria

Reverse if a signed paying counterparty requires per-atom settlement before the ICC agreement is executable, and that counterparty's atoms already carry evidence a data-room read can open. Do not reverse because a demo wants a checkout button on Command Center.

## Dependencies

Depends on: G-17 content-to-actor reference, G-30 accessPolicy stamp (defect live on engine main as of 2026-08-14), G-23 per-reference rate, G-50 agreement plus public-paid upgrade.
Blocks: MCP metering wire-up, Circle fiat integration, VDA wrapping on a serving path, take-rate number-within-range at first paid Layer 2 call.
Does not block: CC-done (G-56 proposed), G-11 tenancy, G-53 city sale.

## Counterparties

ICC (content licensor). Internal: Lane D planner, Hauska Inc. (settlement entity). Not: Vertosoft, Bastrop, ATX Bulls, as first SDK customer.
