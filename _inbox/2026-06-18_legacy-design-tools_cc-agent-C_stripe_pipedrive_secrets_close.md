---
id: 2026-06-18_legacy-design-tools_cc-agent-C_stripe_pipedrive_secrets_close
agent: cc-agent-C
repo: legacy-design-tools
date: 2026-06-18
status: blocked-on-operator-secrets — simulated path verified
---

# Stripe + Pipedrive live secrets close

## GCP Secret Manager check (2026-06-18)

```
gcloud secrets list --project=legacy-design-tools-prod --filter="name:STRIPE OR name:PIPEDRIVE"
→ no secrets present yet
```

Operator still assembling: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`, `PIPEDRIVE_API_TOKEN`.

## Code state (simulated fallback — live on canary)

| Connector | Env | Absent-key behavior | Route |
|---|---|---|---|
| Stripe checkout | `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID` | Simulated session URL | `POST /api/brokerage/v1/billing/stripe/checkout` |
| Stripe webhook | `STRIPE_WEBHOOK_SECRET` | 503 or skip verify | `POST /api/brokerage/v1/billing/stripe/webhook` |
| Pipedrive person | `PIPEDRIVE_API_TOKEN` | `mode: simulated` log | `POST /api/auth/signup` |
| Pipedrive lead | `PIPEDRIVE_API_TOKEN` | `mode: simulated` | `GET /api/brokerage/v1/gtm/triage` |

Sovereignty boundary unchanged: buy-box, research, adjudications never sync.

## NOT done (blocked)

1. Add secrets to `legacy-design-tools-prod` Secret Manager
2. Create Pro price: `node scripts/_stripe-setup-pro-price.mjs`
3. Redeploy canary with `--set-secrets` including all five names (append to existing list in `cloud-run-deploy.yml` — do not replace-all drop Cotality keys)
4. Register Stripe webhook: `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/billing/stripe/webhook`
5. Live verify: 4242 test card → `proActive` via webhook; signup → Pipedrive person created

## Operator deploy snippet (when secrets exist)

Append to workflow `--set-secrets`:

```
STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,
STRIPE_PUBLISHABLE_KEY=STRIPE_PUBLISHABLE_KEY:latest,
STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest,
STRIPE_PRO_PRICE_ID=STRIPE_PRO_PRICE_ID:latest,
PIPEDRIVE_API_TOKEN=PIPEDRIVE_API_TOKEN:latest
```

Then: `deploy-canary` → smoke billing + signup → `shift-traffic`.

## Simulated path verification

Entitlement + Stripe module shipped in **#194** (`ddee4c39`). GTM funnel canary smoke passed without Stripe/Pipedrive secrets (events + digest only). Full billing simulated-path tests pass in CI (`brokerageCommercialization.test.ts` on merge #194).

**Live 4242 / Pipedrive person:** pending operator secret upload + redeploy.
