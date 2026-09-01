# P-85 continuation scratch (2026-09-01)

## GROUND-TRUTH 2026-09-01T02:35Z
- Operator rulings: _decisions/2026-09-01_owner_policy_and_portal_access_rulings.md (doc_repo 9d21157)
- Portal: INTERNALLY ruled; 14 digit-BLOCK re-runs permitted (48021:34161, 34753, 35481); 7 letter-only held (parser card)
- Owner: Option B + backfill authorized separately; not privacy remediation — protects paid bulk convenience
- FIX-57P01 monitor 28c433c9 owns hzkqk final grade — this lane does not double-poll

## SEQUENCING
1. UA removal (change 2) before 14 re-runs
2. robots.txt + throttle
3. Deploy worker
4. Re-run 14 jobs — STOP on 403/WAF/rate-limit
5. Owner forward fix + backfill script (parallel subagent)

## GROUND-TRUTH 2026-09-01T02:45Z
- Portal subagent deliverables verified: 82/82 worker tests; UA honest; robots.txt on scopeSearched; throttle 2s; portal-access-blocked fail-closed
- **BLOCK parser gap fixed in-session:** audit CURRENT_BLOCK_PATTERN was not in searchQueryPlan.ts — would have null-block re-runs; landed + 3 tests
- Accidental 632-line tylerSelfServiceSearch uncommitted diff restored (not portal scope)
- Owner Option B: 55/55 scoped tests; backfill script dry-run only
- Deploy target: **DONE** — `records-request-worker-00018-65w` @100%, digest `sha256:7af094251db9`, tag **p85-v18** (Cloud Build `6833d83c`)
- Rerun script: LDT `scripts/p85/rerun-digit-block-jobs.mjs` — needs `DATABASE_URL` + `--apply`
- **Re-runs DONE 2026-09-01T02:55Z:** 3/3 jobs `needs-human` / `search-ui-not-found` — STOP condition NOT triggered; robots.txt logged `Disallow: /`; blocks 13/27/49 in payload. UI selector card follows.

## OPEN
- Superseded mission_williamson_run.md — do not second lane on 48491
- PowerShell --args trap: 90_runbooks/factory_cloud_job_execute.md (cmd.exe workaround)
