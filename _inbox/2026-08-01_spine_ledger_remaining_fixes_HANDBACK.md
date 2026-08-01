---
id: 2026-08-01_spine_ledger_remaining_fixes_HANDBACK
title: HANDBACK — spine-ledger remaining fixes (coordinator one-result)
date: 2026-08-01
status: handback (PRs open; deploys + prod monitoring apply = planner)
owner: nick
related: [2026-08-01_spine_ledger_remaining_fixes_dispatch, 2026-08-01_spine_health_audit_ledger, 2026-08-01_spine_ledger_monitoring_draft]
purpose: Single coordinator result for the four work-lanes. PRs verified by coordinator (not worker verdict). No merges, traffic shifts, or prod monitoring apply.
---

# Spine-ledger remaining fixes — ONE RESULT

Coordinator owned the fan synchronously. Each lane = own PR base `main`, CI green on HEAD SHA, coordinator re-verified. Deploys remain planner-owned. Monitoring draft only (not applied to prod).

## PR TABLE (planner merge/deploy)

| Lane | Finding | Repo | PR | HEAD SHA | CI on HEAD | Coordinator verdict |
|---|---|---|---|---|---|---|
| 1 | #6 MCP readiness | hauska-mcp-server | [#55](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/55) | `457e26d52a8e0d14058a4290a1a2e13b91911d49` | build-test PASS | ACCEPT |
| 2 | #4 cortex functional health | legacy-design-tools | [#371](https://github.com/empressaioemail-tech/legacy-design-tools/pull/371) | `cdf44f187c65515663e5b6d202693f55879919b8` | Typecheck + Test PASS | ACCEPT |
| 3 | #7 fail-closed substrate | legacy-design-tools | [#372](https://github.com/empressaioemail-tech/legacy-design-tools/pull/372) | `b175a0e9eeb1381ee06b7d4c194d359fd7911498` | Typecheck + Test + Rubric PASS | ACCEPT |
| 4 | #9/#10/#11 SmartCity honesty | smartcity-os | [#32](https://github.com/empressaioemail-tech/smartcity-os/pull/32) | `65eae19080d0de9a1d0993899cfe804d5bdb2fbf` | Semgrep + Trivy + Gitleaks PASS | ACCEPT |

Worktrees (isolated; shared clones untouched): `P:\tmp\mcp-health-ready`, `P:\tmp\ldt-cortex-functional-health`, `P:\tmp\ldt-fail-closed-substrate`, `P:\tmp\smartcity-empty-success`.

## WHAT EACH PR DELIVERS

### Lane 1 — MCP `/health/ready` (#55)
- `/health` still HTTP 200 when body `status=degraded` (Cloud Run liveness preserved).
- NEW `/health/ready` → 503 only if `engine_retrieval_api` or `postgres` is `down`.
- Upstash `skipped` (parked) and cortex down do NOT trip readiness.
- Coordinator re-ran `tests/health-ready.test.ts`: 5/5 pass.

**Alert enabled after deploy:** uptime check requiring 2xx on `/health/ready` (draft B4 in monitoring doc).

### Lane 2 — cortex `/api/health/ready` (#371)
- Cloud Run probe confirmed: TCP startup `:8080` only (no HTTP liveness to break).
- `/api/health` + `/api/healthz` remain bare `{"status":"ok"}`.
- NEW `/api/health/ready`: DB `select 1` + engine-api `/health` + retrieval-api `/health`; 503 if any critical fails; structured `components` body.
- Rate-limit exempt for the new path.
- Coordinator re-ran health tests: 5/5 pass.

**Uptime enabled after deploy:** 2xx on `/api/health/ready` (draft B1).

### Lane 3 — substrate fail-closed observable (#372) — HARDENING
- `SubstrateRetrievalError` distinguishes error/unreachable from zero hits.
- Zero-hit OK path may still fall back to Neon; ERRORED substrate does NOT silently Neon/websearch as authoritative.
- Surfaces `substrateStatus:"error"` + `degradedReasons` on brief; chat emits SSE degraded annotation; logs.
- Citation happy-path regression covered; CI green.
- Coordinator re-ran codes tests: 21/21 pass. (Local `brokerageBrief.test.ts` needs `DATABASE_URL` in this shell; CI Test job covered it.)

