---
id: 2026-05-19_group_3_l3_deliverable_letter_cc-agent-M
title: Session — hauska-mcp-server Group 3 L3 (deliverable-letter MCP tools)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Lane B Group 3 Phase L3. Sync B(L3) fired (hauska-engine PR #11 `99d4f5f` — `deliverable-letter` atom shape, engine atoms package 0.3.0). Five MCP tools for the L3 deliverable-letter surface, PR open at [empressaioemail-tech/hauska-mcp-server#8](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/8). Single commit `86a95ba`. Branched off `main` directly — PRs #5/#6/#7 all merged, so no stack.

| Tool | Method | Legacy endpoint (MCP-first) |
|---|---|---|
| `cortex_deliverable_letter_create` | POST | `/api/engagements/:id/deliverable-letters` |
| `cortex_deliverable_letter_update_section` | POST | `/api/deliverable-letters/:id/sections` |
| `cortex_deliverable_letter_attach_provenance` | POST | `/api/deliverable-letters/:id/sections/:idx/provenance` |
| `cortex_deliverable_letter_completeness_check` | GET | `/api/deliverable-letters/:id/completeness` |
| `cortex_deliverable_letter_send` | POST | `/api/deliverable-letters/:id/send` |

Same MCP-first contract pattern as L1/L2: the legacy endpoints do not exist yet; `legacy-client.ts` defines them; cc-agent-C builds the matching routes in Lane C.4. Mocked-fetch testable now; e2e blocked on Lane C.4. The L3 section was appended to the endpoint contract doc [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md).

**Tests.** 124/124 pass (112 prior + 12 new in `tests/cortex-deliverable-letter.test.ts`). `tsc --noEmit` clean.

## Design decisions worth noting

**Section addressing by index.** The `deliverable-letter` atom's `sections` is an ordered `LetterSection[]` with no per-section id field. There can be multiple `per-comment-response` sections, so `kind` alone does not identify a section. `cortex_deliverable_letter_update_section` and `cortex_deliverable_letter_attach_provenance` therefore target a section by its zero-based array index. `update_section` is an upsert: index `< length` replaces that section's `kind`/`heading`/`content` while preserving its `provenance`; index `== length` appends a new section. This gives "add section" and "edit section" one tool. The index approach is fragile under reordering, but the atom shape offers no per-section identity and v1 has no reorder operation; flagged in the contract doc for cc-agent-C.

**Completeness gate is server-side.** `cortex_deliverable_letter_send` does not pre-check completeness client-side — a client-side gate is bypassable. The legacy `send` endpoint runs the engine `deliverableLetterCompleteness()` helper and rejects an incomplete letter (missing cover / intro / signature) with a 409 carrying the missing section kinds. The `send` tool catches that 409 specifically and surfaces a clear message naming the missing sections plus the remedy (add them with `update_section`, retry). `completeness_check` is the explicit non-mutating pre-check; it returns `{ complete, missing }` — a derived result, not an atom, so its envelope carries no provenance entry.

**Completeness helper stays server-side.** The engine ships `deliverableLetterCompleteness()` in `@hauska-engine/atoms`. The MCP server does not import that package (the hand-mirror discipline from Stream 2A onward). So the completeness check is a backend endpoint, not an MCP-server-side computation — the legacy backend, which does consume the atom package, runs the helper. This keeps one source of truth for the completeness rule.

**L6 render kept separate.** Per the dispatch, `cortex_deliverable_letter_render` (L6) was deliberately not folded into L3 — render is its own concern and lands with cc-agent-E's L6 atom-side work.

## What's still open

- **PR #8 (L3)** awaits operator review + squash-merge.
- **L1+L2+L3 e2e** blocked on cc-agent-C Lane C.4 building the legacy routes against the contract doc.
- **L4-L6** — cc-agent-E has been ahead of Lane B on atom shapes; L4 (detail-callout-spec) is the next Group 3 phase once its Sync B is confirmed. L6 (deliverable-letter render) folds in when cc-agent-E ships the L6 atom-side shape.

## Suggested canonical doc updates

- [`00_current_state.md`](../00_current_state.md) §5 — prepend this session.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion — L3 `cortex_deliverable_letter_*` tools landed (PR #8).

## Commit batch

- `hauska-mcp-server` `feat/group-3-l3-deliverable-letter` `86a95ba` → PR #8.
- `doc_repo` `main` — this session summary + the L3 section appended to the endpoint contract doc.

Sync points consumed: Sync B(L3).
