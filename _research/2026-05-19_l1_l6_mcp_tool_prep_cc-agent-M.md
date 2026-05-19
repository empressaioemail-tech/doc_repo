---
id: 2026-05-19_l1_l6_mcp_tool_prep_cc-agent-M
title: Research — Lane B Group 3 (L1-L6 MCP tool surfaces) prep
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: research
rolled_up: false
related: [_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces, _dispatches/2026-05-19_cc-agent-E_l_surface_atom_shapes, _dispatches/2026-05-19_cc-agent-C_l_surface_ui]
---

## Purpose

Capture everything I learned scoping Group 3 (L1-L6 surface tools) before Sync B fires. When cc-agent-E ships the first atom-shape lock, this note lets me move from atom shape → MCP tool registration in one focused pass per surface.

Group 3 gates per Sync B per surface from Lane A.2. Lane A.2 has not started; cc-agent-E is currently on Lane A.1 (Sync 4.5 jurisdictions). Lane Foundation v1.1.0 is done. Lane B Groups 1, 2, 5 are merged. Nothing in Group 3 can land code-side until each surface's Sync B fires.

## Per-surface table

Each surface gets multiple tools per Lane B dispatch line items B.1.1 through B.1.6. Naming locks to underscore-style per the PR #2 / PR #3 convention (`cortex_<surface>_<verb>`), not the slash-style the dispatch suggests. Auth: `product='cortex'` gate (already in place from PR #3).

| # | Surface | Atom(s) from A.2 | Expected MCP tools | Backend pattern | Sync B status |
|---|---|---|---|---|---|
| L1 | response-task | `response-task` | `cortex_response_task_create`, `cortex_response_task_update_state`, `cortex_response_task_list`, `cortex_response_task_link_to_finding` | TBD — see Open Questions §1 | not fired |
| L2 | sheet-content-extraction + attached-document | `sheet-content-extraction`, `attached-document` | `cortex_sheet_content_extract` (trigger), `cortex_sheet_content_fetch` (read), `cortex_attached_document_list` (per engagement) | TBD | not fired |
| L3 | deliverable-letter | `deliverable-letter` | `cortex_deliverable_letter_draft`, `cortex_deliverable_letter_update`, `cortex_deliverable_letter_finalize` | TBD | not fired |
| L4 | detail-callout-spec | `detail-callout-spec` | `cortex_detail_callout_spec_define`, `cortex_detail_callout_spec_list`, `cortex_detail_callout_spec_mark_pushed` | TBD; APS Design Automation push is a downstream side-effect, not in scope for v1 MCP | not fired |
| L5 | product-spec-reference | `product-spec-reference` | `cortex_product_spec_reference_add`, `cortex_product_spec_reference_refresh_esr`, `cortex_product_spec_reference_list` | TBD; ICC-ES upstream poll is a periodic backend job per cc-agent-E dispatch Phase E, not an MCP tool concern | not fired |
| L6 | deliverable-letter render | (extends L3) | `cortex_deliverable_letter_render` (single tool returns DOCX or PDF blob ref) | TBD | not fired |

Tool counts will adjust during implementation per the dispatch's "Surface adjustments via Lane B session summary; planner ratifies before lock" clause. Naming is the conservative first cut; if a surface needs split tools or merged tools, surface the call.

## Open questions for planner

These need answers before Group 3 tools wire cleanly; not before Sync B fires (they can be parallel-asked).

### 1. Where do L1-L6 atoms live at runtime?

The dispatches are clear that atom SHAPES live in `hauska-engine/packages/atoms/` per option β. But the data — instances of `response-task`, `deliverable-letter`, etc. — is engagement-specific, tenant-private (per ADR-017 `accessPolicy: 'tenant-private'`), and currently lives in `legacy-design-tools` Postgres.

Three possible patterns for Group 3:

- **Pattern A — engine retrieval API grows endpoints.** The engine retrieval API today serves Layer 1 catalog reads; Lane A.2 implicitly extends it for L1-L6 CRUD. Group 3 wraps the engine via the existing `hauska-client.ts`.
- **Pattern B — legacy-design-tools grows endpoints.** cc-agent-C in Lane C.4 builds new UI surfaces that need new API routes; the atoms live in legacy Postgres at runtime. Group 3 wraps legacy via the existing `legacy-client.ts`.
- **Pattern C — hybrid.** Catalog-shape reads (e.g., list response-tasks per engagement) hit the engine retrieval API; tenant-private mutations (create, update) hit legacy.

Pattern B is the conservative bet based on existing structure (engagements live in legacy today; ECI atomization Phase 1+2 is queued, not in flight). Pattern A would require Lane A.2 to fold in retrieval-API endpoints, which isn't named in cc-agent-E's atom-shape dispatch — that dispatch is shapes-only.

**Recommend:** ask the planner when Sync B(L1) fires. The right answer is likely Pattern B with the option to migrate to A or C in a later sprint.

### 2. UI consumer signatures co-design

Per the Lane C.4 dispatch: "UI shape and MCP tool shape consume the same atom; their consumer signatures should align so an operator can do the same action via UI or MCP without surprise."

