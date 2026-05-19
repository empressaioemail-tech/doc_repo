---
id: 2026-05-19_group_3_l4_detail_callout_spec_cc-agent-M
title: Session — hauska-mcp-server Group 3 L4 (detail-callout-spec MCP tools)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Lane B Group 3 Phase L4. Sync B(L4) fired (hauska-engine PR #12 `918f4eb` — `detail-callout-spec` atom shape, engine atoms package 0.4.0). Five MCP tools for the L4 surface — Revit detail callouts the Revit Connector pushes via APS Design Automation. PR open at [empressaioemail-tech/hauska-mcp-server#9](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/9). Single commit `37247e2`. Branched off `main` directly — PR #8 merged, no stack.

| Tool | Method | Legacy endpoint (MCP-first) |
|---|---|---|
| `cortex_detail_callout_spec_create` | POST | `/api/engagements/:id/detail-callout-specs` |
| `cortex_detail_callout_spec_update_push_state` | POST | `/api/detail-callout-specs/:id/push-state` |
| `cortex_detail_callout_spec_attach_aps_ref` | POST | `/api/detail-callout-specs/:id/aps-ref` |
| `cortex_detail_callout_spec_list` | GET | `/api/engagements/:id/detail-callout-specs` |
| `cortex_detail_callout_spec_get` | GET | `/api/detail-callout-specs/:id` |

Same MCP-first contract as L1-L3: legacy endpoints defined in `legacy-client.ts`, built to match by cc-agent-C in Lane C.4. Mocked-fetch testable now; e2e blocked on Lane C.4. The L4 section was appended to the endpoint contract doc [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md).

**Tests.** 136/136 pass (124 prior + 12 new in `tests/cortex-detail-callout-spec.test.ts`). `tsc --noEmit` clean.

## The discriminated-union design call

The dispatch flagged a conscious decision: the L4 `spec` is a discriminated union (door-schedule / wall-section / wall-type / room-finish), and there are three ways to surface it — one tool with a discriminated-union payload, one tool per detail type, or one tool with type-specific Zod refinement. The dispatch defaulted to "one tool, discriminated-union payload" unless that shape causes MCP-client tool-schema friction, with per-type tools as the documented fallback.

**Decision: one `create` tool, `detail_type` enum + opaque `spec` object passthrough.** The tool keeps `detail_type` as an explicit Zod enum (legible to the LLM) and takes the type-specific fields as a permissive `spec` object (`z.record(z.unknown())`). The `legacy-client.ts` merges `detail_type` into the wire `spec` (`{ detailType, ...spec }`); the legacy backend validates the assembled payload against the engine's `DETAIL_CALLOUT_SPEC_PAYLOAD_SCHEMA` discriminated union.

Why this over a true nested `z.discriminatedUnion` in the tool schema: a discriminated union as a tool-input property serializes to a nested `oneOf`/`anyOf` in the JSON Schema, and MCP-client support for nested `oneOf` in tool schemas is inconsistent — the exact friction the dispatch named. The opaque-payload approach sidesteps it entirely and is consistent with the `cortex_snapshot_register` precedent from Group 2 (which used the same opaque-payload pattern for a discriminated request body). The trade-off is that the LLM gets prose field lists in the tool description rather than a typed sub-schema; for four types with five-to-seven fields each that is workable, and the backend's Zod discriminated union remains the canonical validation surface (a malformed per-type spec is a 400). Per-type create tools stay available as a fallback if real cross-client testing (Group 4) surfaces a problem; build + typecheck were clean, so one tool stands for now.

`update_push_state` follows the L3 `send` pattern: the transition gate is server-side (the legacy backend runs the engine `isLegalPushTransition`), an illegal transition returns a 409 with `from`/`to`/`legalNextStates`, and the tool catches the 409 to surface the legal next states. The MCP server does not import `@hauska-engine/atoms` for the helper.

## What's still open

- **PR #9 (L4)** awaits operator review + squash-merge.
- **L1-L4 e2e** blocked on cc-agent-C Lane C.4 building the legacy routes against the contract doc.
- **L5-L6** — L5 (product-spec-reference) and L6 (deliverable-letter render) are the remaining Group 3 phases. L6 render was deliberately kept out of L3 per the dispatch; it lands when cc-agent-E ships the L6 atom-side shape.
- **Group 4** (cross-client verification) — gates on all L-surface PRs landing. The discriminated-union design call above is a specific thing to verify there: confirm the opaque-`spec` shape renders cleanly across MCP Inspector / Claude Desktop / Cursor.

## Suggested canonical doc updates

- [`00_current_state.md`](../00_current_state.md) §5 — prepend this session.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion — L4 `cortex_detail_callout_spec_*` tools landed (PR #9).

## Commit batch

- `hauska-mcp-server` `feat/group-3-l4-detail-callout-spec` `37247e2` → PR #9.
- `doc_repo` `main` — this session summary + the L4 section appended to the endpoint contract doc.

Sync points consumed: Sync B(L4).
