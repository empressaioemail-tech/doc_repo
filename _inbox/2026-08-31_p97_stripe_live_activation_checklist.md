---
title: Stripe live-activation checklist (P-97)
date: 2026-08-31
status: active
plan_row: P-97
owner: operator executes; planner does the deploy and the proofs
related:
  - _decisions/2026-08-24_stripe_annual_pricing_and_live_activation.md
  - _inbox/2026-08-31_p97-stripe_close.json
---

# Stripe live-activation checklist

Produced by a read-only audit lane against `legacy-design-tools` origin/main and `hauska-map` origin/main, 2026-08-31. Every claim below carries a `file:line`; the lane was instructed to read the write path and to treat a comment disagreeing with the code as a finding.

Stripe is deliberately in TEST mode per the 2026-08-24 decision. Nothing here performs the switch. This is what the switch runs against.

## The correction to the 2026-08-24 decision

That decision says going live is "a key and price-ID swap only." It is not. The webhook signing secret is a genuine third swap: live-mode endpoints issue their own, and the audit confirmed it from the code path. Leaving it on the test value means every live event fails its HMAC, the route returns 400, and Stripe collects the payment while no entitlement is ever written. Stripe retries for roughly three days and then disables the endpoint.

That is the single most expensive failure available on this list, and the only place it is visible is Stripe's own delivery log.

## Phase 0 — before touching Stripe at all

**1. Fix the silent tier downgrade in the PE checkout client.** `hauska-map apps/property-explorer/src/lib/billingClient.ts:103-106` falls back to `startPeCheckoutInstallScoped` on a 403 or 404, which posts a hardcoded `tier: "pro"` with no interval and no seats, resolving to the retired pre-ladder `STRIPE_PRO_PRICE_ID`. A Studio, Team or annual click opens a Pro checkout at the wrong amount and says nothing. The planner verified this at source. 403 is reachable: the same-origin deep proxy returns exactly 403 for any path missing from `api/_lib/deep-allowlist.ts`, which happened to a different route the same day. This is the only item on the list the operator cannot close in the Stripe dashboard. In flight as its own lane.

**2. Measure the stale-customer blast radius.** `SELECT count(*) FROM pe_user_entitlements WHERE stripe_customer_id IS NOT NULL;` and the same on `brokerage_wallets`. The number must exist before step 12 is planned.

**3. Build the PE billing portal. The published terms are ahead of the product, and this is exposure rather than polish.** Operator ruling 2026-08-31, elevated from a checklist line to a blocking Phase 0 item.

`apps/property-explorer/public/terms.html` states verbatim: "You can cancel a paid plan through the Stripe billing flow in the product." Zero billing-portal references exist anywhere in `apps/property-explorer` — verified by grep, not inferred.

The sharp version of the problem: **the product is honest and the legal page is not.** `SettingsModal.tsx:21-22` says in its own header comment that "payment method, invoices and cancel need a billing portal that does not exist", and the Plan tab renders "Not built" to the user's face. So the app declines to overclaim while the terms overclaim on its behalf. That is the inversion of the usual failure and it is the half that carries legal weight, because the terms are the document a customer is held to and holds us to.

Taking live money against a cancellation promise the product cannot honour is the exposure. It is not a copy defect.

**The fix is small, which is why "amend the terms" is the wrong trade.** The Stripe call already exists and is already proven: `brokerageStripe.ts:245` posts to `/billing_portal/sessions` for the install-scoped seam, and `POST /api/brokerage/v1/billing/portal` is live. What is missing is only the PE user-scoped equivalent. `propertyExplorer.ts` carries `billing/checkout` and `billing/property-unlock/checkout` and no portal route at all.

So the work is: a `POST /property-explorer/v1/billing/portal` that opens a portal session against the signed-in user's `stripe_customer_id`; that path added to `api/_lib/deep-allowlist.ts` (omitting it returns 403, which is the defect class that bit `ai-connections` the same day); and a control in Settings > Plan replacing the "Not built" state. Removing a promise we can cheaply keep, in order to ship faster, trades a customer-facing capability for nothing.

Verification: a signed-in POST to the new route returns a `billing_portal` URL on the customer's own id, the Settings Plan tab no longer renders "Not built" for cancel, and the terms sentence is now true. If the decision goes the other way and the terms are amended instead, the verification is that the sentence is gone before any live charge, not after.

## Phase 1 — build the live objects (operator)

**4. Activate the live account** (business details, bank account). Verify: `curl -u sk_live_…: https://api.stripe.com/v1/balance` returns 200 rather than an activation error.

**5. Create the eight live prices.** Solo $49/mo, Studio $129/mo, Team $299/mo, extra seat $25/mo, unlock $15 one-time, Solo $490/yr, Studio $1,290/yr, Team $2,990/yr. Verify each with `GET /v1/prices/{id}` and check `unit_amount` **and** `recurring.interval` against the ladder. Nothing in the code reads either field, so a monthly price sitting in an annual slot bills $49/mo against a $490/yr click and raises nothing anywhere.

**6. Decide `STRIPE_PRO_PRICE_ID` and `STRIPE_MAX_PRICE_ID`.** There is no safe "leave the test value" — see step 15.

