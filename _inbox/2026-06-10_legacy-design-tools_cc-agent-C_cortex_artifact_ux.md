---
id: 2026-06-10_legacy-design-tools_cc-agent-C_cortex_artifact_ux
title: Report — Cortex artifact UX (cc-agent-C)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: report
dispatch: 2026-06-10_cc-agent-C_cortex_artifact_ux
status: MERGED — operator e2e on San Marcos letter pending
related_pr_wedge: https://github.com/empressaioemail-tech/legacy-design-tools/pull/165
---

# Cortex artifact UX — cc-agent-C report

## Alien HEAD refusal (main clone)

Main `P:\legacy-design-tools` was **not** used — alien branch for B-rewarm/codewarm.

**Verbatim `git status` (main clone):**

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

Work executed in separate worktree: `P:\ldt-cortex-artifact-ux` on branch `cortex/artifact-ux` from `origin/main` (`2b6b41d`). Fired after wedge-fixes PR #165 (not merged to main at branch time; no file overlap with wedge chat attach path).

## Recon — where each gap lived

### Fix 1 — Auto-navigate to artifact on creation

| Layer | Location | Behavior (before) |
|---|---|---|
| **Tool write** | `chatAgentTools.ts` `handleGenerateDeliverableLetter` | DB insert + L-surface event only; `resultText` said "open Review → Letters" — no SSE nav |
| **SSE contract** | `AgentSideEffect` | Only `agent_action` + `agent_draft` — no artifact navigation event |
| **FE store** | `engagements.ts` SSE parser | No handler for artifact-created nav |
| **Center pane** | `EngagementDetail.tsx` | `agent_draft` → product-specs; `agent_action` → response-tasks; letters manual tab only |
| **Chat UI** | `ClaudeChat.tsx` | Tool label only; no Open affordance |

### Fix 2 — Letter as document + scroll

| Layer | Location | Behavior (before) |
|---|---|---|
| **Letter UI** | `DeliverableLettersTab.tsx` `LetterDetail` | Only `SectionCard` stack (textarea + kind dropdown + Save section) |
| **Scroll** | Detail pane wrapper | `flex: 1` without `overflow-y: auto` / `minHeight: 0` — long letters clipped |
| **Default view** | N/A | Editor was the only view |

### Fix 3 — Download + Print

| Layer | Location | Behavior (before) |
|---|---|---|
| **L6 render** | `RenderSection` + `letterRender.ts` | Async DOCX/PDF render job — separate from read view |
| **Briefing pattern** | `briefingPdf.ts` + `parcelBriefings.ts` `export.pdf` | Puppeteer HTML→PDF; not wired to deliverable letters |
| **Quality gate** | Letter section `content` | Disclaimers live in section text — export had no dedicated path |

## Fixes delivered

### 1. Auto-navigate center pane on artifact creation

- **API:** New `agent_artifact` SSE side-effect with `{ tab, entityType, entityId, label }`.
  - `generate_deliverable_letter` → `tab: deliverable-letters`
  - `generate_presentation_packet` → `tab: packages`
- **Store:** `artifactNavByEngagement`, `applyArtifactNav()`, SSE handler for `agent_artifact`.
- **EngagementDetail:** Effect auto-lands when chat turn completes; manual `applyArtifactNav` works during streaming; invalidates letter list on letter nav; `focusLetterId` passed to tab.
- **ClaudeChat:** Prominent **Open {label} →** banner when nav pending.

### 2. Letter document view (default) + Edit toggle + scroll

- **`LetterDocumentPreview`:** Continuous business-letter layout (Times, justified body, section order cover→intro→responses→signature).
- **Default `viewMode: read`**; **Edit** toggles existing `SectionCard` editor with full provenance controls.
- **Scroll:** Detail column `overflow-y: auto` + `sc-scroll`; flex column `minHeight: 0`.
- Compact provenance footnotes in read view; full provenance in edit view.

### 3. Download PDF + Print (briefing pattern)

- **`deliverableLetterHtml.ts`** — pure HTML renderer (testable without Chromium).
- **`deliverableLetterPdf.ts`** — Puppeteer `page.pdf()` adapter (mirrors `briefingPdf.ts`).
- **Routes:** `GET /api/deliverable-letters/:letterId/export.pdf` (+ `?download=1`), `GET .../preview.html` for print.
- **FE:** Download PDF link + Print (opens preview.html → `window.print()`).
- Export preserves section text verbatim (including unverified-jurisdiction disclaimers) + provenance footnotes + export meta quality-gate note.

## Verification artifacts (HR-8)

| Check | Result |
|---|---|
| `pnpm run typecheck` | **PASS** (full workspace) |
| `DeliverableLettersTab.test.tsx` | **PASS** (11/11) — includes document default + export URL |
| `deliverableLetterHtml.test.ts` | **PASS** — section order + disclaimer preservation |

### Operator e2e (San Marcos triplex letter) — **PENDING**

No live dev session with operator letter in-agent. Operator checklist:

1. Chat: `generate_deliverable_letter` for San Marcos Pre-Bid analysis.
2. Confirm auto-nav to Review → Letters with letter selected (or click **Open … →**).
3. Confirm **Document** view shows continuous letter with jurisdiction caveat intact.
4. Scroll long letter — pane scrolls.
5. **Download PDF** — disclaimer present in PDF.
6. **Print** — preview layout matches document view.

## PR + SHA

| Item | Value |
|---|---|
| **Branch** | `cortex/artifact-ux` |
| **SHA** | `294c5d2dfd96a620a9e5169fc4fa3dc2ba87fd02` |
| **PR** | https://github.com/empressaioemail-tech/legacy-design-tools/pull/166 |
| **Paired wedge PR** | https://github.com/empressaioemail-tech/legacy-design-tools/pull/165 |
| **Merge** | **MERGED** — see Operator merge close below |

## Blockers (verbatim)

None for code/CI proxy. Operator e2e on live San Marcos letter not run in-agent.

## Model / escalation

- **Model:** Grok Build 0.1 — no Claude escalation required.

---

## Operator merge close (2026-06-10)

PR #166 merged by operator. Artifact UX is on `main`.

### Merge record

| Field | Value |
|---|---|
| **PR** | https://github.com/empressaioemail-tech/legacy-design-tools/pull/166 |
| **Branch (source)** | `cortex/artifact-ux` |
| **Merge commit on `main`** | `bf90e85ff10b1e56ba4d814bf5796a5531d9d9de` |
| **Merged at** | 2026-06-10T18:12:49Z |

### CI (pre-merge, green)

| Check | Run | Result |
|---|---|---|
| Typecheck + Test | https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/27293901181 | **PASS** (6m3s) |

Fixup commit on branch: `cec1b48` — stub `artifactNavByEngagement` / `applyArtifactNav` in engagement + chat test mocks (58 design-tools tests green).

### Post-merge deploy

Cloud Run deploy workflow triggered on `main` push at merge (run in flight at report time).

### Operator e2e — still pending

San Marcos triplex letter checklist from §Verification artifacts remains unrun in-agent.
