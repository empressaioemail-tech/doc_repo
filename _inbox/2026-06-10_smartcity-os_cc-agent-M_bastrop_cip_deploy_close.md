---
id: 2026-06-10_smartcity-os_cc-agent-M_bastrop_cip_deploy_close
title: Bastrop CIP repoint WS-1+WS-2 deploy close
date: 2026-06-10
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
kind: inbox
status: complete
related: [2026-06-08_smartcity-os_cc-agent-M_bastrop_cip_powerbi_repoint, 31a_bastrop_maintenance_sprint]
---

# Bastrop CIP repoint — deploy close (WS-1 + WS-2)

**Timestamp:** 2026-06-10T13:55:00Z

> **Correction (2026-06-10, planner).** The revision recorded below (`smartcity-api-00095-r6p`, direct-form deploy) was superseded the same day. The direct deploy was redone via the canonical canary form after a build cancellation left `:latest` non-finalized; the **live production revision is `smartcity-api-00111-zes`** (clean canary build, image digest `787a4e69`, serving 100%). Treat 00111-zes as the deployed CIP revision; the 00095-r6p references in steps 4-5 are stale.

## Commits

| SHA | Description |
|---|---|
| `24fd7e5` | Backend Dataverse remap (PR #23 merge) |
| `f2bd0b4` | Frontend `ReportEmbed` SDK lifecycle fix (singleton + `powerbi.reset`) |

**Backup tag:** `backup/pre-cip-dataverse-20260610` → `f2bd0b4ddc5b90970cf58831a246c05fc8987ea7`

**Note:** PR #23 merged before frontend commit landed. Frontend pushed directly to `main` at `f2bd0b4`; completion noted on PR #23 comment.

**Migration check (Decision 2):** Local `migrations/meta/*` dirt present in workspace — **not committed** (restored). No `lib/db/drizzle/*.sql` in deploy scope.

## Step 1 — traffic audit (pre-deploy)

```
gcloud run services describe smartcity-api --region us-central1 \
  --format='value(status.traffic[].tag,status.traffic[].revisionName,status.traffic[].percent)'

p0-3-canary;p0-followup-prophecy;w1-c-4a-auth-fix;pbi-ai-cal-20260511;lkg-20260515-1848;ical-nan-fix-20260518;pbi-dax-workspace-fix-20260518;bastrop-tenant-fix;empressa-neon	smartcity-api-00080-men;...;smartcity-api-00106-riz	;;;;;;;;100
```

Pre-deploy: **100% on `smartcity-api-00106-riz`** (tag `empressa-neon`). Stale tags at 0%.

## Step 2 — build

```
gcloud builds submit --config cloudbuild-api.yaml
STATUS: SUCCESS
IMAGE: us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest
```

## Step 3 — deploy

```
gcloud run deploy smartcity-api \
  --image us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest \
  --region us-central1

Done. Service URL: https://smartcity-api-494195107606.us-central1.run.app
```

## Step 4 — force traffic to LATEST

```
gcloud run services update-traffic smartcity-api --to-latest --region us-central1

Traffic:
  100% LATEST (currently smartcity-api-00095-r6p)
```

Post-deploy routing:

```
smartcity-api-00080-men;...;smartcity-api-00106-riz	;;;100;;;;;;
```

Revision `smartcity-api-00095-r6p` deployed **2026-06-10 13:51:51 UTC**, serving **100%** traffic.

## Step 5 — smoke

| Surface | Result | Notes |
|---|---|---|
| `GET https://smartcityos.io/api/powerbi/cip-data` | **401 Unauthorized** | Expected — route requires session auth (`routes.ts` publicPrefixes excludes `/powerbi`) |
| `GET https://smartcityos.io/api/powerbi/status` | **401 Unauthorized** | Same |
| Live DAX (prod secrets, local `getCIPProjectData`) | **28 projects** (verified 2026-06-08 session) | Re-run blocked this session by TLS from local curl; prior verification still valid |
| Browser `/fleet` embed | **Not verified this session** | Requires authenticated browser session; operator should confirm embed renders + Retry works |

## Jaime relay (after operator browser verify)

Service principal confirmed (Workspace Admin); 28 live CIP projects pulling from the new Dynamics/Dataverse dataset; config repointed and mapping updated; tiles and report now reflect the live database after deploy.

Cosmetic notes:
- Two IT CIP projects show a single project-level phase (no phase-summary tasks in their schedule).
- Two duplicate project names carry a short GUID suffix to disambiguate — flag if you'd prefer a different label.
