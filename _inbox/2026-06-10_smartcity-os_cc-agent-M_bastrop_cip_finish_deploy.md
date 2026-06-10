---
id: 2026-06-10_smartcity-os_cc-agent-M_bastrop_cip_finish_deploy
date: 2026-06-10
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
branch: fix/bastrop-cip-powerbi-dataverse-repoint
pr: 23
status: dispatched
related: [2026-06-08_smartcity-os_cc-agent-M_bastrop_cip_powerbi_repoint, 31a_bastrop_maintenance_sprint, 90_runbooks/cloud_run_canary_deploy]
---

# Bastrop CIP repoint — finish off (WS-1 deploy + WS-2 embed fix)

Closes out the 2026-06-08 CIP repoint. Backend remap and GCP secrets are done; PR #23 is open. This dispatch resolves the two open questions the agent flagged (frontend fix disposition, canonical deploy sequence) and the one error in the prior handoff.

## Correction to prior handoff

There are not two deploy surfaces. There is **one Cloud Run service**, `smartcity-api`, which serves both the API and the built client (`30_smartcity_os.md`: five products served from the same Cloud Run service, project `smartcity-os-prod`). The backend `powerbi.ts` remap and the `ReportEmbed` frontend fix ship in the **same build artifact** and reach prod in **one deploy**. Do not wait for a second deploy sequence; it does not exist.

## Decision 1 — frontend fix goes on the SAME PR

Commit the `ReportEmbed` lifecycle fix in `client/src/pages/ProjectManagement.tsx` onto the existing branch and push into PR #23. Do not open a second PR. Same incident (Bastrop CIP tiles dark), same artifact, one review, one deploy.

```bash
cd ~/smartcity-os
git checkout fix/bastrop-cip-powerbi-dataverse-repoint
git add client/src/pages/ProjectManagement.tsx
git commit -m "fix(cip): ReportEmbed SDK lifecycle - singleton service + powerbi.reset, fixes 'element already has embedded component'"
git push origin fix/bastrop-cip-powerbi-dataverse-repoint
```

Update the PR description to reflect the combined scope.

## Decision 2 — no DB migration step

Power BI config plus TypeScript only; no `lib/db/drizzle/*.sql` touched. The runbook's mandatory `run-migrations` step is a **no-op here, skip it.** If `git diff` shows any migration file, stop and report to the planner; that contradicts scope.

## Decision 3 — canonical deploy sequence

smartcity-api is not on the `workflow_dispatch` form (that is cortex-api only). Use direct `gcloud` from Cloud Shell (bash). Source: `90_runbooks/cloud_run_canary_deploy.md`, 2026-05-11 smartcity-api addendum. Run after PR #23 merges to `origin/main`.

**Step 0 — backup tag at the merge SHA (HR-1):**

```bash
git tag backup/pre-cip-dataverse-$(date +%Y%m%d) <merge-sha>
git push origin backup/pre-cip-dataverse-$(date +%Y%m%d)
```

**Step 1 — audit traffic tags BEFORE deploy.** Pinned tags at non-zero percent silently strand a `--to-latest` deploy (this has bitten smartcity-api; stale tags accumulate):

```bash
gcloud config set project smartcity-os-prod
gcloud config set run/region us-central1
gcloud run services describe smartcity-api --region us-central1 \
  --format='value(status.traffic[].tag,status.traffic[].revisionName,status.traffic[].percent)'
```

If anything other than LATEST holds non-zero traffic, note it and force `--to-latest` explicitly in Step 4.

**Step 2 — build (do NOT use `--source .`).** Buildpacks miss `Dockerfile.api`, fall back to `npm run build`, and ship the stale Replit entry point. Always build via the config:

```bash
gcloud builds submit --config cloudbuild-api.yaml
```

**Step 3 — deploy from the built image:**

```bash
gcloud run deploy smartcity-api \
  --image us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest \
  --region us-central1
```

**Step 4 — force traffic to LATEST (mandatory):**

```bash
gcloud run services update-traffic smartcity-api --to-latest --region us-central1
```

**Step 5 — verify routing, then smoke both surfaces (HR-3: deploy success != feature live):**

```bash
gcloud run services describe smartcity-api --region us-central1 \
  --format='value(status.traffic[].revisionName,status.traffic[].percent)'
curl -s https://smartcityos.io/api/powerbi/cip-data -H "<the auth header this endpoint expects>" | head
```

Then load `https://smartcityos.io` to /fleet in a browser: confirm the embed renders (no "element already has embedded component" SDK error) and that Retry re-embeds cleanly. Backend smoke expectation: 28 projects, Agnes Street Extension and WWTP #4 present with sane completion.

Paste every command's raw output into the run record (HR-8). Three deploy attempts in 4 hours failing for distinct reasons means halt (HR-7).

## Relay to Jaime after verify passes

Service principal confirmed (Workspace Admin); 28 live CIP projects pulling from the new Dynamics/Dataverse dataset; config repointed and mapping updated; tiles and report now reflect the live database. Two cosmetic notes: two IT CIP projects show a single project-level phase (no phase-summary tasks in their schedule), and two duplicate project names carry a short GUID suffix to disambiguate. Flag if a different label is preferred.

## Status ledger

| Item | Status |
|---|---|
| GCP secrets repoint | Done (v3/v4, len 36) |
| Backend powerbi.ts remap | Done, PR #23 |
| Frontend ReportEmbed fix | Commit to PR #23 (this dispatch) |
| PR #23 merge | Operator |
| smartcity-api deploy | cc-agent-M per Decision 3, post-merge |
| Verify both surfaces | cc-agent-M |
| Relay to Jaime | cc-agent-M after verify |
