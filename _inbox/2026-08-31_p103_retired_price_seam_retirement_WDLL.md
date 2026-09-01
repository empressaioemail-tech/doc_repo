---
id: 2026-08-31_p103_retired_price_seam_retirement_WDLL
title: WDLL — P-103: retire the legacy install-scoped checkout seam, both live paths
date: 2026-08-31
last_updated: 2026-08-31
status: open
applies_to: hauska-map (property-explorer BFF), legacy-design-tools (the seam's upstream route)
plan_row: P-103
depends_on: _inbox/2026-08-31_p97-stripe_close.json, hauska-map PR #325 (which retired the client half and NAMED these two remainders)
operator_go: 2026-08-31 ("retire pe-billing.ts")
snapshot: verified read-only against hauska-map 8740558d
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-103 retire the legacy install-scoped checkout seam

Date: 2026-08-31  Status: open

This is a live-money blocker. It ships before the Stripe live switch, not after.

## Why this exists

`POST /brokerage/v1/property-explorer/billing/checkout` is the legacy install-scoped seam. It resolves a tier through `stripePriceIdForTier` to `STRIPE_PRO_PRICE_ID`, the retired pre-ladder Pro price. Any request that reaches it opens a real Stripe checkout at an amount that is not on the locked ladder.

hauska-map PR #325 already retired the client half: the 403/404 feature-detect in `billingClient.ts` now returns an honest refusal instead of falling back, and `startPeCheckoutInstallScoped` is gone. That card was explicit that it did NOT retire the seam, and it named the two paths it left, which is the same-card retirement rule working exactly as intended.

## The operator ruling and its scope correction

Operator 2026-08-31 ruled "retire pe-billing.ts". Verified read-only the same day: retiring `pe-billing.ts` alone is a PARTIAL retirement that would read as complete. Two paths reach the seam, not one.

**Path A.** `apps/property-explorer/api/pe-billing.ts`, a deployed Vercel function, routed at `vercel.json:42` (`/api/pe-billing`) and proxied in `vite.config.ts:48`. Nothing under `apps/property-explorer/src` references it; `git grep -n "pe-billing" origin/main` returns only the function, its route, and the vite proxy. It is publicly routable on the production host.

**Path B.** `apps/property-explorer/api/spine.ts:346` carries `'api/brokerage/v1/property-explorer/billing'` in `cortexPostPaths`, and `/api/spine/(.*)` is routed at `vercel.json:40`. A POST to `/api/spine/api/brokerage/v1/property-explorer/billing/checkout` reaches the same seam.

Both go, or the seam is still reachable and the retirement is a documentation claim.

## Done looks like

Both paths return a decline rather than a checkout, proven by a live probe against the deployed host, and a CI check fails if either reappears. Retirement is proven by decline, never by documentation.

## Acceptance items

1. **Path A removed.** `api/pe-billing.ts` deleted, its `vercel.json:42` rewrite removed, and the `vite.config.ts:48` proxy entry removed. | check: `POST /api/pe-billing?path=checkout` on the deployed host returns 404, captured verbatim with the deployment id | grade: [ ]

2. **Path B removed.** The `'api/brokerage/v1/property-explorer/billing'` prefix removed from `cortexPostPaths` in `api/spine.ts`. Confirm the removal does not orphan a legitimate consumer: the GTM sibling `'api/brokerage/v1/gtm/property-explorer'` at the adjacent line is a DIFFERENT prefix and stays. | check: `POST /api/spine/api/brokerage/v1/property-explorer/billing/checkout` returns a decline; the GTM path still works | grade: [ ]

3. **Prove by decline on the deployed surface, not in source.** Both probes run against the live host after deploy, with the Vercel deployment id recorded. A source diff is not a grade. Code-done is not customer-done. | check: two curl outputs pasted verbatim with status codes | grade: [ ]

4. **A CI check that fails if either path reappears.** A grep-shaped guard in the repo's existing check set: no `pe-billing` file or route, and no billing prefix in `cortexPostPaths`. Shown failing by re-adding one, then passing on removal. A guard observed only passing has not been observed working. | check: both directions, verbatim failure text | grade: [ ]

5. **Name what still reaches the seam upstream, or state that nothing does.** This card retires the two BFF paths. The api-server route `POST /brokerage/v1/property-explorer/billing/checkout` itself still exists and `createSubscriptionCheckoutSession` still resolves `STRIPE_PRO_PRICE_ID`. Establish repo-wide, with the command stated, whether any other caller reaches it — the Chrome extension and any non-PE surface included, and say plainly if you cannot search a repo you were not given. If callers remain, they are named as a leave-behind with an owner, not silently left. | check: the enumeration and its command | grade: [ ]

6. **Do not widen the blast radius.** `STRIPE_PRO_PRICE_ID` is not deleted from Secret Manager or the workflow in this card; an unset install-scoped price id makes `brokerageStripe.ts:174` return `mode:"simulated"` rather than refusing, which is a fail-open the P-97 audit already named. Removing the paths is this card; fixing that fail-open is not. | check: the env var set is unchanged | grade: [ ]

## Explicitly not this card

The Stripe live activation itself, which is operator-owned. The `brokerageStripe.ts:174` simulated-instead-of-refuse fail-open. The published-terms cancellation gap, which is A-062. Any pricing change.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
