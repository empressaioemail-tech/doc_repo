---
id: smartcity_cloud_run_env_audit_2026-05-11
title: smartcity-api Cloud Run env-var audit (2026-05-11)
status: active
last_updated: 2026-05-11
applies_to: smartcity-os
related: [30_smartcity_os, 30a_smartcity_stabilization_sprint, 90_runbooks/cloud_run_canary_deploy, 91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin]
---

# smartcity-api Cloud Run env-var audit (2026-05-11)

Point-in-time enumeration of Cloud Run env config vs what the code actually reads, produced during the 2026-05-11 A.6 + A.8 batched-deploy planning session. Captures the gap between "secrets/env present on the service" and "code paths that have data to operate on" — the A.6/A.8 PRs ship clean against this state; the listed gaps are pre-existing and not caused by the batch.

## In Cloud Run + read by code (working) — 18 env vars

`DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, `VFD_JWT_SECRET`, `CREDENTIAL_ENCRYPTION_KEY`, `POWERBI_CLIENT_ID`, `POWERBI_CLIENT_SECRET`, `POWERBI_TENANT_ID`, `POWERBI_WORKSPACE_ID`, `POWERBI_REPORT_ID`, `SAMSARA_API_TOKEN`, `SAMSARA_WEBHOOK_SECRET`, `FIRSTDUE_API_EMAIL`, `FIRSTDUE_API_PASSWORD`, `OPENGOV_API_KEY`, `GOTO_CLIENT_ID`, `GOTO_CLIENT_SECRET`, `GOTO_ACCOUNT_KEY`, `MYGOV_BASE_URL`.

## Missing from Cloud Run — production-breaking

Read by code, no default; the feature is dead until added.

### Spireon (entire integration disabled)

- `SPIREON_TOKEN` (or alias `SPIREON_APP_TOKEN`)
- `SPIREON_USERNAME` — W1.A.8.b vendor coordination pending; was removed from `.replit`
- `SPIREON_PASSWORD`

### Verkada (entire integration disabled)

- `VERKADA_API_KEY`
- `VERKADA_WEBHOOK_SECRET`

### ESRI / ArcGIS (geocoding, suggest, geoenrichment — VFD coverage maps depend on this too)

- `ARCGIS_CLIENT_ID`
- `ARCGIS_CLIENT_SECRET`
- `ESRI_API_KEY`

### MyGov scraper (auth credentials — cron sync silently no-ops without these)

- `MYGOV_USERNAME`
- `MYGOV_PASSWORD`

### Calendar partner-feed auth (was removed from `.replit` 2026-05-10; W1.A.6 F-7/F-8 rotation deferred)

- `CALENDAR_API_KEY` — tenant feed-key path still works (DB-backed); only the env-keyed partner subscriptions (BeWith, anyone using `?api_key=`) are broken without this.

### Email outbound (transactional emails — team invites, password resets, support tickets, feedback notifications)

- `RESEND_API_KEY`

### Pipedrive (CRM sync)

- `PIPEDRIVE_API_TOKEN`

### Google OAuth (login button broken)

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### OpenGov Transparency (separate from BNP — `/opengov` transparency tables)

- `OPENGOV_TRANSPARENCY_KEY`

### VFD portal access codes (6 missing — VFD auth dead for every department)

- `VFD_CODE_BASTROP`
- `VFD_CODE_CEDAR_CREEK`
- `VFD_CODE_ELGIN`
- `VFD_CODE_MCDADE`
- `VFD_CODE_PAIGE`
- `VFD_CODE_RED_ROCK`

### Internal bootstrap / admin reset (was in `.replit` plaintext)

- `ADMIN_RESET_PASSWORD`
- `BASTROP_BOOTSTRAP_PASSWORD`
- `USER_RESET_EMAIL`
- `USER_RESET_PASSWORD`

## Missing from Cloud Run — soft-default fallback (works without)

Code has a sensible default; not breaking, but worth setting explicitly.

- `APP_URL` → defaults to `https://smartcityos.io` ✓ matches prod
- `EMAIL_FROM` → defaults to `SmartCity OS <noreply@smartcityos.io>`
- `ADMIN_NOTIFICATION_EMAIL` → defaults to `admin@smartcityos.io`
- `FEEDBACK_EMAIL` → defaults to `nick@smartcityos.io`
- `MYGOV_SYNC_CRON` → defaults to `0 * * * *`
- `OPENGOV_BNP_API_KEY` → falls back to `OPENGOV_API_KEY` ✓
- `OPENGOV_AUTH_SCHEME` → defaults to `Token`
- `POWERBI_CIP_DATASET_ID` → hard-coded fallback at `powerbi.ts:182`
- `CIP_COMPLETION_MEASURE` → unset; W1.A.7 RC-5 says this is the highest-leverage missing config for the OS-recompute path (moot under Option B once Phase 1 ships)
- `CIP_DEBUG` → defaults off
- `SMART_CONTRACT_ADDRESS` → defaults to zero-address (placeholder)

