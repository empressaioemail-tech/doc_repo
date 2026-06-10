---
id: 2026-06-10_cc-agent-M_verkada_esri_credential_bind
title: Dispatch — Verkada + ESRI/ArcGIS credential bind and smoke
date: 2026-06-10
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
kind: dispatch
status: ready
related: [00_current_state, 31a_bastrop_maintenance_sprint, 90_runbooks/smartcity_cloud_run_env_audit_2026-05-11, 90_runbooks/cloud_run_canary_deploy, 20_agent_operating_rules, 01a_atom_conventions]
---

# Verkada + ESRI/ArcGIS credential bind and smoke

> **Self-contained, config-first (no app-code change expected).** Restores two integrations that have been Red since the 2026-05-11 env audit purely because their secrets were never bound. P0-2 cleared 2026-06-10 — operator holds the credentials. Does NOT touch DATABASE_URL / WS-1, CIP/Power BI, or the BeWith calendar feed (separate dispatch). One cc-agent-M clone per run; do not run concurrently with the BeWith dispatch. Maps to 31a P2-1 + P2-2.

You are **cc-agent-M**, single owner of `empressaio_tech_smartcity_os` for this run. Verkada (cameras) and ESRI/ArcGIS (geocoding, suggest, geoenrichment; VFD coverage maps depend on it) are coded but dark because their env vars are unbound in Cloud Run. The operator now has the credentials. Create the secrets, bind them, grant IAM, deploy a new revision, and smoke each integration to green.

## Model (HR-12)

Default: **Grok Build 0.1**. Use **grok-code-fast-1** for narrow speed-only steps. Escalate to Claude only on Grok failure after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `service:smartcity-api` — city platform contract
- `jurisdiction:bastrop` — tenant_id 2

## Read first (after atoms)

1. [`90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`](../90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md) — the Verkada + ESRI/ArcGIS "Missing from Cloud Run — production-breaking" rows; also the SAMSARA env-name-mismatch warning (a bound secret with the wrong env name is functionally unbound — verify VALUE and NAME, not just presence)
2. [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md) — P2-1, P2-2
3. [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md) — deploy form
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-8, HR-11

## Verified facts (source: 2026-05-11 env audit + 2026-06-10 operator confirmation)

- Operator has the Verkada and ESRI/ArcGIS credentials in hand (P0-2 cleared 2026-06-10).
- Env vars read by code but unbound in Cloud Run:
  - Verkada: `VERKADA_API_KEY`, `VERKADA_WEBHOOK_SECRET`
  - ESRI / ArcGIS: `ARCGIS_CLIENT_ID`, `ARCGIS_CLIENT_SECRET`, `ESRI_API_KEY`
- Secret Manager naming convention on this project is `smartcity-<ENV_NAME>` (e.g. `smartcity-POWERBI_CIP_DATASET_ID`).
- ESRI/ArcGIS uses an OAuth client-id/secret pair plus a separate API key — confirm in code which call path uses which, and whether ArcGIS token minting is per-key (do not assume one token covers all three).

## Recon (FIRST — report before binding)

1. Grep the code for the EXACT env-var names each integration reads (`server/**`). Confirm they match the names above; flag any mismatch (the SAMSARA precedent: secret bound under a different env name = still dead).
2. Confirm the Cloud Run runtime service account and whether it already has `roles/secretmanager.secretAccessor` (existing bound secrets imply yes, but verify — the MyGov debris had secrets with no IAM grant).
3. Confirm no app-code change is required (these are config-only). If any code path needs a change to consume the creds, flag it and stop.

## Scope

**In scope:**

1. **Create secrets** in `smartcity-os-prod` Secret Manager for the five env vars (names per convention above), values from the operator. In Cloud Shell (bash) use `--data-file` or `printf` (NOT a Windows `echo -n | gcloud` pipe — that corrupted a CIP secret to len=2 on 2026-06-08). Echo each new version's length to confirm a sane value landed; never echo the value.
2. **Grant IAM** `roles/secretmanager.secretAccessor` to the Cloud Run runtime SA on each new secret if not already present.
3. **Bind to Cloud Run** via `--update-secrets=VERKADA_API_KEY=smartcity-VERKADA_API_KEY:latest,...` (all five). Note `--update-secrets` can be a no-op if the binding already matches and does not auto-shift traffic — verify the new revision actually carries the env-from-secret bindings (`gcloud run services describe ... --format` on the container env).
4. **Smoke each integration:**
   - Verkada: `/api/verkada/*` returns a device/camera list (not the disabled/empty path). Paste a sanitized sample.
   - ESRI/ArcGIS: a geocode and a geoenrichment call succeed (token mints, 200 with expected shape). Paste sanitized samples.

**Out of scope:**

- DATABASE_URL / WS-1, CIP/Power BI, BeWith calendar (separate dispatch).
- VFD portal codes (P2-8), OpenGov transparency key (P2-3) — different gates.
- Any app-code refactor beyond what recon proves is strictly required to read the creds (flag, do not silently expand).

## Deploy (canary form — smartcity-api)

Binding env-from-secret creates a new revision. Use the canary discipline per [`cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md):

- No rebuild needed if there is no code change: deploy the current `:latest` image with the new `--update-secrets` bindings as a `--no-traffic --tag verkada-esri-20260610` canary, smoke the tag URL, then `update-traffic --to-tags verkada-esri-20260610=100`.
- If recon forced a code change, build via `gcloud builds submit --config cloudbuild-api.yaml` first (NEVER `--source .`); run the build alone before deploying.
- Health endpoint is `/api/health`. Audit existing traffic tags first (the service carries stale 0% tags). Do not deploy concurrently with the BeWith dispatch.

## Acceptance criteria

- Recon answers reported (exact env names confirmed; IAM state; config-only confirmed) before any binding.
- Five secrets created (length-echo / describe per version, never the value).
- IAM secretAccessor granted where missing.
- Cloud Run revision carries all five env-from-secret bindings (verbatim describe of the container env names).
- Verkada device list and ESRI geocode + geoenrichment each smoke green (sanitized samples).
- Deployed via canary; live revision + traffic table pasted; `/api/health` 200 on canary and prod after shift.
- All outputs carry source, value, timestamp; verbatim verification artifacts (HR-8).

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-10_smartcity-os_cc-agent-M_verkada_esri_bind_close.md`. Include atom refs, model used (if not default Grok), recon answers, the secret-version length echoes, IAM grants, the Cloud Run env describe, the two smoke samples, deploy revision + traffic table, and blockers verbatim.

## Workspace ownership

- Clone: `P:\empressaio_tech_smartcity_os`
- Branch: `feat/verkada-esri-credential-bind`
- One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3`.
