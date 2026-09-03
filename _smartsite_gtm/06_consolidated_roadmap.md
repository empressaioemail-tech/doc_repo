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
| 0.1 | Land P-98b | planner | **DONE 2026-09-01.** #574 `d332d799`, `0092` applied, cortex-api `00686-mig` at 100%, #330 `4401095`, PE live on smartsite.cloud |
| 0.2 | A2P 10DLC brand and campaign registration | operator | not started, longest lead item in this document |
| 0.3 | Email sending domain `email.smartsite.cloud`, records added at GoDaddy | operator | not started |
| 0.4 | GoHighLevel pipeline and tags via API | planner | **DONE 2026-09-01.** Pipeline `POxG6ilXw5CyMHMDukJc`, ten tags, verified by readback |
| 0.5 | Stale-customer blast radius | planner | **DONE 2026-09-01. 38 stale ids:** 9 in `pe_user_entitlements`, 29 in `brokerage_wallets` |
| 0.6 | Card and dispatch A-062 | planner | **DONE.** Carded, compiled, lane running |

**0.1 detail.** PR #574 failed CI on three assertions sharing one root cause: the two halves of P-98b disagree on the billing-interval vocabulary. The server speaks `month` and `year` end to end, deliberately mirroring Stripe's own recurring-interval values and enforced by a `CHECK` constraint in migration `0092`. The client half was built against `monthly` and `annual`, and a translation layer on the response path bridged them while the server's own tests asserted the untranslated form. The ruling is one vocabulary end to end, `month` and `year`, with no translation layer, because a silent mapping between two vocabularies for one subject is the defect class that previously required re-stamping 6.3 million atom rows. Dispatch `_dispatches/2026-09-01_p98b-vocab_dispatch.md`.

Landing 0.1 lights up the `annual_upgrade` rung, which is the highest-value of the five next-action rungs and one of four currently starved. Only `connect_claude` can fire today.

**0.4 detail.** Pipeline creation is proven API-supported: `POST /opportunities/pipelines` returned 422 validation against a `POST /pipelines` 404 control, and nothing was created. Tags likewise. Moving these two tasks off the browser reduces the browser-agent surface from nine tasks to three, which matters because the browser attempt has been failing. What remains genuinely browser-only is the sending domain, A2P, social OAuth, the permission-list transcription, and the demo-contact cleanup. Those are peeled into `05_ghl_chrome_runbook.md`.

### Measured 2026-09-01: the stale-customer blast radius is 38

Checklist item 2 is closed. `pe_user_entitlements` holds 9 rows with a non-null `stripe_customer_id` and `brokerage_wallets` holds 29, against a `pe_user_entitlements` total of 14. Every one of those 38 is a test-mode `cus_` id.

That number is what checklist item 12 has to clear before the live switch, and the reason it cannot be left is that it self-deadlocks. `getOrCreatePeStripeCustomer` returns the stored id unconditionally, a test-mode id under a live key makes Stripe return 400, and the write that would replace the id only runs on a successful checkout that the stale id prevents. Nothing clears it on its own.

Separately, `billing_interval` is non-null on zero rows, which is correct rather than a defect. Nothing backfills it, filling it would require calling Stripe, and the card deliberately refused that. Existing subscribers read null, the rung stays quiet, and the Plan tab prints "Not read".

## Wave 1. Make money takeable

This is the live-money gate. It is shorter than either retired thread believed, because one of its two code items already shipped.

| # | Item | Owner | Blocked by |
|---|---|---|---|
| 1.1 | **A-062** the PE billing portal | property seat | **DONE 2026-09-03.** LDT #583 `59b329df` + hauska-map #334 `e6f12ca6`, both merged, CI green on the actual conclusion string |
| 1.2 | **P-103** retire the legacy checkout seam | property seat | **DONE 2026-09-01.** #331 `847550aa`, deployed, **decline proven live** |
| 1.3 | Stripe live activation, following the P-97 checklist | operator | **UNBLOCKED 2026-09-03.** Phase 0 fully closed (see checklist file); Phase 1 onward needs the operator's own Stripe dashboard access — not planner-executable |
| 1.4 | Live smoke per SKU | planner | 1.3 |
| 1.5 | **P-104** enforce Studio on the web surface, server side | property seat | **SHIPPED 2026-09-01.** #577 + #332 merged, `cortex-api-00689-dal` emits `studioGranted`, PE live on `index-CqQ_6icv` |

