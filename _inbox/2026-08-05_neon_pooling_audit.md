---
id: 2026-08-05_neon_pooling_audit
title: Neon connection pooling audit + fixes (76j Workstream C2)
status: complete
date: 2026-08-05
related: [76j_smartsite_launch_readiness_program, 2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL, 2026-08-05_76j_C2_neon_connection_pooling_audit, 2026-08-05_launch_capacity_measured_facts]
owner: nick
---

# Neon connection pooling audit + fixes

Dispatch: `_dispatches/2026-08-05_76j_C2_neon_connection_pooling_audit.md`. WDLL acceptance items 4, 5, 6. Executor: Sonnet (C2 seat), same session, no nested subagents. Hostnames only below — no credentials, no user/password, no full DSNs printed anywhere in this doc or in shell history retained by this session.

## Ground truth discovered

All four serving DB connections in the audited scope point at the **same** Neon Postgres branch — `cortex-prod` (Scale tier, us-east-1, branch `production`) — via **three** distinct Secret Manager secrets that all resolved, before this fix, to the same **direct** (non-pooled) host:

- Direct host: `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech`
- Pooled host (Neon PgBouncer, confirmed live and documented in `90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md` line 195 from the original 2026-05-20 cutover): `ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech`

Pooled endpoint connectivity was verified with a live `SELECT 1` (Node `pg` client, `ssl: verify` relaxed only for the disposable test client, never for a deployed secret) against all three secrets' pooled equivalents before any secret was rotated. All three connected successfully.

## Audit table (before)

| Project | Service | Env var | Secret name | DB (path) | Host before | Classification |
|---|---|---|---|---|---|---|
| hauska-prod-497015 | hauska-mcp-server | `DATABASE_URL` | `DATABASE_URL` | `hauska_mcp` | `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech` | **DIRECT** |
| hauska-prod-497015 | hauska-retrieval-api | `DATABASE_URL` | `DATABASE_URL` | `hauska_mcp` | same host | **DIRECT** |
| hauska-prod-497015 | hauska-retrieval-api | `CORTEX_DATABASE_URL` | `CORTEX_DATABASE_URL` | `neondb` | same host | **DIRECT** |
| hauska-prod-497015 | hauska-engine-api | `DATABASE_URL` | `DATABASE_URL` | `hauska_mcp` | same host | **DIRECT** |
| hauska-prod-497015 | hauska-engine-api | `TXGIO_DATABASE_URL` | `CORTEX_DATABASE_URL` | `neondb` | same host | **DIRECT** |
| legacy-design-tools-prod | cortex-api | `DATABASE_URL` | `DEPLOYMENT_DATABASE_URL` | `neondb` | same host | **DIRECT** |
| Vercel `property-explorer` | (frontend, calls backends only) | — | — | — | no DATABASE_URL / POSTGRES / NEON env var found (`vercel env ls production`) | N/A — no direct DB |
| Vercel `cmdcenter` | (frontend, calls backends only) | — | — | — | no DATABASE_URL / POSTGRES / NEON env var found | N/A — no direct DB |

Result: **6 of 6** serving DSNs on the three Neon secrets in scope were DIRECT. 0 were already pooled. Both Vercel surfaces are clean — neither opens a Neon connection itself; both call through the Cloud Run backends, so the pooling posture is fully governed by the six rows above.

## Fixes applied (all sequenced one service at a time, tag → smoke → shift)

1. New pooled secret versions created (host swapped to `-pooler`, no other change — same credentials, same db path, same `sslmode=require`):
   - `DATABASE_URL` (hauska-prod-497015) → version 2.
   - `CORTEX_DATABASE_URL` (hauska-prod-497015) → version 2.
   - `DEPLOYMENT_DATABASE_URL` (legacy-design-tools-prod) → version 3 (version 1 = retired Replit-side URL, version 2 = cortex-prod direct — both retained as rollback points).
