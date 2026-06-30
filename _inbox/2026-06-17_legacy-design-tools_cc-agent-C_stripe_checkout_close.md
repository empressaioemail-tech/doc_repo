---
id: 2026-06-17_legacy-design-tools_cc-agent-C_stripe_checkout_close
title: cc-agent-C — Stripe Pro checkout upgrade flow close
date: 2026-06-18
agent: cc-agent-C
repo: legacy-design-tools
pr: 194
merge: ddee4c39
---

# Close — Stripe Pro checkout + portal + webhook (Task 2b)

## PR / deploy

| Item | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/194 |
| Merge | `ddee4c39` |
| build-and-push | run `27734813517` |
| deploy-canary | run `27734920237` → **`cortex-api-00199-cen`** |
| migrations | **skipped** (uses existing `0042` wallet columns) |
| canary smoke | **pass** (`scripts/_stripe-billing-smoke.mjs`, simulated mode) |
| shift-traffic | run `27734975059` |

### Serving revision + rollback

| | Revision |
|---|---|
| **Now serving (100%)** | **`cortex-api-00199-cen`** |
| **Rollback handle** | **`cortex-api-00197-hex`** |

```bash
gh workflow run "Cloud Run Deploy (cortex-api)" -f action=rollback -f rollback_revision=cortex-api-00197-hex
```

---

## Extension-agent API contract

Auth (all routes): `X-Hauska-Key: <BROKERAGE_EXTENSION_PUBLIC_KEY>` + `X-Hauska-Install-Id: <install-uuid>`  
( `Authorization: Bearer <same key>` also works.)

### `POST /api/brokerage/v1/billing/checkout`

```json
{
  "successUrl": "https://extension.example/billing/success",
  "cancelUrl": "https://extension.example/billing/cancel"
}
```

**200 response:**

```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_...",
  "mode": "live",
  "publishableKey": "pk_test_..."
}
```

**Keyless (no Stripe secrets on server):** `mode: "simulated"`, `publishableKey: null`. Extension opens `checkoutUrl`, then calls `complete-simulated` (below).

### `POST /api/brokerage/v1/billing/checkout/complete-simulated`

Only when `mode === "simulated"` (Stripe secrets absent). Body optional: `{ "sessionId": "..." }`.

**200:** `{ "ok": true, "proActive": true }` → poll `GET /entitlement`.

### `POST /api/brokerage/v1/billing/portal`

```json
{
  "returnUrl": "https://extension.example/settings"
}
```

**200:** `{ "portalUrl": "https://billing.stripe.com/...", "mode": "live" }`  
Simulated: `{ "portalUrl": "...?simulated_portal=1", "mode": "simulated" }`

### `GET /api/brokerage/v1/entitlement` (post-upgrade)

```json
{
  "freeBriefsRemaining": 3,
  "freeBriefsCap": 3,
  "proActive": true,
  "freeBriefsUsed": 0,
  "balanceCents": 0
}
```

### Upgrade CTA wiring

On **402** `upgrade_required` from `POST /brief`, extension should:

1. `POST /billing/checkout` with success/cancel URLs
2. `window.open(checkoutUrl)`
3. On return (or poll): `GET /entitlement` until `proActive === true`
4. **Manage subscription:** `POST /billing/portal` → open `portalUrl`

---

## Stripe operator setup (TEST MODE FIRST)

### Secret Manager names (add when operator provides test keys)

| Secret | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_...` — Checkout + Portal API |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` — returned on checkout response for Stripe.js (optional) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` — webhook signature verification |
| `STRIPE_PRO_PRICE_ID` | `price_...` — monthly Pro subscription price |

**Do not add to deploy workflow `--set-secrets` until secrets exist in GCP.** Deploy succeeds keyless (simulated checkout).

### Create test Product + Price

```bash
STRIPE_SECRET_KEY=sk_test_... node scripts/_stripe-setup-pro-price.mjs
```

Creates **Hauska Pro** product + **$29/mo** recurring price (test mode). Store output `priceId` as `STRIPE_PRO_PRICE_ID`.

### Webhook endpoint URL (register in Stripe Dashboard → Developers → Webhooks)

```
https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/billing/stripe/webhook
```

**Events to subscribe:**

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

## Live smoke status

| Mode | Result |
|---|---|
| **Simulated (current prod)** | **PASS** — checkout → `complete-simulated` → `proActive: true` |
| **Live test (4242…)** | **Pending operator keys** — no `STRIPE_*` secrets in GCP yet |

### Verified simulated canary smoke (2026-06-18)

```
POST /billing/checkout → 200 mode=simulated
POST /billing/checkout/complete-simulated → 200 proActive=true
GET /entitlement → proActive=true
POST /billing/portal → 200 mode=simulated
```

Install: `cc-agent-C-stripe-smoke-1781753700374`

### Live test-mode procedure (when keys land)

1. Operator adds four `STRIPE_*` secrets + redeploy canary with `--set-secrets` entries
2. Register webhook URL above in Stripe test mode
3. `POST /billing/checkout` → open `checkoutUrl` → pay **4242 4242 4242 4242**
4. Webhook `checkout.session.completed` → `GET /entitlement` shows `proActive: true` (no `complete-simulated`)

---

## No-lockout

Post-cancel (`customer.subscription.deleted` → `subscriptionStatus: churned`), **read paths unchanged**:

- Saved brief runs (`GET /brief/:runId`)
- `GET /entitlement`, workspace list
- Only **new brief compute** reverts to free-cap / `upgrade_required` gate

---

## Handoff extension-agent

Wire the dead upgrade CTA to `POST /billing/checkout`. Use simulated path in dev until Stripe test keys are on cortex-api; then switch to live `checkoutUrl` + entitlement poll after redirect.
