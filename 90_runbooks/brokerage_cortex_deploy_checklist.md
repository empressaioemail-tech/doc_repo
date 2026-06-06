---
id: brokerage_cortex_deploy_checklist
title: Property Brief cortex-api deploy checklist (short)
status: active
last_updated: 2026-05-28
applies_to: portfolio
related: [75a_hauska_brief_extension, 90_runbooks/property_brief_cortex_deploy, 90_runbooks/property_brief_cortex_deploy.ps1]
owner: nick
---

# Property Brief cortex-api deploy checklist (short)

> **Full runbook:** [`property_brief_cortex_deploy.md`](property_brief_cortex_deploy.md)  
> **Automate:** [`property_brief_cortex_deploy.ps1`](property_brief_cortex_deploy.ps1)

## One-command deploy

```powershell
cd P:\doc_repo\90_runbooks
.\property_brief_cortex_deploy.ps1 -ImageTag <merge-sha> -BrokerageKey "<your-key>"
```

## Pre-deploy

- [ ] Merge on `main`; **Build & push image** green (push workflow — not deploy)
- [ ] API key generated (same value → Cloud Run + extension)
- [ ] Migrations: `0026`, `0028`, `0029` (script runs `run-migrations`)

## Post-deploy smoke

- [ ] `GET /api/healthz` → 200
- [ ] `POST /api/brokerage/v1/brief` → `runId` + `laySummary`
- [ ] Traffic on revision with `BRIEFING_LLM_MODE=grok` + key (`update-traffic --to-latest` after env patch)

## Extension

- `briefApiUrl` = `https://cortex-api-tds7av26va-uc.a.run.app`
- `hauskaKey` = same as `BROKERAGE_DEV_API_KEY`

## Pitfall

**Push ≠ deploy.** Gray jobs on merge run are normal. Run script or **Run workflow** for deploy-canary / migrations / shift-traffic.
