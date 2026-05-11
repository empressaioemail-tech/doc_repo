---
id: 2026-05-11_cutover_env_var_silent_drops
title: 2026-05-03 Replit → Cloud Run cutover dropped 30+ env vars; discovered 2026-05-11
date: 2026-05-11
status: active
applies_to: smartcity-os
related: [91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin, 90_runbooks/cloud_run_canary_deploy, 90_runbooks/smartcity_cloud_run_env_audit_2026-05-11, 30a_smartcity_stabilization_sprint]
---

# 2026-05-03 cutover dropped 30+ env vars; discovered 2026-05-11

## Summary

The 2026-05-03 Replit → Cloud Run cutover did not include an env-var completeness audit. As of 2026-05-11, 21 environment variables are bound on the Cloud Run smartcity-api service; the smartcity-os codebase references ~50+ `process.env.*` names. Most missing vars are latent (broken-on-invocation, not actively erroring), which is why the gap remained unnoticed for eight days.

The gap surfaced during post-deploy verification of W1.A.8 — the Police dashboard `/api/spireon/vehicles` endpoint returned an empty fleet and `/api/spireon/health` returned `{"connected":false,"status":"not_configured"}`, prompting a full audit. The shipped A.6 + A.8 code paths themselves run cleanly without the missing env vars; they correctly return empty data with `"source":"none"` (the A.8 F-4 "no LKG mask on creds-absent" guard is observably working as designed). The user-visible value of A.8 (police cars on the live map) is gated on Spireon credentials being bound; the user-visible value of A.6 is partially gated on `CALENDAR_API_KEY` for env-keyed partner subscriptions.

## Discovery sequence

1. **2026-05-11 ~12:00 UTC** — Production deploy of A.6 + A.8 batched on Cloud Run revision `smartcity-api-00084-vhr` (image digest `sha256:a53cd036...`). Canonical sequence; traffic verified 100% on LATEST. Deploy itself clean.
2. **2026-05-11 ~13:00 UTC** — Post-deploy spot-check of `smartcityos.io/emergency-response?tab=police`. Integration Status panel shows "Vehicle GPS (Spireon): Disconnected — 0 assets tracked via NSpire API." Fleet map empty, all unit counts zero.
3. **2026-05-11 ~13:15 UTC** — Initial diagnosis: token rotation pending (per prior handoff's "SPIREON_TOKEN UUID is the urgent vendor rotation" framing). Diagnostic: `gcloud run services logs read smartcity-api --region us-central1 --limit 100 | grep -i spireon`.
4. **Diagnostic output** showed `/api/spireon/health` returning `{"connected":false,"status":"not_configured"}` — not a 401/403, not a network error, not a parse failure. The service is short-circuiting at config check; no Spireon API call is being attempted.
5. **Diagnosis correction**: Spireon credentials are not bound to Cloud Run env at all. Downstream of vendor coordination — there is nothing to rotate against.
6. **Audit pivot**: cross-reference `gcloud run services describe smartcity-api` env binding list against smartcity-os codebase `process.env.*` references. smartcity-os repo agent produced full inventory captured in `90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`.

## Inventory

Full inventory in `90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`. Bottom-line bucket counts:

- **21 vars currently bound and working** — high-traffic integrations that migrated cleanly (DATABASE_URL, POWERBI_*, SAMSARA_*, FIRSTDUE_*, OPENGOV_API_KEY, GOTO_*, MYGOV_BASE_URL, etc.)
- **13 missing — rotation-pending** (vendor coordination required for fresh values): Spireon×3, Verkada×2, ESRI/ArcGIS×3, Calendar API key×1, VFD codes×6
- **11 missing — silent-drop** (existing values can be re-bound now): MyGov×2, Resend×1, Pipedrive×1, Google OAuth×2, OpenGov Transparency×1, admin/bootstrap×4
- **12 soft-default fallbacks** (work without binding, worth setting explicitly later)
- **Oddities** — Anthropic SDK fallback masks code-vs-config mismatch; OpenAI image/audio dead-on-invocation (no SDK fallback); Samsara env-name ↔ secret-name mismatch; two non-secrets stored in Secret Manager. Full details in the audit doc.

## Root cause

The 2026-05-03 Replit → Cloud Run cutover migrated the runtime platform but did not include an env-var completeness audit. The bound set in Cloud Run reflects a partial migration: high-traffic integrations (DATABASE_URL, POWERBI_*, SAMSARA_*, FIRSTDUE_*, OPENGOV_API_KEY, GOTO_*) were carried over; lower-traffic and "we'll deal with that later" integrations were not. Fire 2 cleanup on 2026-05-10 removed Spireon/Calendar credentials from `.replit` pending vendor rotation, completing the picture for those — but the broader silent-drop bucket existed before Fire 2 and was simply never noticed.

The class of failure ("integration that we're not actively using daily, silently disabled") is hard to detect without active audit. Each affected integration's "broken" signal is a 200-empty-data response or a never-fired code path — there is no exception log, no 5xx spike, no obvious dashboard signal.

## Lessons

- **Cutover env-var completeness is not free.** Future infra cutovers must include an explicit env-var binding audit step before declaring the cutover complete. Source environment binding snapshot → destination environment binding snapshot → code-reference inventory → three-way diff → remediation.
- **Confirmed silence is the failure mode.** Absence of error logs about a given env var is not evidence the var is bound. The only reliable signal is `process.env.FOO` returning a non-empty string at runtime AND the dependent integration's health endpoint reporting success. Build that signal into integration health checks.
- **SDK fallbacks mask code-vs-config drift.** The Anthropic SDK's `ANTHROPIC_API_KEY` env fallback saved us from a silent break, but only because code happened to attempt the call. Code-vs-config name mismatches should be flagged actively (e.g., a startup health check that asserts each `process.env.X` referenced in code has a non-empty value, with an allowlist for known-defaulted ones).
- **Plaintext env vars in `.replit [userenv.shared]` are a special hazard.** Twenty-plus vars lived only in that block. Once `.replit` was retired, those values had no other source. Pattern: any platform-specific config file should be audited for "only-here" values during retirement.

## Remediation

Two-track work, both P1 next session:

- **Track A — Silent-drop re-bind.** 11 vars not awaiting vendor rotation. Source values from old Replit environment (if still accessible) or vendor portals (per var). Bind in GCP Secret Manager with `smartcity-` prefix convention. Update Cloud Run service spec env-from-secret references. New revision spawns; verify integration health endpoints where present.
- **Track B — Rotation-pending re-bind.** 13 vars awaiting vendor coordination via Monday Bastrop message. Bind as fresh values arrive. Verify integration health post-bind. Sequence: Spireon → Verkada → ESRI/ArcGIS → Calendar (post F-7/F-8) → VFD codes.

Additional small dispatches:

- **AI_INTEGRATIONS_* code rename.** Update `server/lib/anthropic.ts` and `server/replit_integrations/{image,audio}/client.ts` to read bound env names. ~10 LoC.
- **Secret Manager naming normalization.** Fix `SAMSARA_API_TOKEN` ↔ `smartcity-SAMSARA_API_KEY` mismatch. Move `smartcity-NODE_ENV` and `smartcity-MYGOV_BASE_URL` out of Secret Manager into plain env vars. Part of Track A or follow-on hygiene pass.

Forward-looking:

- **`90_runbooks/cutover_env_var_audit.md`** — new runbook (P2, after Track A ships). Forward-looking checklist for future infra cutovers covering the four lessons above. Distinct from this session's `smartcity_cloud_run_env_audit_2026-05-11.md` which is a point-in-time snapshot for this specific cutover.
