---
id: 02_gohighlevel_buildout
title: GoHighLevel buildout — from an empty login to the bizops platform
status: draft
last_updated: 2026-08-31
applies_to: smart_site
owner: nick
related:
  - _smartsite_gtm/00_README
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - _decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby
  - _inbox/2026-08-10_smartsite_humanless_gtm_handoff
  - 76h_property_explorer_gtm
purpose: The build order for GoHighLevel from an empty account, and the rules that keep it from becoming a second writer of subscription state. Written 2026-08-31 when the operator named GoHighLevel the bizops platform with nothing yet configured.
---

# GoHighLevel buildout

The operator holds a login and nothing is configured. That is the best possible moment to write this, because platform shape drives behaviour and GoHighLevel is a platform with strong opinions that do not all match ours.

## What GoHighLevel is here for, and what it is not

GoHighLevel is built for agencies running human-led sales: pipelines, appointment booking, call tracking, follow-up sequences that end in a conversation. Smart Site is ruled humanless. A subscriber buys without talking to anyone, and there are no demos, no contact-us pricing, no negotiated deals, and no onboarding calls. Pointing the platform's sales machinery at Smart Site subscribers would break a standing operator ruling by drift rather than by decision, which is the way rulings usually break.

The legitimate jobs are four, and they are real ones.

Affiliate and partner recruiting is a human sales motion and is the platform's best fit. Signing a group owner or an influencer to carry a link is exactly a pipeline with stages, outreach, and follow-up. This is the primary reason GoHighLevel exists in the stack at launch.

Social publishing and the content calendar run through the social planner, one place feeding every channel.

Lifecycle and marketing messaging to contacts, which is broadcast and automation, not sales conversation.

The separate Empressa Solutions and SmartCity OS motions, where human sales is allowed and where a real pipeline belongs.

## The rule that must not bend

The Stripe webhook is the sole writer of a subscriber's tier. GoHighLevel receives that tier as a tag and never produces one. A tier that arrives from a form, a client, or a manual edit is an asserted value, and this operation does not ship asserted values where an earned one exists.

The trap that makes this concrete: GoHighLevel ships its own Stripe integration for its own products, invoices, and subscriptions. If that integration is connected and used to sell anything Smart Site shaped, there are now two systems creating Stripe subscriptions, only one of which grants entitlement. A customer would pay, PromoteKit would credit an affiliate, and the product would never grant access. Do not connect GoHighLevel Payments to the Stripe account that runs Smart Site subscriptions. If a GoHighLevel-originated charge is ever needed, for a Solutions deposit or a partner fee, it goes through a separate account or product line and never through the Smart Site catalog.

## The sovereignty line

Identity, funnel stage, and qualified signal cross into GoHighLevel. Tenant-private work does not. That a user inspected a parcel is funnel signal and may cross. Which parcel they inspected is their research and may not. Saved properties, report payloads, adjudications, notes, and screens never leave the product. This is the same boundary the Pipedrive wiring carried in `76h` and it is a customer-trust requirement, not a preference.

A second boundary carries over from the G-63 ruling: a person in the CRM never becomes a city dashboard feed. The municipal motion and the subscriber motion do not share a contact pool.

## Build order

The phases are ordered by lead time and by what blocks what. Phases 1 and 2 should start immediately because their long poles are external approvals, not work.

### Phase 0. Account and identity

Set the company identity to Legacy Group ATX LLC, the operating company, matching the entity already displayed in Stripe checkout. Set the timezone to Central. Add users. Decide agency versus single-account posture before creating anything, because restructuring later means migrating contacts.

### Phase 1. Sub-account structure

Recommendation: separate sub-accounts per motion rather than one pooled account. Smart Site subscribers and affiliate partners belong in one; the municipal and Solutions pipelines belong in another. The reason is not tidiness. The humanless ruling applies to one of those motions and not the other, and a single pooled account makes it easy for a Smart Site contact to enter a sales sequence that the ruling forbids. Separate accounts make that a deliberate act rather than an accident.

### Phase 2. Sending infrastructure, started early

Email sending needs a domain with SPF, DKIM, and DMARC configured, and it needs warmup. Use a marketing subdomain rather than the apex, so that marketing sending reputation cannot damage the deliverability of transactional mail from the product. Nothing about launch volume justifies risking the receipt a customer needs.

SMS needs A2P 10DLC brand and campaign registration, which is an external approval with real lead time and which requires the EIN, a live website, and published privacy and terms pages. Start it in the first session even if SMS is not in the launch plan, because it is the item most likely to be discovered late.

Verify at setup which social channels the planner supports on the current plan rather than assuming the full list.

### Phase 3. Taxonomy, before any contact exists

Define tags and custom fields before importing or syncing anything. Retrofitting a taxonomy across a live contact base is the expensive version of this work.

