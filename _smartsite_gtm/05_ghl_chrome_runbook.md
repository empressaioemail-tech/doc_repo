---
id: 05_ghl_chrome_runbook
title: GoHighLevel browser-only runbook for Claude Chrome
status: active
last_updated: 2026-08-31
applies_to: smart_site
owner: nick
related:
  - _smartsite_gtm/04_gohighlevel_agent_runbook
  - _smartsite_gtm/02_gohighlevel_buildout
  - _smartsite_gtm/00_README
purpose: The browser-only subset of the GoHighLevel setup, written for a browser-driving agent. Peeled off the 04 runbook on 2026-08-31 once pipeline creation was proven API-supported and moved off the browser. Tasks are ordered by lead time rather than by the 04 numbering. Every task states a done-condition a stranger could check, and results go into the Report Back block at the end.
---

# GoHighLevel browser-only runbook

Read this whole document before you click anything. You are working inside a live business account. Several actions in this platform are difficult or impossible to undo, and two of them would break paid systems that are already running. The prohibitions below are not stylistic. Follow them exactly.

You are signed in as an agency-role user. The sub-account you are working in is named Smart Site.

## What this document is

This is the browser-only half of [`04_gohighlevel_agent_runbook.md`](04_gohighlevel_agent_runbook.md), which is the parent document. Everything here is a task that genuinely cannot be done through the GoHighLevel API. Follow this file rather than 04. Where the two disagree, this file wins, and the one place they disagree is named explicitly in Task B.

This file supersedes, as execution instructions, Tasks 1, 2, 5, 6, 7, 8 and 9 of the 04 runbook. Those seven are reproduced here, reordered, and tightened.

This file does not supersede Tasks 3 and 4 of the 04 runbook. Those two were removed from browser scope altogether. Pipeline creation was proven API-supported on 2026-08-31: `POST /opportunities/pipelines` returned a 422 validation error while the control `POST /pipelines` returned 404, which means the route exists and rejected only the body. Nothing was created by that probe. Tag creation moves with it. Both are now owned by the API, and a second hand doing them in the browser would produce duplicates that somebody has to reconcile. Do not build the affiliate pipeline. Do not create any tag.

The 04 runbook remains the record of the full setup shape and of what the returned results feed.

## Context you need

Smart Site is a property-intelligence web product. It sells subscriptions through Stripe, on its own website, with no salespeople. GoHighLevel is being set up as the marketing and partner-operations platform beside it, not as a sales CRM for those subscribers.

Money already flows through systems outside GoHighLevel. Stripe takes the payments, a tool called PromoteKit tracks affiliate referrals against those Stripe payments, and PayPal pays the affiliates. GoHighLevel does not touch any of that.

## Absolute prohibitions

**1. Do not connect GoHighLevel Payments to Stripe. Do not enter any Stripe key anywhere in this platform.** GoHighLevel can create its own Stripe products and subscriptions. If it does, customers could pay through a channel that does not grant them access to the product, while the affiliate system still pays a commission. If you encounter a Stripe setup prompt, skip it and record it in Report Back.

**2. Do not create any pipeline, automation, sequence, or campaign that contacts Smart Site subscribers as sales leads.** This product is sold without salespeople by explicit decision. Marketing email and in-product messaging are fine. Sales pipelines, appointment booking, and call sequences aimed at subscribers are not.

**3. Do not import, upload, or purchase any contact list.**

**4. Do not delete anything not named in this document.** Where a step says delete, it names the exact item.

**5. Do not send any message, email, or SMS to anyone.** Setup only. If a step offers to send a test to a real person, stop and record it. Submitting a registration form to a carrier or to a vendor is not sending a message and is not covered by this prohibition.

**6. If a step requires a decision this document does not cover, stop and record it in Report Back rather than choosing.** An unrecorded guess is worse than an unfinished step.

**7. Do not create the affiliate pipeline and do not create any contact tag.** The API owns both as of 2026-08-31. If you find yourself inside a pipeline builder or a tag creation screen, back out. If a pipeline named `Affiliate Recruiting` or any tag beginning `tier-` already exists, that is the API having done its job. Leave it alone and record what you saw.

**8. Do not add a DNS record anywhere, in any system.** The domain is registered at GoDaddy, which is a separate system the operator handles. Your job with DNS is to transcribe, never to enter.

## What is already done, so do not redo it

The API credential is provisioned and verified working. A Private Integration token exists, and locations, contacts, opportunities and users permissions were confirmed live on 2026-08-31 against a deliberately bogus location that returned 403. Do not create a second Private Integration and do not regenerate the existing token. Regenerating it breaks the verified credential and every scripted task that depends on it.

The sub-account id is `KtUXFiFB5e22abpLp1MR` and the agency company id is `vKCvP5UtZmDLMD4A6T4F`. Neither is a secret and you may need them in URLs and forms. The token itself is not in this document and you will not need it.

## Why the order below is not the order in 04

