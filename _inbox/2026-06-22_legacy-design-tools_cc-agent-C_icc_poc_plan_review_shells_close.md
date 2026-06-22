---
id: 2026-06-22_legacy-design-tools_cc-agent-C_icc_poc_plan_review_shells_close
title: cc-agent-C — ICC PoC plan-review shells (municipal IPMC + B2B IBC)
date: 2026-06-22
agent: cc-agent-C
repo: legacy-design-tools
dispatch: ICC PoC demo — C-2 (the two plan-review surface shells over the formalized module)
status: close
commit: bc5e8264
mirrored_by: planner (cc-agent-C committed to product repo; mirrored to doc_repo by planner)
---

# Close — ICC PoC plan-review shells (C-2)

Landed as commit `bc5e8264` in legacy-design-tools. Two thin surface shells over the formalized `@workspace/finding-engine`, differing only in titles passed and chrome. Runs on cc-agent-E's icc-model-code fixtures via the live gate; no ICC content required.

What landed:
- Municipal (IPMC 2018) and architect/B2B (IBC 2018) shells: `artifacts/api-server/src/lib/iccFindingShell.ts`, `artifacts/plan-review/src/pages/IccFindingShell.tsx`, `iccFindingShellUi.ts`. Thin over `generateFindings`; titles via `parseApplicableIccEditions`.
- Gate-routed retrieval against the `icc-model-code` tenant with the `platform-internal` access tier (cc-agent-E's designated-Administrator gate), through `lib/codes` `briefRetrievalSubstrate.ts` / `retrieval.ts`. Findings route reworked (`routes/findings.ts`, +195) to carry references and usage.
- Formal reference rendered in the UI: `FormalReferenceBlock.tsx` (identifiers + heading + edition, no section bodies — layer-in-between); inline citation chips via `CodeAtomPill.tsx`. `references[]` persisted on finding runs (migration `0045_finding_run_code_references.sql`, `findingRuns.ts`).
- Per-query usage events (`iccRetrievalUsage.ts`) so cc-agent-M's content_usage / pay_per_query views light up with ICC activity, surface dimension per shell.
- OpenAPI + generated zod/react schemas updated (`codeReferenceEntry`, `iccFindingShellId`).

Verification (planner ran, 2026-06-22): `vitest run` — `iccFindingShell.test.ts` 4 passed (api-server), `FormalReferenceBlock.test.tsx` 2 passed (plan-review), `briefRetrievalSubstrate.test.ts` 2 passed (lib/codes).

Note for deploy: new DB migration 0045 — apply to the deployment Neon before the demo (a merged migration is not auto-applied to live Cloud Run Neon).
