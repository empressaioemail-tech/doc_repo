---
decision_id: 2026-08-31_gohighlevel_supersedes_pipedrive
date: 2026-08-31
owner: operator
status: active
supersedes: 2026-08-17_smartsite_gtm_pipedrive_popup_hobby
related_canonical:
  - _decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby
  - _smartsite_gtm/02_gohighlevel_buildout
  - _smartsite_gtm/00_README
  - 76h_property_explorer_gtm
  - _smartsite_masters/06_smart_site_gtm_audiences_and_pricing
---

# Decision

GoHighLevel is the bizops platform. It supersedes Pipedrive as the Smart Site subscriber CRM named in the 2026-08-17 ruling.

The reasoning of that ruling survives intact and transfers without change. The Stripe webhook is the sole writer of a subscriber's tier; the CRM receives it as a tag and never produces one. A CRM person never becomes a city dashboard feed. Everything else in the 2026-08-17 record that is not about Pipedrive specifically, the pricing popup and the Vercel Hobby posture, is untouched by this and stands.

## Context

The operator named GoHighLevel the bizops platform on 2026-08-31, holding a login with nothing configured. The Pipedrive wiring ruled on 2026-08-17 was never built; the property seat's own state note recorded "Pipedrive + pricing popup not built," so this supersedes a decision, not an implementation. OPS-16 A-060 recorded HighLevel as on hold pending an API key with no plan row. That hold cleared the same day: a v2 Private Integration token was provisioned and proven live against sub-account `KtUXFiFB5e22abpLp1MR`, with locations, contacts, opportunities, and users scopes returning 200 against a bogus-location control returning 403.

## Structural commitment check

- Confidence earned: preserved and load-bearing. A tier tag written by anything other than the Stripe webhook is an asserted value.
- Tenant sovereignty: preserved. Identity, funnel stage, and qualified signal cross into the CRM; tenant-private research does not. That a user inspected a parcel may cross; which parcel may not.
- Dual interface: not affected.

## Reasoning

The platform choice does not change the seam rules, and the seam rules are the part that was load-bearing. What does change is the risk profile, because GoHighLevel is a materially more capable platform than Pipedrive in ways that can violate standing rulings by drift.

Two risks are named so they are refusable rather than discovered.

GoHighLevel ships its own Stripe integration for its own products and subscriptions. Connecting it to the Stripe account that runs Smart Site would create a second system capable of creating subscriptions, only one of which grants entitlement: a customer pays, PromoteKit credits an affiliate, and the product never grants access. GoHighLevel Payments is not connected to that account. A GoHighLevel-originated charge, if ever needed, goes through a separate account or product line.

GoHighLevel is built for human-led agency sales, and Smart Site is ruled humanless. `_smartsite_masters/06` states it plainly: Smart Site has no sales CRM because it has no sales team, and that machinery belongs to Empressa Solutions and SmartCity OS. Pointing pipelines, appointment booking, or call sequences at Smart Site subscribers would break a standing ruling by drift. The platform's legitimate jobs here are affiliate and partner recruiting, which is genuinely a human sales motion, plus social publishing, lifecycle messaging, and the separate Solutions and municipal pipelines. Separate sub-accounts per motion are the structural expression of that boundary.

## Reversal criteria

Carried from the 2026-08-17 record and extended by one.

Reverse if the webhook cannot write tags without a client-side CRM key. Reverse if a CRM person becomes a Dashboards city feed. Reverse if GoHighLevel Payments cannot be kept off the Smart Site Stripe account. And the addition: a usage checkpoint at the first month of live tags. If nobody reads the tagged-subscriber view in that window, the CRM is a control nobody consults, and that is brought to the operator as evidence rather than the tool being kept out of momentum.

## Dependencies

Depends on the Stripe live switch for any real tier tag to exist. Blocks nothing today. The product-to-CRM pipe is unbuilt and needs a plan row plus the credential in Secret Manager bound to cortex-api, since a webhook handler cannot read an operator's disk.

## 2026-09-04 addendum — narrow, deliberate reversal: a GHL contact now gets created per product sign-up

Operator noticed a real GHL sign-up during testing produced no contact, asked why, was shown this decision's own "no sales CRM" ruling, and explicitly chose to reverse it rather than leave it as-is: "scope it and get a sub agent to build it... all the way to prod."

**What actually reverses, and what does not.** The "no sales CRM" ruling was two things bundled together: (1) no CRM *record* exists for a Smart Site subscriber, and (2) no CRM *machinery* (pipelines, appointment booking, call sequences, human sales stages) is ever pointed at one. Only (1) reverses today. (2) stands untouched — the reversal criteria's own language survives verbatim: pointing pipelines, automations, or workflows at Smart Site subscribers is still refused. A contact record existing is not the same claim as a subscriber entering a sales motion.

**Scope, narrowly:** on a new PE user's first sign-up (session-exchange creating a brand-new `users` row), upsert a GHL contact by email with name + email only. No pipeline. No tag write from this hook — the existing runbook rule stands unchanged: `tier-*` tags are written only by the Stripe webhook off a real payment, never by a signup hook, never typed in. An acquisition-source tag (`source-organic` by default) may be added once the hook exists, since that's consistent with the tags already provisioned for exactly this purpose (R3) — but the ruling against fake `tier-*` writes is not open for reinterpretation by whoever builds this.

**Fail-open, matching the existing `claimAnonymousStateOnSignIn` pattern**: a GHL failure (network, 4xx, credential problem) must never block, delay, or revert a successful sign-in. Best-effort, logged, done.

**The credential dependency this decision itself named is now met**: `GOHIGHLEVEL_API_KEY` and `GOHIGHLEVEL_LOCATION_ID` provisioned into `legacy-design-tools-prod` Secret Manager 2026-09-04 (from the same operator-local file this decision's own dependency section pointed at), `api-server-runtime@legacy-design-tools-prod.iam.gserviceaccount.com` granted `secretAccessor` on both. cortex-api can now reach GHL for the first time since this decision was written.

Reversal criteria for the *machinery* half (pipelines/automations/call sequences at subscribers) are unchanged from the original and remain in force. If this narrow contact-creation piece itself needs reversing, the affected data is exactly the contacts this hook created — identifiable by tag/source, not woven into anything else.


## Counterparties

Internal. Operator owns the account and its configuration. Property seat would own the webhook-side pipe when it is carded.
