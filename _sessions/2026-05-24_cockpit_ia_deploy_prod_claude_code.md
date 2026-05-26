---
id: 2026_05_24_cockpit_ia_deploy_prod
title: Cockpit IA (#114) prod deploy and backend wiring game plan
status: active
last_updated: 2026-05-24
agent: planner
repo: doc_repo
type: session
related: [40g_cortex_cockpit_backend_wiring_sprint, 43_cortex_qa_backlog, 90_runbooks/cloud_run_canary_deploy, _decisions/2026-05-23_epa_calepa_mirror_opt_in]
---

# Session — Cockpit IA prod deploy + next sprint framing

**Date:** 2026-05-24  
**Agent:** doc_repo planner (synthesis from operator Cloud Shell session + `_inbox/` courier drops)

## Outcome

PR **#114** (*Cockpit IA consolidation, packages platform, chrome themes*) is **live on production Cloud Run** at 100% traffic on revision **`cortex-api-00045-pas`** (image digest `sha256:09ffeb1d…`, merge SHA **`c8d7fce`**). Operator confirmed Cockpit UI on prod. Migration **`0018_engagement_packages.sql`** applied. Canary race on first deploy (`00044` with pre-merge `:latest`) diagnosed and corrected.

## Deploy record

| Step | Result |
|------|--------|
| Merge #114 → `c8d7fce` | Done 2026-05-24 |
| `build-and-push` on push | Finished ~23:05:49 UTC (after mistaken canary at 23:05:03) |
| `deploy-canary` (stale) | `cortex-api-00044-teg` — old image |
| Redeploy `image_tag=c8d7fce` | `cortex-api-00045-pas` |
| `run-migrations` | `0018_engagement_packages.sql` applied |
| Traffic | `gcloud run services update-traffic --to-revisions=cortex-api-00045-pas=100` (workflow lacked `shift-traffic` on operator's run; manual gcloud used) |

**URLs:** prod `https://cortex-api-tds7av26va-uc.a.run.app/` · pilot engagement `977b5469-4b26-4bd0-895e-71ec752b7409` (Musgrave_Residence_B)

**Lesson:** After merge to `main`, wait for **Build & push image** to complete, then `deploy-canary` with **`image_tag=<full-sha>`**, not blind `latest` within ~5 minutes of merge.

## Parallel work split (operator decision 2026-05-24)

| Track | Owner | Goal |
|-------|--------|------|
| **Backend wiring** | cc-agent-C (legacy-design-tools) | OpenAPI/codegen, server persist for publisher intake, share asset hydration, intake PATCH, deploy doc fixes — see [`40g_cortex_cockpit_backend_wiring_sprint.md`](../40g_cortex_cockpit_backend_wiring_sprint.md) |
| **Prod QA** | Nick | §J sign-off in backend checklist; regression §F surfaces |

## Inbox swept

Courier drops filed and removed from `_inbox/`:

- Cockpit deploy handoff → this session + [`40g_cortex_cockpit_backend_wiring_sprint.md`](../40g_cortex_cockpit_backend_wiring_sprint.md)
- Backend checklist → sprint doc §QA matrix
- cc-agent-C2 PR #112, cc-agent-C PR #111, cc-agent-R PR #110 → dedicated `_sessions/` entries

## Next planner actions

1. Fire [`_dispatches/2026-05-24_cc-agent-C_cockpit_backend_wiring.md`](../_dispatches/2026-05-24_cc-agent-C_cockpit_backend_wiring.md) when operator greenlights.
2. Nick runs prod QA checklist; file pass/fail in `40g` §J or a short `_research/` note.
3. Close PR **#113** (superseded mockup graduation draft) if still open.
4. Optional postmortem: deploy race `latest` before build completes.
