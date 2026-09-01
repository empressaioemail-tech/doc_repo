---
id: 06_consolidated_roadmap
title: Smart Site consolidated roadmap — the wave plan to first revenue
status: active
last_updated: 2026-08-31
applies_to: smart_site
owner: nick
related:
  - _smartsite_gtm/00_README
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - _smartsite_gtm/03_ladder_recut_proposal
  - _smartsite_gtm/04_gohighlevel_agent_runbook
  - _smartsite_gtm/05_ghl_chrome_runbook
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _inbox/2026-08-31_p97_stripe_live_activation_checklist
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED
purpose: One ordered plan from product-is-live to money-is-live to channel-is-on. Merged 2026-08-31 from two parallel working threads that were retired into it. This is the reference the build works against; when a wave item closes, it is struck here.
---

# Smart Site consolidated roadmap

Product is live and works. Money is not live. Channels exist and are unmeasured. This document closes the gap between those three sentences, in order.

## How this document was made, and what that means for trusting it

On 2026-08-31 two working threads were running Smart Site go-to-market in parallel and were retired into this one. Each was stale where the other was current, and both were stale against the repo. Every line below was re-verified against live state before being written here. Where a claim could not be established it says so rather than guessing.

Three reconciliations are worth recording because they changed the plan rather than merely updating it.

The first is ownership of the Stripe live switch. One thread believed it was in flight with another agent group. It is not, and never was. `_inbox/2026-08-31_p97-stripe_close.json` is a read-only analysis lane whose scope basis excludes performing the switch as operator-owned. The whole affiliate program was queued behind a step that had no one executing it.

The second is that one of the two named pre-live code fixes had already shipped. The client-side tier downgrade merged as hauska-map #325 at 2026-08-31T20:49:38Z. Only the `pe-billing.ts` exposure remains, and it is more serious than the one that shipped.

The third is that a scoping lane corrected two claims in the ladder ruling it was scoping. Those corrections are amended into `_decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md` and they move work between waves here.

## Wave 0. Finish what is already in hand

Nothing blocks any of these. Two of them have clocks that run outside our control and should start before anything else in this document.

| # | Item | Owner | State as of 2026-08-31 |
|---|---|---|---|
| 0.1 | Land P-98b: merge LDT #574, apply migration `0092`, open and merge the hauska-map client PR | planner | in flight, see below |
| 0.2 | A2P 10DLC brand and campaign registration | operator | not started, longest lead item in this document |
| 0.3 | Email sending domain `email.smartsite.cloud`, records added at GoDaddy | operator | not started |
| 0.4 | GoHighLevel pipeline and tags, created through the API rather than the browser | planner | not started |
| 0.5 | Stale-customer blast radius, two SQL counts | planner | not started |
| 0.6 | Card and dispatch the PE billing portal (A-062) | planner | not started |

**0.1 detail.** PR #574 failed CI on three assertions sharing one root cause: the two halves of P-98b disagree on the billing-interval vocabulary. The server speaks `month` and `year` end to end, deliberately mirroring Stripe's own recurring-interval values and enforced by a `CHECK` constraint in migration `0092`. The client half was built against `monthly` and `annual`, and a translation layer on the response path bridged them while the server's own tests asserted the untranslated form. The ruling is one vocabulary end to end, `month` and `year`, with no translation layer, because a silent mapping between two vocabularies for one subject is the defect class that previously required re-stamping 6.3 million atom rows. Dispatch `_dispatches/2026-09-01_p98b-vocab_dispatch.md`.

Landing 0.1 lights up the `annual_upgrade` rung, which is the highest-value of the five next-action rungs and one of four currently starved. Only `connect_claude` can fire today.

**0.4 detail.** Pipeline creation is proven API-supported: `POST /opportunities/pipelines` returned 422 validation against a `POST /pipelines` 404 control, and nothing was created. Tags likewise. Moving these two tasks off the browser reduces the browser-agent surface from nine tasks to three, which matters because the browser attempt has been failing. What remains genuinely browser-only is the sending domain, A2P, social OAuth, the permission-list transcription, and the demo-contact cleanup. Those are peeled into `05_ghl_chrome_runbook.md`.

## Wave 1. Make money takeable

