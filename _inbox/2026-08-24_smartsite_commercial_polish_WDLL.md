---
title: SmartSite commercial polish — pricing, share, landing
status: active
date: 2026-08-24
plan_row: P-60
pricing_source: _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
---

# WDLL — SmartSite commercial polish (no new ingest)

Operator approved 2026-08-24. Align live PE UI with locked 2026-08-10 pricing ladder. Feasibility report SKU parked.

## Observable end state

All customer-visible price strings match the locked ladder. Share link mint works **without** property unlock. Unlock flow shows **$15 for 30 days** and tier names Solo/Studio/Team (not retired Pro $99 forever). Landing/signup card copy is current. Unlock does not bypass payment for non-dev users.

## Acceptance items

1. **pricing.ts** reflects locked ladder: Solo $49/mo, Studio $129/mo, Team $299/mo (10 seats), unlock $15 / 30 days; retired "forever" and "$99 Pro" removed from user-visible strings. | check: grep + `pricing` unit tests if any | grade: [ ]

2. **Share free.** `ShareTool` mint does not require property entitlement; server mint route allows authenticated free users (adjust PE BFF + cortex gate if needed). Canon: share is acquisition, not paid. | check: ShareTool test + manual mint while locked on reports | grade: [ ]

3. **UnlockFlow / LockedToolPanel** use updated labels and blurbs from `pricing.ts`; unlock duration "30 days" surfaced. | check: UnlockFlow render test | grade: [ ]

4. **SignUpCard** landing copy updated (not stale Central Texas-only wedge if operator copy provided; at minimum align with `_smartsite_masters/06` free tier bullets). | check: read SignUpCard.tsx | grade: [ ]

5. **Unlock bypass closed.** Non-`devRole` users hitting unlock go to Stripe checkout (or honest "coming"), never silent entitlement. Document if operator `devRole` explains test behavior. | check: code read + test | grade: [ ]

## Out of scope

- Stripe product/price rebuild in Stripe dashboard (flag in close if amounts still wrong server-side)
- Feasibility PDF assembler
- Phase 2 ingest
