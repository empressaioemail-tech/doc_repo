---
id: cortex_workspace_qa/03_deploy
title: Deploy instructions — cortex-api (legacy-design-tools)
status: active
last_updated: 2026-07-01
applies_to: design-accelerator
---

# Deploy instructions — cortex-api

## How deploys work

Image builds automatically on every push to `main` via GitHub Actions (`build-and-push` workflow). You do NOT push an image manually.

Deploying the image to Cloud Run is a separate, operator-triggered step via `workflow_dispatch`. The canonical sequence is four separate actions, each a `workflow_dispatch` call:

1. `deploy-canary` — deploys new image with `--no-traffic` tag
2. `run-migrations` — applies any pending Drizzle migrations against the Neon DB
3. (smoke probe — manual, see below)
4. `shift-traffic` — routes 100% traffic to the canary revision

## Triggering a deploy (preferred — GitHub Actions form)

Go to: `https://github.com/empressaioemail-tech/legacy-design-tools/actions` → "Cloud Run Deploy (cortex-api)" → Run workflow → select `main` → set `action` input.

Or via `gh` CLI from any terminal:

```powershell
# Step 1 — deploy image as canary (no traffic)
gh workflow run "Cloud Run Deploy (cortex-api)" `
  --repo empressaioemail-tech/legacy-design-tools `
  -f action=deploy-canary

# Step 2 — run pending DB migrations
gh workflow run "Cloud Run Deploy (cortex-api)" `
  --repo empressaioemail-tech/legacy-design-tools `
  -f action=run-migrations

# Step 3 — smoke probe (manual — run these after run-migrations completes)
# Get the canary URL from the deploy-canary output, then:
curl.exe -sI https://<canary-tag>---cortex-api-tds7av26va-uc.a.run.app/api/healthz
# Expected: HTTP/2 200, {"status":"ok"}

# Step 4 — shift 100% traffic to canary
gh workflow run "Cloud Run Deploy (cortex-api)" `
  --repo empressaioemail-tech/legacy-design-tools `
  -f action=shift-traffic
```

Never chain these — each step is a deliberate operator confirmation.

## Current state (2026-07-01)

- Revision at 100% traffic: `cortex-api-00254-tad`
- Production URL: `https://cortex-api-tds7av26va-uc.a.run.app`
- Project: `legacy-design-tools-prod`
- Region: `us-central1`
- Image: `us-central1-docker.pkg.dev/legacy-design-tools-prod/apps/cortex-api:latest`

## Verify after deploy

```powershell
# Health check
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/healthz
# {"status":"ok"}

# Queue still returns rows (verifies DB connectivity + reviewer BFF)
curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/queue | ConvertFrom-Json | Select-Object -First 1

# Check active revision
gcloud run services describe cortex-api --region us-central1 --project legacy-design-tools-prod `
  --format="value(status.traffic[].revisionName,status.traffic[].percent)"
```

## Rollback

```powershell
gh workflow run "Cloud Run Deploy (cortex-api)" `
  --repo empressaioemail-tech/legacy-design-tools `
  -f action=rollback `
  -f rollback_revision=<prior-revision-name>
```

Prior revision is typically the one before the current active one. Check with:

```powershell
gcloud run revisions list --service cortex-api --region us-central1 `
  --project legacy-design-tools-prod --limit 5
```

## Full runbook

For edge cases, migrations details, SHA verification, and the direct `gcloud` form: [`doc_repo/90_runbooks/cloud_run_canary_deploy.md`](../../90_runbooks/cloud_run_canary_deploy.md)