2. **hauska-retrieval-api** — redeployed with `--tag pooling-fix --no-traffic`, both secrets pinned to `:latest`. Revision `hauska-retrieval-api-00059-lir`. Smoke on the tag URL: `/health` 200, `/health/search` 200 with real result rows (functional probe, not just a ping), `Authorization: Bearer <RETRIEVAL_API_KEY>` → 200, wrong bearer → 401. Traffic shifted 100% → verified again on the default URL post-shift, same results. **Prior serving revision `hauska-retrieval-api-00034-gmd` retired to 0% (rollback point).**
3. **hauska-engine-api** — redeployed with `--tag pooling-fix --no-traffic`, `DATABASE_URL` + `TXGIO_DATABASE_URL` (→`CORTEX_DATABASE_URL` secret) both pinned to `:latest`. Revision `hauska-engine-api-00161-gin`. Smoke: `/health` 200 with `"adapters":true` (the functional probe named in the dispatch). Traffic shifted 100% → verified on default URL post-shift. **Prior serving revision was `hauska-engine-api-00159-suv`** (tag `xray200`) — note this is NOT what `_STATE.md` had on file (`00152-nuz`); `_STATE.md` LIVE INFRA was stale for this service independent of this fix, corrected below.
4. **cortex-api** — claim note filed at `90_operations/QUEUE_parked_work_index.md` before touching (paywall/Workstream A also touches cortex-api env; claim scoped to the DB secret + one plain redeploy only). Redeployed with `--tag pooling-fix --no-traffic`, `DATABASE_URL` (→`DEPLOYMENT_DATABASE_URL` secret) pinned to `:latest`. Revision `cortex-api-00481-xik`. Smoke: `/api/health` 200, `/api/health/ready` 200 with `database.status: ok` (39ms then 32ms latency), plus `engineApi.status: ok` and `retrievalApi.status: ok` as a bonus cross-check that items 2-3 above are also healthy from cortex's perspective. Traffic shifted 100% → verified on default URL post-shift. **Prior serving revision was `cortex-api-00479-cey`** (also not what `_STATE.md` had on file — `00446-zij` — corrected below).
5. **hauska-mcp-server** — **not redeployed by this dispatch**, per the explicit instruction to keep MCP env changes to the C1 (Upstash) seat this session. However: while items 2-4 above were in progress, **C1's Upstash fix landed independently and redeployed MCP** (new revision `hauska-mcp-server-00050-fej`, tag `ratelimit-smoke`, created `2026-08-05T14:30:52Z` — 3 seconds after this dispatch created `DATABASE_URL` version 2 at `14:30:49Z`). Because `DATABASE_URL` is shared across all three hauska-prod-497015 services and was referenced as `:latest`, C1's redeploy picked up the pooled DSN as an incidental side effect of the race, not a deliberate action by either seat. **This technically brushes against the WDLL's "do not bundle limiter deploy and pooling deploy on the same service revision" guardrail — flagging it explicitly rather than treating it as clean.** It was not caused by this dispatch redeploying MCP; it was caused by the shared-secret architecture plus timing. Verified live on the resulting revision: `/health` → `"postgres":{"state":"ok","latency_ms":27}` (pooled DB path healthy), auth smoke both variants pass (see below), and `"upstash":{"state":"degraded", detail: "...REPLACE-with placeholder..."}` — Upstash itself is still not live at time of writing; that is C1's item to close, reported here only because it appeared in the same health payload.

## Audit table (after)

