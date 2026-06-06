---
id: 2026-06-01_cc-agent-M_bastrop_platform_health_check
title: Dispatch — Bastrop platform-wide health check (read-only recon)
date: 2026-06-01
agent: cc-agent-M
repo: smartcity-os
kind: dispatch
status: complete
related: [31a_bastrop_maintenance_sprint, 30a_smartcity_stabilization_sprint, 2026-06-01_cc-agent-M_bastrop_platform_health_check_close]
---

# Bastrop platform-wide health check — COMPLETE

You are **cc-agent-M**, owner of `empressaioemail-tech/smartcity-os`.

**Run type:** Read-only recon + live smoke. No code changes.

## Outcome

**Platform grade: YELLOW.** Report landed; planner filed
[`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md).

| Artifact | Value |
|----------|-------|
| Report | `_research/bastrop_platform_health_check_2026-06-01.md` |
| Branch | `recon/bastrop-platform-health-check` |
| Commit | `3bc4eb8` docs(research): Bastrop platform health check (read-only recon) |
| Inbox close | [`_inbox/2026-06-01_smartcity-os_cc-agent-M_bastrop_platform_health_check_close.md`](../_inbox/2026-06-01_smartcity-os_cc-agent-M_bastrop_platform_health_check_close.md) |

## Prior audits folded (no re-audit)

| Audit | Commit | Scope |
|-------|--------|-------|
| Prophecy integration | `2478a4e` | Embed blocked; vendor hold |
| Compass feedback | `1a9d0c9` | Capture yes; review UI no |

## Highest-signal findings

| Area | Verdict | Key evidence |
|------|---------|--------------|
| Deploy | Yellow | `00104-taw` @ 100%; 7 stale traffic tags; `--source` deploy |
| API health | Green | `{"status":"ok","db":"connected"}` |
| Calendar | Green | Public Municode feed; last scrape OK |
| MyGov | Green | 502 permits; 82 overdue WOs |
| Sync gap | Yellow | `syncFailureNames: ["wo_manager_export"]` |
| Compass | Yellow | Works; feedback partial; thread-health cron off in prod |
| Thread-health cron | Red in prod | `cache-refresh-cron.ts:1196-1198` disables node-cron on Cloud Run |
| Prophecy | Red | Vendor hold |
| Verkada / ESRI | Red | Missing from Cloud Run env (unchanged since May 11) |
| Security | Yellow | Public `GET /api/feedback`; `.replit` plaintext secrets |
| Tests | Green | vitest 103/103 |

## Sprint backlog filed

Planner extracted Phase 0–3 into [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md).

**Next cc-agent-M dispatch:** Phase 1 quick wins (P1-1, P1-2, P1-5, P1-6, P1-7)
when operator greenlights maintenance sprint.

## Acceptance criteria — met

- [x] Status claims cite file:line, verbatim output, or prior audits
- [x] No code changes
- [x] Branch `recon/bastrop-platform-health-check`
- [x] Report at `_research/bastrop_platform_health_check_2026-06-01.md`
- [x] `git log -1 --oneline` → `3bc4eb8`
