# cortex-api prod traffic shift — 00204-kew

**Date:** 2026-06-18  
**Agent:** cc-agent-C  
**Status:** CLOSED — prod serving `cortex-api-00204-kew` @ 100%

---

## Change summary

| Field | Value |
|---|---|
| **Prior prod revision** | `cortex-api-00199-cen` (100%) |
| **New prod revision** | `cortex-api-00204-kew` (100%) |
| **Rollback handle** | `cortex-api-00199-cen` |
| **Keystone commit** | `9fe187ea` — Fix buy-box profile owner resolution for extension installs |
| **Image** | `us-central1-docker.pkg.dev/legacy-design-tools-prod/apps/cortex-api@sha256:7503447a35a60d2e12b7fbc616868854d37cd6bc24daced069dcd29f3b6e58ac` |
| **Prod URL** | `https://cortex-api-tds7av26va-uc.a.run.app` |
| **Canary tag URL** | `https://canary---cortex-api-tds7av26va-uc.a.run.app` (same revision while canary tag retained) |
| **Migration** | None — `0042_brokerage_entitlements.sql` already applied on prod |

### Ship bundle (00204)

- GTM investor funnel readout (`investorFunnel` on `/gtm/digest`)
- Buy-box teacher (`/profile`, `/profile/verdict-action`)
- Profile persistence fix (`9fe187ea` — extension install owner resolution)

---

## Traffic shift

```powershell
gcloud run services update-traffic cortex-api `
  --region=us-central1 `
  --project=legacy-design-tools-prod `
  --to-revisions=cortex-api-00204-kew=100
```

**Post-shift routing:**

| Traffic | Revision | Tag |
|---|---|---|
| 100% | `cortex-api-00204-kew` | `canary` |
| 0% | `cortex-api-00182-mer` | `gfix` |

`cortex-api-00199-cen` is no longer in the active traffic split (available for rollback).

### Rollback (if needed)

```powershell
gcloud run services update-traffic cortex-api `
  --region=us-central1 `
  --project=legacy-design-tools-prod `
  --to-revisions=cortex-api-00199-cen=100
```

---

## LIVE prod verification

**Base:** `https://cortex-api-tds7av26va-uc.a.run.app`  
**Install id:** `shift-00204-smoke-20260618091535` (fresh)  
**Auth:** extension public key + `X-Hauska-Install-Id` (profile); `SERVICE_API_KEY` (digest steward path)

| Check | Result |
|---|---|
| `GET /api/brokerage/v1/profile` | **200** `application/json` — `buyBox`, `kept: 0`, `passed: 0` (not SPA HTML) |
| `POST /api/brokerage/v1/profile/verdict-action` `{action:"keep", parcel_id, address}` | **200** `{ ok: true, kept: 1, passed: 0 }` |
| `GET /api/brokerage/v1/profile` (after keep) | **200** `kept: 1` — increment confirmed |
| `GET /api/brokerage/v1/gtm/digest?windowDays=7` | **200** — `investorFunnel.funnel` + `investorFunnel.upgrades` present |

**Smoke verdict:** PASS

---

## Operator notes

- Stripe test price minted separately (`price_1Tjg4SFjAepSMTX7pJ5GLYBf`); not yet in Cloud Run `--set-secrets`.
- Central TX corridor deepen batch was in flight separately from this shift.
