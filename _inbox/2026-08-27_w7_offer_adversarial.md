---
id: 2026-08-27_w7_offer_adversarial
title: Adversarial review — W6/W7 offer panel and checkout
status: filed
last_updated: 2026-08-27
---

# W6/W7 review

Branch `fix/qa-w7-offer` on `P:/tmp/hauska-map-qa-w7`. Planner read pricing.ts, reports-catalog.ts, ReportsTool, and the violate tests.

## What holds

Team 12-seat math is $299 + 2 × $25 = $349, with a test that fails leftover $45. Annual is the default interval and is labeled 10 × monthly. Coming-soon catalog rows have `purchaseSurface: false`. `readyCount` throws. Exports collapse to two rows. Terrain lock chip is `Studio, $129/mo`. Freshness is address + day. Fourth chat copy forbids `3 of 3`. Studio blurb is a packet verb. Free envelope draw is gated on `isEntitled`.

Second mechanism (delete Records and Brief to fake a two-report menu) was rejected. They stay Tools on the purchase surface. Feasibility and Comparison stay in the file, off the picker. That matches the open SKU blocker.

## What does not hold

Stripe unlock was not reproduced live. DossierExportAction on this tree had `brief: null` until the planner restored `runBriefResearch` from #237. Marketing lander Pricing nav was not touched.

## Grade

W6.1–W6.4, W6.6, W7.1–W7.7, W7.9 met in unit tests. W6.5 and W7.8/W7.10 partial.
