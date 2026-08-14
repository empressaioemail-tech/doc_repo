---
id: 2026-08-05_launch_capacity_measured_facts
title: Launch capacity measured facts (Neon limits + limiter budgets) - 76j Workstream C
status: complete
date: 2026-08-05
last_updated: 2026-08-14
related: [76j_smartsite_launch_readiness_program, 2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL, 2026-08-05_neon_pooling_audit]
owner: nick
---

# Launch capacity measured facts

Feeds WDLL item 8 (`_inbox/2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL.md`) and the C4 load test. Two independent inputs: Neon's connection ceiling (shared substrate, all four services now pooled per `2026-08-05_neon_pooling_audit.md`) and the MCP tier rate-limit budgets (the gate C4 will actually burst-test against).

## Neon connection limits

Source: Neon public docs (`neon.com/docs/connect/connection-pooling`, `neon.com/docs/connect/choose-connection`, fetched 2026-08-05). The cortex-prod branch (`90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md` line 195: "Scale tier, region us-east-1, branch `production`, database `neondb`") is the shared substrate for all four audited services as of this session.

Neon runs PgBouncer in transaction mode in front of every branch. Two independent ceilings apply:

| Limit | Value | What it governs | Failure mode when exceeded |
|---|---|---|---|
| `max_client_conn` (pooled endpoint) | 10,000 | Client connections accepted by PgBouncer | New connections rejected ("no more connections allowed") |
| `default_pool_size` (pooled endpoint) | 90% of `max_connections` for the branch's current compute size | Active backend transactions per user/database pair | Queries queue, then fail after `query_wait_timeout` (120s) |
| `max_connections` (direct endpoint only) | Scales with compute size (table below) | Direct-to-Postgres connections (migrations, `pg_dump`, session-level ops) | Rejected: "too many connections" |

Compute-size scaling table (public Neon docs; this session did not have Neon console/API access to confirm the exact live compute size of the cortex-prod branch â€” flagged as unverified below):

| Compute size (CU) | RAM | `max_connections` (direct) | `default_pool_size` (pooled, 90%) |
|---|---|---|---|
| 0.25 | 1 GB | 104 | 93 |
| 0.50 | 2 GB | 209 | 188 |
| 1 | 4 GB | 419 | 377 |
| 2 | 8 GB | 839 | 755 |
| 3 | 12 GB | 1,258 | 1,132 |
| 4 | 16 GB | 1,678 | 1,510 |
| 9â€“56 | 36â€“224 GB | 4,000 (capped) | 3,600 |

**Unverified (flag for C4 / operator):** the exact compute size (autoscaling min/max CU) of the `cortex-prod` Neon branch was not obtainable this session â€” no `NEON_API_KEY` exists in either project's Secret Manager (`hauska-prod-497015` or `legacy-design-tools-prod`) and no Neon CLI session was authenticated. Confirm the live compute size (and whether autoscaling is enabled, which changes `max_connections` dynamically) via the Neon console before treating any specific row above as the operative ceiling for C4. Everything else in this section (the pooling mechanics, the `-pooler` hostname convention, the 10,000 client cap) is Neon's documented, compute-size-independent behavior and does not need further verification.

Direct connections are for migrations, `pg_dump`/`pg_restore`, `LISTEN`/`NOTIFY`, and session-level `SET`/advisory locks only â€” Neon's own guidance, and the reason this dispatch left a direct path reachable (via the retained pre-pooling secret versions) rather than deleting it. All six serving DSNs audited in `2026-08-05_neon_pooling_audit.md` now use the pooled endpoint for normal request traffic.

## MCP tier rate-limit budgets (source: `tiers.ts`, `hauska-mcp-server` main, read locally 2026-08-05 from `P:\hauska-mcp-server\src\tiers.ts`, HEAD `b4ba8f0` + 3 unpulled commits none of which touch this file)

Both a per-minute burst cap and a per-day quota cap are enforced per key/IP. All are env-overridable without redeploy (`readInt` with a fallback); values below are the fallback defaults, i.e. what is live unless the operator has set an override:

| Tier | RPM env var | RPM default | Daily env var | Daily default |
|---|---|---|---|---|
| Free (no key, IP-bucketed) | `HAUSKA_FREE_IP_RPM` | 60 | `HAUSKA_FREE_IP_DAILY` | 1,000 |
| Free (with key) | `HAUSKA_FREE_KEY_RPM` | 120 | `HAUSKA_FREE_KEY_DAILY` | 10,000 |
| Developer Pro | `HAUSKA_DEVELOPER_PRO_RPM` | 600 | `HAUSKA_DEVELOPER_PRO_DAILY` | 50,000 |
| Team | `HAUSKA_TEAM_RPM` | 3,000 | `HAUSKA_TEAM_DAILY` | 500,000 |
| Embedder License | `HAUSKA_EMBEDDER_RPM` | 0 (unmetered) | `HAUSKA_EMBEDDER_DAILY` | 0 (unmetered) |

