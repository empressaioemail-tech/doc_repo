---
id: smartsite_gtm_readme
title: Smart Site GTM — the go-to-market working set
status: active
last_updated: 2026-08-31
applies_to: smart_site
owner: nick
related:
  - _smartsite_masters/00_README
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED
  - _inbox/2026-08-10_smartsite_humanless_gtm_handoff
  - 76j_smartsite_launch_readiness_program
  - 76h_property_explorer_gtm
  - 90_operations/OPS-16_texas_market_plan_of_record
purpose: The working set for how Smart Site reaches buyers and what the go-to-market stack actually runs on. Opened 2026-08-31 when the affiliate channel, the Stripe live switch, and the GoHighLevel buildout all became live work at once and needed one home.
---

# Smart Site GTM

This folder is the working set for reaching the market. It answers who we go after, through which channel, on which platform, and in what order.

## The boundary against the masters

`_smartsite_masters/` governs what may be SAID about Smart Site. It carries the positioning, the approved claims, the never-say list, the report menu, and the two-altitude rule. Where a document here and a master disagree about what the product is or what may be claimed, the master wins and this folder gets corrected.

This folder governs what we DO. Channels, audiences, targeting, campaigns, platform configuration, sequencing, and the operational rules of the go-to-market stack. It never invents a claim; it draws language from the masters.

`_smartcity_masters/` and the municipal motion are a different product line and a different sales model. They do not share collateral with this folder and the two motions do not share a pipeline.

## The set

| Doc | What it covers |
|---|---|
| [01_central_texas_gtm_strategy.md](01_central_texas_gtm_strategy.md) | The launch market. Why Central Texas, who buys, the three channels with a Central Texas plan for each, the content system, the sequencing, and the open operator decisions. |
| [02_gohighlevel_buildout.md](02_gohighlevel_buildout.md) | GoHighLevel from an empty login to a running bizops platform. What it is allowed to be the record of, what it must never write, and the build order. |
| [03_ladder_recut_proposal.md](03_ladder_recut_proposal.md) | The ladder re-cut, RULED 2026-08-31. Solo answers one parcel, Studio works a list. The verified capability map behind it. Filename kept as "proposal" so existing references resolve. |
| [04_gohighlevel_agent_runbook.md](04_gohighlevel_agent_runbook.md) | The original nine-task GoHighLevel setup runbook. Tasks 3 and 4 have since moved to the API; see 05. |
| [05_ghl_chrome_runbook.md](05_ghl_chrome_runbook.md) | The browser-only subset of the GoHighLevel setup, written for a browser-driving agent and ordered by lead time. Supersedes 04 tasks 1, 2, 5, 6, 7, 8 and 9 as execution instructions. |
| [06_consolidated_roadmap.md](06_consolidated_roadmap.md) | The wave plan to first revenue. Merged 2026-08-31 from two retired working threads. The reference the build works against. |

## The stack and who is the record of what

Four systems carry the go-to-market. The rule that keeps them from corrupting each other is that the flow runs one way, from money to marketing, and never back.

| System | Is the record of | May write | Must never write |
|---|---|---|---|
| Stripe | Money and subscription state | Entitlement, through the webhook, into the product database | Anything a client asserted about itself |
| Product database (cortex-api) | Entitlement, saved work, product usage | Tier, seats, unlock expiry, funnel events | Marketing campaign state |
| PromoteKit | Affiliate attribution and commission | Affiliate credit against Stripe subscriptions | Entitlement or tier |
| PayPal | Affiliate payout | Payments to affiliates | Anything the product or the CRM reads |
| GoHighLevel | Marketing contacts, campaigns, social, partner pipeline | Outreach, content, partner stage, lifecycle messaging | Tier, entitlement, or any value the product reads back |

The load-bearing rule is inherited from the 2026-08-17 CRM ruling and is not negotiable by platform choice: the Stripe webhook is the sole writer of a subscriber's tier, and the CRM receives that tier as a tag. A tier that arrives in GoHighLevel from a form, a client, or a manual edit is an asserted number, and asserted numbers are what this operation does not ship.

## The sovereignty line into the CRM

Identity, funnel stage, and qualified signal cross into GoHighLevel. Tenant-private work does not. The distinction is precise and is the same one that governed the Pipedrive wiring in `76h`: that a user inspected a parcel is funnel signal and may cross; which parcel they inspected is their research and may not. Saved properties, report payloads, adjudications, notes, and screens never leave the product.

## What belongs here

Channel strategy, targeting, campaign plans, platform configuration, affiliate program operations, content calendars and pillars, and the launch sequencing. Dated measurement artifacts belong in `_inbox/`; rulings belong in `_decisions/`; plan rows belong in `90_operations/OPS-16_texas_market_plan_of_record.md`. A document here that is really a decision gets a decision record and a pointer, not a second copy.

## Standing rulings this set inherits

Smart Site never gets a sales team (operator, 2026-08-10). Distribution is affiliate links plus the share loop plus agent surfaces, AI-first and humanless by design. That forbids demos, contact-us pricing, negotiated deals, onboarding calls, and any tier that requires a conversation. Team must close self-serve. Sales exists for Empressa Solutions and for municipal, and those motions may use human machinery this one may not.

The pricing ladder is locked (`_inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md`, Team seats amended 2026-08-29). Free, Solo $49, Studio $129, Team $299 for three seats then $25 per seat, and a $15 thirty-day per-property unlock. Annual is the default presentation. Prospect is post-launch and marked coming soon.

Share is free and carries full fidelity regardless of the recipient's tier. What is gated is what the recipient can do on their own account, never what they can see of what was shared.

Affiliate terms are locked at 20 percent, recurring, capped at twelve months.

Coverage is spoken of as nationwide with per-place honesty in the product. Central Texas is a targeting decision, not a coverage claim, and no artifact in this folder may enumerate jurisdictions as the extent of what Smart Site covers.
