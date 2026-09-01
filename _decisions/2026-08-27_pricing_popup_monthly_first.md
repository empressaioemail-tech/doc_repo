---
decision_id: 2026-08-27_pricing_popup_monthly_first
date: 2026-08-27
owner: Nick
status: active
related_canonical:
  - Master Collateral Folder/2026-08-25_edw_gtm_qa/02_gtm_and_pricing.md
  - _inbox/2026-08-27_smartsite_qa_program_WDLL.md
  - _decisions/2026-08-24_stripe_annual_pricing_and_live_activation.md
---

## Decision

The Plans popup lands on Monthly. Annual stays as the other toggle. Annual amounts do not change. The header "2 months free · 10 × monthly" chip is retired. Seat count and the 10 × monthly note live in the Team column.

## Context

The 2026-08-10 / 2026-08-24 GTM line presented annual as the default. On the 2026-08-27 signed-in walk the operator said the popup should land on monthly, that the 2 months free chip was useless, and that the team seat number sat in an odd spot off the Team column. Amounts stay $49 / $129 / $299 and $490 / $1,290 / $2,990. Extra Team seats stay $25 monthly after 10.

## Structural commitment check

Sell reasoning, not data: no change. No new SKU. No valuation.

## Reasoning

Monthly is the number people compare. Annual is the prepay. Showing annual first made the Monthly toggle look like it still billed annually on Stripe. Moving the seat stepper into the Team column puts the live $349-at-12 math on the column that owns Team.

## Reversal criteria

Revisit if annual conversion is measured worse than the prior annual-first popup on a named window, or if Stripe cannot start a monthly Team session from this first paint.

## Dependencies

Supersedes the presentation sentence in `02_gtm_and_pricing.md` that said present annual as the default. Does not reverse the locked annual amounts.

## Counterparties

Internal. Operator Nick.
