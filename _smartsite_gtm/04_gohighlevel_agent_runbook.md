---
id: 04_gohighlevel_agent_runbook
title: GoHighLevel agent runbook — browser setup, step by step
status: active
last_updated: 2026-08-31
applies_to: smart_site
owner: nick
related:
  - _smartsite_gtm/02_gohighlevel_buildout
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - _decisions/2026-08-31_gohighlevel_supersedes_pipedrive
purpose: A self-contained runbook for a browser agent working inside a signed-in GoHighLevel session. Covers only what has no API. Every task states its done-condition and the agent records results in the Report Back section at the end.
---

# GoHighLevel agent runbook

**Read this whole document before starting.** You are working inside a live business account. Several actions in this platform are difficult or impossible to undo, and two of them would break paid systems that are already running. The prohibitions in the next section are not stylistic. Follow them exactly.

You are signed in as an agency-role user. The sub-account you are working in is named **Smart Site**.

## Context you need

Smart Site is a property-intelligence web product. It sells subscriptions through Stripe, on its own website, with no salespeople. GoHighLevel is being set up as the marketing and partner-operations platform beside it, not as a sales CRM for those subscribers.

Money already flows through systems outside GoHighLevel: Stripe takes the payments, a tool called PromoteKit tracks affiliate referrals against those Stripe payments, and PayPal pays the affiliates. GoHighLevel does not touch any of that.

## Absolute prohibitions

**1. Do not connect GoHighLevel Payments to Stripe. Do not enter any Stripe key anywhere in this platform.** GoHighLevel can create its own Stripe products and subscriptions. If it does, customers could pay through a channel that does not grant them access to the product, while the affiliate system still pays a commission. If you encounter a Stripe setup prompt, skip it and record it in Report Back.

**2. Do not create any pipeline, automation, sequence, or campaign that contacts Smart Site subscribers as sales leads.** This product is sold without salespeople by explicit decision. Marketing email and in-product messaging are fine. Sales pipelines, appointment booking, and call sequences aimed at subscribers are not. The one pipeline you will build is for recruiting affiliate partners, which is a different audience.

**3. Do not import, upload, or purchase any contact list.**

**4. Do not delete anything not named in this document.** Where a step says delete, it names the exact item.

**5. Do not send any message, email, or SMS to anyone.** Setup only. If a step offers to send a test to a real person, stop and record it.

**6. If a step requires a decision this document does not cover, stop and record it in Report Back rather than choosing.** An unrecorded guess is worse than an unfinished step.

## What is already done, so do not redo it

The API credential is provisioned and verified working. A Private Integration token exists with locations, contacts, opportunities, and users permissions confirmed live on 2026-08-31. **Do not create a second Private Integration and do not regenerate the existing token**, which would break the verified credential.

The sub-account ID is `KtUXFiFB5e22abpLp1MR` and the agency company ID is `vKCvP5UtZmDLMD4A6T4F`. Neither is a secret; you may need them in URLs and forms. The token itself is not in this document and you will not need it.

---

# Task 1. Confirm where you are

Open GoHighLevel and confirm you are inside the sub-account named **Smart Site**, not at the agency level. The browser URL while inside a sub-account contains `/v2/location/KtUXFiFB5e22abpLp1MR/`. If the URL shows a different location ID, switch accounts before continuing.

**Done when:** the URL contains that location ID. Record the full URL pattern you see.

---

# Task 2. Remove the vendor's demo data

GoHighLevel seeds every new sub-account with sample data. It is not ours and it will pollute every count and every automation that filters on all contacts.

Go to **Contacts**. Find contacts whose names begin with `(example)` or that are otherwise obviously platform-seeded samples. One known example is a contact named similar to "(example) casey morgan". Delete only those. **If any contact does not clearly look like vendor sample data, leave it and record it.**

**Done when:** no `(example)` contacts remain. Record how many you deleted and their names.

---

# Task 3. Replace the default pipeline with the affiliate recruiting pipeline

Go to **Opportunities**, then the pipeline settings. You will find a pipeline named **Marketing Pipeline**, created automatically by the platform on 2026-08-31. It is a vendor default, not ours.

Create a new pipeline named exactly:

```
Affiliate Recruiting
```

Give it exactly these six stages, in this order:

1. `Identified`
2. `Contacted`
3. `Applied`
4. `Approved`
5. `Link Issued`
6. `First Conversion`

Then delete the **Marketing Pipeline** default, but only after `Affiliate Recruiting` exists and shows all six stages. If deleting it is blocked for any reason, rename it to `ZZ - unused vendor default` instead and record that you did.

**Why these stages.** Affiliates are social-media group owners and content creators who will carry a referral link. `Applied` and `Approved` exist because the affiliate program is opt-in by application, so approval is a real gate and not a formality. `Link Issued` is the handoff point to PromoteKit. `First Conversion` is when their link produces its first paying customer.

**Done when:** `Affiliate Recruiting` exists with six correctly-ordered stages and the vendor default is gone or renamed. Record the outcome and any stage the UI would not accept.

---

# Task 4. Create the contact tags

Tags are how everything else in this platform will be segmented later, and retrofitting them across a live contact base is painful. Create them now, before any real contact exists.

Go to **Settings**, then **Tags**, and create exactly these:

```
smartsite
tier-free
tier-solo
tier-studio
tier-team
source-affiliate
source-share
source-agent
source-organic
affiliate-partner
```