Rationale for C4: the MCP gate (once C1's Upstash fix is live-verified â€” as of this session it self-reports `upstash.state: degraded`, see `2026-08-05_neon_pooling_audit.md` item 5) is the external meter. C4's burst test should target the Team tier ceiling (3,000 rpm / 500,000 daily) as the top of the metered range, since Embedder is intentionally unmetered by default. Every MCP request that clears the rate limiter fans out to retrieval-api and/or engine-api and/or cortex-api over the now-pooled Neon connections above â€” so the realistic worst case C4 needs to prove is: can `default_pool_size` (90% of whatever the live compute size turns out to be, per the unverified row above) absorb a sustained burst at the Team ceiling without queueing past `query_wait_timeout` (120s). This is the concrete link between the two halves of this doc and the reason item 8 depends on both item 1 (Upstash) and item 4 (pooling audit) per the WDLL dependency list.

## API rate-limit posture across the stack (item 7 â€” see also the audit doc's cortex-api findings)

| Service | Request-level rate limiting | Evidence |
|---|---|---|
| hauska-mcp-server | Distributed dual-window (rpm + daily) via `ResilientRateLimitStore` (Upstash-backed, in-memory fallback) | this dispatch's WDLL sibling item (C1); `tiers.ts` table above |
| cortex-api | `userRateLimitMiddleware` reads `CORTEX_USER_DAILY_API_LIMIT`, defaults to 5,000/day if unset (`artifacts/api-server/src/lib/userMetering.ts:13-17`) â€” **deployed `10000`** (T4 WS4; live-verified revision `cortex-api-00485-huz` 2026-08-05) | PR #388, gcloud revision env |
| hauska-retrieval-api | No HTTP request-rate-limiter middleware found in the service source (`P:\hauska-engine\services\retrieval-api`) | grep for `rateLimit`/`express-rate-limit`/`app.use(...limit` returned no matches in the service; the only "rate limit" hits in the whole `hauska-engine` repo are corpus-scraping adapter throttles (`packages/adapters/...`), unrelated to inbound HTTP |
| hauska-engine-api | Same as retrieval-api â€” no request-rate-limiter middleware found | same grep, same repo |

**Recommendation (report only, no scope expansion per dispatch instruction):**

1. MCP is the intended external-agent meter and is the only surface that should carry public-facing rate limiting at launch; that is correct and matches the tiered-access model.
2. cortex-api daily cap: **done (T4 WS4)** â€” production `10000`/day on serving revision; optional future: shared Postgres/Redis store with MCP.
3. retrieval-api and engine-api are reachable directly (not only through MCP) by cortex-api and by any caller holding a service key (`RETRIEVAL_API_KEY`, `HAUSKA_ENGINE_API_KEY`). Neither has its own request-rate ceiling; today they are protected only by (a) the bearer-key check being a secret only server-side callers hold and (b) not being advertised as a public endpoint. Before either is exposed more broadly than the current internal callers (MCP, cortex-api, cmdcenter, property-explorer), each should get a service-key-scoped rate limit. Out of scope for this dispatch; recorded here as the launch-readiness gap it is.

## C4 load test results (2026-08-14 L19, current)

Dated artifact: `_inbox/2026-08-14_76j_C4_loadtest_results.json`. Full grading: `_inbox/2026-08-05_launch_capacity_audit.md` (last_updated 2026-08-14). Serving MCP `00063-fic`. MCP-only (no PE / cortex fan).

| Endpoint | Scenario | n | OK | 429 | p50 ms | p95 ms | Errors |
|---|---|---:|---:|---:|---:|---:|---|
| MCP `/health` | 1 rps 20s | 21 | 21 | 0 | 68 | 99 | 0 |
| MCP `/health` | 5 rps 20s | 101 | 101 | 0 | 64 | 82 | 0 |
| MCP `/health` | 20 rps 15s | 301 | 301 | 0 | 69 | 94 | 0 |
| MCP `/mcp` initialize | 1 rps 20s | 21 | 21 | 0 | 149 | 180 | 0 |
| MCP `/mcp` initialize | 5 rps 20s | 101 | 50 | 51 | 155 | 191 | 0 |
| MCP `/mcp` initialize | 20 rps 15s | 301 | 0 | 301 | 133 | 158 | 0 |

Health throughout: 36/36 `primary=postgres memory_fallback=false`. First 429 at cumulative initialize 72 (`band=rpm`); wall-clock minute bucket, not a 60-from-first-request window. Zero HTTP 503.

## C4 load test results (2026-08-05, historical)

Harness: `_scratch/76j-c4-loadtest.mjs` -> `_inbox/2026-08-05_76j_C4_loadtest_results.json`. Full SLO grading: `_inbox/2026-08-05_launch_capacity_audit.md`.

| Endpoint | Scenario | n | OK | p50 ms | p95 ms | Errors |
|---|---|---:|---:|---:|---:|---|
| MCP `/mcp` initialize | baseline c1 Ã—5 | 5 | 5 | 135 | 359 | 0 |
| MCP `/mcp` initialize | burst c50 Ã—200 | 200 | 54 | 1,116 | 1,461 | 146Ã—429 |
| MCP `/mcp` initialize | burst c100 Ã—300 | 300 | 0 | â€” | â€” | 300Ã—429 |
| MCP `/mcp` initialize | sustained c30 45s | 9,509 | 0 | â€” | â€” | 9,509Ã—429 |
| PE facets BFF | burst c50 Ã—150 | 150 | 150 | 787 | 2,395 | 0 |
| PE facets BFF | burst c100 Ã—200 | 200 | 200 | 1,015 | 2,063 | 0 |
| PE facets BFF | sustained c30 45s | 2,628 | 2,628 | 504 | 643 | 0 |
| MCP `/health` | post-load Ã—10 | 10 | 10 | 105 | 512 | 0 |

Post-load MCP `/health`: `rate_limit_store.latency_ms` ~225, `postgres.latency_ms` â‰ˆ236, `detail=postgres`. Zero HTTP 503 observed.