**No uptime check** — response/log annotation signal. Probe after deploy: force bad `BRIEF_RETRIEVAL_API_URL` on a canary and confirm brief/chat annotate rather than silent swap.

### Lane 4 — SmartCity empty-success + scraper health (#32)
- Calendar total failure → HTTP 503 `{ok:false, status:"degraded", source:"unavailable"}` (not `{ok:true, source:"empty"}`).
- AI snapshot: `resolveNamedDependencies` on 7 deps; logs `ai_dependency_failures` with names; keeps partial context.
- Scraper: `/health` freshness-aware (503 when DB down / never / stale beyond default 2h); `/internal/health` stays shallow liveness.
- Coordinator re-ran focused tests: 18/18 pass. (Repo CI is SAST/SCA/secrets only.)

**Alerts enabled after deploy:** calendar 503; scraper uptime on `/health` (draft B3); optional log alert on `ai_dependency_failures`.

## MONITORING DRAFT (finding #8 — DO NOT APPLY WITHOUT PLANNER)

Full commands: `_inbox/2026-08-01_spine_ledger_monitoring_draft.md`.

Live confirm (coordinator, 2026-08-01):

```
legacy-design-tools-prod: uptime_len=0 policies_len=0 channels_len=0
smartcity-os-prod:        uptime_len=0 policies_len=0 channels_len=0
```

Draft package:
1. Email channels → `empressaioemail@gmail.com` in both dark projects.
2. Uptime (PowerShell `--path`, never Git-Bash): cortex `/api/health/ready`, smartcity-api `/api/health` (prefer non-2xx when `db!=connected` — note interim gap if body-only), scraper `/health`, MCP `/health/ready` (hauska-prod additive).
3. Wire policies to new channels; do not delete/replace existing hauska-prod policies.
4. Scraper IAM: unauthenticated `/health` is HTTP 403 today — open invoker (or auth'd uptime) before B3 is useful.
5. smartcity-api: today's `/api/health` returns 200 with `db:"connected"` — status-code uptime cannot see disconnected unless path returns non-2xx (flagged in draft).

## LIVE-VERIFY EVIDENCE (pre-deploy baseline — expected)

Serving revisions at probe time: MCP `00035-crv` @100%; cortex `00454-wud` @100%; smartcity-api `00100-hkx`; scraper `00038-hb4`.

```
HTTP 200  MCP /health                 body status=ok (upstash skipped)
HTTP 404  MCP /health/ready           NOT DEPLOYED YET
HTTP 200  cortex /api/health          {"status":"ok"}
HTTP 200  cortex /api/health/ready    SPA HTML shell (route absent; catch-all 200) — GOTCHA until #371 deploys
HTTP 403  scraper /health             IAM invoker
HTTP 403  scraper /internal/health    IAM invoker
```

Dark projects still zero monitoring (confirmed above).

## PLANNER AFTER HAND-BACK

1. Merge #55 → Cloud Build MCP → probe `/health/ready` 200 with critical deps up; canary-break a dep if feasible → 503; apply B4 uptime.
2. Merge #371 → cortex canary → probe JSON `/api/health/ready` (not HTML) → apply B1 + LDT channel.
3. Merge #372 → cortex canary with intentionally broken substrate URL → brief/chat show `substrateStatus:error` / degraded annotation; happy-path citations still work on good URL.
4. Merge #32 → smartcity-api + scraper canary → calendar failure ≠ ok:true; scraper `/health` freshness; fix invoker for uptime; apply A2/B2/B3.
5. Update ledger findings #4/#6/#7/#8/#9/#10/#11 status after live re-verify.
6. Do not shift traffic or delete existing prod alert policies without separate go.

## NOT DONE BY COORDINATOR (by design)

- No merges.
- No production traffic shifts.
- No prod monitoring create/apply (draft only).
- No canary deploys (planner-owned; coordinator may only `--no-traffic` and did not).
