---
decision_id: 2026-08-29_p94_seats_purchased_stripe
date: 2026-08-29
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-29_p94_seats_purchased_stripe_WDLL.md
  - _decisions/2026-08-28_p94_team_roster_server_half.md
---

## Decision

The named P-94 leftover is a write on the existing Stripe grant: persist `pe_user_entitlements.seats_purchased` from billed Team items. Isolated LDT tree only. Do not open a second checkout lane. Do not invent 10. Accept-invite stays out.

## Context

The Team tab now lights. Purchased stays Not read because the webhook still writes `subscription_tier` only. Checkout already sends extra-seat quantity. Operator verified the tab and said proceed.

Alternatives: invent 10 from the Team price (rejected: unknown would enter the ratio); write from checkout metadata alone (rejected: one derivation); start a new Stripe writer in hauska-map `src/checkout/` (rejected: named island).

## Structural commitment check

Sell reasoning, not data: a missing seat count stays omitted.
Confidence is earned: disagreeing metadata and billed items write null.
Cost per jurisdiction: none.
Dual interface: server write; the tab already renders the number.

## Reasoning

The included-10 is a product fact only after a Team base price item is read from Stripe. Extra seats add from `STRIPE_TEAM_SEAT_PRICE_ID` quantity. Solo and Studio clear the column. Churn clears it. A leftover number after downgrade would be a silent seat grant.

## Reversal criteria

Revisit if Stripe already writes `seats_purchased` on live Team rows. Revisit inventing 10 if that is later ruled the product default for every Team grant with unreadable items.

## Dependencies

P-94 GET and allowlist are live. Invite UI is still display-only. PE BFF write verbs stay off. Live key swap is Nick-only.