This is the live-money gate. It is shorter than either retired thread believed, because one of its two code items already shipped.

| # | Item | Owner | Blocked by |
|---|---|---|---|
| 1.1 | Build the PE billing portal so the published terms stop overclaiming | planner | 0.6 |
| 1.2 | Retire `api/pe-billing.ts` and prove retirement by decline | planner | nothing, RULED retire |
| 1.3 | Stripe live activation, following the P-97 checklist | operator | 1.1 and 1.2 |
| 1.4 | Live smoke per SKU | planner | 1.3 |

**1.1 is the item that sat unowned across both retired threads,** because each assumed the other held it. `terms.html` states verbatim that a customer can cancel a paid plan through the Stripe billing flow in the product, and zero billing-portal references exist anywhere in `apps/property-explorer`. The product is honest and the legal page is not, which is the inversion of the usual failure and the half carrying legal weight. The build is one route against the signed-in user's `stripe_customer_id`, one line added to `deep-allowlist.ts`, and a control in Settings replacing the string "Not built". The Stripe call already exists and is proven at `brokerageStripe.ts:245`. Ruled a blocking Phase 0 item as A-062.

**1.2 is not cleanup and it outranks the fix that already shipped.** `apps/property-explorer/api/pe-billing.ts` is deployed on `https://smartsite.cloud`, is routed by `vercel.json:42`, and has zero callers anywhere in the repo. It was born in one commit as part of a wave and never wired to anything. Live probes on 2026-08-31 returned `GET /api/pe-billing?path=status` 200 with `stripeConfigured` and `liveCheckout` both true, and a control on a bogus path returned 400 while a nonexistent route returned 404, so the handler is real and discriminating rather than a catch-all.

The only gate on `POST /api/pe-billing?path=checkout` is a self-asserted `X-Hauska-Install-Id` header of length eight or more, which any caller can invent. The function then attaches the cortex service key server-side and forwards the caller's body verbatim to the install-scoped seam, where the tier is whatever the caller sent and resolves to the retired `STRIPE_PRO_PRICE_ID`. Stripe being in test mode is the only thing standing between this and real money from the open internet.

So 1.2 is a hard prerequisite of 1.3, not a parallel cleanup. Retirement means deleting the file, the `vercel.json:42` rewrite and the `vite.config.ts:48` dev proxy, then proving retirement by decline with a CI check asserting a 404, per the standing rule that retirement is proven by decline and never by documentation.

Two related items are routed rather than folded in. `api/spine.ts:346` carries a starved `cortexPostPaths` entry that reads as a live permission and is unreachable, and it is shared with Command Center so it is not a PE-local edit. And the cortex-side install-scoped seam still resolves tier `pro` to the retired price; this wave removes one client of that seam, not the seam.

## Wave 2. Make the ladder real and the funnel measurable

Runs alongside Wave 1. Nothing here waits on Stripe.

| # | Item | Owner | Blocked by |
|---|---|---|---|
| 2.1 | P-101 ladder re-cut across both surfaces, two-seat Studio SPLIT OUT per ruling 2 | property seat | nothing, rulings landed |
| 2.2 | P-100 share and funnel instrumentation | property seat | nothing, dispatched |
| 2.3 | Screen test the four affiliate segment lines | operator | nothing |
| 2.4 | Affiliate kits, one per segment | planner | 2.3 |
| 2.5 | Content production, five pillars | operator and planner | 0.4 |
| 2.6 | Affiliate recruiting into the pipeline | operator | 0.4 |

Recruiting sits here rather than in Wave 3 deliberately. It was ruled unblocked; only link distribution holds.

**2.1 carries corrections that move its cost.** The scoping lane found that two-seat Studio is not a copy edit. The P-94 roster server half is built team-only and what it currently hands a Studio subscriber is a 409, because `resolveTeamSeatsPurchased` returns null for any non-team tier and `inviteTeamMember` throws `SEATS_PURCHASED_UNKNOWN` on the resulting undefined before reaching the capacity check. A unit test pins the no-Studio-seats behaviour and must be inverted rather than deleted. It also found that the comparison-table regroup is a code change and not config, because `PricingModal.tsx:61-65` hardcodes the three groups and nothing iterates the groups config, so a lane editing only `pricing.ts` ships a fourth group that renders nowhere while the existing test still passes.

