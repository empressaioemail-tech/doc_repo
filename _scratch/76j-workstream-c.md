# 76j Workstream C — rate limit + pooling (planner scratch)

## T4 CLOSE-OUT (2026-08-05 master planner verified)

### WS1 identifier "bug" — root-caused

**NOT unstable req.ip.** Cloud Logging shows constant `50.24.190.247` across all 70 C1 burst requests (`jsonPayload.event=request_received`).

**Actual failure mode:** per-instance `MemoryRateLimitStore` under Cloud Run autoscaling (`maxScale=10`). Requests spread across instances; no single instance exceeded 60 rpm.

**Fix:** Postgres shared store (PR #58) + `resolveClientIp()` `::ffff:` normalization (defense in depth).

### Store (WS2–WS3)

- PR [hauska-mcp-server#58](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/58) merged; serving `hauska-mcp-server-00040-ctj` @100%
- Migration `010_rate_limit_counters.sql` applied (BOM fix in `b5f26de`)
- Single-instance burst: `_inbox/2026-08-05_t4_single_instance_burst.log` — 429 at req 61
- Multi-instance burst: `_inbox/2026-08-05_t4_multi_instance_burst.log` — 5×200 / 5×429 shared budget

### C4 load test

- Audit: `_inbox/2026-08-05_launch_capacity_audit.md`
- Verdict: conditional no-go for literal 1k concurrent free; soft launch OK with tier caps

### cortex-api cap (WS4)

- LDT #388; `CORTEX_USER_DAILY_API_LIMIT=10000` on `cortex-api-00485-huz`
- Posture: `90_operations/T4_cross_service_limiter_posture.md`

### LESSON

Per-instance memory limiters are not limiters behind a load balancer. Always prove shared budget across 2+ instances before accepting a store.