## Oddities worth flagging

### Anthropic key mismatch (works by accident)

Cloud Run sets `ANTHROPIC_API_KEY`. Code at `server/lib/anthropic.ts:5-6` reads `AI_INTEGRATIONS_ANTHROPIC_API_KEY` and `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` (the Replit-AI-Integrations names). Both are undefined in Cloud Run → `apiKey: undefined`, `baseURL: undefined`. The Anthropic SDK constructor falls back to `process.env.ANTHROPIC_API_KEY` when `apiKey` is undefined, so it works — but the code's intent doesn't match the Cloud Run config. Either:

- Fix the code to read `ANTHROPIC_API_KEY` directly (matches the Cloud Run reality, drops the dead Replit-era prefix), OR
- Add `AI_INTEGRATIONS_ANTHROPIC_API_KEY` to Cloud Run and rename the secret.

Same applies to `AI_INTEGRATIONS_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_BASE_URL` if any OpenAI-powered feature is in production use — those are read by `server/replit_integrations/{image,audio}/client.ts` and have no SDK env fallback, so any image/audio integration is dead unless never reached.

### `smartcity-SAMSARA_API_KEY` → `SAMSARA_API_TOKEN` env-name mismatch

Secret Manager secret is named `smartcity-SAMSARA_API_KEY` but it's bound to env var `SAMSARA_API_TOKEN`. Functionally fine (Cloud Run is just providing the secret's value under the bound env name), just lexically confusing for anyone auditing.

### `smartcity-NODE_ENV` and `smartcity-MYGOV_BASE_URL` stored as Secret Manager secrets

Neither is a secret. Works, but inflates Secret Manager access logs / IAM scope unnecessarily. Cosmetic.

### `CACHE_BUST` set in Cloud Run, read by no code

Pure deploy-time revision-rotation marker. Harmless. Likely set so changing the value forces a new revision when nothing else changed.

## Quick triage — A.6 + A.8 deploy specifically

The actually-load-bearing gaps for the A.6 + A.8 surface:

- **A.8 (Spireon batch)** needs `SPIREON_TOKEN`, `SPIREON_USERNAME`, `SPIREON_PASSWORD`. Without these, every Spireon route returns the "credentials not configured" 200-empty path, including the new F-3 `include_inactive` and F-4 LKG paths — the code paths work, they just have no data to operate on. The F-2 `mapDepartment` fix is unaffected (pure-function, no env dependency).
- **A.6 (Calendar batch)** needs `CALENDAR_API_KEY` if any external partner subscriptions (BeWith, etc.) are expected to authenticate via env-keyed `?api_key=`. The F-1 public endpoint, F-3 `parseDate`, F-4 VTIMEZONE, F-5 Municode timeout, and F-6 boot probe all work without any env additions — they're observable on the deployed revision without the API key.

**Net:** the A.6 + A.8 batch ships cleanly without env changes (new code paths run with no config). The missing Spireon/Verkada/ArcGIS/etc. env vars are a separate, pre-existing gap that the cutover left in place — they were broken before A.6/A.8 and will still be broken after.
