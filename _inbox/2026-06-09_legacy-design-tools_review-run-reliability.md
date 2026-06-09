---
id: 2026-06-09_legacy-design-tools_review-run-reliability
date: 2026-06-09
agent: cursor-agent
repo: legacy-design-tools
branch: cortex/review-run-reliability
pr: 156
status: break-point
---

# Run plan review — in-flight UX + stale-run reaper

## Problem

Repeated Run plan review stacked submissions with `finding_runs.state=pending` that never settled after api-server deploy restarts (fire-and-forget worker). Triage Inbox showed jurisdiction `pending` with no way to distinguish an active AI run from an orphaned one.

## Fix

| Layer | Change |
|---|---|
| `findingRunsSweep.ts` | Stale pending rescue (`orphaned-timeout` after 30m); boot sweep + 5m interval; one-time expire all pending on Miami keystone engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d` |
| `findingRunsEngagement.ts` | Engagement in-flight detection; submission list enrichment (latest run state + open finding count) |
| `engagements.ts` | List submissions returns `findingGenerationState`, `findingGenerationError`, `openFindingCount`; 409 `engagement_finding_run_in_progress` on create when `deferAutoFindings` and another run is pending |
| `findings.ts` | 409 on generate when a sibling submission on the same engagement already has a pending run |
| OpenAPI / codegen | `FindingGenerationSummaryState` + enriched `EngagementSubmissionSummary` |
| `RunPlanReviewTab.tsx` | Poll submissions; disable button + "Review in progress…" while any pending; live status pill |
| `FindingsTab` / `SubmissionSelector` | AI run status + open count (separate from jurisdiction status) |

## Deliverables

| Field | Value |
|---|---|
| **Branch** | `cortex/review-run-reliability` |
| **SHA** | `6aed37a` |
| **PR** | https://github.com/empressaioemail-tech/legacy-design-tools/pull/156 |

PR held for operator merge.

## Tests

| Check | Result |
|---|---|
| `pnpm run typecheck` | Green |
| `RunPlanReviewTab.test.tsx` (5) | Green |
| `finding-runs-sweep.test.ts` | Added — requires `DATABASE_URL` (CI) |
| `engagements.test.ts` (enrichment + 409 guard) | Added — requires `DATABASE_URL` (CI) |

## Operator acceptance

1. Start Run plan review → button shows "Review in progress…" and stays disabled until run completes/fails.
2. Second Run on same engagement is blocked (UI + 409 on API).
3. Orphaned pending rows flip to `failed` / `orphaned-timeout` after sweep threshold; Miami keystone pendings expire on next api-server boot.
4. Triage submission picker shows `review running|done|failed` + open finding count, not conflated with jurisdiction pending.
