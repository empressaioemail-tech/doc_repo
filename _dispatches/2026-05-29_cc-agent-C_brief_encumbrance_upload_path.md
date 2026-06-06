---
id: 2026-05-29_cc-agent-C_brief_encumbrance_upload_path
title: Dispatch — Property Brief encumbrance upload path (R4)
date: 2026-05-29
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75c_property_brief_data_backlog, 49b_encumbrance_ingestion_pipeline, 2026-05-28_dispatch-A_ldt_place-graph-brief]
blocked_on: none — PR #134 merged 2026-05-29; use dedicated branch off main
---

# Property Brief — encumbrance upload path (R4)

You are **cc-agent-C** on `legacy-design-tools`.

**Backlog:** [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md) **PB-301**.

## Context

HOA/CC&R data is **Plane B**. Phase 1 is **customer upload** per [`49b_encumbrance_ingestion_pipeline.md`](../49b_encumbrance_ingestion_pipeline.md). Encumbrance API + atom contract v1.2 landed 2026-05-26 but were **excluded from PR #134** (see place-graph close note § Excluded).

## Tasks

1. **PR slice** — `encumbrances` routes + `EncumbrancesPanel` OR minimal **`POST /api/brokerage/v1/workspace/:id/encumbrances`** upload if brokerage-scoped is cleaner.
2. Link upload to **`property-workspace`** DID from `/brief` response (`atoms.workspaceDid`).
3. **Brief prompt:** when encumbrance atoms exist on workspace, include clause summaries in `formatSiteContextForLlm` / research chat (read-only).
4. **Extension hook** — document field for extension-agent: "Upload CC&Rs" CTA (UI can follow in separate dispatch).
5. Tests with fixture PDF; no county clerk scrape.

## Out of scope

- R1 county clerk ingest
- HOA management API (R3)
- Full ADR-021 resolver in brief

## Acceptance

- [ ] Upload PDF → `recorded-instrument` / `restriction-clause` atoms attached to workspace.
- [ ] Second `/brief` or research chat cites uploaded restriction when relevant.
- [ ] PR held for operator merge.

## Report back

`P:/doc_repo/_inbox/2026-05-29_legacy-design-tools_cc-agent-C_brief_encumbrance_upload_close.md`
