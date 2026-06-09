---
id: 2026-06-09_legacy-design-tools_review-run-plan-tab_pr154
date: 2026-06-09
agent: cursor-agent
repo: legacy-design-tools
branch: cortex/review-run-plan-tab
pr: 154
status: break-point
---

# Review run vs triage + prod real findings deploy

## Deliverables

| Field | Value |
|---|---|
| **Branch** | `cortex/review-run-plan-tab` |
| **SHA** | `35df3f4c49249a473aaf3b9725a17d59750b0c57` (CI fixup on `e4fd35b`) |
| **PR** | https://github.com/empressaioemail-tech/legacy-design-tools/pull/154 |

PR held for operator merge.

## Changes

### Design-tools — Run plan review vs Triage Inbox
- New **Run plan review** tab: plan pick list (Client PDFs + Revit sheets), inline PDF upload, Run CTA with `planSetPieceIds`
- **Triage Inbox** (renamed Findings): triage-only; run controls removed
- API: optional `planSetPieceIds` on `POST .../findings/generate`; server filters plan-set pieces
- Bugfix: infinite re-render loop in `RunPlanReviewTab` plan selection `useEffect`

### Deploy — stop shipping mock findings
- `.github/workflows/cloud-run-deploy.yml` line 204:
  - `AIR_FINDING_LLM_MODE=mock` → `anthropic`
  - `BRIEFING_LLM_MODE=mock` → `anthropic`
  - Added `AIR_FINDING_ORCHESTRATED=1`

Anthropic API key is already a Cloud Run secret; no XAI key on the service.

## Tests

| Check | Result |
|---|---|
| `pnpm run typecheck` | Green |
| PL-02 run vs triage (6 tests) | Green |
| `RunPlanReviewTab.test.tsx` + views + coverageUi | 19/19 green |

## Operator

1. Merge PR #154
2. Accept Review tab UX on live engagement (pick/upload plan → run → triage inbox)
3. Next prod deploy should retain anthropic findings without manual env re-apply
