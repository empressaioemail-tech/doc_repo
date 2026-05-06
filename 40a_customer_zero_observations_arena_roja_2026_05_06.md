---
id: 40a_customer_zero_observations_arena_roja_2026_05_06
title: Design Accelerator customer-zero observations — Arena Roja R1 plan review
status: active
last_updated: 2026-05-06
applies_to: design-accelerator
related: [40_design_accelerator]
---

# Design Accelerator customer-zero observations — Arena Roja R1 plan review

Captured during a parallel Claude.ai architectural workflow session on 2026-05-06: 3519 E Arena Roja R1 (SCA Job #20260205-0052), Moab UT. Plan review response work using current-generation Claude.ai surfaced concrete limitations that Design Accelerator is being built to address. Treat this as customer-zero requirements input, not a feature wishlist.

## Engagement metadata

- Project: 3519 E Arena Roja_R1
- Address: 3519 Arena Roja E, Moab UT 84532
- SCA Job No.: 20260205-0052
- Review Date: April 23, 2026
- Review Authority: Shums Coda Associates on behalf of Grand County
- Codes: 2021 IBC/IRC, IPC, IMC, IFGC, IECC, IFC | 2023 NEC

## Limitations log (numbered as observed in source session)

### L1 — Cannot render interactive checkboxes
Comment-response checklist requested as interactive, persistable state. Plain markdown checkboxes were delivered; user had to externalize to Notion/Word/Google Docs/Excel for actual interactivity. **Fix priority: high** (workflow continuity gap).

### L2 — Cannot read sheet content or annotations
User uploaded revised Revit sheet PDFs and asked the assistant to compare against comment report. Assistant could only see structured snapshot metadata (sheet names, sheet count, level/room/wall counts). Could not read graphic content, annotation text, dimensions, callouts, schedules, legends, title block detail, revision clouds, PE stamps, or attached supporting docs (ICC-ES reports, Rescheck, structural calcs). When asked "can you compare them now," the only confirmable observation was that two new sheets had been added by name. **Fix priority: critical** (load-bearing for the entire compare-against-comments workflow).

### L3 — Cannot generate or export files
No DOCX, PDF, DWG, DXF, XLSX, or any other file format. User had to copy plain-text drafted content into their own letterhead template manually. **Fix priority: critical** (deliverable-shape gap; affects every output that has a recipient outside the chat).

### L4 — Cannot generate CAD or Revit content
Assistant could describe details with layer-by-layer precision, dimension callouts, scale specifications, and reference standard detail sources. User still had to draw everything manually in Revit. No Revit API push, no detail library pull, no DWG/DXF generation. **Fix priority: critical** (the single largest time-cost gap in the current workflow).

### L5 — Cannot verify live ICC-ES report numbers
Assistant recommended Tremco TREMproof 6100 XT for roof deck waterproofing, but couldn't verify ICC-ES Report number, current approval status, or scope. User had to manually confirm at icc-es.org before finalizing the note block. **Fix priority: high** (product-spec accuracy gap).

### L6 — Response truncation with no warning or auto-continuation
When asked to draft a complete response letter covering all 11 outstanding comments + closing + attachments, the response was truncated three times mid-document with no warning, no completion indicator, and no automatic continuation. User had to manually prompt "it looks like you got cut off" three additional times to receive complete content. The addendum documenting this limitation was itself truncated by the same limitation, demonstrating the issue self-referentially. **Fix priority: critical** (incompleteness in professional documents = AHJ resubmittal non-conformance risk = permit delay + additional review fees).

### L+ (file attachment / screenshot capability)
Separate from L2 (which is about reading attached content): the ability to attach files in the chat and paste screenshots. Worth distinguishing from L2 because the fix is different — L2 needs OCR/PDF parsing/Revit API, while L+ needs an input-UX capability. Flagged for clarification at DA scoping time.

## What worked well in current generation

Captured for completeness — the limitations above are not the whole picture:

- **Comment intake parsing.** Assistant accepted pasted SCA plan review comment report text and structured into discipline buckets, approved-vs-action-required split, code references per comment, suggested sheet targets per comment.
- **Action plan generation.** For each comment, produced specific actions, ready-to-place note block text, detail callout tables, cross-references to affected sheets.
- **Note block drafting at deliverable quality.** Tremco TREMproof 6100 XT note block with manufacturer specs, ICC-ES placeholder, AHJ submission requirement, field observation requirement — copy-paste ready.
- **Standard detail source recall.** AWI, WDMA, NFRC, manufacturer detail libraries referenced by name with pull-from-source guidance.

## Implications for Design Accelerator scoping

Mapping the limitations to product capabilities:

- L1 → in-product persistable interactive state (workflow / task management)
- L2 → sheet content rendering + annotation extraction + attached-document parsing (PDFs, structural calcs, ICC-ES reports). Most load-bearing for the comment-response workflow.
- L3 → native DOCX/PDF generation pipeline. Multi-target output from same source content.
- L4 → Revit API integration (push annotations + note blocks directly) + detail library integration (pull pre-drawn standard details from manufacturer/standards libraries) + DWG/DXF generation. The big one.
- L5 → live ICC-ES database integration (real-time ESR lookup with approval status + expiration).
- L6 → either output token limit increase for document-drafting workflows, or template-based assembly that decouples from token limits, or both.
- L+ → input UX (file attach, screenshot paste) — a Claude.ai platform concern as much as a Design Accelerator one; clarify at scoping.

## Source artifact

Original session export: 3519 E Arena Roja R1 plan review response workflow, Claude.ai architectural project, 2026-05-06. Pasted into the doc_repo planner session of same date. Verbatim limitation text in this doc may be lightly edited for repo conventions (header levels, frontmatter); substantive content unchanged.
