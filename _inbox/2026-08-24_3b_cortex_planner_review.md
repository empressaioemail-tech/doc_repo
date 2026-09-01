---
id: 2026-08-24_3b_cortex_planner_review
title: Planner review of 3b cortex Custom Checkout
status: active
date: 2026-08-24
plan_row: P-60
tree: P:/tmp/ldt-checkout-3b
---

# 3b cortex planner review

Read [3b cortex](244ef7dd-03d3-46fb-a60e-43dc71fdab2c) CP1/CP2 and the write path. Isolated tree `fix/pe-checkout-3b` @ `244567a5`, uncommitted.

## Write path

`applyPeCheckoutUiMode` posts `ui_mode` + `return_url` (injects `{CHECKOUT_SESSION_ID}`) and does not set `success_url` / `cancel_url`. `livePeCheckoutFromSession` on custom requires a non-empty `client_secret` and omits `checkoutUrl` even when Stripe also returned a hosted `url`. Hosted still requires `session.url`. Simulated custom returns `cs_test_…_secret_sim` and no URL. Missing price ID still 503 before Stripe. Routes pass `uiMode` / `returnUrl`. Unknown `uiMode` is 400.

The violation tests call Stripe with `id` + hosted `url` and no `client_secret`; both create functions throw `missing id or client_secret`. Live custom form assertions check `success_url` / `cancel_url` are null.

## Re-run

This shell has no `DATABASE_URL`. `vitest` on the two files failed at collect (`DATABASE_URL must be set`). Agent 60/60 used a throwaway Neon. Not reproduced here. Code-read of the write path is the grade.

## Leftover

No commit. No cortex deploy. PE mount still waits on this secret against the same violation fixture once the PE scaffold lands.
