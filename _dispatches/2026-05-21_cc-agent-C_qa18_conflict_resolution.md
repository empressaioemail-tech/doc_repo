---
id: 2026-05-21_cc-agent-C_qa18_conflict_resolution
title: Dispatch — cc-agent-C QA-18 PR #62 conflict resolution + CI green
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 2026-05-21_cc-agent-C_cortex_qa_close_out, 2026-05-21_cc-agent-C_qa22_site_context, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-C dispatch — QA-18 PR #62 conflict resolution

You are cc-agent-C owning the `legacy-design-tools` repo. This is the **front of your queue**: it runs before the QA-22 site-context dispatch and before the codex-reviewer-qa scaffold. QA-16 (#59), QA-23 (#60), and QA-19 (#61) from the Cortex QA close-out are merged. QA-18 (PR #62, branch `feat/qa-18-client-document-upload`) did not merge: it is OPEN with `mergeable: CONFLICTING` and `mergeStateStatus: DIRTY`, and it is failing CI.

## Task

Land QA-18. This is conflict resolution and integration repair on an already-reviewed feature, not new feature work.

### 1. Resolve the merge conflicts

Rebase or merge `feat/qa-18-client-document-upload` (PR #62) onto current `main`, which now carries the merged QA-16 (#59), QA-23 (#60), and QA-19 (#61) PRs.

### 2. Fix the CI failure — root cause already diagnosed

Three tests fail in `artifacts/design-tools/src/components/__tests__/CitationChip.test.tsx`, all with `TypeError: Cannot read properties of undefined` at `ClaudeChat.tsx:172` (`attachedDocumentsByEngagement[engagementId]`).

This is a merge-integration artifact, not a bug in either feature:

- QA-18 added **three** slices to the engagements store (`store/engagements.ts:72-74` types, `147-149` inits): `attachedDocumentsByEngagement`, `uploadingDocumentByEngagement`, and `documentUploadErrorByEngagement`, all initialized to `{}`.
- `ClaudeChat.tsx:134-142` reads all three via `useEngagementsStore` selectors and indexes them by `engagementId` at `:172`, `:174`, and `:176` — an undefined selector throws at whichever line comes first.
- QA-23's test `CitationChip.test.tsx` renders `ClaudeChat` against its own `useEngagementsStore` mock (lines 24-40). That mock supplies `agentActionsByEngagement` but none of the three QA-18 slices, so each selector returns `undefined` and `ClaudeChat.tsx:172` throws.

The fix: update the `useEngagementsStore` mock in `CitationChip.test.tsx` to include all three — `attachedDocumentsByEngagement: {}`, `uploadingDocumentByEngagement: {}`, and `documentUploadErrorByEngagement: {}` — mirroring the complete mock already in `ClaudeChat.test.tsx` (the `stores` typedef at lines 18-23, the `vi.mock` selector object at lines 38-40). Adding only two leaves `ClaudeChat.tsx:176` throwing the byte-identical error — same three failures, CI still red. The real store initializes all three to `{}`, so `ClaudeChat.tsx` is correct as written; the QA-23 mock predates QA-18 and is incomplete. Do not paper over it with optional chaining in `ClaudeChat.tsx` — the store cannot legitimately omit the slices, so the mock is the gap, and a null-guard would only hide future incomplete mocks.

### 3. Full CI green

All workspace tests passing (the run that failed reported 3 failed / 320 passed; target is 323/323), typecheck and build clean. Push the updated branch so PR #62 is green for the operator to merge.

## Out of scope

QA-22 site-context ([`2026-05-21_cc-agent-C_qa22_site_context.md`](2026-05-21_cc-agent-C_qa22_site_context.md)) and the codex-reviewer-qa scaffold ([`2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold.md`](2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold.md)) remain your queued dispatches, sequenced after this one. Do not start them here.

## Run posture

Operator-supervised. The operator merges PR #62 once CI is green. Do not self-deploy cortex-api.

## Workspace ownership

cc-agent-C owns the `legacy-design-tools` working tree.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). The `_inbox/` write is the one permitted cross-repo write; do not draft the summary into `legacy-design-tools/_research/`, and do not commit to the doc repo. Keep committing the original in your own repo.
