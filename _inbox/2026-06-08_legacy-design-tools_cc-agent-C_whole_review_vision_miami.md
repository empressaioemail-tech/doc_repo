---
id: 2026-06-08_legacy-design-tools_cc-agent-C_whole_review_vision_miami
date: 2026-06-08
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/whole-review-vision-miami
dispatch: 2026-06-08_cc-agent-C_cortex_pdf_planreview_and_miami_beach_bootstrap
status: break-point
---

# Break-point report — whole-discipline PDF/vision plan review + Miami Beach bootstrap

## Workspace gate (verbatim)

**Initial state (refused dirty tree):** On `cortex/observability-hub` tracking `origin/main` with unstaged health-monitoring WIP (healthWatch routes, openapi codegen, etc.). Stashed as `cc-agent-C: stash observability-hub WIP before whole-review-vision-miami`. Submodule dirt in `.claude/worktrees/*` remains (untracked content only).

**Clean branch:** `cortex/whole-review-vision-miami` from `3aa33a9` (main HEAD at session start).

```
commit 76c0bcb738bcca761ca7b5b49c6b3fbd40a8a9b4 feat(cortex): Miami Beach whole-review P1 grounding + P2 Opus vision pipeline
```

## Atoms / canonical refs touched

| Ref | Action |
|-----|--------|
| `sprint:40i` | Extended proven warmup + orchestrated finding pattern |
| `adr:019` | Layer-1 interim deep-link atoms (`ungrounded-pending-ICC` / `ungrounded-pending-NFPA`) |
| `current-state:portfolio` | Miami Beach investor permit lane (5225 Collins / 404 Remodel_B) |
| `01a_atom_conventions` | `platform-internal` tagging on warmed + interim atoms |

## Model (HR-12)

- **Agentic work + finding synthesis:** Grok Build 0.1 (default fleet; `AIR_FINDING_LLM_MODE=grok`)
- **Per-sheet vision read — operator-approved escalation:** Claude **`claude-opus-4-8`** high-resolution vision
  - Log line emitted by `runDisciplineVisionRead`: `finding vision read: claude-opus-4-8 escalation starting` / `…completed`
  - **No** `temperature`, `top_p`, or `budget_tokens` sent (Opus 4.8 400s on those params)
  - Reuses existing Anthropic multimodal client (`getVisionAnthropicClient` → `createAnthropicClient`)

## PR + SHA

| Item | Value |
|------|-------|
| Branch | `cortex/whole-review-vision-miami` |
| SHA | `76c0bcb738bcca761ca7b5b49c6b3fbd40a8a9b4` |
| PR | **Not created via `gh`** (`gh` unavailable per AGENTS.md). Operator opens: https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/cortex/whole-review-vision-miami |
| Merge | **Held** for operator merge (not merged by agent) |

## P1 — PDF text extraction (before / after)

| State | Behavior |
|-------|----------|
| **Before** | `sheetContent.ts` ~548–555: PDF/image uploads stored operator `note` only; no `extractPdfPlainText` |
| **After** | `buildAttachedDocumentExtractedText()` in `sheetContent.logic.ts` calls `extractPdfPlainText` for `application/pdf`; 25 MB cap; 200k char cap; flags `low_text_extraction` when body < 80 chars |

**Canonical test (CHVAC-style PDF):**

```
Before: extractedText = "" (or operator note only)
After:  "CHVAC calc for 404 Remodel_B\n\nManual J load calculation for 5225 Collins Ave unit 404.\nTotal cooling load: 24,500 BTUH…"
```

Unit tests: `artifacts/api-server/src/routes/__tests__/sheetContentPdfExtract.test.ts` (4 passed).

## P1 — Jurisdiction registration + warmup scaffolding

| Key | Municode clientId | sourceName | Scoped chapters (config) |
|-----|-------------------|------------|--------------------------|
| `miami_beach_fl` | 3289 | `miami_beach_municode` | existing-building, valuation, admin, MEP, fire |
| `miami_dade_fl` | 11719 | `miami_dade_municode` | Ch.8 HVAC, NOA/BORA/wind, unit-combination, demolition |

- `CITY_STATE_TO_KEY`: `miami beach|fl`, `miami-dade county|fl`, `miami dade county|fl`
- Municode adapter: `productNameIncludes`, `targetChapterPatterns` filters
- Operator warmup script: `scripts/warmup-miami-jurisdictions.ps1`

### Warmed atom counts + samples

**Not executed live this session** — requires running api-server against deployment Neon + Municode network. Operator steps:

1. `.\scripts\warmup-miami-jurisdictions.ps1`
2. `node scripts/seed-florida-interim-atoms.mjs` (requires `DATABASE_URL`)

**Interim seed (deterministic, per jurisdiction × 14 defs):**

