---
id: 2026-08-24_lane2_pricing_a2_WDLL
title: Lane 2 — rebuild PricingModal to Claude Design Option A2
status: rebased-pr-open
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (work on Lane 2 from the design drop)
pricing_source: _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
frames: P:\doc_repo\_temp\Smart Site rebrand project (5)\handoff\Smart Site Pricing - Option A2.dc.html
---

# WDLL: Pricing popup Option A2

Operator asked to work Lane 2 from the 2026-08-24 Claude Design drop. This card replaces the rejected PE #202 vertical stack. Numbers stay locked. Approval is the verbal go plus this card; do not start Reports Option D on this card.

## Done looks like

Opening View pricing & unlock on smartsite.cloud shows a comparison table, not a scroll of equal-weight plan cards. Three purchasable columns (Solo / Studio / Team). Free is a caption strip. Unlock is a footer offer. Annual is the default presentation; monthly is one click. Studio is the emphasized deliverables column. CTAs use standing PE law: `--brand-blue`, not gold. Every price string still comes from `lib/pricing.ts`. Checkout wiring is unchanged (`useCheckoutActions`).

## Acceptance items

1. **Layout matches A2.** Header + annual/monthly toggle + Free caption + three columns + grouped rows (Answer this parcel / Hand it to someone else / Work as a firm) + Unlock footer. | check: side-by-side with `Smart Site Pricing - Option A2.dc.html` desktop frame | grade: [met] planner read of PricingModal.tsx on `fix/pe-pricing-a2`. Operator visual owed.

2. **Numbers locked.** No new price literals. Annual $490 / $1,290 / $2,990. Monthly $49 / $129 / $299. Unlock $15 / 30 days. Extra Team seats $25/mo. Annual Team cap 10 seats stated honestly. | check: grep PricingModal for dollar literals; all values from `PE_PRICING` | grade: [met] no `$` literals in PricingModal; amounts live on PE_PRICING.

3. **Annual default.** First paint is annual. Toggle switches labels and CTA amounts. Extra seats control hidden or disabled on annual Team. | check: unit/render test + data-testid on interval | grade: [met] display only. See amendment A1: checkout is still monthly.

4. **Button + tokens.** Primary / secondary / ghost from `Button.tsx`. No raw `<button>` except the close affordance if Button has no icon-only variant. No third accent. No `--sc-*`. | check: read PricingModal; no `#E8963B` on CTAs | grade: [met] primary / subtle / ghost; close is the one raw button. Gold unused on CTAs.

5. **Entry states preserved.** No-parcel disables Unlock with "Inspect a property first." Studio-only gate marks Unlock as not covering that feature. Context line optional and does not steal the header. | check: existing PricingModal tests updated, not deleted | grade: [met] cases still in pricing-modal.test.tsx.

6. **Checkout unchanged.** Solo/Studio/Team still call `startPeCheckout` with the visible tier. Unlock still calls `startPropertyUnlock`. No fake success. | check: existing checkout tests still pass | grade: [met] then amended A1: interval now required on the body.

## Planner review 2026-08-24

Uncommitted on `fix/pe-pricing-a2` at property hauska-map (+743 / −233). Then rebased 2026-08-24 onto `origin/main` `57ca035` in isolated `P:/tmp/hauska-map-pricing-a2` `fix/pe-pricing-a2-rebased` `1f777ac`. PR [#211](https://github.com/empressaioemail-tech/hauska-map/pull/211). 30/30 pricing tests. No smartsite.cloud alias. Customer-done waits on operator visual.

## Amendments

- **A1 — Annual is presentation only (deploy gate).** Cortex already accepts `interval: "month" | "year"` and has the three annual price IDs mounted (`pePaywallStripe.ts`, `propertyExplorer.ts` L809, serving `00569-maw`). PE `startPeCheckout` omits the field, so the server defaults to month. A Start Studio click on the annual view still charges $129/mo while the table shows $1,290/yr. Same-card wire is a PE body field, not a new Stripe catalog. Do not deploy until that field is sent, or the operator accepts the lie. Owner: this branch if go; else next billing cut. Plan row P-60.

  **A1 graded 2026-08-24 (planner read):** met on `fix/pe-pricing-a2`. `startPeCheckout` requires `month`|`year` and refuses otherwise (no silent month default). PricingModal first paint CTAs carry `data-checkout-interval="year"`. Annual Team seats cap at 10 on the wire. Tests pin annual Studio body `year` and refuse the UI token `"annual"`. Still uncommitted. Still not on smartsite.cloud. Operator visual owed.

  Residual: 404/403 still falls through `startPeCheckoutInstallScoped`, which does not send interval. If that seam can still fire in prod, annual can degrade to the old install-scoped checkout. Named leave_behind, not absorbed.

## Do not

- Adopt gold as the button color from the brand-package `pe-tokens.css` comment. Live `src/styles/pe-tokens.css` says gold is mark only. A2 frames themselves use blue CTAs. That is the law for this card.
- Load Oxygen from a CDN (CSP). System stack stays.
- Rebuild Reports dock, landing SignUpCard, or live Stripe.
- Invent entitlements or a Contact us path.

## Amendments

None yet.
