---
id: 2026-08-24_rebrand6_auth_pricing_WDLL
title: Smart Site rebrand project (6) — pricing 3a copy cut + Google button
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (implement P:\doc_repo\_temp\Smart Site rebrand project (6))
frames: P:\doc_repo\_temp\Smart Site rebrand project (6)\handoff\auth-pricing
---

# WDLL: Rebrand (6) auth and pricing

Operator pointed at project (6) and said implement. Frames are pricing 3a (A2 copy cut) and auth 3a (one Google button). Auth 3b (embedded Stripe checkout) is named leave_behind: cortex must return a Payment Element / embedded Checkout `clientSecret`. PE will not invent card fields.

## Done looks like

The live pricing popup matches the 3a frame: fewer words, check/dash cells, Free as a one-line caption in the table, no framing paragraph, no stay-free closer, no second unlock nudge. Every Google entry point is the branded "Sign in with Google" button (full-colour G, unmodified). Checkout still redirects to Stripe until cortex ships embedded mode.

## Acceptance items

1. **Pricing 3a copy.** Header is Smart Site + Pricing. No "one ladder" line. No stay-free closer. No soloNudge under unlock. Free caption is one line. Cells are check / dash / 1 / seat text. Prospect coming-soon row is gone. Prices unchanged from PE_PRICING. | check: pricing-modal.test + grep PricingModal for removed strings | grade: [met] tests

2. **Numbers locked.** Annual $490 / $1,290 / $2,990. Monthly $49 / $129 / $299. Unlock $15 / 30 days. No new price literals. | check: pricing.test.ts | grade: [met] tests

3. **Google button.** One component, three sizes, dark default, light on the landing card. Label is "Sign in with Google". Pending is "Signing in…". G mark is the official four-colour SVG. | check: google-sign-in-button.test + every former text-link call site | grade: [met] tests

4. **Placements.** Locked dock, reports/export sign-in, flood notice, chat, properties, compare, share overlay, SignUpCard. No remaining "Continue with Google" or bare "Sign in" text link on those paths. | check: ripgrep those strings in src | grade: [met] rg; only remaining "Continue with Google" is the negative test

5. **Checkout unchanged until cortex.** Start Solo/Studio/Team and Unlock still call the existing seams and redirect to a Stripe checkout URL. No fake card form. | check: useCheckoutActions + billingClient tests | grade: [met] no checkout file touched

## Do not

- Load Oxygen from a CDN.
- Recolor the Google G.
- Fake an embedded Payment Element without a server `clientSecret`.
- Write cortex. 3b is leave_behind.

## leave_behind

- item: rebrand (6) 3b checkout inside Smart Site
  owner: `_inbox/2026-08-24_rebrand6_checkout_3b_WDLL.md`
  plan_row: P-60
  note: drafted 2026-08-24; operator_go needed
