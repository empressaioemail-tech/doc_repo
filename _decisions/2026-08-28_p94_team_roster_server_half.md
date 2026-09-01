---
decision_id: 2026-08-28_p94_team_roster_server_half
date: 2026-08-28
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _inbox/2026-08-28_p94_team_roster_WDLL.md
  - _inbox/2026-08-28_p94_team_roster_close.json
---

## Decision

OPS-16 P-94 is the Team roster server half. The reviewed isolated tree may open a PR, apply migration 0089, and deploy cortex. Customer-done is a signed-in Settings Team tab that lights from live GET with no PE client change. Invite stays blocked until Stripe writes `pe_user_entitlements.seats_purchased`. Accept-invite is a named leftover, not this card.

## Context

The Team tab shipped against an endpoint that did not exist. The chrome lane locked the client parser. An isolated LDT tree built GET plus the four write verbs against that parser, 19 of 19 violate tests, and stopped before commit because no plan row existed. The operator then said add P-94, or go without the row. Adding the row is the cheaper honesty: later dispatches can name it.

Alternatives: go without a row (rejected: the compiler and the hatch both treat a missing row as unscoped work); fold invite-accept and Stripe seat persist into this card (rejected: those are two other write paths, and collapsing them hides an honest 409).

## Structural commitment check

Sell reasoning, not data: a missing seat count is omitted, not invented as 10.
Confidence is earned: `seats_purchased_unknown` is a refuse, not a default.
Cost per jurisdiction: no ingest.
Dual interface: server enforcement; the tab is already the UI.

## Reasoning

Seat enforcement belongs on the server. Anyone with a session who POSTs directly is still refused at capacity. An invitation holds a seat from send. The last joined owner cannot be removed or demoted. `administrator` is dropped and the CHECK rejects it. Stripe checkout already sends quantity; the webhook still writes only `subscription_tier`. Until that column is written, a live Team GET omits `seatsPurchased` and POST invite 409s. That is honest. Accept-invite is not built: an invited email who signs in becomes owner of a new account via `ensureOwnerMembership`. Those two leftovers stay named and separate.

## Reversal criteria

Revisit the Stripe leftover if the webhook already writes `seats_purchased` on a live Team entitlement row; then invite is unblocked and this card's 409 is a defect. Revisit accept-invite remaining out of card if a customer cannot join a held seat and that is the only remaining Team defect after GET lights. Revisit housing if the roster tables belong on a different service than cortex-api.

## Dependencies

P-93 chrome is live and is the client. Stripe seat persist is a leftover on the Stripe lane, not this card. P-90 stays gated on the P-89 download leftover. P-85, P-91, and P-92 stay other lanes.

## Counterparties

Internal. Operator plus the existing Team-roster chat on `P:/tmp/legacy-design-tools-team-roster`.
