---
id: 2026-07-21_deploy_runbook_cortex_and_vercel
title: Deploy runbook — cortex-api (Cloud Run) + property-explorer (Vercel)
status: active
date: 2026-07-21
applies_to: legacy-design-tools (cortex-api), hauska-map (apps/property-explorer)
---

# Deploy runbook — the full stack to a live QA URL

Written 2026-07-21 after a deploy that hit FOUR traps before working. Follow this and the next one is smooth. The golden rule throughout: VERIFY THE LIVE ENDPOINT/URL, never trust "workflow success" or a build summary — every trap below looked like success at one layer while being broken at the next.

## Part A — cortex-api (Cloud Run), the backend

The deploy is a MANUAL workflow_dispatch canary sequence. A push to main ONLY builds+pushes the image; it does NOT deploy (the deploy steps are gated to workflow_dispatch and are SKIPPED on push). This is trap #1: merged + "Cloud Run Deploy" green on push == image built, NOT deployed.

1. Merge to main -> the push-triggered `cloud-run-deploy.yml` run builds+pushes the image. Wait for it to complete (success = image in Artifact Registry, tagged with the FULL 40-char commit SHA + `latest`).
2. Get the image tag: `gcloud artifacts docker images list us-central1-docker.pkg.dev/legacy-design-tools-prod/apps/cortex-api --include-tags --sort-by=~createTime --limit=3`. The tag is the FULL SHA (e.g. `add58b529ef1a...`), NOT the short SHA. Trap #2: passing a short SHA -> "Image not found". Use the full SHA or `latest` (latest == the newest build).
3. deploy-canary (0% traffic, safe): `gh workflow run cloud-run-deploy.yml --repo empressaioemail-tech/legacy-design-tools -f action=deploy-canary -f image_tag=<FULL_SHA_or_latest>`. Wait for completion. Trap #3: the container can BOOT-CRASH here (canary fails). If it does, read the container logs, do NOT retry blindly: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.revision_name=<canary-rev>" --project=legacy-design-tools-prod --limit=25 --format="value(textPayload)"` (grep the app-level error, not just the generic gcloud "failed to listen on 8080"). A known crash class: the SERVER importing a `*Cli.ts` whose `main()` runs on import (the isDirectRun guard is unreliable in the esbuild prod bundle) -> `process.exit(1)` before binding 8080. Fix = extract the shared symbol into a no-main module so the server never imports a CLI entrypoint. Prod is SAFE while this fails: canary is 0% traffic (`--no-traffic`), old revision still serves.
4. VERIFY THE CANARY BEFORE SHIFTING: canary gets a tagged URL `https://canary---cortex-api-tds7av26va-uc.a.run.app`. Hit the real endpoint on it (with `Authorization: Bearer <SERVICE_API_KEY from gcloud secrets>`; the whole `/api/brokerage/v1/*` surface is service-Bearer-gated). Confirm it BOOTS (`/api/health` 200) AND serves the expected data. Only then:
5. shift-traffic to 100%: `gh workflow run cloud-run-deploy.yml -f action=shift-traffic`. Then re-verify on the DEFAULT prod url.
6. Confirm the serving revision advanced: `gcloud run services describe cortex-api --region=us-central1 --format="value(status.traffic[0].revisionName,status.traffic[0].percent)"`.

Migration note: if the deploy needs a new DB migration, it is NOT auto-applied on the canary unless you run `-f action=run-migrations`. Migrations merged != applied to the live Neon. Apply first (or via the run-migrations action) before the code that needs the new schema takes traffic.

## Part B — property-explorer (Vercel), the web app

A pnpm-workspace monorepo with TWO apps (command-center + property-explorer) and ONE root `vercel.json` (which is command-center's). This is the whole difficulty.

Trap #4a: deploying from the app subdir (`apps/property-explorer`) uploads ONLY that subdir (~26 files) -> the workspace build can't resolve -> stuck build.
Trap #4b: deploying from repo ROOT uses the root `vercel.json` = command-center's build command -> BUILDS THE WRONG APP (command-center).

THE FIX (one-time project setup, then deploys just work):
1. Create/link the project: from repo root, `vercel link --yes --project property-explorer`.
2. In the property-explorer PROJECT SETTINGS (Vercel dashboard, General): set **Root Directory = `apps/property-explorer`**. This makes Vercel use the APP's own `apps/property-explorer/vercel.json` (which has `cd ../.. && pnpm install` / `cd ../.. && pnpm --filter property-explorer build`, output `dist`) AND include the workspace. This is what makes it build the RIGHT app with the workspace present. (Operator did this in the dashboard; it's the load-bearing setting.)
3. Turn OFF Deployment Protection (or set to "only production") for the project, else preview URLs 302 -> vercel.com/sso and can't be QA'd without a Vercel login. Trap #4c.
4. Env: set `CORTEX_SERVICE_API_KEY` (pull from `gcloud secrets versions access latest --secret=SERVICE_API_KEY --project=legacy-design-tools-prod`, 64 chars) via `printf "%s" "$KEY" | vercel env add CORTEX_SERVICE_API_KEY production` (printf, no echo, to avoid the trailing-newline the stdin-add otherwise appends). `CORTEX_API_URL` has a working default in the proxy, so it's optional. MCP/retrieval keys only needed for the AI/ask path (stubbed on browse).
5. Deploy: `vercel deploy` (preview) or `vercel deploy --prod`. Confirm the build log shows `property-explorer@0.1.0 build` (NOT command-center) and status Ready.
6. VERIFY THE LIVE URL end-to-end: `curl` the app root (expect HTTP 200 + `<title>Empressa...`), AND the full proxy path `<url>/api/spine/cortex/api/brokerage/v1/place/node/<id>/facets` returns `source:"baked-snapshot"` + real facets + no owner key. The proxy injects the Bearer server-side, so this works without a client key.

## The meta-lesson

Each trap looked like success at the layer above it: the workflow was green (but only built), the build summary said 0% land-use (but the store still had fabrications), the agent said "files don't exist" (but its clone was stale), the deploy said Ready (but built the wrong app / was behind an auth wall). The only reliable signal is hitting the actual live endpoint/URL with the actual data and reading what comes back. Verify at every layer against live state; never promote or hand off on a proxy signal.
