---
decision_id: 2026-06-08_miami_beach_plan_review_hybrid_bootstrap
date: 2026-06-08
owner: Nick
status: active
related_canonical: [40i_cortex_dallas_e2e_grok_plan_review_sprint, 56_engine_extraction_sprint, 00_current_state, 73_partnerships]
related_adr: [80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_008_engine_factor_out]
---

## Decision

Enable Miami Beach plan review for a live Hauska investor permit project (5225 Collins Ave, engagement `404 Remodel_B`) via a hybrid bootstrap-then-cutover, not a single ingest:

1. **Bootstrap (now, cc-agent-C, cortex-local).** Get a WHOLE-discipline plan review running today on the existing in-process cortex-api path, independent of the deferred build-out deploy and the gate->engine wiring. Two phases. **P1 grounding:** wire the existing `extractPdfPlainText` into the attached-document upload path so text PDFs (the CHVAC calc) parse; warm cortex-local `code_atoms` for Miami Beach (Municode clientId 3289) and Miami-Dade County (11719) with the Layer-2 content the review needs; seed Layer-1 interim deep-link reference atoms for the FBC/I-Code sections (ungrounded-pending-ICC) and NEC articles (ungrounded-pending-NFPA); prime with the building's prior correction-letter precedent. **P2 vision:** add a server-side PDF-page->PNG render for the uploaded plan set and extend the finding engine to carry per-sheet images, so each discipline's specialist pass reads the actual drawings via a Claude `claude-opus-4-8` high-resolution vision pass (the operator's Revit model is light, so the drawings must be read from the PDF, not from BIM). The two gaps that would otherwise make this a half review — raster drawings and electrical/NEC — are closed: vision reads the drawings, and NEC rides ADR-019's interim deep-link footing against NFPA free access. Dispatch: [`_dispatches/2026-06-08_cc-agent-C_cortex_pdf_planreview_and_miami_beach_bootstrap.md`](../_dispatches/2026-06-08_cc-agent-C_cortex_pdf_planreview_and_miami_beach_bootstrap.md).

2. **Cutover (gated on the ICC meeting this week, cc-agent-E, engine corpus).** Activate ICC Code Connect (creds + spec), build the Layer-1 model-code extractor, and ingest the 2021 I-Code base + Florida amendment overlay + the two FL jurisdictions into the hauska-engine corpus as proper layered atoms. The NEC grounding is a parallel NFPA track (NFPA LiNK / NFPA data license, scoped in `73_partnerships.md`), since the NEC is not on ICC Code Connect; until it lands, electrical stays on the NFPA-free-access interim footing. The already-tracked gate-wiring deploy (ADR-008 / sprint 56) then moves plan review onto the decoupled engine and the corpus rides across the seam unchanged. Dispatch (GATED): [`_dispatches/2026-06-08_cc-agent-E_florida_icc_layer1_and_corpus_ingest_GATED.md`](../_dispatches/2026-06-08_cc-agent-E_florida_icc_layer1_and_corpus_ingest_GATED.md).

**Model split for the bootstrap.** The per-sheet drawing-read uses Claude `claude-opus-4-8` (high-resolution vision), an operator-approved HR-12 escalation: it is the highest-stakes step (the operator's light Revit model means the review stands or falls on reading the PDF drawings), the repo already runs Claude vision for sheet extraction so the multimodal plumbing exists, and Opus high-res materially outreads standard-res on dense MEP sheets. Finding synthesis stays on the Grok fleet default.

The bootstrap is deliberately content-and-config, not bespoke cortex-api logic, so it does not become migration debt: the PDF-parsing capability and jurisdiction registration are durable across the decoupling; only the cortex-local Layer-2 atoms are superseded by the engine corpus at cutover, and those are exactly what the engine re-ingests properly.

## Context

The operator needs a real plan review for a live permit at 5225 Collins Ave to clear it off his plate for a Hauska investor, and needs the work to fit the engine-decoupling-from-Cortex framework rather than fight it. Miami Beach is not in any corpus (the corpus is 100% Texas + federal accessibility). The plan-review pipeline (40i) runs in-process on cortex-api and reads cortex-local `code_atoms` warmed from Municode — it does NOT depend on the gate->engine wiring that is the deferred deploy's linchpin, so a working review is reachable today on that path.

Verification (doc_repo 2026-06-08 probe of both repos against live main): the discipline-decomposition orchestrator and Grok finding engine are built and wired, but uploaded PDFs are stored as blobs and never text-extracted (`sheetContent.ts` extracts only `text/*`); the extractor (`extractPdfPlainText`) exists but is wired only to encumbrances. The ICC Code Connect adapter is built and credential-gated (`unconfigured` until creds), and the Layer-1 model-code extractor it feeds is not yet in the repo. The Municode adapter is production-usable; a StoragePort persistence caveat (in-memory vs Postgres) must be confirmed before the engine-side Florida ingest.

The plan-review need, read against the operator's actual prior correction letters, is building/MEP/life-safety and Miami-Dade county overlay, not zoning/LDR. The high-value, previously-failed items (Miami-Dade Chapter 8 HVAC design, NOA/BORA wind-load, unit-combination county approval, $60/SF valuation, balanced return air, code-edition notes) split between Layer-2 county/city content (Municode, ingestable now) and Layer-1 base provisions (interim now, grounded at ICC).

## Structural commitment check

Pre-mortem run 2026-06-08. Load-bearing three all green: sell-reasoning (findings carry citations + confidence; the Layer-1 interim deep-link footing is the literal expression of selling reasoning not data, with an ungrounded-pending-ICC flag enforced); partnership-first (public Municode code as Cortex product-baseline is the carve-out, the same ruling 40i made for Dallas; the ICC base is the licensed-partnership path, not a scrape; no city locked out of revenue share); cost-per-jurisdiction (cheap Dallas-pattern Layer-2 warmup; the Layer-1 base is the one-time amortized investment ADR-019 books across the catalog, and the 2021 base is already being ingested for Texas, so Florida shares it). One operational yellow on the focus-queue rule (a Florida lane injected mid-decoupling, borrowing cc-agent-C and cc-agent-E), resolved by firing the bootstrap now (independent of the linchpin) and gating the cutover on the ICC meeting so it does not contend with the held engine lift. Overall green.

## Reasoning

The hybrid is not an improvised seam; it maps onto two structures already in the doc set. ADR-019's three-layer substrate with its interim deep-link footing IS the "ground some layers now, reference the rest later" pattern, and 40i's in-process cortex-local review path IS the "use it today without the gate" path. So the bootstrap and the cutover are each a known, low-novelty move. The one genuinely missing capability — parsing the operator's PDFs because the Revit model is light — is a contained wiring of an extractor that already exists, and it is permanent infrastructure that survives the decoupling. Doing the bootstrap on cortex-local content and config keeps it on the right side of the ADR-008 seam: the engine corpus is the durable home, the cortex-local atoms are the throwaway interim, and the cutover is a corpus-content swap rather than a re-architecture.

## Reversal criteria

Reverse the bootstrap-first split if the PDF-extraction wiring or the cortex-local warmup turns out to require cortex-api changes that would be thrown away at the decoupling cutover (i.e. the bootstrap stops being pure content-and-config) — in that case wait for the engine path. Reverse the cutover sequencing if the ICC meeting does not yield a usable Code Connect spec + credentials, in which case Layer 1 stays on the interim deep-link footing indefinitely and the engine-corpus Florida ingest proceeds as Layer-2/3 only with Layer-1 referenced, not grounded. The NEC/electrical gap is not reversible by this decision: NFPA is a separate licensor track (`73_partnerships.md`).

## Dependencies

Bootstrap depends on nothing gated (runs on the current cortex-api). Cutover depends on: the ICC Code Connect spec + creds from the operator's meeting this week; confirmation of the engine Municode StoragePort persistence target; and the already-tracked gate-wiring deploy + consumer cutover ([`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md), the linchpin in [`00_current_state.md`](../00_current_state.md)). The NEC/electrical grounded-coverage gap routes to the NFPA line in [`73_partnerships.md`](../73_partnerships.md).

## Counterparties

Internal. cc-agent-C (legacy-design-tools, bootstrap) and cc-agent-E (hauska-engine, gated cutover). Serves an external Hauska investor's live permit project; no counterparty commitment is made by this decision beyond delivering the review.
