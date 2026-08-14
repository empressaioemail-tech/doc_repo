---
id: 2026-08-05_launch_capacity_audit
title: Launch capacity audit (76j C4 load test)
status: complete
date: 2026-08-05
last_updated: 2026-08-14
owner: nick
related: [76j_smartsite_launch_readiness_program, 2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL, T4_infra_track, 2026-08-05_launch_capacity_measured_facts]
---

# Launch capacity audit (measured)

**Current measurements: 2026-08-14 L19 / P-29 DC-11b.** Prior 2026-08-05 C4 run is retained below as history (it fanned PE facets and cortex health; L19 does not).

## 2026-08-14 L19 (MCP-only, serving 00063-fic)

Lane: L19. PLAN-ROW P-29. Raw artifact: `_inbox/2026-08-14_76j_C4_loadtest_results.json`. Harness: `_scratch/l19-dc11-loadtest.mjs`. TLS: `NODE_TLS_REJECT_UNAUTHORIZED=0` on the operator workstation (curl.exe verified the same host with normal TLS; first Node run failed 846/846 in ~50 ms and is preserved at `_inbox/2026-08-14_76j_C4_loadtest_results_tls_fail.json`).

Target: `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app` only. GET `/health` for latency. POST `/mcp` initialize (anonymous) for the limiter. No PE facets. No cortex-api or retrieval-api request paths beyond incidental `/health` dependency probes (15 s dep cache).

Serving pin (gcloud, 2026-08-14T13:54Z): `hauska-mcp-server-00063-fic` @100% tag `l13-57fa819`. `HAUSKA_RATE_LIMIT_STORE=postgres`. `HAUSKA_FREE_IP_RPM` unset (code default 60). `/health` pre: `rate_limit_store.state=ok primary=postgres memory_fallback=false outage_policy=fail-degraded`.

### Health latency (GET /health, not rate-limited)

| Scenario | RPS | Duration | n | HTTP 200 | 429/503/err | p50 | p95 | p99 |
|---|---:|---:|---:|---:|---|---:|---:|---:|
| health_1rps_20s | 1 | 20 s | 21 | 21 | 0 | 68 ms | 99 ms | 100 ms |
| health_5rps_20s | 5 | 20 s | 101 | 101 | 0 | 64 ms | 82 ms | 94 ms |
| health_20rps_15s | 20 | 15 s | 301 | 301 | 0 | 69 ms | 94 ms | 103 ms |

Counting rule: n = requests the harness fired in that tier. Percentiles on all completed responses.

### Limiter ramps (POST /mcp initialize, anonymous IP)

| Scenario | RPS | Duration | n | HTTP 200 | HTTP 429 | 503 | p50 | p95 | p99 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mcp_init_1rps_20s | 1 | 20 s | 21 | 21 | 0 | 0 | 149 ms | 180 ms | 193 ms |
| mcp_init_5rps_20s | 5 | 20 s | 101 | 50 | 51 | 0 | 155 ms | 191 ms | 279 ms |
| mcp_init_20rps_15s | 20 | 15 s | 301 | 0 | 301 | 0 | 133 ms | 158 ms | 182 ms |

First 429 at cumulative initialize request **72**. Body verbatim: `{"jsonrpc":"2.0","error":{"code":-32000,"message":"Rate limit exceeded for the free tier. Request an API key at hauska.dev for higher limits.","data":{"band":"rpm","tier":"free_anonymous"}},"id":1}`.

Pre-registered first-429 band was [50, 70] for a 60 rpm cap. **72 is outside that band.** Cause: `minuteBucket = Math.floor(now/60000)` is a wall-clock UTC minute, not a sliding 60 s from first request. A ramp that straddles :00 UTC admits leftover of the prior minute plus a fresh 60. After the cap, 20 rps was 301/301 HTTP 429. Zero HTTP 503. This is window alignment, not a store miss.

### Limiter / Neon observability during the run

| Signal | Value | Notes |
|---|---|---|
| `/health` samples | 36 | Every sample `primary=postgres`, `memory_fallback=false`, `state=ok` |
| `rate_limit_store.latency_ms` | 207 (pre, cache miss) then 37 (post) | Under the 500 ms scale-up trigger |
| `postgres.latency_ms` | 33 pre / 29 post | No pool-exhaustion signal |
| HTTP 503 | **0** | Across 846 successful-TLS requests |
| Silent memory fallback | **0** | Fail-degraded outage policy present; not engaged |

