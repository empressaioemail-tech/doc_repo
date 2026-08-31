---
id: 2026-08-24_3b_pe_mount_planner_review
title: Planner review of 3b PE Payment Element mount
status: active
date: 2026-08-24
plan_row: P-60
tree: P:/tmp/hauska-map-checkout-3b
---

# 3b PE mount

Operator go 2026-08-24 evening. Isolated tree only. No commit. No PE deploy.

`mountStripeCheckout` now calls `loadStripe` → `initCheckout({ fetchClientSecret, appearance })` → `createPaymentElement().mount`. Missing secret, key, or element throws before Stripe loads. Missing session on `/checkout` and unlock is an honest error, not a dashed fake slot. Submit stays disabled until ready. Confirm uses Stripe `confirm`; PE does not invent card fields. Hosted `checkout.stripe.com` assign remains (WDLL item 3).

Focused suite: **97 passed** (11 files). Violations shown to fail: empty secret, empty key, no element, loadStripe null, confirm error, missing session UI.

## Leftover

Live Element against a serving cortex custom secret. Wallets and promo on a sandbox card. Hosted-kill after the PE alias. Real report kick. Bare `/checkout` still labels Studio.
