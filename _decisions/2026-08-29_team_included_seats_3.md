---
decision_id: 2026-08-29_team_included_seats_3
date: 2026-08-29
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - _smartsite_masters/06_smart_site_gtm_audiences_and_pricing.md
  - _decisions/2026-08-29_p94_seats_purchased_stripe.md
---

## Decision

Smart Site Team at the starting Team price ($299/mo, $2,990/yr) includes 3 seats. Extra seats stay $25/mo. The previous included count of 10 is retired.

## Context

Operator 2026-08-29: no Team subscription exists yet, and the default Team count should be 3 at the starting Team tier price. The 2026-08-10 locked ladder had said $299 for up to 10 seats so a firm was cheaper per head than Solo. That per-seat math does not survive this ruling ($299 / 3 is above Solo $49) and is not restated as current.

Alternatives: keep 10 (rejected: operator dropped it); cut the Team price to keep the old per-head story (rejected: price unchanged); invent 10 on grant without a subscription (rejected: no Team sub, and unknown stays omitted).

## Structural commitment check

Sell reasoning, not data: Purchased is still omitted until a Team grant writes a number.
Confidence is earned: the included count is the product constant the checkout and webhook both use, not a silent 10.
Cost per jurisdiction: none.
Dual interface: server and pricing sheet stay on one number.

## Reasoning

There is no live Team row to migrate. Changing `PE_TEAM_INCLUDED_SEATS` / `PE_PRICING.team.baseSeats` before the first Team checkout means the first grant writes 3 (plus extras), not 10. Annual Team still cannot carry extras. Stripe price ids do not change. Stripe dashboard copy that still says 10 seats is a catalog leftover, not this write.

## Reversal criteria

Revisit if a live Team subscriber was granted under the old 10 and a later grant would shrink them without a Stripe item read. Revisit if the Team price is cut so the old per-head story is meant to return.

## Dependencies

P-94 GET and the seats_purchased writer are serving. This amends the included count those paths add extras to. Accept-invite stays out.

## Counterparties

Internal. Operator.
