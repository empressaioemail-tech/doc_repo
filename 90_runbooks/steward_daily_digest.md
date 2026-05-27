---
id: steward_daily_digest
title: Steward daily digest — maintenance + GTM loops
status: active
last_updated: 2026-05-26
applies_to: portfolio
related: [76a_operator_autonomous_loops, 76_empressa_wedge_90d_operating_plan, 90_runbooks/diagrams/self_healing_loop.mermaid, 90_runbooks/diagrams/gtm_loop.mermaid]
owner: planner
---

# Steward daily digest — maintenance + GTM loops

> **Purpose.** Operator-facing checklist until an automated steward agent ships. Planner (or Nick) runs this **daily** (5 min) and **Friday weekly KPI** (15 min).

## Daily (maintenance loop)

1. **Cloud Run** `cortex-api` latest revision receiving traffic (not pinned stale revision).
2. **Brokerage smoke:** one `POST /api/brokerage/v1/brief` on Bastrop + Cedar Hill pilot addresses (or internal script).
3. **Error scan:** Cloud Logging filter `severity>=ERROR` + `brokerage` last 24h.
4. **Open `_inbox/`** cc-agent-C items; tag triage bin: bug | degradation | friction | opportunity.
5. **Note blockers** for next dispatch.

## Daily (GTM loop)

1. **`GET /api/brokerage/v1/gtm/digest`** (brokerage API key) — event counts last 7 days.
2. **Brief volume:** count `brief_completed` vs `brief_failed`.
3. **Consent:** new `gtm_consent` rows vs extension installs (rough ratio).
4. **Pipeline:** any pilot reply due today ([`71_pipeline.md`](../71_pipeline.md)).

## Friday weekly KPI

| Metric | Source |
|--------|--------|
| Brief success rate | `brief_completed / (completed + failed)` from digest |
| Active install IDs | distinct `install_id` in digest |
| Corpus misses | `corpusStatus=no_match` in brief payloads (sample) |
| Paid pipeline | `71_pipeline` brokerage rows |
| Legal gates | E&O bound Y/N; pilot agreement sent Y/N ([`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md)) |

Escalate to Nick (Tier 3): enterprise meeting, municipal, partnership contract, architecture fork.

## Automated steward (queued)

Replace manual digest with agent reading Cloud Logging + `gtm/digest` + `_inbox/` → single markdown post to `_sessions/` or operator channel.