**1.1 is the item that sat unowned across both retired threads,** because each assumed the other held it. `terms.html` states verbatim that a customer can cancel a paid plan through the Stripe billing flow in the product, and zero billing-portal references exist anywhere in `apps/property-explorer`. The product is honest and the legal page is not, which is the inversion of the usual failure and the half carrying legal weight. The build is one route against the signed-in user's `stripe_customer_id`, one line added to `deep-allowlist.ts`, and a control in Settings replacing the string "Not built". The Stripe call already exists and is proven at `brokerageStripe.ts:245`. Ruled a blocking Phase 0 item as A-062.

**1.2 is not cleanup and it outranks the fix that already shipped.** `apps/property-explorer/api/pe-billing.ts` is deployed on `https://smartsite.cloud`, is routed by `vercel.json:42`, and has zero callers anywhere in the repo. It was born in one commit as part of a wave and never wired to anything. Live probes on 2026-08-31 returned `GET /api/pe-billing?path=status` 200 with `stripeConfigured` and `liveCheckout` both true, and a control on a bogus path returned 400 while a nonexistent route returned 404, so the handler is real and discriminating rather than a catch-all.

The only gate on `POST /api/pe-billing?path=checkout` is a self-asserted `X-Hauska-Install-Id` header of length eight or more, which any caller can invent. The function then attaches the cortex service key server-side and forwards the caller's body verbatim to the install-scoped seam, where the tier is whatever the caller sent and resolves to the retired `STRIPE_PRO_PRICE_ID`. Stripe being in test mode is the only thing standing between this and real money from the open internet.

So 1.2 is a hard prerequisite of 1.3, not a parallel cleanup. Retirement means deleting the file, the `vercel.json:42` rewrite and the `vite.config.ts:48` dev proxy, then proving retirement by decline with a CI check asserting a 404, per the standing rule that retirement is proven by decline and never by documentation.

**Scope-corrected 2026-08-31 by the lane that carded it, and the correction is right.** Retiring `api/pe-billing.ts` alone is a partial retirement that reads as complete. Two paths reach the retired-price seam: that file via `vercel.json:42`, and a `cortexPostPaths` prefix at `api/spine.ts:346`. P-103 takes both.

Two seats briefly disagreed on whether the second path is live, and **it is resolved: one live path, not two.** The P-97 audit read `api/spine.ts:346` as unreachable configuration because `isCortexBrowsePathAllowed` returns 403 above it, and that reading was correct. The P-103 card's author checked its own claim, found `cortexPostPaths` sits inside the cortex branch below that 403 whose POST allowlist is four exact map-data paths not including billing, and corrected itself in the open.

The correction is recorded here rather than quietly absorbed, because the error is instructive: reachability was inferred from a string's presence in an allowlist without reading the guard above it. Reachability is structural and text search answers it wrongly. The convenient answer was accepted because it made the finding bigger, which is the reason to distrust it.

P-103 does not shrink. Both entries still go, because configuration that reads as a live permission is worth removing and a later refactor relaxing the browse gate would make it live silently. What changed is the grading: one path is live, the other is starved, and the card says which is which rather than scoring both the same.

One item stays routed out. The cortex-side install-scoped seam still resolves tier `pro` to the retired price. This wave removes the clients of that seam, not the seam.

### A third path to the PRO/MAX prices, and why it is NOT a third leak

P-103 found that the Chrome extension calls `POST /api/brokerage/v1/billing/checkout`, which reaches `createSubscriptionCheckoutSession` at `brokerageBilling.ts:80` and resolves the `STRIPE_PRO_PRICE_ID` and `STRIPE_MAX_PRICE_ID` pair. Verified at source. Unlike the seam P-103 retired, this path has a real client.

It is tempting to score that as a third revenue leak and it would be wrong. The two are different in the way that matters. On the retired seam the CALLER chose the tier, and the tier it chose was not on any ladder. Here the tier is the extension's own product tier, and Pro and Max are the extension's real tiers, which predate the Smart Site Solo/Studio/Team ladder entirely. A live client calling a live price for the product it actually sells is not a leak.

