---
id: 2026-05-19_group_3_l6_deliverable_letter_render_cc-agent-M
title: Session — hauska-mcp-server Group 3 L6 (deliverable-letter render) + Group 3 close-out
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Lane B Group 3 Phase L6 — the last L-surface phase. **Group 3 is complete.** Sync B(L6) fired (hauska-engine PR #14 `7ed915c` — `deliverable-letter-render` atom shape, engine atoms package 0.6.0). Two MCP tools, PR open at [empressaioemail-tech/hauska-mcp-server#11](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/11). Single commit `0c2c34f`. Branched off `main` directly — PR #10 merged, no stack.

| Tool | Method | Legacy endpoint (MCP-first) |
|---|---|---|
| `cortex_deliverable_letter_render` | POST | `/api/deliverable-letters/:id/renders` |
| `cortex_deliverable_letter_renders_list` | GET | `/api/deliverable-letters/:id/renders` |

`render` produces a first-class `deliverable-letter-render` atom (DOCX / PDF) plus a download URL. `renders_list` returns a letter's renders newest-first (a letter is one-to-many with its renders). Same MCP-first contract as L1-L5; the L6 section was appended to the endpoint contract doc, which is now marked **GROUP 3 COMPLETE** in its frontmatter and header.

**Tests.** 154/154 pass (146 prior + 9 new in `tests/cortex-deliverable-letter-render.test.ts`). `tsc --noEmit` clean.

## Design calls

**Synchronous render.** Per the dispatch default — the `render` tool blocks until generation completes and returns the atom plus download URL. Matches the L3 `send` pattern; the v1 latency budget is acceptable. If render times routinely exceed ~30s during Lane C.4 integration, the documented follow-on is an async poll shape (tool returns an in-progress atom, client polls). Flagged in the contract doc.

**Completeness gate.** `render` is gated server-side on completeness (the engine `deliverableLetterCompleteness` helper) — rendering an incomplete letter would produce a confusing partial document. An incomplete letter returns a 409; the tool catches it and surfaces the missing sections, the identical shape as `cortex_deliverable_letter_send`.

**Atom-shape casing correction.** The dispatch named the render format `DOCX | PDF`; the actual engine atom (`RenderFormat`) uses lowercase `docx | pdf` to match the package's kebab-case enum convention. The MCP tool's `format` enum follows the atom shape — lowercase. The atom shape is the canonical source; dispatch prose is corrected against it. This is the same kind of dispatch-vs-codebase reconciliation noted in the Group 1 `codex_snapshot_ingest` naming adjustment.

## Group 3 complete — all six L-surface MCP tool sets live

| Surface | Tools | PR |
|---|---|---|
| L1 response-task | `cortex_response_task_*` (4) | #6 merged |
| L2 sheet-content-extraction + attached-document | `cortex_sheet_content_extraction_*` + `cortex_attached_document_*` (4) | #7 merged |
| L3 deliverable-letter | `cortex_deliverable_letter_*` (5) | #8 merged |
| L4 detail-callout-spec | `cortex_detail_callout_spec_*` (5) | #9 merged |
| L5 product-spec-reference | `cortex_product_spec_reference_*` (4) | #10 merged |
| L6 deliverable-letter render | `cortex_deliverable_letter_render` + `_renders_list` (2) | #11 open |

24 L-surface MCP tools across the six phases, plus the Group 1 Codex (4) and Group 2 Cortex (4) existing-product tools and the 5 public catalog tools. The full hauska-mcp-server tool surface for the 2026-05-19 sprint is in place once PR #11 merges.

Every L-surface tool follows one pattern: MCP-first contract (the legacy endpoint defined in `legacy-client.ts`, built to match by cc-agent-C in Lane C.4), `product='cortex'` gate, `lSurfaceProvenance` real-DID provenance, mocked-fetch tested, e2e blocked on Lane C.4. The canonical endpoint contract for all six surfaces lives at [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md), now marked complete.

## What's still open

- **PR #11 (L6)** awaits operator review + squash-merge. On merge, Group 3 closes entirely.
- **L1-L6 e2e** blocked on cc-agent-C Lane C.4 building the legacy routes against the contract doc. cc-agent-C is sequenced behind Lane C.2 (Replit decouple) + Lane C.3 (EngagementDetail split).
- **Group 4 — cross-client verification.** The sprint-end QA gate: run the MCP tool surface through MCP Inspector + Claude Desktop + Cursor against a real legacy backend. Group 4 cannot run until Lane C.4 backend endpoints + UI exist. Specific things to verify there, carried from the L-surface design calls: the L4 opaque-`spec` discriminated-union shape renders cleanly across clients; the synchronous L5 refresh + L6 render latency is within client timeout budgets.
- **cc-agent-M Lane B transitions to steady-state** until Group 4 fires.

## Suggested canonical doc updates

- [`00_current_state.md`](../00_current_state.md) §5 — prepend this session; §6 watch list — note Group 3 complete (all 6 L-surface MCP tool sets shipped), Lane B now steady-state pending Group 4.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion — mark the L1-L6 `cortex_*` L-surface tools complete (PRs #6-#11).

## Commit batch

- `hauska-mcp-server` `feat/group-3-l6-deliverable-letter-render` `0c2c34f` → PR #11.
- `doc_repo` `main` — this session summary + the L6 section appended to the endpoint contract doc (marked Group 3 complete).

Sync points consumed: Sync B(L6). All six Sync B fires (L1-L6) are now consumed. Group 3 closed.
