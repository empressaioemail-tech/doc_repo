---
id: 2026-06-09_legacy-design-tools_review-run-plan-tab_defer-auto-findings
date: 2026-06-09
agent: cursor-agent
repo: legacy-design-tools
branch: cortex/defer-auto-findings
pr: 155
status: break-point
---

# Run plan review — fix double generation (409)

## Problem

Every self-run hit HTTP 409 `finding_generation_already_in_flight` and ignored selected `planSetPieceIds`. Submission create auto-triggered findings (no pieceIds); RunPlanReviewTab then called generate with pieceIds and lost the single-flight race.

## Fix

| Layer | Change |
|---|---|
| OpenAPI / zod | `CreateEngagementSubmissionBody.deferAutoFindings?: boolean` |
| `engagements.ts` | Skip `autoTriggerFindingsOnSubmissionCreated` when flag is true |
| `RunPlanReviewTab.tsx` | Pass `deferAutoFindings: true`; treat 409 as in-progress (poll + navigate to Triage) |
| Tests | API route tests + client unit/integration tests |

Formal Submit to jurisdiction unchanged (auto-trigger still runs when flag omitted).

## Deliverables

| Field | Value |
|---|---|
| **Branch** | `cortex/defer-auto-findings` |
| **SHA** | `36c46e92c84c519241e1e046aa0aa473a1829564` |
| **PR** | https://github.com/empressaioemail-tech/legacy-design-tools/pull/155 |

Note: stacks on merged #154 (`b135dd4`).

PR held for operator merge.

## Tests

| Check | Result |
|---|---|
| `pnpm run typecheck` | Green |
| `RunPlanReviewTab.test.tsx` (4) | Green |
| PL-02 integration (6) | Green |

## Operator acceptance

Fresh engagement → Run plan review → exactly one generation with selected pieces, no 409 error, findings in Triage Inbox.