What it does do is put a named live client on P-97 checklist item 6, which says there is no safe way to leave `STRIPE_PRO_PRICE_ID` and `STRIPE_MAX_PRICE_ID` at their test values. Item 6 was already an operator decision; it now has a consequence attached. If the extension still sells Pro and Max, both need live price ids created before the switch. If it does not, both need to fail closed rather than resolve to a stale test id, because `subscriptionTierFromPriceId` falls through to `pro` for every subscription when `STRIPE_MAX_PRICE_ID` does not match, which silently grants Pro to a Max subscriber, and an EMPTY value is worse still: `brokerageStripe.ts:174` returns a SIMULATED session under a live key, failing open with no error anywhere.

So the item is: does the extension still sell Pro and Max. That is a product question, not an engineering one, and it gates checklist item 6.

### P-103 retirement proven by decline on the deployed host, 2026-09-01

Not documented, measured. `POST https://smartsite.cloud/api/pe-billing?path=checkout` returned `400 {"error":"install_id_required"}` before, which is the function's OWN error from `pe-billing.ts:42-48` and therefore proof the function existed and ran. After the deploy it returns `404 NOT_FOUND`, which is Vercel's, and therefore proof the function is gone.

The made-up-route control also returns 404, so that control cannot discriminate after the fact, and the comparison carrying the proof is against the recorded before-state rather than against the control. The positive control is what rules out a broken deployment: the sibling `pe-gtm` function still answers 400, so functions still deploy and the 404 is specific to the route that was retired.

The CI guard is what keeps it retired, and it fails on a re-added parent prefix that contains no literal "billing", which is the case a grep would pass.

### P-104: three states, a blocking deploy order, and a CI gate that was never armed

The fix is that the SERVER computes `studioGranted` and consumers consume it. The predicate definition count is three before and three after, zero of them under the BFF, because a fourth copy would have been the defect rather than the fix.

**Three states, not two.** `boolean | null`. True serves, false returns 402 `studio_required` (distinguishable from the free-tier `payment_required`, so a Solo customer is told the right thing), and null returns 503 `entitlement_contract_incomplete`. Absent is unmeasured, not denied. Failing open would preserve the exact leak the card removes; failing closed on absent would tell a paying Studio customer they need to pay, which is a false statement about their account.

**The cost of that honesty is a blocking deploy order,** and it is declared rather than engineered away: cortex-api ships first and the field is verified on the live body before the Vercel deploy, or every Studio and Team customer gets a 503 on CAD and terrain until the server catches up. The lane's gate command used an unauthenticated curl, which 401s on that route and therefore could not answer the question; the authenticated form is in the PR.

**Exposure is seven days of code exposure and unmeasured customer exposure.** The window opened 2026-08-24 with the ladder, not with the gate, which was correct for the thirty days there was only one paid tier. Customer exposure is recorded as UNMEASURED rather than zero, with both instruments named. The lane repeated the test-mode claim as the planner's rather than adopting it as fact, which is the right handling.

**One artifact now has two answers on two surfaces.** PE's `dossier` is the Solo X-ray and is deliberately NOT gated, because gating it would have taken away a sold Solo capability. The MCP's `STUDIO_EXPORT_KINDS` includes `dossier`. That divergence is logged and unresolved because resolving it is a product call, not an engineering one.

**And a control that was never armed.** CI does not typecheck the PE BFF: `tsconfig.json` has `include: ["src"]` and the workflow runs exactly that. It was proved by planting a type error in `api/_lib/` and watching CI's typecheck exit 0, which is the only way that class of finding can be established. An `api/tsconfig.json` exists, nothing invokes it, and it holds three pre-existing errors. The lane deliberately did NOT arm it, because arming it would ship a permanently red dead gate, and routed it as a backlog item with the arming step and the three errors named. That is the correct call: a red gate teaches the fleet to use the bypass.

### A-062 found a guard that could never fire, by reading the write path

