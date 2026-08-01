---
id: 2026-08-01_spine_ledger_monitoring_draft
title: DRAFT — monitoring for dark projects (legacy-design-tools-prod + smartcity-os-prod)
date: 2026-08-01
status: draft (DO NOT apply to prod without planner)
owner: nick
related: [2026-08-01_spine_ledger_remaining_fixes_dispatch, 2026-08-01_spine_health_audit_ledger]
purpose: Idempotent draft of notification channels, uptime checks, and alert policies for finding #8. Coordinator may create NEW checks/policies and report; must NOT delete/replace existing prod policies. Apply from PowerShell (not Git-Bash) so --path is not MSYS-mangled.
---

# Monitoring draft — dark projects (finding #8)

## Live confirm (2026-08-01, coordinator probe)

| Project | uptime configs | alert policies | notification channels |
|---|---|---|---|
| legacy-design-tools-prod | 0 | 0 | 0 |
| smartcity-os-prod | 0 | 0 | 0 |

Template channel in hauska-prod-497015: displayName `MCP alerts`, type email, `empressaioemail@gmail.com`, id `3816313042016535141`.

## GOTCHA (load-bearing)

Create GCP uptime checks with `--path` from **PowerShell**, not Git-Bash. MSYS mangles leading-slash paths (`/health` → `/C:/Program Files/Git/health`). Delete uptime checks by the **bare check-id**, not the full resource name.

## Service URLs (live)

| Service | Project | URL | Notes |
|---|---|---|---|
| cortex-api | legacy-design-tools-prod | https://cortex-api-tds7av26va-uc.a.run.app | Serving `00454-wud` @100%. Startup probe = TCP :8080 only (no HTTP liveness). `/api/health` today = `{"status":"ok"}`. |
| smartcity-api | smartcity-os-prod | https://smartcity-api-7dyaiy7wha-uc.a.run.app | Serving `00100-hkx`. `/api/health` has `db:connected`. |
| smartcity-scraper | smartcity-os-prod | https://smartcity-scraper-7dyaiy7wha-uc.a.run.app | Serving `00038-hb4`. Unauthenticated `/health` currently HTTP 403 (IAM invoker). Uptime check needs `--no-authentication` only if service allows unauthenticated, OR use an OIDC/auth uptime path after `/health` lands + invoker policy decided. |
| hauska-mcp-server | hauska-prod-497015 | https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app | Serving `00035-crv` @100%. `/health` stays liveness (200 even when degraded). New `/health/ready` from Lane 1 is the alert target. |

## A. Notification channels (create — additive)

### A1. legacy-design-tools-prod

```powershell
gcloud beta monitoring channels create `
  --project=legacy-design-tools-prod `
  --display-name="Cortex / LDT alerts" `
  --type=email `
  --channel-labels=email_address=empressaioemail@gmail.com
```

### A2. smartcity-os-prod

```powershell
gcloud beta monitoring channels create `
  --project=smartcity-os-prod `
  --display-name="SmartCity alerts" `
  --type=email `
  --channel-labels=email_address=empressaioemail@gmail.com
```

Capture channel resource names from create output; substitute `$LDT_CHANNEL` / `$SC_CHANNEL` below.

## B. Uptime checks (create AFTER Lane PRs are deployed)

Run each from **PowerShell**. Period 300s mirrors hauska-prod functional check.

### B1. cortex-api functional (Lane 2 path — `/api/health/ready`)

