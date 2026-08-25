---
id: 2026-08-24_rebrand6_checkout_3b_WDLL
title: Smart Site rebrand project (6) — 3b checkout inside Smart Site
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (go on 3b wdll and organize subagents)
frames: P:\doc_repo\_temp\Smart Site rebrand project (6)\handoff\auth-pricing\Smart Site Auth & Checkout.dc.html#3b
replaces_leave_behind: _inbox/2026-08-24_rebrand6_auth_pricing_WDLL.md
---

# WDLL: Rebrand (6) checkout 3b

Operator go 2026-08-24. Isolated LDT tree for cortex items 1-2. Isolated hauska-map tree for PE items 4-9. Do not write `P:/seat-worktrees/property/legacy-design-tools` or `P:/seat-worktrees/property/hauska-map`.

The hosted money path is already live. Cortex resolves Solo / Studio / Team by `tier` + `interval` (+ Team `seats`), refuses 503 when that price ID is missing, and the webhook on `checkout.session.completed` grants `pe_user_entitlements` or writes the 30-day unlock. PE `#211` / `#216` send that body and redirect to `checkout.stripe.com`. Operator called that checkout PASS.

3b is chrome and return-to-work, not a new catalog. Same sessions. Same prices. Same webhook. The customer never lands on stock Stripe.

Product choice, frozen here: **Custom Checkout** (`ui_mode: custom`) on the existing Checkout Session. Cortex returns `clientSecret` + `publishableKey`. PE mounts Stripe's Payment Element and owns the submit button, totals, and left column. Webhook stays `checkout.session.completed`. Fallback if Custom Checkout is unavailable on the account: Embedded Checkout (`ui_mode: embedded`), Stripe owns the pay button. Do not rebuild on PaymentIntents. Do not invent card fields.

## Done looks like

Start Solo, Studio, Team, or Unlock from the live pricing popup. The next surface is Smart Site: subscription is a full-page `/checkout` with our left column and Stripe's payment fields on the right; unlock is the same styling in a modal. Night appearance, wallets on, promo codes still work. Pay completes on Stripe inside that chrome. The map comes back with a success card (Studio is active / this parcel is unlocked), entitlement has flipped, and the report that started the buy is running. A hard-refresh of smartsite.cloud never opens `checkout.stripe.com` for those four CTAs.

## Acceptance items

1. **Cortex subscription session is custom.** `POST /api/property-explorer/v1/billing/checkout` accepts `uiMode: "custom"` (or `"embedded"` fallback). Custom sessions send `return_url` and do not send `success_url` / `cancel_url`. Response is `200` with `clientSecret` + `publishableKey` + `sessionId`. No `checkoutUrl` on the custom path. Missing price ID still 503 `checkout_unavailable`. Tier / interval / seats contract unchanged. | check: pe-pricing-ladder tests; violate custom-without-secret and hosted-url-on-custom | depends: none | grade: [met] isolated tree; live custom without `client_secret` throws; custom 200 omits `checkoutUrl`; hosted keep still returns URL

2. **Cortex unlock session is custom.** `POST /api/property-explorer/v1/entitlement/checkout` uses the same `uiMode` contract. Body still `{ parcelNodeId, returnUrl? }`. Metadata still `checkout_kind: property_unlock` + `parcel_node_id`. Webhook still writes the 30-day unlock. | check: pe-paywall-stripe tests | depends: 1 | grade: [met] same contract on unlock + alias; webhook untouched

3. **Hosted remains until PE mounts, then dies.** While PE still redirects, `uiMode` absent or `"hosted"` keeps today's `checkoutUrl`. After item 7 is live on smartsite.cloud, the hosted branch is removed and a test fails if a PE checkout body can still request it. | check: both directions on the cortex handler; PE live probe after alias | depends: 1, 7 | grade: [partial] keep half met; kill waits for PE alias

4. **PE subscription page.** Signed-in Start Solo / Studio / Team opens `/checkout` (or equivalent in-app route), not `window.location.assign` to Stripe. Left column is Smart Site markup: product name, amount, interval, included lines, parcel chip when a parcel started the buy, terms. Right column is the Stripe-mounted Payment Element. Submit copy matches the frame (Subscribe and run my report when a report started it; otherwise Subscribe). | check: checkout route render test + live hard-refresh | depends: 1 | grade: [partial] `/checkout` + left column + mount wired in tree; live Element waits on a serving cortex secret

5. **PE unlock modal.** Unlock this parcel mounts the same Element in a modal. Header is the situs + $15.00 + 30 days. Submit is Pay $15.00. No full-page navigation. | check: unlock modal test + live | depends: 2 | grade: [partial] chrome + mount wired; live Element waits on serving secret

6. **Appearance and wallets.** Stripe Appearance API: theme `night`, colorPrimary `#3B82F6`, colorBackground `#141921`, colorText `#F8FAFC`, colorTextSecondary `#94A3B8`, borderRadius `6px`, fontFamily Inter. Apple Pay and Link stay on. Promo codes still apply on the subscription session. No Oxygen CDN. No recolored Google G. | check: appearance object unit test; live wallets on a sandbox card | depends: 4 | grade: [partial] appearance passed into initCheckout; wallets / promo wait on a live session

7. **Client refuses a missing secret.** `startPeCheckout` / `startPropertyUnlock` treat `clientSecret` as the custom-path success. A 200 without a secret and without a hosted fallback is an honest error, never a fake success. `isStripeCheckoutUrl` is not the only success check. `@stripe/stripe-js` is the only card UI. CSP allows `js.stripe.com` (and Stripe frame hosts) or the mount fails loud. | check: billingClient tests; violate empty-secret 200 | depends: 4, 5 | grade: [met] empty-secret 200 is error; hosted Stripe URL still fallback; CSP in vercel.json

8. **Return card + entitlement.** On complete, the customer is on Smart Site (return_url or in-app complete). Entitlement poll still runs. The thin `checkout-reconcile-banner` is replaced by the 3b success card: plan name or unlock, receipt line, Open reports, Billing. A timeout still says confirming failed, never paid. | check: post-checkout tests + live after a sandbox pay | depends: 7 | grade: [partial] success/timeout card in tree; live pay leftover

9. **Queued report runs.** If checkout started from a locked report or export, that job starts when entitlement confirms. The success card names it. A checkout that did not start from a report does not invent a job. | check: persist-and-kick test; violate "no origin, still kicked" | depends: 8 | grade: [partial] kick gated on origin; default kick is a no-op record until engine wire

## Do not

- Invent card, email, or ZIP fields. Stripe owns those.
- Rebuild on PaymentIntents or a second webhook path.
- Change prices, product IDs, or grant rules.
- Flip live-mode Stripe keys (operator, end of QA list).
- Build Team invite, seat admin, dunning, or plan-change self-serve.
- Write `P:/seat-worktrees/property/hauska-map`. Isolated hauska-map tree only.
- Write the property LDT checkout from a PE tree. Cortex is a property/LDT branch.

## Sequencing

Cortex items 1-2 on an isolated LDT tree from current serving main. PE items 4-9 on an isolated hauska-map tree from `origin/main` after #216. Item 3 hosted-kill is the last merge, after the PE alias. Two writers, one WDLL. PE does not mount until item 1 returns a secret against a known violation fixture.

## leave_behind

- item: PE-user Stripe Customer Portal for the success-card Billing button
  owner: property / LDT
  plan_row: P-60
- item: live-mode key + price ID swap
  owner: operator
  plan_row: P-60
- item: Team invite / seats / dunning / plan change (locked GTM launch blockers)
  owner: later card
  plan_row: P-60
