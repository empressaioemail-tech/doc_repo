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

Backend pattern is locked to **Pattern A (engine)** for all six surfaces per the resolved Open Question §1: the atoms live in `hauska-engine/packages/atoms/` and the engine retrieval API serves their CRUD. Group 3 tools wrap the engine via `hauska-client.ts`.

| # | Surface | Atom(s) from A.2 | Expected MCP tools | Sync B status |
|---|---|---|---|---|
| L1 | response-task | `response-task` | `cortex_response_task_create`, `cortex_response_task_update_state`, `cortex_response_task_list`, `cortex_response_task_link_to_finding` | not fired (cc-agent-E working it now) |
| L2 | sheet-content-extraction + attached-document | `sheet-content-extraction`, `attached-document` | `cortex_sheet_content_extract` (trigger), `cortex_sheet_content_fetch` (read), `cortex_attached_document_list` (per engagement) | not fired |
| L3 | deliverable-letter | `deliverable-letter` | `cortex_deliverable_letter_draft`, `cortex_deliverable_letter_update`, `cortex_deliverable_letter_finalize` | not fired |
| L4 | detail-callout-spec | `detail-callout-spec` | `cortex_detail_callout_spec_define`, `cortex_detail_callout_spec_list`, `cortex_detail_callout_spec_mark_pushed` (APS Design Automation push is a downstream side-effect, not in scope for v1 MCP) | not fired |
| L5 | product-spec-reference | `product-spec-reference` | `cortex_product_spec_reference_add`, `cortex_product_spec_reference_refresh_esr`, `cortex_product_spec_reference_list` (ICC-ES upstream poll is a periodic backend job per cc-agent-E dispatch Phase E, not an MCP tool concern) | not fired |
| L6 | deliverable-letter render | (extends L3) | `cortex_deliverable_letter_render` (single tool returns DOCX or PDF blob ref) | not fired |

Tool counts will adjust during implementation per the dispatch's "Surface adjustments via Lane B session summary; planner ratifies before lock" clause. Naming is the conservative first cut; if a surface needs split tools or merged tools, surface the call.

## Open questions — RESOLVED by planner 2026-05-19

The three open questions below were answered by the planner in the Engine-PR-7-follow-up + Group-3-L1-prep dispatch (2026-05-19). Answers folded in here so the ready-state checklist is fully actionable when Sync B(L1) fires.

### 1. Where do L1-L6 atoms live at runtime? — RESOLVED: engine (Pattern A)

**Answer:** L1-L6 atoms live in `hauska-engine/packages/atoms/` per option β (already established). Group 3 wraps the **engine** for these atoms.

This means **Pattern A**: Group 3 tools consume the engine retrieval API via `hauska-client.ts`, not the legacy backend via `legacy-client.ts`. `response-task` and the other L-surface atoms are mutable (create, update state), so the engine retrieval API needs write/CRUD endpoints for them. Those endpoints land as part of cc-agent-E's Lane A.2 L-surface work; read cc-agent-E's Sync B(L1) session summary for the exact endpoint shapes before wiring the L1 tools.

Consequence for the codex/cortex provenance helper: L-surface atoms get real Hauska DIDs (`did:hauska:response-task:...`) from the engine, unlike the Codex/Cortex existing-product tools (Groups 1+2) which carry synthetic `legacy:<kind>:<id>` identifiers. The L-surface tools should use `provenanceFromAtom` (the real-DID path in `atom-shape.ts`), not `codexProvenance`.

### 2. UI consumer signatures co-design — RESOLVED

**Answer:** Align with cc-agent-C's Lane C.4 L1 work. The operator coordinates the handoff. Signature drift is surfaced to the planner before locking.

Practically: when Sync B(L1) fires, coordinate with cc-agent-C on the L1 response-task consumer signature so the UI action and the MCP tool action take the same shape. If the two drift, do not lock unilaterally — surface to the planner.

### 3. Engagement-scope vs tenant-scope — RESOLVED: tenant-scoped for v1

**Answer:** Tenant-scoped for v1 per ADR-007 (cross-stakeholder atom access). Engagement-level filtering is an **optional query param**, not a hard gate.

