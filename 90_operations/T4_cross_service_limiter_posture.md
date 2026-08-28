---
id: T4_cross_service_limiter_posture
title: T4 cross-service limiter posture (retrieval-api, engine-api, cortex-api)
status: active
date: 2026-08-05
last_updated: 2026-08-28
owner: nick
related: [T4_infra_track, 2026-08-05_launch_capacity_measured_facts]
---

# T4 cross-service limiter posture

Operator decision 2026-08-05 (catch-up program T4, workstream 4): record accepted-risk posture for services outside this change set; implement cortex-api cap only in this wave.

## cortex-api (changed this wave)

| Control | Mechanism | Production value |
|---|---|---|
| Per-user daily API budget | `userRateLimitMiddleware` + `assertUserApiRateAllowed` in `artifacts/api-server/src/lib/userMetering.ts` | **`CORTEX_USER_DAILY_API_LIMIT=50000`** via `.github/workflows/cloud-run-deploy.yml` (was `10000`, was `1000000`) |
| Code default if env unset | `readDailyLimit()` | 5000/day (unchanged) |

**Rationale for 50000:** Operator lockout 2026-08-28, twice. `--set-env-vars` is authoritative-replace, so a bake of 10000 deleted the manual 50000 and put the operator over the daily cap. 50000 is the floor that keeps the operator in the product. MCP Free-tier 10000 remains the public-agent ceiling; this cortex-api number is the authenticated-operator backstop, not that ceiling. Paid tiers and MCP remain the authoritative external meters for agent traffic.

**Scale-up trigger:** If product exposes higher direct-cortex tiers or bypasses MCP for heavy users, either raise env per tier in deploy config or share the Postgres/Redis limiter store with MCP (T4 workstreams 2–3).

## hauska-retrieval-api (no change — accepted risk)

| Fact | Evidence |
|---|---|
| No inbound HTTP rate-limit middleware | Service source under `hauska-engine/services/retrieval-api`; no `rateLimit` / express-rate-limit on app stack (audited 2026-08-05, see launch capacity doc) |
| Access control | Bearer `RETRIEVAL_API_KEY` / gate token; not a public product surface |
| Callers today | cortex-api, MCP, internal tooling |

**Accepted risk at launch:** Abuse requires a leaked service key or VPC-exposed misconfiguration. Key rotation and Secret Manager are the primary controls.

**Recommendation (post-launch, before broader exposure):** Service-key-scoped dual-window limiter (rpm + daily) on the same store pattern as MCP (Postgres limiter per T4_infra_track, or Memorystore if C4 proves hot-path cost). Budget suggestion: start at 2× MCP Team daily fan-out per key, tune from C4 measured fan-out.

## hauska-engine-api (no change — accepted risk)

Same posture as retrieval-api: bearer `HAUSKA_ENGINE_API_KEY` / gate token only; no request-rate ceiling in service code.

**Recommendation:** Mirror retrieval-api limiter when implemented; engine-api tends to be heavier per request — prefer per-route budgets on expensive spine endpoints after C4 identifies top paths.

## External meter of record

**hauska-mcp-server** remains the intended public/agent meter (tier rpm + daily via `ResilientRateLimitStore`). Cortex daily cap is a backstop for direct authenticated API traffic, not a replacement for MCP tiers.

## Verification checklist (planner / post-deploy)

1. Serving Cloud Run revision for `cortex-api` (read `status.traffic[]`, not latest) shows `CORTEX_USER_DAILY_API_LIMIT=50000`.
2. `/api/health/ready` database ok.
3. Service-authenticated paths return 200 (smoke with `SERVICE_API_KEY` or documented auth path).
4. Launch capacity doc row updated in `_inbox/2026-08-05_launch_capacity_measured_facts.md`.
