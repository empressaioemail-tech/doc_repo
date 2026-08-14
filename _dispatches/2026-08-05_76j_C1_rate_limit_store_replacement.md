# Dispatch: 76j C1 — distributed rate-limit store replacement

**Date:** 2026-08-05  
**WDLL:** `_inbox/2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL.md`  
**Acceptance items:** 1, 2, 3, 7 (MCP section), 8 (limiter budgets)  
**Repo:** `empressaioemail-tech/hauska-mcp-server`  
**Project:** `hauska-prod-497015`  
**Serving revision (verify before deploy):** `hauska-mcp-server-00036-rzg` @100%

## Authorization

Nick (operator) greenlit 2026-08-05 (76j launch program order-2). Deploys are planner-owned. Do the work in YOUR OWN context — do NOT spawn nested subagents.

## Ground truth

- Live `/health` (2026-08-05): `upstash.state=skipped`, detail `"parked — rate-limit on memory fallback"`.
- Cloud Run env: `UPSTASH_REDIS_REST_URL=https://REPLACE-with-upstash-rest-url` (literal placeholder); token from Secret Manager `UPSTASH_REDIS_REST_TOKEN:latest`.
- `cloudbuild-mcp.yaml` bakes the placeholder URL via `_UPSTASH_REDIS_REST_URL` substitution — every deploy re-poisons the URL unless fixed.
- `index.ts`: missing/invalid Upstash env → `MemoryRateLimitStore` primary + `ResilientRateLimitStore` wrapper.
- Free-tier anonymous limits: 60 rpm / 1,000 daily IP (`tiers.ts` defaults).

## Tasks

### 1. Stand up Upstash

Create a **new** Upstash Redis database (region: us-central1 or closest to Cloud Run). Store:

- New secret version: `UPSTASH_REDIS_REST_URL` (create secret if missing)
- New secret version: `UPSTASH_REDIS_REST_TOKEN` (rotate existing secret)

### 2. Code PR (hauska-mcp-server)

Branch: `fix/distributed-rate-limit-upstash`

- Move `UPSTASH_REDIS_REST_URL` from `--set-env-vars` literal to `--set-secrets` in `cloudbuild-mcp.yaml` (mirror token binding).
- Remove `_UPSTASH_REDIS_REST_URL` substitution default placeholder.
- **Fail-loud degraded mode:**
  - `buildUpstashStore()`: treat URL containing `REPLACE-with` as missing.
  - `index.ts`: production startup `logger.error` (not warn) when falling back to memory primary.
  - `health.ts`: when on memory fallback OR Upstash ping fails, report `upstash.state=degraded` with explicit detail (not `skipped`).
  - `ResilientRateLimitStore`: periodic error log if still in fallback after 60s (avoid per-request spam).
- Tests: extend `health.test.ts`, `rate-limit-resilience.test.ts`, add placeholder-URL detection test.
- CI must green; merge on conclusion string.

### 3. Deploy (limiter ONLY — no pooling changes this deploy)

```text
gcloud builds submit --project=hauska-prod-497015 \
  --config=cloudbuild-mcp.yaml \
  --substitutions=_TAG=<short-sha>,_HAUSKA_BACKEND_URL=https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app
```

Use tag-smoke-shift: `--no-traffic --tag=ratelimit-smoke` → smoke `/health` (upstash ok) + auth path → shift 100%.

**Gotchas:** `:latest` secret pins resolve at deploy time; verify serving revision after shift; check auth 200 with engine/retrieval keys.

### 4. Burst test (acceptance item 2)

Prove shared budget across instances:

- Temporarily set `HAUSKA_FREE_IP_RPM=5` on canary OR use a test key with low rpm.
- Fire 10+ parallel requests to `/health` or unauthenticated MCP endpoint from one client; expect 429 after shared cap.
- Scale test: force 2 instances (min-instances=2 briefly OR concurrent load); repeat — total allowed = 5 rpm total, not 5×instances.
- Save verbatim output to `P:\doc_repo\_inbox\2026-08-05_rate_limit_burst_test.log`.

### 5. Deliverables

- PR link + merge SHA
- Deploy revision name @100%
- Burst test log
- Close note in `_scratch/76j-workstream-c.md`

## Out of scope

- Neon pooling (separate dispatch C2)
- cortex-api / retrieval-api limiter implementation (report only)
