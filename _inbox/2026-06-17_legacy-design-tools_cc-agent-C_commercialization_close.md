---
id: 2026-06-17_legacy-design-tools_cc-agent-C_commercialization_close
agent: cc-agent-C
repo: legacy-design-tools
date: 2026-06-17
status: code-ready — deploy pending commit + canary (migration 0042 required)
---

# Commercialization layer close — free-brief first + keyless Stripe/Pipedrive

## Free-brief cap

| Field | Value |
|---|---|
| **N (default)** | **3** — `BROKERAGE_FREE_BRIEFS_CAP` env (operator confirm) |
| Radar verdict | Always free (unchanged) |
| Pro depth | Gated after cap via `paywall_hit` + `upgradeCta: pro_subscription` |
| No-lockout | Read paths (`GET /workspaces/*`, saved briefs) unchanged — only new compute gated |

## Entitlement schema (`brokerage_wallets` + ledger)

Migration: `lib/db/drizzle/0042_brokerage_entitlements.sql`

| Column | Type | Purpose |
|---|---|---|
| `free_briefs_used` | integer | Full briefs consumed from free tier |
| `subscription_tier` | text | `free` \| `pro` |
| `subscription_status` | text | `active` \| `trialing` \| `churned` |
| `subscription_period_end` | timestamptz | Stripe period end |
| `stripe_customer_id` | text | Stripe customer |
| `stripe_subscription_id` | text | Stripe subscription |

Ledger kind added: `free_brief` (zero-cent entitlement debit).

`GET /api/brokerage/v1/wallet` now returns: `freeBriefsUsed`, `freeBriefsCap`, `freeBriefsRemaining`, `subscriptionTier`, `subscriptionStatus`, `subscriptionPeriodEnd`, `proActive`.

402 contract for extension (v0.6.12-safe):

```json
{
  "error": "paywall_hit",
  "freeBriefsUsed": 3,
  "freeBriefsCap": 3,
  "balanceCents": 0,
  "upgradeCta": "pro_subscription"
}
```

## Stripe connector (keyless until secrets wired)

| Secret name (GCP Secret Manager) | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe API |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `STRIPE_PRO_PRICE_ID` | Recurring Pro price for Checkout |

Routes:
- `POST /api/brokerage/v1/billing/stripe/checkout` — creates Checkout session (simulated when secrets absent)
- `POST /api/brokerage/v1/billing/stripe/webhook` — raw-body webhook → entitlement update

**Not added to `cloud-run-deploy.yml --set-secrets` yet** — secrets do not exist in prod; add all three in one operator pass when ready.

## Pipedrive connector (keyless until token wired)

| Secret name | Purpose |
|---|---|
| `PIPEDRIVE_API_TOKEN` | Empressa Solutions LLC API (`empressasolutionsllc.pipedrive.com/api/v1`) |

Optional override: `PIPEDRIVE_API_BASE` (defaults to operator domain above).

### Object mapping (GTM-only — sovereignty boundary holds)

| Pipedrive object | Trigger | Fields synced |
|---|---|---|
| **Person** | `POST /api/auth/signup` | email, install id (custom), acquisition source label |
| **Deal** | `upgrade_started` / `POST /billing/stripe/checkout` | title, install id, stage hint |
| **Lead** | `GET /gtm/triage` qualified prospects | install id, intent score, source event id |

Never synced: buy-box, research payloads, adjudications, tenant-private profile.

## GTM investor funnel event types (live in code)

`radar_autorun`, `deal_kept`, `deal_passed`, `session_return`, `paywall_hit`, `upgrade_started`, `subscription_active`, `churned`

(`lead_feed_open` / `lead_clicked` omitted per 2026-06-17 scope cut.)

`/gtm/digest` extended with `investorFunnel` weekly readout. `/gtm/triage` returns `qualifiedProspects` and fires async Pipedrive lead push.

## Verbatim test output

```
 ✓ src/__tests__/brokerageCommercialization.test.ts (6 tests) 11797ms
   ✓ commercialization free-brief tier > allows first brief at zero wallet balance under free cap  2607ms
   ✓ commercialization free-brief tier > returns paywall_hit after free cap exhausted  957ms
   ✓ commercialization keyless connectors > stripe checkout runs simulated without secrets  641ms
   ✓ commercialization keyless connectors > pipedrive person sync runs simulated without token  656ms
   ✓ commercialization keyless connectors > billing checkout endpoint returns simulated session  658ms
   ✓ investor funnel event types > exports the GTM investor funnel event catalog  637ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
```

Key assertion: first brief at `balanceCents: 0` returns **200** with `freeBriefsUsed: 1`, `freeBriefsRemaining: 2`.

## Deploy sequence (when operator commits)

1. Commit on `main` (uncommitted as of this close)
2. `deploy-canary` → **`run-migrations`** (0042) → smoke → `shift-traffic`
3. Do **not** add Stripe/Pipedrive to `--set-secrets` until secrets exist in `legacy-design-tools-prod`
