# Stripe + Pipedrive secrets live — cortex-api

**Date:** 2026-06-18  
**Agent:** cc-agent-C  
**Status:** CLOSED — billing + CRM connectors live on prod (TEST mode)

---

## Summary

| Field | Value |
|---|---|
| **Prod revision** | `cortex-api-00210-mup` @ **100%** |
| **Image** | `…cortex-api@sha256:e13825f69b692eebc88e6f5c355fa147ab9f02dd832cafc3f41884332f3f2967` (`stripe-pipedrive-00209`) |
| **Prod URL** | `https://cortex-api-tds7av26va-uc.a.run.app` |
| **Migration** | None (`0042` already on prod) |
| **Rollback handle** | `cortex-api-00204-kew` (pre-Stripe/Pipedrive secrets; prior GTM/profile ship) |

---

## GCP Secret Manager (legacy-design-tools-prod)

Created + IAM (`secretAccessor` → `api-server-runtime@legacy-design-tools-prod.iam.gserviceaccount.com`):

| Secret | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe TEST API (`sk_test_…`) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe TEST publishable (`pk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | TEST webhook signing (`whsec_…`) |
| `STRIPE_PRO_PRICE_ID` | `price_1Tjg4SFjAepSMTX7pJ5GLYBf` ($29/mo) |
| `STRIPE_MAX_PRICE_ID` | `price_1TjgpfFjAepSMTX7JrvW0nmU` ($99/mo) |
| `PIPEDRIVE_API_TOKEN` | Empressa Pipedrive API token |

Mounted on Cloud Run via `--set-secrets` (full list includes existing Cotality/DB keys + six above). Workflow updated: `.github/workflows/cloud-run-deploy.yml`.

---

## Deploy sequence

1. **Secrets upsert** — six TEST-mode values (shell vars only; not logged or committed).
2. **Canary deploy** `cortex-api-00206-pur` — secrets mounted; exposed Pipedrive `stage_id` string bug (checkout 503).
3. **Hotfix build** `stripe-pipedrive-00207` → `cortex-api-00208-vev` — Pipedrive error isolation + numeric `stage_id`; shifted prod.
4. **Hotfix build** `stripe-pipedrive-00209` → `cortex-api-00210-mup` — removed invalid Pipedrive custom-field hash; shifted prod.

---

## LIVE prod verification

### Stripe billing (TEST mode)

| Check | Result |
|---|---|
| `POST /api/brokerage/v1/billing/checkout` | **200** `mode: "live"` — real Stripe Checkout session (`cs_test_…`) |
| Test payment | `tok_visa` (4242-equivalent) subscription created; signed `checkout.session.completed` webhook posted to prod |
| Webhook handler | **200** `{ received: true, eventType: "subscription_active" }` (no longer `stripe_not_configured`) |
| `GET /api/brokerage/v1/entitlement` | **200** `proActive: true` |
| `POST /api/brokerage/v1/billing/portal` | **200** `mode: "live"` — `https://billing.stripe.com/p/session/test_…` (not simulated) |

Install used for Stripe path: `stripe-live-20260618094543384`

> Note: Cursor browser automation could not render Stripe hosted Checkout (Stripe bot block); payment + webhook verified via Stripe TEST API + signed webhook replay against the live handler.

### Pipedrive CRM (signup sovereignty)

| Check | Result |
|---|---|
| `POST /api/auth/signup` + fresh `X-Hauska-Install-Id` | **201** — `u_b74a1069afb7d8eb4af5147b` |
| Email | `hauska-pd-live-20260618095910@example.com` |
| Install | `pipedrive-live-b3c6fdb0ea40` |
| Cloud Run logs (`00210-mup`) | No `pipedrive: person sync failed` after custom-field fix (prior `00208` logged invalid field hash) |
| Sovereignty | Signup sync sends identity + install only — no research/profile payload |

---

## Code fixes shipped in image (local, not yet committed)

- `brokeragePipedrive.ts` — swallow CRM errors (no process crash); remove bogus custom-field key; success log `pipedrive: person synced`
- `brokerageBilling.ts` — drop invalid `stage: "upgrade_started"` on deal sync
- `cloud-run-deploy.yml` — append six secrets to `--set-secrets`

---

## Rollback

```powershell
gcloud run services update-traffic cortex-api `
  --region=us-central1 `
  --project=legacy-design-tools-prod `
  --to-revisions=cortex-api-00204-kew=100
```

Removes Stripe/Pipedrive secret mounts (revision env snapshot). Secrets remain in Secret Manager for re-deploy.

---

## Operator follow-ups

1. **Commit** pipedrive/billing hotfixes + `cloud-run-deploy.yml` secret list.
2. **Pipedrive custom field** — if install id must be a dedicated CRM field, create it in Pipedrive UI and wire `PIPEDRIVE_INSTALL_ID_FIELD_KEY` (future env) instead of name suffix.
3. **Stripe Dashboard** — confirm TEST webhook endpoint targets `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/billing/stripe/webhook` with the mounted `whsec`.
4. **Live keys** — swap Secret Manager versions to `sk_live_` / `pk_live_` / live webhook + prices before production billing cutover.
