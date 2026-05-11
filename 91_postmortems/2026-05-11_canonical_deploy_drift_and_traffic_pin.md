---
id: 2026-05-11_canonical_deploy_drift_and_traffic_pin
title: Canonical deploy drift + Cloud Run traffic pin — 3hr silent UI staleness
date: 2026-05-11
status: active
applies_to: smartcity-os
related: [30_smartcity_os, 30a_smartcity_stabilization_sprint, 90_runbooks/cloud_run_canary_deploy]
---

# Canonical deploy drift + Cloud Run traffic pin — 3hr silent UI staleness

## Summary

A smartcity-thread planner session intended to deploy WS-2's C.1/C.2/C.3 PRs to Bastrop production took ~3 hours due to two compound silent failures. Each individual failure presented as "deploy succeeded, UI unchanged" — neither logged any error, neither showed up in standard deploy output. Diagnosis required mid-session doc_repo courier to surface canonical procedure and revision-level inspection to expose the traffic pin.

## Timeline (CDT; UTC offset −5)

- **~21:30** — Planner drafted `gcloud run deploy smartcity-api --source . --region us-central1`. Operator ran. Deploy "succeeded." Reported revision `smartcity-api-00084-weg` serving 100% — same revision name appeared in describe output.
- **~21:40** — Operator logged in, reported "no changes are live. spireon is still missing police cars and prophecy looks exactly the same."
- **~21:50** — Planner clarified Spireon/PBI/Calendar fixes were never code changes in WS-2 (forensics only). Prophecy non-visibility remained anomalous.
- **~22:00** — Planner theorized Replit serving stale client. Operator corrected: "the replit split should have been scoped already... and i deployed without replit the other day."
- **~22:15** — Operator confirmed cache test (hard refresh + incognito, multiple URLs) still showed old UI.
- **~22:30** — `package.json` inspection surfaced two build targets (`build` → `server/index-prod.ts` Replit; `build:cloud-run` → `server/index-cloud.ts` Cloud Run). Planner hypothesized Buildpacks chose wrong target.
- **~22:45** — Operator redirected planner from real-time debugging to doc_repo courier ("that's what that is for, to build institutional knowledge"). Recon surfaced canonical procedure in `90_runbooks/cloud_run_canary_deploy.md` (uses `gcloud builds submit --config cloudbuild-api.yaml`) and explicitly mapped documentation gaps: two-target reality undocumented, Buildpacks-vs-cloudbuild-api distinction undocumented, traffic-routing failure mode undocumented, `deploy:check` script stale.
- **~23:10** — Operator pasted `cloudbuild-api.yaml` + `Dockerfile.api` contents. Dockerfile explicitly runs `npm run build:cloud-run` against `server/index-cloud.ts`. Confirmed `--source .` deploy bypassed this entirely.
- **~23:15** — Canonical redeploy: `gcloud builds submit --config cloudbuild-api.yaml` → produced image digest `sha256:a5eed159a70dcb4cd8569978a6647826b9eb5f88e0a370f9ac372a9e9743d6c1`. Then `gcloud run deploy --image …:latest` reported revision `smartcity-api-00084-weg` STILL serving — same revision name as before, despite a new digest having been pushed.
- **~23:25** — `gcloud run revisions list` revealed two new revisions DID exist (`00082-lv5` from the `--source .` deploy, `00083-dss` from the canonical Dockerfile deploy) but neither was serving traffic. The May 10 revision `00084-weg` was still receiving 100% via the `w1-c-4a-auth-fix` traffic tag.
- **~23:30** — `gcloud run services update-traffic smartcity-api --to-latest --region us-central1` routed 100% traffic to `00083-dss`. Prophecy UI surfaced correctly for the first time at `https://smartcityos.io/prophecy`.

## Root causes

### Cause 1 — build-mechanism drift via `--source .`

`gcloud run deploy --source .` triggers Cloud Native Buildpacks. Buildpacks check for a root `Dockerfile`; they do NOT detect named Dockerfiles like `Dockerfile.api`. For Node.js, the buildpack runs `npm run build` (default) — in smartcity-os, that bundles `server/index-prod.ts` (the Replit production target, stale post 2026-05-03 cutover) and produces `dist/index.js` that does not match what `Dockerfile.api` would build.

The canonical Cloud Run deploy path is `gcloud builds submit --config cloudbuild-api.yaml`, which invokes Docker explicitly with `-f Dockerfile.api`. That runs `npm run build:cloud-run` (bundles `server/index-cloud.ts`) and produces the correct artifact. This path is documented in `90_runbooks/cloud_run_canary_deploy.md` (Example 1) — but the runbook did not previously warn against the alternative `--source .` path, and the planner did not consult the runbook before drafting the deploy command.

### Cause 2 — Cloud Run traffic-tag pin

Three traffic tags exist on the smartcity-api service:
- `p0-3-canary` → `smartcity-api-00080-men` (2026-05-03 cutover)
- `p0-followup-prophecy` → `smartcity-api-00082-pog` (2026-05-03 cutover)
- `w1-c-4a-auth-fix` → `smartcity-api-00084-weg` (2026-05-10, prior W1.C.4a auth-middleware work)

Traffic was 100% pinned to `w1-c-4a-auth-fix` from the May 10 W1.C.4a deploy. When new revisions deploy, Cloud Run does NOT automatically route traffic to them when an explicit traffic configuration exists (tag-pinned or revision-pinned). The describe field `status.latestReadyRevisionName` reports `00084-weg` because that's the revision the active traffic configuration points to — even though newer revisions exist, are healthy, and are theoretically eligible to serve.

This makes `gcloud run services describe ... --format='value(status.latestReadyRevisionName)'` misleading as a deploy-verification signal when tags are in play. The reliable check is `status.traffic[].revisionName + status.traffic[].percent`.

## Resolution

Single command resolved the traffic pin (assumes latest ready revision is the desired target):

```bash
gcloud run services update-traffic smartcity-api --to-latest --region us-central1
```

Result: 100% traffic on LATEST (= newest ready revision `smartcity-api-00083-dss`). Other tagged revisions remained in place at 0% — they can still be reached via tag URLs if needed but no longer serve unless tag URLs are hit directly.

## Prevention

1. **Always deploy via `gcloud builds submit --config cloudbuild-api.yaml`** for smartcity-api. Never `gcloud run deploy --source .`. See updated `90_runbooks/cloud_run_canary_deploy.md` 2026-05-11 addendum.

2. **Always verify traffic after deploy** with `gcloud run services describe smartcity-api --region us-central1 --format='value(status.traffic[].revisionName,status.traffic[].percent)'`. Run `update-traffic --to-latest` if needed.

3. **Audit Cloud Run traffic tags periodically.** Three exist on smartcity-api as of 2026-05-11 (P3 hygiene item in `11_roadmap.md`). Stale tags are silent footguns.

4. **Disposition stale `npm run build` script + `deploy:check` script.** Post-2026-05-03 cutover, the Replit target is dead code and `deploy:check`'s "deploy Replit too" warning is misinformation. P3 hygiene item.

5. **Cost.** ~3 hours operator + planner time. Plus the latent risk of "deploys succeeded but production never updated" for any deploys between the `w1-c-4a-auth-fix` tag creation (some time around 2026-05-10 02:22 UTC) and this discovery (2026-05-11 03:30 UTC). Two deploys ran tonight before the pin was found; both were silently stranded.
