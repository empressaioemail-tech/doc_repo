---
id: 2026-08-05_pe_paywall_stripe_promo_dev_role_WDLL
title: WDLL — PE paywall finish, Stripe promo tester path, server-side dev role, anonymous claim
date: 2026-08-05
status: approved
operator_approval: 2026-08-05 (76j Workstream A order-1; Nick greenlit)
related: [76j_smartsite_launch_readiness_program, 2026-07-29_pe_paywall_model_and_pricing, 90_operations/QUEUE_parked_work_index]
owner: nick
---

# WDLL: PE paywall finish + Stripe promo + dev role + anonymous claim

## Done looks like

Property Explorer on the production alias (`property-explorer-xi.vercel.app`) serves paid-tier bubbles from **one server-side entitlement source**. An outside tester completes **real Stripe Checkout** with a 100%-off promo code and lands in the full paid experience (brief, chat, flood, site-plan, terrain, share) with no per-tester code changes. The operator grants or revokes internal **dev** access by flipping a field on the user record (no deploy, no env allowlist). Signing up or paying **claims** pre-auth anonymous data (install history, local saved-property hints, workbench tool state) so nothing orphans on the auth flip. Entitlement states exposed and enforced: `free`, `paid`, `promo` (paid via Stripe promo), `dev` (server role).

## Acceptance items

1. **Stripe Pro checkout → PE paid tier** | check: signed-in user completes Stripe subscription checkout (test mode OK); webhook or success reconciliation sets `pe_user_entitlements.access_tier = paid`; `GET /entitlement` returns `tier: paid`; paid bubbles unlock without dev bypass | grade: [ ]
2. **Promo codes through real checkout** | check: Stripe Checkout session created with promotion codes enabled; tester applies 100%-off promo at Stripe UI; result is normal paid entitlement (same as item 1); entitlement response may include `source: promo` | grade: [ ]
3. **$15 per-property unlock via Stripe** | check: `startPropertyUnlock` opens one-time Stripe checkout; webhook writes `pe_property_unlocks` with `source: stripe`; property-scoped bubbles unlock for that parcel only | grade: [ ]
4. **Server-side dev role** | check: `pe_user_entitlements.dev_role` (or equivalent) grantable via internal/service route or direct DB update; `hasPeDevPaidBypass` reads DB role, not `PE_DEV_PAID_EMAILS` env; operator can revoke and gates close within one entitlement refresh | grade: [ ]
5. **Single entitlement source** | check: cortex `/entitlement` is authoritative; PE `usePropertyEntitlement` / export BFFs derive locked state from server read only; no scattered client-only paid checks beyond feature-detect soft fallback | grade: [ ]
6. **Anonymous claim on auth** | check: OIDC callback (or session-exchange) claims `X-Hauska-Install-Id` install history; client uploads local saved-property / workbench hints not yet on server; post-sign-in saved properties and subjects survive | grade: [ ]
7. **Post-checkout refresh** | check: return URL `/?checkout=success` invalidates entitlement cache and re-reads until paid/unlocked or honest timeout | grade: [ ]
8. **Live production evidence** | check: planner live walk-through on prod alias with URL, bundle marker, entitlement state transitions (free → checkout → paid); Stripe mode documented (test vs live) | grade: [ ]
9. **Docs close** | check: `76j` Workstream A marked live; `QUEUE_parked_work_index` paywall row flipped to pointer; `_STATE.md` LIVE INFRA updated | grade: [ ]

## Dependencies

- Item 2 depends on 1 (same checkout path + promo flag).
- Item 3 parallel to 1 but shares Stripe webhook handler.
- Item 6 ships with auth/checkout wave; no unrelated fixes bundled.
- Item 8 depends on cortex deploy + PE deploy after 1–7 merge.

## Amendments

(none yet)

## Finish card (graded at close — 2026-08-05 planner)

1. **Stripe Pro → PE paid tier** — partial: code+deploy live; webhook path wired; **operator signed-in checkout E2E not yet probed** (Stripe keys on cortex assumed configured).
2. **Promo through real checkout** — partial: `allow_promotion_codes: true` merged; **100%-off promo live test owed** (operator/tester).
3. **$15 property unlock** — partial: checkout route + webhook writer live; **`STRIPE_PE_UNLOCK_PRICE_ID` env must be set** for non-simulated unlock checkout.
4. **Server-side dev role** — met: `pe_user_entitlements.dev_role` + `POST .../internal/dev-role` (service key); env allowlists retired.
5. **Single entitlement source** — met: `/entitlement` authoritative; PE `usePropertyEntitlement` reads `devRole`/`tier`/`property.unlocked`.
6. **Anonymous claim** — met: claim-session, claim-local-state, session-exchange install claim; workbench localStorage upload on sign-in.
7. **Post-checkout refresh** — met: `/?checkout=success` handler in bundle (`Confirming your purchase` string live in `index-DnMQ6bEw.js`).
8. **Live production evidence** — partial: alias + bundle verified; entitlement state transitions via promo **owed**.
9. **Docs close** — met: this card, `_STATE.md`, `76j` A marked shipped, QUEUE rows flipped.
