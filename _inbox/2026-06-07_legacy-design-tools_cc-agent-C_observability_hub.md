---
id: 2026-06-07_legacy-design-tools_cc-agent-C_observability_hub
title: cc-agent-C close — observability hub + health-watch
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/observability-hub
model: Grok Build 0.1
status: pending-operator-merge
---

# cc-agent-C close — observability hub

## Workspace hygiene (verbatim at start)

```
On branch gtm/loop-discovery-automation
Changes not staged for commit:
	modified:   artifacts/api-server/src/__tests__/brokerageGtm.test.ts
	modified:   artifacts/api-server/src/lib/gtmMcpEvents.ts
	modified:   artifacts/api-server/src/routes/brokerageGtm.ts
Untracked: gtm lib files (gtmOutbound, gtmPolicy, gtmTriage, …)
3aa33a9 feat(finding-engine): ADR-019/021 precedence reconciliation primitive (WS2) (#147)
d487068 feat(finding-engine): plan-set decomposition + per-discipline orchestration (WS1) (#146)
ed103ef feat(adapters): subsurface federal layer — SSURGO + USGS geology/groundwater/seismic (#145)
```

**Action taken:** refused alien HEAD; stashed nothing (GTM files were not on disk at checkout time); created clean branch `cortex/observability-hub` from `origin/main`.

## Atoms touched

- `current-state:portfolio` — revision drift on `cortex-api` confirmed live (see below)
- `service:cortex-api` — normalized `/api/healthz` contract implemented (deploy pending)
- `service:api-server` — same artifact/code path; distinct Cloud Run service in registry

## Deliverables (code)

| Area | Path |
|------|------|
| Normalized `/api/healthz` | `artifacts/api-server/src/routes/health.ts`, `lib/healthProbe.ts` |
| Signal emit contract | `artifacts/api-server/src/lib/hauskaHealthSignal.ts` |
| Daily aggregator | `artifacts/api-server/src/lib/healthWatchAggregator.ts`, `routes/healthWatch.ts` |
| OpenAPI + codegen | `lib/api-spec/openapi.yaml` → `HealthStatus` with `db`, `deps`, `revision` |
| Operator script | `scripts/setup-health-monitoring.ps1` |
| Runbook | `doc_repo/90_runbooks/steward_daily_digest.md` maintenance section automated |

**Endpoint:** `POST /api/ops/health-watch` (also `GET`) — `Authorization: Bearer $SERVICE_API_KEY`.

## Tests

```
vitest run (health suite): 8 passed (5 files)
```

Full `pnpm run typecheck` has pre-existing `finding-engine` export errors on this workstation; CI runs per-artifact `tsc`. Health unit tests green.

## GCP verification (verbatim)

### Cloud Scheduler API enabled

```
gcloud services enable cloudscheduler.googleapis.com --project=legacy-design-tools-prod
Operation "operations/acf.p2-1062716564162-084a4b6c-5b23-4817-9094-887ee986786b" finished successfully.
```

### `gcloud run revisions list`

**cortex-api** (revision drift — ACTIVE is stale):

```
   REVISION              ACTIVE  SERVICE     DEPLOYED
+  cortex-api-00090-vf9          cortex-api  2026-06-06 22:59:59 UTC
+  cortex-api-00089-knh          cortex-api  2026-06-06 20:21:40 UTC
+  cortex-api-00119-laq  yes     cortex-api  2026-05-29 18:10:07 UTC
```

**api-server:**

```
   REVISION              ACTIVE  SERVICE     DEPLOYED
+  api-server-00003-wix  yes     api-server  2026-05-06 23:53:46 UTC
```

### Uptime checks

```
gcloud monitoring uptime list-configs --project=legacy-design-tools-prod
Listed 0 items.
```

Uptime checks + alert policies + test alert: **blocked on operator** — run `scripts/setup-health-monitoring.ps1 -AlertEmail <recipient>` after merge/deploy. No synthetic alert fired this session.

### Deployed `/api/healthz` (pre-normalization deploy)

Current prod still returns legacy shape until deploy:

```json
{"status":"ok"}
```

## Sample health-watch report (simulated from live revision data + mock healthz)

```json
{
  "generatedAt": "2026-06-07T20:00:00.000Z",
  "summary": { "ok": 8, "warn": 2, "fail": 3 },
  "neonSizeBlocked": true,
  "ingestedSignalCount": 0,
  "checks": [
    {
      "check": "revision_drift",
      "service": "cortex-api",
      "status": "fail",
      "value": "cortex-api-00119-laq=100%",
      "threshold": "latest_ready=cortex-api-00090-vf9@100%",
      "source": "gcloud_run_v2_traffic",
      "ts": "2026-06-07T20:00:00.000Z"
    },
    {
      "check": "healthz",
      "service": "cortex-api",
      "status": "ok",
      "value": "http_200",
      "threshold": "http_200",
      "source": "GET https://cortex-api-tds7av26va-uc.a.run.app/api/healthz",
      "ts": "2026-06-07T20:00:00.000Z"
    },
    {
      "check": "neon_size",
      "service": "cortex-api",
      "status": "warn",
      "value": "blocked",
      "threshold": "53687091200",
      "source": "neon_readonly_token_absent",
      "ts": "2026-06-07T20:00:00.000Z"
    }
  ]
}
```

## Blockers

1. **PR not opened** — branch local only; operator merge required.
2. **Deploy** — normalized `/api/healthz` + health-watch route need `cortex-api` canary deploy.
3. **Neon read-only token** — absent; size query degrades per 76e (app liveness via `/healthz` db field post-deploy).
4. **Uptime / alerts / test notification** — script ready; operator must supply `-AlertEmail` and run post-deploy.
5. **Scheduler job SA** — `health-watch-scheduler@legacy-design-tools-prod.iam.gserviceaccount.com` may need creation + `run.invoker` on `cortex-api`.
6. **Wave B peer signals** — `gate_probe`, `scraper_job`, smartcity `neon_size` ingest empty until cc-agent-M dispatches land.
7. **cortex-api revision drift** — `cortex-api-00119-laq` serving 100% while `cortex-api-00090-vf9` is latest ready (alert-only; no auto-remediation).

## PR

Pending operator request to commit + push. Branch: `cortex/observability-hub` (not yet on origin).