The tasks are sequenced by lead time rather than by number, because two of them wait on approvals from outside this company and every hour they are not started is an hour added to launch.

That gives A2P registration first, because carrier approval is the longest pole in the entire go-to-market plan. The email sending domain comes second, because DNS propagation and warmup are also external waits. Then the two read-only transcription tasks, then social channel connection, then the demo data cleanup last, because nothing waits on it. The permission transcription deliberately sits ahead of the social connection work, because what the token can reach determines whether social publishing ever needs a browser again.

One thing comes before all of them, and it is not a lead-time item.

---

# Precondition. Confirm where you are

Do this before any task. Every instruction below assumes it.

Open GoHighLevel and confirm you are inside the sub-account named Smart Site, not at the agency level. The browser URL while inside a sub-account contains `/v2/location/KtUXFiFB5e22abpLp1MR/`. If the URL shows a different location id, switch accounts before continuing.

If you cannot reach that location id at all, stop and record it. Do not proceed in a different sub-account on the assumption that it is the right one.

**Done when:** the address bar contains `/v2/location/KtUXFiFB5e22abpLp1MR/` and you have copied the full URL pattern into Report Back.

---

# Task A. Start A2P 10DLC brand registration

This is the longest-lead item in the entire go-to-market plan. It is an approval granted by mobile carriers, not by GoHighLevel, it takes days, and nothing about text messaging works until it clears. Start it first even though SMS is not in the immediate launch plan, and start it even if you cannot finish it.

Navigate to Settings, then Phone Numbers, then whichever of Trust Center or A2P Registration your version of the interface shows. Begin brand registration.

Before you fill anything in, open the business profile for this sub-account, usually under Settings then Business Profile or Company. Read what it says the legal business name, address, and website are, and copy those into Report Back exactly as displayed. Do not change them. The A2P brand form inherits from this profile in most versions, and editing a business identity part way through a registration is how a registration gets rejected.

The legal entity is Legacy Group ATX LLC. This is the operating company and it is the same entity that appears on Stripe checkout, so the registration must match it. If the business profile shows any other name, stop and record it rather than correcting it.

You will likely be asked for the EIN, the registered business address, a business website URL, and links to published privacy and terms pages. The website is the Smart Site site at `smartsite.cloud`. Before entering any privacy or terms URL, open it in a tab and confirm the page actually loads. A carrier reviewer will do the same. If either page does not load, that is a blocker and it goes in Report Back as one.

Do not invent or guess any value on this form. Carrier registration with wrong information gets rejected and re-filing is slow. For every field you cannot fill from information in this document or read off the account, leave it blank and name the field in Report Back.

**Done when:** either the brand registration is submitted and you have recorded the submission reference or status the screen shows, or the exact list of field names blocking submission is in Report Back. Both are acceptable outcomes. A guessed value is not.

---

# Task B. Add the marketing email sending domain

The second external wait. DNS has to propagate and the domain then has to warm before it can carry volume, so the record set needs to be in the operator's hands today.

Navigate to Settings, then Email Services, or Domains, depending on what your version calls it, and begin adding a sending domain.

Use exactly this subdomain:

```
email.smartsite.cloud
```

This is an operator ruling made on 2026-08-31 and it overrides the parent runbook. The 04 runbook offers `mail.smartsite.cloud` or `go.smartsite.cloud` as options. Both are wrong now. Use `email.smartsite.cloud` and nothing else. Do not use the bare `smartsite.cloud`, because the website at that domain sends receipts and account email that customers must receive, and mixing marketing sending into the same domain reputation puts those at risk.

GoHighLevel will then display a set of DNS records to add. Transcribe every record it shows into Report Back verbatim, one per line, with its type, its host or name, and its full value. Do not paraphrase a value, do not truncate a long DKIM key, and do not correct anything that looks malformed. If a value is displayed behind a copy button rather than as visible text, use the copy button and paste the result.

Then note separately whether a DMARC record appears in that set. The buildout doc at [`02_gohighlevel_buildout.md`](02_gohighlevel_buildout.md) says email sending needs SPF, DKIM and DMARC. The 04 runbook expects only SPF, DKIM and a return-path or CNAME entry. Nobody knows which is right until somebody sees the actual screen, and you are that somebody. Report what is there rather than what either document expects.

Do not add these records. See prohibition 8. The domain lives at GoDaddy and the operator adds them there.

**Done when:** `email.smartsite.cloud` is entered in GoHighLevel, the complete displayed record set is pasted into Report Back verbatim, the DMARC question is answered yes or no, and the verification state the screen shows is recorded.

---

# Task C. Transcribe the Private Integration permission list

Navigate to Settings, then Private Integrations, and open the existing integration. Do not regenerate the token. Do not create a second integration. Do not toggle any permission on or off.

Read its enabled permissions and copy the complete list into Report Back, transcribed rather than summarized. Include permissions that are listed but switched off if the screen distinguishes them, and say which is which.