The portal is built: the route resolves `stripe_customer_id` from the session and refuses a caller-supplied one across seven spellings with a `.strict()` schema closing the set; no customer id is a declared 409 rather than a throw, a 500, or a Stripe customer created as a side effect of asking; `returnUrl` is required with a host allowlist, which makes the stale hardcoded Vercel default unreachable by construction rather than merely unused; and `hasBillingAccount` is added to the account body only, so the with-parcel contract the BFF pins does not move and the customer id never reaches the wire.

**The finding worth keeping is in the code that was reused.** `createBillingPortalSession` contained `const portalUrl = String(session.url); if (!portalUrl) throw`. `String(undefined)` is the string `"undefined"`, which is truthy, so that guard could never fire. A Stripe response carrying no url would have redirected an extension customer to a page named "undefined". It was found by reading the write path, not by measuring output, which is the pattern every real defect in this operation has followed. The fix lives in the extracted primitive so both seams inherit it.

**A prediction that was right about the failure and wrong about the mechanism, recorded rather than smoothed.** Disabling the named customer-id check still refused the request, through `.strict()`, with a different error code. The test caught it only because it asserts the error string. A test asserting merely that the request failed would have reported a working control that had quietly lost half of itself.

**The base moved under the lane mid-build** and it caught that by re-fetching at close rather than trusting its own checkpoint, then re-measured everything against the new base and ran the new guard from P-103. File overlap with that merge was enumerated with `comm`, not eyeballed: none.

One clause is explicitly not met and not claimed: the live open showing a customer returns to smartsite.cloud needs a deploy and a browser session, and is planner-owned after merge.

### P-104 shipped, and the ordering constraint nearly failed because it lived in prose

Both PRs were merged by another session while this seat was writing docs. The merges were fine; the order was not. The BFF half refuses when `studioGranted` is absent, so hauska-map `main` sat in a state where the next PE deploy by anyone would have returned 503 to every Studio and Team customer on CAD and terrain. Nothing was broken, because hauska-map does not auto-deploy on merge, but the gun was loaded and the person who fired it would not have known they had.

Closed in the correct order: canary on the merge SHA, three-way verification that the canary emitted `studioGranted` while the then-serving revision did not and a bogus path 404'd, traffic shifted to `cortex-api-00689-dal`, the gate re-checked on production, and only then the PE deploy. P-103's retirement was re-probed after that deploy and still declines, with a sibling function answering 400 as the positive control.

**The lesson is about where the constraint lived.** It was in bold in the card, in the PR body, and in a plan row, and it was still nearly violated. Prose controls went roughly 0-for-4 across this session while every hook-shaped control fired correctly. An ordering constraint this consequential wants to be a check, not a paragraph: the PE deploy path could assert that the deployed cortex-api emits the field before it proceeds.

### And the api typecheck gap is bigger than P-104's lane could see

P-104 reported that CI does not typecheck the PE BFF, proved it by planting an error and watching CI exit 0, and routed it to backlog rather than arming a permanently red gate. Confirmed and worse: `apps/property-explorer/tsconfig.json` carries `"include": ["src"]`, so the build's own `tsc --noEmit` never sees `api/` either.

The authoritative observation is from the cloud build itself. The production deploy **printed** `TS2339` and `TS2345` diagnostics for `api/pe-share-grant.ts` and `api/pe-share-view.ts` and completed READY anyway. So nothing gates api type errors: not CI, not the build's typecheck, and not the deploy that prints them. That is a broader finding than three standing errors in an uninvoked tsconfig, and it belongs on the backlog item.

## Wave 2. Make the ladder real and the funnel measurable

Runs alongside Wave 1. Nothing here waits on Stripe.

| # | Item | Owner | Blocked by |
|---|---|---|---|
| 2.1 | **P-101** ladder re-cut across both surfaces | property seat | nothing, carded |
| 2.1b | **P-102** two-seat Studio, split out per ruling 2 | property seat | sequence after P-101 |
| 2.2 | **P-100** share and funnel instrumentation | property seat | **code complete**, diffs held behind P-104; migration `0093` NOT applied |
| 2.3 | Screen test the four affiliate segment lines | operator | nothing |
| 2.4 | Affiliate kits, one per segment | planner | 2.3 |
| 2.5 | Content production, five pillars | operator and planner | 0.4 |
| 2.6 | Affiliate recruiting into the pipeline | operator | 0.4 |