**Important:** the four `tier-` tags will be written automatically by our payment system later. **Never apply a `tier-` tag to a contact by hand,** and do not build any automation that sets one. A tier that is typed in rather than earned from a real payment is a false record, and other systems will read it as true.

**Done when:** all ten tags exist, spelled exactly as above. Record any that already existed.

---

# Task 5. Set up the marketing email sending domain

This is the first of two tasks with an external waiting period, so start it even if you do not finish it.

Go to **Settings**, then **Email Services** or **Domains** depending on what your version calls it, and begin adding a sending domain.

**Use a subdomain, not the bare domain.** Use `mail.smartsite.cloud` or `go.smartsite.cloud`. Do not use `smartsite.cloud` itself. The website at that domain sends receipts and account emails that customers must receive, and mixing marketing sending into the same domain reputation risks those.

GoHighLevel will display DNS records to add, typically SPF, DKIM, and a return-path or CNAME entry. **Do not attempt to add these DNS records yourself.** The domain is registered at GoDaddy and that is a separate system. Instead, copy every record exactly as shown, including type, host, and value, and paste them into Report Back.

**Done when:** the domain is entered in GoHighLevel and the full DNS record set is copied into Report Back verbatim. Record whether verification is pending.

---

# Task 6. Start A2P 10DLC registration

This is the longest-lead item in the entire setup. It is an external carrier approval that can take days, and nothing about text messaging works until it clears. Start it even though SMS is not in the immediate launch plan.

Find **Settings**, then **Phone Numbers**, then **Trust Center** or **A2P Registration**. Begin brand registration.

The legal entity is **Legacy Group ATX LLC**. This is the operating company and it is the same entity that appears on Stripe checkout, so the registration must match it. You will likely need the EIN, the business address, and a website URL with published privacy and terms pages.

**Do not invent or guess any value on this form.** Carrier registration with wrong information gets rejected and re-filing is slow. For every field you cannot fill from information in this document, leave it blank and list the field in Report Back.

**Done when:** either the brand registration is submitted, or the exact list of fields blocking it is in Report Back. Both are acceptable outcomes; a guessed value is not.

---

# Task 7. Connect social channels

Go to **Marketing**, then **Social Planner**, and connect the available channels.

Connect what the account offers, which typically includes Facebook Pages, Instagram, LinkedIn, Google Business Profile, TikTok, and X. Each one opens that platform's own login and permission screen.

**If a connection requires credentials you do not have, stop that one and record it.** Do not create new social accounts. Do not connect a personal profile where a business page is the correct target; if only a personal profile is available, skip it and record that.

**Done when:** each channel is either connected or listed in Report Back with the reason it was not. Record the exact list of channels this account offers, since that varies by plan and we have not verified it.

---

# Task 8. Verify the Private Integration permissions

Go to **Settings**, then **Private Integrations**, and open the existing integration. **Do not regenerate the token and do not create a second integration.**

Read its enabled permissions and copy the complete list into Report Back. Four are confirmed working: locations, contacts, opportunities, users. We need to know what else is enabled, particularly anything covering social planner, calendars, or workflows, because that determines what can be automated later without a browser.

**Done when:** the full permission list is in Report Back, transcribed rather than summarized.

---

# Task 9. Record the account structure

Note and record: how many sub-accounts exist under this agency, what each is named, the plan or tier this account is on, and any limits it displays such as contact caps or messaging allowances.

This informs whether the municipal and Solutions motions get their own sub-accounts, which is a pending decision.

**Done when:** the above is in Report Back.

---

# Report Back

Fill this in as you go, not at the end. If you stop early, everything above the stopping point still has value.

**Date and time started:**
**Date and time finished:**

**Task 1 — location confirmed.** URL pattern seen:

**Task 2 — demo contacts.** Number deleted, names, anything left behind and why:

**Task 3 — pipeline.** Was `Affiliate Recruiting` created with all six stages? Was `Marketing Pipeline` deleted or renamed? Any stage the UI rejected:

**Task 4 — tags.** Which of the ten were created, which already existed, any the platform would not accept:

**Task 5 — email domain.** Subdomain used. Paste the DNS records here verbatim, one per line, with type, host, and value:

**Task 6 — A2P.** Submitted, or blocked? If blocked, list every field you could not fill:

**Task 7 — social.** The exact channel list this account offers. Which connected, which did not, and why:

**Task 8 — permissions.** The complete Private Integration permission list, transcribed:

**Task 9 — account.** Sub-account count and names, plan tier, any displayed limits:

**Anything that looked wrong, ambiguous, or that you skipped:**

**Anything you changed that is not described in this document:**

---

# What happens next, after you return this

These are not your tasks. They are recorded so the person reading your report knows what it feeds.

The DNS records from Task 5 get added at GoDaddy, then the domain is re-verified here and email warmup begins. The blocked A2P fields from Task 6 get filled by the operator and the registration is resubmitted. The pipeline from Task 3 is verified through the API, and its pipeline and stage IDs are recorded permanently, because whichever hand does the creating, the API does the verifying. The permission list from Task 8 determines how much of the remaining setup can be scripted rather than clicked.

Still to come and deliberately not in this runbook: the product-to-CRM connection that writes a subscriber's paid tier into this platform automatically, which is engineering work and depends on the payment system going live first; and the lifecycle messaging campaigns, which cannot be built until tags and the sending domain both exist.
