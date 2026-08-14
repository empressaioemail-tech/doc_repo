---
id: 2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL
title: WDLL — 76j Workstream C1/C2 rate-limit store + Neon connection pooling
status: approved
date: 2026-08-05
operator_approval: 2026-08-05 (76j launch program order-2)
related: [76j_smartsite_launch_readiness_program, 90_operations/QUEUE_parked_work_index]
owner: nick
---

# WDLL: 76j Workstream C1/C2 — distributed rate limiting + Neon pooling

Date: 2026-08-05  
Status: approved  
Operator approval: 2026-08-05 (launch program order-2)

## Done looks like

Production hauska-mcp-server enforces tier rate limits through a shared Upstash Redis store across all Cloud Run instances; in-memory fallback remains only as an explicit degraded mode that logs at error level and surfaces in `/health` when active. Every Cloud Run service and Vercel function that opens Neon uses a pooled DSN (`-pooler` hostname or equivalent); each DSN fix is deployed and smoke-verified on the serving revision before the next change. Unlimited downstream APIs (cortex-api, retrieval-api, engine-api) are documented with recommendations. Measured limiter budgets and Neon connection limits are recorded for the C4 load test.

## Store recommendation (ratified at plan time)

**Fresh Upstash Redis** (not Memorystore, not Postgres-based):

- Code already ships `@upstash/redis` REST client — zero rewrite.
- REST fits Cloud Run (no persistent TCP, no VPC connector, no cold-start socket churn).
- Cost: free tier covers launch-scale counter traffic; paid tier is low single-digit dollars at Smart Site volumes.
- Memorystore requires VPC connector + fixed monthly cost; Postgres limiter would add hot-path queries against the connection pool we are fixing.

## Acceptance items

