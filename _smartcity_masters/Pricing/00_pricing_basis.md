---
id: smartcity_pricing_basis
title: SmartCity OS pricing basis and price list
status: active
last_updated: 2026-08-10
applies_to: smartcity
owner: nick
related: [00_README, 31_smartcity_dashboards, 32_smartcity_asset_management, 33a_smartcity_plan_review, 34_smartcity_smart_files_and_foundation, 14_pricing_framework, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer]
purpose: The reasoning behind the SmartCity OS government price list submitted to Vertosoft. What the numbers are, what they are anchored on, what they deliberately are not, and what remains open. Internal — no part of this document is customer-facing.
---

# SmartCity OS pricing basis

Set 2026-08-10. The list submitted to Vertosoft is `SmartCityOS_PriceList_Vertosoft_2026-08-10.xlsx`, built from `Template.xlsx` (Vertosoft's supplier template) by `build_pricelist.py`.

This closes the open gate carried since 2026-06-07: the government list price, named as the launch gate in the Vertosoft offer doc and blocking every pricing-bearing artifact in the masters and one-pager set.

## The list

All figures are **minimum viable deployment for the smallest city band**, submitted as Commercial Retail Price (MSRP). Vertosoft marks up from these.

| Part | What it is | Price |
|---|---|---|
| SCOS-DASH-DEP | Dashboards, deployment + year one | $65,000 |
| SCOS-PLAN-DEP | Plan Review, deployment + year one | $42,000 |
| SCOS-ASST-DEP | Asset Management, deployment + year one | $52,000 |
| SCOS-FILE-DEP | Smart Files, deployment + year one | $25,000 |
| SCOS-PROG-DEP | Full Program, deployment + year one | $150,000 |
| SCOS-DASH-ANN | Dashboards, annual (year two onward) | $16,250 |
| SCOS-PLAN-ANN | Plan Review, annual | $10,500 |
| SCOS-ASST-ANN | Asset Management, annual | $13,000 |
| SCOS-FILE-ANN | Smart Files, annual | $6,250 |
| SCOS-PROG-ANN | Full Program, annual | $37,500 |
| SCOS-DASH-ADD | Additional department dashboard, one-time | $12,000 |
| SCOS-INTG-ADD | Additional system connection, one-time each | $8,500 |
| SCOS-SVC-ONB | Onboarding and implementation, base engagement | $15,000 |
| SCOS-SVC-PRO | Professional services, per hour | $250 |
| SCOS-SVC-TRN | Training, per additional session | $2,500 |
| SCOS-SUP-PRE | Premium support, annual | $9,500 |

## Where the numbers come from

**The deployment prices are operator-set** and were sent to Vertosoft on 2026-08-10 as starting prices for a minimum viable deployment, subject to seats, storage, AI spend, and the number of systems connected. The price list holds them unchanged.

**The annual subscription is 25% of deployment.** A standard software maintenance-and-subscription ratio, and the ratio makes the renewal defensible as a percentage rather than as a number pulled from nowhere.

**The Full Program is a full deployment, not a discount off a menu.** The four categories sum to $184,000 and the program is $150,000, but that spread is never presented as a saving. Advertising an 18.5% bundle discount would reward buying everything at once — the opposite of the sequence the masters commit to, where a city buys Dashboards as a complete system and grows into the rest. Do not show the sum, and do not quote a percentage saving.

## What the numbers are anchored on

**The Bastrop contract (signed 2026-02-17, `Complete_with_Docusign_Bastrop__Legacy_PSA.pdf`).** Maximum contract amount $33,000 for Phase 1 Executive Dashboard implementation plus year-one license, with six system integrations; $7,500 per additional department dashboard; $12,000 per year from year two, regardless of how many dashboards are deployed. Two years initial term from go-live.

That contract is **reference, not standard.** Operator assessment: it was underbid substantially. It is the floor the market has already accepted, not the price the product should carry. Dashboards at $65,000 is roughly double it, and the annual at $16,250 corrects a $12,000 recurring figure that was well under market for a platform a city runs on daily.

**The $1M rejection (2026-05-05).** Sylvia's response to a $1M proposal was "$1M has me falling out of my chair." That sets the ceiling for a city of Bastrop's size and is why the entry band lands where it does. The Path A method in `14_pricing_framework.md` applies to any municipal account: tighten scope to meet the anchor, expand by change order, never discount the per-line-item rate.

**Outsourced plan review comparables** (`whitespace_package/05_R15_plan_review_cycle_times.md`, all government-sourced). Cities pay outside firms 75-80% of their own plan-review and permit fees; fully outsourced building departments run $250,160 to $830,000 a year (Morton Grove IL, Winnetka IL $295K, Glenview IL $830K); Downers Grove IL budgets $160,000 a year for residential permit review alone at $98 an hour. A city already spending in that range is reallocating budget rather than creating a new line. This is the willingness-to-pay evidence that makes six figures defensible — but it is context for the problem, never our result, and never attached to a customer.

**The cost floor.** Structural commitment 3: under $200 compute plus one hour human review per jurisdiction onboarded (`14_pricing_framework.md`). Measured spine compute is far below that ceiling. Fixed spine infrastructure runs roughly $1,250-7,200 a month portfolio-wide. Gross margin at these prices is not the constraint; delivery capacity is.

## Deliberate choices

**MSRP rather than Cost-to-Vertosoft.** The numbers already went to Vertosoft as starting prices; publishing the same figures as MSRP keeps the message and the sheet consistent, and the city-facing number stays one that has been reasoned against the Bastrop anchor. Vertosoft's markup is "a few points" and comes out of the retail price. The alternative — restating the numbers upward so we net the full amount — buys a few thousand dollars per deal at the cost of revising a number already sent.

**Smart Files is priced but is not optional.** It carries a line because Vertosoft needs a quotable part and because a city may deploy it first. It is the customer-facing face of the foundation, so every deployment includes it in substance. Do not let a rep present it as a component a city could decline; that would undercut the one-record claim, which is the strongest differentiator on the sheet.

**Asset Management's $52,000 is a floor, not a scope.** The category is delivered as a build (`32_smartcity_asset_management.md`). The deployment SKU covers a minimum viable deployment; anything beyond it prices through professional services. A city must not read $52,000 as the price to twin an entire utility network.

**Every product type is Subscription or Services.** Nothing is a perpetual licence. This keeps the recurring line intact and matches how the platform is actually delivered.

**No population banding on this submission.** The Vertosoft offer commits to per-city pricing tiered by size, and these figures are the smallest-city band only. Banding is deliberately deferred until there is more than one live city to calibrate against; quoting bands invented from nothing would be worse than quoting an entry price and scoping upward. Named as open below.

## Compliance fields

Country of origin USA; Section 889 compliant Yes; cloud computing service Yes; ITAR No; no warranty period on subscription software. UNSPSC codes are taken from the template's own commonly-used list: portal server software for Dashboards, procedure management for Plan Review, database management for Asset Management, metadata management for Smart Files, cloud-based data access and sharing for the program, application implementation services for services lines, and maintenance or support fees for premium support.

**TX-RAMP is unresolved and matters.** The template calls out TX-RAMP, FedRAMP and GovRAMP. Texas DIR is flagged as the highest-leverage vehicle on Vertosoft's storefront, and TX-RAMP certification is a gating requirement for Texas state agency cloud purchases. Whether it binds municipal purchases through cooperative vehicles has not been established. Resolve before the DIR vehicle is pursued.

## What is still open

1. **Population banding.** These are smallest-city entry prices. Bands for larger cities are owed once there is calibration beyond Bastrop.
2. **TX-RAMP applicability** to municipal purchases through cooperatives, and the certification path if it binds.
3. **Cotality-dependent pricing.** `14_pricing_framework.md` holds that no Cotality-backed SKU price is final until the production tier is known. Nothing on this sheet depends on Cotality today; keep it that way, and note that Cotality is being extinguished from the data path.
4. **Onboarding as a range.** $15,000 is a base. Operator intent is that onboarding becomes per-engagement over time; the base plus hourly professional services carries it until then.
5. **County records.** Floated 2026-07-27, unplaced in the four-category structure, and deliberately absent from this list. It needs a placement ruling before it can be quoted.
6. **The Bastrop conversation.** Bastrop pays $12,000 a year against a list annual of $16,250 for Dashboards alone. Whether Bastrop is grandfathered, repriced at renewal, or treated as founder pricing is an operator call, and it is a relationship question before it is a pricing one. Their initial term runs two years from go-live.

## Standing discipline

Never quote from this list in a customer conversation without the operator. `_sales/03_smartcity_os.md` holds the rule: pricing is packaged per engagement; bring the qualified city to Nick and Valerie. The list exists so the channel has a defensible published anchor, not so reps can price a deal.

No cycle-time or savings figures accompany any price. No customer's spend is named. The plan-review outsourcing comparables describe the problem cities face and are never presented as our result.

## Revision history

- 2026-08-10, origin. Deployment prices as sent to Vertosoft; annual set at 25% of deployment; program held at $150,000 as a full deployment rather than an advertised discount; expansion, services and support lines added; submitted as MSRP.
