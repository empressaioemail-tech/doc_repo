---
id: 2026-05-19_group_3_l1_response_task_cc-agent-M
title: Session — hauska-mcp-server Group 3 L1 (response-task MCP tools) + Group 5 engine-filter follow-up
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Two pieces this session, both from the 2026-05-19 Engine-PR-7-follow-up + Group-3-L1 dispatch.

### Task 1 — Group 5 engine-filter follow-up (PR #5)

hauska-engine PR #7 (`accessPolicies` query param on `GET /jurisdictions`) merged as `50dd726`. Shipped the pre-staged MCP-side follow-up: `list_jurisdictions` now passes `accessPolicies=public-free` to the engine for unauthenticated callers instead of filtering client-side. New exported helper `accessPoliciesForTier(tier)` in `tools.ts`; `hauska-client.ts` `listJurisdictions` gained an `accessPolicies` param encoded as a comma-separated query value. Behavior unchanged for callers; hidden jurisdictions no longer cross the wire. PR open at [empressaioemail-tech/hauska-mcp-server#5](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/5).

### Task 2 — Group 3 Phase L1: response-task MCP tools (PR #6)

Sync B(L1) fired (hauska-engine PR #9, `response-task` atom shape, engine atoms package 0.1.0). Shipped four MCP tools for the L1 response-task surface, PR open at [empressaioemail-tech/hauska-mcp-server#6](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/6). Single commit `f05f71a`.

| Tool | Method | Legacy endpoint (MCP-first) |
|---|---|---|
| `cortex_response_task_create` | POST | `/api/engagements/:id/response-tasks` |
| `cortex_response_task_update_state` | POST | `/api/response-tasks/:id/state` |
| `cortex_response_task_list` | GET | `/api/engagements/:id/response-tasks` |
| `cortex_response_task_link` | POST | `/api/response-tasks/:id/link-finding` |

**Backend resolution.** The planner answered cc-agent-M's open question: L1-L6 atoms wrap **legacy-design-tools**, MCP-first contract. The L1 endpoints above do not exist in legacy-design-tools yet. `legacy-client.ts` defines the contract; cc-agent-C builds the matching routes in Lane C.4; cc-agent-C's L1 UI consumes the same endpoints (dual-interface co-design). Tools are mocked-fetch testable now; e2e is blocked on Lane C.4 — the same blocking shape as Groups 1+2 (blocked on the Lane C bearer middleware). Canonical contract doc for cc-agent-C: [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md).

**Provenance.** L-surface atoms carry the full `BaseAtomInstance` contract (real `entityId`, `contentHash`, source adapter/url, fetched-at). So a new `lSurfaceProvenance` helper in `atom-shape.ts` builds real `did:hauska:<type>:<id>` DIDs — unlike the Groups 1+2 tools, which wrap legacy row shapes and use the synthetic `legacy:` identifier via `codexProvenance`. `codexEnvelope` was generalized to accept an array of provenance entries for list-style tools.

**Wire types.** `ResponseTaskAtomInstance` is hand-mirrored into `legacy-client.ts`, not imported — `@hauska-engine/atoms` is an engine workspace package, kept out of the mcp-server build graph (the same discipline as the Stream 2A wire-type mirroring).

**Tests.** 99/99 pass (86 prior + 13 new in `tests/cortex-response-task.test.ts`: L1 legacy-client wire conformance, 409 forbidden-transition rethrow, bearer header, the `lSurfaceProvenance` DID shape, the array-aware `codexEnvelope`). `tsc --noEmit` clean.

## What was learned

Two things worth carrying forward.

**The planner's "Pattern A (engine)" answer was a shape-location answer, not a runtime answer.** cc-agent-M's research note had folded "atoms live in `hauska-engine/packages/atoms/`" into "Group 3 wraps the engine retrieval API." But the engine retrieval API is a read-only catalog surface with `InMemoryStorage` — no write endpoints, no persistence. Verified before writing any code: the retrieval-api has seven routes, all read-only. The runtime home for engagement-scoped mutable atoms is legacy-design-tools (where engagements, Postgres, and the event-history infrastructure already live). The planner confirmed legacy-design-tools, MCP-first contract. Lesson: "where the atom shape lives" and "which HTTP API serves it at runtime" are two different questions; an atom-shape package is not a runtime service. The research note's resolved Open Question §1 has been corrected.

**MCP-first contract inverts the Groups 1+2 pattern.** Groups 1+2 wrapped *existing* legacy endpoints — `legacy-client.ts` mirrored what was already there. L1 (and L2-L6) wrap endpoints that *do not exist yet*: `legacy-client.ts` becomes the spec, and a contract doc in doc_repo is the artifact cc-agent-C implements against. This is the dual-interface co-design principle in practice. The MCP tool surface ships first (mocked-fetch tested), the legacy routes follow in Lane C.4, and the UI consumes the same contract. Signature drift surfaces to the planner before lock.

## What's still open

- **Task 1 (PR #5) and Task 2 (PR #6)** await operator review + squash-merge.
- **L1 e2e** blocked on cc-agent-C Lane C.4 building the response-task routes against the contract doc.
- **Group 3 L2** (sheet-content-extraction + attached-document) is next — Sync B(L2) already fired (hauska-engine PR #10). Same MCP-first pattern.
- **L3-L6** — Sync B(L3) has also fired (hauska-engine PR #11, deliverable-letter); L4-L6 pending.

## Suggested canonical doc updates

- [`00_current_state.md`](../00_current_state.md) §5 — prepend this session.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion — the L1 `cortex_response_task_*` tools landed (PR #6); note the MCP-first contract pattern and the contract doc pointer for cc-agent-C.

## Commit batch

- `hauska-mcp-server` `feat/list-jurisdictions-engine-filter` `afedcdf` → PR #5.
- `hauska-mcp-server` `feat/group-3-l1-response-task` `f05f71a` → PR #6.
- `doc_repo` `main` — this session summary + the L-surface endpoint contract doc.

Sync points consumed: Sync B(L1). Sync B(L2) and Sync B(L3) have fired and are available for the next session.
