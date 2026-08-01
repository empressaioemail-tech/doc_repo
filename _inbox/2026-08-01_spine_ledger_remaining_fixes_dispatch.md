---
id: 2026-08-01_spine_ledger_remaining_fixes_dispatch
title: DISPATCH — spine-ledger remaining fixes (MCP readiness signal, cortex functional health + alerting, fail-closed caller, SmartCity empty-success) via one coordinator
date: 2026-08-01
status: dispatch (one coordinator planner owns the fleet; deploys planner-owned)
owner: nick
related: [2026-08-01_spine_health_audit_ledger, 2026-08-01_retrieval_api_search_down_incident]
purpose: The co-urgent block (functional /search alert + MCP health honesty) is DONE. This dispatches the remaining ready spine-ledger findings. ONE coordinator agent owns the fan, delivers per-finding PRs + monitoring config, verifies live, hands back one result. Planner (me) owns all deploys + traffic shifts.
---

# Spine-ledger remaining fixes

Grounded against live state before dispatch (do not re-derive). All findings from `2026-08-01_spine_health_audit_ledger.md`.

## COORDINATION MODEL (single handoff)
ONE coordinator/planner agent owns this end to end. It fans the work-lanes itself and BLOCKS until they return (a coordinator that fans workers then returns ABANDONS them — own the fan synchronously). Each code fix = its own PR (base main, CI green on HEAD SHA). Monitoring config = idempotent scripts/commands + a written summary. The coordinator verifies each fix (never delegates the verdict to the worker). Returns ONE result: the PRs + the monitoring changes + live-verify evidence. Operator manages only the coordinator. DEPLOYS ARE PLANNER-OWNED (me) — the coordinator delivers PRs + `--no-traffic` canary probes at most; it does NOT merge, shift production traffic, or apply monitoring changes to prod without handing back for planner apply. (If low-risk monitoring-only config, it may CREATE the checks/policies and report — but never delete/replace existing prod policies.)

## THE FOUR WORK-LANES

### LANE 1 — MCP degraded observability (finding #6) — SEPARATE readiness signal, do NOT break liveness
CRITICAL NUANCE (verified in source): `hauska-mcp-server/src/health.ts` returns HTTP 200 ON PURPOSE even when the body `status` is `degraded` — the comment at the top says so, because Cloud Run uses /health for LIVENESS and a 503 would make it RESTART a merely-degraded container. So do NOT make /health return 503 on degraded. Instead: add a SEPARATE readiness/alerting signal — either a distinct endpoint (e.g. `/health/ready` or `/health/critical`) that returns non-200 ONLY when a CRITICAL dependency is DOWN (engine/retrieval or postgres — NOT the intentionally-parked upstash `skipped` state, which is normal), OR a log-based metric on the existing `status:degraded` body. Ruling: SEPARATE readiness signal (preserve /health liveness). The parked-upstash `skipped` state must NOT trip it (that was just made honest in #54). Deliver: the new signal + a test + note the alert wiring it enables (planner wires the alert).

### LANE 2 — cortex-api functional health (finding #4)
`legacy-design-tools/artifacts/api-server/src/routes/health.ts` returns bare `{"status":"ok"}` (liveness only — no DB/engine/retrieval proof). Bring it to the engine-api model (engine-api's /health reports adapters/engineCore/envelope — the GOOD model to match). Add a functional health that proves the critical path: one DB-backed read + a reachability probe of its key deps (engine-api, retrieval-api). Keep the existing bare route for liveness if Cloud Run depends on it (check the Cloud Run startup/liveness probe config first — do NOT break the container's liveness, same lesson as Lane 1). Deliver: a functional cortex health signal + test; note the uptime-check + alert it enables.

### LANE 3 — fail-closed caller contract (finding #7) — HARDENING (citations already work live)
`legacy-design-tools`: `briefRetrievalSubstrate.ts` returns `[]` on a non-ok substrate response; `retrieval.ts` then falls back to Neon; the brief can fall further to websearch. This SILENTLY masks a substrate failure as "fine but empty/wrong grounding." NOTE: #370 citations now WORK live (operator-confirmed [n] chips 2026-08-01), so this is HARDENING not a live outage. Fix: SURFACE substrate failure rather than silently degrading — distinguish "substrate returned zero legitimate hits" (fine, fall back) from "substrate ERRORED/unreachable" (should surface a degraded/annotated state, not silently swap to a different corpus as if authoritative). Preserve the graceful path but make the failure OBSERVABLE (log signal + a response annotation the surface can show). Do NOT re-break citations. Deliver: PR + test; a probe showing an errored-substrate call now surfaces vs silently-Neons.

### LANE 4 — SmartCity empty-success masks (findings #9/#10/#11)
`smartcity` repo (smartcity-os-prod project): (a) the calendar returns `{ok:true, events:[], source:"empty"}` on TOTAL scraper/LKG failure — a success envelope masking death; (b) the AI assistant does `.catch(()=>null)` on ~7 deps — incomplete context with no failure marker; (c) smartcity-scraper has NO /health route (TCP startup only). Fix: (a) the calendar distinguishes genuine-empty from failure (an honest failure/degraded state, not a success envelope); (b) the AI assistant marks which deps failed rather than silently nulling; (c) add a /health route to the scraper (+ ideally a last-successful-scrape freshness signal). Deliver: PR(s) + tests; note the health-check/alert each enables.

## MONITORING CONFIG (the dark projects — finding #8) — planner-apply, coordinator may draft
smartcity-os-prod and legacy-design-tools-prod have ZERO uptime checks, ZERO alert policies, ZERO notification channels (confirmed live). Draft (do NOT apply to prod without planner): a notification channel per project (email empressaioemail@gmail.com, mirroring the hauska-prod "MCP alerts" channel), + uptime checks on cortex-api (once Lane 2 lands its functional signal), smartcity-api (/api/health already has db — alert on not-connected), and the scraper (once Lane 4 adds /health) + a freshness signal. GOTCHA (planner memory): create GCP uptime checks with the `--path` from PowerShell, NOT Git-Bash — MSYS mangles a leading-slash path (`/health` → `/C:/Program Files/Git/health`). Delete uptime checks by the BARE check-id, not the full resource name.

## DISCIPLINE / STANDING DECISIONS (travel in this dispatch)
Isolated worktree off origin/main per repo (do NOT edit shared clone trees). Stage explicit paths. Build+tsc+tests green; PR base main; CI green on HEAD SHA. Do NOT break Cloud Run liveness (Lanes 1+2 — /health status codes are load-bearing for container health; add SEPARATE readiness signals). Deploys PLANNER-OWNED — coordinator delivers PRs + canary probes, hands back; planner merges/deploys/shifts-traffic and applies prod monitoring, re-verifying live (verification never delegated). Do NOT delete/replace existing prod alert policies. Anti-fabrication + no-special-data-access hold. Migration-merged != applied-to-live. Cloud Run traffic-trap (serving != latestReady). No timeframe estimates. Paste raw output when reporting tool/live state.

## AFTER HAND-BACK (planner)
Merge each PR on green (verify HEAD SHA); deploy each service (MCP Cloud Build; cortex-api canary workflow; smartcity-api canary); apply the drafted monitoring config to the dark projects (PowerShell for uptime-check paths); wire alerts to the new readiness/functional signals; re-verify live. Update the ledger with resolved findings.
