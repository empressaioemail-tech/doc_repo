---
id: 2026-05-19_group_3_l2_sheet_content_cc-agent-M
title: Session — hauska-mcp-server Group 3 L2 (sheet-content-extraction + attached-document MCP tools)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Lane B Group 3 Phase L2, immediately following L1 in the same work session. Sync B(L2) fired (hauska-engine PR #10 — `sheet-content-extraction` + `attached-document` coupled atoms, engine atoms package 0.2.0). Four MCP tools, PR open at [empressaioemail-tech/hauska-mcp-server#7](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/7). Single commit `164a554`.

| Tool | Method | Legacy endpoint (MCP-first) |
|---|---|---|
| `cortex_sheet_content_extraction_trigger` | POST | `/api/sheets/:id/content-extraction` |
| `cortex_sheet_content_extraction_fetch` | GET | `/api/sheets/:id/content-extraction` |
| `cortex_attached_document_list` | GET | `/api/engagements/:id/attached-documents` |
| `cortex_attached_document_fetch` | GET | `/api/attached-documents/:id` |

Same MCP-first contract pattern as L1: the legacy endpoints do not exist yet; `legacy-client.ts` defines them; cc-agent-C builds the matching routes in Lane C.4. Mocked-fetch testable now; e2e blocked on Lane C.4. The L2 section was appended to the endpoint contract doc [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md).

**Stacked PR.** L2 branched off the L1 branch because both share the `atom-shape.ts` `lSurfaceProvenance` + array-aware `codexEnvelope` foundation L1 added. PR #7's base is `feat/group-3-l1-response-task`; GitHub retargets it to `main` when PR #6 merges. Reviewer merges #6 then #7.

**Design decisions worth noting.**

`attached-document` has no create tool. The L2 atoms are coupled at the producer — the sheet-ingest pipeline emits both `sheet-content-extraction` and `attached-document` in one pass. So the MCP surface for `attached-document` is read-only (list + fetch); creation is a pipeline side-effect, not an agent action.

`fetchSheetContentExtraction` returns `{ sheetContentExtraction: null }` when the sheet has not been extracted yet — a normal empty result, distinct from a 404 (unknown sheet id). This mirrors the `codex_briefing_fetch` null-vs-404 distinction from Group 1.

Wire types (`BoundingBox`, `SheetTextSegment`, `SheetStructuredAnnotation`, the two atom instances) hand-mirrored from `@hauska-engine/atoms` — the same discipline as L1 and Stream 2A: engine workspace packages stay out of the mcp-server build graph.

**Tests.** 110/110 pass (99 from the L1 branch + 11 new in `tests/cortex-sheet-content.test.ts`: L2 legacy-client wire conformance, null-extraction result, 404 rethrow, bearer header, `lSurfaceProvenance` real-DID shape for both L2 atom types). `tsc --noEmit` clean.

## What's still open

- **PR #6 (L1) and PR #7 (L2)** await operator review + squash-merge. Merge #6 first (#7 stacks on it).
- **L1 + L2 e2e** blocked on cc-agent-C Lane C.4 building the response-task / sheet-content / attached-document routes against the contract doc.
- **L3-L6** — Sync B(L3) has fired (hauska-engine PR #11, deliverable-letter); L3 MCP tools are the next Group 3 phase. L4-L6 pending their Sync B fires.

## Suggested canonical doc updates

- [`00_current_state.md`](../00_current_state.md) §5 — the L1 + L2 sessions (this one and the L1 session) prepend together.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion — L1 (PR #6) and L2 (PR #7) `cortex_*` L-surface tools landed.

## Commit batch

- `hauska-mcp-server` `feat/group-3-l2-sheet-content` `164a554` → PR #7 (stacked on #6).
- `doc_repo` `main` — this session summary + the L2 section appended to the endpoint contract doc.

Sync points consumed: Sync B(L2). Sync B(L3) has fired and is available for the next session.
