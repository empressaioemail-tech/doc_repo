---
id: cloud_run_canary_deploy
title: Cloud Run canary deploy runbook
status: active
last_updated: 2026-05-22
applies_to: portfolio
related: [10_ground_truth, 12_migration_sprint, 20_agent_operating_rules, 91_postmortems/2026-05-05_track_b_deploy_saga]
---

# Cloud Run canary deploy runbook

> **Operational runbook.** Use this for any Cloud Run service deploy
> in the portfolio: SmartCity OS revisions, the Phase 1A cutover for
> legacy-design-tools, future product Cloud Run services. The pattern
> is build â canary at 0% traffic â **run-migrations** â smoke probe
> â shift traffic â backup tag â observation.
>
> **Why canary at 0% traffic first:** the Track B saga
> ([`91_postmortems/2026-05-05_track_b_deploy_saga.md`](../91_postmortems/2026-05-05_track_b_deploy_saga.md))
> taught that "deploy succeeded" doesn't mean "feature live." A
> 0%-traffic canary lets you probe the new revision's behavior
> against its real URL before any production traffic touches it.
> The smoke probe is part of the deploy, not a separate step.

## When this applies

Any deploy to a Cloud Run service in `smartcity-os-prod` (or future
GCP projects) where:

- New code is being shipped
- New environment variables / secrets are being introduced
- A revision should be verified before traffic shifts

This runbook does NOT cover:

- Initial Cloud Run service provisioning (covered in
  [`12_migration_sprint.md`](../12_migration_sprint.md) Phase 1A
  for legacy-design-tools)
- GCP project / IAM / Artifact Registry setup
- Custom domain mappings (one-time per service)

## Prerequisites

- Cloud Shell access (preferred) or local `gcloud` authenticated
  against the right project
- The merge SHA you intend to deploy is on origin/main
- A backup tag is created on origin BEFORE the deploy (per HR-1
  GitHub-as-truth and the agent operating rules)

```bash
# Backup tag at the SHA before this deploy lands
git tag backup/pre-<task-name>-$(date +%Y%m%d) <merged-sha>
git push origin backup/pre-<task-name>-$(date +%Y%m%d)
```

## Deploy sequence

Substitute `$SERVICE_NAME` (e.g. `cortex-api`), `$PROJECT_ID` (e.g. `legacy-design-tools-prod`), `$REGION` (e.g. `us-central1`), `$IMAGE_PATH` (the Artifact Registry path), and `$CANARY_TAG` (a short identifier for this deploy, e.g. `w1-c-4a-auth-fix`).

For `legacy-design-tools` / `cortex-api`, every step in this sequence is a separate `workflow_dispatch` against `.github/workflows/cloud-run-deploy.yml`'s `action` input â no local `gcloud` required. See `docs/deploy.md` (in the legacy-design-tools repo) for the workflow form. The sections below give the equivalent direct-`gcloud` form for use against other services or when the workflow is unavailable.

**Canonical sequence**: deploy-canary â **run-migrations** â smoke probe â shift traffic â backup tag â observation. Each is a deliberate operator-triggered step; never chain them. `run-migrations` is mandatory between deploy-canary and the smoke probe â it applies any pending `lib/db/drizzle/*.sql` files so the canary's smoke probe hits the right schema.

### Step 1 â Set defaults

```bash
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION
```

### Step 2 â Build new image from origin/main

For services using Cloud Build with a config file:

```bash
gcloud builds submit --config $BUILD_CONFIG_FILE
# e.g. cloudbuild-api.yaml for smartcity-api
```

For services using `gcloud run deploy --source` (Cloud Run buildpacks):

```bash
# Build implicitly happens during `gcloud run deploy` in step 3
# No separate build step
```

For services using GitHub Actions to build and push to Artifact
Registry (Phase 1A pattern for legacy-design-tools):

```bash
# Image is already in Artifact Registry by the time you reach
# step 3; no local build needed
```

### Step 3 â Deploy as canary tag with NO traffic

```bash
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_PATH \
  --tag $CANARY_TAG \
  --no-traffic
```

The `--no-traffic` flag is the load-bearing piece. It creates a new
revision and tags it without shifting any traffic to it. The
revision becomes addressable via a tag-prefixed URL.

### Step 4 â Run pending DB migrations (mandatory)

The cortex-api deploy ships code; migrations are a separate deliberate step so a schema-touching PR cannot drift the prod DB behind the code it deploys (the failure mode the 2026-05-22 P0-1 IFC 500 surfaced).

Workflow form (preferred â operator-runnable with no local `gcloud`):

