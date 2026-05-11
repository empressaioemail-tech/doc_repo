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

> **Audit-method gap (flagged 2026-05-11 session 2).** This audit checked code-references vs Cloud Run env-from-secret bindings. It did NOT enumerate existing Secret Manager secrets independently. As a result, it missed `smartcity-MYGOV_USERNAME` and `smartcity-MYGOV_PASSWORD` already existing in Secret Manager (created 2026-04-04 with v1/v2, no IAM grant, no Cloud Run env-from-secret reference) — partial-migration debris from the 2026-04-cutover that the code-reference check classified as "unbound." Future env-var audits must also run `gcloud secrets list --filter="name~smartcity-"` and reconcile against expected inventory. See [`91_postmortems/2026-05-11_cutover_env_var_silent_drops.md`](../91_postmortems/2026-05-11_cutover_env_var_silent_drops.md) Remediation status (2026-05-11 session 2).

> **Audit-method corrections (flagged 2026-05-11 session 3).**
>
> - **`OPENAI_API_KEY` is NOT bound to Cloud Run** — verified 2026-05-11 via `gcloud run services describe smartcity-api --region=us-central1`. Earlier audit framing (and downstream CURRENT_STATE references) treated `OPENAI_API_KEY` as Active; this was inaccurate. Post-PR #14 (AI_INTEGRATIONS rename, merged but not yet deployed) the code reads canonical `OPENAI_API_KEY` directly, but the secret/binding still does not exist. Either the secret needs creation OR the code paths (`server/replit_integrations/{image,audio}/`) need deletion. Per Nick's clarification, all current AI workloads run on Anthropic; OpenAI image/audio integrations are dead-code from an early migration and deletion is the preferred path (queued for the secrets/db-migration session).
>
> - **OpenAI SDK fallback framing correction.** Both `@anthropic-ai/sdk` and `openai` Node SDKs auto-fall-back to `process.env.<CANONICAL>_API_KEY` when the constructor `apiKey` is undefined. Earlier audit framing claiming "OpenAI has no fallback" (see Oddities section below) was incorrect — `new OpenAI()` with no args reads `process.env.OPENAI_API_KEY` exactly the same way `new Anthropic()` reads `process.env.ANTHROPIC_API_KEY`. The actual reason the OpenAI image/audio integrations are dead is the missing binding, not a missing fallback. Net-effect for dead-code: same (no key → no integration), but the framing matters for future audit dispatches that lean on "SDK behavior" as evidence.
>
> ### Method gaps identified (sessions 2-3)
>
> Three accuracy issues found across two sessions:
> 1. MYGOV partial-migration debris missed (session 2) — code-reference check classified as "unbound" while Secret Manager had v1/v2 from 2026-04-04 with no IAM, no Cloud Run wire.
> 2. `OPENAI_API_KEY` status claimed "Active" (this session) — actually not bound; the claim propagated from this audit runbook through the handoff into CURRENT_STATE references.
> 3. OpenAI SDK fallback framing wrong (this session) — claimed no fallback exists; both Node SDKs auto-fall-back to canonical env-var names.
>
> Corrective steps for future audits:
> - **Enumerate Secret Manager state** via `gcloud secrets list --filter="name~<prefix>"` independently of Cloud Run binding state. Reconcile "exists in Secret Manager" against "wired to Cloud Run" against "referenced in code" as three independent dimensions.
> - **Verify VALUE correctness, not just NAME binding.** `POWERBI_REPORT_ID` was bound but pointed at the wrong GUID for the workspace (this session, separate from the auth this runbook covers — Power BI GUID alignment was the session 3 Power BI fix). A "bound" env var with a stale or wrong value is functionally identical to an unbound one.
> - **Confirm SDK fallback behavior before declaring integrations "dead."** Read the SDK source / docs (or grep node_modules for `process.env`) before concluding that a missing prefixed env var means the integration cannot function. Anthropic + OpenAI Node SDKs both auto-fall-back; pattern likely holds for most modern vendor SDKs.

## In Cloud Run + read by code (working)

### Original 18 (as of 2026-05-11 session 1)

`DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, `VFD_JWT_SECRET`, `CREDENTIAL_ENCRYPTION_KEY`, `POWERBI_CLIENT_ID`, `POWERBI_CLIENT_SECRET`, `POWERBI_TENANT_ID`, `POWERBI_WORKSPACE_ID`, `POWERBI_REPORT_ID`, `SAMSARA_API_TOKEN`, `SAMSARA_WEBHOOK_SECRET`, `FIRSTDUE_API_EMAIL`, `FIRSTDUE_API_PASSWORD`, `OPENGOV_API_KEY`, `GOTO_CLIENT_ID`, `GOTO_CLIENT_SECRET`, `GOTO_ACCOUNT_KEY`, `MYGOV_BASE_URL`.

### Bound 2026-05-11 session 2 (revision `smartcity-api-00085-pvd`)

Moved from "Missing — production-breaking" (13):

`MYGOV_USERNAME`, `MYGOV_PASSWORD`, `RESEND_API_KEY`, `PIPEDRIVE_API_TOKEN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_RESET_PASSWORD`, `BASTROP_BOOTSTRAP_PASSWORD`, `USER_RESET_EMAIL`, `USER_RESET_PASSWORD`, `SPIREON_TOKEN`, `SPIREON_USERNAME`, `SPIREON_PASSWORD`.

Added to audit + bound (5; not previously in audit — flag: confirmed in code via Spireon NSpire/SysDevX/account flow and OpenGov auth path; verify with code grep):

`SPIREON_ACCOUNT_NAME`, `SPIREON_NSPIRE_ID`, `SPIREON_SYSDEVX_ID`, `OPENGOV_EMAIL`, `OPENGOV_BNP_API_KEY` (also moved out of soft-default fallback section below).

## Missing from Cloud Run — production-breaking

Read by code, no default; the feature is dead until added. (Updated 2026-05-11 session 2 — Spireon, MyGov scraper, Resend, Pipedrive, Google OAuth, and Internal bootstrap / admin reset sections all bound; see Working section above.)

### Verkada (entire integration disabled)

- `VERKADA_API_KEY`
- `VERKADA_WEBHOOK_SECRET`

### ESRI / ArcGIS (geocoding, suggest, geoenrichment — VFD coverage maps depend on this too)

- `ARCGIS_CLIENT_ID`
- `ARCGIS_CLIENT_SECRET`
- `ESRI_API_KEY`

### Calendar partner-feed auth (was removed from `.replit` 2026-05-10; W1.A.6 F-7/F-8 rotation deferred)

- `CALENDAR_API_KEY` — tenant feed-key path still works (DB-backed); only the env-keyed partner subscriptions (BeWith, anyone using `?api_key=`) are broken without this.

### OpenGov Transparency (separate from BNP — `/opengov` transparency tables)

- `OPENGOV_TRANSPARENCY_KEY` — Nick couldn't locate value in Replit vault 2026-05-11 session 2; deferred to vendor-portal lookup; `/opengov` transparency tables remain dark until bound.

### VFD portal access codes (6 missing — VFD auth dead for every department)

- `VFD_CODE_BASTROP`
- `VFD_CODE_CEDAR_CREEK`
- `VFD_CODE_ELGIN`
- `VFD_CODE_MCDADE`
- `VFD_CODE_PAIGE`
- `VFD_CODE_RED_ROCK`

## Missing from Cloud Run — soft-default fallback (works without)

Code has a sensible default; not breaking, but worth setting explicitly.

- `APP_URL` → defaults to `https://smartcityos.io` ✓ matches prod
- `EMAIL_FROM` → defaults to `SmartCity OS <noreply@smartcityos.io>`
- `ADMIN_NOTIFICATION_EMAIL` → defaults to `admin@smartcityos.io`
- `FEEDBACK_EMAIL` → defaults to `nick@smartcityos.io`
- `MYGOV_SYNC_CRON` → defaults to `0 * * * *`
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

Same applies to `AI_INTEGRATIONS_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_BASE_URL`: those are read by `server/replit_integrations/{image,audio}/client.ts`. **Correction (2026-05-11 session 3):** earlier text here claimed "no SDK env fallback" — that was wrong. The `openai` Node SDK auto-falls-back to `process.env.OPENAI_API_KEY` exactly like `@anthropic-ai/sdk` does for `ANTHROPIC_API_KEY`. The actual reason the OpenAI image/audio integrations are dead is that `OPENAI_API_KEY` is NOT bound in Cloud Run (verified this session). Post-PR #14 (merged, awaiting deploy) the code reads canonical names directly; binding still missing — slated for `server/replit_integrations/{image,audio}/` deletion in the secrets/db-migration session per Nick's "all current AI workloads run on Anthropic" clarification.

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
