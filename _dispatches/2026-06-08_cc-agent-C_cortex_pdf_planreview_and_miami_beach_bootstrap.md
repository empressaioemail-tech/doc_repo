---
id: 2026-06-08_cc-agent-C_cortex_pdf_planreview_and_miami_beach_bootstrap
title: Dispatch — whole-discipline PDF/vision plan review + Miami Beach / Miami-Dade warmup on 404 Remodel_B
date: 2026-06-08
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: ready
related: [00_current_state, 40i_cortex_dallas_e2e_grok_plan_review_sprint, 80_adrs/adr_019_layered_code_substrate, _decisions/2026-06-08_miami_beach_plan_review_hybrid_bootstrap, 20_agent_operating_rules, 01a_atom_conventions]
---

# Whole-discipline PDF/vision plan review + Miami Beach / Miami-Dade warmup

> **Fire now. Self-contained, runs on the in-process cortex-api plan-review path; does NOT depend on the deferred build-out deploy or the gate->engine wiring.** Two phases. **P1 (grounding):** register the two Florida jurisdictions, warm cortex-local code_atoms, seed FBC/I-Code and NEC interim reference atoms, parse text PDFs, prime with precedent. **P2 (vision):** render the uploaded plan-set PDF to per-page PNGs and run a Claude Opus high-res vision pass per discipline so the engine reads the actual drawings (the operator's Revit model is light, so PDF is the primary content path). Serves a live Hauska investor permit at 5225 Collins Ave (engagement `404 Remodel_B`, id `15d1d314-c2fa-42d1-81f9-24eb06d94e3d`). Frame + premortem: [`_decisions/2026-06-08_miami_beach_plan_review_hybrid_bootstrap.md`](../_decisions/2026-06-08_miami_beach_plan_review_hybrid_bootstrap.md). The bar is a WHOLE review across every discipline (building, mechanical, electrical, plumbing, fire/life-safety, accessibility) — a half review that skips drawings or electrical is not acceptance.

You are **cc-agent-C**, single owner of the `P:\legacy-design-tools` main clone for this run.

## Model (HR-12)

Default fleet model **Grok Build 0.1** for the agentic work and the finding-synthesis path. **Escalation, operator-approved for this dispatch:** the per-sheet vision read uses **Claude `claude-opus-4-8`** (high-resolution vision) — this is the highest-stakes step and the repo already runs Claude vision for sheet extraction, so reuse that plumbing. Cursor base URL `https://api.x.ai/v1` for Grok; the Anthropic client/secret is already wired in api-server. Log the Claude escalation in your session summary per HR-12.

## Atoms to resolve

Resolve before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `sprint:40i` — Cortex Dallas E2E + Grok plan review; the warmup + finding path you extend
- `adr:019` — layered code substrate; FBC base + NEC are Layer 1 interim deep-link footing, county/city are Layer 2

## Read first (after atoms)

1. [`40i_cortex_dallas_e2e_grok_plan_review_sprint.md`](../40i_cortex_dallas_e2e_grok_plan_review_sprint.md) — the proven warmup + finding pattern
2. [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md) — interim deep-link footing for model-code base (ICC) and, by the same logic, the NEC (NFPA free access)
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools` (main clone)
- Branch prefix: `cortex/` (suggest `cortex/whole-review-vision-miami`)
- One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`.

## Verified facts (source: doc_repo 2026-06-08 probe of legacy-design-tools @ main)

- Discipline-decomposition orchestrator BUILT and wired into finding generation: `lib/finding-engine/src/planSet/classifier.ts`, `artifacts/api-server/src/lib/planSetClassification.ts`, migration `lib/db/drizzle/0034_plan_set_decomposition.sql`, orchestrated path `artifacts/api-server/src/routes/findings.ts` (~836-889, flag `AIR_FINDING_ORCHESTRATED`, fires at >=2 pieces). Grok generator present: `lib/finding-engine/src/grokGenerator.ts`.
- **PDF text NOT extracted today:** `sheetContent.ts` (~548-555) extracts only `text/*`; `application/pdf` stores the operator note only. Extractor exists and is reusable: `extractPdfPlainText()` in `lib/codes-sources/src/pdfText.ts` (pdf-parse-fork), currently wired only to `artifacts/api-server/src/lib/encumbranceExtract.ts`.
- **Multimodal plumbing already exists (reuse, do not rebuild):** `artifacts/api-server/src/lib/sheetContentExtractor.ts` already sends sheet PNGs to Claude vision; `lib/codes/src/promptFormatter.ts` defines `PromptContentBlock` with a base64 `image` variant and the chat route (`chat.ts`) already sends sheet images to Claude. The Anthropic client (`lib/integrations-anthropic-ai`) is multimodal-ready. **The finding engine is text-only** — `lib/finding-engine/src/types.ts` `GenerateFindingsInput` has no image field; `grokGenerator.ts`/`anthropicGenerator.ts` send text only.
- **No server-side PDF-page->PNG renderer for uploaded PDFs:** today's `sheets.fullPng` comes from the Revit add-in, not rendered from an uploaded PDF. P2 must add a render step. Stored blob bytes are re-fetchable: `artifacts/api-server/src/lib/objectStorage.ts` `getObjectEntityBytes()`.
- Jurisdiction registry: `lib/codes/src/jurisdictions.ts` (`JURISDICTIONS`, `CITY_STATE_TO_KEY` ~113-126), `sourceRegistry.ts` (~34-81). Existing Municode JSON configs: Bastrop (clientId 1169), Cedar Hill (1568/11825). NO Florida.
- Municode client IDs (re-confirm via the JSON client `getClientByName` at ingest): **Miami Beach 3289**, **Miami-Dade County 11719**.
- Claude `claude-opus-4-8` vision: jpg/png base64 content blocks; high-resolution support up to 2576px on the long edge (render sheets large enough to use it). Full-res images cost ~4.8k tokens each, so render at a sensible DPI and bound sheet count per pass. Opus 4.8 removed `temperature`/`top_p`/`budget_tokens` (sending them 400s) — use adaptive thinking; the existing Anthropic client call shape should be checked against this.

## Scope

### Phase 1 — grounding layer (corpus + interim references + text + precedent)

1. **Wire PDF text extraction into the attached-document upload path.** In `sheetContent.ts`, run `extractPdfPlainText()` on `application/pdf` uploads and persist as `extractedText` (with the operator note). Reuse `lib/codes-sources/src/pdfText.ts`; respect the 200k-char and 25 MB caps. If extraction yields little text (image-only sheet), store what is extractable and mark it (e.g. `low_text_extraction`) — P2's vision pass covers those. Keep `text/*` and the encumbrance path unchanged.
2. **Register the two Florida jurisdictions** in `lib/codes/src/jurisdictions.ts`: `miami_beach_fl` (Municode 3289) and `miami_dade_fl` (11719, product-name filter to the Code of Ordinances). Add `CITY_STATE_TO_KEY` entries and matching `sourceRegistry.ts` rows; tag resulting atoms `platform-internal`.
3. **Warm cortex-local `code_atoms`, scoped to the chapters the review needs** (confirm against the live Municode TOC; do not ingest the whole code): Miami-Dade HVAC design (Chapter 8), NOA/product-approval + BORA wind-load, unit-combination / >160 SF demolition thresholds; Miami Beach existing-building valuation ($60/SF, FBCEB 601.2) + local admin.
4. **Seed Layer-1 interim deep-link reference atoms, flagged `ungrounded-pending-ICC`,** for the FBC/I-Code sections cited: FBC-M601.6, FBC-M Ch.4, FBC-304.11, FBC-M307, FBC EC R103/R403.7.1, FBC E-403.6, FBCB Ch.7/Table 721.1(2), FBCB 1405.4. Section number + one-line reasoning + deep-link (codes.iccsafe.org / floridabuilding.org). No verbatim code text.
5. **Seed NEC interim deep-link reference atoms, flagged `ungrounded-pending-NFPA`,** for the electrical articles the review hits (e.g. NEC Art. 110 general, 210 branch circuits, 220 load calculations, 408 panelboards/schedules — confirm against the operator's electrical correction letter). Deep-link to NFPA free access (`nfpa.org` free-access NEC). This closes the electrical discipline at the same honesty level as the FBC base. NEC grounding (full text) is the NFPA-track upgrade in the cc-agent-E gated dispatch — do NOT claim grounded NEC here.
6. **Prime with precedent.** Upload the operator-supplied correction/response letters for this building (BCR2403412 permit-corrections report, the 421 response letter, the Miami-Dade electrical/mechanical remarks) as attached documents on engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d`, `documentType: narrative`. With step 1 landed they parse and inform the review.

### Phase 2 — vision pipeline (read the actual drawings)

7. **Add a server-side PDF-page->PNG render step** for uploaded plan-set PDFs. Pick a renderer that fits the stack (pdfium / mupdf / pdf-to-img / pdfjs+canvas/sharp); render each page at a resolution that exercises Claude's high-res path (long edge up to ~2576px) without bloating tokens. Persist page PNGs (or render on demand from the re-fetchable blob bytes via `objectStorage.getObjectEntityBytes()`). If a sheet number / discipline is only legible in the rendered image, let the vision pass supply it to the classifier so raster-only sheets still route to the right discipline.
8. **Extend the finding engine to carry per-sheet images.** Add an optional image field to `GenerateFindingsInput` (e.g. `attachedSheetImages: { pieceId, pngBase64 }[]`), thread it through `buildSpecialistInput` in `orchestrator.ts` so each discipline pass gets its sheets, and emit `PromptContentBlock[]` (text + image) when images are present. Reuse the existing `promptFormatter` image-block shape and the Anthropic multimodal client.
9. **Run the per-discipline vision read on `claude-opus-4-8`.** Each discipline's specialist pass reads its classified sheets (high-res) and checks the drawn content against that discipline's retrieved code atoms (Layer-2 grounded + Layer-1/NEC interim) plus the precedent. Keep finding synthesis/formatting on the Grok path; the Claude pass is the sheet-reading + check step. Findings carry `[[CODE:...]]` citations, confidence, and the ungrounded caveat where the cited atom is interim. Do NOT send `temperature`/`top_p`/`budget_tokens` to Opus 4.8.
10. **Run the whole review on `404 Remodel_B`** with the operator's plan set + CHVAC calc uploaded. Confirm: engagement resolves `coverageStatus: ready`; orchestrated discipline passes fire (>=2 pieces); findings exist for building, mechanical, electrical, plumbing, fire/life-safety; the vision pass demonstrably reads drawing content (cite a finding that could only come from reading a sheet, e.g. a return-air/panel-schedule observation); spot-check 2-3 findings trace to warmed atoms.

**Out of scope:**

- Any change to the hauska-engine corpus, retrieval-api, or the gate (that is the cc-agent-E cutover dispatch).
- The deferred build-out deploy / gate->engine wiring (this runs on the current in-process path).
- Full-code ingest of either jurisdiction (scope to the chapters in P1.3).
- Grounded (full-text) FBC/I-Code or NEC citations — those land via ICC (cc-agent-E) and the NFPA track respectively; here they are interim deep-link references with the honest caveat.

## Acceptance criteria

- **Whole review demonstrated on `404 Remodel_B`:** findings produced for building, mechanical, electrical, plumbing, and fire/life-safety; the run reads the actual drawing sheets (paste a finding that depends on reading a sheet, e.g. return-air sizing or a panel-schedule/riser observation), logs the orchestrated discipline passes firing, and uses `claude-opus-4-8` for the vision read (verbatim log line).
- PDF upload produces non-empty `extractedText` for a text-bearing PDF (the CHVAC calc is the canonical test); before/after length pasted.
- Both `miami_beach_fl` and `miami_dade_fl` warm to atom count > 0; the operator-cited items (balanced return air, Miami-Dade HVAC Chapter 8, unit-combination county approval, $60/SF valuation, NEC panel-schedule/load-calc requirement) are retrievable. Counts + 2 samples per key.
- FBC interim atoms carry `ungrounded-pending-ICC`; NEC interim atoms carry `ungrounded-pending-NFPA`; no finding asserts a grounded citation it does not have. All findings carry source + confidence + timestamp (quality-gate rule).
- Typecheck green; existing tests green; new tests cover PDF-text wiring and the image-carrying finding input.
- PR(s) held for operator merge (do not merge); branches + SHAs reported. Verbatim verification artifacts (HR-8).

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-08_legacy-design-tools_cc-agent-C_whole_review_vision_miami.md`. Include atom refs touched, model used (note the Claude `claude-opus-4-8` escalation for vision), PR URL(s) + branch SHA(s), the PDF-extraction before/after, the warmed atom counts + samples, the whole-review run log + a drawing-derived finding sample, and blockers verbatim.