```bash
gh workflow run "Cloud Run Deploy (cortex-api)" \
  -f action=run-migrations
# First execution against a given DB also passes `-f bootstrap=true`
# (one-time, seeds _schema_migrations with every existing file marked
# applied â use when the DB is already at the head).
```

The job authenticates via the same Workload Identity Federation the deploy job uses, fetches `DEPLOYMENT_DATABASE_URL` from Secret Manager, echoes the pending list, applies each pending file in its own transaction, and echoes the applied state on success. A failure rolls the offending file and fails the job with the file name â production is left at the prior schema, not half-migrated.

Direct form (for services not yet on the workflow, or when the workflow is unavailable): per [`neon_schema_migration_via_cloud_shell.md`](neon_schema_migration_via_cloud_shell.md), applying the pending SQL files by hand via `psql -f` in Cloud Shell. The runner script is `lib/db/scripts/migrate-prod.mjs` in `empressaioemail-tech/legacy-design-tools`.

If `run-migrations` reports zero pending, the canary code does not require new schema and the step is a no-op â continue to smoke probe. If migrations apply, re-run the smoke probe **against the canary URL** (the next step) so the smoke verifies the post-migration behaviour.

### Step 5 â Get the canary URL

```bash
CANARY_URL=$(gcloud run services describe $SERVICE_NAME \
  --format='value(status.traffic[?tag=='"$CANARY_TAG"'].url)')
echo "Canary: $CANARY_URL"
```

The URL has the form
`https://$CANARY_TAG---$SERVICE_NAME-<hash>-<region>.a.run.app`. It
routes only to the canary revision; production traffic continues
to flow to the prior revision.

### Step 6 â Smoke probe against canary URL

The smoke probe validates that the new revision's behavior matches
expectations. Per HR-3 (deploy success != feature live), this is
non-negotiable.

What to probe depends on what changed in this deploy:

```bash
# Generic health check
curl -sI "$CANARY_URL/api/healthz"

# Auth boundary check (relevant for auth-related changes)
curl -sI "$CANARY_URL/api/healthz" -H "x-internal-ai: smartcity-ctx"

# Schema-dependent endpoint (relevant if schema changed in this deploy)
curl -sI "$CANARY_URL/api/<endpoint-touching-new-schema>"
```

Expected response shapes are deploy-specific. For each probe,
**verify the response shape, not just the HTTP status code.** A 401
returning HTML "Cannot GET" is a different outcome than a 401
returning `{"error":"unauthorized"}`.

If smoke probes return unexpected results, **stop here.** Do not
shift traffic. Investigate against the canary URL â the prior
revision is still serving production unaffected.

### Step 7 â Shift 100% traffic to the canary tag

Once smoke probes pass:

```bash
gcloud run services update-traffic $SERVICE_NAME \
  --to-tags $CANARY_TAG=100
```

This atomic update routes 100% of traffic to the canary revision.
The prior revision is preserved and stays addressable for fast
rollback.

Workflow form for legacy-design-tools / cortex-api (preferred):

```bash
gh workflow run "Cloud Run Deploy (cortex-api)" -f action=shift-traffic
```

The job runs the same `gcloud run services update-traffic --to-tags` command shown above, plus a `/api/healthz` smoke probe on the production URL that fails the job if the post-shift response is not 200 (HR-3 enforcement at the workflow layer).

### Step 8 â Verify production URL

```bash
# Verify against the production custom domain (or service URL)
curl -sI https://$PRODUCTION_DOMAIN/api/healthz
# Expected: same response as the canary smoke probe in step 6
```

If the production URL response differs from the canary URL response
post-traffic-shift, **roll back immediately** (see Rollback below).

### Step 9 â Tag the deployed revision in git

```bash
DEPLOYED_REV=$(gcloud run revisions list --service $SERVICE_NAME \
  --limit 1 --format='value(metadata.name)')
echo "Deployed: $DEPLOYED_REV"

git tag backup/post-<task-name>-${DEPLOYED_REV} <merged-sha>
git push origin --tags
```

This creates a backup tag at the merged SHA with the revision name
embedded â useful for rollback context and audit trail.

### Step 10 â Observation window

For deploys that change behavior visible to customers (auth, data,
features), observe for ~1 hour minimum before declaring done. For
deploys that change behavior visible only to internal callers, the
observation window can be shorter (smoke probes pass + 5 min sanity
check).

What to monitor:

- Cloud Run revision metrics (requests, errors, latency)
- Application-level error rates
- Customer-facing surfaces (Bastrop dashboard, architect-side UI)
  if applicable

## Rollback

