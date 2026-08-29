---
id: 2026-08-29_team_included_seats_3_WDLL
title: WDLL — Team included seats drop to 3
status: approved
last_updated: 2026-08-29
operator_approval: 2026-08-29 (operator: drop default team count to 3 at the starting Team price)
plan_row: P-94 leftover
---

# WDLL: Team included seats = 3

Date: 2026-08-29  Status: approved
Operator approval: 2026-08-29.

## Done looks like

The starting Team price ($299/mo, $2,990/yr) includes 3 seats. Extra seats stay $25/mo. Checkout, webhook, and the pricing sheet all use 3. A buyer who takes Team with no extras is granted 3, not 10. There is no live Team row to migrate.

## Acceptance items

1. **Constant is 3.** `PE_TEAM_INCLUDED_SEATS` and `PE_PRICING.team.baseSeats` are 3. Check: unit tests. Grade: [met] LDT `peTeamSeatsFromStripe.unit.test.ts`; PE `pricing.test.ts` `baseSeats === 3`.
2. **Billed extras add on 3.** Base Team item + extra quantity 2 stores 5. Check: resolver + webhook test. Grade: [met] resolver included+2 extras = 5.
3. **No invent.** Team grant with no items leaves null, not 3. Check: violate test. Grade: [met] empty items stay null.
4. **Annual cap is 3.** Annual Team with seats > 3 is 400. Annual Team with seats 3 is accepted. Check: checkout route tests. Grade: [met] annual 3 accepted; annual 12 still 400.
5. **Live copy.** Pricing modal Team copy says 3 seats. Check: PE_PRICING strings; live after Vercel. Grade: [met] `https://smartsite.cloud/assets/index-DClWxN0E.js` Age 0 contains `up to 3 seats` and `Annual Team carries 3 seats`; `up to 10 seats` and `10 seats` absent.
6. **Canon.** Locked ladder and Smart Site masters 06/07 say 3. Check: those files. Grade: [met] those files on disk; doc_repo uncommitted.

## Out of scope

Stripe dashboard product description (Nick). Live key swap. Accept-invite. Changing the $299 price.

## Amendments

- 2026-08-29: opened because operator dropped the included count before any Team subscription exists.
