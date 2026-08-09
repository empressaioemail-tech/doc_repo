---
id: T4_infra_track
title: T4 — Infra track: rate limiting without Upstash + load test (catch-up program)
status: closed
owner: nick
related: [CATCHUP_program_2026-08-05, 76j_smartsite_launch_readiness_program]
---

# T4 — Rate limiting (no Upstash) + load test

Operator ruling 2026-08-05: prefer NOT to use Upstash (root cause of the outage was free-tier 14-day-inactivity auto-delete; the restored DB is available as a stopgap only if the track needs a bridge, not as the destination).

## Store options analysis (for the track planner to validate and the operator to ratify)

| Option | Shape | Pros | Cons |
|---|---|---|---|
| Postgres-based limiter (RECOMMENDED for launch scale) | counters table with atomic upsert (fixed-window or sliding via two windows) on a pooled connection; can live on a dedicated tiny Neon project to isolate from the serving pool | zero new infra class, no VPC, distributed by construction, code is ~100 lines, observable in SQL | adds hot-path DB writes (fine at launch rps; measure in load test); latency ~ms not ~us |
| GCP Memorystore Redis/Valkey (scale-up path) | managed Redis in-VPC | native fit for high rps, GCP-native billing | requires Serverless VPC connector on every consuming service (+ops +cost ~$35+/mo); client swap from @upstash/redis REST to TCP redis |
| Cloud Armor rate limiting at an LB | edge-enforced per-IP throttles | no store at all; DDoS-grade | needs a load balancer in front of Cloud Run (new topology); per-IP only, no per-key/user budgets |
| Keep in-memory + low max-instances | per-instance limiter with maxScale small | zero work | not real limiting; rejected |

Recommendation: Postgres limiter now (launch traffic is modest and the load test will measure its cost), Memorystore as the documented scale-up trigger ("if limiter p95 > X or rps > Y"). Cloud Armor noted for the DDoS layer later, not for per-key metering.

## Workstreams

1. IDENTIFIER BUG FIRST (blocking everything): **CLOSED 2026-08-05.** Root cause was **not** unstable `req.ip` — Cloud Logging shows constant `50.24.190.247` across all 70 C1 burst requests. The failure mode was **per-instance MemoryRateLimitStore** under Cloud Run autoscaling (`maxScale=10`): requests spread across instances never exceeded 60 rpm on any one instance. Fix path: (a) Postgres shared store (WS2, PR #58); (b) `resolveClientIp()` normalizes `::ffff:` IPv4-mapped prefix for bucket stability (PR #58). Single-instance proof: `_inbox/2026-08-05_t4_single_instance_burst.log` (429 at request 61). Baseline repro: `_inbox/2026-08-05_rate_limit_burst_test.log`.
2. STORE IMPLEMENTATION per the ratified option: implement behind the existing ResilientRateLimitStore seam (fail-loud degraded mode from mcp #57 stays); dual-window rpm+daily budgets preserved; remove the Upstash-specific env contract or leave it as an unused adapter.
3. DISTRIBUTED PROOF: burst test across 2+ instances sharing one budget (force scale with concurrent load), verbatim outputs.
4. CROSS-SERVICE POSTURE (findings from the C1 report, decide with master planner): cortex-api's user limiter is deployed effectively-off (cap 1,000,000) — set a real cap; retrieval/engine APIs have no limiter (bearer/gate-token only) — add service-key budgets or record the accepted risk explicitly.
5. LOAD TEST (76j C4, after 1-3): define the launch SLO (proposal in 76j: 1,000 concurrent free / 100 paid, p95 < 2s parcel loads), load-test against prod-shaped staging, record measured ceilings + the limiter's measured overhead, produce the capacity doc that becomes the launch go/no-go input.

## Acceptance (master planner verifies live)

Burst proof: single-instance 429 at cap, multi-instance shared budget; degraded mode fail-loud and alarmed; store choice ratified and documented with scale-up trigger; cortex cap real; retrieval/engine posture decided and recorded; capacity doc with measured numbers; 76j C1/C4 rows and queue rows flipped.

## C4 load test outcome (2026-08-05)

**Store decision (ratified by measurement):** Postgres-backed `ResilientRateLimitStore` on serving revision `hauska-mcp-server-00040-ctj` (`rate_limit_store.detail=postgres`). Upstash remains retired as destination; restored Upstash DB is emergency-only per operator ruling.

**C4 artifact:** `_inbox/2026-08-05_76j_C4_loadtest_results.json` and executive summary `_inbox/2026-08-05_launch_capacity_audit.md`.

**Scale-up trigger (unchanged):** if limiter health `rate_limit_store.latency_ms` p95 > 500 ms under nominal load OR postgres hot-write contention blocks MCP p95, evaluate Memorystore + VPC connector per table above.

### Burst-proof procedure (repeat before launch scale claims)

1. Confirm serving MCP revision and `/health`: `rate_limit_store.state=ok`, `detail=postgres`, record `latency_ms`.
2. Confirm pooled DSN on MCP, cortex-api, retrieval-api, engine-api (`2026-08-05_neon_pooling_audit.md`).
3. Run harness: `NODE_TLS_REJECT_UNAUTHORIZED=0 node _scratch/76j-c4-loadtest.mjs --out=_inbox/2026-08-05_76j_C4_loadtest_results.json` from doc_repo (or k6 equivalent with many distinct client IDs once WS1 identifier fix lands).
4. Record per scenario: status histogram (must distinguish **429** limiter vs **503** pool), p50/p95/p99 for successful parcel facet loads, MCP initialize under budget.
5. Post-load `/health` on MCP + cortex-api; grep for 503/ECONNRESET in harness output.
6. File audit doc; re-grade 76j C4 WDLL items against measured numbers only.

**WS1–WS3 closed:** identifier root-caused (per-instance memory, not IP drift); Postgres store live (`00040-ctj`); multi-instance shared budget proven (`_inbox/2026-08-05_t4_multi_instance_burst.log`, 5×200 / 5×429 with `HAUSKA_FREE_IP_RPM=5`, minScale=2).

