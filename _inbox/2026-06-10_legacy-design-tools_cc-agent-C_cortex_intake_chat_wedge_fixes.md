---
id: 2026-06-10_legacy-design-tools_cc-agent-C_cortex_intake_chat_wedge_fixes
title: Report — Cortex intake + chat wedge fixes (cc-agent-C)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: report
dispatch: 2026-06-10_cc-agent-C_cortex_intake_chat_wedge_fixes
status: PR-ready — held for operator merge; operator e2e on San Marcos set pending
---

# Cortex intake + chat wedge fixes — cc-agent-C report

## Alien HEAD refusal (main clone)

Per dispatch HR-11, the main `P:\legacy-design-tools` clone was **not** used — it is on an alien branch for B-rewarm.

**Verbatim `git status` (main clone at dispatch time):**

```
On branch codewarm/austin-2024-uplift-rewarm
Your branch is up to date with 'origin/codewarm/austin-2024-uplift-rewarm'.

Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

Untracked files:
	lib/codes/scripts/
	lib/codewarm/scripts/

no changes added to commit
```

**Verbatim `git log -3` (main clone):**

```
5b8df55 feat(codes): Austin 2024 driver slugs + IECC RE/CE chapter paths
3f307ca Merge pull request #163 from empressaioemail-tech/codewarm/driver-section-extraction
77f2a90 fix(codes): fetch section-level HTML for web-code verification
```

Work executed in separate worktree: `P:\ldt-cortex-intake-chat-wedge` on branch `cortex/intake-chat-wedge-fixes` from `origin/main` (`3f307ca`).

## Recon — where each gate/limit lived

### Fix 1 — Chat/attach gated on Revit push

| Layer | Location | Behavior (before) |
|---|---|---|
| **FE chat input** | `artifacts/design-tools/src/components/ClaudeChat.tsx` | `handleSend`, textarea, Send, and Attach all `disabled={!hasSnapshots}`; placeholder `"Send a snapshot from Revit first."` |
| **FE parent** | `artifacts/design-tools/src/pages/EngagementDetail.tsx` | `hasSnapshots = snapshots.length > 0` threaded into `ClaudeChat` |
| **API hard gate** | `artifacts/api-server/src/routes/chat.ts` | `400 no_snapshots` when engagement atom has no snapshot ref — blocked all chat |
| **Prompt** | `lib/codes/src/promptFormatter.ts` | Required `latestSnapshot.receivedAt` — assumed model always present |

Snapshot-specific features (Compare, Dive deeper) correctly remain snapshot-gated.

### Fix 2 — Single-file attachment picker

| Layer | Location | Behavior (before) |
|---|---|---|
| **FE picker** | `ClaudeChat.tsx` | Hidden `<input type="file">` without `multiple`; `handleFileSelected` took `files?.[0]` only |
| **FE store** | `artifacts/design-tools/src/store/engagements.ts` | `uploadAttachedDocument(engagementId, file)` — one file per call |

Server upload route already accepts one file per POST (unchanged); client now fans out multi-select into sequential POSTs under one uploading flag.

### Fix 3 — Images not read in chat-attachment path

| Layer | Location | Behavior (before) |
|---|---|---|
| **Upload extract** | `artifacts/api-server/src/routes/sheetContent.logic.ts` | PDF text via `extractPdfPlainText`; images produced empty `extractedText` |
| **Upload log** | `sheetContent.ts` | Logged `low_text_extraction — P2 vision pass recommended` but never ran vision |
| **Existing vision (reuse)** | `lib/finding-engine/src/visionSheetRead.ts` + `artifacts/api-server/src/lib/findingLlmClient.ts` (`getVisionAnthropicClient`) + `planSetVision.ts` | Opus 4.8 multimodal read for findings/plan-set only |
| **Chat read** | `chatAgentTools.ts` `read_attached_document` | Returned `extractedText` only — no vision, no verification state |

Sheet vision for chat (`referencedSheetIds` → `buildChatPrompt` image blocks) was a separate path and unchanged.

## Fixes delivered

### 1. Decouple chat + attach from Revit (geometry enriches, never gates)

- **FE:** Chat Send, textarea, and Attach enabled without snapshots; placeholder → `"Upload plans or ask a question"`. Compare / Dive deeper still require snapshots.
- **API:** Removed blanket `400 no_snapshots` on chat. Snapshot focus (`snapshotFocus`, `snapshotFocusIds`, inline focus refs) still returns `400 no_snapshots` when no model exists.
- **Prompt:** `buildChatPrompt` accepts `latestSnapshot: null`; system prompt directs `list_attached_documents` / `read_attached_document` for web-first grounding.

### 2. Multi-attachment select

- **FE:** `multiple` on file input; `uploadAttachedDocuments(engagementId, files[])` in store; sequential upload with single uploading indicator.

### 3. Wire Opus 4.8 vision into chat-attachment read

- **New:** `artifacts/api-server/src/lib/attachedDocumentVision.ts` — reuses `runDisciplineVisionRead` (claude-opus-4-8) for `image/*` and low-text PDFs at upload time.
- **Upload path:** `sheetContent.ts` calls `enrichExtractedTextWithVision` after text extraction.
- **Quality gate:** Extracted text prefixed with `[source: vision-read claude-opus-4-8]` and `[verification: unverified-model-read — …]`; `read_attached_document` exposes `verificationState`.
- Vision failure is non-fatal (text-only extraction stored).

## Verification artifacts (HR-8)

### Local CI proxy

| Check | Result |
|---|---|
| `pnpm run typecheck` | **PASS** (full workspace, per-artifact `tsc --noEmit`) |
| `lib/codes` `promptFormatter.test.ts` — web-first no-snapshot framing | **PASS** |
| `artifacts/design-tools` `ClaudeChat.test.tsx` (25 tests) | **PASS** |
| `artifacts/api-server` `attachedDocumentVision.test.ts` (2 tests) | **PASS** |
| `artifacts/api-server` `chat.test.ts` — no-snapshot happy path + focus rejection | **Written; requires `DATABASE_URL` test harness to execute** |

### Operator e2e (San Marcos 5-image plan set) — **PENDING**

No `.env.local` / San Marcos image fixtures available in the worktree agent session. Operator should verify on the live customer bid:

1. Create engagement with **zero** Revit geometry.
2. Attach **5 plan images** in one picker action (pre-Revit).
3. Chat: ask sheet-specific question (dimensions, room count, sheet title).
4. Confirm agent calls `read_attached_document` and cites vision-extracted content with unverified-model-read framing.
5. Push Revit snapshot later — confirm chat still works and snapshot enriches (does not replace) document grounding.

## PR + SHA

| Item | Value |
|---|---|
| **Branch** | `cortex/intake-chat-wedge-fixes` |
| **SHA** | `74b74e1cd6f7d13b19638d8f3c467e73e49b1cc4` |
| **PR** | https://github.com/empressaioemail-tech/legacy-design-tools/pull/165 |
| **Merge** | **Held for operator** per dispatch |

## Blockers (verbatim)

None for code/CI proxy. **Operator e2e** on San Marcos image set not run in-agent (missing local env + plan set assets). GitHub Actions CI on PR #165 not yet observed in-agent — operator should confirm green before merge.

## Model / escalation

- **Model:** Grok Build 0.1 — no Claude escalation required (typecheck + targeted unit tests green on first pass).
