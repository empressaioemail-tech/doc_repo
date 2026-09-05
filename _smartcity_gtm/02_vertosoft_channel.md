---
id: 02_vertosoft_channel
title: Vertosoft channel — pointer and reconciliation
status: active
last_updated: 2026-09-03
applies_to: smartcity-os
owner: nick
related:
  - _smartcity_gtm/00_README
  - _smartcity_gtm/01_bastrop_to_network_strategy
  - _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer
  - _smartcity_masters/00_README
  - _inbox/2026-07-28_vertosoft_govcloud_competitive_scan
purpose: This is a pointer, not a duplicate. The channel record lives at
  _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md; edit that file, not this one.
  This doc exists to (1) reconcile the one thing that record has stale against later canon and
  (2) carry forward its open items into this GTM working set so they are not lost inside a
  prospect folder.
---

# Vertosoft channel

## What Vertosoft is, in one paragraph

A public-sector technology distributor and reseller, and a strategic AWS partner. Its value is
contract-vehicle access (TIPS, Omnia, Sourcewell, GSA, NASPO, plus state-specific vehicles —
broad Texas coverage) and a channel sales motion into government that sells use-case-first
rather than technology-first. Business model is markup-only: no cost to us to get onto their
vehicles, they mark up a per-transaction cost and sell to government. Full detail, deal shape,
and meeting record: `_prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md`.

## Reconciliation: what that record has stale

The Vertosoft record's own "Operator decisions to lock" section, as last updated 2026-08-07,
lists item 1 — **government pricing model and list price** — as "STILL OPEN, and now the
launch gate." That is superseded. `_smartcity_masters/00_README.md` records the price list as
**SET 2026-08-10**, three days after the Vertosoft record's last update, with prices already
submitted to Vertosoft as MSRP (Dashboards $65,000, Plan Review $42,000, Asset Management
$52,000, Smart Files $25,000, Full Program $150,000; annual at 25% of deployment). The launch
gate the Vertosoft record describes is therefore cleared on the pricing side. What is not
independently confirmed here is whether that submitted price list was formally acknowledged
back by Vertosoft, or whether onboarding proceeded past it — that is the actual open question
now (see `04_gtm_tracker.md`), not the price-setting itself.

## What the record still carries as genuinely open (as of 2026-08-07, unverified since)

These are copied forward from the Vertosoft record's own "Operator decisions to lock" section
so they have a home in this GTM working set. Status of each should be re-checked at source
before being treated as current — none of them were re-verified for this pass.

1. **AWS vs GCP.** Recommendation set 2026-08-07: sign the core distribution agreement and
   contract vehicles now, defer the two AWS marketplace addendums. Two questions were carried
   into the redline and are unresolved: what share of Vertosoft's municipal (not state-agency)
   volume transacts through the AWS storefront versus the cooperative vehicles, and whether a
   GCP-hosted SaaS can list under current AWS Marketplace policy at all. Our stack is GCP Cloud
   Run plus Neon; Vertosoft's storefront is an AWS Marketplace private marketplace.
2. **Contract-vehicle priority.** Which vehicle to pursue first, given a Central Texas then
   Dallas then Houston rollout. The competitive scan (`_inbox/2026-07-28_vertosoft_govcloud_competitive_scan.md`)
   flagged Texas DIR as the highest-leverage rail on their storefront specifically.
3. **The county-records SKU is unplaced.** The county-records-as-channel-product idea
   (`_decisions/2026-07-27_county_records_channel_and_bastrop_demonstrator.md`) is not part of
   the current three-category-plus-Smart-Files offer and needs a placement ruling before it can
   be pitched to Vertosoft as a separate line.
4. **Sales-rep assignment.** Recorded as confirmed 2026-08-07 — the city-management/plan-review
   background onboardee acts as the Vertosoft-side sales contact. Not re-verified this pass.
5. **Distribution agreement status.** Recorded as "moving-forward-distribution-agreement-pending"
   in the record's own frontmatter as of 2026-08-07. Whether it has since been signed is not
   known from this doc set and should be asked directly rather than assumed either way.

## What reps are allowed to say

Per the Vertosoft record: the one-pager set in `_smartcity_masters/onepager_briefs/` plus the
never-say list — no cycle-time or savings figures, no competitor names, no claim the system
approves or permits anything, and no licensed code text in any demo before the ICC SaaS
agreement is signed (a city's own adopted code is safe demo material; licensed I-Code content
is not). A channel repeats exactly what it is given; this is not a discretionary boundary.

## Reversal criteria

Per the record's own frontmatter: reverse the county-records channel additive if records access
proves impossible even through a county relationship, or if the Vertosoft channel itself does
not materialize. The core SmartCity OS product does not depend on either — it ships and sells
records-free.