Recruiting sits here rather than in Wave 3 deliberately. It was ruled unblocked; only link distribution holds.

**2.1 carries corrections that move its cost.** The scoping lane found that two-seat Studio is not a copy edit. The P-94 roster server half is built team-only and what it currently hands a Studio subscriber is a 409, because `resolveTeamSeatsPurchased` returns null for any non-team tier and `inviteTeamMember` throws `SEATS_PURCHASED_UNKNOWN` on the resulting undefined before reaching the capacity check. A unit test pins the no-Studio-seats behaviour and must be inverted rather than deleted. It also found that the comparison-table regroup is a code change and not config, because `PricingModal.tsx:61-65` hardcodes the three groups and nothing iterates the groups config, so a lane editing only `pricing.ts` ships a fourth group that renders nowhere while the existing test still passes.

**A structural finding from that lane outlives P-101.** There are three copies of `subscriptionTierGrantsStudio` across the two repos, not two, and the test named "matches api-server predicate" asserts hardcoded booleans against its own local copy and never opens the api-server file. That is internal consistency wearing a divergence test's name. The consequence sharpens the connector ruling rather than weakening it: gate at the tier and both surfaces inherit is structurally true only for a route gate, and false for any predicate gate, because a predicate would simply become a fourth copy.

**2.2 is measure-then-close-gaps, not build-from-zero.** The event infrastructure exists. The one gap established repo-wide as genuinely absent is sharer attribution, so a recipient who signs up today is credited to nobody. This is the declared gate on affiliate link distribution, and the reason is not perfectionism: events cannot be backfilled, and the first sixty days is exactly the window in which share and affiliate traffic have to be told apart.

### P-100 measured first, and the measurement changed the build

The card's instruction to measure before building was the whole value of the row.

**The Smart Site share plane emitted nothing at all.** The only `share_created` writer was on the brokerage workspace surface, 7 rows, last fired 2026-07-19. `share_viewed` had a writer that has never written a row in the store's history. What the Smart Site share landing actually emitted was `pe_browse_started` carrying a `shareLanding` flag in its payload: a browse event wearing a flag, carrying no grant id, 12 rows against 10,286. That is the shape that reads as instrumented and measures nothing, which is exactly the suspicion the card asked item 1 to settle.

**The card asked for three states and the data required five.** `ROWS_NO_WRITER` (four orphan types left by a retired extension writer) and `MENTION_ONLY` (five types produced conditionally by code a text scan cannot follow) cannot be folded into absent, zero, or rows without filing a false report.

**The card's own premise on attribution was half wrong, and this is the most consequential finding.** The card said sharer attribution does not exist, on four zero-hit greps, and those greps were accurate. But `pe_share_grants` already exists from migration 0085, with 12 live rows carrying `grantor_user_id`, server-written by the mint route. The grant row id the card asked attribution to be keyed on was already there. And `share-landing.ts` already stashes that id through the `?signed_in=1` OIDC round-trip, which is precisely the anonymous-to-account trap the card warned about. Only the join was missing. That narrowed item 3 from build attribution to build the join, and it is why nothing was rebuilt.

**A pre-registered prediction was lost, and losing it changed a design.** The lane predicted most of the 741 null-consent rows belonged to installs with no consent record. Wrong: 62 percent have one, and the writer simply never read it. That turned item 5 from unrecoverable into resolve from the store and refuse only the remaining 38 percent.

**A free finding, out of scope and backlogged.** `pe_upgrade_started` stands at 42 against zero PE conversion events. `brokerageBilling.ts:191` gates the only webhook recording on `if (result.installId)`, while every PE branch returns `peUserId` and often no install id. The competing explanation, a dead webhook, is disproven by `pe_user_entitlements` holding 14 rows that only that handler writes.

**Honest partial:** six of seven items closed in code, and migration `0093` is written and NOT applied, so three new routes error until it runs. The DDL guarantees are unverified because the lane had no test Postgres; the readable refusals are tested and the unbypassable ones are not, and the close says so rather than implying otherwise.

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

## Studio is not enforced on the web at all, and it changes what P-101 is worth

Verified at source 2026-09-01 against hauska-map `origin/main`, after P-104 was carded.

