---
id: 2026-08-24_phase_close_pe_planner_review
title: Planner review — PE phase-close popup, owner paint, Find
date: 2026-08-24
plan_row: P-60
wdll: _inbox/2026-08-24_phase_close_live_qa_WDLL.md
tree: P:/tmp/hauska-map-phase-close
branch: fix/pe-phase-close-popup-owner-find
base: 5a6d476
---

# Planner review (WDLL items 2, 3, 5)

Re-ran 117 focused tests. Read the write paths.

## Item 3 — accepted on tree

`resolveSubscriptionNavigation` returns `{ action: "modal" }` on `clientSecret`. `handleSubscription` sets `subscriptionSession` and does not assign `/checkout`. Hosted Stripe URL still assigns (item-3 leftover / hosted-kill). `SubscriptionCheckoutModal` wraps existing `CheckoutPage`. Deep link `/checkout?tier=` rewrites to `/?peCheckout=1`. `uiMode` stays `elements`. No invented card fields.

## Item 2 — accepted on tree

`gateOwnerPresentation` returns the Studio upgrade cue unless `subscriptionTierGrantsStudio`. Inspect Owner row uses that. Entitlement not ready reads as null (fail closed). CAD name is not an argument on the inspect path.

## Item 5 — accepted on tree

`resolveLookupToParcelNodeId` takes `currentSubject`. Envelope 404 plus a query that matches the subject situs returns that id. Non-matching 404 is `HONEST_SEARCH_MISS`. Naked 404 string is rewritten.

**Residual:** `findQueryMatchesSubjectSitus` uses includes both ways. A short prefix of the subject situs could resolve the current parcel. The live Chestnut case is the full address.

## leave_behind

Hosted assign, live keys, 4242 on the popup. No commit from the lane.
