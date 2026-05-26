---
id: 2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v2_close
title: Close — Jurisdiction surfacing v2 (engagement coverage)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: fix/jurisdiction-surfacing-v1.5-v3
---

# v2 close — engagement coverage

## Delivered

- Migration `lib/db/drizzle/0021_engagement_coverage.sql`: `substrate_jurisdiction_key`, `cortex_jurisdiction_key`, `coverage_status`, `coverage_requested_at` on `engagements`; `coverage_requests` table.
- `lib/coverage/resolveEngagementCoverage.ts` + unit tests.
- Recompute after geocode on engagement PATCH/POST (`engagementCoverage.ts`).
- `POST /api/engagements/:id/request-coverage` (202, 24h idempotency).
- Engagement list/detail wire includes coverage fields.
- Site tab: coverage banner + **Request coverage** when `not_in_catalog` | `substrate_only`.
- Findings: self-run gated on `coverageStatus === ready` (QA-49).
- Chat: prefers persisted `coverageStatus` for QA-23 guardrail.
- Engagement atom typed payload includes coverage fields.

## QA-20 — cc-agent-E contract (not implemented here)

Poll `coverage_requests` where `status = 'open'`. For each row, best-effort background code collection per `49_code_ingestion_pipeline` / Lane E when ICC unblocks. Mark `processed` or `failed`. No Cortex UI in E scope.

```sql
-- Minimal queue contract
SELECT id, engagement_id, jurisdiction_state, jurisdiction_city, jurisdiction_fips, note, status, created_at
FROM coverage_requests
WHERE status = 'open'
ORDER BY created_at ASC;
```

On success: `UPDATE coverage_requests SET status = 'processed' WHERE id = ?`.
On failure: `UPDATE coverage_requests SET status = 'failed' WHERE id = ?`.

## Operator QA

- Dallas (Regrid): geocode → honest `coverageStatus` (ready or substrate_only per warmup).
- Pagosa-style uningested address: `not_in_catalog`; chat must not fabricate IRC citations; Request coverage sets `coverage_requested_at`.

## Status enum (user-facing)

| Status | User sees |
|--------|-----------|
| unknown | No geocode yet |
| not_in_catalog | Geocoded, nothing on Hauska or cortex warmup |
| substrate_only | On MCP catalog, cortex not warmed |
| warming | Warmup in flight |
| ready | Atoms available |
