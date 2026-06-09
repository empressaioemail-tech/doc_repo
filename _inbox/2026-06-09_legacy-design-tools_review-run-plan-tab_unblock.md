---
id: 2026-06-09_legacy-design-tools_review-run-plan-tab_unblock
date: 2026-06-09
agent: cursor-agent (unblock after cc-agent-C stall)
repo: legacy-design-tools
branch: cortex/review-run-plan-tab
status: break-point
---

# Review run vs triage split — unblocked

## Problem (operator UX)

Running a plan review and triaging findings were crammed into one tab; no discoverable plan pick/upload before starting a review.

## Fix

| Area | Change |
|---|---|
| `engagementViews.ts` | Review default segment → **Run plan review**; Findings renamed **Triage Inbox** |
| `RunPlanReviewTab.tsx` | New tab: plan pick list (Client PDFs + Revit sheets), inline PDF upload, Run plan review CTA |
| `FindingsTab.tsx` | Triage-only; run controls removed from empty state |
| `EngagementDetail.tsx` | Wires `RunPlanReviewTab`; navigates to Triage Inbox after generate starts |
| API / server | `planSetPieceIds` on `POST .../findings/generate`; server filters attached docs + sheet images to selected pieces |
| Tests | PL-02 integration suite + `RunPlanReviewTab.test.tsx` |

## Bug fixed during unblock

`RunPlanReviewTab` `useEffect` for default plan selection returned a **new array from `.filter()` every run**, causing an infinite re-render loop that hung Vitest for 15+ minutes. Fixed by returning `prev` when selection is unchanged.

Test harness fix: pre-seed React Query cache for `listAttachedDocuments` / `getSnapshotSheets` in `renderPage()` so plan pick list renders synchronously.

## Tests

| Command | Result |
|---|---|
| `pnpm run typecheck` | Green |
| `vitest run ... -t "run vs triage"` (6 tests) | Green (~7s) |
| `RunPlanReviewTab.test.tsx` + `engagementViews.test.ts` + `coverageUi.test.ts` | 19/19 green |

## Git state

**Uncommitted** on `cortex/review-run-plan-tab`. Ready for operator review + commit + PR.

## Operator acceptance

1. Open engagement Review view → lands on **Run plan review** tab
2. Pick attached PDF and/or Revit sheet (or upload PDF inline)
3. Click **Run plan review** → submission created + findings generate with selected `planSetPieceIds`
4. Switch to **Triage Inbox** → work findings (no run CTA in triage view)