### SLO re-grade (MCP surface only)

| SLO dimension | Verdict | Evidence |
|---|---|---|
| Anonymous MCP session opens | **CAPPED at 60/min/IP** (wall-clock minute) | 429 band=rpm; 20 rps after cap is 100% 429 |
| 1,000 concurrent free sessions | **NOT DEMONSTRATED** | Single egress IP; this is the meter working, not a 1k-session proof |
| 100 concurrent paid sessions | **NOT TESTED** | No paid-tier key in the harness |
| MCP `/health` p95 | **PASS** at 1/5/20 rps | p95 82-99 ms |
| MCP initialize p95 (under cap) | **PASS** | p95 180 ms at 1 rps; 191 ms on the mixed 5 rps tier |
| Rate limiter + no silent memory | **PASS** | postgres primary throughout; 429s at rpm; zero 503 |

### Measured ceilings (2026-08-14, single-region generator)

- Anonymous MCP initialize: **60 per wall-clock minute per IP** hard ceiling. Successful initialize p95 **~180 ms** at 1 rps; p95 **~191 ms** while the 5 rps tier is still under remaining budget.
- MCP `/health`: stable **20 rps** for 15 s with p95 **94 ms** (dep probes cached 15 s, so this is MCP+cache, not a 20 rps cortex fan).
- Soft-launch recommendation unchanged: go with stated caps; no-go for a literal 1,000 concurrent anonymous sessions from one NAT.

## 2026-08-05 C4 (historical; PE + cortex fanned)

Executor: TRACK T4 Workstream 5 (76j C4). Raw artifact: `_inbox/2026-08-05_76j_C4_loadtest_results.json`. Harness: Node 24 fetch pool (`_scratch/76j-c4-loadtest.mjs`), TLS via `NODE_TLS_REJECT_UNAUTHORIZED=0` on the operator workstation (curl.exe verified the same endpoints with normal TLS). Do not repeat the PE-facet or cortex-health legs while L16 holds the atoms slot.

## Targets under test (76j proposal)

| Dimension | Launch SLO (proposal) | Method this session |
|---|---|---|
| Free concurrent sessions | 1,000 concurrent OR sustained equivalent | MCP `POST /mcp` `initialize` burst/sustained from **one egress IP** (anonymous / free tier: 60 rpm default) |
| Paid concurrent sessions | 100 concurrent (if testable) | **Not run** — no Developer Pro / Team product key in executor environment |
| Parcel load latency | p95 < 2s | PE production `GET /api/spine/property-atoms/{id}/facets` (atom-chain read path), Bastrop sample parcels |

## Production shape verified before load

| Surface | Serving revision / URL | Pre-load probe |
|---|---|---|
| MCP | `hauska-mcp-server-00040-ctj` @100% (`postgres-limiter` tag), `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app` | `/health`: `rate_limit_store.state=ok`, `detail=postgres`, `latency_ms` 200–226 |
| PE | `https://property-explorer-xi.vercel.app` | Facets 200 for `48021:34137`, ~676 ms single curl |
| cortex-api | `https://cortex-api-tds7av26va-uc.a.run.app` | `/api/health` 200 post-load |

MCP Cloud Run: `minScale=1`, `maxScale=10` (gcloud 2026-08-05).

## Measured results (2026-08-05T19:53Z run)

### MCP `initialize` (direct Cloud Run `/mcp`, anonymous)

| Scenario | Concurrency | Requests | HTTP 200 | HTTP 429 | p50 (200 only) | p95 (200 only) |
|---|---:|---:|---:|---:|---:|---:|
| Baseline | 1 | 5 | 5 | 0 | 135 ms | 359 ms |
| Burst | 50 | 200 | 54 | 146 | 1,116 ms | 1,461 ms |
| Burst | 100 | 300 | 0 | 300 | — | — |
| Sustained 45s | 30 | 9,509 | 0 | 9,509 | — | — |

**Interpretation:** Postgres rate-limit store is enforcing the free-tier **60 rpm / IP** budget (`HAUSKA_FREE_IP_RPM` default). Under burst, the first ~60 requests/minute succeed then the remainder are **429** (not 503). This is correct limiter behavior but **does not simulate 1,000 distinct free sessions** (that requires distributed egress or a load generator with many IPs / keys).

### PE parcel facets (production BFF + atom-chain)

