---
id: 2026-09-01_a062_pe_billing_portal_WDLL
title: WDLL — A-062: the PE billing portal, the live-money blocker
date: 2026-09-01
last_updated: 2026-09-01
status: open
applies_to: legacy-design-tools (api-server propertyExplorer.ts), hauska-map (property-explorer Settings + deep-allowlist)
plan_row: P-97
depends_on: _inbox/2026-08-31_p97_stripe_live_activation_checklist.md Phase 0 item 3, 90_operations/OPS-16_texas_market_plan_of_record.md A-062, _smartsite_gtm/06_consolidated_roadmap.md Wave 1.1
operator_go: 2026-08-31 (ruled a BLOCKING Phase 0 item, elevated from a checklist line)
snapshot: planner read 2026-08-31 against LDT origin/main d1154938 and hauska-map origin/main 333c3c05, plus live probes on smartsite.cloud
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# A-062 the PE billing portal

Date: 2026-09-01  Status: open

This is Wave 1.1 of `_smartsite_gtm/06_consolidated_roadmap.md` and it gates the Stripe live switch. It sat unowned across two parallel working threads because each assumed the other held it.

## The defect, stated sharply

`apps/property-explorer/public/terms.html` states verbatim: "You can cancel a paid plan through the Stripe billing flow in the product." Zero billing-portal references exist anywhere in `apps/property-explorer`, verified by grep rather than inferred.

The product is honest and the legal page is not. `SettingsModal.tsx:21-22` says in its own header comment that payment method, invoices and cancel need a billing portal that does not exist, and the Plan tab renders "Not built" to the user's face. The app declines to overclaim while the terms overclaim on its behalf. That is the inversion of the usual failure and it is the half carrying legal weight, because the terms are the document a customer is held to and holds us to.

Taking live money against a cancellation promise the product cannot honour is the exposure. It is not a copy defect, and amending the terms is the wrong trade because the fix is small.

## What already exists, so do not rebuild it

The Stripe call is built and proven. `brokerageStripe.ts:245` posts to `/billing_portal/sessions`, and `POST /api/brokerage/v1/billing/portal` is live on the install-scoped seam. What is missing is only the PE user-scoped equivalent. `propertyExplorer.ts` carries `billing/checkout` and `billing/property-unlock/checkout` and no portal route at all.

A lane that writes a second Stripe portal client fails this card.

## Sequencing hazard, read this before starting

The P-98b client lane has an unmerged branch `feat/p98b-account-entitlement-client` on hauska-map that changes `SettingsModal.tsx` by +210/-74, and it is the branch that makes the Plan tab able to read account state at all. **The Settings half of this card must land after that branch merges, or the two rewrite the same file.** The server half of this card has no such conflict and can start immediately.

Check `gh pr list --repo empressaioemail-tech/hauska-map` before touching `SettingsModal.tsx`.

## Done looks like

A signed-in paying customer can open the Stripe billing portal from Settings, on their own customer id, and cancel. The sentence in `terms.html` becomes true. A signed-in customer who has never paid gets an honest refusal rather than a portal, an error, or somebody else's account.

## Acceptance items

1. **The route, user-scoped and fail-closed.** `POST /property-explorer/v1/billing/portal` resolves `stripe_customer_id` from the authenticated session and never from the request body, a header, or a query parameter. A caller-supplied customer id is refused, not honoured, and a test proves the refusal. Reuse the existing portal client; do not write a second one. | check: fail-then-pass where a request body carrying another user's `stripe_customer_id` is refused | grade: [ ]

2. **No customer id is a declared refusal, never a fabricated one.** A signed-in user with no `stripe_customer_id` (free, or never completed a checkout) gets a declared refusal naming that state. It must not return a portal for a different customer, must not create a Stripe customer as a side effect of asking for a portal, and must not return a 500. Absent is a real and common state here and it is distinct from an error. | check: fail-then-pass on a signed-in user with a null `stripe_customer_id`; a test that a Stripe customer was NOT created | grade: [ ]

3. **The allowlist entry, proven by its own test and not by a probe.** The new path is added to `apps/property-explorer/api/_lib/deep-allowlist.ts` in `DEEP_POST_EXACT`. Omitting it returns 403 from the same-origin deep proxy, which is exactly the defect class that made the `ai-connections` card dead for every user on 2026-08-31. The proof is a parity test that imports the path constant the CLIENT builds its request from, not a retyped string, and not a production 401 (the proxy checks the cookie before the allowlist, so a signed-out caller gets 401 either way and that proves nothing). | check: a parity test asserting `isDeepPathAllowed('POST', <the client's own constant>)` is true | grade: [ ]

4. **The return URL points at Smart Site.** The portal session's `return_url` must land the customer back on the Smart Site host. Do not inherit the server default at `pePaywallStripe.ts:126-129`, which is the hardcoded `https://property-explorer-xi.vercel.app/`. Send it explicitly from the client the way `billingClient.ts:98-99` already does for checkout. | check: a test pinning the sent `return_url`, plus a live open showing the customer returns to smartsite.cloud | grade: [ ]

5. **Settings > Plan replaces "Not built" with a working control, and only where it is working.** The cancel and manage-payment rows get a real control. Rows that remain genuinely unbuilt keep saying so; this card does not license turning every "Not built" into a button. The panel's own printed rule stands: a field with no traced source says so. | check: fail-then-pass on the cancel row rendering a control for a customer WITH an id and the honest state for one without | grade: [ ]

6. **The terms sentence is now true, and something says so.** A test or check that fails if `terms.html` claims an in-product cancellation path while no portal route is mounted. This is the item that keeps the defect from returning: the two halves drifted apart once already and nothing noticed. | check: a check that reads both the terms string and the route table and fails on disagreement | grade: [ ]

7. **Verify by violation, both directions.** Every check above shown failing on a deliberate violation and passing on restore, with verbatim failure text. A check observed only passing has not been observed working. | check: the close artifact carries both directions per item | grade: [ ]

## Live-mode dependency, named so it is not discovered late

The Stripe Customer Portal has a per-mode configuration. Checklist item 10 requires creating the live Customer Portal configuration, and without it `/billing/portal` returns 502 in live mode. Test mode has its own configuration, so **this card is fully buildable and verifiable in test mode today** and the live configuration is an operator step in Phase 1, not a blocker on this build.

## Explicitly not this card

Do not amend `terms.html` to remove the promise; the ruling is to keep the promise and build the capability. Do not retire `api/pe-billing.ts`; that is ruled and is its own item in Wave 1.2. Do not touch the install-scoped `POST /api/brokerage/v1/billing/portal` route or the extension's portal path. Do not perform the Stripe live switch or create any live Stripe object. Do not build dunning, invoice history, or payment-method update UI beyond what the portal itself provides; the portal is Stripe's surface and we link to it.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
