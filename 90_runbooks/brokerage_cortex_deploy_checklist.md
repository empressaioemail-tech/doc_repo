---
id: brokerage_cortex_deploy_checklist
title: Brokerage cortex-api deploy checklist
status: active
last_updated: 2026-05-26
applies_to: portfolio
related: [75a_hauska_brief_extension, 76_empressa_wedge_90d_operating_plan, 90_runbooks/cloud_run_canary_deploy.md]
owner: nick
---

# Brokerage cortex-api deploy checklist

> **Lesson.** Pinning traffic to an old Cloud Run revision leaves `BROKERAGE_DEV_API_KEY` empty → 503 on brokerage routes.

## Pre-deploy

- [ ] Migrations queued: `0026_brokerage_brief_runs.sql`, `0028_gtm_observation_layer.sql` (and any newer)
- [ ] Env: `BROKERAGE_DEV_API_KEY`, `BRIEFING_LLM_MODE=grok`, `XAI_API_KEY`
- [ ] Optional adapters: `REGRID_API_TOKEN` for parcel layers dispatch

## Deploy

1. Deploy new revision (`:latest` or commit SHA).
2. **Shift 100% traffic to new revision** (do not leave split on old revision).
3. Run migrations via GHA `run-migrations` or approved script.

## Post-deploy smoke

```bash
# Replace URL and key
curl -sS -X POST "$CORTEX/api/brokerage/v1/brief" \
  -H "Authorization: Bearer $BROKERAGE_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Hauska-Install-Id: smoke-test-install-01" \
  -d '{"address":"251 Cool Water Dr, Bastrop, TX 78602","source":"smoke"}'

curl -sS "$CORTEX/api/brokerage/v1/gtm/digest" \
  -H "Authorization: Bearer $BROKERAGE_KEY"
```

## Extension

- Set `briefApiUrl` to cortex host (no path)
- Set `hauskaKey` to same brokerage key
- Options → accept terms → run brief on Zillow homedetails
