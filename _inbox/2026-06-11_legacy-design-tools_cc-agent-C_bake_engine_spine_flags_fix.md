# Bake ENGINE_SPINE_FINDINGS into deploy-canary — cc-agent-C report

**Date:** 2026-06-11  
**Agent:** cc-agent-C  
**Repo:** legacy-design-tools  
**Branch:** `cortex/bake-engine-spine-findings-deploy`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/174  
**SHA:** `0bc35b3`  
**Worktree:** `P:\legacy-design-tools`

---

## Problem

Findings-on-spine is live on prod (`cortex-api-00155-jex` @ 100%) via manual `gcloud run services update` with:

- `ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`
- `ENGINE_SPINE_FINDINGS=1`
- `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1`
- `ENGINE_API_GATE_TOKEN` ← `HAUSKA_ENGINE_API_KEY:latest`

The `deploy-canary` job uses `--set-env-vars`, which **replaces** the full env on every deploy (line-204 clobber class). The next workflow deploy would silently drop these flags and revert findings to the local engine.

---

## Exact diff

| File | Lines | What |
|------|-------|------|
| `.github/workflows/cloud-run-deploy.yml` | 174–178 | Comment: one-engine-at-a-time `ENGINE_SPINE_*` append convention (findings live; briefing → hydrology → topography next) |
| `.github/workflows/cloud-run-deploy.yml` | 210 | `--set-env-vars` append: `ENGINE_API_URL=...`, `ENGINE_SPINE_FINDINGS=1`, `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1` (additive; existing anthropic/orchestrated vars unchanged) |
| `.github/workflows/cloud-run-deploy.yml` | 211 | `--set-secrets` append: `ENGINE_API_GATE_TOKEN=HAUSKA_ENGINE_API_KEY:latest` |

### Verbatim added comment (174–178)

```yaml
        # ENGINE_SPINE_* flags: one engine at a time. Append each spine flag
        # to --set-env-vars below only AFTER that engine is verified green on
        # the canary. Findings is live (ENGINE_SPINE_FINDINGS +
        # ENGINE_SPINE_FINDINGS_ORCHESTRATED). Next: briefing, then hydrology,
        # then topography — do not batch.
```

### Verbatim env/secrets tail (210–211)

```yaml
            --set-env-vars=NODE_ENV=production,LOG_LEVEL=info,AIR_FINDING_LLM_MODE=anthropic,BRIEFING_LLM_MODE=anthropic,AIR_FINDING_ORCHESTRATED=1,ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app,ENGINE_SPINE_FINDINGS=1,ENGINE_SPINE_FINDINGS_ORCHESTRATED=1,MNML_RENDER_MODE=mock,RENDERS_PROD_ENABLED=false,DXF_CONVERTER_MODE=mock,AI_INTEGRATIONS_ANTHROPIC_BASE_URL=https://api.anthropic.com,PUBLIC_OBJECT_SEARCH_PATHS=/legacy-design-tools-prod-objects/public,PRIVATE_OBJECT_DIR=/legacy-design-tools-prod-objects/.private,ICC_ES_REPORT_URL_TEMPLATE=https://icc-es.org/report-listing/?search_api_fulltext={ESR} \
            --set-secrets=DATABASE_URL=DEPLOYMENT_DATABASE_URL:latest,AI_INTEGRATIONS_ANTHROPIC_API_KEY=AI_INTEGRATIONS_ANTHROPIC_API_KEY:latest,SESSION_SECRET=SESSION_SECRET:latest,BIM_MODEL_SHARED_SECRET=BIM_MODEL_SHARED_SECRET:latest,SNAPSHOT_SECRET=SNAPSHOT_SECRET:latest,SERVICE_API_KEY=SERVICE_API_KEY:latest,ENGINE_API_GATE_TOKEN=HAUSKA_ENGINE_API_KEY:latest
```

**Scope confirmed:** `ENGINE_SPINE_BRIEFING`, `ENGINE_SPINE_HYDROLOGY`, `ENGINE_SPINE_TOPOGRAPHY` **absent** (findings-only).

---

## Acceptance checklist

- [x] `deploy-canary` env block carries `ENGINE_API_URL` + `ENGINE_SPINE_FINDINGS=1` + `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1` additive to existing env
- [x] `ENGINE_API_GATE_TOKEN=HAUSKA_ENGINE_API_KEY:latest` in `--set-secrets`
- [x] Briefing/hydrology/topography spine flags absent
- [x] Comment documents one-at-a-time append convention
- [x] PR held for operator merge — **do not run `deploy-canary` until merged** (or re-apply env manually after)

---

## Post-merge durability proof

**Status:** PENDING — awaiting operator merge of #174, then `deploy-canary` + `shift-traffic`.

**Operator steps after merge:**

1. Merge #174.
2. Run `workflow_dispatch` → `deploy-canary` (then smoke, then `shift-traffic`).
3. Capture revision env dump:

```powershell
$REV = gcloud run services describe cortex-api --region=us-central1 --format="value(status.latestCreatedRevisionName)"
gcloud run revisions describe $REV --region=us-central1 --format="yaml(spec.containers[0].env)"
```

4. Paste verbatim dump below this section.

### Revision env dump (post-merge)

```
(pending — operator to fill after durability-proof deploy)
```

---

## Operator note

Current prod baseline before this merge: `cortex-api-00155-jex` @ 100% with spine findings flags applied manually. This PR makes those flags durable across workflow deploys. After merge + one deploy cycle, the revision describe dump above should show all three env vars + `ENGINE_API_GATE_TOKEN` without any manual `gcloud run services update`.