Four permissions are already confirmed working: locations, contacts, opportunities, users. What matters is everything else, and in particular anything covering social planner, calendars, workflows, conversations, or custom fields, because that determines how much of the remaining setup can be scripted rather than clicked.

**Done when:** the full permission list is in Report Back as a list of exact permission names, and it is a transcription rather than a summary. If the list is long, it is still a transcription.

---

# Task D. Record the account and plan facts

A read-only task. Record all of the following.

How many sub-accounts exist under this agency, and the exact name of each. The plan or tier this account is on, as the billing or plan screen names it. Any limit the interface displays, such as a contact cap, a messaging allowance, a user seat count, or a sub-account count limit.

This feeds a pending decision, and the two source documents disagree about how pending it is. The buildout doc recommends separate sub-accounts per motion, one for Smart Site subscribers and affiliate partners and another for the municipal and Solutions pipelines, and says that posture should be decided before anything is created. The 04 runbook treats the split as simply pending. Record the facts and let the operator resolve it. Do not create a sub-account.

**Done when:** sub-account count, sub-account names, plan tier, and every displayed limit are in Report Back.

---

# Task E. Connect social channels

Navigate to Marketing, then Social Planner, and connect the channels the account offers.

First record the exact list of channels this account offers, before connecting anything, since that list varies by plan and it has never been verified for this account. It typically includes Facebook Pages, Instagram, LinkedIn, Google Business Profile, TikTok and X, but do not assume that list. Write down what you actually see.

Then connect each one. Each opens that platform's own login and permission screen. If a connection requires credentials you do not have, stop that one and record which credential was missing. Do not create a new social account anywhere. Do not connect a personal profile where a business page is the correct target. If only a personal profile is available for a given platform, skip it and record that it was the only option.

**Done when:** the exact channel list this account offers is in Report Back, and every channel on it is either connected or listed with the specific reason it was not.

---

# Task F. Remove the vendor demo data

Last, because nothing waits on it, but still done before any real contact is written. GoHighLevel seeds every new sub-account with sample data. It is not ours, and it pollutes every count and every automation that filters on all contacts.

Go to Contacts. Find contacts whose names begin with `(example)` or that are otherwise unmistakably platform-seeded samples. One known instance is a contact named similar to "(example) casey morgan". Delete only those.

If any contact does not clearly look like vendor sample data, leave it and record it. A real contact deleted here is unrecoverable, and a sample contact left behind costs nothing until the next pass.

**Done when:** no contact whose name begins with `(example)` remains, and the count and the names of everything you deleted are in Report Back, along with anything you left behind and why.

---

# Report Back

Fill this in as you go, not at the end. If you stop early, everything above the stopping point still has value.

**Date and time started:**

**Date and time finished:**

**Precondition, location confirmed.** The full URL pattern you saw:

**Task A, A2P, business profile.** Legal name, address and website exactly as displayed:

**Task A, A2P, outcome.** Submitted or blocked. If submitted, the reference or status shown. If blocked, every field name you could not fill:

**Task A, A2P, website check.** Did the privacy page and the terms page both load. Give the exact URLs you checked:

**Task B, email domain.** Confirm the subdomain entered was `email.smartsite.cloud`:

**Task B, DNS records.** Paste every record here verbatim, one per line, with type, host and full value:

**Task B, DMARC and verification.** Was a DMARC record among them, yes or no. What verification state does the screen show:

**Task C, permissions.** The complete Private Integration permission list, transcribed, marking any that are listed but disabled:

**Task D, sub-accounts.** Count, and the exact name of each:

**Task D, plan.** Plan or tier name, and every limit displayed:

**Task E, channels offered.** The exact channel list this account offers:

**Task E, channels connected.** Which connected, which did not, and the specific reason for each that did not:

**Task F, demo contacts deleted.** Number and names:

**Task F, demo contacts left behind.** What and why:

**Pipeline and tag sighting.** Did you see a pipeline named `Affiliate Recruiting` or any tag beginning `tier-`. If so, list what was there. You should not have created any of it:

**Anything that looked wrong, ambiguous, or that you skipped:**

**Anything you changed that is not described in this document:**

---

# What happens after you return this

These are not your tasks. They are here so the person reading your report knows what it feeds.

The DNS records from Task B get added at GoDaddy by the operator, the domain is re-verified in GoHighLevel, and email warmup begins. The blocked A2P fields from Task A get filled by the operator and the registration is resubmitted, and that clock is the one the messaging plan waits on. The permission list from Task C decides how much of the rest of this platform can be driven by script rather than by browser. The account facts from Task D feed the sub-account split decision.

Two items are known to be missing from both this file and the parent runbook, and they are recorded here so they are not lost. The company identity and timezone setup described as Phase 0 of the buildout doc has no task in either runbook. The affiliate identifier custom field required by Phase 3 of the buildout doc is a custom field rather than a tag, so the tag work that moved to the API does not cover it. Both are open and neither is yours.

The pipeline and the tags are being created through the API in parallel with your work, and their ids are recorded from the API response. Whichever hand does the creating, the API does the verifying.