Two paths depending on what failed.

### Smoke probe failure (canary at 0% traffic)

The canary revision is exposed only via the tag URL. Production
traffic is unaffected.

```bash
# Optional: delete the failed canary revision (keeps things tidy)
gcloud run revisions delete $CANARY_REVISION_NAME

# Re-attempt with fix; no production rollback needed
```

### Failure detected after traffic shift

Workflow form for legacy-design-tools / cortex-api (preferred â operator-runnable with no local `gcloud`):

```bash
gh workflow run "Cloud Run Deploy (cortex-api)" \
  -f action=rollback \
  -f rollback_revision=<previous-revision>
```

Direct form (other services, or when the workflow is unavailable):

If the production URL is showing problems post-shift, revert
traffic to the prior revision:

```bash
# Find the prior revision (was at 100% before this deploy)
gcloud run revisions list --service $SERVICE_NAME --limit 5

# Shift 100% traffic back
gcloud run services update-traffic $SERVICE_NAME \
  --to-revisions <prior-revision-name>=100
```

Cloud Run's traffic update is atomic and effectively instantaneous;
rollback is fast. Investigate the failed revision after rollback,
not during.

## Discipline cross-references

This runbook enforces several rules from
[`20_agent_operating_rules.md`](../20_agent_operating_rules.md):

- **HR-3** (deploy success != feature live) â smoke probe is part
  of the deploy, not a separate step
- **HR-7** (three failures in 4 hours = stop) â if a deploy attempt
  needs to be re-tried for distinct reasons multiple times, halt
  and assess
- **HR-8** (verbatim verification artifacts) â every step's output
  pasted verbatim in the deploy chat record

## Stop conditions

Halt and assess if any of these occur:

- Cloud Build fails in step 2
- `gcloud run deploy` returns errors that don't resolve on retry
- Canary URL doesn't respond at all (revision didn't boot)
- Smoke probe in step 5 returns unexpected response shape
- Step 8 production URL response differs from canary post-shift
- Three deploy attempts in 4 hours fail for distinct reasons (HR-7)

## Examples

### Example 1 â Auth fix on smartcity-api (W1.C.4a pattern)

```bash
# Setup
gcloud config set project smartcity-os-prod
gcloud config set run/region us-central1

# Build
gcloud builds submit --config cloudbuild-api.yaml

# Canary deploy
gcloud run deploy smartcity-api \
  --image us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest \
  --tag w1-c-4a-auth-fix \
  --no-traffic

# Get canary URL
CANARY_URL=$(gcloud run services describe smartcity-api \
  --format='value(status.traffic[?tag=='w1-c-4a-auth-fix'].url)')

# Smoke probes (both should now return 401 with JSON shape)
curl -sI "$CANARY_URL/api/healthz" -H "x-internal-ai: smartcity-ctx"
curl -sI "$CANARY_URL/api/healthz"

# Traffic shift
gcloud run services update-traffic smartcity-api \
  --to-tags w1-c-4a-auth-fix=100

# Production verify
curl -sI https://smartcityos.io/api/healthz -H "x-internal-ai: smartcity-ctx"
# Expected: HTTP/2 401 â Fire 1 closed
```

### Example 2 â Phase 1A initial Cloud Run deploy (legacy-design-tools)

Phase 1A introduces a NEW service. The pattern is the same with
three adjustments:

1. The prior-revision rollback path doesn't exist for the very
   first deploy. Rollback at this stage means reverting to the
   Replit deploy (per
   [`90_runbooks/replit_deploy.md`](replit_deploy.md)), not to a
   prior Cloud Run revision.
2. The custom domain mapping is a one-time setup. The first deploy
   may go to the auto-generated `*.a.run.app` URL until the
   domain mapping is configured.
3. **`--no-traffic --tag=<TAG>` does NOT result in 0% traffic to
   the canary on first deploy.** Cloud Run auto-routes 100% to
   LATEST and applies the tag because there's no prior revision to
   claim the remaining traffic. The describe output will show
   `{percent: 100, latestRevision: true, tag: <TAG>}` as a single
   traffic entry. The "gradual ramp" pattern (10/50/100) in step 6
   applies to service updates with a known-good baseline; on first
   deploy: do recon, smoke probe at the tag URL, confirm bare
   service URL routes equivalently, tag the deployed source SHA,
   observe. Skip the explicit traffic-shift command â it would be
   a no-op.

See [`12_migration_sprint.md`](../12_migration_sprint.md) Phase 1A
for the full sequence including service provisioning prerequisites.

## Verifying deployed source SHA via Artifact Registry

