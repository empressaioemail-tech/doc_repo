---
id: 2026-05-19_cc-agent-C_l_surface_ui
title: Dispatch — cc-agent-C legacy-design-tools (L1-L6 UI surfaces with MCP co-design)
date: 2026-05-19
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [_decisions/2026-05-19_sync_4_5_and_cortex_sprint, 42_design_accelerator_program_plan, 28_mcp_first_product_design, _dispatches/2026-05-19_cc-agent-E_l_surface_atom_shapes, _dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces, CLAUDE.md]
---

# Lane C.4 — cc-agent-C dispatch (L1-L6 UI surfaces with MCP co-design)

> **Activation update 2026-05-22.** This dispatch is fully unblocked and is cc-agent-C's next work, after the Codex Phase 2 reviewer surfaces (CDX-3/4/5, PRs #69/#70/#71) completed. Gate status, all clear:
> - Lane C.3 (the EngagementDetail split this dispatch hooks into) merged as legacy-design-tools PR #43. The per-section components exist on `main`.
> - All six L1-L6 atom shapes are locked at `@hauska-engine/atoms@0.6.0`; every per-surface Sync B has fired, so no surface is atom-blocked.
> - The Lane B MCP tool counterparts all shipped on `hauska-mcp-server` main (24 L-surface tools); `legacy-client.ts` is the final consumer-signature reference.
>
> Before starting: re-orient onto `main`, pull, and run `pnpm install` (PRs #65 and #67 changed dependencies; a pull without `pnpm install` fails typecheck on `@hauska/atom-contract`). Keep using explicit per-path `git add`: four stray pre-existing modified test files in this clone must stay out of your branches. The closing paragraph below about the C.6 cutover is stale: the Replit-to-Cloud-Run cutover already happened on 2026-05-20.

You are cc-agent-C continuing on the `legacy-design-tools` repo. Lane C.4 covers the L1-L6 **endpoints + UI surfaces** per `42_design_accelerator_program_plan.md` QA-readiness milestone definitions. Six surfaces; each gates on the matching Sync B (atom-shape lock) from Lane A.2 (cc-agent-E).

**Scope expanded per Amendment 6 (2026-05-19):** Lane C.4 per-surface work is endpoints + UI, NOT just UI. cc-agent-M's MCP tools call legacy-design-tools endpoints that **do not exist yet** — you build them. Canonical contract: [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md). The endpoints persist L1-L6 atoms in legacy-design-tools Postgres; cc-agent-M's MCP tools and your UI surfaces both consume the endpoints. Atom shape lives in `hauska-engine/packages/atoms/` (cc-agent-E's domain); runtime persistence lives in legacy-design-tools (your domain); both surfaces consume the contract.

The dual-interface principle applies to every surface: ship the UI consumer **co-designed with** the MCP tool counterpart from Lane B (cc-agent-M). UI shape and MCP tool shape consume the same atom AND the same endpoints; their consumer signatures should align so an operator can do the same action via UI or MCP without surprise. cc-agent-M's `legacy-client.ts` is the consumer-signature reference.

## Why this exists

L1-L6 are the customer-zero gaps named in `42` Phase 2 (DA-4 through DA-9). The operator's next QA cycle requires all six surfaces functional. Co-design with MCP per surface means the QA cycle exercises both interfaces.

The EngagementDetail split from Lane C.3 must land before this dispatch starts — the per-section components are where L-surface UI work hooks in.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint scope.
3. [`42_design_accelerator_program_plan.md`](../42_design_accelerator_program_plan.md) §QA readiness milestone (lines 62-73 for L1-L6 definitions; lines 113-152 for Phase 2 stream context).
4. [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) — dual-interface principle and Codex/Cortex tracked-retrofit confirmation.
5. cc-agent-E's atom-shape dispatch [`2026-05-19_cc-agent-E_l_surface_atom_shapes.md`](2026-05-19_cc-agent-E_l_surface_atom_shapes.md) — atoms you consume.
6. cc-agent-M's MCP tool dispatch [`2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](2026-05-19_cc-agent-M_mcp_tool_surfaces.md) — tool counterparts to co-design with.
7. Once cc-agent-E ships an atom-shape session summary per surface, read it before starting the matching UI surface.

## Scope

Six UI surfaces. Each shipped as its own PR. Sequence per Sync B fires from Lane A.2.

### C.4.1 — L1 response-task UI

**Atom from Lane A.2 Phase A.** Consumes `response-task` atom.

**Work.**

- Architect-side UI for response-task lifecycle: list per engagement, create-from-client-comment, update state (open / in-progress / done), link to source finding.
- Surface location: per L1 spec in `42`, "design-tools vs plan-review side at L1 dispatch time." Pick design-tools side (architect-facing); justify the choice in the PR description.
- Persistent state surviving session reload per the QA-readiness 8-point definition.
- Co-design with cc-agent-M's `cortex/response_task_*` MCP tools: consumer signatures (creating a response-task from a client comment) should match between UI and MCP.

**Test.** End-to-end: client comment arrives, architect creates response-task, marks it in-progress, completes it; reload session, state preserved; same flow via MCP tool produces equivalent atom.

### C.4.2 — L2 sheet-content-extraction + attached-document UI

**Atoms from Lane A.2 Phase B.** Consumes `sheet-content-extraction` + `attached-document` atoms.

**Work.**

- Plan-review side: sheet compare workflow now shows extracted content (text, annotations) alongside the sheet image.
- Attached-document panel: list of attached docs for the engagement; per-doc extracted text viewer.
- Co-design with `cortex/sheet_content_extraction_*` MCP tools.

**Test.** Upload sheet; verify extracted content surfaces in compare view; attach a supporting doc; verify it appears in the panel with extracted text.

### C.4.3 — L3 deliverable-letter UI

**Atom from Lane A.2 Phase C.** Consumes `deliverable-letter` atom.

**Work.**

- Deliverable letter draft view: structured sections (cover, intro, per-comment-response, signature) editable inline.
- Source-attribution view: per-section provenance links to findings, response-tasks, adjudications.
- Status transitions (draft → sent).
- Co-design with `cortex/deliverable_letter_*` MCP tools.

**Test.** Compose a letter, verify sections persist, verify provenance links resolve, verify status transition flows.

### C.4.4 — L4 detail-callout-spec UI

**Atom from Lane A.2 Phase D.** Consumes `detail-callout-spec` atom.

**Work.**

- Architect surface: list detail-callout specs per engagement, define new spec (detail type + content), trigger Revit push (via Revit Connector add-in or directly via APS Design Automation).
- Push-state visibility (pending, pushed, applied, rejected).
- Co-design with `cortex/detail_callout_spec_*` MCP tools.

**Test.** Define a spec, trigger push, verify push-state transitions; if Revit Connector available, verify content lands in Revit session.

### C.4.5 — L5 product-spec-reference UI

**Atom from Lane A.2 Phase E.** Consumes `product-spec-reference` atom.

**Work.**

- Architect surface: list product-spec references per engagement, add new reference, view current ESR status.
- Highlight ESR-withdrawn or ESR-expired references for review.
- Co-design with `cortex/product_spec_reference_*` MCP tools.

**Test.** Add a reference, verify ESR-status display, trigger a refresh, verify status update.

### C.4.6 — L6 deliverable-letter render UI

**Atom from Lane A.2 Phase F.** Consumes `deliverable-letter` atom (rendered).

**Work.**

- Render trigger in the L3 deliverable-letter UI: button to render as DOCX or PDF.
- Preview pane showing rendered output before final download.
- Download action.
- Co-design with `cortex/deliverable_letter_render` MCP tool.

**Test.** Compose letter at L3 UI, click render → DOCX, verify download, verify content matches the atom. Same for PDF.

## Test plan (cross-task)

Per task as noted. End-of-dispatch: full Cortex QA-readiness flow exercises all six surfaces in sequence on a single test engagement (e.g., Musgrave) per the 8-point definition in `42`. This is the operator's pre-cutover smoke-test surface.

## Dependencies

- **Gates this dispatch:** Lane C.3 (EngagementDetail split) closes — you consume the split components. Per-surface Sync B fires from Lane A.2 — each UI surface gates on its matching atom shape lock.
- **Co-designs with:** Lane B (cc-agent-M MCP tools per surface) — share consumer signatures, coordinate via planner if signature drift surfaces.
- **Parallel-safe with:** Lane A (after each Sync B has fired for the surface you're on; before that, that surface is blocked) and Lane C.2 (different code paths, but cutover gate at C.6 absorbs all C.4 work).

## Hand-off

Six PRs, one per surface. Session summary at close captures all six plus the end-of-dispatch QA-readiness flow result.

After C.4 closes, the cutover (C.6) is the next operator-led action per the Lane C.2 runbook. C.4 closure plus all of Lane A + Lane B closure is the pre-cutover green-light.
