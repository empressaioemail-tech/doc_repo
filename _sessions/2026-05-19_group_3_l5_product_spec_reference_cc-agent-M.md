---
id: 2026-05-19_group_3_l5_product_spec_reference_cc-agent-M
title: Session — hauska-mcp-server Group 3 L5 (product-spec-reference MCP tools)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Lane B Group 3 Phase L5. Sync B(L5) fired (hauska-engine PR #13 `b030570` — `product-spec-reference` atom shape, engine atoms package 0.5.0). Four MCP tools for the L5 surface — ICC-ES-evaluated products with live evaluation status. PR open at [empressaioemail-tech/hauska-mcp-server#10](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/10). Single commit `ad286e0`. Branched off `main` directly — PR #9 merged, no stack.

| Tool | Method | Legacy endpoint (MCP-first) |
|---|---|---|
| `cortex_product_spec_reference_create` | POST | `/api/engagements/:id/product-spec-references` |
| `cortex_product_spec_reference_refresh_status` | POST | `/api/product-spec-references/:id/refresh` |
| `cortex_product_spec_reference_list` | GET | `/api/engagements/:id/product-spec-references` |
| `cortex_product_spec_reference_get` | GET | `/api/product-spec-references/:id` |

Same MCP-first contract as L1-L4: legacy endpoints defined in `legacy-client.ts`, built to match by cc-agent-C in Lane C.4. Mocked-fetch testable now; e2e blocked on Lane C.4. The L5 section was appended to the endpoint contract doc [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md).

**Tests.** 146/146 pass (136 prior + 11 new in `tests/cortex-product-spec-reference.test.ts`, including a guard test for the `ESR-<digits>` number format). `tsc --noEmit` clean.

## Design call — refresh polling semantics

The dispatch flagged a conscious choice for `refresh_status`: synchronous (block on the ICC-ES fetch, latency exposed) versus fire-and-forget (async, separate poll lifecycle). **Decision: synchronous**, per the dispatch default. The `refresh_status` tool POSTs to the legacy backend and blocks until the backend completes its ICC-ES re-poll; the refreshed `status` and any new `statusHistory` entry come back in the response. The ICC-ES listing is HTML-scrapable and typically fast, so a 5-10s backend timeout keeps the round-trip bounded; the MCP-server-to-legacy default 30s timeout comfortably covers it.

The periodic *background* re-poll of ICC-ES is a separate legacy-side runtime concern — out of MCP-tool scope per sprint Amendment 6. The `refresh_status` tool is the manual trigger only. This keeps the MCP surface a thin RPC wrapper and leaves the scheduling/cron concern where it belongs.

`create` takes a structured product identity (`product_name` + `manufacturer` — the atom's `ProductIdentifier`, never free-text) and a Zod-validated `ESR-<digits>` number, so a malformed ESR number is rejected at the tool boundary before the backend round-trip. `list` supports an optional `status` filter (`active`/`withdrawn`/`expired`) — filtering to `withdrawn` or `expired` is the surface for finding product references that need review.

## What's still open

- **PR #10 (L5)** awaits operator review + squash-merge.
- **L1-L5 e2e** blocked on cc-agent-C Lane C.4 building the legacy routes against the contract doc.
- **L6** — the last Group 3 phase. Per the planner's heads-up, the L6 render output is itself an atom (`deliverable-letter-render`); `cortex_deliverable_letter_render` will produce that atom and return the blob ref. cc-agent-E ships the L6 atom shape; the L6 MCP dispatch comes after Sync B(L6) fires.
- **Group 4** (cross-client verification) — gates on all L-surface PRs landing.

## Suggested canonical doc updates

- [`00_current_state.md`](../00_current_state.md) §5 — prepend this session.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion — L5 `cortex_product_spec_reference_*` tools landed (PR #10).

## Commit batch

- `hauska-mcp-server` `feat/group-3-l5-product-spec-reference` `ad286e0` → PR #10.
- `doc_repo` `main` — this session summary + the L5 section appended to the endpoint contract doc.

Sync points consumed: Sync B(L5). Group 3 is five of six surfaces shipped (L1-L5); L6 remains.