Practically: Group 3 tools enforce the tenant boundary (the `product='cortex'` key is scoped to its tenant per ADR-007); within that tenant, `engagement_id` is an optional filter parameter on list-style tools rather than a mandatory access gate. Read ADR-007 before wiring the L1 `list` tool to get the tenant-scope semantics right.

## Ready-state checklist (when Sync B(L1) fires)

When cc-agent-E publishes the L1 `response-task` atom-shape lock session summary (Sync B(L1) fires). Backend pattern is locked to **Pattern A** (engine) per the resolved Open Question §1.

- [ ] Read cc-agent-E's Sync B(L1) session summary — atom field list, conformance suite, the new engine retrieval-api endpoint shapes for response-task CRUD.
- [ ] Extend `hauska-client.ts` against the new engine retrieval-api endpoints (create / update-state / list / link-to-finding for `response-task`). Bearer auth via the existing `HAUSKA_ENGINE_API_KEY`.
- [ ] Use `provenanceFromAtom` for L-surface responses — these atoms carry real `did:hauska:response-task:...` DIDs from the engine, not the synthetic `legacy:` identifiers the Groups 1+2 tools use.
- [ ] Register the `cortex_response_task_*` tools in `tools.ts` behind the existing `requireProduct(tool, 'cortex')` gate. Tenant-scoped per ADR-007; `engagement_id` is an optional filter param on list-style tools.
- [ ] Coordinate the consumer signature with cc-agent-C's Lane C.4 L1 UI; surface drift to the planner before locking.
- [ ] Add tests in `tests/cortex-response-task.test.ts` (or `tests/cortex-l-surface.test.ts` covering all L# surfaces as they land).
- [ ] Update CHANGELOG + REPO_NOTES with the L1 entry.
- [ ] Commit + push + PR.
- [ ] Session summary at `_sessions/<date>_l1_response_task_mcp_cc-agent-M.md`.

Each subsequent surface (L2-L6) follows the same checklist with that surface's atom kind substituted. Atom-runtime location is engine (Pattern A) for all six.

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
- Backend client extensions. Surface-specific; wait for each Sync B fire, then extend `hauska-client.ts` (Pattern A — engine).

## Status (updated 2026-05-19, post Engine-PR-7-follow-up dispatch)

- Lane Foundation v1.1.0: ✓ shipped (cc-agent-AC).
- Lane A.1 (Sync 4.5 jurisdictions): ✓ closed at 3 of 4 (Bastrop UDC + Bastrop County + Elgin; Smithville deferred). hauska-engine `3c256b5`.
- Lane A.2 (L1-L6 atom shapes): in flight — cc-agent-E on the L1 `response-task` atom shape (branch `stream-1d/l-surface-l1-response-task`).
- Lane B Group 1 (Codex 4 tools): ✓ merged PR #2.
- Lane B Group 2 (Cortex 4 tools): ✓ merged PR #3.
- Lane B Group 5 (visibility filter): ✓ merged PR #4. Engine-side cleanup: hauska-engine PR #7 (`accessPolicies` query param) open; hauska-mcp-server follow-up branch `feat/list-jurisdictions-engine-filter` (`afedcdf`) pre-staged + pushed, PR held until PR #7 merges.
- Lane B Group 3 (L1-L6): not started; this note is the prep. Fires per Sync B per surface.
- Lane B Group 4 (cross-client verification): gates on Group 3 + L1-L6 lanes closing.
- Lane C.3 (EngagementDetail split): not tracked here.
- Lane C.4 (L-surface UI): per-surface, co-designed with Group 3.

Group 3 work will fire in six independent waves, one per surface, as Sync B fires from cc-agent-E. Each wave is small (~3-4 tools + tests + 1 PR). Total surface area: roughly 18-22 new MCP tools across the six surfaces.

## Workspace hygiene (planner directive 2026-05-19)

cc-agent-M owns the `hauska-mcp-server` clone exclusively. Cross-repo work touching `hauska-engine` goes through cc-agent-E or a separate clone/worktree — never the same working tree cc-agent-E is using. The 2026-05-19 race-condition incident (concurrent git operations in one hauska-engine clone; branch HEAD switching mid-commit) is the case this rule prevents. hauska-engine PR #7 was a cc-agent-M cross-repo PR; future engine-side changes route through cc-agent-E or an isolated worktree.