When tagging git for backup-pointer purposes, do not assume the
source SHA from external context (orientation reports, planner
memory, prior session summaries â these can drift or refer to a
different repo entirely). Verify the actual source SHA from the
deployed image:

1. Get the running revision's image digest:
   ```bash
   gcloud run revisions describe <REV> --format='value(spec.containers[0].image)'
   ```
2. List image tags on that digest in Artifact Registry, filtered
   by likely SHA fragments:
   ```bash
   gcloud artifacts docker images list <REGION>-docker.pkg.dev/<PROJECT>/<REPO>/<IMAGE> \
     --include-tags --filter='tags:<short-sha-fragment>'
   ```
   Or describe the digest directly:
   ```bash
   gcloud artifacts docker images describe \
     <REGION>-docker.pkg.dev/<PROJECT>/<REPO>/<IMAGE>@<digest> \
     --format='value(image_summary.tags)'
   ```
3. The source-SHA tag (typically the full or short git SHA applied
   at build time by the GHA workflow) is the verified source. Use
   it for the git tag.

This pattern caught a SHA conflation in the 2026-05-06 PM session
where the dispatch prompt hardcoded a SHA from an unrelated repo
(`doc_repo` HEAD) instead of the `legacy-design-tools` deployed
source SHA.

## Revision history

- **2026-05-06 (origin):** runbook drafted from the W1.C.4a deploy
  sequence in the 2026-05-05 planning conversation. Generalized for
  reuse across portfolio Cloud Run deploys (Phase 1A, Phase 2
  cutover, ongoing SmartCity OS revisions, future products).
- **2026-05-22 (run-migrations as a mandatory canary step):** Inserted Step 4 â Run pending DB migrations â between deploy-canary and the smoke probe; renumbered steps 4-9 to 5-10. Added the `workflow_dispatch action` framing for legacy-design-tools / cortex-api â the new operator-runnable form per `cloud-run-deploy.yml`'s four-job action input shipped in legacy-design-tools PR #81 (Phase 2 of the 2026-05-22 QA build, `lib/db/scripts/migrate-prod.mjs` runner backed by a `_schema_migrations` tracker). Added workflow-form notes to shift-traffic and Rollback. Direct-`gcloud` forms retained for services not on the workflow.

## 2026-05-11 addendum — deploy mechanism + traffic-tag verification

Compound silent failure documented in [`91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md`](../91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md). Two requirements added to the canonical procedure as a result. Env-var state at the time of this deploy captured in [`smartcity_cloud_run_env_audit_2026-05-11.md`](smartcity_cloud_run_env_audit_2026-05-11.md) — pre-existing Spireon/Verkada/ArcGIS/etc. gaps survive the A.6 + A.8 batch.

### Do not use `gcloud run deploy --source .` for smartcity-api

Cloud Native Buildpacks do not auto-detect `Dockerfile.api` (it is a named Dockerfile, not the root `Dockerfile` Buildpacks looks for). Node.js Buildpacks fall back to `npm run build`, which in smartcity-os bundles `server/index-prod.ts` (the Replit production target, stale post 2026-05-03 cutover). The resulting Cloud Run revision runs the wrong server entry point.

Canonical sequence:

```bash
cd ~/smartcity-os
gcloud builds submit --config cloudbuild-api.yaml
gcloud run deploy smartcity-api \
  --image us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest \
  --region us-central1
gcloud run services update-traffic smartcity-api --to-latest --region us-central1
```

The third step is mandatory; see next subsection.

### Verify traffic routing after every deploy

`status.latestReadyRevisionName` does NOT reflect what's serving traffic when traffic tags are pinned. Pinned tags accumulate on smartcity-api with every canary deploy. As of 2026-05-15, five tags exist (`p0-3-canary`, `p0-followup-prophecy`, `w1-c-4a-auth-fix`, `pbi-ai-cal-20260511`, `lkg-20260515-1848`); any pinned tag at non-zero percent will silently strand new deploys via `--to-latest`. Audit with `gcloud run services describe` before every deploy rather than trusting any specific count in this runbook.

Verify with:

```bash
gcloud run services describe smartcity-api --region us-central1 \
  --format='value(status.traffic[].revisionName,status.traffic[].percent)'
```

If the LATEST revision isn't at 100%, route it explicitly:

```bash
gcloud run services update-traffic smartcity-api --to-latest --region us-central1
```

Audit existing tags before relying on `--to-latest`:

```bash
gcloud run services describe smartcity-api --region us-central1 \
  --format='value(status.traffic[].tag,status.traffic[].revisionName,status.traffic[].percent)'
```