**7. Create the live webhook endpoint** at `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/billing/stripe/webhook`, subscribed to exactly three event types: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` (`brokerageStripe.ts:394`, `:499`, `:568`). Verify the endpoint's event list has length three. Any fourth type returns 400 on every delivery, which Stripe scores as endpoint failure and can disable the endpoint over.

**8. Disable the test-mode webhook endpoint** that points at production, or every test event now 400s against the live signing secret.

**9. Recreate promotion codes in live mode.** They are mode-scoped, and `allow_promotion_codes: true` is set on the PE subscription path (`pePaywallStripe.ts:378`), so any live code is redeemable by anyone holding it. Verify `GET /v1/promotion_codes` returns exactly the intended set, including empty if that is the intent.

**10. Create the live Customer Portal configuration** if the extension portal route stays alive, or `/billing/portal` 502s.

**11. Do not enable any delayed-settlement payment method** (ACH, bank debit, deferred Link). `checkout.session.async_payment_succeeded` is not handled: that path collects money and grants nothing.

## Phase 2 — cut over

**12. Planner: clear stale test-mode customer ids.** `getOrCreatePeStripeCustomer` (`pePaywallStripe.ts:246-251`) returns the stored id unconditionally. A test `cus_` under a live key gives Stripe a 400 "No such customer" and a 502 out, and nothing clears it: the write that would replace it (`peIdentity.ts:241-243`) only runs on a successful checkout that the stale id prevents. It is self-deadlocking. Verify the count from step 2 is now zero.

**13. Operator: add new versions to every Stripe secret** in `legacy-design-tools-prod`. Verify `gcloud secrets versions list <NAME>` shows a new enabled version for each.

**14. Planner: deploy a revision pinned to the currently serving image.** `deploy-canary` defaults `image_tag=latest`, and `latest` does not always point at the serving digest. Pass the serving image's tag explicitly so the secret swap is the only change, then shift traffic. Verify the new revision's digest equals the old one, read as JSON by field name.

**15. Handle PRO/MAX explicitly.** A stale test id makes `subscriptionTierFromPriceId` (`brokerageStripe.ts:60-62`) fall through to `"pro"` for every subscription forever. An EMPTY value is worse: `brokerageStripe.ts:174` returns a **simulated** session with a fake success URL under a live key, failing open with no error anywhere.

## Phase 3 — prove it (planner)

**16. Prove the key swap.** Signed-in `POST /api/property-explorer/v1/billing/checkout` with `{tier:"solo",interval:"month",uiMode:"elements"}`. Two independent derivations: `publishableKey` starts `pk_live_` (from cortex env) and `sessionId` starts `cs_live_` (from Stripe). Abandon the session. Do **not** use `GET /billing/status` — its `liveCheckout` field is literally `isStripeConfigured()` and reads true in test mode today.

**17. Prove the webhook secret by violating it.** A deliberately bad `stripe-signature` must return 400 `invalid_signature`. Then use Stripe's "Send test webhook" on the live endpoint for `customer.subscription.deleted` and expect 200. A check observed only passing has not been observed working.

**18. One real purchase per SKU** with a live card, using a 100%-off live promo where possible: Solo monthly, Solo annual, Studio, Team base, Team +1 seat, $15 unlock. Verify `GET /api/property-explorer/v1/entitlement` shows the right `subscriptionTier`, and for Team that `seats_purchased` equals the purchased total rather than null.

**19. Prove churn.** Cancel one live subscription. Verify the delete event delivers 200 and the entitlement drops to free.

**20. Read the delivery log 24h later.** Zero 4xx. Any 400 is either a fourth subscribed event type or a real grant failure, and both mean money was taken.

## Fails silently — these cost real money

These do not raise, do not 500, and appear in no log the operator reads.

The webhook signing secret left on test. Payment collected, entitlement never written.

A live price with the wrong amount, or a monthly price in an annual slot. `stripePriceIdForPeTier` (`pePaywallStripe.ts:107-114`) returns the string and it goes straight onto the line item. The customer is billed correctly by Stripe, at the wrong price.

Team seats zeroed or under-counted. `resolveTeamSeatsPurchased` (`peTeamSeatsFromStripe.ts:19-20, 97`) compares billed price ids against the configured ones. A stale base id gives `seats_purchased` NULL; a stale seat id leaves extras uncounted while the customer pays for them.

Install-scoped Max subscribers granted Pro, and an empty PRO id returning a simulated checkout under a live key.

Studio, Team and annual clicks charging the Pro price. Phase 0 item 1.

No API version pin anywhere: no `Stripe-Version` header and no `api_version` at either call site (`brokerageStripe.ts:129-136`, `:651-653`). The account's dashboard default governs and can change under the code with no deploy. Related: `periodEndFromStripe` (`:609-613`) reads `current_period_end` off the subscription root, a field that moved to the subscription item in recent API versions, and returns null if absent.

No Stripe Tax. No `automatic_tax`, `customer_update`, `billing_address_collection` or `tax_id` anywhere. Enabling tax is a code change, not a dashboard switch.

## Comments that disagree with the code

`pePaywallStripe.ts:23-26` claims the retired PRO/MAX pair is never read on a live PE path. True of that file, false of the product: it is reached from a live PE surface via Phase 0 item 1. A negative-reachability claim scoped to one file is not a claim about the system.

`peTeamSeatsFromStripe.ts:76,78` says "10" where `PE_TEAM_INCLUDED_SEATS = 3`. `propertyExplorerBilling.ts:92-97` names a field `liveCheckout` that only means a secret key is non-empty. `brokerageBilling.ts:116-121` reports "complete checkout first" for a customer that exists in the other mode.

Outside the brief: the webhook signature check parses `t=` at `brokerageStripe.ts:737` and never compares its age to now, so there is no replay window. Security rather than a cutover blocker.

## Unestablished

Whether Cloud Run resolves `secretKeyRef :latest` at deploy time or instance start; step 14 is correct under either. Whether the Chrome extension still ships a checkout button, since its source is a separate repo. The account's current default Stripe API version. Whether live coupons or a portal configuration already exist. The amounts behind the eight test price ids, which would need the Stripe key.
