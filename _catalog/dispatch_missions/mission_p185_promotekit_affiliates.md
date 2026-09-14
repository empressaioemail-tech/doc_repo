## Mission — P-185 PROMOTEKIT AFFILIATES: every Smart Site checkout carries the referral, and a referred sale shows up on the affiliate's dashboard

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews CP1 and CP2 in this thread. The operator
owns the PromoteKit dashboard (campaign, commission, cookie window) and Stripe test-mode keys.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### What PromoteKit needs (read at its dashboard 2026-09-14, Stripe Setup step 4)

Two tracking options, both enabled: affiliate links (`smartsite.cloud/?via=<affiliate>`) and
promo codes. The Stripe Checkout path, which is ours, has two halves:

1. The script on every page an affiliate can link to:
   `<script async src="https://cdn.promotekit.com/pk.js" data-promotekit="5d6458ec-b6b9-47df-a587-c2c255db7e8d"></script>`
   (the id is the public site id, not a secret). It sets `window.promotekit_referral`; it is
   NOT populated on localhost, so verification is on a deployed preview or production.
2. The referral id sent to Stripe when the checkout session is created:
   `metadata[promotekit_referral]` on the session, and for subscriptions ALSO
   `subscription_data[metadata][promotekit_referral]` (PromoteKit's "Subscription" tab), so
   renewals attribute. Optional: `window.promotekit.refer(email, stripe_customer_id)` to attach
   a signup by hand. Promo codes need `allow_promotion_codes=true` on the session.

### Where the code is (origin/main, read 2026-09-14)

- Site shell: hauska-map `apps/property-explorer/index.html` (one `<script type="module">`
  today; the PromoteKit tag goes in `<head>` on this page, which is every page of the app).
- Client: hauska-map `apps/property-explorer/src/lib/billingClient.ts` POSTs
  `/api/property-explorer/v1/billing/checkout` (subscriptions) and
  `/api/property-explorer/v1/entitlement/checkout` (per-parcel unlocks) through the cortex
  proxy; both bodies are where the referral id rides.
- Server: legacy-design-tools `artifacts/api-server/src/routes/propertyExplorer.ts` (routes at
  lines 1540 and 1887) call `artifacts/api-server/src/lib/brokerageStripe.ts`, which creates the
  session by form-encoded REST at line 280 (`stripePostForm("/checkout/sessions", ...)`), not
  the Stripe SDK; metadata is therefore `metadata[promotekit_referral]=<id>` as a form field.
- Webhooks in `brokerageStripe.ts` (`setPeAccessTierFromStripe`, subscription resolution) do
  not need to change; PromoteKit reads Stripe itself.

### Where you work

`hauska-map-p185-promotekit` (branch `feat/p185-promotekit-script-and-referral`) and
`legacy-design-tools-p185-promotekit` (branch `feat/p185-promotekit-checkout-metadata`), from
`origin/main`; declare start commits.

### What you build, in order

1. **Server first (safe without the client).** Both checkout routes accept an optional
   `promotekitReferral` string (validated: short, no whitespace; anything else ignored, never
   an error) and pass it as `metadata[promotekit_referral]` and, on the subscription route,
   `subscription_data[metadata][promotekit_referral]`; read whether `allow_promotion_codes` is
   already set and set it if not. Tests both ways: with the field the form body carries both
   keys; without it neither key appears. Merge on the conclusion string; deploy cortex-api
   under a lease (P-177's rule; check `_catalog/leases/` in your doc_repo worktree first).
2. **Client.** The script tag in `index.html` head; `billingClient.ts` reads
   `window.promotekit_referral` at checkout time (never cached at load, the script may land
   later) and sends it in both POST bodies when present. A unit test that a body without a
   referral has no field. Deploy through the Vercel CLI; verify the alias serves the tag.
3. **Verify by violation, on production or a deployed preview, with Stripe in test mode if the
   operator supplies a test key; otherwise a real $0 or promptly refunded checkout on the
   operator's say-so.** (a) Open `https://smartsite.cloud/?via=<test affiliate the operator
   creates>`; confirm `window.promotekit_referral` is set in the console; run a checkout; read
   the created session in Stripe (`gh`-style: `curl https://api.stripe.com/v1/checkout/sessions/<id>`
   with the operator's key, never printed) and paste that `metadata.promotekit_referral` equals
   the id; the operator confirms the referral appears in PromoteKit. (b) Open the site with no
   `?via=`, run a checkout, paste that the session has no such metadata. (c) A promo code
   PromoteKit issued applies at checkout.
4. **Records purchases.** The MCP connector's paid records requests (P-85/P-113) go through
   their own route; read whether they create checkout sessions; if they do, name it as a
   leave-behind with the route, do not change it this lane.

### Falsifiers

- If a session created from a `?via=` visit has no `promotekit_referral` metadata, the id did
  not travel; name which hop dropped it (script, client body, proxy, server form).
- If a session created without a referral carries the field, the client cached a stale value.
- If a subscription's `subscription_data` lacks the metadata, renewals will not attribute.

### Out of scope

Commission rates, cookie windows, payouts (the operator's dashboard). Affiliate-facing pages.

### Close

`_inbox/<date>_p185-promotekit_close.json`, `planRows` `["P-185"]`, with the PRs and merge SHAs
with conclusion strings, the revisions and deployment by field, the two session reads (ids,
metadata, no keys), and the operator's PromoteKit confirmation. `leave_behind` is required.