**Code PR (coordinator-verified, not merged/deployed):** [legacy-design-tools #371](https://github.com/empressaioemail-tech/legacy-design-tools/pull/371) @ `cdf44f18` — Typecheck + Test green. Proves DB `select 1` + engine-api `/health` + retrieval-api `/health`; returns 503 on any critical failure. `/api/health` and `/api/healthz` remain process-only 200. Cloud Run startup is TCP :8080 only (no HTTP liveness path to break). Also exempts `/api/health/ready` from user rate-limit (same class as other health probes).

```powershell
gcloud monitoring uptime create cortex-api-functional `
  --project=legacy-design-tools-prod `
  --resource-type=uptime-url `
  --host=cortex-api-tds7av26va-uc.a.run.app `
  --path=/api/health/ready `
  --protocol=https `
  --port=443 `
  --period=300 `
  --timeout=15 `
  --status-classes=2xx
```

Do **not** point this at bare `/api/health` (liveness-only). Apply after planner merges + deploys #371.

### B2. smartcity-api DB-aware health

`/api/health` returns HTTP 200 with `db:"connected"` today. A status-code-only uptime check cannot see `db:"disconnected"` if the process still answers 200. Two options (planner picks):

1. **Preferred (code follow-up if needed):** make `/api/health` return non-2xx when `db != connected` (or add `/api/health/ready` that does). Then:

```powershell
gcloud monitoring uptime create smartcity-api-health `
  --project=smartcity-os-prod `
  --resource-type=uptime-url `
  --host=smartcity-api-7dyaiy7wha-uc.a.run.app `
  --path=/api/health `
  --protocol=https `
  --port=443 `
  --period=300 `
  --timeout=15 `
  --status-classes=2xx
```

2. **Interim:** create the 2xx check on `/api/health` for process death only; add a log-based / JSON-content policy later. Documented gap until status-code honesty lands.

### B3. smartcity-scraper health (Lane 4)

**Code PR (coordinator-verified, not merged/deployed):** [smartcity-os #32](https://github.com/empressaioemail-tech/smartcity-os/pull/32) @ `65eae19` — Semgrep/Trivy/Gitleaks green; focused local tests 18/18. `/health` returns 503 when DB down or last successful scrape older than `SCRAPER_FRESHNESS_MAX_AGE_HOURS` (default 2h); `/internal/health` stays shallow liveness. Calendar total failure → HTTP 503 `{ok:false,status:"degraded",source:"unavailable"}` (not `{ok:true,source:"empty"}`). Pre-deploy note: unauthenticated `/health` on current serving rev returns HTTP 403 (IAM invoker) — planner must allow the uptime checker (or public invoker on `/health` only) before B3 fires usefully.

```powershell
gcloud monitoring uptime create smartcity-scraper-health `
  --project=smartcity-os-prod `
  --resource-type=uptime-url `
  --host=smartcity-scraper-7dyaiy7wha-uc.a.run.app `
  --path=/health `
  --protocol=https `
  --port=443 `
  --period=300 `
  --timeout=15 `
  --status-classes=2xx
```

**Freshness:** covered by the same check (non-2xx when stale/never). Optional follow-up: log-based alert on `ai_dependency_failures` / calendar 503 rate.

### B4. MCP readiness (Lane 1 — hauska-prod, additive; does not replace existing `/healthz` check)

**Code PR (coordinator-verified, not merged/deployed):** [hauska-mcp-server #55](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/55) @ `457e26d` — CI `build-test` green. `/health/ready` returns 503 iff `engine_retrieval_api` or `postgres` is `down`; Upstash `skipped` and cortex down do not trip it; `/health` stays 200-on-degraded.

```powershell
gcloud monitoring uptime create hauska-mcp-server-ready `
  --project=hauska-prod-497015 `
  --resource-type=uptime-url `
  --host=hauska-mcp-server-h7gvu7rgcq-uc.a.run.app `
  --path=/health/ready `
  --protocol=https `
  --port=443 `
  --period=300 `
  --timeout=15 `
  --status-classes=2xx
```

Must NOT trip on parked Upstash `skipped` (Lane 1 contract). Existing `hauska-mcp-server-healthz` left untouched. Apply only after planner merges + deploys #55 (live `/health/ready` still 404 on serving `00035-crv`).

## C. Alert policies (wire uptime failures → email)

After uptime checks exist, create one policy per check (or one multi-condition policy). Pattern mirrors "Retrieval /search FUNCTIONAL down":

```powershell
# Example skeleton — substitute CHECK_ID and CHANNEL after creates.
# Prefer gcloud monitoring policies create with a YAML condition file
# referencing monitored_resource="uptime_url" / metric
# monitoring.googleapis.com/uptime_check/check_passed = false.
```

Planner apply checklist:

1. Create channels A1/A2; record IDs.
2. Deploy Lane 1–4 code first (serving must expose the new paths).
3. From PowerShell: create B1–B4; verify stored path is `/api/health/ready` etc. (not a `C:/Program Files/Git/...` mangle).
4. Create policies → `$LDT_CHANNEL` / `$SC_CHANNEL` / hauska MCP-alerts channel for B4.
5. Do not delete or edit existing hauska-prod policies.

## D. Delete hygiene

```powershell
# Delete a bad uptime check by BARE id only:
gcloud monitoring uptime delete CHECK_ID --project=PROJECT_ID
```

## E. Out of scope for this draft

- Applying any of the above to prod without planner.
- Replacing/deleting existing hauska-prod policies or the mangled-path lesson already applied for retrieval `/health/search`.
- Lane 3 fail-closed caller (code annotation/log signal; not an uptime check).
