---
id: 2026-06-18_legacy-design-tools_cc-agent-C_gtm_funnel_close
agent: cc-agent-C
repo: legacy-design-tools
date: 2026-06-18
status: deployed-canary
---

# Investor GTM funnel close

## Shipped

| Piece | Location |
|---|---|
| Funnel event catalog (8 types) | `artifacts/api-server/src/lib/gtmInvestorFunnel.ts` |
| Digest readout | `GET /api/brokerage/v1/gtm/digest` → `investorFunnel` |
| Qualified prospects | `GET /api/brokerage/v1/gtm/triage` → `qualifiedProspects` + async Pipedrive lead push |
| Pipedrive person on signup | `artifacts/api-server/src/routes/auth.ts` (simulated when token absent) |
| Smoke script | `scripts/_gtm-investor-funnel-smoke.mjs` |

Event types: `radar_autorun`, `deal_kept`, `deal_passed`, `session_return`, `paywall_hit`, `upgrade_started`, `subscription_active`, `churned`.

## Commits on main

- `3dbba6a3` — funnel lib + digest/triage wiring + Pipedrive signup hook
- `e5690423` — digest test assertion + smoke script

## Deploy

| Field | Value |
|---|---|
| Image | `376725f13614b340e10cdba794919b6ba15feef8` (+ buy-box commits on main; funnel verified on this image) |
| Canary revision | `cortex-api-00203-xef` |
| Canary URL | `https://canary---cortex-api-tds7av26va-uc.a.run.app` |
| Migrations | **None** — 0042 already applied (#192); no new migration in this deploy |

## Live smoke (verbatim)

```
Canary: https://canary---cortex-api-tds7av26va-uc.a.run.app
Install: smoke-funnel-1781787373339
consent 200 true
event radar_autorun 201 ok
event deal_kept 201 ok
event deal_passed 201 ok
event session_return 201 ok
event paywall_hit 201 ok
event upgrade_started 201 ok
event subscription_active 201 ok
event churned 201 ok
digest 200
investorFunnel upgrades { paywall_hit: 5, upgrade_started: 6, subscription_active: 5, churned: 1 }
recorded event types with count>0: brief_completed, brief_started, churned, deal_kept, deal_passed, paywall_hit, radar_autorun, session_return, subscription_active, upgrade_started
PASS — all 8 funnel event types recorded; investorFunnel readout OK
```

Operator: `shift-traffic` when ready (not executed by agent).
