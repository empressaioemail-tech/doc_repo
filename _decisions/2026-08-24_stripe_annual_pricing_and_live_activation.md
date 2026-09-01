---
id: 2026-08-24_stripe_annual_pricing_and_live_activation
title: Stripe annual price amounts, live-mode timing, and grandfathering
date: 2026-08-24
status: active
owner: Nick (operator), recorded by planner
related:
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - _decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md
---

# Stripe annual pricing and live activation

Operator rulings given in-session 2026-08-24, completing the pricing inputs the sandbox rebuild needed.

## Decisions

1. **Annual price amounts ratified at two months free:** Solo $490/yr, Studio $1,290/yr, Team $2,990/yr. Monthly amounts unchanged from the locked ladder (Solo $49, Studio $129, Team $299, Property Unlock $15 one-time for 30 days).
2. **Live-mode activation is deferred until the current QA list is cleared.** The operator performs the Stripe live activation (business profile, bank account) himself at that point. Until then everything runs in sandbox, built so going live is a key and price-ID swap only.
3. **No grandfathering exists.** Current subscribers are testers only; there are no real paying customers. The rebuild may archive and replace the misaligned legacy sandbox prices without a migration path.

## Reversal criteria

- Annual amounts reopen only before live activation; after the first live annual subscription, changes apply to new customers only.
- If a real paying customer is discovered before live activation (contradicting ruling 3), the rebuild pauses for a migration decision instead of archiving their price.
