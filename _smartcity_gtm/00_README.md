---
id: smartcity_gtm_readme
title: SmartCity GTM — the go-to-market working set
status: active
last_updated: 2026-09-03
applies_to: smartcity-os
owner: nick
related:
  - _smartcity_masters/00_README
  - _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer
  - 18_stakeholder_graph
  - 90_operations/OPS-17_govtech_stack_plan_of_record
purpose: The working set for how SmartCity OS reaches city buyers and what the go-to-market
  motion actually runs on. Opened 2026-09-03, mirroring the structure of _smartsite_gtm but
  built from a different commercial reality — this is a relationship-led government sale
  through a channel reseller, not a self-serve motion.
---

# SmartCity GTM

This folder is the working set for reaching city buyers. It answers who we go after, through
which channel, in what order, and — because this product line is still mid-build — what is
actually ready to show a prospect right now.

## The boundary against the masters

`_smartcity_masters/` governs what may be SAID about SmartCity OS: the three-category
structure (Dashboards, Plan Review, Asset Management, on the Smart Files/foundation base), the
approved-claims registers, the never-say list, and the ratified government price list. Where a
document here and a master disagree about what the product is or what may be claimed, the
master wins and this folder gets corrected.

This folder governs what we DO: which cities, through which channel, in what sequence, and
against what actually-built state. It never invents a claim; it draws language from the
masters.

`_smartsite_gtm/` is a different product line and a different sales model — self-serve,
humanless by ruling, sold through Stripe and an affiliate program. The two motions do not
share collateral, do not share a pipeline, and do not share a pricing shape. Where this folder
borrows the other's document structure, it is a structural borrow only.

## Why this motion looks different from Smart Site's

Smart Site is ruled humanless: no sales team, no demos, no negotiated deals (`_smartsite_gtm/00_README.md`).
SmartCity OS is the opposite by necessity. A city does not self-serve a $65,000-plus annual
system; it buys through a relationship, a use case, and — for most cities — a cooperative
purchasing contract vehicle that lets it avoid a full RFP. The GTM motion here is Nick,
Sylvia Carrillo (as the city-side anchor), and Vertosoft (as the channel), not a funnel.

## The set

| Doc | What it covers |
|---|---|
| [01_bastrop_to_network_strategy.md](01_bastrop_to_network_strategy.md) | The actual expansion path: Bastrop as the proven design partner, the Williamson County belt cities as the next tier, TML/TCMA as the peer-network channel, and how each depends on build state actually being ready. |
| [02_vertosoft_channel.md](02_vertosoft_channel.md) | Pointer and reconciliation, not a duplicate — the channel record already lives at `_prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md`. This doc notes what that record has stale and what remains open. |
| [03_build_readiness_for_sale.md](03_build_readiness_for_sale.md) | OPS-17 is a build log, not a GTM doc. This translates its state into one sentence per surface: what is actually ready to show a buyer today, sourced from the build record, re-verify before quoting. |
| [04_gtm_tracker.md](04_gtm_tracker.md) | Row-per-item tracker for GTM-side open items that are not yet OPS-17 plan rows: pricing communication, the AWS/GCP redline, contract-vehicle priority, the unplaced county-records SKU, network outreach status. |

## The stack and who is the record of what

| System / relationship | Is the record of | Notes |
|---|---|---|
| Vertosoft | Contract-vehicle access, channel sales motion, reseller markup | Distribution agreement was pending as of 2026-08-07; current status not reconfirmed here — see `02_vertosoft_channel.md` |
| Sylvia Carrillo / Bastrop | The design-partner relationship, the case study, the gate for new city introductions | `18_stakeholder_graph.md`; Risk 5 (single-customer existential) is about this relationship |
| `_smartcity_masters/` | Approved claims, positioning, the ratified price list | Never write pricing or claims here independently of the masters |
| OPS-17 | What is actually built, deployed, and verified live | `90_operations/OPS-17_govtech_stack_plan_of_record.md` — the only authority on build state |
| 14_pricing_framework.md | Commercial deal-shape posture (e.g., the Bastrop expansion's Path A phasing) | Distinct from the Vertosoft list price, which is the resell MSRP |

## What belongs here

Channel strategy, target-city sequencing, partner (Vertosoft) relationship state, and the
translation of build state into sales readiness. Dated measurement artifacts belong in
`_inbox/`; rulings belong in `_decisions/`; plan rows belong in
`90_operations/OPS-17_govtech_stack_plan_of_record.md`. A document here that is really a
decision gets a decision record and a pointer, not a second copy.

## Standing rulings this set inherits

Partnership-first sourcing was retired 2026-06-09 — cities are customers and design partners,
never data-sourcing licensors, and no city gets a relationship-privileged data path
(`_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`). Bastrop's narrative
is "pioneering" — the first city in a network, not a data source.

The government price list is SET (2026-08-10) and already submitted to Vertosoft as MSRP:
Dashboards $65,000, Plan Review $42,000, Asset Management $52,000, Smart Files $25,000, Full
Program $150,000; annual subscription at 25% of deployment; plus expansion, services and
support lines (`_smartcity_masters/00_README.md`). Never quote from the list in a customer
conversation without the operator, and no cycle-time or savings figure ever accompanies a
price.

Live Bastrop production (`smartcity-os` repo) is ABSOLUTE NO-TOUCH. It is what a prospect sees
today; it is not where any new work happens. New work happens on the `smartcity-dashboards`
template, cut over to Bastrop by a named WDLL when ready.

Records are a per-county CHANNEL PRODUCT sold through Vertosoft on top of SmartCity OS, never
a national scrub — Bastrop is the gift-demonstrator, not a cold pitch
(`_decisions/2026-07-27_county_records_channel_and_bastrop_demonstrator.md`). This SKU is not
yet placed within the three-category offer structure.

## Verification note

This folder was built 2026-09-03 from existing canon (the masters, the stakeholder graph, the
Vertosoft prospect record, and OPS-17's build log) rather than from a live GTM-execution
session the way `_smartsite_gtm/` was. Anything here that names a specific build state or a
specific channel-relationship status should be re-checked against OPS-17 and the Vertosoft
record before it reaches a prospect conversation — this set narrates existing evidence, it
does not re-verify it.
