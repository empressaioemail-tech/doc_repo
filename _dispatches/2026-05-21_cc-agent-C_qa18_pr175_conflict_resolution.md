---
id: 2026-05-21_cc-agent-C_qa18_pr175_conflict_resolution
title: Dispatch — cc-agent-C QA-18 PR #175 conflict resolution + CI green
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 2026-05-21_cc-agent-C_cortex_qa_close_out, 2026-05-21_cc-agent-C_qa22_site_context, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-C dispatch — QA-18 PR #175 conflict resolution

You are cc-agent-C owning the `legacy-design-tools` repo. This is the **front of your queue**: it runs before the QA-22 site-context dispatch and before the codex-reviewer-qa scaffold. QA-16, QA-19, and QA-23 from the Cortex QA close-out are merged. QA-18 (PR #175, branch `feat/qa-18-client-document-upload`) did not merge: it has conflicts with `main` and is failing CI.

## Task

Land QA-18. This is conflict resolution and integration repair on an already-reviewed feature, not new feature work.

### 1. Resolve the merge conflicts

Rebase or merge `feat/qa-18-client-document-upload` (PR #175) onto current `main`, which now carries the merged QA-16, QA-19, and QA-23 PRs.

### 2. Fix the CI failure — root cause already diagnosed

Three tests fail in `artifacts/design-tools/src/components/__tests__/CitationChip.test.tsx`, all with `TypeError: Cannot read properties of undefined` at `ClaudeChat.tsx:172` (`attachedDocumentsByEngagement[engagementId]`).

This is a merge-integration artifact, not a bug in either feature:

- QA-18 added two slices to the engagements store (`store/engagements.ts:72-73`, `147-148`): `attachedDocumentsByEngagement` and `uploadingDocumentByEngagement`, both initialized to `{}`.
- `ClaudeChat.tsx:134-138` reads them via `useEngagementsStore` selectors.
- QA-23's test `CitationChip.test.tsx` renders `ClaudeChat` against its own `useEngagementsStore` mock. That mock (around line 30) supplies `agentActionsByEngagement` but not the two QA-18 slices, so both selectors return `undefined` and `ClaudeChat.tsx:172` throws.

The fix: update the `useEngagementsStore` mock in `CitationChip.test.tsx` to include `attachedDocumentsByEngagement: {}` and `uploadingDocumentByEngagement: {}`, mirroring the complete mock already in `ClaudeChat.test.tsx:18-26`. The real store initializes all three slices to `{}`, so `ClaudeChat.tsx` is correct as written; the QA-23 test mock simply predates QA-18 and is now incomplete. Do not paper over it with optional chaining in `ClaudeChat.tsx` — the store cannot legitimately omit the slice, so the mock is the gap, and a null-guard would only hide future incomplete mocks.

### 3. Full CI green

All workspace tests passing (the run that failed reported 3 failed / 320 passed; target is 323/323), typecheck and build clean. Push the updated branch so PR #175 is green for the operator to merge.

## Out of scope

QA-22 site-context ([`2026-05-21_cc-agent-C_qa22_site_context.md`](2026-05-21_cc-agent-C_qa22_site_context.md)) and the codex-reviewer-qa scaffold ([`2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold.md`](2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold.md)) remain your queued dispatches, sequenced after this one. Do not start them here.

## Run posture

Operator-supervised. The operator merges PR #175 once CI is green. Do not self-deploy cortex-api.

## Workspace ownership

cc-agent-C owns the `legacy-design-tools` working tree.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). The `_inbox/` write is the one permitted cross-repo write; do not draft the summary into `legacy-design-tools/_research/`, and do not commit to the doc repo. Keep committing the original in your own repo.
