---
id: 2026-08-31_p103_retired_price_seam_retirement_WDLL
title: WDLL — P-103: retire the legacy install-scoped checkout seam (one live path, one latent)
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

Operator 2026-08-31 ruled "retire pe-billing.ts". Two configured paths point at the seam, not one, so retiring `pe-billing.ts` alone leaves a configuration that reads as a live permission. Only ONE of the two is actually reachable; see the Path B correction below, which was another seat's catch of a planner error.

**Path A.** `apps/property-explorer/api/pe-billing.ts`, a deployed Vercel function, routed at `vercel.json:42` (`/api/pe-billing`) and proxied in `vite.config.ts:48`. Nothing under `apps/property-explorer/src` references it; `git grep -n "pe-billing" origin/main` returns only the function, its route, and the vite proxy. It is publicly routable on the production host.

**Path B, CORRECTED 2026-08-31 — dead configuration, not a live path.** `apps/property-explorer/api/spine.ts:346` carries `'api/brokerage/v1/property-explorer/billing'` in `cortexPostPaths`, and `/api/spine/(.*)` is routed at `vercel.json:40`. The planner originally called this a second live path. **That was wrong, and another seat caught it.** `cortexPostPaths` sits INSIDE the `if (path[0] === 'cortex')` branch, BELOW the `isCortexBrowsePathAllowed` 403 at `spine.ts:311-317`, whose POST allowlist is four exact map-data and envelope paths that do not include billing. The code says so itself at `spine.ts:328-329`: "Legacy command-center cortex paths retained for shared spine.ts deploy; property-explorer browse gate above blocks them on this surface." The P-97 audit had already scored it a starved entry that merely reads as a live permission, and that reading is correct.

The planner error was inferring reachability from the presence of a string in a list without reading the guard above it. Reachability is a structural question and text search answers it wrongly; that is a documented recurring error for this seat and it recurred here.

**Both still go**, because retiring dead configuration that reads as a live permission is correct hygiene and costs nothing, and because a future refactor that moves or relaxes the browse gate would silently make it live. But the CHARACTERIZATION changes: path A is a live hole, path B is a latent one. Grade them differently and do not report path B's removal as closing an exploitable path.

## Done looks like

Both paths return a decline rather than a checkout, proven by a live probe against the deployed host, and a CI check fails if either reappears. Retirement is proven by decline, never by documentation.

## Acceptance items

1. **Path A removed. This is the live one.** `api/pe-billing.ts` deleted, its `vercel.json:42` rewrite removed, and the `vite.config.ts:48` proxy entry removed. | check: `POST /api/pe-billing?path=checkout` on the deployed host returns 404, captured verbatim with the deployment id | grade: [ ]

2. **Path B removed. This is the LATENT one — expect it to 403 already.** The `'api/brokerage/v1/property-explorer/billing'` prefix removed from `cortexPostPaths` in `api/spine.ts`. Confirm the removal does not orphan a legitimate consumer: the GTM sibling `'api/brokerage/v1/gtm/property-explorer'` at the adjacent line is a DIFFERENT prefix and stays. | check: probe it BEFORE the change and record the status; a 403 before removal CONFIRMS it was already blocked and is the expected result, not a failed test. After removal it still declines. The GTM sibling still works | grade: [ ]

3. **Prove by decline on the deployed surface, not in source.** Both probes run against the live host after deploy, with the Vercel deployment id recorded. A source diff is not a grade. Code-done is not customer-done. | check: two curl outputs pasted verbatim with status codes | grade: [ ]

4. **A CI check that fails if either path reappears.** A grep-shaped guard in the repo's existing check set: no `pe-billing` file or route, and no billing prefix in `cortexPostPaths`. Shown failing by re-adding one, then passing on removal. A guard observed only passing has not been observed working. | check: both directions, verbatim failure text | grade: [ ]

5. **Name what still reaches the seam upstream, or state that nothing does.** This card retires the two BFF paths. The api-server route `POST /brokerage/v1/property-explorer/billing/checkout` itself still exists and `createSubscriptionCheckoutSession` still resolves `STRIPE_PRO_PRICE_ID`. Establish repo-wide, with the command stated, whether any other caller reaches it — the Chrome extension and any non-PE surface included, and say plainly if you cannot search a repo you were not given. If callers remain, they are named as a leave-behind with an owner, not silently left. | check: the enumeration and its command | grade: [ ]

6. **Do not widen the blast radius.** `STRIPE_PRO_PRICE_ID` is not deleted from Secret Manager or the workflow in this card; an unset install-scoped price id makes `brokerageStripe.ts:174` return `mode:"simulated"` rather than refusing, which is a fail-open the P-97 audit already named. Removing the paths is this card; fixing that fail-open is not. | check: the env var set is unchanged | grade: [ ]

## Explicitly not this card

The Stripe live activation itself, which is operator-owned. The `brokerageStripe.ts:174` simulated-instead-of-refuse fail-open. The published-terms cancellation gap, which is A-062. Any pricing change.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