**A structural finding from that lane outlives P-101.** There are three copies of `subscriptionTierGrantsStudio` across the two repos, not two, and the test named "matches api-server predicate" asserts hardcoded booleans against its own local copy and never opens the api-server file. That is internal consistency wearing a divergence test's name. The consequence sharpens the connector ruling rather than weakening it: gate at the tier and both surfaces inherit is structurally true only for a route gate, and false for any predicate gate, because a predicate would simply become a fourth copy.

**2.2 is measure-then-close-gaps, not build-from-zero.** The event infrastructure exists. The one gap established repo-wide as genuinely absent is sharer attribution, so a recipient who signs up today is credited to nobody. This is the declared gate on affiliate link distribution, and the reason is not perfectionism: events cannot be backfilled, and the first sixty days is exactly the window in which share and affiliate traffic have to be told apart.

## Wave 3. Turn on the channel

| # | Item | Owner | Blocked by |
|---|---|---|---|
| 3.1 | PromoteKit configured, one real payout proven end to end | operator and planner | 1.3 |
| 3.2 | Affiliate links go out to recruited partners | operator | 3.1 and 2.2 |
| 3.3 | P-99 product-to-CRM pipe | planner | 1.3 plus the credential in Secret Manager |

Affiliate terms are locked at 20 percent, recurring, capped at twelve months, opt-in with an application rather than a universal link. PromoteKit attributes against live Stripe subscriptions, which is the mechanical reason 3.1 cannot precede 1.3.

3.3 needs the GoHighLevel credential in Secret Manager bound to cortex-api specifically. A copy on the operator's disk cannot be read by a webhook handler.

## Wave 4. Compound

P-88 vendor directory listing, which is what turns Claude Sync from a reason to stay into a way to be found, and which is currently the highest-leverage unassigned item in the plan. McLennan and Waco as the first proof the playbook transfers to a second media market. Dunning, which is silent churn at scale and nothing at zero customers. Prospect rebuilt as monitoring per the ladder re-cut. Agent access priced by volume rather than by rung, which is a different buyer.

## Operator rulings, 2026-08-31

All three calls that were open when this document was written are now ruled. They are recorded here because this is the document the build works against; the plan-of-record row and the decision record may be filed by the lane closing out P-101, and if a second record appears it should be reconciled against this section rather than either being silently dropped.

**Ruling 1, screens gating and the free connector.** Gate `create_screen` and `add_to_screen`. Leave `list_screens` open. The panel still mounts, so the connector keeps the top-of-funnel role the connector ruling assigned it, and a free user meets the upgrade prompt in context rather than meeting nothing at all. Nothing real is given away, because `list_screens` on a free account returns an empty list. The job Studio sells is building the list, not reading one the user could never create.

**Ruling 2, two-seat Studio splits out of P-101 into its own row.** It is four coordinated server changes plus an unresolved Stripe product question, sitting behind a 409, with a unit test pinning the current behaviour that must be inverted rather than deleted. The rest of the re-cut is gates and copy and ships without it. Bundling would make the fast half wait on the slow half, and two seats is the weakest line in the re-cut: the pitch is that Solo answers one parcel and Studio works a list, not that Studio gets a second seat.

**Ruling 3, `api/pe-billing.ts` is retired.** Delete the file, the `vercel.json:42` rewrite and the `vite.config.ts:48` dev proxy, then prove retirement by decline with a CI check asserting a 404. This is Wave 1.2 and it is a hard prerequisite of the Stripe live switch, not a parallel cleanup.

**Still routed out rather than folded in.** Site plan CAD is sold Studio-only in `pricing.ts` and enforced in the MCP, but carries no `studioGated` flag in the PE workbench catalog, unlike terrain and records. That sold-versus-enforced divergence predates the ladder ruling and wants its own item.

## What this document is not

It is not the pricing authority. `_inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md` and the ladder re-cut decision hold that. It is not the claims authority; `_smartsite_masters/` governs what may be said and wins any conflict with anything written here. It is not a status ledger for serving revisions; those are read from Cloud Run by field name.