| Scenario | Concurrency | Requests | HTTP 200 | 429/503/err | p50 | p95 | p99 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Burst | 50 | 150 | 150 | 0 | 787 ms | **2,395 ms** | 2,719 ms |
| Burst | 100 | 200 | 200 | 0 | 1,015 ms | **2,063 ms** | 2,136 ms |
| Sustained 45s | 30 | 2,628 | 2,628 | 0 | 504 ms | **643 ms** | 926 ms |

**Throughput (sustained):** ~58.4 successful facet loads/s aggregate at 30 concurrent workers (~2.0 req/s per worker average).

### MCP via PE spine proxy (`/api/spine/mcp/mcp`)

| Scenario | Concurrency | Requests | 200 | p50 | p95 |
|---|---:|---:|---:|---:|---:|
| Burst | 50 | 100 | 100 | 1,322 ms | 1,489 ms |

(No 429 in this scenario during the window — limiter bucket had headroom after prior MCP-direct saturation; treat as proxy latency sample, not capacity ceiling.)

### Limiter / Neon observability

| Signal | Value | Notes |
|---|---|---|
| MCP `/health` `rate_limit_store.latency_ms` | 225–236 ms post-load | Postgres store reachable; no degraded state |
| MCP `/health` `postgres.latency_ms` | 236 ms post-load | No pool exhaustion signal on health probe |
| HTTP 503 / connection errors | **0** across all scenarios | No Neon queue-timeout pattern observed at these loads |
| MCP service `metrics.latency` (in-process) | p50 6 ms, p95 56 ms over 160 handled requests | Server-side view; excludes 429 short-circuit |

## SLO verdict

| SLO dimension | Verdict | Evidence |
|---|---|---|
| 1,000 concurrent free sessions | **FAIL / not demonstrated** | Single-IP test hits 60 rpm cap; 100-concurrency burst yields 100% 429 after bucket exhaustion |
| 100 concurrent paid sessions | **NOT TESTED** | No paid-tier key available to executor |
| p95 < 2s parcel loads | **PARTIAL** | **PASS** at sustained 30 concurrent (p95 643 ms). **FAIL** at burst 50+ concurrent (p95 2.06–2.40 s) |
| Rate limiter + pooling stability | **PASS** | 429 enforcement live; postgres store ok; zero 503s |

## Measured ceilings (honest, single-region generator)

- **Anonymous MCP session opens:** ~**60/min/IP** hard ceiling by design (429 beyond that); successful initialize latency p95 ~**1.5 s** when under cap at 50-way burst.
- **PE parcel facet loads:** stable **~58 req/s** aggregate at 30 concurrent with p95 **< 700 ms**; tail latency exceeds 2s when **≥ ~50 concurrent** facet fetches hit the same BFF/upstream chain.
- **MCP Cloud Run scale headroom:** max **10** instances configured; this run did not prove multi-instance limiter sharing under geo-distributed load (follow-up: distributed burst with distinct client identifiers per T4 WS1 identifier fix).

## Failures / anomalies observed

1. **429 storm** on MCP direct initialize after free-tier budget exhausted (expected, not infra failure).
2. **PE p95 > 2s** under 50–100 concurrent facet burst (capacity tail risk for viral spike).
3. **Node.js TLS** on operator workstation requires `NODE_TLS_REJECT_UNAUTHORIZED=0` for fetch-based harness (curl unaffected); document for repeat runs.

No 503, no connection reset counts, no cortex health failures post-load.

## Launch go / no-go recommendation

**Recommendation: CONDITIONAL NO-GO for the literal 76j numeric SLO as written; GO for a soft launch with stated caps.**

- **Go** if launch comms and ops accept: (a) free MCP/API use remains **tier-metered per IP/key**, not 1k simultaneous anonymous sessions from one NAT; (b) PE browse is sized for **tens of concurrent parcel loads per region** without marketing a 1k flash crowd; (c) postgres rate-limit store and Neon pooling stay on serving revisions (`00040-ctj`, pooled DSNs).
- **No-go** until: (a) **distributed load test** (or keyed cohort simulating 1k free identities) proves limiter + pool under multi-tenant burst; (b) **PE facet p95 < 2s at 50+ concurrent** via BFF caching, retrieval pool tuning, or Vercel/Cloud Run concurrency bumps; (c) optional **paid-tier 100-session** probe with a Developer Pro key.

## Repeat procedure

See `90_operations/T4_infra_track.md` (C4 burst-proof procedure) and OPS-9 S7 rate-limiter ops section.