The minimum set: a product tag distinguishing Smart Site from other motions; tier tags for free, solo, studio, and team, written only by the Stripe webhook path; an acquisition source tag distinguishing affiliate, share, agent surface, and organic; and an affiliate identifier field for partner attribution. Lifecycle stage stays a native field rather than a tag so that reporting works.

### Phase 4. Social planner and the content calendar

Connect the channels, then load the five content pillars from the strategy doc as a recurring calendar. Every asset draws its language from the masters and is checked against the never-say list before it is scheduled. The planner is where the calendar lives; the masters are where the claims live.

### Phase 5. Affiliate recruiting pipeline

Stages from identified through contacted, applied, approved, link issued, and first conversion. An application form gates approval, which is what makes the opt-in recommendation in the strategy doc operable. The affiliate kit per segment attaches at the approved stage. PromoteKit issues and tracks the link; GoHighLevel tracks the relationship. Neither is the record of the other.

### Phase 6. The product-to-CRM pipe

This is a code item and it does not exist yet. The recommended shape is a direct call to the GoHighLevel API from the Stripe webhook handler in cortex-api, upserting the contact and writing the tier tag at the same moment entitlement is minted. That keeps the webhook as the single writer and keeps a third party out of the money path. The credential lives in Secret Manager and never in the PE bundle, matching the Pipedrive ruling it inherits from.

Funnel and activation events flow the same direction and only in the shapes the sovereignty line allows.

Note for planning: HighLevel work currently has no plan row and is recorded as on hold pending an API key (OPS-16 A-060). Phase 6 is the part that needs one.

### Phase 7. Lifecycle messaging

Only after phases 2, 3, and 6, because messaging without a taxonomy and without tier tags is untargeted broadcast. Dunning is a named gap in the launch readiness program and is a candidate to run here or in Stripe; the decision should be made deliberately rather than by whichever is configured first.

## What supersedes what

The 2026-08-17 ruling names Pipedrive as the Smart Site subscriber CRM. Naming GoHighLevel the bizops platform supersedes it in substance, and the reasoning in that ruling survives intact and transfers: the Stripe webhook writes the tag, the client never does, and a CRM person never becomes a city feed. That supersession should be recorded as its own decision rather than left implicit in this document, and the reversal criteria should carry over with one addition, a usage checkpoint at the first month of live tags. If nobody reads the tagged-subscriber view in that window, the CRM is a control nobody consults and the operator should be told so rather than the tool being kept out of momentum.

## Verified state, 2026-08-31

Credential provisioned and proven live by the planner. Instrument: `curl` against `https://services.leadconnectorhq.com` with `Authorization: Bearer <pit token>` and `Version: 2021-07-28`, each probe paired with a deliberately bogus location id as a control.

The credential is a v2 Private Integration token, `pit-` prefixed, stored operator-local at `_secrets/gohighlevel-api-key.txt` with the sub-account id at `_secrets/gohighlevel-location-id.txt`. Both written without a trailing newline, matching the WorkOS pair already in that directory. `_secrets/` is gitignored at `.gitignore:2` and neither file is tracked.

Sub-account is `KtUXFiFB5e22abpLp1MR`, named Smart Site. The agency-level company id is `vKCvP5UtZmDLMD4A6T4F`; it is not a secret and is recorded here rather than in `_secrets/`. The operator's own user carries an agency-type role, so the per-motion sub-account split in Phase 1 is available without a plan change.

Scopes proven live by a 200: locations, contacts, opportunities, and users. Nothing beyond those four has been tested and none should be assumed.

The verification is only meaningful because of the control. On the first two attempts the real location and a bogus one returned byte-identical errors, which meant the scope check was firing before the location was ever evaluated and the probe proved nothing about the location at all. The passing run is the one where the real id returned 200 while the bogus id returned 403 `token does not have access to this location`. A probe whose control matches its subject is not a test, and this credential should be re-verified the same paired way after any scope or token change.

## Account housekeeping owed before real data lands

Two artifacts shipped by the vendor sit in the sub-account and neither is ours.

Seeded example contacts, carrying an `(example)` name prefix. Purge them before any real contact is written, or they persist in the base and skew every count and every automation that filters on all contacts.

A default pipeline named "Marketing Pipeline", created 2026-08-31T21:43:16Z by the platform rather than by us. The Phase 5 affiliate recruiting pipeline needs its own named stages. Rename or delete the default rather than building on it, so a later reader cannot mistake a starter artifact for a designed one.

## Verify at setup

Social channel support on the current plan. Whether the API version in use is v2 and whether a private integration token is the current credential shape. Whether A2P registration requires anything not already published on the site. Every one of these is a vendor detail that changes, and none should be taken from this document without confirming it against the account.