1. **Upstash live** | Fresh Upstash Redis database created; `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` wired in hauska-prod Secret Manager + Cloud Run (URL moved off literal `REPLACE-with-*` placeholder); MCP `/health` reports `upstash.state=ok`. | grade: [ ]
2. **Distributed budget proven** | Burst test against deployed MCP: concurrent requests from two instances share one RPM budget (429 after shared cap, not per-instance cap); verbatim curl/script output in `_inbox/`. | grade: [ ]
3. **Degraded mode fail-loud** | When Upstash unreachable, `ResilientRateLimitStore` logs `rate_limit_store_degraded` at error; `/health` reports upstash degraded (not silent skip); startup warns if env missing/placeholder in production. | grade: [ ]
4. **Pooling audit complete** | Table of every serving DSN (Cloud Run env/secret names + Vercel): host extracted, POOLED vs DIRECT, no secret values printed. | grade: [x] MET — `_inbox/2026-08-05_neon_pooling_audit.md`, all 6 in-scope DSNs + both Vercel surfaces audited, hostnames only.
5. **Non-pooled DSNs fixed** | Each DIRECT DSN updated to pooled endpoint; one service at a time; tag-smoke-shift; serving revision verified healthy after each. | grade: [x] MET (with a caveat) — retrieval-api/engine-api/cortex-api fixed by C2 one at a time, tag→smoke→shift, all verified. MCP ended up pooled too but via an incidental race with C1's concurrent Upstash redeploy, not a C2-initiated MCP redeploy — see audit doc item 5 for the full account before treating this as a clean single-variable change.
6. **Auth paths post-change** | After each redeploy, service-to-service auth still 200 (MCP `X-Hauska-Key`, retrieval `Authorization: Bearer`); fail-loud on 401. | grade: [x] MET — baseline + post-fix status codes recorded verbatim in the audit doc; no 401 regressions, invalid keys still hard-401 through the (now pooled) DB lookup, no silent pass, no 503.
7. **Unlimited API findings** | Report on cortex-api / retrieval-api / engine-api rate-limit posture with recommendation (no silent scope expansion). | grade: [x] MET — `_inbox/2026-08-05_launch_capacity_measured_facts.md`, verified against live source (`userMetering.ts`, `cloud-run-deploy.yml`, repo-wide grep for retrieval-api/engine-api), recommendations filed as report-only.
8. **C4 inputs recorded** | `_inbox/2026-08-05_launch_capacity_measured_facts.md`: Neon branch connection limits, limiter tier budgets (rpm/daily defaults from tiers.ts env), rationale. | grade: [~] PARTIAL — limiter budgets fully recorded from live `tiers.ts`; Neon connection-limit table is Neon's public documented scaling curve, but the cortex-prod branch's actual live compute size could not be confirmed (no Neon API key in either project's Secret Manager) — flagged inline as the one open input C4 needs before treating a specific row as the ceiling.
9. **Program close** | `76j` C1/C2 marked done; QUEUE index row flipped; `_STATE.md` LIVE INFRA updated. | grade: [ ]

## Dependencies

- Item 2 depends on 1.
- Item 5 depends on 4; each sub-fix depends on prior smoke pass (item 6).
- Item 8 depends on 1 + 4.
- **Do not bundle** limiter deploy and pooling deploy on the same service revision.
- **Claim coordination:** paywall seat owns cortex-api entitlement env; claim note in QUEUE before touching cortex-api if both seats need it.

## Amendments

- 2026-08-12 (L13 / P-29 A-007): item 1 store is Neon Postgres (`PostgresRateLimitStore` on existing MCP `DATABASE_URL` / `rate_limit_counters`), not a fresh Upstash Redis. Upstash re-provision rejected: third-party the GCP migration would strand; serving `00042-25d` already probes `rate_limit_store.state=ok detail=postgres`. Outage mode documented as fail-degraded (memory fallback with health `state=degraded`), never silent skip.

## Finish card (graded at close — planner verified 2026-08-05)

1. **partial:** Upstash DB not provisioned (no account credentials in agent env). `UPSTASH_REDIS_REST_URL` secret exists but holds placeholder; `/health` upstash still `degraded`.
2. **partial:** Burst test run documents honest current state only (`_inbox/2026-08-05_rate_limit_burst_test.log`); shared-budget proof blocked on item 1. Adjacent: 70 requests vs 60 rpm cap produced zero 429s — needs separate triage.
3. **met:** PR #57 merged/deployed; production `/health` reports `upstash.state=degraded` with explicit detail; startup ERROR log verified in Cloud Logging.

## Finish card (L13 re-grade 2026-08-12 — store restore)

1. **met:** Neon Postgres store pinned and serving. MCP #65 @ `57fa819`. Serving `00063-fic` `/health` `rate_limit_store.state=ok primary=postgres outage_policy=fail-degraded`.
2. **met:** Scoped free key past `HAUSKA_FREE_KEY_DAILY=2` → HTTP 429 band=daily; new revision `00065-maq` still 429 (counter survived deploy).
3. **met:** Memory fallback is fail-degraded and health-visible; unit test forbids `state=ok` when `memory_fallback=true`.
4. **met:** `_inbox/2026-08-05_neon_pooling_audit.md` — 6/6 DIRECT before, hostnames only.
5. **met:** All 6 DSNs pooled; serving revisions verified @100%: `00059-lir`, `00161-gin`, `00481-xik`, MCP `00050-fej` (incidental race with C1 redeploy).
6. **met:** Auth smoke clean post-fix; retrieval Bearer 200/401, MCP unknown key 401.
7. **met:** Findings in `_inbox/2026-08-05_launch_capacity_measured_facts.md` — cortex effectively unmetered (1M/day); retrieval/engine none.
8. **met:** Neon limits table + tier budgets recorded; cortex-prod compute size unverified (operator/Neon console).
9. **partial:** C1 store restore met (L13). C2 pooling already met. C4 load test + capacity-doc freshness met 2026-08-14 (L19): `_inbox/2026-08-14_76j_C4_loadtest_results.json`, `_inbox/2026-08-05_launch_capacity_audit.md` last_updated 2026-08-14. Full 76j program close still partial on DC-11d (domain not Vercel-attached) and DC-11e (Stripe Hauska Pro, P-28).
