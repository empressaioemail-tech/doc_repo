---
id: 2026-06-08_legacy-design-tools_cc-agent-C_cortex_v2_web_first_coverage_gate
date: 2026-06-08
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/v2-reasoning-atom-grounding
pr: 153
status: break-point
---

# Web-first coverage gate removal — Miami keystone unblock

## Problem

`canRunPlanReview()` in `coverageUi.ts` required `coverageStatus === "ready"`, blocking **Run plan review** on Miami Beach engagements with no warmed corpus. v2 `resolveEngineInputs` web-grounds on demand — corpus warmup is informational, not a precondition.

## Fix

| File | Change |
|---|---|
| `artifacts/design-tools/src/lib/coverageUi.ts` | `canRunPlanReview()` → `!!jurisdiction?.trim()` only; added `isCoverageInformational()` |
| `artifacts/design-tools/src/components/engagement-detail/FindingsTab.tsx` | Removed hard-block copy; when jurisdiction present + coverage not ready → informational **web-grounded** note + enabled button; **Request coverage** optional |
| `artifacts/design-tools/src/lib/__tests__/coverageUi.test.ts` | New — gate + informational helpers |
| `artifacts/design-tools/src/pages/__tests__/EngagementDetail.test.tsx` | Miami Beach / `warming` → button enabled, web-grounding note shown |

## Server verification (no change required)

`artifacts/api-server/src/routes/findings.ts` `resolveEngineInputs`:
- Gates on `jurisdictionKey` only (not `coverageStatus`)
- Corpus retrieval warn-and-continue
- `supplementCodeSectionsWithReasoningGrounding()` web-fills gaps for `miami_beach_fl` review targets

Submission create (`POST /engagements/:id/submissions`) has no coverage-status gate.

## Tests

| Command | Result |
|---|---|
| `pnpm run typecheck` | Green |
| `pnpm --filter design-tools test -- coverageUi + EngagementDetail` | Green (incl. new web-grounding test) |

## Commit

| Field | Value |
|---|---|
| SHA | `03fe618870fa47d042370e1eb2e29328c3b715fe` |
| Branch | `cortex/v2-reasoning-atom-grounding` |
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/153 |

Note: v2 reasoning-atom work landed via merged PR #152 (`30c0ec9`). This commit stacks on main.

## CI — GREEN

| Check | Result |
|---|---|
| Typecheck | pass |
| Test | pass |

Run: https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/27213514302

PR held for operator merge.

## Operator acceptance (live)

On engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d` (404 Remodel_B, Miami Beach):
1. Findings tab → **Run plan review** enabled despite non-`ready` coverage
2. Informational note mentions web-grounding
3. Run completes with `reasoning grounding supplemented codeSections` in api-server logs