| Corpus slice | Count per jurisdiction | Sample 1 | Sample 2 |
|--------------|------------------------|----------|----------|
| FBC interim (`ungrounded-pending-ICC`) | 10 | `FBC-M Ch.4` — balanced return air / ventilation | `FBCB 1405.4` — NOA/BORA wind-load |
| NEC interim (`ungrounded-pending-NFPA`) | 4 | `NEC Art. 408` — panelboards/schedules | `NEC Art. 220` — load calculations |
| Municode Layer-2 | TBD after warmup | Miami-Dade Ch.8 HVAC (expected) | Miami Beach FBCEB 601.2 $60/SF valuation (expected) |

## P2 — Vision pipeline (landed in code)

| Step | Implementation |
|------|----------------|
| PDF → PNG | `artifacts/api-server/src/lib/pdfPageRenderer.ts` (puppeteer + pdf-lib page count, `#page=N`, ~2576px viewport) |
| Image gather | `artifacts/api-server/src/lib/planSetVision.ts` — `gatherPlanSetVisionImages`, `expandCandidatesWithPdfPages` |
| Finding input | `GenerateFindingsInput.attachedSheetImages` |
| Orchestrator | Vision read → enrich piece text → Grok synthesis per discipline |
| Vision module | `lib/finding-engine/src/visionSheetRead.ts` |

## Whole review on 404 Remodel_B (`15d1d314-c2fa-42d1-81f9-24eb06d94e3d`)

**Not run end-to-end this session.** Blockers below prevented live verification against engagement 404 Remodel_B.

**Expected run log (when unblocked):**

```
finding generation: plan-set vision images attached { imageCount, expandedPieceCount }
finding vision read: claude-opus-4-8 escalation starting { discipline, sheetCount, model: "claude-opus-4-8" }
finding vision read: claude-opus-4-8 escalation completed { discipline, observationChars, model: "claude-opus-4-8" }
finding generation: orchestrated pass completed { disciplinesRun: [building, mechanical, electrical, plumbing, fire-life-safety, …], pieceCount, deduplicatedCount }
finding generation: engine call starting { mode: "grok", … }
```

**Drawing-derived finding (illustrative — requires live vision pass):**

> *Concern / mechanical:* The M-101 reflected ceiling plan shows a 12×12 return air grille serving the 1,020 CFM supply noted on the CHVAC calc, which appears undersized for balanced return per [[CODE:…FBC-M Ch.4…]] interim reference. The vision read observed RA-1 tag at 12×12 on sheet M-101 while the calc requires 1,020 CFM balanced return.

## Precedent upload (P1.6)

**Not executed** — operator-supplied correction letters (BCR2403412, 421 response, Miami-Dade electrical/mechanical remarks) not present in repo workspace. Requires operator upload to engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d` as `documentType: narrative` via attached-document API once api-server is running.

## Verification artifacts (HR-8)

```
pnpm run typecheck                                    → green
pnpm --filter @workspace/finding-engine test          → 83 passed
pnpm --filter @workspace/api-server test -- sheetContentPdfExtract → 4 passed
pnpm --filter @workspace/codes test -- interimReferenceAtoms     → 3 passed
```

## Blockers (verbatim)

1. **Initial dirty tree** on `cortex/observability-hub` (health-monitoring WIP) — stashed; submodule `.claude/worktrees/*` still shows untracked content (non-blocking).
2. **`pnpm install` / npm registry TLS** — `UNABLE_TO_VERIFY_LEAF_SIGNATURE` on this workstation; could not add `pdf-to-img`; P2 renderer uses **puppeteer** (already in deps) instead. Multi-page PDF raster quality should be validated on a real plan-set PDF.
3. **No live DATABASE_URL / api-server session** — could not warm Municode atoms, seed interim rows, upload precedent PDFs, or run whole review on engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d`.
4. **Precedent PDFs not in workspace** — operator must supply BCR2403412 / 421 response / Miami-Dade remarks for upload.
5. **`gh` CLI unavailable** — PR URL is the GitHub “new PR” link above; operator creates PR manually.
6. **Engagement geocode → jurisdiction key** — 404 Remodel_B must resolve `miami_beach_fl` (and county overlay via briefing/query) for retrieval; confirm engagement `jurisdictionCity`/`jurisdictionState` or address contains `Miami Beach, FL`.

## Next operator steps

1. Open PR from link above; merge when CI green.
2. Set env: `AIR_FINDING_ORCHESTRATED=1`, `AIR_FINDING_LLM_MODE=grok`, `XAI_API_KEY`, Anthropic vars for vision.
3. Run `warmup-miami-jurisdictions.ps1` + `seed-florida-interim-atoms.mjs`.
4. Upload plan set + CHVAC calc + correction letters to engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d`.
5. Re-run plan review; paste live log + drawing-derived finding back into this inbox file.
