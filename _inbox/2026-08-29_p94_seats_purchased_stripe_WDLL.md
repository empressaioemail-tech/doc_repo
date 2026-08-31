---
id: 2026-08-29_p94_seats_purchased_stripe_WDLL
title: WDLL — Stripe persist pe_user_entitlements.seats_purchased
status: approved
last_updated: 2026-08-29
operator_approval: 2026-08-29 (operator verified Team tab; proceed on the named Stripe leftover)
plan_row: P-94 leftover
related:
  - _inbox/2026-08-28_p94_team_roster_WDLL.md
  - _decisions/2026-08-28_p94_team_roster_server_half.md
---

# WDLL: Stripe persist seats_purchased

Date: 2026-08-29  Status: approved
Operator approval: 2026-08-29 proceed after Team tab verified.
Plan row: P-94 leftover (Wave 1). Not a second checkout lane. Not accept-invite.

Repo: `legacy-design-tools` only. Isolated tree `P:/tmp/legacy-design-tools-seats-purchased` from `origin/main`. Never the dirty team-roster tree, never `P:/seat-worktrees/property/legacy-design-tools*`, never `hauska-map` `src/checkout/`.

## Done looks like

The existing Stripe grant writes `pe_user_entitlements.seats_purchased` from billed Team items. A signed-in Team subscriber sees Purchased as a number on Settings → Team. An account with no Team subscription still omits the field. Unknown stays omitted. Zero is never written to mean unknown. The base-10 Team price is not invented when Stripe items were not read.

## Acceptance items

1. **Team grant writes a number.** `checkout.session.completed` or `customer.subscription.updated` for `subscription_tier=team` writes `seats_purchased = 10 + extra-seat quantity` from billed items (monthly or annual Team price plus `STRIPE_TEAM_SEAT_PRICE_ID`). Check: webhook test with base item plus extra quantity 2 stores 12. Grade: [met CI 2026-08-29]

2. **No invent.** A team grant with no readable items leaves `seats_purchased` null. Check: violate — team metadata only, no line items, no subscription fetch — row stays null, not 10. Grade: [met]

3. **Disagree refuses the seat write.** Checkout metadata `seats_purchased` and billed items that do not match leave the column null. The tier grant still lands. Check: metadata 10 + items that compute 12 → null. Grade: [met]

4. **Solo and Studio omit.** Those grants write `seats_purchased` null. Check: existing studio/solo webhook tests plus an explicit null assertion. Grade: [met]

5. **Churn clears.** `customer.subscription.deleted` (and inactive updated) set `seats_purchased` null with the free downgrade. Check: planted 12, delete event, column null. Grade: [met]

6. **Checkout declares the number.** Team checkout sets `metadata[seats_purchased]` and `subscription_data[metadata][seats_purchased]` to `10 + extras`. Non-team checkout does not set the key. Check: form params on createPeSubscriptionCheckoutSession. Grade: [met]

7. **Live grade.** After cortex serving this image: a Team grant produces GET `/api/property-explorer/v1/team/members` with numeric `seatsPurchased`. An account with no Team subscription still omits it. Check: live probe or operator Team tab. Grade: [partial] writer serving `00658-peq` @100%; existing rows not backfilled

## Out of scope

Accept-invite. Live Stripe key swap. A second Stripe writer. hauska-map `src/checkout/`. PE BFF write verbs. Inventing 10 for existing Team rows without a Stripe item read. Factory.

## Amendments

- 2026-08-29: opened as the named P-94 leftover after the Team tab lit and seats stayed Not read. Reason: operator verified, proceed.
