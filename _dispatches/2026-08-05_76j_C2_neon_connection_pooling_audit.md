# Dispatch: 76j C2 — Neon connection pooling audit + fixes

**Date:** 2026-08-05  
**WDLL:** `_inbox/2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL.md`  
**Acceptance items:** 4, 5, 6, 8 (Neon limits), 7 (API limiter recon)  
**Repos:** Cloud Run services across `hauska-prod-497015` + `legacy-design-tools-prod`; Vercel `property-explorer` + `cmdcenter`

## Authorization

Nick (operator) greenlit 2026-08-05 (76j launch program order-2). Deploys are planner-owned. Do the work in YOUR OWN context — do NOT spawn nested subagents.

## Ground truth

Neon pooled hostnames contain `-pooler` (e.g. `ep-*-pooler.*.neon.tech`). Direct hosts omit `-pooler`.

**Cloud Run services to audit:**

| Project | Service | DB env var | Secret name |
|---|---|---|---|
| hauska-prod-497015 | hauska-mcp-server | DATABASE_URL | DATABASE_URL |
| hauska-prod-497015 | hauska-retrieval-api | DATABASE_URL, CORTEX_DATABASE_URL | same |
| hauska-prod-497015 | hauska-engine-api | DATABASE_URL, TXGIO_DATABASE_URL | DATABASE_URL, CORTEX_DATABASE_URL |
| legacy-design-tools-prod | cortex-api | DATABASE_URL | DEPLOYMENT_DATABASE_URL |

**Vercel:** `property-explorer-xi` — list env vars referencing DATABASE_URL, POSTGRES, NEON (via `vercel env ls`).

**Claim:** Before redeploying cortex-api, add claim note to `90_operations/QUEUE_parked_work_index.md` (paywall seat may also touch cortex-api).

## Tasks

### 1. Audit script

Write a script that for each secret:

- Reads latest version via gcloud
- Extracts hostname only (never print user/pass)
- Classifies POOLED vs DIRECT
- Output markdown table to `_inbox/2026-08-05_neon_pooling_audit.md`

Also query Neon console/API if available for branch connection limits (Scale tier defaults) → feed item 8 doc.

### 2. Fix DIRECT DSNs (one at a time)

For each DIRECT finding:

1. Create new secret version with same credentials but `-pooler` hostname (Neon console provides pooled connection string).
2. Redeploy **only that service** with explicit secret version pin if `:latest` no-op risk (or force redeploy with `--set-secrets=DATABASE_URL=DATABASE_URL:latest`).
3. tag-smoke-shift:
   - hauska-*: `/health` or `/healthz` + functional probe (retrieval `/health/search`, engine `/health` adapters field)
   - cortex-api: `/api/health` + `/api/health/ready` if deployed
4. Verify **serving revision** (not just latestReady) @100%.
5. Auth smoke: retrieval `Authorization: Bearer`, MCP `X-Hauska-Key` paths → 200.

**Do NOT change MCP in same session as C1 limiter deploy** — sequence after C1 limiter is live-verified OR touch different services first (retrieval/engine before MCP if C1 in flight).

### 3. Unlimited API findings (item 7)

Recon (read-only):

- **hauska-mcp-server:** distributed dual-window limiter (rpm + daily) — this dispatch fixes it.
- **cortex-api:** `userRateLimitMiddleware` + `CORTEX_USER_DAILY_API_LIMIT=1000000` (effectively off). Extension public key has separate in-Postgres limits.
- **retrieval-api / engine-api:** no request rate limiter found in repo search.

Report recommendation: MCP gate is the external agent meter; cortex internal limit should be lowered post-launch or wired to Redis; retrieval/engine should get service-key rate limits before public exposure (out of scope for this dispatch — report only).

### 4. Deliverables

- `_inbox/2026-08-05_neon_pooling_audit.md` (before/after)
- `_inbox/2026-08-05_launch_capacity_measured_facts.md` (Neon limits section)
- Per-service smoke evidence (revision names)
- `_scratch/76j-workstream-c.md` updates

## Out of scope

- Upstash / MCP rate limiter (C1 dispatch)
- Load test C4