`apps/property-explorer/api/_lib/pe-site-plan-export-core.ts:430` gates site plan CAD on `input.entitlement.tier !== 'paid'`. A Solo subscriber is paid. So a 49 dollar Solo customer clicks site plan CAD on the web today and receives it, while the pricing table sells it as Studio at 129. Line 396 of the same file states that terrain export shares that gate, so terrain leaks the same way. Line 400 types the whole thing as `'free' | 'paid'`, which cannot express Studio even in principle.

The scope is larger than those two exports. The word `studio` appears in **zero** files under `apps/property-explorer/api`, the web surface's entire server side. The negative control is that `entitlement` appears in thirteen files under the same pathspec, so the search and the pathspec work and the zero is a real absence rather than a broken instrument. **Every Studio lock on the web is client-side only.** The `studioGated` flags in the reports catalog drive a lock in the React tree and nothing else.

Two source comments assert the opposite, at `peEntitlement.ts:29-30` and `propertyExplorer.ts:276-277`, both stating the PE BFF gates Studio-only surfaces on studio-or-team and never on bare tier. The server does supply `subscriptionTier`. The BFF never reads it. That is the enforcement doctrine's worst shape: not an absent control, but one documented as working, with its input supplied, shipping a plausible client artifact, and enforcing nothing. Reading it satisfies you and only violating it does not.

**The consequence for the ladder re-cut.** The scoping lane already found Studio's whole differentiation is four items. Screens were ungated, which P-101 fixes. Site plan CAD and terrain are unenforced on the web, which P-104 fixes. So P-101 alone does not make Studio real on the paid surface; the two rows together do. A tier whose differentiators are all client-side is a suggestion, not a tier.

**The inversion worth sitting with.** The MCP connector enforces this correctly. The connector was ruled a free door and a top-of-funnel surface. The workbench, which is the surface people pay for, is the leaky one. The free door is the strict one.

**Why this sits in Wave 1 rather than later.** It costs nothing today, because Stripe is in test mode and nobody is paying. The cost begins at the first live Studio sale. So the deadline is the live switch, not some later cleanup window. It does not block the switch the way A-062 does, since no wrong charge and no legal exposure follow from it, but shipping live money while Studio's capabilities are free to Solo undermines the re-cut on the day it launches.

## Operator rulings, 2026-08-31

All three calls that were open when this document was written are now ruled. They are recorded here because this is the document the build works against; the plan-of-record row and the decision record may be filed by the lane closing out P-101, and if a second record appears it should be reconciled against this section rather than either being silently dropped.

**Ruling 1, screens gating and the free connector.** Gate `create_screen` and `add_to_screen`. Leave `list_screens` open. The panel still mounts, so the connector keeps the top-of-funnel role the connector ruling assigned it, and a free user meets the upgrade prompt in context rather than meeting nothing at all. Nothing real is given away, because `list_screens` on a free account returns an empty list. The job Studio sells is building the list, not reading one the user could never create.

**Ruling 2, two-seat Studio splits out of P-101 into its own row.** It is four coordinated server changes plus an unresolved Stripe product question, sitting behind a 409, with a unit test pinning the current behaviour that must be inverted rather than deleted. The rest of the re-cut is gates and copy and ships without it. Bundling would make the fast half wait on the slow half, and two seats is the weakest line in the re-cut: the pitch is that Solo answers one parcel and Studio works a list, not that Studio gets a second seat.

**Ruling 3, `api/pe-billing.ts` is retired.** Delete the file, the `vercel.json:42` rewrite and the `vite.config.ts:48` dev proxy, then prove retirement by decline with a CI check asserting a 404. This is Wave 1.2 and it is a hard prerequisite of the Stripe live switch, not a parallel cleanup.

**Still routed out rather than folded in.** Site plan CAD is sold Studio-only in `pricing.ts` and enforced in the MCP, but carries no `studioGated` flag in the PE workbench catalog, unlike terrain and records. That sold-versus-enforced divergence predates the ladder ruling and wants its own item.

## What this document is not

It is not the pricing authority. `_inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md` and the ladder re-cut decision hold that. It is not the claims authority; `_smartsite_masters/` governs what may be said and wins any conflict with anything written here. It is not a status ledger for serving revisions; those are read from Cloud Run by field name.