In practice this means: when cc-agent-C ships an L1 UI mutation (e.g., "create response-task from client comment"), the MCP tool's input shape should mirror what the UI sends to its backend. Coordinate per surface:

1. cc-agent-E ships Sync B(L#) — atom shape locked.
2. cc-agent-C starts Lane C.4 UI for L# — defines the API contract.
3. cc-agent-M (me) waits for cc-agent-C to settle the API contract OR proposes the MCP tool shape and lets cc-agent-C mirror.

The race depends on who moves first per surface. If I propose first, cc-agent-C's UI mirrors. If they propose first, my tool mirrors. **Recommend coordinating per-surface; surface drift via planner.**

### 3. Engagement-scope vs tenant-scope on MCP tools

All L1-L6 atoms are engagement-scoped. Every Group 3 tool's primary input is `engagement_id` (or an engagement-resolvable identifier like `finding_id`).

Today's product gate (`product='cortex'` required) doesn't enforce engagement-level access — a cortex-product key has access to all engagements served by the legacy backend it's pointing at. That's likely the right v1 shape (operator-team keys, single tenant) but worth flagging before public Cortex MCP signups.

**Recommend:** v1 ships engagement-id pass-through with no tenant enforcement at the MCP layer; backend audience guards (`requireArchitectAudience`) handle tenant boundaries. Stricter tenancy gating is a separate sprint, dependent on ADR-009 firm-tenancy work.

## Ready-state checklist (when Sync B(L1) fires)

When cc-agent-E publishes the L1 `response-task` atom-shape lock session summary:

- [ ] Read cc-agent-E's session summary — atom field list, conformance suite, decisions made.
- [ ] Resolve Open Question §1 with planner — which backend pattern (A / B / C).
- [ ] If Pattern B: check legacy-design-tools for new `/api/engagements/:id/response-tasks` (or equivalent) routes shipped in cc-agent-C's Lane C.4 work; mirror types in `legacy-client.ts`.
- [ ] If Pattern A: extend `hauska-client.ts` against new engine retrieval-api endpoints.
- [ ] Add `response-task` atom kind to the `codexProvenance` `atomKind` union (currently has `submission`, `finding-generation-run`, `finding-override`, `parcel-briefing`).
- [ ] Register four `cortex_response_task_*` tools in `tools.ts` mirroring the Codex/Cortex tool pattern from PR #2 / PR #3.
- [ ] Add tests in `tests/cortex-response-task.test.ts` (or `tests/cortex-l-surface.test.ts` covering all L# surfaces as they land).
- [ ] Update CHANGELOG + REPO_NOTES with L1 entry.
- [ ] Commit + push + PR.
- [ ] Session summary at `_sessions/<date>_l1_response_task_mcp_cc-agent-M.md`.

Each subsequent surface (L2-L6) follows the same checklist with that surface's atom kind substituted.

## Pattern already in place from Groups 1 + 2

These are settled and DO NOT need re-deciding per surface:

- **Naming:** `cortex_<surface>_<verb>` underscore-style.
- **Product gate:** `requireProduct(tool, 'cortex')` at handler entry.
- **Tool envelope:** `codexEnvelope(data, provenance, { tier })` from `src/atom-shape.ts`.
- **Provenance:** `codexProvenance({ atomKind, rowId, jurisdictionTenant: 'legacy', sourcePath })`. Add new `atomKind` union values per surface.
- **Auth on backend client:** bearer (`LEGACY_BACKEND_API_KEY`) unless the surface uses an existing service-token path (none of L1-L6 do today; all bearer).
- **Cross-repo gap:** Lane C bearer middleware on legacy-design-tools is still pending. L1-L6 tools are mocked-fetch testable today; e2e blocked on Lane C.

## Things I am NOT prepping

- Skeleton code in `hauska-mcp-server`. Tool definitions are small and per-surface; scaffolding without atom shapes is just commented-out code that rots.
- Tests against hypothetical schemas. Same problem.
- Backend client extensions to `legacy-client.ts`. Surface-specific; wait for each Sync B fire.

## Status

- Lane Foundation v1.1.0: ✓ shipped (cc-agent-AC).
- Lane A.1 (Sync 4.5 jurisdictions): in flight (cc-agent-E).
- Lane A.2 (L1-L6 atom shapes): not started; gates on A.1 close per the dispatch.
- Lane B Group 1 (Codex 4 tools): ✓ merged PR #2.
- Lane B Group 2 (Cortex 4 tools): ✓ merged PR #3.
- Lane B Group 5 (visibility filter): ✓ merged PR #4.
- Lane B Group 3 (L1-L6): not started; this note is the prep.
- Lane B Group 4 (cross-client verification): gates on Group 3 + L1-L6 lanes closing.
- Lane C.3 (EngagementDetail split): not tracked here.
- Lane C.4 (L-surface UI): not started; gates on C.3 close + per-surface Sync B fire.

Group 3 work will fire in six independent waves, one per surface, as Sync B fires from cc-agent-E. Each wave is small (~3-4 tools + tests + 1 PR). Total surface area: roughly 18-22 new MCP tools across the six surfaces.
