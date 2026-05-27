---
id: 2026-05-26_cc-agent-C_gtm_observation_layer
title: Dispatch — GTM observation layer (merge + deploy 0028)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/gtm-observation-layer
status: partial_land_in_planner_session
depends_on: PR #128 merged
---

# GTM observation layer — deploy and fixture

## Landed in planner session (2026-05-26)

- Migration `lib/db/drizzle/0028_gtm_observation_layer.sql`
- Drizzle schema `gtm_events`, `gtm_consent`
- Routes `POST/GET /api/brokerage/v1/gtm/consent`, `POST /events`, `GET /digest`
- `recordGtmEvent` on `/brief` and `/research/chat` when `X-Hauska-Install-Id` present
- Tests `artifacts/api-server/src/__tests__/brokerageGtm.test.ts`

## Operator / cc-agent-C remaining

1. Open PR from branch with above files; run CI.
2. Apply migration 0028 on cortex-prod (`run-migrations` or Cloud Shell).
3. Refresh `lib/db/src/__tests__/__fixtures__/schema.sql.template` per `lib/db/scripts/refresh-schema-fixture.sh` (so integration tests pick up tables without per-file SQL).
4. Deploy cortex-api; smoke:
   - `POST /api/brokerage/v1/gtm/consent` with install UUID
   - `GET /api/brokerage/v1/gtm/digest` with brokerage key
5. **Parcel layers** (separate dispatch): [`2026-05-26_cc-agent-C_brokerage_site_context_layers.md`](2026-05-26_cc-agent-C_brokerage_site_context_layers.md)

## Extension (operator)

`P:\hauska-brief-extension` v0.4.3: consent UI in options, `gtm-client.js`, events on brief lifecycle. Reload unpacked; accept terms; set `briefApiUrl` + `hauskaKey`.

## Acceptance

- Migration 0028 applied on prod
- Extension consent + brief emits events visible in `/gtm/digest`
- Steward runbook: [`90_runbooks/steward_daily_digest.md`](../90_runbooks/steward_daily_digest.md)