| Service | Secret | Host after | Classification | Serving revision | Traffic |
|---|---|---|---|---|---|
| hauska-mcp-server | `DATABASE_URL` | `ep-lucky-truth-apodo8hr-pooler...` | **POOLED** (incidental, via C1's concurrent redeploy — see above) | `hauska-mcp-server-00050-fej` | 100% |
| hauska-retrieval-api | `DATABASE_URL` | `ep-lucky-truth-apodo8hr-pooler...` | **POOLED** | `hauska-retrieval-api-00059-lir` | 100% |
| hauska-retrieval-api | `CORTEX_DATABASE_URL` | `ep-lucky-truth-apodo8hr-pooler...` | **POOLED** | (same revision) | 100% |
| hauska-engine-api | `DATABASE_URL` | `ep-lucky-truth-apodo8hr-pooler...` | **POOLED** | `hauska-engine-api-00161-gin` | 100% |
| hauska-engine-api | `TXGIO_DATABASE_URL` | `ep-lucky-truth-apodo8hr-pooler...` | **POOLED** | (same revision) | 100% |
| cortex-api | `DATABASE_URL` | `ep-lucky-truth-apodo8hr-pooler...` | **POOLED** | `cortex-api-00481-xik` | 100% |

**6 of 6 in-scope DSNs are now POOLED.** Item 5 (non-pooled DSNs fixed) is fully met including MCP, though MCP's fix landed via the mechanism described above rather than a dispatch-initiated redeploy.

## Auth smoke evidence (item 6)

Baseline (before any change) and post-fix (after each redeploy) — verbatim status codes, no key values printed:

| Check | Baseline | Post-fix |
|---|---|---|
| retrieval-api `/health` | 200 | 200 |
| retrieval-api `/jurisdictions` valid `Authorization: Bearer` | 200 | 200 |
| retrieval-api `/jurisdictions` wrong bearer | 401 | 401 |
| MCP `/health` | 200 | 200 (status field flipped ok→degraded, but only on the `upstash` sub-key — pre-existing condition, not caused by this dispatch) |
| MCP `/metering/summary` well-formed but unknown `x-hauska-key` | 401 (`"Unknown API key."` — proves the auth DB round trip is alive) | 401 (same, now via pooled DB) |
| MCP `/metering/summary` malformed key | 401 | 401 |
| cortex-api `/api/health` | not tested pre-fix (out of per-service smoke scope before its own redeploy) | 200 |
| cortex-api `/api/health/ready` | not tested pre-fix | 200, `database.status: ok` |

No 401 regressions on any auth path after any of the three dispatch-initiated redeploys. Fail-loud confirmed: an invalid/unknown key still gets a hard 401 through the (now pooled) DB lookup on MCP, not a silent pass or a 503.

## Rollback points

- `DATABASE_URL` (hauska-prod-497015) version 1 = prior direct DSN.
- `CORTEX_DATABASE_URL` (hauska-prod-497015) version 1 = prior direct DSN.
- `DEPLOYMENT_DATABASE_URL` (legacy-design-tools-prod) version 2 = prior direct DSN (version 1 predates the 2026-05-20 cutover, Replit-side, not relevant to a same-day rollback).
- retrieval-api: `hauska-retrieval-api-00034-gmd` (0% traffic, addressable via `--to-revisions`).
- engine-api: `hauska-engine-api-00159-suv` tag `xray200` (0% traffic).
- cortex-api: `cortex-api-00479-cey` tag `canary` (0% traffic).
- MCP: no rollback needed from this dispatch (no redeploy initiated here); any MCP rollback question belongs to C1's session.

## `_STATE.md` LIVE INFRA drift found (unrelated to pooling, noted for the record)

While confirming which revision was actually serving before touching each service, three of the four `_STATE.md` LIVE INFRA entries were stale relative to the live `gcloud run services describe` traffic block, independent of anything this dispatch changed:

- retrieval: doc said `00030-x7r`, live serving was `00034-gmd` (now `00059-lir` post-fix).
- engine-api: doc said `00152-nuz` @100%, live serving was `00159-suv` (tag `xray200`, now `00161-gin` post-fix). `00152-nuz` was not even in the 0%-traffic tag list at 100%.
- cortex-api: doc said `00446-zij`, live serving was `00479-cey` (tag `canary`, now `00481-xik` post-fix).
- MCP: doc said `00034-cr5`; live was already `00036-rzg` before this session (matches the 2026-08-05 planner scratch note), now `00050-fej` via C1's concurrent Upstash deploy.

`_STATE.md` LIVE INFRA updated at session close to reflect the four corrected, currently-serving revisions.
