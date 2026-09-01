---
id: pe_paywall_e2e_operator
title: PE paywall operator E2E (four actions)
date: 2026-08-05
status: active
owner: nick
related: [2026-08-05_pe_paywall_stripe_promo_dev_role_WDLL, T2_polish_product_track, 76j_smartsite_launch_readiness_program, QUEUE_parked_work_index]
---

# PE paywall operator E2E

Four operator actions that close WDLL items 1–3 and 8 on `_inbox/2026-08-05_pe_paywall_stripe_promo_dev_role_WDLL.md`. Code and deploys are live (cortex `claim-session` 401-not-404 verified; PE bundle carries checkout success refresh). These steps require Stripe Dashboard + signed-in browser + service key; an agent cannot complete them without operator credentials.

Bases:

- PE alias: `https://property-explorer-xi.vercel.app`
- Cortex: `https://cortex-api-tds7av26va-uc.a.run.app`
- Entitlement (anonymous smoke): `GET {CORTEX}/api/property-explorer/v1/entitlement`

## Action 1 — Unlock price secret (`STRIPE_PE_UNLOCK_PRICE_ID`)

WDLL item 3. Without this env, $15 per-property unlock checkout stays simulated or errors.

1. In Stripe Dashboard (test mode OK for this close), create or copy a one-time Price for the $15 property unlock (`mode=payment` product).
2. Set the Cloud Run secret / env on `cortex-api` (project `legacy-design-tools-prod`):
   - Name: `STRIPE_PE_UNLOCK_PRICE_ID`
   - Value: `price_...` from Stripe
3. Redeploy or update the serving revision so it reads the new secret (planner-owned deploy; tag → smoke → shift).
4. Verify from a signed-in PE session: open a parcel → Unlock ($15) → browser redirects to Stripe Checkout (not an in-app "coming soon" stub).

Expected:

| Probe | Expected |
| --- | --- |
| Unlock CTA (signed-in, free tier, locked parcel) | Redirect to `checkout.stripe.com` with amount $15 |
| Anonymous unlock attempt | Auth challenge or 401 from checkout route (not 404) |
| Missing secret (negative) | Honest error / simulated path — document which; do not ship silent no-op |

## Action 2 — Dev-role grant probe

WDLL item 4 (already met in code; operator confirms grant/revoke live).

1. Obtain a PE user id (signed-in `GET` entitlement with session cookie shows `userId`).
2. Grant with service key:

```bash
curl -sS -X POST \
  "https://cortex-api-tds7av26va-uc.a.run.app/api/property-explorer/v1/internal/dev-role" \
  -H "Authorization: Bearer $SERVICE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":"<USER_ID>","devRole":true}'
```

3. In PE (same user), hard-refresh. Paid bubbles (brief, chat, flood, site-plan, terrain) unlock.
4. Revoke: same route with `"devRole":false`. Refresh again; gates close within one entitlement refresh.

Expected:

| Probe | Expected |
| --- | --- |
| `POST .../internal/dev-role` no key | HTTP **401** (route exists; not 404) |
| Grant success | HTTP 200; body acknowledges `devRole: true` |
| `GET .../entitlement` (authed, after grant) | `devRole: true`, entitled; `entitlementSource` may be `"dev"` |
| After revoke | `devRole: false`, paid bubbles locked again |

Anonymous baseline (no cookie), already live-verified:

```text
GET https://cortex-api-tds7av26va-uc.a.run.app/api/property-explorer/v1/entitlement
→ 200 {"authenticated":false,"tier":"free","userId":null,"devRole":false,...}
```

## Action 3 — Promo-code E2E (Stripe Checkout → paid)

WDLL items 1, 2, 8.

1. In Stripe (same mode as cortex keys: test or live — document which), create a 100%-off promotion code on the PE Pro subscription product.
2. Signed-in on PE: start Pro checkout (Upgrade / Pro CTA).
3. At Stripe Checkout, apply the promo code; complete (should be $0).
4. Return URL lands on `https://property-explorer-xi.vercel.app/?checkout=success` (UI shows confirming purchase, then clears the query).
5. Confirm entitlement and UI.

Expected:

| Probe | Expected |
| --- | --- |
| Checkout session | Stripe UI offers "Add promotion code" (`allow_promotion_codes` live) |
| After success | `GET /entitlement` (authed) → `tier: "paid"`; may include `entitlementSource: "promo"` or stripe_promo equivalent |
| PE UI | Brief / chat / flood / site-plan / terrain / share unlocked without dev role |
| Bundle marker | Serving alias still carries post-checkout refresh string (`Confirming your purchase`) |

If webhook lags: wait up to ~30s while PE polls; if still free, check cortex Stripe webhook logs before re-running checkout.

## Action 4 — Anonymous claim smoke

WDLL item 6 (code met; operator confirms auth flip does not orphan data).

1. Incognito PE: note or set install id (`X-Hauska-Install-Id`); save a property hint / touch workbench tool state so localStorage has data.
2. Sign in (OIDC). PE should call claim routes and upload local state.
3. Confirm saved properties / workbench subjects survive on the signed-in account.

API probes (service or session as noted):

| Probe | URL | Expected |
| --- | --- | --- |
| Claim unauthenticated | `POST {CORTEX}/api/property-explorer/v1/claim-session` body `{}` | HTTP **401** (exists; not 404) — live baseline 2026-08-05 |
| Claim with session + install | `POST {CORTEX}/api/property-explorer/v1/claim-session` + cookie + `X-Hauska-Install-Id` | HTTP 200; install history attached to user |
| Local state | `POST {CORTEX}/api/property-explorer/v1/claim-local-state` + cookie, body `{ "savedProperties": [...], "workbenchToolState": {} }` | HTTP 200; rows merge (no wipe of prior server saves) |
| PE return | `https://property-explorer-xi.vercel.app/?signed_in=1` | Claim side-effects run; entitlement cache invalidated |

## Close grading

Re-grade WDLL finish card items **1, 2, 3, 8** with one line of live evidence each (URL + response snippet or screenshot). Flip `QUEUE_parked_work_index.md` row "Paywall operator E2E close" when all four actions pass. T2 workstream 5 owns same-pass fixes if any action fails.
